---
title: "107: ADBの付属ツールで機械学習(予測モデルからデプロイまで)"
excerpt: "タイタニック号の乗客情報から生存予測モデルを作成し、アプリで予測結果のレポートまでADBの中で行います。"
order: "3_107"
layout: single
header:
  teaser: "/database/adb107-machine-learning/img72.png"
  overlay_image: "/database/adb107-machine-learning/img72.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---


<a id="anchor0"></a>

# はじめに

この章では、**Autonomous Databaseの複数の付属ツール**(Database Actions、OML AutoML UI、OML Notebook、Oracle Application Express(APEX))を活用し、**ワンストップの機械学習環境**を体感していただきます。今回は、機械学習の題材として、**タイタニック問題**を扱います。タイタニックの乗客情報から**乗客の生存予測を行うモデル**を作成します。モデル作成後、そのモデルに実際に予測をさせて、更にその予測をアプリケーションでのレポートまで行います。**データベースの中で機械学習のプロセスが完結**しているOracleの機械学習へのアプローチを体験していただけると思います。

<br>

**前提条件 :**  
+ ADBインスタンスが構成済みであること
    <br>※ADBインタンスを作成方法については、[101:ADBインスタンスを作成してみよう](/ocitutorials/database/adb101-provisioning){:target="_blank"} を参照ください。  
+ 以下にリンクされているZipファイルをダウンロードし、解凍していること
	+ [OMLチュートリアルで資料するファイル](/ocitutorials/database/adb107-machine-learning/ADB_OML_handson.zip)

<br>

**目次**

