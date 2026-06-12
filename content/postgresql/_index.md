---
title: "OCI Database with PostgreSQLチュートリアル"
description: "OCI Database with PostgreSQLについて学習できるチュートリアル集です。"
permalink: /postgresql/
layout: single
tags:
- データベース
show_excerpts: true
toc: true
---

このページでは、OCI Database with PostgreSQL のチュートリアルをまとめています。

OCI Database with PostgreSQLは、Oracle Cloud Infrastructure(OCI)でPostgreSQL互換のデータベースを利用できるフルマネージド・サービスです。DBシステムの作成、バックアップ、メンテナンス、ログ、監視などをOCIコンソールから管理できます。

# 初級編

- **[101: PostgreSQLを最小構成で作成し、データベースに接続する](./psql101-create-db/)**  
  OCI Database with PostgreSQLのDBシステムを作成し、コンピュート・インスタンスからPostgreSQLクライアントで接続確認を行います。【所要時間:約40分】

- **102: 高可用性構成と負荷分散**  
  2ノード構成のDBシステムを作成し、接続先の違いなどを確認します。

- **103: バックアップ管理**  
  自動バックアップ設定の変更とオンデマンド・バックアップの手動作成を確認します。

- **104: 復旧シナリオ**  
  オンデマンド・バックアップから新規のDBシステムを作成し、接続、削除を確認します。

- **105: 拡張機能管理**  
  `pgaudit`を例に、拡張機能の設定方法を確認します。

- **106: ログ管理**  
  `pgaudit`で生成された監査ログを含むPostgreSQLログをOCIロギング・サービスおよびオブジェクト・ストレージにエクスポートします。

# 応用編

- **201: セキュア接続を構成する**  
  要塞やネットワーク経路を利用した接続方式を確認します。

- **202: メトリックを確認し、アラームを設定する**  
  DBシステムのメトリックを確認し、監視と通知の基本を構成します。
