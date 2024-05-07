---
title: "Helidon(MP)を始めてみよう"
excerpt: "Helidon MPは、Oracleが提供するMicroProfile準拠のマイクロサービスの開発に適したJavaアプリケーションフレームワークです。こちらのハンズオンは、サンプルアプリケーションの構築を通して、Helidonの特徴や使いやすさを学んでいただけるコンテンツになっています。"
layout: single
order: "1000"
tags:
---

**チュートリアル一覧に戻る :** [Oracle Cloud Infrastructure チュートリアル](../..)

Oracleでは、マイクロサービスの開発に適した軽量なJavaアプリケーションフレームワークとして`Helidon`を開発しています。  
Helidonは、SEとMPという2つのエディションがあります。  
このチュートリアルでは、MicroProfile準拠のエディションであるMPの方を取り上げていきます。

**MicroProfileについて**  
MicroProfileは、マイクロサービス環境下で複数言語との相互連携を保ちながら、サービスを構築するために複数ベンダーによって策定されているJavaの標準仕様のことです。  
詳細は[こちら](https://microprofile.io/)をご確認ください。
{: .notice--info}

前提条件
----
* [こちら](/ocitutorials/adb/adb101-provisioning/#2-adbインスタンスを作成してみよう)の手順が完了していること
  * このチュートリアルでは、データベースとしてOracle Cloud Infrastructure上の自律型データベースであるAutonomous Transaction Processing(以降、ATPとします)を利用します
* [こちら](/ocitutorials/adb/adb104-connect-using-wallet/#1-クレデンシャルウォレットのダウンロード)の手順が完了していること
  * このチュートリアルでは、ATPに接続するためにクレデンシャル・ウォレットを利用します。事前にクレデンシャル・ウォレットをダウンロードしてください
  * 実施する手順は`1. クレデンシャル・ウォレットのダウンロード`のみで問題ありません
* ハンズオン環境のVMイメージに[Oracle Linux Cloud Developer image](https://docs.oracle.com/en-us/iaas/oracle-linux/developer/index.htm)を利用すること
  * Oracle Linux Cloud Developer imageには、このチュートリアルで利用するJDK 21とGitコマンドがインストールされています

**Helidonのビルドおよび動作環境について**  
Helidon4.xをビルドおよび動作させるにはJDK 21以上が必要です。
{: .notice--info}

事前準備
---
ここでは、このチュートリアルを実施するための事前準備を行います。  
予め、Oracle Linux Cloud Developer imageでVMが作成されていることを前提とします。  

### Mavenのインストール

アプリケーションのプロジェクト作成やビルドに必要なMavenコマンドをインストールします。  

Mavenのバイナリをダウンロードします。  

```sh
wget https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip
```

ダウンロードしたバイナリを解凍します。

```sh
unzip apache-maven-3.9.6-bin.zip
```

PATHを通します。

```sh
sudo mv apache-maven-3.9.6 /usr/bin
```

```sh
export PATH="$PATH:/usr/bin/apache-maven-3.9.6/bin"
```

mavenコマンドが実行できることを確認します。  

```sh
mvn --version
```

以下のように表示されれば問題ありません。

```sh
[opc@helidon ~]$ mvn --version
Apache Maven 3.9.6 (bc0240f3c744dd6b6ec2920b3cd08dcc295161ae)
Maven home: /usr/bin/apache-maven-3.9.6
Java version: 21.0.2, vendor: Oracle Corporation, runtime: /usr/lib64/graalvm/graalvm-java21
Default locale: en_US, platform encoding: UTF-8
OS name: "linux", version: "5.15.0-203.146.5.1.el8uek.x86_64", arch: "amd64", family: "unix"
```

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
sudo mv ./helidon /usr/bin/
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
| Helidon versions  |  1  | 最新の`4.0.8`
| Helidon Flavor  |  2  | mp
| Application Type  |  2  | databse
| Media Support  |  1   |Jackson
| JPA Implementation  |  (そのままEnter)   |Hibernate
| Connection Pool  |  (そのままEnter)   |HikariCP
| Database Server |  3    | Oracle DB
| Auto DDL |  yes   | DDLの作成
| Persistence Unit Name |  test    | JPAのユニット名
| Datasource Name |  test    | データベース名
| Project groupId |  com.example.handson.helidon    | プロジェクトのグループID
| Project artifactId |  helidon-handson    | Jarファイル名
| Project version |  (そのままEnter)    | アプリのバージョン
| Java package name |  com.example.handson.helidon    | Javaのパッケージ名
| Start development loop  |  n   | 開発モードで起動するかどうか


```sh
[opc@helidon ~]$ helidon init
Helidon versions
  (1) 4.0.8 
  (2) 3.2.8 
  (3) 2.6.7 
  (4) Show all versions 
Enter selection (default: 1): 1    

Helidon version: 4.0.8

| Helidon Flavor

Select a Flavor
  (1) se | Helidon SE
  (2) mp | Helidon MP
Enter selection (default: 1): 2

| Application Type

Select an Application Type
  (1) quickstart | Quickstart
  (2) database   | Database
  (3) custom     | Custom
  (4) oci        | OCI
Enter selection (default: 1): 2

| Media Support

Select a JSON library
  (1) jackson | Jackson
  (2) jsonb   | JSON-B
Enter selection (default: 2): 1

| Database

Select a JPA Implementation
  (1) hibernate   | Hibernate
  (2) eclipselink | EclipseLink
Enter selection (default: 1): 1
Select a Connection Pool
  (1) hikaricp | HikariCP
  (2) ucp      | UCP
Enter selection (default: 1): 1
Select a Database Server
  (1) h2       | H2
  (2) mysql    | MySQL
  (3) oracledb | Oracle DB
Enter selection (default: 1): 3
Auto DDL (yes/no) (default: no): yes
Persistence Unit Name (default: pu1): test
Datasource Name (default: ds1): test

| Customize Project

Project groupId (default: me.opc-helidon): com.example.handson.helidon
Project artifactId (default: database-mp): helidon-handson
Project version (default: 1.0-SNAPSHOT): 
Java package name (default: me.opc.mp.database): com.example.handson.helidon

Directory /home/opc/helidon-handson already exists, generating unique name
Switch directory to /home/opc/helidon-handson-2 to use CLI

Start development loop? (default: n): n
[opc@helidon ~]$ 
```

**Helidon CLIについて**  
Helidon CLIでは、今回作成するベースプロジェクト以外にも様々なタイプのベースプロジェクトの作成が可能です。ぜひ、遊んでみて頂ければと思います！ 
{: .notice--info}

これで、Helidon MPのベースプロジェクトが作成されます。  

このように、 Helidon CLIを利用すると、簡単にベースプロジェクトを構築することができます。  

この後は、事前に用意したサンプルアプリケーションを元にチュートリアルを行っていきます。  
(サンプルアプリケーションも、Helidon CLIをベースに作成したものです)

2.サンプルアプリケーションを動かしてみよう
----
ここでは、事前に用意したサンプルアプリケーションを動かしてみます。

### 2-1. サンプルアプリケーションのディレクトリ構成を確認しよう

GitHubから、サンプルアプリケーションをcloneします。

```sh
git clone https://github.com/oracle-japan/helidon-handson.git
```

このサンプルアプリケーションは、RESTインタフェースで都道府県名を取得するアプリケーションです。  
図で表すと以下のようなイメージになります。

![画面ショット](002.png)

サンプルアプリケーションのディレクトリ構成を確認してみます。  



ソースコードの中身については、後ほど解説します。

```
.
├── README.md
├── pom.xml --> mavenの設定ファイル
└── src
    └── main
        ├── java
        │   └── com
        │       └── example
        │           └── handson
        │               └── helidon
        │                   ├── Prefecture.java  --> テーブルに紐づくEntityクラス
        │                   ├── PrefectureResource.java  --> RESTインターフェースを実装しているクラス
        │                   └── package-info.java  --> パッケージファイル
        └── resources
            ├── META-INF
            │   ├── beans.xml --> CDIの設定ファイル
            │   ├── init_script.sql  --> サンプルアプリケーションの初期データを登録するDDLファイル
            │   ├── microprofile-config.properties  --> Helidon MPの構成ファイル
            │   ├── native-image
            │   │   ├── native-image.properties
            │   │   └── reflect-config.json
            │   └── persistence.xml  --> JPAに関する設定ファイル
            ├── hibernate.properties  --> Hibernateに関する設定ファイル
            └── logging.properties  --> ログに関する設定ファイル

10 directories, 13 files
```

### 2-2. サンプルアプリケーションの設定ファイルを確認しよう

このサンプルアプリケーションのソースコードについて少しみていきます。

このサンプルアプリケーションは、`JAX-RS + JPA/JTA`で構築しています。  
また、Helidon MPはJava EE／Jakarta EEの開発者になじみのあるコードスタイルになります。  
そのため、この後のソースコードの解説では特にJAX-RSやJPA/JTAに基づいて説明していきます。 


まず初めに、設定ファイル`src/main/resources/META-INF/microprofile-config.properties`からみていきます。

```yaml
# Datasource properties
javax.sql.DataSource.test.dataSourceClassName=oracle.jdbc.pool.OracleDataSource
javax.sql.DataSource.test.dataSource.url=jdbc:oracle:thin:@
javax.sql.DataSource.test.dataSource.user=admin
javax.sql.DataSource.test.dataSource.password=
```

冒頭の4行は、データベースの接続設定を定義する部分です。  
この後、[2-5. サンプルアプリケーションの動作を確認しよう](#2-5-サンプルアプリケーションの動作を確認しよう)で詳しくみていきます。

```yaml
# Microprofile server properties
server.port=8080
server.host=0.0.0.0
```

次の2行がサーバに関する設定です。  
ここでは、`http://localhost:8080`で起動できるように設定しています。

```yaml
# Change the following to true to enable the optional MicroProfile Metrics REST.request metrics
metrics.rest-request.enabled=false
```

最後の行は、メトリクスの利用可否です。  
今回は、`false`にしていますが、`true`で設定した場合、MicroProfile仕様に基づいてメトリクスを利用可能です。  
その場合、Prometheusなどのモニタリングツールを利用して、メトリクス監視を行うことができます。

次に、`src/main/resources/META-INF/persistence.xml`です。

ここでは、JPAに関する設定を行っています。  

```xml
<persistence-unit name="test" transaction-type="JTA">
```

この部分で、JPAのユニット名を`test`と定義しています。  
このユニット名は、後ほど、ソースコードの中でEntityManagerの定義を行う際に利用します。  
また、今回はトランザクションは`JTA`で管理することもここで定義します。  

```xml
<class>com.example.handson.helidon.Prefecture</class>
```

この部分で、Entityクラスを指定しています。  
今回はPrefectureクラスを指定します。  

```xml
    <properties>
        <property name="hibernate.hbm2ddl.auto" value="create-drop"/>
        <property name="hibernate.column_ordering_strategy" value="legacy"/>
        <property name="jakarta.persistence.sql-load-script-source" value="META-INF/init_script.sql"/>
    </properties>
```

この部分は、その他のプロパティを指定します。  
今回は、自動スキーマ生成の設定、DDLスクリプトのパスなどの設定を定義しています。    
ここでは、他にも永続化に関する柔軟な設定を行うことができます。  
詳細は[こちら](https://docs.oracle.com/cd/F23552_01/toplink/12.2.1.4/jpa-extensions-reference/persistence-property-extensions-reference.html#GUID-2E535D07-446F-44F0-9D8D-89E7FFCF8225)でご確認ください。


設定ファイルに関する確認は以上です。

### 2-3. サンプルアプリケーションのソースコード(Prefecture.java)を確認しよう

次に、ソースコードをみていきます。  
まず初めに、`src/main/java/com/example/handson/helidon/Prefecture.java`についてみていきます。  
このクラスは、テーブルに対するEntityクラスをJPAを利用して実装したものです。

まずは、ソースコード冒頭のアノテーション部分です。

```java
@Entity(name = "Prefecture")
@Table(name = "PREFECTURE")
@Access(AccessType.PROPERTY)
```

`@Entity(name = "Prefecture")`部分は、このJavaクラスがEntityクラスであり、その名前を`Prefecture`とすること示しています。  
`@Table(name = "PREFECTURE")`部分は、このEntityクラスを`PREFECTURE`テーブルと紐づけることを示します。  
これらより、冒頭2行部分は、「`PREFECTURE`テーブルと紐づける`Prefecture`エンティティクラスを宣言する」ことになります。  

3行目は、各カラム(フィールド)に対するアクセス形式を指定します。  
今回は、`Property`になるので、各カラム(フィールド)への属性はgetterに定義します。  

```java
@NamedQueries({
    @NamedQuery(name = "getPrefectures",
                query = "SELECT p FROM Prefecture p"),
    @NamedQuery(name = "getPrefectureById",
                query = "SELECT p FROM Prefecture p WHERE p.id = :id"),
    @NamedQuery(name = "getPrefectureByName",
                query = "SELECT p FROM Prefecture p WHERE p.name = :name")
})
```

続いて、`NamedQueries`の部分です。  
ここでは、アプリケーション内でテーブルに対して利用するクエリを定義します。  
サンプルアプリケーションでは、`getPrefectures`、`getPrefectureById`、`getPrefectureByName`という名前で3つのクエリを定義しています。  
これらクエリの利用については、[2-4. サンプルアプリケーションのソースコード(PrefectureResource.java)を確認しよう](#2-4-サンプルアプリケーションのソースコードprefectureresourcejavaを確認しよう)で解説します

```java
public class Prefecture {

    private int id;

    private String name;
    
```

この部分は、Prefecture EntityクラスとしてPREFECTUREテーブルのカラムを定義しています。  
このサンプルアプリケーションでは、`id`と`name`という2つのカラムがあります。

```java
    @Id
    @Column(name = "ID", nullable = false, updatable = false)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic(optional = false)
    @Column(name = "NAME", nullable = false)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

ここでは、アノテーションでカラムごとに属性を付与しています。  
今回は、アクセス形式が`Property`なので、getterに対してカラム属性を定義します。  
変数`id`に対しては、PREFECTUREテーブルのIDカラムを`name = "ID"`で紐づけています。  
また、`@Id`によってこのカラムを主キーとして定義し、`nullable = false`と`updatable = false`により、NOT NULL制約と主キーの更新を禁止する定義を行っています。  
変数`name`に対しては、PREFECTUREテーブルのIDカラムを`name = "NAME"`で紐づけています。  
同じようにNOT NULL制約も付与しています。  
なお、`@Basic(optional = false)`は、カラムを基本型として定義しています。  


### 2-4. サンプルアプリケーションのソースコード(PrefectureResource.java)を確認しよう

次に、`src/main/java/com/example/handson/helidon/PrefectureResource.java`をみていきます。  
このクラスは、サンプルアプリケーションのRESTインタフェースをJAX-RS/JTAで実装したものです。

まずは冒頭部分で付与されているアノテーションです。

```java
@Path("prefecture")
public class PrefectureResource {
```

ここでは、クラスに対して`@Path("prefecture")`を付与することで、RESTインタフェースのアクセス先URLを定義しています。  
この場合、`http://localhost:8080/prefecure`(localhostの場合)というURLでアクセス可能という定義になります。  

```java
    @PersistenceContext(unitName = "test")
    private EntityManager entityManager;
```

ここでは、JPAの`EntityManager`を定義しています。  
このEntityManagerを利用してデータベースへのクエリを制御します。  
ここで指定する`unitName`は、`persistence.xml`で定義したものです。  
今回は、`test`という名前で定義したので、`unitName = "test"`となります。

```java
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Prefecture> getPrefectures() {
        return entityManager.createNamedQuery("getPrefectures", Prefecture.class).getResultList();
    }
```

ここからは実際のRESTインタフェースを実装するメソッドをみていきます。  
まず初めは、全都道府県データを取得するメソッドです。  
`@GET`のアノテーションによって、HTTP GETメソッドであることを示します。  
また、`@Produces`アノテーションで、レスポンスの応答形式を指定しています。この場合は、`Content-type: application/json`になります。  
クエリは、EntityManagerを利用して発行しています。その際に、`getPrefectures`という名前でクエリを取得しています。  
この名前は、[2-3. サンプルアプリケーションのソースコード(Prefecture.java)を確認しよう](#2-3-サンプルアプリケーションのソースコードprefecturejavaを確認しよう)で定義したものです。  

```java
    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Prefecture getPrefectureById(@PathParam("id") String id) {
        TypedQuery<Prefecture> query = entityManager.createNamedQuery("getPrefectureById", Prefecture.class);
        Prefecture prefecture = new Prefecture();
        try {
            prefecture = query.setParameter("id", Integer.valueOf(id)).getSingleResult();
        } catch (NoResultException ne) {
            throw new NotFoundException("Unable to find prefecture with ID " + id);
        }
        return prefecture;
    }
```

次に、ID(主キー)を条件にして都道府県を取得するメソッドです。  
`@GET`のアノテーションによって、HTTP GETメソッドであることを示します。  
また、`@Path`アノテーションによって、リソースクラスパス(今回は、`prefecture`)以降のパスを定義します。  
そのため、このメソッドにアクセスするためのURLは、`http://localhost:8080/prefecture/1`のようになります。(idが"1"のデータを取得する場合)  
なお、`@Produces`アノテーションで、レスポンスの応答形式を指定しています。この場合は、`Content-type: application/json`になります。  
メソッドの引数として、`@PathParam`アノテーションで`id`を指定しています。これはURLからパラメータとして`id`を取得することを意味します。  

**パラメータについて**  
パラメータの取得には、さまざまなアノテーションを利用できます。  
詳細は[こちら](https://docs.oracle.com/cd/F32751_01/weblogic-server/14.1.1.0/restf/develop-restful-service.html#GUID-BD610888-0592-45E2-8235-716EE48B516B)をご確認ください。
{: .notice--info}


EntityManagerを利用して、クエリを発行しています。その際に、`getPrefectureById`という名前でクエリを取得しています。  
この名前は、[2-3. サンプルアプリケーションのソースコード(Prefecture.java)を確認しよう](#2-3-サンプルアプリケーションのソースコードprefecturejavaを確認しよう)で定義したものです。  

```java
    @GET
    @Path("name/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public Prefecture getPrefectureByName(@PathParam("name") String name) {
        TypedQuery<Prefecture> query = entityManager.createNamedQuery("getPrefectureByName", Prefecture.class);
        List<Prefecture> list = query.setParameter("name", name).getResultList();
        if (list.isEmpty()) {
            throw new NotFoundException("Unable to find prefecture with name " + name);
        }
        return list.get(0);
    }
```

このメソッドは、都道府県名(name)で情報を取得するメソッドです。
アノテーションの説明は先程のメソッドと同様です。  
このメソッドで異なるのは、`@PathParam`で`name`というパラメータをURLから取得しています。  
そのため、このメソッドにアクセスするためのURLは、`http://localhost:8080/prefecture/name/北海道`のようになります。("北海道"のデータを取得する場合)  
このメソッドでも、EntityManagerを利用して、クエリを発行しています。その際に、`getPrefectureByName`という名前でクエリを取得しています。  


```java
    @DELETE
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional(Transactional.TxType.REQUIRED)
    public void deletePrefecture(@PathParam("id") String id) {
        Prefecture prefecture = getPrefectureById(id);
        entityManager.remove(prefecture);
    }
```

このメソッドは、主キーである`id`指定で都道府県を削除するメソッドです。  
`@DELETE`のアノテーションによって、HTTP DELETEメソッドであることを示します。  
また、`@Transactional(Transactional.TxType.REQUIRED)`は、JTAによるトランザクション管理の設定を定義します。  
詳細は[こちら](https://jakarta.ee/specifications/platform/8/apidocs/javax/transaction/transactional.txtype)をご確認ください。
その他のアノテーションやパラメータの取得方法はこれまでのメソッドと同様です。  
このメソッドでも、EntityManagerを利用して、クエリを発行しています。  
`remove()`はEntityManagerに予め実装されている主キーを条件にして該当データを削除するメソッドです。(クエリの定義は不要です)  

```java
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional(Transactional.TxType.REQUIRED)
    public void createPrefecture(Prefecture prefecture) {
        try {
            entityManager.persist(prefecture);
        } catch (Exception e) {
            throw new BadRequestException("Unable to create pokemon with ID " + prefecture.getId());
        }
    }
```

このメソッドは、都道府県を登録/更新するメソッドです。  
`@POST`のアノテーションによって、HTTP POSTメソッドであることを示します。  
その他のアノテーションやパラメータの取得方法はこれまでのメソッドと同様です。  
このメソッドでも、EntityManagerを利用して、クエリを発行しています。  
`remove()`メソッド同様に、`persist()`メソッドは、与えられたデータを元に永続化(データベースに登録)するメソッドになります。  
このメソッドは、Prefectureクラスを引数にとっているので、ここでPOSTするデータは、以下のようなイメージです。

```json
{
    "id": "1",
    "name": "北海道"
}
```

以上で、サンプルアプリケーションの中身に関する確認は完了です！

### 2-5. サンプルアプリケーションの動作を確認しよう

ここまでアプリケーションの中身を確認してきたので、このアプリケーションを実際に動作させてみましょう。  

[2-2. サンプルアプリケーションの設定ファイルを確認しよう](#2-2-サンプルアプリケーションの設定ファイルを確認しよう)で確認した`src/main/resources/META-INF/microprofile-config.properties`にデータベース接続情報を設定していきます。  
このチュートリアルでは、ATPを利用してサンプルアプリケーションを動作させます。  
前提条件が完了していれば、ATPへの接続情報が格納されたクレデンシャル・ウォレットが取得できていると思います。  
このクレデンシャル・ウォレットを含めて、データベース接続情報を設定していきます。  

まずは、データソースクラス名を設定します。  
今回はOracle Databaseとして設定するので、以下のように設定します。

```yaml
javax.sql.DataSource.test.dataSourceClassName=oracle.jdbc.pool.OracleDataSource
```

次にデータソースURLを指定していきます。  
ここでクレデンシャル・ウォレットのファイルパスを記載します。  
取得済みのクレデンシャル・ウォレットを解凍し、任意のディレクトリに配置します。  
クレデンシャル・ウォレットを配置したフルパスを踏まえて、以下のように設定します。  
`@atp01_high`の部分は、データベース名が入ります。  
ここでは前提条件のATP作成手順に沿った前提で記載していますが、別のデータベース名で作成した方は`@[データベース名]_high`に読み替えてください。  
`TNS_ADMIN=/path_to_Wallet`の部分は、ご自身のクレデンシャル・ウォレットまでのフルパスに読み替えてください。

```yaml
javax.sql.DataSource.test.dataSource.url=jdbc:oracle:thin:@atp01_high?TNS_ADMIN=/path_to_Wallet
```

```yaml
javax.sql.DataSource.test.dataSource.user=admin
javax.sql.DataSource.test.dataSource.password=Welcome12345#
```

最後にデータベースユーザ名とパスワードを設定します。  
ユーザ名はATP作成時に`admin`ユーザが自動的に作成されているので、`admin`ユーザを設定します。  
パスワードは、ATP作成時にご自身が設定した`admin`スキーマのパスワードを指定してください。  
(前提条件のATP作成手順通りであれば、`Welcome12345#`です)

これでデータベースの接続設定は完了です。

**データベースパスワードについて**  
今回のチュートリアルでは、データベースパスワードをそのまま記載していますが、セキュリティ上は不適切です。  
Helidonでは、[プロパティの暗号化機構](https://helidon.io/docs/v2/apidocs/io.helidon.config.encryption/io/helidon/config/encryption/EncryptionUtil.html)が実装されています。  
また、Oracle Cloud Infrastructure上では、鍵管理サービスとして`OCI Vault`というサービスもあります。  
これらを利用することで、よりセキュリティを高めてアプリケーションを作成することができます。
{: .notice--info}

では、サンプルアプリケーションをビルドしてみましょう。  
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

targetディレクトリが生成され、その直下に`helidon-handson.jar`が作成されています。

それでは、jarファイルを起動してみましょう。  
実行場所はプロジェクト直下とします。  

```sh
java -jar target/helidon-handson.jar 
```

起動すると以下のようなログがコンソール上に出力されます。(一部抜粋しています)

```sh
2024.05.06 12:53:53 INFO io.helidon.microprofile.server.ServerCdiExtension Thread[#1,main,5,main]: Registering JAX-RS Application: HelidonMP
2024.05.06 12:53:53 INFO io.helidon.webserver.ServerListener VirtualThread[#45,start @default (/0.0.0.0:8080)]/runnable@ForkJoinPool-1-worker-1: [0x0ed438ea] http://0.0.0.0:8080 bound for socket '@default'
2024.05.06 12:53:53 INFO io.helidon.webserver.LoomServer Thread[#1,main,5,main]: Started all channels in 13 milliseconds. 7411 milliseconds since JVM startup. Java 21.0.2+13-LTS-jvmci-23.1-b30
2024.05.06 12:53:53 INFO io.helidon.microprofile.server.ServerCdiExtension Thread[#1,main,5,main]: Server started on http://localhost:8080 (and all other host addresses) in 7416 milliseconds (since JVM startup).
2024.05.06 12:53:53 INFO io.helidon.common.features.HelidonFeatures Thread[#48,features-thread,5,main]: Helidon MP 4.0.8 features: [CDI, Config, Health, JPA, JTA, Metrics, Server]
```

**アプリケーションの起動ついて**  
起動後の初回起動は、初期データの登録(DDL実行)が走るため、少し時間がかかります。  
また、今回は自動生成スキーマの設定により、初めにDrop tableした後にCreate tableしているので、初回実行時にはExceptionが発生する可能性がありますが、アプリケーションの実行に問題はありません。
{: .notice--info}

それでは、アクセスしてみます。  

まずは、全都道府県情報を取得してみましょう。

```sh
curl http://localhost:8080/prefecture
```

このような結果が返却されれば成功です。

 ```sh
 [{"id":1,"name":"北海道"},{"id":2,"name":"青森"}....],
 ```

次にID(主キー)指定で検索します。

```sh
curl http://localhost:8080/prefecture/1
```

このように結果が返却されます。

```sh
{"id":1,"name":"北海道"}
```

次に都道府県名指定で検索します。  
以下は北海道をGETするURLで、`%E5%8C%97%E6%B5%B7%E9%81%93`は北海道をURLエンコードした文字列です。

```sh
curl http://localhost:8080/prefecture/name/%E5%8C%97%E6%B5%B7%E9%81%93
```

このように結果が返却されます。

```sh
{"id":1,"name":"北海道"}
```

次に北海道のデータを削除してみます。

```sh
curl -X DELETE http://localhost:8080/prefecture/1
```

削除されたことを確認してみましょう

```sh
curl -i -X GET http://localhost:8080/prefecture/1
```

以下のような結果が返却されます。

```sh
HTTP/1.1 404 Not Found
Content-Type: text/plain
Date: Wed, 28 Apr 2021 17:56:25 +0900
transfer-encoding: chunked
connection: keep-alive

No handler found for path: /prefecture/1
```

これは、`/prefecture/1`というリソースが存在しないことを示します。  

最後に北海道のデータを再登録します。

```sh
curl -H "Content-Type: application/json" -X POST --data '{"id":1, "name":"北海道"}' http://localhost:8080/prefecture 
```

再登録されたことを確認しましょう。

```sh
curl http://localhost:8080/prefecture/1
```

ちゃんと再登録されていますね。

```sh
{"id":1,"name":"北海道"}
```

以上で、サンプルアプリケーションの動作確認は完了です！  

次に、このサンプルアプリケーションをベースに機能を拡張するチュートリアルを実施します。


3.サンプルアプリケーションを拡張してみよう
----
ここでは、先程までみてきたサンプルアプリケーションを元に機能を拡張してみたいと思います。  
今回は、都道府県情報にエリア(地域区分)を追加してみます。  
区分については、[こちらのページ](https://www.stat.go.jp/data/shugyou/1997/3-1.html)を参考にします。  

完成した際に取得できるデータは以下のイメージです。  

```sh
> curl http://localhost:8080/prefecture/
> [{"id":1, "area":"北海道", "name":"北海道"},{"id":2, "area":"東北", "name":"青森"}....]
```

```sh
> curl http://localhost:8080/area/
> [{"id":1, "area":"北海道"},{"id":2, "area":"東北"},{"id":3, "area":"南関東"}....]
```

そして、テーブル構造としては以下の通りです。  

![画面ショット](001.png)


### 3-1. 都道府県エリアを管理するEntityを作成しよう

まずは、地域区分のテーブルを追加するためにこのテーブルに紐づく`PrefectureArea`というEntityを作成しましょう。(今回、ATPへのテーブルの追加自体はJPAの自動スキーマ生成機能を利用します)    
ファイル名は`PrefectureArea.java`です。  
テーブル名は`PREFECTUREAREA`とします。  

```java
package com.example.handson.helidon;

import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

@Entity(name = "XXXXXX")
@Table(name = "XXXXXX")
@Access(AccessType.FIELD)
@NamedQueries({
        @NamedQuery(name = "getPrefectureAreas",
                    query = "SELECT a FROM PrefectureArea a"),
        @NamedQuery(name = "getPrefectureAreaByArea",
                    query = "SELECT a FROM PrefectureArea a WHERE a.area = :area")
})
```

上記の`@Entity`と`@Table`の部分の`XXXXXX`に適切な名前を入れます。  
なお、このEntityでは、`@NamedQuery`として、`getPrefectureAreas`と`getPrefectureAreaByArea`という2つのクエリを定義しました。  
また、アクセス形式は`Field`とします。

次にフィールドを作成していきます。  
今回は、テーブルのカラムとして、主キーとなる`ID`カラムと地域区分を示す`AREA`カラムを作成します。

```java
public class PrefectureArea {
    @XXX
    @Column(name = "XXX", nullable = false, updatable = false)
    private int XXX;

    @Basic(optional = false)
    @Column(name = "XXX")
    private String XXX;

    public PrefectureArea() {
    }

    public int getXXX() {
        return XXX;
    }

    public void setXXX(int XXX) {
        this.XXX = XXX;
    }

    public String getXXX() {
        return XXX;
    }

    public void setXXX(String XXX) {
        this.XXX = XXX;
    }
}
```

上記の`XXX`に適切な文字を入れてみましょう。  
その際、アクセス形式が`Field`なので、カラム属性の定義はフィールド変数に対して付与している点にも注目します。  

以上で、`PrefectureArea`エンティティは完成です！  

### 3-2. 都道府県エリアを取得するRESTインタフェースを作成しよう

ここでは、都道府県エリアを取得するリソースクラスを作成します。  
まずは、`PrefectureAreaResource`というクラスを作成しましょう。  
ファイル名は`PrefectureAreaResource.java`です。

このリソースクラスには、`http://localhost:8080/area`というパスでアクセスできるようにします。  
また、EntityManagerには、Prefectureクラスと同じものを利用し、上記URLにアクセスすると都道府県の全エリア情報を返却するように実装します。  
クエリは、[3-1. 都道府県エリアを管理するEntityを作成しよう](#3-1-都道府県エリアを管理するentityを作成しよう)で定義したクエリを使用します。  

```java
package com.example.handson.helidon;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("XXXXXX")
public class PrefectureAreaResource {

    @PersistenceContext(unitName = "XXXXXX")
    private EntityManager entityManager;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<PrefectureArea> getPrefectureArea() {
        return entityManager.createNamedQuery("XXXXXX", PrefectureArea.class).getResultList();
    }
}
```

上記の`XXX`に適切な文字を入れてみましょう。  

以上で、`PrefectureArea`エンティティは完成です！  

### 3-3. 都道府県エリアの情報を元の都道府県情報に追加しよう

ここでは、サンプルアプリケーションに元々実装されていた都道府県情報に都道府県エリアの情報を追加します。  
`Prefecture.java`を開きます。

```java
    @JsonIgnore
    private PrefectureArea prefectureArea;

    private String area;
```

フィールドに上記を追加します。  
これは、元々の都道府県情報にエリア情報を追加するための定義です。  
まずは、Entityとして`PrefectureArea`を定義します。  
これは、`Prefecture`に対して`PrefectureArea`への依存関係を定義するためです。  
[3. サンプルアプリケーションを拡張してみよう](#3サンプルアプリケーションを拡張してみよう)で示した通り、`Prefecture`情報は以下の3カラムがありますが、

* 都道府県ID
* 都道府県名
* 都道府県エリア(ID)  

`都道府県エリア(ID)`の情報を取得しても、実際にどのエリアなのかは判断できないため、今回は`setPrefectureArea()`メソッドを利用して`都道府県エリア名`を設定できるようにします。  
だたし、今回は`PrefectureArea`は`Prefecture`情報のレスポンスとしては含めたくない(含めたいのは`都道府県エリア名`のみ)なので、`@JsonIgnore`アノテーションを付与します。  
これは、レスポンス時のJSONに含めたくない(マッピングさせたくない)フィールドに対して定義するアノテーションです。  

次に、追加したフィールドへのgetter/setterを定義します。

```java
    @ManyToOne
    public PrefectureArea getPrefectureArea() {
        return prefectureArea;
    }

    public void setPrefectureArea(PrefectureArea prefectureArea) {
        this.prefectureArea = prefectureArea;
        this.area = prefectureArea.getArea();
    }

    @Transient
    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }
```

`getPrefectureArea`メソッドに付与している`@ManyToOne`アノテーションは、リレーション関係を示します。
今回は、`PrefectureArea`に登録されているエリアのみが`Prefecture`のエリアとして存在できるようにします。
つまりは、`Prefecture`に対して`PrefectureArea`への外部キー制約をつけます。
今回は、一つの都道府県エリア情報に対して複数の都道府県が紐づくことになるので、`Prefecture:PrefectureArea=多:1`となり、`@ManyToOne`を利用しています。  

次に、`getArea`メソッドに付与している`@Transient`というアノテーションは、永続化対象から外す意味を示しています。
`都道府県エリア名`は、`Prefecture`情報として永続化する必要はない(`Prefecture`テーブルのカラムとして存在しない)ためです。

上記で追加した実装について必要なimport文を追加します。

```java
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
```

最後に、都道府県エリアについては、本手順の冒頭の説明で、都道府県エリア(ID)ではなく、都道府県エリア名を設定できるようにするということを説明しました。  
そのため、都道府県を登録する際には`都道府県エリア名`を利用しますが、データベースに登録する際には都道府県エリア情報(`PrefectureArea`エンティティ)を作成する必要があります。  
その処理を実装します。

PrefectureResource.javaを開き、`createPrefecture`メソッドに以下を以下のように改修します。

```java
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional(Transactional.TxType.REQUIRED)
    public void createPrefecture(Prefecture prefecture) {
        try {
            PrefectureArea prefectureArea = entityManager.createNamedQuery("getPrefectureAreaByArea", PrefectureArea.class)
                    .setParameter("area", prefecture.getArea()).getSingleResult();
            prefecture.setPrefectureArea(prefectureArea);
            entityManager.persist(prefecture);
        } catch (Exception e) {
            throw new BadRequestException("Unable to create prefecture with ID " + prefecture.getId());
        }
    }
```
追加された部分は、try/cacthブロック内の最初の2行です。  
1行目で、POSTされた`都道府県エリア名`をもとに都道府県エリア情報(`PrefectureArea`エンティティ)を取得しています。  
続いて2行目で、1行目で取得した都道府県エリア情報(`PrefectureArea`エンティティ)を`Prefecture`エンティティにセットしています。  
これで、`都道府県エリア名`をもとに都道府県エリア情報(`PrefectureArea`エンティティ)を作成する処理が実装できました。

以上で、都道府県エリア情報を元の都道府県情報へ追加できました！

### 3-4. persistence.xmlを変更しよう

次にJPAの設定を追加します。  
ここまでで、`PrefectureArea`というEntityを作成してきたので、このEntityをJPAの管理下に含めます。 
`persistence.xml`を開いて、以下の部分を追記します。  
今回は、`PrefectureArea`エンティティを追加します。

```
    <jta-data-source>test</jta-data-source>
    <class>com.example.handson.helidon.Prefecture</class>
    <class>XXXXXXX</class>
```

上記の`XXX`に適切な文字を入れてみましょう。  

これで、`persistence.xml`の設定は完了です！

### 3-5. DDLを編集しよう

最後にDDLを拡張した内容に合わせて編集します。

```sql
INSERT INTO PREFECTUREAREA VALUES (1, '北海道');
INSERT INTO PREFECTUREAREA VALUES (2, '東北');
INSERT INTO PREFECTUREAREA VALUES (3, '南関東');
INSERT INTO PREFECTUREAREA VALUES (4, '北関東・甲信');
INSERT INTO PREFECTUREAREA VALUES (5, '北陸');
INSERT INTO PREFECTUREAREA VALUES (6, '東海');
INSERT INTO PREFECTUREAREA VALUES (7, '近畿');
INSERT INTO PREFECTUREAREA VALUES (8, '中国');
INSERT INTO PREFECTUREAREA VALUES (9, '四国');
INSERT INTO PREFECTUREAREA VALUES (10, '九州');

INSERT INTO PREFECTURE VALUES (1, '北海道', 1);
INSERT INTO PREFECTURE VALUES (2, '青森', 2);
INSERT INTO PREFECTURE VALUES (3, '岩手', 2);
INSERT INTO PREFECTURE VALUES (4, '宮城', 2);
INSERT INTO PREFECTURE VALUES (5, '秋田', 2);
INSERT INTO PREFECTURE VALUES (6, '山形', 2);
INSERT INTO PREFECTURE VALUES (7, '福島', 2);
INSERT INTO PREFECTURE VALUES (8, '茨城', 4);
INSERT INTO PREFECTURE VALUES (9, '栃木', 4);
INSERT INTO PREFECTURE VALUES (10, '群馬', 4);
INSERT INTO PREFECTURE VALUES (11, '埼玉', 3);
INSERT INTO PREFECTURE VALUES (12, '千葉', 3);
INSERT INTO PREFECTURE VALUES (13, '東京', 3);
INSERT INTO PREFECTURE VALUES (14, '神奈川', 3);
INSERT INTO PREFECTURE VALUES (15, '新潟', 5);
INSERT INTO PREFECTURE VALUES (16, '富山', 5);
INSERT INTO PREFECTURE VALUES (17, '石川', 5);
INSERT INTO PREFECTURE VALUES (18, '福井', 5);
INSERT INTO PREFECTURE VALUES (19, '山梨', 4);
INSERT INTO PREFECTURE VALUES (20, '長野', 4);
INSERT INTO PREFECTURE VALUES (21, '岐阜', 6);
INSERT INTO PREFECTURE VALUES (22, '静岡', 6);
INSERT INTO PREFECTURE VALUES (23, '愛知', 6);
INSERT INTO PREFECTURE VALUES (24, '三重', 6);
INSERT INTO PREFECTURE VALUES (25, '滋賀', 7);
INSERT INTO PREFECTURE VALUES (26, '京都', 7);
INSERT INTO PREFECTURE VALUES (27, '大阪', 7);
INSERT INTO PREFECTURE VALUES (28, '兵庫', 7);
INSERT INTO PREFECTURE VALUES (29, '奈良', 7);
INSERT INTO PREFECTURE VALUES (30, '和歌山', 7);
INSERT INTO PREFECTURE VALUES (31, '鳥取', 8);
INSERT INTO PREFECTURE VALUES (32, '島根', 8);
INSERT INTO PREFECTURE VALUES (33, '岡山', 8);
INSERT INTO PREFECTURE VALUES (34, '広島', 8);
INSERT INTO PREFECTURE VALUES (35, '山口', 8);
INSERT INTO PREFECTURE VALUES (36, '徳島', 9);
INSERT INTO PREFECTURE VALUES (37, '香川', 9);
INSERT INTO PREFECTURE VALUES (38, '愛媛', 9);
INSERT INTO PREFECTURE VALUES (39, '高知', 9);
INSERT INTO PREFECTURE VALUES (40, '福岡', 10);
INSERT INTO PREFECTURE VALUES (41, '佐賀', 10);
INSERT INTO PREFECTURE VALUES (42, '長崎', 10);
INSERT INTO PREFECTURE VALUES (43, '熊本', 10);
INSERT INTO PREFECTURE VALUES (44, '大分', 10);
INSERT INTO PREFECTURE VALUES (45, '宮崎', 10);
INSERT INTO PREFECTURE VALUES (46, '鹿児島', 10);
INSERT INTO PREFECTURE VALUES (47, '沖縄', 10);
```

元々のサンプルアプリケーションでは、以下のようなDDLになっていましたが、

```sql
INSERT INTO PREFECTURE VALUES (1, '北海道');
INSERT INTO PREFECTURE VALUES (2, '青森');
INSERT INTO PREFECTURE VALUES (3, '岩手');
・
・
・
```

今回の拡張により、`PREFECTURE`テーブルに`都道府県エリアID`カラムが追加され、`PREFECTUREAREA`テーブルが新たに追加されます。  

これで、DDLの編集は完了です！

ここまでのサンプルアプリケーションの完成形は以下に配置しています。  
必要があれば、`git clone`してください。

```sh
git clone https://github.com/oracle-japan/helidon-handson-complete.git
```

### 3-6. 拡張したサンプルアプリケーションを動かしてみよう

それでは、拡張したサンプルアプリケーションを動かしてみましょう。  
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

targetディレクトリが生成され、その直下に`helidon-handson.jar`が作成されています。

それでは、jarファイルを起動してみましょう。  
実行場所はプロジェクト直下とします。  

```sh
java -jar target/helidon-handson.jar 
```

まずは、都道府県エリア情報を取得してみます。

```sh
curl http://localhost:8080/area
```

このような結果が返却されれば成功です。

 ```sh
[{"id":1, "area":"北海道"},{"id":2, "area":"東北"},{"id":3, "area":"南関東"}....]
 ```

次に、全都道府県情報を取得してみましょう。

```sh
curl http://localhost:8080/prefecture
```

このような結果が返却されれば成功です。

 ```sh
[{"id":1, "area":"北海道", "name":"北海道"},{"id":2, "area":"東北", "name":"青森"}....]
 ```

次にID(主キー)指定で検索します。

```sh
curl http://localhost:8080/prefecture/1
```

このように結果が返却されます。

```sh
{"id":1, "area":"北海道", "name":"北海道"}
```

次に都道府県名指定で検索します。  
以下は北海道をGETするURLで、`%E5%8C%97%E6%B5%B7%E9%81%93`は北海道をURLエンコードした文字列です。

```sh
curl http://localhost:8080/prefecture/name/%E5%8C%97%E6%B5%B7%E9%81%93
```

このように結果が返却されます。

```sh
{"id":1, "area":"北海道", "name":"北海道"}
```

次に北海道のデータを削除してみます。

```sh
curl -X DELETE http://localhost:8080/prefecture/1
```

削除されたことを確認してみましょう

```sh
curl -i -X GET http://localhost:8080/prefecture/1
```

以下のような結果が返却されます。

```sh
HTTP/1.1 404 Not Found
Content-Type: text/plain
Date: Wed, 28 Apr 2021 17:56:25 +0900
transfer-encoding: chunked
connection: keep-alive

No handler found for path: /prefecture/1
```

これは、`/prefecture/1`というリソースが存在しないことを示します。  

最後に北海道のデータを再登録します。  
POSTするデータは[2-5. サンプルアプリケーションの動作を確認しよう](#2-5-サンプルアプリケーションの動作を確認しよう)の時とは異なります。  

```sh
curl -H "Content-Type: application/json" -X POST --data '{"id":1, "area":"北海道", "name":"北海道"}' http://localhost:8080/prefecture 
```

再登録されたことを確認しましょう。

```sh
curl http://localhost:8080/prefecture/1
```

ちゃんと再登録されていますね。

```sh
{"id":1, "area":"北海道", "name":"北海道"}
```

以上で、サンプルアプリケーションの動作確認は完了です！  

まとめ
-----
いかがでしたでしょうか。  

このようにHelidonでは、簡単にRESTfulアプリケーション、そしてデータベースとの接続を実現することができます。  
他にもさまざまな機能やインタフェースが実装されているので、ぜひいろいろ触って遊んでみてください！！
