---
title: "Oracle AI Database編 - Autonomous AI Database (AAIDB)を使ってみよう"
description: "自己稼働・自己保護・自己修復がコンセプトのAutonomous AI Database(AAIDB)を学ぶチュートリアルです。インスタンスの作成から、運用管理までを一通り体験します。"
permalink: /adb
layout: single
tags:
  - "Database"
show_excerpts: true
toc: true
---

**チュートリアル一覧に[もどる](../)**
<br/>

---

**前提条件**

- Oracle Cloud Infrastructure の環境と、ユーザーアカウントがあること(トライアル環境でも実施いただける内容となっています。)
- 適切なコンパートメントと、そこに対する適切な権限がユーザーに付与されていること

**特記事項**

- チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。
- [OCI チュートリアル入門編](../beginners/)の、準備からその 1、その 2、その 3、その 7 を実施しておくと、理解がスムーズです。
- より詳しく知りたい方は、[OCI 活用資料集](https://oracle-japan.github.io/ocidocs/services/database/)も併せてご確認ください。それぞれのサービスに関する技術詳細資料をまとめ紹介しています。
  <br/>

---

<br/>

# <span style="color: brown; ">■ Autonomous AI Database (AAIDB)を使ってみよう</span>

自己稼働・自己保護・自己修復をコンセプトに Oracle AI Database、および Exadata をより身近にご利用いただくべく登場した Autonomous AI Database !
インスタンスの作成から、運用管理まで一通り学んでいただける内容になっています

> Autonomous AI Database (AAIDB)は、対象システムの処理特性に応じて以下を選択できます。本チュートリアルでは、ATP を対象に記載していますが、その他に関しても基本的な操作は同じです。
>
> - 分析系システムを対象とする Autonmous Data Warehouse (ADW)
> - 汎用的な用途で利用可能な Autonomous Transaction Processing (ATP)
> - 主に JSON データを扱うシステムに適した Autonomous JSON Database (AJD)
> - Oracle APEX アプリケーション開発用に構築されている APEX Application Development (APEX)

## 基礎編

- **[101: AAIDB インスタンスを作成してみよう](./adb101-provisioning/)**
  - インスタンス作成から接続、データベース・ユーザーの作成まで実施します
- **[102: AAIDB にデータをロードしよう(Database Actions)](./adb102-dataload/)**

  - CSV データを手元の PC およびオブジェクトストレージから AAIDB にロードします
  - またオブジェクトストレージ上で更新されたデータを自動的に DB に登録する方法も取り上げます（フィード機能）

- **[103: Oracle LiveLabs のご紹介](./adb103-livelabs/)**

  - さまざまな Oracle Technology のワークショップを提供している Oracle LiveLabs の概要、始め方についてご紹介します

- **[104: クレデンシャル・ウォレットを利用して接続してみよう](./adb104-connect-using-wallet/)**
  - SQL\*Plus、SQLcl、SQL Developer からの接続方法についても確認します
- **[105: AAIDB の付属ツールで簡易アプリを作成しよう(APEX)](./adb105-create-apex-app/)**
  - 所要時間は約 10 分！スプレッドシート(Excel シート)から簡易アプリケーションを作成します
- **[106: AAIDB でコンバージド・データベースを体験しよう](./adb106-json/)**

  - JSON データを AAIDB に登録し、API および SQL で操作します

- **[107: AAIDB の付属ツールで機械学習(予測モデルからデプロイまで)](./adb107-machine-learning/)**

  - タイタニック号の乗客情報から生存予測モデルを作成し、アプリで予測結果のレポートまで AAIDB の中で行います。

- **[108: 接続文字列を利用して接続してみよう](./adb108-walletless)**

  - ウォレットを使用しない接続方法とその前提となるネットワーク・アクセス・タイプの条件を確認します。

- **[109: プライベート・エンドポイントの AAIDB を作成してみよう](./adb109-private-endpoint)**

  - よりセキュアなネットワーク構成であるプライベート・エンドポイントの AAIDB を作成します。

- **[110: Oracle Analytics Desktop を使ってデータを見える化してみよう](./adb110-analyze-using-oad/)**

  - Oracle Analytics Desktop を使って AAIDB のデータを見える化します。

- **[111: SELECT AI を試してみよう](./adb111-select-ai/)**
  - Select AI を使って自然言語でデータベース内のデータを問合せる方法をご紹介します

## 実践編

- **[201: 接続サービスの理解](./adb201-service-names/)**

  - インスタンスに接続する際の、CPU の割当や並列処理のコントロールを決定する「接続サービス」についてご紹介します。

- **[202: コマンドラインから大量データをロードしてみよう](./adb202-dataload-dbms-cloud/)**
  - 大規模な CSV データを想定し、オブジェクト・ストレージから DBMS_CLOUD パッケージを利用してロードします
- **[203: 分析系クエリの実行(Star Schema Benchmark)](./adb203-bulk-query/)**

  - SSB スキーマに対して重いクエリ処理を実行し、ECPU 数をスケールすることで高速化できること確認します

- **[204: 開発者向け仮想マシンのセットアップ方法](./adb204-setup-VM/)**

  - 開発用の仮想マシンイメージを利用して、開発環境を作成しましょう。後続のチュートリアルにて利用します

- **[205: オンライン・トランザクション系のアプリを実行してみよう（Swingbench)](./adb205-swingbench/)**

  - ECPU 数と自動スケーリング設定に応じて AAIDB の TPS(Transaction per second)が向上していく流れを Swingbench を通して体験します

