-- 段階実行用の参照SQL。一括source実行しない。本文の確認・停止条件に従い、各ブロックを個別に実行する。

-- ===== 本文SQLブロック 1。直前の結果を確認してから手動で選択する。 =====
-- 目的: 記録した主DBであり、現在のプライマリへ書き込めることを確認する。
SELECT VERSION() AS server_version, @@server_uuid AS server_uuid,
       CURRENT_USER() AS db_account, @@read_only AS read_only,
       @@super_read_only AS super_read_only\G
-- 目的: SQLセッションのTLS暗号化を確認する。
SHOW SESSION STATUS LIKE 'Ssl_cipher';

-- ===== 本文SQLブロック 2。直前の結果を確認してから手動で選択する。 =====
-- 目的: 接続ユーザーの実際の権限を確認し、必要な範囲と照合する。
SHOW GRANTS;

-- ===== 本文SQLブロック 3。直前の結果を確認してから手動で選択する。 =====
-- 目的: 接続中のサーバー版と利用者を記録する。
SELECT VERSION() AS server_version, CURRENT_USER() AS db_account;

-- 目的: 同名schemaとの衝突を調べる。結果が0行の場合だけ次へ進む。
SELECT SCHEMA_NAME FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'mhw_lakehouse_lab';

-- ===== 本文SQLブロック 4。直前の結果を確認してから手動で選択する。 =====
-- 目的: この章専用のschemaを作成する。既存ならエラーで停止する。
CREATE DATABASE mhw_lakehouse_lab;

