---
title: "208: Oracle Machine Learningで機械学習をしよう"
excerpt: "Oracle Machine Learningで液体の品質の予測や、同時購入商品の予測していきます。Autonomous Databaseで始める堅牢なデータの蓄積とその利活用の世界をご体感頂けます。"
order: "3_208"
layout: single
header:
  teaser: "/adb/adb208-oml-notebook/img12.jpg"
  overlay_image: "/adb/adb208-oml-notebook/img12.jpg"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

<a id="anchor0"></a>

# はじめに

この章ではOracle Machine Learning(OML)の製品群の1つである、OML Notebookを利用して、DB内でデータの移動が完結した機械学習を体験して頂きます。 
事前に前提条件にリンクされているサンプルデータのCSVファイルをお手元のPC上にダウンロードください。  
（集合ハンズオンセミナーでは講師の指示に従ってください）

<br>

**前提条件** 

* ADBインスタンスが構成済みであること
    <br>※ADBインタンスを作成方法については、[101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning){:target="_blank"} を参照ください。  
* 以下にリンクされているファイルをダウンロードしていること
	+ [liquid.csv](/ocitutorials/adb/adb208-oml-notebook/ADB-OML-Tutorial/liquid.csv)
	+ [order_items.csv](/ocitutorials/adb/adb208-oml-notebook/ADB-OML-Tutorial/order_items.csv)

<br>

**目次**

