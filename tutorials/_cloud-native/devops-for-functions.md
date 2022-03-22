---
title: "DevOps を使用して Oracle Functions に CI/CD をしてみよう"
excerpt: "OCI DevOps を使用して Oracle Functions に対する CI/CD パイプラインを構築します。"
order: "011"
tags: "devops functions"
layout: single
date: "2022-03-16"
lastmod: "2022-03-16"
---

OCI DevOps は、OCI 上に CI/CD 環境を構築するマネージドサービスです。このハンズオンでは、Oracle Functions に対する CI/CD パイプラインの構築手順を記します。

**Oracle Functions について**  
Oracle Functions は、Oracle Cloud Infrastructure(OCI)で提供される、Function as a Service です。詳細は、[https://www.oracle.com/jp/cloud-native/functions/](https://www.oracle.com/jp/cloud-native/functions/) をご確認ください。
{: .notice--info}

# 前提条件

- クラウド環境
  - Oracle Cloud のアカウント（Free Trial）を取得済みであること
- [Oracle Functions ハンズオン - 事前準備](/ocitutorials/cloud-native/functions-for-beginners#事前準備)が完了していること
- [Oracle Cloud Infrastructure(OCI) DevOps ことはじめ - 動的グループ/ポリシーセットアップ](/ocitutorials/cloud-native/devops-for-commons/#4動的グループポリシー-セットアップ)が完了していること

# 全体構成

本ハンズオンでは、以下のような環境を構築し、ソースコードの変更が Oracle Functions に自動的に反映されることを確認します。

![image01](image01.png)

# 手順

## OCIR の作成

Oracle Functions のコンテナイメージの保存先である OCIR(Oracle Cloud Infrastructure Registry)を作成します。OCI Console 左上のハンバーガーメニューから、**開発者サービス** > **コンテナとアーティファクト** > **コンテナ・レジストリ**と選択します。

![image04](image04.png)

**リポジトリの作成**を押します。

![image05](image05.png)

以下のように入力し、リポジトリを作成します。

- リポジトリ名: devops-functions-handson/fn-hello
- アクセス: プライベート

![image06](image06.png)

## ハンズオンに使用する資材のセットアップ

Cloud Shell を開きます。OCI Console 右上の **Cloud Shell** を押します。

![image47](image47.png)

ハンズオンに使用する資材をダウンロードします。

```bash
cd ~; \
wget -O devops-template-for-oracle-functions.zip https://objectstorage.ap-tokyo-1.oraclecloud.com/n/orasejapan/b/oci-devops-handson/o/functions%2Fdevops-template-for-oracle-functions.zip
```

zip を解答します。

```bash
unzip devops-template-for-oracle-functions.zip 
```

ダウンロードした資材には以下が含まれています。

```bash
.
├── build_spec.yaml [OCI DevOps のビルド・パイプライン制御ファイル]
└── fn-hello [Oracle Functions にデプロイするアプリケーションコード]
    ├── func.yaml
    ├── pom.xml
    └── src
        ├── main
        │   └── java
        │       └── com
        │           └── example
        │               └── fn
        │                   └── HelloFunction.java
        └── test
            └── java
                └── com
                    └── example
                        └── fn
                            └── HelloFunctionTest.java
```

## アプリケーションの動作確認

アプリケーションを手動で Oracle Functions にデプロイして、動作確認をします。まずは、アプリケーションを作成します。

OCI Console 左上のハンバーガーメニューから、**開発者サービス** > **ファンクション** > **アプリケーション**と選択します。

![image29](image29.png)

**アプリケーションの作成**を押します。

![image30](image30.png)

以下のように入力し、アプリケーションを作成します。

- 名前: oci-devops-handson-app
- VCN: [Oracle Functions ハンズオン - 事前準備](/ocitutorials/cloud-native/functions-for-beginners#事前準備)で作成済みの VCN
- サブネット: [Oracle Functions ハンズオン - 事前準備](/ocitutorials/cloud-native/functions-for-beginners#事前準備)で作成済みのサブネット

アプリケーションに Function をデプロイします。

```bash
cd ~/devops-template-for-oracle-functions/fn-hello; \
fn deploy --app oci-devops-handson-app
```

デプロイが完了したら、実行します。

```bash
fn invoke oci-devops-handson-app fn-hello
```

以下のように結果が返却されることを確認します。

```bash
Hello from Function: 1.0
```

## DevOps 環境構築

ここでは、Oracle Functions に対して、CI/CD を実現するためのパイプラインを構築します。

### ポリシーの作成

OCI DevOps から Oracle Functions 関連のリソースを扱うために必要なポリシーを作成します。[Oracle Cloud Infrastructure(OCI) DevOps ことはじめ - 動的グループ/ポリシーセットアップ](/ocitutorials/cloud-native/devops-for-commons/#4動的グループポリシー-セットアップ)で作成した動的グループに対して、以下のポリシーを付与します。

```txt
Allow dynamic-group OCI_DevOps_Dynamice_Group to manage functions-family in compartment id <compartment-id>
```

### プロジェクトの作成

OCI Console 左上のハンバーガーメニューから、**開発者サービス** > **DevOps** > **プロジェクト**と選択します。

![image02](image02.png)

**DevOps プロジェクトの作成**を押します。

![image03](image03.png)

以下のように入力し、DevOps プロジェクトを作成します。

- プロジェクト名: oci-devops-functions-handson
- トピック: oci-devops-handson([OCI DevOps ことはじめ](/ocitutorials/cloud-native/devops-for-commons/#2oci-notifications-セットアップ)で作成したトピック)

ロギングを有効化するために、**ログの有効化**を押します。

![image45](image45.png)

ログの有効化フラグをオンにします。

![image46](image46.png)

以下のように入力し、ログを有効化します。（指定のない項目はデフォルトのままとしてください）

- ログ・グループ
  - 名前: DevOps_Handson_Log_Group
- ログ名: oci_devops_functions_handson_all

### コード・リポジトリ の作成

アプリケーションコードのバージョン管理を行うためのリポジトリを作成します。OCI Console 左上のハンバーガーメニューから、**開発者サービス** > **DevOps** > **プロジェクト**と選択します。

![image02](image02.png)

[プロジェクトの作成](#プロジェクトの作成)で作成したプロジェクト（**oci-devops-functions-handson**）を選択します。

![image10](image10.png)

**コード・リポジトリ**を選択します。

![image11](image11.png)

**リポジトリの作成**を押します。

![image12](image12.png)

以下のように入力し、コード・リポジトリを作成します。

- リポジトリ名: oci-devops-functions-handson

![image13](image13.png)

作成したコード・リポジトリ（oci-devops-functions-handson）の詳細画面で**クローン**を押します。

![image14](image14.png)

クローンするための URL をコピーします。

![image15](image15.png)

作成した空リポジトリをクローンします。（リポジトリの URL はコピーした URL に置き換えてください）

```bash
cd ~; \
git clone <repository-url>
```

次に、[ハンズオンに使用する資材の取得](#ハンズオンに使用する資材の取得)でダウンロードしたハンズオン資材をコピーします。

```bash
cd ~; \
cp -r devops-template-for-oracle-functions/* oci-devops-functions-handson
```

コード・リポジトリ（oci-devops-functions-handson）にコピーした内容をプッシュします。

```bash
cd ~/oci-devops-functions-handson; \
git add .; \
git commit -m "Initial commit"; \
git push -u origin main
```

**Git の資格情報を求められた場合**

以下のような文字列が出力された場合は、[DevOps ことはじめ - oci-devops-handson リポジトリのユーザ名とパスワードの取得](/ocitutorials/cloud-native/devops-for-commons/#oci-devops-handsonリポジトリのユーザ名とパスワードの取得)を参考に資格情報を入力してください。

```bash
Username for 'https://devops.scmservice.ap-tokyo-1.oci.oraclecloud.com'
```

作成したコード・リポジトリ（oci-devops-functions-handson）の詳細画面で以下のようになっていれば、コード・リポジトリのセットアップは完了です。

![image16](image16.png)

### ビルド・パイプラインの作成

作成した DevOps プロジェクト（oci-devops-functions-handson）の詳細画面で**ビルド・パイプライン**を選択します。

![image17](image17.png)

**ビルド・パイプラインの作成**を押します。

![image18](image18.png)

以下のように入力し、ビルド・パイプラインを作成します。

- 名前: build_pipeline

![image19](image19.png)

ステータスがアクティブとなった作成したビルド・パイプラインをクリックします。

![image20](image20.png)

**ステージの追加**ボタンを押します。

![image21](image21.png)

ステージ・タイプの選択で、**マネージド・ビルド**を選択し、**次**を押します。

![image22](image22.png)

構成で、以下のように入力しステージを追加します。（指定のない項目は、デフォルトのまま進めてください）

- ステージ名: build_stage
- ビルド仕様ファイル・パス: build_spec.yaml
- プライマリ・コード・リポジトリ
  - 接続タイプ: OCI コード・リポジトリ
  - oci-devops-functions-handson を選択
  - ブランチの選択: main
  - ソース名の作成: main

![image23](image23.png)

次に、**+**アイコンを押し、**ステージの追加**を押します。

![image24](image24.png)

ステージ・タイプの選択で、**アーティファクトの配信**を選択し、**次**を押します。

![image25](image25.png)

構成で以下のように入力、ステージを追加します。（指定のない項目は、デフォルトのまま進めてください）

- ステージ名: deliver_artifact
- アーティファクトの作成
  - 名前: fn-hello-image
  - タイプ: コンテナ・イメージ・リポジトリ
  - コンテナレジストリの完全修飾パス: \<region\>.ocir.io/\<object-storage-namespace\>/devops-functions-handson/fn-hello:${tag}
  - パラメーターの置き換え: はい、プレースホルダーを置き換えます
- ビルド構成/結果アーティファクト名: fn-hello-image

![image26](image26.png)

### 環境の作成

ビルド・パイプラインで生成されたアーティファクトの配布先（=環境）を作成します。
まずは、作成した DevOps プロジェクト（oci-devops-functions-handson）の詳細画面で**環境**を選択します。

![image27](image27.png)

**環境の作成**を押します。

![image31](image31.png)

基本情報で以下のように入力します。

- 環境タイプ: ファンクション
- 名前: handson_env

![image32](image32.png)

環境詳細で以下のように入力し、環境を作成します。（指定のない項目は、デフォルトのまま進めてください）

- アプリケーション: oci-devops-handson-app
- ファンクション: fn-hello

### デプロイメント・パイプラインの作成

作成した DevOps プロジェクト（oci-devops-functions-handson）の詳細画面で**デプロイメント・パイプライン**を選択します。

![image33](image33.png)

**パイプラインの作成**を押します。

![image34](image34.png)

以下のように入力し、パイプラインを作成します。

- パイプライン名: deployment_pipeline

![image35](image35.png)

**ステージの追加**を押します。

![image21](image21.png)

タイプの選択で、**ビルトイン機能の更新戦略を使用します**選択します。

![image36](image36.png)

構成で以下のように入力し、ステージを作成します。

- ステージ名: deployment_stage
- 環境: handson_env
- アーティファクトの選択: fn-hello-image

![image37](image37.png)

### ビルド・パイプラインとデプロイメント・パイプラインの連携設定

ビルド・パイプラインとデプロイメント・パイプラインの連携設定を行います。作成した DevOps プロジェクト（oci-devops-functions-handson）の詳細画面で**ビルド・パイプライン**を選択します。

![image17](image17.png)

作成済みのビルド・パイプライン（**build_pipeline**）を選択します。**deliver_artifact** に対して、**ステージの追加**を選択します。

![image38](image38.png)

ステージ・タイプの選択で**デプロイメントのトリガー**を選択します。

![image39](image39.png)

構成で以下のように入力し、ステージを追加します。

- ステージ名: connect_deployment_pipeline
- デプロイメント・パイプラインの選択: deployment_pipeline

![image40](image40.png)

### トリガーの作成

ビルド・パイプラインを実行するためのトリガーを作成します。作成した DevOps プロジェクト（oci-devops-functions-handson）の詳細画面で**トリガー**を選択します。

![image41](image41.png)

**トリガーの作成**を押します。

![image42](image42.png)

以下のように入力し、トリガーを作成します。（指定のない項目は、デフォルトのまま進めてください）

- 名前: build_pipeline_trigger
- ソース接続: OCI コード・リポジトリ
- コード・リポジトリの選択: oci-devops-functions-handson
- アクションの追加
  - ビルド・パイプラインの選択: build_pipeline
  - イベント: push

![image43](image43.png)

## パイプラインの実行

前の手順までで、アプリケーションコードに対する変更がコード・リポジトリの更新（git push）をトリガーとし自動的に Oracle Functions へ反映される CI/CD パイプラインの構築ができたので、実際にソースコードを修正しコード・リポジトリにその変更を反映したいと思います。

まずは、アプリケーションコードを変更します。

```bash
cd ~/oci-devops-functions-handson/; \
vim fn-hello/src/main/java/com/example/fn/HelloFunction.java
```

以下のように変更します。

```java
package com.example.fn;

public class HelloFunction {

    public String handleRequest() {
        System.out.println("Inside Java Hello World function");
        return "Hello from Function: 2.0"; // 1.0 から 2.0 へ変更
    }

}
```

続いて、テストコードも同様に変更します。

```bash
vim fn-hello/src/test/java/com/example/fn/HelloFunctionTest.java
```

以下のように変更します。

```java
package com.example.fn;

import com.fnproject.fn.testing.*;
import org.junit.*;

import static org.junit.Assert.*;

public class HelloFunctionTest {

    @Rule
    public final FnTestingRule testing = FnTestingRule.createDefault();

    @Test
    public void shouldReturnGreeting() {
        testing.givenEvent().enqueue();
        testing.thenRun(HelloFunction.class, "handleRequest");

        FnResult result = testing.getOnlyResult();
        assertEquals("Hello from Function: 2.0", result.getBodyAsString()); // 1.0 から 2.0 へ変更
    }

}
```

変更分をコード・リポジトリに反映します。

```bash
git add fn-hello/*; \
git commit -m "Bump version from 1.0 to 2.0"; \
git push -u origin main
```

DevOps 上のビルド履歴から、ビルド・パイプラインが実行されている事が確認できます。

![image44](image44.png)

## デプロイの確認

デプロイメント・パイプラインの成功が確認できた後に、Oracle Functions に変更が反映されているかどうかを確認してみましょう。

```bash
fn invoke oci-devops-handson-app fn-hello
```

変更内容が取り込まれていることが確認できました！

```bash
Hello from Function: 2.0
```
