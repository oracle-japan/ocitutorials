---
title: "402 : Database Linkによるデータ連携"
excerpt: "Database Linkを使えば、あるデータベースから別のデータベースへのアクセスが可能になります。Autonomous DatabaseにおけるDatabase Link作成手順をご紹介します。"
order: "3_402"
layout: single
header:
  teaser: "/database/adb402-database-link/DatabaseLink_teaser.jpg"
  overlay_image: "/database/adb402-database-link/DatabaseLink_teaser.jpg"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776
---
<a id="anchor0"></a>

# はじめに

従来からOracle Databaseをご利用の方にはお馴染みのDatabase Linkですが、Autonomous Database でもこのDatabase Linkをお使いいただくことが可能です。

**Database Link**は、他のOracle Database インスタンスからデータを移行・連携・収集するための便利な機能です。

   ![DatabaseLinkイメージ](DatabaseLink.jpg)

Autonomous Databaseでは以下の3つのパターンでDatabase Linkを作成いただくことができます。

本文書では2-1のパターンであるAutonomous Database（リンク元）にDatabase Linkを作成し、
他のOracle Database（リンク先）にアクセスする手順を記載します。

その後、補足と言う形でパターン1, 2-2についても記載します。

   ![DatabaseLink_optionイメージ](DatabaseLink_option.jpg)

