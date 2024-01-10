---
title: "110: Oracle Analytics Desktopを使ってデータを見える化してみよう"
excerpt: "Oracle Analytics Desktopを使ってデータを見える化してみよう。"

order: "3_110"
layout: single
header:
  teaser: "/adb/adb110-analyze-using-oad/img3_13_1.png"
  overlay_image: "/adb/adb110-analyze-using-oad/img3_13_1.png"
  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474310
---

<a id="anchor0"></a>

# はじめに

Autonomous Database (ADB) にはさまざまなツールが同梱されており、簡単にご利用いただけますが、
Oracle Analytics Desktop を使うと、ユーザーのPC上から Autonomous Database のデータを見える化できます。

Oracle Analytics Desktop は、デスクトップ・アプリケーションであり、データの探索および見える化するためのツールです。複数のソースからサンプル・データを簡単に検索したり、ローカルのデータセットを分析したり調査することが可能です。

Autonomous Database は暗号化およびSSL相互認証を利用した接続を前提としており、そのため接続する際はクレデンシャル・ウォレット（Credential.zipファイル）を利用する必要があります。

本章ではこのOracle Analytics Desktopを使用した Autonomous Database の見える化について確認していきます。

<br>

**前提条件**
+ ADBインスタンスが構成済みであること
    <br>※ADBインタンスの作成方法については、[101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning){:target="_blank"} をご参照ください。  
