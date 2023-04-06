---
title: "WebLogic Server for OCIにアプリケーションを移行してみよう"
excerpt: "OCIが提供するWebLogic Server for OCIを利用して、JavaEEアプリケーションのクラウド移行を体験していただけるコンテンツです。"
order: "2002"
tags:
---

前提条件
---
- クラウド環境
    * Oracle Cloudのアカウントを取得済みであること
    * [WebLogic Server for OCIのプロビジョニング](/ocitutorials/cloud-native/wls-for-oci-provisioning/)を実施済みであること
        * このハンズオンでは以後この環境を「移行元環境」と呼びます

ハンズオンの全体像
---

1. 移行先環境で利用するデータベースのスキーマを作成
1. 移行先環境となるWebLogic Server for OCIを移行元環境と同一サブネットに作成
1. 移行元環境より移行ファイルを抽出
1. 移行ファイルを編集
1. 移行先環境に移行ファイルを適用  

**Note: 移行元/移行先のデータベースに関して**  
本ハンズオンでは、移行元と移行先で同一データベースを利用しますが、異なるスキーマを利用します。実際の移行では、接続先となるデータベースそのものが異なる場合が考えられます。
{: .notice--info}

![](summary_1.jpg)

**Note: ツールで移行可能なファイル**  
本ハンズオンで利用する移行ツールのWebLogic Deploy Toolingでは、**アプリケーション/アプリケーションの構成 以外のファイルは移行できません。** そのため、アプリケーションが利用するファイル(例: データベースウォレット)などの移行は手作業で行う必要があります。  
本ハンズオンでは、データベースにAutonomous Databaseを利用しているため、データベースウォレットの手動移行が必要になります。
{: .notice--info}

![](summary_2.jpg)

1.移行先環境で利用するデータベースのスキーマを作成
---

**Note: 移行元/移行先のデータベースに関して**  
この手順では、移行元と移行先で同一データベースのスキーマのみを変更しています。実際の移行では、接続先となるデータベースが異なる場合が考えられます。その場合、接続先のJDBC URLが異なる場合がございますので、ご注意ください
{: .notice--info}

左上のハンバーガーメニューを展開して、「Oracle Database」から「Autonomous Transaction Processing」を選択します。
![](1.3.001.jpg)

データベース・アクションをクリックします。  
![](1.3.008.jpg)

「ユーザー名」に`ADMIN`、「パスワード」に`Welcome1234!`と入力します。※セッションの関係で、入力の必要がない場合があります。
![](1.3.009.jpg)

「SQL」のパネルをクリックします。  
![](1.3.010.jpg)

以下のSQLをワークシートに貼り付け、**F5を押下し**全文を実行し、移行先環境が利用するスキーマを作成します。  
```
-- USER SQL
CREATE USER "DEST" IDENTIFIED BY "Welcome1234!";

-- ADD ROLES
GRANT CONNECT TO DEST;
GRANT RESOURCE TO DEST;
ALTER USER DEST DEFAULT ROLE CONNECT,RESOURCE;

-- ENABLE REST
BEGIN
    ORDS.ENABLE_SCHEMA(
        p_enabled => TRUE,
        p_schema => 'DEST',
        p_url_mapping_type => 'BASE_PATH',
        p_url_mapping_pattern => 'dest',
        p_auto_rest_auth=> TRUE
    );
    commit;
END;
/

-- QUOTA
ALTER USER DEST QUOTA UNLIMITED ON DATA;
```

画面右上、「ADMIN」をクリックし、「サインアウト」をクリック
![](1.3.014.jpg)

「サインイン」をクリックし、「ユーザー名」に`DEST`と入力し、「次」をクリックします。  
その後、「パスワード」に`Welcome1234!`と入力し、DESTユーザーでログインします。

