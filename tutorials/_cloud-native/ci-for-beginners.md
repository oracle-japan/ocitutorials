---
title: "OCI Container Instances をプロビジョニングしよう"
excerpt: "Oracle Cloud Infrastructure (OCI) の管理コンソールを利用し、Container InstancesにWordPressをインストールします。まずはここから始めましょう。"
layout: single
order: "014"
tags:
---

OCI Container Instances は、コンテナ用に最適化されたサーバレス・コンピューティングでアプリケーションを実行できます。OCIの管理コンソールからコンピュートシェイプ、リソース割り当て、ネットワーク構成をプロビジョニングして、複数のコンテナをローンチできます。Kubernetes をはじめとするコンテナ・オーケストレーション・プラットフォームを必要としないコンテナベースのワークロードに適したサービスです。

OCI Container Instances上でWordPress環境を構築して、実際にアプリケーションを動かす流れを体験します。

前提条件
--------
- クラウド環境
    * Oracle Cloudのアカウントを取得済みであること

ハンズオン環境のイメージ
----------
![](001.png)

1.OCI Container Instancesのプロビジョニング
-----------------------------------
ここでは、OCI Container Instancesのプロビジョニングを行います。

ハンバーガーメニューをクリックします。

![](002.png)

`開発者サービス`-`コンテナ・インスタンス`を選択します。

![](003.png)

`Create container instance`ボタンをクリックします。

![](004.png)

以下画像赤枠の箇所を変更します。それ以外はデフォルト値です。

- 「Name」：container-instance-wordpress

![](005.png)

Networkingの下にある`Show advanced options`をクリックします。
「Container restart policy」を以下の設定にします。

- 「Container restart policy」：always

![](006.png)

`次`ボタンをクリックします。

![](007.png)

WordPress のデータベースを構成する MySQL イメージを設定します。最初に、`Name オプション`を`db`と入力します。そして、`Select image`ボタンをクリックします。

- 「Name オプション」：db

![](008.png)

`External registry`タブを選択して、以下の設定を行います。

- 「Registry hostname」：docker.io
- 「Repository」：mysql
- 「Tag オプション」：8.0.23

タブですが、`OCI Container Registry`は、OCI のコンテナレジストリ（OCIR）に格納されているイメージを設定できます。`External registry`は、パブリックサービスなどのコンテナレジストリを設定できます。
ここでは、 Docker Hub にある MySQL の公式コンテナイメージを使用します。

![](009.png)

`Select image`ボタンをクリックします。

![](010.png)

以下の環境変数を設定します。WordPress 用のデータベース設定です。最初に、「+ Another variable」ボタンを3回クリックして、その後設定値を入力します。

- 「MYSQL_ROOT_PASSWORD」：somewordpress
- 「MYSQL_DATABASE」：wordpress
- 「MYSQL_USER」：wordpress
- 「MYSQL_PASSWORD」：wordpress

次に`Show advanced options`テキストをクリックします。

![](011.png)

`Resources`タブでは、コンテナで消費されるリソース量を指定できます。ここでは、デフォルト値とします。次に`Startup options`タブを選択します。

![](012.png)

MySQL 8.04 以降、caching_sha2_password プラグインを利用した認証方式がデフォルトとなりました。ここでは、従来の認証方式のプラグイン mysql_native_password に変更します。

- 「Command arguments」： \-\-default-authentication-plugin=mysql_native_password

※defaultの前はハイフン2個です。

![](013.png)

`+ Another container` ボタンをクリックします。

![](014.png)

次は、wordpress アプリケーションのコンテナイメージの設定を行います。`Name オプション`を`app`と入力します。そして、`Select image`ボタンをクリックします。

- 「Name オプション」：app

![](015.png)

`External registry`タブを選択して、以下の設定を行います。WordPress は latest のコンテナイメージを利用するため、タグの指定はしません。

- 「Registry hostname」：docker.io
- 「Repository」：wordpress

`Select image`ボタンをクリックします。

![](016.png)

以下の環境変数を設定します。WordPress アプリケーションが MySQL に接続するために必要な設定です。最初に、`+ Another variable`ボタンを3回クリックして、その後設定値を入力します。

- 「WORDPRESS_DB_HOST」：127.0.0.1
- 「WORDPRESS_DB_USER」：wordpress
- 「WORDPRESS_DB_PASSWORD」：wordpress
- 「WORDPRESS_DB_NAME」：wordpress

![](017.png)

`次`ボタンをクリックします。

![](018.png)

設定内容を確認します。

![](019.png)

`Create`ボタンをクリックします。

![](020.png)

設定した app と db のコンテナが作成されます。

![](021.png)


2.Netowrk Security Groupの作成
-----------------------------------

デフォルトでは、80ポートを使用したWebアクセスが許可されていないので、ネットワーク・セキュリティ・グループを作成して、ブラウザからアクセスできるように設定します。

ハンバーガーメニューをクリックします。

![](022.png)

`ネットワーキング`-`仮想クラウド・ネットワーク`を選択します。

![](023.png)

対象の VCN を選択します。

![](024.png)

左にあるリソースメニューから`ネットワーク・セキュリティ・グループ`を選択します。

![](025.png)

`ネットワーク・セキュリティ・グループの作成`ボタンをクリックします。

![](026.png)

以下の設定を行います。

- 「名前」：container-instances

![](027.png)

`Next`ボタンをクリックします。

![](028.png)

以下の設定を行います。

- 「ソース・タイプ」：CIDR
- 「ソースCIDR」：0.0.0.0/0
- 「IPプロトコル」：TCP
- 「ソース・ポート範囲」：All
- 「宛先ポート範囲」：80

![](029.png)

`作成`ボタンをクリックします。

![](030.png)

設定されたことを確認します。

![](031.png)

作成したコンテナ・インスタンスに、このネットワーク・セキュリティ・グループを適用します。

ハンバーガーメニューをクリックします。

![](032.png)

`開発者サービス`-`コンテナ・インスタンス`を選択します。

![](033.png)

対象のコンテナ・インスタンスを選択します。

![](034.png)

`Edit`リンクテキストをクリックします。

![](035.png)

作成したネットワーク・セキュリティ・グループ`container-instances`を選択して、`Save changes`ボタンをクリックします。

![](036.png)

`Public IP address`の`コピー`リンクテキストをクリックします。

![](037.png)

ブラウザを起動してコピーしたパブリックIPアドレスにアクセスして、WordPress 初期セットアップ画面が表示されることを確認します。

![](038.png)

3.WordPressのセットアップ
-----------------------------------

`日本語`を選択して、`次へ`ボタンをクリックします。

![](039.png)

任意の情報を設定して、「WordPress をインストール」ボタンをクリックします。

- サイトのタイトル: Container Instances
- ユーザ名: wordpress
- パスワード: Or@cleCI123@
- メールアドレス: test@test.oracle.com

![](040.png)

`ログイン`ボタンをクリックします。

![](041.png)

設定した、ユーザー名とパスワードを入力して、`ログイン`ボタンをクリックします。

![](042.png)

以下の画面が表示されれば完了です。

![](043.png)

再度パブリックIPアドレスにブラウザでアクセスすると、デフォルトのブログ画面が表示されます。

![](044.png)