---
title: "Slurm環境での利用を前提とするOpenMPI構築方法"
excerpt: "OpenMPIは、最新のMPI言語規格に準拠し、HPC/機械学習ワークロード実行に必要とされる様々な機能を備えたオープンソースのMPI実装です。OpenMPIで作成したアプリケーションのHPC/GPUクラスタに於ける実行は、計算リソース有効利用の観点から通常ジョブスケジューラを介したバッチジョブとして行いますが、ジョブスケジューラがSlurmの場合、PMIxを使用することでMPIアプリケーションの起動や通信初期化のスケーラビリティを向上させることが可能です。本テクニカルTipsは、PMIxを使用するSlurm環境での利用を前提とするOpenMPI構築方法を解説します。
。
"
order: "351"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

**[OpenMPI](https://www.open-mpi.org/)** は、最新のMPI言語規格に準拠し、HPC/機械学習ワークロード実行に必要とされる様々な機能を備えたオープンソースのMPI実装です。  
**OpenMPI** で作成したアプリケーションのHPC/GPUクラスタに於ける実行は、計算リソース有効利用の観点から通常ジョブスケジューラを介したバッチジョブとして行いますが、ジョブスケジューラが **[Slurm](https://slurm.schedmd.com/)** の場合、 **[PMIx](https://pmix.github.io/)** を使用することでMPIアプリケーションの起動や通信初期化のスケーラビリティを向上させることが可能です。  
本テクニカルTipsは、 **PMIx** を使用する **Slurm** 環境での利用を前提とする **OpenMPI** 構築方法を解説します。

***
# 0. 概要

**Slurm** 環境で **OpenMPI** のアプリケーションを実行する場合、その動作モードには以下の選択肢があります。

1. 計算リソースの確保、アプリケーション起動、及び **PMIx** を介したプロセス間通信の初期化処理を全て **Slurm** が行う。
2. 計算リソースの確保を **Slurm** が行い、アプリケーション起動はSSHを介して起動される **OpenMPI** のprtedが行う。

ここで1.の動作モードは、2.に対して以下の利点があります。

- 高並列アプリケーションを高速に起動することが可能
- アフィニティや終了処理等のプロセス管理を **Slurm** に統合することが可能
- 精度の高いアカウンティング情報を **Slurm** に提供することが可能
- **Slurm** クラスタ内のSSHパスフレーズ無しアクセス設定が不要

以上の利点を享受するべく本テクニカルTipsは、 **Slurm** 環境でMPIアプリケーションを1.の動作モードで実行することを想定した **OpenMPI** のインストール手順を解説します。

各ソフトウェアは、以下のバージョンを前提としています。

- OS ： **Oracle Linux 8**
- MPI ： **OpenMPI** 5.0.0
- PMIx ： **[OpenPMIx](https://openpmix.github.io/)** 4.2.7

またこれらをインストールするインスタンスは、**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続する **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を前提とし、稼働確認を行うために少なくとも2ノード用意します。

なお、ここで構築する **OpenMPI** と連携する **Slurm** の構築方法は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** を参照ください。  

***
# 1. OpenPMIxインストール

本章は、 **OpenPMIx** とその前提ソフトウェアの **libevent** ・ **hwloc** を/optディレクトリ以下にインストールします。

1. 以下コマンドを当該ノードのopcユーザで実行し、 **OpenPMIx** の前提となるソフトウェアをインストールします。

   ```sh
   $ sudo dnf install -y ncurses-devel openssl-devel
   $ cd ~; wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
   $ tar -xvf ./libevent-2.1.12-stable.tar.gz
   $ cd libevent-2.1.12-stable; ./configure --prefix=/opt/libevent
   $ make
   $ sudo make install
   $ cd ~; wget https://download.open-mpi.org/release/hwloc/v2.9/hwloc-2.9.3.tar.gz
   $ tar -xvf ./hwloc-2.9.3.tar.gz
   $ cd hwloc-2.9.3; ./configure --prefix=/opt/hwloc
   $ make
   $ sudo make install
   ```

2. 以下コマンドを当該ノードのopcユーザで実行し、 **OpenPMIx** をインストールします。

   ```sh
   $ cd ~; wget https://github.com/openpmix/openpmix/releases/download/v4.2.7/pmix-4.2.7.tar.gz
   $ tar -xvf ./pmix-4.2.7.tar.gz
   $ cd pmix-4.2.7; ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
   $ make
   $ sudo make install
   ```

***
# 2. OpenMPIインストール

本章は、 **OpenMPI** を/optディレクトリにインストールし、利用に必要な環境設定を行います。

1. 以下コマンドを当該ノードのopcユーザで実行し、 **OpenMPI** をインストールします。

   ```sh
   $ cd ~; wget https://download.open-mpi.org/release/open-mpi/v5.0/openmpi-5.0.0.tar.gz
   $ tar -xvf ./openmpi-5.0.0.tar.gz
   $ cd openmpi-5.0.0; ./configure --prefix=/opt/openmpi-5.0.0 --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-slurm
   $ make all
   $ sudo make install
   ```

2. 以下コマンドを当該ノードの **OpenMPI** を利用するユーザで実行し、必要な環境設定を行います。

   ```sh
   $ echo "export PATH=\$PATH:/opt/openmpi-5.0.0/bin" | tee -a ~/.bash_profile
   $ echo "export MANPATH=\$MANPATH:/opt/openmpi-5.0.0/man" | tee -a ~/.bash_profile
   $ source ~/.bash_profile
   ```

***
# 3. OpenMPI稼働確認

本章は、インストールした **OpenMPI** を稼働確認するため、 **[Intel MPI Benchmark](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** を実行します。

1. 以下コマンドを当該ノードのopcユーザで実行し、 **Intel MPI Benchmark** をインストールします。

   ```sh
   $ sudo dnf install -y git
   $ cd ~; git clone https://github.com/intel/mpi-benchmarks
   $ cd mpi-benchmarks; export CXX=/opt/openmpi-5.0.0/bin/mpicxx; export CC=/opt/openmpi-5.0.0/bin/mpicc; make all
   $ sudo mkdir -p /opt/openmpi-5.0.0/tests/imb
   $ sudo cp ./IMB* /opt/openmpi-5.0.0/tests/imb/
   ```

2. **Intel MPI Benchmark** を実行するノード間でパスフレーズ無しでSSHアクセスが出来るよう設定します。  
ノード間でホームディレクトリを共有している場合、1台のノードで当該ユーザで以下コマンドを実行することで、その設定が可能です。  
なお、ホスト名を記載したホストリストファイルを、当該ユーザのホームディレクトリ直下にhostlist.txtとして予め作成しておきます。

   ```sh
   $ cd ~; mkdir .ssh; chmod 700 .ssh
   $ ssh-keygen -t rsa -N "" -f .ssh/id_rsa
   $ cd .ssh; cat ./id_rsa.pub >> ./authorized_keys; chmod 600 ./authorized_keys
   $ for hname in `cat ~/hostlist.txt`; do echo $hname; ssh -oStrictHostKeyChecking=accept-new $hname :; done
   ```

   なお、ここでは **OpenMPI** 単独での稼働確認を行うためパスフレーズ無しのSSHアクセスを必要としますが、**PMIx** を使用する **Slurm** 環境ではこの必要はありません。

3. 以下コマンドを当該ノードの **OpenMPI** を利用するユーザで実行し、 **Intel MPI Benchmark** を実行、その結果を確認します。

   ```sh
   $ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /opt/openmpi-5.0.0/tests/imb/IMB-MPI1 -msglog 27:28 pingpong
   ```