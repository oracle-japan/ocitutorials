---
title: "OCI Search Service for OpenSearch を使って検索アプリケーションを作成しよう"
excerpt: "Oracle Cloud Infrastructure Search Service with OpenSearch は、OpenSearch に基づいてアプリケーション内検索ソリューションを構築するために使用できるマネージド・サービスであり、インフラストラクチャの管理に集中することなく、大規模なデータセットを検索し、結果をミリ秒で返すことができます。"
order: "001"
tags: "opensearch"
date: "2022-11-07"
lastmod: "2022-11-07"
---

# OCI Search Service for OpenSearch を使って検索アプリケーションを作成する

Oracle Cloud Infrastructure Search Service with OpenSearch は、OpenSearch に基づいてアプリケーション内検索ソリューションを構築するために使用できるマネージド・サービスであり、インフラストラクチャの管理に集中することなく、大規模なデータセットを検索し、結果をミリ秒で返すことができます。

ハンズオンの流れは以下となります。

1. OpenSearch クラスターのプロビジョニング
2. クラスタへの接続
3. データセットのアップロード
4. アプリケーションの作成とデプロイメント
5. アプリケーションのテスト

## 前提条件

- クラウド環境
  - Oracle Cloud のアカウントを取得済みであること
  - [OCI チュートリアル その 2 - クラウドに仮想ネットワーク(VCN)を作る](https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn/)  を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること
  - [OCI チュートリアル その 3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/)  を通じてコンピュートインスタンスの構築が完了していること

## ハンズオン環境のイメージ

![architecture.png](architecture.png "architecture")

## 1. OpenSearch クラスターのプロビジョニング

