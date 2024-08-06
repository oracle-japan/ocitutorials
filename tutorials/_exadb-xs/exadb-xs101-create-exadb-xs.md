---
title: "101 : ExaDB-XSを使おう"
excerpt: "あらゆる業界のあらゆる組織にExadataのメリットを提供するExaDB-XSの作成方法について紹介します。"
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
**Oracle Exadata Database Service on Exascale Infrastructure (ExaDB-XS)** は、Oracle Databaseが高い可用性を備えつつ高いパフォーマンスを発揮できる**Oracle Exadata Database Machine (Exadata)**を、より低いエントリーコストでご利用いただけるサービスです。

ExaDB-XSは、Exadata Database Service on Dedicated Infrastructure (ExaDB-D)と同じ強力な自動化機能を使用して VM クラスタとデータベースを管理しますが、物理的なコンピュートとストレージはサービスから抽象化されます。VMクラスタとデータベースをデプロイするだけで、その上で実行されるオラクル管理のインフラストラクチャを意識する必要はありません。

<br/>

# VMクラスタおよびデータベースの作成
[ExascaleインフラストラクチャでのOracle Exadata Database Serviceのプロビジョニング](https://docs.oracle.com/ja/learn/exadb-xs-db/index.html){:target="_blank"}を参考に、ExaDB-XSのVMクラスタを作成し、その上にコンテナ・データベースをプロビジョニングします。

> **タスク2：コンテナ・データベースのプロビジョニング**のステップ3の**「データベース・バックアップの構成」**でバックアップ保存先を設定します。
> その際、デフォルト設定の Autonomous Recovery Service を使用する場合は、[ Autonomous Recovery Service (RCV/ZRCV) をセットアップしよう](/ocitutorials/basedb/dbcs107-zrcv/){:target="_blank"}を参考に、セットアップを行ってください。
> オブジェクト・ストレージを選択する場合は、セットアップ作業は不要です。
>
> ![](console_01.png)

<br/>

<a id="anchor11"></a>

# 参考資料
+ [Oracle Exadata Database Service on Exascale Infrastructureの紹介](https://blogs.oracle.com/oracle4engineer/post/ja-introducing-oracle-exadata-database-service-on-exascale-infrastructure){:target="_blank"}
+ [ExascaleインフラストラクチャでのOracle Exadata Database Serviceのプロビジョニング](https://docs.oracle.com/ja/learn/exadb-xs-db/index.html){:target="_blank"}

<br/>

[ページトップへ戻る](#anchor0)
