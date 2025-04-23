---
title: "OCI IAM Identity Domainsのドメインの追加とライセンスタイプを変更する"
excerpt: "OCI IAM Identity Domainsは2021年に登場したOCIの新しい認証基盤です。Identity DomainsはOCIへのユーザーの認証・認可だけではなく、OracleのSaaSや他社クラウドのSaaSなどへの認証基盤としてご利用いただくことも可能です。利用用途に合わせてIdentity Domainを新しく追加したり、ドメインのライセンスタイプを変更していただくことができます。本チュートリアルではIdentity Domainsのドメインを新規作成する手順と、ドメインのライセンスタイプの変更手順を紹介します。"
order: "150"
layout: single
tags:
 - identity
header:
 teaser: "/ocitutorials/identity/identitydomain-createdomain-alterdomaintype/identitydomains1.png"
 overlay_image: "/ocitutorials/identity/identitydomain-createdomain-alterdomaintype/identitydomains1.png"
 overlay_filter: rgba(34, 66, 55, 0.7)
redirect_to: https://oracle-japan.github.io/ocitutorials/identity/identitydomain-createdomain-alterdomaintype
---

2021年にOCIの新しい認証基盤としてOCI IAM Identity Domainsが登場しました。Identity DomainsはOCIのIAMサービスに代わりOCIへのユーザーの認証・認可の役割と、OCIのIdentity Cloud Serviceで提供していた他サービスとの認証連携、認証強化の機能を提供しています。
OCIの環境にはデフォルトで「Default Domain」と呼ばれるドメインが作成されます。Default Domainは主にOCIへのユーザーの認証、認可にお役立ていただくことが可能です。また、Identity Domainsの用途に応じて、新しくドメインを作成したり、ライセンスタイプを変更することも可能です。
本チュートリアルでは、新しいドメインの追加方法と、ライセンスタイプの変更方法をご紹介します。
Identity Domainsのライセンスタイプの一覧と、各ライセンスタイプの機能制限などについては[ドキュメント](https://docs.oracle.com/ja-jp/iaas/Content/Identity/sku/overview.htm)をご参照ください。



**所要時間 :** 約20分


**前提条件 :**
+ 新しいドメインを作成するには、OCIテナントの管理者権限を持つユーザーが操作を実行する必要があります。操作を実行するユーザーがOCIテナントの管理者ではない場合は、ユーザーにOCIテナントの管理者権限を付与してください。


**注意 :**
+ ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。


# 1. Default Domainにログイン
[OCIのログイン画面](https://www.oracle.com/cloud/sign-in.html)でクラウド・アカウント名を入力します。
 
  ![画面ショット1](identitydomains2.png)


Select an identity domain to sign inのドロップダウンボックスから「Default」を選択し「Next」ボタンをクリックします。
 
  ![画面ショット2](identitydomains3.png)


ログイン画面でOCIテナント管理者のユーザー名とパスワードを入力してサインインします。
 
  ![画面ショット3](identitydomains4.png)


# 2. ドメインの作成

OCIコンソール画面左上のメニューより、「アイデンティティとセキュリティ」→「アイデンティティ」→「ドメイン」を選択します。「ドメインの作成」ボタンをクリックします。
 
  ![画面ショット4](identitydomains5.png)

ドメイン作成画面にて、以下情報を記載し「ドメインの作成」ボタンをクリックします。
+ **`表示名`** - 任意（ログイン画面に表示されるアイデンティティ・ドメイン名になります）
+ **`説明`** - 任意
+ **`ドメインタイプ`** - Free/Oracle Apps Premium/Premium/外部ユーザーのいずれかを選択 （※各ドメインタイプの価格はOCIの価格表をご参照ください。）
+ **`ドメイン管理者(姓・名・ユーザー名・メールアドレス)`** - 作成するアイデンティティ・ドメインの管理者の情報を入力
 
 ![画面ショット5](identitydomains6.png)


# 3. ドメインの確認
アイデンティティ・ドメインの作成が完了すると、ステータスがアクティブになります。
 
 ![画面ショット6](identitydomains7.png)

アイデンティティ・ドメイン名をクリックすると、詳細情報を確認することができます。
 
 ![画面ショット7](identitydomains8.png)


# 4. アイデンティティ・ドメインのタイプ変更

アイデンティティ・ドメインの詳細画面の、「ドメインの編集」ボタンをクリックします。
ドメインの編集画面にて、「ドメイン・タイプの変更」ボタンをクリックします。
（※Defaultのアイデンティティ・ドメインを「外部ユーザー」のドメインタイプに変更することはできません。）
 
 ![画面ショット8](identitydomains9.png)

ドメイン・タイプの変更画面にて、変更するドメイン・タイプを選択し、「ドメイン・タイプの変更」→「保存」ボタンをクリックします。
 
 ![画面ショット9](identitydomains10.png)

アイデンティティ・ドメインのドメイン・タイプが変更されました。
 
 ![画面ショット10](identitydomains11.png)
