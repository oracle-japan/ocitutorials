---
title: "Helidon(SE)を始めてみよう"
excerpt: "Helidon SEは、Oracleが提供するマイクロサービスの開発に適したJavaのマイクロフレームワークです。こちらのハンズオンは、サンプルアプリケーションの構築を通して、Helidonの特徴や使いやすさを学んでいただけるコンテンツになっています。"
layout: single
order: "1001"
tags:
---


**チュートリアル一覧に戻る :** [Oracle Cloud Infrastructure チュートリアル](../..)

Oracleでは、マイクロサービスの開発に適した軽量なJavaアプリケーションフレームワークとして`Helidon`を開発しています。  
Helidonは、SEとMPという2つのエディションがあります。  
このチュートリアルでは、マイクロフレームワークのエディションであるSEの方を取り上げていきます。

前提条件
----
* ハンズオン環境に[Apache Maven](https://maven.apache.org/)がインストールされていること(バージョン3以上)
* ハンズオン環境にJDK 11以上がインストールされていること
  * 合わせて環境変数(JAVA_HOME)にJDK 11のパスが設定されていること

**Helidonのビルドおよび動作環境について**  
Helidon2.xをビルドおよび動作させるにはJDK 11以上が必要です。
{: .notice--info}

1.Helidon CLIでベースプロジェクトを作成してみよう
----
ここでは、Helidon CLIを利用して、ベースプロジェクトを作成してみます。  

Helidonをセットアップするには`Helidon CLI`が便利です。  
このチュートリアルでは、Linux環境の前提で手順を進めますが、WindowsやMac OSでも同じようにインストールすることができます。  

まずは、curlコマンドを利用してバイナリを取得し、実行可能な状態にします。

```sh
curl -O https://helidon.io/cli/latest/linux/helidon
```

```sh
chmod +x ./helidon
```

```sh
sudo mv ./helidon /usr/local/bin/
```

これで、Helidon CLIのインストールは完了です！

上記が完了すると、`helidon`コマンドが利用可能になります。  
まず初めに、`init`コマンドを叩いてみましょう。

```sh
helidon init
```

ベースプロジェクトを構築するためのインタラクティブなプロンプトが表示されます。  
以下のように入力していきます。

|  項目  |  入力パラメータ  | 備考|
| ---- | ---- |---- |
| Helidon flavor  |  1  | EditionとしてSEを選択
| Select archetype  |  3  | databaseを選択(DbClient)
| Project name  |  (そのままEnter)  | プロジェクト名。今回はデフォルト。
| Project groupId  |  (そのままEnter)   |　プロジェクトグループID。今回はデフォルト。
| Project artifactId  |  (そのままEnter)   |　プロジェクトのアーティファクトID。今回はデフォルト。
| Project version  |  (そのままEnter)   |　プロジェクトのバージョン。今回はデフォルト。
| Java package name  |  (そのままEnter)   | Javaのパッケージ名。今回はデフォルト。


```sh
user@client > helidon init
Using Helidon version 2.2.2
Helidon flavor
  (1) SE 
  (2) MP 
Enter selection (Default: 1): 1
Select archetype
  (1) bare | Minimal Helidon SE project suitable to start from scratch 
  (2) quickstart | Sample Helidon SE project that includes multiple REST operations 
  (3) database | Helidon SE application that uses the dbclient API with an in-memory H2 database 
Enter selection (Default: 1): 
Project name (Default: bare-se): 
Project groupId (Default: me.sample-helidon): 
Project artifactId (Default: bare-se): 
Project version (Default: 1.0-SNAPSHOT): 
Java package name (Default: me.sample.se.bare): 
Switch directory to /users/database-se to use CLI

Start development loop? (Default: n): n
```

**Helidon CLIついて**  
Helidon CLIでは、今回作成するベースプロジェクト以外にも様々なタイプのベースプロジェクトの作成が可能です。ぜひ、遊んでみて頂ければと思います！ 
{: .notice--info}

これで、Helidon MPのベースプロジェクトが作成されます。  

ここで作成されるサンプルアプリケーションは以下のようなイメージになります。  

![画面ショット](001.png)

このように、 Helidon CLIを利用すると、簡単にベースプロジェクトを構築することができます。  

2.サンプルアプリケーションをビルドしてみよう
----
サンプルアプリケーションをビルドしてみましょう。  
プロジェクト直下で以下のコマンドを実行します。

```sh
mvn package
```

以下のようなメッセージが表示されればビルド完了です。(一部抜粋しています)

```sh
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  41.637 s
[INFO] Finished at: 2021-04-23T11:20:18+09:00
[INFO] ------------------------------------------------------------------------
```

targetディレクトリが生成され、その直下に`database-se.jar`が作成されています。

これで、サンプルアプリケーションのビルドは完了です！

まとめ
----
いかがでしたでしょうか。  

このようにHelidonでは、簡単にRESTfulアプリケーション、そしてデータベースとの接続を実現することができます。  
他にもさまざまな機能やインタフェースが実装されているので、ぜひいろいろ触って遊んでみてください！！
