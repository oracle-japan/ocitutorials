---
title: "Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法"
excerpt: "HPCワークロードは、複数の計算ノードをクラスタ・ネットワークでノード間接続するHPCクラスタで実行することが主流ですが、BM.Standard.E5.192のような高性能のベアメタル・シェイプは、7 TFLOPSを超える理論性能と2.3 TBのDDR5メモリを有し、単一ノードでも十分大規模なHPCワークロードを実行することが可能です。このように単一ノードでHPCワークロードを実行する場合は、ベースOSのOracle Linuxのバージョンに制約のあるクラスタネットワーキングイメージを使用する必要が無く、プラットフォーム・イメージから最新のOracle Linuxを選択することが可能になります。本テクニカルTipsは、単一ノードでHPCワークロードを実行することを念頭に、プラットフォーム・イメージから提供される最新のOracle Linux上にOpenMPIとSlurmをインストールしてHPC環境を構築する方法を解説します。"
order: "356"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

複数の計算ノードを  **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** でノード間接続するHPCクラスタは、その計算ノードに **クラスタ・ネットワーク** 接続用のドライバーソフトウェアやユーティリティーソフトウェアがインストールされている必要があるため、これらが事前にインストールされている **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を使用することが一般的です（※1）が、このベースとなるOSの **Oracle Linux** のバージョンは、 **プラットフォーム・イメージ** として提供される **Oracle Linux** の最新バージョンより古くなります。（※2）

※1）この詳細は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージを使ったクラスタ・ネットワーク接続方法](/ocitutorials/hpc/tech-knowhow/howto-connect-clusternetwork/)** を参照してください。  
※2）2025年3月時点の最新の **クラスタネットワーキングイメージ** がそのベースOSに **Oracle Linux** 8.10を使用しているのに対し、 **プラットフォーム・イメージ** の最新は **Oracle Linux 9.5** です。

