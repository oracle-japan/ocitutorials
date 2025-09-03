---
title: "UbuntuをOSとするHPC/機械学習ワークロード向けGPUインスタンス構築方法"
excerpt: "HPC/機械学習ワークロード実行のためのGPU搭載インスタンスは、NVIDIAが提供する様々なGPU関連ソフトウェアの開発が主にUbuntuで行われていることから、そのOSにUbuntuを使用するのが主流になっていますが、UbuntuをOSに指定してGPU搭載インスタンスを作成する場合、GPUを利用するためのソフトウェアを自身でインストール・セットアップする必要があります。本テクニカルTipsは、UbuntuをGPU搭載インスタンスと共に作成した後GPU利用に必要なソフトウェアをインストール・セットアップすることで、HPC/機械学習ワークロード向けGPUインスタンスを構築する方法を解説します。"
order: "341"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

**注意 :** 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。

***
# 0. 概要

GPUインスタンスのOSに利用可能なLinuxディストリビューションは、 **Oracle Linux** をはじめ主要なものが **[プラットフォーム・イメージ](/ocitutorials/hpc/#5-17-プラットフォームイメージ)** として用意されていますが、HPC/機械学習ワークロード向けのOSで主流になっている **Ubuntu** もこれに含まれます。  
ただこの場合、GPUを利用するための以下ソフトウェアは、GPUインスタンス作成後に自身でインストール・セットアップする必要があります。

- **[NVIDIA Driver](https://docs.nvidia.com/datacenter/tesla/driver-installation-guide/index.html#)** : NVIDIA製GPUドライバソフトウェア
- **[NVIDIA CUDA](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/contents.html)** : CUDAライブラリ
- **[NVIDIA Fabric Manager](https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html)** : **NVSwitch** （ **BM.GPU4.8** / **BM.GPU.A100-v2.8** に搭載）管理ソフトウェア（※1）
- **[NVIDIA HPC SDK](https://developer.nvidia.com/hpc-sdk)** ： NVIDIA製GPU向けHPC/機械学習アプリケーション開発環境
- CUDA-aware MPIライブラリ： **CUDA IPC** / **GPUDirect RDMA** 対応のデバイスメモリアドレッシング可能なMPIライブラリ

※1）**NVSwitch** を搭載するシェイプの場合のみインストールします。

本テクニカルTipsは、GPU上でHPC/機械学習ワークロードを実行する際に必要となるこれらのソフトウェアをGPUインスタンスにインストールし、構築した環境で以下のソフトウェア/サンプルプログラムを使用して動作確認を行う手順を、GPUシェイプ **[BM.GPU4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** を例に解説します。

1. **[CUDA Samples](https://github.com/nvidia/cuda-samples)**
2. OpenACCサンプルプログラム
3. OpenACC/MPIハイブリッドサンプルプログラム
4. **[NCCL Tests](https://github.com/nvidia/nccl-tests)** 

本テクニカルTipsは、以下のソフトウェアバージョンを前提とします。

- OS ： **Ubuntu** 24.04 / 22.04 （※2）
- **NVIDIA Driver** ： 575.57.08
- **NVIDIA CUDA** ： 12.9
- **NVIDIA Fabric Manager** ： 575.57.08
- **NVIDIA HPC SDK** ： 25.7
- CUDA-aware MPIライブラリ ： **[OpenMPI](https://www.open-mpi.org/)** 5.0.6

※2） **[プラットフォーム・イメージ](/ocitutorials/hpc/#5-17-プラットフォームイメージ)** の **[Canonical-Ubuntu-24.04-2025.07.23-0](https://docs.oracle.com/en-us/iaas/images/ubuntu-2404/canonical-ubuntu-24-04-2025-07-23-0.htm)** /  **[Canonical-Ubuntu-22.04-2025.07.23-0](https://docs.oracle.com/en-us/iaas/images/ubuntu-2204/canonical-ubuntu-22-04-2025-07-23-0.htm)** です。

***
# 1. GPUインスタンス作成

本章は、 **Ubuntu** をOSとする **BM.GPU4.8** を作成します。

OCIコンソールにログインし、GPUインスタンスを作成する **リージョン** を選択後、 **コンピュート** → **インスタンス** とメニューを辿ります。

次に、表示される以下画面で、**インスタンスの作成** ボタンをクリックします。

![画面ショット](console_page01.png)

次に、表示される **基本情報** 画面で、以下の情報を入力し **次** ボタンをクリックします。  
なお、ここに記載のないフィールドは、デフォルトのままとします。  

- **名前** ：インスタンスに付与する名前
- **コンパートメントに作成** ：インスタンスを作成する **コンパートメント**
- **可用性ドメイン** ：インスタンスを作成する **可用性ドメイン**
- **イメージ** ： **Canonical-Ubuntu-24.04-2025.05.20-0** / **Canonical-Ubuntu-22.04-2025.07.23-0** 
（ **イメージの変更** ボタンをクリックして表示される以下 **イメージの選択** サイドバーで **Ubuntu** を選択し **イメージ名** 列で **Canonical Ubuntu 24.04** / **Canonical Ubuntu 22.04** を選択し **イメージ・ビルド** プルダウンメニューで **2025.05.20-0** / **2025.07.23-0** を選択し、 **イメージの選択** ボタンをクリック。）

![画面ショット](console_page02.png)

- **Shape** ： **BM.GPU4.8**  
（ **シェイプの変更** ボタンをクリックして表示される以下 **すべてのシェイプの参照** サイドバーで **ベア・メタル・マシン** をクリックして表示される **BM.GPU4.8** を選択し **次のドキュメントを確認した上でこれに同意します。** チェックボックスをチェックし、 **シェイプの選択** ボタンをクリック。）

![画面ショット](console_page03.png)

次に、表示される **セキュリティ** 画面で、 **次** ボタンをクリックします。

次に、表示される **ネットワーキング** 画面で、以下の情報を入力し **次** ボタンをクリックします。  
なお、ここに記載のないフィールドは、デフォルトのままとします。  

- **プライマリ・ネットワーク** ： GPUインスタンスを接続する **仮想クラウドネットワーク**
- **サブネット** ： GPUインスタンスを接続する **サブネット**
- **SSHキーの追加** ：GPUインスタンスにSSHログインする際使用するSSH秘密鍵に対応する公開鍵  
（公開鍵ファイルのアップロード（ **公開キー・ファイル(.pub)のアップロード** ）と公開鍵のフィールドへの貼り付け（ **公開キーの貼付け** ）が選択可能）

次に、表示される **ストレージ** 画面で、以下の情報を入力し **次** ボタンをクリックします。  
なお、ここに記載のないフィールドは、デフォルトのままとします。  

- **ブート・ボリューム・サイズ(GB)** ：GPUインスタンスの **ブート・ボリューム** サイズ  
（ **Specify a custom boot volume size and performance setting** チェックボックスをチェックすると指定可能）  
通常GPUノードは、様々な機械学習用ソフトウェアやコンテナイメージを格納する必要があるため、少なくとも200 GBの **ブート・ボリューム** サイズとします。

次に、表示される **確認** 画面で、作成するGPUインスタンスの情報を確認し **作成** ボタンをクリックします。

次に、以下コマンドでGPUインスタンスにSSHログインします。この時、作成時にデフォルトで作成されるユーザが **ubuntu** であることに留意します。  
なお、 **BM.GPU4.8** インスタンスの場合、作成開始からSSHログインできるまでに20分程度かかります。

```sh
$ ssh ubuntu@aaa.bbb.ccc.ddd
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、OSの自動アップデートを停止します。  
この手順は、以降の作業でカーネルのバージョンに依存するカーネルモジュールのロードを行うため、それ以降の意図せぬカーネルの自動アップデートを避けるために実施します。

```sh
$ sudo cp -p /etc/apt/apt.conf.d/20auto-upgrades /tmp/
$ sudo sed -i 's/Upgrade "1"/Upgrade "0"/g' /etc/apt/apt.conf.d/20auto-upgrades
$ sudo sed -i 's/Lists "1"/Lists "0"/g' /etc/apt/apt.conf.d/20auto-upgrades
$ sudo diff /tmp/20auto-upgrades /etc/apt/apt.conf.d/20auto-upgrades
1,2c1,2
< APT::Periodic::Update-Package-Lists "1";
< APT::Periodic::Unattended-Upgrade "1";
---
> APT::Periodic::Update-Package-Lists "0";
> APT::Periodic::Unattended-Upgrade "0";
$ sudo systemctl disable --now unattended-upgrades
Synchronizing state of unattended-upgrades.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
Executing: /usr/lib/systemd/systemd-sysv-install disable unattended-upgrades
Removed "/etc/systemd/system/multi-user.target.wants/unattended-upgrades.service".
$
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、apparmorサービスを永続的に停止します。

```sh
$ sudo systemctl disable --now apparmor
```

***
# 2. NVIDIA GPU関連ソフトウェアインストール

## 2-0. 概要

本章は、GPUインスタンスに以下の **NVIDIA** GPU関連ソフトウェアをインストールします。

- **NVIDIA Driver**
- **NVIDIA CUDA Toolkit**
- **NVIDIA Fabric Manager**（※3）
- **NVIDIA HPC SDK**

※3） **NVSwitch** を搭載するシェイプの場合のみ実施します。

本テクニカルTipsでのこれらソフトウェアのインストールは、 **Ubuntu** パッケージマネージャを使用します。

## 2-1. インストール手順

以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **NVIDIA Driver** をインストールします。

```sh
$ distribution=$(. /etc/os-release;echo $ID$VERSION_ID | sed -e 's/\.//g')
$ mkdir ~/`hostname` && cd ~/`hostname` && wget https://developer.download.nvidia.com/compute/cuda/repos/$distribution/x86_64/cuda-keyring_1.1-1_all.deb
$ sudo dpkg -i cuda-keyring_1.1-1_all.deb
$ sudo apt update
$ sudo apt install -y cuda-drivers-580
```

次に、OCIコンソールからGPUインスタンスを再起動します。  
この再起動は、 **BM.GPU4.8** の場合でSSHログインできるまでに20分程度かかります。

GPUインスタンス起動後、ubuntuユーザでSSHログインして以下コマンドを実行し、先の **NVIDIA Driver** のインストールでGPUを認識できていることを確認します。

```sh
$ nvidia-smi
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **NVIDIA CUDA** と後の動作確認で必要なソフトウェアをインストールします。

```sh
$ sudo apt install -y cuda-toolkit-12-9 cmake unzip
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **NVIDIA Fabric Manager** をインストール・セットアップします。  
なおこの手順と次のGPUインスタンス再起動は、 **NVSwitch** を搭載するシェイプの場合のみ実施します。

```sh
$ sudo apt install -y nvidia-gds-12-9
$ sudo apt install -y cuda-drivers-fabricmanager
$ sudo systemctl enable nvidia-fabricmanager
```

次に、OCIコンソールからGPUインスタンスを再起動します。  
この再起動は、 **BM.GPU4.8** の場合でSSHログインできるまでに20分程度かかります。

GPUインスタンス起動後、ubuntuユーザでSSHログインして以下コマンドを実行し、 **NVIDIA HPC SDK** をインストールします。

```sh
$ curl https://developer.download.nvidia.com/hpc-sdk/ubuntu/DEB-GPG-KEY-NVIDIA-HPC-SDK | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-hpcsdk-archive-keyring.gpg
$ echo 'deb [signed-by=/usr/share/keyrings/nvidia-hpcsdk-archive-keyring.gpg] https://developer.download.nvidia.com/hpc-sdk/ubuntu/amd64 /' | sudo tee /etc/apt/sources.list.d/nvhpc.list
$ sudo apt update
$ sudo apt install -y nvhpc-25-7-cuda-multi environment-modules
$ sudo cp -p /opt/nvidia/hpc_sdk/modulefiles/nvhpc/25.7 /usr/share/modules/modulefiles/nvhpc
```

***
# 3. OpenMPIインストール・セットアップ

## 3-0. 概要

本章は、GPUインスタンスにCUDA-aware **OpenMPI** とその前提ソフトウェアの以下ソフトウェアをインストールします。

- **[libevent](https://libevent.org/)**
- **[hwloc](https://www.open-mpi.org/projects/hwloc/)**
- **[OpenPMIx](https://openpmix.github.io/)**
- **[KNEM](https://knem.gitlabpages.inria.fr/)**
- **[XPMEM](https://github.com/hpc/xpmem)**
- **[gdrcopy](https://github.com/NVIDIA/gdrcopy)**
- **[OpenUCX](https://openucx.readthedocs.io/en/master/index.html#)**
- **[Unified Collective Communication](https://github.com/openucx/ucc)** （以降 **UCC** と呼称します。）

## 3-1.  OpenMPI前提ソフトウェア・RPMパッケージインストール

以下コマンドをGPUインスタンスのubuntuユーザで実行し、前提RPMパッケージをインストールします。  

```sh
$ sudo apt install -y libssl-dev autoconf libtool zlib1g-dev
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **libevent** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
$ tar -xvf ./libevent-2.1.12-stable.tar.gz
$ cd libevent-2.1.12-stable && ./configure --prefix=/opt/libevent
$ make -j 128 && sudo make install
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **hwloc** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && wget https://download.open-mpi.org/release/hwloc/v2.11/hwloc-2.11.2.tar.gz
$ tar -xvf ./hwloc-2.11.2.tar.gz
$ cd hwloc-2.11.2 && ./configure --prefix=/opt/hwloc --with-cuda=/usr/local/cuda-12.9
$ make -j 128 && sudo make install
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **OpenPMIx** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && wget https://github.com/openpmix/openpmix/releases/download/v5.0.4/pmix-5.0.4.tar.gz
$ tar -xvf ./pmix-5.0.4.tar.gz
$ cd pmix-5.0.4 && ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
$ make -j 128 && sudo make install
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **KNEM** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && git clone https://gitlab.inria.fr/knem/knem.git
$ cd knem && ./autogen.sh && ./configure --prefix=/opt/knem
$ make -j 128 && sudo make install
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **XPMEM** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && git clone https://github.com/hpc/xpmem.git
$ cd xpmem && ./autogen.sh && ./configure --prefix=/opt/xpmem
$ make -j 128 && sudo make install
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **KNEM** と **XPMEM** をカーネルモジュールとしてインストールします。

```sh
$ sudo install -D -m 644 /opt/xpmem/lib/modules/`uname -r`/kernel/xpmem/xpmem.ko /lib/modules/`uname -r`/extra/xpmem.ko
$ sudo /opt/knem/sbin/knem_local_install
$ echo knem | sudo tee /etc/modules-load.d/knem.conf
$ echo xpmem | sudo tee /etc/modules-load.d/xpmem.conf
$ sudo modprobe xpmem
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **gdrcopy** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && wget https://github.com/NVIDIA/gdrcopy/archive/refs/tags/v2.5.tar.gz
$ tar -xvf ./v2.5.tar.gz
$ cd gdrcopy-2.5 && make -j 128 CUDA=/usr/local/cuda-12.9 all && sudo make prefix=/opt/gdrcopy install
$ sudo sed 's/src\/gdrdrv/\/lib\/modules\/`uname -r`\/extra/g' ./insmod.sh | sudo tee /opt/gdrcopy/bin/insmod.sh && sudo chmod 755 /opt/gdrcopy/bin/insmod.sh
$ sudo install -D -m 644 ~/`hostname`/gdrcopy-2.5/src/gdrdrv/gdrdrv.ko /lib/modules/`uname -r`/extra/gdrdrv.ko
$ sudo depmod -a
```

次に、以下のファイルを **/etc/systemd/system/gdrcopy.service** として作成します。

```sh
[Unit]
Description=Start gdrcopy

[Service]
ExecStart=/opt/gdrcopy/bin/insmod.sh
Restart=no
Type=oneshot
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **gdrcopy** をカーネルモジュールとしてインストールします。

```sh
$ sudo systemctl daemon-reload
$ sudo systemctl enable --now gdrcopy
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **OpenUCX** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~/`hostname` && wget https://github.com/openucx/ucx/releases/download/v1.18.1/ucx-1.18.1.tar.gz
$ tar -xvf ./ucx-1.18.1.tar.gz
$ cd ucx-1.18.1 && ./contrib/configure-release --prefix=/opt/ucx --with-knem=/opt/knem --with-xpmem=/opt/xpmem --with-cuda=/usr/local/cuda-12.9 -with-gdrcopy=/opt/gdrcopy
$ make -j 128 && sudo make install
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **UCC** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。  
最後のコマンドは、 **BM.GPU4.8** の場合で30分程度を要します。

```sh
$ cd ~/`hostname` && wget https://github.com/openucx/ucc/archive/refs/tags/v1.3.0.tar.gz
$ tar -xvf ./v1.3.0.tar.gz
$ cd ./ucc-1.3.0/ && ./autogen.sh && ./configure --prefix=/opt/ucc --with-ucx=/opt/ucx --with-cuda=/usr/local/cuda-12.9 --with-nccl=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/comm_libs/nccl
$ make -j 128 && sudo make install
```

## 3-2. OpenMPIインストール

以下コマンドをGPUインスタンスのubuntuユーザで実行します。

```sh
$ cd ~/`hostname` && wget https://download.open-mpi.org/release/open-mpi/v5.0/openmpi-5.0.6.tar.gz
$ tar -xvf ./openmpi-5.0.6.tar.gz
$ . /etc/profile.d/modules.sh
$ module load nvhpc
$ cd openmpi-5.0.6 && ./configure --prefix=/opt/openmpi --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-ucx=/opt/ucx --with-ucc=/opt/ucc --with-slurm --with-cuda=/usr/local/cuda-12.9 CC=nvc CXX=nvc++ FC=nvfortran CFLAGS="-mno-hle"
```

次に、カレントディレクトリに作成されたファイル **libtool** を以下のように修正します。

```sh
$ diff libtool_org libtool
10550a10551
> 	  export PATH=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/compilers/bin:${PATH}
$
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **OpenMPI** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ make -j 128 all && sudo make install
```

## 3-3. セットアップ

本章は、GPU環境利用ユーザがMPIプログラムをコンパイル・実行するために必要な環境のセットアップを行います。

以下のファイルを **/usr/share/modules/modulefiles/openmpi** で作成します。  
このファイルは、 **Environment modules** にモジュール名 **openmpi** を登録し、これをロードすることで **OpenMPI** 利用環境の設定が可能になります

```sh
#%Module1.0
##
## OpenMPI for NVIDIA compiler 25.7

proc ModulesHelp { } {
        puts stderr "OpenMPI 5.0.6 for NVIDIA compiler 25.7\n"
}

module-whatis   "OpenMPI 5.0.6 for NVIDIA compiler 25.7"

set pkg_root    /opt/openmpi
set ver         5.0.6

setenv MPI_ROOT $pkg_root
setenv MPICC    mpicc
setenv MPICXX   mpicxx
setenv MPIFC    mpif90

prepend-path PATH               $pkg_root/bin
prepend-path LD_LIBRARY_PATH    $pkg_root/lib:/opt/gdrcopy/lib
prepend-path LIBRARY_PATH       $pkg_root/lib:/opt/gdrcopy/lib
prepend-path CPATH              $pkg_root/include
prepend-path C_INCLUDE_PATH     $pkg_root/include
prepend-path CPLUS_INCLUDE_PATH $pkg_root/include
prepend-path MANPATH            $pkg_root/share/man
```

次に、以下コマンドをGPUインスタンスのubuntuユーザで実行し、GPU環境利用ユーザをグループ **rdma** に登録します。  
なお、コマンド中のユーザ名は実際のユーザ名に置き換えて実行します。
これは、 **OpenMPI** から起動する **KNEM** を利用するために必要です。

```sh
$ sudo usermod -aG rdma user_name
```

***
# 4. 動作確認

## 4-0. 概要

本章は、ここまでにインストールしたソフトウェアの動作確認を以下の順に実施します。

1. **[CUDA SamplesによるNVIDIA CUDA Toolkit動作確認](#4-1-cuda-samplesによるnvidia-cuda-toolkit動作確認)**  
 **NVIDIA CUDA Toolkit** に含まれるCUDAコンパイラとCUDAライブラリを使用する **CUDA Samples** をコンパイル・実行することで、 **NVIDIA CUDA Toolkit** 含まれるCUDAコンパイラの動作を確認します。

2. **[OpenACCサンプルプログラムによるNVIDIA HPC SDK動作確認](#4-2-openaccサンプルプログラムによるnvidia-hpc-sdk動作確認)**  
OpenACCのディレクティブを含むCプログラムをコンパイル・実行することで、 **NVIDIA HPC SDK** に含まれるOpneACC対応Cコンパイラの動作を確認します。

3. **[OpenACC/MPIハイブリッドプログラムによるCUDA-aware OpenMPI動作確認](#4-3-openaccmpiハイブリッドプログラムによるcuda-aware-openmpi動作確認)**  
OpenACCのディレクティブを含むMPI Cプログラムをコンパイル・実行することで、CUDA-aware **OpenMPI** の動作を確認します。

4. **[NCCL TestsによるNVIDIA Fabric Manager動作確認](#4-4-nccl-testsによるnvidia-fabric-manager動作確認)**  
**NCCL Tests** で8枚のGPUを使用する **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** の **All-Reduce** 通信性能を計測し、十分な性能が出ていることをもって **NVIDIA Fabric Manager** の動作を確認します。

## 4-1. CUDA SamplesによるNVIDIA CUDA Toolkit動作確認

以下コマンドをGPUインスタンスのGPU環境利用ユーザで実行し、 **CUDA Samples** をコンパイルします。  
なお、makeコマンドの並列数はGPUインスタンスのコア数に合わせて調整します。

```sh
$ mkdir ~/`hostname` && cd ~/`hostname` && wget https://github.com/NVIDIA/cuda-samples/archive/refs/tags/v12.9.zip
$ unzip v12.9.zip
$ module purge
$ export PATH=/usr/local/cuda-12.9/bin:${PATH}
$ cd cuda-samples-12.9 && mkdir build && cd build && cmake .. && make -j 128
```

次に、以下コマンドをGPUインスタンスのGPU環境利用ユーザで実行し、 **CUDA Samples** が正しく動作することを確認します。  
この時、出力に搭載する全てのGPUの情報が含まれ、最後に出力される **Result =** 行が **PASS** となっていることで、 **NVIDIA CUDA Toolkit** の動作を確認します。

```sh
$ ./Samples/1_Utilities/deviceQuery/deviceQuery
:
:
deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 12.9, CUDA Runtime Version = 12.9, NumDevs = 8
Result = PASS
$
```

## 4-2. OpenACCサンプルプログラムによるNVIDIA HPC SDK動作確認

以下のOpenACCサンプルプログラムをファイル名 **test.c** として作成します。

```sh
$ cat ~/`hostname`/test.c
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

次に、以下コマンドをGPUインスタンスのGPU環境利用ユーザで実行し、このサンプルプログラムをコンパイル・実行することで、 **NVIDIA HPC SDK** の動作を確認します。  

```sh
$ cd ~/`hostname`
$ module purge
$ module load nvhpc
$ nvc -acc -gpu=cc70 test.c -o gpu.exe
$ ./gpu.exe & sleep 3; nvidia-smi | tail -3
[1] 18096
Success!
|=========================================================================================|
|    0   N/A  N/A           18096      C   ./gpu.exe                              4234MiB |
+-----------------------------------------------------------------------------------------+
$
```

## 4-3. OpenACC/MPIハイブリッドプログラムによるCUDA-aware OpenMPI動作確認

ここで使用するOpenACC/MPIハイブリッドのサンプルプログラムは、 **[東京大学 情報基盤センター](https://www.itc.u-tokyo.ac.jp/)** 様がGitHubの以下レポジトリから公開している、並列プログラミング講習会向けのものを利用させて頂くこととします。

**[https://github.com/hoshino-UTokyo/lecture_openacc_mpi](https://github.com/hoshino-UTokyo/lecture_openacc_mpi)**

以下コマンドをGPUインスタンスのGPU環境利用ユーザで実行し、サンプルプログラムのソースツリーをクローンします。

```sh
$ cd ~/`hostname` && git clone https://github.com/hoshino-UTokyo/lecture_openacc_mpi.git
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

次に、以下コマンドをGPUインスタンスのGPU環境利用ユーザで実行し、このサンプルプログラムをコンパイル・実行することで、CUDA-aware **OpenMPI** の動作を確認します。  

```sh
$ cd ~/`hostname`/lecture_openacc_mpi/C/openacc_mpi_basic/04_cuda_aware
$ module purge
$ module load nvhpc openmpi
$ make
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
$ mpirun -n 2 ./run
num of GPUs = 8
Rank 1: hostname = inst-6lpdh-ao-ub24, GPU num = 1
Rank 0: hostname = inst-6lpdh-ao-ub24, GPU num = 0
mean = 30.00
Time =    0.023 [sec]
$
```

## 4-4. NCCL TestsによるNVIDIA Fabric Manager動作確認

**[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[NCCL Tests実行方法（BM.GPU4.8/BM.GPU.A100-v2.8 Ubuntu編）](/ocitutorials/hpc/benchmark/run-nccltests-ubuntu/)** の **[2. NCCL Testsコンパイル](/ocitutorials/hpc/benchmark/run-nccltests-ubuntu/#2-nccl-testsコンパイル)** と **[3. NCCL Tests実行](/ocitutorials/hpc/benchmark/run-nccltests-ubuntu/#3-nccl-tests実行)** の手順に従い、1ノード8GPUの **NCCL**  **All-Reduce** 通信性能を **NCCL Tests** で計測し、 **NVSwitch** に期待される性能の **230 GB/s** （10 GiBメッセージサイズ）前後の帯域（busbw）性能が出ることをもって、 **NVIDIA Fabric Manager** の動作を確認します。