---
title: "Oracle Container Engine for Kubernetes(OKE)でKubernetesを動かしてみよう"
excerpt: "Oracle Container Engine for Kubernetes(OKE)は、Oracle Cloud Infrastructure(OCI)上で提供されるマネージドKubernetsサービスです。こちらのハンズオンでは、Kubernetes自体の特徴や使い方を含めて、OKEを触って頂けるコンテンツになっています。"
layout: single
order: "020"
tags:
---

Oracle Container Engine for Kubernetes（以下OKE）は、OracleのマネージドKubernetesサービスです。  
このハンズオンでは、OKEにサンプルアプリケーションをデプロイするプロセスを通して、Kubernetesそのものの基本的な操作方法や特徴を学ぶことができます。  

このカテゴリには以下のサービスが含まれます。

- Oracle Container Engine for Kubernetes (OKE):
:   フルマネージドなKuberentesクラスターを提供するクラウドサービスです。
- Oracle Cloud Infrastructure Registry (OCIR):
:   フルマネージドなDocker v2標準対応のコンテナレジストリを提供するサービスです。

前提条件
--------

- クラウド環境
    * Oracle Cloudのアカウントを取得済みであること
    * [OKEハンズオン事前準備](/ocitutorials/cloud-native/oke-for-commons/)を実施済みであること

1.コンテナイメージの作成
---------------------------------
ここでは、サンプルアプリケーションが動作するコンテナイメージを作成します。

### 1.1. ソースコードをCloneする

今回利用するサンプルアプリケーションは、oracle-japanのGitHubアカウント配下のリポジトリとして作成してあります。

