---
title: "OCI API GatewayとOCI Functionsを利用したデータベースアクセス"
excerpt: "OCI API GatewayはOCI上で提供されるマネージドのAPI管理サービスです。OCI Functionsは、Oracle Cloud Infrastructure(OCI)上で提供されるマネージドFaaS(Function as a Service)サービスです。このハンズオンでは、OCI Functionsからpython-oracledbドライバを利用してOracle Autonomous Transaction Processingに接続し、データをCRUD(Create、Read、Update、Delete)する方法について説明します。そして、OCI API GatewayからOCI Functionsにルーティングする方法について説明します。"
order: "080"
tags: [OCI, API Gateway, OCI Functions, Autonomous Database, Oracle Autonomous Transaction Processing, Python]
---

このセッションでは、OCI Functionsからpython-oracledbドライバを利用してOracle Autonomous Transaction Processing(ATP)に接続し、データをCRUD(Create、Read、Update、Delete)する方法について説明します。
そして、OCI API GatewayからOCI Functionsにルーティングする方法について説明します。

このハンズオンが完了すると、以下のようなコンテンンツが出来上がります。

![](summary.jpg)
*図：OCI API Gateway → OCI Functions → ATP のデータフロー*

条件
----------------------

- クラウド環境
  - 有効なOracle Cloudアカウントがあること

