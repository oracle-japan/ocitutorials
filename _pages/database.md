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

+ **[ADBインスタンスを作成してみよう](/ocitutorials/database/adb101-provisioning/)**  
    * クラウド環境へのアクセス
    * リージョンの確認、設定
    * コンパートメントの確認
    * ATPインスタンスの作成（プロビジョニング）
    * ATPインスタンスに接続してみよう（Database Actiona）
    * データベース・ユーザーの作成

+ **[ADBにデータをロードしてみよう(Database Actions)](/ocitutorials/database/adb102-dataload/)**  
    * 手元のPCからCSVデータをアップロード
    * オブジェクトストレージからCSVデータをロード
    * オブジェクトストレージから新規データをデータベースにフィード
    * その他Tips

+ **[ご参考）Database Actionsのさらなる活用に向けて（Oracle Livelabs）](/ocitutorials/database/adb103-livelabs/)**  
    * Oracle LiveLabsとは?
    * Database Actionsのワークショップご紹介
    * その他、お勧めワークショップの紹介

+ **[Walletを利用した接続](/ocitutorials/database/adb104-connect-using-wallet/)**  
    * クレデンシャル・ウォレットのダウンロード
    * ADBに接続（SQL*Plus、SQLcl、SQL Developer、Database Actions)

+ **[APEXを使った簡易アプリ作成](/ocitutorials/database/adb105-create-apex-app/)**  
    * スプレッドシートのサンプルを用意
    * APEXのワークスペースの作成
    * スプレッドシートから簡易アプリケーションの作成、実行確認

+ **[AutoML UIで機械学習を始める](/ocitutorials/database/adb107-machine-learning/)**  
    * 機械学習モデルのビルド
    * 機械学習モデルのデプロイ
    * デプロイした機械学習モデルをRESTで呼ぶ

+ **[ADBにデータをロードしてみよう(DBMS_CLOUD)](/ocitutorials/database/adb202-dataload-dbms-cloud/)**  
    * Database Actionsに接続
    * Database ActionsでDBMS_CLOUDパッケージの実行

<br/>

 + **[ADB ハンズオンラボ](https://community.oracle.com/tech/developers/discussion/4474304/autonomous-database-%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3%E3%83%A9%E3%83%9C-adb-hol)**  ※旧サイト（順次、こちらのサイトに移行予定です。）

<!-- 

## 実践編
## 移行編
## データ連携編
## 運用管理編
## Livelabsのお勧めコンテンツのご紹介
## ADBに関するよくあるFAQ

  -->  


<br/>





