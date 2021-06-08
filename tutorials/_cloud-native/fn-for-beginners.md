---
title: "Fn Project ハンズオン"
excerpt: "Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。このハンズオンでは、Fn Projectの環境構築から動作確認までの手順を記します。"
order: "040"
tags:
---
Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。  
このハンズオンでは、Fn Projectの環境構築から動作確認までの手順を記します。
 
前提条件
----------------------

- クラウド環境
    * 有効なOracle Cloudアカウントがあること
    * [OCIチュートリアル その2 - クラウドに仮想ネットワーク(VCN)を作る](/ocitutorials/beginners/creating-vcn/) を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること
    * [OCIチュートリアル その3 - インスタンスを作成する](/ocitutorials/beginners/creating-compute-instance/) を通じてコンピュートインスタンスの構築が完了していること

1.Fn Project実行環境の構築
---------------------------------------------------
ここでは、前提条件のハンズオンで作成したコンピュートインスタンス上に、Fn Projectを実行するための環境構築を行います。  
前提条件のハンズオンで作成したコンピュートインスタンス上に任意のターミナルソフトでSSHログインします。  

### 1-1. Dockerのインストール

ログインしたら、以下のコマンドを実行します。

```
sudo yum install -y yum-utils
```
```
sudo yum -y update
```

yumレポジトリをセットアップします。  

    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

Dockerパッケージをインストールします。

    sudo yum install -y docker-ce docker-ce-cli containerd.io

これでDockerのインストールは完了です。  

以下のコマンドでDocker Daemonを起動します。

    sudo systemctl start docker

以下のコマンドで動作確認してみます。

    sudo docker container run hello-world

以下のように表示されれば、問題なく起動できています。

    Hello from Docker!
    This message shows that your installation appears to be working correctly.

    To generate this message, Docker took the following steps:
    1. The Docker client contacted the Docker daemon.
    2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
        (amd64)
    3. The Docker daemon created a new container from that image which runs the
        executable that produces the output you are currently reading.
    4. The Docker daemon streamed that output to the Docker client, which sent it
        to your terminal.

    To try something more ambitious, you can run an Ubuntu container with:
    $ docker run -it ubuntu bash

    Share images, automate workflows, and more with a free Docker ID:
    https://hub.docker.com/

    For more examples and ideas, visit:
    https://docs.docker.com/get-started/

Dockerは、rootユーザで利用することが奨励されていないので、opcユーザで利用できるように以下のコマンドを実行します。

    sudo usermod -aG docker opc

上記コマンドを実行したら`exit`コマンドでコンピュートインスタンスからログアウトし、ログインし直します。

再ログイン後に、opcユーザでDockerを利用できるかどうかを以下のコマンドで確認します。

    docker container run hello-world

先ほど実行した`sudo docker container run hello-world`の結果と同様になれば成功です。

### 1-2. Fn CLIとFn Serverのインストール

ここでは、Fn Projectを動作させるためにFn ServerとFn Clientをインストールします。  
本ハンズオンでは、それぞれのバージョンを以下とします。

  * Fn CLI：0.6.6
  * Fn Server：0.3.749

#### 1-2-1. Fn CLIのインストール

まず、Fn CLIのインストールを行います。  

    curl -LSs https://raw.githubusercontent.com/fnproject/cli/master/install | sh

