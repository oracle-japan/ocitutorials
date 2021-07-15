---
title: "Oracle Database編"
excerpt: "Oracle Cloud Infrastructure (OCI) を利用する Oracle Database 関連のチュートリアルです。ミッションクリティカルなシステムで豊富な実績を持つ Exadata をパブリック・クラウド上で利用できる Exadata Cloud Service (ExaCS) や、一歩先を行くフルマネージドサービスである Autonomous Database (ADB) 等のサービスについて、基本的な操作方法を学習します。"
permalink: /database/
layout: single
tags: "Database"
show_excerpts: true
toc: true
---

このページでは、Oracle Cloud Infrastructure(OCI)で利用可能な3つのOracle Databaseのサービスに関するチュートリアルを纏めています。
それぞれステップ・バイ・ステップで学ぶことができ、各サービスの基本的な機能、操作やオペレーションについて学習することができます。  
尚、より詳しく知りたい方は、[OCI活用資料集](https://oracle-japan.github.io/ocidocs/services/database/)も併せてご確認ください。それぞれのサービスに関する技術詳細資料をまとめ紹介しています。

<br>

**前提条件**
+ Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、ユーザーアカウントがあること
+ 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切な権限がユーザーに付与されていること

<br>
**注意 :** チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。

<br/>

# <span style="color: brown; ">■ Database Cloud Service (DBCS) を使ってみよう</span>

Oracleのクラウドで使いたいものと言ったら、そう! Oracle Database!!  
まずはベーシックなDatabase Cloud Service インスタンスを作ってみましょう。
+ **[Oracle CloudでOracle Databaseを使おう](https://community.oracle.com/tech/welcome/discussion/4474262/)**　[所要時間:30分]  

<br/>

# <span style="color: brown; ">■ Exadata Cloud Service (ExaCS) を使ってみよう</span>

Oracle Databaseを動かすための最適な基盤として、リリースから10年以上経過し、多くのミッションクリティカルなシステムを支えるExadata !  
OCIであればExadataもサブスクリプションで使えます。インスタンスの作り方から、様々な使い方を学んでいただける内容になっています。

+ **[Oracle CloudでExadataを使おう](https://community.oracle.com/docs/DOC-1038411/)**   

<br/>

# <span style="color: brown; ">■ Autonomous Database (ADB)を使ってみよう</span>

Oracle Database、およびExadataをより身近にご利用いただくべく、自己稼働・自己保護・自己修復をコンセプトに登場したAutonomous Database !  
インスタンスの作成から、運用管理まで一通り学んでいただける内容になっています。

尚、Autonomous Database (ADB)は、対象システムの処理特性に応じて以下を選択できます。本チュートリアルでは、ATPを対象に記載していますが、その他に関しても基本的な操作は同じです。  
* 分析系システムを対象とするAutonmous Data Warehouse (ADW)
* 汎用的な用途で利用可能なAutonomous Transaction Processing (ATP)
* 主にJSONデータを扱うシステムに適したAutonomous JSON Database (AJD)

<br/>

## 基礎編

+ **[101: ADBインスタンスを作成してみよう](/ocitutorials/database/adb101-provisioning/)**  
    * インスタンス作成から接続、データベース・ユーザーの作成まで実施します
    
+ **[102: まずADBにデータをロードしよう(Database Actions)](/ocitutorials/database/adb102-dataload/)**  
    * CSVデータを手元のPCおよびオブジェクトストレージからADBにロードします
    * またオブジェクトストレージ上で更新されたデータを自動的にDBに登録する方法も取り上げます（フィード機能）

+ **[103: Oracle LiveLabsのご紹介(Database Actions)](/ocitutorials/database/adb103-livelabs/)**  
    * さらなるDatabase Actionsの使い方を例に、Oracle LiveLabsの概要、始め方についてご紹介します

+ **[104: クレデンシャル・ウォレットを利用して接続してみよう](/ocitutorials/database/adb104-connect-using-wallet/)**  
    * SQL*Plus、SQLcl、SQL Developerからの接続方法についても確認しましょう
    
+ **[105: ADBの付属ツールで簡易アプリを作成しよう(APEX)](/ocitutorials/database/adb105-create-apex-app/)**  
    * 所要時間は約10分！スプレッドシート(Excelシート)から簡易アプリケーションを作ってみましょう
    
+ **[106: ADBでコンバージド・データベースを体験しよう](/ocitutorials/database/adb106-json/)**  
    * JSONデータをADBに登録し、APIおよびSQLで操作してみましょう

+ **[107: ADBの付属ツールで機械学習を始めよう(AutoML UI)](/ocitutorials/database/adb107-machine-learning/)**  
    * 機械学習モデルをビルドして、RESTでCallする手順をみてみましょう
    
## 実践編

+ **[201: 接続サービスの理解（公開準備中）]**  

+ **[202: コマンドラインから大量データをロードしてみよう](/ocitutorials/database/adb202-dataload-dbms-cloud/)**  
    * 大規模なCSVデータを想定し、オブジェクト・ストレージからDBMS_CLOUDパッケージを利用してロードしてみましょう
    
+ **[203: 大量データのクエリ](/ocitutorials/database/adb203-bulk-query/)**
    * SSBスキーマに対して、OCPU数をスケールしながら重い処理を実行していきます。

+ **[204: マーケットプレイスからの仮想マシンのセットアップ方法](/ocitutorials/database/adb204-setup-VM/)**  
    * 開発用の仮想マシンイメージを利用して、開発環境を作成しましょう。後続のチュートリアルにて利用します。

+ **[206: Node.jsによるADB上でのアプリ開発](/ocitutorials/database/adb206-appdev-nodejs/)**  
    * 開発言語としてNode.jsを想定し、Autonomous Databaseに対して接続する方法、およびデータベース操作を実行する方法をご紹介します。

+ **[207: PythonによるADB上でのアプリ開発](/ocitutorials/database/adb207-appdev-python/)**  
    * 開発言語としてNode.jsを想定し、Autonomous Databaseに対して接続する方法、およびデータベース操作を実行する方法をご紹介します。

+ **[208: Oracle Machine Learningで機械学習をしよう](/ocitutorials/database/adb208-oml-notebook/)**  
    * 機械学習のサンプルを2つほど取りあげ、OML Notebookの使い方をご紹介します。


<br/>

 + **[ADB ハンズオンラボ](https://community.oracle.com/tech/developers/discussion/4474304/autonomous-database-%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3%E3%83%A9%E3%83%9C-adb-hol)**  ※旧サイト（順次、こちらのサイトに移行予定です。）

<!-- 

## 移行編
## データ連携編
## 運用管理編
## Livelabsのお勧めコンテンツのご紹介
## ADBに関するよくあるFAQ

  -->  


<br/>





