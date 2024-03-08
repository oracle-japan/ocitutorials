---
title: "サイト間VPNによるOCIとの拠点間接続方法"
excerpt: "HPC/機械学習ワークロードをオンプレミスからOCIに移行する際、多くのケースでオンプレミスとOCIを拠点間接続する必要が生じます。例えば、有償CAEアプリケーションのライセンスサーバがオンプレミス側に存在し、OCI側で稼働する計算ノードでこのライセンスサーバからライセンスを取得するケースです。本テクニカルTipsは、サイト間VPNを使用してIPSecのトンネルモードでオンプレミスとOCIを拠点間接続し、OCI側プライベートサブネットに接続する計算ノード相当のインスタンスとオンプレミス側プライベートサブネットに接続するライセンスサーバ相当のインスタンスの疎通を可能とするための手順を解説します。"
order: "362"
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

HPC/機械学習ワークロードをオンプレミスからOCIに移行する際、多くのケースでオンプレミスとOCIを拠点間接続する必要が生じます。  
例えば、有償CAEアプリケーションのライセンスサーバがオンプレミス側に存在し、OCI側で稼働する計算ノードでこのライセンスサーバからライセンスを取得するケースです。  
本テクニカルTipsは、 **[サイト間VPN](https://docs.oracle.com/ja-jp/iaas/Content/Network/Tasks/managingIPsec.htm)** を使用してIPSecのトンネルモードでオンプレミスとOCIを拠点間接続し、OCI側プライベートサブネットに接続する計算ノード相当のインスタンスとオンプレミス側プライベートサブネットに接続するライセンスサーバ相当のインスタンスの疎通を可能とするための手順を解説します。

**注意 :** 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。

***
# 0. 概要

**サイト間VPN** は、IPSecのトンネルモードでオンプレミスのネットワークとOCIの **仮想クラウド・ネットワーク** をIP層で拠点間接続するため、以下のような利用形態をシームレスに実現することが可能です。

1. OCIで稼働する計算ノードでオンプレミスのライセンスサーバから有償CAEアプリケーションのライセンスを取得する
2. オンプレミスの端末からOCIで稼働するログインノードにログインしインタラクティブ処理を行う
3. オンプレミスの端末からOCIで稼働するログインノードにシミュレーションに必要なファイルを転送する
4. OCIで稼働するログインノードからシミュレーションの結果ファイルをオンプレミスの端末に転送する

また **サイト間VPN** は、サービス自体は無償のサービスでパブリックインターネットを拠点間接続回線に利用するため、OCIからオンプレミスに向けた転送データ量が少ない利用形態 **1.** から **3.** のケースでは、他の有料専用線サービスと比較し、価格を抑えた拠点間接続が可能です。  
また **サイト間VPN** を介する拠点間の通信帯域は、使用するインターネット接続回線に十分な性能がある場合、サービス自体の性能上限として250Mbps程度を期待することが出来ます。（詳細は、 **[ここ](https://blogs.oracle.com/cloud-infrastructure/post/interconnecting-clouds-with-oracle-cloud-infrastructure)** を参照ください。）このため、高い通信帯域を必要としない前述の利用形態 **1.** や **2.** のケースに於いては、パフォーマンス的にも十分な拠点間接続方法であると言えます。

ここでオンプレミス側のVPN接続機器は、どのように用意したらよいでしょうか。  
これには、以下の選択肢があります。

1. VPNアプライアンス製品（※1）を使用する
2. サーバ上で動作するIPSec実装（※2）/BGP実装を使用する（※3）

※1） **サイト間VPN** サービスで検証された **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/Network/Reference/CPElist.htm)** に記載のVPNアプライアンス製品から選択します。  
※2） **サイト間VPN** サービスで検証された **[Libreswan](https://libreswan.org/)** か **[strongSwan](https://www.strongswan.org/)** から選択します。  
※3）本テクニカルTipsは、サイト間のルーティングに静的ルーティングとBGP動的ルーティングの2通りの方法を紹介し、それぞれで以下のオープンソースのソフトウェア実装を使用します。

| ルーティング | IPSec実装       | BGP実装                                        |
| :----: | :-----------: | :------------------------------------------: |
| 静的     | **Libreswan** | -                                            |
| BGP動的     | **Libreswan** | **[FRR（FRRouting）](https://frrouting.org/)** |

このため、オンプレミスで既に **サイト間VPN** サービスで検証されたVPNアプライアンス製品が稼働している場合は選択肢 **1.** を採用し、それ以外であれば選択肢 **2.** が有力な候補となります。

本テクニカルTipsは、VPN接続機器に選択肢 **2.** を使用し、これをオンプレミスのネットワークに模したOCIの **仮想クラウド・ネットワーク** （以降"左側サイト"と呼称）に作成、左側サイトとは異なるリージョンに作成する **仮想クラウド・ネットワーク** （以降"右側サイト"と呼称）を **サイト間VPN** で拠点間接続する手順を解説します。  
このため、本テクニカルTipsの左側サイトに関連する構築手順をオンプレミスのネットワークと選択肢 **1.** で採用するVPNアプライアンス製品の該当する手順に置き換えることで、自身の環境に合わせたOCIとの拠点間接続構築手順に応用することが出来ます。

以下は、本テクニカルTipsで想定するシステム構成図です。

![画面ショット](architecture_diagram_st.png)
<br>
<br>
<br>
![画面ショット](architecture_diagram_dy.png)

記載されるネットワークアドレス等は、自身の環境のものに読みかえてご利用ください。

また本テクニカルTipsは、拠点間が想定通り接続されていることを確認するため、左側サイトのプライベートネットワークに接続するライセンスサーバ相当のインスタンスと右側サイトのプライベートサブネットに接続する計算ノード相当のインスタンス間でpingとSSHによる疎通確認を行います。

次章以降では、以下の順に解説を進めます。

1. 左側サイト用ネットワーク関連リソース作成
2. 右側サイト用 **仮想クラウド・ネットワーク** と関連リソース作成
3. Libreswan用インスタンスとその他インスタンス作成
4. Libreswan用インスタンスセットアップ
5. 拠点間接続関連リソース作成
6. **Libreswan** ・ **FRR**インストール・セットアップ
7. ライセンスサーバ・計算ノード間疎通確認

なお、VPN接続機器にVPNアプライアンス製品を使用する場合は、手順 **3.** のLibreswan用インスタンスの作成と手順 **4.** をスキップし、手順 **6.** を自身のVPNアプライアンス製品の手順に置き換えて実施します。

**サイト間VPN** サービスで検証されたVPNアプライアンス製品での接続手順は、以下の情報が参考になります。

- **[CPE構成ヘルパー](https://docs.oracle.com/ja-jp/iaas/Content/Network/Tasks/CPEconfigurationhelper.htm)**  
VPNアプライアンス製品を構成するために必要な、手順 **5.** で作成したOCI関連リソース情報をOCIコンソールから収集するヘルパーツールです。利用方法は、 **[CPE構成ヘルパー利用方法](#cpe構成ヘルパー利用方法)** を参照してください。
- 各VPNアプライアンス製品毎に用意されているOCIドキュメント  
**[ここ](https://docs.oracle.com/ja-jp/iaas/Content/Network/Reference/CPElist.htm)** の該当するVPNアプライアンス製品の構成列とビデオ列の情報を参照してください。

***
# 1. 左側サイト用ネットワーク関連リソース作成

本章は、以下の左側サイト用ネットワーク関連リソースを作成します。  
ここで本テクニカルTipsの左側サイトのネットワーク関連リソースは、右側サイトと同一テナンシーの異なるリージョンに作成する **仮想クラウド・ネットワーク** と関連するリソースでこれを模しており、適宜オンプレミスのネットワークとこれを構成するネットワーク機器での手順に置き換えて作成してください。

1. **仮想クラウド・ネットワーク** （192.168.0.0/16）
2. パブリックサブネット（192.168.1.0/24）
3. プライベートサブネット（192.168.2.0/24）
4. **インターネット・ゲートウェイ**
5. パブリックサブネット用 **ルート表**
6. プライベートサブネット用 **ルート表**
7. パブリックサブネット用 **セキュリティ・リスト**
8. プライベートサブネット用 **セキュリティ・リスト**

**ルート表** に含める **ルート・ルール** は、下表のとおりです。

| 対象サブネット | Destination | Gateway            | Purpose                  |
| :-----: | :---------: | :----------------: | ------------------------ |
| パブリック   | 0.0.0.0/0   | **インターネット・ゲートウェイ** | 右側サイトとのトラフィック            |
| プライベート  | 10.0.0.0/16 | 192.168.1.42 （※4）  | 右側サイトプライベートサブネットとのトラフィック |

※4）Libreswan用インスタンスのパブリックサブネット接続プライベートIPアドレスです。**[3. Libreswan用インスタンスとその他インスタンス作成](#3-libreswan用インスタンスとその他インスタンス作成)** を実施してIPアドレスを確定、 **[4. Libreswan用インスタンスセットアップ](#4-libreswan用インスタンスセットアップ)** のステップ **1.** を実施後、この **ルート・ルール** を作成します。

また **セキュリティ・リスト** は、下表のとおりです。

| 対象サブネット | Direction | Source/<br>Destination | Protocol | Stateless  | Purpose                                         |
| :-----: | :-------: | :--------------------: | :------: | :--------: | ----------------------------------------------- |
| パブリック   | Ingress   | 192.168.0.0/16         | All      | No         | 左側サイトプライベートサブネットからのアクセス                         |
|         | Egress    | 0.0.0.0/0              | All      | No<br>（※5） | 左側サイトプライベートサブネットへのアクセス<br>右側サイトへのアクセス           |
| プライベート  | Ingress   | 192.168.0.0/16         | ALL      | No         | 左側サイトパブリックサブネットからのアクセス                          |
|         | Ingress   | 10.0.0.0/16            | All      | No         | 右側サイトプライベートサブネットからのアクセス                         |
|         | Egress    | 0.0.0.0/0              | All      | No         | 左側サイトパブリックサブネットへのアクセス<br>右側サイトプライベートサブネットへのサクセス |

※5）**IPSec接続** 作成時 **Libreswan** が **ステートフル・エグレス** ルールで右側サイトからのアクセスを受け入れるために必要です。

***
# 2. 右側サイト用仮想クラウド・ネットワークと関連リソース作成

本章は、以下の右側サイト用 **仮想クラウド・ネットワーク** と関連リソースを作成します。

1. **仮想クラウド・ネットワーク** （10.0.0.0/16）
2. パブリックサブネット（10.0.1.0/24）
3. プライベートサブネット（10.0.2.0/24）
4. **インターネット・ゲートウェイ**
5. **NATゲートウェイ**
6. パブリックサブネット用 **ルート表**
7. プライベートサブネット用 **ルート表**
8. パブリックサブネット用 **セキュリティ・リスト**
9. プライベートサブネット用 **セキュリティ・リスト**

**ルート表** に含める **ルート・ルール** は、下表のとおりです。

| 対象サブネット | Destination    | Gateway            | Purpose                  |
| :-----: | :------------: | :----------------: | ------------------------ |
| パブリック   | 0.0.0.0/0      | **インターネット・ゲートウェイ** |    インターネットとのトラフィック |
| プライベート  | 0.0.0.0/0      | **NATゲートウェイ**      | インターネットとのトラフィック          |
|         | 192.168.0.0/16 |  **動的ルーティング・ゲートウェイ**<br>（※6）            | 左側サイトプライベートサブネットとのトラフィック |

※6）**[5-1. 動的ルーティング・ゲートウェイ作成](#5-1-動的ルーティングゲートウェイ作成)** で **動的ルーティング・ゲートウェイ** を作成後、この **ルート・ルール** を追加します。

また **セキュリティ・リスト** は、下表のとおりです。

| 対象サブネット | Direction | Source/<br>Destination | Protocol | Stateless | Purpose                                         |
| :-----------: | :---------: | :------------------: | :--------: | :---------: | ----------------------------------------------- |
| パブリック      | Ingress   | 10.0.0.0/16        | All      | No        | 右側サイトプライベートサブネットからのアクセス                         |
|             | Ingress   | 0.0.0.0/0          | TCP:22   | No        | インターネットからのSSHアクセス                               |
|             | Egress    | 0.0.0.0/0          | All      | No        | 右側サイトプライベートサブネットへのアクセス<br>インターネットへのアクセス         |
| プライベート      | Ingress   | 10.0.0.0/16        | All      | No        | 右側サイトパブリックサブネットからのアクセス                          |
|             | Ingress   | 192.168.0.0/16     | All      | No        | 左側サイトプライベートサブネットからのアクセス                         |
|             | Egress    | 0.0.0.0/0          | All      | No        | 右側サイトパブリックサブネットへのアクセス<br>左側サイトプライベートサブネットへのサクセス |

これらのリソース作成方法は、 **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の **[その2 - クラウドに仮想ネットワーク(VCN)を作る](https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn)** を参照してください。

***
# 3. Libreswan用インスタンスとその他インスタンス作成

本章は、拠点間接続を実現・検証するために必要な下表の4インスタンスを作成します。


| インスタンス    | 用途                 | 作成するサイト | 接続するサブネット | firewalld停止 |
| :-------: | :----------------: | :-------: | :-------: | :---------: |
| Libreswan | Libreswan稼働用       | 左側        | パブリック     | 未適用         |
| lic-srv   | オンプレミスライセンスサーバ相当 | 左側        | プライベート    | 適用          |
| Bastion   | Computeインスタンスへの踏み台 | 右側        | パブリック     | 未適用         |
| Compute   | 計算ノード相当            | 右側        | プライベート    | 適用          |

これらインスタンスの作成方法は、 **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の  **[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** を参照してください。

本テクニカルTipsでは、これらのインスタンスにOSを **Oracle Linux** 8.9とする任意の **仮想マシン・インスタンス** を使用します。  
この際、後の疎通確認を行うため、表中に記載の該当するインスタンスでfirewalldサービスを停止します。

***
# 4. Libreswan用インスタンスセットアップ

本章は、Libreswan用インスタンスをVPN接続装置として機能させるために必要なセットアップ作業を行います。  
具体的には、以下の手順を実施します。

- ソース/宛先チェックのスキップ（※7）
- パケット転送を許可するためのカーネルパラメータ設定追加
- 拠点間接続で接続する右側サイトのサブネットアドレスからのアクセスをfirewalldに許可

※7）デフォルトで許可されていない **VNIC** のパケット転送設定を変更し、これを許可します。

1. ソース/宛先チェックのスキップ  
OCIコンソールにログインし、Libreswan用インスタンスの **インスタンスの詳細** 画面左側の **アタッチされたVNIC** メニューをクリックし、表示される以下 **アタッチされたVNIC** 画面の **プライマリVNIC** の **VNICの編集** メニューをクリックします。

    ![画面ショット](console_page01.png)

    表示される以下 **VNICの編集** サイドバーで、 **ソース/宛先チェックのスキップ** チェックボックスをチェックし、 **変更の保存** ボタンをクリックします。

    ![画面ショット](console_page02.png)

2. パケット転送を許可するためのカーネルパラメータ設定追加  
Libreswan用インスタンスで **/etc/sysctl.conf** に以下の行を追加します。

    ```sh
    $ diff /etc/sysctl.conf_org /etc/sysctl.conf
    13a14,24
    > 
    > net.ipv4.ip_forward = 1
    > net.ipv4.conf.all.accept_redirects = 0
    > net.ipv4.conf.all.send_redirects = 0
    > net.ipv4.conf.default.send_redirects = 0
    > net.ipv4.conf.ens3.send_redirects = 0
    > net.ipv4.conf.default.accept_redirects = 0
    > net.ipv4.conf.ens3.accept_redirects = 0
    > net.ipv4.conf.all.rp_filter = 0
    > net.ipv4.conf.default.rp_filter = 0
    > net.ipv4.conf.ens3.rp_filter = 0
    $
    ```

    Libreswan用インスタンスのopcユーザで以下コマンドを実行し、先の変更を有効化します。

    ```sh
    $ sudo sysctl -p
    ```

3. 拠点間接続で接続する右側サイトのサブネットアドレスからのアクセスをfirewalldに許可  
Libreswan用インスタンスのopcユーザで以下コマンドを実行し、拠点間接続で接続する右側サイトのサブネットアドレス（ここではプライベートサブネットの **10.0.2.0/24**）からのアクセスをfirewalldに許可し、その設定を確認します。

    ```sh
    $ sudo firewall-cmd --permanent --add-service="ipsec"
    success
    $ sudo firewall-cmd --permanent --zone=trusted --add-source=10.0.2.0/24
    success
    $ sudo firewall-cmd --reload
    success
    $ sudo firewall-cmd --zone=trusted --list-all
    trusted (active)
    target: ACCEPT
    icmp-block-inversion: no
    interfaces: 
    sources: 10.0.2.0/24
    services: 
    ports: 
    protocols: 
    forward: no
    masquerade: no
    forward-ports: 
    source-ports: 
    icmp-blocks: 
    rich rules: 
    $ 
    ```

***
# 5. 拠点間接続関連リソース作成

## 5-0. 概要

本章は、以下の拠点間接続関連リソースを右側サイトに作成します。  
なお **IPSec接続** は、静的ルーティングとBGP動的ルーティングの2種類の作成手順を記載していますので、自身の環境に応じて選択して実施します。

- **動的ルーティング・ゲートウェイ**
- **仮想クラウド・ネットワーク・アタッチメント**
- **顧客構内機器** （CPE）
- **IPSec接続**

## 5-1. 動的ルーティング・ゲートウェイ作成

本章は、 **動的ルーティング・ゲートウェイ** を作成します。

1. OCIコンソールにログインし、右側サイトをデプロイする **リージョン** を選択後、 **ネットワーキング** → **仮想クラウド・ネットワーク** とメニューを辿り、表示される以下画面で **顧客接続性** メニューをクリックします。

    ![画面ショット](console_page03.png)

2. 表示される以下 **顧客接続性** 画面で、 **動的ルーティング・ゲートウェイ** メニューをクリックします。

    ![画面ショット](console_page04.png)

3. 表示される以下 **動的ルーティング・ゲートウェイ** 画面で、 **動的ルーティング・ゲートウェイの作成** ボタンをクリックします。

    ![画面ショット](console_page05.png)

4. 表示される以下 **動的ルーティング・ゲートウェイの作成** サイドバーで、 **名前** フィールドに付与する名称を入力して **動的ルーティング・ゲートウェイの作成** ボタンをクリックします。

    ![画面ショット](console_page06.png)

5. 作成した **動的ルーティング・ゲートウェイ** は、 **[2. 右側サイト用仮想クラウド・ネットワークと関連リソース作成](#2-右側サイト用仮想クラウドネットワークと関連リソース作成)** で作成したプライベートサブネット用 **ルート表** のGatewayとし、この **ルート・ルール** を作成します。

## 5-2. 仮想クラウド・ネットワーク・アタッチメント作成

本章は、先に作成した **動的ルーティング・ゲートウェイ** を  **仮想クラウド・ネットワーク** に接続する、 **仮想クラウド・ネットワーク・アタッチメント** 作成します。

1. 表示される以下 **仮想クラウド・ネットワーク・アタッチメント** フィールドで、 **仮想クラウド・ネットワーク・アタッチメントの作成** ボタンをクリックします。

    ![画面ショット](console_page07.png)

2. 表示される以下 **仮想クラウド・ネットワーク・アタッチメント作成** サイドバーで、 **仮想クラウド・ネットワーク** プルダウンメニューに先に作成した右側サイトの **仮想クラウド・ネットワーク** を選択し、 **仮想クラウド・ネットワーク・アタッチメントの作成** ボタンをクリックします。

    ![画面ショット](console_page08.png)

## 5-3. 顧客構内機器作成

本章は、 **顧客構内機器** を作成します。

1. OCIコンソールにログインし、右側サイトをデプロイする **リージョン** を選択後、 **ネットワーキング** → **仮想クラウド・ネットワーク** とメニューを辿り、表示される以下画面で **顧客接続性** メニューをクリックします。

    ![画面ショット](console_page03.png)

2. 表示される以下 **顧客接続性** 画面で、 **顧客構内機器** メニューをクリックします。

    ![画面ショット](console_page09.png)

3. 表示される以下 **顧客構内機器** 画面で、 **CPEの作成** ボタンをクリックします。

    ![画面ショット](console_page10.png)

4. 表示される以下 **CPEの作成** 画面で、以下の情報を入力し **CPEの作成** ボタンをクリックします。  
なお、ここに記載のないフィールドは、デフォルトのままとします。

    - **名前** ：**顧客構内機器** に付与する名前
    - **IPアドレス** ：Libreswan用インスタンスに付与されたグローバルIPアドレス（※8）
    - **ベンダー** ：**Libreswan**（※9）
    - **プラットフォームバージョン** ：**3.18 or later**（※9）

    ※8）VPNアプライアンス製品を利用する場合は、VPN接続機器のグローバルIPアドレスを指定します。  
    ※9）VPNアプライアンス製品を利用する場合は、利用する機器に合わせて選択します。

    ![画面ショット](console_page11.png)

## 5-4. IPSec接続作成

## 5-4-0. 概要

本章は、 **IPSec接続** を作成します。  
自身の環境に合わせて、静的ルーティングの手順とBGP動的ルーティングの手順から選択して実施します。

## 5-4-1. 静的ルーティングの場合

本章は、静的ルーティング用の **IPSec接続** を作成します。

1. OCIコンソールにログインし、右側サイトをデプロイする **リージョン** を選択後、 **ネットワーキング** → **仮想クラウド・ネットワーク** とメニューを辿り、表示される以下画面で **顧客接続性** メニューをクリックします。

    ![画面ショット](console_page03.png)

2. 表示される以下 **顧客接続性** 画面で、 **サイト間VPN** メニューをクリックします。

    ![画面ショット](console_page12.png)

3. 表示される以下 **サイト間VPN** 画面で、 **IPSec接続の作成** ボタンをクリックします。

    ![画面ショット](console_page13.png)

4. 表示される以下 **IPSec接続の作成** サイドバーで、以下の情報を入力し **IPSec接続の作成** ボタンをクリックします。  
なお、ここに記載のないフィールドは、デフォルトのままとします。

    - **名前** ：**IPSec接続** に付与する名前
    - **顧客構内機器** ：先に作成した **顧客構内機器**
    - **動的ルーティング・ゲートウェイ** ：先に作成した **動的ルーティング・ゲートウェイ**
    - **オンプレミス・ネットワークへのルート** ：**192.168.2.0/24**（※10）
    - **トンネル1** の **ルーティング・タイプ** ：**静的ルーティング**
    - **トンネル2** の **ルーティング・タイプ** ：**静的ルーティング**

    ※10）作成する **IPSec接続** を介して通信する左側サイトのサブネット（ここではプライベートサブネットの **192.168.2.0/24**）を指定します。

    ![画面ショット](console_page14.png)  
    ![画面ショット](console_page15.png)  
    ![画面ショット](console_page16.png)

5. 表示される以下画面の **トンネル** フィールドで、 **名前** 列の末尾が1と2になっているトンネル1とトンネル2が作成され、 **ライフサイクル状態** 列が何れも **使用可能** で **IPSecステータス** 列が何れも **停止** となることを確認します。  
この **IPSecステータス** 列は、 **[6-1. Libreswanインストール・セットアップ](#6-1-libreswanインストールセットアップ)** の手順が完了すると、 **稼働中** になります。  
また、 **Oracle VPN IPアドレス** 列の各トンネルのグローバルIPアドレスを後の手順のために記録します。

    ![画面ショット](console_page17.png)

6. 前の画面の **名前** 列のトンネル1をクリックし、表示される以下画面の **トンネル情報** タブの **共有シークレット** フィールドの **表示** ボタンをクリックし、表示されるトンネル1の共有シークレットを記録します。

    ![画面ショット](console_page18.png)

7. 同様に、トンネル2の共有シークレットを記録します。

## 5-4-2. BGP動的ルーティングの場合

本章は、BGP動的ルーティング用の **IPSec接続** を作成します。

1. OCIコンソールにログインし、右側サイトをデプロイする **リージョン** を選択後、 **ネットワーキング** → **仮想クラウド・ネットワーク** とメニューを辿り、表示される以下画面で **顧客接続性** メニューをクリックします。

    ![画面ショット](console_page03.png)

2. 表示される以下 **顧客接続性** 画面で、 **サイト間VPN** メニューをクリックします。

    ![画面ショット](console_page12.png)

3. 表示される以下 **サイト間VPN** 画面で、 **IPSec接続の作成** ボタンをクリックします。

    ![画面ショット](console_page13.png)

4. 表示される以下 **IPSec接続の作成** サイドバーで、以下の情報を入力し **IPSec接続の作成** ボタンをクリックします。  
なお、ここに記載のないフィールドは、デフォルトのままとします。

    - **名前** ：**IPSec接続** に付与する名前
    - **顧客構内機器** ：先に作成した **顧客構内機器**
    - **動的ルーティング・ゲートウェイ** ：先に作成した **動的ルーティング・ゲートウェイ**
    - **トンネル1** の **BGP ASN** ：左側サイトのAS番号（※11）
    - **トンネル1** の **IPv4トンネル内インタフェース - CPE** ： **IPSec接続** のトンネル1内のBGPピア接続に使用する **CPE** 側のIPアドレス（※12）
    - **トンネル1** の **IPv4トンネル内インタフェース - Oracle** ： **IPSec接続** のトンネル1内のBGPピア接続に使用する **動的ルーティング・ゲートウェイ** 側のIPアドレス（※12）
    - **トンネル2** の **BGP ASN** ：左側サイトのAS番号（※11）
    - **トンネル2** の **IPv4トンネル内インタフェース - CPE** ： **IPSec接続** のトンネル2内のBGPピア接続に使用する **CPE** 側のIPアドレス（※13）
    - **トンネル2** の **IPv4トンネル内インタフェース - Oracle** ： **IPSec接続** のトンネル2内のBGPピア接続に使用する **動的ルーティング・ゲートウェイ** 側のIPアドレス（※13）

    ※11）本テクニカルTipsでは、プライベートAS番号である **65000** を使用しますが、自身の環境に合わせて変更します。  
    ※12）30ビットか31ビットのサブネットマスクを持つ同一セグメント内の任意のIPアドレスが使用できますが、特に理由が無ければ以下を指定します。
    ※13）30ビットか31ビットのサブネットマスクを持つ同一セグメント内の任意のIPアドレスが使用できますが、特に理由が無ければ以下を指定します。

    | トンネル | CPE側IPアドレス  | 動的ルーティング・ゲートウェイ側<br>IPアドレス |
    | :--: | :--------------: | :--------------------------: |
    | 1    | 192.168.254.1/30 | 192.168.254.2/30             |
    | 2    | 192.168.254.5/30 | 192.168.254.6/30             |

    ![画面ショット](console_page14-2.png)  
    ![画面ショット](console_page15-2.png)  
    ![画面ショット](console_page15-3.png)  
    ![画面ショット](console_page16-2.png)  
    ![画面ショット](console_page16-3.png)  

5. 表示される以下画面の **トンネル** フィールドで、 **名前** 列の末尾が1と2になっているトンネル1とトンネル2が作成され、 **ライフサイクル状態** 列が何れも **使用可能** 、 **IPSecステータス** 列が何れも **停止** 、及び **IPv4 BGPステータス** 列が何れも **稼働中** となることを確認します。  
この **IPSecステータス** 列は、 **[6-1. Libreswanインストール・セットアップ](#6-1-libreswanインストールセットアップ)** の手順が完了すると、 **稼働中** になります。  
また、 **Oracle VPN IPアドレス** 列の各トンネルのグローバルIPアドレスを後の手順のために記録します。

    ![画面ショット](console_page17-2.png)

6. 前の画面の **名前** 列のトンネル1をクリックし、表示される以下画面の **トンネル情報** タブの **共有シークレット** フィールドの **表示** ボタンをクリックし、表示されるトンネル1の共有シークレットを記録します。

    ![画面ショット](console_page18-2.png)

7. 同様に、トンネル2の共有シークレットを記録します。

***
# 6. Libreswan・FRRインストール・セットアップ

## 6-0. 概要

本章は、Libreswan用インスタンスに **Libreswan** をインストール・セットアップし、IPSecの接続を確立します。  
この手順は、静的ルーティング・BGP動的ルーティングの何れを使用するかにかかわらず実施しますが、静的ルーティングにのみ実施する手順や静的ルーティングとBGP動的ルーティングで手順の異なる箇所があるため留意します。

またBGP動的ルーティングを使用する場合は、 **FRR** をインストール・セットアップし、BGPによるルーティング情報の配布を開始します。

## 6-1. Libreswanインストール・セットアップ

本章は、 **Libreswan** をインストール・セットアップします。  
この際、 **ステップ 2.** は静的ルーティングとBGP動的ルーティングで手順が異なり、 **ステップ 3.** は静的ルーティングの場合のみ実施します。

- **Libreswan** インストール  
Libreswan用インスタンスのopcユーザで以下コマンドを実行し、 **Libreswan** をインストールします。

    ```sh
    $ sudo dnf install -y libreswan
    ```

- **Libreswan** 設定ファイル作成  
Libreswan用インスタンスで、以下2個の **Libreswan** 設定ファイルを作成します。  
なお **oci-ipsec.conf** は、静的ルーティングとBGP動的ルーティングで異なるファイルを使用します。

[/etc/ipsec.d/oci-ipsec.conf（静的ルーティング用）]

```sh
conn oracle-tunnel-1
     left=192.168.1.42
     leftid=CPE_global_IP
     right=Tunnel1_global_IP
     authby=secret
     leftsubnet=192.168.2.0/24
     rightsubnet=10.0.2.0/24
     auto=start
     mark=5/0xffffffff # Needs to be unique across all tunnels
     vti-interface=vti01
     vti-routing=no
     ikev2=no # To use IKEv2, change to ikev2=insist
     ike=aes_cbc256-sha2_384;modp1536
     phase2alg=aes_gcm256;modp1536
     encapsulation=yes
     ikelifetime=28800s
     salifetime=3600s
conn oracle-tunnel-2
     left=192.168.1.42
     leftid=CPE_global_IP
     right=Tunnel2_global_IP
     authby=secret
     leftsubnet=192.168.2.0/24
     rightsubnet=10.0.2.0/24
     auto=start
     mark=6/0xffffffff # Needs to be unique across all tunnels
     vti-interface=vti02
     vti-routing=no
     ikev2=no # To use IKEv2, change to ikev2=insist
     ike=aes_cbc256-sha2_384;modp1536
     phase2alg=aes_gcm256;modp1536
     encapsulation=yes
     ikelifetime=28800s
     salifetime=3600s
```

※14）下表を参考に、設定ファイル中の設定値を自身の環境に合わせて修正します。

| 変数名         | 設定値                                        |
| :---------: | ------------------------------------------ |
| left        | Libreswan用インスタンスのパブリックサブネット接続用プライベートIPアドレス |
| leftid      | Libreswan用インスタンスのパブリックIPアドレス               |
| right       | **IPSec接続** の各トンネルに割り当てられたグローバルIPアドレス      |
| leftsubnet  | 拠点間接続で接続する左側サイトのサブネットアドレス                  |
| rightsubnet | 拠点間接続で接続する右側サイトのサブネットアドレス                  |

[/etc/ipsec.d/oci-ipsec.conf（BGP動的ルーティング用）]

```sh
conn oracle-tunnel-1
     left=%defaultroute
     leftid=CPE_global_IP
     right=Tunnel1_global_IP
     rightid=Tunnel1_global_IP
     authby=secret
     leftsubnet=0.0.0.0/0
     rightsubnet=0.0.0.0/0
     auto=start
     mark=5/0xffffffff
     vti-interface=vti01
     vti-routing=no
     leftvti=192.168.254.1/30
     ikev2=no
     ike=aes_cbc256-sha2_384;modp1536
     phase2alg=aes_gcm256;modp1536
     encapsulation=yes
     ikelifetime=28800s
     salifetime=3600s
conn oracle-tunnel-2
     left=%defaultroute
     leftid=CPE_global_IP
     right=Tunnel2_global_IP
     rightid=Tunnel2_global_IP
     authby=secret
     leftsubnet=0.0.0.0/0
     rightsubnet=0.0.0.0/0
     auto=start
     mark=6/0xffffffff
     vti-interface=vti02
     vti-routing=no
     leftvti=192.168.254.5/30
     ikev2=no
     ike=aes_cbc256-sha2_384;modp1536
     phase2alg=aes_gcm256;modp1536
     encapsulation=yes
     ikelifetime=28800s
     salifetime=3600s
```

※15）下表を参考に、設定ファイル中の設定値を自身の環境に合わせて修正します。

| 変数名         | 設定値                                                     |
| :---------: | :-----------------------------------------------------: |
| left        | %defaultroute                                           |
| leftid      | Libreswan用インスタンスのパブリックIPアドレス                            |
| right       | **IPSec接続** の各トンネルに割り当てられたグローバルIPアドレス                   |
| rightid     | **IPSec接続** の各トンネルに割り当てられたグローバルIPアドレス                   |
| leftsubnet  | 0.0.0.0/0                                               |
| rightsubnet | 0.0.0.0/0                                               |
| leftvti     | **IPSec接続** の各トンネルのBGPピア接続に使用する **CPE** 側のIPアドレス（※16） |

※16）本テクニカルTipsでは、以下を設定します。
    
| トンネル | IPアドレス             |
| :--: | :----------------: |
| 1    | 192.168.254.1/30 |
| 2    | 192.168.254.5/30 |

[/etc/ipsec.d/oci-ipsec.secrets]

```sh
CPE_global_IP Tunnel1_global_IP: PSK "Shared_secret_tunnel1"
CPE_global_IP Tunnel2_global_IP: PSK "Shared_secret_tunnel2"
```

※17）下表を参考に、設定ファイル中の設定値を自身の環境に合わせて修正します。

|     | 1列目                          | 2列目                                   | 4列目                         |
| :-: | :--------------------------: | :-----------------------------------: | :-------------------------: |
| 1行目 | Libreswan用インスタンスの<br>パブリックIPアドレス | **IPSec接続** のトンネル1に<br>割り当てられたグローバルIPアドレス | **IPSec接続** のトンネル1用共有シークレット |
| 2行目 | Libreswan用インスタンスの<br>パブリックIPアドレス | **IPSec接続** のトンネル2に<br>割り当てられたグローバルIPアドレス | **IPSec接続** のトンネル2用共有シークレット |

- Systemdサービス設定ファイル修正（静的ルーティングのみ実施）  
**Libreswan** をSystemdサービスに登録している設定ファイルを以下のように修正し、この修正を反映します。  
なお、ここで追加している行に含まれるサブネットは、拠点間接続で左側サイトから通信したい右側サイトのサブネット（ここではプライベートサブネットの **10.0.2.0/24**）を指定します。

    ```sh
    $ diff /usr/lib/systemd/system/ipsec.service_org /usr/lib/systemd/system/ipsec.service
    33a34
    > ExecStartPost=/bin/bash -c 'sleep 30; ip route add 10.0.2.0/24 nexthop dev vti01 nexthop dev vti02'
    37a39
    > ExecStopPost=/bin/bash -c 'ip route del 10.0.2.0/24'
    $ sudo systemctl daemon-reload
    $
    ```

- **Libreswan** 起動・接続確認  
Libreswan用インスタンスのopcユーザで以下コマンドを実行し、 **Libreswan** を起動、拠点間接続が確立されていることを確認します。

    ```sh
    $ sudo systemctl enable --now ipsec.service
    Created symlink /etc/systemd/system/multi-user.target.wants/ipsec.service → /usr/lib/systemd/system/ipsec.service.
    $ sudo ipsec verify
    Verifying installed system and configuration files

    Version check and ipsec on-path                   	[OK]
    Libreswan 4.12
    Checking for IPsec support in kernel              	[OK]
    NETKEY: Testing XFRM related proc values
            ICMP default/send_redirects              	[OK]
            ICMP default/accept_redirects            	[OK]
            XFRM larval drop                         	[OK]
    Pluto ipsec.conf syntax                           	[OK]
    Checking rp_filter                                	[OK]
    Checking that pluto is running                    	[OK]
    Pluto listening for IKE on udp 500               	[OK]
    Pluto listening for IKE/NAT-T on udp 4500        	[OK]
    Pluto ipsec.secret syntax                        	[OK]
    Checking 'ip' command                             	[OK]
    Checking 'iptables' command                       	[OK]
    Checking 'prelink' command does not interfere with FIPS	[OK]
    Checking for obsolete ipsec.conf options          	[OK]
    $ sudo ipsec status | grep active
    000 Total IPsec connections: loaded 2, active 2
    $
    ```

    また、 **[5-4. IPSec接続作成](#5-4-ipsec接続作成)** のステップ **5.** で確認した **IPSecステータス** 列が **稼働中** となっていることを確認します。


## 6-2. FRRインストール・セットアップ

本章は、 **FRR** をインストール・セットアップします。  

- **FRR** インストール  
Libreswan用インスタンスのopcユーザで以下コマンドを実行し、 **FRR** をインストールします。

   ```sh
   $ sudo dnf install -y frr
   ```

- **FRR** 設定ファイル作成  
Libreswan用インスタンスで、以下の **FRR** 設定ファイルを修正し、BGPを有効化します。

    ```sh
    $ sudo diff /etc/frr/daemons_org /etc/frr/daemons
    17c17
    < bgpd=no
    ---
    > bgpd=yes
    $
    ```

- BGP設定ファイル作成  
Libreswan用インスタンスで、以下のBGP用設定ファイルを新規作成します。

[/etc/frr/bgpd.conf]

```sh
router bgp 65000
 neighbor 192.168.254.2 remote-as 31898
 neighbor 192.168.254.6 remote-as 31898
 address-family ipv4 unicast
  network 192.168.2.0/24
  network 192.168.3.0/24
  neighbor 192.168.254.2 next-hop-self
  neighbor 192.168.254.2 soft-reconfiguration inbound
  neighbor 192.168.254.2 route-map ALLOW-ALL in
  neighbor 192.168.254.2 route-map BGP-ADVERTISE-OUT out
  neighbor 192.168.254.6 next-hop-self
  neighbor 192.168.254.6 soft-reconfiguration inbound
  neighbor 192.168.254.6 route-map ALLOW-ALL in
  neighbor 192.168.254.6 route-map BGP-ADVERTISE-OUT out
 exit-address-family
!
ip prefix-list BGP-OUT permit 192.168.2.0/24
ip prefix-list BGP-OUT permit 192.168.3.0/24
!
route-map BGP-ADVERTISE-OUT permit 10
 match ip address prefix-list BGP-OUT
!
route-map ALLOW-ALL permit 100
```

※18）下表を参考に、設定ファイル中の設定値を自身の環境に合わせて修正します。

| 行       | フィールド | 設定値                                                                |
| :-----: | :---: | :----------------------------------------------------------------: |
| 1       | 3     | 左側サイトのAS番号（※19）                                                    |
| 2       | 2     | **IPSec接続** のトンネル1内のBGPピア接続に使用する **動的ルーティング・ゲートウェイ** 側のIPアドレス（※20） |
| 2       | 4     | OCIのAS番号である **31898**                                              |
| 3       | 2     | **IPSec接続** のトンネル2内のBGPピア接続に使用する **動的ルーティング・ゲートウェイ** 側のIPアドレス（※21） |
| 3       | 4     | OCIのAS番号である **31898**                                              |
| 5 - 6   | 2     | BGPで右側サイトに配布するサブネット（※22）                                           |
| 7 - 10   | 2     | **IPSec接続** のトンネル1内のBGPピア接続に使用する **動的ルーティング・ゲートウェイ** 側のIPアドレス（※20） |
| 11 - 14 | 2     | **IPSec接続** のトンネル2内のBGPピア接続に使用する **動的ルーティング・ゲートウェイ** 側のIPアドレス（※21） |
| 17 - 18      | 5     | BGPで右側サイトに配布するサブネット（※22）                                           |

※19）本テクニカルTipsでは、プライベートAS番号である **65000** を指定しますが、自身の環境に合わせて変更します。  
※20）本テクニカルTipsでは、 **192.168.254.2** を指定します。  
※21）本テクニカルTipsでは、 **192.168.254.6** を指定します。  
※22）本テクニカルTipsでは、左側サイトのプライベートサブネット **192.168.2.0/24** と **192.168.3.0/24** を指定します。配布するサブネットは、この行を増やすことで追加することが出来ます。

- 配布ルート設定ファイル作成  
Libreswan用インスタンスで、BGPで右側サイトに配布するルート情報を記載した以下の設定ファイルを新規作成します。  
この設定ファイルは、左側サイトのプライベートサブネットへのルートがLibreswan用インスタンスから見てパブリックサブネットのデフォルトルートのゲートウェイである **192.168.1.1** を経由するものであることを示しています。  
配布するサブネットは、この行を増やすことで追加することが出来ます。

[/etc/frr/staticd.conf]

```sh
ip route 192.168.2.0/24 192.168.1.1
ip route 192.168.3.0/24 192.168.1.1
```

- **FRR** 起動・ルート情報配布確認  
Libreswan用インスタンスのopcユーザで以下コマンドを実行し、 **FRR** を起動、左側サイトのルート情報が右側サイトに配布されていることを確認します。このルート情報配布は、 **Up/Down** 列に配布開始からの時間が表示されることで確認します。  
なお、ルート情報が配布されるまで数分程度の時間を要します。

    ```sh
    $ sudo systemctl enable --now frr.service
    Created symlink /etc/systemd/system/multi-user.target.wants/frr.service → /usr/lib/systemd/system/frr.service.
    $ sudo vtysh -c "show bgp summary"

    IPv4 Unicast Summary:
    BGP router identifier 192.168.254.5, local AS number 65000 vrf-id 0
    BGP table version 3
    RIB entries 5, using 960 bytes of memory
    Peers 2, using 43 KiB of memory

    Neighbor        V         AS   MsgRcvd   MsgSent   TblVer  InQ OutQ  Up/Down State/PfxRcd   PfxSnt
    192.168.254.2   4      31898         3         4        0    0    0 00:00:17            2        1
    192.168.254.6   4      31898         3         4        0    0    0 00:00:17            2        1

    Total number of neighbors 2
    $
    ```

    OCIコンソールにログインし、右側サイトをデプロイする **リージョン** を選択後、 **ネットワーキング** → **仮想クラウド・ネットワーク** とメニューを辿り、表示される以下画面で **顧客接続性** メニューをクリックします。

    ![画面ショット](console_page03.png)

    表示される以下 **顧客接続性** 画面で、 **サイト間VPN** メニューをクリックします。

    ![画面ショット](console_page12.png)

    表示される以下 **サイト間VPN** 画面で、先に作成した **IPSec接続** をクリックします。

    ![画面ショット](console_page23.png)

    表示される以下画面の **トンネル** フィールドで、トンネル1をクリックします。

    ![画面ショット](console_page24.png)

    表示される以下画面で、 **受信したBGPルート** メニューをクリックします。

    ![画面ショット](console_page25.png)

    表示される以下画面の **受信したBGPルート** フィールドで、左側サイトのプライベートサブネットへのルート（ここでは **192.168.2.0/24** と **192.168.3.0/24** ）が配布されていることを確認します。

    ![画面ショット](console_page26.png)

***
# 7. ライセンスサーバ・計算ノード間疎通確認

本章は、左側サイトのライセンスサーバに相当するインスタンスの **lic-srv** と右側サイトの計算ノードに相当するインスタンスの **Compute** を使用し、これらインスタンス間のpingとSSHによる疎通を確認、拠点間で通信可能であることを確認します。

1. ライセンスサーバ -> 計算ノード方向疎通確認  
インスタンス **lic-srv** のopcユーザで以下コマンドを実行し、疎通を確認します。  
ここでIPアドレスは、自身のインスタンス **Compute** のIPアドレスに置き換えて実行します。

    ```sh
    $ ping -c 1 10.0.2.74
    PING 10.0.2.74 (10.0.2.74) 56(84) bytes of data.
    64 bytes from 10.0.2.74: icmp_seq=1 ttl=60 time=163 ms

    --- 10.0.2.74 ping statistics ---
    1 packets transmitted, 1 received, 0% packet loss, time 0ms
    rtt min/avg/max/mdev = 163.047/163.047/163.047/0.000 ms
    $ ssh 10.0.2.74 hostname
    compute
    $
    ```

2. 計算ノード -> ライセンスサーバ方向疎通確認  
インスタンス **Compute** のopcユーザで以下コマンドを実行し、疎通を確認します。  
ここでIPアドレスは、自身のインスタンス **lic-srv** のIPアドレスに置き換えて実行します。

    ```sh
    $ ping -c 1 192.168.2.124
    PING 192.168.2.124 (192.168.2.124) 56(84) bytes of data.
    64 bytes from 192.168.2.124: icmp_seq=1 ttl=61 time=168 ms

    --- 192.168.2.124 ping statistics ---
    1 packets transmitted, 1 received, 0% packet loss, time 0ms
    rtt min/avg/max/mdev = 168.001/168.001/168.001/0.000 ms
    $ ssh 192.168.2.124 hostname
    lic-srv
    $
    ```

***
# 参考情報

## CPE構成ヘルパー利用方法

本章は、VPNアプライアンス製品を構成するために必要なOCIリソース情報をOCIコンソールから収集する、 **CPE構成ヘルパー** の利用方法を解説します。

ここでは、 **[5-3. 顧客構内機器作成](#5-3-顧客構内機器作成)** で作成する **顧客構内機器** が以下の場合を例に記載します。

- ベンダー： Juniper
- プラットフォーム/バージョン： MX Series - JunOS 15.1 or later

1. OCIコンソールにログインし、右側サイトをデプロイする **リージョン** を選択後、 **ネットワーキング** → **仮想クラウド・ネットワーク** とメニューを辿り、表示される以下画面で **顧客接続性** メニューをクリックします。

    ![画面ショット](console_page03.png)

2. 表示される以下 **顧客接続性** 画面で、 **サイト間VPN** メニューをクリックします。

    ![画面ショット](console_page12.png)

3. 表示される以下 **サイト間VPN** 画面で、 **[5-4. IPSec接続作成](#5-4-ipsec接続作成)** で作成した **IPSec接続** をクリックします。

    ![画面ショット](console_page19.png)

4. 表示される以下画面で、 **CPE構成ヘルパーを開く** ボタンをクリックします。

    ![画面ショット](console_page20.png)

5. 表示される以下 **CPE構成ヘルパー** サイドバーで、 **コンテンツの作成** ボタンをクリックします。

    ![画面ショット](console_page21.png)

6. 表示される以下 **CPE構成ヘルパー** サイドバーで、 **構成のダウンロード** ボタンをクリックし、構成情報が記載されたテキストファイルをダウンロードします。

    ![画面ショット](console_page22.png)