---
title: "OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する"
excerpt: "トラブルシューティングの際、ログを即時に分析したい、という場面はありませんか？OCIのLogging Analyticsでは様々なログを可視化、分析する機能を提供します。実際にOCIの監査ログをLogging Analyticsで分析し、ユーザーアクティビティを可視化してみましょう。必要な操作は全てGUIから行うことができます。"
order: "110"
layout: single
tags:
 - management
header:
 teaser: "/management/audit-log-analytics/audit-loganalytics16.png"
 overlay_image: "/management/audit-log-analytics/audit-loganalytics16.png"
 overlay_filter: rgba(34, 66, 55, 0.7)
redirect_to: https://oracle-japan.github.io/ocitutorials/management/audit-log-analytics
# redirect_to: http://localhost:4000/ocitutorials/management/audit-log-analytics
---

OCI Observability&Managementのサービスの1つ、Logging Analyticsでは様々なログを可視化、分析する機能を提供します。
Logging AnalyticsではOCIの各種ログ(VCN, Load Balancer, Audit...)だけでなく、エージェントを使用することでOSやデータベース、Webサーバーなどのログを可視化、分析することが可能です。
この章では、エージェントは利用せず簡単な操作でOCIの監査ログをLogging Analyticsで分析する手順をご紹介します。


**所要時間 :** 約20分

**前提条件 :**
+ Logging Analyticsが有効化されていること
- OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。
![画面キャプチャ27](audit-loganalytics27.png)


**注意 :** 

※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。


# 1. IAMポリシーの作成
Logging Analyticsを利用するためにはOCIの他のサービスと同様に、IAMポリシーによってアクセス権限が付与されている必要があります。
以下のポリシーをテナンシで作成してください。


※この章では、ユーザーにLogging Analyticsの管理権限を付与します。ユーザーはログ・アナリティクスの構成やログファイルのアップロード、削除を含む全ての管理権限を行うことができます。[ドキュメント](https://docs.oracle.com/en-us/iaas/logging-analytics/doc/enable-access-logging-analytics-and-its-resources.html#GUID-EEB0A32F-9D33-4CF6-9FE7-F254C92BB2C0) を参考にユーザーの役割、ロールごとにIAMポリシーの権限を調整してください。

※OCIのテナンシ管理者がLogging Analyticsを利用する場合は、作成するポリシーは「1-2.Logging Analyticsサービスへのポリシー」のみになります。その他のポリシーは作成する必要はありません。

1-1. Loggingサービスを利用するためのポリシー
```
allow group <IAMグループ名> to MANAGE logging-family in tenancy/compartment <コンパートメント名>
allow group <IAMグループ名> to READ audit_events in tenancy/compartment<コンパートメント名>
```

1-2. Logging Analyticsサービスへのポリシー
```
allow service loganalytics to READ loganalytics-features-family in tenancy
allow service loganalytics to {LOG_ANALYTICS_LIFECYCLE_INSPECT, LOG_ANALYTICS_LIFECYCLE_READ} in tenancy
allow service loganalytics to MANAGE cloud-events-rule in tenancy/compartment <コンパートメント名>
allow service loganalytics to READ compartments in tenancy
```

1-3. ユーザーがLogging Analyticsを使用するためのポリシー
```
allow group <IAMグループ名> to READ compartments in tenancy
allow group <IAMグループ名> to MANAGE loganalytics-features-family in tenancy
allow group <IAMグループ名> to MANAGE loganalytics-resources-family in tenancy/compartment <コンパートメント名>
```

1-4. Service Connector Hubを利用するためのポリシー
```
allow group <IAMグループ名> to MANAGE serviceconnectors in tenancy/compartment <コンパートメント名>
```


# 2. ログ・グループの作成
2-1. OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→管理
	![画面ショット1](audit-loganalytics1.png)

2-2. 管理画面→ログ・グループ 
	![画面ショット2](audit-loganalytics2.png)

+ ①ログ・グループの作成
+ ②ログ・グループの名前を入力 例)AuditLogs
+ ③作成

![画面ショット3](audit-loganalytics3.png)


# 3. サービス・コネクタの作成
3-1. OCIコンソールのメニューボタン→監視および管理→ロギング→サービス・コネクタ
	![画面ショット4](audit-loganalytics4.png)
	
