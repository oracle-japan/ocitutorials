---
title: "504 : 監査をしてみよう"
excerpt: "監査を利用すると、データベースに対して「いつ」「誰が」「どのデータを」「どのように操作したか」を記録、確認することができます。データベース・セキュリティの重要な機能です。"
order: "3_210"
layout: single
header:
  teaser: "/database/adb504-audit/unifiedaudit.png"
  overlay_image: "/database/adb504-audit/unifiedaudit.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776
---
<a id="anchor0"></a>

# はじめに
Oracle Databaseではデータベースに対する操作を記録する監査機能が提供されています。12cからは従来の監査機能（DBA監査、標準監査、ファイングレイン監査）を統合した統合監査が利用できるようになりました。

  ![Oracle Databaseの監査機能](dbaudit.png)
  ![統合監査機能](unifiedaudit.png)

データベース監査機能についての詳細はこちらの[ドキュメント](https://docs.oracle.com/cd/F19136_01/dbseg/introduction-to-auditing.html)をご覧ください。

Autonomous Databaseは、統合監査を利用した、いくつかの監査設定があらかじめ行われています。また必要に応じて任意の監査設定を追加できます。
この章では、Autonomous Databaseの監査設定と監査レコードの管理について紹介します。


**目次 :**
  + [1.デフォルトの監査設定の確認](#1-デフォルトの監査設定の確認)
  + [2.任意の監査設定の追加](#2-任意の監査設定の追加)
  + [3.監査対象の操作を実行（監査レコードの生成）](#3-監査対象の操作を実行監査レコードの生成)
  + [4.監査レコードの確認](#4-監査レコードの確認)
  + [5.任意の監査設定の無効化](#5-任意の監査設定の削除)
  + [6.監査レコードの削除](#6-監査レコードの削除)
  
**前提条件 :**
 + 監査対象の表は任意のスキーマの表でも構いませんが、ここでは、[「102:ADBにデータをロードしよう(Database Actions)」](https://oracle-japan.github.io/ocitutorials/database/adb102-dataload/) で作成したADBUSERスキーマのSALES_CHANNELS表を利用しています。
 + SQLコマンドを実行するユーザー・インタフェースは、接続の切り替えが容易なので、SQL\*Plusを利用していますが、Database Actionsでも実行可能です。ユーザーでの接続をログインに読み替え、必要なユーザーでログインしなおしてください。なお、 SQL\*Plusの環境は、[「204:マーケットプレイスからの仮想マシンのセットアップ方法」](https://oracle-japan.github.io/ocitutorials/database/adb204-setup-VM/)で作成できます。
 + チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、各ユーザのパスワードはすべて「Welcome12345#」とします。
 + 使用パッケージの引数の説明は記載していません。詳細はドキュメント[『PL/SQLパッケージ及びタイプ・リファレンス』](https://docs.oracle.com/cd/F19136_01/arpls/DBMS_RLS.html#GUID-27507923-FF74-4193-B55D-6ECB11B58FCC)（リンクは19c版です）をご参照ください。

**所要時間 :** 約20分

<BR>

# 1. デフォルトの監査設定の確認
統合監査では、監査対象を監査ポリシーで定義し、定義された監査ポリシーを有効化することで監査レコードが生成されます。
Autonomous Databaseにはよく利用される監査対象用に事前定義済みの監査ポリシーがあり、そのうち4つがデフォルトで有効化されています。

![Autonomous Databaseの監査ポリシー](adb_audit_default.png)

作成済みの監査ポリシーはUNIFIED_AUDIT_POLICIESビュー、有効化された監査ポリシーはAUDIT_UNIFIED_ENABLED_POLICIESビューで確認することができます。   
SQL*Plusを起動して以下を実行してください。

```sql
-- ADMINで接続する
CONNECT admin/Welcome12345##@atp01_low
-- SQL*Plusのフォーマット用コマンド
set pages 100 
set lines 200
col policy_name for a30
col entity_name for a30
--作成済みの監査ポリシーを確認する
SELECT distinct policy_name FROM AUDIT_UNIFIED_POLICIES;
-- 有効化されているポリシーを確認する
SELECT * FROM AUDIT_UNIFIED_ENABLED_POLICIES;
```

**結果 :**  
![デフォルトのポリシーの確認 by ADMIN](checkpolicy1.png)


事前定義済みの監査ポリシーと有効化されている監査ポリシーの確認ができました。

<BR>
# 2. 任意の監査設定の追加

次に監査対象となる操作を指定して監査ポリシーを作成してみましょう。  
[「102:ADBにデータをロードしよう(Database Actions)」](https://oracle-japan.github.io/ocitutorials/database/adb102-dataload/) で作成したADBUSERスキーマのSALES_CHANNELS表への操作を監査対象にします。  
ADMINユーザで以下を実行してください。

```sql
-- ADMINユーザーで実行する
-- ADBUSER.SALES_CHANNELS表に対するADBUSERからのDMLを監査するポリシーの作成
CREATE AUDIT POLICY sales_channels_pol
ACTIONS SELECT ON adbuser.sales_channels,UPDATE on adbuser.sales_channels,DELETE ON adbuser.sales_channels;
-- 作成したポリシーを確認する(set、colはSQL*Plusのフォーマット用のコマンド)
col audit_option for a10
col object_schema for a20
col object_name for a20
SELECT policy_name,audit_option,audit_option_type,object_schema,object_name FROM audit_unified_policies
WHERE policy_name='SALES_CHANNELS_POL';
```
**結果 :**  
![監査ポリシーの作成 by ADMIN](createpolicy.png)

新しい監査ポリシーを作成することができました。  
続けて、作成した監査ポリシーを有効化します。  

```sql
-- ADMINユーザで実行する
-- 監査ポリシーをadbuserに対してのみ有効化する
AUDIT POLICY sales_channels_pol BY adbuser
-- 有効化したポリシーを確認する
SELECT * FROM AUDIT_UNIFIED_ENABLED_POLICIES;
```
**結果 :**  
   ![有効化された監査ポリシー一覧](checkpolicy2.png)

作成した監査ポリシーが有効化されていることが確認できました。

> **Note :**
>+ 監査ポリシーは表やビューなどのオブジェクトへの操作だけでなく、特定の権限を使用する操作や特定の条件下での操作を対象にすることができます。
>詳細についてはドキュメント『Oracleデータベース・セキュリティ・ガイド』の["26 監査ポリシーの構成"](https://docs.oracle.com/cd/F19136_01/dbseg/configuring-audit-policies.html#GUID-22CDB667-5AA2-4051-A262-FBD0236763CB)（リンクは19c版です）をご確認ください。
>+ 監査は、要件を満たすための設定が原則ですが、データベース内のすべての操作を監査するというのは実用的ではありません。必要な対象や操作を絞って設定するようにしてください。

<BR>

# 3. 監査対象の操作を実行(監査レコードの生成)
監査レコードを生成させるために、監査対象の操作を実行してみましょう。ADMINユーザーとADBユーザーでログオン失敗とSALES_CHANNLES表の検索を行います。

```sql
-- 違うパスワードを入力してADBUSERでの接続を失敗する
CONNECT adbuser/test@atp01_low
-- ADBUSERで接続をする
CONNECT adbuser/Welcome12345##@atp01_low
--ADBUSERで実行する
SELECT count(*) from sales_channels;
-- 違うパスワードを入力してADMINでの接続を失敗する
CONNECT admin/test@atp01_low
-- ADMINで接続をする
CONNECT admin/Welcome12345##@atp01_low
-- ADMINで実行する
SELECT count(*) from adbuser.sales_channels;
```
**結果 :**  
![監査対象の操作を実行する](executesql.png)

<BR>

# 4. 監査レコードの確認
統合監査では生成された監査レコードはUNIFIED_AUDIT_TRAILディクショナリビューに書き込まれます。どのような監査レコードが生成されたか確認してみましょう。

```sql
-- ADMINで実行する
-- UNIFIED_AUDIT_TRAILを直近1時間分検索する（set、colはSQL*Plusのフォーマット用コマンド）
col event_timestamp for a30
col dbusername for a10
col sql_text for a50
col unified_audit_policies for a23
SELECT event_timestamp,dbusername,sql_text,unified_audit_policies FROM unified_audit_trail
WHERE  event_timestamp > SYSDATE -1/24 order by event_timestamp desc;
```

**結果 :**  
![監査レコードを確認する](checkaudit.png)

デフォルトで有効化されている監査ポリシー「ORA_LOGON_FAILURES」は全てのユーザーに対しログオンの失敗を監査します。そのため、ADMINユーザー、ADBユーザーのログオンの失敗が記録されています。  
一方、新しく作成したSALES_CHANNELS表の監査ポリシー「SALES_CHANNELS_POL」は、ADBUSERユーザーに対してのみ有効であるため、ADMINユーザーのSELECT文は記録されず、ADBUSERユーザーのSELECT文のみ記録されていることが確認できます。

> **Note :**  
今回は時刻とユーザー名、SQL文、監査ポリシーを表示させましたが、UNIFIED_AUDIT_TRAILビューはセッションIDや端末情報など他にも多くの項目を持ちます。詳細は
こちらの[ドキュメント](https://docs.oracle.com/cd/F19136_01/refrn/UNIFIED_AUDIT_TRAIL.html)をご確認ください。


<BR>

# 5. 監査構成の削除
追加したSALES_CHANNES表の監査設定を削除しましょう。手順は追加と逆で、まず無効化を行い、その後に削除となります。


```sql
-- ADMINでポリシーの無効化を実行
NOAUDIT POLICY sales_channels_pol by adbuser;
-- ポリシーを削除
DROP AUDIT POLICY sales_channels_pol;
```
**結果 :**  
![監査構成の削除](dropaudit.png)

> **Note :**  
>+ AUDIT_UNIFIED_POLICIESビューのCOMMON列がYESである事前定義監査ポリシーはコンテナ・データベースレベルで設定する共通ポリシーであるため無効化はできません。
>+ 事前定義の監査ポリシーの削除はできません。「ORA-46389: Oracle事前定義済ポリシーを変更または削除できません」というエラーとなります。



# 6. 監査レコードの削除
Autonomous Databaseでは記録される監査レコードは毎日1回パージ（削除）ジョブが自動的に実行され、14日間より以前のものは削除されます。しかし、監査ポリシーの数と種類、操作の量によっては監査レコードが大きくなり大量のストレージを使用する可能性があります。そのため、DBMS_AUDIT_MGMT.CLEAN_AUDIT_TRAILプロシージャを使用した監査レコードの削除もサポートされています。ADMINユーザーで監査レコードを削除してみましょう。

```sql
-- ADMINで実行
-- 現在の監査レコード数を確認
SELECT count(*) FROM unified_audit_trail;
-- 削除を実行
BEGIN
DBMS_AUDIT_MGMT.CLEAN_AUDIT_TRAIL(
audit_trail_type => dbms_audit_mgmt.audit_trail_unified,　--監査証跡タイプををパッケージの定数から選択：audit_trail_unifiedは統合監査証跡
use_last_arch_timestamp => FALSE　--対象の監査レコード：FALSEはすべての監査レコード、TRUEはSET_LAST_ARCHIVE_TIMESTAMPプロシージャでセットしたタイムスタンプより前に作成されたレコード
);
END;
/
-- 削除後の監査レコード数を確認
SELECT count(*) FROM unified_audit_trail;
```

**結果 :**  
![監査レコードの削除](deleteaudit.png)


削除が完了しました。しかし、削除後の監査レコードが1件となっています。[4. 監査レコードの確認](#4-監査レコードの確認)で使ったSQLで確認してみましょう。

**結果 :**  
![削除後の監査レコード](auditafterdel.png)

これは監査レコードの削除操作の監査レコードです。UNIFIED_AUDIT_TRAILビューの元であるAUDSYSスキーマのAUD$UNIFIED表への操作はすべて監査対象となります。そのため、監査レコードが生成されています。

> **Note :**  
> + 監査レコードの削除はAUDIT_ADMINロールをもつユーザーが実行できます。ADMINユーザーはデフォルトでAUDIT_ADMINロールを持ちます。DBMS_AUDIT_MGMTパッケージ
の詳細はこちらの[ドキュメント](https://docs.oracle.com/cd/F19136_01/arpls/DBMS_AUDIT_MGMT.html#GUID-C704D6B0-A6ED-4CFC-B364-CC008CFF76F1)をご確認ください。
> + Autonomous Databaseの自動実行パージジョブの対象となる期間は14日間固定です。変更はできません。
> + 監査レコードを書き込む空き領域がないとエラーが発生し、運用に影響を及ぼします。自動実行パージジョブで対応が十分でない場合は、システムの利用状況に合わせた定期的な手動削除を行うこともご検討ください。

<BR>

# おわりに
このチュートリアルではAutonomous Databaseの監査設定および監査レコードの管理について紹介しました。  
なお、Autonomous Database内の監査レコードの保持期間は14日間になりますが、Oracle Data Safeを利用すると1カ月から12カ月までの間で保持期間の指定ができ、さらに監査レポートの生成も可能です。Oracle Data Safeはグラフィカルなユーザー・インターフェースで包括的にOracle Databaseのセキュリティ管理ができるサービスです。Autonomous Databaseを含むOCI Databaseサービスの場合は、100万監査レコード/月までは無償となりますのでぜひお試しください。
> **Note :**
>+ Oracle Data Safeの有効化については[こちら](https://qiita.com/western24/items/b772d95148b8855b8bb0)をご覧ください。
>+ Oracle Data SafeはAlways Free環境のAutonomous Databaseでは利用できません。

<BR>

# 参考資料
+ 共有Exadataインフラストラクチャ上のOracle Autonomous Databaseの使用 ["35 Autonomous Databaseの監査"](https://docs.oracle.com/cd/E83857_01/paas/autonomous-database/adbsa/adb-audit.html#GUID-76742693-33D2-46D3-8B13-CC838818B036)
+ Oracle Database 19c
『Oracle Database セキュリティ・ガイド』["第VI部 監査を使用したデータベース・アクティビティの管理"](https://docs.oracle.com/cd/F19136_01/dbseg/part_6.html)

<BR>
以上でこの章は終了です。次の章にお進みください。
  
<BR>
[ページトップへ戻る](#anchor0)