[OpenSearch クラスタ](https://opensearch.org/docs/1.2/opensearch/cluster/)は、OpenSearch 機能を提供するコンピュート・インスタンスのセットです。各インスタンスはクラスタ内のノードです。ノードのタイプは、インスタンスによって実行される機能およびタスクを決定するものです。各クラスタは、1 つ以上のデータ・ノード、マスター・ノードおよび OpenSearch ダッシュボード・ノードで構成されます。

![opensearch cluster](1_opensearch_cluster.png "opensearch_cluster")

**OCI コンソールを使ってクラスターを作成します**

**ナビゲーション・メニュー**を開きます。「**データベース**」をクリックします。OpenSearch で、「**クラスタ**」をクリックします。

![open opensearch menu](1-1_click_opensearch_menu.png "open opensearch menu")

OpenSearch 一覧画面で「**クラスタの作成**」ボタンをクリックします。

![click_createcluster_button](1-2_click_createcluster_button.png "click createcluster button")

クラスタの**名前**を指定し、**クラスタを作成するコンパートメント**を選択して、「**次**」をクリックします。

![config cluster](1-3_config_cluster.png "config cluster")

ノード最適化オプションで「**開発**」オプションを選択します。「**次**」をクリックします。

![config node](1-4_config_node.png "config node")

「**ネットワーキングの構成**」セクションで、**既存の仮想クラウド・ネットワーク**を選択して、次の選択を行います。

- **仮想クラウド・ネットワーク**: 前提条件で作成したクラウド・ネットワーク。
- **サブネット**: 「**既存のサブネットを選択**」を選択して、サブネットは**前提条件で作成したインスタンスと同じパブリックサブネット**を指定します。

  上記の選択をした後は、「**次**」をクリックします。

![config vnc and subnet](1-5_config_vcn_subnet.png "config vcn and subnet")

「サマリー」ページでクラスタ確認の詳細を確認し、「クラスタの作成」をクリックします。

![submit creation request](1-6_submit_creation_request.png "submit creation request")

## 2. クラスタへの接続

**クラスタ接続情報を取得します**

**ナビゲーション・メニュー**を開きます。「**データベース**」をクリックします。OpenSearch で、「**クラスタ**」をクリックします。

![open opensearch menu](2-1-1_click_opensearch_menu.png "open opensearch menu")

「**クラスタ**」リストで、詳細を表示するクラスタの名前をクリックします。

![click cluster](2-1-2_click_cluster.png "click cluster")

「**クラスタの詳細**」ページで、下記の情報を取得します。

- **API エンドポイント**: クラスタのプライベート・エンドポイントの FQDN。
- **プライベート IP**: クラスタのプライベート・エンドポイントのプライベート IP アドレス。
- **OpenSearch ダッシュボード API エンドポイント**: クラスタの OpenSearch ダッシュボードの FQDN。
- **OpenSearch ダッシュボード・プライベート IP**: クラスタの OpenSearch ダッシュボードへの接続に使用できるプライベート・エンドポイントの IP アドレス。

![confirm cluster detail](2-1-3_confirm_cluster_detail.png "confirm cluster detail")

**セキュリティ・ルールを作成します**

1. **ナビゲーション・メニュー**を開きます。「**データベース**」をクリックします。OpenSearch で、「**クラスタ**」をクリックします。
2. 目的のクラスタをクリックします。
3. 「**クラスタの詳細**」の「**サブネット**」で、サブネットの名前をクリックします。「**サブネット詳細**」ページが開きます。

![click subnet](2-2-3_click_subnet.png "click subnet")

「**セキュリティ・リスト**」で「**デフォルト・セキュリティ・リスト**」という名前のセキュリティ・リストをクリックします。

![click security list](2-2-4_click_sl.png "click security list")

「**イングレス・ルールの追加**」をクリックします。

![add ingress rule](2-2-5_add_ingress_rule.png "add ingress rule")

ルールの次の値を入力します:

- ステートレス: このチェックボックスは選択を解除したままにします。
- ソース・タイプ: CIDR
- ソース CIDR: 0.0.0.0/0
- IP プロトコル: TCP
- ソース・ポート範囲: すべて
- 宛先ポート範囲: 9200
- 説明: ルールのオプションの説明。

![add ingress rule](2-2-6_add_ingress_rule.png "add ingress rule")

「**別のイングレス・ルール**」をクリックします。

![add ingress rule](2-2-7_add_ingress_rule.png "add ingress rule")

ルールの次の値を入力します:

- ステートレス: このチェックボックスは選択を解除したままにします。
- ソース・タイプ: CIDR
- ソース CIDR: 0.0.0.0/0
- IP プロトコル: TCP
- ソース・ポート範囲: すべて
- 宛先ポート範囲: 5601
- 説明: ルールのオプションの説明。

![add ingress rule](2-2-8_add_ingress_rule.png "add ingress rule")

「**別のイングレス・ルール**」をクリックします。

![add ingress rule](2-2-9_add_ingress_rule.png "add ingress rule")

ルールの次の値を入力します:

- ステートレス: このチェックボックスは選択を解除したままにします。
- ソース・タイプ: CIDR
- ソース CIDR: 0.0.0.0/0
- IP プロトコル: TCP
- ソース・ポート範囲: すべて
- 宛先ポート範囲: 8080
- 説明: ルールのオプションの説明。

![add ingress rule](2-2-10_add_ingress_rule.png "add ingress rule")

「**イングレス・ルールの追加**」をクリックします。

![add ingress rule](2-2-11_add_ingress_rule.png "add ingress rule")

**クラスタへの接続のテスト**
**ローカル・マシン**から**VM インスタンス**に接続したら、次のいずれかのコマンドを実行して接続をテストします。

```bash
curl https://<cluster_API_endpoint>:9200
```

エンドポイントへの接続が成功すると、次のようなレスポンスが返されます:

```bash
{
  "name" : "opensearch-master-0",
  "cluster_name" : "<cluster_name>",
  "cluster_uuid" : "<cluster_UUID>",
  "version" : {
    "distribution" : "opensearch",
    "number" : "1.2.4-SNAPSHOT",
    "build_type" : "tar",
    "build_hash" : "<build_hash>",
    "build_date" : "2022-02-08T16:44:39.596468Z",
    "build_snapshot" : true,
    "lucene_version" : "8.10.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}
```

**クラスタの OpenSearch ダッシュボードへの接続のテスト** 01. ローカル・マシンから次のコマンドを実行します。

```bash
ssh -C -v -t -L 127.0.0.1:5601:<OpenSearch_Dashboards_private_IP>:5601 -L 127.0.0.1:9200:<OpenSearch_cluster_private_IP>:9200 opc@<VM_instance_public_IP> -i <private_key_file>
```

\<OpenSearch_Dashboards_private_IP\>を、クラスタの OpenSearch ダッシュボードのプライベート IP に置き換えます。\<OpenSearch_cluster_private_IP\>をクラスタのプライベート IP に置き換えます。
\<VM_instance_public_IP\>を VM インスタンスのパブリック IP アドレスに置き換えます。\<private_key_file\>を、インスタンスへの接続に使用する秘密キーへのパスに置き換えます。これらの値とその検索方法の詳細は、インスタンスへの接続を参照してください。

- ローカル・マシンの Hosts ファイルに下記内容を追加します。
  
  ```bash
  127.0.0.1 <cluster_API_endpoint> <cluster_Dashboard_endpoint>
  ```

  - ローカル・マシンが Mac の場合、Hosts ファイルの位置は`/etc/hosts`です。Hosts ファイルを更新した後は、下記のコマンドを実行してローカル DNS を更新します。
  
    ```bash
    sudo killall -HUP mDNSResponder
    ```

  - ローカル・マシンが Windows の場合、Hosts ファイルの位置は`C\Windows\System32\drivers\etc\hosts`です。

- ローカル・マシンのブラウザから、`https://<cluster_Dashboard_endpoint>:5601`を開いて OpenSearch ダッシュボードにアクセスします。

![open opensearch dashborad](2-3-3_open_dashboard.png "open opensearch dashborad")

## 3. データセットのアップロード

**OpenSearch ダッシュボードを使ってデータセットをアップロードします。**

**ナビゲーション・メニュー**を開きます。Dev Tools をクリックします。

![opensearch_dashborad](3_0.png "opensearch dashborad")

Dev Tools で [accounts.json](https://raw.githubusercontent.com/oracle-japan/OCI_OpenSearch_Handson_App/main/data/account.json) の内容を Console にペーストします。

**実行**ボタンをクリックします。

![dataset_uploaded](3_4.png "dataset upload")

Console に下記の DSL を実行して、データセットを検索してみます。

```http
GET accounts/_search
{
  "query": {
    "match": {
      "firstname": "Amber"
    }
  }
}
```

![query_result](query_result.png "query result")

## 4. アプリケーションの作成とデプロイメント

**アプリケーションの作成**

**Helidon MP**と**OpenSearch の Java high-level REST client**を使って上記データセットを検索するアプリケーションを作成します。

- Helidon MP の使い方は[こちら](https://oracle-japan.github.io/ocitutorials/cloud-native/helidon-mp-for-beginners/)をご参照ください。
- OpenSearch の Java high-level REST client の使い方は[こちら](https://opensearch.org/docs/1.2/clients/java-rest-high-level/)をご参照ください。

```java
// ...
@Path("/accounts")
@RequestScoped
public class AccountResource {
    private String openSearchEndpoint;

    @Inject
    public AccountResource(@ConfigProperty(name = "oci.opensearch.api.endpoint") String openSearchEndpoint) {
        Object endpoint =  System.getProperty("OPENSEARCH_ENDPOINT");
        if(endpoint != null){
            this.openSearchEndpoint = (String) endpoint;
        }else{
            this.openSearchEndpoint = openSearchEndpoint;
        }
    }

    @Path("/search/{inputTerm}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response search(@PathParam("inputTerm") String inputTerm){
        // Create a client.
        RestClientBuilder builder = RestClient.builder(HttpHost.create(openSearchEndpoint));

        try(RestHighLevelClient client = new RestHighLevelClient(builder)){
            // Build search request
            SearchRequest searchRequest = new SearchRequest("accounts");

            // Build SearchSource
            SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
            searchSourceBuilder.query(QueryBuilders.queryStringQuery(inputTerm));
            searchSourceBuilder.from(0);
            searchSourceBuilder.size(100);
            searchRequest.source(searchSourceBuilder);

            // Search
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
            return Response.status(Response.Status.OK).entity(searchResponse.toString()).build();

        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }
}
```

**Bootstrap**を使ってアプリケーションの画面を作成します。

```html
<div class="container">
  <div class="row height d-flex justify-content-center align-items-center">
    <div class="col-md-6">
      <div class="form">
        <i class="fa fa-search"></i>
        <input
          type="text"
          class="form-control form-input"
          onkeydown="search(this)"
          placeholder="Search accounts..."
        />
      </div>
    </div>
    <div id="accounts_container" class="col-md-10" style="height:85%"></div>
  </div>
</div>
```

上記で作成したアプリケーションは[こちら](https://github.com/oracle-japan/OCI_OpenSearch_Handson_App)をご参照ください。

**アプリケーションのデプロイメント** 01. ローカル・マシンから VM インスタンスに接続します。 02. 下記のコマンドを実行して、ファイアウォールにポート「8080」を追加します。

```bash
sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
```

下記のコマンドを実行して、git と docker をインストールします。

```bash
sudo yum install git
sudo yum install docker
```

下記のコマンドを実行して、作成したアプリケーションをクローンします。

```bash
git clone https://github.com/oracle-japan/OCI_OpenSearch_Handson_App.git
```

アプリケーションの Docker イメージを作成します。

```bash
cd OCI_OpenSearch_Handson_App
docker build . -t os_app
```

下記のコマンドを実行して、アプリケーションをデプロイします。

```bash
nohup docker run -p 8080:8080 -e="OPENSEARCH_ENDPOINT=<cluster_API_endpoint>" localhost/os_app &
```

\<cluster_API_endpoint\>を、クラスタの OpenSearch ダッシュボードの API エンドポイントに置き換えます。

## 5. アプリケーションのテスト

ローカル・マシンのブラウザから、下記のリンクを開いてアプリケーションにアクセスします。

```txt
http://<VM_instance_public_IP>:8080
```

\<VM_instance_public_IP\>を VM インスタンスのパブリック IP アドレスに置き換えます。

![app_page](search_page.png "Application Page")

検索枠に検索条件を入力して、キーボードの Enter キーを押します。

![search_result](search_result.png "Search Result")

関連するアカウント情報が表示されます。
