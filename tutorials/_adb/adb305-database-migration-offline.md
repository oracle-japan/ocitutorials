---
title: "305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行"
excerpt: "OCI Database Migration Serviceの移行の作成、検証、実行、そして確認作業までのオフライン移行の一連の作業を紹介します。"
order: "3_305"
layout: single
header:
  teaser: "/adb/adb305-database-migration-prep/teaser.png"
  overlay_image: "/adb/adb305-database-migration-offline/teaser.png"
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

この章では、DMSを使用したデータベースのオフライン移行について紹介します。

![](2022-03-24-09-40-38.png)

**目次 :**
  + [1. ソース・データベースへのサンプル・データの追加](#anchor1)
  + [2. 移行の作成](#anchor2)
  + [3. 移行の検証](#anchor3)
  + [4. 移行の実行](#anchor4)
  + [5. 移行データの確認](#anchor5)


**前提条件 :**
+ [「304 : OCI Database Migration Serviceを使用したデータベース移行の前準備」](/ocitutorials/adb/adb304-database-migration-prep)を参考に、データベース移行の前準備が完了していること。
+ ターゲット・データベースのタイムゾーン・バージョンがソース・データベースのタイムゾーン・バージョンよりも最新になっていることを確認する(SELECT * FROM V$TIMEZONE_FILE;)。ターゲット・データベースのタイムゾーン・バージョンの方が古い場合はSRをあげる必要があります。

**所要時間 :** 約30分

<BR>

<a id="anchor1"></a>

# 1. ソース・データベースへのサンプル・データの追加

1. PDB上のスキーマに接続します。スキーマがない場合は検証用のスキーマを作成してください。SQL*Plusを利用する場合は、以下のようにホスト名、ポート番号、サービス名を指定します。

    例：（$ sqlplus <スキーマ名>/<パスワード>@<ホスト名>:<ポート>/<サービス名>）

    ```
    sqlplus testuser/WelCome123#123#@dbcs01.subnet.vcn.oraclevcn.com:1521/pdb1.subnet.vcn.oraclevcn.com
    ```
  
2. PDB上にサンプル・データを追加します。

    ```sql
    CREATE TABLE PERSONS (
        PersonID int,
        LastName varchar(255),
        FirstName varchar(255),
        Address varchar(255),
        City varchar(255)
    );
    ```

    ```sql
    INSERT INTO PERSONS (PersonID, LastName, FirstName, Address, City) Values ('1', 'James', 'Steve', '123way', 'Los Angeles');

    commit;
    ```

    ```sql
    exit;
    ```

<BR>

<a id="anchor2"></a>

# 2. 移行の作成

1. OCIコンソール・メニューから **移行とディザスタ・リカバリ** → **移行** に移動します。

    ![alt text](image-8.png)

2. **移行の作成** を選択します。

    ![](2022-03-04-13-57-08.png)

3. **一般情報** の各項目は以下のように設定します。その他の入力項目はデフォルトのままにします。
    + **名前** - 任意 ※名前にスペースを含めると移行の作成に失敗します。

    設定後、**Next** をクリックします。

    ![alt text](image-9.png)

4. **データベースの選択** の各項目は以下のように設定します。
    + **ソース・データベース** - 登録済みのソース・データベース（PDB）を選択します。
    + **データベースはプラガブル・データベース(PDB)です** にチェックを付けます。
    + **登録済みコンテナ・データベース** - 登録済みのソース・データベース（CDB）を選択します。
    + **ターゲット・データベース** - 登録済みのターゲット・データベースを選択します。
  
    設定後、**Next** をクリックします。

    ![alt text](image-10.png)

5. **移行オプション** の各項目は以下のように設定します。
    + **初期ロード** - オブジェクト・ストレージ経由のデータポンプを選択します。
    + **ソース・データベース：**
        + 名前 - 任意
        + パス - 任意
        + SSLウォレット・パス- 任意
    + **オブジェクト・ストレージ・バケット** - 使用したいオブジェクト・ストレージ・バケットを選択します。

    設定後、**作成** をクリックします。

    ![alt text](image-11.png)

6. 作成した移行の状態が **アクティブ** になるまで待ちます。（3分ほどかかります。）

    ![](2022-03-04-14-20-27.png)

    これで移行の作成は完了です。

<BR>

<a id="anchor3"></a>

# 3. 移行の検証

1. OCIコンソール・メニューから **移行とディザスタ・リカバリ** → **移行** に移動します。

    ![alt text](image-8.png)

2. 検証する移行の名前をクリックします。

    ![](2022-03-04-14-24-09.png)

3. **検証** ボタンをクリックすると **移行の検証** ダイアログが表示されます。 **検証** をクリックします。

    ![](2022-03-04-14-25-53.png)

    ![](2022-03-04-15-04-31.png)

4. **リソース** の一覧にある **ジョブ** をクリックし、実行中のジョブの名前をクリックします。

    ![](2022-03-04-14-31-15.png)

5. **リソース** の一覧にある **フェーズ** をクリックします。ここで実行中の検証のフェーズが確認できます。

    ![](2022-03-04-14-32-57.png)

6. 検証が失敗した場合、**フェーズ** の **ステータス** に**失敗** と表示されます。その場合、 **ログのダウンロード** ボタンをクリックしてログを参照することで、失敗の詳細を確認することができます。もう一度実行したい場合は、 **中断** ボタンをクリックして検証を再度やり直してください。

    ![](2022-03-04-15-13-34.png)

    **移行前アドバイザの検証** で失敗した場合、**フェーズ** の **移行前アドバイザの検証** をクリックし、**アドバイザ・レポートのダウンロード** をクリックすることでCPAT (Cloud Premigration Advisor Tool)の結果を閲覧することができます。

    CPATには次のような利点があります。
    + ターゲット環境でサポートされていないデータベースで使用されている機能について警告します。
    + データ・ポンプのエクスポートおよびインポート操作に使用する修復変更やパラメータ(あるいはその両方)に関する提案を作成します。

    詳細については、[Oracle Cloud Infrastructure Database移行サービスの使用 - 4 移行の管理 - 検証オプションの構成](https://docs.oracle.com/cd/E83857_01/paas/database-migration/dmsus/managing-migrations.html#GUID-585B1102-DD5C-4E23-BB88-C2B14A090003) をご参照ください。

    ![](2022-03-04-21-04-56.png)

    ![](2022-03-04-21-05-05.png)

7. 全ての **フェーズ** の **ステータス** が **完了済** と表示されたら、移行の検証は完了です。

    ![](2022-03-04-14-39-12.png)

<BR>

<a id="anchor4"></a>

# 4. 移行の実行

1. OCIコンソール・メニューから **移行とディザスタ・リカバリ** → **移行** に移動します。

    ![alt text](image-8.png)

2. 実行する移行の名前をクリックします。

    ![](2022-03-04-14-24-09.png)

3. **起動** ボタンをクリックします。

    ![](2022-03-04-14-41-55.png)

4. **移行の開始** ダイアログが表示されます。**続行する前にフェーズ後にユーザー入力が必要** にチェックを付けると、選択したフェーズの後に一時停止をするように設定できます。本チュートリアルではチェックを付けず、**起動** をクリックします。

    ![](2022-03-04-14-59-47.png)

4. **リソース** の一覧にある **ジョブ** をクリックし、実行中のジョブの名前をクリックします。

    ![](2022-03-04-15-11-36.png)

5. **リソース** の一覧にある **フェーズ** をクリックします。ここで実行中の移行のフェーズが確認できます。

    ![](2022-03-04-15-12-39.png)

6. 移行が失敗した場合、**フェーズ** の **ステータス** に**失敗** と表示されます。その場合、 **ログのダウンロード** ボタンをクリックしてログを参照することで、失敗の詳細を確認することができます。もう一度実行したい場合は、 **中断** ボタンをクリックして移行を再度やり直してください。

    ![](2022-03-04-20-43-01.png)

7. 全ての **フェーズ** の **ステータス** が **完了済** と表示されたら、移行は完了です。

    ![](2022-03-04-15-19-07.png)

<BR>

<a id="anchor5"></a>

# 5. 移行データの確認
ソースPDBからターゲットADBにデータが正常に移行されているか確認します。

1. OCIコンソール・メニューから **Oracle Database** → **Autonomous Database** に移動します。

    ![](2022-03-04-15-24-32.png)

2. 移行に使用したターゲット・データベースの表示名をクリックします。

    ![](2022-03-04-15-26-14.png)

3. **データベース・アクション** ボタンをクリックします。

    ![](2022-03-04-15-27-47.png)

4. **SQL** をクリックします。

    ![alt text](image-12.png)

5. 画面左にあるナビゲーターでソースPDBで作成したサンプル・データが格納されているスキーマがあることを確認し、選択します。

    ![](2022-03-04-15-32-05.png)

    ![](2022-03-09-22-29-37.png)

6. ワークシートで以下のSQL文を実行します。

    ```sql
    SELECT
        PERSONID,
        LASTNAME,
        FIRSTNAME,
        ADDRESS,
        CITY
    FROM
        TESTUSER.PERSONS;
    ```

    ![](2022-03-10-13-57-14.png)

    DMSのオブジェクト・ストレージとデータ・ポンプを使用した移行メソッドによって、[1. ソース・データベースへのサンプル・データの追加](#anchor1)で作成したサンプル・データがターゲットADBに移行されていることが確認できました。

以上で **DMSを使用したデータベースのオフライン移行** は終了です。

オンライン移行を実行したい場合は、[306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行](/ocitutorials/adb/adb306-database-migration-online)にお進みください。

<BR>

<a id="anchor6"></a>

# 参考資料
+ [Oracle Cloud Infrastructure Database移行サービスの使用](https://docs.oracle.com/cd/E83857_01/paas/database-migration/dmsus/index.html)
+ [OCI Database Migration Workshop](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=856)

<BR>

[ページトップへ戻る](#anchor0)