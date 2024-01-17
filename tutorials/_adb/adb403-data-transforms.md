---
title: "403 : Data Transformsを使ってみよう"
excerpt: "Autonomous Databaseに組み込まれているデータ統合ツールであるData Transformsを使い、簡単な操作でサンプルデータの変換ができることを体験してみましょう。"
order: "3_403"
layout: single
header:
  teaser: "/adb/adb403-data-transforms/adb403_2_4.png"
  overlay_image: "/adb/adb403-data-transforms/adb403_2_4.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
---

<a id="anchor0"></a>

# はじめに
Data Transformsは、Autonomous Databaseに組み込まれているデータ統合ツールです。Database Actionsからアクセス可能で、異種のソースからAutonomous Databaseにデータをロードして変換するためのツールです。ドラッグアンドドロップ、ノーコードで簡単に操作できます。データウェアハウスの構築や分析アプリケーションへのデータ供給など、あらゆるデータ統合のニーズに対応できます。

Data TransformsはOracle Data Integratorをベースにしています。オンプレミスおよびOCIの両方で、多くのお客様において高性能なデータ統合アーキテクチャとして証明されている、ELT(Extract/Load/Transform)手法を使用しています。

本章ではAutonomous Databaseの付属ツールであるData Transformsを用いて、少ない労力でデータを変換する方法を紹介します。<br>

**所要時間 :** 約60分

**前提条件 :**

* ADBインスタンスが構成済みであること
   <br>※ADBインタンスを作成方法については、本チュートリアルの [101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning){:target="_blank"} を参照ください。
