---
title: "Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-Compute編-"
excerpt: "OCI DevOpsでアプリケーション開発におけるCI/CDを学びます。"
layout: single
order: "011"
tags:
date: "2022-04-06"
lastmod: "2022-04-06"
---

OCI DevOps は、OCI 上に CI/CD 環境を構築するマネージドサービスです。このハンズオンでは、OCI上のComputeに対する CI/CD パイプラインの構築手順を記します。

前提条件
--------

- 環境
  - [OCI DevOps事前準備](/ocitutorials/cloud-native/devops-for-commons/)が完了していること

全体構成
--------

本ハンズオンでは、以下のような環境を構築し、ソースコードの変更がCompute上のサンプルアプリケーションに自動的に反映されることを確認します。  

![](0-0.png)

このうち、DevOpsインスタンスについては、[事前準備](/ocitutorials/cloud-native/devops-for-commons/)で構築済みです。  

事前準備
--------

まず、事前準備として、OCI DevOpsのGitレポジトリの認証で利用する認証トークンを取得します。  

右上にある「プロファイル」アイコンをクリックして、プロファイル名を選択します。

![](0-1.png)

左メニュー「認証トークン」を選択します。

![](0-2.png)

「トークンの作成」をボタンをクリックします。

![](0-3.png)

「説明」に「oci-devops-handson」と入力して、「トークンの生成」ボタンをクリックします。

![](0-4.png)

「コピー」をクリックして、「閉じる」ボタンをクリックします。  コピーした認証トークンは、後の手順で必要となるので、テキストエディタなどにペーストしておきます。

![](0-5.png)

以上で、認証トークンの作成は完了です。

全体の流れ
--------

1. Computeインスタンス環境の構築  
2. DevOps環境構築  
3. CIパイプラインとCDパイプラインの作成  
4. パイプラインの実行

## 1. Computeインスタンス環境の構築

ここでは、サンプルアプリケーションを動作させるComputeインスタンスを作成します。  

![](1-0.png)

### 1-1. インスタンスの作成

OCIコンソール画面のハンバーガメニューから`コンピュート`=>`インスタンス`をクリックします。  

![](1-1.png)

![](1-2.png)をクリックします。  

以下の項目を入力します。  

|-
項目|入力内容
名前|devops-instance

![](1-3.png)

`イメージとシェイプ`までスクロールした後に、`イメージの変更`をクリックします。  

![](1-4.png)

`Oracle Linux Cloud Developer`を選択し、下部の同意項目にチェックを入れ、`イメージの選択`をクリックします。  

![](1-5.png)

`ネットワーキング`までスクロールした後に、![](1-7.png)を選択します。  

`SSHキーの追加`までスクロールした後に、`秘密キーの保存`をクリックします。  
ここで、ダウンロードされた秘密キーはインスタンスにSSHログインする際に利用します。  
(このハンズオンでは、インスタンスに対してSSHログインすることはありません)

![](1-8.png)

最下部までスクロールし、![](1-10.png)をクリックします。  

`管理`タブの`Cloud-initスクリプトの貼付け`を選択し、`Cloud-initスクリプト`欄に以下の項目を入力します。  

```sh
#!/bin/bash
sudo setenforce permissive
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --reload
```

**cloud-initについて**  
[cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html)は、インスタンス構築時に自動的に初期設定を行う際に便利な機能です。  
今回は、サンプルアプリケーションが利用するポートを解放しておくために利用しています。  
{: .notice--info}

![](1-11.png)

![](1-9.png)をクリックします。  

インスタンスのステータスが`実行中`になるまで数分程度待機します。  

ステータスが`実行中`になったら、インスタンスのパブリックIPを確認しておきます。  
パブリックIPは`インスタンス情報`の`パブリックIPアドレス:`に記載されています。  
(横にある`コピー`をクリックするとコピーできます)  
このIPアドレスはサンプルアプリケーションの動作確認で利用するので、エディタなどに記録しておいてください。  

![](1-19.png)

これでインスタンスの作成は完了です。  

### 1-2. ネットワークの構成

ここでは、サンプルアプリケーションを外部からアクセスするためのVCNのセキュリティ・リストを設定します。  

**セキュリティリストについて**  
[cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html)は、インスタンス構築時に自動的に初期設定を行う際に便利な機能です。  
今回は、サンプルアプリケーションが利用するポートを解放しておくために利用しています。  
{: .notice--info}

OCIコンソール画面のハンバーガメニューから`ネットワーキング`=>`仮想クラウド・ネットワーク`をクリックします。  

![](1-12.png)

先ほどのインスタンス作成と同時に作成されたVCNをクリックします。  

