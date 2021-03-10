---
title: "Oracle Content and Experience インスタンスの利用ユーザーを作成する"
excerpt: "この文書は Oracle Content and Experience (OCE) を利用するユーザーをIDCSに作成する方法をステップ・バイ・ステップで紹介するチュートリアルです"
order: "011"
layout: single
tags: "OCE"
header:
  teaser: "/content-management/create_idcs_group_user/user10.webp"
  overlay_image: "/content-management/create_idcs_group_user/user10.webp"
  overlay_filter: rgba(80,80,80,0.7)
---

この文書は Oracle Content and Experience (OCE) を利用するユーザーをIDCSに追加する方法をステップ・バイ・ステップで紹介するチュートリアルです。

~~~
この文書は、2021年1月時点での最新バージョン(21.1.1)を元に作成されてます
~~~

**前提条件**
- [Oracle Content and Experience インスタンスを作成する](../create_oce_instance)

<br>

# 1. ユーザーとグループの作成
OCE インスタンスを利用するユーザーは、**IDCS ユーザー** として登録します。ここでは、IDCS ユーザーに IDCS グループを利用し、OCE インスタンスのアプリケーションロール(CECEnterpriseUser)を割り当てる手順を説明します

![user01.jpeg](user01.jpeg)

IDCS グループは、組織内の役割にあわせて作成します。下記マニュアルを参考に作成します。

- Administrating Oracle Content and Experience

    - [Typical Organization Roles](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/typical-organization-roles.html)（英語原本）

    - [一般的な組織ロール](https://docs.oracle.com/cloud/help/ja/content-cloud/CECSA/GUID-0F493C82-1855-4A43-8A6B-E59A32B2EBC0.htm#CECSA-GUID-0F493C82-1855-4A43-8A6B-E59A32B2EBC0)（日本語翻訳版）



## 1.1 IDCS グループの作成

1. OCI コンソールを開き、左上のメニュー→ **「アイデンティティ」→「フェデレーション」** をクリックします

    ![user02.webp](user02.webp)

1. Oracle Identity Cloud Service Console の URL をクリックします

    ![user03.webp](user03.webp)

1. IDCS コンソールが開きます。左上のメニュー→ **「グループ」** をクリックします

    ![user04.webp](user04.webp)

1. **「+ 追加」** をクリックします

    ![user05.webp](user05.webp)

1. **「名前」** と **「説明」** を入力し、**「終了」** をクリックします（ここでは OCEusers を作成）

    ![user06.webp](user06.webp)

1. IDCS グループの作成が完了しました


## 1.2 IDCS グループを OCE インスタンスのアプリケーションロールに割り当て

IDCSグループにOCEインスタンスのアプリケーションロールを割り当てます。ここでは CECEnterpriseUser を割り当てます。

CECEnterpriseUser ロールで利用できる機能については、以下のマニュアルの **Enterprise User** をご確認ください

+ [Application Roles](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/application-roles.html)

+ [Task and Feature Comparison by Application Role](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/task-and-feature-comparison-application-role.html)

IDCSグループ単位でアプリケーションロールを割り当てることで、ユーザーの追加/削除/
割り当て権限の変更をより簡単にします

1. IDCS コンソールの左メニューの **「Oracle Cloud Services」** をクリックします

    ![user07.webp](user07.jpg)

1. 検索窓に **「CECS」** と入力し、検索を実行します。先ほど作成した OCE インスタンスをクリックします

    ![user08.webp](user08.webp)

1. **「アプリケーションロール」** タブをクリックします

    ![user09.webp](user09.webp)

1. CECEnterpriseUser のメニューをクリック→ **「割当て済グループ」** をクリックします

    ![user10.webp](user10.webp)

1. 前の手順で作成した IDCS グループ（ここでは OCEusers）を選択し、**「OK」** をクリックします

    ![user11.webp](user11.webp)

1. CECEnterpriseUser に IDCS グループが割り当てられたことを確認します


## 1.3 IDCS ユーザーの作成
新規IDCSユーザーを作成します。IDCSユーザー作成時に、IDCSグループの割り当ても同時に実施することで、新規IDCSユーザーは登録直後からOCEインスタンスの利用が可能になります

1. IDCS コンソールの左メニューの **「ユーザー」** をクリックします

    ![user12.webp](user12.webp)

1. **「+ 追加」** をクリックします

    ![user13.webp](user13.webp)

1. 追加するユーザーの **「名」「姓」「ユーザー名/電子メール」** を入力し、**「次」** をクリックします

    ![user14.webp](user14.webp)

1. 前の手順で CECEnterpriseUser アプリケーションロールに割り当てた IDCS グループ（ここでは OCEusers）を選択し、**「終了」** をクリックします

    ![user15.webp](user15.webp)

1. 新規 IDCS ユーザーの作成が完了します。作成したIDCSユーザーに対してメールが送信されます。仮パスワードを利用し、OCEインスタンスにサインインします。この時にパスワードの再設定します

<br>

以上でこのチュートリアルは終了です。
