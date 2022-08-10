---
title: "Oracle Database編"
excerpt: "Oracle Cloud Infrastructure (OCI) で利用可能な3つのOracle Databaseのサービスに関するチュートリアルを纏めています。まずはベーシックなOracle Database Cloud Service(DBCS)から、ミッションクリティカルなシステムで豊富な実績を持つ Exadata をパブリック・クラウド上で利用できる Exadata Cloud Service (ExaCS) 、または一歩先を行くフルマネージドサービスである Autonomous Database (ADB) について基本的な機能、操作方法を学習できます"
permalink: /database/
layout: single
tags: "Database"
show_excerpts: true
toc: true
---
  
**前提条件**  
+ Oracle Cloud Infrastructure の環境と、ユーザーアカウントがあること(トライアル環境でも実施いただける内容となっています。)
+ 適切なコンパートメントと、そこに対する適切な権限がユーザーに付与されていること

**特記事項**  
+ チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。
+ [OCIチュートリアル入門編](/ocitutorials/beginners/)の、準備からその1、その2、その3、その7を実施しておくと、理解がスムーズです。  
+ より詳しく知りたい方は、[OCI活用資料集](https://oracle-japan.github.io/ocidocs/services/database/)も併せてご確認ください。それぞれのサービスに関する技術詳細資料をまとめ紹介しています。

<br/>


# <span style="color: brown; ">■ Database Cloud Service (DBCS) を使ってみよう</span>

Oracleのクラウドで使いたいものと言ったら、そう! Oracle Database!!  
まずはベーシックなDatabase Cloud Service インスタンスを作ってみましょう。

## 基礎編

+ **[101: Oracle Cloud で Oracle Database を使おう](/ocitutorials/database/dbcs101-create-db/){:target="_blank"}**

+ **[102: DBCS上のPDBを管理しよう](/ocitutorials/database/dbcs102-managing-pdb/){:target="_blank"}**  

+ **[103: パッチを適用しよう](/ocitutorials/database/dbcs103-patch/){:target="_blank"}**  

+ **[104: 自動バックアップを設定しよう](/ocitutorials/database/dbcs104-backup/){:target="_blank"}**

+ **[105: バックアップからリストアしよう](/ocitutorials/database/dbcs105-restore/){:target="_blank"}**

+ **[106: Data Guardを構成しよう](/ocitutorials/database/dbcs106-dataguard/){:target="_blank"}**

## データ移行編

+ **[201: オンプレミスのPDBをDBCSに移動しよう](/ocitutorials/database/dbcs201-pdb-plug/){:target="_blank"}**

<br/>

# <span style="color: brown; ">■ Exadata Database Service on Dedicated Infrastructure (ExaDB-D) を使ってみよう</span>

Oracle Databaseを動かすための最適な基盤として、リリースから10年以上経過し、多くのミッションクリティカルなシステムを支えるExadata !  
OCIであればExadataもサブスクリプションで使えます。インスタンスの作り方から、様々な使い方を学んでいただける内容になっています。

+ **[101: ExaDB-Dを使おう](/ocitutorials/database/exadb-d101-create-exadb-d/){:target="_blank"}**   

<br/>

# <span style="color: brown; ">■ Autonomous Database (ADB)を使ってみよう</span>

自己稼働・自己保護・自己修復をコンセプトにOracle Database、およびExadataをより身近にご利用いただくべく登場したAutonomous Database !  
インスタンスの作成から、運用管理まで一通り学んでいただける内容になっています。

> Autonomous Database (ADB)は、対象システムの処理特性に応じて以下を選択できます。本チュートリアルでは、ATPを対象に記載していますが、その他に関しても基本的な操作は同じです。  
> * 分析系システムを対象とするAutonmous Data Warehouse (ADW)
> * 汎用的な用途で利用可能なAutonomous Transaction Processing (ATP)
> * 主にJSONデータを扱うシステムに適したAutonomous JSON Database (AJD)
> 

## 基礎編

+ **[101: ADBインスタンスを作成してみよう](/ocitutorials/database/adb101-provisioning/){:target="_blank"}**  
    * インスタンス作成から接続、データベース・ユーザーの作成まで実施します
    
+ **[102: ADBにデータをロードしよう(Database Actions)](/ocitutorials/database/adb102-dataload/){:target="_blank"}**  
    * CSVデータを手元のPCおよびオブジェクトストレージからADBにロードします
    * またオブジェクトストレージ上で更新されたデータを自動的にDBに登録する方法も取り上げます（フィード機能）

+ **[103: Oracle LiveLabsのご紹介(Database Actions)](/ocitutorials/database/adb103-livelabs/){:target="_blank"}**  
    * さらなるDatabase Actionsの使い方を例に、Oracle LiveLabsの概要、始め方についてご紹介します

+ **[104: クレデンシャル・ウォレットを利用して接続してみよう](/ocitutorials/database/adb104-connect-using-wallet/){:target="_blank"}**  
    * SQL*Plus、SQLcl、SQL Developerからの接続方法についても確認します
    
+ **[105: ADBの付属ツールで簡易アプリを作成しよう(APEX)](/ocitutorials/database/adb105-create-apex-app/){:target="_blank"}**  
    * 所要時間は約10分！スプレッドシート(Excelシート)から簡易アプリケーションを作成します
    
+ **[106: ADBでコンバージド・データベースを体験しよう](/ocitutorials/database/adb106-json/){:target="_blank"}**  
    * JSONデータをADBに登録し、APIおよびSQLで操作します

+ **[107: ADBの付属ツールで機械学習(予測モデルからデプロイまで)](/ocitutorials/database/adb107-machine-learning/){:target="_blank"}**  
    * タイタニック号の乗客情報から生存予測モデルを作成し、アプリで予測結果のレポートまでADBの中で行います。

+ **[108: 接続文字列を利用して接続してみよう](/ocitutorials/database/adb108-walletless){:target="_blank"}**
    * ウォレットを使用しない接続方法とその前提となるネットワーク・アクセス・タイプの条件を確認します。

+ **[109: プライベート・エンドポイントのADBを作成してみよう](/ocitutorials/database/adb109-private-endpoint){:target="_blank"}**
    * よりセキュアなネットワーク構成であるプライベート・エンドポイントのADBを作成します。

+ **[110: Oracle Analytics Desktopを使ってデータを見える化してみよう](/ocitutorials/database/adb110-analyze-using-oad/){:target="_blank"}**  
    * Oracle Analytics Desktopを使ってADBのデータを見える化します。

## 実践編

+ **[201: 接続サービスの理解](/ocitutorials/database/adb201-service-names/){:target="_blank"}**  
    * インスタンスに接続する際の、CPUの割当や並列処理のコントロールを決定する「接続サービス」についてご紹介します。

+ **[202: コマンドラインから大量データをロードしてみよう](/ocitutorials/database/adb202-dataload-dbms-cloud/){:target="_blank"}**  
    * 大規模なCSVデータを想定し、オブジェクト・ストレージからDBMS_CLOUDパッケージを利用してロードします
    
+ **[203: 分析系クエリの実行(Star Schema Benchmark)](/ocitutorials/database/adb203-bulk-query/){:target="_blank"}**
    * SSBスキーマに対して重いクエリ処理を実行し、OCPU数をスケールすることで高速化できること確認します

+ **[204: 開発者向け仮想マシンのセットアップ方法](/ocitutorials/database/adb204-setup-VM/){:target="_blank"}**  
    * 開発用の仮想マシンイメージを利用して、開発環境を作成しましょう。後続のチュートリアルにて利用します

+ **[205: オンライン・トランザクション系のアプリを実行してみよう（Swingbench)](/ocitutorials/database/adb205-swingbench/){:target="_blank"}**
    * OCPU数と自動スケーリング設定に応じてADBのTPS(Transaction per second)が向上していく流れをSwingbenchを通して体験します