インストールに成功すると以下のように表示されます。

    fn version 0.6.6

            ______
        / ____/___
        / /_  / __ \
        / __/ / / / /
        /_/   /_/ /_/`

これで、Fn CLIのインストールは完了です。

#### 1-2-2. Fn Serverのインストール

次にFn Serverのインストールを行います。
Fn Serverのコンテナイメージをpullするために以下のコマンドを実行します。

    docker image pull fnproject/fnserver

先ほどpullしたコンテナイメージを確認するために以下のコマンドを実行します。

    docker image ls

以下のように、"fnproject/fnserver"というイメージが表示されていれば、Fn Serverのコンテナイメージをpullできています。

    REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
    fnproject/fnserver   latest              2ea3b8195f21        17 months ago       162MB

Fn Serverを起動するために以下のコマンドを実行します。

    fn start

以下のように表示されれば成功です。  

    time="2021-06-01T02:07:24Z" level=info msg="Setting log level to" fields.level=info
    time="2021-06-01T02:07:24Z" level=info msg="Registering data store provider 'sql'"
    time="2021-06-01T02:07:24Z" level=info msg="Connecting to DB" url="sqlite3:///app/data/fn.db"
    time="2021-06-01T02:07:24Z" level=info msg="datastore dialed" datastore=sqlite3 max_idle_connections=256 url="sqlite3:///app/data/fn.db"
    time="2021-06-01T02:07:24Z" level=info msg="agent starting cfg={MinDockerVersion:17.10.0-ce ContainerLabelTag: DockerNetworks: DockerLoadFile: DisableUnprivilegedContainers:false FreezeIdle:50ms HotPoll:200ms HotLauncherTimeout:1h0m0s HotPullTimeout:10m0s HotStartTimeout:5s DetachedHeadRoom:6m0s MaxResponseSize:0 MaxHdrResponseSize:0 MaxLogSize:1048576 MaxTotalCPU:0 MaxTotalMemory:0 MaxFsSize:0 MaxPIDs:50 MaxOpenFiles:0xc420392d38 MaxLockedMemory:0xc420392d50 MaxPendingSignals:0xc420392d58 MaxMessageQueue:0xc420392d60 PreForkPoolSize:0 PreForkImage:busybox PreForkCmd:tail -f /dev/null PreForkUseOnce:0 PreForkNetworks: EnableNBResourceTracker:false MaxTmpFsInodes:0 DisableReadOnlyRootFs:false DisableDebugUserLogs:false IOFSEnableTmpfs:false EnableFDKDebugInfo:false IOFSAgentPath:/iofs IOFSMountRoot:/home/takuya_nii/.fn/iofs IOFSOpts: ImageCleanMaxSize:0 ImageCleanExemptTags: ImageEnableVolume:false}"
    time="2021-06-01T02:07:24Z" level=info msg="no docker auths from config files found (this is fine)" error="open /root/.dockercfg: no such file or directory"
    time="2021-06-01T02:07:24Z" level=info msg="available memory" cgroup_limit=9223372036854771712 head_room=695449190 total_memory=6954491904
    time="2021-06-01T02:07:24Z" level=info msg="ram reservations" avail_memory=6259042714
    time="2021-06-01T02:07:24Z" level=info msg="available cpu" avail_cpu=2000 total_cpu=2000
    time="2021-06-01T02:07:24Z" level=info msg="cpu reservations" cpu=2000
    time="2021-06-01T02:07:24Z" level=info msg="\n        ______\n       / ____/___\n      / /_  / __ \\\n     / __/ / / / /\n    /_/   /_/ /_/\n"
    time="2021-06-01T02:07:24Z" level=info msg="Fn serving on `:8080`" type=full version=0.3.749

これでFn Serverが起動したので、このままにしておきます。  
以上で、Fn Project実行環境の構築は終わりです。


3.Fnの作成と実行
---------------------------------------------------
ここでは、Fn Projectで動作するFnを作成し、実際に動かしてみます。  
[1.Fn Project実行環境の構築](#1fn-project実行環境の構築)で利用したターミナルセッションとは別に、前提条件のハンズオンで作成したコンピュートインスタンス上に任意のターミナルソフトでSSHログインします。  

### 3-1. Fnの作成

`fn init`コマンドを使用してFnのひな形を作成します。今回は、以下のコマンドを実行します。

    fn init --runtime java javafn

ここではFnをJavaで記述しますので、`--runtime java`というオプションを指定しています。

ひな形の作成が成功すると以下のように表示されます。

    Creating function at: ./javafn
    Function boilerplate generated.
    func.yaml created.

この時点で、"Hello World"と返すだけのシンプルなFnの作成が完了しています。

{% capture notice %}**`fn init`コマンド**  
fn initコマンドはFnのひな形を生成するコマンドです。主要なオプションは以下のとおりです。
```
- --runtime: 
    * 使用する言語を指定します。Java, Go, Node(JavaScript)などから選択することが可能です。
