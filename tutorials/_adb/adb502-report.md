---
title: "502: 各種設定の確認、レポートの取得"
excerpt: ""

order: "3_502"
layout: single
#header:
#  teaser: "/adb/adb502-report/image_top.png"
#  overlay_image: "/adb/adb502-report/img_top.png"
#  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474316
---

Autonomous Databaseは初期化パラメータを初め、多くの設定は変更することはできません。

（そもそも自律型DBとして、それらを気にする必要はない、というコンセプト）

しかしながら、Oracle Databaseに詳しい方にとっては、これまでのOracle Databaseと何が違うのか？など、より詳細を知りたいと思われるかと思います。

この章ではそういった方々のために、**初期化パラメータの確認**や**AWRレポート等の取得方法**をご確認いただき、普段お使いのOracleデータベースと同様に扱えることを見ていただきます。

尚、Autonomous Databaseにおける制限事項については、次のマニュアルを参照ください。

* [経験豊富なOracle Databaseユーザー用のAutonomous Database (英語版)](https://docs.oracle.com/en/cloud/paas/autonomous-database/adbsa/experienced-database-users.html#GUID-58EE6599-6DB4-4F8E-816D-0422377857E5)

* [経験豊富なOracle Databaseユーザー用のAutonomous Database (日本語版)](https://docs.oracle.com/cd//E83857_01/paas/autonomous-database/serverless/adbsb/experienced-database-users.html#GUID-58EE6599-6DB4-4F8E-816D-0422377857E5)

※最新の情報については英語版をご確認ください。


本章ではアラートログやトレースログの取得方法も扱いますが、ADBを利用するに際して何か問題が生じた場合は、弊社サポートサービスに対してサービスリクエスト（SR）の発行を優先ください。

SRの発行方法については、本チュートリアルガイドの [506: サポートサービスへの問い合わせ](/ocitutorials/adb/adb506-sr) を参照ください。


**所要時間 :** 約30分

**前提条件 :**

* ADBインスタンスが構成済みであること
   <br>※ADBインタンスを作成方法については、本ハンズオンガイドの [101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning) を参照ください。

* ADBインスタンスに接続可能な仮想マシンを構成済みであること
   <br>※仮想マシンの作成方法については、本ハンズオンガイドの [204:マーケットプレイスからの仮想マシンのセットアップ方法](/ocitutorials/adb/adb204-setup-VM) を参照ください。


初期化パラメータ・各種レポート・ログの取得方法は、次の目次に示す３つの方法があります：

**目次：**

- [1. コマンドライン(SQL*Plus)で確認しよう](#anchor1)
    - [1-1. 初期化パラメータの確認](#anchor1-1)
    - [1-2. AWRレポートの確認](#anchor1-2)
    - [1-3. アラート・ログの確認](#anchor1-3)
    - [1-4. トレース・ログの確認](#anchor1-4)
- [2. SQL Developer DBAビューで確認しよう](#anchor2)
    - [2-1. 初期化パラメータの確認](#anchor2-1)
    - [2-2. AWRレポートの確認](#anchor2-2)
- [3. OCIコンソール上のパフォーマンスハブで確認しよう](#anchor3)

本章ではそれぞれの取得方法の手順をご紹介していきます。

<!-- ------------------ 1 ------------------ -->

<br>
<a id="anchor1"></a>

# 1. コマンドライン(SQL*Plus)で確認しよう

では早速、コマンドラインで確認する方法をご紹介します。
<br>コマンドラインを使った方法は、スクリプト化が可能であり便利な手法の一つです。
<br>まずはSQL*Plusに接続しましょう。詳細な手順は[こちら](/ocitutorials/adb/adb204-setup-VM/#anchor2)を参照ください。

1. Tera Termを起動し、仮想マシンにログインします。

2. oracleユーザに切り替えます。

    ```sh
    sudo su - oracle
    ```

3. SQL*Plusでログインします。

    ```sh
    export TNS_ADMIN=/home/oracle/labs/wallets_atp01
    sqlplus admin/Welcome12345#@atp01_low
    ```

    次のような画面が表示されていればOKです。

    ![img1_3.png](img1_3.png)

<br>
<a id="anchor1-1"></a>

# 1-1. 初期化パラメータの確認

初期化パラメータは、データベースの基本操作に影響を与える構成パラメータです。
<br>Autonomous Databasesは、プロビジョニングするコンピュートおよびストレージ容量に基づいてデータベース初期化パラメータを構成します。
<br>それでは初期化パラメータを確認していきましょう。

SQL*Plusで次のSQLを実行します。

```sql
SELECT name, value FROM v$parameter;
```

次のようにパラメータ名と値が一覧されます。
<br>初めにcolum文で列幅を設定しておくと綺麗に表示されます。

![img1_1_1.png](img1_1_1.png)


<br>
<a id="anchor1-2"></a>

# 1-2. AWRレポートの確認

次に、AWRレポートの取得方法をご紹介します。
<br>AWRとは，データベースのパフォーマンス診断のための統計情報レポジトリです。AWRでは、AWRスナップショットと呼ばれるOracleインスタンスが起動されてからの累積実行統計値を特定時刻で表にINSERTしたものを取得します。
<br>AWRレポートは指定した2点のスナップショット間の実行統計を、HTMLもしくはテキスト形式のファイルに出力したものです。

![awr.jfif](awr.jfif)

では、SQL*PlusでAWRレポートを取得してみましょう。

1. AWRレポートを取得するのに必要な**DBID**、 **instance_number**、**Snapshot ID**を確認するため、以下を実行します。

    ```sql
    SET LINES 1000
    SET PAGES 5000
    COL BEGIN_INTERVAL_TIME FOR A30
    COL END_INTERVAL_TIME FOR A30

    SELECT
        A.DBID,
        I.INSTANCE_NUMBER SID,
        A.SNAP_ID,
        A.BEGIN_INTERVAL_TIME,
        A.END_INTERVAL_TIME
    FROM
        AWR_PDB_SNAPSHOT A,
        GV$INSTANCE      I
    WHERE
            A.INSTANCE_NUMBER = I.INSTANCE_NUMBER
        AND TO_CHAR(END_INTERVAL_TIME, 'yyyy/mm/dd') = TO_CHAR(SYSDATE, 'yyyy/mm/dd')
    ORDER BY
        SNAP_ID;
    ```

    上記のSQLを実行すると、次のような出力結果が得られます。

    ![img1_2_1.png](img1_2_1.png)
    
    AWRレポートの取得には、**DBID**、**SID**、およびスタート地点とゴール地点2点の**SNAP_ID**の入力を求められます。
    <br>得られた出力結果の任意の行から、これらの値を選んでおきましょう。

2. 上記の出力結果を利用してAWRを取得します。
<br>以下では**SAMPLE_AWR.HTML**というファイルにAWRレポートを出力しています。

    ```sql
    SET LINES 1000
    SET PAGES 5000
    SET LONG 1000000
    SET LONGCHUNKSIZE 1000000

    SPOOL SAMPLE_AWR.HTML

    SELECT
        OUTPUT
    FROM
        TABLE ( DBMS_WORKLOAD_REPOSITORY.AWR_REPORT_HTML(&DBID, &SID, &SNAP_ID_START, &SNAP_ID_FINISH) );

    SPOOL OFF
    ```

    次のように、**DBID**、**SID**、2点の**SNAP_ID**を聞かれたら、1.の出力結果を参考に入力します。

    ![img1_2_2.png](img1_2_2.png)

    homeに**SAMPLE_AWR.HTML**というHTMLファイルが生成されていることをご確認ください。



## 補足

スナップショットに関する情報は**DBA_HIST_SNAPSHOT**ビューで参照できます。
<br>スナップショット間隔の変更方法およびスナップショットの手動取得方法は次の通りです。

1. **スナップショット間隔の変更方法**
    <br>10分に変更する例。（デフォルトは60分）

    ```sql
    exec dbms_workload_repository.modify_snapshot_settings (interval=>10);
    ```
    次のコマンドで変更を確認できます。

    ```sql
    select dbid, snap_interval from DBA_HIST_WR_CONTROL;
    ```

    ![img1_0_1.png](img1_0_1.png)


2. **スナップショットの手動取得方法**

    ```sql
    exec dbms_workload_repository.create_snapshot();
    ```

    次のコマンドで変更を確認できます。

    ```sql
    select dbid, end_interval_time from dba_hist_snapshot where dbid=[任意のDBID];
    ```
    現在取得した最新のスナップショットを確認する場合はこちらのコマンドをご利用ください。

    ```sql
    select dbid, max(end_interval_time) from dba_hist_snapshot where dbid=[任意のDBID] group by dbid;
    ```

    次の出力結果のように、現在時刻のスナップショットが取得されていることが確認できます。

    ![img1_0_2.png](img1_0_2.png)

<br>
<a id="anchor1-3"></a>

# 1-3. アラート・ログの確認

DB上で発生したエラーや障害の情報は、アラートファイルとトレースファイルに出力されます。
<br>アラートファイルには発生した事象の概要が、トレースファイルには詳細が出力されます。
<br>通常、アラートログ、トレースログはDBが稼働するOSのファイルシステム上にありますが、**ADBはOS領域にアクセスすることができない**ため、SQLを介して取得します。
<br>それでは、SQL*Plusでアラートログを取得してみましょう。


1. 以下のSQLを実行します。（以下では直近2週間分のアラートログを表示しています。）
    <br>アラートログは、**V$DIAG_ALERT_EXT**ビューで参照できます。

    ```sql
    -- 出力設定
    SET LINES 200
    SET PAGES 9999
    SET TRIMS ON
    COL ORIGINATING_TIMESTAMP FOR A40
    COL MESSAGE_TEXT FOR A120
    COL PROCESS_ID FOR A20

    -- アラートログの確認
    SELECT
        ORIGINATING_TIMESTAMP,
        PROCESS_ID,
        MESSAGE_TEXT
    FROM
        V$DIAG_ALERT_EXT
    WHERE
        ORIGINATING_TIMESTAMP > SYSDATE - 14;
    ```

    ORAエラーや管理操作が記録されているのが確認できます。
        
    ![img1_3_1.png](img1_3_1.png)

<br>
<a id="anchor1-4"></a>

# 1-4. トレース・ログの確認

次に、トレースログを確認します。
<br>トレースファイルは複数存在するため、ファイルの一覧を確認した上で、必要なファイルを表示するという流れです。
<br>トレースファイルの内容は**V$DIAG_TRACE_FILE**ビューおよび**V$DIAG_TRACE_FILE_CONTENTS**ビューから参照できます。

1. 必要なトレースファイル名を取得するため、以下のSQLを実行します。

    ```sql
    -- 出力設定
    COL TRACE_FILENAME FOR A30
    COL FILE_NAME FOR A30
    SET LINES 200
    SET PAGES 9999

    -- ファイル名を取得
    SELECT
        TRACE_FILENAME,
        CHANGE_TIME
    FROM
        V$DIAG_TRACE_FILE
    WHERE
        TRACE_FILENAME LIKE '%ora%'
    ORDER BY
        CHANGE_TIME;
    ```

    次のようなトレースファイルの一覧が確認できます。

    ![img1_4_1.png](img1_4_1.png)

2. 次に任意のトレースファイルを確認するため、以下のSQLを実行します。

    ```sql
    -- 出力設定
    COL PAYLOAD FOR A300
    SET LINES 200
    SET PAGES 9999

    -- トレースファイルを確認
    SELECT
        PAYLOAD
    FROM
        V$DIAG_TRACE_FILE_CONTENTS
    WHERE
        TRACE_FILENAME = '[任意のファイル名]'
    ORDER BY
        LINE_NUMBER;
    ```

    トレースファイルの内容が確認できればOKです。

<!-- ------------------ 2 ------------------ -->

<br>
<a id="anchor2"></a>

# 2. SQL Developer DBAビューで確認しよう

次はSQL developerを使ったGUIベースの確認方法をご紹介します。
<br>まずはDBAウィザードの起動方法を見ていきましょう

## DBAウィザードの起動方法

1. SQL DeveloperでADBインスタンスに接続します。
<br>前章にてSQLdeveloperに接続した場合「atp01_high_admin」という名前で接続情報が保存されていますので、そちらをご利用ください。

    > **補足**
    > 
    > **atp01_high_admin** の接続情報は次の通りです：
    > <table>
    >  <tr>
    >　 <td>Name</td>
    >  <td>atp01_high_admin<br>（"high"は接続サービスの一つ）</td>
    >  </tr>
    >  <tr>
    >  <td>ユーザー名</td>
    >  <td>admin</td>
    >  </tr>
    >  <tr>
    >  <td>パスワード</td>
    >  <td>Welcome12345#<br>（インスタンス作成時に設定したADMINユーザーのパスワード）</td>
    >  </tr>
    >  <tr>
    >  <td>パスワードの保存</td>
    >  <td>チェックあり<br>（実際の運用に際しては、セキュリティ要件を踏まえ設定ください）</td>
    >  </tr>
    >  <tr>
    >  <td>接続タイプ</td>
    >  <td>クラウド・ウォレット</td>
    >  </tr>
    >  <tr>
    >  <td>構成ファイル</td>
    >  <td>（事前にダウンロードしておいたウォレットファイルを選択）</td>
    >  </tr>
    >  </table>
    >
    > <br>※詳細は、本ハンズオンガイドの [104: クレデンシャル・ウォレットを利用して接続してみよう](/ocitutorials/adb/adb104-connect-using-wallet/){:target="_blank"} の、[3-3. SQL Developer を使った接続](/ocitutorials/adb/adb104-connect-using-wallet#anchor3-3) を参照ください。
    > 

2. 表示から**DBA**をクリックし、画面左下にDBAビューを表示します。

    ![img2_0_2.png](img2_0_2.png)

3. DBAビューに新しい接続を作成するために、左下の緑色のプラスマークをクリックします。

    DBAビューでは、データベース全体のすべての関連情報が表示され、DBA権限を持つユーザのみが使用できます。
    <br>データベース管理者（DBA）権限を持つユーザーはDBAに関連した特定の情報の表示・編集または一定のDBA操作を実行することができます。

    ![img2_0_3.png](img2_0_3.png)

4. 既存の接続から **atp01_high_admin** を選択し、OKをクリックします。

    ![img2_0_4.png](img2_0_4.png)

    > **補足**
    >
    > ここでは便宜上、接続サービスにHIGHを利用していますが、DBAビューからの接続は管理用途であるため、本来はLOWが推奨です。
    >

5. 接続が作成されると、画面左下のDBAビューに新たに**atp01_high_admin**が表示されます。
<br>プラス(+)をクリックし、詳細情報を表示してください。

    ![img2_0_5.png](img2_0_5.png)

> **注意**
>
>以降で記載する各種レポートが上手く表示されないといった場合は、SQL Developerのバージョンを最新にアップグレードしてください。
>

<br>
<a id="anchor2-1"></a>

# 2-1. 初期化パラメータの確認

1. **データベース構成**から**初期化パラメータ**を選択します。

    ![img2_1_1.png](img2_1_1.png)

    ADBに設定されている初期化パラメータが一覧で確認できます。
    <br>基本的にデフォルトのままでお使いいただくことになりますが、一部**NLS_XX**といったパラメータは変更可能です。

    詳しくは本ページの冒頭に記載の各制限事項へのリンクを参照ください。

    尚、SQL*developer上で直接SQLを実行しても上記は確認可能です。

    ```sql
    SELECT name, value FROM v$parameter;
    ```

    ![img2_1_2.png](img2_1_2.png)

2. その他、DBAビューでは様々な情報を確認可能です。適宜ご参照ください。

    > **補足**
    > 
    > SQL DeveloperでのDBA機能の使用方法についての詳細情報は [こちら](https://docs.oracle.com/cd/E38764_01/appdev.32/b70214/intro.htm#CEGDIAEC)
    >

<br>
<a id="anchor2-2"></a>

# 2-2. AWRレポートの確認

1. SQL Developer DBAビューよりAWRレポートを取得しましょう

    1-1. **パフォーマンス**から**AWR**を選択します。
    <br>Diagnostic Packのライセンス保有に関する確認がありますので、**はい**をクリックします。
    <br>Diagnostic Packを含め、ADBではOracle Database の多くのオプション機能がサブスクリプションに含まれており、従来から多くのお客様でご利用いただいている有償機能が追加費用なく使うことができます。

    ![img2_2_1_1.png](img2_2_1_1.png)

    > **補足**
    >
    > ADBではRAC、Partition、Database In Memory、Advanced Compression、Advanced Security、diagnostics pack、等のオプション機能がデフォルトでサブスクリプションに含まれております。
    > <br>利用できないオプション機能については本ページの冒頭に記載の各制限事項へのリンクを参照ください。
    >

    この機能を使用するには、**Oracle Diagnostic Pack** がライセンスされている必要があります。

    1-2. **AWR Report Viewer**を選択します。
    <br>**参照**から**スナップショット**を選択し、緑色の取得ボタンをクリックください。（取得には多少時間がかかります。）

    > **補足**
    >
    > ADBではデフォルトで1時間に1回、スナップショットが作成されますが、データベースを作成した直後の場合、スナップショットが存在しない場合があります。しばらく時間を空けて実施ください。
    >

    ![img2_2_1_2.png](img2_2_1_2.png)

    1-3. AWRレポートが表示されますので、保存ボタンをクリックしてAWRレポートを保存してください。

    ![img2_2_1_3.png](img2_2_1_3.png)

    > **補足**
    >
    > SQL Developer DBAビューでは、AWRのスナップショットを取得することも可能です。
    >

<!-- ------------------ 3 ------------------ -->

<br>
<a id="anchor3"></a>

# 3. OCIコンソール上のパフォーマンスハブで確認しよう

OCIコンソール上のパフォーマンスハブから、AWRレポートを取得することも可能です。
取得方法については[こちら](/ocitutorials/adb/adb203-bulk-query/#anchor3-2)を参照ください。
<br>また、パフォーマンスハブのマニュアルは[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Database/Tasks/perfhub.htm)を参照ください。


<br>

以上で、この章の作業は終了です。