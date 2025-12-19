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
- Linuxカーネルのユーザ名前空間を活用した非特権ユーザのコンテナ実行による堅牢なセキュリティ
- **[OCI（Open Container Initiative）仕様](https://github.com/opencontainers/image-spec)** に準拠するコンテナイメージへの対応

本テクニカルTipsは、 **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** でノード間接続するHPCクラスタ上に **SingularityCE** で構築されたコンテナ環境でMPI並列アプリケーションを実行することを念頭に、計算ノードに **SingularityCE** をインストールし、ここで起動する **Ubuntu** のコンテナに **[OpenMPI](https://www.open-mpi.org/)** と **[OSU Micro-Benchmarks](https://mvapich.cse.ohio-state.edu/benchmarks/)** をインストールして **SIF** のカスタムコンテナイメージを作成、このコンテナイメージを使用して2ノード間のレイテンシと帯域幅を計測します。  
またこの計測を **[Slurm](https://slurm.schedmd.com/)** 環境で実行し、コンテナ上で実行するMPI並列アプリケーションがバッチジョブでも実行できることを確認します。

本テクニカルTipsは、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ手動構築編)](../../spinup-cluster-network/)** / **[HPCクラスタを構築する(基礎インフラ自動構築編)](../../spinup-hpc-cluster-withterraform/)** に従い予め **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** に接続するHPCクラスタが作成されており、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](../../tech-knowhow/setup-slurm-cluster/)** に従い予め **Slurm** 環境が構築されている（※1）ことを前提に、計算ノードに **SingularityCE** をインストールしてコンテナ環境を構築する手順を以下の順に解説します。

