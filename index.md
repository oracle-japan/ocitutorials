---
title: Oracle Cloud Infrastructure チュートリアル
description: Oracle Cloud Infrastrucute (OCI) を使っていこうという方のためのチュートリアル集です。初心者の方でも進められるように、画面ショットを交えながら OCI について学習できるようになっています。
permalink: /
lang: ja_JP
layout: splash
author_profile: true
toc: true
toc_label: "目次"
---

このドキュメントは Oracle Cloud Infrastructure (OCI) を使っていこう! という人のためのチュートリアル集です。各項ごとに画面ショットなどを交えながらステップ・バイ・ステップで作業を進めて、OCIの機能についてひととおり学習することができるようになっています。

**OCI活用資料集について**  
各サービスの概要資料がまとまっている[OCI活用資料集](https://oracle-japan.github.io/ocidocs/) とあわせてご活用ください。
{: .notice--info}

また、このページのチュートリアルのうち、入門編を元にしたウェビナーのハンズオンも定期開催しています。最新の予定は [こちら](https://go.oracle.com/LP=93447?elqCampaignId=248187#xd_co_f=OTIyMTZlYzQtNGMxMi00YzY2LTg1ZTQtNTVkMGJkOTUwMGY0~) のウェビナー案内ページ をご確認ください。(集合形式でのハンズオン・セミナーは、感染症予防のためしばらくお休み予定です)

**本チュートリアルの誤りについて**  
本コンテンツは、作成者が誠心誠意作成しておりますが、万が一、本ドキュメントの間違いや、不正確な記述などを見つけられた場合は、[こちら](https://github.com/oracle-japan/ocitutorials/issues)からIssue登録にてご連絡ください。
{: .notice--info}

## 準備 - Oracle Cloud の無料トライアルを申し込む
- **[Oracle Cloud 無料トライアルを申し込む](https://cloud.oracle.com/ja_JP/tryit)**  
  Oracle Cloud のほとんどのサービスが利用できるトライアル環境を取得することができます。このチュートリアルの内容を試すのに必要になりますので、まずは取得してみましょう。  
  *※認証のためにSMSが受け取れる電話とクレジット・カードが必要です(希望しない限り課金はされませんのでご安心を!!)*

  - [Oracle Cloud 無料トライアル サインアップガイド](https://faq.oracle.co.jp/app/answers/detail/a_id/6492)  
  - [Oracle Cloud 無料トライアルに関するよくある質問(FAQ)](https://www.oracle.com/jp/cloud/free/faq/)  

## チュートリアルコンテンツ一覧

- **[OCI入門編](/ocitutorials/beginners/)**
OCIの入門編チュートリアルです。  
OCIコンソールの基本的な操作方法やネットワーク、ストレージなどの基本的なサービスについてを学習できます。

- **[OCI応用編](/ocitutorials/intermediates/)**
OCIの応用編チュートリアルです。  
LoadBalancerや証明書サービスなどをはじめとした各OCIサービスの応用的な使い方を学習できます。　　

- **[Oracle Database編](/ocitutorials/database/)**
Oracle Database関連サービスのチュートリアルです。  
自律型データベースサービスであるAutonomous Databaseや Exadata Database Service on Dedicated Infrastructureなどを学習できます。

- **[MySQL Database Service編](/ocitutorials/mysql/)**
Oracle MySQLチームが開発、管理およびサポートするOCI上で提供されるMySQL Database Serviceを学習できます。

- **[Cloud Native編](/ocitutorials/cloud-native/)**
OCIで提供するCloud Native関連サービスのチュートリアルです。    
マネージドのKubernetesサービスであるOKEやマネージドのFaaS(Functions as a Service)であるOracle Functionsを学習できます。

- **[コンテンツ管理編](/ocitutorials/content-management/)**
セキュアな情報共有とインテリジェントなコンテンツ管理基盤であるOracle Content Management（OCM）を学習できます。

- **[ブロックチェーン編](/ocitutorials/blockchain/)**
オープン・ソースのHyperledger Fabric上に構築された業界をリードするマネージド・エンタープライズ・ブロックチェーン・サービスであるOracle Blockchain Platform Cloud Serviceを学習できます。

- **[インテグレーション編](/ocitutorials/integration/)**
アプリケーション、ビジネス・プロセス、API、およびデータを迅速にモダナイズするためのエンタープライズ連携および自動化プラットフォームであるOracle Integration Cloudを学習できます。

- **[データサイエンス/ビッグデータ編](/ocitutorials/datascience/)**
Oracle Cloud Infrastructure(OCI)のデータサイエンス/ビッグデータ関連サービスのチュートリアルです。  
Oracleが提供するマネージドの機械学習環境Data Science ServiceやマネージドのSpark環境であるOCI Data Flowを学習できます。 

- **[アイデンティティとセキュリティ編](/ocitutorials/id-security/)**
OCIにおける各種ID管理、セキュリティ関連サービスについて学習できるチュートリアルです。

- **[監視・管理編](/ocitutorials/management/)**
OCIにおける各種運用・管理関連サービスについて学習できるチュートリアルです。

- **[OpenSearch編](/ocitutorials/opensearch/)** OCI Search Service with OpenSearchに関して学習できます。

- **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)**
OCI上にHPCシステムを構築するためのチュートリアルです。  
OCIが提供するベアメタルインスタンス、GPUインスタンス、クラスタ・ネットワーク等を活用し、様々な用途のHPCシステムをリソース・マネージャ、Terraform、Ansibleを駆使して効率的に構築する方法を学習します。  
構築するHPCクラスタは、NFS、LDAP、Slurm、OpenMPI等、システム運用・利用に欠かせないソフトウェアが使えます。またGPUクラスタは、NVIDIA Container Toolkit、DockerやEnrootのコンテナランタイム等、大規模な分散機械学習ワークロード実行に必須のソフトウェアが使えます。

- **[Oracle Cloud VMware Solution編](/ocitutorials/vmware/)**
このページは、Oracle Cloud VMware Solution (OCVS) 関連のチュートリアル、ガイド、ブログなどへのリンク集です。
Oracle Cloud VMware Solution(OCVS)は、OCI(Oracle Cloud Infrastructure)上でVMwareの仮想化基盤を利用することができるクラウドサービスです。コンピュート、データベース(Oracle DBCS)などのOCIネイティブサービス群と同じく顧客テナンシのVCN上のベアメタル・インスタンスに直接デプロイされるため、ESXi、vCenterなどVMware製品の使い勝手はそのままに、OCIが備える高性能なコンピュート、低遅延のネットワーク、耐久性のあるブロック・ボリュームなどを利用し、オンプレミスVMware環境のシームレスなクラウド移行や、リソース拡張先として活用することができます。


## その他のお役立ち情報

- **[Oracleアーキテクチャセンター](https://docs.oracle.com/solutions/?lang=ja)**  
さまざまなシナリオ毎に、Oracle Cloud Infrastructureでの実装方法について解説したガイド集です。現時点で約200ほどのシナリオが掲載されています。

**アーキテクチャ・センター内での検索について**  
アーキテクチャ・センター内での検索がうまくヒットしないという不具合があるようですので、検索機能は利用せず、下にスクロールして閲覧するのが良いようです。左側のチェックボックスを使った絞り込みはうまく機能します。
{: .notice--info}

- **[Oracle Quick Start](https://github.com/oracle-quickstart)**  
Oracle Cloud Infrastructure上で、様々なオープンソース・ソフトウェア、オラクル製品、サードパーティ製品を簡単にデプロイするためのスクリプトやガイドを集めたGitHubリポジトリです。使ってみたいソフトウェアがあればぜひ覗いてみてください。上の アーキテクチャ・センター とも連動しています。

- **[オラクルエンジニア通信](https://blogs.oracle.com/oracle4engineer/)**  
Oracle Cloud の新しいサービスのリリース情報などや技術情報を定期的に発信しているブログです

- **[Oracle Cloud Infrastructure マニュアル](https://docs.cloud.oracle.com/ja-jp/iaas/Content/home.htm)**  
マニュアルの日本語訳です。翻訳まで少しタイムラグがあるので、最新情報は右上の地球アイコンから英語版に切り替えて確認してください。
