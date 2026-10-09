---
title: "202: LakehouseのCSVをInnoDBマスターとJOINする"
description: "Object StorageのCSVをHeatWave Lakehouseへロードし、通常のInnoDB表にあるカテゴリー名とJOINして、備品の利用履歴を集計します。"
params:
  author: "rkajiyama"
draft: false
date: 2026-09-17
weight: 202
slug: "202-lakehouse-join"
---

利用履歴はObject StorageのCSV、カテゴリー名はMySQLの通常表にある、という構成で集計します。履歴をInnoDB表へ取り込まずに、両方のデータをHeatWaveからJOINできることを確認します。

マスターはカテゴリーIDに名前を対応させる通常表です。JOINは共通のカテゴリーIDで履歴と名前を結び付ける処理です。Resource Principalは利用者の鍵ではなくDB自身としてサービスへアクセスする仕組みで、動的グループはそのDBをIAMで指定するための条件をまとめます。

## 前提と完成状態

MySQL 9.7.2、MySQL.2、HeatWave.32GBの1ノードを使用し、HeatWave Lakehouseを有効にします。専用schemaは`mhw_lakehouse_lab`です。[201章](../201-heatwave-analytics/)の分析用schemaや既存の備品台帳とは独立しています。

Object Storageには大阪リージョンの非公開・演習専用bucketを使用します。DB側の読取り、利用者のアップロード、SQLの表操作の権限を分けて準備します。管理者が専用bucketを作成し、その名前に限定した権限を設定してから、利用者がCSVをアップロードする順番です。

[参照SQL](202-lakehouse.sql)は本文と同じ段階実行用です。一括実行せず、存在確認とVALIDATEの結果を確認してから次のブロックを選択します。

## 接続を再開する場合だけ

同じ主DB接続が開いていれば再利用します。転送が閉じたら[101章](../101-create-connect/)の前面SSHを再開します。SQL用の別タブで次を実行します。`--mysql`はClassic protocol、`--sql`はSQLモード、`--ssl-mode=REQUIRED`はTLS必須を指定します。101章で保存した資格情報を使うため、通常はパスワードの再入力はありません。保存していない場合だけ末尾に `--password` を付け、非表示プロンプトへ入力します。

```bash
"$HOME/mysql-shell-community-26.7.1-el8/usr/bin/mysqlsh" --mysql --sql --host=127.0.0.1 --port=13306 \
  --user=tutorial_admin --ssl-mode=REQUIRED
```

新しいSQL接続では、記録した主DB UUID、両read-only値0、非空cipherを照合します。不一致なら後続を止めます。

```sql
SELECT @@server_uuid,@@read_only,@@super_read_only\G
SHOW SESSION STATUS LIKE 'Ssl_cipher';
```

## Lakehouseと権限を準備する