1. **[OpenMPIインストール](#1-openmpiインストール)**
2. **[計算ノードのSlurm環境への登録](#2-計算ノードのslurm環境への登録)**
3. **[SingularityCEインストール](#3-singularityceインストール)**
4. **[コンテナ起動ユーザ作成](#4-コンテナ起動ユーザ作成)**
5. **[コンテナイメージ作成](#5-コンテナイメージ作成)**
6. **[稼働確認](#6-稼働確認)**

※1）コンテナ上で実行するMPI並列アプリケーションをバッチジョブで実行する必要がない場合は、 **Slurm** 環境が予め構築されている必要はありません。

本テクニカルTipsは、以下の環境を前提とします。

- 計算ノード
    - **シェイプ** ： **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)**
    - **イメージ** ： **Oracle Linux** 9.5ベースのHPC **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※1）
    - ノード数： 2
    - ノード間接続インターコネクト ： **クラスタ・ネットワーク**
- **SingularityCE** ： 4.3.4

※1）**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.13** です。

また本テクニカルTipsは、コンテナ起動ユーザのホームディレクトリが全ての計算ノードで共有されていることを前提に記載します。

# 1. OpenMPIインストール

本章は、計算ノードに **OpenMPI** をインストールします。

**OpenMPI** のインストールは、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](../../tech-knowhow/build-openmpi/)** の **[1. インストール・セットアップ](../../tech-knowhow/build-openmpi/#1-インストールセットアップ)** の手順に従い実施します。

# 2. 計算ノードのSlurm環境への登録

本章は、計算ノードを既存の **Slurm** 環境に登録します。

計算ノードの **Slurm** 環境への登録は、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](../../tech-knowhow/setup-slurm-cluster/)** の **[2. 環境構築](../../tech-knowhow/setup-slurm-cluster/#2-環境構築)** の計算ノードに対する手順を実施することで行います。

# 3. SingularityCEインストール

本章は、計算ノードに **SingularityCE** をインストールします。

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

# 4. コンテナ起動ユーザ作成

本章は、計算ノードにコンテナ起動ユーザを作成し、このユーザでコンテナを起動するための必要な設定を行います。

コンテナ起動ユーザ（ここでは **usera** とします。）をLinuxのユーザとして作成します。

次に、以下コマンドをopcユーザで実行し、コンテナ起動ユーザのコンテナイメージファイル等を格納するディレクトリをNVMe SSDローカルディスク領域（ **/mnt/localdisk** にマウントされているとします。）に作成します。

```sh
$ sudo mkdir -p /mnt/localdisk/usera && sudo chown usera:usera /mnt/localdisk/usera
```

次に、以下コマンドを何れかの計算ノードでコンテナ起動ユーザで実行し、コンテナイメージファイル等を格納するディレクトリを指定する環境変数を設定します。

```sh
$ echo "export SINGULARITY_CACHEDIR=/mnt/localdisk/usera" | tee -a ~/.bashrc
$ echo "export SINGULARITY_TMPDIR=/mnt/localdisk/usera" | tee -a ~/.bashrc
$ source ~/.bashrc
```

次に、以下コマンドをコンテナ起動ユーザで実行し、コンテナの起動を確認します。

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

本章は、 **Ubuntu** のコンテナイメージを元に **sandbox** コンテナを作成し、このコンテナに **OpenMPI** と **OSU Micro-Benchmarks** をインストール、このコンテナから **SIF** のコンテナイメージを作成します。  
なお、コマンドブロック中の **Singularity>** はコンテナ内のプロンプトを表しており、これに続くコマンドは起動したコンテナ上で実行することを意味します。

以下コマンドをコンテナ起動ユーザで実行し、 **sandbox** コンテナ用のディレクトリを作成してここからコンテナを起動します。

```sh
$ cd /mnt/localdisk/usera && singularity build --sandbox ubuntu_noble_ompi/ docker://ubuntu:noble-20251013
$ singularity run --writable --fakeroot ubuntu_noble_ompi/
Singularity> mkdir -p /mnt/localdisk/root
Singularity> exit
$ module purge
$ singularity run --writable --fakeroot --bind /mnt/localdisk/usera:/mnt/localdisk/root ubuntu_noble_ompi/
```

次に、以下コマンドをコンテナ起動ユーザで実行し、 **OpenMPI** の前提ソフトウェアを **sandbox** コンテナにインストールします。

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

次に、以下コマンドをコンテナ起動ユーザで実行し、 **OpenMPI** を **sandbox** コンテナの **/opt/openmpi** にインストールします。

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

次に、以下コマンドをコンテナ起動ユーザで実行し、 **OSU Micro-Benchmarks** を **sandbox** コンテナの **/opt/openmpi/tests/omb** にインストールします。

```sh
Singularity> cd /mnt/localdisk/root/`hostname` && wget https://mvapich.cse.ohio-state.edu/download/mvapich/osu-micro-benchmarks-7.5.1.tar.gz
Singularity> tar -xvf ./osu-micro-benchmarks-7.5.1.tar.gz --no-same-owner
Singularity> module load openmpi
Singularity> cd osu-micro-benchmarks-7.5.1 && ./configure CC=mpicc CXX=mpicxx --prefix=/opt/openmpi/tests/omb
Singularity> make -j 36 && make install; echo $?
```

次に、以下のファイルを **sandbox** コンテナ上の **/usr/share/Modules/modulefiles/omb** で作成します。  
このファイルは、 **[Environment Modules](https://envmodules.io/)** にモジュール名 **omb** を登録し、これをロードすることで **OSU Micro-Benchmarks** 利用環境の設定を可能にします。

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

次に、以下コマンドをコンテナ起動ユーザで実行し、作成した **sandbox** コンテナを使用して
 **OSU Micro-Benchmarks** が動作することを確認します。

```sh
Singularity> exit
$ module load openmpi
$ mpirun -n 36 singularity exec ubuntu_noble_ompi/ osu_alltoall -x 1 -i 1 -m 67108864:67108864

# OSU MPI All-to-All Personalized Exchange Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
67108864           772123.24
$
```

次に、以下コマンドをコンテナ起動ユーザで実行し、作成した **sandbox** コンテナから **SIF** のコンテナイメージを作成します。  
この際、 **SIF** ファイルを作成するディレクトリが全ての計算ノードで共有されている点に留意します。

```sh
$ mkdir -p ~/singularity && singularity build ~/singularity/ubuntu_noble_ompi.sif ubuntu_noble_ompi/
```

# 6. 稼働確認

本章は、先に作成した **SIF** のコンテナイメージを使用し、 **OSU Micro-Benchmarks** でノード間のレイテンシと帯域幅を計測します。  
この際、この計測をインタラクティブに実行し構築したコンテナ環境の稼働を確認するとともに、この計測をバッチジョブとして実行しコンテナ上で動作するMPI並列アプリケーションを **Slurm** 環境でも利用できることを確認します。

以下コマンドを何れかの計算ノードでコンテナ起動ユーザで実行し、 **OSU Micro-Benchmarks** でノード間レイテンシ・帯域幅の計測をインタラクティブに実施します。

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

次に、以下のファイルをSlurmクライアントに **slurm.sh** で作成します。  
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

次に、以下コマンドをSlurmクライアントのコンテナ起動ユーザで実行し、先に作成したジョブスクリプトを投入、その結果を確認します。

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