---
title: "Oracle Functions ハンズオン"
excerpt: "Oracle Functionsは、Oracle Cloud Infrastructure(OCI)上で提供されるマネージドFaaS(Function as a Service)サービスです。こちらのハンズオンでは、Oracle Functionsを動かしながら、FaaSおよびOracle Functionsの特徴や使い方を学んでいただけるコンテンツになっています。"
order: "050"
tags:
---
Oracle Functionsは、Oracleが提供するオープンソースのFaaSプラットフォームであるFn Projectのマネージドサービスです。  
このエントリーでは、Oracle Functions環境構築から動作確認までの手順を記します。
 
条件
----------------------
- クラウド環境
    * 有効なOracle Cloudアカウントがあること
    * [Fn Projectハンズオン](/ocitutorials/cloud-native/fn-for-beginners/)が完了していること(このハンズオンの理解を深めるため)

事前準備
---------

**注意事項: コンパートメントについて**  
Oracle Cloudにはコンパートメントという考え方があります。  
コンパートメントは、クラウド・リソース(インスタンス、仮想クラウド・ネットワーク、ブロック・ボリュームなど)を分類整理する論理的な区画で、この単位でアクセス制御を行うことができます。  
また、OCIコンソール上に表示されるリソースのフィルタとしても機能します。<br>今回は、ルートコンパートメントと呼ばれるすべてのリソースを保持するコンパートメントを利用するので、特に意識する必要がありません。
{: .notice--info}

**注意事項: ポリシーについて**  
Oracle Cloudでは、各ユーザーから各サービスへのアクセスおよび各サービスから他サービスへアクセスを「ポリシー」を利用して制御します。ポリシーは、各リソースに誰がアクセスできるかを指定することができます。
このハンズオンでは、テナンシ管理者を想定してポリシーを設定していきます。
{: .notice--info}

{% capture notice %}**注意事項: リージョンとリージョンコードについて**  
Oracle Cloudでは、エンドポイントやレジストリにアクセスする際にリージョンおよびリージョンコードを使用する場合があります。  
以下に各リージョンと対応するリージョンコードを記載します。  
本ハンズオンでは、OCI CLIのセットアップおよびOCIRのログイン時に使用します。

リージョン|リージョンコード
-|-
ap-tokyo-1|nrt
ap-osaka-1|kix
ap-melbourne-1|mel
us-ashburn-1|iad
us-phoenix-1|phx
ap-mumbai-1|bom
ap-seoul-1|icn
ap-sydney-1|syd
ca-toronto-1|yyz
ca-montreal-1|yul
eu-frankfurt-1|fra
eu-zurich-1|zrh
sa-saopaulo-1|gru
sa-vinhedo-1| vcp
uk-london-1|lhr
sa-santiago-1|scl
ap-hyderabad-1|hyd
eu-amsterdam-1|ams
me-jeddah-1|jed
ap-chuncheon-1|yny
me-dubai-1|dxb
uk-cardiff-1|cwl
us-sanjose-1|sjc

{% endcapture %}
<div class="notice--warning">
  {{ notice | markdownify }}
</div>

ここでは、Oracle Functionsのハンズオンを実施するためにOCI(Oracle Cloud Infrastructure)に対してポリシーの設定を行います。

Oracle Cloudのダッシューボードにログインし、ダッシューボード画面のハンバーガーメニューで[アイデンティティとセキュリティ]=>[ポリシー]をクリックします。
![](00-00.png)
  
"ポリシーの作成"をクリックします。
![](00-01.png)

"名前"に任意の名前(特にこだわりがなければ"Oracle-Functions-Policy")を入力、"説明"にも名前と同様の値を入力、"手動エディタ"の表示にチェックを入れてテキストボックスに以下の2つを入力し、"作成"をクリックします。  
以下の2つのポリシーによって、Oracle FunctionsからのVCN(ネットワーク)の使用およびファンクションを格納するレジストリの使用を許可します。

* Allow service FaaS to use virtual-network-family in tenancy
* Allow service FaaS to read repos in tenancy

![](00-02.png)

以上で、事前準備は完了です。

