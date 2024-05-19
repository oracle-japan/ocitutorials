---
title: "105: マルチベクトル検索で複数のドキュメントを検索してみよう"
excerpt: "AI Vector Searchのマルチベクトル検索では、複数のドキュメントをグルーピングすることで、最も一致する上位Ｋ個のベクトルを同時に取得することができます。"

order: "4_105"
layout: single
header:
  teaser: "/ai-vector-search/ai-vector105-multi-vector-search/ai-vector105-teaser.png"
  overlay_image: "/ai-vector-search/ai-vector105-multi-vector-search/ai-vector105-teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474315
---

マルチベクトル検索は、データの特徴に基づくパーティションを用いたグルーピング基準を使って、最も一致する上位K個のベクトルを取得する手法です。
本章では、実際にサンプルデータを使って通常のベクトル検索と、マルチベクトル検索の違いやその有用性を確認します。

**所要時間 :** 約30分

**前提条件 :**

* Oracle Database 23ai Freeをインストールする済みであること
   <br>※インストール方法については、[102 : 仮想マシンへOracle Database 23ai Freeをインストールしてみよう](/ocitutorials/ai-vector-search/ai-vector102-23aifree-install){:target="_blank"} を参照ください。

* AI Vector Searchの基本的な操作を学習済みであること
   <br>[103 ~]()を参照ください。

