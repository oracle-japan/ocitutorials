---
title: "103: Oracle LiveLabsのご紹介(Database Actions)"
excerpt: "Autonomous DatabaseのツールDatabase Actionsはデータ活用のための機能を包括的に提供しています。ワークショップでそれらを体験してみましょう。"
order: "103"
layout: single
header:
  teaser: "/database/adb103-livelabs/labimage.png"
  overlay_image: "/database/adb103-livelabs/labimage.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

<a id="anchor0"></a>

# はじめに

Database Actionsで利用できる機能はユーザ作成やデータ・ロードだけではありません。  
データベース管理者はもとより、Autonomous Databaseのデータを開発者やデータ分析者がすぐに利用できる機能群が提供されています。
詳細は[こちら](https://speakerdeck.com/oracle4engineer/autonomous-database-database-actions-ji-neng-gai-yao)の資料をご確認ください。  　　



   ![画面ショット0-1](DatabaseActions_component.png)



データ活用に関わる機能であるデータロード、カタログ、データインサイト、ビジネスモデルは、**[Oracle LiveLabs](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/home)** というサイトでイメージのようにシナリオに沿って実環境で体験することができます。この章ではその方法をご案内します。  

  

   ![画面ショット0-2](DatabaseActions_component2.png)

<br>

**目次**

- [1.Oracle LiveLabsとは? ](#anchor1)
- [2.Database Actionsのワークショップのご紹介と開始手順](#anchor2)
- [3.関連ワークショップのご紹介](#anchor3)

<br>
**所要時間 :** 約20分

<a id="anchor1"></a>
<br>

# 1.Oracle LiveLabsとは?  

[Oracle LiveLabs](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/home) とはOracle Cloud Infrastructure上でお試しいただける様々なワークショップをまとめたサイトです。150種類を超える数のワークショップが登録されています。

   ![画面ショット1-1](livelabs.png)

　　

ワークショップの実行には、ご利用いただいているOracle Cloud環境およびAlways Free/トライアル環境をお使いいただけます。またワークショップによっては、Oracle LiveLabsで時間制限を設けた一時利用環境も提供しております。  
(一時利用環境の利用手順については[こちら](https://qiita.com/Skogkatter112/items/209ae71fc71c3572e52d)が参考になります。)

なお、英語での提供ではありますが、ブラウザの翻訳機能をご利用いただくことで十分に進めることができます。このチュートリアルでは、日本語表示の場合はGoogle Chromeの翻訳機能を利用しています。

<br>
<a id="anchor2"></a>
<br>

# 2.Database Actionsのワークショップのご紹介

Oracle LiveLabsのDatabase Actionsのワークショップはこちらです。

**["Introduction to Autonomous Database Tools"](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=789)**

![画面ショット2-1](DatabaseActionslab.png)


## 概要と開始手順
このワークショップでは、架空のオンライン映画ストリーミング会社"Oracle MovieStream"の社員になった想定で、顧客データ、視聴データをもとに顧客の傾向を分析していきます。  
具体的には、分析するためのデータのロードとクレンジング、ビジネスに即した分析モデル作成とそこからの洞察を行います。それらすべてをDatabase Actionsで実施できるのです。


それでは、利用する環境に合わせて、以下のどちらかをクリックしてください。このチュートリアルではフリートライアルを想定してLaunch Free Trial Workshopを選択しています。  


   ![画面ショット2-2](Environment.png)


ワークショップのホーム画面が表示されました。

![画面ショット2-2](DatabaseActionsLab2.png)



このDatabase Actionsのワークショップは大きく3つのラボで構成されています。

+ ラボ1:ADBインスタンスのプロビジョニング
+ ラボ2:データベースユーザーの作成
+ ラボ3:自律型データベースツールの使用

既にADBインスタンス作成済みの場合はラボ2から進めてください。
ラボ3でOracle MovieStreamのシナリオに従ってデータの分析を行っていきます。実際にAutonomous DatabaseのデータをDatabase Actionsでどのように活用できるかをイメージいただけるはずです。


## ブラウザ翻訳時の注意
ワークショップのホームは、ブラウザの翻訳機能で日本語化すると上の部分しか翻訳がおこわなわれません。その場合は、**これらのワークショップの説明を新しいタブで開きます** をクリックして新しいタブで画面を開いて翻訳してください。  


   ![画面ショット2-3](intro.png)
     
<br>


<br>
<a id="anchor3"></a>
<br>


# 3. その他のワークショップの紹介
Oracle LiveLabsのホーム画面の上部には検索ボックスがあります。  
**Autonomous Database** と入力すると、Autonomous Database関連のワークショップが一覧で表示されます。それぞれのワークショップで完結してお試しいただけますので、ぜひアクセスいただき、気になるワークショップからお気軽にお試しください。 


![画面ショット3-1](adbworkshops.png)


尚、Autonomous Databaseの機能に特化したものだけでなく、例えば、以下のようなAutonomous Databaseと他のサービスを組み合わせたワークショップやアプリケーション開発のワークショップもあります。  


<br>

+ [ Setting up a Departmental Data Warehouse with ADW and OAC Workshop](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=684)
   + すぐにデータ分析を始めたいんだけど、何から始めたら良いのか？という方にオススメ。
   + Autonomous Databaseのセットアップと、Oracleが提供するデータ分析ツール（OAC: Oracle Analytics Cloud）の利用方法、接続方法について解説しています。

+ [Modern App Dev with Oracle REST Data Services Workshop](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=815)
   + Autonomous Databaseではデータを参照・更新するREST APIを簡単に作成、公開することができます。
   + アプリケーションサーバを構成することなく、またGET/POSTメソッドで呼び出すだけなので、アプリケーション開発をより促進いただくことが可能です。
   + このワークショップではREST APIの作成方法についてご紹介しています。

+ [Building Microservices with Oracle Converged Database](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=637)
   + アプリケーションをマイクロサービス・アーキテクチャで構成する場合、RDB、JSON、Text、Spatial、Graphといった様々な形式のデータを扱えるConverged Databaseのメリットや、一方でサービス毎に迅速にDBを用意できるといったアジリティが活かせます。
   + このワークショップではマイクロサービスフレームワークであるHelidon、およびJavascriptを利用したサンプルアプリケーションをKubernetes上にセットアップしつつ、各種操作をご体験いただけます。


<br>
以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)