- [1. OMLユーザ新規作成](#anchor1)
- [2. Database Actionsでデータロード](#anchor2)
- [3. OML AutoML UIで生存予測モデル作成](#anchor3)
- [4. OML Notebookで予測をかける](#anchor4)
- [5. APEXで予測結果をレポート](#anchor5)
- [6. まとめ](#anchor6)
- [7. 参考資料](#anchor7)

<br>
**所要時間 :** 約60分

<a id="anchor1"></a>
<br>

# 1. OMLユーザ新規作成

まずOMLを利用する権限を持つユーザを**Database Actions**で新規作成していきます。

1. [ADBインスタンスを作成しよう](https://oracle-japan.github.io/ocitutorials/database/adb101-provisioning/)で学習した**Database Actionsを利用したインスタンスへの接続** を参照し、Database Actionsを起動し、Adminユーザーで接続してください。**ツール**タブから、**データベース・アクションを開く**をクリックしてください。

   ![画面ショット1-1](img0.png)


1. **管理 > データベース・ユーザー**をクリックしてください。

	![画面ショット1-1](img99.png)

1. **+ユーザの作成**をクリックしてください。

	![画面ショット1-1](img2.png)

1. OMLユーザの作成に必要な情報を入力して、**ユーザの作成**をクリックしてください。

	![画面ショット1-1](img3.png)

    - ユーザ名 = **OML**
	- パスワード = **Welcome12345#**
	- 表領域の割り当て制限 = **UNLIMITED**
    - **OML**をチェック
    - **Webアクセス**をチェック

    - **ユーザの作成**をクリック

1. OMLユーザが新規作成されました。

	![画面ショット1-1](img4.png)


1. 画面右上の**ユーザ名**をクリックし、ADMINユーザから**サインアウト**します。

	![画面ショット1-1](img5.png)

<a id="anchor2"></a>
<br>

# 2. Database Actionsでデータロード

1. OMLユーザで**サインイン**した後、**データ・ツール > データ・ロード**をクリックします。

	![画面ショット1-1](img10.png)

1. **データの処理 > データ・ロード**、**データの処理 > ローカル・ファイル**を選択し、**次**をクリックします。

	![画面ショット1-1](img11.png)

1.  **ファイルの選択**をクリックし、端末から**train.csv**と**test.csv**を選択します。

	![画面ショット1-1](img12.png)


1.  **緑色の実行ボタン**をクリックし、データ・ロードの実行します。

	![画面ショット1-1](img13.png)

	![画面ショット1-1](img14.png)	


1.  **完了**をクリックします。

	![画面ショット1-1](img15.png)

<a id="anchor3"></a>
<br>

# 3. OML AutoML UIで生存予測モデル作成

1.  Autonomous Databaseの詳細画面へ遷移し、**サービス・コンソール**をクリックしてください。

	![画面ショット1-1](img20.png)

1.  サービス・コンソールの**開発 >** **Oracle Machine Learningユーザー・インターフェイス**をクリックし、OMLユーザで**サインイン**して下さい。

	![画面ショット1-1](img21.png)

1.  Oracle Machine Learningにサインイン後、画面左上の**ハンバーガメニュ**をクリックしてください。

	![画面ショット1-1](img22.png)

1.  ハンバーガメニュから**AutoML**をクリックしてください。

	![画面ショット1-1](img23.png)

1.  **+作成ボタン**をクリックしてください。

	![画面ショット1-1](img24.png)

1.  名前に**Titanic Prediciton**と入力後、**データ・ソース**をクリックして下さい。

	![画面ショット1-1](img25.png)


1.  ポップアップ画面で、スキーマには**OML**、表には**TRAIN**を選択した状態で**OKを**クリックしてください。

	![画面ショット1-1](img26.png)

1.  予測で**Survived**を目的変数として選択し、予測タイプが**分類**になっていることを確認後、**開始 > より良い精度**をクリックして下さい。

	![画面ショット1-1](img27.png)

1.  予測モデルが自動で作成されるのを待ちましょう。画面右側のポップアップで**進捗**を確認できます。

	![画面ショット1-1](img28.png)

1.  予測モデルが5つ自動で作成されました。後で使えるように、**モデル名を1つコピーして任意の場所にペースト**しておきましょう。

	![画面ショット1-1](img29.png)

	(例)モデル名 : **SVMG_FBC6D30E68**

<a id="anchor4"></a>
<br>

# 4. OML Notebookで予測をかける

1.  画面左上の**ハンバーガメニュ**をクリックしてください。

	![画面ショット1-1](img40.png)


1.  ハンバーガメニュから**ノートブック**をクリックしてください。

	![画面ショット1-1](img41.png)


1.  ノートブックの画面で、**インポート**をクリックして下さい。**Titanic_OML_Notebook.json**を端末から選択してください。

	![画面ショット1-1](img42.png)

1.  ノートブックの画面で、インポートした**ノートブック名を**クリックして、ノートブックを開きます。

	![画面ショット1-1](img43.png)

1.  こちらが開いたノートブックの中身になります。下にスクロールして、**未知のデータであるTEST表に予測モデルを適応したVIEWを作成**という箇所に移動して下さい。

	![画面ショット1-1](img44.png)

	↓

	![画面ショット1-1](img45.png)

1.  下記のSQL文の<モデル名>に、**任意のペースト済みのAutoML UIで作成したモデル名をペースト**した後、**右上の再生ボタン**をクリックしスクリプトを実行して下さい。

	![画面ショット1-1](img46.png)

    ```
    CREATE OR REPLACE VIEW TITANIC_PREDICTION AS
      SELECT
       PASSENGERID,
       NAME,
       PREDICTION(<モデル名> USING *) PREDICTION,
       PREDICTION_PROBABILITY(<モデル名> USING *) PRED_PROBABILITY
      FROM
       TEST;
    ```

    (例)
    ```
    CREATE OR REPLACE VIEW TITANIC_PREDICTION AS
      SELECT
       PASSENGERID,
       NAME,
       PREDICTION(SVMG_FBC6D30E68 USING *) PREDICTION,
       PREDICTION_PROBABILITY(SVMG_FBC6D30E68 USING *) PRED_PROBABILITY
      FROM
       TEST;
    ```

1.  先ほど作成したVIEWを確認します。TITANIC_PREDICTIONビューの下のパラグラフ内の、**右上の再生ボタン**をクリックしスクリプトを実行して下さい。


	![画面ショット1-1](img47.png)

<a id="anchor5"></a>
<br>

# 5. APEXで予測結果をレポート

1.  Autonomous Databaseの詳細画面へ遷移し、**ツール > Oracle Application Express > APEXを開く**をクリックしてください。

	![画面ショット1-1](img50.png)

1.  まずはADMINユーザでログインします。**パスワード**を入力し、**Sign In to Administration**をクリックしてください。

	![画面ショット1-1](img51.png)

1.  OMLユーザのためにワークスペースを作成します。**Create Workspace**をクリックしてください。

	![画面ショット1-1](img52.png)

1.  Database Userには**OML**、Workspace Nameにも**OML**を入力し、**Create Workspace**をクリックしてください。

	![画面ショット1-1](img53.png)

1.  OMLユーザのためのワークスペースが作成されました。画面右上からADMINユーザを**サインアウト**してください。

	![画面ショット1-1](img54.png)

1.  OMLユーザとしてAPEXに**サインイン**します。Workspace Nameには**OML**、ユーザ名**OML**、**パスワード**を入力し、**Sign In**をクリックしてください。

	![画面ショット1-1](img55.png)

1.  OMLユーザでサインインできました。最初のサインイン後APEX用のパスワードの設定を求められます。**Set APEX Account Password**をクリックしてください。

	![画面ショット1-1](img56.png)

1.  Email Addressに**任意のメールアドレス**を入力します。

	![画面ショット1-1](img57.png)

1.  Passwordの箇所を**ブランク**にしたまま、**Apply Changes**をクリックするとOMLユーザのパスワードをそのままAPEXのパスワードにすることができます。

	![画面ショット1-1](img58.png)

1.  **App Builder**をクリックします。

	![画面ショット1-1](img59.png)

1.  **Import**をクリックします。

	![画面ショット1-1](img60.png)

1.  **Drag and Drop**をクリックし、端末から**Titanic_APEX_App.sql**を選択してください。

	![画面ショット1-1](img61.png)

1.  **Next**をクリックします。

	![画面ショット1-1](img62.png)

1.  **Next**をクリックします。

	![画面ショット1-1](img63.png)

1.  **Install Application**をクリックします。

	![画面ショット1-1](img64.png)

1.  アプリケーションがインストールされました。インストールしただけでは、アプリケーションに対する権限がOMLユーザにはないので、付与していきます。**Edit Application**をクリックしてください。

	![画面ショット1-1](img65.png)

1.  **Shared Components**をクリックします。

	![画面ショット1-1](img66.png)

1.  **Application Access Control**をクリックします。

	![画面ショット1-1](img67.png)

1.  **Add User Role Assingment**をクリックします。

	![画面ショット1-1](img68.png)

1.  User Nameには**OML**、Application Roleの**Administratorをチェック**し、**Create Assignment**をクリックしてください。

	![画面ショット1-1](img69.png)

1.  OMLユーザにAdministratorが付与されたのを確認し、画面右上の**再生ボタン**をクリックし、アプリケーションを実行します。

	![画面ショット1-1](img70.png)

1.  アプリケーションにOMLユーザで**サインイン**します。

	![画面ショット1-1](img71.png)

1.  アプリケーションのランディングページでは、OML Notebookで作成したView(TITANIC_PREDICTION)を表示しています。画面左上の**ハンバーガメニュ**をクリックしてください。

	![画面ショット1-1](img72.png)

1.  **Editable Titanic Dataset**をクリックしてください。

	![画面ショット1-1](img73.png)

1.  このページでは、タイタニックのデータセットの一つであるTEST表を表示しています。画面左上の**新規データの登録**をクリックし、TEST表に新規データをインサートしていきましょう。

	![画面ショット1-1](img74.png)

1.  任意の情報を入力後、**新規作成ボタン**をクリックしてください。

	![画面ショット1-1](img75.png)

1.  新規データがTEST表にインサートされました。

	![画面ショット1-1](img76.png)

1.  検索バーから**新規データを検索**することができます。

	![画面ショット1-1](img77.png)

1.  画面左上の**ハンバーガメニュ**から**Home**をクリックしてください。

	![画面ショット1-1](img78.png)

1.  ランディングページのViewでも**即座に新規データに対する予測**がかかっているはずです。検索バーから新規データの検索、**予測結果の確認**を行うことができます。

	![画面ショット1-1](img79.png)

<a id="anchor6"></a>
<br>

# 6. まとめ

いかがでしたでしょうか。Autonomous Databaseには様々なツールが無償で用意されています。機械学習では、データのロードから機械学習モデルを作成、アプリへのデプロイまでワンストップの機械学習環境がプロビジョン完了と同時に出来上がります。データ活用もAutonomous Databaseで効果的に迅速に進めることが可能です。

<a id="anchor7"></a>
<br>

# 7. 参考資料

別の題材で、追加のAutoML UIのチュートリアルは下記に用意がございます。

[OracleのAutoML UIで気軽に明日雨が降るか予測しよう](https://qiita.com/yuki_coffee/items/76481759537c38b032e2)


<br>
以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)