![](1-13.png)

表示されたサブネットをクリックします。  

![](1-14.png)

表示されたセキュリティ・リストをクリックします。  

![](1-15.png)

![](1-16.png)をクリックし、以下の項目を入力します。  

|-
項目|入力内容
ソースCIDR|0.0.0.0/0
宛先ポート範囲|8080

![](1-17.png)

![](1-18.png)をクリックします。  

これで、ネットワークの構成は完了です。  

## 2. OCI DevOps環境の構築

ここでは、OCI DevOps環境を構築していきます。  

![](2-0.png)

### 2-1.サンプルアプリケーションと関連資材の取得

ここからは、Cloud Shell を利用します。

Cloud Shell は、ARM(aarch64)とX86_64のアーキテクチャを選択できます。こちらのチュートリアルは、X86_64をベースに構成されています。そのため、アーキテクチャのタイプを確認します。もし、ARM(aarch64)が選択されている場合は、X86_64に変更して、Cloud Shell を再起動します。

最初に、「アクション」-「アーキテクチャ」選択します。

![](01-02-03.png)

「現在のアーキテクチャ」が ARM(aarch64) の場合は、X86_64 を選択して、「確認して再起動」ボタンをクリックします。  
「現在のアーキテクチャ」が X86_64 の場合は、そのまま、「取消」を選択してください。

![](01-02-04.png)

Cloud Shell 再起動後、「アクション」-「アーキテクチャ」選択します。そして、X86_64 であることを確認して、「取消」を選択します。

![](01-02-05.png)


今回のハンズオンで利用するサンプルアプリケーションと関連資材を取得します。  

以下のコマンドを実行します。  

```sh
wget https://orasejapan.objectstorage.ap-tokyo-1.oci.customer-oci.com/n/orasejapan/b/oci-devops-handson/o/compute%2Foci-devops-compute.zip
```

解凍します。

```sh
unzip compute%2Foci-devops-compute.zip
```

これでサンプルアプリケーションと関連資材の取得は完了です。  

### 2-2.ポリシーの設定

ここでは、[事前準備](/ocitutorials/cloud-native/devops-for-commons/)に追加で必要なポリシーの設定を行います。  

#### 2-2-1 OCI DevOpsで利用する動的グループ

本ハンズオンで利用するために追加で必要となる動的グループを作成します。  
今回設定する動的グループは以下になります。  

動的グループ|ルール|説明|
-|-
OCI_DevOps_Dynamic_Group_Compute|instance.compartment.id = 'コンパートメントOCID'|コンパートメント内の全てのインスタンスを含めた動的グループ

**本ハンズオンでの動的グループについて**  
今回は、簡易的にハンズオンを実施するために、コンパートメント内の全てのリソースやインスタンスを動的グループとして含める設定を行なっています。  
本来は、各サービスのタイプを指定して動的グループを作成することになります。
{: .notice--warning}

#### 2-2-2 OCI DevOpsで利用するポリシー

本ハンズオンで利用するために追加で必要となるポリシーを作成します。  
ポリシーは以下となります。

ポリシー|説明
-|-
Allow dynamic-group OCI_DevOps_Dynamic_Group_Compute to use instance-agent-command-execution-family in compartment id コンパートメントOCID|対象Computeに対するコマンド実行を許可するポリシー
Allow dynamic-group OCI_DevOps_Dynamic_Group_Compute to manage instance-agent-command-family in compartment id コンパートメントOCID|対象Computeに対するコマンド実行を許可するポリシー
Allow dynamic-group OCI_DevOps_Dynamic_Group_Compute to read instance-family in compartment id コンパートメントOCID|Computeの参照を許可するポリシー

#### 2-2-3 ポリシーの設定

ここでは、[事前準備](/ocitutorials/cloud-native/devops-for-commons/)で設定したポリシーに今回のハンズオンで必要となるポリシーを作成していきます。  

Cloud Shellを起動し、以下のコマンドを実行します。  

```sh
chmod +x devops-template-for-compute/prepare/prepare.sh
```

スクリプトを実行します。  

```sh
./devops-template-for-compute/prepare/prepare.sh
```

