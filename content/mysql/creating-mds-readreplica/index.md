---
title: "その12 - MySQL HeatWaveでリードレプリカを構成する"
description: "MySQL HeatWaveでは参照処理の負荷分散を実現できるリードレプリカも簡単に構成できます。リードレプリカを構成し、動きを確認してみましょう！"
weight: "120"
images:
- "mysql/creating-mds-readreplica/MySQLLogo_teaser.png"
tags:
- データベース
aliases: "/beginners/creating-mds-readreplica/"
#link: https://oracle-japan.github.io/ocitutorials/beginners/creating-mds-readreplica/
---
Oracle Cloud Infrastructure では、MySQL HeatWaveが利用できます。MySQL HeatWaveはAlways Freeの対象となっています。トライアルアカウント作成時に付与されるクレジットでも使用可能です。

このチュートリアルでは、参照処理の負荷分散を実現できるリードレプリカ([コンソールやドキュメントでの名称は「読取りレプリカ」](https://docs.oracle.com/ja-jp/iaas/mysql-database/doc/read-replica.html))を構成し、動きを確認します。リードレプリカもエンドポイントもマネージドで提供されているため、簡単に利用できるのが特徴です。

**所要時間 :** 約50分 (約30分の待ち時間含む)

**前提条件 :**

1. Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること
2. [OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)](../../beginners/getting-started/) を完了していること
3. [クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2)](../../beginners/creating-vcn/) を完了していること
4. [インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)](../../beginners/creating-compute-instance/) を完了していること

**注意 :** チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。
<br>

**目次：**

