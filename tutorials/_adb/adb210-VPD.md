---
title: "210 : 仮想プライベートデータベース(VPD:Virtual Private Database)による柔軟で細やかなアクセス制御の実装"
excerpt: "表やビューといったオブジェクト単位ではなく、行や列の単位でアクセス制御をかけたい場合に利用できるのが仮想プライベートデータベース(VPD)です。基本的な設定の流れを学習しましょう。"
order: "3_210"
layout: single
header:
  teaser: "/adb/adb210-vpd/vpd.png"
  overlay_image: "/adb/adb210-vpd/vpd.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776
---
<a id="anchor0"></a>

# はじめに
Oracle DatabaseのEnterprise Editionでは、表単位より細やかな行や列単位でのアクセス制御をおこなうために、**仮想プライベートデータベース(VPD：Virtual Private Database)**というソリューションを提供しています。  
たとえばひとつの表に複数のユーザーのデータがまとめて入っているような場合でも、それぞれのユーザーが表に全件検索を実施した時に自分のデータしか結果としてもどらないようにすることが可能です。   

では、どのような仕組みでそれを実現しているのでしょうか。  
実は、内部でSQLに対して自動的に動的な条件を付加しています。イメージで示してみましょう。  
 
   ![VPDの説明イメージ](VPD.png)


部門(Group)が経理部(FIN)の人と営業部(SALES)の人が同じ人事データの表（HR_DETAIL表）に対して同じSQLで検索を行います。しかし、データベース内部では、そのSQLに自動的にユーザーの属性にあわせた条件(Where句(赤字))を付加して実行しています。その結果、それぞれの所属部門に適した異なる結果が表示されるというわけです。

VPDはAutonomous Databaseでも利用できる機能です。基本的な設定、動作を試してみましょう。　　