***コマンド結果***
```sh
ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
{
  "data": {
    "compartment-id": "ocid1.tenancy.oc1..aaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx55asqdzge45nq",
    "defined-tags": {
      "Oracle-Tags": {
        "CreatedBy": "oracleidentitycloudservice/xxxxxx.xxxxxx@gmail.com",
        "CreatedOn": "2022-01-31T01:35:54.465Z"
      }
    },
    "description": "OCI_DevOps_Dynamic_Group_Compute",
    "freeform-tags": {},
    "id": "ocid1.dynamicgroup.oc1..aaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx55asqdzge45nq",
    "inactive-status": null,
    "lifecycle-state": "ACTIVE",
    "matching-rule": "any {instance.compartment.id = 'ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}",
    "name": "OCI_DevOps_Dynamic_Group_Compute",
    "time-created": "2021-11-18T07:41:50.880000+00:00"
  },
  "etag": "66c9058cf8f1145ce9047130c4a266d816e9dfbf"
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
      "Allow dynamic-group OCI_DevOps_Dynamic_Group_Compute to manage instance-agent-command-family in compartment id ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "Allow dynamic-group OCI_DevOps_Dynamic_Group_Compute to use instance-agent-command-execution-family in compartment id ocid1.tenancy.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    ],
    "time-created": "2021-11-18T07:41:50.880000+00:00",
    "version-date": null
  },
  "etag": "31c9339700c6132a1b6205df041ad52fcf66be51"
}
```

これで、ポリシーの設定は完了です。

### 2-3.DevOpsの設定

ここでは、デプロイ先である「環境」の登録、DevOps上のGitレポジトリ、ビルド成果物/デプロイメント構成ファイルを格納するためのアーティファクト・レジストリの設定を行います。  

#### 2-3-1 環境の登録

ハンバーガメニューから、`開発者メニュー`からDevOpsカテゴリの`プロジェクト`をクリックします。  

![](2-1.png)

`oci-devops-handson`プロジェクトをクリックします。  

![](2-2.png)

左側にある`DevOpsプロジェクト・リソース`から`環境`を選択します。  

![](2-3.png)

![](2-4.png)をクリックします。  

以下の項目を入力します。  

|-
項目|入力内容
環境タイプ|インスタンスグループ
名前|Compute

![](2-5.png)

![](2-6.png)をクリックします。  

![](2-7.png)をクリックします。  

以下の項目を入力します。  

|-
リージョン|お使いのリージョンを選択
コンパートメント|お使いのコンパートメント(通常はルートコンパートメント)を選択
インスタンス|先ほど構築した`devops-instance`にチェック

![](2-8.png) 

![](2-7.png)をクリックします。  

![](2-4.png)をクリックします。  

これで環境の作成は完了です。  

#### 2-3-2 Gitレポジトリの作成

ここでは、Gitレポジトリの作成を行います。  

OCI DevOpsの「コード・リポジトリ」では、独自のプライベート・コード・リポジトリをOCI DevOps上に作成します。  

ハンバーガメニューから、`開発者メニュー`からDevOpsカテゴリの`プロジェクト`をクリックします。  

![](2-1.png)

`oci-devops-handson`プロジェクトをクリックします。  

![](2-2.png)

左側にある`DevOpsプロジェクト・リソース`から`コード・レポジトリ`を選択します。  

![](2-13.png)

「リポジトリの作成」ボタンをクリックします。    

![](2-10.png)

「リポジトリ名」に「oci-devops-handson」と入力して、「リポジトリの作成」ボタンをクリックします。

![](2-11.png)

![](2-12.png)

次に、プッシュ先を取得するために「クローン」ボタンをクリックします。

![](2-14.png)

「HTTPSでクローニングします 読取り専用」にある「コピー」をクリックして、「閉じる」ボタンをクリックします。コピーした内容は、テキストエディタにペーストしておきます。

![](2-15.png)

Cloud Shellを利用して、「oci-devops-handson」リポジトリをプルします。  
リポジトリのURLは、先ほどテキストエディタにペーストしたURLを指定します。
「xxxxxxxxxx」箇所はご自身の環境に合わせて置き換えてください。

以上で、レポジトリの作成は完了です。  

#### 2-3-3 サンプルアプリケーションのPush

ここでは、サンプルアプリケーションを先ほど作成したGitレポジトリにPushします。

「oci-devops-handson」リポジトリを利用する上で、ユーザ名とパスワードが必要となります。

ユーザ名は、`<テナンシ名>/<ユーザ名>` となります。

＜ユーザ名＞を確認します。ユーザ名は右上にある「プロファイル」アイコンをクリックして、プロファイル名を選択します。

![](2-16.png)

「ユーザーの詳細画面」の赤枠箇所をコピーして、テキストエディタにペーストしておきます。

![](2-17.png)

次に、＜テナンシ名＞を確認します。

右上にある「プロファイル」アイコンをクリックして、「テナンシ」を選択します。

![](2-18.png)

「テナンシ詳細」の「名前」赤枠箇所をコピーして、テキストエディタにペーストしておきます。  
また、後続手順で必要となる「オブジェクト・ストレージ・ネームスペース」の赤枠箇所もコピーして、テキストエディタにペーストしておきます。