[サンプルアプリケーションのリポジトリ](https://github.com/oracle-japan/cowweb-for-wercker-demo)にアクセスして、`Code`ボタンをクリックします。

ソースコードを取得する方法は2つあります。一つはgitのクライアントでCloneする方法、もう一つはZIPファイル形式でダウンロードする方法です。ここでは前者の手順を行いますので、展開した吹き出し型のダイアログで、URLの文字列の右側にあるクリップボード型のアイコンをクリックします。

これにより、クリップボードにURLがコピーされます。

![](2.3.PNG)

Cloud ShellまたはLinuxのコンソールから、以下のコマンドを実行してソースコードをCloneします。

    git clone [コピーしたリポジトリのURL]

続いて、Cloneしてできたディレクトリをカレントディレクトリにしておきます。

    cd cowweb-for-wercker-demo

### 1.2. コンテナイメージを作る
コンテナイメージは、Dockerfileと呼ばれるコンテナの構成を記述したファイルによって、その内容が定義されます。

サンプルアプリケーションのコードには作成済みのDockerfileが含まれていますので、その内容を確認してみます。以下のコマンドを実行してください。

    cat Dockerfile

```dockerfile
# 1st stage, build the app
FROM maven:3.8.4-openjdk-17-slim as build

WORKDIR /helidon

# Create a first layer to cache the "Maven World" in the local repository.
# Incremental docker builds will always resume after that, unless you update
# the pom
ADD pom.xml .
RUN mvn package -Dmaven.test.skip -Declipselink.weave.skip

# Do the Maven build!
# Incremental docker builds will resume here when you change sources
ADD src src
RUN mvn package -DskipTests

RUN echo "done!"

# 2nd stage, build the runtime image
FROM openjdk:17-jdk-slim
WORKDIR /helidon

# Copy the binary built in the 1st stage
COPY --from=build /helidon/target/cowweb-helidon.jar ./
COPY --from=build /helidon/target/libs ./libs

CMD ["java", "-jar", "cowweb-helidon.jar"]

EXPOSE 8080
```

Dockerfileの内容を見ると、FROMで始まる行が2つあることがわかります。最初のFROMから始まる数行は、jdkがインストールされたコンテナイメージ内にサンプルアプリケーションのコードをコピーし、さらに`mvn package`を実行してアプリをビルドしています。

次のFROMから続く一連の処理は、jdkがインストールされたコンテナイメージを基に、アプリの実行ユーザーの作成、ビルドしてできたjarファイルのコピー、コンテナ起動時に実行するコマンドの設定などを行っています。

それではこのDockerfileを使ってコンテナイメージを作成します。以下のコマンドを実行してください。

    docker image build -t [リポジトリ名]/cowweb:v1.0 .

このコマンドにおいて`リポジトリ名`には任意の文字列を指定できますが、通常はプロジェクト名やユーザー名などを小文字にしたものを指定します。例えば、以下のようなコマンドになります。

    docker image build -t oke-handson/cowweb:v1.0 .

以下のように、`Successfully tagged`のメッセージで処理が終了していれば、イメージのビルドは完了です。

```
Sending build context to Docker daemon  128.5kB
Step 1/13 : FROM maven:3.8.4-openjdk-17-slim as build
Trying to pull repository docker.io/library/maven ... 
3.8.4-openjdk-17-slim: Pulling from docker.io/library/maven
f7a1c6dad281: Pull complete 
ea8366d5a4a5: Pull complete 
bff4abe573cd: Pull complete 
3f92e41bef06: Pull complete 
6581ea1ec5a5: Pull complete 
de879b0c951f: Pull complete 
ac1236d673e3: Pull complete 
Digest: sha256:150deb7b386bad685dcf0c781b9b9023a25896087b637c069a50c8019cab86f8
Status: Downloaded newer image for maven:3.8.4-openjdk-17-slim
 ---> 849a2a2d4242
Step 2/13 : WORKDIR /helidon
 ---> Running in 503337c170c7
Removing intermediate container 503337c170c7
 ---> e456a937870a
Step 3/13 : ADD pom.xml .
 ---> fadb77529253
Step 4/13 : RUN mvn package -Dmaven.test.skip -Declipselink.weave.skip
 ---> Running in 190344b19870

...（中略）...

Step 9/13 : WORKDIR /helidon
 ---> Running in ede9941ef284
Removing intermediate container ede9941ef284
 ---> ed9214bcc7e8
Step 10/13 : COPY --from=build /helidon/target/cowweb-helidon.jar ./
 ---> 72e6abc15a88
Step 11/13 : COPY --from=build /helidon/target/libs ./libs
 ---> 039c2d539641
Step 12/13 : CMD ["java", "-jar", "cowweb-helidon.jar"]
 ---> Running in b579e0845ce9
Removing intermediate container b579e0845ce9
 ---> 9344c0c557ac
Step 13/13 : EXPOSE 8080
 ---> Running in d19e9f20932b
Removing intermediate container d19e9f20932b
 ---> 5e997bb463db
Successfully built 5e997bb463db
Successfully tagged oke-handson/cowweb:v1.0
```

実際にビルドされたイメージは、`docker image ls`コマンドで確認することができます。

    docker image ls

```
REPOSITORY           TAG                     IMAGE ID            CREATED             SIZE
oke-handson/cowweb   v1.0                    a328bfaffb52        4 minutes ago       428MB
<none>               <none>                  042346419526        5 minutes ago       505MB
openjdk              17-jdk-slim             37cb44321d04        4 months ago        408MB
maven                3.8.4-openjdk-17-slim   849a2a2d4242        5 months ago        425MB
```

`oke-handson/cowweb`の名前のイメージが作成されていることがわかります。

アプリケーションのコンテナイメージは、ソースコードのビルドにはmavenがインストールされたコンテナを利用し、アプリケーションの実行環境にはopenjdkがインストールされたコンテナを利用しています。このため、mavenやopenjdkといった名前のついたイメージも表示されます。

これらのコンテナは、アプリケーションのコンテナイメージの作成時に、自動的にダウンロードされて利用されています。

2.OCIRへのプッシュとOKEへのデプロイ
-------------------------------------

### 2.1. OCIRを利用するための事前準備
OCIRはOracleが提供するコンテナレジストリのマネージドサービスです。ここでは、1.3.で作成したコンテナイメージをOCIRにプッシュ（アップロード）します。

OCIRにdockerコマンドからアクセスするため、OCIのユーザーアカウントに必要な設定をしていきます。

OCIコンソール画面右上の人型のアイコンをクリックし、展開したプロファイルからユーザ名(oracleidentitycloudservice/<ユーザ名>)をクリックします。

![](3.2-1.png)

下にスクロールした左側にある`認証トークン`をクリックして、トークンの作成画面に遷移します。

![](3.3.png)

`トークンの生成`ボタンをクリックします。
    
![](3.4.png)

[Geterate Token]ダイアログで、トークンの用途を説明する情報（任意の文字列）を入力し、`トークンの生成`ボタンをクリックします。

![](3.5.png)
    
ダイアログに生成したトークンが表示されます。`Copy`という文字列をクリックするとクリップボードにこのトークンがコピーされます。そして`閉じる`をクリックします。

![](3.6.png)

このトークンはあとの手順で利用するため、テキストエディタ等にペーストするなどして控えておいてください。

### 2.2. OCIRにリポジトリを作成

OCIRにビルドしたコンテナイメージを格納するリポジトリを作成します。  
ハンバーガーメニューから、「開発者サービス」-「コンテナ・レジストリ」を選択します。

![](2.2-1.png)

左メニューにあるコンパートメントのプルダウンメニューから対象のコンパートメントを選択します。

![](2.2-2.png)

「リポジトリの作成」ボタンをクリックします。

![](2.2-3.png)

以下の設定を行い、「リポジトリの作成」ボタンをクリックします。

 - コンパートメント：対象のコンパートメント
 - リポジトリ名：oke-handson/cowweb
 - アクセス：パブリック

**リポジトリ名について**  
OCIRのリポジトリ名はテナンシで一意になります。  
集合ハンズオンなど複数人で同一環境を共有されている皆様は、`oke-handson-01/cowweb`や`oke-handson-tn/cowweb`などの名前のイニシャルを付与し、名前が重複しないようにしてください。
{: .notice--warning}

![](2.2-4.png)

リストに作成したリポジトリがあることを確認します。

![](2.2-5.png)

### 2.3. OCIRにコンテナイメージをプッシュする
それでは、コンテナイメージをOCIRにプッシュします。

まず、`docker login`コマンドでOCIRにログインします。ログイン先のレジストリを指定するにあたり、ホストされているデータセンターリージョンに合わせて適切なリージョンコードを指定する必要があります。

ご自身の環境に合わせて、下表から適切なリージョンコードを見つけてください。

リージョン|リージョンコード
-|-
ap-tokyo-1|nrt
ap-osaka-1|kix
ap-melbourne-1|mel
us-ashburn-1|iad
us-phoenix-1|phx
ap-mumbai-1|bom
ap-seoul-1|icn
ap-sydney-1|syd
ca-toronto-1|yyz
ca-montreal-1|yul
eu-frankfurt-1|fra
eu-zurich-1|zrh
sa-saopaulo-1|gru
uk-london-1|lhr
sa-santiago-1|scl
ap-hyderabad-1|hyd
eu-amsterdam-1|ams
me-jeddah-1|jed
ap-chuncheon-1|yny
me-dubai-1|dxb
uk-cardiff-1|cwl
us-sanjose-1|sjc

次に、OCIRにログインするためにオブジェクト・ストレージ・ネームスペースを確認します。

オブジェクト・ストレージ・ネームスペースは、OCIコンソール画面右上の人型のアイコンをクリックし、展開したプロファイルからテナンシ:<テナンシ名>から確認します。


![](3.6-0.png)

テナンシ情報のオブジェクト・ストレージ設定からオブジェクト・ストレージ・ネームスペースの値を確認します。OCIRへのアクセスする際に使用するため、値をテキストファイルにコピー＆ペーストするなどして控えておいてください。

![](3.6-1.png)

**オブジェクト・ストレージ・ネームスペースについて**  
オブジェクト・ストレージ・ネームスペースはテナントに対し1つ割り当てられます。リージョン内のすべてのコンパートメントにまたがり使用されます。任意の文字列が設定され、変更することはできません。
{: .notice--info}

次に、以下のコマンドでOCIRにログインします。

    docker login [リージョンコード].ocir.io

例えば、東京リージョン(nrt)をご利用の場合は、以下のコマンドでログインします。

    docker login nrt.ocir.io

ユーザー名、パスワードの入力を求めるメッセージが表示されますので、以下のように入力してください。

- ユーザー名: [オブジェクト・ストレージ・ネームスペース]/[ユーザー名] （例: nrzftilbveen/oracleidentitycloudservice/yoi.naka.0106@gmail.com）
- パスワード: [2.1.で作成したトークン文字列]

**パスワードについて**  
ここで入力するパスワードはOCIコンソールにログインする際のパスワードとは異なるのでご注意ください
{: .notice--warning}

以下のように`Login Succeeded`というメッセージが表示されれば、ログイン成功です。

```
Username: nrzftilbveen/Handson-001
Password:
Login Succeeded
```

続いて、OCIRの形式に合わせてコンテナイメージのタグを更新します。`docker tag`コマンドを実行してくさい。

    docker image tag [リポジトリ名]/cowweb:v1.0 [リージョンコード].ocir.io/オブジェクト・ストレージ・ネームスペース]/[リポジトリ名]/cowweb:v1.0

