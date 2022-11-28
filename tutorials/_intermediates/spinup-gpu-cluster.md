---
title: "GPUクラスタを構築する"
excerpt: "GPUクラスタを構築してみましょう。このチュートリアルを終了すると、OCIが提供するGPUクラスタのノード間接続に最適なインターコネクトネットワークであるクラスタ・ネットワークをデプロイし、ベアメタルGPUインスタンスをこのクラスタ・ネットワークに接続してRDMA対応RoCEv2を使用した高速・低レイテンシにノード間通信を行うGPUクラスタ環境を、OCIコンソールから構築することが出来るようになります。"
order: "100"
layout: single
header:
  teaser: "/intermediates/spinup-gpu-cluster/architecture_diagram.png"
  overlay_image: "/intermediates/spinup-gpu-cluster/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

Oracle Cloud Infrastructure（以降OCIと記載）は、以下のサービスを提供することから、1ノードには搭載しきれない多数のGPUを必要とする大規模なAIや機械学習のワークロードを実行する、GPUクラスタを構築するには最適なクラウドサービスです。
- RoCE v2採用の高帯域・低レイテンシRDMAインターコネクト（MPI通信で最大12GB/sの帯域幅と最小1.5μsのレイテンシ）の **クラスタ・ネットワーク**
- 8枚のNVIDIA A100 40 GBと総帯域幅1.6 Tbps（100 Gbps x 16）のRDMA対応ネットワークインタフェースを搭載するベアメタルGPUシェイプ **BM.GPU4.8**

