---
title: "306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行"
excerpt: "OCI Database Migration Serviceのオンライン移行に必要な事前設定、移行の作成、検証、実行、そして確認作業までの一連の作業を紹介します。"
order: "3_306"
layout: single
header:
  teaser: "/adb/adb306-database-migration-prep/teaser.png"
  overlay_image: "/adb/adb306-database-migration-online/teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=797
---
<a id="anchor0"></a>

# はじめに
**Oracle Cloud Infrastructure Database Migration Service (DMS)** は、オンプレミスまたはOCI上のOracle DatabaseからAutonomous Databaseに移行する際に利用できるマネージド・サービスです。エンタープライズ向けの強力なオラクル・ツール(Zero Downtime Migration、GoldenGate、Data Pump)をベースとしています。

DMSでは下記の2つの論理的移行が可能です。
+ **オフライン移行** - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されます。移行中のソース・データベースへの変更はコピーされないため、移行中はアプリケーションをオフラインのままにする必要があります。
+ **オンライン移行** - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されるのに加え、内部的にOracle GoldenGateによるレプリケーションを利用しているため、移行中のソース・データベースへの変更も全てコピーされます。そのため、アプリケーションをオンラインのまま移行を行うことが可能で、移行に伴うアプリケーションのダウンタイムを極小化することができます。

DMSに関するチュートリアルは[304 : OCI Database Migration Serviceを使用したデータベース移行の前準備](/ocitutorials/adb/adb304-database-migration-prep)、[305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行](/ocitutorials/adb/adb305-database-migration-offline)、[306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行](/ocitutorials/adb/adb306-database-migration-online)の計3章を含めた3部構成となっています。
DMSを使用してBaseDBで作成したソース・データベースからADBのターゲット・データベースにデータ移行を行います。

[305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行](/ocitutorials/adb/adb305-database-migration-offline)または[306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行](/ocitutorials/adb/adb306-database-migration-online)を実施する前に必ず[304 : OCI Database Migration Serviceを使用したデータベース移行の前準備](/ocitutorials/adb/adb304-database-migration-prep)を実施するようにしてください。

この章では、DMSを使用したデータベースのオンライン移行について紹介します。

![](2022-03-24-09-40-50.png)