[リージョンコード]と[オブジェクト・ストレージ・ネームスペース]は、これまでの手順で指定したものと同じものを指定します。リポジトリ名には`docker build`のときにしてしたものと同じ文字列を指定してください。

例えば、以下のように指定します。

    docker image tag oke-handson/cowweb:v1.0 nrt.ocir.io/nrzftilbveen/oke-handson/cowweb:v1.0

この操作によって、コンテナイメージにプッシュ先のレジストリを指定する情報を追加しています。これを行わない場合、コンテナイメージはデフォルトのレジストリが指定されたものとみなされ、Docker社が提供するDocker Hubというレジストリが利用されてしまいます。

これで準備が整いましたので、実際にOCIRにイメージをプッシュします。以下のコマンドを実行してください。

    docker image push [リージョンコード].ocir.io/[オブジェクト・ストレージ・ネームスペース]/[リポジトリ名]/cowweb:v1.0

例えば、以下のように指定します。

    docker image push nrt.ocir.io/nrzftilbveen/oke-handson/cowweb:v1.0

以下のような実行結果となれば、プッシュが成功しています。

```
The push refers to repository [nrt.ocir.io/nrzftilbveen/oke-handson/cowweb]
d07a2053e8fb: Pushed
93ed7a751af8: Pushed
20dd87a4c2ab: Pushed
78075328e0da: Pushed
9f8566ee5135: Pushed
v1.0: digest: sha256:5769c194f3861f71c9fd43eb763813676aaba0b41acf453fb6a09a1af7525c82 size: 1367
```

