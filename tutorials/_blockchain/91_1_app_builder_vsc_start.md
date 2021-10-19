---
title: "Blockchain App Builder（Visual Studio Code拡張版）の基本的な使い方"
excerpt: "この文書は Oracle Blockchain Platformの付属ツールであるBlockchain App BuilderのVisual Studio Code拡張版について、インストール～起動方法、Chaincodeの仕様の作成方法、Chaincodeコードの生成方法などの基本的な使い方を説明します。"
order: "091"
layout: single
tags: "Blockchain"
header:
  teaser: "/blockchain/91_1_app_builder_vsc_start/BAB-Menu.png"
  overlay_image: "/blockchain/91_1_app_builder_vsc_start/BAB-Menu.png"
  overlay_filter: rgba(80,80,80,0.7)
---

この文書は Oracle Blockchain Platform付属のChaincode開発・テスト・デプロイ補助ツールであるBlockchain App BuilderのVisual Studio Code拡張版について、ダウンロードとインストールの方法から、Chaincode仕様の作成方法やChaincodeコードの生成方法など、基本的な使い方を紹介するチュートリアルです。

この文書は、2021年8月時点での最新バージョン(21.2.1)を元に作成されています。

- **前提 :**

  - [Oracle Blockchain Platform のインスタンス作成](../01_1_create_instance/)を完了

# 0. Blockchain App Builderとは

Blockchain App BuilderはOracle Blockchain Platform（OBP）に付属するChaincode開発・テスト・デプロイの補助ツールです。

BABは以下の機能を備えており、Chaincode開発を容易にし、生産性を高めます。

- YAML、JSONの形式で記述した仕様からChaincodeのコードを生成
- ローカル環境に自動構築される最小限のHyperledger Fabricネットワークを用いて開発したChaincodeをテスト
- 生成したChaincodeのパッケージングとOBPへのデプロイ
- OBP上にデプロイしたChaincodeの実行

BABは以下ふたつの形態のツールとして提供されており、いずれも同等の機能を備えています。

- コマンドラインツール
- Visual Studio Codeの拡張機能

この記事では、Visual Studio Codeの拡張版を前提に説明していきます。

# 1. Blockchain App Builderのインストール方法

Blockchain App Builder（Visual Studio Code拡張版）のインストールにあたっての必要な前提条件、インストーラのダウンロード方法、インストール方法について説明します。

## 1.1 必要な前提条件

前提条件として、以下のセットアップが必要です（なお、一部の前提条件については対応する機能を使用しない場合は無視して進めても他の機能は利用できます）。

### 対応OS

  - Mac OSX
  - Oracle Enterprise Linux 7.7 or 7.8
  - Windows 10

### MacOSXおよびLinuxでの前提条件

- Docker: v18.09.0以降のバージョン（```docker --version```で確認）
- Docker Compose: v1.23.0以降のバージョン（```docker-compose --version```で確認）
- Node.js: v12.xの最新のバージョン（```node --version```で確認）<br>
  Node.js v12以外（~v11/v13~）のバージョンは利用不可
- npm: v6.x（```npm --version```で確認）
- ＜GoのChaincodeを開発する場合に必要＞Go: v1.14（```go version```で確認）
- Visual Studio Code v1.48.0以降（```code --version```で確認）

### Windowsでの前提条件

- Docker Desktop for Windows: v2.x
- Node.js: v12.xの最新のバージョン（```node --version```で確認）<br>
  Node.js v12以外（~v11/v13~）のバージョンは利用不可
- npm: v6.x（```npm --version```で確認）
- ＜GoのChaincodeを開発する場合に必要＞Go: v1.14（```go version```で確認）
- Windows Build Toolsのインストール<br>
  管理者権限でPowershellを起動し、```npm install --global windows-build-tools```を実行