「SQL」のパネルをクリックします。  
![](1.3.010.jpg)

　   
以下のSQLをワークシートに貼り付け、**F5を押下し**全文を実行。
```
CREATE TABLE "DEST"."TODO_HEAD" 
    (	
        "RID" NUMBER(10,0), 
        "STATUS" NUMBER(2,0), 
        "TITLE" VARCHAR2(100 BYTE), 
        "MEMO" VARCHAR2(1000 BYTE), 
        "IMPORTANCE" NUMBER(2,0), 
        "INCHARGE" NUMBER(10,0), 
        "CREATE_DATE" DATE, 
        "MODIFY_DATE" DATE
    );

INSERT INTO "DEST"."TODO_HEAD"
    (
        "RID", 
        "STATUS", 
        "TITLE", 
        "MEMO", 
        "IMPORTANCE", 
        "INCHARGE", 
        "CREATE_DATE", 
        "MODIFY_DATE"
    ) VALUES (
        0, 
        0,
        'TODO TITLE',
        'TODO MEMO',
        0,
        1000,
        sysdate,
        sysdate
    );
```

2.移行先環境となるWebLogic Server for OCIを移行元環境と同一サブネットに作成
---

### 2.1. マーケットプレイスにてスタックを起動する

左上のハンバーガーメニューを展開して、「マーケットプレイス」から「すべてのアプリケーション」を選択します。
![](2.1.001.jpg)

検索欄に「WebLogic Server Enterprise Edition UCM」と入力し、先頭に出てくるパネルをクリックします。
![](2.1.002.jpg)

チェックボックスにチェックを入れ、「スタックの起動」をクリックします。
![](2.1.003.jpg)

### 2.2. WebLogic Server for OCIをプロビジョニングする

**Note: 特に記載のない部分に関してはデフォルトの値で構いません**
{: .notice--info}

名前に「handson_dest」と入力し、「次」をクリックします。  
![](2.2.001.jpg)

Resource Name Prefix に「dest」と入力します。  
![](2.2.002.jpg)

