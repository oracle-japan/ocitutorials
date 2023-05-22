---
title: "WebLogic Server for OKEにアプリケーションをデプロイしてみよう"
excerpt: "OCIが提供するWebLogic Server for OKEを利用して、JavaEEアプリケーションのコンテナ化を体験していただけるコンテンツです。"
order: "2102"
tags:
---

前提条件
---
  * Oracle Cloudのアカウントを取得済みであること
  * [WebLogic Server for OCIをプロビジョニングしてみよう](/ocitutorials/cloud-native/wls-for-oci-provisioning/)を実施済みであること
  * [WebLogic Server for OKEをプロビジョニングしてみよう](/ocitutorials/cloud-native/wls-for-oke-provisioning/)を実施済みであること

ハンズオンの全体像
---

1. データベースのスキーマを作成
1. WebLogic Server for OCI の環境から移行ファイルを抽出
1. 移行ファイルを編集
1. WebLogic Server for OKE に移行ファイルを適用  

1.データベースのスキーマを作成
---

左上のハンバーガーメニューを展開して、「Oracle Database」から「Autonomous Transaction Processing」を選択します。
![](1.1.001.jpg)

データベース・アクションをクリックします。  
![](1.1.002.jpg)

「ユーザー名」に`ADMIN`、「パスワード」に`Welcome1234!`と入力します。※セッションの関係で、入力の必要がない場合があります。
![](1.1.003.jpg)

「SQL」のパネルをクリックします。  
![](1.1.004.jpg)

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
![](1.1.005.jpg)

「サインイン」をクリックし、「ユーザー名」に`DEST`と入力し、「次」をクリックします。  
その後、「パスワード」に`Welcome1234!`と入力し、DESTユーザーでログインします。

「SQL」のパネルをクリックします。  
![](1.1.004.jpg)

　   
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

2.移行ファイルの抽出
---
WebLogic Deploy Tooling (WDT)を利用して、アプリケーションなどの移行ファイルを移行元環境より抽出します。

### 2.1. WDT をインストールする

コンソール右上、OCI Cloud ShellのアイコンをクリックしてOCI Cloud Shellを開きます。
![](2.1.001.jpg)

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

### 2.1. 移行ファイルを抽出する

以下の`discoverDomain`コマンドを利用して、移行ファイルの抽出を行います。
```
weblogic-deploy/bin/discoverDomain.sh \
    -oracle_home $MW_HOME \
    -domain_home $DOMAIN_HOME \
    -archive_file ./source.zip \
    -model_file ./source.yaml \
    -variable_file source.properties \
```
