---
title: "OCI IAM Identity DomainとAPEXアプリケーションとの認証連携しよう"
description: "OCI IAM Identity DomainとAPEXアプリケーションを連携することで、安全かつ効率的にシングルサインオンなどの認証管理を実現できます。"
weight: 0001
tags:
  - 認証設定
  - アプリケーション開発
images:
  - oci-in-practice/iam_apex/teaser.png
imageFit: cover
params:
  author: omomoki
---

<br/>
# <span style="color: brown; ">■ APEXをセキュアに使おう</span>

どの Oracle Database サービス上にも構築できるローコード・アプリケーション開発ツールの Oracle APEX。
用件によっては、アプリケーションの安全性を気にされることもあるかもしれません。
Oracle Database、こと自律型データベースである Autonomous Database には、デフォルトでさまざまなセキュリティ機能が施されており、Oracle APEX においても不正なアクセスを防ぐ方法は用意されています。
しかし、APEX や OCI のセキュリティ機能を活用して、APEX を安全な方法でアクセス可能にする方法をご紹介します。

- **「APEX をセキュアに使おう」チュートリアルは[こちら](https://speakerdeck.com/oracle4engineer/identity-domain-for-apex-apps/)**
  <br/>

### 上記チュートリアルで構成している構成のメリット

- データベースをプライベート・エンドポイントに配置することで、データベースへのアクセスそのものに制限をかけられる
- 社外からシステムアクセスする際の悪意のあるユーザーからの攻撃(サイバー攻撃)への対策 ​ ができる

- Identity Domains の認証管理機能により APEX アプリケーションに対し、二要素認証を実現

<br/>