- 事前環境構築
  - [OCI Functionsハンズオン](/ocitutorials/cloud-native/functions-for-beginners/)が完了していること
  - [Oracle Cloud Infrasturcture API Gateway + OCI Functionsハンズオン](/ocitutorials/cloud-native/functions-apigateway-for-beginners/)が完了していること
  - ローカル端末にSQL Developerがインストールされていること
    - ダウンロードは[こちら](https://www.oracle.com/tools/downloads/sqldev-downloads.html)から

1.事前準備
-------------------
### 1-1.ATPのプロビジョニング

OCIコンソールのハンバーガーメニューから[Oracle Database]で、[Autonomous Database]をクリックします。

![](atp.png)

Autonomous Databaseの作成画面で、コンパートメント名をクリックして、コンパートメントの選択リストを表示します。使用するコンパートメントを選択して、「フィルタの適用」をクリックします。

![](create-atp-00.png)

使用するコンパートメントを確認して、「Autonomous Databaseの作成」をクリックします。

![](create-atp-01.png)

以下項目を入力して、「作成」をクリックします。


+ 表示名：表示名を入力。今回は、`Workshop-ATP`。
+ データベース名：今回は、`WORKSHOPATP`。
+ コンパートメント：使用するコンパートメントを選択。
+ ワークロード・タイプの選択：トランザクション処理
+ データベース・バージョンの選択：`19c`
+ ECPU数：`2`
+ ストレージ：`1024`
+ ストレージ単位サイズ：`GB`
+ ストレージの自動スケーリング：チェック・オフのまま。
+ パスワード：パスワードを入力。
+ パスワードの確認：再度パスワードを入力。
+ ネットワーク・アクセスの選択：すべての場所からのセキュア・アクセス


![](create-atp-02.png)

![](create-atp-03.png)

数分後に、ステータスが「利用可能」に変わります。 

Autonomous Databaseの詳細の画面で、「データベースのOCID」をコピーし、ローカルPCのメモ帳などにメモします。次に、「データベース接続」をクリックします。

![](download-wallet-01.png)

TNS名をローカルPCのメモ帳などにメモして、「ウォレットのダウンロード」をクリックします。

![](download-wallet-02.png)

（セキュリティルールに準拠する任意の）ウォレットのパスワードを入力して、「ダウンロード」をクリックします。後でローカルのOracle SQL Developerで接続するときに使用します。

![](download-wallet-03.png)

これで、ATPのプロビジョニングは完了です。

### 1-2.ユーザーテーブルおよびサンプル・データの準備

Autonomous Databaseの詳細の画面で、「データベース・アクション」→「SQL」をクリックします。

![](open-action.png)


以下のコマンドを入力して、「スクリプトの実行」(またはF5)をクリックして、新しいユーザーを作成します。

```sql
CREATE USER usersvc IDENTIFIED BY [PASSWORD];
```

今回は、
```sql
CREATE USER usersvc IDENTIFIED BY PasswOrd__8080;
```

とします。

ユーザー`usersvc`に対して、必要な権限を付与します。
```sql
GRANT "CONNECT" TO usersvc;
GRANT "RESOURCE" TO usersvc;
GRANT UNLIMITED TABLESPACE TO usersvc;
```
![](create-user.png)

ローカルのOracle SQL Developerを開いて、ダウンロードしたWalletファイルを使用して、作成したユーザー`usersvc`で接続します。

![](conn-atp.png)


検証用のテーブル`users`を作成します。

```sql
CREATE TABLE users ( 
"ID"  VARCHAR2(32 BYTE) DEFAULT ON NULL sys_guid(), 
"FIRST_NAME"  VARCHAR2(50 BYTE) COLLATE "USING_NLS_COMP"
            NOT NULL ENABLE, 
"LAST_NAME"  VARCHAR2(50 BYTE) COLLATE "USING_NLS_COMP"
            NOT NULL ENABLE, 
"USERNAME"  VARCHAR2(50 BYTE) COLLATE "USING_NLS_COMP"
            NOT NULL ENABLE, 
"CREATED_ON"  TIMESTAMP(6) DEFAULT ON NULL current_timestamp, 
CONSTRAINT "USER_PK" PRIMARY KEY ( "ID" )
);
```

サンプルデータを登録します。

```sql
INSERT INTO users VALUES (
    '8C561D58E856DD25E0532010000AF462',
    'todd',
    'sharp',
    'tsharp',
    current_timestamp
);

INSERT INTO users VALUES (
    '8C561D58E858DD25E0532010000AF462',
    'jeff',
    'smith',
    'thatjeff',
    current_timestamp
);

COMMIT;
```

これで、ユーザーテーブルおよびサンプル・データの準備は完了です。

### 1-3.動的グループの作成または更新
他のOCI サービスを使用するには、ファンクションが動的グループの一部である必要があります。動的グループの作成方法については、[ドキュメント](https://docs.oracle.com/ja-jp/iaas/Content/Identity/Tasks/managingdynamicgroups.htm#To)を参照してください。
「一致ルール」を指定するとき、コンパートメント内のすべての関数を次のように一致させることをお勧めします。
```
ALL {resource.type = 'fnfunc', resource.compartment.id = [functions_compartment_id]}
```
+ `functions_compartment_id`：今回ファンクションをデプロイするコンパートメントのコンパートメントIDです。
その他の「一致ルール」のオプションについては、[ファンクションの実行による他のOracle Cloud Infrastructureリソースへのアクセス](https://docs.oracle.com/ja-jp/iaas/Content/Functions/Tasks/functionsaccessingociresources.htm)をご確認ください。

### 1-4.ポリシーの作成または更新
セキュリティ上の理由から、データベースウォレットは Docker イメージに含まれていません。」この関数は実行時にウォレットをダウンロードします。

ファンクションの実行中にAutonomous Databaseからウォレットを直接取得するには、Autonomous DatabaseのOCIDを確認し、特定の権限 'AUTONOMOUS_DATABASE_CONTENT_READ' を持つ動的グループがAutonomous Databaseを使用できるようにするIAMポリシーを作成する必要があります.
```
Allow dynamic-group [functions_dynamic_group_name] to use autonomous-databases in compartment [atp_compartment_name] where request.permission='AUTONOMOUS_DATABASE_CONTENT_READ'
```
+ `functions_dynamic_group_name`：[1-3.動的グループの作成または更新](#1-3.動的グループの作成または更新)で作成した動的グループの名称。
+ `atp_compartment_name`：ATPが属しているコンパートメントのコンパートメント名。
ポリシーの作成手順については、[OCI IAMポリシーの作成ガイド](https://docs.oracle.com/ja-jp/iaas/Content/Identity/Concepts/policysyntax.htm) を参照してください。.

2.OCI Functionsの作成
-------------------
ここでは、OCI Functionsの作成とデプロイを行います。

### 2-1.アプリケーションの作成

OCIコンソールのハンバーガーメニューをクリックして、「開発者サービス」に移動して、「ファンクション」をクリックします。

OCI Functionsに使用する予定のリージョンを選択します（Fn Project CLIコンテキストで指定されたDockerレジストリと同じリージョンを推奨します）。  

Fn Project CLIコンテキストで指定されたコンパートメントを選択します。

「アプリケーションの作成」をクリックして、次を指定して、「作成」をクリックします。

+ 名前：このアプリケーションに最初のFunctionをデプロイし、Functionを呼び出すときにこのアプリケーションを指定。今回は、`fn-crud-atp`
+ VCN：Functionを実行するVCN。今回は、[OCI Functionsハンズオン](/ocitutorials/cloud-native/functions-for-beginners/)で作成したVCNを指定。
+ サブネット：Functionを実行するサブネット。今回は、[OCI Functionsハンズオン](/ocitutorials/cloud-native/functions-for-beginners/)で作成したVCNのパブリック・サブネットを指定。
+ Shape：OCI Functionsを実行するために使用される基盤となるコンピューティング環境。今回はGENERIC_X86を指定。

![](create-function.png) 

[OCI Functionsハンズオン](/ocitutorials/cloud-native/functions-for-beginners/)で利用したCloud Shellにログインします。  

デプロイ前にFunctionsを実行するために環境変数をいくつか設定します。

```
fn config app fn-crud-atp ADB_OCID [adb_ocid]
```
+ `adb_ocid`：データベースのOCID。[1-1.ATPのプロビジョニング](#1-1.ATPのプロビジョニング)で取得した値を使用します
```
fn config app fn-crud-atp DBSVC [tns_name]
```
+ `tns_name`：TNS名。[1-1.ATPのプロビジョニング](#1-1.ATPのプロビジョニング)で取得した値を使用します
```
fn config app fn-crud-atp DBUSER usersvc
fn config app fn-crud-atp DBPWD_CYPHER [db_password]
```
+ `db_password`：今回DBへ接続用のユーザー「usersvc」のパスワード。[1-1.ATPのプロビジョニング](#1-1.ATPのプロビジョニング)で設定したパスワードを使用します

**機密情報を含む環境変数について**  
機密情報を含む構成変数は、常に暗号化する必要があります。今回はシンプルな手順にするために特に暗号化は実施しませんが、実際に使用する場合は、[キー管理を使用する方法](https://blogs.oracle.com/developers/oracle-functions-using-key-management-to-encrypt-and-decrypt-configuration-variables)を確認してください。
{: .notice--warning}

### 2-2.アプリケーションの作成
ワークショップ用のコンテンツをクローンし、ディレクトリに移動します。

```sh
git clone https://github.com/yan-linfeng/fn-crud-atp.git
```

```sh
cd fn-crud-atp
```

次に、以下のコマンドを実行して、各 Function を順番にデプロイします。

create-func
```sh
cd create-func
```
```sh
fn -v deploy --app fn-crud-atp
```
read-func
```sh
cd ../read-func
```
```sh
fn -v deploy --app fn-crud-atp
```
update-func
```sh
cd ../update-func
```
```sh
fn -v deploy --app fn-crud-atp
```
delete-func
```sh
cd ../delete-func
```
```sh
fn -v deploy --app fn-crud-atp
```
これで、すべてのFunctionの作成とデプロイが完了しました。


3.OCI API Gatewayの作成  
-------------------
OCIコンソールにログインし、[開発者サービス]に移動して、[API管理] => [ゲートウェイ]をクリックしてから、次の操作を行います。
![](create-gateway-01.png) 

[ゲートウェイの作成]をクリックして、次を指定します。

+ 名前：新しいゲートウェイの名前、たとえば、`workshop-api-gateway`

+ タイプ：パブリック

+ コンパートメント：OCI API Gatewayリソースを作成するコンパートメントの名前（こちらのワークショップではFunctionと同じコンパートメントを指定してください）

+ 仮想クラウド・ネットワーク：OCI API Gatewayで使用するVCN。(Oracle Functionと同じVCNを指定してください)

+ サブネット：VCNのサブネット。(Oracle Functionと同じVCNサブネットを指定してください)

![](create-gateway-02.png)

新しいAPIゲートウェイが作成されると、[ゲートウェイ]ページのリストに`アクティブ`と表示されます。

![](create-gateway-03.png)

[リソース]で[デプロイメント]をクリックし、[デプロイメントの作成]をクリックします。

![](create-gateway-04.png)

[最初から]をクリックし、[基本情報]セクションで次を指定して、「次」をクリックします。
+ 名前：新しいAPIデプロイメントの名前、今回は、`workshop`
+ パス接頭辞：APIデプロイメントに含まれるすべてのルートのパスに追加するパスプレフィックス、今回は、`/v1`
+ コンパートメント：新しいAPIデプロイメントを作成するコンパートメント
  
![](create-gateway-05.png)

[認証]セクションで[最初から]をクリックし、「次」をクリックします。
![](create-gateway-06.png)

[1のルーティング]セクションで次を指定して、[別のルート]をクリックします。

+ パス：APIのパス。今回は、`/users/{userId}`
+ メソッド：APIのメソッドを指定します。今回は、`POST`
+ バックエンド・タイプ：バックエンド・サービスのタイプを指定します。今回は、`Oracleファンクション`
+ アプリケーション：ファンクションのアプリケーションを指定します。今回は、`fn-crud-atp`
+ 関数名：ファンクションを指定します。今回は、`create-func`

![](create-gateway-07.png)

[2のルーティング]セクションで次を指定して、[別のルート]をクリックします。

+ パス：APIのパス。今回は、`/users`
+ メソッド：APIのメソッドを指定します。今回は、`GET`
+ バックエンド・タイプ：バックエンド・サービスのタイプを指定します。今回は、`Oracleファンクション`
+ アプリケーション：ファンクションのアプリケーションを指定します。今回は、`fn-crud-atp`
+ 関数名：ファンクションを指定します。今回は、`read-func`

![](create-gateway-08.png)

[3のルーティング]セクションで次を指定して、[別のルート]をクリックします。

+ パス：APIのパス。今回は、`/users/{userId}`
+ メソッド：APIのメソッドを指定します。今回は、`GET`
+ バックエンド・タイプ：バックエンド・サービスのタイプを指定します。今回は、`Oracleファンクション`
+ アプリケーション：ファンクションのアプリケーションを指定します。今回は、`fn-crud-atp`
+ 関数名：ファンクションを指定します。今回は、`read-func`

![](create-gateway-09.png)

[4のルーティング]セクションで次を指定して、[別のルート]をクリックします。

+ パス：APIのパス。今回は、`/users/{userId}`
+ メソッド：APIのメソッドを指定します。今回は、`PUT`
+ バックエンド・タイプ：バックエンド・サービスのタイプを指定します。今回は、`Oracleファンクション`
+ アプリケーション：ファンクションのアプリケーションを指定します。今回は、`fn-crud-atp`
+ 関数名：ファンクションを指定します。今回は、`update-func`

![](create-gateway-10.png)

[5のルーティング]セクションで次を指定して、[次]をクリックします。

+ パス：APIのパス。今回は、`/users/{userId}`
+ メソッド：APIのメソッドを指定します。今回は、`DELETE`
+ バックエンド・タイプ：バックエンド・サービスのタイプを指定します。今回は、`Oracleファンクション`
+ アプリケーション：ファンクションのアプリケーションを指定します。今回は、`fn-crud-atp`
+ 関数名：ファンクションを指定します。今回は、`delete-func`

![](create-gateway-11.png)

新しいAPIデプロイメント用に入力した詳細を確認し、[作成]をクリックして作成します。
![](create-gateway-12.png)

APIデプロイメントのリストで、作成したばかりの新しいAPIデプロイメントのエンドポイントの横にある[コピー]をクリックして、エンドポイントをコピーします。

![](create-gateway-13.png)

以上で、OCI API Gatewayの設定は完了です。

4.動作確認  
-------------------

ここでは、OCI API Gateway を実際に呼び出して、ユーザー管理に関する CRUD（Create, Read, Update, Delete）操作の API の動作確認を行います。この確認には、Postman を使用します。Postman は、HTTP リクエストを簡単に送信し、API の動作をテストすることができる便利なツールです。

### 4-1. ユーザー作成APIのテスト
ユーザー作成APIをテストするために、以下の手順を実行します。

1. **Postmanでの設定**
    - **メソッド**：POSTを選択します。これは、新しいユーザー情報をサーバーに送信して作成するためのHTTPメソッドです。
    - **エンドポイント**：`コピーしたAPIデプロイメントのエンドポイント`/`v1`/`users`/`2F5D2B76AD068F35E0630516000A130E` を入力します。例えば、`https://xxxxxxxxxxxxxx.ap-osaka-1.oci.customer-oci.com/v1/users/2F5D2B76AD068F35E0630516000A130E` のような形式になります。
    - **Bodyのタイプ**：`JSON` を選択します。JSON形式でユーザー情報を送信するためです。
    - **Bodyの内容**：`{"first_name": "John","last_name": "Doe","username": "johndoe"}` を入力します。これは、新しく作成するユーザーの名前、姓、ユーザー名を表します。

2. **リクエストの送信**<br>
上記の設定が完了したら、[Send] ボタンをクリックしてリクエストを送信します。
![](test-create-api-01.png)
3. **結果の確認**<br>
API コールが成功すると、OCI Functions がバックエンドとして実行され、以下のような JSON レスポンスが返されます。これは、新しいユーザーが正常に作成されたことを示しています。
```
{
  "message": "User created successfully"
}
```

### 4-2. ユーザー読みAPIのテスト
ユーザー読みAPIのテストは、全ユーザーの情報を取得する場合と、特定のユーザーの情報を取得する場合の2種類のテストを行います。

#### 全ユーザー情報の取得
1. **Postmanでの設定**
    - **メソッド**：GETを選択します。これは、サーバーから情報を取得するためのHTTPメソッドです。
    - **エンドポイント**：`コピーしたAPIデプロイメントのエンドポイント`/`v1`/`users` を入力します。例えば、`https://xxxxxxxxxxxxxx.ap-osaka-1.oci.customer-oci.com/v1/users` のような形式になります。
2. **リクエストの送信**<br>
[Send] ボタンをクリックしてリクエストを送信します。
![](test-read-api-01.png)
3. **結果の確認**<br>
API コールが成功すると、OCI Functions がバックエンドとして実行され、以下のような JSON レスポンスが返されます。これは、サーバー上に存在する全ユーザーの情報を示しています。
```
[
    {
        "ID": "8C561D58E856DD25E0532010000AF462",
        "FIRST_NAME": "todd",
        "LAST_NAME": "sharp",
        "USERNAME": "tsharp",
        "CREATED_ON": "2025-03-03T16:19:41.572976"
    },
    {
        "ID": "8C561D58E858DD25E0532010000AF462",
        "FIRST_NAME": "jeff",
        "LAST_NAME": "smith",
        "USERNAME": "thatjeff",
        "CREATED_ON": "2025-03-03T16:19:41.662402"
    },
    {
        "ID": "2F5D2B76AD068F35E0630516000A130E",
        "FIRST_NAME": "John",
        "LAST_NAME": "Doe",
        "USERNAME": "johndoe",
        "CREATED_ON": "2025-03-06T01:47:25.474835"
    }
]
```

#### 特定ユーザー情報の取得
1. **Postmanでの設定**
     - **メソッド**：GETを選択します。
     - **エンドポイント**：`コピーしたAPIデプロイメントのエンドポイント`/`v1`/`users`/`2F5D2B76AD068F35E0630516000A130E` を入力します。例えば、`https://xxxxxxxxxxxxxx.ap-osaka-1.oci.customer-oci.com/v1/users/2F5D2B76AD068F35E0630516000A130E` のような形式になります。

2. **リクエストの送信** <br>
  [Send] ボタンをクリックしてリクエストを送信します。
  ![](test-read-api-02.png)
3. **結果の確認**<br>
API コールが成功すると、OCI Functions がバックエンドとして実行され、以下のような JSON レスポンスが返されます。これは、指定されたIDのユーザーの詳細情報を示しています。
```
{
    "ID": "2F5D2B76AD068F35E0630516000A130E",
    "FIRST_NAME": "John",
    "LAST_NAME": "Doe",
    "USERNAME": "johndoe",
    "CREATED_ON": "2025-03-06T01:47:25.474835"
}
```


### 4-3. ユーザー更新APIのテスト
ユーザー更新APIをテストするために、以下の手順を実行します。

1. **Postmanでの設定**
    - **メソッド**：PUTを選択します。これは、既存のユーザー情報を更新するためのHTTPメソッドです。
    - **エンドポイント**：`コピーしたAPIデプロイメントのエンドポイント`/`v1`/`users`/`2F5D2B76AD068F35E0630516000A130E` を入力します。例えば、`https://xxxxxxxxxxxxxx.ap-osaka-1.oci.customer-oci.com/v1/users/2F5D2B76AD068F35E0630516000A130E` のような形式になります。
    - **Bodyのタイプ**：`JSON` を選択します。
    - **Bodyの内容**：`{"first_name": "Mike","last_name": "Smith","username": "mikesmith"}` を入力します。これは、更新後のユーザーの名前、姓、ユーザー名を表します。

2. **リクエストの送信**<br>
[Send] ボタンをクリックしてリクエストを送信します。
![](test-update-api-01.png)

3. **結果の確認**<br>
API コールが成功すると、OCI Functions がバックエンドとして実行され、以下のような JSON レスポンスが返されます。これは、指定されたユーザーの情報が正常に更新されたことを示しています。
```
{
  "message": "User updated successfully"
}
```
4. **更新後の情報確認**

    更新が成功したことを確認するために、再度特定ユーザー情報の取得APIを呼び出します。

    - **メソッド**：GETを選択します。
    - **エンドポイント**：`コピーしたAPIデプロイメントのエンドポイント`/`v1`/`users`/`2F5D2B76AD068F35E0630516000A130E` を入力します。
  
    API コールが成功すると、OCI Functions がバックエンドとして実行され、以下のような JSON レスポンスが返されます。これにより、ユーザー情報が正しく更新されたことが確認できます。
```
{
    "ID": "2F5D2B76AD068F35E0630516000A130E",
    "FIRST_NAME": "Mike",
    "LAST_NAME": "Smith",
    "USERNAME": "mikesmith",
    "CREATED_ON": "2025-03-06T01:47:25.474835"
}
```

### 4-4. ユーザー削除APIのテスト
ユーザー削除APIをテストするために、以下の手順を実行します。

1. **Postmanでの設定**
    - **メソッド**：DELETEを選択します。これは、指定されたユーザー情報を削除するためのHTTPメソッドです。
    - **エンドポイント**：`コピーしたAPIデプロイメントのエンドポイント`/`v1`/`users`/`2F5D2B76AD068F35E0630516000A130E` を入力します。例えば、`https://xxxxxxxxxxxxxx.ap-osaka-1.oci.customer-oci.com/v1/users/2F5D2B76AD068F35E0630516000A130E` のような形式になります。

2. **リクエストの送信**
[Send] ボタンをクリックしてリクエストを送信します。
![](test-delete-api-01.png)
3. **結果の確認**
API コールが成功すると、OCI Functions がバックエンドとして実行され、以下のような JSON レスポンスが返されます。
```
{
  "message": "User deleted successfully"
}
```
4. **削除後の情報確認**

    削除が成功したことを確認するために、再度特定ユーザー情報の取得APIを呼び出します。

    - **メソッド**：GETを選択します。
    - **エンドポイント**：`コピーしたAPIデプロイメントのエンドポイント`/`v1`/`users`/`2F5D2B76AD068F35E0630516000A130E` を入力します。

    [Send] ボタンをクリックしてリクエストを送信すると、以下のような出力が得られます。これは、指定されたユーザーが正常に削除されたことを示しています。
```
{
    "message": "User not found"
}
```
以上の手順により、ユーザー管理に関するCRUD操作のAPIの動作確認が完了します。


以上で、OCI Functions を通じて python - oracledb ドライバを使って ATP に接続してデータを取得し、OCI API Gateway から OCI Functions にルーティングする方法が身につきました！
お疲れ様でした。