- **[206: Node.js による AAIDB 上でのアプリ開発](./adb206-appdev-nodejs/)**

  - Node.js にて AAIDB に接続し、簡易アプリを実行してみます

- **[207: Python による AAIDB 上でのアプリ開発](./adb207-appdev-python/)**

  - Python で AAIDB に接続し、AAIDB に格納されているデータを操作してみます

- **[208: Oracle Machine Learning で機械学習をしよう](./adb208-oml-notebook/)**

  - 機械学習のサンプルを 2 つほど取りあげ、OML Notebook の使い方を確認します

- **[209 : Database Vault による職務分掌に基づいたアクセス制御](./adb209-DV/)**

  - データベース管理者であっても本来参照してはいけないデータがあるはず。AAIDB での特権ユーザーからアクセス制御方法を確認します

- **[210 : 仮想プライベートデータベース(VPD)による細やかなアクセス制御](./adb210-VPD/)**

  - 同じ表のデータでも行や列の単位でアクセス制御をかけることができます。AAIDB での設定方法を確認します

- **[211: クローン機能を使ってみよう](./adb211-clone/)**

  - AAIDB を簡単に複製することができる、クローニング機能についてご紹介します

- **[212: Autonomous AI Database を災害対策構成にしてみよう](./adb212-audg/)**

  - たった数クリックでスタンバイ・データベースをプロビジョニングし DR 構成を実現します

- **[213 : Application Continuity を設定しよう](./adb213-tac/)**

  - ネットワークの瞬断等の予期せぬエラーからアプリケーションを守るには？

- **[214 : Spatial Studio で地理情報を扱おう](./adb214-spatial-studio/)**

  - Spatial Studio を使って、地理情報からさまざまな空間分析を行います

- **[215 : Graph Studio で金融取引の分析をしよう](./adb215-graph/)**

  - Autonomous AI Database の標準機能である Graph Studio の使い方をご紹介します。

- **[216 : SQL Performance Analyzer(SPA)によるパッチ適用のテストソリューション](./adb216-patch-spa/)**

  - Autonomous AI Database の特徴の一つである自動パッチ適用の SQL の性能影響を事前にテストします。

- **[217: Database Actions を使ってみよう](./adb217-use-database-actions/)**

  - Database Actions の内、データ分析、データ・インサイト、カタログの機能を確認します。

- **[218 : リフレッシュ可能クローンを活用しよう](./adb218-refreshable-clone/)**

  - Autonomous AI Database のクローンの一種であるリフレッシュ可能クローンを作成し、その動作を確認します。

- **[219 : Automatic Indexing を体験してみよう](./adb219-autoindexing/)**
  - Automatic Indexing の機能を用いて、人手を介することなく索引を管理することができます。
- **[220 : 自動ワークロード・リプレイによるパッチ適用のテストソリューション](./adb220-autoworkload-replay/)**

  - 毎週の自動パッチ適用によるアプリケーションへの影響を、テスト環境で毎週自動でテストします。

- **[221 : 自動パーティション化（Automatic Partitioning）を使ってみよう](./adb221-autopartitioning/)**
  - 対象の表に最適なパーティション方法の分析とその実装までを API で簡単に行うことができます。

## データ移行編

- **[301: 移行元となるデータベースを作成しよう](./adb301-create-source-db)**

  - この**データ移行編**における準備作業として、まずは現行ご利用いただいている Oracle AI Database を想定したデータベースを一つ作成します。

- **[302: Cloud Premigration Advisor Tool(CPAT)を活用しよう](./adb302-cpat)**

  - 現行 Oracle AI Database 環境にて Autonomous AI Database が対応していない機能を利用していないか確認できる「Cloud Premigration Advisor Tool(CPAT)」をご紹介します。

