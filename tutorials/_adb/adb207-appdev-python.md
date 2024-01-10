---
title: "207: PythonによるADB上でのアプリ開発"
excerpt: "この章では開発言語としてpythonを想定し、Autonomous Databaseに対して接続する方法、およびデータベース操作を実行する方法を学びます。"

order: "3_207"
layout: single
#header:
#  teaser: "/adb/adb207-appdev-python/image_top.png"
#  overlay_image: "/adb/adb207-appdev-python/img_top.png"
#  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474311
---

Pythonとは、汎用のプログラミング言語である。コードがシンプルで扱いやすく設計されており、C言語などに比べて、さまざまなプログラムを分かりやすく、少ないコード行数で書けるといった特徴がある。（ウィキペディアより引用）

PythonでAutonomous Databaseを利用する際には、cx_Oracleというモジュールを利用します。

尚、Python言語自体の使い方を説明するものではありません。

**所要時間 :** 約10分

**前提条件 :**

1. ADBインスタンスが構成済みであること
   <br>※ADBインタンスを作成方法については、本ハンズオンガイドの [101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning) を参照ください。
2. 開発用の仮想マシンが構成済みであり、仮想マシンからADBインスタンスへのアクセスが可能であること
3. 仮想マシンのoracleユーザのホームディレクトリ配下にlabsフォルダをアップロード済みであること
    +  [labs.zip をダウンロード](/ocitutorials/adb/adb-data/labs.zip)
    <br>アップロード方法については [こちら](/ocitutorials/adb/adb204-setup-VM#anchor3) をご確認ください。


**目次**

- [1. ADBに接続してみよう](#anchor1)
- [2. ADB上のデータを操作してみよう](#anchor2)


<br>

<a id="anchor1"></a>

# 1. ADBに接続してみよう

まずPythonでADBに接続し、ADBのバージョンを確認してみます。

尚、事前にこちらを実施し、SQL*plusで接続できていることを前提に記載しています。

1. Tera Termを利用してopcユーザで仮想マシンにログインします。

2. oracleユーザにスイッチします。一旦rootユーザに切り替えてから、oracleユーザに切り替えます。

    ```sh
    -- rootユーザにスイッチ
    sudo -s
    -- oracleユーザにスイッチ
    sudo su - oracle
    ```

    ![img1_2.png](img1_2.png)

3. ADBへの接続情報をOS環境変数として設定します。

    ```sh
    export TNS_ADMIN=/home/oracle/labs/wallets
    ```
    ```sh
    export ORAUSER=admin
    ```
    ```sh
    export ORAPASS=Welcome12345#
    ```
    ```sh
    export ORATNS=atp01_low
    ```
    ```sh
    export WALLETPASS=Welcome12345#
    ```

4. サンプルスクリプトが配置されているディレクトリに移動します。

    ```sh
    cd ~/labs/python
    ```

5. （必要に応じて）python_connect.pyの中身を確認します。

    ```sh
    cat python_connect.py
    ```
    接続に必要なモジュール(os、oracledb)をロード、定義された環境変数に従いADBに対する接続を作成、ADBのバージョンを取得する という内容です。
    <br>※python_connect.pyの中身は次の通りです。

    ```python
    import os
    import oracledb

    un = os.environ.get('ORAUSER')
    pw = os.environ.get('ORAPASS')
    cs = os.environ.get('ORATNS')
    wallet_dir = os.environ.get('TNS_ADMIN')
    wallet_pw = os.environ.get('WALLETPASS')

    conn = oracledb.connect(user=un, password=pw, dsn=cs, config_dir=wallet_dir, wallet_location=wallet_dir, wallet_password=wallet_pw)
    print(conn.version)
    conn.close()
    ```

6. 実行します。実行する際には、~/labs/pythonに移動していることを確認し、python3で実行していることにご注意ください。

    ```sh
    python3 python_connect.py
    ```

    次の出力結果のように、5桁の数字（ADBのバージョン）が表示されたらOKです。

   ![img1_6.png](img1_6.png)

<br>

<a id="anchor2"></a>

# 2. ADB上のデータを操作してみよう

次に実際にサンプルのクエリを実行し、結果を確認してみましょう。

1. サンプルスクリプトが配置されているディレクトリに移動します。

    ```sh
    cd ~/labs/python
    ```

2. （必要に応じて）OS環境変数の内、接続サービスを設定しなおします。

     ここではサンプルクエリとして分析系のクエリを実行するため、分析系クエリを実行する際の推奨の接続サービスであるMEDIUMを指定します。

    ```sh
    export ORATNS=atp01_medium
    ```
   ![img2_2.png](img2_2.png)

3. （必要に応じて）python_resultset.pyの中身を確認します。

    ```sh
    cat python_resultset.py
    ```

    ADBへの接続処理、分析系のクエリを実行、結果セットの表示、接続のクローズ処理といった一連の流れを実行しています。
    <br>※python_resultset.pyの中身は次の通りです。

    ```python
    import os
    import oracledb

    un = os.environ.get('ORAUSER')
    pw = os.environ.get('ORAPASS')
    cs = os.environ.get('ORATNS')
    wallet_dir = os.environ.get('TNS_ADMIN')
    wallet_pw = os.environ.get('WALLETPASS')

    try:
     conn = oracledb.connect(user=un, password=pw, dsn=cs, config_dir=wallet_dir, wallet_location=wallet_dir, wallet_password=wallet_pw)
     sql="""SELECT channel_desc, TO_CHAR(SUM(amount_sold),'9,999,999,999') SALES$,
       RANK() OVER (ORDER BY SUM(amount_sold)) AS default_rank,
       RANK() OVER (ORDER BY SUM(amount_sold) DESC NULLS LAST) AS custom_rank
       FROM sh.sales, sh.products, sh.customers, sh.times, sh.channels, sh.countries
       WHERE sales.prod_id = products.prod_id
       AND sales.cust_id = customers.cust_id
       AND customers.country_id = countries.country_id
       AND sales.time_id = times.time_id
       AND sales.channel_id = channels.channel_id
       AND times.calendar_month_desc IN ('2000-09','2000-10')
       AND country_iso_code = :country_code
       GROUP BY channel_desc"""
     cursor = conn.cursor()
     cursor.execute(sql, country_code = 'US')

     print("CHANNEL_DESC            SALES          DEFAULT_RANK  CUSTOM_RANK")
     print("----------------------  -------------  ------------  -----------")
     for column_1, column_2, column_3, column_4 in cursor.fetchall():
        print(str(column_1).ljust(22), str(column_2).rjust(11), "  ", str(column_3).rjust(10), "  ", str(column_4).rjust(9))

    except oracledb.DatabaseError as exc:
      err, = exc.args
      print("Oracle-Error-Code:", err.code)
      print("Oracle-Error-Message:", err.message)

    finally:
      cursor.close()
      conn.close()
    ```

4. クエリを実行します。python3で実行していることにご注意ください。

    ```sh
    python3 python_resultset.py
    ```

    次の出力結果のように、3件の結果セットが返ってくればOKです。

    ![img2_4.png](img2_4.png)
    
以上で、この章の作業は終了です。

次の章にお進みください。