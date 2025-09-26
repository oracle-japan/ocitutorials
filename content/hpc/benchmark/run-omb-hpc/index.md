---
title: "OSU Micro-Benchmarks実行方法（BM.Optimized3.36編）"
description: "本ドキュメントは、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでベア・メタル・シェイプBM.Optimized3.36をノード間接続するHPCクラスタで、MPI通信性能を計測する標準ベンチマークのOSU Micro-Benchmarksを実行する方法を解説します。"
weight: "2140"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

***
# 0. 概要

本ドキュメントで解説する **[OSU Micro-Benchmarks](https://mvapich.cse.ohio-state.edu/benchmarks/)** は、HPCクラスタのノード間接続インターコネクトを介するMPI通信性能の評価を念頭に、 **[OpenMPI](https://www.open-mpi.org/)** でコンパイルしたバイナリを使用して以下4種類の性能指標を計測する実行方法を解説します。

1. 1ノード内全コアを使用するAlltoall
2. 2ノード間のレイテンシ
3. 2ノード間の帯域幅
4. 4ノード間のAllreduce

本ドキュメントで **OSU Micro-Benchmarks** を実行するHPCクラスタは、計算ノードに第3世代 **Intel Xeon** プロセッサを搭載するベア・メタル・シェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を使用してこれを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続し、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** のカテゴリ **[HPC/GPUクラスタ](/ocitutorials/hpc/#1-1-hpcgpuクラスタ)** のチュートリアルの手順に従う等により、ノード間でMPIが実行できるよう予め構築しておきます。

本ドキュメントは、以下の実行環境で **OSU Micro-Benchmarks** を実行し、

- 計算ノード
  - ノード数： 2 / 4
  - シェイプ : **BM.Optimized3.36** （搭載コア数36）
  - OS ： **Oracle Linux** 8.10ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※1）
- ノード間接続インターコネクト
  - **クラスタ・ネットワーク**
  - リンク速度： 100 Gbps
- **OpenMPI** ： 5.0.8（※2）
- **OSU Micro-Benchmarks** ： 7.5.1

※1）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** です。  
※2） **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従って構築された **OpenMPI** です。

以下の性能が出ています。

- レイテンシ: 1.67 usec
- 帯域幅（256 MiBメッセージサイズ）: 12,254 MB/s

以降では、以下の順に解説します。

1. **OpenMPI** インストール
2. **OSU Micro-Benchmarks** インストール・セットアップ
3. **OSU Micro-Benchmarks** 実行

***
# 1. OpenMPIインストール  

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従い、  **OSU Micro-Benchmarks** を実行する全てのノードに **OpenMPI** をインストールします。

***
# 2. OSU Micro-Benchmarksインストール・セットアップ

以下コマンドを **OSU Micro-Benchmarks** を実行する全てのノードのopcユーザで実行し、 **OSU Micro-Benchmarks** をインストールします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ mkdir ~/`hostname` && cd ~/`hostname` && wget https://mvapich.cse.ohio-state.edu/download/mvapich/osu-micro-benchmarks-7.5.1.tar.gz
$ tar -xvf ./osu-micro-benchmarks-7.5.1.tar.gz
$ module load openmpi
$ cd osu-micro-benchmarks-7.5.1 && ./configure CC=mpicc CXX=mpicxx --prefix=/opt/openmpi/tests/omb
$ make -j 36 && sudo make install
```

次に、以下のファイルを **/usr/share/Modules/modulefiles/omb** で作成します。  
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

prepend-path PATH               $pkg_root:$pkg_root/mpi/collective:$pkg_root/mpi/congestion:$pkg_root/mpi/one-sided:$pkg_root/mpi/pt2pt:$pkg_root/mpi/startup
```

***
# 3. OSU Micro-Benchmarks実行

## 3-1. 1ノード内全コアを使用するAlltoall

以下コマンドを対象ノードで **OSU Micro-Benchmarks** 実行ユーザで実行します。  
ここでは、1ノード36プロセスのAlltoall所要時間をメッセージサイズ1バイト～64 MiBで計測しています。

```sh
$ module load openmpi omb
$ mpirun -n 36 osu_alltoall -x 10 -i 10 -m 1:67108864
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
$ module load openmpi omb
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 osu_latency -x 1000 -i 10000 -m 1:1
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
$ module load openmpi omb
$ mpirun -n 2 -N 1 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 osu_bw -x 10 -i 10 -m 268435456:268435456
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
$ module load openmpi omb
$ mpirun -n 144 -N 36 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 osu_allreduce -x 10 -i 10 -m 4:268435456
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