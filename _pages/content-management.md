---
title: "コンテンツ管理編"
excerpt: "この文書は Oracle Content Management (OCM) を使ってみよう！という人のためのチュートリアルです"
permalink: /content-management/
layout: single
show_excerpts: true
toc: true
---

**【お知らせ】**  
2021年6月リリースのバージョン21.6.1より、サービス名称が *Oracle Content and Experience(略称:OCE)* から **Oracle Content Management(略称:OCM)** に変更されました。本チュートリアルを利用する際は、旧サービス名称を新しいサービス名称である **Oracle Content Management(OCM)** に読み替えてご利用ください。  
{: .notice--info}

この文書は、Oracle Content Management (OCM) を使ってみよう！という人のためのチュートリアルです。各文書ごとにステップ・バイ・ステップで作業を進めて、OCM が提供する機能について学習することができます

<br />

# 0. 準備

## OCI IAM Identity Domains環境

+ **[OCI IAM Identity Domain環境でOracle Content Managementインスタンスを作成する](/ocitutorials/content-management/create_ocm_instance_IdentityDomain/)**  
    OCI IAM Identity Domain環境でOCMインスタンスを作成する方法をステップ・バイ・ステップで紹介します。まずはここから始めましょう

+ **[OCI IAM Identity Domain環境でOracle Content Managementインスタンスの利用ユーザーを作成する](/ocitutorials/content-management/create_identitydomain_group_user/)**  
    OCI IAM Identity Domain環境でOCMを利用するユーザーを作成する方法をステップ・バイ・ステップで紹介するチュートリアルです

    2021年11月にリリースされた新しい認証基盤。2022年7月時点では新規契約のアカウントのみ利用可
    {: .notice--info}


## Identity Cloud Service(IDCS)環境

+ **[Oracle Content Management インスタンスを作成する](/ocitutorials/content-management/create_oce_instance/)**  
    Oracle Cloud Infrastructure(OCI)の管理コンソールを利用し、OCMインスタンスを作成します。まずはここから始めましょう

+ **[Oracle Content Management インスタンスの利用ユーザーを作成する](/ocitutorials/content-management/create_idcs_group_user/)**  
    OCMを利用するユーザーをIDCSに作成する方法をステップ・バイ・ステップで紹介するチュートリアルです

    以前より提供されていた統合認証基盤。OCMなどのOracle PaaS、OCIを含む様々なクラウドサービス、オンプレミスのアプリケーションに対して認証連携を実現
    {: .notice--info}


## Starter Edition