* OCI Generative AI Serviceを使用できること
  - OCI GenAI Serviceをご利用いただけるChicago Regionはサブスクリプション済みであること。

  - OCI アカウントのAPI署名キーの生成は完了であること
  <br>以下の情報を取得してください。必要があれば、[API署名キーの生成方法](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/apisigningkey.htm#two)をご参照ください。
    - `user` - キー・ペアが追加されるユーザーのOCID。
    - `fingerprint` - 追加されたキーのフィンガープリント。
    - `tenancy` - テナンシのOCID。
    - `region` - コンソールで現在選択されているリージョン。
    - `key_file` - ダウンロードした秘密キー・ファイルへのパス。この値は、秘密キー・ファイルを保存したファイル・システム上のパスに更新する必要があります。
  - `compartment_ocid` - 利用するコンパートメントのOCIDを取得してください。

**目次：**

- [1. 事前準備](#1-事前準備)
- [2. ファイルの格納](#2-ファイルの格納)
- [3. テキストへの変換](#3-テキストへの変換)
- [4. チャンクへの分割](#4-チャンクへの分割)
- [5. ベクトル化](#5-ベクトル化)
- [6. シングルベクトル検索の実行](#6-シングルベクトル検索の実行)
- [7. マルチベクトル検索の実行](#7-マルチベクトル検索の実行)

<br>


<a id="anchor1"></a>

# 1. 事前準備

SQL\*Plusで、プラガブル・データベース(freepdb1)にSYSユーザーで接続します。

```sql
sqlplus sys@localhost:1521/freepdb1 as sysdba
```

テストユーザー(multi_vector)を作成し、必要な権限を付与します。

```sql
grant connect, ctxapp, unlimited tablespace, create credential, create procedure, create table to multi_vector identified by multi_vector;
grant execute on sys.dmutil_lib to multi_vector;
grant create mining model to multi_vector;

BEGIN
  DBMS_NETWORK_ACL_ADMIN.APPEND_HOST_ACE(
    host => '*',
    ace => xs$ace_type(privilege_list => xs$name_list('connect'),
                       principal_name => 'multi_vector',
                       principal_type => xs_acl.ptype_db));
END;
/ 
```

サーバー上にローカルディレクトリを作成します(サンプルPDFドキュメント格納用)。

```sql
create or replace directory VEC_DUMP as '/home/oracle/data/vec_dump';
```

必要な権限を付与します。

```sql
grant read, write on directory VEC_DUMP to multi_vector;
commit;
```

一度ログアウトします。
```
exit
```

サンプルデータをダウンロードします。
```sh
cd /home/oracle/data/vec_dump
```

```sh
wget https://oracle-japan.github.io/ocitutorials/ai-vector-search/ai-vector105-multi-vector-search/sample_data.zip
unzip sample_data.zip
```

`MULTI_VECTOR`でDBに接続します。

```sql
sqlplus multi_vector/multi_vector@freepdb1
```

SQL\*Plusの出力をよりわかりやすいように、SQL\*Plusの環境設定を行います。

```
SET ECHO ON
SET FEEDBACK 1
SET NUMWIDTH 10
SET LINESIZE 80
SET TRIMSPOOL ON
SET TAB OFF
SET PAGESIZE 10000
SET LONG 10000
SET TIMING ON
```

<br>

<a id="anchor1"></a>

# 2. ファイルの格納
テーブル`documentation_tab`を作成し、そのテーブル内にサンプル・ドキュメントを格納します。

```sql
CREATE TABLE documentation_tab (id number, data blob);
INSERT INTO documentation_tab values(1, to_blob(bfilename('VEC_DUMP', 'sample_data1.docx')));
INSERT INTO documentation_tab values(2, to_blob(bfilename('VEC_DUMP', 'sample_data2.docx')));
INSERT INTO documentation_tab values(3, to_blob(bfilename('VEC_DUMP', 'sample_data3.docx')));
COMMIT;
```

正しくロードされているか確認するため、`documentation_tab`表の`data`列に格納されているLOBデータの長さをバイト単位で取得します。
```sql
SELECT dbms_lob.getlength(dt.data) from documentation_tab dt where dt.id = 1;
```

以下のように表示されればOKです。
```
DBMS_LOB.GETLENGTH(DT.DATA) 
--------------------------- 
                      17796
```

<br>

<a id="anchor2"></a>

# 3. テキストへの変換
`UTL_TO_TEXT`を実行してサンプルドキュメントをテキスト形式に変換します。
```sql
SELECT dbms_vector_chain.utl_to_text(dt.data) from documentation_tab dt where dt.id = 1;
```

以下のように表示されればOKです。
```
DBMS_VECTOR_CHAIN.UTL_TO_TEXT(DT.DATA)
------------------------------------------------------------ 
彼は新しいプロジェクトの提案で成功を収めました。

美術館では現代アートの展示会が開催されています。

...
1行が選択されました。
```

クエリ結果が????と表示される場合は以下で`NLS_LANG`の設定をしたうえで実行してください。
```sh
export NLS_LANG=Japanese_Japan.AL32UTF8
```

<br>

<a id="anchor3"></a>

# 4. チャンクへの分割
`UTL_TO_CHUNKS`を実行して、テキストをチャンクに分割します。

今回は、カスタマイズしたパラメータ `{"max": "35", "overlap": "0", "language": "JAPANESE", "normalize": "all"}` で実行します。ほかのドキュメントを使用する場合、必要に応じて、パラメータを調整してください。チャンクについての詳細説明は[こちら](https://docs.oracle.com/en/database/oracle/oracle-database/23/arpls/dbms_vector_chain1.html#GUID-4E145629-7098-4C7C-804F-FC85D1F24240)をご参照ください。

```sql
SELECT ct.* from documentation_tab dt, dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data), json('{"max": "35", "overlap": "0", "language": "JAPANESE", "normalize": "all"}')) ct where dt.id = 1;
```

以下のように表示されればOKです。
```
COLUMN_VALUE
-------------------------------------------------------------------------------------
{"chunk_id":1,"chunk_offset":5,"chunk_length":28,"chunk_data":"彼は新しいプロジェクトの提案で成功を収めました。"}             

...

{"chunk_id":10,"chunk_offset":285,"chunk_length":37,"chunk_data":"伝統的な工芸品を現代のデザインで再解釈する動きが注目されています。"} 

10行が選択されました。
```

<br>

<a id="anchor4"></a>

# 5. ベクトル化
まずは、OCI GenAIサービスにアクセスするためのクレデンシャルを作成します。
```sql
declare
 jo json_object_t;
begin
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

本チュートリアルでは2つのテーブルを使用します。
```sql
CREATE TABLE doc_queries (
    query VARCHAR2(255),
    embedding VECTOR
);

CREATE TABLE doc_chunks (
    doc_id NUMBER,
    embed_id NUMBER,
    embed_data VARCHAR2(4000),
    embed_vector VECTOR
);
```

`UTL_TO_EMBEDDINGS`を実行して、各チャンクをベクトルデータに変換して、`doc_chunks`テーブルに保存します。

```sql
INSERT INTO doc_chunks(doc_id, embed_id, embed_data) 
select dt.id as doc_id, et.chunk_id as embed_id, et.chunk_data as embed_data
from
  documentation_tab dt,
    dbms_vector_chain.utl_to_chunks(dbms_vector_chain.utl_to_text(dt.data), 
    json('{"max": "35", "overlap": "0", "language": "JAPANESE", "normalize": "all"}')) t, JSON_TABLE(t.column_value, '$[*]' COLUMNS (chunk_id NUMBER PATH '$.chunk_id', chunk_data VARCHAR2(4000) PATH '$.chunk_data')) et;

UPDATE doc_chunks
SET embed_vector = dbms_vector_chain.utl_to_embedding(embed_data, json('{"provider": "ocigenai", "credential_name": "OCI_CRED", "url": "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com/20231130/actions/embedText", "model": "cohere.embed-multilingual-v3.0"}')
);

COMMIT;
```

`doc_queries`テーブルにサンプル・データを登録します。

```sql
INSERT INTO doc_queries (query, embedding)
select et.embed_data query, to_vector(et.embed_vector) embedding
from dbms_vector_chain.utl_to_embeddings('彼は新しいプロジェクトの提案で成功を収めました。', json('{"provider": "ocigenai", "credential_name": "OCI_CRED", "url": "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com/20231130/actions/embedText", "model": "cohere.embed-multilingual-v3.0"}')) t, JSON_TABLE(t.column_value, '$[*]' COLUMNS (embed_data VARCHAR2(4000) PATH '$.embed_data', embed_vector CLOB PATH '$.embed_vector')) et;

COMMIT;
```

<br>

<a id="anchor5"></a>

# 6. シングルベクトル検索の実行
まずは通常のシングルベクター検索を実行してみます。

```sql
SELECT doc_id, embed_id, embed_data
FROM doc_chunks
ORDER BY vector_distance(embed_vector, (SELECT embedding FROM doc_queries WHERE query = '彼は新しいプロジェクトの提案で成功を収めました。'), COSINE)
FETCH FIRST 10 ROWS ONLY;
```

出力:

```
    DOC_ID   EMBED_ID
---------- ----------
EMBED_DATA
--------------------------------------------------------------------------------
         1          1
彼は新しいプロジェクトの提案で成功を収めました。

         1          8
彼女は環境保護活動に積極的に参加しています。

         1         10
伝統的な工芸品を現代のデザインで再解釈する動きが注目されています。

         2          6
この小説は心温まるストーリーが特徴です。

         2          2
新しいカフェが駅前にオープンしました。

         3          2
素敵なレストランを見つけました! ぜひ行ってみてください!

...

         2          4
世界各国から観光客がこの歴史的な建物を訪れます。

10行が選択されました。
```

この例ではDOC_IDが1, 2, 3のチャンクの内から、「彼は新しいプロジェクトの提案で成功を収めました。」に意味的に近いチャンクが結果として出力されています。

<br>

<a id="anchor6"></a>

# 7. マルチベクトル検索の実行
続いてマルチベクター検索を実行してみます。

たとえば、最初の2つの最も関連する文書の中で、最初の10つの最も関連する文章を見つけるために、次のSQL文を使用できます。

```sql
SELECT doc_id, embed_id, embed_data
FROM doc_chunks
ORDER BY vector_distance(embed_vector, (SELECT embedding FROM doc_queries WHERE query = '彼は新しいプロジェクトの提案で成功を収めました。'), COSINE)
FETCH FIRST 2 PARTITIONS BY doc_id, 10 ROWS ONLY;
```

出力:

```
    DOC_ID   EMBED_ID
---------- ----------
EMBED_DATA
--------------------------------------------------------------------------------
         1          1
彼は新しいプロジェクトの提案で成功を収めました。

         1          8
彼女は環境保護活動に積極的に参加しています。

         1         10
伝統的な工芸品を現代のデザインで再解釈する動きが注目されています。

         2          6
この小説は心温まるストーリーが特徴です。

...

         2          9
スマートフォンの使用が睡眠に与える影響が研究されています。

20行が選択されました。
```

この例では`FETCH FIRST 2 PARTITIONS BY DOC_ID`と指定することで、DOC_IDが1, 2の各チャンクから「彼は新しいプロジェクトの提案で成功を収めました。」に意味的に近いチャンクをそれぞれ10個ずつ検索するため、結果は20行として返されます。
DOC_IDが3のチャンクは出力されません。

なお、特定のDOC_IDの各チャンクから検索したい場合、WHERE句でDOC_IDを絞り込むことができます。

例: DOC_IDが2, 3のチャンクの中から「彼は新しいプロジェクトの提案で成功を収めました。」に意味的に近い文章を10個ずつ検索
```
SELECT doc_id, embed_id, embed_data
FROM doc_chunks
WHERE DOC_ID IN (2, 3)
ORDER BY vector_distance(embed_vector, (SELECT embedding FROM doc_queries WHERE query = '彼は新しいプロジェクトの提案で成功を収めました。'), COSINE)
FETCH FIRST 2 PARTITIONS BY doc_id, 10 ROWS ONLY;
```

このようにマルチベクター検索を使用することで、「1人の個人に関する複数の写真がある表に対して、最も一致する上位K枚の写真を返す。ただしそれらは異なる人物の写真である。」というような条件を加えたクエリを実行することができます。
また、複数の異なる文書データの中から確実にX個ずつ検索したい場合に有効に働きます。

<br>

<a id="anchor7"></a>

以上で、この章の作業は終了です。