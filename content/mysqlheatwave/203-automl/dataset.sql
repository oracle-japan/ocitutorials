-- 段階実行用。ファイル全体を無条件にsourceしない。エラー時は後続を止め、既存結果を確認する。
-- 目的: 同名の既存データを保護する。0行以外なら後続を実行しない。
SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME='mhw_ml_lab';
-- 目的: 合成MLデータを他の演習から隔離する。
CREATE DATABASE mhw_ml_lab CHARACTER SET utf8mb4;
-- 目的: 1設備1観測の原本を主キー付きで保持する。
CREATE TABLE mhw_ml_lab.observations (
 equipment_id INT PRIMARY KEY,
 age_years INT NOT NULL,
 hours_total INT NOT NULL,
 temperature_c INT NOT NULL,
 vibration_tenths INT NOT NULL,
 days_since_service INT NOT NULL,
 equipment_type VARCHAR(8) NOT NULL,
 split_name VARCHAR(10) NOT NULL,
 needs_service VARCHAR(3) NOT NULL
) ENGINE=InnoDB;
-- 目的: 固定seedと設備IDから6000件を決定的に生成する。実在設備や故障記録を使用しない。
INSERT INTO mhw_ml_lab.observations
WITH digits AS (
 SELECT 0 d UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
), ids AS (
 SELECT 1+a.d+10*b.d+100*c.d+1000*d.d AS id
 FROM digits a CROSS JOIN digits b CROSS JOIN digits c CROSS JOIN digits d
 WHERE a.d+10*b.d+100*c.d+1000*d.d<6000
), features AS (
 SELECT id,
 MOD(CRC32(CONCAT('mhw203-v1-age-',id)),20) age_years,
 100+MOD(CRC32(CONCAT('mhw203-v1-hours-',id)),9900) hours_total,
 35+MOD(CRC32(CONCAT('mhw203-v1-temp-',id)),60) temperature_c,
 MOD(CRC32(CONCAT('mhw203-v1-vibration-',id)),100) vibration_tenths,
 1+MOD(CRC32(CONCAT('mhw203-v1-service-',id)),365) days_since_service,
 CONCAT('type',MOD(CRC32(CONCAT('mhw203-v1-type-',id)),3)) equipment_type
 FROM ids
)
SELECT id,age_years,hours_total,temperature_c,vibration_tenths,days_since_service,equipment_type,
 CASE WHEN MOD(id,10)<6 THEN 'train' WHEN MOD(id,10)<8 THEN 'validation' ELSE 'test' END,
 CASE WHEN age_years*2+(temperature_c-35)+vibration_tenths+FLOOR(days_since_service/10)
   >120+MOD(CRC32(CONCAT('mhw203-v1-noise-',id)),40) THEN 'yes' ELSE 'no' END
FROM features;
-- 目的: 原本と同じ列・主キー構成の学習表を作る。
CREATE TABLE mhw_ml_lab.train LIKE mhw_ml_lab.observations;
-- 目的: 設備IDが学習群の観測だけをコピーする。
INSERT INTO mhw_ml_lab.train SELECT * FROM mhw_ml_lab.observations WHERE split_name='train';
-- 目的: 学習から独立した検証表を作る。
CREATE TABLE mhw_ml_lab.validation LIKE mhw_ml_lab.observations;
-- 目的: 設備IDが検証群の観測だけをコピーする。
INSERT INTO mhw_ml_lab.validation SELECT * FROM mhw_ml_lab.observations WHERE split_name='validation';
-- 目的: 最終評価専用のテスト表を作る。
CREATE TABLE mhw_ml_lab.test LIKE mhw_ml_lab.observations;
-- 目的: 学習・検証に使わない設備だけをテスト表へコピーする。
INSERT INTO mhw_ml_lab.test SELECT * FROM mhw_ml_lab.observations WHERE split_name='test';
-- 手動停止ゲート: 直前のINSERTまで全て成功した場合だけCOMMITする。
-- エラー時は未確定DMLをROLLBACKする。DDLや確定済み変更は取り消せない。
-- 目的: テスト表への投入を確定し、学習前の検算を確定済みデータで行う。
COMMIT;
-- 手動停止ゲート: COMMIT応答不明なら再接続後に読取りだけで状態を確認し、INSERTを再送しない。
-- 目的: 総件数・ID範囲・重複不在を確認する。
SELECT COUNT(*) AS rows_total,COUNT(DISTINCT equipment_id) AS equipment_total,
MIN(equipment_id) AS first_id,MAX(equipment_id) AS last_id FROM mhw_ml_lab.observations;
-- 目的: 分割ごとの件数と目的値の分布を独立期待値と照合する。
SELECT split_name,needs_service,COUNT(*) AS rows_per_class
FROM mhw_ml_lab.observations GROUP BY split_name,needs_service ORDER BY split_name,needs_service;
-- 目的: 分割先の実表にも期待件数がコピーされていることを確認する。
SELECT (SELECT COUNT(*) FROM mhw_ml_lab.train) AS train_rows,
 (SELECT COUNT(*) FROM mhw_ml_lab.validation) AS validation_rows,
 (SELECT COUNT(*) FROM mhw_ml_lab.test) AS test_rows;
-- 目的: 設備IDが分割をまたいでいないことを確認する。0が期待値。
SELECT (SELECT COUNT(*) FROM mhw_ml_lab.train a JOIN mhw_ml_lab.validation b USING(equipment_id))
+ (SELECT COUNT(*) FROM mhw_ml_lab.train a JOIN mhw_ml_lab.test b USING(equipment_id))
+ (SELECT COUNT(*) FROM mhw_ml_lab.validation a JOIN mhw_ml_lab.test b USING(equipment_id)) AS overlap_count;
