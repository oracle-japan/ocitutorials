---
title: "OSU Micro-Benchmarks実行方法（BM.GPU4.8/BM.GPU.A100-v2.8編）"
description: "本ドキュメントは、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでベア・メタル・シェイプBM.GPU4.8/BM.GPU.A100-v2.8をノード間接続するGPUクラスタで、GPUデバイスメモリ間のMPI通信性能を計測する標準ベンチマークのOSU Micro-Benchmarksを実行する方法を解説します。"
weight: "2141"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

# 0. 概要

本ドキュメントで解説する **[OSU Micro-Benchmarks](https://mvapich.cse.ohio-state.edu/benchmarks/)** は、GPUクラスタのノード間接続インターコネクトを介するGPUデバイスメモリ間MPI通信性能の評価を念頭に、 **[OpenMPI](https://www.open-mpi.org/)** でコンパイルしたバイナリを使用して以下5種類の性能指標を計測する実行方法を解説します。

1. ノード内GPUデバイスメモリ間レイテンシ
2. ノード内GPUデバイスメモリ間帯域幅
3. 2ノードに跨るGPUデバイスメモリ間レイテンシ
4. 2ノードに跨るGPUデバイスメモリ間帯域幅
5. ノード内8個のGPUを使用するNCCL Allreduce通信性能
6. 2ノードに跨る16個のGPUを使用するNCCL Allreduce通信性能

本ドキュメントで **OSU Micro-Benchmarks** を実行するGPUクラスタは、GPUノードに8枚の **NVIDIA A100** GPUを搭載するベア・メタル・シェイプ **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** を使用してこれを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続しており、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[GPUクラスタを構築する(Ubuntu OS編)](/ocitutorials/hpc/spinup-gpu-cluster-withubuntu/)** のチュートリアルに従い予め構築しておきます。

本ドキュメントは、以下の実行環境で **OSU Micro-Benchmarks** を実行し、

- GPUノード
  - ノード数： 2
  - シェイプ : **BM.GPU4.8** （ **NVIDIA A100** GPU x 8）
  - OS ： **Ubuntu** 24.04（ **[プラットフォーム・イメージ](/ocitutorials/hpc/#5-17-プラットフォームイメージ)** - **[Canonical-Ubuntu-24.04-2025.07.23-0](https://docs.oracle.com/en-us/iaas/images/ubuntu-2404/canonical-ubuntu-24-04-2025-07-23-0.htm)** ）
- ノード間接続インターコネクト
  - **クラスタ・ネットワーク**
  - リンク速度・数： 100 Gbps x 16
- **OpenMPI** ： 5.0.8
- **OSU Micro-Benchmarks** ： 7.5.1

以下の性能が出ています。

- レイテンシ: 1.67 usec
- 帯域幅（256 MiBメッセージサイズ）: 12,254 MB/s

以降では、以下の順に解説します。

1. **OSU Micro-Benchmarks** インストール・セットアップ
2. **OSU Micro-Benchmarks** 実行

# 1. OSU Micro-Benchmarksインストール・セットアップ

本章は、 **[NVIDIA CUDA](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/contents.html)** と
**[NVIDIA HPC SDK](https://developer.nvidia.com/hpc-sdk)** に含まれる **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** を利用できるよう **OSU Micro-Benchmarks** をビルドし、これを **/opt/openmpi/tests/omb** にインストールした後、 **Environment modules** にモジュール名 **omb** を登録します。

以下コマンドを **OSU Micro-Benchmarks** を実行する全てのノードのubuntuユーザで実行し、 **OSU Micro-Benchmarks** をビルドします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ mkdir ~/`hostname` && cd ~/`hostname` && wget https://mvapich.cse.ohio-state.edu/download/mvapich/osu-micro-benchmarks-7.5.1.tar.gz
$ tar -xvf ./osu-micro-benchmarks-7.5.1.tar.gz
$ module purge
$ module load nvhpc openmpi
$ cd osu-micro-benchmarks-7.5.1 && ./configure CC=mpicc CXX=mpicxx --prefix=/opt/openmpi/tests/omb --enable-cuda --with-cuda-include=/usr/local/cuda-12.9/include --with-cuda-libpath=/usr/local/cuda-12.9/lib64 --enable-ncclomb --with-nccl=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/comm_libs/nccl
$
```

次に、カレントディレクトリに作成されたファイル **libtool** を以下のように修正します。

```sh
$ diff libtool_org libtool
1733a1734
>       export PATH=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/compilers/bin:${PATH}
$
```

次に、以下コマンドを **OSU Micro-Benchmarks** を実行する全てのノードのubuntuユーザで実行し、 **OSU Micro-Benchmarks** をインストールします。

```sh
$ make -j 128 && sudo make install
$ sudo sed -i 's/LOCAL_RANK=\$MV2_COMM_WORLD_LOCAL_RANK/LOCAL_RANK=\$OMPI_COMM_WORLD_LOCAL_RANK/g' /opt/openmpi/tests/omb/libexec/osu-micro-benchmarks/get_local_rank
```

次に、以下のファイルを **/usr/share/modules/modulefiles/omb** で作成します。  
このファイルは、 **Environment modules** にモジュール名 **omb** を登録し、これをロードすることで **OSU Micro-Benchmarks** 利用環境の設定が可能になります

```sh
#%Module1.0
##
## OSU Micro-Benchmarks for OpenMPI

proc ModulesHelp { } {
        puts stderr "OSU Micro-Benchmarks for OpenMPI\n"
}

module-whatis   "OSU Micro-Benchmarks for OpenMPI"

set pkg_root    /opt/openmpi/tests/omb/libexec/osu-micro-benchmarks
set ver         7.5.1

prepend-path PATH               $pkg_root:$pkg_root/mpi/collective:$pkg_root/mpi/congestion:$pkg_root/mpi/one-sided:$pkg_root/mpi/pt2pt:$pkg_root/mpi/startup:$pkg_root/xccl/collective:$pkg_root/xccl/pt2pt
```

# 2. OSU Micro-Benchmarks実行

## 2-1. ノード内GPUデバイスメモリ間レイテンシ

以下コマンドを対象ノードで **OSU Micro-Benchmarks** 実行ユーザで実行します。  
ここでは、1ノード36プロセスのAlltoall所要時間をメッセージサイズ1バイト～64 MiBで計測しています。

```sh
$ module load nvhpc openmpi omb
$ mpirun -n 2 -x UCX_NET_DEVICES=mlx5_4:1 -x UCX_TLS=rc,cuda_copy,gdr_copy get_local_rank osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D D


$
```

## 2-2. ノード内GPUデバイスメモリ間帯域幅

以下コマンドを何れか1ノードで **OSU Micro-Benchmarks** を実行するユーザで実行します。  
この出力は、2ノード間のメッセージサイズ1バイトの片道所要時間で、この結果（ここでは **1.67 usec** ）を2ノード間のレイテンシとします。

```sh
$ module load nvhpc openmpi omb
$ mpirun -n 2 -x UCX_NET_DEVICES=mlx5_4:1 -x UCX_TLS=rc,cuda_copy,gdr_copy get_local_rank osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D D



$
```

## 2-3. 2ノードに跨るGPUデバイスメモリ間レイテンシ

以下コマンドを何れか1ノードで **OSU Micro-Benchmarks** を実行するユーザで実行します。  
この出力は、2ノード間のメッセージサイズ256 MiBの帯域幅で、この結果（ここでは **12,254,16 MB/s** ）を2ノード間の帯域幅とします。

```sh
$ module load nvhpc openmpi omb
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_4:1 -x UCX_TLS=rc,cuda_copy,gdr_copy -x LD_LIBRARY_PATH get_local_rank osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D D


$
```

## 2-4. 2ノードに跨るGPUデバイスメモリ間帯域幅

以下コマンドを **OSU Micro-Benchmarks** を実行するユーザで何れか1ノードで実行します。  
ここでは、4ノード144プロセス（ノードあたり36プロセス）を使用したAllreduceの所要時間をメッセージサイズ4バイト～256 MiBで計測しています。

```sh
$ module load nvhpc openmpi omb
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_4:1 -x UCX_TLS=rc,cuda_copy,gdr_copy -x LD_LIBRARY_PATH get_local_rank osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D D


$
```

## 2-5. ノード内8個のGPUを使用するNCCL Allreduce通信性能

以下コマンドを **OSU Micro-Benchmarks** を実行するユーザで何れか1ノードで実行します。  
ここでは、4ノード144プロセス（ノードあたり36プロセス）を使用したAllreduceの所要時間をメッセージサイズ4バイト～256 MiBで計測しています。

```sh
$ module load openmpi
$ mpirun -n 8 -x UCX_NET_DEVICES=mlx5_4:1 get_local_rank osu_xccl_allreduce -x 1 -i 1 -m 10737418240:10737418240 -d cuda D D

$
```


## 2-6. 2ノードに跨る16個のGPUを使用するNCCL Allreduce通信性能

以下コマンドを **OSU Micro-Benchmarks** を実行するユーザで何れか1ノードで実行します。  
ここでは、4ノード144プロセス（ノードあたり36プロセス）を使用したAllreduceの所要時間をメッセージサイズ4バイト～256 MiBで計測しています。

```sh
$ module load openmpi
$ mpirun -n 16 -N 8 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_4:1 -x LD_LIBRARY_PATH get_local_rank osu_xccl_allreduce -x 1 -i 1 -m 10737418240:10737418240 -d cuda D D

$
```