{% capture notice %}**docker push時の挙動**  
集合ハンズオンなどで、コンテナレジストリを複数のユーザーで共有している場合、以下のようなメッセージとなることがあります。
```sh
60dc38cb0cd5: Layer already exists
ea75a4331573: Layer already exists
20dd87a4c2ab: Layer already exists
…
```
これは既にレジストリに存在するものと同じ内容をアップロードしたときに表示されるものですので、手順をそのまま続行して問題ありません。{% endcapture %}
<div class="notice--warning">
  {{ notice | markdownify }}
</div>

それでは、OCIRにコンテナが保存されていることを確認してみましょう。OCIコンソールの画面で左上のメニューを展開し、`開発者サービス`－`コンテナ・レジストリ`をクリックします。

![](3.7.png)

リポジトリの一覧が表示されます。この中に、指定した名前のコンテナがあることを確認してください。

![](3.8-2.png)

これでレジストリへのコンテナイメージの格納は完了しました。
以上で、OCIRへのコンテナイメージの格納は完了です。

### 2.4. OKEへのデプロイ
それでは、いよいよOKEクラスターにアプリケーションのコンテナをデプロイします。

OKEを始めとして、Kubernetesのクラスターにコンテナをデプロイするには、クラスター上の配置情報をmanifestと呼ばれるファイルに記述しておく必要があります。

