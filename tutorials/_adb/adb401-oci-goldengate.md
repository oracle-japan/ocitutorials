---
title: "401 : OCI GoldenGateによるBaseDBからADBへのデータ連携"
excerpt: "OCI GoldenGateのインスタンス作成から対象のデータべース登録、データ連携の設定までを紹介します。基本的な設定の流れを学習しましょう。"
order: "3_401"
layout: single
header:
  teaser: "/adb/adb401-oci-goldengate/instancetop.png"
  overlay_image: "/adb/adb401-oci-goldengate/instancetop.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=797
---
<a id="anchor0"></a>

# はじめに
**Oracle Cloud Infrastructure (OCI) GoldenGate**はフルマネージド型のリアルタイムデータ連携サービスとなっています。
OCI GoldenGateサービスは、構成、ワークロード・スケーリング、パッチ適用などの多くの機能を自動化しており、従量課金制で利用することが可能です。そのため時間や場所を選ばずに、低コストでデータの連携、分析ができるようになります。

この章では、OCI GoldenGateの作成とBaseDBからADBへのデータ連携の設定について紹介します。
   ![データ連携のイメージ](replicationimage2.png)
   

**目次 :**
  + [1.ソース・データベースの設定](#anchor1)
  + [2.ターゲット・データベースの設定](#anchor2)
  + [3.OCI GGデプロイメントの作成](#anchor3)
  + [4.データベースの登録](#anchor4)
  + [5.Extractの作成](#anchor5)
  + [6.チェックポイント表の作成](#anchor6)
  + [7.Replicatの作成](#anchor7)
  + [8.データ連携の確認](#anchor8)


**前提条件 :**
本チュートリアルではBaseDB、ADBともにデータベースの作成が完了しており、初期データとしてHRスキーマがそれぞれのデータベースにロードされていることを前提にしています。
各データベースの作成方法やデータロードの方法は下記手順をご確認ください。

 + BaseDBの作成については、[「101: Oracle Cloud で Oracle Database を使おう(BaseDB)」](https://oracle-japan.github.io/ocitutorials/basedb/dbcs101-create-db/) をご参照ください。
 + データ連携用のサンプルデータはHRスキーマを使用しています。BaseDBでのHRスキーマ作成方法は、[「301: 移行元となるデータベースを作成しよう」](https://oracle-japan.github.io/ocitutorials/adb/adb301-create-source-db/) をご参照ください。
 + ADBの作成については、[「101:ADBインスタンスを作成してみよう」](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/) をご参照ください。
 + ADBの初期データロードについては、[「303 : Data Pumpを利用してデータを移行しよう」](https://oracle-japan.github.io/ocitutorials/adb/adb303-datapump/) をご参照ください。
 + チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、BaseDBを含めて各ユーザのパスワードはすべて「Welcome#1Welcome#1」とします。

**所要時間 :** 約60分

<BR>

<a id="anchor1"></a>

# 1. ソース・データベースの設定
ソース・データベースであるBaseDBに対して下記の設定を行います。

1. GoldenGate管理者ユーザの作成

    ソース・データベースにGG管理ユーザを作成し、必要な権限を付与します。このスキーマにGG関連オブジェクトが作成されます。
    SQL*Plusを起動して以下を実行してください。

    ```sql
    -- ユーザを作成(CDB構成のため接頭辞としてC##をつけた共通ユーザを作成)
    create user "C##OGGADMIN" identified by Welcome#1Welcome#1 default tablespace users temporary tablespace temp quota unlimited on users;
    -- dba権限の付与
    grant dba to "C##OGGADMIN" container=all; 
    -- GG実行権限の付与
    exec dbms_goldengate_auth.grant_admin_privilege('C##OGGADMIN',container=>'ALL');
    ```

1. アーカイブ・ログ・モードの確認

    GGのソース・データベースはアーカイブ・ログ・モードで運用されている必要があります。下記コマンドでアーカイブ・ログ・モードで運用されているか確認することができます。

    ```sql
    -- アーカイブ・ログ・モードの確認
    archive log list
    ```

1. ENABLE_GOLDENGATE_REPLICATIONパラメータの設定
ENABLE_GOLDENGATE_REPLICATIONパラメータを設定して、GGが利用するデータベースの機能を有効化します。

    ```sql
    -- ENABLE_GOLDENGATE_REPLICATIONパラメータの確認
    show parameter enable_goldengate_replication
    -- ENABLE_GOLDENGATE_REPLICATIONパラメータの有効化
    alter system set enable_goldengate_replication=true;
    ```

1. サプリメンタル・ロギングの設定

    GGに必要な情報がREDOログに記録されるように、ソース・データベースに対して サプリメンタル・ロギングの設定を行います。

    下記コマンドで、サプリメンタル・ロギング・モードか、および強制ロギング・モードか確認します。

    ```sql
    -- サプリメンタル・ロギング・モードか、および強制ロギング・モードか確認
    select supplemental_log_data_min, force_logging from v$database;
    ```

    どちらかにNOがあった場合下記コマンドでモードを実行し、両方がYESになるように変更します。

    ```sql
    -- サプリメンタル・ロギング・モードの設定
    alter database add supplemental log data;
    -- 強制ロギング・モードの設定
    alter database force logging;
    ```

<BR>

+ **Note :サプリメンタル・ロギングとは**
  + 一般的にREDOログ・ファイルは、インスタンス・リカバリおよびメディア・リカバリに使用されます。これらの操作に必要なデータは、REDOログ・ファイルに自動的に記録されます。GoldenGateはREDOログから変更データを取得しますが、通常のREDOログの情報では足りないため、追加で必要な情報をREDOログ・ファイルに記録する必要があります。REDOログに追加の列を記録するためのデータベース機能をサプリメンタル・ロギングと呼びます。


<BR>

<a id="anchor2"></a>

# 2. ターゲット・データベースの設定

1. ターゲット・データベースであるADBのggadminユーザのアンロックを行います。
    
    Autonomous DatabaseにはGoldenGate実行用のユーザがデータベース作成時点から用意されています。初期状態ではこのユーザはロックされていますので、アンロックを行っていきます。Aunotomous Databaseのデータベース・アクションを開きます。
   ![alt text](image-16.png)

1. データベース・ユーザを選択します。

    ![alt text](image-14.png)

1. データベースのユーザ一覧が表示されます。既存で用意されているggadminユーザを見つけてください。

    ![データベース・ユーザ](userunlock2.png)

1. ggadminユーザのメニューボタンを開き **編集** を選択します。

    ![データベース・ユーザ](userunlock3.png)

1. ggadminユーザのパスワードを設定し、アンロックします。

    ![データベース・ユーザ](userunlock4.png)

これでターゲット側のGGユーザを利用する準備ができました。

最後に念のため、データ連携用のHRスキーマに権限設定を行います。

6. ADBのHRスキーマに権限設定を行います。 

    ```sql
    -- 必要なユーザ権限の付与
    grant create session to "HR";
    alter user "HR" account unlock;
    grant connect, resource, dwrole to "HR";
    grant unlimited tablespace to "HR";
    ```
これでターゲット・データベース側のすべての準備が整いました。

<BR>

<a id="anchor3"></a>

# 3. OCI GGデプロイメントの作成
OCI GGデプロイメントを作成していきます。

1. OCIコンソール画面左上の **メニュー** をクリックし、サービス一覧から **Oracle Database**、**GoldenGate** を選択し、GoldenGateのサービス画面を表示します。
    ![サービス一覧](menu.png)

1. **デプロイメントの作成** をクリックすると作成ウィンドウが立ち上がります。
    ![デプロイメントの作成](deploy.png)

1. 以下の記載例を参考に各項目を入力します。
    - **名前** - 任意
    - **説明** - 任意
    - **タイプ** - 開発またはテスト
    - **OCPU数** - 1から24までの値で選択してください。動作確認であれば1OCPUで構いません。<BR>実運用の参考値としてREDO生成量 60GB/h 程度であれば4OCPU＋自動スケーリングを選択してください。
    - **自動スケーリング** - 選択したOCPU数の最大3倍までの間でOCPUの利用率によって自動的にスケーリングされます。スケーリングはダウンタイムなくオンラインで実行され、<BR>1時間あたりに消費されたOCPUの実平均が課金対象となります。
    - **サブネット** - 任意
    - **ライセンス・タイプの選択** - 任意
    - **GoldenGateコンソール・パブリック・アクセスの有効化** - 任意（パブリック・エンドポイントの作成、エンドポイントのカスタマイズが可能であることをご確認ください。本チュートリアルではパプリック・エンドポイントにチェックを入れています。)

    ![alt text](image-17.png)
    ![alt text](image-18.png)

    **Next** をクリックします。

1. GoldenGateの詳細入力欄に、各項目を入力します。
    - **デプロイメント・タイプ** - データ・レプリケーション
    - **テクノロジ** - Oracle Database
    - **GoldenGateインスタンス名** - 任意（例：gginstance）
    - **資格証明ストア** - GoldenGate
    - **管理者ユーザ名** - 任意 (例:oggadmin)
    - **パスワード・シークレット** - 任意

    パスワード・シークレットがない場合は、**パスワード・シークレットの作成** をクリックします。
    既にパスワード・シークレットがある場合は、次のステップはスキップします。

    ![alt text](image-20.png)

1. 以下の記載例を参考に各項目を入力します。
    - **名前** - 任意（LLSecret）
    - **ユーザー・パスワード** - 任意

    **作成** をクリックします。

    ![alt text](image-19.png)

1. **作成** をクリックするとデプロイメントの作成が開始されます。
    
    ![デプロイメントの作成4](deploy4.png)

1. デプロイメントの作成が完了すると、アイコンが緑色に変わります。
今回は15分程度で完了しました。

    ![デプロイメントの作成5](deploy5.png)

<BR>

<a id="anchor4"></a>

# 4. データベースの登録
OCI GGで利用するソースデータベース、ターゲットデータベースをOCI上に登録していきます。
OCI上にデータベースを登録しておくことで、この後の工程でExtract,Replicatの作成を行うことができます。

1. GoldenGateのサービス画面から **接続** を選択し、**接続の作成** をクリックします。
    ![alt text](image-21.png)

1. 一般情報入力欄に、各項目を入力します。まずはソースDBとなるBaseDBの登録を行っていきます。
    - **名前** - 任意
    - **データベース・タイプ** - OCI上のどのデータベースを登録するかを選択します。<br>
    今回はOCI上のBaseDBをソースDBとして登録するため、**Oracle Database** を選択します。

    ![alt text](image-22.png)

    - **データベース詳細** -  データベースの選択
    - **データベース・システム** - 登録したいデータベース・システムを選択します。
    BaseDBの場合データベース・システムを選択することでデータベース接続文字列まで自動入力されます。
    - **データベース・ホーム** - 任意
    - **データベース** - 任意
    - **データベース・ユーザ名** - 任意<br>今回はあらかじめ作成しておいた **c##oggadmin** を指定します。
    - **データベース・ユーザ・パスワード** - 入力したデータベース・ユーザのパスワードを指定してください。
    - **データベース・ウォレット** - 任意
    - **ネットワーク接続** - 共有エンドポイント

    ![alt text](image-25.png)

1. ターゲットとなるADBも同様にデータベースを登録します。
    
    ![alt text](image-23.png)
    ![alt text](image-24.png)

<BR>
    これでデータベースの登録は完了です。



<BR>

<a id="anchor5"></a>

<BR>

# 5. Extractの作成
ここからはOCI GGのコンソール画面に接続し、BaseDBからデータを抽出するためのExtractを作成していきます。

1. デプロイメントの詳細画面から **コンソールの起動** を選択します。 
    ![コンソールの起動](extract1.png)

1. **Oracle GoldenGate管理サーバー** のサインイン画面にてデプロイメント作成時に指定したユーザ名、パスワードを入力してサインインします。 
    ![コンソールサインイン](extract2.png)

1. サインイン後、左上のメニューボタンから **構成** を選択します。
    ![コンソールサインイン2](extract3.png)

1. 追加したいデータベースの **データベースへの接続** を選択します。今回はソースデータベースであるBaseDBへ接続します。
    ![extract1](extract4.png)

1. 画面下部に表示されたTRANDATA情報の **＋** ボタンを選択し、抽出したいスキーマ、表、プロシージャを入力していきます。本チュートリアルではhrスキーマを入力し **発行** ボタンを選択します。
    ![extract2](extract5.png)

1. 発行後に検索ボタンを選択し、スキーマ名を入力することで発行の確認ができます。
    ![extract3](extract6.png)

1. ここから実際にExtractを追加していきます。**概要** 画面に戻り、Extractの **＋** ボタンを選択します。
    ![extract4](extract7.png)

1. 抽出タイプ選択画面にて **統合Extract** を選択し次へいきます。
    ![extract5](extract8.png)

1. 抽出オプション入力欄に、各項目を入力します。<br>
本チュートリアルでは必須項目のみ入力していきます。<br>
入力した項目は下記の通りです。
     - **プロセス名** - hr1
     - **トレイル名** - h1
     - **PDBに登録**  - DB0701_PDB1 (**資格証明別名** 選択後に表示されます)
     - **資格証明ドメイン**  - OracleGoldenGate
     - **資格証明別名**  - sourceBaseDB
    ![extract6](extract9.png)
    ![extract7](extract10.png)

1. パラメータ・ファイル入力欄にパラメータを入力します。<br>
自動入力した値に加えてTABLE句を記載する必要があります。<br>
今回は下記内容を追記しています。
    ```sql
    TABLE DB0701_pdb1.hr.*;
    ```
    ![extract8](extract11.png)

1. **作成および実行** を選択しExtractを作成します。**概要** 画面にて作成したExtractが表示されます。
    ![extract9](extract12.png)

これでExtractの作成は完了です。

<BR>

<a id="anchor6"></a>

# 6. チェックポイント表の作成
非統合Replicatで必要になるチェックポイント表を作成していきます。

1. **構成** 画面から、ターゲットとなるADBの **データベースへの接続** ボタンを選択します。
    ![chk1](chk1.png)

1. 画面下部に表示された**チェックポイント**の **＋** ボタンを選択し、チェックポイント表の名前を入力します。本チュートリアルでは**GGADMIN.CHKDATA**と入力し **発行** ボタンを選択します。
    ![chk2](chk2.png)

1. 作成されたチェックポイント表が表示されます。
    ![chk3](chk3.png)

これでチェックポイント表の作成は完了です。

<BR>

<a id="anchor7"></a>

# 7. Replicatの作成
続いて適用プロセスであるReplicatを作成していきます。

1. **概要** 画面から、Replicatの **＋** ボタンを選択します。
    ![replicat1](replicat1.png)

1. **Replicatタイプ** 選択画面から、**非統合Replicat** を選択します。
    ![replicat2](replicat2.png)

1. **Replicatオプション** 入力欄に、各項目を入力します。<br>
本チュートリアルでは必須項目のみ入力していきます。<br>
入力した項目は下記の通りです。
     - **プロセス名** - rep1
     - **資格証明ドメイン**  - OracleGoldenGate
     - **資格証明別名**  - targetADB
     - **トレイル名** - h1 (extract作成時に指定したトレイル名を入力)
     - **チェックポイント表** - GGADMIN.CHKDATA (チェックポイント表作成時に指定した表名を入力)
    ![replicat3](replicat3.png)


1. **パラメータ・ファイル** 画面にて、Replicatに関するパラメータを入力することができます。**作成および実行**を選択します。
今回は下記内容を追記しています。
    ```sql
    MAP pdb1.hr.*, TARGET hr.*;
    ```
    ![replicat4](replicat4.png)

1. **概要** 画面に遷移し、作成したReplicatが表示されます。
    ![replicat5](replicat5.png)


これでReplicatの作成は完了です。


<BR>
<a id="anchor8"></a>

# 8. データ連携の確認
Extract、Replicatの作成がそれぞれできました。最後にデータが連携されていることを確認しましょう。

1. ソース・データベースBaseDBのemployees表を1件更新します。  

    ```sql
    -- EMPLOYEES表のレコードを1件更新
    UPDATE HR.EMPLOYEES SET FIRST_NAME = 'Oracle' WHERE EMPLOYEE_ID = 100;
    ```

1. ターゲット・データベースADBにて更新が反映されているかを確認しましょう。

    ```sql
    -- 更新レコードを検索
    SELECT * FROM HR.EMPLOYEES WHERE EMPLOYEE_ID = 100;
    ```
1. データ連携ができていればADB側でも更新が確認できます。
    ![test1](test1.png)



<a id="anchor9"></a>

<BR>

# 参考資料
OCI GoldenGate マニュアル
+ [Oracle Cloud Infrastructure GoldenGate](https://docs.oracle.com/ja-jp/iaas/goldengate/index.html)
+ [Using Oracle Cloud Infrastructure GoldenGate](https://docs.oracle.com/en/cloud/paas/goldengate-service/using/index.html)

<BR>

[ページトップへ戻る](#anchor0)