var store = [{
        "title": "準備 - Oracle Cloud 無料トライアルを申し込む",
        "excerpt":"Oracle Cloud のほとんどのサービスが利用できるトライアル環境を取得することができます。このチュートリアルの内容を試すのに必要になりますので、まずは取得してみましょう。 ※認証のためにSMSが受け取れる電話とクレジット・カードが必要です(希望しない限り課金はされませんのでご安心を!!)      Oracle Cloud 無料トライアル サインアップガイド   Oracle Cloud Free Tierに関するFAQ  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/acquiring-free-trial/",
        "teaser": null
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス・リミット、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. サポートされるブラウザの確認 このチュートリアルでは、Oracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 2. ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナント名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID ユーザー名 - ログインのためのユーザー名 パスワード - ログインのためのパスワード ログイン情報の入手方法は、ユーザーが作られるタイミングによって異なります。 テナントの最初のユーザーの場合 テナントの最初の管理者ユーザーに対しては、テナントが作成された際にシステムから通知メールが送付されています。...","categories": [],
        "tags": ["beginner","network"],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/getting-started/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/getting-started/img2.png"
      },{
        "title": "その2 - クラウドに仮想ネットワーク(VCN)を作る",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure を利用するにあたっての最初のステップは、仮想クラウド・ネットワーク(Virtual Cloud Network : VCN) を作成することです。ネットワークの管理者が最初に仮想ネットワークを作ることで、その後インスタンスの管理者やストレージの管理者が、作成した仮想ネットワークの構成やルールに従ってコンポーネントを配置することができるようになります。 このチュートリアルでは、コンソール画面から仮想クラウド・ネットワーク(VCN)を1つ作成し、その構成について確認してくことで、OCIのネットワークに対する理解を深めます。 所要時間 : 約15分 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること その1 - OCIコンソールにアクセスして基本を理解するを完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. 仮想クラウドネットワーク(VCN)とは? 2. 仮想クラウド・ネットワークの作成 3. 作成した仮想クラウド・ネットワークの確認 1. 仮想クラウドネットワーク(VCN)とは? 仮想クラウド・ネットワークの作成は、基本的にはオンプレミスでよく利用されるネットワークの各コンポーネントの仮想バージョンをクラウド上で構築していくようなものをイメージしていただくとわかりやすいと思います。 仮想クラウド・ネットワークは以下のようなコンポーネントから構成されます。 サブネット - 仮想ネットワークを構成するIPv4のサブネット...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn/img4.png"
      },{
        "title": "その3 - インスタンスを作成する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル この章では、作成済みの仮想クラウド・ネットワーク(VCN)の中にコンピュート・インスタンスを作成していきます。 所要時間 : 約20分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. 新規仮想マシンインスタンスの作成 2. 作成したインスタンス詳細情報の確認 3. インスタンスへの接続 1. 新規仮想マシンインスタンスの作成 第2章で作成した仮想コンピュート・ネットワーク(VCN)に、新しくインスタンスを作成していきます。 今回はコンソールから、一番小さなシェイプ(1 OCPU)の仮想マシン(VM)タイプの Oracle Linux 7 のインスタンスを1つ作成します。 コンソールメニューから コンピュート → インスタンス を選択し、インスタンスの作成 ボタンを押します 立ち上がった ”コンピュート・インスタンスの作成” ウィンドウに 以下の項目を入力し、作成 ボタンを押下します...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/img11.png"
      },{
        "title": "その4 - ブロック・ボリュームをインスタンスにアタッチする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure ブロック・ボリューム・サービスを利用することにより、ベアメタル・インスタンスや仮想マシン・インスタンスからブロックデバイスとして利用することができるボリュームを、簡単に作成、管理することができます。用途に応じたサイズのボリュームを作成、インスタンスへのアタッチ、変更などが可能です。インスタンスからボリュームに対するアクセスは iSCSI もしくは準仮想化を通じて行われます。 インスタンスにアタッチしたボリュームは、通常のディスク・ドライブと同じようにOSから利用することができ、またインスタンスからデタッチし、新しい別のインスタンスにアタッチすることで、データを失うことなく移行することが可能です。 ブロック・ボリュームの典型的なユースケースとしては以下のようなものがあります。 インスタンスのストレージの拡張 : Oracle Cloud Infrastructure の ベアメタル・インスタンス、仮想マシン・インスタンスいずれに対しても、ブロック・ボリュームをアタッチすることでOSのストレージ領域を拡張することができます。 永続化されたストレージ領域の利用 : インスタンスを終了(Terminate)しても、ブロック・ボリュームとそこに格納されたデータは永続します。これらはボリュームを明示的に終了(Terminate)するまで存続します。 インスタンス間のデータの移動 : インスタンスにアタッチしたブロック・ボリュームをデタッチし、別のインスタンスにアタッチすることにより、1つのインスタンスから別のインスタンスにデータを簡単に移動させることができます。 このチュートリアルでは、ブロック・ボリュームの基本的な使い方をご案内します。 ブロック・ボリュームのバックアップについては応用編のブロック・ボリュームをバックアップする をどうぞ。 所要時間 : 約20分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る とその3 - インスタンスを作成する を完了し、仮想クラウド・ネットワーク(VCN)の中に任意のLinuxインスタンスの作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次：...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/attaching-block-volume/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/attaching-block-volume/img6.png"
      },{
        "title": "その5 - インスタンスのライフサイクルを管理する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル リソースを必要なときに必要なだけ使える、というのがクラウドのいいところですね。そのために作成したインスタンスはいつでも停止、再起動、終了、再作成といった処理が行えるようになっています。このチュートリアルでは、そのようなインスタンスのライフサイクル管理をどう行うかと、それぞれのステータスで実際にインスタンスがどのような状態になっているのかについて確認していきます。 所要時間 : 約20分 前提条件 : その3 - インスタンスを作成する を通じてコンピュート・インスタンスの作成が完了していること その4 - ブロック・ボリュームをインスタンスにアタッチする を通じてブロック・ボリュームのアタッチが完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります インスタンスの停止、再起動 インスタンスの終了(Terminate) ブート・ボリュームからのインスタンスの再作成 1. インスタンスの停止、再起動 まずは、インスタンスの停止、再起動処理と、その際に実行される動作について確認していきましょう。 1-1. ブートボリュームへのファイルの作成 OCIのインスタンスは、すべてブート・ボリュームと呼ばれる永続化されたiSCSIデバイスからネットワーク経由でブート(iPXEブート)されます。 このブート・ボリュームの変更(OSのパラメーター変更など)が、インスタンスのライフサイクル操作によってどのような影響を受けるかを確認するために、予めファイルを1つ作成します。 SSHターミナルを開き、 で作成したインスタンスにsshでアクセスします アクセスしたユーザーホームディレクトリに、任意のファイルを作成します。 下記の例では、opcユーザーのホームディレクトリ(/home/opc)に、testfileというファイルを作成しています [opc@testvm1 ~]$ pwd /home/opc [opc@testvm1 ~]$ touch testfile [opc@testvm1...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/managing-instance-lifecycle/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/managing-instance-lifecycle/img_header.png"
      },{
        "title": "その6 - ファイルストレージサービス(FSS)で共有ネットワークボリュームを利用する",
        "excerpt":"ブロックボリュームはとても便利なサービスですが、残念ながら複数のインスタンスから同時に使える共有ストレージとして使うには、ユーザー自身で共有ファイルシステムを構築する必要があります。しかし共有のストレージボリュームを使いたい場合にも、Oracle Cloud Infrastructure（OCI）にはファイル・ストレージ・サービス(FSS)という便利な NFSv3 対応の共有ストレージ・ボリュームのマネージド・サービスがあります。このチュートリアルでは、FSS を利用して複数のインスタンスから利用できる共有ボリュームを利用する方法について確認していきます。 所要時間 : 約20分 前提条件 : インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を通じてコンピュート・インスタンスの作成が完了していること ブロック・ボリュームをインスタンスにアタッチする - Oracle Cloud Infrastructureを使ってみよう(その4) を通じてブロック・ボリュームのアタッチが完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. ファイルシステムの作成 まずは、OCIのコンソールからファイル・システム・サービスのメニューから共有ファイルシステムを作成します。コンソールからファイルシステムを作成すると、コンピュート・インスタンスからアクセスするマウント・ターゲットも同時に作成されます。マウント・ターゲットを作成すると、後から複数のファイルシステムをそこに紐づけることができます。APIやコマンドライン・インタフェース(CLI)を利用した場合は、ファイルシステムとマウント・ターゲットを個別に作成することができます。 コンソールメニューから ファイル・ストレージ → ファイル・システム を選択します 適切なリージョンとコンパートメントを選んでいることを確認したら、 ファイル・システムの作成 ボタンを押します 立ち上がってきた ファイル・システムの作成 ウィンドウの ファイル・システム情報 フィールドにある 詳細の編集 を押して以下の項目を編集します 名前 -...","categories": [],
        "tags": ["beginner","network"],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/using-file-storage/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/using-file-storage/image-20210118132254521.png"
      },{
        "title": "その7 - オブジェクト・ストレージを使う",
        "excerpt":"チュートリアル一覧に戻る : 入門編 - Oracle Cloud Infrastructure を使ってみよう Oracle Cloud Infrastructureオブジェクト・ストレージ・サービスは、高い信頼性と高い費用対効果を両立するスケーラブルなクラウドストレージです。 オブジェクト・ストレージを利用すると、分析用のビッグ・データや、イメージやビデオ等のリッチ・メディア・コンテンツなど、あらゆるコンテンツ・タイプの非構造化データを無制限に保管できます。 オブジェクト・ストレージはリージョン単位のサービスで、コンピュート・インスタンスからは独立して動作します。 ユーザーはオブジェクト・ストレージのエンドポイントに対し、OCIの内部、外部を問わずどこからでもアクセスすることができます。 OCIのIdentity and Access Management(IAM)機能をを利用した適切なアクセスコントロールや、リソース・リミットを設定することも可能です。 この章では、コンソール画面からオブジェクト・ストレージにアクセスし、スタンダード・バケットの作成やオブジェクトのアップロード、ダウンロードなどの基本的な操作、また事前認証リクエストを作成して一般ユーザー向けにダウンロードリンクを生成する手順について学習します。 所要時間 : 15分 前提条件 : 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切なオブジェクト・ストレージの管理権限がユーザーに付与されていること 注意 : チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 1. コンソール画面の確認とバケットの作成 オブジェクト・ストレージ・サービスにおいて、バケットはオブジェクトを格納する箱として機能します。 バケットはコンパートメントに紐付ける必要があり、バケットおよびその中のオブジェクトに対する操作に関する権限は、コンパートメントのポリシーを通じて制御します。 まず、コンソール画面からバケットを作成していきます。 コンソールメニューから ストレージ → オブジェクト・ストレージ を選択し、バケットの作成 ボタンを押します 立ち上がった バケットの作成 ウィンドウに以下の項目を入力し、バケットの作成 ボタンを押します。指定がないものは任意の値でOKです。 バケット名 - 任意の文字列 (画面では TutorialBucket...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/object-storage/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/object-storage/001.webp"
      },{
        "title": "その8 - クラウドでOracle Databaseを使う",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/using-oracle-database/",
        "teaser": null
      },{
        "title": "その9 - クラウドでMySQL Databaseを使う",
        "excerpt":"Oracle Cloud Infrastructure では、MySQL Database Service(MDS)が利用できます。MDSはAlways Freeの対象ではないため、使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。 このチュートリアルでは、コンソール画面からMDSのサービスを1つ作成し、コンピュート・インスタンスにMySQLクライアント、MySQL Shellをインストールして、クライアントからMDSへ接続する手順を説明します。 所要時間 : 約25分 (約15分の待ち時間含む) 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)を完了していること クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2)を完了していること インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)を完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. MySQL Database Service(MDS)とは? 2. MDSの作成 3....","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/creating-mds/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/creating-mds/MySQLLogo_teaser.png"
      },{
        "title": "その10 - MySQLで高速分析を体験する",
        "excerpt":"Oracle Cloud Infrastructure(OCI) では、HeatWaveというデータ分析処理を高速化できるMySQL Database Services(MDS)専用のクエリー・アクセラレーターが使用できます。HeatWaveもMDSと同じく、Always Freeの対象ではないため使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。 このチュートリアルでは、コンソール画面からHeatWaveを構成し、MySQLクライアントからサンプルデータベースを構成してHeatWaveを利用する手順を説明します。 所要時間 : 約40分 (約25分の待ち時間含む) 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)を完了していること クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2)を完了していること インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)を完了していること クラウドでMySQL Databaseを使う(その9)を完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. HeatWaveとは? 2. HeatWave構成時の注意事項 3. HeatWaveの構成(HeatWave用MDSの構成)...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/creating-HeatWave/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/creating-mds/MySQLLogo_teaser.png"
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)でKubernetesを始めてみよう",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/oke-for-beginners/",
        "teaser": null
      },{
        "title": "KubernetesでサンプルアプリケーションのデプロイとCI/CDを体験してみよう",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/oke-for-intermediates/",
        "teaser": null
      },{
        "title": "Oracle Functions ハンズオン",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。   ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/functions-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Cloud Infrastructure API Gateway ハンズオン",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/apigw-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Cloud Infrastructure Data Science Service ハンズオン",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/datascience-beginners/",
        "teaser": null
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス・リミット、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. サポートされるブラウザの確認 このチュートリアルでは、Oracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 2. ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナント名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID ユーザー名 - ログインのためのユーザー名 パスワード - ログインのためのパスワード ログイン情報の入手方法は、ユーザーが作られるタイミングによって異なります。 テナントの最初のユーザーの場合 テナントの最初の管理者ユーザーに対しては、テナントが作成された際にシステムから通知メールが送付されています。...","categories": [],
        "tags": ["beginner","network"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/getting-started/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/getting-started/img2.png"
      },{
        "title": "クラウドでOracle Exadata を使う",
        "excerpt":" ","categories": [],
        "tags": ["https://community.oracle.com/docs/DOC-1038411"],
        "url": "https://oracle-japan.github.io/ocitutorials/enterprise/using-oracle-exadata/",
        "teaser": null
      },{
        "title": "モニタリング機能でOCIのリソースを監視する",
        "excerpt":"システムを運用する際にはアプリケーションやシステムの状態に異常がないかを監視して問題がある場合には対処をすることでシステムの性能や可用性を高めることが可能です。 OCIで提供されているモニタリング機能を使うことで、OCI上の各種リソースの性能や状態の監視、また、カスタムのメトリック監視を行うことが可能です。また、アラームで事前定義した条件に合致した際には管理者に通知を行うことで管理者はタイムリーに適切な対処を行うことができます。 コンピュートやブロックボリュームなどのOCIリソースに対してはモニタリングはデフォルトで有効になっています。 この章では、コンピュート・インスタンスを対象にして性能メトリックの参照の方法を理解し、問題が発生した場合のアラーム通知設定を行って管理者へのメール通知を行います。 所要時間 : 約30分 前提条件 : インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を通じてコンピュート・インスタンスの作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. ベースになるインスタンスの作成 まずは、監視対象となるインスタンスを作成します。今回は、インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) で作成したコンピュート・インスタンスを使用します。 ただし、Oracle提供イメージを使い、モニタリングの有効化を行っているインスタンスのみが対象です。（デフォルトは有効） インスタンス作成時にモニタリングを有効化するには、作成画面下部の 拡張オプションの表示 をクリックしてオプションを表示させ、モニタリングの有効化 のチェックボックスにチェックが入っていることを確認してください。 2. モニタリング・メトリックの参照（各リソースの詳細画面からの参照） 作成済みのコンピュート・インスタンスの詳細ページから、メトリックを参照することができます。 コンソールメニューから コンピュート → インスタンス を選択し、作成したインスタンスのインスタンス名のリンクをクリックするか、右側の ・・・ メニューから インスタンスの詳細の表示 を選択し、インスタンス詳細画面を開きます。 画面左下の リソース から...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/monitoring-resources/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/monitoring-resources/image-20210112132107310.png"
      },{
        "title": "ロードバランサーでWebサーバーを負荷分散する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure ロードバランサー・サービスを利用することにより、仮想クラウド・ネットワーク(VCN)内の複数のサーバーに対して一つのエントリーポイントからのネットワーク・トラフィックを分散させることができます。ロードバランサー・サービスは、パブリックIPアドレスの分散を行うパブリック・ロードバランサーと、プライベートIPアドレスの分散を行うプライベート・ロードバランサーの2種類が提供されます。双方のタイプのロードバランサーとも、一定の帯域(100MB/s~8000MB/s)の保証と、高可用性がデフォルトで提供されます。またパブリック・ロードバランサーについてはVCN内の2つの異なるサブネットに跨って構成されるため、アベイラビリティ・ドメイン全体の障害に対する耐障害性が提供されます。 この章では、シンプルなパブリック・ロードバランサーを構成し、VNC内の2台のWebサーバーに対する負荷分散を構成する手順について学習します。 所要時間 : 約50分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること 2048bit 以上のRSA鍵ペアを作成していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 仮想クラウド・ネットワークと2つのサブネットの作成 2つのインスタンスの作成とWebサーバーの起動 ロードバランサー用のサブネットの作成 ロードバランサーの構成 ロードバランサーへのhttp通信許可の設定 ロードバランサーの動作の確認 Webサーバーの保護 1. 仮想クラウド・ネットワークと2つのサブネットの作成 その2 - クラウドに仮想ネットワーク(VCN)を作る を参考に、仮想クラウド・ネットワーク(VCN)および付随するネットワーク・コンポーネントを作成してください。 作成時に 仮想クラウド・ネットワークおよび関連リソースの作成 オプションで作成することで、簡単に今回のチュートリアルに必要なVCNおよび付随コンポーネントを作成することができます。 この章では、Tokyoリージョン (可用性ドメインが1つの構成) を例として、最終的に下記のような構成を作成します。 2. 2つのインスタンスの作成とWebサーバーの起動...","categories": [],
        "tags": ["intermediate","network"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/using-load-balancer/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/using-load-balancer/img1.png"
      },{
        "title": "インスタンスのオートスケーリングを設定する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル アプリケーションの負荷に応じて自動的にコンピュート・リソースの増減ができれば、必要な時に必要な分だけのリソースを確保し、コストの最適化にもつながります。これを実現するための手法として、OCIではインスタンス・プールのオートスケーリング設定によって、負荷に応じてインスタンス・プール内のインスタンス数を増減させることが可能です。 このチュートリアルでは、オートスケーリングの設定を行って、実際にインスタンス数がどのように変化するかを確認します。 所要時間 : 約30分 前提条件 : その3 - インスタンスを作成する を通じてコンピュート・インスタンスの作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 今回の設定作業手順の流れは以下の図の1～4です。 目次： 1. ベースになるインスタンスの作成 2. インスタンス・コンフィグレーションの作成 3. インスタンス・プールの作成 4. オートスケーリングの設定 5. CPU負荷をかけてインスタンス増減を確認 1. ベースになるインスタンスの作成 まずは、オートスケーリングの設定を行うインスタンス・プールのもとになるインスタンスを作成します。今回は、その3 - インスタンスを作成する で作成したコンピュート・インスタンスを使用します。 2. インスタンス・コンフィグレーションの作成 ベースになるインスタンスからインスタンス構成 (=インスタンス・コンフィグレーション) を生成します。インスタンス構成とは、インスタンス起動を行うための「イメージ、シェイプ、メタデータ情報（sshキー、起動時スクリプトなど）、関連リソース（ブロック・ボリューム、ネットワーク構成）」をひとまとめにした構成情報の定義です。 コンソールメニューから Compute →...","categories": [],
        "tags": ["intermediate","compute"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/autoscaling/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/autoscaling/img5.png"
      },{
        "title": "ブロック・ボリュームをバックアップする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル 運用管理を行う上で、データのバックアップは重要です。Oracle Cloud Infrastructure ブロック・ボリューム・サービスでは、バックアップ・リストアやクローン、別のリージョンへのバックアップのコピーなどを行うことができます。また、基本的にブロック・ボリュームでもブート・ボリュームでも同様の機能が提供されています。 ブロック・ボリューム自体は可用性ドメイン固有のリソースですが、バックアップを取得することで別の可用性ドメインにリストアしたり、別のリージョンにコピーして利用することが可能となります。 ブロック・ボリュームのバックアップ機能はPoint-in-timeのスナップショットで、内部的にはオブジェクト・ストレージの領域にバックアップが行われます。 データの保護要件や可用性要件に応じて適切な手法でバックアップを取得し、安全に運用を行いましょう。 バックアップの概要 所要時間 : 約20分 前提条件 : チュートリアル入門編 :その4 - ブロック・ボリュームをインスタンスにアタッチする を完了し、ブロック・ボリュームを作成済みであること。 トライアル環境ではホームリージョン以外のリージョンの利用ができません。バックアップを別リージョンにコピーするためには有償環境で、該当のリージョンをサブスクライブする必要があります。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. ブロック・ボリュームの手動バックアップの作成 2. ブロック・ボリュームのバックアップからのリストア 3. リージョン間でのブロック・ボリュームのバックアップのコピー 4. ブロック・ボリュームのバックアップ・ポリシーの作成 5. ボリューム・グループの作成と管理 1. ブロック・ボリュームの手動バックアップの作成 まずは既存のブロック・ボリュームのバックアップを手動で取得してみましょう。今回は、チュートリアル :ブロック・ボリュームをインスタンスにアタッチする - Oracle Cloud...","categories": [],
        "tags": ["intermediate","block volume"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/taking-block-volume-backups/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/taking-block-volume-backups/img6.png"
      },{
        "title": "DNSサービスを使ってWebサーバーの名前解決をする",
        "excerpt":"Oracle Cloud Infrastructure の DNSサービスを利用すると、独自のドメイン名でインターネット向けサービスが運用できるようになります。 OCIのDNSは、長年にわたり実績のある Dyn.com のグローバルDNSサービスを利用しています。(DynはOracleグループの一員です) これによりユーザーは、低遅延、高パフォーマンスで、耐障害性のあるDNSサービスをクラウドで利用できるようになります。 名前解決を行う対象は、Oracle Cloud Infrastructure 上のサーバーに限らず、他のクラウドやオンプレミスのサーバーに対しても可能です。 またDyn.comのDNSの特長として、プライマリDNSとしてだけでなく、既に稼働中のDNSにセカンダリとして追加し、サービス全体の耐障害性を高めたりクライアントからの応答時間を短縮したりすることもできます。 このチュートリアルでは、作成済みのロードバランサー(またはWebサーバー)が持つグローバルIPアドレスに対して、取得済みのドメイン名に対する名前解決を行うDNSレコードを作成して、インターネットからアクセスを行います。またその手順を通してOCIのDNSサービスについて理解を深めます。 所要時間 : 約20分 前提条件 : Webサーバー(とロード・バランサ:オプション)が構成されて、グローバルIPアドレスにインターネットからアクセスできるようになっていること (もし作業が未実施の場合は、チュートリアル 応用編 - ロード・バランサでWebサーバーを負荷分散する の手順を実施してください) ドメイン名の取得サービスから、独自のドメイン名を取得していること 今回の手順の作成にあたっては、freenom というドメイン取得サービスを利用して予め取得した ocitutorials.tk という無料のドメイン名を利用しています。 freenomはOracleとは無関係のサービスでありOracleはこのサービスの利用を推奨するものではありません。 もちろん、他のドメイン取得サービスから取得したドメイン名であっても問題なくチュートリアルをご実施頂けますが、その際は一部作業をドメイン名を取得したサービス側で実施する必要がありますので、適宜読み替えてご実施ください。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. Oracle Cloud Infrastructure でのDNSの設定 1-1.DNSゾーンの追加 最初に、Oracle Cloud Infrastructure のコンソールから、取得済みのドメインをDNSゾーンとして追加する作業を行います。...","categories": [],
        "tags": ["intermediate","network"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/using-dns/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/using-dns/image10.png"
      },{
        "title": "Email Deliveryを利用した外部へのメール送信(その1　配信環境構築編)",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/sending-emails-1/",
        "teaser": null
      },{
        "title": "GPUインスタンスでディープラーニング",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/deep-learning-with-gpu/",
        "teaser": null
      },{
        "title": "シリアル・コンソールでsshできないインスタンスのトラブルシュートをする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure でLinuxインスタンスを作成するとデフォルトで sshd が起動し外部からsshでアクセスできるようになります。普通はこのsshで大抵の処理を行うことができますが、ごくたまにsshできない環境からアクセスが必要だったり、あるいはできていたsshが突然できなくなってしまったといった場合があります。そんなアクセスできないトラブル発生時に、コンソール・アクセスが有効な手段になる場合があります。 このチュートリアルでは、Oracle Cloud Infrastructure のインスタンスに対してシリアル・コンソールやVNCコンソールを通じてアクセスする方法を学習します。 また、今回はクライアントにWindows PCを利用します。Mac OS または Linux クライアントからのアクセスについては、マニュアルなどの別ドキュメントを参照してください。 所要時間 : 約20分 前提条件 : Oracle Cloud Infrastructure で、作成済みのLinuxインスタンスがあること コンソール・アクセスの認証に使用するSSH鍵ペアを作成済なこと 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります はじめに シリアル・コンソールが有効なケースの整理 アクセス元クライアントの準備 インスタンスでのコンソール接続許可の作成 シリアル・コンソール接続文字列の取得 インスタンスのシリアル・コンソールに接続 シリアル・コンソールを使ってメンテナンス・モードでブートする メンテナンス・モードでシステム設定ファイルを編集する インスタンスのssh鍵を再登録してアクセスを回復する 0. はじめに...","categories": [],
        "tags": ["intermediate"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/accessing-serial-console/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/accessing-serial-console/img1-3.png"
      },{
        "title": "インスタンスにセカンダリIPを付与する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastrcuture では、インスタンスを作成すると、初期状態で所属するサブネットの中からプライベートIPアドレスが一つ(=プライマリ・プライベートIP)割り当てられています。(DHCPで自動割当したり、固定IPを割り振ることができます) もし、インスタンスに複数のIPアドレスをアサインしたいような場合には、セカンダリのプライベートIPアドレスをインスタンスに割り当てて利用することができるようになります。この項ではその手順について学習します。 所要時間 : 約20分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること その3 - インスタンスを作成する を通じてインスタンスをひとつ作成していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. はじめに - セカンダリ・プライベートIPアドレスに関する理解 2. セカンダリ・プライベートIPアドレスのアサイン 3. OS上でセカンダリIPアドレスを登録 4. 他インスタンスからセカンダリ・プライベートIPアドレスにアクセス 5. OSのIPアドレス登録の永続化 1. はじめに - セカンダリ・プライベートIPアドレスに関する理解 セカンダリ・プライベートIPアドレスは、インスタンスの仮想NICに対してプライマリのIPアドレスとは別のIPアドレスをアサインする機能です。この機能によって、複数のIPアドレスを単一のネットワーク・インタフェースに対して割り振る、いわいるIPエイリアス機能が使えるようになります。 ネットワーク・インタフェース(仮想NIC)は同一ですので、セカンダリ・プライベートIPアドレスに割り振ることができるのは、プライマリのプライベート・IPアドレスと同じサブネットに属するIPアドレスであることにご注意ください。...","categories": [],
        "tags": ["intermediate","networking"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/attaching-secondary-ips/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/attaching-secondary-ips/img3.png"
      },{
        "title": "コマンドライン(CLI)でOCIを操作する",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/using-cli/",
        "teaser": null
      },{
        "title": "TerraformでOCIの構築を自動化する",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/terraforming/",
        "teaser": null
      },{
        "title": "OCI Valut (OCI Key Management) でBYOKをする",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/byok-with-vault/",
        "teaser": null
      },{
        "title": "Web Application Firewall(WAF)を使ってWebサーバを保護する",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/protecting-web-servers-with-waf/",
        "teaser": null
      },{
        "title": "Oracle Management Cloud チュートリアルまとめ",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/management-cloud-tutorials/",
        "teaser": null
      },{
        "title": "Oracle Data Safe チュートリアルまとめ",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/data-safe-tutorials/",
        "teaser": null
      },{
        "title": "ストレージ・ゲートウェイを作成する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure ストレージ・ゲートウェイ とは、アプリケーションが 標準のNFSv4プロトコルを使用してOracle Cloud Infrastructure オブジェクト・ストレージと相互作用できるようになるサービスです。オンプレミスからのデータ転送、バックアップ、アーカイブ用途などに利用できます。 大容量ファイルについてはマルチパート・アップロードが自動的に適用され、スタンダードなオブジェクト・ストレージだけでなく、アーカイブ・ストレージへのアップロードも可能です。 この章では、Oracle Cloud Infrastructure 上の コンピュート・インスタンスに ストレージ・ゲートウェイを作成する手順について説明していきます。 所要時間 : 約40分 前提条件 : 本チュートリアルの 前提条件 を参照ください 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. ボリュームのフォーマットおよびマウント 2. ストレージ・ゲートウェイのインストール 3. ファイル・システムの作成 4. クライアントから動作確認 構成イメージ 本チュートリアルでは 以下の構成で構築していきます。 ブロック・ボリュームがアタッチされたコンピュート・インスタンス上に...","categories": [],
        "tags": ["intermediate"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/storage-gateway/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/storage-gateway/img01.png"
      },{
        "title": "Oracle Content and Experience チュートリアル",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/oce-tutorial/",
        "teaser": null
      },{
        "title": "ADB HOL #1 : ADBインスタンスを作成してみよう",
        "excerpt":"この章ではまず最初のステップとして、メニュー画面を操作し、リージョンおよびコンパートメントを設定します。 そして、ADBインスタンスを作成します。またADBインスタンスにデータベース・ユーザー（スキーマ）を作成します。 ハイエンドなデータベースを簡単すぐに構成できることをご確認ください。 所要時間 : #1 約5分, #2 約20分 1. リージョンを設定し、コンパートメントを用意しよう 作業の流れ : サービス画面へのアクセス リージョンの確認、設定 コンパートメントの確認、作成 1. サービス画面へのアクセス まず初めにOracle Cloud Infrastructure のコンソール画面から、ADBのサービス画面にアクセスします。 （OCIのコンソールへのアクセスに関する詳細はを参照ください。） ブラウザから https://www.oracle.com/jp/index.html にアクセスし、ページ上部の アカウント をクリックし、クラウドにサインイン をクリックします。 本手順書ではFirefoxを前提に記載しています。英語表記の場合は Sign in to Cloud をクリックしてください。 お手持ちのクラウドアカウント名（テナント名）を入力し、 Next をクリックします。 クラウドユーザー名 と パスワード を入力し、 サイン・イン をクリックしてログインします。 以下のようなダッシュボード画面が表示されればOKです。 上手く表示されない場合は以下のURLをお試しください。尚、 &lt;クラウド・アカウント&gt; はご自身のクラウドアカウント名（テナント名）に置き換えてください。 https://console.ap-tokyo-1.oraclecloud.com/?tenant=&lt;クラウド・アカウント&gt; 補足）ダッシュボード画面の使い方...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/adb-hol1-provisioning/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/adb-hol1-provisioning/img11.png"
      },{
        "title": "ADB HOL #2 : ADBにデータをアップロードしてみよう",
        "excerpt":"この章ではSQL Developer Webを利用して、サンプルデータをADBインスタンスにデータをアップロードします。 事前に前提条件にリンクされているサンプルデータのzipファイルをお手元のPC上にダウンロードし、解凍しておいてください。 （集合ハンズオンセミナーでは講師の指示に従ってください） 所要時間 : #1 約10分, #2 約30分 前提条件 : ADB HOL#1を完了していること 以下にリンクされているサンプルデータのzipファイルをダウンロードし、解凍していること(#1で使用するsales_channel.csvと#2で使用するcustomer.csvが含まれています) サンプルデータファイルのダウンロードリンク 注意 : チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 1.手元のPCからCSVデータをアップロードしてみよう まず手元のPC上のデータをADBインスタンスにアップロードしてみましょう。サンプルデータとしてsales_channels.csvファイルを利用します。 ADB-HOL1で学習したSQL Developer Webを利用したインスタンスへの接続 を参照し、SQL Developer Webを起動し、Adminユーザーで接続してください。 その後左ペインにある　ナビゲータタブから　[…」(オブジェクトサブメニュー)→データのロード→新規表へのデータのアップロード を選択します。 ダウンロードして解凍した sales_channels.csv を選択して 次 をクリックします。 sales_channels.csvのデータのプレビューを確認し 次 をクリックします 表定義が表示されます。すべての列タイプが VARCHAR2型 になっていることが確認できます。 数字列である CHANNEL_ID列、CHANNEL_CLASS_ID列、CHANNEL_TOTAL_ID列 の列タイプを NUMBER型 に変更して 次 をクリックします。 設定を確認し 終了...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/adb-hol2-dataload/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/adb-hol2-dataload/adb2-1_1.png"
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス・リミット、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 無償トライアル環境のお申込みについては こちら の資料を参照してください。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります image サポートされるブラウザの確認 このチュートリアルでは、Oracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナント名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID ユーザー名 - ログインのためのユーザー名 パスワード - ログインのためのパスワード ログイン情報の入手方法は、ユーザーが作られるタイミングによって異なります。...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/webapp/01-getting-started/",
        "teaser": null
      }]
