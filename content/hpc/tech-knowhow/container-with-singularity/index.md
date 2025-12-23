---
title: "SingularityによるHPCワークロード向けコンテナ環境構築方法"
description: "HPCワークロードのためのコンテナ環境は、インターコネクトやGPU等のリソースをコンテナから容易に利用できたり、マルチユーザ環境での利用を前提とするHPCシステムで非特権ユーザのコンテナ実行をネイティブにサポートしている等の理由から、Singularityが広く利用されています。このSingularityは、可搬性に優れたSIFを採用しつつOCIイメージフォーマットのコンテナイメージにも対応しており、HPCワークロード実行に求められる性能・セキュリティ・利便性に優れたコンテナ環境を可能にします。本テクニカルTipsは、SingurarityのオープンソースエディションであるSingularityCEを利用し、クラスタ・ネットワーク対応のベアメタル・シェイプで構築するHPCクラスタにコンテナ環境を構築する方法を解説します。"
weight: "3508"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

# 0. 概要

**[SingularityCE](https://sylabs.io/singularity/)** は、HPC環境での利用を想定して開発されたオープンソースのコンテナプラットフォームで、以下の特徴を有します。

- 可搬性に優れ改変不可能なシングルファイル形式 **SIF（Singularity Image Format）** の採用
- ホスト・コンテナ間の隔離より統合を重視することでコンテナからインターコネクトやGPUを容易に利用することが可能
- Linuxカーネルのユーザ名前空間を活用した非特権ユーザ（※1）のコンテナ実行による堅牢なセキュリティ
- **[OCI（Open Container Initiative）仕様](https://github.com/opencontainers/image-spec)** に準拠するコンテナイメージへの対応

※1）以降"コンテナユーザ"と呼称します。

本テクニカルTipsは、 **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** でノード間接続するHPC/GPUクラスタ上に **SingularityCE** で構築されたコンテナ環境でMPI並列アプリケーションを実行することを念頭に、計算/GPUノードに **SingularityCE** をインストールし、ここで起動する **Ubuntu** のコンテナに **[OpenMPI](https://www.open-mpi.org/)** ・ **[NVIDIA HPC SDK](https://developer.nvidia.com/hpc-sdk)** ・ **[OSU Micro-Benchmarks](https://mvapich.cse.ohio-state.edu/benchmarks/)** 等のソフトウェアをインストールしてHPC/GPUクラスタで有用な **SIF** のカスタムコンテナイメージを作成、このコンテナイメージを使用して2ノード間のレイテンシと帯域幅を計測します。  
またこの計測を **[Slurm](https://slurm.schedmd.com/)** 環境で実行し、コンテナ上で実行するMPI並列アプリケーションがバッチジョブでも実行できることを確認します。

本テクニカルTipsは、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ手動構築編)](../../spinup-cluster-network/)** / **[GPUクラスタを構築する(基礎インフラ自動構築編)](../../spinup-gpu-cluster/)** の手順に従う等で予め **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** に接続する少なくとも2ノードの計算/GPUノードを有するHPC/GPUクラスタが作成されており、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](../../tech-knowhow/setup-slurm-cluster/)** に従い予め **Slurm** 環境が構築されている（※2）ことを前提に、計算/GPUノードに **SingularityCE** をインストールしてコンテナ環境を構築する手順を以下の順に解説します。

1. **[OpenMPIインストール](#1-openmpiインストール)**
2. **[計算/GPUノードのSlurm環境への登録](#2-計算gpuノードのslurm環境への登録)**
3. **[SingularityCEインストール](#3-singularityceインストール)**
4. **[コンテナユーザ作成](#4-コンテナユーザ作成)**
5. **[コンテナイメージ作成](#5-コンテナイメージ作成)**
6. **[稼働確認](#6-稼働確認)**

※2）コンテナ上で実行するMPI並列アプリケーションをバッチジョブで実行する必要がない場合は、 **Slurm** 環境が予め構築されている必要はありません。

本テクニカルTipsは、以下の環境を前提とします。

- 計算ノード
  - シェイプ： **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)**
  - イメージ： **Oracle Linux** 9.05ベースのHPC **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※3）
- GPUノード
  - シェイプ： **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)**
  - イメージ： **Oracle Linux** 9.05ベースのGPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※4）
- **SingularityCE** ： 4.3.4

※3）**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.13** です。  
※4）**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.15** です。

以降では、対象がHPCクラスタかGPUクラスタかで異なる箇所は、その都度注釈を加えます。

また本テクニカルTipsは、コンテナユーザのホームディレクトリが全ての計算ノードで共有されていることを前提に記載します。

# 1. OpenMPIインストール

本章は、計算/GPUノードに **OpenMPI** をインストールします。

**OpenMPI** のインストールは、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](../../tech-knowhow/build-openmpi/)** の **[1. インストール・セットアップ](../../tech-knowhow/build-openmpi/#1-インストールセットアップ)** の手順に従い実施します。

# 2. 計算/GPUノードのSlurm環境への登録

本章は、計算/GPUノードを既存の **Slurm** 環境に登録します。

計算/GPUノードの **Slurm** 環境への登録は、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](../../tech-knowhow/setup-slurm-cluster/)** の **[2. 環境構築](../../tech-knowhow/setup-slurm-cluster/#2-環境構築)** の計算/GPUノードに対する手順を実施することで行います。

# 3. SingularityCEインストール

本章は、計算/GPUノードに **SingularityCE** をインストールします。

以下コマンドをopcユーザで実行し、 **SingularityCE** をインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ sudo yum-config-manager --enable ol9_codeready_builder
$ sudo dnf install -y libseccomp-devel fuse3-devel shadow-utils-subid shadow-utils-subid-devel
$ mkdir -p ~/`hostname` && cd ~/`hostname` && wget https://go.dev/dl/go1.25.4.linux-amd64.tar.gz
$ sudo tar -C /usr/local/ -xvf ./go1.25.4.linux-amd64.tar.gz
$ export PATH=/usr/local/go/bin:$PATH
$ wget https://github.com/sylabs/singularity/releases/download/v4.3.4/singularity-ce-4.3.4.tar.gz
$ tar -xvf singularity-ce-4.3.4.tar.gz
$ cd singularity-ce-4.3.4 && ./mconfig && make -j 36 -C builddir && sudo make -C builddir install; echo $?
```

# 4. コンテナユーザ作成

本章は、計算/GPUノードにコンテナユーザを作成し、このユーザでコンテナを起動するための必要な設定を行います。

コンテナユーザ（ここでは **usera** とします。）をLinuxのユーザとして作成します。

次に、以下コマンドをopcユーザで実行し、コンテナユーザのコンテナイメージファイル等を格納するディレクトリをNVMe SSDローカルディスク領域（ **/mnt/localdisk** にマウントされているとします。）に作成します。

```sh
$ sudo mkdir -p /mnt/localdisk/usera && sudo chown usera:usera /mnt/localdisk/usera
```

次に、以下コマンドを何れかの計算/GPUノードでコンテナユーザで実行し、コンテナイメージファイル等を格納するディレクトリを指定する環境変数を設定します。

```sh
$ echo "export SINGULARITY_CACHEDIR=/mnt/localdisk/usera" | tee -a ~/.bashrc
$ echo "export SINGULARITY_TMPDIR=/mnt/localdisk/usera" | tee -a ~/.bashrc
$ source ~/.bashrc
```

次に、以下コマンドをコンテナユーザで実行し、コンテナの起動を確認します。

```sh
$ singularity exec docker://ubuntu:noble-20251013 grep PRETTY /etc/os-release
INFO:    Converting OCI blobs to SIF format
INFO:    Starting build...
INFO:    Fetching OCI image...
28.3MiB / 28.3MiB [==================================================================] 100 % 5.3 MiB/s 0s
INFO:    Extracting OCI image...
INFO:    Inserting Singularity configuration...
INFO:    Creating SIF file...
PRETTY_NAME="Ubuntu 24.04.3 LTS"
$
```

# 5. コンテナイメージ作成

## 5-0. 概要

本章は、 **Ubuntu** のコンテナイメージを元に **sandbox** コンテナを作成・起動してHPC/GPUクラスタに有用なソフトウェアをインストールし、このコンテナから **SIF** のコンテナイメージを作成します。  
ここでインストールするソフトウェアは、対象がHPCクラスタかGPUクラスタかにより以下とします。

- HPCクラスタ向けコンテナにインストールするソフトウェア
    - **OpenMPI**
    - **OSU Micro-Benchmarks**
- GPUクラスタ向けコンテナにインストールするソフトウェア
    - **[NVIDIA Driver](https://docs.nvidia.com/datacenter/tesla/driver-installation-guide/index.html#)**
    - **[NVIDIA CUDA](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/contents.html)**
    - **NVIDIA HPC SDK**
    - **OpenMPI**
    - **OSU Micro-Benchmarks**

以降では、HPC/GPUクラスタ向けのコンテナ毎にその作成手順を解説します。

なお、コマンドブロック中の **Singularity>** はコンテナ内のプロンプトを表しており、これに続くコマンドは起動したコンテナ上で実行することを意味します。

## 5-1. HPCクラスタ向けコンテナ作成

以下コマンドをコンテナユーザで実行し、 **sandbox** コンテナ用のディレクトリを作成してここからコンテナを起動します。

```sh
$ cd /mnt/localdisk/usera && singularity build --sandbox ubuntu_noble_ompi/ docker://ubuntu:noble-20251013
$ singularity run --writable --fakeroot ubuntu_noble_ompi/
Singularity> mkdir -p /mnt/localdisk/root
Singularity> exit
$ module purge
$ singularity run --writable --fakeroot --bind /mnt/localdisk/usera:/mnt/localdisk/root ubuntu_noble_ompi/
```

次に、以下コマンドをコンテナユーザで実行し、 **OpenMPI** の前提ソフトウェアを **sandbox** コンテナにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
Singularity> apt update
Singularity> echo "tzdata tzdata/Areas select Asia" | debconf-set-selections
Singularity> echo "tzdata tzdata/Zones/Asia select Tokyo" | debconf-set-selections
Singularity> DEBIAN_FRONTEND=noninteractive apt install -y tzdata wget build-essential openssl libssl-dev zlib1g-dev git gfortran autoconf libtool vim environment-modules libnuma-dev libibverbs-dev librdmacm-dev tcl pkg-config
Singularity> mkdir /mnt/localdisk/root/`hostname` && cd /mnt/localdisk/root/`hostname` && wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
Singularity> tar -xvf ./libevent-2.1.12-stable.tar.gz --no-same-owner
Singularity> cd libevent-2.1.12-stable && ./configure --prefix=/opt/libevent
Singularity> make -j 36 && make install; echo $?
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://download.open-mpi.org/release/hwloc/v2.12/hwloc-2.12.2.tar.gz
Singularity> tar -xvf ./hwloc-2.12.2.tar.gz --no-same-owner
Singularity> cd hwloc-2.12.2 && ./configure --prefix=/opt/hwloc
Singularity> make -j 36 && make install; echo $?
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://github.com/openpmix/openpmix/releases/download/v5.0.8/pmix-5.0.8.tar.gz
Singularity> tar -xvf ./pmix-5.0.8.tar.gz --no-same-owner
Singularity> cd pmix-5.0.8 && ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
Singularity> make -j 36 && make install; echo $?
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://github.com/openucx/ucx/releases/download/v1.19.0/ucx-1.19.0.tar.gz
Singularity> tar -xvf ./ucx-1.19.0.tar.gz --no-same-owner
Singularity> cd ucx-1.19.0 && ./contrib/configure-release --prefix=/opt/ucx
Singularity> make -j 36 && make install; echo $?
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://github.com/openucx/ucc/archive/refs/tags/v1.5.0.tar.gz
Singularity> tar -xvf ./v1.5.0.tar.gz --no-same-owner
Singularity> cd ./ucc-1.5.0/ && ./autogen.sh && ./configure --prefix=/opt/ucc --with-ucx=/opt/ucx
Singularity> make -j 36 && make install; echo $?
```

次に、以下コマンドをコンテナユーザで実行し、 **OpenMPI** を **sandbox** コンテナの **/opt/openmpi** にインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://download.open-mpi.org/release/open-mpi/v5.0/openmpi-5.0.8.tar.gz
Singularity> tar -xvf ./openmpi-5.0.8.tar.gz --no-same-owner
Singularity> cd openmpi-5.0.8 && ./configure --prefix=/opt/openmpi --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-ucx=/opt/ucx --with-ucc=/opt/ucc --with-slurm
Singularity> make -j 36 && make install; echo $?
Singularity> mkdir -p /usr/share/Modules
Singularity> ln -s /usr/share/modules/modulefiles /usr/share/Modules/modulefiles
Singularity> ln -s /usr/lib/x86_64-linux-gnu /usr/share/Modules/libexec
```

次に、以下のファイルを **sandbox** コンテナ上の **/usr/share/Modules/modulefiles/openmpi** で作成します。  
このファイルは、 **[Environment Modules](https://envmodules.io/)** にモジュール名 **openmpi** を登録し、これをロードすることで **OpenMPI** 利用環境の設定を可能にします。

```sh
#%Module1.0
##
## OpenMPI for GNU compiler

proc ModulesHelp { } {
        puts stderr "OpenMPI 5.0.8 for GNU compiler\n"
}

module-whatis   "OpenMPI 5.0.8 for GNU compiler"

set pkg_root    /opt/openmpi
set ver         5.0.8

setenv MPI_ROOT $pkg_root
setenv MPICC    mpicc
setenv MPICXX   mpicxx
setenv MPIFC    mpif90

prepend-path PATH               $pkg_root/bin:/opt/ucx/bin
prepend-path LD_LIBRARY_PATH    $pkg_root/lib
prepend-path LIBRARY_PATH       $pkg_root/lib
prepend-path CPATH              $pkg_root/include
prepend-path C_INCLUDE_PATH     $pkg_root/include
prepend-path CPLUS_INCLUDE_PATH $pkg_root/include
prepend-path MANPATH            $pkg_root/share/man
```

次に、以下コマンドをコンテナユーザで実行し、 **OSU Micro-Benchmarks** を **sandbox** コンテナの **/opt/openmpi/tests/omb** にインストールします。

```sh
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://mvapich.cse.ohio-state.edu/download/mvapich/osu-micro-benchmarks-7.5.1.tar.gz
Singularity> tar -xvf ./osu-micro-benchmarks-7.5.1.tar.gz --no-same-owner
Singularity> module load openmpi
Singularity> cd osu-micro-benchmarks-7.5.1 && ./configure CC=mpicc CXX=mpicxx --prefix=/opt/openmpi/tests/omb
Singularity> make -j 36 && make install; echo $?
```

次に、以下のファイルを **sandbox** コンテナ上の **/usr/share/Modules/modulefiles/omb** で作成します。  
このファイルは、 **Environment Modules** にモジュール名 **omb** を登録し、これをロードすることで **OSU Micro-Benchmarks** 利用環境の設定を可能にします。

```sh
#%Module1.0
##
## OSU Micro-Benchmarks for OpenMPI

proc ModulesHelp { } {
        puts stderr "OSU Micro-Benchmarks for OpenMPI\n"
}

module-whatis "OSU Micro-Benchmarks for OpenMPI"

set pkg_root  /opt/openmpi/tests/omb/libexec/osu-micro-benchmarks
set ver       7.5.1

prepend-path PATH $pkg_root:$pkg_root/mpi/collective:$pkg_root/mpi/congestion:$pkg_root/mpi/one-sided:$pkg_root/mpi/pt2pt:$pkg_root/mpi/startup
```

次に、以下のファイルを **sandbox** コンテナ上の **/.singularity.d/env/99-auto-modules.sh** で作成します。  
このファイルは、コンテナ起動時に **OpenMPI** と **OSU Micro-Benchmarks** のモジュールをロードします。

```sh
#!/bin/bash
# Source the module initialization script and load your module
source /etc/profile.d/modules.sh
module load openmpi omb
```

次に、以下コマンドをコンテナユーザで実行し、作成した **sandbox** コンテナから **SIF** のコンテナイメージを作成します。  
この際、 **SIF** ファイルを作成するディレクトリが全ての計算ノードで共有されている点に留意します。

```sh
$ mkdir -p ~/singularity && singularity build ~/singularity/ubuntu_noble_ompi.sif ubuntu_noble_ompi/
```

## 5-2. GPUクラスタ向けコンテナ作成

以下コマンドをコンテナユーザで実行し、 **sandbox** コンテナ用のディレクトリを作成してここからコンテナを起動します。
```sh
$ cd /mnt/localdisk/usera && singularity build --sandbox ubuntu_noble_gpu/ docker://ubuntu:noble-20251013
$ singularity run --writable --fakeroot ubuntu_noble_gpu/
Singularity> mkdir -p /mnt/localdisk/root /lib/modules /usr/src/kernels
Singularity> exit
$ module purge
$ singularity run --writable --fakeroot --bind /mnt/localdisk/usera:/mnt/localdisk/root --bind /lib/modules:/lib/modules --bind /usr/src/kernels:/usr/src/kernels ubuntu_noble_gpu/
```

次に、以下コマンドをコンテナユーザで実行し、以降でインストールするソフトウェアの前提ソフトウェアを **sandbox** コンテナにインストールします。

```sh
Singularity> apt update
Singularity> apt install -y locales
Singularity> locale-gen en_US.UTF-8 && update-locale LANG=en_US.UTF-8
Singularity> export LANG=en_US.UTF-8
Singularity> echo "tzdata tzdata/Areas select Asia" | debconf-set-selections
Singularity> echo "tzdata tzdata/Zones/Asia select Tokyo" | debconf-set-selections
Singularity> echo "keyboard-configuration keyboard-configuration/layout select us" | debconf-set-selections
Singularity> DEBIAN_FRONTEND=noninteractive apt install -y tzdata wget build-essential openssl libssl-dev zlib1g-dev autoconf libtool vim environment-modules libnuma-dev libibverbs-dev librdmacm-dev tcl curl gnupg pkg-config cmake unzip keyboard-configuration git
Singularity> dpkg-reconfigure -f noninteractive keyboard-configuration
```

次に、以下コマンドをコンテナユーザで実行し、 **NVIDIA Driver** 、 **NVIDIA CUDA** 、及び **NVIDIA HPC SDK** を **sandbox** コンテナにインストールします。  
なお、ここでインストールする **NVIDIA Driver** のバージョンは、ホストOSの **NVIDIA Driver** のバージョンと一致する必要がある点に留意します。

```sh
Singularity> distribution=$(. /etc/os-release;echo $ID$VERSION_ID | sed -e 's/\.//g')
Singularity> mkdir /mnt/localdisk/root/`hostname` && cd /mnt/localdisk/root/`hostname` && wget https://developer.download.nvidia.com/compute/cuda/repos/$distribution/x86_64/cuda-keyring_1.1-1_all.deb
Singularity> dpkg -i cuda-keyring_1.1-1_all.deb
Singularity> curl https://developer.download.nvidia.com/hpc-sdk/ubuntu/DEB-GPG-KEY-NVIDIA-HPC-SDK | gpg --dearmor -o /usr/share/keyrings/nvidia-hpcsdk-archive-keyring.gpg
Singularity> echo 'deb [signed-by=/usr/share/keyrings/nvidia-hpcsdk-archive-keyring.gpg] https://developer.download.nvidia.com/hpc-sdk/ubuntu/amd64 /' | tee /etc/apt/sources.list.d/nvhpc.list
Singularity> apt update
Singularity> apt install -y cuda-drivers-570 cuda-toolkit-12-9 nvhpc-25-7-cuda-multi
Singularity> mkdir -p /usr/share/Modules
Singularity> ln -s /usr/share/modules/modulefiles /usr/share/Modules/modulefiles
Singularity> ln -s /usr/lib/x86_64-linux-gnu /usr/share/Modules/libexec
Singularity> cp -p /opt/nvidia/hpc_sdk/modulefiles/nvhpc/25.7 /usr/share/Modules/modulefiles/nvhpc
```

次に、以下コマンドをコンテナユーザで実行し、 **OpenMPI** の前提ソフトウェアを **sandbox** コンテナにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
Singularity> tar -xvf ./libevent-2.1.12-stable.tar.gz --no-same-owner
Singularity> cd libevent-2.1.12-stable && ./configure --prefix=/opt/libevent
Singularity> make -j 64 && make install; echo $?
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://download.open-mpi.org/release/hwloc/v2.12/hwloc-2.12.2.tar.gz
Singularity> tar -xvf ./hwloc-2.12.2.tar.gz --no-same-owner
Singularity> cd hwloc-2.12.2 && ./configure --prefix=/opt/hwloc --with-cuda=/usr/local/cuda
Singularity> make -j 64 && make install; echo $?
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://github.com/openpmix/openpmix/releases/download/v5.0.8/pmix-5.0.8.tar.gz
Singularity> tar -xvf ./pmix-5.0.8.tar.gz --no-same-owner
Singularity> cd pmix-5.0.8 && ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
Singularity> make -j 64 && make install; echo $?
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://github.com/NVIDIA/gdrcopy/archive/refs/tags/v2.5.1.tar.gz
Singularity> tar -xvf ./v2.5.1.tar.gz --no-same-owner
Singularity> cd gdrcopy-2.5.1 && make -j 64 CUDA=/usr/local/cuda all && make prefix=/opt/gdrcopy install; echo $?
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://github.com/openucx/ucx/releases/download/v1.19.0/ucx-1.19.0.tar.gz
Singularity> tar -xvf ./ucx-1.19.0.tar.gz --no-same-owner
Singularity> cd ucx-1.19.0 && ./contrib/configure-release --prefix=/opt/ucx --with-cuda=/usr/local/cuda -with-gdrcopy=/opt/gdrcopy
Singularity> make -j 64 && make install; echo $?
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://github.com/openucx/ucc/archive/refs/tags/v1.5.0.tar.gz
Singularity> tar -xvf ./v1.5.0.tar.gz --no-same-owner
Singularity> cd ./ucc-1.5.0/ && ./autogen.sh && ./configure --prefix=/opt/ucc --with-ucx=/opt/ucx --with-cuda=/usr/local/cuda --with-nccl=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/comm_libs/nccl
Singularity> make -j 64 && make install; echo $?
```

次に、以下コマンドをコンテナユーザで実行し、 **OpenMPI** を **sandbox** コンテナの **/opt/openmpi** にインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://download.open-mpi.org/release/open-mpi/v5.0/openmpi-5.0.8.tar.gz
Singularity> tar -xvf ./openmpi-5.0.8.tar.gz --no-same-owner
Singularity> module load nvhpc
Singularity> cd openmpi-5.0.8 && ./configure --prefix=/opt/openmpi --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-ucx=/opt/ucx --with-ucc=/opt/ucc --with-slurm --with-cuda=/usr/local/cuda CC=nvc CXX=nvc++ FC=nvfortran
Singularity> make -j 64 && make install; echo $?
Singularity> mkdir -p /usr/share/Modules
Singularity> ln -s /usr/share/modules/modulefiles /usr/share/Modules/modulefiles
Singularity> ln -s /usr/lib/x86_64-linux-gnu /usr/share/Modules/libexec
```

次に、以下のファイルを **sandbox** コンテナ上の **/usr/share/Modules/modulefiles/openmpi** で作成します。  
このファイルは、 **[Environment Modules](https://envmodules.io/)** にモジュール名 **openmpi** を登録し、これをロードすることで **OpenMPI** 利用環境の設定を可能にします。

```sh
#%Module1.0
##
## OpenMPI for NVIDIA compiler 25.7

proc ModulesHelp { } {
        puts stderr "OpenMPI 5.0.8 for NVIDIA compiler 25.7\n"
}

module-whatis   "OpenMPI 5.0.8 for NVIDIA compiler 25.7"

set pkg_root    /opt/openmpi
set ver         5.0.8

setenv MPI_ROOT $pkg_root
setenv MPICC    mpicc
setenv MPICXX   mpicxx
setenv MPIFC    mpif90

prepend-path PATH               $pkg_root/bin:/opt/ucx/bin
prepend-path LD_LIBRARY_PATH    $pkg_root/lib:/opt/gdrcopy/lib
prepend-path LIBRARY_PATH       $pkg_root/lib:/opt/gdrcopy/lib
prepend-path CPATH              $pkg_root/include
prepend-path C_INCLUDE_PATH     $pkg_root/include
prepend-path CPLUS_INCLUDE_PATH $pkg_root/include
prepend-path MANPATH            $pkg_root/share/man
```

次に、以下コマンドをコンテナユーザで実行し、 **OSU Micro-Benchmarks** を **sandbox** コンテナの **/opt/openmpi/tests/omb** にインストールします。

```sh
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://mvapich.cse.ohio-state.edu/download/mvapich/osu-micro-benchmarks-7.5.1.tar.gz
Singularity> tar -xvf ./osu-micro-benchmarks-7.5.1.tar.gz --no-same-owner
Singularity> module load nvhpc openmpi
Singularity> cd osu-micro-benchmarks-7.5.1 && ./configure CC=mpicc CXX=mpicxx --prefix=/opt/openmpi/tests/omb --enable-cuda --with-cuda-include=/usr/local/cuda/include --with-cuda-libpath=/usr/local/cuda/lib64 --enable-ncclomb --with-nccl=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/comm_libs/nccl
Singularity> make -j 64 && make install; echo $?
```

次に、以下のファイルを **sandbox** コンテナ上の **/usr/share/Modules/modulefiles/omb** で作成します。  
このファイルは、 **Environment Modules** にモジュール名 **omb** を登録し、これをロードすることで **OSU Micro-Benchmarks** 利用環境の設定を可能にします。

```sh
#%Module1.0
##
## OSU Micro-Benchmarks for OpenMPI

proc ModulesHelp { } {
        puts stderr "OSU Micro-Benchmarks for OpenMPI\n"
}

module-whatis "OSU Micro-Benchmarks for OpenMPI"

set pkg_root  /opt/openmpi/tests/omb/libexec/osu-micro-benchmarks
set ver       7.5.1

prepend-path PATH $pkg_root:$pkg_root/mpi/collective:$pkg_root/mpi/congestion:$pkg_root/mpi/one-sided:$pkg_root/mpi/pt2pt:$pkg_root/mpi/startup:$pkg_root/xccl/collective:$pkg_root/xccl/pt2pt
```

次に、以下のファイルを **sandbox** コンテナ上の **/.singularity.d/env/99-auto-modules.sh** で作成します。  
このファイルは、コンテナ起動時に **NVIDIA HPC SDK** 、 **OpenMPI** 、及び **OSU Micro-Benchmarks** のモジュールをロードします。

```sh
#!/bin/bash
# Source the module initialization script and load your module
source /etc/profile.d/modules.sh
module load nvhpc openmpi omb
```

次に、以下コマンドをコンテナユーザで実行し、作成した **sandbox** コンテナから **SIF** のコンテナイメージを作成します。  
この際、 **SIF** ファイルを作成するディレクトリが全てのGPUノードで共有されている点に留意します。

```sh
$ mkdir -p ~/singularity && singularity build ~/singularity/ubuntu_noble_gpu.sif ubuntu_noble_gpu/
```

# 6. 稼働確認

## 6-0. 概要

本章は、先に作成した **SIF** のコンテナイメージを使用し、コンテナにインストールしたソフトウェアの稼働確認と、コンテナ上で得られる性能がホストOS上のものと同等であることを確認します。  
この際、対象がHPCクラスタかGPUクラスタかにより、以下の稼働確認を実施します。

1. **[HPCクラスタ向け稼働確認](#6-1-hpcクラスタ向け稼働確認)**
    1. **[OpenMPI稼働確認](#6-1-1-openmpi稼働確認)**  
    MPIのサンプルプログラムをコンパイル・実行することで、 **OpenMPI** の稼働確認を実施します。
    2. **[OSU Micro-Benchmarksによるノード間レイテンシ・帯域幅計測](#6-1-2-osu-micro-benchmarksによるノード間レイテンシ帯域幅計測)**  
    **OSU Micro-Benchmarks** を使用し、  **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** を介する2ノード間のレイテンシと帯域幅を計測、その結果がホストOS上のものと同等であることを確認します。
    3. **[Slurm環境バッチジョブでのMPI並列アプリケーション稼働確認](#6-1-3-slurm環境バッチジョブでのmpi並列アプリケーション稼働確認)**  
    **2.** と同様の稼働確認を **Slurm** 環境のバッチジョブとして実施し、MPI並列アプリケーションを **Slurm** 環境で実行できることを確認します。
2. **[GPUクラスタ向け稼働確認項目](#6-2-gpuクラスタ向け稼働確認)**
    1. **[CUDA SamplesによるNVIDIA CUDA稼働確認](#6-2-1-cuda-samplesによるnvidia-cuda稼働確認)**  
    **NVIDIA CUDA** に含まれるCUDAコンパイラを使用して **CUDA Samples** をコンパイル・実行し、 **NVIDIA CUDA** の稼働確認を実施します。
    2. **[OpenACCサンプルプログラムによるNVIDIA HPC SDK稼働確認](#6-2-2-openaccサンプルプログラムによるnvidia-hpc-sdk稼働確認)**  
    **NVIDIA HPC SDK** に含まれるOpneACC対応Cコンパイラを使用してOpenACCのディレクティブを含むC言語のサンプルプログラムをコンパイル・実行し、 **NVIDIA HPC SDK** の稼働確認を実施します。
    3. **[OpenACC/MPIハイブリッドプログラムによるCUDA-aware OpenMPI稼働確認](#6-2-3-openaccmpiハイブリッドサンプルプログラムによるcuda-aware-openmpi稼働確認)**  
OpenACCのディレクティブを含むMPIプログラムをコンパイル・実行し、CUDA-aware **OpenMPI** の稼働確認を実施します。
    4. **[OSU Micro-Benchmarksによるデバイスメモリ間レイテンシ・帯域幅計測](#6-2-4-osu-micro-benchmarksによるデバイスメモリ間レイテンシ帯域幅計測)**  
    **OSU Micro-Benchmarks** で **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** を介する2ノード間のレイテンシと帯域幅を計測し、その結果がホストOS上のものと同等であることを確認します。
    5. **[NCCL TestsによるNCCL通信性能計測](#6-2-5-nccl-testsによるnccl通信性能計測)**  
    **[NCCL Tests](https://github.com/nvidia/nccl-tests)** で **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** の **All-Reduce** 通信性能を計測し、その結果がホストOS上のものと同等であることを確認します。
    6. **[Slurm環境バッチジョブでのMPI並列アプリケーション稼働確認](#6-2-6-slurm環境バッチジョブでのmpi並列アプリケーション稼働確認)**  
    **4.** と同様の稼働確認を **Slurm** 環境のバッチジョブとして実施し、MPI並列アプリケーションを **Slurm** 環境で実行できることを確認します。

以降では、HPCクラスタ向けとGPUクラスタ向けに分けてその手順を解説します。

なお、コマンドブロック中の **Singularity>** はコンテナ内のプロンプトを表しており、これに続くコマンドは起動したコンテナ上で実行することを意味します。

## 6-1. HPCクラスタ向け稼働確認

### 6-1-1. OpenMPI稼働確認

以下のMPIサンプルプログラムをファイル名 **mpi_hello.c** で作成します。

```sh
#include <stdio.h>
#include <mpi.h>

int main(int argc, char **argv) {
    int rank, size;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    printf("Hello world! I am %d of %d\n", rank, size);

    MPI_Finalize();
    return 0;
}
```

次に、以下コマンドを計算ノードのコンテナユーザで実行し、 **OpenMPI** の稼働確認を実施します。

```sh
$ singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif mpicc -o mpi_hello mpi_hello.c
$ module load openmpi
$ mpirun -n 2 singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif ./mpi_hello
Hello world! I am 1 of 2
Hello world! I am 0 of 2
$
```

### 6-1-2. OSU Micro-Benchmarksによるノード間レイテンシ・帯域幅計測

以下コマンドを何れかの計算ノードのコンテナユーザで実行し、 **OSU Micro-Benchmarks** でノード間レイテンシ・帯域幅の計測します。

```sh
$ module load openmpi
$ SINGULARITYENV_UCX_NET_DEVICES=mlx5_2:1 mpirun -n 2 -N 1 --hostfile ~/hostlist.txt singularity exec ~/singularity/ubuntu_noble_ompi.sif osu_latency -x 1000 -i 10000 -m 1:1

# OSU MPI Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.68
$ SINGULARITYENV_UCX_NET_DEVICES=mlx5_2:1 mpirun -n 2 -N 1 --hostfile ~/hostlist.txt singularity exec ~/singularity/ubuntu_noble_ompi.sif osu_bw -x 10 -i 10 -m 268435456:268435456

# OSU MPI Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           12254.21
$
```

### 6-1-3. Slurm環境バッチジョブでのMPI並列アプリケーション稼働確認

以下のファイルをSlurmクライアントに **slurm.sh** で作成します。  
このファイルは、 **OSU Micro-Benchmarks** でノード間レイテンシ・帯域幅の計測を行う **Slurm** に投入するジョブスクリプトです。

```sh
#!/bin/bash
#SBATCH -p sltest
#SBATCH -n 2
#SBATCH -N 2
#SBATCH -J omb
#SBATCH -o stdout.%J
#SBATCH -e stderr.%J

module load openmpi
export SINGULARITYENV_UCX_NET_DEVICES=mlx5_2:1

echo "Start osu_latency"
srun singularity exec ~/singularity/ubuntu_noble_ompi.sif osu_latency -x 1000 -i 10000 -m 1:1
echo
echo "Start osu_bw"
srun singularity exec ~/singularity/ubuntu_noble_ompi.sif osu_bw -x 10 -i 10 -m 268435456:268435456
```

次に、以下コマンドをSlurmクライアントのコンテナユーザで実行し、先に作成したジョブスクリプトを投入、その結果を確認します。

```sh
$ sbatch slurm.sh
Submitted batch job 40536
$ cat stdout.40536
Start osu_latency

# OSU MPI Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.52

Start osu_bw

# OSU MPI Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           12254.21
$
```

## 6-2. GPUクラスタ向け稼働確認

### 6-2-1. CUDA SamplesによるNVIDIA CUDA稼働確認

以下コマンドをGPUノードのコンテナユーザで実行し、 **CUDA Samples** をコンパイルします。

```sh
$ singularity run --nv ~/singularity/ubuntu_noble_gpu.sif
Singularity> module purge
Singularity> mkdir -p ~/`hostname` && cd ~/`hostname` && wget https://github.com/NVIDIA/cuda-samples/archive/refs/tags/v12.9.zip
Singularity> unzip v12.9.zip
Singularity> export PATH=/usr/local/cuda-12.9/bin:${PATH}
Singularity> cd cuda-samples-12.9 && mkdir build && cd build && cmake .. && make -j 64; echo $?
Singularity> exit
$
```

次に、以下コマンドをGPUノードのコンテナユーザで実行し、 **CUDA Samples** を実行します。  
この時、出力に搭載する全てのGPUの情報が含まれ、最後に出力される **Result =** 行が **PASS** となっていることを確認します。

```sh
$ singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif ~/`hostname`/cuda-samples-12.9/build/Samples/1_Utilities/deviceQuery/deviceQuery
:
:
deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 12.8, CUDA Runtime Version = 12.9, NumDevs = 8
Result = PASS
$
```

### 6-2-2. OpenACCサンプルプログラムによるNVIDIA HPC SDK稼働確認  

以下のOpenACCサンプルプログラムをファイル名 **test.c** で作成します。

```sh
#include <stdio.h>
#define N 1000000000
int array[N];
int main() {
#pragma acc parallel loop copy(array[0:N])
   for(int i = 0; i < N; i++) {
      array[i] = 3.0;
   }
   printf("Success!\n");
}
```

次に、以下コマンドをGPUノードのコンテナユーザで実行し、このサンプルプログラムをコンパイル・実行します。

```sh
$ singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif nvc -acc -gpu=cc80 -o ~/`hostname`/gpu.exe test.c
$ singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif bash -c "~/`hostname`/gpu.exe & sleep 1; nvidia-smi | tail -3"
Success!
|=========================================================================================|
|    0   N/A  N/A          430730      C   ...a/inst-wjv0a-ao-ol905/gpu.exe       4234MiB |
+-----------------------------------------------------------------------------------------+
$
```

### 6-2-3. OpenACC/MPIハイブリッドサンプルプログラムによるCUDA-aware OpenMPI稼働確認

ここで使用するOpenACC/MPIハイブリッドのサンプルプログラムは、 **[東京大学 情報基盤センター](https://www.itc.u-tokyo.ac.jp/)** 様がGitHubの以下レポジトリから公開している、並列プログラミング講習会向けのものを利用させて頂くこととします。

**[https://github.com/hoshino-UTokyo/lecture_openacc_mpi](https://github.com/hoshino-UTokyo/lecture_openacc_mpi)**

以下コマンドをGPUノードのコンテナユーザで実行し、サンプルプログラムのソースツリーをクローンします。

```sh
$ singularity run --nv ~/singularity/ubuntu_noble_gpu.sif
Singularity> mkdir -p ~/`hostname` && cd ~/`hostname` && git clone https://github.com/hoshino-UTokyo/lecture_openacc_mpi.git
```

以降では、ダウンロードした **lecture_openacc_mpi/C/openacc_mpi_basic/04_cuda_aware** ディレクトリ配下のサンプルプログラムを使用します。  
この際、 **東京大学 情報基盤センター** 様との環境の違いから、このディレクトリの **Makefile** を以下のように修正します。

```sh
$ diff Makefile_org Makefile
8c8
< CFLAGS    = -O3 -acc -Minfo=accel  -ta=tesla,cc80
---
> CFLAGS    = -O3 -acc -Minfo=accel  -gpu=cc80
$
```

次に、以下コマンドをGPUノードのコンテナユーザで実行し、このサンプルプログラムをコンパイル・実行します。  

```sh
Singularity> cd  ~/`hostname`/lecture_openacc_mpi/C/openacc_mpi_basic/04_cuda_aware
Singularity> make
mpicc -O3 -acc -Minfo=accel  -gpu=cc80 -c main.c
"main.c", line 57: warning: The independent loop parallelism with no parallelism level is set to seq when inferring the routine parallelism of the enclosing function [independent_loop_type]
  #pragma acc loop independent
  ^

Remark: individual warnings can be suppressed with "--diag_suppress <warning-name>"

main:
     54, Generating create(a[:16777216],b[:16777216]) [if not already present]
         Generating copyout(b[:16777216],a[:16777216]) [if not already present]
     58, Loop is parallelizable
         Generating NVIDIA GPU code
         58, #pragma acc loop gang, vector(128) /* blockIdx.x threadIdx.x */
     72, Generating implicit copy(sum) [if not already present]
         Generating copyin(b[:16777216]) [if not already present]
     76, Loop is parallelizable
         Generating NVIDIA GPU code
         76, #pragma acc loop gang, vector(128) /* blockIdx.x threadIdx.x */
             Generating reduction(+:sum)
mpicc -O3 -acc -Minfo=accel  -gpu=cc80  main.o   -o run 
Singularity> exit
$ module load openmpi
$ SINGULARITYENV_UCX_NET_DEVICES=mlx5_4:1 mpirun -n 2 singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif ~/`hostname`/lecture_openacc_mpi/C/openacc_mpi_basic/04_cuda_aware/run
num of GPUs = 8
Rank 1: hostname = inst-wjv0a-ao-ol905, GPU num = 1
Rank 0: hostname = inst-wjv0a-ao-ol905, GPU num = 0
mean = 30.00
Time =    0.008 [sec]
```

### 6-2-4. OSU Micro-Benchmarksによるデバイスメモリ間レイテンシ・帯域幅計測

以下コマンドをGPUノードのコンテナユーザで実行し、 **OSU Micro-Benchmarks** でノード内のデバイスメモリ間のレイテンシと帯域幅を計測します。

```sh
$ mpirun -n 2 --report-bindings singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D D
[inst-3egdh-ao-ol905:730888] Rank 0 bound to package[0][core:0]
[inst-3egdh-ao-ol905:730888] Rank 1 bound to package[0][core:1]

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       2.39
$ mpirun -n 2 --report-bindings singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D D
[inst-3egdh-ao-ol905:731019] Rank 0 bound to package[0][core:0]
[inst-3egdh-ao-ol905:731019] Rank 1 bound to package[0][core:1]

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456          279625.67
$
```

次に、以下コマンドを何れかのGPUノードのコンテナユーザで実行し、 **OSU Micro-Benchmarks** で2ノード間のデバイスメモリ間のレイテンシと帯域幅を計測します。

```sh
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_6:1,mlx5_7:1 singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D D
[inst-wth6t-ao-ol905:101107] SET UCX_NET_DEVICES=mlx5_6:1,mlx5_7:1

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       3.89
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_6:1,mlx5_7:1 singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D D
[inst-wth6t-ao-ol905:101229] SET UCX_NET_DEVICES=mlx5_6:1,mlx5_7:1

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           23068.54
$
```

以上の計測に関する詳細は、**[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[OSU Micro-Benchmarks実行方法（BM.GPU4.8/BM.GPU.A100-v2.8編）](../../benchmark/run-omb-gpu/)** を参照してください。

### 6-2-5. NCCL TestsによるNCCL通信性能計測

以下コマンドをGPUノードのコンテナユーザで実行し、 **NCCL Tests** をコンパイルします。

```Sh
$ singularity run --nv ~/singularity/ubuntu_noble_gpu.sif
Singularity> mkdir -p ~/`hostname` && cd ~/`hostname` && git clone https://github.com/NVIDIA/nccl-tests.git
Singularity> cd nccl-tests && make -j 64 MPI=1 MPI_HOME=/opt/openmpi CUDA_HOME=/usr/local/cuda NCCL_HOME=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/comm_libs/nccl; echo $?
Singularity> exit
$
```

次に、以下コマンドをGPUノードのコンテナユーザで実行し、1ノード8GPUの **NCCL** の **All-Reduce** 通信性能を **NCCL Tests** で計測します。

```sh
$ module load openmpi
$ mpirun -n 8 singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif ~/`hostname`/nccl-tests/build/all_reduce_perf -b 10G -e 10G -t 1 -g 1
# nccl-tests version 2.17.6 nccl-headers=22605 nccl-library=22605
# Collective test starting: all_reduce_perf
# nThread 1 nGpus 1 minBytes 10737418240 maxBytes 10737418240 step: 1048576(bytes) warmup iters: 1 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid 729729 on inst-3egdh-ao-ol905 device  0 [0000:0f:00] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid 729730 on inst-3egdh-ao-ol905 device  1 [0000:15:00] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid 729727 on inst-3egdh-ao-ol905 device  2 [0000:51:00] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid 729728 on inst-3egdh-ao-ol905 device  3 [0000:54:00] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid 729765 on inst-3egdh-ao-ol905 device  4 [0000:8d:00] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid 729764 on inst-3egdh-ao-ol905 device  5 [0000:92:00] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid 729763 on inst-3egdh-ao-ol905 device  6 [0000:d6:00] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid 729762 on inst-3egdh-ao-ol905 device  7 [0000:da:00] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw  #wrong     time   algbw   busbw  #wrong 
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)             (us)  (GB/s)  (GB/s)         
 10737418240    2684354560     float     sum      -1  80545.0  133.31  233.29       0  80545.7  133.31  233.29       0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 233.291 
#
# Collective test concluded: all_reduce_perf
```

次に、以下コマンドを何れかのGPUノードのコンテナユーザで実行し、2ノード16GPUの **NCCL** の **All-Reduce** 通信性能を **NCCL Tests** で計測します。

```sh
$ mpirun -n 16 -N 8 -hostfile ~/hostlist.txt -x NCCL_IB_QPS_PER_CONNECTION=4 -x NCCL_IB_GID_INDEX=3 -x UCX_NET_DEVICES=eth0 -x NCCL_IB_HCA="mlx5_0,mlx5_1,mlx5_2,mlx5_3,mlx5_6,mlx5_7,mlx5_8,mlx5_9,mlx5_10,mlx5_11,mlx5_12,mlx5_13,mlx5_14,mlx5_15,mlx5_16,mlx5_17" singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif ~/`hostname`/nccl-tests/build/all_reduce_perf -b 10G -e 10G -t 1 -g 1
[inst-wth6t-ao-ol905:87032] SET NCCL_IB_QPS_PER_CONNECTION=4
[inst-wth6t-ao-ol905:87032] SET NCCL_IB_GID_INDEX=3
[inst-wth6t-ao-ol905:87032] SET UCX_NET_DEVICES=eth0
[inst-wth6t-ao-ol905:87032] SET NCCL_IB_HCA=mlx5_0,mlx5_1,mlx5_2,mlx5_3,mlx5_6,mlx5_7,mlx5_8,mlx5_9,mlx5_10,mlx5_11,mlx5_12,mlx5_13,mlx5_14,mlx5_15,mlx5_16,mlx5_17
# nccl-tests version 2.17.6 nccl-headers=22605 nccl-library=22605
# Collective test starting: all_reduce_perf
# nThread 1 nGpus 1 minBytes 10737418240 maxBytes 10737418240 step: 1048576(bytes) warmup iters: 1 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid  87266 on inst-wth6t-ao-ol905 device  0 [0000:0f:00] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid  87197 on inst-wth6t-ao-ol905 device  1 [0000:15:00] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid  87196 on inst-wth6t-ao-ol905 device  2 [0000:51:00] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid  87250 on inst-wth6t-ao-ol905 device  3 [0000:54:00] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid  87230 on inst-wth6t-ao-ol905 device  4 [0000:8d:00] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid  87216 on inst-wth6t-ao-ol905 device  5 [0000:92:00] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid  87202 on inst-wth6t-ao-ol905 device  6 [0000:d6:00] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid  87288 on inst-wth6t-ao-ol905 device  7 [0000:da:00] NVIDIA A100-SXM4-40GB
#  Rank  8 Group  0 Pid  87901 on inst-0seu6-ao-ol905 device  0 [0000:0f:00] NVIDIA A100-SXM4-40GB
#  Rank  9 Group  0 Pid  87853 on inst-0seu6-ao-ol905 device  1 [0000:15:00] NVIDIA A100-SXM4-40GB
#  Rank 10 Group  0 Pid  87866 on inst-0seu6-ao-ol905 device  2 [0000:51:00] NVIDIA A100-SXM4-40GB
#  Rank 11 Group  0 Pid  87854 on inst-0seu6-ao-ol905 device  3 [0000:54:00] NVIDIA A100-SXM4-40GB
#  Rank 12 Group  0 Pid  87904 on inst-0seu6-ao-ol905 device  4 [0000:8d:00] NVIDIA A100-SXM4-40GB
#  Rank 13 Group  0 Pid  87948 on inst-0seu6-ao-ol905 device  5 [0000:92:00] NVIDIA A100-SXM4-40GB
#  Rank 14 Group  0 Pid  87903 on inst-0seu6-ao-ol905 device  6 [0000:d6:00] NVIDIA A100-SXM4-40GB
#  Rank 15 Group  0 Pid  87870 on inst-0seu6-ao-ol905 device  7 [0000:da:00] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw  #wrong     time   algbw   busbw  #wrong 
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)             (us)  (GB/s)  (GB/s)         
 10737418240    2684354560     float     sum      -1    90330  118.87  222.88      0    91945  116.78  218.96      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 220.921 
#
# Collective test concluded: all_reduce_perf

$
```

以上の計測に関する詳細は、**[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[NCCL Tests実行方法（BM.GPU4.8/BM.GPU.A100-v2.8 Oracle Linux編）](../../benchmark/run-nccltests/)** を参照してください。

### 6-2-6. Slurm環境バッチジョブでのMPI並列アプリケーション稼働確認

以下のファイルをSlurmクライアントに **slurm_gpu.sh** で作成します。  
このファイルは、 **OSU Micro-Benchmarks** で2ノード間のデバイスメモリ間のレイテンシと帯域幅の計測を行う、 **Slurm** に投入するジョブスクリプトです。

```sh
#!/bin/bash
#SBATCH -p sltest
#SBATCH -n 2
#SBATCH -N 2
#SBATCH --gres=gpu:nvidia_a100-sxm4-40gb:1
#SBATCH -J omb_gpu
#SBATCH -o stdout.%J
#SBATCH -e stderr.%J

export UCX_NET_DEVICES=mlx5_0:1,mlx5_1:1

echo "Start osu_latency"
srun singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D D
echo
echo "Start osu_bw"
srun singularity exec --nv ~/singularity/ubuntu_noble_gpu.sif osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D D
```

次に、以下コマンドをSlurmクライアントのコンテナユーザで実行し、先に作成したジョブスクリプトを投入、その結果を確認します。

```sh
$ sbatch slurm_gpu.sh
Submitted batch job 61
$ cat stdout.61 
Start osu_latency

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       3.89

Start osu_bw

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           23069.18

$