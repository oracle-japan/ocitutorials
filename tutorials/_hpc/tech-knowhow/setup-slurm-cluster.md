---
title: "Slurmによるリソース管理・ジョブ管理システム構築方法"
excerpt: "HPC/GPUクラスタのリソース管理・ジョブ管理は、ジョブスケジューラを活用することでこれを効率的かつ柔軟に運用することが可能です。近年のHPC/機械学習ワークロードの大規模化は、MPI等を使ったノード間並列ジョブの重要性を増大させ、このような大規模ジョブを様々な運用ポリシーに沿って処理出来る機能をジョブスケジューラに求めています。オープンソースのジョブスケジューラSlurmは、この要求を満足出来る代表的なジョブスケジューラとして現在人気を集めています。本テクニカルTipsは、HPC/機械学習ワークロードの実行に最適なベアメタルインスタンスを高帯域・低遅延RDMAインターコネクトサービスのクラスタ・ネットワークで接続するHPC/GPUクラスタで、リソース管理・ジョブ管理システムをSlurmで構築する方法を解説します。"
order: "352"
layout: single
header:
  teaser: "/hpc/tech-knowhow/setup-slurm-cluster/architecture_diagram.png"
  overlay_image: "/hpc/tech-knowhow/setup-slurm-cluster/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---
<style>
table, th, td {
    font-size: 70%;
}
</style>

***
# 0. 概要