なお、本文書ではパブリックIPアドレスを持つDBCSを前提としています。プライベートIPアドレスへのDatabase Link作成については、[こちらの記事](https://qiita.com/wahagon/items/7964b3ab19da625bfb39){:target="_blank"} で紹介しています。  
ご不明な点がございましたら、担当営業までお問い合わせください。

**目次 :**
  + [1.DBCSインスタンスの作成およびスキーマのインポート](#anchor1)
  + [2.DBCSにてTCPS認証（SSL認証）を有効化](#anchor2)
  + [3.DBCSのウォレットファイルをADBに渡す](#anchor3)
  + [4.VCNのイングレス・ルールを更新](#anchor4)
  + [5.ADBにてDatabase Linkを作成](#anchor5)
  + [6.エラーへの対応例](#anchor6)
  + [7.その他のパターン](#anchor7)
  + [8.おわりに](#anchor8)

**前提条件**
+ ADBインスタンスが構成済みであること
    <br>※ADBインタンスの作成方法については、
    [101:ADBインスタンスを作成してみよう](/ocitutorials/database/adb101-provisioning){:target="_blank"} を参照ください。

<BR>

**所要時間 :** 約100分（DBCSインスタンスの作成時間を含む）

<BR>

<a id="anchor1"></a>

# 1. DBCSインスタンスの作成およびスキーマのインポート

まず、サンプル・データベースとして、Database Linkのリンク先となるDBCSインスタンスを作成します。
[301 : 移行元となるデータベースを作成しよう](/ocitutorials/database/adb301-create-source-db/){:target="_blank"} を参考に、DBCSインスタンスを作成し、HRスキーマを作成してください。

<BR>

<a id="anchor2"></a>

# 2. DBCSにてTCPS認証（SSL認証）を有効化

Autonomous Databaseは、すべての接続でSecure Sockets Layer (SSL)と証明書ベースの認証が使用されます。そのため、DBCSにてTCPS 認証（SSL認証）を有効化する必要があります。   
サーバーとクライアントの両サイドの認証を交換したウォレットをADBに渡すことで、これを実現します。

## 2-1. ウォレット用のディレクトリの作成
1. Tera Termを利用してDBCSインスタンスに接続します。

1. opcユーザーからrootユーザーにスイッチします。
  ```sh
  sudo su - root
  ```
サーバーとクライアントの自己署名証明書を含むウォレットを作成します。

1. ウォレット用のディレクトリを作成します。
```sh
mkdir -p /u01/server/wallet
mkdir -p /u01/client/wallet
mkdir /u01/certificate
chown -R oracle:oinstall /u01/server
chown -R oracle:oinstall /u01/client
chown -R oracle:oinstall /u01/certificate
```

<br>

## 2-2. サーバーのウォレットの作成
1. oracleユーザーにスイッチします。
```sh
sudo su - oracle
```

1. ウォレットを作成します。
```sh
cd /u01/server/wallet/
orapki wallet create -wallet ./ -pwd Oracle123456 -auto_login
```
以降『2-4. 証明書の交換』まで、"Operation is successfully completed."となれば、OKです。エラーが発生する場合は、『4. サーバーのウォレットを作成します。』からやり直します。
![server_wallet_createイメージ](server_wallet_create.jpg)

1. 自己署名証明書をウォレットに追加します。
```sh
orapki wallet add -wallet ./ -pwd Oracle123456 -dn "CN=dbcs" -keysize 1024 -self_signed -validity 3650 -sign_alg sha256
```
<br>

## 2-3. クライアントのウォレットの作成
1. ウォレットを作成します。
```sh
cd /u01/client/wallet/
orapki wallet create -wallet ./ -pwd Oracle123456 -auto_login
```

1. 自己署名証明書をウォレットに追加します。
```sh
orapki wallet add -wallet ./ -pwd Oracle123456 -dn "CN=client" -keysize 1024 -self_signed -validity 3650 -sign_alg sha256
```

<br>

## 2-4. 証明書の交換
サーバーとクライアントで証明書を交換します。

1. サーバー証明書をエクスポートします。
```sh
cd /u01/server/wallet/
orapki wallet export -wallet ./ -pwd Oracle123456 -dn "CN=dbcs" -cert /tmp/server.crt
```

1. クライアント証明書をエクスポートします。
```sh
cd /u01/client/wallet/
orapki wallet export -wallet ./ -pwd Oracle123456 -dn "CN=client" -cert /tmp/client.crt
```

1. サーバーのウォレットにクライアント証明書をインポートします。
```sh
cd /u01/server/wallet/
orapki wallet add -wallet ./ -pwd Oracle123456 -trusted_cert -cert /tmp/client.crt
```

1. クライアントのウォレットにサーバー証明書をインポートします。
```sh
cd /u01/client/wallet/
orapki wallet add -wallet ./ -pwd Oracle123456 -trusted_cert -cert /tmp/server.crt
```

1. 証明書が正しくインポートされているか確認します。
```sh
orapki wallet display -wallet .
```
以下のように表示されていればOKです。
![cert_checkイメージ](cert_check.jpg)

1. サーバーのウォレットの権限を変更します。
```sh
cd /u01/server/wallet
chmod 640 cwallet.sso
```

<br>

## 2-5. ウォレット用のディレクトリの追加
サーバーのネットワークファイルに、ウォレットのディレクトリを追加します。

1. gridユーザーにスイッチします。
```sh
sudo su - grid
```

1. viでlistner.oraを開いて編集します。   
```sh
vi $ORACLE_HOME/network/admin/listener.ora
```
ウォレットのディレクトリを追加するため、以下を追記します。
```sh
wallet_location =
  (SOURCE=
    (METHOD=File)
    (METHOD_DATA=
      (DIRECTORY=/u01/server/wallet)))
```

1. 編集した内容を確認します。
```sh
cat $ORACLE_HOME/network/admin/listener.ora
```
![listener_checkイメージ](listener_check.jpg)

1. oracleユーザーにスイッチします。    
```sh
sudo su - oracle
```

1. viでsqlnet.oraを編集します。   
```sh
vi $ORACLE_HOME/network/admin/sqlnet.ora
```
ウォレットのディレクトリを追加するため、以下を追記します。 
```sh
wallet_location =
  (SOURCE=
    (METHOD=File)
    (METHOD_DATA=
      (DIRECTORY=/u01/server/wallet)))
```
また、ネットワーク暗号化に関するパラメータをコメントアウトします。   
ADBインスタンスはTCPS(SSL)による接続を前提としており、DBCS側も暗号化設定されていますが、双方で暗号化を施すことはできないために、DBCSについては暗号化関連のパラメータを無効化する必要があるためです。

1. 編集した内容を確認します。
```sh
cat $ORACLE_HOME/network/admin/sqlnet.ora
```
![sqlnet_checkイメージ](sqlnet_check.jpg)

<br>

## 2-6. TCPS接続に使用する1522番ポートを解放
今回は、1522番ポートでTCPS接続をします。しかしDBCSインスタンスでは、デフォルトで1522番ポートは開いていないため、開ける必要があります。
1. rootユーザーにスイッチします。
```sh
sudo su - root
```

1. iptablesの設定ファイルを修正します。
```sh
vi /etc/sysconfig/iptables
```
1522番ポートを開けるため、以下を追記します。
```
-A INPUT -p tcp -m state --state NEW -m tcp --dport 1522 -j ACCEPT
```

1. 編集した内容を確認します。
```sh
cat /etc/sysconfig/iptables
```
![iptables_checkイメージ](iptables_check.jpg)

1. 設定を反映させるため再起動します。
```sh
service iptables restart
```

<br>

## 2-7. リスナーにTCPSエンドポイントを追加
1. gridユーザーにスイッチします。
```sh
sudo su - grid
```

1. データベースの構成を変更します。
```sh
srvctl modify listener -p "TCPS:1522/TCP:1521"
srvctl stop listener
srvctl start listener
```

1. oracleユーザーにスイッチします。   
```sh
sudo su - oracle
```

1. データベースを再起動します。   
```sh
srvctl stop database -database dbcs01_xxxxxx
srvctl start database -database dbcs01_xxxxxx
```
データベース名(dbcs01_xxxxxx)の確認の仕方
+ OCIコンソールのDBCSの詳細画面より、一意のデータベース名を確認
![database_nameイメージ](database_name.png)
+ 次の手順のlsnrctl statusコマンドから確認

1. gridユーザーにスイッチします。   
```sh
sudo su - grid
```

1. リスナーのステータスを確認します。   
```sh
lsnrctl status
```
以下のように表示されていれば、OKです。

```sh
LSNRCTL for Linux: Version 19.0.0.0.0 - Production on 30-AUG-2021 07:54:11

Copyright (c) 1991, 2021, Oracle.  All rights reserved.

Connecting to (DESCRIPTION=(ADDRESS=(PROTOCOL=IPC)(KEY=LISTENER)))
STATUS of the LISTENER
------------------------
Alias                     LISTENER
Version                   TNSLSNR for Linux: Version 19.0.0.0.0 - Production
Start Date                30-AUG-2021 07:51:41
Uptime                    0 days 0 hr. 2 min. 29 sec
Trace Level               off
Security                  ON: Local OS Authentication
SNMP                      OFF
Listener Parameter File   /u01/app/19.0.0.0/grid/network/admin/listener.ora
Listener Log File         /u01/app/grid/diag/tnslsnr/dbcs01/listener/alert/log.xml
Listening Endpoints Summary...
(DESCRIPTION=(ADDRESS=(PROTOCOL=ipc)(KEY=LISTENER)))
(DESCRIPTION=(ADDRESS=(PROTOCOL=tcps)(HOST=10.0.0.245)(PORT=1522)))
(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=10.0.0.245)(PORT=1521)))
Services Summary...
Service "+APX" has 1 instance(s).
Instance "+APX1", status READY, has 1 handler(s) for this service...
Service "+ASM" has 1 instance(s).
Instance "+ASM1", status READY, has 1 handler(s) for this service...
Service "+ASM_DATA" has 1 instance(s).
Instance "+ASM1", status READY, has 1 handler(s) for this service...
Service "+ASM_RECO" has 1 instance(s).
Instance "+ASM1", status READY, has 1 handler(s) for this service...
Service "c179c0f9cc256c64e053be08640af527.subnet.vcn.oraclevcn.com" has 1 instance(s).
Instance "dbcs01", status READY, has 2 handler(s) for this service...
Service "cabf7fdf10f1362be053f500000ab09c.subnet.vcn.oraclevcn.com" has 1 instance(s).
Instance "dbcs01", status READY, has 2 handler(s) for this service...
Service "dbcs01XDB.subnet.vcn.oraclevcn.com" has 1 instance(s).
Instance "dbcs01", status READY, has 1 handler(s) for this service...
Service "dbcs01_nrt18s.subnet.vcn.oraclevcn.com" has 1 instance(s).
Instance "dbcs01", status READY, has 2 handler(s) for this service...
Service "pdb1.subnet.vcn.oraclevcn.com" has 1 instance(s).
Instance "dbcs01", status READY, has 2 handler(s) for this service...
The command completed successfully
```    

<br>

<a id="anchor3"></a>

# 3. DBCSのウォレットファイルをADBに渡す

## 3-1. ウォレットのダウンロード
/u01/client/walletにあるクライアントのウォレットcwallet.ssoを、ローカルにダウンロードします。

1. oracleユーザーにスイッチします。
```sh
sudo su - oracle
```

1. ウォレットを/tmpにコピーし、その他のユーザーに読み取りの権限を付与します。   
```sh
cp /u01/client/wallet/cwallet.sso /tmp/.
chmod 604 /tmp/cwallet.sso
```

1. WinSCPといった任意のファイル転送ツールを利用し、ウォレットをローカルにダウンロードします。

<br>

## 3-2. Object Storageへのウォレットのアップロード

[102:ADBにデータをロードしよう(Database Actions)](/ocitutorials/database/adb102-dataload/){:target="_blank"}の「2.OCIオブジェクトストレージへのデータアップロード」を参考に、ダウンロードしたウォレットをObject Storageにアップロードします。

<br>

## 3-3. ADBへのウォレットの配置
1. データベース・アクションでウォレット配置用のディレクトリ・オブジェクトを作成します。
```
CREATE DIRECTORY dblink_wallet_dir_dbcs AS 'walletdir';
```

1. クレデンシャル情報を登録します。
```
BEGIN
  DBMS_CLOUD.CREATE_CREDENTIAL(
  credential_name => 'WORKSHOP_CREDENTIAL',
  username => 'xxx@xxxx.com',
  password => 'xxxxxx');
END;
/
```
* credential_name: データベースに保存した認証情報を識別するための名前、任意
* username: Oracle Object Storageにアクセスするためのユーザー名
* password: 認証トークン
ユーザー名、認証トークンの生成については、[102:ADBにデータをロードしよう(Database Actions)](/ocitutorials/database/adb102-dataload/){:target="_blank"}の「1.OCIオブジェクトストレージへのアクセス情報を取得」を参考にしてください。

1. Object Storageにアップロードしたウォレットをディレクトリ・オブジェクトに配置します。
```
BEGIN
  DBMS_CLOUD.GET_OBJECT(
  credential_name => 'WORKSHOP_CREDENTIAL',
  object_uri => 'https://objectstorage.<region>.oraclecloud.com/n/<namespace>/b/<bucket>/o/cwallet.sso',
  directory_name => 'dblink_wallet_dir_dbcs');
END;
/
```
object_uri: Object StorageにアップロードしたファイルのURL(< region >、< namespace >、< bucket >は実際の値に置き換えて下さい)
>  （補足）
> - オブジェクトが見つからないエラー（ORA-20404: Object not found）が出る場合、オブジェクトストレージ上のバケットを一時的にPublic にして試してください。
> - 作成済みのクレデンシャル情報を削除する場合は以下を実行ください。
```
BEGIN  
  DBMS_CLOUD.DROP_CREDENTIAL(credential_name => 'WORKSHOP_CREDENTIAL');
END;
/
```

1. 配置したウォレットを確認します。
```
SELECT * FROM table(dbms_cloud.list_files('dblink_wallet_dir_dbcs')) WHERE object_name LIKE '%.sso';
```
![wallet_checkイメージ](wallet_check.png)

<BR>

<a id="anchor4"></a>

# 4. VCNのイングレス・ルールの追加
1522番ポートを使用するようにしましたが、デフォルトでは許可されていません。そのためイングレス・ルールを追加する必要があります。  
DBCSを配置したパブリック・サブネットのセキュリティ・リストのイングレス・ルールに以下を追加します。
![ingress_ruleイメージ](ingress_rule.png)
+ ソース：VCNのCIDRブロック
+ IPプロトコル：TCP
+ ソース・ポート範囲：All
+ 宛先ポート範囲：1522

<BR>

<a id="anchor5"></a>

# 5. ADBにてDatabase Linkを作成

1. DBCSへ接続するためのクレデンシャルを作成します。
```
BEGIN
 DBMS_CLOUD.CREATE_CREDENTIAL(
 credential_name => 'DBCS_DB_LINK_CRED',
 username => 'HR',
 password => 'WelCome123#123#'
 );
END;
/
```
**※ usernameは大文字'HR'で指定してください。**

1. 新規 Database Linkを作成します。
```
BEGIN
 DBMS_CLOUD_ADMIN.CREATE_DATABASE_LINK(
 db_link_name => 'HR_LINK',
 hostname => 'xxx.xxx.xxx.xxx',
 port => '1522',
 service_name => '<pdb1>.<subnet>.<vcn>.oraclevcn.com',
 ssl_server_cert_dn => 'CN=dbcs',
 credential_name => 'DBCS_DB_LINK_CRED',
 directory_name => 'dblink_wallet_dir_dbcs');
END;
/
```
* hostname: DBCSインスタンスのパブリックIPアドレス  
* service_name: tnsnames.oraに記載されているPDB1のサービス名

1. Database Linkを使用して、DBCSのテーブルを参照します。
```
SELECT * FROM COUNTRIES@HR_LINK;
```
正しく実行されると、以下のような結果が表示されます。
HRスキーマのCOUNTRIES表にアクセスできていることがわかります。
![dblink_resultイメージ](dblink_result.png)
※ Database Linkを誤って作成した場合は、こちらのコマンドを実行します。
```
execute DBMS_CLOUD_ADMIN.DROP_DATABASE_LINK(db_link_name => 'HR_LINK');
```
<BR>

以上で、この章の作業は終了です。

<BR>

<a id="anchor6"></a>

# エラーへの対応例
* 『ORA-12545: Connect failed because target host or object does not exist』が発生する場合

  DBMS_CLOUD_ADMIN.CREATE_DATABASE_LINKにて指定するオプションに誤りがないか確認します。

* 『ORA-28860: Fatal SSL error』が発生する場合

  ウォレットの再作成を行います。

* 『ORA-28864: SSL connection closed gracefully』が発生する場合

  gridユーザーのlistener.oraに、オプション「wallet_location」があることを確認します。

* 『ORA-28865: SSL connection closed』が発生する場合

  oracleユーザーのsqlnet.oraに、オプション「wallet_location」があることを確認します。  
  また、オプション「SQLNET.ENCRYPTION_SERVER=REQUIRED」「SQLNET.ENCRYPTION_CLIENT=REQUIRED」がコメントアウトされていることを確認します。

* 『ORA-01017: invalid username/password; logon denied ORA-02063: preceding line from HR_LINK』が発生する場合

  DBCSへ接続するためのクレデンシャル作成の際に指定するオプション、usernameが大文字'HR'になっていることを確認します。

※ 上記は代表的なもののみを記載しており、全てのエラーを網羅しているものではありません。必要に応じてサポート・サービスもご活用ください。

<BR>

<a id="anchor7"></a>

# その他のパターン
ここまで、ADBからDBCSインスタンスへのDatabase Link作成方法についてご説明しました。  
『はじめに』でも記載した通り、その他にもADBでDatabase Linkを使用できるパターンがあります。

* 2つのADB間のDatabase Linkによる連携

  リンク元：ADB1、リンク先：ADB2とした場合、以下の手順で連携させることができます。

1. ADB2のCredential.zipをダウンロード

1. ADB1のバケットにcwallet.sso（ウォレット・ファイル）をアップロード

    ここからは、[3. DBCSのウォレットファイルをADBに渡す](#anchor3)の『手順3:Object StorageにアップロードしたWalletをADBのディレクトリ・オブジェクトに配置します。』以降の操作と同様になります。

    詳細は『Autonomous Database Cloud 技術詳細』の「Database Linkによるデータ連携」の章でご確認ください。

<BR>

* DBCSインスタンスからADBへのDatabase Linkによる連携

  別のOracle DatabaseからAutonomous Databaseへのデータベース・リンクを作成できます。詳細な手順については、
[こちら](https://docs.oracle.com/cd/E83857_01/paas/autonomous-database/adbsa/database-links-inbound.html#GUID-EB369724-29CE-452E-8EC1-2E0B33AE0A49){:target="_blank"} を参照ください。

<BR>

<a id="anchor8"></a>

# おわりに
ここではAutonomous DatabaseにDatabase Linkを作成して、別のDBCSインスタンスからデータを収集する方法をご紹介しました。  
複数の異なるデータベースにアクセスする際には非常に便利ですので、ぜひ活用してみてください。

<BR/>

# 参考資料

* [Autonomous Database Cloud 技術詳細](https://speakerdeck.com/oracle4engineer/autonomous-database-cloud-ji-shu-xiang-xi){:target="_blank"}

<BR/>
以上でこの章は終了です。次の章にお進みください。

<BR>

[ページトップへ戻る](#anchor0)