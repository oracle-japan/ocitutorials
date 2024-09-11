---
title: "303 : Data Pumpを利用してデータを移行しよう"
excerpt: "まずはシンプルにData Pumpを利用した移行方法についてご紹介します。"
order: "3_303"
layout: single
header:
  teaser: "/adb/adb303-datapump/img101.png"
  overlay_image: "/adb/adb303-datapump/img101.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776
---
<a id="anchor0"></a>

# はじめに

Oracle Databaseのデータ移行として、ここでは従来からよく利用されるData Pumpを利用してAutonomous Databaseに移行する手順をご紹介します。

先の[「301 : 移行元となるデータベースを作成しよう」](/ocitutorials/adb/adb301-create-source-db){:target="_blank"}にて事前に作成しておいたBaseDBインスタンス上のHRスキーマを、以下の流れに沿ってAutonomous Databaseに移行してみたいと思います。

![イメージ](img100.png)


<BR>

**目次 :**
  + [1.移行対象のスキーマをエクスポート](#anchor1)
  + [2.オブジェクトストレージへのアクセストークンを取得](#anchor2)
  + [3.ダンプファイルをオブジェクトストレージにアップロード](#anchor3)
  + [4.Autonomous Databaseへのインポート](#anchor4)


<a id="anchor0_1"></a>
> 補足
チュートリアルを実施する上で、BaseDBインスタンスを用意できない場合や、どうしてもエクスポートが成功しないと言った場合は、以下よりエクスポート済みのダンプファイルを配置しておりますので、適宜ダウンロードください。
上記ステップ2から実施いただくことが可能です。
* [ダンプファイル(export_hr_01.dmp)のダウンロード](/ocitutorials/adb/adb303-datapump/export_hr_01.dmp)
* [ダンプファイル(export_hr_02.dmp)のダウンロード](/ocitutorials/adb/adb303-datapump/export_hr_02.dmp)
* [ダンプファイル(export_hr_03.dmp)のダウンロード](/ocitutorials/adb/adb303-datapump/export_hr_03.dmp)
* [ダンプファイル(export_hr_04.dmp)のダウンロード](/ocitutorials/adb/adb303-datapump/export_hr_04.dmp)

<BR>

**前提条件 :**
+ [「204: マーケットプレイスからの仮想マシンのセットアップ方法」](/ocitutorials/adb/adb204-setup-VM/){:target="_blank"}を完了していること
+ [「301 : 移行元となるデータベースを作成しよう」](/ocitutorials/adb/adb301-create-source-db){:target="_blank"}を完了していること



<BR>

**所要時間 :** 約30分

<BR>
----
<a id="anchor1"></a>

# 1. 移行対象のスキーマをエクスポート
HRスキーマをData Pumpを利用してBaseDBインスタンスのOS上のファイルシステムにエクスポートします。

> （補足）
> - 本チュートリアルではOCI BaseDBにプリインストールされているData Pumpを利用しますが、12.2.0.1以前のOracle Clientを利用する場合や、その他詳細情報についてはマニュアル（ADW / ATP）を参照ください。
> - パラレルオプションを利用する場合、ソースDBがEnterprise Editionである必要があります。
> - 圧縮オプションを利用する場合、ソースDBが11g以上でありAdvanced Compression Optionが必要になります。


## 1-1. ディレクトリ・オブジェクトの作成
BaseDBインスタンス上のPDBに接続し、ダンプファイルの出力先を指定します。

1. Tera Termを利用してBaseDBインスタンスにopcユーザーで接続します。

1. opc ユーザーからoracleユーザーにスイッチしておきます。
```sh
sudo su - oracle
```

1. 作業用ディレクトリを作成します。
```sh
mkdir -p ~/mig2adb/dumpdir
cd ~/mig2adb
```

1. 移行元のOracle Database にログインします。
```sh
sqlplus / as sysdba
```

1. PDBインスタンスに切り替えます。
```sql
alter session set container = pdb1 ;
```

1. ディレクトリ・オブジェクトを作成し、ダンプファイルの出力先をデータベースに登録します。
```sql
create or replace directory TEST_DIR as '/home/oracle/mig2adb/dumpdir' ;
```

1. ディレクトリ・オブジェクトに対する操作権限をHRスキーマに付与しています。
```sql
grant read, write on directory TEST_DIR to HR ;
```

1. SQL*Plusを終了します。
```sql
exit
```
（作業イメージ）
![イメージ](img101.png)

<br>

## 1-2. エクスポート・スクリプトを用意

1. 作業用ディレクトリに移動します。
```sh
cd ~/mig2adb
```

1. エクスポートを実行するスクリプトを作成します。
```sh
vi expdp_hr.sh
```
    以下よりコピーし、貼り付けてください。

    ```sh

    #!/bin/sh

    expdp \"hr/WelCome123#123#@pdb1 \" \
    exclude=cluster,db_link \
    parallel=4 \
    schemas=hr \
    compression=all \
    filesize=1GB \
    directory=test_dir \
    dumpfile=export_hr_%u.dmp

    ```

    編集結果を確認します。
    ```
    cat expdp_hr.sh
    ```
    ![イメージ](img102.png)

    > - データサイズが大きい場合は、データ転送、ロード性能の向上のため、parallelオプションを利用しましょう。指定する値は少なくとも移行先のADBのECPU数と同じか、それよりも大きい値（2倍から3倍）がおススメです。
    > - dumpfile句に指定するファイル名にはワイルドカード（%u）を付けてください。複数のファイルを同時に出力することで高速化が可能です。
    > - filesize句は5GBよりも小さい値を指定してください。ブラウザ経由でオブジェクトストレージに転送できるデータは1ファイル辺り最大5GBの制限があるためです。
    > - excludeオプションを利用することで、不要なオブジェクトを除いてエクスポートすることが可能です。例えばADWを利用するような分析系のアプリの場合において、性能観点で付与した索引はExadataを利用すると不要になることが多いため、IndexをExcludeの引数に指定します。
    > - 詳細は[「マニュアル(Autonomous DatabaseでのOracle Data Pumpを使用したデータのインポート)」](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/load-data-data-pump.html#GUID-30DB1EEA-DB45-49EA-9E97-DF49A9968E24){:target="_blank"}を参照ください。


## 1-3. エクスポートを実施


1. 実行権限を付与します。
```sh
chmod +x expdp_hr.sh
```
（作業イメージ）
![イメージ](img103.png)

1. エクスポートを実行します。特にエラーが出なければOKです。
```sh
./expdp_hr.sh
```

1. エクスポート結果を確認します。以下のようなログが表示されていればOKです。
![イメージ](img104.png)


1. BaseDBインスタンス上の「/home/oracle/mig2adb/dumpdir」ディレクトリにダンプファイルが複数出力されているので(以下ではexport_hr_01.dmp、export_hr_02.dmp、export_hr_03.dmp、export_hr_04.dmp)、WinSCPといった任意のファイル転送ツールを利用し、BaseDBインスタンス上から手元のPCにコピーしてください。  
![イメージ](img105.png)


<BR>


<br>

<a id="anchor2"></a>

# 2. オブジェクトストレージへのアクセストークンを取得
次に、オブジェクトストレージへのアクセストークンを取得します。（尚、既にトークンを取得済みであれば本手順はスキップ可能です）

[**「クラウド・ストレージからデータをロードしてみよう」**](https://oracle-japan.github.io/ocitutorials/adb/adb102-dataload/#anchor2){:target="_blank"}から、**「1. OCIオブジェクトストレージへのアクセス情報を取得」**を参考に実施してください。

<BR>

<a id="anchor3"></a>

# 3. ダンプファイルをオブジェクトストレージにアップロード

次に、手元にコピーしてきたダンプファイル(export_hr_xx.dmp)をオブジェクト・ストレージの任意のバケットにアップロードし、アクセスURLを取得します。

[**「クラウド・ストレージからデータをロードしてみよう」**](https://oracle-japan.github.io/ocitutorials/adb/adb102-dataload/#anchor2){:target="_blank"}から、**「2. OCIオブジェクトストレージへのデータアップロード」**を参考に実施してください。


> * 通常Data Pumpを利用する場合、ディレクトリ・オブジェクトを作成しそこからインポートしますが、ADBは仕様上OS領域にアクセスできないため、オブジェクトストレージ経由でロードする必要があります。
> * チュートリアルを実施する上で、BaseDBインスタンスを用意できない場合や、どうしてもエクスポートが成功せず手元にダンプファイルを用意できない場合は、本ページの冒頭に記載した[ダウンロードリンク](#anchor0_1)よりサンプルのダンプファイルをダウンロードしてご利用ください。

<BR>

<a id="anchor4"></a>

# 4. Autonomous Databaseへのインポート

それではオブジェクトストレージ上のダンプファイルをADBインスタンスにインポートしてみましょう。
以降では[「204: マーケットプレイスからの仮想マシンのセットアップ方法 」](https://oracle-japan.github.io/ocitutorials/adb/adb204-setup-VM/){:target="_blank"}にて作成した仮想マシンにログインして実施します。
  
（ここまでの手順にて、移行元データベースとして利用していたBaseDBインスタンスではないことにご注意ください。）

## 4-1. 仮想マシンへのアクセス
1. TeraTermを起動し、仮想マシンにopcユーザーでログインします。  
  
1. opcユーザーからoracleユーザにスイッチします。
```sh
sudo su - oracle
```

## 4-2. クレデンシャルの登録

1. ADBに接続するための環境変数の設定
```sh
export LD_LIBRARY_PATH=/usr/lib/oracle/21/client64/lib
export TNS_ADMIN=/home/oracle/labs/wallets_atp01
```

1. ADBインスタンスにSQL*Plusでログインします。
```sh
sqlplus admin/Welcome12345#@atp01_low
```

1. クレデンシャルを登録します。
以下、username、およびpasswordは、ステップ2で取得しておいたオブジェクトストレージへのアクセスユーザー、トークンで置き換えてください。

    ```sql
    BEGIN
      DBMS_CLOUD.CREATE_CREDENTIAL(
        credential_name => 'WORKSHOP_CREDENTIAL',
        username => 'adb@handson.com', 
        password => 'xxxxxx'
      );
    END;
    /
    ```
    ![イメージ](img106.png)

    SQL*Plusを終了します。
    ```
    exit
    ```

## 4-3. インポート・スクリプトを用意

1. 作業ディレクトリを作成します。
```sh
mkdir -p ~/labs/datapump
```

1. 作成した作業ディレクトリに移動します
```sh
cd ~/labs/datapump
```

1. インポートを実行するスクリプトを作成します。
```sh
vi impdp_hr.sh
```
    以下よりコピーして、貼り付けます。

    ```sh

    #!/bin/sh

    impdp userid=admin/Welcome12345#@atp01_high \
    credential=WORKSHOP_CREDENTIAL \
    parallel=4 \
    schemas=HR \
    directory=DATA_PUMP_DIR \
    dumpfile=https://objectstorage.<region>.oraclecloud.com/n/<tenancy>/b/<bucket_name>/o/export_hr_%u.dmp \
    logfile=DATA_PUMP_DIR:import_hr.log
    ```

    編集結果を確認します
    ```sh
    cat impdp_hr.sh
    ```
    ![イメージ](img107.png)

    > - dumpfileの引数を上記ステップで取得したダンプファイルへのアクセスURLに置き換えてください。
    > - このとき、ファイル名はexport_hr_01.dmpではなく、export_hr_%u.dmp のようにワイルドカード（%u）を付けるようにご注意ください。
    > - スクリプトを簡素化できるだけでなく、エクスポートの際に分割したファイルを同時に指定しインポートできるのでインポート処理の高速化も可能です。


## 4-4. インポートを実施

1. 実行権限を付与します。
```sh
chmod +x impdp_hr.sh
```
![イメージ](img108.png)

1. インポートを実行します。特にエラーが出なければOKです。
```sh
./impdp_hr.sh
```

1. インポート結果を確認します。以下のようなログが表示されていればOKです。
![イメージ](img109.png)


## 4-5. インポート結果の確認
では実際にADBにログインし、データ移行ができたか確認しておきましょう

1. ADBに接続するための環境変数の設定
```sh
export LD_LIBRARY_PATH=/usr/lib/oracle/21/client64/lib
export TNS_ADMIN=/home/oracle/labs/wallets
```

1. ADBインスタンスにSQL*Plusでログインします。
```sh
sqlplus admin/Welcome12345#@atp01_low
```

1. HRスキーマの表の件数を見てみます。ここでは例としてCOUNTRIES表の件数を表示しています。25件であればOKです。
```sql
select count(1) from hr.COUNTRIES ;
```
![イメージ](img110.png)

<br/>

<a id="anchor5"></a>

# よくある質問やTips

  **1. 長時間実行されるエクスポート処理、インポート処理にて発生しがちな予期せぬネットワーク切断への対応**

  以下のようにnohupコマンドを利用することをご検討ください。何かしらタイムアウトなどお手元のPCと仮想マシンとのネットワーク通信が切断されたとしても、仮想マシン上でスクリプトの実行を継続することが可能です。
  ```
  nohup ./impdp_hr.sh &
  ```

  実行状況は以下のコマンドで確認できます。
  ```
  tail -f nohup.out
  ```

<br/>

# おわりに
Data Pumpを利用したAutonomous Database へのデータ移行についてご紹介しました。オブジェクトストレージを介する点が従来とは異なりますが、その他については基本的に同じことがご理解いただけたのではと思います。

<br/>

# 参考資料

* [Autonomous Database Cloud 技術詳細](https://speakerdeck.com/oracle4engineer/autonomous-database-cloud-ji-shu-xiang-xi){:target="_blank"}
* [マニュアル(Autonomous DatabaseでのOracle Data Pumpを使用したデータのインポート)](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/load-data-data-pump.html#GUID-30DB1EEA-DB45-49EA-9E97-DF49A9968E24){:target="_blank"}


<br/>
以上でこの章は終了です。次の章にお進みください。
<BR>

[ページトップへ戻る](#anchor0)

