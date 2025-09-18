---
title: "OSU Micro-Benchmarks実行方法（BM.GPU4.8/BM.GPU.A100-v2.8編）"
description: "本ドキュメントは、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでベア・メタル・シェイプBM.GPU4.8/BM.GPU.A100-v2.8をノード間接続するGPUクラスタで、GPUメモリ間のMPI通信性能を計測する標準ベンチマークのOSU Micro-Benchmarksを実行する方法を解説します。"
weight: "2141"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

***
# 0. 概要

本ドキュメントで解説する **[OSU Micro-Benchmarks](https://mvapich.cse.ohio-state.edu/benchmarks/)** の実行は、 **[OpenMPI](https://www.open-mpi.org/)** でこれをコンパイルして作成したバイナリを使用し、以下3種類を解説します。

1. ノード内GPUデバイスメモリ間レイテンシ
2. ノード内GPUデバイスメモリ間帯域幅
3. 2ノードに跨るGPUデバイスメモリ間レイテンシ
4. 2ノードに跨るGPUデバイスメモリ間帯域幅
5. 2ノードに跨る16個のGPUを使用するNCCL Allreduce通信性能

本ドキュメントで **OSU Micro-Benchmarks** を実行するGPUクラスタは、8枚の **NVIDIA A100** GPUを搭載するベア・メタル・シェイプ **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** 2インスタンスを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続した構成とし、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** のカテゴリ **[HPC/GPUクラスタ](/ocitutorials/hpc/#1-1-hpcgpuクラスタ)** のチュートリアルの手順に従う等により、ノード間でMPIが実行できるよう予め構築しておきます。

本ドキュメントは、以下の環境で **OSU Micro-Benchmarks** を実行し、以下の性能が出ています。

[実行環境]
- シェイプ : **BM.GPU4.8**
- OS ： **Oracle Linux** 8.10ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※1）
- **OpenMPI** ： 5.0.8（※2）
- **OSU Micro-Benchmarks** ： 7.5.1

※1）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** です。  
※2） **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[UbuntuをOSとするHPC/機械学習ワークロード向けGPUインスタンス構築方法](/ocitutorials/hpc/tech-knowhow/gpu-with-ubuntu/)** に従って構築された **OpenMPI** です。

[実行結果]
- レイテンシ: 1.67 usec
- 帯域幅（256 MiBメッセージサイズ）: 12,254 MB/s

以降では、 **OSU Micro-Benchmarks** の実行方法を以下の順に解説します。

1. **OpenMPI** インストール
2. **OSU Micro-Benchmarks** インストール
3. **OSU Micro-Benchmarks** 実行

***
# 1. OpenMPIインストール  

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従い、  **OSU Micro-Benchmarks** を実行する全てのノードに **OpenMPI** をインストールします。

***
# 2. OSU Micro-Benchmarksインストール

以下コマンドを **OSU Micro-Benchmarks** を実行する全てのノードのopcユーザで実行し、 **OSU Micro-Benchmarks** をインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ mkdir ~/`hostname` && cd ~/`hostname` && wget https://mvapich.cse.ohio-state.edu/download/mvapich/osu-micro-benchmarks-7.5.1.tar.gz
$ tar -xvf ./osu-micro-benchmarks-7.5.1.tar.gz
$ module purge
$ module load nvhpc openmpi
$ cd osu-micro-benchmarks-7.5.1 && ./configure CC=mpicc CXX=mpicxx --prefix=/opt/openmpi/tests/omb --enable-cuda --with-cuda-include=/usr/local/cuda-12.9/include --with-cuda-libpath=/usr/local/cuda-12.9/lib64 --enable-ncclomb --with-nccl=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/comm_libs/nccl
$ make -j 128 && sudo make install
```

次に、カレントディレクトリに作成されたファイル **libtool** を以下のように修正します。

```sh
$ diff libtool_org libtool
1733a1734
>       export PATH=/opt/openmpi/bin:${PATH}
$
```

***
# 3. OSU Micro-Benchmarks実行

## 3-1. 1ノード内全コアを使用するAlltoall

以下コマンドを対象ノードで **OSU Micro-Benchmarks** 実行ユーザで実行します。  
ここでは、1ノード36プロセスのAlltoall所要時間をメッセージサイズ1バイト～64 MiBで計測しています。

```sh
$ module load openmpi
$ mpirun -n 36 /opt/openmpi/tests/omb/libexec/osu-micro-benchmarks/mpi/collective/osu_alltoall -x 10 -i 10 -m 1:67108864
# OSU MPI All-to-All Personalized Exchange Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                      10.29
2                      10.56
4                      15.24
8                      36.18
16                     26.05
32                     31.65
64                    114.09
128                    88.31
256                   151.46
512                   200.72
1024                  321.50
2048                  584.21
4096                   57.71
8192                   55.33
16384                  83.89
32768                 191.30
65536                 713.32
131072               1644.93
262144               3760.77
524288               7431.27
1048576             14171.51
2097152             26630.68
4194304             50215.80
8388608             96730.71
16777216           189185.05
33554432           375799.96
67108864           747888.64
$
```

## 3-2. 2ノード間のレイテンシ

以下コマンドを何れか1ノードで **OSU Micro-Benchmarks** を実行するユーザで実行します。  
この出力は、2ノード間のメッセージサイズ1バイトの片道所要時間で、この結果（ここでは **1.67 usec** ）を2ノード間のレイテンシとします。

```sh
$ module load nvhpc openmpi
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /opt/openmpi/tests/omb/libexec/osu-micro-benchmarks/mpi/pt2pt/osu_latency -x 1000 -i 10000 -m 1:1
[inst-xsyjo-x9-ol905:263038] SET UCX_NET_DEVICES=mlx5_2:1

# OSU MPI Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.67
$
```

## 3-3. 2ノード間の帯域幅

以下コマンドを何れか1ノードで **OSU Micro-Benchmarks** を実行するユーザで実行します。  
この出力は、2ノード間のメッセージサイズ256 MiBの帯域幅で、この結果（ここでは **12,254,16 MB/s** ）を2ノード間の帯域幅とします。

```sh
$ module load openmpi
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /opt/openmpi/tests/omb/libexec/osu-micro-benchmarks/mpi/pt2pt/osu_bw -x 10 -i 10 -m 268435456:268435456
[inst-xsyjo-x9-ol905:263198] SET UCX_NET_DEVICES=mlx5_2:1

# OSU MPI Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           12254.16
$
```

## 3-4. 4ノード間のAllreduce

以下コマンドを **OSU Micro-Benchmarks** を実行するユーザで何れか1ノードで実行します。  
ここでは、4ノード144プロセス（ノードあたり36プロセス）を使用したAllreduceの所要時間をメッセージサイズ4バイト～256 MiBで計測しています。

```sh
$ module load openmpi
$ mpirun -n 144 -N 36 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /opt/openmpi/tests/omb/libexec/osu-micro-benchmarks/mpi/collective/osu_allreduce -x 10 -i 10 -m 4:268435456
[inst-ztgl1-x9-ol810:227754] SET UCX_NET_DEVICES=mlx5_2:1

# OSU MPI Allreduce Latency Test v7.5
# Datatype: MPI_INT.
# Size       Avg Latency(us)
4                      11.69
8                      15.34
16                     11.50
32                     11.55
64                     12.11
128                    12.34
256                    13.21
512                    13.93
1024                   17.97
2048                   16.35
4096                   19.48
8192                   96.30
16384                 349.82
32768                3214.49
65536                 160.17
131072               3674.69
262144               3692.61
524288               5020.85
1048576              3576.91
2097152              6506.97
4194304              6996.27
8388608             13097.54
16777216            28519.36
33554432            69049.19
67108864           119121.65
134217728          251878.54
268435456          496306.98
$
```