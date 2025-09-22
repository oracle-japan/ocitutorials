---
title: "108 : SELECT AI with RAGを試してみよう"
description: "データベース内データを自然言語でクエリできるSELECT AIはRAG構成においても使用できます。このチュートリアルでは実際のデータを使って、ADBだけでRAG構成を組むことのできるSELECT AI with RAGを試します。"
weight: "4_108"
layout: single
tags: 
  - データベース
  - AIと機械学習
images:
- ai-vector-search/ai-vector108-select-ai-with-rag/adb-diagram-third-party-vector-db-select-ai-rag.png
---


# はじめに
Autonomous DatabaseのSELECT AIがRAG（Retrieval Augmented Generation）をサポートするようになりました。自然言語でデータベース内のデータを問い合わせることができるSELECT AI機能にRAGを組み合わせることで、大規模言語モデル（LLM）の知識とエンタープライズデータベースの知識との間のギャップを埋めることが可能になります。これにより、より関連性の高い応答や最新の情報を含む応答が得られ、同時にハルシネーションのリスクも軽減されます。

SELECT AIについては[111: SELECT AIを試してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb111-select-ai/)をご参照ください。


本記事では架空の製品データをベクトルストアに格納し、LLMが学習していないデータに関する質問に対してRAG構成でうまく回答できることを確認します。


**前提条件 :**
+ [101:Always Freeで23aiのADBインスタンスを作成してみよう](/ocitutorials/ai-vector-search/ai-vector101-always-free-adb/)の記事を参考に、Oracle Database 23aiの準備が完了していること。