- **[303: Data Pump を利用してデータを移行しよう](./adb303-datapump)**

  - データ移行に関する機能として従来からよく利用される Data Pump を利用した移行方法をご紹介します。

- **[304 : OCI Database Migration Service を使用したデータベース移行の前準備](./adb304-database-migration-prep)**

  - OCI DMS を使用したデータベース移行の前準備についてご紹介します。

- **[305 : OCI Database Migration Service を使用したデータベースのオフライン移行](./adb305-database-migration-offline)**

  - OCI DMS を使用した BaseDB から AAIDB へのオフライン移行についてご紹介します。

- **[306 : OCI Database Migration Service を使用したデータベースのオンライン移行](./adb306-database-migration-online)**
  - OCI DMS を使用した BaseDB から AAIDB へのオンライン移行についてご紹介します。

## データ連携編

- **[401: OCI GoldenGate を利用したデータ連携](./adb401-oci-goldengate)**

  - OCI GodenGate を利用して、BaseDB から AAIDB へのデータ連携方法をご紹介します。

- **[402: Database Link を利用したデータ連携](./adb402-database-link)**

  - Database Link を利用して、AAIDB から他のデータベースへアクセスする方法をご紹介します。

- **[OCI Data Integration チュートリアル](../intermediates/ocidi-tutorials)**

  - ノーコーディングで ETL 処理を行うことができるフルマネージド・サービスを利用し、AAIDB にデータをロードする手順を解説します。

- **[403: Data Transforms を使ってみよう](./adb403-data-transforms)**
  - Data Transforms を用いて、簡単な操作でデータを変換できることが体験できます。
- **[404:クラウド・リンクによるデータ共有をしてみよう](./adb404-cloud-link)**

  - クラウド・リンクを使用したデータの共有手順をご紹介します。

- **[405: ライブ共有を使ってみよう](./adb405-live-share)**
  - この共有では、受信者は Oracle 表またはビューから直接、最新のデータにアクセスします。

## 運用管理編

- **[501: OCICLI を利用したインスタンス操作](./adb501-ocicli)**

  - OCI CLI を利用した AAIDB インスタンスの作成や起動・停止、およびスケールアップ、ダウンといった構成変更の方法について確認します。

- **[502: 各種設定の確認、レポートの取得](./adb502-report)**

  - OS 領域に入ることのできない AAIDB における各種レポート・ログの取得方法を確認します。

- **[503: AAIDB インスタンスの監視設定をしてみよう](./adb503-monitoring)**

  - データベース運用における重要なタスクの一つである、AAIDB インスタンスに対するパフォーマンス監視/アラート監視の方法をご紹介します。

- **[504: 監査をしてみよう](./adb504-audit)**

  - Autonomous AI Database の監査設定について確認します。

- **[505: Autonomous AI Database のバックアップとリストアを体感しよう](./AAIDB505-backup)**

  - Autonomous AI Database を任意のバックアップからリストアを行い、自動でバックアップが取られていること・簡単な Point-in-time リカバリを実感して頂きます。

- **[506: サポートサービスへの問い合わせ(Service Request の起票)](./adb506-sr)**
  - AAIDB の運用で困ったらどうすれば良いでしょうか。Service Request の登録の仕方を解説します。

## ビジネスシナリオ編

- **[601 : ADW で MovieStream データのロード・更新をしよう](./adb601-moviestream-load/)**

  - 大規模データに対する ADW の実用的な機能をご紹介します

- **[602 : ADW で MovieStream データの分析をしよう](./adb602-moviestream-analysis/)**

  - ADW での実践的なデータ分析を多数の標準機能とともにご紹介します

- **[603 : データ・カタログを使ってメタデータを収集しよう](./adb603-data-catalog/)**
  - データ・カタログを使用してデータベース内のデータおよびクラウド・ストレージ内のデータのメタデータを収集し、効率的に管理する方法をご紹介します

## Autonomous AI Database Dedicated (専有環境)編

- **[701 : ADB-D の環境を作成してみよう](./adb701-adbd/)**
  - Autonomous AI Database の基盤である Exadata を専有して利用する Autonomous AI Database Dedicated の環境を作成します

<br/>

---

- **[AAIDB ハンズオンラボ](https://community.oracle.com/tech/developers/discussion/4474304/autonomous-database-%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3%E3%83%A9%E3%83%9C-adb-hol)** ※旧サイト（順次、本サイトに移行中）

<br/>

**Database 編のチュートリアル一覧に[もどる](../)**

<!--

## 移行編（公開準備中）
## データ連携編
## 運用管理編
## Livelabsのお勧めコンテンツのご紹介
## ADBに関するよくあるFAQ

  -->

<br/>
