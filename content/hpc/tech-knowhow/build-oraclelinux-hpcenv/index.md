---
title: "Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法"
description: "HPCワークロードは、複数の計算ノードをクラスタ・ネットワークでノード間接続するHPCクラスタで実行することが主流ですが、BM.Standard.E6.256のような高性能のベアメタル・シェイプは、11 TFLOPSを超える理論性能と3 TBのDDR5メモリを有し、単一ノードでも十分大規模なHPCワークロードを実行することが可能です。このように単一ノードでHPCワークロードを実行する場合は、ベースOSのOracle Linuxのバージョンに制約のあるクラスタネットワーキングイメージを使用する必要が無く、プラットフォーム・イメージから最新のOracle Linuxを選択することが可能になります。本テクニカルTipsは、単一ノードでHPCワークロードを実行することを念頭に、プラットフォーム・イメージから提供される最新のOracle Linux上にOpenMPIとSlurmをインストールしてHPC環境を構築する方法を解説します。"
weight: "356"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

***
# 0. 概要

複数の計算ノードを  **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** でノード間接続するHPCクラスタは、その計算ノードに **クラスタ・ネットワーク** 接続用のドライバーソフトウェアやユーティリティーソフトウェアがインストールされている必要があるため、これらが事前にインストールされている **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** を使用することが一般的です（※1）が、このベースとなるOSの **Oracle Linux** のバージョンは、 **[プラットフォーム・イメージ](../../#5-17-プラットフォームイメージ)** として提供される **Oracle Linux** の最新バージョンより古くなります。（※2）

※1）この詳細は、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージを使ったクラスタ・ネットワーク接続方法](../../tech-knowhow/howto-connect-clusternetwork/)** を参照してください。  
※2）2025年3月時点の最新の **クラスタネットワーキングイメージ** がそのベースOSに **Oracle Linux** 8.10を使用しているのに対し、 **プラットフォーム・イメージ** の最新は **Oracle Linux** 9.5です。

