---
title: "OCI IAM Identity Domain環境でOracle Content Managementインスタンスを作成する"
excerpt: "この文書はOCI IAM Identity Domain環境でOracle Content Managementインスタンス作成方法をステップ・バイ・ステップで紹介するチュートリアルです。"
order: "012"
layout: single
tags:
  - OCE
  - OCM
header:
  teaser: "/content-management/create_ocm_instance_IdentityDomain/015.jpg"
  overlay_image: "/content-management/create_ocm_instance_IdentityDomain/015.jpg"
  overlay_filter: rgba(80,80,80,0.7)
---

この文書は **OCI IAM Identity Domain環境** でOracle Content Management(OCM)のインスタンス作成方法をステップ・バイ・ステップで紹介するチュートリアルです。

なお、IDCS環境でOCMインスタンスを作成する場合は、[Oracle Content Managementインスタンスを作成する](../create_oce_instance)をご参照ください

**【お知らせ】**  
この文書は、2022年7月時点での最新バージョン(22.7.2)を元に作成されてます。  
チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。  
{: .notice--info}

<br>

# 1. 準備

## 1.1 OCM インスタンス作成手順の説明

インスタンスの作成手順は以下の通りです

![OCM作成フローチャート](001.jpg)

このチュートリアルでは、以下の条件で作成します
+ ホームリージョンは **Japan East(Tokyo)** を選択
+ インスタンスの作成ユーザーは **テナント管理ユーザー**
+ ドメインは **Default**
+ コンパートメントを作成(コンパートメント名=**OCM**)
+ ライセンス・タイプは **Premium Edition** を選択


## 1.2 Oracle Cloud の環境を準備する

Oracle Cloud のアカウントを準備します。無料のトライアル環境も利用することもできますので、この機会に取得してみましょう。

