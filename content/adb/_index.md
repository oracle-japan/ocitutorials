---
title: "Oracle Database編 - Autonomous Database (ADB)を使ってみよう"
description: "自己稼働・自己保護・自己修復がコンセプトのAutonomous Database(ADB)を学ぶチュートリアルです。インスタンスの作成から、運用管理までを一通り体験します。"
permalink: /adb
layout: single
tags: 
    - "Database"
show_excerpts: true
toc: true
---
**チュートリアル一覧に[もどる](../)**
<br/>

----
**前提条件**  
+ Oracle Cloud Infrastructure の環境と、ユーザーアカウントがあること(トライアル環境でも実施いただける内容となっています。)
+ 適切なコンパートメントと、そこに対する適切な権限がユーザーに付与されていること

**特記事項**  
+ チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。
+ [OCIチュートリアル入門編](../beginners/)の、準備からその1、その2、その3、その7を実施しておくと、理解がスムーズです。  
+ より詳しく知りたい方は、[OCI活用資料集](https://oracle-japan.github.io/ocidocs/services/database/)も併せてご確認ください。それぞれのサービスに関する技術詳細資料をまとめ紹介しています。
<br/>

----

<br/>

# <span style="color: brown; ">■ Autonomous Database (ADB)を使ってみよう</span>
自己稼働・自己保護・自己修復をコンセプトにOracle Database、およびExadataをより身近にご利用いただくべく登場したAutonomous Database ! 
インスタンスの作成から、運用管理まで一通り学んでいただける内容になっています

> Autonomous Database (ADB)は、対象システムの処理特性に応じて以下を選択できます。本チュートリアルでは、ATPを対象に記載していますが、その他に関しても基本的な操作は同じです。  
> * 分析系システムを対象とするAutonmous Data Warehouse (ADW)
> * 汎用的な用途で利用可能なAutonomous Transaction Processing (ATP)
> * 主にJSONデータを扱うシステムに適したAutonomous JSON Database (AJD)
> * Oracle APEXアプリケーション開発用に構築されているAPEX Application Development (APEX)

## 基礎編

+ **[101: ADBインスタンスを作成してみよう](./adb101-provisioning/)**  
    * インスタンス作成から接続、データベース・ユーザーの作成まで実施します
    
+ **[102: ADBにデータをロードしよう(Database Actions)](./adb102-dataload/)**  
    * CSVデータを手元のPCおよびオブジェクトストレージからADBにロードします
    * またオブジェクトストレージ上で更新されたデータを自動的にDBに登録する方法も取り上げます（フィード機能）

+ **[103: Oracle LiveLabsのご紹介](./adb103-livelabs/)**  
    * さまざまなOracle Technologyのワークショップを提供しているOracle LiveLabsの概要、始め方についてご紹介します

+ **[104: クレデンシャル・ウォレットを利用して接続してみよう](./adb104-connect-using-wallet/)**  
    * SQL*Plus、SQLcl、SQL Developerからの接続方法についても確認します
    
+ **[105: ADBの付属ツールで簡易アプリを作成しよう(APEX)](./adb105-create-apex-app/)**  
    * 所要時間は約10分！スプレッドシート(Excelシート)から簡易アプリケーションを作成します
    
+ **[106: ADBでコンバージド・データベースを体験しよう](./adb106-json/)**  
    * JSONデータをADBに登録し、APIおよびSQLで操作します

+ **[107: ADBの付属ツールで機械学習(予測モデルからデプロイまで)](./adb107-machine-learning/)**  
    * タイタニック号の乗客情報から生存予測モデルを作成し、アプリで予測結果のレポートまでADBの中で行います。

+ **[108: 接続文字列を利用して接続してみよう](./adb108-walletless)**
    * ウォレットを使用しない接続方法とその前提となるネットワーク・アクセス・タイプの条件を確認します。

+ **[109: プライベート・エンドポイントのADBを作成してみよう](./adb109-private-endpoint)**
    * よりセキュアなネットワーク構成であるプライベート・エンドポイントのADBを作成します。

+ **[110: Oracle Analytics Desktopを使ってデータを見える化してみよう](./adb110-analyze-using-oad/)**  
    * Oracle Analytics Desktopを使ってADBのデータを見える化します。

+ **[111: SELECT AIを試してみよう](./adb111-select-ai/)**  
    * Select AIを使って自然言語でデータベース内のデータを問合せる方法をご紹介します

## 実践編

+ **[201: 接続サービスの理解](./adb201-service-names/)**  
    * インスタンスに接続する際の、CPUの割当や並列処理のコントロールを決定する「接続サービス」についてご紹介します。

+ **[202: コマンドラインから大量データをロードしてみよう](./adb202-dataload-dbms-cloud/)**  
    * 大規模なCSVデータを想定し、オブジェクト・ストレージからDBMS_CLOUDパッケージを利用してロードします
    
+ **[203: 分析系クエリの実行(Star Schema Benchmark)](./adb203-bulk-query/)**
    * SSBスキーマに対して重いクエリ処理を実行し、ECPU数をスケールすることで高速化できること確認します

+ **[204: 開発者向け仮想マシンのセットアップ方法](./adb204-setup-VM/)**  
    * 開発用の仮想マシンイメージを利用して、開発環境を作成しましょう。後続のチュートリアルにて利用します

+ **[205: オンライン・トランザクション系のアプリを実行してみよう（Swingbench)](./adb205-swingbench/)**
    * ECPU数と自動スケーリング設定に応じてADBのTPS(Transaction per second)が向上していく流れをSwingbenchを通して体験します

