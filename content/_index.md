---
title: Oracle Cloud Infrastructure チュートリアル
geekdocNav: false
geekdocAlign: left
geekdocAnchor: false
---

<h2 class="gdoc-toppage-header2"> 準備 - Oracle Cloud の無料トライアルを申し込む </h2>

- [Oracle Cloud 無料トライアルを申し込む](https://www.oracle.com/jp/cloud/free/)  
  Oracle Cloud のほとんどのサービスが利用できるトライアル環境を取得することができます。このチュートリアルの内容を試すのに必要になりますので、まずは取得してみましょう。
  ※認証のために SMS が受け取れる電話とクレジット・カードが必要です(希望しない限り課金はされませんのでご安心を!!)
- [Oracle Cloud 無料トライアル サインアップガイド](https://faq.oracle.co.jp/app/answers/detail/a_id/6492)
- [Oracle Cloud 無料トライアルに関するよくある質問(FAQ)](https://www.oracle.com/jp/cloud/free/faq/)

<br>

<h2 class="gdoc-toppage-header2"> OCIを触ってみよう</h2>

{{< columns >}}

<h3> 1.&nbsp;<a href="./beginners">OCI入門編</a></h3>

OCI の入門編チュートリアルです。
OCI コンソールの基本的な操作方法やネットワーク、ストレージなどの基本的なサービスについてを学習できます。

<--->

<h3> 2.&nbsp;<a href="./intermediates">OCI応用編</a></h3>

OCI の応用編チュートリアルです。
LoadBalancer や証明書サービスなどをはじめとした各 OCI サービスの応用的な使い方を学習できます。

{{< /columns >}}

<br>

<h2 class="gdoc-toppage-header2"> ユースケース別チュートリアル</h2>

{{< columns >}}

<h3> {{< icon-oci "oci-in-practice" >}}&nbsp;<a href="./oci-in-practice">サービス連携編</a></h3>

サービス連携チュートリアルです。
ユースケース別にサービスを連携して利用する方法を学習できます。

<--->
{{< /columns >}}

<br>

<h2 class="gdoc-toppage-header2"> サービス別チュートリアル一覧 </h2>

{{< columns >}}

<h3> {{< icon-oci "database" >}} &nbsp;Oracle Database </h3>
Oracle Database関連サービスのチュートリアル

- [Autonomous Database 編](./adb)  
  Exadata 上で稼働する 自己稼働・自己保護・自己修復の自律型 Database

- [Oracle AI Vector Search 編](./ai-vector-search)  
  Oracle AI Vector Search を学ぶチュートリアルです。Always Free ADB の作成から、様々な使い方までを一通り体験します。

- [Base Database Service 編](./basedb)  
  OCI 上で Oracle Database をシンプルに使えるベーシックなデータベース・サービス

- [Exadata Database Service on Dedicated Infrastructure (ExaDB-D) 編](./exadbd)  
  Oracle Database が動く、多くのミッションクリティカルなシステムを支える Exadata を基盤としたデータベース・サービス

- [Exadata Database Service on Exascale Infrastructure (ExaDB-XS)編](./exadb-xs)  
  Exadata Database Service のメリットを、小規模ながら重要度の劣らないデータベース向けに、より低いエントリーコストでご利用いただけるデータベース・サービス

- [Full Stack Disaster Recovery(FSDR)編](./fsdr)  
  Exadata Database Service のメリットを、小規模ながら重要度の劣らないデータベース向けに、より低いエントリーコストでご利用いただけるデータベース・サービス

---

<h3> {{< icon-oci "mysql" >}} &nbsp;<a href="./mysql">MySQL HeatWave編</a></h3>
オラクルMySQLチームが開発、管理およびサポートする、MySQLサーバーに分析処理の高速化、機械学習の自動化、生成AIの実行基盤を統合したMySQL HeatWaveを学習できます。

<--->

<h3> {{< icon-oci "security" >}} &nbsp;<a href="./security">セキュリティ編</a></h3>
OCIにおける各種セキュリティ関連サービスを学習できるチュートリアルです。基本的なセキュリティ機能からデータベースのセキュリティ対策、ネットワーク防御、暗号化、脅威検知まで、幅広いサービスをご紹介します。

---

<h3> {{< icon-oci "observability" >}} &nbsp;<a href="./management">監視・管理編</a></h3>
OCIにおけるさまざまな運用・管理関連サービスを学習できるチュートリアルです。システムの監視やログ管理、アラート設定など、安定した運用を実現するための機能について幅広く取り上げています。

---

<h3> {{< icon-oci "identity" >}} &nbsp;<a href="./identity">アイデンティティ編</a></h3>
ユーザー認証・アクセス制御を統合的に管理するIAMやIDaaSを提供するOCI Identity Domainsについて学習できるチュートリアルです。シングルサインオン（SSO）や多要素認証（MFA）、権限管理など、セキュアかつ効率的なユーザー管理を実現するための機能を取り上げています。

---

<h3> {{< icon-oci "vm" >}} &nbsp;<a href="./vmware">Oracle Cloud VMware Solution編</a></h3>
このページは、Oracle Cloud VMware Solution (OCVS) 関連のチュートリアル、ガイド、ブログなどへのリンク集です。

---

<h3> {{< icon-oci "hpc" >}} &nbsp;<a href="./hpc/#1-oci-hpcチュートリアル集">OCI HPCチュートリアル集</a></h3>
OCI上にHPCシステムを構築するためのチュートリアルです。
OCIが提供するベアメタルインスタンス、GPUインスタンス、クラスタ・ネットワーク等を活用し、様々な用途のHPCシステムをリソース・マネージャ、Terraform、Ansibleを駆使して効率的に構築する方法を学習します。

<--->

<h3> {{< icon-oci "cloudnative" >}} &nbsp;<a href="./cloud-native">Cloud Native編</a></h3>
OCIで提供するCloud Native関連サービスのチュートリアルです。
マネージドのKubernetesサービスであるOKEやマネージドのFaaS(Functions as a Service)であるOracle Functionsを学習できます。

---

<h3> {{< icon-oci "opensearch" >}} &nbsp;<a href="./opensearch">OpenSearch編</a></h3>
OCI Search Service with OpenSearchに関して学習できます。

---

<h3> {{< icon-oci "contentmanagement" >}} &nbsp;<a href="./content-management">コンテンツ管理編</a></h3>
セキュアな情報共有とインテリジェントなコンテンツ管理基盤であるOracle Content Management（OCM）を学習できます。

---

<h3> {{< icon-oci "blockchain" >}} &nbsp;<a href="./blockchain">ブロックチェーン編</a></h3>
オープン・ソースのHyperledger Fabric上に構築された業界をリードするマネージド・エンタープライズ・ブロックチェーン・サービスであるOracle Blockchain Platform Cloud Serviceを学習できます。

---

<h3> {{< icon-oci "integration" >}} &nbsp;<a href="./integration">インテグレーション編</a></h3>
アプリケーション、ビジネス・プロセス、API、およびデータを迅速にモダナイズするためのエンタープライズ連携および自動化プラットフォームであるOracle Integration Cloudを学習できます。

---

<h3> {{< icon-oci "bigdata" >}} &nbsp;<a href="./datascience">データサイエンス/ビッグデータ編</a></h3>
Oracle Cloud Infrastructure(OCI)のデータサイエンス/ビッグデータ関連サービスのチュートリアルです。
Oracleが提供するマネージドの機械学習環境Data Science ServiceやマネージドのSpark環境であるOCI Data Flowを学習できます。

{{< /columns >}}

<br>

<h2 class="gdoc-toppage-header2">サポート・サービス活用編</h2>

- [トラブル解決に向けた技術サポート(SR)活用のコツ](./support-service/)  
  オラクル・サポート、カスタマーサクセスサービスによりトラブル解決をご支援します。トラブル解決にできるだけ早く近づくための技術サポート（SR）を効果的に利用するポイントを解説しています。

<br>

<h2 class="gdoc-toppage-header2">その他のお役立ち情報</h2>

- [Oracle アーキテクチャセンター](https://docs.oracle.com/solutions/?q=&cType=reference-architectures%2Csolution-playbook%2Cbuilt-deployed&sort=date-desc&lang=ja)  
  さまざまなシナリオ毎に、Oracle Cloud Infrastructure での実装方法について解説したガイド集です。現時点で約 200 ほどのシナリオが掲載されています。アーキテクチャ・センター内での検索がうまくヒットしないという不具合があるようですので、検索機能は利用せず、下にスクロールして閲覧するのが良いようです。左側のチェックボックスを使った絞り込みはうまく機能します。

- [Oracle Quick Start](https://github.com/oracle-quickstart)  
  Oracle Cloud Infrastructure 上で、様々なオープンソース・ソフトウェア、オラクル製品、サードパーティ製品を簡単にデプロイするためのスクリプトやガイドを集めた GitHub リポジトリです。使ってみたいソフトウェアがあればぜひ覗いてみてください。上の アーキテクチャ・センター とも連動しています。

- [オラクルエンジニア通信](https://blogs.oracle.com/oracle4engineer/)  
  Oracle Cloud の新しいサービスのリリース情報などや技術情報を定期的に発信しているブログです

- [Oracle Cloud Infrastructure マニュアル](https://docs.oracle.com/ja-jp/iaas/Content/home.htm)  
  マニュアルの日本語訳です。翻訳まで少しタイムラグがあるので、最新情報は右上の地球アイコンから英語版に切り替えて確認してください。

- [OCI 活用資料集](https://oracle-japan.github.io/ocidocs/)  
  各サービスの概要資料がまとまっているサイトです。

<br>

{{< hint type=note title=本チュートリアルの誤りについて >}}
本コンテンツは、作成者が誠心誠意作成しておりますが、万が一、本ドキュメントの間違いや、不正確な記述などを見つけられた場合は、[こちら](https://github.com/oracle-japan/ocitutorials/issues)から Issue 登録にてご連絡ください。
{{< /hint >}}
