---
title: "Oracle AI Database編 - Base Database Service (BaseDB) を使ってみよう"
description: "Oracle AI Databaseをシンプルにお使いいただける Base Database Service (BaseDB)を学ぶチュートリアルです。インスタンスの作成から、運用管理までを一通り体験します。"
permalink: /basedb
layout: single
tags:
  - "Database"
show_excerpts: true
toc: true
---

---

本チュートリアルでは、まず基本的な「Oracle Base Database Service (BaseDB)」の基本的な機能や操作方法について学ぶことができます。

{{< hint type=note title="前提条件" >}}

- Oracle Cloud Infrastructure の環境と、ユーザーアカウントがあること<br>(トライアル環境でも実施いただける内容となっています。)
- 適切なコンパートメントと、そこに対する適切な権限がユーザーに付与されていること
  {{< /hint >}}

{{< hint type=note title="特記事項" >}}

- チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。
- [OCI チュートリアル入門編](../beginners/)の、準備からその 1、その 2、その 3、その 7 を実施しておくと、理解がスムーズです。
- より詳しく知りたい方は、[OCI 活用資料集](https://oracle-japan.github.io/ocidocs/)も併せてご確認ください。それぞれのサービスに関する技術詳細資料をまとめ紹介しています。
  {{< /hint >}}

---

<br/>

**Oracle Cloud で利用したい代表的なサービスといえば、やはり Oracle AI Database です。<br/>まずは、基本となる Base Database インスタンスの作成から始めてみましょう。**

## 基礎編

- **[101: Oracle Cloud で Oracle AI Database を使おう](./dbcs101-create-db/)**

- **[102: BaseDB 上の PDB を管理しよう](./dbcs102-managing-pdb/)**

- **[103: パッチを適用しよう](./dbcs103-patch/)**

- **[104: 自動バックアップを設定しよう](./dbcs104-backup/)**

- **[105:BaseDB で任意のタイミングでバックップを作成してみよう](./dbcs105-longterm-backup/)**

- **[106: バックアップからリストアしよう](./dbcs106-restore/)**

- **[107: Data Guard を構成しよう](./dbcs107-dataguard/)**

- **[108:BaseDB のスタンバイ・データベースからバックアップを取得およびリストアしてみよう](./dbcs108-dataguard-standby-bkup/)**

## データ移行編

- **[201: オンプレミスの PDB を BaseDB に移動しよう](./dbcs201-pdb-plug/)**

- **[202: DBMS_CLOUD を使って Object Storage のデータを BaseDB から参照しよう](./dbcs202-dbms-cloud/)**

<br/>
