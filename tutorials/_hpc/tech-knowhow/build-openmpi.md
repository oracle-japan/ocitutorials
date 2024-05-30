---
title: "Slurm環境での利用を前提とするOpenMPI構築方法"
excerpt: "OpenMPIは、最新のMPI言語規格に準拠し、HPC/機械学習ワークロード実行に必要とされる様々な機能を備えたオープンソースのMPI実装です。OpenMPIで作成したアプリケーションのHPC/GPUクラスタに於ける実行は、計算リソース有効利用の観点から通常ジョブスケジューラを介したバッチジョブとして行いますが、ジョブスケジューラがSlurmの場合、PMIxを使用することでMPIアプリケーションの起動や通信初期化のスケーラビリティを向上させることが可能です。本テクニカルTipsは、PMIxを使用するSlurm環境での利用を前提とするOpenMPI構築方法を解説します。"
order: "351"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

**[Slurm](https://slurm.schedmd.com/)** 環境で **[OpenMPI](https://www.open-mpi.org/)** のアプリケーションを実行する場合、その動作モードには以下の選択肢があります。

1. 計算リソースの確保、アプリケーション起動、及び **[PMIx](https://pmix.github.io/)** を介したプロセス間通信の初期化処理を全て **Slurm** が行う。
2. 計算リソースの確保を **Slurm** が行い、アプリケーション起動はSSHを介して起動される **OpenMPI** のprtedが行う。

ここで1.の動作モードは、2.に対して以下の利点があります。

- 高並列アプリケーションを高速に起動することが可能
- アフィニティや終了処理等のプロセス管理を **Slurm** に統合することが可能
- 精度の高いアカウンティング情報を **Slurm** に提供することが可能
- **Slurm** クラスタ内のSSHパスフレーズ無しアクセス設定が不要

以上の利点を享受するべく本テクニカルTipsは、 **Slurm** 環境でMPIアプリケーションを1.の動作モードで実行することを想定した **OpenMPI** のインストール手順を解説し、インストールした **OpenMPI** のノード間MPI通信性能の確認とOpenMPとのハイブリッドプログラム稼働確認を目的として、以下のアプリケーションを実行します。

-  **[Intel MPI Benchmark](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)**
- **[NAS Parallel Benchmarks](https://www.nas.nasa.gov/software/npb.html)**

各ソフトウェアは、以下のバージョンを前提とします。

- OS ： **Oracle Linux** 8.9ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※1）
- MPI ： **OpenMPI** 5.0.3
- PMIx ： **[OpenPMIx](https://openpmix.github.io/)** 5.0.2

※1）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.1** です。

またこれらをインストールするインスタンスは、**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続する **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を前提とし、稼働確認を行うために少なくとも2ノード用意します。  
この構築手順は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ手動構築編)](/ocitutorials/hpc/spinup-cluster-network/)** が参考になります。

なお、ここで構築する **OpenMPI** と連携する **Slurm** の構築方法は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** を参照してください。  

***
# 1. OpenPMIxインストール

本章は、 **OpenPMIx** とその前提ソフトウェアの **libevent** ・ **hwloc** を **/opt** ディレクトリ以下にインストールします。

1. 以下コマンドを当該ノードのopcユーザで実行し、 **OpenPMIx** の前提となるソフトウェアをインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

   ```sh
   $ sudo dnf install -y ncurses-devel openssl-devel
   $ cd ~; wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
   $ tar -xvf ./libevent-2.1.12-stable.tar.gz
   $ cd libevent-2.1.12-stable; ./configure --prefix=/opt/libevent
   $ make -j 36 && sudo make install
   $ cd ~; wget https://download.open-mpi.org/release/hwloc/v2.10/hwloc-2.10.0.tar.gz
   $ tar -xvf ./hwloc-2.10.0.tar.gz
   $ cd hwloc-2.10.0; ./configure --prefix=/opt/hwloc
   $ make -j 36 && sudo make install
   ```

2. 以下コマンドを当該ノードのopcユーザで実行し、 **OpenPMIx** をインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

   ```sh
   $ cd ~; wget https://github.com/openpmix/openpmix/releases/download/v5.0.2/pmix-5.0.2.tar.gz
   $ tar -xvf ./pmix-5.0.2.tar.gz
   $ cd pmix-5.0.2; ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
   $ make -j 36 && sudo make install
   ```

***
# 2. OpenMPIインストール

本章は、 **OpenMPI** を **/opt** ディレクトリにインストールし、利用に必要な環境設定を行います。

1. 以下コマンドを当該ノードのopcユーザで実行し、 **OpenMPI** の前提となるソフトウェアをインストールします。

   ```sh
   $ sudo dnf install -y gcc-c++ gcc-gfortran
   ```

2. 以下コマンドを当該ノードのopcユーザで実行し、 **OpenMPI** をインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

   ```sh
   $ cd ~; wget https://download.open-mpi.org/release/open-mpi/v5.0/openmpi-5.0.3.tar.gz
   $ tar -xvf ./openmpi-5.0.3.tar.gz
   $ cd openmpi-5.0.3; ./configure --prefix=/opt/openmpi-5.0.3 --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-slurm
   $ make -j 36 all && sudo make install
   ```

3. 以下コマンドを当該ノードの **OpenMPI** を利用するユーザで実行し、必要な環境設定を行います。

   ```sh
   $ echo "export PATH=\$PATH:/opt/openmpi-5.0.3/bin" | tee -a ~/.bashrc
   $ echo "export MANPATH=\$MANPATH:/opt/openmpi-5.0.3/man" | tee -a ~/.bashrc
   $ source ~/.bashrc
   ```

***
# 3. OpenMPI稼働確認

## 3-0. 概要

本章は、インストールした **OpenMPI** を稼働確認するため、 **Intel MPI Benchmark** と **NAS Parallel Benchmarks** を実行します。

## 3-1. Intel MPI Benchmark実行

1. 以下コマンドを当該ノードのopcユーザで実行し、 **Intel MPI Benchmark** をインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

    ```sh
    $ sudo dnf install -y git
    $ git clone https://github.com/intel/mpi-benchmarks
    $ cd mpi-benchmarks; export CXX=/opt/openmpi-5.0.3/bin/mpicxx; export CC=/opt/openmpi-5.0.3/bin/mpicc; make -j 36 all
    $ sudo mkdir -p /opt/openmpi-5.0.3/tests/imb
    $ sudo cp ./IMB* /opt/openmpi-5.0.3/tests/imb/
    ```

2. 以下コマンドを当該ノードの **OpenMPI** を利用するユーザで実行し、**Intel MPI Benchmark** を実行するノード間でこのユーザがパスフレーズ無しでSSHアクセス出来るよう設定します。  
ノード間でホームディレクトリを共有している場合、1台のノードで以下コマンドを実行することで、その設定が完了します。  
なお、ホスト名を記載したホストリストファイルを、当該ユーザのホームディレクトリ直下に **hostlist.txt** として予め作成しておきます。

    ```sh
    $ cd ~; mkdir .ssh; chmod 700 .ssh
    $ ssh-keygen -t rsa -N "" -f .ssh/id_rsa
    $ cd .ssh; cat ./id_rsa.pub >> ./authorized_keys; chmod 600 ./authorized_keys
    $ for hname in `cat ~/hostlist.txt`; do echo $hname; ssh -oStrictHostKeyChecking=accept-new $hname :; done
    ```

    ここでは **OpenMPI** 単独での稼働確認を行うためパスフレーズ無しのSSHアクセスを必要としますが、**PMIx** を使用する **Slurm** 環境ではこの必要はありません。

3. 以下コマンドを当該ノードのうちの1ノードで **OpenMPI** を利用するユーザで実行し、 **Intel MPI Benchmark** を実行、その結果を確認します。

    ```sh
    $ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /opt/openmpi-5.0.3/tests/imb/IMB-MPI1 -msglog 27:28 pingpong
    ```

## 3-2. NAS Parallel Benchmarks実行

1. 以下コマンドを当該ノードのopcユーザで実行し、 **NAS Parallel Benchmarks** をインストールします。

    ```sh
    $ wget https://www.nas.nasa.gov/assets/npb/NPB3.4.2-MZ.tar.gz
    $ tar -xvf ./NPB3.4.2-MZ.tar.gz
    $ cd NPB3.4.2-MZ/NPB3.4-MZ-MPI
    $ cp config/make.def.template config/make.def
    $ make bt-mz CLASS=C
    ```


2. 以下コマンドを当該ノードのうちの1ノードで **OpenMPI** を利用するユーザで実行し、 **NAS Parallel Benchmarks** を実行、その結果を確認します。

    ```sh
    $ mpirun -n 36 -N 18 -hostfile ~/hostlist.txt -x OMP_NUM_THREADS=2 -x UCX_NET_DEVICES=mlx5_2:1 --bind-to none ./bin/bt-mz.C.x


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
    Version         =                    3.4.2
    Compile date    =              22 Apr 2024

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