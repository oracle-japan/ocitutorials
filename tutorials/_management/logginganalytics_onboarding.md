---
title: "Logging Analytics オンボーディング"
excerpt: "Logging Analyticsを使用開始するには、ポリシーやリソースの作成など、事前準備が必要となります。オンボーディングを使用することで、必要なポリシーとリソースが自動的に作成されるため、すぐにログの分析を開始することができます。"
order: "120"
layout: single
tags:
 - management
header:
 teaser: "/management/logginganalytics_onboarding/LA_Onboarding-10.png"
 overlay_image: "/management/logginganalytics_onboarding/LA_Onboarding-10.png"
 overlay_filter: rgba(34, 66, 55, 0.7)

---

チュートリアル概要
----------------
オンボーディングで設定可能なLogging Analyticsの構成は次の2つになります。
* ホストログの継続的な取得  
* OCI監査ログの継続的な取得

このチュートリアルでは、OCI監査ログを取得するところまでの手順を紹介します。

**所用時間**：10分

<br>

前提条件
----------------
オンボーディングを使用するためにはOCIテナント管理者レベルの権限が必要です。

<br>

設定の流れ
------------------
OCIコンソールの左上のメニューから「監視および管理」を選択し、  
「ログ・アナリティクス」をクリックします。  
![画像00](LA_Onboarding-00.png)

<br>

Logging Analyticsがまだ有効化されていない場合、以下のような画面になります。  
「ログ・アナリティクスの使用の開始」をクリックします。  
![画像01](LA_Onboarding-01.png)

<br>

Logging Analyticsを有効化するためのポリシーが自動作成され、「logging_analytics_automatic_service_policies」という名前で保存されます。  
また、ログ・グループ「Default」が作成されます。  
![画像02](LA_Onboarding-02.png)

<br>

次の取得の設定画面では、ホストログの継続的な収集と、OCI監査ログの継続的な収集を有効化するかどうか、チェックボックスが表示されます。 ここでは、2つとも有効化する前提でチェックを入れた状態で次をクリックして進みます。  
![画像03](LA_Onboarding-03.png)  

![画像04](LA_Onboarding-04.png)

<br>

「logging_analytics_automatic_ingestion_policies」という名前で必要なポリシーが作成されます。  
![画像05](LA_Onboarding-05.png)

<br>

ログの収集に必要なリソースが作成されます。設定完了後、収集されたOCI監査ログを確認するため「ログ・エクスプローラに移動」をクリックします。  
![画像06](LA_Onboarding-06.png)  

![画像07](LA_Onboarding-07.png)

<br>

1分ほど待つと、ログ・エクスプローラにOCI監査ログが表示されます。  
![画像08](LA_Onboarding-08.png)

<br>

次にダッシュボードの一覧から「OCI Audit Analysis」をクリックします。  
これはデフォルトで作成済のOCI監査ログ用のダッシュボードです。  
![画像09](LA_Onboarding-09.png)

<br>

OCI監査ログの状況がダッシュボードで直感的に確認できます。  
![画像10](LA_Onboarding-10.png)

<br>

以上、OCI監査ログを取り込み、ログ・エクスプローラやダッシュボードで表示するための手順でした。ホストのログを継続的に収集する具体的な手順については別のトピックでご紹介します。

