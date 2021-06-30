---
title: "ウォレットを利用してADBに接続してみよう"
excerpt: "クレデンシャル・ウォレットを使ってADBに接続してみましょう。"

order: "104"
layout: single
header:
  teaser: "/database/adb104-connect-using-wallet/img1_3.png"
  overlay_image: "/database/adb104-connect-using-wallet/img1_3.png"
  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474310
---

本章では、Autonomous Databaseへの接続方法のうち、クレデンシャル・ウォレットを使用した接続方法を確認しましょう

クレデンシャル・ウォレット（Credential.zipファイル）の扱いに慣れてしまえば、Autonomous だからと言って特別なことはありません。


**所要時間 :** 約20分

**前提条件 :**

1. Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、ユーザーアカウントがあること
2. 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切な権限がユーザーに付与されていること
3. ADBインスタンスが構成済みであること
4. SQL Developerを使用した接続を行いたい場合には、クライアントツールがインストール済みであること。
インストールは[こちら](https://www.oracle.com/jp/tools/downloads/sqldev-downloads.html)から<br>


**注意 :** チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります

**目次：**

- [1. クレデンシャル・ウォレットのダウンロード](#anchor1)
- [2. 設定ファイルの編集](#anchor2)
- [3. ADBに接続](#anchor3)
    - [3-1. SQL*Plus を使った接続](#anchor3-1)
    - [3-2. SQLcl を使った接続](#anchor3-2)
    - [3-3. SQL Developer を使った接続](#anchor3-3)
    - [3-4. Database Actions を使った接続](#anchor3-4)

<br>

<a id="anchor1"></a>

# 1. クレデンシャル・ウォレットのダウンロード
ウォレットを利用したADBインスタンスへの接続には、対象インスタンスへの接続情報が格納された **クレデンシャル・ウォレット** を利用する必要があります。
（より高いセキュリティを担保するために、ADBインスタンスはcredential.ssoファイルを利用した接続のみを受け入れます。）
まず、ADBへの接続情報が格納されるCredential.zipファイルをお手元のPCにダウンロードしましょう。

1. OCIのコンソールにアクセスし、左上のメニューから **Oracle Database** を選択します。Oracle Databaseのメニュー一覧が表示されたら、 **Autonomous Database** の **Autonomous Transaction Processing** をクリックします。
    ![img1_1.png](img1_1.png)

2. 作成したATPインスタンスをクリックし、ATPインスタンスの詳細画面を表示します。

    詳細画面の **DB接続** をクリックします.

    ![img1_2.png](img1_2.png)
3. ダウンロードウィザードが起動するので、 **ウォレットのダウンロード** をクリックします。

    <img src="img1_3.png" width="80%">

    【ウォレットの選択について】

    「ウォレット・タイプ」で、２種類のタイプから１つ選択することができます。今回はデフォルトの「インスタンス・ウォレット」を選択します。
    * インスタンス・ウォレット          
      * 特定のインスタンスの資格証明のみが記載
      * アプリケーションからの接続はこちらの利用を推奨
    * リージョナル・ウォレット
      * 選択されたリージョン内の全てのインスタンスの資格証明が記載          
      * 他のインスタンスへの接続時も利用できるため、主に管理目的での利用に限定ください

4. ウォレットファイルに付与するパスワードを入力し、ダウンロードをクリックして、お手元のPCの任意の場所に保存してください。
    （本ハンズオンガイドでは便宜上、パスワードは **Welcome12345#** に統一ください）

    <img src="img1_4.png" width="80%">

<br>

<a id="anchor2"></a>

# 2. 設定ファイルの編集

作成したADBインスタンスに接続するためには、接続に使用するクライアントの設定ファイルの編集を行う必要があります。この設定を **`OCI Cloud Shell`** で行う手順をご紹介します。

Cloud Shellは、Oracle CloudコンソールからアクセスできるWebブラウザ・ベースのターミナルで、Oracle Cloud Infrastructureの全ユーザーが利用可能です。
ローカルの端末にOCI-CLIをインストールせずとも、コンソール上でコマンドベースの操作が可能になります。

1. Cloud Shellを開いてみましょう。Oracle Cloud Infrastructureのテナンシにサインインし、コンソールのヘッダーにあるコマンド・プロンプト・アイコンをクリックします。

    ![img3_5_1.png](img3_5_1.png)

    Cloud Shell環境が作成され、コマンドを実行したりAutonomous Databaseに接続したりすることが可能になります。
    Cloud Shellの起動には、約1分ほどの時間がかかります。

    ![img3_5_2.png](img3_5_2.png)

    また、以下のようにURLを作成してクラウド・シェルを直接開くという方法もあります。この場合、\<region\>と\<tenancy\>には実際の値を入れる必要があります。

    ```sh
    https://console.us-<region>-1.oraclecloud.com/a/<tenancy>?cloudshell=true
    ```

2. ADB WalletをCloud Shell上にアップロードします。
Cloud Shellの左上のメニューをクリックし、「アップロード」をクリックします。
[1. クレデンシャル・ウォレットのダウンロード](#1-クレデンシャル・ウォレットのダウンロード) でダウンロードしたファイルを"Drag & Drop"します。

   ![img3_5_2_1.png](img3_5_2_1.png)
   
    Cloud Shellの画面に、直接ファイルを"Drag & Drop"してアップロードすることも可能です。<br>
    lsコマンドで、ファイルが正しくアップロードされていることを確認します。

    ```sh
    $ ls
    Wallet_atp01.zip
    ```

3. 格納用のディレクトリを作成し、ウォレットファイルを移動します。$HOME/network/admin 配下に配置します。

    ```sh
    $ pwd
    /home/[username]
    $ mkdir -p network/admin
    $ mv Wallet_atp01.zip network/admin
    ```

4. 作成したディレクトリに移動し、圧縮されたウォレットファイルを展開します。

    ```sh
    $ cd network/admin
    $ unzip Wallet_atp01.zip
    Archive:  Wallet_atp01.zip
      inflating: README                  
      inflating: cwallet.sso             
      inflating: tnsnames.ora            
      inflating: truststore.jks          
      inflating: ojdbc.properties        
      inflating: sqlnet.ora              
      inflating: ewallet.p12             
      inflating: keystore.jks            
    ```

5. sqlnet.ora の下記の行を編集し、ウォレットの保存先を置き換えます。

   編集前：

    ```sh
    WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="?/network/admin")))
    ```

    編集後：

    ```sh
    WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY=$/home/[username]/network/admin)))

    ※ [username]には、Cloud Shellのログインユーザ名を入れます。
    ```

    操作方法は次の通りです。

    ```sh
    $ vi sqlnet.ora
    << viにて編集 >>
    $ cat sqlnet.ora
    WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY=$TNS_ADMIN)))
    SSL_SERVER_DN_MATCH=yes
    ```

    >**【参考】viの使い方**
        >
        >
        >|  キー入力  |  動作  |
        >| ------ | ------ |
        >|  上下左右キー  |  カーソルの場所を移動する  |
        >|  i  |  カーソルの場所から編集する（InsertModeに入る）  |
        >|  ESCキー  |  InsertModeを抜ける  |
        >|  x  |  カーソルの場所を一文字消す  |
        >|  :wq  |  ファイルを保存して閉じる  |
        >|  :q  |  ファイルを閉じる（それまでの編集は破棄される）  |
        >|  :q!  |  強制的に終了する  |
<br>

6. 環境変数"ORACLE_HOME"を設定します。

    ```sh
    $ export ORACLE_HOME=/home/[username]
    $ echo $ORACLE_HOME
    /home/[username]
    ```
7. tnsnames.oraから、接続用のサービス情報を確認します。

    ![img3_5_8.png](img3_5_8.png)

    <br>

    >**Note**
        >
        >Cloud Shellから接続する場合、SQL*Plus ([3-1](#anchor3-1)) およびSQLcl ([3-2](#anchor3-1)) を使用して接続することができます。

<br>

<a id="anchor3"></a>

# 3. ADBに接続

<a id="anchor3-1"></a>

## 3-1. SQL*Plus を使った接続

Cloud Shellには、SQL Plusのクライアントが実装されているため、OCI上のADBに簡単に接続することができます。

1. 次のコマンドをCloud Shellのターミナルに入力し、ADBにSQL*Plusを起動します。

    ```sh
    $ sqlplus [username]/[password]@[接続サービス名]
    ```

    本ハンズオンガイドを参考にADBインスタンスをお作りいただいた方は、次のようなコマンドになります。

    ```sh
    $ sqlplus admin/Welcome12345#@atp01_low
    ```

    <table>
     <tr>
      <td>username</td>
      <td>admin</td>
     </tr>
     <tr>
      <td>password</td>
      <td>Welcome12345#（インスタンス作成時に指定した値）</td>
     </tr>
     <tr>
      <td>conn_string</td>
      <td>atp01_low （接続サービス名 ）</td>
     </tr>
    </table>

    ※ 接続サービスに関する詳細は [技術詳細](https://speakerdeck.com/oracle4engineer/autonomous-database-cloud-ji-shu-xiang-xi) 、もしくはを参照ください。
    
    <br>

    >**補足**
        >
        >SQL*Plusを起動した際に、次のエラーが出てしまった方向けのトラブルショートをご紹介します。
        >
        >```sh
        >sqlplus: error while loading shared libraries: libsqlplus.so: cannot open shared object file: No such file or directory
        >```
        >
        >sqlplusの共有ライブラリを参照できるようにパスを設定します。<br>
        ><code>locate libsqlplus.so</code> で得られたパスを、環境変数LD_LIBRARY_PATHに格納します。
        >操作手順は次の通りです。
        >
        >```sh
        >$ locate libsqlplus.so
        >/usr/lib/oracle/21/client64/lib/libsqlplus.so
        >$ export LD_LIBRARY_PATH=/usr/lib/oracle/21/client64/lib
        >$ echo $LD_LIBRARY_PATH
        >/usr/lib/oracle/21/client64/lib
        >```
        >

<br>

<a id="anchor3-2"></a>

## 3-2. SQLcl を使った接続

SQLclは、無料のコマンドラインツールです。（SQLclについては[こちら](https://www.oracle.com/jp/database/technologies/appdev/sqlcl.html)）<br>
SQL＊Plusに似ていますがSQL*Plusよりも多くの機能が備わっており、Autonomous Databaseにも簡単に接続できるようになっています。

1. SQLclを起動します。次のコマンドをCloud Shellのターミナルに入力してみましょう。

    ```sh
    $ sql /nolog
    ```

2. ウォレットを指定します。

    ```sh
    SQL> set cloudconfig /home/oracle/labs/wallets/Wallet_atp01.zip
    ```

3. 接続します。

    ```sh
    SQL> connect admin/Welcome12345#@atp01_low
    ```
<br>

<a id="anchor3-3"></a>

## 3-3. SQL Developer を使った接続

手元のPCにインストールしたクライアントツールを利用してアクセスします。
SQL Developerを起動し、管理者アカウント(ADMIN)でADBへ接続します。

1. SQL Developerを起動後、画面左上の接続アイコンをクリックします。

    ![img3_3_1.png](img3_3_1.png)

2. 以下の記載例を参考に各項目を入力し、ADBインスタンスへの接続設定を行います。

    1. 各項目に接続情報を入力します。
        <table>
           <tr>
           <td>Name</td>
           <td>atp01_high_admin<br>（"high"は接続サービスの一つ）</td>
           </tr>
           <tr>
           <td>ユーザー名</td>
           <td>admin</td>
           </tr>
           <tr>
           <td>パスワード</td>
           <td>Welcome12345#<br>（インスタンス作成時に設定したADMINユーザーのパスワード）</td>
           </tr>
           <tr>
           <td>パスワードの保存</td>
           <td>チェックあり<br>（実際の運用に際しては、セキュリティ要件を踏まえ設定ください）</td>
           </tr>
           <tr>
           <td>接続タイプ</td>
           <td>クラウド・ウォレット</td>
           </tr>
           <tr>
           <td>構成ファイル</td>
           <td>（事前にダウンロードしておいたウォレットファイルを選択）</td>
           </tr>
        </table>
    <br>

    2. サービス：**`atp01_high`** を選択（接続サービスに相当。詳細は にて扱います）

    3. **`テスト`** をクリックし、正しく接続できるか確認します。（正しく接続出来れば、左下のステータスに **`成功`** と表示されます。）

    4. テストに成功したことを確認し、**`保存`**をクリックします。（左上の接続リストに表示され、次回以降の登録作業をスキップできます。）

    5. **`接続`**をクリックします。

        ![img3_3_2.png](img3_3_2.png)

3. ワークシートが起動しますので、サンプルクエリを実行してADBインスタンスに正しく接続できているか確認します。

    1. SQL Developerにてご自身で作成した接続を選択します。

    2. 以下のクエリをワークシートに貼り付けます。

        ```sh
        SQL> SELECT USERNAME FROM USER_USERS;
        ```
    3.  スクリプトの実行 ボタンをクリックし実行します（左隣の 文の実行 ボタンで実行しても構いません）

    4. エラーなく実行結果が返ってくれば確認完了です

        ![img3_3_3.png](img3_3_3.png)

<br>

<a id="anchor3-4"></a>

## 3-4. Database Actions を使った接続

Database Actionsを使った接続については、[こちら](/ocitutorials/database/adb101-provisioning/)をご確認ください。

<br><br>

以上で、この章の作業は終了です。

次章へお進みください。