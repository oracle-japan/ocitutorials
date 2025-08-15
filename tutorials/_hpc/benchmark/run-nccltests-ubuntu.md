---
title: "NCCL Tests実行方法（BM.GPU4.8/BM.GPU.A100-v2.8 Ubuntu編）"
excerpt: "本ドキュメントは、HPC/機械学習のワークロード実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでGPUワークロード向けベアメタルインスタンスBM.GPU4.8/BM.GPU.A100-v2.8をノード間接続するGPUクラスタで、GPU間通信の集合通信ライブラリNCCLの標準ベンチマークであるNCCL Testsを実行する方法を解説します。"
order: "2141"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

本ドキュメントで解説する **[NCCL Tests](https://github.com/nvidia/nccl-tests)** の実行は、8枚の **NVIDIA A100** GPUを搭載するベアメタルシェイプ  **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** を使用し、これらを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続するGPUクラスタ、あるいは単一のGPUインスタンスで実施します。  

このGPUクラスタ/インスタンスは、OSを **Ubuntu** とし、 **[NVIDIA HPC SDK](https://developer.nvidia.com/hpc-sdk)** に含まれる **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** を使用して **NCCL Tests** をコンパイル・実行します。

以上より、本ドキュメントで解説する **NCCL Tests** の実行は、以下の手順で行います。

1. **[GPUクラスタ/インスタンス構築](#1-gpuクラスタインスタンス構築)**
2. **[NCCL Testsコンパイル](#2-nccl-testsコンパイル)**
3. **[NCCL Tests実行](#3-nccl-tests実行)**

本ドキュメントでは、以下の環境で **NCCL** の通信性能を計測し、

- シェイプ ： **BM.GPU4.8**
- OS ： **Ubuntu** 24.04 （※1）
- **NCCL** ： 2.26.5
- MPI ： **[OpenMPI](https://www.open-mpi.org/)** 5.0.6
- ノード間接続 ： **クラスタ・ネットワーク** （100Gbps x 16 /ノード）

※1） **[プラットフォーム・イメージ](/ocitutorials/hpc/#5-17-プラットフォームイメージ)** の **[Canonical-Ubuntu-24.04-2025.05.20-0](https://docs.oracle.com/en-us/iaas/images/ubuntu-2404/canonical-ubuntu-24-04-2025-05-20-0.htm)** です。  

以下の性能が出ています。

- 通信タイプ： **All-Reduce**
- メッセージサイズ： 10 GiB
- 帯域（busbw）
    - 1ノード8GPU： **232 GB/s** 
    - 2ノード16GPU： **57 GB/s**

***
# 1. GPUクラスタ/インスタンス構築

本章は、 **NCCL Tests** を実行するGPUクラスタ/インスタンスを構築します。

単一ノードで **NCCL Tests** を実行するGPUインスタンスの構築は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[UbuntuをOSとするHPC/機械学習ワークロード向けGPUノード構築方法](/ocitutorials/hpc/tech-knowhow/gpu-with-ubuntu/)** の手順に従い実施します。

複数ノードに跨る **NCCL Tests** を実行するGPUクラスタの構築は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[GPUクラスタを構築する(Ubuntu OS編)](/ocitutorials/hpc/spinup-gpu-cluster-withubuntu/)** の手順に従い実施します。

***
# 2. NCCL Testsコンパイル

本章は、 **NCCL Tests** をコンパイルします。

以下コマンドをGPUノードの **NCCL Tests** 実行ユーザで実行し、 **NCCL Tests** をコンパイルします。  
ここでは、このユーザのホームディレクトリがGPUノード間で共有されていることを前提に、以下の手順を何れかのGPUノードで実施します。

```sh
$ mkdir ~/`hostname` && cd ~/`hostname` && git clone https://github.com/NVIDIA/nccl-tests.git
$ module purge
$ module load nvhpc openmpi
$ cd nccl-tests && make -j 128 MPI=1 MPI_HOME=/opt/openmpi CUDA_HOME=/usr/local/cuda-12.9 NCCL_HOME=/opt/nvidia/hpc_sdk/Linux_x86_64/25.5/comm_libs/nccl
```

***
# 3. NCCL Tests実行

## 3-0. 概要

本章は、以下の2パターンで **NCCL Tests** を実行します。

1. **[1ノード8GPU](#3-1-1ノード8gpu)**
2. **[2ノード16GPU](#3-2-2ノード16gpu)**

## 3-1. 1ノード8GPU

以下コマンドをGPUノードの **NCCL Tests** 実行ユーザで実行し、GPUノード内の8枚のGPUを使用する **NCCL** の **All-Reduce** 通信性能を計測します。

```sh
$ cd ~/nccl-tests
$ module purge
$ module load nvhpc openmpi
$ mpirun -n 8 ./build/all_reduce_perf -b 10G -e 10G -t 1 -g 1
# Collective test starting: all_reduce_perf
# nThread 1 nGpus 1 minBytes 10737418240 maxBytes 10737418240 step: 1048576(bytes) warmup iters: 5 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid 305376 on inst-lscuv-ao-ub24 device  0 [0000:0f:00] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid 305377 on inst-lscuv-ao-ub24 device  1 [0000:15:00] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid 305378 on inst-lscuv-ao-ub24 device  2 [0000:51:00] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid 305379 on inst-lscuv-ao-ub24 device  3 [0000:54:00] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid 305380 on inst-lscuv-ao-ub24 device  4 [0000:8d:00] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid 305381 on inst-lscuv-ao-ub24 device  5 [0000:92:00] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid 305382 on inst-lscuv-ao-ub24 device  6 [0000:d6:00] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid 305383 on inst-lscuv-ao-ub24 device  7 [0000:da:00] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
 10737418240    2684354560     float     sum      -1    80922  132.69  232.20      0    80948  132.65  232.13      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 232.167 
#
# Collective test concluded: all_reduce_perf

$
```

## 3-2. 2ノード16GPU

以下コマンドをGPUクラスタ内の何れかのGPUノードの **NCCL Tests** 実行ユーザで実行し、16枚のGPUと16個のRDMAネットワークポートを使用する、2ノードに跨る **NCCL** のAll-Reduce通信性能を計測します。

```sh
$ cd ~/nccl-tests
$ module purge
$ module load nvhpc openmpi
$ mpirun -n 16 -N 8 -hostfile ~/hostlist.txt -x LD_LIBRARY_PATH -x UCX_NET_DEVICES=mlx5_4:1 -x NCCL_IGNORE_CPU_AFFINITY=1 ./build/all_reduce_perf -b 10G -e 10G -t 1 -g 1
# Collective test starting: all_reduce_perf
# nThread 1 nGpus 1 minBytes 10737418240 maxBytes 10737418240 step: 1048576(bytes) warmup iters: 5 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid 306456 on inst-lscuv-ao-ub24 device  0 [0000:0f:00] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid 306457 on inst-lscuv-ao-ub24 device  1 [0000:15:00] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid 306458 on inst-lscuv-ao-ub24 device  2 [0000:51:00] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid 306459 on inst-lscuv-ao-ub24 device  3 [0000:54:00] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid 306460 on inst-lscuv-ao-ub24 device  4 [0000:8d:00] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid 306461 on inst-lscuv-ao-ub24 device  5 [0000:92:00] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid 306462 on inst-lscuv-ao-ub24 device  6 [0000:d6:00] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid 306463 on inst-lscuv-ao-ub24 device  7 [0000:da:00] NVIDIA A100-SXM4-40GB
#  Rank  8 Group  0 Pid 306665 on inst-jyrlo-ao-ub24 device  0 [0000:0f:00] NVIDIA A100-SXM4-40GB
#  Rank  9 Group  0 Pid 306666 on inst-jyrlo-ao-ub24 device  1 [0000:15:00] NVIDIA A100-SXM4-40GB
#  Rank 10 Group  0 Pid 306667 on inst-jyrlo-ao-ub24 device  2 [0000:51:00] NVIDIA A100-SXM4-40GB
#  Rank 11 Group  0 Pid 306668 on inst-jyrlo-ao-ub24 device  3 [0000:54:00] NVIDIA A100-SXM4-40GB
#  Rank 12 Group  0 Pid 306669 on inst-jyrlo-ao-ub24 device  4 [0000:8d:00] NVIDIA A100-SXM4-40GB
#  Rank 13 Group  0 Pid 306670 on inst-jyrlo-ao-ub24 device  5 [0000:92:00] NVIDIA A100-SXM4-40GB
#  Rank 14 Group  0 Pid 306671 on inst-jyrlo-ao-ub24 device  6 [0000:d6:00] NVIDIA A100-SXM4-40GB
#  Rank 15 Group  0 Pid 306672 on inst-jyrlo-ao-ub24 device  7 [0000:da:00] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
 10737418240    2684354560     float     sum      -1   353220   30.40   57.00      0   352956   30.42   57.04      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 57.0188 
#
# Collective test concluded: all_reduce_perf

$
```