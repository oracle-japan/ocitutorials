---
title: "212: Autonomous Data Guardを構成してみよう"
excerpt: "DRを構成するにはどうしたら良いでしょうか？ADBでは数回クリックするだけでスタンバイ・データベースを簡単にプロビジョニングできます。"
order: "3_212"
layout: single
header:
  teaser: "/database/adb212-audg/img1.jpg"
  overlay_image: "/database/adb212-audg/img1.jpg"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

<a id="anchor0"></a>

# はじめに

Autonomous Databaseでは、Autonomous Data Guardと呼ばれる機能を使用して、スタンバイ・データベースを有効にする事ができます。これによって、Autonomous Databaseインスタンスにデータ保護およびディザスタ・リカバリを実現可能です。Autonomous Data Guardが有効になっている場合、フェイルオーバーやスイッチオーバーが可能なスタンバイ・データベースを提供します。

<br>

**目次**

- [Autonomous Data Guardの有効化](#anchor1)
- [Autonomous Data Guardのスイッチオーバー](#anchor2)

<br>

**所要時間:** 約30分

<br>

<a id="anchor1"></a>

# Autonomous Data Guardの有効化

1. Autonomous Databaseの詳細画面の**Autonomous Data Guard**のステータスが無効になっているのを確認後、**有効化**をクリックします。

   ![画面ショット1-1](img1.jpg)

1. **Autonomous Data Guardの有効化**をクリックします。

   ![画面ショット1-1](img2.jpg)

1. 画面左上のATPマークが黄色に変化しました。**Autonomous Data Guard**に**ピアの状態**が出現し、プロビジョニング中であることが確認できます。完了するまで待ってみましょう。

   ![画面ショット1-1](img3.jpg)

1. プロビジョニングが完了しました。ADB詳細画面のADB名の横に**プライマリ**というステータスが確認できます。**Autonomous Data Guard**のところに記載されている**ピアの状態**が、**使用可能**になりました。

   ![画面ショット1-1](img4.jpg)

1. ここで、ターミナルからADBにSQL Plusでログインしましょう。現在のプライマリDBの情報を下記のSQL文で確認します。

   ```
   sqlplus admin/<ADMINユーザのパスワード>@<ADBの接続サービス>
   ```

   ```
   SELECT 
   DBID, NAME, DB_UNIQUE_NAME
   FROM 
   V$DATABASE;
   ```

   ![画面ショット1-1](img4.5.jpg)

   スイッチオーバーの前後でDBID、NAME、DB_UNIQUE_NAMEが変化することを確認したいと思うので、SQLの出力結果をメモ帳などにメモしておいてください。

<a id="anchor2"></a>

# Autonomous Data Guardのスイッチオーバー

1. ADB詳細画面に戻り、スイッチオーバーをしていきます。**Autonomous Data Guard**から**スイッチオーバー**をクリックして下さい。

   ![画面ショット1-1](img4.jpg)

1. 画面左上のATPマークが黄色に変化しました。**Autonomous Data Guard**のところに記載されている**ピアの状態**が、**ロール変更進行中**であることが確認できます。完了するまで待ってみましょう。

   ![画面ショット1-1](img6.jpg)

1. スイッチオーバーが完了しました。**Autonomous Data Guard**のところに記載されている**ピアの状態**が、**使用不可**になり、スタンバイを準備している状態であることが確認できます。

   ![画面ショット1-1](img7.jpg)

1. ここで、ターミナルからADBにSQL Plusでログインしましょう。スイッチオーバー後のプライマリDBの情報を下記のSQL文でクエリしていきます。

   ```
   sqlplus admin/<ADMINユーザのパスワード>@<ADBの接続サービス>
   ```

   ```
   SELECT 
   DBID, NAME, DB_UNIQUE_NAME
   FROM 
   V$DATABASE;
   ```

   ![画面ショット1-1](img7.5.jpg)

   問合せたDBID、NAME、DB_UNIQUE_NAMEは、スイッチオーバー前に接続していたDBとは異なる情報です。適切にスイッチオーバーされたのが確認できます。

   <br>

   # Tips
   + スタンバイ・データベースはプライマリ・データベースと同じリージョン内に下記の様にプロビジョニングされます。
   + 複数の可用性ドメインがあるリージョンでは、スタンバイ・データベースはプライマリ・データベースとは異なる可用性ドメイン(AD)に自動的にプロビジョニングされますす。
   + 単一の可用性ドメインのリージョンでは、スタンバイ・データベースはプライマリ・データベースとは異なる物理マシンに自動的にプロビジョニングされます。
   + (2021/8) Cross-Regionにも対応しました
   
   <br>

以上で、この章の作業は終了です。


<br>
[ページトップへ戻る](#anchor0)