ここで実行するワークロードが単一ノードに収まる場合は、 **クラスタ・ネットワーク** に接続する必要がなくなり、 **プラットフォーム・イメージ** から提供される最新のOSを使用することが可能になりますが、現在利用可能な単一ノードで最も高性能なシェイプ（2025年5月時点）は、以下のスペックを持つ **[BM.Standard.E6.256](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** で、このスペックからも単一ノードで十分大規模なHPCワークロードを実行することが可能と考えられます。

- CPU： **AMD EPYC** 9755ベース x 2（256コア）
- メモリ： DDR5 3.072 TB
- 理論性能： 11.0592 TFLOPS（ベース動作周波数2.7 GHz時）
- メモリ帯域： 1,228.8 GB/s

以上を踏まえて本テクニカルTipsは、単一ノードでHPCワークロードを実行することを念頭に、 **プラットフォーム・イメージ** で提供される最新の **Oracle Linux** 上に **[AMD Optimizing C/C++ and Fortran Compilers](https://www.amd.com/en/developer/aocc.html)** （以降 **AOCC** と呼称します。）、 **[OpenMPI](https://www.open-mpi.org/)** 、及び **[Slurm](https://slurm.schedmd.com/)** をインストールし、 **BM.Standard.E6.256** のような高価なリソースをバッチジョブで有効利用するためのHPCワークロード実行環境を構築する手順を解説します。

なお本テクニカルTipsは、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](../../tech-knowhow/setup-slurm-cluster/)** の手順に従い予め **Slurm** 環境が構築されていることを前提に、単一ノードのHPCワークロードを実行するインスタンス（以降"計算ノード"と呼称します。）をこの **Slurm** 環境に組み込みます。

本テクニカルTipsは、以下のソフトウェアバージョンを前提とします。

- 計算ノードOS： **プラットフォーム・イメージ** **[Oracle-Linux-9.5-2025.04.16-0](https://docs.oracle.com/en-us/iaas/images/oracle-linux-9x/oracle-linux-9-5-2025-04-16-0.htm)**
- コンパイラ： **AOCC** 5.0
- MPI： **OpenMPI** 5.0.6
- ジョブスケジューラ： **Slurm** 24.11.0

***
# 1. 環境構築

## 1-0. 概要

本章は、計算ノードの環境を以下の手順に沿って構築します。

1. インスタンス作成
2. **AOCC** インストール
3. **OpenMPI** 前提ソフトウェア・RPMパッケージインストール
4. **OpenMPI** インストール・セットアップ
5. **[Intel MPI Benchmarks](https://github.com/intel/mpi-benchmarks)** インストール（※3）
6. **[munge](https://dun.github.io/munge/)** インストール・セットアップ（※4）
7. **Slurm** RPMパッケージ作成
8. **Slurm** RPMパッケージインストール・セットアップ
9. **Slurm** 設定ファイル修正
10. **Slurm** サービス起動

※3）計算ノードのMPI通信性能の検証と構築した環境の稼働確認に使用します。  
※4） **Slurm** のプロセス間通信の認証に使用します。

## 1-1. インスタンス作成

計算ノード用のインスタンスの作成は、 **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の **[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** の手順に従い実施します。  
本テクニカルTipsでは、以下属性のインスタンスを使用します。

- イメージ： **[プラットフォーム・イメージ](../../#5-17-プラットフォームイメージ)** **Oracle-Linux-9.5-2025.04.16-0**
- シェイプ： **BM.Standard.E6.256**

## 1-2. AOCCインストール

以下のサイトから **AOCC** のtarアーカイブ **aocc-compiler-5.0.0.tar** をダウンロードし、これを計算ノードの **/tmp** ディレクトリにコピーします。

**[https://www.amd.com/en/developer/aocc.html#downloads](https://www.amd.com/en/developer/aocc.html#downloads)**

次に、以下コマンドを計算ノードのopcユーザで実行し、 **AOCC** を **/opt/aocc** にインストールします。

```sh
$ sudo mkdir /opt/aocc
$ cd /opt/aocc && sudo tar --no-same-owner -xvf /tmp/aocc-compiler-5.0.0.tar
$ cd aocc-compiler-5.0.0 && sudo ./install.sh
```

## 1-3. OpenMPI前提ソフトウェア・RPMパッケージインストール

### 1-3-0. 概要

本章は、 **OpenMPI** の前提となるRPMパッケージ・ソフトウェアをインストールします。

### 1-3-1. 前提RPMパッケージインストール

以下コマンドを計算ノードのopcユーザで実行し、前提RPMパッケージをインストールします。

```sh
$ sudo dnf install -y ncurses-devel openssl-devel gcc-c++ gcc-gfortran git automake autoconf libtool numactl
```

### 1-3-2. libeventインストール

以下コマンドを計算ノードのopcユーザで実行し、 **[libevent](https://libevent.org/)** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ mkdir ~/`hostname` && cd ~/`hostname` && wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
$ tar -xvf ./libevent-2.1.12-stable.tar.gz
$ cd libevent-2.1.12-stable && ./configure --prefix=/opt/libevent
$ make -j 256 && sudo make install
```

### 1-3-3. hwlocインストール

以下コマンドを計算ノードのopcユーザで実行し、 **[hwloc](https://github.com/open-mpi/hwloc)** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd .. && wget https://download.open-mpi.org/release/hwloc/v2.11/hwloc-2.11.2.tar.gz
$ tar -xvf ./hwloc-2.11.2.tar.gz
$ cd hwloc-2.11.2 && ./configure --prefix=/opt/hwloc
$ make -j 256 && sudo make install
```

### 1-3-4. OpenPMIxインストール

以下コマンドを計算ノードのopcユーザで実行し、 **[OpenPMIx](https://openpmix.github.io/)** （※5）を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

※5） **Slurm** がMPIアプリケーションを起動する際に使用します。

```sh
$ cd .. && wget https://github.com/openpmix/openpmix/releases/download/v5.0.4/pmix-5.0.4.tar.gz
$ tar -xvf ./pmix-5.0.4.tar.gz
$ cd pmix-5.0.4 && ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
$ make -j 256 && sudo make install
```

### 1-3-5. XPMEM・KNEMインストール

以下コマンドを計算ノードのopcユーザで実行し、 **[XPMEM](https://github.com/hpc/xpmem)** （※6）と **[KNEM](https://knem.gitlabpages.inria.fr/)** （※6）を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

※6） **OpenMPI** がノード内MPI通信の際のメモリコピーに使用することが出来る、シングルコピーメカニズムです。

```sh
$ cd .. && git clone https://github.com/hpc/xpmem.git
$ cd xpmem && ./autogen.sh && ./configure --prefix=/opt/xpmem
$ make -j 256 && sudo make install
$ sudo install -D -m 644 ./kernel/xpmem.ko /lib/modules/`uname -r`/extra/xpmem/xpmem.ko
$ echo "xpmem" | sudo tee /lib/modules-load.d/xpmem.conf
$ cd .. && git clone https://gitlab.inria.fr/knem/knem.git
$ cd knem && ./autogen.sh && ./configure --prefix=/opt/knem
$ make -j 256 && sudo make install
$ sudo cp -p /opt/knem/etc/10-knem.rules /opt/knem/etc/10-knem.rules_org
$ grep "^#KERNEL" /opt/knem/etc/10-knem.rules_org | sed 's/^#KERNEL/KERNEL/g' | sudo tee /opt/knem/etc/10-knem.rules
$ echo "knem" | sudo tee /lib/modules-load.d/knem.conf
$ sudo /opt/knem/sbin/knem_local_install
$ sudo systemctl restart systemd-modules-load.service
```

次に、以下コマンドを計算ノードのopcユーザで実行し、 **XPMEM** と **KNEM** がカーネルモジュールとして組み込まれていることを確認します。

```sh
$ lsmod | grep -i -e xpmem -e knem
xpmem                  57344  0
knem                   65536  0
$
```

### 1-3-6. OpenUCXインストール

以下コマンドを計算ノードのopcユーザで実行し、  **[OpenUCX](https://openucx.readthedocs.io/en/master/index.html#)**  を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd .. && wget https://github.com/openucx/ucx/releases/download/v1.17.0/ucx-1.17.0.tar.gz
$ tar -xvf ./ucx-1.17.0.tar.gz
$ cd ucx-1.17.0 && ./contrib/configure-release --prefix=/opt/ucx
$ make -j 256 && sudo make install
```

### 1-3-7. Unified Collective Communicationインストール

以下コマンドを計算ノードのopcユーザで実行し、 **[Unified Collective Communication (UCC)](https://github.com/openucx/ucc)** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd .. && wget https://github.com/openucx/ucc/archive/refs/tags/v1.3.0.tar.gz
$ tar -xvf ./v1.3.0.tar.gz
$ cd ./ucc-1.3.0/ && ./autogen.sh && ./configure --prefix=/opt/ucc --with-ucx=/opt/ucx
$ make -j 256 && sudo make install
```

## 1-4. OpenMPIインストール・セットアップ

以下コマンドを計算ノードのopcユーザで実行し、 **OpenMPI** を **/opt** ディレクトリにインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd .. && wget https://download.open-mpi.org/release/open-mpi/v5.0/openmpi-5.0.6.tar.gz
$ tar -xvf ./openmpi-5.0.6.tar.gz
$ cd openmpi-5.0.6 && ./configure --prefix=/opt/openmpi --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-knem=/opt/knem --with-xpmem=/opt/xpmem --with-ucx=/opt/ucx --with-ucc=/opt/ucc --with-slurm
$ make -j 256 all && sudo make install
```

ここでは、 **KNEM** 、 **XPMEM** 、及び **UCC** を **OpenMPI** から利用出来るよう、また **Slurm** から **OpenPMIx** を利用して **OpenMPI** のアプリケーションを実行できるようにビルドしています。

次に、以下コマンドを計算ノードの **OpenMPI** を利用するユーザで実行し、MPIプログラムのコンパイル・実行に必要な環境変数を設定します。

```sh
$ echo "export PATH=/opt/openmpi/bin:/opt/ucx/bin:\$PATH" | tee -a ~/.bashrc
```

## 1-5. Intel MPI Benchmarksインストール

以下コマンドを計算ノードのopcユーザで実行し、 **Intel MPI Benchmarks** をインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd .. && wget https://github.com/intel/mpi-benchmarks/archive/refs/tags/IMB-v2021.7.tar.gz
$ tar -xvf ./IMB-v2021.7.tar.gz
$ export CC=/opt/openmpi/bin/mpicc; export CXX=/opt/openmpi/bin/mpicxx; cd mpi-benchmarks-IMB-v2021.7 && make -j 256 all
$ sudo mkdir -p /opt/openmpi/tests/imb && sudo cp ./IMB* /opt/openmpi/tests/imb/
```

## 1-6. munge インストール・セットアップ

以下コマンドを計算ノードのopcユーザで実行し、 **munge** プロセス起動ユーザを作成します。

```sh
$ sudo useradd -m -d /var/lib/munge -s /sbin/nologin -u 5001 munge
```

次に、以下コマンドを計算ノードのopcユーザで実行し、 **munge** をインストールします。

```sh
$ sudo yum-config-manager --enable ol9_codeready_builder
$ sudo dnf install -y munge munge-libs munge-devel
```

次に、Slurmマネージャの **munge** キーファイル（**/etc/munge/munge.key**）を同一パス・ファイル名でコピーします。  
この際、ファイルのオーナーとパーミッションがSlurmマネージャのキーファイルと同じとなるよう配慮します。

次に、以下コマンドを計算ノードのopcユーザで実行し、 **munge** サービスを起動します。

```sh
$ sudo systemctl enable --now munge.service
```

次に、以下コマンドを計算ノードのopcユーザで実行し、 **munge** が正常に動作していることを確認します。

```sh
$ munge -n | unmunge | grep STATUS
STATUS:           Success (0)
$
```

## 1-7. Slurm RPMパッケージ作成

以下コマンドを計算ノードのopcユーザで実行し、 **Slurm** の前提RPMパッケージをインストールします。

```sh
$ sudo dnf install -y rpm-build pam-devel perl readline-devel mariadb-devel dbus-glib-devel
```

次に、以下コマンドを計算ノードのopcユーザで実行し、 **Oracle Linux** 9.5用の **Slurm** RPMパッケージを作成します。

```sh
$ cd ~/`hostname` && wget https://download.schedmd.com/slurm/slurm-24.11.0.tar.bz2
$ rpmbuild --define '_prefix /opt/slurm' --define '_slurm_sysconfdir /opt/slurm/etc' --define '_with_pmix --with-pmix=/opt/pmix' -ta ./slurm-24.11.0.tar.bz2
```

作成されたパッケージは、以下のディレクトリに配置されます。

```sh
$ ls -1 ~/rpmbuild/RPMS/x86_64/
slurm-24.11.0-1.el9.x86_64.rpm
slurm-contribs-24.11.0-1.el9.x86_64.rpm
slurm-devel-24.11.0-1.el9.x86_64.rpm
slurm-example-configs-24.11.0-1.el9.x86_64.rpm
slurm-libpmi-24.11.0-1.el9.x86_64.rpm
slurm-openlava-24.11.0-1.el9.x86_64.rpm
slurm-pam_slurm-24.11.0-1.el9.x86_64.rpm
slurm-perlapi-24.11.0-1.el9.x86_64.rpm
slurm-sackd-24.11.0-1.el9.x86_64.rpm
slurm-slurmctld-24.11.0-1.el9.x86_64.rpm
slurm-slurmd-24.11.0-1.el9.x86_64.rpm
slurm-slurmdbd-24.11.0-1.el9.x86_64.rpm
slurm-torque-24.11.0-1.el9.x86_64.rpm
$
```

## 1-8. Slurm RPMパッケージインストール・セットアップ

以下コマンドを計算ノードのopcユーザで実行し、 **Slurm** RPMパッケージのインストール・セットアップを行います。

```sh
$ cd ~/rpmbuild/RPMS/x86_64/ && sudo rpm -ivh ./slurm-24.11.0-1.el9.x86_64.rpm ./slurm-slurmd-24.11.0-1.el9.x86_64.rpm ./slurm-perlapi-24.11.0-1.el9.x86_64.rpm
$ sudo useradd -m -d /var/lib/slurm -s /bin/bash -u 5000 slurm
$ sudo mkdir /var/spool/slurmd && sudo chown slurm:slurm /var/spool/slurmd
$ sudo mkdir /var/log/slurm && sudo chown slurm:slurm /var/log/slurm
$ sudo mkdir /opt/slurm/etc && sudo chown slurm:slurm /opt/slurm/etc
```

## 1-9. Slurm設定ファイル修正

既存の **Slurm** 環境の **slurm.conf** に対して、計算ノードを追加するための以下3行を追加します。

```sh
SlurmdParameters=l3cache_as_socket
NodeName=inst-e6 Sockets=32 CoresPerSocket=8 ThreadsPerCore=1 RealMemory=3000000 TmpDisk=10000 State=UNKNOWN
PartitionName=e6 Nodes=inst-e6 Default=YES MaxTime=INFINITE State=UP
```

ここでは、本テクニカルTipsで使用する **BM.Standard.E6.256** に搭載する2個の第5世代 **AMD EPYC** プロセッサが32個の **Core Complex Die** （以降 **CCD** と呼称します。）毎にL3キャッシュを搭載することを考慮し、 **CCD** を **Slurm** 上 **NUMA** ノードとして扱い **SMT** を無効（※6）としたホスト名が **inst-e6** の **BM.Standard.E6.256** 1ノードを、パーティション名 **e6** に割り当てています。

※6） **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](../../benchmark/bios-setting/)** を参照してください。  

次に、この **slurm.conf** を計算ノード、Slurmマネージャ、及びSlurmクライアントの **/opt/slurm/etc** に配置します。

## 1-10. Slurmサービス起動

以下コマンドを計算ノードのopcユーザで実行し、 **slurmd** を起動します。

```sh
$ sudo systemctl enable --now slurmd
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、計算ノードの追加を反映します。

```sh
$ sudo su - slurm -c "scontrol reconfigure"
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、計算ノードの追加が反映されていることを確認します。

```sh
$ sudo su - slurm -c "sinfo"
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
sltest*      up   infinite      3   idle inst-aaaaa-x9,inst-bbbbb-x9,inst-e6
e6           up   infinite      1   idle inst-e6
$
```

***
# 2. 稼働確認

## 2-0. 概要

本章は、インストールした **AOCC** 、 **OpenMPI** 、及び **Slurm** を稼働確認します。  
なお **OpenMPI** と **Slurm** の稼働確認は、 **Slurm** に **OpenMPI** を利用する **Intel MPI Benchmarks** のMPI通信性能検証用ジョブを投入することで行います。

## 2-1. AOCC稼働確認

以下コマンドを計算ノードの **AOCC** を利用するユーザで実行し、メモリ性能を計測するベンチマークプログラムの **[STREAM](https://www.cs.virginia.edu/stream/)** をコンパイル・実行することで、 **AOCC** の稼働確認を行います。  
なおこの **STREAM** の実行は、 **BM.Standard.E6.256** を想定した設定になっています。

```sh
$ cd ~/`hostname` && mkdir ./stream && cd ./stream && wget http://www.cs.virginia.edu/stream/FTP/Code/stream.c
$ source /opt/aocc/setenv_AOCC.sh
$ clang -DSTREAM_TYPE=double -DSTREAM_ARRAY_SIZE=430080000 -O3 -mcmodel=large -fopenmp -fnt-store ./stream.c
$ OMP_NUM_THREADS=128 KMP_AFFINITY="explicit,proclist=[`seq -s, 0 2 255`]" ./a.out
```

**BM.Standard.E6.256** 上で実行する **STREAM** については、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[STREAM実行方法（BM.Standard.E6.256編）](../../benchmark/run-stream-e6/)** も合わせて参照してください。

## 2-2. OpenMPI・Slurm稼働確認

**Slurm** クライアントの **OpenMPI** と **Slurm** を利用するユーザで、以下のスクリプトをファイル名 **imb_ata.sh** で作成します。  
なおこの **Intel MPI Benchmarks** の実行は、 **BM.Standard.E6.256** を想定した設定になっています。


```sh
#!/bin/bash
#SBATCH -p e6
#SBATCH -n 256
#SBATCH -N 1
#SBATCH -J alltoall
#SBATCH -o alltoall.%J
#SBATCH -e stderr.%J
srun --cpu-bind=map_cpu:`seq -s, 0 255 | tr -d '\n'` /opt/openmpi/tests/imb/IMB-MPI1 -msglog 0:22 -mem 4.1G -off_cache 512,64 -npmin $SLURM_NTASKS alltoall
```

このジョブスクリプトは、256プロセスを使用するノード内並列のAlltoall所要時間をメッセージサイズ0Bから4 MiBまでで計測しています。  
**BM.Standard.E6.256** 上で実行する **Intel MPI Benchmarks** のMPI集合通信性能については、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI集合通信チューニング方法（BM.Standard.E6.256編）](../../benchmark/openmpi-perftune-e6/)** も合わせて参照してください。

次に、以下コマンドをSlurmクライアントの **OpenMPI** と **Slurm** を利用するユーザで実行し、バッチジョブの投入とその結果確認を行います。

```sh
$ sbatch imb_ata.sh 
Submitted batch job 23808
$ cat ./alltoall.23808
#----------------------------------------------------------------
#    Intel(R) MPI Benchmarks 2021.7, MPI-1 part
#----------------------------------------------------------------
# Date                  : Thu May 15 11:01:49 2025
# Machine               : x86_64
# System                : Linux
# Release               : 5.15.0-307.178.5.el9uek.x86_64
# Version               : #2 SMP Wed Mar 19 13:03:40 PDT 2025
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# IMB-MPI1 -msglog 0:22 -mem 4.1G -off_cache 512,64 -npmin 256 alltoall 

# Minimum message length in bytes:   0
# Maximum message length in bytes:   4194304
#
# MPI_Datatype                   :   MPI_BYTE 
# MPI_Datatype for reductions    :   MPI_FLOAT 
# MPI_Op                         :   MPI_SUM  
# 
# 

# List of Benchmarks to run:

# Alltoall

#----------------------------------------------------------------
# Benchmarking Alltoall 
# #processes = 256 
#----------------------------------------------------------------
       #bytes #repetitions  t_min[usec]  t_max[usec]  t_avg[usec]
            0         1000         0.03         0.07         0.04
            1         1000        15.70        17.36        16.51
            2         1000        16.03        18.09        16.94
            4         1000        19.68        25.45        22.19
            8         1000        21.41        28.68        24.55
           16         1000        27.46        36.49        31.73
           32         1000        58.81        69.93        63.79
           64         1000        77.19       101.71        92.30
          128         1000       138.43       186.32       168.70
          256         1000       264.57       376.56       333.16
          512         1000       515.11       727.02       642.06
         1024         1000       681.28       745.76       713.37
         2048         1000      1201.30      1326.77      1263.68
         4096         1000      1368.93      1580.36      1506.19
         8192         1000      2265.81      2435.26      2352.52
        16384         1000      7443.38      8580.72      8378.64
        32768          723     10915.73     10958.66     10934.60
        65536          469     17203.79     17285.94     17245.66
       131072          216     33008.39     33167.20     33078.34
       262144          153     90906.49     97779.62     96820.62
       524288           74    129953.34    130580.67    130270.10
      1048576           37    381725.97    382766.24    382262.62
      2097152           20    518567.46    520676.45    519697.06
      4194304            2   1042525.93   1048633.12   1046537.92


# All processes entering MPI_Finalize

$
```