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

## APEX をセキュアに使おう

どの Oracle Database サービス上にも構築できるローコード・アプリケーション開発ツールの Oracle APEX。<br>
しかし、用件によってはアプリケーションの安全性を気にされることもあるかもしれません。<br>

Oracle Database、こと自律型データベースである Autonomous Database には、デフォルトでさまざまなセキュリティ機能が施されており、Oracle APEX においても不正なアクセスを防ぐ方法は用意されています。<br>
APEX や OCI のセキュリティ機能を活用して、APEX を安全な方法でアクセス可能にする方法をご紹介します。<br>

### 設定手順

**「APEX をセキュアに使おう」セットアップ手順は以下の資料からご確認いただけます。**

<iframe class="speakerdeck-iframe" style="border: 0px; background: rgba(0, 0, 0, 0.1) padding-box; margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;" frameborder="0" src="https://speakerdeck.com/player/6c9055d46f574bb0bc32216f37dcd653" title="OCI IAM Identity Domain_APEXアプリケーションとの認証連携/Identity Domain for APEX Apps" allowfullscreen="true" data-ratio="1.7777777777777777"></iframe>

{{< hint type=note title="上記チュートリアルで構成している構成のメリット" >}}

- データベースをプライベート・エンドポイントに配置することで、データベースへのアクセスそのものに制限をかけられる
- 社外からシステムアクセスする際の悪意のあるユーザーからの攻撃(サイバー攻撃)への対策 ​ ができる
- Identity Domains の認証管理機能により APEX アプリケーションに対し、二要素認証を実現

{{< /hint >}}

<br/>
