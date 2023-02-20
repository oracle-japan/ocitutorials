---
title: "その12 - MySQL Database Serviceでリードレプリカを構成する"
excerpt: "MySQL Database Serviceでは参照処理の負荷分散を実現できるリードレプリカも簡単に構成できます。リードレプリカを構成し、動きを確認してみましょう！"
order: "120"
header:
  teaser: "/beginners/creating-mds-readreplica/MySQLLogo_teaser.png"
  overlay_image: "/beginners/creating-mds-readreplica/MySQLLogo_overlay_image.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://oracle-japan.github.io/ocitutorials/beginners/creating-mds-readreplica/
---
Oracle Cloud Infrastructure では、MySQL Database Service(MDS)が利用できます。MDSはAlways Freeの対象ではないため、使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。

このチュートリアルでは、参照処理の負荷分散を実現できるリードレプリカを構成し、動きを確認します。リードレプリカもエンドポイントもマネージドで提供されているため、簡単に利用できるのが特徴です。

**所要時間 :** 約50分 (約30分の待ち時間含む)

**前提条件 :**

1. Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること
2. [OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)](../getting-started/) を完了していること
3. [クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2)](../creating-vcn/) を完了していること
4. [インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)](../creating-compute-instance/) を完了していること

**注意 :** チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。
<br>

**目次：**

