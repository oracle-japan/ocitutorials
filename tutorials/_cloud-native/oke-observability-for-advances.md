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
    4. サンプルアプリケーションへのAPM設定(ブラウザ側)とコンテナイメージ作成
    5. サンプルアプリケーションへのAPM設定(サーバサイド側)
    6. OCI APMでのトレーシング
    7. OCI APMでのアプリケーションサーバのメトリクス監視
    8. OCI APMでのリアルユーザモニタリング(RUM)
    9. OCI APMでの可用性モニタリング(Availability Monitoring)

3. Logging
    1. カスタム・ログの設定
    2. ワーカーノード上のアプリケーションログの確認
    3. Kubernetes APIサーバーの監査ログの確認

4. Monitoring & Notifications
    1. Notificationsの設定
    2. Monitoringの設定
    3. MonitoringとNotificationsの実践

5. 今回利用したサンプルアプリケーションの補足説明

---

ハンズオン概要図は以下となります。全環境の構築及びセットアップを行いながら、赤字で記載されている操作を実施します。

![](0-0-000.png)

1.OKEクラスタ構築とOCIRセットアップ
---------------------------------

Kubernetesクラスタの構築とコンテナイメージを格納するOCIRのセットアップを行います。

![](1-1-000.png)

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
OCIでは、Oracle Cloud Infrastructure Registry(OCIR)を利用します。

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

「テナンシ詳細」の「オブジェクト・ストレージ・ネームスペース」の赤枠箇所をコピーして、テキストエディタにペーストしておきます。

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

Kubernetesクラスタ上にサンプルマイクロサービスアプリケーションのデプロイとAPMのセットアップを行い、トレーシング、アプリケーションサーバのメトリクス監視、リアルユーザモニタリング、可用性モニタリングを実践します。

![](2-1-000.png)

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
  また、このアプリケーションにはApplication Performance Monitoringで利用するAPM Browser AgentとAPM Server Agentが含まれています。

- **バックエンドアプリケーション(図中の緑枠部分)**  
  Helidonから構成されているアプリケーションです。
  このアプリケーションには3つのバージョンが存在し、それぞれ金メダメリスト(v3)、銀メダリスト(v2)、銅メダリスト(v1)の一覧を返すようになっています。 
  バージョン情報は環境変数として保持しています。
  このアプリケーションは、データソースアプリケーションに対してバージョンに応じたAPIエンドポイントを呼び出し、データを取得しにいきます。  
  また、このアプリケーションにはApplication Performance Monitoringで利用するAPM Server Agentが含まれています。