+ **[[Oracle Cloud] Oracle Content Management の Starter Edition をクイックスタートしてみた](https://qiita.com/nakasato310/items/9457a61d9d27db6ce4f0)** (※外部サイト)  
    この記事では、2021年7月の最新バージョン(21.6.1)より新たに追加された Oracle Content Management - Starter Edition をクイックスタートする方法を紹介します



## システム管理設定

+ **[Oracle Content Managementサービス管理者向け作業ガイド](/ocitutorials/content-management/ocm_admin_guide/)**  <span style="color: red;">Update!</span>  
    OCMインスタンス作成後、利用者への周知・案内をする前にサービス管理者が作業・確認すべきことを紹介します。

+ **[Oracle Content Management のサイト・セキュリティとサイト・ガバナンスを設定する](/ocitutorials/content-management/77_sitesecuritygovernance/)**  
    OCMで作成するWebサイトのサイト・セキュリティとサイト・ガバナンスの設定方法をステップ・バイ・ステップで紹介するチュートリアルです。サービス管理者は、ユーザーにサイト作成機能を利用させる前に、OCMインスタンスの利用目的にあわせたサイト・セキュリティを設定することを推奨します【所要時間:20分】


<br />

# 1. 初級編

## ファイル共有

+ **[Oracle Content Management のファイル共有機能を使ってみよう【初級編】](/ocitutorials/content-management/using_file_sharing/)**  <span style="color: red;">Update!</span>  
    OCM のファイル共有機能を利用して、社内外のユーザーと簡単かつセキュアにファイルを共有することができます。このチュートリアルは、ファイル共有機能を利用する方法をステップ・バイ・ステップで紹介するチュートリアルです【所要時間:約60分】


## アセット管理

+ **[Oracle Content Management を Headless CMS として使ってみよう【初級編】](/ocitutorials/content-management/41_asset_headless/)**  <span style="color: red;">Update!</span>  
    OCMのアセット管理機能を Headless CMS として利用する方法をステップ・バイ・ステップで紹介するチュートリアルです。リポジトリ、公開チャネル、コンテンツ・タイプなどアセット管理の基本的な概念を、ハンズオン形式で習得します【所要時間:約30分】

+ **[Oracle Content Management で請求書などの電子ファイルを長期保管してみよう【初級編】](/ocitutorials/content-management/42_business_repository/)**  
    OCMのアセット管理機能のビジネス・リポジトリを利用し、請求書などのコンテンツを長期保管する方法をステップ・バイ・ステップで紹介するチュートリアルです。ビジネス・リポジトリ、デジタル・アセット・タイプなどアセット管理の基本的な概念を、ハンズオン形式で習得します【所要時間:約20分】


## Webサイト管理

+ **[Oracle Content Management のサイト機能を使ってみよう【初級編】](/ocitutorials/content-management/61_create_site/)**  
    OCMのサイト作成機能を利用し、Webサイト（スタンダードサイト）を作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアルです。ここでは、Web サイトの作成〜編集〜公開までの基本的な手順をハンズオン形式で習得します。さらに、フォルダに登録される複数ドキュメントをWebページからダウンロードできる「資料ダウンロード」ページの作成方法も、あわせて習得します【所要時間:約40分】

+ **[Oracle Content Management を Webコンテンツ管理(Web CMS) として利用しよう【初級編】](/ocitutorials/content-management/62_webcms/)**  <span style="color: red;">Update!</span>  
    OCMのサイト作成機能を利用し、Webサイト（エンタープライズサイト）を作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアルです。また、サイト上で公開するコンテンツは、アセット管理機能で管理されるコンテンツ・アイテムを利用します【所要時間:約30分】


<br />

# 2. 中級編

## Webサイトのカスタマイズ

+ **[Oracle Content Managementのコンテンツ・レイアウトを編集しよう](/ocitutorials/content-management/71_customize_contentlayout/)**  <span style="color: red;">Update!</span>  
    OCMのコンテンツ・レイアウトの編集し、Web ページ上でのコンテンツ・アイテムの表示形式をカスタマイズする方法をステップ・バイ・ステップで紹介するチュートリアルです【所要時間:20分】


+ **[Oracle Content Managementで作成したサイトのバナー画像を変更しよう](/ocitutorials/content-management/72_change_banner/)**  
    OCMのデフォルトテンプレートから作成された Web サイトのバナー画像を変更する手順について、ステップ・バイ・ステップで紹介するチュートリアルです 【所要時間:20分】


+ **[Oracle Content Managementでカスタムテンプレートを自作しよう ](/ocitutorials/content-management/78_create_custom_template/)**  
    OCMでカスタムテンプレートを自作する手順について、ステップ・バイ・ステップで紹介するチュートリアルです 【所要時間:30分】


+ **[[Oracle Cloud] Oracle Content Managementで作成したWebサイトにGoogleフォームで作成したお問い合わせフォームを配置する](https://qiita.com/nakasato310/items/b3b45402eb6371c844a7)** (※外部サイト)  
    OCMのリモートコンポーネントを利用して、Googleフォームで作成したお問い合わせフォームを部品化したカスタムコンポーネントを作成し、Webサイト上にドラッグ＆ドロップで配置できるようにします【所要時間:15分】


## Video Plus アセット

+ **[Oracle Content ManagementのVideo Plus アセットを使ってみよう](/ocitutorials/content-management/73_videoplus/)**  
    OCM の有償オプション機能である拡張ビデオ機能（Video Plus アセット）を利用する手順について、ステップ・バイ・ステップで紹介するチュートリアルです【所要時間:15分】


## タクソノミ（Taxonomy）

+ **[Oracle Content Managementのタクソノミを使ってみよう](/ocitutorials/content-management/75_taxonomy/)**  
    OCM のタクソノミ機能を利用し、リポジトリ内のアセットを分類する方法をステップ・バイ・ステップで紹介するチュートリアルです【所要時間:20分】


## リポジトリのアクセス権限管理

+ **[Oracle Content Managementのリポジトリのアクセス権限を理解しよう](/ocitutorials/content-management/43_repository_permission/)**  <span style="color: red;">New!</span>  
    OCMのアセット管理機能のリポジトリのアクセス権限設定、およびカスタム・ロールを利用した細かい粒度でのアクセス権限設定(Granular Permissions)についてステップ・バイ・ステップで紹介するチュートリアルです【所要時間:20分】


## 多言語サイト（マルチリンガルサイト）

+ **[Oracle Content Managementで多言語サイトを作成しよう](/ocitutorials/content-management/74_create_multilingual/)**  
    OCM のサイト作成機能を利用し、多言語サイトを作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアルです。また、サイト上で公開するコンテンツは、アセット管理機能で管理されるコンテンツ・アイテムを利用します【所要時間:約60分】


## コンテンツ・キャプチャ(Content Capture)

コンテンツ・キャプチャ機能は、紙などの物理的な文書をスキャンしたり、大量の電子文書をインポートした後、処理および索引付けし、OCMにアップロードする機能です。このチュートリアルは、ファイル・インポート・エージェントを介した「監視対象ファイル・フォルダ」から電子文書を取得し、OCMの**ドキュメント(フォルダ)**or**アセット(ビジネスリポジトリ)**にインポートする一連の流れを説明します  

+ **[Oracle Content Management (OCM)- 監視対象フォルダからファイルをドキュメントにインポートしてみよう！](https://qiita.com/shinwata/items/3b3bb329fc6a55591517)** (※外部サイト)  

+ **[Oracle Content Management (OCM)- 監視対象フォルダからファイルをアセットにインポートしてみよう！](https://qiita.com/shinwata/items/61d2fe95c8294d664427)** (※外部サイト)  


<br />

# 3. 上級編（開発者向け）

## Embedded UI（OCMのUIを他のアプリケーションに埋め込み表示）

+ **[[Oracle Cloud] Oracle Content and ExperienceのフォルダUIを、他のアプリケーションに埋め込み表示する方法](https://qiita.com/nakasato310/items/931604ee6c58e4cc9ee2)** (※外部サイト)  
    OCEのフォルダに保管される資料一式を、他のWebアプリケーションに埋め込み表示する方法について紹介します。【所要時間:30分】



## フロントエンド開発（OCMをHeadless CMSとして利用）

+ **[[Oracle Cloud] Oracle Content and Experience を Headless CMS として利用する React サンプルを動かしてみた](https://qiita.com/nakasato310/items/abf9f3ea8b85b09bae3d)** (※外部サイト)  
    サンプル公開されている React の Build a blog を動かすことで、OCEをヘッドレスCMSとして利用するイメージを理解します。【所要時間:30分】

+ **[Oracle Content ManagementをHeadless CMSとして使用したWebサイトをGatsbyで開発する](https://qiita.com/nakasato310/items/0ee3bcf0fbffcd898f2b)** (※外部サイト)  
    Oracle Content Managementのアセットリポジトリで管理・公開されるアセットをGatsbyで開発したWebサイトに表示できるようにします【所要時間:30分】

+ **[Oracle Content Management をHeadless CMSとして利用するGatsbyサイトをNetlifyでホストする](https://qiita.com/nakasato310/items/4e07a47c66e3551e6282)** (※外部サイト)  
    この記事では、[Oracle Content ManagementをHeadless CMSとして使用したWebサイトをGatsbyで開発する](https://qiita.com/nakasato310/items/0ee3bcf0fbffcd898f2b)で作成したGatsbyサイトをNetlifyでホストして公開します。【所要時間:30分】


## GraphQLを使ってみよう

+ **[[Oracle Cloud] GraphQL で Oracle Content Management のデータを取得する](https://qiita.com/nakasato310/items/b160760dff00c5a53ca2)** (※外部サイト)  
    GraphQLを利用し、Oracle Content Management のデータを取得する方法を紹介します【所要時間:15分】

+ **[[Oracle Cloud] GraphQL で Oracle Content Management のデータを取得する（２）](https://qiita.com/nakasato310/items/d69952933a85d11543a5)** (※外部サイト)  
    GraphQLを利用し、Oracle Content Management で登録・公開される複数アイテム（アセット）の情報を取得する方法を紹介します【所要時間:15分】

+ **[[Oracle Cloud] GraphQL で Oracle Content Management のデータを取得する（３）](https://qiita.com/nakasato310/items/7b1e1c3223a737a82192)** (※外部サイト)  
    GraphQLエクスプローラではなく、クライアントアプリケーション(React+Apollo Client)から OCM のアセット情報を取得する方法を紹介します【所要時間:20分】

+ **[[Oracle Cloud] GraphQL で Oracle Content Management のデータを取得する（4）](https://qiita.com/nakasato310/items/48f36e0f6373ded11239)** (※外部サイト)  
    Graphを利用し、Oracle Content Managementで管理される公開済アセット及び未公開アセットの情報を取得する方法を紹介します【所要時間:15分】


## OCM-APEX統合

OCMとOracle Application Express(APEX)アプリケーションを統合して、利用する方法を紹介します。コンテンツ・リポジトリ、デジタル・アセットを設定し、最後にAPIと埋め込みUIオプションを使用してWebサイトを作成します【所要時間:90分】  

オリジナルのワークショップはこちら  
[Oracle LiveLabs: Getting started with Oracle Content Management and integrated with Oracle APEX](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=3148)
{: .notice--info}

+ **[Oracle Content Management (OCM)- APEXと統合したWebサイトを作成してみよう！ その1](https://qiita.com/shinwata/items/b349d93b54832f137f5f)** (※外部サイト)  

+ **[Oracle Content Management (OCM)- APEXと統合したWebサイトを作成してみよう！ その2](https://qiita.com/shinwata/items/ad7c548b627b46412a9f)** (※外部サイト)  

+ **[Oracle Content Management (OCM)- APEXと統合したWebサイトを作成してみよう！ その3](https://qiita.com/shinwata/items/e0ab605d329e37792431)** (※外部サイト)  


## コマンドライン・ユーティリティ「Oracle Content Toolkit」

+ **[Oracle Content Toolkitを利用して Oracle Content Management のサイトをコンパイルしよう](/ocitutorials/content-management/91_compile_site_ocmtoolkit/)**   
    コマンドライン・ユーティリティ「Oracle Content Toolkit」を利用し、OCMで作成・公開したサイトをコンパイルする手順について、ステップ・バイ・ステップで紹介するチュートリアルです。あわせて、Oracle Content Toolkitの利用方法についても紹介します【所要時間:20分】

<br />

# その他お役立ち情報

+ [Oracle Content Management マニュアル](https://docs.oracle.com/en/cloud/paas/content-cloud/books.html)

+ [Oracle Content Management マニュアル（日本語翻訳版）](https://docs.oracle.com/cd/E83857_01/paas/content-cloud/books.html)

    製品ドキュメントの英語原本と日本語翻訳版です。翻訳されるまでに時差がありますので、最新情報の確認は 英語版のドキュメント をご利用ください
    {: .notice--info}
