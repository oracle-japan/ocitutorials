---
title: "クラスタ・ネットワーク接続用ネットワークインターフェース作成方法"
excerpt: "クラスタ・ネットワーク対応シェイプのBM.Optimized3.36やBM.GPU4.8/BM.GPU.A100-v2.8は、接続するポートのIPアドレス設定等を含むネットワークインターフェースをインスタンスデプロイ後にユーザ自身が適切に設定することで、クラスタ・ネットワークに接続します。本テクニカルTipsは、このネットワークインターフェース作成方法を解説します。"
order: "311"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 対応シェイプの **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** や **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** は、接続するポートのIPアドレス設定等を含むネットワークインターフェースをインスタンスデプロイ後にユーザ自身が適切に設定することで、 **クラスタ・ネットワーク** に接続します。  
本テクニカルTipsは、このネットワークインターフェース作成方法を解説します。

***
# 0. 概要

**BM.Optimized3.36** や **BM.GPU4.8/BM.GPU.A100-v2.8** は、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** がDHCPに対応していないため、その接続インターフェースに静的にIPアドレスを割当てる必要があります。  
また **BM.GPU4.8/BM.GPU.A100-v2.8** は、 **クラスタ・ネットワーク** に接続するポートを16ポート有し、これらを **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** 等のGPU間通信ライブラリから使用しますが、この場合これら16ポートを16個の異なるIPサブネットに接続して使用します。

ここでDHCPが利用できない **クラスタ・ネットワーク** で、複数ノードに亘ってIPアドレスの重複が起こらないようにネットワークインターフェースを設定するには、どのようにうすればよいでしょうか。

この課題に対処するため、 **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** は、systemdのサービス **oci-rdma-configure** を用意しています。  
このサービスは、起動されると **クラスタ・ネットワーク** に接続するポートのネットワークインターフェース設定を/etc/sysconfig/network-scripts/ifcfg-*ifname* ファイルに作成し、ネットワークインターフェースを起動します。  
ここで各ポートに割り振られるIPアドレスは、インスタンスを仮想クラウド・ネットワークのサブネット（24ビットのネットマスクを想定）にTCP/IPで接続する際に使用するポートにDHCPで割り振られるIPアドレスの4フィールド目（ここでは"x"と仮定）を使用し、以下のように静的にIPアドレスを割当てることで、アドレス重複を回避します。

- **BM.Optimized3.36** の場合

| ポート名     | IPアドレス         |
| -------- | -------------- |
| ens800f0 | 192.168.0.x/24 |

- **BM.GPU4.8/BM.GPU.A100-v2.8** の場合

| ポート名       | IPアドレス          |
| ---------- | --------------- |
| enp12s0f0  | 192.168.0.x/24  |
| enp12s0f1  | 192.168.1.x/24  |
| enp22s0f0  | 192.168.2.x/24  |
| enp22s0f1  | 192.168.3.x/24  |
| enp72s0f0  | 192.168.4.x/24  |
| enp72s0f1  | 192.168.5.x/24  |
| enp76s0f0  | 192.168.6.x/24  |
| enp76s0f1  | 192.168.7.x/24  |
| enp138s0f0 | 192.168.8.x/24  |
| enp138s0f1 | 192.168.9.x/24  |
| enp148s0f0 | 192.168.10.x/24 |
| enp148s0f1 | 192.168.11.x/24 |
| enp195s0f0 | 192.168.12.x/24 |
| enp195s0f1 | 192.168.13.x/24 |
| enp209s0f0 | 192.168.14.x/24 |
| enp209s0f1 | 192.168.15.x/24 |

これらのインターフェースに割り当てられるネットワークアドレスは、デフォルトで192.168.yyy.0/24が使用されますが、これを異なるネットワークアドレスに変更することも可能です。

以降では、 **BM.Optimized3.36** と **BM.GPU4.8/BM.GPU.A100-v2.8** を例に、 **クラスタ・ネットワーク** に接続するポートのネットワークインターフェース設定方法を解説します。  
また、このネットワークインターフェースに割り当てるネットワークアドレスを、デフォルトから変更する方法を解説します。

