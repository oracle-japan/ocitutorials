---
title: "Slurmによるリソース管理・ジョブ管理システム運用Tips"
excerpt: "オープンソースのSlurmは、HPC/GPUクラスタのリソース管理・ジョブ管理をコストパフォーマンス良く運用するためのジョブスケジューラとして、現在有力な選択肢です。本テクニカルTipsは、構築するHPC/GPUクラスタのリソース管理・ジョブ管理をSlurmで効果的に運用するための様々なテクニカルTipsをご紹介します。"
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
2. メンテナンスを考慮した計算/GPUノードの **[ステータス](https://slurm.schedmd.com/scontrol.html#OPT_State_2)** 変更方法
3. ヘテロジニアス環境下のパーティションを使った計算/GPUノード割り当て制御
4. 複数ジョブによる計算/GPUノード共有方法

これらのTipsは、全て **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** に従って構築された **Slurm** 環境を前提に記載します。

***
# 1. Prolog/Epilogセットアップ方法

## 1-0. 概要

本Tipsは、ジョブ実行の前後で **Slurm** が自動的にスクリプトを実行する機能であるProlog/Epilogをセットアップする方法を解説します。

ここでは、PrologとEpilogで以下の処理を適用することを想定し、そのセットアップ方法を解説します。

[Prolog]

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

[Epilog]

以下のスクリプトを使用し、ジョブがNVMe SSDローカルディスク領域のファイルシステム（マウントポイント  **/mnt/localdisk** ）に残したファイルをジョブ終了直後に全て削除します。

```sh
#!/bin/bash
/bin/rm -rf /mnt/localdisk/*
```

## 1-1. セットアップ手順

Slurmマネージャ、Slurmクライアント、及び全ての計算/GPUノードの **/opt/slurm/etc/slurm.conf** に以下の記述を追加します。

```sh
PrologFlags=Alloc
Prolog=/opt/slurm/etc/scripts/prolog.d/*
Epilog=/opt/slurm/etc/scripts/epilog.d/*
```

次に、全ての計算/GPUノードのopcユーザで以下コマンドを実行し、Prolog/Epilogのスクリプトを格納するディレクトリを作成します。

```sh
$ sudo mkdir -p /opt/slurm/etc/scripts/prolog.d
$ sudo mkdir -p /opt/slurm/etc/scripts/epilog.d
```

次に、全ての計算/GPUノードで、 **[1-0. 概要](#1-0-概要)** に記載のProlog/Epilog用スクリプトをそれぞれ **10_clean_memory.sh** と **10_clean_nvme.sh** として先に作成したディレクトリに格納し、以下のようにスクリプトファイルのオーナーとパーミッションを設定します。

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

なお、このディレクトリに2桁数字の接頭辞を持つスクリプトを複数格納することで、その数字の順番にスクリプトが実行されます。

次に、Slurmマネージャのopcユーザで以下のコマンドを実行し、 **slurm.conf** ファイルの変更を反映、その結果を確認します。

```sh
$ sudo su - slurm -c "scontrol reconfigure"
$ sudo su - slurm -c "scontrol show config" | grep -i -e ^epilog -e ^prolog | grep -v -i time
Epilog[0]               = /opt/slurm/etc/scripts/epilog.d/*
Prolog[0]               = /opt/slurm/etc/scripts/prolog.d/*
PrologFlags             = Alloc
$
```

なお、 **slurm.conf** にProlog/Epilogを定義した状態でそのスクリプトを格納するディレクトリに実行すべきスクリプトが存在しない場合、ジョブがディスパッチされた時点で当該ノードのステータスが **drain** となり、以降ジョブを受け付ない状態になります。  
そのため、実行すべきProlog/Epilogがない場合は、 **slurm.conf** 中の不要な定義を削除するか、以下のような実質的に何も実行しないスクリプトを配置することで、これを回避することが可能です。


[99_nill.sh]

```sh
#!/bin/bash
:
```

## 1-2. 稼働確認

以下コマンドを全ての計算/GPUノードのopcユーザで実行し、テスト用のファイルを **/mnt/localdisk** ディレクトリに作成します。

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

次に、以下コマンドを全ての計算/GPUノードのopcユーザで実行し、先に作成したテスト用のファイルが削除されていること、Linuxカーネルのキャッシュを開放した際のログが記録されていることで、想定通りにProlog/Epilogのスクリプトが実行されたことを確認します。

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

***
# 2. メンテナンスを考慮した計算/GPUノードのステータス変更方法

## 2-0. 概要

HPC/GPUクラスタは、運用中に計算/GPUノードでハードウェア障害が発生したりソフトウェアのアップデートを行う必要が生じると、当該ノードへのジョブ割り当てを一時的に停止するオフライン化を実施する必要が生じます。

**Slurm** は、 **Slurmd** が動作する計算/GPUノードのステータスに **DRAIN** フラグが存在し、これを管理者が明示的に切り替えることで、この運用要件を実現することが可能です。  
この **DRAIN** フラグが付与されると、既に実行中のジョブに影響を与えることなく以降のジョブを受け付けない状態になります。  
具体的には、以下のステップでこれを実施します。

- ステータスに **DRAIN** フラグを付与
- 実行中のジョブが存在する場合はこれが終了するまで待機
- メンテナンス作業を実施
- ステータスの **DRAIN** フラグを除去
- 新たなジョブが割当てられることを確認

本Tipsは、前述の運用要件を念頭に、計算/GPUノードのステータスを変更する方法を解説します。

## 2-1. 計算/GPUノードのステータスをオフラインに変更

本章は、ステータスが **IDLE** または **ALLOCATED** の計算/GPUノードに **DRAIN** フラグを付与し、新たなジョブが以降割り当てられないオフラインの状態に変更する方法を解説します。

Slurmマネージャのopcユーザで以下のコマンドを実行し、対象の計算/GPUノードのステータスが **IDLE** または **ALLOCATED** であることを確認します。  
ここで、計算/GPUノードのホスト名（inst-xxxxx-x9）は、自身の環境に合わせて修正します。

```sh
$ sudo su - slurm -c "scontrol show node inst-xxxxx-x9" | grep -e NodeName -e State
NodeName=inst-xxxxx-x9 Arch=x86_64 CoresPerSocket=18 
   State=ALLOCATED ThreadsPerCore=1 TmpDisk=10000 Weight=1 Owner=N/A MCS_label=N/A
$
```

次に、Slurmマネージャのopcユーザで以下のコマンドを実行し、対象の計算/GPUノードに **DRAIN** フラグを付与、ステータスが **IDLE+DRAIN** または **ALLOCATED+DRAIN** に変更されたことを確認します。  
ここで、計算/GPUノードのホスト名（inst-xxxxx-x9）は、自身の環境に合わせて修正します。  
また、 **reason=** の指定は、ステータスを変更する理由を適宜指定します。

```sh
$ sudo su - slurm -c "scontrol update nodename=inst-xxxxx-x9 state=drain reason=maintenance"
$ sudo su - slurm -c "scontrol show node inst-xxxxx-x9" | grep -e NodeName -e State
NodeName=inst-xxxxx-x9 Arch=x86_64 CoresPerSocket=18 
   State=ALLOCATED+DRAIN ThreadsPerCore=1 TmpDisk=10000 Weight=1 Owner=N/A MCS_label=N/A
$
```

ステータスが **ALLOCATED+DRAIN** の場合は、実行中のジョブが終了するまで待機します。

次に、対象の計算/GPUノードのopcユーザで以下のコマンドを実行し、対象の計算/GPUノードで **slurmd** を停止します。

```sh
$ sudo systemctl stop slurmd
```

## 2-2. 計算/GPUノードのステータスをオンラインに変更

本章は、メンテナンス作業が終了したことを想定し、計算/GPUノードのステータスから **DRAIN** フラグを除去し、新たなジョブが割り当てられるオンラインの状態にする方法を解説します。

対象の計算/GPUノードのopcユーザで以下のコマンドを実行し、 **slurmd** を起動します。

```sh
$ sudo systemctl start slurmd
```

次に、Slurmマネージャのopcユーザで以下のコマンドを実行し、対象の計算/GPUノードのステータスが **DOWN+DRAIN** であることを確認します。  
ここで、計算/GPUノードのホスト名（inst-xxxxx-x9）は、自身の環境に合わせて修正します。

```sh
$ sudo su - slurm -c "scontrol show node inst-xxxxx-x9" | grep -e NodeName -e State
NodeName=inst-xxxxx-x9 Arch=x86_64 CoresPerSocket=18 
   State=DOWN+DRAIN ThreadsPerCore=1 TmpDisk=10000 Weight=1 Owner=N/A MCS_label=N/A
$
```

次に、Slurmマネージャのopcユーザで以下のコマンドを実行し、対象の計算/GPUノードのステータスから **DRAIN** フラグを除去、ステータスが **IDLE** となっていることを確認します。  
ここで、計算/GPUノードのホスト名（inst-xxxxx-x9）は、自身の環境に合わせて修正します。  
なお、この計算/GPUノードで実行可能なジョブが待機していた場合、ジョブが即座に実行を開始してステータスが **ALLOCATED** になります。

```sh
$ sudo su - slurm -c "scontrol update nodename=inst-xxxxx-x9 state=idle"
$ sudo su - slurm -c "scontrol show node inst-xxxxx-x9" | grep -e NodeName -e State
NodeName=inst-xxxxx-x9 Arch=x86_64 CoresPerSocket=18 
   State=IDLE ThreadsPerCore=1 TmpDisk=10000 Weight=1 Owner=N/A MCS_label=N/A
$
```

***
# 3. ヘテロジニアス環境下のパーティションを使った計算/GPUノード割り当て制御

## 3-0. 概要

HPC/GPUクラスタは、構成する計算/GPUノードが異なるリソースを有するヘテロジニアスな環境となることがあります。  
この際、ジョブが想定するリソースを持つ計算/GPUノードで実行されることを保証する必要がありますが、 **Slurm** のパーティションに割り当てられる計算/GPUノードを適切に指定することで、この運用要件を実現することが可能です。

前述の運用要件を念頭に本Tipsは、ジョブ投入パーティションを使い分けることで、想定するリソースを持つ計算/GPUノードに適切にジョブが割当てられる **Slurm** 環境を構築する方法を解説します。

構築する **Slurm** 環境は、計算ノードに6ノードの **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を使用し、これを **NUMA nodes per socket** （以降 **NPS** と呼称）と **Simultanious Multi Threading** （以降 **SMT** と呼称）の組合せが以下となるパーティション構成とします。（※1）

| パーティション名 | 割当てられるノード名                                                                                | NPS      | SMT | デフォルトパーティション<br>（※2） |
| :------: | :---------------------------------------------------------------------------------------: | :------: | :-: | :--------------: |
| all      | inst-aaaaa-x9 inst-bbbbb-x9<br>inst-ccccc-x9 inst-ddddd-x9<br>inst-eeeee-x9 inst-fffff-x9 | -        | -   | Yes              |
| nps1     | inst-aaaaa-x9 inst-bbbbb-x9                                                               | **NPS1** | 無効  | No               |
| nps2     | inst-ccccc-x9 inst-ddddd-x9                                                               | **NPS2** | 無効  | No               |
| smte     | inst-eeeee-x9 inst-fffff-x9smt                                                            | **NPS1** | 有効  | No               |

※1）**NPS** と **SMT** を指定したインスタンスの作成方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。  
※2）パーティション名を指定せずに投入したジョブが割当てられるパーティションです。
  
これにより、以下の割り当て制御が可能になります。

- **NPS** にこだわらないジョブはパーティションを指定せずに投入（デフォルトの **all** に投入される）
- **NPS1** で **SMT** が無効の計算ノードで実行するジョブはパーティション **nps1** に投入
- **NPS2** の計算ノードで実行するジョブはパーティション **nps2** に投入
- **SMT** が有効の計算ノードで実行するジョブはパーティション **smt** に投入

## 3-1. slurm.conf修正

本章は、本Tipsの想定する運用要件を実現するよう **slurm.conf** を修正します。

作成する **slurm.conf** は、 **NodeName** 行と **PartitionName** 行を以下に修正します。

```sh
NodeName=inst-aaaaa-x9,inst-bbbbb-x9 CPUs=36 Boards=1 SocketsPerBoard=2 CoresPerSocket=18 ThreadsPerCore=1 RealMemory=500000 TmpDisk=10000 State=UNKNOWN
NodeName=inst-ccccc-x9,inst-ddddd-x9 CPUs=36 Boards=1 SocketsPerBoard=4 CoresPerSocket=9 ThreadsPerCore=1 RealMemory=500000 TmpDisk=10000 State=UNKNOWN
NodeName=inst-eeeee-x9,inst-fffff-x9 CPUs=72 Boards=1 SocketsPerBoard=2 CoresPerSocket=18 ThreadsPerCore=2 RealMemory=500000 TmpDisk=10000 State=UNKNOWN
PartitionName=all Nodes=ALL Default=YES MaxTime=INFINITE State=UP
PartitionName=nps1 Nodes=inst-aaaaa-x9,inst-bbbbb-x9 MaxTime=INFINITE State=UP
PartitionName=nps2 Nodes=inst-ccccc-x9,inst-ddddd-x9 MaxTime=INFINITE State=UP
PartitionName=smte Nodes=inst-eeeee-x9,inst-fffff-x9 MaxTime=INFINITE State=UP
```

この設定は、 **BM.Optimized3.36** がノード当たり2ソケットでソケット当たり18コアでコア当たり2ハードウェアスレッドを搭載することを念頭に、 **NPS1** と **NPS2** と **SMT** 有効・無効の計算ノードを異なるリソース定義の **NodeName** フィールドで定義しています。（※3）

※3）**slurm.conf** 中の **Socket** は、NUMA（Non-Umiform Memory Access）ノードに相当するため、 **NPS2** の場合は **Socket** がノード当たり4個として定義します。

## 3.2. slurm.conf修正の反映

本章は、先に修正した **slurm.conf** を反映します。

Slurmマネージャ、Slurmクライアント、及び計算/GPUノードで、先に修正した **slurm.conf** を **/opt/slurm/etc** ディレクトリにコピーします。

次に、Slurmマネージャのopcユーザで以下のコマンドを実行し、修正した **slurm.conf** の内容を反映します。

```sh
$ sudo su - slurm -c "scontrol reconfigure"
```

次に、Slurmマネージャのopcユーザで以下のコマンドを実行し、パーティションが想定通り作成されていることを確認します。

```sh
$ sinfo
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
all*         up   infinite      6   idle inst-aaaaa-x9,inst-bbbbb-x9,inst-ccccc-x9,inst-ddddd-x9,inst-eeeee-x9,inst-fffff-x9
nps1         up   infinite      2   idle inst-aaaaa-x9,inst-bbbbb-x9
nps2         up   infinite      2   idle inst-ccccc-x9,inst-ddddd-x9
smte         up   infinite      2   idle inst-eeeee-x9,inst-fffff-x9
$
```

***
# 4. 複数ジョブによる計算/GPUノード共有方法

## 4-0. 概要

計算/GPUノードのノード間を高帯域・低レイテンシで接続する **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** は、対応するシェイプが **ベア・メタル・インスタンス** となるため、 **クラスタ・ネットワーク** の利用を前提とする **ベア・メタル・インスタンス** ベースのHPC/GPUクラスタで使用するリソース（コア・メモリ）が少ないジョブを実行する場合、リソース有効活用の観点から複数のジョブを1ノードに混在させる運用の必要性が生じます。  
ただこの場合でも、複数ノードを使用するマルチノードジョブを実行する計算/GPUノードでは、これらのジョブの実行を妨げないようにノード占有で実行する必要があります。

本Tipsは、前述の運用要件を念頭に、ジョブを投入するパーティションを使い分けることで、ノード占有ジョブとノード共有ジョブが混在する **Slurm** 環境を構築する方法を解説します。

構築する **Slurm** 環境は、計算ノードに3ノードの **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** （搭載コア数： 36、 搭載メモリ量： 512GB（**Slurm** 設定上の利用可能メモリ量を500GBに設定））を使用し、以下のパーティション構成とします。

| パーティション名 | 割当てられるノード名                  | ノードの占有/共有 |
| :------: | :-------------------------: | :---: |
| large    | inst-aaaaa-x9 inst-bbbbb-x9 | 占有   |
| small    | inst-ccccc-x9               | 共有    |

これにより、以下の運用が可能になります。

- ノード占有ジョブはパーティション **large** に投入
- ノード共有ジョブはパーティション **small** に投入
- パーティション **large** に投入されたジョブは実行中ジョブの総使用ノード数が2ノードを超えない範囲で先着順にノード占有実行
- パーティション **small** に投入されたジョブは実行中ジョブの総使用コア数と総使用メモリ量がそれぞれ36コアと500GBを超えない範囲で先着順にノード共有実行（※4）

※4）ジョブ投入時は、使用するメモリ量を **--mem=xxxxM** オプションで指定する必要があります。  
以下は、使用するメモリ量を100,000 MBに指定してジョブを **small** パーティションに投入しています。

```sh
$ srun -p small -n 4 --mem=100000M ./a.out
```

## 4-1. slurm.conf修正

本章は、本Tipsの想定する運用要件を実現するよう **slurm.conf** を修正します。

作成する **slurm.conf** は、 **SelectType** 行、 **NodeName** 行、及び **PartitionName** 行を以下に修正します。

```sh
:
SelectType=select/cons_tres
:
NodeName=inst-aaaaa-x9,inst-bbbbb-x9,inst-ccccc-x9 CPUs=36 Boards=1 SocketsPerBoard=2 CoresPerSocket=18 ThreadsPerCore=1 RealMemory=500000 TmpDisk=10000 State=UNKNOWN
PartitionName=large Nodes=inst-aaaaa-x9,inst-bbbbb-x9 MaxTime=INFINITE State=UP OverSubscribe=Exclusive
PartitionName=small Nodes=inst-ccccc-x9 MaxTime=INFINITE State=UP
:
```

この設定は、リソース選択アルゴリズムを指定する **SelectType** 行にノード共有ジョブを可能にする **select/cons_tres** を指定し、パーティション **large** に **OverSubscribe=Exclusive** を指定することでノード占有パーティションを宣言しています。

## 4.2. slurm.conf修正の反映

本章は、先に修正した **slurm.conf** を反映します。

Slurmマネージャ、Slurmクライアント、及び計算/GPUノードで、先に修正した **slurm.conf** を **/opt/slurm/etc** ディレクトリにコピーします。

次に、Slurmマネージャのopcユーザで以下のコマンドを実行し、 **slurm.conf** ファイルの変更を反映、その結果を確認します。

```sh
$ sudo su - slurm -c "scontrol reconfigure"
$ sudo su - slurm -c "scontrol show config" | grep "SelectType "
SelectType              = select/cons_tres
$
```

次に、Slurmマネージャのopcユーザで以下のコマンドを実行し、パーティションが想定通り作成されていることを確認します。

```sh
$ sinfo -l
Tue Dec 24 18:00:11 2024
PARTITION AVAIL  TIMELIMIT   JOB_SIZE ROOT OVERSUBS     GROUPS  NODES       STATE RESERVATION NODELIST
small        up   infinite 1-infinite   no       NO        all      1        idle             inst-ccccc-x9
large        up   infinite 1-infinite   no EXCLUSIV        all      2        idle             inst-aaaaa-x9,inst-bbbbb-x9
$
```