+ **[206: Node.jsによるADB上でのアプリ開発](./adb206-appdev-nodejs/)**  
    * Node.jsにてADBに接続し、簡易アプリを実行してみます

+ **[207: PythonによるADB上でのアプリ開発](./adb207-appdev-python/)**  
    * PythonでADBに接続し、ADBに格納されているデータを操作してみます

+ **[208: Oracle Machine Learningで機械学習をしよう](./adb208-oml-notebook/)**  
    * 機械学習のサンプルを2つほど取りあげ、OML Notebookの使い方を確認します

+ **[209 : Database Vaultによる職務分掌に基づいたアクセス制御](./adb209-DV/)**  
    * データベース管理者であっても本来参照してはいけないデータがあるはず。ADBでの特権ユーザーからアクセス制御方法を確認します

+ **[210 : 仮想プライベートデータベース(VPD)による細やかなアクセス制御](./adb210-VPD/)**  
    * 同じ表のデータでも行や列の単位でアクセス制御をかけることができます。ADBでの設定方法を確認します

+ **[211: クローン機能を使ってみよう](./adb211-clone/)**  
    * ADBを簡単に複製することができる、クローニング機能についてご紹介します

+ **[212: Autonomous Database を災害対策構成にしてみよう](./adb212-audg/)**  
    * たった数クリックでスタンバイ・データベースをプロビジョニングしDR構成を実現します

+ **[213 : Application Continuityを設定しよう](./adb213-tac/)**  
    * ネットワークの瞬断等の予期せぬエラーからアプリケーションを守るには？

+ **[214 : Spatial Studio で地理情報を扱おう](./adb214-spatial-studio/)**  
    * Spatial Studioを使って、地理情報からさまざまな空間分析を行います

+ **[215 : Graph Studioで金融取引の分析をしよう](./adb215-graph/)**  
    * Autonomous Databaseの標準機能であるGraph Studioの使い方をご紹介します。

+ **[216 : SQL Performance Analyzer(SPA)によるパッチ適用のテストソリューション](./adb216-patch-spa/)**  
    * Autonomous Databaseの特徴の一つである自動パッチ適用のSQLの性能影響を事前にテストします。

+ **[217: Database Actions を使ってみよう](./adb217-use-database-actions/)**  
    * Database Actions の内、データ分析、データ・インサイト、カタログの機能を確認します。

+ **[218 : リフレッシュ可能クローンを活用しよう](./adb218-refreshable-clone/)**  
    * Autonomous Databaseのクローンの一種であるリフレッシュ可能クローンを作成し、その動作を確認します。

+ **[219 : Automatic Indexingを体験してみよう](./adb219-autoindexing/)**  
    * Automatic Indexingの機能を用いて、人手を介することなく索引を管理することができます。
  
+ **[220 : 自動ワークロード・リプレイによるパッチ適用のテストソリューション](./adb220-autoworkload-replay/)**  
    * 毎週の自動パッチ適用によるアプリケーションへの影響を、テスト環境で毎週自動でテストします。

+ **[221 : 自動パーティション化（Automatic Partitioning）を使ってみよう](./adb221-autopartitioning/)**  
    * 対象の表に最適なパーティション方法の分析とその実装までをAPIで簡単に行うことができます。

## データ移行編
+ **[301: 移行元となるデータベースを作成しよう](./adb301-create-source-db)**
    * この**データ移行編**における準備作業として、まずは現行ご利用いただいているOracle Databaseを想定したデータベースを一つ作成します。

+ **[302: Cloud Premigration Advisor Tool(CPAT)を活用しよう](./adb302-cpat)**
    * 現行Oracle Database環境にてAutonomous Databaseが対応していない機能を利用していないか確認できる「Cloud Premigration Advisor Tool(CPAT)」をご紹介します。

