---
title: "104: クレデンシャル・ウォレットを利用して接続してみよう"
excerpt: "クレデンシャル・ウォレットを使ってADBに接続してみましょう。"

order: "3_104"
layout: single
header:
  teaser: "/adb/adb104-connect-using-wallet/img1_3.png"
  overlay_image: "/adb/adb104-connect-using-wallet/img1_3.png"
  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474310
---

<a id="anchor0"></a>

# はじめに

Autonomous Database にはさまざまなツールが同梱されており、簡単にご利用いただけますが、
一方で、これまでお使いのアプリケーションからの接続するときはどのように接続するのでしょうか？

Autonomous Databaseには暗号化およびSSL相互認証を利用した接続が前提としており、そのため接続する際はクレデンシャル・ウォレット（Credential.zipファイル）を利用する必要があります。

本章ではこのクレデンシャル・ウォレットを使用した接続方法について確認していきます。
尚、クレデンシャル・ウォレットの扱いに慣れてしまえば、Autonomous だからと言って特別なことはありません。

<br>

**前提条件**
+ ADBインスタンスが構成済みであること
    <br>※ADBインタンスを作成方法については、[101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning){:target="_blank"} を参照ください。  
+ SQL Developerを使用した接続を行いたい場合には、当該クライアントツールがインストール済みであること。インストールは[こちら](https://www.oracle.com/jp/tools/downloads/sqldev-downloads.html){:target="_blank"}から<br>

<br>

**目次**

- [1. クレデンシャル・ウォレットのダウンロード](#anchor1)
- [2. 設定ファイルの編集](#anchor2)
- [3. ADBに接続](#anchor3)
    - [3-1. SQL*Plus を使った接続](#anchor3-1)
    - [3-2. SQLcl を使った接続](#anchor3-2)
    - [3-3. SQL Developer を使った接続](#anchor3-3)
    - [3-4. Database Actions を使った接続](#anchor3-4)

<br>
**所要時間 :** 約20分

<a id="anchor1"></a>
<br>

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


    >
    >**Note**
    >
    >次のようにURLを作成してクラウド・シェルを直接開くという方法もあります。この場合、\<region\>と\<tenancy\>には実際の値を入れる必要があります。
    >
    >```sh
    >https://console.us-<region>-1.oraclecloud.com/a/<tenancy>?cloudshell=true
    >```
    

2. ADB WalletをCloud Shell上にアップロードします。
Cloud Shellの左上のメニューをクリックし、「アップロード」をクリックします。
[1. クレデンシャル・ウォレットのダウンロード](#1-クレデンシャル・ウォレットのダウンロード) でダウンロードしたファイルを"Drag & Drop"します。
<br>Cloud Shellの画面に、ファイルを直接"Drag & Drop"してアップロードすることも可能です。

   ![img3_5_2_1.png](img3_5_2_1.png)
   
    lsコマンドで、ファイルが正しくアップロードされていることを確認します。

    ```sh
    ls
    ```
    「Wallet_atp01.zip」が存在していればOKです。

3. 格納用のディレクトリを作成し、ウォレットファイルを$HOME/network/admin 配下に移動します。

    格納用のディレクトリを作成します。
    ```sh
    mkdir -p ~/network/admin
    ```
    ウォレットファイル Wallet_atp01.zip を移動します。
    ```sh
    mv Wallet_atp01.zip ~/network/admin
    ```

4. 作成したディレクトリに移動し、圧縮されたウォレットファイルを展開します。

    作成したディレクトリに移動します。
    ```sh
    cd ~/network/admin
    ```
    ```sh
    unzip Wallet_atp01.zip
    ```

    lsコマンドでadminディレクトリ内のファイルを一覧し、次のようなファイルが揃っていればOKです。

    ![img3_5_2_4.png](img3_5_2_4.png)

5. TNS_ADMIN 環境変数にウォレットの保存先を設定します。

    ```sh
    export TNS_ADMIN=~/network/admin
    ```

    >**Note**
    >
    >アプリ毎に接続するインスタンスを切り替えたい場合は、インスタンス毎に　wallets_atp01　といったようにディレクトリを定義し、アプリ毎に環境変数TNS_ADMINのパスを切り替えると簡単です。

5. sqlnet.ora の下記の行を編集し、ウォレットの保存先を置き換えます。前の手順で、保存先をTNS_ADMIN環境変数に格納しているため、こちらを使います。

   編集前：

    ```sh
    WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="?/network/admin")))
    ```

    編集後：

    ```sh
    WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY=$TNS_ADMIN)))
    ```

    編集方法の一例として、viを使用した操作方法は次の通りです。

    5-1. sqlnet.ora をviで開く。

    ```sh
    vi sqlnet.ora
    ```
    5-2. 次の操作方法を参考に、WALLET_LOCATION の値を編集します。


      >**【参考】 viの操作方法**
      >
      ><table>
      ><tr>
      ><th>キー入力</th>
      ><th>動作</th>
      ></tr>
      ><tr>
      ><td>上下左右キー</td>
      ><td>カーソルの場所を移動する</td>
      ></tr>
      ><tr>
      ><td>i</td>
      ><td>カーソルの場所から編集する（InsertModeに入る）</td>
      ></tr>
      ><tr>
      ><td>ESCキー</td>
      ><td>InsertModeを抜ける</td>
      ></tr>
      ><tr>
      ><td>x</td>
      ><td>カーソルの場所を一文字消す</td>
      ></tr>
      ><tr>
      ><td>:wq</td>
      ><td>ファイルを保存して閉じる</td>
      ></tr>
      ><tr>
      ><td>:q</td>
      ><td>ファイルを閉じる（それまでの編集は破棄される）</td>
      ></tr>
      ><tr>
      ><td>:q!</td>
      ><td>強制的に終了する</td>
      ></tr>
      ></table>
<br>

6. 環境変数"ORACLE_HOME"を設定します。

    ```sh
    export ORACLE_HOME=~
    ```

    echoコマンドで中身を確認し、/home/[username] が出力されればOKです。

    ```sh
    echo $ORACLE_HOME
    ```
7. tnsnames.oraから、接続用のサービス情報を確認します。
    次にように４つの接続サービスがあることが分かります。

    ![img3_5_8.png](img3_5_8.png)

    <br>

    >**Note**  
    Cloud Shellから接続する場合、SQL*Plus ([3-1](#anchor3-1)) およびSQLcl ([3-2](#anchor3-1)) を使用して接続することができます。

<br>

<a id="anchor3"></a>

# 3. ADBに接続

<a id="anchor3-1"></a>

## 3-1. SQL*Plus を使った接続

Cloud Shellには、SQL Plusのクライアントが実装されているため、OCI上のADBに簡単に接続することができます。

1. 次のコマンドをCloud Shellのターミナルに入力し、ADBにSQL*Plusを起動します。

    ```sh
    sqlplus [username]/[password]@[接続サービス名]
    ```

    本ハンズオンガイドを参考にADBインスタンスをお作りいただいた方は、次のようなコマンドになります。

    ```sh
    sqlplus admin/Welcome12345#@atp01_low
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

    ※ 接続サービスに関する詳細は [ADB-S技術詳細資料](https://speakerdeck.com/oracle4engineer/autonomous-database-cloud-ji-shu-xiang-xi) を参照ください。
    
    <br>

    <a id="anchorerr"></a>


    >**補足**
    >
    >SQL*Plusを起動した際に以下のエラーが出てしまった場合は、sqlplusの共有ライブラリを参照できるようにパスを設定してください。<br>
    ><code>sqlplus: error while loading shared libraries: libsqlplus.so: cannot open shared object file: No such file or directory</code>
    >
    ><br>libsqlplus.soファイルが配置されているパスを環境変数LD_LIBRARY_PATHに格納します。
    >次のようにして、locateコマンドで得られたパスを環境変数LD_LIBRARY_PATHに格納します。
    >
    >locateコマンドで、libsqlplus.soファイルが配置されている場所を確認します。
    >```sh
    >locate libsqlplus.so
    >```
    >
    >exportコマンドで、得られたパスを環境変数LD_LIBRARY_PATHに格納します。
    >例えば、<code>locate libsqlplus.so</code> の出力結果が <code>/usr/lib/oracle/21/client64/lib/libsqlplus.so</code> だった場合は次のようになります。
    >
    >```sh
    >export LD_LIBRARY_PATH=/usr/lib/oracle/21/client64/lib
    >```
    >正しく格納できているかをechoコマンドで確認します。指定した通りのパスが表示されればOKです。
    >```sh
    >echo $LD_LIBRARY_PATH
    >```
    >


<br>

<a id="anchor3-2"></a>

## 3-2. SQLcl を使った接続

SQLclは、無料のコマンドラインツールです。（SQLclについては[こちら](https://www.oracle.com/jp/database/technologies/appdev/sqlcl.html)）<br>
SQL＊Plusに似ていますがSQL*Plusよりも多くの機能が備わっており、Autonomous Databaseにも簡単に接続できるようになっています。

1. SQLclを起動します。次のコマンドをCloud Shellのターミナルに入力してみましょう。

    ```sh
    sql /nolog
    ```

2. クレデンシャル・ウォレットを指定します。

    ```sql
    set cloudconfig /home/oracle/labs/wallets/Wallet_atp01.zip
    ```

3. インスタンスに接続します。

    ```sql
    connect admin/Welcome12345#@atp01_low
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

        ```sql
        SELECT USERNAME FROM USER_USERS;
        ```
    3.  スクリプトの実行 ボタンをクリックし実行します（左隣の 文の実行 ボタンで実行しても構いません）

    4. エラーなく実行結果が返ってくれば確認完了です

        ![img3_3_3.png](img3_3_3.png)

<br>

<a id="anchor3-4"></a>

## 3-4. Database Actions を使った接続

Database Actionsを使った接続については、[こちら](/ocitutorials/adb/adb101-provisioning/)をご確認ください。

<br>

<br>
以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)


