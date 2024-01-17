---
title: "107 : パッチを適用しよう"
excerpt: "ExaDB-Dでパッチを適用する方法について紹介します。"
order: "2_107"
layout: single
header:
  teaser: "/exadbd/exadb-d107-patch/teaser.png"
  overlay_image: "/exadbd/exadb-d107-patch/teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=797
---

<a id="anchor0"></a>

# はじめに
**Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D)** では、OS以上がユーザー管理となるため、OS以上のOS、Grid Infrastructure、Database、そしてPaaSサービスの管理のためのクラウド・ツールに対するパッチ適用は、ユーザー側でパッチ適用の計画と適用実施が可能です。ここでは、それぞれのパッチ適用方法についてご紹介します。

**目次 :**
+ [1. Grid Infrastructure(GI)のパッチ適用](#anchor1-1)
+ [2. データベースのパッチ適用](#2-データベースのパッチ適用)
    - [Out-of-place Patching](#anchor2-1)
    - [In-place Patching](#anchor2-2)
+ [3. クラウド・ツール(dbaascli)のパッチ適用](#anchor3-1)
+ [4. OSのパッチ適用](#anchor4-1)


**前提条件 :**
+ [101 : ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d){:target="_blank"}を通じてExaDB-Dの作成が完了していること

+ [104 : バックアップからリストアしよう](/ocitutorials/exadbd/exadb-d104-backup-restore){:target="_blank"}を通じてデータベースのバックアップが完了していること

**所要時間 :** 約2時間　※環境によって異なるため、参考値です。

<BR>

<a id="anchor1-1"></a>

# 1. Grid Infrastructure(GI)のパッチ適用

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Exadata Database Service on Dedicated Infrastructure** に移動します。

    ![](2023-11-21-01.png)

1. 利用したいコンパートメントを**List scope**の**コンパートメント**から選択します。

    ![](2023-11-21-02.png)

1. 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、**リージョン**の一覧から選択します。

    ![](2023-11-21-03.png)

1.  操作したい**Exadata VMクラスタ**の表示名をクリックします。

    ![](2023-11-21-04.png)

1. **Exadata VMクラスタの詳細**ページの**グリッド・インフラストラクチャのバージョン**で現在のGIのバージョンを確認できます。

    ![](2023-11-21-05.png)

    opatchコマンドでも確認が可能です。仮想マシンへのアクセス方法は[101：ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d/){:target="_blank"}の**4.DBシステムへのアクセス**をご参照ください。

    以下のようにgridユーザにログインして、コマンドを実行します。

    実行コマンド：

    ```
    sudo su - grid
    /u01/app/19.0.0.0/grid/OPatch/opatch lspatches
    ```

    実行例：

    ![](2023-11-21-6.png)

1. **使用可能な更新**の横にある**更新の表示**をクリックします。

    ![](2023-11-21-7.png)

1.  適用可能なパッチの一覧が表示されます。ここでは**グリッド・インフラストラクチャ**の**19.21.0.0.0**を適用します。

    ![](2023-11-21-8.png)


1. 適用したいパッチの右の**アクション・ボタン**をクリックして、**事前チェックの実行**をクリックします。

    ![](2023-11-21-9.png)

1. **事前チェックの実行**のボタンをクリックします。

    ![](2023-11-21-10.png)

1. 実行したパッチの**状態**が**チェック中**に切り替わります。

    ![](2023-11-21-11.png)

    成功すると、**状態**が**使用可能**に切り替わり、**最後に成功した事前チェック**に日付が更新されます。

    ![](2023-11-21-12.png)

1. 事前チェックで問題がなければ、**アクション・ボタン**をクリックして、**Grid Infrastructureパッチの適用**をクリックします。

    ![](2023-11-21-21-1.png)

1. **パッチの適用**ボタンをクリックします。

    ![](2023-11-21-13.png)

    **Exadata VMクラスタの詳細**ページに戻ると、状態が**更新中**となっています。**使用可能**に切り替わるまで待機します。
    パッチはDBサーバーへのローリングで適用されます。

    ![](2023-11-21-14.png)

    VMクラスタの状態が**使用可能**に切り替わり、パッチが成功すると、パッチの一覧から適用したパッチが消えます。適用したパッチはdbaascliを使用してロールバックできます。

    ![](2023-11-21-15.png)

    opatchコマンドでも確認が可能です。仮想マシンへのアクセス方法は[101：ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d/){:target="_blank"}の**4.DBシステムへのアクセス**をご参照ください。

    以下のようにgridユーザにログインして、コマンドを実行します。

    実行コマンド：

    ```
    sudo su - grid
    /u01/app/19.0.0.0/grid/OPatch/opatch lspatches
    ```

    実行例：

    ![](2023-11-21-16.png)


<BR>

# 2. データベースのパッチ適用  

パッチ適用方法には、**Out-of-place Patching**と**In-place Patching**の2つの方法を提供しております。

- **Out-of-place Patching**:<br>
    既存のOracleホームとは別の場所に、バイナリ・ファイルをインストールしてパッチ適用する

- **In-place Patching**:<br>
    既存のOracleホームとしてインストールされているバイナリ・ファイルを、直接入れ替えることでパッチ適用する

パッチ適用後に何か問題が発生した際に元のOracleホームにスイッチ・バックできるという利点から**Out-of-place Patching**が推奨とされています。

<a id="anchor2-1"></a>

## Out-of-place Patching

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-11-04-17-13-56.png)

1. 利用したいコンパートメントを**リスト範囲**の**コンパートメント**から選択します。

    ![](2022-11-15-16-30-05.png)

1. 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、**リージョン**の一覧から選択します。

    ![](2022-11-15-16-32-47.png)

1.  操作したい**Exadata VMクラスタ**の表示名をクリックします。

    ![](2023-03-31-17-49-07.png)

1. **Exadata VMクラスタの詳細**ページの**使用可能な更新**の横にある**更新の表示**をクリックします。

    ![](2023-03-31-17-52-26.png)

<a id="anchor2-6"></a>

1. 適用可能なパッチの一覧が表示されます。

    ![](2023-03-31-17-53-03.png)

    opatchコマンドでも確認が可能です。仮想マシンへのアクセス方法は[101：ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d/){:target="_blank"}の**4.DBシステムへのアクセス**をご参照ください。

    以下のようにoracleユーザにログインして、コマンドを実行します。

    実行コマンド：

    ```
    sudo su - oracle
    $ORACLE_HOME/OPatch/opatch lspatches
    ```

    実行例：

    ```
    [oracle@oradb-lxxkd1 ~]$ opatch lspatches
    34088989;ONE-OFF REQUEST FOR DELETE DIR FOR SUPTOOLS/TFA + SUPTOOLS/ORACHK + SUPTOOLS/ORACHK.ZIP FROM DB PSU/BP/RU/RUR
    34096213;Fix for Bug 34096213
    33810360;CVE-2021-45943 REPORTED IN (OPEN SOURCE GEOSPATIAL FOUNDATION/GEOSPATIAL DATA ABSTRACTION LIBRARY/OPENGIS SIMPLE FEATURES REFERENCE IMPLEMENTATION (GDAL/OGR)/3.3.0)
    33809062;TRACKING BUG FOR REGRESSION RTI 24544369 CAUSED BY PKNAGGS_BUG-32472737 APPROVED/INCLUDED IN 21.0.0.0 ADBSBP
    29780459;INCREASE _LM_RES_HASH_BUCKET AND BACK OUT CHANGES FROM THE BUG 29416368 FIX
    33613833;DSTV37 UPDATE - TZDATA2021E - NEED OJVM FIX
    33613829;RDBMS - DSTV37 UPDATE - TZDATA2021E
    32327201;RDBMS - DSTV36 UPDATE - TZDATA2020E
    31335037;RDBMS - DSTV35 UPDATE - TZDATA2020A
    30432118;MERGE REQUEST ON TOP OF 19.0.0.0.0 FOR BUGS 28852325 29997937
    33912872;DATABASE PERL UPDATE IN 19C TO V5.32-1 (CVE-2022-23990 - LIBEXPAT UPDATE)
    33810130;JDK BUNDLE PATCH 19.0.0.0.220419
    33808367;OJVM RELEASE UPDATE: 19.15.0.0.220419 (33808367)
    33815596;OCW RELEASE UPDATE 19.15.0.0.0 (33815596)
    33806152;Database Release Update : 19.15.0.0.220419 (33806152)

    OPatch succeeded.
    ```

1. アップグレードしたいデータベースのバージョンのデータベース・ホームを作成します。データベース・ホームの作成は[106 : データベースのバージョンを指定しよう](/ocitutorials/exadbd/exadb-d106-dbversion){:target="_blank"}の**1. データベース・ホームの作成**をご参照ください。

    作成が完了すると、以下のように**Exadata VMクラスタの詳細**ページのデータベース・ホームの一覧に**データベースの数**が0のデータベース・ホームが追加されます。
    ![](2023-03-31-23-24-12.png)

1. **リソース**の一覧から**データベース**をクリックし、パッチを適用するデータベース名をクリックします。

    ![](2023-03-31-23-28-54.png)

1. **データベース詳細**ページの**他のアクション**ボタンをクリックし、**別のホームに移動**をクリックします。

    ![](2023-03-31-23-30-52.png)

1. **データベースを移動するホームを選択**をクリックし、アップグレードしたいデータベースのバージョンのデータベース・ホームを選択します。

    ![](2023-03-31-23-34-41.png)

1. **ターゲット・データベース・ホーム**が選択されていることを確認し、**データベースの移動**ボタンをクリックします。

    ![](2023-03-31-23-36-33.png)

1. **データベースの移動**ボタンをクリックします。移動操作（パッチ適用）はノード間でローリング方式で行われます。

    ![](2023-03-31-23-37-20.png)

1. パッチを適用するデータベースの状態が**更新中**に切り替わります。

    ![](2023-03-31-23-39-30.png)

    対象のデータベースが配置されていたデータベース・ホームと移動先のデータベース・ホームの状態も**更新中**に切り替わります。

    ![](2023-03-31-23-41-16.png)

1. 移動（パッチ適用）が完了すると、データベース・ホームの状態が**使用可能**に切り替わり、移動されたデータベース・ホームの**データベースの数**が1に変更されます。

    ![](2023-03-31-23-42-58.png)

    [Out-of-place Patchingの6.](#anchor2-6)で確認したパッチの一覧に適用したパッチが消えます。適用したパッチはdbaascliを使用してロールバック出来ます。

    ![](2023-03-31-23-50-17.png)

    opatchコマンドでも確認が可能です。仮想マシンへのアクセス方法は[101：ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d/){:target="_blank"}の**4.DBシステムへのアクセス**をご参照ください。

    以下のようにoracleユーザにログインして、コマンドを実行します。

    実行コマンド：

    ```
    sudo su - oracle
    $ORACLE_HOME/OPatch/opatch lspatches
    ```

    実行例：

    ```
    [oracle@oradb-lxxkd1 ~]$ $ORACLE_HOME/OPatch/opatch lspatches
    34835593;REFERENCE BUG 34792490 - SCHEDULER LAYER CHANGES TO AVOID CYCLIC DEPENDENCY ON DBMS_AQADM_SYS PACKAGE
    34792490;FADBRWT STRESS FA ORA-00060  DEADLOCK DETECTED DURING DATAPATCH
    34699616;DSTV40 UPDATE - TZDATA2022E - NEED OJVM FIX
    34777391;JDK BUNDLE PATCH 19.0.0.0.230117
    34786990;OJVM RELEASE UPDATE: 19.18.0.0.230117 (34786990)
    34768559;OCW RELEASE UPDATE 19.18.0.0.0 (34768559)
    34765931;DATABASE RELEASE UPDATE : 19.18.0.0.230117 (REL-JAN230131) (34765931)

    OPatch succeeded.
    ```

<a id="anchor2-2"></a>

## In-place Patching

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Exadata Database Service on Dedicated Infrastructure** に移動します。

    ![](2023-11-21-01.png)

1. 利用したいコンパートメントを**List scope**の**コンパートメント**から選択します。

    ![](2023-11-21-02.png)

1. 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、**リージョン**の一覧から選択します。

    ![](2023-11-21-03.png)

1.  操作したい**Exadata VMクラスタ**の表示名をクリックします。

    ![](2023-11-21-04.png)

1. **Exadata VMクラスタの詳細**ページの**使用可能な更新**の横にある**更新の表示**をクリックします。

    ![](2023-11-21-7.png)

1. 適用可能なパッチの一覧が表示されます。（例では、19.21.0.0.0が適用可能）

    ![](2023-11-21-21.png)

    opatchコマンドでも確認が可能です。仮想マシンへのアクセス方法は[101：ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d/){:target="_blank"}の**4.DBシステムへのアクセス**をご参照ください。

    以下のようにoracleユーザにログインして、コマンドを実行します。

    実行コマンド：

    ```
    sudo su - oracle
    $ORACLE_HOME/OPatch/opatch lspatches
    ```

    実行例：

    ![](2023-11-21-18.png)

1. 適用したいパッチの右の**アクション・ボタン**をクリックして、**事前チェックの実行**をクリックします。

    ![](2023-11-21-21.png)

1. **事前チェックの実行**のボタンをクリックします。

    ![](2023-11-21-22.png)

1. 実行したパッチの**状態**が**チェック中**に切り替わります。

    ![](2023-11-21-23.png)

    成功すると、**状態**が**使用可能**に切り替わります。

    ![](2023-11-21-24.png)

1. 事前チェックで問題がなければ、**アクション・ボタン**をクリックして、**適用**をクリックします。

    ![](2023-11-21-25.png)

1. **パッチの適用**ボタンをクリックします。

    ![](2023-11-21-26.png)

    **Exadata VMクラスタの詳細**ページに戻ると、状態が**更新中**となっています。**使用可能**に切り替わるまで待機します。パッチはDBサーバーへのローリングで適用されます。

    ![](2023-11-21-17.png)

    VMクラスタの状態が**使用可能**に切り替わり、パッチが成功すると、パッチの一覧から適用したパッチが消えます。適用したパッチはdbaascliを使用してロールバック出来ます。

    ![](2023-11-21-28.png)

    opatchコマンドでも確認が可能です。仮想マシンへのアクセス方法は[101：ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d/){:target="_blank"}の**4.DBシステムへのアクセス**をご参照ください。

    以下のようにoracleユーザにログインして、コマンドを実行します。

    実行コマンド：

    ```
    sudo su - oracle
    $ORACLE_HOME/OPatch/opatch lspatches
    ```

    実行例：

    ```
   [oracle@vmem-6gl0h1 ~]$ $ORACLE_HOME/OPatch/opatch lspatches
    34346703;PL23.1 PORTSPECEFIC  NEW PLATFORM FOR CROSS TRANSPORTABLE PLATFORMS ADD IN KCPXPL_INIT
    34697081;NOT SHIPPING LIBAUTH_SDK_IAM.SO IN 23 SHIPHOME INSTALL
    35562836;DBUA IS PERFORMING VALIDATIONS ON ALL PDBS REGARDLESS THE TARGET PDBS PASSED IN -PDBS ARGUMENT
    35638318;JDK BUNDLE PATCH 19.0.0.0.231017
    35762404;OCW Interim patch for 35762404
    35763448;ENFORCE V2 CHECKS ONLY FOR CLIENT CLOUD MNEMONIC QUERIES
    35770294;CVE-2023-2976  GOOGLE GUAVA UPDATE TO AT LEAST 32.0.0
    35239280;DSTV42 UPDATE - TZDATA2023C - NEED OJVM FIX
    35648110;OJVM RELEASE UPDATE: 19.21.0.0.231017 (35648110)
    35643107;Database Release Update : 19.21.0.0.231017 (35643107)

    OPatch succeeded.
    ```

<BR>

<a id="anchor3-1"></a>

# 3. クラウド・ツール(dbaascli)のパッチ適用

ExaDB-Dのクラウド・ツールであるdbaascliユーティリティを使用して、ExaDB-D上の様々なデータベースの管理操作をコマンドラインベースで実行できます。クラウド・ツールは、新しいリリースが使用可能になり次第、最新バージョンへアップデート可能です。dbaascliは自動でアップデートされますが、ここでは手動でのdbaascliのパッチの適用方法を紹介します。

1. ExaDB-Dにアクセスします。仮想マシンへのアクセス方法は[101：ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d/){:target="_blank"}の**4.DBシステムへのアクセス**をご参照ください。

1. 以下のようにrootユーザにログインします。

    実行コマンド：

    ```
    sudo -s
    ```

    <a id="anchor3-2"></a>

1. 以下のようにクラウド・ツールのバージョンを確認します。

    実行コマンド：

    ```
    dbaascli patch tools list
    ```

    クラウド・ツールのバージョンが最新の場合は以下のようになります。この場合は、バージョンが最新のため、クラウド・ツール(dbaascli)のパッチ適用の作業は**完了**のため、[4. OSのパッチ適用](#4-OSのパッチ適用)に進みます。

    実行例(最新バージョンの場合)：

    ```
    [root@orcl1 ~]# dbaascli patch tools list
    DBAAS CLI version 22.1.1.0.1
    Executing command patch tools list
    Checking Current tools on all nodes

    orcl1: Patchid : 22.1.1.0.1_220223.0947
    No applicable tools patches are available

    orcl2: Patchid : 22.1.1.0.1_220223.0947
    No applicable tools patches are available

    All Nodes have the same tools version
    ```

    適用可能なパッチが存在する場合、以下のようになります。

    実行例(適用可能なパッチが存在する場合)：

    ```
    [root@orcl1 ~]# dbaascli patch tools list;
    DBAAS CLI version 21.4.1.1.0
    Executing command patch tools list
    Checking Current tools on all nodes

    orcl1: Patchid : 21.4.1.1.0_220209.2354

    Available Patches
    Patchid : 22.1.1.0.1_220223.0947(LATEST)

    Install tools patch using
    dbaascli patch tools apply --patchid 22.1.1.0.1_220223.0947    or
    dbaascli patch tools apply --patchid LATEST

    orcl2: Patchid : 21.4.1.1.0_220209.2354

    Available Patches
    Patchid : 22.1.1.0.1_220223.0947(LATEST)

    Install tools patch using
    dbaascli patch tools apply --patchid 22.1.1.0.1_220223.0947    or
    dbaascli patch tools apply --patchid LATEST

    All Nodes have the same tools version
    ```

1. 以下のようにクラウド・ツール(dbaascli)のパッチを適用する。（※ dbaascli 21.2.1.x.x から “dbaascli patch tools apply”は 非推奨となり、 “dbaascli admin updateStack”を使用します。）

    実行コマンド：

    ```
    dbaascli admin updateStack --version LATEST
    ```

    実行例(一部省略)：

    ```
    [root@orcl1 ~]# dbaascli admin updateStack --version LATEST
    DBAAS CLI version 21.4.1.1.0
    Executing command admin updateStack --version LATEST
    INFO : Review log file => /var/opt/oracle/log/tooling/Update/Update_2022-03-03_09:06:37.96968338661.log
    ============ Starting RPM update operation ===========
    Loading PILOT...
    Session ID of the current execution is: 65
    Log file location: /var/opt/oracle/log/tooling/Update/pilot_2022-03-03_09-06-39-AM
    -----------------
    Running Plugin_initialization job
    Completed Plugin_initialization job
    -----------------
    Running Default_value_initialization job
    Completed Default_value_initialization job
    -----------------
    Running Rpm_version_validation job
    Completed Rpm_version_validation job
    -----------------
    Running Rpm_source_validation job
    Completed Rpm_source_validation job
    -----------------
    Running Disk_space_validate job
    Completed Disk_space_validate job

    *** 省略 ***

    Completed Setup_syslens job
    -----------------
    Running Update_creg_and_log_ownership job
    Completed Update_creg_and_log_ownership job
    -----------------
    Running Upgrade_ahf job
    Completed Upgrade_ahf job
    ```

1. [3. クラウド・ツール(dbaascli)のパッチ適用の3.](#anchor3-2)に戻り、クラウド・ツールのバージョンを確認します。

<a id="anchor4-1"></a>

# 4. OSのパッチ適用

1. OCIコンソール・メニューから **Oracle Database** → ** Oracle Exadata Database Service on Dedicated Infrastructure** に移動します。

    ![](2023-11-21-01.png)

1. 利用したいコンパートメントを**List scope**の**コンパートメント**から選択します。

    ![](2023-11-21-02.png)

1. 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、**リージョン**の一覧から選択します。

    ![](2023-11-21-03.png)

1.  操作したい**Exadata VMクラスタ**の表示名をクリックします。

    ![](2023-11-21-04.png)

1. **Exadata VMクラスタの詳細**ページの**使用可能な更新**の横にある**更新の表示**をクリックします。

    ![](2023-11-21-7.png)

1. 適用可能なパッチの一覧が表示されます。

    ![](2023-11-21-30.png)

1. 適用したいパッチの右の**アクション・ボタン**をクリックして、**事前チェックの実行**をクリックします。

    ![](2023-11-21-31.png)

1. **事前チェックの実行**のボタンをクリックします。

    ![](2023-11-21-32.png)

1. 実行したパッチの**状態**が**チェック中**に切り替わります。

    ![](2023-11-21-33.png)

    成功すると、**状態**が**使用可能**に切り替わり、**最後に成功した事前チェック**に日付が更新されます。

    ![](2023-11-21-34.png)

1. 事前チェックで問題がなければ、**アクション・ボタン**をクリックして、**Exadata OSイメージ更新の適用**をクリックします。

    ![](2023-11-21-35.png)

1. **Exadataイメージ更新の適用**ボタンをクリックします。

    ![](2023-11-21-36.png)

    **Exadata VMクラスタの詳細**ページに戻ると、状態が**更新中**となっています。**使用可能**に切り替わるまで待機します。パッチはノード間でローリングで適用されます。

    ![](2023-11-21-37.png)

    VMクラスタの状態が**使用可能**に切り替わり、パッチが成功すると、パッチの一覧から適用したパッチが消えます。パッチ適用に失敗した場合はSRをあげてください。

    ![](2023-11-21-38.png)

    opatchコマンドでも確認が可能です。仮想マシンへのアクセス方法は[101：ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d/){:target="_blank"}の**4.DBシステムへのアクセス**をご参照ください。

    以下のようにrootユーザにログインして、コマンドを実行します。

    実行コマンド：

    ```
    sudo su - 
    imagehistory
    ```

    実行例：

    ```
    [root@vmem-6gl0h1 ~]# imagehistory
    Version                              : 22.1.13.0.0.230818
    Image activation date                : 2023-10-20 00:40:00 +0900
    Imaging mode                         : fresh
    Imaging status                       : success

    Version                              : 22.1.16.0.0.231012
    Image activation date                : 2023-11-20 17:04:05 +0900
    Imaging mode                         : patch
    Imaging status                       : success

    Version                              : 23.1.7.0.0.231012
    Image activation date                : 2023-11-20 21:13:18 +0900
    Imaging mode                         : patch
    Imaging status                       : success
    ```

<BR>

以上でこの章の作業は完了です。

<BR>

<a id="anchor11"></a>

# 参考資料
+ [Oracle Cloud Infrastructure Documentation - Oracle Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en-us/iaas/exadatacloud/index.html){:target="_blank"}
+ [Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) サービス詳細](https://speakerdeck.com/oracle4engineer/exadata-database-cloud-technical-detail){:target="_blank"}

<BR>

[ページトップへ戻る](#anchor0)
