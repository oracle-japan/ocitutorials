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
**Oracle Exadata Database Service on Exascale Infrastructure (ExaDB-XS)** は、Oracle Databaseが高い可用性を備えつつ高いパフォーマンスを発揮できる**Oracle Exadata Database Machine (Exadata)**を、より低いエントリーコストでご利用いただけるサービスです。ExaDB-XSは、Exadata Database Service on Dedicated Infrastructure (ExaDB-D)と同じ強力な自動化機能を使用して VM クラスタとデータベースを管理しますが、物理的なコンピュートとストレージはサービスから抽象化されます。VMクラスタとデータベースをデプロイするだけで、その上で実行されるオラクル管理のインフラストラクチャを意識する必要はありません。データベースはVMクラスタに分離され、完全に管理下に置かれます。VMイメージはExascaleブロック・ストレージに保存されるため、ローカル・ドライブのサイズ制限がなく、障害発生時の移行も容易です。

![](introduction_01.png)

+ **パワフル** :  Exascaleインフラストラクチャは、極めて高いパフォーマンス、信頼性、可用性、セキュリティを実現するExadataのすべての機能を継承しています。AI、アナリティクス、ミッションクリティカルなOLTPワークロードは、Exascaleのクラウド向けインテリジェント・データ・アーキテクチャによって高速化されます。
+ **超低コスト** : Exascaleのインフラストラクチャでは、データベースが使用するコンピュートとストレージのリソースに対してのみ支払いが発生します。IOPSに対する追加料金は発生しないため、コストを予測しやすくなります。
+ **スケーラブルなプール・リソース** : エクサスケールインフラストラクチャは、共有インテリジェントストレージとコンピューティングのプールを活用することで、ダウンタイムやサーバーベースのサイズ制限、破壊的なマイグレーションを心配することなく、データベースを容易に拡張することができます。
+ **俊敏な開発** : Exascaleインフラストラクチャは、Exadataネイティブのパフォーマンスで迅速かつ効率的にデータベースのシンクローンを作成する機能を備えているため、ストレージコストを削減し、開発者の俊敏性を高めることができます。

<BR>

# VMクラスタおよびデータベースの作成
[プロビジョニングチュートリアル](https://docs.oracle.com/ja/learn/exadb-xs-db/index.html){:target="_blank"}を参考に、ExaDB-XSのVMクラスタを作成し、その上にコンテナ・データベースをプロビジョニングします。

> バックアップ先の文章考える
<BR>
> ![](console_01.png)

<BR>

<a id="anchor11"></a>

# 参考資料
+ [Oracle Cloud Infrastructure Documentation - Oracle Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en-us/iaas/exadatacloud/index.html){:target="_blank"}
+ [Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) サービス詳細](https://speakerdeck.com/oracle4engineer/exadata-database-cloud-technical-detail){:target="_blank"}

<BR>

[ページトップへ戻る](#anchor0)
