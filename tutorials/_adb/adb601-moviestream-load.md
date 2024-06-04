---
title: "601: ADWでMovieStreamデータのロード・更新をしよう"
excerpt: "Autonomous Data Warehouseにおける、大規模データの高速ロード・更新方法をご紹介します。"
order: "3_601"
layout: single
header:
  teaser: "/adb/adb601-moviestream-load/teaser.png"
  overlay_image: "/adb/adb601-moviestream-load/teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474310
---

<a id="anchor0"></a>

# はじめに

データのロード、変換、管理、そして分析まで、全てを1つのデータベースで行うことができるのが、Autonomous Data Warehouseです。このチュートリアルを参考に、ぜひ一度"**完全自律型データベース**"を体験してみてください。

本記事では、MovieStreamデータを使い、データのロード・処理方法を実際のビジネスシナリオに近い形でご紹介します。

<br>

**想定シナリオ：**

Oracle MovieStreamは、架空の映画ストリーミングサービスです。
MovieStreamはビジネスを成長させるため、顧客の視聴傾向や適切な提供価格などのデータ分析を行いたいと考えています。

<br>

**前提条件：**
+ ADBインスタンスが構成済みであること
    <br>※ADBインタンスを作成方法については、[101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning){:target="_blank"} を参照ください。  

<br>

**目次：**