サンプルアプリケーションのコードには作成済みのmanifestファイルが含まれていますので、その内容を確認してみます。以下のコマンドを実行してください。

```
cat ./kubernetes/cowweb.yaml
```
```sh
kind: Deployment
apiVersion: apps/v1
metadata:
  name: cowweb
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cowweb
  template:
    metadata:
      labels:
        app: cowweb
        version: v1
    spec:
      containers:
        - name: cowweb
          image: ${region-code}.ocir.io/${tenancy}/${repository}/cowweb:v1.0
          imagePullPolicy: IfNotPresent
          ports:
            - name: api
              containerPort: 8080
    ...（以下略）...
```

このファイルによって、サンプルアプリケーションのコンテナが、クラスター上にどのように配置されるかが定義されています。例えば、6行目にある`replicas:2`という記述は、このコンテナが、2つ立ち上げられて冗長構成を取るということを意味しています。

**サンプルアプリについて**  
実際にKubernetes上でコンテナが動作する際には、Podと言われる管理単位に内包される形で実行されます。上記のmanifestでは、サンプルアプリのコンテナを内包するPodが、2つデプロイされることになります。
{: .notice--info}

22行目には、実際にクラスター上で動かすコンテナイメージが指定されています。現在の記述内容は、ご自身環境に合わせた記述にはなっていませんので、この部分を正しい値に修正してください。具体的には、2.2.で`docker image push`コマンドを実行する際に指定した文字列と同じ内容に修正してください。

    [リージョンコード].ocir.io/[オブジェクト・ストレージ・ネームスペース]/[リポジトリ名]/cowweb:v1.0

例えば、以下のような文字列となります。

    nrt.ocir.io/nrzftilbveen/oke-handson/cowweb:v1.0

次に、cowweb-service.yamlというmanifestファイルの内容を確認してみます。

```
cat ./kubernetes/cowweb-service.yaml
```
```sh
kind: Service
apiVersion: v1
metadata:
  name: cowweb
  labels:
    app: cowweb
  annotations:
    oci.oraclecloud.com/load-balancer-type: "lb"
    service.beta.kubernetes.io/oci-load-balancer-shape: "flexible"
    service.beta.kubernetes.io/oci-load-balancer-shape-flex-min: "10"
    service.beta.kubernetes.io/oci-load-balancer-shape-flex-max: "30"
spec:
  type: LoadBalancer
  selector:
    app: cowweb
  ports:
    - port: 80
      targetPort: 8080
      name: http
```

このmanifestファイルは、クラスターに対するリクエストのトラフィックを受け付ける際のルールを定義しています。`type: LoadBalancer`という記述は、クラスターがホストされているクラウドサービスのロードバランサーを自動プロビジョニングし、そのLBに来たトラフィックをコンテナに届けるという意味です。

それでは、Kubernetes上でサンプルアプリケーションのコンテナを動かしてみます。まずは、クラスターを区画に分けて管理するための領域である、namespaceを作成します。以下のコマンドで、namespace名は任意の文字列を指定できます。  
今回は"handson"というnamespace名で作成します。

    kubectl create namespace handson

デフォルトのNamespaceを上記で作成したものに変更しておきます。これを行うと、以降、kubectlの実行の度にNamespaceを指定する必要がなくなります。

    kubectl config set-context $(kubectl config current-context) --namespace=handson

次に、manifestファイルをクラスターに適用し、PodやServiceをクラスター内に作成します。

```
kubectl apply -f ./kubernetes/cowweb.yaml
```
```
kubectl apply -f ./kubernetes/cowweb-service.yaml
```

以下のコマンドを実行して、リソースの構成が完了しているかどうかを確認することができます。

    kubectl get pod,service

すべてのPodのSTATUSがRunnigであることと、cowwebという名前のServiceがあることが確認できれば、リソースの作成は完了です（ServiceのEXTERNAL-IPは、ロードバランサーが実際に作成されるまで表示されません。その場合は少し時間を置いて上記コマンドを再実行してください）。