+ **[206: Node.jsによるADB上でのアプリ開発](/ocitutorials/database/adb206-appdev-nodejs/){:target="_blank"}**  
    * Node.jsにてADBに接続し、簡易アプリを実行してみます

+ **[207: PythonによるADB上でのアプリ開発](/ocitutorials/database/adb207-appdev-python/){:target="_blank"}**  
    * PythonでADBに接続し、ADBに格納されているデータを操作してみます

+ **[208: Oracle Machine Learningで機械学習をしよう](/ocitutorials/database/adb208-oml-notebook/){:target="_blank"}**  
    * 機械学習のサンプルを2つほど取りあげ、OML Notebookの使い方を確認します

+ **[209 : Database Vaultによる職務分掌に基づいたアクセス制御](/ocitutorials/database/adb209-DV/){:target="_blank"}**  
    * データベース管理者であっても本来参照してはいけないデータがあるはず。ADBでの特権ユーザーからアクセス制御方法を確認します

+ **[210 : 仮想プライベートデータベース(VPD)による細やかなアクセス制御](/ocitutorials/database/adb210-VPD/){:target="_blank"}**  
    * 同じ表のデータでも行や列の単位でアクセス制御をかけることができます。ADBでの設定方法を確認します

+ **[211: クローン機能を使ってみよう](/ocitutorials/database/adb211-clone/){:target="_blank"}**  
    * ADBを簡単に複製することができる、クローニング機能についてご紹介します