![](2-19.png)

以下、テキストエディタにペーストした内容に当てはめて利用します。

ユーザ名：`<テナンシ名>/<ユーザ名>`

パスワードは、事前準備で作成した `認証トークン` を利用します。

```sh
git clone https://devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com/namespaces/xxxxxxxxxx/projects/oci-devops-handson/repositories/oci-devops-handson
```
ユーザ名は、先ほど確認した内容、パスワードは事前準備で作成した認証トークンを入力します。  
※パスワードは入力時に表示されません。
```sh
Username for 'https://devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com': xxxxxxxxx/oracleidentitycloudservice/xxxxxx.xxxxxxxx@oracle.com
Password for 'https://xxxxxxxxxx/oracleidentitycloudservice/xxxxxx.xxxxxxxx@oracle.com@devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com':
```
```sh
remote: Counting objects: 2, done
remote: Finding sources: 100% (2/2)
remote: Getting sizes: 100% (1/1)
remote: Total 2 (delta 0), reused 2 (delta 0)
Unpacking objects: 100% (2/2), done.
```

「oci-devops-handson」ディレクトリがあることを確認します。

```sh
ls
```
```sh
oci-devops-handson  oci-devops-compute  oci-devops-compute.zip
```

ダウンロードしたサンプルコードを「oci-devops-handson」ディレクトリにコピーします。

```sh
cp -R oci-devops-compute/* ./oci-devops-handson
```

コミットしてからプッシュします。

```sh
cd ./oci-devops-handson
```
```sh
git add -A .
```
「＜email＞」任意のメールアドレス、「＜user_name＞」任意のユーザ名を入力してください。
```sh
git config --global user.email "<email>"
```
```sh
git config --global user.name "<user_name>"
```
コミットします。
```sh
git commit -m "first commit"
```
**コマンド結果**
```sh
[main e964068] first commit
 6 files changed, 111 insertions(+)
 create mode 100644 Dockerfile
 create mode 100644 README.md
 create mode 100644 build_spec.yaml
 create mode 100644 content.html
 create mode 100644 deploy.yaml
 create mode 100755 prepare/prepare.sh
```
mainブランチを指定します。
```sh
git branch -M main
```
リポジトリにプッシュします。
```sh
git push -u origin main
```
ユーザ名は、先ほど確認した内容、パスワードは事前準備で作成した認証トークンを入力します。  
※パスワードは入力時に表示されません。

**コマンド結果**
```sh
Username for 'https://devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com': xxxxxxxxx/oracleidentitycloudservice/xxxxxx.xxxxxxxx@oracle.com
Password for 'https://xxxxxxxxxx/oracleidentitycloudservice/xxxxxx.xxxxxxxx@oracle.com@devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com':
```
```sh
Counting objects: 10, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (8/8), done.
Writing objects: 100% (9/9), 1.93 KiB | 0 bytes/s, done.
Total 9 (delta 0), reused 0 (delta 0)
To https://devops.scmservice.xx-xxxxxx-1.oci.oraclecloud.com/namespaces/xxxxxxxxxx/projects/oci-devops-handson/repositories/oci-devops-handson
   b52f2cd..d16bcff  main -> main
Branch main set up to track remote branch main from origin.
```

ホームディレクトリに戻っておきます。  

```sh
cd ~
```

以上で、サンプルアプリケーションのPushは完了です。  

#### 2-3-4 アーティファクト・レジストリの作成とデプロイメント構成ファイルの登録

OCI DevOpsからComputeにデプロイする際に利用するデプロイメント構成ファイルをアーティファクト・レジストリに登録します。  

この登録した構成ファイルを利用して、OCI DevOpsから自動でComputeにデプロイすることが可能になります。  

アーティファクト・レジストリを作成します。
左上のハンバーガーメニューをクリックして、「開発者サービス」-「アーティファクト・レジストリ」を選択します。

![](2-20.png)

「リポジトリの作成」ボタンをクリックします。

![](2-21.png)

「名前」に「artifact-repository」と入力、「不変アーティファクト」のチェックを外します。

![](2-22.png)

「作成」ボタンをクリックします。

![](2-23.png)

「アーティファクトのアップロード」ボタンをクリックします。

![](2-27.png)

以下の項目を入力します。  

|-
項目|入力内容
アーティファクト・パス|deploy_spec.yaml
バージョン|1.0
Upload method|`Cloud Shell`を選択

入力後、「Lanunch Cloud Shell」ボタンをクリックして、「コピー」をクリックします。
コピーしたコマンドを起動したCloud Shell上にペーストします。  

