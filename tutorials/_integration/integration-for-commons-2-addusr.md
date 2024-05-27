---
title: "OIC インスタンスにユーザーを追加する"
excerpt: "このハンズオンでは Oracle Integration(OIC) インスタンスを利用するユーザーの登録方法、およびロールの割り当て方法を ステップ・バイ・ステップで紹介します。"
layout: single
order: "001"
tags:
---
このハンズオンでは Oracle Integration(OIC) インスタンスを利用するユーザーの登録方法、およびロールの割り当て方法を ステップ・バイ・ステップで紹介します。

![](001.png)

前提条件
--------

1. [OIC インスタンスを作成する](../integration-for-commons)が実施済みであること
2. IDCS の Identity Domain Administrator ロールが付与されたユーザーであること

OIC インスタンスにユーザーを追加する
--------

OIC インスタンスを利用するユーザーは、IDCS ユーザーとして登録します。

ここでは、以下の手順で IDCS ユーザーを OIC インスタンスの事前定義済アプリケーションロールの ServiceUser に割り当てる手順を説明します。

1. IDCS の管理コンソールを開く
2. IDCS グループを作成する
3. IDCS グループを OIC インスタンスのアプリケーションロールに割り当てる
4. IDCS ユーザーを作成し、IDCS グループに割り当てる

{% capture notice %}
**OIC の事前定義済アプリケーションロールについて**  
OIC の事前定義済アプリケーションロール（以降、事前定義済ロールと省略）は、OIC のさまざまな機能へのアクセスを制御します。事前定義済ロールに対して、IDCS で作成したユーザーおよびグループを割り当てることができます。Oracle Integration の事前定義済ロールと、そのロールを割り当てられたユーザーが実行できる一般的なタスクについては、下記ドキュメントをご確認ください。

- Oracle Integration Roles and Privileges  
[https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34](https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34)

- Oracle Integrationロールおよび権限(日本語翻訳版)  
[https://docs.oracle.com/cd/E83857_01/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34](https://docs.oracle.com/cd/E83857_01/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34)
{% endcapture %}
<div class="notice--info">
  {{ notice | markdownify }}
</div>

### 1. IDCS の管理コンソールを開く

IDCS の管理コンソールを開きます。今回は、OCI の管理コンソールからアクセスします。

OCI コンソールにサインインします。

![](002.png)

OracleIdentityCloudService をクリックします。

![](003.png)

Oracle Identity Cloud Service Console の URL をクリックします。

![](004.png)

IDCS の管理コンソールが開きます。

![](005.png)

### 2. IDCS グループを作成する
IDCS 管理コンソールを利用し、IDCS グループを作成します

ナビゲーションメニューを開き、グループをクリックします

![](006.png)

追加をクリックします

![](007.png)

名前と説明を入力し、終了をクリックします。ここではは以下を入力します
名前: OICServiceUsers
説明: IDCS group for OIC service users

![](008.png)

グループが作成されることを確認します

![](009.png)

### 3. IDCS グループを OIC インスタンスのアプリケーションロールに割り当てる

作成したIDCSグループ(OICServiceUsers)を、OIC の事前定義済ロール ServiceUser に割り当てます

左ナビゲーションメニューの Oracle Cloud Services をクリックします

![](010.png)

アプリケーションの検索窓に INTEGRATION と入力し、検索を実行します
グループを割り当てる OIC インスタンスをクリックします

![](011.png)

アプリケーション・ロールタブをクリックします

![](012.png)

ServiceUser のメニューをクリックし、割り当て済グループをクリックします

![](013.png)

ロールに割り当てるグループを選択し、OKをクリックします。
ここでは、OICServiceUsers を選択します

![](014.png)

ServiceUser ロールに、グループが割り当てられたことを確認します

![](015.png)

### 4. IDCS ユーザーを作成し、IDCS グループに割り当てる

最後に、新規のIDCSユーザーを作成し、IDCS グループに割り当てます

左ナビゲーションメニューのユーザーをクリックします

![](016.png)

追加をクリックします

![](017.png)

名、姓、ユーザー名/電子メールを入力し、次をクリックします

![](018.png)

ユーザーに割り当てるグループを選択し、終了をクリックします。
ここでは OICServiceUsers グループを選択します

![](019.png)

新規のIDCSユーザーが作成されます

![](020.png)

グループタブをクリックし、OICServiceUsers グループが割当てられていることを確認します

![](021.png)

管理者は、新規作成ユーザーに対して OIC インスタンスのアクセス URL を連絡してください
以上でこのチュートリアルは終了です
