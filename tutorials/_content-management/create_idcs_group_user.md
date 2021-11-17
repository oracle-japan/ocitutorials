---
title: "Oracle Content Management インスタンスの利用ユーザーを作成する"
excerpt: "この文書は Oracle Content Management (OCM) を利用するユーザーをIDCSに作成する方法をステップ・バイ・ステップで紹介するチュートリアルです"
order: "011"
layout: single
tags:
  - OCE
  - OCM
header:
  teaser: "/content-management/create_idcs_group_user/user10.webp"
  overlay_image: "/content-management/create_idcs_group_user/user10.webp"
  overlay_filter: rgba(80,80,80,0.7)
---

この文書は Oracle Content Management (OCM) を利用するユーザーをIDCSに追加する方法をステップ・バイ・ステップで紹介するチュートリアルです。

**【お知らせ】**  
この文書は、2021年11月時点での最新バージョン(21.10.2)を元に作成されてます  
チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。  
{: .notice--info}

**前提条件**
- [Oracle Content Management インスタンスを作成する](../create_oce_instance)

<br>

# 1. ユーザーとグループの作成

OCM インスタンスを利用するユーザーは、**IDCS ユーザー** として登録します。ここでは、IDCS ユーザーに IDCS グループを利用し、OCM インスタンスのアプリケーションロール(CECEnterpriseUser)を割り当てる手順を説明します

![user01.jpeg](user01.jpeg)

IDCS グループは、組織内の役割にあわせて作成します。下記マニュアルを参考に作成します。

- Administrating Oracle Content Management

    - [Typical Organization Roles](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/typical-organization-roles.html)（英語原本）

    - [一般的な組織ロール](https://docs.oracle.com/cloud/help/ja/content-cloud/CECSA/GUID-0F493C82-1855-4A43-8A6B-E59A32B2EBC0.htm#CECSA-GUID-0F493C82-1855-4A43-8A6B-E59A32B2EBC0)（日本語翻訳版）



## 1.1 IDCS グループの作成

IDCS グループを作成します。ここでは **OCEusers** グループを作成します

1. OCI コンソールを開き、左上のメニュー→ **「アイデンティティ」→「フェデレーション」** をクリックします

    ![user02.webp](user02.webp)

1. Oracle Identity Cloud Service Console の URL をクリックします

    ![user03.webp](user03.webp)

1. IDCS コンソールが開きます。左上のメニュー→ **「グループ」** をクリックします

    ![user04.webp](user04.webp)

1. **「+ 追加」** をクリックします

    ![user05.webp](user05.webp)

1. **「名前」** と **「説明」** を入力し、**「終了」** をクリックします（ここでは `OCEusers` を作成）

    ![user06.webp](user06.webp)

1. IDCS グループの作成が完了しました


## 1.2 IDCS グループを OCM インスタンスのアプリケーションロールに割り当て

IDCS グループに OCM インスタンスのアプリケーションロールを割り当てます。ここでは **CECEnterpriseUser** を割り当てます。

CECEnterpriseUser ロールで利用できる機能については、以下のマニュアルの **Enterprise User** をご確認ください

+ [Application Roles](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/application-roles.html)

+ [Task and Feature Comparison by Application Role](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/task-and-feature-comparison-application-role.html)

IDCS グループ単位でアプリケーションロールを割り当てることで、ユーザーの追加/削除/割り当て権限の変更を簡単にします

1. IDCS コンソールの左メニューの **「Oracle Cloud Services」** をクリックします

    ![user07.webp](user07.jpg)

1. 検索窓に **「CECS」** と入力し、検索を実行します。作成済の OCM インスタンスをクリックします

    ![user08.webp](user08.webp)

1. **「アプリケーションロール」** タブをクリックします

    ![user09.webp](user09.webp)

1. CECEnterpriseUser のメニューをクリック→ **「割当て済グループ」** をクリックします

    ![user10.webp](user10.webp)

1. 前の手順で作成した IDCS グループ（ここでは `OCEusers`）を選択し、**「OK」** をクリックします

    ![user11.webp](user11.webp)

1. CECEnterpriseUser に IDCS グループが割り当てられたことを確認します


## 1.3 IDCS ユーザーの作成

新規 IDCS ユーザーを作成します。IDCS ユーザー作成時に、IDCS グループの割り当ても同時に実施します。これにより、新規 IDCS ユーザーは、登録直後から OCM インスタンスの利用が可能になります

1. IDCS コンソールの左メニューの **「ユーザー」** をクリックします

    ![user12.webp](user12.webp)

1. **「+ 追加」** をクリックします

    ![user13.webp](user13.webp)

1. 追加するユーザーの **「名」「姓」「ユーザー名/電子メール」** を入力し、**「次」** をクリックします

    ![user14.webp](user14.webp)

1. 前の手順で CECEnterpriseUser アプリケーションロールに割り当てた IDCS グループ（ここでは `OCEusers`）を選択し、**「終了」** をクリックします

    ![user15.webp](user15.webp)

1. 新規 IDCS ユーザーの作成が完了します。作成したIDCSユーザーに対してメールが送信されます。仮パスワードを利用し、OCM インスタンスにサインインします。この時にパスワードの再設定します

<br>

### [説明]IDCSユーザー作成時の通知メールについて

OCM インスタンスを利用できる IDCS ユーザーを作成/追加すると、Oracle Cloud よりメールが **2通** 送信されます

1. **アカウント・アクティベーションのメール（英語）**

    - ユーザーのアクティベーション（パスワード登録）を実行します

    - ユーザーのアクティベーションには **有効期限** があります。メールを受信したら、有効期限内にアクティベーションを実行してください

1. **OCM インスタンスの URL などを含む welcome メール（英語）**

    - ユーザー名や OCM インスタンスへのURL、操作方法の紹介動画へのリンクなどが掲載されます

    - このメールは、OCMインスタンスの利用を終了するまで保存しておきましょう

      ![user19.jpg](user19.jpg)

<!--
## [TIPS] 通知メールを日本語で送信する方法

ユーザー作成時に通知されるメールは、通常は英語です。ここでは、その通知メールを **日本語** に変更する手順を紹介します

1. IDCSグループ（ここでは `OCEusers`）を作成する

1. IDCSユーザーを作成する。ただし、ここでは **IDCSグループを選択しない**

1. 作成したIDCSユーザーの「詳細」を開き、**優先言語（Preferred Language）** で **「日本語（Japanese）」** を設定し、保存する

    ![user16.png](user16.png)

1. 「グループ」メニューよりユーザーを追加する IDCS グループ（ここでは `OCEusers`）を開き、IDCS ユーザーを割り当てます

    ![user18.png](user18.png)

1. 日本語の通知メールがユーザーに送信されます

    ![user17.png](user17.png)
-->

<br>

以上でこのチュートリアルは終了です。
