---
title: "105: バックアップからリストアしよう"
excerpt: "Base Database Service (BaseDB) 上で取得したバックアップからリストアする手順について紹介します。"
order: "1_105"
header:
  teaser: "/basedb/dbcs105-restore/restore00.png"
  overlay_image: "/basedb/dbcs105-restore/restore00.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
  
#link: https://community.oracle.com/tech/welcome/discussion/4474283/
---

<a id="anchor0"></a>

# はじめに
BaseDB では、自動バックアップ機能やオンデマンドバックアップにて取得したバックアップを利用する事で、最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。
また、バックアップ元のデータベースに対してリストアするだけでなく、別DBシステム上にリストアする事も可能です。
ここでは、OCI コンソールからリストアする手順についてご紹介します。

<br>

**前提条件 :**
+ [Oracle CloudでOracle Databaseを使おう](../dbcs101-create-db){:target="_blank"} を通じて Oracle Database の作成が完了していること

+ [自動バックアップを設定しよう](../dbcs104-backup){:target="_blank"} を通じてバックアップを取得していること

<br>

**注意** チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。

<br>

**目次**

- [1. バックアップ元のデータベースに対してリストア](#1-バックアップ元のデータベースに対してリストア)
- [2. バックアップから新規データベースとしてリストア](#2-バックアップから新規データベースとしてリストア)
- [3. オンデマンドバックアップを使用したリストア](#3-オンデマンドバックアップを使用したリストア)

<br>
**所要時間 :** 約30分
<br>

# 1. バックアップ元のデータベースに対してリストア

まずはバックアップ元のデータベースに対してリストアしてみましょう。
リストア方法には下記3つがありますので、リストアしたい地点に応じてどのリストア方法を利用するか検討してください。

- **最新にリストア** <br>
データ損失の可能性が最も低い、直近の正常な状態にデータベースをリストアします。

- **タイムスタンプにリストア**<br>
指定した日時にデータベースをリストアします。

- **SCNにリストア**<br>
SCNを使用してデータベースをリストアします。<br>
有効なSCNを指定する必要がありますので、データベース・ホストにアクセスして問い合せるか、オンラインまたはアーカイブ・ログにアクセスして使用するSCN番号を確認してください。

1. コンソールメニューから **Oracle Database → Oracleベース・データベース・サービス** を選択し、有効な管理権限を持つコンパートメントを選択します

1. リストアしたい**DBシステム**を選択します

1. 左側の**リソース**から**データベース**を選択し、データベース一覧から対象のデータベース名を選択します

1. 画面上部から**リストア**ボタンをクリックします
    <div align="center">
    <img width="700" alt="restore01.png" src="restore01.png" style="border: 1px black solid;">
    </div>
    <br>

1. **データベースのリストア**画面がポップアップする為、リストア方法を選択します
    <div align="center">
    <img width="700" alt="restore02.png" src="restore02.png" style="border: 1px black solid;">
    </div>
    <br>

1. **データベースのリストア**ボタンをクリックします<br>
リストア作業が完了するとステータスが**UPDATING**から**AVAILABLE**に変わります
<br>

# 2. バックアップから新規データベースとしてリストア

続いて、取得したバックアップを利用して新規データベースとしてリストアする手順を紹介します。

1. 対象のデータベースの『データベースの詳細』ぺージの『バックアップ』をクリックします。

1. リストア対象のバックアップの右側にある・・・メニューから、「データベース作成」をクリックします。
    <div align="center">
    <img width="700" alt="restore03.png" src="restore03.png" style="border: 1px black solid;">
    </div>
    <br>

1. **バックアップからのデータベースの作成**画面で、**新規DBシステムの作成**を選択して「作成」をクリックします。<br>※**既存のDBシステムを使用**は、リストア先がベア・メタルインスタンスの場合のみ選択可能です
    <div align="center">
    <img width="700" alt="restore04.png" src="restore04.png" style="border: 1px black solid;">
    </div>
    <br>

1. 新規作成する**DBシステム**の設定を行います。<br>
※設定方法は新規作成時と同様ですので、入力項目は[Oracle CloudでOracle Databaseを使おう](../dbcs101-create-db){:target="_blank"}をご参照下さい

1. 新規作成時と異なる点として、ソース・データベースのパスワード入力が求められます。<br>
ソース・データベースのパスワードを入力し、「作成」をクリックする事で新規データベースとしてバックアップをリストアします。
    <div align="center">
    <img width="700" alt="restore05.png" src="restore05.png" style="border: 1px black solid;">
    </div>
    <br>

1. **DBシステムの作成** をクリックします。<br>
DBシステムの作成がバックエンドで開始します。作業が完了するとステータスが **PROVISIONING...** から **AVAILABLE** に変わります


# 3. オンデマンドバックアップを使用したリストア

1. コンソールメニューから**Oracle Database → Oracle Base Database (VM, BM)**を選択し、**スタンドアロン・バックアップ**をクリックします。

1. 一覧から、リストアしたいバックアップ右側の・・・から、「データベースの作成」をクリックします。
    <div align="center">
    <img width="700" alt="restore06.png" src="restore06.png" style="border: 1px black solid;">
    </div>
    <br>

1. **バックアップからのデータベースの作成**画面で、**新規DBシステムの作成**を選択して「作成」をクリックします。
    <div align="center">
    <img width="700" alt="restore07.png" src="restore07.png" style="border: 1px black solid;">
    </div>
    <br>

1. 新規作成する**DBシステム**の設定を行います。<br>
※設定方法は新規作成時と同様ですので、入力項目は[Oracle CloudでOracle Databaseを使おう](../dbcs101-create-db)をご参照下さい

1. 新規作成時と異なる点として、ソース・データベースのパスワード入力が求められます。<br>
ソース・データベースのパスワードを入力し、「作成」をクリックする事で新規データベースとしてバックアップをリストアします。
    <div align="center">
    <img width="700" alt="restore08.png" src="restore08.png" style="border: 1px black solid;">
    </div>
    <br>

1. **DBシステムの作成** をクリックします。<br>
DBシステムの作成がバックエンドで開始します。作業が完了するとステータスが **PROVISIONING...** から **AVAILABLE** に変わります

<br>
以上で、この章の作業は完了です。

<br>
[ページトップへ戻る](#anchor0)