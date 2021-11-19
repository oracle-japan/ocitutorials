---
title: "OCI DevOpsことはじめ"
excerpt: "OCI DevOpsを利用するために必要となる設定とデプロイ先とするOracle Container Engine for Kubernetes(OKE)の構築を行います。"
layout: single
order: "010"
tags:
---

OCI DevOpsは、OCI上にCI/CD環境を構築するマネージドサービスです。この共通手順では、OCI DevOpsを利用する上で必要となる設定、デプロイ先とするKubernetesクラスタの構築手順を記します。

前提条件
--------
- クラウド環境
    * Oracle Cloudのアカウント（Free Trial）を取得済みであること

全体構成
--------

最初に、以下の図にある環境を構築します。構築後、ソースコードを変更して、git pushをトリガーにCI/CDパイプラインの実行、OKEクラスタ上にサンプルアプリケーションがデプロイされるまでの工程が、自動で行われることを確認します。

![](1-012.png)

事前準備の流れ
---------------------------------
* 1.OKE セットアップ
* 2.OCI Notification セットアップ
* 3.認証トークン セットアップ
* 4.動的グループ/ポリシー セットアップ

1.OKEセットアップ
---------------------------------

### 1-1 OCIダッシュボードからOKEクラスタの構築

3ノード、1クラスタとして、OKEクラスタを構築します。  左上のハンバーガーメニューを展開して、「開発者サービス」から「Kubernetesクラスタ(OKE)」を選択します。

![](1-001.png)

「クラスタの作成」ボタンをクリックします。

![](1-002.png)

「クイック作成」が選択されていることを確認して、「ワークフローの起動」ボタンをクリックします。

![](1-003.png)

以下を設定します。

「Kubernetesワーカー・ノード」:「プライベート・ワーカー」
「シェイプ」：「VM Standard.E3.Flex」
「OCPU数の選択」:「1」
「メモリー量（GB）」：「16」

![](1-004.png)

画面左下の「次」ボタンをクリックします。

![](1-005.png)

画面左下の「クラスタ作成」ボタンをクリックします。

![](1-006.png)

画面左下の「閉じる」ボタンをクリックします。

![](1-007.png)

黄色の「作成中」から緑の「アクティブ」になることを確認します。「アクティブ」であればクラスタ作成は完了です。

![](1-008.png)

### 1-2 Cloud Shellを利用してクラスタを操作

Cloud Shellを利用して、作成したKubernetesクラスタに接続します。

「クラスタへのアクセス」ボタンをクリックします。

![](1-009.png)

「Cloud Shellの起動」ボタン、「コピー」リンクテキスト、「閉じる」ボタンの順にクリックします。

![](1-010.png)

Cloud Shell起動後、「コピー」した内容をペーストして、Enterキーを押します。

![](1-011.png)

以下コマンドを実行して、3ノードの「STATUS」が「Ready」になっていることを確認します。

```sh
kubectl get nodes
```
***コマンド結果***
```sh
NAME          STATUS   ROLES   AGE   VERSION
10.0.10.108   Ready    node    29m   v1.20.11
10.0.10.140   Ready    node    29m   v1.20.11
10.0.10.245   Ready    node    27m   v1.20.11
```

以上でOKEクラスタの構築は完了です。

2.OCI Notification セットアップ
---------------------------------

### 2-1 トピックとサブスクリプションの設定

OCI DevOpsでは、OCI Notificationサービスの「トピック」と「サブスクリプション」の設定が必要となります。この設定をしておくことで、登録したメールアドレスにOCI DevOpsから通知を受け取ることができます。

**OCI Notificationについて**  
OCI Notificationは、安全、高信頼性、低レイテンシおよび永続的にメッセージを配信するためのサービスです。  
本ハンズオンでは、電子メールアドレスに対して配信を行いますが、他にもSlack/SMS/PagerDutyなどに通知を行うことができます。  また詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Notification/Concepts/notificationoverview.htm)のページをご確認ください。
{: .notice--info}

