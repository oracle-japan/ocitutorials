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
+ **[101: Oracle Cloud で Oracle Database を使おう](/ocitutorials/database/dbcs101-create-db/)**

+ **[102: PDBを管理しよう](/ocitutorials/database/dbcs102-managing-pdb/)**  

+ **[103: パッチを適用しよう](/ocitutorials/database/dbcs103-patch/)**  

<br/>

# <span style="color: brown; ">■ Exadata Cloud Service (ExaCS) を使ってみよう</span>

Oracle Databaseを動かすための最適な基盤として、リリースから10年以上経過し、多くのミッションクリティカルなシステムを支えるExadata !  
OCIであればExadataもサブスクリプションで使えます。インスタンスの作り方から、様々な使い方を学んでいただける内容になっています。

+ **[Oracle CloudでExadataを使おう](https://community.oracle.com/docs/DOC-1038411/)**   

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

+ **[101: ADBインスタンスを作成してみよう](/ocitutorials/database/adb101-provisioning/)**  
    * インスタンス作成から接続、データベース・ユーザーの作成まで実施します
    
+ **[102: ADBにデータをロードしよう(Database Actions)](/ocitutorials/database/adb102-dataload/)**  
    * CSVデータを手元のPCおよびオブジェクトストレージからADBにロードします
    * またオブジェクトストレージ上で更新されたデータを自動的にDBに登録する方法も取り上げます（フィード機能）

+ **[103: Oracle LiveLabsのご紹介(Database Actions)](/ocitutorials/database/adb103-livelabs/)**  
    * さらなるDatabase Actionsの使い方を例に、Oracle LiveLabsの概要、始め方についてご紹介します

+ **[104: クレデンシャル・ウォレットを利用して接続してみよう](/ocitutorials/database/adb104-connect-using-wallet/)**  
    * SQL*Plus、SQLcl、SQL Developerからの接続方法についても確認します
    
+ **[105: ADBの付属ツールで簡易アプリを作成しよう(APEX)](/ocitutorials/database/adb105-create-apex-app/)**  
    * 所要時間は約10分！スプレッドシート(Excelシート)から簡易アプリケーションを作成します
    
+ **[106: ADBでコンバージド・データベースを体験しよう](/ocitutorials/database/adb106-json/)**  
    * JSONデータをADBに登録し、APIおよびSQLで操作します

+ **[107: ADBの付属ツールで機械学習を始めよう(AutoML UI)](/ocitutorials/database/adb107-machine-learning/)**  
    * 機械学習モデルをビルドして、RESTでCallする手順を確認します
    
## 実践編

+ **[201: 接続サービスの理解](/ocitutorials/database/adb201-service-names/)**  
    * インスタンスに接続する際の、CPUの割当や並列処理のコントロールを決定する「接続サービス」についてご紹介します。

+ **[202: コマンドラインから大量データをロードしてみよう](/ocitutorials/database/adb202-dataload-dbms-cloud/)**  
    * 大規模なCSVデータを想定し、オブジェクト・ストレージからDBMS_CLOUDパッケージを利用してロードします
    
+ **[203: 分析系クエリの実行(Star Schema Benchmark)](/ocitutorials/database/adb203-bulk-query/)**
    * SSBスキーマに対して重いクエリ処理を実行し、OCPU数をスケールすることで高速化できること確認します

+ **[204: マーケットプレイスからの仮想マシンのセットアップ方法](/ocitutorials/database/adb204-setup-VM/)**  
    * 開発用の仮想マシンイメージを利用して、開発環境を作成しましょう。後続のチュートリアルにて利用します

+ **[205: オンライン・トランザクション系のアプリを実行してみよう（Swingbench)](/ocitutorials/database/adb205-swingbench/)**
    * OCPU数と自動スケーリング設定に応じてADBのTPS(Transaction per second)が向上していく流れをSwingbenchを通して体験します

+ **[206: Node.jsによるADB上でのアプリ開発](/ocitutorials/database/adb206-appdev-nodejs/)**  
    * Node.jsにてADBに接続し、簡易アプリを実行してみます

+ **[207: PythonによるADB上でのアプリ開発](/ocitutorials/database/adb207-appdev-python/)**  
    * PythonでADBに接続し、ADBに格納されているデータを操作してみます

+ **[208: Oracle Machine Learningで機械学習をしよう](/ocitutorials/database/adb208-oml-notebook/)**  
    * 機械学習のサンプルを2つほど取りあげ、OML Notebookの使い方を確認します

+ **[209 : Database Vaultによる職務分掌に基づいたアクセス制御](/ocitutorials/database/adb209-DV/)**  
    * データベース管理者であっても本来参照してはいけないデータがあるはず。ADBでの特権ユーザーからアクセス制御方法を確認します

+ **[210 : 仮想プライベートデータベース(VPD)による細やかなアクセス制御](/ocitutorials/database/adb210-VPD/)**  
    * 同じ表のデータでも行や列の単位でアクセス制御をかけることができます。ADBでの設定方法を確認します

+ **211: クローン機能を使ってみよう（公開準備中）**  

+ **[212: Autonomous Data Guardを構成してみよう](/ocitutorials/database/adb212-audg/)**  
    * たった数クリックでスタンバイ・データベースをプロビジョニングしDR構成を実現します

+ **[213 : Application Continuityを設定しよう](/ocitutorials/database/adb213-tac/)**  
    * ネットワークの瞬断等の予期せぬエラーからアプリケーションを守るには？

## 運用管理編

+ **[501: OCICLIを利用したインスタンス操作](/ocitutorials/database/adb501-ocicli)**
    * OCI CLIを利用したADBインスタンスの作成や起動・停止、およびスケールアップ、ダウンといった構成変更の方法について確認します。

<br/>

 + **[ADB ハンズオンラボ](https://community.oracle.com/tech/developers/discussion/4474304/autonomous-database-%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3%E3%83%A9%E3%83%9C-adb-hol)**    ※旧サイト（順次、本サイトに移行中）



<!-- 

## 移行編（公開準備中）
## データ連携編
## 運用管理編
## Livelabsのお勧めコンテンツのご紹介
## ADBに関するよくあるFAQ

  -->  

<br/>




