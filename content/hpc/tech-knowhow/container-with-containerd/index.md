---
title: "containerdによるコンテナ実行環境構築方法"
description: "機械学習ワークロードのためのコンテナ実行環境は、そのコンテナランタイムにいくつかの選択肢がありますが、コンテナ実行機能に特化した軽量・低オーバーヘッドの特徴とKubernetesとの高い親和性から、containerdが現在人気を集めています。またcontainerdは、他のオープンソースのツール群と組み合わせることで、rootlessコンテナやDocker互換CLIによるコンテナライフサイクル管理が可能となり、自身の要件に合わせた機能拡張が可能です。本テクニカルTipsは、NGC Catalog等から提供される既存の機械学習ワークロード向けコンテナの実行環境を念頭に、GPU搭載インスタンス上にcontainerdと関連するソフトウェア群をインストール・セットアップし、コンテナ実行環境を構築する方法を解説します。"
weight: "342"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

# 0. 概要

**[containerd](https://github.com/containerd/containerd/tree/main)** は、高レベルコンテナランタイムという位置付けのため、以下のオープンソースのツール群と組み合わせて使用することで、rootlessコンテナやDocker互換CLIによるコンテナライフサイクル管理を含めたコンテナランタイムとしての機能を実現します。

- 低レベルコンテナランタイム： **[runc](https://github.com/opencontainers/runc)**
- ネットワーク機能： **[CNI Plugins](https://github.com/containernetworking/plugins/)**
- Docker互換CLI： **[nerdctl](https://github.com/containerd/nerdctl)**
- rootlessコンテナ： **[rootlesskit](https://github.com/rootless-containers/rootlesskit)**

本テクニカルTipsは、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** のカテゴリ **[機械学習環境](../../#1-2-機械学習環境)** のチュートリアル **[GPUインスタンスで分散機械学習環境を構築する](../../spinup-ml-instance-cntnd/)** / **[GPUクラスタを構築する(基礎インフラ手動構築編)](../../spinup-gpu-cluste/)** / **[GPUクラスタを構築する(基礎インフラ自動構築編)](../../spinup-gpu-cluster-withterraform/)** の手順に従う等により、NVIDIA GPUを搭載するGPUインスタンスが予め利用可能であることを前提に、ここに **containerd** と前述のソフトウェア群をインストールして **[NGC Catalog](https://catalog.ngc.nvidia.com/)** から提供されるコンテナを非特権ユーザ（以降"コンテナ起動ユーザ"と呼称します。）権限で起動するまでの手順を、以下の順に解説します。

1. **[コンテナ環境構築](#1-コンテナ環境構築)**
2. **[コンテナ起動ユーザ作成](#2-コンテナ起動ユーザ作成)**
3. **[コンテナ起動・稼働確認](#3-コンテナ起動稼働確認)**

本テクニカルTipsは、以下のソフトウェアバージョンを前提とします。

- **イメージ** ：  
**[プラットフォーム・イメージ](../../#5-17-プラットフォームイメージ)** **[Oracle-Linux-8.10-Gen2-GPU-2025.09.16-0](https://docs.oracle.com/en-us/iaas/images/oracle-linux-8x/oracle-linux-8-10-gen2-gpu-2025-09-16-0.htm)** /  
**[プラットフォーム・イメージ](../../#5-17-プラットフォームイメージ)** **[Oracle-Linux-9.6-Gen2-GPU-2025.08.31-0](https://docs.oracle.com/en-us/iaas/images/oracle-linux-9x/oracle-linux-9-6-gen2-gpu-2025-08-31-0.htm)** /  
**Oracle Linux** 9.5ベースのGPU **[クラスタネットワーキングイメージ](../#5-13-クラスタネットワーキングイメージ)** （※1）
- **[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html)** ： 1.18.0
- **containerd** ： 2.2.0
- **runc** ： 1.3.3
- **CNI Plugins** ： 1.8.0
- **nerdctl** ： 2.2.0
- **rootlesskit** ： 2.3.5

※1） **[OCI HPCテクニカルTips集](../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.15** です。  

# 1. コンテナ環境構築

## 1-0. 概要

本章は、GPUインスタンスに以下のコンテナ関連ソフトウェアとその前提rpmパッケージをインストールします。

- **NVIDIA Container Toolkit**
- **containerd**
- **runc**
- **CNI Plugins**
- **nerdctl**
- **rootlesskit**

## 1-1. インストール手順

以下コマンドをGPUインスタンスのopcユーザで実行し、 **containerd** をインストールします。

```sh
$ mkdir ~/`hostname` && cd ~/`hostname` && wget https://github.com/containerd/containerd/releases/download/v2.2.0/containerd-2.2.0-linux-amd64.tar.gz
$ sudo tar -C /usr/local -xvf ./containerd-2.2.0-linux-amd64.tar.gz
$ sudo wget -P /usr/lib/systemd/system/ https://raw.githubusercontent.com/containerd/containerd/main/containerd.service
$ sudo systemctl daemon-reload
```

次に、以下コマンドをGPUインスタンスのopcユーザで実行し、 **runc** をインストールします。

```sh
$ wget https://github.com/opencontainers/runc/releases/download/v1.3.3/runc.amd64
$ sudo install -m 755 ./runc.amd64 /usr/local/sbin/runc
```

次に、以下コマンドをGPUインスタンスのopcユーザで実行し、 **CNI Plugins** をインストールします。

```sh
$ wget https://github.com/containernetworking/plugins/releases/download/v1.8.0/cni-plugins-linux-amd64-v1.8.0.tgz
$ sudo mkdir -p /opt/cni/bin && sudo tar -C /opt/cni/bin -xvf ./cni-plugins-linux-amd64-v1.8.0.tgz
```

次に、以下コマンドをGPUインスタンスのopcユーザで実行し、 **nerdctl** をインストールします。

```sh
$ wget https://github.com/containerd/nerdctl/releases/download/v2.2.0/nerdctl-2.2.0-linux-amd64.tar.gz
$ sudo tar -C /usr/local/bin/ -xvf ./nerdctl-2.2.0-linux-amd64.tar.gz
```

次に、以下コマンドをGPUインスタンスのopcユーザで実行し、 **NVIDIA Container Toolkit** をインストールします。

```sh
$ sudo dnf install -y nvidia-container-toolkit
```

次に、以下コマンドをGPUインスタンスのopcユーザで実行し、 **rootlesskit** とその前提rpmをインストールします。

```sh
$ sudo dnf install -y slirp4netns libseccomp libseccomp-devel
$ wget https://github.com/rootless-containers/rootlesskit/releases/download/v2.3.5/rootlesskit-x86_64.tar.gz
$ sudo tar -C /usr/local/bin/ -xvf ./rootlesskit-x86_64.tar.gz
$ sudo mkdir -p /etc/systemd/system/user@.service.d
$ cat <<EOF | sudo tee /etc/systemd/system/user@.service.d/delegate.conf
> [Service]
> Delegate=cpu cpuset io memory pids
> EOF
$ sudo systemctl daemon-reload
```

# 2. コンテナ起動ユーザ作成

本章は、コンテナ起動ユーザを作成し、このユーザでコンテナを起動するための必要な設定を行います。

以下コマンドをGPUインスタンスのopcユーザで実行し、コンテナ起動ユーザ（ここでは **usera** とします。）を作成します。

```sh
$ sudo useradd -d /home/usera -s /bin/bash -u 10000 usera
```

次に、以下コマンドをGPUインスタンスのopcユーザで実行し、コンテナ起動ユーザのコンテナイメージ等のファイルを格納するディレクトリをNVMe SSDローカルディスク領域（ **/mnt/localdisk** にマウントされているとします。）に作成します。

```sh
$ sudo mkdir -p /mnt/localdisk/usera/root /mnt/localdisk/usera/state && sudo chown -R usera:usera /mnt/localdisk/usera
```

次に、BastionノードからSSHでGPUインスタンスにコンテナ起動ユーザでログインして以下コマンドを実行し、コンテナイメージ等のファイルを格納するディレクトリを登録します。

```sh
$ mkdir -p ~/.config/containerd
$ cat << EOF > ~/.config/containerd/config.toml
> root = "/mnt/localdisk/usera/root"
> state = "/mnt/localdisk/usera/state"
> EOF
$ cat ~/.config/containerd/config.toml
root = "/mnt/localdisk/usera/root"
state = "/mnt/localdisk/usera/state"
```

# 3. コンテナ起動・稼働確認

## 3-0. 概要

本章は、コンテナ起動ユーザで **NGC Catalog** から提供されるコンテナを起動し、コンテナ上で以下を確認します。

- GPUの認識
- 異なるGPUインスタンスで起動するコンテナ間のネットワーク疎通（GPUクラスタの場合のみ実施します。）

## 3-1. コンテナ起動

BastionノードからSSHでGPUインスタンスにコンテナ起動ユーザでログインして以下コマンドを実行し、 **containerd** を起動・確認します。

```sh
$ containerd-rootless-setuptool.sh install
[INFO] Checking RootlessKit functionality
:
:
:
[INFO] You do NOT need to specify $CONTAINERD_ADDRESS explicitly.
$ systemctl --user status containerd | grep -e Active -e enabled
   Loaded: loaded (/home/usera/.config/systemd/user/containerd.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2025-03-19 10:38:54 JST; 1min 39s ago
$
```

次に、以下コマンドをGPUインスタンスのコンテナ起動ユーザで実行し、 **NGC Catalog** から提供される **Ubuntu** コンテナを起動します。

```sh
$ nerdctl run -it --rm --network=host --gpus all -p 22222:22 nvcr.io/nvidia/base/ubuntu:22.04_20240212
```

## 3-2. 稼働確認

以下コマンドをGPUインスタンスで起動したコンテナ上のrootユーザで実行し、GPUインスタンスに搭載されるGPUをコンテナから認識出来ることを確認します。

```sh
$ nvidia-smi
Fri Nov  7 00:05:31 2025       
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 570.172.08             Driver Version: 570.172.08     CUDA Version: 12.8     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA A100-SXM4-40GB          Off |   00000000:0F:00.0 Off |                    0 |
| N/A   36C    P0             75W /  400W |       0MiB /  40960MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   1  NVIDIA A100-SXM4-40GB          Off |   00000000:15:00.0 Off |                    0 |
| N/A   34C    P0             77W /  400W |       0MiB /  40960MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   2  NVIDIA A100-SXM4-40GB          Off |   00000000:51:00.0 Off |                    0 |
| N/A   34C    P0             75W /  400W |       0MiB /  40960MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   3  NVIDIA A100-SXM4-40GB          Off |   00000000:54:00.0 Off |                    0 |
| N/A   36C    P0             79W /  400W |       0MiB /  40960MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   4  NVIDIA A100-SXM4-40GB          Off |   00000000:8D:00.0 Off |                    0 |
| N/A   35C    P0             74W /  400W |       0MiB /  40960MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   5  NVIDIA A100-SXM4-40GB          Off |   00000000:92:00.0 Off |                    0 |
| N/A   34C    P0             73W /  400W |       0MiB /  40960MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   6  NVIDIA A100-SXM4-40GB          Off |   00000000:D6:00.0 Off |                    0 |
| N/A   34C    P0             73W /  400W |       0MiB /  40960MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
|   7  NVIDIA A100-SXM4-40GB          Off |   00000000:DA:00.0 Off |                    0 |
| N/A   37C    P0             82W /  400W |       0MiB /  40960MiB |      0%      Default |
|                                         |                        |             Disabled |
+-----------------------------------------+------------------------+----------------------+
                                                                                         
+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
$
```

次に、以下コマンドをいずれかのGPUインスタンス（以降マスターノードと呼称します。）で起動したコンテナ上のrootユーザで実行し、コンテナ間のネットワーク疎通を確認します。  
なお、pingコマンドで指定するホスト名は、自身の環境のリモートのGPUインスタンス（以降スレーブノードと呼称します。）のホスト名に置き換えます。

```sh
$ apt update
$ apt install -y iputils-ping
$ ping inst-gpu-slave
```

次に、以下コマンドをスレーブノードで起動したコンテナ上のrootユーザで実行し、SSHサーバを起動します。

```sh
$ apt install -y openssh-server
$ mkdir /run/sshd && /usr/sbin/sshd -p 22222
```

次に、以下コマンドをマスターノードで起動したコンテナ上のrootユーザで実行し、SSHの鍵ペアを作成します。

```sh
$ apt update
$ apt install -y openssh-server
$ mkdir -p ~/.ssh && chmod 700 ~/.ssh
$ ssh-keygen -f ~/.ssh/id_rsa -N ""
```

次に、以下コマンドをスレーブノードで起動したコンテナ上のrootユーザで実行し、先にマスターノードで作成したSSHの公開鍵（ **id_rsa.pub** ）を **/root/.ssh/authorized_keys** に登録します。  
なお、以下で指定する公開鍵は、自身が作成したものに置き換えます。

```sh
$ mkdir -p ~/.ssh && chmod 700 ~/.ssh
$ cat << EOF >> ~/.ssh/authorized_keys
> ssh-rsa xxxx root@inst-gpu-master
> EOF
$ chmod 600 ~/.ssh/authorized_keys
```

次に、以下コマンドをマスターノードで起動したコンテナ上のrootユーザで実行し、スレーブノードにSSH接続できることを確認します。  
なお、sshコマンドで指定するホスト名は、自身の環境のスレーブノードのホスト名に置き換えます。

```sh
$ ssh -p 22222 -oStrictHostKeyChecking=accept-new inst-gpu-slave hostname
Warning: Permanently added '[inst-vm-ol905mg-2]:22222' (ED25519) to the list of known hosts.
inst-gpu-slave
$
```