### トピックの作成

左上のハンバーガーメニューをクリックして、「開発者サービス」-「通知」を選択します。

![](1-013.png)

「トピックの作成」ボタンをクリックします。

![](1-014.png)

「名前」に「oci-devops-handson」と入力します。

![](1-015.png)

「作成」ボタンをクリックします。

![](1-016.png)

「アクティブ」になることを確認します。

![](1-017.png)

以上でトピックの作成は完了です。

### サブスクリプションの作成

左メニュー「サブスクリプション」を選択します。

![](1-018.png)

「サブスクリプションの作成」ボタンをクリックします。

![](1-019.png)

「電子メール」にご自身のメールアドレスを入力します。

![](1-020.png)

「作成」ボタンをクリックします。

![](1-016.png)

設定したメールアドレスに、以下の内容のメールが届きます。「Confirm subscription」をクリックして、サブスクリプションを有効にします。

![](1-021.png)

以下の画面が表示されれば完了です。

![](1-022.png)

以上で、サブスクリプションの作成は完了です。

3.認証トークン セットアップ
---------------------------------

### 3-1 認証トークンの作成

右上にある「プロファイル」アイコンをクリックして、プロファイル名を選択します。

![](1-023.png)

左メニュー「認証トークン」を選択します。

![](1-024.png)

「トークンの作成」をボタンをクリックします。

![](1-025.png)

「説明」に「oci-devops-handson」と入力して、「トークンの生成」ボタンをクリックします。

![](1-026.png)

「コピー」をクリックして、「閉じる」ボタンをクリックします。  コピーした認証トークンは、後の手順で必要となるので、テキストエディタなどにペーストしておきます。

![](1-027.png)

以上で、認証トークンの作成は完了です。

4.動的グループ/ポリシー セットアップ
---------------------------------

### 4-1 動的グループとポリシーの作成

#### OCI DevOpsで利用する動的グループ

OCI DevOpsを利用する上で、必要となる動的グループを作成します。OCI DevOpsで設定する動的グループは以下となります。