ここで実行するワークロードが単一ノードに収まる場合は、 **クラスタ・ネットワーク** に接続する必要がなくなり、 **プラットフォーム・イメージ** から提供される最新のOSを使用することが可能になりますが、現在利用可能な単一ノードで最も高性能なシェイプ（2025年3月時点）は、以下のスペックを持つ **[BM.Standard.E5.192](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** で、このスペックからも単一ノードで十分大規模なHPCワークロードを実行することが可能と考えられます。

- CPU： **AMD EPYC** 9654ベース x 2（192コア）
- メモリ： DDR5 2.3 TB
- 理論性能： 7.3728 TFLOPS（ベース動作周波数2.4 GHz時）
- メモリ帯域： 921.6 GB/s

以上を踏まえて本テクニカルTipsは、単一ノードでHPCワークロードを実行することを念頭に、 **プラットフォーム・イメージ** で提供される最新の **Oracle Linux**上に **[AMD Optimizing C/C++ and Fortran Compilers](https://www.amd.com/en/developer/aocc.html)** （以降 **AOCC** と呼称します。）、 **[OpenMPI](https://www.open-mpi.org/)** 、及び **[Slurm](https://slurm.schedmd.com/)** をインストールし、 **BM.Standard.E5.192** のような高価なリソースをバッチジョブで有効利用するためのHPCワークロード実行環境を構築する手順を解説します。

なお本テクニカルTipsは、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** の手順に従い予め **Slurm** 環境が構築されていることを前提に、単一ノードのHPCワークロードを実行するインスタンス（以降"計算ノード"と呼称します。）をこの **Slurm** 環境に組み込みます。

本テクニカルTipsは、以下のソフトウェアバージョンを前提とします。

- 計算ノードOS： **プラットフォーム・イメージ** **[Oracle-Linux-9.5-2025.02.28-0](https://docs.oracle.com/en-us/iaas/images/oracle-linux-9x/oracle-linux-9-5-2025-02-28-0.htm)**
- コンパイラ： **AOCC** 5.0
- MPI： **OpenMPI** 5.0.6
- ジョブスケジューラ： **Slurm** 24.11.0

***
# 1. 環境構築

## 1-0. 概要

本章は、計算ノードの環境を以下の手順に沿って構築します。

1. インスタンス作成
2. **AOCC** インストール
3. **OpenMPI** 前提ソフトウェア・rpmパッケージインストール
4. **[OpenPMIx](https://openpmix.github.io/)** インストール（※3）
5. **[OpenUCX](https://openucx.readthedocs.io/en/master/index.html#)** インストール（※4）
6. **OpenMPI** インストール・セットアップ
7. **[Intel MPI Benchmarks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** インストール（※5）
8. **[munge](https://dun.github.io/munge/)** インストール・セットアップ（※6）
9. **Slurm** rpmパッケージ作成
10. **Slurm** rpmパッケージインストール・セットアップ
11. **Slurm** 設定ファイル修正
12. **Slurm** サービス起動
13. **Slurm** 利用に必要な環境変数設定

※3） **Slurm** がMPIアプリケーションを起動する際に使用します。  
※4） **OpenMPI** がプロセス間通信に使用する通信フレームワークとして使用します。  
※5）計算ノードのMPI通信性能の検証と構築した環境の稼働確認に使用します。  
※6） **Slurm** のプロセス間通信の認証に使用します。

## 1-1. インスタンス作成

OCIチュートリアル **[インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** の手順に従い、以下属性の計算ノードを作成します。

- イメージ： **Oracle Linux** 9.5（Oracle-Linux-9.5-2025.02.28-0）
- シェイプ： **BM.Standard.E5.192**

## 1-2. AOCCインストール

以下のサイトから **AOCC** のtarアーカイブ **aocc-compiler-5.0.0.tar** をダウンロードし、これを計算ノードの **/tmp** ディレクトリにコピーします。

**[https://www.amd.com/en/developer/aocc.html#downloads](https://www.amd.com/en/developer/aocc.html#downloads)**

次に、以下コマンドを計算ノードのopcユーザで実行し、 **AOCC** を **/opt/aocc** にインストールします。

```sh
$ sudo mkdir /opt/aocc
$ cd /opt/aocc && sudo tar --no-same-owner -xvf /tmp/aocc-compiler-5.0.0.tar
$ cd aocc-compiler-5.0.0 && sudo ./install.sh
```

## 1-3. OpenMPI前提ソフトウェア・rpmパッケージインストール

以下コマンドを計算ノードのopcユーザで実行し、OpenMPIの前提rpmパッケージのインストールと前提ソフトウェアである **libevent** ・ **hwloc** ・ **XPMEM** ・ **KNEM** の **/opt** ディレクトリへのインストールを実施します。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ sudo dnf install -y ncurses-devel openssl-devel gcc-c++ gcc-gfortran git automake autoconf libtool
$ cd ~ && wget https://github.com/libevent/libevent/releases/download/release-2.1.12-stable/libevent-2.1.12-stable.tar.gz
$ tar -xvf ./libevent-2.1.12-stable.tar.gz
$ cd libevent-2.1.12-stable && ./configure --prefix=/opt/libevent
$ make -j 192 && sudo make install
$ cd ~ && wget https://download.open-mpi.org/release/hwloc/v2.11/hwloc-2.11.2.tar.gz
$ tar -xvf ./hwloc-2.11.2.tar.gz
$ cd hwloc-2.11.2 && ./configure --prefix=/opt/hwloc
$ make -j 192 && sudo make install
$ cd ~ && git clone https://github.com/hpc/xpmem.git
$ cd xpmem && ./autogen.sh && ./configure --prefix=/opt/xpmem
$ make -j 192 && sudo make install
$ cd ~ && git clone https://gitlab.inria.fr/knem/knem.git
$ cd knem && ./autogen.sh && ./configure --prefix=/opt/knem
$ make -j 192 && sudo make install
```

## 1-4. OpenPMIxインストール

以下コマンドを計算ノードのopcユーザで実行し、 **OpenPMIx** を **/opt** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ cd ~ && wget https://github.com/openpmix/openpmix/releases/download/v5.0.4/pmix-5.0.4.tar.gz
$ tar -xvf ./pmix-5.0.4.tar.gz
$ cd pmix-5.0.4 && ./configure --prefix=/opt/pmix --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc
$ make -j 192 && sudo make install
```

## 1-5. OpenUCXインストール

以下コマンドを計算ノードのopcユーザで実行し、 **OpenUCX** を **/opt** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ cd ~ && wget https://github.com/openucx/ucx/releases/download/v1.17.0/ucx-1.17.0.tar.gz
$ tar -xvf ./ucx-1.17.0.tar.gz
$ cd ucx-1.17.0 && ./contrib/configure-release --prefix=/opt/ucx --with-knem=/opt/knem --with-xpmem=/opt/xpmem
$ make -j 192 && sudo make install
```

ここでは、 **KNEM** と **XPMEM** を **OpenUCX** から利用出来るようにビルドしています。

## 1-6. OpenMPIインストール・セットアップ

以下コマンドを計算ノードのopcユーザで実行し、 **OpenMPI** を **/opt** ディレクトリにインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ cd ~ && wget https://download.open-mpi.org/release/open-mpi/v5.0/openmpi-5.0.6.tar.gz
$ tar -xvf ./openmpi-5.0.6.tar.gz
$ cd openmpi-5.0.6 && ./configure --prefix=/opt/openmpi --with-libevent=/opt/libevent --with-hwloc=/opt/hwloc --with-pmix=/opt/pmix --with-ucx=/opt/ucx --with-slurm
$ make -j 192 all && sudo make install
```

ここでは、先にインストールした **OpenUCX** を **OpenMPI** から利用出来るよう、また **Slurm** から **OpenPMIx** を使用して **OpenMPI** のアプリケーションを実行できるようにビルドしています。

次に、以下コマンドを **OpenMPI** を利用するユーザで実行し、MPIプログラムのコンパイル・実行に必要な環境変数を設定します。

```sh
$ echo "export PATH=/opt/openmpi/bin:/opt/ucx/bin:\$PATH" | tee -a ~/.bashrc
$ source ~/.bashrc
```

## 1-7. Intel MPI Benchmarksインストール

以下コマンドを計算ノードのopcユーザで実行し、 **Intel MPI Benchmarks** をインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ cd ~ && wget https://github.com/intel/mpi-benchmarks/archive/refs/tags/IMB-v2021.7.tar.gz
$ tar -xvf ./IMB-v2021.7.tar.gz
$ export CXX=/opt/openmpi/bin/mpicxx
$ export CC=/opt/openmpi/bin/mpicc
$ cd mpi-benchmarks-IMB-v2021.7 && make -j 192 all
$ sudo mkdir -p /opt/openmpi/tests/imb
$ sudo cp ./IMB* /opt/openmpi/tests/imb/
```

## 1-8. munge インストール・セットアップ

以下コマンドを計算ノードのopcユーザで実行し、 **munge** プロセス起動ユーザを作成します。

```
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

## 1-9. Slurm rpmパッケージ作成

以下コマンドを計算ノードのopcユーザで実行し、 **Slurm** の前提rpmパッケージをインストールします。

```
$ sudo dnf install -y rpm-build pam-devel perl readline-devel mariadb-devel dbus-glib-devel
```

次に、以下コマンドをSlurmマネージャのopcユーザで実行し、 **Slurm** rpmパッケージを作成します。

```
$ cd ~ && wget https://download.schedmd.com/slurm/slurm-24.11.0.tar.bz2
$ rpmbuild --define '_prefix /opt/slurm' --define '_slurm_sysconfdir /opt/slurm/etc' --define '_with_pmix --with-pmix=/opt/pmix' --define '_with_ucx --with-ucx=/opt/ucx' -ta ./slurm-24.11.0.tar.bz2
```

作成されたパッケージは、以下のディレクトリに配置されます。

```
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

## 1-10. Slurm rpmパッケージインストール・セットアップ

以下コマンドを計算ノードのopcユーザで実行し、 **Slurm** rpmパッケージのインストール・セットアップを行います。

```
$ cd ~/rpmbuild/RPMS/x86_64/ && sudo rpm -ivh ./slurm-24.11.0-1.el9.x86_64.rpm ./slurm-slurmd-24.11.0-1.el9.x86_64.rpm ./slurm-perlapi-24.11.0-1.el9.x86_64.rpm
$ sudo useradd -m -d /var/lib/slurm -s /bin/bash -u 5000 slurm
$ sudo mkdir /var/spool/slurmd; sudo chown slurm:slurm /var/spool/slurmd
$ sudo mkdir /var/log/slurm; sudo chown slurm:slurm /var/log/slurm
$ sudo mkdir /opt/slurm/etc; sudo chown slurm:slurm /opt/slurm/etc
```

## 1-11. Slurm設定ファイル修正

既存の **Slurm** 環境の **slurm.conf** に対して、計算ノードを追加するために以下のように修正します。

```sh
NodeName=inst-e5 CPUs=192 Boards=1 SocketsPerBoard=8 CoresPerSocket=24 ThreadsPerCore=1 RealMemory=2300000 TmpDisk=10000 State=UNKNOWN
PartitionName=e5 Nodes=inst-e5 Default=YES MaxTime=INFINITE State=UP
```

ここでは、 **NPS** が **4** で**SMT** を無効（※7）としたホスト名が **inst-e5** の **BM.Standard.E5.192** 1ノードを、パーティション名 **e5** に割り当てています。

※7） **NPS** と **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。  

次に、この **slurm.conf** を計算ノードの **/opt/slurm/etc** に配置します。

## 1-12. Slurmサービス起動

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
sltest*      up   infinite      3   idle inst-aaaaa-x9,inst-bbbbb-x9,inst-e5
e5           up   infinite      1   idle inst-e5
$
```

***
# 2. 稼働確認

## 2-0. 概要

本章は、インストールした **AOCC** 、 **OpenMPI** 、及び **Slurm** を稼働確認します。  
なお **OpenMPI** と **Slurm** の稼働確認は、 **Slurm** に **OpenMPI** を利用する **Intel MPI Benchmarks** のMPI通信性能検証用ジョブを投入することで行います。

## 2-1. AOCC稼働確認

以下コマンドを計算ノードの **AOCC** を利用するユーザで実行し、メモリ性能を計測するベンチマークプログラムの **[STREAM](https://www.cs.virginia.edu/stream/)** をコンパイル・実行することで、 **AOCC** の稼働確認を行います。  
なおこの **STREAM** の実行は、 **BM.Standard.E5.192** を想定した設定になっています。

```sh
$ mkdir ~/stream
$ cd ~/stream && wget http://www.cs.virginia.edu/stream/FTP/Code/stream.c
$ source /opt/aocc/setenv_AOCC.sh
$ clang -DSTREAM_TYPE=double -DSTREAM_ARRAY_SIZE=430080000 -O3 -mcmodel=large -fopenmp -fnt-store ./stream.c
$ OMP_NUM_THREADS=96 KMP_AFFINITY="explicit,proclist=[`seq -s, 0 2 191`]" ./a.out
```

**BM.Standard.E5.192** 上で実行する **STREAM** については、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[STREAM実行方法（BM.Standard.E5.192編）](/ocitutorials/hpc/benchmark/run-stream-e5/)** も合わせて参照してください。

## 2-1. OpenMPI・Slurm稼働確認

**Slurm** クライアントの **OpenMPI** と **Slurm** を利用するユーザで、以下のスクリプトをファイル名 **imb_ata.sh** で作成します。  
なおこの **Intel MPI Benchmarks** の実行は、 **BM.Standard.E5.192** を想定した設定になっています。


```sh
#!/bin/bash
#SBATCH -p e5
#SBATCH -n 192
#SBATCH -N 1
#SBATCH -J alltoall
#SBATCH -o alltoall.%J
#SBATCH -e stderr.%J
srun IMB-MPI1 -msglog 0:23 -mem 4G -off_cache 384,64 -npmin $SLURM_NTASKS alltoall
```

このジョブスクリプトは、192プロセスを使用するノード内並列のAlltoall所要時間をメッセージサイズ0Bから32 MiBまでで計測しています。  
**BM.Standard.E5.192** 上で実行する **Intel MPI Benchmarks** のMPI集合通信性能については、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI集合通信チューニング方法（BM.Standard.E5.192編）](/ocitutorials/hpc/benchmark/openmpi-perftune-e5/)** も合わせて参照してください。

次に、以下コマンドをSlurmクライアントの **OpenMPI** と **Slurm** を利用するユーザで実行し、バッチジョブの投入とその結果確認を行います。

```sh
$ sbatch imb_ata.sh 
Submitted batch job 23808
$ cat ./alltoall.23808
#----------------------------------------------------------------
#    Intel(R) MPI Benchmarks 2021.7, MPI-1 part
#----------------------------------------------------------------
# Date                  : Wed Mar 12 23:40:30 2025
# Machine               : x86_64
# System                : Linux
# Release               : 5.15.0-305.176.4.el9uek.x86_64
# Version               : #2 SMP Tue Jan 28 20:15:04 PST 2025
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# /opt/openmpi/tests/imb/IMB-MPI1 -msglog 0:23 -mem 4G -off_cache 384,64 -npmin 192 alltoall 

# Minimum message length in bytes:   0
# Maximum message length in bytes:   8388608
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
# #processes = 192 
#----------------------------------------------------------------
       #bytes #repetitions  t_min[usec]  t_max[usec]  t_avg[usec]
            0         1000         0.04         0.09         0.05
            1         1000        14.94        15.95        15.48
            2         1000        15.17        16.37        15.70
            4         1000        17.09        19.61        18.21
            8         1000        20.74        23.41        21.84
           16         1000        28.71        32.03        30.04
           32         1000        37.98        42.64        40.24
           64         1000        72.73        80.65        76.27
          128         1000       108.05       124.39       116.52
          256         1000       202.50       236.85       220.65
          512         1000       387.72       434.45       410.11
         1024         1000       368.04       416.56       394.76
         2048         1000      1211.46      1447.02      1397.23
         4096         1000      1240.52      2854.89      1845.46
         8192         1000      1665.85      1856.75      1791.55
        16384         1000      3050.95      3240.93      3145.84
        32768         1000      5523.64      5920.35      5767.86
        65536          640     10935.51     12686.47     12025.69
       131072          320     20632.47     22223.99     21683.88
       262144          160     45287.95     45514.84     45430.74
       524288           80    101029.68    101507.84    101329.73
      1048576           40    178558.11    179596.61    179215.53
      2097152           20    386123.34    391777.75    388960.96
      4194304           10    708980.56    714099.31    712053.41
      8388608            5   1419275.74   1430883.33   1426296.45


# All processes entering MPI_Finalize

$
```