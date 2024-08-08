---
title: "104 :ファイル→テキスト→チャンク→ベクトルへの変換およびベクトル検索を使おう"
excerpt: "23ai free、ADB23ai(Always Free)を利用してファイルからテキストへ、テキストからチャンクへ、チャンクからベクトルデータへの変換、およびベクトルの検索について紹介します。"
order: "4_104"
layout: single
header:
  teaser: "/ai-vector-search/ai-vector104-file-to-embedding/ai-vector104-file-to-embedding-teaser.png"
  overlay_image: "/ai-vector-search/ai-vector104-file-to-embedding/ai-vector104-file-to-embedding-teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=797
---

<a id="anchor0"></a>

# はじめに

このチュートリアルでは、ファイルからテキストへ、テキストからチャンクへ、チャンクからベクトルデータへの変換、およびベクトルの検索について、ステップバイステップでの実行する方法をご紹介します。
23ai free、ADB23ai(Always Free)の両方でのやり方をご紹介します。
ファイルからテキストへ変換する関数セット(UTL_TO_TEXTおよびDBMS_VECTOR_CHAIN)を使用して、テキストをチャンク(UTL_TO_CHUNKS)に分割し、次にベクトル化モデルを使ってそれぞれのチャンクのベクトル(UTL_TO_EMBEDDINGS)を作成します。

 ![image1](image1.png)

## 0. 前提条件

ベクトル化処理ではOCI Generative AIのサービスを使用しますので、下記の前提条件を満たせる必要があります。

