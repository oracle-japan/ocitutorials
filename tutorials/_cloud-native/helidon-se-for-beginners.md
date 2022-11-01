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
* ハンズオン環境にJDK 17以上がインストールされていること
  * 合わせて環境変数(JAVA_HOME)にJDK 17以上のパスが設定されていること

**Helidonのビルドおよび動作環境について**  
Helidon3.xをビルドおよび動作させるにはJDK 17以上が必要です。
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
| Helidon version (default: 3.x.x):|  (そのままEnter) | デフォルトが最新なので、そのままEnter
| Helidon flavor  |  (そのままEnter)  | EditionとしてSEを選択(デフォルト)
| Select archetype  |  2  | databaseを選択(Database)
| Select a JSON library | (そのままEnter) | JSON-P(デフォルト)
| Select a Database Server | (そのままEnter) | H2
| Project groupId  |  (そのままEnter)   | プロジェクトグループID。今回はデフォルト。
| Project artifactId  |  (そのままEnter)   | プロジェクトのアーティファクトID。今回はデフォルト。
| Project version  |  (そのままEnter)   | プロジェクトのバージョン。今回はデフォルト。
| Java package name  |  (そのままEnter)   | Javaのパッケージ名。今回はデフォルト。
| Start development loop? | (そのままEnter)  | development loopの実施有無。今回はなし。

```sh
[opc@oci-tutorials ~]$ helidon init
Helidon version (default: 3.0.1):

| Helidon Flavor

Select a Flavor
  (1) se | Helidon SE
  (2) mp | Helidon MP
Enter selection (default: 1):

| Application Type

Select an Application Type
  (1) quickstart | Quickstart
  (2) database   | Database
  (3) custom     | Custom
Enter selection (default: 1): 2

| Media Support

Select a JSON library
  (1) jsonp   | JSON-P
  (2) jackson | Jackson
  (3) jsonb   | JSON-B
Enter selection (default: 1):

| Database

Select a Database Server
  (1) h2       | H2
  (2) mysql    | MySQL
  (3) oracledb | Oracle DB
  (4) mongodb  | MongoDB
Enter selection (default: 1):

| Customize Project

Project groupId (default: me.sample-helidon):
Project artifactId (default: database-se):
Project version (default: 1.0-SNAPSHOT):
Java package name (default: me.sample.se.database):

Switch directory to /home/opc/database-se to use CLI

Start development loop? (default: n):

```

**Helidon CLIついて**  
Helidon CLIでは、今回作成するベースプロジェクト以外にも様々なタイプのベースプロジェクトの作成が可能です。ぜひ、遊んでみて頂ければと思います！ 
{: .notice--info}

これで、Helidon SEのベースプロジェクトが作成されます。  

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
[INFO] Total time:  9.658 s
[INFO] Finished at: 2022-09-30T09:49:27+09:00
[INFO] ------------------------------------------------------------------------
```

targetディレクトリが生成され、その直下に`database-se.jar`が作成されています。

これで、サンプルアプリケーションのビルドは完了です！

3.サンプルアプリケーションを動かしてみよう
----

それではビルドしたサンプルアプリケーションを動かしてみましょう。

はじめにサンプルアプリケーションを起動します。  

```sh
java -jar target/database-se.jar
```

以下のようなログが出力されていれば起動できています。

```
2022.09.30 09:50:37 情報 io.helidon.common.LogConfig Thread[main,5,main]: Logging at initialization configured using classpath: /logging.properties
2022.09.30 09:50:37 情報 com.zaxxer.hikari.HikariDataSource Thread[main,5,main]: h2 - Starting...
2022.09.30 09:50:37 情報 com.zaxxer.hikari.HikariDataSource Thread[main,5,main]: h2 - Start completed.
2022.09.30 09:50:37 情報 io.helidon.common.HelidonFeatures Thread[features-thread,5,main]: Helidon SE 3.0.1 features: [Config, Db Client, Fault Tolerance, Health, Metrics, Tracing, WebServer]
2022.09.30 09:50:37 情報 io.helidon.webserver.NettyWebServer Thread[nioEventLoopGroup-2-1,10,main]: Channel '@default' started: [id: 0xaaf4650c, L:/[0:0:0:0:0:0:0:0]:8080]
Database here : http://localhost:8080/pokemon
```

起動できたので、動作確認をしてみます。  
動作確認は作成したプロジェクトの直下にある`README.md`を元に進めていきます。  

まずはHello Worldを実施します。

```sh
curl -X GET http://localhost:8080/simple-greet
{"message":"Hello World!"}
```

次に以下のコマンドを実行します。

```sh
curl -X GET http://localhost:8080/pokemon
[{"id":1,"idType":12,"name":"Bulbasaur"},{"id":2,"idType":10,"name":"Charmander"},{"id":3,"idType":11,"name":"Squirtle"},{"id":4,"idType":7,"name":"Caterpie"},{"id":5,"idType":7,"name":"Weedle"},{"id":6,"idType":3,"name":"Pidgey"}]
```

```sh
curl -X GET http://localhost:8080/type
[{"id":1,"name":"Normal"},{"id":2,"name":"Fighting"},{"id":3,"name":"Flying"},{"id":4,"name":"Poison"},{"id":5,"name":"Ground"},{"id":6,"name":"Rock"},{"id":7,"name":"Bug"},{"id":8,"name":"Ghost"},{"id":9,"name":"Steel"},{"id":10,"name":"Fire"},{"id":11,"name":"Water"},{"id":12,"name":"Grass"},{"id":13,"name":"Electric"},{"id":14,"name":"Psychic"},{"id":15,"name":"Ice"},{"id":16,"name":"Dragon"},{"id":17,"name":"Dark"},{"id":18,"name":"Fairy"}]
```

次にメトリクスを取得してみます。  
メトリクスを取得すると、Helidonが提供するアプリケーションの起動状態やヒープメモリ情報を確認できます。  

```sh
{"status":"UP","checks":[{"name":"deadlock","status":"UP"},{"name":"diskSpace","status":"UP","data":{"free":"1.50 TB","freeBytes":1647046471680,"percentFree":"77.65%","total":"1.93 TB","totalBytes":2121073168384}},{"name":"heapMemory","status":"UP","data":{"free":"24.80 MB","freeBytes":26005344,"max":"8.00 GB","maxBytes":8589934592,"percentFree":"99.47%","total":"68.00 MB","totalBytes":71303168}},{"name":"jdbc:h2","status":"UP"}]}
```

**Helidonのメトリクスについて**  
Helidonが実装しているEclipse MicroProfileのMetrics仕様については[こちら](https://download.eclipse.org/microprofile/microprofile-metrics-5.0.0-RC2/microprofile-metrics-spec-5.0.0-RC2.pdf)のドキュメントをご確認ください。
{: .notice--info}


まとめ
----
いかがでしたでしょうか。  

このようにHelidonでは、簡単にRESTfulアプリケーション、そしてデータベースとの接続を実現することができます。  
他にもさまざまな機能やインタフェースが実装されているので、ぜひいろいろ触って遊んでみてください！！
