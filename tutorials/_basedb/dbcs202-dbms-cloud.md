---
title: "202:DBMS_CLOUDを使ってObject StorageのデータをBaseDBから参照しよう"
excerpt: "DBMS_CLOUD PL/SQLパッケージを利用して、Object StorageのデータをBase Database Service (BaseDB)から参照する手順について紹介します。"
order: "1_202"
header:
  teaser: "/basedb/dbcs202-dbms-cloud/External-table.png"
  overlay_image: "/basedb/dbcs202-dbms-cloud/External-table.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
  
#link: https://community.oracle.com/tech/welcome/discussion/4474283/
---

<a id="anchor0"></a>

# はじめに
DBMS_CLOUDはオブジェクト・ストレージのデータを操作するための包括的なサポートを提供するPL/SQLパッケージです。 

DBMS_CLOUDはAutonomous Database (ADB) に実装されているPL/SQLパッケージですが、手動インストールすることでBaseDBでも利用可能です。  

ADBでDBMS_CLOUDを利用する方法は[202: コマンドラインから大量データをロードしてみよう(DBMS_CLOUD)](../../adb/adb202-dataload-dbms-cloud){:target="_blank"}で学ぶことができます。  

ここでは、DBMS_CLOUDパッケージを利用してObject StorageのデータをBase Database Service (BaseDB)から外部表として参照する手順をご紹介します。　　

このチュートリアルで実行する内容のイメージは以下の通りです。
![image](dbms-cloud01.png)

<br>

**前提条件 :**
+ Oracle Database 19.9以上 もしくは　Oracle Database 21.3以上

+ PDBにユーザーが作成されていて、そのユーザーに接続可能であること

+ [101: Oracle Cloud で Oracle Database を使おう](../dbcs101-create-db){:target="_blank"} を通じて Oracle Database の作成が完了していること

+ 以下にリンクされているサンプルデータのCSVファイルをダウンロードしていること
	+ [サンプルデータファイルのダウンロードリンク](/ocitutorials/_basedb/dbcs202-dbms-cloud/ocitutorials_sales.csv)

+ [その7 - オブジェクト・ストレージを使う](../../beginners/object-storage){:target="_blank"} を通じてバケットの作成・データファイル(CSV)のアップロードが完了していること
   

<br>

**目次**

