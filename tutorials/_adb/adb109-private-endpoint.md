---
title: "109: プライベート・エンドポイントのADBを作成してみよう"
excerpt: "ADBでは、パブリックIPを持つパブリック・エンドポイントとプライベートIPを持つプライベート・エンドポイントを選択できます。"
order: "3_109"
layout: single
header:
  teaser: "/adb/adb109-private-endpoint/private-endpoint_teaser.png"
  overlay_image: "/adb/adb109-private-endpoint/private-endpoint_teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474310
---

<a id="anchor0"></a>

# はじめに

Autonomous Databaseでは、パブリック・エンドポイントとプライベート・エンドポイントを選択できます。
プライベート・エンドポイントの場合は指定したVCN内のサブネット上にエンドポイントを配置することができます。
アクセス制御は指定したVCNのサブネットのセキュリティ・リスト、もしくはネットワーク・セキュリティ・グループ(NSG)を利用して行います。

<br>

**目次**

- [はじめに](#はじめに)
- [1. プライベート・エンドポイントのADBへの接続](#1-プライベートエンドポイントのadbへの接続)
  - [1-1. ネットワーク構成の確認](#1-1-ネットワーク構成の確認)
  - [1-2. ADBの作成](#1-2-adbの作成)
  - [1-3. ADBへの接続](#1-3-adbへの接続)
  - [1-4. パブリック・アクセスの許可](#1-4-パブリックアクセスの許可)
- [2. Database Actionsへの接続](#2-database-actionsへの接続)
  - [2-1. パブリック・エンドポイントでACLを定義済み](#2-1-パブリックエンドポイントでaclを定義済み)
  - [2-2. プライベート・エンドポイントでInternetから接続](#2-2-プライベートエンドポイントでinternetから接続)
  - [2-3. プライベート・エンドポイントでプライベート・ネットワークから接続](#2-3-プライベートエンドポイントでプライベートネットワークから接続)
- [参考資料](#参考資料)

<br>

**所要時間 :** 約30分

<br>

<a id="anchor1"></a>

# 1. プライベート・エンドポイントのADBへの接続
<a id="anchor1-1"></a>

## 1-1. ネットワーク構成の確認
プライベート・エンドポイントのAutonomous Database への接続方法は、IPsec VPN やFastConnect からアクセスする方法が一般的ですが、本章ではインターネットからの接続方法をご紹介します。

![network-layout.png](network-layout.png)

ネットワーク構成は上記のようにしています。各Security List の設定を以下に示します。

![security-list.png](security-list.png)

プライベート・サブネット**sub_pri1**は、パブリック・サブネット**sub_pub**からのSSHのみ許可、**sub_pri2**は、**sub_pri1**からのTCP接続(1521ポート)のみ許可しています。
本章では、パブリック・サブネットに踏み台サーバーを置いて利用しますが、インターネット側からアクセスする場合には、[Bastionサービス](https://oracle-japan.github.io/ocitutorials/intermediates/bastion/){:target="_blank"}も利用できます。

<br>
<a id="anchor1-2"></a>

## 1-2. ADBの作成
プライベート・エンドポイントのADBを作成するには、ADBの作成ページの[ネットワーク・アクセスの選択]で**プライベート・エンドポイント・アクセスのみ**を選択します。
以下の画像のようにADBを配置する仮想クラウド・ネットワークとサブネットを指定します。

![network-access.png](network-access.png)

なお、VCNのセキュリティ・リストのルールによるアクセス制御が設定されている場合、ネットワーク・セキュリティ・グループによるアクセス制御はオプションになります。

<br>
<a id="anchor1-3"></a>

## 1-3. ADBへの接続
パブリック・サブネットの踏み台サーバー経由でプライベート・サブネットのコンピュート・インスタンスに接続します。
プライベート・エンドポイント・アクセスのみの場合は、ウォレットなし接続が可能です。
ウォレットなし接続の手順については、[こちら](https://oracle-japan.github.io/ocitutorials/adb/adb108-walletless/){:target="_blank"}をご参照ください。
もちろんウォレットを使用した接続も可能です。

![adb-access.png](adb-access.png)

<br>
<a id="anchor1-4"></a>

## 1-4. パブリック・アクセスの許可
プライベート・エンドポイントのADBでは、パブリック・アクセスを許可するオプションがあります。このオプションを使用すると、パブリック・エンドポイントが追加され、アクセス制御リストで許可されたパブリックIP、CIDR、VCNから接続することができるようになります。

プライベート・エンドポイントで作成済みのADBにパブリック・アクセスを許可するには、ADBのネットワーク・アクセスを更新します。

ADBの作成ページの[ネットワーク・アクセスの更新]をクリックします。

![publicaccess1.png](publicaccess1.png)

[パブリック・アクセスを許可]ボタンをクリックします。

![publicaccess2.png](publicaccess2.png)

IPアドレス、CIDRブロック、VCN名、VCNのOCIDを指定して、アクセス許可を行います。今回はADBが配置されているVCNとは異なるVCN内にあるコンピュート・インスタンスのパブリックIPを指定します。

このとき接続用のウォレットにパブリック・エンドポイントにアクセスする接続文字列が追加されるので、確認してみます。
ウォレットのダウンロード方法は[こちら](https://oracle-japan.github.io/ocitutorials/adb/adb104-connect-using-wallet/#1-%E3%82%AF%E3%83%AC%E3%83%87%E3%83%B3%E3%82%B7%E3%83%A3%E3%83%AB%E3%82%A6%E3%82%A9%E3%83%AC%E3%83%83%E3%83%88%E3%81%AE%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89){:target="_blank"}をご参照ください。

以下にように*DB名_public_コンシューマグループ*が追加されています。

```sh
atprd01_high = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=xxxx.adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=no)))
atprd01_low = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=xxxx.adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=no)))
atprd01_medium = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=xxxx.adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_medium.adb.oraclecloud.com))(security=(ssl_server_dn_match=no)))
atprd01_tp = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=xxxx.adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_tp.adb.oraclecloud.com))(security=(ssl_server_dn_match=no)))
atprd01_tpurgent = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=xxxx.adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_tpurgent.adb.oraclecloud.com))(security=(ssl_server_dn_match=no)))
atprd01_public_high = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
atprd01_public_low = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
atprd01_public_medium = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_medium.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
atprd01_public_tp = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_tp.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
atprd01_public_tpurgent = (description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_tpurgent.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
```

ウォレットを使った接続の場合、上記のように更新されたウォレットを再ダウンロードし、**atprd01_public_tp**などの追加された接続サービスで接続すればパブリック・アクセスが可能になります。

ウォレットを使わない接続の場合、OCIコンソールの[データベース接続]をクリックしパブリック・アクセス用の接続文字列を取得します。

![publicaccess3.png](publicaccess3.png)

[TLS認証]を**TLS**とし、[アクセス]を**パブリック・エンドポイント**とすると、**atprd01_public_tp**などの接続サービスの接続文字列が表示されるので、そのうちの1つをコピーします。

![publicaccess4.png](publicaccess4.png)

先ほどアクセス許可したパブリックIPのインスタンスから、SQLclで以下のように接続してみます。

```sql
sql admin/Welcome12345#@"(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.ap-tokyo-1.oraclecloud.com))(connect_data=(service_name=xxxx_atprd01_tp.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
```

```sh
SQLcl: Release 24.1 Production on Sun Aug 04 06:16:29 2024

Copyright (c) 1982, 2024, Oracle.  All rights reserved.

Last Successful login time: Sun Aug 04 2024 06:17:12 +00:00

Connected to:
Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production
Version 19.24.0.1.0

SQL>
```

無事パブリック・アクセスができました。

<br>
<a id="anchor2"></a>

# 2. Database Actionsへの接続
Database Actions は、データベースの操作をGUI上で行うことができるツールです。
ADBのネットワーク構成によって、アクセス方法が異なります。
ネットワーク・アクセス・タイプに**すべての場所からのセキュア・アクセス** を選択している場合は、特に何も設定せずOCIコンソール画面からアクセスできます。

![network-access-Internet.png](network-access-Internet.png)

![db-action-button.png](db-action-button.png)

それ以外のパターンについて見ていきます。

<br>

<a id="anchor2-1"></a>

## 2-1. パブリック・エンドポイントでACLを定義済み
まずは、パブリック・エンドポイントでアクセス制御リスト(ACL)を定義している場合です。
[ネットワーク・アクセスの選択]では、**許可されたIPおよびVCN限定のセキュア・アクセス**を選択します。

![ACL-configuration.png](ACL-configuration.png)

この設定の場合、インターネットからDatabase Actionsにアクセスするためには、自分のIPアドレスを追加する必要があります。

![edit-ACL.png](edit-ACL.png)

**自分のIPアドレスを追加**ボタンがあるので、こちらをクリックするとすぐに自分のIPアドレスからのアクセスを許可できます。
ACLを更新後、OCIコンソール画面からアクセスできるようになります。

<br>

<a id="anchor2-2"></a>

## 2-2. プライベート・エンドポイントでInternetから接続
プライベート・エンドポイントで作成しているADBは、OCIコンソールの[データベース・アクション]をクリックすると以下のような表示が出ます。

![database-action.png](database-action.png)

インターネットからアクセスする場合は、上の画像の記載のように、**VCN内にコンピュート・インスタンスを1台置きそちらのブラウザを使用する**ようにしてください。もしくは**エンドポイントの443番ポートをlocalhostの443番ポートにポートフォワードする**ことでも使用可能です。

また、OCIのBastion Serviceを使用してアクセスすることもできます。
詳しい手順は、[こちらの記事](https://qiita.com/500InternalServerError/items/d09dc910c9f115035225){:target="_blank"}をご参照ください。

[こちら](#1-4-パブリックアクセスの許可)でパブリック・アクセスを許可している場合、Database ActionsなどのADB付属ツールへパブリック・アクセスが可能です。

パブリック・アクセスを許可している場合、各ツールのアクセスURLがプライベートとパブリックの2種類表示されます。

![publicaccess5.png](publicaccess5.png)

例えばローカルからDatabase Actionsへパブリック・アクセスしてみます。

ADBの詳細画面の[ネットワーク]の**パブリック・アクセス**の編集ボタンをクリックします。

![publicaccess6.png](publicaccess6.png)

**アクセス制御ルールの追加**をクリックし、**自分のIPアドレスを追加**をクリックします。現在ローカルで使用しているIPが追加されます。

![publicaccess7.png](publicaccess7.png)

これでローカルからADBのパブリック・エンドポイントへのアクセスが許可されました。

パブリック・アクセスを許可すると、ADBの詳細画面の**データベース・アクション**が以下のような表示になっています。このような表示になっておらず、クリックしてもプライベートIPでのアクセスURLしか表示されない場合は少し時間を置くか、ブラウザのリフレッシュを行ってください。クリックするとパブリック・エンドポイントのデータベース・アクションが起動します。

![publicaccess8.png](publicaccess8.png)

このようにデータベース・アクションの起動パッド画面になりました。

![publicaccess9.png](publicaccess9.png)

このようにプライベート・エンドポイントのADBでも、ローカルのIPをアクセス制御リストで許可することで、データベース・アクションへパブリック・アクセスすることができます。

<br>

<a id="anchor2-3"></a>

## 2-3. プライベート・エンドポイントでプライベート・ネットワークから接続
オンプレミスのデータセンターなどからプライベート・ネットワークでDatabase Actionsに接続する場合です。
この場合、FastConnectを使用して、オンプレミスからOCIのVCNに接続する方法が一般的です。なお、トラフィックはインターネットを経由しません。
詳しい手順については、[マニュアル](https://docs.oracle.com/ja-jp/iaas/Content/Network/Concepts/fastconnectoverview.htm){:target="_blank"}をご参照ください。

<br>

# 参考資料

* [プライベート・エンドポイントの概要](https://docs.oracle.com/cd/E83857_01/paas/autonomous-database/serverless/adbsb/security-restrict-private-endpoint.html#GUID-D12F124A-9B71-4B83-B157-63F1057072FF){:target="_blank"}


以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)