+ **[212: Autonomous Data Guardを構成してみよう](/ocitutorials/database/adb212-audg/){:target="_blank"}**  
    * たった数クリックでスタンバイ・データベースをプロビジョニングしDR構成を実現します

+ **[213 : Application Continuityを設定しよう](/ocitutorials/database/adb213-tac/){:target="_blank"}**  
    * ネットワークの瞬断等の予期せぬエラーからアプリケーションを守るには？

+ **[214 : Spatial Studio で地理情報を扱おう](/ocitutorials/database/adb214-spatial-studio/){:target="_blank"}**  
    * Spatial Studioを使って、地理情報からさまざまな空間分析を行います

+ **[215 : Graph Studioで金融取引の分析をしよう](/ocitutorials/database/adb215-graph/){:target="_blank"}**  
    * Autonomous Databaseの標準機能であるGraph Studioの使い方をご紹介します。

+ **[216 : SQL Performance Analyzer(SPA)によるパッチ適用のテストソリューション](/ocitutorials/database/adb216-patch-spa/){:target="_blank"}**  
    * Autonomous Databaseの特徴の一つである自動パッチ適用のアプリケーションに対する影響を事前にテストします。

+ **[218 : リフレッシュ可能クローンを活用しよう](/ocitutorials/database/adb218-refreshable-clone/){:target="_blank"}**  
    * Autonomous Databaseのクローンの一種であるリフレッシュ可能クローンを作成し、その動作を確認します。

## データ移行編
+ **[301: 移行元となるデータベースを作成しよう](/ocitutorials/database/adb301-create-source-db){:target="_blank"}**
    * この**データ移行編**における準備作業として、まずは現行ご利用いただいているOracle Databaseを想定したデータベースを一つ作成します。

+ **[302: Cloud Premigration Advisor Tool(CPAT)を活用しよう](/ocitutorials/database/adb302-cpat){:target="_blank"}**
    * 現行Oracle Database環境にてAutonomous Databaseが対応していない機能を利用していないか確認できる「Cloud Premigration Advisor Tool(CPAT)」をご紹介します。

+ **[303: Data Pumpを利用してデータを移行しよう](/ocitutorials/database/adb303-datapump){:target="_blank"}**
    * データ移行に関する機能として従来からよく利用されるData Pumpを利用した移行方法をご紹介します。

+ **[304 : OCI Database Migration Serviceを使用したデータベース移行の前準備](/ocitutorials/database/adb304-database-migration-prep){:target="_blank"}**
    * OCI DMSを使用したデータベース移行の前準備についてご紹介します。

