---
title: "Slurmによるリソース管理・ジョブ管理システム構築方法"
description: "HPC/GPUクラスタのリソース管理・ジョブ管理は、ジョブスケジューラを活用することでこれを効率的かつ柔軟に運用することが可能です。近年のHPC/機械学習ワークロードの大規模化は、MPI等を使ったノード間並列ジョブの重要性を増大させ、このような大規模ジョブを様々な運用ポリシーに沿って処理出来る機能をジョブスケジューラに求めています。オープンソースのジョブスケジューラSlurmは、この要求を満足出来る代表的なジョブスケジューラとして現在人気を集めています。本テクニカルTipsは、HPC/機械学習ワークロードの実行に最適なベアメタルインスタンスを高帯域・低遅延RDMAインターコネクトサービスのクラスタ・ネットワークで接続するHPC/GPUクラスタで、リソース管理・ジョブ管理システムをSlurmで構築する方法を解説します。"
weight: "3502"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---
<style>
table, th, td {
    font-size: 80%;
}
</style>

# 0. 概要

**[Slurm](https://slurm.schedmd.com/)** は、超大規模並列アプリケーションの運用を想定して開発されているジョブスケジューラで、この際に問題となる初期化処理（MPIの場合 **MPI_Init** ）時間の増大等の大規模並列ジョブ特有の問題に対し、プラグインとして取り込む **[PMIx](https://pmix.github.io/)** の以下機能（※1）で、これらの問題に対処しています。

- Direct-connect
- Direct-connect **[UCX](https://openucx.org/)** 
- Direct-connect early wireup

※1）これら機能の詳細は、SC17で発表された以下のスライドで紹介されています。  
**[https://slurm.schedmd.com/SC17/Mellanox_Slurm_pmix_UCX_backend_v4.pdf](https://slurm.schedmd.com/SC17/Mellanox_Slurm_pmix_UCX_backend_v4.pdf)**

ここでMPIのオープンソース実装である **[OpenMPI](https://www.open-mpi.org/)** は、 **PMIx** をプラグインとして取り込んだ **Slurm** 環境で **Slurm** が提供するジョブ実行コマンド **srun** を使用してそのアプリケーションを実行する場合、 **[PRRTE](https://docs.prrte.org/en/latest/)** を使用する起動方法（ **mpirun** / **mpiexec** を起動コマンドに使用する方法）に対して、先の **PMIx** の初期化処理を含む以下の利点を享受することが出来ます。

- 高並列アプリケーションを高速に起動
- バインディングや終了処理等のMPIプロセス管理を **Slurm** に統合
- 精度の高いアカウンティング情報を **Slurm** に提供
- **Slurm** クラスタ内のSSHパスフレーズ無しアクセス設定が不要

また **Slurm** は、高価なGPUリソースの利用効率を最大化するための機能を豊富に備え、HPC/機械学習ワークロードをマルチユーザ環境で実行するGPUクラスタに於いて、リソース管理・ジョブ管理機能を最大化する上で最適なプラットフォームです。

以上を踏まえて本テクニカルTipsは、 **OpenMPI** のMPI並列アプリケーションを **PMIx** の大規模並列ジョブに対する利点を生かして実行すること、GPUクラスタに於けるGPUリソースを有効に活用すること、を念頭に **Slurm** 環境を構築します。  
また構築した環境の稼働確認として、HPCクラスタでは **[OSU Micro-Benchmarks](https://mvapich.cse.ohio-state.edu/benchmarks/)** で2ノード間のレイテンシと4ノード間のMPI_Init所要時間に着目して初期化処理時間の効果を検証し、GPUクラスタでは設定したGPUリソース管理機能が想定通りに動作することを検証します。

なお、 **Ubuntu** をOSとするGPUクラスタのリソース管理やジョブ管理を **Slurm** で行う環境の構築方法は、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法(Ubuntu OS編)](../setup-slurm-cluster-withubuntu/)** を参照してください。

# 1. 前提システム

本章は、本テクニカルTipsで解説する **Slurm** 環境構築手順の前提となるシステムを解説します。  
本テクニカルTipsは、このシステムが予め構築されている前提で、ここに **Slurm** 環境を構築する手順を解説します。

前提システムは、以下4種類（HPCクラスタの場合は計算ノードを使用し、GPUクラスタの場合はGPUノードを使用します。）のサブシステムから構成されます。  
また、必要に応じてこれらのサブシステムにログインするための踏み台となる、パブリックサブネットに接続するBastionノードを用意します。

| サブシステム          | 使用するシェイプ                                                     | OS                           | ノード数           | 接続<br>サブネット                    | 役割                                                                      |
| :-------------: | :----------------------------------------------------------: | :--------------------------: | :------------: | :----------------------------: | :---------------------------------------------------------------------: |
| Slurm<br>マネージャ  | 任意の仮想マシン<br>                                                 | **Oracle Linux** 9.5<br>（※6） | 1              | プライベート                         | ・ **slurmctld** と **slurmdbd** が<br>稼働するSlurm管理ノード                      |
| Slurm<br>クライアント | 任意の仮想マシン<br>                                                 | **Oracle Linux** 9.5<br>（※6） | 1              | プライベート                         | ・アプリケーション開発用<br>フロントエンドノード<br>・ **Slurm** にジョブを投入する<br>ジョブサブミッションクライアント |
| 計算ノード           | **クラスタ・ネットワーク** 対応<br>ベアメタルシェイプ（※2） | **Oracle Linux** 9.5<br>（※6） | 2ノード以上<br>（※2） | プライベート<br>+<br>**クラスタ・ネットワーク** | ・ **slurmd** が稼働するジョブ実行ノード                                              |
| GPUノード          | **クラスタ・ネットワーク** 対応<br>ベアメタルシェイプ（※3） | **Oracle Linux** 9.5<br>（※6） | 2ノード以上<br>（※3） | プライベート<br>+<br>**クラスタ・ネットワーク** | ・ **slurmd** が稼働するジョブ実行ノード                                              |
| NFSサーバ          | -<br>（※4）                                                    | -                            | 1              | プライベート                         | ・ジョブ投入ユーザのホームディレクトリを<br>NFSでサービス（※5）                                    |

![画面ショット](architecture_diagram.png)

※2）本テクニカルTipsは、 **クラスタ・ネットワーク** に接続する4ノードの **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](../../benchmark/bios-setting/)** の手順に従い、 **Simultanious Multi Threading** （以降 **SMT** と呼称）を無効化して使用します。  
※3）本テクニカルTipsは、 **クラスタ・ネットワーク** に接続する2ノードの **[BM.GPU4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** を、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](../../benchmark/bios-setting/)** の手順に従い、 **SMT** を無効化して使用します。  
※4）**ファイル・ストレージ** やベア・メタル・インスタンスNFSサーバ等、任意の手法で構築されたNFSサーバです。NFSでサービスするファイル共有ストレージ構築方法は、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法](../../tech-knowhow/howto-configure-sharedstorage/)** を参照してください。  
※5）NFSサーバがサービスするジョブ投入ユーザのホームディレクトリは、Slurmクライアントと計算/GPUノードでNFSマウントします。  
※6）**Oracle Linux** 9.5ベースのHPC/GPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** で、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.13** （HPCクラスタの場合です。）/ **No.15** （GPUクラスタの場合です。）です。Slurmマネージャは、計算/GPUノードにインストールする **Slurm** のRPMをビルドするため、Slurmクライアントは、計算/GPUノードのアプリケーション開発環境の役割を担うため、計算/GPUノードと同じOSを採用します。

Slurmクライアントは、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](../build-openmpi/)** の **[1. インストール・セットアップ](../build-openmpi/#1-インストールセットアップ)** の手順に従い、 **OpenMPI** をインストールします。

計算/GPUノードは、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ手動構築編)](../../spinup-cluster-network/)** / **[GPUクラスタを構築する(基礎インフラ自動構築編)](../../spinup-gpu-cluster/)** の手順に従う等で **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** に接続するHPC/GPUクラスタを構築し、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](../build-openmpi/)** の **[1. インストール・セットアップ](../build-openmpi/#1-インストールセットアップ)** の手順に従い、 **OpenMPI** をインストールします。

またSlurmクライアントと計算/GPUノードは、**[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[OSU Micro-Benchmarks実行方法（BM.Optimized3.36編）](../../benchmark/run-omb-hpc/)** / **[OSU Micro-Benchmarks実行方法（BM.GPU4.8/BM.GPU.A100-v2.8編）](../../benchmark/run-omb-gpu/)** の **[2. OSU Micro-Benchmarksインストール](../../benchmark/run-omb-hpc/#2-osu-micro-benchmarksインストール)** / **[1. OSU Micro-Benchmarksインストール](../../benchmark/run-omb-gpu/#1-osu-micro-benchmarksインストール)** の手順に従い、 **[3. 稼働確認](#3-稼働確認)** で使用する **OSU Micro-Benchmarks** をインストールします。

本テクニカルTipsの各サブシステムのホスト名は、以下とします。  
以降の章では、これらのホスト名を自身の環境に置き換えて使用して下さい。

| サブシステム      | ホスト名                                                             |
| :---------: | :--------------------------------------------------------------: |
| Slurmマネージャ  | slurm-srv                                                        |
| Slurmクライアント | slurm-cli                                                        |
| 計算ノード       | inst-aaaaa-x9<br>inst-bbbbb-x9<br>inst-ccccc-x9<br>inst-ddddd-x9 |
| GPUノード      | inst-aaaaa-ao<br>inst-bbbbb-ao                                   |

また、各サブシステムのセキュリティーに関するOS設定は、 **firewalld** を停止し、 **SELinux** をDisabledにします。

# 2. 環境構築

## 2-0. 概要

本章は、既に作成されている **[1. 前提システム](#1-前提システム)** で解説したシステム上で、 **Slurm** 環境を構築します。

**Slurm** のインストールは、多数の計算/GPUノードに効率よくインストールする必要から、rpmbuildで作成するRPMパッケージによるインストール方法を採用します。

本テクニカルTipsは、各ソフトウェアに以下を使用します。

- **Slurm** ： 25.05.3
- **PMIx** ： **[OpenPMIx](https://openpmix.github.io/)** 5.0.8
- **UCX** ： **[OpenUCX](https://openucx.readthedocs.io/en/master/index.html#)** 1.19.0

また、 **Slurm** のプロセス間通信の認証に **[munge](https://dun.github.io/munge/)** 、ジョブのアカウンティング情報格納用RDBMSに **[MariaDB](https://mariadb.org/)** を使用します。

以上より、本章で解説する環境構築は、以下の手順に沿って行います。

1. **[mungeインストール](#2-1-mungeインストール)**
2. **[MariaDBインストール](#2-2-mariadbインストール)**
3. **[OpenPMIxインストール](#2-3-openpmixインストール)**
4. **[OpenUCXインストール](#2-4-openucxインストール)**
5. **[Slurm RPMパッケージ作成](#2-5-slurm-rpmパッケージ作成)**
6. **[Slurm RPMパッケージインストール](#2-6-slurm-rpmパッケージインストール)**
7. **[Slurm設定ファイル作成](#2-7-slurm設定ファイル作成)**
8. **[Slurmサービス起動](#2-8-slurmサービス起動)**
9. **[Slurm利用に必要な環境変数設定](#2-9-slurm利用に必要な環境変数設定)**

なお、各ソフトウェアと **Slurm** サービスは、以下のサブシステムにインストールします。

|                          | Slurmマネージャ | Slurmクライアント | 計算/GPUノード |
| :----------------------: | :--------: | :---------: | :---: |
| **munge**                | 〇          | 〇           | 〇     |
| **MariaDB**              | 〇          | -           | -     |
| **OpenPMIx**             | 〇          | 〇（※7）       | 〇（※7） |
| **OpenUCX**              | 〇          | 〇（※7）       | 〇（※7） |
| **slurmctld**            | 〇          | -           | -     |
| **slurmdbd**             | 〇          | -           | -     |
| **slurmd**               | -          | -           | 〇     |
| **Slurm**<br>クライアントパッケージ | 〇          | 〇           | 〇     |

※7）**[1. 前提システム](#1-前提システム)** の構築手順により既にインストールされています。

## 2-1. mungeインストール

以下コマンドを全ノードのopcユーザで実行し、 **munge** プロセス起動ユーザを作成します。

```sh
$ sudo useradd -m -d /var/lib/munge -s /sbin/nologin -u 5001 munge
```

次に、以下コマンドを全ノードのopcユーザで実行し、 **munge** をインストールします。

```sh
$ sudo yum-config-manager --enable ol9_codeready_builder
$ sudo dnf install -y munge munge-libs
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

次に、Slurmマネージャで作成した **munge** キーファイルを、Slurmクライアントと全ての計算/GPUノードに同一パス・ファイル名でコピーします。  
この際、ファイルのオーナーとパーミッションがSlurmマネージャのキーファイルと同じとなるよう配慮します。

次に、以下コマンドを全ノードのopcユーザで実行し、 **munge** サービスを起動します。

```sh
$ sudo systemctl enable --now munge.service
```

次に、以下コマンドを全ノードのopcユーザで実行し、 **munge** が全てのノードで正常に動作していることを確認します。

```sh
$ munge -n | unmunge | grep STATUS
STATUS:           Success (0)
$
```

## 2-2. MariaDBインストール

以下コマンドをSlurmマネージャのopcユーザで実行し、 **MariaDB** をインストールします。

```sh
$ sudo dnf install -y mariadb-server
```

次に、 **MariaDB** の設定ファイル（ **mariadb-server.cnf** ）の **[mysqld]** フィールドに以下の記述を追加します。

```sh
$ sudo diff /etc/my.cnf.d/mariadb-server.cnf_org  /etc/my.cnf.d/mariadb-server.cnf
20a21,22
> innodb_buffer_pool_size=4096M
> innodb_lock_wait_timeout=900
$
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、 **MariaDB** サービスを起動します。

```sh
$ sudo systemctl enable --now mariadb
```

次に、 **MariaDB** のデータベースに以下の登録を行うため、

- データベース（slurm_acct_db）
- ユーザ（slurm）
- ユーザ（slurm）のパスワード
- ユーザ（slurm）に対するデータベース（slurm_acct_db）への全権限付与

以下コマンドをSlurmマネージャのopcユーザで実行します。  
なお、 **MariaDB** に対して入力するコマンドは、 **MariaDB** のプロンプト（ **MariaDB [(none)]>** ）に続く文字列です。  
また、コマンド中の **passcord** は、自身の設定するパスワードに置き換えます。

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

MariaDB [(none)]> exit
Bye
$
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、先に登録したデータベースとユーザが正しく登録されていることを確認します。  
なお、コマンド中の **passcord** は、自身の設定したパスワードに置き換えます。

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

## 2-3. OpenPMIxインストール

以下コマンドをSlurmマネージャのopcユーザで実行し、 **OpenPMIx** を **/opt/pmix** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。また、インストール対象のイメージがHPC / GPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** のどちらかにより実行するコマンドが異なる点に留意します。

```sh
$ sudo dnf install -y ncurses-devel openssl-devel gcc-c++ gcc-gfortran
$ mkdir -p ~/`hostname` && cd ~/`hostname` &&  wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
$ tar -xvf ./libevent-2.1.12-stable.tar.gz
$ cd libevent-2.1.12-stable && ./configure --prefix=/opt/libevent
$ make -j 16 && sudo make install; echo $?
$ cd ~/`hostname` && wget https://download.open-mpi.org/release/hwloc/v2.12/hwloc-2.12.2.tar.gz
$ tar -xvf ./hwloc-2.12.2.tar.gz
$ cd hwloc-2.12.2 && ./configure --prefix=/opt/hwloc # For HPC
$ cd hwloc-2.12.2 && ./configure --prefix=/opt/hwloc --with-cuda=/usr/local/cuda # For GPU
$ make -j 16 && sudo make install; echo $?
$ cd ~/`hostname` && wget https://github.com/openpmix/openpmix/releases/download/v5.0.8/pmix-5.0.8.tar.gz
$ tar -xvf ./pmix-5.0.8.tar.gz
$ cd pmix-5.0.8 && ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
$ make -j 16 && sudo make install; echo $?
```

## 2-4. OpenUCXインストール

以下コマンドをSlurmマネージャのopcユーザで実行し、 **OpenUCX** を **/opt/ucx** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。また、インストール対象のイメージがHPC / GPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** のどちらかにより実行するコマンドが異なる点に留意します。

```sh
$ cd ~/`hostname` && wget https://github.com/openucx/ucx/releases/download/v1.19.0/ucx-1.19.0.tar.gz
$ tar -xvf ./ucx-1.19.0.tar.gz
$ cd ucx-1.19.0 && ./contrib/configure-release --prefix=/opt/ucx # For Oracle Linux 9 HPC
$ cd ucx-1.19.0 && ./contrib/configure-release --prefix=/opt/ucx --with-cuda=/usr/local/cuda # For Oracle Linux 9 GPU
$ make -j 16 && sudo make install; echo $?
```

## 2-5. Slurm RPMパッケージ作成

以下コマンドをSlurmマネージャのopcユーザで実行し、前提RPMパッケージをインストールします。

```sh
$ sudo yum-config-manager --enable ol9_codeready_builder
$ sudo dnf install -y mariadb-devel munge-devel pam-devel readline-devel dbus-devel
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、 **Slurm** RPMパッケージを作成します。

```sh
$ cd ~/`hostname` && wget https://download.schedmd.com/slurm/slurm-25.05.3.tar.bz2
$ rpmbuild --define '_prefix /opt/slurm' --define '_slurm_sysconfdir /opt/slurm/etc' --define '_with_pmix --with-pmix=/opt/pmix' --define '_with_ucx --with-ucx=/opt/ucx' -ta ./slurm-25.05.3.tar.bz2; echo $?
```

作成されたパッケージは、以下のディレクトリに配置されるので、これらの全ファイルを他のサブシステムにコピーします。

```sh
$ ls -1 ~/rpmbuild/RPMS/x86_64/
slurm-25.05.3-1.el9.x86_64.rpm
slurm-contribs-25.05.3-1.el9.x86_64.rpm
slurm-devel-25.05.3-1.el9.x86_64.rpm
slurm-example-configs-25.05.3-1.el9.x86_64.rpm
slurm-libpmi-25.05.3-1.el9.x86_64.rpm
slurm-openlava-25.05.3-1.el9.x86_64.rpm
slurm-pam_slurm-25.05.3-1.el9.x86_64.rpm
slurm-perlapi-25.05.3-1.el9.x86_64.rpm
slurm-sackd-25.05.3-1.el9.x86_64.rpm
slurm-slurmctld-25.05.3-1.el9.x86_64.rpm
slurm-slurmd-25.05.3-1.el9.x86_64.rpm
slurm-slurmdbd-25.05.3-1.el9.x86_64.rpm
slurm-torque-25.05.3-1.el9.x86_64.rpm
$
```

## 2-6. Slurm RPMパッケージインストール

以下コマンドをSlurmマネージャのopcユーザで実行し、Slurmマネージャに必要な **Slurm** RPMパッケージのインストールを行います。

```sh
$ cd ~/rpmbuild/RPMS/x86_64/ && sudo rpm -ivh ./slurm-25.05.3-1.el9.x86_64.rpm ./slurm-slurmctld-25.05.3-1.el9.x86_64.rpm ./slurm-slurmdbd-25.05.3-1.el9.x86_64.rpm ./slurm-perlapi-25.05.3-1.el9.x86_64.rpm
$ sudo useradd -m -d /var/lib/slurm -s /bin/bash -u 5000 slurm
$ sudo mkdir /var/spool/slurmctld && sudo chown slurm:slurm /var/spool/slurmctld
$ sudo mkdir /var/spool/slurmd && sudo chown slurm:slurm /var/spool/slurmd
$ sudo mkdir /var/log/slurm && sudo chown slurm:slurm /var/log/slurm
$ sudo mkdir /opt/slurm/etc && sudo chown slurm:slurm /opt/slurm/etc
$ sudo su - slurm
$ echo "export PATH=/opt/slurm/sbin:/opt/slurm/bin:\$PATH" | tee -a ~/.bashrc
```

次に、以下コマンドを全ての計算/GPUノードのopcユーザで **Slurm** RPMパッケージをコピーしたディレクトリで実行し、計算/GPUノードに必要な **Slurm** RPMパッケージのインストール・セットアップを行います。

```sh
$ sudo yum-config-manager --enable ol9_codeready_builder
$ sudo dnf install -y mariadb-devel
$ sudo rpm -ivh ./slurm-25.05.3-1.el9.x86_64.rpm ./slurm-slurmd-25.05.3-1.el9.x86_64.rpm ./slurm-perlapi-25.05.3-1.el9.x86_64.rpm
$ sudo useradd -m -d /var/lib/slurm -s /bin/bash -u 5000 slurm
$ sudo mkdir /var/spool/slurmd && sudo chown slurm:slurm /var/spool/slurmd
$ sudo mkdir /var/log/slurm && sudo chown slurm:slurm /var/log/slurm
$ sudo mkdir /opt/slurm/etc && sudo chown slurm:slurm /opt/slurm/etc
```

次に、以下コマンドをSlurmクライアントのopcユーザで **Slurm** RPMパッケージをコピーしたディレクトリで実行し、Slurmクライアントに必要な **Slurm** RPMパッケージのインストール・セットアップを行います。

```sh
$ sudo yum-config-manager --enable ol9_codeready_builder
$ sudo dnf install -y mariadb-devel
$ sudo rpm -ivh ./slurm-25.05.3-1.el9.x86_64.rpm ./slurm-perlapi-25.05.3-1.el9.x86_64.rpm
$ sudo useradd -m -d /var/lib/slurm -s /bin/bash -u 5000 slurm
$ sudo mkdir /opt/slurm/etc && sudo chown slurm:slurm /opt/slurm/etc
```

## 2-7. Slurm設定ファイル作成

本章は、以下5種類の **Slurm** 設定ファイルを作成し、これらを各サブシステムの **/opt/slurm/etc** ディレクトリに配布します。  
この際、これらファイルのオーナーユーザ・オーナーグループを **slurm** とします。  
また、 **slurmdbd.conf** のパーミッションを **600** に設定します。

- **slurm.conf**（全てのサブシステム）
- **slurmdbd.conf**（Slurmマネージャ）
- **mpi.conf**（Slurmマネージャ）
- **cgroup.conf**（Slurmマネージャ・GPUノード）（GPUクラスタの場合のみ使用します。）
- **gres.conf**（GPUノード）（GPUクラスタの場合のみ使用します。）

[ **slurm.conf** （HPCクラスタ用）]
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
NodeName=inst-aaaaa-x9,inst-bbbbb-x9,inst-ccccc-x9,inst-ddddd-x9 Sockets=2 CoresPerSocket=18 ThreadsPerCore=1 RealMemory=500000 TmpDisk=10000 State=UNKNOWN
PartitionName=sltest Nodes=ALL Default=YES MaxTime=INFINITE State=UP
TaskPlugin=task/affinity
```

なお、 **SlurmctldHost** 、 **AccountingStorageHost** 、及び **NodeName** の設定値は、自身の環境に合わせて修正します。

[ **slurm.conf** （GPUクラスタ用）]
```sh
ClusterName=sltest
SlurmctldHost=slurm-srv
AuthType=auth/munge
PluginDir=/opt/slurm/lib64/slurm
SchedulerType=sched/backfill
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
#
# For per-GPU scheduling
AccountingStorageTRES=gres/gpu
DebugFlags=CPU_Bind,gres
GresTypes=gpu
JobAcctGatherType=jobacct_gather/cgroup
SelectType=select/cons_tres
TaskPlugin=task/cgroup,task/affinity
#
# GPU node specifications
NodeName=inst-aaaa-ao Gres=gpu:nvidia_a100-sxm4-40gb:8 Sockets=2 CoresPerSocket=32 ThreadsPerCore=1 RealMemory=2000000 TmpDisk=10000 State=UNKNOWN
NodeName=inst-bbbb-ao Gres=gpu:nvidia_a100-sxm4-40gb:8 Sockets=2 CoresPerSocket=32 ThreadsPerCore=1 RealMemory=2000000 TmpDisk=10000 State=UNKNOWN
PartitionName=sltest Nodes=ALL DefMemPerGPU=250000 Default=YES MaxTime=INFINITE State=UP
```

なお、 **SlurmctldHost** 、 **AccountingStorageHost** 、及び **NodeName** の設定値は、自身の環境に合わせて修正します。  
また、 **DefMemPerGPU** の値は、自身の使用するGPUノードに合わせて **RealMemory** に指定した値を搭載するGPU数で割った値（※8）とします。

※8）ここで指定しているGPU当たりのホストメモリ量以上のジョブを投入する場合は、以下のようにジョブが使用する総ホストメモリ量を **- –mem=xxxx** オプションで指定します。

```sh
$ srun -p sltest --gres=gpu:nvidia_a100-sxm4-40gb:4 --mem=1500000M ./a.out
```

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
PMIxDirectConnEarly=true
PMIxDirectConnUCX=true
```

[ **cgroup.conf** ]
```sh
ConstrainCores=yes 
ConstrainDevices=yes
ConstrainRAMSpace=yes
```

[ **gres.conf** ]
```sh
Name=gpu Type=nvidia_a100-sxm4-40gb File=/dev/nvidia[0-3] COREs=[0-31]
Name=gpu Type=nvidia_a100-sxm4-40gb File=/dev/nvidia[4-7] COREs=[32-63]
```

上記 **gres.conf** は、GPU番号0～3とCPUコア番号0～31、GPU番号4～7とCPUコア番号32～63のアフィニティを定義しており、ジョブが要求するGPUとCPUコアのリソースがこれを維持できる範囲で定義したアフィニティに従いリソース割り当てを行い、維持できない場合はこれを無視してリソースを割り当てます。  
このアフィニティの維持を強制する場合は、 **--gres-flags=enforce-binding** オプションを指定してジョブを投入します。これにより、アフィニティを維持できるGPUとCPUコアが空くまでジョブの実行を延期するか、指定したリソースがそもそも定義したアフィニティを満たせない場合（4個以下のGPUと33個以上のCPUコア等）はこのジョブの投入を拒否します。

## 2-8. Slurmサービス起動

以下コマンドを全ての計算/GPUノードのopcユーザで実行し、 **slurmd** を起動します。

```sh
$ sudo systemctl enable --now slurmd
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、 **slurmdbd** と **slurmctld** を起動します。

```sh
$ sudo systemctl enable --now slurmdbd
$ sudo systemctl enable --now slurmctld
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、全ての計算ノードがアイドルになっていることを確認します。

```sh
$ sudo su - slurm -c sinfo
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
sltest*      up   infinite      4   idle inst-aaaaa-x9,inst-bbbbb-x9,inst-ccccc-x9,inst-ddddd-x9
$
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、 **PMIx** が利用可能になっていることを確認します。

```sh
$ sudo su - slurm -c "srun --mpi=list"
MPI plugin types are...
	none
	cray_shasta
	pmi2
	pmix
specific pmix plugin versions available: pmix_v5
$
```

## 2-9. Slurm利用に必要な環境変数設定

以下コマンドをSlurmクライアントのジョブ投入ユーザで実行し、 **Slurm** を利用するための環境変数を設定します。

```sh
$ echo "export PATH=/opt/slurm/sbin:/opt/slurm/bin:\$PATH" | tee -a ~/.bashrc
```

# 3. 稼働確認

## 3-0. 概要

本章は、構築した **Slurm** 環境の稼働確認を実施します。  
この際、対象がHPCクラスタかGPUクラスタかにより、以下の確認項目を実施します。

- HPCクラスタ
	- **OSU Micro-Benchmarks** で2ノード間のレイテンシを計測し **PMIx** の効果を確認
	- **OSU Micro-Benchmarks** で4ノード間のMPI_Init所要時間を計測し **PMIx** の効果を確認
	- 実行したバッチジョブがアカウンティング情報に記録されていることを確認
- GPUクラスタ
	- GPUリソース割り当てが想定通りに行われることを確認
	- ノード内GPUデバイスメモリ間レイテンシを **OSU Micro-Benchmarks** で確認
	- ノード内GPUデバイスメモリ間帯域幅を **OSU Micro-Benchmarks** で確認
	- 使用したGPUリソースがジョブアカウンティング情報に記録されることを確認
	- 設定したGPU/CPUアフィニティが想定通りに行われることを確認

## 3-1. HPCクラスタ向け稼働確認

以下のスクリプトをファイル名 **srun.sh** で作成します。

```sh
#!/bin/bash
#SBATCH -p sltest
#SBATCH -n 144
#SBATCH -N 4
#SBATCH -J srun
#SBATCH -o stdout.%J
#SBATCH -e stderr.%J

module load openmpi omb
export UCX_NET_DEVICES=mlx5_2:1

echo "Start osu_latency"
srun -n 2 -N 2 osu_latency -x 1000 -i 10000 -m 1:1
echo
echo "Start osu_init"
srun osu_init
```

次に、以下コマンドをSlurmクライアントのジョブ投入ユーザで実行し、バッチジョブの投入とその結果確認を行います。

```sh
$ sbatch srun.sh
Submitted batch job 3
$ cat stdout.3
Start osu_latency

# OSU MPI Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.51

Start osu_init
# OSU MPI Init Test v7.5
nprocs: 144, min: 2032 ms, max: 2054 ms, avg: 2048 ms
$
```

次に、以下のコマンドを計算ノードのうちの1ノードでジョブ投入ユーザで実行し、インタラクティブに **mpirun** で起動する場合の結果を確認します。

```sh
$ module load openmpi omb
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 -x PATH osu_latency -x 1000 -i 10000 -m 1:1
[inst-xsyjo-x9-ol905:263038] SET UCX_NET_DEVICES=mlx5_2:1

# OSU MPI Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.67
$ mpirun -n 144 -N 36 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 -x PATH osu_init
[inst-ntoae-x9-ol810:52203] SET UCX_NET_DEVICES=mlx5_2:1
# OSU MPI Init Test v7.5
nprocs: 144, min: 2163 ms, max: 2215 ms, avg: 2182 ms
$
```

この結果より、2ノード間のレイテンシが約 **0.2 μ秒** 改善されていることがわかります。  
4ノード間のMPI_Init所要時間は、目立った差異が見られませんが、16ノード576MPIプロセスでその差を比較した場合は、以下のように **20パーセント** 程度の性能向上が見られます。

|          | 4ノード間のMPI_Init所要時間 |
| :------: | ------------------: |
| バッチジョブ   | 3,878 ms           |
| インタラクティブ | 4,981 ms           |

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

## 3-2. GPUクラスタ向け稼働確認

以下コマンドをSlurmクライアントの **Slurm** 利用ユーザで実行し、 **Slurm** が割り当てるGPU数が **- -gres** オプションの指定通りとなっていることを確認します。  
また、最後のコマンドの出力から、GPU番号とそのPCIバスIDの8個の組み合わせを記録しておきます。

```sh
$ srun -p sltest -n 1 --gres=gpu:nvidia_a100-sxm4-40gb:1 nvidia-smi | grep SXM
|   0  NVIDIA A100-SXM4-40GB          On  |   00000000:51:00.0 Off |                    0 |
$ srun -p sltest -n 1 --gres=gpu:nvidia_a100-sxm4-40gb:2 nvidia-smi | grep SXM
|   0  NVIDIA A100-SXM4-40GB          On  |   00000000:51:00.0 Off |                    0 |
|   1  NVIDIA A100-SXM4-40GB          On  |   00000000:54:00.0 Off |                    0 |
$ srun -p sltest -n 1 --gres=gpu:nvidia_a100-sxm4-40gb:4 nvidia-smi | grep SXM
|   0  NVIDIA A100-SXM4-40GB          On  |   00000000:0F:00.0 Off |                    0 |
|   1  NVIDIA A100-SXM4-40GB          On  |   00000000:15:00.0 Off |                    0 |
|   2  NVIDIA A100-SXM4-40GB          On  |   00000000:51:00.0 Off |                    0 |
|   3  NVIDIA A100-SXM4-40GB          On  |   00000000:54:00.0 Off |                    0 |
$ srun -p sltest -n 1 --gres=gpu:nvidia_a100-sxm4-40gb:8 nvidia-smi | grep SXM
|   0  NVIDIA A100-SXM4-40GB          On  |   00000000:0F:00.0 Off |                    0 |
|   1  NVIDIA A100-SXM4-40GB          On  |   00000000:15:00.0 Off |                    0 |
|   2  NVIDIA A100-SXM4-40GB          On  |   00000000:51:00.0 Off |                    0 |
|   3  NVIDIA A100-SXM4-40GB          On  |   00000000:54:00.0 Off |                    0 |
|   4  NVIDIA A100-SXM4-40GB          On  |   00000000:8D:00.0 Off |                    0 |
|   5  NVIDIA A100-SXM4-40GB          On  |   00000000:92:00.0 Off |                    0 |
|   6  NVIDIA A100-SXM4-40GB          On  |   00000000:D6:00.0 Off |                    0 |
|   7  NVIDIA A100-SXM4-40GB          On  |   00000000:DA:00.0 Off |                    0 |
$ srun -p sltest -n 1 --gres=gpu:nvidia_a100-sxm4-40gb:8 nvidia-smi | grep SXM | awk '{print $2, $7}'
0 00000000:0F:00.0
1 00000000:15:00.0
2 00000000:51:00.0
3 00000000:54:00.0
4 00000000:8D:00.0
5 00000000:92:00.0
6 00000000:D6:00.0
7 00000000:DA:00.0
$
```

次に、以下コマンドをSlurmクライアントの **Slurm** 利用ユーザで実行し、GPUデバイスメモリ間のレイテンシを確認します。

```sh
$ module load openmpi omb
$ srun -p sltest -n 2 --gres=gpu:nvidia_a100-sxm4-40gb:2 osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D D

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       2.37
$
```

次に、以下コマンドをSlurmクライアントの **Slurm** 利用ユーザで実行し、GPUデバイスメモリ間の帯域幅を確認します。

```sh
$ srun -p sltest -n 2 --gres=gpu:nvidia_a100-sxm4-40gb:2 osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D D

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456          279577.30
$
```

次に、以下コマンドをSlurmクライアントの **Slurm** 利用ユーザで実行し、実行したジョブが使用したGPUリソースが当該ジョブのアカウンティング情報に記録されていることを確認します。  
なお、ユーザ名とジョブIDは自身の環境のものに置き換えます。

```sh
$ sacct -u usera -o JobID,JobName,State | tail -2
4                osu_bw  COMPLETED 
4.0              osu_bw  COMPLETED 
$ sacct -j 4 -o JobID,AllocTRES%50
JobID                                                 AllocTRES 
------------ -------------------------------------------------- 
4                 billing=2,cpu=2,gres/gpu=2,mem=500000M,node=1 
4.0                         cpu=2,gres/gpu=2,mem=500000M,node=1
$
```

次に、以下のスクリプトをSlurmクライアントの **Slurm** 利用ユーザでファイル名 **gpu_affinity.sh** で作成します。  
このスクリプトは、4枚のGPU（ノードに搭載するGPU数の半分）と32個のCPUコア（ノードに搭載するCPUコア数の半分）を要求し、自身が割り当てられたGPUのPCIバスIDとCPUコア番号を表示します。

```sh
#!/bin/bash
#SBATCH -p sltest
#SBATCH -n 32
#SBATCH -N 1
#SBATCH --gres=gpu:nvidia_a100-sxm4-40gb:4
#SBATCH -o stdout.%J
#SBATCH -e stderr.%J

sleep 10
srun -n 1 nvidia-smi | grep SXM | awk '{print $2, $7}'
srun bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
```

次に、以下コマンドをSlurmクライアントの **Slurm** 利用ユーザで実行し、投入した2本のジョブが同時に実行中になること、先の8枚のGPUを使用した **nvidia-smi** コマンドの出力と比較し割り当てられたGPUとCPUコアが同一ソケットに接続するものであることを確認します。  
なお、GPUノードに使用している **BM.GPU4.8** は、CPUソケットを2個搭載し、ソケット番号0側にGPU番号0～3とCPUコア番号0～31を収容し、ソケット番号1側にGPU番号4～7とCPUコア番号32～63を収容することに留意します。

```sh
$ for i in `seq 1 2`; do sbatch gpu_affinity.sh; done
Submitted batch job 5
Submitted batch job 6
$ squeue 
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
                 6    sltest gpu_affi    usera  R       0:01      1 inst-aaaa-ao
                 5    sltest gpu_affi    usera  R       0:02      1 inst-bbbb-ao

$ cat stdout.5
0 00000000:0F:00.0
1 00000000:15:00.0
2 00000000:51:00.0
3 00000000:54:00.0
Rank 0 Node 0 Core 0
Rank 1 Node 0 Core 1
:
:
:
Rank 30 Node 0 Core 30
Rank 31 Node 0 Core 31
$ cat stdout.6
0 00000000:8D:00.0
1 00000000:92:00.0
2 00000000:D6:00.0
3 00000000:DA:00.0
Rank 0 Node 0 Core 32
Rank 1 Node 0 Core 33
:
:
:
Rank 30 Node 0 Core 62
Rank 31 Node 0 Core 63
$
```

次に、以下コマンドをSlurmクライアントの **Slurm** 利用ユーザで実行し、 **--gres-flags=enforce-binding** オプション指定の有無により、定義したGPUとCPUコアのアフィニティを満たせないリソース（4個のGPUと33個のCPUコア）を要求するジョブの投入可否が変化することを確認します。

```sh
$ srun -p sltest -n 33 --gres=gpu:nvidia_a100-sxm4-40gb:4 bash -c "true"
$ srun -p sltest -n 33 --gres=gpu:nvidia_a100-sxm4-40gb:4 --gres-flags=enforce-binding bash -c "true"
srun: error: Unable to allocate resources: Requested node configuration is not available
$
```