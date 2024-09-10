---
title: "214 : Spatial Studio で地理情報を扱おう"
excerpt: "Oracle Spatialを使用すると、開発者は基本的な空間検索や分析から高度な地理空間アプリケーションや地理情報システム(GIS)まで、すべてのアプリケーションで空間分析を使用できます。"
order: "3_214"
layout: single
header:
  teaser: "/adb/adb214-spatial-studio/tokyo_boundary_image.jpg"
  overlay_image: "/adb/adb214-spatial-studio/tokyo_boundary_image.jpg"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776
---

# はじめに

Oracle Spatial Studio (Spatial Studioとも呼ばれます)は、Oracle Database のSpatial機能によって保存および管理されている地理空間データに対して接続、視覚化、調査および分析を行うためのフリー・ツールです。Spatial Studioは従来、Spatial and Graphとして有償オプションでしたが、現在はOracle Databaseの標準機能として追加費用なくご利用いただけます。
本記事では Spatial機能を用いた地理空間データの活用の方法をご紹介します。

**目次 :**
  + [1. Oracle Spatial Studioのクラウド上での構築](#anchor1)
  + [2. 地理空間データを含むCSV形式ファイルのデータベースへのロード](#anchor2)
  + [3. 政府統計データのダウンロードとロード](#anchor3)
  + [4. Spatial Studioを用いた分析](#anchor4)
  + [おわりに](#anchor5)

**前提条件**
+ ADBインスタンスが構成済みであること
    <br>※ADBインタンスの作成方法については、
    [101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning){:target="_blank"} を参照ください。  

<BR>

**所要時間 :** 約80分

<BR>

<a id="anchor1"></a>

# 1. Oracle Spatial Studioのクラウド上での構築
まず、Spatial Studioのメタデータを格納するリポジトリとなるデータベース・スキーマを作成します。これは、データセット、分析、プロジェクトの定義など、Spatial Studioで行う作業を格納するスキーマです。

## 1-1. リポジトリ用にスキーマを作成する
1. OCIコンソールからDatabase ActionsでADMINユーザーとしてSpatial Studioリポジトリに使用するADBに接続します。

1. 以下のコマンドでリポジトリ・スキーマを作成します。スキーマには任意の名前を付けることができます。ここではstudio_repoという名前で作成します。後の手順で使用するため、設定したパスワードをメモしておきます。
```
CREATE USER studio_repo IDENTIFIED BY <password>;
```

## 1-2. 表領域クオータを割り当てる
1. デフォルトの表領域dataをstudio_repoに割り当てます。
```
ALTER USER studio_repo DEFAULT TABLESPACE data;
```

1. 表領域クォータをstudio_repoに割り当てます。今回は250Mで設定しますが、他のデータセットを試す場合は、無制限(UNLIMITED)に設定することもできます。
```
ALTER USER studio_repo QUOTA 250M ON data;
```

## 1-3. 権限の付与
作成したstudio_repoに権限を付与します。
```
GRANT CONNECT,
      CREATE SESSION,
      CREATE TABLE,
      CREATE VIEW,
      CREATE SEQUENCE,
      CREATE PROCEDURE,
      CREATE SYNONYM,
      CREATE TYPE,
      CREATE TRIGGER
TO studio_repo;
```

これで、studio_repoスキーマをSpatial Studioのリポジトリとして使用する準備が整いました。

## 1-4. ウォレットのダウンロード
Spatial Studioが、作成したADBリポジトリ用スキーマに接続するには、ウォレットが必要です。
[104 : クレデンシャル・ウォレットを利用して接続してみよう](/ocitutorials/adb/adb104-connect-using-wallet/){:target="_blank"} を参考に、ウォレットをダウンロードします。

## 1-5. マーケットプレイスからSpatial Studioを選択する
1. 左上のハンバーガーメニューをクリックして、[マーケットプレイス]を選択します。
![marketplaceイメージ](marketplace.jpg)

1. 『Spatial Studio』と検索し、Oracle Spatial Studio をクリックします。
![search_spatial_studioイメージ](search_spatial_studio.jpg)

1. 利用規約に同意して、[スタックの起動]をクリックします。
![launch_stackイメージ](launch_stack.jpg)

## 1-6. スタックウィザードの作成
1. スタックに任意の名前と説明を追加し、コンパートメントを選択します。
![stack_informationイメージ](stack_information.jpg)

1. 可用性ドメインとインスタンスのシェイプを選択します。Compute Shapeの詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm){:target="_blank"} です。
![spatial_computeイメージ](spatial_compute.jpg)

1. HTTPSポートとSpatial Studio Adminのユーザー名をデフォルトから変更することができます。Spatial Studio Adminの認証には、OCI Vault またはパスワードを使用できます。下の画像は、パスワードを使った例です。なお、本番環境では、OCI Vault を使用することをお勧めします。
設定ができたらスクロールダウンして、「ネットワークの設定」のセクションに進みます。
![advanced_configイメージ](advanced_config.jpg)
> （補足）
> デフォルトでは、Spatial Studio の 管理ユーザー名は admin です。これはSpatial Studioのアプリケーション・ユーザーであり、『1. Spatial Studioリポジトリのデータベースユーザー作成』で作成したリポジトリ・スキーマ用のデータベース・ユーザー名（studio_repo）とは異なります。

1. ネットワークについては、新しいVCNを自動的に作成する、もしくは既存のVCNを作成します。  
下の図は、新たにVCNの作成した例です。既存のVCNを使用するには、上記ステップ2で選択したのと同じ可用性ドメイン内にある必要があります。他に既存のVCNがない場合は、残りの項目はデフォルトのままで構いません。既存のVCNがある場合は、競合を避けるためにCIDR値を変更してください。
![config_networkイメージ](config_network.jpg)

1. ssh公開鍵をロードします。
![add_sshkeysイメージ](add_sshkeys.jpg)

1. 入力した内容を確認します。修正が必要な場合は、[前]をクリックします。問題ない場合は、[作成]をクリックします。
![create_stackイメージ](create_stack.jpg)

## 1-7. 初回ログイン
1. 作成したスタックの情報を確認します。ハンバーガーメニューから[開発者サービス]→[スタック]を選択します。
![to_stack_pageイメージ](to_stack_page.jpg)

1. 以下のようにOracle Spatial Studioというスタックが作成されています。合わせてジョブが作成されるので、ジョブの名前をクリックします。
![stack_detailイメージ](stack_detail.jpg)

1. 正しく作成されていれば、以下のようにログが表示されます。
![job_detailイメージ](job_detail.jpg)

1. ログセクションの一番下までスクロールダウンします。完了すると、「Apply Complete！」と表示され、続いてインスタンスの詳細が表示されます。最後に表示されているのは、Spatial StudioのパブリックURLです。このURLをコピーして、ブラウザに貼り付けます。
![logイメージ](log.jpg)

1. Spatial Studioの公開URLを初めて開くと、プライバシーとセキュリティに関するブラウザの警告が表示されます。具体的な警告内容は、お使いのプラットフォームやブラウザによって異なります。  
これはSpatial Studioの問題ではなく、署名付きのHTTPS証明書を持たないWebサイトへのアクセスに共通するものです。署名された証明書をロードして構成すると、この警告は解除されます。  
リンクをクリックすると、ウェブサイトに移動します。
![access_warningイメージ](access_warning.jpg)

1. Spatial Studio の 管理ユーザー名（デフォルトはadmin）と、『1-6.スタックウィザードの作成』で入力したパスワードを入力します。そして、[Sign In]をクリックします。
![sign_inイメージ](sign_in.jpg)

1. Spatial Studioインスタンスへの最初のログイン時に、メタデータ・リポジトリとして使用するデータベース・スキーマの接続情報の入力が求められます。『1-1. リポジトリ用にスキーマを作成する』で作成したスキーマを使用するので、[Oracle Autonomous Database]を選択し、[Next]をクリックします。
![choose_connectionイメージ](choose_connection.jpg)

1. 『1-4. ウォレットのダウンロード』で保存したウォレットファイルを選択（またはドラッグ＆ドロップ）します。読み込み後、[OK]をクリックします。
![upload_walletイメージ](upload_wallet.jpg)

1. 『1-1. リポジトリ用にスキーマを作成する』で作成したユーザー名（studio_repo）とパスワード、およびサービスを入力します。今回は、サービスレベルはmediumに設定しておきます。接続サービスについては、[こちら](https://oracle-japan.github.io/ocitutorials/adb/adb201-service-names/){:target="_blank"}もご参照ください。以下の画像のように入力し、[OK]をクリックします。
    <div style="text-align: center"><img src="specify_metadata_schema.jpg"></div> 
1. Spatial Studioがスキーマへの初期接続を行い、いくつかのメタデータ・テーブルを作成します。完了すると、Getting Started情報とともにSpatial Studioが開きます。以下の画像のように表示されれば、ログイン成功です。
![getting_startedイメージ](getting_started.jpg)

<br>

<a id="anchor2"></a>

# 2. 地理空間データを含むCSV形式ファイルのデータベースへのロード
## 2-1. 駅の場所データのダウンロード
日本の全駅データを[こちら](https://ekidata.jp/){:target="_blank"}からダウンロードします。なお、会員登録（無料）が必要です。  
以下の画像のように、最新の駅データのcsvファイルをダウンロードします。
![station_dataイメージ](station_data.jpg)

<br>

## 2-2. 駅データのロード
1. Getting Started画面の[Create Dataset]をクリックします。
![create_datasetイメージ](create_dataset.png)

1. [Import File]をクリックし、先ほどダウンロードした駅データのcsvファイルをインポートします。
![import_file1イメージ](import_file1.jpg)

1. 駅データのデータセットが作成されます。Table Name と Dataset nameを**STATION** に変更し、Upload to connection:をSPATIAL_STUDIOに設定します。また、**station_cd**と**station_g_cd**のデータ型がDATEになっているので、NUMERICに変更してSubmitします。
![from_csvfileイメージ](from_csvfile.jpg)

1. データセットが作成されましたが、アイコンに注意表示が出ているので修正します。
![issue1イメージ](issue1.jpg)

1. [Go To Dataset Columns]をクリックし、主キー列を設定します。
![issue2イメージ](issue2.jpg)
以下のように**STATION_CD**列のトグルスイッチ『Use As Key』をONにし、[Validate key]をクリックします。
![key_settingイメージ](key_setting.jpg)
主キーを有効化したら、[Apply]をクリックします。

1. [Create Latitude/Longitude Index]をクリックし、住所を地図表示用の座標位置に変換します。
![issue3イメージ](issue3.jpg)
元々LAT列とLON列が入力されているので、そのまま[OK]をクリックします。
![lat&lonイメージ](lat&lon.jpg)
上記を正しく設定できたら、左のアイコンがピンマークに変わります。
![dataset_successイメージ](dataset_success.jpg)

<br>

## 2-3. プロジェクトの作成
データセットの作成が終わったら、駅データを地図に反映させてみます。
データセットの右のLaunch Menuから[Create Project]をクリックします。
![create_projectイメージ](create_project.jpg)

データセットをドラッグして、任意の場所にドロップします。
![drag&dropイメージ](drag&drop.jpg)

日本の全駅データが地図上に表示されました。
![station_visualイメージ](station_visual.jpg)

<br>

<a id="anchor3"></a>

# 3. 政府統計データのダウンロードとロード
続いて東京都の境界データと国勢調査の年齢階層データ、先ほどロードした全国の駅データを使って、Spatial Studioで分析をしてみましょう。

## 3-1. 境界データ/小地域（東京都）のダウンロード
[こちら](https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521&toukeiYear=2015&serveyId=A002005212015&prefCode=13&coordsys=1&format=shape&datum=2000){:target="_blank"} から東京都の境界データのShapefileをダウンロードします。  
[利用規約](https://www.e-stat.go.jp/terms-of-use){:target="_blank"}を読んでzipファイルを展開します。
> （補足）
> Shapefile（シェープファイル）とは、Esri社が提唱する、GISデータのフォーマットの1つです。  
> https://www.esrij.com/gis-guide/esri-dataformat/shapefile/  
> 図形情報と属性情報を持った地図データファイルが集まったファイルで、例えばこの後使う「市区町村の形状データ」では、市町村の形を示す情報や、その市町村の名前などが格納されています。*.shp, *.dbf など、決まった拡張子を持つ複数のファイルからなります。

![tokyo_shpイメージ](tokyo_shp.jpg)

出典：[政府統計の総合窓口(e-Stat)](https://www.e-stat.go.jp/){:target="_blank"}

以下の4つのファイルが展開されます。
+ h27ka13.dbf
+ h27ka13.prj
+ h27ka13.shp
+ h27ka13.shx

<br>

## 3-2. 国勢調査の年齢階層データのダウンロード
[こちら](https://github.com/r-deguchi/age_group_tokyo){:target="_blank"} から東京都の年齢階層データ（age_group_tokyo.csv）をダウンロードします。合わせてテーブル定義書も確認します。  
※ 政府統計の総合窓口(e-Stat)『平成２７年国勢調査 人口等基本集計 年齢（５歳階級）、男女別人口、総年齢及び平均年齢（外国人－特掲）－町丁・字等』のデータを一部加工して作成しています。

<br>

## 3-3. 各データのSpatial Studioへのロード
先ほどダウンロードしたシェープファイルと年齢階層データをSpatial Studioへロードし、データセットを作成します。

1. Spatial Studioへログインし、[Create Dataset]→[Import File]をクリックし、4つのファイルを全てインポートします。
![import_shpイメージ](import_shp.jpg)

1. 以下の画像のように設定し、**Submit**します。
![tokyo_boundaryイメージ](tokyo_boundary.jpg)
    + **Upload to connection**：SPATIAL_STUDIOを選択
    + **Table name**：TOKYO_BOUNDARYに変更
    + **Dataset name**：TOKYO_BOUNDARYに変更
    + **Create Spatial Index**：ON（デフォルト）に設定、空間索引が作成されます。

1. 『2-2. 駅データのロード』と同じ要領で、AREA列を主キー列に設定します。
![tokyo_boundary_pkイメージ](tokyo_boundary_pk.jpg)

1. age_group_tokyo.csvをインポートします。Issuesが2つありますが、ここはこのままで先に進みます。
![age_group_tokyo_issuesイメージ](age_group_tokyo_issues.jpg)

<br>

## 3-4. Database Actionsで2つの表をjoinする
Spatial StudioでロードしたTOKYO_BOUNDARY表とAGE_GROUP_TOKYO表を、共通のKEY_CODE列でjoinします。
現在の設定では、studio_repoユーザーでDatabase Actionsにサインインできないため、ADMINユーザーでRESTの有効化をする必要があります。

1. ADMINユーザーでDatabase Actionsにサインインします。

1. [データベース・ユーザー]をクリックします。
![database_actions_userイメージ](database_actions_user.jpg)

1. studio_repoユーザーにRESTの有効化をします。
![database_actions_restイメージ](database_actions_rest.jpg)

1. 一度サインアウトし、studio_repoユーザーでサインインし直します。

1. 『開発』の[SQL]をクリックします。

1. Spatial Studioでロードした3つの表AGE_GROUP_TOKYO、STATION、TOKYO_BOUNDARYがあることを確認します。
![studio_repo_tablesイメージ](studio_repo_tables.jpg)

1. 以下のコマンドでAGE_GROUP_TOKYO表とTOKYO_BOUNDARY表をjoinし、geo_age_tokyo表を作成します。
```sql
create table geo_age_tokyo as select a.PREF, a.CITY, a.S_AREA, a.PREF_NAME, a.CITY_NAME, a.S_NAME, a.KIGO_E, a.HCODE, a.AREA, a.PERIMETER, a.H27KAXX_, a.H27KAXX_ID, a.KEN, a.KEN_NAME, a.SITYO_NAME, a.GST_NAME, a.CSS_NAME, a.KIHON1, a.DUMMY1, a.KIHON2, a.KEYCODE1, a.KEYCODE2, a.AREA_MAX_F, a.KIGO_D, a.N_KEN, a.N_CITY, a.KIGO_I, a.MOJI, a.KBSUM, a.JINKO, a.SETAI, a.X_CODE, a.Y_CODE, a.KCODE1, a.GEOM, b.*
from TOKYO_BOUNDARY a, AGE_GROUP_TOKYO b 
where a.key_code = b.key_code;
```

1. 再度Spatial Studioに戻り、作成したgeo_age_tokyo表でデータセットを作成します。[Create Dataset]→[Table/view]からGEO_AGE_TOKYOを選択します。また、[Validate geometries]のトグルスイッチをONにします。
![geo_age_tokyo_importイメージ](geo_age_tokyo_import.jpg)

1. 主キー列をAREA列に設定し、[Create Spatial Metadata and Index]をクリックします。
![create_lat_lon_indexイメージ](create_lat_lon_index.jpg)

設定が成功するとGEO_AGE_TOKYOのアイコンがピンマークに変わります。

<br>

<a id="anchor4"></a>

# 4. Spatial Studioを用いた分析
作成したgeo_age_tokyo表と駅データを用いて、駅周辺の特定の年齢層の人口を集計してみます。
以下は、東京都を駅周辺の650個の小地域に分け、駅ごとに0~14歳、15~64歳、65歳以上の人口を表示するSQL文です。
このSQL文をDatabase Actionsで実行します。
```sql
select sum(a.T000849017), sum(a.T000849018), sum(a.T000849019), b.station_name
from geo_age_tokyo a, STATION b
where sdo_anyinteract (a.geom, sdo_geometry(2001, 8307, sdo_point_type(b.lon, b.lat, NULL), NULL, NULL)) = 'TRUE'
group by b.station_name;
```

+ sdo_anyinteract：表内のジオメトリに、特定のジオメトリとの位相関係があるかどうかを確認する、つまり東京都の小地域の空間データと駅の座標位置になんらかの位相関係があればTRUEを返します。
+ sdo_geometry：Oracleのデータベース上に点やポリゴンを収容するオブジェクト型です。引数の2001は二次元の点を表し、8307はWGS84経度/緯度座標系に関連付けられています。詳しくは[こちら](https://docs.oracle.com/cd/F19136_01/spatl/spatial-datatypes-metadata.html#GUID-683FF8C5-A773-4018-932D-2AF6EC8BC119){:target="_blank"} をご参照ください。
+ sdo_point_type：点ジオメトリの座標を格納するオブジェクト型です。

10秒ほど待つと、以下のような結果が返されます。東京都の各駅周辺の地域の年齢階層別の人口が表示されています。
<div style="text-align: center"><img src="75results.jpg"></div>

続いて以下のSQLで15歳未満・15~64歳・65歳以上の人口の総計と65歳以上の人口の割合を駅ごとに表示してみます。
駅データと人口データの集計の仕方が若干異なっており、rate_over_64列の計算で0除算が発生してしまうため、回避のための条件を追加しています。
```sql
select
  sum(a.T000849017) AS num_under_15,
  sum(a.T000849018) AS num_15_to_64,
  sum(a.T000849019) AS num_over_64,
  sum(a.T000849019) / NULLIF((sum(a.T000849017) + sum(a.T000849018) + sum(a.T000849019)) ,0) AS rate_over_64,
  b.station_name
from geo_age_tokyo a, STATION b
where sdo_anyinteract (a.geom, sdo_geometry(2001, 8307, sdo_point_type(b.lon, b.lat, NULL), NULL, NULL)) = 'TRUE'
group by b.station_name having sum(a.T000849019) / NULLIF((sum(a.T000849017) + sum(a.T000849018) + sum(a.T000849019)) ,0) is not null
ORDER BY rate_over_64 DESC;
```

実行すると以下のような結果が返されます。

![rate_over_64イメージ](rate_over_64.png)

最後にこのデータを地図上で図示してみたいと思います。
上記のSQL文にcreate table...asを追加したtmp表を作成し、tmp表と駅データの表を駅名でjoinしてage_over_64_tokyo表を作成します。
```sql
create table tmp
as select
  sum(a.T000849017) AS num_under_15,
  sum(a.T000849018) AS num_15_to_64,
  sum(a.T000849019) AS num_over_64,
  sum(a.T000849019) / NULLIF((sum(a.T000849017) + sum(a.T000849018) + sum(a.T000849019)) ,0) AS rate_over_64,
  b.station_name
from geo_age_tokyo a, STATION b
where sdo_anyinteract (a.geom, sdo_geometry(2001, 8307, sdo_point_type(b.lon, b.lat, NULL), NULL, NULL)) = 'TRUE'
group by b.station_name having sum(a.T000849019) / NULLIF((sum(a.T000849017) + sum(a.T000849018) + sum(a.T000849019)) ,0) is not null
ORDER BY rate_over_64;
```

```sql
create table age_over_64_tokyo as
select a.rate_over_64, b.*
from tmp a, STATION b
where a.station_name=b.station_name;
```

Spatial Studio上でage_over_64_tokyo表のデータセットを作成し、プロジェクトを作成します。
データセットを地図上にドラッグアンドドロップすると、以下のようになります。

![age_over_64_tokyo_mapイメージ](age_over_64_tokyo_map.png)

65歳以上の割合によって色を分けてみます。
Layers ListのAGE_OVER_64_TOKYOの右のボタンをクリックし、Settingsをクリックします。

![age_over_64_tokyo_configイメージ](age_over_64_tokyo_config.png)

Layerの設定画面になるので、BasicのColorをデフォルトのSingle ColorからBased on dataに変更します。

![age_over_64_tokyo_layersetting1イメージ](age_over_64_tokyo_layersetting1.png)

列を選択できるのでRATE_OVER_64列を選択し、基準となる値を0から0.6まで0.1刻みで設定します。
設定できたらSet paletteから色分けを再度選択し直すことで以下のような画面になります。

![age_over_64_tokyo_layersetting2イメージ](age_over_64_tokyo_layersetting2.png)

<BR/>

<a id="anchor5"></a>

# おわりに
Oracle Spatial Studioを使って、地理情報を含むデータの可視化やその空間分析ができることをご確認いただきました。  
また、ここでは扱いませんでしたが、面積計算を織り込んだ分析や道路/経路面を考慮した対象商圏の分析などもOracle Spatial の機能を利用することで可能になっています。  
さらにAutonomous Databaseで使用することで、大量のデータに対しても高速に処理を行うことができます。
Oracle Spatial StudioはAutonomous Databaseに標準で含まれておりますので、Autonomous Databaseを使用する際は合わせてご検討ください。

<BR/>

# 参考資料
+ 『Oracle Autonomous Database Serverlessの使用』 [Autonomous DatabaseでのOracle Spatialの使用](https://docs.oracle.com/cd/E83857_01/paas/autonomous-database/serverless/adbsb/spatial-autonomous-database.html#GUID-2090A775-E049-4695-B371-E583313A5F8C){:target="_blank"}
+ Oracle Database 『開発者ガイド』 [20 空間演算子](https://docs.oracle.com/cd/E96517_01/spatl/spatial-operators-reference.html#GUID-85422854-5133-4F1D-BF0E-228CA6EDAF87){:target="_blank"}


以上でこの章は終了です。次の章にお進みください。

<BR/>

[ページトップへ戻る](#)