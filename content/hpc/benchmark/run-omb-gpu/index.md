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

本ドキュメントで解説する **[OSU Micro-Benchmarks](https://mvapich.cse.ohio-state.edu/benchmarks/)** は、ノード内・ノード間のGPUデバイスメモリ（以降 **D** と呼称します。）・ホストメモリ（以降 **H** と呼称します。）間MPI通信性能の評価を念頭に、 **[OpenMPI](https://www.open-mpi.org/)** でコンパイルしたバイナリを使用して以下の性能指標を計測する実行方法を解説します。

1. **[ノード内ホストメモリ・GPUデバイスメモリ間レイテンシ・帯域幅](#2-1-ノード内ホストメモリgpuデバイスメモリ間レイテンシ帯域幅)**
2. **[2ノードに跨るGPUデバイスメモリ間レイテンシ・帯域幅](#2-2-2ノードに跨るgpuデバイスメモリ間レイテンシ帯域幅)**
3. **[ノード内8個のGPUを使用するNCCL Allreduce通信性能](#2-3-ノード内8個のgpuを使用するnccl-allreduce通信性能)**
4. **[2ノードに跨る16個のGPUを使用するNCCL Allreduce通信性能](#2-4-2ノードに跨る16個のgpuを使用するnccl-allreduce通信性能)**

本ドキュメントで **OSU Micro-Benchmarks** を実行するGPUクラスタは、GPUノードに8枚の **NVIDIA A100** GPUを搭載するベア・メタル・シェイプ **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** を使用してこれを **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** で接続しており、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** の **[GPUクラスタを構築する(Ubuntu OS編)](../../spinup-gpu-cluster-withubuntu/)** のチュートリアルに従い予め構築しておきます。

本ドキュメントは、以下の実行環境で **OSU Micro-Benchmarks** の計測を実施し、

- GPUノード
  - ノード数： 2
  - シェイプ : **BM.GPU4.8** （ **NVIDIA A100 40GB SXM** x 8）
- ノード間接続インターコネクト
  - **クラスタ・ネットワーク**
  - リンク速度・数： 100 Gbps x 16
- ソフトウェア
  - OS ： **Ubuntu** 24.04（※1）
  - **NVIDIA Driver** ： 575.57.08
  - **NVIDIA CUDA** ： 12.9.1
  - **NVIDIA Fabric Manager** ： 575.57.08
  - **NVIDIA HPC SDK** ： 25.7
  - **OpenMPI** ： 5.0.8
  - **OSU Micro-Benchmarks** ： 7.5.1

※1） **[プラットフォーム・イメージ](../../#5-17-プラットフォームイメージ)** の **[Canonical-Ubuntu-24.04-2025.07.23-0](https://docs.oracle.com/en-us/iaas/images/ubuntu-2404/canonical-ubuntu-24-04-2025-07-23-0.htm)** です。

**D** ・ **H** 間のレイテンシ・帯域幅に関して以下の性能が出ています。

| 方向               | ノード内/ノード間 | **D** ・ **H** 接続関係 | レイテンシ   | 帯域幅          |
| :--------------: | :-------: | :----------------: | :-----: | :----------: |
| **D**  ->  **D** | ノード内      | -                  | 2.48 us | 279,578 MB/s |
|                  | 2ノード間     | -                  | 3.89 us | 11,962 MB/s  |
| **H**  ->  **D** | ノード内      | 同一NUMAノード          | 1.30 us | 23,744 MB/s  |
|                  |           | 同一ソケットで異なるNUMAノード  | 1.66 us | 23,737 MB/s  |
|                  |           | 異なるソケット            | 1.92 us | 23,369 MB/s  |
| **D**  ->  **H** | ノード内      | 同一NUMAノード          | 1.32 us | 23,230 MB/s  |
|                  |           | 同一ソケットで異なるNUMAノード  | 1.65 us | 23,224 MB/s  |
|                  |           | 異なるソケット            | 1.92 us | 23,209 MB/s  |

以降では、以下の順に解説します。

1. **[OSU Micro-Benchmarksインストール・セットアップ](#1-osu-micro-benchmarksインストールセットアップ)**
2. **[OSU Micro-Benchmarks実行](#2-osu-micro-benchmarks実行)**

# 1. OSU Micro-Benchmarksインストール・セットアップ

本章は、 **[NVIDIA CUDA](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/contents.html)** と **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** （ **[NVIDIA HPC SDK](https://developer.nvidia.com/hpc-sdk)** に含まれる）を利用できるよう **OSU Micro-Benchmarks** をCUDA-awareな **[OpenMPI](https://www.open-mpi.org/)** でビルドし、これを **/opt/openmpi/tests/omb** にインストールした後、 **Environment modules** にモジュール名 **omb** を登録します。

以下コマンドを **OSU Micro-Benchmarks** を実行する全てのノードのubuntuユーザで実行します。

```sh
$ mkdir ~/`hostname` && cd ~/`hostname` && wget https://mvapich.cse.ohio-state.edu/download/mvapich/osu-micro-benchmarks-7.5.1.tar.gz
$ tar -xvf ./osu-micro-benchmarks-7.5.1.tar.gz
$ module load nvhpc openmpi
$ cd osu-micro-benchmarks-7.5.1 && ./configure CC=mpicc CXX=mpicxx --prefix=/opt/openmpi/tests/omb --enable-cuda --with-cuda-include=/usr/local/cuda-12.9/include --with-cuda-libpath=/usr/local/cuda-12.9/lib64 --enable-ncclomb --with-nccl=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/comm_libs/nccl
```

次に、カレントディレクトリに作成されたファイル **libtool** を以下のように修正します。

```sh
$ diff libtool_org libtool
1733a1734
>       export PATH=/opt/nvidia/hpc_sdk/Linux_x86_64/25.7/compilers/bin:${PATH}
$
```

次に、以下コマンドを **OSU Micro-Benchmarks** を実行する全てのノードのubuntuユーザで実行し、 **OSU Micro-Benchmarks** をインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ make -j 128 && sudo make install
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

module-whatis "OSU Micro-Benchmarks for OpenMPI"

set pkg_root  /opt/openmpi/tests/omb/libexec/osu-micro-benchmarks
set ver       7.5.1

prepend-path PATH $pkg_root:$pkg_root/mpi/collective:$pkg_root/mpi/congestion:$pkg_root/mpi/one-sided:$pkg_root/mpi/pt2pt:$pkg_root/mpi/startup:$pkg_root/xccl/collective:$pkg_root/xccl/pt2pt
```

# 2. OSU Micro-Benchmarks実行

## 2-1. ノード内ホストメモリ・GPUデバイスメモリ間レイテンシ・帯域幅

### 2-1-0. 概要

本章は、ノード内の **H** ・ **D** 間のメッセージサイズ1バイトでのレイテンシとメッセージサイズ256 MiBでの帯域幅を、GPU番号0とGPU番号1の **D** 間と、GPU番号0/1とソケット・NUMAノードの観点で接続位置の異なる以下3種類の **H** の間の" **H**  ->  **D** "方向と" **D**  ->  **H** "方向で、それぞれ7種類計測します。

- 同一NUMAノードに接続する **H** 
- 同一ソケットで異なるNUMAノードに接続する **H** 
- 異なるソケットに接続する **H** 

使用するGPU番号が0と1になるのは、 **OSU Micro-Benchmarks** がMPIプロセスを割り当てるGPUを決定する際、 **OpenMPI** の環境変数 **OMPI_COMM_WORLD_LOCAL_RANK** 環境変数と同じGPU番号のGPUを選択するためです。

なお **BM.GPU4.8** は、2個のソケットと8個のNUMAノードと64個のCPUコアと8個のGPUを搭載し、ソケット番号0側にNUMAノード番号0～3とCPUコア番号0～31を収容し、ソケット番号1側にCPUコア番号32～63を収容し、NUMAノード番号3にCPUコア番号24～31とGPU番号0～1を収容する点に留意します。

### 2-1-1. レイテンシ

以下コマンドを対象ノードで **OSU Micro-Benchmarks** 実行ユーザで実行します。

```sh
$ module load nvhpc openmpi omb
$ mpirun -n 2 --report-bindings osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D D
[inst-wpdlx-ao-ub24:22411] Rank 0 bound to package[0][core:0]
[inst-wpdlx-ao-ub24:22411] Rank 1 bound to package[0][core:1]

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       2.48
$ mpirun -n 2 --map-by pe-list=24,25:ordered --report-bindings numactl -l osu_latency -x 1000 -i 10000 -m 1:1 -d cuda H D
[inst-wpdlx-ao-ub24:22459] Rank 0 bound to package[0][core:24]
[inst-wpdlx-ao-ub24:22459] Rank 1 bound to package[0][core:25]

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.30
$ mpirun -n 2 --map-by pe-list=0,25:ordered --report-bindings numactl -l osu_latency -x 1000 -i 10000 -m 1:1 -d cuda H D
[inst-wpdlx-ao-ub24:22511] Rank 0 bound to package[0][core:0]
[inst-wpdlx-ao-ub24:22511] Rank 1 bound to package[0][core:25]

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.66
$ mpirun -n 2 --map-by pe-list=32,25:ordered --report-bindings numactl -l osu_latency -x 1000 -i 10000 -m 1:1 -d cuda H D
[inst-wpdlx-ao-ub24:22558] Rank 0 bound to package[1][core:32]
[inst-wpdlx-ao-ub24:22558] Rank 1 bound to package[0][core:25]

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.92
$ mpirun -n 2 --map-by pe-list=25,24:ordered --report-bindings numactl -l osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D H
[inst-wpdlx-ao-ub24:22630] Rank 0 bound to package[0][core:25]
[inst-wpdlx-ao-ub24:22630] Rank 1 bound to package[0][core:24]

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.32
$ mpirun -n 2 --map-by pe-list=25,0:ordered --report-bindings numactl -l osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D H
[inst-wpdlx-ao-ub24:22675] Rank 0 bound to package[0][core:25]
[inst-wpdlx-ao-ub24:22675] Rank 1 bound to package[0][core:0]

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.65
$ mpirun -n 2 --map-by pe-list=25,32:ordered --report-bindings numactl -l osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D H
[inst-wpdlx-ao-ub24:22722] Rank 0 bound to package[0][core:25]
[inst-wpdlx-ao-ub24:22722] Rank 1 bound to package[1][core:32]

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       1.92
$
```

### 2-1-2. 帯域幅

以下コマンドを対象ノードで **OSU Micro-Benchmarks** 実行ユーザで実行します。

```sh
$ module load nvhpc openmpi omb
$ mpirun -n 2 --report-bindings osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D D
[inst-wpdlx-ao-ub24:22768] Rank 0 bound to package[0][core:0]
[inst-wpdlx-ao-ub24:22768] Rank 1 bound to package[0][core:1]

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456          279577.81
$ mpirun -n 2 --map-by pe-list=24,25:ordered --report-bindings numactl -l osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda H D
[inst-wpdlx-ao-ub24:22814] Rank 0 bound to package[0][core:24]
[inst-wpdlx-ao-ub24:22814] Rank 1 bound to package[0][core:25]

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           23744.00
$ mpirun -n 2 --map-by pe-list=0,25:ordered --report-bindings numactl -l osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda H D
[inst-wpdlx-ao-ub24:22877] Rank 0 bound to package[0][core:0]
[inst-wpdlx-ao-ub24:22877] Rank 1 bound to package[0][core:25]

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           23736.96
$ mpirun -n 2 --map-by pe-list=32,25:ordered --report-bindings numactl -l osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda H D
[inst-wpdlx-ao-ub24:22932] Rank 0 bound to package[1][core:32]
[inst-wpdlx-ao-ub24:22932] Rank 1 bound to package[0][core:25]

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           23369.30
$ mpirun -n 2 --map-by pe-list=25,24:ordered --report-bindings numactl -l osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D H
[inst-wpdlx-ao-ub24:23111] Rank 0 bound to package[0][core:25]
[inst-wpdlx-ao-ub24:23111] Rank 1 bound to package[0][core:24]

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           23229.60
$ mpirun -n 2 --map-by pe-list=25,0:ordered --report-bindings numactl -l osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D H
[inst-wpdlx-ao-ub24:23191] Rank 0 bound to package[0][core:25]
[inst-wpdlx-ao-ub24:23191] Rank 1 bound to package[0][core:0]

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           23223.68
$ mpirun -n 2 --map-by pe-list=25,32:ordered --report-bindings numactl -l osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D H
[inst-wpdlx-ao-ub24:23246] Rank 0 bound to package[0][core:25]
[inst-wpdlx-ao-ub24:23246] Rank 1 bound to package[1][core:32]

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           23209.28
$
```

## 2-2. 2ノードに跨るGPUデバイスメモリ間レイテンシ・帯域幅

### 2-2-0. 概要

本章は、2ノードに跨るGPU番号0同士のメッセージサイズ1バイトでのレイテンシとメッセージサイズ256 MiBでの帯域幅を計測しています。

使用するGPU番号が0になるのは、 **OSU Micro-Benchmarks** がMPIプロセスを割り当てるGPUを決定する際、 **OpenMPI** の環境変数 **OMPI_COMM_WORLD_LOCAL_RANK** 環境変数と同じGPU番号とするためです。

使用するノード間接続ネットワークインターフェースは、GPU番号0と同一PCIeスイッチに接続する **mlx5_6** を指定しています。

### 2-2-1. レイテンシ

以下コマンドを何れか1ノードで **OSU Micro-Benchmarks** を実行するユーザで実行します。  

```sh
$ module load nvhpc openmpi omb
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_6:1 -x PATH -x LD_LIBRARY_PATH osu_latency -x 1000 -i 10000 -m 1:1 -d cuda D D
[inst-0d12t-ao-ub24:14174] SET UCX_NET_DEVICES=mlx5_6:1

# OSU MPI-CUDA Latency Test v7.5
# Datatype: MPI_CHAR.
# Size       Avg Latency(us)
1                       3.89
$
```

### 2-2-2. 帯域幅

以下コマンドを何れか1ノードで **OSU Micro-Benchmarks** を実行するユーザで実行します。

```sh
$ module load nvhpc openmpi omb
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_6:1 -x PATH -x LD_LIBRARY_PATH osu_bw -x 10 -i 10 -m 268435456:268435456 -d cuda D D
[inst-0d12t-ao-ub24:16701] SET UCX_NET_DEVICES=mlx5_6:1

# OSU MPI-CUDA Bandwidth Test v7.5
# Datatype: MPI_CHAR.
# Size      Bandwidth (MB/s)
268435456           11962.21
$
```

## 2-3. ノード内8個のGPUを使用するNCCL Allreduce通信性能

本章は、ノード内の8枚のGPUを使用する **NCCL** のAllReduce通信性能を、メッセージサイズ1 GiBバイトでの所要時間で計測します。

以下コマンドを対象ノードで **OSU Micro-Benchmarks** 実行ユーザで実行します。

```sh
$ module load nvhpc openmpi omb
$ mpirun -n 8 -x UCX_NET_DEVICES=mlx5_6:1 osu_xccl_allreduce -x 10 -i 10 -m 1073741824:1073741824 -d cuda D D
[inst-s08bb-ao-ub24:28293] SET UCX_NET_DEVICES=mlx5_6:1
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL

# OSU NCCL-CUDA Allreduce Latency Test v7.5
# Size       Avg Latency(us)
1073741824           8955.18
$
```


## 2-4. 2ノードに跨る16個のGPUを使用するNCCL Allreduce通信性能

本章は、2ノードに跨る16枚のGPUを使用する **NCCL** のAllReduce通信性能を、メッセージサイズ1 GiBバイトでの所要時間で計測します。

以下コマンドを何れか1ノードで **OSU Micro-Benchmarks** を実行するユーザで実行します。

```sh
$ module load openmpi
$ mpirun -n 16 -N 8 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_6:1 -x PATH -x LD_LIBRARY_PATH osu_xccl_allreduce -x 10 -i 10 -m 1073741824:1073741824 -d cuda D D
[inst-s08bb-ao-ub24:28899] SET UCX_NET_DEVICES=mlx5_6:1
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL
#Using NCCL

# OSU NCCL-CUDA Allreduce Latency Test v7.5
# Size       Avg Latency(us)
1073741824          13482.19
$
```