- [1. ADWへのMovie Salesデータのロード](#anchor1)
- [2. Movie Salesデータの更新](#anchor2)
- [おわりに](#おわりに)

<br>

**所要時間 :** 約1時間

<a id="anchor1"></a>
<br>

# 1. ADWへのMovie Salesデータのロード
## 1-1. ADWインスタンスの作成
まずはADWインスタンスを作成します。[101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning){:target="_blank"} を参考にしながら、以下の条件で作成します。
- **ワークロード・タイプ：** データ・ウェアハウス
- **ECPU数：** 32
- **ストレージ(TB)：** 1
- **CPU Auto Scaling：** 許可

それ以外の項目については、ご自身の環境や目的に合わせて選択してください。

<br>

## 1-2. Movie Salesデータのロード
ADWでは、ニーズに応じて様々な方法でデータをロードすることができます。本記事では、簡単なスクリプトを使用してオブジェクトストレージからデータをロードします。

1. ADWに**接続サービスHIGH**で接続し、以下のスクリプトを実行します。実行すると、MOVIE_SALES_FACT表が作成されます。
```sql
CREATE TABLE MOVIE_SALES_FACT
(ORDER_NUM NUMBER(38,0) NOT NULL,
DAY DATE,
DAY_NUM_OF_WEEK NUMBER(38,0),
DAY_NAME VARCHAR2(26),
MONTH VARCHAR2(12),
MONTH_NUM_OF_YEAR NUMBER(38,0),
MONTH_NAME VARCHAR2(26),
QUARTER_NAME VARCHAR2(26),
QUARTER_NUM_OF_YEAR NUMBER(38,0),
YEAR NUMBER(38,0),
CUSTOMER_ID NUMBER(38,0),
USERNAME VARCHAR2(26),
CUSTOMER_NAME VARCHAR2(250),
STREET_ADDRESS VARCHAR2(250),
POSTAL_CODE VARCHAR2(26),
CITY_ID NUMBER(38,0),
CITY VARCHAR2(128),
STATE_PROVINCE_ID NUMBER(38,0),
STATE_PROVINCE VARCHAR2(128),
COUNTRY_ID NUMBER(38,0),
COUNTRY VARCHAR2(126),
COUNTRY_CODE VARCHAR2(26),
CONTINENT VARCHAR2(128),
SEGMENT_NAME VARCHAR2(26),
SEGMENT_DESCRIPTION VARCHAR2(128),
CREDIT_BALANCE NUMBER(38,0),
EDUCATION VARCHAR2(128),
EMAIL VARCHAR2(128),
FULL_TIME VARCHAR2(26),
GENDER VARCHAR2(26),
HOUSEHOLD_SIZE NUMBER(38,0),
HOUSEHOLD_SIZE_BAND VARCHAR2(26),
WORK_EXPERIENCE NUMBER(38,0),
WORK_EXPERIENCE_BAND VARCHAR2(26),
INSUFF_FUNDS_INCIDENTS NUMBER(38,0),
JOB_TYPE VARCHAR2(26),
LATE_MORT_RENT_PMTS NUMBER(38,0),
MARITAL_STATUS VARCHAR2(26),
MORTGAGE_AMT NUMBER(38,0),
NUM_CARS NUMBER(38,0),
NUM_MORTGAGES NUMBER(38,0),
PET VARCHAR2(26),
PROMOTION_RESPONSE NUMBER(38,0),
RENT_OWN VARCHAR2(26),
YEARS_CURRENT_EMPLOYER NUMBER(38,0),
YEARS_CURRENT_EMPLOYER_BAND VARCHAR2(26),
YEARS_CUSTOMER NUMBER(38,0),
YEARS_CUSTOMER_BAND VARCHAR2(26),
YEARS_RESIDENCE NUMBER(38,0),
YEARS_RESIDENCE_BAND VARCHAR2(26),
AGE NUMBER(38,0),
AGE_BAND VARCHAR2(26),
COMMUTE_DISTANCE NUMBER(38,0),
COMMUTE_DISTANCE_BAND VARCHAR2(26),
INCOME NUMBER(38,0),
INCOME_BAND VARCHAR2(26),
MOVIE_ID NUMBER(38,0),
SEARCH_GENRE VARCHAR2(26),
TITLE VARCHAR2(4000),
GENRE VARCHAR2(26),
SKU NUMBER(38,0),
LIST_PRICE NUMBER(38,2),
APP VARCHAR2(26),
DEVICE VARCHAR2(26),
OS VARCHAR2(26),
PAYMENT_METHOD VARCHAR2(26),
DISCOUNT_TYPE VARCHAR2(26),
DISCOUNT_PERCENT NUMBER(38,1),
ACTUAL_PRICE NUMBER(38,2),
QUANTITY_SOLD NUMBER(38,0));
```

1. 以下のスクリプトを実行し、置換変数を定義します。
```sql
define uri_ms_oss_bucket = 'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/dwcsprod/b/moviestream_data_load_workshop_20210709/o';
define csv_format_string = '{"type":"csv","skipheaders":"1"}';
```

1. 2018年から2020年までの映画売上データをインポートするためのスクリプトを実行します。データファイルは、35個に分かれています。32 ECPUの場合、35ヶ月分の映画販売データをロードするのに、ロードには約4分かかります。
```sql
BEGIN
DBMS_CLOUD.COPY_DATA (table_name => 'MOVIE_SALES_FACT',
file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_fact_m-*.csv',
format =>  '&csv_format_string'
);
END;
/
```

1. データロードの状態を確認するには、データロードジョブを追跡するメタデータ表（USER_LOAD_OPERATIONS）にクエリを実行します。
```sql
SELECT
start_time,
update_time,
substr(to_char(update_time-start_time, 'hh24:mi:ss'),11) as duration,
status,
table_name,
rows_loaded,
logfile_table,
badfile_table
FROM user_load_operations
WHERE table_name = 'MOVIE_SALES_FACT'
ORDER BY 1 DESC, 2 DESC
FETCH FIRST 1 ROWS ONLY;
```

1. rows_loadedという列を見ると、オブジェクトストレージにあるcsvファイルから97,890,562行が読み込まれていることがわかります。
![user_load_operations_resultイメージ](user_load_operations_result.png)

1. MOVIE_SALES_FACT表の実際の行数を確認してみます。
```sql
SELECT COUNT(*) FROM movie_sales_fact;
```

1. 上記のクエリを実行すると、97,890,562レコードという値が返され、正しくロードが実行されたことがわかります。
![movie_sales_fact_countイメージ](movie_sales_fact_count.png)

1. 処理されたデータファイルの数を確認するには、以下のようにログテーブルを参照します。  
※ファイルの場所は、選択したデータセンターに基づいているため、以下の図とは異なります）。
```sql
SELECT *
FROM copy$1_log
WHERE RECORD LIKE '%Data File%' ORDER BY 1;
```

1. これにより、以下のように35件リストされます。
![datafile_listイメージ](datafile_list.png)

<a id="anchor2"></a>

# 2. Movie Salesデータの更新
## 2-1. データの整合性の有効化
更新を行う前に、MOVIE_SALES_FACT表に主キーをつけます。
> (参考)
> 大量データを持つ表に主キーを付ける場合は、先にユニーク制約をパラレル処理で付与してから主キーに切り替えます。

```sql
CREATE UNIQUE INDEX idx_msf_order_num ON MOVIE_SALES_FACT(order_num);
ALTER TABLE movie_sales_fact ADD primary KEY (order_num) USING INDEX idx_msf_order_num;
```

また、以下のコマンドで売上高の合計値を確認します。
```sql
SELECT SUM(actual_price) FROM movie_sales_fact;
```

実行すると**160,365,556.83ドル**という値が返ってくるはずです。

## 2-2. Movie Salesデータの使用領域の確認
1. 以下のコマンドでMOVIE_SALES_FACT表がどのくらいの領域を使用しているか確認します。
```sql
SELECT
segment_name,
SUM(bytes)/1024/1024/1024 AS gb
FROM user_segments
WHERE segment_type='TABLE'
AND segment_name = 'MOVIE_SALES_FACT'
GROUP BY segment_name;
```

1. 以下のように**8.441GB**ほどの領域を使用しています。
![movie_sales_fact_gb1イメージ](movie_sales_fact_gb1.png)

## 2-3. ステージングテーブルの作成
ここでは、アルゼンチンの財務調整ファイルを外部表として作成し、MOVIE_SALES_FACT表にマージすることで更新してみます。
1. 以下のコマンドで置換変数を定義します。
```sql
define adj_column_names = '"ORDER_NUM" INTEGER,"COUNTRY" VARCHAR2(256),"DISCOUNT_PERCENT" NUMBER,"ACTUAL_PRICE" NUMBER';
```

1. 以下のコマンドで外部表を作成します。
```sql
BEGIN
dbms_cloud.create_external_table (
table_name => 'MOVIE_FIN_ADJ_argentina_EXT',
format =>  '&csv_format_string',
column_list => '&adj_column_names',
file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_argentina.csv'
);END;
/
```

1. 外部表を検証するため、プロシージャDBMS_CLOUD.VALIDATE_EXTERNAL_TABLEを使用します。デフォルトでは、ソース・ファイル内のすべての行をスキャンし、行が拒否されたときに停止します。なお、この作業は検証目的ですので、後続のその他の国の外部表作成時には行いません。
```sql
BEGIN
DBMS_CLOUD.VALIDATE_EXTERNAL_TABLE (table_name => 'MOVIE_FIN_ADJ_ARGENTINA_EXT');
END;
/
```

1. 検証が成功したのち、以下のクエリでステージングテーブルMOVIE_FIN_ADJ_ARGENTINA_EXT表に何行あるか確認します。
```sql
SELECT COUNT(*) FROM movie_fin_adj_argentina_ext;
```

1. 正常に実行されていれば、以下のように**1036**という結果が返されます。
![argentina_countイメージ](argentina_count.png)

## 2-4. ステージングテーブルの使用領域
1. 以下のクエリで新しく作成した外部表がどれくらいの領域を占めているのか確認します。
```sql
SELECT
segment_name,
SUM(bytes)/1024/1024/1024 AS gb
FROM user_segments
WHERE segment_type='TABLE'
AND segment_name=upper('MOVIE_FIN_ADJ_ARGENTINA_EXT')
GROUP BY segment_name;
```

1. 外部表は表として実体を持たないため、以下のように結果は**0**が返されるはずです。
![external_zeroイメージ](external_zero.png)

## 2-5. MERGEを使用したMovie Salesデータの更新
Oracle Databaseでは実表に対し、外部表の行を条件付きでそのまま更新または挿入することができます。データベースにデータを全て入れてからマージしなくても良いので処理ステップを減らすことができ、データ領域を節約することができます。

またADBについては、OCI Object Storage以外にもS3をはじめ各社オブジェクトストレージに対応しており、直接データを持ってくることが可能です。
1. 以下のコマンドで外部表をMOVIE_SALES_FACT表にマージします。
```sql
MERGE INTO movie_sales_fact a
    USING (
        SELECT order_num,
        discount_percent,
        actual_price
    FROM movie_fin_adj_argentina_ext) b
    ON ( a.order_num = b.order_num )
    WHEN MATCHED THEN
    UPDATE
    SET a.discount_percent = b.discount_percent,
    a.actual_price = b.actual_price;
    COMMIT;
```

1. この処理には2~3秒かかります。
![external_mergeイメージ](external_merge.png)

1. 以下のコマンドで外部表が正しく処理されたか確認します。
```sql
SELECT
SUM(actual_price)
FROM movie_sales_fact;
```

1. 売上高は**160,364,274.19ドル**（前回値160,365,556.83ドル）となり、若干減少したことがわかります。
![actual_price2イメージ](actual_price2.png)

## 2-6. Movie Salesデータの使用領域の再確認
1. 以下のコマンドでもう一度どれくらい領域を使用しているか確認します。
```sql
SELECT
segment_name,
SUM(bytes)/1024/1024/1024 AS gb
FROM user_segments
WHERE segment_type='TABLE'
AND segment_name='MOVIE_SALES_FACT'
GROUP BY segment_name;
```

1. 以前の値が8.441GBだったのに対し、以下のようにわずかな使用領域の増加が確認できます。
![movie_sales_fact_gb2イメージ](movie_sales_fact_gb2.png)

## 2-7. その他の国の財務調整データの更新
アルゼンチン以外の国の財務調整も同じ方法で処理します。
1. 以下のコマンドで他の財務調整データの外部表を作成します。
```sql
BEGIN
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_Austria_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_austria.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_belarus_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_belarus.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_brazil_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_brazil.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_canada_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_canada.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_chile_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_chile.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_china_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_china.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_egypt_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_egypt.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_finland_EXT', format =>  '&csv_format_string',column_list => '&adj_column_names',file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_finland.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_france_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_france.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_germany_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_germany.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_greece_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_greece.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_hungary_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_hungary.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_india_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_india.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_indonesia_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_indonesia.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_israel_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_israel.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_italy_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_italy.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_japan_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_japan.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_jordan_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_jordan.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_kazakhstan_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_kazakhstan.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_kenya_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_kenya.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_madagascar_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_madagascar.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_malaysia_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_malaysia.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_mexico_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_mexico.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_mozambique_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_mozambique.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_netherlands_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_netherlands.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_new_zealand_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_new_zealand.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_pakistan_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_pakistan.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_paraguay_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_paraguay.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_peru_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_peru.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_poland_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_poland.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_portugal_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_portugal.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_romania_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_romania.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_russian_federation_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_russian_federation.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_saudi_arabia_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_saudi_arabia.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_serbia_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_serbia.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_singapore_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_singapore.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_somalia_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_somalia.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_south_korea_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_south_korea.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_thailand_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_thailand.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_turkey_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_turkey.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_ukraine_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_ukraine.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_united_kingdom_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_united_kingdom.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_united_states_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_united_states.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_uruguay_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_uruguay.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_uzbekistan_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_uzbekistan.csv');
dbms_cloud.create_external_table (table_name => 'MOVIE_FIN_ADJ_venezuela_EXT', format =>  '&csv_format_string', column_list => '&adj_column_names', file_uri_list => '&uri_ms_oss_bucket/d801_movie_sales_finance_adj_venezuela.csv');
END;
/
```

1. 国別ファイルごとに更新するプロセスを簡略化するために、プロシージャを作成します。
```sql
CREATE OR REPLACE PROCEDURE RUN_ADJ (letter_in IN VARCHAR2) AUTHID CURRENT_USER
IS
ddl_string VARCHAR2(4000);
BEGIN
ddl_string := 'MERGE INTO movie_sales_fact a USING
     (SELECT order_num, discount_percent, actual_price
         FROM movie_fin_adj_'||letter_in||'_ext)
     b ON ( a.order_num = b.order_num )
     WHEN MATCHED THEN UPDATE SET a.discount_percent = b.discount_percent,
     a.actual_price = b.actual_price';
EXECUTE IMMEDIATE ddl_string;
EXECUTE IMMEDIATE 'commit';
END;
/
```

1. 上記で作成したプロシージャを使用し、マージします。
```sql
BEGIN run_adj('austria'); END;/
BEGIN run_adj('belarus'); END;/
BEGIN run_adj('brazil'); END;/
BEGIN run_adj('canada'); END;/
BEGIN run_adj('chile'); END;/
BEGIN run_adj('china'); END;/
BEGIN run_adj('egypt'); END;/
BEGIN run_adj('finland'); END;/
BEGIN run_adj('france'); END;/
BEGIN run_adj('germany'); END;/
BEGIN run_adj('greece'); END;/
BEGIN run_adj('hungary'); END;/
BEGIN run_adj('india'); END;/
BEGIN run_adj('indonesia'); END;/
BEGIN run_adj('israel'); END;/
BEGIN run_adj('italy'); END;/
BEGIN run_adj('japan'); END;/
BEGIN run_adj('jordan'); END;/
BEGIN run_adj('kazakhstan'); END;/
BEGIN run_adj('kenya'); END;/
BEGIN run_adj('madagascar'); END;/
BEGIN run_adj('malaysia'); END;/
BEGIN run_adj('mexico'); END;/
BEGIN run_adj('mozambique'); END;/
BEGIN run_adj('netherlands'); END;/
BEGIN run_adj('new_zealand'); END;/
BEGIN run_adj('pakistan'); END;/
BEGIN run_adj('paraguay'); END;/
BEGIN run_adj('peru'); END;/
BEGIN run_adj('poland'); END;/
BEGIN run_adj('portugal'); END;/
BEGIN run_adj('romania'); END;/
BEGIN run_adj('russian_federation'); END;/
BEGIN run_adj('saudi_arabia'); END;/
BEGIN run_adj('serbia'); END;/
BEGIN run_adj('singapore'); END;/
BEGIN run_adj('somalia'); END;/
BEGIN run_adj('south_korea'); END;/
BEGIN run_adj('thailand'); END;/
BEGIN run_adj('turkey'); END;/
BEGIN run_adj('ukraine'); END;/
BEGIN run_adj('united_kingdom'); END;/
BEGIN run_adj('united_states'); END;/
BEGIN run_adj('uruguay'); END;/
BEGIN run_adj('uzbekistan'); END;/
BEGIN run_adj('venezuela'); END;/
```

1. 上記は国ごと約10秒、計4~5分で終了します。続いて以下のコマンドで財務調整が正しく行われたか確認します。
```sql
SELECT
SUM(actual_price)
FROM movie_sales_fact;
```

1. これにより、当初の160,365,556.83ドルに対し、**160,306,035.62ドル**となり、収益に若干の変化があったことがわかります。
![actual_price3イメージ](actual_price3.png)

1. ここで使用領域を再度確認してみます。
```sql
SELECT
segment_name,
SUM(bytes)/1024/1024/1024 AS gb
FROM user_segments
WHERE segment_type='TABLE'
AND segment_name=upper('MOVIE_SALES_FACT')
GROUP BY segment_name;
```

1. 以前の値が8.441GBだったのに対し、**8.504GB**でした。大量のデータを更新したのにも関わらず、やはり使用領域の増加はとてもわずかに済んでいます。
![movie_sales_fact_gb3イメージ](movie_sales_fact_gb3.png)

<br>

# おわりに
本記事で行った作業は、実際のプロジェクトでも頻繁に行われる作業です。Oracle Databaseは、データの更新を効率的に管理するために設計されたストレージモデルを中心に構築されています。

さらに、Autonomous Data Warehouseは、データの保存プロセスを自動的に管理しますので、監視や調整のための設定は必要ありません。データを読み込んで更新するだけで、データの保存まで効率的に管理してくれます。

今回ロード・更新したデータの分析については、[602: ADWでMovieStreamデータの分析をしよう](/ocitutorials/adb/adb602-moviestream-analysis){:target="_blank"}でご紹介しておりますので、こちらも合わせてご参照ください。

<br>

# 参考資料
+ LiveLabs [Load and update MovieStream data in Oracle Autonomous Database using SQL Workshop](https://apexapps.oracle.com/pls/apex/r/dbpm/livelabs/view-workshop?wid=838){:target="_blank"}
+ [Loading Data with Autonomous Database](https://docs.oracle.com/en/cloud/paas/autonomous-database/adbsa/load-data.html#GUID-1351807C-E3F7-4C6D-AF83-2AEEADE2F83E){:target="_blank"}


以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)