- [準備編](#anchor1)
    - [OMLユーザを作成する](#anchor1-1)
    - [作成したOMLユーザのRESTサービスを有効化する](#anchor1-2)
    - [データセットをADBにロードする](#anchor1-3)
      - [liquid.csvをDatabase Actionsからロード](#anchor1-3-1)
      - [order_items.csvをObject Storageにアップロード](#anchor1-3-2)
- [機械学習編](#anchor2)
    - [OML Notebookを使い始める](#anchor2-1)
    - [機械学習モデルをビルド・評価する](#anchor2-2)

<br>

**所要時間:** 約40分

<a id="anchor1"></a>
<br>

# 準備編

## OMLユーザを作成する

1. **ツール**タブの**Oracle MLユーザ管理**で、MLユーザを作成していきましょう。

   ![image.png](img0.jpg)

1. ADBのADMINユーザの情報を入力し、**サインイン**をクリックして下さい。

   ![image.png](img0.5.jpg)。。

1. **+作成ボタン**をクリックし、機械学習用のユーザを作成します。

   ![image.png](img1.jpg)

1. ユーザーの情報を入力し、画面右上**作成ボタン**をクリックして下さい。

   ![image.png](img2.jpg)

1. ユーザOMLが作成されたことを確認し、ADW詳細画面へ戻ります。

   ![image.png](img3.jpg)

<a id="anchor1-2"></a>

## 作成したOMLユーザのRESTサービスを有効化する

後述のデータロードをステップで、OMLユーザでDatabase Actionsを活用していきます。
OMLユーザーは作成後、RESTを有効化しないとDatabase Actionsにログインできないので、OMLユーザのRESTを有効化していきましょう。

1. [ADBインスタンスを作成しよう](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/)で学習した**Database Actionsを利用したインスタンスへの接続** を参照し、Database Actionsを起動し、Adminユーザーで接続してください。**ツール**タブから、**データベース・アクションを開く**をクリックしてください。

   ![画面ショット1-1](img19.png)

1. ADMINユーザで**サインイン**して下さい。

   ![image.png](img40.png)

1. Database Actionsのランディングページから**データベース・ユーザ** を選択します。

   ![image.png](img41.png)

1. 作成済の**OMLユーザ**を確認することができます。

   ![image.png](img42.png)

1. **OMLユーザ**の**オプションボタン**から**RESTの有効化**をクリックして下さい。

   ![image.png](img43.png)

1. **REST対応ユーザー**をクリックして下さい。

   ![image.png](img44.png)

1. **OMLユーザ**に**RESTの有効化の**マークを確認することができます。


   ![image.png](img45.png)

1. 画面右上の**ADMIN**をクリックし表示されたドロップダウンメニュから、**サインアウト**をして下さい。

   ![image.png](img46.png)

1. 作成済のOMLユーザで**サインイン**して下さい。

   ![image.png](img47.png)

<br>

<a id="anchor1-3"></a>

## データセットをADBにロードする

<a id="anchor1-3-1"></a>

###  liquid.csvをDatabase Actionsからロード

1. Database Actionsのランディングページのデータ・ツールから　**データ・ロード** を選択します。

   ![image.png](img21.jpg)

1. データの処理には、**データのロード** を選択し、データの場所には、**ローカル・ファイル** を選択して **次** をクリックします。

   ![image.png](img22.jpg)

1. **ファイルの選択**をクリックし、ダウンロードして解凍した **liquid.csv** を選択します。

   ![image.png](img23.jpg)

1. liquid.csvがロードできる状態になりました。ロード前に**ペンアイコン**をクリックし、詳細設定を確認・変更できます。

   ![image.png](img24.jpg)

1. liquid.csvの表定義等のデータのプレビューを確認したら **閉じる** をクリックします。

   ![image.png](img25.jpg)

1. **緑色の実行ボタン**をクリックし、データのロードを開始します。

   ![image.png](img26.jpg)

1. データ・ロード・ジョブの実行を確認するポップアップが表示されるので、**実行** をクリックします。

   ![image.png](img27.jpg)

1. liquid.csvに**緑色のチェックマーク**が付き、ロードが完了しました。**完了**をクリックします。

   ![image.png](img28.jpg)

<a id="anchor1-3-2"></a>

### order_items.csvをObject Storageにアップロード

1. [ADBインスタンスを作成しよう](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/)で学習した**オブジェクトストレージへのデータアップロード** を参照し、**order_items.csv**を**Object Storage**にアップロードして下さい。

   ![image.png](img29.jpg)

<br>

<a id="anchor2"></a>

# 機械学習編

<a id="anchor2-1"></a>

## OML Notebookを使い始める

1. ADW詳細画面の**サービス・コンソール**をクリックして下さい。

   ![image.png](img4.jpg)

1. サービスコンソール画面左の**開発**をクリックして下さい。

   ![image.png](img5.jpg)

1. サービスコンソール開発タブ内の、**Oracle Machine Learningノートブック**をクリックして下さい。

   ![image.png](img6.jpg)

1. 先ほどOMLユーザ管理で新規作成したユーザ(OML)で**サインイン**して下さい。

   ![image.png](img7.jpg)

1. クイック・アクションの**ノートブック**をクリックして下さい。

   ![image.png](img8.jpg)

1. 任意のノートブックの名前を入力後、**OK**をクリックして下さい。

   ![image.png](img9.jpg)

1. 新規作成した**ノートブック名**をクリックして下さい。

   ![image.png](img10.jpg)

1. ノートブックの画面に遷移して下さい。

   ![image.png](img11.jpg)

1. 作成したノートブックでスクリプトを書き始めることが可能になりました。

   下記のコマンドでPythonで機械学習を書き始めることが可能です。

   ```
   %python

   import oml
   oml.isconnected()
   ```

   ![image.png](img12.jpg)

   下記のコマンドで、同じノートブック内でSQLを使用したLiquid表へのクエリを実行してみましょう。

   ```
   %python

   select * from liquid;
   ```

   ![image.png](img50.jpg)

<br>

<a id="anchor2-2"></a>

## 機械学習モデルをビルド・評価する

以降、こちらの資料を見ながら実施していきます。

+ [Autonomous Database MLハンズオン](https://speakerdeck.com/oracle4engineer/adb-ml-hol)

また、以下のリンクから直接資料をダウンロードすることも可能です。

+ [Autonomous Database MLハンズオン資料](/ocitutorials/adb/adb208-oml-notebook/ML_HOL_20200325.pdf)

資料内で使用するSQLは、下記の**Handson_SQL.txt**を確認することが可能です。
手入力ではなくコピー＆ペーストして学習を進めていくことができます。

+ [Handson_SQL.txt](/ocitutorials/adb/adb208-oml-notebook/ADB-OML-Tutorial/Handson_SQL.txt)

<br>

### **ハンズオンの内容**

   **・液体の品質の予測を行う**

   ![image.png](img60.png)

   **・アソシエーション分析を行う**

   ![image.png](img61.png)



<br>
以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)


