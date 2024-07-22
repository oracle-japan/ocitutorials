---
title: "Slurmによるリソース管理・ジョブ管理システム運用Tips"
excerpt: "オープンソースのSlurmは、HPC/GPUクラスのリソース管理・ジョブ管理をコストパフォーマンス良く運用するためのジョブスケジューラとして、現在有力な選択肢です。本テクニカルTipsは、OCI上に構築するHPC/GPUクラスタのリソース管理・ジョブ管理をSlurmで効果的に運用するための様々なテクニカルTipsをご紹介します。"
order: "355"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

本テクニカルTipsは、OCI上に構築するHPC/GPUクラスタのリソース管理・ジョブ管理を **[Slurm](https://slurm.schedmd.com/)** で効果的に運用する際に有益な、以下のテクニカルTipsを解説します。

1. **[Prolog/Epilog](https://slurm.schedmd.com/prolog_epilog.html)** セットアップ方法

***
# 1. Prolog/Epilogセットアップ方法

## 1-0. 概要

本Tipsは、ジョブ実行の前後で **Slurm** が自動的にスクリプトを実行する機能であるProlog/Epilogを、予め **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** に従って構築された **Slurm** 環境にセットアップする方法を解説します。

ここでは、PrologとEpilogで以下の処理を適用することを想定し、そのセットアップ方法を解説します。

- Prolog  
以下のスクリプトを使用し、直前に走っていたジョブの残したLinuxカーネルのキャシュをジョブ実行前に開放します。

```sh
#!/bin/bash

log_file=/var/log/slurm/clean_memory.log

/bin/date >> $log_file
/bin/echo "Before" >> $log_file
/bin/free -h >> $log_file

/bin/sync; /bin/echo 3 > /proc/sys/vm/drop_caches

/bin/echo >> $log_file
/bin/echo "After" >> $log_file
/bin/free -h >> $log_file
```

- Epilog  
以下のスクリプトを使用し、完了したジョブがNVMe SSDローカルディスク領域のファイルシステム（マウントポイント  **/mnt/localdisk** ）に残したファイルをジョブ完了直後に削除します。

```sh
#!/bin/bash
/bin/rm -rf /mnt/localdisk/*
```

## 1-1. セットアップ手順

Slurmサーバと全ての計算ノードの **/opt/slurm/etc/slurm.conf** に以下の記述を追加します。

```sh
PrologFlags=Alloc
Prolog=/opt/slurm/etc/scripts/prolog.d/*
Epilog=/opt/slurm/etc/scripts/epilog.d/*
```

次に、全ての計算ノードのopcユーザで以下コマンドを実行し、Prolog/Epilogのスクリプトを格納するディレクトリを作成します。

```sh
$ sudo mkdir -p /opt/slurm/etc/scripts/prolog.d
$ sudo mkdir -p /opt/slurm/etc/scripts/epilog.d
```

次に、全ての計算ノードで、 **[1-0. 概要](#1-0-概要)** に記載のProlog/Epilog用スクリプトをそれぞれ **10_clean_memory.sh** と **10_clean_nvme.sh** として先に作成したディレクトリに格納し、以下のようにスクリプトファイルのオーナーとパーミッションを設定します。

```sh
$ ls -l /opt/slurm/etc/scripts/*/
/opt/slurm/etc/scripts/epilog.d/:
total 4
-rwxr-xr-x 1 root root 50 Jul 12 17:12 10_clean_nvme.sh

/opt/slurm/etc/scripts/prolog.d/:
total 4
-rwxr-xr-x 1 root root 271 Jul 17 11:43 10_clean_memory.sh
$
```

なお、このディレクトリに2桁数字の接頭辞を持つスクリプトを複数格納することで、その数字の順番にスクリプトを実行することが出来ます。

次に、Slurmサーバのopcユーザで以下のコマンドを実行し、 **slurm.conf** ファイルの変更を反映、その結果を確認します。

```sh
$ sudo su - slurm -c "scontrol reconfigure"
$ sudo su - slurm -c "scontrol show config" | grep -i -e ^epilog -e ^prolog | grep -v -i time
Epilog[0]               = /opt/slurm/etc/scripts/epilog.d/*
Prolog[0]               = /opt/slurm/etc/scripts/prolog.d/*
PrologFlags             = Alloc
$
```

## 1-2. 稼働確認

以下コマンドを全ての計算ノードのopcユーザで実行し、テスト用のファイルを **/mnt/localdisk** ディレクトリに作成します。

```sh
$ sudo touch /mnt/localdisk/test.txt
```

次に、以下コマンドをSlurmクライアントのopcユーザで実行し、テストジョブを実行します。

```sh
$ srun -n 2 -N 2 hostname
inst-xxxxx-x9-ol89
inst-yyyyy-x9-ol89
$
```

次に、以下コマンドを全ての計算ノードのopcユーザで実行し、先に作成したテスト用のファイルが削除されていること、Linuxカーネルのキャッシュを開放した際のログが記録されていることで、想定通りにProlog/Epilogのスクリプトが実行されたことを確認します。

```sh
$ ls /mnt/localdisk/
$ tail /var/log/slurm/clean_memory.log
Wed Jul 17 16:53:14 JST 2024
Before
              total        used        free      shared  buff/cache   available
Mem:          503Gi       6.3Gi       494Gi        29Mi       2.0Gi       493Gi
Swap:         7.6Gi          0B       7.6Gi

After
              total        used        free      shared  buff/cache   available
Mem:          503Gi       6.3Gi       496Gi        29Mi       353Mi       494Gi
Swap:         7.6Gi          0B       7.6Gi
$
```