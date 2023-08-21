---
title: "NCCL Tests実行方法"
excerpt: "本ドキュメントは、AIや機械学習のワークロード実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでGPUワークロード向けベアメタルインスタンスをノード間接続するGPUクラスタで、GPU間通信の集合通信ライブラリNCCLの標準ベンチマークであるNCCL Testsを実行する方法を解説します。"
order: "214"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

本ドキュメントは、AIや機械学習のワークロード実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用の **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** でGPUワークロード向けベアメタルインスタンスをノード間接続するGPUクラスタで、GPU間通信の集合通信ライブラリ **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** の標準ベンチマークである **[NCCL Tests](https://github.com/nvidia/nccl-tests)** を実行する方法を解説します。


***
# 0. 概要

本ドキュメントで解説する **NCCL Tests** の実行は、GPUクラスタ上に **Docker Community Edition** と **[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html)** で構築されたDockerコンテナ実行環境で、 **[NGC Catalog](https://catalog.ngc.nvidia.com/)** から提供される **[TensorFlow NGC Container](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tensorflow)** （本ドキュメントで使用するバージョンは23.06-tf2-py3）を起動し、このコンテナに含まれる **NCCL** （本ドキュメントで使用するバージョンは2.17.1）とコンテナ上でビルドする **NCCL Tests** を使用します。

本ドキュメントで **NCCL Tests** を実行するGPUクラスタは、GPUワークロード向けベアメタルシェイプ **[BM.GPU4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** 2インスタンスを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続した構成とし、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** のカテゴリ **[機械学習環境](/ocitutorials/hpc/#1-2-機械学習環境)** のチュートリアル **[GPUクラスタを構築する(基礎インフラ手動構築編)](/ocitutorials/hpc/spinup-gpu-cluster/)** や **[GPUクラスタを構築する(基礎インフラ自動構築編)](/ocitutorials/hpc/spinup-gpu-cluster-withterraform/)** の手順に従う等により、GPUノード上で **Docker Community Edition** と **NVIDIA Container Toolkit** をインストールしてDockerコンテナからGPUが利用可能な環境を予め用意しておきます。  
GPUノードのOSは、Oracle Linux 7.9ベースの **GPU[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を使用します。

以上より、本ドキュメントで解説する **NCCL Tests** 実行は、以下の手順を経て行います。

- Dockerコンテナ環境構築
- **NCCL Tests** ビルド
- **NCCL Tests** 実行

本ドキュメントは、以下の環境で **NCCL Tests** の **All-Reduce** 通信性能をコンテナ環境から計測し、以下の性能が出ています。

[実行環境]
- シェイプ: **BM.GPU4.8**
- OS: **Oracle Linux** 7.9 (GPU **クラスタネットワーキングイメージ** )
- コンテナランタイム: **Docker Community Edition** 24.0.4
- **NVIDIA Container Toolkit** : バージョン1.14.0
- Dockerコンテナ: **TensorFlow NGC Container** 23.06-tf2-py3
- **NCCL** : バージョン2.17.1
- ノード数: 2
- GPU数: **NVIDIA A100** x 16
- ノード間接続: **クラスタ・ネットワーク** （100 Gbps x 16ポート）
- メッセージサイズ: 10 GiB

[実行結果]
- 帯域（busbw）: 219 GB/s

***
# 1. Dockerコンテナ環境構築

## 1-0. 概要

本章は、後の章で実行する **NCCL Tests** を実行するDockerコンテナに必要な環境構築作業を行います。

**NCCL Tests** は、コンテナを跨るプログラム実行のコントローラとしてMPIを使用します。ここで使用するMPIは、 **TensorFlow NGC Container** に予め含まれる、 **OpenMPI** です。

**OpenMPI** をコンテナ間で実行するためには、MPIプログラムをmpirun等で起動するコンテナ（いわゆるヘッドノード）からMPIプログラム実行に参加する他の全てのコンテナにパスフレーズ無しでSSH接続できる必要があります。

またここで使用する **TensorFlow NGC Container** は、sshdがインストールされていないため、ヘッドノード以外のコンテナでこれをインストールする必要があります。

また **OpenMPI** の実行は、これを実行するコンテナ間で必要なポートにアクセス出来る必要があるため、これを妨げるGPUノード上で動作するファイアーウォールやGPUノードが接続されるサブネットのセキュリティリストを修正する必要があります。

以上より、本章で実施するDockerコンテナ環境構築は、以下の手順を経て行います。

- コンテナ間SSH接続環境構築
- MPI実行を妨げる設定の修正
- Dockerコンテナ起動
- sshdインストール・起動

## 1-1. コンテナ間SSH接続環境構築

以下コマンドを2ノードのGPUノードのうちの1ノード（以降このGPUノードをマスターノード、他のGPUノードをスレーブノードと呼称。）でrootで実行します。

```sh
$ mkdir -p /TF/.ssh
$ chmod 600 /TF/.ssh
$ cd /TF/.ssh
$ ssh-keygen -f ./id_rsa -N ""
$ cp ./id_rsa.pub ./authorized_keys
$ cd /
$ tar -cvf /tmp/TF.tar ./TF
```

次に、マスターノードで作成したtarアーカイブ **/tmp/TF.tar** を全てのスレーブノードの **/tmp** にコピーし、以下コマンドを全てのスレーブノードでrootで実行します。

```sh
$ tar -xvf /tmp/TF.tar -C /
```

## 1-2. MPI実行を妨げる設定の修正

本章は、マスターノードとスレーブノードのコンテナ間でMPI実行を妨げる設定を修正します。

具体的には、以下を実施します。

- 全てのGPUノードの **firewalld** 停止
- GPUノードが接続するサブネットのセキュリティーリストのイングレス・ルールに同サブネットからのアクセスを全て許可

なお、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** のカテゴリ **[機械学習環境](/ocitutorials/hpc/#1-2-機械学習環境)** のチュートリアル **[GPUクラスタを構築する(基礎インフラ手動構築編)](/ocitutorials/hpc/spinup-gpu-cluster/)** や **[GPUクラスタを構築する(基礎インフラ自動構築編)](/ocitutorials/hpc/spinup-gpu-cluster-withterraform/)** の手順に従って構築されたGPUクラスタは、既にこの設定が適用されているため、改めて実施する必要はありません。

## 1-3. Dockerコンテナ起動

本章は、GPUノードでDockerコンテナを起動します。

以下コマンドをマスターノードとスレーブノードのrootユーザでそれぞれ実行し、 **NGC Catalog** から **TensorFlow NGC Container** をプルし起動します。  
なおこのコンテナのサイズが14 GB程度あるため、起動完了まで15分程度を要します。

```sh
$ docker run -it --privileged --rm --gpus all --network=host --ipc=host --ulimit memlock=-1 --ulimit stack=67108864 -v /TF:/root nvcr.io/nvidia/tensorflow:23.06-tf2-py3
```

## 1-4. sshdインストール・起動

本章は、スレーブノードでsshdをインストールし、このsshdをポート番号22222で起動します。

以下コマンドをスレーブノードで起動したコンテナ上のrootユーザで実行し、sshdをインストール・起動します。

```sh
$ apt update
$ apt install -y openssh-server
$ mkdir /run/sshd
$ /usr/sbin/sshd -p 22222
```

次に、以下コマンドをマスターノードで起動したコンテナ上のrootユーザで実行し、スレーブノードにSSH接続できることを確認します。この際、接続を継続するかどうかの問いに **yes** と入力し、 **known_hosts** にスレーブノードのホストキーを登録します。これは、この後のmpirunを実行するために必要です。  
ここで、スレーブノード（inst-swgen-gpu4-ol79）のホスト名は、自身の環境に合わせて修正します。

```sh
$ ssh -p 22222 inst-swgen-gpu4-ol79 hostname
The authenticity of host '[inst-swgen-gpu4-ol79]:22222 ([10.0.2.242]:22222)' cannot be established.
ECDSA key fingerprint is SHA256:KiuvF9QMILkeDOJnr3RFcteAGbTVCkxBZ4gBEJgNqYE.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[inst-swgen-gpu4-ol79]:22222,[10.0.2.242]:22222' (ECDSA) to the list of known hosts.
inst-swgen-gpu4-ol79
```

***
# 2. NCCL Testsビルド

本章は、 **NCCL Tests** プログラムを **GitHub** からダウンロード、ビルドします。

マスターノードとスレーブノードのそれぞれで、起動したコンテナ上のrootユーザで、以下のコマンドを実行します。

```sh
$ cd /root
$ git clone https://github.com/NVIDIA/nccl-tests.git
$ cd nccl-tests
$ make MPI=1 MPI_HOME=/usr/local/mpi CUDA_HOME=/usr/local/cuda NCCL_HOME=/usr/lib/x86_64-linux-gnu
```

***
# 3. NCCL Tests実行

本章は、 **NCCL Tests** プログラムを実行します。

マスターノードで起動したコンテナ上のrootユーザで以下のコマンドを実行し、マスターノードとスレーブノードの全16枚のGPUと全16ポートのRDMAインタフェースを使用した、2ノードのGPUノードに跨る **NCCL** の **All-Reduce** 通信性能を計測します。  
ここで、 **-H** オプションに指定するマスターノード（inst-d5ige-gpu4-ol79）とスレーブノード（inst-swgen-gpu4-ol79）のホスト名は、自身の環境に合わせて修正します。

```sh
$ mpirun --allow-run-as-root -np 16 -H inst-d5ige-gpu4-ol79:8,inst-swgen-gpu4-ol79:8 -mca plm_rsh_args "-p 22222" --mca btl_tcp_if_exclude docker0,lo -x NCCL_IB_QPS_PER_CONNECTION=4 -x NCCL_IB_GID_INDEX=3 -x UCX_NET_DEVICES=enp45s0f0 -x NCCL_IB_HCA="mlx5_0,mlx5_1,mlx5_2,mlx5_3,mlx5_6,mlx5_7,mlx5_8,mlx5_9,mlx5_10,mlx5_11,mlx5_12,mlx5_13,mlx5_14,mlx5_15,mlx5_16,mlx5_17" ./build/all_reduce_perf -b 10G -e 10G -f 2 -t 1 -g 1
# nThread 1 nGpus 1 minBytes 10737418240 maxBytes 10737418240 step: 2(factor) warmup iters: 5 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid    417 on inst-d5ige-comp device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid    418 on inst-d5ige-comp device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid    419 on inst-d5ige-comp device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid    420 on inst-d5ige-comp device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid    421 on inst-d5ige-comp device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid    422 on inst-d5ige-comp device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid    425 on inst-d5ige-comp device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid    429 on inst-d5ige-comp device  7 [0xda] NVIDIA A100-SXM4-40GB
#  Rank  8 Group  0 Pid    371 on inst-swgen-comp device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  9 Group  0 Pid    372 on inst-swgen-comp device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank 10 Group  0 Pid    373 on inst-swgen-comp device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank 11 Group  0 Pid    374 on inst-swgen-comp device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank 12 Group  0 Pid    375 on inst-swgen-comp device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank 13 Group  0 Pid    376 on inst-swgen-comp device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank 14 Group  0 Pid    377 on inst-swgen-comp device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank 15 Group  0 Pid    380 on inst-swgen-comp device  7 [0xda] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
 10737418240    2684354560     float     sum      -1    90330  118.87  222.88      0    91945  116.78  218.96      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 220.921 
#
```
