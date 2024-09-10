---
title: "208: Oracle Machine Learningで機械学習をしよう"
excerpt: "Oracle Machine Learningで液体の品質の予測や、同時購入商品の予測していきます。Autonomous Databaseで始める堅牢なデータの蓄積とその利活用の世界をご体感頂けます。"
order: "3_208"
layout: single
header:
  teaser: "/adb/adb208-oml-notebook/img20.png"
  overlay_image: "/adb/adb208-oml-notebook/img20.png"
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
    - [OML用のユーザを作成する](#anchor1-1)
    - [データセットをADBにロードする](#anchor1-2)
      - [liquid.csvをDatabase Actionsからロード](#anchor1-2-1)
      - [order_items.csvをObject Storageにアップロード](#anchor1-2-2)
- [機械学習編](#anchor2)
    - [OML Notebookを使い始める](#anchor2-1)
    - [機械学習モデルをビルド・評価する](#anchor2-2)

<br>

**所要時間:** 約40分

<a id="anchor1"></a>
<br>

# 準備編

## OML用のユーザを作成する

1. **Database Actions**から、MLユーザを作成していきましょう。

   ![image.png](img0.png)

1. ADMINユーザーでDatabase Actionsにサインインできていることが確認できたら、**管理**から**データベース・ユーザー**をクリックします。

   ![image.png](img1.png)

1. 以下のように設定して**ユーザーの作成**をクリックし、機械学習用のユーザを作成します。
   * ユーザー名：**OMLUSER**
   * パスワード：例：**Welcome12345#**
   * 表領域の割り当て制限：**UNLIMITED**
   * OML、Webアクセスのトグルを**ON**
   ![image.png](img2.png)

1. ユーザーが作成されました。

   ![image.png](img3.png)

1. Database Actionからサインアウトします。

   ![image.png](img4.png)


1. 作成済のOMLUSERユーザーで**サインイン**して下さい。

   ![image.png](img5.png)

<br>

<a id="anchor1-2"></a>

## データセットをADBにロードする

<a id="anchor1-2-1"></a>

###  liquid.csvをDatabase Actionsからロード

1. Database Actionsの起動パッドの**Data Stusio**から、**データ・ロード** を選択します。

   ![image.png](img6.png)

1. **データのロード** > **ローカル・ファイル** を選択します。**ファイルの選択**をクリックし、ダウンロードして解凍した **liquid.csv** を選択します。


   ![image.png](img7.png)
   ![image.png](img8.png)


1. liquid.csvがロードできる状態になりました。ロード前に**ペンアイコン**をクリックし、詳細設定を確認・変更できます。

   ![image.png](img9.png)

1. liquid.csvの表定義等のデータのプレビューを確認したら **閉じる** をクリックします。

   ![image.png](img10.png)

1. **開始**をクリック後、ポップアップの**実行**をクリックし、データのロードを開始します。

   ![image.png](img11.png)

1. データ・ロード・ジョブの実行を確認するポップアップが表示されるので、**実行** をクリックします。

   ![image.png](img12.png)

1. liquid.csvのロードが完了しました。

   ![image.png](img13.png)

<a id="anchor1-3-2"></a>

### order_items.csvをObject Storageにアップロード

1. [ADBインスタンスを作成しよう](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/)で学習した**オブジェクトストレージへのデータアップロード** を参照し、**order_items.csv**を**Object Storage**にアップロードして下さい。

   ![image.png](img14.png)

<br>

<a id="anchor2"></a>

# 機械学習編

<a id="anchor2-1"></a>

## OML Notebookを使い始める

1. ADB詳細画面の**ツール構成**タブから、OMLにアクセスするパブリック・アクセスURLをコピーし、別タブで開きます。

   ![image.png](img15.png)

1. 先ほどOMLユーザ管理で新規作成したユーザ(OML)で**サインイン**して下さい。

   ![image.png](img16.png)

1. クイック・アクションの**ノートブック**をクリックして下さい。

   ![image.png](img17.png)

1. 任意のノートブックの名前を入力後、**OK**をクリックして下さい。

   ![image.png](img18.png)

1. ノートブックの画面に遷移します。

   ![image.png](img19.png)

1. 作成したノートブックでスクリプトを書き始めることが可能になりました。

   下記のコマンドでPythonで機械学習を書き始めることが可能です。

   ```
   %python

   import oml
   oml.isconnected()
   ```

   ![image.png](img20.png)

   下記のコマンドで、同じノートブック内でSQLを使用したLiquid表へのクエリを実行してみましょう。

   ```
   %sql

   select * from liquid;
   ```

   ![image.png](img21.png)

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