+ クレデンシャル・ウォレットを取得済みであること
    <br>※クレデンシャル・ウォレットの取得については、[104:クレデンシャル・ウォレットを利用して接続してみよう](/ocitutorials/adb/adb104-connect-using-wallet/#anchor1){:target="_blank"} を参照ください。<br>
+ Oracle Analytics Desktop は、Windows OS用とMac OS用がありますが、本章ではWindows OS用 を使って説明します。
+ Oracle Analytics Desktop をインストールするPCから、プロキシ・サーバーを経由せずに、直接、インターネットに繋がること。
    <br>※Oracle Analytics Desktop はプロキシ対応できません。  
<br>

**目次**

- [1. Oracle Analytics Desktop をダウンロードする](#anchor1)
- [2. スクリプトをSQLワークシートから実行してビューを作成する](#anchor2)
- [3. Oracle Analytics Desktop から ADB に接続し、データを見える化する](#anchor3)

<br>
**所要時間 :** 約30分

<a id="anchor1"></a>
<br>

# 1. Oracle Analytics Desktop をダウンロードする
Oracle Analytics Desktop (OAD) をダウンロードします。
1. 次のサイトから、Oracle Analytics Desktop のインストーラーをダウンロードします。

    [Oracle Analytics Desktop ダウンロードサイト](https://www.oracle.com/jp/solutions/business-analytics/analytics-desktop/oracle-analytics-desktop.html){:target="_blank"} 
    
2. OADダウンロードサイトから、**ダウンロード**をクリックします。

     ![img1_2.png](img1_2.png)

3. Oracleログイン画面が表示されるので、Oralceプロファイルを入力します。Oralceアカウントをお持ちでない場合、下の **プロファイルの作成** をクリックして、Oralceアカウントを作成します。

    <img src="img1_3.png" width="80%">

4. ダウンロード画面が表示されるので、Platforms から **Microst Windows x64 (64bit)** を選択し、ライセンス許諾のチェックボックスを **チェック** して、 **zipファイル** をクリックします。すると、インストーラーがダウンロードされるので、任意の場所に保存します。

    <img src="img1_4_2.png" width="80%">

5. ダウンロードした zipファイル を解凍し、解凍したフォルダの中の exeファイル をダブルクリックしてインストールを開始します。インストールするフォルダ名は、日本語や空白を含まないように（例 C:\OAD ）してください。また、フォルダの中は空である必要があります。

    <img src="img1_5.png" width="80%">

6. インストーラーが起動するので、 **Browse** ボタンをクリックして、日本語や空白を含まない名前のフォルダに変更します。ファルダの中は空である必要があります。次に、**Install** ボタン、または、**Upgrade** ボタンをクリックして、インストールを始めます。

    <img src="img1_6.png" width="80%">
    
    フォルダを選択します。

    <img src="img1_6_1.png" width="80%">

7. インストールが完了したら、 **finish** ボタンをクリックして、インストーラーを終了します。これで、Oracle Analytics Desktop をインストールできました。

    <img src="img1_7.png" width="80%">

<br>

<a id="anchor2"></a>

# 2. スクリプトをSQLワークシートから実行してビューを作成する

Oracle Analytics Desktop でデータを見える化するためのビューを作成します。

データにはAutonomous Databaseで提供されているサンプルデータのSHスキーマ（売上実績）を使います。ビューを作成することで売上データを分析しやすい大福帳形式のデータにすることができます。ビューを作成するSQLは、Database Actions のSQLから実行します。

1. メニュー画面から、インスタンスを選択してインスタンスのメニュー画面を表示します。

    <img src="img2_1.png" width="80%">

2. インスタンスのメニュー画面から **データベース・アクション** をクリックします。 

     <img src="img2_1.png" width="80%">

3. Database Actionsの起動パッドで **SQL** をクリックします。  

    <img src="img2_3.png" width="80%">

4. SQLワークシートが起動します。ワークシートに次のSQLを貼り付け、 **スクリプトの実行** ボタンをクリックします。下のスクリプト表示に **view DV_SH_VIEWは作成されました** と表示されたらOKです。
<br>
これで、見える化するデータの準備ができました。1行目の drop文は再実行用で、ビューがなければ、エラーとなります。drop文のエラーは問題ありません。

    ```sql
    drop view DV_SH_VIEW;

    create or replace view DV_SH_VIEW as select
    P.PROD_NAME,
    P.PROD_DESC,
    P.PROD_CATEGORY,
    P.PROD_SUBCATEGORY,
    P.PROD_LIST_PRICE,
    S.QUANTITY_SOLD,
    S.AMOUNT_SOLD,
    X.CUST_GENDER,
    X.CUST_YEAR_OF_BIRTH,
    X.CUST_MARITAL_STATUS,
    X.CUST_INCOME_LEVEL,
    R.COUNTRY_NAME,
    R.COUNTRY_SUBREGION,
    R.COUNTRY_REGION,
    T.TIME_ID,
    T.DAY_NAME,
    T.CALENDAR_MONTH_NAME,
    T.CALENDAR_YEAR from
    SH.PRODUCTS P,
    SH.SALES S,
    SH.CUSTOMERS X,
    SH.COUNTRIES R,
    SH.TIMES T where
    S.PROD_ID=P.PROD_ID and
    S.CUST_ID=X.CUST_ID and
    S.TIME_ID=T.TIME_ID and
    X.COUNTRY_ID=R.COUNTRY_ID;
    ```

    <img src="img2_4.png" width="80%">

<a id="anchor3"></a>

# 3. Oracle Analytics Desktop から Autonomous Database に接続し、データを見える化する

Oracle Analytics Desktop から Autonomous Database (ADB)  への接続設定をつくります。ADBへの接続に必要なウォレットをまだダウンロードしていない方は、このページの上の前提条件のリンクからウォレットのダウンロード方法を参照してください。

1. Windowsスタートメニューから、Oracle > **Oracle Analytics Desktop** をクリックし、Oracle Analytics Desktop を起動します。

    <img src="img3_1.png" width="80%">

2. Oracle Analytics Desktop アプリケーションの右上の **作成** ボタンをクリックし、 **接続** をクリックします。

    <img src="img3_2.png" width="80%">

3. データセットの作成画面が表示されたら、 **Oracle Autonomous Transaction Processing** （または、Oracle Autonomous Data Warehouse を作成している場合は、**Oracle Autonomous Data Warehouse** ）をクリックします。

    <img src="img3_3.png" width="80%">

4. 接続の作成画面が表示されたら、 ダイアログで、各項目に接続情報を入力します。

    <table>
       <tr>
       <td>接続名</td>
       <td>SALES_HISTORY</td>
       </tr>
       <tr>
       <td>説明</td>
       <td>（空白）</td>
       </tr>
       <tr>
       <td>クライアント資格証明</td>
       <td>（事前にダウンロードしておいたウォレットzipファイルを選択）</td>
       </tr>
       <tr>
       <td>ユーザー名</td>
       <td>ADMIN</td>
       </tr>
       <tr>
       <td>パスワード</td>
       <td>Welcome12345#<br>（インスタンス作成時に設定したADMINユーザーのパスワード）</td>
       </tr>
       <tr>
       <td>サービス名</td>
       <td>atpXX_high</td>
       </tr>
    </table>
     <br>
    <img src="img3_4.png" width="80%">

5. 接続が成功すると、接続一覧に **SALES_HISTORY** が表示されます。

    <img src="img3_5.png" width="80%">

6. 次に、見える化対象のデータセットを作成します。右上の **作成** から、**データセット** をクリックします。

    <img src="img3_6.png" width="80%">

7. データセットの作成画面で、作成した **SALES_HISTORY** をクリックします。

    <img src="img3_7.png" width="80%">

8. 新規データセットの画面で、左のスキーマ一覧から、**ADMIN** スキーマを展開し、**DV_SH_VIEW** を右の画面にドラッグ＆ドロップ、または、ダブルクリックで、右側に追加します。

    <img src="img3_8.png" width="80%">

9. 右のデータセットに追加されたので、右上の保存マークをクリックし、**SALES_HISTORY** と名前をつけて、**OK** をクリックします。

    <img src="img3_9.png" width="80%">

10. 10秒ぐらい待つと、データセット画面の右上に、**ワークブックの作成** ボタンが現れるので、クリックします。ワークブックは、実際にデータを見える化するダッシュボードになります。

    <img src="img3_10.png" width="80%">

    >**Note**
    >
    >データセット画面一覧からデータセットを選ぶ、または、はじめに画面に戻り、作成からワークブックを選んでからデータセットを選択してもワークブックを作成できます。

11. 新規ワークブック画面に変わり、左に SALES_HISTORYビュー の列情報が表示されるので、SALES_HISTORYビュー内の5つのデータ要素（ PROD_NAME、PROD_CATEGORY、QUANTITY_SOLD、AMOUNT_SOLD、CALENDAR_YEAR）を複数選択（Ctrlキーを押しながらクリック）し、画面の右側にドラッグ＆ドロップします。

    <img src="img3_11.png" width="80%">

12. このデータにもとづいて、Oracle Analytics Desktop はデフォルトのグラフを選択しました。項目が自動的に配置されます。この例では、 Oracle Analytics Desktop はグラフに散布図を選択しました。グラフのドロップダウンメニューをクリックして、他の数十種類のグラフの中からお好みのグラフを選択できます。

    <img src="img3_12.png" width="80%">
    
    グラフの種類を積み上げ棒に変更すると、次のようなグラフになります。

    <img src="img3_12_1.png" width="80%">

13. 項目の配置は、ドラッグ＆ドロップすることで自由に変更できます。PROD_CATEGORY と CALENDAR_YEAR の配置をドラッグ＆ドロップで入れ替えます。そうすると、配置にあわせてグラフが変わります。

    <img src="img3_13.png" width="80%">
    
    項目を入れ替えると、それにともなってグラフが変わります。

    <img src="img3_13_1.png" width="80%">

    >**Note**
    >
    >項目の追加・削除もマウスで操作できます。また、別の項目セットを画面右側にドラッグ＆ドロップすれば、同じ画面にグラフを追加できます。

14. 必要に応じて、このワークブックを保存できます。画面右上の 保存マーク をクリックし、**保存** をクリックすると、プロジェクトの保存ダイアログが表示されるので、プロジェクト名を入力して保存をクリックします。プロジェクトが保存されたというメッセージが表示されたらOKです。保存されたワークブックは、再度、開くことで、同じグラフを表示できます。

    <img src="img3_15.png" width="80%">

<br>
以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)


