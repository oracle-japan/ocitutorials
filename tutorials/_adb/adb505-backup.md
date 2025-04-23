---
title: "505 : Autonomous Databaseのバックアップとリストアを体感しよう"
excerpt: "Autonomous Databaseを任意のバックアップからリストアを行い、自動でバックアップが取られていること・簡単なPoint-in-timeリカバリを実感して頂きます"
order: "3_505"
layout: single
header:
  teaser: "/adb/adb505-backup/img2.png"
  overlay_image: "/adb/adb505-backup/img2.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776
---

# はじめに
Autonomous Databaseでは自動バックアップがオンラインで取得され、取得したバックアップはバックアップを取得したADBにのみリストア可能です。保存期間は最小1日から最大60日で設定をする事が出来ます。インスタンス構成時にデフォルトで有効化されており、無効化することはできません。取得されたバックアップはOracle側で管理され、冗長化されており改変不可のイミュータブルバックアップです。

ユーザ自身がGUIやAPIを介して特定時点にリストアすることが可能です。本チュートリアルにおいても、Point-in-timeリカバリを実施いたします。

> （補足）
>  バックアップ操作中は、データベースは使用可能なままです。ただし、データベースの停止、スケーリング、終了などのライフサイクル管理操作は無効化されます。


**目次 :**
- [はじめに](#はじめに)
  - [自動バックアップの確認](#自動バックアップの確認)
  - [データベースに表を新規作成](#データベースに表を新規作成)
  - [タイムスタンプをUTCで確認](#タイムスタンプをutcで確認)
  - [Point-in-timeリカバリ](#point-in-timeリカバリ)
- [ご参考](#ご参考)
- [おわりに](#おわりに)

**前提条件**
+ ADBインスタンスが構成済みであること
    <br>※ADBインタンスの作成方法については、
    [101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning){:target="_blank"} を参照ください。  

<BR>

**所要時間 :** 約30分

<BR>

## 自動バックアップの確認

Autonomousa Databaseの詳細画面

![img](img0.png)

下にスクロールして、画面左側のタブの**バックアップ**をクリックし、これまでバックアップ履歴を確認します。

![img](img1.png)

自動バックアップが日時で取られているのが確認できます。
特に設定を行わずとも、自動バックアップが構成されています。

![img](img2.png)

全て増分バックアップになっており、60日ごと取得されているフルバックアップが無いのでは？と思われたかもしれませんが、こちらは誤りではなく、フルバックアップはRMANでは増分バックアップのLevel0となるので、この一覧では全て増分バックアップとして表示されております。

なお、Autonomous Databaseでは、1分ごとにアーカイブログがバックアップされています。(ADB-Dでは15分ごと)

保存期間内の任意のタイミングにタイミングにリストア・リカバリが可能になっています。
RMANを利用しており、ブロック破損のチェックも同時に行われているため信頼できるバックアップになっています。

また、Autonomous Databaseでは、これらのバックアップを格納しておくストレージストレージの追加コストは不要です。

## データベースに表を新規作成

では、この段階で新規でEmployee表を作成し、１行をインサートしてみます。

データベースの詳細画面の**データベース・アクション**をクリックします。

![img](img3.png)

**開発**の**SQL**をクリックします。

![img](img4.png)

SQLワークシートにて、下記の**SQL**を実行し、Employees表を新規作成します。

```sql
CREATE TABLE EMPLOYEES (
    FIRST_NAME VARCHAR(100),
    LAST_NAME  VARCHAR(100)
);
```

![img](img5.png)

SQLワークシートにて、下記の**SQL**を実行し、Employees表に新規で行インサートします。

```sql
INSERT INTO EMPLOYEES (
    FIRST_NAME,
    LAST_NAME
) VALUES (
    'Taro',
    'Oracle'
);
```

![img](img6.png)

SQLワークシートにて、下記の**SQL**を実行し、Employees表を確認します。

```sql
Select * from Employees;
```

![img](img7.png)

では、この段階でEmployee表の１行をアップデートしてみます。

SQLワークシートにて、下記の**SQL**を実行し、Employees表の１行をアップデートします。

```sql
UPDATE EMPLOYEES
SET
    FIRST_NAME = 'John',
    LAST_NAME = 'Autonomous';
```

![img](img9.png)

SQLワークシートにて、下記の**SQL**を実行し、Employees表を確認します。

```sql
Select * from Employees;
```

![img](img10.png)

Employees表には、John Autonomousが格納されています。


<BR>

## タイムスタンプをUTCで確認

では、この時点でのタイムスタンプを確認してみましょう。

SQLワークシートにて、下記の**SQL**を実行します

```sql
SELECT
    CURRENT_TIMESTAMP
FROM
    DUAL;
```

![img](img20.png)

Point-in-timeリカバリの際に利用するため、結果をメモしておきます。

```
CURRENT_TIMESTAMP        
------------------------ 
2021-12-11T03:38:42.647Z 
```

> （補足）現在時刻を問い合わせる際によく利用されるsysdateおよびsystimestamp関数ですが、Autonomous DatabaseはOSタイムゾーンがUTC固定となるため、返り値が日本時間（JST、+9:00)とはならない点にご留意ください。
>
>返り値をJSTで取得したい場合、DBのタイムゾーンをJSTに変更後、SYSDATE_AT_DBTIMEZONEパラメータをTRUEに変更することで、sysdateおよびsystimestampをDBのタイムゾーンで返すようにすることができます。
>詳しい手順は[こちら](https://qiita.com/500InternalServerError/items/c893dfe46a6c45975c72){:target="_blank"}をご参照ください。

<BR>

## Point-in-timeリカバリ

では、この段階でリストアを行います。

データベースの詳細画面の**他のアクション**>**リストア**をクリックします。

![img](img21.png)

リストアのポップアップから**タイムスタンプの入力**から確認したタイムスタンプの直前の時間帯を入力し、**リストア**をクリックします。

![img](img22.png)

データベースの詳細画面で**リストア進行中**の状態であることが確認できます。

![img](img23.png)

データベースの詳細画面でリストアが完了し、**使用可能**の状態になりました。

![img](img14.png)

では、この段階でEmployee表を確認してみます。

データベースの詳細画面の**データベース・アクション**をクリックします。

![img](img3.png)

**開発**の**SQL**をクリックします。

![img](img4.png)

SQLワークシートにて、下記の**SQL**を実行し、Employees表を確認します。

```sql
SELECT
    *
FROM
    EMPLOYEES;

```

![img](img24.png)

Taro Oracleにリストアされていることが確認できました。

# ご参考

Autonomous Databaseでは、自動バックアップを補完するために長期バックアップを作成することもでき、Autonomous Databaseの長期バックアップはAutonomous Database Backup Storageで3ヶ月〜10間保持されます。自動バックアップと異なり、コンソール/APIを使用して、週次、月次、若しくは年次でスケジューリングをする必要があります。

長期バックアップについては、[Autonomous Databaseで長期バックアップを作成する](https://docs.oracle.com/en-us/iaas/autonomous-database-serverless/doc/backup-long-term.html){:target="_blank"} を参照ください。  

また、Autonomous Databaseのバックアップ・リストアの手法一覧は下記でご確認いただけます。

![img](img30_new.png)

# おわりに
本記事では、ADBにおける自動バックアップとリストアに関してご紹介致しました。Autonomous Databaseでは、自動的にバックアップが取られるため基本的に手動バックアップは不要です。リストア・リカバリもOCIコンソールから実行いただけます。
<br>

以上でこの章は終了です。次の章にお進みください。

<br>

[ページトップへ戻る](#)