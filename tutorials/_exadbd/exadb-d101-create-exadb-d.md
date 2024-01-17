---
title: "101 : ExaDB-Dを使おう"
excerpt: "Oracle CloudでExadataが利用可能なサービスであるExaDB-Dの作成方法について紹介します。"
order: "2_101"
layout: single
header:
  teaser: "/exadbd/exadb-d101-create-exadb-d/teaser.png"
  overlay_image: "/exadbd/exadb-d101-create-exadb-d/teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=797
---

<a id="anchor0"></a>

# はじめに
**Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D)** は、Oracle Databaseが高い可用性を備えつつ高いパフォーマンスを発揮できる**Oracle Exadata Database Machine (Exadata)**が利用可能なサービスです。同じようにOCI上でExadataを利用可能なサービスとしては、Autonomous Data WarehouseやAutonomous Transaction Processing などのAutonomous Databaseのサービスがありますが、ExaDB-D が他のサービスと大きく違うところは、全オプションが使える**専有型のUser-Managedサービス**であるということです。

+ **専有型** : H/Wもユーザー専有となり、他のユーザーの環境と分離されるため、セキュリティ・性能を担保できます。
+ **User-Managed サービス** : OS以上は顧客管理。OS上の構築・運用・管理に有効な機能を、クラウドのツールでも提供。パッチ適用やメンテナンスの実施判断・作業タイミングは顧客判。OSログインが可能でこれまで同様の管理方法を用いることができる (OS権限が必要な変更作業、サード・パーティのAgentの導入、ローカルにログやダンプファイルの配置など)ので、別途インスタンスやストレージサービスを立てる必要はありません。

また、オンライン・スケーリング (停止なし)での1時間単位での柔軟な価格体系、デフォルトでの可用性構成や容易に高可用性構成が組めること、PaaSとしてのプロビジョニングや管理面などのメリットがあります。

![](2022-06-27-13-37-50.png)

