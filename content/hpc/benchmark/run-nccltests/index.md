---
title: "NCCL Tests実行方法（BM.GPU4.8/BM.GPU.A100-v2.8 Oracle Linux編）"
description: "本ドキュメントは、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでベア・メタル・シェイプBM.GPU4.8/BM.GPU.A100-v2.8をノード間接続するGPUクラスタで、GPU間通信の集合通信ライブラリNCCLの標準ベンチマークであるNCCL Testsを実行する方法を解説します。"
weight: "2150"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

# 0. 概要

本ドキュメントで解説する **[NCCL Tests](https://github.com/nvidia/nccl-tests)** の実行は、GPUインスタンス上に **[containerd](https://github.com/containerd/containerd/tree/main)** と **[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html)** で構築されたコンテナ実行環境で **[TensorFlow NGC Container](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tensorflow)** を起動し、このコンテナに含まれる **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** とコンテナ上でビルドする **NCCL Tests** を使用します。

本ドキュメントで **NCCL Tests** を実行するGPUインスタンスは、8枚の **NVIDIA A100** GPUを搭載するベア・メタル・シェイプ **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** を使用し、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[containerdによるコンテナ実行環境構築方法](../../tech-knowhow/container-with-containerd/)** の手順に従い、 **containerd** と **NVIDIA Container Toolkit** によるコンテナ実行環境が予め構築されていることを前提に、 **TensorFlow NGC Container** を起動してこの上で **NCCL Tests** を実行する手順を、以下の順に解説します。

1. **[NCCL Tests計測用コンテナ作成](#1-nccl-tests計測用コンテナ作成)**
2. **[NCCL Testsコンパイル](#2-nccl-testsコンパイル)**
3. **[NCCL Tests実行](#3-nccl-tests実行)**

本ドキュメントでは、以下の環境で **NCCL Tests** の **All-Reduce** 通信性能をコンテナ環境から計測し、10 GiBのメッセージサイズで **219 GB/s** の帯域（busbw）性能が出ています。

- シェイプ ： **BM.GPU4.8/BM.GPU.A100-v2.8**
- ノード数 ： 2
- GPU数 ： **NVIDIA A100 40GB/80GB** x 16
- ノード間接続インターコネクト ： **クラスタ・ネットワーク** （100 Gbps x 16）
- **イメージ** ： **Oracle Linux** 9.5ベースのGPU **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※1）
- コンテナランタイム ： **containerd** 2.2.0
- **NVIDIA Container Toolkit** ： 1.18.0
- コンテナ ： **TensorFlow NGC Container** 25.02-tf2-py3
- **NCCL** ： 2.25.1（※2）
- MPI ： **[OpenMPI](https://www.open-mpi.org/)** 4.1.7rc1（※2）

※1） **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.15** です。  
※2）コンテナに含まれるものを使用します。

# 1. NCCL Tests計測用コンテナ作成

## 1-0. 概要

本章は、後の章で **NCCL Tests** の計測を実行するためのコンテナ作成とその事前準備を行います。

本ドキュメントは、 **NCCL Tests** がコンテナを跨るプログラム実行のコントローラとして **OpenMPI** を使用しますが、このためにはMPIプログラムをmpirun等で起動するコンテナ（いわゆるヘッドノード）からMPIプログラム実行に参加する他の全てのコンテナに対して、パスフレーズ無しでSSH接続できる必要があります。

またここで使用する **TensorFlow NGC Container** は、sshdがインストールされていないため、ヘッドノード以外のコンテナでこれをインストールする必要があります。

また **OpenMPI** の実行は、これを実行するコンテナ間で必要なポートにアクセス出来る必要があるため、これを妨げるGPUノード上で動作するファイアーウォールやGPUノードが接続されるサブネットのセキュリティリストを修正する必要があります。

以上より、本章で実施する作業は以下の手順を経て行います。

1. **[コンテナ間SSH接続環境構築](#1-1-コンテナ間ssh接続環境構築)**
2. **[MPI実行を妨げる設定の修正](#1-2-mpi実行を妨げる設定の修正)**
3. **[コンテナ起動](#1-3-コンテナ起動)**
4. **[sshdインストール・起動](#1-4-sshdインストール起動)**

なお、手順 **1.** 、 **2.** 、及び **4.** は、単一GPUノードでのみ **NCCL Tests** の計測を実行する場合実施する必要ありません。  

またGPUクラスタの場合は、全てのGPUノード間でコンテナ起動ユーザのホームディレクトリが共有されていることを前提とします。

## 1-1. コンテナ間SSH接続環境構築

以下コマンドを2ノードのGPUノードのうち1ノード（以降このGPUノードをマスターノード、他のGPUノードをスレーブノードと呼称します。）のコンテナ起動ユーザで実行します。

```sh
$ ssh-keygen -f ~/.ssh/id_rsa -N ""
$ cat  ~/.ssh/id_rsa.pub | tee -a ~/.ssh/authorized_keys
```

## 1-2. MPI実行を妨げる設定の修正

マスターノードとスレーブノードのコンテナ間でMPI実行を妨げる設定を修正するため、以下を実施します。

- 全てのGPUノードの **firewalld** 停止
- GPUノードが接続するサブネットのセキュリティーリストのイングレス・ルールに同サブネットからのアクセスを全て許可

なお、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** のカテゴリ **[機械学習環境](../../#1-2-機械学習環境)** のチュートリアル **[GPUクラスタを構築する(基礎インフラ手動構築編)](../../spinup-gpu-cluster/)** や **[GPUクラスタを構築する(基礎インフラ自動構築編)](../../spinup-gpu-cluster-withterraform/)** の手順に従って構築されたGPUクラスタは、既にこの設定が適用されているため、改めて実施する必要はありません。

## 1-3. コンテナ起動

以下コマンドをマスターノードとスレーブノードのコンテナ起動ユーザでそれぞれ実行し、 **NGC Catalog** から **TensorFlow NGC Container** をホストネットワークモードで起動します。  
本コンテナのサイズは、約14 GBです。

```sh
$ nerdctl run -it --rm --gpus all --network=host --ipc=host --ulimit memlock=-1 --ulimit stack=67108864 --shm-size=1g -v ~:/root -v /sys:/sys:ro nvcr.io/nvidia/tensorflow:25.02-tf2-py3
```

## 1-4. sshdインストール・起動

以下コマンドをスレーブノードで起動したコンテナ上のrootユーザで実行し、SSHサーバを起動します。

```sh
$ apt update
$ apt install -y openssh-server
$ mkdir /run/sshd && /usr/sbin/sshd -p 22222
```

次に、以下コマンドをマスターノードで起動したコンテナ上のrootユーザで実行し、スレーブノードにSSH接続できることを確認します。  
なお、sshコマンドで指定するホスト名は、自身の環境のスレーブノードのホスト名に置き換えます。

```sh
$ ssh -p 22222 -oStrictHostKeyChecking=accept-new inst-gpu-slave hostname
Warning: Permanently added '[inst-gpu-slave]:22222' (ED25519) to the list of known hosts.
inst-gpu-slave
$
```

# 2. NCCL Testsコンパイル

本章は、後の章で実行する **NCCL Tests** のバイナリをビルドします。

以下コマンドをマスターノードで起動したコンテナ上のrootユーザで実行し、 **NCCL Tests** を **GitHub** からダウンロードしてビルドします。  
なおmakeコマンドの並列数は、当該ノードのコア数に合わせて調整します。

```sh
$ cd ~ && git clone https://github.com/NVIDIA/nccl-tests.git
$ cd nccl-tests && make -j 128 MPI=1 MPI_HOME=/usr/local/mpi CUDA_HOME=/usr/local/cuda NCCL_HOME=/usr/lib/x86_64-linux-gnu
```

# 3. NCCL Tests実行

## 3-0. 概要

本章は、以下の2パターンで **NCCL Tests** を実行します。

1. **[1ノード8GPU](#3-1-1ノード8gpu)**
2. **[2ノード16GPU](#3-2-2ノード16gpu)**

## 3-1. 1ノード8GPU

以下コマンドをマスターノードとスレーブノードで起動したコンテナ上のrootユーザでそれぞれ実行し、1ノード8枚のGPUを使用する **NCCL** の **All-Reduce** 通信性能を計測します。

```sh
$ cd ~/nccl-tests && mpirun --allow-run-as-root -n 8 ./build/all_reduce_perf -b 10G -e 10G -t 1 -g 1
# nccl-tests version 2.17.6 nccl-headers=22501 nccl-library=22501
# Collective test starting: all_reduce_perf
# nThread 1 nGpus 1 minBytes 10737418240 maxBytes 10737418240 step: 1048576(bytes) warmup iters: 1 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid   1946 on inst-gpu-master device  0 [0000:0f:00] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid   1947 on inst-gpu-master device  1 [0000:15:00] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid   1948 on inst-gpu-master device  2 [0000:51:00] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid   1949 on inst-gpu-master device  3 [0000:54:00] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid   1950 on inst-gpu-master device  4 [0000:8d:00] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid   1952 on inst-gpu-master device  5 [0000:92:00] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid   1955 on inst-gpu-master device  6 [0000:d6:00] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid   1958 on inst-gpu-master device  7 [0000:da:00] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw  #wrong     time   algbw   busbw  #wrong 
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)             (us)  (GB/s)  (GB/s)         
 10737418240    2684354560     float     sum      -1  80646.8  133.14  233.00       0  80528.8  133.34  233.34       0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 233.168 
#
# Collective test concluded: all_reduce_perf

$
```

## 3-2. 2ノード16GPU

以下コマンドをマスターノードで起動したコンテナ上のrootユーザで実行し、マスターノードとスレーブノードの全16枚のGPUと全32ポートのRDMAインタフェースを使用する **NCCL** の **All-Reduce** 通信性能を計測します。  
ここで、 **-H** オプションに指定するマスターノード（inst-gpu-master）とスレーブノード（inst-gpu-slave）のホスト名は、自身の環境に合わせて修正します。

```sh
$ cd ~/nccl-tests && mpirun --allow-run-as-root -n 16 -H inst-gpu-master:8,inst-gpu-slave:8 -mca plm_rsh_args "-p 22222" -x NCCL_IB_QPS_PER_CONNECTION=4 -x NCCL_IB_GID_INDEX=3 -x UCX_NET_DEVICES=eth0 -x NCCL_IB_HCA="mlx5_0,mlx5_1,mlx5_2,mlx5_3,mlx5_6,mlx5_7,mlx5_8,mlx5_9,mlx5_10,mlx5_11,mlx5_12,mlx5_13,mlx5_14,mlx5_15,mlx5_16,mlx5_17" ./build/all_reduce_perf -b 10G -e 10G -t 1 -g 1
# nThread 1 nGpus 1 minBytes 10737418240 maxBytes 10737418240 step: 2(factor) warmup iters: 5 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid    417 on inst-gpu-master device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid    418 on inst-gpu-master device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid    419 on inst-gpu-master device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid    420 on inst-gpu-master device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid    421 on inst-gpu-master device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid    422 on inst-gpu-master device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid    425 on inst-gpu-master device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid    429 on inst-gpu-master device  7 [0xda] NVIDIA A100-SXM4-40GB
#  Rank  8 Group  0 Pid    371 on inst-gpu-slave device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  9 Group  0 Pid    372 on inst-gpu-slave device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank 10 Group  0 Pid    373 on inst-gpu-slave device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank 11 Group  0 Pid    374 on inst-gpu-slave device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank 12 Group  0 Pid    375 on inst-gpu-slave device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank 13 Group  0 Pid    376 on inst-gpu-slave device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank 14 Group  0 Pid    377 on inst-gpu-slave device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank 15 Group  0 Pid    380 on inst-gpu-slave device  7 [0xda] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
 10737418240    2684354560     float     sum      -1    90330  118.87  222.88      0    91945  116.78  218.96      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 220.921 
#
$
```
