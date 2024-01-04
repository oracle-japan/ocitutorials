---
title: "109: プライベート・エンドポイントのADBを作成してみよう"
excerpt: "ADBでは、パブリックIPを持つパブリック・エンドポイントとプライベートIPを持つプライベート・エンドポイントを選択できます。"
order: "3_109"
layout: single
header:
  teaser: "/database/adb109-private-endpoint/private-endpoint_teaser.png"
  overlay_image: "/database/adb109-private-endpoint/private-endpoint_teaser.png"
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

- [1. プライベート・エンドポイントのADBへの接続](#anchor1)
    - [1-1. ネットワーク構成図の確認](#anchor1-1)
    - [1-2. ADBの作成](#anchor1-2)
    - [1-3. ADBへの接続](#anchor1-3)
- [2. Database Actionsへの接続](#anchor2)
    - [2-1. パブリック・エンドポイントでACLを定義している](#anchor2-1)
    - [2-2. プライベート・エンドポイントでInternetから接続](#anchor2-2)
    - [2-3. プライベート・エンドポイントでプライベート・ネットワークから接続](#anchor2-3)

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
ウォレットなし接続の手順については、[こちら](https://oracle-japan.github.io/ocitutorials/database/adb108-walletless/){:target="_blank"}をご参照ください。
もちろんウォレットを使用した接続も可能です。

![adb-access.png](adb-access.png)

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

<br>

<a id="anchor2-3"></a>

## 2-3. プライベート・エンドポイントでプライベート・ネットワークから接続
オンプレミスのデータセンターなどからプライベート・ネットワークでDatabase Actionsに接続する場合です。
この場合、FastConnectを使用して、オンプレミスからOCIのVCNに接続する方法が一般的です。なお、トラフィックはインターネットを経由しません。
詳しい手順については、[マニュアル](https://docs.oracle.com/cd/E83857_01/paas/autonomous-database/adbsa/network-private-endpoint-examples.html#GUID-9F6401C4-6306-4212-88FD-95E536B730B1:~:text=%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82-,%E4%BE%8B%3A%20%E3%83%87%E3%83%BC%E3%82%BF%E3%83%BB%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC%E3%81%8B%E3%82%89Autonomous%20Database%E3%81%B8%E3%81%AE%E6%8E%A5%E7%B6%9A,-%E3%82%AA%E3%83%B3%E3%83%97%E3%83%AC%E3%83%9F%E3%82%B9%E3%83%BB%E3%83%87%E3%83%BC%E3%82%BF%E3%83%BB%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC){:target="_blank"}をご参照ください。

<br>

# 参考資料

* [プライベート・エンドポイントを使用したネットワーク・アクセスの構成](https://docs.oracle.com/cd/E83857_01/paas/autonomous-database/adbsa/private-endpoints-autonomous.html#GUID-60FE6BFD-B05C-4C97-8B4A-83285F31D575){:target="_blank"}


以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)
