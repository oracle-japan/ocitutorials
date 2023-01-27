---
title: "ADB-Dの環境を作成してみよう"
excerpt: ""

order: "3_701"
layout: single

#link: 
---

<a id="anchor0"></a>

**目次**

- [1. Autonomous Database Dedicated (ADB-D)とは？](#1-autonomous-database-dedicated-adb-dとは))
- [2. 環境を作成してみよう](#2-環境を作成してみよう)
    - [2-1. 利用イメージ（構成図）](#2-1-利用イメージ構成図)
    - [2-2. Exadata Infrastructureの作成](#2-2-exadata-infrastructureの作成)
    - [2-3. ネットワーク設定](#2-3-ネットワーク設定)
    - [2-4. Autonomous Exadata VMクラスタの作成](#2-4-autonomous-exadata-vmクラスタの作成)
    - [2-5. Autonomous Container Databasesの作成](#2-5-autonomous-container-databasesの作成)
    - [2-6. Autonomous Databaseの作成](#2-6-autonomous-databaseの作成)
- [3. 作成したADBに接続してみよう](#3-作成したadbに接続してみよう)

<br>

**所要時間 :** 約6時間程程度　※プロビジョニング時間を含みます


<br>

# 1. Autonomous Database Dedicated (ADB-D)とは？

<div style="text-align: center">
<img src="ADBdeployment.jpg" width="80%">
</div>

Autonomous Databaseは共有型・専有型の２つのデプロイメント方式をご用意しています。
<br>共有型のShared Exadata Infrastructure(ADB-S)はインフラストラクチャとなるExadataを共有する環境、専有型のDedicated Exadata Infrastructure(ADB-D)はExadataをお客様が専有する環境です。
<br>ADB-Dは、複数のADBを利用するような大規模なシステムや、セキュリティ上の制約によって他のお客様との同居が許されないようなシステムで使用されることが多くなっています。

<br>さらにADB-Dでは専有環境の持ち方として、**OCIにデプロイする方式**と**お客様データセンターに配置できるCloud@Customer(C@C)を利用したデプロイメント方式**があります。
<br>Cloud@Customerは、データをパブリッククラウドに持ち出すことができなかったり、アプリケーションからのネットワークレイテンシが問題となるようなお客様にご利用いただくことの多いデプロイメント方式です。
<br>本チュートリアルでは、OCI上にADB-Dのデプロイメントを行います。

## ADB-Sとの違いは？

ADB-SもADB-DもAutonomous Databaseを使用している点は同じなので、その特徴である**高性能・高可用性・高いセキュリティ**というところは変わりません。

ADB-Dならではの特長は、Exadataを専有することにより可能な「**高度な分離性**」と「**運用ポリシーのカスタマイズ**」です。

* 高度な分離性
    * 複数のレイヤーで独立性を確保
    * プライベートクラウドとしての責任境界の明確化
        * フリート管理者 / データベース管理者で分けることを推奨

* 運用ポリシーのカスタマイズ
    * プロビジョニング、ソフトウェア更新、可用性、集約性を制御可能

<br>ADB-Dは複数のレイヤで構成されており、それぞれ独立性が確保されています。したがって、どのレイヤでもワークロードを分離させることができるとともに、レイヤ別に管理者のロールをわけて責任境界を明確化することもできます。
<br>次に運用ポリシーについてですが、ADB-Dでは各レイヤーをそれぞれどのようにプロビジョニング・構成・メンテナンスするかをユーザ側で制御することができます。

> **【補足】管理者について**
>
> ADB-Dにおける管理の領域は、OracleではPDBのレイヤを境界として「フリート管理者」および「データベース管理者」で分けることを推奨しています。
>


> **【補足】ADB-Dの課金について**
>
> ADB-DはExadataの筐体を専有してご利用いただくことになるので、Infrastructure分の課金が発生します。また、このInfrastructureの最低利用期間は48時間となっており、終了するまで課金が継続します。Exadata Infrastructureを作成する際にはご注意ください。
> <br>次の表は、ADB-SとADB-Dの課金の違いについて記載したものです：
> 
>  <table>
>    <tbody>
>        <tr><th></th>
>			<th><div style="text-align: center"><b>ADB-S</b></div></th>
>			<th><div style="text-align: center"><b>ADB-D</b></div></th>
>        </tr>
>       <tr>
>			<td>料金体系</td>
>			<td>OCPU + Storage</td>
>           <td>OCPU + Infrastructure</td>
>        </tr>
>       <tr>
>			<td>課金単位</td>
>			<td>秒</td>
>           <td>時間</td>
>        </tr>
>        <tr>
>			<td>最低利用期間</td>
>			<td>OCPU/Storage：1分</td>
>            <td>OCPU：1時間
>			<br><b>Infrastructure：48時間</b></td>
>        </tr>
>        <tr>
>			<td>課金時間</td>
>			<td>OCPU：起動している間
>			<br>Storage：終了するまで</td>
>            <td>OCPU：1時間
>			<br><b>Infrastructure：終了するまで</b></td>
>        </tr>
>      </tbody>
>    </table>
>

<br>

## ADB-Dのアーキテクチャ

上記に示した通り、ADB-Dは次の４つのレイヤで構成されています。

<div style="text-align: center">
<img src="diagram.png" width="70%">
</div>

* **Exadata Infrastructure(EI)**：シェイプやラックサイズを含む、基盤となるExadataの構成

* **Autonomous VM Cluster(AVM)**：ネットワーク・VMクラスタの構成

* **Autonomous Container Database (ACD)**：Oracle Databaseのコンテナデータベース

* **Autonomous Database (ADB)**：ADBにあたるプラガブルデータベース

<br>

<a id="anchor2"></a>

# 2. 環境を作成してみよう

<a id="anchor2-1"></a>

## 2-1. 利用イメージ（構成図）

OCI上にADB-Dを構成する際の手順の次の通りです：

<div style="text-align: center">
<img src="setup.png" width="90%">
</div>

専有インフラストラクチャにADBインスタンスを作成するにはこの４つのレイヤで構成することは必須であり、EIから上位のレイヤに向かって順に作成していく必要があります。

本チュートリアルではコンパートメントおよびユーザグループ・ポリシーの設定は構成済みであるとし、赤字で記載された項目を行います。

Exadata上のクラスタに単一のCDBを配置し、その上にPDBであるADBを配置するという最もシンプルな構成で作成します。

<br>

<a id="anchor2-2"></a>

## 2-2. Exadata Infrastructureの作成

Exadata Infrastructure (EI)を作成します。

1. メニューから「**Oracle Database**」→「**Autonomous Database**」をクリックします。
    <br>「**専用インフラストラクチャ**」の項目から「**Exadata Infrastructure**」を選択し、「**Exadata Infrastructureの作成**」をクリックします。

    ![2-3-1.jpg](2-3-1.jpg)

2. Exadata Infrastructureを作成します。
    <br>設定項目は次の通り入力してください。

   <table>
    <thead>
        <tr>
            <th colspan="3">Exadata Infrastructureでの入力項目</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="2">基本情報の指定</td>
			<td><b>コンパートメントの選択</b>：
            <br>Exadata Infrastructureリソースを作成するコンパートメントを選択</td>
            <td>任意</td>
        </tr>
		<tr>
			<td><b>表示名</b>：
            <br>リソースを識別するための名称。一意である必要はありません。</td>
            <td>任意<br>例：Exadata-Infra1</td>
        </tr>
		<tr>
            <td rowspan="1"></td>
			<td><b>可用性ドメインの選択</b>：
            <br>リソースを配置する可用性ドメインを選択</td>
            <td>任意</td>
        </tr>
		<tr>
            <td rowspan="2">Exadataシステム・モデルの選択</td>
			<td><b>シェイプの選択</b>：
            <br>割り当てるOracle Exadata Database Machineのタイプを選択。
            <br>モデルとその構成に関する容量についての詳細な情報は<a href="https://docs.oracle.com/en/cloud/paas/autonomous-database/dedicated/adbde/index.html" target="_blank">こちら</a></td>
            <td>X8-2</td>
        </tr>
		<tr>
			<td><b>システム構成の選択</b>：
            <br>固定シェイプ・システムの場合、Quater/Half/Fullから選択します。
            <br>エラスティック構成の場合はデータベース・サーバーとストレージ・サーバーの数を指定します。</td>
            <td>Quarter ラック</td>
        </tr>
    </tbody>
    </table>

    <br>

    ![2-3-2.png](2-3-2.png)
    <br>

    「**Exadata Infrastructureの作成**」をクリックするとプロビジョニングが始まります。

    <br>

3. EXAのアイコンが緑色になったらプロビジョニング完了です。<br>プロビジョニングには約20秒程かかります。（2023/1時点）

    ![2-1-3.png](2-1-3.png)


> **【補足】EIについて**
>
> EIはExaDB-DとADB-Dで共通のインフラストラクチャです。同じEIにExaDB-DのVMとADB-DのAVMを作成することができます。
>

<br>



<a id="anchor2-3"></a>

## 2-3. ネットワーク設定

ADB-Dを配置するネットワーク環境を作成します。
<br>ネットワークの構成は次のような構成にします：

<div style="text-align: center">
<img src="network.png" width="70%">
</div>

<br>
それではリソースを作成していきましょう。

1. 作成したいリソースのほとんどは、VCNウィザードを使うことで素早く作成することができます。
<br>ウィザードでは次のリソースが自動的に作成されます：
    - **VCN**
    - **パブリック・サブネット**
    - **プライベート・サブネット**
    - **インターネット・ゲートウェイ (IG)**
    - NATゲートウェイ(NAT)
    - サービス・ゲートウェイ(SG)

    すでに作成済みのVCNがある場合はそちらを利用し、必要なリソースのみ追加しても問題ありません。ただし、その際にはVCNに作成できるリソースの制限にご注意ください。
    <br>また、仮想クラウドネットワークの作成方法についての詳細は [クラウドに仮想ネットワーク(VCN)を作る](https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn/){:target="_blank"} を参照ください。

    <br>「**VCNウィザードを起動**」をクリックし、「**インターネット接続性を持つVCNの作成**」を選択します。
    <br>ウィザードでの設定項目は本チュートリアルでは次の通り入力することにします。
    <br>既存の仮想クラウドネットワークを使用する方は、「**VCN CIDRブロック**」「**パブリック・サブネットCIDRブロック**」「**プライベート・サブネット**」「**CIDRブロック**」を次のように変更します。

    <table>
    <thead>
        <tr>
            <th colspan="3">ウィザードでの入力項目</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="2">基本情報</td>
			<td>VCN名</td>
            <td>任意</td>
        </tr>
		<tr>
			<td>コンパートメント</td>
            <td>任意</td>
        </tr>
		<tr>
            <td rowspan="3">VCNとサブネットの構成</td>
			<td>VCN CIDRブロック</td>
            <td><b>10.2.0.0/16</b></td>
        </tr>
		<tr>
			<td>パブリック・サブネットCIDRブロック</td>
            <td><b>10.2.0.0/24</b></td>
        </tr>
		<tr>
			<td>プライベート・サブネットCIDRブロック</td>
            <td><b>10.2.1.0/24</b></td>
        </tr>
    </tbody>
    </table>
   <br>

    ![2-2-1.png](2-2-1.png)

    <br>

2. 作成した仮想クラウドネットワークのセキュリティ・リストに次のルールを追加します。
<br>本チュートリアルではプライベート・サブネットにADB-Dを立て、パブリック・サブネットの仮想マシンからアクセスすることを想定しています。

    <table>
    <thead>
        <tr>
            <th colspan="3">セキュリティ・リストに追加</th>
        </tr>
        <tr>
			<td><b>サブネット</b></td>
            <td><b>CIDR</b></td>
			<td><b>ルール</b></td>
        </tr>
    </thead>
    <tbody>       
		<tr>
			<td>プライベート・サブネット</td>
            <td>10.2.1.0/24</td>
            <td><b>イングレス・ルール</b>
                <br>・プライベート・サブネット内のノード間のすべての通信を許可(AVM作成に必要)
                <br>・パブリック・サブネットからDBリスナーポート1521の通信を許可(DBへの接続)
                <br>・パブリック・サブネットからhttpsポート443の通信を許可（Database Actions/APEX)
                <br>・（必要に応じて）TCPS用のポート2484、ONS用のポート6200の通信を許可
                <br><b>エグレス・ルール</b>
                <br>・プライベート・サブネット内のアウトバウンド通信を全て許可
                <br>・パブリック・サブネットへのアウトバウンド通信をすべて許可</td>
        </tr>
        <tr>
            <td>パブリック・サブネット</td>
            <td>10.2.0.0/24</td>
            <td><b>イングレス・ルール</b>
                <br>・インターネットからsshポート22の通信を許可
                <br>・インターネットからhttpsポート443の通信を許可
                <br><b>エグレス・ルール</b>
                <br>・インターネットへのすべてのアウトバウンド通信を許可</td>
		</tr>
	</tbody>
    </table>

    <br>
    ![2-2-2.png](2-2-2.png)

    <br>
<a id="anchor2-4"></a>

## 2-4. Autonomous Exadata VMクラスタの作成

1. メニューから「**Oracle Database**」→「**Autonomous Database**」をクリックします。
<br>「**専用インフラストラクチャ**」の項目から「**Autonomous Exadata VMクラスタ**」を選択し、「**Autonomous Exadata VMクラスタの作成**」をクリックします。

    ![2-3-1-1.png](2-3-1-1.png)

2. Autonomous Exadata VMクラスタを作成します。
<br>設定項目は次の通り入力してください。

   <table>
    <thead>
        <tr>
            <th colspan="3">Autonomous Exadata VMクラスタ作成画面での設定項目</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="2">基本情報の指定</td>
			<td><b>コンパートメントの選択</b>：
			<br>Autonomous Exadata VMクラスタを作成するコンパートメントを選択</td>
            <td>任意</td>
        </tr>
		<tr>
			<td><b>表示名</b>：
			<br>リソースを簡単に識別できるようにする名称。表示名は一意である必要はありません。</td>
            <td>任意 
            <br>例：AVMCluster1</td>
        </tr>
		<tr>
            <td rowspan="1"></td>
			<td><b>Exadataインフラストラクチャの選択</b></td>
            <td>2-1で作成したEIを選択</td>
        </tr>
        <tr>
            <td rowspan="4">Autonomous VMクラスタ・リソースの構成</td>
        	<td><b>Maximum number of Autonomous Container Database:</b>
            <br>AVMで作成可能なACD数の上限。設定できる値は後のノード当たりのOCPU数に依存します</td>
            <td>任意</td>
        </tr>
        <tr>
			<td><b>ノード当たりのOCPU数</b></td>            
            <td>任意</td>
        </tr>
        <tr>
			<td><b>OCPU当たりのデータベース・メモリー(GB)</b></td>
            <td>任意</td>
        </tr>
        <tr>
			<td><b>Database Storage(TB)</b></td>
            <td>任意</td>
        </tr>
		<tr>
            <td rowspan="2">ネットワーク構成の設定</td>
			<td><b>仮想クラウドネットワークの選択</b></td>
            <td>2-2で作成したVCNを選択</td>
        </tr>
		<tr>
			<td><b>サブネットの選択</b></td>
            <td>2-2でイングレス・ルールを設定したプライベート・サブネットを選択</td>
        </tr>
        <tr>
            <td rowspan="1"></td>
			<td><b>メンテナンスの詳細の指定:</b>
            <br>必要に応じてメンテナンスのスケジュールを構成できます。AVMクラスタ作成後にも変更が可能です。</td>
            <td>任意</td>
        </tr>
		<tr>
            <td rowspan="1"></td>
			<td><b>ライセンス・タイプの選択</b>：
			<br>「ライセンス持ち込み」および「ライセンス込み」より選択します。</td>
            <td>ライセンス持ち込み(BYOL)</td>
        </tr>
        <tr>
            <td rowspan="1"></td>
			<td><b>拡張オプション</b>：
			<br>タイム・ゾーンの指定ができます。</td>
            <td>任意</td>
        </tr>
    </tbody>
    </table>

    <br>

    ![2-3-2-1.jpg](2-3-2-1.jpg)

    <br>

3. AVMのアイコンが緑色になったらプロビジョニング完了です。<br>プロビジョニングには約4時間半程かかります。（2023/1時点）

    ![2-3-3.png](2-3-3.png)

<br>
<a id="anchor2-5"></a>

## 2-5. Autonomous Container Databasesの作成

2-4で作成したAVM上に、コンテナ・データベースを作成します。

1. 2-4で作成したAVMの詳細画面から、「**Autonomous Container Databaseの作成**」をクリックします。

    ![2-4-1.png](2-4-1.png)

2. Autonomous Container Databaseを作成します。
    <br>設定項目は次の通り入力してください。

   <table>
        <thead>
        <tr>
            <th colspan="3">Autonomous Container Database作成画面での設定項目</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td rowspan="2">基本情報の指定</td>
			<td><b>コンパートメントの選択</b>：
			<br>Autonomous Container Databaseを作成するコンパートメントを選択</td>
            <td>AVMを配置したコンパートメントを選択</td>
        </tr>
		<tr>
			<td><b>表示名</b>：
			<br>リソースを簡単に識別できるようにする名称。表示名は一意である必要はありません。</td>
            <td>任意<br>例：ACD1</td>
        </tr>
    <tr>
        <td></td>
        <td><b>Autonomous Data Guardの構成</b>：
        <br>Autonomous Data Guardを有効化して、プライマリおよびスタンバイのACDを作成することができます。オプションなので任意。</td>
        <td>任意</td>
    </tr>
    <tr>
        <td></td>
        <td><b>自動メンテナンスの構成</b>：
        <br>必要に応じて、メンテナンスの種類またはスケジュールを構成できます。</td>
        <td>任意</td>
    </tr>
    </tbody>
    </table>
    <br>

    ![2-4-2.png](2-4-2.png) 

    <br>

    >【補足】自動メンテナンスの構成について
    > 
    > EI、AVM、ACDは四半期に一回自動メンテナンスが行われます。このメンテナンスのスケジュールは、ユーザによるスケジュールの指定と、システムによるスケジュールのいずれかを選択することができます。<br>スケジュールをカスタマイズする場合は、次の設定画面から分かる通り細かいスケジュールを設定できます（例はACDです）。
    > <br>
    > <img src="2-4-2-1.jpg" title="2-4-2-1.jpg">

    <br>

3. ACDのアイコンが緑色になったらプロビジョニング完了です。<br>プロビジョニングには約30分程かかります。（2023/1時点）

    ![2-4-3.png](2-4-3.png)

<br>
<a id="anchor2-6"></a>

## 2-6. Autonomous Databaseの作成

いよいよADBインスタンスを作成します。2-5で作成したACD上にADBを作成します。

1. 「**Autonomous Databaseの作成**」をクリックします。

    ![2-5-1.jpg](2-5-1.jpg)

2. Autonomous Databaseを作成します。
<br>設定項目は次の通り入力してください。
<br>※Autonomous Databaseの作成方法については [101: ADBインスタンスを作成してみよう](https://oracle-japan.github.io/ocitutorials/database/adb101-provisioning/){:target="_blank"} で詳細に説明していますので、重複する部分の説明は割愛します。デプロイメント・タイプのみ異なることにご注意ください。

   <table>
    <thead>
        <tr>
            <th colspan="3">Autonomous Database作成画面での設定項目</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="3">基本情報の指定</td>
			<td><b>コンパートメントの選択</b></td>
            <td>任意</td>
        </tr>
		<tr>
			<td><b>表示名</b></td>
            <td>任意 例：ATPD1</td>
        </tr>
		<tr>
			<td><b>データベース名</b></td>
            <td>任意 例：ATPD1</td>
        </tr>
		<tr>
            <td rowspan="1"></td>
			<td><b>ワークロード・タイプの選択</b></td>
            <td>任意</td>
        </tr>
		<tr>
            <td rowspan="2">デプロイメント・タイプの選択</td>
			<td><b><font color="#c74634">デプロイメント・タイプの選択</font></b></td>
            <td><font color="#c74634">専有インフラストラクチャ</font></td>
        </tr>
		<tr>
			<td><b><font color="#c74634">Autonomous Container Databaseの選択</font></b>：
			<br>どのACD上に構成するか選択する</td>
            <td><font color="#c74634">ADBを作成したいACDを選択する</font></td>
        </tr>
		<tr>
            <td rowspan="3">データベースの構成</td>
			<td><b>OCPU数</b></td>
            <td>任意</td>
        </tr>
		<tr>
			<td><b>OCPU自動スケーリングの有効化</b></td>
			<td>任意</td>
		</tr>
		<tr>
			<td><b>ストレージ</b></td>
			<td>任意</td>
		</tr>
		<tr>
			<td rowspan="2">管理者資格証明の作成</td>
			<td><b>ユーザ名</b></td>
            <td>ADMIN</td>
        </tr>
		<tr>
			<td><b>パスワード</b></td>
			<td>任意
			<br>例：Welcome12345#</td>
		</tr>
		<tr>
            <td rowspan="1">ネットワーク・アクセスの構成</td>
			<td><b><font color="#c74634">アクセス制御リストの編集</font></b>：
			<br>特定のIPアドレスのクライアントのみにデータベースへのアクセスを制限できます。</td>
            <td><font color="#c74634">任意</font></td>
        </tr>
    </tbody>
    </table>

    ![2-5-2.png](2-5-2.png)

3. ADBのアイコンが緑色になったらプロビジョニング完了です。<br>プロビジョニングには約5分程かかります。（2023/1時点）

    ![2-5-3.png](2-5-3.png)

<br>
<a id="anchor3"></a>

# 3. 作成したADBに接続してみよう

1. 2-5で作成したADBの詳細画面を表示し、「**DB接続**」をクリックすると接続に必要な情報を入手できます。

    ![3-3-1.png](3-3-1.png)

2. ADBに接続します。接続を行う仮想マシンの設定は[204: 開発者向け仮想マシンのセットアップ方法](https://oracle-japan.github.io/ocitutorials/database/adb204-setup-VM/){:target="_blank"}を参照ください。TLSがついている接続サービスはADB-Sに接続する場合と同様の方法で接続ができます。またTLSがついていない接続サービスはウォレットなしで接続することが可能です。


# 参考資料
+ [LiveLabs:Oracle Autonomous Database Dedicated for Fleet Administrators Workshop](https://docs.oracle.com/pls/topic/lookup?ctx=en/cloud/paas/autonomous-database/dedicated/iywpw&id=adbd_ll_fa){:target="_blank"}


<br>
以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)