SSH Public Keyでは、[事前準備](/ocitutorials/cloud-native/wls-for-oci-provisioning/#事前準備)で作成したSSH Keyを選択します。

Validated Secret for WebLogic Server Admin Passwordでは、[事前準備](/ocitutorials/cloud-native/wls-for-oci-provisioning/#事前準備)で作成したSecret(wlsadmin)を選択します。  
![](1.2.003.jpg)

Existing Networkは「base-wls_handson」を選択し、Validated Existing Networkに「YES」と入力します。  
![](2.2.003.jpg)

Existing Subnet for WebLogic Serverは「base-wl-subnet」を選択します。
![](2.2.004.jpg)

Existing Subnet for Bastion Hostは「base-bsubnet」を選択します。
![](2.2.005.jpg)

Existing Subnet for Load Balancerは「base-lbpubst1」を選択します。
![](2.2.006.jpg)

「次」をクリックし、「作成」をクリックします。

3.移行ファイルの抽出
---
WebLogic Deploy Tooling (WDT)を利用して、アプリケーションなどの移行ファイルを移行元環境より抽出します。

### 3.1. WDT をインストールする

コンソール右上、OCI Cloud ShellのアイコンをクリックしてOCI Cloud Shellを開きます。
![](4.3.001.jpg)

WDTをダウンロードします。
    
    wget https://github.com/oracle/weblogic-deploy-tooling/releases/download/release-2.3.2/weblogic-deploy.zip

WDTとSSH KeyをSCPで転送します。

    scp -i <SSH Keyのパス> \
    -o ProxyCommand='ssh -i <SSH Keyのパス> \
    -W %h:%p opc@<base-bastion-instanceのパブリックIP>' \
    ~/weblogic-deploy.zip <SSH Key> opc@<base-wls-0のプライベートIP>:~/

以下コマンドを実行し、移行元のWebLogicインスタンス(base-wls-0)にSSHログインします。

    ssh -i <SSH Keyのパス> \
    -o ProxyCommand='ssh -i <SSH Keyのパス> \
    -W %h:%p opc@<base-bastion-instanceのパブリックIP>' \
    opc@<base-wls-0のプライベートIP>

rootユーザーにスイッチします。
    
    sudo su - 

WDTとSSH Keyをoracleユーザーが利用できるようにします。

    mv /home/opc/weblogic-deploy.zip /home/oracle/
    mv <SSH Key> /home/oracle/

    chown oracle:oracle /home/oracle/weblogic-deploy.zip
    chown oracle:oracle <SSH Key>

oracleユーザーにスイッチします。
    
    sudo su - oracle

WDTをunzipします。

    unzip weblogic-deploy.zip

WDTスクリプトの権限変更を行います。
    
    chmod +x weblogic-deploy/bin/*.sh

### 3.2. 移行ファイルを抽出する

以下の`discoverDomain`コマンドを利用して、移行ファイルの抽出を行います。
```
weblogic-deploy/bin/discoverDomain.sh \
    -oracle_home $MW_HOME \
    -domain_home $DOMAIN_HOME \
    -archive_file ./source.zip \
    -model_file ./source.yaml \
    -variable_file source.properties \
```

4.移行ファイルの編集
---
Cloud Shell上のVimなど任意のテキストエディタで、移行ファイル(WDTモデルファイル)を編集します。  

### 4.1. source.propertiesファイルの編集
`source.properties`は、モデルファイル(`source.yaml`)で利用する変数をまとめたファイルです。

`JDBC.Handson.PasswordEncrypted`に`Welcome1234!`  
`JDBC.Handson.user.Value`は`DEST`と入力します。

```
JDBC.Handson.PasswordEncrypted=Welcome1234!
JDBC.Handson.user.Value=DEST
```

### 4.2. source.yamlファイルの編集
`source.yaml`は、WebLogicドメインをモデル化したファイルです。

`domainInfo`フィールドと`topology`フィールドをすべて削除します。

`resouces`フィールドと`appDeployments`フィールドのみが残ります。
{: .notice--info}

`Handson`フィールド下の`Target`は`base_cluster`を`dest_cluster`と変更します。
```yaml
resources:
    JDBCSystemResource:
        Handson:
            Target: dest_cluster #変更
```
`TodoApp-0.0.1-SNAPSHOT`フィールド下の`Target`は`base_cluster`を`dest_cluster`と変更します。
```yaml
appDeployments:
    Application:
        TodoApp-0.0.1-SNAPSHOT:
            SourcePath: wlsdeploy/applications/TodoApp-0.0.1-SNAPSHOT.war
            ModuleType: war
            Target: dest_cluster #変更
```

`StagingMode: stage`を`appDeployments`内の`Target: dest_cluster`の下に追加します。
```yaml
appDeployments:
    Application:
        TodoApp-0.0.1-SNAPSHOT:
            SourcePath: wlsdeploy/applications/TodoApp-0.0.1-SNAPSHOT.war
            ModuleType: war
            Target: dest_cluster
            StagingMode: stage #追加
```

### 4.3. WDTモデルファイルを移行先管理サーバに転送する

WDT、移行ファイル、Walletを移行先のWebLogic Server for OCIのインスタンスにscpで転送します。
    
    scp -i <SSH Key> weblogic-deploy.zip source.* \
    Wallet_handsonDB.zip opc@<移行先インスタンスのPrivate IP>:~/
    
移行先のWebLogic Server for OCIのインスタンスにSSH接続します。

    ssh -i [SSH Keyの名前] opc@[移行先インスタンスのPrivate IP]

WDT、移行ファイル、Walletの所有者を変更します。

    sudo chown oracle:oracle *

ファイルすべてを移動します。

    sudo mv * /home/oracle/

oracleユーザにスイッチします。

    sudo su - oracle

Walletを`unzip`します。

    unzip -d handsondb Wallet_handsonDB.zip

WDTを`unzip`します。

    unzip weblogic-deploy.zip

WDTの権限変更を行います。

    chmod +x weblogic-deploy/bin/*.sh

5.移行ファイルの適用
---
移行ファイルを移行先環境に適用し、移行が正常に行われることを確認します。

### 5.1. 移行ファイルを移行先環境に適用する
以下のコマンドを実行し、WebLogic Server for OCIにデプロイを行います。

```
weblogic-deploy/bin/updateDomain.sh \
 -oracle_home $MW_HOME \
 -domain_home $DOMAIN_HOME \
 -model_file source.yaml \
 -variable_file source.properties \
 -archive_file source.zip \
 -admin_url t3://$(hostname -i):9071
```
コマンドを実行すると、ユーザー名とパスワードを聞かれます。  
それぞれ`weblogic`, `wilcome1`と入力してください。

### 5.2. アプリケーションの動作確認を行う
`<Load Balancer IP>`を移行先のものに置き換えて、アプリケーションにアクセスします。

    https://<Load Balancer IP>/todo    
    