- Visual Studio Code v1.48.0以降（```code --version```で確認）
- Perl: v5.x
- OpenSSLのダウンロードとビルド
  1. OpenSSLを https://www.openssl.org/source/old/1.0.2/openssl-1.0.2u.tar.gz からダウンロード
  1. tarballをunzip
  1. Visual C++ 2017/2019ネイティブツールのコマンドプロンプトを開く（Windows Searchでx64 Native Tools Command Prompt for VSを検索）
  1. unzipしたOpenSSLフォルダーに移動し、管理者として以下のコマンドを実行
  
  ```
  perl Configure VC-WIN64A –prefix=C:\OpenSSL-Win64
  ms\do_win64a
  nmake -f ms\ntdll.mak
  cd out32dll
  ..\ms\test
  cd ..
  md C:\OpenSSL-Win64
  md C:\OpenSSL-Win64\bin
  md C:\OpenSSL-Win64\lib
  md C:\OpenSSL-Win64\include
  md C:\OpenSSL-Win64\include\openssl
  copy /b inc32\openssl\* C:\OpenSSL-Win64\include\openssl
  copy /b out32dll\ssleay32.lib C:\OpenSSL-Win64\lib
  copy /b out32dll\libeay32.lib C:\OpenSSL-Win64\lib
  copy /b out32dll\ssleay32.dll C:\OpenSSL-Win64\bin
  copy /b out32dll\libeay32.dll C:\OpenSSL-Win64\bin
  copy /b out32dll\openssl.exe C:\OpenSSL-Win64\bin
  copy /b C:\OpenSSL-Win64\bin\libeay32.dll C:\Windows\System32\libeay32.dll
  copy /b C:\OpenSSL-Win64\bin\ssleay32.dll C:\Windows\System32\ssleay32.dll
  ```

## 1.2 Blockchain App Builderインストーラのダウンロード

1. Oracle Blockchain Platformのサービス・コンソールを開きます。

1. **Developer Tools**のページを開き、左側メニューから**Blockchain App Builder**のセクションを選択し、「Download」のコーナーから**Visual Studio Code Extention**をクリックするとインストーラがダウンロードされます。<br>
  ![インストーラのダウンロード](OBP-Console-Download-BAB.png)

1. ダウンロードしたインストーラのZIPファイルをunzipしておきます。

## 1.3 Visual Studio Codeでのインストール

1. Visual Studio Codeを開きます。

1. Extentionsのページを開き、メニューボタンから**Install from VSIX...**を選択します。<br>
  ![VSCodeでのインストール](VSCode-Install-VSIX.png)

1. 先ほどunzipしておいたインストーラから、**oracle-ochain-extension-xx.x.x.vsix**を選択してインストールします。

1. インストールが実行されると、Blockchain App Builderのアイコンが追加されます。<br>
  ![BABアイコン](VSCode-Installed.png)

1. アイコンを選択するとBlockchain App Builderが起動されます。初回はビルドが実行されるため、数分の待ち時間が生じます。

# 2. Blockchain App Builderの基本的な使い方

Blockchain App Builderがインストールされ、初回のビルドが完了すると、以下のような画面が表示されます。<br>
![BABメニュー](BAB-Menu.png)

- メニューの**CHAINCODES**のセクションからは、Chaincode仕様からのChaincodeコード生成、ローカル環境あるいはリモートOBP環境へのChaincodeデプロイ、また、実行などを行えます。
- メニューの**SPECIFICATIONS**のセクションでは、Chaincode仕様の作成や更新などが行えます。
- メニューの**ENVIRONMENTS**のセクションでは、ローカルのHLFネットワーク環境のリビルドや、リモートのOBP環境の登録、削除などが行えます。

SPECIFICATIONSとCHAINCODESのセクションそれぞれについて、機能と使い方を説明していきます。

## 2.1 Chaincode仕様関連（SPECIFICATIONSセクション）

SPECIFICATIONSセクションでは、Chaincode仕様の記述やインポートなどが行えます。また、Blockchain App Builderのインストール時にいくつかのChaincode仕様サンプルが予めインポートされています。

### Chaincode仕様の作成

1. SPECIFICATIONSセクションの**「＋」ボタン**をクリックすると、新たに作成するChaincode仕様の詳細入力フォームが開きます。<br>
  ![Chaincode仕様の作成](Spec-Create.png)

