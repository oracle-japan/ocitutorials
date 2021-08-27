---
title: "302 : スキーマ・アドバイザを活用しよう"
excerpt: "Autonomous Databaseへの移行前に、現行Oracle Database環境にてAutonomous Databaseが対応していない機能を利用していないか確認できる「スキーマ・アドバイザ」をご紹介します。"
order: "3_302"
layout: single
header:
  teaser: "/database/adb302-xxx/sa00x.png"
  overlay_image: "/database/adb302-xxx/sa00x.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776
---
<a id="anchor0"></a>

# はじめに

Autonomous Databaseでは性能・可用性・セキュリティの観点から特定のデータベースオブジェクトの作成が制限されています。

具体的な制限事項は[マニュアル](https://docs.oracle.com/cd/E83857_01/paas/autonomous-database/adbsa/experienced-database-users.html#GUID-58EE6599-6DB4-4F8E-816D-0422377857E5){:target="_blank"}に記載がございますが、これら制限対象のオブジェクトを利用しているか確認するために、オラクルはSchema Advisorというスクリプト・ツールを提供しています。


   ![イメージ](img101.png)


この章では先の[301: 移行元となるデータベースを作成しよう](/ocitutorials/database/adb301-create-source-db){:target="_blank"}にて事前に作成しておいたDBCSインスタンスを利用して、Schema Advisorの使い方をご紹介します。

<BR>

**目次 :**
  + [1.Schema Advisorとは？](#anchor1)
  + [2.事前準備](#anchor2)
    + [2-1.パッケージのダウンロード](#anchor2-1)
    + [2-2.パッケージのインストール](#anchor2-2)
  + [3.実行と結果確認](#anchor3)
  + [4.パッケージのアンインストール](#anchor4)

<BR>

**前提条件 :**
 + My Oracle Supportへのログイン・アカウントを保有していること
 + [301: 移行元となるデータベースを作成しよう](/ocitutorials/database/adb301-create-source-db){:target="_blank"}を完了していること

<BR>

**所要時間 :** 約30分

<BR>
----
<a id="anchor1"></a>

# 1. Schema Advisor とは？
Autonomous Databaseにオブジェクトを移行する際に、制限事項に抵触しているオブジェクトの有無を調べるパッケージです。
スキーマを指定することで、対象スキーマに格納されているオブジェクトの移行可否、不可となるオブジェクトについてはその理由と対処方法を出力してくれるツールです。  

尚、現時点でサポート対象となるOracle Databaseのバージョンは以下となっています。
* 10.2 and higher including 11g, 12c, 18c and 19c（2021/8時点）
 

<BR>

<a id="anchor2"></a>

# 2. 事前準備

<a id="anchor2-1"></a>

## 2-1. パッケージのダウンロード
まずはパッケージを入手し、調査対象となるデータベース環境で実行できる場所に配置します。

1. 以下、My Oracle Supportにアクセスしダウンロードしてください。  
  [Oracle Autonomous Database Schema Advisor (Doc ID 2462677.1)](https://support.oracle.com/knowledge/Oracle%20Cloud/2462677_1.html){:target="_blank"}

2. ダウンロード後、展開した**install_adb_advisor.sql**をWinSCP等を利用してDBCS上のOracleユーザーの任意の場所に配置してください（以降ではHOMEディレクトリ以下に配置したとして記載しています）
```
ls -al install_adb_advisor.sql 
```
![イメージ](img102.png)

<BR>

<a id="anchor2-2"></a>


## 2-2. パッケージのインストール
インストールするユーザーをPDB上に新規作成しパッケージをインストールします。  

<br>

1. 移行元のOracle Database にログインします。
```sh
sqlplus / as sysdba
```

2. pdb1に切り替えます
```sql
alter session set container = pdb1;
```

3. スクリプトを実行します。ここでは新規に作成するユーザーとして以下を指定しています。
    * ユーザー名：**ADB_ADVISOR**
    * パスワード：**WelCome123#123#**
```sql
@install_adb_advisor.sql ADB_ADVISOR WelCome123#123#
```
（実行例、後半は省略）
![イメージ](img103.png)


4. 特にエラーがないことを確認し、SQL*Plusを終了します。
```
exit
```

> （補足）  
実行途中で「**ORA-00942: table or view does not exist**」といったエラーが表示され他場合、こちらは新規にユーザーを作成している中で存在しない表に対する操作を実行しようとしたことによるエラーですので、ここでは無視して構いません。  


以上でインストール作業は完了です。


<BR>

<a id="anchor3"></a>

# 3. 実行と結果確認
それではHRスキーマに格納されている各種オブジェクトをADBに移行できるかチェックしてみましょう。

<br>

1. **ADB_ADVISOR**でpdb1インスタンスにログインします。
```sh
sqlplus ADB_ADVISOR/WelCome123#123#@pdb1
```

2. SQL*Plusの環境変数をセットします。
```sql
set serveroutput on format wrapped
set lines 200
```

3. **HRスキーマ**が**ATP**に適合できるか実行します。
```sql
EXEC ADB_ADVISOR.REPORT(schemas => 'HR',adb_type => 'ATP') ;
```
（実行例、後半は省略）  
**SECTION1: SUMMARY** に対象スキーマのオブジェクト数と移行可否オブジェクトの数が出力されます。
また、サポートしていないものの対応策があるものについては簡単なガイドをしてくれます。  
![イメージ](img105.png)
例えばここでは変更が必要なオブジェクトとして、「索引構成表は利用できないので、COUNTRIES表はData Pumpでロードする際に変換するように」といったことを確認いただけます。
![イメージ](img106.png)  

4. 次に、**HRスキーマ**が**ADW**に適合できるか実行します。
```sql
EXEC ADB_ADVISOR.REPORT(schemas => 'HR',adb_type => 'ADW') ;
```
こちらでは先の[301: 移行元となるデータベースを作成しよう](/ocitutorials/database/adb301-create-source-db)で作成したLONG型を有するNG_TAB_4ADW表はADBに移行できないことを、対応策と共に明示してくれます。  
![イメージ](img107.png)
> 補足  
その他、このレポートではADBへの移行に際して変更が必要な表領域や初期化パラメータの設定なども併せて表示してくれます。  
レポートされる内容に関する詳細、および結果サンプルについては[Oracle Autonomous Database Schema Advisor (Doc ID 2462677.1)](https://support.oracle.com/knowledge/Oracle%20Cloud/2462677_1.html){:target="_blank"}に同梱されている手順書を参照ください。
5. 次に、**HRスキーマ**が **ATP(Dedicated)** に適合できるか実行します。
```sql
EXEC ADB_ADVISOR.REPORT(schemas => 'HR',adb_type => 'ATPD') ;
```
> （補足）  
このパッケージはShared(共有)型だけでなく、Dedicated型のAutonomous Databaseにも対応しています。

<BR>

<a id="anchor4"></a>

# 4. パッケージのアンインストール
使い終わったら消しておきましょう。

<br>

1. 移行元のOracle Database にログインします。
```sh
sqlplus / as sysdba
```

2. pdb1に切り替えます
```sql
alter session set container = pdb1;
```

3. ADB_ADVISORスキーマを削除します。
```sql
SQL> drop user ADB_ADVISOR cascade;
```

<br/>

<a id="anchor5"></a>

# おわりに
ここではAutonomous Databaseに移行する際に利用できる事前チェックスクリプトを紹介しました。  
移行プロジェクトを開始される際の事前チェックとしてご利用いただけますので、ぜひご検討いただければと思います。

<br/>

# 参考資料

* [Autonomous Database Cloud 技術詳細](https://speakerdeck.com/oracle4engineer/autonomous-database-cloud-ji-shu-xiang-xi){:target="_blank"}
* [マニュアル(ADB-Sの各種制限事項について)](https://docs.oracle.com/cd/E83857_01/paas/autonomous-database/adbsa/experienced-database-users.html#GUID-58EE6599-6DB4-4F8E-816D-0422377857E5){:target="_blank"}
* [Oracle Autonomous Database Schema Advisor (Doc ID 2462677.1)](https://support.oracle.com/knowledge/Oracle%20Cloud/2462677_1.html){:target="_blank"}


<br/>
以上でこの章は終了です。次の章にお進みください。
<BR>

[ページトップへ戻る](#anchor0)