![](2-28.png)

「./＜file-name＞」を「./oci-devops-compute/deploy_spec.yaml」に書き換えて、Enterキーを押します。

```sh
oci artifacts generic artifact upload-by-path \
>   --repository-id ocid1.artifactrepository.oc1.xx-xxxxxx-1.0.amaaaaaassl65iqaluitbpvjd5inibwke4axtb7l4so6jgvsywlh5m2ohgca \
>   --artifact-path deploy_spec.yaml \
>   --artifact-version 1.0 \
>   --content-body ./oci-devops-compute/deploy_spec.yaml #file-nameから変更します。
{
  "data": {
    "artifact-path": "deploy_spec.yaml",
    "compartment-id": "ocid1.compartment.oc1..xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "defined-tags": {},
    "display-name": "deploy_spec.yaml:1",
    "freeform-tags": {},
    "id": "ocid1.genericartifact.oc1.xx-xxxxxx-1.0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "lifecycle-state": "AVAILABLE",
    "repository-id": "ocid1.artifactrepository.oc1.xx-xxxxxx-1.0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "sha256": "faa5ffec716cf718b5a1a3a5b4ced0e12c2c59151d3ff6fcab0cf0d324e3ca07",
    "size-in-bytes": 574,
    "time-created": "2021-11-22T05:23:24.150000+00:00",
    "version": "1.0"
  }
}
```

「閉じる」ボタンをクリックします。  

これで、アーティファクト・レジストリの作成とデプロイメント構成ファイルの登録は完了です。

#### 2-3-5 アーティファクト・レジストリの登録

OCI DevOpsでセットアップしたアOCIRとアーティファクト・レジストリを利用できるように設定を行います。

ハンバーガメニューから、`開発者メニュー`からDevOpsカテゴリの`プロジェクト`をクリックします。  
![](2-1.png)

`oci-devops-handson`プロジェクトを選択します。

![](2-2.png)

左側にある`DevOpsプロジェクト・リソース`から`アーティファクト`を選択します。  

![](2-25.png)

「アーティファクトの追加」ボタンをクリックします。

![](2-26.png)

以下の項目を入力します。  

|-
項目|入力内容
名前|deployment_spec
タイプ|インスタンス・グループ・デプロイメント構成
アーティファクト・ソース|アーティファクト・レジストリ・レポジトリ

`アーティファクト・レジストリ・リポジトリの選択`で`選択`をクリックし、`artifact-repository`をチェック、![](2-30.png)をクリックします。  

![](2-29.png)

`アーティファクトの選択`で`選択`をクリックし、`deploy_spec.yaml:1.0`にチェック、![](2-30.png)をクリックします。  

![](2-31.png)

最後に![](2-33.png)をクリックします。  

![](2-32.png)

再度、「アーティファクトの追加」ボタンをクリックします。

![](2-26.png)

|-
項目|入力内容
名前|devops-demo-app-jar
タイプ|汎用アーティファクト
アーティファクト・ソース|アーティファクト・レジストリ・レポジトリ

`アーティファクト・レジストリ・リポジトリの選択`で`選択`をクリックし、`artifact-repository`をチェック、![](2-30.png)をクリックします。  

![](2-29.png)

`アーティファクトの場所`で`カスタムの場所の設定`を選択します。 

以下の項目を入力します。 

|-
項目|入力内容
アーティファクト・パス|devops-demo-app-1.0.jar
バージョン|1.0

最後に![](2-34.png)

最後に![](2-33.png)をクリックします。  

これで、アーティファクト・レジストリの登録は完了です。  

## 3. CIパイプラインとCDパイプラインの作成

ここからは、CI/CDパイプラインを構築していきます。  

![](2-77.png)

### 3-1 CIパイプラインの構築

まずは、CIパイプラインを構築します。  

OCI DevOpsで利用する仮想マシン上で、コード・リポジトリからソースをダウンロードして、Mavenビルド、アーティファクト・レポジトリにJarファイルを格納という一連の流れをビルド・パイプラインとして作成します。  
最初にコンテナイメージビルドを行う「マネージド・ビルド」ステージを作成します。

「ビルド・パイプラインの作成」ボタンをクリックします。

ハンバーガメニューから、`開発者メニュー`からDevOpsカテゴリの`プロジェクト`をクリックします。  

![](2-1.png)

`oci-devops-handson`プロジェクトをクリックします。  

![](2-2.png)

左側にある`DevOpsプロジェクト・リソース`から`ビルドパイプライン`を選択します。  

![](2-35.png)

「ビルド・パイプラインの作成」ボタンをクリックします。