1. フォームを適切に入力し、**Create**をクリック。<br>
  ![Chaincode仕様作成フォーム](Spec-Create-Form.png)<br>
  - Name: Chaincode仕様の名前。
  - Extention: 仕様の記述形式。YAML形式またはJSON形式を選択。
  - Description（オプショナル）: Chaincode仕様についての説明。
  - Reference File（オプショナル）: 既存のChaincode仕様をコピーして仕様を作成する場合、コピー元の仕様を指定。
  - Location: Chaincode仕様ファイルが作成されるディレクトリを指定。

1. Chaincode仕様が作成され、SPECIFICATIONSセクションに追加されます。作成した仕様はエディタで更新可能です。<br>
  ![Chaincode仕様作成済](Spec-Created.png)<br>
  <br>
  Chaincode仕様の記述方法の詳細については[公式ドキュメント](https://docs.oracle.com/en/cloud/paas/blockchain-cloud/usingoci/input-configuration-file-01.html)を参照ください。

### Chaincode仕様のその他の操作

- SPECIFICATIONSセクションの右上の**「・・・」ボタン**からは、Chaincode仕様ファイルからのインポートが行えます。<br>
  ![Chaincode仕様インポート](Spec-Import.png)

- 既存のChaincode仕様の右クリックメニューからは、生成したChaincodeコードへの再同期、仕様の複製、削除、リネームが行えます。<br>
  ![Chaincode仕様コンテクストメニュー](Spec-Context-Menu.png)

## 2.2 Chaincodeコード関連（CHAINCODESセクション）

CHAINCODESセクションでは、Chaincode仕様からのChaincodeコード（プロジェクト）生成、ローカル環境あるいはリモートOBP環境へのChaincodeデプロイ、また、実行などを行えます。

### Chaincodeコードの生成

1. CHAINCODESセクションの**「＋」ボタン**をクリックすると、新たに生成するChaincode仕様の詳細入力フォームが開きます。<br>
  ![Chaincodeコードの生成](CC-Create.png)

1. フォームを適切に入力し、**Create**をクリック（↓の画像はそれぞれLanguageでTypeScript、Goを選んだ場合です）<br>
  ![Chaincodeコード生成フォーム-TypeScript](CC-Create-Form-TS.png)<br>
  <br>
  ![Chaincodeコード生成フォーム-Go](CC-Create-Form-Go.png)<br>
  - Name: Chaincode仕様の名前。
  - Language: 生成するコードの言語。TypeScriptまたはGoを選択。
  - Specification: 生成の元にするChaincode仕様を選択。
  - Location（TypeScriptの場合）: 生成するChaincodeコードのプロジェクトが作成されるディレクトリを指定。
  - Go Domain（Goの場合）: 生成するChaincodeのGoドメイン（パッケージ名）を指定（指定したドメインに基づいてGoのソースディレクトリ配下にプロジェクトが生成される）。指定しない場合はexample.comを使用。

1. Chaincodeコード／プロジェクトが生成され、CHAINCODESセクションに追加されます。生成されたコード等はエディタで更新可能です。<br>
  ![Chaincodeコード生成済](CC-Created-Go.png)

### Chaincodeコードのデプロイ

1. 対象のChaincodeコードを選択すると、DETAILS、DEPLOY、EXECUTEのタブを備えたパネルが開きます。ここでは**DEPLOY**タブを選択し、表示されたフォームに適切に入力します。<br>
  ![Chaincodeコードのデプロイ](CC-Deploy.png)<br>
  - Name（表示のみ）: デプロイするChaincodeコードの名前。
  - Environment: 対象の環境。ローカル環境（Dockerコンテナとして自動構築される最小限のHyperledger Fabricネットワーク）と（登録してある場合には）リモートのOBP環境から選択。
  - Channel: Chaincodeを稼働させるChannelを選択（ローカル環境の場合はmyChannel固定）。
  - Version: Chaincodeのバージョン。
  - Init Parameters（オプショナル）: Chaincodeを稼働させる際の初期パラメータ（Init関数に渡す引数）。必要な場合には指定。 

1. **Deploy**をクリックすることで、指定した環境にChaincodeがデプロイ（インスタンス化され稼働）されます。

1. Chaincodeのデプロイが成功すると、成功メッセージが表示されます。<br>
  ![Chaincodeコードのデプロイ成功](CC-Deploy-Success.png)<br>
  なお、ローカル環境へのデプロイ、かつ、ローカル環境のDockerコンテナが既に起動されていなかった場合には、この時に併せてDockerコンテナが起動されます。

### Chaincodeコードの実行

1. 対象のChaincodeコードを選択し、**EXECUTE**タブを選択すると実行フォームが開きます。フォームに適切に入力します。<br>
  ![Chaincodeコードの実行フォーム](CC-Execute-CreateMarble.png)<br>
  - Name（表示のみ）: デプロイするChaincodeコードの名前。
  - Environment: 実行するChaincodeが稼働している環境。ローカル環境とリモートのOBP環境から選択。
  - Channel: 実行するChaincodeが稼働しているChannelを選択（ローカル環境の場合はmyChannel固定）。
  - Function: 実行するChaincodeの関数をコードから抽出されたリストから選択。
  - Parameters: 関数に渡す引数。<br>
    Parametersについては、**「…」 ** ボタンをクリックすると、コードから抽出された以下のような引数入力補助フォームが開きます。<br>
    ![引数の入力補助フォーム](CC-Execute-CreateMarble-Param.png)

1. フォーム入力後、**Save Input**、**Query**、**Invoke**ボタンでそれぞれ以下のアクションの実行が可能です。
  - Save Input: フォームの入力値をファイルに保存します。保存した入力値は後で再利用できます（後述）。
  - Query: PeerにChaincodeの実行を依頼（Transaction Proposal）します。が、OrdererにTransactionを送付しないため、トランザクション内容は台帳には反映されません。
  - Invoke: PeerにChaincodeの実行を依頼（Transaction Proposal）し、OrdererにTransactionを送付します。トランザクションが成功した場合、台帳に反映されます。

1. QueryあるいはInvokeを実行すると、コンソールに実行ログが出力されます。また、Transaction Proposalが成功した場合には、フォームのOutput欄に関数の返り値が表示されます。以下はInvokeを実行し、トランザクションが成功した場合の表示例です。<br>
  ![Invoke成功](CC-Execute-CreateMarble-Invoke-Success.png)

> **[注意]**  
> ローカル環境でChaincodeをデプロイ、実行している場合、デプロイ状況や台帳の値などの保持サイクルはローカル環境のDockerコンテナの稼働期間限りです。Dockerコンテナを停止した場合は、デプロイからやり直す必要があります。

### Chaincodeコードのその他の操作

- CHAINCODESセクションの右上の**「・・・」ボタン**からは、既存のBlockchain App Builderで生成したChaincodeコードプロジェクトからのインポートが行えます。<br>
  ![Chaincodeコードインポート](CC-Import.png)

- 既存のChaincodeコードの右クリックメニューからは、生成したChaincodeコードのパッケージング、ライブラリのアップデート、削除、別ウィンドウでの表示が行えます。<br>
  ![Chaincodeコンテクストメニュー](CC-Context-Menu.png)

- Chaincodeコードに"Save Input"で保存したChaincode実行フォームの入力値がある場合は、Queries配下から保存された入力値を表示できます。保存された入力値を選び、右クリックから**Open for Execution**を選択すると、保存された入力値を反映した状態でChaincode実行フォームが開きます。<br>
  ![保存された入力値の再利用](CC-SavedQuery.png)

# 3. 参考リンク

- [Oracle Blockchain Platform公式ドキュメントのBlockchain App Builder（Visual Studio Code拡張版）の箇所](https://docs.oracle.com/en/cloud/paas/blockchain-cloud/usingoci/using-dev-tools-vs-code-extension.html)