- [1. 事前準備](#1-事前準備)
- [2. DBMS_CLOUD PL/SQLパッケージのダウンロード](#2-dbms_cloud-plsqlパッケージのインストール)
- [3. Walletの作成](#3-walletの作成)
- [4. Walletの場所の設定](#4-walletの場所の設定)
- [5. ACEs(Access Control Entries)の作成](#5-acesaccess-control-entriesの作成)
- [6. DBMS_CLOUDの設定を検証](#6-dbms_cloudの設定を検証)
- [7. ユーザ・ロールへの権限付与](#7-ユーザ・ロールへの権限付与)
    - [7-1. ユーザへの権限付与](#7-1-ユーザへの権限付与)
    - [7-2. ロールへの権限付与](#7-2-ロールへの権限付与)
- [8. ユーザ・ロールのためのACEsを設定](#8-ユーザ・ロールのためのACEsを設定)
    - [8-1. ユーザへのACEs設定](#8-1-ユーザへのACEs設定)
    - [8-2. ロールへのACEs設定](#8-2-ロールへのACEs設定)
- [9. クレデンシャルの作成と検証](#9-クレデンシャルの作成と検証)
- [10. 外部表を作成しオブジェクトストレージのファイルを参照する](#10-外部表を作成しオブジェクトストレージのファイルを参照する)

<br>
**所要時間 :** 約1時間30分
<br>


# 1. 事前準備　


## 1. 関連ファイルのダウンロードと保存先の作成

まずは使用するファイルとそれらの保存先を作成します。  
以下の表に従ってoracleユーザでファイルを保存するディレクトリを用意します。

**関連ファイルの保存先**

 No. | パス | 格納するもの | 目的 |
-|-|-|-
1 | /home/oracle/dbc (作成要) | 作成した8個のSQLファイル(下記) | SQLスクリプト格納先 |
2 | /home/oracle/cert (作成要) | 	dbc_certs.tar | 証明書格納先 |
3 | /opt/oracle/dcs/commonstore/wallets/ssl (作成要) | Wallet格納先 |
4 | $ORACLE_HOME/network/admin | sqlnet.ora | 　|


次に以下のファイルを作成します。  
ダウンロード・リンクからスクリプトをダウンロードし、各ファイルを作成します。  
証明書のダウンロードリンクをクリックすると後程認証で使用する証明書がダウンロードされます。

**作成する関連ファイル**

 No. | ファイル名 | 目的 | ダウンロード・リンク | 格納先 |
-|-|-|-|-
1  | dbms_cloud_install.sql | DBMS_CLOUDのインストール | [ダウンロード](/ocitutorials/basedb/dbcs202-dbms-cloud/dbms_cloud_install.sql) |/home/oracle/dbc |
2  | dbc_aces.sql | Access Control Entries (ACEs)の設定 | [ダウンロード](/ocitutorials/basedb/dbcs202-dbms-cloud/dbc_aces.sql) | /home/oracle/dbc |
3  | verify_aces.sql | ACEs設定後の確認 | [ダウンロード](/ocitutorials/basedb/dbcs202-dbms-cloud/verify_aces.sql) | /home/oracle/dbc |
4  | grant_user.sql | 指定ユーザに権限を付与 | [ダウンロード](/ocitutorials/basedb/dbcs202-dbms-cloud/grant_user.sql) | /home/oracle/dbc |
5  | grant_role.sql | 指定ユーザにロールを付与 | [ダウンロード](/ocitutorials/basedb/dbcs202-dbms-cloud/grant_role.sql) | /home/oracle/dbc |
6  | config_aces_for_user.sql | 指定ユーザにACEsを設定 | [ダウンロード](/ocitutorials/basedb/dbcs202-dbms-cloud/config_aces_for_user.sql) | /home/oracle/dbc |
7 | config_aces_for_role.sql | 指定ロールにACEsを設定 | [ダウンロード](/ocitutorials/basedb/dbcs202-dbms-cloud/config_aces_for_role.sql) | /home/oracle/dbc |
8 | validate_user_config.sql | 設定した権限を検証 | [ダウンロード](/ocitutorials/basedb/dbcs202-dbms-cloud/validate_user_config.sql) | /home/oracle/dbc |
9 | dbc_certs.tar | 証明書 | [ダウンロード](https://objectstorage.us-phoenix-1.oraclecloud.com/p/QsLX1mx9A-vnjjohcC7TIK6aTDFXVKr0Uogc2DAN-Rd7j6AagsmMaQ3D3Ti4a9yU/n/adwcdemo/b/CERTS/o/dbc_certs.tar) | /home/oracle/cert |

**参考**
スクリプトは[SQLサンプル(GitHub)](https://github.com/oracle-devrel/technology-engineering/tree/main/data-platform/core-converged-db/dbms_cloud){:target="_blank"}からもダウンロード可能です。
{: .notice--info}

## 2. OCIユーザ確認と認証トークンの作成

OCIのコンソールに移り、画面右上の人型のマークが表示されている箇所をクリックします。  
<br>
さらに、展開されたメニューの「プロファイル」の下のユーザ名部分をクリックします。

![image](dbms-cloud02.png)

遷移した画面の一番上にある文字列がOCIユーザのIDです。これをコピーし、手元のテキストエディタなどにペーストしておきます。

![image](dbms-cloud03.png)


次に、認証トークンを作成します。

ユーザの詳細画面を下にスクロールし、左側の「リソース」メニューで、"認証トークン"をクリックします。そして、"トークンの生成"をクリックします。
![image](dbms-cloud04.png)

“説明”に”DBMS_CLOUD用トークン”と入力し、”トークンの生成”をクリックします。

![image](dbms-cloud05.png)

以下の画面が表示されるので、"コピー"をクリックし、これを手元のテキストエディタなどにペーストしておきます。

![image](dbms-cloud06.png)

<br>

# 2. DBMS_CLOUD PL/SQLパッケージのインストール

## 1. DBMS_CLOUD PL/SQLパッケージをインストールします。

**実行コマンド**　　

以下のコマンドは、DBMS_CLOUD PL/SQLパッケージをインストールするコマンドです。ここでは、SYSユーザのパスワードが必要です。
```sh
$ORACLE_HOME/perl/bin/perl $ORACLE_HOME/rdbms/admin/catcon.pl -u **sys/<your_sys_password>** --force_pdb_mode 'READ WRITE' -b dbms_cloud_install -d /home/oracle/dbc -l /home/oracle/dbc dbms_cloud_install.sql
```
※\<your_sys_password>にSYSユーザのパスワードを入れてください。
<br>

**実行例**
```sh
[oracle@data-momo dbc]$ pwd
/home/oracle/dbc
[oracle@data-momo dbc]$  $ORACLE_HOME/perl/bin/perl $ORACLE_HOME/rdbms/admin/catcon.pl -u sys/OUtk2022#OUtk2022# --force_pdb_mode 'READ WRITE' -b dbms_cloud_install -d /home/oracle/dbc -l /home/oracle/dbc dbms_cloud_install.sql
catcon::set_log_file_base_path: ALL catcon-related output will be written to [/home/oracle/dbc/dbms_cloud_install_catcon_23512.lst]

catcon::set_log_file_base_path: catcon: See [/home/oracle/dbc/dbms_cloud_install*.log] files for output generated by scripts

catcon::set_log_file_base_path: catcon: See [/home/oracle/dbc/dbms_cloud_install_*.lst] files for spool files, if any

catcon.pl: completed successfully
```
<br>

## 2. インストール時に問題が起こっていないことを確認します。

`/home/oracle/dbc`配下に以下のログファイルが作成されているので、これらを開きエラーが無いことを確認します。

**実行コマンド**

以下のコマンドは、/home/oracle/dbc配下のログファイルにエラーが出力されているか確認するコマンドです。
```sh
grep -i error dbms*.log dbms*.lst
```
<br>

**実行例**
```sh
[oracle@data-momo dbc]$ grep -i error dbms*.log dbms*.lst
dbms_cloud_install0.log:No errors.
dbms_cloud_install0.log:No errors.
　　　<省略>
dbms_cloud_install0.log:No errors.
[oracle@data-momo dbc]$
```
<br>

## 3. CDBに接続し、インストール後の結果を確認します。

**実行コマンド**　　

SQL*PlusでCDBにrootユーザで接続し、以下のコマンドを実行します。以下のコマンドはcdb_objectsから'DBMS_CLOUD'というオブジェクトを検索・表示するコマンドです。
```sh
select con_id, owner, object_name, status, sharing, oracle_maintained from cdb_objects where object_name = 'DBMS_CLOUD' order by con_id;
```
<br>

**実行例**
```sh
[oracle@data-momo dbc]$ sqlplus / as sysdba

SQL*Plus: Release 19.0.0.0.0 - Production on Tue Dec 19 10:51:36 2023
Version 19.21.0.0.0

Copyright (c) 1982, 2022, Oracle.  All rights reserved.


Connected to:
Oracle Database 19c EE High Perf Release 19.0.0.0.0 - Production
Version 19.21.0.0.0

SQL> show con_name;

CON_NAME
------------------------------
CDB$ROOT

SQL> select con_id, owner, object_name, status, sharing, oracle_maintained from cdb_objects where object_name = 'DBMS_CLOUD' order by con_id;

    CON_ID OWNER                OBJECT_NAME     STATUS  SHARING            O
---------- -------------------- --------------- ------- ------------------ -
         1 PUBLIC               DBMS_CLOUD      VALID   METADATA LINK      Y
         1 C##CLOUD$SERVICE     DBMS_CLOUD      VALID   METADATA LINK      Y
         1 C##CLOUD$SERVICE     DBMS_CLOUD      VALID   METADATA LINK      Y
         3 PUBLIC               DBMS_CLOUD      VALID   METADATA LINK      Y
         3 C##CLOUD$SERVICE     DBMS_CLOUD      VALID   METADATA LINK      Y
         3 C##CLOUD$SERVICE     DBMS_CLOUD      VALID   METADATA LINK      Y

6 rows selected.
```
<br>
DBMS_CLOUDが正常にインストールされていると`STAUS`カラムに`VALID`と表示されます。
<br>

## 4. PDBでも同じように確認します。

**実行コマンド**　　

CDBで実施した確認をPDBでも行います。
rootユーザでCDBからPDBに接続先を切り替え、以下のコマンドはを実行します。
```sh
select owner, object_name, status, sharing, oracle_maintained from dba_objects where object_name = 'DBMS_CLOUD';
```
<br>

**実行例**
```sh
SQL> alter session set container=DB1218_pdb1;

Session altered.

SQL> show con_name;

CON_NAME
------------------------------
DB1218_PDB1

SQL> select owner, object_name, status, sharing, oracle_maintained from dba_objects where object_name = 'DBMS_CLOUD';

OWNER                OBJECT_NAME     STATUS  SHARING            O
-------------------- --------------- ------- ------------------ -
PUBLIC               DBMS_CLOUD      VALID   METADATA LINK      Y
C##CLOUD$SERVICE     DBMS_CLOUD      VALID   METADATA LINK      Y
C##CLOUD$SERVICE     DBMS_CLOUD      VALID   METADATA LINK      Y

SQL>
```

DBMS_CLOUDが正常にインストールされていると`STAUS`カラムに`VALID`と表示されます。
<br>

確認が出来たら、SQL*Plusを一度出ます。

**実行例**
```sh
SQL>exit
```
<br>

# 3. Walletの作成

## 1. 次にHTTPSでオブジェクトストレージにアクセスするため、Walletファイルを準備します。

こちらの[ダウンロードリンク](https://objectstorage.us-phoenix-1.oraclecloud.com/p/QsLX1mx9A-vnjjohcC7TIK6aTDFXVKr0Uogc2DAN-Rd7j6AagsmMaQ3D3Ti4a9yU/n/adwcdemo/b/CERTS/o/dbc_certs.tar)から証明書をダウンロードし、解凍します。
<br>

**実行コマンド**

以下のコマンドで証明書を格納するディレクトリ(/home/oracle/cert)まで移動します。
```sh
cd /home/oracle/cert
```
以下のコマンドはダウンロードから証明書が入っているファイル(圧縮済み)をダウンロードするコマンドです。
```sh
wget https://objectstorage.us-phoenix-1.oraclecloud.com/p/QsLX1mx9A-vnjjohcC7TIK6aTDFXVKr0Uogc2DAN-Rd7j6AagsmMaQ3D3Ti4a9yU/n/adwcdemo/b/CERTS/o/dbc_certs.tar
```

**実行例**
```sh
[oracle@data-momo cert]$ wget https://objectstorage.us-phoenix-1.oraclecloud.com/p/QsLX1mx9A-vnjjohcC7TIK6aTDFXVKr0Uogc2DAN-Rd7j6AagsmMaQ3D3Ti4a9yU/n/adwcdemo/b/CERTS/o/dbc_certs.tar
--2023-12-19 10:56:13--  https://objectstorage.us-phoenix-1.oraclecloud.com/p/QsLX1mx9A-vnjjohcC7TIK6aTDFXVKr0Uogc2DAN-Rd7j6AagsmMaQ3D3Ti4a9yU/n/adwcdemo/b/CERTS/o/dbc_certs.tar
Resolving objectstorage.us-phoenix-1.oraclecloud.com (objectstorage.us-phoenix-1.oraclecloud.com)... 134.70.16.1, 134.70.12.1, 134.70.8.1
Connecting to objectstorage.us-phoenix-1.oraclecloud.com (objectstorage.us-phoenix-1.oraclecloud.com)|134.70.16.1|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 235520 (230K) [application/x-tar]
Saving to: edbc_certs.tarf

dbc_certs.tar                         100%[========================================================================>] 230.00K   452KB/s    in 0.5s

2023-12-19 10:56:14 (452 KB/s) - edbc_certs.tarf saved [235520/235520]
```

ファイルのダウンロードが完了したら、解凍します。

**実行コマンド**　　

以下のコマンドでファイルがダウンロードされていることを確認します。
```sh
ll
```
そして、以下のコマンドで圧縮されているファイルを解凍します。
```sh
 tar xvf dbc_certs.tar
```

**実行例**
```sh
[oracle@data-momo cert]$ ll
total 232
-rw-r--r-- 1 oracle oinstall 235520 May 13  2022 dbc_certs.tar
[oracle@data-momo cert]$ tar xvf dbc_certs.tar
Actalis.cer
AddTrust1.cer
AddTrust2.cer
　<省略>
VeriSign7.cer
XRamp.cer
[oracle@data-momo cert]$
```

## 2. tarファイル解凍後、以下のコマンドを実施し、[事前準備](#1-事前準備)で作成したWallet格納用のディレクトリにWalletファイルを作成します。

**実行コマンド**

以下のコマンドでWalletを格納するディレクトリ(/opt/oracle/dcs/commonstore/wallets/ssl)に移動します。　
```sh
cd /opt/oracle/dcs/commonstore/wallets/ssl
```
そして、以下のコマンドでディレクトリにWalletを作成します。<my_password>にはWallet用のご自身のパスワードを入力してください。
```sh
orapki wallet create -wallet . -pwd <my_password> -auto_login
```
<br>
\<my_password>にはWalletに使用するパスワード入力します。
<br>

**実行例**
```sh
[oracle@data-momo cert]$ cd /opt/oracle/dcs/commonstore/wallets/ssl
[oracle@data-momo ssl]$ orapki wallet create -wallet . -pwd <my_password> -auto_login
Oracle PKI Tool Release 19.0.0.0.0 - Production
Version 19.4.0.0.0
Copyright (c) 2004, 2023, Oracle and/or its affiliates. All rights reserved.

Operation is successfully completed.
```
<br>
Walletが作成されました。
<br>

## 3. 以下のコマンドを実行し、tarファイルの証明書をWalletに追加していきます。

**実行コマンド**

以下コマンドを実行すると、dbc_certs.tarに入っている証明書を自動で先ほど作成したWalletに追加されます。
実行はWalletがある/opt/oracle/dcs/commonstore/wallets/sslで実行します。
```sh
#! /bin/bash
for i in /home/oracle/cert/*.cer
do
orapki wallet add -wallet . -trusted_cert -cert "$i" -pwd **<my_password>**
done
```
<br>
\<my_password>にはWalletのパスワードを入力します。
<br>

**実行例**
```sh
[oracle@data-momo ssl]$ #! /bin/bash
[oracle@data-momo ssl]$ for i in /home/oracle/cert/*.cer
> do
> orapki wallet add -wallet . -trusted_cert -cert "$i" -pwd <my_password>
> done
Oracle PKI Tool Release 19.0.0.0.0 - Production
Version 19.4.0.0.0
Copyright (c) 2004, 2023, Oracle and/or its affiliates. All rights reserved.

Operation is successfully completed.
Oracle PKI Tool Release 19.0.0.0.0 - Production
Version 19.4.0.0.0
Copyright (c) 2004, 2023, Oracle and/or its affiliates. All rights reserved.

Operation is successfully completed.
Oracle PKI Tool Release 19.0.0.0.0 - Production
Version 19.4.0.0.0
Copyright (c) 2004, 2023, Oracle and/or its affiliates. All rights reserved.

Operation is successfully completed.

<省略>

Could not install trusted cert at/home/oracle/cert/VeriSign7.cer
PKI-04003: The trusted certificate is already present in the wallet.
Oracle PKI Tool Release 19.0.0.0.0 - Production
Version 19.4.0.0.0
Copyright (c) 2004, 2023, Oracle and/or its affiliates. All rights reserved.

Operation is successfully completed.
```

証明書の数が多いので、全て追加し終わるまで少し時間がかかります。

## 4. 作成されたWalletを確認します。

**実行コマンド**

以下のコマンドでWalletの中を表示し、証明書が追加されていることを確認します。
```sh
orapki wallet display -wallet .
```
<br>

**実行例**
```sh
[oracle@data-momo ssl]$ pwd
/opt/oracle/dcs/commonstore/wallets/ssl
[oracle@data-momo ssl]$ orapki wallet display -wallet .
Oracle PKI Tool Release 19.0.0.0.0 - Production
Version 19.4.0.0.0
Copyright (c) 2004, 2023, Oracle and/or its affiliates. All rights reserved.

Requested Certificates:
User Certificates:
Trusted Certificates:
<省略>
Subject:        CN=Starfield Services Root Certificate Authority - G2,O=Starfield Technologies\, Inc.,L=Scottsdale,ST=Arizona,C=US
```
<br>

# 4. Walletの場所の設定

sqlnet.oraの以下の箇所を編集し、作成されたWalletファイルを利用出来るようにします。

※RACの場合、全ノードで実施してください。
<br>

**実行コマンド**
以下のコマンドで/u01/app/oracle/product/19.0.0.0/dbhome_1/network/adminに移動します。
```sh
cd /u01/app/oracle/product/19.0.0.0/dbhome_1/network/admin
```
そして、以下のコマンドでsqlnet.oraを開き、編集します。

**sqlnet.oraの編集(追加)箇所**
```sh
vi sqlnet.ora
```
以下をsqlnet.oraに追記します。
```sh
WALLET_LOCATION=(SOURCE=(METHOD=FILE)(METHOD_DATA=(DIRECTORY=/opt/oracle/dcs/commonstore/wallets/ssl)))
```
<br>

**実行例**
```sh
[oracle@data-momo admin]$ pwd
/u01/app/oracle/product/19.0.0.0/dbhome_1/network/admin
[oracle@data-momo admin]$ cat sqlnet.ora
WALLET_LOCATION=(SOURCE=(METHOD=FILE)(METHOD_DATA=(DIRECTORY=/opt/oracle/dcs/commonstore/wallets/ssl)))
#ENCRYPTION_WALLET_LOCATION=(SOURCE=(METHOD=FILE)(METHOD_DATA=(DIRECTORY=/opt/oracle/dcs/commonstore/wallets/tde/$ORACLE_UNQNAME)))
<省略>
```
<br>

# 5. ACEs(Access Control Entries)の作成

HTTPSでオブジェクト・ストレージとの通信を許可するため、ACEsの作成をします。
ACEsを作成するには、dbc_aces.sqlで以下の箇所を編集してから、スクリプトを実行します。
<br>

**dbc_aces.sqlの編集個所**  
[関連ファイルのダウンロードと保存先の作成](#1-関連ファイルのダウンロードと保存先の作成)からdbc_aces.sqlをダウンロードし、以下の箇所を編集します。

編集前|編集後
-|-
`define sslwalletdir=<Set SSL Wallet Directory>`|`define sslwalletdir=/opt/oracle/dcs/commonstore/wallets/ssl`

<br>
編集後、SYSでCDBにログインし、dbc_aces.sqlを実行します。
Proxyを使わないは空欄のままEnterキーを押してください
<br>

**実行コマンド**
```sh
sqlplus / as sysdba
```
```sh
@dbc_aces.sql
```

**実行例**
```sh
[oracle@data-momo dbc]$ sqlplus / as sysdba

SQL*Plus: Release 19.0.0.0.0 - Production on Thu Dec 21 02:18:39 2023
Version 19.21.0.0.0

Copyright (c) 1982, 2022, Oracle.  All rights reserved.


Connected to:
Oracle Database 19c EE High Perf Release 19.0.0.0.0 - Production
Version 19.21.0.0.0

SQL> show con_name

CON_NAME
------------------------------
CDB$ROOT
SQL> sho user
USER is "SYS"

SQL> @dbc_aces.sql

Session altered.

old   9: principal_name => upper('&clouduser'),
new   9: principal_name => upper('C##CLOUD$SERVICE'),
Enter value for proxy_host:
old  16: -- host =>'&proxy_host',
new  16: -- host =>'',
Enter value for proxy_low_port:
old  17: -- lower_port => &proxy_low_port,
new  17: -- lower_port => ,
Enter value for proxy_high_port:
old  18: -- upper_port => &proxy_high_port,
new  18: -- upper_port => ,
old  21: -- principal_name => upper('&clouduser'),
new  21: -- principal_name => upper('C##CLOUD$SERVICE'),
old  29: wallet_path => 'file:&sslwalletdir',
new  29: wallet_path => 'file:/opt/oracle/dcs/commonstore/wallets/ssl',
old  32: principal_name => upper('&clouduser'),
new  32: principal_name => upper('C##CLOUD$SERVICE'),

PL/SQL procedure successfully completed.

old   4: execute immediate 'alter database property set ssl_wallet=''&sslwalletdir''';
new   4: execute immediate 'alter database property set ssl_wallet=''/opt/oracle/dcs/commonstore/wallets/ssl''';
Enter value for proxy_uri:
old   8: -- execute immediate 'alter database property set http_proxy=''&proxy_uri''';
new   8: -- execute immediate 'alter database property set http_proxy=''''';

PL/SQL procedure successfully completed.


Session altered.
```

実行後、設定内容を確認します。

**実行コマンド**
以下のコマンドで設定内を確認します。
```sh
select * from database_properties where property_name in ('SSL_WALLET','HTTP_PROXY');
```
**実行例**
```sh
SQL> select * from database_properties where property_name in ('SSL_WALLET','HTTP_PROXY');

PROPERTY_NAME   PROPERTY_VALUE                           DESCRIPTION
--------------- ---------------------------------------- ------------------------------
SSL_WALLET      /opt/oracle/dcs/commonstore/wallets/ssl  Location of SSL Wallet
```
<br>

# 6. DBMS_CLOUDの設定を検証

ここまで、Walletの作成とACEsの設定を実施したので、それらが正しく設定されているかどうかを検証します。
検証にはverify_aces.sqlを使用します。
<br>

**verify_aces.sqlの編集個所** 
[関連ファイルのダウンロードと保存先の作成](#1-関連ファイルのダウンロードと保存先の作成)からverify_aces.sqlをダウンロードし、以下の箇所を編集します。 

 編集前 | 編集後 |
-|-
`define sslwalletdir=<Set SSL Wallet Directory>` | `define sslwalletdir=/opt/oracle/dcs/commonstore/wallets/ssl` |
`define sslwalletpwd=<Set SSL Wallet password>` | `define sslwalletpwd=<Wallet作成時、指定したパスワード>` |
 GET_PAGE('https://objectstorage.eu-frankfurt-1.oci.customer-oci.com'); | GET_PAGE('https://objectstorage.<リージョン識別子>.oci.customer-oci.com'); |

<br>

※`<リージョン識別子>`はリージョン識別子に置き換えます。
各リージョンのリージョン識別子は[リージョンおよび可用性ドメインについて](https://docs.oracle.com/ja-jp/iaas/Content/General/Concepts/regions.htm){:target="_blank"}から確認できます。
環境に合ったものを使用してください。

編集後、SYSユーザでCDBかPDBにログインし、verify_aces.sqlを実行します。
<br>
**実行コマンド**
```sh
sqlplus / as sysdba
```
```sh
@verify_aces.sql
```

**実行例**
※実行例はCDBで実行しています。
```sh
[oracle@data-momo dbc]$ sqlplus / as sysdba

SQL*Plus: Release 19.0.0.0.0 - Production on Thu Dec 21 02:36:49 2023
Version 19.21.0.0.0

Copyright (c) 1982, 2022, Oracle.  All rights reserved.


Connected to:
Oracle Database 19c EE High Perf Release 19.0.0.0.0 - Production
Version 19.21.0.0.0

SQL> show con_name

CON_NAME
------------------------------
CDB$ROOT
SQL> sho user
USER is "SYS"

SQL> @verify_aces.sql
old   1: CREATE OR REPLACE PROCEDURE &clouduser..GET_PAGE(url IN VARCHAR2) AS
new   1: CREATE OR REPLACE PROCEDURE C##CLOUD$SERVICE.GET_PAGE(url IN VARCHAR2) AS
old  13: wallet_path => 'file:&sslwalletdir',
new  13: wallet_path => 'file:/opt/oracle/dcs/commonstore/wallets/ssl',
old  14: wallet_password => '&sslwalletpwd');
new  14: wallet_password => '<my_password>');

Procedure created.

old   2: &clouduser..GET_PAGE('https://objectstorage.eu-frankfurt-1.oci.customer-oci.com');
new   2: C##CLOUD$SERVICE.GET_PAGE('https://objectstorage.ap-osaka-1.oci.customer-oci.com');
valid response

PL/SQL procedure successfully completed.

old   1: drop procedure &clouduser..GET_PAGE
new   1: drop procedure C##CLOUD$SERVICE.GET_PAGE

Procedure dropped.

SQL>
```
<br>
実行の結果、**"valid response"**が表示されるのを確認します。

確認出来たら、DBMS_CLOUDのインストールと設定は完了です。

<br>

# 7. ユーザ・ロールへの権限付与

次に、対象ユーザへの権限付与を行います。
<br>

対象ユーザへ権限付与をする方法は2つあります。   
以下、どちらかを選択してください。

※選択する方法によって使用するスクリプトが異なるので注意してください。
{: .notice--warning}

**A：** 直接対象ユーザにDBMS_CLOUDの利用権限を付与(grant_user.sqlを実行)　→ [7-1. ユーザへの権限付与](#7-1-ユーザへの権限付与)へ

**B：** 対象ユーザに付与されたロールに、DBMS_CLOUDの利用権限を付与(grant_role.sqlを実行)　→ [7-2. ロールへの権限付与](#7-2-ロールへの権限付与)へ

<br>

## 7-1. ユーザへの権限付与

A. 直接対象ユーザにDBMS_CLOUDの利用権限を付与(grant_user.sqlを実行)を実行する場合、以下の操作を行います。

<br>
まず、DBMS_CLOUDを利用するユーザとして、PDBにUSER1を作成します。そして、user1に権限を付与します。
USER1に権限付与をするために、grant_user.sqlの以下の箇所を編集します。
<br>

**grant_user.sqlの編集k**

[関連ファイルのダウンロードと保存先の作成](#1-関連ファイルのダウンロードと保存先の作成)からgrant_user.sqlをダウンロードし、以下の箇所を編集します。 

編集前|編集後|
-|-
define username='SCOTT'|define username='USER1'

<br>
編集後、SYSかSYSTEMユーザでPDBにログインし、grant_user.sqlを実行します。
<br>

**実行例**
```sh
[oracle@data-momo dbc]$ sqlplus / as sysdba

SQL*Plus: Release 19.0.0.0.0 - Production on Tue Dec 19 12:02:26 2023
Version 19.21.0.0.0

Copyright (c) 1982, 2022, Oracle.  All rights reserved.


Connected to:
Oracle Database 19c EE High Perf Release 19.0.0.0.0 - Production
Version 19.21.0.0.0

SQL> alter session set container=DB1218_pdb1;

Session altered.

SQL> show con_name

CON_NAME
------------------------------
DB1218_PDB1
SQL> show user
USER is "SYS"

SQL> @grant_user.sql

Role created.


Grant succeeded.


Grant succeeded.


Grant succeeded.


Grant succeeded.

SQL>
```
<br>

## 7-2. **A** ロールへの権限付与

B. 対象ユーザに付与されたロールに、DBMS_CLOUDの利用権限を付与(grant_role.sqlを実行)を実行する場合、以下の操作を行います。

まず、DBMS_CLOUDを利用するユーザとして、PDBにUSER1を作成します。そして、ロールを作成し、USER1にロールを付与します。
ロールを作成し、USER1にロールを付与するために、grant_role.sqlの以下の箇所を編集します。
<br>

**grant_role.sqlの編集個所**

[関連ファイルのダウンロードと保存先の作成](#1-関連ファイルのダウンロードと保存先の作成)からgrant_role.sqlをダウンロードし、以下の箇所を編集します。 

編集前|編集後|
-|-
`define userrole='CLOUD_USER'`|`define userrole='<dbms-cloud-role>'`
define username='SCOTT'|define username='USER1'

※\<dbms-cloud-role>にはDBMS_CLOUDに利用するロール名を入力します。


編集後、SYSかSYSTEMユーザでPDBにログインし、grant_role.sqlを実行します。

<br>

# 8.  **B** ユーザ・ロールのためのACEsを設定

Access Control Entries (ACEs) の設定をユーザ・ロールにします。設定方法は2つあります。

「7.ユーザ・ロールへの権限付与」で選択した方法に応じて、どちらかを選択してください。


**A：** [7-1. ユーザへの権限付与](#7-1-ユーザへの権限付与)を実行した場合、config_aces_for_user.sqlを編集・実行し、ACEsを設定します　→　[8-1. ユーザへのACEs設定](#8-1-ユーザへのACEs設定)へ

**B：** [7-2. ロールへの権限付与](#7-2-ロールへの権限付与)を実行した場合、config_aces_for_role.sqlを編集・実行し、ACEsを設定します。→　[8-2. ロールへのACEs設定](#8-2-ロールへのACEs設定)へ


## 8-1.  **A**ユーザへのACEs設定

[7-1. ユーザへの権限付与](#7-1-ユーザへの権限付与)を実行した場合、以下の操作を行いACEsを設定します。

対象ユーザにACEsの設定をするために、config_aces_for_user.sqlを編集します。
<br>

**config_aces_for_user.sqlの編集箇所**

[関連ファイルのダウンロードと保存先の作成](#1-関連ファイルのダウンロードと保存先の作成)からconfig_aces_for_user.sqlをダウンロードし、以下の箇所を編集します。 

編集前|編集後|
-|-
define username='SCOTT'|define username='USER1'
`define sslwalletdir=<Set SSL Wallet Directory>`|`define sslwalletdir=/opt/oracle/dcs/commonstore/wallets/ssl`

編集後、SYSかSYSTEMユーザでPDBにログインし、config_aces_for_user.sqlを実行します。
<br>

**実行例**
```sh
SQL*Plus: Release 19.0.0.0.0 - Production on Tue Dec 19 12:02:26 2023
Version 19.21.0.0.0

Copyright (c) 1982, 2022, Oracle.  All rights reserved.


Connected to:
Oracle Database 19c EE High Perf Release 19.0.0.0.0 - Production
Version 19.21.0.0.0

SQL> alter session set container = DB1218_pdb1;

Session altered.

SQL> show con_name

CON_NAME
------------------------------
DB1218_PDB1
SQL> show user
USER is "SYS"

SQL> @config_aces_for_user.sql

Session altered.

old   9: principal_name => upper('&clouduser'),
new   9: principal_name => upper('USER1'),
old  17: -- host =>'&proxy_host',
new  17: -- host =>'<your',
old  18: -- lower_port => &proxy_low_port,
new  18: -- lower_port => <your_proxy_low_port>,
old  19: -- upper_port => &proxy_high_port,
new  19: -- upper_port => <your_proxy_high_port>,
old  22: -- principal_name => upper('&clouduser'),
new  22: -- principal_name => upper('USER1'),
old  30: wallet_path => 'file:&sslwalletdir',
new  30: wallet_path => 'file:/opt/oracle/dcs/commonstore/wallets/ssl',
old  33: principal_name => upper('&clouduser'),
new  33: principal_name => upper('USER1'),

PL/SQL procedure successfully completed.


Session altered.
```
<br>

## 8-2.  **B** ロールへのACEs設定

[7-2. ロールへの権限付与](#7-2-ロールへの権限付与)を実行した場合、以下の操作を行いACEsを設定します。

対象ロールにACEsの設定をするために、config_aces_for_role.sqlを編集します。
<br>

**config_aces_for_role.sqlの編集箇所**

[関連ファイルのダウンロードと保存先の作成](#1-関連ファイルのダウンロードと保存先の作成)からconfig_aces_for_role.sqlをダウンロードし、以下の箇所を編集します。 

編集前|編集後|
-|-
`define cloudrole=CLOUD_USER` | `define cloudrole=<dbms-cloud-role>`
`define sslwalletdir=<Set SSL Wallet Directory>`|`define sslwalletdir=/opt/oracle/dcs/commonstore/wallets/ssl`

※\<dbms-cloud-role>にはDBMS_CLOUDに利用するロール名を入力します。

編集後、SYSかSYSTEMユーザでPDBにログインし、config_aces_for_user.sqlを実行します。

<br>

# 9. クレデンシャルの作成と検証

DBMS_CLOUDを利用し、クレデンシャルを作成します。
<br>
クレデンシャルはOCIオブジェクト・ストレージ上のデータをアクセスするために使用します。 
<br>

**DBMS_CLOUD利用時の権限**  
DBMS_CLOUDを使う権限が正しく付与されていない場合、クレデンシャルは作れません。  
クレデンシャルが作成できない場合は、DBMS_CLOUDの権限を確認してください。
{: .notice--warning}


ここでは、[1 事前準備](#1-事前準備)で確認した、**OCIユーザID**と**認証トークン**が必要です。

対象ユーザ(USER1)でPDBにログインし、以下のスクリプトを実行してクレデンシャルを作成します。
<br>

**実行コマンド**
以下はDBMS_CLOUDを利用して、クレデンシャルを作成するスクリプトです。
`<your credential name>`、`<OCI user name>`、`<auth token generated for OCI user>`はご自身の情報を入力してください。
各項目の情報の取得方法は実行例の下に記載しています。

```sql
BEGIN
DBMS_CLOUD.CREATE_CREDENTIAL(
credential_name => '<クレデンシャルの名前（任意の名前）>',
username => '<OCIユーザーID>',
password => '<認証トークン>'
);
END;
/
```
<br>

**実行例**
以下の実行例ではSCOTTユーザでPDBにログインし、MY_CREDという名前のクレデンシャルを作成しています。
```sql
[oracle@data-momo dbc]$ sqlplus SCOTT/<SCOTTのパスワード>@DB1218_pdb1

SQL*Plus: Release 19.0.0.0.0 - Production on Fri Dec 22 05:56:11 2023
Version 19.21.0.0.0

Copyright (c) 1982, 2022, Oracle.  All rights reserved.

Last Successful login time: Fri Dec 22 2023 05:43:01 +00:00

Connected to:
Oracle Database 19c EE High Perf Release 19.0.0.0.0 - Production
Version 19.21.0.0.0

SQL> show user
USER is "SCOTT"
SQL> show con_name

CON_NAME
------------------------------
DB1218_PDB1

SQL> BEGIN
  2  DBMS_CLOUD.CREATE_CREDENTIAL(
  3  credential_name => 'MY_CRED',
  4  username => '<my_OCI user name>',
  5  password => '<my_token>'
  6  );
  7  END;
  8  /

PL/SQL procedure successfully completed.

SQL>
```
<br>
クレデンシャルが作成されました。
<br>
クレデンシャルの作成後、以下のコマンドでOCI上のバケットをアクセスし、オブジェクトの一覧を取得します。
<br>

**実行コマンド**

以下は、先ほど作成したクレデンシャルを利用し、オブジェクト・ストレージのバケットにアクセスするコマンドです。
<br>
このコマンドで、バケットの中に正常にアクセスできるか確認します。※ファイル名は必要ありません。
URIの詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/autonomous-database/doc/cloud-storage-uris.html){:target="_blank"}
```sql
select * from dbms_cloud.list_objects(<'CredentialName'>,'https://objectstorage.<region>.oraclecloud.com/n/<namespace-string>/b/<bucket>/o/');
```
URLは「オブジェクト・ストレージ」→ 「バケットの詳細」→ 「オブジェクトの詳細」から確認できます。

![image](dbms-cloud09.png)
<br>

オブジェクト・ストレージへアクセスする際はOracle Cloud Infrastructure Object StorageのネイティブURI形式をご利用ください。
DBMS_CLOUDパッケージではオブジェクト・ストレージの専用エンドポイントはサポートされていません。
{: .notice--warning}

**実行例**
```sql
SQL> select * from dbms_cloud.list_objects('MOMO_CRED','https://objectstorage.ap-osaka-1.oraclecloud.com/n/orasejapan/b/TutorialBucket1/o/');

OBJECT_NAME                         BYTES CHECKSUM                                 CREATED              LAST_MODIFIED
------------------------------ ---------- ---------------------------------------- -------------------- -----------------------------------
tutorial_sales.csv               14181117 9456446e42e14bc199f2054b5bc1ef99                              30-JAN-24 09.47.04.270000 AM +00:00
```

バケットの中に、tutorial_sales.csvというオブジェクトがあることが確認できました。

さらに、今のユーザの設定を検証するためにvalidate_user_config.sqlの内容を編集してから、実行します。

**validate_user_config.sqlの編集箇所**

[関連ファイルのダウンロードと保存先の作成](#1-関連ファイルのダウンロードと保存先の作成)からvalidate_user_config.sqlをダウンロードし、以下の箇所を編集します。

編集前|編集後|
-|-
define username='SCOTT'|define username='USER1'
`define sslwalletdir=<Set SSL Wallet Directory>`|`define sslwalletdir=/opt/oracle/dcs/commonstore/wallets/ssl`
`define sslwalletpwd=<Set SSL Wallet password>`|`define sslwalletpwd=<Walletのパスワード>`
GET_PAGE('https://objectstorage.eu-frankfurt-1.customer-oci.com');|GET_PAGE('https://objectstorage.<リージョン識別子>.oci.customer-oci.com');

※`<リージョン識別子>`はリージョン識別子に置き換えます。
各リージョンのリージョン識別子は[リージョンおよび可用性ドメインについて](https://docs.oracle.com/ja-jp/iaas/Content/General/Concepts/regions.htm){:target="_blank"}から確認できます。
環境に合ったものを使用してください。

編集後、USER1ユーザでPDBにログインし、validate_user_config.sqlを実行します。
<br>

**実行例**
以下の実行例ではSCOTTユーザでPDBにログインし、validate_user_config.sqlを実行しています。
```sql
[oracle@data-momo dbc]$ sqlplus SCOTT/<SCOTTのパスワード>@DB1218_pdb1

SQL*Plus: Release 19.0.0.0.0 - Production on Fri Dec 22 05:56:11 2023
Version 19.21.0.0.0

Copyright (c) 1982, 2022, Oracle.  All rights reserved.

Last Successful login time: Fri Dec 22 2023 05:43:01 +00:00

Connected to:
Oracle Database 19c EE High Perf Release 19.0.0.0.0 - Production
Version 19.21.0.0.0

SQL> show user
USER is "SCOTT"
SQL> @validate_user_config.sql
old   1: CREATE OR REPLACE PROCEDURE &clouduser..GET_PAGE(url IN VARCHAR2) AS
new   1: CREATE OR REPLACE PROCEDURE SCOTT.GET_PAGE(url IN VARCHAR2) AS
old  13: wallet_path => 'file:&sslwalletdir',
new  13: wallet_path => 'file:/opt/oracle/dcs/commonstore/wallets/ssl',
old  14: wallet_password => '&sslwalletpwd');
new  14: wallet_password => '<my_password>');

Procedure created.

old   2: &clouduser..GET_PAGE('https://objectstorage.ap-osaka-1.oraclecloud.com');
new   2: SCOTT.GET_PAGE('https://objectstorage.ap-osaka-1.oraclecloud.com');
valid response

PL/SQL procedure successfully completed.

old   1: drop procedure &clouduser..GET_PAGE
new   1: drop procedure SCOTT.GET_PAGE

Procedure dropped.

SQL>
```
スクリプトの結果、**"valid response"**が表示されるのを確認します。

これでユーザの設定が正常にされていることが確認できました。
<br>

# 10. 外部表を作成し、オブジェクト・ストレージのファイルを参照する

今回は以下のバケットに格納されているSCVファイルをBaseDBに取り込みます。
<br>

**バケット情報**
- バケット名：TutorialBucket1

- オブジェクト名：tutorial_sales.csv　※サンプルデータは**前提条件**からダウンロード可能です。

- オブジェクトの中身：
<br>

```sh
"C","CHANNEL_LONG","CHANNEL_CLASS"
S,"Direct Sales"
T,"Tele Sales","Direct"
C,"Catalog","Indirect"
I,"Internet","Indirect"
P,"Partners","Others"
```
事前にBaseDBにテーブルを作成しておきます。(ユーザ"USER1")



次にDBMS_CLOUD.CREATE_EXTERNAL_TABLEを利用し、外部表としてObject Storage上のファイルを参照・定義します。
<br>

**実行コマンド**

以下のコマンドで、DBMS_CLOUD.CREATE_EXTERNAL_TABLEを利用して、外部表としてObject Storage上のファイルを参照・定義します。

```sql
BEGIN
DBMS_CLOUD.COPY_DATA(
table_name =>'CHANNELS',
credential_name =>'<your credential name>',
file_uri_list =>'<オブジェクト・ストレージ上のファイルのパス>',
format => json_object('delimiter' value ',')
);
END;
/
```
<br>

※`<オブジェクト・ストレージ上のファイルのパス>`は「オブジェクト・ストレージ」→ 「バケットの詳細」→ 「オブジェクトの詳細」から確認できます。ファイル名までURLに含めてください。

![image](dbms-cloud09.png)
<br>

**実施例**
```sql
credential_name => 'MOMO_CRED',
file_uri_list => 'https://objectstorage.ap-osaka-1.oraclecloud.com/n/orasejapan/b/TutorialBucket1/o/ocitutorial_sales.csv',
format => json_object('delimiter' value ',' ),
column_list =>'channel_short varchar2(1),
channel_long varchar2(20),
channel_class varchar2(20)');
end;
/

PL/SQL procedure successfully completed.

SQL>
```
<br>

次に、データのロードを正常に行えるように以下のコマンドを実行します。

**実行コマンド**
```sql
 <テーブル名> REJECT LIMIT UNLIMITED;
```

`<テーブル名>`には作成した表を指定します。

**実施例**

```sql
SQL> ALTER TABLE TUTORIAL_SALES REJECT LIMIT UNLIMITED;

Table altered.

SQL>
```

最後にテーブルの中にデータが入っていることを確認します。

**実行コマンド**

```sql
SELECT * FROM <テーブル名>;
```

`<テーブル名>`には作成した表を指定します。

**実施例**

```sql
SQL> SELECT * FROM TUTORIAL_SALES;

C CHANNEL_LONG         CHANNEL_CLASS
- -------------------- --------------------
C CHANNEL_LONG         CHANNEL_CLASS
S Direct Sales         Direct
T Table Sales          Direct
C Catalog              Indirect
I Internet             Indirect
P Partners             Others</code>

6 rows selected.
```

オブジェクト・ストレージ上のファイルのデータを確認できました！

DBMS_CLOUDパッケージにはデータをBaseDBにコピーする機能もあります。
詳しくはこちらの[リンク](https://docs.oracle.com/cd/F19136_01/arpls/DBMS_CLOUD.html){:target="_blank"} をご参照ください。

以上で、この章の作業は完了です。

<br>

# 参考資料

* [マニュアル] [PL/SQLパッケージおよびタイプ・リファレンス：37 DBMS_CLOUD](https://docs.oracle.com/cd/F19136_01/arpls/DBMS_CLOUD.html#GUID-6CCC322D-26A9-47E7-8FF5-5FF23807C968){:target="_blank"} 

* [ブログ] [全てのデータベース・サービスからオブジェクト・ストレージへのアクセスを可能にするDBMS_CLOUD](https://blogs.oracle.com/oracle4engineer/post/ja-oracle-object-storage-access-for-all-oracle-databases-with-dbmscloud){:target="_blank"} 

* [MOS note] インストールガイド：How To Setup And Use DBMS_CLOUD Package (Doc ID 2748362.1)

* [MOS note] トラブルシューティング：Troubleshooting Of DBMS_CLOUD (Doc ID 2778782.1)

<br>

<br>
[ページトップへ戻る](#anchor0)
