---
title: チュートリアル : Oracle Cloud Infrastructure を使ってみよう
description: Oracle Cloud Infrastrucute (OCI) を使っていこうという方のためのチュートリアル集です。初心者の方でも進められるように、画面ショットを交えながら OCI について学習できるようになっています。
permalink: /
lang: ja_JP
layout: splash
author_profile: true
toc: true
toc_label: "目次"
---

このドキュメントは Oracle Cloud Infrastructure (OCI) を使っていこう! という人のためのチュートリアル集です。各項ごとに画面ショットなどを交えながらステップ・バイ・ステップで作業を進めて、OCIの機能についてひととおり学習することができるようになっています。 [OCI活用資料集](https://oracle-japan.github.io/ocidocs/) とあわせてご活用ください。

また、このページのチュートリアルのうち、入門編を元にしたウェビナーのハンズオンも定期開催しています。最新の予定は [こちら](https://go.oracle.com/LP=93447?elqCampaignId=248187#xd_co_f=OTIyMTZlYzQtNGMxMi00YzY2LTg1ZTQtNTVkMGJkOTUwMGY0~) のウェビナー案内ページ をご確認ください。(集合形式でのハンズオン・セミナーは、感染症予防のためしばらくお休み予定です)

> 本ドキュメントの間違いや、不正確な記述などを見つけられた場合は、[こちら](https://github.com/oracle-japan/ocitutorials/issues)からIssue登録にてご連絡ください。

## 準備 - Oracle Cloud の無料トライアルを申し込む
- **[Oracle Cloud 無料トライアルを申し込む](https://cloud.oracle.com/ja_JP/tryit)**  
Oracle Cloud のほとんどのサービスが利用できるトライアル環境を取得することができます。このチュートリアルの内容を試すのに必要になりますので、まずは取得してみましょう。  
*※認証のためにSMSが受け取れる電話とクレジット・カードが必要です(希望しない限り課金はされませんのでご安心を!!)*

  - [Oracle Cloud 無料トライアル サインアップガイド](https://faq.oracle.co.jp/app/answers/detail/a_id/6492)  
  - [Oracle Cloud 無料トライアルに関するよくある質問(FAQ)](https://faq.oracle.co.jp/app/answers/detail/a_id/6492)  


## チュートリアル入門編 - Oracle Cloud Infrastructure を使ってみよう
- **[OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)](/ocitutorials/beginners/getting-started/)**  
まずはコンソールにアクセスしてみましょう。そしてリージョン、アベイラビリティ・ドメイン、コンパートメント、ポリシー(ACL)、サービス・リミットなどのOCIの基本的なコンセプトについて学びます。

- **[クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2)](/ocitutorials/beginners/creating-vcn/)**  
クラウドの最初の一歩は、クラウド上に皆さん専用のネットワーク(VCN)を作るところから始まります。難しい作業は必要ありません。まずはやってみましょう!!

- **[インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)](/ocitutorials/beginners/creating-compute-instance)**  
ネットワークができたら、いよいよインスタンスを立ち上げましょう。OCIなら仮想マシンもベアメタルサーバーも同じように簡単に作成できます。

- **[ブロック・ボリュームをインスタンスにアタッチする - Oracle Cloud Infrastructureを使ってみよう(その4)](/ocitutorials/beginners/attaching-block-volume)**  
ストレージ容量が足りない? そんなときは、ブロック・ボリュームをネットワーク越しにインスタンスにアタッチできます。

- **[インスタンスのライフサイクルを管理する - Oracle Cloud Infrastructureを使ってみよう(その5)](https://community.oracle.com/tech/welcome/discussion/4474283/)**  
作ったインスタンスを必要なときに止めたり、削除したり、また再作成したりと、いつでも簡単にできてしまうところがクラウドのいいところです。実際にどのような動きになるのか試してみましょう。

- **[ファイルストレージサービス(FSS)で共有ネットワークボリュームを利用する - Oracle Cloud Infrastructureを使ってみよう(その6)](/ocitutorials/beginners/using-file-storage)**  
ファイルストレージサービス(FSS)を利用すると、複数のインスタンスから同時にネットワーク越しに利用できる共有ディスクを簡単に作成することができます。

- **[オブジェクト・ストレージを使う - Oracle Cloud Infrastructureを使ってみよう(その7)](/ocitutorials/beginners/object-storage/)**  
オブジェクト・ストレージを使うと、とても堅牢なデータストアを信じられないくらい安価に利用できます。まずは簡単な使い方を学びましょう。

- **[クラウドでOracle Databaseを使う - Oracle Cloud Infrastructureを使ってみよう(その8)](https://community.oracle.com/tech/welcome/discussion/4474262/)**  
Oracleのクラウドで使いたいものと言ったら、そう! Oracle Database!! OCIでは仮想マシン、ベアメタルサーバーからExadataまで、様々なOracle Databaseを簡単に使うことができます。まずはインスタンスを作ってみましょう。

- **[クラウドでMySQL Databaseを使う - Oracle Cloud Infrastructureを使ってみよう(その9)](https://oracle-japan.github.io/ocitutorials/beginners/creating-mds/)**  
クラウド環境でも人気の高いMySQL Database！OCIならMySQL開発チームによるMySQLのマネージドサービスが利用できます！簡単に構築できるので、まずは触ってみましょう！ 

- **[MySQLで高速分析を体験する - Oracle Cloud Infrastructureを使ってみよう(その10)](https://oracle-japan.github.io/ocitutorials/beginners/creating-HeatWave/)**  
OCIではMySQLベースのデータウェアハウスサービスであるHeatWaveが使えます！MySQLからレプリケーションでデータ連携もできるため、ETLを使わずにデータウェアハウスを構築することもできます！性能もコストパフォーマンスも非常に高いサービスなので、是非試してみて下さい！ 

- **[クラウドでOracle Exadata を使う - Exadata Cloud Service (ExaCS)](https://community.oracle.com/docs/DOC-1038411)**  
OracleのクラウドならOracle Databaseを高速に動かすことができる基盤のOracle Exadata も使えます。インスタンスの作り方から、様々な使い方を学んでいただける内容になっています。

- **[Autonomous Database ハンズオンラボ（ADB HOL）](https://community.oracle.com/tech/welcome/discussion/4474304/autonomous-database-%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3%E3%83%A9%E3%83%9C-adb-hol#latest)**  
Autonomous Database は、最新のAI技術によって自律的に運用される、クラウド上のマネージドなデータベースサービスです。こちらのハンズオンラボでは、Autonomous Databaseに初めて触る方向けに、使い方や特徴を学んでいただける内容になっています。

- **[Oracle Container Engine for Kubernetes(OKE) ハンズオン（ビギナー向け）](https://oracle-japan.github.io/paasdocs/documents/containers/handson/k8s-walkthrough/)**  
Oracle Container Engine for Kubernetes(OKE)は、Oracle Cloud Infrastructure(OCI)上で提供されるマネージドKubernetsサービスです。こちらのハンズオンでは、Kubernetes自体の特徴や使い方を含めて、OKEを触って頂けるコンテンツになっています。

- **[Oracle Functions ハンズオン（ビギナー向け）](https://oracle-japan.github.io/paasdocs/documents/faas/)**  
Oracle Functionsは、Oracle Cloud Infrastructure(OCI)上で提供されるマネージドFaaS(Function as a Service)サービスです。こちらのハンズオンでは、Oracle Functionsを動かしながら、FaaSおよびOracle Functionsの特徴や使い方を学んでいただけるコンテンツになっています。まずはリンク先のビギナー向けチュートリアルからはじめてみてください。

- **[Oracle Cloud Infrastructure API Gateway ハンズオン（ビギナー向け）](https://oracle-japan.github.io/paasdocs/documents/api-management/handson/getting-started/)**  
Oracle Cloud Infrastructure API Gateway(OCI API Gateway)は、Oracle Cloud Infrastructure(OCI)上で提供されるマネージドAPI Gatewayサービスです。こちらのハンズオンでは、OCI API Gatewayを利用して簡単にAPIを集約/公開する方法を学んでいただけるコンテンツになっています。



## チュートリアル応用編 - Oracle Cloud Infrastructure アドバンスド
- **[モニタリング機能でリソースを監視する - Oracle Cloud Infrastructureアドバンスド](/ocitutorials/intermediates/monitoring-resources/)**  
モニタリング機能を使うことで、OCI上の各種リソースの性能や状態の監視、また、カスタムのメトリック監視を行うことが可能です。アラームを設定すれば、メトリックがしきい値に達した場合に管理者に通知することもできます。
- **[ロードバランサーでWebサーバーを負荷分散する - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474257/%E3%83%AD%E3%83%BC%E3%83%89%E3%83%90%E3%83%A9%E3%83%B3%E3%82%B5%E3%83%BC%E3%81%A7web%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%82%92%E8%B2%A0%E8%8D%B7%E5%88%86%E6%95%A3%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
OCIのロードバランサーを使うと、冗長化したWebサーバーに対して負荷分散を簡単に構成できるようになります。しかもマネージドサービスなので管理は簡単。
- **[インスタンスのオートスケーリングを設定する - Oracle Cloud Infrastructureアドバンスド](/ocitutorials/intermediates/autoscaling/)**  
アプリケーションの負荷に応じて自動的にコンピュート・リソースの増減ができれば、必要な時に必要な分だけのリソースを確保し、コストの最適化にもつながります。オートスケーリング設定を行って、負荷に応じてインスタンス数を増減させてみましょう。
- **[ブロック・ボリュームをバックアップする - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474358/%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF-%E3%83%9C%E3%83%AA%E3%83%A5%E3%83%BC%E3%83%A0%E3%82%92%E3%83%90%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
運用管理を行う上で、データのバックアップは重要です。データの保護要件や可用性要件に応じて適切な手法でバックアップを取得し、安全に運用を行いましょう。
- **[DNSサービスを使う - Oracle Cloud Infrastructureアドバンスド](/ocitutorials/intermediates/using-dns/)**  
クラウド上でインターネット向けにサービスを構築したいのであれば、OCIのDNSサービスを使わない手はありません。Dyn.comにホストされた堅牢な権威DNSネットワークが、従量制で簡単に利用できます。マネージドサービスなのでDDoS対策もバッチリ。さあやってみましょう。
- **[Email Deliveryを利用した外部へのメール送信(その1　配信環境構築編) - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474289/email-delivery%E3%82%92%E5%88%A9%E7%94%A8%E3%81%97%E3%81%9F%E5%A4%96%E9%83%A8%E3%81%B8%E3%81%AE%E3%83%A1%E3%83%BC%E3%83%AB%E9%80%81%E4%BF%A1-%E3%81%9D%E3%81%AE1-%E9%85%8D%E4%BF%A1%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89%E7%B7%A8-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
クラウドから外部にメールを送りたい場合にはEmailサービスを使ってみましょう。OCIのEmailサービスを使うと、ちょっとした通知の送信から大規模なマーケティング・キャンペーンまで、本格的なメール・マネジメントを手軽に構築できます。
- **[GPUインスタンスでディープラーニング - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474290/gpu%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%A7%E3%83%87%E3%82%A3%E3%83%BC%E3%83%97%E3%83%A9%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%B0-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
クラウドを利用すると、最新のGPUで簡単にディープラーニングのトレーニング環境を構築することができます。OCIの事前セットアップ済イメージを使って環境を構築し、PyTorch や Tensorflow などの人気のフレームワークを動かしてみましょう。
- **[シリアル・コンソールでsshできないインスタンスのトラブルシュートをする - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474277/%E3%82%B7%E3%83%AA%E3%82%A2%E3%83%AB-%E3%82%B3%E3%83%B3%E3%82%BD%E3%83%BC%E3%83%AB%E3%81%A7ssh%E3%81%A7%E3%81%8D%E3%81%AA%E3%81%84%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%AE%E3%83%88%E3%83%A9%E3%83%96%E3%83%AB%E3%82%B7%E3%83%A5%E3%83%BC%E3%83%88%E3%82%92%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
インスタンスにアクセスできない!? まずは落ち着いて、シリアル・コンソールに接続してみましょう。何かトラブル解決のヒントが見つかるかもしれません。
- **[インスタンスにセカンダリIPを付与する - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474282/%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%AB%E3%82%BB%E3%82%AB%E3%83%B3%E3%83%80%E3%83%AAip%E3%82%92%E4%BB%98%E4%B8%8E%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
OCIのインスタンスには、プライベートのIPアドレスをいくつも付与することができます。使いみちはさまざま。例えばセカンダリIPを付け替えてインスタンスのフェイルオーバーを実現することも。ただちょっと使い方にはポイントが必要ですので、そのやり方を学びましょう。
- **[コマンドライン(CLI)でOCIを操作する - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474263/%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%A9%E3%82%A4%E3%83%B3-cli-%E3%81%A7oci%E3%82%92%E6%93%8D%E4%BD%9C%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
クラウドの管理を簡単にしたいなら、コマンドラインツールのOCICLIを試してみましょう。APIを直接コールするよりもずっと簡単に、スクリプトを使ってクラウドのコンポーネントを操作できます。
- **[TerraformでOCIの構築を自動化する - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474281/terraform%E3%81%A7oci%E3%81%AE%E6%A7%8B%E7%AF%89%E3%82%92%E8%87%AA%E5%8B%95%E5%8C%96%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
大規模なクラウド環境の構築を自動化するツールがほしい!! そんなときはTerraformを試してみるといいかもしれません。Terraform と Terraform Provider for OCI を使うと、設定ファイルを作るだけで大規模なクラウド環境を簡単に管理できるようになります。
- **[OCI Valut (OCI Key Management) でBYOKをする](https://qiita.com/western24/items/06271c09a17e566661e8)**  
Oracle Cloud Infrastructureには、OCI Valut (旧称 OCI Key Management) という暗号化マスター鍵を仮想化したHSMで管理する機能があり、ユーザーが管理する暗号鍵でブロック・ボリュームやオブジェクト・ストレージなどのデータを暗号化をできるようになっています。OCI Vaultを使って、ユーザーが作成した鍵をクラウドに持ち込むBYOK(Bring Your Own Key)を試してみましょう。
- **[Web Application Firewall(WAF)を使ってWebサーバを保護する - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474298/web-application-firewall-waf-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6web%E3%82%B5%E3%83%BC%E3%83%90%E3%82%92%E4%BF%9D%E8%AD%B7%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
Webサイトの脆弱性対策に苦労していませんか？そんな時はチューニング不要なOCI WAFを使って簡単にWebサーバーを保護しましょう。OCI WAFは保護ルールの適用、ボットトラフィックの制御、ログ参照など簡単にGUIから行うことができます。
- **[Oracle CASBを使ってクラウドのセキュリティ・リスクを検知する - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/tech/welcome/discussion/4474285/oracle-casb%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%81%AE%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3-%E3%83%AA%E3%82%B9%E3%82%AF%E3%82%92%E6%A4%9C%E7%9F%A5%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89)**  
せっかくクラウドを導入したのだから、セルフサービスで色々な人に使ってもらいたい。でも勝手に使われるとセキュリティが心配・・・。そんなときはCASB(キャスビー)が役に立つかもしれません。Oracle CASBを使うと、ユーザーが危険な使い方をしていたらアラートを受け取るなんてことが簡単に実現できるようになります。
- **[Oracle Management Cloud チュートリアルまとめ](https://qiita.com/western24/items/1e44bfcaa77f3251a263)**  
Oracle Management Cloud (OMC) は、機械学習と大規模データ技術を活用した次世代の統合モニタリング、管理、アナリティクス・クラウド・サービスです。このまとめページでは、OMCの構築に始まり、各種リソース(OS、ログ、Javaアプリ、OCIのインフラ、Oracle Databaseなど)を監視、管理する方法についての設定方法や使い方について説明しています。
- **[Oracle Data Safe チュートリアルまとめ](https://qiita.com/western24/items/4824e4b3799b824197c6)**  
Oracle Data Safeは、Oracle CloudのDatabase Serviceをよりセキュアに使うための付加的なサービスで、機密データの発見、(データ・マスキング、アクティビティ監査、セキュリティ構成の評価、ユーザーのリスク評価などを、GUIツールから簡単に実施できます。このまとめページでは、Data Safeを有効化から、各種の使い方について説明しています。
- **[Oracle Container Engine for Kubernetes(OKE) ハンズオン（ミドル向け）](https://oracle-japan.github.io/paasdocs/documents/microservices/tutorials/WorkshopGuide000InstallSoftware/)**  
OKEを使ってサンプルアプリケーションのデプロイおよびCI/CDを体験していただけるコンテンツです。OKEだけではなく、チーム開発型プラットフォームであるOracle Cloud PaaSのDeveloper Cloud Serviceや運用が全て自動化された自律型データベースであるAutonomous Databaseも利用する豊富なコンテンツになっています。
- **[Oracle Functionsハンズオン（ミドル向け）](https://oracle-japan.github.io/paasdocs/documents/faas/)**  
Oracle FunctionsとOracle Cloud Infrastructure(OCI)上の様々なサービスを組み合わせたハンズオンコンテンツです。Oracle Functionsを利用してコンピュートインスタンスのシェイプを変更したり、NoSQL Database Cloud Serviceと連携したりとFaaSならではのハンズオンを体験して頂けるコンテンツになっています。リンク先のミドル向けチュートリアルからはじめてみてください。
- **[Oracle Content and Experiece チュートリアル](https://community.oracle.com/tech/welcome/discussion/4474330/oracle-content-and-experiece-%E3%83%81%E3%83%A5%E3%83%BC%E3%83%88%E3%83%AA%E3%82%A2%E3%83%AB)**  
Oracle Content and Experience (OCE)は、API ファーストなアーキテクチャで、マルチチャネルでのコンテンツ配信を実現するインテリジェントなコンテンツ管理プラットフォームです。この文書では、OCEが提供するファイル共有、アセット管理、Webサイト管理などさまざまな機能の説明や使い方をステップ・バイ・ステップで紹介します。利用する機能にあわせてリンク先の各文書をご利用ください。
- **[Oracle Integration チュートリアル](https://community.oracle.com/docs/DOC-1037469)**  
  Oracle Integration(OIC)は、アプリケーションの統合、プロセスの自動化およびビジュアル・アプリケーションの作成を可能にする完全に管理されたサービスです。この文書では、OIC が提供するプロセス機能（ワークフローの作成・テスト・公開）など、さまざまな機能の説明や使い方が、各文書ごとにステップ・バイ・ステップで紹介されています。利用する機能にあわせて、リンク先の各文書をご利用ください。
- **[ストレージ・ゲートウェイを作成する](/ocitutorials/intermediates/storage-gateway/)**  
ストレージ・ゲートウェイ とは、アプリケーションが 標準のNFSv4プロトコルを使用してOracle Cloud Infrastructure オブジェクト・ストレージと相互作用できるようになるサービスです。オンプレミスからのデータ転送、バックアップ、アーカイブ用途などに利用できます。



## チュートリアル実践編
- **[Oracle アーキテクチャ・センター](https://docs.oracle.com/ja/solutions/){:target="_blank"}**   
さまざまなシナリオ毎に、Oracle Cloud Infrastructureでの実装方法について解説したガイド集です。現時点で約200ほどのシナリオが掲載されています。  
シナリオの例
  - **[仮想マシンDBシステムへのオンプレミスOracle Databaseデプロイメントの移行](https://docs.oracle.com/ja/solutions/migrate-to-vmdb/index.html)**
  - **[イベントトリガー・サーバー・レス・アプリケーションのデプロイ](https://docs.oracle.com/ja/solutions/event-triggered-serverless-app/index.html#GUID-9D5876DC-13C2-4770-AFF9-EC7330D94AD0)**  
  - **[ElasticsearchおよびKibanaのデプロイ](https://docs.oracle.com/ja/solutions/deploy-elk/index.html#GUID-B8EE86D2-5830-4B79-B679-6E9B624E0CF0)**

``Tips : アーキテクチャ・センター内での検索がうまくヒットしないという不具合があるようですので、検索機能は利用せず、下にスクロールして閲覧するのが良いようです。左側のチェックボックスを使った絞り込みはうまく機能します。``

- **[Oracle Quick Start](https://github.com/oracle-quickstart)**  
Oracle Cloud Infrastructure上で、様々なオープンソース・ソフトウェア、オラクル製品、サードパーティ製品を簡単にデプロイするためのスクリプトやガイドを集めたGitHubリポジトリです。使ってみたいソフトウェアがあればぜひ覗いてみてください。上の アーキテクチャ・センター とも連動しています。



## その他のお役立ち情報
- **[オラクルエンジニア通信](https://blogs.oracle.com/oracle4engineer/)**  
Oracle Cloud の新しいサービスのリリース情報などや技術情報を定期的に発信しているブログです

- **[Oracle Cloud Infrastructure マニュアル](https://docs.cloud.oracle.com/ja-jp/iaas/Content/home.htm)**  
マニュアルの日本語訳です。翻訳まで少しタイムラグがあるので、最新情報は右上の地球アイコンから英語版に切り替えて確認してください。



