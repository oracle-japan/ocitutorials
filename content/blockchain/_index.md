---
title: "Oracle Blockchain Platformチュートリアル"
description: "Oracle Blockchain Platform (OBP) を使ってみよう！という人のためのチュートリアルです。各文書ごとにステップ・バイ・ステップで作業を進めて、OBP の基本的な機能、操作やオペレーションについて学習することができます。"
permalink: /blockchain/
layout: single
toc: true
aliases: "/intermediates/blockchain-tutorial/"
---

Oracle Blockchain Platform (OBP) を使ってみよう！という人のためのチュートリアルです。各文書ごとにステップ・バイ・ステップで作業を進めて、OBP の基本的な機能、操作やオペレーションについて学習することができます。

# 1. インスタンスの作成とブロックチェーンネットワークの構成

- **[Oracle Blockchain Platform インスタンスを作成する](./01_1_create_instance/)**  
  Oracle Cloud Infrastructure (OCI) の管理コンソールを利用し、OBP インスタンスを作成します。まずはここから始めましょう。

- **[Participant インスタンスをブロックチェーン・ネットワークに参加させる](./01_2_join_participant/)**  
  OBP はパーミッション型のブロックチェーンプロトコルである Hyperledger Fabric をベースとしたブロックチェーンプラットフォームです。OBP はひとつ～複数のインスタンス（また、OBP 以外の Hyperledger Fabric の Organization）でブロックチェーン・ネットワークを構成することができます。

  ここではふたつの OBP インスタンスでブロックチェーン・ネットワークを構成します。単一の OBP インスタンスのみを使う場合はこの手順はスキップしてください。

# 2. Channelの構成

- **[Channel を作成し、インスタンスおよび Peer ノードを参加させる](./02_1_create_channel/)**  
  Hyperledger Fabric のデータとロジックの共有範囲の制御などのための仕組みである Channel を作成し、その Channel に対してインスタンスと Peer ノードを参加させます。

# 3. Chaincodeの操作

- **[Chaincodeをデプロイする](./03_1_deploy_chaincode/)**  
  Hyperledger Fabricにおけるスマートコントラクトであり、ブロックチェーン台帳上で実行されるビジネスロジックであるChaincodeをデプロイし、実行可能にする方法を説明します。

- **[REST APIからChaincodeを実行する](./03_2_restcall_chaincode/)**  
  REST APIからChaincodeを実行する方法を説明します。

# 5. その他の設定、構成、管理

- **[Fabricのアイデンティティ関連の操作や設定](./05_1_fabric_identity/)**  
  Oracle Blockchain PlatformでHyperledger Fabricのプロトコルにおけるアイデンティティ、およびアイデンティティを構成する証明書および秘密鍵に関連する操作、設定などを説明します。

# 6. リッチヒストリーデータベースの操作

- **[リッチヒストリーデータベースの設定方法](./06_1_rich_history/)**  
  ブロックチェーン台帳のデータを外部のOracle Databaseに複製する機能であるリッチヒストリーデータベース機能の設定方法を説明します。

- **[複製先データベースでJSONを展開したビューを作成](./06_2_rich_history_view/)**  
  リッチヒストリーデータベース機能を用いてブロックチェーン台帳からデータベースに複製したデータをより使いやすくするため、JSONを展開しつつデータを抽出するビューを作成する方法を説明します。

# 9. ツール、ライブラリなどの利用

- **[Blockchain App Builder（Visual Studio Code拡張版）の基本的な使い方](./91_1_app_builder_vsc_start/)**  
  Oracle Blockchain Platform付属のChaincode開発・テスト・デプロイ補助ツールであるBlockchain App BuilderのVisual Studio Code拡張版について、ダウンロードとインストールの方法から、Chaincode仕様の作成方法やChaincodeコードの生成方法など、基本的な使い方を紹介します。

- **[Fine-Grained Access Control Libraryの使い方](./92_1_fine_grained_ACL/)**  
  Oracle Blockchain Platformに付属する、Chaincode上／オンチェーンで確実かつ柔軟、きめ細やかなアクセス制御を実現するためのサンプル・ライブラリであるFine-Grained Access Control Libraryの使い方を説明します。

- **[サンプルChaincodeの使い方](./93_1_sample_cc/)**  
  Oracle Blockchain Platformに付属するサンプルChaincodeのダウンロード方法、コンソールからの実行方法を説明します。

<br />