* 構成済みのADBインスタンスへの接続が可能であること
* 下記リンクからダウンロードできる**Movie Sales 2020.csv**(売上実績のサンプルデータ)がローカルPC上にあること<br>

    [217: クレデンシャル・ウォレットを利用して接続してみよう](https://oracle-japan.github.io/ocitutorials/adb/adb217-use-database-actions/#%E3%81%AF%E3%81%98%E3%82%81%E3%81%AB){:target="_blank"}



**目次：**

- [1. 事前準備](#anchor1)
- [2. Dara Transformsの起動](#anchor2)
- [3. Data Transformsを使ってみる](#anchor3)
- [4. おわりに](#anchor4)


<br>

<a id="anchor1"></a>

# 1. 事前準備

実際にData Transformsを使用する前に、起動したADBインスタンスから新しいユーザー(**QTEAM**)を作成し、本チュートリアルで使用するサンプルデータ(**Movie Sales 2020.csv**)をロードします。

次の手順に従って、QTEAMユーザーを作成します。すでに作っている場合は、[ステップ2](/ocitutorials/adb/adb403-data-transforms/#anchor1_2){:target="_blank"}に進んでください。  

1. 下記のリンクを参考に、QTEAMユーザーを作成します。<br>
    [分析用のデータベース・ユーザーを作成しよう(Database Actions)](https://oracle-japan.github.io/ocitutorials/adb/adb217-use-database-actions/#1-%E5%88%86%E6%9E%90%E7%94%A8%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%97%E3%82%88%E3%81%86database-actions){:target="_blank"}
    
    *ユーザーを作成の際に、付与されたロールから以下の2つのユーザーロールを、以下の画像のように有効にします。<br>
    ・DWROLE <br>
    ・DATA_TRANSFORMS_USER

    ![QTEAMを作成する際の付与されたロールの選択1](adb403_1_1.png)
      

    ![QTEAMを作成する際の付与されたロールの選択2](adb403_1_2.png)

    ※［付与済］と［デフォルト］の両方のボックスにチェックをつけてください。

    <a id="anchor1_2"></a>

1. QTEAMユーザーが作成されたことを確認したら、QTEAMユーザーカードの右下にある**新しいタブで開く**アイコン(赤枠)をクリックして、QTEAMユーザーでログインし直します。

    ![QTEAMユーザーが作成された画面](adb403_1_3.png)

1.  下記のリンク参考に、Movie Sales 2020.csvをロードします。<br>
    [手元のPCからCSVデータをロードしてみよう](https://oracle-japan.github.io/ocitutorials/adb/adb102-dataload/#anchor1){:target="_blank"}

<br>

<a id="anchor2"></a>

# 2. Data Transformsの起動

1. QTEAMユーザーでDatabase Actionsにログインした状態で、起動パッドを開きます。

    ![Database Avtionsの起動パッド](adb403_2_1.png)

1. Data Transforms(データ変換)の項目をクリックし、データベースのユーザー名(QTEAM)とパスワード(例: Welcome12345#)を入力します。

    ![Data Transformsのログイン画面1](adb403_2_2.png)

1. Data Transformsが立ち上がるまで、1～2分程度かかります。

    ![Data Transformsのログイン画面2](adb403_2_3.png)

    ログインができると、ホーム画面はこのようになります。

    ![Data Transformsのホーム画面](adb403_2_4.png)

<br>

<a id="anchor3"></a>

# 3. Data Transformsを使ってみる

## 3-1. Autonomous Databaseへの接続

1. Data Transformsのメインページで、画面左のConnectionsをクリックします。デフォルトのConnectionがすでに設定されています。以下の画像のように、すでに作成したADBインスタンスの名前になっているかと思います。本チュートリアルではデフォルトのConnectionではなく、新規にConnectionを作成する手順を踏みたいので、Create Connectionをクリックしてください。
    ![Create Connectionの説明1](adb403_2_5.png)
    
1. Create Connectionに、必要な情報を入力していきます。

    ・Name: MovieStream　<br>
    ・Connection Type: Oracle <br>
    とし、Nextを押します。

    ![Create Connectionの説明2](adb403_2_6.png)


1. Use Credential Fileのトグルをオンにして有効にし、ウォレットファイルを選択します。サービス(データベース名_low, 例:atp01_low)を選び、ユーザーとパスワードを入力します。<br>
    Test Connectionを押して、接続テストをします。成功したら、以下のような通知が画面右上に表示されます。

    ![Create Connectionの説明3](adb403_2_6_1.png)
    
1. 接続に成功したのを確認したら、Createをクリックして、Autonomous Databaseへの接続を作成します。

    ![Create Connectionの説明4](adb403_2_7.png)

1. Data Transformsを使用している間、操作に関する通知のうち、重要なものが記載されます。これらの通知を表示するには、画面上部のベルのアイコンをクリックします。

    ![Data Transformsの通知機能](adb403_2_8.png)

## 3-2. データベース内のデータをインポートする

1. ここで、QTEAMのスキーマにある表をインポートする必要があります。Data Entities(画面左)、Import Data Entitiesの順にクリックします。

    ![データのインポートの説明1](adb403_2_9.png)

1. 以下のようなダイアログが表示されます。データをロードするConnection名とスキーマ名を入力し、Startをクリックします。インポートのジョブの通知が表示されます。ジョブが終了するまでには数分かかります。

    ![データのインポートの説明2](adb403_2_10.png)

1. インポートされたか表示されます(ジョブが終了するまで数分待ち、表示されない場合は更新してください)。<br>
しばらくすると、movie_sales_2020がリストされます。必要に応じて、画面左下のFiltersで検索をかける(例: Nameにmoviesと入力)こともできます。<br>
リストされた表の右側にある3つの点をクリックし、Previewを選択します。

    ![インポートしたデータの確認1](adb403_2_11.png)

1. 2020年の全ての月のデータがありますが、本チュートリアルでは、第2四半期のデータのみを分析します。<br>
表の中身を見ると、DAYの値が大文字のものもあれば、最初の1文字のみ大文字のものもあります。これは、システムにデータをロードする時によく起こることで、データのエラーを修正する必要があります。そのため、データの変換機能がAutonomous Data Warehouseに組み込まれていることは、利便性の上で非常に重要です。
    ![インポートしたデータの確認2](adb403_2_12.png)

    画面右上の×をクリックして、プレビュー画面を閉じます。
    
<a id="anchor3"></a>

## 3-3. Data Flowを作成する

1. Projects(画面左)をクリックし、Create Data Flowをクリックします。

    ![Data Flowの作成1](adb403_3_1.png)

1. Data Transformsのツールでは、Data FlowはProjectsの中で構成されています。まだどちらも作っていないため、表示されるダイアログで1度に両方を定義することができます。ダイアログで以下のように指定し、Createをクリックします。

    ・Name: MovieStream_Q2FY2020 <br>
    ・Create new Project　ラジオボタンがすでに選択されていると思われます。<br>
    ・Project Name: MovieStream <br>
    ・Description: Extract & fix data for Q2 FY2020

    ![Data Flowの作成2](adb403_3_2.png)

1. 続いて、Add a Schemaを入力する画面が出てきます。これは、自動で以下のように入力されるので、特に変更せずにOKボタンをクリックしてください。

    ![Data Flowの作成3](adb403_3_3.png)

1. Data Flowの詳細画面が表示されます。以下のように、画面は大きく4つのセクションに分かれています。

    ![Data Flowの詳細画面1](adb403_3_4.png)

    ここからは、次のようにData Flowを定義します。

    ・MOVIE_SALES_2020にフィルタを適用して、Q2以外の月のデータを削除します。

    ・DAY列におけるエラーを修正します。

    ・結果を、新しい表のMOVIE_SALES_2020Q2に適用します。<br>
    
    <br>

1. 次の手順で、Data Flowを構築します。

    1. 画面左側のData Entitiesの上部にある更新ボタン(円形矢印)をクリックします。

    2. QTEAMスキーマを展開して、表のリストを表示します。

    3. 表示されたリストから、MOVIE_SALES_2020をクリックします。

    4. MOVIE_SALES_2020をキャンバスにドラッグアンドドロップします。

    5. ツール・パレットから、DATA TRANSFORMタブをクリックします.
    
    6. フィルタをキャンバスにドラッグアンドドロップします。

    7. キャンバスに表示されているフィルタをクリックして選択します。

    8. 画面右側のプロパティの部分で、名前をQ2_Onlyと入力します。

    9. キャンバス上で、MOVIE_SALES_2020をクリックします。

    10. MOVIE_SALES_2020の右側の矢印を引き延ばして、フィルタに接続します。

    ![Data Flowを構築する手順](adb403_3_5.png)

1. 上記の手順が完了したら、キャンバス上でフィルタを選択します。

    ![Filterを選択するイメージ](adb403_3_6.png)

1. 次に、フィルタのプロパティを定義します。フィルタを選択した状態でフィルタのConditionをクリックし、編集ボタン(鉛筆マーク)をクリックします。

    ![Filterを選択するイメージ](adb403_3_7.png)

1. 表示されたエディターで、フィルタの条件を完成させます。以下の作業をエディターで行います。

    1. Sourcesのタブで、表を展開します。

    2. 列MONTHをExpressionにドラッグアンドドロップします。

    3. 以下の式を追加します。<br>
    ```
    in ('April','May','June')
    ```


    ![Filterから月を絞り込むイメージ](adb403_3_8.png)

1. このステップでは、列 MOVIE_SALES_2020.DAYのデータのエラーを修正します。

    1. ツール・パレットで、DATA PREPARATIONタブをクリックします。

    2. Data Cleanseをキャンバスにドラッグアンドドロップします。

    3. 先ほど作成したフィルタをクリックし、そこから Data Cleanseまで矢印を引き延ばします。

    4. Data Cleanseをクリックして選択します。

    5. Nameに"Fix_AllCap_Days"、Descriptionに"Convert all values in column DAY to Title Case."を入力します。

    ![列 MOVIE_SALES_2020.DAYのデータを修正するイメージ](adb403_3_9.png)

1. 右上の拡大ボタンをクリックします。

    ![列 MOVIE_SALES_2020.DAYのデータを修正し、プロパティを開くイメージ](adb403_3_10.png)

1. 表示されたプロパティ画面の中央の、Attributesタブをクリックします。

    ![プロパティを開いて、Attributesを押す画面](adb403_3_11.png)

1. MOVIE_SALES_2020.DAY列のデータから、先頭と末尾の空白を削除し、Title Case(最初の1文字のみを大文字)に変換し、データを修正する必要があります。以下のように、オプションを選択してください。

    ![プロパティから、実際にデータを修正する画面](adb403_3_12.png)

1. 完了したら、右上の折りたたみボタン(2本の斜めの矢印マーク)をクリックして、プロパティを閉じます。

1. 最後に、フィルタリングおよび修正後のデータをロードするための表を作成します。

    Data Cleans(Fix_AllCap_Days)を選択し、枠の右上にあるグリッド状の表のアイコンをクリックします。

    ![キャンバス上で Data Cleansに表アイコンをクリックする画面](adb403_3_13.png)

1. 以下のような表作成のダイアログが表示されます。表の名前を**MOVIE_SALES_2020Q2**と指定します。(末尾がQ2であることを確認して下さい。)Aliasの入力は特に変更せずに、Saveをクリックします。

    ![MOVIE_SALES_2020Q2の表作成のダイアログ](adb403_3_14.png)

1. MOVIE_SALES_2020Q2を選択し、画面右側のプロパティから拡張ボタンをクリックします。

    ![MOVIE_SALES_2020Q2を選択し、プロパティ画面を開く画面](adb403_3_15.png)

1. 展開されたプロパティには、様々なタブがあります。デフォルトではAttributesが開かれていますが、以下のようにColumn Mappingタブをクリックします。

    ![プロパティ画面を開いて、Column Mappingをクリックすした画面](adb403_3_16.png)

1. このData Flowをまだ実行しておらず、表は存在しないので、プレビューで見るものは何もありません

    Optionsを選択して、次のようなダイアログを表示させます。表がまだ存在しないので、Create target tableがTrueになっていることを確認してください。

    ![プロパティ画面を開いて、Optionsを押した画面](adb403_3_17.png)

1. 右上の折りたたみボタンをクリックします。

    ![プロパティ画面を閉じる画面](adb403_3_18.png)

    Data Flowのメイン画面に戻り、完成したData Flowを見ることができます。

1. Data Flowを実行します。
    1. Save(フロッピーディスクのアイコン)をクリックします。

    2. 実行ボタン(緑色の三角のアイコン)をクリックします。

    ![Data Flowを実行する画面](adb403_3_19.png)

    これまでのステップを完了すると、4月、5月、6月のデータのみを持つ表である、MOVIE_SALES_2020Q2が作成されます。日付は全て、最初の1文字のみ大文字に変更されています。

## 3-4. Jobの詳細を確認する

1. Data Flowを実行すると、以下のような画面が出ます。

    ![Data Flowを実行したあとの画面](adb403_3_20.png)

    ここでOKボタンを押しても構いません。また、表示されているリンクを踏むと、作成したJobの詳細画面に遷移し、データ変換のプロセスを見ることができます。

    ![Jobの詳細画面](adb403_3_21.png)

    この画面では、Jobが2つのステップで実装されていることが分かります。

    ・Create target table

    ・Insert new rows

1. Insert new rows-Load MOVIE_SALES_2020Q2のリンクを押すと、画面右側にこのステップの詳細を示すパネルが表示されます。上部にあるTarget Connectionタブを押すと、Data Flowの各ステップがどのように実装されたかが分かります。

    ・Filter Q2_2020は、WHERE句で実装されています。<br>
    **MONTH IN ('April','May','June')**

    ・Data Cleanse操作のFix_AllCap_Daysは、**INITCAP(TRIM(MOVIE_SALES_2020.DAY))**で実装されています。
    ![Jobの詳細画面からステップの詳細を示すパネルを表示した画面](adb403_3_22.png)

1. Closeをクリックして、画面左上のパンくずリストのJobsから、Data Transformsのメインページに戻ってください。

    ![ホーム画面に戻る](adb403_3_23.png)

<a id="anchor4"></a>

# おわりに
本チュートリアルではData Transformsを使って、サンプルデータをトリミングしたり、修正したりしました。Data Transformsを使えば、Autonomous Databaseにすでにあるデータを簡単に変換できることが体験できたかと思います。また、他のソースからデータをロードして変換することも可能です。データ変換のためにSQL文を書いたり、外部のデータ統合ツールを使用する必要はありません。
<br>

# 参考資料
+ LiveLabs [Oracle Data Integrator Web Edition - Intro to Data Transforms](https://apexapps.oracle.com/pls/apex/r/dbpm/livelabs/run-workshop?p210_wid=832&p210_wec=&session=113561614505947){:target="_blank"}

    このLivelabsのLab5のTask4, 5では、本チュートリアルでは行わなかったWork Flowやスケジュールの作成方法に触れていますので、ご興味のある方はお試しください。


+ [Oracle Blogs, Introducing Data Transforms: Built in Data Integration for Autonomous Database](https://blogs.oracle.com/datawarehousing/post/introducing-data-transforms-built-in-data-integration-for-autonomous-database){:target="_blank"}


以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)