1.Cloud Shellのセットアップ
-------------------
本ハンズオンではOKEクラスターを操作するいくつかのCLIを実行するための環境としてCloud Shellと呼ばれるサービスを使用します。
Cloud ShellはOracle CloudコンソールからアクセスできるWebブラウザベースのコンソールです。
Cloud Shellには、OCI CLIをはじめとして、次のようないくつかの便利なツールおよびユーティリティの現在のバージョンがインストールされています。
詳細は、[公式ドキュメントの記載](https://docs.cloud.oracle.com/ja-jp/iaas/Content/API/Concepts/cloudshellintro.htm)をご確認ください。

インストール済みツール |
-|
Git |
Java |
Python (2および3) |
SQL Plus |
kubectl |
helm |
maven |
gradle |
terraform |
ansible |
fn |

**Cloud Shellついて**  
Cloud Shellは開発専用ではなく、一時的にOCIコマンドを実行したい場合などライトなご利用を想定したサービスであるため、実運用時はCLI実行環境を別途ご用意ください。
{: .notice--warning}

OCIコンソール上で右上にあるターミナルのアイコンをクリックします。

![](01-02-01.png)


しばらく待つと、Cloud Shellが起動されます。

![](01-02-02.png)

このハンズオンに必要なCLI(`fn`コマンド)はデフォルトでインストール済みです。  
以下のコマンドで確認してみましょう。　　

```
fn --version
```

以下のような結果となれば、`fn`コマンドは正常にインストールされています。
```
fn version 0.6.6
```

以上で、準備作業は完了です。

2.Oracle Functions実行環境の構築
---------------------------------------------------
ここでは、Oracle Functionsを動作させるための環境を構築します。  

### 2-1.必要な情報の作成と収集
ここでは、Oracle Functionsのデプロイに必要な情報を収集/作成します。

#### 2-1-1. 認証tokenの作成
ここでは、OCIR(Oracle Functionsを管理するOracle提供のプライベートDockerレジストリ)にログインするための認証tokenを作成します。  

OCIのコンソールに移り、画面右上の人型のマークが表示されている箇所をクリックします。  
さらに、展開されたメニューのユーザー名部分(下記の場合は"oracleidentitycloudservice/takuya2230@gmail.com")をクリックします。
![](02-01.png)

ユーザーの詳細画面の左側のメニューで、"認証トークン"をクリックし、さらに"トークンの生成"をクリックします。
![](02-02.png)

"説明"に"This token is used for Oracle Functions Handson"と入力し、"トークンの生成"をクリックします。
![](02-03.png)

以下の画面が表示されるので、"コピー"をクリックし、これを手元のテキストエディタなどにペーストしておきます。
![](02-04.png)

#### 2-1-2. コンパートメントOCIDの確認
ここでは、コンパートメントOCIDを確認します。  

- コンパートメントOCID  
    画面右上の人型のアイコンをクリックし、展開されたメニューにあるテナント名(下記の場合は"functionshandson")をクリックします。   
    ![](03-01.png)
    テナンシ詳細情報の画面で"テナンシ情報"タブ内にOCIDが表示されている箇所があります。  
    OCIDの値の右にある"コピー"をクリックすると、クリップボードにOCIDがコピーされるので、これを手元のテキストエディタなどにペーストしておきます。
    ![](03-02.png)

**注意事項: ルートコンパートメントのコンパートメントOCIDについて**  
ルートコンパートメントのコンパートメントOCIDは、テナンシーOCIDと同一になります
{: .notice--info}

#### 2-1-3. オブジェクト・ストレージ・ネームスペースの確認
ここでは、オブジェクト・ストレージ・ネームスペースを確認します。  

- オブジェクト・ストレージ・ネームスペース
    上記と同じテナンシ詳細情報の画面で"テナンシ情報"タブ内にオブジェクト・ストレージ・ネームスペースが表示されている箇所があります。  
    下図の赤枠の部分を選択、コピーし、これを手元のテキストエディタなどにペーストしておきます。
    ![](03-03.png)

### 2-2. Oracle Functions CLI contextの作成と設定
Oracle FunctionsをデプロイするためのにOracle Functions CLIを利用して環境を作成します。  
開発環境の設定は、`fn update`コマンドを使用して行います。

以下のコマンドを実行し、今選択されているcontextを確認します。

    fn list context

**注意事項: Cloud Shell上のfn contextについて**  
Cloud Shell上には、事前にcontextが作成されています。  
contextはリージョンごとに作成されますので、この後の手順では、ご自身がご利用されているリージョンのcontextを利用します。
{: .notice--info}

以下のコマンドを実行し、ご自身がご利用されているリージョンのcontextを選択します。  

    fn use context <region-context>

例えば、東京リージョンの場合は以下のコマンドになります。

    fn use context ap-tokyo-1 

以下のコマンドを実行し、コンパートメントIDを設定します。([compartment-ocid]は[2-1-2. コンパートメントOCIDの確認](#2-1-2-コンパートメントocidの確認)の手順で確認したコンパートメントOCIDです。)

    fn update context oracle.compartment-id [compartment-ocid]

以下のコマンドを実行し、OCIRを設定します。  

    fn update context registry [region-code].ocir.io/[オブジェクト・ストレージ・ネームスペース]/[repo-name]

今回は以下のコマンドを実行し、OCIRを設定します。(本ハンズオンではashburnリージョンを使用)  
[region-code] (下記であれば"iad"部分)については、自身のトライアル環境に対応した値を使用してください。  
[オブジェクト・ストレージ・ネームスペース]は、3-1-1で確認したオブジェクト・ストレージ・ネームスペースを設定します。

    fn update context registry iad.ocir.io/[オブジェクト・ストレージ・ネームスペース]/functions-handson


以下のコマンドを実行し、Oracle Functionsで使用するprofile名を設定します。  
profile名は、今回"DEFAULT"(OCI CLIセットアップ時に設定されるデフォルトのprofile名)を入力します。 

    fn update context oracle.profile "DEFAULT"
 
以下のコマンドを実行し、OCIRにログインできることを確認します。(本ハンズオンでは、ashburnを使用しているので、"iad")  
ログインの際にユーザー名とパスワードを聞かれるので、下表のように応答します。  
OCIRのURIにおけるリージョンコード(下記であれば"iad"部分)については、自身のトライアル環境に対応した値を使用してください。

    docker login iad.ocir.io

質問|応答操作|備考
-|-|-
Username| [tenancy-namespace]/[username]| [tenancy-namespace]:3-1-1で確認したtenancy-namespace<br>[username]: OCIコンソール画面右上の人型のアイコンをクリックし、展開されたメニューにある"プロファイル"直下に表示される文字列
Password| [2-1-1. 認証tokenの作成](#2-1-1-認証tokenの作成)で作成した認証token| tokenは半角英数字記号

ログインに成功すると以下のように表示されます。

    Login Succeeded

以上で、Oracle Functions開発環境の作成は完了です。

### 2-3. Oracle Functionsが利用するVCNの作成
Oracle Cloudのダッシューボードにログインし、ダッシューボード画面のハンバーガメニューで"ネットワーキング"=>"仮想クラウド・ネットワーキング"をクリックします。

![](01-01.png)

表示された画面左下の"スコープ"内の"コンパートメント"をクリックし、ルートコンパートメント(下記の場合は"functionshandson")を選択します。ルートコンパートメントはOracle Cloudの登録時に設定した名称になります。既に選択されている場合は、この手順はスキップしてください。

![](01-12.png)

"VCNウィザードの起動"をクリックします。

![](01-02.png)

"インターネット接続性を持つVCN"を選択し、"ワークフローの起動"をクリックします。

![](01-03.png)

以下の情報を入力し、"次"をクリックします。

![](01-04.png)


* VCN名：任意の名前(こだわりがなければ"Oracle Functions Handson")
* コンパートメント：ルートコンパートメント
* VCN CIDRブロック：`10.0.0.0/16`
* パブリック・サブネットCIDRブロック：`10.0.0.0/24`
* プライベート・サブネットCIDRブロック：`10.0.1.0/24`

"作成"をクリックします。

![](01-14.png)

"仮想クラウド・ネットワークの表示"をクリックします。  

![](01-15.png)

以上で、VCN(ネットワーク)の作成は終わりです。

### 2-4. Oracle Functionsのアプリケーションの作成
ここでは、Oracle Functionsのアプリケーションの作成を行います。

OCIのコンソールに移り、"開発者サービス"の"ファンクション"をクリックします。
![](03-12.png)

"アプリケーションの作成"をクリックします。
![](03-13.png)

名前に"helloworld-app"と入力、VCNに[2-3. Oracle Functionsが利用するVCNの作成](#2-3-oracle-functionsが利用するvcnの作成)で作成したネットワーク名を選択、サブネットにVCNに紐づくパブリックサブネットを選択し、"作成"をクリックします。
![](03-14.png)


以上で、Oracle Functions実行環境の構築は完了です。

3.ファンクションの作成
---------------------------------------------------
ここでは、ファンクションの作成と動作確認を行います。  

### 【オプション】3-0. Podman環境設定

**この手順について**  
この手順は、Dockerの代わりにPodmanがインストールされた環境向けの手順です。  
Dockerを利用する方はこの手順は無視してください。  
Cloud Shellを利用している方は、この手順は不要です。  
なお、PodmanはFn Project CLI v0.6.12以降で利用可能です。　　
{: .notice--warning}

Fn CLIのconfigを編集し、利用するコンテナエンジンを以下のようにPodmanに変更します。  

    vim ~/.fn/config.yaml

```yaml
cli-version: 0.6.13
container-enginetype: podman # <== "docker"から"podman"に変更
current-context: ap-tokyo-1
```

以上で、Podman環境設定は完了です。

### 3-1. ファンクションプロジェクトの作成

まず、ファンクションプロジェクトを作成します。  
作成するアプリケーションの言語は以下から選択することができます。

- サポートする言語
    * Go
    * Java
    * Node.js
    * Python
    * Ruby

今回は、Javaでアプリケーションを作成します。  
ここからは[1.Cloud Shellのセットアップ](#1cloud-shellのセットアップ)でセットアップしたCloud Shellを利用していきます。  
まずは、`fn init`コマンドを使用してファンクションのひな形を作成します。  

- `fn init`コマンド
    * --runtime:使用する言語を指定します。今回はjavaを指定します。
    * --trigger:HTTPのエンドポイントを追加するためのオプション

以下のコマンドを実行し、ファンクションプロジェクトを作成します。

    fn init --runtime java helloworld-func

### 3-2. ファンクションのデプロイ
4-1で作成したファンクションのデプロイを行います。  

以下のコマンドを実行し、ファンクションプロジェクトに移動します。

    cd helloworld-func

以下のコマンドを実行し、ファンクションをデプロイします。  
--appでアプリケーション名を指定します。  
指定するアプリケーションは、[2-4. Oracle Functionsのアプリケーションの作成](#2-4-oracle-functionsのアプリケーションの作成)で作成したアプリケーション名です。

    fn deploy --app helloworld-app

ファンクションがデプロイされていることを確認します。  
OCIのコンソールに移り、"開発者サービス"の"コンテナ・レジストリ"をクリックします。
![](04-01.png)

OCIRのレジストリに先ほどデプロイしたファンクションがアップロードされていることを確認します。レジストリ上のファンクションは、[context名]/[Oracle Functionsプロジェクト名]になっています。  
このハンズオンでは、"functions-handson/helloworld-func"になります。
![](04-02.png)

次にOracle Functionsアプリケーションにhelloworld-funcがデプロイされていることを確認します。
OCIのコンソールに移り、"開発者サービス"の"ファンクション"をクリックします。
![](03-12.png)

"helloworld-app"をクリックします。  
![](04-03.png)

"機能"に"helloworld-func"が表示されていればデプロイ成功です。  
![](04-04.png)

### 3-3. Oracle Functionsの実行
Oracle Functionsを実行します。

以下のコマンドを実行し、ファンクションが実行されることを確認します。  
引数は[Oracle Functionsアプリケーション名] [ファンクション名]の順に指定します。

    fn invoke helloworld-app helloworld-func

以下のように表示されれば成功です。

    Hello, World!