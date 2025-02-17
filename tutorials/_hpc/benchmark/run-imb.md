---
title: "Intel MPI Benchmarks実行方法"
excerpt: "本ドキュメントは、HPCワークロードの実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでHPCワークロード向けベアメタルインスタンスをノード間接続するHPCクラスタで、標準ベンチマークのIntel MPI Benchmarksを実行する方法を解説します。"
order: "2130"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

本ドキュメントで解説する **[Intel MPI Benchmarks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** の実行は、 **GitHub** から提供される **Intel MPI Benchmarks** を **[OpenMPI](https://www.open-mpi.org/)** で実行する方法と、 **[Intel oneAPI HPC Toolkit](https://www.xlsoft.com/jp/products/intel/oneapi/hpc/index.html)** に含まれる **Intel MPI Benchmarks** と **[Intel MPI Library](https://www.xlsoft.com/jp/products/intel/cluster/mpi/index.html)** を使用する方法を解説します。

**Intel MPI Benchmarks** の実行は、以下3種類を解説します。

1. 1ノード内全コアを使用するAlltoall
2. 2ノード間のPingPong
3. 4ノード間のAllreduce

本ドキュメントで **Intel MPI Benchmarks** を実行するHPCクラスタは、HPCワークロード向けベアメタルシェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** 4インスタンスを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続した構成とし、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** のカテゴリ **[HPCクラスタ](/ocitutorials/hpc/#1-1-hpcクラスタ)** のチュートリアルの手順に従う等により、ノード間でMPIが実行できるよう予め構築しておきます。

本ドキュメントは、以下の環境で **Intel MPI Benchmarks** PingPongを実行し、以下の性能が出ています。

[実行環境]
- シェイプ : **BM.Optimized3.36** （搭載コア数36）
- OS ： **Oracle Linux** 8.10ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※1）
- **OpenMPI** ： 5.0.6（※2）
- **Intel MPI Library** ： 2021.3.0
- **Intel MPI Benchmarks** ： 2021.7

※1）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** です。  
※2） **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従って構築された **OpenMPI** です。

[実行結果（ **OpenMPI** ）]
- レイテンシ: 1.66 usec
- 帯域幅（256 MiBメッセージサイズ）: 12,225 MB/s

[実行結果（ **Intel MPI Library** ）]
- レイテンシ: 1.60 usec
- 帯域幅（256 MiBメッセージサイズ）: 12,277 MB/s

***
# 1. OpenMPIでIntel MPI Benchmarksを実行する場合

## 1-0. 概要

本章は、 **OpenMPI** を使用して **Intel MPI Benchmarks** を実行する方法を解説します。  
具体的には、以下の作業を実施します。

1. **OpenMPI** インストール
2. **Intel MPI Benchmarks** インストール
3. **Intel MPI Benchmarks** 実行

## 1-1. OpenMPIインストール  

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従い、  **Intel MPI Benchmarks** を実行する全てのノードに **OpenMPI** をインストールします。

## 1-2. Intel MPI Benchmarksインストール

以下コマンドを **Intel MPI Benchmarks** を実行する全てのノードのopcユーザで実行し、 **Intel MPI Benchmarks** をインストールします。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

```sh
$ cd ~; wget https://github.com/intel/mpi-benchmarks/archive/refs/tags/IMB-v2021.7.tar.gz
$ tar -xvf ./IMB-v2021.7.tar.gz
$ cd mpi-benchmarks-IMB-v2021.7; export CXX=/opt/openmpi-5.0.6/bin/mpicxx; export CC=/opt/openmpi-5.0.6/bin/mpicc; make -j 36 all
$ sudo mkdir -p /opt/openmpi-5.0.6/tests/imb
$ sudo cp ./IMB* /opt/openmpi-5.0.6/tests/imb/
```

## 1-3. Intel MPI Benchmarks実行

## 1-3-0. 概要

本章は、以下3種類の **Intel MPI Benchmarks** 実行方法を解説します。

1. 1ノード内全コアを使用するAlltoall
2. 2ノード間のPingPong
3. 4ノード間のAllreduce

## 1-3-1. 1ノード内全コアを使用するAlltoall

以下コマンドを対象ノードで **Intel MPI Benchmarks** 実行ユーザで実行します。  
ここでは、1ノード36プロセスのAlltoall所要時間をメッセージサイズ32 MiBで計測しています。

```sh
$ mpirun -n 36 /opt/openmpi-5.0.6/tests/imb/IMB-MPI1 -msglog 25:25 -mem 2.3G -off_cache 39,64 -npmin 36 alltoall
#----------------------------------------------------------------
#    Intel(R) MPI Benchmarks 2021.7, MPI-1 part
#----------------------------------------------------------------
# Date                  : Fri Dec 13 16:41:35 2024
# Machine               : x86_64
# System                : Linux
# Release               : 4.18.0-553.8.1.el8_10.x86_64
# Version               : #1 SMP Tue Jul 2 05:18:08 PDT 2024
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# /opt/openmpi-5.0.6/tests/imb/IMB-MPI1 -msglog 25:25 -mem 2.3G -off_cache 39,64 -npmin 36 alltoall 

# Minimum message length in bytes:   0
# Maximum message length in bytes:   33554432
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
# #processes = 36 
#----------------------------------------------------------------
       #bytes #repetitions  t_min[usec]  t_max[usec]  t_avg[usec]
            0         1000         0.03         0.05         0.03
     33554432            1    368774.69    377145.91    373427.99


# All processes entering MPI_Finalize

$
```

## 1-3-2. 2ノード間のPingPong

以下コマンドを **Intel MPI Benchmarks** を実行するユーザで何れか1ノードで実行します。  
ここでは、2ノードを使用したPingPongをメッセージサイズ0バイトと256 MiBで計測し、レイテンシは0バイトメッセージの所要時間（ここでは **1.66 usec** ）、帯域幅は256 MiBメッセージの帯域幅（ **12,225.03 MB/s** ）を以ってその結果とします。

```sh
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /opt/openmpi-5.0.6/tests/imb/IMB-MPI1 -msglog 28:28 pingpong
#----------------------------------------------------------------
#    Intel(R) MPI Benchmarks 2021.7, MPI-1 part
#----------------------------------------------------------------
# Date                  : Thu Jun 20 11:35:05 2024
# Machine               : x86_64
# System                : Linux
# Release               : 4.18.0-513.11.0.1.el8_9.x86_64
# Version               : #1 SMP Thu Jan 11 11:30:45 PST 2024
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# /opt/openmpi-5.0.3/tests/imb/IMB-MPI1 -msglog 28:28 pingpong 

# Minimum message length in bytes:   0
# Maximum message length in bytes:   268435456
#
# MPI_Datatype                   :   MPI_BYTE 
# MPI_Datatype for reductions    :   MPI_FLOAT 
# MPI_Op                         :   MPI_SUM  
# 
# 

# List of Benchmarks to run:

# PingPong

#---------------------------------------------------
# Benchmarking PingPong 
# #processes = 2 
#---------------------------------------------------
       #bytes #repetitions      t[usec]   Mbytes/sec
            0         1000         1.66         0.00
    268435456            1     21957.85     12225.03


# All processes entering MPI_Finalize

$
```

## 1-3-3. 4ノード間のAllreduce

以下コマンドを **Intel MPI Benchmarks** を実行するユーザで何れか1ノードで実行します。  
ここでは、4ノード144プロセス（ノードあたり36プロセス）を使用したAllreduceの所要時間をメッセージサイズ256 MiBで計測しています。

```sh
$ mpirun -n 144 -N 36 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /opt/openmpi-5.0.6/tests/imb/IMB-MPI1 -msglog 28:28 -npmin 144 allreduce
#----------------------------------------------------------------
#    Intel(R) MPI Benchmarks 2021.7, MPI-1 part
#----------------------------------------------------------------
# Date                  : Thu Jun 20 11:40:32 2024
# Machine               : x86_64
# System                : Linux
# Release               : 4.18.0-513.11.0.1.el8_9.x86_64
# Version               : #1 SMP Thu Jan 11 11:30:45 PST 2024
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# /opt/openmpi-5.0.3/tests/imb/IMB-MPI1 -msglog 28:28 -npmin 144 allreduce 

# Minimum message length in bytes:   0
# Maximum message length in bytes:   268435456
#
# MPI_Datatype                   :   MPI_BYTE 
# MPI_Datatype for reductions    :   MPI_FLOAT 
# MPI_Op                         :   MPI_SUM  
# 
# 

# List of Benchmarks to run:

# Allreduce

#----------------------------------------------------------------
# Benchmarking Allreduce 
# #processes = 144 
#----------------------------------------------------------------
       #bytes #repetitions  t_min[usec]  t_max[usec]  t_avg[usec]
            0         1000         0.03         0.04         0.03
    268435456            1    307115.36    326712.51    319229.75


# All processes entering MPI_Finalize

$
```

***
# 2. Intel MPI LibraryでIntel MPI Benchmarksを実行する場合

## 2-0. 概要

本章は、 **Intel MPI Library** を使用して **Intel MPI Benchmarks** を実行する方法を解説します。  
具体的には、以下の作業を実施します。

1. **Intel oneAPI HPC Toolkit** インストール
2. ホストリストファイル作成
3. **Intel MPI Benchmarks** 実行

## 2-1. Intel oneAPI HPC Toolkitインストール

以下コマンドを **Intel MPI Benchmarks** を実行する全てのノードのopcユーザで実行し、 **Intel oneAPI HPC Toolkit** をインストールします。

```sh
$ sudo yum-config-manager --add-repo https://yum.repos.intel.com/oneapi
$ sudo rpm --import https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
$ sudo dnf install -y intel-basekit-2021.3.0 intel-hpckit-2021.3.0
```

## 2-2. ホストリストファイル作成

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[計算/GPUノードのホスト名リスト作成方法](/ocitutorials/hpc/tech-knowhow/compute-host-list/)** の手順に従い、 **Intel MPI Benchmarks** を実行する全てのノードのホスト名を記載したホストリストファイルを **Intel MPI Benchmarks** を実行するユーザのホームディレクトリ直下に **hostlist.txt** として作成します。

## 2-3. Intel MPI Benchmarks実行

以下コマンドを **Intel MPI Benchmarks** を実行するユーザで何れか1ノードで実行します。  
ここでは、2ノードを使用したPingPongをメッセージサイズ0バイトと256 MiBで計測し、レイテンシは0バイトメッセージの所要時間（ここでは1.60 usec）、帯域幅は256 MiBメッセージの帯域幅（12,277.42 MB/s）を以ってその結果とします。

```sh
$ source /opt/intel/oneapi/setvars.sh
 
:: initializing oneAPI environment ...
   -bash: BASH_VERSION = 4.4.20(1)-release
   args: Using "$@" for setvars.sh arguments: 
:: advisor -- latest
:: ccl -- latest
:: clck -- latest
:: compiler -- latest
:: dal -- latest
:: debugger -- latest
:: dev-utilities -- latest
:: dnnl -- latest
:: dpcpp-ct -- latest
:: dpl -- latest
:: inspector -- latest
:: intelpython -- latest
:: ipp -- latest
:: ippcp -- latest
:: itac -- latest
:: mkl -- latest
:: mpi -- latest
:: tbb -- latest
:: vpl -- latest
:: vtune -- latest
:: oneAPI environment initialized ::
 
$ mpirun -n 2 -ppn 1 -hostfile ~/hostlist.txt -genv UCX_NET_DEVICES=mlx5_2:1 IMB-MPI1 -msglog 27:28 pingpong
#----------------------------------------------------------------
#    Intel(R) MPI Benchmarks 2021.2, MPI-1 part
#----------------------------------------------------------------
# Date                  : Thu Jun 20 16:45:47 2024
# Machine               : x86_64
# System                : Linux
# Release               : 4.18.0-513.11.0.1.el8_9.x86_64
# Version               : #1 SMP Thu Jan 11 11:30:45 PST 2024
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# IMB-MPI1 -msglog 27:28 pingpong 

# Minimum message length in bytes:   0
# Maximum message length in bytes:   268435456
#
# MPI_Datatype                   :   MPI_BYTE 
# MPI_Datatype for reductions    :   MPI_FLOAT 
# MPI_Op                         :   MPI_SUM  
# 
# 

# List of Benchmarks to run:

# PingPong

#---------------------------------------------------
# Benchmarking PingPong 
# #processes = 2 
#---------------------------------------------------
       #bytes #repetitions      t[usec]   Mbytes/sec
            0         1000         1.60         0.00
    134217728            1     10935.56     12273.51
    268435456            1     21864.16     12277.42


# All processes entering MPI_Finalize

$
```

次に、以下コマンドを **Intel MPI Benchmarks** を実行するユーザで何れか1ノードで実行します。  
ここでは、4ノード144プロセス（ノードあたり36プロセス）を使用したAllreduceの所要時間をメッセージサイズ256 MiBで計測しています。


```sh
$ mpirun -n 144 -ppn 36 -hostfile ~/hostlist.txt -genv UCX_NET_DEVICES=mlx5_2:1 IMB-MPI1 -msglog 27:28 -npmin 144 allreduce
#----------------------------------------------------------------
#    Intel(R) MPI Benchmarks 2021.2, MPI-1 part
#----------------------------------------------------------------
# Date                  : Thu Jun 20 16:46:03 2024
# Machine               : x86_64
# System                : Linux
# Release               : 4.18.0-513.11.0.1.el8_9.x86_64
# Version               : #1 SMP Thu Jan 11 11:30:45 PST 2024
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# IMB-MPI1 -msglog 27:28 -npmin 144 allreduce 

# Minimum message length in bytes:   0
# Maximum message length in bytes:   268435456
#
# MPI_Datatype                   :   MPI_BYTE 
# MPI_Datatype for reductions    :   MPI_FLOAT 
# MPI_Op                         :   MPI_SUM  
# 
# 

# List of Benchmarks to run:

# Allreduce

#----------------------------------------------------------------
# Benchmarking Allreduce 
# #processes = 144 
#----------------------------------------------------------------
       #bytes #repetitions  t_min[usec]  t_max[usec]  t_avg[usec]
            0         1000         0.03         0.03         0.03
    134217728            1    105362.17    106363.65    105716.44
    268435456            1    205579.37    206503.46    205992.71


# All processes entering MPI_Finalize

$
```