```
NAME                          READY   STATUS    RESTARTS   AGE
pod/cowweb-695c65b665-sgcdk   1/1     Running   0          17s
pod/cowweb-695c65b665-vh825   1/1     Running   0          17s

NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP       PORT(S)        AGE
service/cowweb       LoadBalancer   10.96.229.191   130.***.***.***   80:30975/TCP   1m
```

{% capture notice %}**集合ハンズオン時のロードバランサーのシェイプについて**  
集合ハンズオンなどで、一つのクラウド環境を複数のユーザーで共有している場合、利用可能なロードバランサー数の上限に達して正常にServiceが作成できない場合があります。  
そのような場合は、ロードバランサーのシェイプ（対応可能なトラフィック量）を変更して、サービスの作成を行ってみてください。
具体的には以下のコマンドを実行します。
```sh
# 作ってしまったServiceを削除
kubectl delete -f ./kubernetes/cowweb-service.yaml
```
これは既にレジストリに存在するものと同じ内容をアップロードしたときに表示されるものですので、手順をそのまま続行して問題ありません。{% endcapture %}
<div class="notice--warning">
  {{ notice | markdownify }}
</div>

**サンプルアプリについて**  
実際にKubernetes上でコンテナが動作する際には、Podと言われる管理単位に内包される形で実行されます。上記のmanifestでは、サンプルアプリのコンテナを内包するPodが、2つデプロイされることになります。
{: .notice--info}

上の例では、IPアドレス130.***.***.***の80番ポートでロードバランサーが公開されておりここにリクエストを送信すると、アプリケーションにアクセスできることを意味しています。このIPアドレスをテキストエディタ等に控えておいてください。

これでクラスターへのデプロイは完了しましたので、実際に動作確認してみます。以下のコマンドを実行してください。

    curl "http://[ロードバランサーのIP]/cowsay/say"

ローカルで動作確認したときと同様、以下のようなアスキーアートが表示されれば、アプリケーションが正常に動作しています。
 
```
 ______
< Moo! >
 ------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||--WWW |
                ||     ||
```

おめでとうございます。これで、OKEクラスターで実際にアプリケーションを動かすことができました！

3.Kubernetes上のオブジェクトの確認
------------------------------
ここからは、先ほどデプロイしたサンプルアプリケーションを利用してKubernetes上のオブジェクトを確認しながら、Kubernetesの基本的な特徴をみていきます。  
まずは、Depoymentからです。 

### 3.1. Deploymentオブジェクトの確認
Deploymentは、Podのレプリカ数（冗長構成でのPodの数）や、Podが内包するコンテナの指定など、動作させたいコンテナに関連する構成情報を定義するオブジェクトです。  
ここまでの手順で、Deploymentオブジェクトをクラスター上に作成済みであり、その事によって、サンプルアプリケーションがクラスタで動作しています。

では、Deploymentオブジェクトの情報を確認してみましょう。クラスターに存在するDeploymentの一覧を取得するには以下のコマンドを実行します。

```
kubectl get deployments
```
```
NAME     READY   UP-TO-DATE   AVAILABLE   AGE
cowweb   2/2     2            2           3m53s
```

先に作成したcowwebという名前のDeploymentがあることがわかります。DESISRED, CURRENTなどの値が2となっているのは、2つのPodを動かすように指定しており、その指定通りにPodが可動していることを表しています。

このDeploymentの情報をもっと詳しく調べるには、以下のコマンドを実行します。

```
kubectl describe deployments/cowweb
```
```
Name:               cowweb
Namespace:          handson-030
CreationTimestamp:  Thu, 31 Jan 2019 17:34:44 +0000
Labels:             <none>
Annotations:        deployment.kubernetes.io/revision: 1
...（中略）...
NewReplicaSet:   cowweb-57885b669c (2/2 replicas created
Events:
  Type    Reason             Age   From                   Messag
  ----    ------             ----  ----                   ------
  Normal  ScalingReplicaSet  23m   deployment-controller  Scaled up replica set cowweb-57885b669c to 2
```

このDeploymentに関する様々な情報が表示されますが、特によく参照するのは、最後のEvents以下に表示される内容です。