- [1. リードレプリカとは?](#anchor1)
- [2. MDSの作成(ソースとなるMDS)](#anchor2)
- [3. リードレプリカの作成](#anchor3)
- [4. リードレプリカの確認](#anchor4)
<br>

<a id="anchor1"></a>

# 1. リードレプリカとは?

リードレプリカは、参照処理を負荷分散する目的で使用される参照専用の複製です。参照処理の同時実行数が多いシステムでは、リードレプリカを使って負荷分散することが効果的です。

MDSのリードレプリカは非同期レプリケーションを使って構成されていますので、リードレプリカから参照したデータは最新のデータでは無い可能性があることに注意して下さい。ソースのMDSで更新したデータは随時リードレプリカに伝搬されるため、参照処理をリードレプリカで処理しても問題ないケースが多いです。ただし、必ず最新のデータを参照する必要がある処理についてはソースのMDSから参照する必要があります。

リードレプリカへのアクセスは内部的にロードバランサーを使用して制御されており、ユーザーがリードレプリカにアクセスする際は、リードレプリカ毎に設定されたエンドポイント(プライベートIPアドレス)を使用してアクセスします。ロードバランサーの設定も自動化されているため、ユーザーはロードバランサーの存在や設定を意識する必要はありません。

また、リードレプリカに関して、本チュートリアル作成時点(2023年2月時点)で以下の制限事項があります。

　**リードレプリカの制限事項(2023年2月時点)**
  - ソースとなるMDSのOCPUが4OCPU以上必要
  - リードレプリカのスペックは、ソースとなるMDSのスペックと同一になる<br>
   (リードレプリカだけスペックを落とす、といったことはまだできない)
  - リードレプリカの個数は最大18個まで
  - ロードバランサーからリードレプリカにアクセスするための帯域は最大8Gbps
  - リードレプリカ間のロードバランスはできない<br>
   (リードレプリカ全体のエンドポイントは存在せず、1つ1つのリードレプリカに設定されたIPアドレスを使ってアクセスする)
<br>
<br>

<a id="anchor2"></a>

# 2. MDSの作成(ソースとなるMDS)

ソースとなるMDSを作成します。[クラウドでMySQL Databaseを使う - Oracle Cloud Infrastructureを使ってみよう(その9)](../creating-mds/) の手順に従ってソースとなるMDSを作成します。「2. MDSの作成」だけでなく、「3. セキュリティリストの修正(イングレス・ルールの追加)」、「4. MySQLクライアントのインストール」、「5. 作成したMDSの確認」まで実行し、world_xデータベースも作成しておきます。

この時、前述の制限事項があるためOCPUが4以上のMDSを作成して下さい。OCPUが4以上のMDSを作成する場合、**ハードウェアの構成**部分の**シェイプの変更**をクリックして、4OCPU以上のシェイプを選択します。以下のスクリーンショットは、CPUの種類がE4、CPU数が4OCPU、メモリーサイズが64GBのシェイプ(MySQL.VM.Standard.E4.4.64GB)を選択した例です。
<br>

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

なお、現在MDSでサポートされているシェイプについては、[こちら](https://docs.oracle.com/en-us/iaas/mysql-database/doc/supported-shapes.html)のドキュメントを参照して下さい。
<br>
<br>

<a id="anchor3"></a>

# 3. リードレプリカの作成

リードレプリカを2つ作成します。
<br>

1. 先ほど作成したMDSをコンソールから選択し、画面左下の**リソース** → **読取りレプリカ** をクリックします。そして表示された画面から**読取りレプリカの作成**をクリックします。

    <div align="center">
    <img width="700" alt="img4.png" src="img4.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="700" alt="img5.png" src="img5.png" style="border: 1px black solid;">
    </div>
    <br>

2. **名前**に「Replica1」と入力し、**読取りレプリカの作成**をクリックします。**Replica1**の状態が**作成中**になり、15分〜20分程度で状態が**アクティブ**に変わります。また、読取りレプリカの**アクティブ**の数が「1」になっていることも確認します。
(本ステップの待ち時間に、先行して次のステップも実行することでトータルの待ち時間を短縮できます)

    <div align="center">
    <img width="700" alt="img6.png" src="img6.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="700" alt="img7.png" src="img7.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="700" alt="img8.png" src="img8.png" style="border: 1px black solid;">
    </div>
    <br>

3. 同様の手順で2つ目のリードレプリカを作成します。名前は「Replica2」で作成します。
<br>
<br>

<a id="anchor4"></a>

# 4. リードレプリカの確認

作成したリードレプリカの動作を確認します。
<br>

1. 作成した**Replica1**をクリックし、表示された画面の**エンドポイント**よりプライベートIPアドレスを確認します。また、同様に**Replica2**のプライベートIPアドレスを確認します。2つのIPアドレスが異なるため、それぞれのIPアドレスを使用することで、任意のリードレプリカにアクセスできます。

    <div align="center">
    <img width="700" alt="img9.png" src="img9.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="700" alt="img10.png" src="img10.png" style="border: 1px black solid;">
    </div>
    <br>

2. 確認した**Replica1**のIPアドレスを使用してリードレプリカに接続後、「SHOW DATABASES」を実行します。world_xデータベースが存在するため、リードレプリカ作成時点の**TestMDS**が複製されていることが分かります。

    実行例 (Replica1で実行)
    ```
    mysql> SHOW DATABASES;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sys                |
    | world_x            |
    +--------------------+
    5 rows in set (0.00 sec)
    ```
    <br>

3. ソースのMDSで実行した更新処理がリードレプリカに反映されることを確認します。**TESTMDS**でtestデータベース、test.testテーブルを作成し、データをINSERTします。その後、**Replica1**でtest.testテーブルが存在することを確認し、INSERTされたデータがSELECTできることを確認します。以下の実行例ではそれぞれのMDSでの操作をまとめて掲載していますが、コンソールを2つ開いてそれぞれ**TESTMDS**と**Replica1**に接続し、1ステップずつ実行することで、各ステップ毎にリードレプリカに処理内容がレプリケーションされていることが確認できます。

    実行例 (TESTMDSで実行)
    ```
    mysql> CREATE DATABASE test;
    Query OK, 1 row affected (0.01 sec)

    mysql> CREATE TABLE test.test(id int AUTO_INCREMENT, col1 CHAR(10), PRIMARY KEY(id));
    Query OK, 0 rows affected (0.00 sec)

    mysql> INSERT INTO test.test VALUES(1, "TEST");
    Query OK, 1 row affected (0.00 sec)

    mysql> SELECT * FROM test.test;
    +----+------+
    | id | col1 |
    +----+------+
    |  1 | TEST |
    +----+------+
    1 row in set (0.00 sec)
    ```
    <br>

    実行例 (Replica1で実行)
    ```
    mysql> SHOW DATABASES;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sys                |
    | test               |
    | world_x            |
    +--------------------+
    6 rows in set (0.00 sec)

    mysql> USE test;
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

    mysql> SELECT * FROM test.test;
    +----+------+
    | id | col1 |
    +----+------+
    |  1 | TEST |
    +----+------+
    1 row in set (0.00 sec)
    ```
    <br>

4. リードレプリカが参照専用であることを確認します。**Replica1**でtest.testテーブルにデータをINSERTしようとするとエラーが発生します。また、システム変数「read_only」及び「super_read_only」が「ON」に設定されているため、参照専用になっていることが分かります。<br>
(read_onlyによりMySQLサーバーを参照専用に設定できますが、read_onlyだけではCONNECTION_ADMIN権限もしくはSUPER権限を持った管理者ユーザーによる更新処理をブロックできません。super_read_onlyはCONNECTION_ADMIN権限もしくはSUPER権限を持った管理者ユーザーによる更新処理もブロックするためにMySQL 5.7で追加されたシステム変数です)

    実行例 (Replica1で実行)
    ```
    mysql> INSERT INTO test.test VALUES(2, "READ ONLY");
    ERROR 1290 (HY000): The MySQL server is running with the --super-read-only option so it cannot execute this statement
    mysql> 
    mysql> SHOW VARIABLES LIKE '%read_only';
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

この章では、リードレプリカを作成し、ソースのMDSで実行した更新処理がリードレプリカにレプリケーションされることや、リードレプリカが参照専用に設定されていることを確認しました。参照処理の同時実行数が多いシステムでは、リードレプリカを使って負荷分散することで効率良くシステムを拡張できるので、活用して下さい。