+ **[305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行](/ocitutorials/database/adb305-database-migration-offline){:target="_blank"}**
    * OCI DMSを使用したDBCSからADBへのオフライン移行についてご紹介します。

+ **[306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行](/ocitutorials/database/adb306-database-migration-online){:target="_blank"}**
    * OCI DMSを使用したDBCSからADBへのオンライン移行についてご紹介します。

## データ連携編
+ **[401: OCI GoldenGateを利用したデータ連携](/ocitutorials/database/adb401-oci-goldengate){:target="_blank"}**
    * OCI GodenGateを利用して、DBCSからADBへのデータ連携方法をご紹介します。

+ **[402: Database Linkを利用したデータ連携](/ocitutorials/database/adb402-database-link){:target="_blank"}**
    * Database Linkを利用して、ADBから他のデータベースへアクセスする方法をご紹介します。

+ **[OCI Data Integrationチュートリアル](/ocitutorials/intermediates/ocidi-tutorials){:target="_blank"}**
    * ノーコーディングでETL処理を行うことができるフルマネージド・サービスを利用し、ADBにデータをロードする手順を解説します。


## 運用管理編

+ **[501: OCICLIを利用したインスタンス操作](/ocitutorials/database/adb501-ocicli){:target="_blank"}**
    * OCI CLIを利用したADBインスタンスの作成や起動・停止、およびスケールアップ、ダウンといった構成変更の方法について確認します。

+ **[502: 各種設定の確認、レポートの取得](/ocitutorials/database/adb502-report){:target="_blank"}**
    * OS領域に入ることのできないADBにおける各種レポート・ログの取得方法を確認します。

+ **[503: ADBインスタンスの監視設定をしてみよう](/ocitutorials/database/adb503-monitoring){:target="_blank"}**
    * データベース運用における重要なタスクの一つである、ADBインスタンスに対するパフォーマンス監視/アラート監視の方法をご紹介します。

+ **[504: 監査をしてみよう](/ocitutorials/database/adb504-audit){:target="_blank"}**
    * Autonomous Databaseの監査設定について確認します。

+ **[505: Autonomous Databaseのバックアップとリストアを体感しよう](/ocitutorials/database/adb505-backup){:target="_blank"}**
    * Autonomous Databaseを任意のバックアップからリストアを行い、自動でバックアップが取られていること・簡単なPoint-in-timeリカバリを実感して頂きます。

+ **[506: サポートサービスへの問い合わせ(Service Requestの起票)](/ocitutorials/database/adb506-sr){:target="_blank"}**
    * ADBの運用で困ったらどうすれば良いでしょうか。Service Requestの登録の仕方を解説します。

## ビジネスシナリオ編

+ **[601 : ADWでMovieStreamデータのロード・更新をしよう](/ocitutorials/database/adb601-moviestream-load/){:target="_blank"}**  
    * 大規模データに対するADWの実用的な機能をご紹介します

+ **[602 : ADWでMovieStreamデータの分析をしよう](/ocitutorials/database/adb602-moviestream-analysis/){:target="_blank"}**  
    * ADWでの実践的なデータ分析を多数の標準機能とともにご紹介します

## Autonomous Database Dedicated (専有環境)編

+ **[701 : ADB-Dの環境を作成してみよう](/ocitutorials/database/adb701-adbd/){:target="_blank"}**  
    * Autonomous Databaseでご利用いただける専有環境の構成します

<br/>
----
 + **[ADB ハンズオンラボ](https://community.oracle.com/tech/developers/discussion/4474304/autonomous-database-%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3%E3%83%A9%E3%83%9C-adb-hol){:target="_blank"}**    ※旧サイト（順次、本サイトに移行中）



<!-- 

## 移行編（公開準備中）
## データ連携編
## 運用管理編
## Livelabsのお勧めコンテンツのご紹介
## ADBに関するよくあるFAQ

  -->  

<br/>