**[Slurm](https://slurm.schedmd.com/)** は、超大規模並列アプリケーションの運用を想定して開発されているジョブスケジューラで、この際に問題となる初期化処理（MPIの場合 **MPI_Init** ）時間の増大等の大規模並列ジョブ特有の問題に対し、プラグインとして取り込む **[PMIx](https://pmix.github.io/)** の以下機能（※1）で、これらの問題に対処しています。

- Direct-connect
- Direct-connect UCX
- Direct-connect early wireup

※1）これら機能の詳細は、SC17で発表された以下のスライドで紹介されています。  
**[https://slurm.schedmd.com/SC17/Mellanox_Slurm_pmix_UCX_backend_v4.pdf](https://slurm.schedmd.com/SC17/Mellanox_Slurm_pmix_UCX_backend_v4.pdf)**

ここでMPIのオープンソース実装である **[OpenMPI](https://www.open-mpi.org/)** は、 **PMIx** をプラグインとして取り込んだ **Slurm** 環境で **Slurm** が提供するジョブ実行コマンド **srun** を使用してそのアプリケーションを実行する場合、 **[PRRTE](https://docs.prrte.org/en/latest/)** を使用する起動方法（ **mpirun** / **mpiexec** を起動コマンドに使用する方法）に対して、先の **PMIx** の初期化処理を含む以下の利点を享受することが出来ます。

- 高並列アプリケーションを高速に起動することが可能
- プロセスバインディングや終了処理等のプロセス管理を **Slurm** に統合することが可能
- 精度の高いアカウンティング情報を **Slurm** に提供することが可能
- **Slurm** クラスタ内のSSHパスフレーズ無しアクセス設定が不要

以上の利点を享受するべく本テクニカルTipsは、 **OpenMPI** のMPI並列アプリケーションを **PMIx** の大規模並列ジョブに対する利点を生かして実行することを念頭に、 **PMIx** と **[UCX](https://openucx.org/)** を取り込んだ **Slurm** 環境を構築し、初期化処理時間の効果を検証すべく、 **[Intel MPI Benchmarks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** PingPongのレイテンシに着目して比較・検証を実施します。

***
# 1. 前提システム

本章は、本テクニカルTipsで解説する **Slurm** 環境構築手順の前提となるシステムを解説します。  
本テクニカルTipsは、このシステムが予め構築されている前提で、ここに **Slurm** 環境を構築する手順を解説します。

前提システムは、以下4種類のサブシステムから構成されます。  
また、必要に応じてこれらのサブシステムにログインするための踏み台となる、パブリックサブネットに接続するBastionノードを用意します。

| サブシステム          | 使用するシェイプ                                                                    | OS                           | ノード数           | 接続<br>サブネット                | 役割                                                           |
| :-------------: | :-------------------------------------------------------------------------: | :--------------------------: | :------------: | :------------------------: | :----------------------------------------------------------: |
| Slurm<br>マネージャ  | 任意の仮想マシン<br>（※2）                                                            | **Oracle Linux** 8.10<br>（※6）         | 1              | プライベート                     | **slurmctld** と **slurmdbd** が稼働するSlurm管理ノード                 |
| Slurm<br>クライアント | 任意の仮想マシン<br>（※2）                                                            | **Oracle Linux** 8.10<br>（※6） | 1              | プライベート                     | アプリケーション開発用フロントエンドノード<br>**Slurm** にジョブを投入するジョブサブミッションクライアント |
| 計算ノード           | **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)**<br>対応ベアメタルシェイプ<br>（※3） | **Oracle Linux** 8.10<br>（※6） | 2ノード以上<br>（※3） | プライベート<br> **クラスタ・ネットワーク** | **slurmd** が稼働するジョブ実行ノード                                     |
| NFSサーバ          | -<br>（※4）                                                                   | -                            | 1              | プライベート                     | ジョブ投入ユーザのホームディレクトリをNFSでサービス（※5）                              |

![画面ショット](architecture_diagram.png)

※2）本テクニカルTipsは、 **[VM.Optimized3.Flex](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#flexible)** を使用します。  
※3）本テクニカルTipsは、 **クラスタ・ネットワーク** に接続された2ノードの **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** の手順に従い、 **Simultanious Multi Threading** （以降 **SMT** と呼称）を無効化して使用します。  
※4）**ファイル・ストレージ** やベア・メタル・インスタンスNFSサーバ等、任意の手法で構築されたNFSサーバです。NFSでサービスするファイル共有ストレージ構築方法は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法](/ocitutorials/hpc/tech-knowhow/howto-configure-sharedstorage/)** を参照してください。  
※5）NFSサーバがサービスするジョブ投入ユーザのホームディレクトリは、Slurmクライアントと計算ノードでNFSマウントします。  
※6）**Oracle Linux** 8.10ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** で、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** です。Slurmマネージャは、計算ノードにインストールする **Slurm** のRPMをビルドするため、Slurmクライアントは、計算ノードのアプリケーション開発環境の役割を担うため、計算ノードと同じOSを採用します。

計算ノードの構築手順は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ手動構築編)](/ocitutorials/hpc/spinup-cluster-network/)** が参考になります。

本テクニカルTipsの各サブシステムのホスト名は、以下とします。  
以降の章では、これらのホスト名を自身の環境に置き換えて使用して下さい。

| サブシステム      | ホスト名        |
| :---------: | :---------: |
| Slurmマネージャ  | slurm-srv   |
| Slurmクライアント | slurm-cli   |
| 計算ノード       | inst-aaaaa-x9<br>inst-bbbbb-x9 |

また、各サブシステムのセキュリティーに関するOS設定は、 **firewalld** を停止し、 **SElinux** をDisableにします。

***
# 2. 環境構築

## 2-0. 概要
本章は、既にデプロイされている **[1. 前提システム](#1-前提システム)** で解説したシステム上で、 **Slurm** 環境を構築する手順を解説します。

**Slurm** のインストールは、多数の計算ノードに効率よくインストールする必要から、rpmbuildで作成するrpmパッケージによるインストール方法を採用します。

本テクニカルTipsは、以下のソフトウェアバージョンを前提とします。

- **Slurm** ： 24.11.0
- **OpenMPI** ： 5.0.6
- **PMIx** ： **[OpenPMIx](https://openpmix.github.io/)** 5.0.4
- **UCX** : **[OpenUCX](https://openucx.readthedocs.io/en/master/index.html#)** 1.17.0

また、 **Slurm** のプロセス間通信の認証に **[munge](https://dun.github.io/munge/)** 、ジョブのアカウンティング情報格納用RDBMSに **[MariaDB](https://mariadb.org/)** を使用します。

以上より、本章で解説する環境構築は、以下の手順に沿って行います。

1. **munge** インストール・セットアップ
2. **MariaDB** インストール・セットアップ
3. **OpenMPI** インストール
4. **OpenPMIx** インストール
5. **OpenUCX** インストール
6. **Slurm** rpmパッケージ作成
7. **Slurm** rpmパッケージインストール・セットアップ
8. **Slurm** 設定ファイル作成
9. **Slurm** サービス起動
10. **Slurm** 利用に必要な環境変数設定

なお、各ソフトウェアと **Slurm** サービスは、以下のサブシステムにインストールします。

|                          | Slurmマネージャ | Slurmクライアント | 計算ノード |
| :----------------------: | :--------: | :---------: | :---: |
| **munge**                | 〇          | 〇           | 〇     |
| **MariaDB**              | 〇          | -           | -     |
| **OpenPMIx**             | 〇          | 〇           | 〇     |
| **OpenUCX**                  | 〇          | 〇           | 〇     |
| **OpenMPI**              | -          | 〇           | 〇     |
| **slurmctld**            | 〇          | -           | -     |
| **slurmdbd**             | 〇          | -           | -     |
| **slurmd**               | -          | -           | 〇     |
| **Slurm**<br>クライアントパッケージ | 〇          | 〇           | 〇     |

## 2-1. munge インストール・セットアップ

本章は、Slurmマネージャ、Slurmクライアント、及び全ての計算ノードに **munge** をインストール・セットアップします。

以下コマンドを対象となる全ノードのopcユーザで実行し、 **munge** プロセス起動ユーザを作成します。

```
$ sudo useradd -m -d /var/lib/munge -s /sbin/nologin -u 5001 munge
```

次に、以下コマンドを対象となる全ノードのopcユーザで実行し、 **munge** をインストールします。

```sh
$ sudo yum-config-manager --enable ol8_codeready_builder
$ sudo dnf install -y munge munge-libs munge-devel
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、 **munge** キーファイル（ **munge.key** ）を作成します。

```sh
$ sudo /usr/sbin/create-munge-key
Generating a pseudo-random key using /dev/urandom completed.
$ sudo ls -la /etc/munge
total 16
drwx------.   2 munge munge   23 Nov 24 14:34 .
drwxr-xr-x. 115 root  root  8192 Nov 24 14:33 ..
-r--------.   1 munge munge 1024 Nov 24 14:34 munge.key
$ 
```

次に、先にSlurmマネージャで作成した **munge** キーファイルを、Slurmクライアントと全ての計算ノードに同一パス・ファイル名でコピーします。  
この際、ファイルのオーナーとパーミッションがSlurmマネージャのキーファイルと同じとなるよう配慮します。

次に、以下コマンドを対象となる全ノードのopcユーザで実行し、 **munge** サービスを起動します。

```sh
$ sudo systemctl enable --now munge.service
```

次に、以下コマンドを対象となる全ノードのopcユーザで実行し、 **munge** が全てのノードで正常に動作していることを確認します。

```sh
$ munge -n | unmunge | grep STATUS
STATUS:           Success (0)
$
```

## 2-2. MariaDB インストール・セットアップ

本章は、Slurmマネージャに **MariaDB** をインストール・セットアップします。

以下コマンドをopcユーザで実行し、 **MariaDB** をインストールします。

```
$ sudo dnf install -y mariadb-server mariadb-devel
```

次に、 **MariaDB** の設定ファイル（ **mariadb-server.cnf** ）の[mysqld]フィールドに以下の記述を追加します。

```sh
$ sudo diff /etc/my.cnf.d/mariadb-server.cnf_org /etc/my.cnf.d/mariadb-server.cnf
20a21,22
> innodb_buffer_pool_size=4096M
> innodb_lock_wait_timeout=900
$
```

次に、以下コマンドをopcユーザで実行し、 **MariaDB** サービスを起動します。

```sh
$ sudo systemctl enable --now mariadb
```

次に、 **MariaDB** のデータベースに以下の登録を行うため、

- データベース（slurm_acct_db）
- ユーザ（slurm）
- ユーザ（slurm）のパスワード
- ユーザ（slurm）に対するデータベース（slurm_acct_db）への全権限付与

以下コマンドをopcユーザで実行します。  
なお、 **MariaDB** に対して入力するコマンドは、 **MariaDB** のプロンプト（ **MariaDB [(none)]>** ）に続く文字列です。

```sh
$ sudo mysql
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 8
Server version: 10.3.39-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> create database slurm_acct_db;
Query OK, 1 row affected (0.000 sec)

MariaDB [(none)]> create user 'slurm'@'localhost' identified by 'SLURM';
Query OK, 0 rows affected (0.000 sec)

MariaDB [(none)]> set password for slurm@localhost = password('passcord');
Query OK, 0 rows affected (0.000 sec)

MariaDB [(none)]> grant all on slurm_acct_db.* TO 'slurm'@'localhost';
Query OK, 0 rows affected (0.000 sec)

MariaDB [(none)]> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.000 sec)

MariaDB [(none)]> Ctrl-C -- exit!
Aborted
$
```

なお、コマンド中の **passcord** は、自身の設定するパスワードに置き換えます。

次に、以下コマンドをopcユーザで実行し、先に登録したデータベースとユーザが正しく登録されていることを確認します。

```sh
$ mysql --user=slurm --password=passcord slurm_acct_db -e 'show databases;'
+--------------------+
| Database           |
+--------------------+
| information_schema |
| slurm_acct_db      |
+--------------------+
$
```

なお、コマンド中の **passcord** は、自身の設定したパスワードに置き換えます。

## 2-3. OpenMPIインストール

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従い、Slurmクライアントと全ての計算ノードに **OpenMPI** をインストールします。  
これにより、これらのノードに **OpenPMIx** と **OpenUCX** もインストールされます。

## 2-4. OpenPMIxインストール

本章は、Slurmマネージャに **OpenPMIx** をインストールします。

以下コマンドをSlurmマネージャのopcユーザで実行し、 **OpenPMIx** を **/opt** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ sudo dnf install -y ncurses-devel openssl-devel gcc-c++ gcc-gfortran
$ cd ~; wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
$ tar -xvf ./libevent-2.1.12-stable.tar.gz
$ cd libevent-2.1.12-stable; ./configure --prefix=/opt/libevent
$ make -j 36 && sudo make install
$ cd ~; wget https://download.open-mpi.org/release/hwloc/v2.11/hwloc-2.11.2.tar.gz
$ tar -xvf ./hwloc-2.11.2.tar.gz
$ cd hwloc-2.11.2; ./configure --prefix=/opt/hwloc
$ make -j 36 && sudo make install
$ cd ~; wget https://github.com/openpmix/openpmix/releases/download/v5.0.4/pmix-5.0.4.tar.gz
$ tar -xvf ./pmix-5.0.4.tar.gz
$ cd pmix-5.0.4; ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
$ make -j 36 && sudo make install
```

## 2-5. OpenUCXインストール

本章は、Slurmマネージャに **OpenUCX** をインストールします。

以下コマンドをSlurmマネージャのopcユーザで実行し、 **OpenUCX** を **/opt** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ cd ~; wget https://github.com/openucx/ucx/releases/download/v1.17.0/ucx-1.17.0.tar.gz
$ tar -xvf ./ucx-1.17.0.tar.gz
$ cd ucx-1.17.0; ./contrib/configure-release --prefix=/opt/ucx
$ make -j 36 && sudo make install
```

## 2-6. Slurm rpmパッケージ作成

本章は、Slurmマネージャでrpmパッケージを作成します。

以下コマンドをSlurmマネージャのopcユーザで実行し、前提rpmパッケージをインストールします。

```
$ sudo dnf install -y rpm-build pam-devel perl readline-devel autoconf automake
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、 **Slurm** rpmパッケージを作成します。

```
$ cd ~; wget https://download.schedmd.com/slurm/slurm-24.11.0.tar.bz2
$ rpmbuild --define '_prefix /opt/slurm' --define '_slurm_sysconfdir /opt/slurm/etc' --define '_with_pmix --with-pmix=/opt/pmix' --define '_with_ucx --with-ucx=/opt/ucx' -ta ./slurm-24.11.0.tar.bz2
```

作成されたパッケージは、以下のディレクトリに配置されるので、これらの全ファイルを他のサブシステムにコピーします。

```
$ ls -1 ~/rpmbuild/RPMS/x86_64/
slurm-24.11.0-1.el8.x86_64.rpm
slurm-contribs-24.11.0-1.el8.x86_64.rpm
slurm-devel-24.11.0-1.el8.x86_64.rpm
slurm-example-configs-24.11.0-1.el8.x86_64.rpm
slurm-libpmi-24.11.0-1.el8.x86_64.rpm
slurm-openlava-24.11.0-1.el8.x86_64.rpm
slurm-pam_slurm-24.11.0-1.el8.x86_64.rpm
slurm-perlapi-24.11.0-1.el8.x86_64.rpm
slurm-sackd-24.11.0-1.el8.x86_64.rpm
slurm-slurmctld-24.11.0-1.el8.x86_64.rpm
slurm-slurmd-24.11.0-1.el8.x86_64.rpm
slurm-slurmdbd-24.11.0-1.el8.x86_64.rpm
slurm-torque-24.11.0-1.el8.x86_64.rpm
$
```

## 2-7. Slurm rpmパッケージインストール・セットアップ

本章は、先に作成した **Slurm** rpmパッケージを各サブシステムにインストールし、必要なセットアップ作業を実施します。

以下コマンドをSlurmマネージャのopcユーザで実行し、Slurmマネージャに必要な **Slurm** rpmパッケージのインストール・セットアップを行います。

```
$ cd ~/rpmbuild/RPMS/x86_64
$ sudo rpm -ivh ./slurm-24.11.0-1.el8.x86_64.rpm ./slurm-slurmctld-24.11.0-1.el8.x86_64.rpm ./slurm-slurmdbd-24.11.0-1.el8.x86_64.rpm ./slurm-perlapi-24.11.0-1.el8.x86_64.rpm
$ sudo useradd -m -d /var/lib/slurm -s /bin/bash -u 5000 slurm
$ sudo mkdir /var/spool/slurmctld; sudo chown slurm:slurm /var/spool/slurmctld
$ sudo mkdir /var/spool/slurmd; sudo chown slurm:slurm /var/spool/slurmd
$ sudo mkdir /var/log/slurm; sudo chown slurm:slurm /var/log/slurm
$ sudo mkdir /opt/slurm/etc; sudo chown slurm:slurm /opt/slurm/etc
$ sudo su - slurm
$ echo "export PATH=/opt/slurm/sbin:/opt/slurm/bin:\$PATH" | tee -a ~/.bashrc
$ source ~/.bashrc
```

次に、以下コマンドを全ての計算ノードのopcユーザで **Slurm** rpmパッケージをコピーしたディレクトリで実行し、計算ノードに必要な **Slurm** rpmパッケージのインストール・セットアップを行います。

```
$ sudo dnf install -y mariadb-devel
$ sudo rpm -ivh ./slurm-24.11.0-1.el8.x86_64.rpm ./slurm-slurmd-24.11.0-1.el8.x86_64.rpm ./slurm-perlapi-24.11.0-1.el8.x86_64.rpm
$ sudo useradd -m -d /var/lib/slurm -s /bin/bash -u 5000 slurm
$ sudo mkdir /var/spool/slurmd; sudo chown slurm:slurm /var/spool/slurmd
$ sudo mkdir /var/log/slurm; sudo chown slurm:slurm /var/log/slurm
$ sudo mkdir /opt/slurm/etc; sudo chown slurm:slurm /opt/slurm/etc
```

次に、以下コマンドをSlurmクライアントのopcユーザで **Slurm** rpmパッケージをコピーしたディレクトリで実行し、Slurmクライアントに必要な **Slurm** rpmパッケージのインストール・セットアップを行います。

```
$ sudo dnf install -y mariadb-devel
$ sudo rpm -ivh ./slurm-24.11.0-1.el8.x86_64.rpm ./slurm-perlapi-24.11.0-1.el8.x86_64.rpm
$ sudo useradd -m -d /var/lib/slurm -s /bin/bash -u 5000 slurm
$ sudo mkdir /opt/slurm/etc; sudo chown slurm:slurm /opt/slurm/etc
```

## 2-8. Slurm設定ファイル作成

本章は、以下3種類の **Slurm** 設定ファイルを作成し、これらを各サブシステムの **/opt/slurm/etc** ディレクトリに配布します。  
この際、これらファイルのオーナーユーザ・オーナーグループを **slurm** とします。  
また、 **slurmdbd.conf** のパーミッションを **600** に設定します。

- **slurm.conf**（全てのサブシステム）
- **slurmdbd.conf**（Slurmマネージャ）
- **mpi.conf**（Slurmマネージャ）

[ **slurm.conf** ]
```sh
ClusterName=sltest
SlurmctldHost=slurm-srv
AuthType=auth/munge
PluginDir=/opt/slurm/lib64/slurm
SchedulerType=sched/backfill
SelectType=select/linear
SlurmUser=slurm
SlurmctldPort=7002
SlurmctldTimeout=300
SlurmdPort=7003
SlurmdSpoolDir=/var/spool/slurmd
SlurmdTimeout=300
SlurmctldLogFile=/var/log/slurm/slurmctld.log
SlurmdLogFile=/var/log/slurm/slurmd.log
SlurmdDebug=3
StateSaveLocation=/var/spool/slurmd
SwitchType=switch/none
AccountingStorageType=accounting_storage/slurmdbd
AccountingStorageHost=slurm-srv
AccountingStoragePort=7004
MpiDefault=pmix
NodeName=inst-aaaaa-x9,inst-bbbbb-x9 CPUs=36 Boards=1 SocketsPerBoard=2 CoresPerSocket=18 ThreadsPerCore=1 RealMemory=500000 TmpDisk=10000 State=UNKNOWN
PartitionName=sltest Nodes=ALL Default=YES MaxTime=INFINITE State=UP
TaskPlugin=task/affinity
```

なお、 **SlurmctldHost** 、 **AccountingStorageHost** 、及び **NodeName** の設定値は、自身の環境に合わせて修正します。

[ **slurmdbd.conf** ]
```sh
ArchiveEvents=yes
ArchiveJobs=yes
ArchiveResvs=yes
ArchiveSteps=no
ArchiveSuspend=no
ArchiveTXN=no
ArchiveUsage=no
AuthType=auth/munge
AuthInfo=/var/run/munge/munge.socket.2
DbdHost=slurm-srv
DbdPort=7004
DebugLevel=info
PurgeEventAfter=1month
PurgeJobAfter=12month
PurgeResvAfter=1month
PurgeStepAfter=1month
PurgeSuspendAfter=1month
PurgeTXNAfter=12month
PurgeUsageAfter=24month
LogFile=/var/log/slurm/slurmdbd.log
PidFile=/var/run/slurmdbd/slurmdbd.pid
SlurmUser=slurm
StorageType=accounting_storage/mysql
StorageUser=slurm
StoragePass=passcord
StorageLoc=slurm_acct_db
```

なお、 **DbdHost** と **StoragePass** の設定値は、自身の環境に合わせて修正します。

[ **mpi.conf** ]

```sh
PMIxDirectConn=true
PMIxDirectConnEarly=true
PMIxDirectConnUCX=true
PMIxNetDevicesUCX=mlx5_0:0
```

## 2-9. Slurmサービス起動

本章は、 **Slurm** の各systemdサービスを対象のサブシステムで起動します。

以下コマンドを全ての計算ノードのopcユーザで実行し、 **slurmd** を起動します。

```
$ sudo systemctl enable --now slurmd
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、 **slurmdbd** と **slurmctld** を起動します。

```
$ sudo systemctl enable --now slurmdbd
$ sudo systemctl start slurmctld
```

**slurmctld** は、全ての計算ノードの **slurmd** 起動完了後に起動する必要があるため、手動起動を想定して自動起動設定は行いません。

次に、以下コマンドをSlurmマネージャのslurmユーザで実行し、全ての計算ノードがアイドルになっていることを確認します。

```
$ sinfo
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
sltest*      up   infinite      2   idle inst-aaaaa-x9,inst-bbbbb-x9
$
```

次に、以下コマンドをSlurmマネージャのslurmユーザで実行し、 **PMIx** が利用可能になっていることを確認します。

```
$ srun --mpi=list
MPI plugin types are...
	none
	cray_shasta
	pmi2
	pmix
specific pmix plugin versions available: pmix_v5
$
```

## 2-10. Slurm利用に必要な環境変数設定

以下コマンドをSlurmクライアントのジョブ投入ユーザで実行し、 **Slurm** を利用するための環境変数を設定します。

```sh
$ echo "export PATH=/opt/slurm/sbin:/opt/slurm/bin:\$PATH" | tee -a ~/.bashrc
$ echo "export UCX_NET_DEVICES=mlx5_2:1" | tee -a ~/.bashrc
$ source ~/.bashrc
```

ここで設定している環境変数 **UCX_NET_DEVICES** は、 **Slurm** から実行する **OpenMPI** のジョブがそのノード間通信を  **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続するNIC（RDMAリンク名 **mlx5_2/1** ）を介して行うことを指示しています。  
またこの環境変数は、 **OpenPMIx** がMPIプロセス制御に **OpenUCX** を使用することも指示しているため、 **srun** でジョブを実行する際に設定する必要があります。

***
# 3. 稼働確認

本章は、構築した **Slurm** 環境の稼働確認と **PMIx** の効果を確認するため、ジョブ投入ユーザで **[Intel MPI Benchmarks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** を実行するバッチジョブを **srun** で起動する場合と **mpirun** で起動する場合の2種類実行し、その結果を比較します。  
またこのジョブの終了後、そのアカウンティング情報を取得できることを確認します。

**srun** を利用する場合（ **srun.sh** ）と **mpiexec** を利用する場合（ **mpirun.sh** ）で、以下のように**Intel MPI Benchmarks** を実行する2種類のジョブスクリプトをジョブ投入ユーザのホームディレクトリ直下に作成します。

[ **srun.sh** ]
```sh
#!/bin/bash
#SBATCH -p sltest
#SBATCH -n 2
#SBATCH -N 2
#SBATCH -J ping_ping
#SBATCH -o stdout.%J
#SBATCH -e stderr.%J
srun /opt/openmpi-5.0.6/tests/imb/IMB-MPI1 -msglog 28:28 pingpong
```

[ **mpirun.sh** ]
```sh
#!/bin/bash
#SBATCH -p sltest
#SBATCH -n 2
#SBATCH -N 2
#SBATCH -J ping_ping
#SBATCH -o stdout.%J
#SBATCH -e stderr.%J
mpirun -n 2 -N 1 /opt/openmpi-5.0.6/tests/imb/IMB-MPI1 -msglog 28:28 pingpong
```

次に、以下コマンドをSlurmクライアントのジョブ投入ユーザで実行し、バッチジョブの投入とその結果確認を行います。

```sh
$ cd ~; sbatch srun.sh
Submitted batch job 3
$ grep -A 2 usec stdout.3
       #bytes #repetitions      t[usec]   Mbytes/sec
            0         1000         1.47         0.00
    268435456            1     21925.54     12243.05
$ sbatch mpirun.sh
Submitted batch job 4
$ grep -A 3 usec stdout.4
       #bytes #repetitions      t[usec]   Mbytes/sec
            0         1000         1.67         0.00
    268435456            1     21955.08     12226.58
$
```

この結果より、 **srun** を利用することでMPI通信の初期化処理に要する時間が短縮され、レイテンシが **0.2 μ秒** 改善されていることがわかります。

次に、以下コマンドをSlurmクライアントのジョブ投入ユーザで実行し、終了したジョブのアカウンティング情報を取得できることを確認します。

```sh
$ sacct -j 3 -o JobID,User,AllocCPUS,Start,End
JobID             User  AllocCPUS               Start                 End 
------------ --------- ---------- ------------------- ------------------- 
3                usera         72 2024-06-19T21:18:21 2024-06-19T21:18:23 
3.batch                        36 2024-06-19T21:18:21 2024-06-19T21:18:23 
3.0                            72 2024-06-19T21:18:22 2024-06-19T21:18:23 
$
```