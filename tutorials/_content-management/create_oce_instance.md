---
title: "Oracle Content and Experience インスタンスを作成する"
excerpt: "この文書は Oracle Content and Experience (OCE) のインスタンス作成方法をステップ・バイ・ステップで紹介するチュートリアルです。"
order: "010"
layout: single
tags: "OCE"
header:
  teaser: "/content-management/create_oce_instance/022.webp"
  overlay_image: "/content-management/create_oce_instance/022.webp"
  overlay_filter: rgba(80,80,80,0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474330
---

この文書は Oracle Content and Experience (OCE) のインスタンス作成方法をステップ・バイ・ステップで紹介するチュートリアルです。

~~~
この文書は、2021年1月時点での最新バージョン(21.1.1)を元に作成されてます
~~~

<br>

# 1. 準備

## 1.1 OCEインスタンス作成手順の説明

OCEインスタンスの作成手順は以下の通りです

![OCE作成フローチャート](001.jpg)

このチュートリアルでは、以下の条件で作成します
+ ホームリージョンは **US East(Ashburn)** を選択
+ OCE インスタンスの作成ユーザーは **テナント管理ユーザー**
+ OCE専用コンパートメントを作成(コンパートメント名=**OCE**)


## 1.2 Oracle Cloud の環境を準備する

Oracle Cloud のアカウントを準備します。無料のトライアル環境も利用することもできますので、この機会に取得してみましょう。

なお、トライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です（希望しない限り課金されませんので、ご安心ください）
- [Oracle Cloud 無料トライアルを申し込む](https://www.oracle.com/jp/cloud/free/)

トライアル環境のサインアップ手順はこちらをご確認ください。
- [Oracle Cloud 無料トライアル・サインアップガイド(PDF)](https://faq.oracle.co.jp/app/answers/detail/a_id/6492)
- [Oracle Cloud 無料トライアルに関するよくある質問(FAQ)](https://www.oracle.com/jp/cloud/free/faq.html)

##  1.3 Oracle Cloud にサイン・インする

OCE インスタンスは、**Oracle Cloud Infrastructure コンソール**（以降OCIコンソール）から作成します。ここでは、前の手順で作成した **テナント管理ユーザー** で OCI コンソールにアクセスします

こちらのチュートリアルもあわせてご確認ください

+ [その1 - OCIコンソールにアクセスして基本を理解する](https://oracle-japan.github.io/ocitutorials/beginners/getting-started/)


1. Webブラウザで、以下のURLにアクセスします

    + https://cloud.oracle.com

1. **Cloud Account Name （クラウドアカウント名）** を入力し、**Next** をクリックします。  
**Cloud Account Name** には、Oracle Cloud 契約時、もしくはトライアル環境を申し込んだ際に払い出される一意のID（クラウド・アカウント）を入力します

    ![OCIコンソールにサインイン](002.jpg)

1. 左側の **Single Sign-On (SSO)** の下の **Continue** をクリックします。  
左側のSingle Sign-On (SSO) は、IDCS で認証されます。ここでサイン・インできれば、条件の「1. IDCS ユーザーであること」はOKとなります

    ![シングルサインオン](003.webp)

1. **ユーザー名** と **パスワード** を入力し、サイン・インをクリックします

    ![サイン・オン](004.webp)

1. OCI コンソールが表示されます

    ![OCIコンソール](005.png)



## 1.4 委任ユーザーを作成する

~~~
この手順は必須ではありません。
委任ユーザーを作成せず、テナント管理ユーザーでOCEインスタンスを作成する場合は、ここをスキップして次の手順を実施してください
~~~

### 1.4.1 説明

OCE インスタンスの作成を実行するユーザーは、下記条件を満たす必要があります

+ **Oracle Identity Cloud Service (以降IDCS) よりフェデレーションされたユーザー (=IDCS ユーザー) であること**
+ **IDCS の OCI_Administrators グループに所属していること (=OCI の管理権限が付与されていること)**


### 1.4.2 IDCSコンソールを開き、IDCSユーザー（委任ユーザー）を作成する

IDCSコンソールにアクセスし、OCI_Administrators グループに所属するIDCSユーザー(=委任ユーザー)を作成します

1. OCIコンソールに Oracle Cloud 環境を取得した際に作成した **テナント管理ユーザー** でサインインします。

1. OCI コンソールの右上のユーザーアイコンをクリックし、**「サービス・ユーザー・コンソール」** をクリックします

    ![サービスユーザーコンソール](006.webp)

1. ホームリージョンのデータセンター(ここではAshburnが所属するNorth America)を選択し、Oracle Identity Cloud Service の **「管理コンソール」** をクリックします

    ![IDCSの管理コンソール](007.webp)

1. IDCS コンソールが開きます。左ナビゲーションの **「ユーザー」** をクリックします

    ![ユーザー](009.jpg)

1. **「追加」** をクリックします

    ![ユーザーの追加](010.jpg)

1. **「名」「姓」「ユーザー名/電子メール」** を入力し、**「次」** をクリックします

    ![ユーザーの追加](011.webp)

1. **OCI_Administrators** グループを選択し、**「終了」** をクリックします

    ![ユーザーの追加](012.jpg)

1. 作成した委任ユーザーに対してメールが送信されます。仮パスワードを利用し、OCIコンソールにサインインします。この時にパスワードの再設定します

1. 委任ユーザーでOCEインスタンスを作成する場合は、このまま次の手順を実施します


## 1.5 コンパートメントの作成

~~~
この手順は必須ではありません。
ただし、セキュリティ上の理由から、Oracleでは、既存のルート・コンパートメントを使用するのではなく、
新規コンパートメントを作成して使用することを強くお薦めします。
~~~

OCE インスタンスを作成する際に、**コンパートメント(Compartment)** を指定します。必要に応じて OCE インスタンスが利用するコンパートメントを事前に作成します。
ここでは、ルート・コンパートメント配下に **OCE** コンパートメントを作成します

1. OCI コンソールを開き、左上のメニュー→ **「アイデンティティ」→「コンパートメント」** を選択します

    ![コンパートメント](013.webp)

1. **「コンパートメントの作成」** をクリックします

    ![コンパートメントの作成](014.webp)

1. **「名前」** と **「説明」** を入力し、**「コンパートメントの作成」** をクリックします（ここでは OCE コンパートメントを作成）

    ![コンパートメントの作成](015.webp)

1. **OCE** コンパートメントが作成されます

    ![コンパートメントの作成](016.webp)



# 2. OCE インスタンスの作成

OCE インスタンスを作成します。ここでは、ホームリージョンである `US East(Ashburn)` で作成します

## 2.1 OCE インスタンスを作成するリージョンについて

OCE インスタンスは、**OCI のホームリージョンが所属するデータ・リージョン内に作成** することを推奨します。

OCI のホームリージョンではないデータ・リージョンで OCE インスタンスを作成する場合、OCEインスタンスを作成するリージョンと同一のデータ・リージョンの IDCS をユーザー管理に使用しなければいけない（=ホームリーションにあるOCIとのフェデレーションが事前定義されたPrimaryのIDCSを利用できない）、という制限があるため

-  例）OCI のホームリージョンが **東京(ap-tokyo-1)** の場合

    - APAC データ・リージョン内のリージョン（東京、大阪、ソウル、シドニーほか）にOCEインスタンスを作成

        - APAC データリージョンの IDCS を利用（Primary の IDCS。OCIとのフェデレーションが事前定義済）

    - NA（北米）データ・リージョン内のリージョン（Ashburn、Phoenixほか）にOCEインスタンスを作成

        - NA(北米)データリージョンの IDCS を利用（Primary ではない IDCS。OCI とのフェデレーション設定なし）

        - ユーザー情報の管理が Primary の IDCS と NA の IDCS で別々の管理となる

- **参考情報**

  - [Creating OCE Instance On Non-Primary Region Rejected With "404" or "400" Error (Doc ID 2596621.1)](https://support.oracle.com/epmos/faces/DocumentDisplay?id=2596621.1)

  - [Data Regions for Platform and Infrastructure Services](https://www.oracle.com/cloud/data-regions.html#northamerica)


## 2.2 OCE インスタンスの作成

1. OCI コンソールを開きます

1. OCE インスタンスを作成するホームリージョンを選択します（ここでは **US East(Ashburn)** を選択）

    ![リージョンの選択](017.webp)

1. 左上のメニューをクリックし、**「アプリケーション統合」→「コンテンツとエクスペリエンス」** をクリックします

    ![OCEインスタンスの作成](018.webp)

1. 画面左の「コンパートメント」で、**OCE インスタンスを作成するコンパートメント** （ここでは OCE コンパートメント）を選択し、**「インスタンスの作成」** をクリックします

    ![OCEインスタンスの作成](019.webp)

1. **「インスタンス名」** と **「説明」** を入力し、**「作成」** をクリックします

    ![OCEインスタンスの作成](020.webp)

    >**Memo**  
    >インスタンス名は、OCE インスタンスにアクセスする際の URL に含まれます（下記URLの \<OCE Instance\> に該当）  
    > https://\<OCE Instance\>-\<Cloud account\>.cec.ocp.oraclecloud.com/documents/home

1. OCE インスタンスの作成（プロビジョニング）が開始されます。プロビジョニング中のインスタンス名（ここでは OCE002）をクリックします

    ![OCEインスタンスの作成](021.webp)

1. しばらく待つと、OCE インスタンスの作成が完了します。OCE インスタンスがアクティブであることを確認します

    ![OCEインスタンスの作成](022.webp)

1. OCE インスタンス詳細の **「インスタンスのオープン」** をクリックします

    ![OCEインスタンスの作成](023.webp)

1. OCE インスタンスのホーム画面が開きます

    ![OCEインスタンスのホーム](024.jpg)


## 2.3 OCEインスタンスの作成完了後の確認

~~~
この手順は必須ではありません
~~~

OCE インスタンスの作成により、OCI に以下のリソースが自動的に作成されます。必要に応じて確認してください

- オブジェクトストレージにOCE専用のバケットが自動生成されます

  - バケット名の指定や変更はできません

  - OCEインスタンス利用中は削除しないでください

- アイデンティティ→ポリシーに ***OCE_Internal_Storage_Policy*** が自動生成されます

  - OCE インスタンス利用中は削除しないでください

また、OCE インスタンス作成ユーザーに対して、`Welcome to Oracle Cloud. Your Content and Experience service is ready for use` の通知メールが送信されます

## 2.4 OCEインスタンスの作成オプションについて

OCEインスタンスを作成する際に、様々なオプションを選択することができます。ここでは、そのオプションについて説明します（※ ***太字斜体*** がデフォルト設定）


1. **ライセンス・タイプ**

    - ***Premium Edition*** (新規ライセンスを取得)

    - BYOL Edition (所有するのOracle WebCenterライセンスを持ち込む)

1. **インスタンス・タイプ**

    - ***プライマリ*** (プライマリーインスタンス。本番環境等で利用)

    - プライマリでない (非プライマリーインスタンス。本番用のプライマリインスタンスとは別に開発/検証/災害対策等の環境として利用)

1. **アップグレード・スケジュール**

    - ***即時アップグレード*** (新しいリリースが利用可能になったら即座にアップグレードされる)

    - アップグレードの遅延 (新しいリリースが利用可能になっても、1リリースサイクル遅れてアップグレードされる)

1. **インスタンスのアクセスタイプ**

    - ***パブリック*** (パブリックなインターネットを経由したアクセス)

    - プライベート (OCI FastConnect による閉域網アクセス)

1. **代替のIdentity Cloud Serviceの使用**

    - デフォルトのIDCSインスタンスではない別のIDCSインスタンスを、OCEユーザーの管理で利用する場合のみ指定（例:本番環境と開発環境でユーザー管理を別々にしたい）

    - 「IDCSドメイン名」と「IDCSドメインID」を指定する

以下のマニュアルも合わせてご確認ください  
- [Create Your Oracle Content and Experience Service Instance](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/create-your-oracle-content-and-experience-service-instance.html)

<br>

以上でこのチュートリアルは終了です。
