---
title: "その9 - クラウドでMySQL Databaseを使う"
excerpt: "クラウド環境でも人気の高いMySQL Database！OCIならMySQL開発チームによるMySQLのマネージドサービスが利用できます！簡単に構築できるので、まずは触ってみましょう！"
order: "090"
header:
  teaser: "/beginners/creating-mds/MySQLLogo_teaser.png"
  overlay_image: "/beginners/creating-mds/MySQLLogo_overlay_image.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://oracle-japan.github.io/ocitutorials/beginners/creating-mds/
---
Oracle Cloud Infrastructure では、MySQL Database Service(MDS)が利用できます。MDSはAlways Freeの対象ではないため、使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。

このチュートリアルでは、コンソール画面からMDSのサービスを1つ作成し、コンピュート・インスタンスにMySQLクライアント、MySQL Shellをインストールして、クライアントからMDSへ接続する手順を説明します。

**所要時間 :** 約25分 (約15分の待ち時間含む)

**前提条件 :**

1. Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること
2. [OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)](../getting-started/)を完了していること
3. [クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2)](../creating-vcn/)を完了していること
4. [インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)](https://community.oracle.com/tech/welcome/discussion/4474256/)を完了していること

**注意 :** チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります

**目次：**

- [1. MySQL Database Service(MDS)とは?](#1-anchor1)
- [2. MDSの作成](#2-anchor2)
- [3. セキュリティリストの修正(イングレス・ルールの追加)](#3-anchor3)
- [4. MySQLクライアントのインストール](#4-anchor4)
- [5. 作成したMDSの確認](#5-anchor5)
<br>
<a id="anchor1"></a>

# 1. MySQL Database Service(MDS)とは?

MySQL Database Service(MDS)は、MySQL開発チームによるMySQLのマネージドサービスです。オンプレミスのMySQLと100%の互換性があり、MySQL開発ベンダーであるオラクル社からのサポートも受けられます。

MDSではセキュリティの観点から、パブリックIPアドレスを持てない仕様になっています。そのため、このチュートリアルでは、別途コンピュート・インスタンスにMySQLクライアントをインストールして、コンピュート・インスタンス上のクライアントからMDSへ接続する手順まで説明します。

<a id="anchor2"></a>

# 2. MDSの作成

MDSを作成します。本チュートリアルではデフォルトの構成でMDSを作成していますが、シェイプやストレージサイズ、バックアップ設定などをカスタマイズすることも可能です。



1. コンソールメニューから **データベース** → **MySQL** → **DBシステム** を選択します。
    <div align="center">
    <img width="700" alt="img1.png" src="img1.png" style="border: 1px black solid;">
    </div>
    <br>

2. **MySQL DBシステムの作成** ボタンを押します。この際、左下の **リスト範囲** でリソースを作成したいコンパートメントを選択していることを確認してください。ここでは「handson」コンパートメントを使用しています。
    <div align="center">
    <img width="700" alt="img2.png" src="img2.png" style="border: 1px black solid;">
    </div>
    <br>

    ※MySQL Database Serviceを利用するためにはOCIユーザーに適切なポリシーを設定する必要があります。詳細は **MySQLの前提条件** 部分の **詳細** をクリックすることで確認出来ます。Administratorsグループに所属するユーザーはこれらのポリシーも満たしているため、本チュートリアルでは、このポリシーの設定手順は割愛しています。
    <div align="center">
    <img width="700" alt="img3.png" src="img3.png" style="border: 1px black solid;">
    </div>
    <br>

3. 立ち上がった **MySQL DBシステムの作成** ウィンドウの **① DBシステム情報** のステップで、以下の項目を入力し **次** ボタンを押します。

    - **名前** - 任意の名前を入力します。ここでは「TestMDS」と入力しています。
    - **説明** - このMDSの説明を入力します。ここでは「ハンズオン用」と入力しています。(入力は任意です)

    <div align="center">
    <img width="700" alt="img4.png" src="img4.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="700" alt="img5.png" src="img5.png" style="border: 1px black solid;">
    </div>
    <br>

4. **② データベース情報** のステップで、以下の項目を入力し **次** ボタンを押します

    - **ユーザー名** - MySQL Databaseの管理者ユーザーのユーザー名を指定します。ここでは「root」と入力しています。(セキュリティの観点からは任意のユーザー名を指定することを推奨します)
    - **パスワード** - MySQL Databaseの管理者ユーザーのパスワードを指定します。パスワードは8文字から32文字までの長さで、大文字、小文字、数字および特殊文字をそれぞれ1つ以上含める必要があります。
    - **パスワードの確認** - パスワードを再入力します。
    - **ホスト名** - 任意のホスト名を入力します。ここでは「TestMDS」と入力しています。
    <div align="center">
    <img width="700" alt="img6.png" src="img6.png" style="border: 1px black solid;">
    </div>
    <br>

5. **③ バックアップ情報** のステップで、何も変更せずに **作成** ボタンを押します。
    <div align="center">
    <img width="700" alt="img7.png" src="img7.png" style="border: 1px black solid;">
    </div>
    <br>

6. MDSが**作成中**になるのでしばらく待ちます。概ね15分程度で作成が完了しステータスが**アクティブ**に変わります。
    <div align="center">
    <img width="700" alt="img8.png" src="img8.png" style="border: 1px black solid;">
    <img width="700" alt="img9.png" src="img9.png" style="border: 1px black solid;">
    </div>
    <br>

7. ページ左下の **リソース** → **エンドポイント** をクリックして、ホスト名、IPアドレスを確認しておきます。
    <div align="center">
    <img width="700" alt="img10.png" src="img10.png" style="border: 1px black solid;">
    </div>
    <br>

<a id="anchor3"></a>

# 3. セキュリティリストの修正(イングレス・ルールの追加)

このチュートリアルで作成したMDSと通信するためには、TCP/IPによる3306ポートに対する通信を許可する必要があります。そのため、セキュリティリストのイングレス・ルールに設定を追加します。
<br>

1. コンソールメニューから **ネットワーキング** → **仮想クラウドネットワーク** を選択し、作成済みのVCNを選択します。本チュートリアルでは**TutorialVCN** です。またこれ以降はVCNが **TutorialVCN** である前提で説明を記述しています。
    <div align="center">
    <img width="700" alt="img11.png" src="img11.png" style="border: 1px black solid;">
    </div>
    <br>

    <div align="center">
    <img width="700" alt="img12.png" src="img12.png" style="border: 1px black solid;">
    </div>
    <br>

2. **プライベート・サブネット-TutorialVCN** をクリックします。
    <div align="center">
    <img width="700" alt="img13.png" src="img13.png" style="border: 1px black solid;">
    </div>
    <br>

3. **プライベート・サブネット-TutorialVCNのセキュリティ・リスト** をクリックします。
    <div align="center">
    <img width="700" alt="img14.png" src="img14.png" style="border: 1px black solid;">
    </div>
    <br>

4. **イングレス・ルールの追加** をクリックします。
    <div align="center">
    <img width="700" alt="img15.png" src="img15.png" style="border: 1px black solid;">
    </div>
    <br>

5. 立ち上がった **イングレス・ルールの追加** ウィンドウで、以下の項目を入力し **イングレス・ルールの追加** ボタンを押します。

    - **ソースCIDR** - 「10.0.0.0/16」と入力します。
    - **宛先ポート範囲** - 「3306」と入力します。

    <div align="center">
    <img width="700" alt="img16.png" src="img16.png" style="border: 1px black solid;">
    </div>
    <br>

6. 3306ポートに対するイングレス・ルールが追加されたことを確認します。
    <div align="center">
    <img width="700" alt="img17.png" src="img17.png" style="border: 1px black solid;">
    </div>
    <br>

<a id="anchor4"></a>

# 4. MySQLクライアントのインストール

コンピュート・インスタンスにMySQLクライアントをインストールします。MySQLチームが提供しているyumの公式リポジトリをセットアップした後で、yumでインストールします。
<br>

1. [インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)](https://community.oracle.com/tech/welcome/discussion/4474256/)で作成したコンピュート・インスタンスに接続し、以下のコマンドを実行します。これにより、MySQLチームが提供しているyumの公式リポジトリがセットアップされます。

    ```
    sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
    ```
    <br>

2. 以下コマンドを実行し、MySQLクライアントをインストールします。

    ```
    sudo yum install mysql-community-client
    ```
    <br>

<a id="anchor5"></a>

# 5. 作成したMDSの確認

mysqlコマンドラインクライアントを使ってMDSへ接続し、SHOW DATABASESコマンドを実行します。実行例は以下の通りです。ユーザー名はMDSの管理者ユーザー名に、ホスト名は確認したホスト名に置き換えて下さい。("-u"オプションでユーザー名を、"-h"オプションでホスト名を指定します)

```
[opc@testvm1 ~]$ mysql -u root -p -h TestMDS.sub01140222111.tutorialvcn.oraclevcn.com
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 31
Server version: 8.0.22-u4-cloud MySQL Enterprise - Cloud

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)
```
<br>

これで、この章の作業は終了です。

この章では、**TestMDS** というMySQL Database Serviceを1つ作成し、コンピュート・インスタンスから接続確認をしました。MDSの構成は変更していませんが、用途に応じて構成を変更したり、シェイプやバックアップ設定なども変更できます。

MDSの構成変更やシェイプの変更、バックアップ設定の変更なども是非試してみて下さい。
