---
title: "Oracle Container Engine for Kubernetes(OKE)でサンプルマイクロサービスアプリケーションをデプロイしてOCIのオブザバビリティサービスを利用してみよう"
excerpt: "OKEを使ってサンプルマイクロサービスアプリケーションのデプロイおよびオブザバビリティを体験していただけるコンテンツです。OCIのオブザバビリティサービスであるMonitoring、Logging、Application Performance Monitoring、Notificationsを利用します。"
order: "031"
tags:
---

このハンズオンでは、Oracle Container Engine for Kubernetes（以下OKE）上に、マイクロサービスアプリケーションをデプロイします。そして、OCIのObservabilityサービスを利用して、モニタリング、ロギング、トレーシングを実践的に学びます。

OCIのObservabilityサービスとして、以下を利用します。

***モニタリング***

- [Oracle Cloud Infrastructure Monitoring](https://www.oracle.com/jp/devops/monitoring/)
: メトリックおよびアラーム機能を使用してクラウド・リソースを積極的および受動的にモニター可能なフルマネージドサービスです。

***ロギング***

- [Oracle Cloud Infrastructure Logging](https://www.oracle.com/jp/devops/logging/)
: 監査ログ、サービス・ログ、カスタム・ログに対応した、スケーラビリティの高いフルマネージド型のロギングサービスです。

***トレーシング***

- [Oracle Cloud Infrastructure Application Performance Monitoring](https://www.oracle.com/jp/manageability/application-performance-monitoring/)
: アプリケーションをモニターし、パフォーマンスの問題を診断するための包括的な機能セットが組み込まれたフルマネージドサービスです。

**Oracle Cloud Observability and Management Platformについて**  
このハンズオンで利用するサービスは、[Oracle Cloud Observability and Management Platform(以下、O&M)](https://www.oracle.com/jp/manageability/)を構成するコンポーネントの一部です。
O&Mには、このハンズオンで利用するサービスの他にも、オンプレミスおよびマルチクラウド環境からすべてのログ・データを監視、集計、インデックス作成、分析可能な[Logging Analytics](https://www.oracle.com/jp/manageability/logging-analytics/)、Oracle Enterprise Managerの主要な機能をクラウドサービスとして提供する[Database Management](https://www.oracle.com/jp/manageability/database-management/)などがあります。
{: .notice--info}

ハンズオンの流れは以下となります。

---
1. OKEクラスタ構築とOCIRセットアップ
    1. OCIダッシュボードからOKEクラスタの構築
    2. Cloud Shellを利用してクラスタを操作
    3. OCIRのセットアップ

2. Application Performance Monitoring
    1. サンプルアプリケーションの概要説明
    2. サンプルアプリケーションとAPM連携設定
    3. APMドメインの作成
    4. サンプルアプリケーションのビルドとコンテナイメージシップ
    5. サンプルアプリケーションのManifest設定の変更
    6. OCI APMでのトレーシング
    7. OCI APMでのアプリケーションサーバのメトリクス監視

3. Logging
    1. カスタム・ログの設定
    2. ワーカーノード上のアプリケーションログの確認
    3. Kubernetes APIサーバーの監査ログの確認

4. Monitoring & Notifications
    1. Notificationsの設定
    2. Monitoringの設定
    3. MonitoringとNotificationsの実践

---

1.OKEクラスタ構築とOCIRセットアップ
---------------------------------

### 1-1 OCIダッシュボードからOKEクラスタの構築

左上のハンバーガーメニューを展開して、「開発者サービス」から「Kubernetesクラスタ(OKE)」を選択します。

![](1-1-001.png)

左メニューにある「リスト範囲」のコンパートメント選択プルダウンメニューからご自身のコンパートメントを選択します。

![](1-1-012.png)

「クラスタの作成」ボタンをクリックします。

![](1-1-002.png)

「クイック作成」が選択されていることを確認して、「ワークフローの起動」ボタンをクリックします。

![](1-1-003.png)

以下を設定の設定となっていることを確認します。

key|value
-|-
Kubernetes APIエンドポイント| パブリック・エンドポイント
Kubernetesワーカー・ノード| プライベート・ワーカー
シェイプ | VM Standard.E3.Flex
OCPU数の選択 | 1
メモリー量（GB）|16

![](1-1-004.png)

画面左下の「次」ボタンをクリックします。

![](1-1-005.png)

画面左下の「クラスタ作成」ボタンをクリックします。

![](1-1-006.png)

画面左下の「閉じる」ボタンをクリックします。

![](1-1-007.png)

黄色の「作成中」から緑の「アクティブ」になることを確認します。「アクティブ」であればクラスタ作成は完了です。

![](1-1-008.png)

### 1-2 Cloud Shellを利用してクラスタを操作

Cloud Shellを利用して、作成したKubernetesクラスタに接続します。

「クラスタへのアクセス」ボタンをクリックします。

![](1-1-009.png)

「Cloud Shellの起動」ボタン、「コピー」リンクテキスト、「閉じる」ボタンの順にクリックします。

![](1-1-010.png)

Cloud Shell起動後、「コピー」した内容をペーストして、Enterキーを押します。

![](1-1-011.png)

以下コマンドを実行して、3ノードの「STATUS」が「Ready」になっていることを確認します。

```sh
kubectl get nodes
```
***コマンド結果***
```sh
NAME          STATUS   ROLES   AGE     VERSION
10.0.10.139   Ready    node    2m7s    v1.21.5
10.0.10.228   Ready    node    2m22s   v1.21.5
10.0.10.24    Ready    node    2m27s   v1.21.5
```

### 1-3 OCIRのセットアップ

後続手順で、サンプルアプリケーションをビルドして、コンテナイメージを作成します。  
そのコンテナイメージを格納するコンテナイメージレジストリのセットアップを行います。  
OCIでは、Oracle Container Image Registry(OCIR)を利用します。

**OCIRについて**  
フルマネージドなDocker v2標準対応のコンテナレジストリを提供するサービスです。OKEと同一リージョンに展開することによる低レイテンシを実現します。  詳細は[こちら](https://www.oracle.com/jp/cloud-native/container-registry/)のページをご確認ください。
{: .notice--info}

左上のハンバーガーメニューをクリックして、「開発者サービス」-「コンテナ・レジストリ」を選択します。

![](1-3-001.png)

{% capture notice %}**ハンズオンに利用するコンパートメントついて**  
トライアル環境でのハンズオンの場合は、ルートコンパートメントを利用します。  
OCIRのコンソール画面はデフォルトでルートコンパートメントが選択されますが、ご自身に割り当てられているコンパートメントがある場合は、そちらのコンパートメントを利用してください。  
コンパートメントはOCIRのコンソール画面の左側から選択できます。
![0-013.jpg](1-1-013.jpg)
{% endcapture %}
<div class="notice--warning">
  {{ notice | markdownify }}
</div>

「リポジトリの作成」ボタンをクリックします。

![](1-3-002.png)

「リポジトリ名」に「frontend-app-apm」と入力、「アクセス」で「パブリック」を選択して、「リポジトリの作成」ボタンをクリックします。

![](1-3-003.png)

**レポジトリ名について**  
OCIRのレポジトリ名はテナンシで一意になります。  
集合ハンズオンなど複数人で同一環境を共有されている皆様は、`frontend-app-apm01`や`frontend-app-apm-tn`などの名前のイニシャルを付与し、名前が重複しないようにしてください。
{: .notice--warning}

OCIRにコンテナイメージをプッシュする際に必要となる、「Username」と「Password」を取得します。

「Username」は、`<オブジェクト・ストレージ・ネームスペース>/<ユーザ名>` となります。

＜ユーザ名＞を確認します。ユーザ名は右上にある「プロファイル」アイコンをクリックして、プロファイル名を選択します。

![](1-3-004.png)

「ユーザーの詳細画面」の赤枠箇所をコピーして、テキストエディタにペーストしておきます。

![](1-3-005.png)

次に、＜オブジェクト・ストレージ・ネームスペース＞を確認します。

右上にある「プロファイル」アイコンをクリックして、「テナンシ」を選択します。

![](1-3-006.png)

「テナンシ詳細」の「名前」と「オブジェクト・ストレージ・ネームスペース」の赤枠箇所をコピーして、テキストエディタにペーストしておきます。

![](1-3-007.png)

次に、「Password」となる認証トークンを設定します。

右上にある「プロファイル」アイコンをクリックして、プロファイル名を選択します。

![](1-3-008.png)

左メニュー「認証トークン」を選択します。

![](1-3-009.png)

「トークンの作成」をボタンをクリックします。

![](1-3-010.png)

「説明」に「oke-handson-apm」と入力して、「トークンの生成」ボタンをクリックします。

![](1-3-011.png)

「コピー」をクリックして、「閉じる」ボタンをクリックします。  コピーした認証トークンは、後の手順で必要となるので、テキストエディタなどにペーストしておきます。

![](1-3-012.png)

以上で、認証トークンの作成は完了です。

以下、テキストエディタにペーストした内容に当てはめて利用します。

key|value
-|-
Username|`<オブジェクト・ストレージ・ネームスペース>/<ユーザ名>`
Password| `認証トークン`

以上でOCIRのセットアップは完了です。

2.Application Performance Monitoring
---------------------------------

### 2-1. サンプルアプリケーションの概要説明

まずはホームディレクトリに移動し、以下のGitレポジトリをcloneします。  

```sh
cd ~
```

```sh
git clone https://github.com/oracle-japan/code-at-customer-handson
```

このハンズオン用に作成したサンプルアプリケーションです。  
中身を簡単に紹介します。  

```sh
.
├── README.md
├── k8s ==> KubernetesのMainifest群
├── olympic_backend_amp ==> バックエンドアプリケーション
├── olympic_datasource_amp ==> データソースアプリケーション
├── olympic_frontend_amp ==> フロントエンドアプリケーション
.
```

このサンプルアプリケーションは、主に以下の2つから構成されています。

- [Helidon](https://oracle-japan-oss-docs.github.io/helidon/docs/v2/#/about/01_overview)
  - Oracleがオープンソースで提供しているJavaのマイクロサービスフレームワーク
- [Oracle JavaScript Extension Toolkit（Oracle JET）](https://www.oracle.com/jp/application-development/technologies/jet/oracle-jet.html)
  - Oracleがオープンソースで開発しているJavascript用フレームワーク
  - 業界標準として普及しているオープンソース・フレームワークに基づき、開発者がより優れたアプリケーションをより迅速に構築できるよう支援する高度な機能とサービスを付加

簡単にアプリケーションの構成を見ていきます。  
この手順が完了すると全体のイメージは以下のようになります。

![](2-1-001.png)

Oracle Cloud Infrastructureの構成としては以下のような図になります。

![](2-1-002.png)

このサンプルアプリケーションは、3つのコンポーネントから以下のように構成されています。

- **フロントエンドアプリケーション(図中の`Olympics`)**  
  HelidonとOracle JETから構成されているアプリケーションです。  
  Helidonの静的コンテンツルート(今回は`resources/web配下`)にOracle JETのコンテンツを配置しています。  
  このアプリケーションは、バックエンドサービス(v1/v2/v3)のいずれかを呼び出します。  
  また、このアプリケーションにはApplication Performance Monitoringで利用するAPM Browser AgentとAPM Agentが含まれています。

- **バックエンドアプリケーション(図中の緑枠部分)**  
  Helidonから構成されているアプリケーションです。
  このアプリケーションには3つのバージョンが存在し、それぞれ金メダメリスト(v3)、銀メダリスト(v2)、銅メダリスト(v1)の一覧を返すようになっています。 
  バージョン情報は環境変数として保持しています。
  このアプリケーションは、データソースアプリケーションに対してバージョンに応じたAPIエンドポイントを呼び出し、データを取得しにいきます。  
  また、このアプリケーションにはApplication Performance Monitoringで利用するAPM Agentが含まれています。

- **データソースアプリケーション(図中の`Medal Info`)**  
  Helidonとインメモリで動作しているデータベースである[H2 Database](https://www.h2database.com/html/main.html)から構成されているアプリケーションです。  
  このアプリケーションでは、メダリストと獲得したメダルの色を保持しており、バックエンドアプリケーションから呼び出されたエンドポイント応じてメダリストとそのメダルの色を返却します。  
  また、このアプリケーションにはApplication Performance Monitoringで利用するAPM Agentが含まれています。

**Helidonについて**  
Helidonは`Maven`を利用してプロジェクトの雛形を作成することができます。  
コマンドについては[こちら](https://helidon.io/docs/v2/#/mp/guides/02_quickstart)をご確認ください。  
この中にはデフォルトでDockerfileも含まれています。  
以降で利用するDockerfileも、基本的に上記雛形ファイルを利用しています。
また、HelidonにはHelidon CLIという便利なCLIツールがあります。  
Helidon CLIについては[こちら](https://oracle-japan.github.io/ocitutorials/cloud-native/helidon-mp-for-beginners/)をご確認ください。
{: .notice--info}

### 2-2 サンプルアプリケーションとAPM連携設定

クローンしたサンプルアプリケーションにAPMと連携するための設定を行います。

**本手順について**  
この手順2-2は、トライアル環境や管理者権限をお持ちの環境でハンズオンを実施されている皆様には不要な手順ですので、スキップしていただき、手順2-3から実施してください。
{: .notice--info}

まずは、OCI APMを利用するためのポリシーを作成してきます。  

OCIコンソールのハンバーガーメニューを開き、「アイデンティティとセキュリティ」から「ポリシー」を選択します。  

![](2-2-001.png)

「ポリシーの作成」をクリックします。  

![](2-2-002.png)

以下の情報を入力します。  
また、「手動エディタの表示」にチェックを入れます。  

key|value
-|-
名前| apm_policy
説明| apm_policy
コンパートメント | ご自身のコンパートメント名
ポリシー | `Allow group APM-Admins to manage apm-domains in compartment id <ご自身のコンパートメントOCID>`

![](2-2-003.png)

画像はイメージですので、コンパートメントOCIDはご自身の環境に合わせて読み替えてください。 

「作成」をクリックします。  

これで、ポリシーの設定は完了です。  

### 2-3 APMドメインの作成

ここでは、APMドメインの作成を行います。  

OCIコンソールのハンバーガーメニューを開き、「監視および管理」から「アプリケーション・パフォーマンス・モニタリング」カテゴリの「管理」を選択します。  

![](2-3-001.png)

「APMドメインの作成」をクリックします。  

![](2-3-002.png)

以下の情報を入力します。 

key|value
-|-
名前| oke-handson-apm
説明| oke-handson-apm

**集合ハンズオンで参加されている皆様へ**  
APMドメイン名は重複が許容されないため、集合ハンズオンなどで同一環境を複数名でご利用されている皆様はAPMドメイン名に自分のイニシャルや好きな複数桁の番号などを付与し、重複しないようにAPMドメイン名を設定してください。  
{: .notice--warning}

「作成」をクリックします。

![](2-3-003.png)

ドメインが「作成中」のステータスになるので、「アクティブ」になるまで待機します。

![](2-3-004.png)

ドメインが「アクティブ」になったら、ドメイン名の箇所をクリックします。

以下、「APMドメイン情報」をコピーし、エディタなどに記録しておきます。  

項目|用途
-|-
データ・アップロード・エンドポイント|トレース情報やメトリクス情報をアップロードするエンドポイント
「データ・キー」の「プライベート」キー |トレース情報やメトリクス情報をアップロードするためのプライベートキー。主にAPMサーバー・エージェント(サーバサイド側のアプリケーション側)で利用
「データ・キー」の「パブリック」キー|トレース情報やメトリクス情報をアップロードするためのプライベートキー。主にAPMブラウザ・エージェント(ブラウザ側のアプリケーション側)で利用

この値は、アプリケーション側からトレーシング情報をAPMにアップロードする際のエンドポイントとその際に利用するキーになり、後ほど利用します。

![](2-3-005.png)
![](2-3-006.png)

これで、APMドメインの作成は完了です。

### 2-4 サンプルアプリケーションへのAPM設定とコンテナイメージ作成

サンプルアプリケーションのフロントエンドアプリケーションにAPMのエンドポイントとパブリックキーを設定します。

この設定を行うことで、フロントエンドアプリケーションからのトレース情報をAPM側で取得できるようになります。  
その後、ビルドしてコンテナイメージを作成します。

```sh
vim code-at-customer-handson/olympic_frontend_apm/src/main/resources/web/index.html
```

***コマンド結果***

```
~~~
    <script>
      window.apmrum = (window.apmrum || {}); 
      window.apmrum.serviceName='oke-helidon-demo-frontend-UI';
      window.apmrum.webApplication='OracleJetApp';
      window.apmrum.ociDataUploadEndpoint='https://xxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com';　#変更箇所1
      window.apmrum.OracleAPMPublicDataKey='<your-public-data-key>';　#変更箇所2
      window.apmrum.traceSupportingEndpoints =  [
        { headers: [ 'APM' ], hostPattern: '.*' },
      ]; 
    </script>
    <script async crossorigin="anonymous" src="https://xxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com/static/jslib/apmrum.min.js"></script> #変更箇所3
~~~
```

変更箇所|変更内容|備考
-|-
変更箇所1 | 「window.apmrum.ociDataUploadEndpoint」には、[2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録した「データ・アップロード・エンドポイント」を設定します。|
変更箇所2|「window.apmrum.OracleAPMPublicDataKey」には、[2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録したデータ・キーの「パブリック」キーを設定します。|**プライベートキーではなく、パブリックキーとなるので注意してください。**
変更箇所3|staticより前の部分「https～.com」までを[2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録した「データ・アップロード・エンドポイント」を設定します。

更新後、「:wq」エディタを保存終了します。

ディレクトリを移動後、ビルドしてコンテナイメージを作成します。

```sh
cd code-at-customer-handson/olympic_frontend_apm
```

`your-object-storage-namespace` は、事前に取得したオブジェクト・ストレージ・ネームスペースを指定します。

**Ashburn(us-ashburn-1)リージョンではない参加者の皆様**  
リージョンが、アッシュバーン(us-ashburn-1)ではない場合、環境に合わせて「iad.ocir.io」の部分も変更してください。
各リージョンのOCIRエンドポイントは[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Registry/Concepts/registryprerequisites.htm)で確認できます。  
ここでは、以降も「iad.ocir.io」で進めます。
{: .notice--warning}

**集合ハンズオンでご参加の皆様**  
集合ハンズオンなど同一環境を複数人で利用されている場合は、[手順1-3](#1-3-ocirのセットアップ)で作成したレポジトリ名をそれぞれ変更しています。  
リポジトリ名を自身で設定した名前に合わせてください。
{: .notice--warning}

数分後に Successfully の表示がされればビルドは成功です。

```sh
docker image build -t iad.ocir.io/<your-object-storage-namespace>/frontend-app-apm .
```

***コマンド結果***

```sh
~~~
Successfully built b3bd22ffd681
Successfully tagged iad.ocir.io/<your-object-storage-namespace>/frontend-app-apm:latest
```

OCIRにログインします。「iad.ocir.io」エンドポイントについては、ビルド時と同様、環境に合わせてください。

「Username」と「Password」は、事前に確認した以下を入力します。

入力項目|入力内容|取得元
-|-
Username | `<オブジェクト・ストレージ・ネームスペース>/<ユーザ名>`|[手順1-3](#1-3-ocirのセットアップ)で作成した内容
Password|`認証トークン` |[手順1-3](#1-3-ocirのセットアップ)で作成した内容

```sh
docker login iad.ocir.io
```

***コマンド結果***

```sh
Username: <オブジェクト・ストレージ・ネームスペース>/<ユーザ名>
Password: 認証トークン
WARNING! Your password will be stored unencrypted in /home/xxxxx/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

作成したコンテナイメージをプッシュします。  
`your-object-storage-namespace` は、事前に取得したオブジェクト・ストレージ・ネームスペースを指定します。

**Ashburn(us-ashburn-1)リージョンではない参加者の皆様**  
リージョンが、アッシュバーン(us-ashburn-1)ではない場合、環境に合わせて「iad.ocir.io」の部分も変更してください。
各リージョンのOCIRエンドポイントは[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Registry/Concepts/registryprerequisites.htm)で確認できます。  
ここでは、以降も「iad.ocir.io」で進めます。
{: .notice--warning}

**集合ハンズオンでご参加の皆様**  
集合ハンズオンなど同一環境を複数人で利用されている場合は、[手順1-3](#1-3-ocirのセットアップ)で作成したレポジトリ名をそれぞれ変更しています。  
リポジトリ名を自身で設定した名前に合わせてください。
{: .notice--warning}

```sh
docker image push iad.ocir.io/<your-object-storage-namespace>/frontend-app-apm
```

***コマンド結果***

```sh
The push refers to repository [iad.ocir.io/<your-object-storage-namespace>/frontend-app-apm]
129b7b03d44d: Pushed 
ee383522dea8: Pushed 
aa321ebc98e2: Pushed 
492be60e6c97: Pushed 
20f064be7fc0: Pushed 
7da834c1ebd3: Pushed 
7d0ebbe3f5d2: Pushed 
latest: digest: sha256:5e52a9d52d52b18a58ec71972db95980b43dcfe9fc78c7a83502b76c50d971d5 size: 1789
```

以上で、サンプルアプリケーションのビルドとコンテナイメージシップは完了です。

### 2-5 サンプルアプリケーションのManifest設定の変更

ここでは、Manifestの設定を変更していきます。

Manifestのあるディレクトリに移動します。  

```sh
cd ~
```

```sh
cd code-at-customer-handson/k8s/app/for-oci-apm-v2
```

フロントエンドアプリケーションのManifestをvimで開きます。

```sh
vim olympic_frontend.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-app
  labels:
    app: frontend-app
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend-app
      version: v1
  template:
    metadata:
      labels:
        app: frontend-app
        version: v1
    spec:
      containers:
      - name: frontend-app
        image: iad.ocir.io/<your-object-storage-namespace>/frontend-app-apm #変更箇所
        ports:
        - containerPort: 8082
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com #変更箇所
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX #変更箇所
~~~
```

以下の項目を変更します。

変更前|変更内容
-|-
iad.ocir.io/＜your-object-storage-namespace＞/frontend-app-apm(22行目) | iad.ocir.io/xxxxxxxxx(オブジェクト・ストレージ・ネームスペース)/frontend-app-apm|
https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com(27行目) | [2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録した「データ・アップロード・エンドポイント」|
XXXXXXXXXXXXXXXXXXXXXXXX(29行目) | [2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録した「データ・キー」の「プライベート」キー | **パブリックキーではなく、プライベートキーとなるので注意してください。**

**Ashburn(us-ashburn-1)リージョンではない参加者の皆様**  
リージョンが、アッシュバーン(us-ashburn-1)ではない場合、環境に合わせて「iad.ocir.io」の部分も変更してください。
各リージョンのOCIRエンドポイントは[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Registry/Concepts/registryprerequisites.htm)で確認できます。  
ここでは、以降も「iad.ocir.io」で進めます。
{: .notice--warning}

**集合ハンズオンでご参加の皆様**  
集合ハンズオンなど同一環境を複数人で利用されている場合は、[手順1-3](#1-3-ocirのセットアップ)で作成したレポジトリ名をそれぞれ変更しています。  
リポジトリ名を自身で設定した名前に合わせてください。
{: .notice--warning}

以下のようになります。

```yaml
~~~
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend-app
      version: v1
  template:
    metadata:
      labels:
        app: frontend-app
        version: v1
    spec:
      containers:
      - name: frontend-app
        image: iad.ocir.io/<your-object-storage-namespace>/frontend-app-apm
        ports:
        - containerPort: 8082
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
```

この状態で保存します。  

バックエンド、データソースアプリケーションにも実施します。  
今回のハンズオンでは、バックエンドアプリケーション/データソースアプリケーションは、APMドメインのエンドポイントとAPMドメインのプライベート・データキーのみ変更します。  

```sh
vim olympic_backend.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v1
  labels:
    app: backend-app
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v1
  template:
    metadata:
      labels:
        app: backend-app
        version: v1
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v1-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com #変更箇所
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX #変更箇所
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v2
  labels:
    app: backend-app
    version: v2
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v2
  template:
    metadata:
      labels:
        app: backend-app
        version: v2
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v2-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com #変更箇所
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX #変更箇所
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v3
  labels:
    app: backend-app
    version: v3
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v3
  template:
    metadata:
      labels:
        app: backend-app
        version: v3
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v3-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com #変更箇所
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX #変更箇所
```  

25行目から29行目、55行目から59行目、85行目から89行目の`env`フィールドの`tracing.data-upload-endpoint`、`tracing.private-data-key`の`value`を[6-2 APMドメインの作成](#6-2-apmドメインの作成)で記録したAPMドメインとプライベート・データキーにそれぞれ差し替えます。  

以下のようになります。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v1
  labels:
    app: backend-app
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v1
  template:
    metadata:
      labels:
        app: backend-app
        version: v1
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v1-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v2
  labels:
    app: backend-app
    version: v2
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v2
  template:
    metadata:
      labels:
        app: backend-app
        version: v2
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v2-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v3
  labels:
    app: backend-app
    version: v3
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v3
  template:
    metadata:
      labels:
        app: backend-app
        version: v3
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v3-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
```

最後にデータソースアプリケーションに対しても実施します。

```sh
vim olympic_datasource.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: datasource-app
  labels:
    app: datasource-app
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: datasource-app
      version: v1
  template:
    metadata:
      labels:
        app: datasource-app
        version: v1
    spec:
      containers:
      - name: datasource-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/datasource-app-apm
        ports:
        - containerPort: 8080
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com #変更箇所
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX #変更箇所
``` 

25行目から29行目の`env`フィールドの`tracing.data-upload-endpoint`、`tracing.private-data-key`の`value`を[6-2 APMドメインの作成](#6-2-apmドメインの作成)で記録したAPMドメインとプライベート・データキーに差し替えます。  

以下のようになります。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: datasource-app
  labels:
    app: datasource-app
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: datasource-app
      version: v1
  template:
    metadata:
      labels:
        app: datasource-app
        version: v1
    spec:
      containers:
      - name: datasource-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/datasource-app-apm
        ports:
        - containerPort: 8080
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
```

これでサンプルアプリケーションのManifest設定の変更は完了です。  

ここで利用するコンテナアプリケーションは、OCI APMを利用するためにアプリケーション側にトレーシングの設定を入れています。  
今回、OCI APMで利用しているアプリケーションは、code-at-customer-handsonディレクトリ配下の`_apm`が付与されているプロジェクトになります。

{% capture notice %}**HelidonアプリケーションでのOCI APMの利用**  
今回はHelidonを利用したアプリケーションですが、[HelidonにはOCI APM専用のエージェント](https://docs.oracle.com/ja-jp/iaas/application-performance-monitoring/doc/use-apm-tracer-helidon.html)が用意されています。  
基本的には、`pom.xml`に以下の依存関係を追加するだけで利用可能です。(アプリケーション側の変更は必要ありません)  
また、必要に応じて`src/main/resources/META-INF/microprofile-config.properties`に設定値を追加します。  

  ```xml
        <dependency>
            <groupId>com.oracle.apm.agent.java</groupId>
            <artifactId>apm-java-agent-helidon</artifactId>
            <version>RELEASE</version>
        </dependency>
        <dependency>
            <groupId>com.oracle.apm.agent.java</groupId>
            <artifactId>apm-java-agent-tracer</artifactId>
            <version>RELEASE</version>
        </dependency>
    </dependencies>

    <repositories>
        <repository>
            <id>oci</id>
            <name>OCI Object Store</name>
            <url>https://objectstorage.us-ashburn-1.oraclecloud.com/n/idhph4hmky92/b/prod-agent-binaries/o</url>
        </repository>
    </repositories>
  ```

  今回、`microprofile-config.properties`については以下のように設定しています。(フロントエンドアプリケーションの場合)

  ```yaml
  # OCI APM関連
  tracing.enabled=true
  tracing.service=oke-helidon-demo-frontend-service
  tracing.name="frontend-helidon-service"
  ```
  {% endcapture %}
<div class="notice--info">
  {{ notice | markdownify }}
</div>

**既存ZipkinプラットフォームでのOCI APMの利用**  
OCI APMはZipkin互換にもなっているので、既存のZipkinベースのAPMプラットフォームをOCI APMで利用して頂くことも可能です。  
詳細については[こちら](https://docs.oracle.com/ja-jp/iaas/application-performance-monitoring/doc/configure-open-source-tracing-systems.html)をご確認ください。
{: .notice--info}

### 2-6 OCI APMでのトレーシング

いよいよ、OCI APMを利用したトレーシングを実施します。  

再度、サンプルアプリケーションをデプロイします。  

```sh
cd ~
```

```sh
cd code-at-customer-handson/k8s/app/for-oci-apm-v2
```

```sh
kubectl apply -f . 
```

***コマンド結果***

```sh
deployment.apps/backend-app-v1 created
deployment.apps/backend-app-v2 created
deployment.apps/backend-app-v3 created
service/backend-app created
deployment.apps/datasource-app created
service/datasource-app created
deployment.apps/frontend-app created
service/frontend-app created
```

アプリケーションにアクセスします。  

```sh
kubectl get service frontend-app
```

***コマンド結果***

```sh
NAME           TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)        AGE
frontend-app   LoadBalancer   10.96.220.188   193.122.xxx.xxx   80:31664/TCP   41s
```

上記の場合は、frontend-app Serviceの`EXTERNAL-IP`である`193.122.xxx.xxx`がエンドポイントになります。

この場合は、以下のURLにアクセスします。  
`http://193.122.xxx.xxxx`

![](2-6-008.png)

何度かアクセスしたのちに、トレース情報をOCI APMから確認します。  

OCIコンソールのハンバーガーメニューを開き、「監視および管理」から「アプリケーション・パフォーマンス・モニタリング」カテゴリの「トレース・エクスプローラー」を選択します。  

![](2-6-001.png)

画面上部にある「APMドメイン」から、[6-2 APMドメインの作成](#6-2-apmドメインの作成)で作成したAPMドメインを選択します。  

![](2-6-002.png)

右側にある検索条件を「過去15分間」に選択し、「実行」ボタンをクリックします。  

![](2-6-003.png)

複数のトレース情報が表示されますので、「完了」と表示され、`Spans`が26となっている情報をクリックします。  

![](2-6-004.png)

以下のような詳細なトレース情報を取得できます。

![](2-6-005.png)
![](2-6-006.png)

赤枠の「oke-helidon-demo-frontend-UI: Ajax /medalist」をクリックすると、詳細なクライアント情報を取得できます。

![](2-6-007.png)

終了する場合は、「閉じる」ボタンをクリックします。

以上で、OCI APMを利用したトレーシングは完了です。  

### 2-7 OCI APMでのアプリケーションサーバのメトリクス監視

ここでは、OCI APMで監視できるアプリケーションサーバのメトリクスについて見ていきたいと思います。  

画面左上のプルダウンから「ダッシュボード」をクリックします。  

![](2-7-001.png)

ダッシュボードから「アプリケーション・サーバー」をクリックします。  

![](2-7-002.png)

左上に「アプリケーションサーバを選択します」というプルダウンがあるので、任意のアプリケーションサーバ(実体はHelidonのPod)を選択します。  

![](2-7-003.png) 

アプリケーションサーバ(今回はHelidon)のメトリクス情報が表示されます。  

![](2-7-004.png)

ここで取得したメトリクスをもとに、OCI MonitoringやOCI Notificationsと連携すると、一定の閾値を超過した際にアラーム通知を行うこともできます。  

**OCI MonitoringとOCI Notificationsについて**  
OCIにはリソース監視を行うOCI Monitoringがあり、OCI Notificationsと連携するとEmailやSlackなどに対してアラーム通知を行うことができます。  
これは、[4.Monitoring & Notifications](#4monitoring--notifications)で実施します。
{: .notice--info}

このように、OCI APMを利用すると詳細なトレーシングの取得と確認およびアプリケーションサーバのメトリクス監視を行うことができます。  

3.Logging
---------------------------------

Oracle Cloud Infrastructure（OCI）Loggingサービスは、スタック全体からのログの取り込み、管理および分析を簡素化する、完全に管理されたクラウドネイティブの分散ロギング・プラットフォームです。インフラストラクチャ、アプリケーション、監査、およびデータベースのログが1つのビューで管理できます。

実際に、構築したOKEクラスタ内のワーカー・ノードのコンピュート・インスタンスで実行されているアプリケーションのログを表示および検索します。

### 3-1 カスタム・ログの設定

OCI Loggingサービスを使用する上で必要となるポリシーを設定します。

#### 動的グループの作成

テナントのOICDが必要となるので取得します。

右上にある「プロファイル」アイコンをクリックして、「テナンシ」を選択します。

![](1-3-006.png)

「OICD」の「コピー」テキストをクリックして、テキストエディタにペーストしておきます。

![](3-1-015.png)

左上のハンバーガーメニューを展開して、「アイデンティティとセキュリティ」から「動的グループ」を選択します。

![](3-1-012.png)

「動的グループの作成」ボタンをクリックします。

![](3-1-013.png)

以下を設定します。

- 名前：logging-dynamic-group  
- 説明：logging-dynamic-group  

ルールについては以下を設定します。＜your-OCID＞ は事前に取得したOCIDを設定します。

```sh
instance.compartment.id = '<your-OCID>'
```

![](3-1-014.png)

#### ポリシー設定

左上のハンバーガーメニューを展開して、「アイデンティティとセキュリティ」から「ポリシー」を選択します。

![](3-1-001.png)

「ポリシーの作成」ボタンをクリックします。

![](3-1-002.png)

以下を設定します。

- 名前：logging
- 説明：logging

「手動エディタの表示」ボタンを右にスライドします。

以下のポリシーを設定します。

```sh
allow dynamic-group logging-dynamic-group to use log-content in tenancy
```

![](3-1-003.png)

「作成」ボタンをクリックします。

![](3-1-004.png)

以上で、ポリシーの設定は完了です。

#### カスタム・ログ設定

次に、カスタム・ログ設定をします。  
左上のハンバーガーメニューを展開して、「監視および管理」から「ログ」を選択します。

![](3-1-005.png)

「カスタム・ログの作成」ボタンをクリックします。

![](3-1-006.png)

「カスタム・ログ名」に「worker-node」と入力して、「新規グループの作成」をクリックします。

![](3-1-007.png)

「名前」に「handson_log」と入力します。

![](3-1-011.png)

「作成」ボタンをクリックします。

![](3-1-004.png)

「カスタム・ログの作成」ボタンをクリックします。

![](3-1-008.png)

「エージェント構成の作成」において、以下を設定します。

入力項目|入力内容
-|-
構成名 | worker-node  
説明|worker-node  
グループ・タイプ|動的グループ  
グループ|動的グループ  
入力タイプ|ログ・パス  
名前の入力|oke_cluster  
ファイル・パス|/var/log/containers/*

![](3-1-009.png)

「カスタム・ログの作成」ボタンをクリックします。

![](3-1-008.png)

リストに「woker-node」と表示されていることを確認します。

![](3-1-010.png)

### 3-2 ワーカーノード上のアプリケーションログの確認

設定した「woker-node」を選択して、ログを確認します。

「worker-node」をクリックします。

![](3-2-001.png)

以下のようにワーカーノード上のPod（コンテナ）から出力されるログが表示されます。

※設定してからログを取得するまで時間を要する場合があります。

![](3-2-002.png)

### 3-3 Kubernetes APIサーバーの監査ログの確認

クラスタで発生するアクティビティの背後にあるコンテキストを理解することは、多くの場合有用です。たとえば、誰がいつ何をしたかを識別することによって、コンプライアンス・チェックを実行したり、セキュリティの異常を識別したり、エラーをトラブルシューティングします。

OCIのAuditサービスを利用することで、以下の監査イベントを取得できます。

- OKEにおける作成や削除などのアクションをクラスタで実行するたびに監査イベントを発行します。
- Kubernetes APIサーバーにおけるkubectlなどのツールを使用してサービスの作成などの管理上の変更をクラスタに加えるたびに監査イベントを発行します。

OKEで実行された操作のログを確認します。

左上のハンバーガーメニューを展開して、「アイデンティティとセキュリティ」から「監査」を選択します。

![](3-3-001.png)

「キーワード」に「ClustersAPI」と入力して、「検索」ボタンをクリックします。

![](3-3-002.png)

以下のように表示されます。

![](3-3-003.png)

次に、Kubernetes APIサーバーによって実行された操作のログを確認します。

「キーワード」に「OKE API Server Admin Access」と入力して、「検索」ボタンをクリックします。

![](3-3-004.png)

以下のように表示されます。

![](3-3-005.png)

以上で、Kubernetes APIサーバーの監査ログの確認は完了です。

4.Monitoring & Notifications
---------------------------------

ここでは、OCI NotificationsとMonitoringを組み合わせて、アプリケーションのメトリクスが閾値を超えるとアラートが上がり、メール通知する仕組みを構築します。

### 4-1 Notificationsの設定

左上のハンバーガーメニューをクリックして、「開発者サービス」-「通知」を選択します。

![](4-1-001.png)

「トピックの作成」ボタンをクリックします。

![](4-1-002.png)

**トピックの名前について**  
トピックの名前はテナンシで一意になります。  
集合ハンズオンなど複数人で同一環境を共有されている皆様は、`oci-devops-handson-01`や`handson-tn`などの名前のイニシャルを付与し、名前が重複しないようにしてください。
{: .notice--warning}

「名前」に「oci-notifications」と入力します。

![](4-1-003.png)

「作成」ボタンをクリックします。

![](4-1-004.png)

「アクティブ」になることを確認します。

![](4-1-005.png)

以上でトピックの作成は完了です。

次に、サブスクリプションを作成します。

左メニュー「サブスクリプション」を選択します。

![](4-1-006.png)

「サブスクリプションの作成」ボタンをクリックします。

![](4-1-007.png)

「電子メール」にご自身のメールアドレスを入力します。

![](4-1-008.png)

「作成」ボタンをクリックします。

![](4-1-009.png)

設定したメールアドレスに、以下の内容のメールが届きます。「Confirm subscription」をクリックして、サブスクリプションを有効にします。

![](4-1-010.png)

![](4-1-011.png)

アクティブになっていることを確認します。  
アクティブになっていない場合は、ブラウザを更新してください。

![](4-1-012.png)

以上で、サブスクリプションの作成は完了です。

### 4-2 Monitoringの設定

後続手順で、サンプルアプリケーションに負荷をかけて、JVMのヒープサイズを上げます。  
ここでは、OCI Monitoringで閾値を設定して、その閾値を超えるとアラームが上がり、OCI Notificationsに設定したメールアドレスに通知されるように設定を行います。

左上のハンバーガーメニューをクリックして、「監視および管理」-「アラーム定義」を選択します。

![](4-2-001.png)

「アラームの作成」ボタンをクリックします。

![](4-2-002.png)

「アラームの定義」で以下を設定してます。

入力項目|入力内容
-|-
アラーム名 | heap-size
メトリック・ネームスペース|oracle_apm_monitoring
メトリック名|HeapUsed
統計|Max
ディメンション名|OkeClusterld
ディメンション値|表示されるClusterIDを選択
値|600000000
トピック|oci-notifications

![](4-2-003.png)

![](4-2-004.png)

「アラームの保存」ボタンをクリックします。

![](4-2-005.png)

以上で、「アラーム定義」の設定は完了です。

### 4-3 MonitoringとNotificationsの実践

サンプルアプリケーションに対して、過剰なアクセス負荷をかけます。そして、アラーム発生後にメールが通知されるように設定を行います。

最初に、負荷をかけるサーバを構築します。Jmeterという負荷テスト用のアプリケーションを利用して環境をセットアップします。

#### jmeterサーバの構築

左上のハンバーガーメニューをクリックして、「コンピュート」-「インスタンス」を選択します。

![](4-3-001.png)

「インスタンスの作成」ボタンをクリックします。

![](4-3-002.png)

「名前」に「jmeter」と入力します。

![](4-3-003.png)

次に、「イメージとシェイプ」の「編集」をクリックします。

![](4-3-004.png)

「Shape」の「Change Shape」ボタンをクリックします。

![](4-3-030.png)

以下の内容に設定をします。

入力項目|入力内容
-|-
シェイプ・シリーズ | AMD
Shape Name|VM.Standard.E4.Flex
OCPUの数|2
メモリー量(GB)|32

![](4-3-005.png)

「シェイプの選択」ボタンをクリックします。

![](4-3-006.png)

「ネットワーキング」で「編集」をクリックします。

![](4-3-031.png)

「ネットワーキング」で「新規仮想クラウド・ネットワークの作成」を選択します。

![](4-3-007.png)

「SSHキーの追加」で「秘密キーの保存」ボタンをクリックして、秘密鍵をダウンロードします。

![](4-3-008.png)

「作成」ボタンをクリックします。

![](4-3-009.png)

ログイン時に必要となる「パブリックIPアドレス」と「ユーザ名」を確認します。  
※テキストエディタにコピーペーストしておきます。

![](4-3-017.png)

#### jmeter環境のセットアップ

jmeter環境をセットアップするために、作成した仮想マシンにログインします。

Cloud Shell アイコンをクリックした、Cloud Shellを起動します。

![](4-3-010.png)

![](4-3-011.png)

最初に、ダウンロードした秘密鍵をCloud Shell上にアップロードします。

「Cloud Shell」メニューをクリックします。

![](4-3-012.png)

「アップロード」を選択します。

![](4-3-013.png)

「コンピュータから選択」をクリックして、ダウンロードした秘密鍵を選択します。

![](4-3-014.png)

「アップロード」ボタンをクリックします。

![](4-3-015.png)

「非表示」をクリックします。

![](4-3-016.png)

ホームディレクトリに移動します。

```sh
cd ~
```

秘密鍵のパーミッションを変更します。

```sh
chmod 400 ssh-key-xxxx-xx-xx.key
```

仮想マシンにログインします。事前に確認したユーザ名とパブリックIPアドレスを利用します。

```sh
ssh -i ssh-key-xxxx-xx-xx.key opc@xxx.xxx.xxx.xxx
```

yes と入力します。

```sh
FIPS mode initialized
The authenticity of host '132.226.236.71 (132.226.236.71)' can't be established.
ECDSA key fingerprint is SHA256:oACNnKKWu3R9WUi3xpYVnunWcIoEF8NL5LztfUqlZ74.
ECDSA key fingerprint is SHA1:z2sVFWORAMBlpeuUgHx5Ou4X1Cg.
Are you sure you want to continue connecting (yes/no)? yes
```

rootユーザにスイッチします。

```sh
sudo -i
```

java-openjdk をインストールします。

```sh
yum install -y java-1.8.0-openjdk
```

***コマンド結果***

```sh
~~~
Complete!
```

Jmeterをダウンロードします。

```sh
wget https://ftp.jaist.ac.jp/pub/apache/jmeter/binaries/apache-jmeter-5.4.3.tgz
```

***コマンド結果***

```sh
--2022-02-07 08:33:34--  https://ftp.jaist.ac.jp/pub/apache/jmeter/binaries/apache-jmeter-5.4.3.tgz
Resolving ftp.jaist.ac.jp (ftp.jaist.ac.jp)... 150.65.7.130, 2001:df0:2ed:feed::feed
Connecting to ftp.jaist.ac.jp (ftp.jaist.ac.jp)|150.65.7.130|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 70796171 (68M) [application/x-gzip]
Saving to: ‘apache-jmeter-5.4.3.tgz’

100%[=======================================================================================>] 70,796,171  5.71MB/s   in 12s    

2022-02-07 08:33:47 (5.49 MB/s) - ‘apache-jmeter-5.4.3.tgz’ saved [70796171/70796171]
```

アーカイブを展開します。

```sh
tar -zxvf apache-jmeter-5.4.3.tgz
```

作業ディレクトリを作成します。

```sh
mkdir test_work
```
「test_work」ディレクトリに移動します。

```sh
cd test_work
```

Jmeterのプロファイルを作成します。  
36行目にある「xxx.xxx.xxx.xxx」を[手順2-6](#2-6-oci-apmでのトレーシング)で確認したサンプルアプリケーションのエンドポイントに書き換えます。

```sh
vim testplan.jmx
```

```sh
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.4.3">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Test Plan" enabled="true">
      <stringProp name="TestPlan.comments"></stringProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.tearDown_on_shutdown">true</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
        <collectionProp name="Arguments.arguments"/>
      </elementProp>
      <stringProp name="TestPlan.user_define_classpath"></stringProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Thread Group" enabled="true">
        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
          <boolProp name="LoopController.continue_forever">false</boolProp>
          <intProp name="LoopController.loops">-1</intProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">80000</stringProp>
        <stringProp name="ThreadGroup.ramp_time">60</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration"></stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
      </ThreadGroup>
      <hashTree>
        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="HTTP Request" enabled="true">
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
            <collectionProp name="Arguments.arguments"/>
          </elementProp>
          <stringProp name="HTTPSampler.domain">xxx.xxx.xxx.xxx</stringProp>
          <stringProp name="HTTPSampler.port"></stringProp>
          <stringProp name="HTTPSampler.protocol">http</stringProp>
          <stringProp name="HTTPSampler.contentEncoding"></stringProp>
          <stringProp name="HTTPSampler.path">/medalist</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
          <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
          <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
          <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
          <stringProp name="HTTPSampler.embedded_url_re"></stringProp>
          <stringProp name="HTTPSampler.connect_timeout"></stringProp>
          <stringProp name="HTTPSampler.response_timeout"></stringProp>
        </HTTPSamplerProxy>
        <hashTree/>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>

```

負荷をかけます。止める場合は、「Ctrl + C」で停止できます。

```sh
JVM_ARGS="-Xms12G -Xmx12G"  ../apache-jmeter-5.4.3/bin/jmeter -n -t ./testplan.jmx -l ./testplan.jtl -e -o html_repo_testplan
```

途中でエラーで停止する場合は、以下コマンドで「testplan.jtl」ファイルを削除して、負荷をかけなおしてください。

```sh
rm -rf testplan.jtl
```

```sh
JVM_ARGS="-Xms12G -Xmx12G"  ../apache-jmeter-5.4.3/bin/jmeter -n -t ./testplan.jmx -l ./testplan.jtl -e -o html_repo_testplan
```

#### 状況の確認

負荷の状況を確認します。

左上のハンバーガーメニューをクリックして、「監視および管理」-「アラーム定義」を選択します。

![](4-3-018.png)

「heap-size」をクリックします。

![](4-3-019.png)

赤い破線が設定した閾値となります。この閾値を超えるとアラームが上がって、メールで通知されます。

![](4-3-020.png)

![](4-3-032.png)

アラームと通知を停止する場合は、「アラームは有効です」のチェックを外します。

![](4-3-021.png)

APMからも状況を確認します。

左上のハンバーガーメニューをクリックして、「監視および管理」-「ダッシュボード」を選択します。

![](4-3-022.png)

「アプリケーション・サーバー」をクリックします。

![](4-3-023.png)

APMドメインのプルダウンメニューから「oke-handson-apm」を選択します。

![](4-3-024.png)

対象となるPod名「frontend-app-xxxxxxxxxx-xxxxx」を確認します。

```sh
kubectl get pods
```

***コマンド結果***

```sh
NAME                              READY   STATUS    RESTARTS   AGE
・
・
・
frontend-app-56f7cfcb74-gpqh8     1/1     Running   0          23h
```

プルダウンメニューから確認した対象のPodを選択します。

![](4-3-025.png)

デフォルトでは、「過去60分間」の状況を確認できます。負荷をかけることで「ヒープ使用状況」の数値があがります。「ヒープ使用状況」では、時系列で状況を確認できます。

![](4-3-026.png)

右上にあるプルダウンメニューから過去の時間で確認できます。「カスタム」を選択すると、任意の時間を設定できます。

![](4-3-027.png)

設定する場合は、時間を指定後、「OK」ボタンをクリックします。

![](4-3-028.png)

通知としては、以下のメールが届きます。

![](4-3-029.png)

以上でハンズオンは終了です。お疲れ様でした！