![](2-36.png)

「名前」に「build-pipeline」と入力します。

![](2-37.png)

「作成」ボタンをクリックします。

![](2-38.png)

「build-pipeline」をクリックします。

![](2-39.png)

「ステージの追加」をクリックします。

![](2-40.png)

「マネージドビルド」を選択します。

![](2-41.png)

「次」ボタンをクリックします。

![](2-42.png)

以下の設定を行って、「選択」ボタンをクリックします。  
「build_spec.yaml」は、ビルド・パイプラインが処理を行う仮想マシン内で実行するコマンドタスクを定義してあるファイルです。  
この定義ファイルにアプリケーションテストやコンテナイメージビルドなどビルド時に実施したいタスクを定義します。

ここでは、定義済みの「build_spec.yaml」ファイルを登録します。

* ステージ名: mvn-build
* ビルド指定ファイル・パス オプション: build_spec.yaml

![](2-43.png)

「プライマリ・コード・リポジトリの選択」画⾯で、以下の設定を行います。

* 接続タイプ: OCIコード・リポジトリ
* 「oci-devops-handson」
* ソース名の作成: main

![](2-44.png)

「保存」ボタンをクリックします。

![](2-45.png)

「ステージの追加」画⾯に戻ってから、「追加」ボタンをクリックします。

![](2-46.png)

次に、ビルドしたJarファイルをアーティファクト・レポジトリに格納する「アーティファクトの配信」ステージを作成します。
プラス部分をクリックして、「ステージの追加」を選択します。

![](2-47.png)

「アーティファクトの配信」を選択します。

![](2-48.png)

「次」ボタンをクリックします。

![](2-42.png)

「ステージ名」に「jarfile-ship」と入力して、「アーティファクトの選択」ボタンをクリックします。

![](2-49.png)

「devops-demo-app-jar」にチェックを入れます。

![](2-50.png)

「追加」ボタンをクリックします。

![](2-51.png)

「ビルド構成/結果アーティファクト名」に「handson_jar」と入力します。

![](2-52.png)

「追加」ボタンをクリックします。

![](2-46.png)

これで、CIパイプラインの構築は完了です。

### 3-2 CDパイプラインの構築

ここからは、CDパイプラインを構築します。  

ここからはComputeインスタンスに対して、アーティファクト・レポジトリに格納したJarファイルをデプロイするデプロイメントパイプラインを構築していきます。  

ハンバーガメニューから、`開発者メニュー`からDevOpsカテゴリの`プロジェクト`をクリックします。  

![](2-1.png)

`oci-devops-handson`プロジェクトをクリックします。  

![](2-2.png)

左側にある`DevOpsプロジェクト・リソース`から`デプロイメント・パイプライン`を選択します。  

![](2-53.png)

![](2-54.png)をクリックします。  

以下の項目を入力し、![](2-54.png)をクリックします。  

|-
項目|入力内容
パイプライン名|deploy-pipeline
パイプライン・タイプ|`デプロイメント・パイプラインの作成`を選択

`ステージの追加`をクリックします。  

![](2-56.png)

`コンピュート・インスタンス・グループを使用して増分的にデプロイ`を選択します。  

![](2-57.png)

![](2-58.png)をクリックします。  

以下の項目を入力します。  

|-
ステージ名|compute-deploy
環境|`Compute`を選択

![](2-59.png)をクリックします。  

`deployment_spec`を選択します。  

![](2-60.png)

![](2-61.png)をクリックします。  

その下部の![](2-59.png)をクリックします。  

`devops-demo-app-jar`を選択します。 

![](2-62.png)

![](2-61.png)をクリックします。  

以下のように表示されます。

![](2-63.png)

下にスクロールし、`インスタンス・ロールアウト`に`100`を入力します。  

![](2-64.png)

![](2-65.png)をクリックします。  

これで、CDパイプラインの構築は完了です。  

### 3-3 CIパイプラインとCDパイプラインの接続

ここからは、CIパイプラインからCDパイプラインをキックする設定を追加し、CI/CDパイプラインを接続していきます。  

ハンバーガメニューから、`開発者メニュー`からDevOpsカテゴリの`プロジェクト`をクリックします。  

![](2-1.png)

`oci-devops-handson`プロジェクトをクリックします。  

![](2-2.png)

左側にある`DevOpsプロジェクト・リソース`から`ビルドパイプライン`を選択します。  

![](2-35.png)

`build-pipeline`をクリックします。  

![](2-66.png)

`jarfile-ship`ステージの下部にあるプラスボタンをクリックします。  

![](2-67.png)

`ステージの追加`をクリックします。  

