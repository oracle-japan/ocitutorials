---
title: "101 : ExaDB-XSを使おう"
excerpt: "文章考えるExaDB-XSの作成方法について紹介します。"
order: "2_101"
layout: single
header:
  teaser: "/exadb-xs/exadb-xs101-create-exadb-xs/teaser.png"
  overlay_image: "/exadb-xs/exadb-xs101-create-exadb-xs/teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=797
---

<a id="anchor0"></a>

# はじめに
**Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D)** は、Oracle Databaseが高い可用性を備えつつ高いパフォーマンスを発揮できる**Oracle Exadata Database Machine (Exadata)**が利用可能なサービスです。同じようにOCI上でExadataを利用可能なサービスとしては、Autonomous Data WarehouseやAutonomous Transaction Processing などのAutonomous Databaseのサービスがありますが、ExaDB-D が他のサービスと大きく違うところは、全オプションが使える**専有型のUser-Managedサービス**であるということです。

+ **専有型** : H/Wもユーザー専有となり、他のユーザーの環境と分離されるため、セキュリティ・性能を担保できます。
+ **User-Managed サービス** : OS以上は顧客管理。OS上の構築・運用・管理に有効な機能を、クラウドのツールでも提供。パッチ適用やメンテナンスの実施判断・作業タイミングは顧客判。OSログインが可能でこれまで同様の管理方法を用いることができる (OS権限が必要な変更作業、サード・パーティのAgentの導入、ローカルにログやダンプファイルの配置など)ので、別途インスタンスやストレージサービスを立てる必要はありません。

また、オンライン・スケーリング (停止なし)での1時間単位での柔軟な価格体系、デフォルトでの可用性構成や容易に高可用性構成が組めること、PaaSとしてのプロビジョニングや管理面などのメリットがあります。

![](2022-06-27-13-37-50.png)

+ [プロビジョニングチュートリアル](https://docs.oracle.com/ja/learn/exadb-xs-db/index.html){:target="_blank"}

<BR>

<a id="anchor11"></a>

# 参考資料
+ [Oracle Cloud Infrastructure Documentation - Oracle Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en-us/iaas/exadatacloud/index.html){:target="_blank"}
+ [Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) サービス詳細](https://speakerdeck.com/oracle4engineer/exadata-database-cloud-technical-detail){:target="_blank"}

<BR>

[ページトップへ戻る](#anchor0)