```
その他コマンドの詳細については、[Fn CLIのリファレンス](https://github.com/fnproject/docs/blob/master/cli/ref/fn-init.md)を参照ください。{% endcapture %}
<div class="notice--info">
  {{ notice | markdownify }}
</div>

作成したディレクトリに移動します。

    cd javafn

"javafn"ディレクトリ配下は以下のような構成になっています。

    ├── func.yaml
    ├── pom.xml
    └── src
        ├── main
        │   └── java
        │       └── com
        │           └── example
        │               └── fn
        │                   └── HelloFunction.java
        └── test
            └── java
                └── com
                    └── example
                        └── fn
                            └── HelloFunctionTest.java
    11 directories, 4 files

- ディレクトリ配下の各項目の説明
    * func.yaml - Fnを動作させる際の様々な定義を記載した設定ファイル。具体的な設定値は以降の手順で説明。
    * pom.xml - Fnをビルドする際の定義を記載した設定ファイル。(Java以外の場合はその言語に合わせたビルド設定ファイルが生成される)
    * src - Fnのソースコードとテストケース。

func.yamlを確認してみます。  

    schema_version: 20180708
    name: javafn
    version: 0.0.1
    runtime: java
    build_image: fnproject/fn-java-fdk-build:jdk11-1.0.130
    run_image: fnproject/fn-java-fdk:jre11-1.0.130
    cmd: com.example.fn.HelloFunction::handleRequest

- func.yamlの各項目の説明
    * schema_version - このFnファイルのスキーマのバージョン
    * runtime - このFnで使用する言語
    * build_image - このFnイメージをビルドするためのイメージ
    * cmd - このFnクラスの完全修飾名とこのFnの関数が呼び出されたときに呼び出されるメソッド名

以上で、Fnの作成は完了です。

### 3-2. Fnの実行

作成したプロジェクトをFn Serverにデプロイするためには、`Application`と呼ばれる区画を予め作成しておく必要があります。  
`Application`は複数のプロジェクトをFnを内包する管理単位です。

以下のように、fn create appコマンドを実行して`Application`を作成します。

    fn create app hello-app

次に、`fn deploy`コマンドを使用してFnをデプロイします。

    fn --verbose deploy --app hello-app --local

以下のように表示されることを確認します。(しばらく時間がかかります)

    Deploying javafn to app: hello-app
    Bumped to version 0.0.2
    Building image javafn:0.0.2
    FN_REGISTRY:  FN_REGISTRY is not set.
    Current Context:  default
    Sending build context to Docker daemon  14.34kB
    Step 1/11 : FROM fnproject/fn-java-fdk-build:jdk11-1.0.98 as build-stage
    ---> d490a89232cf
    Step 2/11 : WORKDIR /function
    ---> Using cache
    ---> 931e8c2e85d5
    (中略)
    Step 11/11 : CMD ["com.example.fn.HelloFunction::handleRequest"]
    ---> Using cache
    ---> 5970d6bcd334
    Successfully built 5970d6bcd334
    Successfully tagged javafn:0.0.2

    Updating function javafn using image javafn:0.0.2...
    Successfully created function: javafn with javafn:0.0.2

{% capture notice %}**`fn deploy`コマンド**  
`fn deploy`コマンドはFnをFn Serverにデプロイするコマンドです。主要なオプションは以下のとおりです。
```
- --verbose:
    * デプロイ時に詳細なログメッセージを出力します。
- --app:
    * functionをデプロイするapplicationを指定します。
- --local:
    * functionをコンテナレジストリにPushせず、直接Fn Serverにデプロイします（Fn ProjectではfunctionはすべてDockerコンテナとして動作します）。
```
その他コマンドの詳細については、[Fn CLIのリファレンス](https://github.com/fnproject/docs/blob/master/cli/ref/fn-deploy.md)を参照ください。{% endcapture %}
<div class="notice--info">
  {{ notice | markdownify }}
</div>

`fn invoke`コマンドを実行し、Fnを実行します。  
引数は[Application名] [Fn名]の順に指定します。

    fn invoke hello-app javafn

以下のように表示されたら成功です。

    Hello, World!

以上で、Fn Projectのハンズオンは終了です。  
Fn Projectの開発者エクスペリエンスをご体感頂けたでしょうか。