-- ===== 本文SQLブロック 5。直前の結果を確認してから手動で選択する。 =====
-- 目的: カテゴリー名を保持する通常のInnoDBマスターを作る。
CREATE TABLE mhw_lakehouse_lab.equipment_category (
  category_id INT NOT NULL PRIMARY KEY,
  category_name VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- ===== 本文SQLブロック 6。直前の結果を確認してから手動で選択する。 =====
-- 目的: 既存のマスターへ同じ4行を重ねて投入しないよう確認する。
SELECT COUNT(*) AS existing_rows FROM mhw_lakehouse_lab.equipment_category;

-- ===== 本文SQLブロック 7。直前の結果を確認してから手動で選択する。 =====
-- 目的: 4行のマスター投入を一つの確定単位にする。
START TRANSACTION;

-- 目的: 同じIDに対して1行だけのマスターを用意する。
INSERT INTO mhw_lakehouse_lab.equipment_category VALUES
(1,'Laptop'), (2,'Monitor'), (3,'Printer'), (4,'Router');

-- ===== 本文SQLブロック 8。直前の結果を確認してから手動で選択する。 =====
-- 目的: マスター投入を確定する。
COMMIT;

-- 目的: 通常表の4行と対応する名前を確認する。
SELECT * FROM mhw_lakehouse_lab.equipment_category ORDER BY category_id;

-- ===== 本文SQLブロック 9。直前の結果を確認してから手動で選択する。 =====
-- 目的: JOINする通常表にもHeatWaveのセカンダリエンジンを設定する。
ALTER TABLE mhw_lakehouse_lab.equipment_category SECONDARY_ENGINE=RAPID;

-- ===== 本文SQLブロック 10。直前の結果を確認してから手動で選択する。 =====
-- 目的: 通常表をHeatWaveメモリへロードする。
ALTER TABLE mhw_lakehouse_lab.equipment_category SECONDARY_LOAD;

-- 目的: 通常表のロード警告を直後に確認する。
SHOW WARNINGS;

-- ===== 本文SQLブロック 11。直前の結果を確認してから手動で選択する。 =====
-- 目的: 通常表の2列とセカンダリエンジン設定を確認する。
SHOW CREATE TABLE mhw_lakehouse_lab.equipment_category\G

-- ===== 本文SQLブロック 12。直前の結果を確認してから手動で選択する。 =====
-- 目的: Object Storageの単一CSVを参照する外部表を定義する。
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

-- ===== 本文SQLブロック 13。直前の結果を確認してから手動で選択する。 =====
-- 目的: 外部表の4列、CSV、HEADER ON、単一ファイルURIを照合する。
SHOW CREATE TABLE mhw_lakehouse_lab.usage_history\G

-- ===== 本文SQLブロック 14。直前の結果を確認してから手動で選択する。 =====
-- 目的: 全400行を読んでロード前に形式を検証する。データロードはまだ行わない。
ALTER TABLE mhw_lakehouse_lab.usage_history SECONDARY_LOAD VALIDATE ALL ROWS ONLY;

-- 目的: 検証時の警告を直後に確認し、エラーや列の不一致があれば停止する。
SHOW WARNINGS;

-- ===== 本文SQLブロック 15。直前の結果を確認してから手動で選択する。 =====
-- 目的: 外部表の4列、CSV、HEADER ON、単一ファイルURIを照合する。
SHOW CREATE TABLE mhw_lakehouse_lab.usage_history\G

-- ===== 本文SQLブロック 16。直前の結果を確認してから手動で選択する。 =====
-- 目的: 検証済みCSVをHeatWaveメモリへロードする。
ALTER TABLE mhw_lakehouse_lab.usage_history SECONDARY_LOAD;

-- 目的: ロードの警告を直後に確認する。
SHOW WARNINGS;

-- ===== 本文SQLブロック 17。直前の結果を確認してから手動で選択する。 =====
-- 目的: 外部表を使う集計がHeatWaveで実行されるよう明示する。
SET SESSION use_secondary_engine = FORCED;

-- 目的: 400行、ID1〜400、利用1800時間、保守費120000円を照合する。
SELECT COUNT(*) AS row_count, COUNT(DISTINCT usage_id) AS distinct_ids,
       MIN(usage_id) AS min_id, MAX(usage_id) AS max_id,
       SUM(hours_used) AS hours_total, SUM(maintenance_cost) AS cost_total
FROM mhw_lakehouse_lab.usage_history;

-- 目的: CSV中のcategory_idが1〜4で、各100行かを確認する。
SELECT category_id, COUNT(*) AS row_count
FROM mhw_lakehouse_lab.usage_history
GROUP BY category_id ORDER BY category_id;

-- ===== 本文SQLブロック 18。直前の結果を確認してから手動で選択する。 =====
-- 目的: 通常表と外部表のJOINがRAPIDで処理される実行計画を確認する。
EXPLAIN SELECT c.category_id, c.category_name, COUNT(*) AS row_count,
       SUM(u.hours_used) AS hours_total, SUM(u.maintenance_cost) AS cost_total
FROM mhw_lakehouse_lab.usage_history u
JOIN mhw_lakehouse_lab.equipment_category c ON c.category_id=u.category_id
GROUP BY c.category_id, c.category_name
ORDER BY c.category_id;

-- 目的: 外部履歴にInnoDBのカテゴリー名を付け、カテゴリー別に集計する。
SELECT c.category_id, c.category_name, COUNT(*) AS row_count,
       SUM(u.hours_used) AS hours_total, SUM(u.maintenance_cost) AS cost_total
FROM mhw_lakehouse_lab.usage_history u
JOIN mhw_lakehouse_lab.equipment_category c ON c.category_id=u.category_id
GROUP BY c.category_id, c.category_name
ORDER BY c.category_id;

-- ===== 本文SQLブロック 19。直前の結果を確認してから手動で選択する。 =====
-- 目的: セッションのエンジン選択を通常動作へ戻す。
SET SESSION use_secondary_engine = ON;

-- ===== 本文SQLブロック 20。直前の結果を確認してから手動で選択する。 =====
-- 目的: 本章の外部表とInnoDBマスターを含む専用schemaだけを削除する。
DROP DATABASE mhw_lakehouse_lab;
