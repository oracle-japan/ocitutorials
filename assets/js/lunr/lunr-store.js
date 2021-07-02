var store = [{
        "title": "準備 - Oracle Cloud 無料トライアルを申し込む",
        "excerpt":"Oracle Cloud のほとんどのサービスが利用できるトライアル環境を取得することができます。このチュートリアルの内容を試すのに必要になりますので、まずは取得してみましょう。 ※認証のためにSMSが受け取れる電話とクレジット・カードが必要です(希望しない限り課金はされませんのでご安心を!!)      Oracle Cloud 無料トライアル サインアップガイド   Oracle Cloud Free Tierに関するFAQ  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/acquiring-free-trial/",
        "teaser": null
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス・リミット、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 参考動画： 本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 1.コンソール 　 1. サポートされるブラウザの確認 このチュートリアルでは、Oracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 2. ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナント名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID...","categories": [],
        "tags": ["beginner","network"],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/getting-started/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/getting-started/img2.png"
      },{
        "title": "その2 - クラウドに仮想ネットワーク(VCN)を作る",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure を利用するにあたっての最初のステップは、仮想クラウド・ネットワーク(Virtual Cloud Network : VCN) を作成することです。ネットワークの管理者が最初に仮想ネットワークを作ることで、その後インスタンスの管理者やストレージの管理者が、作成した仮想ネットワークの構成やルールに従ってコンポーネントを配置することができるようになります。 このチュートリアルでは、コンソール画面から仮想クラウド・ネットワーク(VCN)を1つ作成し、その構成について確認してくことで、OCIのネットワークに対する理解を深めます。 所要時間 : 約15分 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、管理権限を持つユーザーアカウントがあること その1 - OCIコンソールにアクセスして基本を理解するを完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. 仮想クラウドネットワーク(VCN)とは? 2. 仮想クラウド・ネットワークの作成 3. 作成した仮想クラウド・ネットワークの確認 参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 2.仮想クラウドネットワーク...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn/img4.png"
      },{
        "title": "その3 - インスタンスを作成する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル この章では、作成済みの仮想クラウド・ネットワーク(VCN)の中にコンピュート・インスタンスを作成していきます。 所要時間 : 約20分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. 新規仮想マシンインスタンスの作成 2. 作成したインスタンス詳細情報の確認 3. インスタンスへの接続 参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 3.コンピュート・インスタンス 1. 新規仮想マシンインスタンスの作成 第2章で作成した仮想コンピュート・ネットワーク(VCN)に、新しくインスタンスを作成していきます。 今回はコンソールから、一番小さなシェイプ(1 OCPU)の仮想マシン(VM)タイプの Oracle Linux 7 のインスタンスを1つ作成します。 コンソールメニューから コンピュート → インスタンス...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/img11.png"
      },{
        "title": "その4 - ブロック・ボリュームをインスタンスにアタッチする",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure ブロック・ボリューム・サービスを利用することにより、ベアメタル・インスタンスや仮想マシン・インスタンスからブロックデバイスとして利用することができるボリュームを、簡単に作成、管理することができます。用途に応じたサイズのボリュームを作成、インスタンスへのアタッチ、変更などが可能です。インスタンスからボリュームに対するアクセスは iSCSI もしくは準仮想化を通じて行われます。 インスタンスにアタッチしたボリュームは、通常のディスク・ドライブと同じようにOSから利用することができ、またインスタンスからデタッチし、新しい別のインスタンスにアタッチすることで、データを失うことなく移行することが可能です。 ブロック・ボリュームの典型的なユースケースとしては以下のようなものがあります。 インスタンスのストレージの拡張 : Oracle Cloud Infrastructure の ベアメタル・インスタンス、仮想マシン・インスタンスいずれに対しても、ブロック・ボリュームをアタッチすることでOSのストレージ領域を拡張することができます。 永続化されたストレージ領域の利用 : インスタンスを終了(Terminate)しても、ブロック・ボリュームとそこに格納されたデータは永続します。これらはボリュームを明示的に終了(Terminate)するまで存続します。 インスタンス間のデータの移動 : インスタンスにアタッチしたブロック・ボリュームをデタッチし、別のインスタンスにアタッチすることにより、1つのインスタンスから別のインスタンスにデータを簡単に移動させることができます。 このチュートリアルでは、ブロック・ボリュームの基本的な使い方をご案内します。 ブロック・ボリュームのバックアップについては応用編のブロック・ボリュームをバックアップする をどうぞ。 所要時間 : 約20分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る とその3 - インスタンスを作成する を完了し、仮想クラウド・ネットワーク(VCN)の中に任意のLinuxインスタンスの作成が完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 参考動画：...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/attaching-block-volume/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/attaching-block-volume/img6.png"
      },{
        "title": "その5 - インスタンスのライフサイクルを管理する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル リソースを必要なときに必要なだけ使える、というのがクラウドのいいところですね。そのために作成したインスタンスはいつでも停止、再起動、終了、再作成といった処理が行えるようになっています。このチュートリアルでは、そのようなインスタンスのライフサイクル管理をどう行うかと、それぞれのステータスで実際にインスタンスがどのような状態になっているのかについて確認していきます。 所要時間 : 約20分 前提条件 : その3 - インスタンスを作成する を通じてコンピュート・インスタンスの作成が完了していること その4 - ブロック・ボリュームをインスタンスにアタッチする を通じてブロック・ボリュームのアタッチが完了していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 : インスタンスの停止、再起動 インスタンスの終了(Terminate) ブート・ボリュームからのインスタンスの再作成 参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 5.インスタンスのライフサイクル 1. インスタンスの停止、再起動 まずは、インスタンスの停止、再起動処理と、その際に実行される動作について確認していきましょう。 1-1. ブートボリュームへのファイルの作成 OCIのインスタンスは、すべてブート・ボリュームと呼ばれる永続化されたiSCSIデバイスからネットワーク経由でブート(iPXEブート)されます。 このブート・ボリュームの変更(OSのパラメーター変更など)が、インスタンスのライフサイクル操作によってどのような影響を受けるかを確認するために、予めファイルを1つ作成します。 SSHターミナルを開き、 で作成したインスタンスにsshでアクセスします アクセスしたユーザーホームディレクトリに、任意のファイルを作成します。 下記の例では、opcユーザーのホームディレクトリ(/home/opc)に、testfileというファイルを作成しています...","categories": [],
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
        "excerpt":"チュートリアル一覧に戻る : 入門編 - Oracle Cloud Infrastructure を使ってみよう Oracle Cloud Infrastructureオブジェクト・ストレージ・サービスは、高い信頼性と高い費用対効果を両立するスケーラブルなクラウドストレージです。 オブジェクト・ストレージを利用すると、分析用のビッグ・データや、イメージやビデオ等のリッチ・メディア・コンテンツなど、あらゆるコンテンツ・タイプの非構造化データを無制限に保管できます。 オブジェクト・ストレージはリージョン単位のサービスで、コンピュート・インスタンスからは独立して動作します。 ユーザーはオブジェクト・ストレージのエンドポイントに対し、OCIの内部、外部を問わずどこからでもアクセスすることができます。 OCIのIdentity and Access Management(IAM)機能をを利用した適切なアクセスコントロールや、リソース・リミットを設定することも可能です。 この章では、コンソール画面からオブジェクト・ストレージにアクセスし、スタンダード・バケットの作成やオブジェクトのアップロード、ダウンロードなどの基本的な操作、また事前認証リクエストを作成して一般ユーザー向けにダウンロードリンクを生成する手順について学習します。 所要時間 : 15分 前提条件 : 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切なオブジェクト・ストレージの管理権限がユーザーに付与されていること 注意 : チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 7.オブジェクト・ストレージ 1. コンソール画面の確認とバケットの作成 オブジェクト・ストレージ・サービスにおいて、バケットはオブジェクトを格納する箱として機能します。 バケットはコンパートメントに紐付ける必要があり、バケットおよびその中のオブジェクトに対する操作に関する権限は、コンパートメントのポリシーを通じて制御します。 まず、コンソール画面からバケットを作成していきます。 コンソールメニューから ストレージ → オブジェクト・ストレージ を選択し、バケットの作成 ボタンを押します 立ち上がった バケットの作成...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/beginners/object-storage/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/beginners/object-storage/001.webp"
      },{
        "title": "その8 - クラウドでOracle Databaseを使う",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。   参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。      Oracle Cloud Infrastructure ハンズオン - 8.データベース  ","categories": [],
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
        "title": "Oracle Blockchain Platformのインスタンス作成",
        "excerpt":"この文書は Oracle Blockchain Platform（OBP）のインスタンス作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年4月時点での最新バージョン(21.1.2)を元に作成されています。 1. 準備 1.1 Oracle Cloud の環境を準備する Oracle Cloud のアカウントを準備します。現在、OBP は無料トライアル期間（Free Trial Credit）および Always Free で利用できるサービスには含まれていないため、有償アカウントが必要です。 1.2 Oracle Cloud にサイン・インする OBP インスタンスは、Oracle Cloud Infrastructure コンソール（以降 OCI コンソール）から作成します。ここでは、前の手順で作成した テナント管理ユーザー で OCI コンソールにアクセスします。 こちらのチュートリアルもあわせてご確認ください。 その 1 - OCI コンソールにアクセスして基本を理解する Web ブラウザで、以下の URL にアクセスします。 https://cloud.oracle.com Cloud Account Name （クラウドアカウント名）...","categories": [],
        "tags": ["Blockchain"],
        "url": "https://oracle-japan.github.io/ocitutorials/blockchain/01_1_create_instance/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/blockchain/01_1_create_instance/create_compartment_form.png"
      },{
        "title": "Participant インスタンスをブロックチェーン・ネットワークに参加させる",
        "excerpt":"この文書は Oracle Blockchain Platform（OBP） の Participant インスタンスをブロックチェーン・ネットワークに参加させる方法をステップ・バイ・ステップで紹介するチュートリアルです。 このチュートリアルではふたつの OBP インスタンスでブロックチェーン・ネットワークを構成していますが、3 以上のインスタンスから成るブロックチェーン・ネットワークを構成する場合にも、基本的に同一の手順で実施可能です。 この文書は、2021年4月時点での最新バージョン(21.1.2)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 Founder インスタンスと Participant インスタンスそれぞれのインスタンスを所持 0. 前提の理解 0.1 Founder インスタンスと Participant インスタンス OBP はパーミッション型のブロックチェーンプロトコルである Hyperledger Fabric をベースとしたブロックチェーンプラットフォームです。OBP はひとつ～複数のインスタンスでブロックチェーン・ネットワークを構成することができます。 OBP インスタンス作成時に、「プラットフォーム・ロール」の項目で、インスタンス作成と同時にブロックチェーン・ネットワークを新たに作成する（→Founder インスタンス）か、既存のブロックチェーン・ネットワークに参加することを前提にインスタンスを作成する（→Participant インスタンス）かを選択します。 Founder インスタンスの場合は、作成したブロックチェーン・ネットワークに参加した状態でインスタンスが作成されるため、そのままで各種のオペレーションが可能です。 一方、Participant インスタンスの場合は、まずブロックチェーン・ネットワークへの参加が必要です。 0.2 このチュートリアルでの例となるインスタンス名とブロックチェーン・ネットワーク構成 このチュートリアルの例では、 Founder2104 というインスタンス名の Founder インスタンスと、...","categories": [],
        "tags": ["Blockchain"],
        "url": "https://oracle-japan.github.io/ocitutorials/blockchain/01_2_join_participant/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/blockchain/01_2_join_participant/founder_step2.png"
      },{
        "title": "Channelを作成し、インスタンスおよびPeerノードを参加させる",
        "excerpt":"この文書は Oracle Blockchain Platform（OBP）で Channel を作成する方法、および Channel への インスタンスとPeer ノードの追加をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年4月時点での最新バージョン(21.1.2)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 0. 前提の理解 0.1 Hyperledger Fabric における Channel OBP はパーミッション型のブロックチェーンプロトコルである Hyperledger Fabric をベースとしたブロックチェーンプラットフォームです。 Hyperledger Fabric では、ブロックチェーン・ネットワークの中でのデータとロジックの共有範囲の制御などのための機能として、Channel という仕組みを備えています。Channel はブロックチェーン・ネットワークに対してある種のサブネットワークとして機能し、Channel ごとに参加する Organization、Peer、Orderer を構成したり、動作させる Chaincode を定義したりすることなどができます。 Channel はまず Organization レベルで参加し、その後 Organization 内で配下の Peer や Orderer を追加する、という 2...","categories": [],
        "tags": ["Blockchain"],
        "url": "https://oracle-japan.github.io/ocitutorials/blockchain/02_1_create_channel/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/blockchain/02_1_create_channel/founder_create_channel_result.png"
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)をプロビジョニングしよう",
        "excerpt":"マネージドKubernetesサービスであるOralce Container Engine for Kubernetes(OKE)を中心とした、コンテナ・ネイティブなサービス群です。 Oracle Container Engine for Kubernetes（以下OKE）は、OracleのマネージドKubernetesサービスです。この共通手順では、OCIやOKEを操作するためCLI実行環境の構築（Resource Managerを使用）と、OKEを使ってKubernetesクラスターをプロビジョニングするまでの手順を記します。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること ハンズオン環境のイメージ 1.OKEクラスターのプロビジョニング ここでは、OKEクラスターのプロビジョニングを行います。ここでの手順を実施することにより、OKEのコントロールプレーンとKubernetesクラスターの構築が同時に行われます。 はじめに、OCIコンソール画面左上のハンバーガーメニューを展開し、開発者サービス⇒Kubernetes Clusters (OKE)を選択します。 クラスタ一覧画面で、クラスタの作成をクリックします。 次のダイアログでクイック作成を選択し、ワークフローの起動をクリックします。 次のダイアログで、任意の名前を入力し、バージョンを選択します。ここではデフォルトのまま進めていきます。 Kubernetes APIエンドポイントには今回はデフォルトのパブリック・エンドポイントを選択します。 Kubernetes APIエンドポイントについて 管理者は、クラスタのKubernetes APIエンドポイントを、プライベート・サブネットまたはパブリック・サブネットに構成することができます。 VCNルーティングとファイアウォール・ルールを使うことで、Kubernetes APIエンドポイントへのアクセスを制御し、オンプレミスもしくは同一VCN上に構築した踏み台サーバからのみアクセス可能にすることができます。 Kubernetesワーカー・ノードには今回プライベートを選択します。これは、 ワークロードに応じて、ワーカーノードにパブリックIPを付与する必要がある場合は、パブリックを選択してください。 Kubernetesワーカー・ノードについて プライベートかパブリックによって、ワーカーノードに付与されるIPアドレスの種類が変わります。 プライベートは、ワーカーノードがプライベートIPのみを付与された状態でプロビジョニングを行います。 ワーカーノードにパブリックIPを付与する必要がある場合は、パブリックを選択してください。 シェイプには、今回VM.Standard2.1を選択します。 シェイプについて OKEでは、VM、ベアメタル、GPU、HPCなどの様々なシェイプをご利用頂くことができます。 また、プロセッサ・アーキテクチャとしても、Intel/AMD/ARMベースのインスタンスから選択頂くことができます。 ワークロードに応じて、適切なシェイプを選択してください。 ノードの数はワーカーノードの数を指定します。デフォルトで「3」が指定されていますが、本ハンズオンでは最小構成である「1」に変更してください。 ノード数について ノードはリージョン内の可用性ドメイン全体（または、東京リージョンなど単一可用性ドメインの場合、その可用性ドメイン内の障害ドメイン全体）に可能な限り均等に分散されます。 実運用の際は可用性を考慮し、適切なノード数を指定してください。 そして、ダイアログの下まで移動し次をクリックします。 次のダイアログは入力内容を確認し、クラスタの作成をクリックします。 デフォルトの設定では、クラスタが必要とするネットワークリソース等の構成が自動的に行われます。途中経過がダイアログに表示されますので、「クラスタと関連ネットワーク・リソースが作成されました」というメッセージが表示されるまで待った後、Closeボタンをクリックします。...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/oke-for-commons/",
        "teaser": null
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)でKubernetesを動かしてみよう",
        "excerpt":"Oracle Container Engine for Kubernetes（以下OKE）は、OracleのマネージドKubernetesサービスです。 このハンズオンでは、OKEにサンプルアプリケーションをデプロイするプロセスを通して、Kubernetesそのものの基本的な操作方法や特徴を学ぶことができます。 このカテゴリには以下のサービスが含まれます。 Oracle Container Engine for Kubernetes (OKE): フルマネージドなKuberentesクラスターを提供するクラウドサービスです。 Oracle Cloud Infrastructure Registry (OCIR): フルマネージドなDocker v2標準対応のコンテナレジストリを提供するサービスです。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること OKEハンズオン事前準備を実施済みであること 1.コンテナイメージの作成 ここでは、サンプルアプリケーションが動作するコンテナイメージを作成します。 1.1. アプリーケーションのリポジトリをForkする GitHubにアクセスし、ご自身のアカウントでログインしてください（GitHubのアカウントがなければ、事前に作成してください)。 今回利用するサンプルアプリケーションは、oracle-japanのGitHubアカウント配下のリポジトリとして作成してあります。 サンプルアプリケーションのリポジトリにアクセスしたら、画面右上のforkボタンをクリックしてください。 これ以降の作業では、Forkして作成されたリポジトリを利用して手順を進めて行きます。 1.2. ソースコードをCloneする 1.1. で作成したリポジトリにアクセスして、Clone or downloadボタンをクリックします。 ソースコードを取得する方法は2つあります。一つはgitのクライアントでCloneする方法、もう一つはZIPファイル形式でダウンロードする方法です。ここでは前者の手順を行いますので、展開した吹き出し型のダイアログで、URLの文字列の右側にあるクリップボード型のアイコンをクリックします。 これにより、クリップボードにURLがコピーされます。 Cloud ShellまたはLinuxのコンソールから、以下のコマンドを実行してソースコードをCloneします。 git clone [コピーしたリポジトリのURL] 続いて、Cloneしてできたディレクトリをカレントディレクトリにしておきます。 cd cowweb-for-wercker-demo...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/oke-for-beginners/",
        "teaser": null
      },{
        "title": "KubernetesでサンプルアプリケーションのデプロイとCI/CDを体験してみよう",
        "excerpt":"このワークショップでは、Oracle Visual Builder Studioを利用してCI/CD環境をセットアップし、Oracle Autonomous Transaction ProcessingをデータソースとしたJavaアプリケーションをOracle Container Engine for Kubernetes（OKE）にデプロイする一連の流れを体験することができます このワークショップには以下のサービスが含まれます。 Oracle Visual Builder Studio（略称：VBS）: Oracle Cloudが提供する事前統合済みのチーム開発プラットフォームサービスです。 Oracle Autonomous Transaction Processing（略称：ATP）: 運用がすべて自動化された自律型データベースサービスです。 Oracle Container Engine for Kubernetes（略称：OKE）: マネージドなKuberentesクラスタを提供するクラウドサービスです。 Oracle Cloud Infrastructure Registry（略称：OCIR）: フルマネージドなDocker v2標準対応のコンテナレジストリを提供するサービスです。 前提条件 ワークショップを開始する前に以下を準備してください。 Oracle Cloudのアカウントを取得済みであること OKEハンズオン事前準備を実施済みであること Oracle Cloud Infrastructureの基本操作はチュートリアル : OCIコンソールにアクセスして基本を理解するをご確認ください。 ゴールを確認する はじめに、手順を最後まで実施したときにどのような環境が作られるか確認して、ゴールの全体像を掴んでおきましょう。 手順を最後まで行うと、下図のような環境が構成されます。 構成要素 説明...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/oke-for-intermediates/",
        "teaser": null
      },{
        "title": "Fn Project ハンズオン",
        "excerpt":"Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。 このハンズオンでは、Fn Projectの環境構築から動作確認までの手順を記します。 前提条件 クラウド環境 有効なOracle Cloudアカウントがあること OCIチュートリアル その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること OCIチュートリアル その3 - インスタンスを作成する を通じてコンピュートインスタンスの構築が完了していること 1.Fn Project実行環境の構築 ここでは、前提条件のハンズオンで作成したコンピュートインスタンス上に、Fn Projectを実行するための環境構築を行います。 前提条件のハンズオンで作成したコンピュートインスタンス上に任意のターミナルソフトでSSHログインします。 1-1. Dockerのインストール ログインしたら、以下のコマンドを実行します。 sudo yum install -y yum-utils sudo yum -y update yumレポジトリをセットアップします。 sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo Dockerパッケージをインストールします。 sudo yum install -y docker-ce docker-ce-cli containerd.io これでDockerのインストールは完了です。 以下のコマンドでDocker...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/fn-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Functions ハンズオン",
        "excerpt":"Oracle Functionsは、Oracleが提供するオープンソースのFaaSプラットフォームであるFn Projectのマネージドサービスです。 このエントリーでは、Oracle Functions環境構築から動作確認までの手順を記します。 条件 クラウド環境 有効なOracle Cloudアカウントがあること Fn Projectハンズオンが完了していること(このハンズオンの理解を深めるため) 事前準備 注意事項: コンパートメントについて Oracle Cloudにはコンパートメントという考え方があります。 コンパートメントは、クラウド・リソース(インスタンス、仮想クラウド・ネットワーク、ブロック・ボリュームなど)を分類整理する論理的な区画で、この単位でアクセス制御を行うことができます。 また、OCIコンソール上に表示されるリソースのフィルタとしても機能します。 今回は、ルートコンパートメントと呼ばれるすべてのリソースを保持するコンパートメントを利用するので、特に意識する必要がありません。 注意事項: ポリシーについて Oracle Cloudでは、各ユーザーから各サービスへのアクセスおよび各サービスから他サービスへアクセスを「ポリシー」を利用して制御します。ポリシーは、各リソースに誰がアクセスできるかを指定することができます。 このハンズオンでは、テナンシ管理者を想定してポリシーを設定していきます。 注意事項: リージョンとリージョンコードについて Oracle Cloudでは、エンドポイントやレジストリにアクセスする際にリージョンおよびリージョンコードを使用する場合があります。 以下に各リージョンと対応するリージョンコードを記載します。 本ハンズオンでは、OCI CLIのセットアップおよびOCIRのログイン時に使用します。 リージョン リージョンコード ap-tokyo-1 nrt ap-osaka-1 kix ap-melbourne-1 mel us-ashburn-1 iad us-phoenix-1 phx ap-mumbai-1 bom ap-seoul-1 icn ap-sydney-1 syd ca-toronto-1...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/functions-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Cloud Infrasturcture API Gateway + Oracle Functionsハンズオン",
        "excerpt":"このハンズオンでは、OCI API GatewayとOracle Functionsを組み合わせて、簡単なアプリケーションを開発する手順をご紹介します。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること 1.サンプルアプリケーションのデプロイ ここでは、サンプルアプリケーションのデプロイを行います。 ここでデプロイするFunctionは、渡されたパラメータを使用して、QRコードの画像を作成するアプリケーションです。 まずは、githubからハンズオン用の資材をcloneします。 Oracle Functionsことはじめで利用したCloud Shellにログインします。 Gitコマンドは既にCloud Shellにインストールされています。 以下のコマンドを実行します。 git clone https://github.com/oracle-japan/apigw-functions-handson.git apigw-functions-handsonディレクトリに移動します。 cd apigw-functions-handson Oracle Functionsを使用してFunctionをデプロイします。 fn-generate-qrcodeディレクトリに移動します。 cd fn-generate-qrcode fn-generate-qrcodeをデプロイします。 fn -v deploy --app helloworld-app 最後に以下のような出力が得られます： ~~~略~~~ Updating function fn-generate-qrcode using image nrt.ocir.io/xxxxxxxx/workshop/fn-generate-qrcode:0.0.2... Successfully created...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/functions-apigateway-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Functionsを利用した仮想マシン (VM) のシェイプ変更",
        "excerpt":"このハンズオンでは、想定したメモリ使用率を超える仮想マシン (VM) のシェイプをOracle Functionsを利用して動的に変更する手順を記載します。 ハンズオン環境について このハンズオンでは、動作確認のために意図的にVMのメモリ使用率を上昇させるコマンドを使用します。そのため、商用環境などでは絶対に行わないでください。 また、使用する仮想マシン (VM) についてもテスト用として用意したものを使用するようにしてください。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること このハンズオンが完了すると、以下のようなコンテンツが作成されます。 1.事前準備 このステップでは、Oracle Functionsから仮想マシン (VM) を操作するための動的グループとポリシーの設定を行います。 動的グループおよびポリシーについて 動的グループを使用すると、Oracle Cloud Infrastructureコンピュータ・インスタンスを(ユーザー・グループと同様に)プリンシパルのアクターとしてグループ化し、ポリシーを作成できます。 そうすることで、インスタンスがOracle Cloud Infrastructureサービスに対してAPIコールを実行できるようにします。 詳細は動的グループの管理をご確認ください。 OCIコンソールのハンバーガーメニューをクリックして、[アイデンティティとセキュリティ]⇒[動的グループ]に移動し、「動的グループの作成」をクリックします。 以下項目を入力して、「作成」をクリックします。 名前：動的グループの名前。今回は、func_dyn_grp 説明：動的グループの説明。今回は、Function Dynamic Group ルール1：ALL {resource.type = 'fnfunc', resource.compartment.id = '&lt;compartment-ocid&gt;'}(compartment.idは各自で使用するコンパートメントOCIDへ変更してください。) コンパートメントOCIDについて [アイデンティティ]⇒[コンパートメント]に移動して、使用するコンパートメント(今回はルートコンパートメント)を開いて、該当OCIDを確認します。 OCIコンソールのハンバーガーメニューをクリックして、[アイデンティティとセキュリティ]⇒[ポリシー]に移動し、「ポリシーの作成」をクリックします。 以下項目を入力して、「作成」をクリックします。 名前：ポリシーの名前。今回は、fn-policies...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/functions-vmshape-for-intermediates/",
        "teaser": null
      },{
        "title": "Oracle Functionsを利用したORDSでのデータベースアクセス",
        "excerpt":"このセッションでは、Oracle FunctionsからORDS(Oracle REST Data Services)という仕組みを利用してATPに接続し、データを取得する方法について説明します。 ORDSはデフォルトでATPに組み込まれている仕組みです。 ORDSについて ATPはORDSを利用してRESTfulインターフェースでのアクセスを行うことができます。 ORDS(Oracle REST Data Services)の詳細についてはAutonomous Databaseを使用したOracle REST Data Servicesの開発をご確認ください。 このハンズオンが完了すると、以下のようなコンテンンツが出来上がります。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること ローカル端末にSQL Developerがインストールされていること ダウンロードはこちらから 1.事前準備 ここでは、ATPのプロビジョニングとORDSの設定を行います。 1-1.ATPのプロビジョニング OCIコンソールのハンバーガーメニューから[データベース]で、[Autonomous Transaction Processing]をクリックします。 Autonomous Databaseの作成画面で、使用するコンパートメントを選択して、「Autonomous Databaseの作成」をクリックします。 以下項目を入力して、「Autonomous Databaseの作成」をクリックします。 コンパートメント：使用するコンパートメントを選択。 表示名：表示名を入力。今回は、Workshop ATP。 データベース名：今回は、WORKSHOPATP。 ワークロード・タイプの選択：トランザクション処理 デプロイメント・タイプ：共有インフラストラクチャ データベース・バージョンの選択：19c OCPU数：1 ストレージ(TB)：1 自動スケーリング：チェックをオフ。...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/functions-ords-for-intermediates/",
        "teaser": null
      },{
        "title": "Oracle Functionsを利用したNoSQLデータベースアクセス",
        "excerpt":"Oracle NoSQL Database Cloud Serviceは、大容量データを高速に処理するフルマネージドデータベースクラウドサービスです。ドキュメント、カラムナー、キーと値のペアなどのデータ・モデルをサポートし、すべてのトランザクションはACIDに準拠しています。 このハンズオンでは、Oracle FunctionsをOracle NoSQL Database Cloud Serviceに接続して、テーブルを作成し、データを登録する方法について説明します。 今回は、Oracle OCI SDKのリソースプリンシパルという仕組みを利用して、Oracle FunctionsからOracle NoSQL Database Cloud Serviceにアクセスしてみます。 リソースプリンシパルについて Oracle Functionsでのリソースプリンシパルの利用についてはファンクションの実行からのその他のOracle Cloud Infrastructureリソースへのアクセスをご確認ください。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること 1.事前準備 ここでは、リソースプリンシパルを利用するための動的グループおよびポリシーの作成を行います。 1-1. 動的グループの作成 OCIコンソールのハンバーガーメニューをクリックして、[アイデンティティとセキュリティ]から[動的グループ]に移動し、「動的グループの作成」をクリックします。 以下項目を入力して、「作成」をクリックします。 名前：動的グループの名前。今回は、func_dyn_grp 説明：動的グループの説明。今回は、Function Dynamic Group ルール1：ALL {resource.type = 'fnfunc', resource.compartment.id = '&lt;compartment-ocid&gt;'}(compartment-ocidはOracleFunctionsが利用するコンパートメントOCID。今回はルートコンパートメント。)...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/functions-nosql-for-intermediates/",
        "teaser": null
      },{
        "title": "Oracle Functionsを利用したAPI Gatewayの認証",
        "excerpt":"このハンズオンでは、Oracle Functionsを利用してOCI API Gatewayが渡されたクライアントシークレットをチェックし、正しいクライアントシークレットが含まれているかどうかに基づいてリクエストを許可したり拒否したりするシンプルなAuthorizer Functionを作成します。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること Oracle Functionsハンズオンが完了していること Oracle Cloud Infrasturcture API Gateway + Oracle Functionsハンズオンが完了していること OCI API Gatewayでサポートしている認証および承認機能について OCI API Gatewayでは複数の認証方式をサポートしています。詳細はAPIデプロイメントへの認証と認可の追加をご確認ください。 このハンズオンが完了すると、以下のようなコンテンツが作成されます。 1.Oracle Funstionsのでデプロイ ここでは、Oracle Functionsの作成とデプロイを行います。 1-1.Oracle Functionの作成 Oracle OCIコンソールの左上にあるハンバーガーメニューをクリックして、[開発者サービス]⇒[ファンクション]に移動します。 Oracle Functionsに使用する予定のリージョンを選択します（Fn Project CLIコンテキストで指定されたDockerレジストリと同じリージョンを推奨します）。 ここでは、Ashburnリージョンus-ashburn-1を使用します。 利用するコンパートメントを選択します。 今回は、ルートコンパートメントを利用します。 [アプリケーションの作成]をクリックして、次を指定します。 名前：このアプリケーションに最初のFunctionをデプロイし、Functionを呼び出すときにこのアプリケーションを指定します。たとえば、fn-samples-app。 VCN：Functionを実行するVCN。今回は、Oracle Functionsハンズオンで作成したVCNを指定。 サブネット：Functionを実行するサブネット。今回は、Oracle Functionsハンズオンで作成したVCNのサブネットを指定。...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/functions-apigateway-for-intermediates/",
        "teaser": null
      },{
        "title": "OCI API Gatewayハンズオン",
        "excerpt":"このハンズオンでは、OCI API Gatewayを利用して簡単にAPIを集約・公開する手順をご紹介します。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 1.OCI API Gatewayプロビジョニングのための事前準備 ここでは、OCI API Gatewayをプロビジョニングするための事前準備を行います。 1-1. VCNの作成 VCN作成済みの場合 VCNを作成済みの方は1-2.イングレス・ルールの追加に進んでください。 Oracle Cloudのダッシューボードにログインし、ダッシューボード画面のハンバーガメニューで”ネットワーキング” =&gt; “仮想クラウド・ネットワーキング”をクリックします。 表示された画面左下の”スコープ”内の”コンパートメント”をクリックし、ルートコンパートメントを選択します。ルートコンパートメントはOracle Cloudの登録時に設定した名称になります。既に選択されている場合は、この手順はスキップしてください。 “VCNウィザードの起動”をクリックします。 “VPN接続およびインターネット接続性を持つVCN”を選択し、”ワークフローの開始”をクリックします。 以下の情報を入力し、”次”をクリックします。 VCN名：任意の名前(こだわりがなければ”API Gateway Handson”) コンパートメント：ルートコンパートメント VCN CIDRブロック：10.0.0.0/16 パブリック・サブネットCIDRブロック：10.0.0.0/24 プライベート・サブネットCIDRブロック：10.0.1.0/24 “作成”をクリックし、作成が完了したら、”仮想クラウド・ネットワークの表示”をクリックします。 作成したVCNが確認できれば、VCN(ネットワーク)の作成は終わりです。 1-2. イングレス・ルールの追加 OCI API Gatewayは、デフォルトでは開いていないポート443で通信します。 ポート443のトラフィックを許可するには、サブネットに対してイングレス・ルールを追加する必要があります。 OCIコンソールにログインし、[ネットワーキング]に移動して、[仮想クラウド・ネットワーク]をクリックします。 [コンパートメント]からOCI API Gatewayで利用するコンパートメント(今回はルートコンパートメント)を選択して、OCI API Gatewayで利用するVCNリンクをクリックします。 OCI API...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/apigateway-for-beginners/",
        "teaser": null
      },{
        "title": "Helidon(MP)を始めてみよう",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracleでは、マイクロサービスの開発に適した軽量なJavaアプリケーションフレームワークとしてHelidonを開発しています。 Helidonは、SEとMPという2つのエディションがあります。 このチュートリアルでは、MicroProfile準拠のエディションであるMPの方を取り上げていきます。 MicroProfileについて MicroProfileは、マイクロサービス環境下で複数言語との相互連携を保ちながら、サービスを構築するために複数ベンダーによって策定されているJavaの標準仕様のことです。 詳細はこちらをご確認ください。 前提条件 こちらの手順が完了していること このチュートリアルでは、データベースとしてOracle Cloud Infrastructure上の自律型データベースであるAutonomous Transaction Processing(以降、ATPとします)を利用します 1.Helidon CLIでベースプロジェクトを作成してみよう ここでは、Helidon CLIを利用して、ベースプロジェクトを作成してみます。 HelidonをセットアップするにはHelidon CLIが便利です。 このチュートリアルでは、Linux環境の前提で手順を進めますが、WindowsやMac OSでも同じようにインストールすることができます。 まずは、curlコマンドを利用してバイナリを取得し、実行可能な状態にします。 curl -O https://helidon.io/cli/latest/linux/helidon chmod +x ./helidon sudo mv ./helidon /usr/local/bin/ これで、Helidon CLIのインストールは完了です！ 上記が完了すると、helidonコマンドが利用可能になります。 まず初めに、initコマンドを叩いてみましょう。 helidon init ベースプロジェクトを構築するためのインタラクティブなプロンプトが表示されます。 以下のように入力していきます。 項目 入力パラメータ 備考 Helidon...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/helidon-mp-for-beginners/",
        "teaser": null
      },{
        "title": "Helidon(SE)を始めてみよう",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracleでは、マイクロサービスの開発に適した軽量なJavaアプリケーションフレームワークとしてHelidonを開発しています。 Helidonは、SEとMPという2つのエディションがあります。 このチュートリアルでは、マイクロフレームワークのエディションであるSEの方を取り上げていきます。 1. Helidon CLIでベースプロジェクトを作成してみよう ここでは、Helidon CLIを利用して、ベースプロジェクトを作成してみます。 HelidonをセットアップするにはHelidon CLIが便利です。 このチュートリアルでは、Linux環境の前提で手順を進めますが、WindowsやMac OSでも同じようにインストールすることができます。 まずは、curlコマンドを利用してバイナリを取得し、実行可能な状態にします。 curl -O https://helidon.io/cli/latest/linux/helidon chmod +x ./helidon sudo mv ./helidon /usr/local/bin/ これで、Helidon CLIのインストールは完了です！ 上記が完了すると、helidonコマンドが利用可能になります。 まず初めに、initコマンドを叩いてみましょう。 helidon init ベースプロジェクトを構築するためのインタラクティブなプロンプトが表示されます。 以下のように入力していきます。 項目 入力パラメータ 備考 Helidon flavor 1 EditionとしてSEを選択 Select archetype 3 databaseを選択(DbClient) Project name...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/cloud-native/helidon-se-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Content and Experience インスタンスを作成する",
        "excerpt":"この文書は Oracle Content and Experience (OCE) のインスタンス作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年6月時点での最新バージョン(21.5.1)を元に作成されてます 1. 準備 1.1 OCEインスタンス作成手順の説明 OCEインスタンスの作成手順は以下の通りです このチュートリアルでは、以下の条件で作成します ホームリージョンは US East(Ashburn) を選択 OCE インスタンスの作成ユーザーは テナント管理ユーザー OCE専用コンパートメントを作成(コンパートメント名=OCE) 1.2 Oracle Cloud の環境を準備する Oracle Cloud のアカウントを準備します。無料のトライアル環境も利用することもできますので、この機会に取得してみましょう。 なお、トライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です（希望しない限り課金されませんので、ご安心ください） Oracle Cloud 無料トライアルを申し込む トライアル環境のサインアップ手順はこちらをご確認ください。 Oracle Cloud 無料トライアル・サインアップガイド(PDF) Oracle Cloud 無料トライアルに関するよくある質問(FAQ) 1.3 Oracle Cloud にサイン・インする OCE インスタンスは、Oracle Cloud Infrastructure コンソール（以降OCIコンソール）から作成します。ここでは、前の手順で作成した テナント管理ユーザー...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/create_oce_instance/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/create_oce_instance/022.webp"
      },{
        "title": "Oracle Content and Experience インスタンスの利用ユーザーを作成する",
        "excerpt":"この文書は Oracle Content and Experience (OCE) を利用するユーザーをIDCSに追加する方法をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年1月時点での最新バージョン(21.1.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する 1. ユーザーとグループの作成 OCE インスタンスを利用するユーザーは、IDCS ユーザー として登録します。ここでは、IDCS ユーザーに IDCS グループを利用し、OCE インスタンスのアプリケーションロール(CECEnterpriseUser)を割り当てる手順を説明します IDCS グループは、組織内の役割にあわせて作成します。下記マニュアルを参考に作成します。 Administrating Oracle Content and Experience Typical Organization Roles（英語原本） 一般的な組織ロール（日本語翻訳版） 1.1 IDCS グループの作成 IDCS グループを作成します。ここでは OCEusers グループを作成します OCI コンソールを開き、左上のメニュー→ 「アイデンティティ」→「フェデレーション」 をクリックします Oracle Identity Cloud Service...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/create_idcs_group_user/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/create_idcs_group_user/user10.webp"
      },{
        "title": "Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】",
        "excerpt":"この文書は Oracle Content and Experience (OCE) のファイル共有機能を利用する方法をステップ・バイ・ステップで紹介するチュートリアル集です。OCE の利用ユーザーとして、ファイル共有機能の基本操作を習得します 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること チュートリアル：Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 OCE インスタンスにサインインする（Oracle Content and Experience のファイル共有機能を使ってみよう） まずは、OCE インスタンスにサインインします。サインイン後は、自分が利用しやすいようにプリファレンスやプロファイルを設定します フォルダの作成（Oracle Content and Experience のファイル共有機能を使ってみよう） フォルダを作成し、ファイルを簡単に分類します。とても簡単にフォルダを作成できますので、まずは気軽に始めてみましょう ファイルの登録（Oracle Content and Experience のファイル共有機能を使ってみよう） ファイルはドラッグ＆ドロップ操作で簡単にアップロードできます。また、OCE ではファイルをバージョン管理します。新規バージョンのファイルをアップロード方法や古いバージョンのファイルを表示・取得する方法を習得します ファイルのプレビュー（Oracle Content...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/using_file_sharing/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/create_oce_instance/024.jpg"
      },{
        "title": "その1: OCE インスタンスにサインインする（Oracle Content and Experience のファイル共有機能を使ってみよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 まず最初に OCE インスタンスにサインインします。次に、OCE を使い始めるにあたり、このOCEインスタンスで自分が利用可能な容量を確認します。 最後に、プリファレンスやプロファイルを設定し、自分が使いやすいようにカスタマイズします この文書は、2020年5月時点での最新バージョン(20.2.2)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. OCE インスタンスにサインインする 1.1 OCE ホームを開く OCE インスタンスにサインインします。OCE インスタンスの URL は、サービス管理者によるユーザー追加時に自動送信されるメールに記載されます 通知メールの説明 項目 説明 差出人 Oracle Content and Experience &lt;no-reply@oracle.com&gt; 件名 Welcome to Oracle...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/1_sign_in_oce/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/1_sign_in_oce/001.jpeg"
      },{
        "title": "その2: フォルダの作成（Oracle Content and Experience のファイル共有機能を使ってみよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 OCE では、ローカル・コンピュータの場合とほぼ同じ方法でファイルを操作します。フォルダを利用してファイルを簡単にグループ化し、コンテンツ管理として提供される一般的な操作（ファイルおよびフォルダのアップロード、ダウンロード、コピー、移動、名前変更、削除など）を実行できます。 この文書は、2020年5月時点での最新バージョン(20.2.2)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. フォルダの作成 1.1 フォルダの作成 左ナビゲーションメニューの 「ドキュメント」 をクリックします 「作成」 をクリックします 「名前」 を入力します（ここでは「チュートリアルフォルダ」と入力） 必要に応じて、「説明」 にこのフォルダに関する説明文を入力します（ここでは「フォルダ共有チュートリアル用のフォルダです」と入力） 「作成」 をクリックします フォルダが作成されます。作成したフォルダ（ここではチュートリアルフォルダ）をクリックし、開きます フォルダの中に別のフォルダ（サブフォルダ）を作成する場合は、親となるフォルダ（ここでは「チュートリアルフォルダ」）を開いた状態で 「作成」 をクリックします 名前を入力し、「作成」 をクリックします。（ここでは「子フォルダ」と入力） サブフォルダが作成されます [Memo] 上記のように、フォルダアイコンがプレーン（無地）のものは「個人フォルダ」となります。他ユーザーに共有したフォルダ、他ユーザーから共有されたフォルダには、共有アイコンがついた「共有フォルダ」となります（詳細は「共有」の章で説明） 1.2 フォルダ表示の切り替え 右端のメニューより、表示形式を切り替えられます。3つの表示形式が選択できます...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/2_create_folder/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/2_create_folder/004.jpeg"
      },{
        "title": "その3: ファイルの登録（Oracle Content and Experience のファイル共有機能を使ってみよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 ローカル環境から、クラウド上の OCE にファイルを登録する方法は複数あります。ここでは、Web ブラウザを利用したファイルのアップロード方法について説明します。ファイルのアップロードはバックグラウンドで実行されるので、アップロード中に別の作業を続けることができます。なお、ファイルをアップロードする際は、以下について注意してください ファイルのアップロードを5GBまでに抑えます。一部の Web ブラウザではそれより大きいファイルを処理できないことがあります。数GBを超える大きいファイルを追加する場合は、デスクトップ・アプリケーションの利用を検討してください 複数のファイルやフォルダを含むフォルダ全体を追加するには、デスクトップ・アプリケーションを利用してください。同期フォルダにフォルダを追加することで、フォルダを含むコンテンツがクラウド上の OCE に追加されます サービス管理者が、アップロードできるファイルの種類（拡張子および最大ファイルサイズ）を制限している場合があります。制限されているファイルの種類を確認するには、右上のユーザー・アイコン→プリファレンス→ドキュメントを開いてください アップロードの取り消しは、ファイルのアップロード中に画面の上部の情報バーで「詳細」リンクをクリックし、 取り消すファイルの「X」をクリックします この文書は、2020年5月時点での最新バージョン(20.2.2)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. 新規ファイルを登録する 1.1 新規ファイルの登録 フォルダに新規ファイルをアップロードする方法は以下の通りです アップロード先のフォルダを開き、「アップロード」 をクリックし、ローカル環境上のファイルを選択する アップロード先のフォルダを開き、アップロードするファイルをドラッグ＆ドロップする（アップロード先がハイライト表示されます） アップロードするファイルを、アップロード先のフォルダに直接ドラッグ＆ドロップする（アップロード先のフォルダがハイライト表示されます） ファイルがアップロードされたことを確認します 1.2 新しいバージョンのファイルを登録する OCE にアップロードしたファイルの修正版を登録するときに、古いバージョンのファイルを残したまま、修正版のファイルを新しいバージョンのファイルとして登録することができます。 OCE で管理されるファイルのバージョンは、v1→v2→v3→v4→…と上がっていきます。...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/3_upload_file/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/3_upload_file/002.jpeg"
      },{
        "title": "その4: ファイルのプレビュー（Oracle Content and Experience のファイル共有機能を使ってみよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 ファイルをローカル環境にダウンロードすることなく、登録済ファイルを Web ブラウザで表示（プレビュー）することができます。 プレビュー可能なファイル拡張子は、以下のドキュメントをご確認ください Supported File Formats この文書は、2020年5月時点での最新バージョン(20.2.2)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. ファイルのプレビュー ファイルをプレビューする方法は以下の通りです ファイル名 をクリックする ファイルを選択し、「表示」 をクリックする ファイルの右クリックメニューより 「表示」 をクリックする ファイルのプレビューが表示されます。プラス（＋）またはマイナス（ー）アイコンをクリック、もしくはスライダ・バーを移動してプレビュー表示を拡大・縮小できます 「全画面」 をクリックすると、全画面を使用してファイルをプレビューできます。画面上部のスライダー・バーを使用して、プレビュー表示を拡大・縮小できます。「全画面の終了」もしくは ESC のクリックで、全画面表示を終了できます 管理者により Office Online 連携機能が有効化されている場合、「表示」は 「Webプレビュー」 に名称変更されます。また、「PowerPoint Onlineで表示」...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/4_view_file/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/4_view_file/002.jpeg"
      },{
        "title": "その5: ファイルの削除と復元（Oracle Content and Experience のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 OCE のドキュメント機能でファイル（およびフォルダ）を削除すると、それらはごみ箱に移動されます。 ごみ箱内のファイル（フォルダ）は、ユーザー自身で手動による削除（完全に削除）、もしくは元のフォルダへの復元、ができます。 ごみ箱を利用する上での注意点 ごみ箱内のファイル（フォルダ）は、サービス管理者が設定した「ファイルおよびフォルダをごみ箱に保持する最大日数」だけ保持され、その後、自動的に削除 されます ごみ箱に保持されるファイルおよびフォルダは、ファイルの使用済領域（使用容量）としてカウント されます。空き容量が足りない場合は、自分のごみ箱にファイルが残っていないか？を確認し、必要に応じて手動でごみ箱内のファイルを 完全に削除 してください。 ごみ箱内の容量は、右上のユーザーアイコン→プリファレンス→ドキュメントの 「ごみ箱のサイズ」 より確認できます この文書は、2021年1月時点での最新バージョン(21.1.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. ファイルの削除と復元 1.1 ファイルを削除する ファイルを削除する方法は以下の通りです ファイルを選択し、「削除」 をクリックする ファイルの右クリックメニューより 「削除」 をクリックする 確認のダイアログが表示されます。「はい」 をクリックします ファイルが削除されます。削除したファイルはごみ箱に移動されます。画面上部のメッセージに表示されるメッセージの 「ごみ箱」 をクリックすると、ごみ箱に移動できます 1.2...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/5_delete_file/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/5_delete_file/008.jpg"
      },{
        "title": "その6: ファイルの編集（Oracle Content and Experience のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 OCE のデスクトップ・アプリケーションがクライアント環境にインストールされている場合、ローカル環境の Office アプリケーションと連携したファイルの編集および OCE インスタンス上への自動保存ができます。 サービス管理者により Microsoft Office Online 連携機能が有効化されている場合、Office Online サービス（Microsoft 365サービス）でのファイル編集、新規作成、OCE への自動保存ができます この文書は、2021年1月時点での最新バージョン(21.1.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること クライアント環境に OCEのデスクトップ・アプリケーション がインストールされていること。デスクトップ・アプリケーションの利用は、こちらのチュートリアルをご確認ください 11. デスクトップ・アプリケーション（Oracle Content and Experience のファイル共有機能を利用しよう） 1. ファイルの編集 1.1 Office アプリケーションで編集...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/6_edit_file/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/6_edit_file/003.jpg"
      },{
        "title": "その7: ファイルの検索（Oracle Content and Experience のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 OCE の画面上部の検索ボックスより、ファイル、フォルダ、会話、メッセージ、ハッシュタグ、ユーザー、グループを横断的に検索することができます。特定のフォルダ配下のみを限定的に検索する場合は、そのフォルダを開いた状態で、検索を実行します。 検索機能に関する補足事項 ファイルの検索対象は 名前、説明、ファイルの内容（文書内の単語など）、ファイル拡張子、ファイルの最終変更者の名前 です。また、ファイルやフォルダに関連付けられているカスタム・メタデータ、タグ、会話で使用されているハッシュ・タグおよび会話内のユーザーも検索対象となります 全文検索対象のファイル形式は、以下のドキュメントをご確認ください Supported Image and Business File Formats ファイルやフォルダ、会話へのアクセス権限がない場合、検索条件を満たす場合でも検索結果に表示されません 最新の検索結果が表示されるには若干のタイムラグがある場合があります。 たとえば、Report という語を検索し、Report という語をその中に含む別のドキュメントを追加した場合、数秒間その最新のドキュメントは検索結果で返されません。 バージョン管理されているファイルは、最新バージョンが検索対象 となります （例）v3, v2, v1 の3バージョンが管理される .docx ファイルの場合、v3 のファイルのみが検索対象となります 検索では 大文字/小文字は区別されません。つまり、report で検索した場合と Report で検索した場合の結果は同じです。 検索演算子を利用できます。検索演算子も大文字小文字を区別しません。つまり、NOT と not は同じです AND 検索 : and または空白スペース( ) OR 検索...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/7_search_file/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/7_search_file/002.jpg"
      },{
        "title": "その8: フォルダ・ファイルの共有（Oracle Content and Experience のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 ファイルやフォルダは他のユーザーと簡単に共有できます。共有時には、ファイルやフォルダにアクセスするユーザーと実行可能な操作権限（アクセス権限）を簡単に制御できます。 説明 アクセス権限 OCE のアクセス権限は4種類です アクセス権限 説明 マネージャ コントリビュータ権限に加え、メンバー追加やアクセス権限設定などの管理作業が可能（フォルダ作成者=所有者とほぼ同様の権限） コントリビュータ 子フォルダの作成と編集、登録済ファイルの編集や新規ファイルのアップロードが可能 ダウンロード実行者 フォルダの参照、ファイルの参照とダウンロードが可能（子フォルダの作成やファイルの編集はできない） 参照者 フォルダの参照、ファイルのプレビューが可能（ファイルのダウンロードはできない） 共有の方法 共有の目的や内容に応じて、その方法を使い分けることができます。OCEでは、「フォルダへのメンバー追加」による共有と、「リンク（URL）による共有」の2パターンです。それぞれについて説明します フォルダにメンバーを追加 フォルダにメンバーを追加することで、そのフォルダおよび配下すべてのフォルダ・ファイルを複数ユーザーで共有できます メンバーの追加は、個々のユーザーもしくはグループを指定できます メンバーを追加する際に、そのフォルダに対する アクセス権限 を設定します。アクセス権限は、マネージャ、コントリビュータ、ダウンロード実行者、参照者 より選択できます 利用例 組織やグループ、大規模プロジェクトでファイルを共有する場合など、ユーザーが継続して情報にアクセスする必要がある 場合 設定例 フォルダ・ファイルのリンク共有 OCEのリンク共有には「メンバー・リンク」と「パブリック・リンク」の2種類があります。それぞれについて説明します メンバー・リンク フォルダへのアクセス権限を有するユーザーに対して、フォルダ・ファイルを共有する際に利用します メンバー・リンクのアクセス権限は、フォルダ・ファイルへのアクセス権限と同じ です 利用例 フォルダAに、Xさん、Yさんの2名を コントリビュータ権限 でメンバー追加 Xさんが、フォルダAの中のファイルA-1のメンバー・リンクを作成し、YさんとZさんにチャットで送付 Yさんはメンバー・リンクをクリックすると、ファイルA-1に コントリビュータ権限 でアクセスできます ZさんはフォルダAにメンバー追加されていないため、メンバー・リンクをクリックしてもファイルA-1にアクセスできません パブリック・リンク...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/8_share_folder_file/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/8_share_folder_file/005.jpg"
      },{
        "title": "その9: 会話（Oracle Content and Experience のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 OCE の会話とは、コメントを投稿したり、特定の話題についてディスカッションしたり、他のユーザーとリアルタイムでメッセージをやりとりする機能です。会話は Webブラウザだけでなく、デスクトップやモバイルからも利用できるため、デバイスや場所を問わず、迅速なコラボレーションが可能です 会話でやりとりされるコメントは、未読・既読の設定、コメントへの返信、ハッシュタグ（＃）やLIKE（いいね）の設定ができます。また、コメントに対してフラグを設定することで他のユーザーの注意を喚起することができます OCE の会話は、2パターンの会話があります 特定のフォルダ・ファイルに紐付く会話 単独利用の会話（特定のファイル・フォルダに紐付かない会話） この文書は、2021年1月時点での最新バージョン(21.1.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. ファイル・フォルダに紐づく会話 1.1 ファイルに紐付く会話を作成する ファイルをプレビューします 右上のサイドバーの 表示アイコン をクリックします 「会話」 を選択します。右ペインに会話パネルが開きます “会話へメッセージを投稿します” をクリックし、コメントを入力します。投稿ボタン をクリックします メッセージが投稿されると同時に、会話が作成されます ファイルの一覧表示画面に戻ります。会話が紐づけられたファイルは、会話アイコン が表示されます 会話アイコン をクリックすると、ファイルのプレビューとそのファイルに紐付く会話が表示されます 1.2 投稿されたコメントに返信する ファイルをプレビューし、会話パネルを開きます...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/9_conversation/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/9_conversation/015.jpg"
      },{
        "title": "その10: グループ（Oracle Content and Experience のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 複数のユーザーをグループとしてまとめることで、フォルダへのメンバー追加などがとても簡単にできるようになります。 例えば、複数のプロジェクト共有フォルダ へのアクセス権限設定で利用されている グループX があります。このグループXに新規ユーザー（Aさん）を追加するだけで、複数のプロジェクト共有フォルダへのアクセス権限設定を 「まとめて」「抜け漏れなく」「必要最小限の操作」 で付与されます。 同様に、プロジェクトメンバーであるBさんが人事異動によりこのプロジェクトから外れる場合も、グループXからBさんを外す（グループXから削除する）だけで、複数のプロジェクト共有フォルダへのアクセス権限を 「まとめて」「抜け漏れなく」「必要最小限の操作」 で削除できます。 このようにグループを活用することで、各種リソースに対するアクセス権限割り当てなどを効率化できます。 OCEで利用できるグループは2種類あります IDCS グループ Oracle Identity Cloud Service(IDCS)で作成・管理するグループ IDCS の管理コンソールを利用して管理します。詳細は、IDCS のマニュアルを参照 Manage Oracle Identity Cloud Service Groups 想定されるユースケース: お客様環境内の Active Directory で管理する組織情報を利用したアクセス権限設定を行う場合 グループ OCE インスタンス内部で作成・管理されるグループ OCE のグループメニューより作成・管理（後述） 想定されるユースケース: プロジェクトや作業グループ、チームなど、特定の目的のために構成されたグループ単位で権限設定を行う場合 このチュートリアルでは、OCEインスタンス内部で管理するグループ(=グループ) について説明します。 グループには3つの考え方があり、目的や用途で使い分けることができます   パブリック・グループ...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/10_group/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/10_group/004.jpeg"
      },{
        "title": "その11: デスクトップ・アプリケーション（Oracle Content and Experience のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 OCE のデスクトップ・アプリケーションは、クラウド上のファイルやフォルダとローカル環境のファイルやフォルダを同期します。クラウド上で更新されたファイルやフォルダは、自動的にローカル環境に同期されるため、ユーザーは常に最新のファイルやフォルダをローカル環境で利用することができます また、ユーザーはネットワークに接続していないオフライン状態で、同期されたファイルやフォルダを操作できます。オフライン状態でローカル環境に同期されたファイルを編集・保存した場合、オンライン状態に復旧した時に自動的にクラウド上に反映されます。そのため、ユーザーが意識することなく、常に最新の状態がクラウド上で維持されます。 デスクトップ・アプリケーションの利用には、ローカル環境へのインストールとOCEインスタンスの接続先情報の設定が必要です。デスクトップ・アプリケーションが対応するクライアント環境は、下記ドキュメントよりご確認ください Supported Software この文書は、2020年5月時点での最新バージョン(20.2.2)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること 1. デスクトップ・アプリケーションのインストールとセットアップ 1.1 インストーラーのダウンロード OCE インスタンスから、デスクトップ・アプリケーションのインストーラーをダウンロードします。 Web ブラウザを開き、OCE インスタンスにアクセスします 右上のユーザーアイコン→ 「アプリケーションのダウンロード」 をクリックします 「ユーザー名」 と 「サービスURL」 をテキストファイルなどにメモします（インストール完了後のセットアップ作業で利用します） ローカル環境のコンピュータと同じOSを選択し、「ダウンロード」 をクリックします（ここでは Windows を選択） ダウンロードが完了するまで待ちます 1.2 インストーラーの実行とセットアップ...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/11_desktop_application/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/11_desktop_application/003.webp"
      },{
        "title": "その12: モバイル・アプリケーション（Oracle Content and Experience のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】 OCE のモバイル・アプリケーションを利用し、クラウド上のファイルやフォルダ、会話にいつでもどこからでも簡単にアクセスできます。OCE は、Android および iOS(iPhone/iPad) それぞれに対応したモバイルアプリケーションを提供します。サポートするモバイルOSの種類およびバージョンは、下記ドキュメントをご確認ください Supported Mobile Devices モバイル・アプリケーションは、Web ブラウザとほぼ同じ操作を提供します。主な提供機能は以下の通りです ドキュメント ファイル・フォルダの表示 フォルダの作成 ファイルのプレビュー ファイルのアップロード デバイス上のファイルのアップロード カメラで撮影した写真のアップロード ファイルのダウンロード（オフライン利用） 共有 メンバーリンクの共有 パブリックリンクの作成 ファイルの編集（Office アプリケーションがインストールされている場合） 会話 会話の表示、作成 メッセージの投稿 注釈の表示、設定 フラグ設定 通知フラグの確認 検索 ファイル、フォルダ、会話ほかの横断検索 アセット レビュー中アセットの表示 アセットの承認、却下 その他 割り当て容量の確認 アカウントの追加・管理 パスコード・ロック この文書は、2020年5月時点での最新バージョン(20.2.2)を元に作成されてます 前提条件 Oracle Content and...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/12_mobile_application/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/12_mobile_application/003.jpeg"
      },{
        "title": "Oracle Content and Experience を Headless CMS として使ってみよう【初級編】",
        "excerpt":"この文書は Oracle Content and Experience (OCE) のアセット管理機能を Headless CMS として利用する基本的な方法をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年1月時点での最新バージョン(21.1.2)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに、少なくとも下記4つのOCEインスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 1. アセット機能の利用準備 OCEのアセット管理機能を利用するための準備作業を行います。アセット・リポジトリ、公開チャネル、コンテンツ・タイプをそれぞれ作成し、関連付けを行います。 1.1 アセット・リポジトリを作成する アセット・リポジトリ（以降リポジトリ）を作成します。 リポジトリとは 「デジタル・アセット（画像）やコンテンツ・アイテム（ニュースやブログなどの構造化コンテンツ）を保管・管理する器」 です。リポジトリは複数作成することができます。 OCE インスタンスのアクセスします。OCE インスタンスの URL は以下の通りです。 https://&lt;OCEInstance&gt;-&lt;CloudAccount&gt;.cec.ocp.oraclecloud.com/documents/home &lt;OCEInstance&gt; OCEインスタンス名 &lt;CloudAccount&gt; クラウドアカウント名（テナンシー名） OCE...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/41_asset_headless/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/41_asset_headless/039.jpg"
      },{
        "title": "サイトの作成（Oracle Content and Experience のサイト機能を使ってみよう）",
        "excerpt":"OCE のサイト作成機能を利用し、Web サイト（スタンダードサイト）を作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアルです。ここでは、Web サイトの作成〜編集〜公開までの基本的な手順をハンズオン形式で習得します。 さらに、フォルダに登録される複数ドキュメントをWebページからダウンロードできる「資料ダウンロード」ページの作成方法も、あわせて習得します この文書は、2020年6月時点での最新バージョン(20.2.3)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する OCE の利用ユーザーに OCE インスタンスの CECStandardUser もしくは CECEnterpriseUser アプリケーション・ロールが付与されていること [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 0. はじめに OCE のサイト機能は、Web や HTML などの技術に詳しくないビジネスユーザーが、ドラッグ&amp;ドロップなどの直感的な操作で Web サイトを作成し、公開することができます。また、OCEは、レスポンシブ Web デザイン（Bootstrap）に対応した事前定義済のテンプレート（ひな型）を複数パターン提供します。これらを利用することで、パソコンやスマートフォン/タブレットに対応した Web サイトを、すばやく、簡単に、低コストで作成・公開できます また、OCE が提供する ファイル共有機能 や アセット機能 とシームレスな機能統合がされているため、ドラッグ&amp;ドロップなどのとても簡単な操作で、ドキュメントやアセットを Web サイト上に掲載し、公開することができます OCE は、以下の2種類のサイトを作成・公開できます。サイト作成時に選択することができます（※サイト・ガバナンス機能が無効化されている場合のみ）...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/61_create_site/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/contnt-management/61_create_site/1013.jpg"
      },{
        "title": "Oracle Content and Experience を Webコンテンツ管理(Web CMS) として利用しよう【初級編】",
        "excerpt":"この文書は Oracle Content and Experience (OCE) のサイト作成機能を利用し、Web サイトを作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアル【初級編】です。また、サイト上で公開するコンテンツは、アセット管理機能で管理されるコンテンツ・アイテムを利用します この文書は、2021年1月時点での最新バージョン(21.1.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する Oracle Content and Experience を Headless CMS として使ってみよう【初級編】が完了していること OCE の利用ユーザーに、少なくとも下記4つのOCE インスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 0. 説明 このチュートリアルでは、OCE のサイト機能を利用して Web サイトを作成・公開します。また、Web サイト上で公開するコンテンツは、以前のチュートリアルで作成したリポジトリ(Sample Content Repository) とコンテンツ・タイプ (sampleNewsType) を利用します。 作成するWebサイトは以下の通りです...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/62_webcms/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/62_webcms/058.jpg"
      },{
        "title": "Oracle Content and Experience のコンテンツ・レイアウトを編集しよう",
        "excerpt":"この文書は Oracle Content and Experience (OCE) のコンテンツ・レイアウトの編集し、Web ページ上でのコンテンツ・アイテムの表示形式をカスタマイズする方法をステップ・バイ・ステップで紹介するチュートリアルです この文書は、2021年1月時点での最新バージョン(21.1.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する Oracle Content and Experience を Headless CMS として使ってみよう【初級編】が完了していること Oracle Content and Experience を WebCMS として使ってみよう【初級編】が完了していること OCE の利用ユーザーに、少なくとも下記4つのOCE インスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 1. 説明 1.1 コンテンツ・レイアウトとは？ コンテンツ・レイアウトとは 作成されたコンテンツ・アイテムの表示形式...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/71_customize_contentlayout/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/71_customize_contentlayout/028.jpg"
      },{
        "title": "Oracle Content and Experience で作成したサイトのバナー画像を変更しよう",
        "excerpt":"このチュートリアルは、Oracle Content and Experience (OCE)のデフォルトテンプレートを利用して作成されたサイトのバナー画像を変更する手順について、ステップ・バイ・ステップで紹介します 1. 前提条件・事前準備 1.1 バージョン このハンズオンの内容は、Oracle Content and Experience 21.1.2 時点の内容で作成されています。最新の UI とは異なっている場合があります。最新情報については、製品マニュアルをご参照ください Oracle Content and Experience https://docs.oracle.com/en/cloud/paas/content-cloud/books.html https://docs.oracle.com/cloud/help/ja/content-cloud/index.htm（日本語翻訳版） 1.2 インスタンスの作成 OCEインスタンスが作成済であること。インスタンスの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience インスタンスを作成する 1.3 アセットリポジトリの作成 アセットリポジトリが作成済であること。リポジトリの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience を Headless CMS として使ってみよう【初級編】 1.4 Webサイトの作成 アセットを公開できるエンタープライズサイトが作成済であること。サイトの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience を...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/72_change_banner/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/72_change_banner/image014.jpg"
      },{
        "title": "Oracle Content and Experience のVideo Plus アセットを使ってみよう",
        "excerpt":"このチュートリアルは、Oracle Content and Experience (OCE)の有償オプション機能である 拡張ビデオ機能（Video Plus アセット） を利用する手順について、ステップ・バイ・ステップで紹介します 1. 前提条件の確認 1.1 バージョン このハンズオンの内容は、Oracle Content and Experience 21.1.2 時点の内容で作成されています。最新の UI とは異なっている場合があります。最新情報については、製品マニュアルをご参照ください Oracle Content and Experience https://docs.oracle.com/en/cloud/paas/content-cloud/books.html https://docs.oracle.com/cloud/help/ja/content-cloud/index.htm（※日本語翻訳版） 1.2 インスタンスの作成 OCEインスタンスが作成済であること。インスタンスの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience インスタンスを作成する 1.3 アセットリポジトリの作成 アセットリポジトリが作成済であること。リポジトリの作成方法は、以下のチュートリアルをご確認ください Oracle Content and Experience を Headless CMS として使ってみよう【初級編】 1.4 Webサイトの作成 アセットを公開できるエンタープライズサイトが作成済であること。サイトの作成方法は、以下のチュートリアルをご確認ください Oracle...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/73_videoplus/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/73_videoplus/video008.jpg"
      },{
        "title": "Oracle Content and Experience で多言語サイトを作成しよう",
        "excerpt":"このチュートリアルは Oracle Content and Experience (OCE) のサイト作成機能を利用し、多言語サイトを作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアルです。また、サイト上で公開するコンテンツは、アセット・リポジトリで管理されるコンテンツ・アイテム（多言語）を利用します この文書は、2021年4月時点での最新バージョン(21.2.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する Oracle Content and Experience を Headless CMS として使ってみよう【初級編】 OCE の利用ユーザーに、少なくとも下記4つのOCE インスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、Oracle Content and Experience インスタンスの利用ユーザーを作成する をご確認ください。 なお、以下のチュートリアルを実施済みで、OCEのサイト作成と公開、アセットの作成と公開、それぞれの手順について習得済みであることが望ましい Oracle Content and Experience を Webコンテンツ管理(Web CMS) として利用しよう【初級編】 0. 説明 0.1 このチュートリアルで実施すること このチュートリアルでは、OCE...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/74_create_multilingual/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/74_create_multilingual/040.jpg"
      },{
        "title": "Oracle Content and Experience のタクソノミを使ってみよう",
        "excerpt":"このチュートリアルは Oracle Content and Experience (OCE) のタクソノミ機能を利用し、リポジトリ内のアセットを分類する方法をステップ・バイ・ステップで紹介するチュートリアルです。 この文書は、2021年4月時点での最新バージョン(21.2.1)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する Oracle Content and Experience を Headless CMS として使ってみよう【初級編】 Oracle Content and Experience を Webコンテンツ管理(Web CMS) として利用しよう【初級編】 0. 説明 タクソノミ（Taxonomy） タクソノミ（Taxonomy）は、情報を階層構造で整理したものです。OCEのタクソノミ機能は、コンテンツ開発者により作成され、明確に定義されたカテゴリによりアセットを階層構造で分類します。タクソノミでアセットを分類することで、ユーザーはカテゴリをドリルダウンすることで、必要なアセットを簡単に探すことができます OCEのタクソノミ機能については、以下のドキュメントをあわせてご確認ください Manage Taxonomies このチュートリアルで作成するカテゴリ（Sample Menu Category）を以下に示します 季節のオススメ ドリンク コーヒー ティー ジュース フード デザート サンドイッチ スナック この例では、3つの上位カテゴリ「季節のオススメ」「ドリンク」「フード」があります。「季節のオススメ」カテゴリには子カテゴリがありませんが、「ドリンク」と「フード」のカテゴリにはいくつかの子カテゴリがあります。子カテゴリには、それぞれ独自の子カテゴリを設定できます。...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/75_taxonomy/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/75_taxonomy/023.png"
      },{
        "title": "OCEのサイト・セキュリティとサイト・ガバナンスを理解する",
        "excerpt":"このチュートリアルはOracle Content and Experience(OCE)で作成するWebサイトの サイト・セキュリティ と サイト・ガバナンス の設定方法をステップ・バイ・ステップで紹介するチュートリアルです この文書は、2021年5月時点での最新バージョン(21.2.2)を元に作成されてます 前提条件 Oracle Content and Experience インスタンスを作成する また、以下のチュートリアルを実施済みで、OCEのサイト作成と公開の手順について習得済みであることが望ましい Oracle Content and Experience のサイト機能を使ってみよう【初級編】 1. サイト・セキュリティ 1.1 説明 OCEのサービス管理者は、ユーザーが作成・公開するWebサイトの サイト・セキュリティ(=公開範囲) を制限できます。サイトの公開範囲は パブリック と セキュア の2パターンで、それぞれの特徴は以下の通りです。 パブリック 公開範囲の制限なし 誰でも参照可能なWebサイト 主な利用例 コーポレートサイト、ブランドサイト、キャンペーンサイトなど セキュア 公開範囲の制限あり IDCSに登録されるユーザーIDおよびパスワードにより認証され、サイト管理者により設定されたアクセス権限を持つユーザーのみが参照できるWebサイト 公開範囲は「クラウド・ユーザー」「訪問者」「サービス・ユーザー」「特定のユーザー」より選択（以下の表を参照） 主な利用例 イントラサイト、代理店専用サイト、会員専用サイトなど 公開範囲 サイトにアクセスできるユーザー クラウド・ユーザー OCEインスタンスが利用するIDCSにユーザー登録されたIDCSユーザー。OCEインスタンスへのアクセス権の有無は関係ありません 訪問者 OCEインスタンスのCECSitesVisitorアプリケーションロールが付与されたユーザー サービス・ユーザー...","categories": [],
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/content-management/77_sitesecuritygovernance/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/77_SiteSecurityGovernance/021.png"
      },{
        "title": "101: ADBインスタンスを作成してみよう",
        "excerpt":"この章は大きく2つの内容で構成されています。 #1 : メニュー画面を操作し、リージョンおよびコンパートメントを設定いただきます。 (所要時間：5分) #2 : ADBインスタンスを作成、データベース・ユーザー（スキーマ）を作成します。 (所要時間：20分) #1. リージョンを設定し、コンパートメントを用意しよう 作業の流れ : サービス画面へのアクセス リージョンの確認、設定 コンパートメントの確認、作成 1. サービス画面へのアクセス まず初めにOracle Cloud Infrastructure のコンソール画面から、ADBのサービス画面にアクセスします。 ブラウザから https://www.oracle.com/jp/index.html にアクセスし、ページ上部の アカウントを表示 をクリックし、クラウドにサインイン をクリックします。 本手順書ではFirefoxを前提に記載しています。英語表記の場合は Sign in to Cloud をクリックしてください。 お手持ちのクラウドテナント名（アカウント名）を入力し、 Continue をクリックします。（ここでは例としてテナント名に「SampleAccount」を入力しています。） クラウドユーザー名 と パスワード を入力し、 Sign In をクリックしてログインします。 （ここでは例として「SampleName」を入力しています。） 以下のようなダッシュボード画面が表示されればOKです。 補足）上手く表示されない場合は以下のURLをお試しください。 https://console.ap-tokyo-1.oraclecloud.com/?tenant=&lt;クラウド・アカウント&gt; 尚、 &lt;クラウド・アカウント&gt;...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/database/adb101-provisioning/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/database/adb101-provisioning/img11.png"
      },{
        "title": "102: まずADBにデータをロードしよう(Database Actions)",
        "excerpt":"この章ではSQL Developer Webの後継機能である、Database Actionsを利用して、サンプルデータをADBインスタンスにデータをアップロードします。 事前に前提条件にリンクされているサンプルデータのCSVファイルをお手元のPC上にダウンロードください。 （集合ハンズオンセミナーでは講師の指示に従ってください） 前提条件 : ADBインスタンスを作成しようを完了していること 以下にリンクされているサンプルデータのCSVファイルをダウンロードしていること サンプルデータファイルのダウンロードリンク 注意 : チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 1.手元のPCからCSVデータをアップロードしてみよう まず手元のPC上のデータをADBインスタンスにアップロードしてみましょう。サンプルデータとしてsales_channels.csvファイルを利用します。 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続 を参照し、Database Actionsを起動し、Adminユーザーで接続してください。ツールタブから、データベース・アクションを開くをクリックしてください。 Database Actionsのランディングページのデータ・ツールから　データ・ロード を選択します。 データの処理には、データのロード を選択し、データの場所には、ローカル・ファイル を選択して 次 をクリックします。 ファイルの選択をクリックし、ダウンロードして解凍した sales_channels.csv を選択します。 sales_channels.csvがロードできる状態になりました。ロード前にペンアイコンをクリックし、詳細設定を確認・変更できます。 sales_channels.csvの表定義等のデータのプレビューを確認したら 閉じる をクリックします。 緑色の実行ボタンをクリックし、データのロードを開始します。 データ・ロード・ジョブの実行を確認するポップアップが表示されるので、実行 をクリックします。 sales_channels.csvに緑色のチェックマークが付き、ロードが完了しました。完了をクリックします。 ロード完了後、赤枠のマークをクリックすると、エラーログ等の詳細を見ることができます。 ロードされたsales_channels.csvが表として格納されたのかワークシートで確認していきます。SQLをクリック。 ロードされたデータの内容・件数を確認するために以下のSQLをワークシートに貼り付けて実行します。 select * from sales_channels; 結果が表示されます。 これで、手元のPCからデータをADBにロードするチュートリアルが完了しました。 次は、Database Actionsで、クラウド・ストレージからのデータのロードをしてみましょう。...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/database/adb102-dataload/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/database/adb102-dataload/adb2-1_1.png"
      },{
        "title": "103: Oracle LiveLabsのご紹介(Database Actions)",
        "excerpt":"Database Actionsで利用できる機能はユーザ作成やデータ・ロードだけではありません。 データベース管理者はもとより、Autonomous Databaseのデータを開発者やデータ分析者がすぐに利用できる機能群が提供されています。 詳細はこちらの資料をご確認ください。 　　 データ活用に関わる機能であるデータロード、カタログ、データインサイト、ビジネスモデルは、Oracle LiveLabs というサイトでイメージのようにシナリオに沿って実環境で体験することができます。この章ではその方法をご案内します。 1.Oracle LiveLabsとは? Oracle LiveLabs とはOracle Cloud Infrastructure上でお試しいただける様々なワークショップをまとめたサイトです。150種類を超える数のワークショップが登録されています。 　　 ワークショップの実行には、ご利用いただいているOracle Cloud環境およびAlways Free/トライアル環境をお使いいただけます。またワークショップによっては、Oracle LiveLabsで時間制限を設けた一時利用環境も提供しております。 (一時利用環境の利用手順についてはこちらが参考になります。) なお、英語での提供ではありますが、ブラウザの翻訳機能をご利用いただくことで十分に進めることができます。このチュートリアルでは、日本語表示の場合はGoogle Chromeの翻訳機能を利用しています。 2.Database Actionsのワークショップ Oracle LiveLabsのDatabase Actionsのワークショップはこちらです。 “Introduction to Autonomous Database Tools” 概要と開始手順 このワークショップでは、架空のオンライン映画ストリーミング会社”Oracle MovieStream”の社員になった想定で、顧客データ、視聴データをもとに顧客の傾向を分析していきます。 具体的には、分析するためのデータのロードとクレンジング、ビジネスに即した分析モデル作成とそこからの洞察を行います。それらすべてをDatabase Actionsで実施できるのです。 それでは、利用する環境に合わせて、以下のどちらかをクリックしてください。このチュートリアルではフリートライアルを想定してLaunch Free Trial Workshopを選択しています。 ワークショップのホーム画面が表示されました。 このDatabase Actionsのワークショップは大きく3つのラボで構成されています。 ラボ1:ADBインスタンスのプロビジョニング ラボ2:データベースユーザーの作成 ラボ3:自律型データベースツールの使用 既にADBインスタンス作成済みの場合はラボ2から進めてください。...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/database/adb103-livelabs/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/database/adb103-livelabs/labimage.png"
      },{
        "title": "104: クレデンシャル・ウォレットを利用して接続してみよう",
        "excerpt":"Autonomous Database にはさまざまなツールが同梱されており、簡単にご利用いただけますが、 一方で、これまでお使いのアプリケーションからの接続するときはどのように接続するのでしょうか？ Autonomous Databaseには暗号化およびSSL相互認証を利用した接続が前提としており、そのため接続する際はクレデンシャル・ウォレット（Credential.zipファイル）を利用する必要があります。 本章ではこのクレデンシャル・ウォレットを使用した接続方法について確認していきます。 尚、クレデンシャル・ウォレットの扱いに慣れてしまえば、Autonomous だからと言って特別なことはありません。 所要時間 : 約20分 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、ユーザーアカウントがあること 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切な権限がユーザーに付与されていること ADBインスタンスが構成済みであること SQL Developerを使用した接続を行いたい場合には、クライアントツールがインストール済みであること。 インストールはこちらから 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. クレデンシャル・ウォレットのダウンロード 2. 設定ファイルの編集 3. ADBに接続 3-1. SQL*Plus を使った接続 3-2. SQLcl を使った接続 3-3. SQL Developer を使った接続 3-4. Database...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/database/adb104-connect-using-wallet/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/database/adb104-connect-using-wallet/img1_3.png"
      },{
        "title": "105: ADBの付属ツールで簡易アプリを作成しよう(APEX)",
        "excerpt":"Autonomous Databaseはインスタンスを作成するとすぐにWebアプリ開発基盤であるOracle APEXを利用できるようになります。 追加コストは不要です。 Oracle APEXは分かりやすいインターフェースで、コーディングと言った専門的な知識専門的な知識がなくてもアプリケーションを開発できるため非常に人気があります。 Autonomous Database上でAPEXを利用すると、バックアップや可用性、セキュリティ等のインフラの面倒は全てオラクルに任せて、アプリケーションだけに集中できます。 この章ではADBインスタンスは作成済みであることを前提に、APEXコンソールの起動から簡単なアプリケーション作成までを体験いただきます。 サンプルとして、これまでExcelで管理していた受発注データを利用して、簡単なアプリケーションを作ってみましょう。 所要時間 : 約10分 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、ユーザーアカウントがあること 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切な権限がユーザーに付与されていること ADBインスタンスが構成済みであること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次： 1. スプレッドシートのサンプルを用意 2. APEXのワークスペースの作成 3. APEXコンソールの起動 4. スプレッドシートから簡易アプリケーションの作成 5. アプリケーションの実行 6. 実行確認 1. スプレッドシートのサンプルを用意 サンプルとして受発注データ(orders.csv)を用意します。 下記のリンクをクリックし、サンプルファイル(orders.zip)を手元のPCにダウンロードして展開してください。 orders.csvをダウンロード 受発注データは次のような表になっており、ORDER_KEY(注文番号)、ORDER_STATUS(注文状況)、UNITS(個数) …etc などの列から構成される、5247行の表となっています。...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/database/adb105-create-apex-app/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/database/adb105-create-apex-app/img3_2.png"
      },{
        "title": "107: ADBの付属ツールで機械学習を始めよう(AutoML UI)",
        "excerpt":"Oracle AutoML UIを使った機械学習   Oracle AutoML UIを使えば、ビジネスユーザやBIベースで分析を行うユーザが機械学習モデルをビルド、デプロイすることが可能になります。 AutoML UIのチュートリアルは下記のリンクからアクセスすることができます。   OracleのAutoML UIで気軽に明日雨が降るか予測しよう  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/database/adb107-machine-learning/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/database/adb107-machine-learning/img1.png"
      },{
        "title": "202: コマンドラインから大量データをロードしてみよう(DBMS_CLOUD)",
        "excerpt":"大量データをAutonomous Databaseにロードするために、DBMS_CLOUDパッケージを活用したデータのロード方法を確認していきましょう。 下記のサンプルデータ(customers.csv)をローカルデバイスに事前にダウンロードして下さい。 サンプルデータファイル(customers.csv)のダウンロードリンク Database Actionsに接続 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続 を参照し、Database Actionsを起動し、Adminユーザーで接続してください。ツールタブから、データベース・アクションを開くをクリックしてください。 DBMS_CLOUDパッケージを使ったデータロードをワークシートで実行していきます。SQLをクリックしてください。 DBMS_CLOUDパッケージの実行 以下の1～5までの例を参考にコマンドを作成し、ワークシートに貼り付けスクリプトの実行をクリックし、データをロードします（集合ハンズオンセミナーでは講師の指示に従ってください) クレデンシャル情報の登録 クレデンシャル情報の登録に必要な認証情報を手に入れる手順は、ADBにデータをロードしてみよう(Database Actions)の記事内のクラウド・ストレージからのデータのロードしてみようの項から、把握することができます。 credential_name: DBに保存した認証情報を識別するための名前、任意 username: 上記で取得したOracle Object Storageにアクセスするための ユーザ名 password: 取得したAuth Token BEGIN DBMS_CLOUD.CREATE_CREDENTIAL( CREDENTIAL_NAME =&gt; 'USER_CRED', USERNAME =&gt; 'myUsername', PASSWORD =&gt; 'LPB&gt;Ktk(1M1SD+a]+r' ); END; ※ 作成済みのCredentialを削除する場合は以下を実行ください BEGIN DBMS_CLOUD.DROP_CREDENTIAL(credential_name =&gt; 'USER_CRED'); END; ADB上にロード先の表作成 DROP TABLE customers;...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/database/adb202-dataload-dbms-cloud/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/database/adb202-dataload-dbms-cloud/img2.png"
      },{
        "title": "204: マーケットプレイスからの仮想マシンのセットアップ方法",
        "excerpt":"Oracle Cloud Infrastructure（OCI） では様々な仮想マシンイメージをマーケットプレイスで公開しています。 この章では、その中の一つとして、開発者向けのLinux仮想マシンである Oracle Cloud Developer Image をセットアップする手順を記載しています。 Oracle Cloud Developer Image は、Python、Node.js、Goといった言語や、Oracle Instant Clientなどの各種接続ドライバ、Oracle Cloud Infrastructure CLI(OCI CLI)といった各種ツールがプリインストールされており、アプリケーション開発は勿論、各種検証作業を実施する際にとても便利です。 尚、マーケットプレイスの詳細については こちら を参照ください。 またOracle Cloud Infrastructureに仮想マシン作成する手順詳細に関しては本チュートリアル 入門編の その3 - インスタンスを作成する の手順も併せてご確認ください。 所要時間 : 約30分 前提条件 : Oracle Cloud Infrastructure の環境(無料トライアルでも可) と、ユーザーアカウントがあること 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切な権限がユーザーに付与されていること ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 ADBインスタンスのクレデンシャル・ウォレットがダウンロード済みであること ※クレデンシャルウォレットのダウンロード方法については、本ハンズオンガイドの 104:...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/database/adb204-setup-VM/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/database/adb204-setup-VM/image_top.png"
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
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure ロードバランサー・サービスを利用することにより、仮想クラウド・ネットワーク(VCN)内の複数のサーバーに対して一つのエントリーポイントからのネットワーク・トラフィックを分散させることができます。ロードバランサー・サービスは、パブリックIPアドレスの分散を行うパブリック・ロードバランサーと、プライベートIPアドレスの分散を行うプライベート・ロードバランサーの2種類が提供されます。双方のタイプのロードバランサーとも、一定の帯域(100MB/s~8000MB/s)の保証と、高可用性がデフォルトで提供されます。またパブリック・ロードバランサーについてはVCN内の2つの異なるサブネットに跨って構成されるため、アベイラビリティ・ドメイン全体の障害に対する耐障害性が提供されます。 この章では、シンプルなパブリック・ロードバランサーを構成し、VNC内の2台のWebサーバーに対する負荷分散を構成する手順について学習します。 所要時間 : 約50分 前提条件 : その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること 2048bit 以上のRSA鍵ペアを作成していること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 : 仮想クラウド・ネットワークと2つのサブネットの作成 2つのインスタンスの作成とWebサーバーの起動 ロードバランサー用のサブネットの作成 ロードバランサーの構成 ロードバランサーへのhttp通信許可の設定 ロードバランサーの動作の確認 Webサーバーの保護 1. 仮想クラウド・ネットワークと2つのサブネットの作成 その2 - クラウドに仮想ネットワーク(VCN)を作る を参考に、仮想クラウド・ネットワーク(VCN)および付随するネットワーク・コンポーネントを作成してください。 作成時に 仮想クラウド・ネットワークおよび関連リソースの作成 オプションで作成することで、簡単に今回のチュートリアルに必要なVCNおよび付随コンポーネントを作成することができます。 この章では、Tokyoリージョン (可用性ドメインが1つの構成) を例として、最終的に下記のような構成を作成します。...","categories": [],
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
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracle Cloud Infrastructure でLinuxインスタンスを作成するとデフォルトで sshd が起動し外部からsshでアクセスできるようになります。普通はこのsshで大抵の処理を行うことができますが、ごくたまにsshできない環境からアクセスが必要だったり、あるいはできていたsshが突然できなくなってしまったといった場合があります。そんなアクセスできないトラブル発生時に、コンソール・アクセスが有効な手段になる場合があります。 このチュートリアルでは、Oracle Cloud Infrastructure のインスタンスに対してシリアル・コンソールやVNCコンソールを通じてアクセスする方法を学習します。 また、今回はクライアントにWindows PCを利用します。Mac OS または Linux クライアントからのアクセスについては、マニュアルなどの別ドキュメントを参照してください。 所要時間 : 約20分 前提条件 : Oracle Cloud Infrastructure で、作成済みのLinuxインスタンスがあること コンソール・アクセスの認証に使用するSSH鍵ペアを作成済なこと 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 : はじめに シリアル・コンソールが有効なケースの整理 アクセス元クライアントの準備 インスタンスでのコンソール接続許可の作成 シリアル・コンソール接続文字列の取得 インスタンスのシリアル・コンソールに接続 シリアル・コンソールを使ってメンテナンス・モードでブートする メンテナンス・モードでシステム設定ファイルを編集する インスタンスのssh鍵を再登録してアクセスを回復する...","categories": [],
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
        "title": "OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する",
        "excerpt":"OCI Observability&amp;Managementのサービスの1つ、Logging Analyticsでは様々なログを可視化、分析する機能を提供します。 Logging AnalyticsではOCIの各種ログ(VCN, Load Balancer, Audit…)だけでなく、エージェントを使用することでOSやデータベース、Webサーバーなどのログを可視化、分析することが可能です。 この章では、エージェントは利用せず簡単な操作でOCIの監査ログをLogging Analyticsで分析する手順をご紹介します。 所要時間 : 約20分 前提条件 : Logging Analyticsが有効化されていること OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. IAMポリシーの作成 Logging Analyticsを利用するためにはOCIの他のサービスと同様に、IAMポリシーによってアクセス権限が付与されている必要があります。 以下のポリシーをテナンシで作成してください。 ※この章では、ユーザーにLogging Analyticsの管理権限を付与します。ユーザーはログ・アナリティクスの構成やログファイルのアップロード、削除を含む全ての管理権限を行うことができます。ドキュメント を参考にユーザーの役割、ロールごとにIAMポリシーの権限を調整してください。 ※OCIのテナンシ管理者がLogging Analyticsを利用する場合は、作成するポリシーは「1-2.Logging Analyticsサービスへのポリシー」のみになります。その他のポリシーは作成する必要はありません。 1-1. Loggingサービスを利用するためのポリシー allow group &lt;IAMグループ名&gt; to MANAGE logging-family in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to...","categories": [],
        "tags": ["intermediate"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/audit-log-analytics/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/intermediates/audit-log-analytics/audit-loganalytics16.png"
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
        "title": "Cloud Guardを使ってみる",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/cloud-guard/",
        "teaser": null
      },{
        "title": "Oracle Data Safe チュートリアルまとめ",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。   1.Oracle Data Safeを有効化する  2.Oracle Data Safeのデータ・マスキングを試してみる  3.Oracle Data Safeのアクティビティ監査で操作ログを記録する  4.Oracle Data Safeにフェデレーッド・ユーザーでアクセスする  5.プライベートIPアドレスでData SafeにDBを登録する  6.Oracle Data SafeでオンプレミスのOracle DBを管理する  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/data-safe-tutorials/",
        "teaser": null
      },{
        "title": "OCI Database ManagementでOracleDBのパフォーマンス監視をする",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/database-management/",
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
        "tags": ["OCE"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/oce-tutorial/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/content-management/create_oce_instance/024.jpg"
      },{
        "title": "Oracle Blockchain Platform チュートリアル",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": ["Blockchain"],
        "url": "https://oracle-japan.github.io/ocitutorials/intermediates/blockchain-tutorial/",
        "teaser": "https://oracle-japan.github.io/ocitutorials/blockchain/01_1_create_instance/service_console.png"
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス・リミット、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 無償トライアル環境のお申込みについては こちら の資料を参照してください。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります image サポートされるブラウザの確認 このチュートリアルでは、Oracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナント名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID ユーザー名 - ログインのためのユーザー名 パスワード - ログインのためのパスワード ログイン情報の入手方法は、ユーザーが作られるタイミングによって異なります。...","categories": [],
        "tags": [],
        "url": "https://oracle-japan.github.io/ocitutorials/webapp/01-getting-started/",
        "teaser": null
      }]
