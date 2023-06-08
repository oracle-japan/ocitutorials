var store = [{
        "title": "準備 - Oracle Cloud 無料トライアルを申し込む",
        "excerpt":"Oracle Cloud のほとんどのサービスが利用できるトライアル環境を取得することができます。このチュートリアルの内容を試すのに必要になりますので、まずは取得してみましょう。 ※認証のためにSMSが受け取れる電話とクレジット・カードが必要です(希望しない限り課金はされませんのでご安心を!!)      Oracle Cloud 無料トライアル サインアップガイド   Oracle Cloud Free Tierに関するFAQ  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/acquiring-free-trial/",
        "teaser": null
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス・リミット、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 参考動画： 本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 1.コンソール 　 1. サポートされるブラウザの確認 このチュートリアルでは、Oracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 2. ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナント名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID...","categories": [],
        "tags": ["beginner","network"],
        "url": "/ocitutorials/beginners/getting-started/",
        "teaser": "/ocitutorials/beginners/getting-started/img2.png"
      },{
        "title": "その2 - クラウドに仮想ネットワーク(VCN)を作る",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure を利用するにあたっての最初のステップは、仮想クラウド・ネットワーク(Virtual Cloud Network : VCN) を作成することです。ネットワークの管理者が最初に仮想ネットワークを作ることで、その後インスタンスの管理者やストレージの管理者が、作成した仮想ネットワークの構成やルールに従ってコンポーネントを配置することができるようになります。 このチュートリアルでは、コンソール画面から仮想クラウド・ネットワーク(VCN)を1つ作成し、その構成について確認してくことで、OCIのネットワークに対する理解を深めます。 所要時間 : 約15分 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること その1 - OCIコンソールにアクセスして基本を理解するを完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. 仮想クラウドネットワーク(VCN)とは? 2. 仮想クラウド・ネットワークの作成 3. 作成した仮想クラウド・ネットワークの確認 参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 2.仮想クラウドネットワーク...","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/creating-vcn/",
        "teaser": "/ocitutorials/beginners/creating-vcn/img4.png"
      },{
        "title": "その3 - インスタンスを作成する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル この章では、作成済みの仮想クラウド・ネットワーク(VCN)の中にコンピュート・インスタンスを作成していきます。 所要時間 : 約20分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. 新規仮想マシンインスタンスの作成 2. 作成したインスタンス詳細情報の確認 3. インスタンスへの接続 参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 3.コンピュート・インスタンス 1. 新規仮想マシンインスタンスの作成 第2章で作成した仮想コンピュート・ネットワーク(VCN)に、新しくインスタンスを作成していきます。 今回はコンソールから、一番小さなシェイプ(1 OCPU)の仮想マシン(VM)タイプの Oracle Linux 7 のインスタンスを1つ作成します。 コンソールメニューから コンピュート → インスタンス...","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/creating-compute-instance/",
        "teaser": "/ocitutorials/beginners/creating-compute-instance/img11.png"
      },{
        "title": "その4 - ブロック・ボリュームをインスタンスにアタッチする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure ブロック・ボリューム・サービスを利用することにより、ベアメタル・インスタンスや仮想マシン・インスタンスからブロックデバイスとして利用することができるボリュームを、簡単に作成、管理することができます。用途に応じたサイズのボリュームを作成、インスタンスへのアタッチ、変更などが可能です。インスタンスからボリュームに対するアクセスは iSCSI もしくは準仮想化を通じて行われます。 インスタンスにアタッチしたボリュームは、通常のディスク・ドライブと同じようにOSから利用することができ、またインスタンスからデタッチし、新しい別のインスタンスにアタッチすることで、データを失うことなく移行することが可能です。 ブロック・ボリュームの典型的なユースケースとしては以下のようなものがあります。 インスタンスのストレージの拡張 : Oracle Cloud Infrastructure の ベアメタル・インスタンス、仮想マシン・インスタンスいずれに対しても、ブロック・ボリュームをアタッチすることでOSのストレージ領域を拡張することができます。 永続化されたストレージ領域の利用 : インスタンスを終了(Terminate)しても、ブロック・ボリュームとそこに格納されたデータは永続します。これらはボリュームを明示的に終了(Terminate)するまで存続します。 インスタンス間のデータの移動 : インスタンスにアタッチしたブロック・ボリュームをデタッチし、別のインスタンスにアタッチすることにより、1つのインスタンスから別のインスタンスにデータを簡単に移動させることができます。 このチュートリアルでは、ブロック・ボリュームの基本的な使い方をご案内します。 ブロック・ボリュームのバックアップについては応用編のブロック・ボリュームをバックアップする をどうぞ。 所要時間 : 約20分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る とその3 - インスタンスを作成する を完了し、仮想クラウド・ネットワーク(VCN)の中に任意のLinuxインスタンスの作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 参考動画：...","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/attaching-block-volume/",
        "teaser": "/ocitutorials/beginners/attaching-block-volume/img6.png"
      },{
        "title": "その5 - インスタンスのライフサイクルを管理する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル リソースを必要なときに必要なだけ使える、というのがクラウドのいいところですね。そのために作成したインスタンスはいつでも停止、再起動、終了、再作成といった処理が行えるようになっています。このチュートリアルでは、そのようなインスタンスのライフサイクル管理をどう行うかと、それぞれのステータスで実際にインスタンスがどのような状態になっているのかについて確認していきます。 所要時間 : 約20分 前提条件 : その3 - インスタンスを作成する を通じてコンピュート・インスタンスの作成が完了していること その4 - ブロック・ボリュームをインスタンスにアタッチする を通じてブロック・ボリュームのアタッチが完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 : インスタンスの停止、再起動 インスタンスの終了(Terminate) ブート・ボリュームからのインスタンスの再作成 参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 5.インスタンスのライフサイクル 1. インスタンスの停止、再起動 まずは、インスタンスの停止、再起動処理と、その際に実行される動作について確認していきましょう。 1-1. ブートボリュームへのファイルの作成 OCIのインスタンスは、すべてブート・ボリュームと呼ばれる永続化されたiSCSIデバイスからネットワーク経由でブート(iPXEブート)されます。 このブート・ボリュームの変更(OSのパラメーター変更など)が、インスタンスのライフサイクル操作によってどのような影響を受けるかを確認するために、予めファイルを1つ作成します。 SSHターミナルを開き、 で作成したインスタンスにsshでアクセスします アクセスしたユーザーホームディレクトリに、任意のファイルを作成します。 下記の例では、opcユーザーのホームディレクトリ(/home/opc)に、testfileというファイルを作成しています...","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/managing-instance-lifecycle/",
        "teaser": "/ocitutorials/beginners/managing-instance-lifecycle/img_header.png"
      },{
        "title": "その6 - ファイルストレージサービス(FSS)で共有ネットワークボリュームを利用する",
        "excerpt":"ブロックボリュームはとても便利なサービスですが、残念ながら複数のインスタンスから同時に使える共有ストレージとして使うには、ユーザー自身で共有ファイルシステムを構築する必要があります。しかし共有のストレージボリュームを使いたい場合にも、Oracle Cloud Infrastructure（OCI）にはファイル・ストレージ・サービス(FSS)という便利な NFSv3 対応の共有ストレージ・ボリュームのマネージド・サービスがあります。このチュートリアルでは、FSS を利用して複数のインスタンスから利用できる共有ボリュームを利用する方法について確認していきます。 所要時間 : 約20分 前提条件 : インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を通じてコンピュート・インスタンスの作成が完了していること ブロック・ボリュームをインスタンスにアタッチする - Oracle Cloud Infrastructureを使ってみよう(その4) を通じてブロック・ボリュームのアタッチが完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. ファイルシステムの作成 まずは、OCIのコンソールからファイル・システム・サービスのメニューから共有ファイルシステムを作成します。コンソールからファイルシステムを作成すると、コンピュート・インスタンスからアクセスするマウント・ターゲットも同時に作成されます。マウント・ターゲットを作成すると、後から複数のファイルシステムをそこに紐づけることができます。APIやコマンドライン・インタフェース(CLI)を利用した場合は、ファイルシステムとマウント・ターゲットを個別に作成することができます。 コンソールメニューから ファイル・ストレージ → ファイル・システム を選択します 適切なリージョンとコンパートメントを選んでいることを確認したら、 ファイル・システムの作成 ボタンを押します 立ち上がってきた ファイル・システムの作成 ウィンドウの ファイル・システム情報 フィールドにある 詳細の編集 を押して以下の項目を編集します 名前 -...","categories": [],
        "tags": ["beginner","network"],
        "url": "/ocitutorials/beginners/using-file-storage/",
        "teaser": "/ocitutorials/beginners/using-file-storage/image-20210118132254521.png"
      },{
        "title": "その7 - オブジェクト・ストレージを使う",
        "excerpt":"チュートリアル一覧に戻る : 入門編 - Oracle Cloud Infrastructure を使ってみよう Oracle Cloud Infrastructureオブジェクト・ストレージ・サービスは、高い信頼性と高い費用対効果を両立するスケーラブルなクラウドストレージです。 オブジェクト・ストレージを利用すると、分析用のビッグ・データや、イメージやビデオ等のリッチ・メディア・コンテンツなど、あらゆるコンテンツ・タイプの非構造化データを無制限に保管できます。 オブジェクト・ストレージはリージョン単位のサービスで、コンピュート・インスタンスからは独立して動作します。 ユーザーはオブジェクト・ストレージのエンドポイントに対し、OCIの内部、外部を問わずどこからでもアクセスすることができます。 OCIのIdentity and Access Management(IAM)機能をを利用した適切なアクセスコントロールや、リソース・リミットを設定することも可能です。 この章では、コンソール画面からオブジェクト・ストレージにアクセスし、スタンダード・バケットの作成やオブジェクトのアップロード、ダウンロードなどの基本的な操作、また事前認証リクエストを作成して一般ユーザー向けにダウンロードリンクを生成する手順について学習します。 所要時間 : 15分 前提条件 : 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切なオブジェクト・ストレージの管理権限がユーザーに付与されていること 注意 : チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 7.オブジェクト・ストレージ 1. コンソール画面の確認とバケットの作成 オブジェクト・ストレージ・サービスにおいて、バケットはオブジェクトを格納する箱として機能します。 バケットはコンパートメントに紐付ける必要があり、バケットおよびその中のオブジェクトに対する操作に関する権限は、コンパートメントのポリシーを通じて制御します。 まず、コンソール画面からバケットを作成していきます。 コンソールメニューから ストレージ → オブジェクト・ストレージとアーカイブ・ストレージ を選択し、バケットの作成 ボタンを押します 立ち上がった バケットの作成...","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/object-storage/",
        "teaser": "/ocitutorials/beginners/object-storage/001.webp"
      },{
        "title": "その8 - クラウドでOracle Databaseを使う",
        "excerpt":"このチュートリアルは、「101: Oracle Cloud で Oracle Database を使おう(DBCS)」 で紹介しています。リンク先のページをご覧ください。   参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。      Oracle Cloud Infrastructure ハンズオン - 8.データベース  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/using-oracle-database/",
        "teaser": null
      },{
        "title": "その9 - クラウドでMySQL Databaseを使う",
        "excerpt":"Oracle Cloud Infrastructure では、MySQL Database Service(MDS)が利用できます。MDSはAlways Freeの対象ではないため、使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。 このチュートリアルでは、コンソール画面からMDSのサービスを1つ作成し、コンピュート・インスタンスにMySQLクライアントとMySQL Shellをインストールして、クライアントからMDSへ接続する手順を説明します。 所要時間 : 約25分 (約15分の待ち時間含む) 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1) を完了していること クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2) を完了していること インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 目次： 1. MySQL Database Service(MDS)とは?...","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/creating-mds/",
        "teaser": "/ocitutorials/beginners/creating-mds/MySQLLogo_teaser.png"
      },{
        "title": "その10 - MySQLで高速分析を体験する",
        "excerpt":"Oracle Cloud Infrastructure(OCI) では、HeatWaveというデータ分析処理を高速化できるMySQL Database Services(MDS)専用のクエリー・アクセラレーターが使用できます。HeatWaveもMDSと同じく、Always Freeの対象ではないため使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。 このチュートリアルでは、コンソール画面からHeatWaveを構成し、MySQLクライアントからサンプルデータベースを構成してHeatWaveを利用する手順を説明します。 所要時間 : 約40分 (約25分の待ち時間含む) 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)を完了していること クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2)を完了していること インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)を完了していること クラウドでMySQL Databaseを使う(その9)を完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. MySQL HeatWaveとは? 2. MySQL HeatWave構成時の注意事項...","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/creating-HeatWave/",
        "teaser": "/ocitutorials/beginners/creating-mds/MySQLLogo_teaser.png"
      },{
        "title": "その11 - クラウドでMySQL Databaseを高可用性構成で使う",
        "excerpt":"Oracle Cloud Infrastructure では、MySQL Database Service(MDS)が利用できます。MDSはAlways Freeの対象ではないため、使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。 このチュートリアルでは、コンソール画面から高可用性構成を有効化したMDSを作成し、コンピュート・インスタンスにMySQLクライアントをインストールして、MDSの高可用性動作を確認する手順を説明します。 所要時間 : 約30分 (約15分の待ち時間含む) 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1) を完了していること クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2) を完了していること インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 また、このチュートリアルでコードブロックに掲載しているコードは1行で長いコードを掲載している部分もあります。その部分では、右側にスクロールしてコード全文を確認して下さい。 (チュートリアルを実践する時は、一旦テキストエディタ等にコピー＆ペーストして内容確認＆編集することを推奨します) 目次： 1. はじめに 2....","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/creating-mds-ha/",
        "teaser": "/ocitutorials/beginners/creating-mds-ha/MySQLLogo_teaser.png"
      },{
        "title": "その12 - MySQL Database Serviceでリードレプリカを構成する",
        "excerpt":"Oracle Cloud Infrastructure では、MySQL Database Service(MDS)が利用できます。MDSはAlways Freeの対象ではないため、使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。 このチュートリアルでは、参照処理の負荷分散を実現できるリードレプリカを構成し、動きを確認します。リードレプリカもエンドポイントもマネージドで提供されているため、簡単に利用できるのが特徴です。 所要時間 : 約50分 (約30分の待ち時間含む) 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1) を完了していること クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2) を完了していること インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 目次： 1. リードレプリカとは? 2. 本チュートリアルで作成する構成の構成図 3....","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/creating-mds-readreplica/",
        "teaser": "/ocitutorials/beginners/creating-mds-readreplica/MySQLLogo_teaser.png"
      },{
        "title": "その13 - MySQL Database Serviceでレプリケーションを使用する",
        "excerpt":"Oracle Cloud Infrastructure では、MySQL Database Service(MDS)が利用できます。MDSはAlways Freeの対象ではないため、使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。 このチュートリアルでは、MDSからMDSへのレプリケーションを構成することで、MDSでのレプリケーションの構成方法を確認します。MDSはソースにもレプリカにもなれますが、マネージドサービスであるが故の注意事項や制限事項もあるため、それらについても説明します。 所要時間 : 約50分 (約20分の待ち時間含む) 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1) を完了していること クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2) を完了していること インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 目次： 1. レプリケーションとは? 2. 本チュートリアルで作成する構成の構成図 3....","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/creating-mds-channel/",
        "teaser": "/ocitutorials/beginners/creating-mds-readreplica/MySQLLogo_teaser.png"
      },{
        "title": "Always Freeで快適DBアプリ開発環境を構築する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure (OCI) の ”Always Free” では、以下のようなリソースが永久無償で利用することが可能です。（無償利用が可能な全てのリソースについては Oracle Cloud Infrastructure ドキュメント：Always Free リソース を参照してください） 【無償利用可能なサービス例】 AMDベースのコンピュート ArmベースのAmpere A1 Compute Block Volume Object Storage Flexible Load Balancer Autonomous Transaction Processing など 本チュートリアルでは、このAlways Freeで使えるリソースを活用し、データベース・アプリケーションの開発環境を構築していきます。構成は下記の通りです。 上記構成のうち、１～３までは実施済みである前提とします。下記の前提条件を参考に作成してください。 前提条件 : チュートリアル : 準備 - Oracle Cloud の無料トライアルを申し込むPermalink を参考に、Oracle...","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/alwaysfree/",
        "teaser": "/ocitutorials/beginners/alwaysfree/image01.png"
      },{
        "title": "Oracle Blockchain Platformのインスタンス作成",
        "excerpt":"この文書は Oracle Blockchain Platform（OBP）のインスタンス作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年4月時点での最新バージョン(21.1.2)を元に作成されています。 1. 準備 1.1 Oracle Cloud の環境を準備する Oracle Cloud のアカウントを準備します。現在、OBP は無料トライアル期間（Free Trial Credit）および Always Free で利用できるサービスには含まれていないため、有償アカウントが必要です。 1.2 Oracle Cloud にサイン・インする OBP インスタンスは、Oracle Cloud Infrastructure コンソール（以降 OCI コンソール）から作成します。ここでは、前の手順で作成した テナント管理ユーザー で OCI コンソールにアクセスします。 こちらのチュートリアルもあわせてご確認ください。 その 1 - OCI コンソールにアクセスして基本を理解する Web ブラウザで、以下の URL にアクセスします。 https://cloud.oracle.com Cloud Account Name （クラウドアカウント名）...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/01_1_create_instance/",
        "teaser": "/ocitutorials/blockchain/01_1_create_instance/create_compartment_form.png"
      },{
        "title": "Participant インスタンスをブロックチェーン・ネットワークに参加させる",
        "excerpt":"この文書は Oracle Blockchain Platform（OBP） の Participant インスタンスをブロックチェーン・ネットワークに参加させる方法をステップ・バイ・ステップで紹介するチュートリアルです。 このチュートリアルではふたつの OBP インスタンスでブロックチェーン・ネットワークを構成していますが、3 以上のインスタンスから成るブロックチェーン・ネットワークを構成する場合にも、基本的に同一の手順で実施可能です。 この文書は、2021年4月時点での最新バージョン(21.1.2)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 Founder インスタンスと Participant インスタンスそれぞれのインスタンスを所持 0. 前提の理解 0.1 Founder インスタンスと Participant インスタンス OBP はパーミッション型のブロックチェーンプロトコルである Hyperledger Fabric をベースとしたブロックチェーンプラットフォームです。OBP はひとつ～複数のインスタンスでブロックチェーン・ネットワークを構成することができます。 OBP インスタンス作成時に、「プラットフォーム・ロール」の項目で、インスタンス作成と同時にブロックチェーン・ネットワークを新たに作成する（→Founder インスタンス）か、既存のブロックチェーン・ネットワークに参加することを前提にインスタンスを作成する（→Participant インスタンス）かを選択します。 Founder インスタンスの場合は、作成したブロックチェーン・ネットワークに参加した状態でインスタンスが作成されるため、そのままで各種のオペレーションが可能です。 一方、Participant インスタンスの場合は、まずブロックチェーン・ネットワークへの参加が必要です。 0.2 このチュートリアルでの例となるインスタンス名とブロックチェーン・ネットワーク構成 このチュートリアルの例では、 Founder2104 というインスタンス名の Founder インスタンスと、...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/01_2_join_participant/",
        "teaser": "/ocitutorials/blockchain/01_2_join_participant/founder_step2.png"
      },{
        "title": "Channelを作成し、インスタンスおよびPeerノードを参加させる",
        "excerpt":"この文書は Oracle Blockchain Platform（OBP）で Channel を作成する方法、および Channel への インスタンスとPeer ノードの追加をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年4月時点での最新バージョン(21.1.2)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 0. 前提の理解 0.1 Hyperledger Fabric における Channel OBP はパーミッション型のブロックチェーンプロトコルである Hyperledger Fabric をベースとしたブロックチェーンプラットフォームです。 Hyperledger Fabric では、ブロックチェーン・ネットワークの中でのデータとロジックの共有範囲の制御などのための機能として、Channel という仕組みを備えています。Channel はブロックチェーン・ネットワークに対してある種のサブネットワークとして機能し、Channel ごとに参加する Organization、Peer、Orderer を構成したり、動作させる Chaincode を定義したりすることなどができます。 Channel はまず Organization レベルで参加し、その後 Organization 内で配下の Peer や Orderer を追加する、という 2...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/02_1_create_channel/",
        "teaser": "/ocitutorials/blockchain/02_1_create_channel/founder_create_channel_result.png"
      },{
        "title": "Chaincodeをデプロイする",
        "excerpt":"この文書ではOracle Blockchain Platform（OBP）でChaincodeをデプロイし、実行可能にする方法をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2022年11月時点での最新バージョン(22.3.2)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 Channelの作成を完了 0. 前提の理解 0.1 Hyperledger FabricにおけるChaincodeのデプロイ OBPはパーミッション型のブロックチェーンプロトコルであるHyperledger Fabricをベースとしたブロックチェーンプラットフォームです。 ブロックチェーン台帳に対して実行されるビジネスロジックであるChaincodeのデプロイのプロセスは、バージョン1.x系とバージョン2.x系で以下のように異なっています。そのため、このチュートリアルではv1.x系用の手順とv2.x系用の手順を併記しています。自身のお使いのOracle Blockchain PlatformインスタンスのベースとしているHyperledger Fabricのバージョンに合わせ、適切なほうをご利用ください。 v1.x系 v1.x系では、①各Organizationの作業として、Endorsementを行うPeerへのChaincodeのインストール、②Channelレベルの作業として、代表する単一のOrganizationがChaincodeをインスタンス化（instantiate）、の2段階のオペレーションによって実施され、Chaincodeが実行可能になります。 v2.x系 v1.x系では、各Organizationの作業として、①Endorsementを行うPeerへのChaincodeのインストールおよび ②Chaincode定義のApprove、③Channelレベルの作業として、必要数のApproveが得られていることを前提として、代表する単一のOrganizationがChaincode定義をCommit、の3段階のオペレーションによって実施され、Chaincodeが実行可能になります。 0.2 このチュートリアルでのブロックチェーン・ネットワーク構成 このチュートリアルの例では、 Founder2104 というFounderインスタンス（=Organization）と、 Member2104 というParticipantインスタンス（=Organization）から成るブロックチェーン・ネットワークとなっています。また、ch1という名前のChannelに、サンプルChaincodeをデプロイします。 任意のChannelで任意のChaincodeを、また、単一のインスタンス／Organizationから成るネットワークでも基本的には同一の手順でデプロイできます。 1.サンプルChaincodeの準備 デプロイするサンプルChaincodeをダウンロードし、必要なZipファイルを準備します。 Oracle Blockchain Platformのサービス・コンソールを開きます。 Developer Toolsのページを開き、左側メニューからSamplesのセクションを選択し、「Balance Transfer」のコーナーからDownload Samples hereをクリックするとインストーラがダウンロードされます。 ダウンロードしたサンプルChaincodeのZIPファイルをunzip（解凍）します。 サンプルにはGoとNode.js両方のChaincode、およびその他のマテリアルが含まれています。デプロイには、GoのChaincodeソースだけを含んだZIPファイルを作成する必要があります。 /artifacts/src/github.com配下にあるgoフォルダをZIPファイルに圧縮してください。ZIPファイル名は任意ですが、ここでの例ではBT_Sample.zipとしています。 2. Hyperledger...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/03_1_deploy_chaincode/",
        "teaser": "/ocitutorials/blockchain/03_1_deploy_chaincode/instantiate_cc_input.png"
      },{
        "title": "REST APIからChaincodeを実行する",
        "excerpt":"この文書ではOracle Blockchain Platform（OBP）でREST APIからChaincodeを実行する方法を説明します。 この文書は、2021年8月時点での最新バージョン(21.2.1)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 Channelの作成を完了 Chaincodeのデプロイを完了 0. 前提の理解 0.1 Oracle Blockchain PlatformのREST Proxy OBPはパーミッション型のブロックチェーンプロトコルであるHyperledger Fabricをベースとしたブロックチェーンプラットフォームです。 Hyperledger FabricにおけるChaincodeは、いわゆるスマートコントラクトとして位置づけられ、ブロックチェーン台帳に対して実行されるビジネスロジックです。アプリケーションからChaincodeを実行する場合は通常、Fabric SDKをアプリケーションに組み込んだうえで、SDKの機能を利用して実行します。この際にHyperledger Fabricネットワークのユーザーアイデンティティが認証・認可に使用され、そのため、アプリケーション側に秘密鍵と証明書を保持しておく必要があります。 OBPでは、アプリケーションとChaincodeを中継する役割を持つREST Proxyというコンポーネントを独自に備えています。REST ProxyにはFabric SDKが組み込まれており、また、Hyperledger Fabricネットワークのユーザーアイデンティティを保持しています。これにより、アプリケーションはREST APIを呼び出すことで、REST Proxyを介してChaincodeを実行できます。この際、アプリケーションはREST Proxyに対して、Oracle Cloudのユーザーアカウント（IDCSユーザー）を用いて認証、認可されます。 0.2 このチュートリアルでの構成 このチュートリアルの例では、 Founder2104 というFounderインスタンス（=Organization）と、 Member2104 というParticipantインスタンス（=Organization）から成るブロックチェーン・ネットワークとなっています。 また、 ch1 という名前のChannelに、OBPに付随するサンプルのひとつであるBalance TransferのChaincodeが、 BT-Sample という名前でデプロイされています。 任意のChannelで任意のChaincodeを基本的には同一の手順で実行できます。 0.3...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/03_2_restcall_chaincode/",
        "teaser": "/ocitutorials/blockchain/03_1_deploy_chaincode/instantiate_cc_input.png"
      },{
        "title": "Fabricのアイデンティティ関連の操作や設定",
        "excerpt":"Oracle Blockchain Platform（OBP）でHyperledger Fabricのプロトコルにおけるアイデンティティ、およびアイデンティティを構成する証明書および秘密鍵に関連する操作、設定などを説明します。 この文書は、2021年8月時点での最新バージョン(21.2.1)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 0. 前提の理解 0.1. Hyperledger Fabricにおけるアイデンティティ Hyperledger Fabricではネットワーク内の各種コンポーネント（Peer、Orderer、CA）およびクライアントアプリケーションそれぞれに対してX.509証明書（およびペアとなる秘密鍵）にカプセル化されたアイデンティティを割り当てています。また、これら各アイデンティティは必ずひとつのOrganizationに属しており、階層化されたアイデンティティ構造が採用されています。 各Organizationでは、配下のコンポーネントおよびクライアントアプリケーション用のアイデンティティを自身のCA（Certificate Authority）を用いて発行します。CAの実装は通常、Fabric CAを用います。 Hyperledger FabricではPKIが採用されており、これらOrganizationと個々のアイデンティティの階層構造はPKIの階層構造と結びついています。 0.2. Oracle Blockchain Platformでのアイデンティティ OBPは、上述のHyperledger Fabricのアイデンティティの仕組みを基本的にはそのまま用いています。一方で、以下の点で構築と運用の利便性、容易性が向上しています。 最初の管理者アイデンティティや各種証明書がインスタンス作成時に自動作成される コンポーネントの用いるアイデンティティはコンポーネント作成時に自動作成される REST Proxy経由でのChaincode実行に用いるアイデンティティは、REST Proxyが保持する このチュートリアルでは、以下についてそれぞれ説明していきます。 インスタンス生成時に自動作成される各種証明書と管理者秘密鍵のコンソールからのダウンロード方法 REST Proxy経由でのChaincode実行に用いられるアイデンティティの設定方法 Fabric CA Clientを用いて証明書＆秘密鍵を生成する方法（ 準備中 ） 0.3. トランザクション実行者アイデンティティの確認方法 このチュートリアルで説明する各種アイデンティティは、いずれもクライアントアプリケーションがトランザクション実行（のリクエスト）に用いるアイデンティティとして使用されます。 トランザクションの実行者のアイデンティティは、OBPコンソール上では以下のように確認できます。 Oracle Blockchain Platformのサービス・コンソールを開きます。...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/05_1_fabric_identity/",
        "teaser": "/ocitutorials/blockchain/05_1_fabric_identity/channel_ledger_tx.png"
      },{
        "title": "リッチヒストリーデータベースの設定方法",
        "excerpt":"Oracle Blockchain Platformで、ブロックチェーン台帳のデータを外部のOracle Databaseに複製する機能であるリッチヒストリーデータベース機能の設定方法を説明します。 この文書は、2022年11月時点での最新バージョン(22.3.2)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 複製先のOracle Databaseの用意 Oracle Blockchain Platformインスタンスからデータベースまでの接続（通信）が可能になっている必要があります 0. 前提の理解 0.1. リッチヒストリーデータベース機能の概要 Oracle Blockchain Platform（OBP）のリッチヒストリーデータベース機能は、OBPインスタンスの持つブロックチェーン台帳のデータをブロックチェーン外部のリレーショナルデータベース（Oracle Database）に複製する機能です。 Hyperledger Fabricに限らずブロックチェーンは一般にスマートコントラクト上（オンチェーン）での集計や分析などの複雑な参照処理を苦手としています。リッチヒストリーデータベース機能を用いることで、そうした処理をデータベース側で実装可能になります。 Oracle Database上にデータを複製したのちには、多くの開発者が慣れ親しんでいるPL/SQL言語や各種のBIツールを用いて容易に集計、分析が行えることになります。また、他データベースとのデータ統合も容易になり、データの価値を最大限に活用できるようになります。 0.2. リッチヒストリーデータベースの設定のレベル 利用にあたっての複製先のデータベースに対しての接続設定が必要になります。以下のレベルでの設定が可能です。 OBPインスタンス全体に対する設定 Channelごとに設定……インスタンス全体に対する設定をオーバーライド 0.3. 複製されるテーブル Hyperledger Fabricにおける台帳の単位、すなわちChannelごとにデータを複製します。複製先のデータベースでは、Channelごとにそれぞれ役割の異なるStateテーブル、Historyテーブル、Transaction Detailsテーブル（オプショナル）およびチェックポイントを保存するLastテーブルが自動的に作成され、データが書き込まれていきます。 テーブル名は {インスタンス名=Organization名}_{Channel名}_{テーブル種別} の規則で作成されます。テーブル種別は上記4つにつきそれぞれstate、history、more、lastです。 以下にLast以外のテーブルについて、それぞれに複製されるデータの内容を説明しています。 Stateテーブル Historyテーブル Transaction Detailsテーブル 1. リッチヒストリーデータベースの設定方法 以下にインスタンス全体に対する設定、およびChannelごとの設定の方法をそれぞれ説明していきます。 1.1....","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/06_1_rich_history/",
        "teaser": "/ocitutorials/blockchain/06_1_rich_history/rich_history_tables.png"
      },{
        "title": "複製先データベースでJSONを展開したビューを作成",
        "excerpt":"Oracle Blockchain Platformのリッチヒストリーデータベース機能を用いてブロックチェーン台帳からデータベースに複製したデータをより使いやすくするため、JSONを展開しつつデータを抽出するビューを作成する方法を説明します。 この文書は、2022年11月時点での最新バージョン(22.3.2)を元に作成されています。 前提 : リッチヒストリーデータベースの設定方法を完了 複製先のOracle Databaseへのアクセス 複製先のテーブルの参照、ビューの作成などの権限を持ったデータベースユーザーを用いる必要があります 0. 前提の理解 0.1. リッチヒストリーデータベース機能で複製されたデータの活用 Oracle Blockchain Platform（OBP）のリッチヒストリーデータベース機能は、OBPインスタンスの持つブロックチェーン台帳のデータをブロックチェーン外部のリレーショナルデータベース（Oracle Database）に複製する機能です。この機能の概要についてはリッチヒストリーデータベースの設定方法を参照ください。 一度データベースに複製してしまえば、データは一般的なスキルやツールを用いることで集計、分析、他のデータとの統合、Oracle Database付属のローコードアプリケーション開発ツールであるAPEXから利用など、様々に活用することができます。 0.2. 複製されたデータを活用するうえでの留意点 以下のスライドで説明されている通り、Channelごとに複製先のテーブルが作成され、ブロックチェーン台帳からデータが複製されてきます。 次の画像はあるChannelから複製したStateテーブルのサンプルです。 この複製されてきた状態のまま利用しても良いのですが、以下の理由によりやや使いづらい場合があるでしょう。 複数Chaincodeに由来するデータが単一のテーブルに混ざって格納されている 複製元のChannel内に複数のChaincodeが稼働している場合、複製先のテーブルにも複数のChaincode由来のデータが混在することになります。また、ユーザー側で明示的にデプロイさせ稼働させているUser Chaincodeのデータの他に、Chaincodeデプロイなどの際に暗黙的に動作するSystem ChaincodeであるLSCC(Lifecycle System Chaincode)のデータも複製されます。 一方で、集計、分析、統合などの操作の対象としたいデータは多くの場合、特定のひとつのUser Chaincode由来のものに限られます。操作のたびにいちいちWHERE句でChaincodeを指定するのはやや手間です。 JSON形式でデータが格納されている（場合がある） Chaincode内でデータをWorld Stateに保存する際、Key-ValueのValueをJSON形式にすることがしばしばあります（リッチクエリ利用との関連）。リッチヒストリーデータベース機能では、複製元のValueがJSON形式だった場合、VALUEJSONカラムに複製します。 Oracle DatabaseではJSONを扱うための方法（ドット記法やJSON_VALUE関数など）を用いることで、JSON内の要素の値を指定して扱うことができます。ただ、いちいちこれを行うのは値がカラムに直接展開されている場合に比較してやや手間です。また、集計、分析などで大規模なクエリを頻繁に行う場合には、JSONの展開は性能面でもやや不利になると考えられるため気をつけておきたいところです。 こうしたポイントを解消するため、ここではリッチヒストリーデータベースにその複製されたデータに対して、ビューとマテリアライズド・ビューを用いてJSONの内容をカラムに展開しつつデータを抽出する方法を、例を挙げて紹介します。 1. 複製先でJSONデータをカラムに展開しつつ抽出する 1.1. ここでの例に用いるChaincodeとそのデータ ここではOracle Blockchain Platformのコンソール上で実行できるサンプルChaincodeであるMarbles（obcs-marbles）のデータを例として扱います。 このMarblesは非常にシンプルなChaincodeで、扱うデータはValueが以下のようなJSON形式のMarble（ビー玉）アセットです。KeyはValueの中にもあるnameの値と同じ（以下では”marble01”）です。 { \"docType\": \"marble\",...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/06_2_rich_history_view/",
        "teaser": "/ocitutorials/blockchain/06_2_rich_history_view/rich_history_usage.png"
      },{
        "title": "Blockchain App Builder（Visual Studio Code拡張版）の基本的な使い方",
        "excerpt":"この文書は Oracle Blockchain Platform付属のChaincode開発・テスト・デプロイ補助ツールであるBlockchain App BuilderのVisual Studio Code拡張版について、ダウンロードとインストールの方法から、Chaincode仕様の作成方法やChaincodeコードの生成方法など、基本的な使い方を紹介するチュートリアルです。 この文書は、2022年11月時点での最新バージョン(22.3.2)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 0. Blockchain App Builderとは Blockchain App BuilderはOracle Blockchain Platform（OBP）に付属するChaincode開発・テスト・デプロイの補助ツールです。 BABは以下の機能を備えており、Chaincode開発を容易にし、生産性を高めます。 YAML、JSONの形式で記述した仕様からChaincodeのコードを生成 ローカル環境に自動構築される最小限のHyperledger Fabricネットワークを用いて開発したChaincodeをテスト 生成したChaincodeのパッケージングとOBPへのデプロイ OBP上にデプロイしたChaincodeの実行 BABは以下ふたつの形態のツールとして提供されており、いずれも同等の機能を備えています。 コマンドラインツール Visual Studio Codeの拡張機能 この記事では、Visual Studio Codeの拡張版を前提に説明していきます。 1. Blockchain App Builderのインストール方法 Blockchain App Builder（Visual Studio Code拡張版）のインストールにあたっての必要な前提条件、インストーラのダウンロード方法、インストール方法について説明します。 1.1 必要な前提条件 前提条件として、以下のセットアップが必要です（なお、一部の前提条件については対応する機能を使用しない場合は無視して進めても他の機能は利用できます）。...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/91_1_app_builder_vsc_start/",
        "teaser": "/ocitutorials/blockchain/91_1_app_builder_vsc_start/BAB-Menu.png"
      },{
        "title": "Fine-Grained Access Control Libraryの使い方",
        "excerpt":"この文書は Oracle Blockchain Platformに付属する、Chaincode上／オンチェーンで確実かつ柔軟、きめ細やかなアクセス制御を実現するためのサンプル・ライブラリであるFine-Grained Access Control Libraryの使い方を説明するチュートリアルです。 この文書は、2021年8月時点での最新バージョン(21.2.1)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 1. Fine-Grained Access Control Libraryの概要を理解する 1.1 Fine-Grained Access Control Libraryとは Fine-Grained Access Control Library（FGACライブラリ)は、Hyperledger FabricのChaincode内で利用できる、オンチェーン・アクセス制御のためのサンプル・ライブラリです。Chaincode内でのアクセス制御を、ブロックチェーン台帳上（＝オンチェーン）に記述したアクセス制御リストをもとに行います。 FGACライブラリはOracle Blockchain Platformのコンソールからダウンロードできるサンプルに含まれており、記事執筆時点（2021年8月）ではGo言語のChaincode用のライブラリが提供されています。 FGACライブラリは以下のような要求を満たすものとなっています： Chaincodeの特定の関数を利用できるユーザーを制限できる仕組みを提供する ユーザーと権限のリストは動的に変更でき、また、複数のChaincode間で共有できる アクセス制御リスト（ACL）に基づいたアクセス制御をChaincode内で容易に実装できる Chaincodeのデプロイ時に、リソースとACLを定義できる ACLに対しての操作についてもACLで制御できる 1.2 Fine-Grained Access Control Libraryの基本の要素 FGACライブラリでは、以下の要素に基づいてオンチェーンでのアクセス制御を実現しています： Identity（アイデンティティ）: Chaincode内でのチェック対象となる、Chaincodeの呼び出しに使用されたX509証明書 Identity Pattern（アイデンティティ・パターン）: ひとつ～複数のidentityにマッチするパターンです。基本的にはプレフィックス付きの文字列であり、例えばexample.com配下の全てのidentityにマッチするパターンは、%O%example.comとなります。以下のレベルでのパターンが想定されます。 X.509...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/92_1_fine_grained_ACL/",
        "teaser": "/ocitutorials/blockchain/92_1_fine_grained_ACL/FGACL_use_image.png"
      },{
        "title": "サンプルChaincodeの使い方",
        "excerpt":"この文書はOracle Blockchain Platformに付属するサンプルChaincodeのダウンロード方法、コンソールからの実行方法を紹介するチュートリアルです。 この文書は、2021年8月時点での最新バージョン(21.2.1)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 0. サンプルChaincodeについて Oracle Blockchain Platform（OBP）にはいくつかのChaincodeサンプルが付属しています。サンプルのうち一部はコンソール上で実行可能になっており、また、一部はソースコードをダウンロード可能です。 記事執筆時点で、以下のサンプルが提供されています。 Balance Transfer: AとBのふたつの口座間での残高のやり取りを表現するシンプルなサンプルです。コンソール上で実行可能、ソースコードのダウンロードが可能です。 Car Dealer: 自動車メーカーとディーラーの間でのパーツおよび自動車のやり取りなど、サプライチェーンのトレーサビリティを表現したサンプルです。パーツから自動車の組み立てもデータ構造として表現されています。コンソール上で実行可能、ソースコードのダウンロードが可能です。 Marbles: 色や大きさ、所有者などの属性を持ったMarble（おはじき）を題材としたNFTのサンプルです。内容としてはHyperledger FabricのChaincodeサンプルのMarblesとほぼ同じもので、台帳の範囲クエリやリッチクエリなど、ひととおりの操作が含まれています。コンソール上で実行可能です。 Marbles with Fine Grained ACLs: 上記のMarblesにFine-Grained Access Control Libraryを用いたアクセス制御を追加したものです。ソースコードのダウンロードが可能です。 1. サンプルChaincodeのダウンロード サンプルChaincodeのソースコードのダウンロードについて説明します。 Oracle Blockchain Platformのサービス・コンソールを開きます。 Developer Toolsのページを開き、左側メニューからSamplesのセクションを選択します。 ソースコードのダウンロード可能なサンプルについては、”Download sample here“のリンクからダウンロード可能です。 2. サンプルChaincodeのコンソール上での実行 サンプルChaincodeのコンソール上での実行について説明します。 サンプルChaincodeは、（通常のChaincodeのデプロイと同じく）①Peerへのインストール　→　②Instantiate　の2段階のデプロイプロセスを経て実行可能になります。 ここでは、Balance...","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/blockchain/93_1_sample_cc/",
        "teaser": "/ocitutorials/blockchain/93_1_sample_cc/console-samples-section.png"
      },{
        "title": "Oracle Cloud Infrastructure(OCI) DevOps事前準備",
        "excerpt":"OCI DevOpsは、OCI上にCI/CD環境を構築するマネージドサービスです。 ここでは、OCI DevOpsを利用するための事前準備を行います。　　 前提条件 クラウド環境 Oracle Cloudのアカウント（Free Trial）を取得済みであること 事前準備の流れ 1.OCI Notifications セットアップ 2.動的グループ/ポリシー セットアップ 3.プロジェクトの作成 1.OCI Notifications セットアップ 1-1 トピックとサブスクリプションの設定 OCI DevOpsでは、OCI Notificationsサービスの「トピック」と「サブスクリプション」の設定が必要となります。 この設定をしておくことで、登録したメールアドレスにOCI DevOpsから通知を受け取ることができます。 OCI Notificationsについて OCI Notificationsは、安全、高信頼性、低レイテンシおよび永続的にメッセージを配信するためのサービスです。 本ハンズオンでは、電子メールアドレスに対して配信を行いますが、他にもSlack/SMS/PagerDutyなどに通知を行うことができます。 また詳細はこちらのページをご確認ください。 1-1-1 トピックの作成 左上のハンバーガーメニューをクリックして、「開発者サービス」-「通知」を選択します。 「トピックの作成」ボタンをクリックします。 トピックの名前について トピックの名前はテナンシで一意になります。 集合ハンズオンなど複数人で同一環境を共有されている皆様は、oci-devops-handson-01やhandson-tnなどの名前のイニシャルを付与し、名前が重複しないようにしてください。 「名前」に「oci-devops-handson」と入力します。 「作成」ボタンをクリックします。 「アクティブ」になることを確認します。 以上でトピックの作成は完了です。 1-1-2 サブスクリプションの作成 左メニュー「サブスクリプション」を選択します。 「サブスクリプションの作成」ボタンをクリックします。 「電子メール」にご自身のメールアドレスを入力します。 「作成」ボタンをクリックします。 設定したメールアドレスに、以下の内容のメールが届きます。「Confirm...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/devops-for-commons/",
        "teaser": null
      },{
        "title": "Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-Compute編-",
        "excerpt":"OCI DevOps は、OCI 上に CI/CD 環境を構築するマネージドサービスです。このハンズオンでは、OCI上のComputeに対する CI/CD パイプラインの構築手順を記します。 前提条件 環境 OCI DevOps事前準備が完了していること 全体構成 本ハンズオンでは、以下のような環境を構築し、ソースコードの変更がCompute上のサンプルアプリケーションに自動的に反映されることを確認します。 このうち、DevOpsインスタンスについては、事前準備で構築済みです。 事前準備 まず、事前準備として、OCI DevOpsのGitレポジトリの認証で利用する認証トークンを取得します。 右上にある「プロファイル」アイコンをクリックして、プロファイル名を選択します。 左メニュー「認証トークン」を選択します。 「トークンの作成」をボタンをクリックします。 「説明」に「oci-devops-handson」と入力して、「トークンの生成」ボタンをクリックします。 「コピー」をクリックして、「閉じる」ボタンをクリックします。 コピーした認証トークンは、後の手順で必要となるので、テキストエディタなどにペーストしておきます。 以上で、認証トークンの作成は完了です。 全体の流れ Computeインスタンス環境の構築 DevOps環境構築 CIパイプラインとCDパイプラインの作成 パイプラインの実行 1. Computeインスタンス環境の構築 ここでは、サンプルアプリケーションを動作させるComputeインスタンスを作成します。 1-1. インスタンスの作成 OCIコンソール画面のハンバーガメニューからコンピュート=&gt;インスタンスをクリックします。 をクリックします。 以下の項目を入力します。 項目 入力内容 名前 devops-instance イメージとシェイプまでスクロールした後に、イメージの変更をクリックします。 Oracle Linux Cloud Developerを選択し、下部の同意項目にチェックを入れ、イメージの選択をクリックします。 ネットワーキングまでスクロールした後に、を選択します。 SSHキーの追加までスクロールした後に、秘密キーの保存をクリックします。 ここで、ダウンロードされた秘密キーはインスタンスにSSHログインする際に利用します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/devops-for-beginners-compute/",
        "teaser": null
      },{
        "title": "Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-OKE編-",
        "excerpt":"OCI DevOpsは、OCI上にCI/CD環境を構築するマネージドサービスです。ここでは、Oracle Container Engine for Kubernetes(OKE)サービスを利用したKubernetesクラスタの構築、アーティファクト環境とOCI DevOpsのセットアップ、CI/CDパイプラインの実装と実行までの手順を記します。 この手順を実施することで、OCI DevOpsを利用したコンテナアプリケーション開発におけるCI/CDを学習できます。 Oracle Container Engine for Kubernetes(OKE)について Oracle Container Engine for Kubernetesは、Oracle Cloud Infrastructure(OCI)で提供される、完全に管理されたスケーラブルで可用性の高いマネージドのKubernetessサービスです。 詳細はこちらのページをご確認ください。 前提条件 環境 OCI DevOps事前準備が完了していること 全体構成 以下の図にある環境を構築することがゴールです。環境構築後、サンプルソースコードを変更して、「git push」コマンド実行をトリガーにCI/CDパイプラインの実行、OKEクラスタ上にサンプルコンテナアプリケーションのデプロイまでの工程が、自動で行われることを確認します。 作業構成は、「事前準備」と「OCI DevOps 環境構築」の2構成です。 「事前準備」では、冒頭で紹介したOKEを利用したKubernetesクラスタを構築します。そして、OCI DevOpsサービスを利用する上で必要となる認証トークン設定、サンプルアプリケーションの取得、OCI DevOpsでOKEクラスタを利用するための動的グループ・ポリシーの設定を行います。 「OCI DevOps 環境構築」では、デプロイ先となるOKEクラスタの登録、コード・リポジトリとアーティファクト・レジストリの設定と管理、OCI DevOpsのパイプラインとなるビルド・パイプラインとデプロイメント・パイプラインの構築、パイプラインを自動化させるためのトリガー機能の設定、最後にソースコードの変更および「git push」コマンド実行を契機に、構築したパイプラインの稼働とデプロイされたアプリケーションの稼働を確認します。 ここで、関係する機能、サービスを整理しておきます。 コード・リポジトリ コード・リポジトリは、ソースコードをバージョン管理できるOCI DevOpsの機能の一つです。GitHubやGitLabと同じようにリポジトリを作成して、ソースコードのバージョン管理をしながら効率的に開発を行えます。 アーティファクト・レジストリ アーティファクト・レジストリは、ソフトウェア開発パッケージを格納、共有および管理するためのOCIのサービスです。OCI DevOpsと統合して利用します。 詳細はこちらのページをご確認ください。 コンテナレジストリ コンテナレジストリは、コンテナイメージを保存および共有するための専用のレジストリです。OCIには、Oracle...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/devops-for-beginners-oke/",
        "teaser": null
      },{
        "title": "Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-Oracle Functions編-",
        "excerpt":"OCI DevOps は、OCI 上に CI/CD 環境を構築するマネージドサービスです。このハンズオンでは、Oracle Functions に対する CI/CD パイプラインの構築手順を記します。 Oracle Functions について Oracle Functions は、Oracle Cloud Infrastructure(OCI)で提供される、Function as a Service です。詳細は、https://www.oracle.com/jp/cloud-native/functions/ をご確認ください。 前提条件 環境 OCI DevOps事前準備が完了していること Oracle Functionsことはじめが完了していること 全体構成 本ハンズオンでは、以下のような環境を構築し、ソースコードの変更が Oracle Functions に自動的に反映されることを確認します。 事前準備の流れ 1.OCIR の作成 2.ハンズオンに使用する資材のセットアップ 3.アプリケーションの動作確認 1.OCIR の作成 Oracle Functions のコンテナイメージの保存先である OCIR(Oracle Cloud Infrastructure Registry)を作成します。OCI Console 左上のハンバーガーメニューから、開発者サービス...","categories": [],
        "tags": ["devops","functions"],
        "url": "/ocitutorials/cloud-native/devops-for-beginners-functions/",
        "teaser": null
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)をプロビジョニングしよう",
        "excerpt":"マネージドKubernetesサービスであるOralce Container Engine for Kubernetes(OKE)を中心とした、コンテナ・ネイティブなサービス群です。 Oracle Container Engine for Kubernetes（以下OKE）は、OracleのマネージドKubernetesサービスです。この共通手順では、OCIやOKEを操作するためCLI実行環境の構築（Resource Managerを使用）と、OKEを使ってKubernetesクラスターをプロビジョニングするまでの手順を記します。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること ハンズオン環境のイメージ 1.OKEクラスターのプロビジョニング ここでは、OKEクラスターのプロビジョニングを行います。ここでの手順を実施することにより、OKEのコントロールプレーンとKubernetesクラスターの構築が同時に行われます。 はじめに、OCIコンソール画面左上のハンバーガーメニューを展開し、開発者サービス⇒Kubernetes Clusters (OKE)を選択します。 クラスタ一覧画面で、クラスタの作成をクリックします。 次のダイアログでクイック作成を選択し、ワークフローの起動をクリックします。 次のダイアログで、任意の名前を入力し、バージョンを選択します。ここではデフォルトのまま進めていきます。 Kubernetes APIエンドポイントには今回はデフォルトのパブリック・エンドポイントを選択します。 Kubernetes APIエンドポイントについて 管理者は、クラスタのKubernetes APIエンドポイントを、プライベート・サブネットまたはパブリック・サブネットに構成することができます。 VCNルーティングとファイアウォール・ルールを使うことで、Kubernetes APIエンドポイントへのアクセスを制御し、オンプレミスもしくは同一VCN上に構築した踏み台サーバからのみアクセス可能にすることができます。 Kubernetesワーカー・ノードには今回プライベートを選択します。これは、 ワークロードに応じて、ワーカーノードにパブリックIPを付与する必要がある場合は、パブリックを選択してください。 Kubernetesワーカー・ノードについて プライベートかパブリックによって、ワーカーノードに付与されるIPアドレスの種類が変わります。 プライベートは、ワーカーノードがプライベートIPのみを付与された状態でプロビジョニングを行います。 ワーカーノードにパブリックIPを付与する必要がある場合は、パブリックを選択してください。 シェイプには、今回VM.Standard.E3.Flexを選択します。 このシェイプは、OCPUとメモリ(RAM)を柔軟に変更することができるようになっています。 今回は、1oCPU/16GBで作成します。 シェイプについて OKEでは、VM、ベアメタル、GPU、HPCなどの様々なシェイプをご利用頂くことができます。 また、プロセッサ・アーキテクチャとしても、Intel/AMD/ARMベースのインスタンスから選択頂くことができます。 ワークロードに応じて、適切なシェイプを選択してください。 ノードの数はワーカーノードの数を指定します。デフォルトで「3」が指定されていますが、本ハンズオンでは最小構成である「1」に変更してください。 ノード数について ノードはリージョン内の可用性ドメイン全体（または、東京リージョンなど単一可用性ドメインの場合、その可用性ドメイン内の障害ドメイン全体）に可能な限り均等に分散されます。 実運用の際は可用性を考慮し、適切なノード数を指定してください。 そして、ダイアログの下まで移動し次をクリックします。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/oke-for-commons/",
        "teaser": null
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)でKubernetesを動かしてみよう",
        "excerpt":"Oracle Container Engine for Kubernetes（以下OKE）は、OracleのマネージドKubernetesサービスです。 このハンズオンでは、OKEにサンプルアプリケーションをデプロイするプロセスを通して、Kubernetesそのものの基本的な操作方法や特徴を学ぶことができます。 このカテゴリには以下のサービスが含まれます。 Oracle Container Engine for Kubernetes (OKE): フルマネージドなKuberentesクラスターを提供するクラウドサービスです。 Oracle Cloud Infrastructure Registry (OCIR): フルマネージドなDocker v2標準対応のコンテナレジストリを提供するサービスです。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること OKEハンズオン事前準備を実施済みであること 1.コンテナイメージの作成 ここでは、サンプルアプリケーションが動作するコンテナイメージを作成します。 1.1. ソースコードをCloneする 今回利用するサンプルアプリケーションは、oracle-japanのGitHubアカウント配下のリポジトリとして作成してあります。 サンプルアプリケーションのリポジトリにアクセスして、Codeボタンをクリックします。 ソースコードを取得する方法は2つあります。一つはgitのクライアントでCloneする方法、もう一つはZIPファイル形式でダウンロードする方法です。ここでは前者の手順を行いますので、展開した吹き出し型のダイアログで、URLの文字列の右側にあるクリップボード型のアイコンをクリックします。 これにより、クリップボードにURLがコピーされます。 Cloud ShellまたはLinuxのコンソールから、以下のコマンドを実行してソースコードをCloneします。 git clone [コピーしたリポジトリのURL] 続いて、Cloneしてできたディレクトリをカレントディレクトリにしておきます。 cd cowweb-for-wercker-demo 1.2. コンテナイメージを作る コンテナイメージは、Dockerfileと呼ばれるコンテナの構成を記述したファイルによって、その内容が定義されます。 サンプルアプリケーションのコードには作成済みのDockerfileが含まれていますので、その内容を確認してみます。以下のコマンドを実行してください。 cat Dockerfile # 1st...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/oke-for-beginners/",
        "teaser": null
      },{
        "title": "KubernetesでサンプルアプリケーションのデプロイとCI/CDを体験してみよう",
        "excerpt":"このワークショップでは、OCI DevOpsを利用してCI/CDパイプラインをセットアップし、Oracle Autonomous Transaction ProcessingをデータソースとしたJavaアプリケーションをOracle Container Engine for Kubernetes（OKE）にデプロイする一連の流れを体験することができます。 このワークショップには以下のサービスが含まれます。 Oracle Container Engine for Kubernetes（略称：OKE）: マネージドなKuberentesクラスタを提供するクラウドサービスです。 Oracle Autonomous Transaction Processing（略称：ATP）: 運用がすべて自動化された自律型データベースサービスです。 Oracle Cloud Infrastructure DevOps（略称：OCI DevOps）: Oracle Cloudが提供するマネージドなCI/CDサービスです。 Oracle Cloud Infrastructure Registry（略称：OCIR）: フルマネージドなDocker v2標準対応のコンテナレジストリを提供するサービスです。 Oracle Cloud Infrastructure Artifact Registry: フルマネージドな非コンテナイメージの成果物を格納できるレポジトリサービスです。 前提条件 ワークショップを開始する前に以下を準備してください。 Oracle Cloudのアカウントを取得済みであること OKEハンズオン事前準備を実施済みであること Oracle Cloud Infrastructureの基本操作はチュートリアル : OCIコンソールにアクセスして基本を理解するをご確認ください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/oke-for-intermediates/",
        "teaser": null
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)でサンプルマイクロサービスアプリケーションをデプロイしてオブザバビリティツールを利用してみよう",
        "excerpt":"このハンズオンでは、Oracle Container Engine for Kubernetes（以下OKE）上に、マイクロサービスアプリケーションをデプロイします。そして、OSSのオブザバビリティツールを利用して、モニタリング、ロギング、トレーシングを実践的に学びます。 オブザバビリティツールとして、以下を利用します。 モニタリング Prometheus + Grafana ロギング Grafana Loki トレーシング Jaeger サービスメッシュオブザバビリティ Kiali ハンズオンの流れは以下となります。 OKEクラスタ構築 OCIダッシュボードからOKEクラスタの構築 Cloud Shellを利用してクラスタを操作 サービスメッシュとオブザバビリティ環境構築 Istio（addon: Prometheus, Grafana, Jaeger, Kiali）インストール Grafana Loki インストール Grafana Lokiのセットアップ node exporterのインストール Prometheus WebUIからPromQLの実行 サンプルアプリケーションでObservabilityを体験してみよう サンプルアプリケーションの概要説明 サンプルアプリケーションのビルドとデプロイ Grafana Lokiを利用したログ監視 Jaegerを利用したトレーシング Kialiを利用したService Meshの可視化 Istioを利用したカナリアリリース カナリアリリース 1.OKEクラスタ構築 1-1 OCIダッシュボードからOKEクラスタの構築...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/oke-for-advances/",
        "teaser": null
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)でサンプルマイクロサービスアプリケーションをデプロイしてOCIのオブザバビリティサービスを利用してみよう",
        "excerpt":"このハンズオンでは、Oracle Container Engine for Kubernetes（以下OKE）上に、マイクロサービスアプリケーションをデプロイします。そして、OCIのObservabilityサービスを利用して、モニタリング、ロギング、トレーシングを実践的に学びます。 OCIのObservabilityサービスとして、以下を利用します。 モニタリング Oracle Cloud Infrastructure Monitoring メトリックおよびアラーム機能を使用してクラウド・リソースを積極的および受動的にモニター可能なフルマネージドサービスです。 ロギング Oracle Cloud Infrastructure Logging 監査ログ、サービス・ログ、カスタム・ログに対応した、スケーラビリティの高いフルマネージド型のロギングサービスです。 トレーシング Oracle Cloud Infrastructure Application Performance Monitoring アプリケーションをモニターし、パフォーマンスの問題を診断するための包括的な機能セットが組み込まれたフルマネージドサービスです。 Oracle Cloud Observability and Management Platformについて このハンズオンで利用するサービスは、Oracle Cloud Observability and Management Platform(以下、O&amp;M)を構成するコンポーネントの一部です。 O&amp;Mには、このハンズオンで利用するサービスの他にも、オンプレミスおよびマルチクラウド環境からすべてのログ・データを監視、集計、インデックス作成、分析可能なLogging Analytics、Oracle Enterprise Managerの主要な機能をクラウドサービスとして提供するDatabase Managementなどがあります。 ハンズオンの流れは以下となります。 OKEクラスタ構築とOCIRセットアップ OCIダッシュボードからOKEクラスタの構築 Cloud Shellを利用してクラスタを操作 OCIRのセットアップ Application...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/oke-observability-for-advances/",
        "teaser": null
      },{
        "title": "Fn Project ハンズオン",
        "excerpt":"Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。 このハンズオンでは、Fn Projectの環境構築から動作確認までの手順を記します。 前提条件 クラウド環境 有効なOracle Cloudアカウントがあること OCIチュートリアル その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること OCIチュートリアル その3 - インスタンスを作成する を通じてコンピュートインスタンスの構築が完了していること 1.Fn Project実行環境の構築 ここでは、前提条件のハンズオンで作成したコンピュートインスタンス上に、Fn Projectを実行するための環境構築を行います。 前提条件のハンズオンで作成したコンピュートインスタンス上に任意のターミナルソフトでSSHログインします。 1-1. Dockerのインストール ログインしたら、以下のコマンドを実行します。 sudo yum install -y yum-utils sudo yum -y update yumレポジトリをセットアップします。 sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo Dockerパッケージをインストールします。 sudo yum install -y docker-ce docker-ce-cli containerd.io これでDockerのインストールは完了です。 以下のコマンドでDocker...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/fn-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Functions ハンズオン",
        "excerpt":"Oracle Functionsは、Oracleが提供するオープンソースのFaaSプラットフォームであるFn Projectのマネージドサービスです。 このエントリーでは、Oracle Functions環境構築から動作確認までの手順を記します。 条件 クラウド環境 有効なOracle Cloudアカウントがあること Fn Projectハンズオンが完了していること(このハンズオンの理解を深めるため) 事前準備 注意事項: コンパートメントについて Oracle Cloudにはコンパートメントという考え方があります。 コンパートメントは、クラウド・リソース(インスタンス、仮想クラウド・ネットワーク、ブロック・ボリュームなど)を分類整理する論理的な区画で、この単位でアクセス制御を行うことができます。 また、OCIコンソール上に表示されるリソースのフィルタとしても機能します。 今回は、ルートコンパートメントと呼ばれるすべてのリソースを保持するコンパートメントを利用するので、特に意識する必要がありません。 注意事項: ポリシーについて Oracle Cloudでは、各ユーザーから各サービスへのアクセスおよび各サービスから他サービスへアクセスを「ポリシー」を利用して制御します。ポリシーは、各リソースに誰がアクセスできるかを指定することができます。 このハンズオンでは、テナンシ管理者を想定してポリシーを設定していきます。 注意事項: リージョンとリージョンコードについて Oracle Cloudでは、エンドポイントやレジストリにアクセスする際にリージョンおよびリージョンコードを使用する場合があります。 以下に各リージョンと対応するリージョンコードを記載します。 本ハンズオンでは、OCI CLIのセットアップおよびOCIRのログイン時に使用します。 リージョン リージョンコード ap-tokyo-1 nrt ap-osaka-1 kix ap-melbourne-1 mel us-ashburn-1 iad us-phoenix-1 phx ap-mumbai-1 bom ap-seoul-1 icn ap-sydney-1 syd ca-toronto-1...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/functions-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Cloud Infrasturcture API Gateway + Oracle Functionsハンズオン",
        "excerpt":"このハンズオンでは、OCI API GatewayとOracle Functionsを組み合わせて、簡単なアプリケーションを開発する手順をご紹介します。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること 1.サンプルアプリケーションのデプロイ ここでは、サンプルアプリケーションのデプロイを行います。 ここでデプロイするFunctionは、渡されたパラメータを使用して、QRコードの画像を作成するアプリケーションです。 まずは、githubからハンズオン用の資材をcloneします。 Oracle Functionsことはじめで利用したCloud Shellにログインします。 Gitコマンドは既にCloud Shellにインストールされています。 以下のコマンドを実行します。 git clone https://github.com/oracle-japan/apigw-functions-handson.git apigw-functions-handsonディレクトリに移動します。 cd apigw-functions-handson Oracle Functionsを使用してFunctionをデプロイします。 fn-generate-qrcodeディレクトリに移動します。 cd fn-generate-qrcode fn-generate-qrcodeをデプロイします。 fn -v deploy --app helloworld-app 最後に以下のような出力が得られます： ~~~略~~~ Updating function fn-generate-qrcode using image nrt.ocir.io/xxxxxxxx/workshop/fn-generate-qrcode:0.0.2... Successfully created...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/functions-apigateway-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Functionsを利用した仮想マシン (VM) のシェイプ変更",
        "excerpt":"このハンズオンでは、想定したメモリ使用率を超える仮想マシン (VM) のシェイプをOracle Functionsを利用して動的に変更する手順を記載します。 ハンズオン環境について このハンズオンでは、動作確認のために意図的にVMのメモリ使用率を上昇させるコマンドを使用します。そのため、商用環境などでは絶対に行わないでください。 また、使用する仮想マシン (VM) についてもテスト用として用意したものを使用するようにしてください。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること このハンズオンが完了すると、以下のようなコンテンツが作成されます。 1.事前準備 このステップでは、Oracle Functionsから仮想マシン (VM) を操作するための動的グループとポリシーの設定を行います。 動的グループおよびポリシーについて 動的グループを使用すると、Oracle Cloud Infrastructureコンピュータ・インスタンスを(ユーザー・グループと同様に)プリンシパルのアクターとしてグループ化し、ポリシーを作成できます。 そうすることで、インスタンスがOracle Cloud Infrastructureサービスに対してAPIコールを実行できるようにします。 詳細は動的グループの管理をご確認ください。 OCIコンソールのハンバーガーメニューをクリックして、[アイデンティティとセキュリティ]⇒[動的グループ]に移動し、「動的グループの作成」をクリックします。 以下項目を入力して、「作成」をクリックします。 名前：動的グループの名前。今回は、func_dyn_grp 説明：動的グループの説明。今回は、Function Dynamic Group ルール1：ALL {resource.type = 'fnfunc', resource.compartment.id = '&lt;compartment-ocid&gt;'}(compartment.idは各自で使用するコンパートメントOCIDへ変更してください。) コンパートメントOCIDについて [アイデンティティ]⇒[コンパートメント]に移動して、使用するコンパートメント(今回はルートコンパートメント)を開いて、該当OCIDを確認します。 OCIコンソールのハンバーガーメニューをクリックして、[アイデンティティとセキュリティ]⇒[ポリシー]に移動し、「ポリシーの作成」をクリックします。 以下項目を入力して、「作成」をクリックします。 名前：ポリシーの名前。今回は、fn-policies...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/functions-vmshape-for-intermediates/",
        "teaser": null
      },{
        "title": "Oracle Functionsを利用したORDSでのデータベースアクセス",
        "excerpt":"このセッションでは、Oracle FunctionsからORDS(Oracle REST Data Services)という仕組みを利用してATPに接続し、データを取得する方法について説明します。 ORDSはデフォルトでATPに組み込まれている仕組みです。 ORDSについて ATPはORDSを利用してRESTfulインターフェースでのアクセスを行うことができます。 ORDS(Oracle REST Data Services)の詳細についてはAutonomous Databaseを使用したOracle REST Data Servicesの開発をご確認ください。 このハンズオンが完了すると、以下のようなコンテンンツが出来上がります。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること ローカル端末にSQL Developerがインストールされていること ダウンロードはこちらから 1.事前準備 ここでは、ATPのプロビジョニングとORDSの設定を行います。 1-1.ATPのプロビジョニング OCIコンソールのハンバーガーメニューから[データベース]で、[Autonomous Transaction Processing]をクリックします。 Autonomous Databaseの作成画面で、使用するコンパートメントを選択して、「Autonomous Databaseの作成」をクリックします。 以下項目を入力して、「Autonomous Databaseの作成」をクリックします。 コンパートメント：使用するコンパートメントを選択。 表示名：表示名を入力。今回は、Workshop ATP。 データベース名：今回は、WORKSHOPATP。 ワークロード・タイプの選択：トランザクション処理 デプロイメント・タイプ：共有インフラストラクチャ データベース・バージョンの選択：19c OCPU数：1 ストレージ(TB)：1 自動スケーリング：チェックをオフ。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/functions-ords-for-intermediates/",
        "teaser": null
      },{
        "title": "Oracle Functionsを利用したNoSQLデータベースアクセス",
        "excerpt":"Oracle NoSQL Database Cloud Serviceは、大容量データを高速に処理するフルマネージドデータベースクラウドサービスです。ドキュメント、カラムナー、キーと値のペアなどのデータ・モデルをサポートし、すべてのトランザクションはACIDに準拠しています。 このハンズオンでは、Oracle FunctionsをOracle NoSQL Database Cloud Serviceに接続して、テーブルを作成し、データを登録する方法について説明します。 今回は、Oracle OCI SDKのリソースプリンシパルという仕組みを利用して、Oracle FunctionsからOracle NoSQL Database Cloud Serviceにアクセスしてみます。 リソースプリンシパルについて Oracle Functionsでのリソースプリンシパルの利用についてはファンクションの実行からのその他のOracle Cloud Infrastructureリソースへのアクセスをご確認ください。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること 1.事前準備 ここでは、リソースプリンシパルを利用するための動的グループおよびポリシーの作成を行います。 1-1. 動的グループの作成 OCIコンソールのハンバーガーメニューをクリックして、[アイデンティティとセキュリティ]から[動的グループ]に移動し、「動的グループの作成」をクリックします。 以下項目を入力して、「作成」をクリックします。 名前：動的グループの名前。今回は、func_dyn_grp 説明：動的グループの説明。今回は、Function Dynamic Group ルール1：ALL {resource.type = 'fnfunc', resource.compartment.id = '&lt;compartment-ocid&gt;'}(compartment-ocidはOracleFunctionsが利用するコンパートメントOCID。今回はルートコンパートメント。)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/functions-nosql-for-intermediates/",
        "teaser": null
      },{
        "title": "Oracle Functionsを利用したAPI Gatewayの認証",
        "excerpt":"このハンズオンでは、Oracle Functionsを利用してOCI API Gatewayが渡されたクライアントシークレットをチェックし、正しいクライアントシークレットが含まれているかどうかに基づいてリクエストを許可したり拒否したりするシンプルなAuthorizer Functionを作成します。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること Oracle Cloud Infrasturcture API Gateway + Oracle Functionsハンズオンが完了していること OCI API Gatewayでサポートしている認証および承認機能について OCI API Gatewayでは複数の認証方式をサポートしています。詳細はAPIデプロイメントへの認証と認可の追加をご確認ください。 このハンズオンが完了すると、以下のようなコンテンツが作成されます。 1.Oracle Funstionsのでデプロイ ここでは、Oracle Functionsの作成とデプロイを行います。 1-1.Oracle Functionの作成 Oracle OCIコンソールの左上にあるハンバーガーメニューをクリックして、[開発者サービス]⇒[ファンクション]に移動します。 Oracle Functionsに使用する予定のリージョンを選択します（Fn Project CLIコンテキストで指定されたDockerレジストリと同じリージョンを推奨します）。 ここでは、Ashburnリージョンus-ashburn-1を使用します。 利用するコンパートメントを選択します。 今回は、ルートコンパートメントを利用します。 [アプリケーションの作成]をクリックして、次を指定します。 名前：このアプリケーションに最初のFunctionをデプロイし、Functionを呼び出すときにこのアプリケーションを指定します。たとえば、fn-samples-app。 VCN：Functionを実行するVCN。今回は、Oracle Functionsハンズオンで作成したVCNを指定。 サブネット：Functionを実行するサブネット。今回は、Oracle Functionsハンズオンで作成したVCNのサブネットを指定。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/functions-apigateway-for-intermediates/",
        "teaser": null
      },{
        "title": "OCI API Gatewayハンズオン",
        "excerpt":"このハンズオンでは、OCI API Gatewayを利用して簡単にAPIを集約・公開する手順をご紹介します。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 1.OCI API Gatewayプロビジョニングのための事前準備 ここでは、OCI API Gatewayをプロビジョニングするための事前準備を行います。 1-1. VCNの作成 VCN作成済みの場合 VCNを作成済みの方は1-2.イングレス・ルールの追加に進んでください。 Oracle Cloudのダッシューボードにログインし、ダッシューボード画面のハンバーガメニューで”ネットワーキング” =&gt; “仮想クラウド・ネットワーキング”をクリックします。 表示された画面左下の”スコープ”内の”コンパートメント”をクリックし、ルートコンパートメントを選択します。ルートコンパートメントはOracle Cloudの登録時に設定した名称になります。既に選択されている場合は、この手順はスキップしてください。 “VCNウィザードの起動”をクリックします。 “VPN接続およびインターネット接続性を持つVCN”を選択し、”ワークフローの開始”をクリックします。 以下の情報を入力し、”次”をクリックします。 VCN名：任意の名前(こだわりがなければ”API Gateway Handson”) コンパートメント：ルートコンパートメント VCN CIDRブロック：10.0.0.0/16 パブリック・サブネットCIDRブロック：10.0.0.0/24 プライベート・サブネットCIDRブロック：10.0.1.0/24 “作成”をクリックし、作成が完了したら、”仮想クラウド・ネットワークの表示”をクリックします。 作成したVCNが確認できれば、VCN(ネットワーク)の作成は終わりです。 1-2. イングレス・ルールの追加 OCI API Gatewayは、デフォルトでは開いていないポート443で通信します。 ポート443のトラフィックを許可するには、サブネットに対してイングレス・ルールを追加する必要があります。 OCIコンソールにログインし、[ネットワーキング]に移動して、[仮想クラウド・ネットワーク]をクリックします。 [コンパートメント]からOCI API Gatewayで利用するコンパートメント(今回はルートコンパートメント)を選択して、OCI API Gatewayで利用するVCNリンクをクリックします。 OCI API...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/apigateway-for-beginners/",
        "teaser": null
      },{
        "title": "OCI Service Meshを使ってサービスメッシュ環境を作ろう",
        "excerpt":"Oracle Cloud Infrastructure(OCI) Service Meshはインフラストラクチャ・レイヤーで、セキュリティ、トラフィック制御、およびオブザーバビリティ機能をアプリケーションに提供します。 OCI Service Meshを使用すると、クラウドネイティブ・アプリケーションの開発と運用が容易になります。 このチュートリアルでは、BookinfoアプリケーションをOracle Container Engine for Kubernetes(OKE)クラスターにデプロイします。 次に、OCI Service Meshをアプリケーションのデプロイメントに追加します。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること 事前準備 まずは事前準備として以下を実施します。 1.証明書サービスの構築 1-1.証明書と認証局の作成 1-2.コンパートメント・認証局・証明書のOCIDの取得 2.動的グループとポリシーの作成 OCI Service Meshや証明書サービスに関連する動的グループとポリシーの作成 3.Oracle Container Engine for Kubernetes(OKE)クラスターの構築 3-1.OSOK(Oracle Service Operator for Kubernetes)のインストール 3-2.メトリクス・サーバーのインストール 1.証明書サービスの構築 ここでは、OCI Service MeshでTLS（Transport Layer Security）通信を行うために必要な証明書と認証局を作成します。 1-1. 認証局と証明書の作成 証明書サービスの構築について、こちらを実施してください。 1-2.コンパートメント・認証局・証明書のOCIDの取得...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/osm-for-beginners/",
        "teaser": null
      },{
        "title": "Helidon(MP)を始めてみよう",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracleでは、マイクロサービスの開発に適した軽量なJavaアプリケーションフレームワークとしてHelidonを開発しています。 Helidonは、SEとMPという2つのエディションがあります。 このチュートリアルでは、MicroProfile準拠のエディションであるMPの方を取り上げていきます。 MicroProfileについて MicroProfileは、マイクロサービス環境下で複数言語との相互連携を保ちながら、サービスを構築するために複数ベンダーによって策定されているJavaの標準仕様のことです。 詳細はこちらをご確認ください。 前提条件 こちらの手順が完了していること このチュートリアルでは、データベースとしてOracle Cloud Infrastructure上の自律型データベースであるAutonomous Transaction Processing(以降、ATPとします)を利用します こちらの1. クレデンシャル・ウォレットのダウンロードの手順が完了していること このチュートリアルでは、ATPに接続するためにクレデンシャル・ウォレットを利用します。事前にクレデンシャル・ウォレットをダウンロードしてください 実施する手順は1. クレデンシャル・ウォレットのダウンロードのみで問題ありません ハンズオン環境にApache Mavenがインストールされていること(バージョン3以上) ハンズオン環境にJDK 11以上がインストールされていること 合わせて環境変数(JAVA_HOME)にJDK 11のパスが設定されていること Helidonのビルドおよび動作環境について Helidon2.xをビルドおよび動作させるにはJDK 11以上が必要です。 1.Helidon CLIでベースプロジェクトを作成してみよう ここでは、Helidon CLIを利用して、ベースプロジェクトを作成してみます。 HelidonをセットアップするにはHelidon CLIが便利です。 このチュートリアルでは、Linux環境の前提で手順を進めますが、WindowsやMac OSでも同じようにインストールすることができます。 まずは、curlコマンドを利用してバイナリを取得し、実行可能な状態にします。 curl -O https://helidon.io/cli/latest/linux/helidon chmod +x ./helidon sudo mv...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/helidon-mp-for-beginners/",
        "teaser": null
      },{
        "title": "Helidon(SE)を始めてみよう",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracleでは、マイクロサービスの開発に適した軽量なJavaアプリケーションフレームワークとしてHelidonを開発しています。 Helidonは、SEとMPという2つのエディションがあります。 このチュートリアルでは、マイクロフレームワークのエディションであるSEの方を取り上げていきます。 前提条件 ハンズオン環境にApache Mavenがインストールされていること(バージョン3以上) ハンズオン環境にJDK 17以上がインストールされていること 合わせて環境変数(JAVA_HOME)にJDK 17以上のパスが設定されていること Helidonのビルドおよび動作環境について Helidon3.xをビルドおよび動作させるにはJDK 17以上が必要です。 1.Helidon CLIでベースプロジェクトを作成してみよう ここでは、Helidon CLIを利用して、ベースプロジェクトを作成してみます。 HelidonをセットアップするにはHelidon CLIが便利です。 このチュートリアルでは、Linux環境の前提で手順を進めますが、WindowsやMac OSでも同じようにインストールすることができます。 まずは、curlコマンドを利用してバイナリを取得し、実行可能な状態にします。 curl -O https://helidon.io/cli/latest/linux/helidon chmod +x ./helidon sudo mv ./helidon /usr/local/bin/ これで、Helidon CLIのインストールは完了です！ 上記が完了すると、helidonコマンドが利用可能になります。 まず初めに、initコマンドを叩いてみましょう。 helidon init ベースプロジェクトを構築するためのインタラクティブなプロンプトが表示されます。 以下のように入力していきます。 項目 入力パラメータ 備考 Helidon...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/helidon-se-for-beginners/",
        "teaser": null
      },{
        "title": "WebLogic Server for OCIをプロビジョニングしてみよう",
        "excerpt":"前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること ハンズオンの全体像 WebLogic Server for OCI(UCM)環境を作成します アプリケーションが利用するAutonomous Databaseを作成します WebLogicにデータベースの設定を行います WebLogicにアプリケーションをデプロイします 事前準備 1. SSHキーペアを用意する 任意のSSHキーペアをご用意ください。 新たに作成する場合は、左上のハンバーガーメニューを展開して、「コンピュート」から「インスタンス」を選択し、「インスタンスの作成」をクリックします。 作成画面より、SSHキーの「秘密キー」と「公開キー」の両方をダウンロードし、利用します。 2. OCI VaultでSecretを作成する WebLogic Server for OCIでは、WebLogic作成時の管理用パスワードはOCI Vaultにて管理します。 左上のハンバーガーメニューを展開して、「アイデンティティとセキュリティ」から「ボールト」を選択します。 「ボールトの作成」をクリックします。 名前に「handson vault」と入力し、「ボールトの作成」をクリックします。 ボールトの作成には数分かかる場合があります。適宜ブラウザの更新を行ってください。 作成したボールト名をクリックし、「キーの作成」をクリックします。 名前に「handson key」と入力し、「キーの作成」をクリックします。 「シークレット」をクリックし、「シークレットの作成」をクリックします。 名前に「wlsadmin」と入力し、暗号化キーは「handson key」を選択し、シークレットコンテンツは「welcome1」と入力し、「シークレットの作成」をクリックします。 3. アプリケーションの取得 こちらより、本ハンズオンで利用するアプリケーションをダウンロードしてください。 4. OCI IAMで権限の設定を行う(Optional) WebLogic Server for OCI の利用には以下の2種類のポリシー設定が必要です。 あらかじめこれらの権限設定を実施した上で、WebLogic...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/wls-for-oci-provisioning/",
        "teaser": null
      },{
        "title": "WebLogic Server for OCIにアプリケーションを移行してみよう",
        "excerpt":"前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること WebLogic Server for OCIのプロビジョニングを実施済みであること このハンズオンでは以後この環境を「移行元環境」と呼びます ハンズオンの全体像 移行先環境で利用するデータベースのスキーマを作成 移行先環境となるWebLogic Server for OCIを移行元環境と同一サブネットに作成 移行元環境より移行ファイルを抽出 移行ファイルを編集 移行先環境に移行ファイルを適用 Note: 移行元/移行先のデータベースに関して 本ハンズオンでは、移行元と移行先で同一データベースを利用しますが、異なるスキーマを利用します。実際の移行では、接続先となるデータベースそのものが異なる場合が考えられます。 Note: ツールで移行可能なファイル 本ハンズオンで利用する移行ツールのWebLogic Deploy Toolingでは、アプリケーション/アプリケーションの構成 以外のファイルは移行できません。 そのため、アプリケーションが利用するファイル(例: データベースウォレット)などの移行は手作業で行う必要があります。 本ハンズオンでは、データベースにAutonomous Databaseを利用しているため、データベースウォレットの手動移行が必要になります。 1.移行先環境で利用するデータベースのスキーマを作成 Note: 移行元/移行先のデータベースに関して この手順では、移行元と移行先で同一データベースのスキーマのみを変更しています。実際の移行では、接続先となるデータベースが異なる場合が考えられます。その場合、接続先のJDBC URLが異なる場合がございますので、ご注意ください 左上のハンバーガーメニューを展開して、「Oracle Database」から「Autonomous Transaction Processing」を選択します。 データベース・アクションをクリックします。 「ユーザー名」にADMIN、「パスワード」にWelcome1234!と入力します。※セッションの関係で、入力の必要がない場合があります。 「SQL」のパネルをクリックします。 以下のSQLをワークシートに貼り付け、F5を押下し全文を実行し、移行先環境が利用するスキーマを作成します。 -- USER SQL CREATE USER \"DEST\"...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/wls-for-oci-migration/",
        "teaser": null
      },{
        "title": "WebLogic Server for OKEをプロビジョニングしてみよう",
        "excerpt":"前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること ハンズオンの全体像 プロビジョニングの準備 WebLogic Server for OKE(UCM)環境をプロビジョニング WebLogic Server for OKEにドメインを作成 ハンズオンで作成されるリソース全体 WebLogic Server for OKEでは、様々なリソースが自動で構成されます。 以下は作成されるリソースの全体像になります。 1.プロビジョニングの準備 1.1. コンパートメントの作成 WebLogic Server for OKEの環境をプロビジョニングするコンパートメントを作成します。 左上のナビゲーション・メニューを展開して、「コンパートメント」を選択してください。 「コンパートメントの作成」をクリックし、「wls4oke」コンパートメントを作成します。 ※作成したコンパートメントのOCIDをコピーしてメモなどに貼り付けておいてください。 1.2. 動的グループの作成 WebLogic Server for OKEのプロビジョニングで利用される動的グループを作成します。 左上のナビゲーション・メニューを展開して、「動的グループ」を選択してください。 動的グループの名前は「handson」とします。 一致ルールには以下のルールを記述してください。コンパートメントのOCIDは、1.1.でコピーしておいたものを利用してください。 instance.compartment.id = &lt;作成したコンパートメントのOCID&gt; 1.3. ポリシーの設定 WebLogic Server for OKEのプロビジョニングに必要なポリシーを作成します。 左上のナビゲーション・メニューを展開して、「ポリシー」を選択してください。 まずは「ルート・コンパートメント」に以下のポリシーを作成します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/wls-for-oke-provisioning/",
        "teaser": null
      },{
        "title": "Oracle Transaction Manager for Microservices(MicroTx)を体験してみよう",
        "excerpt":"このチュートリアルでは、別々のデータベースを持つ2つのサンプルアプリケーション間の分散トランザンクションについて、Oracle Transaction Manager for Microservices(MicroTx)を利用しながら一貫性を確保する体験をしていただく内容になっています。 このチュートリアルには以下のサービスが含まれます。 Oracle Container Engine for Kubernetes（略称：OKE）: マネージドなKuberentesクラスタを提供するクラウドサービスです。 Oracle Transaction Manager for Microservices（略称：MicroTx）: Oracleが提供する分散トランザクションマネージャです。 Oracle Autonomous Transaction Processing（略称：ATP）: 運用がすべて自動化された自律型データベースサービスです。 MicroTxについて MicroTxは現在Free版での提供となり、商用環境ではご利用頂けません。(評価/検証目的でのご利用となります) 今回のハンズオンもFree版のMicroTxを利用します。 商用環境でご利用いただけるMicroTxは後日リリース予定です。 前提条件 チュートリアルを開始する前に以下を準備してください。 Oracle Cloudのアカウントを取得済みであること OKEハンズオン事前準備を実施済みであること Oracle Cloud Infrastructureの基本操作はチュートリアル : OCIコンソールにアクセスして基本を理解するをご確認ください。 ゴールを確認する はじめに、手順を最後まで実施したときにどのような環境が作られるか確認して、ゴールの全体像を掴んでおきましょう。 手順を最後まで行うと、下図のような環境が構成されます。 構成要素 説明 OKE アプリケーションのコンテナが稼働するクラスター本体です。OKEをプロビジョニングすると、Oracle Cloudの各種IaaS上に自動的に構成されます。 ATP 今回デプロイするサンプルアプリケーションが利用するデータベースです。今回は2つのアプリケーションそれぞれに1つずつATPを持ちます。 MicroTx 2つのアプリケーション間のトランザクション一貫性を確保するための分散トランザクションマネージャです。 この環境を構築後にサンプルアプリケーションを利用して、MicroTxを利用したトランザクション制御を体験して頂きます。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/microtx-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Content Managementインスタンスを作成する",
        "excerpt":"この文書は Oracle Content Management(OCM) のインスタンス作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.10.2)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 1. 準備 1.1 OCM インスタンス作成手順の説明 インスタンスの作成手順は以下の通りです このチュートリアルでは、以下の条件で作成します ホームリージョンは US East(Ashburn) を選択 インスタンスの作成ユーザーは テナント管理ユーザー コンパートメントを作成(コンパートメント名=OCE) ライセンス・タイプは Premium Edition を選択 1.2 Oracle Cloud の環境を準備する Oracle Cloud のアカウントを準備します。無料のトライアル環境も利用することもできますので、この機会に取得してみましょう。 なお、トライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です（希望しない限り課金されませんので、ご安心ください） Oracle Cloud 無料トライアルを申し込む トライアル環境のサインアップ手順はこちらをご確認ください。 Oracle Cloud 無料トライアル・サインアップガイド(PDF) Oracle Cloud 無料トライアルに関するよくある質問(FAQ) 1.3 Oracle Cloud にサイン・インする OCM インスタンスは、Oracle...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/create_oce_instance/",
        "teaser": "/ocitutorials/content-management/create_oce_instance/022.webp"
      },{
        "title": "Oracle Content Management インスタンスの利用ユーザーを作成する",
        "excerpt":"この文書は Oracle Content Management (OCM) を利用するユーザーをIDCSに追加する方法をステップ・バイ・ステップで紹介するチュートリアルです。 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.10.2)を元に作成されてます チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する 1. ユーザーとグループの作成 OCM インスタンスを利用するユーザーは、IDCS ユーザー として登録します。ここでは、IDCS ユーザーに IDCS グループを利用し、OCM インスタンスのアプリケーションロール(CECEnterpriseUser)を割り当てる手順を説明します IDCS グループは、組織内の役割にあわせて作成します。下記マニュアルを参考に作成します。 Administrating Oracle Content Management Typical Organization Roles（英語原本） 一般的な組織ロール（日本語翻訳版） 1.1 IDCS グループの作成 IDCS グループを作成します。ここでは OCEusers グループを作成します OCI コンソールを開き、左上のメニュー→ 「アイデンティティ」→「フェデレーション」 をクリックします Oracle Identity Cloud Service Console...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/create_idcs_group_user/",
        "teaser": "/ocitutorials/content-management/create_idcs_group_user/user10.webp"
      },{
        "title": "OCI IAM Identity Domain環境でOracle Content Managementインスタンスを作成する",
        "excerpt":"この文書は OCI IAM Identity Domain環境 でOracle Content Management(OCM)のインスタンス作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 なお、IDCS環境でOCMインスタンスを作成する場合は、Oracle Content Managementインスタンスを作成するをご参照ください 【お知らせ】 この文書は、2022年7月時点での最新バージョン(22.7.2)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 1. 準備 1.1 OCM インスタンス作成手順の説明 インスタンスの作成手順は以下の通りです このチュートリアルでは、以下の条件で作成します ホームリージョンは Japan East(Tokyo) を選択 インスタンスの作成ユーザーは テナント管理ユーザー ドメインは Default コンパートメントを作成(コンパートメント名=OCM) ライセンス・タイプは Premium Edition を選択 1.2 Oracle Cloud の環境を準備する Oracle Cloud のアカウントを準備します。無料のトライアル環境も利用することもできますので、この機会に取得してみましょう。 なお、トライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です（希望しない限り課金されませんので、ご安心ください） Oracle Cloud 無料トライアルを申し込む トライアル環境のサインアップ手順はこちらをご確認ください。 Oracle Cloud 無料トライアル・サインアップガイド(PDF) Oracle...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/create_ocm_instance_IdentityDomain/",
        "teaser": "/ocitutorials/content-management/create_ocm_instance_IdentityDomain/015.jpg"
      },{
        "title": "OCI IAM Identity Domain環境でOracle Content Managementインスタンスの利用ユーザーを作成する",
        "excerpt":"この文書は OCI IAM Identity Domain環境 でOracle Content Management (OCM) を利用するユーザーを作成する方法をステップ・バイ・ステップで紹介するチュートリアルです。 なお、IDCS環境でユーザーを作成する場合は、Oracle Content Management インスタンスの利用ユーザーを作成するをご参照ください。 【お知らせ】 この文書は、2022年7月時点での最新バージョン(22.7.2)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 OCI IAM Identity Domain環境でOracle Content Management インスタンスを作成する 1. ユーザーとグループの作成 OCM インスタンスを利用するユーザーは、ODI IAM Identity Domainのユーザー として登録します。ここでは、ドメイン内に作成したユーザーにグループを利用し、OCM インスタンスのアプリケーションロール(CECEnterpriseUser)を割り当てる手順を説明します グループは、組織内の役割にあわせて作成します。下記マニュアルを参考に作成します。 Administrating Oracle Content Management Typical Organization Roles（英語原本） 一般的な組織ロール（日本語翻訳版） 1.1 グループの作成 グループを作成します。ここでは Default ドメイン内に OCMusers グループを作成します...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/create_identitydomain_group_user/",
        "teaser": "/ocitutorials/content-management/create_identitydomain_group_user/016.jpg"
      },{
        "title": "Oracle Content Managementサービス管理者向け作業ガイド",
        "excerpt":"この文書はOCMインスタンス作成後、利用者への周知・案内をする前にサービス管理者が必ず作業・確認すべき管理設定を紹介します。 【お知らせ】 この文書は、2023年6月時点での最新バージョン(23.5.2)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 OCI IAM Identity Domain環境でOracle Content Management インスタンスを作成する 1. インスタンス共通の管理設定ガイド OCMインスタンスを作成したら、必ず作業・確認すべき管理設定を紹介します 1.1 ブランディング OCMのWebユーザーインタフェースのロゴやfavicon、ロゴ右隣のブランディング・テキストを変更できます。 ブランディングテキストは、組織内におけるOCMインスタンスの名称（呼称）を、短くわかりやすい言葉で表現する際に利用します サービス管理者権限が付与されたユーザーでOCMインスタンスにサインインします 左ナビゲーションメニューの ADMINISTRATION:システム→一般を選択します ブランディングのコーポレート・ブランディング・テキストでカスタムを選択し、表示するテキストを入力します 【TIPS】 ブランディングテキストを非表示としたい場合は、カスタムを選択し、入力エリアを空白のままとします 企業アイコンで変更をクリックし、表示したいfaviconを設定します 企業ロゴで変更をクリックし、表示したいロゴ画像を設定します 画面を下にスクロールし、保存をクリックします ロゴとブランディングテキストが変更されます 【関連ドキュメント】 Apply Custom Branding and URLs (※日本語翻訳) 1.2 通知 ユーザーへの通知メールの有効/無効を設定します。デフォルトは全て「有効」です。 なお、通知メールのデザインや本文のカスタマイズはできませんが、1.1ブランディングで設定した企業ロゴおよびブランディングテキストが通知メールに設定されます 左ナビゲーションメニューの ADMINISTRATION:システム→一般を選択します 通知の有効・無効を選択します。それぞれの通知設定は以下の通りです ようこそ電子メール通知: ユーザーがOCMインスタンスに追加された時に電子メールが通知されます。通知メールはユーザーに割り当てられるアプリケーションロールによってカスタマイズされます タクソノミ電子メール通知:　タクソノミのプロモート、公開、削除の時に電子メールが通知されます。通知メールはタクソノミが割り当てられているリポジトリにアクセスできるユーザーに対して送信されます 他のすべての電子メール通知: 会話機能でフラグが設定されたとき、フォルダにメンバー追加されたとき、など上記以外の他のイベント発生時に電子メールが通知されます 画面を下にスクロールし、保存をクリックします 【関連ドキュメント】...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/ocm_admin_guide/",
        "teaser": "/ocitutorials/content-management/ocm_admin_guide/001.jpg"
      },{
        "title": "Oracle Content Management のファイル共有機能を使ってみよう【初級編】",
        "excerpt":"この文書は Oracle Content Management (OCM) のファイル共有機能を利用する方法をステップ・バイ・ステップで紹介するチュートリアル集です。OCM の利用ユーザーとして、ファイル共有機能の基本操作を習得します 前提条件 Oracle Content Management インスタンスを作成する OCM インスタンスは Premium Edition で作成されていること OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること チュートリアル：Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM インスタンスにサインインする まずは、OCM インスタンスにサインインします。サインイン後は、自分が利用しやすいようにプリファレンスやプロファイルを設定します フォルダの作成 フォルダを作成し、ファイルを簡単に分類します。とても簡単にフォルダを作成できますので、まずは気軽に始めてみましょう ファイルの登録 ファイルはドラッグ＆ドロップ操作で簡単にアップロードできます。また、OCM ではファイルをバージョン管理します。新規バージョンのファイルをアップロード方法や古いバージョンのファイルを表示・取得する方法を習得します 圧縮ファイルによる複数ファイルの一括登録 圧縮ファイルをアップロードし、OCM内で解凍することで、フォルダ階層やファイルを簡単に作成したり、一度に複数ファイルの新規リビジョンをまとめて登録できます。ここでは、圧縮ファイルを利用した複数のフォルダやファイルを更新する方法を紹介します ファイルのプレビュー OCM 上にアップロードされたファイルは、ファイルをダウンロードすることなく、ブラウザ内でファイルの内容を確認（プレビュー）できます。ここでは、ファイルのプレビュー操作を習得します ファイルの削除と復元 OCM のドキュメント機能でファイル（およびフォルダ）を削除すると、それらはごみ箱に移動されます。また、ごみ箱内のファイル（フォルダ）は、ユーザー自身で手動による削除（完全に削除）、もしくは元のフォルダへの復元、ができます。ここでは、ファイルやフォルダの削除時の操作について習得します ファイルの編集 OCM のデスクトップ・アプリケーションがクライアント環境にインストールされている場合、ローカル環境の Office...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/using_file_sharing/",
        "teaser": "/ocitutorials/content-management/create_oce_instance/024.jpg"
      },{
        "title": "その1: OCM インスタンスにサインインする（Oracle Content Management のファイル共有機能を使ってみよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 まず最初に OCM インスタンスにサインインします。次に、OCM を使い始めるにあたり、自分が利用可能な容量を確認します。 最後に、プリファレンスやプロファイルを設定し、自分が使いやすいようにカスタマイズします 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. OCM インスタンスにサインインする 1.1 OCM ホームを開く OCM インスタンスにサインインします。OCM インスタンスの URL は、サービス管理者によるユーザー追加時に自動送信されるメールに記載されます 通知メールの説明 項目 説明 差出人 Oracle Content Management &lt;no-reply@oracle.com&gt; 件名 Welcome to Oracle Content...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/1_sign_in_oce/",
        "teaser": "/ocitutorials/content-management/1_sign_in_oce/007.jpg"
      },{
        "title": "その2: フォルダの作成（Oracle Content Management のファイル共有機能を使ってみよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM では、ローカル・コンピュータの場合とほぼ同じ方法でファイルを操作します。フォルダを利用してファイルを簡単にグループ化し、コンテンツ管理として提供される一般的な操作（ファイルおよびフォルダのアップロード、ダウンロード、コピー、移動、名前変更、削除など）を実行できます。 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. フォルダの作成 1.1 フォルダの作成 左ナビゲーションメニューの 「ドキュメント」 をクリックします 「作成」 をクリックします 「名前」 を入力します（ここでは「チュートリアルフォルダ」と入力） 必要に応じて、「説明」 にこのフォルダに関する説明文を入力します（ここでは「フォルダ共有チュートリアル用のフォルダです」と入力） 「作成」 をクリックします フォルダが作成されます。作成したフォルダ（ここではチュートリアルフォルダ）をクリックし、開きます フォルダの中に別のフォルダ（サブフォルダ）を作成する場合は、親となるフォルダ（ここでは「チュートリアルフォルダ」）を開いた状態で 「作成」 をクリックします 名前を入力し、「作成」 をクリックします。（ここでは「子フォルダ」と入力） サブフォルダが作成されます [Memo] 上記のように、フォルダアイコンがプレーン（無地）のものは「個人フォルダ」となります。他ユーザーに共有したフォルダ、他ユーザーから共有されたフォルダには、共有アイコンがついた「共有フォルダ」となります（詳細は「共有」の章で説明） 1.2 フォルダ表示の切り替え 右端のメニューより、表示形式を切り替えられます。3つの表示形式が選択できます...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/2_create_folder/",
        "teaser": "/ocitutorials/content-management/2_create_folder/004.jpeg"
      },{
        "title": "その3: ファイルの登録（Oracle Content Management のファイル共有機能を使ってみよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 ローカル環境から、クラウド上の OCM にファイルを登録する方法は複数あります。ここでは、Web ブラウザを利用したファイルのアップロード方法について説明します。ファイルのアップロードはバックグラウンドで実行されるので、アップロード中に別の作業を続けることができます。なお、ファイルをアップロードする際は、以下について注意してください ファイルのアップロードを5GBまでに抑えます。一部の Web ブラウザではそれより大きいファイルを処理できないことがあります。数GBを超える大きいファイルを追加する場合は、デスクトップ・アプリケーションの利用を検討してください 複数のファイルやフォルダを含むフォルダ全体を追加するには、デスクトップ・アプリケーションを利用してください。同期フォルダにフォルダを追加することで、フォルダを含むコンテンツがクラウド上の OCM に追加されます サービス管理者が、アップロードできるファイルの種類（拡張子および最大ファイルサイズ）を制限している場合があります。制限されているファイルの種類を確認するには、右上のユーザー・アイコン→プリファレンス→ドキュメントを開いてください アップロードの取り消しは、ファイルのアップロード中に画面の上部の情報バーで「詳細」リンクをクリックし、 取り消すファイルの「X」をクリックします 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. 新規ファイルを登録する 1.1 新規ファイルの登録 フォルダに新規ファイルをアップロードする方法は以下の通りです アップロード先のフォルダを開き、「アップロード」 をクリックし、ローカル環境上のファイルを選択する アップロード先のフォルダを開き、アップロードするファイルをドラッグ＆ドロップする（アップロード先がハイライト表示されます） アップロードするファイルを、アップロード先のフォルダに直接ドラッグ＆ドロップする（アップロード先のフォルダがハイライト表示されます） ファイルがアップロードされたことを確認します 1.2 新しいバージョンのファイルを登録する OCM にアップロードしたファイルの修正版を登録するときに、古いバージョンのファイルを残したまま、修正版のファイルを 新しいバージョンのファイル として登録することができます。...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/3_upload_file/",
        "teaser": "/ocitutorials/content-management/3_upload_file/002.jpeg"
      },{
        "title": "その4: ファイルのプレビュー（Oracle Content Management のファイル共有機能を使ってみよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 ファイルをローカル環境にダウンロードすることなく、登録済ファイルを Web ブラウザで表示（プレビュー）することができます。 プレビュー可能なファイル拡張子は、以下のドキュメントをご確認ください Supported File Formats 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. ファイルのプレビュー ファイルをプレビューする方法は以下の通りです ファイル名 をクリックする ファイルを選択し、「表示」 をクリックする ファイルの右クリックメニューより 「表示」 をクリックする ファイルのプレビューが表示されます。マイナス（ー）またはプラス（＋）アイコンをクリック、もしくはスライダ・バーを移動してプレビュー表示を拡大・縮小できます 「全画面」 をクリックすると、全画面を使用してファイルをプレビューできます。「全画面の終了」もしくは ESC のクリックで、全画面表示を終了できます 管理者により Microsoft Office Online 連携機能が有効化されている場合、「表示」は 「Webプレビュー」 に名称変更されます。また、「PowerPoint...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/4_view_file/",
        "teaser": "/ocitutorials/content-management/4_view_file/002.jpeg"
      },{
        "title": "その5: ファイルの削除と復元（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM のドキュメント機能でファイル（およびフォルダ）を削除すると、それらはごみ箱に移動されます。 ごみ箱内のファイル（フォルダ）は、ユーザー自身で手動による削除（完全に削除）、もしくは元のフォルダへの復元、ができます。 ごみ箱を利用する上での注意点 ごみ箱内のファイル（フォルダ）は、サービス管理者が設定した「ファイルおよびフォルダをごみ箱に保持する最大日数」だけ保持され、その後、自動的に削除 されます ごみ箱に保持されるファイルおよびフォルダは、ファイルの使用済領域（使用容量）としてカウント されます。空き容量が足りない場合は、自分のごみ箱にファイルが残っていないか？を確認し、必要に応じて手動でごみ箱内のファイルを 完全に削除 してください。 ごみ箱内の容量は、右上のユーザーアイコン→プリファレンス→ドキュメントの 「ごみ箱のサイズ」 より確認できます 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. ファイルの削除と復元 1.1 ファイルを削除する ファイルを削除する方法は以下の通りです ファイルを選択し、「削除」 アイコンをクリックする ファイルの右クリックメニューより 「削除」 をクリックする 確認のダイアログが表示されます。「はい」 をクリックします ファイルが削除されます。削除したファイルはごみ箱に移動されます。画面上部のメッセージに表示されるメッセージの 「ごみ箱」 をクリックすると、ごみ箱に移動できます 1.2...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/5_delete_file/",
        "teaser": "/ocitutorials/content-management/5_delete_file/008.jpg"
      },{
        "title": "その6: ファイルの編集（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM のデスクトップ・アプリケーション がクライアント環境にインストールされている場合、ローカル環境の Office アプリケーションと連携したファイルの編集および OCM インスタンス上への自動保存ができます。 また、サービス管理者により Microsoft Office Online 連携機能が有効化されている場合、Office Online サービス（Microsoft 365サービス）でのファイル編集、新規作成、OCM への自動保存ができます 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること クライアント環境に OCMのデスクトップ・アプリケーション がインストールされていること。デスクトップ・アプリケーションの利用は、こちらのチュートリアルをご確認ください 11. デスクトップ・アプリケーション（Oracle Content Management のファイル共有機能を利用しよう） 1. ファイルの編集 1.1 Office アプリケーションで編集...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/6_edit_file/",
        "teaser": "/ocitutorials/content-management/6_edit_file/003.jpg"
      },{
        "title": "その7: ファイルの検索（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM の画面上部の検索ボックスより、ファイル、フォルダ、会話、メッセージ、ハッシュタグ、ユーザー、グループを横断的に検索することができます。特定のフォルダ配下のみを限定的に検索する場合は、そのフォルダを開いた状態で、検索を実行します。 検索機能に関する補足事項 ファイルの検索対象は 名前、説明、ファイルの内容（文書内の単語など）、ファイル拡張子、ファイルの最終変更者の名前 です。また、ファイルやフォルダに関連付けられているカスタム・メタデータ、タグ、会話で使用されているハッシュ・タグおよび会話内のユーザーも検索対象となります 全文検索対象のファイル形式は、以下のドキュメントをご確認ください Supported Image and Business File Formats ファイルやフォルダ、会話へのアクセス権限がない場合、検索条件を満たす場合でも検索結果に表示されません 最新の検索結果が表示されるには若干のタイムラグがある場合があります。 たとえば、Report という語を検索し、Report という語をその中に含む別のドキュメントを追加した場合、数秒間その最新のドキュメントは検索結果で返されません。 バージョン管理されているファイルは、最新バージョンが検索対象 となります （例）v3, v2, v1 の3バージョンが管理される .docx ファイルの場合、v3 のファイルのみが検索対象となります 検索では 大文字/小文字は区別されません。つまり、report で検索した場合と Report で検索した場合の結果は同じです。 検索演算子を利用できます。検索演算子も大文字小文字を区別しません。つまり、NOT と not は同じです AND 検索 : and または空白スペース( ) OR 検索 :...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/7_search_file/",
        "teaser": "/ocitutorials/content-management/7_search_file/002.jpg"
      },{
        "title": "その8: フォルダ・ファイルの共有（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 ファイルやフォルダは他のユーザーと簡単に共有できます。共有時には、ファイルやフォルダにアクセスするユーザーと実行可能な操作権限（アクセス権限）を簡単に制御できます。 説明 アクセス権限 OCM のアクセス権限は4種類です アクセス権限 説明 マネージャ コントリビュータ権限に加え、メンバー追加やアクセス権限設定などの管理作業が可能（フォルダ作成者=所有者とほぼ同様の権限） コントリビュータ 子フォルダの作成と編集、登録済ファイルの編集や新規ファイルのアップロードが可能 ダウンロード実行者 フォルダの参照、ファイルの参照とダウンロードが可能（子フォルダの作成やファイルの編集はできない） 参照者 フォルダの参照、ファイルのプレビューが可能（ファイルのダウンロードはできない） 共有の方法 共有の目的や内容に応じて、その方法を使い分けることができます。OCMでは、「フォルダへのメンバー追加」による共有と、「リンク（URL）による共有」の2パターンです。ここでは、メンバー追加による共有方法について説明します フォルダにメンバーを追加 フォルダにメンバーを追加することで、そのフォルダおよび配下すべてのフォルダ・ファイルを複数ユーザーで共有できます メンバーの追加は、個々のユーザーもしくはグループを指定できます メンバーを追加する際に、そのフォルダに対する アクセス権限 を設定します。アクセス権限は、マネージャ、コントリビュータ、ダウンロード実行者、参照者 より選択できます 利用例 組織やグループ、大規模プロジェクトでファイルを共有する場合など、ユーザーが継続して情報にアクセスする必要がある 場合 設定例 メンバー・リンクの共有 フォルダへのアクセス権限を有するユーザーに対して、フォルダ・ファイルを共有する際に利用します メンバー・リンクのアクセス権限は、フォルダ・ファイルへのアクセス権限と同じ です 利用例 フォルダAに、Xさん、Yさんの2名を コントリビュータ権限 でメンバー追加 Xさんが、フォルダAの中のファイルA-1のメンバー・リンクを作成し、YさんとZさんにチャットで送付 Yさんはメンバー・リンクをクリックすると、ファイルA-1に コントリビュータ権限 でアクセスできます ZさんはフォルダAにメンバー追加されていないため、メンバー・リンクをクリックしてもファイルA-1にアクセスできません （その他）共有フォルダの使用容量について フォルダにユーザーをコントリビュータ権限で追加した場合、ユーザーはフォルダの作成やファイルのアップロードができます この場合、共有フォルダに追加されたファイルの使用容量は、フォルダの所有者（Owner） に加算されます。...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/8_share_folder_file/",
        "teaser": "/ocitutorials/content-management/8_share_folder_file/005.jpg"
      },{
        "title": "その8: パブリック・リンク（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 ファイルやフォルダは他のユーザーと簡単に共有できます。共有時には、ファイルやフォルダにアクセスするユーザーと実行可能な操作権限（アクセス権限）を簡単に制御できます。 説明 アクセス権限 OCMのアクセス権限は4種類です アクセス権限 説明 マネージャ コントリビュータ権限に加え、メンバー追加やアクセス権限設定などの管理作業が可能（フォルダ作成者=所有者とほぼ同様の権限） コントリビュータ 子フォルダの作成と編集、登録済ファイルの編集や新規ファイルのアップロードが可能 ダウンロード実行者 フォルダの参照、ファイルの参照とダウンロードが可能（子フォルダの作成やファイルの編集はできない） 参照者 フォルダの参照、ファイルのプレビューが可能（ファイルのダウンロードはできない） 共有の方法 共有の目的や内容に応じて、その方法を使い分けることができます。OCMでは、「フォルダへのメンバー追加」による共有と、「リンク（URL）による共有」の2パターンです。ここではパブリック・リンクについて説明します パブリック・リンク フォルダのアクセス権限の有無に関係なく、フォルダやファイルへのアクセスを許可するリンク パブリック・リンク作成時に、そのリンク経由でアクセスするフォルダ・ファイルのアクセス権を設定します パブリック・リンク作成時に指定できるアクセス権は、コントリビュータ、ダウンロード実行者、参照者 の3つ パブリック・リンク作成時にそのリンクの 有効期限 や パスコード を設定できます サービス管理者により、パブリック・リンクの作成ポリシー（アクセス・オプション、最大権限の制限、有効期限の強制設定ほか）が設定されていることがあります フォルダ所有者により、パブリック・リンクの作成が制限されていることがあります フォルダのパブリック・リンク フォルダのパブリック・リンクを受け取ったユーザーは そのフォルダおよび配下すべてのフォルダとファイルに指定した権限 でアクセスできます 上位フォルダや同一フォルダ階層にある別のフォルダにはアクセスできません ファイルのパブリック・リンク そのリンクを受け取ったユーザーは、パブリック・リンクを作成したファイルのみに指定された権限 でアクセスできます 上位フォルダや同一フォルダ階層にある別のファイルにはアクセスできません 利用例 見込み顧客に対して、前回訪問時の提案書のパブリック・リンク（ダウンロード実行者権限、有効期限＋パスコード）で送付する 社外の制作会社に依頼したマーケティングアセット（画像や動画）の受け取りで、フォルダのパブリックリンク（コントリビュータ権限、有効期限＋パスコード）を利用 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/8_share_publiclink/",
        "teaser": "/ocitutorials/content-management/8_share_publiclink/005.jpg"
      },{
        "title": "その9: 会話（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM の会話とは、コメントを投稿したり、特定の話題についてディスカッションしたり、他のユーザーとリアルタイムでメッセージをやりとりする機能です。会話は Webブラウザだけでなく、デスクトップやモバイルからも利用できるため、デバイスや場所を問わず、迅速なコラボレーションが可能です 会話でやりとりされるコメントは、未読・既読の設定、コメントへの返信、ハッシュタグ（＃）やLIKE（いいね）の設定ができます。また、コメントに対してフラグを設定することで他のユーザーの注意を喚起することができます OCM の会話は、2パターンあります 特定のフォルダ・ファイルに紐付く会話 単独利用の会話（特定のファイル・フォルダに紐付かない会話） 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. ファイル・フォルダに紐づく会話 1.1 ファイルに紐付く会話を作成する ファイルをプレビューします 右上のサイドバーの 表示アイコン をクリックします 「会話」 を選択します。右ペインに会話パネルが開きます “会話へメッセージを投稿します” をクリックし、コメントを入力します。投稿ボタン をクリックします メッセージが投稿されると同時に、会話が作成されます ファイルの一覧表示画面に戻ります。会話が紐づけられたファイルは、会話アイコン が表示されます 会話アイコン をクリックすると、ファイルのプレビューとそのファイルに紐付く会話が表示されます 1.2 投稿されたコメントに返信する ファイルをプレビューし、会話パネルを開きます...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/9_conversation/",
        "teaser": "/ocitutorials/content-management/9_conversation/015.jpg"
      },{
        "title": "その10: グループ（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 複数のユーザーをグループとしてまとめることで、フォルダへのメンバー追加などがとても簡単にできるようになります。 例えば、複数のプロジェクト共有フォルダ へのアクセス権限設定で利用されている グループX があります。このグループXに新規ユーザー（Aさん）を追加するだけで、複数のプロジェクト共有フォルダへのアクセス権限設定を 「まとめて」「抜け漏れなく」「必要最小限の操作」 で付与されます。 同様に、プロジェクトメンバーであるBさんが人事異動によりこのプロジェクトから外れる場合も、グループXからBさんを外す（グループXから削除する）だけで、複数のプロジェクト共有フォルダへのアクセス権限を 「まとめて」「抜け漏れなく」「必要最小限の操作」 で削除できます。 このようにグループを活用することで、各種リソースに対するアクセス権限割り当てなどを効率化できます。 OCMで利用できるグループは2種類あります IDCS グループ Oracle Identity Cloud Service(IDCS)で作成・管理するグループ IDCS の管理コンソールを利用して管理します。詳細は、IDCS のマニュアルを参照 Manage Oracle Identity Cloud Service Groups 想定されるユースケース お客様環境内の Active Directory で管理する組織情報を利用したアクセス権限設定を行う場合 OCM インスタンスを利用するユーザーに対して、デフォルトでアクセス権限を与えたい場合(就業規則など全従業員がアクセスする全社共有フォルダ) グループ OCM インスタンス内部で作成・管理されるグループ OCM のグループメニューより作成・管理（後述） 想定されるユースケース: プロジェクトや作業グループ、チームなど、特定の目的のために構成されたグループ単位で権限設定を行う場合 このチュートリアルでは、OCMインスタンス内部で管理するグループ(=グループ) について説明します。 グループには3つの考え方があり、目的や用途で使い分けることができます  ...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/10_group/",
        "teaser": "/ocitutorials/content-management/10_group/008.png"
      },{
        "title": "その11: デスクトップ・アプリケーション（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM のデスクトップ・アプリケーションは、クラウド上のファイルやフォルダとローカル環境のファイルやフォルダを同期します。クラウド上で更新されたファイルやフォルダは、自動的にローカル環境に同期されるため、ユーザーは常に最新のファイルやフォルダをローカル環境で利用することができます また、ユーザーはネットワークに接続していないオフライン状態で、同期されたファイルやフォルダを操作できます。オフライン状態でローカル環境に同期されたファイルを編集・保存した場合、オンライン状態に復旧した時に自動的にクラウド上に反映されます。そのため、ユーザーが意識することなく、常に最新の状態がクラウド上で維持されます。 2022年5月のリリース(22.5.1)より、同期対象フォルダとして クラウド上のサブフォルダを選択できる ようになりました。従来はクラウド上の最上位階層のフォルダ（=クラウドフォルダ）のみを同期対象として選択できましたら、これからは（最上位階層の）クラウドフォルダだけでなく、その配下のサブフォルダ単位で同期を選択できます。サブフォルダを同期する場合、その選択方法により同期処理が異なります。詳細はSync Subfolders and Filesをご確認ください デスクトップ・アプリケーションの利用には、ローカル環境へのインストールとOCMインスタンスの接続先情報の設定が必要です。デスクトップ・アプリケーションが対応するクライアント環境は、下記ドキュメントよりご確認ください Supported Software 【お知らせ】 この文書は、2022年5月時点での最新バージョン(22.5.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のユーザーインタフェースと異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. デスクトップ・アプリケーションのインストールとセットアップ 1.1 インストーラーのダウンロード OCM インスタンスから、デスクトップ・アプリケーションのインストーラーをダウンロードします。 Web ブラウザを開き、OCM インスタンスにアクセスします 右上のユーザーアイコン→ 「アプリケーションのダウンロード」 をクリックします 「ユーザー名」 と 「サービスURL」 をテキストファイルなどにメモします（インストール完了後のセットアップ作業で利用します） ローカル環境のコンピュータと同じOSを選択し、「ダウンロード」...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/11_desktop_application/",
        "teaser": "/ocitutorials/content-management/11_desktop_application/003.webp"
      },{
        "title": "その12: モバイル・アプリケーション（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM のモバイル・アプリケーションを利用し、クラウド上のファイルやフォルダ、会話にいつでもどこからでも簡単にアクセスできます。OCM は、Android および iOS(iPhone/iPad) それぞれに対応したモバイルアプリケーションを提供します。サポートするモバイルOSの種類およびバージョンは、下記ドキュメントをご確認ください Supported Mobile Devices モバイル・アプリケーションは、Web ブラウザとほぼ同じ操作を提供します。主な提供機能は以下の通りです ドキュメント ファイル・フォルダの表示 フォルダの作成 ファイルのプレビュー ファイルのアップロード デバイス上のファイルのアップロード カメラで撮影した写真のアップロード ファイルのダウンロード（オフライン利用） 共有 メンバーリンクの共有 パブリックリンクの作成 ファイルの編集（Office アプリケーションがインストールされている場合） 会話 会話の表示、作成 メッセージの投稿 注釈の表示、設定 フラグ設定 通知フラグの確認 検索 ファイル、フォルダ、会話ほかの横断検索 アセット レビュー中アセットの表示 ワークフロー・タスクの表示 アセットの承認、却下 その他 割り当て容量の確認 アカウントの追加・管理 パスコード・ロック 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/12_mobile_application/",
        "teaser": "/ocitutorials/content-management/12_mobile_application/043.PNG"
      },{
        "title": "その13: 圧縮ファイルによる複数ファイルの一括登録（Oracle Content Management のファイル共有機能を使ってみよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 ローカル環境から、クラウド上の OCM にファイルを登録する方法は複数あります。ここでは、圧縮ファイル（ZIP形式のファイル） を利用し、複数のフォルダやファイルをまとめて登録・更新する方法を紹介します 【お知らせ】 この文書は、2022年4月時点での最新バージョン(22.4.3)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること ADMINISTRATION:システム→一般→ファイルとアセットの制限 で、ファイル・タイプ（拡張子）で zip が登録されていないこと（ブロックされていないこと） 1. 圧縮ファイルを準備する クライアント環境で圧縮ファイルを準備します。ここでは以下の階層のフォルダおよびファイルを用意し、圧縮します。圧縮後のファイル名は 「テストフォルダアーカイブ.zip」 です テストフォルダ サブフォルダ2 テスト文書2.docx サブフォルダ3 テスト文書3.docx テスト文書1.docx 【注意事項】 圧縮ファイルを作成する際は、UTF-8形式で作成します。UTF-8以外の形式（例えばShift-JIS）で作成された圧縮ファイルの場合、OCM内での解凍処理がエラーとなります。詳細は Extract Multiple Files From A Compressed File、および Doc...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/13_upload_multiple_files/",
        "teaser": "/ocitutorials/content-management/13_upload_multiple_files/002.jpg"
      },{
        "title": "その14: 外部ユーザー（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 外部ユーザー(External User)とは組織外のユーザーのことで、OCMユーザーから招待された(=アクセス権限が付与された)フォルダおよびその配下でのみファイル・フォルダ操作ができます 説明 外部ユーザーと通常のOCMユーザーの主な違いは以下の表の通りです 外部ユーザー利用時の注意点 OCMのプライベート・インスタンスでは、外部ユーザーはサポートされていません 外部ユーザーを利用する前に、サービス管理者が外部ユーザー機能の有効化が必要です。有効化の手順はOracle Content Managementサービス管理者向け作業ガイドの2.1.2 外部ユーザーの設定をご確認ください 外部ユーザーを招待できるのは、CECStandardUserもしくはCECEnterpriseUserアプリケーション・ロールが付与されたユーザーのみです。外部ユーザーが、別の外部ユーザーを招待することはできません 外部ユーザー招待時に付与できるアクセス権限は、参照者(Viewer)、ダウンロード実行者(Downloader)、コントリビュータ(Contributor)の3つです。マネージャ(Manager)は付与できません 外部ユーザーは、OCMのWebブラウザ・インタフェースのみ利用できます。デスクトップ・アプリケーションおよびモバイル・アプリケーションは利用できません 【お知らせ】 この文書は、2023年6月時点での最新バージョン(23.5.2)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 OCMインスタンスが作成済であること(以下の作成手順参照) OCI IAM Identity Domain環境でOracle Content Managementインスタンスを作成する Oracle Content Management インスタンスを作成する OCMの利用ユーザーにOCMインスタンスのCECStandardUserもしくはCECEnterpriseUserアプリケーション・ロールが付与されていること OCI IAM Identity Domain環境でOracle Content Managementインスタンスの利用ユーザーを作成する Oracle Content Management インスタンスの利用ユーザーを作成するをご確認ください。 1. フォルダに外部ユーザーを招待する 1.1 アカウント未作成の外部ユーザーを招待する(新規招待) Identity Domains(もしくはIDCS)にアカウントが作成されていない組織外のユーザーを、外部ユーザーとして新規に招待します...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/14_external_user/",
        "teaser": "/ocitutorials/content-management/14_external_user/003.jpg"
      },{
        "title": "Oracle Content and Experience を Headless CMS として使ってみよう【初級編】",
        "excerpt":"この文書は Oracle Content and Experience (OCE) のアセット管理機能を Headless CMS として利用する基本的な方法をステップ・バイ・ステップで紹介するチュートリアルです。 【お知らせ】 この文書は、2021年7月時点での最新バージョン(21.6.1)を元に作成されてます。 チュートリアル内の画面ショットについては Oracle Content and Experience の現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに、少なくとも下記4つのOCEインスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 1. アセット機能の利用準備 OCEのアセット管理機能を利用するための準備作業を行います。アセット・リポジトリ、公開チャネル、コンテンツ・タイプをそれぞれ作成し、関連付けを行います。 1.1 アセット・リポジトリを作成する アセット・リポジトリ（以降リポジトリ）を作成します。 リポジトリとは 「デジタル・アセット（画像）やコンテンツ・アイテム（ニュースやブログなどの構造化コンテンツ）を保管・管理する器」 です。リポジトリは複数作成することができます。 OCE インスタンスのアクセスします。OCE インスタンスの URL...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/41_asset_headless/",
        "teaser": "/ocitutorials/content-management/41_asset_headless/039.jpg"
      },{
        "title": "Oracle Content Management で請求書などの電子ファイルを長期保管してみよう【初級編】",
        "excerpt":"OCM のアセット管理機能のビジネス・リポジトリを利用し、請求書などの電子ファイルをデジタルアセットとして長期保管する方法をステップ・バイ・ステップで紹介するチュートリアルです。 【お知らせ】 この文書は、2022年3月時点での最新バージョン(22.3.1)を元に作成されてます。 チュートリアル内の画面ショットについては Oracle Content Management の現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに、少なくとも下記4つのOCMインスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content Management インスタンスの利用ユーザーを作成する をご確認ください。 0. 説明 ビジネスリポジトリ アセット管理機能のリポジトリには、ビジネスリポジトリ と アセットリポジトリ の2つのタイプがあります。ビジネスリポジトリに格納されたアセットは、アセットリポジトリに格納されたアセットと区別するため、ビジネス・アセット と呼びます また、ビジネス・リポジトリに格納されたビジネス・アセットは、アセット・リポジトリに格納されたアセットの 1/100 で請求されます。 (補足)アセットリポジトリとビジネスリポジトリの違い アセット・リポジトリ 登録されたコンテンツの呼称は アセット 登録されたアセットのWebサイト公開やAPI公開を目的としたリポジトリ リポジトリ機能リリース時(2018年8月)から存在するリポジトリ 1アセット = 1課金対象アセット ビジネス・リポジトリ 登録されたコンテンツの呼称は ビジネスアセット 登録されたビジネスアセットの保管/アーカイブを目的としたリポジトリ...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/42_business_repository/",
        "teaser": "/ocitutorials/content-management/42_business_repository/019.jpg"
      },{
        "title": "Oracle Content Management のリポジトリのアクセス権限を理解しよう",
        "excerpt":"Oracle Content Management(OCM)のアセット管理機能のリポジトリのアクセス権限設定、およびカスタム・ロールを利用した細かい粒度でのアクセス権限設定(Granular Permissions)についてステップ・バイ・ステップで紹介するチュートリアルです 【お知らせ】 この文書は、2023年5月時点での最新バージョン(23.5.1)を元に作成されてます。 チュートリアル内の画面ショットについては、OCMの現在のコンソール画面と異なっている場合があります。 前提条件 OCMインスタンスが作成済であること(以下の作成手順参照) OCI IAM Identity Domain環境でOracle Content Managementインスタンスを作成する Oracle Content Management インスタンスを作成する 少なくとも下記4つのOCMインスタンスのアプリケーション・ロールが付与された管理ユーザーを用意すること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、OCI IAM Identity Domain環境でOracle Content Managementインスタンスの利用ユーザーを作成するもしくはOracle Content Management インスタンスの利用ユーザーを作成するをご確認ください。 0. 説明 リポジトリのアクセス権限設定ついて リポジトリ（アセット・リポジトリおよびビジネス・リポジトリ）にアクセスできるユーザーを追加する際に、リポジトリ・ロール（以降ロール）を設定します。この操作は、フォルダへのメンバー追加と似ています。ユーザー追加時に設定できるデフォルトのロールは以下3つです 参照者 （Viewer） コントリビュータ (Contributor) マネージャ (Manager) [Memo] ダウンロード実行者(Downloader)のロールはありません、参照者ロールを付与すると、アセットの表示およびダウンロードが操作可能となります リポジトリにデフォルトロールでメンバー追加すると、リポジトリ内で利用可能な任意のアセット・タイプが付与されたロールの権限範囲内で利用できるようになります（アセット権限）。また、リポジトリ内で利用可能な任意の（全ての）カテゴリに対して、付与されたロールの権限範囲内で利用できるようになります。各ロールのアセット権限は以下の通りです Permissions Granted with...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/43_repository_permission/",
        "teaser": "/ocitutorials/content-management/43_repository_permission/026.jpg"
      },{
        "title": "サイトの作成（Oracle Content and Experience のサイト機能を使ってみよう）",
        "excerpt":"OCE のサイト作成機能を利用し、Web サイト（スタンダードサイト）を作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアルです。ここでは、Web サイトの作成〜編集〜公開までの基本的な手順をハンズオン形式で習得します。 さらに、フォルダに登録される複数ドキュメントをWebページからダウンロードできる「資料ダウンロード」ページの作成方法も、あわせて習得します この文書は、2020年6月時点での最新バージョン(20.2.3)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 0. はじめに OCE のサイト機能は、Web や HTML などの技術に詳しくないビジネスユーザーが、ドラッグ&amp;ドロップなどの直感的な操作で Web サイトを作成し、公開することができます。また、OCEは、レスポンシブ Web デザイン（Bootstrap）に対応した事前定義済のテンプレート（ひな型）を複数パターン提供します。これらを利用することで、パソコンやスマートフォン/タブレットに対応した Web サイトを、すばやく、簡単に、低コストで作成・公開できます また、OCE が提供する ファイル共有機能 や アセット機能 とシームレスな機能統合がされているため、ドラッグ&amp;ドロップなどのとても簡単な操作で、ドキュメントやアセットを Web サイト上に掲載し、公開することができます OCE は、以下の2種類のサイトを作成・公開できます。サイト作成時に選択することができます（※サイト・ガバナンス機能が無効化されている場合のみ）...","categories": [],
        "tags": ["OCE"],
        "url": "/ocitutorials/content-management/61_create_site/",
        "teaser": "/ocitutorials/contnt-management/61_create_site/1013.jpg"
      },{
        "title": "Oracle Content and Experience を Webコンテンツ管理(Web CMS) として利用しよう【初級編】",
        "excerpt":"この文書は Oracle Content and Experience (OCE) のサイト作成機能を利用し、Web サイトを作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアル【初級編】です。また、サイト上で公開するコンテンツは、アセット管理機能で管理されるコンテンツ・アイテムを利用します 【お知らせ】 この文書は、2021年7月時点での最新バージョン(21.6.1)を元に作成されてます。 チュートリアル内の画面ショットについては Oracle Content and Experience の現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content and Experience インスタンスを作成する Oracle Content and Experience を Headless CMS として使ってみよう【初級編】が完了していること OCE の利用ユーザーに、少なくとも下記4つのOCE インスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 0. 説明 このチュートリアルでは、OCE のサイト機能を利用して Web サイトを作成・公開します。また、Web...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/62_webcms/",
        "teaser": "/ocitutorials/content-management/62_webcms/058.jpg"
      },{
        "title": "Oracle Content and Experience のコンテンツ・レイアウトを編集しよう",
        "excerpt":"この文書は Oracle Content and Experience (OCE) のコンテンツ・レイアウトの編集し、Web ページ上でのコンテンツ・アイテムの表示形式をカスタマイズする方法をステップ・バイ・ステップで紹介するチュートリアルです この文書は、2021年1月時点での最新バージョン(21.1.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する Oracle Content and Experience を Headless CMS として使ってみよう【初級編】が完了していること Oracle Content and Experience を WebCMS として使ってみよう【初級編】が完了していること OCE の利用ユーザーに、少なくとも下記4つのOCE インスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 1. 説明 1.1 コンテンツ・レイアウトとは？ コンテンツ・レイアウトとは 作成されたコンテンツ・アイテムの表示形式...","categories": [],
        "tags": ["OCE"],
        "url": "/ocitutorials/content-management/71_customize_contentlayout/",
        "teaser": "/ocitutorials/content-management/71_customize_contentlayout/028.jpg"
      },{
        "title": "Oracle Content and Experience で作成したサイトのバナー画像を変更しよう",
        "excerpt":"このチュートリアルは、Oracle Content and Experience (OCE)のデフォルトテンプレートを利用して作成されたサイトのバナー画像を変更する手順について、ステップ・バイ・ステップで紹介します 1. 前提条件・事前準備 1.1 バージョン このハンズオンの内容は、Oracle Content and Experience 21.1.2 時点の内容で作成されています。最新の UI とは異なっている場合があります。最新情報については、製品マニュアルをご参照ください Oracle Content and Experience https://docs.oracle.com/en/cloud/paas/content-cloud/books.html https://docs.oracle.com/cloud/help/ja/content-cloud/index.htm（日本語翻訳版） 1.2 インスタンスの作成 OCEインスタンスが作成済であること。インスタンスの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience インスタンスを作成する 1.3 アセットリポジトリの作成 アセットリポジトリが作成済であること。リポジトリの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience を Headless CMS として使ってみよう【初級編】 1.4 Webサイトの作成 アセットを公開できるエンタープライズサイトが作成済であること。サイトの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience を...","categories": [],
        "tags": ["OCE"],
        "url": "/ocitutorials/content-management/72_change_banner/",
        "teaser": "/ocitutorials/content-management/72_change_banner/image014.jpg"
      },{
        "title": "Oracle Content Management のVideo Plus アセットを使ってみよう",
        "excerpt":"このチュートリアルは、OCM のオプション機能である 拡張ビデオ機能（Video Plus アセット） を利用する手順について、ステップ・バイ・ステップで紹介します 1. 前提条件の確認 1.1 バージョン この文書は、2022年4月時点の最新バージョン(22.4.3)を下に作成されてます。チュートリアル内の画面ショットについては、OCMの最新のUIとは異なっている場合があります。最新情報については、製品マニュアルをご参照ください Oracle Content Management https://docs.oracle.com/en/cloud/paas/content-cloud/books.html https://docs.oracle.com/cloud/help/ja/content-cloud/index.htm（※日本語翻訳版） 1.2 インスタンスの作成 ライセンス・タイプが Premium Edition のOCMインスタンスが作成済であること。インスタンスの作成方法は、以下のチュートリアルをご確認ください Oracle Content Management インスタンスを作成する [Memo] Starter Edition の場合、Video Plusアセットは利用できません 1.3 アセットリポジトリの作成 アセットリポジトリ が作成済であること。リポジトリの作成方法は、以下のチュートリアルをご確認ください Oracle Content Management を Headless CMS として使ってみよう【初級編】 1.4 Webサイトの作成 アセットを公開できる エンタープライズサイト が作成済であること。サイトの作成方法は、以下のチュートリアルをご確認ください Oracle Content Management...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/73_videoplus/",
        "teaser": "/ocitutorials/content-management/73_videoplus/video008.jpg"
      },{
        "title": "Oracle Content Management でカスタムテンプレートを自作しよう",
        "excerpt":"このチュートリアルは、OCM でカスタムテンプレートを自作する手順について、ステップ・バイ・ステップで紹介します。なお、ここではテンプレート(Templates)やテーマ(Themes)の違いについて簡単に紹介します。   テーマ(Themes) テンプレート(Templates) 概要 - サイトの全体的な見た目(デザイン)を定義したもの - サイトの各ページ同士で視覚的な統一感を与える - テーマはテンプレートに含まれる - Webサイトを作成する際に利用する「ひな形」 - 「事前定義済テンプレート」と「カスタムテンプレート」の2つ - Webサイト作成時の起点として利用 構成要素 - ページ・レイアウト(html) - スタイルシート(css) - JavaScript - 画像など - 構成ファイル - テーマ - ページ - ページ内のサンプルコンテンツ(アセット、ファイルなど) - ページ内のカスタムコンポーネント また、詳細については下記チュートリアルや製品ドキュメントをご確認ください。 OCMチュートリアル Oracle Content Management で作成したサイトのバナー画像を変更しよう - 2.テンプレートおよびテーマについて 製品ドキュメント About Templates About Themes...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/78_create_custom_template/",
        "teaser": "/ocitutorials/content-management/78_create_custom_template/033.jpg"
      },{
        "title": "Oracle Content and Experience で多言語サイトを作成しよう",
        "excerpt":"このチュートリアルは Oracle Content and Experience (OCE) のサイト作成機能を利用し、多言語サイトを作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアルです。また、サイト上で公開するコンテンツは、アセット・リポジトリで管理されるコンテンツ・アイテム（多言語）を利用します この文書は、2021年4月時点での最新バージョン(21.2.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する Oracle Content and Experience を Headless CMS として使ってみよう【初級編】 OCE の利用ユーザーに、少なくとも下記4つのOCE インスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 なお、以下のチュートリアルを実施済みで、OCEのサイト作成と公開、アセットの作成と公開、それぞれの手順について習得済みであることが望ましい Oracle Content and Experience を Webコンテンツ管理(Web CMS) として利用しよう【初級編】 0. 説明 0.1 このチュートリアルで実施すること このチュートリアルでは、OCE...","categories": [],
        "tags": ["OCE"],
        "url": "/ocitutorials/content-management/74_create_multilingual/",
        "teaser": "/ocitutorials/content-management/74_create_multilingual/040.jpg"
      },{
        "title": "Oracle Content and Experience のタクソノミを使ってみよう",
        "excerpt":"このチュートリアルは Oracle Content and Experience (OCE) のタクソノミ機能を利用し、リポジトリ内のアセットを分類する方法をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年4月時点での最新バージョン(21.2.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する Oracle Content and Experience を Headless CMS として使ってみよう【初級編】 Oracle Content and Experience を Webコンテンツ管理(Web CMS) として利用しよう【初級編】 0. 説明 タクソノミ（Taxonomy） タクソノミ（Taxonomy）は、情報を階層構造で整理したものです。OCEのタクソノミ機能は、コンテンツ開発者により作成され、明確に定義されたカテゴリによりアセットを階層構造で分類します。タクソノミでアセットを分類することで、ユーザーはカテゴリをドリルダウンすることで、必要なアセットを簡単に探すことができます OCEのタクソノミ機能については、以下のドキュメントをあわせてご確認ください Manage Taxonomies このチュートリアルで作成するカテゴリ（Sample Menu Category）を以下に示します 季節のオススメ ドリンク コーヒー ティー ジュース フード デザート サンドイッチ スナック この例では、3つの上位カテゴリ「季節のオススメ」「ドリンク」「フード」があります。「季節のオススメ」カテゴリには子カテゴリがありませんが、「ドリンク」と「フード」のカテゴリにはいくつかの子カテゴリがあります。子カテゴリには、それぞれ独自の子カテゴリを設定できます。...","categories": [],
        "tags": ["OCE"],
        "url": "/ocitutorials/content-management/75_taxonomy/",
        "teaser": "/ocitutorials/content-management/75_taxonomy/023.png"
      },{
        "title": "OCEのサイト・セキュリティとサイト・ガバナンスを理解する",
        "excerpt":"このチュートリアルはOracle Content and Experience(OCE)で作成するWebサイトの サイト・セキュリティ と サイト・ガバナンス の設定方法をステップ・バイ・ステップで紹介するチュートリアルです この文書は、2021年5月時点での最新バージョン(21.2.2)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する また、以下のチュートリアルを実施済みで、OCEのサイト作成と公開の手順について習得済みであることが望ましい Oracle Content and Experience のサイト機能を使ってみよう【初級編】 1. サイト・セキュリティ 1.1 説明 OCEのサービス管理者は、ユーザーが作成・公開するWebサイトの サイト・セキュリティ(=公開範囲) を制限できます。サイトの公開範囲は パブリック と セキュア の2パターンで、それぞれの特徴は以下の通りです。 パブリック 公開範囲の制限なし 誰でも参照可能なWebサイト 主な利用例 コーポレートサイト、ブランドサイト、キャンペーンサイトなど セキュア 公開範囲の制限あり IDCSに登録されるユーザーIDおよびパスワードにより認証され、サイト管理者により設定されたアクセス権限を持つユーザーのみが参照できるWebサイト 公開範囲は「クラウド・ユーザー」「訪問者」「サービス・ユーザー」「特定のユーザー」より選択（以下の表を参照） 主な利用例 イントラサイト、代理店専用サイト、会員専用サイトなど 公開範囲 サイトにアクセスできるユーザー クラウド・ユーザー OCEインスタンスが利用するIDCSにユーザー登録されたIDCSユーザー。OCEインスタンスへのアクセス権の有無は関係ありません 訪問者 OCEインスタンスのCECSitesVisitorアプリケーションロールが付与されたユーザー サービス・ユーザー...","categories": [],
        "tags": ["OCE"],
        "url": "/ocitutorials/content-management/77_sitesecuritygovernance/",
        "teaser": "/ocitutorials/content-management/77_SiteSecurityGovernance/021.png"
      },{
        "title": "Oracle Content Toolkitを利用して Oracle Content Management のサイトをコンパイルしよう",
        "excerpt":"このチュートリアルは、Oracle Content Toolkitを利用したOCMで作成・公開したサイトをコンパイルする手順について、ステップ・バイ・ステップで紹介するチュートリアルです。 【お知らせ】 この文書は、2022年10月時点での最新バージョン(22.9.3)を元に作成されてます。 チュートリアル内の画面ショットについては Oracle Content Management の現在のコンソール画面と異なっている場合があります。 0. 説明 Oracle Content Toolkit Oracle Content Toolkit（Content Toolkit）とは、OCMに対してコマンドを実行できる コマンドライン・ユーティリティ で、主にサイト・テンプレート、テーマ、カスタム・コンポーネントおよびコンテンツ・レイアウト等を開発する際に利用します Content ToolkitはGitHub上で公開されており、誰でも利用することができます。詳細はGitHub上のREADME.md、および以下の製品ドキュメントをご確認ください GitHub https://github.com/oracle/content-and-experience-toolkit/blob/master/README.md 製品ドキュメント 26 Develop with Oracle Content Management Toolkit(英語) (※日本語翻訳版) Oracle Content Toolkit Command-Line Utility (※日本語翻訳版) サイトのコンパイル OCMのサイトをコンパイルすると、静的HTMLファイル をサイトの各ページに作成します。これによりサイト・ページの実行時パフォーマンスおよび動作の改善が期待できます。通常（デフォルト状態）のOCMのサイトページのレンダリングと、コンパイルされたサイトページのレンダリングの違いは以下の通りです（※GitHubより引用） 通常（デフォルト状態）のサイトページのレンダリング コンパイルされたサイトページのレンダリング サイト・コンパイルの概要については、以下ドキュメントもあわせてご確認ください GitHub What is the...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/91_compile_site_ocmtoolkit/",
        "teaser": "/ocitutorials/content-management/91_compile_site_ocmtoolkit/007.jpg"
      },{
        "title": "101: Oracle Cloud で Oracle Database を使おう(BaseDB)",
        "excerpt":"はじめに Oracle Base Database Service(BaseDB)は、Oracle Cloud Infrastructure の上で稼働する Oracle Database のPaaSサービスです。 ユーザーはオンプレミスと全く同じOracle Databaseのソフトウェアをクラウド上で利用することができ、引き続きすべてのデータベース・サーバーの管理権限(OSのroot権限含む)およびデータベースの管理者権限を保持することができます。 この章では、作成済みの仮想クラウド・ネットワーク(VCN)にデータベース・サービスを1つ作成していきます。 前提条件 : Oracle Cloud Infrastructure チュートリアル を参考に、仮想クラウド・ネットワーク(VCN)の作成が完了していること 注意 チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 1. DBシステムの作成 2. DBシステムへのアクセス 3. データベース（PDB）にアクセス 4. PDB上のスキーマにアクセスしましょう 所要時間 : 約30分 1. DBシステムの作成 コンソールメニューから Oracle Database → Oracle Base Database (VM, BM)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs101-create-db/",
        "teaser": "/ocitutorials/database/dbcs101-create-db/img11.png"
      },{
        "title": "102: BaseDB上のPDBを管理しよう",
        "excerpt":"はじめに Oracle Base Database Service(BaseDB)では、Oracle Cloud Infrastructure の上で稼働する Oracle Database の PDB を OCI コンソールから停止したり、起動したり、既存 PDB からクローンするなどの操作が簡単に行う事が可能です。この章では実際にどのように操作するのか確認していきます。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. PDB を起動・停止してみよう 2. PDB を新規作成してみよう 3. 既存 PDB からクローン PDB を作成してみよう 所要時間 : 約15分 1. PDB を起動・停止してみよう まずは、コンソール上で作成済みの PDB を確認する画面への遷移、および...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs102-managing-pdb/",
        "teaser": "/ocitutorials/database/dbcs102-managing-pdb/img13.png"
      },{
        "title": "103: パッチを適用しよう",
        "excerpt":"はじめに Oracle Base Database Service(BaseDB)では、OS以上がユーザー管理となるため、ユーザー側でパッチ適用の計画と適用実施が可能です。 ここでは、DatabaseとGrid Infrastructureに対するそれぞれのパッチ適用方法についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること パッチ適用対象の Oracle Database に対して最新RU/RURが適用されていないこと 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. 現在のバージョンを確認しよう 2. Grid Infrastructure にパッチを適用しよう 3. Database にパッチを適用しよう 所要時間 : 約15分 1. 現在のバージョンを確認しよう まずは、コンソール上で作成済みの Database と Grid Infrastructure のバージョンを確認していきましょう。 コンソールメニューから Oracle Database → Oracle Base Database...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs103-patch/",
        "teaser": "/ocitutorials/database/dbcs103-patch/img11.png"
      },{
        "title": "104: 自動バックアップを設定しよう",
        "excerpt":"はじめに サービスを利用していくにあたり、利用している環境のインスタンスやデータが壊れてしまった場合や、過去の時点にデータを戻したい場合など、何か起きた時のデータ復旧のためにバックアップやリカバリについての検討は重要です。 BaseDB では、RMANを利用した自動バックアップ機能が利用可能で、リカバリも最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 ここでは、OCI コンソールから自動バックアップを構成するまでの手順についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. 自動バックアップの前提条件を確認する 2. 自動バックアップの設定をしよう 3. 自動バックアップの設定を変更しよう 4. オンデマンド・バックアップを取得しよう 5. 取得したバックアップを確認しよう 所要時間 : 約30分 1. 自動バックアップの前提条件を確認する まずは設定するにあたり前提条件を確認してみましょう。 オブジェクト・ストレージに取得することを前提にまとめています。DBシステム内(FRA)にとる場合など、CLI(dbcli)で設定する場合には、バックアップはコンソールからの管理対象外となります。 必要なエディション 自動バックアップ機能は全エディションで利用可能 並列実行(チャネル数やセクション・サイズの指定など)や高速増分バックアップなどを使う場合にはEnterprise Edition以上が必要 ※特にリストア時間(RTO)の観点で、並列処理でのリストアができることはメリットになります。RTOが厳しい場合には、Enterprise Edition以上をおすすめします。 Oracle Cloudのインフラ側の前提条件 管理ユーザーのIAMサービス・ポリシーでの権限が付与済 DBシステムからオブジェクト・ストレージへのアクセス設定(VCNでサービス・ゲートウェイの利用がおすすめ) DBシステムとデータベースの状態 自動バックアップの機能が動作するためには、データベースが下記の状態である必要があります。下記の状態ではない場合、バックアップジョブが失敗する可能性があるのでご注意ください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs104-backup/",
        "teaser": "/ocitutorials/database/dbcs104-backup/11.PNG"
      },{
        "title": "105: バックアップからリストアしよう",
        "excerpt":"はじめに BaseDB では、自動バックアップ機能やオンデマンドバックアップにて取得したバックアップを利用する事で、最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 また、バックアップ元のデータベースに対してリストアするだけでなく、別DBシステム上にリストアする事も可能です。 ここでは、OCI コンソールからリストアする手順についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 自動バックアップを設定しよう を通じてバックアップを取得していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. バックアップ元のデータベースに対してリストア 2. バックアップから新規データベースとしてリストア 3. オンデマンドバックアップを使用したリストア 所要時間 : 約30分 1. バックアップ元のデータベースに対してリストア まずはバックアップ元のデータベースに対してリストアしてみましょう。 リストア方法には下記3つがありますので、リストアしたい地点に応じてどのリストア方法を利用するか検討してください。 最新にリストア データ損失の可能性が最も低い、直近の正常な状態にデータベースをリストアします。 タイムスタンプにリストア 指定した日時にデータベースをリストアします。 SCNにリストア SCNを使用してデータベースをリストアします。 有効なSCNを指定する必要がありますので、データベース・ホストにアクセスして問い合せるか、オンラインまたはアーカイブ・ログにアクセスして使用するSCN番号を確認してください。 コンソールメニューから Oracle Database → Oracle Base Database...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs105-restore/",
        "teaser": "/ocitutorials/database/dbcs105-restore/restore00.png"
      },{
        "title": "106: Data Guardを構成しよう",
        "excerpt":"はじめに Data Guardは、Oracle Database自身が持つレプリケーション機能です。 プライマリDBの更新情報（REDOログ）をスタンバイDBに転送し、そのREDOログを使ってリカバリし続けることでプライマリDBと同じ状態を維持します。 リアルタイムに複製データベースを持つ事ができる為、データベース障害やリージョン障害などのRTO/RPOを短くすることができ、広範囲な計画停止(メンテナンス)においても切り替えることによって停止時間を極小化することが可能で、災害対策(DR)としてのデータ保護はもちろんのこと、移行やアップグレードの停止時間短縮といった利用用途もあります。 また、参照専用として利用可能なActive Data Guardにしたり、一時的に読み書き可能なスナップショット・スタンバイとして利用したりと、普段から利用可能なスタンバイDBを持つことができます。 ここでは、OCI コンソールから Data Guard を構成するまでの手順についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. OCI上でのData Guard構成パターン 2. Data Guardを構成する為の前提条件 3. Data Guardの構成手順 4. Data Guardの切り替え 5. Data Guard構成に含まれるDBの削除方法 所要時間 : 約60分 1. OCI上でのData Guard構成パターン Oracle Cloud上でData Guardを利用する際の基本的な構成については、大きく分けて３つのパターンがあります。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs106-dataguard/",
        "teaser": "/ocitutorials/database/dbcs106-dataguard/dataguard08.png"
      },{
        "title": "201: オンプレミスのPDBをBaseDBに移動しよう",
        "excerpt":"はじめに Base Database Service (BaseDB)では、12c 以降のデータベースをプロビジョニングした場合、デフォルトでマルチテナント・コンテナ・データベース(CDB)で作成されます。 CDBで構成されているオンプレミスのデータベースからBaseDBへ移行する場合、PDBのアンプラグ・プラグを行う事で簡単に移行可能です。 その際、両データベースのバージョンに差異があった場合は autoupgrade等のツールを利用する事で、バージョンアップも行う事が可能です。 ここでは、オンプレミスのデータベース(19.12.0.0.0)からBaseDB(19.12.0.0.0)へPDBを移行する手順をご紹介します。 前提条件 : 移行元のデータベースがCDBで構成されていること Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 目次 1. 移行元のデータベースからPDBをアンプラグする 2. BaseDBにPDBをプラグする 3. 表領域の暗号化を行う 所要時間 : 約1時間30分 1. 移行元のデータベースからPDBをアンプラグする まずは移行元のデータベースから、移行対象のPDBをアンプラグします。 アンプラグはDatabase Configuration Assistantツールを使って行う事も可能ですが、今回はコマンドでの実施手順を紹介します。 対象PDBの構成確認します PDBの移動にあたってデータファイルをBaseDBに持っていく必要があります。 まずは下記SELECT文にて対象PDBで使用しているデータファイルのディレクトリを確認します。 alter session set container=&lt;pdb_name&gt;; select tablespace_name, file_name from dba_data_files; （作業イメージ） 対象PDBをクローズします...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs201-pdb-plug/",
        "teaser": "/ocitutorials/database/dbcs201-pdb-plug/pdb-plug05.png"
      },{
        "title": "101 : ExaDB-Dを使おう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) は、Oracle Databaseが高い可用性を備えつつ高いパフォーマンスを発揮できるOracle Exadata Database Machine (Exadata)が利用可能なサービスです。同じようにOCI上でExadataを利用可能なサービスとしては、Autonomous Data WarehouseやAutonomous Transaction Processing などのAutonomous Databaseのサービスがありますが、ExaDB-D が他のサービスと大きく違うところは、全オプションが使える専有型のUser-Managedサービスであるということです。 専有型 : H/Wもユーザー専有となり、他のユーザーの環境と分離されるため、セキュリティ・性能を担保できます。 User-Managed サービス : OS以上は顧客管理。OS上の構築・運用・管理に有効な機能を、クラウドのツールでも提供。パッチ適用やメンテナンスの実施判断・作業タイミングは顧客判。OSログインが可能でこれまで同様の管理方法を用いることができる (OS権限が必要な変更作業、サード・パーティのAgentの導入、ローカルにログやダンプファイルの配置など)ので、別途インスタンスやストレージサービスを立てる必要はありません。 また、オンライン・スケーリング (停止なし)での1時間単位での柔軟な価格体系、デフォルトでの可用性構成や容易に高可用性構成が組めること、PaaSとしてのプロビジョニングや管理面などのメリットがあります。 目次 : 1. Exadata Infrastructureの作成 2. Exadata VMクラスタの作成 3. データベースの作成 4. DBシステムへのアクセス 5. データベース(PDB)へのアクセス 6. PDB上のスキーマへのアクセス...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/exadb-d101-create-exadb-d/",
        "teaser": "/ocitutorials/database/exadb-d101-create-exadb-d/teaser.png"
      },{
        "title": "102 : ExaDB-D上のPDBを管理しよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、Oracle Cloud Infrastructureの上で稼働するOracle DatabaseのPDBをOCIコンソールから停止したり、起動したり、既存PDBからクローンするなどの操作が簡単に行うことが可能です。この章では実際にどのように操作するのか確認していきます。 目次 : 1. PDBの起動・停止 2. PDBの新規作成 3. PDBクローンの作成 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること 所要時間 : 約1時間 1. PDBの起動・停止 OCIコンソール・メニューから Oracle Database → Oracle Public Cloud上のExadata に移動します。 利用したいコンパートメントをリスト範囲のコンパートメントから選択します。 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、リージョンの一覧から選択します。 操作したいPDBを持つExadata VMクラスタの表示名をクリックします。 データベースの一覧から対象のデータベースの名前をクリックします。 リソースの一覧からプラガブル・データベースをクリックします。 操作したいPDBの右側にある・・・メニューをクリックして、停止をクリックします。 確認画面が表示されたら、PDBの停止をクリックします。 操作したPDBの状態が更新中に変化します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/exadb-d102-manage-pdb/",
        "teaser": "/ocitutorials/database/exadb-d102-manage-pdb/teaser.png"
      },{
        "title": "103 : 自動バックアップを設定しよう",
        "excerpt":"はじめに サービスを利用していくにあたり、利用している環境のインスタンスやデータが壊れてしまった場合や、過去の時点にデータを戻したい場合など、何か起きた時のデータ復旧のためにバックアップやリカバリについての検討は重要です。 Oracle Databaseのバックアップ操作に対して次の3つのオプションが提供されます。ただし、これらのオプションの混在はサポートされていません。 オプション1：Oracle管理バックアップ 1回かぎりの構成に基づいて、ExaDB-Dによって完全に管理されます。完全に統合されたintoExaDB-DであるControl Planeに加えて、OCI APIを介してバックアップにアクセスすることもできます。Oracleではこちらのオプションをお薦めしています。 オプション2：ユーザ構成バックアップ お客様は、dbaascli database backupおよびdbaascli database recoverコマンドを使用してホストからバックアップを構成することができます。ただし、バックアップはControl Planeと同期されず、OCI APIと統合されません。また、バックアップに対する管理操作もライフサイクル操作は、サービス・コントロール・プレーン・コンソールからサポートされていません。 オプション3：RMANを使用したバックアップ お客様が所有するカスタマイズ・スクリプトとともにRMANを使用してバックアップを直接取得できます。RMANを使用してバックアップする場合は、バックアップ自動化からデータベースの登録を解除する必要があります。 以上のオプションについての詳細はバックアップおよびリカバリ操作を実行するためのOracle推奨オプションを参照してください。 Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、RMANを利用した自動バックアップ機能が利用可能で、リカバリも最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 ここでは、OCIコンソールから自動バックアップを構成するまでの手順についてご紹介します。 目次 : 1. 自動バックアップの前提条件を確認する 2. 自動バックアップの設定をしよう 3. 自動バックアップの設定を変更しよう 4. オンデマンド・バックアップを取得しよう 5. 取得したバックアップを確認しよう 前提条件 : 101 :...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/exadb-d103-automatic-backup/",
        "teaser": "/ocitutorials/database/exadb-d103-automatic-backup/teaser.png"
      },{
        "title": "104 : バックアップからリストアしよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、自動バックアップ機能やオンデマンドバックアップにて取得したバックアップを利用する事で、最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 また、バックアップ元のデータベースに対してリストアするだけでなく、別DBシステム上にリストアする事も可能です。 ここでは、OCI コンソールからリストアする手順についてご紹介します。 目次 : 1. バックアップ元のデータベースに対してリストア 2. バックアップから新規データベースとしてリストア 3. オンデマンド・バックアップを使用したリストア 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること 103 : 自動バックアップを設定しようを通じてバックアップを取得していること 所要時間 : 約1時間　※環境によって異なるため、参考値です 1. バックアップ元のデータベースに対してリストア まずはバックアップ元のデータベースに対してリストアしてみましょう。 リストア方法には下記3つがありますので、リストアしたい地点に応じてどのリストア方法を利用するか検討してください。 最新にリストア データ損失の可能性が最も低い、直近の正常な状態にデータベースをリストアします。 タイムスタンプにリストア 指定した日時にデータベースをリストアします。 SCNにリストア SCNを使用してデータベースをリストアします。 有効なSCNを指定する必要がありますので、データベース・ホストにアクセスして問い合せるか、オンラインまたはアーカイブ・ログにアクセスして使用するSCN番号を確認してください。 OCIコンソール・メニューから Oracle...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/exadb-d104-backup-restore/",
        "teaser": "/ocitutorials/database/exadb-d104-backup-restore/teaser.png"
      },{
        "title": "105 : スケーリングしよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) のスケーリングの対象は、2種類あります。１つは、割り当てられているH/Wリソース内で利用可能な、OCPU数のスケール・アップ/ダウン。データベースや仮想マシンを再起動することなく、処理を継続したままオンラインで変更可能です。また、VMクラスタ全体に対しての変更になります。そのため、例えばノード毎にCPUコア数を変えることはできないので、仮想マシン数の倍数が指定可能になります。もう１つは、インフラストラクチャー部分のデータベース・サーバーとストレージ・サーバーのスケール・アップ(ダウンは不可)。こちらは、X8M以降のモデルで可能で、CPU・メモリ・ストレージなどH/W的に割り当てられている専有リソースを増やしたい場合に、オンラインで追加が可能です。 目次 : 1. OCPUのスケーリング 2. CLIでのOCPUのスケーリング 3. インフラストラクチャのスケーリング データベース・サーバーの追加 ストレージ・サーバーの追加 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること Oracle Cloud Infrastructure Documentation &gt; コマンド・ライン・インターフェース &gt; クイックスタートを通じてOCI CLIのセットアップが完了していること 所要時間 : 約6時間（待ち時間を含む）※環境によって異なるため、参考値です 1. OCPUのスケーリング まずはコンソール上の操作でのOCPUスケーリングからです。 OCIコンソール・メニューから Oracle Database → Oracle Public Cloud上のExadata に移動します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/exadb-d105-scaling/",
        "teaser": "/ocitutorials/database/exadb-d105-backup-restore/teaser.png"
      },{
        "title": "106 : データベースのバージョンを指定しよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、VMクラスタ上で作成するデータベースのバージョンを指定したり、ユーザーの個別の用途や要求に合わせるようにカスタム・イメージを作成して指定することを簡単に行うことが可能です。この章ではデータベース・ホームおよびカスタム・イメージの作成方法について紹介します。 目次 : 1. データベース・ホームの作成 2. カスタム・イメージを使用したデータベース・ホームの作成 カスタム・イメージの作成 データベース・ホームの作成 3. 確認作業 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること 所要時間 : 約30分　※環境によって異なるため、参考値です。 1. データベース・ホームの作成 OCIコンソール・メニューから Oracle Database → Oracle Public Cloud上のExadata に移動します。 利用したいコンパートメントをリスト範囲のコンパートメントから選択します。 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、リージョンの一覧から選択します。 操作したいExadata VMクラスタの表示名をクリックします。 リソースの一覧からデータベース・ホームをクリックします。 データベース・ホームの作成をクリックします。 データベース・ホームの作成ダイアログで以下の操作を行います。 データベース・ホームの表示名に任意の名前を入力します。 データベース・イメージの変更をクリックします。 イメージ・タイプはOracle...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/exadb-d106-dbversion/",
        "teaser": "/ocitutorials/database/exadb-d106-dbversion/teaser.png"
      },{
        "title": "107 : パッチを適用しよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、OS以上がユーザー管理となるため、OS以上のOS、Grid Infrastructure、Database、そしてPaaSサービスの管理のためのクラウド・ツールに対するパッチ適用は、ユーザー側でパッチ適用の計画と適用実施が可能です。ここでは、それぞれのパッチ適用方法についてご紹介します。 目次 : 1. Grid Infrastructure(GI)のパッチ適用 2. データベースのパッチ適用 Out-of-place Patching In-place Patching 3. クラウド・ツール(dbaascli)のパッチ適用 4. OSのパッチ適用 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること 104 : バックアップからリストアしようを通じてデータベースのバックアップが完了していること 所要時間 : 約2時間　※環境によって異なるため、参考値です。 1. Grid Infrastructure(GI)のパッチ適用 OCIコンソール・メニューから Oracle Database → Oracle Public Cloud上のExadata に移動します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/exadb-d107-patch/",
        "teaser": "/ocitutorials/database/exadb-d107-patch/teaser.png"
      },{
        "title": "108 : Data Guardを構成しよう",
        "excerpt":"はじめに Oracle Data Guardとは、変更履歴(REDO)を利用して自動でリアルタイム・データベース複製を持つことが出来る機能です。この機能を利用することによって、データベース障害やリージョン障害などのRTO/RPOを短くすることができ、広範囲な計画停止(メンテナンス)においてもスタンバイをプライマリに切り替えることによって停止時間を極小化することが可能です。バックアップを取得していても、有事の際の復旧において、大量データのリストアが必要になる場合ではRTOを満たせないケースもあります。こういったケースに備えて、バックアップだけでなく、すぐに切り替えられるスタンバイを持つことは重要です。災害対策(DR)としてのデータ保護はもちろんのこと、移行やアップグレードの停止時間短縮といった利用用途もあります。また、参照専用として利用可能なActive Data Guardにしたり、一時的に読み書き可能なスナップショット・スタンバイとして利用したりと、普段から利用できるスタンバイ・データベースを持つことができます。参照処理をオフロードしたり、この仕組みを応用してデータ破損が検知された場合にクライアントにエラーを返すことなく自動修復をしてくれる自動メディア・ブロックリカバリ機能も使えるため、Data Guardであればスタンバイのリソースも有効活用してROIを高めつつ、きちんと切り替えられるスタンバイを持つということが可能です。 ここでは、OCIコンソールからExaDB-Dで別リージョン間(東京、大阪)でのData Guardを構成する手順について紹介します。東京をプライマリ、大阪をスタンバイとして構成します。使用するリージョンは任意です。 目次 : 1. Data Guardの構成 2. Data Guardの切り替え スイッチオーバー フェイルオーバー 回復 3. Data Guard構成に含まれるDBの削除方法 前提条件 : 101 : ExaDB-Dを使おうを通じて、プライマリ・データベースのリージョン（本ガイドでは東京リージョン）でExaDB-Dの作成が完了していること。 その2 - クラウドに仮想ネットワーク(VCN)を作るを通じて、スタンバイ・データベースのリージョン（本ガイドでは大阪リージョン）でVCNの作成が完了していること。 プライマリ・データベースのリージョン（本ガイドでは東京リージョン）とスタンバイ・データベースのリージョン（本ガイドでは大阪リージョン）間でリモートVCNピアリングの設定が完了していること。設定方法については、Oracle Cloud Infrasturctureドキュメント - DRGを介した異なるリージョン内のVCNのピアリングをご参照ください。 プライマリ・データベースのリージョン（本ガイドでは東京リージョン）とスタンバイ・データベースのリージョン（本ガイドでは大阪リージョン）のそれぞれのVCNのセキュリティ・リストの設定でポート1521を開く。設定方法については、Oracle Cloud Infrastructureドキュメント - セキュリティ・リストをご参照ください。 所要時間 : 約2時間　※環境によって異なるため、参考値です。 1. Data Guardの構成 OCIコンソール・メニューから Oracle Database...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/exadb-d108-dataguard/",
        "teaser": "/ocitutorials/database/exadb-d108-dataguard/teaser.png"
      },{
        "title": "101: ADBインスタンスを作成してみよう",
        "excerpt":"はじめに この章はまずAutonomous Database(ADB) を構成するために必要なリージョンおよびコンパートメントを設定いただきます。 その上で、ADBインスタンスを作成、データベース・ユーザー（スキーマ）を作成し、Database Actionsを使用してアクセスしてみます。 目次 1. リージョンを設定し、コンパートメントを用意しよう 2. ADBインスタンスを作成してみよう 3. Database Actionsで操作してみよう 所要時間 : 約20分 1. リージョンを設定し、コンパートメントを用意しよう 1-1. サービス画面へのアクセス まず初めにOracle Cloud Infrastructure のコンソール画面から、ADBのサービス画面にアクセスします。 ブラウザから https://www.oracle.com/jp/index.html にアクセスし、ページ上部の アカウントを表示 をクリックし、クラウドにサインイン をクリックします。 本手順書ではFirefoxを前提に記載しています。英語表記の場合は Sign in to Cloud をクリックしてください。 お手持ちのクラウドテナント名（アカウント名）を入力し、 Continue をクリックします。（ここでは例としてテナント名に「SampleAccount」を入力しています。） クラウドユーザー名 と パスワード を入力し、 Sign In をクリックしてログインします。 （ここでは例として「SampleName」を入力しています。） 以下のようなダッシュボード画面が表示されればOKです。 補足...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb101-provisioning/",
        "teaser": "/ocitutorials/database/adb101-provisioning/img11.png"
      },{
        "title": "102: ADBにデータをロードしよう(Database Actions)",
        "excerpt":"はじめに この章ではDatabase Actions（SQL Developer Webの後継機能）を利用して、サンプルデータをADBインスタンスにデータをアップロードします。 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 以下にリンクされているサンプルデータのCSVファイルをダウンロードしていること サンプルデータファイルのダウンロードリンク 目次 1. 手元のPCからCSVデータをロードしてみよう 2. クラウド・ストレージからデータをロードしてみよう 3. クラウド・ストレージのデータをフィードしてみよう 所要時間 : 約20分 1. 手元のPCからCSVデータをロードしてみよう まず手元のPC上のデータをADBインスタンスにロードしてみましょう。サンプルデータとしてsales_channels.csvファイルを利用します。 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続 を参照し、Database Actionsを起動し、Adminユーザーで接続してください。ツールタブから、データベース・アクションを開くをクリックしてください。 Database Actionsのランディングページのデータ・ツールから　データ・ロード を選択します。 データの処理には、データのロード を選択し、データの場所には、ローカル・ファイル を選択して 次 をクリックします。 ファイルの選択をクリックし、ダウンロードして解凍した sales_channels.csv を選択します。 sales_channels.csvがロードできる状態になりました。 ロード前にペンアイコンをクリックし、詳細設定を確認・変更できます。 sales_channels.csvの表定義等のデータのプレビューを確認したら 閉じる をクリックします。 緑色の実行ボタンをクリックし、データのロードを開始します。 データ・ロード・ジョブの実行を確認するポップアップが表示されるので、実行 をクリックします。 sales_channels.csvに緑色のチェックマークが付き、ロードが完了しました。完了をクリックします。 補足...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb102-dataload/",
        "teaser": "/ocitutorials/database/adb102-dataload/adb2-1_1.png"
      },{
        "title": "103: Oracle LiveLabsのご紹介",
        "excerpt":"はじめに Oracle LiveLabs とはOracle Cloud Infrastructure上でお試しいただける様々なワークショップをまとめたサイトです。2022/11現在600種類を超える数のワークショップが登録されています。 ワークショップの実行には、ご利用いただいているOracle Cloud環境およびAlways Free/トライアル環境をお使いいただけます。またワークショップによっては、Oracle LiveLabsで時間制限を設けた一時利用環境も提供しております。 この章では、Autonomous Databaseのワークショップで一時利用環境を利用する方法について紹介します。 なお、Livelabsは英語での提供ではありますが、ブラウザの翻訳機能をご利用いただくことで十分に進めることができます。 前提条件 Oracleアカウントが作成済みであること(一時利用環境の場合は必須) 目次 1.ワークショップの検索 2.ワークショップ詳細の確認と開始 3.ワークショップの実行 4.ワークショップの時間延長 5.ワークショップの終了 所要時間 : 約10分（ワークショップ実行時間は含みません） 1.ワークショップの検索 Livelabsのトップページ にある View All Workshops ボタンをクリックするとファセット検索の画面へ遷移します。ワークショップの各カードにはワークショップのタイトルと概要、所要時間が表示されます。 ファセット検索で指定できる条件には以下があります。 Level : 対象レベル Beginner(初心者)/Intermediate(中級者)/Advanced(上級者) Workshop Type : ワークショップの提供タイプ Paid Credits(有料クレジット)/Sprints(スプリント)/Run on Livelabs(Livelabs一次利用環境)/Run on Gov Cloud/ADB for Free(Always Free環境)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb103-livelabs/",
        "teaser": "/ocitutorials/database/adb103-livelabs/labimage.png"
      },{
        "title": "104: クレデンシャル・ウォレットを利用して接続してみよう",
        "excerpt":"はじめに Autonomous Database にはさまざまなツールが同梱されており、簡単にご利用いただけますが、 一方で、これまでお使いのアプリケーションからの接続するときはどのように接続するのでしょうか？ Autonomous Databaseには暗号化およびSSL相互認証を利用した接続が前提としており、そのため接続する際はクレデンシャル・ウォレット（Credential.zipファイル）を利用する必要があります。 本章ではこのクレデンシャル・ウォレットを使用した接続方法について確認していきます。 尚、クレデンシャル・ウォレットの扱いに慣れてしまえば、Autonomous だからと言って特別なことはありません。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 SQL Developerを使用した接続を行いたい場合には、当該クライアントツールがインストール済みであること。インストールはこちらから 目次 1. クレデンシャル・ウォレットのダウンロード 2. 設定ファイルの編集 3. ADBに接続 3-1. SQL*Plus を使った接続 3-2. SQLcl を使った接続 3-3. SQL Developer を使った接続 3-4. Database Actions を使った接続 所要時間 : 約20分 1. クレデンシャル・ウォレットのダウンロード ウォレットを利用したADBインスタンスへの接続には、対象インスタンスへの接続情報が格納された クレデンシャル・ウォレット を利用する必要があります。 （より高いセキュリティを担保するために、ADBインスタンスはcredential.ssoファイルを利用した接続のみを受け入れます。） まず、ADBへの接続情報が格納されるCredential.zipファイルをお手元のPCにダウンロードしましょう。 OCIのコンソールにアクセスし、左上のメニューから Oracle Database...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb104-connect-using-wallet/",
        "teaser": "/ocitutorials/database/adb104-connect-using-wallet/img1_3.png"
      },{
        "title": "105: ADBの付属ツールで簡易アプリを作成しよう(APEX)",
        "excerpt":"はじめに この章ではADBインスタンスは作成済みであることを前提に、APEXコンソールの起動から簡単なアプリケーション作成までを体験いただきます。 サンプルとして、これまでExcelで管理していた受発注データを利用して、簡単なアプリケーションを作ってみましょう。 Autonomous Databaseはインスタンスを作成するとすぐにWebアプリ開発基盤であるOracle APEXを利用できるようになります。追加コストは不要です。 Oracle APEXは分かりやすいインターフェースで、コーディングと言った専門的な知識専門的な知識がなくてもアプリケーションを開発できるため非常に人気があります。 Autonomous Database上でAPEXを利用すると、バックアップや可用性、セキュリティ等のインフラの面倒は全てオラクルに任せて、アプリケーションだけに集中できます。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次 1. スプレッドシートのサンプルを用意 2. APEXのワークスペースの作成 3. APEXコンソールの起動 4. スプレッドシートから簡易アプリケーションの作成 5. アプリケーションの実行 6. 実行確認 所要時間 : 約10分 1. スプレッドシートのサンプルを用意 サンプルとして受発注データ(orders.csv)を用意します。 下記のリンクをクリックし、サンプルファイル(orders.zip)を手元のPCにダウンロードして展開してください。 orders.csvをダウンロード 受発注データは次のような表になっており、ORDER_KEY(注文番号)、ORDER_STATUS(注文状況)、UNITS(個数) …etc などの列から構成される、5247行の表となっています。 2. APEXのワークスペースの作成 アプリケーションを作成するためには、ワークペースを作成する必要があります。 最初にADMINユーザで管理画面にログインします。 ADBインスタンスの詳細画面を表示します。メニュー画面上部の ツール タブを選択し、APEXを開く をクリックします。 ログイン画面が表示されるので、下部の言語欄から 日本語 を選択しておきます。（初回は英語表示ですが、日本語を含めた他言語表示に変更することが可能です） ADBインスタンス作成時に指定したADMINユーザのパスワード（本ガイドを参考に作成した方のパスワードは「Welcome12345#」）を入力し、サインインします。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb105-create-apex-app/",
        "teaser": "/ocitutorials/database/adb105-create-apex-app/img3_2.png"
      },{
        "title": "106: ADBでコンバージド・データベースを体験しよう（JSONデータの操作）",
        "excerpt":"はじめに コンバージド・データベースとは、あらゆるデータをサポートするマルチモデルを採用し、あらゆるワークロードをサポートしていくこと、また様々なツールをDBに統合し開発生産性に貢献していくという、Oracle Databaseのコンセプトの一つです。 Autonomous Databaseもコンバージド・データベースとして、RDBのフォーマットだけでなく、JSON、Text、Spatial、Graphといった様々なフォーマットを格納しご利用いただけます。 格納されるデータの種類ごとにデータベースを用意するのではないため、データの重複や整合性に関する懸念は不要であり、またそのためのETLツールを検討する必要もなく、結果的にコストを抑えることが可能です。 では、実際にどのように操作するのでしょうか？このページではJSONを例にその操作方法の一例を紹介します。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次 1.データを格納してみよう 2.SODA APIでアクセスしてみよう 3.SQLでアクセスしてみよう 所要時間 : 約20分 1. データを格納してみよう まずはJSONデータをADBインスタンスに登録し、登録したデータを確認しましょう。ここではSODA APIを実行できるDatabase Actionsを利用します。 SODA APIは、Simple Oracle Document Accessの略で、オラクルが用意するJSONデータにアクセスする際のAPIです。新たにJSONコレクションを作成する、挿入、検索、変更や削除にご利用いただけます。SQLで言えばDDL、DMLに当たります。 このSODA APIはJavaScriptはもちろん、JavaやPython, PL/SQLなどからCallして利用することが可能ですし、SQLclやDatabase Actionsではデフォルトでインストールされています。 （参考資料: Autonomous JSON Database 技術概要 ） Database Actionsにアクセスし、SQLを選択します ドキュメントを格納するコレクションempを作成します。以下のスクリプトをワークシートに貼り付け、緑色のボタンで実行してください （コレクションとはRDBMSで言う表に相当し、内部的には一つの表を作成しています。） soda create emp コレクションempが作成されたことを確認します soda list JSONのドキュメントをempコレクションに格納します。以下のSODAコマンドを貼り付け...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb106-json/",
        "teaser": "/ocitutorials/database/adb106-json/img00.png"
      },{
        "title": "107: ADBの付属ツールで機械学習(予測モデルからデプロイまで)",
        "excerpt":"はじめに この章では、Autonomous Databaseの複数の付属ツール(Database Actions、OML AutoML UI、OML Notebook、Oracle Application Express(APEX))を活用し、ワンストップの機械学習環境を体感していただきます。今回は、機械学習の題材として、タイタニック問題を扱います。タイタニックの乗客情報から乗客の生存予測を行うモデルを作成します。モデル作成後、そのモデルに実際に予測をさせて、更にその予測をアプリケーションでのレポートまで行います。データベースの中で機械学習のプロセスが完結しているOracleの機械学習へのアプローチを体験していただけると思います。 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 以下にリンクされているZipファイルをダウンロードし、解凍していること OMLチュートリアルで資料するファイル 目次 1. OMLユーザ新規作成 2. Database Actionsでデータロード 3. OML AutoML UIで生存予測モデル作成 4. OML Notebookで予測をかける 5. APEXで予測結果をレポート 6. まとめ 7. 参考資料 所要時間 : 約60分 1. OMLユーザ新規作成 まずOMLを利用する権限を持つユーザをDatabase Actionsで新規作成していきます。 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続 を参照し、Database Actionsを起動し、Adminユーザーで接続してください。ツールタブから、データベース・アクションを開くをクリックしてください。 管理 &gt; データベース・ユーザーをクリックしてください。 +ユーザの作成をクリックしてください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb107-machine-learning/",
        "teaser": "/ocitutorials/database/adb107-machine-learning/img72.png"
      },{
        "title": "108: 接続文字列を利用して接続してみよう",
        "excerpt":"はじめに Autonomous Database への接続には、104: クレデンシャル・ウォレットを利用して接続してみよう でご紹介した通り、ウォレットファイルを利用した証明書認証・SSL暗号化接続がデフォルトになっています。 しかし特定の条件下では、このウォレットを利用しないでセキュアに接続することが可能です。 本章では、ADBにおけるネットワーク・アクセスの種類とウォレットを利用しない接続方式について確認していきます。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次 1. ADBにおけるネットワーク・アクセスの種類 2. TLS接続の前提条件 3. TLS接続 3-1. 仮想マシン作成 3-2. ACLの定義 3-3. DB接続文字列の確認 3-4. ADB接続 所要時間 : 約30分 1. ADBにけるネットワーク・アクセスの種類 ADBでは、プロビジョニング時に以下の3つの中からネットワーク・アクセス・タイプを選択することができます。 すべての場所からのセキュア・アクセス（パブリック・エンドポイント） データベース資格証明（ウォレット）を持っているユーザーであれば、インターネット上の全てのIPアドレスから接続できる方式です。 許可されたIPおよびVCN限定のセキュア・アクセス（パブリック・エンドポイント） 上の[すべての場所からのセキュア・アクセス]に、特定のIPアドレス、CIDRブロック、VCNからのアクセスに限定するようアクセス制御リスト(ACL)を設定する方式です。 プライベート・エンドポイント・アクセスのみ（プライベート・エンドポイント） ADBインスタンスにパブリックIPを持たせず、プライベートIPを持たせる場合に選択します。すでに作成済みのVCN、サブネット内にADBインスタンスを配置します。指定したVCNからのトラフィックのみ許可され、アクセス制御はサブネットのセキュリティ・リスト(SL)またはネットワーク・セキュリティ・グループ(NSG)で行います。 なお、ウォレットの差し替えが必要ですが、インスタンス作成後でもエンドポイントの変更は可能です。 また、接続経路は以下の3つの方法があります。 インターネット接続 IPsec VPNを介した接続 FastConnect(Private Peering / Public Peering)を利用した接続 2....","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb108-walletless/",
        "teaser": "/ocitutorials/database/adb108-walletless/walletless_teaser.png"
      },{
        "title": "109: プライベート・エンドポイントのADBを作成してみよう",
        "excerpt":"はじめに Autonomous Databaseでは、パブリック・エンドポイントとプライベート・エンドポイントを選択できます。 プライベート・エンドポイントの場合は指定したVCN内のサブネット上にエンドポイントを配置することができます。 アクセス制御は指定したVCNのサブネットのセキュリティ・リスト、もしくはネットワーク・セキュリティ・グループ(NSG)を利用して行います。 目次 1. プライベート・エンドポイントのADBへの接続 1-1. ネットワーク構成図の確認 1-2. ADBの作成 1-3. ADBへの接続 2. Database Actionsへの接続 2-1. パブリック・エンドポイントでACLを定義している 2-2. プライベート・エンドポイントでInternetから接続 2-3. プライベート・エンドポイントでプライベート・ネットワークから接続 所要時間 : 約30分 1. プライベート・エンドポイントのADBへの接続 1-1. ネットワーク構成の確認 プライベート・エンドポイントのAutonomous Database への接続方法は、IPsec VPN やFastConnect からアクセスする方法が一般的ですが、本章ではインターネットからの接続方法をご紹介します。 ネットワーク構成は上記のようにしています。各Security List の設定を以下に示します。 プライベート・サブネットsub_pri1は、パブリック・サブネットsub_pubからのSSHのみ許可、sub_pri2は、sub_pri1からのTCP接続(1521ポート)のみ許可しています。 本章では、パブリック・サブネットに踏み台サーバーを置いて利用しますが、インターネット側からアクセスする場合には、Bastionサービスも利用できます。 1-2. ADBの作成 プライベート・エンドポイントのADBを作成するには、ADBの作成ページの[ネットワーク・アクセスの選択]でプライベート・エンドポイント・アクセスのみを選択します。 以下の画像のようにADBを配置する仮想クラウド・ネットワークとサブネットを指定します。 なお、VCNのセキュリティ・リストのルールによるアクセス制御が設定されている場合、ネットワーク・セキュリティ・グループによるアクセス制御はオプションになります。 1-3. ADBへの接続 パブリック・サブネットの踏み台サーバー経由でプライベート・サブネットのコンピュート・インスタンスに接続します。 プライベート・エンドポイント・アクセスのみの場合は、ウォレットなし接続が可能です。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb109-private-endpoint/",
        "teaser": "/ocitutorials/database/adb109-private-endpoint/private-endpoint_teaser.png"
      },{
        "title": "110: Oracle Analytics Desktopを使ってデータを見える化してみよう",
        "excerpt":"はじめに Autonomous Database (ADB) にはさまざまなツールが同梱されており、簡単にご利用いただけますが、 Oracle Analytics Desktop を使うと、ユーザーのPC上から Autonomous Database のデータを見える化できます。 Oracle Analytics Desktop は、デスクトップ・アプリケーションであり、データの探索および見える化するためのツールです。複数のソースからサンプル・データを簡単に検索したり、ローカルのデータセットを分析したり調査することが可能です。 Autonomous Database は暗号化およびSSL相互認証を利用した接続を前提としており、そのため接続する際はクレデンシャル・ウォレット（Credential.zipファイル）を利用する必要があります。 本章ではこのOracle Analytics Desktopを使用した Autonomous Database の見える化について確認していきます。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう をご参照ください。 クレデンシャル・ウォレットを取得済みであること ※クレデンシャル・ウォレットの取得については、104:クレデンシャル・ウォレットを利用して接続してみよう を参照ください。 Oracle Analytics Desktop は、Windows OS用とMac OS用がありますが、本章ではWindows OS用 を使って説明します。 Oracle Analytics Desktop をインストールするPCから、プロキシ・サーバーを経由せずに、直接、インターネットに繋がること。 ※Oracle Analytics Desktop はプロキシ対応できません。 目次 1....","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb110-analyze-using-oad/",
        "teaser": "/ocitutorials/database/adb110-analyze-using-oad/img3_13_1.png"
      },{
        "title": "201: 接続サービスの理解",
        "excerpt":"Autonomous Database では、事前に定義済の接続サービスが用意されています。 本章では、接続サービスの概要をご紹介します。 所要時間 : 約10分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 目次： 1. 接続サービスとは？ 2. Database ActionsのResource Managerの設定画面にアクセスしよう 3. CPU/IOの優先度の変更しよう 4. 処理時間/利用IOの上限を設定しよう 5. 同時実行セッション数の制限が変更できることを確認しよう 1. 接続サービスとは？ 接続サービスの選択 インスタンスに接続する際、Autonomous Databaseはアプリケーションの特性に応じて適切な「接続サービス」を選択する必要があります。 この「接続サービス」は、パラレル実行・同時実行セッション数・リソース割り当てなどの制御について事前定義されたもので、ユーザーは接続サービスを選択するだけで、CPUの割当や並列処理をコントロールできます。 選択可能な接続サービスの種類は、次の通りです。 Autonomous Data Warehouse(ADW) では３種類、Autonomous Transaction Processing(ATP)では5種類あり、ワークロード適したものを選択します。 使い分けの指針、スタートポイント 代表的なワークロードを「OLTP系」と「バッチ系/DWH系」の２つのカテゴリに分類し、それぞれの処理の特性と適応する接続サービスについてまとめました。 OLTP系 バッチ系・DWH 特徴 少量の行しかアクセスしない 大量のユーザが同時に実行する 一般的なオーダーとしてはミリ秒レベル 大量の行にアクセスし、一括で処理する ユーザ数は少ない 一般的なオーダーとしては秒～分レベル...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb201-service-names/",
        "teaser": "/ocitutorials/database/adb201-service-names/image_top.png"
      },{
        "title": "202: コマンドラインから大量データをロードしてみよう(DBMS_CLOUD)",
        "excerpt":"はじめに 大量データをAutonomous Databaseにロードするために、DBMS_CLOUDパッケージを活用したデータのロード方法を確認していきましょう。 下記のサンプルデータ(customers.csv)をローカルデバイスに事前にダウンロードして下さい。 サンプルデータファイル(customers.csv)のダウンロードリンク 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次 1. Database Actionsに接続 2. DBMS_CLOUDパッケージの実行 所要時間 : 約10分 1. Database Actionsに接続 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続 を参照し、Database Actionsを起動し、Adminユーザーで接続してください。ツールタブから、データベース・アクションを開くをクリックしてください。 DBMS_CLOUDパッケージを使ったデータロードをワークシートで実行していきます。SQLをクリックしてください。 2. DBMS_CLOUDパッケージの実行 以下の1～5までの例を参考にコマンドを作成し、ワークシートに貼り付けスクリプトの実行をクリックし、データをロードします（集合ハンズオンセミナーでは講師の指示に従ってください) クレデンシャル情報の登録 クレデンシャル情報の登録に必要な認証情報を手に入れる手順は、ADBにデータをロードしてみよう(Database Actions)の記事内のクラウド・ストレージからデータをロードしてみようを参照ください。 credential_name: DBに保存した認証情報を識別するための名前、任意 username: 上記で取得したOracle Object Storageにアクセスするための ユーザ名 password: 取得したAuth Token BEGIN DBMS_CLOUD.CREATE_CREDENTIAL( CREDENTIAL_NAME =&gt; 'USER_CRED', USERNAME =&gt; 'myUsername',...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb202-dataload-dbms-cloud/",
        "teaser": "/ocitutorials/database/adb202-dataload-dbms-cloud/img2.png"
      },{
        "title": "203: 分析系クエリの実行(Star Schema Benchmark)",
        "excerpt":"はじめに この章ではAutonomous Databaseにおける分析系クエリの性能を確認します。 特に、インスタンスのOCPU数を増やした前後でのパフォーマンスを比較することで、簡単に性能が向上することをみていきます。 また、SQLの実行状況を確認するために、サービス・コンソールを操作いただきます。 目次 1. SSBスキーマを確認しよう データ・モデラーによる構成確認 各表の件数確認 2. OCPU数の違いによる処理時間の差を確認しよう OCPU=1の場合 OCPU=8の場合 3. 性能調査に使えるツールのご紹介 データベース・ダッシュボード パフォーマンス・ハブ 所要時間: 約40分 Star-Schema-Benchmark（SSB）とは？ ADBのインスタンスには、DWH系・分析系のサンプルスキーマとして以下が同梱されています。 Oracle Sales History（SHスキーマ） Star Schema Benchmark（SSBスキーマ） 上記のサンプルスキーマの特長 約1TB、約60億行のファクト表と、複数のディメンション表から構成 マニュアルには動作確認用のサンプルSQLも記載されている ADW、ATPの双方で利用可能（2022/10時点）- 本ガイドでは前の章で作成したAutonomous Transaction Processing(ATP) インスタンスの利用を前提に記載していますが、SSBのような分析系・DWH系のアプリケーションの場合、Autonomous Data Warehouse(ADW) をご選択いただくことを推奨しています。 ※サンプルスキーマの詳細についてはこちらを参照ください。 作業の流れ SSBスキーマを確認しよう OCPU数の違いによる処理時間の差を確認しよう サービスコンソール/SQL Monitorで処理内容を確認しよう 1. SSBスキーマを確認しよう データ・モデラーによる構成確認 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb203-bulk-query/",
        "teaser": "/ocitutorials/database/adb203-bulk-query/img0.png"
      },{
        "title": "204: 開発者向け仮想マシンのセットアップ方法",
        "excerpt":"はじめに 後続のチュートリアルで利用する開発環境をセットアップしましょう。 Oracle Cloud Infrastructure（OCI） では様々な仮想マシンイメージを提供しています。 本ページではその中から、開発者向けのLinux仮想マシンである Oracle Linux Cloud Developer イメージ をセットアップする手順を記載しています。 Oracle Linux Cloud Developer イメージは、Python、Node.js、Goといった言語や、Oracle Instant Clientなどの各種接続ドライバ、Oracle Cloud Infrastructure CLI(OCI CLI)といった各種ツールがプリインストールされており、アプリケーション開発は勿論、各種検証作業を実施する際にとても便利です。 尚、Oracle Linux Cloud Developer イメージの詳細については こちら を参照ください。 またOracle Cloud Infrastructureに仮想マシン作成する手順詳細に関しては本チュートリアル 入門編の その3 - インスタンスを作成する の手順も併せてご確認ください。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 ADBインスタンスのクレデンシャル・ウォレットがダウンロード済みであること ※クレデンシャルウォレットのダウンロード方法については、104: ウォレットを利用してADBに接続してみよう の、1. クレデンシャル・ウォレットのダウンロード をご確認ください。 目次...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb204-setup-VM/",
        "teaser": "/ocitutorials/database/adb204-setup-VM/image_top.png"
      },{
        "title": "205: オンライン・トランザクション系のアプリを実行してみよう(Swingbench)",
        "excerpt":"はじめに Oracle Exadataをベースに構成されるAutonomous Database(ADB)は、分析系の処理だけでなく、バッチ処理、OLTP（オンライン・トランザクション）処理といった様々なワークロードに対応可能です。 この章ではOracle Databaseのベンチマークツールとして利用されることの多いSwingbenchを利用し、OLTP処理をATPで動かしてみます。 併せて、データベースの負荷状況に応じて自動的にCPUをスケールさせる、自動スケーリング（Auto Scaling）の動作を確認します。 目次 1.Swingbenchをセットアップしよう Swingbenchをダウンロード、データ生成 生成されたスキーマ・オブジェクトの確認 2.Swingbenchを実行し、OCPUをスケールアップしてみよう OCPU=1 (自動スケーリング無効) OCPU=4 (自動スケーリング無効) OCPU=4 (自動スケーリング有効) 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間: 約1時間30分 1.Swingbenchをセットアップしよう Swingbenchをダウンロード、データ生成 まずはSwingbenchを仮想マシン上にダウンロードし、ベンチマーク・データをADBインスタンス内に生成しましょう。 OCIで仮想マシンを作成する場合は、こちらの204: 開発者向け仮想マシンのセットアップ方法を参考にしてください。 Terminalを起動し、仮想マシンにopcユーザでログイン後、oracleユーザに切り替えます。 ssh -i &lt;秘密鍵のパス&gt; opc@&lt;仮想マシンのIPアドレス&gt; sudo su - oracle 作業用ディレクトリを作成します。 mkdir -p labs/swingbench 作業用ディレクトリに移動します。 cd labs/swingbench Swingbenchをダウンロードします。wgetもしくはcurlコマンドをご利用ください。（数分程度かかります。） wget https://github.com/domgiles/swingbench-public/releases/download/production/swingbench30092022.zip...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb205-swingbench/",
        "teaser": "/ocitutorials/database/adb205-swingbench/img0.jpg"
      },{
        "title": "206: Node.jsによるADB上でのアプリ開発",
        "excerpt":"Node.jsはサーバサイドでJavaScript言語を実行するオープンソースの実行環境です。 node-oracledbドライバを利用することで、Autonomous Databaseに簡単に接続できます。 尚、JavaScriptのコーディングやNode.js自体の使い方を説明するものではありません。 所要時間 : 約20分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 開発用の仮想マシンが構成済みであり、仮想マシンからADBインスタンスへのアクセスが可能であること 仮想マシンのoracleユーザのホームディレクトリ配下にlabsフォルダをアップロード済みであること labs.zip を手元のPCにダウンロード アップロード方法については こちら をご確認ください。 仮想マシン上に直接ダウンロードする場合は、次のコマンドを実行します。 wget https://oracle-japan.github.io/ocitutorials/database/adb-data/labs.zip 目次 1. 事前準備 2. Node.js環境の確認 3. ADBに接続してみよう 4. ADB上のデータを操作してみよう 1. 事前準備 ネットワークセキュリティの設定変更 本章ではお手元のPCからインターネットを介して、Node.jsのアプリにポート3030で接続します（3030は変更可能）。 OCIではセキュリティ・リストと呼ばれる仮想ファイアウォールの役割を担うリソースがありますが、このセキュリティ・リストのデフォルトの設定では、こちらの接続は拒否されます。 ポート3030からの接続を可能にするには、事前に外部インターネットからこの接続を受け入れるためのイングレス・ルール(インバウンド・ルール)の設定、およびNode.jsが配置される仮想マシンのOSのFirewallの設定を行う必要があります。 ※ セキュリティ・リストに関する詳細な情報はこちら - イングレス・ルールの設定 メニューから ネットワーキング、仮想クラウド・ネットワーク を選択します。 作成済みの仮想クラウド・ネットワーク（ vcn01 ）を選択します。 （こちらの画面では、ADB_HOL_DEV_VCNとなっています） ※該当するVCNが表示されない場合は、適切なリージョンおよびコンパートメントが選択されていることをご確認ください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb206-appdev-nodejs/",
        "teaser": null
      },{
        "title": "207: PythonによるADB上でのアプリ開発",
        "excerpt":"Pythonとは、汎用のプログラミング言語である。コードがシンプルで扱いやすく設計されており、C言語などに比べて、さまざまなプログラムを分かりやすく、少ないコード行数で書けるといった特徴がある。（ウィキペディアより引用） PythonでAutonomous Databaseを利用する際には、cx_Oracleというモジュールを利用します。 尚、Python言語自体の使い方を説明するものではありません。 所要時間 : 約10分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 開発用の仮想マシンが構成済みであり、仮想マシンからADBインスタンスへのアクセスが可能であること 仮想マシンのoracleユーザのホームディレクトリ配下にlabsフォルダをアップロード済みであること labs.zip をダウンロード アップロード方法については こちら をご確認ください。 目次 1. ADBに接続してみよう 2. ADB上のデータを操作してみよう 1. ADBに接続してみよう まずPythonでADBに接続し、ADBのバージョンを確認してみます。 尚、事前にこちらを実施し、SQL*plusで接続できていることを前提に記載しています。 Tera Termを利用してopcユーザで仮想マシンにログインします。 oracleユーザにスイッチします。一旦rootユーザに切り替えてから、oracleユーザに切り替えます。 -- rootユーザにスイッチ sudo -s -- oracleユーザにスイッチ sudo su - oracle ADBへの接続情報をOS環境変数として設定します。 export TNS_ADMIN=/home/oracle/labs/wallets export ORAUSER=admin export ORAPASS=Welcome12345# export...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb207-appdev-python/",
        "teaser": null
      },{
        "title": "208: Oracle Machine Learningで機械学習をしよう",
        "excerpt":"はじめに この章ではOracle Machine Learning(OML)の製品群の1つである、OML Notebookを利用して、DB内でデータの移動が完結した機械学習を体験して頂きます。 事前に前提条件にリンクされているサンプルデータのCSVファイルをお手元のPC上にダウンロードください。 （集合ハンズオンセミナーでは講師の指示に従ってください） 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 以下にリンクされているファイルをダウンロードしていること liquid.csv order_items.csv 目次 準備編 OMLユーザを作成する 作成したOMLユーザのRESTサービスを有効化する データセットをADBにロードする liquid.csvをDatabase Actionsからロード order_items.csvをObject Storageにアップロード 機械学習編 OML Notebookを使い始める 機械学習モデルをビルド・評価する 所要時間: 約40分 準備編 OMLユーザを作成する ツールタブのOracle MLユーザ管理で、MLユーザを作成していきましょう。 ADBのADMINユーザの情報を入力し、サインインをクリックして下さい。 。。 +作成ボタンをクリックし、機械学習用のユーザを作成します。 ユーザーの情報を入力し、画面右上作成ボタンをクリックして下さい。 ユーザOMLが作成されたことを確認し、ADW詳細画面へ戻ります。 作成したOMLユーザのRESTサービスを有効化する 後述のデータロードをステップで、OMLユーザでDatabase Actionsを活用していきます。 OMLユーザーは作成後、RESTを有効化しないとDatabase Actionsにログインできないので、OMLユーザのRESTを有効化していきましょう。 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続 を参照し、Database Actionsを起動し、Adminユーザーで接続してください。ツールタブから、データベース・アクションを開くをクリックしてください。 ADMINユーザでサインインして下さい。 Database Actionsのランディングページからデータベース・ユーザ...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb208-oml-notebook/",
        "teaser": "/ocitutorials/database/adb208-oml-notebook/img12.jpg"
      },{
        "title": "209 : Database Vaultによる職務分掌に基づいたアクセス制御の実装",
        "excerpt":"はじめに Autonomous Databaseの特権ユーザであるADMINユーザはデータベースの管理だけでなくデータベースの全データを参照することができます。しかし、セキュリティ面でそれを許可したくない場合もあります。 Oracle Database Vaultは職務分掌と最小権限の原則を実施し、アクセスポリシーを作成する専用ユーザとアカウント管理専用ユーザを設け、特権ユーザからそれらの管理権限を分離します。 それにより、特権ユーザであってもアクセスポリシーの操作やアカウント管理操作ができず、許可された場合のみしか別アカウントのデータへのアクセスができなくなります。 Oracle Database Vaultの詳細については、Oracle Database Vaultホームページやドキュメントをご覧ください。 本文書では、Autonomous DatabaseでOracle Database Vaultを有効化し、特権ユーザであるADMINユーザが他のユーザのデータにアクセスできないように設定をしてみます。 目次 : 1.テスト用の表を作成 2.Oracle Database Vaultの有効化 3.特権ユーザーの権限はく奪 4.アクセス制御の設定 5.動作確認 6.Oracle Database Vaultの無効化 前提条件 : テスト用の表を作成するスキーマは任意のスキーマでも構いませんが、ここでは、「101:ADBインスタンスを作成してみよう」 で作成したユーザADBUSERを利用しています。 SQLコマンドを実行するユーザインタフェースは、接続の切り替えが容易なので、SQL*Plusを利用しています。Databasee Actionsでも実行可能ですが、ユーザでの接続をログインに読み替え、ログインしなおす必要があります。なお、 SQL*Plusの環境は、「204:マーケットプレイスからの仮想マシンのセットアップ方法」で作成できます。 チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、各ユーザのパスワードはすべて「Welcome12345#」とします。 使用パッケージの引数についての説明は記載していません。詳細はドキュメント『Oracle Database Vault管理者ガイド』（リンクは19c版です）をご参照くださいますようお願いいたします。 所要時間 : 約20分 1.テスト用の表を作成 サンプルスキーマのSSBスキーマのSUPPLIER表の一部を利用して、「101:ADBインスタンスを作成してみよう」 で作成したADBUSERスキーマにテスト用の表を作成します。 SQL*Plusを起動して以下を実行してください。 -- ADBUSERで接続する CONNECT...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb209-DV/",
        "teaser": "/ocitutorials/database/adb209-DV/DatabaseVault.png"
      },{
        "title": "210 : 仮想プライベートデータベース(VPD:Virtual Private Database)による柔軟で細やかなアクセス制御の実装",
        "excerpt":"はじめに Oracle DatabaseのEnterprise Editionでは、表単位より細やかな行や列単位でのアクセス制御をおこなうために、仮想プライベートデータベース(VPD：Virtual Private Database)というソリューションを提供しています。 たとえばひとつの表に複数のユーザーのデータがまとめて入っているような場合でも、それぞれのユーザーが表に全件検索を実施した時に自分のデータしか結果としてもどらないようにすることが可能です。 では、どのような仕組みでそれを実現しているのでしょうか。 実は、内部でSQLに対して自動的に動的な条件を付加しています。イメージで示してみましょう。 部門(Group)が経理部(FIN)の人と営業部(SALES)の人が同じ人事データの表（HR_DETAIL表）に対して同じSQLで検索を行います。しかし、データベース内部では、そのSQLに自動的にユーザーの属性にあわせた条件(Where句(赤字))を付加して実行しています。その結果、それぞれの所属部門に適した異なる結果が表示されるというわけです。 VPDはAutonomous Databaseでも利用できる機能です。基本的な設定、動作を試してみましょう。　　 目次 : 1.テスト用の表を作成 2.ユーザーを作成 3.VPDファンクションの作成 4.VPDファンクションをVPDポリシーとして適用 5.動作確認 6.VPDポリシーの削除 前提条件 : テスト用の表を作成するスキーマは任意のスキーマでも構いませんが、ここでは、「101:ADBインスタンスを作成してみよう」 で作成したユーザADBUSERを利用しています。 SQLコマンドを実行するユーザインタフェースは、接続の切り替えが容易なので、SQL*Plusを利用しています。Database Actionsでも実行可能ですが、ユーザでの接続をログインに読み替え、ログインしなおす必要があります。なお、 SQL*Plusの環境は、「204:マーケットプレイスからの仮想マシンのセットアップ方法」で作成できます。 チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、各ユーザのパスワードはすべて「Welcome12345#」とします。 使用パッケージの引数についての説明は記載していません。詳細はドキュメント『PL/SQLパッケージ及びタイプ・リファレンス』（リンクは19c版です）をご参照くださいますようお願いいたします。 所要時間 : 約20分 1. テスト用の表を作成 サンプルスキーマのSSBスキーマのCUSTOMER表の一部を利用して、「101:ADBインスタンスを作成してみよう」 で作成したADBUSERスキーマにテスト用の表を作成します。 SQL*Plusを起動して以下を実行してください。 -- ADBUSERで接続する CONNECT adbuser/Welcome12345##@atp01_low -- SSB.CUSTEOMER表から新しくVPD_CUSTOMER表を作成する CREATE TABLE adbuser.vpd_customer AS SELECT *...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb210-VPD/",
        "teaser": "/ocitutorials/database/adb210-vpd/vpd.png"
      },{
        "title": "211: クローン機能を活用しよう",
        "excerpt":"Autonomous Databaseのクローン機能を利用することにより、テスト/検証/分析用途の環境複製を、すぐに簡単に作成することができます。 本章では、このクローン機能についてフォーカスしていきます。 所要時間 : 約20分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 構成済みのADBインスタンスへ接続できることが確認できていること 目次： 1. ADBにおけるクローニングの概要 2. 事前準備 3. クローン環境を作成してみよう 4. クローン環境を確認してみよう 1. ADBにおけるクローニングの概要 ADBのクローニング機能は、コンソールまたはAPIを使用して利用することができます。 クローニング機能を使用することで、テスト・開発・分析などの目的でADBのポイントインタイム・コピーを作成できます。 ADBのクローンを作成する際には、クローンタイプ、クローン元のソースの選択、クローンのスペックや配置場所の決定などを行う必要があります。 各項目で設定する内容を順にご紹介します。 クローンタイプについて フルクローン：データベース全体の複製 ソース・データベースのメタデータとデータを含むデータベースが作成されます。 メタデータ・クローン：データベースのメタデータのみの複製 このオプションでは、ソース・データベースのメタデータのみを含むデータベースが作成されます。 メタデータ・クローンでは、格納されるデータはコピーしませんが、表定義や索引定義といったスキーマ定義、オブジェクト構成を引き継ぐクローンを作成します。 ユースケースを１つご紹介すると、データサイズが大きな環境のテスト・開発用にクローンを作成するときなどが挙げられます。大きなデータをそのままコピーしてしまうとそれだけたくさんのリソースを必要とします。 メタデータのみをコピーし、データはサンプルデータなどに置き換えることでOCPU数やストレージの使用を抑え、コストを削減することができます。 リフレッシュ可能クローン：更新可能なクローンの作成 ソース・データベースの変更を使用して、簡単に更新できるクローンが作成されます。 クローンを作成後にソース・データベースの任意の時間の状態に更新することができるクローンです。 任意の時間の状態に更新するには、バックアップから新しいクローンを作成するという方法もありますが、バックアップからデータをリストアする時間が必要であったり、新しいデータベースをプロビジョニングしなくてはならないなど手間や時間がかかってしまいます。リフレッシュ可能クローンを使用することにより、手軽に任意の時間の状態のクローンを取得することが可能です。 補足 その他、リフレッシュ可能クローンは次のような特長があります： 実⾏中インスタンスの更新を引き継ぐクローンを作成可能 1つのインスタンスに対して複数の更新可能クローンの作成が可能 他の部⾨、コンパートメント跨ぎでの共有が可能であり、コストの分散が可能（クエリ・オフロード） 1週間以内の更新が必要（1週間(168時間)を経過すると更新不可） そのまま読み取り専⽤のDBとして利⽤するか、ソースから切断して通常のR/W可能なインスタンスとしての利⽤が可能 ※詳細については マニュアル を参照ください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb211-clone/",
        "teaser": null
      },{
        "title": "212: Autonomous Data Guardを構成してみよう",
        "excerpt":"はじめに Autonomous Databaseでは、Autonomous Data Guardと呼ばれる機能を使用して、スタンバイ・データベースを有効にする事ができます。これによって、Autonomous Databaseインスタンスにデータ保護およびディザスタ・リカバリを実現可能です。Autonomous Data Guardが有効になっている場合、フェイルオーバーやスイッチオーバーが可能なスタンバイ・データベースを提供します。 目次 Autonomous Data Guardの有効化 Autonomous Data Guardのスイッチオーバー 所要時間: 約30分 Autonomous Data Guardの有効化 Autonomous Databaseの詳細画面のAutonomous Data Guardのステータスが無効になっているのを確認後、有効化をクリックします。 Autonomous Data Guardの有効化をクリックします。 画面左上のATPマークが黄色に変化しました。Autonomous Data Guardにピアの状態が出現し、プロビジョニング中であることが確認できます。完了するまで待ってみましょう。 プロビジョニングが完了しました。ADB詳細画面のADB名の横にプライマリというステータスが確認できます。Autonomous Data Guardのところに記載されているピアの状態が、使用可能になりました。 ここで、ターミナルからADBにSQL Plusでログインしましょう。現在のプライマリDBの情報を下記のSQL文で確認します。 sqlplus admin/&lt;ADMINユーザのパスワード&gt;@&lt;ADBの接続サービス&gt; SELECT DBID, NAME, DB_UNIQUE_NAME FROM V$DATABASE; スイッチオーバーの前後でDBID、NAME、DB_UNIQUE_NAMEが変化することを確認したいと思うので、SQLの出力結果をメモ帳などにメモしておいてください。 Autonomous Data Guardのスイッチオーバー ADB詳細画面に戻り、スイッチオーバーをしていきます。Autonomous Data Guardからスイッチオーバーをクリックして下さい。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb212-audg/",
        "teaser": "/ocitutorials/database/adb212-audg/img1.jpg"
      },{
        "title": "213 : Application Continuityを設定しよう",
        "excerpt":"はじめに Application ContinuityとはOracle Databaseの高可用性機能の一つであり、トランザクション実行中にエラーが発生した際に、そのエラーをアプリケーションに戻すことなく透過的にトランザクションを再実行する仕組みです。 Autonomous Database では接続サービス毎にApplication Continuity(AC)、もしくはTransparent Application Continuity(TAC)を有効化することができます。 クライアント側がAC/TACに対応していれば、障害発生時にクライアントとサーバーが独自にやり取りをしてCommit済みのトランザクションかどうかを判断し、もしCommitが完了していなければ自動的に再実行します。 尚、AC/TACに関する技術詳細は「こちら」をご参照ください。更新処理の途中で異常終了してしまったら何が起こるのか？と言った動作の詳細から対応可能なエラー、または対応するクライアントの種類やアプリケーションの実装方式について詳細に解説しています。 それでは、Autonomous DatabaseにおけるApplication Continuityの設定方法と具体的にエラーを発生させながらその動作について見ていきましょう。 尚、本チュートリアルで利用するSQL*PlusはAC/TACに対応しているクライアントの一つです。 本来であればRAC構成としてインスタンス障害やメンテナンスによる瞬断を想定したいところですが、ADBにおいてはそのような操作・設定はできないため、本チュートリアルでは接続中のセッションに対してAlter system kill session コマンドにて擬似的に障害を発生させ、動作確認を行います。 目次 : 1.事前準備 2.デフォルトの状態での動作確認 3.Application Continuityの有効化 4.有効化した状態での動作確認 5.Application Continuityの無効化 前提条件 : 「101:ADBインスタンスを作成してみよう」 を参考に、ADBインスタンス、およびADBUSERが作成済みであること SQLコマンドを実行するユーザインタフェースは、接続の切り替えが容易なので、SQL*Plusを利用しています。Database Actionsでも実行可能ですが、ユーザでの接続をログインに読み替え、ログインしなおす必要があります。なお、 SQL*Plusの環境は、「204:マーケットプレイスからの仮想マシンのセットアップ方法」で作成できます。 チュートリアルの便宜上、インスタンス名は「atp01」、各ユーザのパスワードはすべて「Welcome12345#」とします。 所要時間 : 約30分 1. 事前準備 動作確認のためTeraterm等の端末を2つ用意してください。それぞれADBUSERおよびADMINで作業します。 まず端末1でADBUSERにログインし、動作確認用の表を一つ作成しておきます。 sqlplus adbuser/Welcome12345##@atp01_tp --テスト表を削除（初回はエラーになります） drop table...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb213-tac/",
        "teaser": "/ocitutorials/database/adb213-tac/tac001.png"
      },{
        "title": "214 : Spatial Studio で地理情報を扱おう",
        "excerpt":"はじめに Oracle Spatial Studio (Spatial Studioとも呼ばれます)は、Oracle Database のSpatial機能によって保存および管理されている地理空間データに対して接続、視覚化、調査および分析を行うためのフリー・ツールです。Spatial Studioは従来、Spatial and Graphとして有償オプションでしたが、現在はOracle Databaseの標準機能として追加費用なくご利用いただけます。 本記事では Spatial機能を用いた地理空間データの活用の方法をご紹介します。 目次 : 1. Oracle Spatial Studioのクラウド上での構築 2. 地理空間データを含むCSV形式ファイルのデータベースへのロード 3. 政府統計データのダウンロードとロード 4. Spatial Studioを用いた分析 おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約80分 1. Oracle Spatial Studioのクラウド上での構築 まず、Spatial Studioのメタデータを格納するリポジトリとなるデータベース・スキーマを作成します。これは、データセット、分析、プロジェクトの定義など、Spatial Studioで行う作業を格納するスキーマです。 1-1. リポジトリ用にスキーマを作成する OCIコンソールからDatabase ActionsでADMINユーザーとしてSpatial Studioリポジトリに使用するADBに接続します。 以下のコマンドでリポジトリ・スキーマを作成します。スキーマには任意の名前を付けることができます。ここではstudio_repoという名前で作成します。後の手順で使用するため、設定したパスワードをメモしておきます。 CREATE...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb214-spatial-studio/",
        "teaser": "/ocitutorials/database/adb214-spatial-studio/tokyo_boundary_image.jpg"
      },{
        "title": "215 : Graph Studioで金融取引の分析を行う",
        "excerpt":"はじめに この記事は“Graph Studio: Finding Circular Payment Chains using Graph Queries Workshop” の記事と補足事項を日本語で解説した内容になります。 Graph Studioとは Autonomous Databaseには、2021年の5月ごろより、プロパティグラフを取り扱うことのできるGraph Studioが標準機能として搭載されました。 Graph Studioでは下記のような機能を利用可能です。 データベースに存在するグラフをメモリに読み込んで分析 リレーショナル表からグラフのモデルを作成するための自動変換 SQLのようにクエリができるPGQLでの分析アルゴリズム グラフの可視化機能 上記のような機能がGraph Studioには搭載されているため、簡単にクラウドのUI上で完結する形でプロパティグラフの作成や分析が可能になっています。 この記事で確認できること CSVファイルのデータをAutonomous Databaseにアップロードする方法(SQL Developer Web (Database Actions SQL)) Graph Studioへの接続方法 PGQLクエリ(グラフクエリ言語)を用いたグラフ作成方法 Graph Studioの分析用ノートブックの作成方法 PGQLクエリを使ってノートブック上でグラフをクエリ&amp;可視化方法 具体的な題材として、今回は金融トランザクションから、循環的な資金の流れを見つける分析を行います。 リレーショナル表からプロパティグラフへのデータの変換では、変換をほぼ自動で行ってくれる Graph Studio の機能を活用します。 目次 : 1.Graph Studio用のユーザーを作成 2.データの準備(取込み) 3.データの準備(整形)...","categories": [],
        "tags": ["graph","PGQL","oraclecloud","autonomous_database"],
        "url": "/ocitutorials/database/adb215-graph/",
        "teaser": null
      },{
        "title": "216 : SQL Performance Analyzer(SPA)によるパッチ適用のテストソリューション",
        "excerpt":"はじめに Autonomous Database(ADB)は、事前定義されたメンテナンス・ウィンドウの中でデータベースに自動的にパッチを適用します。ADBではこのパッチ適用によって性能劣化が生じない仕組みが実装されています。 それでもアプリケーションの性能劣化に不安がある場合に利用できるのが、先行してパッチを適用できるearly patchという機能です。パッチは毎週もしくは隔週で一斉に当てられますが、このearly patchでは通常より1週早く同じパッチが当てられます。テスト環境用ADBをearly patchで作成しておくことで、本番環境適用前にパッチ適用の影響テストを行うことができます。 ※early patchは、Ashburn・Phoenix・London・Frankfurtリージョンでのみ利用可能な機能です。(2022/1時点) 東京や大阪リージョンで利用したい場合は、担当営業までご相談ください。 また、ADBでは、Oracle Databaseオプション「Real Application Testing(RAT)」に含まれる機能の1つであるSQL Performance Analyzer(SPA)を使用することができます。 SPAを利用すると、システム変更前後のSQLワークロードの実行統計を比較して変更の影響を測定することができます。詳細はこちらをご覧ください。 Real Application Testing 参考資料 マニュアル：SQL Performance Analyzer 本記事では、early patchとSPAを併用することで、本番環境へのパッチ適用の影響をテスト環境で事前に確認する手順をご紹介します。 目次 : 1.環境の準備 2.SQLチューニングセット(STS)の作成 3.テスト環境用ADBのクローニング 4.STSの分析、レポートの作成 5.パッチ適用の事前通知（参考） 6.クリーンアップ（参考） 7.おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約60分 1. 環境の準備 1-1. 本番環境用ADBの作成 まずは本番環境用ADBであるATPprodを作成します。ADBの構成は以下になります。なお、本記事ではADBをはじめとする各リソースは全てAshburnリージョンで作成します。 ワークロード・タイプ：トランザクション処理 デプロイメント・タイプ：共有インフラストラクチャ...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb216-patch-spa/",
        "teaser": "/ocitutorials/database/adb216-patch-spa/teaser.png"
      },{
        "title": "217: Database Actions を使ってみよう",
        "excerpt":"はじめに この章はまずAutonomous Database(ADB) のツールである Database Actions の機能の中から、データ分析、データ・インサイト、カタログの機能を確認します。 Database Actions を使う前に、セキュリティを高めるため、実務と同じように、データベース管理者とは別の新しいユーザー（スキーマ）を作り、そのユーザーから Database Actions を使います。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 以下にリンクされている売上実績サンプルデータのファイルをダウンロードしていること Days_Months.xlsx + Devices.xlsx + Countries.csv Movie_Sales_2020.csv 目次 1. 分析用のデータベース・ユーザーを作成しよう 2. ワークショップで使うデータを準備しよう 3. Database Actionsで操作してみよう 3-1. データ分析してみよう 3-2. データインサイトを生成しよう 3-3. カタログを使ってみよう 所要時間 : 約50分 1. 分析用のデータベース・ユーザーを作成しよう(Database Actions) ADBインスタンスを作成すると、デフォルトでADMINユーザが作成されていますが、Database Actions を操作するデータベース・ユーザーを作成します。 ここではADBにおけるデータベース・ユーザーの作成してみます。 Database Actionsの起動パッドで...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb217-use-database-actions/",
        "teaser": "/ocitutorials/database/adb217-use-database-actions/img0_0.png"
      },{
        "title": "218 : リフレッシュ可能クローンを活用しよう",
        "excerpt":"Autonomous Databaseのリフレッシュ可能クローンを利用すると、本番環境のデータを用いてリフレッシュすることができる、更新可能なテスト/検証/分析用途の環境を簡単に作成することができます。 本章では、リフレッシュ可能クローンの作成方法と動作について確認します。 所要時間 : 約30分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本チュートリアルの 101:ADBインスタンスを作成してみよう を参照ください。 構成済みのADBインスタンスへの接続が可能であること 目次： 1. ADBにおけるリフレッシュ可能クローンの概要 2. 事前準備 3. リフレッシュ可能クローンを作成してみよう 4. 作成したリフレッシュ可能クローンを確認してみよう 5. リフレッシュ可能クローンのリフレッシュ動作を確認してみよう 6. リフレッシュ可能クローンをソース・データベースから切断してみよう 7. リフレッシュ可能クローンをソース・データベースに再接続してみよう 1. ADBにおけるリフレッシュ可能クローンの概要 ADBのリフレッシュ可能クローンは、コンソールまたはAPIを使用して作成することができます。 リフレッシュ可能クローンを使用することで、リフレッシュ操作によってソース・データベースの変更内容を反映することが可能なADBのクローンを作成できます。 ADBのリフレッシュ可能クローンは以下のような特徴があります。 実行中のAutonomous Databaseから作成可能（バックアップからの作成は不可） ソースとなるAutonomous Databaseと異なるコンパートメントに作成可能 ソースとなるAutonomous Databaseに接続している間は読み取り専用データベースとして利用可能 コンソールまたはAPIを使用したリフレッシュ操作により、ソース・データベースの変更内容を反映可能 リフレッシュ中は利用不可（ソース・データベースはリフレッシュ中も利用可能） リフレッシュ可能期間は、クローン作成後または前回のリフレッシュから1週間以内 1週間以上リフレッシュしなかった場合はリフレッシュできなくなる リフレッシュ可能期間を超えた場合は、そのまま読み取り専用DBとして利用するかソース・データベースから切断して通常の読み取り/書き込み可能なDBとして利用する ソースとなるAutonomous Databaseから一時的に切断し、再接続することが可能 切断後は読み取り/書き込み可能 再接続操作は切断後24時間以内のみ可能 再接続すると切断中のクローンに対する更新内容は破棄される 再接続後は切断前と同様に、リフレッシュ操作によりソース・データベースの変更内容を反映可能...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb218-refreshable-clone/",
        "teaser": "/ocitutorials/database/adb218-refreshable-clone/teaser.png"
      },{
        "title": "219: Automatic Indexingを体験してみよう ",
        "excerpt":"はじめに 索引を手動で作成するには、データモデル、アプリケーションの動作、データベース内のデータの特性などに関する専門的な知識が必要です。 以前は、DBAがどの索引を作成するかの選択を担当しており、修正や保守を行っていました。しかし、データベースが変更されても保守しきれないこともあり、不要な索引を使用することが性能上の障害となる可能性がありました。 Autonomous Databaseではワークロードを監視して、自動的に索引の作成や削除などの管理を行う機能であるAutomatic Indexingが利用できます。 本記事では、ATPを作成したのちAutomatic Indexingを利用してみます。 前提条件： ATPインスタンスが構成済みであること ※ATPンタンスの作成方法については、ADBインスタンスを作成してみよう を参照してください。 ワークロード・タイプ： トランザクション処理 OCPU数： 1 ストレージ(TB)： 1 CPU Auto Scaling： 無効 それ以外の項目については、ご自身の環境や目的に合わせて選択してください。 目次： 1. スキーマ作成とAutomatic Indexingの有効化 2. ワークロードの実行 3. 自動索引のレポートを確認する 4. 自動索引の削除とAutomatic Indexingの無効化 おわりに 所要時間 : 約1時間 1. スキーマ作成とAutomatic Indexingの有効化 ここではテストスキーマを作成し、自動索引を有効化します。 1-1. SQL*PlusでADBに接続する SQL＊Plusを使った接続を参考に、TeraTerm上でSQL＊Plusを用いて、ATPインスタンスに接続してください。 接続する際のスキーマ名はADMINとしてください。 ここで、以前本チュートリアルを実施したことがある場合は、本章の4-1の手順2自動索引の削除を行ってください。初めて行う場合は、次のステップに進んでください。 1-2. 索引作成の対象になる表の作成と登録 （本チュートリアルを初めて実施する場合は、次のステップに進んでください。)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb219-autoindexing/",
        "teaser": "/ocitutorials/database/adb219-autoindexing/adb219_3.png"
      },{
        "title": "301 : 移行元となるデータベースを作成しよう",
        "excerpt":"はじめに 既存Oracle DatabaseをAutonomous Databaseに移行するにはどうすれば良いでしょうか？ 従来からよく利用されるData Pumpを始め、Autonomous Databaseではいくつかの移行方法が用意されており、このチュートリアルでは移行編としてそれらの方法をご紹介しています。 Autonomous Database を使ってみよう（移行編） 301: 移行元となるデータベースを作成しよう（本章） 302: スキーマ・アドバイザを活用しよう 303: Data Pumpを利用してデータを移行しよう [304: ZDM/DMSを利用し、ダウンタイムを最小限に移行しよう（準備中）] 本章（301）では後続の章の準備作業として、移行元となる既存オンプレミスのOracle Databaseを想定しBaseDBインスタンスを作成します。 目次 : 1.移行元となるBaseDBインスタンスの作成 2.移行対象となるサンプルスキーマ(HR)をインストール 3.サンプルスキーマ(HR)への接続、スキーマの確認 所要時間 : 約150分 (BaseDBインスタンスの作成時間を含む) 1. 移行元となるBaseDBインスタンスの作成 まず、「Oracle Cloud で Oracle Database を使おう(BaseDB)」 を参考に、BaseDBインスタンスを作成してください。 TeraTermを起動しBaseDBインスタンスにSSHでアクセスするところから、PDB上のスキーマにアクセスするところまで一通り実施いただくとスムーズです。 以降では、BaseDBインスタンスが以下の値で作成されていることを前提として記載しています。（その他、DBシステム名やシェイプ等は基本的に任意です） ホスト名接頭辞 : dbcs01 データベースのバージョン：12.2 パスワード：WelCome123#123# PDBの名前：pdb1 2. 移行対象となるHRスキーマをインストール 次に作成したBaseDBインスタンス内に、移行対象となるHRスキーマを作成します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb301-create-source-db/",
        "teaser": "/ocitutorials/database/adb301-tac/sa00x.png"
      },{
        "title": "302 : Cloud Premigration Advisor Tool(CPAT)を活用しよう",
        "excerpt":"はじめに Autonomous Databaseでは性能・可用性・セキュリティの観点から特定のデータベースオブジェクトの作成が制限されています。 具体的な制限事項はマニュアルに記載がございますが、これら制限対象のオブジェクトを利用しているかなどを確認するために、オラクルはCloud Premigration Advisor Tool(CPAT)というツールを提供しています。 この章では先の301: 移行元となるデータベースを作成しようにて事前に作成しておいたDBCSインスタンスを利用して、CPATの使い方を紹介します。 目次 : 1.Cloud Premigration Advisor Tool(CPAT)とは？ 2.事前準備 2-1.CPATを実行するホストの準備 2-2.ツールのダウンロード 2-3.環境変数の設定 3.実行と結果確認 前提条件 : My Oracle Supportへのログイン・アカウントを保有していること 301: 移行元となるデータベースを作成しようを完了していること 所要時間 : 約30分 1. Cloud Premigraiton Advisor Tool (CPAT) とは？ Oracle DatabaseインスタンスをOracleクラウドに移行する際に、問題になる可能性があるコンテンツや移行を妨げる可能性があるその他の要因をチェックするJavaベースのツールです。移行チェックのツールとして以前提供されていたスキーマ・アドバイザの後継となります。 スキーマ・アドバイザはデータベースにPL/SQLパッケージのインストールが必要でしたが、CPATは読み取り専用でデータベースに対して変更を与えることはありません。 サポート対象となるOracle Databaseのバージョンは11.2.0.4以降です（2022/3時点）。 また、現時点では物理移行のチェックはサポートされておらず、デフォルトでDataPumpによる移行が想定されています。 2. 事前準備 2-1. CPATを実行するホストの準備 ソース、ターゲットにネットワーク接続できるホストを準備します。CPATはWindowsプラットフォーム、Unixプラットフォームのどちらでも実行することができますが、Javaベースのツールとなるため、Java実行環境(JRE)が必要となります。最小バージョンはJava7です。 このチュートリアルでは作成済みのDBCSインスタンスをホストとして利用します。 2-2....","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb302-cpat/",
        "teaser": "/ocitutorials/database/adb302-xxx/sa00x.png"
      },{
        "title": "303 : Data Pumpを利用してデータを移行しよう",
        "excerpt":"はじめに Oracle Databaseのデータ移行として、ここでは従来からよく利用されるData Pumpを利用してAutonomous Databaseに移行する手順をご紹介します。 先の「301 : 移行元となるデータベースを作成しよう」にて事前に作成しておいたBaseDBインスタンス上のHRスキーマを、以下の流れに沿ってAutonomous Databaseに移行してみたいと思います。 目次 : 1.移行対象のスキーマをエクスポート 2.オブジェクトストレージへのアクセストークンを取得 3.ダンプファイルをオブジェクトストレージにアップロード 4.Autonomous Databaseへのインポート 補足 チュートリアルを実施する上で、BaseDBインスタンスを用意できない場合や、どうしてもエクスポートが成功しないと言った場合は、以下よりエクスポート済みのダンプファイルを配置しておりますので、適宜ダウンロードください。 上記ステップ2から実施いただくことが可能です。 ダンプファイル(export_hr_01.dmp)のダウンロード ダンプファイル(export_hr_02.dmp)のダウンロード ダンプファイル(export_hr_03.dmp)のダウンロード ダンプファイル(export_hr_04.dmp)のダウンロード 前提条件 : 「204: マーケットプレイスからの仮想マシンのセットアップ方法」を完了していること 「301 : 移行元となるデータベースを作成しよう」を完了していること 所要時間 : 約30分 1. 移行対象のスキーマをエクスポート HRスキーマをData Pumpを利用してBaseDBインスタンスのOS上のファイルシステムにエクスポートします。 （補足） 本チュートリアルではOCI BaseDBにプリインストールされているData Pumpを利用しますが、12.2.0.1以前のOracle Clientを利用する場合や、その他詳細情報についてはマニュアル（ADW / ATP）を参照ください。 パラレルオプションを利用する場合、ソースDBがEnterprise Editionである必要があります。 圧縮オプションを利用する場合、ソースDBが11g以上でありAdvanced Compression Optionが必要になります。 1-1....","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb303-datapump/",
        "teaser": "/ocitutorials/database/adb303-xxx/img00x.png"
      },{
        "title": "304 : OCI Database Migration Serviceを使用したデータベース移行の前準備",
        "excerpt":"はじめに Oracle Cloud Infrastructure Database Migration Service (DMS) は、オンプレミスまたはOCI上のOracle DatabaseからAutonomous Databaseに移行する際に利用できるマネージド・サービスです。エンタープライズ向けの強力なオラクル・ツール(Zero Downtime Migration、GoldenGate、Data Pump)をベースとしています。 DMSでは下記の2つの論理的移行が可能です。 オフライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されます。移行中のソース・データベースへの変更はコピーされないため、移行中はアプリケーションをオフラインのままにする必要があります。 オンライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されるのに加え、内部的にOracle GoldenGateによるレプリケーションを利用しているため、移行中のソース・データベースへの変更も全てコピーされます。そのため、アプリケーションをオンラインのまま移行を行うことが可能で、移行に伴うアプリケーションのダウンタイムを極小化することができます。 DMSに関するチュートリアルは304 : OCI Database Migration Serviceを使用したデータベース移行の前準備、305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行、306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行の計3章を含めた3部構成となっています。 DMSを使用してBaseDBで作成したソース・データベースからADBのターゲット・データベースにデータ移行を行います。 305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行または306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行を実施する前に必ず304...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb304-database-migration-prep/",
        "teaser": "/ocitutorials/database/adb304-database-migration-prep/teaser.png"
      },{
        "title": "305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行",
        "excerpt":"はじめに Oracle Cloud Infrastructure Database Migration Service (DMS) は、オンプレミスまたはOCI上のOracle DatabaseからAutonomous Databaseに移行する際に利用できるマネージド・サービスです。エンタープライズ向けの強力なオラクル・ツール(Zero Downtime Migration、GoldenGate、Data Pump)をベースとしています。 DMSでは下記の2つの論理的移行が可能です。 オフライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されます。移行中のソース・データベースへの変更はコピーされないため、移行中はアプリケーションをオフラインのままにする必要があります。 オンライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されるのに加え、内部的にOracle GoldenGateによるレプリケーションを利用しているため、移行中のソース・データベースへの変更も全てコピーされます。そのため、アプリケーションをオンラインのまま移行を行うことが可能で、移行に伴うアプリケーションのダウンタイムを極小化することができます。 DMSに関するチュートリアルは304 : OCI Database Migration Serviceを使用したデータベース移行の前準備、305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行、306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行の計3章を含めた3部構成となっています。 DMSを使用してBaseDBで作成したソース・データベースからADBのターゲット・データベースにデータ移行を行います。 305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行または306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行を実施する前に必ず304...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb305-database-migration-offline/",
        "teaser": "/ocitutorials/database/adb305-database-migration-prep/teaser.png"
      },{
        "title": "306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行",
        "excerpt":"はじめに Oracle Cloud Infrastructure Database Migration Service (DMS) は、オンプレミスまたはOCI上のOracle DatabaseからAutonomous Databaseに移行する際に利用できるマネージド・サービスです。エンタープライズ向けの強力なオラクル・ツール(Zero Downtime Migration、GoldenGate、Data Pump)をベースとしています。 DMSでは下記の2つの論理的移行が可能です。 オフライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されます。移行中のソース・データベースへの変更はコピーされないため、移行中はアプリケーションをオフラインのままにする必要があります。 オンライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されるのに加え、内部的にOracle GoldenGateによるレプリケーションを利用しているため、移行中のソース・データベースへの変更も全てコピーされます。そのため、アプリケーションをオンラインのまま移行を行うことが可能で、移行に伴うアプリケーションのダウンタイムを極小化することができます。 DMSに関するチュートリアルは304 : OCI Database Migration Serviceを使用したデータベース移行の前準備、305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行、306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行の計3章を含めた3部構成となっています。 DMSを使用してBaseDBで作成したソース・データベースからADBのターゲット・データベースにデータ移行を行います。 305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行または306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行を実施する前に必ず304...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb306-database-migration-online/",
        "teaser": "/ocitutorials/database/adb306-database-migration-prep/teaser.png"
      },{
        "title": "401 : OCI GoldenGateによるBaseDBからADBへのデータ連携",
        "excerpt":"はじめに Oracle Cloud Infrastructure (OCI) GoldenGateはフルマネージド型のリアルタイムデータ連携サービスとなっています。 OCI GoldenGateサービスは、構成、ワークロード・スケーリング、パッチ適用などの多くの機能を自動化しており、従量課金制で利用することが可能です。そのため時間や場所を選ばずに、低コストでデータの連携、分析ができるようになります。 この章では、OCI GoldenGateの作成とBaseDBからADBへのデータ連携の設定について紹介します。 目次 : 1.ソース・データベースの設定 2.ターゲット・データベースの設定 3.OCI GGデプロイメントの作成 4.データベースの登録 5.Extractの作成 6.チェックポイント表の作成 7.Replicatの作成 8.データ連携の確認 前提条件 : 本チュートリアルではBaseDB、ADBともにデータベースの作成が完了しており、初期データとしてHRスキーマがそれぞれのデータベースにロードされていることを前提にしています。 各データベースの作成方法やデータロードの方法は下記手順をご確認ください。 BaseDBの作成については、「101: Oracle Cloud で Oracle Database を使おう(BaseDB)」 をご参照ください。 データ連携用のサンプルデータはHRスキーマを使用しています。BaseDBでのHRスキーマ作成方法は、「301: 移行元となるデータベースを作成しよう」 をご参照ください。 ADBの作成については、「101:ADBインスタンスを作成してみよう」 をご参照ください。 ADBの初期データロードについては、「303 : Data Pumpを利用してデータを移行しよう」 をご参照ください。 チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、BaseDBを含めて各ユーザのパスワードはすべて「Welcome#1Welcome#1」とします。 所要時間 : 約60分 1. ソース・データベースの設定...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb401-oci-goldengate/",
        "teaser": "/ocitutorials/database/adb401-oci-goldengate/instancetop.png"
      },{
        "title": "402 : Database Linkによるデータ連携",
        "excerpt":"はじめに 従来からOracle Databaseをご利用の方にはお馴染みのDatabase Linkですが、Autonomous Database でもこのDatabase Linkをお使いいただくことが可能です。 Database Linkは、他のOracle Database インスタンスからデータを移行・連携・収集するための便利な機能です。 Autonomous Databaseでは以下の3つのパターンでDatabase Linkを作成いただくことができます。 本文書では2のパターンであるAutonomous Database（リンク元）にDatabase Linkを作成し、 他のOracle Database（リンク先）にアクセスする手順を記載します。 その後、補足と言う形でパターン1, 3についても記載します。 なお、本文書ではパブリックIPアドレスを持つBaseDBを前提としています。プライベートIPアドレスへのDatabase Link作成については、こちらの記事 で紹介しています。 ご不明な点がございましたら、担当営業までお問い合わせください。 目次 : 1.BaseDBインスタンスの作成およびスキーマのインポート 2.BaseDBにてTCPS認証（SSL認証）を有効化 3.BaseDBのウォレットファイルをADBに渡す 4.VCNのイングレス・ルールを更新 5.ADBにてDatabase Linkを作成 6.エラーへの対応例 7.その他のパターン 8.おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約100分（BaseDBのインスタンスの作成時間を含む） 1. BaseDBインスタンスの作成およびスキーマのインポート まず、サンプル・データベースとして、Database Linkのリンク先となるBaseDBインスタンスを作成します。 301 :...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb402-database-link/",
        "teaser": "/ocitutorials/database/adb402-database-link/DatabaseLink_teaser.jpg"
      },{
        "title": "403 : Data Transformsを使ってみよう",
        "excerpt":"はじめに Data Transformsは、Autonomous Databaseに組み込まれているデータ統合ツールです。Database Actionsからアクセス可能で、異種のソースからAutonomous Databaseにデータをロードして変換するためのツールです。ドラッグアンドドロップ、ノーコードで簡単に操作できます。データウェアハウスの構築や分析アプリケーションへのデータ供給など、あらゆるデータ統合のニーズに対応できます。 Data TransformsはOracle Data Integratorをベースにしています。オンプレミスおよびOCIの両方で、多くのお客様において高性能なデータ統合アーキテクチャとして証明されている、ELT(Extract/Load/Transform)手法を使用しています。 本章ではAutonomous Databaseの付属ツールであるData Transformsを用いて、少ない労力でデータを変換する方法を紹介します。 所要時間 : 約60分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本チュートリアルの 101:ADBインスタンスを作成してみよう を参照ください。 構成済みのADBインスタンスへの接続が可能であること 下記リンクからダウンロードできるMovie Sales 2020.csv(売上実績のサンプルデータ)がローカルPC上にあること 217: クレデンシャル・ウォレットを利用して接続してみよう 目次： 1. 事前準備 2. Dara Transformsの起動 3. Data Transformsを使ってみる 4. おわりに 1. 事前準備 実際にData Transformsを使用する前に、起動したADBインスタンスから新しいユーザー(QTEAM)を作成し、本チュートリアルで使用するサンプルデータ(Movie Sales 2020.csv)をロードします。 次の手順に従って、QTEAMユーザーを作成します。すでに作っている場合は、ステップ2に進んでください。 下記のリンクを参考に、QTEAMユーザーを作成します。 分析用のデータベース・ユーザーを作成しよう(Database Actions) *ユーザーを作成の際に、付与されたロールから以下の2つのユーザーロールを、以下の画像のように有効にします。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb403-data-transforms/",
        "teaser": "/ocitutorials/database/adb403-data-transforms/adb403_2_4.png"
      },{
        "title": "501: OCICLIを利用したインスタンス操作",
        "excerpt":"ここまでの章で、ADBインスタンスの作成やOCPU数の変更等、様々な操作を実施いただきましたが、これら一連の操作を自動化するにはどうしたら良いでしょうか？ ADBはOracle Cloud Infrastructure(OCI)の他のサービスと同様、REST APIを介した各種操作が可能であり、それらを呼び出すコマンド・ライン・インタフェース（OCI CLI）を利用した操作も可能です。 この章ではOCI CLIを利用してADBインスタンスの作成や起動・停止、およびスケールアップ、ダウンといった構成変更の方法について確認します。 これらコマンドを利用しスクリプトを組めば、例えば夜間はあまり使わないからOCPUをスケールダウンさせておき、朝になったらスケールアップしよう。といった自動化が可能となります。 尚、本ガイドではOCI CLIがインストールされたOCI Developer Image を利用することを前提に記載しています。 OCI CLIのインストール方法を含め、OCI CLIの詳細についてはを参照ください。 所要時間 : 約30分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 ADBインスタンスに接続可能な仮想マシンを構成済みであること ※仮想マシンの作成方法については、本ハンズオンガイドの 204:マーケットプレイスからの仮想マシンのセットアップ方法 を参照ください。 目次： 1. OCI CLIをセットアップしよう 2. OCI CLIを使ってみよう 3. OCI CLIでインスタンスを操作しよう 1. OCI CLIをセットアップしよう まずはOCI CLIにクラウド環境の情報を登録します。 Tera Termを起動し、仮想マシンにログインします。 oracleユーザに切り替えます。 sudo su...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb501-ocicli/",
        "teaser": null
      },{
        "title": "502: 各種設定の確認、レポートの取得",
        "excerpt":"Autonomous Databaseは初期化パラメータを初め、多くの設定は変更することはできません。 （そもそも自律型DBとして、それらを気にする必要はない、というコンセプト） しかしながら、Oracle Databaseに詳しい方にとっては、これまでのOracle Databaseと何が違うのか？など、より詳細を知りたいと思われるかと思います。 この章ではそういった方々のために、初期化パラメータの確認やAWRレポート等の取得方法をご確認いただき、普段お使いのOracleデータベースと同様に扱えることを見ていただきます。 尚、Autonomous Databaseにおける制限事項については、次のマニュアルを参照ください。 経験豊富なOracle Databaseユーザー用のAutonomous Database (英語版) 経験豊富なOracle Databaseユーザー用のAutonomous Database (日本語版) ※最新の情報については英語版をご確認ください。 本章ではアラートログやトレースログの取得方法も扱いますが、ADBを利用するに際して何か問題が生じた場合は、弊社サポートサービスに対してサービスリクエスト（SR）の発行を優先ください。 SRの発行方法については、本チュートリアルガイドの 506: サポートサービスへの問い合わせ を参照ください。 所要時間 : 約30分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 ADBインスタンスに接続可能な仮想マシンを構成済みであること ※仮想マシンの作成方法については、本ハンズオンガイドの 204:マーケットプレイスからの仮想マシンのセットアップ方法 を参照ください。 初期化パラメータ・各種レポート・ログの取得方法は、次の目次に示す３つの方法があります： 目次： 1. コマンドライン(SQL*Plus)で確認しよう 1-1. 初期化パラメータの確認 1-2. AWRレポートの確認 1-3. アラート・ログの確認 1-4. トレース・ログの確認 2. SQL...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb502-report/",
        "teaser": null
      },{
        "title": "503 : ADBインスタンスの監視設定をしてみよう",
        "excerpt":"はじめに Autonomous Databaseはデータベースの様々な管理タスクをADB自身、もしくはOracleが行う自律型データベースですが、ユーザーが実行したり、ユーザーがOracleに実行の方法やタイミングの指示を出すタスクもあります。それがデータベースのパフォーマンス監視/アラート監視です。本記事ではADBインスタンスに対する監視設定をいくつかご紹介します。 目次 : 1.技術概要 2.単体インスタンスの監視 3.複数のインスタンスをまとめて監視 おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 なお本記事では、後続の章でCPU使用率が閾値を超えた際の挙動を確認するため、OCPU数は1、auto scalingは無効 で作成しています。 所要時間 : 約40分 1. 技術概要 Autonomous Databaseに対する監視・通知を行うツールはいくつか存在します。環境やユーザーによって、適切なツールを選択します。以下はそれらの監視ツールの比較表です。 本記事ではこの中から、OCIモニタリング、サービス・コンソール、Oracle Enterprise Manager(EM)、Oracle Management Cloud(OMC)による監視設定をご紹介します。 2. 単体インスタンスの監視 単体のADBインスタンスに対しては、OCIモニタリングとサービス・コンソールを使ってメトリック監視/イベント監視をすることができます。 2-1. アラームの通知先の作成 監視設定の前に通知先を作成しておく必要があります。こちら を参考に、トピックの作成・サブスクリプションの作成を行います。 2-2. OCIモニタリングによるメトリック監視 OCIモニタリングでは、OCI上の各種リソースの性能や状態の監視、カスタムのメトリック監視を行うことが可能です。また、アラームで事前定義した条件に合致した際には、管理者に通知を行うことで管理者はタイムリーに適切な対処を行うことができます。 今回は、ADBのCPUの閾値を超えた際に通知が来るよう設定し、その挙動を確認します。 まずはこちらの記事 を参考に、アラームの通知先の作成をします。 次にアラームの定義の作成をします。ハンバーガーメニューのObservability &amp; Management の [アラーム定義] をクリックします。 [アラームの作成] をクリックします。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb503-monitoring/",
        "teaser": "/ocitutorials/database/adb503-monitoring/monitoring_teaser.png"
      },{
        "title": "504 : 監査をしてみよう",
        "excerpt":"はじめに Oracle Databaseではデータベースに対する操作を記録する監査機能が提供されています。12cからは従来の監査機能（DBA監査、標準監査、ファイングレイン監査）を統合した統合監査が利用できるようになりました。 データベース監査機能についての詳細はこちらのドキュメントをご覧ください。 Autonomous Databaseは、統合監査を利用した、いくつかの監査設定があらかじめ行われています。また必要に応じて任意の監査設定を追加できます。 この章では、Autonomous Databaseの監査設定と監査レコードの管理について紹介します。 目次 : 1.デフォルトの監査設定の確認 2.任意の監査設定の追加 3.監査対象の操作を実行（監査レコードの生成） 4.監査レコードの確認 5.任意の監査設定の無効化 6.監査レコードの削除 前提条件 : 監査対象の表は任意のスキーマの表でも構いませんが、ここでは、「102:ADBにデータをロードしよう(Database Actions)」 で作成したADBUSERスキーマのSALES_CHANNELS表を利用しています。 SQLコマンドを実行するユーザー・インタフェースは、接続の切り替えが容易なので、SQL*Plusを利用していますが、Database Actionsでも実行可能です。ユーザーでの接続をログインに読み替え、必要なユーザーでログインしなおしてください。なお、 SQL*Plusの環境は、「204:マーケットプレイスからの仮想マシンのセットアップ方法」で作成できます。 チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、各ユーザのパスワードはすべて「Welcome12345#」とします。 使用パッケージの引数の説明は記載していません。詳細はドキュメント『PL/SQLパッケージ及びタイプ・リファレンス』（リンクは19c版です）をご参照ください。 所要時間 : 約20分 1. デフォルトの監査設定の確認 統合監査では、監査対象を監査ポリシーで定義し、定義された監査ポリシーを有効化することで監査レコードが生成されます。 Autonomous Databaseにはよく利用される監査対象用に事前定義済みの監査ポリシーがあり、そのうち4つがデフォルトで有効化されています。 作成済みの監査ポリシーはUNIFIED_AUDIT_POLICIESビュー、有効化された監査ポリシーはAUDIT_UNIFIED_ENABLED_POLICIESビューで確認することができます。 SQL*Plusを起動して以下を実行してください。 -- ADMINで接続する CONNECT admin/Welcome12345##@atp01_low -- SQL*Plusのフォーマット用コマンド set pages 100 set lines 200 col...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb504-audit/",
        "teaser": "/ocitutorials/database/adb504-audit/unifiedaudit.png"
      },{
        "title": "505 : Autonomous Databaseのバックアップとリストアを体感しよう",
        "excerpt":"はじめに Autonomous Databaseでは自動的バックアップがオンラインで取得され、60日間保持されます。自動バックアップは、60日ごとに完全バックアップ、週次累積バックアップ、日次増分バックアップです。インスタンス構成時にデフォルトで有効化されており、無効化することはできません。また、Autonomous Databaseの自動バックアップはオブジェクトストアに出力されますが、それに対する課金はございません。 ユーザ自身がGUIやAPIを介して特定時点にリストアすることが可能です。本チュートリアルにおいても、Point-in-timeリカバリを実施いたします。 （補足） バックアップ操作中は、データベースは使用可能なままです。ただし、データベースの停止、スケーリング、終了などのライフサイクル管理操作は無効化されます。 目次 : 自動バックアップの確認 データベースに表を新規作成 タイムスタンプをUTCで確認 Point-in-timeリカバリ おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約30分 自動バックアップの確認 Autonomousa Databaseの詳細画面 下にスクロールして、画面左側のタブのバックアップをクリックし、これまでバックアップ履歴を確認します。 自動バックアップが日時で取られているのが確認できます。 特に設定を行わずとも、自動バックアップが構成されています。 全て増分バックアップになっており、60日ごと取得されているフルバックアップが無いのでは？と思われたかもしれませんが、こちらは誤りではなく、フルバックアップはRMANでは増分バックアップのLevel0となるので、この一覧では全て増分バックアップとして表示されております。 なお、Autonomous Databaseでは、1分ごとにアーカイブログがバックアップされています。(ADB-Dでは15分ごと) 60日前までの任意のタイミングにタイミングにリストア・リカバリが可能になっています。 RMANを利用しており、ブロック破損のチェックも同時に行われているため信頼できるバックアップになっています。 また、Autonomous Databaseでは、これらのバックアップを格納しておくストレージストレージの追加コストは不要です。 データベースに表を新規作成 では、この段階で新規でEmployee表を作成し、１行をインサートしてみます。 データベースの詳細画面のデータベース・アクションをクリックします。 開発のSQLをクリックします。 SQLワークシートにて、下記のSQLを実行し、Employees表を新規作成します。 CREATE TABLE EMPLOYEES ( FIRST_NAME VARCHAR(100), LAST_NAME VARCHAR(100) ); SQLワークシートにて、下記のSQLを実行し、Employees表に新規で行インサートします。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb505-backup/",
        "teaser": "/ocitutorials/database/adb505-backup/img2.png"
      },{
        "title": "506: サポートサービスへの問い合わせ(Service Requestの起票)",
        "excerpt":"はじめに Oracle Cloud 製品をご利用のお客様は、ポータルサイト「My Oracle Support (Cloud Support)」 を介して、Oracle製品に関するナレッジの検索や、製品仕様の確認、不具合に関するお問い合わせを行っていただけます。 本ページでは、Autonomous Databaseを例に、そういった各種お問い合わせのためのサービス・リクエスト（Service Request ：SR）の作成フローをご紹介します。 尚、実際の利用に際しては本ページ後半の参考資料に記載しております、弊社サポート部門からのガイドをご確認いただくようお願いいたします。 Oracle Cloudでは通常契約の他に無償でお試しいただけるFree Tierを用意しています。Free Tierには期間/利用クレジットが限定される「30日間無償トライアル」とAlways Freeリソースを対象とした「常時無償サービス」が含まれますが、「常時無償サービス」のみご利用の場合はOracle Supportの対象にならず、問い合わせを上げることはできません。詳細はOracle Cloud Free Tierに関するFAQにて “ Oracle Cloud Free Tierにはサービス・レベル契約（SLA）とテクニカル・サポートが含まれていますか? “ をご覧ください。 2021年初頭のサービス・アップデートにより、OCIコンソール画面からもSRを作成、閲覧、更新ができるようになりました。OCIコンソール画面からのSR起票については別の文書でご案内する予定です。本ページでは「My Oracle Support (Cloud Support)」を利用したSR起票について説明します。 目次 1.Cloud Supportのアカウントを用意する 2.問い合わせ対象のAutonomous Databaseの情報を確認する Domain name/Cloud Account nameの確認 Data Center Location、Database Name、Database OCID、Tenancy OCIDの確認...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb506-sr/",
        "teaser": "/ocitutorials/database/adb506-sr/img1.jpg"
      },{
        "title": "601: ADWでMovieStreamデータのロード・更新をしよう",
        "excerpt":"はじめに データのロード、変換、管理、そして分析まで、全てを1つのデータベースで行うことができるのが、Autonomous Data Warehouseです。このチュートリアルを参考に、ぜひ一度”完全自律型データベース“を体験してみてください。 本記事では、MovieStreamデータを使い、データのロード・処理方法を実際のビジネスシナリオに近い形でご紹介します。 想定シナリオ： Oracle MovieStreamは、架空の映画ストリーミングサービスです。 MovieStreamはビジネスを成長させるため、顧客の視聴傾向や適切な提供価格などのデータ分析を行いたいと考えています。 前提条件： ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次： 1. ADWへのMovie Salesデータのロード 2. Movie Salesデータの更新 おわりに 所要時間 : 約1時間 1. ADWへのMovie Salesデータのロード 1-1. ADWインスタンスの作成 まずはADWインスタンスを作成します。101:ADBインスタンスを作成してみよう を参考にしながら、以下の条件で作成します。 ワークロード・タイプ： データ・ウェアハウス OCPU数： 8 ストレージ(TB)： 1 CPU Auto Scaling： 許可 それ以外の項目については、ご自身の環境や目的に合わせて選択してください。 1-2. Movie Salesデータのロード ADWでは、ニーズに応じて様々な方法でデータをロードすることができます。本記事では、簡単なスクリプトを使用してオブジェクトストレージからデータをロードします。 ADWに接続サービスHIGHで接続し、以下のスクリプトを実行します。実行すると、MOVIE_SALES_FACT表が作成されます。 CREATE TABLE MOVIE_SALES_FACT...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb601-moviestream-load/",
        "teaser": "/ocitutorials/database/adb601-moviestream-load/teaser.png"
      },{
        "title": "602: ADWでMovieStreamデータの分析をしよう",
        "excerpt":"はじめに データのロード、変換、管理、そして分析まで、全てを1つのデータベースで行うことができるのが、Autonomous Data Warehouseです。このチュートリアルを参考に、ぜひ一度”完全自律型データベース“を体験してみてください。 本記事では、MovieStreamデータを使い、データの分析方法を実際のビジネスシナリオに近い形でご紹介します。 想定シナリオ： Oracle MovieStreamは、架空の映画ストリーミングサービスです。 MovieStreamはビジネスを成長させるため、顧客の視聴傾向や適切な提供価格などのデータ分析を行いたいと考えています。 前提条件： ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 601: ADWでMovieStreamデータのロード・更新をしようのチュートリアルを完了していること 目次： 1. Movie Salesデータの分析 2. 半構造化データの処理 3. テキスト文字列の処理 4. 最も重要な顧客の発掘 5. パターンマッチング機能の利用 6. 機械学習モデルのご紹介 おわりに 所要時間 : 約1.5時間 1. Movie Salesデータの分析 1-1. 結果キャッシュによる実行時間の短縮 まずは、年と四半期ごとの映画の総売上高を調べるシンプルなクエリを実行してみましょう。 SELECT year, quarter_name, SUM(quantity_sold * actual_price) FROM movie_sales_fact WHERE YEAR =...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb602-moviestream-analysis/",
        "teaser": "/ocitutorials/database/adb602-moviestream-analysis/teaser.png"
      },{
        "title": "603 : データ・カタログを使ってメタデータを収集しよう",
        "excerpt":"はじめに 昨今、多くの企業が自社の持つデータを分析してビジネスに役立てようとしています。しかし実際のところ、分析シナリオに最適なデータ準備やデータの把握、管理が困難で、データマネジメントには多くの課題が存在しています。 Oracle Cloud Infrastructure Data Catalogは、そのような企業データのフルマネージドのデータ検出および管理を行うソリューションです。Data Catalogを使うと、技術、ビジネスおよび運用に役立つメタデータを管理するための単一のコラボレーション環境を作成できます。データを必要とする誰もが、単一のインタフェースから、専門知識不要でデータを検索することができます。 Data Catalogの主要な機能 メタデータの収集：カタログ化したいデータストア（データベースやオブジェクトストレージ）を指定し、Data Catalogの中にメタデータを抽出します。定期的にスケジュール実行も可能です。 データへのタグ付け：表や列、ファイルなどのデータを論理的に識別するためのキーワード（自由書式）を設定できます。これにより、特定のキーワードでタグ付けされた全てのデータを検索することができます。 ビジネス用語集：組織内であらかじめ決められた用語を使って、データに検索、分類のための目印を付与することができます。 データの検索：SQLやRESTではなくキーワードでの検索、表名・列名・ファイル名での検索、特定のタグやビジネス用語に合致するデータの検索を全て行うことができます。 目次 : 1.データの準備 2.データ・カタログの作成 3.Autonomous Databaseからメタデータを収集 4.Object Storageからメタデータを収集 5.ビジネス用語集とカスタム・プロパティの作成 6.メタデータの補完 7.データの検索 8.おわりに 前提条件 Autonomous Data Warehouse(ADW)インスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 Data Catalogを使用するためのユーザーグループ、ポリシーが設定済みであること ※本チュートリアルを進めるうえで必要なポリシーはこちらを参照ください。 所要時間 : 約2時間 1. データの準備 データ・カタログのタスクを行うために必要なデータベース・オブジェクトをSQLスクリプトを実行することで作成します。 ADMINユーザーでADWに接続し、以下のスクリプトを実行して、sales_historyというユーザーを作成します。 CREATE USER sales_history IDENTIFIED BY Welcome12345#;...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb603-data-catalog/",
        "teaser": "/ocitutorials/database/adb603-data-catalog/3-1.png"
      },{
        "title": "ADB-Dの環境を作成してみよう",
        "excerpt":"目次 1. Autonomous Database Dedicated (ADB-D)とは？) 2. 環境を作成してみよう 2-1. 利用イメージ（構成図） 2-2. Exadata Infrastructureの作成 2-3. ネットワーク設定 2-4. Autonomous Exadata VMクラスタの作成 2-5. Autonomous Container Databasesの作成 2-6. Autonomous Databaseの作成 3. 作成したADBに接続してみよう 所要時間 : 約6時間程程度　※プロビジョニング時間を含みます 1. Autonomous Database Dedicated (ADB-D)とは？ Autonomous Databaseは共有型・専有型の２つのデプロイメント方式をご用意しています。 共有型のShared Exadata Infrastructure(ADB-S)はインフラストラクチャとなるExadataを共有する環境、専有型のDedicated Exadata Infrastructure(ADB-D)はExadataをお客様が専有する環境です。 ADB-Dは、複数のADBを利用するような大規模なシステムや、セキュリティ上の制約によって他のお客様との同居が許されないようなシステムで使用されることが多くなっています。 さらにADB-Dでは専有環境の持ち方として、OCIにデプロイする方式とお客様データセンターに配置できるCloud@Customer(C@C)を利用したデプロイメント方式があります。 Cloud@Customerは、データをパブリッククラウドに持ち出すことができなかったり、アプリケーションからのネットワークレイテンシが問題となるようなお客様にご利用いただくことの多いデプロイメント方式です。 本チュートリアルでは、OCI上にADB-Dのデプロイメントを行います。 ADB-Sとの違いは？ ADB-SもADB-DもAutonomous Databaseを使用している点は同じなので、その特徴である高性能・高可用性・高いセキュリティというところは変わりません。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb701-adbd/",
        "teaser": null
      },{
        "title": "Anomaly Detection ハンズオン(初級編)",
        "excerpt":"Anomaly Detection（異常検出）サービスについて 異常検出とは、データ内のまれな項目、イベント、または観察結果のうち、予想と大きく異なるものを識別することです。 これは、公益事業、航空、輸送、製造などの業界における資産の監視、メンテナンス、予後監視などのいくつかのシナリオに使用できます。 Oracleの異常検出サービスのアルゴリズムは、Oracle が特許を取得した多変量時系列異常検出アルゴリズムであり、元々は Oracle Labs によって開発され、いくつかの業界で使用されてきました。 OCIの異常検出サービスは、ユーザーがアップロードしたデータを取得し、アルゴリズムを使用してモデルをトレーニングし、カスタマイズされた機械学習モデルを作成し、クラウドでホストします。 その後、ユーザーは新しいデータをエンドポイントに送信して、検出された異常の結果を取得できます。 OCIの異常検出サービスは、サーバーレスのマルチ・テナント・サービスです。認証されたユーザーはOCI CLI、SDK、または Cloud Console を通じてREST API にアクセスできます。 OCIコンソールからAnomaly Detectionサービスを使う 前提条件 Oracle Cloud のアカウントを取得済みであること ポリシーの設定 OCI Anomaly Detection（異常検出）を利用するために、テナンシ管理者は次の手順に従って、ポリシーを設定する必要があります。 OCI コンソール画面左上のハンバーガーメニューを展開し、「アイデンティティとセキュリティ」 &gt; 「ポリシー」を選択します。 「ポリシーの作成」をクリックします。 ポリシーの作成情報を入力します。 名前：任意の名前 説明：ポリシーの説明 コンパートメント：利用するコンパートメントを選択 手動エディタの表示：選択 ポリシー・ステートメント： テナント内のすべてのユーザーが異常検出サービスを使用できるようにする場合： allow any-user to manage ai-service-anomaly-detection-family in tenancy ユーザー・グループへのアクセスを制限する場合： allow group...","categories": [],
        "tags": ["ai","anomaly-detection"],
        "url": "/ocitutorials/datascience/anomaly-detection-for-beginner/",
        "teaser": null
      },{
        "title": "OCI AI Vision ハンズオン(初級編)",
        "excerpt":"Visionサービスについて Visionは、サーバーレスのマルチ・テナント・サービスであり、コンソールまたは REST API を使用してアクセスできます。 画像をアップロードして、画像内のオブジェクトを検出および分類できます。大量の画像がある場合は、非同期 API エンドポイントを利用してバッチ処理できます。 Vision サービスの機能は、オブジェクトおよびシーンベースの画像分析と、ドキュメント中心の画像の Document AI に分割されています。 画像解析 物体検出は、基本的な画像分析機能です。 画像内の物体を検出して特定できます。 たとえば、画像がリビングルームの場合、Vision は椅子、ソファ、テレビなどの物体を見つけます。 次に、物体の周囲に境界ボックスを描画し、それらを識別します。 また、視覚的な異常検出にも使用できます。 画像分類も、基本的な画像分析機能です。 画像をオブジェクト・ストレージ にアップロードすると、その中のオブジェクトに基づいて、あらかじめ決められたクラスに配置できます。 ドキュメント AI テキスト認識は、光学式文字認識とも呼ばれ、ドキュメント内のテキストを検出して認識することです。 Vision は、画像内で見つけた印刷または手書きのテキストの周りに境界ボックスを描画し、テキストをデジタル化します。 文書の分類: OCI Visionは、文書が納税申告書、請求書、領収書のいずれであるかなど、文書を分類できます。 言語の分類: OCI Vision は、視覚的特徴に基づいて、ドキュメントの言語を検出します。 表の抽出: OCI Vision は、セルの行と列の関係を維持しながら、コンテンツを表形式で抽出します。 キー値抽出: OCI Visionは、入金の共通フィールドの値を識別します。 ドキュメント AI は、ビジネス・プロセスの自動化 (ロボティック・プロセス・オートメーション RPA)、自動化された領収書の処理、セマンティック検索、スキャンされたドキュメントなどの非構造化コンテンツから情報の自動抽出などのシナリオでの重要な構成要素です。カスタム・モデル・トレーニングを使用すると、 転移学習アプローチを通じてベース・モデルを調整し、ディープ・ラーニング・モデルをデータに合わせて調整できます。 モデルの選択、リソースの計画、デプロイメントはすべて Vision...","categories": [],
        "tags": ["ai","vision"],
        "url": "/ocitutorials/datascience/vision-for-beginner/",
        "teaser": null
      },{
        "title": "Anomaly Detection ハンズオン(中級編)",
        "excerpt":"OCI DataScienceノートブック・セッションでAnomaly Detection（異常検出）へのアクセス OCI異常検出サービスは、さまざまなプログラミング言語で CLI ツール （oci） および SDK を使用することをサポートしています。ここで、DataScience ノートブックでOCI異常検出サービスを利用する方法を紹介します。 事前準備 データ・サイエンスを利用するために、以下のように仮想クラウド・ネットワーク、動的グループおよびポリシーを作成します。 仮想クラウド・ネットワークの作成 OCIコンソールで「仮想クラウド・ネットワーク」 &gt; 「VCNウィザードの起動」 &gt; 「インターネット接続性を持つVCNの作成」を選択して、VCNとサブネットを作成します。これにより、NAT ゲートウェイを使用して必要なプライベート・サブネットを自動的に作成します。 グループの作成 次の一致ルールで動的グループを作成します。 ALL { resource.type = 'datasciencenotebooksession' } ポリシーの作成 次のステートメントを使用して、ルート・コンパートメントにポリシーを作成します。 サービス・ポリシー allow service datascience to use virtual-network-family in tenancy 管理者以外のユーザー・ ポリシー allow group &lt;ユーザー・グループ&gt; to use virtual-network-family in tenancy allow...","categories": [],
        "tags": ["ai","anomaly-detection"],
        "url": "/ocitutorials/datascience/anomaly-detection-for-intermediates/",
        "teaser": null
      },{
        "title": "OCI AI Vision ハンズオン(中級編)",
        "excerpt":"事前準備 仮想クラウド・ネットワークの作成 OCIコンソールで「仮想クラウド・ネットワーク」 &gt; 「VCNウィザードの起動」 &gt; 「インターネット接続性を持つVCNの作成」を選択して、VCNとサブネットを作成します。これにより、NAT ゲートウェイを使用して必要なプライベート・サブネットを自動的に作成します。 動的グループの作成 次の一致ルールで動的グループを作成します。 ALL { resource.type = 'datasciencenotebooksession' } ポリシーの作成 次のステートメントを使用して、ルート・コンパートメントにポリシーを作成します。 サービス・ポリシー allow service datascience to use virtual-network-family in tenancy 管理者以外のユーザー・ ポリシー allow group &lt;ユーザー・グループ&gt; to use virtual-network-family in tenancy allow group &lt;ユーザー・グループ&gt; to manage data-science-family in tenancy 動的グループに対するポリシー allow dynamic-group &lt;作成した動的グループ&gt; to...","categories": [],
        "tags": ["ai","vision"],
        "url": "/ocitutorials/datascience/vision-for-intermediates/",
        "teaser": null
      },{
        "title": "OCI Streaming を動かしてみよう",
        "excerpt":"このハンズオンでは、OCI Streaming を使う上での事前準備やいくつかのクライアントツールを用いて、実際に OCI Streaming に対して Pub/Sub を行うことで基本的な操作や特徴を学ぶことができます。 前提条件 クラウド環境 Oracle Cloud のアカウント（Free Trial）を取得済みであること 最新版の OCI CLI がセットアップされていること Cloud Shell の使用を推奨します 手順 ポリシーの作成 OCI Streaming を使用するためのポリシーを作成します。OCI コンソール左上のハンバーガーメニューから、アイデンティティとセキュリティ &gt; ポリシーと選択します。 ポリシーの作成を押します。 以下のように入力し、ポリシーを生成します。(&lt;your-group&gt;, &lt;your-compartment&gt;は、ご自身の環境に合わせて変更してください) Allow group &lt;your-group&gt; to manage stream-family in compartment &lt;your-compartment&gt; ストリーム・プールの作成 ストリームの管理に使用する論理グループであるストリーム・プールを作成します。OCI コンソール左上のハンバーガーメニューからアナリティクスと AI &gt; ストリーミングを選択します。 ストリーム・プールを選択します。 ストリーム・プールの作成を押します。 以下のように入力して、ストリーム・プールを作成します。...","categories": [],
        "tags": ["streaming"],
        "url": "/ocitutorials/datascience/streaming-for-beginner/",
        "teaser": null
      },{
        "title": "Structured Spark Streaming を OCI Data Flow で体験しよう",
        "excerpt":"このエントリーでは、OCI Data Flow と OCI Streaming を用いて、Structured Spark Streaming の基礎を学習します。 前提条件 Oracle Cloud のアカウントを取得済みであること OCI CLI v3.4.5 以上がインストールされていること Cloud Shell の利用を推奨 Data Flow ハンズオン(初級編) - 事前準備が完了していること Object Storage の namespace が確認できていること Data Flow を使用するために必要な各種バケット（dataflow-logs, dataflow-warehouse）の作成が完了していること Data Flow を使用するためのポリシーの設定が完了していること ハンズオンの全体像 OCI Streaming へ publish したメッセージを Data Flow 上で動作する Spark アプリケーションが subscribe...","categories": [],
        "tags": ["dataflow","streaming"],
        "url": "/ocitutorials/datascience/dataflow-structured-spark-streaming/",
        "teaser": null
      },{
        "title": "OCI Data Flow ハンズオン(初級編)",
        "excerpt":"OCI Data Flow は、大量データの並列分散処理を実現するためのフレームワークである Apache Spark を OCI 上でマネージドサービスとして提供します。 このエントリーでは、OCI Data Flow の基本的な操作を学習します。 前提条件 クラウド環境 Oracle Cloud のアカウントを取得済みであること ハンズオンの全体像 本ハンズオンは、Berlin Airbnb データセットを用いて最適な取引物件を予測する事を行いたいと思います。そのために OCI Data Flow を用いて、以下のことを学習します。 Java を使用した ETL SparkSQL によるデータの簡易的なプロファイリング PySpark を使用した機械学習 それでは、実施していきます。 0. 事前準備 OCI Data Flow を使用するための Object Storage の作成やポリシーの設定を行います。また、Data Flow は Object Storage へのアクセスに Hadoop Distributed...","categories": [],
        "tags": ["dataflow"],
        "url": "/ocitutorials/datascience/dataflow-for-beginner/",
        "teaser": null
      },{
        "title": "Oracle GoldenGate Stream Analytics ハンズオン",
        "excerpt":"Oracle GoldenGate Stream Analytics(以下、GGSA) は、IoT データ、パイプライン、ログデータ、ソーシャルメディアといった Stream データをリアルタイムに分析的計算処理するテクノロジーを提供するプラットフォームです。 このエントリーでは、GGSA の Marketplace からのプロビジョニングからチュートリアル完了までの手順を記します。 前提条件 クラウド環境 Oracle Cloud のアカウントを取得済みであること ハンズオン環境の全体像 OCI Marketplace から GGSA を最小構成でプロビジョニングすると、以下の環境が作成されます。本エントリーでは、この環境を用いてハンズオンを実施します。 作成する Pipeline の全体像 このエントリーでは、リアルタイムに流れてくる交通データを分析することを行います。最終的に完成する Pipeline は以下のようになります。 それぞれの Stage で実施されることについて簡単に説明します。 車両の走行データ リアルタイムに流れてくる交通データを Java プログラムで疑似的に表現しています。Java プログラム中では、Kafka の特定 Topic(tutorial)に対してメッセージを publish しており、本ハンズオンは該当の Topic から メッセージを consume する所から始まります。 関連するハンズオンの章: 2-1. チュートリアル用のイベント・ストリームを Kafka...","categories": [],
        "tags": ["ggsa"],
        "url": "/ocitutorials/datascience/ggsa-tutorial-for-beginner/",
        "teaser": null
      },{
        "title": "クラウドでOracle Exadata を使う",
        "excerpt":" ","categories": [],
        "tags": ["https://community.oracle.com/docs/DOC-1038411"],
        "url": "/ocitutorials/enterprise/using-oracle-exadata/",
        "teaser": null
      },{
        "title": "HPCクラスタを構築する(基礎インフラ手動構築編)",
        "excerpt":"このチュートリアルは、HPC向けIntel Ice Lakeプロセッサを搭載する BM.Optimized3.36 を クラスタ・ネットワーク を使用してノード間接続し、HPCワークロードを実行するためのHPCクラスタを構築する際のベースとなるインフラストラクチャを構築、そのインターコネクト性能を検証します。 このチュートリアルで作成する環境は、ユーザ管理、ホスト名管理、共有ファイルシステム、プログラム開発環境、ジョブスケジューラ等、必要なソフトウェア環境をこの上に整備し、ご自身の要件に沿ったHPCクラスタを構築する際の基礎インフラストラクチャとして利用することが可能です。 なお、これらのクラスタ管理に必要なソフトウェアの導入までを自動化する HPCクラスタスタック も利用可能で、詳細は HPCクラスタを構築する(スタティッククラスタ自動構築編) を参照ください。 またこのチュートリアルは、環境構築後により大規模な計算を実施する必要が生じたり、メンテナンスによりノードを入れ替える必要が生じることを想定し、既存のクラスタ・ネットワークに計算ノードを追加する方法と、特定の計算ノードを入れ替える方法も学習します。 所要時間 : 約1時間 前提条件 : クラスタ・ネットワークを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。 注意 : チュートリアル内の画面ショットについては、OCIの現在のコンソール画面と異なっている場合があります。 0. HPCクラスタ作成事前作業 0-0. 概要 HPCクラスタを構成する クラスタ・ネットワーク と計算ノードは、OCIコンソールからクラスタ・ネットワークを作成することで、計算ノードをクラスタ・ネットワークに接続したHPCクラスタとしてデプロイされます。 このため、この計算ノードをTCP接続するVCNと、インターネットから直接アクセス出来ないプライベートサブネットに通常接続される計算ノードにログインする際の踏み台となるBastionノードを、HPCクラスタ作成前に予め用意する必要があります。 本章は、これらHPCクラスタ作成の前提となるリソースを作成します。 0-1. VCN作成 本章は、計算ノードをTCP接続するVCNを作成します。 VCNの作成は、以下チュートリアルページ クラウドに仮想ネットワーク(VCN)を作る の手順通りに実行し、 https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn 以下のリソースを作成します。 VCN（10.0.0.0/16） パブリックサブネット（10.0.0.0/24） プライベートサブネット（10.0.1.0/24） インターネット・ゲートウェイ（パブリックサブネットにアタッチ） NATゲートウェイ（プライベートサブネットにアタッチ） サービス・ゲートウェイ（プライベートサブネットにアタッチ） ルート表 x 2（パブリックサブネットとプライベートサブネットにアタッチ） セキュリティリスト...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-cluster-network/",
        "teaser": "/ocitutorials/hpc/spinup-cluster-network/architecture_diagram.png"
      },{
        "title": "HPC/GPUクラスタを構築する(基礎インフラ自動構築編)",
        "excerpt":"このチュートリアルは、HPC/GPUクラスタの計算/GPUノードに最適なベアメタルインスタンス（本チュートリアルではHPCクラスタ向けに BM.Optimized3.36 GPUクラスタ向けに BM.GPU4.8 を使用）を クラスタ・ネットワーク でノード間接続する、HPC/機械学習ワークロードを実行するためのHPC/GPUクラスタを構築する際のベースとなるインフラストラクチャを、これらを接続する仮想クラウドネットワークと共に予め用意された Terraform スクリプトを使用してTerraform CLIで自動構築、そのインターコネクト性能を検証します。 このチュートリアルで作成する環境は、ユーザ管理、ホスト名管理、共有ファイルシステム、プログラム開発環境、コンテナランタイム、ジョブスケジューラ等、必要なソフトウェア環境をこの上に整備し、ご自身の要件に沿ったHPC/GPUクラスタを構築する際の基礎インフラストラクチャとして利用することが可能です。 なお、これらのクラスタ管理に必要なソフトウェアの導入までを自動化する HPCクラスタスタック も利用可能で、詳細は HPCクラスタを構築する(スタティッククラスタ自動構築編) や GPUクラスタを構築する(スタティッククラスタ自動構築編) を参照ください。 所要時間 : 約1時間 前提条件 : クラスタ・ネットワークを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。 注意 : チュートリアル内の画面ショットについては、OCIの現在のコンソール画面と異なっている場合があります。 0. Terraform実行環境構築 本章は、 Terraform CLIを使用してHPC/GPUクラスタのライフサイクル管理を実行するTerraform実行環境を構築します。 この実行環境は、インターネットに接続されたLinux・Windows・Macの何れかのOSが稼働している端末であればよく、以下のような選択肢が考えられます。 OCI上のLinuxが稼働するVMインスタンス ご自身が使用するWindows/Macパソコン ご自身が使用するWindows/Macパソコンで動作するLinuxゲストOS 本チュートリアルは、このTerraform実行環境のOSにLinuxを使用します。 Terraform実行環境は、以下のステップを経て構築します。 Terraformインストール Terraform実行環境とOCI間の認証関係締結（APIキー登録） 具体的なTerraform実行環境構築手順は、チュートリアル TerraformでOCIの構築を自動化する の 2. Terraform環境の構築 を参照ください。 また、関連するOCI公式ドキュメントは、 ここ を参照ください。 1....","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-hpc-cluster-withterraform/",
        "teaser": "/ocitutorials/hpc/spinup-hpc-cluster-withterraform/architecture_diagram.png"
      },{
        "title": "HPCクラスタを構築する(スタティッククラスタ自動構築編)",
        "excerpt":"Oracle Cloud Infrastructure（以降OCIと記載）は、以下の特徴からHPCワークロードを実行するHPCクラスタを構築するには最適なクラウトサービスです。 仮想化オーバーヘッドの無いHPC用途に特化したベアメタルシェイプ RoCEv2を使用する高帯域・低レイテンシRDMAインターコネクトネットワーク このチュートリアルは、OCIのマーケットプレイスから利用可能なHPCクラスタ構築のためのリソース・マネージャ用スタックを利用し、以下構成の典型的なHPCクラスタを構築、そのインターコネクト性能を検証します。 HPC向けIntel Ice Lakeプロセッサ搭載計算ノード（ BM.Optimized3.36 ） 100 Gbps RoCEv2 RDMAインターコネクト（※1） インターネットからSSH接続可能なBastionノード OS: Oracle Linux 8.6 ジョブスケジューラ: Slurm OCIファイルストレージサービスによるHPCクラスタ内ホームディレクトリ共有 LDAPによるクラスタ内ユーザ統合管理 ※1：OCIでは、このインターコネクトネットワークを クラスタ・ネットワーク と呼称します。 このHPCクラスタ構築用スタックを利用すると、通常であれば数日かかるようなHPCクラスタ構築作業を、OCIコンソールのGUIから10項目程度のメニューを選択するだけで実施することが可能になります。 またこのチュートリアルでは、クラスタ構築後により大規模な計算を実施する必要が生じたり、メンテナンスによりノードを入れ替える必要が生じることを想定し、既存のクラスタに計算ノードを追加する方法と、特定の計算ノードを入れ替える方法も学習します。 リソース・マネージャについては、以下のチュートリアルも参考にしてください。 https://oracle-japan.github.io/ocitutorials/intermediates/resource-manager/ 所要時間 : 約1時間 前提条件 : HPCクラスタを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。具体的には、以下ページの Policies to deploy the stack: に記載のポリシーが付与されていること。 https://cloud.oracle.com/marketplace/application/67628143/usageInformation 注意 : チュートリアル内の画面ショットについては、OCIの現在のコンソール画面と異なっている場合があります。また使用するHPCクラスタ構築用スタックのバージョンが異なる場合も、チュートリアル内の画面ショットが異なる場合があります。 0. HPCクラスタ構築用スタックの概要 本チュートリアルで使用するHPCクラスタ構築用スタックは、クラスタ構築を大きく2つのステップに分けて実行しており、前半はTerraformを使用したOCIレベルのリソース構築フェーズで、後半はTerraformから起動されるAnsibleによるOSレベルのカスタマイズフェーズです。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-hpc-cluster/",
        "teaser": "/ocitutorials/hpc/spinup-hpc-cluster/architecture_diagram.png"
      },{
        "title": "HPCクラスタを構築する(オンデマンドクラスタ自動構築編)",
        "excerpt":"Oracle Cloud Infrastructure（以降OCIと記載）は、仮想化オーバーヘッドの無いHPC用途に特化したベアメタルシェイプとこれらを接続する クラスタ・ネットワーク を提供しており、HPCワークロードを実行するHPCクラスタを構築するには最適なクラウドサービスです。 このチュートリアルは、 マーケットプレイス から無償で利用可能な HPCクラスタスタック を利用し、以下構成のオンデマンドHPCクラスタを構築します。 HPC向けIntel Ice Lakeプロセッサ搭載計算ノード（ BM.Optimized3.36 ） 100 Gbps RoCEv2 RDMAインターコネクト (クラスタ・ネットワーク) インターネットからSSH接続可能なBastionノード OS: Oracle Linux 8.6 ジョブスケジューラ: Slurm オンデマンドクラスタ機能： クラスタオートスケーリング ファイル・ストレージサービスによるHPCクラスタ内ホームディレクトリ共有 LDAPによるクラスタ内ユーザ統合管理 またこのチュートリアルは、デプロイしたHPCクラスタのインターコネクト性能をIntel MPIベンチマークで確認します。 オンデマンドHPCクラスタにおけるワークロード実行は、Slurmにジョブを投入することで行い、クラスタオートスケーリングがジョブ実行に必要な計算ノードをクラスタ・ネットワークと共に動的に起動、構築されたクラスタにSlurmがジョブをディスパッチします。 またクラスタオートスケーリングは、ジョブが実行されない状態が一定時間経過すると、自動的にクラスタを削除します。 本チュートリアルで使用するHPCクラスタスタックは、通常であれば数日かかるオンデマンドHPCクラスタ構築作業を、OCIコンソールのGUIから10項目程度のメニューを選択した後、1クリックで自動的に実施することを可能とします。 所要時間 : 約2時間 前提条件 : オンデマンドHPCクラスタを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。具体的には、以下ページの Policies to deploy the stack: に記載のポリシーと Policies for...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-hpc-cluster-withautoscaling/",
        "teaser": "/ocitutorials/hpc/spinup-hpc-cluster-withautoscaling/architecture_diagram.png"
      },{
        "title": "GPUインスタンスで機械学習にトライ",
        "excerpt":"Oracle Cloud Infrastructure（以降OCIと記載）は、GPUを搭載するVMやベアメタルの様々なシェイプが用意されており、自身の機械学習ニーズに合った機械学習環境を構築するには最適なクラウドサービスです。 このチュートリアルは、NVIDIA GPUドライバソフトウェアやCUDAを内包するOCIのGPUシェイプ向けプラットフォームイメージを利用し、以下構成の機械学習環境を構築、TensorFlowを利用するサンプル機械学習プログラムをJupyterLab/Jupyter Notebookから実行します。 選択可能な機械学習環境GPUシェイプ VM.GPU3.1 (NVIDIA Tesla V100 16 GB x 1) VM.GPU3.2 (NVIDIA Tesla V100 16 GB x 2) VM.GPU3.4 (NVIDIA Tesla V100 16 GB x 4) BM.GPU3.8 (NVIDIA Tesla V100 16 GB x 8) BM.GPU4.8 (NVIDIA A100 40 GB x 8) ※：シェイプ詳細は、以下URLを参照。 https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm 利用可能な機械学習関連ソフトウェア TensorFlow...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-ml-instance/",
        "teaser": "/ocitutorials/hpc/spinup-ml-instance/architecture_diagram.png"
      },{
        "title": "GPUクラスタを構築する(基礎インフラ手動構築編)",
        "excerpt":"このチュートリアルは、AIや機械学習ワークロードに最適なNVIDIA A100 40/80 GB 8枚と100 GbpsのRDMA対応ネットワークインタフェース16ポート搭載するGPUノード（ BM.GPU4.8/BM.GPU.GM4.8 ）を クラスタ・ネットワーク を使用してノード間接続し、1ノードでは搭載しきれないGPUを必要とする大規模なAI・機械学習ワークロードを実行するための分散機械学習に対応したDockerコンテナをGPUクラスタ上に構築、複数ノードに跨るGPU間の通信性能を NCCL（NVIDIA Collective Communication Library） テストプログラム（ NCCL Tests ）で検証後、分散機械学習のサンプルプログラムを実行、その性能を検証します。 このチュートリアルは、分散機械学習フレームワークに以下2種類を取り上げ、それぞれ3章と4章でこれらを解説しています。該当する章を参照することで、自身のワークロードに合わせた環境構築が可能です。 Horovod（ 3.Horovodを使用するGPUクラスタ環境構築 ） MultiWorkerMirroredStrategy（ 4.MultiWorkerMirroredStrategyを使用するGPUクラスタ環境構築 ） よって本チュートリアルの進め方は、まず自身のワークロードに合わせて上記2種類からどちらを使用するか選択し、0章 → 1章 → 2章 → 3章 or 4章 → 5章と進めます。 このチュートリアルで作成する環境は、ユーザ管理、ホスト名管理、ファイル共有、プログラム開発環境、コンテナオーケストレーション等、必要なソフトウェア環境をこの上に整備し、ご自身の要件に沿ったGPUクラスタを構築する際の基礎インフラストラクチャとして利用することが可能です。 なお、これらのクラスタ管理に必要なソフトウェアの導入までを自動化する HPCクラスタスタック も利用可能で、詳細は GPUクラスタを構築する(スタティッククラスタ自動構築編) を参照ください。 所要時間 : 約2時間 前提条件 : GPUクラスタを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。 注意 :...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-gpu-cluster/",
        "teaser": "/ocitutorials/hpc/spinup-gpu-cluster/architecture_diagram.png"
      },{
        "title": "GPUクラスタを構築する(スタティッククラスタ自動構築編)",
        "excerpt":"Oracle Cloud Infrastructure（以降OCIと記載）は、以下のサービスを提供することから、1ノードには搭載しきれない多数のGPUを必要とする大規模なAIや機械学習のワークロードを実行する、GPUクラスタを構築するには最適なクラウドサービスです。 RoCE v2採用の高帯域・低レイテンシRDMAインターコネクトの クラスタ・ネットワーク 8枚のNVIDIA A100 40/80 GBと総帯域幅1.6 Tbps（100 Gbps x 16）のRDMA対応ネットワークインタフェースを搭載するベアメタルGPUシェイプ BM.GPU4.8/BM.GPU.GM4.8 このチュートリアルは、OCIのマーケットプレイスから利用可能なGPUクラスタ構築のためのリソース・マネージャ（※1）用スタックを利用し、以下構成のGPUクラスタを構築、複数ノードに跨るGPU間の通信性能を NCCL（NVIDIA Collective Communication Library） の通信性能計測プログラム（ NCCL Tests ）で検証後、分散機械学習のサンプルプログラムを実行します。 NVIDIA A100 40 GBを8枚搭載するGPUノード（ BM.GPU4.8 ） 100 Gbps x 16 RoCEv2 RDMAインターコネクト（※2） インターネットからSSH接続可能なbastionノード OS: Oracle Linux 7.9 コンテナランタイム: Enroot ジョブスケジューラ: Slurm + Pyxis OCIファイルストレージサービスによるGPUクラスタ内ホームディレクトリ共有 LDAPによるクラスタ内ユーザ統合管理 ※1：リソース・マネージャについては、以下のチュートリアルも参考にしてください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-gpu-cluster-withstack/",
        "teaser": "/ocitutorials/hpc/spinup-gpu-cluster-withstack/architecture_diagram.png"
      },{
        "title": "GPUクラスタを構築する(オンデマンドクラスタ自動構築編)",
        "excerpt":"Oracle Cloud Infrastructure（以降OCIと記載）は、8枚のNVIDIA A100 40/80 GBと総帯域幅1.6 Tbps（100 Gbps x 16）のRDMA対応ネットワークインタフェースを搭載するベアメタルGPUシェイプ BM.GPU4.8/BM.GPU.GM4.8 とこれらを接続する クラスタ・ネットワーク を提供しており、1ノードには搭載しきれない多数のGPUを必要とする大規模なAIや機械学習のワークロードを実行するGPUクラスタを構築するには最適なクラウドサービスです。 このチュートリアルは、 マーケットプレイス から無償で利用可能な スタック を利用し、以下構成のオンデマンドGPUクラスタを構築します。 NVIDIA A100 40 GBを8枚搭載するGPUノード（ BM.GPU4.8 ） 100 Gbps x 16 RoCEv2 RDMAインターコネクト (クラスタ・ネットワーク) インターネットからSSH接続可能なBastionノード OS: Oracle Linux 7.9 コンテナランタイム: Enroot ジョブスケジューラ: Slurm + Pyxis オンデマンドクラスタ機能： クラスタオートスケーリング OCIファイル・ストレージサービスによるGPUクラスタ内ホームディレクトリ共有 LDAPによるクラスタ内ユーザ統合管理 またこのチュートリアルは、デプロイしたGPUクラスタで複数ノードに跨るGPU間の通信性能を NCCL（NVIDIA Collective...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-gpu-cluster-withautoscaling/",
        "teaser": "/ocitutorials/hpc/spinup-gpu-cluster-withautoscaling/architecture_diagram.png"
      },{
        "title": "ブロック・ボリュームでNFSファイルサーバを構築する",
        "excerpt":"Oracle Cloud Infrastructure（以降OCIと記載）のブロック・ボリュームは、以下の特徴からHPCクラスタやGPUクラスタのファイル共有ストレージとして使用するNFSファイルサーバのストレージに最適なサービスです。 同一可用性ドメイン内の異なるフォルト・ドメインに複数のレプリカを持ち高い可用性を実現 ディスク装置にNVMe SSDを採用することで高いスループットとIOPSを実現 また、Intel Ice Lakeプロセッサを搭載するベアメタルシェイプ BM.Optimized3.36 は、50 GpbsのTCP/IP接続用ポートを2個搭載し、それぞれをiSCSI接続のブロック・ボリュームアクセスとNFSクライアントへのNFSサービスアクセスに割当てることで、コストパフォーマンスの高いNFSサーバ用インスタンスとして利用することが可能です。 OCIは、NFSのマネージドサービスであるファイル・ストレージも提供しており、OCIコンソールから簡単にNFSファイルサービスをデプロイすることが出来ますが、本チュートリアルのように少しだけ手間をかけてブロック・ボリュームとベアメタルインスタンスを組み合わせたNFSファイルサービスを自身で構築することで、ファイル・ストレージよりもコストパフォーマンスの高いファイル共有ストレージを構築することが出来ます。 以下の表は、本チュートリアルで構築するNFSファイルサービスの総容量15 TBを前提とし、両選択肢の価格と性能を比較しています。   月額定価 (2023年3月時点) スループット IOPS ファイル・ストレージ 630,000円 (*3, 4) 1.5 GB/s (*1) 37,500 (*1) ブロック・ボリューム BM.Optimized3.36 Total - 89,250円 273,667円 362,917円 (*3, 4) 7.2 GB/s (*2) 375,000 (*2) *1) 以下URLで公開されているファイル・ストレージの10 TBでの性能情報をもとに、これを容量比として1.5倍した値を記載しています。この性能を実現するには、テスト環境・条件に十分な配慮が必要です。 https://docs.oracle.com/en-us/iaas/Content/Resources/Assets/whitepapers/file-storage-performance-guide.pdf *2) ボリューム・サイズ1 TBでボリューム・パフォーマンスがBalancedの15ボリューム分のブロック・ボリュームサービスとしての最大値で、NFSファイルシステムでこの性能を達成できることを保証するものではありません。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-nfs-server/",
        "teaser": "/ocitutorials/hpc/spinup-nfs-server/architecture_diagram.png"
      },{
        "title": "ブロック・ボリュームNFSファイルサーバと基礎インフラ編HPC/GPUクラスタを組み合わせる",
        "excerpt":"HPCクラスタやGPUクラスタは、そのフロントエンドとなるBastionノードを含む全てのノードで利用できるファイル共有ストレージが運用上必須です。 代表的なファイル共有ストレージの用途は、ユーザホームディレクトリですが、この領域は通常高いパフォーマンスより安定したサービスの提供が重視されるため、NFSがその有力な候補です。 OCIは、NFSのマネージドサービスとしてファイル・ストレージを提供しており、ファイルサーバ構築の必要無く簡単に利用できるため、HPC/GPUクラスタ用ユーザホームディレクトリの有力な候補です。 HPCクラスタスタック は、ファイル・ストレージの構築・セットアップを行う機能を持っており、ファイル・ストレージをユーザホームディレクトリに利用するHPC/GPUクラスタを自動構築することが出来ます。 これに対し、OCIのブロックストレージサービスであるブロック・ボリュームを使用してNFSファイルサーバを構築し、この領域をユーザホームディレクトリとして使用することも可能です。 この手法は、ファイル・ストレージを使用する場合と比較して構築の手間がかかりますが、価格性能比の圧倒的に高いブロック・ボリュームの特徴を利用して、コストパフォーマンスを大幅に高めることが可能です。 ファイル・ストレージとブロック・ボリュームを使用したNFSファイルサーバの価格と性能の比較は、チュートリアル ブロック・ボリュームでNFSファイルサーバを構築する 前段の比較表を参照ください。 このチュートリアルは、チュートリアル ブロック・ボリュームでNFSファイルサーバを構築する でブロック・ボリュームをアタッチしたベアメタルインスタンス BM.Optimized3.36 をNFSファイルサーバとするファイル共有ストレージを構築し、チュートリアル HPCクラスタを構築する(基礎インフラ手動構築編) や GPUクラスタを構築する(基礎インフラ手動構築編) で基礎インフラとして構築するHPC/GPUクラスタのファイル共有ストレージとして利用する、コストパフォーマンスの優れたクラスタシステムを構築します。 所要時間 : 約2時間 0. 概要 本チュートリアルは、チュートリアル ブロック・ボリュームでNFSファイルサーバを構築する とチュートリアル HPCクラスタを構築する(基礎インフラ手動構築編) かチュートリアル GPUクラスタを構築する(基礎インフラ手動構築編) を組み合わせて、以下のシステムを構築します。 この図中、左下の一点鎖線で囲まれたリソースを HPC/GPUクラスタを構築する(基礎インフラ手動構築編) で構築し、それ以外のリソースを ブロック・ボリュームでNFSファイルサーバを構築する で構築します。 [ブロック・ボリュームでNFSファイルサーバを構築する がデプロイするリソース] VCNと関連するネットワークリソース ブロック・ボリューム NFSファイルサーバ用インスタンス Bastionノード NFSクライアント用インスタンス [HPC/GPUクラスタを構築する(基礎インフラ手動構築編) がデプロイするリソース] クラスタ・ネットワーク 計算/GPUノード 本チュートリアルは、以上2個のチュートリアルを活用し、以下の手順でシステムを構築します。 NFSファイルサーバ構築（ブロック・ボリュームでNFSファイルサーバを構築する を実施）...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/cluster-with-bv-base/",
        "teaser": "/ocitutorials/hpc/cluster-with-bv-base/architecture_diagram.png"
      },{
        "title": "ブロック・ボリュームNFSファイルサーバと自動構築編HPC/GPUクラスタを組み合わせる",
        "excerpt":"HPCクラスタやGPUクラスタは、そのフロントエンドとなるBastionノードを含む全てのノードで利用できるファイル共有ストレージが運用上必須です。 代表的なファイル共有ストレージの用途は、ユーザホームディレクトリですが、この領域は通常高いパフォーマンスより安定したサービスの提供が重視されるため、NFSがその有力な候補です。 OCIは、NFSのマネージドサービスとしてファイル・ストレージを提供しており、ファイルサーバ構築の必要無く簡単に利用できるため、HPC/GPUクラスタ用ユーザホームディレクトリの有力な候補です。 HPCクラスタスタック は、ファイル・ストレージの構築・セットアップを行う機能を持っており、ファイル・ストレージをユーザホームディレクトリに利用するHPC/GPUクラスタを自動構築することが出来ます。 これに対し、OCIのブロックストレージサービスであるブロック・ボリュームを使用してNFSファイルサーバを構築し、この領域をユーザホームディレクトリとして使用することも可能です。 この手法は、ファイル・ストレージを使用する場合と比較して構築の手間がかかりますが、価格性能比の圧倒的に高いブロック・ボリュームの特徴を利用して、コストパフォーマンスを大幅に高めることが可能です。 ファイル・ストレージとブロック・ボリュームを使用したNFSファイルサーバの価格と性能の比較は、チュートリアル ブロック・ボリュームでNFSファイルサーバを構築する 前段の比較表を参照ください。 このチュートリアルは、チュートリアル ブロック・ボリュームでNFSファイルサーバを構築する でブロック・ボリュームをアタッチしたベアメタルインスタンス BM.Optimized3.36 をNFSファイルサーバとするファイル共有ストレージを構築し、以下のように組み合わせたチュートリアルで構築するHPC/GPUクラスタのファイル共有ストレージとして利用します。 ファイル共有ストレージ 構築チュートリアル HPC/GPUクラスタ 構築チュートリアル 構築するシステム概要 ブロック・ボリュームで NFSファイルサーバを構築する HPCクラスタを構築する (スタティッククラスタ自動構築編) BM.Optimized3.36を計算ノードとするスタティックHPCクラスタ ブロック・ボリュームファイル共有ストレージ LDAPユーザ統合管理 Slurmジョブスケジュール・計算リソース管理 同上 GPUクラスタを構築する (スタティッククラスタ自動構築編) BM.GPU4.8/BM.GPU.GM4.8をGPUノードとするスタティックGPUクラスタ ブロック・ボリュームファイル共有ストレージ LDAPユーザ統合管理 Slurmジョブスケジュール・計算リソース管理 同上 GPUクラスタを構築する (オンデマンドクラスタ自動構築編) BM.GPU4.8/BM.GPU.GM4.8をGPUノードとするオンデマンドGPUクラスタ ブロック・ボリュームファイル共有ストレージ LDAPユーザ統合管理 Slurmジョブスケジュール・計算リソース管理 所要時間 : 約2時間 0. 概要 本チュートリアルは、チュートリアル ブロック・ボリュームでNFSファイルサーバを構築する とHPC/GPUクラスタを構築するチュートリアルを組み合わせて、以下のシステムを構築します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/cluster-with-bv-stack/",
        "teaser": "/ocitutorials/hpc/cluster-with-bv-stack/architecture_diagram.png"
      },{
        "title": "クラスタ・ネットワーク接続用ネットワークインターフェース作成方法",
        "excerpt":"クラスタ・ネットワーク 対応シェイプの BM.Optimized3.36 や BM.GPU4.8/BM.GPU.GM4.8 は、接続するポートのIPアドレス設定等を含むネットワークインターフェースをインスタンスデプロイ後にユーザ自身が適切に設定することで、クラスタ・ネットワークに接続します。 本テクニカルTipsは、このネットワークインターフェース作成方法を解説します。 0. 概要 BM.Optimized3.36やBM.GPU4.8/BM.GPU.GM4.8は、 クラスタ・ネットワーク がDHCPに対応していないため、その接続インターフェースに静的にIPアドレスを割当てる必要があります。 またBM.GPU4.8/BM.GPU.GM4.8は、クラスタ・ネットワークに接続するポートを16ポート有し、これらをNCCL等のGPU間通信ライブラリから使用しますが、この場合これら16ポートを16個の異なるIPサブネットに接続して使用します。 ここでDHCPが利用できないクラスタ・ネットワークで、複数ノードに亘ってIPアドレスの重複が起こらないようにネットワークインターフェースを設定するには、どのようにうすればよいでしょうか。 この課題に対処するため、 マーケットプレイス から提供するクラスタ・ネットワーク対応OSイメージは、systemdのサービス oci-rdma-configure を用意しています。クラスタ・ネットワーク対応OSイメージを使用する方法は、テクニカルTips クラスタ・ネットワーク対応OSイメージの選び方 が参考になります。 このサービスは、起動されるとクラスタ・ネットワークに接続するポートのネットワークインターフェース設定を/etc/sysconfig/network-scripts/ifcfg- ifname ファイルに作成し、ネットワークインターフェースを起動します。 ここで各ポートに割り振られるIPアドレスは、インスタンスを仮想クラウド・ネットワークのサブネット（24ビットのネットマスクを想定）にTCP/IPで接続する際に使用するポートにDHCPで割り振られるIPアドレスの4フィールド目（ここでは”x”と仮定）を使用し、以下のように静的にIPアドレスを割当てることで、アドレス重複を回避します。 BM.Optimized3.36の場合 ポート名 IPアドレス ens800f0 192.168.0.x/24 BM.GPU4.8/BM.GPU.GM4.8の場合 ポート名 IPアドレス enp12s0f0 192.168.0.x/24 enp12s0f1 192.168.1.x/24 enp22s0f0 192.168.2.x/24 enp22s0f1 192.168.3.x/24 enp72s0f0 192.168.4.x/24 enp72s0f1 192.168.5.x/24 enp76s0f0 192.168.6.x/24 enp76s0f1 192.168.7.x/24 enp138s0f0...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/rdma-interface-configure/",
        "teaser": null
      },{
        "title": "クラスタ・ネットワーク対応OSイメージの選び方",
        "excerpt":"クラスタ・ネットワーク を使用するインスタンスは、接続に必要なソフトウェアがインストールされている必要がありますが、これらを含んだOSイメージが マーケットプレイス から提供されています。 本テクニカルTipsは、このOSイメージの適切な選び方を解説します。 0. 概要 マーケットプレイス から提供される クラスタ・ネットワーク 対応OSイメージは、ベースOSにOracle Linuxを採用し、シェイプがBM.HPC2.36/ BM.Optimized3.36 の場合そのバージョンは7.9と8.6から選択でき、 BM.GPU4.8/BM.GPU.GM4.8 の場合7.9のみ選択可能です。 下表は、クラスタ・ネットワークに対応したシェイプと対応するOSイメージの組み合わせを示しています。 シェイプ OSイメージ名 ベースOS マーケットプレイスURL BM.HPC2.36 HPC Cluster Networking Image Oracle Linux 7.9 Link   HPC Cluster Networking Image Oracle Linux 8.6 Link BM.Optimized3.36 HPC Cluster Networking Image Oracle Linux 7.9 Link   HPC...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/",
        "teaser": null
      },{
        "title": "クラスタ・ネットワーク非対応OSイメージを使ったクラスタ・ネットワーク接続方法",
        "excerpt":"クラスタ・ネットワーク に接続するインスタンスは、接続に必要なソフトウェアがインストールされている必要があり、これらを含んだOSイメージが マーケットプレース から提供されていますが、これらのベースとなるOSは、Oracle Linuxのみです。 本テクニカルTipsは、 BM.Optimized3.36 を使用するインスタンスをOracle Linux以外のOSでクラスタ・ネットワークに接続する方法を解説します。 注意 : テクニカルTips内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 クラスタ・ネットワーク に接続するインスタンスは、以下の条件を満たす必要があります。 クラスタ・ネットワーク対応シェイプ（※1）を使用している 同一のクラスタ・ネットワークと共にデプロイしている クラスタ・ネットワーク接続のための以下ソフトウェアがインストールされている Mellanox OFED wpa_supplicant（※2） oci-cn-auth（※3） クラスタ・ネットワーク接続用ネットワークインターフェースがOS上に構築されている ※1）クラスタ・ネットワーク対応シェイプは、以下に記載があります。 https://docs.public.oneportal.content.oci.oraclecloud.com/ja-jp/iaas/Content/Compute/Tasks/managingclusternetworks.htm#supported-shapes ※2）クラスタ・ネットワークは、インスタンスが接続する際802.1X認証を要求しますが、これらの処理を行うクライアントソフトウェアがwpa_supplicantです。802.1X認証の仕組みは、以下のサイトが参考になります。 https://www.infraexpert.com/study/wireless14.html ※3）クラスタ・ネットワークに接続する際の802.1X認証で必要な認証処理機能を提供するユーティリティーソフトウェアで、GitHubから公開されています。 これらの条件の中で、クラスタ・ネットワーク接続のためのソフトウェアは、 OCI HPCテクニカルTips集 の クラスタ・ネットワーク対応OSイメージの選び方 に記載のクラスタ・ネットワーク対応OSイメージには予めインストールされていますが、OSによってはこれらのソフトウェアをインストールすることにより、クラスタ・ネットワークに接続することが可能です。 これらソフトウェアのインストールは、手順が多く相応の所要時間が必要なため、予め最小ノード（2ノード）のクラスタを構築してこの計算ノードにソフトウェアをインストール、この計算ノードの カスタム・イメージ を使用して、実際に使用するHPCクラスタを構築します。 以上より、クラスタ・ネットワーク非対応OSイメージを使ったHPCクラスタの構築は、以下の手順を経て行います。 カスタムイメージ取得用2ノードHPCクラスタ構築 クラスタ・ネットワーク接続用ソフトウェアインストール クラスタ・ネットワーク接続確認 カスタム・イメージ取得 cloud-init 設定ファイル（cloud-config）作成 カスタム・イメージとcloud-configを指定した インスタンス構成 作成 インスタンス構成を指定した クラスタ・ネットワーク...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/howto-create-cnenabled-osimage/",
        "teaser": null
      },{
        "title": "ベアメタルインスタンスの内蔵NVMe SSD領域ファイルシステム作成方法",
        "excerpt":"高速スクラッチ領域として利用することを想定したNVMe SSDを内蔵するHPCクラスタ向けベアメタルシェイプ BM.Optimized3.36 やGPUクラスタ向けベアメタルシェイプ BM.GPU4.8/BM.GPU.GM4.8 は、NVMe SSDをOSのファイルシステムとして利用するための設定をユーザ自身が行う必要があります。 本テクニカルTipsは、このファイルシステム作成方法を解説します。 0. 概要 内蔵NVMe SSDドライブにファイルシステムを作成する方法は、搭載するドライブ数が異なるBM.Optimized3.36とBM.GPU4.8/BM.GPU.GM4.8でその手順が異なり、それぞれの手順を以降で解説します。 なお 、ここで解説するファイルシステム作成手順は、 OCI HPCチュートリアル集 で紹介する構築手順に含まれるため、これらチュートリアルの手順に従ってHPCクラスタやGPUクラスタを構築する場合は、改めて実施する必要はありません。 1. BM.Optimized3.36用ファイルシステム作成手順 BM.Optimized3.36は、3.84 TBのNVMe SSDディスクを1ドライブ内蔵するため、以下の手順を該当するノードのrootで実行し、ファイルシステムを作成します。 &gt; parted -s /dev/nvme0n1 mklabel gpt &gt; parted -s /dev/nvme0n1 -- mkpart primary xfs 1 -1 &gt; mkfs.xfs -L localscratch /dev/nvme0n1p1 &gt; mkdir -p /mnt/localdisk &gt; echo \"LABEL=localscratch...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/nvme-filesystem/",
        "teaser": null
      },{
        "title": "計算ノードの効果的な名前解決方法",
        "excerpt":"ノード数が多くなるHPCクラスタやGPUクラスタの計算ノードの名前解決は、どのように行うのが効果的でしょうか。 本テクニカルTipsは、仮想クラウドネットワークのDNSを使用した効果的な計算ノードの名前解決方法を解説します。 0. 概要 仮想クラウドネットワークに接続するインスタンスのホスト名は、仮想クラウドネットワークのDNSに正引き・逆引き情報が自動的に登録され、DNS名前解決が可能です。 このため、改めてホストファイルを作成しなければならない/etc/hostsやNISを使用した名前解決より、DNS名前解決を活用するのが効率的です。 ただDNSで名前解決を行う場合、名前解決を行うインスタンスと名前解決対象インスタンスが異なるサブネットに接続されている場合、注意が必要です。 これは、名前解決を行うインスタンスのOSがOracle Linuxの場合、デプロイ直後のresolv.confのsearch行に自身が接続するサブネットのFQDNが含まれるため、同じサブネットに接続するインスタンス同士はインスタンス名で名前解決可能なのに対し、異なるサブネットに接続するインスタンス同士はFQDNでしか名前解決出来ないためです。 そこで、通常パブリックサブネットに接続されるBastionノードで通常プライベートサブネットに接続される計算ノードのホスト名をインスタンス名でDNS名前解決するには、Bastionノードのresolv.confのsearch行にプライベートサブネットのFQDNを追加します。 ここで、仮想クラウドネットワークが提供するDNSは、インスタンス名（compute1）とこれが接続される仮想クラウドネットワーク名（vcn）とサブネット名（private）を使用して、インスタンスのFQDNを以下のように登録します。 compute1.private.vcn.oraclevcn.com 以上を踏まえて以降では、パブリックサブネットに接続されるBastionノードでプライベートサブネットに接続される計算ノードのホスト名をインスタンス名で名前解決する手順を解説します。 1. プライベートサブネットFQDN確認 本章は、通常計算ノードが接続されるプライベートサブネットのFQDNを確認します。 サブネットのFQDNは、OCIコンソールでサブネットが存在するリージョンを選択後、 ネットワーキング → 仮想クラウド・ネットワーク とメニューを辿り、表示される以下画面で該当するサブネットが含まれる仮想クラウド・ネットワークを選択します。 表示される以下画面で、該当するサブネットを選択します。 表示される以下 サブネット詳細 画面の DNSドメイン名 フィールドで、サブネットのFQDNを確認します。 この例では、サブネットのドメイン名が private 、仮想クラウド・ネットワークのドメイン名が vcn のため、FQDNが private.vcn.oraclevcn.com になっています。 2. resolv.confファイル修正 本章は、パブリックサブネットに接続されるBastionノードの/etc/resolv.confファイルを修正します。 Bastionノードで、以下のようにresolv.confファイルのsearch行に計算ノードが接続されるプライベートサブネットのFQDNを追加します。 &gt; diff /etc/resolv.conf_org /etc/resolv.conf 7c7 &lt; search vcn.oraclevcn.com public.vcn.oraclevcn.com --- &gt; search...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/compute-name-resolution/",
        "teaser": null
      },{
        "title": "計算ノードデプロイ時の効果的なOSカスタマイズ方法",
        "excerpt":"ノード数が多くなるHPCクラスタやGPUクラスタの計算ノードやGPUノードは、デプロイ時に実施するOSカスタマイズをどのように行うのが効果的でしょうか。 本テクニカルTipsは、計算ノードデプロイ時のOSカスタマイズ方法の選択肢と、それぞれの利用方法について解説します。 0. 概要 HPCクラスタやGPUクラスタの計算ノードやGPUノードは、ノード数が数十ノードから時には数百ノードになることもあり、これらのOSに自身の環境に合わせたカスタマイズを加える際、どのような手法を採用するのが最も効果的かという観点で考慮する必要があります。 OCIでこれらのカスタマイズを加えるための代表的な選択肢は、以下が挙げられます。 Ansible RedHat社が開発するオープンソースの構成管理ツールで、YAML形式で記述されたPlaybookの情報を元に、ターゲットノードの構成管理を管理ノードからSSHで実行します。 Playbookは、条件分岐や反復処理を記述することが可能で、cloud-initやカスタム・イメージと比較して複雑な構成管理処理を実現することが可能です。 cloud-init カスタム・イメージ 下表は、これらの選択肢をいくつかの評価基準から比較しており、これらの特徴をふまえて自身のOSカスタマイズ要件にあった手法を選定します。   Ansible cloud-init カスタム・イメージ 備考 難易度 高(*1) 中(*2) 低 *1) 管理ノード構築要 　　Playbook・インベントリファイル等構文習得要 *2) cloud-config構文習得要 カスタマイズ柔軟性 高(*3) 中(*4) 低(*5) *3) 条件分岐や反復を使用した柔軟なカスタマイズ可 *4) 様々なモジュールを使用した柔軟なカスタマイズ可 *5) 作成時に適用されているカスタマイズに限定 デプロイ時カスタマイズ 必要 必要 不要(*6) *6) カスタマイズ適用済のためデプロイ時間短縮可           以上を踏まえて次章以降は、cloud-initとカスタム・イメージを使用した計算ノードやGPUノードのOSカスタマイズの手順を解説します。 なおAnsibleは、オープンソースでインターネットから様々な情報を入手することが可能なため、ここでは解説しません。 1....","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/compute-os-customization/",
        "teaser": null
      },{
        "title": "計算ノードのホスト名リスト作成方法",
        "excerpt":"ノード数が多くなるHPCクラスタやGPUクラスタは、全ての計算/GPUノードのホスト名の一覧を記載したホスト名リストを作成することで、構築・運用作業を効率的に進めることが可能になります。 本テクニカルTipsは、HPC/GPUクラスタの計算/GPUノードのホスト名リストを効果的に作成する方法を解説します。 0. 概要 HPCクラスタやGPUクラスタを構築・運用する際、全ての計算/GPUノードに対して同じコマンドを実行する、ジョブスケジューラに全てのノードを一括登録する、といったオペレーションを行う場面が頻繁に発生します。 このようなオペレーションは、全ての計算/GPUノードのホスト名を1行に1ノード記載した、以下のようなホスト名リストをテキストファイルで予め作成しておくことで、効率よく実施することが可能になります。 inst-hyqxm-comp inst-ihmnl-comp inst-hrsmf-comp inst-afnzx-comp 例えば、以下のようにこのホスト名リストを使用することで、全ての計算ノードのOSバージョンを確認することが可能です。 &gt; for hname in `cat ./hostlist.txt`; do echo $hname; ssh $hname \"grep -i pretty /etc/os-release\"; done inst-0giw2-comp PRETTY_NAME=\"Oracle Linux Server 8.6\" inst-ael72-comp PRETTY_NAME=\"Oracle Linux Server 8.6\" このホスト名リストは、以下のような方法で効率的に作成することが可能です。 OCIコンソールを活用する方法 この方法は、OCIコンソールの インスタンス メニューに表示される計算/GPUノードのインスタンス名を活用する方法です。 この インスタンス メニューは、1ページに50インスタンスまでしか表示できないため、50ノードを超える場合は、複数ページにわたってコピー・ペーストを行う必要があり、後述のOCI CLIを使用する方法が効率的にホスト名リストを作成できます。 OCI CLIを活用する方法 この方法は、OCI CLIの...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/compute-host-list/",
        "teaser": null
      },{
        "title": "計算ノードの追加・削除・入れ替え方法",
        "excerpt":"HPCクラスタやGPUクラスタは、実行するワークロードの増減に伴い計算/GPUノードのノード数を増減する必要が生じることがあります。またハードウェア障害が発生すると、利用可能なノード数を維持するために該当ノードを別のノードに置き換える必要が生じます。 本テクニカルTipsは、 クラスタ・ネットワーク を使用するHPC/GPUクラスタで計算/GPUノードのノード数を増減する方法や置き換える方法を解説します。 0. 概要 HPC/GPUクラスタのノード数を増減させたり既存の計算/GPUノードを置き換える際、これらのノードが通常同一の クラスタ・ネットワーク に接続されている必要があることから、クラスタ・ネットワークを使用しないインスタンスとは異なる手順が必要になります。 そこで本テクニカルTipsでは、これらの手順を以下の3ケースに分けて解説します。 ノード数を減らす ノード数を増やす ノードを置き換える 1. ノード数を減らす 1-0. 概要 ノード数を減らす場合、終了するノードを指定する方法と終了するノードをOCIに任せる方法があります。 終了するノードをOCIに任せる方法は、 クラスタ・ネットワーク に接続するどのノードを終了しても構わないが複数のノードを一度に減らす際に有効で、最も作成日の古いものから終了の対象として選択されます。 これに対して終了するノードを指定する方法は、一度に終了するノードは1ノードだが終了するノードを特定する必要がある際に有効です。 1-1. 終了するノードを指定する方法 本章は、計算/GPUノードを減らす際、終了するノードを指定する方法を解説します。 OCIコンソールメニューから コンピュート → クラスタ・ネットワーク を選択し、表示される以下画面で、ノード数を減らす クラスタ・ネットワーク をクリックします。 表示される以下画面の インスタンス・プール フィールドで、クラスタ・ネットワークの作成に伴い作成されたインスタンスプールをクリックします。 表示される以下画面左下の アタッチされたインスタンス メニューをクリックします。 表示される画面の以下 アタッチされたインスタンス フィールドで、終了するインスタンスのメニューから インスタンスのデタッチ メニューをクリックします。 表示される以下画面で、 このインスタンスおよびアタッチされたブート・ボリュームを完全に終了（削除） チェックボックスをチェックし、 デタッチと終了 ボタンをクリックします。 OCIコンソールメニューから コンピュート...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/cluster-resize/",
        "teaser": null
      },{
        "title": "OCI Load Balancerに直接アタッチするタイプのWeb Application Firewallを構成する",
        "excerpt":"OCIでは、OCI Load Balancerに直接デプロイするWAF、”WAFポリシー”と、お客様のアプリケーションのドメインに構築するWAF、”エッジポリシー”の2種類のWAFを提供しています。 本チュートリアルでは、OCIのLoad Balancerに直接デプロイする”WAFポリシー”を作成し、実際のWAFの動作を確認します。 所要時間 : 約1時間 前提条件 : 応用編 - ロードバランサーでWebサーバーを負荷分散するを参考に、WebサーバーおよびOCIのロードバランサ―が構成されていること 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. IAMポリシーの作成 Web Application Firewallを使用するためには、操作を実行するユーザーに以下のポリシーが付与されている必要があります。 allow group &lt;IAMグループ名&gt; to manage waas-family in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to manage web-app-firewall in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to manage waf-policy in tenancy/compartment &lt;コンパートメント名&gt;...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/id-security/web-application-firewall-v2/",
        "teaser": "/ocitutorials/id-security/web-application-firewall-v2/wafv2-19.png"
      },{
        "title": "OCI Network Firewallを構築する",
        "excerpt":"パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール「OCI Network Firewall」が2022年7月にリリースされました。「OCI Network Firewall」はURLフィルタリングやTSL/SSL検査などの機能を提供します。 本チュートリアルではOCI Network Firewallの環境を構築し、OCI Network Firewallの動作を確認します。 所要時間 : 約70分 前提条件 : ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細はドキュメントを参照ください。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 はじめに : 以下が本チュートリアルで作成するNetwork Firewallの構成図です。 Network Firewallについて Network FirewallはOCIクラウド環境に入るトラフィックと、サブネット間のトラフィックを可視化します。 Network Firewallはファイアウォールとして、Network Firewallを通過するトランスポート・レイヤー・セキュリティ（TLS）暗号化トラフィックを含むすべてのリクエストを検査し、ユーザーが構成したファイアウォール・ポリシー・ルールに基づいて、許可、拒否、ドロップ、侵入検出、防止などのアクションを実行します。 Network Firewallは以下のようなユースケースにてご利用いただくことが可能です。 パロアルトネットワークスの脅威シグネチャおよび脅威分析エンジンを用いて、既知の脆弱性に対する攻撃、マルウェア、C&amp;Cサーバー等の脅威の検知・防御 アウトバウンドへの不正通信を識別し、機密性の高いデータ流出を抑止 各サブネットとルート表について インターネットを経由してPublic Subnet内のインスタンスに対するインバウンドのトラフィックが発生すると、「Internet Gatewayルート表」のルールによりトラフィックはNFW SubnetにあるNetwork Firewallを通過します。Network Firewallによって検査されたトラフィックは「NFW Subnetルート表」のルールにより、Public Subnet内のインスタンスへ転送されます。 Public Subnet内のインスタンスから発生するインターネットへのアウトバウンドのトラフィックも同様に、「Public Subnetルート表」のルールによりNetwork Firewallへ転送されます。その後、「NFW Subnetルート表」のルールにより、Network...","categories": [],
        "tags": ["id-security"],
        "url": "/ocitutorials/id-security/networkfirewall/",
        "teaser": "/ocitutorials/id-security/networkfirewall/nfw1.png"
      },{
        "title": "OCI Web Application Firewallのエッジポリシーを使ってWebサーバを保護する",
        "excerpt":"OCIにはエッジポリシーとWAFポリシーの2種類のWeb Application Firewallがあります。 本チュートリアルでは、OCI世界各リージョンのエッジに設定されているWAFサーバにデプロイするタイプの「エッジポリシー」を実際に作成して、Webアプリケーションへの攻撃を検知、防御しているところを確認します。 所要時間： 約90分 前提条件： ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細はドキュメントをご参照ください。 Webアプリケーションのドメインを取得していること 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 ※本チュートリアルはOCI上でコンピュートを立ち上げてWebサーバーをインストールするところから始めます。既に手元にWebサーバがインストールされ、ドメインが構成されている環境がある場合は手順4から始めてください。 1. コンピュートインスタンスの作成 OCIチュートリアル入門編その3-インスタンスを作成するを参考に、Webサーバ用のコンピュートインスタンスを1つ作成する。 2. Webサーバのインストールと起動 sshでインスタンスにアクセスする。 インスタンスへのsshでのアクセス方法が不明な場合は、 その3 - インスタンスを作成する を参考にしてください。 Apache HTTPサーバーをインストールする。 sudo yum -y install httpd TCPの80番(http)および443番(https)ポートをオープンにする。 sudo firewall-cmd --permanent --add-port=80/tcp sudo firewall-cmd --permanent --add-port=443/tcp ファイアウォールを再ロードする。 sudo firewall-cmd --reload Webサーバーを起動する。 sudo systemctl start...","categories": [],
        "tags": ["id-security"],
        "url": "/ocitutorials/id-security/waf-edge-policy/",
        "teaser": "/ocitutorials/id-security/waf-edge-policy/edge1.png"
      },{
        "title": "OCI Network FirewallのIPS/IDS機能を検証する",
        "excerpt":"パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール「OCI Network Firewall」が2022年7月にリリースされました。「OCI Network Firewall」はURLフィルタリングやTSL/SSL検査などの機能を提供します。 本チュートリアルはOCI Network Firewallを構築するの続編として、IPS/IDSの設定および動作を確認します。 IPS/IDSの動作検証には、Kali LinuxのツールおよびEicarファイルを使用します。 Kali Linuxでは、Network Firewallインスタンスに保護されたWindowsのコンピュートインスタンスに侵入テストを実施します。 Eicarファイルを使用する際は、Network Firewallインスタンスに保護されたLinuxのコンピュートインスタンスにWebサーバーを構築し、Webサーバーを使用して動作を検証します。 所要時間 : 約60分 前提条件 : OCIチュートリアルOCI Network Firewallを構築するを参考に、Network Firewallインスタンスの作成、コンピュートインスタンス（LinuxまたはWindows）の作成が終わっていること Kali Linuxを使用した動作検証を実施する場合、Windowsのコンピュートインスタンスに対して侵入テストを実施します。OCIチュートリアルOCI Network Firewallを構築するの手順6-2Windowsインスタンスの作成に沿って、Windowsのコンピュートインスタンスが作成されていることを確認してください。 Kali Linuxを使用した動作検証を実施する場合、Kali LinuxをOCIにデプロイするを参考に、OCI Network Firewallで保護されたコンピュートインスタンスに対して通信を行える環境に、Kali Linuxの構築が終わっていること。 Eicarファイルを使用した動作検証を実施する場合、LinuxのコンピュートインスタンスにWebサーバーをインストールして動作を検証します。OCIチュートリアルOCI Network Firewallを構築するの手順6-1Linuxのコンピュート・インスタンスの作成に沿って、Linuxのコンピュートインスタンスが作成されていることを確認してください。 重要： OCIの環境へツールなどを用いた侵入テストを実行する際は、メールにてOracleに事前に侵入テストの実施を通知する必要があります。本チュートリアルの内容を実施する際は、クラウド・セキュリティ・テスト通知の送信を参考に、事前にOracleへ告知メールを送信してください。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 ※本チュートリアルでは、OCI Network Firewallの機能検証を目的にKali LinuxおよびEicarファイルを使用します。ご自身の管理下にないサーバーや、本番環境に対しては使用しないでください。また、ツールを使用したことによりトラブルや損失が発生した場合についても責任を負いかねます。 1. ネットワーク・ファイアウォール・ポリシーの編集...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/id-security/networkfirewall-ips/",
        "teaser": "/ocitutorials/id-security/networkfirewall/nfw1.png"
      },{
        "title": "OCI Network Firewallのログを分析する",
        "excerpt":"パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール「OCI Network Firewall」が2022年7月にリリースされました。「OCI Network Firewall」はURLフィルタリングやTSL/SSL検査などの機能を提供します。 本チュートリアルでは、OCI Network Firewallを構築するの続編として、Network Firewallのログを分析し、Network Firewallを通過するトラフィックの傾向、脅威の有無を確認します。 Network Firewallのログの収集にはLoggingサービス、分析にはOCIが提供するログ分析サービス「Logging Analytics」を使用します。 Logging Analyticsでは、様々なOCIサービスのログ、Oracle製品のログに対応したログの解析文が用意されていますが、Network Firewallのログにはまだ対応していないので、本チュートリアルではNetwork Firewallのログに対応した解析文をカスタムで作成します。 通常はLoggingサービスで収集したログは「Service Connector Hub」と呼ばれるサービスを使用して、直接Logging Analyticsに連携することも可能です。しかし、今回はLoggingサービスから直接Logging Analyticsにログを転送してしまうと、カスタムで作成したログの解析文でログを読み取ることが出来なくなってしまうため、Loggingサービスのログを一度Object Storageに転送します。 Object Storageに格納されたログは、Logging Analyticsの「ObjectCollectionRule」と呼ばれるルールを作成することで、Logging Analyticsに転送されます。 所要時間 : 約60分 前提条件 : Logging Analyticsが有効化されていること OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。 ユーザーがLoggingサービスを使用するためのポリシーが作成されていること。ポリシーの詳細はドキュメントをご参照ください。 ユーザーがLogging Analyticsを使用するためのポリシーが作成されていること。ポリシーの詳細はOCIのLogging AnalyticsでOCIの監査ログを可視化・分析するもしくは、ドキュメントをご参照ください。 ユーザーがService Connectorを作成するためのポリシーが作成されていること。ポリシーの詳細はドキュメントをご参照ください。 OCIチュートリアルOCI Network Firewallを構築するを参考に、Network Firewallインスタンスの作成、コンピュートインスタンス（LinuxまたはWindows）の作成が終わっていること OCIチュートリアルOCI Network FirewallのIPS/IDS機能を検証するを参考に、侵入検知（IDS）もしくは侵入防止（IPS）のセキュリティ・ルールが設定されていること OCIチュートリアルコマンドライン(CLI)でOCIを操作するを参考に、OCI...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/id-security/networkfirewall-la/",
        "teaser": "/ocitutorials/id-security/networkfirewall-la/nfwla39.png"
      },{
        "title": "Web Application Firewall(WAF)を使ってWebサーバを保護する",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/ocitutorials/id-security/protecting-web-servers-with-waf/",
        "teaser": null
      },{
        "title": "OCI IAM Identity DomainsとAzure ADとの認証連携（外部IDP連携）を設定する",
        "excerpt":"2021年にOCIの新しい認証基盤としてOCI IAM Identity Domainsが登場しました。Identity DomainsはOCIのIAMサービスに代わりOCIへのユーザーの認証・認可の役割と、OCIのIdentity Cloud Serviceで提供していた他サービスとの認証連携の機能を提供しています。 本チュートリアルではSAMLによるOCI IAM Identity DomainsとAzure ADとの認証連携（外部IDP連携）を設定する手順を紹介します。Azure ADはMicrosoft社が提供するクラウドベースのIDおよびアクセス管理サービスです。本チュートリアルを完了することでAzure ADにサインオンするだけでOCIにもサインオンが可能になります。 所要時間 : 60分 前提条件 : 対象 Azure AD は構築済みとします。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. OCI IAM Identity DomainsのSAMLメタデータダウンロード OCI IAM Identity DomainsにてSMALメタデータをダウンロードします。 OCIのログイン画面でクラウド・アカウント名を入力します。 Select an identity domain to sign inのドロップダウンボックスから「Default」を選択し「Next」ボタンをクリックします。 ログイン画面でOCIテナント管理者のユーザー名とパスワードを入力してサインインします。 OCI コンソール画面左上のメニューより「アイデンティティとセキュリティ」→「アイデンティティ」を選択します。 アイデンティティ画面にて、「ドメイン」を選択し、ドメインを作成したいコンパートメントを指定し、ドメインを選択します。（今回は「Tutorial」ドメインを選択します。）※自身で作成したIdentity Domain（ドメイン）に設定する場合にはその該当ドメインを選択します。...","categories": [],
        "tags": ["id-security"],
        "url": "/ocitutorials/id-security/identitydomains-AzureAD/",
        "teaser": "/ocitutorials/id-security/identitydomains-add-domains-license/identitydomains1.png"
      },{
        "title": "OCI IAM Identity Domainsのドメインの追加とライセンスタイプを変更する",
        "excerpt":"2021年にOCIの新しい認証基盤としてOCI IAM Identity Domainsが登場しました。Identity DomainsはOCIのIAMサービスに代わりOCIへのユーザーの認証・認可の役割と、OCIのIdentity Cloud Serviceで提供していた他サービスとの認証連携、認証強化の機能を提供しています。 OCIの環境にはデフォルトで「Default Domain」と呼ばれるドメインが作成されます。Default Domainは主にOCIへのユーザーの認証、認可にお役立ていただくことが可能です。また、Identity Domainsの用途に応じて、新しくドメインを作成したり、ライセンスタイプを変更することも可能です。 本チュートリアルでは、新しいドメインの追加方法と、ライセンスタイプの変更方法をご紹介します。 Identity Domainsのライセンスタイプの一覧と、各ライセンスタイプの機能制限などについてはドキュメントをご参照ください。 所要時間 : 約20分 前提条件 : 新しいドメインを作成するには、OCIテナントの管理者権限を持つユーザーが操作を実行する必要があります。操作を実行するユーザーがOCIテナントの管理者ではない場合は、ユーザーにOCIテナントの管理者権限を付与してください。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. Default Domainにログイン OCIのログイン画面でクラウド・アカウント名を入力します。 Select an identity domain to sign inのドロップダウンボックスから「Default」を選択し「Next」ボタンをクリックします。 ログイン画面でOCIテナント管理者のユーザー名とパスワードを入力してサインインします。 2. ドメインの作成 OCIコンソール画面左上のメニューより、「アイデンティティとセキュリティ」→「アイデンティティ」→「ドメイン」を選択します。「ドメインの作成」ボタンをクリックします。 ドメイン作成画面にて、以下情報を記載し「ドメインの作成」ボタンをクリックします。 表示名 - 任意（ログイン画面に表示されるアイデンティティ・ドメイン名になります） 説明 - 任意 ドメインタイプ - Free/Oracle...","categories": [],
        "tags": ["id-security"],
        "url": "/ocitutorials/id-security/identitydomains-add-domains-license/",
        "teaser": "/ocitutorials/id-security/identitydomains-add-domains-license/identitydomains1.png"
      },{
        "title": "OCI IAM Identity Domains - テナント管理者・一般ユーザーを作成する",
        "excerpt":"2021年にOCIの新しい認証基盤としてOCI IAM Identity Domainsが登場しました。Identity DomainsはOCIのIAMサービスに代わりOCIへのユーザーの認証・認可の役割と、OCIのIdentity Cloud Serviceで提供していた他サービスとの認証連携、認証強化の機能を提供しています。 本チュートリアルでは、OCIテナントのアクティベーション後に2人目移行のテナント管理者ユーザーを作成する手順と、OCIテナントの一般ユーザーの作成手順を紹介します。 所要時間 : 約15分 前提条件 : OCIテナントで2人目以降のテナント管理者ユーザーを作成するには、OCIテナントをアクティベートしたテナント管理者が操作を実行する必要があります。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. Default Domainにログイン OCIのログイン画面でクラウド・アカウント名を入力します。 Select an identity domain to sign inのドロップダウンボックスから「Default」を選択し「Next」ボタンをクリックします。 ログイン画面でOCIテナント管理者のユーザー名とパスワードを入力してサインインします。 2. 管理者ユーザーの作成 OCIコンソール画面左上のメニューより、「アイデンティティとセキュリティ」→「アイデンティティ」→「ドメイン」→ドメイン「Default」を選択します。 ※Defaultドメインはルートコンパートメントにあります。 ドメイン詳細画面の左側のメニューから「ユーザー」を選択し、「ユーザーの作成」ボタンをクリックします。 ユーザーの作成画面にて、ユーザーの名・姓・電子メールアドレスを入力します。 ※デフォルトでは、電子メールアドレスがIdentity Domainログイン時のユーザー名になります。電子メールアドレス以外のユーザー名を指定したい場合は、「ユーザー名として電子メール・アドレスを使用」のチェックを外し、別途ユーザー名を指定してください。 グループオプションにて、「Administrators」にチェックをいれ、「作成」ボタンをクリックします。 ※Defaultドメインの「Administrators」グループに所属するユーザーがテナント管理者になります。 3. テナント管理者ユーザーのアクティベート ユーザーが作成されると、ユーザー作成時に入力した電子メールアドレスに、Welcomeメールが届きます。 メール本文の「Activate Your Account」ボタンをクリックします。 表示された初期パスワードのリセット画面にてパスワードを指定し、「パスワードのリセット」ボタンをクリックします。 以上の手順で、OCIテナント管理者ユーザーの作成と、アカウントのアクティベートが完了しました。 再度OCIテナントのログイン画面から、作成した管理者ユーザーのID/パスワードでOCIにログインできることを確認してください。...","categories": [],
        "tags": ["id-security"],
        "url": "/ocitutorials/id-security/identitydomains-admin-users/",
        "teaser": "/ocitutorials/id-security/identitydomains-admin-users/users7.png"
      },{
        "title": "Cloud Guardを使ってみる",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/id-security/cloud-guard/",
        "teaser": null
      },{
        "title": "Oracle Data Safe チュートリアルまとめ",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。   1.Oracle Data Safeを有効化する  2.Oracle Data Safeのデータ・マスキングを試してみる  3.Oracle Data Safeのアクティビティ監査で操作ログを記録する  4.Oracle Data Safeにフェデレーッド・ユーザーでアクセスする  5.プライベートIPアドレスでData SafeにDBを登録する  6.Oracle Data SafeでオンプレミスのOracle DBを管理する  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/id-security/data-safe-tutorials/",
        "teaser": null
      },{
        "title": "OCI IAM Identity DomainでAPEXで作成したアプリケーションに認証と認可をする",
        "excerpt":"Identity Domainでは、SAMLやOAuthなどの技術を使用することで、様々なアプリケーションとシングル・サインオンを実装することができます。 本チュートリアルでは、Oracle Application Express（APEX）で作成したアプリケーションとIdentity Domainの認証連携、およびIdentity Domainのグループに基づくアクセス制限（認可）の実装手順を紹介します。 本チュートリアルを完了すると、Identity DomainのユーザーはIdentity Domainのユーザー名とパスワードでAPEXアプリケーションにアクセスすることができるようになります。 また、Identity Domainのユーザーが属しているグループに基づいて、APEXアプリケーション内でアクセスできるページを制御することができるようになります。 所要時間 : 約1時間 前提条件 : Oracle Database編 - ADBの付属ツールで簡易アプリを作成しよう（APEX）を参考に、APEXのワークスペースを作成していること アイデンティティとセキュリティ編 - OCI IAM Identity Domains テナント管理者・一般ユーザーを作成するを参考に、APEXアプリケーションにアクセスするユーザーが複数名分作成されていること。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. APEXアプリケーションの作成（任意） 本手順では、APEXアプリケーション内のアクセス制限を実装するため、APEXのサンプルアプリケーションをインストールします。 既存のアプリケーションがある場合は、本手順は実施しなくても問題ありません。 任意のAPEXワークスペースにログインします。 ワークスペースにログインしたら、「アプリケーション・ビルダー」を選択します。 「作成」ボタンをクリックします。 「ファイルから」を選択します。 「コピー・アンド・ペースト」のタブを開き、「販売」のサンプル・データ・セットを選択し、「次」ボタンをクリックします。 データのロード画面にて、任意の表名を入力し、「データのロード」ボタンをクリックします。 データがロードされ、表が作成されたら「アプリケーションの作成」ボタンをクリックします。 アプリケーションの作成画面にて、任意のアプリケーション名を入力します。 機能のセクションで「すべてをチャック」を選択し、「アプリケーションの作成」ボタンをクリックします。 「アプリケーションの実行」を選択します。 新しいタブが開き、アプリケーションのログイン画面が表示されます。 ワークスペースにログインしたユーザーのユーザー名とパスワードを入力し、アプリケーションにアクセスできることを確認します。 以上でサンプルのAPEXアプリケーションの作成は終了です。...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/id-security/identitydomain-apex-sso/",
        "teaser": "/ocitutorials/id-security/identitydomain-apex-sso/apex-10.png"
      },{
        "title": "OCI IAM Identity DomainでユーザーのMFAを有効化する",
        "excerpt":"Identity DomainではSMSやメール、モバイルアプリケーションのワンタイム・パスコードなどを使用してユーザーに二要素認証を要求することができます。 また、全ユーザーに二要素認証を要求するのではなく、特定のグループに属しているユーザーや、特定のネットワークからログインしたユーザーなど、条件を指定して二要素認証を要求できます。 本チュートリアルでは、Identity Domainの特定のグループに属しているユーザーに二要素認証を要求するための設定手順を紹介します。 所要時間 : 約20分 前提条件 : アイデンティティとセキュリティ編 - OCI IAM Identity Domains - テナント管理者・一般ユーザーを作成するを参考に、MFAを有効化したいユーザーを作成していること Identity Domainの管理者が本チュートリアル記載の設定作業をすること 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. グループの作成 本チュートリアルでは、特定のグループに属しているユーザーがIdentity Domainにログインする際に、二要素認証を要求するように設定をします。 最初に、二要素認証を要求するグループを作成し、ユーザーをグループに追加します。 OCIコンソール左上のメニュー → アイデンティティとセキュリティ → アイデンティティ → ドメイン → 対象のドメインを選択します。 ドメインの詳細画面で、「グループ」のタブを開き、「グループの作成」ボタンをクリックします。 グループの作成画面で、グループ名とグループの説明を入力し、グループに追加するユーザーを選択します。 「作成」ボタンをクリックし、グループを作成します。 以上の手順で、二要素認証を要求するグループを作成しました。 2. MFAの有効化 Identity Domain内で有効化する二要素認証の”ファクタ”を選択します。 ドメインの詳細画面 → セキュリティ...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/id-security/identitydomain-mfa/",
        "teaser": "/ocitutorials/id-security/identitydomain-mfa/mfa-10.png"
      },{
        "title": "OIC インスタンスを作成する",
        "excerpt":"Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。このハンズオンでは OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介します。 アイデンティティ・ドメインを使用した手順はこちらをご確認ください。 OIC インスタンスの作成前に確認すること OIC インスタンスを作成する前の確認事項について説明します。 1. Oracle Cloud アカウントの準備 Oracle Cloud のアカウントを準備します。無料のトライアル環境（フリートライアル）と有料のクラウド・アカウントのご利用が可能です。 無料のトライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です。詳細は下記URLのページをご確認ください。 Oracle Cloud 無料トライアルを申し込む トライアル環境のサインアップ手順はこちらをご確認ください。 Oracle Cloud 無料トライアル・サインアップガイド(PDF) Oracle Cloud 無料トライアルに関するよくある質問(FAQ) 2. 作成可能なリージョンの確認 OIC インスタンスを作成可能なリージョンを確認します。詳細はこちらのマニュアルをご確認ください。 3. 制限事項の確認 クラウド・アカウントの発行時期により、作成可能な OIC インスタンスの種類が異なります。こちらのマニュアルに、OCI コンソールから作成する OIC Generation 2 インスタンスの作成条件が記載されています。 4. エディションの確認 (Standard or Enterprise) OIC...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/integration-for-commons-1-instance/",
        "teaser": null
      },{
        "title": "OIC インスタンスを作成する・ユーザーを追加する－アイデンティティ・ドメイン編",
        "excerpt":"Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。このハンズオンでは OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介します。 OIC インスタンスの作成前に確認すること OIC インスタンスを作成する前の確認事項について説明します。 1. Oracle Cloud アカウントの準備 Oracle Cloud のアカウントを準備します。無料のトライアル環境（フリートライアル）と有料のクラウド・アカウントのご利用が可能です。 無料のトライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です。詳細は下記URLのページをご確認ください。 Oracle Cloud 無料トライアルを申し込む トライアル環境のサインアップ手順はこちらをご確認ください。 Oracle Cloud 無料トライアル・サインアップガイド(PDF) Oracle Cloud 無料トライアルに関するよくある質問(FAQ) 2. 作成可能なリージョンの確認 OIC インスタンスを作成可能なリージョンを確認します。詳細はこちらのマニュアルをご確認ください。 3. 制限事項の確認 クラウド・アカウントの発行時期により、作成可能な OIC インスタンスの種類が異なります。こちらのマニュアルに、OCI コンソールから作成する OIC Generation 2 インスタンスの作成条件が記載されています。 4. エディションの確認 (Standard or Enterprise) OIC は、2つのエディション(Standard...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/integration-for-commons-1-instance-id/",
        "teaser": null
      },{
        "title": "OIC インスタンスにユーザーを追加する",
        "excerpt":"このハンズオンでは Oracle Integration(OIC) インスタンスを利用するユーザーの登録方法、およびロールの割り当て方法を ステップ・バイ・ステップで紹介します。 前提条件 OIC インスタンスを作成するが実施済みであること IDCS の Identity Domain Administrator ロールが付与されたユーザーであること OIC インスタンスにユーザーを追加する OIC インスタンスを利用するユーザーは、IDCS ユーザーとして登録します。 ここでは、以下の手順で IDCS ユーザーを OIC インスタンスの事前定義済アプリケーションロールの ServiceUser に割り当てる手順を説明します。 IDCS の管理コンソールを開く IDCS グループを作成する IDCS グループを OIC インスタンスのアプリケーションロールに割り当てる IDCS ユーザーを作成し、IDCS グループに割り当てる OIC の事前定義済アプリケーションロールについて OIC の事前定義済アプリケーションロール（以降、事前定義済ロールと省略）は、OIC のさまざまな機能へのアクセスを制御します。事前定義済ロールに対して、IDCS で作成したユーザーおよびグループを割り当てることができます。Oracle Integration の事前定義済ロールと、そのロールを割り当てられたユーザーが実行できる一般的なタスクについては、下記ドキュメントをご確認ください。 Oracle Integration Roles and Privileges...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/integration-for-commons-2-addusr/",
        "teaser": null
      },{
        "title": "ファイル・サーバーの有効化",
        "excerpt":"このチュートリアルは、Oracle Integration Cloud が提供する SFTP に対応したファイル・サーバーを有効化する手順について説明します。 前提条件 このチュートリアルでは、Oracle Integration Cloud のインスタンスがすでに作成されていることを前提としています。 Oracle Integration Cloud のインスタンスをまだ作成していない場合は、次のページを参考に作成してください。 OIC インスタンスを作成するが実施済みであること ファイル・サーバーの有効化 Oracle Integration Cloud が提供している File Server は、インスタンスの作成直後は有効化されていません。 OCI コンソールを使用して、管理者が明示的に有効にする必要があります。 OCI コンソールにログインします。 サブスクライブしているリージョンの URL を使用します。 リージョン URL Tokyoリージョン https://console.ap-tokyo-1.oraclecloud.com/ Osaka リージョン https://console.ap-osaka-1.oraclecloud.com/ Phoenixリージョン https://console.us-phoenix-1.oraclecloud.com/ Ashburnリージョン https://console.us-ashburn-1.oraclecloud.com/ Frankfurtリージョン https://console.eu-frankfurt-1.oraclecloud.com/ OCI コンソールの画面左上にあるハンバーガー・メニューをクリックし、 「開発者サービス」 カテゴリにある 「アプリケーション統合」...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/app-integration-for-beginners-1-filesv/",
        "teaser": null
      },{
        "title": "CSV ファイルから JSON ファイルへの変換",
        "excerpt":"このチュートリアルは、Oracle Integration Cloud の FTP アダプタを使用して、ファイル・サーバーにアップロードされた CSV ファイルを読み取り、JSON ファイルに変換して、再びファイル・サーバーにアップロードする手順を説明します。 前提条件 このチュートリアルでは、Oracle Integration Cloud のインスタンスが作成されており、サービス・コンソールにログインできることを前提としています。 Oracle Integration Cloud のインスタンスをまだ作成していない場合は、次のページを参考に作成してください。 Oracle Integration Cloud インスタンスの作成 Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。 この文書は OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介するチュートリアルです。 また、Oracle Integration Cloud が提供している SFTP ファイル・サーバーを使用します。 Oracle Integration Cloud のファイル・サーバーは、次のページの手順にしたがって有効化する必要があります。 Oracle Integration Cloud チュートリアル - ファイル・サーバーの有効化 このチュートリアルは、Oracle Integration Cloud が提供する...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/app-integration-for-beginners-2-csvjson/",
        "teaser": null
      },{
        "title": "SFDCからアウトバンドメッセージを受信する",
        "excerpt":"このチュートリアルは、Salesforce(SFDC)側で新規商談(Opportunity)が登録されたら、SFDCのアウトバウンドメッセージが送信され、OIC の統合が起動される一連の動作を確認します。 このハンズオンを通じて、以下のポイントを理解することができます。 SFDC アダプターの実装方法 SFDC アダプター経由で SFDC アウトバンドメッセージを受信する方法 アプリケーション主導のオーケストレーションの実装 ロガーによるログ出力方法 前提条件 バージョン このハンズオンの内容は、Oracle Integration 21.2.3.0.0 (210505.1400.40951) 時点の内容で作成されています。最新の UI とは異なっている場合があります。最新情報については、製品マニュアルをご参照ください。 Oracle Integration https://docs.oracle.com/en/cloud/paas/integration-cloud/books.html https://docs.oracle.com/cd/E83857_01/paas/integration-cloud/books.html (日本語翻訳版) インスタンスの作成 Oracle Integration インスタンスの作成済であること。OIC インスタンスの作成方法は、以下の製品マニュアルや日本語チュートリアルをご確認ください。 OIC インスタンスを作成する(Oracle Integration チュートリアル) Provisioning and Administering Oracle Integration and Oracle Integration for SaaS, Generation 2 https://docs.oracle.com/en/cloud/paas/integration-cloud/oracle-integration-oci/index.html https://docs.oracle.com/cd/E83857_01/paas/integration-cloud/oracle-integration-oci/index.html (日本語翻訳版) 事前準備...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/app-integration-for-beginners-3-sfdc/",
        "teaser": null
      },{
        "title": "Oracle Integration - Process で簡単なワークフローを作成してみよう",
        "excerpt":"Oracle Integration(OIC) のプロセス自動化 (Process Automation) 機能を利用して、簡単なワークフローの作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 ここでは、従業員が休暇取得の申請を提出し、その上司が申請内容を承認 or 却下するシンプルな休暇申請ワークフローを作成します。 前提条件 Oracle Integration Cloud インスタンスの作成 が完了していること Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。 この文書は OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介するチュートリアルです。 OIC インスタンス作成時のエディションが ENTERPRISE であること OIC インスタンスの ServiceAdministrator ロールが付与されたユーザーが準備されていること (参考) Oracle Integration Roles and Privileges https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34 Process Automation で簡単なワークフローを作成する OIC インスタンスにアクセスする Web ブラウザを開き、提供された OIC インスタンスのURLを入力します。もしくはOCIのコンソールから「開発者サービス」－「アプケーション統合」から作成済みのOICインスタンスを選択し、「サービス・コンソール」からOICコンソールを開きます。 TIPS OCIにログインしていない場合はユーザー名とパスワードを入力し、サイン・インをクリックします。 OIC...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/process-for-beginners-1-wf/",
        "teaser": null
      },{
        "title": "Oracle Integration - Process でデシジョン・モデルを作成してみよう",
        "excerpt":"Oracle Integration(OIC) のプロセス自動化 (Process Automation) 機能を利用して、簡単なデシジョン・モデル(Decision Model)の作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 ここでは、気温と降水確率を入力パラメータとして、外出時の持ち物を判断するデシジョンモデル(What to Bring)を作成します。 前提条件 Oracle Integration Cloud インスタンスの作成 Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。この文書は OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介するチュートリアルです。 OIC インスタンス作成時のエディションが ENTERPRISE であること OIC インスタンスの ServiceAdministrator ロールが付与されたユーザーが準備されていること (参考) Oracle Integration Roles and Privileges https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34 Process Automation で簡単なデシジョン・モデルを作成する 説明 デシジョン・モデルとは、プロセスの中で利用するデシジョン（判断）を自動化する仕組み・ルールです。例えば、以下のようなものが考えられます。 購買稟議申請の合計金額が100万円未満の場合は部門長承認が必要、100万円を超える場合は部門長および担当役員の承認が必要 従業員の年次有給休暇の付与日数を、従業員の役職、勤務地、勤続年数から自動計算する このチュートリアルでは、気温と降水確率から外出時の持ち物をデシジョン（判断）するデシジョン・モデルを作成します。 今回作成するデシジョンロジックは以下の通りです。 条件 アクション 暖かい、かつ、雨が降る 傘...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/process-for-beginners-2-dmodel/",
        "teaser": null
      },{
        "title": "Oracle Integration - Visual Builder で簡単なWebアプリケーションを作成してみよう",
        "excerpt":"Visual Builder Cloud Service　(VBCS) は、ユーザー・インタフェース(UI)・コンポーネントをページにドラッグ＆ドロップするだけで、Webアプリケーションやモバイル・アプリケーションを作成するためのビジュアル開発ツールです。 ボタンをクリックしてビジネス・オブジェクトを作成し、アプリケーションにCSVファイルをインポートしてデータを追加することができます。 このチュートリアルでは、部門と従業員のレコードを参照および作成、編集、削除するアプリケーションを作成します。 TIPS VBCSは単体でサービスをご利用することが可能ですが、Integration Cloud Serviceの一機能としてもご利用可能です。どちらも機能としては同じですが課金体系が異なります。詳細は以下のリンクをご確認ください。 ・ Integration Cloud Service 価格 (※VBCSの利用に関しては1時間当たりのアクティブユーザー数に対して課金が発生します。詳しくはこちら) ・ Visual Builder Cloud Service 価格 前提条件 Oracle Integration Cloud インスタンスの作成 Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。この文書は OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介するチュートリアルです。 OIC インスタンスの ServiceAdministrator ロールが付与されたユーザーが準備されていること (参考) Oracle Integration Roles and Privileges https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34 Webアプリケーションの作成 このパートでは、VBCSで Web アプリケーションを作成する際に、最初に定義する...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/vbcs-for-beginners-1/",
        "teaser": null
      },{
        "title": "Oracle Integration - Visual Builder Studio でVBCSアプリケーションを管理してみよう",
        "excerpt":"Visual Builder Studio(VBS)はプロジェクトのアジャイル開発、コラボレーション開発、ソースコード管理、CICDをサポートする機能を提供するPaaSサービスです。VBSはVisual Biulder Cloud Service(VBCS)アプリケーションのプロジェクト管理する機能があり、VBSで管理することによってビジュアル・アプリケーションのバージョン管理、issue管理、チーム開発をサポートすることができます。 このチュートリアルでは、VBSを使ってVBCSプロジェクトを作成し、簡単なアプリケーションを作成してマージリクエストの承認をトリガーに更新する手順を学習します。 Visual Builder Studioについて VBSはOracle Cloud Infrastructure(OCI)契約者様は無償でご利用可能です。VBSにはデフォルトでGit Repository、Wikiのメタデータ用に20 GBのストレージが含まれています。尚、ビルドジョブの機能を利用する際は処理を実行するビルド用インスタンスに対して別途課金が発生します。詳細はこちらをご確認ください。 前提条件 Oracle Integration Cloud インスタンスの作成 が完了している、またはVBCSのインスタンスが作成出来ていること。 (OICのVBCSを利用する場合) ServiceAdministrator ロールが付与されたユーザーが準備されていること (参考) Oracle Integration Roles and Privileges https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34 0.事前準備 まずはじめにVBSで利用するコンパートメントの作成をします。 Visual Builder Studio用コンパートメントの作成 コンパートメントについて Oracle Cloudにはコンパートメントという考え方があります。 コンパートメントは、クラウド・リソース(インスタンス、仮想クラウド・ネットワーク、ブロック・ボリュームなど)を分類整理する論理的な区画で、この単位でアクセス制御を行うことができます。また、OCIコンソール上に表示されるリソースのフィルタとしても機能します。 まず初めに、後ほど実施するVisual Builder Studioのセットアップで利用するコンパートメントを作成します。 OCIコンソールにログインします。 ハンバーガーメニューの”アイデンティティとセキュリティ”⇒”コンパートメント”をクリックします。 “コンパートメントの作成”をクリックします。 以下の情報を入力します。 key value 名前...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/vbcs-for-beginners-2-vbs/",
        "teaser": null
      },{
        "title": "REST APIで取得したデータを一覧表示する",
        "excerpt":"Visual Builder Cloud Service　(VBCS) は、ユーザー・インタフェース(UI)・コンポーネントをページにドラッグ＆ドロップするだけで、Webアプリケーションやモバイル・アプリケーションを作成するためのビジュアル開発ツールです。 このチュートリアルは、REST APIで取得したデータをVBCSアプリケーションで表形式で一覧表示する手順について説明します。 前提条件 Oracle Integration Cloud インスタンスの作成 Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。この文書は OIC インスタンスの作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 OIC インスタンスの ServiceAdministrator ロールが付与されたユーザーが準備されていること (参考) Oracle Integration Roles and Privileges https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34 RESAS APIの利用登録が完了し、API KEYを取得していること 登録はこちら Webアプリケーションの作成 このパートでは、VBCSで Web アプリケーションを作成する際に、最初に定義する ビジュアル・アプリケーション と Web アプリケーション を作成する手順を説明します。 ビジュアル・アプリケーションの作成 VBCSでは、最初に ビジュアル・アプリケーション を作成します。 ビジュアル・アプリケーションは、Web アプリケーションやモバイル・アプリケーションを開発するために使用するリソースの集まりです。 アプリケーションのソース・ファイルや、メタデータが記述された JSON...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/vbcs-for-beginners-3-rest/",
        "teaser": null
      },{
        "title": "ビジネス・オブジェクトのデータを折れ線グラフで表示する",
        "excerpt":"Visual Builder Cloud Service　(VBCS) は、ユーザー・インタフェース(UI)・コンポーネントをページにドラッグ＆ドロップするだけで、Webアプリケーションやモバイル・アプリケーションを作成するためのビジュアル開発ツールです。 ボタンをクリックしてビジネス・オブジェクトを作成し、アプリケーションにCSVファイルをインポートしてデータを追加できます。 このチュートリアルは、インポートしたビジネス・オブジェクトのデータを折れ線グラフで表示する手順について説明します。 前提条件 Oracle Integration Cloud インスタンスの作成 Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。この文書は OIC インスタンスの作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 OIC インスタンスの ServiceAdministrator ロールが付与されたユーザーが準備されていること (参考) Oracle Integration Roles and Privileges https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34 Webアプリケーションの作成 このパートでは、VBCSで Web アプリケーションを作成する際に、最初に定義する ビジュアル・アプリケーション と Web アプリケーション を作成する手順を説明します。 ビジュアル・アプリケーションの作成 VBCSでは、最初に ビジュアル・アプリケーション を作成します。 ビジュアル・アプリケーションは、Web アプリケーションやモバイル・アプリケーションを開発するために使用するリソースの集まりです。 アプリケーションのソース・ファイルや、メタデータが記述された JSON ファイルを含んでいます。 Web ブラウザを開き、提供された OIC...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/vbcs-for-beginners-4-linechart/",
        "teaser": null
      },{
        "title": "モニタリング機能でOCIのリソースを監視する",
        "excerpt":"システムを運用する際にはアプリケーションやシステムの状態に異常がないかを監視して問題がある場合には対処をすることでシステムの性能や可用性を高めることが可能です。 OCIで提供されているモニタリング機能を使うことで、OCI上の各種リソースの性能や状態の監視、また、カスタムのメトリック監視を行うことが可能です。また、アラームで事前定義した条件に合致した際には管理者に通知を行うことで管理者はタイムリーに適切な対処を行うことができます。 コンピュートやブロックボリュームなどのOCIリソースに対してはモニタリングはデフォルトで有効になっています。 この章では、コンピュート・インスタンスを対象にして性能メトリックの参照の方法を理解し、問題が発生した場合のアラーム通知設定を行って管理者へのメール通知を行います。 所要時間 : 約30分 前提条件 : インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を通じてコンピュート・インスタンスの作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. ベースになるインスタンスの作成 まずは、監視対象となるインスタンスを作成します。今回は、インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) で作成したコンピュート・インスタンスを使用します。 ただし、Oracle提供イメージを使い、モニタリングの有効化を行っているインスタンスのみが対象です（デフォルトは有効）。 インスタンス作成時には、作成画面下部の 拡張オプションの表示 をクリックしてオプションを表示させ、Oracle Cloudエージェント→コンピュート・インスタンスのモニタリング のチェックボックスにチェックが入っていることを確認してください。 2. モニタリング・メトリックの参照（各リソースの詳細画面からの参照） 作成済みのコンピュート・インスタンスの詳細ページから、メトリックを参照することができます。 コンソールメニューから コンピュート → インスタンス を選択し、作成したインスタンスのインスタンス名のリンクをクリックするか、右側のメニューから インスタンスの詳細の表示 を選択し、インスタンス詳細画面を開きます。 画面左下の リソース から メトリック...","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/monitoring-resources/",
        "teaser": "/ocitutorials/intermediates/monitoring-resources/image-20210112132107310.png"
      },{
        "title": "ロードバランサーでWebサーバーを負荷分散する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure ロードバランサー・サービスを利用することにより、仮想クラウド・ネットワーク(VCN)内の複数のサーバーに対して一つのエントリーポイントからのネットワーク・トラフィックを分散させることができます。ロードバランサー・サービスは、パブリックIPアドレスの分散を行うパブリック・ロードバランサーと、プライベートIPアドレスの分散を行うプライベート・ロードバランサーの2種類が提供されます。双方のタイプのロードバランサーとも、一定の帯域(100MB/s~8000MB/s)の保証と、高可用性がデフォルトで提供されます。またパブリック・ロードバランサーについてはVCN内の2つの異なるサブネットに跨って構成されるため、アベイラビリティ・ドメイン全体の障害に対する耐障害性が提供されます。 この章では、シンプルなパブリック・ロードバランサーを構成し、VNC内の2台のWebサーバーに対する負荷分散を構成する手順について学習します。 所要時間 : 約50分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること 2048bit 以上のRSA鍵ペアを作成していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 : 仮想クラウド・ネットワークとサブネットの作成 2つのインスタンスの作成とWebサーバーの起動 ロードバランサー用のサブネットの作成 ロードバランサーの構成 ロードバランサーへのhttp通信許可の設定 ロードバランサーの動作の確認 Webサーバーの保護 1. 仮想クラウド・ネットワークとサブネットの作成 その2 - クラウドに仮想ネットワーク(VCN)を作る を完了していない場合、チュートリアルに従って仮想クラウド・ネットワーク(VCN)および付随するネットワーク・コンポーネントを作成してください。VCNウィザードで提供される インターネット接続性を持つVCNの作成オプションで、今回のチュートリアルに必要なVCNおよび付随コンポーネントを簡単に作成することができます。 この章では、Tokyoリージョン (可用性ドメインが1つの構成) を例として、最終的に下記のような構成を作成します。 2. 2つのインスタンスの作成とWebサーバーの起動...","categories": [],
        "tags": ["intermediate","network"],
        "url": "/ocitutorials/intermediates/using-load-balancer/",
        "teaser": "/ocitutorials/intermediates/using-load-balancer/img1.png"
      },{
        "title": "インスタンスのオートスケーリングを設定する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル アプリケーションの負荷に応じて自動的にコンピュート・リソースの増減ができれば、必要な時に必要な分だけのリソースを確保し、コストの最適化にもつながります。これを実現するための手法として、OCIではインスタンス・プールのオートスケーリング設定によって、負荷に応じてインスタンス・プール内のインスタンス数を増減させることが可能です。 このチュートリアルでは、オートスケーリングの設定を行って、実際にインスタンス数がどのように変化するかを確認します。 所要時間 : 約30分 前提条件 : その3 - インスタンスを作成する を通じてコンピュート・インスタンスの作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 今回の設定作業手順の流れは以下の図の1～4です。 目次： 1. ベースになるインスタンスの作成 2. インスタンス・コンフィグレーションの作成 3. インスタンス・プールの作成 4. オートスケーリングの設定 5. CPU負荷をかけてインスタンス増減を確認 1. ベースになるインスタンスの作成 まずは、オートスケーリングの設定を行うインスタンス・プールのもとになるインスタンスを作成します。今回は、その3 - インスタンスを作成する で作成したコンピュート・インスタンスを使用します。 2. インスタンス・コンフィグレーションの作成 ベースになるインスタンスからインスタンス構成 (=インスタンス・コンフィグレーション) を生成します。インスタンス構成とは、インスタンス起動を行うための「イメージ、シェイプ、メタデータ情報（sshキー、起動時スクリプトなど）、関連リソース（ブロック・ボリューム、ネットワーク構成）」をひとまとめにした構成情報の定義です。 コンソールメニューから Compute →...","categories": [],
        "tags": ["intermediate","compute"],
        "url": "/ocitutorials/intermediates/autoscaling/",
        "teaser": "/ocitutorials/intermediates/autoscaling/img5.png"
      },{
        "title": "ブロック・ボリュームをバックアップする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル 運用管理を行う上で、データのバックアップは重要です。Oracle Cloud Infrastructure ブロック・ボリューム・サービスでは、バックアップ・リストアやクローン、別のリージョンへのバックアップのコピーなどを行うことができます。また、基本的にブロック・ボリュームでもブート・ボリュームでも同様の機能が提供されています。 ブロック・ボリューム自体は可用性ドメイン固有のリソースですが、バックアップを取得することで別の可用性ドメインにリストアしたり、別のリージョンにコピーして利用することが可能となります。 ブロック・ボリュームのバックアップ機能はPoint-in-timeのスナップショットで、内部的にはオブジェクト・ストレージの領域にバックアップが行われます。 データの保護要件や可用性要件に応じて適切な手法でバックアップを取得し、安全に運用を行いましょう。 バックアップの概要 所要時間 : 約20分 前提条件 : チュートリアル入門編 :その4 - ブロック・ボリュームをインスタンスにアタッチする を完了し、ブロック・ボリュームを作成済みであること。 トライアル環境ではホームリージョン以外のリージョンの利用ができません。バックアップを別リージョンにコピーするためには有償環境で、該当のリージョンをサブスクライブする必要があります。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. ブロック・ボリュームの手動バックアップの作成 2. ブロック・ボリュームのバックアップからのリストア 3. リージョン間でのブロック・ボリュームのバックアップのコピー 4. ブロック・ボリュームのバックアップ・ポリシーの作成 5. ボリューム・グループの作成と管理 1. ブロック・ボリュームの手動バックアップの作成 まずは既存のブロック・ボリュームのバックアップを手動で取得してみましょう。今回は、チュートリアル :ブロック・ボリュームをインスタンスにアタッチする - Oracle Cloud...","categories": [],
        "tags": ["intermediate","block volume"],
        "url": "/ocitutorials/intermediates/taking-block-volume-backups/",
        "teaser": "/ocitutorials/intermediates/taking-block-volume-backups/img6.png"
      },{
        "title": "オブジェクト・ストレージの高度な設定",
        "excerpt":"オブジェクト・ストレージは非構造化データを格納するのに優れたストレージサービスであり、3種類の層から構成されています。ライフサイクル・ポリシーを設定して、自動でオブジェクトの削除や層を変更したり他リージョンにオブジェクトのコピーやレプリケーションの設定を行う等さまざまな機能があります。 この章ではIAMポリシーを設定してから、事前認証済みリクエスト以外のオブジェクト・ストレージで利用できる機能の設定を行います。 チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル 所要時間：　約30分 前提条件： その7 - オブジェクト・ストレージを使うが完了していること 2つのリージョン使用してレプリケーションとオブジェクトのコピーを行うので有償環境である必要があります。 コマンドライン(CLI)でOCIを操作するが完了していること 注意: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 前提条件2はレプリケーションとオブジェクトのコピーを行う場合に必要となります 前提条件3はマルチパート・アップロードを使用する場合に必要となります 目次 : IAMポリシーの設定 ライフサイクル・ポリシーの設定 レプリケーションの設定 オブジェクトのコピー 保持ルールの設定 (参考)マルチパート・アップロード 1. IAMポリシーの設定 今回のチュートリアルで設定するライフサイクル・ポリシー、レプリケーションそしてオブジェクトのコピーを作成する際は、ユーザがバケットやオブジェクトを操作する権限を持つ以外に、リージョンごとにユーザーに代わってオブジェクト・ストレージのサービス自身がバケットやオブジェクトを操作するためのサービス権限を設定する必要があります。サービス権限はソース・リージョンと宛先リージョンの両方に設定する必要があります。 左上のメニューから アイデンティティとセキュリティ → ポリシー を選択します。 そして ポリシーの作成 ボタンを押します。 名前 - 任意（このチュートリアルではtutorial_objectstorageとします） 説明 - 任意（このチュートリアルではチュートリアル用とします） コンパートメント　- コンパートメントを選択します ポリシー・ビルダー Allow...","categories": [],
        "tags": ["intermediate","object-storage"],
        "url": "/ocitutorials/intermediates/object-storage-advanced/",
        "teaser": "/ocitutorials/intermediates/object-storage-advanced/img11.png"
      },{
        "title": "DNSサービスを使ってWebサーバーの名前解決をする",
        "excerpt":"Oracle Cloud Infrastructure の DNSサービスを利用すると、独自のドメイン名でインターネット向けサービスが運用できるようになります。 OCIのDNSは、長年にわたり実績のある Dyn.com のグローバルDNSサービスを利用しています。(DynはOracleグループの一員です) これによりユーザーは、低遅延、高パフォーマンスで、耐障害性のあるDNSサービスをクラウドで利用できるようになります。 名前解決を行う対象は、Oracle Cloud Infrastructure 上のサーバーに限らず、他のクラウドやオンプレミスのサーバーに対しても可能です。 またDyn.comのDNSの特長として、プライマリDNSとしてだけでなく、既に稼働中のDNSにセカンダリとして追加し、サービス全体の耐障害性を高めたりクライアントからの応答時間を短縮したりすることもできます。 このチュートリアルでは、作成済みのロードバランサー(またはWebサーバー)が持つグローバルIPアドレスに対して、取得済みのドメイン名に対する名前解決を行うDNSレコードを作成して、インターネットからアクセスを行います。またその手順を通してOCIのDNSサービスについて理解を深めます。 所要時間 : 約20分 前提条件 : Webサーバー(とロード・バランサ:オプション)が構成されて、グローバルIPアドレスにインターネットからアクセスできるようになっていること (もし作業が未実施の場合は、チュートリアル 応用編 - ロード・バランサでWebサーバーを負荷分散する の手順を実施してください) ドメイン名の取得サービスから、独自のドメイン名を取得していること 今回の手順の作成にあたっては、freenom というドメイン取得サービスを利用して予め取得した ocitutorials.tk という無料のドメイン名を利用しています。 freenomはOracleとは無関係のサービスでありOracleはこのサービスの利用を推奨するものではありません。 もちろん、他のドメイン取得サービスから取得したドメイン名であっても問題なくチュートリアルをご実施頂けますが、その際は一部作業をドメイン名を取得したサービス側で実施する必要がありますので、適宜読み替えてご実施ください。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. Oracle Cloud Infrastructure でのDNSの設定 1-1.DNSゾーンの追加 最初に、Oracle Cloud Infrastructure のコンソールから、取得済みのドメインをDNSゾーンとして追加する作業を行います。...","categories": [],
        "tags": ["intermediate","network"],
        "url": "/ocitutorials/intermediates/using-dns/",
        "teaser": "/ocitutorials/intermediates/using-dns/image10.png"
      },{
        "title": "プライベートDNSを使って名前解決をする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル OCIではプライベートDNSが使用可能で独自のプライベートDNSドメイン名を使用し、関連付けられたゾーンおよびレコードを管理して、VCN内またはVCN間で実行されているアプリケーションなどのホスト名で名前解決を行えます。 プライベートDNSのゾーン、クエリ、およびリゾルバーエンドポイントは無料です。 ※無料トライアル環境ではプライベートDNSビューの作成はできないのでご注意ください。 所要時間 : 約30分 前提条件 : Oracle Cloud Infrastructure で、作成済みのVCNおよびLinuxインスタンスがあること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 1. PrivateDNSとは？ 概要 プライベートDNSはVCNの名前解決を行います。 VCNを作る際にDHCPオプションをオンにしていると、デフォルトでプライベートビューとプライベートDNSゾーンがあり、インスタンスを作成したときに「*.oraclevcn.com」というFQDNが割り当てられています。 DNSリゾルバは問い合わせを受けるとビュー、ゾーン、転送ルール、インターネットDNSの順に応答を返します。 今回のチュートリアルでは新たにDNSゾーンを作成し、「aoyama.com」という任意のドメイン名を付けて名前解決を行います。 用語説明 DNSゾーンレコード : DNSに定義するレコード。AレコードにはIPアドレスとホスト名の関連付けを定義する。Aレコード以外も定義可能。 プライベートDNSゾーン : hogehoge.comなど、ユーザーが定義した任意のドメイン名に属するレコードの集合。VCN内のプライベートIPなどVCN内のリソースを定義できる。 プライベートDNSビュー : プライベートDNSゾーン情報をまとめたもの。 プライベートDNSリゾルバ : DNSクエリに対して名前解決を行う仕組み。デフォルトではVCNのプライベートDNSビューだけだが、他の同リージョンのプライベートDNSビュー、他リージョンのプライベートDNSやオンプレミスのDNSと連携できる。 ポリシーの付与 必要なIAMポリシー 管理者グループ内のユーザーの場合、必要な権限を持っています。ユーザーが管理者グループに属していない場合、次のようなポリシーにより、特定のグループがプライベートDNSを管理できます。 Allow group...","categories": [],
        "tags": ["intermediate","network"],
        "url": "/ocitutorials/intermediates/private-dns/",
        "teaser": "/ocitutorials/intermediates/private-dns/04.png"
      },{
        "title": "プライベート認証局と証明書の発行",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル OCIの証明書サービスではプライベート認証局（CA）を立てて証明書を簡単に管理することができます。またVaultサービスと組み合わせることで証明書の更新に必要な秘密鍵の管理も手軽にできます。 今回のチュートリアルでは認証局を立てて証明書を発行をします。 所要時間 : 約30分 前提条件 : 管理者権限を持つユーザーであること。 空のオブジェクトストレージを作成していること。 (任意) ロードバランサーでWebサーバーを負荷分散する - Oracle Cloud Infrastructureアドバンスド が完了していること。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 1. 認証局と証明書とは？ 概要 認証局について 公開鍵とその所有者を証明するための「電子証明書」を発行する機関です。認証局も信頼できる認証局であることを証明するために、より上位の認証局によって認証され、最上位の認証局をルート認証局(ルートCA)と呼びます。また、認証局にはプライベート認証局とパブリック認証局の二種類があり、OCIの証明書サービスではプライベート認証局を作成することができます。 証明書について 鍵の所有者を証明する証です。サーバー証明書、クライアント証明書、ルート証明書などがあります。証明書はTLS/SSL通信にて、相手が正当な所有者であることを確認する際や、通信を暗号化する際に利用されます。この相手が正当な通信相手であることを確認する手段として公開鍵認証基盤(PKI)があります。 以下に今回作成する証明書サービスです。 2. 事前準備 証明書サービスを利用する際は、ユーザーが証明書サービスを扱う権限に加えて、証明書サービス自体がVaultサービスやオブジェクトストレージを利用する権限が必要になります。ここでは証明書サービスを動的グループに属させ、その動的グループに権限を付与していきます。 動的グループとポリシーの作成 コンソール画面→[アイデンティティとセキュリティ]→[動的グループ]→動的グループの作成 動的グループの作成 名前：任意(例：CertificateAuthority-DG など) 説明：任意 一致ルール：下で定義したいずれかのルールに一致 or 下で定義したすべてのルールに一致 ：どちらでも可...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/intermediates/certificate/",
        "teaser": "/ocitutorials/intermediates/certificate/01.png"
      },{
        "title": "Email Deliveryを利用した外部へのメール送信(基礎編)",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル OCIのEmail Deliveryサービスを使用することにより、電子メールを受信者へ簡単に一括配信できます。またSPFやDKIMを設定をすることにより、送信元を偽装するなりすましメールを対策して、メールの到達可能性を向上させることができます。 今回のチュートリアルではSMTP認証を設定してMailxでメールを送信します。 所要時間：　約40分 前提条件： その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること その3 - インスタンスを作成する（今回のチュートリアルではOracle Linuxインスタンス7.9を使用しています） Javaがインストールされていること（今回のチュートリアルではJava 17で実施しています） Eclipse IDEがインストールされていて使用できる状態であること（今回のチュートリアルではEclipse 2021で実施しています） 注意: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 前提条件の3,4はJavaMailからメール送信を行う際に必要になります 1.　電子メールの概要 電子メールを送信すると、送信者側のメールサーバー、相手側のメールサーバーを経由して受信者にメールが届きます。メールを送信してから受信者のメールサーバーに届くまでの通信にSMTPのプロトコルが使用されています。 電子メールは「メールヘッダ」、「エンべロープ」そして「メール本文」の3つから構成されています。GmailやOutlook等のメールソフトでメールを送受信する際に送信元や宛先等が見えるかと思いますが、これはメールヘッダに当たります。実際にSMTPサーバーが利用するのはメールヘッダの情報ではなくエンベロープの情報になります。ヘッダー情報とエンベロープ情報が違ってもメールを送信できることから、ヘッダーを偽造してなりすましメールを送ることができてしまいます。 このようななりすましメールを対策するために今回の基礎編のチュートリアルSMTP認証を、そして応用編ではSPFとDKIMの設定をします。 SMTP認証 - メール送信者がユーザーであるかを確認する認証方法です。メールを送信する際にユーザー名とパスワードがないと送れないシステムになります。 SPF - 送信ドメイン認証の1つで、事前に送信側のメールサーバーのIPアドレスもしくはSPFレコードをDNSサーバーに登録しておきます。そしてメールが送信された際に受信サーバーはDNSサーバーに対して送信元ドメインに対するSPFレコードを問い合わせして、返ってきたSPFレコードと送信元IPアドレスが一致するか確認します。そして情報が一致した時のみ受信者にメールが届きます。 DKIM - 送信ドメイン認証の1つで、DKIMでは電子署名を使用します。DNSサーバー側には公開鍵を公開しておきます。メールを送信する際にメールのヘッダとボディの情報の電子署名を追加しておきます。受信者のメールサーバーはDNSから公開鍵を入手して公開鍵で電子署名を検証します。検証が成功すれば受信者にメールが送られます。 2. SMTP資格証明の生成 Email Deliveryサービスを使用するにはSMTP資格証明書の設定が必要になります。各ユーザー最大2つまで設定することができて、3つ以上作成する場合はユーザーを追加する必要があります。 コンソールの右上にある人のマークをクリックして、ユーザー設定 を選択します。 するとユーザーの詳細画面が表示されるので、スクロールして左下の SMTP資格証明...","categories": [],
        "tags": ["intermediate","email"],
        "url": "/ocitutorials/intermediates/sending-emails-1/",
        "teaser": "/ocitutorials/intermediates/sending-emails-1/img1.png"
      },{
        "title": "Email Deliveryを利用した外部へのメール送信(応用編)",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル このチュートリアルはEmail Deliveryを利用した外部へのメール送信(基礎編)の続きになります。 基礎編ではSMTP認証を使用しました。しかしそれだけではなりすましメールとみなされてしまう可能性があります。応用編ではSPFとDKIMの設定を行いメールの到達可能性を高めます。 所要時間：　約20分 前提条件： DNSサービスを使ってWebサーバーの名前解決をするが完了していること Email Deliveryを利用した外部へのメール送信(基礎編)が完了していること 注意: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 1. SPFの設定 SPFを設定するには、SPFレコードを既存のDNSサーバーにTXT形式で実装します。 SPFを確認します。左上のメニューから 開発者サービス → 電子メール配信 をクリックして、左側にある Approved Senders を押します。 そして作成した承認済送信者の右側にあるメニューから SPFの表示 ボタンを押します。 今回は東京リージョンで実施しているためアジア太平洋のSPFレコードを使用します。後で使用するためテキストエディタ等にメモしておきます。そして　閉じる のボタンを押します。 DNSサーバーにSPFレコードの情報を実装します。ネットワーキング → ゾーン をクリックします。そしてすでに作成されているDNSゾーンをクリックします。今回のチュートリアルでは tutorials1.ml のDNSドメインを使用します。 作成されているDNSサーバーをクリックすると、詳細画面が表示されます。少しスクロールして左側にある レコード　を押します。すると一覧のレコードが表示されます。 レコードの追加を行います。 レコード型　-　TEXT -　テキスト 名前　- 空白 TTL　- 空白 Rdataモード　-...","categories": [],
        "tags": ["intermediate","email"],
        "url": "/ocitutorials/intermediates/sending-emails-2/",
        "teaser": "/ocitutorials/intermediates/sending-emails-2/img2.png"
      },{
        "title": "シリアル・コンソールでsshできないインスタンスのトラブルシュートをする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure でLinuxインスタンスを作成するとデフォルトで sshd が起動し外部からsshでアクセスできるようになります。普通はこのsshで大抵の処理を行うことができますが、ごくたまにsshできない環境からアクセスが必要だったり、あるいはできていたsshが突然できなくなってしまったといった場合があります。そんなアクセスできないトラブル発生時に、コンソール・アクセスが有効な手段になる場合があります。 このチュートリアルでは、Oracle Cloud Infrastructure のインスタンスに対してシリアル・コンソールやVNCコンソールを通じてアクセスする方法を学習します。 また、今回はクライアントにWindows PCを利用します。Mac OS または Linux クライアントからのアクセスについては、マニュアルなどの別ドキュメントを参照してください。 所要時間 : 約20分 前提条件 : Oracle Cloud Infrastructure で、作成済みのLinuxインスタンスがあること コンソール・アクセスの認証に使用するSSH鍵ペアを作成済なこと 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 : はじめに シリアル・コンソールが有効なケースの整理 アクセス元クライアントの準備 インスタンスでのコンソール接続許可の作成 シリアル・コンソール接続文字列の取得 インスタンスのシリアル・コンソールに接続 シリアル・コンソールを使ってメンテナンス・モードでブートする メンテナンス・モードでシステム設定ファイルを編集する インスタンスのssh鍵を再登録してアクセスを回復する...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/intermediates/accessing-serial-console/",
        "teaser": "/ocitutorials/intermediates/accessing-serial-console/img1-3.png"
      },{
        "title": "インスタンスにセカンダリIPを付与する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastrcuture では、インスタンスを作成すると、初期状態で所属するサブネットの中からプライベートIPアドレスが一つ(=プライマリ・プライベートIP)割り当てられています。(DHCPで自動割当したり、固定IPを割り振ることができます) もし、インスタンスに複数のIPアドレスをアサインしたいような場合には、セカンダリのプライベートIPアドレスをインスタンスに割り当てて利用することができるようになります。この項ではその手順について学習します。 所要時間 : 約20分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること その3 - インスタンスを作成する を通じてインスタンスをひとつ作成していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. はじめに - セカンダリ・プライベートIPアドレスに関する理解 2. セカンダリ・プライベートIPアドレスのアサイン 3. OS上でセカンダリIPアドレスを登録 4. 他インスタンスからセカンダリ・プライベートIPアドレスにアクセス 5. OSのIPアドレス登録の永続化 1. はじめに - セカンダリ・プライベートIPアドレスに関する理解 セカンダリ・プライベートIPアドレスは、インスタンスの仮想NICに対してプライマリのIPアドレスとは別のIPアドレスをアサインする機能です。この機能によって、複数のIPアドレスを単一のネットワーク・インタフェースに対して割り振る、いわいるIPエイリアス機能が使えるようになります。 ネットワーク・インタフェース(仮想NIC)は同一ですので、セカンダリ・プライベートIPアドレスに割り振ることができるのは、プライマリのプライベート・IPアドレスと同じサブネットに属するIPアドレスであることにご注意ください。...","categories": [],
        "tags": ["intermediate","networking"],
        "url": "/ocitutorials/intermediates/attaching-secondary-ips/",
        "teaser": "/ocitutorials/intermediates/attaching-secondary-ips/img3.png"
      },{
        "title": "コマンドライン(CLI)でOCIを操作する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル これまでのチュートリアルでは、Oracle Cloud Infrastructure(OCI) をコンソールを通して利用してきましたが、OCIにはこれらの操作をRESTfulなウェブサービスを通して実行するためのAPIと、それを呼び出す **コマンド・ライン・インタフェース(CLI) ** が用意されています。 この章では、手元の Windows PC 環境にCLIをインストールしてOCIの基本的な操作を行う手順を通じて、APIとCLIの動作について理解を深めます。 また、セットアップしたCLIとBash環境を利用して、クラウド上に効率的にネットワークやインスタンスを作成する方法について学習します。 所要時間 : 約50分 前提条件 : チュートリアル : その1 - OCIコンソールにアクセスして基本を理解する を完了し、Oracle Cloud Infrastructure コンソールにアクセスでき、どこかのコンパートメント (ルート・コンパートメントも可) に対して管理権限を持っていること チュートリアルの その2 から その8 の内容についてひととおり理解していること (チュートリアルの実施することそのものは必須ではありませんが、一度目を通してコンソール上での操作について確認しておくことをお勧めします) 無償トライアル環境のお申込みについては こちら の資料を参照してください。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/intermediates/using-cli/",
        "teaser": "/ocitutorials/intermediates/using-cli/image-20210913161308143.png"
      },{
        "title": "OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する",
        "excerpt":" ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/intermediates/audit-log-analytics/",
        "teaser": "/ocitutorials/management/audit-log-analytics/audit-loganalytics16.png"
      },{
        "title": "OCI Network Firewallを構築する",
        "excerpt":" ","categories": [],
        "tags": ["id-security"],
        "url": "/ocitutorials/intermediates/networkfirewall/",
        "teaser": "/ocitutorials/id-security/networkfirewall/nfw1.png"
      },{
        "title": "OCI Valut (OCI Key Management) でBYOKをする",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/byok-with-vault/",
        "teaser": null
      },{
        "title": "OCI Database Cloud ServiceでDatabase Managementを有効化する",
        "excerpt":" ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/intermediates/dbcs-database-management/",
        "teaser": "/ocitutorials/management/dbcs-database-management/dbmgmt1.png"
      },{
        "title": "Web Application Firewall(WAF)を使ってWebサーバを保護する",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/protecting-web-servers-with-waf/",
        "teaser": null
      },{
        "title": "OCIのDBCSでOperations Insightsを有効化する",
        "excerpt":" ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/intermediates/dbcs_operations_insights/",
        "teaser": "/ocitutorials/management/dbcs_operations_insights/DB_OperationsInsights16.png"
      },{
        "title": "OCI IAM Identity Domainsのドメインの追加とライセンスタイプを変更する",
        "excerpt":" ","categories": [],
        "tags": ["id-security"],
        "url": "/ocitutorials/intermediates/identitydomains-add-domains-license/",
        "teaser": "/ocitutorials/id-security/identitydomains-add-domains-license/identitydomains1.png"
      },{
        "title": "OCI IAM Identity Domains - テナント管理者・一般ユーザーを作成する",
        "excerpt":" ","categories": [],
        "tags": ["id-security"],
        "url": "/ocitutorials/intermediates/identitydomains-admin-users/",
        "teaser": "/ocitutorials/id-security/identitydomains-admin-users/users7.png"
      },{
        "title": "Logging AnalyticsでAutonomous Databaseのログを収集する",
        "excerpt":" ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/intermediates/logginganalytics_adb_log/",
        "teaser": "/ocitutorials/management/logginganalytics_adb_log/img1.png"
      },{
        "title": "カスタム・パーサーを作成してOCI Logging Analyticsで未対応のログを分析する",
        "excerpt":" ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/intermediates/logginganalytics_customparser/",
        "teaser": "/ocitutorials/management/logginganalytics_customparser/LA_customparser5.png"
      },{
        "title": "Oracle Management Cloud チュートリアルまとめ",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/management-cloud-tutorials/",
        "teaser": null
      },{
        "title": "Prometheus Node Exporterを利用した管理エージェントによるインスタンスのメトリック収集",
        "excerpt":" ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/intermediates/monitoring_prometheus/",
        "teaser": "/ocitutorials/management/monitoring_prometheus/prom1.png"
      },{
        "title": "Cloud Guardを使ってみる",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/cloud-guard/",
        "teaser": null
      },{
        "title": "Oracle Data Safe チュートリアルまとめ",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/data-safe-tutorials/",
        "teaser": null
      },{
        "title": "OCI Database ManagementでOracleDBのパフォーマンス監視をする",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/database-management/",
        "teaser": null
      },{
        "title": "ストレージ・ゲートウェイを作成する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure ストレージ・ゲートウェイ とは、アプリケーションが 標準のNFSv4プロトコルを使用してOracle Cloud Infrastructure オブジェクト・ストレージと相互作用できるようになるサービスです。オンプレミスからのデータ転送、バックアップ、アーカイブ用途などに利用できます。 大容量ファイルについてはマルチパート・アップロードが自動的に適用され、スタンダードなオブジェクト・ストレージだけでなく、アーカイブ・ストレージへのアップロードも可能です。 この章では、Oracle Cloud Infrastructure 上の コンピュート・インスタンスに ストレージ・ゲートウェイを作成する手順について説明していきます。 所要時間 : 約40分 前提条件 : 本チュートリアルの 前提条件 を参照ください 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. ボリュームのフォーマットおよびマウント 2. ストレージ・ゲートウェイのインストール 3. ファイル・システムの作成 4. クライアントから動作確認 構成イメージ 本チュートリアルでは 以下の構成で構築していきます。 ブロック・ボリュームがアタッチされたコンピュート・インスタンス上に...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/intermediates/storage-gateway/",
        "teaser": "/ocitutorials/intermediates/storage-gateway/img01.png"
      },{
        "title": "リソース・マネージャを使ってサンプルアプリケーションをデプロイする",
        "excerpt":"チュートリアル一覧に戻る : 応用編 - Oracle Cloud Infrastructure を使ってみよう Oracle Cloud Infrastructureリソース・マネージャは、OCI上のリソースのプロビジョニング処理を自動化するInfrastructure-as-code （IaC）を実現するサービスです。環境構築を自動化することで迅速にテスト環境や開発環境を作成、削除、変更ができ、こうした環境構築にかかるコストや時間を削減することができます。 仕組みとしてはTerraformを利用していますが、ユーザ自身がTerraform実行環境を用意する必要はなく、リソース・マネージャを使えばManagedなOCI上のサービスとしてTerraformを実行できます。 また、Terraformに慣れていない方はイチからコードを作成するのは大変と感じられるかもしれませんが、リソース・マネージャにはサンプルのスタックも用意されているので、それらを使って簡単にプロビジョニングを行い、学習することも可能です。 このチュートリアルでは、リソース・マネージャにあらかじめ用意されているスタックを使って、サンプルのeコマース・アプリケーションの構成をデプロイしていきます。サンプルのeコマース・アプリケーションを利用する場合は、ホーム・リージョンで操作する必要があります。 以下のような構成がプロビジョニングされます。 また、このサンプル・アプリケーションの説明は、以下のURLを参照してください。 https://github.com/oracle-quickstart/oci-cloudnative/tree/master/deploy/basic 所要時間 : 15分 前提条件 : 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切なリソース・マネージャの管理権限がユーザーに付与されていること 注意 : チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 1. スタックの作成 使用するTerraform構成をOCI上のリソースとして登録したものがスタックです。リソース・マネージャでリソースをプロビジョニングしたりする場合は、まずはスタックを作成する必要があります。 コンソール画面からスタックを作成していきます。 コンソールメニューから 開発者サービス → リソース・マネージャ → スタック を選択し、 スタックの作成 ボタンを押します 立ち上がった スタックの作成 の 1 スタック情報 画面に以下の項目を入力し、左下の 次 ボタンを押します。指定がないものは任意の値でOKです。...","categories": [],
        "tags": ["intermediate","resource-manager"],
        "url": "/ocitutorials/intermediates/resource-manager/",
        "teaser": "/ocitutorials/intermediates/resource-manager/000.png"
      },{
        "title": "TerraformでOCIの構築を自動化する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル terraformは、人間が読める設定ファイルで定義したリソースを自動でプロビジョニング処理するInfrastructure-as-code （IaC）を実現するサービスです。 terraformは複数のクラウドプロバイダを管理できるため、マルチクラウド環境で構築されたシステムなどを、簡単かつ効率的に管理することができます。 このチュートリアルでは、terraformのインストールをして実行環境を用意して簡単なリソースをプロビジョニングしていきます。 所要時間 : 約30分 前提条件 : OCIアカウントがあること MacOS、LinuxまたはWindows環境があること（このチュートリアルではOracle Linux VMを使います。） 操作を行うユーザが全てのリソースを読む権限を持っている事（to read all-resources in tenancy） VCNとサブネットが作成されている事 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 1. Terraformとは？ 概要 IaCについて Infrastructure as Codeはサーバーやネットワークなどのインフラ構成をプログラムのようなコードで記述し、そのコードを用いてインフラ構成の管理やプロビジョニングの自動化を行うこと。 Terraformについて TerraformはHashiCorp社が開発しているオーケストレーションツールの一つ。 インフラストラクチャのライフサイクルを自動化する構成管理ツール。 本チュートリアルではTerraformをインストールして、インスタンスを作成するところまでを行います。 2．Terraform環境の構築 Terraformを実行するための環境を準備します。Oracle Linux8で作成してます。 Terraformのインストール 一時ディレクトリの作成 mkdir temp...","categories": [],
        "tags": ["intermediate","terraform"],
        "url": "/ocitutorials/intermediates/terraform/",
        "teaser": "/ocitutorials/intermediates/terraform/03.png"
      },{
        "title": "ロギング・サービスを使って3つのログを収集する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル ロギング・サービスを使用することによりさまざまなログを一元的に収集して1つのビューにまとめます。なので万が一トラブルが発生しても、ログをすぐに確認し素早く対策できます。 ロギング・サービスは監査ログ、サービス・ログ、カスタム・ログの3つのログを使用できます。ログはOCIのリソースだけでなく、他社クラウドやオンプレミスの環境のログも取得できます。また他のOracleサービスと統合することができて、ログをEmailなどを通じて通知させたり、OCIモニタリングにメトリックを発行してアラームと統合したりすることが可能です。さらにLogging Analyticsを併用することで、よりログを細かく分析できます。 今回のチュートリアルではこの3つのログをコンソールからアクセスします。 所要時間： 15分 前提条件： その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること その3 - インスタンスを作成するが完了していること その7 - オブジェクト・ストレージを使うの コンソール画面の確認とバケットの作成 が完了していること（サービス・ログを使用する際にオブジェクトストレージのログを収集します） 注意: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 目次 : 監査ログ サービス・ログ カスタム・ログ 1. 監査ログ 監査ログはOCI上のAPIコールをデフォルトで収集します。 メニューから 監視および管理 → ロギング を選択すると監査ログのデータが一覧で表示されます。監査ログの詳しい説明に関しては、以下のチュートリアルを参照してください。 監査(Audit)ログを使用したテナント監視 2. サービス・ログ サービス・ログでOCIネイティブ・サービス（APIゲートウェイ、イベント、ファンクション、ロード・バランシング、オブジェクト・ストレージ、VCNフロー・ログなど）のログを取得できます。今回はオブジェクトストレージの読み取りのログデータを収集します。 2-1　ログ・グループの作成 まず初めにログ・グループを作成します。メニューから 監視および管理 →...","categories": [],
        "tags": ["intermediate","logging"],
        "url": "/ocitutorials/intermediates/using-logging/",
        "teaser": "/ocitutorials/intermediates/using-logging/img1.png"
      },{
        "title": "VTAPでパケットをミラーリングし、パケットキャプチャをする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル 仮想テスト・アクセス・ポイント（Virtual Test Access Points, VTAP）を設定すると、コンピュート・インスタンスやロードバランサ―、DBシステムなどのコンポーネントへ流れ込むトラフィックをミラーリングし、リアルタイムでターゲットへ送信することができます。そのトラフィックをフォレンジック分析に用いたり、ネットワークのトラブルシューティングやテストに役立てたりでき、セキュリティの完全性（Integrity）やネットワークの管理性を向上させることができます。 本チュートリアルでは、①サーバにパケットを送信するクライアント、②パケットを受信するサーバ、③VTAPでミラーリングされたパケットを受信するターゲット（ネットワーク・ロードバランサーのバックエンド・インスタンスとして配置する）の役割を持つ3台のコンピュート・インスタンスを構築します。①から②へ流れるICMPパケットやTELNETパケットをVTAPでミラーリングして③に流し、そのパケットをパケットキャプチャツールであるtcpdumpとWiresharkを用いて観察していきます（下図）。 このチュートリアルを通して、クライアント・インスタンスを一つのパブリック・サブネットに、サーバ・インスタンスとターゲット・インスタンス、ネットワーク・ロード・バランサ―（NLB）を一つのプライベート・サブネットに配置した構成を構築していきます（下図）。 所要時間 : 約100分 前提条件 : チュートリアル入門編（その2）- クラウドに仮想ネットワーク(VCN)を作るを通じてVCNの作成が完了しており、そのVCN内にデフォルトのプライベート・サブネットとパブリック・サブネットが作成されていること チュートリアル入門編（その3）- インスタンスを作成するを通じてコンピュート・インスタンスの作成が完了していること 注意 : チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります 目次 : クライアント・インスタンスとサーバー・インスタンスの作成、pingコマンドによる疎通確認 ターゲットNLBとバックエンド・インスタンスの作成 VTAPの設定とICMPパケットのキャプチャ Wiresharkを用いたTELNETパケットのキャプチャ 1. クライアント・インスタンスとサーバー・インスタンスの作成、pingコマンドによる疎通確認 この章ではパケットキャプチャの下準備として、クライアント・インスタンスでサーバ・インスタンスに向けてpingコマンドを実行し、ICMPパケットを送信してみます。なお、セキュリティを考慮して、サーバ・インスタンスをプライベート・サブネット内に配置した構成にします（下図） 本チュートリアルの前提条件を完遂すると、プライベート・サブネットと、少なくとも一台のインスタンスが配置されているパブリック・サブネットがVCNに配置されます（下図）。今回、パブリック・サブネットに配置されているインスタンスをそのままクライアント・インスタンスとして用います。 コンソールメニューから、コンピュートを選択し、 インスタンスの項目を選択します。コンパートメント内のインスタンス一覧が表示されるので、一覧の中からクライアント・インスタンスのパブリックIPアドレスを探してメモします（図ではモザイク処理をしています） プライベート・サブネットにサーバ・インスタンスを作成するため、インスタンスの作成ボタンをクリックします（前項の図中、青色のボタン）。 表示された コンピュート・インスタンスの作成ウィンドウに以下の項目を入力し、作成 ボタンをクリックします（下図）。特にインスタンスをプライベート・サブネットに作成することに注意してください 名前 - server-VM コンパートメントに作成 - VCNやクライアント・インスタンスが存在するコンパートメントを選択（以後、検証用コンパートメントと呼びます） 可用性ドメイン - 任意...","categories": [],
        "tags": ["intermediate","network"],
        "url": "/ocitutorials/intermediates/vtap/",
        "teaser": "/ocitutorials/intermediates/vtap/arc-prog-completed.png"
      },{
        "title": "監査(Audit)ログを使用したテナント監視",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル **監査 (Audit) **サービス とは、テナンシ内のアクティビティを、ログとして自動的に記録してくれるサービスです。具体的には、Oracle Cloud Infrastructureコンソール、コマンドライン・インタフェース(CLI)、ソフトウェア開発キット(SDK)、ユーザー独自のクライアント、または 他のOracle Cloud Infrastructureサービスによって行われるAPIコール が記録されます。 監査ログは そのままではただ蓄積されるだけですが、サービス間連携を担う「サービス・コネクタ・ハブ」を使用し、「通知」サービスと組み合わせることで、「特定の操作が行われた場合に検知してメールで通知させる」といった応用が可能です。 この章では、監査ログを サービス・コネクタ・ハブ、および 通知サービス と連携させ、テナンシ内の特定コンパートメントで「バケットが作成された場合に通知する」という設定を行っていきたいと思います。 巻末にはその他の監視内容についても、いくつかのサンプルを記載していますので、参考にしてください。 所要時間 : 約20分 前提条件 : チュートリアル : モニタリング機能でOCIのリソースを監視する の「4. アラームの通知先の作成」を完了し、Eメールを受信可能な トピック 及び サブスクリプション が 登録済みであること。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. サービス・コネクタ・ハブの作成 監査サービスは、テナンシ開設時にデフォルトで有効化されているため、特に事前準備は必要ありません。 まずは、サービス・コネクタ・ハブから作成していきましょう。 ナビゲーション・メニュー（...","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/serviceconnecterhub/",
        "teaser": "/ocitutorials/intermediates/serviceconnecterhub/image01.png"
      },{
        "title": "OCIモバイル・アプリケーションを使ってみる",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure モバイル・アプリケーションをインストールすると、アプリからリソースの詳細を表示したり、リソースに変更を加えることができます。 ユースケースとしては以下のようなものがあります。 外出先でアラート、通知および制限を確認することができます。 リソース、請求、使用状況データに関する情報にすばやくアクセスできます。 モバイル・デバイスからリソースの起動、停止、再起動または削除を行えます。 このチュートリアルでは、Oracle Cloud Infrastructure モバイル・アプリケーションの基本的な使い方をご案内します。 所要時間 : 約15分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 注意 : チュートリアル内の画面ショットについては 現在の画面と異なっている場合があります 1. OCIモバイル・アプリケーションをインストールする Google Play StoreかApple App Storeで、Oracle Cloud Infrastructureを検索してアプリケーションを選択し、インストールのステップに従います。 このアプリケーションは、以下のオペレーティング・システムでサポートされています: Android 8以降のバージョン iOS 11以降のバージョン Google Play Store Apple...","categories": [],
        "tags": ["intermediate","mobile app"],
        "url": "/ocitutorials/intermediates/mobile_app/",
        "teaser": "/ocitutorials/intermediates/mobile_app/ma_02.png"
      },{
        "title": "Oracle Content and Experience チュートリアル",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": ["OCE"],
        "url": "/ocitutorials/intermediates/oce-tutorial/",
        "teaser": "/ocitutorials/content-management/create_oce_instance/024.jpg"
      },{
        "title": "Oracle Blockchain Platform チュートリアル",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": ["Blockchain"],
        "url": "/ocitutorials/intermediates/blockchain-tutorial/",
        "teaser": "/ocitutorials/blockchain/01_1_create_instance/service_console.png"
      },{
        "title": "BastionサービスでパブリックIPを持たないリソースにアクセスする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル 通常インターネットからパブリックエンドポイントを持たないターゲット・リソースに接続する場合、パブリック・サブネット内の踏み台サーバーを経由してそれらのリソースに接続する必要があります。しかしOCIのBastionサービスを使用することでわざわざ踏み台サーバーを立てる必要がありません。このサービスはプライベート・サブネット内のインスタンスだけでなくDBの接続や、リモートデスクトップ（RDP）接続で使用できます。またAlways Freeに該当するため無償で利用できるサービスです。 今回のチュートリアルではプライベート・サブネット内にあるLinuxインスタンスとWindowsインスタンスにBastionサービスを使ってそれぞれSSH接続、RDP接続を行います。 所要時間：　約30分 前提条件： その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること 注意: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 目次 : ポリシーの付与 プライベート・サブネット内にLinuxとWindowsのインスタンスを作成 要塞の作成 管理対象SSHセッションでLinuxインスタンスに接続 SSHポート転送セッションでWindowsインスタンスに接続 1. ポリシーの付与 Bastionサービスを使う際に権限が必要です。IAMポリシーを以下のように作成します。管理者や all resource　ですべてのリソースを使用できる権限があるユーザーの場合はこの設定をする必要がありません。 Allow group &lt;グループ名&gt; to manage bastion in tenancy/compartment&lt;コンパートメント名&gt; Allow group &lt;グループ名&gt; to manage bastion-session in tenancy/compartment&lt;コンパート名&gt; 2. プライベート・サブネット内にOracle LinuxとWindowsのインスタンスを作成...","categories": [],
        "tags": ["intermediate","bastion"],
        "url": "/ocitutorials/intermediates/bastion/",
        "teaser": "/ocitutorials/intermediates/bastion/img1.png"
      },{
        "title": "Oracle Linux Storage Applianceでファイルストレージの構築",
        "excerpt":"Oracle Linux Storage Applianceを使用することでOracle Cloud Infrastructure(OCI)上にWebインターフェースを使用して簡単に共有ファイルストレージを構築できます。その際にNFSv3、NFSv4そしてSMBv3のプロトコルを使用することができます。 今回のチュートリアルでは実際にOracle Linux Storage Applianceで共有ファイルストレージを作成して、OCI上にあるWindowsインスタンスからSMBプロトコルを介してアクセスしてみます。 チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル 所要時間：　約30分 前提条件： その2 - クラウドに仮想ネットワーク(VCN)を作るが完了していること その4 - ブロック・ボリュームをインスタンスにアタッチするのブロック・ボリュームの作成を行っていること 注意: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 1. 事前準備 1. インスタンス Oracle Linux Storage Applianceを使用するために必要なインスタンスを作成します。その3 - インスタンスを作成するを参考にしてインスタンスを作成します。その際にイメージの変更ボタンをおしてイメージソースを Oracleイメージ にして　Oracle Linux Storage Appliance をクリックします。 OCI上のWindowsインスタンスでSMBの共有ファイルを確認するために、その3 - インスタンスを作成するを参考にしてWindowsインスタンスを作成します。 2. ブロック・ボリュームのアタッチ Oracle...","categories": [],
        "tags": ["intermediate","oracle-linux-storage-appliance"],
        "url": "/ocitutorials/intermediates/oracle-linux-storage-appliance/",
        "teaser": "/ocitutorials/intermediates/oracle-linux-storage-appliance/img10.png"
      },{
        "title": "コンピュート・インスタンスのOSを管理する",
        "excerpt":"Oracle Cloud上でコンピュート・インスタンスを運用する場合、OS以上のレイヤーはユーザの管理範囲となっています。つまりユーザ側でOSの更新やセキュリティ・パッチの適用などを行う必要がありますが、これらの運用は効率的にできているでしょうか？特にインスタンスの数が多くなってくるとOSのアップデートなどの管理作業も大変です。 これらのOSのユーザによる管理作業を効率的に実施するのに役立つ機能として、OCIではOS管理サービスを利用することができます。 この章では、OS管理サービスでLinuxのコンピュート・インスタンスのOSのパッケージ更新やセキュリティ・パッチの適用を行っていきます。 所要時間 : 約30分 前提条件 : インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を通じてコンピュート・インスタンスの作成が完了している、もしくは本章の中で新規にインスタンスを作成する。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. IAMポリシーの設定 OS管理を利用するために必要な権限をIAMポリシーで設定します。以下のポリシーが必要です。 ユーザがOS管理を操作するための権限（環境に応じて適切に設定してください） allow group &lt;グループ名&gt; to manage all-resources in tenancy / in compartment &lt;コンパートメント名&gt; OS管理サービスがインスタンスを参照するための権限 Allow service osms to read instances in tenancy 対象のインスタンスがOS管理サービスに連携できるようにする権限 メニュー アイデンティティとセキュリティ...","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/os_management/",
        "teaser": "/ocitutorials/intermediates/os_management/img_12.png"
      },{
        "title": "OCI Data Integrationチュートリアル",
        "excerpt":"はじめに OCI Data Integration はOCIで利用できるGUIベースのETLサービスです。 このチュートリアルではオブジェクト・ストレージ上のデータを変換し、Autonomous Databaseにロードを行っていきます。 OCI Data Integrationドキュメントに掲載されているチュートリアルの一部です。 目次 : 1.サンプルデータのロードとターゲット表の作成 2.Data Integrationを利用するための準備 3.ワークスペースの作成 4.データ・アセットの作成 5.プロジェクトとデータ・フローの作成 6.データ・フローの編集 7.タスクの作成 8.アプリケーションの作成とタスクの公開と実行 前提条件 : Data Integrationを利用するコンパートメントを準備してください。 Autonomous Databaseのエンドポイントはパブリックエンドポイントとしています。 画像は最新サービスと異なる可能性があります。 1. サンプルデータのロードとターゲット表の作成 ソースとなるオブジェクト・ストレージにファイルをアップロードし、ターゲットとなるAutonomous Databaseにロード先の表を作成します。 ソース：オブジェクト・ストレージ オブジェクト・ストレージにサンプルデータをロードします。 バケットを作成し、次の2つのファイルをアップロードしてください。 ファイルへのリンク : CUSTOMERS.json / REVENUE.csv バケットの作成とファイルのアップロード手順は“その7 - オブジェクト・ストレージを使う”をご確認ください。 ターゲット：Autonomous Database Autonomous Databaseインスタンスを作成しユーザーを作成します。手順は“101:ADBインスタンスを作成してみよう”をご確認ください。ユーザー名は任意ですが、このチュートリアルでは、BETAとします。作成したユーザーBETAで以下のSQLでCUSTOMER_TARGET表を作成してください。 CUSTOMERS_TARGET表作成SQL CREATE TABLE...","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/ocidi-tutorials/",
        "teaser": "/ocitutorials/intermediates/ocidi-tutorials/top.png"
      },{
        "title": "OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する",
        "excerpt":"OCI Observability&amp;Managementのサービスの1つ、Logging Analyticsでは様々なログを可視化、分析する機能を提供します。 Logging AnalyticsではOCIの各種ログ(VCN, Load Balancer, Audit…)だけでなく、エージェントを使用することでOSやデータベース、Webサーバーなどのログを可視化、分析することが可能です。 この章では、エージェントは利用せず簡単な操作でOCIの監査ログをLogging Analyticsで分析する手順をご紹介します。 所要時間 : 約20分 前提条件 : Logging Analyticsが有効化されていること OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. IAMポリシーの作成 Logging Analyticsを利用するためにはOCIの他のサービスと同様に、IAMポリシーによってアクセス権限が付与されている必要があります。 以下のポリシーをテナンシで作成してください。 ※この章では、ユーザーにLogging Analyticsの管理権限を付与します。ユーザーはログ・アナリティクスの構成やログファイルのアップロード、削除を含む全ての管理権限を行うことができます。ドキュメント を参考にユーザーの役割、ロールごとにIAMポリシーの権限を調整してください。 ※OCIのテナンシ管理者がLogging Analyticsを利用する場合は、作成するポリシーは「1-2.Logging Analyticsサービスへのポリシー」のみになります。その他のポリシーは作成する必要はありません。 1-1. Loggingサービスを利用するためのポリシー allow group &lt;IAMグループ名&gt; to MANAGE logging-family in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/audit-log-analytics/",
        "teaser": "/ocitutorials/management/audit-log-analytics/audit-loganalytics16.png"
      },{
        "title": "OCIのログをDataDogで監視する",
        "excerpt":"このチュートリアルでは、DataDogにOCIのログを転送するための、オーバーヘッドが低く拡張性の高いソリューションを構成する方法をご紹介します。オブジェク・トストレージにファイルをアップロードした際に生成される書き込みログが、サービス・コネクタとファンクションを経由してDataDogに転送され、ダッシュボードに表示されるまでの流れをステップ・バイ・ステップで説明します。 ソリューションの全体像は以下になります。 前提条件 OCI OCIのアカウントを取得済みであること。無料アカウントにサインアップするには、OCI Cloud Free Tierを参照してください。 DataDog Datadogのアカウントを取得済みであること。14日間の無料トライアルが利用できます。DataDog 無料トライアルにアクセスしてください。 1. 事前準備 事前準備として以下を実施します。 IAMポリシーの作成 トークンの生成 VCNの作成 バケットの作成 リポジトリの作成 サンプルコードのダウンロード 1-1. IAMポリシーの作成 ファンクションに関するポリシーを設定します。 Oracle Functions ハンズオンの「事前準備」の項目を参考にしてください。 このチュートリアルでは、ユーザーはテナント管理者を想定していますので、ユーザー（グループ）に設定するポリシーは特にありません。個別に設定したい場合はポリシー・リファレンスを参考に設定してください。 1-2. トークンの生成 ファンクションで利用するイメージはコンテナ・レジストリのリポジトリに格納されます。コンテナ・レジストリにイメージをプッシュするには認証用のトークンを生成します。 コンソールの画面右上にあるユーザー・プロファイルのユーザー情報をクリックします。 ユーザー情報の詳細ページで「認証トークン」を選択して「トークンの生成」へ進みます。 「説明」を入力して「トークンの生成」をクリックします。 「コピー」をクリックして、生成されたトークンをメモしてください。これは再度表示されませんのでご注意ください。メモしたら「閉じる」をクリックします。 これで、トークンの生成は完了しました。 1-3. VCNの作成 ファンクションで使用するVCNを作成します。 コンソールのメニューから「ネットワーキング」を選択し、「仮想クラウド・ネットワーク」へ進みます。 使用するコンパートメントを選択して、「VCNウィザードの起動」をクリックします。 「インターネット接続性を持つVCNの作成」を選択して、「VCNウィザードの起動」をクリックします。 「VCN名」を入力し、その他の項目はデフォルトのままで「次」をクリックします。 「確認および作成」のページで「作成」をクリックします。 これで、VCNの作成は完了しました。 1-4. バケットの作成 オブジェクト・ストレージのバケットを作成します。 コンソールのメニューから「ストレージ」を選択して、「オブジェクト・ストレージとアーカイブ・ストレージ」の「バケット」をクリックします。 使用するコンパートメントを選択して、「バケットの作成」をクリックします。 「パケット名」を入力し、その他の項目はデフォルトのままで「作成」をクリックします。...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/logging_datadog/",
        "teaser": "/ocitutorials/management/logging_datadog/native.jpeg"
      },{
        "title": "Stack Monitoring を使用して OCI Compute のメトリックを可視化する",
        "excerpt":"チュートリアル概要 : このチュートリアルでは、Stack Monitoring を使用して OCI Compute のメトリック監視を有効化するまでのステップをご紹介します。 所要時間 : 約20分 前提条件 : テナンシ上で以下のリソースが作成済であること コンパートメント ユーザー ユーザーグループ VCN OCI Compute (Oracle Linux) 1. 管理エージェントの有効化 Stack Monitoring でモニターするメトリック情報は管理エージェントにより取得されます。OCI Compute のプラットフォーム・イメージに標準でインストールされているクラウド・エージェントのプラグインを使用して、管理エージェントを有効化します。 管理エージェント有効化したいインスタンスの管理画面で「Oracle Cloudエージェント」に移動し、管理エージェントが無効となっている場合は有効にします。 2. 動的グループの作成 OCIコンソールの画面左上ハンバーガーメニューから「アイデンティティとセキュリティ」を選択し、以下のように進んでください。 アイデンティティ &gt; ドメイン &gt; お使いのドメイン（通常はDefault） &gt; 動的グループ 「動的グループの作成」をクリックし、以下のように入力します。 動的グループ名：Management_Agent_Dynamic_Group 説明：管理エージェント有効化のための動的グループ 一致ルール：下に定義したいずれかのルールに一致 ルール1には以下のステートメントを記入します。 “ocid1.compartment.oc1.examplecompartmentid”は、監視対象の Compute が配置されているコンパートメントのOCIDに置き換えてください。 ALL...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/stack_monitoring_install/",
        "teaser": null
      },{
        "title": "OCI Database Cloud ServiceでDatabase Managementを有効化する",
        "excerpt":"OCI Observability &amp; Managementのサービスの1つ、Database Managementでは、Enterprise Managerで提供されているパフォーマンス分析の機能を中心に、Oracle DBのパフォーマンスを監視することが可能です。本章では、OCIのDatabase Cloud ServiceでDatabase Managementを有効化する手順を紹介します。Database Cloud ServiceでDatabase Managementを有効化する場合、エージェントレスで利用を開始することが出来ます。 所要時間 : 約50分 前提条件 : OCIのDatabase Cloud Serviceが1インスタンス作成されていること BaseDBのインスタンスの作成方法はその8-クラウドでOracle Databaseを使うをご参照ください。 注意 : ※監視対象のBaseDBがStandard Editionの場合、Database Managementの一部機能をご利用いただけませんのでご注意ください。 1. IAMポリシーの作成 Database Managementを利用するためにはOCIの他のサービスと同様に、IAMポリシーによってアクセス権限が付与されている必要があります。 以下のポリシーをテナンシで作成してください。 1-1. ユーザーがDatabase Managementを利用するためのポリシー allow group &lt;IAＭグループ名&gt; to MANAGE dbmgmt-family in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to MANAGE...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/dbcs-database-management/",
        "teaser": "/ocitutorials/management/dbcs-database-management/dbmgmt1.png"
      },{
        "title": "OCIのDBCSでOperations Insightsを有効化する",
        "excerpt":"OCI Observability &amp; Managementのサービスの1つ、Operations Insightsでは、Oracle Databaseのデータを長期保存し、機械学習による分析でリソースの需要分析と将来値の予測、パフォーマンス問題を検出することができます。Operations Insightsを利用することで、リソース配分の最適化によるコストの削減、パフォーマンスの向上などを図ることが可能です。 この章では、Oracle CloudのDatabase Cloud ServiceでOperations Insightsを有効化する手順をご紹介します。Operations Insightsを有効化するためにエージェントなどをインストールする必要はなく、OCIコンソールからの操作で有効化することができます。 所要時間 : 約20分 前提条件 : 101: Oracle CloudでOracle Databaseを使おう（DBCS）を通じて、DBCSインスタンスの作成が完了していること 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. IAMポリシーの作成 Operations Insightsを利用するためにはOCIの他のサービスと同様に、IAMポリシーによってアクセス権限が付与されている必要があります。 以下のポリシーをテナンシで作成してください。 ※この章では、ユーザーにOperations Insightsの管理権限を付与します。ユーザーはログ・アナリティクスの構成やログファイルのアップロード、削除を含む全ての管理権限を行うことができます。ドキュメント を参考にユーザーの役割、ロールごとにIAMポリシーの権限を調整してください。 allow group &lt;IAMグループ名&gt; to manage opsi-family in tenancy allow group &lt;IAMグループ名&gt; to use database-family in...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/dbcs_operations_insights/",
        "teaser": "/ocitutorials/management/dbcs_operations_insights/DB_OperationsInsights16.png"
      },{
        "title": "Logging AnalyticsでAutonomous Databaseのログを収集する",
        "excerpt":"チュートリアル概要説明 Autonomous DatabaseにはOSログインできないため、ログ情報は表やビューにSQLでアクセスして取得する必要がありますが、O&amp;Mの管理エージェントを使用することでLogging Analyticsへのアップロードを効率的に自動化することができます。 本チュートリアルはこちらのドキュメントを補足する内容となりますので、あわせてご参照ください。 所要時間 : 約30分 前提条件 : Logging Analyticsの有効化 参考：OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する Autonomous Databaseの作成 参考：101: ADBインスタンスを作成してみよう Autonomous Databaseへアクセスするためのコンピュート・インスタンスの作成 参考：その3 - インスタンスを作成する 管理エージェントはOracle Cloud Agentプラグインを使用 必要な権限 : 以下の権限設定が最低限必要となります。 動的グループ all {resource.type = 'managementagent', resource.compartment.id ='&lt;your compartment id&gt;'} 動的グループの概要と設定方法については以下を参照ください。 参考：OCI活用資料集：IDおよびアクセス管理 (IAM) 詳細 ポリシー allow service loganalytics to read loganalytics-features-family in...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/logginganalytics_adb_log/",
        "teaser": "/ocitutorials/management/logginganalytics_adb_log/img1.png"
      },{
        "title": "カスタム・パーサーを作成してOCI Logging Analyticsで未対応のログを分析する",
        "excerpt":"OCI Observability &amp; Management のサービスの1つ、Logging Analyticsでは様々なログを可視化、分析する機能を提供します。OCIのLogging AnalyticsでOCIの監査ログを可視化・分析するでは、事前に定義されていたOCI Audit Logのパーサー（解析文）を使用してOCIの監査ログを解析し、分析しました。 Logging Analyticsでは250種類以上のログのパーサー（解析文）が定義されているため、主要なシステムのログは取り込んですぐに分析することができます。 しかし、万が一分析したいログのパーサー（解析文）が事前に定義されていなくても心配いりません。Logging Analyticsはユーザーがカスタムでパーサーを定義することもできます。 本チュートリアルでは、Logging Analyticsで定義されていないログのパーサーを作成する手順をご紹介します。 所要時間 : 約20分 前提条件 : ユーザーがLogging Analyticsを使用するためのポリシーが作成されていること。ポリシーの詳細はOCIのLogging AnalyticsでOCIの監査ログを可視化・分析するもしくは、ドキュメントをご参照ください。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. カスタム・パーサーの作成 OCIコンソール → 監視及び管理 → ログ・アナリティクス → 管理 →パーサー → パーサーの作成 → 正規表現タイプ をクリックします。 「パーサーの作成」画面にて、以下情報を入力したら「次」をクリックします 名前 - 任意 例)serverlog 説明 -...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/logginganalytics_customparser/",
        "teaser": "/ocitutorials/management/logginganalytics_customparser/LA_customparser5.png"
      },{
        "title": "Oracle Management Cloud チュートリアルまとめ",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/management/management-cloud-tutorials/",
        "teaser": null
      },{
        "title": "Prometheus Node Exporterを利用した管理エージェントによるインスタンスのメトリック収集",
        "excerpt":"チュートリアル概要説明 このチュートリアルでは、Node Exporterが収集したOCIインスタンスのメトリックをモニタリングで可視化するまでのステップをご紹介します。 本チュートリアルはこちらのドキュメントを補足する内容となりますので、あわせてご参照ください。 所要時間 : 約30分 前提条件 : 監視対象となるコンピュート・インスタンスの作成 参考：その3 - インスタンスを作成する OSはOracle Linux 7.9 管理エージェントはOracle Cloud Agentプラグインを使用 構成のイメージ 必要な権限 : 以下の権限設定が最低限必要となります。 動的グループ all {resource.type = 'managementagent', resource.compartment.id ='&lt;your compartment id&gt;'} 動的グループの概要と設定方法については以下を参照ください。 参考：OCI活用資料集：IDおよびアクセス管理 (IAM) 詳細 ポリシー allow service loganalytics to read loganalytics-features-family in tenancy allow dynamic-group &lt;your dynamic-group-name&gt; to...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/monitoring_prometheus/",
        "teaser": "/ocitutorials/management/monitoring_prometheus/prom1.png"
      },{
        "title": "OCI Database ManagementでOracleDBのパフォーマンス監視をする",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/management/database-management/",
        "teaser": null
      },{
        "title": "OCI Search Service for OpenSearch を使って検索アプリケーションを作成しよう",
        "excerpt":"OCI Search Service for OpenSearch を使って検索アプリケーションを作成する Oracle Cloud Infrastructure Search Service with OpenSearch は、OpenSearch に基づいてアプリケーション内検索ソリューションを構築するために使用できるマネージド・サービスであり、インフラストラクチャの管理に集中することなく、大規模なデータセットを検索し、結果をミリ秒で返すことができます。 ハンズオンの流れは以下となります。 OpenSearch クラスターのプロビジョニング クラスタへの接続 データセットのアップロード アプリケーションの作成とデプロイメント アプリケーションのテスト 前提条件 クラウド環境 Oracle Cloud のアカウントを取得済みであること OCI チュートリアル その 2 - クラウドに仮想ネットワーク(VCN)を作る  を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること OCI チュートリアル その 3 - インスタンスを作成する  を通じてコンピュートインスタンスの構築が完了していること ハンズオン環境のイメージ 1. OpenSearch クラスターのプロビジョニング OpenSearch クラスタは、OpenSearch 機能を提供するコンピュート・インスタンスのセットです。各インスタンスはクラスタ内のノードです。ノードのタイプは、インスタンスによって実行される機能およびタスクを決定するものです。各クラスタは、1 つ以上のデータ・ノード、マスター・ノードおよび OpenSearch...","categories": [],
        "tags": ["opensearch"],
        "url": "/ocitutorials/opensearch/search-application-for-beginners/",
        "teaser": null
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス・リミット、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 無償トライアル環境のお申込みについては こちら の資料を参照してください。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります image サポートされるブラウザの確認 このチュートリアルでは、Oracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナント名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID ユーザー名 - ログインのためのユーザー名 パスワード - ログインのためのパスワード ログイン情報の入手方法は、ユーザーが作られるタイミングによって異なります。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/webapp/01-getting-started/",
        "teaser": null
      }]