![](2-68.png)

`デプロイメントのトリガー`を選択し、![](2-70.png)をクリックします。  

![](2-69.png)

以下の項目を入力します。  

|-
項目|入力内容
ステージ名|deploy_call

![](2-71.png)をクリックします。  

`deploy-pipeline`を選択します。  

![](2-72.png)

![](2-73.png)をクリックします。  

![](2-75.png)

![](2-65.png)をクリックします。  

これで、CIパイプラインとCDパイプラインの接続は完了です。　　

### 3-4 トリガーの作成

ここでは、OCI DevOps上のGitレポジトリへの変更をトリガーにしてCIパイプラインを起動させるための設定を行います。  

ハンバーガメニューから、`開発者メニュー`からDevOpsカテゴリの`プロジェクト`をクリックします。  

![](2-1.png)

`oci-devops-handson`プロジェクトをクリックします。  

![](2-2.png)

左側にある`DevOpsプロジェクト・リソース`から`トリガー`を選択します。  

![](2-76.png)

「トリガーの作成」ボタンをクリックします。

![](1-111.png)

以下の設定をして、「選択」ボタンをクリックします。

* 名前: push-trigger
* ソース接続:OCIコード・リポジトリ

![](1-112.png)

「oci-devops-handson」にチェックを入れます。

![](1-113.png)

「保存」ボタンをクリックします。

![](1-098.png)

「アクションの追加」をボタンをクリックします。

![](1-114.png)

「選択」ボタンをクリックします。

![](1-115.png)

「build-pipeline」にチェックを入れます。

![](1-116.png)

「保存」ボタンをクリックします。

![](1-098.png)

「イベント オプション」で「プッシュ」にチェックを入れます。

![](1-117.png)

「保存」ボタンをクリックします。

![](1-098.png)

「トリガーの作成」画⾯に戻ってから、「作成」ボタンをクリックします。

![](1-016.png)

登録できたことを確認します。

![](1-118.png)

以上で、トリガーの作成は完了です。

## 4.パイプラインの実行

前の手順までで、アプリケーションコードに対する変更がコード・リポジトリの更新（git push）をトリガーとし自動的にComputeへデプロイするCI/CD パイプラインの構築ができたので、動作確認をします。　　

まずは、アプリケーションコードを変更します。　　
今回は、アプリケーションで利用するヘッダー画像の変更を行います。  

