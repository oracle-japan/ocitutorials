---
title: "保存済み検索を使用したアラート通知"
description: "保存済検索の問合せを定期的に実行するようにスケジュールし、問合せの実行結果をMonitoringへ連携し通知することができます。"
weight: "110"
tags:
- 運用管理・監視
images:
- management/stack_monitoring_basedb/image17.png
---

**チュートリアル概要 :**  
このチュートリアルでは、Log Analyticsで保存済み検索のスケジュール実行を作成し、検出結果をMonitoringへ連携、メール通知までの流れを紹介します。

**所要時間 :** 約30分

# 1. 事前準備
## Log Analyticisの有効化とログ・グループの作成  
Log Analyticsの有効化については[Log Analyticsの有効化](/ocitutorials/management/logginganalytics_onboarding/)を参照ください。  
ログ・グループについては有効化の過程で作成された「logging_analytics_ociaudit」を使用します。

# 2. 動的グループとポリシーの作成
## 動的グループの作成  
以下の一致ルールを使用して動的グループを作成します。
```
ALL {resource.type='loganalyticsscheduledtask'}
```
動的グループの作成方法については、[こちらのチュートリアルの記事](/ocitutorials/management/logginganalytics_logcollection4ocivm/#2-動的グループの作成とポリシーの追加)を参考にしてください。

## ポリシーの作成  
次に、以下のポリシーを作成します。
```
allow dynamic-group <dynamic_group_name> to use metrics in tenancy
allow dynamic-group <dynamic_group_name> to read management-saved-search in tenancy
allow dynamic-group <dynamic_group_name> to {LOG_ANALYTICS_QUERY_VIEW} in tenancy
allow dynamic-group <dynamic_group_name> to {LOG_ANALYTICS_QUERYJOB_WORK_REQUEST_READ} in tenancy
allow dynamic-group <dynamic_group_name> to READ loganalytics-log-group in tenancy
allow dynamic-group <dynamic_group_name> to {LOG_ANALYTICS_LOOKUP_READ} in tenancy
allow dynamic-group <dynamic_group_name> to read compartments in tenancy
```
ここではテナント管理者権限のユーザーを前提としているため、ユーザーポリシーについては記載しておりません。  
ユーザーポリシーについては[マニュアル](https://docs.oracle.com/ja-jp/iaas/log-analytics/doc/collect-logs-from-your-oci-object-storage-bucket.html)を参照ください。

