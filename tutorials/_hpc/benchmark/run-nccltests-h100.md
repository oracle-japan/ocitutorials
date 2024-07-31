---
title: "NCCL Tests実行方法（BM.GPU.H100.8編）"
excerpt: "本ドキュメントは、AIや機械学習のワークロード実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでGPUワークロード向けベアメタルインスタンス（BM.GPU.H100.8）をノード間接続するGPUクラスタで、GPU間通信の集合通信ライブラリNCCLの標準ベンチマークであるNCCL Testsを実行する方法を解説します。"
order: "2141"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

本ドキュメントで解説する **[NCCL Tests](https://github.com/nvidia/nccl-tests)** の実行は、GPUクラスタ上に **Docker Community Edition** と **[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html)** で構築されたコンテナ実行環境で **[TensorFlow NGC Container](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tensorflow)** を起動し、このコンテナに含まれる **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** とコンテナ上でビルドする **NCCL Tests** を使用します。

本ドキュメントで **NCCL Tests** を実行するGPUクラスタは、2インスタンスのGPUワークロード向けベアメタルシェイプ **[BM.GPU.H100.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** を **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続した構成とし、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** のカテゴリ **[機械学習環境](/ocitutorials/hpc/#1-2-機械学習環境)** のチュートリアル **[GPUクラスタを構築する(基礎インフラ手動構築編)](/ocitutorials/hpc/spinup-gpu-cluster/)** や **[GPUクラスタを構築する(基礎インフラ自動構築編)](/ocitutorials/hpc/spinup-gpu-cluster-withterraform/)** の手順に従う等により、 **Docker Community Edition** と **NVIDIA Container Toolkit** を使用してコンテナからGPUが利用可能な環境を予め用意します。

以上より、本ドキュメントで解説する **NCCL Tests** の実行は、以下の手順を経て行います。

1. コンテナ環境構築
2. **NCCL Tests** ビルド
3. **NCCL Tests** 実行

本ドキュメントでは、以下の環境で **NCCL Tests** の **All-Reduce** 通信性能をコンテナ環境から計測し、16 GiBのメッセージサイズで **465 GB/s** の帯域（busbw）性能が出ています。

- シェイプ ： **BM.GPU.H100.8**
- OS ： **Oracle Linux** 8.9ベースのGPU **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※1）
- コンテナランタイム ： **Docker Community Edition** 26.1.3
- **NVIDIA Container Toolkit** ： 1.15.0
- コンテナ ： **TensorFlow NGC Container** 24.06-tf2-py3
- **NCCL** ： 2.21.5（※2）
- MPI ： **[OpenMPI](https://www.open-mpi.org/)** 4.1.7a1（※2）
- ノード数 ： 2
- GPU数 ： **NVIDIA H100 80GB** x 16
- ノード間接続 ： **クラスタ・ネットワーク**

※1）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.7** です。  
※2）使用するコンテナに含まれるものを使用します。

***
# 1. コンテナ環境構築

## 1-0. 概要

本章は、後の章で **NCCL Tests** を実行するコンテナに必要な環境構築作業を行います。

本ドキュメントは、 **NCCL Tests** がコンテナを跨るプログラム実行のコントローラとして **OpenMPI** を使用しますが、このためにはMPIプログラムをmpirun等で起動するコンテナ（いわゆるヘッドノード）からMPIプログラム実行に参加する他の全てのコンテナに対して、パスフレーズ無しでSSH接続できる必要があります。

またここで使用する **TensorFlow NGC Container** は、sshdがインストールされていないため、ヘッドノード以外のコンテナでこれをインストールする必要があります。

また **OpenMPI** の実行は、これを実行するコンテナ間で必要なポートにアクセス出来る必要があるため、これを妨げるGPUノード上で動作するファイアーウォールやGPUノードが接続されるサブネットのセキュリティリストを修正する必要があります。

以上より、本章で実施するコンテナ環境構築は、以下の手順を経て行います。

1. コンテナ間SSH接続環境構築
2. MPI実行を妨げる設定の修正
3. コンテナ起動
4. sshdインストール・起動

## 1-1. コンテナ間SSH接続環境構築

以下コマンドを2ノードのGPUノードのうち1ノード（以降このGPUノードをマスターノード、他のGPUノードをスレーブノードと呼称。）のopcユーザで実行します。

```sh
$ sudo mkdir -p /TF/.ssh && sudo chmod 600 /TF/.ssh
$ sudo ssh-keygen -f /TF/.ssh/id_rsa -N ""
$ sudo cp /TF/.ssh/id_rsa.pub /TF/.ssh/authorized_keys
$ cd / && sudo tar -cvf /tmp/TF.tar ./TF
```

次に、マスターノードで作成したtarアーカイブ **/tmp/TF.tar** を全てのスレーブノードの **/tmp** にコピーし、以下コマンドを全てのスレーブノードのopcユーザで実行します。

```sh
$ sudo tar -xvf /tmp/TF.tar -C /
```

## 1-2. MPI実行を妨げる設定の修正

本章は、マスターノードとスレーブノードのコンテナ間でMPI実行を妨げる設定を修正します。

具体的には、以下を実施します。

- 全てのGPUノードの **firewalld** 停止
- GPUノードが接続するサブネットのセキュリティーリストのイングレス・ルールに同サブネットからのアクセスを全て許可

なお、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** のカテゴリ **[機械学習環境](/ocitutorials/hpc/#1-2-機械学習環境)** のチュートリアル **[GPUクラスタを構築する(基礎インフラ手動構築編)](/ocitutorials/hpc/spinup-gpu-cluster/)** や **[GPUクラスタを構築する(基礎インフラ自動構築編)](/ocitutorials/hpc/spinup-gpu-cluster-withterraform/)** の手順に従って構築されたGPUクラスタは、既にこの設定が適用されているため、改めて実施する必要はありません。

## 1-3. コンテナ起動

本章は、GPUノードでコンテナを起動します。

以下コマンドをマスターノードとスレーブノードのopcユーザでそれぞれ実行し、 **NGC Catalog** から **TensorFlow NGC Container** をプルし起動します。  
なおこのコンテナのサイズが14 GB程度あるため、起動完了まで10分程度を要します。

```sh
$ sudo docker run -it --privileged --rm --gpus all --network=host --ipc=host --ulimit memlock=-1 --ulimit stack=67108864 -v /TF:/root nvcr.io/nvidia/tensorflow:24.06-tf2-py3
```

## 1-4. sshdインストール・起動

本章は、スレーブノードでsshdをインストールし、このsshdをポート番号22222で起動します。

以下コマンドをスレーブノードで起動したコンテナ上のrootユーザで実行し、sshdをインストール・起動します。

```sh
$ apt update
$ apt install -y openssh-server
$ mkdir /run/sshd && /usr/sbin/sshd -p 22222
```

次に、以下コマンドをマスターノードで起動したコンテナ上のrootユーザで実行し、スレーブノードにSSH接続できることを確認します。  
ここで、スレーブノード（inst-yyyyy-h100-ol89）のホスト名は、自身の環境に合わせて修正します。

```sh
$ ssh -p 22222 -oStrictHostKeyChecking=accept-new inst-yyyyy-h100-ol89 hostname
Warning: Permanently added '[inst-yyyyy-h100-ol89]:22222' (ED25519) to the list of known hosts.
inst-yyyyy-h100-ol89
$
```

***
# 2. NCCL Testsビルド

本章は、 **NCCL Tests** をビルドします。

以下コマンドをマスターノードとスレーブノードで起動したコンテナ上のrootユーザで実行し、 **NCCL Tests** を **GitHub** からダウンロードしてビルドします。

```sh
$ cd /root && git clone https://github.com/NVIDIA/nccl-tests.git
$ cd nccl-tests && make MPI=1 MPI_HOME=/usr/local/mpi CUDA_HOME=/usr/local/cuda NCCL_HOME=/usr/lib/x86_64-linux-gnu
```

***
# 3. NCCL Tests実行

本章は、 **NCCL Tests** を実行します。

以下コマンドをマスターノードで起動したコンテナ上のrootユーザで実行し、マスターノードとスレーブノードの全16枚のGPUと全16ポートのRDMAインタフェースを使用した、2ノードのGPUノードに跨る **NCCL** の **All-Reduce** 通信性能を計測します。  
ここで、 **-H** オプションに指定するマスターノード（inst-xxxxx-h100-ol89）とスレーブノード（inst-yyyyy-h100-ol89）のホスト名は、自身の環境に合わせて修正します。

```sh
$ mpirun --allow-run-as-root -n 16 -H inst-xxxxx-h100-ol89:8,inst-yyyyy-h100-ol89:8 -mca plm_rsh_args "-p 22222" --mca btl_tcp_if_exclude docker0,lo --bind-to numa -x NCCL_CUMEM_ENABLE=0 -x NCCL_IB_SPLIT_DATA_ON_QPS=0 -x NCCL_IB_GID_INDEX=3 -x NCCL_IB_TC=41 -x NCCL_NET_PLUGIN=none -x NCCL_IGNORE_CPU_AFFINITY=1 -x NCCL_SOCKET_IFNAME=eth0 -x UCX_NET_DEVICES=eth0 -x NCCL_IB_HCA="=mlx5_0,mlx5_1,mlx5_3,mlx5_4,mlx5_5,mlx5_6,mlx5_7,mlx5_8,mlx5_9,mlx5_10,mlx5_12,mlx5_13,mlx5_14,mlx5_15,mlx5_16,mlx5_17" ./build/all_reduce_perf -b 1G -e 16G -f 2
# nThread 1 nGpus 1 minBytes 1073741824 maxBytes 17179869184 step: 2(factor) warmup iters: 5 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid   1274 on inst-xxxxx-h100-ol89 device  0 [0x0f] NVIDIA H100 80GB HBM3
#  Rank  1 Group  0 Pid   1275 on inst-xxxxx-h100-ol89 device  1 [0x2d] NVIDIA H100 80GB HBM3
#  Rank  2 Group  0 Pid   1276 on inst-xxxxx-h100-ol89 device  2 [0x44] NVIDIA H100 80GB HBM3
#  Rank  3 Group  0 Pid   1277 on inst-xxxxx-h100-ol89 device  3 [0x5b] NVIDIA H100 80GB HBM3
#  Rank  4 Group  0 Pid   1278 on inst-xxxxx-h100-ol89 device  4 [0x89] NVIDIA H100 80GB HBM3
#  Rank  5 Group  0 Pid   1279 on inst-xxxxx-h100-ol89 device  5 [0xa8] NVIDIA H100 80GB HBM3
#  Rank  6 Group  0 Pid   1280 on inst-xxxxx-h100-ol89 device  6 [0xc0] NVIDIA H100 80GB HBM3
#  Rank  7 Group  0 Pid   1281 on inst-xxxxx-h100-ol89 device  7 [0xd8] NVIDIA H100 80GB HBM3
#  Rank  8 Group  0 Pid   2315 on inst-yyyyy-h100-ol89 device  0 [0x0f] NVIDIA H100 80GB HBM3
#  Rank  9 Group  0 Pid   2316 on inst-yyyyy-h100-ol89 device  1 [0x2d] NVIDIA H100 80GB HBM3
#  Rank 10 Group  0 Pid   2317 on inst-yyyyy-h100-ol89 device  2 [0x44] NVIDIA H100 80GB HBM3
#  Rank 11 Group  0 Pid   2318 on inst-yyyyy-h100-ol89 device  3 [0x5b] NVIDIA H100 80GB HBM3
#  Rank 12 Group  0 Pid   2319 on inst-yyyyy-h100-ol89 device  4 [0x89] NVIDIA H100 80GB HBM3
#  Rank 13 Group  0 Pid   2320 on inst-yyyyy-h100-ol89 device  5 [0xa8] NVIDIA H100 80GB HBM3
#  Rank 14 Group  0 Pid   2321 on inst-yyyyy-h100-ol89 device  6 [0xc0] NVIDIA H100 80GB HBM3
#  Rank 15 Group  0 Pid   2322 on inst-yyyyy-h100-ol89 device  7 [0xd8] NVIDIA H100 80GB HBM3
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
  1073741824     268435456     float     sum      -1   4511.2  238.02  446.28      0   4520.9  237.50  445.32      0
  2147483648     536870912     float     sum      -1   8825.9  243.31  456.22      0   8827.8  243.26  456.12      0
  4294967296    1073741824     float     sum      -1    17437  246.31  461.83      0    17446  246.18  461.60      0
  8589934592    2147483648     float     sum      -1    34719  247.41  463.90      0    34720  247.41  463.89      0
 17179869184    4294967296     float     sum      -1    69338  247.77  464.57      0    69305  247.89  464.79      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 458.452 
#
$
```
