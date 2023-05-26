---
title: "REST APIで取得したデータを一覧表示する"
excerpt: "このチュートリアルは、REST APIで取得したデータをVBCSアプリケーションで表形式で一覧表示する手順について説明します。"
layout: single
order: "011"
tags:
---
Visual Builder Cloud Service　(VBCS) は、ユーザー・インタフェース(UI)・コンポーネントをページにドラッグ＆ドロップするだけで、Webアプリケーションやモバイル・アプリケーションを作成するためのビジュアル開発ツールです。

このチュートリアルは、REST APIで取得したデータをVBCSアプリケーションで表形式で一覧表示する手順について説明します。

前提条件
--------

- [Oracle Integration Cloud インスタンスの作成](../integration-for-commons-1-instance/)

    Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。この文書は OIC インスタンスの作成方法をステップ・バイ・ステップで紹介するチュートリアルです。

- OIC インスタンスの ServiceAdministrator ロールが付与されたユーザーが準備されていること

    (参考) Oracle Integration Roles and Privileges
    [https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34](https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34)

- RESAS APIの利用登録が完了し、API KEYを取得していること

    登録は[こちら](https://opendata.resas-portal.go.jp/)

Webアプリケーションの作成
--------

このパートでは、VBCSで Web アプリケーションを作成する際に、最初に定義する ビジュアル・アプリケーション と Web アプリケーション を作成する手順を説明します。

### ビジュアル・アプリケーションの作成

VBCSでは、最初に ビジュアル・アプリケーション を作成します。 ビジュアル・アプリケーションは、Web アプリケーションやモバイル・アプリケーションを開発するために使用するリソースの集まりです。 アプリケーションのソース・ファイルや、メタデータが記述された JSON ファイルを含んでいます。

Web ブラウザを開き、提供された OIC インスタンスのURLを入力します。もしくはOCIのコンソールから「開発者サービス」－「アプリケーション統合」から作成済みのOICインスタンスを選択し、「サービス・コンソール」からOICコンソールを開きます。

![](001.png)


左ナビゲーションメニューの「ビジュアル・ビルダー」をクリックします。

![](002.png)

VBCS の 「Visual Applications」 ページが表示されたら、「New Application」 ボタンをクリックします。

![](003.png)

「Create Application」 ダイアログ・ボックスが表示されます。 次の表のように設定します。

設定項目|設定する値|説明
-|-|-
「Application name」|RestApiTutorial|アプリケーションにつける名前
「Id」|RestApiTutorial|アプリケーションのID。アプリケーションの URL にも用いられるので、VBCSのインスタンス内で一意である必要があります。 
「Description」|Tutorial Application|アプリケーションの簡単な説明
「Application template」|Empty Application (デフォルト)|アプリケーションのテンプレート

![](004.png)

値を設定したら、「Create Application」 ダイアログ・ボックスの 「Finish」 ボタンをクリックします。

ビジュアル・アプリケーションが作成されると、VBCSのアプリケーション・デザイナでビジュアル・アプリケーションがオープンします。 アプリケーション・デザイナにはアーティファクト・ブラウザとWelcomeスクリーンが表示されます。 Welcomeスクリーンには、VBCSでアプリケーションを作成するためのタスクのガイドが表示されます。

![](005.png)

アプリケーション・デザイナの左側の領域はアーティファクト・ブラウザと呼ばれる領域で、アプリケーションを構成する各種ソース・ファイル（HTML/CSS/JavaScriptなど）や、データ・アクセスや画面フローの設定などアプリケーションを実行する際に必要となるメタデータ（JSONファイル）が表示され、アクセスできます。

アーティファクト・デザイナには、次のタブ・ページがあります。

| 項目  | アイコン | 説明  |
| --- | --- | --- |
| Mobile Applications | ![](icon_1.png) | モバイルデバイスの機能を利用するネイティブモバイルアプリケーションを作成します。 |
| Web Applications | ![](icon_2.png) | デスクトップおよびモバイルデバイスのブラウザーで実行される最新のWebアプリケーションを作成します。 |
| Services | ![](icon_3.png) | サービス接続を作成して、サービスによって提供される既存のRESTエンドポイントを使用し、それらをアプリケーションで使用します。 |
| Business Objects | ![](icon_4.png) | ビジネスオブジェクトを作成して、アプリケーションのニーズに基づいてデータベースのカスタムRESTエンドポイントを定義します。 |
| Layouts | ![](icon_8.png) | レイアウトは、実行時に動的コンポーネントに表示されるフィールドを定義します。 |
| Components | ![](icon_5.png) | アプリケーションで使用する追加のコンポーネントを入手します。 |
| Processes | ![](icon_6.png) | Oracle IntegrationのProcess機能を使用して、ビジネスプロセスをアプリケーションに統合します。 |
| Source View | ![](icon_7.png) | 作成されたアプリケーションをソース形式で確認・編集することができます。 |


画面上部のアプリケーションの名前（Application nameとして指定したテキスト）の右隣に表示される 「DEVELOPMENT」 と 「1.0」 はそれぞれ、アプリケーションのステータス（development: 開発中を表す）とバージョンを表しています。

![](006_1.png)

### Web アプリケーションの作成

VBCS のビジュアル・アプリケーションは、1つ以上のWebアプリケーションまたはモバイル・アプリケーションを持ちます。 このチュートリアルでは、Webアプリケーションを作成します。

アーティファクト・ブラウザの 「Web Applications」 タブ をクリックします。
そのあと「+ Web Application」 ボタン(またはアーティファクト・ブラウザの右上にある 「＋」 アイコン)をクリックします。

![](007.png)

「Create Web Application」 ダイアログ・ボックスが表示されたら、 「Application Name」 フィールドに 「AreaAnalysis」 と入力し、 Navigation Style に 「None」 を選択し、 「Create」 ボタンをクリックします。

![](008.png)

AreaAnalysisアプリケーション のアーティファクトが生成されます。 ページ・デザイナで表示されている 「main-start」 が、アプリケーションの起動時に最初に表示される画面です。

![](009.png)

アーティファクト・ブラウザで 「areaanalysis」 ノードを展開するとWebアプリケーションの構造が表示されます。 「main」 ノードを展開すると 「main-start」 ページが表示されます。

![](010.png)


サービス接続の作成
--------

このパートでは、前のパートで作成したビジュアル・アプリケーションにサービス接続を作成します。
サービス接続を作成することにより、外部 REST サービスの呼び出しをコーディングなしに設定することが可能です。

アーティファクト・ブラウザの 「Services」 タブを開いて、 「+ Service Connection」 ボタン、または右上部にある 「+」 ボタンから「Service Connection」をクリックします。

![](011.png)

「Create Service Connection」 ポップアップ・ボックスが表示されたら、 「Define by Endpoint」を選択します。

![](012.png)

以下の内容を設定して、 「Next > 」 ボタンをクリックします。

設定項目|設定する値|説明
-|-|-
「URL」|https://opendata.resas-portal.go.jp/api/v1/cities?prefCode=1|外部 REST サービスの URL

![](013.png)

地域経済分析システム（RESAS：リーサス）のデータ提供API（以下「本API」と称する。）は、 内閣府 地方創生推進室またはその代理人が運営しています。APIへアクセスするには、リクエストヘッダーX-API-KEYにAPIキーを設定する必要があります。

「Request」 タブ -> 「Headers」タブを開いて、「+ Static Header」ボタンをクリックします。

![](014.png)

以下の内容を設定します。

設定項目|設定する値|説明
-|-|-
「Name」|X-API-KEY|外部 REST サービスのリクエスト・ヘッダーの名前
「Value」|ご自身で取得したRESAS API KEY|外部 REST サービスのリクエスト・ヘッダーの値

![](015.png)

「Test」 タブを開いて、「Send Request」ボタンをクリックします。

![](016.png)

レスポンスが表示されたら、「Save as Example Response」ボタンをクリックし、「Create」ボタンをクリックします。

![](017.png)

サービス接続が作成されていることを確認します。

![](019.png)



変数の作成
--------

このパートでは、変数を作成します。この変数は、サービス接続によって設定した REST エンドポイントによって取得したデータを保持します。

アーティファクト・ブラウザの 「Web Applications」 タブ を開きます。 「main」 ノードを展開し、「main-start」 をクリックします。 アプリケーション・デザイナで main-start ページが表示されます。

![](020.png)

アプリケーション・デザイナの Variables タブをクリックします。 「+ Variable」 ボタンをクリックします。

![](021.png)

「ID」 フィールドに cityListSDP と入力し、 「Type」 フィールドで 「Service Data Provider」 を選択したら、 「Create」 ボタンをクリックします。

**Service Data Providerとは**   
ServiceDataProvider は、サービス エンドポイントからデータを取得し、listView コンポーネントと table コンポーネントにバインドできるデータソースを表します。 フィルタリング、並べ替え、ページネーションなどのさまざまな機能をサポートします。
{: .notice--info}

![](022.png)

変数「cityListSDP」が作成され、アプリケーション・デザイナで表示されます。プロパティ・インスペクタで、 「Select Endpoint」 ボタンをクリックします。

![](023.png)

「Select Endpoint」 ダイアログ・ボックスで「Services」 →「前のパートで作成したサービス接続の名前（ここでは、apiV1）」 → 「GET /cities」を選択して、「Next > 」 ボタンをクリックします。

![](024.png)

「result」隣のチェックボックスにチェックを入れて、「Finish」 ボタンをクリックします。

![](025.png)


main-startページの編集
--------

このパートでは、main-startページを編集して、REST エンドポイントによって取得したレコード一覧をテーブル形式で表示します。


アプリケーション・デザイナの Page Designer タブをクリックします。 

![](026.png)

アプリケーション・デザイナの左側には、コンポーネント・パレットが表示されます。 コンポーネント・パレットは、デザイナの左にある コンポーネントタブで表示/非表示を切り替えることができます。

![](027.png)

コンポーネント・パレットを下にスクロールし、 「Collections」 カテゴリの 「Table」 コンポーネントを、タイトルの下にドラッグ＆ドロップします。

![](028.png)

追加された Table コンポーネントのプロパティ・インスペクタで Data タブを開きます。 「Data」 フィールドには、テーブルに表示するデータの設定が記述されています。「Data」フィールドにカーソルを合わせて、「▼」をクリックします。

![](029.png)

変数「cityListSDP」をクリックします。

![](030.png)


テーブル・コンポーネントのプロパティ・インスペクタの 「Data」 タブ・ページでは、テーブルの列の指定、列ヘッダーのテキストの変更、並べ替えの無効化/有効化を行うことができます。

テーブルの列を指定します。「Table Columns」の右にある「![](icon_9.png)」をクリックします。

![](031.png)

「Simple Field Columns」の下に表示されている 「bigCityFlag」、「cityCode」、「cityName」、「prefCode」 を順番にチェックします。

![](032.png)

テーブルの列ヘッダーのテキストを変更します。「Table Columns」 リストの上から一番目の 「bigCityFlag」 の「＞」をクリックして「Columns, Header Text」から 「特別区・行政区フラグ」 に変更し、「Columns, Sortable」から「Disabled」に変更します。

![](033.png)

![](034.png)

次の表のようにテーブルの他の列のヘッダーのテキストを変更し、並べ替えを無効化します。

変更前のテキスト|変更後のテキスト|変更前の並べ替え|変更後の並べ替え
-|-|-|-
cityCode |市区町村コード|Auto|Disabled
prefCode |都道府県コード|Auto|Disabled
cityName |市区町村名|Auto|Disabled

![](035.png)

これから、テーブルのスクロール・ポリシーを変更します。Table コンポーネントのプロパティ・インスペクタで All タブを開きます。 下にスクロールし、「Scroll Policy」を「Load More On Scroll」から 「Load All」 に変更します。

![](036.png)

動作確認
--------

最後に作成した画面を動作確認しましょう。

画面右上にある 「▷」(Run アイコン) をクリックします。

![](037.png)

以下のような画面ができていることを確認できます。 下にスクロールして、すべてのデータが表示されていることを確認してください。

![](038.png)

