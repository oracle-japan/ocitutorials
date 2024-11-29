---
title: "クラスタネットワーキングイメージを使ったクラスタ・ネットワーク接続方法"
excerpt: "クラスタ・ネットワーク対応シェイプを使用してクラスター・ネットワークに接続するするインスタンスは、デプロイ時のイメージにOracle LinuxをベースOSとするクラスタネットワーキングイメージを使用することで、クラスタ・ネットワーク接続に必要なソフトウェアのインストールやセットアップ等の作業を大幅に簡素化することが可能です。本テクニカルTipsは、このクラスタ・ネットワーキングイメージを使用してインスタンスをクラスタ・ネットワークに接続する方法を解説します。。
"
order: "311"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---
<style>
table, th, td {
    font-size: 80%;
}
</style>

**注意 :** 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。

***
# 0. 概要

**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** への接続は、使用するインスタンスが以下の接続条件を満たし、このインスタンスデプロイ後に以下の接続処理を完了する必要があります。

[接続条件]

1. **クラスタ・ネットワーク** 対応シェイプ（ **[ここ](https://docs.public.oneportal.content.oci.oraclecloud.com/ja-jp/iaas/Content/Compute/Tasks/managingclusternetworks.htm#supported-shapes)** を参照）を使用している
2. **クラスタ・ネットワーク** のデプロイに伴ってデプロイされている
3. **クラスタ・ネットワーク** 接続に必要な以下ソフトウェアがインストールされている
    1. Mellanox OFED
    2. WPAサプリカント（※1）
    3. 802.1X認証関連ユーティリティソフトウェア
    4. **クラスタ・ネットワーク** 設定ユーティリティソフトウェア

    ※1）**クラスタ・ネットワーク** は、インスタンスが接続する際802.1X認証を要求しますが、この処理を行うクライアントソフトウェアがWPAサプリカントです。802.1X認証の仕組みは、 **[ここ](https://www.infraexpert.com/study/wireless14.html)** のサイトが参考になります。

[接続処理]

1. **クラスタ・ネットワーク** との802.1X認証（**接続条件 3-3.** が実施）
2. **クラスタ・ネットワーク** 接続用ネットワークインターフェース作成（**接続条件 3-4.** が実施）

ここで **接続条件 3.** は、全てのソフトウェアを予めインストールした **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** が用意されており、これを利用することでそのインストールを省略することが可能です。  
この **クラスタ・ネットワーキングイメージ** は、 **接続条件 3-3.** と **接続条件 3-4.** のユーティリティソフトウェアの提供方法について、 **[Oracle Cloud Agent](https://docs.oracle.com/ja-jp/iaas/Content/Compute/Tasks/manage-plugins.htm)** （以降 **OCA** と呼称）の2個のHPCプラグインを使用するイメージと、個別RPMとしてインストールされているイメージが存在し、これらのユーティリティソフトウェアが実施する **接続処理 1.** と **接続処理 2.** の実行方法が異なります。  
**クラスタネットワーキングイメージ** を適切に選択する方法は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** を参照してください。

下表は、 **OCA** HPCプラグインを使用する場合と個別RPMの機能を使用する場合の **クラスタ・ネットワーク** 接続方法をまとめています。

|   |  使用する **OCA** HPCプラグイン | 使用するRPM・<br>Systemdサービス | 使用する<br>**クラスタ・ネットワーキングイメージ** 名<br>の先頭（※2）                            | 
| :-: | :-: |:------------------------: | :---------------------------: | 
|  **OCA** HPC<br>プラグイン    | Compute HPC RDMA Authentication<br>Compute HPC RDMA Auto-Configuration                         |oracle-cloud-agent<br>oracle-cloud-agent-updater         | OracleLinux-8-OCA<br>OracleLinux-7-OCA              |
| 個別RPM   | -                         | oci-cn-auth<br>oci-cn-auth-renew<br>oci-rdma-configure<br>oci-hpc-dapl-configure<br>oci-hpc-mlx-configure |OracleLinux-8-RHCK<br>OracleLinux-7-RHCK |

※2）詳細は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** を参照してください。

また下表は、それぞれの接続方法の利得表で、自身の要件に合わせてどちらの方法を使用するかを判断します。  
特別な要件が無ければ、 **OCA** HPCプラグインを使用する方法を選択します。

|         | 利点                            | 欠点                                 |
| :-----: | :---------------------------: | :--------------------------------: |
| **OCA**<br>HPCプラグイン | インスタンスデプロイ後に接続完了              | **OCA** 常駐によるCPUリソース消費（※3） |
| 個別RPM   | **OCA** 停止によるCPUリソース消費抑止が可能（※3） | インスタンスデプロイ後に接続処理が必要                |

※3）計算/GPUノード上で **OCA** がCPUリソースを消費するため、これによるアプリケーションのスケーラビリティへの影響を指しています。この詳細は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[不要サービス停止によるパフォーマンスチューニング方法](/ocitutorials/hpc/benchmark/stop-unused-service/)** を参照してください。

なお、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[HPCクラスタ](/ocitutorials/hpc/#1-1-hpcクラスタ)** カテゴリのチュートリアルは、全て **OCA** HPCプラグインを使用する方法を採用しています。

以上を踏まえて以降では、 **クラスタ・ネットワーキングイメージ** を使用して **クラスタ・ネットワーク** に接続する際、 **OCA** HPCプラグインを使用する場合と個別RPMを使用する場合について、それぞれの手順を解説します。

***
# 1. OCA HPCプラグインでクラスタ・ネットワークに接続する方法

## 1-0. 概要

本章は、 **OCA** HPCプラグインを使用して **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続する手順を解説します。

本章の手順に従いインスタンスのデプロイが完了すると、インスタンス上で **クラスタ・ネットワーク** との802.1X認証と **クラスタ・ネットワーク** 接続用ネットワークインターフェース作成が完了し、 **クラスタ・ネットワーク** に接続された状態となります。

この際、 **クラスタ・ネットワーク** 用のネットワークインターフェースは、 **10.224.0.0/12** のIPアドレス範囲が割当てられます。  
このIPアドレス範囲は、変更することが可能です。

また **OCA** HPCプラグインは、インスタンスが接続するサブネットが特定の条件を満たしていることをその動作条件とします。

以降では、以下のステップでその手順を解説します。

1. **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** の特定
2. 接続サブネットの動作条件充足確認
3. インスタンスのデプロイ
4. ネットワークアドレスのデフォルトからの変更

なおステップ **4.** は、ネットワークインターフェースに割り当てるIPアドレスがデフォルトのままでよい場合、スキップします。

## 1-1. クラスタネットワーキングイメージの特定

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** を参照し、使用する **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を特定します。  
この際、一覧表の **ユーティリティ提供方法** 列が **OCA HPCプラグイン** となっているものから選択します。

## 1-2. 接続サブネットの動作条件充足確認

**OCA** HPCプラグインは、動作時に以下の外部サービスサーバにアクセスします。

- **OCA** サービスエンドポイント（※4）
- インスタンスが参照するYUMレポジトリサーバ

※4）**[Oracle Services Network](https://docs.oracle.com/ja-jp/iaas/Content/Network/Tasks/servicegateway.htm#oracle-services)** 内に存在します。

![システム構成図](/ocitutorials/hpc/spinup-cluster-network/architecture_diagram.png)

このため、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を使用する計算/GPUノードが通常接続するプライベートサブネットは、以下の条件を満たしている必要があります。

- **ルート表** に **Oracle Services Network** へのルーティングが存在する
    - **NAT** ゲートウェイを介するインターネットへのルーティング  
    or
    - **サービス・ゲートウェイ** を介する **Oracle Services Network** へのルーティング
- **ルート表** にYUMレポジトリサーバへのルーティングが存在する（※5）
- **セキュリティ・リスト** の **イグレス・ルール** にステートフルな **Oracle Services Network** へのアクセス許可が存在する
- **セキュリティ・リスト** の **イグレス・ルール** にステートフルなYUMレポジトリサーバへのアクセス許可が存在する（※5）

※5）OSに **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を含む **OCI** から提供するイメージを使用する場合は、参照するYUMレポジトリサーバが **Oracle Services Network** に存在するため、これらの設定は不要です。


関連する **OCI** 公式ドキュメントは、 **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/Compute/Tasks/manage-plugins-troubleshooting.htm#verifyservices)** を参照してください。


## 1-3. インスタンスのデプロイ

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[2. クラスタネットワーキングイメージ指定方法](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#2-クラスタネットワーキングイメージ指定方法)** を参照し、特定した **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を指定してインスタンスをデプロイします。  
この際、 **[2-1. OCIコンソールを使用する方法](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#2-1-ociコンソールを使用する方法)** の場合は、ここで作成する **[インスタンス構成](/ocitutorials/hpc/#5-7-インスタンス構成)** の以下 **インスタンス構成の作成** 画面の **拡張オプションの表示** ボタンをクリックし、

![画面ショット](console_page01.png)

表示される画面の **Oracle Cloudエージェント** タブをクリックし、表示される以下 **Oracle Cloudエージェント** タブで以下の項目をチェックします。

- **Compute HPC RDMA Auto-Configuration**
- **Compute HPC RDMA Authentication**

![画面ショット](console_page02.png)

インスタンスのデプロイが完了して暫くすると、当該インスタンスの **Oracle Cloudエージェント** タブで、以下プラグインの **ステータス** が **実行中** になり、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** への接続が完了しています。

- **Compute HPC RDMA Auto-Configuration**
- **Compute HPC RDMA Authentication**

![画面ショット](console_page03.png)

## 1-4. ネットワークアドレスのデフォルトからの変更

**OCA** HPCプラグインを使用した **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 接続用ネットワークインターフェースへのIPアドレス付与は、その設定ファイルである **/etc/oracle-cloud-agent/plugins/oci-hpc/oci-hpc-configure/rdma_network.json** （※4）をもとに行われ、使用するネットワークアドレスをこの設定ファイル中の変数 **rdma_network** ・ **netmask** ・ **override_netconfig_netmask** の値から読み取ります。

※4）この設定ファイルが存在しない場合は、 **192.168.0.0/16** のネットワークアドレス範囲のIPアドレスを **クラスタ・ネットワーク** 接続用ネットワークインターフェースに付与します。

これらの値は、 **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** に **10.224.0.0/12** のネットワークアドレスを使用するよう埋め込まれているため（※5）、計算ノードのデプロイ直後はこのネットワークアドレスに属するIPアドレスがネットワークインターフェースに割当てられます。

※5）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** を使用した場合です。
  
これを変更する場合は、以下のようにこの設定ファイルを修正し、

```sh
$ sudo diff /etc/oracle-cloud-agent/plugins/oci-hpc/oci-hpc-configure/rdma_network.json_org /etc/oracle-cloud-agent/plugins/oci-hpc/oci-hpc-configure/rdma_network.json
6c6
<             "rdma_network": "10.224.0.0/12",
---
>             "rdma_network": "192.168.0.0/24",
13,14c13,14
<             "netmask": "255.240.0.0", 
<             "override_netconfig_netmask": "255.240.0.0"
---
>             "netmask": "255.255.255.0", 
>             "override_netconfig_netmask": "255.255.255.0"
$
```

ネットワークインターフェース設定ファイル（**/etc/sysconfig/network-scripts/ifcfg-rdma0**）を削除後、 **OCA** サービスとネットワークインターフェースを再起動します。

```sh
$ sudo rm /etc/sysconfig/network-scripts/ifcfg-rdma0
$ sudo systemctl restart oracle-cloud-agent.service
$ sudo ifdown rdma0
$ sudo ifup rdma0
```

これにより、以下のように **仮想クラウド・ネットワーク** にTCP接続する **eth0** にDHCPから割当てられたIPアドレス **10.0.2.51/24** を元に、 **クラスタ・ネットワーク** 接続用ネットワークインターフェース **rdma0** に **192.168.0.51/24** が割当てられることがわかります。（ **BM.Optimized3.36** での実行例）

```sh
$ ip a s eth0; ip a s rdma0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9000 qdisc mq state UP group default qlen 1000
    link/ether e8:eb:d3:73:94:f0 brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.51/24 brd 10.0.2.255 scope global dynamic eth0
       valid_lft 80676sec preferred_lft 80676sec
    inet6 fe80::eaeb:d3ff:fe73:94f0/64 scope link 
       valid_lft forever preferred_lft forever
4: rdma0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 4220 qdisc mq state UP group default qlen 20000
    link/ether 94:6d:ae:06:d8:d0 brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.51/24 brd 192.168.0.255 scope global noprefixroute rdma0
       valid_lft forever preferred_lft forever
    inet6 fe80::966d:aeff:fe06:d8d0/64 scope link 
       valid_lft forever preferred_lft forever
$
```

インスタンスのデプロイ直後から変更後のネットワークアドレスで **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続するには、設定ファイル修正後の状態で当該インスタンスの **[カスタム・イメージ](/ocitutorials/hpc/#5-6-カスタムイメージ)** を取得し、これを使用してインスタンスをデプロイします。  
**カスタム・イメージ** を使用したインスタンスのデプロイ方法は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[計算/GPUノードデプロイ時の効果的なOSカスタマイズ方法](/ocitutorials/hpc/tech-knowhow/compute-os-customization/)** の **[2. カスタム・イメージを使用したOSカスタマイズ](/ocitutorials/hpc/tech-knowhow/compute-os-customization/#2-カスタムイメージを使用したosカスタマイズ)** を参照してください。

***
# 2. 個別RPMを使用してクラスタ・ネットワークに接続する方法

## 2-0. 概要

本章は、個別RPMを使用して **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続する手順を解説します。

本章の手順に従いネットワークインターフェースへのIPアドレス付与が完了すると、インスタンス上で **クラスタ・ネットワーク** との802.1X認証と **クラスタ・ネットワーク** 接続用ネットワークインターフェース作成が完了し、 **クラスタ・ネットワーク** に接続された状態となります。

この際、 **クラスタ・ネットワーク** 用のネットワークインターフェースは、 **192.168.0.0/xx** のIPアドレス範囲が割当てられます。ここで **xx** のサブネットマスクは、 **仮想クラウド・ネットワーク** にプライマリVNICで接続するネットワークインターフェースに使用するものと同じものが使用されます。  
このIPアドレス範囲は、変更することが可能です。

以降では、以下のステップで手順を解説します。

- 個別RPM対応 **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** の特定
- 特定した **クラスタ・ネットワーキングイメージ** を指定したインスタンスのデプロイ
- **クラスタ・ネットワーク** 接続用ネットワークインターフェースへのIPアドレス付与
- ネットワークアドレスのデフォルトからの変更

## 2-1. 個別RPM対応クラスタネットワーキングイメージの特定

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** を参照し、使用する **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を特定します。  
この際、一覧表の **ユーティリティ提供方法** 列が **個別RPM** となっているものから選択します。

## 2-2. 特定したクラスタ・ネットワーキングイメージを指定したインスタンスのデプロイ

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[2. クラスタネットワーキングイメージ指定方法](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#2-クラスタネットワーキングイメージ指定方法)** を参照し、特定した **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を指定してインスタンスをデプロイします。

## 2-3. クラスタ・ネットワーク接続用ネットワークインターフェースへのIPアドレス付与

以下コマンドをデプロイしたインスタンスのopcユーザで実行します。

```sh
$ sudo systemctl start oci-rdma-configure.service
```

次に、以下コマンドをデプロイしたインスタンスのopcユーザで実行し、IPアドレスが付与されていることを確認します。

```sh
$ sudo ifconfig ens800f0np0
ens800f0np0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.168.0.107  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::bace:f6ff:fe6f:407c  prefixlen 64  scopeid 0x20<link>
        ether b8:ce:f6:6f:40:7c  txqueuelen 20000  (Ethernet)
        RX packets 14  bytes 4599 (4.4 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 37  bytes 7707 (7.5 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

$
```

## 2-2. ネットワークアドレスのデフォルトからの変更

本章は、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** の接続に使用するネットワークアドレスをデフォルトの **192.168.0.0/xx** から変更する方法を解説します。  
なお、デフォルトのまま使用する場合は、本章の手順を実施する必要はありません。

**oci-rdma-configure** を使用した **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 接続用ネットワークインターフェースへのIPアドレス付与は、その設定ファイルである **/etc/oci-hpc/rdma-network.conf** をもとに行われ、使用するネットワークアドレスをこの設定ファイル中の変数 **rdma_network** の値から読み取ります。  
そこでデフォルトの **192.168.0.0/xx** からアドレスを変更するには、以下のようにこの設定ファイルを修正し、 **oci-rdma-configure** サービスを起動します。

```sh
$ diff /etc/oci-hpc/rdma-network.conf_org /etc/oci-hpc/rdma-network.conf
38c38
< rdma_network=192.168.0.0/255.255.0.0
---
> rdma_network=192.169.0.0/255.255.0.0
$ sudo systemctl start oci-rdma-configure
$
```

これにより、以下のように仮想クラウド・ネットワークにTCP接続する **ens300f0np0** にDHCPから割当てられたIPアドレス **10.0.2.229/24** を元に、 **クラスタ・ネットワーク** 接続用ネットワークインターフェース **ens800f0np0** に **192.169.0.229/24** が割当てられることがわかります。（ **BM.Optimized3.36** での実行例）

```sh
$ ifconfig ens800f0np0
ens800f0np0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 4220
        inet 192.169.0.229  netmask 255.255.255.0  broadcast 192.169.0.255
        inet6 fe80::966d:aeff:fe00:a150  prefixlen 64  scopeid 0x20<link>
        ether 94:6d:ae:00:a1:50  txqueuelen 20000  (Ethernet)
        RX packets 12  bytes 4479 (4.3 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 41  bytes 7723 (7.5 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

$ ifconfig ens300f0np0
ens300f0np0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9000
        inet 10.0.2.229  netmask 255.255.255.0  broadcast 10.0.2.255
        inet6 fe80::eaeb:d3ff:fe74:1ca4  prefixlen 64  scopeid 0x20<link>
        ether e8:eb:d3:74:1c:a4  txqueuelen 1000  (Ethernet)
        RX packets 148884  bytes 1002833912 (956.3 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 183238  bytes 1022265481 (974.9 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

$
```