これは、このPodにまつわって発生した過去のイベントが記録されているもので、Podが正常に起動しなかったときなど、特にトラブルシュートの場面で手がかりとなる情報を得るのに役立ちます。

### 3.2. Podの標準出力の表示
ここからは、Podオブジェクトについてみていきます。  
まず、Podの情報を標準出力を表示するなどして確認してみます。  
Kubernetes上で動作するアプリケーションの動作状況を確認する上で最もシンプルな方法は、Podの標準出力確認することです。Podの標準出力を表示するには、以下のコマンドを実行します。

    kubectl logs [Pod名]

ここで指定するPod名は、Podの一覧を表示して表示される2つのPodのうちのどちらかを指定してください。

```
kubectl get pods
```
```
NAME                      READY   STATUS    RESTARTS   AGE
cowweb-57885b669c-9dzg4   1/1     Running   0          43m
cowweb-57885b669c-r7l4g   1/1     Running   0          43m
```

この場合、例えば以下のようなコマンドとなります。

```
kubectl logs cowweb-57885b669c-9dzg4
```
```
...（中略）...
2022.08.25 05:09:44 INFO com.oracle.jp.cowweb.CowsayResource Thread[helidon-server-1,5,server]: I'm working...

2022.08.25 05:09:44 INFO com.oracle.jp.cowweb.CowsayResource Thread[helidon-server-2,5,server]: I'm working...

2022.08.25 05:09:49 INFO com.oracle.jp.cowweb.CowsayResource Thread[helidon-server-3,5,server]: I'm working...

2022.08.25 05:09:49 INFO com.oracle.jp.cowweb.CowsayResource Thread[helidon-server-4,5,server]: I'm working...

2022.08.25 05:09:54 INFO com.oracle.jp.cowweb.CowsayResource Thread[helidon-server-1,5,server]: I'm working...
```

これが、Podの標準出力の内容を表示した結果です。Kubernetesはクラスター内で動作するコンテナに対して、定期的に死活確認を行っています。このサンプルアプリケーションでは、死活監視のリクエストが来たときに上記のようなログを出力するように実装してあります。

{% capture notice %}**コンテナアプリケーションの死活監視について**  
コンテナの死活監視の機能はlivenessProbeと呼ばれます。  
死活確認の手段としては、以下の3通りの方法がサポートされています。

1) 特定のエンドポイントにHTTP GETリクエストを送信する  
2) 所定のコマンドを実行する  
3) TCP Socketのコネクションの生成を行う  

また、Podの起動時にも、コンテナの起動状態をチェックするために同様の確認が行われます。  
サポートされるチェックの手段はlivenessProbeと同じですが、こちらはreadinessProbeと呼ばれます。{% endcapture %}
<div class="notice--info">
  {{ notice | markdownify }}
</div>

#### 3.2.1. Podの環境変数の確認
Podに設定されている環境変数を確認するには、Pod内にアクセスして``env``コマンドを実行する必要があります。

まず、Pod内から任意のコマンドを実行するには``kubectl exec``コマンドを用います。

    kubectl exec [Pod名] -- [実行したいコマンド]

[実行したいコマンド]に``env``を当てはめて実行すると、指定したPod内でそれが呼び出され、環境変数を出力することができます。

    kubectl exec [Pod名] -- env

``kubectl exec``を利用すると、Podのシェルに入ることも可能です。

    kubectl exec -it [Pod名] -- /bin/sh

**`kubectl exec`コマンドについて**  
``kubectl exec``を利用すると、任意のコンテナをクラスター内に立ち上げて、そのコンテナのシェルを利用することができます。このテクニックはトラブルシューティングの場面で有用です。
例えば、クラスターで動作するアプリに期待通りにアクセス出来ないような状況において、クラスター内からcurlを実行して疎通確認を行うことで、問題の切り分けに役立てるといったことが可能です。
{: .notice--info}

4.アプリケーションのスケーリング
---------------------------------
ここでは、Deploymentに対してレプリカの数を指定することによって、Podのスケールアウト/インを試してみます。

### 4.1. スケールアウト
Deploymentに対してレプリカの数を指定することによって、そのDeploymentが管理するPodの数を増減することができます。

