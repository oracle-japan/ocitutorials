---
title: "111: SELECT AIを試してみよう"
excerpt: ""
order: "3_111"
layout: single
header:
  teaser: "/adb/adb111-select-ai/23.png"
  overlay_image: "/adb/adb111-select-ai/23.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474304
---

<a id="anchor0"></a>

# はじめに
Autonomous Databaseで使用することの出来る機能、**Select AI**を使えば自然言語を使用してデータを問い合せることが出来ます。

Select AIで大規模言語モデル(LLM)を使用することで、ユーザーが入力したテキスト（自然言語）をSQLに変換し、データベース内のデータを問合せることが出来ます。ユーザーは、**自然言語**を使ってデータベース内のデータと**会話**をすることが出来ます。

<br>
**目次**

- [1. OCI生成AIサービスのAPIキー取得](#anchor1)
- [2. 環境設定](#anchor2)
- [3. SELECT AIを試してみる](#anchor3)

<br>
**前提条件**

- [101: ADBインスタンスを作成してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/)を参考に、ADBインスタンスが作成済みであること
- [104: クレデンシャル・ウォレットを利用して接続してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb104-connect-using-wallet/)を参考に、SQL Developerを使ってADBに接続出来ること
- OCI生成AIサービスを使用可能な、Chicagoリージョン、Frankfurtリージョン、Londonリージョン、Sao Pauloリージョンのいずれかをホーム・リージョン、若しくはサブスクライブしてあること。詳しくは、[Pretrained Foundational Models in Generative AI](https://docs.oracle.com/en-us/iaas/Content/generative-ai/pretrained-models.htm#)をご確認ください。


<br>
**所要時間 :** 約40分

<a id="anchor1"></a>
<br>

# 1. OCI生成AIサービスのAPIキー取得
Select AIでは、2024年9月現在、OpenAI、Cohere、Azure OpenAI Service、OCI Generative AI Service、およびGoogle GeminiをAIプロバイダーとして使用することが出来ます。

本記事では、OCI生成AIサービスをAIプロバイダーとして使用したいと思います。

1. OCIコンソールにアクセスして、右上のプロファイルからユーザー設定を選択します。
![image.png](1.png)

2. 左下のリソースからAPIキーを選択し、APIキーの追加をクリックします。
![image.png](2.png)

3. APIキー・ペアの生成（デフォルト）を選択し、秘密キーのダウンロードをした上で作成します。秘密キーは後程使用するので大切に保管しておきます。
![image.png](3.png)

4. 構成ファイルのプレビューも後程使用しますので、コピーしメモを取っておきます。
![image.png](4.png)


<a id="anchor2"></a>
# 2. 環境設定
Select AIはADBの機能なので、使用にはADBインスタンスが必要です。ADBのインスタンスが未作成の場合は[101: ADBインスタンスを作成してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/)を参考に、ADBインスタンスを作成します。

## 2-1. ユーザーの作成と権限の付与
先ずはチュートリアルを行うユーザーの作成と、権限の付与を行います。

1. [101: ADBインスタンスを作成してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/)の[3-3. データベース・ユーザーを作成してみよう（コマンドライン)](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/#3-3-%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%97%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%A9%E3%82%A4%E3%83%B3)を参考に、Database ActionsのSQLワークシートから、チュートリアルを行うユーザーを作成し、必要なロールを付与します。

    以下のSQLを実行し、
    - SELECT_AI_USERというユーザーを作成、必要なロールを付与
    - SELECT AI機能の利用に必要なDBMS_CLOUD_AIパッケージの実行権限を付与
    - Database ActionsにSELECT_AI_USERとしてサインインするため、RESTを有効化

    ```sql
    GRANT DWROLE, UNLIMITED TABLESPACE TO select_ai_user IDENTIFIED BY Welcome12345#;
    GRANT EXECUTE ON DBMS_CLOUD_AI TO select_ai_user;
    
    -- REST ENABLE
    BEGIN
        ORDS_ADMIN.ENABLE_SCHEMA(
            p_enabled => TRUE,
            p_schema => 'SELECT_AI_USER',
            p_url_mapping_type => 'BASE_PATH',
            p_url_mapping_pattern => 'select_ai_user',
            p_auto_rest_auth=> TRUE
        );
        commit;
    END;
    /
    ```
    これでユーザーの作成と、権限の付与が終わりました。

## 2-2. データセットの準備
次に、使用するデータセットをADB上にロードします。

1. Database Actionsから一度サインアウトします。
![image.png](5.png)


2. 先程作成したSELECT_AI_USERユーザーとしてサインインします。以下の様に入力します。
- ユーザー名：select_ai_user
- パスワード：Welcome12345#
![image.png](6.png)

3. Data Studioタブのデータ・ロードをクリックします。
![image.png](7.png)

4. 今回はExcelファイルをADB上にロードしたいので、データのロードを選択します。
![image.png](8.png)

5. [こちら](https://github.com/marina-fujimoto/oci-tutorial)からHIGHSCHOOLS.xlsxをダウンロードし、ダウンロードしたExcelファイルをアップロードします。
![image.png](9.png)

6. アップロードしたファイルのデータ・ロードの設定を編集します。ペンのアイコンをクリックし、編集画面を開きます。
![image.png](10.png)

7. 表の名前をHIGHSCHOOLSに変更し、閉じるボタンをクリックします。
![image.png](11.png)

8. 表の名前がHIGHSCHOOLSと変更されている事を確認し、開始ボタンをクリックします。
![image.png](12.png)

9. HIGHSCHOOLS.xlsx内のデータがロードされ、HIGHSCHOOLS表が作成されました。
![image.png](13.png)

これでデータ・セットの準備が出来ました。

## 2-3. SQL Developerの設定とビューの作成

先程まで使用していたDatabase Actions内のSQLやAPEXではSELECT AI文を直接実行することをサポートしていないため、[DBMS_CLOUD_AIパッケージのGENERATEファンクション](https://docs.oracle.com/en-us/iaas/autonomous-database-serverless/doc/dbms-cloud-ai-package.html#GUID-7B438E87-0E9A-4318-BA01-3BE1A5851229)を使用する必要があります。
そのため本チュートリアルでは、SQL Developerを使用して、データベースに接続したいと思います。

1. [104: クレデンシャル・ウォレットを利用して接続してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb104-connect-using-wallet/)を参考に、作成したADBにSQL Developerから接続します。

2. 接続が完了したら、SQL Developer上で以下のクエリを実行し、HIGHSCHOOLS表とその中身を確認します。

    ```sql
    -- HIGHSCHOOLS表の列一覧を表示
    SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE, DATA_DEFAULT
    FROM USER_TAB_COLUMNS
    WHERE TABLE_NAME = 'HIGHSCHOOLS'
    ORDER BY COLUMN_ID;

    -- HIGHSCHOOLS表に格納されているデータ一覧を表示
    SELECT * FROM HIGHSCHOOLS;
    ```

    HIGHSCHOOLS表にある列とその中のデータを確認する事が出来ました。

3. HIGHSCHOOLS表内には列が多く、今回は使用しない列もあるため、ビューを作成し使用する列を制限します。 今回はhighschools_viewという名前のビューを作成し、使用します。

    ```sql
    CREATE VIEW highschools_view AS
    SELECT 
        BOROUGH,
        SCHOOL_NAME,
        INTEREST,
        TOTAL_STUDENTS,
        GRADUATION_RATE,
        COLLEGE_CAREER_RATE,
        SAFE,
        SEATS,
        APPLICANTS,
        LATITUDE,
        LONGITUDE,
        LANGUAGE_CLASSES,
        ADVANCED_PLACEMENT_COURSES,
        SCHOOL_SPORTS,
        OVERVIEW_PARAGRAPH,
        ACADEMIC_OPPORTUNITIES,
        ADVANCEDPLACEMENT_COURSES,
        EXTRACURRICULAR_ACTIVITIES,
        PSAL_SPORTS_BOYS,
        PSAL_SPORTS_GIRLS,
        ADDTL_INFO1
    FROM 
        HIGHSCHOOLS;
    ```

> 補足
> - LLMに渡すメタデータの中に、似たような・若しくは同じデータが格納されている列がある場合はLLMが混乱してしまうので、不要な列は含めないようにする事が必要です。
> - 表や列を多く含めるとそれだけLLMがトークンを消費してしまう為、ビューを作成する等して必要な列のみをメタデータとしてLLMに渡す事が推奨されます。


## 2-4. クレデンシャルの作成
DBMS_CLOUD.CREATE_CREDENTIALプロシージャを使用して、OCI生成AIサービスに接続するためのクレデンシャルを作成します。
以下の通りにOCID等を置き換え、プロシージャを実行します。

OCI生成AIサービスを利用可能なOCIユーザのAPIキーの情報を設定します：
- **credential_name**：任意（本チュートリアルではOCI_GENAI_CREDとしています）
- **user_ocid**：先ほどメモを取った構成ファイルを参照し、ユーザーのOCIDを入力
- **tenancy_ocid**：先ほどメモを取った構成ファイルを参照し、使用しているテナンシーのOCIDを入力
- **private_key**：先程取得した秘密キーの内容をコピー&ペースト
- **fingerprint**：先ほどメモを取った構成ファイルを参照し、フィンガープリントを入力

```sql
BEGIN
    DBMS_CLOUD.CREATE_CREDENTIAL(
        credential_name => 'OCI_GENAI_CRED',
        user_ocid       => 'ocid1.user.oc1..axxxxxxxxxxxxxxxxq',
        tenancy_ocid    => 'ocid1.tenancy.oc1..aaxxxxxxxxxxxxa',
        private_key     => '-----BEGIN PRIVATE KEY-----
        MIIEvAIBADANBgkqhkiGQEFA＜中略＞1D3iheu1ct50SB0aIQz9Ow==
        -----END PRIVATE KEY-----',
        fingerprint     => 'xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx'
    );
END;
/
```
これでクレデンシャルを作成する事が出来ました。このクレデンシャルは、この後プロファイルを作成する際に繰り返し使用しますので、credential_nameをメモしておきます。


## 2-4. プロファイルの作成

DBMS_CLOUD_AI.CREATE_PROFILEプロシージャを使用して、AIプロファイルを作成します。
- **プロファイル名**：GENAI_COHERE_COMMAND_R（任意）
- **provider**：oci（本チュートリアルではOCI生成AIサービスをAIプロバイダーとして使用）
- **credential_name**：OCI_GENAI_CRED（先ほど作成したクレデンシャル名を指定）
- **model**：cohere.command-r-08-2024（プロバイダーをOCIとし、モデルを指定しない場合は、meta.llama-3-70b-instructが使用されます）
- **oci_apiformat**：COHERE（OCIチャットモデルを使用し、Cohereのモデルを指定する場合はoci_apiformatとしてCOHEREと指定）
- **object_list**：このプロファイルで使用するスキーマ・オブジェクトの所有者（本チュートリアルではselect_ai_user）とオブジェクト名（本チュートリアルではhighschools_view）を指定

```sql
BEGIN
    DBMS_CLOUD_AI.CREATE_PROFILE(
        'GENAI_COHERE_COMMAND_R',
        '{
            "provider": "oci",
            "credential_name": "OCI_GENAI_CRED",
            "model":"cohere.command-r-08-2024",
            "oci_apiformat":"COHERE",
            "object_list": [
                    {"owner": "select_ai_user", "name": "highschools_view"}
            ]
        }'
    );
END;
/
```

これでAIプロファイルが作成できました。

<a id="anchor3"></a>
# 3. SELECT AIを試してみる

## 3-1. コメント無しの場合

1．DBMS_CLOUD_AI.SET_PROFILEプロシージャを使用して、セッションで使用するAIプロファイルとして、先程作成したGENAI_COHERE_COMMAND_Rを指定します。
```sql
EXEC DBMS_CLOUD_AI.SET_PROFILE('GENAI_COHERE_COMMAND_R');
```

2.　先ずは、高校は全部で何校あるか聞いてみます。
```sql
SELECT AI 高校は全部で何校ありますか;
```
結果は427と返ってきました。

![alt text](14.png)

3.　highschools_view内に何校分データが格納されているのか確認してみます。
```sql
SELECT COUNT(*) FROM highschools_view;
```
highschools_view内には427校分データが格納されているので、正しい結果が返ってきたことが分かります。

![alt text](15.png)

4.　次に、マンハッタン市内にある高校の総数を聞いてみます。
```sql
SELECT AI マンハッタン市内に高校は全部で何校ありますか;
```
マンハッタン市内には少なくとも1校以上高校があるはずなので、期待される結果は返ってきませんでした。

![alt text](16.png)


5.　showsqlオプションを使用して、どの様なSQLが生成されているのか確認します。
```sql
SELECT AI showsql マンハッタン市内に高校は全部で何校ありますか;
```
![alt text](17.png)

以下のようなSQLが返ってきました。
WHERE句でBOROUGHを'Manhattan'と指定していますが、HIGHSCHOOLS表の中はカタカナで'マンハッタン'と記載がある為、WHERE句が上手く機能していないようです。
```sql
SELECT COUNT(*) AS MANHATTAN_HIGH_SCHOOLS
FROM "SELECT_AI_USER"."highschools_view" H
WHERE H.BOROUGH = 'Manhattan'
```

表、列、ビューにコメントを追加することで、LLMに追加の情報を与えることが出来ます。BOROUGH列にコメントを追加し、カタカナで'マンハッタン'と指定しても正しくSQLが生成されるように調整を行います。

## 3-2. コメント有りの場合
先程作成したビューの列にコメントを追加し、LLMが日本語でWHERE句の条件を指定してくれるようにメタデータを補足します。

1.　学校名やスポーツ名、言語名などの名詞は「日本語で格納されています。」等コメントで補足をします。
```
COMMENT ON COLUMN highschools_view.BOROUGH IS '高校が所在する地区。カタカナで地区名が格納されています。';
COMMENT ON COLUMN highschools_view.SCHOOL_NAME IS '高校の名称。日本語で学校名が格納されています。';
COMMENT ON COLUMN highschools_view.INTEREST IS '学校の特色';
COMMENT ON COLUMN highschools_view.TOTAL_STUDENTS IS '総生徒数';
COMMENT ON COLUMN highschools_view.GRADUATION_RATE IS '卒業率';
COMMENT ON COLUMN highschools_view.COLLEGE_CAREER_RATE IS '大学への進学率';
COMMENT ON COLUMN highschools_view.SAFE IS '学校の安全性評価';
COMMENT ON COLUMN highschools_view.SEATS IS '提供されている座席数';
COMMENT ON COLUMN highschools_view.APPLICANTS IS '入学希望者数';
COMMENT ON COLUMN highschools_view.LATITUDE IS '学校の緯度';
COMMENT ON COLUMN highschools_view.LONGITUDE IS '学校の経度';
COMMENT ON COLUMN highschools_view.LANGUAGE_CLASSES IS '提供される言語クラス。日本語で言語名が格納されています。';
COMMENT ON COLUMN highschools_view.ADVANCED_PLACEMENT_COURSES IS '提供される上級コース。日本語でコース名が格納されています。';
COMMENT ON COLUMN highschools_view.SCHOOL_SPORTS IS '学校で提供されるスポーツ。カタカナでスポーツ名が格納されています。';
COMMENT ON COLUMN highschools_view.OVERVIEW_PARAGRAPH IS '学校の概要';
COMMENT ON COLUMN highschools_view.ACADEMIC_OPPORTUNITIES IS '学問的な機会';
COMMENT ON COLUMN highschools_view.ADVANCEDPLACEMENT_COURSES IS '提供されるAdvanced Placementコース';
COMMENT ON COLUMN highschools_view.EXTRACURRICULAR_ACTIVITIES IS '課外活動';
COMMENT ON COLUMN highschools_view.PSAL_SPORTS_BOYS IS '男子PSALスポーツ。カタカナでスポーツ名が格納されています。';
COMMENT ON COLUMN highschools_view.PSAL_SPORTS_GIRLS IS '女子PSALスポーツ。カタカナでスポーツ名が格納されています。';
COMMENT ON COLUMN highschools_view.ADDTL_INFO1 IS '追加情報';
```
> 補足
> - 使用する表の名前は明確で分かりやすいものである必要がありますが、表名を変えることができない場合は、コメントやアノテーション（23aiから使用可能）で補足する事もできます。また、ビューを作成し分かりやすい名前に変更する事も有効です。

2．コメントを追加したので、新たにプロファイルを作成します。

プロファイル名をGENAI_COHERE_COMMAND_R_COMMENTSとし、LLMに送信するメタデータにコメントを含めるために"comments":"true"を追加します。

```sql
BEGIN
    DBMS_CLOUD_AI.CREATE_PROFILE(
        'GENAI_COHERE_COMMAND_R_COMMENTS',
        '{
            "provider": "oci",
            "credential_name": "OCI_GENAI_CRED",
            "model":"cohere.command-r-08-2024",
            "oci_apiformat":"COHERE",
            "comments":"true", 
            "object_list": [
                    {"owner": "select_ai_user", "name": "highschools_view"}
            ]
        }'
    );
END;
/
```

3．DBMS_CLOUD_AI.SET_PROFILEプロシージャを使用して、セッションで使用するAIプロファイルとしてGENAI_COHERE_COMMAND_Rを指定します。

    EXEC DBMS_CLOUD_AI.SET_PROFILE('GENAI_COHERE_COMMAND_R_COMMENTS');


4.　再度、マンハッタン市内にある高校の総数を聞いてみます。

    SELECT AI マンハッタン市内に高校は全部で何校ありますか;


結果が返ってきました。生成されたSQLも確認してみます。

![alt text](18.png)


5.　showsqlオプションを使用して、どの様なsqlクエリが生成されているのか確認します。
```sql
SELECT AI showsql マンハッタン市内に高校は全部で何校ありますか;
```
![alt text](19.png)

以下のようなSQLが返ってきました。WHERE句の条件がカタカナで'マンハッタン'と正しく指定されています。
```sql
SELECT COUNT(*) AS manhattan_highschools_count
FROM "SELECT_AI_USER"."HIGHSCHOOLS_VIEW"
WHERE BOROUGH = 'マンハッタン'
```

6.　他にも質問をしてみます。
```sql
SELECT AI 中国語の授業がある高校一覧;
```
高校名と言語クラスの列が表示されました。
全ての高校で中国語の言語クラスがあることが分かります。

![alt text](20.png)

コメントを付けてLLMに送信するメタデータを補足すると、結果の精度が向上することが分かりました。

## 3-3. パラメータ
SELECT AIでは使用出来るactionパラメータがいくつかあります。以下が使用可能なパラメータです。

- **runsql** - 結果セットを返す（指定しない時のデフォルト）
- **showsql** - 生成されたSQLを返す
- **narrate** - 会話形式で結果を返す
- **chat** - 一般的なAIチャット（データベースへの問合せは行わず、LLMから直接レスポンスを生成する）
- **explainsql** - 生成されたSQLを自然言語で説明


いくつかのパラメータを実際に試してみます。

1.　先ずはrunsqlパラメータを試してみます。
```sql
SELECT AI runsql 大学進学率が90％以上の高校;

-- runsqlはデフォルトのパラメータなので、以下のクエリと結果が同じになります
-- SELECT AI 大学進学率が90％以上の高校;
```
大学進学率が90％以上の高校一覧が表示されました。

![alt text](21.png)

2.　次はnarrateを試してみます。
```sql
SELECT AI narrate 大学進学率が90％以上の高校;
```
runsqlを指定した時と同じ結果ですが、それが自然言語で表示されました。
生成されたSQLの実行結果がAIプロバイダに送信され、自然言語でのサマリーが生成されます。

![alt text](22.png)

3.　次はchatを試してみます。
```sql
SELECT AI chat 大学進学率が90％以上の高校;
```

これまではデータベース上のデータをもとにしたレスポンスが返って来ましたが、今回はインターネット上の情報をもとにLLMが生成したレスポンスが返ってきました。
日本語で質問をしているので、日本の高校の内大学進学率が90％以上の高校を自然言語で回答してくれました。

![alt text](23.png)

これでチュートリアルは以上になります。
他にも色々と試してみて下さい。
