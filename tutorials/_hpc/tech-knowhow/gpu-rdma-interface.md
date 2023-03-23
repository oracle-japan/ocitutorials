---
title: "ベアメタルGPUインスタンスのクラスタ・ネットワーク接続用ネットワークインターフェース作成方法"
excerpt: "16個のRDMA対応ポートを持つベアメタルGPUシェイプBM.GPU4.8/BM.GPU.GM4.8は、これらのポートに対するOSレベルのインタフェースをインスタンスをデプロイした後にユーザ自身が適切に設定し、クラスタ・ネットワークに接続する必要があります。本テクニカルTipsは、このインタフェース作成方法を解説します。"
order: "510"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

16個のRDMA対応ポートを持つベアメタルGPUシェイプ **[BM.GPU4.8/BM.GPU.GM4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** は、これらのポートに対するOSレベルのインタフェースをインスタンスをデプロイした後にユーザ自身が適切に設定し、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続する必要があります。  
本テクニカルTipsは、このインタフェース設定方法を解説します。

BM.GPU4.8/BM.GPU.GM4.8は、クラスタ・ネットワークに接続する16個のポートをNCCL等のGPU間通信ライブラリから使用しますが、この場合これら16個のポートを16個の異なるIPサブネットに接続して使用します。  
ここでDHCPが利用できないクラスタ・ネットワークにおいて、各ポートのIPアドレスをどの様に設定すればよいでしょうか。

この課題に対処するため、 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から提供するクラスタ・ネットワーク対応GPUイメージは、systemdのサービス **oci-rdma-configure** を用意しています。  
このサービスは、起動されると16個のポートのIPアドレス設定を/etc/sysconfig/network-scripts/ifcfg- *ifname* ファイルとして作成し、インタフェースを起動します。  
ここで各ポートに割り振られるIPアドレスは、インスタンスをVCNのサブネット（24ビットのネットマスクを想定）にTCP/IPで接続する際に使用するenp45s0f0に割り振られるIPアドレスの4フィールド目（ここでは"x"と仮定）を使用し、以下のように静的にIPアドレスを設定することで、アドレス重複を回避します。

| ポート名       | IPアドレス       |
| ---------- | ------------ |
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

ここでIPアドレスに使用するネットワークアドレスは、デフォルトで192.168.0.0/24が使用されますが、これを異なるネットワークアドレスに変更することも可能で、この手順も解説します。

なお 、ここで解説するネットワークインタフェース作成手順は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[機械学習環境](/ocitutorials/hpc/#1-2-機械学習環境)** で紹介するGPUクラスタ構築手順に含まれるため、これらチュートリアルの手順に従ってGPUクラスタを構築する場合は、改めて実施する必要はありません。

***
# 1. ネットワークインタフェース作成手順

BM.GPU4.8/BM.GPU.GM4.8のクラスタ・ネットワークに接続する16個のポートは、以下の手順を該当するノードのrootで実行し、ネットワークインタフェースを作成します。

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

上記結果から、enp45s0f0にDHCPから割当てられたIPアドレス10.0.2.87/24を元に、各ポートに192.168.y.87/24が割当てられていることがわかります。

***
# 2. ネットワークアドレス変更手順

**oci-rdma-configure** を使用した **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 接続ポートのネットワークインタフェース作成は、その設定ファイルである **/etc/oci-hpc/rdma-network.conf** をもとに行われ、使用するネットワークアドレスをこの設定ファイル中の **rdma_network** の値から読み取ります。  
そこでデフォルトの192.168.0.0からアドレスを変更するには、以下の手順を該当するノードのrootで実行します。

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

上記結果から、enp45s0f0にDHCPから割当てられたIPアドレス10.0.2.87/24を元に、各ポートに192.169.y.87/24（デフォルトでは192.168.y.87/24）が割当てられていることがわかります。