レプリカの数を変更するには、``kubectl scale``コマンドを使用します。以下のように実行することで、cowwebのPodを管理するDeploymentに対して、レプリカ数を4にするよう指示します。

    kubectl scale deployments/cowweb --replicas=4

Podの一覧を表示してみます。

    kubectl get pods

すると、4つのPodが構成されていることがわかります。

    NAME                      READY   STATUS    RESTARTS   AGE
    cowweb-57885b669c-4h5l4   0/1     Running   0          7s
    cowweb-57885b669c-9dzg4   1/1     Running   0          1h
    cowweb-57885b669c-hxvpz   0/1     Running   0          7s
    cowweb-57885b669c-r7l4g   1/1     Running   0          1h

上の例では、一部のPodは起動中の状態です。少し時間が経過すると全てのPodのSTATUSがRunningになります。

### 4.2. Serviceによるルーティングの様子の確認
この時点で、クラスターには4つのcowwebのPodがデプロイされている状態です。この状態で、Podに対するアクセスが負荷分散される様子を確認してみましょう。

cowwebには、環境変数の変数名を指定することで、その値を答えてくれる仕掛けがしてあります。これを利用してPodのホスト名を応答させることで、負荷分散の動きを見てみます。

動作確認で実行したcurlコマンドのURLに``?say=HOSTNAME``というクエリを追加して、以下のようなコマンドを実行してみてください。

    curl "http://[ロードバランサーのIP]/cowsay/say?say=HOSTNAME"

このコマンドを何度か繰り返すと、その度に異なるホスト名が返ってくることがわかります。

```
 _________________________
< cowweb-57885b669c-r7l4g >
 -------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
```
 _________________________
< cowweb-57885b669c-hxvpz >
 -------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

### 4.3. スケールイン
Pod数を縮小することも当然ながら可能です。スケールアウトで行ったように、``kubectl scale``コマンドでレプリカ数を指定して減らすことが可能です。

他の方法として、Deploymentのmanifestファイルで現在より少ないreplica数を記述しておき、そのmanifestをクラスターに適用することで同様のことが可能になります。

最初にサンプルアプリケーションをデプロイしたときに利用したmanifestファイルには、レプリカ数に2を指定してありますので、これを適用することで4->2にスケールインしてみます。

    kubectl apply -f ./kubernetes/cowweb.yaml

Podの一覧を表示すると、2個に減っていることがわかります。

```
kubectl get pods
```
```
NAME                      READY   STATUS    RESTARTS   AGE
cowweb-57885b669c-9dzg4   1/1     Running   0          1h
cowweb-57885b669c-r7l4g   1/1     Running   0          1h
```

**スケールイン/アウトについて**  
現実の場面では、スケールアウト・インのような運用操作は、全てmanifestを編集してそれを適用するオペレーションとすることをおすすめします。manifestをソースコード管理システムで管理することによって、クラスターの構成変更をコードとして追跡可能になるためです。
{: .notice--info}

5.Podの自動復旧
-----------------
Kubernetesには、障害が発生してPodがダウンしたときに、自動的に新たなPodを立ち上げ直す機能が備わっています。

Podを削除することによって障害に相当する状況を作り、自動復旧される様子を確認してみましょう。

Podを削除するには、以下のコマンドを実行します。

    kubectl delete [Pod名]

例えばこのようなコマンドとなります（実際のPod名は、``kubectl get pods``コマンドで確認してください）。

    kubectl delete pod cowweb-57885b669c-9dzg4

この後すぐにPodの一覧を表示すると、削除したPodのPod名はなく、新しい名前のPodが起動していることがわかります。

```
NAME                      READY   STATUS    RESTARTS   AGE
cowweb-57885b669c-5mgrb   0/1     Running   0          7s    <- 新たに起動したPod
cowweb-57885b669c-r7l4g   1/1     Running   0          1h
```

DeploymentオブジェクトによってPod数を2個に指定されています。Podが削除されて1つになると、Kubernnetesは指定された数との差分を検知して自動的にPodを立ち上げてくれます。


以上で本チュートリアルは終了です。