このチュートリアルは、AIや機械学習ワークロードに最適なNVIDIA A100 40 GBを搭載するGPUノード（ **[BM.GPU4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** ）をクラスタ・ネットワークを使用してノード間接続し、1ノードでは搭載しきれないGPUを必要とする大規模なAI・機械学習ワークロードを実行するためのGPUクラスタを構築、このGPUクラスタ上で分散機械学習フレームワークである **[Horovod](https://horovod.readthedocs.io/en/stable/)** 用のDockerコンテナで複数ノードに跨るGPUを使用する分散機械学習環境を構築、GPU間の通信性能を **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** テストプログラム（ **[NCCL Tests](https://github.com/nvidia/nccl-tests)** ）で検証後、Horovodがサンプルプログラムとして用意するResNet50ベンチマークプログラムを実行、その性能を検証します。

このチュートリアルで作成する環境は、ユーザ管理、ホスト名管理、ファイル共有、プログラム開発環境、コンテナオーケストレーション等、必要なソフトウェア環境をこの上に整備し、ご自身の要件に沿ったGPUクラスタを構築する際の基礎インフラストラクチャとして利用することが可能です。
なおOCIでは、これらのクラスタ管理に必要なソフトウェアの導入までを自動化するOCIのリソース・マネージャを使用したHPC（GPU）クラスタ構築自動化ソリューションも利用可能です。この詳細は、本チュートリアルの姉妹編である **[HPCクラスタを構築する](https://oracle-japan.github.io/ocitutorials/intermediates/spinup-hpc-cluster)** を参照ください。

![システム構成図](architecture_diagram.png)

**所要時間 :** 約2時間

**前提条件 :** GPUクラスタを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。

**注意 :** チュートリアル内の画面ショットについては、OCIの現在のコンソール画面と異なっている場合があります。

# 0. GPUクラスタ作成事前作業

## 0-0. GPUクラスタ作成事前作業概要

GPUノードを高速・低レイテンシでノード間接続するOCIのクラスタ・ネットワークは、これに接続するGPUノードと共に作成します。

このため、このGPUノードをTCP接続するVCNと、インターネットから直接アクセス出来ないプライベートサブネットに通常接続されるGPUノードにログインする際の踏み台となるbastionノードを、GPUノードやクラスタ・ネットワークを作成する前に予め作成しておく必要があります。

本章は、これらの前提となるリソースを作成します。

## 0-1. VCN作成

本章は、GPUノードをTCP接続するVCNを作成します。
VCNの作成は、以下チュートリアルページ **クラウドに仮想ネットワーク(VCN)を作る** の手順通りに実行し、

[https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn](https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn)

以下のリソースを作成します。

- VCN（10.0.0.0/16）
- パブリックサブネット（10.0.0.0/24）
- プライベートサブネット（10.0.1.0/24）
- インターネット・ゲートウェイ（パブリックサブネットにアタッチ）
- NATゲートウェイ（プライベートサブネットにアタッチ）
- サービス・ゲートウェイ（プライベートサブネットにアタッチ）
- ルート表 x 2（パブリックサブネットとプライベートサブネットにアタッチ）
- セキュリティリスト x 2（パブリックサブネットとプライベートサブネットにアタッチ）

このVCNは、セキュリティリストで以下のアクセス制限が掛けられています。

- インターネットからのアクセス：パブリックサブネットに接続されるインスタンスの22番ポート（SSH）に限定
- インターネットへのアクセス：インターネット上の任意のIPアドレス・ポートに制限なくアクセス可能

## 0-2. bastionノード作成
本章は、GPUノードにログインする際の踏み台となるbastinノードを作成します。
bastionノードの作成は、以下チュートリアルページ **インスタンスを作成する** の手順を参考に、

[https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)

ご自身の要件に沿ったインスタンスを、先の手順で作成したVCNとパブリックサブネットを指定して作成します。本チュートリアルは、以下属性のインスタンスをbastionノードとして作成します。

- **イメージ　:** Oracle Linux 7.9
- **シェイプ　:** VM.Optimized3.Flex（1 OCPU）
- **SSHキーの追加　:** bastionノードにログインする際使用するSSH秘密鍵に対応する公開鍵

次に、このbastionノード上でSSHの鍵ペアを作成します。このSSH鍵は、bastionノードからGPUノードにログインする際に使用します。
先のチュートリアル **インスタンスを作成する** に記載のインスタンスへの接続方法に従いbastionノードにopcユーザでSSHログインし、以下のコマンドでSSH鍵ペアを作成、作成された公開鍵を後のクラスタ・ネットワーク作成手順で指定します。

```sh
> ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/opc/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/opc/.ssh/id_rsa.
Your public key has been saved in /home/opc/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:Ska1aH1fQkN+Ahzi6xnqICSEHN8HUKDlujhEagu2Uc8 opc@bastion
The keys randomart image is:
+---[RSA 2048]----+
| . ++o  o.oo+    |
|o * . .= o.+ .   |
|.= + .+.+ . + o  |
|+ o oo.  o . =   |
|+*.  Eo S   .    |
|*o=  o + o       |
|o+. . o o        |
| . . o           |
|      .          |
+----[SHA256]-----+
> cat .ssh/id_rsa.pub 
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC7Lna2m3TPiPKL/lHNK4GK2bkADRzm4674uwO9PHUqEPKVv+HBhTZ+zHOPSkYsOEubgeB9xpuKe+Z7ats0RbdXzT1bDWxcsvrMOdUVHQ9zv54eBSz+wEJO08zuxCjetQ2//6NRlYzoBs5/T1+DWg7lJuNadeyqXf1IaZGxRyfbCyXPzOnhL3TS/S7ydN0/313PsqAYj7PBNlx86WT/0qeNYsefjVmn54PKp1waNDQbOkiXi9Emx9uIKA1TCMCVSauZEI274P6orPvwggbX/HZ5Q8eRta2uw3LmzSRJUlrLBxi5xzhVOSNOXl29y2+U5+Q5/F2AxGSxUbW18AdOihuX opc@bastion
```

次に、以降作成するGPUノードのDNS名前解決をイニシャルホスト名で行えるようにするため、/etc/resolv.confファイルのsearch行に、先に作成したプライベートサブネットのDNSドメイン名を以下のように追加します。

```sh
> diff /etc/resolv.conf_org /etc/resolv.conf
7c7
< search vcn.oraclevcn.com sub11010929110.vcn.oraclevcn.com
---
> search vcn.oraclevcn.com sub11010929110.vcn.oraclevcn.com sub11010929111.vcn.oraclevcn.com
```

なおプライベートサブネットのDNSドメイン名は、OCIコンソール上で当該プライベートサブネットの **サブネット詳細** メニューから、以下のように確認することが出来ます。

![画面ショット](console_page20.png)

この修正は、このままではOS再起動により元に戻ってしまうため、以下のコマンドでこの修正が上書きされないようにします。

```sh
> sudo chattr -R +i /etc/resolv.conf
```

# 1. GPUクラスタ作成

## 1-0. GPUクラスタ作成概要

GPUノードのインターコネクトネットワークに使用するクラスタ・ネットワークは、その下層にOCIのインスタンス・プールを使用し、インスタンス・プールが持つ同一イメージのインスタンスを複製する機能により、クラスタ・ネットワークに接続するGPUノードを指定ノード数デプロイします。

またインスタンス・プールは、その下層にOCIのインスタンス構成を使用し、インスタンス構成に指定した属性を持つインスタンスを複製します。

クラスタ・ネットワークに接続するGPUノードは、OS（Oracle Linux 7.9）起動時点でクラスタ・ネットワークに接続するRDMAインタフェースが作成されていないため、デプロイ後の最初のOS起動時のみ実行されるOCIのcloud-initを利用して、この作成を行います。また本チュートリアルは、GPUノードに使用するBM.GPU4.8に装備されるNVMeローカルディスクのファイルシステム作成も、このcloud-initから行います。

以上より、GPUクラスタの作成は、以下の手順を経て行います。

- cloud-init設定ファイル作成
- インスタンス構成作成
- クラスタ・ネットワーク作成

なおインスタンス・プールは、クラスタ・ネットワークを作成することで自動的に作成されるため、改めて作成する必要はありません。

本チュートリアルは、2ノードのBM.GPU4.8を使用してGPUクラスタを構築します。

## 1-1. cloud-init設定ファイル作成

本章は、cloud-init設定ファイルを作成します。

cloud-initは、主要なクラウドサービスプロバイダーで利用可能なインスタンス初期化のための仕組みで、cloud-initが用意する文法に沿った設定ファイルを作成しこれを指定することで、インスタンスデプロイ後に必要な様々なOSレベルのカスタマイズを適用することが可能になります。

本チュートリアルは、このcloud-initを以下の目的で使用します。

- Docker Community Editionインストール
- NVIDIA Container Toolkitインストール
- NVMeローカルディスクファイルシステム作成
- firewalld停止
- RDMAインタフェース作成
- Horovod Dockerイメージプル

以下は、本チュートリアルで使用するBM.GPU4.8用のcloud-init設定ファイルで、OCIコンソールを実行している端末上にテキストファイルで保存します。

```sh
#cloud-config
yum_repos:
# To install docker community edition
  ol7_developer:
    name: Oracle Linux $releasever Development Packages ($basearch)
    baseurl: https://yum$ociregion.$ocidomain/repo/OracleLinux/OL7/developer/$basearch/
    enabled: true
    gpgcheck: true
    gpgkey: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
  docker-ce-stable:
    name: Docker CE Stable - $basearch
    baseurl: https://download.docker.com/linux/centos/$releasever/$basearch/stable
    enabled: true
    gpgcheck: true
    gpgkey: https://download.docker.com/linux/centos/gpg
# To install NVIDIA container
  libnvidia-container:
    name: libnvidia-container
    baseurl: https://nvidia.github.io/libnvidia-container/stable/centos7/$basearch
    enabled: true
    gpgcheck: true
    gpgkey: https://nvidia.github.io/libnvidia-container/gpgkey
  libnvidia-container-experimental:
    name: libnvidia-container-experimental
    baseurl: https://nvidia.github.io/libnvidia-container/experimental/centos7/$basearch
    enabled: true
    gpgcheck: true
    gpgkey: https://nvidia.github.io/libnvidia-container/gpgkey
packages:
# Install Docker community edition and NVIDIA container toolkit
  - docker-ce
  - nvidia-container-toolkit
runcmd:
# NVMe local storage setting
  - vgcreate nvme /dev/nvme0n1 /dev/nvme1n1 /dev/nvme2n1 /dev/nvme3n1
  - lvcreate -l 100%FREE nvme
  - mkfs.xfs -L localscratch /dev/nvme/lvol0
  - mkdir -p /mnt/localdisk
  - echo "LABEL=localscratch /mnt/localdisk/ xfs defaults,noatime 0 0" >> /etc/fstab
  - mount /mnt/localdisk
# Stop firewalld
  - systemctl stop firewalld
  - systemctl disable firewalld
# Set up RDMA interface
  - echo "TYPE=\"Ethernet\"" > /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "BOOTPROTO=\"none\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "IPADDR=192.168.0.`ifconfig enp45s0f0 | head -2 | tail -1 | awk '{print $2}' | awk -F. '{print $4}'`" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "NETMASK=255.255.255.0" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "DEFROUTE=\"no\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "PEERDNS=\"no\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "PEERROUTES=\"no\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "IPV4_FAILURE_FATAL=\"no\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "IPV6INIT=\"no\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "IPV6_FAILURE_FATAL=\"no\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "NAME=\"System enp12s0f0\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "DEVICE=\"enp12s0f0\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "ONBOOT=\"yes\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - echo "NM_CONTROLLED=\"no\"" >> /etc/sysconfig/network-scripts/ifcfg-enp12s0f0
  - ifup enp12s0f0
  - sed 's/192.168.0/192.168.1/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp12s0f1
  - sed -i 's/enp12s0f0/enp12s0f1/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f1
  - ifup enp12s0f1
  - sed 's/192.168.0/192.168.2/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp22s0f0
  - sed -i 's/enp12s0f0/enp22s0f0/g' /etc/sysconfig/network-scripts/ifcfg-enp22s0f0
  - ifup enp22s0f0
  - sed 's/192.168.0/192.168.3/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp22s0f1
  - sed -i 's/enp12s0f0/enp22s0f1/g' /etc/sysconfig/network-scripts/ifcfg-enp22s0f1
  - ifup enp22s0f1
  - sed 's/192.168.0/192.168.4/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp72s0f0
  - sed -i 's/enp12s0f0/enp72s0f0/g' /etc/sysconfig/network-scripts/ifcfg-enp72s0f0
  - ifup enp72s0f0
  - sed 's/192.168.0/192.168.5/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp72s0f1
  - sed -i 's/enp12s0f0/enp72s0f1/g' /etc/sysconfig/network-scripts/ifcfg-enp72s0f1
  - ifup enp72s0f1
  - sed 's/192.168.0/192.168.6/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp76s0f0
  - sed -i 's/enp12s0f0/enp76s0f0/g' /etc/sysconfig/network-scripts/ifcfg-enp76s0f0
  - ifup enp76s0f0
  - sed 's/192.168.0/192.168.7/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp76s0f1
  - sed -i 's/enp12s0f0/enp76s0f1/g' /etc/sysconfig/network-scripts/ifcfg-enp76s0f1
  - ifup enp76s0f1
  - sed 's/192.168.0/192.168.8/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp138s0f0
  - sed -i 's/enp12s0f0/enp138s0f0/g' /etc/sysconfig/network-scripts/ifcfg-enp138s0f0
  - ifup enp138s0f0
  - sed 's/192.168.0/192.168.9/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp138s0f1
  - sed -i 's/enp12s0f0/enp138s0f1/g' /etc/sysconfig/network-scripts/ifcfg-enp138s0f1
  - ifup enp138s0f1
  - sed 's/192.168.0/192.168.10/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp148s0f0
  - sed -i 's/enp12s0f0/enp148s0f0/g' /etc/sysconfig/network-scripts/ifcfg-enp148s0f0
  - ifup enp148s0f0
  - sed 's/192.168.0/192.168.11/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp148s0f1
  - sed -i 's/enp12s0f0/enp148s0f1/g' /etc/sysconfig/network-scripts/ifcfg-enp148s0f1
  - ifup enp148s0f1
  - sed 's/192.168.0/192.168.12/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp195s0f0
  - sed -i 's/enp12s0f0/enp195s0f0/g' /etc/sysconfig/network-scripts/ifcfg-enp195s0f0
  - ifup enp195s0f0
  - sed 's/192.168.0/192.168.13/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp195s0f1
  - sed -i 's/enp12s0f0/enp195s0f1/g' /etc/sysconfig/network-scripts/ifcfg-enp195s0f1
  - ifup enp195s0f1
  - sed 's/192.168.0/192.168.14/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp209s0f0
  - sed -i 's/enp12s0f0/enp209s0f0/g' /etc/sysconfig/network-scripts/ifcfg-enp209s0f0
  - ifup enp209s0f0
  - sed 's/192.168.0/192.168.15/g' /etc/sysconfig/network-scripts/ifcfg-enp12s0f0 > /etc/sysconfig/network-scripts/ifcfg-enp209s0f1
  - sed -i 's/enp12s0f0/enp209s0f1/g' /etc/sysconfig/network-scripts/ifcfg-enp209s0f1
  - ifup enp209s0f1
# Pull Horovod docker image
  - systemctl start docker
  - systemctl enable docker
  - docker pull horovod/horovod:latest
```

このcloud-init設定ファイルのRDMAインタフェース設定は、プライベートサブネットに接続するTCP接続（インターフェース名：enp45s0f0）用IPアドレスの4フィールド目の値を取得（この値をyとする）し、この値を4フィールド目に持つ192.168.x.y/24（x = 0 - 15）を、BM.GPU4.8が有する16個のクラスタ・ネットワーク接続用RDMAインタフェースのIPアドレスに使用します。

## 1-2. インスタンス構成作成

本章は、インスタンス構成を作成します。

インスタンス構成は、インスタンスをデプロイする際のひな型設定で、一度インスタンス構成を作成すると、これを利用して簡単に同じ属性のインスタンスをデプロイすることが出来るようになります。

1. OCIコンソールにログインし、クラスタ・ネットワークをデプロイするリージョンを選択後、 **コンピュート** → **インスタンス構成** とメニューを辿ります。

2. 表示される以下画面で、**インスタンス構成の作成** ボタンをクリックします。

![画面ショット](console_page01.png)

3. 表示される **インスタンス構成の作成** 画面で、以下の情報を入力し **作成** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。

   3.1 **インスタンス構成情報** フィールド

    - **名前** ：インスタンス構成に付与する名前
    - **コンパートメントに作成** ：インスタンス構成を作成するコンパートメント

   ![画面ショット](console_page02.png)

   3.2 **インスタンスの作成先のコンパートメント** フィールド：インスタンスをデプロイするコンパートメント

   ![画面ショット](console_page03.png)

   3.3 **配置** フィールド
    - **可用性ドメイン** ：インスタンスをデプロイする可用性ドメイン

   ![画面ショット](console_page04.png)

   3.4 **イメージとシェイプ** フィールド

   ![画面ショット](console_page05.png)

    - **イメージ** ：Oracle Linux 7 - GPU Cluster Networking Image (**イメージの変更** ボタンをクリックして表示される以下 **すべてのイメージの参照** サイドバーで **イメージ・ソース** フィールドに **Oracleイメージ** を選択し検索フィールドに **gpu** と入力して表示される **Oracle Linux 7 - GPU Cluster Networking Image** を選択し **イメージの選択** ボタンをクリック）

   ![画面ショット](console_page06.png)

   ここで指定しているイメージは、OCIのマーケットプレースから提供するOracke Linux 7.9をベースに作成されたクラスタ・ネットワークに接続するために必要なソフトウェアとGPU関連ソフトウェアが含まれるイメージ（以降 **GPUイメージ** と呼称）です。

    - **Shape** ：BM.GPU4.8 (**Change Shape** ボタンをクリックして表示される以下 **すべてのシェイプの参照** サイドバーで **ベア・メタル・マシン** をクリックして表示される **BM.GPU4.8** を選択し **次のドキュメントを確認した上でこれに同意します** チェックボックスをチェックし **シェイプの選択** ボタンをクリック）

   ![画面ショット](console_page07.png)

   3.5 **ネットワーキング** フィールド
    - **プライマリ・ネットワーク** ： 先に作成したVCNを選択
    - **サブネット** ：先に作成したプライベートサブネットを選択

   ![画面ショット](console_page08.png)

   3.6 **SSHキーの追加** フィールド
    - **SSHキー** ：先にbastionで作成したSSH鍵の公開鍵（ 以下 **公開キーの貼付け** ラジオボタンを選択することで入力フィールドを表示）  

   ![画面ショット](console_page09.png)

   3.7 **管理** フィールド（以下 **拡張オプションの表示** ボタンを選択して表示）
   
   ![画面ショット](console_page10.png)

    - **cloud-initスクリプト** ：先に作成したcloud-init設定ファイルを選択（ **参照** ボタンでファイルを選択）  

   ![画面ショット](console_page11.png)

## 1-3. クラスタ・ネットワーク作成

本章は、先に作成したインスタンス構成を使用して、クラスタ・ネットワークを作成します。

1. OCIコンソールにログインし、クラスタ・ネットワークをデプロイするリージョンを選択後、 **コンピュート** → **クラスタ・ネットワーク** とメニューを辿ります。

2. 表示される以下画面で、**クラスタ・ネットワークの作成** ボタンをクリックします。

![画面ショット](console_page12.png)

3. 表示される **クラスタ・ネットワークの作成** 画面で、以下の情報を入力し **クラスタ・ネットワークの作成** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。

   3.1 **名前** フィールド：クラスタ・ネットワークに付与する名前

   ![画面ショット](console_page13.png)

   3.2 **コンパートメントに作成** フィールド：クラスタ・ネットワークをデプロイするコンパートメント

   ![画面ショット](console_page14.png)

   3.2 **可用性ドメイン** フィールド：クラスタ・ネットワークをデプロイする可用性ドメイン

   ![画面ショット](console_page15.png)

   3.3 **ネットワーキングの構成** フィールド

    - **仮想クラウド・ネットワーク** ：先に作成したVCNを選択
    - **サブネット** ：先に作成したプライベートサブネットを選択

   ![画面ショット](console_page16.png)

   3.4 **インスタンス・プールの構成** フィールド

    - **インスタンス・プール名** ：作成されるインスタンス・プールに付与する名前
    - **インスタンス数** ：2（デプロイするGPUノードのノード数）
    - **インスタンス構成** ：先に作成したインスタンス構成

   ![画面ショット](console_page17.png)

4. 表示される以下 **クラスタ・ネットワーク作業リクエスト** 画面で、左上のステータスが **プロビジョニング中** と表示されれば、クラスタ・ネットワークとGPUノードの作成が実施されています。

   ![画面ショット](console_page18.png)

   ステータスが **実行中** となれば、クラスタ・ネットワークとGPUノードの作成が完了しています。

# 2. GPUノード確認

本章は、デプロイされたGPUノードにログインし、環境を確認します。

## 2.1. GPUノードログイン

GPUノードは、プライベートサブネットに接続されており、インターネットからログインすることが出来ないため、bastionノードを経由してSSHログインします。bastionノードからGPUノードへのログインは、GPUノードのイニシャルホスト名を使用します。

GPUノードのイニシャルホスト名は、OCIコンソールでGPUノードをデプロイしたリージョンを選択後、 **コンピュート** → **インスタンス** とメニューを辿り、以下のインスタンス一覧からそのイニシャルホスト名を確認します。

またこの画面は、GPUノードのIPアドレスも表示されており、これを使用してbastionからSSHログインすることも可能です。

![画面ショット](console_page19.png)

GPUノードへのログインは、以下のようにbastionからopcユーザでSSHログインします。

```sh
> ssh inst-wyr6m-comp
The authenticity of host 'inst-wyr6m-comp (10.0.1.61)' cant be established.
ECDSA key fingerprint is SHA256:z1Hqcm+vNKQLCvqL6t1fqCgqpqo+onshYP7tI1AcwYU.
ECDSA key fingerprint is MD5:0a:86:6f:d3:86:36:d0:7d:74:3e:8c:3f:cd:4c:3a:68.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'inst-wyr6m-comp,10.0.1.61' (ECDSA) to the list of known hosts.
>
```

## 2.2. cloud-init完了確認

cloud-initは、GPUノードが起動してSSHログインできる状態であっても、その処理が継続している可能性があるため、以下コマンドでそのステータスを表示し、 **done** となっていることでcloud-initの処理完了を確認します。

ステータスが **running** の場合は、cloud-initの処理が継続中のため、処理が完了するまで待ちます。

```sh
> sudo cloud-init status
status: done
```

## 2.3. GPUノードファイルシステム確認

cloud-initが完了したGPUノードは、以下のようにNVMe領域が/mnt/localdiskにマウントされています。

```sh
> df -h /mnt/localdisk
Filesystem              Size  Used Avail Use% Mounted on
/dev/mapper/nvme-lvol0   25T   34M   25T   1% /mnt/localdisk
```

## 2.4. Horovod用Dockerコンテナーイメージ確認

cloud-initが完了したGPUノードは、以下のようにHorovod用のDockerコンテナーイメージがプルされています。

```sh
> sudo docker images
REPOSITORY        TAG       IMAGE ID       CREATED       SIZE
horovod/horovod   latest    f16647de3f02   5 weeks ago   14.2GB
```

# 3. Dockerコンテナー環境構築

## 3-0. Dockerコンテナー環境構築概要

本章は、後の章で実行するNCCL TestsとHorovodのサンプルプログラムを実行するHorovod用Dockerコンテナーを起動するため、必要な環境構築作業を行います。

NCCL TestsとHorovodのサンプルプログラムは、コンテナーを跨るプログラム実行のコントローラとしてMPIを使用します。ここで使用するMPIは、Horovod用Dockerコンテナーにに予め含まれる、OpenMPIです。

OpenMPIをコンテナー間で実行するためには、MPIプログラムをmpirun等で起動するコンテナー（いわゆるヘッドノード）からMPIプログラム実行に参加する他の全てのコンテナーにパスフレーズ無しでSSH接続できる必要があります。

またOpenMPIの実行は、これを実行するコンテナー間で必要なポートにアクセス出来る必要があるため、GPUノードが接続されるプライベートサブネットのセキュリティリストを修正する必要があります。

以上より、本章で実施するDockerコンテナー環境構築は、以下の手順を経て行います。

- コンテナー間SSH接続環境構築
- プライベートサブネットセキュリティリスト修正
- Horovod用Dockerコンテナー起動

## 3-1. コンテナー間SSH接続環境構築

本章は、先にbastionノードで作成したSSH秘密鍵を全てのGPUノードにコピーし、後のコンテナー起動時にこのディレクトリをコンテナーにマウントすることで、コンテナー間のパスフレーズ無しSSH接続環境を実現します。
   
まず初めに、先に確認したOCIコンソールのインスタンス一覧を使用し、以下のように全てのGPUノードのイニシャルホスト名を含むファイルをbastion上に作成します。

```sh
> cat hostlist.txt 
inst-ks8ls-comp
inst-6ejzf-comp
```

次にこのファイルを使用し、bastionノードのopcユーザで以下コマンドを実行、全GPUノードのホストキーを含むknown_hostsファイルを作成します。この際、GPUノード毎に接続確認を求められるため、全てに **yes** を入力します。

```sh
> for hname in `cat hostlist.txt`; do echo $hname; ssh $hname hostname; done
inst-ks8ls-comp
The authenticity of host 'inst-ks8ls-comp (10.0.2.171)' cannot be established.
ECDSA key fingerprint is SHA256:Gfl/Tw0vwH9AKq2wQEfwnittbzHxqpFojOhl8mToHjU.
ECDSA key fingerprint is MD5:b3:28:5a:c3:7e:96:18:5f:e2:74:81:7f:05:ab:e5:7b.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'inst-ks8ls-comp,10.0.2.171' (ECDSA) to the list of known hosts.
inst-ks8ls-comp
inst-6ejzf-comp
The authenticity of host 'inst-6ejzf-comp (10.0.2.214)' cannot be established.
ECDSA key fingerprint is SHA256:nNStowr7C2wULChbWDuX/EdTtpqmpQobnpt47Boj+1M.
ECDSA key fingerprint is MD5:24:81:07:4b:9f:0d:07:26:2c:e8:23:df:82:fc:f5:6c.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'inst-6ejzf-comp,10.0.2.214' (ECDSA) to the list of known hosts.
inst-6ejzf-comp
```

次に、bastionノードのopcユーザで以下コマンドを実行、bastionで作成した秘密鍵を使ったSSHログインを許可します。

```sh
> cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

次に、bastionノードのopcユーザで以下コマンドを実行、~opc/.sshディレクトリをアーカイブしてこれを全GPUノードにコピーします。

```sh
> cd ~
> tar -cvf /tmp/ssh.tar ./.ssh
./.ssh/
./.ssh/id_rsa
./.ssh/known_hosts
./.ssh/id_rsa.pub
./.ssh/authorized_keys
> for hname in `cat hostlist.txt`; do echo $hname; scp /tmp/ssh.tar $hname:/tmp/; done
inst-ks8ls-comp
ssh.tar                                                                100%   10KB   9.8MB/s   00:00    
inst-6ejzf-comp
ssh.tar                                                                100%   10KB   8.9MB/s   00:00
```

次に、bastionノードのopcユーザで以下コマンドを実行、先のアーカイブを/horovodディレクトリに展開します。

```sh
> for hname in `cat hostlist.txt`; do echo $hname; ssh $hname "sudo mkdir /horovod"; done
> for hname in `cat hostlist.txt`; do echo $hname; ssh $hname "sudo tar --no-same-owner -xvf /tmp/ssh.tar -C /horovod/"; done
inst-ks8ls-comp
./.ssh/
./.ssh/id_rsa
./.ssh/known_hosts
./.ssh/id_rsa.pub
./.ssh/authorized_keys
inst-6ejzf-comp
./.ssh/
./.ssh/id_rsa
./.ssh/known_hosts
./.ssh/id_rsa.pub
./.ssh/authorized_keys
```

## 3-2. プライベートサブネットセキュリティリスト修正

本章は、プライベートサブネットのセキュリティリストを以下の手順で修正します。

1. OCIコンソールにログインし、GPUノードをデプロイしたリージョンを選択後、 **ネットワーキング** → **仮想クラウド・ネットワーク** とメニューを辿ります。

2. 表示される画面で、先に作成した仮想クラウド・ネットワークをクリックします。

3. 表示される以下 **サブネット** フィールドで、先に作成したプライベートサブネットをクリックします。

   ![画面ショット](console_page21.png)

4. 表示される以下 **セキュリティ・リスト** フィールドで、プライベートサブネットに適用されているセキュリティリストをクリックします。

   ![画面ショット](console_page22.png)

5. 表示される以下 **イングレス・ルール** フィールドで、SSHアクセスを許可しているルールの **編集** メニューをクリックします。

   ![画面ショット](console_page23.png)

6. 表示される以下 **イングレス・ルールの編集** サイドバーで、 **IPプロトコル** フィールドを **すべてのプロトコル** に変更し、 **変更の保存** ボタンをクリックします。

   ![画面ショット](console_page24.png)

7. 表示される以下 **イングレス・ルール** フィールドで、変更したルールの **IPプロトコル** が **すべてのプロトコル** に変更されたことを確認します。

   ![画面ショット](console_page25.png)

## 3-3. Horovod用Dockerコンテナー起動

本章は、2ノードのGPUノード（以降、このうち1台をマスターノード、残りの1台をスレーブノードと呼称。）でHorovod用Dockerコンテナーを起動します。

以下コマンドをマスターノードのrootユーザで実行し、マスターノード上でHorovod用Dockerコンテナーを起動します。

```sh
> docker run -it --privileged --gpus all --network=host -v /horovod/.ssh:/root/.ssh horovod/horovod:latest
```

次に、以下コマンドをスレーブノードのrootユーザで実行し、スレーブノード上でポート番号12345でSSH接続を受け付けるHorovod用Dockerコンテナーを起動します。

```sh
> docker run -it --privileged --gpus all --network=host -v /horovod/.ssh:/root/.ssh horovod/horovod:latest bash -c "/usr/sbin/sshd -p 12345; bash"
```

# 4. NCCL通信性能検証

## 4-0. NCCL通信性能検証概要

本章は、NCCL Testsを使用し、GPUクラスタ内のNCCLによるGPU間通信性能を確認します。

ここで使用するNCCLは、Horovod用Dockerコンテナーに予め含まれますが、NCCL Testsはコンテナー内でソースコードからビルドします。

以上より、本章で実施するNCCL通信性能検証は、以下の手順を経て行います。

- NCCL Testsビルド
- NCCL Tests実行

本チュートリアルは、2ノードに跨る全16枚のGPUで全16ポートのRDMAインタフェースを使用したNCCLのAll Reduce通信性能をコンテナー環境から計測し、以下性能が出ています。

- 帯域（busbw）：約 72 GB/s
- レイテンシ：約 39 μs

## 4-1. NCCL Testsビルド

本章は、NCCL TestsプログラムをGitHubからダウンロード、ビルドします。

マスターノードとスレーブノードのそれぞれで、起動したコンテナー上のrootユーザで、以下のコマンドを実行します。

```sh
> cd ~
> git clone https://github.com/NVIDIA/nccl-tests.git
> cd nccl-tests
> make MPI=1 MPI_HOME=/usr/local CUDA_HOME=/usr/local/cuda-11.3 NCCL_HOME=/usr/lib/x86_64-linux-gnu
```

## 4-2. NCCL Tests実行

本章は、NCCL Testsプログラムを実行します。

マスターノードで起動したコンテナー上のrootユーザで以下のコマンドを実行し、マスターノードの8枚のGPUを使用したNCCLのall reduce通信性能を計測します。

```sh
> export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/lib
> ./build/all_reduce_perf -b 64 -e 10G -f 2 -t 1 -g 8
# nThread 1 nGpus 8 minBytes 64 maxBytes 10737418240 step: 2(factor) warmup iters: 5 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid    944 on inst-ks8ls-comp device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid    944 on inst-ks8ls-comp device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid    944 on inst-ks8ls-comp device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid    944 on inst-ks8ls-comp device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid    944 on inst-ks8ls-comp device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid    944 on inst-ks8ls-comp device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid    944 on inst-ks8ls-comp device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid    944 on inst-ks8ls-comp device  7 [0xda] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
          64            16     float     sum      -1    32.01    0.00    0.00      0    31.82    0.00    0.00      0
         128            32     float     sum      -1    32.01    0.00    0.01      0    32.15    0.00    0.01      0
         256            64     float     sum      -1    31.75    0.01    0.01      0    32.02    0.01    0.01      0
         512           128     float     sum      -1    32.21    0.02    0.03      0    31.72    0.02    0.03      0
        1024           256     float     sum      -1    32.03    0.03    0.06      0    32.17    0.03    0.06      0
        2048           512     float     sum      -1    31.77    0.06    0.11      0    32.24    0.06    0.11      0
        4096          1024     float     sum      -1    32.13    0.13    0.22      0    32.20    0.13    0.22      0
        8192          2048     float     sum      -1    32.22    0.25    0.44      0    32.14    0.25    0.45      0
       16384          4096     float     sum      -1    32.48    0.50    0.88      0    32.20    0.51    0.89      0
       32768          8192     float     sum      -1    32.02    1.02    1.79      0    32.20    1.02    1.78      0
       65536         16384     float     sum      -1    35.40    1.85    3.24      0    34.20    1.92    3.35      0
      131072         32768     float     sum      -1    38.50    3.40    5.96      0    37.47    3.50    6.12      0
      262144         65536     float     sum      -1    45.21    5.80   10.15      0    44.01    5.96   10.42      0
      524288        131072     float     sum      -1    58.96    8.89   15.56      0    57.54    9.11   15.95      0
     1048576        262144     float     sum      -1    76.71   13.67   23.92      0    77.73   13.49   23.61      0
     2097152        524288     float     sum      -1    112.4   18.66   32.66      0    113.7   18.45   32.28      0
     4194304       1048576     float     sum      -1    134.5   31.18   54.57      0    134.7   31.13   54.48      0
     8388608       2097152     float     sum      -1    185.8   45.15   79.02      0    183.2   45.79   80.12      0
    16777216       4194304     float     sum      -1    245.1   68.46  119.81      0    241.4   69.51  121.65      0
    33554432       8388608     float     sum      -1    398.2   84.26  147.46      0    397.6   84.39  147.68      0
    67108864      16777216     float     sum      -1    589.5  113.84  199.23      0    587.8  114.18  199.81      0
   134217728      33554432     float     sum      -1   1191.2  112.67  197.17      0   1182.6  113.50  198.62      0
   268435456      67108864     float     sum      -1   2121.9  126.50  221.38      0   2110.9  127.17  222.55      0
   536870912     134217728     float     sum      -1   4208.2  127.58  223.26      0   4208.0  127.58  223.27      0
  1073741824     268435456     float     sum      -1   8166.8  131.48  230.08      0   8165.2  131.50  230.13      0
  2147483648     536870912     float     sum      -1    16232  132.30  231.52      0    16238  132.25  231.44      0
  4294967296    1073741824     float     sum      -1    32097  133.81  234.17      0    32099  133.80  234.16      0
  8589934592    2147483648     float     sum      -1    63929  134.37  235.14      0    63911  134.40  235.21      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 81.112 
#
```

次に、マスターノードで起動したコンテナー上のrootユーザで以下のコマンドを実行し、マスターノードとスレーブノードの全16枚のGPUと全16ポートのRDMAインタフェースを使用した、2ノードのGPUノードに跨るNCCLのall reduce通信性能を計測します。

```sh
> mpirun --allow-run-as-root -np 16 --host inst-ks8ls-comp:8,inst-6ejzf-comp:8 -mca plm_rsh_args "-p 12345" --mca btl_tcp_if_exclude docker0,lo -x UCX_NET_DEVICES=mlx5_0:1 -x NCCL_IB_HCA="mlx5_0,mlx5_1,mlx5_2,mlx5_3,mlx5_6,mlx5_7,mlx5_8,mlx5_9,mlx5_10,mlx5_11,mlx5_12,mlx5_13,mlx5_14,mlx5_15,mlx5_16,mlx5_17" ./build/all_reduce_perf -b 64 -e 10G -f 2 -t 1 -g 1
Warning: Permanently added '[inst-6ejzf-comp]:12345,[10.0.2.214]:12345' (ECDSA) to the list of known hosts.
# nThread 1 nGpus 1 minBytes 64 maxBytes 10737418240 step: 2(factor) warmup iters: 5 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid   1411 on inst-ks8ls-comp device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid   1412 on inst-ks8ls-comp device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid   1413 on inst-ks8ls-comp device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid   1414 on inst-ks8ls-comp device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid   1415 on inst-ks8ls-comp device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid   1416 on inst-ks8ls-comp device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid   1419 on inst-ks8ls-comp device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid   1422 on inst-ks8ls-comp device  7 [0xda] NVIDIA A100-SXM4-40GB
#  Rank  8 Group  0 Pid   1376 on inst-6ejzf-comp device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  9 Group  0 Pid   1377 on inst-6ejzf-comp device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank 10 Group  0 Pid   1378 on inst-6ejzf-comp device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank 11 Group  0 Pid   1379 on inst-6ejzf-comp device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank 12 Group  0 Pid   1380 on inst-6ejzf-comp device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank 13 Group  0 Pid   1381 on inst-6ejzf-comp device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank 14 Group  0 Pid   1383 on inst-6ejzf-comp device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank 15 Group  0 Pid   1385 on inst-6ejzf-comp device  7 [0xda] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
          64            16     float     sum      -1    38.75    0.00    0.00      0    38.62    0.00    0.00      0
         128            32     float     sum      -1    39.25    0.00    0.01      0    38.13    0.00    0.01      0
         256            64     float     sum      -1    37.80    0.01    0.01      0    37.51    0.01    0.01      0
         512           128     float     sum      -1    37.57    0.01    0.03      0    36.87    0.01    0.03      0
        1024           256     float     sum      -1    39.63    0.03    0.05      0    37.86    0.03    0.05      0
        2048           512     float     sum      -1    41.14    0.05    0.09      0    40.55    0.05    0.09      0
        4096          1024     float     sum      -1    45.04    0.09    0.17      0    44.43    0.09    0.17      0
        8192          2048     float     sum      -1    49.39    0.17    0.31      0    48.33    0.17    0.32      0
       16384          4096     float     sum      -1    52.35    0.31    0.59      0    50.34    0.33    0.61      0
       32768          8192     float     sum      -1    58.75    0.56    1.05      0    57.48    0.57    1.07      0
       65536         16384     float     sum      -1    71.91    0.91    1.71      0    70.11    0.93    1.75      0
      131072         32768     float     sum      -1    103.7    1.26    2.37      0    102.9    1.27    2.39      0
      262144         65536     float     sum      -1    114.0    2.30    4.31      0    115.0    2.28    4.28      0
      524288        131072     float     sum      -1    120.7    4.34    8.14      0    121.1    4.33    8.11      0
     1048576        262144     float     sum      -1    136.1    7.71   14.45      0    139.3    7.53   14.12      0
     2097152        524288     float     sum      -1    169.2   12.40   23.24      0    167.1   12.55   23.53      0
     4194304       1048576     float     sum      -1    233.4   17.97   33.69      0    231.4   18.12   33.98      0
     8388608       2097152     float     sum      -1    358.2   23.42   43.91      0    358.4   23.41   43.89      0
    16777216       4194304     float     sum      -1    941.7   17.82   33.41      0    947.3   17.71   33.21      0
    33554432       8388608     float     sum      -1   1079.0   31.10   58.31      0   1096.3   30.61   57.39      0
    67108864      16777216     float     sum      -1   6058.5   11.08   20.77      0   3709.5   18.09   33.92      0
   134217728      33554432     float     sum      -1   7234.1   18.55   34.79      0   7229.2   18.57   34.81      0
   268435456      67108864     float     sum      -1    13675   19.63   36.81      0    13532   19.84   37.20      0
   536870912     134217728     float     sum      -1    14463   37.12   69.60      0    14467   37.11   69.58      0
  1073741824     268435456     float     sum      -1    28656   37.47   70.26      0    28667   37.46   70.23      0
  2147483648     536870912     float     sum      -1    56697   37.88   71.02      0    56712   37.87   71.00      0
  4294967296    1073741824     float     sum      -1   112804   38.07   71.39      0   112801   38.08   71.39      0
  8589934592    2147483648     float     sum      -1   225083   38.16   71.56      0   225082   38.16   71.56      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 24.2272 
#
```

# 5. Horovodサンプルプログラム実行

## 5-0. Horovodサンプルプログラム実行概要

本章は、Horovodサンプルプログラムを使用し、構築したGPUクラスタで分散機械学習プログラムを実行します。

ここで使用するHorovodサンプルプログラムは、Horovod用Dockerコンテナーに予め含まれる、TensorFlow 2でダミーデータを用いてResNet-50モデルを訓練するベンチマークプログラムです。

## 5-1. Horovodサンプルプログラム実行

本章は、Horovodサンプルプログラムを実行します。

マスターノードで起動したコンテナー上のrootユーザで以下のコマンドを実行し、マスターノードの8枚のGPUを使用してHorovodサンプルプログラムを実行します。

```sh
> horovodrun -np 8 -H localhost:8 python tensorflow2/tensorflow2_synthetic_benchmark.py
   :
[1,0]<stdout>:Model: ResNet50
[1,0]<stdout>:Batch size: 32
[1,0]<stdout>:Number of GPUs: 8
[1,0]<stdout>:Running warmup...
   :
[1,0]<stdout>:Running benchmark...
[1,0]<stdout>:Iter #0: 598.3 img/sec per GPU
[1,0]<stdout>:Iter #1: 598.7 img/sec per GPU
[1,0]<stdout>:Iter #2: 597.6 img/sec per GPU
[1,0]<stdout>:Iter #3: 600.6 img/sec per GPU
[1,0]<stdout>:Iter #4: 599.3 img/sec per GPU
[1,0]<stdout>:Iter #5: 599.5 img/sec per GPU
[1,0]<stdout>:Iter #6: 598.4 img/sec per GPU
[1,0]<stdout>:Iter #7: 601.3 img/sec per GPU
[1,0]<stdout>:Iter #8: 603.7 img/sec per GPU
[1,0]<stdout>:Iter #9: 602.8 img/sec per GPU
[1,0]<stdout>:Img/sec per GPU: 600.0 +-3.8
[1,0]<stdout>:Total img/sec on 8 GPU(s): 4800.1 +-30.3
```

最後の行に出力される実行結果から、8枚のGPUを使用した実行時のスコアが4,800程度であることを確認します。

次に、マスターノードで起動したコンテナー上のrootユーザで以下のコマンドを実行し、マスターノードとスレーブノードの全16枚のGPUを使用して、2ノードのGPUノードに跨ってHorovodサンプルプログラムを実行します。

```sh
> mpirun --allow-run-as-root -np 16 -H inst-ks8ls-comp:8,inst-6ejzf-comp:8 -mca plm_rsh_args "-p 12345" --mca btl_tcp_if_exclude docker0,lo python tensorflow2/tensorflow2_synthetic_benchmark.py
   :
Model: ResNet50
Batch size: 32
Number of GPUs: 16
Running warmup...
   :
Running benchmark...
Iter #0: 572.9 img/sec per GPU
Iter #1: 574.1 img/sec per GPU
Iter #2: 573.8 img/sec per GPU
Iter #3: 573.0 img/sec per GPU
Iter #4: 573.1 img/sec per GPU
Iter #5: 572.5 img/sec per GPU
Iter #6: 573.6 img/sec per GPU
Iter #7: 574.2 img/sec per GPU
Iter #8: 571.6 img/sec per GPU
Iter #9: 572.9 img/sec per GPU
Img/sec per GPU: 573.2 +-1.5
Total img/sec on 16 GPU(s): 9170.8 +-23.4
```

最後の行に出力される実行結果から、2ノード16枚のGPUを使用した実行時のスコアが9,200程度で、先の1ノード8枚のGPUで実行したスコアからほぼリニアにスケールしていることを確認します。

# 6. GPUクラスタの削除

本章は、クラスタ・ネットワークを終了することで、作成したクラスタ・ネットワークとGPUノードを削除します。

1. OCIコンソールメニューから **コンピュート** → **クラスタ・ネットワーク** を選択し、表示される以下画面で作成したクラスタ・ネットワークの **終了** メニューをクリックします。

   ![画面ショット](console_page26.png)

クラスタ・ネットワークの **状態** が **終了済** となれば、削除が完了しています。

これで、このチュートリアルは終了です。