[Cloud Shellを起動](/ocitutorials/cloud-native/oke-for-commons/#3cli実行環境cloud-shellの準備)します。  

`oci-devops-handson`ディレクトリに移動します。  

```sh
cd oci-devops-handson
```

以下のコマンドを実行し、イメージファイルを更新します。

```sh
cp src/main/resources/static/images/header_new.jpg src/main/resources/static/images/header.jpg 
```

リポジトリへCommitします。　　

```sh
git add .
```

```sh
git commit -m "トップページのイメージを変更"
```

```sh
git push
```

これで、自動的にパイプラインが実行されます。  

パイプラインの起動状況を確認します。  

ここからはComputeインスタンスに対して、アーティファクト・レポジトリに格納したJarファイルをデプロイするデプロイメントパイプラインを構築していきます。  

ハンバーガメニューから、`開発者メニュー`からDevOpsカテゴリの`プロジェクト`をクリックします。  

![](2-1.png)

次に、「DevOpsプロジェクト・リソース」にある「ビルド履歴」をクリックします。 

![](4-1.png)

ビルド履歴の一覧に先ほどのgit pushでトリガされた履歴が表示されます。  

![](4-2.jpg)

次に、「DevOpsプロジェクト・リソース」にある「デプロイメント」をクリックします。

![](4-3.png)

以下のように、ステータスが「成功」になるまで、待機します。(しばらく時間がかかります)

![](4-4.jpg)

デプロイメントが完了したら、ComputeのパブリックIPにブラウザからアクセスしましょう。  
今回のサンプルアプリケーションは`8080`ポートで起動させているので、例えば以下のようなURLになります。  

```sh
http://146.123.xxx.xxx:8080
```

以下のようにアプリケーションが表示されます。  

![](4-5.jpg)

このように、コードレポジトリの変更をトリガーに自動的にアプリケーションのビルドを行い、Computeに対してデプロイするパイプラインを作成できました。

以上で、このハンズオンは終了です。  
お疲れ様でした！

## 5.【オプション】ビルド構成ファイルとデプロイメント構成ファイルの解説

ここでは、ハンズオンの中で利用したビルド構成ファイル(`build_spec.yaml`)とデプロイメント構成ファイル(`deploy_spec.yaml`)の解説を行います。  
### 5-1 ビルド構成ファイル(`build_spec.yaml`)の解説

今回のハンズオンでは、サンプルアプリケーションの中に予めビルド構成ファイル(`build_spec.yaml`)を用意していました。　　

このファイルは、OCI DevOpsでビルドステップを定義する際に必ず必要になるファイルです。  

ハンズオンの中では、[3-1 CIパイプラインの構築](#3-1-ciパイプラインの構築)内の手順で利用しました。

ファイルは以下のようになっています。  

```yaml
version: 0.1
component: build                    
timeoutInSeconds: 10000             
runAs: root                         
shell: bash                                  
   
steps:
  - type: Command
    name: "Maven Build"
    command: |
      mvn package
    onFailure:
      - type: Command
        command: |
          echo "Failured Maven Build"
        timeoutInSeconds: 10000
        runAs: root

outputArtifacts:
  - name: handson_jar
    type: BINARY
    location: ${OCI_PRIMARY_SOURCE_DIR}/target/devops-demo-app-1.0.jar
```

今回はビルドステップ内で行うタスクは1つだけになっており、

```yaml
steps:
  - type: Command
    name: "Maven Build"
    command: |
      mvn package
    onFailure:
      - type: Command
        command: |
          echo "Failured Maven Build"
        timeoutInSeconds: 10000
        runAs: root
```

の部分で定義しています。

このステップでは`mvn package`コマンドを叩いて、ビルドを行っています。  

このビルドステップで出力された成果物(今回は`target/devops-demo-app-1.0.jar`に出力されます)を


```yaml
outputArtifacts:
  - name: handson_jar
    type: BINARY
    location: ${OCI_PRIMARY_SOURCE_DIR}/target/devops-demo-app-1.0.jar
```

の部分で`handson_jar`という名前のバイナリファイル(`type: BINARY`)として出力しています。  

この`handson_jar`という成果物を[3-1 CIパイプラインの構築](#3-1-ciパイプラインの構築)の手順内の`ビルド構成/結果アーティファクト名`で指定し、アーティファクト・レポジトリにアップロードしました。　　

以上で、ビルド構成ファイル(`build_spec.yaml`)の解説は終了です。  

**ビルド構成ファイルについて**  
ビルド構成ファイルの詳細については、[こちらのドキュメント](https://docs.oracle.com/ja-jp/iaas/Content/devops/using/build_specs.htm)をご確認ください。 
{: .notice--info}

### 5-2 デプロイメント構成ファイル(`deploy_spec.yaml`)の解説

今回のハンズオンでは、サンプルアプリケーションの中に予めデプロイメント構成ファイル(`deploy_spec.yaml`)を用意していました。  

このファイルは、コンピュートインスタンスにデプロイする場合のみ必要になるファイルです。　　

ハンズオンの中では、[2-3-4 アーティファクト・レジストリの作成とデプロイメント構成ファイルの登録](#2-3-4-アーティファクトレジストリの作成とデプロイメント構成ファイルの登録)でアーティファクト・レポジトリにアップロードし、[3-1 CDパイプラインの構築](#3-2-cdパイプラインの構築)内の手順で利用しました。  

ファイルは以下のようになっています。  

```yaml
version: 1.0
component: deployment
files:  
  - source: /
    destination: /tmp/
steps:
  - stepType: Command
    name: Start Application
    command:  nohup java -jar /tmp/devops-demo-app-1.0.jar &
    timeoutInSeconds: 600
```

今回は、デプロイメントステップは一つのみとなっており、

```yaml
steps:
  - stepType: Command
    name: Start Application
    command:  nohup java -jar /tmp/devops-demo-app-1.0.jar &
    timeoutInSeconds: 600
```

の部分で定義しています。  

このデプロイメントステップでは、`nohup java -jar /tmp/devops-demo-app-1.0.jar &`コマンドでアプリケーション(Jarファイル)をバックグラウンド実行しています。  

また、

```yaml
files:  
  - source: /
    destination: /tmp/
```

に着目すると、`source: /`は指定したアーティファクト・レポジトリに格納された成果物(`/`配下)を全てダウンロードしており、
`destination: /tmp/`によって、デプロイ対象のコンピュートインスタンスの`tmp`ディレクトリに配置しています。  

以上で、デプロイメント構成ファイル(`deploy_spec.yaml`)の解説は終了です。  

**デプロイメント構成ファイルについて**  
デプロイメント構成ファイルの詳細については、[こちらのドキュメント](https://docs.oracle.com/ja-jp/iaas/Content/devops/using/deployment_specs.htm)をご確認ください。 
{: .notice--info}
