---
title: "102 : ExaDB-D上のPDBを管理しよう"
excerpt: "OCIコンソールからExaDB-DのPDBを管理する方法について紹介します。"
order: "2_102"
layout: single
header:
  teaser: "/exadbd/exadb-d102-manage-pdb/teaser.png"
  overlay_image: "/exadbd/exadb-d102-manage-pdb/teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=797
---

<a id="anchor0"></a>

# はじめに
**Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D)** では、Oracle Cloud Infrastructureの上で稼働するOracle DatabaseのPDBをOCIコンソールから停止したり、起動したり、既存PDBからクローンするなどの操作が簡単に行うことが可能です。この章では実際にどのように操作するのか確認していきます。

**目次 :**
+ [1. PDBの起動・停止](#1-pdbの起動・停止)
+ [2. PDBの新規作成](#2-pdbの新規作成)
+ [3. PDBクローンの作成](#3-pdbクローンの作成)

**前提条件 :**
+ [101 : ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d){:target="_blank"}を通じてExaDB-Dの作成が完了していること

**所要時間 :** 約1時間

<BR>

# 1. PDBの起動・停止

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1. 利用したいコンパートメントを**リスト範囲**の**コンパートメント**から選択します。

    ![](2022-11-15-16-30-05.png)

1. 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、**リージョン**の一覧から選択します。

    ![](2022-11-15-16-32-47.png)

1.  操作したいPDBを持つ**Exadata VMクラスタ**の表示名をクリックします。

    ![](2022-07-05-17-14-07.png)

1. **データベース**の一覧から対象のデータベースの名前をクリックします。

    ![](2022-07-05-17-59-15.png)

1. **リソース**の一覧から**プラガブル・データベース**をクリックします。

    ![](2022-07-05-18-00-11.png)

1. 操作したいPDBの右側にある・・・メニューをクリックして、**停止**をクリックします。

    ![](2022-08-16-14-01-42.png)

1. 確認画面が表示されたら、**PDBの停止**をクリックします。

    ![](2022-08-16-14-03-03.png)

    操作したPDBの**状態**が**更新中**に変化します。

    ![](2022-08-16-14-03-18.png)

1. 停止が完了すると**状態**が**使用可能**に戻ります。

    ![](2022-08-16-14-03-30.png)

1. 対象のPDBの**プラガブル・データベースの詳細**でオープン・モードを確認できます。

    対象のPDBの状態が**マウント済**になっていることを確認します。

    ![](2022-09-13-11-17-48.png)

    同様の手順でPDBを起動することができます。起動すると**読み取り/書込み**モードで起動されます。

    ![](2022-09-13-09-55-15.png)



    

<BR>

# 2. PDBの新規作成

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1.  操作したいPDBを持つ**Exadata VMクラスタ**の表示名をクリックします。

    ![](2022-07-05-17-14-07.png)

1. **データベース**の一覧から対象のデータベースの名前をクリックします。

    ![](2022-07-05-17-59-15.png)

1. **リソース**の一覧から**プラガブル・データベース**をクリックします。

    ![](2022-07-05-18-00-11.png)

1. **プラガブル・データベースの作成**をクリックします。

    ![](2022-08-16-14-05-05.png)

1. **プラガブル・データベースの作成**ダイアログに以下の情報を入力します。
    + **PDB名の入力** - 任意の名前を入力します。
    + **データベースのTDEウォレット・パスワード** - データベースを作成した際に設定したsysスキーマのパスワード。[101 : ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d){:target="_blank"}の**3. データベースの作成**で設定したパスワードです。

    設定後、**プラガブル・データベースの作成**をクリックします。

    ![](2022-08-16-14-08-57.png)
    

1. 作成が完了すると作成したPDBの**状態**が**使用可能**と表示されます。

    ![](2022-08-16-14-13-42.png)

1. 対象のPDBの**プラガブル・データベースの詳細**でオープン・モードを確認できます。

    対象のPDBの状態が**読み取り/書込み**になっていることを確認します。

    ![](2022-09-13-10-27-26.png)



<BR>

# 3. **PDBクローンの作成**

1. [101 : ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d){:target="_blank"}の**6. PDB上のスキーマへのアクセス**でPDB上に作成したスキーマに接続します。スキーマを作成していない場合は[101 : ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d){:target="_blank"}の**5. データベース(PDB)へのアクセス**を参照ください。

1. スキーマ上にサンプル・データを追加します。

    実行コマンド
    ```sql
    CREATE TABLE EMPLOYEE (
    EmployeeID int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
    );

    INSERT INTO EMPLOYEE (EmployeeID, LastName, FirstName, Address, City) Values ('1', 'James', 'Steve', '123way', 'Los Angeles');

    exit;
    ```

    上記の手順でサンプル・データを追加したPDBをクローン元とします。

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1.  操作したいPDBを持つ**Exadata VMクラスタ**の表示名をクリックします。

    ![](2022-07-05-17-14-07.png)

1. **データベース**の一覧から対象のデータベースの名前をクリックします。

    ![](2022-07-05-17-59-15.png)

1. **リソース**の一覧から**プラガブル・データベース**をクリックします。

    ![](2022-07-05-18-00-11.png)

1. クローン元となるPDBの右側にある・・・メニューをクリックして、**クローン**をクリックします。

    ![](2022-08-18-14-45-37.png)

1. **PDBのクローニング**ダイアログに以下の情報を入力します。
    + **[コンパートメント名]のExadata VMクラスタ** - クローン先のVMクラスタを選択します。
    + **宛先データベース** - PDBクローンの作成先を指定します。
    + **ソース・データベースの管理パスワード** - 本ガイドのようにローカルのCDBに作成する場合は入力不要です。リモートのCDBに作成する場合入力が必須となります。データベースを作成した際に設定したsysスキーマのパスワードです。[101 : ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d){:target="_blank"}の**3. データベースの作成**で設定したパスワードです。
    + **新規PDBの構成**
        + **PDB名** - 任意の名前を入力します。
        + **データベースのTDEウォレット・パスワード** - データベースを作成した際に設定したsysスキーマのパスワードです。[101 : ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d){:target="_blank"}の**3. データベースの作成**で設定したパスワードです。

    設定後、**PDBのクローニング**をクリックします。

    ![](2022-08-18-14-34-25.png)

1. 作成が完了すると作成したPDBの**状態**が**使用可能**と表示されます。

    ![](2022-08-18-14-33-49.png)

1. 対象のPDBの**プラガブル・データベースの詳細**でオープン・モードを確認できます。

    対象のPDBの状態が**読み取り/書込み**になっていることを確認します。

    ![](2022-09-13-10-27-46.png)

1. クローン元(PDB1)で作成されていたスキーマ(TESTUSER)とサンプルデータ(EMPLOYEE表)がクローン(PDB3)に存在することをデータベースにSQL*Plusから接続して確認します。接続方法は[101 : ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d){:target="_blank"}の**5. データベース(PDB)へのアクセス**を参照ください。

    データベースに接続して以下のように確認します。

    実行コマンド
    ```sql
    show con_name
    show pdbs
    alter session set container = pdb3;
    select * from testuser.employee;
    ```

    実行例
    ```
    SQL> show con_name

    CON_NAME
    ------------------------------
    CDB$ROOT
    SQL> show pdbs

        CON_ID CON_NAME                       OPEN MODE  RESTRICTED
    ---------- ------------------------------ ---------- ----------
             2 PDB$SEED                       READ ONLY  NO
             3 PDB1                           READ WRITE NO
             4 PDB2                           READ WRITE NO
             5 PDB3                           READ WRITE NO
    SQL> alter session set container = pdb3;

    Session altered.

    SQL> select * from testuser.employee;

    EMPLOYEEID LASTNAME   FIRSTNAME  ADDRESS    CITY
    ---------- ---------- ---------- ---------- -----------
             1 James      Steve      123way     Los Angeles
    ```

    クローン元(PDB1)で作成されていたスキーマ(TESTUSER)とサンプルデータ(EMPLOYEE表)がクローン(PDB3)に存在することが確認できました。

    以上で この章の作業は完了です。

<BR>

<a id="anchor11"></a>

# 参考資料
+ [Oracle Cloud Infrastructure Documentation - Oracle Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en-us/iaas/exadatacloud/index.html){:target="_blank"}
+ [Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) サービス詳細](https://speakerdeck.com/oracle4engineer/exadata-database-cloud-technical-detail){:target="_blank"}

<BR>

[ページトップへ戻る](#anchor0)