- [1. リードレプリカとは?](#anchor1)
- [2. 本チュートリアルで作成する構成の構成図](#anchor2)
- [3. MySQL HeatWaveの作成(ソースとなるMySQL HeatWave)](#anchor3)
- [4. リードレプリカの作成](#anchor4)
- [5. リードレプリカの確認(ロードバランサー経由での接続)](#anchor5)
- [6. リードレプリカへの接続確認(リードレプリカに直接接続)](#anchor6)
- [7. リードレプリカの確認)](#anchor7)
<br>

<a id="anchor1"></a>

# 1. リードレプリカとは?

リードレプリカは、参照処理を負荷分散する目的で使用される参照専用の複製です。参照処理の同時実行数が多いシステムでは、リードレプリカを使って負荷分散することが効果的です。

MySQL HeatWaveのリードレプリカは非同期レプリケーションを使って構成されています。このためリードレプリカから参照したデータは最新のデータでは無い可能性があることに注意して下さい。ソースのノードで更新したデータは随時リードレプリカに伝搬されるため、参照処理をリードレプリカで処理しても問題ないケースが多いです。ただし、必ず最新のデータを参照する必要がある処理についてはソースのノードから参照する必要があります。

リードレプリカへのアクセス方法は、以下2つの方法があります。なお、ロードバランサーの設定は自動化されているため、ユーザーがロードバランサーの存在や設定を意識する必要はありません。

1. ロードバランサーを経由してアクセスする。この場合、接続先はリードレプリカ全体でロードバランスされる。<br>(Amazon Auroraのリーダーエンドポイントに相当)<br>
2. リードレプリカ毎に設定されたエンドポイント(プライベートIPアドレス)を使用してアクセスする。この場合、それぞれのリードレプリカに直接接続する。<br>(Amazon Auroraのインスタンスエンドポイントに相当)

また、リードレプリカに関して、本チュートリアル作成時点(2025年9月時点)で以下の制限事項があります。

　**リードレプリカの制限事項(2023年3月時点)**
  - ソースとなるMySQL HeatWaveはECPUが8以上またはOCPUが4以上のシェイプが必要
  - リードレプリカの個数は最大18個まで
  - ロードバランサーからリードレプリカにアクセスするための帯域は最大8Gbps
  - Oracle Cloud Infrastructureネットワーク・ロード・バランサのバックエンド・サーバーとして構成することはできない
  - IPv4のみのサブネット上に作成する必要あり
<br>
<br>

<a id="anchor2"></a>

# 2. 本チュートリアルで作成する構成の構成図

本チュートリアルでは、以下の構成を作成します。

<div align="center">
<img width="900" alt="img_diagram.png" src="img_diagram.png" style="border: 1px black solid;">
</div>
<br>

<a id="anchor3"></a>

# 3. MySQL HeatWaveの作成(ソースとなるMySQL HeatWave)
⚠️**注意**: DBシステム作成時に**ハードウェアの構成**での「**HeatWaveクラスタの有効化**」はオフにしておいてください。

ソースとなるMySQL HeatWaveのDBシステムを作成します。[クラウドでMySQLデータベースを使う - Oracle Cloud Infrastructureを使ってみよう(その9)](../creating-mds/) の手順に従ってソースとなるMySQL HeatWaveを作成します。(その9)と区別するために、MySQL HeatWaveの名前は「**WriterMDS**」にします。また、「2. MySQL HeatWaveのDBシステムの作成」だけでなく、「3. セキュリティリストの修正(イングレス・ルールの追加)」、「4. MySQLクライアントのインストール」、「5. 作成したMySQL HeatWaveのDBシステムの確認」まで実行し、`world`データベース、`world_x`データベースも作成しておきます。

この時、前述の制限事項があるためECPUが8以上またはOCPUが4以上のシェイプのMySQL HeatWaveを作成して下さい。**ハードウェアの構成**部分の**シェイプの変更**をクリックして、ECPUが8以上またはOCPUが4以上のシェイプを選択します。以下のスクリーンショットは、CPUの種類がE4、CPU数が4 OCPU、メモリーサイズが64GBのシェイプ(MySQL.VM.Standard.E4.4.64GB)を選択した例です。
<br>
    ⚠️**注意**: スクリーンショットではOCPUのシェイプを使用していますが、2026年3月13日以降、すべてのOCPUシェイプが使用できなくなります。ECPUのシェイプの利用を推奨します。<br>


<div align="center">
<img width="700" alt="img1.png" src="img1.png" style="border: 1px black solid;">
</div>
<br>

<div align="center">
<img width="700" alt="img2.png" src="img2.png" style="border: 1px black solid;">
</div>
<br>

<div align="center">
<img width="700" alt="img3.png" src="img3.png" style="border: 1px black solid;">
</div>
<br>

<div align="center">
<img width="700" alt="img4.png" src="img4.png" style="border: 1px black solid;">
</div>
<br>

なお、現在MySQL HeatWaveでサポートされているシェイプについては、[こちら](https://docs.oracle.com/ja-jp/iaas/mysql-database/doc/supported-shapes.html)のドキュメントを参照して下さい。
<br>
<br>

<a id="anchor4"></a>

# 4. リードレプリカの作成

リードレプリカを2つ作成します。
<br>

1. 先ほど作成したMySQL HeatWave(WriterMDS)をコンソールから選択し、画面左下の**リソース** → **読取りレプリカ** をクリックします。そして表示された画面から**読取りレプリカの作成**をクリックします。

    <div align="center">
    <img width="700" alt="img5.png" src="img5.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="700" alt="img6.png" src="img6.png" style="border: 1px black solid;">
    </div>
    <br>

2. **名前**に「ReadReplica1」と入力し、**読取りレプリカの作成**をクリックします。**ReadReplica1**の状態が**作成中**になり、15分〜20分程度で状態が**アクティブ**に変わります。また、読取りレプリカの**アクティブ**の数が`1`になっていることも確認します。
(本ステップの待ち時間に、先行して次のステップも実行することでトータルの待ち時間を短縮できます)

    <div align="center">
    <img width="700" alt="img7.png" src="img7.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="700" alt="img8.png" src="img8.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="700" alt="img9.png" src="img9.png" style="border: 1px black solid;">
    </div>
    <br>

3. 同様の手順で2つ目のリードレプリカを作成します。名前は「ReadReplica2」で作成します。
<br>
<br>

    <div align="center">
    <img width="700" alt="img10.png" src="img10.png" style="border: 1px black solid;">
    </div>
    <br>

<a id="anchor5"></a>

# 5. リードレプリカへの接続確認(ロードバランサー経由での接続)

作成したリードレプリカへロードバランサー経由で接続する方法を確認します。
<br>

1. WriterMDSをコンソールから選択し、画面左下の**リソース** → **エンドポイント** をクリックします。そして表示された画面から**読取りレプリカ・ロード・バランサ**のIPアドレスを確認します。

    <div align="center">
    <img width="200" alt="img11.png" src="img11.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="800" alt="img12.png" src="img12.png" style="border: 1px black solid;">
    </div>
    <br>

2. 確認した**読取りレプリカ・ロード・バランサ**のIPアドレスを使用してリードレプリカに接続し、「`SHOW GLOBAL VARIABLES LIKE 'bind_address'`」を実行します。システム変数`bind_address`の設定値に含まれるIPアドレスより、どちらのリードレプリカに接続しているかを判断できます。以下の実行例では、設定値に「10.0.1.245(ReadReplica1のIPアドレス)」が含まれているため、**ReadReplica1**に接続できていることが確認できます。(**ReadReplica2**に接続される場合もあります)

    実行コマンド(コピー＆ペースト用)
    ```
    SHOW GLOBAL VARIABLES LIKE 'bind_address';
    ```

    実行例
    ```
    mysql> SHOW GLOBAL VARIABLES LIKE 'bind_address';
    +---------------+-----------------------------------------+
    | Variable_name | Value                                   |
    +---------------+-----------------------------------------+
    | bind_address  | 10.0.1.245/mysql,10.5.96.6/loadbalancer |
    +---------------+-----------------------------------------+
    1 row in set (0.00 sec)
    ```
    <br>

3. ロードバランサー経由の接続では、自動的にリードレプリカ間でロードバランスされることを確認します。前ステップの操作を繰り返し実行し、接続先が切り替わることを確認します。以下の実行例では、`mysql`コマンドラインクライアントの`-e`オプションを使用し、MySQL HeatWaveへ接続して「`SHOW GLOBAL VARIABLES LIKE 'bind_address'`」を実行することを繰り返し実行しています。(コマンドラインに直接パスワードを指定することに対する警告が出力されていますが、ここでは無視して下さい)<br><br>
接続によって「10.0.1.245(ReadReplica1のIPアドレス)」と「10.0.1.240(ReadReplica2のIPアドレス)」が切り替わっていることから、ロードバランスされていることが確認できます。

    実行コマンド例(コピー＆ペースト用)
    ```
    mysql -u root -pMySQL_8.0 -h 10.0.1.145 -e "SHOW GLOBAL VARIABLES LIKE 'bind_address'"
    ```

    実行例
    ```
    [opc@testvm1 ~]$ mysql -u root -pMySQL_8.0 -h 10.0.1.145 -e "SHOW GLOBAL VARIABLES LIKE 'bind_address'"
    mysql: [Warning] Using a password on the command line interface can be insecure.
    +---------------+-----------------------------------------+
    | Variable_name | Value                                   |
    +---------------+-----------------------------------------+
    | bind_address  | 10.0.1.245/mysql,10.5.96.6/loadbalancer |
    +---------------+-----------------------------------------+
    [opc@testvm1 ~]$ mysql -u root -pMySQL_8.0 -h 10.0.1.145 -e "SHOW GLOBAL VARIABLES LIKE 'bind_address'"
    mysql: [Warning] Using a password on the command line interface can be insecure.
    +---------------+-----------------------------------------+
    | Variable_name | Value                                   |
    +---------------+-----------------------------------------+
    | bind_address  | 10.0.1.245/mysql,10.5.96.6/loadbalancer |
    +---------------+-----------------------------------------+
    [opc@testvm1 ~]$ mysql -u root -pMySQL_8.0 -h 10.0.1.145 -e "SHOW GLOBAL VARIABLES LIKE 'bind_address'"
    mysql: [Warning] Using a password on the command line interface can be insecure.
    +---------------+-------------------------------------------+
    | Variable_name | Value                                     |
    +---------------+-------------------------------------------+
    | bind_address  | 10.0.1.240/mysql,10.5.51.254/loadbalancer |
    +---------------+-------------------------------------------+
    [opc@testvm1 ~]$ mysql -u root -pMySQL_8.0 -h 10.0.1.145 -e "SHOW GLOBAL VARIABLES LIKE 'bind_address'"
    mysql: [Warning] Using a password on the command line interface can be insecure.
    +---------------+-----------------------------------------+
    | Variable_name | Value                                   |
    +---------------+-----------------------------------------+
    | bind_address  | 10.0.1.245/mysql,10.5.96.6/loadbalancer |
    +---------------+-----------------------------------------+
    ```
    <br>

<a id="anchor6"></a>

# 6. リードレプリカへの接続確認(リードレプリカに直接接続)

作成したリードレプリカへ直接接続する方法を確認します。
<br>

1. WriterMDSをコンソールから選択し、画面左下の**リソース** → **エンドポイント** をクリックします。そして表示された画面から**ReadReplica1**と**ReadReplica2**のIPアドレスを確認します。2つのIPアドレスが異なるため、それぞれのIPアドレスを使用することで、任意のリードレプリカにアクセスできます。

    <div align="center">
    <img width="200" alt="img11.png" src="img11.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="800" alt="img13.png" src="img13.png" style="border: 1px black solid;">
    </div>
    <br>

2. 確認した**ReadReplica1**のIPアドレスを使用してリードレプリカに接続後、「`SHOW GLOBAL VARIABLES LIKE 'bind_address'`」を実行します。以下の実行例では、システム変数`bind_address`の設定値に「10.0.1.245(ReadReplica1のIPアドレス)」が含まれているため、**ReadReplica1**に接続できていることが確認できます。

    実行コマンド(コピー＆ペースト用)
    ```
    SHOW GLOBAL VARIABLES LIKE 'bind_address';
    ```

    実行例 (**ReadReplica1**で実行)
    ```
    mysql> SHOW GLOBAL VARIABLES LIKE 'bind_address';
    +---------------+-----------------------------------------+
    | Variable_name | Value                                   |
    +---------------+-----------------------------------------+
    | bind_address  | 10.0.1.245/mysql,10.5.96.6/loadbalancer |
    +---------------+-----------------------------------------+
    1 row in set (0.00 sec)
    ```
    <br>

3. 同様に、確認した**ReadReplica2**のIPアドレスを使用してリードレプリカに接続後、「`SHOW GLOBAL VARIABLES LIKE 'bind_address'`」を実行します。以下の実行例では、設定値に「10.0.1.240(ReadReplica2のIPアドレス)」が含まれているため、**ReadReplica2**に接続できていることが確認できます。

    実行コマンド(コピー＆ペースト用)
    ```
    SHOW GLOBAL VARIABLES LIKE 'bind_address';
    ```

    実行例 (**ReadReplica2**で実行)
    ```
    mysql> SHOW GLOBAL VARIABLES LIKE 'bind_address';
    +---------------+-------------------------------------------+
    | Variable_name | Value                                     |
    +---------------+-------------------------------------------+
    | bind_address  | 10.0.1.240/mysql,10.5.51.254/loadbalancer |
    +---------------+-------------------------------------------+
    1 row in set (0.00 sec)
    ```
    <br>

<a id="anchor7"></a>

# 7. リードレプリカの確認

リードレプリカにはソースのMySQL HeatWaveのスキーマやデータが複製され、その後の更新処理も伝播されることを確認します。また、リードレプリカは参照専用であることも確認します。
<br>

1. **ReadReplica1**に接続後、「`SHOW DATABASES`」を実行します。`world`データベース、`world_x`データベースが存在するため、リードレプリカ作成時点の**WriterMDS**が複製されていることが分かります。

    実行コマンド(コピー＆ペースト用)
    ```
    SHOW DATABASES;
    ```

    実行例 (**ReadReplica1**で実行)
    ```
    mysql> SHOW DATABASES;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sys                |
    | world              |
    | world_x            |
    +--------------------+
    6 rows in set (0.00 sec)
    ```
    <br>

2. ソースのMySQL HeatWaveで実行した更新処理がリードレプリカに反映されることを確認します。**WriterMDS**で`test`データベース、`test.test`テーブルを作成し、データを追加します。その後、**ReadReplica1**で`test.test`テーブルが存在することを確認し、追加されたデータが参照できることを確認します。以下の実行例ではそれぞれのMySQL HeatWaveでの操作をまとめて掲載していますが、コンソールを2つ開いてそれぞれ**WriterMDS**と**ReadReplica1**に接続し、1ステップずつ実行することで、各ステップ毎にリードレプリカに処理内容がレプリケーションされていることが確認できます。

    実行コマンド(コピー＆ペースト用：**WriterMDS**で実行)
    ```
    CREATE DATABASE ReadReplica;
    ```

    ```
    CREATE TABLE ReadReplica.test(id int AUTO_INCREMENT, col1 CHAR(10), PRIMARY KEY(id));
    ```

    ```
    INSERT INTO ReadReplica.test VALUES(1, "TEST");
    ```

    ```
    SELECT * FROM ReadReplica.test;
    ```

    実行コマンド(コピー＆ペースト用：**ReadReplica1**で実行)
    ```
    SHOW DATABASES;
    ```

    ```
    USE ReadReplica;
    ```

    ```
    SHOW TABLES;
    ```

    ```
    SELECT * FROM ReadReplica.test;
    ```

    実行例 (**WriterMDS**で実行)
    ```
    mysql> CREATE DATABASE ReadReplica;
    Query OK, 1 row affected (0.01 sec)

    mysql> CREATE TABLE ReadReplica.test(id int AUTO_INCREMENT, col1 CHAR(10), PRIMARY KEY(id));
    Query OK, 0 rows affected (0.00 sec)

    mysql> INSERT INTO ReadReplica.test VALUES(1, "TEST");
    Query OK, 1 row affected (0.00 sec)

    mysql> SELECT * FROM ReadReplica.test;
    +----+------+
    | id | col1 |
    +----+------+
    |  1 | TEST |
    +----+------+
    1 row in set (0.00 sec)
    ```
    <br>

    実行例 (**ReadReplica1**で実行)
    ```
    mysql> SHOW DATABASES;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sys                |
    | ReadReplica        |
    | world              |
    | world_x            |
    +--------------------+
    7 rows in set (0.00 sec)

    mysql> USE ReadReplica;
    Reading table information for completion of table and column names
    You can turn off this feature to get a quicker startup with -A

    Database changed
    mysql> SHOW TABLES;
    +----------------+
    | Tables_in_test |
    +----------------+
    | test           |
    +----------------+
    1 row in set (0.00 sec)

    mysql> SELECT * FROM ReadReplica.test;
    +----+------+
    | id | col1 |
    +----+------+
    |  1 | TEST |
    +----+------+
    1 row in set (0.00 sec)
    ```
    <br>

3. リードレプリカが参照専用であることを確認します。**ReadReplica1**で`test.test`テーブルにデータを追加しようとするとエラーが発生します。システム変数`read_only`及び`super_read_only`が`ON`に設定されているため、参照専用になっていることが分かります。<br>
(`read_only`によりMySQLサーバーを参照専用に設定できますが、`read_only`だけでは`CONNECTION_ADMIN`権限もしくは`SUPER`権限を持った管理者ユーザーによる更新処理をブロックできません。`super_read_only`は`CONNECTION_ADMIN`権限もしくは`SUPER`権限を持った管理者ユーザーによる更新処理をブロックするために、MySQL 5.7で追加されたシステム変数です)

    実行コマンド(コピー＆ペースト用：**ReadReplica1**で実行)
    ```
    INSERT INTO ReadReplica.test VALUES(2, "READ ONLY");
    ```

    ```
    SHOW GLOBAL VARIABLES LIKE '%read_only';
    ```

    実行例 (**ReadReplica1**で実行)
    ```
    mysql> INSERT INTO ReadReplica.test VALUES(2, "READ ONLY");
    ERROR 1290 (HY000): The MySQL server is running with the --super-read-only option so it cannot execute this statement
    mysql> 
    mysql> SHOW GLOBAL VARIABLES LIKE '%read_only';
    +-----------------------+-------+
    | Variable_name         | Value |
    +-----------------------+-------+
    | innodb_read_only      | OFF   |
    | read_only             | ON    |
    | super_read_only       | ON    |
    | transaction_read_only | OFF   |
    +-----------------------+-------+
    4 rows in set (0.01 sec)
    ```


<br>
これで、この章の作業は終了です。

この章では、リードレプリカを作成し、ソースのMySQL HeatWaveで実行した更新処理がリードレプリカにレプリケーションされることや、リードレプリカが参照専用に設定されていることを確認しました。参照処理の同時実行数が多いシステムでは、リードレプリカを使って負荷分散することで効率良くシステムを拡張できるので、活用して下さい。
