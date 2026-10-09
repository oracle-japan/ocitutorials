-- 段階実行用の参照SQL。一括source実行しない。本文の確認・停止条件に従い、各ブロックを個別に実行する。

-- ===== 本文SQLブロック 1。直前の結果を確認してから手動で選択する。 =====
-- 目的: 記録した主DBであり、現在のプライマリへ書き込めることを確認する。
SELECT VERSION() AS server_version, @@server_uuid AS server_uuid,
       CURRENT_USER() AS db_account, @@read_only AS read_only,
       @@super_read_only AS super_read_only\G
-- 目的: SQLセッションのTLS暗号化を確認する。
SHOW SESSION STATUS LIKE 'Ssl_cipher';

-- ===== 本文SQLブロック 2。直前の結果を確認してから手動で選択する。 =====
-- 目的: 接続中のサーバー版・利用者を記録する。
SELECT VERSION() AS server_version, CURRENT_USER() AS db_account;

-- 目的: 同名schemaとの衝突を調べる。結果が0行の場合だけ次へ進む。
SELECT SCHEMA_NAME FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'mhw_analytics_lab';

-- ===== 本文SQLブロック 3。直前の結果を確認してから手動で選択する。 =====
-- 目的: この章だけのschemaを新規作成する。既存schemaがあればエラーで停止する。
CREATE DATABASE mhw_analytics_lab;

-- ===== 本文SQLブロック 4。直前の結果を確認してから手動で選択する。 =====
-- 目的: 10万行の架空利用履歴を格納する専用InnoDB表を作る。
CREATE TABLE mhw_analytics_lab.usage_history (
  usage_id INT NOT NULL PRIMARY KEY,
  category_id INT NOT NULL,
  hours_used INT NOT NULL,
  maintenance_cost INT NOT NULL
) ENGINE=InnoDB;

-- ===== 本文SQLブロック 5。直前の結果を確認してから手動で選択する。 =====
-- 目的: 途中実行したデータへ重ねて投入しないため、未投入であることを確認する。
SELECT COUNT(*) AS existing_rows FROM mhw_analytics_lab.usage_history;

-- ===== 本文SQLブロック 6。直前の結果を確認してから手動で選択する。 =====
-- 目的: データ投入をInnoDB側で行い、意図しないオフロードを避ける。
SET SESSION use_secondary_engine = OFF;

-- 目的: 今回の投入を一つの確定単位にする。
START TRANSACTION;
-- 目的: 0〜9の5桁の直積から重複しない0〜99999を作り、決定的な10万行を投入する。
INSERT INTO mhw_analytics_lab.usage_history
  (usage_id, category_id, hours_used, maintenance_cost)
WITH digits AS (
  SELECT 0 AS d UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
  UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
  UNION ALL SELECT 8 UNION ALL SELECT 9
), numbers AS (
  SELECT a.d + 10*b.d + 100*c.d + 1000*d.d + 10000*e.d AS n
  FROM digits a CROSS JOIN digits b CROSS JOIN digits c
  CROSS JOIN digits d CROSS JOIN digits e
)
SELECT n+1, MOD(n,4)+1, MOD(n,8)+1, 100*(MOD(n,5)+1)
FROM numbers;

-- ===== 本文SQLブロック 7。直前の結果を確認してから手動で選択する。 =====
-- 目的: 明示的に確定し、別の読取りでも確認できる状態にする。
COMMIT;

-- ===== 本文SQLブロック 8。直前の結果を確認してから手動で選択する。 =====
-- 目的: 10万行・ID範囲・合計が期待値と一致することを確認する。
SELECT COUNT(*) AS row_count, MIN(usage_id) AS min_id, MAX(usage_id) AS max_id,
       SUM(hours_used) AS hours_total, SUM(maintenance_cost) AS cost_total
FROM mhw_analytics_lab.usage_history;

-- ===== 本文SQLブロック 9。直前の結果を確認してから手動で選択する。 =====
-- 目的: 比較の基準となるInnoDB実行を指定する。
SET SESSION use_secondary_engine = OFF;

-- 目的: InnoDBでカテゴリー別の基準結果を取得する。
SELECT category_id, COUNT(*) AS row_count, SUM(hours_used) AS hours_total,
       SUM(maintenance_cost) AS cost_total
FROM mhw_analytics_lab.usage_history
GROUP BY category_id ORDER BY category_id;

-- ===== 本文SQLブロック 10。直前の結果を確認してから手動で選択する。 =====
-- 目的: 専用表のセカンダリエンジンをHeatWaveのRAPIDにする。
ALTER TABLE mhw_analytics_lab.usage_history SECONDARY_ENGINE=RAPID;

-- ===== 本文SQLブロック 11。直前の結果を確認してから手動で選択する。 =====
-- 目的: 専用表をHeatWaveメモリへロードする。
ALTER TABLE mhw_analytics_lab.usage_history SECONDARY_LOAD;

-- 目的: ロードが返した警告を直後に調べる。
SHOW WARNINGS;

-- ===== 本文SQLブロック 12。直前の結果を確認してから手動で選択する。 =====
-- 目的: 分析に必要な4列がロード対象から除外されていないかを調べる。
SHOW CREATE TABLE mhw_analytics_lab.usage_history;

-- ===== 本文SQLブロック 13。直前の結果を確認してから手動で選択する。 =====
-- 目的: HeatWaveへオフロードできなければ失敗させ、暗黙のInnoDB実行を防ぐ。
SET SESSION use_secondary_engine = FORCED;

-- ===== 本文SQLブロック 14。直前の結果を確認してから手動で選択する。 =====
-- 目的: 集計の実行計画がHeatWaveのRAPIDを使うことを確認する。
EXPLAIN SELECT category_id, COUNT(*) AS row_count, SUM(hours_used) AS hours_total,
       SUM(maintenance_cost) AS cost_total
FROM mhw_analytics_lab.usage_history
GROUP BY category_id ORDER BY category_id;

-- 目的: HeatWaveで同じ集計を実行し、InnoDBの結果と照合する。
SELECT category_id, COUNT(*) AS row_count, SUM(hours_used) AS hours_total,
       SUM(maintenance_cost) AS cost_total
FROM mhw_analytics_lab.usage_history
GROUP BY category_id ORDER BY category_id;

-- ===== 本文SQLブロック 15。直前の結果を確認してから手動で選択する。 =====
-- 目的: 比較後にセッションのエンジン選択を通常動作へ戻す。
SET SESSION use_secondary_engine = ON;

-- ===== 本文SQLブロック 16。直前の結果を確認してから手動で選択する。 =====
-- 目的: この章で作成した専用表とschemaだけを削除する。
DROP DATABASE mhw_analytics_lab;