**目次 :**
  + [1. Oracle GoldenGate Microservicesのインストール](#anchor1)
  + [2. Oracle Goldengate Microservicesインスタンスの設定](#anchor2)
  + [3. ソース・データベースの設定](#anchor3)
  + [4. ターゲット・データベースの設定](#anchor4)
  + [5. 移行の作成](#anchor5)
  + [6. 移行の検証](#anchor6)
  + [7. 初期移行](#anchor7)
  + [8. Oracle GoldenGateのレプリケーションの検証](#anchor8)
  + [9. スイッチオーバー](#anchor9)
  + [10. クリーンアップ](#anchor10)


**前提条件 :**
+ [「304 : OCI Database Migration Serviceを使用したデータベース移行の前準備」](/ocitutorials/adb/adb304-database-migration-prep)を参考に、データベース移行の前準備が完了していること。
+ オンライン移行を実行する場合、Oracle GoldenGateの必須パッチ、推奨パッチが適用されている必要があります。Oracle Database 11g(11.2.0.4)用の必須パッチ、推奨パッチに関するドキュメント[「Oracle GoldenGate -- Oracle RDBMS Server Recommended Patches (Doc ID 1557031.1)」](https://mosemp.us.oracle.com/epmos/faces/DocumentDisplay?_afrLoop=171610622943228&id=1557031.1&_afrWindowMode=0&_adf.ctrl-state=ysobl98cz_4)および、Oracle Datbase 12c以降のバージョンの必須パッチ、推奨パッチに関するドキュメント[「Latest GoldenGate/Database (OGG/RDBMS) Patch recommendations (Doc ID 2193391.1)」](https://support.oracle.com/epmos/faces/DocumentDisplay?_afrLoop=168484936828414&parent=DOCUMENT&sourceId=1557031.1&id=2193391.1&_afrWindowMode=0&_adf.ctrl-state=4xfa5h2e8_4)を参考に適宜パッチの確認と適用を実施してください。
+ ターゲット・データベースのタイムゾーン・バージョンがソース・データベースのタイムゾーン・バージョンよりも最新になっていることを確認する(SELECT * FROM V$TIMEZONE_FILE;)。ターゲット・データベースのタイムゾーン・バージョンの方が古い場合はSRをあげる必要があります。

**所要時間 :** 約40分

<BR>

<a id="anchor1"></a>

# 1. Oracle GoldenGate Microservicesのインストール

1. OCIコンソール・メニューから **マーケットプレイス** → **マーケットプレイス** に移動します。

    ![](2022-03-10-12-06-33.png)

2. 検索バーに **Oracle GoldenGate** と入力し、**Oracle GoldenGate for Oracle - Database Migrations** をクリックします。

    ![](2022-03-10-12-09-38.png)

3. 任意の **バージョン** と **コンパートメント** を選択し、**Oracle使用条件を確認した上でこれに同意します。** にチェックを付け、**スタックの起動** をクリックします。

    ![](2022-03-10-12-12-22.png)

4. **スタック情報** の各項目は以下のように設定します。その他の設定はデフォルトのままにします。
    + **名前** - 任意 
  
    設定後、**次** をクリックします。

    ![](2022-03-10-12-17-46.png)

    <a id="anchor21"></a>

5. **変数の構成** の各項目は以下のように設定します。
    + **Name for New Resources** -
      + **Display Name** - 任意
      + **Host DNS Name** - デフォルト
    + **Network Settings** -
      + **VCN Network Compartment** - 使用したいVCNが配置されているコンパートメントを選択します。
      + **VCN** - 使用したいVCNを選択します。
      + **Subnet Network Compartment** - 使用したいサブネットが配置されているコンパートメントを選択します。
      + **Subnet** - 使用したいサブネットを選択します。（本チュートリアルではパブリック・サブネットを選択します。）
    + **Instance Settings**
      + **Availability Domain** - インスタンスを配置するADを選択します。
      + **Compute Shape** - インスタンスのコンピュート・シェイプを選択します。
      + **Assign Public IP** にチェックを付けます。
    + **Create OGG Deployments**
      + **Deployment 1 - Name** - 任意
      + **Deployment 1 - Database** - ソース・データベースと同じデータベースのバージョンを選択します。
      + **Deployment 2 - Name** - 任意
      + **Deployment 2 - Database** - ターゲット・データベースと同じデータベースのバージョンを選択します。
      + **Deployment 2 - Autonomous Database** にチェックを付けます。
      + **Deployment 2 - Autonomous Database Compartment** - ターゲットADBが配置されているコンパートメントを選択します。
      + **Deployment 2 - Autonomous Database Instance** - ターゲット・データベースのインスタンスを選択します。
    + **Shell Access**
      + **SSH Public Key** - ssh公開鍵を貼り付けます。

    設定後、**次**をクリックします。

    ![](2022-03-10-12-21-13.png)

    ![](2022-03-10-12-22-41.png)

    ![](2022-03-10-12-25-34.png)

6. **確認** 画面で全ての項目が正しく設定できているか確認します。

   確認後、**作成されたスタックで適用を実行しますか。** の **適用の実行** にチェックを付け、**作成** をクリックします。

    ![](2022-03-10-12-30-31.png)

<BR>

<a id="anchor2"></a>

# 2. Oracle GoldenGate Microservicesの設定

1. OCIコンソール・メニューから **コンピュート** → **インスタンス** に移動します。

    ![](2022-03-10-12-32-13.png)

2. Oracle Goldengate Microservicesインスタンスが作成されていることを確認し、Tera Termなどのsshクライアントでインスタンスに接続します。

    ![](2022-03-10-12-34-39.png)

3. TLS認証用の証明書を含むウォレットが `/u02/deployments/deployment_name/etc/adb` ディレクトリに配置されていることを確認します。（deployment_nameは[1. Oracle GoldenGate Microservicesのインストールの5.](#anchor21)で設定したターゲット・データベースのデプロイメント名です。）

   例：

   コマンド
    ```
    cd /u02/deployments/Target/etc/adb
    ls
    ```

    実行結果

    ![](2022-03-10-12-35-55.png)

    lsコマンドで、上の例のようなファイルが存在していればOKです。

4. Oracle Goldengate Microservicesインスタンスの`/home/opc/`ディレクトリにあるoggadminユーザとそのパスワード資格証明を表示して、コピーしてメモ帳に貼り付けます。

    ```
    cat /home/opc/ogg-credentials.json
    ```

    <BR>

    ※ ***パスワードを変更**したい場合は下記の5.~17.の手順に従って変更をしてください。デフォルトのままでもよい場合はスキップしても構いません。*

    <BR>

5. ブラウザのアドレスバーに以下の情報を入力し、Enterキーを押します。（public_IP_addressはOracle Goldengate MicroservicesインスタンスのパブリックIPアドレスです。）

    ```
    https://<public_IP_address>
    ```

6. **Oracle GoldenGate Service Manager** にログインします。（User NameとPasswordは4.でコピーしたデフォルトのものを使用します。）

    ![](2022-03-10-12-39-25.png)

    ![](2022-03-10-12-40-58.png)

7. 左上のハンバーガー・メニューをクリックし、**Administrator** をクリックします。

    ![](2022-03-10-12-42-46.png)

8. **oggadmin** の **Action** の鉛筆のアイコンをクリックします。

    ![](2022-03-10-12-43-54.png)

9. 新規パスワードを設定し、**Submit** をクリックします。（パスワードは任意のもので構いません。）

    ![](2022-03-10-12-46-00.png)

10. パスワード変更が成功すると **Success** ダイアログが表示されます。**OK** をクリックしてサインアウトします。設定したパスワードを使用してログインします。

    ![](2022-03-10-12-49-04.png)

    ![](2022-03-10-12-39-25.png)

11. **Services** の一覧にあるソース・データベースの **Deployment** の **Administration Server** の **Port** 番号をクリックします。

    ![](2022-03-10-12-53-49.png)

12. **Oracle GoldenGate Administration Server** にログインします。（usernameとPasswordは4.でコピーしたデフォルトのものを使用します。）

    ![](2022-03-10-12-55-00.png)

    ![](2022-03-10-12-56-42.png)

13. 左上のハンバーガー・メニューをクリックし、**Administrator** をクリックします。

    ![](2022-03-10-12-57-47.png)

14. **oggadmin** の **Action** の鉛筆のアイコンをクリックします。

    ![](2022-03-10-12-58-47.png)

15. 新規パスワードを設定し、**Submit** をクリックします。（パスワードは任意のもので構いません。）

    ![](2022-03-10-13-00-51.png)

16. パスワード変更が成功すると **Success** ダイアログが表示されます。**OK** をクリックしてサインアウトします。設定したパスワードを使用してログインします。

    ![](2022-03-10-12-49-04.png)

    ![](2022-03-10-12-55-00.png)

17. **Oracle GoldenGate Service Manager** に戻り、11.~16.と同様の手順でターゲット・データベースの **Deployment** のAdministration Serverのパスワードを変更します。

<BR>

<a id="anchor3"></a>

# 3. ソース・データベースの設定

BaseDBにあるソース・データベースに対して以下の設定を行います。2.~5.の設定は全てCDB上で行います。

<a id="anchor22"></a>

1. GoldenGate管理者ユーザの作成

    ソース・データベースにGG管理者ユーザを作成し、必要な権限を付与します。マルチテナント構成の場合、PDBとCDB rootのそれぞれにGG管理者ユーザを作成する必要があります。
    Tera Termなどのsshクライアントでソース・データベースに接続して以下を実行してください。

    oracleユーザに切り替えます。

    ```
    sudo su oracle
    ```

    sysユーザでSQL*Plusに接続します。

    ```
    sqlplus / as sysdba
    ```

    CDB rootでGG管理者ユーザc##ggadminを作成し、必要な権限を付与します。（passwordに任意のパスワードを入力します。）

    ```sql
    CREATE USER c##ggadmin IDENTIFIED BY <password> DEFAULT TABLESPACE users TEMPORARY TABLESPACE temp;
    ALTER USER c##ggadmin QUOTA 100M ON USERS;
    GRANT UNLIMITED TABLESPACE TO c##ggadmin;
    GRANT CONNECT, RESOURCE TO c##ggadmin container=all;
    GRANT SELECT ANY DICTIONARY TO C##GGADMIN container=all;
    GRANT CREATE VIEW TO C##GGADMIN container=all;
    GRANT EXECUTE ON dbms_lock TO c##ggadmin container=all;
    EXEC dbms_goldengate_auth.GRANT_ADMIN_PRIVILEGE('c##ggadmin',container=>'all');
    ```

    PDBに接続します。

    ```sql
    alter session set container = PDB;
    ```

    PDBでGG管理者ユーザggadminを作成し、必要な権限を付与します。（passwordに任意のパスワードを入力します。）

    ```sql
    CREATE USER ggadmin IDENTIFIED BY <password> DEFAULT TABLESPACE users TEMPORARY TABLESPACE temp;
    ALTER USER ggadmin QUOTA 100M ON USERS;
    GRANT UNLIMITED TABLESPACE TO ggadmin;
    GRANT CONNECT, RESOURCE TO ggadmin;
    GRANT SELECT ANY DICTIONARY TO GGADMIN;
    GRANT CREATE VIEW TO GGADMIN;
    GRANT EXECUTE ON dbms_lock TO ggadmin;
    EXEC dbms_goldengate_auth.GRANT_ADMIN_PRIVILEGE('ggadmin');
    ```


2. GLOBAL_NAMESパラメータの設定

    GLOBAL_NAMESパラメータがfalseに設定されていることを確認します。SQL*Plusで以下を実行します。

    ```sql
    show parameter global
    ```

    trueに設定されている場合、以下を実行して変更します。

    ```sql
    ALTER SYSTEM SET GLOBAL_NAMES=false;
    ```

3. ARCHIVELOGの設定

    ARCHIVELOGを有効にする必要があります。
    
    ARCHIVELOGが有効になっているか確認します。SQL*Plusで以下を実行します。

    ```sql
    ARCHIVE LOG LIST
    ```

    返される出力例：

    ```sql
    Database log mode Archive log Mode
    Automatic archival Enabled
    Archive destination USE_DB_RECOVERY_FILE_DEST
    Oldest online log sequence 33
    Next log sequence to archive 35
    Current log sequence 35
    ```

    無効(Disabled)の場合、以下を実行して有効にします。

    ```sql
    SHUTDOWN IMMEDIATE
    STARTUP MOUNT
    ALTER DATABASE archivelog;
    ALTER DATABASE open;
    ```

4. ロギングの設定

    ロギングを有効にする必要があります。

    ロギングが有効になっているか確認します。SQL*Plusで以下を実行します。

    ```sql
    SELECT supplemental_log_data_min, force_logging FROM v$database;
    ```

    無効の場合、以下を実行して有効にします。

    ```sql
    ALTER DATABASE ADD SUPPLEMENTAL LOG DATA;
    ALTER DATABASE FORCE LOGGING;
    ```

5. GoldenGateレプリケーションの設定

    GoldenGateレプリケーションを有効にします。SQL*Plusで以下を実行します。

    ```sql
    ALTER SYSTEM SET ENABLE_GOLDENGATE_REPLICATION=TRUE SCOPE=BOTH;
    ```

    <a id="anchor24"></a>

6. ソース・データベースへのサンプル・データの追加

    PDB上のスキーマに接続します。スキーマがない場合は検証用のスキーマを作成してください。また、[305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行](/ocitutorials/adb/adb305-database-migration-offline)のチュートリアルを実施済みの場合、使用したスキーマとは別のスキーマを使用してください。SQL*Plusを利用する場合は、以下のようにホスト名、ポート番号、サービス名を指定します。

    例：（$ sqlplus <スキーマ名>/<パスワード>@<ホスト名>:<ポート>/<サービス名>）

    ```
    sqlplus testuser2/WelCome123#123#@dbcs01.subnet.vcn.oraclevcn.com:1521/pdb1.subnet.vcn.oraclevcn.com
    ```

    サンプル・データを追加します。

    ```sql
    CREATE TABLE PERSONS (
        PersonID int,
        LastName varchar(255),
        FirstName varchar(255),
        Address varchar(255),
        City varchar(255)
    );
    
    INSERT INTO PERSONS (PersonID, LastName, FirstName, Address, City) Values ('1', 'Brady', 'Josh', '456way', 'Dallas');

    commit;
    ```

    ```sql
    exit;
    ```

<BR>

<a id="anchor4"></a>

# 4. ターゲット・データベースの設定

1. OCIコンソール・メニューから **コンピュート** → **インスタンス** に移動します。

    ![](2022-03-10-12-32-13.png)

2. Oracle Goldengate MicroservicesインスタンスにTera Termなどのsshクライアントで接続します。

    ![](2022-03-10-12-34-39.png)

3. 環境変数TNS_ADMINとORACLE_HOMEを設定します。（depoyment_nameは[1. Oracle GoldenGate Microservicesのインストールの5.](#anchor21)で設定したターゲット・データベースのデプロイメント名です。）

    ```
    export TNS_ADMIN=/u02/deployments/deployment_name/etc
    export ORACLE_HOME=/u01/app/client/oracle19
    ```

4. adminとしてターゲット・データベースに接続します。（ADW_passwordはADWの管理者パスワードです。ADW_nameは`/u02/deployments/Target/etc`ディレクトリにあるtnsnames.oraで確認できます（例：targetatp1_high）。）

    ```
    $ORACLE_HOME/bin/sqlplus admin/ADW_password@ADW_name
    ```

    <a id="anchor23"></a>

5. GoldenGate管理者ユーザ（ggadmin）のロックを解除します。（ggadmin_passwordは任意）

    ```sql
    ALTER USER ggadmin IDENTIFIED BY ggadmin_password ACCOUNT UNLOCK;
    ```

6. ggadminにログインしてロックが解除されていることを確認します。

    ```
    $ORACLE_HOME/bin/sqlplus ggadmin/ADW_password@ADW_name
    ```

7. GLOBAL_NAMESパラメータの設定
    
    adminとしてターゲットデータベースに接続します。

    ```
    $ORACLE_HOME/bin/sqlplus admin/ADW_password@ADW_name
    ```

    GLOBAL_NAMESパラメータがfalseに設定されていることを確認します。

    ```sql
    show parameter global
    ```

    trueに設定されている場合、以下を実行して変更します。

    ```sql
    ALTER SYSTEM SET GLOBAL_NAMES=false;
    ```

    ```sql
    exit
    ```

<BR>

<a id="anchor5"></a>

# 5. 移行の作成

1. OCIコンソール・メニューから **移行** → **移行** に移動します。

    ![](2022-03-10-13-12-43.png)

2. **移行の作成** を選択します。

    ![](2022-03-10-13-13-01.png)

3. **詳細の追加** の各項目は以下のように設定します。その他の入力項目はデフォルトのままにします。
    + **名前** - 任意 ※名前にスペースを含めると移行の作成に失敗します。
    + **ボールト** - **登録済みデータベース** に登録されているボールトを選択します。
    + **暗号化キー** - **登録済みデータベース** に登録されている暗号化キーを選択します。
  
    設定後、**次** をクリックします。

    ![](2022-03-10-13-15-20.png)

4. **データベースの選択** の各項目は以下のように設定します。
    + **ソース・データベース** - 登録済みのソース・データベース（PDB）を選択します。
    + **データベースはプラガブル・データベース(PDB)です** にチェックを付けます。
    + **登録済みコンテナ・データベース** - 登録済みのソース・データベース（CDB）を選択します。
    + **ターゲット・データベース** - 登録済みのターゲット・データベースを選択します。
  
    設定後、**次** をクリックします。

    ![](2022-03-10-13-18-31.png)

5. **移行オプション** の各項目は以下のように設定します。
    + **初期ロード** - オブジェクト・ストレージ経由のデータポンプを選択します。
    + **オブジェクト・ストレージ・バケット** - 使用したいオブジェクト・ストレージ・バケットを選択します。
    + **ディレクトリ・オブジェクトのエクスポート** - 
        + 名前 - 任意
        + パス - 任意
    + **オンライン・レプリケーションの使用** にチェックを付けます。
    + **GoldenGateハブURL** - https://<Oracle GoldenGate MicroservicesインスタンスのパブリックIPアドレス>
    + **GoldenGate管理者ユーザー名** - [2. Oracle Goldengate Microservicesインスタンスの設定](#anchor2)で設定したユーザー名（デフォルトはoggadmin）
    + **GoldenGate管理者パスワード** - [2. Oracle Goldengate Microservicesインスタンスの設定](#anchor2)で設定したパスワード（デフォルトは `/home/opc/ogg-credentials.json`を参照）
    + **GoldenGateデプロイメント名** - [1. Oracle GoldenGate Microservicesのインストールの5.](#anchor21)で設定したソース・データベースのデプロイメント名
    + **データベース・ユーザー名** - [3. ソース・データベースの設定の1.](#anchor22)で作成したPDBのGoldenGate管理者ユーザー名
    + **データベース・パスワード** - [3. ソース・データベースの設定の1.](#anchor22)で作成したPDBのGoldenGate管理者パスワード
    + **コンテナ・データベース・ユーザー名** - [3. ソース・データベースの設定の1.](#anchor22)で作成したCDBのGoldenGate管理者ユーザー名
    + **コンテナ・データベース・パスワード** - [3. ソース・データベースの設定の1.](#anchor22)で作成したCDBのGoldenGate管理者パスワード
    + **GoldenGateデプロイメント名** - [1. Oracle GoldenGate Microservicesのインストールの5.](#anchor21)で設定したターゲット・データベースのデプロイメント名
    + **データベース・ユーザー名** - ggadmin
    + **データベース・パスワード** - [4. ターゲット・データベースの設定の5.](#anchor23)で設定したADBのGoldenGate管理者パスワード

    設定後、**作成** をクリックします。

    ![](2022-03-10-13-24-44.png)

    ![](2022-03-10-13-26-47.png)

6. 作成した移行の状態が **アクティブ** になるまで待ちます。（3分ほどかかります。）

    ![](2022-03-10-13-27-56.png)

    これで移行の作成は完了です。

<BR>

<a id="anchor6"></a>

# 6. 移行の検証

1. OCIコンソール・メニューから **移行** → **移行** に移動します。

    ![](2022-03-10-13-12-43.png)

2. 検証する移行の名前をクリックします。（[5. 移行の作成](#anchor5)で作成した移行）

    ![](2022-03-10-13-29-48.png)

3. **検証** ボタンをクリックすると **移行の検証** ダイアログが表示されます。 **検証** をクリックします。

    ![](2022-03-10-13-35-03.png)

    ![](2022-03-10-13-35-31.png)

4. **リソース** の一覧にある **ジョブ** をクリックし、実行中のジョブの名前をクリックします。

    ![](2022-03-10-13-36-13.png)

5. **リソース** の一覧にある **フェーズ** をクリックします。ここで実行中の検証のフェーズが確認できます。

    ![](2022-03-10-13-36-56.png)

6. 検証が失敗した場合、**フェーズ** の **ステータス** に**失敗** と表示されます。その場合、 **ログのダウンロード** ボタンをクリックしてログを参照することで、失敗の詳細を確認することができます。もう一度実行したい場合は、 **中断** ボタンをクリックして検証を再度やり直してください。

    ![](2022-03-10-13-40-05.png)

    **移行前アドバイザの検証** で失敗した場合、**フェーズ** の **移行前アドバイザの検証** をクリックし、**アドバイザ・レポートのダウンロード** をクリックすることでCPAT (Cloud Premigration Advisor Tool)の結果を閲覧することができます。

    CPATには次のような利点があります。
    + ターゲット環境でサポートされていないデータベースで使用されている機能について警告します。
    + データ・ポンプのエクスポートおよびインポート操作に使用する修復変更やパラメータ(あるいはその両方)に関する提案を作成します。

    詳細については、[Oracle Cloud Infrastructure Database移行サービスの使用 - 4 移行の管理 - 検証オプションの構成](https://docs.oracle.com/cd/E83857_01/paas/database-migration/dmsus/managing-migrations.html#GUID-585B1102-DD5C-4E23-BB88-C2B14A090003) をご参照ください。

    ![](2022-03-10-13-40-22.png)

    ![](2022-03-10-13-40-33.png)

7. 全ての **フェーズ** の **ステータス** が **完了済** と表示されたら、移行の検証は完了です。

    ![](2022-03-10-13-41-18.png)

<BR>

<a id="anchor7"></a>

# 7. 初期移行の実行

1. OCIコンソール・メニューから **移行** → **移行** に移動します。

    ![](2022-03-10-13-12-43.png)

2. 実行する移行の名前をクリックします。（[5. 移行の作成](#anchor5)で作成した移行）

    ![](2022-03-10-13-29-48.png)

3. **起動** ボタンをクリックします。

    ![](2022-03-10-13-43-39.png)

4. **移行の開始** ダイアログが表示されます。**続行する前にフェーズ後にユーザー入力が必要** にチェックを付けると、選択したフェーズの後に一時停止をするように設定できます。チェックを付けて、**レプリケーション・ラグのモニター** を選択します。

    ![](2022-03-10-13-46-37.png)

    このフェーズの後に停止させることによって[8. Oracle GoldenGateのレプリケーションの検証](#anchor8)で行うOracle GoldenGateによるデータの伝播を確認することができます。以下の処理まで実行されます。

    + 移行に使用されるソース・データベース、ターゲット・データベース、GoldenGate、データ・ポンプのそれぞれの検証と準備
    + オブジェクト・ストレージとデータ・ポンプを使用したデータのエクスポートとインポート
    + Oracle GoldenGateのレプリケーションの開始

    選択後、**起動** をクリックします。

    ![](2022-03-10-13-47-46.png)

5. **リソース** の一覧にある **ジョブ** をクリックし、実行中のジョブの名前をクリックします。

    ![](2022-03-10-13-48-29.png)

6. **リソース** の一覧にある **フェーズ** をクリックします。ここで実行中の移行のフェーズが確認できます。

    ![](2022-03-10-13-49-21.png)

7. 移行が失敗した場合、**フェーズ** の **ステータス** に**失敗** と表示されます。その場合、 **ログのダウンロード** ボタンをクリックしてログを参照することで、失敗の詳細を確認することができます。もう一度実行したい場合は、 **中断** ボタンをクリックして移行を再度やり直してください。

    ![](2022-03-10-13-50-12.png)

8. **レプリケーション・ラグのモニター** までの **ステータス** が **完了済** になると移行が一時停止します。

    ![](2022-03-10-13-50-32.png)

    続いて、初期移行データがソースPDBからターゲットADBに正常に移行されているか確認します。

    <a id="anchor25"></a>

9. OCIコンソール・メニューから **Oracle Database** → **Autonomous Database** に移動します。

    ![](2022-03-10-13-52-38.png)

10. 移行に使用したターゲット・データベースの表示名をクリックします。

    ![](2022-03-10-13-52-55.png)

11. **データベース・アクション** ボタンをクリックします。

    ![](2022-03-10-13-53-12.png)

12. **SQL** をクリックします。

    ![](2022-03-10-13-53-22.png)

13. 画面左にあるナビゲーターでソースPDBで作成したサンプル・データが格納されているスキーマがあることを確認し、選択します。

    ![](2022-03-10-13-53-48.png)

    ![](2022-03-10-13-54-21.png)

14. ワークシートで以下のSQL文を実行します。

    ```sql
    SELECT
        PERSONID,
        LASTNAME,
        FIRSTNAME,
        ADDRESS,
        CITY
    FROM
        TESTUSER2.PERSONS;
    ```

    ![](2022-03-10-13-58-03.png)

    DMSのオブジェクト・ストレージとデータ・ポンプを使用した移行メソッドによって、[3. ソース・データベースの設定の6.](#anchor24)で作成したサンプル・データがターゲットADBに移行されていることが確認できました。

<BR>

<a id="anchor8"></a>

# 8. Oracle GoldenGateのレプリケーションの検証

1. Oracle GoldenGateのレプリケーションを検証するため、ソースPDBに更新データを追加します。

    [3. ソース・データベースの設定の6.](#anchor24)で作成したサンプル・データの表に新たにデータを追加します。
        
    ```sql
    INSERT INTO PERSONS (PersonID, LastName, FirstName, Address, City) Values ('2', 'Munden', 'Mike', '789way', 'Miami');

    commit;
    ```

    ```sql
    exit;
    ```

2. Oracle GoldenGateのレプリケーションによって、更新データがターゲットADBに伝播されているか確認をします。

    [7. 初期移行の実行の9.](#anchor25)と同じ手順で確認します。

    ![](2022-03-10-14-44-25.png)

    Oracle GoldenGateのレプリケーションによって、更新データがターゲットADBに伝播されていることが確認できました。

<BR>

<a id="anchor9"></a>

# 9. スイッチオーバーの実行

スイッチオーバーを実行します。このフェーズでは以下の処理が実行されます。
+ GoldenGate Extractの停止
+ GoldenGate Replicatの適用が完了してから停止

以下の手順で行います。

1. 一時停止中のジョブの **ジョブ詳細** ページに戻り、**再開** ボタンをクリックします。

    ![](2022-03-10-14-00-14.png)

2. **ジョブの再開** ダイアログが表示されます。**続行する前にフェーズ後にユーザー入力が必要** にチェックを付けると、選択したフェーズの後に一時停止をするように設定できます。チェックを付けて、**スイッチオーバー** を選択します。選択後、**再開** をクリックします。

    ![](2022-03-10-14-41-18.png)

    ![](2022-03-10-14-41-28.png)

3. **スイッチオーバー** の **ステータス** が **完了済** になると移行が一時停止します。

    ![](2022-03-10-14-42-26.png)

これでスイッチオーバーは完了です。

<BR>

<a id="anchor10"></a>

# 10. クリーンアップの実行

クリーンアップを実行します。このフェーズでは以下の処理が実行されます。
+ GoldenGateのExtract,Replicatプロセスの削除
+ ソースデータベースのサプリメンタルロギングの無効化
+ ハートビート表、チェックポイント表の削除

1. 一時停止中のジョブの **ジョブ詳細** ページに戻り、**再開** ボタンをクリックします

    ![](2022-03-10-14-45-05.png)

2. **ジョブの再開** ダイアログが表示されます。**続行する前にフェーズ後にユーザー入力が必要** にはチェックを付けずに **再開** をクリックします。

    ![](2022-03-10-14-45-31.png)

3. **クリーンアップ** の **ステータス** が **完了済** と表示されたら、完了です。

    ![](2022-03-10-14-45-49.png)

以上で **DMSを使用したデータベースのオンライン移行** は終了です。

<BR>

<a id="anchor11"></a>

# 参考資料
+ [Oracle Cloud Infrastructure Database移行サービスの使用](https://docs.oracle.com/cd/E83857_01/paas/database-migration/dmsus/index.html)
+ [OCI Database Migration Workshop](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=856)
+ [Oracle Cloud Marketplace上でのOracle GoldenGateの使用](https://docs.oracle.com/cd/F22974_01/oggmp/index.html)

<BR>

[ページトップへ戻る](#anchor0)