**目次 :**
  + [1. Exadata Infrastructureの作成](#1-exadata-infrastructureの作成)
  + [2. Exadata VMクラスタの作成](#2-exadata-vmクラスタの作成)
  + [3. データベースの作成](#3-データベースの作成)
  + [4. DBシステムへのアクセス](#4-dbシステムへのアクセス)
  + [5. データベース(PDB)へのアクセス](#5-データベースpdbへのアクセス)
  + [6. PDB上のスキーマへのアクセス](#6-pdb上のスキーマへのアクセス)

**前提条件 :**
+ **シェイプの確認**
    
    ExaDB-Dで利用したいシェイプ名を事前に確認しましょう。ExaDB-Dで利用可能なシェイプについては[Oracle Cloud Infrastructure Documentation - Oracle Exadata Database Service on Dedicated Infrastructure Description](https://docs.oracle.com/en-us/iaas/exadatacloud/exacs/exa-service-desc.html#GUID-9E090174-5C57-4EB1-9243-B470F9F10D6B){:target="_blank"}を参照ください。
+ **サービス制限の確認・引き上げのリクエスト**
    
    ExaDB-Dを利用するには、まずサービス制限を引き上げる必要があります。サービス制限については[もしもみなみんがDBをクラウドで動かしてみたら - 第16回 サービス制限について](https://blogs.oracle.com/otnjp/post/minamin-cloud-016-servicelimits){:target="_blank"}を参照ください。
+ **テナント内の準備**
    
    次に、環境作成する前に必要な環境確認やインフラレイヤーでの準備を、下記のチュートリアルをみながら準備しましょう。
    + [OCIコンソールにアクセスして基本を理解する](https://oracle-japan.github.io/ocitutorials/beginners/getting-started/){:target="_blank"}
    + [クラウドに仮想ネットワーク(VCN)を作る](https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn/){:target="_blank"}

    ExaDB-D用のVCN内の設定として、前提条件は下記のようなものがあります。
    + ExaDB-Dでは、２つのサブネット(クライアント・サブネットとバックアップ・サブネット)が必要なので２つ作成
    + クライアント・サブネット内では全てのノード間で、TCPとICMPの疎通が必要なのでセキュリティ・リストを設定
    + IPアドレス・スペースの要件
        + Exadata Database Cloudで利用するサブネットは下記と重複しないこと

            X8以前： 192.168.*(特に192.168.128.0/20)

            X8M以降： 100.64.0.0/10

        + クライアント・サブネットで192.168.16.16/28と重複しないこと
        + 複数システムを利用する場合、相互のIPアドレスが重複しないこと
        + シェイプ(ラック・サイズ)に応じて、必要なアドレス数を用意 ([Oracle Cloud Infrastructure Documentation - Network Setup for Exadata Cloud Infrastructure Instances](https://docs.oracle.com/en-us/iaas/exadatacloud/exacs/ecs-network-setup.html#vcn-subnets){:target="_blank"}を参照ください。)
        ![](2022-06-27-17-38-01.png)

**所要時間 :** 約6時間

<BR>



# 1. Exadata Infrastructureの作成

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1. 利用したいコンパートメントを**リスト範囲**の**コンパートメント**から選択します。

    ![](2022-11-15-16-30-05.png)

1. 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、**リージョン**の一覧から選択します。

    ![](2022-11-15-16-32-47.png)

1. 画面左の **専用インフラストラクチャ上のOracle Exadata Database Service** の下の **Exadata Infrastructure** をクリックします。

    ![](2022-07-21-15-16-25.png)

1. **Exadata Infrastructureの作成** をクリックします。

    ![](2022-07-05-14-44-12.png)

1. **Exadata Infrastructureの作成** の各項目は以下のように設定します。その他の設定はデフォルトのままにします。
    + **Exadataインフラストラクチャの基本情報の指定**
      + **コンパートメント** - 利用したいコンパートメントを選択します。
      + **表示名** - 任意
    + **可用性ドメインの選択** - 利用する可用性ドメインを選択します。 (東京や大阪の場合は1つしかありません。)
    + **Exadataクラウド・インフラストラクチャ・モデルの選択** - 利用するシェイプ (ExadataのRackモデル)を選択します。（本チュートリアルではX9M-2を選択します。）
    + **コンピュートおよびストレージ構成** (X8M-2およびX9M-2を選択した場合。※Exadataベース、X6-2、X7-2、X8-2を選択した場合は設定が異なります。)
      + **データベース・サーバー** - 使用したいデータベース・サーバーの台数を指定します。 (最低2台)
      + **ストレージ・サーバー** - 使用したいストレージ・サーバーの台数を指定します。 (最低3台)

    ![](2022-07-05-16-56-55.png)

    + **システム構成の選択** (X6-2、X7-2、X8-2を選択した場合) - 使用したいシステム構成を選択します。

    ![](2022-07-05-15-03-15.png)

    設定後、**Exadata Infrastructureの作成**をクリックします。作成まで1分ほどかかります。

    ![](2022-07-05-15-04-26.png)

    ![](2022-07-05-17-16-41.png)

<BR>

# 2. Exadata VMクラスタの作成

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)


1. **Exadata VMクラスタの作成** をクリックします。

    ![](2022-07-05-15-09-51.png)

    <a id="anchor1"></a>

1. **Exadata VMクラスタの作成** の各項目は以下のように設定します。その他の設定はデフォルトのままにします。
    + **コンパートメント** - 利用したいコンパートメントを選択します。
    + **表示名** - 任意
    + **クラスタ名** - 任意もしくはなしでも可能
    + **[コンパートメント名]のExadataインフラストラクチャの選択** - [1. Exadata Infrastructureの作成](#1-exadata-infrastructureの作成)で作成したExadataインフラストラクチャを選択します。
    + **VMクラスタの構成**
        + **仮想マシン当たりのOCPU数を指定** - 仮想マシン当たりで利用したいOCPU数を指定します。　(本ガイドではデフォルトの2を選択します。)

    ![](2022-07-05-16-46-28.png)

    + **SSHキーの追加** - **ペアの生成**、**SSHキー・ファイルのアップロード**、**SSHキーの貼付け**のいずれかの選択肢よりSSHキーを追加します。

    ![](2022-07-05-16-51-28.png)

    + **ネットワーク設定の構成**
        + **[コンパートメント名]の仮想クラウド・ネットワークの選択** - 前提条件で用意したVCNを指定します。
        + **[コンパートメント名]のクライアントのサブネットの選択** - 前提条件で用意したクライアント用のサブネットを選択します。
        + **[コンパートメント名]のバックアップ・サブネットの選択** - 前提条件で用意したバックアップ用のサブネットを選択します。
        + **ホスト名接頭辞** - 任意

    ![](2022-09-15-16-11-38.png)

    + **ライセンス・タイプの選択** - **含まれるライセンス**、**ライセンス持ち込み(BYOL)** のいずれかを選択します。
    + **拡張オプション** (※こちらの設定はオプションです。)
        + **管理**
            + **タイムゾーン** - Asia/Tokyo (ブラウザ検出済み)を選択
    
    ![](2022-09-15-16-19-30.png)

    設定後、**Exadata VMクラスタの作成** をクリックします。作成まで3~4時間ほどかかります。

    ![](2022-07-05-17-01-38.png)

    ![](2022-07-05-17-18-08.png)

<BR>

# 3. **データベースの作成**

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1.  [2. Exadata VMクラスタの作成](#2-exadata-vmクラスタの作成)で作成した**Exadata VMクラスタ**の表示名をクリックします。

    ![](2022-07-05-17-14-07.png)

1. **データベースの作成** をクリックします。

    ![](2022-07-05-17-19-52.png)

1. **データベースの作成** の各項目は以下のように設定します。その他の設定はデフォルトのままにします。
    + **データベースの基本情報**
        + **データベース名** - 任意
        + **一意のデータベース名** - 任意もしくはなしでも可能
        + **データベースのバージョン** - 利用したいデータベースのバージョンを選択します。
        + **PDB名** - 任意もしくはなしでも可能 (なしの場合、デフォルトでPDB1と設定されます。)

    ![](2022-07-05-17-24-24.png)

    + **データベース・ホームの指定**
        + **データベース・ホームの表示名** - 任意
        + **データベース・イメージ** - データベース・イメージの変更をクリックします。
        **データベース・ソフトウェア・イメージ**の選択画面で、使用したい**イメージ・タイプ**と**Oracle Databaseバージョン**選択します。

    ![](2022-07-05-17-27-52.png)

    設定後、**選択**をクリックします。

    ![](2022-07-05-17-29-59.png)

    + **管理者資格証明の作成**
        + **パスワード** - 任意 (sysスキーマのパスワードです。後から使用しますので、忘れずにメモしておいてください。)
        + **パスワードの確認** - 任意 (sysスキーマのパスワードです。後から使用しますので、忘れずにメモしておいてください。)
    + **ワークロード・タイプの選択** - **トランザクション処理**か**データ・ウェアハウス**のいずれかを選択します。
    + **データベース・バックアップの構成**
    + **自動バックアップの有効化** からチェックを外します。自動バックアップは作成後に有効化可能です。この章ではチェックを外します。
    
    ![](2022-07-05-17-35-33.png)

    設定後、**データベースの作成** をクリックします。作成まで40分ほどかかります。

    ![](2022-07-08-17-27-33.png)

    ![](2022-07-05-17-37-53.png)

<BR>

<a id="anchor2"></a>

# 4. **DBシステムへのアクセス**

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1.  [2. Exadata VMクラスタの作成](#2-exadata-vmクラスタの作成)で作成した**Exadata VMクラスタ**の表示名をクリックします。

    ![](2022-07-05-17-14-07.png)

1. **リソース**の一覧から**仮想マシン**をクリックします。

    ![](2022-07-05-17-41-13.png)

1. 接続したいノードの**パブリックIPアドレス**に表示されているIPアドレスをメモします。

    ![](2022-07-05-17-42-17.png)

1. 任意のターミナルソフトを起動し、以下の情報でssh接続します。
    - **IPアドレス** - 上記ステップで確認したインスタンスの **パブリックIPアドレス**
    - **ポート** - 22 (デフォルト)
    - **ユーザー** - opc (DBシステムは、接続用に予め opc というユーザーが用意されています)
    - **SSH鍵** - [2. Exadata VMクラスタの作成の3.](#anchor1)で追加した公開鍵と対になる秘密鍵を使用します。
    - **パスフレーズ** - 秘密鍵にパスフレーズが設定されている場合は指定してください。
    下記は Tera Term を利用した場合の接続の設定例です。

    ![](2022-07-05-17-52-20.png)
    
    ![](2022-07-05-17-54-10.png)

    接続が成功すると以下のように表示されます。

    ![](2022-07-05-17-55-08.png)

1. oracleユーザーにログインします。

    実行コマンド
    ```
    sudo su -　oracle
    ```
    実行例
    ```
    [opc@exa1-tmhmo1 ~]$ sudo su - oracle
    Last login: Fri Jul  8 17:30:15 JST 2022
    [oracle@exa1-tmhmo1 ~]$
    ```

    ログアウトせず、そのまま次に進んでください。

<BR>

# 5. **データベース(PDB)へのアクセス**

<a id="anchor3"></a>

1. 環境変数設定ファイルの読み込み

    oracleユーザーのホーム・ディレクトリ(/home/oracle)に環境変数設定ファイルが自動で生成されていて、そのファイルの中身を読み込むことで簡単に環境変数が設定され、データベースの接続が簡素化されます。
    
    以下のように環境変数設定ファイルを確認し、読み込みます。また、環境変数の設定が反映されたか確認します。
    
    実行コマンド
    ```
    ls
    . <データベース名> .env
    env | grep ORACLE
    ```

    実行例
    ```
    [oracle@exa1-tmhmo1 ~]$ ls
    DB.env
    [oracle@exa1-tmhmo1 ~]$ . DB.env
    [oracle@exa1-tmhmo1 ~]$ env | grep ORACLE
    ORACLE_UNQNAME=DB_bkc_kix
    ORACLE_SID=DB1
    ORACLE_BASE=/u02/app/oracle
    ORACLE_HOSTNAME=exa1-tmhmo1.sub07160524340.testvcn.oraclevcn.com
    ORACLE_HOME=/u02/app/oracle/product/19.0.0.0/dbhome_1
    ```    

1. データベース(CDB)に接続する

    以下のコマンドを用いて[3. データベースの作成](#3-データベースの作成)で作成したデータベースのコンテナ・データベース (CDB)に対してsysユーザでSQL*Plusから接続します。

    実行コマンド
    ```
    sqlplus / as sysdba
    ```

    実行例
    ```
    [oracle@exa1-tmhmo1 ~]$ sqlplus / as sysdba

    SQL*Plus: Release 19.0.0.0.0 - Production on Mon Jul 4 22:15:37 2022
    Version 19.15.0.0.0

    Copyright (c) 1982, 2022, Oracle.  All rights reserved.


    Connected to:
    Oracle Database 19c EE Extreme Perf Release 19.0.0.0.0 - Production
    Version 19.15.0.0.0

    SQL>
    ```

    接続しているデータベースのデータベース名とコンテナ名を確認します。

    実行コマンド
    ```sql
    show parameter db_name
    show con_name
    ```

    実行例
    ```
    SQL> show parameter db_name

    NAME                                 TYPE        VALUE
    ------------------------------------ ----------- ------------------------------
    db_name                              string      DB
    SQL> show con_name

    CON_NAME
    ------------------------------
    CDB$ROOT
    ```

1. PDBに接続する

    デフォルトで作成されているPDBを確認し、PDBインスタンスに接続します。

    実行コマンド
    ```sql
    show pdbs
    alter session set container = PDB ;
    ```

    実行例
    ```
    SQL> show pdbs

        CON_ID CON_NAME                       OPEN MODE  RESTRICTED
    ---------- ------------------------------ ---------- ----------
            2 PDB$SEED                       READ ONLY  NO
            3 PDB                            READ WRITE NO
    SQL> alter session set container = PDB ;

    Session altered.

    SQL>
    ```

2. PDB上にスキーマを作成します。

    尚、ここでは便宜上、最低限必要な権限を付与していますが、要件に応じて権限・ロールを付与するようにしてください。

    実行コマンド
    ```sql
    create user TESTUSER identified by <任意のパスワード> ;
    grant CREATE SESSION, CONNECT,RESOURCE,UNLIMITED TABLESPACE to TESTUSER ;
    exit
    ```

    実行例
    ```
    SQL> create user TESTUSER identified by Welcome1 ;

    User created.

    SQL> grant CREATE SESSION, CONNECT,RESOURCE,UNLIMITED TABLESPACE to TESTUSER ;

    Grant succeeded.
    
    SQL> exit
    Disconnected from Oracle Database 19c EE Extreme Perf Release 19.0.0.0.0 - Production
    Version 19.15.0.0.0
    [oracle@exa1-tmhmo1 ~]$
    ```

<BR>

# 6. **PDB上のスキーマへのアクセス**

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1.  [2. Exadata VMクラスタの作成](#2-exadata-vmクラスタの作成)で作成した**Exadata VMクラスタ**の表示名をクリックします。

    ![](2022-07-05-17-14-07.png)

1. **データベース**の一覧から[3. データベースの作成](#3-データベースの作成)で作成したデータベースの名前をクリックします。

    ![](2022-07-05-17-59-15.png)

1. **リソース**の一覧から**プラガブル・データベース**をクリックします。

    ![](2022-07-05-18-00-11.png)

1. **プラガブル・データベース**の一覧から接続したいPDBの名前をクリックします。

    ![](2022-07-05-18-06-35.png)

1. **PDB接続**をクリックします。

    ![](2022-07-05-18-07-21.png)

1. **簡易接続**の接続文字列の右にある**コピー**をクリックし、メモします。

    ![](2022-07-05-18-08-16.png)

1. ダイアログを閉じます。

    ![](2022-07-05-18-09-40.png)

1. DBシステムへアクセスしてoracleユーザとしてログインします。([4. DBシステムへのアクセス](#anchor2)を参照ください。)



1. 環境変数設定ファイルを読み込みます。([5. データベース(PDB)へのアクセスの1.](#anchor3)を参照ください。)



1. PDB上のスキーマに接続します。

    実行コマンド
    ```
    sqlplus <スキーマ名>/<パスワード>@<8.でメモした接続文字列>
    ```

    実行例
    ```
    [oracle@exa1-tmhmo1 ~]$ sqlplus testuser/Welcome1@exa1-tmhmo-scan.sub07160524340.testvcn.oraclevcn.com:1521/DB_PDB.paas.oracle.com

    SQL*Plus: Release 19.0.0.0.0 - Production on Tue Jul 5 10:00:30 2022
    Version 19.15.0.0.0

    Copyright (c) 1982, 2022, Oracle.  All rights reserved.


    Connected to:
    Oracle Database 19c EE Extreme Perf Release 19.0.0.0.0 - Production
    Version 19.15.0.0.0

    SQL>
    ```

1. 接続情報を確認します。

    実行コマンド
    ```sql
    show con_name
    show user
    ```

    実行例
    ```
    SQL> show con_name

    CON_NAME
    ------------------------------
    PDB
    SQL> show user
    USER is "TESTUSER"
    ```

以上で この章の作業は完了です。

<BR>

<a id="anchor11"></a>

# 参考資料
+ [Oracle Cloud Infrastructure Documentation - Oracle Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en-us/iaas/exadatacloud/index.html){:target="_blank"}
+ [Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) サービス詳細](https://speakerdeck.com/oracle4engineer/exadata-database-cloud-technical-detail){:target="_blank"}

<BR>

[ページトップへ戻る](#anchor0)
