---
title: "104 :ファイル→テキスト→チャンク→ベクトルへの変換およびベクトル検索を使おう"
excerpt: "23ai freeを利用してファイルからテキストへ、テキストからチャンクへ、チャンクからベクトルデータへの変換、およびベクトルの検索について紹介します。"
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

ファイルからテキストへ変換する関数セット(UTL_TO_TEXTおよびDBMS_VECTOR_CHAIN)を使用して、テキストをチャンク(UTL_TO_CHUNKS)に分割し、次にベクトル化モデルを使ってそれぞれのチャンクのベクトル(UTL_TO_EMBEDDINGS)を作成します。

## 0. 前提条件

ベクトル化処理ではOCI GenAIのサービスを使用しますので、下記の前提条件を満たせる必要があります。

- Oracle Database 23ai Freeをインストールする済みであること
※インストール方法については、[102 : 仮想マシンへOracle Database 23ai Freeをインストールしてみよう](https://oracle-japan.github.io/ocitutorials/ai-vector-search/ai-vector102-23aifree-install/) を参照ください。
- OCI GenAIのサービスをご利用いただけるChicagoのRegionはサブスクリプション済みであること。

- OCI アカウントのAPI署名キーの生成は完了であること、以下の情報を取得してください。必要があれば、[API署名キーの生成方法](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/apisigningkey.htm#two)をご参照ください。
  - `user` - キー・ペアが追加されるユーザーのOCID。
  - `fingerprint` - 追加されたキーのフィンガープリント。
  - `tenancy` - テナンシのOCID。
  - `region` - コンソールで現在選択されているリージョン。
  - `key_file` - ダウンロードした秘密キー・ファイルへのパス。この値は、秘密キー・ファイルを保存したファイル・システム上のパスに更新する必要があります。
- `compartment_ocid` - 利用するコンパートメントのOCIDを取得してください。

<br>

**目次：**
- [1. 事前準備(ドキュメントの準備)](#anchor1)
- [2. ファイルの格納](#anchor2)
- [3. テキストへの変換](#anchor3)
- [4. チャンクへの分割](#anchor4)
- [5. ベクトルデータへの変換](#anchor5)
- [6. ベクトル検索の実行](#anchor6)
- [おわりに](#おわりに)

<br>

**所要時間 :** 約1時間

<a id="anchor1"></a>

##  1. 事前準備(ドキュメントの準備)

1つのサンプルPDFドキュメントを準備してください。
  このチュートリアルで、[corporate-governance-202209-jp.pdf (oracle.com)](https://www.oracle.com/jp/a/ocom/docs/jp-investor-relations/corporate-governance-202209-jp.pdf)というサンプルPDFドキュメントを使用しています。

  ほかのファイルをご使用する場合、コマンドの中にあるファイル名を実際のファイル名へ変更してください。

  サンプルPDFドキュメントを取得してください。（もし違うファイルをアップロードする場合、WinSCPのようなSCPツールなどをご使用ください。）
  Tera Term等を使い、コンピュートインスタンスに接続したあと、以下を実行します。

  ```
  sudo su - oracle
  --以下でNLS_LANGの設定をします。
  export NLS_LANG=Japanese_Japan.AL32UTF8
  ```

  サンプルPDFドキュメントを取得します。

  ```
  wget https://www.oracle.com/jp/a/ocom/docs/jp-investor-relations/corporate-governance-202209-jp.pdf
  ```

 また、取り込み用のディレクトリを作成して、サンプルPDFドキュメントをコピーしてください。

  ```
  mkdir -p /home/oracle/data/vec_dump
  cp corporate-governance-202209-jp.pdf /home/oracle/data/vec_dump
  ```
<br>

<a id="anchor2"></a>

## 2. ファイルの格納

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

リレーショナルテーブル(`documentation_tab`)を作成し、そのテーブル内にPDFドキュメント(たとえば、サンプルPDFドキュメント)を格納します。

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

## 3. テキストへの変換

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

## 4. チャンクへの分割

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

## 5. ベクトルデータへの変換

チャンクをベクトルデータに変換します。まずは、OCI GenAIサービスにアクセスするためのクレデンシャルを作成します。
冒頭で取得したの文字列をprivate_keyに記入して、API署名キーの生成で取得したuser_ocid、tenancy_ocid、fingerprintおよびcompartment_ocidを記入して実行してください。

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

## 6. ベクトル検索の実行

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

<a id="おわりに"></a>
以上、ファイル→テキスト→チャンク→ベクトルデータへの変換、またベクトルの検索は完了しました。