- 使用するOracle Databaseの環境があること
  - 23ai freeで実行する場合、Oracle Database 23ai Freeをインストールする済みであること
  
    ※インストール方法については、[102 : 仮想マシンへOracle Database 23ai Freeをインストールしてみよう](https://oracle-japan.github.io/ocitutorials/ai-vector-search/ai-vector102-23aifree-install/) を参照ください。

  - ADB23aiで実行する場合、Autonomous Database 23aiのインスタンスを構築済みであること。本記事では無償で使えるAlways Freeを使います。

    ※インスタンス作成方法については。[101 : Always Freeで23aiのADBインスタンスを作成してみよう](https://oracle-japan.github.io/ocitutorials/ai-vector-search/ai-vector101-always-free-adb/)をご参照ください。

- OCI GenAIのサービスをご利用いただけるChicagoのRegionはサブスクリプション済みであること。

<br>

**目次：**
- [はじめに](#はじめに)
  - [0. 前提条件](#0-前提条件)
  - [1. 事前準備](#1-事前準備)
- [Oracle Database 23ai free編](#oracle-database-23ai-free編)
  - [1-1. Oracle Database 23ai Free編-ファイルの格納](#1-1-oracle-database-23ai-free編-ファイルの格納)
  - [1-2. Oracle Database 23ai Free編-テキストへの変換](#1-2-oracle-database-23ai-free編-テキストへの変換)
  - [1-3. Oracle Database 23ai Free編-チャンクへの分割](#1-3-oracle-database-23ai-free編-チャンクへの分割)
  - [1-4. Oracle Database 23ai Free編-ベクトルデータへの変換](#1-4-oracle-database-23ai-free編-ベクトルデータへの変換)
  - [1-5. Oracle Database 23ai Free編-ベクトル検索の実行](#1-5-oracle-database-23ai-free編-ベクトル検索の実行)
- [ADB23ai Always Free編](#adb23ai-always-free編)
  - [2-1. ADB23ai Always Free編-ファイルの格納](#2-1-adb23ai-always-free編-ファイルの格納)
  - [2-2. ADB23ai Always Free編-テキストへの変換](#2-2-adb23ai-always-free編-テキストへの変換)
  - [2-3. ADB23ai Always Free編-チャンクへの分割](#2-3-adb23ai-always-free編-チャンクへの分割)
  - [2-4. ADB23ai Always Free編-ベクトルデータへの変換](#2-4-adb23ai-always-free編-ベクトルデータへの変換)
  - [2-5. ADB23ai Always Free編-ベクトル検索の実行](#2-5-adb23ai-always-free編-ベクトル検索の実行)

<br>

**所要時間 :** 約1時間

<a id="anchor1"></a>

##  1. 事前準備

使用するサンプルのPDFドキュメントを準備してください。
このチュートリアルで、[corporate-governance-202209-jp.pdf (oracle.com)](https://www.oracle.com/jp/a/ocom/docs/jp-investor-relations/corporate-governance-202209-jp.pdf)というサンプルPDFドキュメントを使用します。

ほかのファイルを使用する場合、コマンドの中にあるファイル名を実際のファイル名へ変更してください。

ADB23ai Always Freeで本チュートリアルを実行する場合は、これで事前準備は完了です。[ADB23ai Always Free編](#adb23ai-always-free編)からチュートリアルを開始できます。

Oracle Database 23ai Freeで実行する場合は下記の準備をしてください。

サンプルPDFドキュメントを以下の手順で仮想マシンへアップロードしてください。（もし違うファイルをアップロードする場合、WinSCPのようなSCPツールなどをご使用ください。）
Tera Term等のターミナルソフトを使い、仮想マシンに接続したあと、以下を実行します。

```sh
sudo su - oracle
--以下でNLS_LANGの設定をします。本チュートリアルでは日本語のデータセットを使用するので、以下を実行しSQL*Plusの文字コードを変更してください。
export NLS_LANG=Japanese_Japan.AL32UTF8
```

サンプルPDFドキュメントを取得します。

```sh
wget https://www.oracle.com/jp/a/ocom/docs/jp-investor-relations/corporate-governance-202209-jp.pdf
```

また、取り込み用のディレクトリを作成して、サンプルPDFドキュメントをコピーしてください。

```sh
mkdir -p /home/oracle/data/vec_dump
cp corporate-governance-202209-jp.pdf /home/oracle/data/vec_dump
```

OCIコンソールからOCI GenAIサービスにAPIコールするためのAPIキーを作成します。

OCIコンソールにアクセスして、右上のプロファイルからユーザー名を選択します。

![APIkey_1](APIkey_1.png)

左下の`リソース`から`APIキー`を選択します。

![APIkey_2](APIkey_2.png)

`APIキーの追加`をクリックします。

![APIkey_3](APIkey_3.png)

APIキー・ペアの生成（デフォルト）を選択し、秘密キーのダウンロードをした上で作成します。

![APIkey_4](APIkey_4.png)

こちらでAPIキーの作成は完了です。

作成APIキーのフィンガープリント等を[1-4. Oracle Database 23ai Free編-ベクトルデータへの変換](#1-4-oracle-database-23ai-free編-ベクトルデータへの変換)や、[2-1. ADB23ai Always Free編-ファイルの格納](#2-1-adb23ai-always-free編-ファイルの格納)、[2-4. ADB23ai Always Free編-ベクトルデータへの変換](#2-4-adb23ai-always-free編-ベクトルデータへの変換)で使用します。

なお、privateキーの値はダウンロードしたキーの中身を**改行を入れずに**指定する必要がありますので、ご注意ください。

また、その他の方法として、OCI CLIを利用したAPIキーの作成も可能です。

[501: OCICLIを利用したインスタンス操作](https://oracle-japan.github.io/ocitutorials/adb/adb501-ocicli/)を参照してください。

<br>


<a id="anchor2"></a>

# Oracle Database 23ai free編

## 1-1. Oracle Database 23ai Free編-ファイルの格納

SQL*Plusで、プラガブル・データベース(freepdb1)にSYSユーザーで接続します。

  ```
  sqlplus sys@localhost:1521/freepdb1 as sysdba
  ```

ローカルのテストユーザー(docuser)を作成し、必要な権限を付与します。

  ```
  -- 初回の実行では必要なし
  -- drop user docuser cascade;

  grant connect, ctxapp, unlimited tablespace, create credential, create procedure, create table to docuser identified by docuser;
  grant execute on sys.dmutil_lib to docuser;
  grant create mining model to docuser;

  BEGIN
    DBMS_NETWORK_ACL_ADMIN.APPEND_HOST_ACE(
      host => '*',
      ace => xs$ace_type(privilege_list => xs$name_list('connect'),
                        principal_name => 'docuser',
                        principal_type => xs_acl.ptype_db));
  END;
  / 
  ```

  出力:

  ```
  ユーザーが作成されました。
  権限付与が成功しました。
  ```

サーバー上にローカルディレクトリを作成します(サンプルPDFドキュメント格納用)。

  ```
  create or replace directory VEC_DUMP as '/home/oracle/data/vec_dump';
  ```

  出力:

  ```
  ディレクトリが作成されました。
  ```

必要な権限を付与します。

  ```
  grant read, write on directory VEC_DUMP to docuser;
  commit;
  ```

  出力:

  ```
  権限付与が成功しました。
  コミットが完了しました。
  ```

Oracle Databaseにテストユーザーとして接続します。

  ```
  sqlplus docuser/docuser@freepdb1
  ```

SQL*Plusの出力をよりわかりやすいように、SQL*Plusの環境設定を行います。

  ```
  SET ECHO ON
  SET FEEDBACK 1
  SET NUMWIDTH 10
  SET LINESIZE 80
  SET TRIMSPOOL ON
  SET TAB OFF
  SET PAGESIZE 10000
  SET LONG 10000
  ```

リレーショナルテーブル(`documentation_tab`)を作成し、そのテーブル内にPDFドキュメントを格納します。

  ```
  -- 初回の実行では必要なし
  -- drop table documentation_tab purge;

  CREATE TABLE documentation_tab (id number, data blob);
  INSERT INTO documentation_tab values(1, to_blob(bfilename('VEC_DUMP', 'corporate-governance-202209-jp.pdf')));
  commit;
  ```

  出力:

  ```
  表が作成されました。
  1行が作成されました。
  コミットが完了しました。
  ```

`documentation_tab`テーブルの`data`列に格納されているLOBデータの長さをバイト単位で取得します。

  ```
  SELECT dbms_lob.getlength(t.data) from documentation_tab t;
  ```

  出力:

  ```
  DBMS_LOB.GETLENGTH(T.DATA)
  --------------------------
                      310454

  1行が選択されました。
  ```

<br>

<a id="anchor3"></a>

## 1-2. Oracle Database 23ai Free編-テキストへの変換

`UTL_TO_TEXT`を実行してPDFドキュメントをテキスト形式に変換します。

  ```
  SELECT dbms_vector_chain.utl_to_text(dt.data) from documentation_tab dt;
  ```

  出力:

  ```
  DBMS_VECTOR_CHAIN.UTL_TO_TEXT(DT.DATA)
  --------------------------------------------------------------------------------
  コーポレートガバナンス
  CORPORATE
  GOVERNANCE
  ...
  1行が選択されました。
  ```

<br>

<a id="anchor4"></a>

## 1-3. Oracle Database 23ai Free編-チャンクへの分割

 精度のよい検索結果を得られるために、このチュートリアルでは、`UTL_TO_CHUNKS`のデフォルトのパラメータを以下のように調整しました。チャンクについての詳細説明は[こちら](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_vector_chain1.html#GUID-4E145629-7098-4C7C-804F-FC85D1F24240)をご参照ください。

  ```
  {"max": " 400", "overlap": "20%", "language": "JAPANESE", "normalize": "all"}
  ```

`UTL_TO_CHUNKS`を実行して、テキストドキュメントをチャンクに分割します。

  ```
  -- （オプション）デフォルトのパラメータで実行する。
  -- SELECT ct.* from documentation_tab dt, dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data)) ct;
  SELECT ct.* from documentation_tab dt, dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data), json('{"max": " 400", "overlap": "20%", "language": "JAPANESE", "normalize": "all"}')) ct;
  ```

  出力:

  ```
  COLUMN_VALUE
  --------------------------------------------------------------------------------
  {"chunk_id":1,"chunk_offset":14,"chunk_length":619,"chunk_da
  ta":"コーポレートガバナンス \nCORPORATE \nGOVERNANC
  E \nOracle \nCorporationJapan\n\n最終更新日:2
  022年9月13日 \n日本オラクル株式会社\n\n代表執行役 法務室 マネージ
  ング・カウンシル 内海 寛子 \n問合せ先:IR部 03-6834-6666 \
  n証券コード: \n4716\n\nhttp://www.oracle.com/
  jp/corporate/investor-relations/index.ht
  ml\n\n当社のコーポレート・ガバナンスの状況は以下のとおりです。\n\n
  Ⅰ\n\nコーポレート・ガバナンスに関する基本的な考え方及び資本構成、企業属性その他
  の基本情報\n\n1.基本的な考え方 \n当社は継続的に企業価値を高めていく
  上で、コーポレート・ガバナンスの確立は重要な課題であると考え、すべてのステークホ
  ルダーに対する経 \n営の責任を果たすべく、日本の法制度等に合致し、さらに親会社で
  あるオラクル・コーポレーションのコーポレート・ガバナンス方針に基づいた体制 \nの
  整備に努めております。 \nまた、従業員に対しては全世界のオラクル
  ・グループ共通の「Oracle \nCode \nofEthicsand \nBusiness
  \nConduct(倫理とビジネス行動規範に関する規"}
  ...
  {"chunk_id":62,"chunk_offset":29600,"chunk_length":471,"chun
  k_data":"業界経験 \nテクノロジー\n\nデータセキュリティ・\n\n
  リスクマネージメント\n\nファイナンス\n\n法務・コンプライア\n\nン
  ス・コーポレートガバナンス\n\nエグゼクティブリーダーシップ・タレント\n\nディ
  ベロップメント・ダイバーシティ&イ\n\nンクルージョン\n\n三澤 \n智
  光 \n〇 \n〇 \n〇 \n〇 \n〇\n\nクリシュナ・シヴァラマン\n\n〇
  \n〇 \n〇 \n〇\n\nギャレット・イルグ \n〇 \n〇 \n〇 \n
  〇 \n〇\n\nヴィンセント・エス・グレリ\n\n〇 \n〇 \n〇 \n〇\
  n\nキンバリー・ウーリー \n〇 \n〇 \n〇 \n〇\n\n藤森 \n義明
  \n〇 \n〇\n\nジョン・エル・ホール \n〇 \n〇 \n〇 \n〇\n
  \n夏野 \n剛 \n〇 \n〇 \n〇\n\n⿊⽥ \n由貴子 \n〇 \n〇
  "}


  62行が選択されました。
  ```

<br>

<a id="anchor5"></a>

## 1-4. Oracle Database 23ai Free編-ベクトルデータへの変換

チャンクをベクトルデータに変換します。まずは、OCI GenAIサービスにアクセスするためのクレデンシャルを作成します。
冒頭で取得した文字列をprivate_keyに記入して、API署名キーの生成で取得したuser_ocid、tenancy_ocid、fingerprintおよびcompartment_ocidを設定して実行してください。

  ```
  -- 初回の実行では必要なし
  -- exec dbms_vector.drop_credential('OCI_CRED');
  declare
  jo json_object_t;
  begin
  -- create an OCI credential
  jo := json_object_t();
  jo.put('user_ocid', 'user ocid value');
  jo.put('tenancy_ocid', 'tenancy ocid value');
  jo.put('compartment_ocid', 'compartment ocid value');
  jo.put('private_key', 'private key value');
  jo.put('fingerprint', 'fingerprint value');
  dbms_output.put_line(jo.to_string);
  dbms_vector.create_credential(
    credential_name => 'OCI_CRED',
    params          => json(jo.to_string));
  end;
  /
  ```

  出力:

  ```
  PL/SQLプロシージャが正常に完了しました。
  ```

OCI GenAIサービスを利用するためのパラメータを設定します。

  ```
  var embed_genai_params clob;
  exec :embed_genai_params := '{"provider": "ocigenai", "credential_name": "OCI_CRED", "url": "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com/20231130/actions/embedText", "model": "cohere.embed-multilingual-v3.0"}';
  ```

上記の設定を検証してみます。

  ```
  select et.* from dbms_vector_chain.utl_to_embeddings('hello', json(:embed_genai_params)) et;
  ```

  出力:

  ```
  COLUMN_VALUE
  --------------------------------------------------------------------------------
  {"embed_id":"1","embed_data":"hello","embed_vector":"[0.0035
  934448,0.028701782,0.031051636,-0.001415
  ...
  1行が選択されました。
  ```

（オプション）`UTL_TO_EMBEDDINGS`を実行して、チャンクをベクトルデータに変換します。

  > こちらのSQL文は単なく検索処理で、変換されたベクトル情報はテーブルに保存されません。

  ```
  SELECT et.* from 
  documentation_tab dt,
  dbms_vector_chain.utl_to_embeddings(dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data), json('{"max": " 400", "overlap": "20%", "language": "JAPANESE", "normalize": "all"}')), json(:embed_genai_params)) et;
  ```

  出力:

  ```
  ...
  62行が選択されました。
  ```


 `UTL_TO_EMBEDDINGS`を実行して、チャンクをベクトルデータに変換して、`doc_chunks`テーブルに保存します。

  >  注意：処理する件数によって時間がかかる場合があります。

  ```
  create table doc_chunks as
  with t_chunk as (
  select dt.id as doc_id, et.chunk_id as embed_id, et.chunk_data as embed_data
  from
    documentation_tab dt,
      dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data), 
      json('{"max": "400", "overlap": "20%", "language": "JAPANESE", "normalize": "all"}')) t, JSON_TABLE(t.column_value, '$[*]' COLUMNS (chunk_id NUMBER PATH '$.chunk_id', chunk_data VARCHAR2(4000) PATH '$.chunk_data')) et
  where dt.id = 1),
  t_embed as (
  select dt.id as doc_id, rownum as embed_id, to_vector(t.column_value) as embed_vector
  from
    documentation_tab dt,
    dbms_vector_chain.utl_to_embeddings(
      dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data), 
      json('{"max": "400", "overlap": "20%", "language": "JAPANESE", "normalize": "all"}')), json('{"provider": "ocigenai", "credential_name": "OCI_CRED", "url": "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com/20231130/actions/embedText", "model": "cohere.embed-multilingual-v3.0"}')) t
  where dt.id = 1)
  select t_chunk.doc_id doc_id, t_chunk.embed_id as embed_id, t_chunk.embed_data as embed_data, t_embed.embed_vector as embed_vector
  from t_chunk
  join t_embed on t_chunk.doc_id = t_embed.doc_id and t_chunk.embed_id = t_embed.embed_id;
  ```

  出力:

  ```
  表が作成されました。
  ```

<br>

<a id="anchor6"></a>

## 1-5. Oracle Database 23ai Free編-ベクトル検索の実行

 ベクトル検索を実行します。

  ```
  SELECT doc_id, embed_id, embed_data
  FROM doc_chunks
  ORDER BY vector_distance(embed_vector , (SELECT to_vector(et.embed_vector) embed_vector
  FROM
  dbms_vector_chain.utl_to_embeddings('コーポレート・ガバナンスに関する基本的な考え方', JSON(:embed_genai_params)) t,
  JSON_TABLE ( t.column_value, '$[*]'
  COLUMNS (
  embed_id NUMBER PATH '$.embed_id', embed_data VARCHAR2 ( 4000 ) PATH '$.embed_data', embed_vector CLOB PATH '$.embed_vector'
  ))et), COSINE)
  FETCH EXACT FIRST 4 ROWS ONLY;
  ```

  出力:

  ```
      DOC_ID   EMBED_ID
  ---------- ----------
  EMBED_DATA
  --------------------------------------------------------------------------------
          1         15
  値向上と、循環型経済の実現に向けITの側面から支援します。(5)ビジネスパートナーと
  のエコシステムを強化当社とステークホルダーの強みを合
  わせ、イニシアチブを推進します。
  ...
  よび会計監査人は、それぞれ監査委員と適宜会合を持
  ち、当社が対処すべき課題、監査委員会による監査の環境整備の状況、監査上の重要課題
  等について意見を交換し、代表執行役、会計監査人
  および監査委員の間で相互認識を深める体制をとっております。


  4行が選択されました。
  ```

  <br>

<a id="anchor7"></a>

# ADB23ai Always Free編

## 2-1. ADB23ai Always Free編-ファイルの格納

ここからはADB23aiを使って、チュートリアルの内容を行います。

まずは、ファイルをオブジェクトストレージに格納します。手順は[OCIオブジェクトストレージへのデータアップロード](https://oracle-japan.github.io/ocitutorials/adb/adb102-dataload/#2-2-oci%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%B9%E3%83%88%E3%83%AC%E3%83%BC%E3%82%B8%E3%81%B8%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%82%A2%E3%83%83%E3%83%97%E3%83%AD%E3%83%BC%E3%83%89)をご参照ください。

※オブジェクトの詳細から、ファイル名まで含んだオブジェクトのURLパスをメモ帳などにあらかじめ保存してください。のちの手順で使用します。

ADBのコンソール画面から、ADMINユーザーでDatabase Actionsにアクセスをし、ローカルのテストユーザー(docuser)を作成します。
Database Actionsからのユーザー作成方法については、[101: ADBインスタンスを作成してみよう, 3. Database Actionsで操作してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/#3-database-actions%E3%81%A7%E6%93%8D%E4%BD%9C%E3%81%97%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86)をご参照ください。

ユーザー作成画面では以下のように設定してください。
* ユーザー名：DOCUSER
* パスワード：Welcome12345# (例)
* 表領域の割り当て制限：UNLIMITED
* Webアクセス：トグルをON

Database Actionsの開発カテゴリのSQLのツールにて以下のように設定し、DOCUSERに対して必要な権限を付与します。
  ```sql
  grant connect, ctxapp, dwrole to docuser;
  grant execute on DBMS_CLOUD_AI to docuser;
  grant execute on DBMS_VECTOR to docuser;
  grant execute on DBMS_VECTOR_CHAIN to docuser;
  
  BEGIN
    DBMS_NETWORK_ACL_ADMIN.APPEND_HOST_ACE(
      host => '*',
      ace => xs$ace_type(privilege_list => xs$name_list('connect'),
                        principal_name => 'docuser',
                        principal_type => xs_acl.ptype_db));
  END;
  /
  ```

  出力:

  ```sh
  権限付与が成功しました。
  ```

Database ActionsにDOCUSERユーザーとして接続します。


リレーショナルテーブル(`documentation_tab`)を作成し、オブジェクトストレージからサンプル・ドキュメントをロードするためのクレデンシャル作成をします。
冒頭で取得した文字列をprivate_keyに記入して、API署名キーの生成で取得したuser_ocid、tenancy_ocid、fingerprintを記入して実行してください。


 ```sql
  -- 初回の実行では必要なし
  -- drop table documentation_tab purge;

  CREATE TABLE documentation_tab (id number, data blob);
  BEGIN  
    DBMS_CLOUD.CREATE_CREDENTIAL (
        credential_name => 'credential name',
        --例: ADMIN_CRED
        user_ocid => 'user ocid value',
        tenancy_ocid => 'tenancy ocid value',
        private_key => 'private key value',
        fingerprint => 'fingerprint value');
  END;
  /
 ```

  出力:

  ```sh
  表が作成されました。
  PL/SQLプロシージャが正常に完了しました。
  ```

PDFドキュメントをDBMS_CLOUD.GET_OBJECTでBLOBとしてGETし、documentation_tabテーブル内に格納します。
object_uriには前に手順でメモをしたURIパスを入力します。

 ```sql
    DECLARE
    l_blob BLOB := NULL;
    BEGIN
    l_blob := DBMS_CLOUD.GET_OBJECT(
        credential_name => 'credential name', --設定したクレデンシャル名をcredential nameに入力
        object_uri => 'https://objectstorage.xxxxxxxxxxxx.oraclecloud.com/xxxxxxxxxxxxxxxxxx/corporate-governance-202209-jp.pdf');
    INSERT INTO documentation_tab values(1, l_blob);
    commit;
    END;
    /
 ```

  出力:

  ```sh
  1行が作成されました。
  コミットが完了しました。
  ```

`documentation_tab`テーブルの`data`列に格納されているLOBデータの長さをバイト単位で取得します。

  ```sql
  SELECT dbms_lob.getlength(t.data) from documentation_tab t;
  ```

  出力:

  ```sh
  DBMS_LOB.GETLENGTH(T.DATA)
  --------------------------
                      310454

  1行が選択されました。
  ```

<br>

<a id="anchor8"></a>

## 2-2. ADB23ai Always Free編-テキストへの変換

`UTL_TO_TEXT`を実行してPDFドキュメントをテキスト形式に変換します。

  ```sql
  SELECT dbms_vector_chain.utl_to_text(dt.data) from documentation_tab dt;
  ```

  出力:

  ```sh
  DBMS_VECTOR_CHAIN.UTL_TO_TEXT(DT.DATA)
  --------------------------------------------------------------------------------
  コーポレートガバナンス
  CORPORATE
  GOVERNANCE
  ...
  1行が選択されました。
  ```

<br>

<a id="anchor9"></a>

## 2-3. ADB23ai Always Free編-チャンクへの分割

 精度のよい検索結果を得られるために、このチュートリアルでは、`UTL_TO_CHUNKS`のデフォルトのパラメータを以下のように調整しました。チャンクについての詳細説明は[こちら](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_vector_chain1.html#GUID-4E145629-7098-4C7C-804F-FC85D1F24240)をご参照ください。

  ```
  {"max": " 400", "overlap": "20", "language": "JAPANESE", "normalize": "all"}
  ```

`UTL_TO_CHUNKS`を実行して、テキストドキュメントをチャンクに分割します。

  ```sql
  -- （オプション）デフォルトのパラメータで実行する。
  -- SELECT ct.* from documentation_tab dt, dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data)) ct;
  SELECT ct.* from documentation_tab dt, dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data), json('{"max": " 400", "overlap": "20", "language": "JAPANESE", "normalize": "all"}')) ct;
  ```

  出力:

  ```sh
  COLUMN_VALUE
  --------------------------------------------------------------------------------
  {"chunk_id":1,"chunk_offset":14,"chunk_length":619,"chunk_da
  ta":"コーポレートガバナンス \nCORPORATE \nGOVERNANC
  E \nOracle \nCorporationJapan\n\n最終更新日:2
  022年9月13日 \n日本オラクル株式会社\n\n代表執行役 法務室 マネージ
  ング・カウンシル 内海 寛子 \n問合せ先:IR部 03-6834-6666 \
  n証券コード: \n4716\n\nhttp://www.oracle.com/
  jp/corporate/investor-relations/index.ht
  ml\n\n当社のコーポレート・ガバナンスの状況は以下のとおりです。\n\n
  Ⅰ\n\nコーポレート・ガバナンスに関する基本的な考え方及び資本構成、企業属性その他
  の基本情報\n\n1.基本的な考え方 \n当社は継続的に企業価値を高めていく
  上で、コーポレート・ガバナンスの確立は重要な課題であると考え、すべてのステークホ
  ルダーに対する経 \n営の責任を果たすべく、日本の法制度等に合致し、さらに親会社で
  あるオラクル・コーポレーションのコーポレート・ガバナンス方針に基づいた体制 \nの
  整備に努めております。 \nまた、従業員に対しては全世界のオラクル
  ・グループ共通の「Oracle \nCode \nofEthicsand \nBusiness
  \nConduct(倫理とビジネス行動規範に関する規"}
  ...
  {"chunk_id":62,"chunk_offset":29600,"chunk_length":471,"chun
  k_data":"業界経験 \nテクノロジー\n\nデータセキュリティ・\n\n
  リスクマネージメント\n\nファイナンス\n\n法務・コンプライア\n\nン
  ス・コーポレートガバナンス\n\nエグゼクティブリーダーシップ・タレント\n\nディ
  ベロップメント・ダイバーシティ&イ\n\nンクルージョン\n\n三澤 \n智
  光 \n〇 \n〇 \n〇 \n〇 \n〇\n\nクリシュナ・シヴァラマン\n\n〇
  \n〇 \n〇 \n〇\n\nギャレット・イルグ \n〇 \n〇 \n〇 \n
  〇 \n〇\n\nヴィンセント・エス・グレリ\n\n〇 \n〇 \n〇 \n〇\
  n\nキンバリー・ウーリー \n〇 \n〇 \n〇 \n〇\n\n藤森 \n義明
  \n〇 \n〇\n\nジョン・エル・ホール \n〇 \n〇 \n〇 \n〇\n
  \n夏野 \n剛 \n〇 \n〇 \n〇\n\n⿊⽥ \n由貴子 \n〇 \n〇
  "}


  62行が選択されました。
  ```

<br>

<a id="anchor10"></a>

## 2-4. ADB23ai Always Free編-ベクトルデータへの変換

チャンクをベクトルデータに変換します。まずは、OCI GenAIサービスにアクセスするためのクレデンシャルを作成します。
冒頭で取得した文字列をprivate_keyに記入して、API署名キーの生成で取得したuser_ocid、tenancy_ocid、fingerprintおよびcompartment_ocidを設定して実行してください。

  ```sql
  -- 初回の実行では必要なし
  -- exec dbms_vector.drop_credential('OCI_CRED');
  declare
  jo json_object_t;
  begin
  -- create an OCI credential
  jo := json_object_t();
  jo.put('user_ocid', 'user ocid value');
  jo.put('tenancy_ocid', 'tenancy ocid value');
  jo.put('compartment_ocid', 'compartment ocid value');
  jo.put('private_key', 'private key value');
  jo.put('fingerprint', 'fingerprint value');
  dbms_output.put_line(jo.to_string);
  dbms_vector.create_credential(
    credential_name => 'OCI_CRED',
    params          => json(jo.to_string));
  end;
  /
  ```

  出力:

  ```sh
  PL/SQLプロシージャが正常に完了しました。
  ```

 `UTL_TO_EMBEDDINGS`を実行して、チャンクをベクトルデータに変換して、`doc_chunks`テーブルに保存します。

  >  注意：処理する件数によって時間がかかる場合があります。

  ```sql
  create table doc_chunks as
    with t_chunk as (
    select dt.id as doc_id, et.chunk_id as embed_id, et.chunk_data as embed_data
    from
      documentation_tab dt,
        dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data), 
        json('{"max": "400", "overlap": "20", "language": "JAPANESE", "normalize": "all"}')) t, JSON_TABLE(t.column_value, '$[*]' COLUMNS (chunk_id NUMBER PATH '$.chunk_id', chunk_data VARCHAR2(4000) PATH '$.chunk_data')) et
    where dt.id = 1),
    t_embed as (
    select dt.id as doc_id, rownum as embed_id, to_vector(t.column_value) as embed_vector
    from
      documentation_tab dt,
      dbms_vector_chain.utl_to_embeddings(
        dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data), 
        json('{"max": "400", "overlap": "20", "language": "JAPANESE", "normalize": "all"}')), json('{"provider": "ocigenai", "credential_name": "OCI_CRED", "url": "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com/20231130/actions/embedText", "model": "cohere.embed-multilingual-v3.0"}')) t
    where dt.id = 1)
    select t_chunk.doc_id doc_id, t_chunk.embed_id as embed_id, t_chunk.embed_data as embed_data, t_embed.embed_vector as embed_vector
    from t_chunk
    join t_embed on t_chunk.doc_id = t_embed.doc_id and t_chunk.embed_id = t_embed.embed_id;
  ```

  出力:

  ```sh
  表が作成されました。
  ```

<br>

<a id="anchor11"></a>

## 2-5. ADB23ai Always Free編-ベクトル検索の実行

 ベクトル検索を実行します。

  ```sql
  SELECT doc_id, embed_id, embed_data
  FROM doc_chunks
  ORDER BY vector_distance(embed_vector , (SELECT to_vector(et.embed_vector) embed_vector
  FROM
  dbms_vector_chain.utl_to_embeddings('コーポレート・ガバナンスに関する基本的な考え方', JSON('{"provider": "ocigenai", "credential_name": "OCI_CRED", "url": "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com/20231130/actions/embedText", "model": "cohere.embed-multilingual-v3.0"}')) t,
  JSON_TABLE (t.column_value, '$[*]'
  COLUMNS (
  embed_id NUMBER PATH '$.embed_id',
  embed_data VARCHAR2 ( 4000 ) PATH '$.embed_data',
  embed_vector CLOB PATH '$.embed_vector')) et), COSINE) FETCH EXACT FIRST 4 ROWS ONLY;
  ```

  出力:

  ```sh
      DOC_ID   EMBED_ID
  ---------- ----------
  EMBED_DATA
  --------------------------------------------------------------------------------
          1         15
  値向上と、循環型経済の実現に向けITの側面から支援します。(5)ビジネスパートナーと
  のエコシステムを強化当社とステークホルダーの強みを合
  わせ、イニシアチブを推進します。
  ...
  よび会計監査人は、それぞれ監査委員と適宜会合を持
  ち、当社が対処すべき課題、監査委員会による監査の環境整備の状況、監査上の重要課題
  等について意見を交換し、代表執行役、会計監査人
  および監査委員の間で相互認識を深める体制をとっております。


  4行が選択されました。
  ```

<br>

<a id="おわりに"></a>
以上、Oracle Database 23ai free、ADB23ai Always Freeを使って、ファイル→テキスト→チャンク→ベクトルデータへの変換、またベクトルの検索を完了しました。
