---
title: "OCI Network Firewallを構築する"
excerpt: "本チュートリアルでは「OCI Network Firewall」を構築し、動作を確認します。"
order: "110"
layout: single
tags:
 - security
header:
 teaser: "/security/networkfirewall-setup/nfw00.png"
 overlay_image: "/security/networkfirewall-setup/nfw00.png"
 overlay_filter: rgba(34, 66, 55, 0.7)

---

<!-- 
リンク：
    [OCI Network Firewallを構築する](/ocitutorials/security/networkfirewall-setup/) 
-->

OCI Network Firewallは2022年7月にリリースされた、パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール・サービスです。
主な機能として、URLフィルタリングやTLS/SSL検査などを提供します。  
本チュートリアルではOCI Network Firewallが動作するための環境を構築し、簡単なテストにて動作を確認します。


**所要時間 :** 
+ 約70分


**前提条件 :**
+ ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細は[ドキュメント](https://docs.oracle.com/ja-jp/iaas/Content/network-firewall/overview.htm#iam)を参照ください。


**注意 :**
+ 本チュートリアル内の画面ショットは、OCIのコンソール画面と異なる場合があります。

<br>


# 0. はじめに
## ・実施内容
以下が本チュートリアルで作成するNetwork Firewallの構成図です。
OCI環境を出入りする通信はNetwork Firewallを経由し、監視および検査が行われます。

![構成図](nfw00.png)

本チュートリアルでは動作テストのためにOCI内にWEBサーバーを準備した後ウィルステストファイルを配置し、外部からの通信がNetwork Firewallによってブロックされることを確認するところまでを行います。

## ・Network Firewallの概要
Network Firewallは次世代ファイアウォールとして、TLSトラフィックも含め、通過するすべてのリクエストを検査し、ユーザーが構成したファイアウォール・ポリシー・ルールに基づいて、許可、拒否、ドロップ、侵入検出、防止などのアクションを実行します。
より詳細な情報は[こちら](https://speakerdeck.com/oracle4engineer/oci-network-firewallgai-yao)をご参照ください

**主なユースケース**
+ Palo Alto Networksの脅威シグネチャおよび脅威分析エンジンを活用し、脆弱性攻撃やマルウェア、C&Cサーバーなどの脅威を検知・防御。
+ 不正なアウトバウンド通信を識別し、機密データの流出を抑止。

<br>


## ・ルーティングについて
インターネット経由でパブリックサブネット内のインスタンスに到達する通信は、インターネットゲートウェイのルート表に基づき、NFWサブネット内のNetwork Firewallを通過します。その後、検査済みトラフィックがパブリックサブネット内のインスタンスに転送されます。  
パブリックサブネット内のインスタンスから発生する通信も、ルート表の設定によりNetwork Firewallを通過します。検査済みの通信は、NFWサブネットのルート表ルールを基にインターネットゲートウェイを介して外部へ送信されます。

<br>


# 1. ネットワークの構築

## 1-1. VCNの作成
OCIコンソール画面にアクセスし、左上の **[メニューボタン] → [ネットワーキング] → [仮想クラウド・ネットワーク]** と移動します。  
**[VCNウィザードの起動]** を選択します。

  ![VCN作成ウィザード1](nfw02.png)

**「インターネット接続性を持つVCNの作成」**を選択。

  ![VCN作成ウィザード2](nfw03.png)

VCN作成画面にて以下項目を入力し、**[次]** をクリックします。

----

+ <span style="color: darkblue; ">**`VCN名`**</span> - VCN4tutorial
+ <span style="color: darkblue; ">**`コンパートメント`**</span> - \<VCNを作成するコンパートメントを選択\>
+ <span style="color: darkblue; ">**`VCN IPv4 CIDRブロック`**</span> - 10.0.0.0/16

----

  ![VCN作成ウィザード2](nfw04.png)

作成されるリソースを確認し、**[作成]**をクリックすると以下の環境でVCNが作成されます。  

 ![VCNウィザードで作成されるリソース](nfw05.png)

今回はプライベート・サブネット、サービス・ゲートウェイ、NATゲートウェイを使用しません。そのため、後続の構成図ではこれらのリソースを省略しています。

<br>

## 1-2. Network Firewall用サブネットの作成

Network Firewallを配置するためのサブネットを作成します。
サブネット作成前に、必要となるルート表とセキュリティ・リストを準備します。


### ・ルート表の作成

作成したVCN詳細画面の「ルート表」セクションより **[ルート表の作成]**ボタンをクリックします。  
ルート表作成画面にて以下項目を入力し、**[作成]**をクリックします。

----

+ <span style="color: darkblue; ">**`名前`**</span> - Route Table for NFWサブネット
+ <span style="color: darkblue; ">**`コンパートメント`**</span> - \<任意のコンパートメントを選択\>
+ **`[＋別のルート・ルール]`** を選択
  + <span style="color: darkblue; ">**`ターゲット・タイプ`**</span> - インターネット・ゲートウェイ
  + <span style="color: darkblue; ">**`宛先CIDRブロック`**</span> - 0.0.0.0/0
  + <span style="color: darkblue; ">**`ターゲット・インターネット・ゲートウェイ`**</span> - インターネット・ゲートウェイ-VCN4tutorial

----

![NFWルート表](nfw06.png)


### ・セキュリティ・リストの作成

作成したVCN詳細画面の「セキュリティ・リスト」セクションより **[セキュリティ・リストの作成]**ボタンを選択します。
セキュリティ・リスト作成画面にて以下項目を入力し、**[セキュリティ・リストの作成]**をクリックします。

----

+ <span style="color: darkblue; ">**`名前`**</span> - Security List for NFWサブネット
+ <span style="color: darkblue; ">**`コンパートメント`**</span> - \<任意のコンパートメントを選択\>

+ **`[＋別のイングレス・ルール]`** を選択
  + <span style="color: darkblue; ">**`ソース・タイプ`**</span> - CIDR
  + <span style="color: darkblue; ">**`ソースCIDR`**</span> - 0.0.0.0/0
  + <span style="color: darkblue; ">**`IPプロトコル`**</span> - TCP
  + <span style="color: darkblue; ">**`宛先ポート範囲`**</span> - 80
  + <span style="color: darkblue; ">**`説明`**</span> - (任意) HTTP通信を許可
+ **`[＋別のイングレス・ルール]`** を選択
  + <span style="color: darkblue; ">**`ソース・タイプ`**</span> - CIDR
  + <span style="color: darkblue; ">**`ソースCIDR`**</span> - 0.0.0.0/0
  + <span style="color: darkblue; ">**`IPプロトコル`**</span> - TCP
  + <span style="color: darkblue; ">**`宛先ポート範囲`**</span> - 22
  + <span style="color: darkblue; ">**`説明`**</span> - (任意) SSH接続を許可

+ **`[＋別のエグレス・ルール]`** を選択
  + <span style="color: darkblue; ">**`ソース・タイプ`**</span> - CIDR
  + <span style="color: darkblue; ">**`ソースCIDR`**</span> - 0.0.0.0/0
  + <span style="color: darkblue; ">**`IPプロトコル`**</span> - すべてのプロトコル
  + <span style="color: darkblue; ">**`説明`**</span> - (任意) 任意のアウトバウンド通信を許可

----

![NFWセキュリティリスト1](nfw07.png)
![NFWセキュリティリスト2](nfw08.png)


### ・サブネットの作成

作成したVCN詳細画面の「サブネット」セクションより **[サブネットの作成]**ボタンを選択します。
サブネット作成画面にて以下項目を入力し、**[サブネットの作成]**をクリックします。

----

+ <span style="color: darkblue; ">**`名前`**</span> - NFWサブネット
+ <span style="color: darkblue; ">**`サブネット・タイプ`**</span> - リージョナル
+ <span style="color: darkblue; ">**`IPv4 CIDR Block`**</span> - 10.0.2.0/24 
+ <span style="color: darkblue; ">**`ルート表`**</span> - Route Table for NFWサブネット
+ <span style="color: darkblue; ">**`サブネット・アクセス`**</span> - パブリック・サブネット
+ <span style="color: darkblue; ">**`セキュリティ・リスト`**</span> - Security List for NFWサブネット

----

![NFWサブネット](nfw09.png)


ここまでで以下の構成が整いました。

![構成途中1](nfw10.png)

<br><br>

# 2. Network Firewallの作成

## 2-1. ネットワーク・ファイアウォール・ポリシーの作成

Network Firewallインスタンスを作成する際、ネットワーク・トラフィックを制御するルールをまとめたポリシー、ネットワーク・ファイアウォール・ポリシーを指定する必要があります。そのため事前に以下の手順でポリシーを作成します。

OCIコンソール画面左上のメニューボタンより、**[アイデンティティとセキュリティ] → [ファイアウォール] → [ネットワーク・ファイアウォール・ポリシー]** と移動、**[ネットワーク・ファイアウォール・ポリシーの作成]**をクリックします。  
表示された作成画面にて以下の項目を入力し、**[作成]**ボタンをクリックします。

----

+ <span style="color: darkblue; ">**`名前`**</span> - nfw_pol_tutorial
+ <span style="color: darkblue; ">**`コンパートメント`**</span> - \<任意のコンパートメントを選択\>

----

![NFW-polの作成](nfw11.png)


## 2-2. ネットワーク・ファイアウォール・ポリシーの設定

デフォルトではすべての通信は拒否されますので、以下の手順ですべての通信を許可しつつ、疑わしい通信をブロックするルールを設定します。

ポリシー詳細画面の「セキュリティ・ルール」セクションで、**[セキュリティ・ルールの作成]**ボタンをクリックします。
作成画面にて以下項目を入力し、セキュリティ・ルールを作成します。

----

+ <span style="color: darkblue; ">**`名前`**</span> - idp
  
+ <span style="color: darkblue; ">**`ソース・アドレス`**</span> - 任意のアドレス
+ <span style="color: darkblue; ">**`宛先アドレス`**</span> - 任意のアドレス
+ <span style="color: darkblue; ">**`アプリケーション`**</span> - 任意のアプリケーション
+ <span style="color: darkblue; ">**`サービス`**</span> - 任意のサービス
+ <span style="color: darkblue; ">**`URL`**</span> - 任意のURL

+ <span style="color: darkblue; ">**`ルール・アクション`**</span> - 侵入防止

----

![NFW-polの設定](nfw26.png)


## 2-3. Network Firewallインスタンスの作成

続いてNetwork Firewallインスタンスを作成します。
OCIコンソール画面左上のメニューボタンより、**[アイデンティティとセキュリティ] → [ファイアウォール]** と移動、**[ネットワーク・ファイアウォールの作成]**をクリックします。

作成画面にて以下の項目を入力し、**[ネットワーク・ファイアウォールの作成]**をクリックします。

----

+ <span style="color: darkblue; ">**`名前`**</span> - NFW4tutorial
+ <span style="color: darkblue; ">**`コンパートメント`**</span> - \<任意のコンパートメントを選択\>
+ <span style="color: darkblue; ">**`ネットワーク・ファイアウォール・ポリシー`**</span> - nfw_pol_tutorial（先ほど作成したネットワーク・ファイアウォール・ポリシーを選択）
+ <span style="color: darkblue; ">**`仮想クラウド・ネットワーク`**</span> - VCN4tutorial
+ <span style="color: darkblue; ">**`サブネット`**</span> - NFWサブネット リージョナル
+ **`IPアドレスの指定（任意）`** - サブネット内のIPアドレスを明示的に指定する場合、「IPアドレスをサブネットからファイアウォールに手動で割り当てます」にチェックを付けます。本チュートリアルではIPアドレスを「10.0.2.100」に指定しています。
 
----

![NFWの作成](nfw12.png)

Network Firewallインスタンスの作成には約40分かかります。作成中に詳細画面でIPv4アドレスを確認できるので、以降のルーティング設定で使用するために控えておいてください。

Network Firewallを作成している間、続く手順３，４を進めます。

![NFWの作成中画面](nfw12.png)

<br><br>



# 3. テストWebページ用のコンピュートインスタンスの作成と設定
## 3-1. コンピュートインスタンスの作成

この手順では、パブリックサブネット内にWebサーバーを構築し、Webページへのアクセスを確認します。

![構成途中2](nfw13.png)


OCIコンソール画面左上のメニューボタンより、**[コンピュート] → [インスタンス]** と移動、**[インスタンスの作成]** をクリックし、作成画面にて以下の設定で作成します。

----

+ <span style="color: darkblue; ">**`名前`**</span> - websvr4tutorial
+ <span style="color: darkblue; ">**`コンパートメント`**</span> - \<任意のコンパートメントを選択\>
+ <span style="color: darkblue; ">**`可用性ドメイン`**</span> - AD1

+ <span style="color: darkblue; ">**`イメージ`**</span> - Oracle Linux 8
+ <span style="color: darkblue; ">**`Shape`**</span> - (任意)VM.Standard.E5.Flex

+ <span style="color: darkblue; ">**`VCN`**</span> - VCN4tutorial
+ <span style="color: darkblue; ">**`サブネット`**</span> - パブリック・サブネット-VCN4tutorial (リージョナル)
+ **`IPアドレスの指定（任意）`** - サブネット内のIPアドレスを明示的に指定する場合、「プライベートIPv4アドレスの手動割当て」を選択します。本チュートリアルではIPアドレスを「10.0.0.10」に指定しています。

+ <span style="color: darkblue; ">**`SSHキーの追加`**</span> - 「キー・ペアを自動で生成」を選択し、秘密キーと公開キーをそれぞれ保存します。手元に既存のSSHキーがある場合は、「公開キー・ファイルのアップロード」または「公開キーの貼りつけ」を選択し、公開キーを登録してください。

+ **`[拡張オプションの表示]`**をクリックし展開
  + <span style="color: darkblue; ">**`初期化スクリプト`**</span> - 「cloud-initスクリプトの貼付け」を選択し、以下のスクリプトを張り付ける

----

```
#cloud-config
packages:
  - httpd

runcmd:
  - systemctl enable httpd
  - systemctl start httpd
  - firewall-offline-cmd --add-service=http
  - systemctl restart firewalld
  - curl https://secure.eicar.org/eicar.com.txt > /var/www/html/eicar.html
```

**cloud-initで実行する内容について**  
apache HTTPS serverをインストールし、起動しています。また、ウイルス対策ソフトの応答をテストするためeicarファイルをeicarのHPより取得し、`/var/www/html/eicar.html`へ新規に配置しています。この動作はインスタンスの作成と同時に行われます。
{: .notice--info}

以上の項目を入力し、**[作成]**をクリックします。

![コンピュートの作成画面1](nfw15.png)
![コンピュートの作成画面2](nfw16.png)
![コンピュートの作成画面3](nfw17.png)
![コンピュートの作成画面4](nfw18.png)

後に作成されたテスト用のWebページにアクセスしますので、割り当てられたパブリックIPアドレスを控えておきます。

初期化スクリプトの実行に数分かかりますので、その間にWebページにアクセスできるように次の手順にて通信の許可設定を行います。


## 3-2. HTTPアクセスのためのセキュリティ・リストの編集

OCIコンソール画面にアクセスし、左上のメニューボタンより、**[ネットワーキング] → [仮想クラウド・ネットワーク] → [VCN4tutorial]** と移動します。  
VCN詳細画面の「セキュリティ・リスト」セクションから **[Default Security List for VCN4tutorial]**を選択し、**[イングレス・ルールの追加]**ボタンより以下のイングレス・ルールを追加します。

+ <span style="color: darkblue; ">**`ソース・タイプ`**</span> - CIDR
+ <span style="color: darkblue; ">**`ソースCIDR`**</span> - 0.0.0.0/0
+ <span style="color: darkblue; ">**`IPプロトコル`**</span> - TCP
+ <span style="color: darkblue; ">**`宛先ポート範囲`**</span> - 80
+ <span style="color: darkblue; ">**`説明`**</span> - (任意) HTTP通信を許可

![イングレスルールの追加](nfw19.png)



## 3-3. Webページへのアクセスを確認


ブラウザで **`http://<コンピュートのパブリックIP>/`** にアクセスし、テストページが正しく表示されることを確認します。

アクセスできない場合、初期化スクリプトの実行がまだ完了していない可能性があります。数分待ってから再試行してください。（参考：筆者の環境では約2分半で完了しました）

![testページの確認](nfw20.png)

次に **`http://<コンピュートのパブリックIP>/eicar.html`** にアクセスし、eicarファイルが正しく表示されることを確認します。
eicarファイルはウイルス対策ソフトの応答をテストするためのテキストファイルです。

![eicarページの確認](nfw21.png)

<br><br>


# 4. Firewallを経由するためのルーティング設定

Network FirewallインスタンスのプライベートIPアドレスを元に、通信がFirewallインスタンスを経由するようにルーティングの設定を行います。


## 4-1. Internet Gatewayのルート表の編集

OCIコンソール画面にアクセスし、左上の **[メニューボタン] → [ネットワーキング] → [仮想クラウド・ネットワーク] → [VCN4tutorial]** と移動します。  
作成したVCN詳細画面の「ルート表」セクションより**[ルート表の作成]**ボタンをクリックします。
ルート表作成画面にて以下項目を入力し、**[作成]**をクリックします。

----

+ <span style="color: darkblue; ">**`名前`**</span> - Route Table for IGW
+ <span style="color: darkblue; ">**`コンパートメント`**</span> - \<任意のコンパートメントを選択\>
+ **`[＋別のルート・ルール]`** を選択
  + <span style="color: darkblue; ">**`ターゲット・タイプ`**</span> - プライベートIP
  + <span style="color: darkblue; ">**`サブネットまたはVLANコンパートメント`**</span> - \<サブネットが所属するコンパートメントを選択\>
  + <span style="color: darkblue; ">**`宛先CIDRタイプ`**</span> - CIDRブロック
  + <span style="color: darkblue; ">**`宛先CIDRブロック`**</span> - 10.0.0.0/16
  + <span style="color: darkblue; ">**`ターゲット選択`**</span> - 10.0.2.100（Network FirewallインスタンスのプライベートIPアドレス）

----

![IGWルート表作成](nfw22.png)

作成したルート表をインターネット・ゲートウェイに関連付けます。  
VCN詳細画面の「インターネット・ゲートウェイ」セクションを選択し、作成されているインターネット・ゲートウェイのケバブメニューから**[ルート表の関連付け]**をクリックします。  
ルート表**[Route Table for IGW]**を選択し、**[ルート表の関連付け]**をクリックします。

![IGWルート表関連付け](nfw23.png)


## 4-2. パブリック・サブネットのルート表の編集

パブリック・サブネット内からの通信がNetwork Firewallインスタンスを経由するようにルート表を編集します。  
作成したVCN詳細画面の「ルート表」セクションより**[default route table for VCN4tutorial]**を選択し、既存のルート・ルールを編集し以下の新しいルート・ルールに変更します。

----

+ <span style="color: darkblue; ">**`ターゲット・タイプ`**</span> - プライベートIP
+ <span style="color: darkblue; ">**`サブネットまたはVLANコンパートメント`**</span> - \<サブネットが所属するコンパートメントを選択\>
+ <span style="color: darkblue; ">**`宛先CIDRタイプ`**</span> - CIDRブロック
+ <span style="color: darkblue; ">**`宛先CIDRブロック`**</span> - 0.0.0.0/0
+ <span style="color: darkblue; ">**`ターゲット選択`**</span> - 10.0.2.100（Network FirewallインスタンスのプライベートIPアドレス）

----

![パブリック・サブネットルート表設定](nfw25.png)

<br>

ここまでの設定により、現時点での環境は以下のようになっています。

![構築途中3](nfw31.png)

<br><br>


# 5. Network FirewallのIDP機能を確認する
## 5-1. テストサイトにアクセスする

Firewallインスタンスの作成が完了した後、webサーバーに配置したeicarファイルへのアクセスがFirewallによって防止されるかを確認します。  
この手順で、IDP（侵入防止機能）が正しく動作していることを検証します。

手順3-3と同様、ブラウザで以下の2つのURLにアクセスします。

+ **`http://<コンピュートのパブリックIP>/`** にアクセスし、正しくテストページが表示されることを確認します。


![testページの確認_after](nfw27.png)

+ **`http://<コンピュートのパブリックIP>/eicar.html`** にアクセスするとFirewallによって拒否されることを確認します。

![eicarページの確認_after](nfw28.png)


## 5-2. ログを確認する
Firewallがeicarファイルへのアクセスを検知した場合、その記録をログとして確認できます。

ログを確認するためには、Network Firewallインスタンスの詳細画面の「ログ」セクションより検知した脅威のログ（Threat Log）を有効化します。

![NFWのログの有効化](nfw29.png)

検知されたeicarファイルはこの脅威ログより、以下のように確認できます。

![NFW脅威ログ](nfw30.png)

<br>

----

手順2-1で作成したネットワーク・ファイアウォール・ポリシーでは、IDS/IPS、URLフィルタリング、SSLインスペクションなどの機能を設定できます。
さらにFirewallの動作を検証するステップとして、サービスリストやURLリストの動作検証を行うチュートリアル「[OCI Network Firewallの動作検証を行う](/ocitutorials/security/networkfirewall-policycheck)」もご用意しています。ぜひお試しください。
