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
  OCI Database with PostgreSQLのDBシステムを作成し、コンピュート・インスタンスからPostgreSQLクライアントで接続確認を行います。【所要時間:約20分】

- **[102: 高可用性構成と負荷分散を確認する](./psql102-ha-load-balancing/)**  
  既存のDBシステムに読取りレプリカを追加し、リーダー・エンドポイントを使用した接続先の違いを確認します。【所要時間:約20分】

- **[103: バックアップを管理する](./psql103-backup-management/)**  
  自動バックアップ設定を確認・変更し、オンデマンド・バックアップを手動で作成します。【所要時間:約20分】

- **[104: バックアップからDBシステムを復旧する](./psql104-restore-from-backup/)**  
  オンデマンド・バックアップから新しいDBシステムを作成し、接続確認と削除を行います。【所要時間:約30分】

- **[105: 拡張機能を管理する](./psql105-extension-pgaudit/)**  
  `pgaudit`を例に、構成でPostgreSQL拡張機能を有効化し、監査ログをOCI Loggingサービスで確認します。【所要時間:約15分】

- **106: PostgreSQLログを管理する**  
  `pgaudit`で生成された監査ログを含むPostgreSQLログをOCI Loggingサービスで確認し、Object Storageにエクスポートします。
