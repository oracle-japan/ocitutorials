---
title: "エッジポリシーのWeb Application Firewallのログを分析する"
excerpt: "本チュートリアルでは、「OCI Web Application Firewallのエッジポリシーを使ってWebサーバを保護する」の続編として、エッジポリシーのログをLogging Analyticsに転送して分析する手順を紹介します。"
order: "100"
layout: single
tags:
 - intermediate
header:
 teaser: "/security/waf-v1-setup/edge1.png"
 overlay_image: "/security/waf-v1-setup/edge1.png"
 overlay_filter: rgba(34, 66,55, 0.7)

---

OCIでは、OCI Load Balancerに直接デプロイするWAF、”WAFポリシー”と、お客様のアプリケーションのドメインに構築するWAF、”エッジポリシー”の2種類のWAFを提供しています。
本チュートリアルでは、「[OCI Web Application Firewallのエッジポリシーを使ってWebサーバを保護する](/ocitutorials/security/waf-v1-setup)」の続編として、エッジポリシー内のログをObject Storageを経由してLogging Analyticsに転送し、ログを分析する手順を紹介します。


**所要時間：** 約40分（SRによる対応を除く）

**前提条件：** 
+ OCIチュートリアル「[OCI Web Application Firewallのエッジポリシーを使ってWebサーバを保護する](/ocitutorials/security/waf-v1-setup)」を参考に、エッジポリシーの作成が完了していること
+ OCI CLIコマンドがインストール、構成されていること
+ Logging Analyticsが有効化されていること
- OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。
![画面キャプチャ0](nfwla5.png)
+ ユーザーがLogging Analyticsを使用するためのポリシーが作成されていること。ポリシーの詳細はOCIチュートリアル「[OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する](/ocitutorials/intermediates/audit-log-analytics/)」もしくは、[ドキュメント](https://docs.oracle.com/ja-jp/iaas/logging-analytics/doc/enable-access-logging-analytics-and-its-resources.html)をご参照ください。
+ ユーザーにObject Storageの管理権限がIAMポリシーで付与されていること。ポリシーの詳細はドキュメント「[オブジェクト・ストレージへのWAFログの配信](https://docs.oracle.com/ja-jp/iaas/Content/WAF/Tasks/logs.htm#DeliverWAFLogsObjectStorage)」をご参照ください。


**注意 :**
※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。

<br>

# 1. Object Storageバケットの作成

エッジポリシー内のログの転送先となるObject Storageを作成します。
エッジポリシーのログは、SRをあげることで指定したObject Storageに転送することが可能です。

OCIコンソール画面左上のメニュー → ストレージ　→ オブジェクト・ストレージとアーカイブ・ストレージ　→ バケット　→　「バケットの作成」ボタンをクリックします。

表示された「バケットの作成」画面にて、任意のバケット名を入力し、「作成」ボタンをクリックします。  
※その他の項目はデフォルトのままで構いません。
 
 ![画面ショット2](edgelog02.png)


バケットを作成したら、バケットの可視性をプライベートからパブリックに変更します。  
作成したバケットの詳細画面を開き、画面左上の「可視性の編集」ボタンをクリックします。  
 
 ![画面ショット4](edgelog04.png)

「可視性の編集」画面にて「パブリック」を選択し、「変更の保存」ボタンをクリックします。
 
 ![画面ショット5](edgelog05.png)

バケットの作成、可視性の編集が完了したら、この後の手順でSRを作成する際にバケットの情報が必要になるため、バケット名とネームスペースをメモします。  
バケットのネームスペースはバケットの詳細ページから確認することが出来ます。  
 
 ![画面ショット3](edgelog03.png)

<br>

# 2. 顧客秘密キーの作成

操作を実行するユーザーの顧客秘密キーを作成します。  
OCIコンソール画面右上のユーザーのアイコン → 「自分のプロファイル」を選択します。
 
 ![画面ショット6](edgelog06.png)

画面左下のリソースから「顧客秘密キー」を選択し、「秘密キーの生成」ボタンをクリックします。
 
 ![画面ショット7](edgelog07.png)

「秘密キーの生成」画面にて、任意の名前を入力し、「秘密キーの生成」ボタンをクリックします。
 
 ![画面ショット8](edgelog08.png)

秘密キーのシークレット・キーが生成されるので、「コピー」してメモ帳にメモします。  
※この後の手順で使用します。

 ![画面ショット9](edgelog09.png)

作成した秘密キーの「アクセス・キー」もコピーしてメモ帳にメモします。  
※この後の手順で使用します。
 
 ![画面ショット10](edgelog10.png)


<br>

# 3. 資格証明を含むファイルの作成
以下の情報を含むファイルを作成し、バケットに格納します。

```
・Web App (エッジポリシーのドメイン名):エッジポリシー作成時に登録したドメイン名
・SecretKey:手順2でコピーした秘密キーのシークレット・キー
・AccessKey:手順2でコピーした秘密キーのアクセス・キー
・Object storage bucket_region:手順1でバケットを作成したリージョン
・Object storage bucket_name:手順1で作成したバケット名
・Namespace:手順1でコピーしたネームスペース
・Endpoint Url: https://<namespace>.compat.objectstorage.<region>.oraclecloud.com
・Upload prefix：ログファイルのファイルフォーマット（デフォルトは%{[webapp_domain]}_/%{+YYYY}/%{+MM}/%{+dd})）
```

例）

```
Web App: waf.jennyweb.net
SecretKey:xxxxxxxxxxxxxx
AccessKey:5b4fc091b779399247693f5468aa245c9c3f3c07
Object Storage bucket_region: us-ashburn-1
Object Storage bucket_name: WAFLogBucket
Namespace: xxxxxxx
Endpoint URL: https:xxxxxx.compat.objectstorage.us-ashburn-1.oraclecloud.com
Upload prefix:
```

ファイルに保存したら、手順1で作成したバケットにファイルをアップロードします。  
手順1で作成したバケットの詳細画面 → 画面左下のリソース → オブジェクトから、「アップロード」ボタンをクリックします。
 
 ![画面ショット11](edgelog11.png)

「オブジェクトのアップロード」画面にて、作成したファイルを選択し、「アップロード」ボタンをクリックします。
 
 ![画面ショット12](edgelog12.png)

オブジェクトにファイルがアップロードされたことを確認します。
 
 ![画面ショット13](edgelog13.png)


<br>

# 4. 事前認証済リクエストの作成

手順3でアップロードしたファイルの右端の3つの点をクリックし、「事前認証済リクエストの作成」を選択します。

 ![画面ショット14](edgelog14.png)

「事前認証済リクエストの作成」画面にて、事前認証済リクエスト・ターゲットが「オブジェクト」、アクセス・タイプが「オブジェクトの読取りを許可」がそれぞれ選択されていることを確認し、「事前認証済リクエストの作成」ボタンをクリックします。
 
 ![画面ショット15](edgelog15.png)

事前認証済リクエストが作成されたら、「事前認証済リクエストの詳細」画面に表示される「事前認証済リクエストのURL」をコピーします。  
※この後の手順でSRの作成時に事前認証済リクエストのURLが必要になります。
 
 ![画面ショット16](edgelog16.png)


<br>

# 5. サポート・リクエストの作成

SRを作成し、サポートチームにエッジポリシーのログを手順1で作成したバケットに転送する設定を依頼します。
OCIコンソール画面左上のメニュー → Webアプリケーション・ファイアウォール → ポリシー → ログを転送したいエッジポリシーの右端の3つの点 → 「サポート・リクエストの作成」を選択します。
 
 ![画面ショット17](edgelog17.png)

「サポート・オプション」の画面で、「サポート・リクエストの作成」ボタンをクリックします。
 
 ![画面ショット18](edgelog18.png)

テクニカル・サポートのタブにて、問題のサマリーと問題の説明にそれぞれ以下を入力し、サポート・リクエストを作成します。
+ **`問題のサマリー`**： エッジポリシーのログをObject Storageに保存したい、という趣旨の題名
+ **`問題の説明`**：ドキュメントの[URL](https://docs.oracle.com/ja-jp/iaas/Content/WAF/Tasks/logs.htm#DeliverWAFLogsObjectStorage)と手順4で作成した事前認証済リクエストのURLを記載します。
+ **`一般的なガイダンス`**を選択します
 
 ![画面ショット19](edgelog19.png)

サポート・リクエストが作成されたので、サポート・リクエストが対応されるまで待ちます。  
※通常数日以内に対応されます。
 ![画面ショット20](edgelog20.png)

サポート・リクエストのステータスはOCIコンソールに表示される「サポート」 → 「サポート・センターにアクセス」から作成したサポート・リクエストの一覧やステータスを確認することができます。
 
 ![画面ショット21](edgelog21.png)
 ![画面ショット22](edgelog22.png)

<br>

# 6. ログ・グループの作成

Object Storageに格納されたエッジポリシーのログの転送先となるLogging Analyticsの「ログ・グループ」を作成します。
Logging Analyticsではログを「ログ・グループ」単位で管理することができます。

OCIコンソール画面左上のメニュー → 監視および管理 → ログ・アナリティクス → 管理 → ログ・グループ → 「ログ・グループの作成」ボタンをクリックします。

表示された「ログ・グループの作成」画面にて、任意のログ・グループ名を入力し、「作成」ボタンをクリックします。
 
 ![画面ショット1](edgelog01.png)

<br>


# 7. ログ・ソース、ログ・パーサーのインポート

エッジポリシーのログ・パーサー、ログ・ソースは事前にLogging Analyticsで定義されていないので、Oracle Blogからログ・ソースとログ・パーサーの定義ファイルをダウンロードして、インポートします。  
定義ファイルは「[Oracle Blog -　8.参考資料](https://blogs.oracle.com/otnjp/post/how-to-send-oci-waf-logs-to-oci-logging-analytics-and-get-security-insights-v2-ja#:~:text=%E8%A9%A6%E3%81%97%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82-,8.%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99,-%E3%83%AD%E3%82%B0%E3%83%BB%E3%82%BD%E3%83%BC%E3%82%B9)」の「ログ・ソース」からダウンロードできます。

定義ファイルをダウンロードしたら、Logging Analyticsに定義ファイルをインポートします。  
OCIコンソール画面左上のメニュー　→ 監視および管理　→ ログ・アナリティクス　→ 管理　→　アクション　→ 構成コンテンツのインポートをクリックします。
 
 ![edgelog24](edgelog24.png)


「構成コンテンツのインポート」画面にて、Oracle Blogからダウンロードしたzipファイルを選択し、「インポート」ボタンを選択します。  
 
 ![edgelog25](edgelog25.png)

インポートに成功したら、「WAF-LOG」というログ・ソースと「waf_lualog」、「waf_cachinglog」というログ・パーサーがそれぞれ追加されます。
 
 ![画面ショット26](edgelog26.png)
 ![画面ショット27](edgelog27.png)


<br>

# 8. Object Collection Ruleの作成

SRが対応されると、指定したObject StorageにWAFのログが格納されます。
 
 ![画面ショット23](edgelog23.png)

Object Storageに格納されているログは、Logging AnalyticsのObject Collection Ruleを作成することで、Logging Analyticsに転送することが可能です。  
Object Collection RuleはAPI経由で作成する必要があるため、今回はOCI CLIを使用してルールを作成します。  
OCI CLIはOCIコンソールの「Cloud Shell」にデフォルトでインストールされているので、Cloud Shellにアクセスします。  
もしくはOCI CLIをインストール、構成済みのインスタンスがある場合は、インスタンスにアクセスしてください。

OCIコンソール画面右上の「開発者ツール」をクリックし、「Cloud Shell」を選択します。
 
 ![画面ショット28](edgelog28.png)

以下コマンドをCloud Shellで実行し、OCI CLIコマンドがインストールされていることを確認します。

```
$oci -v
3.40.3
```

Object Collection Ruleを作成するには以下の情報が必要になるため、それぞれ事前にメモをします。

+ **コンパートメントOCID**: ルールを作成するコンパートメントのOCID
+ **ログ・グループOCID**: 手順6で作成したログ・グループのOCID
+ **ログ・ソース名**: 手順7でインポートしたログ・ソースの名前（WAF_LOGS）
+ **名前**: ルールの名前（任意）
+ **ネームスペース**: Logging Analyticsのネームスペース
+ **バケット名**: 手順1で作成したObject Storageバケットの名前
+ **OSネームスペース**: Object Storageのネームスペース

コンパートメントのOCIDは、OCIコンソール画面左上のメニュー　→ アイデンティティとセキュリティ → アイデンティティ → コンパートメントから、ルールを作成するコンパートメントのOCIDをコピーしてください。

 ![画面ショット31](edgelog31.png)

手順6で作成したログ・グループのOCIDは、ログ・グループの詳細画面からコピーすることが可能です。
 
 ![画面ショット32](edgelog32.png)

Logging Analyticsのネームスペース名は、OCIコンソール画面左上のメニュー　→ 監視および管理　→ ログ・アナリティクス　→ 管理　→ サービス詳細画面から確認することが可能です。  
 
 ![画面ショット29](edgelog29.png)

また、Object Storageのネームスペースは、手順1で作成したObject Storageバケットの詳細画面から確認することが可能です。
 
 ![画面ショット30](edgelog30.png)

それぞれの情報を手元にメモをしたら、以下コマンドを実行します。
OCI CLIコマンドの詳細についてはこちらの[ドキュメント](https://docs.oracle.com/en-us/iaas/tools/oci-cli/3.41.0/oci_cli_docs/cmdref/log-analytics/object-collection-rule/create.html)をご参照ください。

```
$oci log-analytics object-collection-rule create --compartment-id <コンパートメントOCID> --log-group-id <手順6で作成したログ・グループのOCID> --log-source-name WAF_LOGS --name <ルールの名前> --namespace-name <Logging Analyticsのネームスペース> --os-bucket-name <手順1で作成したObject Storageバケットの名前> --os-namespace <Object Storageのネームスペース> --collection-type HISTORC_LIVE --poll-since BEGINNING
```

例）
```
$oci log-analytics object-collection-rule create --compartment-id ocid1.compartment.oc1..aaaaaaaaxxxxxxx --log-group-id ocid1.loganalyticsloggroup.oc1.iad.amaaaaaatxxxxx --log-source-name WAF_LOGS --name edgelogcollection --namespace-name nr3c2r62ocsa --os-bucket-name WAFLogBucket --os-namespace nr3c2r62ocsa --collection-type HISTORIC_LIVE --poll-since BEGINNING
```

Object Collection Ruleの作成に成功すると、以下のようなレスポンスが返ってきます。  
```
{
  "data": {
    "char-encoding": null,
    "collection-type": "HISTORIC_LIVE",
    "compartment-id": "ocid1.compartment.oc1..aaaaaaaaxxxxx",
    "defined-tags": {
      "Oracle-Tags": {
        "CreatedBy": "default/xxxxxxxxxx",
        "CreatedOn": "2024-05-28T01:41:51.017Z"
      }
    },
    "description": null,
    "entity-id": null,
    "freeform-tags": {},
    "id": "ocid1.loganalyticsobjectcollectionrule.oc1.iad.amaaaaaaxxxxxx",
    "is-enabled": true,
    "is-force-historic-collection": null,
    "lifecycle-details": null,
    "lifecycle-state": "ACTIVE",
    "log-group-id": "ocid1.loganalyticsloggroup.oc1.iad.amaaaaaaxxxxxxx",
    "log-set": null,
    "log-set-ext-regex": null,
    "log-set-key": null,
    "log-source-name": "WAF_LOGS",
    "log-type": "LOG",
    "name": "edgelogcollection",
    "object-name-filters": null,
    "os-bucket-name": "WAFLogBucket",
    "os-namespace": "nr3c2r62ocsa",
    "overrides": null,
    "poll-since": "1970-01-01T00:00:00.000Z",
    "poll-till": null,
    "time-created": "2024-05-28T01:41:51.055000+00:00",
    "time-updated": "2024-05-28T01:41:51.055000+00:00",
    "timezone": null
  },
  "etag": "fb6dccf04a8988aac27fd86fce694befecdd9442fcff6bb808baf37955f17704"
}
```

OCIコンソール画面左上のメニュー → 監視および管理 → ログ・アナリティクス → ログ・エクスプローラ選択すると、「WAF_LOGS」が収集されていることが確認できます。
 
 ![画面ショット33](edgelog33.png)

※デフォルトで過去60分間に収集されたログが表示されます。ログが表示されない場合は、画面右上の時間選択枠から、選択範囲を広げてみてください。
 
 ![画面ショット34](edgelog34.png)

ログ・エクスプローラーから「WAF_LOGS」を選択すると、ログを一覧で確認することができます。
 
 ![画面ショット35](edgelog35.png)


<br>

# 9. ダッシュボードのインポート

エッジポリシーのログの事前定義済みのダッシュボードをインポートして、ログを可視化してみます。  
ダッシュボード定義は「[Oracle Blog - 8.参考資料](https://blogs.oracle.com/otnjp/post/how-to-send-oci-waf-logs-to-oci-logging-analytics-and-get-security-insights-v2-ja#:~:text=%E8%A9%A6%E3%81%97%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82-,8.%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99,-%E3%83%AD%E3%82%B0%E3%83%BB%E3%82%BD%E3%83%BC%E3%82%B9)」の「ダッシュボード」からダウンロードできます。

ダッシュボードの定義ファイルをダウンロードしたら、Logging Analyticsにインポートします。  
OCIコンソール画面左上のメニュー → 監視および管理 → ログ・アナリティクス → ダッシュボード → 「Import Dashboard」を選択します。  

 ![画面ショット36](edgelog36.png)

ダウンロードした定義ファイルを選択し、ダッシュボードのインポート画面で、「Compartments for dashboards」と「Compartments for saved searches」をそれぞれ「Specify a compartment for all saved searches」を選択します。  
ダッシュボードを保存するコンパートメント、保存済検索を保存するコンパートメントをそれぞれ指定したら「Import」ボタンをクリックします。
 
 ![画面ショット37](edgelog37.png)

ダッシュボードのインポートに成功すると、以下5つのダッシュボードが作成されます。  
+ WAF Activity Overview - エッジポリシーログの全体概要
+ OWASP top 10 threats - 検知された保護ルールに関するログの監視
+ Threat Intel Feed Detection - 脅威インテリジェンスによって検知されたログの監視
+ WAF Access Rules Detection - アクセス制御によって検知されたログの監視
+ WAF JS Challenges - Javascript Challenge機能によって検知されたログの監視

 ![画面ショット38](edgelog38.png)

それぞれのダッシュボードは、エッジポリシーのログを事前に分析、可視化した内容が定義されているため、すぐに監視にお役立ていただくことができます。  
例えば「WAF Activity Overview」のダッシュボードでは一例として以下のような内容をログから可視化することができます。
+ 「WAF OCI Global Access Request Number」- WAFへの総合アクセス数
+ 「WAF OCI Global Access Return Code By Application」- WEBアプリケーションごとのWAFの返却コードの内訳
+ 「WAF OCI Global Access By URL Top 10」- アクセスが多かったURL上位10
 
 ![画面ショット39](edgelog39.png)

各ダッシュボードは画面右上の「Action」→「Edit」から修正することもできます。
 
 ![画面ショット40](edgelog40.png)

ログの分析方法についてはOCIチュートリアル「[OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する - 4.ログの分析](/ocitutorials/management/audit-log-analytics/#4-%E3%83%AD%E3%82%B0%E3%81%AE%E5%88%86%E6%9E%90)」をご参照ください。

以上で、エッジポリシーのログをLogging Analyticsに転送して分析する手順は完了です。
是非、ダッシュボードを実運用に合わせてカスタマイズしてご活用ください。