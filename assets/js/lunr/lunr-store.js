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
        "excerpt":"Oracle Cloud Infrastructure では、MySQL Database Service(MDS)が利用できます。MDSはAlways Freeの対象ではないため、使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。 このチュートリアルでは、コンソール画面からMDSのサービスを1つ作成し、コンピュート・インスタンスにMySQLクライアント、MySQL Shellをインストールして、クライアントからMDSへ接続する手順を説明します。 所要時間 : 約25分 (約15分の待ち時間含む) 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)を完了していること クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2)を完了していること インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)を完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. MySQL Database Service(MDS)とは? 2. MDSの作成 3....","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/creating-mds/",
        "teaser": "/ocitutorials/beginners/creating-mds/MySQLLogo_teaser.png"
      },{
        "title": "その10 - MySQLで高速分析を体験する",
        "excerpt":"Oracle Cloud Infrastructure(OCI) では、HeatWaveというデータ分析処理を高速化できるMySQL Database Services(MDS)専用のクエリー・アクセラレーターが使用できます。HeatWaveもMDSと同じく、Always Freeの対象ではないため使用するためにはクレジットが必要ですが、トライアルアカウント作成時に付与されるクレジットでも使用可能です。 このチュートリアルでは、コンソール画面からHeatWaveを構成し、MySQLクライアントからサンプルデータベースを構成してHeatWaveを利用する手順を説明します。 所要時間 : 約40分 (約25分の待ち時間含む) 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)を完了していること クラウドに仮想ネットワーク(VCN)を作る - Oracle Cloud Infrastructureを使ってみよう(その2)を完了していること インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)を完了していること クラウドでMySQL Databaseを使う(その9)を完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. HeatWaveとは? 2. HeatWave構成時の注意事項 3. HeatWaveの構成(HeatWave用MDSの構成)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/creating-HeatWave/",
        "teaser": "/ocitutorials/beginners/creating-mds/MySQLLogo_teaser.png"
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
        "excerpt":"この文書ではOracle Blockchain Platform（OBP）でChaincodeをデプロイし、実行可能にする方法をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年8月時点での最新バージョン(21.2.1)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 Channelの作成を完了 0. 前提の理解 0.1 Hyperledger Fabric（v1.x系）におけるChaincodeのデプロイ OBPはパーミッション型のブロックチェーンプロトコルであるHyperledger Fabricをベースとしたブロックチェーンプラットフォームです。 Hyperledger Fabric（v1.x系）では、ブロックチェーン台帳に対して実行されるビジネスロジックであるChaincodeのデプロイは、①各Organizationの作業として、Endorsementを行うPeerへのChaincodeのインストール、②Channelレベルの作業として、代表する単一のOrganizationがChaincodeをインスタンス化（instantiate）、の2段階のオペレーションによって実施され、Chaincodeが実行可能になります。 0.2 このチュートリアルでのブロックチェーン・ネットワーク構成 このチュートリアルの例では、 Founder2104 というFounderインスタンス（=Organization）と、 Member2104 というParticipantインスタンス（=Organization）から成るブロックチェーン・ネットワークとなっています。また、ch1という名前のChannelに、サンプルChaincodeをデプロイします。 任意のChannelで任意のChaincodeを、また、単一のインスタンス／Organizationから成るネットワークでも基本的には同一の手順でデプロイできます。 1.サンプルChaincodeの準備 デプロイするサンプルChaincodeをダウンロードし、必要なZipファイルを準備します。 Oracle Blockchain Platformのサービス・コンソールを開きます。 Developer Toolsのページを開き、左側メニューからSamplesのセクションを選択し、「Balance Transfer」のコーナーからDownload Samples hereをクリックするとインストーラがダウンロードされます。 ダウンロードしたサンプルChaincodeのZIPファイルをunzip（解凍）します。 サンプルにはGoとNode.js両方のChaincode、およびその他のマテリアルが含まれています。デプロイには、GoのChaincodeソースだけを含んだZIPファイルを作成する必要があります。 /artifacts/src/github.com配下にあるgoフォルダをZIPファイルに圧縮してください。ZIPファイル名は任意ですが、ここでの例ではBT_Sample.zipとしています。 2.Chaincodeのインストール デプロイするChaincodeをPeerノードにインストールします。この手順については各Organization（=インスタンス）での作業が必要ですが、手順は同一なのでここでは_Founder2104_インスタンスでのステップのみを説明します。必要に応じて複数インスタンスで実施してください。 Oracle Blockchain Platformのサービス・コンソールを開きます。 Chaincodesのページを開き、Deploy a New Chaincodeをクリックします。...","categories": [],
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
        "title": "Blockchain App Builder（Visual Studio Code拡張版）の基本的な使い方",
        "excerpt":"この文書は Oracle Blockchain Platform付属のChaincode開発・テスト・デプロイ補助ツールであるBlockchain App BuilderのVisual Studio Code拡張版について、ダウンロードとインストールの方法から、Chaincode仕様の作成方法やChaincodeコードの生成方法など、基本的な使い方を紹介するチュートリアルです。 この文書は、2021年8月時点での最新バージョン(21.2.1)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 0. Blockchain App Builderとは Blockchain App BuilderはOracle Blockchain Platform（OBP）に付属するChaincode開発・テスト・デプロイの補助ツールです。 BABは以下の機能を備えており、Chaincode開発を容易にし、生産性を高めます。 YAML、JSONの形式で記述した仕様からChaincodeのコードを生成 ローカル環境に自動構築される最小限のHyperledger Fabricネットワークを用いて開発したChaincodeをテスト 生成したChaincodeのパッケージングとOBPへのデプロイ OBP上にデプロイしたChaincodeの実行 BABは以下ふたつの形態のツールとして提供されており、いずれも同等の機能を備えています。 コマンドラインツール Visual Studio Codeの拡張機能 この記事では、Visual Studio Codeの拡張版を前提に説明していきます。 1. Blockchain App Builderのインストール方法 Blockchain App Builder（Visual Studio Code拡張版）のインストールにあたっての必要な前提条件、インストーラのダウンロード方法、インストール方法について説明します。 1.1 必要な前提条件 前提条件として、以下のセットアップが必要です（なお、一部の前提条件については対応する機能を使用しない場合は無視して進めても他の機能は利用できます）。...","categories": [],
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
        "title": "Oracle Cloud Infrastructure(OCI) DevOpsことはじめ",
        "excerpt":"OCI DevOpsは、OCI上にCI/CD環境を構築するマネージドサービスです。ここでは、Oracle Container Engine for Kubernetes(OKE)サービスを利用したKubernetesクラスタの構築、アーティファクト環境とOCI DevOpsのセットアップ、CI/CDパイプラインの実装と実行までの手順を記します。 この手順を実施することで、OCI DevOpsを利用したコンテナアプリケーション開発におけるCI/CDを学習できます。 Oracle Container Engine for Kubernetes(OKE)について Oracle Container Engine for Kubernetesは、Oracle Cloud Infrastructure(OCI)で提供される、完全に管理されたスケーラブルで可用性の高いマネージドのKubernetessサービスです。 詳細はこちらのページをご確認ください。 前提条件 クラウド環境 Oracle Cloudのアカウント（Free Trial）を取得済みであること 全体構成 以下の図にある環境を構築することがゴールです。環境構築後、サンプルソースコードを変更して、「git push」コマンド実行をトリガーにCI/CDパイプラインの実行、OKEクラスタ上にサンプルコンテナアプリケーションのデプロイまでの工程が、自動で行われることを確認します。 作業構成は、「事前準備」と「OCI DevOps 環境構築」の2構成です。「事前準備」は、冒頭で紹介したOKEを利用したKubernetesクラスタを構築します。次に、OCI DevOpsから登録したメールアドレスに通知を受けることができるようにOCI Notificationsの設定を行います。また、OCI DevOpsサービスを利用する上で必要となる認証トークン設定、動的グループ・ポリシーの設定も行います。 OCI Notificationsについて OCI Notificationsは、安全、高信頼性、低レイテンシおよび永続的にメッセージを配信するためのサービスです。 本ハンズオンでは、電子メールアドレスに対して配信を行いますが、他にもSlack/SMS/PagerDutyなどに通知を行うことができます。 また詳細はこちらのページをご確認ください。 「OCI DevOps 環境構築」では、デプロイ先となるOKEクラスタの登録、コード・リポジトリとアーティファクト・レジストリの設定と管理、OCI DevOpsのパイプラインとなるビルド・パイプラインとデプロイメント・パイプラインの構築、パイプラインを自動化させるためのトリガー機能の設定、最後にソースコードの変更および「git push」コマンド実行を契機に、構築したパイプラインの稼働とデプロイされたアプリケーションの稼働を確認します。 ここで、関係する機能、サービスを整理しておきます。 コード・リポジトリ コード・リポジトリは、ソースコードをバージョン管理できるOCI...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/devops-for-commons/",
        "teaser": null
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)をプロビジョニングしよう",
        "excerpt":"マネージドKubernetesサービスであるOralce Container Engine for Kubernetes(OKE)を中心とした、コンテナ・ネイティブなサービス群です。 Oracle Container Engine for Kubernetes（以下OKE）は、OracleのマネージドKubernetesサービスです。この共通手順では、OCIやOKEを操作するためCLI実行環境の構築（Resource Managerを使用）と、OKEを使ってKubernetesクラスターをプロビジョニングするまでの手順を記します。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること ハンズオン環境のイメージ 1.OKEクラスターのプロビジョニング ここでは、OKEクラスターのプロビジョニングを行います。ここでの手順を実施することにより、OKEのコントロールプレーンとKubernetesクラスターの構築が同時に行われます。 はじめに、OCIコンソール画面左上のハンバーガーメニューを展開し、開発者サービス⇒Kubernetes Clusters (OKE)を選択します。 クラスタ一覧画面で、クラスタの作成をクリックします。 次のダイアログでクイック作成を選択し、ワークフローの起動をクリックします。 次のダイアログで、任意の名前を入力し、バージョンを選択します。ここではデフォルトのまま進めていきます。 Kubernetes APIエンドポイントには今回はデフォルトのパブリック・エンドポイントを選択します。 Kubernetes APIエンドポイントについて 管理者は、クラスタのKubernetes APIエンドポイントを、プライベート・サブネットまたはパブリック・サブネットに構成することができます。 VCNルーティングとファイアウォール・ルールを使うことで、Kubernetes APIエンドポイントへのアクセスを制御し、オンプレミスもしくは同一VCN上に構築した踏み台サーバからのみアクセス可能にすることができます。 Kubernetesワーカー・ノードには今回プライベートを選択します。これは、 ワークロードに応じて、ワーカーノードにパブリックIPを付与する必要がある場合は、パブリックを選択してください。 Kubernetesワーカー・ノードについて プライベートかパブリックによって、ワーカーノードに付与されるIPアドレスの種類が変わります。 プライベートは、ワーカーノードがプライベートIPのみを付与された状態でプロビジョニングを行います。 ワーカーノードにパブリックIPを付与する必要がある場合は、パブリックを選択してください。 シェイプには、今回VM.Standard.E3.Flexを選択します。 このシェイプは、OCPUとメモリ(RAM)を柔軟に変更することができるようになっています。 今回は、1oCPU/16GBで作成します。 シェイプについて OKEでは、VM、ベアメタル、GPU、HPCなどの様々なシェイプをご利用頂くことができます。 また、プロセッサ・アーキテクチャとしても、Intel/AMD/ARMベースのインスタンスから選択頂くことができます。 ワークロードに応じて、適切なシェイプを選択してください。 ノードの数はワーカーノードの数を指定します。デフォルトで「3」が指定されていますが、本ハンズオンでは最小構成である「1」に変更してください。 ノード数について ノードはリージョン内の可用性ドメイン全体（または、東京リージョンなど単一可用性ドメインの場合、その可用性ドメイン内の障害ドメイン全体）に可能な限り均等に分散されます。 実運用の際は可用性を考慮し、適切なノード数を指定してください。 そして、ダイアログの下まで移動し次をクリックします。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/oke-for-commons/",
        "teaser": null
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)でKubernetesを動かしてみよう",
        "excerpt":"Oracle Container Engine for Kubernetes（以下OKE）は、OracleのマネージドKubernetesサービスです。 このハンズオンでは、OKEにサンプルアプリケーションをデプロイするプロセスを通して、Kubernetesそのものの基本的な操作方法や特徴を学ぶことができます。 このカテゴリには以下のサービスが含まれます。 Oracle Container Engine for Kubernetes (OKE): フルマネージドなKuberentesクラスターを提供するクラウドサービスです。 Oracle Cloud Infrastructure Registry (OCIR): フルマネージドなDocker v2標準対応のコンテナレジストリを提供するサービスです。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること OKEハンズオン事前準備を実施済みであること 1.コンテナイメージの作成 ここでは、サンプルアプリケーションが動作するコンテナイメージを作成します。 1.1. アプリーケーションのリポジトリをForkする GitHubにアクセスし、ご自身のアカウントでログインしてください（GitHubのアカウントがなければ、事前に作成してください)。 今回利用するサンプルアプリケーションは、oracle-japanのGitHubアカウント配下のリポジトリとして作成してあります。 サンプルアプリケーションのリポジトリにアクセスしたら、画面右上のforkボタンをクリックしてください。 これ以降の作業では、Forkして作成されたリポジトリを利用して手順を進めて行きます。 1.2. ソースコードをCloneする 1.1. で作成したリポジトリにアクセスして、Clone or downloadボタンをクリックします。 ソースコードを取得する方法は2つあります。一つはgitのクライアントでCloneする方法、もう一つはZIPファイル形式でダウンロードする方法です。ここでは前者の手順を行いますので、展開した吹き出し型のダイアログで、URLの文字列の右側にあるクリップボード型のアイコンをクリックします。 これにより、クリップボードにURLがコピーされます。 Cloud ShellまたはLinuxのコンソールから、以下のコマンドを実行してソースコードをCloneします。 git clone [コピーしたリポジトリのURL] 続いて、Cloneしてできたディレクトリをカレントディレクトリにしておきます。 cd cowweb-for-wercker-demo...","categories": [],
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
        "title": "Helidon(MP)を始めてみよう",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracleでは、マイクロサービスの開発に適した軽量なJavaアプリケーションフレームワークとしてHelidonを開発しています。 Helidonは、SEとMPという2つのエディションがあります。 このチュートリアルでは、MicroProfile準拠のエディションであるMPの方を取り上げていきます。 MicroProfileについて MicroProfileは、マイクロサービス環境下で複数言語との相互連携を保ちながら、サービスを構築するために複数ベンダーによって策定されているJavaの標準仕様のことです。 詳細はこちらをご確認ください。 前提条件 こちらの手順が完了していること このチュートリアルでは、データベースとしてOracle Cloud Infrastructure上の自律型データベースであるAutonomous Transaction Processing(以降、ATPとします)を利用します こちらの1. クレデンシャル・ウォレットのダウンロードの手順が完了していること このチュートリアルでは、ATPに接続するためにクレデンシャル・ウォレットを利用します。事前にクレデンシャル・ウォレットをダウンロードしてください 実施する手順は1. クレデンシャル・ウォレットのダウンロードのみで問題ありません ハンズオン環境にApache Mavenがインストールされていること(バージョン3以上) ハンズオン環境にJDK 11以上がインストールされていること 合わせて環境変数(JAVA_HOME)にJDK 11のパスが設定されていること Helidonのビルドおよび動作環境について Helidon2.xをビルドおよび動作させるにはJDK 11以上が必要です。 1.Helidon CLIでベースプロジェクトを作成してみよう ここでは、Helidon CLIを利用して、ベースプロジェクトを作成してみます。 HelidonをセットアップするにはHelidon CLIが便利です。 このチュートリアルでは、Linux環境の前提で手順を進めますが、WindowsやMac OSでも同じようにインストールすることができます。 まずは、curlコマンドを利用してバイナリを取得し、実行可能な状態にします。 curl -O https://helidon.io/cli/latest/linux/helidon chmod +x ./helidon sudo mv...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/helidon-mp-for-beginners/",
        "teaser": null
      },{
        "title": "Helidon(SE)を始めてみよう",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracleでは、マイクロサービスの開発に適した軽量なJavaアプリケーションフレームワークとしてHelidonを開発しています。 Helidonは、SEとMPという2つのエディションがあります。 このチュートリアルでは、マイクロフレームワークのエディションであるSEの方を取り上げていきます。 前提条件 ハンズオン環境にApache Mavenがインストールされていること(バージョン3以上) ハンズオン環境にJDK 11以上がインストールされていること 合わせて環境変数(JAVA_HOME)にJDK 11のパスが設定されていること Helidonのビルドおよび動作環境について Helidon2.xをビルドおよび動作させるにはJDK 11以上が必要です。 1.Helidon CLIでベースプロジェクトを作成してみよう ここでは、Helidon CLIを利用して、ベースプロジェクトを作成してみます。 HelidonをセットアップするにはHelidon CLIが便利です。 このチュートリアルでは、Linux環境の前提で手順を進めますが、WindowsやMac OSでも同じようにインストールすることができます。 まずは、curlコマンドを利用してバイナリを取得し、実行可能な状態にします。 curl -O https://helidon.io/cli/latest/linux/helidon chmod +x ./helidon sudo mv ./helidon /usr/local/bin/ これで、Helidon CLIのインストールは完了です！ 上記が完了すると、helidonコマンドが利用可能になります。 まず初めに、initコマンドを叩いてみましょう。 helidon init ベースプロジェクトを構築するためのインタラクティブなプロンプトが表示されます。 以下のように入力していきます。 項目 入力パラメータ 備考 Helidon...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/helidon-se-for-beginners/",
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
        "title": "Oracle Content Management のファイル共有機能を使ってみよう【初級編】",
        "excerpt":"この文書は Oracle Content Management (OCM) のファイル共有機能を利用する方法をステップ・バイ・ステップで紹介するチュートリアル集です。OCM の利用ユーザーとして、ファイル共有機能の基本操作を習得します 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること チュートリアル：Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM インスタンスにサインインする まずは、OCM インスタンスにサインインします。サインイン後は、自分が利用しやすいようにプリファレンスやプロファイルを設定します フォルダの作成 フォルダを作成し、ファイルを簡単に分類します。とても簡単にフォルダを作成できますので、まずは気軽に始めてみましょう ファイルの登録 ファイルはドラッグ＆ドロップ操作で簡単にアップロードできます。また、OCM ではファイルをバージョン管理します。新規バージョンのファイルをアップロード方法や古いバージョンのファイルを表示・取得する方法を習得します ファイルのプレビュー OCM 上にアップロードされたファイルは、ファイルをダウンロードすることなく、ブラウザ内でファイルの内容を確認（プレビュー）できます。ここでは、ファイルのプレビュー操作を習得します ファイルの削除と復元 OCM のドキュメント機能でファイル（およびフォルダ）を削除すると、それらはごみ箱に移動されます。また、ごみ箱内のファイル（フォルダ）は、ユーザー自身で手動による削除（完全に削除）、もしくは元のフォルダへの復元、ができます。ここでは、ファイルやフォルダの削除時の操作について習得します ファイルの編集 OCM のデスクトップ・アプリケーションがクライアント環境にインストールされている場合、ローカル環境の Office アプリケーションと連携したファイルの編集および OCM インスタンス上への自動保存ができます。ここでは、その操作方法を確認します ファイルの検索 必要なファイルを簡単に探せることは、非常に重要です。OCM では、検索ボックスよりファイル、フォルダ、会話、メッセージ、ハッシュタグ、ユーザー、グループを横断的に検索することができます。ここでは、OCM の検索機能の利用方法について習得します...","categories": [],
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
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 ファイルやフォルダは他のユーザーと簡単に共有できます。共有時には、ファイルやフォルダにアクセスするユーザーと実行可能な操作権限（アクセス権限）を簡単に制御できます。 説明 アクセス権限 OCM のアクセス権限は4種類です アクセス権限 説明 マネージャ コントリビュータ権限に加え、メンバー追加やアクセス権限設定などの管理作業が可能（フォルダ作成者=所有者とほぼ同様の権限） コントリビュータ 子フォルダの作成と編集、登録済ファイルの編集や新規ファイルのアップロードが可能 ダウンロード実行者 フォルダの参照、ファイルの参照とダウンロードが可能（子フォルダの作成やファイルの編集はできない） 参照者 フォルダの参照、ファイルのプレビューが可能（ファイルのダウンロードはできない） 共有の方法 共有の目的や内容に応じて、その方法を使い分けることができます。OCMでは、「(A)フォルダへのメンバー追加」による共有と、「(B)リンク（URL）による共有」の2パターンです。それぞれについて説明します (A)フォルダにメンバーを追加 フォルダにメンバーを追加することで、そのフォルダおよび配下すべてのフォルダ・ファイルを複数ユーザーで共有できます メンバーの追加は、個々のユーザーもしくはグループを指定できます メンバーを追加する際に、そのフォルダに対する アクセス権限 を設定します。アクセス権限は、マネージャ、コントリビュータ、ダウンロード実行者、参照者 より選択できます 利用例 組織やグループ、大規模プロジェクトでファイルを共有する場合など、ユーザーが継続して情報にアクセスする必要がある 場合 設定例 (B)フォルダ・ファイルのリンク共有 OCMのリンク共有には「(B-1)メンバー・リンク」と「(B-2)パブリック・リンク」の2種類があります。それぞれについて説明します (B-1)メンバー・リンク フォルダへのアクセス権限を有するユーザーに対して、フォルダ・ファイルを共有する際に利用します メンバー・リンクのアクセス権限は、フォルダ・ファイルへのアクセス権限と同じ です 利用例 フォルダAに、Xさん、Yさんの2名を コントリビュータ権限 でメンバー追加 Xさんが、フォルダAの中のファイルA-1のメンバー・リンクを作成し、YさんとZさんにチャットで送付 Yさんはメンバー・リンクをクリックすると、ファイルA-1に コントリビュータ権限 でアクセスできます ZさんはフォルダAにメンバー追加されていないため、メンバー・リンクをクリックしてもファイルA-1にアクセスできません (B-2)パブリック・リンク フォルダのアクセス権限の有無に関係なく、フォルダやファイルへのアクセスを許可するリンク...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/8_share_folder_file/",
        "teaser": "/ocitutorials/content-management/8_share_folder_file/005.jpg"
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
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 OCM のデスクトップ・アプリケーションは、クラウド上のファイルやフォルダとローカル環境のファイルやフォルダを同期します。クラウド上で更新されたファイルやフォルダは、自動的にローカル環境に同期されるため、ユーザーは常に最新のファイルやフォルダをローカル環境で利用することができます また、ユーザーはネットワークに接続していないオフライン状態で、同期されたファイルやフォルダを操作できます。オフライン状態でローカル環境に同期されたファイルを編集・保存した場合、オンライン状態に復旧した時に自動的にクラウド上に反映されます。そのため、ユーザーが意識することなく、常に最新の状態がクラウド上で維持されます。 デスクトップ・アプリケーションの利用には、ローカル環境へのインストールとOCMインスタンスの接続先情報の設定が必要です。デスクトップ・アプリケーションが対応するクライアント環境は、下記ドキュメントよりご確認ください Supported Software 【お知らせ】 この文書は、2021年11月時点での最新バージョン(21.11.2)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content Management インスタンスを作成する OCM の利用ユーザーに OCM インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. デスクトップ・アプリケーションのインストールとセットアップ 1.1 インストーラーのダウンロード OCM インスタンスから、デスクトップ・アプリケーションのインストーラーをダウンロードします。 Web ブラウザを開き、OCM インスタンスにアクセスします 右上のユーザーアイコン→ 「アプリケーションのダウンロード」 をクリックします 「ユーザー名」 と 「サービスURL」 をテキストファイルなどにメモします（インストール完了後のセットアップ作業で利用します） ローカル環境のコンピュータと同じOSを選択し、「ダウンロード」 をクリックします（ここでは Windows を選択） ダウンロードが完了するまで待ちます 1.2 インストーラーの実行とセットアップ...","categories": [],
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
        "title": "Oracle Content and Experience を Headless CMS として使ってみよう【初級編】",
        "excerpt":"この文書は Oracle Content and Experience (OCE) のアセット管理機能を Headless CMS として利用する基本的な方法をステップ・バイ・ステップで紹介するチュートリアルです。 【お知らせ】 この文書は、2021年7月時点での最新バージョン(21.6.1)を元に作成されてます。 チュートリアル内の画面ショットについては Oracle Content and Experience の現在のコンソール画面と異なっている場合があります。 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに、少なくとも下記4つのOCEインスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 1. アセット機能の利用準備 OCEのアセット管理機能を利用するための準備作業を行います。アセット・リポジトリ、公開チャネル、コンテンツ・タイプをそれぞれ作成し、関連付けを行います。 1.1 アセット・リポジトリを作成する アセット・リポジトリ（以降リポジトリ）を作成します。 リポジトリとは 「デジタル・アセット（画像）やコンテンツ・アイテム（ニュースやブログなどの構造化コンテンツ）を保管・管理する器」 です。リポジトリは複数作成することができます。 OCE インスタンスのアクセスします。OCE インスタンスの URL...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/41_asset_headless/",
        "teaser": "/ocitutorials/content-management/41_asset_headless/039.jpg"
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
        "title": "Oracle Content and Experience のVideo Plus アセットを使ってみよう",
        "excerpt":"このチュートリアルは、Oracle Content and Experience (OCE)の有償オプション機能である 拡張ビデオ機能（Video Plus アセット） を利用する手順について、ステップ・バイ・ステップで紹介します 1. 前提条件の確認 1.1 バージョン このハンズオンの内容は、Oracle Content and Experience 21.1.2 時点の内容で作成されています。最新の UI とは異なっている場合があります。最新情報については、製品マニュアルをご参照ください Oracle Content and Experience https://docs.oracle.com/en/cloud/paas/content-cloud/books.html https://docs.oracle.com/cloud/help/ja/content-cloud/index.htm（※日本語翻訳版） 1.2 インスタンスの作成 OCEインスタンスが作成済であること。インスタンスの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience インスタンスを作成する 1.3 アセットリポジトリの作成 アセットリポジトリが作成済であること。リポジトリの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience を Headless CMS として使ってみよう【初級編】 1.4 Webサイトの作成 アセットを公開できるエンタープライズサイトが作成済であること。サイトの作成方法は、以下のチュートリアルをご確認ください Oracle...","categories": [],
        "tags": ["OCE"],
        "url": "/ocitutorials/content-management/73_videoplus/",
        "teaser": "/ocitutorials/content-management/73_videoplus/video008.jpg"
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
        "title": "101: Oracle Cloud で Oracle Database を使おう(DBCS)",
        "excerpt":"はじめに Oracle Cloud Infrastructure データベース・サービス(DBCS)は、Oracle Cloud Infrastructure の上で稼働する Oracle Database のPaaSサービスです。 ユーザーはオンプレミスと全く同じOracle Databaseのソフトウェアをクラウド上で利用することができ、引き続きすべてのデータベース・サーバーの管理権限(OSのroot権限含む)およびデータベースの管理者権限を保持することができます。 この章では、作成済みの仮想クラウド・ネットワーク(VCN)にデータベース・サービスを1つ作成していきます。 前提条件 : Oracle Cloud Infrastructure チュートリアル を参考に、仮想クラウド・ネットワーク(VCN)の作成が完了していること 注意 チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 1. DBシステムの作成 2. DBシステムへのアクセス 3. データベース（PDB）にアクセス 4. PDB上のスキーマにアクセスしましょう 所要時間 : 約30分 1. DBシステムの作成 コンソールメニューから データベース → ベア・メタル、VMおよびExadata を選択し、有効な管理権限を持つコンパートメントを選択します DBシステムの作成 ボタンを押します 立ち上がった DBシステムの作成...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs101-create-db/",
        "teaser": "/ocitutorials/database/dbcs101-create-db/img11.png"
      },{
        "title": "102: DBCS上のPDBを管理しよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure データベース・サービスでは、Oracle Cloud Infrastructure の上で稼働する Oracle Database の PDB を OCI コンソールから停止したり、起動したり、既存 PDB からクローンするなどの操作が簡単に行う事が可能です。この章では実際にどのように操作するのか確認していきます。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. PDB を起動・停止してみよう 2. PDB を新規作成してみよう 3. 既存 PDB からクローン PDB を作成してみよう 所要時間 : 約15分 1. PDB を起動・停止してみよう まずは、コンソール上で作成済みの PDB を確認する画面への遷移、および...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs102-managing-pdb/",
        "teaser": "/ocitutorials/database/dbcs102-managing-pdb/img13.png"
      },{
        "title": "103: パッチを適用しよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure データベース・サービス(DBCS)では、OS以上がユーザー管理となるため、ユーザー側でパッチ適用の計画と適用実施が可能です。 ここでは、DatabaseとGrid Infrastructureに対するそれぞれのパッチ適用方法についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること パッチ適用対象の Oracle Database に対して最新RU/RURが適用されていないこと 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. 現在のバージョンを確認しよう 2. Grid Infrastructure にパッチを適用しよう 3. Database にパッチを適用しよう 所要時間 : 約15分 1. 現在のバージョンを確認しよう まずは、コンソール上で作成済みの Database と Grid Infrastructure のバージョンを確認していきましょう。 コンソールメニューから Oracle Database → ベア・メタル、VMおよびExadata を選択し、対象のDBシステムを選択します。 DBシステムの詳細...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs103-patch/",
        "teaser": "/ocitutorials/database/dbcs103-patch/img11.png"
      },{
        "title": "104: 自動バックアップを設定しよう",
        "excerpt":"はじめに サービスを利用していくにあたり、利用している環境のインスタンスやデータが壊れてしまった場合や、過去の時点にデータを戻したい場合など、何か起きた時のデータ復旧のためにバックアップやリカバリについての検討は重要です。 DBCS では、RMANを利用した自動バックアップ機能が利用可能で、リカバリも最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 ここでは、OCI コンソールから自動バックアップを構成するまでの手順についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. 自動バックアップの前提条件を確認する 2. 自動バックアップの設定をしよう 3. 自動バックアップの設定を変更しよう 4. オンデマンド・バックアップを取得しよう 5. 取得したバックアップを確認しよう 所要時間 : 約30分 1. 自動バックアップの前提条件を確認する まずは設定するにあたり前提条件を確認してみましょう。 オブジェクト・ストレージに取得することを前提にまとめています。DBシステム内(FRA)にとる場合など、CLI(dbcli)で設定する場合には、バックアップはコンソールからの管理対象外となります。 必要なエディション 自動バックアップ機能は全エディションで利用可能 並列実行(チャネル数やセクション・サイズの指定など)や高速増分バックアップなどを使う場合にはEnterprise Edition以上が必要 ※特にリストア時間(RTO)の観点で、並列処理でのリストアができることはメリットになります。RTOが厳しい場合には、Enterprise Edition以上をおすすめします。 Oracle Cloudのインフラ側の前提条件 管理ユーザーのIAMサービス・ポリシーでの権限が付与済 DBシステムからオブジェクト・ストレージへのアクセス設定(VCNでサービス・ゲートウェイの利用がおすすめ) DBシステムとデータベースの状態 自動バックアップの機能が動作するためには、データベースが下記の状態である必要があります。下記の状態ではない場合、バックアップジョブが失敗する可能性があるのでご注意ください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs104-backup/",
        "teaser": "/ocitutorials/database/dbcs104-backup/11.PNG"
      },{
        "title": "105: バックアップからリストアしよう",
        "excerpt":"はじめに DBCS では、自動バックアップ機能やオンデマンドバックアップにて取得したバックアップを利用する事で、最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 また、バックアップ元のデータベースに対してリストアするだけでなく、別DBシステム上にリストアする事も可能です。 ここでは、OCI コンソールからリストアする手順についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 自動バックアップを設定しよう を通じてバックアップを取得していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. バックアップ元のデータベースに対してリストア 2. バックアップから新規データベースとしてリストア 3. オンデマンドバックアップを使用したリストア 所要時間 : 約30分 1. バックアップ元のデータベースに対してリストア まずはバックアップ元のデータベースに対してリストアしてみましょう。 リストア方法には下記3つがありますので、リストアしたい地点に応じてどのリストア方法を利用するか検討してください。 最新にリストア データ損失の可能性が最も低い、直近の正常な状態にデータベースをリストアします。 タイムスタンプにリストア 指定した日時にデータベースをリストアします。 SCNにリストア SCNを使用してデータベースをリストアします。 有効なSCNを指定する必要がありますので、データベース・ホストにアクセスして問い合せるか、オンラインまたはアーカイブ・ログにアクセスして使用するSCN番号を確認してください。 コンソールメニューから データベース → ベア・メタル、VMおよびExadata を選択し、有効な管理権限を持つコンパートメントを選択します リストアしたいDBシステムを選択します 左側のリソースからデータベースを選択し、データベース一覧から対象のデータベース名を選択します...","categories": [],
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
        "title": "201: オンプレミスのPDBをDBCSに移動しよう",
        "excerpt":"はじめに Database Cloud Service (DBCS)では、12c 以降のデータベースをプロビジョニングした場合、デフォルトでマルチテナント・コンテナ・データベース(CDB)で作成されます。 CDBで構成されているオンプレミスのデータベースからDBCSへ移行する場合、PDBのアンプラグ・プラグを行う事で簡単に移行可能です。 その際、両データベースのバージョンに差異があった場合は autoupgrade等のツールを利用する事で、バージョンアップも行う事が可能です。 ここでは、オンプレミスのデータベース(12.2.0.1)からDBCS(19.12.0.0.0)へPDBを移行する手順をご紹介します。 前提条件 : 移行元のデータベースがCDBで構成されていること Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること DBCS上に最新バージョンのautoupgrade.jarが配置されていること ※最新版は Doc ID 2485457.1 からダウンロード可能です 目次 1. 移行元のデータベースからPDBをアンプラグする 2. DBCSにPDBをプラグし、アップグレードを行う 3. 表領域の暗号化を行う 所要時間 : 約1時間30分 1. 移行元のデータベースからPDBをアンプラグする まずは移行元のデータベースから、移行対象のPDBをアンプラグします。 アンプラグはDatabase Configuration Assistantツールを使って行う事も可能ですが、今回はコマンドでの実施手順を紹介します。 対象PDBの構成確認します PDBの移動にあたってデータファイルをDBCSに持っていく必要があります。 まずは下記SELECT文にて対象PDBで使用しているデータファイルのディレクトリを確認します。 alter session set container=&lt;pdb_name&gt;; select...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/dbcs201-pdb-plug/",
        "teaser": "/ocitutorials/database/dbcs201-pdb-plug/pdb-plug05.png"
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
        "title": "103: Oracle LiveLabsのご紹介(Database Actions)",
        "excerpt":"はじめに Database Actionsで利用できる機能はユーザ作成やデータ・ロードだけではありません。 データベース管理者はもとより、Autonomous Databaseのデータを開発者やデータ分析者がすぐに利用できる機能群が提供されています。 詳細はこちらの資料をご確認ください。 　　 データ活用に関わる機能であるデータロード、カタログ、データインサイト、ビジネスモデルは、Oracle LiveLabs というサイトでイメージのようにシナリオに沿って実環境で体験することができます。この章ではその方法をご案内します。 目次 1.Oracle LiveLabsとは? 2.Database Actionsのワークショップのご紹介と開始手順 3.関連ワークショップのご紹介 所要時間 : 約20分 1.Oracle LiveLabsとは? Oracle LiveLabs とはOracle Cloud Infrastructure上でお試しいただける様々なワークショップをまとめたサイトです。150種類を超える数のワークショップが登録されています。 　　 ワークショップの実行には、ご利用いただいているOracle Cloud環境およびAlways Free/トライアル環境をお使いいただけます。またワークショップによっては、Oracle LiveLabsで時間制限を設けた一時利用環境も提供しております。 (一時利用環境の利用手順についてはこちらが参考になります。) なお、英語での提供ではありますが、ブラウザの翻訳機能をご利用いただくことで十分に進めることができます。このチュートリアルでは、日本語表示の場合はGoogle Chromeの翻訳機能を利用しています。 2.Database Actionsのワークショップのご紹介 Oracle LiveLabsのDatabase Actionsのワークショップはこちらです。 “Introduction to Autonomous Database Tools” 概要と開始手順 このワークショップでは、架空のオンライン映画ストリーミング会社”Oracle MovieStream”の社員になった想定で、顧客データ、視聴データをもとに顧客の傾向を分析していきます。 具体的には、分析するためのデータのロードとクレンジング、ビジネスに即した分析モデル作成とそこからの洞察を行います。それらすべてをDatabase Actionsで実施できるのです。 それでは、利用する環境に合わせて、以下のどちらかをクリックしてください。このチュートリアルではフリートライアルを想定してLaunch...","categories": [],
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
        "teaser": "/ocitutorials/database/adb107-machine-learning/img1.png"
      },{
        "title": "201: 接続サービスの理解",
        "excerpt":"Autonomous Database では、事前に定義済の接続サービスが用意されています。 本章では、接続サービスの概要をご紹介します。 所要時間 : 約10分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 目次： 1. 接続サービスとは？ 2. サービス・コンソールのResource Managerの設定画面にアクセスしよう 3. CPU/IOの優先度の変更しよう 4. 処理時間/利用IOの上限を設定しよう 5. 同時実行セッション数の制限が変更できることを確認しよう 1. 接続サービスとは？ 接続サービスの選択 インスタンスに接続する際、Autonomous Databaseはアプリケーションの特性に応じて適切な「接続サービス」を選択する必要があります。 この「接続サービス」は、パラレル実行・同時実行セッション数・リソース割り当てなどの制御について事前定義されたもので、ユーザーは接続サービスを選択するだけで、CPUの割当や並列処理をコントロールできます。 選択可能な接続サービスの種類は、次の通りです。 Autonomous Data Warehouse(ADW) では３種類、Autonomous Transaction Processing(ATP)では5種類あり、ワークロード適したものを選択します。 使い分けの指針、スタートポイント 代表的なワークロードを「OLTP系」と「バッチ系/DWH系」の２つのカテゴリに分類し、それぞれの処理の特性と適応する接続サービスについてまとめました。 OLTP系 バッチ系・DWH 特徴 少量の行しかアクセスしない 大量のユーザが同時に実行する 一般的なオーダーとしてはミリ秒レベル 大量の行にアクセスし、一括で処理する ユーザ数は少ない 一般的なオーダーとしては秒～分レベル 一般的なチューニング方針...","categories": [],
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
        "excerpt":"はじめに この章ではAutonomous Databaseにおける分析系クエリの性能を確認します。 特に、インスタンスのOCPU数を増やした前後でのパフォーマンスを比較することで、簡単に性能が向上することをみていきます。 また、SQLの実行状況を確認するために、サービス・コンソールを操作いただきます。 目次 1. SSBスキーマを確認しよう データ・モデラーによる構成確認 各表の件数確認 2. OCPU数の違いによる処理時間の差を確認しよう OCPU=1の場合 OCPU=8の場合 3. 性能調査に使えるツールのご紹介 サービス・コンソール パフォーマンス・ハブ 所要時間: 約40分 Star-Schema-Benchmark（SSB）とは？ ADBのインスタンスには、DWH系・分析系のサンプルスキーマとして以下が同梱されています。 Oracle Sales History（SHスキーマ） Star Schema Benchmark（SSBスキーマ） 上記のサンプルスキーマの特長 約1TB、約60億行のファクト表と、複数のディメンション表から構成 マニュアルには動作確認用のサンプルSQLも記載されている ADW、ATPの双方で利用可能（2021/07時点）- 本ガイドでは前の章で作成したAutonomous Transaction Processing(ATP) インスタンスの利用を前提に記載していますが、SSBのような分析系・DWH系のアプリケーションの場合、Autonomous Data Warehouse(ADW) をご選択いただくことを推奨しています。 ※サンプルスキーマの詳細についてはこちらを参照ください。 作業の流れ SSBスキーマを確認しよう OCPU数の違いによる処理時間の差を確認しよう サービスコンソール/SQL Monitorで処理内容を確認しよう 1. SSBスキーマを確認しよう データ・モデラーによる構成確認 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続...","categories": [],
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
        "excerpt":"はじめに Oracle Exadataをベースに構成されるAutonomous Database(ADB)は、分析系の処理だけでなく、バッチ処理、OLTP（オンライン・トランザクション）処理といった様々なワークロードに対応可能です。 この章ではOracle Databaseのベンチマークツールとして利用されることの多いSwingbenchを利用し、OLTP処理をATPで動かしてみます。 併せて、データベースの負荷状況に応じて自動的にCPUをスケールさせる、自動スケーリング（Auto Scaling）の動作を確認します。 目次 1.Swingbenchをセットアップしよう Swingbenchをダウンロード、データ生成 生成されたスキーマ・オブジェクトの確認 2.Swingbenchを実行し、OCPUをスケールアップしてみよう OCPU=1 (自動スケーリング無効) OCPU=4 (自動スケーリング無効) OCPU=4 (自動スケーリング有効) 所要時間: 約1時間30分 1.Swingbenchをセットアップしよう Swingbenchをダウンロード、データ生成 まずはSwingbenchを仮想マシン上にダウンロードしましょう、ベンチマーク・データをADBインスタンス内に生成しましょう。 Terminalを起動し、仮想マシンにopcユーザでログイン後、oracleユーザに切り替えます。 ssh -i &lt;秘密鍵のパス&gt; opc@&lt;仮想マシンのIPアドレス&gt; sudo su - oracle 作業用ディレクトリに移動します。 cd /home/oracle/labs/swingbench Swingbenchをダウンロードします。wgetもしくはcurlコマンドをご利用ください。（数分程度かかります。） wget http://www.dominicgiles.com/swingbench/swingbenchlatest.zip OR curl http://www.dominicgiles.com/swingbench/swingbenchlatest.zip -o swingbenchlatest.zip 展開します。 unzip swingbenchlatest.zip （必要に応じて）念のため環境変数を設定します。 locate libsqlplus.so...","categories": [],
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
        "title": "301 : 移行元となるデータベースを作成しよう",
        "excerpt":"はじめに 既存Oracle DatabaseをAutonomous Databaseに移行するにはどうすれば良いでしょうか？ 従来からよく利用されるData Pumpを始め、Autonomous Databaseではいくつかの移行方法が用意されており、このチュートリアルでは移行編としてそれらの方法をご紹介しています。 Autonomous Database を使ってみよう（移行編） 301: 移行元となるデータベースを作成しよう（本章） 302: スキーマ・アドバイザを活用しよう 303: Data Pumpを利用してデータを移行しよう [304: ZDM/DMSを利用し、ダウンタイムを最小限に移行しよう（準備中）] 本章（301）では後続の章の準備作業として、移行元となる既存オンプレミスのOracle Databaseを想定しDBCSインスタンスを作成します。 目次 : 1.移行元となるDBCSインスタンスの作成 2.移行対象となるサンプルスキーマ(HR)をインストール 3.サンプルスキーマ(HR)への接続、スキーマの確認 所要時間 : 約150分 (DBCSインスタンスの作成時間を含む) 1. 移行元となるDBCSインスタンスの作成 まず、「Oracle Cloud で Oracle Database を使おう(DBCS)」 を参考に、DBCSインスタンスを作成してください。 TeraTermを起動しDBCSインスタンスにSSHでアクセスするところから、PDB上のスキーマにアクセスするところまで一通り実施いただくとスムーズです。 以降では、DBCSインスタンスが以下の値で作成されていることを前提として記載しています。（その他、DBシステム名やシェイプ等は基本的に任意です） ホスト名接頭辞 : dbcs01 データベースのバージョン：12.2 パスワード：WelCome123#123# PDBの名前：pdb1 2. 移行対象となるHRスキーマをインストール 次に作成したDBCSインスタンス内に、移行対象となるHRスキーマを作成します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb301-create-source-db/",
        "teaser": "/ocitutorials/database/adb301-tac/sa00x.png"
      },{
        "title": "302 : スキーマ・アドバイザを活用しよう",
        "excerpt":"はじめに Autonomous Databaseでは性能・可用性・セキュリティの観点から特定のデータベースオブジェクトの作成が制限されています。 具体的な制限事項はマニュアルに記載がございますが、これら制限対象のオブジェクトを利用しているか確認するために、オラクルはSchema Advisorというスクリプト・ツールを提供しています。 この章では先の301: 移行元となるデータベースを作成しようにて事前に作成しておいたDBCSインスタンスを利用して、Schema Advisorの使い方をご紹介します。 目次 : 1.Schema Advisorとは？ 2.事前準備 2-1.パッケージのダウンロード 2-2.パッケージのインストール 3.実行と結果確認 4.パッケージのアンインストール 前提条件 : My Oracle Supportへのログイン・アカウントを保有していること 301: 移行元となるデータベースを作成しようを完了していること 所要時間 : 約30分 1. Schema Advisor とは？ Autonomous Databaseにオブジェクトを移行する際に、制限事項に抵触しているオブジェクトの有無を調べるパッケージです。 スキーマを指定することで、対象スキーマに格納されているオブジェクトの移行可否、不可となるオブジェクトについてはその理由と対処方法を出力してくれるツールです。 尚、現時点でサポート対象となるOracle Databaseのバージョンは以下となっています。 10.2 and higher including 11g, 12c, 18c and 19c（2021/8時点） 2. 事前準備 2-1. パッケージのダウンロード まずはパッケージを入手し、調査対象となるデータベース環境で実行できる場所に配置します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb302-schema-adviser/",
        "teaser": "/ocitutorials/database/adb302-xxx/sa00x.png"
      },{
        "title": "303 : Data Pumpを利用してデータを移行しよう",
        "excerpt":"はじめに Oracle Databaseのデータ移行として、ここでは従来からよく利用されるData Pumpを利用してAutonomous Databaseに移行する手順をご紹介します。 先の「301 : 移行元となるデータベースを作成しよう」にて事前に作成しておいたDBCSインスタンス上のHRスキーマを、以下の流れに沿ってAutonomous Databaseに移行してみたいと思います。 目次 : 1.移行対象のスキーマをエクスポート 2.オブジェクトストレージへのアクセストークンを取得 3.ダンプファイルをオブジェクトストレージにアップロード 4.Autonomous Databaseへのインポート 補足 チュートリアルを実施する上で、DBCSインスタンスを用意できない場合や、どうしてもエクスポートが成功しないと言った場合は、以下よりエクスポート済みのダンプファイルを配置しておりますので、適宜ダウンロードください。 上記ステップ2から実施いただくことが可能です。 ダンプファイル(export_hr_01.dmp)のダウンロード ダンプファイル(export_hr_02.dmp)のダウンロード ダンプファイル(export_hr_03.dmp)のダウンロード ダンプファイル(export_hr_04.dmp)のダウンロード 前提条件 : 「204: マーケットプレイスからの仮想マシンのセットアップ方法」を完了していること 「301 : 移行元となるデータベースを作成しよう」を完了していること 所要時間 : 約30分 1. 移行対象のスキーマをエクスポート HRスキーマをData Pumpを利用してDBCSインスタンスのOS上のファイルシステムにエクスポートします。 （補足） 本チュートリアルではOCI DBCSにプリインストールされているData Pumpを利用しますが、12.2.0.1以前のOracle Clientを利用する場合や、その他詳細情報についてはマニュアル（ADW / ATP）を参照ください。 パラレルオプションを利用する場合、ソースDBがEnterprise Editionである必要があります。 圧縮オプションを利用する場合、ソースDBが11g以上でありAdvanced Compression Optionが必要になります。 1-1....","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb303-datapump/",
        "teaser": "/ocitutorials/database/adb303-xxx/img00x.png"
      },{
        "title": "304: OCI Database Migration Serivce(DMS) を利用して、ダウンタイム最小限に移行しよう",
        "excerpt":"   Oracle Cloud Infrastructure Database Migration Service (DMS)は、オンプレミスまたはOCI上のOracle DatabaseからAutonomous Databaseに移行する際に利用できるマネージド・サービスです。DMSは内部的にOracle GoldenGateによるレプリケーションを利用しており、移行に伴うアプリケーションのダウンタイムを極小化することが可能です。   Database Migrationのチュートリアル(LiveLabs)は下記に用意がございますので、ご利用ください。   OCI Database Migration Workshop   尚、上記は英語での提供になりますが、必要に応じてブラウザ翻訳をご利用ください。ブラウザ翻訳の利用方法を含めてOracle LiveLabsの使い方はこちら     以上で、この章は終了です。  次の章にお進みください。     ページトップへ戻る   ","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb304-database-migration/",
        "teaser": "/ocitutorials/database/adb304-database-migration/teaser.png"
      },{
        "title": "401 : OCI GoldenGateによるDBCSからADBへのデータ連携",
        "excerpt":"はじめに Oracle Cloud Infrastructure (OCI) GoldenGateはフルマネージド型のリアルタイムデータ連携サービスとなっています。 OCI GoldenGateサービスは、構成、ワークロード・スケーリング、パッチ適用などの多くの機能を自動化しており、従量課金制で利用することが可能です。そのため時間や場所を選ばずに、低コストでデータの連携、分析ができるようになります。 この章では、OCI GoldenGateの作成とDBCSからADBへのデータ連携の設定について紹介します。 目次 : 1.ソース・データベースの設定 2.ターゲット・データベースの設定 3.OCI GGデプロイメントの作成 4.データベースの登録 5.Extractの作成 6.チェックポイント表の作成 7.Replicatの作成 8.データ連携の確認 前提条件 : 本チュートリアルではDBCS、ADBともにデータベースの作成が完了しており、初期データとしてHRスキーマがそれぞれのデータベースにロードされていることを前提にしています。 各データベースの作成方法やデータロードの方法は下記手順をご確認ください。 DBCSの作成については、「101: Oracle Cloud で Oracle Database を使おう(DBCS)」 をご参照ください。 データ連携用のサンプルデータはHRスキーマを使用しています。DBCSでのHRスキーマ作成方法は、「301: 移行元となるデータベースを作成しよう」 をご参照ください。 ADBの作成については、「101:ADBインスタンスを作成してみよう」 をご参照ください。 ADBの初期データロードについては、「303 : Data Pumpを利用してデータを移行しよう」 をご参照ください。 チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、DBCSを含めて各ユーザのパスワードはすべて「Welcome#1Welcome#1」とします。 所要時間 : 約60分 1. ソース・データベースの設定...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb401-oci-goldengate/",
        "teaser": "/ocitutorials/database/adb401-oci-goldengate/instancetop.png"
      },{
        "title": "402 : Database Linkによるデータ連携",
        "excerpt":"はじめに 従来からOracle Databaseをご利用の方にはお馴染みのDatabase Linkですが、Autonomous Database でもこのDatabase Linkをお使いいただくことが可能です。 Database Linkは、他のOracle Database インスタンスからデータを移行・連携・収集するための便利な機能です。 Autonomous Databaseでは以下の3つのパターンでDatabase Linkを作成いただくことができます。 本文書では2-1のパターンであるAutonomous Database（リンク元）にDatabase Linkを作成し、 他のOracle Database（リンク先）にアクセスする手順を記載します。 その後、補足と言う形でパターン1, 2-2についても記載します。 なお、本文書ではパブリックIPアドレスを持つDBCSを前提としています。プライベートIPアドレスへのDatabase Link作成については、こちらの記事 で紹介しています。 ご不明な点がございましたら、担当営業までお問い合わせください。 目次 : 1.DBCSインスタンスの作成およびスキーマのインポート 2.DBCSにてTCPS認証（SSL認証）を有効化 3.DBCSのウォレットファイルをADBに渡す 4.VCNのイングレス・ルールを更新 5.ADBにてDatabase Linkを作成 6.エラーへの対応例 7.その他のパターン 8.おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約100分（DBCSインスタンスの作成時間を含む） 1. DBCSインスタンスの作成およびスキーマのインポート まず、サンプル・データベースとして、Database Linkのリンク先となるDBCSインスタンスを作成します。 301 :...","categories": [],
        "tags": [],
        "url": "/ocitutorials/database/adb402-database-link/",
        "teaser": "/ocitutorials/database/adb402-database-link/DatabaseLink_teaser.jpg"
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
        "title": "505 : Autonomous Databaseのバックアップとリストアを体感しよう",
        "excerpt":"はじめに Autonomous Databaseでは自動的バックアップがオンラインで取得され、60日間保持されます。自動バックアップは、週次完全バックアップおよび日次増分バックアップです。インスタンス構成時にデフォルトで有効化されており、無効化することはできません。また、Autonomous Databaseの自動バックアップはオブジェクトストアに出力されますが、それに対する課金はございません。 ユーザ自身がGUIやAPIを介して特定時点にリストアすることが可能です。本チュートリアルにおいても、Point-in-timeリカバリを実施いたします。 （補足） バックアップ操作中は、データベースは使用可能なままです。ただし、データベースの停止、スケーリング、終了などのライフサイクル管理操作は無効化されます。 目次 : 自動バックアップの確認 データベースに表を新規作成 タイムスタンプをUTCで確認 Point-in-timeリカバリ おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約30分 自動バックアップの確認 Autonomousa Databaseの詳細画面 下にスクロールして、画面左側のタブのバックアップをクリックし、これまでバックアップ履歴を確認します。 自動バックアップが日時で取られているのが確認できます。 特に設定を行わずとも、自動バックアップが構成されています。 全て増分バックアップになっており、週次で取得されているフルバックアップが無いのでは？と思われたかもしれませんが、こちらは誤りではなく、フルバックアップはRMANでは増分バックアップのLevel0となるので、この一覧では全て増分バックアップとして表示されております。 Autonomous Databaseでは、週次でフル(Level0)、日次で増分(Level1)が取得され、毎時でアーカイブログがバックアップされています。 60日前までの任意のタイミングにタイミングにリストア・リカバリが可能になっています。 RMANを利用しており、ブロック破損のチェックも同時に行われているため信頼できるバックアップになっています。 また、Automonous Databaseでは、これらのバックアップを格納しておくストレージストレージの追加コストは不要です。 データベースに表を新規作成 では、この段階で新規でEmployee表を作成し、１行をインサートしてみます。 データベースの詳細画面のデータベース・アクションをクリックします。 開発のSQLをクリックします。 SQLワークシートにて、下記のSQLを実行し、Employees表を新規作成します。 CREATE TABLE EMPLOYEES ( FIRST_NAME VARCHAR(100), LAST_NAME VARCHAR(100) ); SQLワークシートにて、下記のSQLを実行し、Employees表に新規で行インサートします。...","categories": [],
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
        "title": "OIC インスタンスを作成する",
        "excerpt":"Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。このハンズオンでは OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介します。 OIC インスタンスの作成前に確認すること OIC インスタンスを作成する前の確認事項について説明します。 1. Oracle Cloud アカウントの準備 Oracle Cloud のアカウントを準備します。無料のトライアル環境（フリートライアル）と有料のクラウド・アカウントのご利用が可能です。 無料のトライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です。詳細は下記URLのページをご確認ください。 Oracle Cloud 無料トライアルを申し込む トライアル環境のサインアップ手順はこちらをご確認ください。 Oracle Cloud 無料トライアル・サインアップガイド(PDF) Oracle Cloud 無料トライアルに関するよくある質問(FAQ) 2. 作成可能なリージョンの確認 OIC インスタンスを作成可能なリージョンを確認します。詳細はこちらのマニュアルをご確認ください。 3. 制限事項の確認 クラウド・アカウントの発行時期により、作成可能な OIC インスタンスの種類が異なります。こちらのマニュアルに、OCI コンソールから作成する OIC Generation 2 インスタンスの作成条件が記載されています。 4. エディションの確認 (Standard or Enterprise) OIC は、2つのエディション(Standard...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/integration-for-commons-1-instance/",
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
        "title": "モニタリング機能でOCIのリソースを監視する",
        "excerpt":"システムを運用する際にはアプリケーションやシステムの状態に異常がないかを監視して問題がある場合には対処をすることでシステムの性能や可用性を高めることが可能です。 OCIで提供されているモニタリング機能を使うことで、OCI上の各種リソースの性能や状態の監視、また、カスタムのメトリック監視を行うことが可能です。また、アラームで事前定義した条件に合致した際には管理者に通知を行うことで管理者はタイムリーに適切な対処を行うことができます。 コンピュートやブロックボリュームなどのOCIリソースに対してはモニタリングはデフォルトで有効になっています。 この章では、コンピュート・インスタンスを対象にして性能メトリックの参照の方法を理解し、問題が発生した場合のアラーム通知設定を行って管理者へのメール通知を行います。 所要時間 : 約30分 前提条件 : インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) を通じてコンピュート・インスタンスの作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. ベースになるインスタンスの作成 まずは、監視対象となるインスタンスを作成します。今回は、インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3) で作成したコンピュート・インスタンスを使用します。 ただし、Oracle提供イメージを使い、モニタリングの有効化を行っているインスタンスのみが対象です。（デフォルトは有効） インスタンス作成時にモニタリングを有効化するには、作成画面下部の 拡張オプションの表示 をクリックしてオプションを表示させ、モニタリングの有効化 のチェックボックスにチェックが入っていることを確認してください。 2. モニタリング・メトリックの参照（各リソースの詳細画面からの参照） 作成済みのコンピュート・インスタンスの詳細ページから、メトリックを参照することができます。 コンソールメニューから コンピュート → インスタンス を選択し、作成したインスタンスのインスタンス名のリンクをクリックするか、右側の ・・・ メニューから インスタンスの詳細の表示 を選択し、インスタンス詳細画面を開きます。 画面左下の リソース から...","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/monitoring-resources/",
        "teaser": "/ocitutorials/intermediates/monitoring-resources/image-20210112132107310.png"
      },{
        "title": "ロードバランサーでWebサーバーを負荷分散する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure ロードバランサー・サービスを利用することにより、仮想クラウド・ネットワーク(VCN)内の複数のサーバーに対して一つのエントリーポイントからのネットワーク・トラフィックを分散させることができます。ロードバランサー・サービスは、パブリックIPアドレスの分散を行うパブリック・ロードバランサーと、プライベートIPアドレスの分散を行うプライベート・ロードバランサーの2種類が提供されます。双方のタイプのロードバランサーとも、一定の帯域(100MB/s~8000MB/s)の保証と、高可用性がデフォルトで提供されます。またパブリック・ロードバランサーについてはVCN内の2つの異なるサブネットに跨って構成されるため、アベイラビリティ・ドメイン全体の障害に対する耐障害性が提供されます。 この章では、シンプルなパブリック・ロードバランサーを構成し、VNC内の2台のWebサーバーに対する負荷分散を構成する手順について学習します。 所要時間 : 約50分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること 2048bit 以上のRSA鍵ペアを作成していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 : 仮想クラウド・ネットワークと2つのサブネットの作成 2つのインスタンスの作成とWebサーバーの起動 ロードバランサー用のサブネットの作成 ロードバランサーの構成 ロードバランサーへのhttp通信許可の設定 ロードバランサーの動作の確認 Webサーバーの保護 1. 仮想クラウド・ネットワークと2つのサブネットの作成 その2 - クラウドに仮想ネットワーク(VCN)を作る を参考に、仮想クラウド・ネットワーク(VCN)および付随するネットワーク・コンポーネントを作成してください。 作成時に 仮想クラウド・ネットワークおよび関連リソースの作成 オプションで作成することで、簡単に今回のチュートリアルに必要なVCNおよび付随コンポーネントを作成することができます。 この章では、Tokyoリージョン (可用性ドメインが1つの構成) を例として、最終的に下記のような構成を作成します。...","categories": [],
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
        "title": "Email Deliveryを利用した外部へのメール送信(その1　配信環境構築編)",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/sending-emails-1/",
        "teaser": null
      },{
        "title": "GPUインスタンスでディープラーニング",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/deep-learning-with-gpu/",
        "teaser": null
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
        "teaser": "/ocitutorials/intermediates/using-cli/img5.png"
      },{
        "title": "OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する",
        "excerpt":"OCI Observability&amp;Managementのサービスの1つ、Logging Analyticsでは様々なログを可視化、分析する機能を提供します。 Logging AnalyticsではOCIの各種ログ(VCN, Load Balancer, Audit…)だけでなく、エージェントを使用することでOSやデータベース、Webサーバーなどのログを可視化、分析することが可能です。 この章では、エージェントは利用せず簡単な操作でOCIの監査ログをLogging Analyticsで分析する手順をご紹介します。 所要時間 : 約20分 前提条件 : Logging Analyticsが有効化されていること OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. IAMポリシーの作成 Logging Analyticsを利用するためにはOCIの他のサービスと同様に、IAMポリシーによってアクセス権限が付与されている必要があります。 以下のポリシーをテナンシで作成してください。 ※この章では、ユーザーにLogging Analyticsの管理権限を付与します。ユーザーはログ・アナリティクスの構成やログファイルのアップロード、削除を含む全ての管理権限を行うことができます。ドキュメント を参考にユーザーの役割、ロールごとにIAMポリシーの権限を調整してください。 ※OCIのテナンシ管理者がLogging Analyticsを利用する場合は、作成するポリシーは「1-2.Logging Analyticsサービスへのポリシー」のみになります。その他のポリシーは作成する必要はありません。 1-1. Loggingサービスを利用するためのポリシー allow group &lt;IAMグループ名&gt; to MANAGE logging-family in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/intermediates/audit-log-analytics/",
        "teaser": "/ocitutorials/intermediates/audit-log-analytics/audit-loganalytics16.png"
      },{
        "title": "TerraformでOCIの構築を自動化する",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/terraforming/",
        "teaser": null
      },{
        "title": "OCI Valut (OCI Key Management) でBYOKをする",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/byok-with-vault/",
        "teaser": null
      },{
        "title": "OCI Database Cloud ServiceでDatabase Managementを有効化する",
        "excerpt":"OCI Observability &amp; Managementのサービスの1つ、Database Managementでは、Enterprise Managerで提供されているパフォーマンス分析の機能を中心に、Oracle DBのパフォーマンスを監視することが可能です。本章では、OCIのDatabase Cloud ServiceでDatabase Managementを有効化する手順を紹介します。Database Cloud ServiceでDatabase Managementを有効化する場合、エージェントレスで利用を開始することが出来ます。 所要時間 : 約50分 前提条件 : OCIのDatabase Cloud Serviceが1インスタンス作成されていること DBCSインスタンスの作成方法はその8-クラウドでOracle Databaseを使うをご参照ください。 注意 : ※監視対象のDBCSがStandard Editionの場合、Database Managementの一部機能をご利用いただけませんのでご注意ください。 1. IAMポリシーの作成 Database Managementを利用するためにはOCIの他のサービスと同様に、IAMポリシーによってアクセス権限が付与されている必要があります。 以下のポリシーをテナンシで作成してください。 1-1. ユーザーがDatabase Managementを利用するためのポリシー allow group &lt;IAＭグループ名&gt; to MANAGE dbmgmt-family in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to MANAGE...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/intermediates/dbcs-database-management/",
        "teaser": "/ocitutorials/intermediates/dbcs-database-management/dbmgmt1.png"
      },{
        "title": "Web Application Firewall(WAF)を使ってWebサーバを保護する",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/protecting-web-servers-with-waf/",
        "teaser": null
      },{
        "title": "Oracle Management Cloud チュートリアルまとめ",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/management-cloud-tutorials/",
        "teaser": null
      },{
        "title": "Cloud Guardを使ってみる",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/cloud-guard/",
        "teaser": null
      },{
        "title": "Oracle Data Safe チュートリアルまとめ",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。   1.Oracle Data Safeを有効化する  2.Oracle Data Safeのデータ・マスキングを試してみる  3.Oracle Data Safeのアクティビティ監査で操作ログを記録する  4.Oracle Data Safeにフェデレーッド・ユーザーでアクセスする  5.プライベートIPアドレスでData SafeにDBを登録する  6.Oracle Data SafeでオンプレミスのOracle DBを管理する  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/data-safe-tutorials/",
        "teaser": null
      },{
        "title": "OCI Database ManagementでOracleDBのパフォーマンス監視をする",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
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
        "title": "ロギング・サービスを使って3つのログを収集する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル ロギング・サービスを使用することによりさまざまなログを一元的に収集して1つのビューにまとめます。なので万が一トラブルが発生しても、ログをすぐに確認し素早く対策できます。 ロギング・サービスは監査ログ、サービス・ログ、カスタム・ログの3つのログを使用できます。ログはOCIのリソースだけでなく、他社クラウドやオンプレミスの環境のログも取得できます。また他のOracleサービスと統合することができて、ログをEmailなどを通じて通知させたり、OCIモニタリングにメトリックを発行してアラームと統合したりすることが可能です。さらにLogging Analyticsを併用することで、よりログを細かく分析できます。 今回のチュートリアルではこの3つのログをコンソールからアクセスします。 所要時間： 15分 前提条件： その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること その3 - インスタンスを作成するが完了していること その7 - オブジェクト・ストレージを使うの コンソール画面の確認とバケットの作成 が完了していること（サービス・ログを使用する際にオブジェクトストレージのログを収集します） 注意: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 目次 : 監査ログ サービス・ログ カスタム・ログ 1. 監査ログ 監査ログはOCI上のAPIコールをデフォルトで収集します。 メニューから 監視および管理 → ロギング を選択すると監査ログのデータが一覧で表示されます。監査ログの詳しい説明に関しては、以下のチュートリアルを参照してください。 監査(Audit)ログを使用したテナント監視 2. サービス・ログ サービス・ログでOCIネイティブ・サービス（APIゲートウェイ、イベント、ファンクション、ロード・バランシング、オブジェクト・ストレージ、VCNフロー・ログなど）のログを取得できます。今回はオブジェクトストレージの読み取りのログデータを収集します。 2-1　ログ・グループの作成 まず初めにログ・グループを作成します。メニューから 監視および管理 →...","categories": [],
        "tags": ["intermediate","logging"],
        "url": "/ocitutorials/intermediates/using-logging/",
        "teaser": "/ocitutorials/intermediates/using-logging/img1.png"
      },{
        "title": "監査(Audit)ログを使用したテナント監視",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル **監査 (Audit) **サービス とは、テナンシ内のアクティビティを、ログとして自動的に記録してくれるサービスです。具体的には、Oracle Cloud Infrastructureコンソール、コマンドライン・インタフェース(CLI)、ソフトウェア開発キット(SDK)、ユーザー独自のクライアント、または 他のOracle Cloud Infrastructureサービスによって行われるAPIコール が記録されます。 監査ログは そのままではただ蓄積されるだけですが、サービス間連携を担う「サービス・コネクタ・ハブ」を使用し、「通知」サービスと組み合わせることで、「特定の操作が行われた場合に検知してメールで通知させる」といった応用が可能です。 この章では、監査ログを サービス・コネクタ・ハブ、および 通知サービス と連携させ、テナンシ内の特定コンパートメントで「バケットが作成された場合に通知する」という設定を行っていきたいと思います。 巻末にはその他の監視内容についても、いくつかのサンプルを記載していますので、参考にしてください。 所要時間 : 約20分 前提条件 : チュートリアル : モニタリング機能でOCIのリソースを監視する の「4. アラームの通知先の作成」を完了し、Eメールを受信可能な トピック 及び サブスクリプション が 登録済みであること。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 1. サービス・コネクタ・ハブの作成 監査サービスは、テナンシ開設時にデフォルトで有効化されているため、特に事前準備は必要ありません。 まずは、サービス・コネクタ・ハブから作成していきましょう。 ナビゲーション・メニュー（...","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/serviceconnecterhub/",
        "teaser": "/ocitutorials/intermediates/serviceconnecterhub/image01.png"
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
        "title": "OCI Data Integrationチュートリアル",
        "excerpt":"はじめに OCI Data Integration はOCIで利用できるGUIベースのETLサービスです。 このチュートリアルではオブジェクト・ストレージ上のデータを変換し、Autonomous Databaseにロードを行っていきます。 OCI Data Integrationドキュメントに掲載されているチュートリアルの一部です。 目次 : 1.サンプルデータのロードとターゲット表の作成 2.Data Integrationを利用するための準備 3.ワークスペースの作成 4.データ・アセットの作成 5.プロジェクトとデータ・フローの作成 6.データ・フローの編集 7.タスクの作成 8.アプリケーションの作成とタスクの公開と実行 前提条件 : Data Integrationを利用するコンパートメントを準備してください。 Autonomous Databaseのエンドポイントはパブリックエンドポイントとしています。 1. サンプルデータのロードとターゲット表の作成 ソースとなるオブジェクト・ストレージにファイルをアップロードし、ターゲットとなるAutonomous Databaseにロード先の表を作成します。 ソース：オブジェクト・ストレージ オブジェクト・ストレージにサンプルデータをロードします。 バケットを作成し、次の2つのファイルをアップロードしてください。 ファイルへのリンク : CUSTOMERS.json / REVENUE.csv バケットの作成とファイルのアップロード手順は“その7 - オブジェクト・ストレージを使う”をご確認ください。 ターゲット：Autonomous Database Autonomous Databaseインスタンスを作成しユーザーを作成します。手順は“101:ADBインスタンスを作成してみよう”をご確認ください。ユーザー名は任意ですが、このチュートリアルでは、BETAとします。作成したユーザーBETAで以下のSQLでCUSTOMER_TARGET表を作成してください。 CUSTOMERS_TARGET表作成SQL CREATE TABLE \"BETA\".\"CUSTOMERS_TARGET\"...","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/ocidi-tutorials/",
        "teaser": "/ocitutorials/intermediates/ocidi-tutorials/top.png"
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス・リミット、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 無償トライアル環境のお申込みについては こちら の資料を参照してください。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります image サポートされるブラウザの確認 このチュートリアルでは、Oracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナント名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID ユーザー名 - ログインのためのユーザー名 パスワード - ログインのためのパスワード ログイン情報の入手方法は、ユーザーが作られるタイミングによって異なります。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/webapp/01-getting-started/",
        "teaser": null
      }]