201の主DBを開き、Detailsタブの **MySQL HeatWave Lakehouse** の状態を確認します。無効なら同欄の **Edit** を選び、**Enable MySQL HeatWave Lakehouse** ダイアログで対象を確認して **Enable** を選びます。有効なら変更は不要です。更新中を完了扱いせず、Lakehouse有効、クラスタACTIVE、作業成功を確認してからロードします。shapeとノード数はHeatWave.32GB × 1を維持します。[公式の有効化手順](https://docs.oracle.com/en-us/iaas/mysql-database/doc/managing-heatwave-cluster.html)

![対象DBを確認してLakehouseを有効にする確認画面](202-lakehouse-enable.png)

![Lakehouseが有効でHeatWaveクラスタがアクティブになった状態](202-lakehouse-enabled.png)

Lakehouseの保存領域とObject Storage原本にも費用が発生します。クラスタの停止だけではLakehouse保存領域の課金は終わらないため、最終整理は[106章](../106-monitor-cleanup/)へ引き継ぎます。[課金](https://docs.oracle.com/en-us/iaas/mysql-database/doc/billing.html)

### IAM管理者が設定する読取り権限

非公開の演習専用bucketを事前に用意します。次の設定はIAM管理者が行い、既存設定が必要範囲を満たす場合は重複作成しません。DB用dynamic groupの一致ルールは、主DBのOCID一つだけに絞ります。

```text
ALL {resource.type = 'mysqldbsystem', resource.id = 'DB_OCID'}
```

DB_OCID、IdentityDomainName、LakehouseDBGroup、DataCompartment、TutorialBucketを実環境へ置換します。DataCompartmentはDBの区画ではなく、読むbucketが属する区画です。大文字小文字だけが異なる同名bucketは用意しないでください。

```text
Allow dynamic-group IdentityDomainName/LakehouseDBGroup to read buckets in compartment DataCompartment where target.bucket.name = 'TutorialBucket'
Allow dynamic-group IdentityDomainName/LakehouseDBGroup to read objects in compartment DataCompartment where target.bucket.name = 'TutorialBucket'
```

これでDBには対象bucketの読取りのみを許し、書込み・削除・PAR作成を与えません。今回のbucketには教材CSVだけを置きます。resource.id条件とbucket名条件で対象を狭めた設定であり、IAMポリシー全体にある別の許可が消えるわけではありません。[Resource Principalの読取り権限](https://dev.mysql.com/doc/heatwave/en/mys-hw-resource-principal.html)、[動的グループ条件](https://docs.oracle.com/en-us/iaas/Content/Identity/dynamicgroups/Writing_Matching_Rules_to_Define_Dynamic_Groups.htm)

### アップロードする利用者の権限

既存private bucketに教材objectを新規作成する限定例です。bucket作成やIAM変更は別の管理者が行います。

```text
Allow group IdentityDomainName/UploadGroup to inspect buckets in compartment DataCompartment
Allow group IdentityDomainName/UploadGroup to read buckets in compartment DataCompartment where target.bucket.name = 'TutorialBucket'
Allow group IdentityDomainName/UploadGroup to manage objects in compartment DataCompartment where all {target.bucket.name = 'TutorialBucket', any {request.permission = 'OBJECT_CREATE', request.permission = 'OBJECT_INSPECT'}}
```

この条件は新規作成と一覧だけを許可し、上書き・削除は含みません。同名objectがあれば停止して所有を確認します。[権限と条件](https://docs.oracle.com/en-us/iaas/Content/Identity/Reference/objectstoragepolicyreference.htm)

### SQL権限

DB管理者はmhw_lakehouse_labに対するCREATE/INSERT/SELECT/ALTERを確認します。後片付けのDROPは今回のschemaに限定します。通常表の操作権限と、外部表の作成・ロードに必要な権限を[Lakehouse権限](https://dev.mysql.com/doc/heatwave/en/hw-lh-privileges.html)とSHOW GRANTSで照合します。IAMはSQL権限の代わりにはなりません。

```sql
SHOW GRANTS;
```

## 1. CSVをObject Storageへ配置する

IAM管理者などbucket作成権限を持つ担当者が、大阪リージョンの演習用コンパートメントに専用bucketを用意します。名前の例は`mhw-tutorial-lakehouse`、ストレージ層は「標準」です。既存の同名bucketがある場合は、所有と用途を確認し、別用途のものを変更しません。

![標準ストレージ層の演習用bucketを作成する設定例](202-bucket-create.png)

作成後の詳細で、対象bucket名、ストレージ層「標準」、可視性「プライベート」を確認します。アップロード者の権限例にはbucket作成権限を含めていません。

![演習用bucketのストレージ層と非公開設定](202-bucket-private.png)

添付の[usage_history.csv](usage_history.csv)は400行の架空データと1行のヘッダーです。文字コードはUTF-8、区切りはカンマです。リンク先をファイルとして保存し、ファイル名が`usage_history.csv`、サイズが4741バイトであることを確認します。ブラウザで内容が表示された場合は「名前を付けて保存」を使い、表計算ソフトでは再保存しないでください。

列は利用ID・カテゴリーID・利用時間・保守費用です。既存objectは上書きせず、今回の固定CSVだけを単一URIで指定します。PARやAPIキーは不要です。

OCIコンソールのObject Storageで対象bucketを開き、アップロード画面のオブジェクト名のプレフィックスに`ch202/`を指定して、保存した`usage_history.csv`をアップロードします。最終的なオブジェクト名が`ch202/usage_history.csv`であることを確認し、`ch202/ch202/`のように重ねないでください。アップロード完了後に名前とサイズを確認してください。bucketを公開する必要はありません。後のSQLではbucket名とnamespaceを使うURIを指定します。

![ch202の下にusage_history.csvがアップロードされた一覧](202-csv-uploaded.png)

## 2. InnoDBマスターを作成する

SQL接続後、サーバーと既存schemaを確認します。

```sql
SELECT SCHEMA_NAME FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'mhw_lakehouse_lab';
```

同名schemaの検索が0行である場合に作成を進めます。すでに存在する場合は内容を調べ、途中から再開してください。

```sql
CREATE DATABASE mhw_lakehouse_lab;
```

スキーマ作成の成功を確認してから次へ進みます。DDLは暗黙のCOMMITを伴うため、後の失敗で自動的に取り消されるわけではありません。

```sql
CREATE TABLE mhw_lakehouse_lab.equipment_category (
  category_id INT NOT NULL PRIMARY KEY,
  category_name VARCHAR(20) NOT NULL
) ENGINE=InnoDB;
```

表作成が成功したら、投入前の件数を確認します。

```sql
SELECT COUNT(*) AS existing_rows FROM mhw_lakehouse_lab.equipment_category;
```

`existing_rows` が0の場合だけ次のトランザクションを実行します。

```sql
START TRANSACTION;
INSERT INTO mhw_lakehouse_lab.equipment_category VALUES
(1,'Laptop'), (2,'Monitor'), (3,'Printer'), (4,'Router');
```

INSERTが成功した場合だけCOMMITします。失敗した場合は同じ接続でROLLBACKし、状態を読取り確認します。COMMITの結果が不明なら、INSERTを再送せず既存4行を照合してください。

```sql
COMMIT;
SELECT * FROM mhw_lakehouse_lab.equipment_category ORDER BY category_id;
```

上の4行が一致すれば準備完了です。

JOINをHeatWaveで実行するため、通常表もHeatWaveへロードします。

```sql
ALTER TABLE mhw_lakehouse_lab.equipment_category SECONDARY_ENGINE=RAPID;
```

設定成功を確認した場合だけ、次のロードを実行します。

```sql
ALTER TABLE mhw_lakehouse_lab.equipment_category SECONDARY_LOAD;
SHOW WARNINGS;
```

警告を確認した後、カテゴリーIDと名前の2列がロード対象から除外されていないことを確認します。分析に使う列に`NOT SECONDARY`が付いていたら、先へ進まず原因を調べます。

```sql
SHOW CREATE TABLE mhw_lakehouse_lab.equipment_category\G
```

## 3. 外部表を作成してロードする

namespaceはテナンシのObject Storageを識別する値、bucket名はその中の保存先名です。Console右上のプロファイルメニューから **Tenancy: テナンシ名** を開き、詳細の **Object Storage namespace** を控えます。表示できない場合は管理者に確認し、コンパートメント名で代用しません。[namespaceの確認手順](https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/understandingnamespaces.htm)

`MY_BUCKET`と`MY_NAMESPACE`を実際の値へ置き換えてください。オブジェクト名は前節と同じ`ch202/usage_history.csv`です。`oci://`形式はDB側のresource principalでアクセスします。

```sql
-- MY_BUCKETとMY_NAMESPACEを実際の値に置換する。PARの秘密URLは使わない。
CREATE EXTERNAL TABLE mhw_lakehouse_lab.usage_history (
  usage_id INT NOT NULL PRIMARY KEY,
  category_id INT NOT NULL,
  hours_used INT NOT NULL,
  maintenance_cost INT NOT NULL
)
FILE_FORMAT = (FORMAT csv HEADER ON)
FILES = (URI = 'oci://MY_BUCKET@MY_NAMESPACE/ch202/usage_history.csv')
VERIFY_KEY_CONSTRAINTS = 1;
```

作成成功を確認したら、まず定義を確認します。4列とCSV設定・URIが入力値どおりであること、必要列に`NOT SECONDARY`が付いていないことを確認します。

```sql
SHOW CREATE TABLE mhw_lakehouse_lab.usage_history\G
```

一致した場合だけ、次で形式を検証します。

```sql
ALTER TABLE mhw_lakehouse_lab.usage_history SECONDARY_LOAD VALIDATE ALL ROWS ONLY;
SHOW WARNINGS;
```

ここで停止し、エラーと警告を確認します。列の不一致、読取りエラー、不足する権限があれば本ロードへ進みません。Guided Loadによる定義変更の通知も内容を確認し、意図した4列とCSV形式のままであることを照合します。VALIDATEはデータロードではありません。[検証とロード](https://dev.mysql.com/doc/heatwave/en/mys-hw-lakehouse-loading-data-manually.html)

```sql
SHOW CREATE TABLE mhw_lakehouse_lab.usage_history\G
```

検証が成功し、定義も一致している場合だけ、次の枠を実行します。

```sql
ALTER TABLE mhw_lakehouse_lab.usage_history SECONDARY_LOAD;
SHOW WARNINGS;
```

このCSVの`usage_id`は一意なので主キーにします。HAを実習したDBでは主キー必須設定が残る場合がありますが、設定を無効にする必要はありません。`VERIFY_KEY_CONSTRAINTS=1`は初回ロード時に主キー・一意キーを検証します。以後の再ロードやrefreshで継続的に検証する設定ではないため、この章では固定したCSVを使用し、件数・ID・集計も照合します。[外部表のキー検証](https://dev.mysql.com/doc/heatwave/en/mys-hw-lakehouse-table-syntax-sql.html)

## 4. CSVの件数と合計を確認する

```sql
SET SESSION use_secondary_engine = FORCED;
SELECT COUNT(*) AS row_count, COUNT(DISTINCT usage_id) AS distinct_ids,
       MIN(usage_id) AS min_id, MAX(usage_id) AS max_id,
       SUM(hours_used) AS hours_total, SUM(maintenance_cost) AS cost_total
FROM mhw_lakehouse_lab.usage_history;
SELECT category_id, COUNT(*) AS row_count
FROM mhw_lakehouse_lab.usage_history
GROUP BY category_id ORDER BY category_id;
```

最初のSELECTは次の値になります。

|row_count|distinct_ids|min_id|max_id|hours_total|cost_total|
|---:|---:|---:|---:|---:|---:|
|400|400|1|400|1800|120000|

![外部表の400行・一意なID・利用時間と保守費の合計](202-csv-totals.png)

カテゴリー別の件数は1〜4の各100行です。401行になった場合はヘッダー設定、件数が不足する場合はアップロードしたファイルとロード警告を確認します。

## 5. 通常表と外部表をJOINする

```sql
EXPLAIN SELECT c.category_id, c.category_name, COUNT(*) AS row_count,
       SUM(u.hours_used) AS hours_total, SUM(u.maintenance_cost) AS cost_total
FROM mhw_lakehouse_lab.usage_history u
JOIN mhw_lakehouse_lab.equipment_category c ON c.category_id=u.category_id
GROUP BY c.category_id, c.category_name
ORDER BY c.category_id;
SELECT c.category_id, c.category_name, COUNT(*) AS row_count,
       SUM(u.hours_used) AS hours_total, SUM(u.maintenance_cost) AS cost_total
FROM mhw_lakehouse_lab.usage_history u
JOIN mhw_lakehouse_lab.equipment_category c ON c.category_id=u.category_id
GROUP BY c.category_id, c.category_name
ORDER BY c.category_id;
```

EXPLAINがツリー形式なら`in secondary engine RAPID`、表形式ならExtraの`Using secondary engine RAPID`を確認し、SELECTの結果を次の表と照合します。

|category_id|category_name|row_count|hours_total|cost_total|
|---:|---|---:|---:|---:|
|1|Laptop|100|300|30000|
|2|Monitor|100|400|30000|
|3|Printer|100|500|30000|
|4|Router|100|600|30000|

JOIN後の件数を合計すると400行です。マスターの`category_id`は主キーで一意であり、履歴の`category_id`はすべて1〜4なので、欠落や多重計上は起きない構成です。利用時間はカテゴリー1で1時間と5時間が50行ずつ、合計300時間です。保守費は各カテゴリーで100〜500円が20回ずつ現れ、合計30000円になります。

```sql
SET SESSION use_secondary_engine = ON;
```

![両表でRAPIDを使うJOINの実行計画と4カテゴリーの集計結果](202-join-result.png)

上段の実行計画では、外部表と通常表の両方に`in secondary engine RAPID`が表示されています。下段の4行が実際の集計結果です。

## 6. うまくいかないとき

Object Storageの認可エラーでは、URIのnamespace・bucket名・オブジェクト名、DBを含むdynamic groupとread権限を確認します。resource principalが使えないことを理由にbucketを公開しないでください。

形式エラーはCSVのヘッダー・列順・改行・列の型を確認します。CSVを差し替えただけでロード済みの結果が更新されると考えず、更新時は改めてロードの手順と状態を確認します。JOINエラーは通常表と外部表の両方のロード状態、列型、実行計画を調べます。

## 7. 後片付け

検証が終わり、この章のデータが不要になったときだけ専用schemaを削除します。

```sql
DROP DATABASE mhw_lakehouse_lab;
```

schemaを削除してもObject Storageの原本CSVは残ります。保持方針に従って`ch202/usage_history.csv`を削除してください。他のobjectがあるbucket全体を削除しないようにします。後続章でクラスタやIAMを再利用する場合は保持し、利用終了後に今回追加した範囲を確認して後片付けします。

上のアップロード者ポリシーには削除権限がないため、原本の削除は対象objectの削除権限を持つ管理者へ依頼します。演習用に追加したdynamic group・policyの識別子を記録し、他用途がないと確認できたものだけ管理者が整理します。

この章の達成条件は、外部表の400行・合計が一致し、通常表とのJOINでも4カテゴリーの集計が一致することです。

## 参考資料

- [Lakehouse Requirements](https://dev.mysql.com/doc/heatwave/en/mys-hw-lakehouse-prereqs.html)
- [Resource Principals](https://docs.oracle.com/en-us/iaas/mysql-database/doc/resource-principals.html)
- [Use URI to Create External Tables Manually](https://dev.mysql.com/doc/heatwave/en/mys-hw-lakehouse-loading-data-uri.html)
- [Load Structured Data Manually](https://dev.mysql.com/doc/heatwave/en/mys-hw-lakehouse-loading-data-manually.html)

## 章の移動

[前章](../201-heatwave-analytics/) · [次章](../203-automl/)
