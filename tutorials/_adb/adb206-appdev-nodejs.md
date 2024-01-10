---
title: "206: Node.jsによるADB上でのアプリ開発"
excerpt: "この章では開発言語としてNode.jsを想定し、Autonomous Databaseに対して接続する方法、およびデータベース操作を実行する方法を学びます。"

order: "3_206"
layout: single
#header:
#  teaser: "/adb/adb206-appdev-nodejs/image_top.png"
#  overlay_image: "/adb/adb206-appdev-nodejs/img_top.png"
#  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474308
---

Node.jsはサーバサイドでJavaScript言語を実行するオープンソースの実行環境です。

node-oracledbドライバを利用することで、Autonomous Databaseに簡単に接続できます。

尚、JavaScriptのコーディングやNode.js自体の使い方を説明するものではありません。

**所要時間 :** 約20分

**前提条件 :**

* ADBインスタンスが構成済みであること
   <br>※ADBインタンスを作成方法については、本ハンズオンガイドの [101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning) を参照ください。
* 開発用の仮想マシンが構成済みであり、仮想マシンからADBインスタンスへのアクセスが可能であること
* 仮想マシンのoracleユーザのホームディレクトリ配下にlabsフォルダをアップロード済みであること
    +  [labs.zip を手元のPCにダウンロード](/ocitutorials/adb/adb-data/labs.zip)
    <br>アップロード方法については [こちら](/ocitutorials/adb/adb204-setup-VM#anchor3) をご確認ください。
    + 仮想マシン上に直接ダウンロードする場合は、次のコマンドを実行します。
        ```sh
        wget https://oracle-japan.github.io/ocitutorials/adb/adb-data/labs.zip
        ```

<br>

**目次**

- [1. 事前準備](#anchor1)
- [2. Node.js環境の確認](#anchor2)
- [3. ADBに接続してみよう](#anchor3)
- [4. ADB上のデータを操作してみよう](#anchor4)


<br>

<a id="anchor1"></a>

# 1. 事前準備

**`ネットワークセキュリティの設定変更`**

本章ではお手元のPCからインターネットを介して、Node.jsのアプリにポート3030で接続します（3030は変更可能）。
<br>OCIではセキュリティ・リストと呼ばれる仮想ファイアウォールの役割を担うリソースがありますが、このセキュリティ・リストのデフォルトの設定では、こちらの接続は拒否されます。
<br>ポート3030からの接続を可能にするには、事前に外部インターネットからこの接続を受け入れるためのイングレス・ルール(インバウンド・ルール)の設定、およびNode.jsが配置される仮想マシンのOSのFirewallの設定を行う必要があります。

※ セキュリティ・リストに関する詳細な情報は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Network/Concepts/securitylists.htm)


## - イングレス・ルールの設定

1. メニューから **`ネットワーキング`**、**`仮想クラウド・ネットワーク`** を選択します。

    ![img1_1.png](img1_1.png)

2. 作成済みの仮想クラウド・ネットワーク（ **`vcn01`** ）を選択します。
    <br>（こちらの画面では、ADB_HOL_DEV_VCNとなっています）

    ![img1_2.png](img1_2.png)

    ※該当するVCNが表示されない場合は、適切なリージョンおよびコンパートメントが選択されていることをご確認ください。

3. 画面左下のリソースからセキュリティ・リストを選択し、**`Default Security List for [VCN名]`** をクリックします。

    ![img1_3.png](img1_3.png)

4. イングレス・ルールの追加をクリックします。

    ![img1_4.png](img1_4.png)

5. 入力ウィザードが立ち上がるので、以下の記載例を参考に各項目を入力し、**`イングレス・ルールの追加`** をクリックします。

    <table>
     <tr>
      <td>ソースCIDR</td>
      <td>0.0.0.0/0</td>
     </tr>
     <tr>
      <td>IPプロトコル</td>
      <td>TCP</td>
     </tr>
     <tr>
      <td>ソースポート範囲</td>
      <td>all</td>
     </tr>
     <tr>
      <td>宛先ポート範囲</td>
      <td>3030</td>
     </tr>
    </table>

    ![img1_5.png](img1_5.png)

    （パブリック・インターネット(0.0.0.0/0) からの 3030に対する接続を許可する）



## - Firewallの設定

1. 仮想マシンにopcユーザでログインします。ログイン方法は [204: マーケットプレイスからの仮想マシンのセットアップ方法 2. 仮想マシンへのアクセス](/ocitutorials/adb/adb204-setup-VM#anchor2) を参照ください。

    ![img1_firewall_1.png](img1_firewall_1.png)

2. 次のコマンドでrootユーザに切り替えます。

    ```sh
    sudo -s
    ```

    ![img1_firewall_2.png](img1_firewall_2.png)

    （oracleユーザーで既にログインしている場合は、exit してください。）

    ```sh
    exit
    ```

3. ポート番号3030を追加し、設定を反映します。
    <br>（successと表示されればOKです。）
    次の２つのコマンドを順に実行します。

    ```sh
    -- ポート番号3030を追加
    firewall-cmd --permanent --zone=public --add-port=3030/tcp
    -- 設定を反映
    firewall-cmd --reload
    ```

    ![img1_firewall_3.png](img1_firewall_3.png)

    ※上記の設定はあくまでも参考です。実際の利用に際してはセキュリティ要件を十分検討の上、設定ください。

<br>

<a id="anchor2"></a>

# 2. Node.js環境の確認

ここではお手元のPCのブラウザでNode.jsのアプリに接続できるかを確認します。

1. ユーザをrootからoracleに切り替えます。rootユーザとして次のコマンドを実行します。


    ```sh
    su - oracle
    ```

    ![img2_1.png](img2_1.png)


2. （必要に応じて）nodeとnpm(Node Package Manager)のバージョンを確認します。

    ```sh
    -- nodeのバージョンを確認
    node --version
    -- npmのバージョンを確認
    npm --version
    ```

3. （必要に応じて）npmコマンドを実行しプリインストールされているパッケージを確認します。

    ```sh
    npm view oracledb
    npm view app
    npm view async
    ```

4. Hello World アプリケーションを実行し、Node.jsが問題なく利用できることを確認しましょう

    4-1. nodeディレクトリに移動します。

    ```sh
    cd ~/labs/node 
    ```

    ![img2_4_1.png](img2_4_1.png)


    4-2. （必要に応じて）app.jsファイルの中身を確認します。

    ```sh
    cat app.js
    ```

    アクセスしてきたクライアントに対して、Hello World を表示するという内容です。
    <br>※app.jsの中身は次の通りです。

    ```sh
    const port = 3030;
    const http = require('http');
    var os = require('os');
    var hostname = os.hostname();
    const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
    });
    server.listen(port, hostname, () => {
    console.log(`Server running at http://<Your Compute IP Address>:${port}/`);
    });
    ```

    4-3. app.jsを実行します。

    ```sh
    node app.js 
    ```

    ![img2_4_3.png](img2_4_3.png)

    ※コードの **`<Your Compute IP Address>`** のところはそのままで問題ありません。


    4-4. ブラウザを開き、以下のURLを実行して、"Hello world" が表示されることを確認します。
    <br>**`<仮想マシンのIPアドレス>`** のところには、app.jsを起動した仮想マシンに割り当てられているパブリックIPアドレスを入力します。

    ```sh
    http://<仮想マシンのIPアドレス>:3030
    ```

    次のように表示されればOKです。

    ![img2_4_5.png](img2_4_5.png)

    4-5. Hello World が表示されることを確認後、端末上で CTRL-C を入力しアプリを停止します。
    

<br>

<a id="anchor3"></a>

# 3. ADBに接続してみよう

次にNode.jsのアプリからADBに接続し、ADB上のデータを手元のブラウザ経由で確認します。

尚、事前に [104: クレデンシャル・ウォレットを利用して接続してみよう 3-1. SQL*Plus を使った接続](/ocitutorials/adb/adb104-connect-using-wallet#anchor3-1) を実施し、

SQL*plusで接続できていることを前提に以下を記載しています。

1. nodeディレクトリに移動します。

    ```sh
    cd ~/labs/node
    ```

2. 接続先となるAutonomous Databaseの情報をdbconfig.jsに登録します。

    以下を記載例を参考に各項目を記載して保存ください。

    ```sh
    vi dbconfig.js
    ```

    ```sh
    module.exports= {
        dbuser: 'admin',
        dbpassword: 'Welcome12345#',
        connectString: 'atp01_tp',
        walletdir: '/home/oracle/labs/wallets',
        walletpassword: 'Welcome12345#'
    }
    ```
    ※ご自身でパスワードを設定した場合は、そちらを記載してください。`walletpassword`は、OCIコンソールでウォレットのダウンロード時に入力(設定)したパスワードです。


    ![img3_2.png](img3_2.png)

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

3. （必要に応じて）connectadb.jsファイルの中身を確認します。

    ```sh
    cat connectadb.js
    ```
    ADBへの接続を生成し、接続の生成可否を画面に表示するという内容です。
    <br>※connectadb.jsの中身は次の通りです。

    ```sh
    const port=3030;
    var http = require('http');
    var os = require('os');
    var hostname = os.hostname();
    var oracledb = require('oracledb');
    var dbConfig = require('./dbconfig.js');
    let error;
    let user;
    oracledb.getConnection (
        {
        user: dbConfig.dbuser,
        password: dbConfig.dbpassword,
        connectString: dbConfig.connectString,
        configDir: dbConfig.walletdir,
        walletLocation: dbConfig.walletdir,
        walletpassword: dbConfig.walletpassword
        },
        function(err, connection)
        {
            if (err) { error = err; return; }
            connection.execute (
                'select user from dual', [],
                function(err, result)
                {
                    if (err) {cerror = err; return; }
                    user = result.rows[0][0];
                    console.log(`Check to see if your database connection worked at  http://<Your Compute IP Address>:${port}/`);
                    error = null;
                    connection.close(
                        function(err) {
                            if (err) { console.log(err); }
                        }
                    );
                }
            )
        }
    );

    http.createServer(function(request, response) {
        response.writeHead(200, {'Content-Type': 'text plain' });
        if (error === null)
        {
            response.end('Connection test succeeded. You connected to ADB as ' + user + '!');
        }
        else if (error instanceof Error)
        {
            response.write('Connection test failed. Check the settings and redeploy app!\n');
            response.end(error.message);
        }
        else
        {
            response.end('Connection test pending. Refresh after a few seconds...');
        }
    }).listen(port);
    ```

5. connectadb.jsを実行します。

    ```sh
    node connectadb.js
    ```
    ![img3_5.png](img3_5.png)

6. ブラウザを開き、以下のURLを実行して、Successed と表示されることを確認します。
    **`<仮想マシンのIPアドレス>`** のところには、実際のパブリックIPアドレスを入力します。

    ```sh
    http://<仮想マシンのIPドレス>:3030
    ```

    ![img3_7.png](img3_7.png)

7. 接続確認ができたら、端末上で CTRL-C を2回入力しアプリを停止します。


    > **補足**
    >
    > 次のようなエラーが表示された場合は、sqlplusの共有ライブラリを参照できるようにパスを設定する必要があります。
    >
    > ![img3_err.png](img3_err.png)
    >
    > 設定方法は [こちら](/ocitutorials/adb/adb104-connect-using-wallet#anchorerr) を参照ください。
    >

<br>

<a id="anchor4"></a>

# 4. ADB上のデータを操作してみよう

最後に、上記で作成したADBへの接続を利用して、ADBの中に格納されているデータを見てみましょう。

1. （必要に応じて）adbselect.jsの中身を確認します。

    ```sh
    cat adbselect.js
    ```

    ADBへの接続を作成して、簡単なSELECT文を実行するという内容です。
    <br>※adbselect.jsの中身は次の通りです。

    ```sh
    var oracledb = require('oracledb');
    var dbConfig = require('./dbconfig.js');

    oracledb.getConnection (
        {
            user: dbConfig.dbuser,
            password: dbConfig.dbpassword,
            connectString: dbConfig.connectString,
            configDir: dbConfig.walletdir,
            walletLocation: dbConfig.walletdir,
            walletpassword: dbConfig.walletpassword
        },
        function(err, connection)
        {
            if (err)
            {
                console.error(err.message);
                return;
            }

            connection.execute (
                'SELECT CUST_ID, CUST_FIRST_NAME, CUST_LAST_NAME FROM sh.customers WHERE CUST_ID = 5993',
                {},
                { outFormat: oracledb.OBJECT },
                function(err, result)
                {
                    if (err)
                    {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    console.log('We are specifically looking for customer ID 5992');
                    console.log(result.rows);
                    doRelease(connection);
                }
            );
        }
    );

    function doRelease (connection)
    {
        connection.close (
            function(err)
            {
                if (err)
                {
                    console.error(err.message);
                }
            }
        );
    }
    ```

2. adbselect.jsを実行します。次のように、特定のCUSTOMER IDの情報が表示されればOKです。

    ```sh
    node adbselect.js
    ```

    ![img4_2.png](img4_2.png)

以上で、この章の作業は終了です。

次の章にお進みください。
<br>