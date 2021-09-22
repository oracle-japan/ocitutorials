---
title: "Fine-Grained Access Control Libraryの使い方"
excerpt: "この文書は Oracle Blockchain Platformに付属するサンプル・ライブラリであるFine-Grained Access Control Libraryの使い方を説明します。"
order: "092"
layout: single
tags: "Blockchain"
header:
  teaser: "/blockchain/92_1_fine_grained_ACL/FGACL_use_image.png"
  overlay_image: "/blockchain/92_1_fine_grained_ACL/FGACL_use_image.png"
  overlay_filter: rgba(80,80,80,0.7)
---

この文書は Oracle Blockchain Platformに付属する、Chaincode上／オンチェーンで確実かつ柔軟、きめ細やかなアクセス制御を実現するためのサンプル・ライブラリであるFine-Grained Access Control Libraryの使い方を説明するチュートリアルです。

この文書は、2021年8月時点での最新バージョン(21.2.1)を元に作成されています。

- **前提 :**
  - [Oracle Blockchain Platform のインスタンス作成](../01_1_create_instance/)を完了
<br>
<br>

# 1. Fine-Grained Access Control Libraryの概要を理解する

## 1.1 Fine-Grained Access Control Libraryとは

Fine-Grained Access Control Library（FGACライブラリ)は、**Hyperledger FabricのChaincode内で利用できる、オンチェーン・アクセス制御のためのサンプル・ライブラリ**です。Chaincode内でのアクセス制御を、ブロックチェーン台帳上（＝オンチェーン）に記述したアクセス制御リストをもとに行います。<br>
![Fine-Grained Access Control Library紹介スライド](FGACL_slide.png)

FGACライブラリはOracle Blockchain Platformのコンソールからダウンロードできるサンプルに含まれており、記事執筆時点（2021年8月）では**Go言語のChaincode用**のライブラリが提供されています。

FGACライブラリは以下のような要求を満たすものとなっています：
- Chaincodeの特定の関数を利用できるユーザーを制限できる仕組みを提供する
- ユーザーと権限のリストは動的に変更でき、また、複数のChaincode間で共有できる
- アクセス制御リスト（ACL）に基づいたアクセス制御をChaincode内で容易に実装できる
- Chaincodeのデプロイ時に、リソースとACLを定義できる
- ACLに対しての操作についてもACLで制御できる

## 1.2 Fine-Grained Access Control Libraryの基本の要素

FGACライブラリでは、以下の要素に基づいてオンチェーンでのアクセス制御を実現しています：
- **Identity（アイデンティティ）**: Chaincode内でのチェック対象となる、Chaincodeの呼び出しに使用されたX509証明書
- **Identity Pattern（アイデンティティ・パターン）**: ひとつ～複数のidentityにマッチするパターンです。基本的にはプレフィックス付きの文字列であり、例えばexample.com配下の全てのidentityにマッチするパターンは、```%O%example.com```となります。以下のレベルでのパターンが想定されます。
  - X.509 Subject Common Name – CN
  - X.509 Subject Organizational Unit – OU
  - X.509 Subject Organization – O
  - ライブラリ内で定義されたGroup – GRP
  - Attribute（証明書に付与された属性値） – ATTR
- **Resourse（リソース）**: アクセスを制御したい対象（Chaincode関数や台帳上の特定のレコードなど）の単位ごとにつける名前
- **ACL（アクセス制御リスト）**: Identity Patternのリストと、Create／Read／Update／Deleteなどのアクセスのリストから成るエンティティ。Create／Read／Update／Delete以外の独自のカスタム・アクセスを定義することも可能。

## 1.3 Fine-Grained Access Control Libraryの組み込み方

FGACライブラリには、アクセス制御についての前述の要素に関する各種機能（リソースやグループ、ACLの定義・更新・削除、アクセス権限のチェックなど）が実装されています。ライブラリの提供するこれらの機能を、開発するChaincodeの関数に組み込むことで、確実かつ柔軟、きめ細やかなアクセス制御が容易に実装できます。<br>
![Fine-Grained Access Control Libraryの利用イメージ](FGACL_use_image.png)

Chaincode開発の中では、以下を行うことになります：
- 業務に関する関数の中に、Chaincodeを呼び出しに使用されたアイデンティティに基づくアクセス権限およびアクセス制御リストを参照しての権限チェック機能を組み込む
- アクセス権限とアクセス制御リストを管理する機能を実装する

Chaincodeの運用においては、グループに所属するアイデンティティのメンテナンスなどを行っていくことになります。これは通常のトランザクションとして実行するため、Endorsement Policyなど、Hyperledger Fabricの持つ他のアクセス制御の仕組みも組み合わせ可能です。この場合、**アクセス権限とアクセス制御リストを管理する機能については、別のChaincodeとして実装しておくとEndorsement Policyでのアクセス制御が使いやすくなる**ことも意識しておくと良いでしょう。

# 2. Fine-Grained Access Control Libraryを使ってみる

## 2.1 ライブラリを含むサンプルのダウンロード

1. Oracle Blockchain Platformのサービス・コンソールを開きます。

1. **Developer Tools**のページを開き、左側メニューから**Samples**のセクションを選択し、Samplesページを開きます。<br>
![Samplesページ](OBP-console-samples.png)

1. **Marbles with fine grained ACLs**のコーナーにある**Download: here**のリンクをクリックするとダウンロードされます。<br>
  ![インストーラのダウンロード](OBP-console-download-here.png)

## 2.2 サンプルの中身

ダウンロードしたサンプル（ZIPファイル）には以下のモジュールが含まれています。

- **Fine-GrainedAccessControlLibrary.zip**<br>
  FGACライブラリの本体です。Go言語でChaincodeを開発する際に、ライブラリとして組み込むことで利用できます。
- **fgACL_MarbleSampleCC.zip**<br>
  FGACライブラリを組み込んだGo言語で記述されたChaincodeのサンプルです。FGACライブラリをどのように利用すればよいかがわかるような手本になっています。
- **fgACL-NodeJSCode.zip:**<br>
  Oracle Blockchain Platform上で稼働させたChaincodeを呼び出すNode.jsアプリのサンプルです。

ライブラリ、およびサンプルChaincodeに実装されている具体的な関数など、詳細については後述の公式ドキュメントを参照ください。

# 3. 参考リンク

- [Oracle Blockchain Platform公式ドキュメントのFine-Grained Access Control Libraryの箇所](https://docs.oracle.com/en/cloud/paas/blockchain-cloud/usingoci/using-fine-grained-access-control-library.html)