なお、トライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です（希望しない限り課金されませんので、ご安心ください）
- [Oracle Cloud 無料トライアルを申し込む](https://www.oracle.com/jp/cloud/free/)

トライアル環境のサインアップ手順はこちらをご確認ください。
- [Oracle Cloud 無料トライアル・サインアップガイド(PDF)](https://faq.oracle.co.jp/app/answers/detail/a_id/6492)
- [Oracle Cloud 無料トライアルに関するよくある質問(FAQ)](https://www.oracle.com/jp/cloud/free/faq.html)

##  1.3 Oracle Cloud にサイン・インする

OCM インスタンスは、**Oracle Cloud Infrastructure コンソール**（以降OCIコンソール）から作成します。ここでは、前の手順で作成した **テナント管理ユーザー** で OCI コンソールにアクセスします

こちらのチュートリアルもあわせてご確認ください

+ [その1 - OCIコンソールにアクセスして基本を理解する](/ocitutorials/beginners/getting-started/)


1. Webブラウザで、以下のURLにアクセスします

    + https://cloud.oracle.com

1. **Cloud Account Name （クラウドアカウント名）** を入力し、**Next** をクリックします。  
**Cloud Account Name** には、Oracle Cloud 契約時、もしくはトライアル環境を申し込んだ際に払い出される一意のID（クラウド・アカウント）を入力します

    ![OCIコンソールにサインイン](002.jpg)

1. **ドメイン** で **Default** が選択されていることを確認し、**ユーザー名** と **パスワード** を入力し、サイン・インをクリックします

    ![シングルサインオン](003.jpg)

1. OCI コンソールが表示されます

    ![OCIコンソール](004.png)



## 1.4 委任ユーザーを作成する

この手順は必須ではありません。  
委任ユーザーを作成せず、テナント管理ユーザーで OCM インスタンスを作成する場合は、ここをスキップして次の手順を実施してください  
{: .notice--info}

### 1.4.1 説明

OCM インスタンスの作成を実行するユーザーは、下記条件を満たす必要があります

+ **該当するIdentity Domain内のユーザーであること**
+ **該当するIdentity DomainのAdministratorsグループに所属していること (=Identity Domainの管理権限が付与されていること)**


### 1.4.2 Identity Domain内に委任ユーザーを作成する

Identity DomainのAdministratorsグループに所属するユーザー(=委任ユーザー)を作成します

1. OCIコンソールに Oracle Cloud 環境を取得した際に作成した **テナント管理ユーザー** でサインインします。

1. OCIコンソールの左上のメニューをクリックし、**アイデンティティとセキュリティ→アイデンティティ→ドメイン** をクリックします

    ![ドメイン](005.jpg)

1. **Default** ドメインをクリックします

    ![Defaultドメイン](006.jpg)

1. 左ナビゲーションの **「ユーザー」** をクリックします

    ![ユーザー](007.jpg)

1. **「ユーザーの作成」** をクリックします

    ![ユーザーの作成](008.jpg)

1. **「名」「姓」「ユーザー名/電子メール」** を入力します。続けて **Administrators** グループを選択します。最後に **「作成」** をクリックします

    ![作成](009.jpg)

1. 作成した委任ユーザーのメールアドレス対してメールが送信されます。パスワードを設定し、ユーザーアカウントのアクティベーションを実施します

1. 委任ユーザーで、OCIコンソールにサインインします。OCM インスタンスを作成する場合は、このまま次の手順を実施します


## 1.5 コンパートメントの作成

この手順は必須ではありません。  
ただし、セキュリティ上の理由から、Oracleでは、既存のルート・コンパートメントを使用するのではなく、
新規コンパートメントを作成して使用することを強くお薦めします  
{: .notice--info}

OCM インスタンスを作成する際に、**コンパートメント(Compartment)** を指定します。必要に応じて OCM インスタンスが利用するコンパートメントを事前に作成します。
ここでは、ルート・コンパートメント配下に **OCM** コンパートメントを作成します

1. OCI コンソールを開き、左上のメニュー→ **アイデンティティとセキュリティ→アイデンティティ→コンパートメント** を選択します

    ![コンパートメント](010.jpg)

1. **「コンパートメントの作成」** をクリックします

    ![コンパートメントの作成](011.jpg)

1. **「名前」** と **「説明」** を入力し、**「コンパートメントの作成」** をクリックします（ここでは OCM コンパートメントを作成）

    ![コンパートメントの作成](012.jpg)

1. **OCM** コンパートメントが作成されます

<br />

# 2. OCM インスタンスの作成

インスタンスを作成します。ここではホームリージョンの `Japan East(Tokyo)` で作成します

## 2.1 OCM インスタンスの作成

1. OCI コンソールを開きます

1. OCM インスタンスを作成するホームリージョン（例: US East (Ashburn) など）を選択します。ここでは **Japan East (Tokyo)** を選択しています

    ![リージョンの選択](013.jpg)

1. 左上のメニューをクリックし、**「開発者サービス」→「コンテンツ管理」→「インスタンス」** をクリックします

    ![OCMインスタンスの作成](014.jpg)

1. 画面左の「コンパートメント」より、**OCMインスタンスを作成するコンパートメント** （ここでは **OCM** コンパートメント）を選択し、**「インスタンスの作成」** をクリックします

    ![OCMインスタンスの作成](015.jpg)

    1. **「インスタンス名」** と **「説明」** を入力します

    1. **「コンパートメント」** にあらかじめ選択したものが設定されていることを確認します（この場合 **OCM** コンパートメントを選択）。選択されていない場合は、ここでコンパートメントを選択します

    1. **「ライセンス・タイプ」** を選択します（ここでは **Premium Edition** を選択）。ライセンス・タイプの詳細は [2.3 OCMインスタンスの作成オプションについて](#23-ocmインスタンスの作成オプションについて) をご確認ください

    1. **「インスタンスの作成」** をクリックします

        ![OCMインスタンスの作成](016.jpg)

        >**[TIPS]**  
        >インスタンス名は、OCMインスタンスにアクセスする際の URL に含まれます（下記URLの \<OCM Instance\> に該当）  
        > https://\<OCM Instance\>-\<Cloud Account\>.cec.ocp.oraclecloud.com/documents/home

1. OCMインスタンスの作成（プロビジョニング）が開始されます

1. しばらく待つと、OCM インスタンスの作成が完了します。OCMインスタンスがアクティブであることを確認します

1. OCM インスタンス詳細の **「インスタンスのオープン」** をクリックします

    ![OCMインスタンスの作成](023.webp)

1. OCM インスタンスのホーム画面が開きます

    ![OCMインスタンスのホーム](024.jpg)


## 2.2 OCM インスタンスの作成完了後の確認

この手順は必須ではありません  
{: .notice--info}


OCM インスタンスを作成すると、OCI に以下のリソースが自動的に作成されます。必要に応じて確認してください

- オブジェクトストレージに OCM 専用のバケットが自動生成されます

  - バケット名の指定や変更はできません

  - OCM インスタンス利用中は削除しないでください

- ルート・コンパートメントに ***OCE_Internal_Storage_Policy*** のポリシーが自動生成されます。ポリシーを確認するには、「アイデンティティとセキュリティ」→「ポリシー」で、ルート・コンパートメントを選択します

  - このポリシーは、OCM インスタンス利用中は削除しないでください

また、OCM インスタンス作成ユーザーに対して、`Oracle Cloudへようこそ。Content Management サービスを使用する準備ができました　`（英語の場合、`Welcome to Oracle Cloud. Your Content Management service is ready for use`）の通知メールが送信されます


## 2.3 OCMインスタンスの作成オプションについて

OCMインスタンスを作成する際に、様々なオプションを選択することができます。ここでは、そのオプションについて説明します（※ ***太字斜体*** がデフォルト設定）


1. **ライセンス・タイプ**

    - ***Premium Edition*** (OCMのフル機能を利用できる新規ライセンスを取得)

    - BYOL Edition (所有するOracle WebCenterライセンスを持ち込む)

    - Starter Edition (OCMの[機能限定版](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/starter-vs-premium-edition.html)ライセンスを取得。**Always Free** の対象)

1. **ライセンス・オプション**

    - Sales Accelerator (Sales Enablementコンテンツを提供するWebアプリケーション。Oracle SaaS顧客のみ利用可)

    - Video Creation Platform (チーム向け動画作成プラットフォーム「Sauce Video」を利用。`有償オプション`)


1. **インスタンス・タイプ**

    - ***プライマリ*** (プライマリーインスタンス。本番環境等で利用)

    - プライマリでない (非プライマリーインスタンス。本番用のプライマリインスタンスとは別に開発/検証/災害対策等の環境として利用。Starter Edition選択時は項目選択不可)

1. **アップグレード・スケジュール**

    - ***即時アップグレード*** (新しいリリースが利用可能になったら即座にアップグレードされる)

    - アップグレードの遅延 (新しいリリースが利用可能になっても、1リリースサイクル遅れてアップグレードされる。Starter Edition選択時は項目選択不可)

1. **インスタンスのアクセスタイプ**

    - ***パブリック*** (パブリックなインターネットを経由したアクセス)

    - プライベート (OCI FastConnect による閉域網アクセス。Starter Edition選択時は項目選択不可)


以下のマニュアルやYouTube動画もあわせてご確認ください  
- [Create an OCM Instance in a Region with Identity Domains](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/create-your-oracle-content-management-instance.html)
- [Deploy Oracle Content Management on Oracle Cloud Infrastructure (OCI) with Identity Domains(YouTube)](https://youtu.be/pW4OS2Fhsu4)


<br>

以上でこのチュートリアルは終了です。

[ページトップへ戻る](#top)