+ **[303: Data Pumpを利用してデータを移行しよう](./adb303-datapump)**
    * データ移行に関する機能として従来からよく利用されるData Pumpを利用した移行方法をご紹介します。

+ **[304 : OCI Database Migration Serviceを使用したデータベース移行の前準備](./adb304-database-migration-prep)**
    * OCI DMSを使用したデータベース移行の前準備についてご紹介します。

+ **[305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行](./adb305-database-migration-offline)**
    * OCI DMSを使用したBaseDBからADBへのオフライン移行についてご紹介します。

+ **[306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行](./adb306-database-migration-online)**
    * OCI DMSを使用したBaseDBからADBへのオンライン移行についてご紹介します。

## データ連携編
+ **[401: OCI GoldenGateを利用したデータ連携](./adb401-oci-goldengate)**
    * OCI GodenGateを利用して、BaseDBからADBへのデータ連携方法をご紹介します。

+ **[402: Database Linkを利用したデータ連携](./adb402-database-link)**
    * Database Linkを利用して、ADBから他のデータベースへアクセスする方法をご紹介します。

+ **[OCI Data Integrationチュートリアル](../intermediates/ocidi-tutorials)**
    * ノーコーディングでETL処理を行うことができるフルマネージド・サービスを利用し、ADBにデータをロードする手順を解説します。

+ **[403: Data Transformsを使ってみよう](./adb403-data-transforms)**  
    * Data Transformsを用いて、簡単な操作でデータを変換できることが体験できます。
    
+ **[404:クラウド・リンクによるデータ共有をしてみよう](./adb404-cloud-link)**  
    * クラウド・リンクを使用したデータの共有手順をご紹介します。

+ **[405: ライブ共有を使ってみよう](./adb405-live-share)**  
    * この共有では、受信者はOracle表またはビューから直接、最新のデータにアクセスします。 

## 運用管理編

+ **[501: OCICLIを利用したインスタンス操作](./adb501-ocicli)**
    * OCI CLIを利用したADBインスタンスの作成や起動・停止、およびスケールアップ、ダウンといった構成変更の方法について確認します。

+ **[502: 各種設定の確認、レポートの取得](./adb502-report)**
    * OS領域に入ることのできないADBにおける各種レポート・ログの取得方法を確認します。

+ **[503: ADBインスタンスの監視設定をしてみよう](./adb503-monitoring)**
    * データベース運用における重要なタスクの一つである、ADBインスタンスに対するパフォーマンス監視/アラート監視の方法をご紹介します。

+ **[504: 監査をしてみよう](./adb504-audit)**
    * Autonomous Databaseの監査設定について確認します。

+ **[505: Autonomous Databaseのバックアップとリストアを体感しよう](./adb505-backup)**
    * Autonomous Databaseを任意のバックアップからリストアを行い、自動でバックアップが取られていること・簡単なPoint-in-timeリカバリを実感して頂きます。

+ **[506: サポートサービスへの問い合わせ(Service Requestの起票)](./adb506-sr)**
    * ADBの運用で困ったらどうすれば良いでしょうか。Service Requestの登録の仕方を解説します。

## ビジネスシナリオ編

+ **[601 : ADWでMovieStreamデータのロード・更新をしよう](./adb601-moviestream-load/)**  
    * 大規模データに対するADWの実用的な機能をご紹介します

+ **[602 : ADWでMovieStreamデータの分析をしよう](./adb602-moviestream-analysis/)**  
    * ADWでの実践的なデータ分析を多数の標準機能とともにご紹介します

+ **[603 : データ・カタログを使ってメタデータを収集しよう](./adb603-data-catalog/)**  
    * データ・カタログを使用してデータベース内のデータおよびクラウド・ストレージ内のデータのメタデータを収集し、効率的に管理する方法をご紹介します

## Autonomous Database Dedicated (専有環境)編

+ **[701 : ADB-Dの環境を作成してみよう](./adb701-adbd/)**  
    * Autonomous Databaseの基盤であるExadataを専有して利用するAutonomous Database Dedicatedの環境を作成します

<br/>

----
 + **[ADB ハンズオンラボ](https://community.oracle.com/tech/developers/discussion/4474304/autonomous-database-%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3%E3%83%A9%E3%83%9C-adb-hol)**    ※旧サイト（順次、本サイトに移行中）

<br/>

**Database編のチュートリアル一覧に[もどる](../)**

<!-- 

## 移行編（公開準備中）
## データ連携編
## 運用管理編
## Livelabsのお勧めコンテンツのご紹介
## ADBに関するよくあるFAQ

  -->  

<br/>