- **データソースアプリケーション(図中の`Medal Info`)**  
  Helidonとインメモリで動作しているデータベースである[H2 Database](https://www.h2database.com/html/main.html)から構成されているアプリケーションです。  
  このアプリケーションでは、メダリストと獲得したメダルの色を保持しており、バックエンドアプリケーションから呼び出されたエンドポイント応じてメダリストとそのメダルの色を返却します。  
  また、このアプリケーションにはApplication Performance Monitoringで利用するAPM Server Agentが含まれています。

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

### 2-4 サンプルアプリケーションへのAPM設定(ブラウザ側)とコンテナイメージ作成

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
変更箇所1 | [2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録した「データ・アップロード・エンドポイント」|
変更箇所2|[2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録したデータ・キーの「パブリック」キー|**プライベートキーではなく、パブリックキーとなるので注意してください。**
変更箇所3|staticより前の部分`https～.com`までを[2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録した「データ・アップロード・エンドポイント」を設定します。

更新後、「:wq」でエディタを保存終了します。

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

次に、プッシュしたコンテナイメージを利用するように、Mainifestを編集します。  

Manifestのあるディレクトリに移動します。  

```sh
cd ~
```

```sh
cd code-at-customer-handson/k8s/app/for-oci-apm
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
        image: iad.ocir.io/orasejapan/frontend-app-apm #変更箇所
        ports:
        - containerPort: 8082
        env:
        - name: tracing.data-upload-endpoint
          valueFrom:
            secretKeyRef:
              name: apm-secret
              key: endpoint
        - name: tracing.private-data-key
          valueFrom:
            secretKeyRef:
              name: apm-secret
              key: private-key
~~~
```

以下の項目を変更します。

変更前|変更内容
-|-
iad.ocir.io/orasejapan/frontend-app-apm(22行目) | iad.ocir.io/＜your-object-storage-namespace＞/frontend-app-apm

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
        image: iad.ocir.io/＜your-object-storage-namespace＞/frontend-app-apm
        ports:
        - containerPort: 8082
        env:
        - name: tracing.data-upload-endpoint
          valueFrom:
            secretKeyRef:
              name: apm-secret
              key: endpoint
        - name: tracing.private-data-key
          valueFrom:
            secretKeyRef:
              name: apm-secret
              key: private-key
```

編集後、「:wq」で内容を保存します。

以上で、サンプルアプリケーションへのAPM設定(ブラウザ側)とコンテナイメージ作成は完了です。

### 2-5 サンプルアプリケーションへのAPM設定(サーバサイド側)

次に、サンプルアプリケーションへのAPM設定(サーバサイド側)がAPMに対してトレース情報やメトリクスをアップロードできるようにエンドポイントとプライベート・データキーをSecretとして設定します。  
Cloud Shellから以下のコマンドを実行します。  
`APMエンドポイント`と`「データ・キー」の「プライベート」キー`はそれぞれ以下の値に差し替えます。  

**Secretについて**  
Secretリソースについては[こちら](https://kubernetes.io/docs/concepts/configuration/secret/)をご確認ください。
{: .notice--info}

項目|設定内容|備考
-|-
APMエンドポイント|[2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録した「データ・アップロード・エンドポイント」|
「データ・キー」の「プライベート」キー|[2-3 APMドメインの作成](#2-3-apmドメインの作成)で記録したデータ・キーの「プライベート」キー|**パブリックキーではなく、プライベートキーとなるので注意してください。**

```sh
kubectl create secret generic apm-secret \
--from-literal=endpoint=<APMエンドポイント> \
--from-literal=private-key=<「データ・キー」の「プライベート」キー>
```

***コマンド結果***

```sh
secret/apm-secret created
```

各アプリケーションでは、このSecret(`apm-secret`)を参照する設定を入れているので、設定したエンドポイントとデータキーを元にAPMにアプリケーションのトレース情報やメトリクスをアップロード可能になります。
詳細は[5.今回利用したサンプルアプリケーションの補足説明](#5今回利用したサンプルアプリケーションの補足説明)をご確認ください。

これでサンプルアプリケーションへのAPM設定(サーバサイド側)は完了です。  

{% capture notice %}**HelidonアプリケーションでのOCI APMの利用**  
今回はHelidonを利用したアプリケーションですが、[HelidonにはOCI APM専用のエージェント](https://docs.oracle.com/ja-jp/iaas/application-performance-monitoring/doc/use-apm-tracer-helidon.html)が用意されています。  
基本的には、`pom.xml`に以下の依存関係を追加するだけで利用可能です。(アプリケーション側の変更は必要ありません)  
また、必要に応じて`src/main/resources/META-INF/microprofile-config.properties`に設定値を追加します。  

  ```xml
        <dependency> 
            <groupId>io.helidon.microprofile.tracing</groupId> 
            <artifactId>helidon-microprofile-tracing</artifactId> 
        </dependency>
        <dependency>
            <groupId>com.oracle.apm.agent.java</groupId>
            <artifactId>apm-java-agent-helidon3</artifactId>
            <version>[1.8.3326,)</version>
        </dependency>
        <dependency>
            <groupId>com.oracle.apm.agent.java</groupId>
            <artifactId>apm-java-agent-tracer</artifactId>
            <version>[1.8.3326,)</version>
        </dependency>
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
cd code-at-customer-handson/k8s/app/for-oci-apm
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
frontend-app   LoadBalancer   10.96.220.188   193.122.***.***   80:31664/TCP   41s
```

上記の場合は、frontend-app Serviceの`EXTERNAL-IP`である`193.122.***.***`がエンドポイントになります。

この場合は、以下のURLにアクセスします。  
`http://193.122.***.***`

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

### 2.8 （オプション）OCI APMおよびOpenTelemetryを利用したコンテナアプリケーションのトレーシング、メトリクス監視

**[2-7　OCI APMでのアプリケーションサーバのメトリクス監視](#2-7-oci-apmでのアプリケーションサーバのメトリクス監視)でのトレーシング**  
[2-7　OCI APMでのアプリケーションサーバのメトリクス監視](#2-7-oci-apmでのアプリケーションサーバのメトリクス監視)では、`apm-java-agent-helidon`および`apm-java-agent-tracer`というライブラリを利用したトレーシングでした。  
ここでは、トレーシング、メトリクス監視を実現する他の手段の一つとして、OpenTelemetryを利用したOCI APMでのトレーシングをご紹介します。
{: .notice--info}

OpenTelemetryは、OTelとも呼ばれ、ベンダーニュートラルなオープンソースの可観測性フレームワークです。  
metrics、traces、logsなどのデータを検出、生成、収集、およびエクスポートするために使用されます。  

ここでは、OKEクラスタにGo言語で開発したサンプル・アプリケーションをデプロイし、OCIのAPMとOpenTelemetryを使用して、Goのサンプル・アプリケーションのmetricsとtracesを収集及び表示する方法について説明します。  

**OpenTelemetryとサポート言語について**  
OpenTelemetryはさまざまな言語に対応していますが、まだ開発段階のものや実験段階のものも多々あります。  
それぞれの言語がOpenTelemetryに対応しているかどうかは[こちら](https://opentelemetry.io/docs/languages/)をご確認ください。
{: .notice--info}

#### 2.8-1 OpenTelemetryのインストールとデプロイ

OpenTelemetryを実装するには、Collector(DaemonSet CollectorとDeployment Collector)が必要です。

これらのインストールはHelmを利用して実施します。  
HelmはすでにCloud Shellにインストールされていますので、OpenTelemetry Collectorをインストールするためのレポジトリを追加しておきます。  

```sh
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
```

#### 2.8-2 DaemonSet Collectorのインストール

DaemonSet CollectorはDaemonSet(各Nodeに必ず1つだけ配置されるコンテナ)で実行されるで実行されるCollectorです。  

DaemonSet Collectorには、以下のコンポーネントが含まれています：

- [OTLP Receiver](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver)：アプリケーションのtraces、metrics、logsを収集する
- [Kubernetes Attributes Processor](https://opentelemetry.io/docs/kubernetes/collector/components/#kubernetes-attributes-processor)：Kubernetesのメタデータをテレメトりデータ(監視データ)に追加する
- [Kubeletstats Receiver](https://opentelemetry.io/docs/kubernetes/collector/components/#kubeletstats-receiver)：kubeletのAPIサーバーからNode、Pod、コンテナのメトリクスを取得する
- [Filelog Receiver](https://opentelemetry.io/docs/kubernetes/collector/components/#filelog-receiver)：Kubernetesのログおよびアプリケーションログを標準出力/標準エラー出力に書き込む。

インストールにはvalues.yamlファイルが必要で、以下のように構成されます。

- 設定ファイル内のエンドポイント・アドレスとAuthorizationのプライベートキーを、ご自身の情報に置き換えてください。
- Authorizationは`dataKey + " " + プライベートキー`の形式で構成されます。
- エンドポイント・アドレスとプライベートキーの取得方法は、[2-3 APMドメインの作成](#2-3-apmドメインの作成)をご確認ください。

{% capture notice %}**values.yamlに設定するAPMエンドポイント**  
各Collectorのインストール時に設定する`values.yaml`にはデータの投げ先であるexport先を指定できます。  
OpenTelemetryでは、このエクスポート先を切り替えることによってOpenTelemetryをサポートする監視系SaaSやクラウドサービスを利用できます。  
ここでは、OCI APMが持つAPMエンドポイントを指定します。  
APMではメトリクスとトレースそれぞれに以下の2つのエンドポイントを提供します。  
`/metrics`と`/traces`はCollector側でそれぞれ自動的に付与して、アップロードします。  
  - https://<データ・アップロード・エンドポイント>/20200101/opentelemetry/metrics
  - https://<データ・アップロード・エンドポイント>/20200101/opentelemetry/traces
{% endcapture %}
<div class="notice--info">
  {{ notice | markdownify }}
</div>

```yaml
mode: daemonset
  
presets:
  # enables the k8sattributesprocessor and adds it to the traces, metrics, and logs pipelines
  kubernetesAttributes:
    enabled: true
  # enables the kubeletstatsreceiver and adds it to the metrics pipelines
  kubeletMetrics:
    enabled: true

image:
  repository: "otel/opentelemetry-collector-k8s"

resources:
  limits:
    cpu: 250m
    memory: 512Mi

config:
  exporters:
    otlphttp:
      endpoint: "https://<データ・アップロード・エンドポイント>/20200101/opentelemetry"
      headers:
        Authorization: "dataKey <「データ・キー」の「プライベート」キー>"
  service:
    pipelines:
      metrics:
        exporters: [ otlphttp ]
      traces:
        exporters: [ otlphttp ]
```

以下のコマンドを実行して、DaemonSet Collectorをインストールします。

```sh
helm install otel-collector open-telemetry/opentelemetry-collector --values values.yaml
```

これで、DaemonSet Collectorをインストールは完了です。

#### 2.8-3 Deployment Collectorのインストール

ここでは、Deployment Collectorのインストールを実施します。  

Deployment Collectorには、以下のコンポーネントが含まれています。

- [Kubernetes Cluster Receiver](https://opentelemetry.io/docs/kubernetes/collector/components/#kubernetes-cluster-receiver)：クラスタ全体のmetricsとeventsを収集する
- [Kubernetes Objects Receiver](https://opentelemetry.io/docs/kubernetes/collector/components/#kubernetes-objects-receiver)：Kubernetes APIサーバーからobjectsを収集する

インストールにはvalues-cluster.yaml（values.yamlと区別するために違う名称を使用）が必要で、以下のように構成されます。

- 設定ファイル内のエンドポイント・アドレスとAuthorizationのプライベートキーを、実際の情報に置き換えてください。
- Authorizationは`dataKey + " " + プライベートキー`の形式で構成されます。
- エンドポイント・アドレスとプライベートキーの取得方法は、[2-3 APMドメインの作成](#2-3-apmドメインの作成)をご確認ください。


```yaml
mode: deployment
  
replicaCount: 1

presets:
  # enables the k8sclusterreceiver and adds it to the metrics pipelines
  clusterMetrics:
    enabled: true
  # enables the k8sobjectsreceiver to collect events only and adds it to the logs pipelines
  kubernetesEvents:
    enabled: true
  
image:
  repository: "otel/opentelemetry-collector-k8s"

resources:
  limits:
    cpu: 250m
    memory: 512Mi

config:
  exporters:
    otlphttp:
      endpoint: "https://<データ・アップロード・エンドポイント>/20200101/opentelemetry"
      headers:
        Authorization: "dataKey <「データ・キー」の「プライベート」キー>"
  service:
    pipelines:
      metrics:
        exporters: [ otlphttp ]
      traces:
        exporters: [ otlphttp ]
```

以下のコマンドを実行して、Deployment Collectorをインストールします。

```sh
helm install otel-collector-cluster open-telemetry/opentelemetry-collector --values values-cluster.yaml
```

これで、Deployment Collectorをインストールは完了です。  

#### 2.8-4 インストール結果の確認

インストール結果を確認します。  
以下の2つのpodが正常に稼働されていることを確認します。(末尾のハッシュ値は異なっていて問題ありません)

```sh
# kubectl get pod|grep otel
otel-collector-cluster-opentelemetry-collector-6f68f78f9c-2qsjn   1/1     Running   1              2d
otel-collector-opentelemetry-collector-agent-zthfv                1/1     Running   1              2d1h
```

これらのPodの起動により、メトリクスがOCI APMにアップロードされ始めます。

実際に確認してみましょう。  

OCI 監視および管理のメトリック・エクスプローラに移動して、metrics情報を確認します。

![](option1.png)

開始時間・終了時間及びご使用するコンパートメントを選択して、`namespace`では`oracle-apm-monitoring`を選択してください。

![](option2.png)

#### 2.8-5 Goのサンプル・アプリケーションのデプロイと動作確認

最後に、OKEクラスタにGo言語で開発したサンプル・アプリケーションをデプロイし、メトリクスが取得できることを確認します。  

サンプル・アプリケーション[ochacafe-faststart-go](https://github.com/oracle-japan/ochacafe-faststart-go)を例として、OKEクラスタにデプロイします。

このサンプル・アプリケーションにはトレースデータをOCIのAPIエンドポイントにエクスポートするサンプル・コードが含まれています。

![](option13.png)

このサンプルアプリケーションはGo言語で実装され、OCIのマネージドなPostgreSQLサービスであるOCI Database with PostgreSQLをデータベースとするアプリケーションです。

このアプリケーションのセットアップ手順は[README.md](https://github.com/oracle-japan/ochacafe-faststart-go/blob/main/README.md)をご確認ください。

セットアップが完了すると、プロジェクトに含まれる[app.yaml](https://github.com/oracle-japan/ochacafe-faststart-go/blob/main/k8s/app.yaml)を使用して、Goのサンプル・アプリケーションをデプロイできます。  

```sh
kubectl apply -f app.yaml
```

しばらく待ってから、Service EXTERNAL-IPのIPアドレスが取得されます。

```sh
# kubectl get svc golang-demo-lb
NAME            TYPE           CLUSTER-IP        EXTERNAL-IP       PORT(S)        AGE
golang-demo-lb  LoadBalancer   xxx.xxx.xxx.xxx   xxx.xxx.xxx.xxx   80:32344/TCP   10m
```

ブラウザで`http://EXTERNAL-IP`に移動して、メトリクスとトレースの情報を作成するために、ページを何度かリフレッシュします。

![](option14.png)

OCIコンソールのAPMでトレース情報を確認します。 

![](option3.png)

APMドメインと時間帯を選択します。 

![](option4.png)

対応するレコードを選択すると、サービスの詳細が表示されます。 

![](option5.png)

現在、メトリクスとトレーシングはそれぞれMonitoringとAPMの2つのサービスで確認できます。

統一的に監視するために、APMのダッシュボードでカスタム監視ダッシュボードを作成することができます。 

OCI コンソールで"ダッシュボード"を選択して、"ダッシュボードの作成"をクリックします。 

![](option6.png)

"ウィジェット"を選択し、"ウィジェットの作成"をクリックします。 

![](option7.png)

"+"をクリックして、データを追加します。

![](option8.png)

Namespaceでoracle-apm-monitoringを選択します。 

![](option9.png)
左側に必要なmetricsをドラッグして、"Y axis"の右側に移動し、"適用"をクリックします。 


![](option10.png)

トレースデータを追加するには、上記の手順を繰り返して、APM Widgetsで関係するオプションを選択します。

下図のように表示されます。

![](option11.png)

これで、同一インターフェースでメトリクスとトレースデータが表示されるようになります。
下図のように、ここではコンテナのmetricsやアプリケーションのトレース情報を確認できます。

![](option12.png)

**ログについて**  
ここではGoで実装されたサンプルアプリケーションでのトレーシングとメトリクスの監視方法について見てきましたが、ログについては、後続の[3.Logging](#3logging)に記載の方法で同様に確認できます。
{: .notice--info}

### 2-9 OCI APMでのリアルユーザモニタリング(RUM)

ここでは、OCI APMのAPM Browser Agentを利用したリアルユーザモニタリング(RUM)について見ていきたいと思います。

リアルユーザモニタリング(RUM)は、Webページのパフォーマンスを実ユーザのPCもしくはスマートフォンからのアクセスを元に計測・分析するものです。  

**フロントエンドのパフォーマンス・モニタリングについて**  
フロントエンドのパフォーマンス・モニタリングには、「リアルユーザモニタリング(RUM)」と「可用性モニタリング(Availability Monitoring)」の2種類があります。  
この2種類のパフォーマンス・モニタリングは補完的な関係にあり、通常は併用をすることで効果的なモニタリングが可能となります。
OCI APMでは、この2種類のパフォーマンス・モニタリングをいずれも利用可能です。
{: .notice--info}

画面左上のプルダウンから「ダッシュボード」をクリックします。  

![](2-7-001.png)

ダッシュボードから「リアル・ユーザー・モニタリング」をクリックします。  

![](2-8-001.png)

左上に「Webアプリケーションを選択します」というプルダウンがあるので、`OracleJetApp`を選択します。  

![](2-8-002.png)

**Webアプリケーションについて**  
今回のハンズオン環境では、`OracleJetApp`と`All Web Applications`という2種類のWebアプリケーションが表示されていますが、今回のサンプルアプリケーションは1つのみなので、どちらを選択しても表示される情報に変わりはありません。
{: .notice--info}

お手元に別のブラウザやスマートフォンなどがある方は、そのブラウザや端末からサンプルアプリケーションにアクセス後に右上の検索条件を「過去15分間」に再設定してみてください。
![](2-8-004.png)

以下のようなページが表示され、アクセス元のジオロケーションやApdex、ブラウザの種類、OSの情報などが表示されていることが確認できます。  
![](2-8-003.png)

**Apdexについて**  
リアル・ユーザー・モニタリングの項目にある`Apdex`とは、Webアプリケーションやサービスのレスポンスタイムについて、ユーザー満足度を計測するための業界標準の指標です。  
Satisfiedを1点、Toleratingを0.5点、Frustratedを0点としてその平均値を算出し、最高は1点最低は0点として表現されます。  
詳細は[こちら](https://www.apdex.org/index.php/documents/)をご確認ください。  
この指標はSLA(サービス品質保証)にも用いられています。
{: .notice--info}

このように、OCI APMでは、APM Browser Agentを利用したリアルユーザモニタリング(RUM)を行うことができます。  

### 2-10 OCI APMでの可用性モニタリング(Availability Monitoring)

ここでは、OCI APMを利用した可用性モニタリング(Availability Monitoring)について見ていきたいと思います。

可用性モニタリング(Availability Monitoring)は、地理的に分散したエージェントを使用して、能動的に対象のWebサイトにアクセスして監視や計測する手法です。  

左上のプルダウンから「可用性モニタリング」をクリックします。  

![](2-9-001.png)

左メニューから「リソース」をクリックします。

![](2-9-012.png)

「モニターの作成」をクリックします。ここで、可用性モニタリングを実施するためのモニター・エージェントを作成します。  

![](2-9-007.png)

以下の項目を入力し、「次」をクリックします。  

![](2-9-002.png)

入力項目|入力内容|取得元
-|-
名前 | oke-handson-apm
タイプ|Browser
ベースURL|[2-6 OCI APMでのトレーシング](#2-6-oci-apmでのトレーシング)で確認したサンプルアプリケーションのIPアドレス

以下の項目を入力し、「次」をクリックします。

![](2-9-003.png)

入力項目|入力内容|取得元
-|-
バンテージ・ポイント | Japan East(Tokyo) / US East(Ashburn)
間隔|1回実行

**バンテージ・ポイントについて**  
ここで設定する`バンテージ・ポイント`とは、モニタリングテストを実行する地理的な位置を指します。  
{: .notice--info}

**間隔について**  
一定間隔で自動的にモニタリングテストを実行したい場合は、何分間隔で実行するかを指定できます。
{: .notice--info}

そのまま「次」をクリックします。  

![](2-9-013.png)

そのまま「次」をクリックします。  

![](2-9-004.png)

そのまま「作成」をクリックします。  

![](2-9-005.png)

以下の画面が表示されます。  

![](2-9-006.png)

それでは、モニタリングテストを実行してみます。  

「1回実行」をクリックします。  

![](2-9-008.png)

「Run」をクリックします。  

![](2-9-014.png)

実行が完了すると、画面左側の「リソース」にある「履歴」から実行結果が確認できます。  

![](2-9-009.png)

`バンテージ・ポイント`「Japan East (Tokyo)」の右側にあるケバブメニューから「HARの表示」をクリックします。  

![](2-9-011.png)

以下のようにモニタリングテストの実行結果が表示されます。

![](2-9-010.png)

このように、OCI APMでは可用性モニタリング(Availability Monitoring)を行うことができます。  

3.Logging
---------------------------------

Loggingサービスのセットアップを行って、ワーカーノードのアプリケーションログとAPIサーバの監査ログを確認します。

![](3-1-000.png)

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

入力項目|入力内容
-|-
名前|logging-dynamic-group
説明|logging-dynamic-group

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

入力項目|入力内容
-|-
名前|logging
説明|logging

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
グループ|logging-dynamic-group
入力タイプ|ログ・パス  
名前の入力|oke_cluster  
ファイル・パス|/var/log/containers/*

![](3-1-009.png)

「カスタム・ログの作成」ボタンをクリックします。

![](3-1-008.png)

リストに「woker-node」と表示されていることを確認します。  
※表示されない場合は、他のページに遷移するなどブラウザを更新してください。

![](3-1-010.png)

### 3-2 ワーカーノード上のアプリケーションログの確認

設定した「woker-node」を選択して、ログを確認します。

「worker-node」をクリックします。

![](3-2-001.png)

以下のようにワーカーノード上のPod（コンテナ）から出力されるログが表示されます。  
設定してからログを取得するまで時間を要する場合があります。

![](3-2-002.png)

### 3-3 Kubernetes APIサーバーの監査ログの確認

クラスタで発生するアクティビティの背後にあるコンテキストを理解することは、多くの場合有用です。たとえば、誰がいつ何をしたかを識別することによって、コンプライアンス・チェックを実行したり、セキュリティの異常を識別したり、エラーをトラブルシューティングします。

OCIのAuditサービスによって、Kubernetes APIサーバーでkubectlなどのツールを使ってサービス作成などの管理変更を行うたびに、監査イベントが発行されます。

左上のハンバーガーメニューを展開して、「アイデンティティとセキュリティ」から「監査」を選択します。

![](3-3-001.png)

Kubernetes APIサーバーによって実行された操作のログを確認します。

「キーワード」に「OKE API Server Admin Access」と入力して、「検索」ボタンをクリックします。

![](3-3-004.png)

以下のように表示されます。

![](3-3-005.png)

以上で、Kubernetes APIサーバーの監査ログの確認は完了です。

4.Monitoring & Notifications
---------------------------------

OCI NotificationsとMonitoringを組み合わせて、アプリケーションのメトリクスが閾値を超えるとアラートが上がり、メール通知する仕組みを構築します。

![](4-1-000.png)

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
値|200000000
トリガ遅延分数| 1
トピック|oci-notifications

![](4-2-003.png)

![](4-2-006.png)

![](4-2-004.png)

「アラームの保存」ボタンをクリックします。

![](4-2-005.png)

以上で、「アラーム定義」の設定は完了です。

### 4-3 MonitoringとNotificationsの実践

サンプルアプリケーションに対して、過剰なアクセス負荷をかけます。そして、アラーム発生後にメールが通知されるように設定を行います。

最初に、負荷をかけるサーバを構築します。JMeterという負荷テスト用のアプリケーションを利用して環境をセットアップします。

#### JMeterサーバの構築

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

#### JMeter環境のセットアップ

JMeter環境をセットアップするために、作成した仮想マシンにログインします。

Cloud Shell アイコンをクリックして、Cloud Shellを起動します。

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
ssh -i ssh-key-xxxx-xx-xx.key opc@***.***.***.***
```

yes と入力します。

```sh
FIPS mode initialized
The authenticity of host '132.226.***.*** (132.226.***.***)' can't be established.
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

JMeterをダウンロードします。

```sh
wget https://dlcdn.apache.org/jmeter/binaries/apache-jmeter-5.6.3.tgz
```

***コマンド結果***

```sh
--2024-04-22 03:51:11--  https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.tgz
Resolving dlcdn.apache.org (dlcdn.apache.org)... 151.101.2.132, 2a04:4e42::644
Connecting to dlcdn.apache.org (dlcdn.apache.org)|151.101.2.132|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 87414762 (83M) [application/x-gzip]
Saving to: ‘apache-jmeter-5.6.3.tgz’

apache-jmeter-5.6.3.tgz                   100%[====================================================================================>]  83.36M   350MB/s    in 0.2s    

2024-04-22 03:51:11 (350 MB/s) - ‘apache-jmeter-5.6.3.tgz’ saved [87414762/87414762]
```

アーカイブを展開します。

```sh
tar -zxvf apache-jmeter-5.6.3.tgz
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

36行目にある`***.***.***.***`を[手順2-6](#2-6-oci-apmでのトレーシング)で確認したサンプルアプリケーションのエンドポイントに書き換えます。

```sh
vim testplan.jmx
```

```sh
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.2">
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
          <stringProp name="HTTPSampler.domain">***.***.***.***</stringProp>
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
JVM_ARGS="-Xms12G -Xmx12G"  ../apache-jmeter-5.6.3/bin/jmeter -n -t ./testplan.jmx -l ./testplan.jtl -e -o html_repo_testplan
```

途中でエラーで停止する場合は、以下コマンドで「testplan.jtl」ファイルを削除して、負荷をかけなおしてください。

```sh
rm -rf testplan.jtl
```

```sh
JVM_ARGS="-Xms12G -Xmx12G"  ../apache-jmeter-5.6.3/bin/jmeter -n -t ./testplan.jmx -l ./testplan.jtl -e -o html_repo_testplan
```

{% capture notice %}**Jmeter起動時のエラーについて**  
Computeで利用可能なメモリの状態によって、以下のようなエラーが発生する場合があります。  

```sh
JVM_ARGS="-Xms12G -Xmx12G"  ../apache-jmeter-5.6.2/bin/jmeter -n -t ./testplan.jmx -l ./testplan.jtl -e -o html_repo_testplan
OpenJDK 64-Bit Server VM warning: INFO: os::commit_memory(0x00000004f0800000, 12884901888, 0) failed; error='Cannot allocate memory' (errno=12)
#
# There is insufficient memory for the Java Runtime Environment to continue.
# Native memory allocation (mmap) failed to map 12884901888 bytes for committing reserved memory.
# An error report file with more information is saved as:
# /home/tniita_obs/test_work/hs_err_pid5725.log
```

上記のエラーが発生した場合は、ヒープサイズを以下のように`8G`にして実行してください。  

```sh
JVM_ARGS="-Xms8G -Xmx8G"  ../apache-jmeter-5.6.2/bin/jmeter -n -t ./testplan.jmx -l ./testplan.jtl -e -o html_repo_testplan
```
{% endcapture %}
<div class="notice--warning">
  {{ notice | markdownify }}
</div>

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

5.今回利用したサンプルアプリケーションの補足説明
---------------------------------

ここでは、今回のサンプルアプリケーションでのAPM設定に関する補足説明を行います。　　

今回のサンプルアプリケーションでは、APMの設定として以下の2点を実施しました。  

- APM Browser Agentのエンドポイントとパブリック・データキーを`index.html`に設定(その後、コンテナイメージをビルド/プッシュ)
- APM Server Agentのエンドポイントとプライベート・データキーをSecretリソースとして設定

ここでの補足説明は主に2点目について見ていきます。  

今回利用したManifestを見ていきましょう。

まずは、フロントエンドアプリケーションのManifestを確認します。
ここでは、Deploymentリソースだけ抜粋します。　　

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
        image: iad.ocir.io/orasejapan/frontend-app-apm
        ports:
        - containerPort: 8082
        env:
        - name: tracing.data-upload-endpoint
          valueFrom:
            secretKeyRef:
              name: apm-secret
              key: endpoint
        - name: tracing.private-data-key
          valueFrom:
            secretKeyRef:
              name: apm-secret
              key: private-key
```

25行目〜35行目に注目してみましょう。

```yaml
~~~
        env:
        - name: tracing.data-upload-endpoint
          valueFrom:
            secretKeyRef:
              name: apm-secret
              key: endpoint
        - name: tracing.private-data-key
          valueFrom:
            secretKeyRef:
              name: apm-secret
              key: private-key
```

APMのエンドポイントとプライベート・データキーを`tracing.data-upload-endpoint`、`tracing.private-data-key`という環境変数名でSecretリソースから読み込んでいます。  
ここで指定しているSecretリソースは、[2-5 サンプルアプリケーションへのAPM設定(サーバサイド側)](#2-5-サンプルアプリケーションへのapm設定サーバサイド側)で作成したものです。  

アプリケーション側(Helidon)では、APM Server Agentがこの環境変数を読み込み、APMに対してトレース情報やメトリクスのアップロードを行なっています。  

今回はSecretとして指定しましたが、各々のコンテナアプリケーション(Helidon)の設定ファイル(`microprofile-config.properties`)などでも指定することができます。

バックエンドアプリケーション、データソースアプリケーションのManifestでも同様に環境変数からAPMのエンドポイントとプライベート・データキーを取得する設定にしています。
