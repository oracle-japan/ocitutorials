---
title: "Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法"
excerpt: "OpenMPIは、最新のMPI言語規格に準拠し、HPC/機械学習ワークロード実行に必要とされる様々な機能を備えたオープンソースのMPI実装です。OpenMPIで作成したアプリケーションのHPC/GPUクラスタに於ける実行は、計算リソース有効利用の観点から通常ジョブスケジューラを介したバッチジョブとして行いますが、ジョブスケジューラがSlurmの場合、PMIxを使用することでMPIアプリケーションの起動や通信初期化のスケーラビリティを向上させることが可能です。またUCXは、OpenMPIがクラスタ・ネットワークを利用して高帯域・低遅延のMPIプロセス間通信を実現するために欠かせない通信フレームワークです。本テクニカルTipsは、PMIxを使用するSlurm環境で通信フレームワークにUCXの使用を前提とするOpenMPI構築方法を解説します。"
order: "351"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

**[Slurm](https://slurm.schedmd.com/)** 環境で **[OpenMPI](https://www.open-mpi.org/)** のアプリケーションを実行する場合、計算リソース確保、MPIプロセス起動、及びMPIプロセス間通信初期化をそれぞれ誰が行うか、ノード間リモート実行と起動コマンドに何を使用するかにより、以下3種類の動作モードが存在します。

| No. | 計算リソース<br>確保  | MPIプロセス<br>起動                                                                   | MPIプロセス間<br>通信初期化                                                   | ノード間<br>リモート実行|起動コマンド     |
| :-: | :-------: | :-------: | :-------------------------------------------------------------------------: | :---------------------------------------------------------------: | :--------: |
| 1.  | **Slurm** | **Slurm**     |  **[PMIx](https://pmix.github.io/)**                                      | **Slurm** |**srun**   |
| 2.  | **Slurm** | **Slurm**  |  **PMIx**  | **Slurm** |**mpirun**<br>（※1） |
| 3.  | **Slurm** | **[PRRTE](https://docs.prrte.org/en/latest/)**  |  **PMIx**  | **SSH**<br>（※2） |**mpirun** |

※1）本テクニカルTipsの手順に従い、 **Slurm** と連携するよう **OpenMPI** がビルドされている必要があります。  
※2）パスフレーズ無しで計算ノード間をSSHアクセス出来るよう設定する必要があります。

ここで **No. 1.** の動作モードは、その他の動作モードに対して以下の利点があります。

- 高並列アプリケーションを高速に起動することが可能（※3）
- プロセスバインディングや終了処理等のプロセス管理を **Slurm** に統合することが可能
- 精度の高いアカウンティング情報を **Slurm** に提供することが可能
- **Slurm** クラスタ内のパスフレーズ無しSSHアクセス設定が不要

※3）この詳細は、**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** の **[0. 概要](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/#0-概要)** を参照してください。

また **[UCX](https://openucx.org/)** は、HPCでの利用を念頭に開発されているオープンソースの通信フレームワークで、 **OpenMPI** から利用可能な以下のノード内・ノード間通信手段を提供します。

[ノード内]
- POSIX共有メモリ
- SYSTEM V共有メモリ
- **[Cross Memory Attach (CMA)](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=fcf634098c00dd9cd247447368495f0b79be12d1)**
- **[KNEM](https://knem.gitlabpages.inria.fr/)**
- **[XPMEM](https://github.com/hpc/xpmem)**

[ノード間]
- InfiniBandトランスポート
    - Unreliable Datagram (UD)
    - Reliable Connected (RC)
    - Dynamically Connected (DC)
- TCP

特に **UCX** を使用するノード間通信は、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を介してInfiniBandトランスポートを使用したRDMA通信を行うことで、高帯域・低遅延のMPIプロセス間通信を実現します。

以上の利点を享受するべく本テクニカルTipsは、 **Slurm** 環境でMPIアプリケーションを **No. 1.** の動作モードで実行すること、通信フレームワークに **UCX** を使用することを想定し、このための **OpenMPI** の構築方法を解説、構築した **OpenMPI** のノード間MPI通信性能の確認とOpenMPとのハイブリッドプログラム稼働確認を目的として、以下のアプリケーションを実行します。

-  **[Intel MPI Benchmarks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)**
- **[NAS Parallel Benchmarks](https://www.nas.nasa.gov/software/npb.html)**

本テクニカルTipsは、以下の環境を前提とします。

- シェイプ ： **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)**
- OS ： **Oracle Linux** 8.10ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※1）
- **OpenMPI** ： 5.0.6
- **PMIx** ： **[OpenPMIx](https://openpmix.github.io/)** 5.0.4
- **UCX** : **[OpenUCX](https://openucx.readthedocs.io/en/master/index.html#)** 1.17.0

※1）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** です。

またこれらをインストールする **BM.Optimized3.36** のインスタンスは、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** でノード間を接続し、稼働確認を行うために少なくとも2ノード用意します。  
この構築手順は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ手動構築編)](/ocitutorials/hpc/spinup-cluster-network/)** が参考になります。

なお、ここで構築する **OpenMPI** と連携する **Slurm** の構築方法は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** を参照してください。  

***
# 1. インストール・セットアップ

## 1-0. 概要

本章は、予めデプロイしている **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続する **BM.Optimized3.36** のインスタンスに **OpenMPI** 、 **OpenPMIx** 、 **OpenUCX** 及びこれらの前提ソフトウェア・rpmパッケージをインストールし、MPIプログラムのコンパイル・実行のためのセットアップを実施します。

以降の作業は、MPIプログラムのコンパイル・実行を行う全てのノードで実施します。

## 1-1. 前提ソフトウェア・rpmパッケージインストール

以下コマンドをopcユーザで実行し、前提rpmパッケージのインストールと前提ソフトウェアである **libevent** ・ **hwloc** ・ **XPMEM** の **/opt** ディレクトリへのインストールを実施します。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ sudo dnf install -y ncurses-devel openssl-devel gcc-c++ gcc-gfortran git
$ cd ~; wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
$ tar -xvf ./libevent-2.1.12-stable.tar.gz
$ cd libevent-2.1.12-stable; ./configure --prefix=/opt/libevent
$ make -j 36 && sudo make install
$ cd ~; wget https://download.open-mpi.org/release/hwloc/v2.11/hwloc-2.11.2.tar.gz
$ tar -xvf ./hwloc-2.11.2.tar.gz
$ cd hwloc-2.11.2; ./configure --prefix=/opt/hwloc
$ make -j 36 && sudo make install
$ cd ~; git clone https://github.com/hpc/xpmem.git
$ cd xpmem; ./autogen.sh && ./configure --prefix=/opt/xpmem
$ make -j 36 && sudo make install
```

ここで **OpenUCX** から利用する **KNEM** は、 **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** に含まれるもの（ **/opt/knem-1.1.4.90mlnx3** ）を使用するため、ここでは改めてインストールしません。

## 1-2. OpenPMIxインストール

以下コマンドをopcユーザで実行し、 **OpenPMIx** を **/opt** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ cd ~; wget https://github.com/openpmix/openpmix/releases/download/v5.0.4/pmix-5.0.4.tar.gz
$ tar -xvf ./pmix-5.0.4.tar.gz
$ cd pmix-5.0.4; ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
$ make -j 36 && sudo make install
```

## 1-3. OpenUCXインストール

以下コマンドをopcユーザで実行し、 **OpenUCX** を **/opt** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ cd ~; wget https://github.com/openucx/ucx/releases/download/v1.17.0/ucx-1.17.0.tar.gz
$ tar -xvf ./ucx-1.17.0.tar.gz
$ cd ucx-1.17.0; ./contrib/configure-release --prefix=/opt/ucx --with-knem=/opt/knem-1.1.4.90mlnx3 --with-xpmem=/opt/xpmem
$ make -j 36 && sudo make install
```

ここでは、 **KNEM** と **XPMEM** を **OpenUCX** から利用出来るようにビルドしています。

## 1-4. OpenMPIインストール

以下コマンドをopcユーザで実行し、 **OpenMPI** を **/opt** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ cd ~; wget https://download.open-mpi.org/release/open-mpi/v5.0/openmpi-5.0.6.tar.gz
$ tar -xvf ./openmpi-5.0.6.tar.gz
$ cd openmpi-5.0.6; ./configure --prefix=/opt/openmpi-5.0.6 --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-ucx=/opt/ucx --with-slurm
$ make -j 36 all && sudo make install
```

ここでは、先にインストールした **OpenUCX** を **OpenMPI** から利用出来るよう、また **Slurm** から **OpenPMIx** を使用して **1.** の動作モードで **OpenMPI** のアプリケーションを実行できるようにビルドしています。

## 1-5. セットアップ

本章は、 **OpenMPI** を利用するユーザがMPIプログラムをコンパイル・実行するために必要な環境のセットアップを行います。  
ここでは、このユーザのホームディレクトリがノード間で共有されていることを前提に、以下の手順を何れか1ノードで **OpenMPI** を利用するユーザで実施します。  
このユーザのホームディレクトリが共有されていない場合は、 **OpenMPI** を実行する全てのノードでこれを実行します。

以下コマンド実行し、MPIプログラムのコンパイル・実行に必要な環境変数を設定します。

```sh
$ echo "export PATH=/opt/openmpi-5.0.6/bin:/opt/ucx/bin:\$PATH" | tee -a ~/.bashrc
$ source ~/.bashrc
```

次に、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[計算/GPUノードのホスト名リスト作成方法](/ocitutorials/hpc/tech-knowhow/compute-host-list/)** の手順に従い、MPIプログラムを実行する全てのホスト名を記載したホストリストファイルを当該ユーザのホームディレクトリ直下に **hostlist.txt** として作成します。（※2）

※2）ここで作成するホストリストファイルは、 **OpenMPI** 単独で稼働確認を行うために作成しますが、 **Slurm** 環境では必要ありません。

次に以下コマンドを実行し、MPIプログラムを実行する全てのノード間でパスフレーズ無しでSSHアクセス出来るように設定します。（※3）  
このユーザのホームディレクトリが共有されていない場合は、1ノードで以下の手順を実行し、作成した **id_rsa** 、 **authorized_keys** 、 及び **known_hosts** の3個のファイルをパーミッションを維持して **OpenMPI** を実行する全てのノードの同じディレクトリに配置します。

```sh
$ cd ~; mkdir .ssh; chmod 700 .ssh
$ ssh-keygen -t rsa -N "" -f .ssh/id_rsa
$ cd .ssh; cat ./id_rsa.pub >> ./authorized_keys; chmod 600 ./authorized_keys
$ for hname in `cat ~/hostlist.txt`; do echo $hname; ssh -oStrictHostKeyChecking=accept-new $hname :; done
```

※3）ここで実施するパスフレーズ無しのSSHアクセスのための手順は、 **OpenMPI** 単独で稼働確認を行うために実施しますが、 **PMIx** を使用する **Slurm** 環境では必要ありません。

***
# 2. 稼働確認

## 2-0. 概要

本章は、インストールした **OpenMPI** を稼働確認するため、 **Intel MPI Benchmarks** と **NAS Parallel Benchmarks** を実行します。

## 2-1. Intel MPI Benchmarks実行

**[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[Intel MPI Benchmarks実行方法](/ocitutorials/hpc/benchmark/run-imb/)** の **[1. OpenMPIでIntel MPI Benchmarksを実行する場合](/ocitutorials/hpc/benchmark/run-imb/#1-openmpiでintel-mpi-benchmarksを実行する場合)** の手順に従い、 **Intel MPI Benchmarks** を **OpenMPI** を利用するユーザで実行、その結果を確認します。

## 2-2. NAS Parallel Benchmarks実行

以下コマンドを全てのノードのopcユーザで実行し、 **NAS Parallel Benchmarks** をインストールします。

```sh
$ cd ~; wget https://www.nas.nasa.gov/assets/npb/NPB3.4.3-MZ.tar.gz
$ tar -xvf ./NPB3.4.3-MZ.tar.gz
$ cd NPB3.4.3-MZ/NPB3.4-MZ-MPI
$ cp config/make.def.template config/make.def
$ make bt-mz CLASS=C
```

次に、以下コマンドを **OpenMPI** を利用するユーザで何れか1ノードで実行し、 **NAS Parallel Benchmarks** を実行、その結果を確認します。

```sh
$ mpirun -n 36 -N 18 --hostfile ~/hostlist.txt -x OMP_NUM_THREADS=2 -x UCX_NET_DEVICES=mlx5_2:1 --bind-to none ./bin/bt-mz.C.x


NAS Parallel Benchmarks (NPB3.4-MZ MPI+OpenMP) - BT-MZ Benchmark

Number of zones:  16 x  16
Total mesh size:   480 x   320 x  28
Iterations: 200    dt:   0.000100
Number of active processes:     36

Use the default load factors
Total number of threads:     72  (  2.0 threads/process)

Calculated speedup =     70.51

Time step    1
Time step   20
Time step   40
Time step   60
Time step   80
Time step  100
Time step  120
Time step  140
Time step  160
Time step  180
Time step  200
Verification being performed for class C
accuracy setting for epsilon =  0.1000000000000E-07
Comparison of RMS-norms of residual
        1 0.3457703287806E+07 0.3457703287806E+07 0.1089509278487E-12
        2 0.3213621375929E+06 0.3213621375929E+06 0.1320422658492E-12
        3 0.7002579656870E+06 0.7002579656870E+06 0.1512841667693E-13
        4 0.4517459627471E+06 0.4517459627471E+06 0.2280652586031E-13
        5 0.2818715870791E+07 0.2818715870791E+07 0.1486830094937E-14
Comparison of RMS-norms of solution error
        1 0.2059106993570E+06 0.2059106993570E+06 0.1540627820550E-12
        2 0.1680761129461E+05 0.1680761129461E+05 0.2136344671269E-12
        3 0.4080731640795E+05 0.4080731640795E+05 0.3102425585186E-13
        4 0.2836541076778E+05 0.2836541076778E+05 0.1026032398931E-12
        5 0.2136807610771E+06 0.2136807610771E+06 0.2333146948798E-12
Verification Successful


BT-MZ Benchmark Completed.
Class           =                        C
Size            =            480x  320x 28
Iterations      =                      200
Time in seconds =                     7.82
Total processes =                       36
Total threads   =                       72
Mop/s total     =                310414.25
Mop/s/thread    =                  4311.31
Operation type  =           floating point
Verification    =               SUCCESSFUL
Version         =                    3.4.3
Compile date    =              10 Dec 2024

Compile options:
    FC           = mpif90
    FLINK        = $(FC)
    F_LIB        = (none)
    F_INC        = (none)
    FFLAGS       = -O3 -fopenmp
    FLINKFLAGS   = $(FFLAGS)
    RAND         = (none)


Please send all errors/feedbacks to:

NPB Development Team
npb@nas.nasa.gov


$ 
```