動的グループ|ルール|説明|
-|-
OCI_DevOps_Dynamic_Group|All {resource.type = 'devopsrepository', resource.compartment.id = 'コンパートメントOCID'|OCI DevOpsのコード・リポジトリを利用するために必要な動的グループ
OCI_DevOps_Dynamic_Group|All {resource.type = 'devopsbuildpipeline', resource.compartment.id = 'コンパートメントOCID'|ビルド・パイプラインを利用するために必要な動的グループ
OCI_DevOps_Dynamic_Group|All {resource.type = 'devopsdeploypipeline', resource.compartment.id = 'コンパートメントOCID'|デプロイメント・パイプラインを利用するために必要な動的グループ
OCI_DevOps_Dynamic_Group|instance.compartment.id = 'コンパートメントOCID',resource.compartment.id = 'コンパートメントOCID'|コンパートメント内の全てのリソースやインスタンスを含めた動的グループ

**動的グループについて**  
Oracle Cloud Infrastrctureには動的グループという考え方があります。
これを利用すると、ユーザではなく、OCI上のリソースやインスタンスを主体とした操作を実現できます。  
動的グループの詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Identity/Tasks/managingdynamicgroups.htm)のページをご確認ください。
{: .notice--info}

#### OCI DevOpsで利用するポリシー

OCI DevOpsを利用する上で、必要となるポリシーを作成します。OCI DevOpsで設定するポリシーは以下となります。

ポリシー|説明
-|-
Allow dynamic-group OCI_DevOps_Dynamic_Group to manage devops-family in compartment id 'コンパートメントOCID'|OCI DevOpsの各機能を利用するために必要なポリシー
Allow dynamic-group OCI_DevOps_Dynamic_Group to manage all-artifacts in compartment id 'コンパートメントOCID'|OCI DevOpsがOCIRやアーティファクト・レジストリを管理するために必要なポリシー
Allow dynamic-group OCI_DevOps_Dynamic_Group to manage secret-family in compartment id 'コンパートメントOCID'|OCI DevOpsがソース・コードをダウンロードするためにパーソナルアクセストークンにアクセスするための管理対象ビルド・ステージで必要なポリシー
Allow dynamic-group OCI_DevOps_Dynamic_Group to manage instance-agent-command-execution-family in compartment id 'コンパートメントOCID'|デプロイメント・パイプラインがインスタンス・グループ・デプロイメントのインスタンス・グループにアクセスするために必要なポリシー
Allow dynamic-group OCI_DevOps_Dynamic_Group to use ons-topics in compartment id 'コンパートメントOCID'|OCI DevOpsがOCI Notificationサービスを利用するために必要なポリシー

**ポリシーについて**  
Oracle Cloud Infrastrctureにはポリシーという考え方があります。 
ポリシーを利用すると、ユーザや動的グループがどのリソースやサービスでどのような操作を実行可能にするかを制御することができます。  
ポリシーの詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Identity/Concepts/policygetstarted.htm#Getting_Started_with_Policies)のページをご確認ください。
{: .notice--info}

#### 動的グループとポリシーの設定

スクリプトを利用して、動的グループとポリシーを設定します。資材をクローンします。

上部メニューの「Cloud　Shell」アイコンをクリックして、Cloud Shellを起動します。

![](1-028.png)

起動画面

![](1-029.png)

起動後、以下コマンドを実行します。

```sh
git clone https://github.com/oracle-japan/oracle-developer-days-2021-ocidevops-hol.git
```

「oracle-developer-days-2021-ocidevops-hol」というディレクトリがあることを確認します。

```sh
ls
```
***コマンド結果***
```sh
oracle-developer-days-2021-ocidevops-hol
```

スクリプトファイルに実行権限を付与します。

```sh
chmod +x ./oracle-developer-days-2021-ocidevops-hol/prepare/prepare.sh
```

スクリプトを実行します。

```sh
sh ./oracle-developer-days-2021-ocidevops-hol/prepare/prepare.sh
```
***コマンド結果***
```sh
ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
{
  "data": {
    "compartment-id": "ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "defined-tags": {
      "Oracle-Tags": {
        "CreatedBy": "oracleidentitycloudservice/xxxxxxxxxxx@xxxxx",
        "CreatedOn": "2021-11-18T07:41:49.264Z"
      }
    },
    "description": "OCI_DevOps_Dynamic_Group",
    "freeform-tags": {},
    "id": "ocid1.dynamicgroup.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "inactive-status": null,
    "lifecycle-state": "ACTIVE",
    "matching-rule": "Any {All {resource.type = 'devopsrepository', resource.compartment.id = 'ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},All {resource.type = 'devopsbuildpipeline', resource.compartment.id = 'ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},All {resource.type = 'devopsdeploypipeline', resource.compartment.id = 'ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},instance.compartment.id = 'ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',resource.compartment.id = 'ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}",
    "name": "OCI_DevOps_Dynamic_Group",
    "time-created": "2021-11-18T07:41:49.350000+00:00"
  },
  "etag": "5f604e055e624ed3f993aafb2052b775bd37da0e"
}
{
  "data": {
    "compartment-id": "ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "defined-tags": {
      "Oracle-Tags": {
        "CreatedBy": "oracleidentitycloudservice/xxxxxxxxxxx@xxxxx",
        "CreatedOn": "2021-11-18T07:41:50.746Z"
      }
    },
    "description": "OCI_DevOps_Policy",
    "freeform-tags": {},
    "id": "ocid1.policy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "inactive-status": null,
    "lifecycle-state": "ACTIVE",
    "name": "OCI_DevOps_Policy",
    "statements": [
      "Allow dynamic-group OCI_DevOps_Dynamic_Group to manage devops-family in compartment id ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "Allow dynamic-group OCI_DevOps_Dynamic_Group to manage all-artifacts in compartment id ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "Allow dynamic-group OCI_DevOps_Dynamic_Group to manage secret-family in compartment id ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "Allow dynamic-group OCI_DevOps_Dynamic_Group to manage instance-agent-command-execution-family in compartment id ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "Allow dynamic-group OCI_DevOps_Dynamic_Group to use ons-topics in compartment id ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    ],
    "time-created": "2021-11-18T07:41:50.880000+00:00",
    "version-date": null
  },
  "etag": "31c9339700c6132a1b6205df041ad52fcf66be51"
}
```

設定した内容は、OCIコンソールからも確認できます。

* 動的グループ：ハンバーガーメニュー「アイデンティティとセキュリティ」-「動的グループ」-「OCI_DevOps_Dynamic_Group」

![](1-030.png)

* 動的グループ：ハンバーガーメニュー「アイデンティティとセキュリティ」-「ポリシー」-「OCI_DevOps_Policy」

![](1-031.png)

OCI DevOps 環境構築
---------------------------------
* 1.プロジェクト
* 2.環境
* 3.コードリポジトリ

1.プロジェクト
---------------------------------

### 1-1 プロジェクトの作成

OCI DevOpsは、プロジェクト単位で管理する仕組みです。最初にプロジェクトを作成します。

左上にあるハンバーガーメニューから「開発者サービス」-「プロジェクト」を選択します。

![](1-032.png)

「DevOpsプロジェクトの作成」ボタンをクリックします。

![](1-033.png)

「プロジェクト名」に「oci-devops-handson」と入力して、「トピックの選択」ボタンをクリックします。

![](1-034.png)

「トピック」が「oci-devops-handson」であることを確認します。

![](1-035.png)

「トピックの選択」ボタンをクリックします。

![](1-036.png)

「DevOpsプロジェクトの作成」ボタンをクリックします。

![](1-037.png)

ロギングを有効化するために、「ログの有効化」ボタンをクリックします。

![](1-038.png)

赤枠の箇所をクリックして有効化します。

![](1-039.png)

そのままの状態で、「ログの有効化」ボタンをクリックします。

![](1-040.png)

![](1-041.png)

パンくずリストから「oci-devops-handson」をクリックします。

![](1-042.png)

以上で、プロジェクトの作成は完了です。

3.コードリポジトリ
---------------------------------

### 3-1.コードリポジトリの作成

OCI DevOpsの「コードリポジトリ」では、独自のプライベート・コードリポジトリをOCI DevOps上に作成します。

「リポジトリの作成」ボタンをクリックします。

![](1-049.png)

「リポジトリ名」に「oci-devops-handson」と入力して、「リポジトリの作成」ボタンをクリックします。

![](1-050.png)

![](1-051.png)

以上で、コードリポジトリの作成は完了です。

### 3-2.クローンした資材をプッシュ

#### クローン先情報を取得

GitHubからクローンした資材を「oci-devops-handson」リポジトリにプッシュします。

プッシュ先を取得するために「クローン」ボタンをクリックします。

![](1-052.png)

「コピー」をクリックして、「閉じる」ボタンをクリックします。コピーした内容は、テキストエディタにペーストしておきます。

![](1-053.png)

#### 「oci-devops-handson」リポジトリのユーザ名とパスワードの取得

「oci-devops-handson」リポジトリを利用する上で、ユーザ名とパスワードが必要となります。

ユーザ名は、`<オブジェクト・ストレージ・ネームスペース>/<ユーザ名>` となります。

ユーザ名を確認します。ユーザ名は右上にある「プロファイル」アイコンをクリックして、プロファイル名を選択します。

![](1-054.png)

赤枠の箇所をコピーして、テキストエディタにペーストしておきます。

![](1-055.png)

次に、オブジェクト・ストレージ・ネームスペースを確認します。

ユーザ名を確認します。ユーザ名は右上にある「プロファイル」アイコンをクリックして、「テナンシ」を選択します。

![](1-056.png)

赤枠の箇所をコピーして、テキストエディタにペーストしておきます。

![](1-057.png)

以下、テキストエディタにペーストした内容に当てはめて利用します。

ユーザ名：`<オブジェクト・ストレージ・ネームスペース>/<ユーザ名>`

パスワードは、事前準備で作成した `認証トークン` を利用します。

#### 「oci-devops-handson」リポジトリへ資材のプッシュ

Cloud Shellを利用して、「oci-devops-handson」リポジトリをプルします。リポジトリのURLは、先ほどテキストエディタにペーストしたURLを指定します。

```sh
git clone https://devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com/namespaces/xxxxxxxxxx/projects/oci-devops-handson/repositories/oci-devops-handson
```
ユーザ名は、先ほど確認した内容、パスワードは事前準備で作成した認証トークンを入力します。※パスワードは入力時に表示されません。
```sh
Username for 'https://devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com': xxxxxxxxx/oracleidentitycloudservice/xxxxxx.xxxxxxxx@oracle.com
Password for 'https://xxxxxxxxxx/oracleidentitycloudservice/xxxxxx.xxxxxxxx@oracle.com@devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com':
```
```sh
remote: Counting objects: 2, done
remote: Finding sources: 100% (2/2)
remote: Getting sizes: 100% (1/1)
Unpacking objects: 100% (2/2), done.
remote: Total 2 (delta 0), reused 2 (delta 0)
```

以下、「oci-devops-handson」ディレクトリがあることを確認します。

```sh
ls
```
```sh
oci-devops-handson
```

GitHubからクローンした資材を「oci-devops-handson」ディレクトリにコピーします。

```sh
cp -R oracle-developer-days-2021-ocidevops-hol/* ./oci-devops-handson
```

コミットしてからプッシュします。

```sh
cd ./oci-devops-handson
```
```sh
git add .
```
```sh
git commit -m "first commit"
```
***コマンド結果***
```
[main d1e2234] first commit
 21 files changed, 37379 insertions(+)
 create mode 100644 Dockerfile
 create mode 100644 README.md
 create mode 100644 build_spec.yaml
 create mode 100644 deploy.yaml
 create mode 100644 package-lock.json
 create mode 100644 package.json
 create mode 100644 prepare/prepare.sh
 create mode 100644 public/favicon.ico
 create mode 100644 public/index.html
 create mode 100644 public/logo192.png
 create mode 100644 public/logo512.png
 create mode 100644 public/manifest.json
 create mode 100644 public/robots.txt
 create mode 100644 src/App.css
 create mode 100644 src/App.js
 create mode 100644 src/App.test.js
 create mode 100644 src/Twitter-Developer Day.png
 create mode 100644 src/index.css
 create mode 100644 src/index.js
 create mode 100644 src/reportWebVitals.js
 create mode 100644 src/setupTests.js
```
```sh
git branch -M main
```
```sh
git push -u origin main
```
ユーザ名は、先ほど確認した内容、パスワードは事前準備で作成した認証トークンを入力します。※パスワードは入力時に表示されません。
```sh
Username for 'https://devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com': xxxxxxxxx/oracleidentitycloudservice/xxxxxx.xxxxxxxx@oracle.com
Password for 'https://xxxxxxxxxx/oracleidentitycloudservice/xxxxxx.xxxxxxxx@oracle.com@devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com':
```
```sh
Counting objects: 27, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (25/25), done.
Writing objects: 100% (26/26), 986.52 KiB | 0 bytes/s, done.
Total 26 (delta 0), reused 0 (delta 0)
To https://devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com/namespaces/xxxxxxxxxx/projects/oci-devops-handson/repositories/oci-devops-handson
   ebb27d4..d1e2234  main -> main
Branch main set up to track remote branch main from origin.
```

OCIコンソールからも確認してみます。

![](1-058.png)

以上で、コードリポジトリの作成は完了です。