3-2. サービス・コネクタの作成
	![画面ショット5](audit-loganalytics5.png)
	
- **コネクタ名**: 任意の名前を入力 例) AuditLog_Connector
- **説明**: 任意の説明を入力
- **ソース**: 「ロギング」を選択 
- **ターゲット**: 「ログ・アナリティクス」を選択

	![画面ショット6](audit-loganalytics6.png)
	
- **ログ・グループ(ソース接続の構成)**: 「_Audit」を選択(OCIの監査ログはデフォルトで_Auditというログ・グループに格納されています。)
- **ログ・グループ(ターゲット接続の構成)**: 手順2-2で作成したLogging Analyticsのログ・グループを選択 例)AuditLogs
	
	![画面ショット7](audit-loganalytics7.png)

# 4. ログの分析
4-1. ログ・エクスプローラ

OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラ
	![画面ショット8](audit-loganalytics8.png)
	
ログ・エクスプローラに「OCI Audit Logs」が表示されます。
	![画面ショット10](audit-loganalytics10.png)
	
「OCI Audit Logs」→「ドリルダウン」を選択するとログレコードがリストとして表示されます。
	![画面ショット11](audit-loganalytics11.png)
	![画面ショット12](audit-loganalytics12.png)
	

デフォルトでは過去60分間のログが表示されますが、過去15分から、最大で過去14日間までのログを表示することができます。
また、「カスタム」からお好きな時間枠に絞り込むこともできます。
	![画面ショット13](audit-loganalytics13.png)
	![画面ショット14](audit-loganalytics14.png)
	
	
	
4-2. クラスタ分析でログを分析する

ビジュアライゼーション」→分析→クラスタ分析
	![画面ショット15](audit-loganalytics15.png)
	

類似した内容のログレコードがクラスタとして表示されます。
画面上部に「クラスタ」、「潜在的な問題」、「外れ値」、「トレンド」の合計4つのタブが表示されます。

- **クラスタ**: 全てのクラスタ
- **潜在的な問題**: ログの中身に「fatal」や「エラー」などの内容を含むクラスタ
- **外れ値**: ログ・レコードが1つしか含まれないクラスタ
- **トレンド**: ログ・レコードのトレンド（傾向を）分析し、トレンドごとにクラスタを表示
	![画面ショット16](audit-loganalytics16.png)
	
「failed」を選択すると、「failed」という値が含まれるログ・クラスタが表示されます。
	![画面ショット17](audit-loganalytics17.png)
	![画面ショット18](audit-loganalytics18.png)
	
Countの数字の部分を選択すると、「failed」という値が含まれるログ・レコードが一覧で表示されます。
	![画面ショット19](audit-loganalytics19.png)
	
詳細を選択すると、ログレコード全文を確認することができます。
	![画面ショット20](audit-loganalytics20.png)
	
デフォルトでは生ログが表示されますが、ＪＳＯＮを選択すると視覚的に理解しやすいように情報を整理して表示されます。
	![画面ショット21](audit-loganalytics21.png)
	
4-3. 様々なビジュアライゼーションによるログの可視化

ツリーマップ
	![画面ショット22](audit-loganalytics22.png)
	
折れ線グラフ
	![画面ショット23](audit-loganalytics23.png)
	
ツリーマップ、折れ線グラフの他にも様々なビジュアライゼーションによりログを可視化することができます。
	
4-4. フィールドの値により、ログ・レコードをフィルタリング
- **例) コンパートメント名**

特定のコンパートメント内の監査ログに絞り込むことができます。
	![画面キャプチャ24](audit-loganalytics24.png)
	
- **例) メソッド**

メソッドによりログをフィルタリングすることができます。
例えば「delete」というメソッドに絞り込むと、ユーザーがOCI上でリソースを削除したログが一覧で表示されます。
	![画面キャプチャ25](audit-loganalytics25.png)
	
ログから、どのユーザーが何のリソースを削除したかを確認することができます。
	![画面キャプチャ26](audit-loganalytics26.png)
	

以上がLogging Analyticsを使用したOCI監査ログの分析手順になります。
Logging Analyticsにはご紹介したクラスタ分析、ツリーマップ、折れ線グラフの他にも、様々なビジュアライゼーションが提供されています。