+ OCI GenAI Serviceをご利用いただけるリージョンはサブスクリプション済みであること。

  ※リージョン一覧は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/generative-ai/pretrained-models.htm)をご参照ください。

  SELECT AIではデフォルトでシカゴリージョンのOCI GenAIサービスを使用しますが、本チュートリアルでは大阪リージョンのOCI GenAIサービスを使用しますので、大阪リージョンがサブスクライブされていることが前提となります。
  
  本チュートリアルで使用するテキスト生成モデル、エンベッディングモデルについては、将来的にモデルの廃止が行われることがあるため、廃止日や置換モデルのリリース情報を[こちら](https://docs.oracle.com/ja-jp/iaas/Content/generative-ai/deprecating.htm)から確認のうえ、最新のモデルを使用することを推奨します。本チュートリアルでは、エンベッディングモデルにcohere.embed-v4.0、テキスト生成モデルにcohere.command-a-03-2025を使用します。これらが最新になっているか上記リンクよりご確認ください。

  - OCI アカウントのAPI署名キーの生成は完了であること
  <br>以下の情報を取得してください。必要があれば、[API署名キーの生成方法](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/apisigningkey.htm#two)をご参照ください。
    - `user` - キー・ペアが追加されるユーザーのOCID。
    - `fingerprint` - 追加されたキーのフィンガープリント。
    - `tenancy` - テナンシのOCID。
    - `region` - コンソールで現在選択されているリージョン。
    - `key_file` - ダウンロードした秘密キー・ファイルへのパス。この値は、秘密キー・ファイルを保存したファイル・システム上のパスに更新する必要があります。
    - `compartment_ocid` - 利用するコンパートメントのOCIDを取得してください。



**所要時間 :** 約90分

<BR>

<a id="anchor1"></a>

# 1. データの準備
先ずはオブジェクト・ストレージを作成し、ベクトルストアに格納するデータを格納します。

1. OCIコンソールのホームページから、メニューを開きます。
![alt text](image.png)

2. **ストレージ＞オブジェクト・ストレージとアーカイブ・ストレージ**をクリックします。
![alt text](image-1.png)

3. **バケットの作成**をクリックします。
![alt text](image-10.png)

4. バケット名を入力し（本チュートリアルではselect-ai-with-ragとしています）、**作成**ボタンをクリックします。
![alt text](image-12.png)

5. 作成した**select-ai-with-rag**をクリックします。
![alt text](image-13.png)

6. [こちら](/ocitutorials/ai-vector-search/ai-vector108-select-ai-with-rag/rocket.txt)から**rocket.txt**というテキストファイルをダウンロードします。右クリックで[名前を付けて保存]をクリックするとダウンロードできます。

    このテキストには、架空の製品であるロケットエンジンOraBoosterの説明文章が格納されています。企業内のデータを想定し、テキストの内容としては、存在しない製品かつ完全な創作文章のため、LLMが学習しているはずのないデータということになります。

7. 画面下部のオブジェクトから、テキストファイルをアップロードします。**アップロード**ボタンをクリックします。
![alt text](image-14.png)

8. ダウンロードした**rocket.txt**をドラッグアンドドロップし、**アップロード**をクリックします。
![alt text](image-15.png)

9. アップロードしたrocket.txtの右側にある3つの点をクリックし、**オブジェクト詳細の表示**を選択します。
![alt text](image-16.png)

10. 作成したオブジェクトストレージのURIをコピーし、メモをしておきます。このURIは後程使用します。（例：https://objectstorage.ap-tokyo-1.oraclecloud.com/n/xxxxxxxxx/b/xxxxxxxxxx/o/）
![alt text](image-17.png)

# 2. 環境準備
## 2-1. ユーザーの作成と権限の付与
次に、チュートリアルを行うユーザーの作成と権限の付与を行います。

[101: ADBインスタンスを作成してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/)の[3-3. データベース・ユーザーを作成してみよう（コマンドライン)](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/#3-3-%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%97%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%A9%E3%82%A4%E3%83%B3)を参考に、Database ActionsのSQLワークシートからチュートリアルを行うユーザーを作成し、必要なロールを付与します。

以下のSQLを実行します。

```sql
-- vector_userというユーザーを作成、必要なロールを付与
GRANT DWROLE, UNLIMITED TABLESPACE TO vector_user IDENTIFIED BY Welcome12345#;
-- SELECT AI機能の利用に必要なDBMS_CLOUD_AIパッケージの実行権限を付与
GRANT EXECUTE ON DBMS_CLOUD_AI TO vector_user;
```

これでユーザーの作成と、権限の付与が終わりました。

## 2-2. SQL Developerへの接続

先程まで使用していたDatabase Actions内のSQLではSELECT AI文を直接実行することをサポートしていないため、[DBMS_CLOUD_AIパッケージのGENERATEファンクション](https://docs.oracle.com/en-us/iaas/autonomous-database-serverless/doc/dbms-cloud-ai-package.html#GUID-7B438E87-0E9A-4318-BA01-3BE1A5851229)を使用する必要があります。
そのため本チュートリアルでは、SQL Developerを使用して、データベースに接続したいと思います。SQL*Plusなどのその他のクライアント・ツールでも大丈夫です。

[104: クレデンシャル・ウォレットを利用して接続してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb104-connect-using-wallet/)を参考に、作成したADBにSQL Developerから接続します。

# 3. SELECT AI with RAG使用の準備

## 3-1. OCI生成AIサービスのクレデンシャル作成
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

## 3-2. オブジェクトストレージのクレデンシャル作成
DBMS_CLOUD.CREATE_CREDENTIALプロシージャを使用して、オブジェクトストレージに接続するためのクレデンシャルを作成します。
以下の通りにOCID等を置き換え、プロシージャを実行します。

OCI生成AIサービスを利用可能なOCIユーザのAPIキーの情報を設定します：
- **credential_name**：任意（本チュートリアルではOBS_CREDとしています）
- **user_ocid**：先ほどメモを取った構成ファイルを参照し、ユーザーのOCIDを入力
- **tenancy_ocid**：先ほどメモを取った構成ファイルを参照し、使用しているテナンシーのOCIDを入力
- **private_key**：先程取得した秘密キーの内容をコピー&ペースト
- **fingerprint**：先ほどメモを取った構成ファイルを参照し、フィンガープリントを入力

```sql
BEGIN
    DBMS_CLOUD.CREATE_CREDENTIAL(
        credential_name => 'OBS_CRED',
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

## 3-3. プロファイルの作成
DBMS_CLOUD_AI.CREATE_PROFILEプロシージャを使用して、プロファイルを作成します。

- **プロファイル名**：OCIGENAI_ORACLE（任意）
- **provider**：oci（本チュートリアルではOCI生成AIサービスをAIプロバイダーとして使用）
- **credential_name**：OCI_GENAI_CRED（先ほど作成したクレデンシャル名を指定）
- **vector_index_name**：MY_INDEX（任意）
- **embedding_model**：cohere.embed-v4.0
- **temperature**：0（任意）
- **region** : ap-osaka-1(指定しない場合はus-chicago-1となります。大阪リージョンがサブスクライブされていない場合エラーとなります。)
- **model**：cohere.command-a-03-2025

```sql
BEGIN
  DBMS_CLOUD_AI.CREATE_PROFILE(
        profile_name =>'OCIGENAI_ORACLE',
        attributes   =>'{"provider": "oci",
          "credential_name": "OCI_GENAI_CRED",
          "vector_index_name": "MY_INDEX",
          "embedding_model": "cohere.embed-v4.0",
          "temperature": 0,
          "region": "ap-osaka-1",
          "model": "cohere.command-a-03-2025"
        }');
end;
/
```
## 3-4. ベクトル索引作成
DBMS_CLOUD_AI.CREATE_VECTOR_INDEXプロシージャを使用して、ベクトル索引を作成します。

- **索引名**：MY_INDEX（プロファイル作成時に指定した索引名）
- **vector_db_provider**：oracle
- **location**：先程作成したオブジェクトストレージのURI
- **object_storage_credential_name**：OBS_CRED（先ほど作成したオブジェクトストレージのクレデンシャル）
- **profile_name**：OCIGENAI_ORACLE（先程作成したプロファイル名）
- **vector_dimension**：1536
- **vector_distance_metric**：cosine
- **chunk_overlap**：128
- **chunk_size**：400
- **refresh_rate**：1（ベクトル索引を更新する間隔。本チュートリアルでは1分毎に索引を更新するように設定します）

```sql
BEGIN
       DBMS_CLOUD_AI.CREATE_VECTOR_INDEX(
         index_name  => 'MY_INDEX',
         attributes  => '{"vector_db_provider": "oracle",
                          "location": "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/xxxxxxxxx/b/xxxxxxxxxx/o/",
                          "object_storage_credential_name": "OBS_CRED",
                          "profile_name": "OCIGENAI_ORACLE",
                          "vector_dimension": 1536,
                          "vector_distance_metric": "cosine",
                          "chunk_overlap":128,
                          "chunk_size":400,
                          "refresh_rate":1
      }');
END;
/
```

## 3-5. プロファイルのセット

DBMS_CLOUD_AI.SET_PROFILEプロシージャを使用して、セッションで使用するAIプロファイルとして、先程作成したOCIGENAI_ORACLEを指定します。

```sql
EXEC DBMS_CLOUD_AI.SET_PROFILE('OCIGENAI_ORACLE');
```
これで準備が終わりました。

# 4. SELECT AI with RAGを試してみる
早速SELECT AI with RAGを試してみたいと思います。

1.　先ずはnarrateというアクション・キーワードを付けて、「OraBoosterとは」と質問してみます。

  ```sql
  SELECT AI narrate OraBoosterとは;


  RESPONSE
  --------------------------------------------------------------------------------
  "OraBooster は、当社が開発した革命的なロケットエンジンです。このエンジンは、宇宙探査の未来を形作る先進的な推進技術の象徴となっています。

  OraBooster の核心は、量子ダイナミックス・プラズマ・ブースターです。量子力学の原理を利用してプラズマを生成し、驚異的な速度で加速させます。これにより、従来の化学反応とは比べ物にならないほどの高い推力を実現し、遠方の惑星や星系への探査を可能にします。

  さらに、エンジンの外殻には、ナノファイバー製の超軽量かつ超強度の素材が使用されています。この革新的な素材は、過酷な宇宙空間の環境に耐え、高速飛行時の激しい熱や衝撃からロケットを守ります。

  また、ハイパーフォトン・ジャイロスコープを搭載しているため、ロケットの姿勢を非常に高い精度で制御し、目標物を確実に追跡することができます。これにより、長時間の宇宙飛行中でも安定した飛行を維持し、ミッションの成功を保障します。

  他にも、バイオニック・リアクション・レスポンダー・システムを搭載しており、人工知能と生体認識技術を組み合わせることで、ロケットの異常な振動や動きを検知し、自己修復機能を自動的に活性化します。

  OraBooster は、その革新的な技術と未来志向の設計によって、宇宙探査の新たな可能性を開拓します。優れた性能と信頼性は、人類の夢を支える強力なツールとなるでしょう。

  Sources:
    - rocket.txt (https://objectstorage.ap-tokyo-1.oraclecloud.com/n/orasejapan/b/select-ai-with-rag/o/rocket.txt)"
  ```

先程オブジェクトストレージにアップロードしたrocket.txtを基に、回答を生成してくれました。LLMが回答を生成するのに使用したソースも教えてくれます。

<br>

2.　次に、chatというアクション・キーワードを付けて「OraBoosterとは」と質問してみます。
    
  chatというアクション・キーワードを付けると、RAGを使用せずに一般的なAIチャット（データベースへの問合せは行わず、LLMから直接レスポンスを生成する）として回答を生成します。

  ```sql
  SELECT AI chat OraBoosterとは;


  RESPONSE
  --------------------------------------------------------------------------------
  "OraBooster は、Oracle データベースのパフォーマンスを最適化し、管理を簡素化するために設計された包括的なソフトウェア スイートです。これは、データベース管理者 (DBA) と Oracle ユーザーがデータベースの効率を高め、全体的なパフォーマンスを向上させるのに役立つ一連のツールとモジュールを提供します。

  OraBooster スイートには、通常、次の主要コンポーネントが含まれます。

  1. パフォーマンス最適化: OraBooster は、Oracle データベースのパフォーマンスを分析し、最適化するのに役立ちます。これには、クエリの最適化、索引の管理、リソース使用率の監視、ボトルネックの特定などのタスクが含まれます。パフォーマンス最適化モジュールには、データベースの効率を高めるための推奨事項と洞察を提供する分析ツールが含まれている場合があります。

  2. 自動化とメンテナンス: このスイートは、データベースのメンテナンス タスクの自動化を支援するように設計されています。これには、バックアップと復元、統計の管理、スペース管理、索引の再構築などの定期的なタスクのスケジュール設定と実行が含まれます。自動化モジュールにより、DBA の時間と労力が節約され、これらのタスクが確実に実行されます。

  3. 監視とアラート: OraBooster は、データベース アクティビティをリアルタイムで監視し、重要なパフォーマンス メトリックに関するアラートを提供します。これには、CPU 使用率、メモリ使用量、I/O アクティビティ、待機統計などの監視が含まれます。監視モジュールにより、DBA は潜在的な問題を迅速に特定して解決し、データベースの正常性を維持できます。

  4. 容量計画: このソフトウェアは、データベースの容量計画を支援し、将来の成長とリソース要件を予測するのに役立ちます。これには、データベースのサイズ、トランザクション量、ユーザー数の分析が含まれます。容量計画モジュールにより、組織は Oracle データベース インフラストラクチャを適切にスケーリングして管理できます。

  5. セキュリティとコンプライアンス: OraBooster は、Oracle データベースのセキュリティとコンプライアンスを強化する機能を提供する場合があります。これには、アクセス制御、監査、暗号化、データ マスキングなどのタスクが含まれます。セキュリティ モジュールにより、DBA は機密データを保護し、規制要件を遵守できます。

  6. レポートと分析: OraBooster は、データベースのパフォーマンス、使用状況、トレンドに関する詳細なレポートと分析を提供します。これらのレポートには、データベース管理、リソース割り当ての計画、パフォーマンスの問題の特定に役立つ洞察が含まれている場合があります。"
  ```

今回はRAGを使用せずに回答の生成をしたので、ハルシーネーションを起こしてしまっています。RAGがハルシネーションの軽減に大いに役に立っている事が分かりました。

※ハルシネーションが起きるため、SELECT AI chatの結果は、上記の内容と異なる返答になる可能性があります。

<br>

3.　次に、ベクター索引の自動更新機能を試してみたいと思います。

新たな製品AetherFlowsのデータをオブジェクト・ストレージに追加する前に、RAGを使用して質問をしてみたいと思います。

  ```sql
  SELECT AI narrate AetherFlowsの電力消費量はどの程度ですか？;


  RESPONSE
  --------------------------------------------------------------------------------
  "この質問に関連する情報は見つかりませんでした。

  Sources:
    - rocket.txt (https://objectstorage.ap-tokyo-1.oraclecloud.com/n/orasejapan/b/select-ai-with-rag/o/rocket.txt)"
  ```

AetherFlowsという架空の製品についての情報はまだオブジェクトストレージに追加していないため「この質問に関連する情報は見つかりませんでした」という回答が生成されます。

<br>

4.　次に、AetherFlowsという架空の製品についての通話ログをオブジェクトストレージに追加します。

[こちら](/ocitutorials/ai-vector-search/ai-vector108-select-ai-with-rag/sample_calllog.csv)をクリックし、sample_calllogというCSVファイルをダウンロードします。

以下のような通話ログのデータが5件入っています。

| 通話ID | 日付       | 時間   | 発信者  | 受信者                | 通話内容                                                                                                                                                      |
| ------ | ---------- | ------ | ------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2001   | 2024/9/19  | 14:45  | 木村    | AetherFlows サポート | **木村:** 「AetherFlowsのフィルター交換頻度を教えてください。」<br>**AetherFlows:** 「フィルターは通常、6〜12ヶ月に一度交換を推奨しています。使用環境や空気の汚染度によって変動するため、システムのLEDインジケーターが交換時期をお知らせします。」<br>**木村:** 「オフィスで使っているのですが、交換頻度が早い気がします。何か原因があるのでしょうか？」<br>**AetherFlows:** 「おそらく空気中の粒子量が多いためです。必要に応じてフィルターの強化版にアップグレードすることも可能です。」 |


rocket.txtファイルをアップロードした時と同じように、作成したオブジェクトストレージにsample_calllog.csvをアップロードします。

ベクトル索引を作成する時に、refresh_rateで索引を自動更新する間隔を設定する事が出来ます。デフォルトは1440（分）で、24時間毎に索引が更新されます。先程ベクトル索引を作成した時に１と指定したので、1分間隔でベクトル索引が自動更新されます。

ベクトル索引が自動更新され、アップロードしたCSVファイルがベクターストアに格納されるまで1分待ちます。

<br>

5.　CSVファイルをアップロードしてから1分以上経過したら、ベクトル索引が自動更新されているか確認してみます。

再度、「AetherFlowsの電力消費量はどの程度ですか」と質問してみます。
今回は[DBMS_CLOUD_AI.GENERATE()](https://docs.oracle.com/en-us/iaas/autonomous-database-serverless/doc/dbms-cloud-ai-package.html#GUID-7B438E87-0E9A-4318-BA01-3BE1A5851229)を使用して質問します。

- **prompt**：自然言語の問い合わせ
- **profile_name**：作成したAIプロファイル
- **action**：使用するアクション・キーワード

  ```sql
  SELECT DBMS_CLOUD_AI.GENERATE(prompt     => 'AetherFlowsの電力消費量はどの程度ですか？',
                              profile_name => 'OCIGENAI_ORACLE',
                              action       => 'narrate')
  FROM dual;
  ```
  上記クエリを実行すると、以下のレスポンスが返ってきます。

  ```sql
  RESPONSE
  --------------------------------------------------------------------------------
  "AetherFlowsは省エネ設計を採用しており、1日24時間稼働しても電気代はおよそ200円程度です。自動オン/オフ機能を活用することで、電力をさらに節約できます。

  Sources:
    - sample_calllog.csv (https://objectstorage.ap-tokyo-1.oraclecloud.com/n/orasejapan/b/select-ai-with-rag/o/sample_calllog.csv)"
  ```

アップロードしたCSVファイル内の情報を基に回答を生成してくれました。

<br>

6.　最後に、RAGを使用しないでLLMが学習済みの情報のみを使って回答を生成してもらいます。

アクション・キーワードとしてchatを付けて、「AetherFlowsの電力消費量はどの程度ですか」と質問してみます。


  ```sql
  SELECT DBMS_CLOUD_AI.GENERATE(prompt     => 'AetherFlowsの電力消費量はどの程度ですか？',
                              profile_name => 'OCIGENAI_ORACLE',
                              action       => 'chat')
  FROM dual;
  ```

  上記クエリを実行すると、以下のレスポンスが返ってきます。

  ```sql
  RESPONSE
  --------------------------------------------------------------------------------
  "AetherFlows の電力消費量は、使用方法や構成によって異なります。 AetherFlows は、データセンターやクラウド環境で一般的に使用されるサーバーやネットワーク機器と同じ種類のハードウェア上で実行されるソフトウェア フレームワークです。

  AetherFlows の電力消費量は、次の要因によって主に影響されます。

  1. サーバー数: AetherFlows を実行しているサーバーの数が多いほど、電力消費量が増えます。

  2. サーバーの仕様: AetherFlows で使用されるサーバーのハードウェア仕様（CPU、メモリ、ストレージなど）によって電力消費量が異なります。高性能なサーバーは通常、より多くの電力を消費します。
  ```

LLMが一見それらしい回答を生成してくれましたが、AetherFlowsはソフトウェア フレームワークではないため、ハルシネーションがおきている事が分かります。

※ハルシネーションが起きるため、SELECT AI chatの結果は、上記の内容と異なる返答になる可能性があります。


SELECT AI機能にRAGを組み合わせると、回答を生成するのに使用したソースを教えてくれるだけでなく、ハルシネーションを防ぐこともできました。以上で、**SELECT AI with RAGを試してみよう**は終了です。

<BR>