なお 、ここで解説するネットワークインターフェース作成手順は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[HPCクラスタ](/ocitutorials/hpc/#1-1-hpcクラスタ)** で紹介するHPCクラスタ構築手順や **[機械学習環境](/ocitutorials/hpc/#1-2-機械学習環境)** で紹介するGPUクラスタ構築手順に含まれるため、これらチュートリアルの手順に従ってHPC/GPUクラスタを構築する場合は、改めて実施する必要はありません。

***
# 1. ネットワークインターフェース作成手順

## 1-1. BM.Optimized3.36

**BM.Optimized3.36** の **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続するポートは、以下の手順を該当するノードのrootで実行し、ネットワークインターフェースを作成します。

```sh
> systemctl start oci-rdma-configure
> ifconfig ens300f0
ens300f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9000
        inet 10.0.2.10  netmask 255.255.255.0  broadcast 10.0.2.255
        inet6 fe80::bace:f6ff:fe23:7fe2  prefixlen 64  scopeid 0x20<link>
        ether b8:ce:f6:23:7f:e2  txqueuelen 1000  (Ethernet)
        RX packets 214628  bytes 1246754131 (1.1 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 300560  bytes 1721403479 (1.6 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
> ifconfig ens800f0
ens800f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.0.10  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::bace:f6ff:fe05:b5b2  prefixlen 64  scopeid 0x20<link>
        ether b8:ce:f6:05:b5:b2  txqueuelen 20000  (Ethernet)
        RX packets 34  bytes 10230 (9.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 57  bytes 13650 (13.3 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

上記結果から、仮想クラウド・ネットワークにTCP/IPで接続するens300f0にDHCPから割当てられたIPアドレス10.0.2.10/24を元に、 **クラスタ・ネットワーク** に接続するポートens800f0に192.168.0.10/24が割当てられていることがわかります。

## 1-2. BM.GPU4.8/BM.GPU.A100-v2.8

**BM.GPU4.8/BM.GPU.A100-v2.8** の **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続する16個のポートは、以下の手順を該当するノードのrootで実行し、ネットワークインターフェースを作成します。

```sh
> systemctl start oci-rdma-configure
> ifconfig -a | grep -A1 enp
enp12s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.0.87  netmask 255.255.255.0  broadcast 192.168.0.255
--
enp12s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.1.87  netmask 255.255.255.0  broadcast 192.168.1.255
--
enp138s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.8.87  netmask 255.255.255.0  broadcast 192.168.8.255
--
enp138s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.9.87  netmask 255.255.255.0  broadcast 192.168.9.255
--
enp148s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.10.87  netmask 255.255.255.0  broadcast 192.168.10.255
--
enp148s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.11.87  netmask 255.255.255.0  broadcast 192.168.11.255
--
enp195s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.12.87  netmask 255.255.255.0  broadcast 192.168.12.255
--
enp195s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.13.87  netmask 255.255.255.0  broadcast 192.168.13.255
--
enp209s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.14.87  netmask 255.255.255.0  broadcast 192.168.14.255
--
enp209s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.15.87  netmask 255.255.255.0  broadcast 192.168.15.255
--
enp22s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.2.87  netmask 255.255.255.0  broadcast 192.168.2.255
--
enp22s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.3.87  netmask 255.255.255.0  broadcast 192.168.3.255
--
enp45s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9000
        inet 10.0.2.87  netmask 255.255.255.0  broadcast 10.0.2.255
--
enp45s0f1: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 0c:42:a1:8d:27:f9  txqueuelen 1000  (Ethernet)
--
enp72s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.4.87  netmask 255.255.255.0  broadcast 192.168.4.255
--
enp72s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.5.87  netmask 255.255.255.0  broadcast 192.168.5.255
--
enp76s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.6.87  netmask 255.255.255.0  broadcast 192.168.6.255
--
enp76s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.7.87  netmask 255.255.255.0  broadcast 192.168.7.255
```

上記結果から、仮想クラウド・ネットワークにTCP/IPで接続するenp45s0f0にDHCPから割当てられたIPアドレス10.0.2.87/24を元に、各ポートに192.168.y.87/24が割当てられていることがわかります。

***
# 2. ネットワークアドレス変更手順

**oci-rdma-configure** を使用した **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 接続ポートのネットワークインターフェース作成は、その設定ファイルである **/etc/oci-hpc/rdma-network.conf** をもとに行われ、使用するネットワークアドレスをこの設定ファイル中の変数 **rdma_network** の値から読み取ります。  
そこでデフォルトの192.168.0.0からアドレスを変更するには、以下の手順を該当するノードのrootで実行します。（この例は **BM.GPU4.8/BM.GPU.A100-v2.8** の場合）

```sh
> diff /etc/oci-hpc/rdma-network.conf_org /etc/oci-hpc/rdma-network.conf
38c38
< rdma_network=192.168.0.0/255.255.0.0
---
> rdma_network=192.169.0.0/255.255.0.0
> systemctl start oci-rdma-configure
> ifconfig -a | grep -A1 enp
enp12s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.0.87  netmask 255.255.255.0  broadcast 192.169.0.255
--
enp12s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.1.87  netmask 255.255.255.0  broadcast 192.169.1.255
--
enp138s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.8.87  netmask 255.255.255.0  broadcast 192.169.8.255
--
enp138s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.9.87  netmask 255.255.255.0  broadcast 192.169.9.255
--
enp148s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.10.87  netmask 255.255.255.0  broadcast 192.169.10.255
--
enp148s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.11.87  netmask 255.255.255.0  broadcast 192.169.11.255
--
enp195s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.12.87  netmask 255.255.255.0  broadcast 192.169.12.255
--
enp195s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.13.87  netmask 255.255.255.0  broadcast 192.169.13.255
--
enp209s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.14.87  netmask 255.255.255.0  broadcast 192.169.14.255
--
enp209s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.15.87  netmask 255.255.255.0  broadcast 192.169.15.255
--
enp22s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.2.87  netmask 255.255.255.0  broadcast 192.169.2.255
--
enp22s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.3.87  netmask 255.255.255.0  broadcast 192.169.3.255
--
enp45s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9000
        inet 10.0.2.87  netmask 255.255.255.0  broadcast 10.0.2.255
--
enp45s0f1: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 0c:42:a1:8d:27:f9  txqueuelen 1000  (Ethernet)
--
enp72s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.4.87  netmask 255.255.255.0  broadcast 192.169.4.255
--
enp72s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.5.87  netmask 255.255.255.0  broadcast 192.169.5.255
--
enp76s0f0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.6.87  netmask 255.255.255.0  broadcast 192.169.6.255
--
enp76s0f1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.7.87  netmask 255.255.255.0  broadcast 192.169.7.255
```

上記結果から、仮想クラウド・ネットワークにTCP/IPで接続するenp45s0f0にDHCPから割当てられたIPアドレス10.0.2.87/24を元に、各ポートに192.169.y.87/24（デフォルトでは192.168.y.87/24）が割当てられていることがわかります。