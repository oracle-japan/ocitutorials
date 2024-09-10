---
title: "301 : 移行元となるデータベースを作成しよう"
excerpt: "まずは準備作業として、現行ご利用いただいているOracle Databaseを想定し、BaseDBインスタンスを作成します。"
order: "3_301"
layout: single
header:
  teaser: "/adb/adb301-create-source-db/img103.png"
  overlay_image: "/adb/adb301-create-source-db/img103.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776
---
<a id="anchor0"></a>

# はじめに

既存Oracle DatabaseをAutonomous Databaseに移行するにはどうすれば良いでしょうか？
従来からよく利用されるData Pumpを始め、Autonomous Databaseではいくつかの移行方法が用意されており、このチュートリアルでは**移行編**としてそれらの方法をご紹介しています。

----
**Autonomous Database を使ってみよう（移行編）**
  * [301: 移行元となるデータベースを作成しよう（本章）](/ocitutorials/adb/adb301-create-source-db){:target="_blank"} 
  * [302: スキーマ・アドバイザを活用しよう](/ocitutorials/adb/adb302-schema-adviser){:target="_blank"} 
  * [303: Data Pumpを利用してデータを移行しよう](/ocitutorials/adb/adb303-datapump){:target="_blank"} 
  * [304: ZDM/DMSを利用し、ダウンタイムを最小限に移行しよう](/ocitutorials/adb/adb304-database-migration-prep){:target="_blank"}
  * [305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行](/ocitutorials/adb/adb304-database-migration-prep){:target="_blank"}
  * [306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行](/ocitutorials/adb/adb304-database-migration-prep){:target="_blank"}


<br/>

----

本章（301）では後続の章の準備作業として、移行元となる既存オンプレミスのOracle Databaseを想定しBaseDBインスタンスを作成します。

<BR>

**目次 :**
  + [1.移行元となるBaseDBインスタンスの作成](#anchor1)
  + [2.移行対象となるサンプルスキーマ(HR)をインストール](#anchor2)
  + [3.サンプルスキーマ(HR)への接続、スキーマの確認](#anchor3)

<BR>

<!-- **前提条件 :** -->


<BR>

**所要時間 :** 約150分 (BaseDBインスタンスの作成時間を含む)

<BR>
----

<a id="anchor1"></a>

# 1. 移行元となるBaseDBインスタンスの作成 

まず、[「Oracle Cloud で Oracle Database を使おう(BaseDB)」](/ocitutorials/basedb/dbcs101-create-db/){:target="_blank"} を参考に、BaseDBインスタンスを作成してください。
TeraTermを起動しBaseDBインスタンスにSSHでアクセスするところから、PDB上のスキーマにアクセスするところまで一通り実施いただくとスムーズです。

以降では、BaseDBインスタンスが以下の値で作成されていることを前提として記載しています。（その他、DBシステム名やシェイプ等は基本的に任意です）

* ホスト名接頭辞 : **dbcs01**
* データベースのバージョン：**19.23**
* パスワード：**WelCome123#123#**
* PDBの名前：**pdb1**


<BR>

<a id="anchor2"></a>

# 2. 移行対象となるHRスキーマをインストール

<a id="anchor2"></a>

次に作成したBaseDBインスタンス内に、移行対象となるHRスキーマを作成します。  
（HRスキーマのインストール方法に関するマニュアルは[こちら](https://docs.oracle.com/cd/E96517_01/comsc/installing-sample-schemas.html#GUID-CB945E4C-D08A-4B26-A12D-3D6D688467EA)）を参照ください。


引き続きBaseDBインスタンスにて作業します。

1. Tera Termを利用してBaseDBインスタンスに接続しておきます。

1. opc ユーザーからoracleユーザーにスイッチします。  
```sh
sudo su - oracle
```

1. SQL*PlusでBaseDBインスタンスに接続します。
```sh
sqlplus / as sysdba
```

1. BaseDBインスタンスに構成されているPDBの一覧を確認します。
```sql
show pdbs
```
![結果出力](img101.png)

1. PDBインスタンス名を指定してスイッチします。  
（ここではデフォルトで作成されるPDBにアクセスしています。）
```sql
alter session set container = PDB1 ;
```
![結果出力](img102.png)

1. hr_main.sqlを実行し、サンプルスキーマ（HR）の作成します。（数分でHRスキーマが構成されます）
```sql
@?/demo/schema/human_resources/hr_main.sql
```
HRスキーマのパスワード等を聞かれますので、以下を参考にご入力ください。
  * パスワード : **WelCome123#123#**
  * デフォルト表領域 : **USERS**
  * デフォルト一時表領域 : **TEMP**
  * ログ : **$ORACLE_HOME/demo/schema/log**
  ![結果出力](img103.png)

1. 特にエラーなく終了したら exit でSQL*Plus を終了してください。
```
exit
```


<a id="anchor3"></a>


## 3. サンプルスキーマ（HR）への接続、スキーマの確認
次にHRスキーマに接続し、表や索引等のオブジェクトを確認しておきます。

1. CDB経由ではなくPDBに対して直接アクセスするために、tnsnames.ora にPDBへの接続情報を追記します。
```sh
vi $ORACLE_HOME/network/admin/tnsnames.ora
```
以下を追記します。（必要に応じて[「Oracle Cloud で Oracle Database を使おう(BaseDB)」](/ocitutorials/basedb/dbcs101-create-db/)を参考に**ホスト名（HOST）**、**ポート番号（PORT）**、**サービス名（SERVICE_NAME）** を変更ください）  
```
PDB1 =
  (DESCRIPTION =
    (ADDRESS_LIST =
      (ADDRESS = (PROTOCOL = TCP)(HOST = dbcs01.subnet.vcn.oraclevcn.com)(PORT = 1521))
    )
    (CONNECT_DATA =
      (SERVICE_NAME = pdb1.subnet.vcn.oraclevcn.com)
    )
  )
```
<br/>
編集した内容を確認します。
```sh
cat $ORACLE_HOME/network/admin/tnsnames.ora
```
  ![結果出力](img106.png)

1. SQL*Plus でPDB上のHRスキーマに接続します。
```sh
sqlplus hr/WelCome123#123#@pdb1
```

1. 以下のSQLを貼り付け、生成されたオブジェクトを確認します。
```sql
set lines 120
set pages 9999
col object_name for a30
select object_type, object_name from user_objects order by 1,2 ;
```
  ![結果出力](img104.png)

1. ここで後続のハンズオンガイドで必要となる表を一つ作成しておきます。（ADWには格納できないLONG型の列を有する表を作成しておく）
```sql
create table NG_TAB_4ADW (id number, var long);
```
  ![結果出力](img105.png)

1. 特に問題なければexitでSQL*Plusを終了してください。
```
exit
```

<br/>

# おわりに
以上で既存オンプレミスのOracle Databaseを想定したBaseDBインスタンスの作成、およびサンプルスキーマの作成が完了しました。後続の章ではこの環境から移行する方法についてご紹介したいと思います。

<br/>
以上でこの章は終了です。次の章にお進みください。
<BR>

[ページトップへ戻る](#anchor0)

