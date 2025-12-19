---
title: "Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法"
description: "OpenMPIは、最新のMPI言語規格に準拠し、HPC/機械学習ワークロード実行に必要とされる様々な機能を備えたオープンソースのMPI実装です。OpenMPIで作成したアプリケーションのHPC/GPUクラスタに於ける実行は、計算リソース有効利用の観点から通常ジョブスケジューラを介したバッチジョブとして行いますが、ジョブスケジューラがSlurmの場合、PMIxを使用することでMPIアプリケーションの起動や通信初期化のスケーラビリティを向上させることが可能です。またUCXは、OpenMPIがクラスタ・ネットワークを利用して高帯域・低遅延のMPIプロセス間通信を実現するために欠かせない通信フレームワークです。本テクニカルTipsは、PMIxを使用するSlurm環境で通信フレームワークにUCXの使用を前提とするOpenMPI構築方法を解説します。"
weight: "3501"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

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

※3）この詳細は、**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](../../tech-knowhow/setup-slurm-cluster/)** の **[0. 概要](../../tech-knowhow/setup-slurm-cluster/#0-概要)** を参照してください。

また **[UCX](https://openucx.org/)** は、HPCでの利用を念頭に開発されているオープンソースの通信フレームワークで、 **OpenMPI** から利用可能な以下のノード内・ノード間通信手段を提供します。

- ノード内
  - POSIX共有メモリ
  - SYSTEM V共有メモリ
  - **[Cross Memory Attach (CMA)](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=fcf634098c00dd9cd247447368495f0b79be12d1)**
  - **[XPMEM](https://github.com/hpc/xpmem)**
  - **[GDRCopy](https://github.com/NVIDIA/gdrcopy)** （GPUノードの場合のみ使用します。）

- ノード間
  - InfiniBandトランスポート
      - Unreliable Datagram (UD)
      - Reliable Connected (RC)
      - Dynamically Connected (DC)
  - TCP

特に **UCX** を使用するノード間通信は、 **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** を介してInfiniBandトランスポートを使用したRDMA通信を行うことで、高帯域・低遅延のMPIプロセス間通信を実現します。

また **[Unified Collective Communication](https://github.com/openucx/ucc)** （以降 **UCC** と呼称します。） は、HPC/機械学習ワークロードでの利用を念頭に開発されている高性能・スケーラブルな集合通信ライブラリで、 **OpenMPI** の **[Modular Component Architecture](https://docs.open-mpi.org/en/v5.0.x/mca.html)** （以降 **MCA** と呼称）に組み込まれたコンポーネントとして **OpenMPI** が提供する集合通信ライブラリを置き換えて利用することで、集合通信を多用するアプリケーションの高速化が期待できます。

以上の利点を享受するべく本テクニカルTipsは、 **Slurm** 環境でMPIアプリケーションを **No. 1.** の動作モードで実行すること、通信フレームワークに **UCX** を使用すること、及び **UCC** を **MCA** のコンポーネントとして利用することを想定し、このための **OpenMPI** の構築方法をCPUワークロード向け計算ノードでの手順とGPUワークロード向けGPUノードでの手順を解説、構築した **OpenMPI** の稼働確認として以下のアプリケーションを実行します。

- **[OSU Micro-Benchmarks](https://mvapich.cse.ohio-state.edu/benchmarks/)**
- **[NAS Parallel Benchmarks](https://www.nas.nasa.gov/software/npb.html)**

本テクニカルTipsは、以下の環境を前提とし、
- 計算ノード
  - シェイプ： **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)**
  - イメージ： **Oracle Linux** 8.10 / 9.05ベースのHPC **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※1）
- GPUノード
  - シェイプ： **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)**
  - イメージ： **Oracle Linux** 9.05ベースのGPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※2）
- **OpenMPI** ： 5.0.8
- **PMIx** ： **[OpenPMIx](https://openpmix.github.io/)** 5.0.8
- **UCX** ： **[OpenUCX](https://openucx.readthedocs.io/en/master/index.html#)** 1.19.0
- **UCC** ： 1.5.0

※1）**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** / **No.13** です。  
※2）**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.15** です。

**Oracle Linux** のバージョンと計算ノードかGPUノードかによる構築方法の違いは、以降の構築手順中の注釈で判断します。

本テクニカルTipsに従い **OpenMPI** 環境を構築する計算/GPUノードは、 **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** でノード間を接続し、稼働確認を行うために少なくとも2ノード用意します。  
この構築手順は、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ手動構築編)](../../spinup-cluster-network/)** / **[GPUクラスタを構築する(基礎インフラ自動構築編)](../../spinup-gpu-cluster/)** が参考になります。

なお、ここで構築する **OpenMPI** と連携する **Slurm** 環境の構築方法は、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](../../tech-knowhow/setup-slurm-cluster/)** を参照してください。  

# 1. インストール・セットアップ

## 1-0. 概要

本章は、計算/GPUノードに **OpenMPI** とその前提ソフトウェアの **OpenPMIx** や **OpenUCX** 等をインストールし、MPIプログラムをコンパイル・実行するためのセットアップを実施します。

## 1-1.  OpenMPI前提ソフトウェアインストール

### 1-1-0. 概要

本章は、 **OpenMPI** の前提となる以下のソフトウェアをインストールします。

1. **[libevent](https://libevent.org/)**
2. **[hwloc](https://www.open-mpi.org/projects/hwloc/)**
3. **OpenPMIx**
4. **XPMEM** （ **Oracle Linux** 8.10の場合のみ実施します。）
5. **GDRCopy** （GPUノードの場合のみ実施します。）
6. **OpenUCX**
7. **UCC**

### 1-1-1. libeventインストール

以下コマンドをopcユーザで実行し、 **libevent** を **/opt/libevent** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ mkdir -p ~/`hostname` && cd ~/`hostname` && wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
$ tar -xvf ./libevent-2.1.12-stable.tar.gz
$ cd libevent-2.1.12-stable && ./configure --prefix=/opt/libevent
$ make -j 36 && sudo make install; echo $?
```

### 1-1-2. hwlocインストール

以下コマンドをopcユーザで実行し、 **hwloc** を **/opt/hwloc** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。また、インストール対象のイメージがHPC / GPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** のどちらかにより実行するコマンドが異なる点に留意します。

```sh
$ cd ~/`hostname` && wget https://download.open-mpi.org/release/hwloc/v2.12/hwloc-2.12.2.tar.gz
$ tar -xvf ./hwloc-2.12.2.tar.gz
$ cd hwloc-2.12.2 && ./configure --prefix=/opt/hwloc # For HPC
$ cd hwloc-2.12.2 && ./configure --prefix=/opt/hwloc --with-cuda=/usr/local/cuda # For GPU
$ make -j 36 && sudo make install; echo $?
```

### 1-1-3. OpenPMIxインストール

以下コマンドをopcユーザで実行し、 **OpenPMIx** を **/opt/pmix** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && wget https://github.com/openpmix/openpmix/releases/download/v5.0.8/pmix-5.0.8.tar.gz
$ tar -xvf ./pmix-5.0.8.tar.gz
$ cd pmix-5.0.8 && ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
$ make -j 36 && sudo make install; echo $?
```

### 1-1-4. XPMEMインストール

本章で実施する **XPMEM** のインストールは、 **Oracle Linux** 8.10の場合のみ実施します。

以下コマンドをopcユーザで実行し、 **XPMEM** を **/opt/xpmem** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && git clone https://github.com/hpc/xpmem.git
$ cd xpmem && ./autogen.sh && ./configure --prefix=/opt/xpmem
$ make -j 36 && sudo make install; echo $?
```

次に、以下コマンドをopcユーザで実行し、 **XPMEM** をカーネルモジュールとしてインストールします。

```sh
$ sudo modprobe -r xpmem
$ sudo install -D -m 644 /opt/xpmem/lib/modules/`uname -r`/kernel/xpmem/xpmem.ko /lib/modules/`uname -r`/extra/xpmem/xpmem.ko
$ sudo depmod -a
$ sudo modprobe xpmem
```

### 1-1-5. GDRCopyインストール

本章で実施する **GDRCopy** のインストールは、GPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** の場合のみ実施します。

以下コマンドをopcユーザで実行し、 **GDRCopy** を **/opt/gdrcopy** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && wget https://github.com/NVIDIA/gdrcopy/archive/refs/tags/v2.5.1.tar.gz
$ tar -xvf ./v2.5.1.tar.gz
$ cd gdrcopy-2.5.1 && make -j 64 CUDA=/usr/local/cuda all && sudo make prefix=/opt/gdrcopy install; echo $?
$ sed 's/src\/gdrdrv/\/lib\/modules\/`uname -r`\/extra/g' ./insmod.sh | sudo tee /opt/gdrcopy/bin/insmod.sh && sudo chmod 755 /opt/gdrcopy/bin/insmod.sh
```

次に、以下のファイルを **/etc/systemd/system/gdrcopy.service** として作成します。  
なお、本章のこれ以降の手順はGPUを搭載するインスタンスでのみ実施します。

```sh
[Unit]
Description=Start GDRCopy

[Service]
ExecStart=/opt/gdrcopy/bin/insmod.sh
Restart=no
Type=oneshot
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

次に、以下コマンドをopcユーザで実行し、 **GDRCopy** をカーネルモジュールとしてインストールします。

```sh
$ sudo install -D -m 644 ./src/gdrdrv/gdrdrv.ko /lib/modules/`uname -r`/extra/gdrdrv.ko
$ sudo depmod -a
$ sudo systemctl daemon-reload
$ sudo systemctl enable --now gdrcopy
```

### 1-1-6. OpenUCXインストール

以下コマンドをopcユーザで実行し、 **OpenUCX** を **/opt/ucx** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。また、インストール対象のイメージが **Oracle Linux** 8.10 / 9.05ベースのHPC / GPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** のうちどれかにより実行するコマンドが異なる点に留意します。

```sh
$ cd ~/`hostname` && wget https://github.com/openucx/ucx/releases/download/v1.19.0/ucx-1.19.0.tar.gz
$ tar -xvf ./ucx-1.19.0.tar.gz
$ cd ucx-1.19.0 && ./contrib/configure-release --prefix=/opt/ucx --with-xpmem=/opt/xpmem # For Oracle Linux 8 HPC
$ cd ucx-1.19.0 && ./contrib/configure-release --prefix=/opt/ucx # For Oracle Linux 9 HPC
$ cd ucx-1.19.0 && ./contrib/configure-release --prefix=/opt/ucx --with-cuda=/usr/local/cuda -with-gdrcopy=/opt/gdrcopy # For Oracle Linux 9 GPU
$ make -j 36 && sudo make install; echo $?
```

### 1-1-7. UCCインストール

以下コマンドをopcユーザで実行し、 **UCC** を **/opt/ucc** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。また、インストール対象のイメージがHPC / GPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** のどちらかにより実行するコマンドが異なる点に留意します。

```sh
$ cd ~/`hostname` && wget https://github.com/openucx/ucc/archive/refs/tags/v1.5.0.tar.gz
$ tar -xvf ./v1.5.0.tar.gz
$ cd ./ucc-1.5.0/ && ./autogen.sh && ./configure --prefix=/opt/ucc --with-ucx=/opt/ucx # For HPC
$ cd ./ucc-1.5.0/ && ./autogen.sh && ./configure --prefix=/opt/ucc --with-ucx=/opt/ucx --with-cuda=/usr/local/cuda --with-nccl # For GPU
$ make -j 36 && sudo make install; echo $?
```

## 1-2. OpenMPIインストール

以下コマンドをopcユーザで実行し、 **OpenMPI** を **/opt/openmpi** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。また、インストール対象のイメージがHPC / GPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** のどちらかにより実行するコマンドが異なる点に留意します。

```sh
$ cd ~/`hostname` && wget https://download.open-mpi.org/release/open-mpi/v5.0/openmpi-5.0.8.tar.gz
$ tar -xvf ./openmpi-5.0.8.tar.gz
$ cd openmpi-5.0.8 && ./configure --prefix=/opt/openmpi --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-ucx=/opt/ucx --with-ucc=/opt/ucc --with-slurm # For HPC
$ cd openmpi-5.0.8 && ./configure --prefix=/opt/openmpi --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-ucx=/opt/ucx --with-ucc=/opt/ucc --with-slurm --with-cuda=/usr/local/cuda # For GPU
$ make -j 36 all && sudo make install; echo $?
```

## 1-3. セットアップ

### 1-3-0. 概要

本章は、 **OpenMPI** を利用するユーザがMPIプログラムをコンパイル・実行するために必要な以下のセットアップを行います。

1. **[Environment ModulesへのOpenMPI用モジュール登録](#1-3-1-environment-modulesへのopenmpi用モジュール登録)**
2. **[ホストリストファイル作成](#1-3-2-ホストリストファイル作成)**
3. **[パスフレーズ無しSSHアクセスのための設定](#1-3-3-パスフレーズ無しsshアクセスのための設定)**

### 1-3-1. Environment ModulesへのOpenMPI用モジュール登録

以下のファイルを **/usr/share/Modules/modulefiles/openmpi** で作成します。  
このファイルは、 **[Environment Modules](https://envmodules.io/)** にモジュール名 **openmpi** を登録し、これをロードすることで **OpenMPI** 利用環境の設定を可能にします。  
なお、インストール対象のイメージがHPC / GPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** のどちらかにより作成するファイルが異なる点に留意します。

```sh
#%Module1.0
##
## OpenMPI for GNU compiler on HPC image

proc ModulesHelp { } {
        puts stderr "OpenMPI 5.0.8 for GNU compiler on HPC image\n"
}

module-whatis   "OpenMPI 5.0.8 for GNU compiler on HPC image"

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

```sh
#%Module1.0
##
## OpenMPI for GNU compiler on GPU image

proc ModulesHelp { } {
        puts stderr "OpenMPI 5.0.8 for GNU compiler on GPU image\n"
}

module-whatis   "OpenMPI 5.0.8 for GNU compiler on GPU image"

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

### 1-3-2. ホストリストファイル作成

**OpenMPI** 利用ユーザのホームディレクトリがノード間で共有されていることを前提に、以下の手順を何れか1ノードで **OpenMPI** を利用するユーザで実施します。  
このユーザのホームディレクトリが共有されていない場合は、 **OpenMPI** を実行する全てのノードでこれを実行します。

**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[計算/GPUノードのホスト名リスト作成方法](../../tech-knowhow/compute-host-list/)** の手順に従い、MPIプログラムを実行する全てのホスト名を記載したホストリストファイルを当該ユーザのホームディレクトリ直下に **hostlist.txt** として作成します。

なお、ここで作成するホストリストファイルは、 **OpenMPI** 単独で稼働確認を行うために作成しますが、 **Slurm** 環境では必要ありません。

### 1-3-3. パスフレーズ無しSSHアクセスのための設定

**OpenMPI** 利用ユーザのホームディレクトリがノード間で共有されていることを前提に、以下コマンドを何れか1ノードで **OpenMPI** を利用するユーザで実行し、MPIプログラムを実行する全てのノード間でパスフレーズ無しでSSHアクセス出来るように設定します。  
このユーザのホームディレクトリが共有されていない場合は、1ノードで以下の手順を実行し、作成した **id_rsa** 、 **authorized_keys** 、 及び **known_hosts** の3個のファイルをパーミッションを維持して **OpenMPI** を実行する全てのノードの同じディレクトリに配置します。

```sh
$ cd ~ && mkdir .ssh && chmod 700 .ssh
$ ssh-keygen -t rsa -N "" -f .ssh/id_rsa
$ cd .ssh && cat ./id_rsa.pub >> ./authorized_keys && chmod 600 ./authorized_keys
$ for hname in `cat ~/hostlist.txt`; do echo $hname; ssh -oStrictHostKeyChecking=accept-new $hname :; done
```

なお、ここで実施するパスフレーズ無しのSSHアクセスのための手順は、 **OpenMPI** 単独で稼働確認を行うために実施しますが、 **PMIx** を使用する **Slurm** 環境では必要ありません。

# 2. 稼働確認

## 2-0. 概要

本章は、インストールした **OpenMPI** を稼働確認するため、  **OSU Micro-Benchmarks**  と **NAS Parallel Benchmarks** を実行します。

## 2-1. OSU Micro-Benchmarks実行

**[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[OSU Micro-Benchmarks実行方法（BM.Optimized3.36編）](../../benchmark/run-omb-hpc/)** /  **[OSU Micro-Benchmarks実行方法（BM.GPU4.8/BM.GPU.A100-v2.8編）](../../benchmark/run-omb-gpu/)** の手順に従い、 **OSU Micro-Benchmarks** を実行してその結果が想定される性能となっていることを確認します。

## 2-2. NAS Parallel Benchmarks実行

**OpenMPI** 利用ユーザのホームディレクトリがノード間で共有されていることを前提に、以下コマンドを何れか1ノードで **OpenMPI** を利用するユーザで実行し、 **NAS Parallel Benchmarks** をインストールします。

```sh
$ cd ~ && wget https://www.nas.nasa.gov/assets/npb/NPB3.4.3-MZ.tar.gz
$ tar -xvf ./NPB3.4.3-MZ.tar.gz
$ cd NPB3.4.3-MZ/NPB3.4-MZ-MPI
$ cp config/make.def.template config/make.def
$ module load openmpi
$ make bt-mz CLASS=C
```

次に、以下コマンドを何れか1ノードで **OpenMPI** を利用するユーザで実行し、 **NAS Parallel Benchmarks** を実行、その結果を確認します。  
なお、実行対象が計算/GPUノードのどちらかにより実行するコマンドが異なる点に留意します。またこのコマンドは、2ノード実行の場合です。

```sh
$ mpirun -n 36 -N 18 --hostfile ~/hostlist.txt -x OMP_NUM_THREADS=2 -x UCX_NET_DEVICES=mlx5_2:1 --bind-to none ./bin/bt-mz.C.x # For compute x 2 nodes
$ mpirun -n 64 -N 32 --hostfile ~/hostlist.txt -x OMP_NUM_THREADS=2 -x UCX_NET_DEVICES=mlx5_6:1 --bind-to none ./bin/bt-mz.C.x # For GPU x 2 nodes
```

以下は、計算ノード２ノードで実行した場合の出力です。

```sh
[inst-xsyjo-x9-ol905:253761] SET OMP_NUM_THREADS=2
[inst-xsyjo-x9-ol905:253761] SET UCX_NET_DEVICES=mlx5_2:1


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
 Time in seconds =                     7.67
 Total processes =                       36
 Total threads   =                       72
 Mop/s total     =                316523.02
 Mop/s/thread    =                  4396.15
 Operation type  =           floating point
 Verification    =               SUCCESSFUL
 Version         =                    3.4.3
 Compile date    =              04 Sep 2025

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