**目次 :**
  + [1.テスト用の表を作成](#1-テスト用の表を作成)
  + [2.ユーザーを作成](#2-ユーザを作成)
  + [3.VPDファンクションの作成](#3-vpdファンクションの作成)
  + [4.VPDファンクションをVPDポリシーとして適用](#4-vpdファンクションをvpdポリシーとして適用)
  + [5.動作確認](#5-動作確認)
  + [6.VPDポリシーの削除](#6-vpdポリシーの削除)


**前提条件 :**
 + テスト用の表を作成するスキーマは任意のスキーマでも構いませんが、ここでは、[「101:ADBインスタンスを作成してみよう」](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/) で作成したユーザADBUSERを利用しています。
 + SQLコマンドを実行するユーザインタフェースは、接続の切り替えが容易なので、SQL\*Plusを利用しています。Database Actionsでも実行可能ですが、ユーザでの接続をログインに読み替え、ログインしなおす必要があります。なお、 SQL\*Plusの環境は、[「204:マーケットプレイスからの仮想マシンのセットアップ方法」](https://oracle-japan.github.io/ocitutorials/adb/adb204-setup-VM/)で作成できます。
 + チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、各ユーザのパスワードはすべて「Welcome12345#」とします。
 + 使用パッケージの引数についての説明は記載していません。詳細はドキュメント[『PL/SQLパッケージ及びタイプ・リファレンス』](https://docs.oracle.com/cd/F19136_01/arpls/DBMS_RLS.html#GUID-27507923-FF74-4193-B55D-6ECB11B58FCC)（リンクは19c版です）をご参照くださいますようお願いいたします。

**所要時間 :** 約20分

<BR>


# 1. テスト用の表を作成
サンプルスキーマのSSBスキーマのCUSTOMER表の一部を利用して、[「101:ADBインスタンスを作成してみよう」](https://oracle-japan.github.io/ocitutorials/adb/adb101-provisioning/) で作成したADBUSERスキーマにテスト用の表を作成します。  
SQL*Plusを起動して以下を実行してください。

```sql
-- ADBUSERで接続する
CONNECT adbuser/Welcome12345#@atp01_low
-- SSB.CUSTEOMER表から新しくVPD_CUSTOMER表を作成する
CREATE TABLE adbuser.vpd_customer AS SELECT * FROM ssb.customer WHERE ROWNUM<10000;
```

ADBUSER.VPD_CUSTOMER表は以下のような構成の顧客情報の表となります。

   ![VPD_CUSTOMER表の構成](vpd_customer.png)


リージョン（REGION)毎の件数を確認してみましょう。

```sql
SELECT c_region,COUNT(*) FROM adbuser.vpd_customer GROUP BY c_region;
```

**結果 :**  
![リージョンごとの件数 by ADBUSER](count_all.png)

複数のリージョンのデータがあることがわかりますね。  
それでは、この表に対し、各リージョン担当ユーザは自分の担当リージョンのデータしか参照できないようにVPDを設定していきます。
代表としてASIAリージョンを対象にします。

<BR>


# 2. ユーザを作成
ADMINユーザで接続し、ASIA担当のユーザをわかりやすくASIAという名前で作成します。  

```sql
-- ADMINで接続する
CONNECT admin/Welcome12345#@atp01_low
-- ASIAユーザを作成する
CREATE USER asia IDENTIFIED by "Welcome12345#";
-- 接続するためのCONNECTロールとADBUSER.VPD_CUSTOMER表への参照権限を付与
GRANT CONNECT TO asia;
GRANT SELECT ON adbuser.vpd_customer TO asia;
```

ASIAユーザで接続してADBUSER.VPD_CUSTOMER表に対して、1と同じSQLを実行します。

```sql
-- ASIAで接続する
CONNECT asia/Welcome12345#@atp01_low
-- リージョンごとの数を確認する
SELECT c_region,COUNT(*) FROM adbuser.vpd_customer GROUP BY c_region;
```

**結果 :**  
   ![リージョンごとの件数 by ASIA](count_all.png)


VPDの設定前はADBUSERと同じように全てのリージョンの情報が結果として返されています。

<BR>


# 3. VPDファンクションの作成
SQLに付加する条件（Where句の内容）を戻すVPDファンクションを作成します。  
言い換えると、このVPDファンクションでどのような場合にどのデータにアクセスさせるかというルールを記述するということになります。
今回付加したい条件は「**ログインしたユーザー名がC_REGION列の値と同じ**」となりますので、ファンクションを以下のように作成します。
ファンクションを作成するユーザはADMINユーザです。
**<font color="RED">このチュートリアルではADMINユーザで行っていますが、VPDファンクションの作成および後に続くVPDポリシーの定義はセキュリティ管理者として信頼できるスキーマで実行する必要があります。</font>**

```sql
--ADMINで接続する
CONNECT admin/Welcome12345#@atp01_low

--ファンクションを作成する
CREATE OR REPLACE FUNCTION vpdfunc
  (v_schema VARCHAR2, v_objname VARCHAR2)
  RETURN VARCHAR2
AS
  v_text VARCHAR2(400);
BEGIN
-- 条件となる文字列を変数v_textに代入し、RETURNで返すように設定
  v_text := 'c_region='''||UPPER(SYS_CONTEXT('USERENV','SESSION_USER')||'''');
  RETURN v_text;
end;
/ 
```

+ **Note :**
  + VPDファンクションでは引数として対象の表の所有者と表の名前が必要です。ここでは引数名をv_schemaとv_objnameと定義しています。
  + ログインしたユーザ名の取得はSYS_CONTEXT関数で可能です。SYS_CONTEXT関数はクライアントからサーバへの接続で確立されるデータベースセッションの情報を取得ができる便利な関数です。詳細は[ドキュメント](https://docs.oracle.com/cd/F19136_01/sqlrf/SYS_CONTEXT.html#GUID-B9934A5D-D97B-4E51-B01B-80C76A5BD086)をご確認ください。

<BR>


# 4. VPDファンクションをVPDポリシーとして適用
作成したファンクションををVPDポリシーとして対象のオブジェクト（表、ビューなど）に関連付けます。  
ポリシーをオブジェクトに紐づけることで、ユーザがどのような方法でそのオブジェクトにアクセスしても同じポリシーが適用されます。  
VPDポリシーの構成や管理にはDBMS_RLSパッケージを利用します。デフォルトではDBMS_RLSパッケージは管理者権限を持つユーザが利用可能です。  

ADMINユーザで接続し、以下を実行します。

```sql
-- ADMINで接続する
CONNECT admin/Welcome12345#@atp01_low

-- VPDポリシーを対象のオブジェクトに追加する
BEGIN
  DBMS_RLS.ADD_POLICY(
    object_schema => 'ADBUSER',
    object_name => 'VPD_CUSTOMER',
    policy_name => 'VPDPOL',
    function_schema => 'ADMIN',
    policy_function => 'VPDFUNC');
END;
/ 
```
　
以上でVPDの設定は完了です。

<BR>


# 5. 動作確認
それでは実際にユーザー別に同じSQLで異なるデータが返ってくるかどうかを確認してみましょう。
実行するSQLは1で利用したリージョンごとの数を表示させるものです。

```sql
SELECT c_region,COUNT(*) FROM adbuser.vpd_customer GROUP BY c_region;
```

## ADBUSERで実行

```sql
--ADBUSERで接続する
CONNECT adbuser/Welcome12345#@atp01_low
--確認
SELECT c_region,COUNT(*) FROM adbuser.vpd_customer GROUP BY c_region;
```

**結果 :**  
   ![リージョンごとの件数2 by ADBUSER](count_norows.png)


表の所有者であっても条件が有効となり、ADBUSERという値がC_REGION列にはないため、レコードがない（NO ROWS）となります。


## ASIAで実行

```sql
--ASIAで接続する
CONNECT asia/Welcome12345#@atp01_low
--確認
SELECT c_region,COUNT(*) FROM adbuser.vpd_customer GROUP BY c_region;
```
**結果 :**  
   ![リージョンごとの件数2 by ASIA](count_asia.png)

ASIAだけの値が返されました。VPDの設定どおりの動作をしたことが確認できました。


## ADMINで実行
それでは、ADMINユーザではどうでしょうか。

```sql
--ADMINユーザで接続
CONNECT admin/Welcome12345#@atp01_low
--確認
SELECT c_region,COUNT(*) FROM adbuser.vpd_customer GROUP BY c_region;
```

**結果 :**  
   ![リージョンごとの件数 by ADMIN](count_all.png)

全てのデータが出力されました。これはADMINユーザは特権ユーザであるためです。
もし特権ユーザのアクセスも制御したい場合はDatabase Vaultで可能です。["209 : Database Vaultによる職務分掌に基づいたアクセス制御の実装"](../adb209-DV/)をご確認ください。

<BR>


# 6. VPDポリシーの削除
VPDポリシーの削除もDBMS_RLSパッケージを使用して行います。
ADMINユーザで以下を実行します。

```sql
-- ADMINで接続
CONNECT admin/Welcome12345#@atp01_low
-- ポリシーを削除する
BEGIN
  DBMS_RLS.DROP_POLICY(
    object_schema => 'ADBUSER',
    object_name => 'VPD_CUSTOMER',
    policy_name => 'VPDPOL'
  );
END;
/
```

削除後、再度5の確認操作を行うと、どのユーザも全データを参照できるようになっていることをご覧いただけます。

<BR>

# おわりに
このチュートリアルでは基本的な設定方法をお伝えするために簡単な例を用いましたが、VPDではファンクションでルールの記述を行うため、柔軟で細やかなアクセス制御を実装させることが可能です。 

+ 例
  + 人や時間、クライアント端末、アプリなどの様々なアクセス条件を設定
  + オブジェクトだけでなく特定のSQL文タイプの指定（SELECT、INSERT、UPDATE、INDEX、DELETE）
  + 列の指定や列に対するマスク(NULL値として表示)

そのため、VPDを構成するときに最も重要な作業はアクセスのルールの設計、明確化となります。実環境でのご利用を検討されるときは、その点で抜け漏れがないか十分ご注意ください。


以上でこの章は終了です。次の章にお進みください。

<BR>

# 参考資料
+ Oracle Database 19c
『Oracle Database セキュリティ・ガイド』["12 Oracle Virtual Private Databaseを使用したデータ・アクセスの制御"](https://docs.oracle.com/cd/F19136_01/dbseg/using-oracle-vpd-to-control-data-access.html#GUID-06022729-9210-4895-BF04-6177713C65A7)

<BR>

# Tips
+ 1つのオブジェクトに作成できるVPDポリシーの最大数は255です
+ 追加された条件はEXPLAIN PLANコマンドの結果から確認することができます。
	```sql
  -- EXPLAIN PLAN文で実行計画を取得
	EXPLAIN PLAN FOR SELECT c_region,COUNT(*) FROM adbuser.vpd_customer GROUP BY c_region;
  -- 取得結果を表示
	SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
	```
  **結果 :**  
     ![EXPLAN PLANの結果](explain.png)
+ 述語が間違っているときは、SQL文実行時にORA-28113が出力されます。VPDファンクションで生成する条件の文字列が条件として正しい文法かどうかご確認ください。

<BR>

[ページトップへ戻る](#anchor0)