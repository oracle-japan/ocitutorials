var store = [{
        "title": "101: ADBインスタンスを作成してみよう",
        "excerpt":"はじめに この章はまずAutonomous Database(ADB) を構成するために必要なリージョンおよびコンパートメントを設定いただきます。 その上で、ADBインスタンスを作成、データベース・ユーザー（スキーマ）を作成し、Database Actionsを使用してアクセスしてみます。 目次 1. リージョンを設定し、コンパートメントを用意しよう 2. ADBインスタンスを作成してみよう 3. Database Actionsで操作してみよう 所要時間 : 約20分 1. リージョンを設定し、コンパートメントを用意しよう 1-1. サービス画面へのアクセス まず初めにOracle Cloud Infrastructure のコンソール画面から、ADBのサービス画面にアクセスします。 ブラウザから https://www.oracle.com/jp/index.html にアクセスし、ページ上部の アカウントを表示 をクリックし、クラウドにサインイン をクリックします。 本手順書ではFirefoxを前提に記載しています。英語表記の場合は Sign in to Cloud をクリックしてください。 お手持ちのクラウドテナント名（アカウント名）を入力し、 Continue をクリックします。（ここでは例としてテナント名に「SampleAccount」を入力しています。） クラウドユーザー名 と パスワード を入力し、 Sign In をクリックしてログインします。 （ここでは例として「SampleName」を入力しています。） 以下のようなダッシュボード画面が表示されればOKです。 補足...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb101-provisioning/",
        "teaser": "/ocitutorials/adb/adb101-provisioning/img11.png"
      },{
        "title": "102: ADBにデータをロードしよう(Database Actions)",
        "excerpt":"はじめに この章ではDatabase Actions（SQL Developer Webの後継機能）を利用して、サンプルデータをADBインスタンスにデータをアップロードします。 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 以下にリンクされているサンプルデータのCSVファイルをダウンロードしていること サンプルデータファイルのダウンロードリンク 目次 1. 手元のPCからCSVデータをロードしてみよう 2. クラウド・ストレージからデータをロードしてみよう 3. クラウド・ストレージのデータをフィードしてみよう 所要時間 : 約20分 1. 手元のPCからCSVデータをロードしてみよう まず手元のPC上のデータをADBインスタンスにロードしてみましょう。サンプルデータとしてsales_channels.csvファイルを利用します。 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続 を参照し、Database Actionsを起動し、Adminユーザーで接続してください。ツールタブから、データベース・アクションを開くをクリックしてください。 Database Actionsのランディングページのデータ・ツールから　データ・ロード を選択します。 データの処理には、データのロード を選択し、データの場所には、ローカル・ファイル を選択して 次 をクリックします。 ファイルの選択をクリックし、ダウンロードして解凍した sales_channels.csv を選択します。 sales_channels.csvがロードできる状態になりました。 ロード前にペンアイコンをクリックし、詳細設定を確認・変更できます。 sales_channels.csvの表定義等のデータのプレビューを確認したら 閉じる をクリックします。 緑色の実行ボタンをクリックし、データのロードを開始します。 データ・ロード・ジョブの実行を確認するポップアップが表示されるので、実行 をクリックします。 sales_channels.csvに緑色のチェックマークが付き、ロードが完了しました。完了をクリックします。 補足...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb102-dataload/",
        "teaser": "/ocitutorials/adb/adb102-dataload/adb2-1_1.png"
      },{
        "title": "103: Oracle LiveLabsのご紹介",
        "excerpt":"はじめに Oracle LiveLabs とはOracle Cloud Infrastructure上でお試しいただける様々なワークショップをまとめたサイトです。2024/6現在900種類を超える数のワークショップが登録されています。 ワークショップの実行には、ご利用いただいているOracle Cloud環境およびAlways Free/トライアル環境をお使いいただけます。またワークショップによっては、Oracle LiveLabsで時間制限を設けた一時利用環境も提供しております。 この章では、Autonomous Databaseのワークショップで一時利用環境を利用する方法について紹介します。 なお、Livelabsは英語での提供ではありますが、ブラウザの翻訳機能をご利用いただくことで十分に進めることができます。 前提条件 Oracleアカウントが作成済みであること(一時利用環境の場合は必須) 目次 1.ワークショップの検索 2.ワークショップ詳細の確認と開始 3.ワークショップの実行 4.ワークショップの時間延長 5.ワークショップの終了 所要時間 : 約10分（ワークショップ実行時間は含みません） 1.ワークショップの検索 Livelabsのトップページ にある View All Workshops ボタンをクリックするとファセット検索の画面へ遷移します。ワークショップの各カードにはワークショップのタイトルと概要、所要時間が表示されます。 ファセット検索で指定できる条件には以下があります。 Level : 対象レベル Beginner(初心者)/Intermediate(中級者)/Advanced(上級者) Workshop Type : ワークショップの提供タイプ Paid Credits(有料クレジット)/Sprints(スプリント)/Run on Livelabs(Livelabs一次利用環境)/Run on Gov Cloud/ADB for Free(Always Free環境)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb103-livelabs/",
        "teaser": "/ocitutorials/adb/adb103-livelabs/labimage.png"
      },{
        "title": "104: クレデンシャル・ウォレットを利用して接続してみよう",
        "excerpt":"はじめに Autonomous Database にはさまざまなツールが同梱されており、簡単にご利用いただけますが、 一方で、これまでお使いのアプリケーションからの接続するときはどのように接続するのでしょうか？ Autonomous Databaseには暗号化およびSSL相互認証を利用した接続が前提としており、そのため接続する際はクレデンシャル・ウォレット（Credential.zipファイル）を利用する必要があります。 本章ではこのクレデンシャル・ウォレットを使用した接続方法について確認していきます。 尚、クレデンシャル・ウォレットの扱いに慣れてしまえば、Autonomous だからと言って特別なことはありません。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 SQL Developerを使用した接続を行いたい場合には、当該クライアントツールがインストール済みであること。インストールはこちらから 目次 1. クレデンシャル・ウォレットのダウンロード 2. 設定ファイルの編集 3. ADBに接続 3-1. SQL*Plus を使った接続 3-2. SQLcl を使った接続 3-3. SQL Developer を使った接続 3-4. Database Actions を使った接続 所要時間 : 約20分 1. クレデンシャル・ウォレットのダウンロード ウォレットを利用したADBインスタンスへの接続には、対象インスタンスへの接続情報が格納された クレデンシャル・ウォレット を利用する必要があります。 （より高いセキュリティを担保するために、ADBインスタンスはcredential.ssoファイルを利用した接続のみを受け入れます。） まず、ADBへの接続情報が格納されるCredential.zipファイルをお手元のPCにダウンロードしましょう。 OCIのコンソールにアクセスし、左上のメニューから Oracle Database...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb104-connect-using-wallet/",
        "teaser": "/ocitutorials/adb/adb104-connect-using-wallet/img1_3.png"
      },{
        "title": "105: ADBの付属ツールで簡易アプリを作成しよう(APEX)",
        "excerpt":"はじめに この章ではADBインスタンスは作成済みであることを前提に、APEXコンソールの起動から簡単なアプリケーション作成までを体験いただきます。 サンプルとして、これまでExcelで管理していた受発注データを利用して、簡単なアプリケーションを作ってみましょう。 Autonomous Databaseはインスタンスを作成するとすぐにWebアプリ開発基盤であるOracle APEXを利用できるようになります。追加コストは不要です。 Oracle APEXは分かりやすいインターフェースで、コーディングと言った専門的な知識専門的な知識がなくてもアプリケーションを開発できるため非常に人気があります。 Autonomous Database上でAPEXを利用すると、バックアップや可用性、セキュリティ等のインフラの面倒は全てオラクルに任せて、アプリケーションだけに集中できます。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次 1. スプレッドシートのサンプルを用意 2. APEXのワークスペースの作成 3. APEXコンソールの起動 4. スプレッドシートから簡易アプリケーションの作成 5. アプリケーションの実行 6. 実行確認 所要時間 : 約10分 1. スプレッドシートのサンプルを用意 サンプルとして受発注データ(orders.csv)を用意します。 下記のリンクをクリックし、サンプルファイル(orders.zip)を手元のPCにダウンロードして展開してください。 orders.csvをダウンロード 受発注データは次のような表になっており、ORDER_KEY(注文番号)、ORDER_STATUS(注文状況)、UNITS(個数) …etc などの列から構成される、5247行の表となっています。 2. APEXのワークスペースの作成 アプリケーションを作成するためには、ワークペースを作成する必要があります。 最初にADMINユーザで管理画面にログインします。 ADBインスタンスの詳細画面を表示します。メニュー画面上部の ツール構成 タブを選択し、Oracle APEX のパブリック・アクセスURLをコピーして、ブラウザの別のタブから開きます。 ログイン画面が表示されるので、下部の言語欄から 日本語 を選択しておきます。（初回は英語表示ですが、日本語を含めた他言語表示に変更することが可能です）...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb105-create-apex-app/",
        "teaser": "/ocitutorials/adb/adb105-create-apex-app/image105-8.png"
      },{
        "title": "106: ADBでコンバージド・データベースを体験しよう（JSONデータの操作）",
        "excerpt":"はじめに コンバージド・データベースとは、あらゆるデータをサポートするマルチモデルを採用し、あらゆるワークロードをサポートしていくこと、また様々なツールをDBに統合し開発生産性に貢献していくという、Oracle Databaseのコンセプトの一つです。 Autonomous Databaseもコンバージド・データベースとして、RDBのフォーマットだけでなく、JSON、Text、Spatial、Graphといった様々なフォーマットを格納しご利用いただけます。 格納されるデータの種類ごとにデータベースを用意するのではないため、データの重複や整合性に関する懸念は不要であり、またそのためのETLツールを検討する必要もなく、結果的にコストを抑えることが可能です。 では、実際にどのように操作するのでしょうか？このページではJSONを例にその操作方法の一例を紹介します。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次 1.データを格納してみよう 2.SODA APIでアクセスしてみよう 3.SQLでアクセスしてみよう 所要時間 : 約20分 1. データを格納してみよう まずはJSONデータをADBインスタンスに登録し、登録したデータを確認しましょう。ここではSODA APIを実行できるDatabase Actionsを利用します。 SODA APIは、Simple Oracle Document Accessの略で、オラクルが用意するJSONデータにアクセスする際のAPIです。新たにJSONコレクションを作成する、挿入、検索、変更や削除にご利用いただけます。SQLで言えばDDL、DMLに当たります。 このSODA APIはJavaScriptはもちろん、JavaやPython, PL/SQLなどからCallして利用することが可能ですし、SQLclやDatabase Actionsではデフォルトでインストールされています。 （参考資料: Autonomous JSON Database 技術概要 ） Database Actionsにアクセスし、SQLを選択します ドキュメントを格納するコレクションempを作成します。以下のスクリプトをワークシートに貼り付け、緑色のボタンで実行してください （コレクションとはRDBMSで言う表に相当し、内部的には一つの表を作成しています。） soda create emp コレクションempが作成されたことを確認します soda list JSONのドキュメントをempコレクションに格納します。以下のSODAコマンドを貼り付け...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb106-json/",
        "teaser": "/ocitutorials/adb/adb106-json/img00.png"
      },{
        "title": "107: ADBの付属ツールで機械学習(予測モデルからデプロイまで)",
        "excerpt":"はじめに この章では、Autonomous Databaseの複数の付属ツール(Database Actions、OML AutoML UI、OML Notebook、Oracle Application Express(APEX))を活用し、ワンストップの機械学習環境を体感していただきます。今回は、機械学習の題材として、タイタニック問題を扱います。タイタニックの乗客情報から乗客の生存予測を行うモデルを作成します。モデル作成後、そのモデルに実際に予測をさせて、更にその予測をアプリケーションでのレポートまで行います。データベースの中で機械学習のプロセスが完結しているOracleの機械学習へのアプローチを体験していただけると思います。 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 以下にリンクされているZipファイルをダウンロードし、解凍していること OMLチュートリアルで資料するファイル 目次 1. OMLユーザ新規作成 2. Database Actionsでデータロード 3. OML AutoML UIで生存予測モデル作成 4. OML Notebookで予測をかける 5. APEXで予測結果をレポート 6. まとめ 7. 参考資料 所要時間 : 約60分 1. OMLユーザ新規作成 まずOMLを利用する権限を持つユーザをDatabase Actionsで新規作成していきます。 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続 を参照し、Database Actionsを起動し、Adminユーザーで接続してください。ツールタブから、データベース・アクションを開くをクリックしてください。 管理 &gt; データベース・ユーザーをクリックしてください。 +ユーザの作成をクリックしてください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb107-machine-learning/",
        "teaser": "/ocitutorials/adb/adb107-machine-learning/img48.png"
      },{
        "title": "108: 接続文字列を利用して接続してみよう",
        "excerpt":"はじめに Autonomous Database への接続には、104: クレデンシャル・ウォレットを利用して接続してみよう でご紹介した通り、ウォレットファイルを利用した証明書認証・SSL暗号化接続がデフォルトになっています。 しかし特定の条件下では、このウォレットを利用しないでセキュアに接続することが可能です。 本章では、ADBにおけるネットワーク・アクセスの種類とウォレットを利用しない接続方式について確認していきます。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次 1. ADBにおけるネットワーク・アクセスの種類 2. TLS接続の前提条件 3. TLS接続 3-1. 仮想マシン作成 3-2. ACLの定義 3-3. DB接続文字列の確認 3-4. ADB接続 所要時間 : 約30分 1. ADBにけるネットワーク・アクセスの種類 ADBでは、プロビジョニング時に以下の3つの中からネットワーク・アクセス・タイプを選択することができます。 すべての場所からのセキュア・アクセス（パブリック・エンドポイント） データベース資格証明（ウォレット）を持っているユーザーであれば、インターネット上の全てのIPアドレスから接続できる方式です。 許可されたIPおよびVCN限定のセキュア・アクセス（パブリック・エンドポイント） 上の[すべての場所からのセキュア・アクセス]に、特定のIPアドレス、CIDRブロック、VCNからのアクセスに限定するようアクセス制御リスト(ACL)を設定する方式です。 プライベート・エンドポイント・アクセスのみ（プライベート・エンドポイント） ADBインスタンスにパブリックIPを持たせず、プライベートIPを持たせる場合に選択します。すでに作成済みのVCN、サブネット内にADBインスタンスを配置します。指定したVCNからのトラフィックのみ許可され、アクセス制御はサブネットのセキュリティ・リスト(SL)またはネットワーク・セキュリティ・グループ(NSG)で行います。 なお、ウォレットの差し替えが必要ですが、インスタンス作成後でもエンドポイントの変更は可能です。 また、接続経路は以下の3つの方法があります。 インターネット接続 IPsec VPNを介した接続 FastConnect(Private Peering / Public Peering)を利用した接続 2....","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb108-walletless/",
        "teaser": "/ocitutorials/adb/adb108-walletless/walletless_teaser.png"
      },{
        "title": "109: プライベート・エンドポイントのADBを作成してみよう",
        "excerpt":"はじめに Autonomous Databaseでは、パブリック・エンドポイントとプライベート・エンドポイントを選択できます。 プライベート・エンドポイントの場合は指定したVCN内のサブネット上にエンドポイントを配置することができます。 アクセス制御は指定したVCNのサブネットのセキュリティ・リスト、もしくはネットワーク・セキュリティ・グループ(NSG)を利用して行います。 目次 はじめに 1. プライベート・エンドポイントのADBへの接続 1-1. ネットワーク構成の確認 1-2. ADBの作成 1-3. ADBへの接続 1-4. パブリック・アクセスの許可 2. Database Actionsへの接続 2-1. パブリック・エンドポイントでACLを定義済み 2-2. プライベート・エンドポイントでInternetから接続 2-3. プライベート・エンドポイントでプライベート・ネットワークから接続 参考資料 所要時間 : 約30分 1. プライベート・エンドポイントのADBへの接続 1-1. ネットワーク構成の確認 プライベート・エンドポイントのAutonomous Database への接続方法は、IPsec VPN やFastConnect からアクセスする方法が一般的ですが、本章ではインターネットからの接続方法をご紹介します。 ネットワーク構成は上記のようにしています。各Security List の設定を以下に示します。 プライベート・サブネットsub_pri1は、パブリック・サブネットsub_pubからのSSHのみ許可、sub_pri2は、sub_pri1からのTCP接続(1521ポート)のみ許可しています。 本章では、パブリック・サブネットに踏み台サーバーを置いて利用しますが、インターネット側からアクセスする場合には、Bastionサービスも利用できます。 1-2. ADBの作成 プライベート・エンドポイントのADBを作成するには、ADBの作成ページの[ネットワーク・アクセスの選択]でプライベート・エンドポイント・アクセスのみを選択します。 以下の画像のようにADBを配置する仮想クラウド・ネットワークとサブネットを指定します。 なお、VCNのセキュリティ・リストのルールによるアクセス制御が設定されている場合、ネットワーク・セキュリティ・グループによるアクセス制御はオプションになります。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb109-private-endpoint/",
        "teaser": "/ocitutorials/adb/adb109-private-endpoint/private-endpoint_teaser.png"
      },{
        "title": "110: Oracle Analytics Desktopを使ってデータを見える化してみよう",
        "excerpt":"はじめに Autonomous Database (ADB) にはさまざまなツールが同梱されており、簡単にご利用いただけますが、 Oracle Analytics Desktop を使うと、ユーザーのPC上から Autonomous Database のデータを見える化できます。 Oracle Analytics Desktop は、デスクトップ・アプリケーションであり、データの探索および見える化するためのツールです。複数のソースからサンプル・データを簡単に検索したり、ローカルのデータセットを分析したり調査することが可能です。 Autonomous Database は暗号化およびSSL相互認証を利用した接続を前提としており、そのため接続する際はクレデンシャル・ウォレット（Credential.zipファイル）を利用する必要があります。 本章ではこのOracle Analytics Desktopを使用した Autonomous Database の見える化について確認していきます。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、101:ADBインスタンスを作成してみよう をご参照ください。 クレデンシャル・ウォレットを取得済みであること ※クレデンシャル・ウォレットの取得については、104:クレデンシャル・ウォレットを利用して接続してみよう を参照ください。 Oracle Analytics Desktop は、Windows OS用とMac OS用がありますが、本章ではWindows OS用 を使って説明します。 Oracle Analytics Desktop をインストールするPCから、プロキシ・サーバーを経由せずに、直接、インターネットに繋がること。 ※Oracle Analytics Desktop はプロキシ対応できません。 目次 1....","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb110-analyze-using-oad/",
        "teaser": "/ocitutorials/adb/adb110-analyze-using-oad/img3_13_1.png"
      },{
        "title": "111: SELECT AIを試してみよう",
        "excerpt":"はじめに Autonomous Databaseで使用することの出来る機能、Select AIを使えば自然言語を使用してデータを問い合せることが出来ます。 Select AIで大規模言語モデル(LLM)を使用することで、ユーザーが入力したテキスト（自然言語）をSQLに変換し、データベース内のデータを問合せることが出来ます。ユーザーは、自然言語を使ってデータベース内のデータと会話をすることが出来ます。 目次 1. OCI生成AIサービスのAPIキー取得 2. 環境設定 3. SELECT AIを試してみる 前提条件 101: ADBインスタンスを作成してみようを参考に、ADBインスタンスが作成済みであること 104: クレデンシャル・ウォレットを利用して接続してみようを参考に、SQL Developerを使ってADBに接続出来ること OCI生成AIサービスを使用可能なOsakaリージョン、Chicagoリージョン、Frankfurtリージョン、Londonリージョン、Sao Pauloリージョンのいずれかをホーム・リージョン、若しくはサブスクライブしてあること。詳しくは、Pretrained Foundational Models in Generative AIをご確認ください。 所要時間 : 約40分 1. OCI生成AIサービスのAPIキー取得 Select AIでは、2024年9月現在、OpenAI、Cohere、Azure OpenAI Service、OCI Generative AI Service、およびGoogle GeminiをAIプロバイダーとして使用することが出来ます。 本記事では、OCI生成AIサービスをAIプロバイダーとして使用したいと思います。 OCIコンソールにアクセスして、右上のプロファイルからユーザー設定を選択します。 左下のリソースからAPIキーを選択し、APIキーの追加をクリックします。 APIキー・ペアの生成（デフォルト）を選択し、秘密キーのダウンロードをした上で作成します。秘密キーは後程使用するので大切に保管しておきます。 構成ファイルのプレビューも後程使用しますので、コピーしメモを取っておきます。 2. 環境設定 Select AIはADBの機能なので、使用にはADBインスタンスが必要です。ADBのインスタンスが未作成の場合は101: ADBインスタンスを作成してみようを参考に、ADBインスタンスを作成します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb111-select-ai/",
        "teaser": "/ocitutorials/adb/adb111-select-ai/23.png"
      },{
        "title": "201: 接続サービスの理解",
        "excerpt":"Autonomous Database では、事前に定義済の接続サービスが用意されています。 本章では、接続サービスの概要をご紹介します。 所要時間 : 約10分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 目次： 1. 接続サービスとは？ 2. Database ActionsのResource Managerの設定画面にアクセスしよう 3. CPU/IOの優先度の変更しよう 4. 処理時間/利用IOの上限を設定しよう 5. 同時実行セッション数の制限が変更できることを確認しよう 1. 接続サービスとは？ 接続サービスの選択 インスタンスに接続する際、Autonomous Databaseはアプリケーションの特性に応じて適切な「接続サービス」を選択する必要があります。 この「接続サービス」は、パラレル実行・同時実行セッション数・リソース割り当てなどの制御について事前定義されたもので、ユーザーは接続サービスを選択するだけで、CPUの割当や並列処理をコントロールできます。 選択可能な接続サービスの種類は、次の通りです。 Autonomous Data Warehouse(ADW) では３種類、Autonomous Transaction Processing(ATP)では5種類あり、ワークロード適したものを選択します。 使い分けの指針、スタートポイント 代表的なワークロードを「OLTP系」と「バッチ系/DWH系」の２つのカテゴリに分類し、それぞれの処理の特性と適応する接続サービスについてまとめました。 OLTP系 バッチ系・DWH 特徴 少量の行しかアクセスしない 大量のユーザが同時に実行する 一般的なオーダーとしてはミリ秒レベル 大量の行にアクセスし、一括で処理する ユーザ数は少ない 一般的なオーダーとしては秒～分レベル...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb201-service-names/",
        "teaser": "/ocitutorials/adb/adb201-service-names/image_top.png"
      },{
        "title": "202: コマンドラインから大量データをロードしてみよう(DBMS_CLOUD)",
        "excerpt":"はじめに 大量データをAutonomous Databaseにロードするために、DBMS_CLOUDパッケージを活用したデータのロード方法を確認していきましょう。 下記のサンプルデータ(customers.csv)をローカルデバイスに事前にダウンロードして下さい。 サンプルデータファイル(customers.csv)のダウンロードリンク 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次 1. Database Actionsに接続 2. DBMS_CLOUDパッケージの実行 所要時間 : 約10分 1. Database Actionsに接続 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続 を参照し、Database Actionsを起動し、Adminユーザーで接続してください。ツールタブから、データベース・アクションを開くをクリックしてください。 DBMS_CLOUDパッケージを使ったデータロードをワークシートで実行していきます。SQLをクリックしてください。 2. DBMS_CLOUDパッケージの実行 以下の1～5までの例を参考にコマンドを作成し、ワークシートに貼り付けスクリプトの実行をクリックし、データをロードします（集合ハンズオンセミナーでは講師の指示に従ってください) クレデンシャル情報の登録 クレデンシャル情報の登録に必要な認証情報を手に入れる手順は、ADBにデータをロードしてみよう(Database Actions)の記事内のクラウド・ストレージからデータをロードしてみようを参照ください。 credential_name: DBに保存した認証情報を識別するための名前、任意 username: 上記で取得したOracle Object Storageにアクセスするための ユーザ名 password: 取得したAuth Token BEGIN DBMS_CLOUD.CREATE_CREDENTIAL( CREDENTIAL_NAME =&gt; 'USER_CRED', USERNAME =&gt; 'myUsername',...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb202-dataload-dbms-cloud/",
        "teaser": "/ocitutorials/adb/adb202-dataload-dbms-cloud/img2.png"
      },{
        "title": "203: 分析系クエリの実行(Star Schema Benchmark)",
        "excerpt":"はじめに この章ではAutonomous Databaseにおける分析系クエリの性能を確認します。 特に、インスタンスのOCPU数を増やした前後でのパフォーマンスを比較することで、簡単に性能が向上することをみていきます。 また、SQLの実行状況を確認するために、サービス・コンソールを操作いただきます。 目次 1. SSBスキーマを確認しよう データ・モデラーによる構成確認 各表の件数確認 2. OCPU数の違いによる処理時間の差を確認しよう OCPU=1の場合 OCPU=8の場合 3. 性能調査に使えるツールのご紹介 データベース・ダッシュボード パフォーマンス・ハブ 所要時間: 約40分 Star-Schema-Benchmark（SSB）とは？ ADBのインスタンスには、DWH系・分析系のサンプルスキーマとして以下が同梱されています。 Oracle Sales History（SHスキーマ） Star Schema Benchmark（SSBスキーマ） 上記のサンプルスキーマの特長 約1TB、約60億行のファクト表と、複数のディメンション表から構成 マニュアルには動作確認用のサンプルSQLも記載されている ADW、ATPの双方で利用可能（2022/10時点）- 本ガイドでは前の章で作成したAutonomous Transaction Processing(ATP) インスタンスの利用を前提に記載していますが、SSBのような分析系・DWH系のアプリケーションの場合、Autonomous Data Warehouse(ADW) をご選択いただくことを推奨しています。 ※サンプルスキーマの詳細についてはこちらを参照ください。 作業の流れ SSBスキーマを確認しよう OCPU数の違いによる処理時間の差を確認しよう サービスコンソール/SQL Monitorで処理内容を確認しよう 1. SSBスキーマを確認しよう データ・モデラーによる構成確認 ADBインスタンスを作成しようで学習したDatabase Actionsを利用したインスタンスへの接続...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb203-bulk-query/",
        "teaser": "/ocitutorials/adb/adb203-bulk-query/img0.png"
      },{
        "title": "204: 開発者向け仮想マシンのセットアップ方法",
        "excerpt":"はじめに 後続のチュートリアルで利用する開発環境をセットアップしましょう。 Oracle Cloud Infrastructure（OCI） では様々な仮想マシンイメージを提供しています。 本ページではその中から、開発者向けのLinux仮想マシンである Oracle Linux Cloud Developer イメージ をセットアップする手順を記載しています。 Oracle Linux Cloud Developer イメージは、Python、Node.js、Goといった言語や、Oracle Instant Clientなどの各種接続ドライバ、Oracle Cloud Infrastructure CLI(OCI CLI)といった各種ツールがプリインストールされており、アプリケーション開発は勿論、各種検証作業を実施する際にとても便利です。 尚、Oracle Linux Cloud Developer イメージの詳細については こちら を参照ください。 またOracle Cloud Infrastructureに仮想マシン作成する手順詳細に関しては本チュートリアル 入門編の その3 - インスタンスを作成する の手順も併せてご確認ください。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 ADBインスタンスのクレデンシャル・ウォレットがダウンロード済みであること ※クレデンシャルウォレットのダウンロード方法については、104: ウォレットを利用してADBに接続してみよう の、1. クレデンシャル・ウォレットのダウンロード をご確認ください。 目次...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb204-setup-VM/",
        "teaser": "/ocitutorials/adb/adb204-setup-VM/image_top.png"
      },{
        "title": "205: オンライン・トランザクション系のアプリを実行してみよう(Swingbench)",
        "excerpt":"はじめに Oracle Exadataをベースに構成されるAutonomous Database(ADB)は、分析系の処理だけでなく、バッチ処理、OLTP（オンライン・トランザクション）処理といった様々なワークロードに対応可能です。 この章ではOracle Databaseのベンチマークツールとして利用されることの多いSwingbenchを利用し、OLTP処理をATPで動かしてみます。 併せて、データベースの負荷状況に応じて自動的にCPUをスケールさせる、自動スケーリング（Auto Scaling）の動作を確認します。 目次 1.Swingbenchをセットアップしよう Swingbenchをダウンロード、データ生成 生成されたスキーマ・オブジェクトの確認 2.Swingbenchを実行し、ECPUをスケールアップしてみよう ECPU=2 (自動スケーリング無効) ECPU=16 (自動スケーリング無効) ECPU=16 (自動スケーリング有効) 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間: 約1時間30分 1.Swingbenchをセットアップしよう Swingbenchをダウンロード、データ生成 まずはSwingbenchを仮想マシン上にダウンロードし、ベンチマーク・データをADBインスタンス内に生成しましょう。 OCIで仮想マシンを作成する場合は、こちらの204: 開発者向け仮想マシンのセットアップ方法を参考にしてください。 Terminalを起動し、仮想マシンにopcユーザでログイン後、oracleユーザに切り替えます。 ssh -i &lt;秘密鍵のパス&gt; opc@&lt;仮想マシンのIPアドレス&gt; sudo su - oracle 作業用ディレクトリを作成します。 mkdir -p labs/swingbench 作業用ディレクトリに移動します。 cd labs/swingbench Swingbenchをダウンロードします。wgetもしくはcurlコマンドをご利用ください。（数分程度かかります。） wget https://github.com/domgiles/swingbench-public/releases/download/production/swingbench25052023.zip...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb205-swingbench/",
        "teaser": "/ocitutorials/adb/adb205-swingbench/img0.jpg"
      },{
        "title": "206: Node.jsによるADB上でのアプリ開発",
        "excerpt":"Node.jsはサーバサイドでJavaScript言語を実行するオープンソースの実行環境です。 node-oracledbドライバを利用することで、Autonomous Databaseに簡単に接続できます。 尚、JavaScriptのコーディングやNode.js自体の使い方を説明するものではありません。 所要時間 : 約20分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 開発用の仮想マシンが構成済みであり、仮想マシンからADBインスタンスへのアクセスが可能であること 仮想マシンのoracleユーザのホームディレクトリ配下にlabsフォルダをアップロード済みであること labs.zip を手元のPCにダウンロード アップロード方法については こちら をご確認ください。 仮想マシン上に直接ダウンロードする場合は、次のコマンドを実行します。 wget https://oracle-japan.github.io/ocitutorials/adb/adb-data/labs.zip 目次 1. 事前準備 2. Node.js環境の確認 3. ADBに接続してみよう 4. ADB上のデータを操作してみよう 1. 事前準備 ネットワークセキュリティの設定変更 本章ではお手元のPCからインターネットを介して、Node.jsのアプリにポート3030で接続します（3030は変更可能）。 OCIではセキュリティ・リストと呼ばれる仮想ファイアウォールの役割を担うリソースがありますが、このセキュリティ・リストのデフォルトの設定では、こちらの接続は拒否されます。 ポート3030からの接続を可能にするには、事前に外部インターネットからこの接続を受け入れるためのイングレス・ルール(インバウンド・ルール)の設定、およびNode.jsが配置される仮想マシンのOSのFirewallの設定を行う必要があります。 ※ セキュリティ・リストに関する詳細な情報はこちら - イングレス・ルールの設定 メニューから ネットワーキング、仮想クラウド・ネットワーク を選択します。 作成済みの仮想クラウド・ネットワーク（ vcn01 ）を選択します。 （こちらの画面では、ADB_HOL_DEV_VCNとなっています） ※該当するVCNが表示されない場合は、適切なリージョンおよびコンパートメントが選択されていることをご確認ください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb206-appdev-nodejs/",
        "teaser": null
      },{
        "title": "207: PythonによるADB上でのアプリ開発",
        "excerpt":"Pythonとは、汎用のプログラミング言語である。コードがシンプルで扱いやすく設計されており、C言語などに比べて、さまざまなプログラムを分かりやすく、少ないコード行数で書けるといった特徴がある。（ウィキペディアより引用） PythonでAutonomous Databaseを利用する際には、cx_Oracleというモジュールを利用します。 尚、Python言語自体の使い方を説明するものではありません。 所要時間 : 約10分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 開発用の仮想マシンが構成済みであり、仮想マシンからADBインスタンスへのアクセスが可能であること 仮想マシンのoracleユーザのホームディレクトリ配下にlabsフォルダをアップロード済みであること labs.zip をダウンロード アップロード方法については こちら をご確認ください。 目次 1. ADBに接続してみよう 2. ADB上のデータを操作してみよう 1. ADBに接続してみよう まずPythonでADBに接続し、ADBのバージョンを確認してみます。 尚、事前にこちらを実施し、SQL*plusで接続できていることを前提に記載しています。 Tera Termを利用してopcユーザで仮想マシンにログインします。 oracleユーザにスイッチします。一旦rootユーザに切り替えてから、oracleユーザに切り替えます。 -- rootユーザにスイッチ sudo -s -- oracleユーザにスイッチ sudo su - oracle ADBへの接続情報をOS環境変数として設定します。 export TNS_ADMIN=/home/oracle/labs/wallets export ORAUSER=admin export ORAPASS=Welcome12345# export...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb207-appdev-python/",
        "teaser": null
      },{
        "title": "208: Oracle Machine Learningで機械学習をしよう",
        "excerpt":"はじめに この章ではOracle Machine Learning(OML)の製品群の1つである、OML Notebookを利用して、DB内でデータの移動が完結した機械学習を体験して頂きます。 事前に前提条件にリンクされているサンプルデータのCSVファイルをお手元のPC上にダウンロードください。 （集合ハンズオンセミナーでは講師の指示に従ってください） 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 以下にリンクされているファイルをダウンロードしていること liquid.csv order_items.csv 目次 準備編 OML用のユーザを作成する データセットをADBにロードする liquid.csvをDatabase Actionsからロード order_items.csvをObject Storageにアップロード 機械学習編 OML Notebookを使い始める 機械学習モデルをビルド・評価する 所要時間: 約40分 準備編 OML用のユーザを作成する Database Actionsから、MLユーザを作成していきましょう。 ADMINユーザーでDatabase Actionsにサインインできていることが確認できたら、管理からデータベース・ユーザーをクリックします。 以下のように設定してユーザーの作成をクリックし、機械学習用のユーザを作成します。 ユーザー名：OMLUSER パスワード：例：Welcome12345# 表領域の割り当て制限：UNLIMITED OML、WebアクセスのトグルをON ユーザーが作成されました。 Database Actionからサインアウトします。 作成済のOMLUSERユーザーでサインインして下さい。 データセットをADBにロードする liquid.csvをDatabase Actionsからロード Database Actionsの起動パッドのData Stusioから、データ・ロード を選択します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb208-oml-notebook/",
        "teaser": "/ocitutorials/adb/adb208-oml-notebook/img20.png"
      },{
        "title": "209 : Database Vaultによる職務分掌に基づいたアクセス制御の実装",
        "excerpt":"はじめに Autonomous Databaseの特権ユーザであるADMINユーザはデータベースの管理だけでなくデータベースの全データを参照することができます。しかし、セキュリティ面でそれを許可したくない場合もあります。 Oracle Database Vaultは職務分掌と最小権限の原則を実施し、アクセスポリシーを作成する専用ユーザとアカウント管理専用ユーザを設け、特権ユーザからそれらの管理権限を分離します。 それにより、特権ユーザであってもアクセスポリシーの操作やアカウント管理操作ができず、許可された場合のみしか別アカウントのデータへのアクセスができなくなります。 Oracle Database Vaultの詳細については、Oracle Database Vaultホームページやドキュメントをご覧ください。 本文書では、Autonomous DatabaseでOracle Database Vaultを有効化し、特権ユーザであるADMINユーザが他のユーザのデータにアクセスできないように設定をしてみます。 目次 : 1.テスト用の表を作成 2.Oracle Database Vaultの有効化 3.特権ユーザーの権限はく奪 4.アクセス制御の設定 5.動作確認 6.Oracle Database Vaultの無効化 前提条件 : テスト用の表を作成するスキーマは任意のスキーマでも構いませんが、ここでは、「101:ADBインスタンスを作成してみよう」 で作成したユーザADBUSERを利用しています。 SQLコマンドを実行するユーザインタフェースは、接続の切り替えが容易なので、SQL*Plusを利用しています。Databasee Actionsでも実行可能ですが、ユーザでの接続をログインに読み替え、ログインしなおす必要があります。なお、 SQL*Plusの環境は、「204:マーケットプレイスからの仮想マシンのセットアップ方法」で作成できます。 チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、各ユーザのパスワードはすべて「Welcome12345#」とします。 使用パッケージの引数についての説明は記載していません。詳細はドキュメント『Oracle Database Vault管理者ガイド』（リンクは19c版です）をご参照くださいますようお願いいたします。 所要時間 : 約20分 1.テスト用の表を作成 サンプルスキーマのSSBスキーマのSUPPLIER表の一部を利用して、「101:ADBインスタンスを作成してみよう」 で作成したADBUSERスキーマにテスト用の表を作成します。 SQL*Plusを起動して以下を実行してください。 -- ADBUSERで接続する CONNECT...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb209-DV/",
        "teaser": "/ocitutorials/adb/adb209-DV/DatabaseVault.png"
      },{
        "title": "210 : 仮想プライベートデータベース(VPD:Virtual Private Database)による柔軟で細やかなアクセス制御の実装",
        "excerpt":"はじめに Oracle DatabaseのEnterprise Editionでは、表単位より細やかな行や列単位でのアクセス制御をおこなうために、仮想プライベートデータベース(VPD：Virtual Private Database)というソリューションを提供しています。 たとえばひとつの表に複数のユーザーのデータがまとめて入っているような場合でも、それぞれのユーザーが表に全件検索を実施した時に自分のデータしか結果としてもどらないようにすることが可能です。 では、どのような仕組みでそれを実現しているのでしょうか。 実は、内部でSQLに対して自動的に動的な条件を付加しています。イメージで示してみましょう。 部門(Group)が経理部(FIN)の人と営業部(SALES)の人が同じ人事データの表（HR_DETAIL表）に対して同じSQLで検索を行います。しかし、データベース内部では、そのSQLに自動的にユーザーの属性にあわせた条件(Where句(赤字))を付加して実行しています。その結果、それぞれの所属部門に適した異なる結果が表示されるというわけです。 VPDはAutonomous Databaseでも利用できる機能です。基本的な設定、動作を試してみましょう。　　 目次 : 1.テスト用の表を作成 2.ユーザーを作成 3.VPDファンクションの作成 4.VPDファンクションをVPDポリシーとして適用 5.動作確認 6.VPDポリシーの削除 前提条件 : テスト用の表を作成するスキーマは任意のスキーマでも構いませんが、ここでは、「101:ADBインスタンスを作成してみよう」 で作成したユーザADBUSERを利用しています。 SQLコマンドを実行するユーザインタフェースは、接続の切り替えが容易なので、SQL*Plusを利用しています。Database Actionsでも実行可能ですが、ユーザでの接続をログインに読み替え、ログインしなおす必要があります。なお、 SQL*Plusの環境は、「204:マーケットプレイスからの仮想マシンのセットアップ方法」で作成できます。 チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、各ユーザのパスワードはすべて「Welcome12345#」とします。 使用パッケージの引数についての説明は記載していません。詳細はドキュメント『PL/SQLパッケージ及びタイプ・リファレンス』（リンクは19c版です）をご参照くださいますようお願いいたします。 所要時間 : 約20分 1. テスト用の表を作成 サンプルスキーマのSSBスキーマのCUSTOMER表の一部を利用して、「101:ADBインスタンスを作成してみよう」 で作成したADBUSERスキーマにテスト用の表を作成します。 SQL*Plusを起動して以下を実行してください。 -- ADBUSERで接続する CONNECT adbuser/Welcome12345#@atp01_low -- SSB.CUSTEOMER表から新しくVPD_CUSTOMER表を作成する CREATE TABLE adbuser.vpd_customer AS SELECT *...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb210-VPD/",
        "teaser": "/ocitutorials/adb/adb210-vpd/vpd.png"
      },{
        "title": "211: クローン機能を活用しよう",
        "excerpt":"はじめに Autonomous Databaseのクローン機能を利用することにより、テスト/検証/分析用途の環境を素早く簡単に作成することができます。 ソース・データベースはオンライン、オフラインのどちらでも構わず、作成するクローンのタイプは次の3種類からの選択が可能です。 クローンのタイプ 説明 フル・クローン ソース・データベースのメタデータとデータを含むデータベース全体のクローンを作成します。 メタデータ・クローン ソース・データベースの表や索引などのスキーマ定義やオブジェクト構成情報といったメタデータのみのクローンを作成します。データは含みません。 リフレッシュ可能クローン クローン作成後もソース・データベースの変更をリフレッシュで反映することができる更新可能なデータベース全体のクローンを作成します。（クローン作成後または前回のリフレッシュから1週間以内のリフレッシュが必要） また、クローンは、サブスクライブしている任意のリージョンの任意のコンパートメント内に作成でき、ソースデータベースと異なるネットワーク（VCN・サブネット）に配置できます。バージョン・コア数・ストレージ容量などを含むスペックなどの変更も可能です。 本チュートリアルでは、フル・クローンのタイプでクローンを作成します。 所要時間 : 約20分 前提条件 : 以下のチュートリアルが完了していること 101:ADBインスタンスを作成してみよう で、ADBインスタンスが構成済みであること 102:ADBにデータをロードしよう(Database Actions) でADMINユーザーでSALES_CHANNELS表が作成されていること チュートリアルの便宜上インスタンス名はatp01とします。 SQLコマンドを実行するユーザー・インタフェースは、Database Actionsを使用します。 目次： 1. クローン環境を作成してみよう 2. クローン環境を確認してみよう 1. クローン環境を作成してみよう ソース・データベースのインスタンス詳細画面から 「クローンを作成」 をクリックします。 クローンの作成画面が表示されますので、下記を参考に設定していきます。 クローン・タイプの選択 今回はフル・クローンを選択します。ソース・データベースのメタデータとデータが複製されます。 ソースのクローニング フル・クローンまたはメタデータ・クローンの場合、クローンのソースを選択するオプションがあります。 データベースインスタンスからのクローニング : 実行中のデータベースのクローンが作成されます。 バックアップからのクローニング : バックアップリストからバックアップを指定してクローン、もしくは、過去の特定時点を指定してクローンします。 今回はデータベース・インスタンスからのクローニングを選択し、実行中のデータベースのクローンを作成します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb211-clone/",
        "teaser": null
      },{
        "title": "212: Autonomous Database を災害対策構成にしてみよう",
        "excerpt":"はじめに Autonomous Database ではReal Application Clusters(RAC)やAutomatic Storage Management(ASM)などの高可用性技術が事前構成済みです。そのため、単一のDBサーバー障害やストレージ障害については、RTO/RPOがほぼ0(SLO: サービスレベル目標)で復旧させることが可能です。 それらに加え、有償オプションとして、大きく2種類の災害対策ソリューションが提供されています。 それがAutonomous Data Guardとバックアップベースのディザスタ・リカバリです。Autonomous Data Guard は、本番環境用インスタンス(プライマリ・インスタンス)のスタンバイ・データベースを構成する事ができます。これによって、Autonomous Database インスタンスにデータ保護およびディザスタ・リカバリを実現可能です。Autonomous Data Guard が有効になっている場合、全ノード障害やリージョン障害などの大規模障害の際に、フェイルオーバーやスイッチオーバーが可能なスタンバイ・データベースを提供します。なおAutonomous Data Guard のスタンバイ・データベースへはデータ操作や接続ができません。 バックアップベースのディザスタ・リカバリは、デフォルトで取得されている自動バックアップのコピーを、本番環境用インスタンスのリージョンと異なるリージョンに保管しておくことができます。こちらもAutonomous Data Guard と同様、リージョン障害時に別のリージョンで本番環境と同等の環境をバックアップから構成することで、ディザスタ・リカバリを実現可能です。 目次 はじめに 1. Autonomous Data Guard 1-1. ローカルAutonomous Data Guard の有効化 1-2. Autonomous Data Guard のスイッチオーバー 1-3. クロスリージョンAutonomous Data Guard 1-4. Autonomous...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb212-audg/",
        "teaser": "/ocitutorials/adb/adb212-audg/img1.jpg"
      },{
        "title": "213 : Application Continuityを設定しよう",
        "excerpt":"はじめに Application ContinuityとはOracle Databaseの高可用性機能の一つであり、トランザクション実行中にエラーが発生した際に、そのエラーをアプリケーションに戻すことなく透過的にトランザクションを再実行する仕組みです。 Autonomous Database では接続サービス毎にApplication Continuity(AC)、もしくはTransparent Application Continuity(TAC)を有効化することができます。 クライアント側がAC/TACに対応していれば、障害発生時にクライアントとサーバーが独自にやり取りをしてCommit済みのトランザクションかどうかを判断し、もしCommitが完了していなければ自動的に再実行します。 尚、AC/TACに関する技術詳細は「こちら」をご参照ください。更新処理の途中で異常終了してしまったら何が起こるのか？と言った動作の詳細から対応可能なエラー、または対応するクライアントの種類やアプリケーションの実装方式について詳細に解説しています。 それでは、Autonomous DatabaseにおけるApplication Continuityの設定方法と具体的にエラーを発生させながらその動作について見ていきましょう。 尚、本チュートリアルで利用するSQL*PlusはAC/TACに対応しているクライアントの一つです。 本来であればRAC構成としてインスタンス障害やメンテナンスによる瞬断を想定したいところですが、ADBにおいてはそのような操作・設定はできないため、本チュートリアルでは接続中のセッションに対してAlter system kill session コマンドにて擬似的に障害を発生させ、動作確認を行います。 目次 : 1.事前準備 2.デフォルトの状態での動作確認 3.Application Continuityの有効化 4.有効化した状態での動作確認 5.Application Continuityの無効化 前提条件 : 「101:ADBインスタンスを作成してみよう」 を参考に、ADBインスタンス、およびADBUSERが作成済みであること SQLコマンドを実行するユーザインタフェースは、接続の切り替えが容易なので、SQL*Plusを利用しています。Database Actionsでも実行可能ですが、ユーザでの接続をログインに読み替え、ログインしなおす必要があります。なお、 SQL*Plusの環境は、「204:マーケットプレイスからの仮想マシンのセットアップ方法」で作成できます。 チュートリアルの便宜上、インスタンス名は「atp01」、各ユーザのパスワードはすべて「Welcome12345#」とします。 所要時間 : 約30分 1. 事前準備 動作確認のためTeraterm等の端末を2つ用意してください。それぞれADBUSERおよびADMINで作業します。 まず端末1でADBUSERにログインし、動作確認用の表を一つ作成しておきます。 sqlplus adbuser/Welcome12345##@atp01_tp --テスト表を削除（初回はエラーになります） drop table...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb213-tac/",
        "teaser": "/ocitutorials/adb/adb213-tac/tac001.png"
      },{
        "title": "214 : Spatial Studio で地理情報を扱おう",
        "excerpt":"はじめに Oracle Spatial Studio (Spatial Studioとも呼ばれます)は、Oracle Database のSpatial機能によって保存および管理されている地理空間データに対して接続、視覚化、調査および分析を行うためのフリー・ツールです。Spatial Studioは従来、Spatial and Graphとして有償オプションでしたが、現在はOracle Databaseの標準機能として追加費用なくご利用いただけます。 本記事では Spatial機能を用いた地理空間データの活用の方法をご紹介します。 目次 : 1. Oracle Spatial Studioのクラウド上での構築 2. 地理空間データを含むCSV形式ファイルのデータベースへのロード 3. 政府統計データのダウンロードとロード 4. Spatial Studioを用いた分析 おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約80分 1. Oracle Spatial Studioのクラウド上での構築 まず、Spatial Studioのメタデータを格納するリポジトリとなるデータベース・スキーマを作成します。これは、データセット、分析、プロジェクトの定義など、Spatial Studioで行う作業を格納するスキーマです。 1-1. リポジトリ用にスキーマを作成する OCIコンソールからDatabase ActionsでADMINユーザーとしてSpatial Studioリポジトリに使用するADBに接続します。 以下のコマンドでリポジトリ・スキーマを作成します。スキーマには任意の名前を付けることができます。ここではstudio_repoという名前で作成します。後の手順で使用するため、設定したパスワードをメモしておきます。 CREATE...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb214-spatial-studio/",
        "teaser": "/ocitutorials/adb/adb214-spatial-studio/tokyo_boundary_image.jpg"
      },{
        "title": "215 : Graph Studioで金融取引の分析を行う",
        "excerpt":"はじめに この記事は“Graph Studio: Find Circular Payment Chains with Graph Queries in Autonomous Database” の記事と補足事項を日本語で解説した内容になります。 Graph Studioとは Autonomous Databaseには、2021年の5月ごろより、プロパティグラフを取り扱うことのできるGraph Studioが標準機能として搭載されました。 Graph Studioでは下記のような機能を利用可能です。 データベースに存在するグラフをメモリに読み込んで分析 リレーショナル表からグラフのモデルを作成するための自動変換 SQLのようにクエリができるPGQLでの分析アルゴリズム グラフの可視化機能 上記のような機能がGraph Studioには搭載されているため、簡単にクラウドのUI上で完結する形でプロパティグラフの作成や分析が可能になっています。 この記事で確認できること CSVファイルのデータをAutonomous Databaseにアップロードする方法(SQL Developer Web (Database Actions SQL)) Graph Studioへの接続方法 PGQLクエリ(グラフクエリ言語)を用いたグラフ作成方法 PGQLクエリを使ったノートブック上でグラフをクエリ&amp;可視化方法 具体的な題材として、今回は金融トランザクションから、循環的な資金の流れを見つける分析を行います。 リレーショナル表からプロパティグラフへのデータの変換では、変換をほぼ自動で行ってくれる Graph Studio の機能を活用します。 目次 : 1.Graph Studio用のユーザーを作成 2.データの準備(取込み) 3.データの準備(整形)...","categories": [],
        "tags": ["graph","PGQL","oraclecloud","autonomous_database"],
        "url": "/ocitutorials/adb/adb215-graph/",
        "teaser": null
      },{
        "title": "216 : SQL Performance Analyzer(SPA)によるパッチ適用のテストソリューション",
        "excerpt":"はじめに Autonomous Database(ADB)は、事前定義されたメンテナンス・ウィンドウの中でデータベースに自動的にパッチを適用します。ADBではこのパッチ適用によって性能劣化が生じない仕組みが実装されています。 それでもアプリケーションの性能劣化に不安がある場合に利用できるのが、先行してパッチを適用できる早期パッチという機能です。パッチは毎週もしくは隔週で一斉に当てられますが、この早期パッチでは通常より1週早く同じパッチが当てられます。テスト環境用ADBを早期パッチで作成しておくことで、本番環境適用前にパッチ適用の影響テストを行うことができます。 また、ADBでは、Oracle Databaseオプション「Real Application Testing(RAT)」に含まれる機能の1つであるSQL Performance Analyzer(SPA)を使用することができます。 SPAを利用すると、システム変更前後のSQLワークロードの実行統計を比較して変更の影響を測定することができます。詳細はこちらをご覧ください。 Real Application Testing 参考資料 マニュアル：SQL Performance Analyzer 本記事では、early patchとSPAを併用することで、本番環境へのパッチ適用の影響をテスト環境で事前に確認する手順をご紹介します。 目次 : 1.環境の準備 2.SQLチューニングセット(STS)の作成 3.テスト環境用ADBのクローニング 4.STSの分析、レポートの作成 5.パッチ適用の事前通知（参考） 6.クリーンアップ（参考） 7.おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約60分 1. 環境の準備 1-1. 本番環境用ADBの作成 まずは本番環境用ADBであるATPprodを作成します。ADBの構成は以下になります。なお、本記事ではADBをはじめとする各リソースは全てAshburnリージョンで作成します。(Tokyo/Osakaリージョンでも実施可能です) ワークロード・タイプ：トランザクション処理 デプロイメント・タイプ：サーバーレス ECPU数：2 ストレージ(TB)：1 ネットワーク・アクセスの選択：すべての場所からのセキュア・アクセス 1-2. テスト用スキーマMYSHの作成 ADMINユーザーでATPprodに接続し、次のSQLを実行しサンプルスキーマMYSHを作成します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb216-patch-spa/",
        "teaser": "/ocitutorials/adb/adb216-patch-spa/teaser.png"
      },{
        "title": "217: Database Actions を使ってみよう",
        "excerpt":"はじめに この章はまずAutonomous Database(ADB) のツールである Database Actions の機能の中から、データ分析、データ・インサイト、カタログの機能を確認します。 Database Actions を使う前に、セキュリティを高めるため、実務と同じように、データベース管理者とは別の新しいユーザー（スキーマ）を作り、そのユーザーから Database Actions を使います。 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 以下にリンクされている売上実績サンプルデータのファイルをダウンロードしていること Days_Months.xlsx + Devices.xlsx + Countries.csv Movie_Sales_2020.csv 目次 1. 分析用のデータベース・ユーザーを作成しよう 2. ワークショップで使うデータを準備しよう 3. Database Actionsで操作してみよう 3-1. データ分析してみよう 3-2. データインサイトを生成しよう 3-3. カタログを使ってみよう 所要時間 : 約50分 1. 分析用のデータベース・ユーザーを作成しよう(Database Actions) ADBインスタンスを作成すると、デフォルトでADMINユーザが作成されていますが、Database Actions を操作するデータベース・ユーザーを作成します。 ここではADBにおけるデータベース・ユーザーの作成してみます。 Database Actionsの起動パッドで...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb217-use-database-actions/",
        "teaser": "/ocitutorials/adb/adb217-use-database-actions/img0_0.png"
      },{
        "title": "218 : リフレッシュ可能クローンを活用しよう",
        "excerpt":"Autonomous Databaseのリフレッシュ可能クローンを利用すると、本番環境のデータを用いてリフレッシュすることができる、更新可能なテスト/検証/分析用途の環境を簡単に作成することができます。 本章では、リフレッシュ可能クローンの作成方法と動作について確認します。 所要時間 : 約30分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本チュートリアルの 101:ADBインスタンスを作成してみよう を参照ください。 構成済みのADBインスタンスへの接続が可能であること 目次： 1. ADBにおけるリフレッシュ可能クローンの概要 2. 事前準備 3. リフレッシュ可能クローンを作成してみよう 4. 作成したリフレッシュ可能クローンを確認してみよう 5. リフレッシュ可能クローンのリフレッシュ動作を確認してみよう 6. リフレッシュ可能クローンをソース・データベースから切断してみよう 7. リフレッシュ可能クローンをソース・データベースに再接続してみよう 1. ADBにおけるリフレッシュ可能クローンの概要 ADBのリフレッシュ可能クローンは、コンソールまたはAPIを使用して作成することができます。 リフレッシュ可能クローンを使用することで、リフレッシュ操作によってソース・データベースの変更内容を反映することが可能なADBのクローンを作成できます。 ADBのリフレッシュ可能クローンは以下のような特徴があります。 実行中のAutonomous Databaseから作成可能（バックアップからの作成は不可） ソースとなるAutonomous Databaseと異なるコンパートメントに作成可能 ソースとなるAutonomous Databaseに接続している間は読み取り専用データベースとして利用可能 コンソールまたはAPIを使用したリフレッシュ操作により、ソース・データベースの変更内容を反映可能 リフレッシュ中は利用不可（ソース・データベースはリフレッシュ中も利用可能） リフレッシュ可能期間は、クローン作成後または前回のリフレッシュから1週間以内 1週間以上リフレッシュしなかった場合はリフレッシュできなくなる リフレッシュ可能期間を超えた場合は、そのまま読み取り専用DBとして利用するかソース・データベースから切断して通常の読み取り/書き込み可能なDBとして利用する ソースとなるAutonomous Databaseから一時的に切断し、再接続することが可能 切断後は読み取り/書き込み可能 再接続操作は切断後24時間以内のみ可能 再接続すると切断中のクローンに対する更新内容は破棄される 再接続後は切断前と同様に、リフレッシュ操作によりソース・データベースの変更内容を反映可能...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb218-refreshable-clone/",
        "teaser": "/ocitutorials/adb/adb218-refreshable-clone/teaser.png"
      },{
        "title": "219: Automatic Indexingを体験してみよう ",
        "excerpt":"はじめに 索引を手動で作成するには、データモデル、アプリケーションの動作、データベース内のデータの特性などに関する専門的な知識が必要です。 以前は、DBAがどの索引を作成するかの選択を担当しており、修正や保守を行っていました。しかし、データベースが変更されても保守しきれないこともあり、不要な索引を使用することが性能上の障害となる可能性がありました。 Autonomous Databaseではワークロードを監視して、自動的に索引の作成や削除などの管理を行う機能であるAutomatic Indexingが利用できます。 本記事では、ATPを作成したのちAutomatic Indexingを利用してみます。 前提条件： ATPインスタンスが構成済みであること ※ATPンタンスの作成方法については、ADBインスタンスを作成してみよう を参照してください。 ワークロード・タイプ： トランザクション処理 ECPU数： 4 ストレージ： 1024 CPU Auto Scaling： 無効 それ以外の項目については、ご自身の環境や目的に合わせて選択してください。 目次： 1. スキーマ作成とAutomatic Indexingの有効化 2. ワークロードの実行 3. 自動索引のレポートを確認する 4. 自動索引の削除とAutomatic Indexingの無効化 おわりに 所要時間 : 約1時間 1. スキーマ作成とAutomatic Indexingの有効化 ここではテストスキーマを作成し、自動索引を有効化します。 1-1. SQL*PlusでADBに接続する SQL＊Plusを使った接続を参考に、TeraTerm上でSQL＊Plusを用いて、ATPインスタンスに接続してください。 接続する際のスキーマ名はADMINとしてください。 ここで、以前本チュートリアルを実施したことがある場合は、本章の4-1の手順2自動索引の削除を行ってください。初めて行う場合は、次のステップに進んでください。 1-2. 索引作成の対象になる表の作成と登録 （本チュートリアルを初めて実施する場合は、次のステップに進んでください。)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb219-autoindexing/",
        "teaser": "/ocitutorials/adb/adb219-autoindexing/adb219_3.png"
      },{
        "title": "220 : 自動ワークロード・リプレイによるパッチ適用のテストソリューション",
        "excerpt":"はじめに Autonomous Database(ADB)は、毎週末事前定義されたメンテナンス・ウィンドウの中でデータベースに自動的にパッチを適用します。 通常のパッチ周期に先行して1週早くパッチを適用できる早期パッチという機能があります。テスト環境用ADBを早期パッチで作成しておくことで、本番環境適用前にパッチ適用の影響テストを行うことができます。 また、ADBでは、Oracle Databaseオプション「Real Application Testing(RAT)」に含まれる機能の1つであるDatabase Replay(DB Replay)を使用することができます。 さらにDB Replayを自動で毎週行う自動ワークロード・リプレイという機能があります。こちらを使用すると、毎週決まった時間に本番環境のワークロードをキャプチャして、早期パッチを適用したテスト環境にそのワークロードをリプレイすることができます。 こちらでパッチの影響を確認し、もしエラーが発生した場合はOracle社にサポート・リクエストを発行し報告することで、Oracle社が該当パッチを修正もしくは通常パッチでは適用しないなどの対応を行います。 こちらが早期パッチと自動ワークロード・リプレイを利用したテストフローになります。 本チュートリアルでは、早期パッチと自動ワークロード・リプレイを併用することで、本番環境へのパッチ適用の影響をテスト環境で事前に確認する手順をご紹介します。 目次 : はじめに 1. 環境の準備 2. 本番環境で使用するデータの準備 3. テスト環境用ADBの作成 4. 自動ワークロード・リプレイの有効化 5. イベント通知の設定 6. 本番環境へのワークロードの実行 7. レポートの確認 おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 開発者向けの仮想マシンが構成済みであること ※作成方法については、 204: 開発者向け仮想マシンのセットアップ方法 を参照ください。 作成した仮想マシンからADBへSQL*Plusで接続ができること ※接続方法については、 104: クレデンシャル・ウォレットを利用して接続してみよう を参照ください。 所要時間 :...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb220-autoworkload-replay/",
        "teaser": "/ocitutorials/adb/adb220-autoworkload-replay/teaser.png"
      },{
        "title": "221 : 自動パーティション化（Automatic Partitioning）を使ってみよう",
        "excerpt":"はじめに 自動パーティション化は、Autonomous Databaseで提供されている自動的に表や索引をパーティション化することができる機能です。 APIとしてDBMS_AUTO_PARTITIONパッケージが提供されており、3つの運用フェーズを手動で実行します。 本チュートリアルでは、非パーティション表を作成し、それを対象に自動パーティション化を実行します。 前提条件 : バージョンが19cのAutonomous Databaseインスタンスが構成済みであること ADBインタンスの作成方法については、「101:ADBインスタンスを作成してみよう」 を参照ください。 Always FreeまたはDeveloper ADBインスタンスを利用すること 自動パーティション化の対象は表のサイズがAlways Free/DeveloperADBインスタンスでは5GB以上、商用ADBインスタンスでは64GB以上である必要があります。商用ADBインスタンスの場合は5GBを64GBに置き換えてください。 SQLコマンドを実行するユーザー・インタフェースはSQL*Plusを利用すること 環境は、「204:開発者向け仮想マシンのセットアップ方法」 で作成できます。また、ADBへの接続方法は 「104: クレデンシャル・ウォレットを利用して接続してみよう」 を参照ください。 ユーザーはADMINユーザーで実行すること Autonomous Databaseへの接続文字列は「atpdev01_medium」、各ユーザのパスワードはすべて「Welcome12345#」とします。 所要時間 : 約30分（Developerインスタンスの場合） 1. 環境の準備 まず、本チュートリアルで使用するAlways FreeインスタンスまたはDeveloperインスタンスを作成します。構成は以下のとおりです。 表示名 : ATPDEV01 データベース名 : ATPDEV01 ワークロード・タイプ : トランザクション処理 デプロイメント・タイプ : サーバーレス Always Freeの構成オプションのみを表示また開発者のどちらか：オン データベース・バージョンの選択 : 19c 管理者資格証明の作成...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb221-autopartitioning/",
        "teaser": "/ocitutorials/adb/adb221-autopartitioning/partitioningadvantage.png"
      },{
        "title": "301 : 移行元となるデータベースを作成しよう",
        "excerpt":"はじめに 既存Oracle DatabaseをAutonomous Databaseに移行するにはどうすれば良いでしょうか？ 従来からよく利用されるData Pumpを始め、Autonomous Databaseではいくつかの移行方法が用意されており、このチュートリアルでは移行編としてそれらの方法をご紹介しています。 Autonomous Database を使ってみよう（移行編） 301: 移行元となるデータベースを作成しよう（本章） 302: スキーマ・アドバイザを活用しよう 303: Data Pumpを利用してデータを移行しよう 304: ZDM/DMSを利用し、ダウンタイムを最小限に移行しよう 305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行 306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行 本章（301）では後続の章の準備作業として、移行元となる既存オンプレミスのOracle Databaseを想定しBaseDBインスタンスを作成します。 目次 : 1.移行元となるBaseDBインスタンスの作成 2.移行対象となるサンプルスキーマ(HR)をインストール 3.サンプルスキーマ(HR)への接続、スキーマの確認 所要時間 : 約150分 (BaseDBインスタンスの作成時間を含む) 1. 移行元となるBaseDBインスタンスの作成 まず、「Oracle Cloud で Oracle Database を使おう(BaseDB)」...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb301-create-source-db/",
        "teaser": "/ocitutorials/adb/adb301-create-source-db/img103.png"
      },{
        "title": "302 : Cloud Premigration Advisor Tool(CPAT)を活用しよう",
        "excerpt":"はじめに Autonomous Databaseでは性能・可用性・セキュリティの観点から特定のデータベースオブジェクトの作成が制限されています。 具体的な制限事項はマニュアルに記載がございますが、これら制限対象のオブジェクトを利用しているかなどを確認するために、オラクルはCloud Premigration Advisor Tool(CPAT)というツールを提供しています。 この章では先の301: 移行元となるデータベースを作成しようにて事前に作成しておいたDBCSインスタンスを利用して、CPATの使い方を紹介します。 目次 : 1.Cloud Premigration Advisor Tool(CPAT)とは？ 2.事前準備 2-1.CPATを実行するホストの準備 2-2.ツールのダウンロード 2-3.環境変数の設定 3.実行と結果確認 前提条件 : My Oracle Supportへのログイン・アカウントを保有していること 301: 移行元となるデータベースを作成しようを完了していること 所要時間 : 約30分 1. Cloud Premigraiton Advisor Tool (CPAT) とは？ Oracle DatabaseインスタンスをOracleクラウドに移行する際に、問題になる可能性があるコンテンツや移行を妨げる可能性があるその他の要因をチェックするJavaベースのツールです。移行チェックのツールとして以前提供されていたスキーマ・アドバイザの後継となります。 スキーマ・アドバイザはデータベースにPL/SQLパッケージのインストールが必要でしたが、CPATは読み取り専用でデータベースに対して変更を与えることはありません。 サポート対象となるOracle Databaseのバージョンは11.2.0.4以降です（2024/7時点）。 また、現時点では物理移行のチェックはサポートされておらず、デフォルトでDataPumpによる移行が想定されています。 2. 事前準備 2-1. CPATを実行するホストの準備 ソース、ターゲットにネットワーク接続できるホストを準備します。CPATはWindowsプラットフォーム、Unixプラットフォームのどちらでも実行することができますが、Javaベースのツールとなるため、Java実行環境(JRE)が必要となります。最小バージョンはJava7です。 このチュートリアルでは作成済みのDBCSインスタンスをホストとして利用します。 2-2....","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb302-cpat/",
        "teaser": "/ocitutorials/adb/adb302-cpat/img102.png"
      },{
        "title": "303 : Data Pumpを利用してデータを移行しよう",
        "excerpt":"はじめに Oracle Databaseのデータ移行として、ここでは従来からよく利用されるData Pumpを利用してAutonomous Databaseに移行する手順をご紹介します。 先の「301 : 移行元となるデータベースを作成しよう」にて事前に作成しておいたBaseDBインスタンス上のHRスキーマを、以下の流れに沿ってAutonomous Databaseに移行してみたいと思います。 目次 : 1.移行対象のスキーマをエクスポート 2.オブジェクトストレージへのアクセストークンを取得 3.ダンプファイルをオブジェクトストレージにアップロード 4.Autonomous Databaseへのインポート 補足 チュートリアルを実施する上で、BaseDBインスタンスを用意できない場合や、どうしてもエクスポートが成功しないと言った場合は、以下よりエクスポート済みのダンプファイルを配置しておりますので、適宜ダウンロードください。 上記ステップ2から実施いただくことが可能です。 ダンプファイル(export_hr_01.dmp)のダウンロード ダンプファイル(export_hr_02.dmp)のダウンロード ダンプファイル(export_hr_03.dmp)のダウンロード ダンプファイル(export_hr_04.dmp)のダウンロード 前提条件 : 「204: マーケットプレイスからの仮想マシンのセットアップ方法」を完了していること 「301 : 移行元となるデータベースを作成しよう」を完了していること 所要時間 : 約30分 1. 移行対象のスキーマをエクスポート HRスキーマをData Pumpを利用してBaseDBインスタンスのOS上のファイルシステムにエクスポートします。 （補足） 本チュートリアルではOCI BaseDBにプリインストールされているData Pumpを利用しますが、12.2.0.1以前のOracle Clientを利用する場合や、その他詳細情報についてはマニュアル（ADW / ATP）を参照ください。 パラレルオプションを利用する場合、ソースDBがEnterprise Editionである必要があります。 圧縮オプションを利用する場合、ソースDBが11g以上でありAdvanced Compression Optionが必要になります。 1-1....","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb303-datapump/",
        "teaser": "/ocitutorials/adb/adb303-datapump/img101.png"
      },{
        "title": "304 : OCI Database Migration Serviceを使用したデータベース移行の前準備",
        "excerpt":"はじめに Oracle Cloud Infrastructure Database Migration Service (DMS) は、オンプレミスまたはOCI上のOracle DatabaseからOCI上のデータベースに移行する際に利用できるマネージド・サービスです。エンタープライズ向けの強力なオラクル・ツール(Zero Downtime Migration、GoldenGate、Data Pump)をベースとしています。 DMSでは下記の2つの論理的移行が可能です。 オフライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されます。移行中のソース・データベースへの変更はコピーされないため、移行中はアプリケーションをオフラインのままにする必要があります。 オンライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されるのに加え、内部的にOracle GoldenGateによるレプリケーションを利用しているため、移行中のソース・データベースへの変更も全てコピーされます。そのため、アプリケーションをオンラインのまま移行を行うことが可能で、移行に伴うアプリケーションのダウンタイムを極小化することができます。 DMSに関するチュートリアルは304 : OCI Database Migration Serviceを使用したデータベース移行の前準備、305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行、306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行の計3章を含めた3部構成となっています。 DMSを使用してBaseDBで作成したソース・データベースからADBのターゲット・データベースにデータ移行を行います。 305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行または306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行を実施する前に必ず304 :...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb304-database-migration-prep/",
        "teaser": "/ocitutorials/adb/adb304-database-migration-prep/teaser.png"
      },{
        "title": "305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行",
        "excerpt":"はじめに Oracle Cloud Infrastructure Database Migration Service (DMS) は、オンプレミスまたはOCI上のOracle DatabaseからAutonomous Databaseに移行する際に利用できるマネージド・サービスです。エンタープライズ向けの強力なオラクル・ツール(Zero Downtime Migration、GoldenGate、Data Pump)をベースとしています。 DMSでは下記の2つの論理的移行が可能です。 オフライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されます。移行中のソース・データベースへの変更はコピーされないため、移行中はアプリケーションをオフラインのままにする必要があります。 オンライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されるのに加え、内部的にOracle GoldenGateによるレプリケーションを利用しているため、移行中のソース・データベースへの変更も全てコピーされます。そのため、アプリケーションをオンラインのまま移行を行うことが可能で、移行に伴うアプリケーションのダウンタイムを極小化することができます。 DMSに関するチュートリアルは304 : OCI Database Migration Serviceを使用したデータベース移行の前準備、305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行、306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行の計3章を含めた3部構成となっています。 DMSを使用してBaseDBで作成したソース・データベースからADBのターゲット・データベースにデータ移行を行います。 305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行または306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行を実施する前に必ず304...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb305-database-migration-offline/",
        "teaser": "/ocitutorials/adb/adb305-database-migration-prep/teaser.png"
      },{
        "title": "306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行",
        "excerpt":"はじめに Oracle Cloud Infrastructure Database Migration Service (DMS) は、オンプレミスまたはOCI上のOracle DatabaseからAutonomous Databaseに移行する際に利用できるマネージド・サービスです。エンタープライズ向けの強力なオラクル・ツール(Zero Downtime Migration、GoldenGate、Data Pump)をベースとしています。 DMSでは下記の2つの論理的移行が可能です。 オフライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されます。移行中のソース・データベースへの変更はコピーされないため、移行中はアプリケーションをオフラインのままにする必要があります。 オンライン移行 - ソース・データベースのポイント・イン・タイム・コピーがターゲット・データベースに作成されるのに加え、内部的にOracle GoldenGateによるレプリケーションを利用しているため、移行中のソース・データベースへの変更も全てコピーされます。そのため、アプリケーションをオンラインのまま移行を行うことが可能で、移行に伴うアプリケーションのダウンタイムを極小化することができます。 DMSに関するチュートリアルは304 : OCI Database Migration Serviceを使用したデータベース移行の前準備、305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行、306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行の計3章を含めた3部構成となっています。 DMSを使用してBaseDBで作成したソース・データベースからADBのターゲット・データベースにデータ移行を行います。 305 : OCI Database Migration Serviceを使用したデータベースのオフライン移行または306 : OCI Database Migration Serviceを使用したデータベースのオンライン移行を実施する前に必ず304...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb306-database-migration-online/",
        "teaser": "/ocitutorials/adb/adb306-database-migration-prep/teaser.png"
      },{
        "title": "401 : OCI GoldenGateによるBaseDBからADBへのデータ連携",
        "excerpt":"はじめに Oracle Cloud Infrastructure (OCI) GoldenGateはフルマネージド型のリアルタイムデータ連携サービスとなっています。 OCI GoldenGateサービスは、構成、ワークロード・スケーリング、パッチ適用などの多くの機能を自動化しており、従量課金制で利用することが可能です。そのため時間や場所を選ばずに、低コストでデータの連携、分析ができるようになります。 この章では、OCI GoldenGateの作成とBaseDBからADBへのデータ連携の設定について紹介します。 目次 : 1.ソース・データベースの設定 2.ターゲット・データベースの設定 3.OCI GGデプロイメントの作成 4.データベースの登録 5.Extractの作成 6.チェックポイント表の作成 7.Replicatの作成 8.データ連携の確認 前提条件 : 本チュートリアルではBaseDB、ADBともにデータベースの作成が完了しており、初期データとしてHRスキーマがそれぞれのデータベースにロードされていることを前提にしています。 各データベースの作成方法やデータロードの方法は下記手順をご確認ください。 BaseDBの作成については、「101: Oracle Cloud で Oracle Database を使おう(BaseDB)」 をご参照ください。 データ連携用のサンプルデータはHRスキーマを使用しています。BaseDBでのHRスキーマ作成方法は、「301: 移行元となるデータベースを作成しよう」 をご参照ください。 ADBの作成については、「101:ADBインスタンスを作成してみよう」 をご参照ください。 ADBの初期データロードについては、「303 : Data Pumpを利用してデータを移行しよう」 をご参照ください。 チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、BaseDBを含めて各ユーザのパスワードはすべて「Welcome#1Welcome#1」とします。 所要時間 : 約60分 1. ソース・データベースの設定...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb401-oci-goldengate/",
        "teaser": "/ocitutorials/adb/adb401-oci-goldengate/instancetop.png"
      },{
        "title": "402 : Database Linkによる他のデータベースとのデータ連携",
        "excerpt":"はじめに 従来からOracle Databaseをご利用の方にはお馴染みのDatabase Linkですが、Autonomous Database でもこのDatabase Linkをお使いいただくことが可能です。 Database Linkは、他のOracle Database インスタンスからデータを移行・連携・収集するための便利な機能です。 Autonomous Database では以下の4つのパターンでDatabase Linkを作成いただくことができます。 本チュートリアルでは2のパターンであるAutonomous Database（リンク元）にDatabase Linkを作成し、他のOracle Database（リンク先）にアクセスする手順を記載します。 補足と言う形でパターン1、3、4については、3.その他のパターンにて記載しています。 本チュートリアルでは、リンク先である他のOracle Databaseとして、OCIのBase Database Serviceを使用します。手順としてはオンプレミスのOracle Databaseも同様になります。またパブリック・アクセスが可能なBaseDBと、プライベート・アクセスのみ可能なBaseDBへのDatabase Linkのそれぞれの手順を記載しています。 目次 : 1.パブリック・アクセス可能なOracle DatabaseへのDatabase Link 1-1.BaseDBにてTCPS認証（SSL認証）を有効化 1-2.BaseDBのウォレットファイルをADBに渡す 1-3.VCNのイングレス・ルールを更新 1-4.ADBにてDatabase Linkを作成 1-5.エラーへの対応例 2.プライベート・アクセスのみ可能なOracle DatabaseへのDatabase Link 3.その他のパターン 4.おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 BaseDBインスタンスを構成済み、かつサンプルスキーマをインストール済みであること ※手順については、 301...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb402-database-link/",
        "teaser": "/ocitutorials/adb/adb402-database-link/DatabaseLink_teaser.jpg"
      },{
        "title": "405 : ライブ・シェア によるデータ共有",
        "excerpt":"はじめに ライブ共有は、データベース・リンクに実装されているクラウド・リンクを介してデータを問い合せることによって機能します。 データベース・リンクを使用すると、外部マシンおよびスキーマ上のネットワークを介してオブジェクトを問い合せることができます。 このモードの利点は、問合せ時点のデータが最新であることです。 目次 : 1.データ共有へのアクセス 2.共有の作成 3.共有の消費 4.共有の確認 5.おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 ADBインスタンスがにデータ共有のユーザーが作成済みであること ※ADBインタンスにユーザー作成方法については、 101:ADBインスタンスを作成してみよう 3-2. データベース・ユーザーを作成してみよう を参照ください。 データ共有ツールを使うには、データベース・ユーザーに DWROLEロール が必要です。 所要時間 : 約10分 1. データ共有へのアクセスと有効化 データ共有ツールを使用してデータを共有または使用するには、Data Studioに移動し、データ共有ツールを起動して共有を有効にします。 1-1. データ共有へのアクセス Database Action 起動パッドで Data Studio &gt; データ共有 をクリックします。 1-2. 共有の提供 データ共有 で「共有の提供」をクリックします。 1-3. プロバイダ識別子の設定 共有の提供 で「プロバイダ識別子」クリックします。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb405-live-share/",
        "teaser": "/ocitutorials/adb/adb405-live-share/Liveshare_teaser.jpg"
      },{
        "title": "403 : Data Transformsを使ってみよう",
        "excerpt":"はじめに Data Transformsは、Autonomous Databaseに組み込まれているデータ統合ツールです。Database Actionsからアクセス可能で、異種のソースからAutonomous Databaseにデータをロードして変換するためのツールです。ドラッグアンドドロップ、ノーコードで簡単に操作できます。データウェアハウスの構築や分析アプリケーションへのデータ供給など、あらゆるデータ統合のニーズに対応できます。 Data TransformsはOracle Data Integratorをベースにしています。オンプレミスおよびOCIの両方で、多くのお客様において高性能なデータ統合アーキテクチャとして証明されている、ELT(Extract/Load/Transform)手法を使用しています。 本章ではAutonomous Databaseの付属ツールであるData Transformsを用いて、少ない労力でデータを変換する方法を紹介します。 所要時間 : 約60分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本チュートリアルの 101:ADBインスタンスを作成してみよう を参照ください。 構成済みのADBインスタンスへの接続が可能であること 下記リンクからダウンロードできるMovie Sales 2020.csv(売上実績のサンプルデータ)がローカルPC上にあること 217: クレデンシャル・ウォレットを利用して接続してみよう 目次： 1. 事前準備 2. Dara Transformsの起動 3. Data Transformsを使ってみる 4. おわりに 1. 事前準備 実際にData Transformsを使用する前に、起動したADBインスタンスから新しいユーザー(QTEAM)を作成し、本チュートリアルで使用するサンプルデータ(Movie Sales 2020.csv)をロードします。 次の手順に従って、QTEAMユーザーを作成します。すでに作っている場合は、ステップ2に進んでください。 下記のリンクを参考に、QTEAMユーザーを作成します。 分析用のデータベース・ユーザーを作成しよう(Database Actions) *ユーザーを作成の際に、付与されたロールから以下の2つのユーザーロールを、以下の画像のように有効にします。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb403-data-transforms/",
        "teaser": "/ocitutorials/adb/adb403-data-transforms/adb403_2_4.png"
      },{
        "title": "404 : クラウド・リンクによるデータ共有をしてみよう",
        "excerpt":"はじめに クラウド・リンクを活用すると、クラウドベースの方法でAutonomous Database間のデータ共有を行うことができます。 本機能は、Autonomous Database間のネットワーク的な接続を設定することなく、データを共有するスコープとしてリージョン、テナント、コンパートメント、特定のAutonomous Databaseを指定して、データの読み取り専用リモートアクセスを提供することができます。 本チュートリアルでは、同じテナント内にある2つのAutonomous Database間でのクラウド・リンクによるデータ共有を行います。 目次 : はじめに ユーザー作成と権限の付与 検証用の表の作成とクラウド・リンクへの表の登録 クラウド・リンクに登録されているデータセットの参照 異なるAutonomous Databaseからクラウド・リンクに登録されているデータセットを参照 注意点 おわりに 参考資料 前提条件 ADBインスタンスを2つ(例：atp01, atp02)構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約30分 1. ユーザー作成と権限の付与 SQL*Plusからadminユーザーとしてatp01に接続します。 sqlplus admin/Welcome12345#@atp01_low クラウド・リンクの登録ユーザーであるcloud_links_register_userを作成し、必要な権限を付与します。 CREATE USER cloud_links_register_user IDENTIFIED BY Welcome12345#; GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO cloud_links_register_user; GRANT EXECUTE ON...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb404-cloud-link/",
        "teaser": "/ocitutorials/adb/adb404-cloud-link/image1.png"
      },{
        "title": "501: OCICLIを利用したインスタンス操作",
        "excerpt":"ここまでの章で、ADBインスタンスの作成やECPU数の変更等、様々な操作を実施いただきましたが、これら一連の操作を自動化するにはどうしたら良いでしょうか？ ADBはOracle Cloud Infrastructure(OCI)の他のサービスと同様、REST APIを介した各種操作が可能であり、それらを呼び出すコマンド・ライン・インタフェース（OCI CLI）を利用した操作も可能です。 この章ではOCI CLIを利用してADBインスタンスの作成や起動・停止、およびスケールアップ、ダウンといった構成変更の方法について確認します。 これらコマンドを利用しスクリプトを組めば、例えば夜間はあまり使わないからECPUをスケールダウンさせておき、朝になったらスケールアップしよう。といった自動化が可能となります。 尚、本ガイドではOCI CLIがインストールされたOCI Developer Image を利用することを前提に記載しています。 OCI CLIのインストール方法を含め、OCI CLIの詳細についてはを参照ください。 所要時間 : 約30分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 ADBインスタンスに接続可能な仮想マシンを構成済みであること ※仮想マシンの作成方法については、本ハンズオンガイドの 204:マーケットプレイスからの仮想マシンのセットアップ方法 を参照ください。 目次： 1. OCI CLIをセットアップしよう 2. OCI CLIを使ってみよう 3. OCI CLIでインスタンスを操作しよう 1. OCI CLIをセットアップしよう まずはOCI CLIにクラウド環境の情報を登録します。 Tera Termを起動し、仮想マシンにログインします。 oracleユーザに切り替えます。 sudo su...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb501-ocicli/",
        "teaser": null
      },{
        "title": "502: 各種設定の確認、レポートの取得",
        "excerpt":"Autonomous Databaseは初期化パラメータを初め、多くの設定は変更することはできません。 （そもそも自律型DBとして、それらを気にする必要はない、というコンセプト） しかしながら、Oracle Databaseに詳しい方にとっては、これまでのOracle Databaseと何が違うのか？など、より詳細を知りたいと思われるかと思います。 この章ではそういった方々のために、初期化パラメータの確認やAWRレポート等の取得方法をご確認いただき、普段お使いのOracleデータベースと同様に扱えることを見ていただきます。 尚、Autonomous Databaseにおける制限事項については、次のマニュアルを参照ください。 経験豊富なOracle Databaseユーザー用のAutonomous Database (英語版) 経験豊富なOracle Databaseユーザー用のAutonomous Database (日本語版) ※最新の情報については英語版をご確認ください。 本章ではアラートログやトレースログの取得方法も扱いますが、ADBを利用するに際して何か問題が生じた場合は、弊社サポートサービスに対してサービスリクエスト（SR）の発行を優先ください。 SRの発行方法については、本チュートリアルガイドの 506: サポートサービスへの問い合わせ を参照ください。 所要時間 : 約30分 前提条件 : ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、本ハンズオンガイドの 101:ADBインスタンスを作成してみよう を参照ください。 ADBインスタンスに接続可能な仮想マシンを構成済みであること ※仮想マシンの作成方法については、本ハンズオンガイドの 204:マーケットプレイスからの仮想マシンのセットアップ方法 を参照ください。 初期化パラメータ・各種レポート・ログの取得方法は、次の目次に示す３つの方法があります： 目次： 1. コマンドライン(SQL*Plus)で確認しよう 1-1. 初期化パラメータの確認 1-2. AWRレポートの確認 1-3. アラート・ログの確認 1-4. トレース・ログの確認 2. SQL...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb502-report/",
        "teaser": null
      },{
        "title": "503 : ADBインスタンスの監視設定をしてみよう",
        "excerpt":"はじめに Autonomous Databaseはデータベースの様々な管理タスクをADB自身、もしくはOracleが行う自律型データベースですが、ユーザーが実行したり、ユーザーがOracleに実行の方法やタイミングの指示を出すタスクもあります。それがデータベースのパフォーマンス監視/アラート監視です。本記事ではADBインスタンスに対する監視設定をいくつかご紹介します。 目次 : 1.技術概要 2.単体インスタンスの監視 3.複数のインスタンスをまとめて監視 おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 なお本記事では、後続の章でCPU使用率が閾値を超えた際の挙動を確認するため、ECPU数は4、auto scalingは無効 で作成しています。 所要時間 : 約40分 1. 技術概要 Autonomous Databaseに対する監視・通知を行うツールはいくつか存在します。環境やユーザーによって、適切なツールを選択します。 本記事ではOCIモニタリング、データベース・ダッシュボード、パフォーマンス・ハブ、Oracle Enterprise Manager(EM)、Oracle Cloud Observability and Management Platform（O&amp;M）Database Managementによる監視設定をご紹介します。 2. 単体インスタンスの監視 単体のADBインスタンスに対しては、OCIモニタリングとOCI Eventsを使ってメトリック監視/イベント監視をすることができます。 2-1. アラームの通知先の作成 監視設定の前に通知先を作成しておく必要があります。こちら を参考に、トピックの作成・サブスクリプションの作成を行います。 2-2. OCIモニタリングによるメトリック監視 OCIモニタリングでは、OCI上の各種リソースの性能や状態の監視、カスタムのメトリック監視を行うことが可能です。また、アラームで事前定義した条件に合致した際には、管理者に通知を行うことで管理者はタイムリーに適切な対処を行うことができます。 今回は、ADBのCPUの閾値を超えた際に通知が来るよう設定し、その挙動を確認します。 まずはこちら を参考に、アラームの通知先の作成をします。 次にアラームの定義の作成をします。ハンバーガーメニューのObservability &amp; Management...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb503-monitoring/",
        "teaser": "/ocitutorials/adb/adb503-monitoring/monitoring_teaser.png"
      },{
        "title": "504 : 監査をしてみよう",
        "excerpt":"はじめに Oracle Databaseではデータベースに対する操作を記録する監査機能が提供されています。 データベース監査機能についての詳細はこちらのドキュメントをご覧ください。 Autonomous Databaseは、統合監査を利用した、いくつかの監査設定があらかじめ行われています。また必要に応じて任意の監査設定を追加できます。 この章では、Autonomous Databaseの監査設定と監査レコードの管理について紹介します。 目次 : 1.デフォルトの監査設定の確認 2.任意の監査設定の追加 3.監査対象の操作を実行（監査レコードの生成） 4.監査レコードの確認 5.任意の監査設定の無効化 6.監査レコードの削除 前提条件 : 監査対象の表は任意のスキーマの表でも構いませんが、ここでは、「102:ADBにデータをロードしよう(Database Actions)」 で作成したADBUSERスキーマのSALES_CHANNELS表を利用しています。 SQLコマンドを実行するユーザー・インタフェースは、接続の切り替えが容易なので、SQL*Plusを利用していますが、Database Actionsでも実行可能です。ユーザーでの接続をログインに読み替え、必要なユーザーでログインしなおしてください。なお、 SQL*Plusの環境は、「204:マーケットプレイスからの仮想マシンのセットアップ方法」で作成できます。 チュートリアルの便宜上Autonomous Databaseへの接続文字列は「atp01_low」、各ユーザのパスワードはすべて「Welcome12345#」とします。 使用パッケージの引数の説明は記載していません。詳細はドキュメント『PL/SQLパッケージ及びタイプ・リファレンス』（リンクは19c版です）をご参照ください。 所要時間 : 約20分 1. デフォルトの監査設定の確認 統合監査では、監査対象を監査ポリシーで定義し、定義された監査ポリシーを有効化することで監査レコードが生成されます。 Autonomous Databaseにはよく利用される監査対象用に事前定義済みの監査ポリシーがあり、そのうち5つがデフォルトで有効化されています。 作成済みの監査ポリシーはUNIFIED_AUDIT_POLICIESビュー、有効化された監査ポリシーはAUDIT_UNIFIED_ENABLED_POLICIESビューで確認することができます。 SQL*Plusを起動して以下を実行してください。 -- ADMINで接続する CONNECT admin/Welcome12345#@atp01_low -- SQL*Plusのフォーマット用コマンド set pages 100 set lines 200 col...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb504-audit/",
        "teaser": "/ocitutorials/adb/adb504-audit/unifiedaudit.png"
      },{
        "title": "505 : Autonomous Databaseのバックアップとリストアを体感しよう",
        "excerpt":"はじめに Autonomous Databaseでは自動バックアップがオンラインで取得され、取得したバックアップはバックアップを取得したADBにのみリストア可能です。保存期間は最小1日から最大60日で設定をする事が出来ます。インスタンス構成時にデフォルトで有効化されており、無効化することはできません。取得されたバックアップはOracle側で管理され、冗長化されており改変不可のイミュータブルバックアップです。 ユーザ自身がGUIやAPIを介して特定時点にリストアすることが可能です。本チュートリアルにおいても、Point-in-timeリカバリを実施いたします。 （補足） バックアップ操作中は、データベースは使用可能なままです。ただし、データベースの停止、スケーリング、終了などのライフサイクル管理操作は無効化されます。 目次 : はじめに 自動バックアップの確認 データベースに表を新規作成 タイムスタンプをUTCで確認 Point-in-timeリカバリ ご参考 おわりに 前提条件 ADBインスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 所要時間 : 約30分 自動バックアップの確認 Autonomousa Databaseの詳細画面 下にスクロールして、画面左側のタブのバックアップをクリックし、これまでバックアップ履歴を確認します。 自動バックアップが日時で取られているのが確認できます。 特に設定を行わずとも、自動バックアップが構成されています。 全て増分バックアップになっており、60日ごと取得されているフルバックアップが無いのでは？と思われたかもしれませんが、こちらは誤りではなく、フルバックアップはRMANでは増分バックアップのLevel0となるので、この一覧では全て増分バックアップとして表示されております。 なお、Autonomous Databaseでは、1分ごとにアーカイブログがバックアップされています。(ADB-Dでは15分ごと) 保存期間内の任意のタイミングにタイミングにリストア・リカバリが可能になっています。 RMANを利用しており、ブロック破損のチェックも同時に行われているため信頼できるバックアップになっています。 また、Autonomous Databaseでは、これらのバックアップを格納しておくストレージストレージの追加コストは不要です。 データベースに表を新規作成 では、この段階で新規でEmployee表を作成し、１行をインサートしてみます。 データベースの詳細画面のデータベース・アクションをクリックします。 開発のSQLをクリックします。 SQLワークシートにて、下記のSQLを実行し、Employees表を新規作成します。 CREATE TABLE EMPLOYEES ( FIRST_NAME VARCHAR(100), LAST_NAME VARCHAR(100) );...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb505-backup/",
        "teaser": "/ocitutorials/adb/adb505-backup/img2.png"
      },{
        "title": "506: サポートサービスへの問い合わせ(Service Requestの起票)",
        "excerpt":"はじめに Oracle Cloud 製品をご利用のお客様は、ポータルサイト「My Oracle Support (Cloud Support)」 を介して、Oracle製品に関するナレッジの検索や、製品仕様の確認、不具合に関するお問い合わせを行っていただけます。 本ページでは、Autonomous Databaseを例に、そういった各種お問い合わせのためのサービス・リクエスト（Service Request ：SR）の作成フローをご紹介します。 尚、実際の利用に際しては本ページ後半の参考資料に記載しております、弊社サポート部門からのガイドをご確認いただくようお願いいたします。 Oracle Cloudでは通常契約の他に無償でお試しいただけるFree Tierを用意しています。Free Tierには期間/利用クレジットが限定される「30日間無償トライアル」とAlways Freeリソースを対象とした「常時無償サービス」が含まれますが、「常時無償サービス」のみご利用の場合はOracle Supportの対象にならず、問い合わせを上げることはできません。詳細はOracle Cloud Free Tierに関するFAQにて “ Oracle Cloud Free Tierにはサービス・レベル契約（SLA）とテクニカル・サポートが含まれていますか? “ をご覧ください。 2021年初頭のサービス・アップデートにより、OCIコンソール画面からもSRを作成、閲覧、更新ができるようになりました。OCIコンソール画面からのSR起票については別の文書でご案内する予定です。本ページでは「My Oracle Support (Cloud Support)」を利用したSR起票について説明します。 目次 1.Cloud Supportのアカウントを用意する 2.問い合わせ対象のAutonomous Databaseの情報を確認する Domain name/Cloud Account nameの確認 Data Center Location、Database Name、Database OCID、Tenancy OCIDの確認...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb506-sr/",
        "teaser": "/ocitutorials/adb/adb506-sr/img1.jpg"
      },{
        "title": "601: ADWでMovieStreamデータのロード・更新をしよう",
        "excerpt":"はじめに データのロード、変換、管理、そして分析まで、全てを1つのデータベースで行うことができるのが、Autonomous Data Warehouseです。このチュートリアルを参考に、ぜひ一度”完全自律型データベース“を体験してみてください。 本記事では、MovieStreamデータを使い、データのロード・処理方法を実際のビジネスシナリオに近い形でご紹介します。 想定シナリオ： Oracle MovieStreamは、架空の映画ストリーミングサービスです。 MovieStreamはビジネスを成長させるため、顧客の視聴傾向や適切な提供価格などのデータ分析を行いたいと考えています。 前提条件： ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 目次： 1. ADWへのMovie Salesデータのロード 2. Movie Salesデータの更新 おわりに 所要時間 : 約1時間 1. ADWへのMovie Salesデータのロード 1-1. ADWインスタンスの作成 まずはADWインスタンスを作成します。101:ADBインスタンスを作成してみよう を参考にしながら、以下の条件で作成します。 ワークロード・タイプ： データ・ウェアハウス ECPU数： 32 ストレージ(TB)： 1 CPU Auto Scaling： 許可 それ以外の項目については、ご自身の環境や目的に合わせて選択してください。 1-2. Movie Salesデータのロード ADWでは、ニーズに応じて様々な方法でデータをロードすることができます。本記事では、簡単なスクリプトを使用してオブジェクトストレージからデータをロードします。 ADWに接続サービスHIGHで接続し、以下のスクリプトを実行します。実行すると、MOVIE_SALES_FACT表が作成されます。 CREATE TABLE MOVIE_SALES_FACT...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb601-moviestream-load/",
        "teaser": "/ocitutorials/adb/adb601-moviestream-load/teaser.png"
      },{
        "title": "602: ADWでMovieStreamデータの分析をしよう",
        "excerpt":"はじめに データのロード、変換、管理、そして分析まで、全てを1つのデータベースで行うことができるのが、Autonomous Data Warehouseです。このチュートリアルを参考に、ぜひ一度”完全自律型データベース“を体験してみてください。 本記事では、MovieStreamデータを使い、データの分析方法を実際のビジネスシナリオに近い形でご紹介します。 想定シナリオ： Oracle MovieStreamは、架空の映画ストリーミングサービスです。 MovieStreamはビジネスを成長させるため、顧客の視聴傾向や適切な提供価格などのデータ分析を行いたいと考えています。 前提条件： ADBインスタンスが構成済みであること ※ADBインタンスを作成方法については、101:ADBインスタンスを作成してみよう を参照ください。 601: ADWでMovieStreamデータのロード・更新をしようのチュートリアルを完了していること 目次： 1. Movie Salesデータの分析 2. 半構造化データの処理 3. テキスト文字列の処理 4. 最も重要な顧客の発掘 5. パターンマッチング機能の利用 6. 機械学習モデルのご紹介 おわりに 所要時間 : 約1.5時間 1. Movie Salesデータの分析 1-1. 結果キャッシュによる実行時間の短縮 まずは、年と四半期ごとの映画の総売上高を調べるシンプルなクエリを実行してみましょう。 SELECT year, quarter_name, SUM(quantity_sold * actual_price) FROM movie_sales_fact WHERE YEAR =...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb602-moviestream-analysis/",
        "teaser": "/ocitutorials/adb/adb602-moviestream-analysis/teaser.png"
      },{
        "title": "603 : データ・カタログを使ってメタデータを収集しよう",
        "excerpt":"はじめに 昨今、多くの企業が自社の持つデータを分析してビジネスに役立てようとしています。しかし実際のところ、分析シナリオに最適なデータ準備やデータの把握、管理が困難で、データマネジメントには多くの課題が存在しています。 Oracle Cloud Infrastructure Data Catalogは、そのような企業データのフルマネージドのデータ検出および管理を行うソリューションです。Data Catalogを使うと、技術、ビジネスおよび運用に役立つメタデータを管理するための単一のコラボレーション環境を作成できます。データを必要とする誰もが、単一のインタフェースから、専門知識不要でデータを検索することができます。 Data Catalogの主要な機能 メタデータの収集：カタログ化したいデータストア（データベースやオブジェクトストレージ）を指定し、Data Catalogの中にメタデータを抽出します。定期的にスケジュール実行も可能です。 データへのタグ付け：表や列、ファイルなどのデータを論理的に識別するためのキーワード（自由書式）を設定できます。これにより、特定のキーワードでタグ付けされた全てのデータを検索することができます。 ビジネス用語集：組織内であらかじめ決められた用語を使って、データに検索、分類のための目印を付与することができます。 データの検索：SQLやRESTではなくキーワードでの検索、表名・列名・ファイル名での検索、特定のタグやビジネス用語に合致するデータの検索を全て行うことができます。 目次 : 1.データの準備 2.データ・カタログの作成 3.Autonomous Databaseからメタデータを収集 4.Object Storageからメタデータを収集 5.ビジネス用語集とカスタム・プロパティの作成 6.メタデータの補完 7.データの検索 8.おわりに 前提条件 Autonomous Data Warehouse(ADW)インスタンスが構成済みであること ※ADBインタンスの作成方法については、 101:ADBインスタンスを作成してみよう を参照ください。 Data Catalogを使用するためのユーザーグループ、ポリシーが設定済みであること ※本チュートリアルを進めるうえで必要なポリシーはこちらを参照ください。 所要時間 : 約2時間 1. データの準備 データ・カタログのタスクを行うために必要なデータベース・オブジェクトをSQLスクリプトを実行することで作成します。 ADMINユーザーでADWに接続し、以下のスクリプトを実行して、sales_historyというユーザーを作成します。 CREATE USER sales_history IDENTIFIED BY Welcome12345#;...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb603-data-catalog/",
        "teaser": "/ocitutorials/adb/adb603-data-catalog/3-1.png"
      },{
        "title": "ADB-Dの環境を作成してみよう",
        "excerpt":"はじめに Autonomous Databaseのデプロイメント方式にはADB-S(Serverless/共有型)とADB-D(Dedicated/専有型)の２つがあります。 ADB-DではインフラストラクチャのExadataをお客様が専有して利用することができます。 ADB-SもADB-DもAutonomous Databaseの特長である高性能・高可用性・高いセキュリティという点は同じですが、ADB-DではExadataを専有することにより「高度な分離性」と「運用ポリシーのカスタマイズ」が可能となります。 ADB-Dは複数の層で構成されており、それぞれ独立性が確保されています。したがって、どの層でもワークロードを分離させることができるとともに、層別に管理者のロールをわけて責任境界を明確化することができます。運用ポリシーについても、各層をそれぞれどのようにプロビジョニング・構成・メンテナンスするかをユーザ側で制御することが可能です。 ADB-Dにおける管理の領域は、OracleではPDBのレイヤを境界として「フリート管理者」および「データベース管理者」で分けることを推奨しています。 このような特長から、ADB-Dは、複数のADBを利用するような大規模なシステムや、セキュリティ上の制約によって他のお客様との同居が許されないようなシステムに適しています。 また、ADB-Dはクラウド(OCI)だけでなく、お客様データセンターに配置したCloud@Customer(C@C)でサービスを利用することが可能です。 データをパブリッククラウドに持ち出すことができない場合や、アプリケーションからのネットワークレイテンシが問題となるようなお客様はADB-C@Cの選択ができます。 本チュートリアルでは、OCI上にADB-Dのデプロイメントを行います。 目次 1. 環境を作成してみよう 1-1. ネットワーク設定 1-2. Exadata Infrastructureの作成 1-3. Autonomous Exadata VMクラスタの作成 1-4. Autonomous Container Databasesの作成 1-5. Autonomous Databaseの作成 2. 作成したADBに接続してみよう 3. 補足 所要時間 : 約6時間程程度　※プロビジョニング時間を含みます 1. 環境を作成してみよう ADB-Dは次の４つの層で構成されます。 Autonomous Database (ADB) Oracle Databaseのプラガブル・データベース Autonomous Container Database (ACD)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/adb/adb701-adbd/",
        "teaser": null
      },{
        "title": "101 : Always Freeで23aiのADBインスタンスを作成してみよう",
        "excerpt":"はじめに Always Freeクラウド・サービスは、期間の制限なく無料で使用できるサービスです。 Always Freeではコンピュート、ストレージ、ロード・バランサ、そしてAutonomous Database (ADB) 等を使用可能です。 Always FreeのADBでは、2024年5月にリリースとなったOracle Database 23aiを使用し、新機能を試す事が出来ます。 この章では、Always FreeのADBインスタンスの作成方法をご紹介します。 なお、BaseDBでのインスタンスの作成方法は101: Oracle Cloud で Oracle Database を使おう(BaseDB) を参考にしてください。 目次 はじめに 1. リージョンの確認 2. ADBインスタンスを作成してみよう 所要時間 : 約5分 1. リージョンの確認 Always Free Autonomous Database上でのOracle Database 23aiは、 2025/01時点では、以下のリージョンでご利用いただけます： フェニックス(PHX) アッシュバーン(IAD) ロンドン(LHR) パリ(CDG) シドニー(SYD) ムンバイ(BOM) シンガポール(SIN) 東京(NRT) 最新のリージョン一覧はこちらをご参照ください。 お使いのテナンシーのホーム・リージョンが上記のリージョンのいずれか、...","categories": [],
        "tags": [],
        "url": "/ocitutorials/ai-vector-search/ai-vector101-always-free-adb/",
        "teaser": "/ocitutorials/ai-vector-search/ai-vector101-always-free-adb/ai-vector101-teaser.png"
      },{
        "title": "102 : 仮想マシンへOracle Database 23ai Freeをインストールしてみよう",
        "excerpt":"はじめに Oracle Database 23ai Freeは、Oracle Database 23aiを使いやすく、簡単にダウンロードできるようにパッケージ化され、無料で提供されています。Oracle Database 23ai Freeの概要はこちら をご参照ください。 Oracle Database 23ai Freeでは、一部リソース制限がありますが、AI Vector Searchの基本的な使い方を体験することができます。 本チュートリアルでは、Oracle Database 23ai Freeを仮想マシンインスタンスへインストールする方法をご紹介します。 前提条件 : Oracle Database 23ai Freeをインストールする仮想マシンインスタンスがプロビジョニング済みであること ※Oracle Cloud Infrastructure上でプロビジョニングする場合は、入門編-その3 - インスタンスを作成する を参照ください。 システム要件を満たしていることをご確認ください。 本チュートリアルはOracle Linux 8を前提にしています。 目次 はじめに 1. Oracle Database 23ai Freeのインストール 2. Oracle Database 23ai Freeへの接続 所要時間...","categories": [],
        "tags": [],
        "url": "/ocitutorials/ai-vector-search/ai-vector102-23aifree-install/",
        "teaser": "/ocitutorials/ai-vector-search/ai-vector102-23aifree-install/ai-vector102-teaser.png"
      },{
        "title": "103 : Oracle AI Vector Searchの基本操作を試してみよう",
        "excerpt":"はじめに Oracle AI Vector Search は、Oracle Database 23aiから追加されている、ベクトル・データを活用したセマンティック検索機能です。機能としては、新たなベクトルデータ型、ベクトル索引、ベクトル検索のSQL演算子が含まれております。これらにより、Oracle Databaseは、文書、画像、その他の非構造化データのセマンティック・コンテンツをベクトルとして格納し、それを活用して迅速な類似性クエリを実行することが可能になります。この機能は、大規模言語モデル(LLM)とプライベートのビジネス・データを組みわせて、ビジネス基準のセキュリティ、性能レベルを満たすためのワークフローであるRetrieval Augmented Generation(RAG)に対応することができ、エンタープライズ向けの高度で強力な検索を可能にします。 この章では、ベクトル列を含んだテーブルの作成、ベクトル列でのDDLおよびDML操作、関数を使用した類似性検索、リレーショナル・データベース上でベクトル・データを扱った操作など、基本的なOracle AI Vector Searchにおけるベクトル・データの操作についてご紹介します。 目次 : はじめに 1. ベクトル・データを扱ったDDL、DMLを含んだSQLクエリの実行 2. ベクトルの距離計算 3. 類似性検索 4. 属性フィルタリング 4-1 サンプル表の作成 4-2 属性フィルタリングを使用した類似性検索 5. その他の距離関数 6. その他のベクトル関数 参考資料 前提条件 : 101:Always Freeで23aiのADBインスタンスを作成してみようもしくは、102:仮想マシンへOracle Database 23ai Freeをインストールしてみようの記事を参考に、Oracle Database 23aiの準備が完了していること。 所要時間 : 約90分 1. ベクトル・データを扱ったDDL、DMLを含んだSQLクエリの実行 1-1...","categories": [],
        "tags": [],
        "url": "/ocitutorials/ai-vector-search/ai-vector103-basics/",
        "teaser": "/ocitutorials/ai-vector-search/ai-vector103-basics/teaser.png"
      },{
        "title": "104 :ファイル→テキスト→チャンク→ベクトルへの変換およびベクトル検索を使おう",
        "excerpt":"はじめに このチュートリアルでは、ファイルからテキストへ、テキストからチャンクへ、チャンクからベクトルデータへの変換、およびベクトルの検索について、ステップバイステップでの実行する方法をご紹介します。 23ai free、ADB23ai(Always Free)の両方でのやり方をご紹介します。 ファイルからテキストへ変換する関数セット(UTL_TO_TEXTおよびDBMS_VECTOR_CHAIN)を使用して、テキストをチャンク(UTL_TO_CHUNKS)に分割し、次にベクトル化モデルを使ってそれぞれのチャンクのベクトル(UTL_TO_EMBEDDINGS)を作成します。 0. 前提条件 ベクトル化処理ではOCI Generative AIのサービスを使用しますので、下記の前提条件を満たせる必要があります。 使用するOracle Databaseの環境があること 23ai freeで実行する場合、Oracle Database 23ai Freeをインストールする済みであること ※インストール方法については、102 : 仮想マシンへOracle Database 23ai Freeをインストールしてみよう を参照ください。 ADB23aiで実行する場合、Autonomous Database 23aiのインスタンスを構築済みであること。本記事では無償で使えるAlways Freeを使います。 ※インスタンス作成方法については。101 : Always Freeで23aiのADBインスタンスを作成してみようをご参照ください。 AI Vector Searchの基本的な操作を学習済みであること 103 : Oracle AI Vector Searchの基本操作を試してみようを参照ください。 OCI GenAI Serviceをご利用いただけるリージョンはサブスクリプション済みであること。 ※2025/01時点で、利用可能なリージョンは以下です。 サンパウロ(GRU) フランクフルト(FRA) 大阪(KIX) ロンドン(LHR)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/ai-vector-search/ai-vector104-file-to-embedding/",
        "teaser": "/ocitutorials/ai-vector-search/ai-vector104-file-to-embedding/ai-vector104-file-to-embedding-teaser.png"
      },{
        "title": "105: マルチベクトル検索で複数のドキュメントを検索してみよう",
        "excerpt":"マルチベクトル検索は、データの特徴に基づくパーティションを用いたグルーピング基準を使って、最も一致する上位K個のベクトルを取得する手法です。 本章では、実際にサンプルデータを使って通常のベクトル検索と、マルチベクトル検索の違いやその有用性を確認します。 所要時間 : 約30分 前提条件 : 使用するOracle Databaseの環境があること 23ai freeで実行する場合、Oracle Database 23ai Freeをインストールする済みであること ※インストール方法については、102 : 仮想マシンへOracle Database 23ai Freeをインストールしてみよう を参照ください。 ADB23aiで実行する場合、Autonomous Database 23aiのインスタンスを構築済みであること。本記事では無償で使えるAlways Freeを使います。 ※インスタンス作成方法については。101 : Always Freeで23aiのADBインスタンスを作成してみようをご参照ください。 AI Vector Searchの基本的な操作を学習済みであること 103 : Oracle AI Vector Searchの基本操作を試してみようを参照ください。 OCI GenAI Serviceをご利用いただけるリージョンはサブスクリプション済みであること。 ※2025/01時点で、利用可能なリージョンは以下です。 サンパウロ(GRU) フランクフルト(FRA) 大阪(KIX) ロンドン(LHR) シカゴ(ORD) 最新のリージョン一覧はこちらをご参照ください。本チュートリアルで使用するテキスト生成モデル、エンベッディングモデルについては、将来的にモデルの廃止が行われることがあるため、廃止日や置換モデルのリリース情報をこちらから確認のうえ、最新のモデルを使用することを推奨します。以降のチュートリアルでは、エンベッディングモデルにcohere.embed-multilingual-v3.0、テキスト生成モデルにcohere.command-r-plus-08-2024を使用します。これらが最新になっているか上記リンクよりご確認ください。また大阪リージョンの利用が前提となっているため、それ以外のリージョンの場合は適宜サービス・エンドポイントを修正してください。 OCI アカウントのAPI署名キーの生成は完了であること...","categories": [],
        "tags": [],
        "url": "/ocitutorials/ai-vector-search/ai-vector105-multi-vector-search/",
        "teaser": "/ocitutorials/ai-vector-search/ai-vector105-multi-vector-search/ai-vector105-teaser.png"
      },{
        "title": "106 : Oracle Database 23aiとLangChainでRAGを構成してみよう",
        "excerpt":"RAGの構成とシナリオ RAGの構成 本チュートリアルはLangChainを使ったRAG構成をステップバイステップで実装する内容となっています。 構成に利用するサービスは以下の通りです。 テキスト生成モデル：OCI Generative AI(cohere.command-r-plus-08-2024) ※2025/01時点で、利用可能なリージョンは以下です。 サンパウロ(GRU) フランクフルト(FRA) 大阪(KIX) ロンドン(LHR) シカゴ(ORD) 最新のリージョン一覧はこちらをご参照ください。 ドキュメントデータのベクトル化に利用するモデル : Oracle Cloud Generative AI Service(cohere.embed-multilingual-v3.0) ベクトルデータベース: Oracle Database 23ai Free(OCI Computeにインストール)、Base Database Service、Autonomous Database(Always Free) 本チュートリアルで使用するテキスト生成モデル、エンベッディングモデルについては、将来的にモデルの廃止が行われることがあるため、廃止日や置換モデルのリリース情報をこちらから確認のうえ、最新のモデルを使用することを推奨します。本チュートリアルでは、エンベッディングモデルにcohere.embed-multilingual-v3.0、テキスト生成モデルにcohere.command-r-plus-08-2024を使用します。これらが最新になっているか上記リンクよりご確認ください。 ※LangChainって何？という方はこちらの記事 をご参照ください。 また、本チュートリアルではAI Vector Searchの以下のチュートリアルを実施済みであることが前提となっています。 103 : Oracle AI Vector Searchの基本操作を試してみよう 104 :ファイル→テキスト→チャンク→ベクトルへの変換およびベクトル検索を使おう 本チュートリアルでは、OCI GenAIサービスにAPIコールするためのクレデンシャル情報が必要です。 501: OCICLIを利用したインスタンス操作を参照して、APIキーを事前に作成してください。 ドキュメントデータ...","categories": [],
        "tags": [],
        "url": "/ocitutorials/ai-vector-search/ai-vector106-23ai-langchain-rag/",
        "teaser": "/ocitutorials/ai-vector-search/ai-vector106-23ai-langchain-rag/1.png"
      },{
        "title": "107 : 会話履歴保持の仕組みを取り入れたRAGの実装をしてみよう",
        "excerpt":"はじめに 106 : Oracle Database 23aiとLangChainでRAGを構成してみようではLangChainを利用したシンプルな検索拡張生成(RAG)の実装をご紹介しました。 今回は、その基本実装にチャット会話履歴を保持する仕組みを取り入れた構成をご紹介します。(※RAGって何ですか？という方はこちらの記事を事前にご参照ください。) ChatGPTを使って沢山の質問を投げていると、無意識に主語を省略したり、「それ」、「あれ」、「彼」、「彼女」など代名詞などを使って以前の質問を指し示すような質問をする場合が多々あります。そんな適当に入力した質問でもLLMがちゃんと応答してくれるのは、そのセッションで入力されたプロンプトと出力された応答テキストをデータベースに保存し、新しい質問が入力されると、その前までの会話と関連性がある質問なのかどうかを判断し、必要に応じて過去の会話から必要なテキストを参照する仕組みがあるからです。 構成としては、RAGの基本コンポーネント(LLMとベクトルデータベース)に加えて、チャット履歴を保持するデータベースを追加するだけです。上図の例は、プロンプト2で主語を省略した形で質問をしていますが、プロンプト1の質問とその応答テキストがチャット履歴としてデータベースに保存されており、その内容からプロンプト2の主語が何になるかを補完して返答2として正確な応答をしているという例です。 仮に会話履歴が保持されていないと、プロンプト2の主語が何になるのかがわからず、誤った応答をしてしまう可能性が高くなるため、それを回避するためチャットボット系のアプリでは必ずこの仕組みを実装することになります。本チュートリアルではそのサンプル実装をご紹介します。 構成 今回の実装で利用する構成図が下記になります。 オーケストレーションツール：LangChain ベクトルデータベース：Oracle Database 23ai(AI Vector Search) Autonomous Database Base Database Service Oracle Database 23ai Free(Computeインスタンスへインストール) 大規模言語モデル：OCI Generative AI Service 会話履歴保持用データベース：OCI PostgreSQL Database Service RAGのフローや上述した会話履歴データベースの参照処理などは全てLangChainにお任せ状態になるためこちらの実装もいたってシンプルです。この構成では、会話履歴保持用データベースにPostgreSQLを使っていますが、データベースを使わずメモリに保持することもできます。その場合、多数のユーザーがたくさん質問するような環境ではメモリを圧迫しますし、システムが落ちてしまうと会話履歴が保持されませんのでやはりデータベースを使うのがよいと思います。 ドキュメントデータ ベクトルデータベースにロードするドキュメントデータは下図のような内容のPDFファイルです。テキストの内容としては架空の製品であるロケットエンジンOraBoosterの説明文章です。企業内のデータを想定し、テキストの内容としては、存在しない製品かつ完全な創作文章、ということでLLMが学習しているはずのないデータということになります。後の手順でこちらのPDFファイルをベクトルデータベースにロードします。 106 : Oracle Database 23aiとLangChainでRAGを構成してみようで使用したPDFファイルと同じものになっているので、すでに実施済みの方はダウンロードしなくて結構です。 本チュートリアルで使用するファイル 106を実施していない方は、以下で/tmpディレクトリにこちらのPDFをダウンロードしてください。 cd /tmp wget https://oracle-japan.github.io/ocitutorials/ai-vector-search/ai-vector106-23ai-langchain-rag/rocket.pdf 実装...","categories": [],
        "tags": [],
        "url": "/ocitutorials/ai-vector-search/ai-vector107-rag-chat-history/",
        "teaser": "/ocitutorials/ai-vector-search/ai-vector107-rag-chat-history/1.png"
      },{
        "title": "108 : SELECT AI with RAGを試してみよう",
        "excerpt":"はじめに Autonomous DatabaseのSELECT AIがRAG（Retrieval Augmented Generation）をサポートするようになりました。自然言語でデータベース内のデータを問い合わせることができるSELECT AI機能にRAGを組み合わせることで、大規模言語モデル（LLM）の知識とエンタープライズデータベースの知識との間のギャップを埋めることが可能になります。これにより、より関連性の高い応答や最新の情報を含む応答が得られ、同時にハルシネーションのリスクも軽減されます。 SELECT AIについては111: SELECT AIを試してみようをご参照ください。 本記事では架空の製品データをベクトルストアに格納し、LLMが学習していないデータに関する質問に対してRAG構成でうまく回答できることを確認します。 前提条件 : 101:Always Freeで23aiのADBインスタンスを作成してみようの記事を参考に、Oracle Database 23aiの準備が完了していること。 OCI GenAI Serviceをご利用いただけるリージョンはサブスクリプション済みであること。 ※2025/01時点で、利用可能なリージョンは以下です。 サンパウロ(GRU) フランクフルト(FRA) 大阪(KIX) ロンドン(LHR) シカゴ(ORD) 最新のリージョン一覧はこちらをご参照ください。 SELECT AIではデフォルトでシカゴリージョンのOCI GenAIサービスを使用しますが、本チュートリアルでは大阪リージョンのOCI GenAIサービスを使用しますので、大阪リージョンがサブスクライブされていることが前提となります。 本チュートリアルで使用するテキスト生成モデル、エンベッディングモデルについては、将来的にモデルの廃止が行われることがあるため、廃止日や置換モデルのリリース情報をこちらから確認のうえ、最新のモデルを使用することを推奨します。本チュートリアルでは、エンベッディングモデルにcohere.embed-multilingual-v3.0、テキスト生成モデルにcohere.command-r-plus-08-2024を使用します。これらが最新になっているか上記リンクよりご確認ください。 OCI アカウントのAPI署名キーの生成は完了であること 以下の情報を取得してください。必要があれば、API署名キーの生成方法をご参照ください。 user - キー・ペアが追加されるユーザーのOCID。 fingerprint - 追加されたキーのフィンガープリント。 tenancy - テナンシのOCID。 region - コンソールで現在選択されているリージョン。 key_file -...","categories": [],
        "tags": [],
        "url": "/ocitutorials/ai-vector-search/ai-vector108-select-ai-with-rag/",
        "teaser": "/ocitutorials/ai-vector-search/ai-vector108-select-ai-with-rag/adb-diagram-third-party-vector-db-select-ai-rag.png"
      },{
        "title": "109 : Oracle Database で全文検索してみよう",
        "excerpt":"はじめに チュートリアル103~108では、RAGを構成するためのベクトル検索機能について確認しました。ベクトル検索は、テキスト・画像・音声などの非構造データを数値の集合であるベクトルに変換し、ベクトル間の距離の大小を以て、意味的な類似度を計算する検索手法です。 一方全文検索は、特定のキーワードやフレーズをテキスト内で検索するための技術です。通常、インデックス(索引)を利用して、指定した単語が含まれる文書を高速に抽出するため、検索対象としては単語ベースになります。 RAGでは「意味の近いコンテンツを取ってくる」という点から主にベクトル検索(セマンティック検索)が使われてきました。しかしベクトル検索も万能ではなく、質問と意味は近いが内容のズレた情報を取得してしまうことや、厳密なキーワード一致を保証しないため、誤った関連情報を拾いハルシネーションを起こしてしまうことがあります。そういった中で、厳密なキーワード一致検索ができる全文検索が評価されてきています。またベクトル検索と全文検索を組み合わせたハイブリッド検索も注目されています。 本チュートリアルではその全文検索をOracle Databaseで実装する方法をご紹介します。 0. 前提条件 101:Always Freeで23aiのADBインスタンスを作成してみよう、または101: ADBインスタンスを作成してみようの記事を参考に、Autonomous Database(23ai)を作成済みであること。 本チュートリアルで使用する以下のサンプルデータをダウンロード済みであること。 TextSample1.csv TextSample2.csv 目次： はじめに 0. 前提条件 1. Oracle Textとは 2. Oracle Textで全文検索してみる 3. 参考資料 所要時間 : 約40分 1. Oracle Textとは Oracle Text は、Oracleカーネルに組み込まれた全文検索およびドキュメント分類のためのエンジンです。Oracle Database のすべてのエディションで無償でご利用いただける機能です。 Oracle Text では、PDFやテキスト形式など各種フォーマットのデータに対して索引付けを行うことができます。全文検索専用のテキスト索引を作成することで、検索対象ドキュメントを一つ一つ検索するよりも高速に検索が行えます。またテキスト索引を作成すると、索引付けしたデータを「トークン」という単位に分割して、トークン表の形でデータベース内で保持します。 検索するときも検索ワードを同様にトークンに分割し、DB内で分割したトークンが連続して存在している場合に結果として返します。 Oracle Text で全文検索を行うには、CONTAINSというSQL関数を利用します。 SELECT id FROM testtab WHERE...","categories": [],
        "tags": [],
        "url": "/ocitutorials/ai-vector-search/ai-vector109-oracletext/",
        "teaser": "/ocitutorials/ai-vector-search/ai-vector109-oracletext/image1.png"
      },{
        "title": "101: Oracle Cloud で Oracle Database を使おう(BaseDB)",
        "excerpt":"はじめに Oracle Base Database Service(BaseDB)は、Oracle Cloud Infrastructure の上で稼働する Oracle Database のPaaSサービスです。 ユーザーはオンプレミスと全く同じOracle Databaseのソフトウェアをクラウド上で利用することができ、引き続きすべてのデータベース・サーバーの管理権限(OSのroot権限含む)およびデータベースの管理者権限を保持することができます。 この章では、作成済みの仮想クラウド・ネットワーク(VCN)にデータベース・サービスを1つ作成していきます。 前提条件 : Oracle Cloud Infrastructure チュートリアル を参考に、仮想クラウド・ネットワーク(VCN)の作成が完了していること 注意 チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 1. DBシステムの作成 2. DBシステムへのアクセス 3. データベース（PDB）にアクセス 4. PDB上のスキーマにアクセスしましょう 所要時間 : 約30分 1. DBシステムの作成 コンソールメニューから Oracle Database → Oracleベース・データベース・サービス を選択し、有効な管理権限を持つコンパートメントを選択します DBシステムの作成 ボタンを押します 立ち上がった...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs101-create-db/",
        "teaser": "/ocitutorials/basedb/dbcs101-create-db/img11.png"
      },{
        "title": "102: BaseDB上のPDBを管理しよう",
        "excerpt":"はじめに Oracle Base Database Service(BaseDB)では、Oracle Cloud Infrastructure の上で稼働する Oracle Database の PDB を OCI コンソールから停止したり、起動したり、既存 PDB からクローンするなどの操作が簡単に行う事が可能です。この章では実際にどのように操作するのか確認していきます。 前提条件 : Oracle CloudでOracle Databaseを使おうを通じて Oracle Database の作成が完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. PDB を起動・停止してみよう 2. PDB を新規作成してみよう 3. 既存 PDB からクローン PDB を作成してみよう 所要時間 : 約15分 1. PDB を起動・停止してみよう まずは、コンソール上で作成済みの PDB を確認する画面への遷移、および PDB...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs102-managing-pdb/",
        "teaser": "/ocitutorials/basedb/dbcs102-managing-pdb/img13.png"
      },{
        "title": "103: パッチを適用しよう",
        "excerpt":"はじめに Oracle Base Database Service(BaseDB)では、OS以上がユーザー管理となるため、ユーザー側でパッチ適用の計画と適用実施が可能です。 ここでは、DatabaseとGrid Infrastructureに対するそれぞれのパッチ適用方法についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること パッチ適用対象の Oracle Database に対して最新RU/RURが適用されていないこと 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. 現在のバージョンを確認しよう 2. Grid Infrastructure にパッチを適用しよう 3. Database にパッチを適用しよう 所要時間 : 約15分 1. 現在のバージョンを確認しよう まずは、コンソール上で作成済みの Database と Grid Infrastructure のバージョンを確認していきましょう。 コンソールメニューから Oracle Database → Oracle Base Database...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs103-patch/",
        "teaser": "/ocitutorials/basedb/dbcs103-patch/img11.png"
      },{
        "title": "104: 自動バックアップを設定しよう",
        "excerpt":"はじめに サービスを利用していくにあたり、利用している環境のインスタンスやデータが壊れてしまった場合や、過去の時点にデータを戻したい場合など、何か起きた時のデータ復旧のためにバックアップやリカバリについての検討は重要です。 BaseDB では、RMANを利用した自動バックアップ機能が利用可能で、リカバリも最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 ここでは、OCI コンソールから自動バックアップを構成するまでの手順についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. 自動バックアップの前提条件を確認する 2. 自動バックアップの設定をしよう 3. 自動バックアップの設定を変更しよう 4. オンデマンド・バックアップを取得しよう 5. 取得したバックアップを確認しよう 所要時間 : 約30分 1. 自動バックアップの前提条件を確認する まずは設定するにあたり前提条件を確認してみましょう。 オブジェクト・ストレージに取得することを前提にまとめています。DBシステム内(FRA)にとる場合など、CLI(dbcli)で設定する場合には、バックアップはコンソールからの管理対象外となります。 必要なエディション 自動バックアップ機能は全エディションで利用可能 並列実行(チャネル数やセクション・サイズの指定など)や高速増分バックアップなどを使う場合にはEnterprise Edition以上が必要 ※特にリストア時間(RTO)の観点で、並列処理でのリストアができることはメリットになります。RTOが厳しい場合には、Enterprise Edition以上をおすすめします。 Oracle Cloudのインフラ側の前提条件 管理ユーザーのIAMサービス・ポリシーでの権限が付与済 DBシステムからオブジェクト・ストレージへのアクセス設定(VCNでサービス・ゲートウェイの利用がおすすめ) DBシステムとデータベースの状態 自動バックアップの機能が動作するためには、データベースが下記の状態である必要があります。下記の状態ではない場合、バックアップジョブが失敗する可能性があるのでご注意ください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs104-backup/",
        "teaser": "/ocitutorials/basedb/dbcs104-backup/11.PNG"
      },{
        "title": "105: バックアップからリストアしよう",
        "excerpt":"はじめに BaseDB では、自動バックアップ機能やオンデマンドバックアップにて取得したバックアップを利用する事で、最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 また、バックアップ元のデータベースに対してリストアするだけでなく、別DBシステム上にリストアする事も可能です。 ここでは、OCI コンソールからリストアする手順についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 自動バックアップを設定しよう を通じてバックアップを取得していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. バックアップ元のデータベースに対してリストア 2. バックアップから新規データベースとしてリストア 3. オンデマンドバックアップを使用したリストア 所要時間 : 約30分 1. バックアップ元のデータベースに対してリストア まずはバックアップ元のデータベースに対してリストアしてみましょう。 リストア方法には下記3つがありますので、リストアしたい地点に応じてどのリストア方法を利用するか検討してください。 最新にリストア データ損失の可能性が最も低い、直近の正常な状態にデータベースをリストアします。 タイムスタンプにリストア 指定した日時にデータベースをリストアします。 SCNにリストア SCNを使用してデータベースをリストアします。 有効なSCNを指定する必要がありますので、データベース・ホストにアクセスして問い合せるか、オンラインまたはアーカイブ・ログにアクセスして使用するSCN番号を確認してください。 コンソールメニューから Oracle Database → Oracleベース・データベース・サービス を選択し、有効な管理権限を持つコンパートメントを選択します リストアしたいDBシステムを選択します...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs105-restore/",
        "teaser": "/ocitutorials/basedb/dbcs105-restore/restore00.png"
      },{
        "title": "106: Data Guardを構成しよう",
        "excerpt":"はじめに Data Guardは、Oracle Database自身が持つレプリケーション機能です。 プライマリDBの更新情報（REDOログ）をスタンバイDBに転送し、そのREDOログを使ってリカバリし続けることでプライマリDBと同じ状態を維持します。 リアルタイムに複製データベースを持つ事ができる為、データベース障害やリージョン障害などのRTO/RPOを短くすることができ、広範囲な計画停止(メンテナンス)においても切り替えることによって停止時間を極小化することが可能で、災害対策(DR)としてのデータ保護はもちろんのこと、移行やアップグレードの停止時間短縮といった利用用途もあります。 また、参照専用として利用可能なActive Data Guardにしたり、一時的に読み書き可能なスナップショット・スタンバイとして利用したりと、普段から利用可能なスタンバイDBを持つことができます。 ここでは、OCI コンソールから Data Guard を構成するまでの手順についてご紹介します。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. OCI上でのData Guard構成パターン 2. Data Guardを構成する為の前提条件 3. Data Guardの構成手順 4. Data Guardの切り替え 5. Data Guard構成に含まれるDBの削除方法 所要時間 : 約60分 1. OCI上でのData Guard構成パターン Oracle Cloud上でData Guardを利用する際の基本的な構成については、大きく分けて３つのパターンがあります。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs106-dataguard/",
        "teaser": "/ocitutorials/basedb/dbcs106-dataguard/dataguard08.png"
      },{
        "title": "107: BaseDBにAutonomous Recovery Service (RCV/ZRCV) をセットアップしよう",
        "excerpt":"はじめに Oracle Database Autonomous Recovery Service（以下、リカバリ・サービス）は、Oracle Cloud Infrastructure (OCI) で実行するOracle Database向けのフル・マネージド型データ保護サービスです。 オンプレミス製品のZero Data Loss Recovery Appliance (RA) のデータ保護技術をベースとしながら、クラウドならではの自動化機能も兼ね備えています。リカバリ・サービスはOracle Databaseの変更をリアルタイムで保護し、本番データベースのオーバーヘッドなしでバックアップを検証するほか、任意の時点への高速で予測可能なリカバリを実現します。 このチュートリアルでは、BaseDBにリカバリ・サービスを設定する手順についてご紹介します。 このチュートリアルを完了すると、以下のような構成図となります。 前提条件 : Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること Autonomous Recovery Service(RCV)を利用する場合、Oracle Database 19.16 以上 Zero Data Loss Autonomous Recovery Service (ZRCV) を利用する場合、Oracle Database 19.18 以上 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs107-zrcv/",
        "teaser": "/ocitutorials/basedb/dbcs107-zrcv/zrcv01.png"
      },{
        "title": "108:BaseDBのスタンバイ・データベースからバックアップを取得およびリストアしてみよう",
        "excerpt":"はじめに Data Guardは、Oracle Database自身が持つレプリケーション機能です。 プライマリDBの更新情報（REDOログ）をスタンバイDBに転送し、そのREDOログを使ってリカバリし続けることでプライマリDBと同じ状態を維持します。 Data Guard GroupもしくはData Guard Associationを使用している場合、Oracle Database Autonomous Recovery Service（RCV/ZRCV）およびOCI Object Storageをバックアップの保存先として、プライマリ・データベースだけでなくスタンバイ・データベースにも自動バックアップの設定をすることができます。 このチュートリアルではBase Database Service (BaseDB) のスタンバイ・データベースに自動バックアップを設定する方法を紹介します。 バックアップの取得先について 今回はOracle Database Autonomous Recovery Serviceを例として取り上げていますが、OCI Object Storageでも同様の手順で設定可能です。 前提条件 : 106: Data Guardを構成しようを通じてData Guard構成が完了していること Oracle Database Autonomous Recovery Service（RCV/ZRCV）およびOCI Object Storageを利用する上での事前準備が完了していること プライマリとスタンバイのバックアップの取得先は統一すること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. スタンバイ・データベースで自動バックアップを有効化しよう 2. スタンバイ・データベース・バックアップからのデータベースを作成しよう...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs108-dataguard-standby-bkup/",
        "teaser": "/ocitutorials/basedb/dbcs108-dataguard-standby-bkup/dbcs_dgsb13.png"
      },{
        "title": "109:BaseDBでZRCVの長期保管バックアップ（LTR）を作成してみよう",
        "excerpt":"はじめに Oracle Database Autonomous Recovery Service（以下、リカバリ・サービス）は、Oracle Cloud Infrastructure (OCI) で実行するOracle Database向けのフル・マネージド型データ保護サービスです。 BaseDBでは長期保管バックアップ機能（LTR）を利用してリカバリ・サービスをバックアップ保存先として、最大10年間バックアップを保存できます。 法規制や社内のビジネス・ルールにより、多くの組織では、特定の、通常は毎月のバックアップを何年にもわたって保持することが義務付けられていますが、LTRを利用することでコンプライアンス・バックアップが利用できるようになります。 このチュートリアルではBase Database Service (BaseDB) でOracle Database Autonomous Recovery Service（RCV/ZRCV）の長期保管バックアップ（LTR）を作成する方法を紹介します。 前提条件 : 107: BaseDBにAutonomous Recovery Service (RCV/ZRCV) をセットアップしよう を通じてリカバリ・サービスのセットアップが完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. 長期保存バックアップ（LTR）を作成してみよう 2. 長期バックアップ保持期間を変更してみよう 3. LTRを使用して新規データベースを作成してみよう 所要時間 : 約90分 1. 長期保存バックアップ　（LTR）を作成してみよう ナビゲーション・メニューから、「Oracle Database」&gt;「Oracleベースデータベース・サービス」をクリックします。 次にLTRを作成したいDBシステムの名前をクリックします。 次にLTRを作成したいデータベースを選択します。 「データベースの詳細」ページを下にスクロールし、「リソース」&gt;「バックアップ」を選択し、「バックアップの作成」をクリックします。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs109-ltr/",
        "teaser": "/ocitutorials/basedb/dbcs109-ltr/dbcs-ltr-teaser.png"
      },{
        "title": "201: オンプレミスのPDBをBaseDBに移動しよう",
        "excerpt":"はじめに Base Database Service (BaseDB)では、12c 以降のデータベースをプロビジョニングした場合、デフォルトでマルチテナント・コンテナ・データベース(CDB)で作成されます。 CDBで構成されているオンプレミスのデータベースからBaseDBへ移行する場合、PDBのアンプラグ・プラグを行う事で簡単に移行可能です。 その際、両データベースのバージョンに差異があった場合は autoupgrade等のツールを利用する事で、バージョンアップも行う事が可能です。 ここでは、オンプレミスのデータベース(19.12.0.0.0)からBaseDB(19.12.0.0.0)へPDBを移行する手順をご紹介します。 前提条件 : 移行元のデータベースがCDBで構成されていること Oracle CloudでOracle Databaseを使おう を通じて Oracle Database の作成が完了していること 目次 1. 移行元のデータベースからPDBをアンプラグする 2. BaseDBにPDBをプラグする 3. 表領域の暗号化を行う 所要時間 : 約1時間30分 1. 移行元のデータベースからPDBをアンプラグする まずは移行元のデータベースから、移行対象のPDBをアンプラグします。 アンプラグはDatabase Configuration Assistantツールを使って行う事も可能ですが、今回はコマンドでの実施手順を紹介します。 対象PDBの構成確認します PDBの移動にあたってデータファイルをBaseDBに持っていく必要があります。 まずは下記SELECT文にて対象PDBで使用しているデータファイルのディレクトリを確認します。 alter session set container=&lt;pdb_name&gt;; select tablespace_name, file_name from dba_data_files; （作業イメージ） 対象PDBをクローズします...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs201-pdb-plug/",
        "teaser": "/ocitutorials/basedb/dbcs201-pdb-plug/pdb-plug05.png"
      },{
        "title": "202:DBMS_CLOUDを使ってObject StorageのデータをBaseDBから参照しよう",
        "excerpt":"はじめに DBMS_CLOUDはオブジェクト・ストレージのデータを操作するための包括的なサポートを提供するPL/SQLパッケージです。 DBMS_CLOUDはAutonomous Database (ADB) に実装されているPL/SQLパッケージですが、手動インストールすることでBaseDBでも利用可能です。 ADBでDBMS_CLOUDを利用する方法は202: コマンドラインから大量データをロードしてみよう(DBMS_CLOUD)で学ぶことができます。 ここでは、DBMS_CLOUDパッケージを利用してObject StorageのデータをBase Database Service (BaseDB)から外部表として参照する手順をご紹介します。　　 このチュートリアルで実行する内容のイメージは以下の通りです。 前提条件 : Oracle Database 19.9以上 もしくは　Oracle Database 21.3以上 PDBにユーザーが作成されていて、そのユーザーに接続可能であること 101: Oracle Cloud で Oracle Database を使おう を通じて Oracle Database の作成が完了していること 以下にリンクされているサンプルデータのCSVファイルをダウンロードしていること サンプルデータファイルのダウンロードリンク その7 - オブジェクト・ストレージを使う を通じてバケットの作成・データファイル(CSV)のアップロードが完了していること 目次 1. 事前準備 2. DBMS_CLOUD PL/SQLパッケージのダウンロード 3. Walletの作成 4. Walletの場所の設定...","categories": [],
        "tags": [],
        "url": "/ocitutorials/basedb/dbcs202-dbms-cloud/",
        "teaser": "/ocitutorials/basedb/dbcs202-dbms-cloud/External-table.png"
      },{
        "title": "準備 - Oracle Cloud 無料トライアルを申し込む",
        "excerpt":"Oracle Cloud のほとんどのサービスが利用できるトライアル環境を取得することができます。このチュートリアルの内容を試すのに必要になりますので、まずは取得してみましょう。 ※認証のためにSMSが受け取れる電話とクレジット・カードが必要です(希望しない限り課金はされませんのでご安心を!!)      Oracle Cloud 無料トライアル サインアップガイド   Oracle Cloud Free Tierに関するFAQ  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/beginners/acquiring-free-trial/",
        "teaser": null
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス制限、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナンシと、アクセスのための有効なユーザーIDとパスワードがあること 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。 参考動画： 本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 1.コンソール 　 1. サポートされるブラウザの確認 このチュートリアルではOracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 2. ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナンシ名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID...","categories": [],
        "tags": ["beginner","network"],
        "url": "/ocitutorials/beginners/getting-started/",
        "teaser": "/ocitutorials/beginners/getting-started/img6.png"
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
        "excerpt":"チュートリアル一覧に戻る : 入門編 - Oracle Cloud Infrastructure を使ってみよう Oracle Cloud Infrastructureオブジェクト・ストレージ・サービスは、高い信頼性と高い費用対効果を両立するスケーラブルなクラウドストレージです。 オブジェクト・ストレージを利用すると、分析用のビッグ・データや、イメージやビデオ等のリッチ・メディア・コンテンツなど、あらゆるコンテンツ・タイプの非構造化データを無制限に保管できます。 オブジェクト・ストレージはリージョン単位のサービスで、コンピュート・インスタンスからは独立して動作します。 ユーザーはオブジェクト・ストレージのエンドポイントに対し、OCIの内部、外部を問わずどこからでもアクセスすることができます。 OCIのIdentity and Access Management(IAM)機能を利用した適切なアクセスコントロールや、リソース・リミットを設定することも可能です。 この章では、コンソール画面からオブジェクト・ストレージにアクセスし、スタンダード・バケットの作成やオブジェクトのアップロード、ダウンロードなどの基本的な操作、また事前認証リクエストを作成して一般ユーザー向けにダウンロードリンクを生成する手順について学習します。 所要時間 : 15分 前提条件 : 適切なコンパートメント(ルート・コンパートメントでもOKです)と、そこに対する適切なオブジェクト・ストレージの管理権限がユーザーに付与されていること 注意 : チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 参考動画：本チュートリアルの内容をベースとした定期ハンズオンWebinarの録画コンテンツです。操作の流れや解説を動画で確認したい方はご参照ください。 Oracle Cloud Infrastructure ハンズオン - 7.オブジェクト・ストレージ 1. コンソール画面の確認とバケットの作成 オブジェクト・ストレージ・サービスにおいて、バケットはオブジェクトを格納する箱として機能します。 バケットはコンパートメントに紐付ける必要があり、バケットおよびその中のオブジェクトに対する操作に関する権限は、コンパートメントのポリシーを通じて制御します。 まず、コンソール画面からバケットを作成していきます。 コンソールメニューから ストレージ → オブジェクト・ストレージとアーカイブ・ストレージ を選択し、バケットの作成 ボタンを押します 立ち上がった バケットの作成...","categories": [],
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
        "excerpt":"この文書は Oracle Blockchain Platform付属のChaincode開発・テスト・デプロイ補助ツールであるBlockchain App BuilderのVisual Studio Code拡張版について、ダウンロードとインストールの方法から、Chaincode仕様の作成方法やChaincodeコードの生成方法など、基本的な使い方を紹介するチュートリアルです。 この文書は、2023年12月時点での最新バージョン(Blockchain App Builder 23.4.1)を元に作成されています。 前提 : Oracle Blockchain Platform のインスタンス作成を完了 0. Blockchain App Builderとは Blockchain App BuilderはOracle Blockchain Platform（OBP）に付属するChaincode開発・テスト・デプロイの補助ツールです。 BABは以下の機能を備えており、Chaincode開発を容易にし、生産性を高めます。 YAML、JSONの形式で記述した仕様からChaincodeのコードを生成 ローカル環境に自動構築される最小限のHyperledger Fabricネットワークを用いて開発したChaincodeをテスト 生成したChaincodeのパッケージングとOBPへのデプロイ OBP上にデプロイしたChaincodeの実行 BABは以下ふたつの形態のツールとして提供されており、いずれも同等の機能を備えています。 コマンドラインツール Visual Studio Codeの拡張機能 この記事では、Visual Studio Codeの拡張版を前提に説明していきます。 1. Blockchain App Builderのインストール方法 Blockchain App Builder（Visual Studio Code拡張版）のインストールにあたっての必要な前提条件、インストーラのダウンロード方法、インストール方法について説明します。...","categories": [],
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
        "title": "OCI Container Instances をプロビジョニングしよう",
        "excerpt":"OCI Container Instances は、コンテナ用に最適化されたサーバレス・コンピューティングでアプリケーションを実行できます。OCIの管理コンソールからコンピュートシェイプ、リソース割り当て、ネットワーク構成をプロビジョニングして、複数のコンテナをローンチできます。Kubernetes をはじめとするコンテナ・オーケストレーション・プラットフォームを必要としないコンテナベースのワークロードに適したサービスです。 OCI Container Instances上でWordPress環境を構築して、実際にアプリケーションを動かす流れを体験します。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること ハンズオン環境のイメージ 1.OCI Container Instancesのプロビジョニング ここでは、OCI Container Instancesのプロビジョニングを行います。 ハンバーガーメニューをクリックしますし、開発者サービス-コンテナ・インスタンスを選択します。 コンテナ・インスタンスの作成ボタンをクリックします。 以下画像赤枠の箇所を変更します。それ以外はデフォルト値です。 「Name」：container-instance-wordpress ネットワーキングで新規仮想クラウド・ネットワークの作成を選択します。 ネットワーキングについて VCNを既に作成されている方は、既存VCNが選択されていることもあります。そちらをご利用頂いても構いません。 Networkingの下にある拡張オプションの表示をクリックします。 「Container restart policy」を以下の設定し、次ボタンをクリックします。 「コンテナ再起動ポリシー」：常時 WordPress のデータベースを構成する MySQL イメージを設定します。最初に、Name オプションをdbと入力します。そして、イメージの選択ボタンをクリックします。 「Name オプション」：db 外部レジストリタブを選択して、以下の設定を行い、イメージの選択ボタンをクリックします。 「Registry hostname」：docker.io 「Repository」：mysql 「Tag オプション」:8.0.23 イメージの選択ボタンをクリックします。 タブについて OCIコンテナ・レジストリは、OCI のコンテナレジストリ（OCIR）に格納されているイメージを設定できます。外部レジストリは、パブリックサービスなどのコンテナレジストリを設定できます。 ここでは、 Docker...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/ci-for-beginners/",
        "teaser": null
      },{
        "title": "Oracle Container Engine for Kubernetes(OKE)をプロビジョニングしよう",
        "excerpt":"マネージドKubernetesサービスであるOralce Container Engine for Kubernetes(OKE)を中心とした、コンテナ・ネイティブなサービス群です。 Oracle Container Engine for Kubernetes（以下OKE）は、OracleのマネージドKubernetesサービスです。この共通手順では、OCIやOKEを操作するためCLI実行環境の構築（Resource Managerを使用）と、OKEを使ってKubernetesクラスターをプロビジョニングするまでの手順を記します。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること ハンズオン環境のイメージ 1.OKEクラスターのプロビジョニング ここでは、OKEクラスターのプロビジョニングを行います。ここでの手順を実施することにより、OKEのコントロールプレーンとKubernetesクラスターの構築が同時に行われます。 はじめに、OCIコンソール画面左上のハンバーガーメニューを展開し、開発者サービス⇒Kubernetes Clusters (OKE)を選択します。 クラスタ一覧画面で、クラスタの作成をクリックします。 次のダイアログでクイック作成を選択し、送信をクリックします。 次のダイアログで、シェイプにVM.Standard.E5.Flexを選択、 ノード数に1を入力します。 他の値はデフォルトのままで問題ありません。 Kubernetes APIエンドポイントについて 管理者は、クラスタのKubernetes APIエンドポイントを、プライベート・サブネットまたはパブリック・サブネットに構成することができます。 VCNルーティングとファイアウォール・ルールを使うことで、Kubernetes APIエンドポイントへのアクセスを制御し、オンプレミスもしくは同一VCN上に構築した踏み台サーバからのみアクセス可能にすることができます。 Kubernetesワーカー・ノードについて プライベートかパブリックによって、ワーカーノードに付与されるIPアドレスの種類が変わります。 プライベートは、ワーカーノードがプライベートIPのみを付与された状態でプロビジョニングを行います。 ワーカーノードにパブリックIPを付与する必要がある場合は、パブリックを選択してください。 シェイプについて OKEでは、VM、ベアメタル、GPU、HPCなどの様々なシェイプをご利用頂くことができます。 また、プロセッサ・アーキテクチャとしても、Intel/AMD/ARMベースのインスタンスから選択頂くことができます。 ワークロードに応じて、適切なシェイプを選択してください。 ノード数について ノードはリージョン内の可用性ドメイン全体（または、東京リージョンなど単一可用性ドメインの場合、その可用性ドメイン内の障害ドメイン全体）に可能な限り均等に分散されます。 実運用の際は可用性を考慮し、適切なノード数を指定してください。 そして、ダイアログの下まで移動し次をクリックします。 次のダイアログは入力内容を確認し、「基本的なクラスタの確認」では、基本的なクラスタを作成にチェックを入れて、クラスタの作成をクリックします。 拡張クラスタについて 拡張クラスタは、基本クラスタで提供される機能に加えて、Virtual Nodes、アドオン機能、WorkloadIdentity、SLA等の機能を利用できます。クラスタごとに課金が発生します。 詳細はこちらを参照してください。 デフォルトの設定では、クラスタが必要とするネットワークリソース等の構成が自動的に行われます。途中経過がダイアログに表示されますので、全て完了したら、Closeボタンをクリックします。...","categories": [],
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
        "title": "OCI Functions ハンズオン",
        "excerpt":"OCI Functionsは、Oracleが提供するオープンソースのFaaSプラットフォームであるFn Projectのマネージドサービスです。 このエントリーでは、OCI Functions環境構築から動作確認までの手順を記します。 条件 クラウド環境 有効なOracle Cloudアカウントがあること Fn Projectハンズオンが完了していること(このハンズオンの理解を深めるため) 1.Cloud Shellのセットアップ 本ハンズオンではOKEクラスターを操作するいくつかのCLIを実行するための環境としてCloud Shellと呼ばれるサービスを使用します。 Cloud ShellはOracle CloudコンソールからアクセスできるWebブラウザベースのコンソールです。 Cloud Shellには、OCI CLIをはじめとして、次のようないくつかの便利なツールおよびユーティリティの現在のバージョンがインストールされています。 詳細は、公式ドキュメントの記載をご確認ください。 インストール済みツール Git Java Python (2および3) SQL Plus kubectl helm maven gradle terraform ansible fn Cloud Shellついて Cloud Shellは開発専用ではなく、一時的にOCIコマンドを実行したい場合などライトなご利用を想定したサービスであるため、実運用時はCLI実行環境を別途ご用意ください。 OCIコンソール上で右上にあるターミナルのアイコンをクリックします。 しばらく待つと、Cloud Shellが起動されます。　　 デフォルトでは、Cloud Shellが利用しているCPUアーキテクチャがARMである可能性があります。 今回は、X86_64を利用したいので、利用するCPUアーキテクチャを修正します。 Cloud Shellの左側にあるアーキテクチャをクリックします。 希望するアーキテクチャをX86_64に変更し、確認して再起動をクリックします。 インスタンスの再起動というダイアログが表示されたら、再起動をクリックします。...","categories": [],
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
        "title": "OCI Functionsを利用した仮想マシン (VM) のシェイプ変更",
        "excerpt":"このハンズオンでは、想定したメモリ使用率を超える仮想マシン (VM) のシェイプをOCI Functionsを利用して動的に変更する手順を記載します。 ハンズオン環境について このハンズオンでは、動作確認のために意図的にVMのメモリ使用率を上昇させるコマンドを使用します。そのため、商用環境などでは絶対に行わないでください。 また、使用する仮想マシン (VM) についてもテスト用として用意したものを使用するようにしてください。 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Fn Projectハンズオンが完了していること OCI Functionsハンズオンが完了していること このハンズオンが完了すると、以下のようなコンテンツが作成されます。 1.事前準備 このステップでは、OCI Functionsから仮想マシン (VM) を操作するための動的グループとポリシーの設定を行います。 動的グループおよびポリシーについて 動的グループを使用すると、Oracle Cloud Infrastructureコンピュータ・インスタンスを(ユーザー・グループと同様に)プリンシパルのアクターとしてグループ化し、ポリシーを作成できます。 そうすることで、インスタンスがOracle Cloud Infrastructureサービスに対してAPIコールを実行できるようにします。 詳細は動的グループの管理をご確認ください。 OCIコンソールのハンバーガーメニューをクリックして、アイデンティティとセキュリティ⇒ドメインに移動します。 Default をクリックします。 画面左にあるアイデンティティ・ドメインの動的グループをクリックします。 動的グループの作成をクリックします。 以下項目を入力して、「作成」をクリックします。 名前：動的グループの名前。今回は、func_dyn_grp 説明：動的グループの説明。今回は、Function Dynamic Group ルール1：ALL {resource.type = 'fnfunc', resource.compartment.id = '&lt;compartment-ocid&gt;'}(compartment.idは各自で使用するコンパートメントOCIDへ変更してください。) OCIコンソールのハンバーガーメニューをクリックして、アイデンティティとセキュリティ⇒ポリシーに移動します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/functions-vmshape-for-intermediates/",
        "teaser": null
      },{
        "title": "OCI API GatewayとOCI Functions を利用したデータベースアクセス",
        "excerpt":"このセッションでは、OCI Functions から python-oracledb ドライバを利用してATPに接続し、データを取得する方法について説明します。 そして、OCI API Gateway から OCI Functions にルーティングする方法について説明します。 このハンズオンが完了すると、以下のようなコンテンンツが出来上がります。 図：OCI API Gateway → OCI Functions → ATP のデータフロー 条件 クラウド環境 有効なOracle Cloudアカウントがあること 事前環境構築 Oracle Functionsハンズオンが完了していること Oracle Cloud Infrasturcture API Gateway + Oracle Functionsハンズオンが完了していること 1.事前準備 1-1.ATPのプロビジョニング OCIコンソールのハンバーガーメニューから[Oracle Database]で、[Autonomous Database]をクリックします。 Autonomous Databaseの作成画面で、コンパートメント名をクリックして、コンパートメントの選択リストを表示します。使用するコンパートメントを選択して、「フィルタの適用」をクリックします。 使用するコンパートメントを確認して、「Autonomous Databaseの作成」をクリックします。 以下項目を入力して、「作成」をクリックします。 表示名：表示名を入力。今回は、Workshop-ATP。 データベース名：今回は、WORKSHOPATP。 コンパートメント：使用するコンパートメントを選択。...","categories": [],
        "tags": ["OCI","API Gateway","OCI Functions","Autonomous Database","ATP","Python"],
        "url": "/ocitutorials/cloud-native/functions-apigateway-atp-for-beginners/",
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
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル Oracleでは、マイクロサービスの開発に適した軽量なJavaアプリケーションフレームワークとしてHelidonを開発しています。 Helidonは、SEとMPという2つのエディションがあります。 このチュートリアルでは、MicroProfile準拠のエディションであるMPの方を取り上げていきます。 MicroProfileについて MicroProfileは、マイクロサービス環境下で複数言語との相互連携を保ちながら、サービスを構築するために複数ベンダーによって策定されているJavaの標準仕様のことです。 詳細はこちらをご確認ください。 前提条件 こちらの手順が完了していること このチュートリアルでは、データベースとしてOracle Cloud Infrastructure上の自律型データベースであるAutonomous Transaction Processing(以降、ATPとします)を利用します こちらの手順が完了していること このチュートリアルでは、ATPに接続するためにクレデンシャル・ウォレットを利用します。事前にクレデンシャル・ウォレットをダウンロードしてください 実施する手順は1. クレデンシャル・ウォレットのダウンロードのみで問題ありません ハンズオン環境のVMイメージにOracle Linux Cloud Developer imageを利用すること Oracle Linux Cloud Developer imageには、このチュートリアルで利用するJDK 21とGitコマンドがインストールされています Helidonのビルドおよび動作環境について Helidon4.xをビルドおよび動作させるにはJDK 21以上が必要です。 事前準備 ここでは、このチュートリアルを実施するための事前準備を行います。 予め、Oracle Linux Cloud Developer imageでVMが作成されていることを前提とします。 Mavenのインストール アプリケーションのプロジェクト作成やビルドに必要なMavenコマンドをインストールします。 Mavenのバイナリをダウンロードします。 wget https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip ダウンロードしたバイナリを解凍します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/helidon-mp-for-beginners/",
        "teaser": null
      },{
        "title": "OCI Cacheを使ってみよう",
        "excerpt":"このチュートリアルでは、Oracleが提供するフルマネージドのRedisサービスであるOCI Cacheを、プロビジョニングから実際にredis-cliを用いて操作するところまでを体験していただけます。 1.前提条件 クラウド環境 Oracle Cloudのアカウント（Free Trial）を取得済みであること 2.OCI Cacheの作成 2-1. リージョンの設定 本チュートリアルでは、Cloud Shellを使用してOCI Cacheを操作します。Cloud ShellにはホームリージョンにあるVCN（Virtual Cloud Network）にアタッチする機能が備わっており、OCI CacheとCloud Shellを同じネットワークに配置するために、OCI CacheもホームリージョンのVCN内に作成します。 まずはリージョンをホームリージョンに設定します。画面右上のリージョン選択ボタンをクリックし、現在選択されているリージョンがホームリージョンであることを確認します。ホームリージョンでない場合は、ホームリージョンを選択してリージョンを変更します。 2-2. OCI Cacheの作成 画面左上のハンバーガーメニューから、「データベース」を選択し、「OCIキャッシュ」の中の「キャッシュ」を選択します。 OCIキャッシュのクラスタ画面が開いたら、クラスタの作成を選択します。 クラスタの作成に必要な設定を入力する画面が表示されます。 クラスタの構成ページでは、名前を編集します。任意の名前で問題ありませんが、ここではoci-cache-tutorialとします。名前の編集が完了したら、「次」を選択します。 ノードの構成のページが表示されます。ここはすべてデフォルト値のままで、「次」を選択します。 ネットワーキングの構成が表示されます。VCNの設定欄では、「新規仮想クラウド・ネットワーク名」を選択し、新規仮想クラウド・ネットワーク名を入力します。この名前は任意の名前で問題ありませんが、ここではvcn-oci-cacheとします。 サブネットの設定欄では、「新規パブリック・サブネットの作成」を選択し、新規パブリック・サブネットの作成の欄に、作成するサブネット名を入力します。この名前も任意の名前で問題ありませんが、ここではsubnet-oci-cacheとします。 すべて入力が完了したら、「次」を選択します。 確認および作成のページが表示されます。入力した値が正しく設定されているかを確認し、「クラスタの作成」を選択します。 クラスタの作成が開始されます。作成中は、状態がCreatingとなります。作成には数分かかります。 状態がActiveとなれば作成完了です。oci-cache-tutorialをクリックし、クラスタの詳細ページに移動しておきます。 以下の画面が表示されれば、この手順は完了です。 3.Redis-cliを使ったOCI Cacheの操作 ここからは、Cloud Shellを使って操作を行います。Cloud Shellは、OCIコンソール画面の右上のアイコンを選択し、「Cloud Shell」を選択します。 しばらく待つと、ターミナルが起動します。 3-1. redis-cliのダウンロード OCI Cacheは、redis-cliや、SDKを使って操作することができます。今回はredis-cliを使って操作するので、下記のコマンドでCloud Shellにredis-cliをダウンロードします（パスを通さずに直接実行するため、最後にバイナリファイルの場所に移動しています）。 wget http://download.redis.io/redis-stable.tar.gz...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/ocicache-for-beginners/",
        "teaser": null
      },{
        "title": "OCI Cacheを使ってレスポンス・キャッシングをしてみよう",
        "excerpt":"このチュートリアルでは、Oracleが提供するフルマネージドのRedisサービスであるOCI Cacheを使った、リクエストのキャッシングを体験していただけます。 1.前提条件 クラウド環境 Oracle Cloudのアカウント（Free Trial）を取得済みであること 2.概要 このチュートリアルでは、OCI Functionsに簡単なアプリケーションをデプロイし、そのAPIをAPI Gatewayで管理します。API Gatewayには「リクエストキャッシング」という機能があり、この機能を使うと、リクエストやレスポンスのデータを一時的に保存（キャッシング）できます。キャッシュにデータがあれば、それを使ってすぐに結果を返し、データがない場合にはアプリケーションから新たにデータを取得します。このキャッシュ機能には、OCI Cacheを使用します。 このチュートリアルで作成されるリソースは以下のようになります。 作成するリソースは、 VCN OCI Cache OCIR OCI Functions Vault API Gateway になります。ここから順にこれらのリソースを作成していきます。 3.必要なリソースの作成 3-1.VCNの作成 まずは今回のリソースを配置するVCN（仮想クラウドネットワーク）を作成します。OCIコンソールの左上のハンバーガーメニューから、「ネットワーキング」を選択し、「仮想クラウド・ネットワーク」を選択します。 今回は簡単にVCNを作成するため、「VCNウィザードの起動」を選択します。 VCNウィザードの起動ページで、「インターネット接続性を持つVCNの作成」が選択されていることを確認し、「VCNウィザードの起動」を選択します。 VCN名だけ任意の名前を入力して、後はデフォルトのまま作成します。ここではVCN名をcache-tutorialとします。 VCNの作成が完了したら、作成したVCNの詳細ページの左下にある、セキュリティ・リストを選択し、「Default Security List for xxx」を選択します。 「イングレスルールの追加」を選択します。 本チュートリアルではHTTPS通信を行うため、ポート443の通信を許可します。ソースCIDRにはすべてのIPを許可するために0.0.0.0/0を入力し、宛先ポート範囲は443とします。これらを入力したら、「イングレス・ルールの追加」を選択します。 以上でVCNの作成と準備は完了です。 3-2.OCI Cacheの作成 次に、OCI Cacheを作成します。画面左上のハンバーガーメニューから、「データベース」を選択し、「OCIキャッシュ」の中の「クラスタ」を選択します。 「クラスタの作成」を選択します。 任意の名前を入力して次に進みます。ここではcache-tutorialという名前にしています。 次に「ノード構成」のページが開きますが、ここはデフォルトで次に進みます。 「ネットワーキングの構成」ページでは、VCNは先ほど作成したVCNを選択し、サブネットはパブリックサブネットを選択します。 以降はすべてデフォルトのままクラスタの作成まで進めます。 クラスタの作成が完了したら、作成したクラスタの詳細ページからクラスタのエンドポイントを取得し、メモ帳等に控えておきます。 以上でOCI...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/ocicache-for-commons/",
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
        "title": "WebLogic Server for OCI(14.1.2)をプロビジョニングしてみよう",
        "excerpt":"本ハンズオンでは、以下の構成を作成します。 マーケットプレイスから環境を作成すると、VCN（仮想クラウド・ネットワーク）やロードバランサーが自動的に構成され、プライベートネットワーク上にWebLogicがインストールされたインスタンスが作成されます。また、外部からのアクセス用に踏み台サーバー（Bastion）とパブリックサブネットも自動的に作成されます。 今回はプロビジョニングした後、踏み台サーバーにWebLogic Remote Consoleをインストールして、WebLogicの管理サーバーへアクセスする手順を学習します。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること ハンズオンの全体像 WebLogic Server for OCI(UCM)環境を作成する 踏み台インスタンスにVNC Viewerでアクセスする 踏み台インスタンスにWebLogic Remote Consoleをインストールする WebLogic Remote Consoleで管理サーバーへアクセスする 事前準備 1. SSHキーペアを用意する 任意のSSHキーペアをご用意ください。 新たに作成する場合は、左上のハンバーガーメニューを展開して、「コンピュート」から「インスタンス」を選択し、「インスタンスの作成」をクリックします。 作成画面より、SSHキーの「秘密キー」と「公開キー」の両方をダウンロードし、利用します。 2. OCI VaultでSecretを作成する WebLogic Server for OCIでは、WebLogic作成時の管理用パスワードはOCI Vaultにて管理します。 左上のハンバーガーメニューを展開して、「アイデンティティとセキュリティ」から「ボールト」を選択します。 「ボールトの作成」をクリックします。 名前に「handson vault」と入力し、「ボールトの作成」をクリックします。 ボールトの作成には数分かかる場合があります。適宜ブラウザの更新を行ってください。 作成したボールト名をクリックし、「キーの作成」をクリックします。 名前に「handson key」と入力し、「キーの作成」をクリックします。 「シークレット」をクリックし、「シークレットの作成」をクリックします。 名前に「wlsadmin」と入力し、暗号化キーは「handson key」を選択し、シークレットコンテンツは「welcome1」と入力し、「シークレットの作成」をクリックします。 3. OCI IAMで権限の設定を行う(Optional)...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/wls-for-oci-1412-provisioning/",
        "teaser": null
      },{
        "title": "WebLogic Server for OCI(14.1.2)の基本的な操作を体験してみよう",
        "excerpt":"本ハンズオンではWebLogic for OCI(14.1.2)のサーバーの起動・停止、データソースの作成、サンプルアプリケーションのデプロイ、そしてロードバランサー経由での動作確認までの基本的な操作手順について学習します。 前提条件 クラウド環境 Oracle Cloudのアカウントを取得済みであること WebLogic Server for OCI(14.1.2)をプロビジョニングしてみようを実施済みであること 本ハンズオンではこちらで作成したWebLogic Server for OCI(14.1.2)の環境と踏み台インスタンスにインストールしたWebLogic Remote Consoleを利用して操作を行います。 ハンズオンの全体像 事前準備を行う(ADBの作成、sqlplusのインストールなど) WebLogicにデータソースの設定を行う WebLogicにアプリケーションをデプロイする Load Balancerからアプリケーションにアクセスする 事前準備 データベースをセットアップする 1. Autonomous Databaseをプロビジョニングする 左上のハンバーガーメニューを展開して、「Oracle Database」から「Autonomous Database」を選択します。 「Autonomous Databaseの作成」をクリックします。 Autonomous Database Serverlessの作成では以下のように入力・設定します。 Note: 特に記載のない部分に関してはデフォルトの値で構いません 上部の入力項目 項目 値 表示名 handson_db データベース名 handsonDB ワークロード・タイプ トランザクション処理 パスワード Welcome1234! パスワードの確認...","categories": [],
        "tags": [],
        "url": "/ocitutorials/cloud-native/wls-for-oci-1412-beginners/",
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
        "title": "その15: フォルダのサブスクライブ（Oracle Content Management のファイル共有機能を利用しよう）",
        "excerpt":"目次に戻る: Oracle Content Management のファイル共有機能を使ってみよう【初級編】 フォルダをサブスクライブすることで、指定フォルダに何らかの更新が発生した場合に、その通知を受けることができます。通知の受信方法は2種類あります 電子メール Slack (※サービス管理者により、Slack連携機能が有効化されている場合のみ選択可) 通知を受け取るイベントは、右上のユーザーアイコン→プリファレンス→通知→フォルダのサブスクリプションより選択できます。2023年7月時点では、以下のイベントを選択できます フォルダを名前変更、移動または削除する。 フォルダのメンバーシップを変更する。 フォルダまたはその内容の一部のパブリック・リンクを共有する。 フォルダへのフォルダまたはドキュメントの追加。 フォルダ内のドキュメントの名前変更、移動または削除。 フォルダ内のドキュメントの編集。 フォルダ内のドキュメントにコメントする。 サブスクライブ利用時の注意点 サブスクライブは下位階層に継承されます サブスクライブしたフォルダ配下の全てのフォルダおよびファイルが通知対象となります サブスクライブを実行したユーザー自身による操作は通知対象外です サブスクライブを実行したユーザーではない別のユーザーによる操作は通知対象です 【お知らせ】 この文書は、2023年7月時点での最新バージョン(23.7.1)を元に作成されてます。 チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります。 前提条件 OCMインスタンスが作成済であること(以下の作成手順参照) OCI IAM Identity Domain環境でOracle Content Managementインスタンスを作成する Oracle Content Management インスタンスを作成する OCMの利用ユーザーにOCMインスタンスのCECStandardUserもしくはCECEnterpriseUserアプリケーション・ロールが付与されていること OCI IAM Identity Domain環境でOracle Content Managementインスタンスの利用ユーザーを作成する Oracle Content Management インスタンスの利用ユーザーを作成するをご確認ください。 1. フォルダのサブスクライブによる通知を有効化する...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/15_folder_subscribe/",
        "teaser": "/ocitutorials/content-management/15_folder_subscribe/006.jpg"
      },{
        "title": "Oracle Content ManagementをHeadless CMSとして使ってみよう【初級編】",
        "excerpt":"この文書はOracle Content Management(OCM)のアセット管理機能をHeadless CMSとして利用する基本的な方法をステップ・バイ・ステップで紹介するチュートリアルです。 【お知らせ】 この文書は、2023年7月時点での最新バージョン(23.7.2)を元に作成されてます。 チュートリアル内の画面ショットについてはOracle Content Managementの現在のコンソール画面と異なっている場合があります。 前提条件 OCMインスタンスが作成済であること(以下の作成手順参照) OCI IAM Identity Domain環境でOracle Content Managementインスタンスを作成する Oracle Content Management インスタンスを作成する 少なくとも下記4つのOCMインスタンスのアプリケーション・ロールが付与された管理ユーザーを用意すること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、OCI IAM Identity Domain環境でOracle Content Managementインスタンスの利用ユーザーを作成するもしくはOracle Content Managementインスタンスの利用ユーザーを作成するをご確認ください。 1. アセット機能の利用準備 OCMのアセット管理機能を利用するための準備作業を行います。アセット・リポジトリ、公開チャネル、コンテンツ・タイプをそれぞれ作成し、関連付けを行います。 1.1 アセット・リポジトリを作成する リポジトリとは 「デジタル・アセット（画像、動画など）やコンテンツ・アイテム（ニュースやブログなどの構造化コンテンツ）を保管・管理する論理的な器」 です。リポジトリには「アセット・リポジトリ」と「ビジネス・リポジトリ」の2種類が存在し、目的や用途に応じて使い分けることができます。それぞれの特徴や利用できる機能の差異などは、以下ドキュメントをご確認ください 2 Understand Your Content Management Options (※日本語翻訳版)...","categories": [],
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
        "title": "Oracle Content ManagementをWebコンテンツ管理(WebCMS)として利用しよう【初級編】",
        "excerpt":"この文書はOracle Content Management(OCM)のサイト作成機能を利用し、Web サイトを作成・公開する方法をステップ・バイ・ステップで紹介するチュートリアル【初級編】です。また、サイト上で公開するコンテンツは、アセット管理機能で管理されるコンテンツ・アイテムを利用します 【お知らせ】 この文書は、2023年8月時点での最新バージョン(23.7.2)を元に作成されてます。 チュートリアル内の画面ショットについてはOracle Content Managementの現在のコンソール画面と異なっている場合があります。 前提条件 OCMインスタンスが作成済であること(以下の作成手順参照) OCI IAM Identity Domain環境でOracle Content Managementインスタンスを作成する Oracle Content Management インスタンスを作成する 少なくとも下記4つのOCMインスタンスのアプリケーション・ロールが付与された管理ユーザーを用意すること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、OCI IAM Identity Domain環境でOracle Content Managementインスタンスの利用ユーザーを作成するもしくはOracle Content Managementインスタンスの利用ユーザーを作成するをご確認ください。 Oracle Content ManagementをHeadless CMSとして使ってみよう【初級編】が完了していること 0. 説明 このチュートリアルでは、OCMのサイト機能を利用してWebサイトを作成・公開します。また、Webサイト上で公開するコンテンツは、以前のチュートリアルで作成したリポジトリ(Sample Content Repository)とコンテンツ・タイプ(sampleNewsType)を利用します。 作成するWebサイトは以下の通りです サイト名: firstSite 対応言語: 日本語(ja) サイトデザイン：OCMの事前定義済テンプレート(StarterTemplate)を利用...","categories": [],
        "tags": ["OCE","OCM"],
        "url": "/ocitutorials/content-management/62_webcms/",
        "teaser": "/ocitutorials/content-management/62_webcms/058.jpg"
      },{
        "title": "Oracle Content Managementのコンテンツ・レイアウトを編集しよう",
        "excerpt":"この文書はOracle Content Management(OCM)のコンテンツ・レイアウトの編集し、Web ページ上でのコンテンツ・アイテムの表示形式をカスタマイズする方法をステップ・バイ・ステップで紹介するチュートリアルです 【お知らせ】 この文書は、2023年8月時点での最新バージョン(23.7.2)を元に作成されてます。 チュートリアル内の画面ショットについてはOracle Content Managementの現在のコンソール画面と異なっている場合があります。 前提条件 OCMインスタンスが作成済であること(以下の作成手順参照) OCI IAM Identity Domain環境でOracle Content Managementインスタンスを作成する Oracle Content Management インスタンスを作成する OCM の利用ユーザーに、少なくとも下記4つのOCM インスタンスのアプリケーション・ロールが付与されていること CECContentAdministrator CECDeveloperUser CECEnterpriseUser CECRepositoryAdminisrrator [Memo] ユーザーの作成とアプリケーションロールの付与手順は、OCI IAM Identity Domain環境でOracle Content Managementインスタンスの利用ユーザーを作成するもしくはOracle Content Managementインスタンスの利用ユーザーを作成するをご確認ください。 以下2つのチュートリアルが完了していること Oracle Content Management を Headless CMS として使ってみよう【初級編】 Oracle Content Management を WebCMS...","categories": [],
        "tags": ["OCE","OCM"],
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
        "title": "101 : ExaDB-XSを使おう",
        "excerpt":"はじめに Oracle Exadata Database Service on Exascale Infrastructure (ExaDB-XS) は、Oracle Databaseが高い可用性を備えつつ高いパフォーマンスを発揮できるOracle Exadata Database Machine (Exadata)を、より低いエントリーコストでご利用いただけるサービスです。 ExaDB-XSは、Exadata Database Service on Dedicated Infrastructure (ExaDB-D)と同じ強力な自動化機能を使用して VM クラスタとデータベースを管理しますが、物理的なコンピュートとストレージはサービスから抽象化されます。VMクラスタとデータベースをデプロイするだけで、その上で実行されるオラクル管理のインフラストラクチャを意識する必要はありません。 この章では、ExaDB-XSのVMクラスタとデータベースの作成を行います。 前提条件 : VCNの作成 Oracle Cloud Infrastructure チュートリアル を参考に、仮想クラウド・ネットワーク(VCN)の作成が完了していること サービス制限の確認・引き上げのリクエスト ExaDB-XSを利用するには、まずサービス制限を引き上げる必要があります。サービス制限についてはもしもみなみんがDBをクラウドで動かしてみたら - 第16回 サービス制限についてを参照ください。 注意 チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります 目次 : 1. VMクラスタおよびデータベースの作成 2. DBシステムへのアクセス...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadb-xs/exadb-xs101-create-exadb-xs/",
        "teaser": "/ocitutorials/exadb-xs/exadb-xs101-create-exadb-xs/teaser.png"
      },{
        "title": "101 : ExaDB-Dを使おう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) は、Oracle Databaseが高い可用性を備えつつ高いパフォーマンスを発揮できるOracle Exadata Database Machine (Exadata)が利用可能なサービスです。同じようにOCI上でExadataを利用可能なサービスとしては、Autonomous Data WarehouseやAutonomous Transaction Processing などのAutonomous Databaseのサービスがありますが、ExaDB-D が他のサービスと大きく違うところは、全オプションが使える専有型のUser-Managedサービスであるということです。 専有型 : H/Wもユーザー専有となり、他のユーザーの環境と分離されるため、セキュリティ・性能を担保できます。 User-Managed サービス : OS以上は顧客管理。OS上の構築・運用・管理に有効な機能を、クラウドのツールでも提供。パッチ適用やメンテナンスの実施判断・作業タイミングは顧客判。OSログインが可能でこれまで同様の管理方法を用いることができる (OS権限が必要な変更作業、サード・パーティのAgentの導入、ローカルにログやダンプファイルの配置など)ので、別途インスタンスやストレージサービスを立てる必要はありません。 また、オンライン・スケーリング (停止なし)での1時間単位での柔軟な価格体系、デフォルトでの可用性構成や容易に高可用性構成が組めること、PaaSとしてのプロビジョニングや管理面などのメリットがあります。 目次 : 1. Exadata Infrastructureの作成 2. Exadata VMクラスタの作成 3. データベースの作成 4. DBシステムへのアクセス 5. データベース(PDB)へのアクセス 6. PDB上のスキーマへのアクセス...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d101-create-exadb-d/",
        "teaser": "/ocitutorials/exadbd/exadb-d101-create-exadb-d/teaser.png"
      },{
        "title": "102 : ExaDB-D上のPDBを管理しよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、Oracle Cloud Infrastructureの上で稼働するOracle DatabaseのPDBをOCIコンソールから停止したり、起動したり、既存PDBからクローンするなどの操作が簡単に行うことが可能です。この章では実際にどのように操作するのか確認していきます。 目次 : 1. PDBの起動・停止 2. PDBの新規作成 3. PDBクローンの作成 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること 所要時間 : 約1時間 1. PDBの起動・停止 OCIコンソール・メニューから Oracle Database → Oracle Public Cloud上のExadata に移動します。 利用したいコンパートメントをリスト範囲のコンパートメントから選択します。 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、リージョンの一覧から選択します。 操作したいPDBを持つExadata VMクラスタの表示名をクリックします。 データベースの一覧から対象のデータベースの名前をクリックします。 リソースの一覧からプラガブル・データベースをクリックします。 操作したいPDBの右側にある・・・メニューをクリックして、停止をクリックします。 確認画面が表示されたら、PDBの停止をクリックします。 操作したPDBの状態が更新中に変化します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d102-manage-pdb/",
        "teaser": "/ocitutorials/exadbd/exadb-d102-manage-pdb/teaser.png"
      },{
        "title": "103 : 自動バックアップを設定しよう",
        "excerpt":"はじめに サービスを利用していくにあたり、利用している環境のインスタンスやデータが壊れてしまった場合や、過去の時点にデータを戻したい場合など、何か起きた時のデータ復旧のためにバックアップやリカバリについての検討は重要です。 Oracle Databaseのバックアップ操作に対して次の3つのオプションが提供されます。ただし、これらのオプションの混在はサポートされていません。 オプション1：Oracle管理バックアップ 1回かぎりの構成に基づいて、ExaDB-Dによって完全に管理されます。完全に統合されたintoExaDB-DであるControl Planeに加えて、OCI APIを介してバックアップにアクセスすることもできます。Oracleではこちらのオプションをお薦めしています。 オプション2：ユーザ構成バックアップ お客様は、dbaascli database backupおよびdbaascli database recoverコマンドを使用してホストからバックアップを構成することができます。ただし、バックアップはControl Planeと同期されず、OCI APIと統合されません。また、バックアップに対する管理操作もライフサイクル操作は、サービス・コントロール・プレーン・コンソールからサポートされていません。 オプション3：RMANを使用したバックアップ お客様が所有するカスタマイズ・スクリプトとともにRMANを使用してバックアップを直接取得できます。RMANを使用してバックアップする場合は、バックアップ自動化からデータベースの登録を解除する必要があります。 以上のオプションについての詳細はバックアップおよびリカバリ操作を実行するためのOracle推奨オプションを参照してください。 Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、RMANを利用した自動バックアップ機能が利用可能で、リカバリも最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 ここでは、OCIコンソールから自動バックアップを構成するまでの手順についてご紹介します。 目次 : 1. 自動バックアップの前提条件を確認する 2. 自動バックアップの設定をしよう 3. 自動バックアップの設定を変更しよう 4. オンデマンド・バックアップを取得しよう 5. 取得したバックアップを確認しよう 前提条件 : 101 :...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d103-automatic-backup/",
        "teaser": "/ocitutorials/exadbd/exadb-d103-automatic-backup/teaser.png"
      },{
        "title": "104 : バックアップからリストアしよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、自動バックアップ機能やオンデマンドバックアップにて取得したバックアップを利用する事で、最新時点やPoint in Time Recovery(PITR)の任意の時点まで復旧ができます。 また、バックアップ元のデータベースに対してリストアするだけでなく、別DBシステム上にリストアする事も可能です。 ここでは、OCI コンソールからリストアする手順についてご紹介します。 目次 : 1. バックアップ元のデータベースに対してリストア 2. バックアップから新規データベースとしてリストア 3. オンデマンド・バックアップを使用したリストア 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること 103 : 自動バックアップを設定しようを通じてバックアップを取得していること 所要時間 : 約1時間　※環境によって異なるため、参考値です 1. バックアップ元のデータベースに対してリストア まずはバックアップ元のデータベースに対してリストアしてみましょう。 リストア方法には下記3つがありますので、リストアしたい地点に応じてどのリストア方法を利用するか検討してください。 最新にリストア データ損失の可能性が最も低い、直近の正常な状態にデータベースをリストアします。 タイムスタンプにリストア 指定した日時にデータベースをリストアします。 SCNにリストア SCNを使用してデータベースをリストアします。 有効なSCNを指定する必要がありますので、データベース・ホストにアクセスして問い合せるか、オンラインまたはアーカイブ・ログにアクセスして使用するSCN番号を確認してください。 OCIコンソール・メニューから Oracle...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d104-backup-restore/",
        "teaser": "/ocitutorials/exadbd/exadb-d104-backup-restore/teaser.png"
      },{
        "title": "105 : スケーリングしよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) のスケーリングの対象は、2種類あります。１つは、割り当てられているH/Wリソース内で利用可能な、OCPU数のスケール・アップ/ダウン。データベースや仮想マシンを再起動することなく、処理を継続したままオンラインで変更可能です。また、VMクラスタ全体に対しての変更になります。そのため、例えばノード毎にCPUコア数を変えることはできないので、仮想マシン数の倍数が指定可能になります。もう１つは、インフラストラクチャー部分のデータベース・サーバーとストレージ・サーバーのスケール・アップ(ダウンは不可)。こちらは、X8M以降のモデルで可能で、CPU・メモリ・ストレージなどH/W的に割り当てられている専有リソースを増やしたい場合に、オンラインで追加が可能です。 目次 : 1. OCPUのスケーリング 2. CLIでのOCPUのスケーリング 3. インフラストラクチャのスケーリング データベース・サーバーの追加 ストレージ・サーバーの追加 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること Oracle Cloud Infrastructure Documentation &gt; コマンド・ライン・インターフェース &gt; クイックスタートを通じてOCI CLIのセットアップが完了していること 所要時間 : 約6時間（待ち時間を含む）※環境によって異なるため、参考値です 1. OCPUのスケーリング まずはコンソール上の操作でのOCPUスケーリングからです。 OCIコンソール・メニューから Oracle Database → Oracle Public Cloud上のExadata に移動します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d105-scaling/",
        "teaser": "/ocitutorials/exadbd/exadb-d_dataguard-standby-bkup-teaser.png"
      },{
        "title": "106 : データベースのバージョンを指定しよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、VMクラスタ上で作成するデータベースのバージョンを指定したり、ユーザーの個別の用途や要求に合わせるようにカスタム・イメージを作成して指定することを簡単に行うことが可能です。この章ではデータベース・ホームおよびカスタム・イメージの作成方法について紹介します。 目次 : 1. データベース・ホームの作成 2. カスタム・イメージを使用したデータベース・ホームの作成 カスタム・イメージの作成 データベース・ホームの作成 3. 確認作業 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること 所要時間 : 約30分　※環境によって異なるため、参考値です。 1. データベース・ホームの作成 OCIコンソール・メニューから Oracle Database → Oracle Public Cloud上のExadata に移動します。 利用したいコンパートメントをリスト範囲のコンパートメントから選択します。 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、リージョンの一覧から選択します。 操作したいExadata VMクラスタの表示名をクリックします。 リソースの一覧からデータベース・ホームをクリックします。 データベース・ホームの作成をクリックします。 データベース・ホームの作成ダイアログで以下の操作を行います。 データベース・ホームの表示名に任意の名前を入力します。 データベース・イメージの変更をクリックします。 イメージ・タイプはOracle...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d106-dbversion/",
        "teaser": "/ocitutorials/exadbd/exadb-d106-dbversion/teaser.png"
      },{
        "title": "107 : パッチを適用しよう",
        "excerpt":"はじめに Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) では、OS以上がユーザー管理となるため、OS以上のOS、Grid Infrastructure、Database、そしてPaaSサービスの管理のためのクラウド・ツールに対するパッチ適用は、ユーザー側でパッチ適用の計画と適用実施が可能です。ここでは、それぞれのパッチ適用方法についてご紹介します。 目次 : 1. Grid Infrastructure(GI)のパッチ適用 2. データベースのパッチ適用 Out-of-place Patching In-place Patching 3. クラウド・ツール(dbaascli)のパッチ適用 4. OSのパッチ適用 前提条件 : 101 : ExaDB-Dを使おうを通じてExaDB-Dの作成が完了していること 104 : バックアップからリストアしようを通じてデータベースのバックアップが完了していること 所要時間 : 約2時間　※環境によって異なるため、参考値です。 1. Grid Infrastructure(GI)のパッチ適用 OCIコンソール・メニューから Oracle Database → Oracle Exadata Database Service...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d107-patch/",
        "teaser": "/ocitutorials/exadbd/exadb-d107-patch/teaser.png"
      },{
        "title": "108 : Data Guardを構成しよう",
        "excerpt":"はじめに Oracle Data Guardとは、変更履歴(REDO)を利用して自動でリアルタイム・データベース複製を持つことが出来る機能です。この機能を利用することによって、データベース障害やリージョン障害などのRTO/RPOを短くすることができ、広範囲な計画停止(メンテナンス)においてもスタンバイをプライマリに切り替えることによって停止時間を極小化することが可能です。バックアップを取得していても、有事の際の復旧において、大量データのリストアが必要になる場合ではRTOを満たせないケースもあります。こういったケースに備えて、バックアップだけでなく、すぐに切り替えられるスタンバイを持つことは重要です。災害対策(DR)としてのデータ保護はもちろんのこと、移行やアップグレードの停止時間短縮といった利用用途もあります。また、参照専用として利用可能なActive Data Guardにしたり、一時的に読み書き可能なスナップショット・スタンバイとして利用したりと、普段から利用できるスタンバイ・データベースを持つことができます。参照処理をオフロードしたり、この仕組みを応用してデータ破損が検知された場合にクライアントにエラーを返すことなく自動修復をしてくれる自動メディア・ブロックリカバリ機能も使えるため、Data Guardであればスタンバイのリソースも有効活用してROIを高めつつ、きちんと切り替えられるスタンバイを持つということが可能です。 ここでは、OCIコンソールからExaDB-Dで別リージョン間(東京、大阪)でのData Guardを構成する手順について紹介します。東京をプライマリ、大阪をスタンバイとして構成します。使用するリージョンは任意です。 目次 : 1. Data Guardの構成 2. Data Guardの切り替え スイッチオーバー フェイルオーバー 回復 3. Data Guard構成に含まれるDBの削除方法 前提条件 : 101 : ExaDB-Dを使おうを通じて、プライマリ・データベースのリージョン（本ガイドでは東京リージョン）でExaDB-Dの作成が完了していること。 その2 - クラウドに仮想ネットワーク(VCN)を作るを通じて、スタンバイ・データベースのリージョン（本ガイドでは大阪リージョン）でVCNの作成が完了していること。 プライマリ・データベースのリージョン（本ガイドでは東京リージョン）とスタンバイ・データベースのリージョン（本ガイドでは大阪リージョン）間でリモートVCNピアリングの設定が完了していること。設定方法については、Oracle Cloud Infrasturctureドキュメント - DRGを介した異なるリージョン内のVCNのピアリングをご参照ください。 プライマリ・データベースのリージョン（本ガイドでは東京リージョン）とスタンバイ・データベースのリージョン（本ガイドでは大阪リージョン）のそれぞれのVCNのセキュリティ・リストの設定でポート1521を開く。設定方法については、Oracle Cloud Infrastructureドキュメント - セキュリティ・リストをご参照ください。 所要時間 : 約2時間　※環境によって異なるため、参考値です。 1. Data Guardの構成 OCIコンソール・メニューから Oracle Database...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d108-dataguard/",
        "teaser": "/ocitutorials/exadbd/exadb-d108-dataguard/teaser.png"
      },{
        "title": "109 : ExaDB-DでAutonomous Recovery Service (RCV/ZRCV) をセットアップしよう",
        "excerpt":"はじめに Oracle Database Autonomous Recovery Service（以下、リカバリ・サービス）は、Oracle Cloud Infrastructure (OCI) で実行するOracle Database向けのフル・マネージド型データ保護サービスです。 オンプレミス製品のZero Data Loss Recovery Appliance (RA) のデータ保護技術をベースとしながら、クラウドならではの自動化機能も兼ね備えています。リカバリ・サービスはOracle Databaseの変更をリアルタイムで保護し、本番データベースのオーバーヘッドなしでバックアップを検証するほか、任意の時点への高速で予測可能なリカバリを実現します。 このチュートリアルでは、ExaDB-Dにリカバリ・サービスを設定する手順についてご紹介します。 このチュートリアルを完了すると、以下のような構成図となります。 前提条件 : 101：ExaDB-Dを使おう を通じて Oracle Database の作成が完了していること Autonomous Recovery Service(RCV)を利用する場合、Oracle Database 19.16 以上 Zero Data Loss Autonomous Recovery Service (ZRCV) を利用する場合、Oracle Database 19.18 以上 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. サービス制限の引き上げリクエスト...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d109-zrcv/",
        "teaser": "/ocitutorials/exadbd/exadb-d109-zrcv/ExaDB-D_zrcv01.png"
      },{
        "title": "110:ExaDB-Dのスタンバイ・データベースからバックアップを取得およびリストアしてみよう",
        "excerpt":"はじめに Data Guardは、Oracle Database自身が持つレプリケーション機能です。 プライマリDBの更新情報（REDOログ）をスタンバイDBに転送し、そのREDOログを使ってリカバリし続けることでプライマリDBと同じ状態を維持します。 Data Guard GroupもしくはData Guard Associationを使用している場合、Oracle Database Autonomous Recovery Service（RCV/ZRCV）およびOCI Object Storageをバックアップの保存先として、プライマリ・データベースだけでなくスタンバイ・データベースにも自動バックアップの設定をすることができます。 このチュートリアルではExadata Database Service on Dedicated Infrastructure (ExaDB-D) のスタンバイ・データベースに自動バックアップを設定する方法を紹介します。 バックアップの取得先について 今回はOracle Database Autonomous Recovery Serviceを例として取り上げていますが、OCI Object Storageでも同様の手順で設定可能です。 前提条件 : 108 : Data Guardを構成しよう を通じてData Guard構成が完了していること Oracle Database Autonomous Recovery Service（RCV/ZRCV）およびOCI Object Storageを利用する上での事前準備が完了していること プライマリとスタンバイのバックアップの取得先は統一すること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d110-dataguard-standby-bkup/",
        "teaser": "/ocitutorials/exadbd/exadb-d110-dataguard-standby-bkup/teaser.png"
      },{
        "title": "111:ExaDB-DでZRCVの長期保管バックアップ（LTR）を作成してみよう",
        "excerpt":"はじめに Oracle Database Autonomous Recovery Service（以下、リカバリ・サービス）は、Oracle Cloud Infrastructure (OCI) で実行するOracle Database向けのフル・マネージド型データ保護サービスです。 ExaDB-Dでは長期保管バックアップ機能（LTR）を利用してリカバリ・サービスをバックアップ保存先として、最大10年間バックアップを保存できます。　 法規制や社内のビジネス・ルールにより、多くの組織では、特定の、通常は毎月のバックアップを何年にもわたって保持することが義務付けられていますが、LTRを利用することでコンプライアンス・バックアップが利用できるようになります。 このチュートリアルではExadata Database Service on Dedicated Infrastructure (ExaDB-D) でOracle Database Autonomous Recovery Service（RCV/ZRCV）の長期保管バックアップ（LTR）を作成する方法を紹介します。 前提条件 : 109 : ExaDB-DでAutonomous Recovery Service (RCV/ZRCV) をセットアップしよう を通じてリカバリ・サービスのセットアップが完了していること 注意 チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。 目次 1. 長期保存バックアップ（LTR）を作成してみよう 2. 長期バックアップ保持期間を変更してみよう 3. LTRを使用して新規データベースを作成してみよう 所要時間 : 約90分 1. 長期保存バックアップ　（LTR）を作成してみよう まず、ナビケーションメニューから、「Oracle...","categories": [],
        "tags": [],
        "url": "/ocitutorials/exadbd/exadb-d111-ltr/",
        "teaser": "/ocitutorials/exadbd/exadb-d111-ltr/exadb-d-ltr-teaser.png"
      },{
        "title": "HPCクラスタを構築する(基礎インフラ手動構築編)",
        "excerpt":"0. 概要 このチュートリアルは、HPCワークロードの実行に最適な、 Intel Ice Lake プロセッサを搭載する BM.Optimized3.36 を クラスタ・ネットワーク でノード間接続するHPCクラスタを構築し、そのインターコネクト性能を Intel MPI Benchmarks で検証します。 このチュートリアルで作成する環境は、ユーザ管理、ホスト名管理、ファイル共有ストレージ、プログラム開発環境、ジョブスケジューラ等、必要なソフトウェア環境をこの上に整備し、ご自身の要件に沿ったHPCクラスタを構築する際の基礎インフラストラクチャとして利用することが可能です。 なお、これらのクラスタ管理に必要なソフトウェアの導入までを自動化する HPCクラスタスタック も利用可能で、詳細は OCI HPCチュートリアル集 の HPCクラスタを構築する(スタティッククラスタ自動構築編) を参照ください。 またこのチュートリアルは、環境構築後により大規模な計算を実施する必要が生じたり、メンテナンスによりノードを入れ替える必要が生じることを想定し、既存の クラスタ・ネットワーク に計算ノードを追加する方法と、特定の計算ノードを入れ替える方法も学習します。 所要時間 : 約2時間 前提条件 : クラスタ・ネットワーク を収容する コンパートメント ( ルート・コンパートメント でもOKです)の作成と、この コンパートメント に対する必要なリソース管理権限がユーザーに付与されていること。 注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 1. HPCクラスタ作成事前作業 1-0. 概要 本章は、計算ノードをTCP接続する 仮想クラウド・ネットワーク と、インターネットから直接アクセス出来ないプライベートサブネットに接続する計算ノードにログインする際の踏み台となるBastionノードを、HPCクラスタ作成前に予め用意します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-cluster-network/",
        "teaser": "/ocitutorials/hpc/spinup-cluster-network/architecture_diagram.png"
      },{
        "title": "HPCクラスタを構築する(基礎インフラ自動構築編)",
        "excerpt":"このチュートリアルは、HPCクラスタの計算ノードに最適なベアメタルインスタンス（本チュートリアルでは BM.Optimized3.36 を使用）を クラスタ・ネットワーク でノード間接続する、HPCワークロードを実行するためのHPCクラスタを構築する際のベースとなるインフラストラクチャを、予め用意された Terraform スクリプトを活用して自動構築し、そのインターコネクト性能を検証します。 この自動構築は、 Terraform スクリプトを リソース・マネージャ に読み込ませて作成する スタック を使用する方法と、 Terraform 実行環境を用意して Terraform CLIを使用する方法から選択することが出来ます。 このチュートリアルで作成する環境は、ユーザ管理、ホスト名管理、ファイル共有ストレージ、プログラム開発環境、ジョブスケジューラ等、必要なソフトウェア環境をこの上に整備し、ご自身の要件に沿ったHPCクラスタを構築する際の基礎インフラストラクチャとして利用することが可能です。 なお、これらのクラスタ管理に必要なソフトウェアの導入までを自動化する HPCクラスタスタック も利用可能で、詳細は OCI HPCチュートリアル集 の HPCクラスタを構築する(スタティッククラスタ自動構築編) を参照してください。 本チュートリアルで作成するHPCクラスタ構築用の Terraform スクリプトは、そのひな型が GitHub のパブリックレポジトリから公開されており、適用すると以下の処理を行います。 VCNと関連するネットワークリソース構築 Bastionノード構築 計算ノード用 インスタンス構成 作成 クラスタ・ネットワーク と計算ノード構築 HPCクラスタ内のノード間SSHアクセスに使用するSSH鍵ペア作成・配布 計算ノードの全ホスト名を記載したホストリストファイル（ /home/opc/hostlist.txt ）作成 構築したBastionノード・計算ノードのホスト名・IPアドレス出力 Bastionノードは、接続するサブネットをパブリックとプライベートから選択することが可能（※1）で、以下のBastionノードへのログイン方法に合わせて選択します。 インターネット経由ログイン -&gt; パブリックサブネット接続 拠点間接続経由ログイン -&gt;...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-hpc-cluster-withterraform/",
        "teaser": "/ocitutorials/hpc/spinup-hpc-cluster-withterraform/architecture_diagram.png"
      },{
        "title": "HPCクラスタを構築する(スタティッククラスタ自動構築編)",
        "excerpt":"Oracle Cloud Infrastructure（以降OCIと記載）は、仮想化オーバーヘッドの無いHPC用途に特化したベアメタルシェイプと、これらを高速・低遅延で接続するインターコネクトネットワークサービスの クラスタ・ネットワーク を提供しており、HPCワークロードを実行するHPCクラスタを構築するには最適なクラウドサービスです。 このチュートリアルは、 マーケットプレイス から無償で利用可能な HPCクラスタスタック を利用し、以下構成の典型的なHPCクラスタを構築します。 計算ノード： HPCワークロード向けIntel Ice Lakeプロセッサ搭載ベアメタルシェイプの BM.Optimized3.36 インターコネクトネットワーク: クラスタ・ネットワーク （ノード当たり100 Gbps x 1） インターネットからSSH接続可能なBastionノード OS: Oracle Linux 8.8 ジョブスケジューラ: Slurm クラスタ内ホームディレクトリ共有： ファイル・ストレージ クラスタ内ユーザ統合管理： LDAP またこのチュートリアルでは、構築したHPCクラスタに対して以下を実施し、その手順を解説します。 Intel MPI Benchmark によるインターコネクト性能確認 クラスタ構築後のワークロード増加を想定した計算ノード追加 ハードウェア障害の発生を想定した特定計算ノードの入れ替え 本チュートリアルで使用する HPCクラスタスタック は、通常であれば数日かかるHPCクラスタ構築作業を、OCIコンソールのGUIから10項目程度のメニューを選択するだけで実施することを可能にします。 所要時間 : 約1時間 前提条件 : HPCクラスタを収容する コンパートメント (...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-hpc-cluster/",
        "teaser": "/ocitutorials/hpc/spinup-hpc-cluster/architecture_diagram.png"
      },{
        "title": "HPCクラスタを構築する(オンデマンドクラスタ自動構築編)",
        "excerpt":"Oracle Cloud Infrastructure（以降OCIと記載）は、仮想化オーバーヘッドの無いHPC用途に特化したベアメタルシェイプと、これらを高帯域・低遅延で接続するインターコネクトネットワークサービスの クラスタ・ネットワーク を提供しており、HPCワークロードを実行するHPCクラスタを構築するには最適なクラウドサービスです。 このチュートリアルは、 マーケットプレイス から無償で利用可能な HPCクラスタスタック を利用し、以下構成のオンデマンドHPCクラスタを構築します。 計算ノード： BM.Optimized3.36 （Intel Ice Lakeプロセッサ搭載ベアメタルシェイプ） インターコネクトネットワーク: クラスタ・ネットワーク （ノード当たり100 Gbps x 1） インターネットからSSH接続可能なBastionノード OS: Oracle Linux 8.8 ジョブスケジューラ: Slurm オンデマンドクラスタ機能： クラスタオートスケーリング クラスタ内ホームディレクトリ共有： ファイル・ストレージ クラスタ内ユーザ統合管理： LDAP またこのチュートリアルは、デプロイしたHPCクラスタのインターコネクト性能を Intel MPI Benchmark で確認します。 オンデマンドHPCクラスタにおけるワークロード実行は、 Slurm にジョブを投入することで行い、 クラスタオートスケーリング がジョブ実行に必要な計算ノードを クラスタ・ネットワーク と共に動的にデプロイし、構築されたクラスタに Slurm がジョブをディスパッチします。 また クラスタオートスケーリング...","categories": [],
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
        "title": "GPUインスタンスで分散機械学習環境を構築する",
        "excerpt":"0. 概要 本チュートリアルは、OCIコンソールから必要なリソースを順次デプロイしてソフトウェア環境を手動で構築する方法で、 containerd と NVIDIA Container Toolkit を使用する分散機械学習に対応するコンテナ実行環境を複数のNVIDIA GPUを搭載するGPUインスタンス（以降”GPUノード”と呼称します。）上に構築、複数GPUに跨るGPU間の通信性能を NCCL（NVIDIA Collective Communication Library） の通信性能計測プログラム NCCL Tests で検証します。 本チュートリアルで構築する分散機械学習環境の構成を以下に示します。 [GPUノード] シェイプ： BM.GPU3.8 / BM.GPU4.8 / BM.GPU.A100-v2.8 OS： プラットフォーム・イメージ Oracle-Linux-8.10-Gen2-GPU-2025.02.28-0 [Bastionノード] シェイプ ： VM.Standard.E5.Flex OS ： プラットフォーム・イメージ Oracle-Linux-8.10-2025.02.28-0 [機械学習環境ソフトウェア] コンテナランタイム ： containerd 2.0.3 NVIDIA Container Toolkit ： 1.17.5 所要時間 : 約2時間...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-ml-instance-cntnd/",
        "teaser": "/ocitutorials/hpc/spinup-ml-instance-cntnd/architecture_diagram.png"
      },{
        "title": "GPUクラスタを構築する(基礎インフラ手動構築編)",
        "excerpt":"0. 概要 本チュートリアルは、OCIコンソールから必要なリソースを順次OCI上にデプロイしてその上でソフトウェア環境を手動で構築する方法で、 Docker Community Edition と NVIDIA Container Toolkit を使用する分散機械学習に対応するコンテナ実行環境をGPUクラスタ上に構築、複数ノードに跨るGPU間の通信性能を NCCL（NVIDIA Collective Communication Library） の通信性能計測プログラム NCCL Tests で検証後、分散機械学習の稼働確認として TensorFlow の MultiWorkerMirroredStrategy を使用するサンプルプログラムを実行、その性能を検証します。 本チュートリアルで構築するGPUクラスタの構成を以下に示します。 [GPUノード] シェイプ ： BM.GPU4.8/BM.GPU.A100-v2.8 インターコネクト ： クラスタ・ネットワーク OS ： Oracle Linux 8.9ベースのGPU クラスタネットワーキングイメージ （※1） [Bastionノード] シェイプ ： VM.Standard.E4.Flex OS ： Oracle Linux 8.9 [ソフトウェア] コンテナランタイム ：...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-gpu-cluster/",
        "teaser": "/ocitutorials/hpc/spinup-gpu-cluster/architecture_diagram.png"
      },{
        "title": "GPUクラスタを構築する(基礎インフラ自動構築編)",
        "excerpt":"このチュートリアルは、GPUクラスタのGPUノードに最適なベアメタルインスタンス（本チュートリアルでは BM.GPU4.8 を使用）を クラスタ・ネットワーク でノード間接続する、機械学習ワークロードを実行するためのGPUクラスタを構築する際のベースとなるインフラストラクチャを、予め用意された Terraform スクリプトを活用して自動構築し、Dockerコンテナ上で NCCL（NVIDIA Collective Communication Library） のGPU間通信性能を NCCL Tests で検証します。 この自動構築は、 Terraform スクリプトを リソース・マネージャ に読み込ませて作成する スタック を使用する方法と、 Terraform 実行環境を用意して Terraform CLIを使用する方法から選択することが出来ます。 このチュートリアルで作成する環境は、ユーザ管理、ホスト名管理、共有ファイルシステム、プログラム開発環境等、必要なソフトウェア環境をこの上に整備し、ご自身の要件に沿ったGPUクラスタを構築する際の基礎インフラストラクチャとして利用することが可能です。 なお、これらのクラスタ管理に必要なソフトウェアの導入までを自動化する HPCクラスタスタック も利用可能で、詳細は GPUクラスタを構築する(スタティッククラスタ自動構築編) を参照してください。 本チュートリアルで作成するGPUクラスタ構築用の Terraform スクリプトは、そのひな型が GitHub のパブリックレポジトリから公開されており、適用すると以下の処理を行います。 VCNと関連するネットワークリソース構築 Bastionノード構築 GPUノード用 インスタンス構成 作成 クラスタ・ネットワーク とGPUノード構築 GPUクラスタ内のノード間SSHアクセスに使用するSSH鍵ペア作成・配布 GPUノードの全ホスト名を記載したホストリストファイル（ /home/opc/hostlist.txt ）作成 構築したBastionノード・GPUノードのホスト名・IPアドレス出力 Bastionノードは、接続するサブネットをパブリックとプライベートから選択することが可能（※1）で、以下のBastionノードへのログイン方法に合わせて選択します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-gpu-cluster-withterraform/",
        "teaser": "/ocitutorials/hpc/spinup-hpc-cluster-withterraform/architecture_diagram.png"
      },{
        "title": "GPUクラスタを構築する(スタティッククラスタ自動構築編)",
        "excerpt":"0. 概要 本チュートリアルは、 マーケットプレイス から無償で利用可能な HPCクラスタスタック を利用し、以下構成のGPUクラスタを構築、複数ノードに跨るGPU間の通信性能を NCCL（NVIDIA Collective Communication Library） の通信性能計測プログラム NCCL Tests で検証後、分散機械学習のサンプルプログラムを実行します。 [GPUノード] シェイプ ： BM.GPU4.8/BM.GPU.A100-v2.8 インターコネクト ： クラスタ・ネットワーク OS ： Oracle Linux 8.9ベースのGPU クラスタネットワーキングイメージ （※1） [Bastionノード] シェイプ ： VM.Standard.E4.Flex OS ： Oracle Linux 8.9ベースのGPU クラスタネットワーキングイメージ （※1） [ソフトウェア] コンテナランタイム ： Enroot ジョブスケジューラ ： Slurm + Pyxis コンテナ...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-gpu-cluster-withstack/",
        "teaser": "/ocitutorials/hpc/spinup-gpu-cluster-withstack/architecture_diagram.png"
      },{
        "title": "GPUクラスタを構築する(オンデマンドクラスタ自動構築編)",
        "excerpt":"Oracle Cloud Infrastructure（以降OCIと記載）は、8枚の NVIDIA A100 40/80 GBと総帯域幅1.6 Tbps（100 Gbps x 16）のRDMA対応ネットワークインタフェースを搭載するベアメタルGPUシェイプ BM.GPU4.8/BM.GPU.GM4.8 とこれらを接続する クラスタ・ネットワーク を提供しており、1ノードには搭載しきれない多数のGPUを必要とする大規模なAIや機械学習のワークロードを実行するGPUクラスタを構築するには最適なクラウドサービスです。 このチュートリアルは、 マーケットプレイス から無償で利用可能な HPCクラスタスタック を利用し、以下構成のオンデマンドGPUクラスタを構築します。 NVIDIA A100 40 GBを8枚搭載するGPUノード（ BM.GPU4.8 ） インターコネクト: クラスタ・ネットワーク （ノード当たり100 Gbps x 16） インターネットからSSH接続可能なBastionノード OS: Oracle Linux 7.9 コンテナランタイム: Enroot ジョブスケジューラ: Slurm + Pyxis オンデマンドクラスタ機能： クラスタオートスケーリング ファイル・ストレージ によるGPUクラスタ内ホームディレクトリ共有 LDAPによるクラスタ内ユーザ統合管理 またこのチュートリアルは、デプロイしたGPUクラスタで複数ノードに跨るGPU間の通信性能を NCCL（NVIDIA...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-gpu-cluster-withautoscaling/",
        "teaser": "/ocitutorials/hpc/spinup-gpu-cluster-withautoscaling/architecture_diagram.png"
      },{
        "title": "GPUクラスタを構築する(Ubuntu OS編)",
        "excerpt":"本チュートリアルは、AIや機械学習ワークロードに最適なNVIDIA A100 40/80 GB 8枚と100 GbpsのRDMA対応ネットワークインタフェースを16ポート搭載するUbuntuをOSとするGPUノード（ BM.GPU4.8/BM.GPU.A100-v2.8 ）を クラスタ・ネットワーク を使用してノード間接続し、1ノードでは搭載しきれないGPUを必要とする大規模な分散機械学習ワークロードを実行するためのGPUクラスタを構築、複数ノードに跨るGPU間の通信性能を NCCL（NVIDIA Collective Communication Library） テストプログラム（ NCCL Tests ）で検証します。 本チュートリアルは、 OCI HPCテクニカルTips集 の以下2本のコンテンツを組合せ、 クラスタ・ネットワーク とGPUを使用するためのソフトウェアをインストール・セットアップし、GPUクラスタを構築します。 クラスタ・ネットワーク非対応OSイメージを使ったクラスタ・ネットワーク接続方法 UbuntuをOSとする機械学習ワークロード向けGPUノード構築方法 これらソフトウェアのインストールは、手順が多く相応の所要時間が必要なため、予め最小ノード（2ノード）のクラスタを構築してこのGPUノードにソフトウェアをインストール、このGPUノードの カスタム・イメージ を使用して、実際に使用するGPUクラスタを構築します。 以上より、UbuntuをOSとするGPUクラスタの構築は、以下の手順を経て行います。 カスタム・イメージ 取得用2ノードGPUクラスタ構築 クラスタ・ネットワーク 接続用ソフトウェアインストール クラスタ・ネットワーク 接続・確認 GPU関連ソフトウェアインストール CUDA Samples によるGPU動作確認 NCCL 通信性能検証 カスタム・イメージ 取得 cloud-init 設定ファイル（cloud-config）作成 インスタンス構成 作成 クラスタ・ネットワーク 作成...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-gpu-cluster-withubuntu/",
        "teaser": "/ocitutorials/hpc/spinup-gpu-cluster-withubuntu/architecture_diagram.png"
      },{
        "title": "ファイル・ストレージでファイル共有ストレージを構築する",
        "excerpt":"0. 概要 ファイル・ストレージ は、ヘッドノードとなる マウント・ターゲット とストレージとなる ファイル・システム から構成されるマネージドNFSサービスで、以下の特徴から高い可用性と運用性を求められるHPC/GPUクラスタ向けのファイル共有ストレージに最適なサービスです。 マウント・ターゲット がHA構成となっていて高いサービス可用性を提供 ファイル・システム 内のデータが複製されていて高いデータ可用性を提供 マウント・ターゲット のアップグレードによる動的な性能向上が可能（※1） マウント・ターゲット のソフトウェアメンテナンスが不要 OCIコンソールからGUIでデプロイできるのため構築難易度が低い ※1）アップグレードで選択可能なHigh Performanceタイプの マウント・ターゲット の詳細は、 ここ を参照してください。 これに対しマネージドブロックボリュームサービスの ブロック・ボリューム は、ベア・メタル・インスタンスと組み合わせることで ファイル・ストレージ よりもコストパフォーマンスの高いファイル共有ストレージを構築することが出来ますが、システム構築や運用は圧倒的に ファイル・ストレージ が容易です。 ファイル・ストレージ とブロック・ボリュームNFSサーバの比較詳細は、 OCI HPCテクニカルTips集 の HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法 を参照してください。 以上を踏まえて本チュートリアルは、 ファイル・ストレージ を使用するファイル共有ストレージを構築、ファイル共有クライアントとなる計算/GPUノードからこの領域をマウントし、必要に応じて マウント・ターゲット のアップグレードを適用するまでの手順を解説します。 所要時間 : 約1時間 前提条件 : ファイル共有ストレージを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。 注意 :...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-nfs-server-fss/",
        "teaser": "/ocitutorials/hpc/spinup-nfs-server-fss/architecture_diagram.png"
      },{
        "title": "File Storage with Lustreでファイル共有ストレージを構築する",
        "excerpt":"0. 概要 マネージドLustreサービスの File Storage with Lustre は、以下の特徴から高性能・高可用性・低い運用コストが求められるHPC/GPUクラスタ向けのファイル共有ストレージに最適なサービスです。 並列ファイルシステムであるLustreファイルシステムの特性を生かした高スループット ファイルサーバがHA構成となっていて高いサービス可用性を提供 ストレージ内のデータが複製されていて高いデータ可用性を提供 パフォーマンス層 のアップグレードや 容量 の増加による動的な性能向上が可能（※1） ファイルサーバのソフトウェアメンテナンスが不要 OCIコンソールからGUIでデプロイできるため構築難易度が低い ※1）パフォーマンス層 に関連する OCI 公式ドキュメントは、 ここ を参照してください。 これに対しマネージドNFSサービスの ファイル・ストレージ は、 File Storage with Lustre と同等の可用性・運用性を持つファイル共有ストレージをより低い価格帯から構築することが出来ますが、 File Storage with Lustre を採用することで、HPCワークロードのスクラッチ領域や機械学習ワークロードのチェックポイント領域等の高いスループットが要求されるファイル共有ストレージを構築することが可能です。 ファイル・ストレージ と File Storage with Lustre の比較詳細は、 OCI HPCテクニカルTips集 の HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法 を参照してください。 以上を踏まえて本チュートリアルは、 File...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-lustre-server-fswl/",
        "teaser": "/ocitutorials/hpc/spinup-lustre-server-fswl/architecture_diagram.png"
      },{
        "title": "ブロック・ボリュームでファイル共有ストレージを構築する（BM.Optimized3.36編）",
        "excerpt":"0. 概要 ブロック・ボリューム は、以下の特徴からHPCクラスタやGPUクラスタのファイル共有ストレージとして使用するNFSサーバのストレージに最適なサービスです。 同一 可用性ドメイン 内の異なる フォルト・ドメイン に複数のレプリカを持ち高い可用性を実現 ディスク装置にNVMe SSDを採用することで高いスループットとIOPSを実現 また、ベア・メタル・シェイプ BM.Optimized3.36 は、50 GbpsのTCP/IP接続用ポートを2個搭載し、それぞれをiSCSI接続の ブロック・ボリューム アクセス用途とNFSクライアントへのNFSサービス用途に割当てることで、コストパフォーマンスの高いNFSサーバ用インスタンスとして利用することが可能です。 OCIは、NFSのマネージドサービスである ファイル・ストレージ も提供していますが、本チュートリアルのように ブロック・ボリューム とベア・メタル・シェイプ BM.Optimized3.36 を使用してNFSでサービスするファイル共有ストレージ（以降ブロック・ボリュームNFSサーバと呼称）を構築することで、 ファイル・ストレージ よりも格段にコストパフォーマンスを引き上げることが出来ます。 ファイル・ストレージ とブロック・ボリュームNFSサーバの比較詳細は、 OCI HPCテクニカルTips集 の HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法 を参照してください。 本チュートリアルは、 GitHub のパブリックレポジトリ（ tutorial_bvnfs ）から公開されている Terraform スクリプトを リソース・マネージャ に読み込ませて作成する スタック を使用し、以下構成のNFSでサービスするファイル共有ストレージを自動構築（図中の Deployment target 範囲）した後、NFSファイルシステム性能をNFSクライアントから実行する IOR と mdtest...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-nfs-server/",
        "teaser": "/ocitutorials/hpc/spinup-nfs-server/architecture_diagram.png"
      },{
        "title": "ブロック・ボリュームでファイル共有ストレージを構築する（BM.Standard.E6.256編）",
        "excerpt":"0. 概要 ブロック・ボリューム は、以下の特徴からHPCクラスタやGPUクラスタのファイル共有ストレージとして使用するNFSサーバのストレージに最適なサービスです。 同一 可用性ドメイン 内の異なる フォルト・ドメイン に複数のレプリカを持ち高い可用性を実現 ディスク装置にNVMe SSDを採用することで高いスループットとIOPSを実現 また、ベア・メタル・シェイプ BM.Standard.E6.256 は、200 GbpsのTCP/IP接続用ポートを1個搭載し、全二重通信の2系統のラインをそれぞれiSCSI接続の ブロック・ボリューム アクセス用途とNFSクライアントへのNFSサービス用途にフル活用することで、10GB/sを超えるスループットを持つコストパフォーマンスの高いNFSサーバ用インスタンスとして利用することが可能です。 OCIは、NFSのマネージドサービスである ファイル・ストレージ も提供していますが、本チュートリアルのように ブロック・ボリューム とベア・メタル・シェイプ BM.Standard.E6.256 を使用してNFSでサービスするファイル共有ストレージ（以降ブロック・ボリュームNFSサーバと呼称）を構築することで、 ファイル・ストレージ よりも格段にコストパフォーマンスを引き上げることが出来ます。 ファイル・ストレージ とブロック・ボリュームNFSサーバの比較詳細は、 OCI HPCテクニカルTips集 の HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法 を参照してください。 本チュートリアルは、 GitHub のパブリックレポジトリ（ tutorial_bvnfs_e6 ）から公開されている Terraform スクリプトを リソース・マネージャ に読み込ませて作成する スタック を使用し、以下構成のNFSでサービスするファイル共有ストレージを自動構築（図中の Deployment target 範囲）した後、NFSファイルシステム性能をNFSクライアントから実行する IOR と mdtest...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-nfs-server-e6/",
        "teaser": "/ocitutorials/hpc/spinup-nfs-server-e6/architecture_diagram.png"
      },{
        "title": "短期保存データ用高速ファイル共有ストレージを構築する",
        "excerpt":"0. 概要 BM.DenseIO.E5.128 は、6.8 TBのNVMe SSDを12台ローカル接続し、ストレージに高いスループットとIOPSを要求する様々なワークロード用途に最適なベア・メタル・シェイプです。 また BM.DenseIO.E5.128 は、100 GbpsのTCP/IP接続用ポートを1個搭載し、NVMe SSDローカルディスクに構築するストレージを外部にサービスする際、100 Gbpsの帯域を全てクライアントへのサービスに割当てることで、ストレージとのアクセスにiSCSI接続によるネットワーク帯域を消費する ブロック・ボリューム を使用する場合と比較し、高速なストレージサービスサーバとして利用することが出来ます。 これに対して BM.DenseIO.E5.128 のNVMe SSDローカルディスクを使用するストレージサービスは、 ブロック・ボリューム を使用する場合と比較し、以下の点を考慮する必要があります。（※1） ※1）この比較詳細は、 OCI HPCテクニカルTips集 の HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法 を参照してください。 NVMe SSDローカルディスク上のデータ保護を自身で行う必要がある ベア・メタル・インスタンスの故障でNVMe SSDローカルディスク上のデータを消失するリスクがある データ格納容量が最大で38 TB程度（RAID10でファイルシステムを構成した場合）に限定され拡張出来ない 本チュートリアルは、これらの考慮点に対して以下のアプローチを取り、 ソフトウェアRAIDによるRAID10で最低限の可用性を確保 NVMe SSDローカルディスク上のファイルを定期的に他の長期保存ストレージにバックアップ（対象を短期保存データに限定）（※2） 2. のアプローチでバックアップの後ファイルを削除して空き容量を確保 ※2）このバックアップ環境の構築は、 OCI HPCチュートリアル集 の ベア・メタル・インスタンスNFSサーバ向けバックアップサーバを構築する を参照してください。 以下構成の短期保存データの格納を目的とするNFSでサービスする高速なファイル共有ストレージ（以降”DenceIO NFSサーバ”と呼称）を構築します。 NFSサーバ シェイプ ： BM.DenseIO.E5.128...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-nfs-server-nvme/",
        "teaser": "/ocitutorials/hpc/spinup-nfs-server-nvme/architecture_diagram.png"
      },{
        "title": "ベア・メタル・インスタンスNFSサーバ向けバックアップサーバを構築する",
        "excerpt":"0. 概要 HPC/GPUクラスタを運用する際必須となるファイル共有ストレージは、NFSでこれをサービスすることが一般的ですが、このファイル共有ストレージをコストパフォーマンス優先で選定する場合、 ベア・メタル・インスタンス とストレージサービスで構築する方法（以降”ベア・メタル・インスタンスNFSサーバ”と呼称）を採用することになり、ストレージに ブロック・ボリューム を使用しこれをベア・メタル・インスタンスにアタッチする方法（以降”ブロック・ボリュームNFSサーバ”と呼称）と、 ベア・メタル・インスタンス にNVMe SSDドライブを搭載するDenceIOシェイプを使用する方法（以降”DenceIO NFSサーバ”と呼称）があります。（※1） ※1）ベア・メタル・インスタンスNFSサーバの詳細は、 OCI HPCテクニカルTips集 の HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法 を参照してください。 このベア・メタル・インスタンスNFSサーバは、NFSのマネージドサービスである ファイル・ストレージ の場合は備え付けのバックアップ機能を利用できるのに対し、自身でバックアップ環境を用意する必要があります。（※2） ※2）バックアップの観点でのベア・メタル・インスタンスNFSサーバと ファイル・ストレージ の比較は、 OCI HPCテクニカルTips集 の HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法 の 2-2 可用性による比較 を参照してください。 以上を踏まえて本チュートリアルは、ベア・メタル・インスタンスNFSサーバで構築するファイル共有ストレージに格納されるファイルをバックアップする、バックアップサーバの構築方法を解説します。 ここで構築するバックアップ環境は、 OCI HPCテクニカルTips集 の ファイル共有ストレージ向けバックアップ環境の最適な構築手法 の 0. 概要 に記載のバックアップ環境 No. 3 と No. 4 から選択して構築することとし、採用したいバックアップ格納ストレージが オブジェクト・ストレージ （No.3）と ブロック・ボリューム...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/spinup-backup-server/",
        "teaser": "/ocitutorials/hpc/spinup-backup-server/architecture_diagram_os.png"
      },{
        "title": "ブロック・ボリュームNFSサーバと基礎インフラ編HPC/GPUクラスタを組み合わせる",
        "excerpt":"HPCクラスタやGPUクラスタは、そのフロントエンドとなるBastionノードを含む全てのノードで利用できるファイル共有ストレージが運用上必須です。 代表的なファイル共有ストレージの用途は、ユーザホームディレクトリですが、この領域は通常高いパフォーマンスより安定したサービスの提供が重視されるため、NFSがその有力な候補です。 OCIは、NFSのマネージドサービスとしてファイル・ストレージを提供しており、ファイルサーバ構築の必要無く簡単に利用できるため、HPC/GPUクラスタ用ユーザホームディレクトリの有力な候補です。 HPCクラスタスタック は、ファイル・ストレージの構築・セットアップを行う機能を持っており、ファイル・ストレージをユーザホームディレクトリに利用するHPC/GPUクラスタを自動構築することが出来ます。 これに対し、OCIのブロックストレージサービスであるブロック・ボリュームを使用してNFSサーバを構築し、この領域をユーザホームディレクトリとして使用することも可能です。 この手法は、ファイル・ストレージを使用する場合と比較して構築の手間がかかりますが、価格性能比の圧倒的に高いブロック・ボリュームの特徴を利用して、コストパフォーマンスを大幅に高めることが可能です。 ファイル・ストレージとブロック・ボリュームを使用したNFSサーバの価格と性能の比較は、チュートリアル ブロック・ボリュームでNFSサーバを構築する 前段の比較表を参照ください。 このチュートリアルは、チュートリアル ブロック・ボリュームでNFSサーバを構築する でブロック・ボリュームをアタッチしたベアメタルインスタンス BM.Optimized3.36 をNFSサーバとするファイル共有ストレージを構築し、チュートリアル HPCクラスタを構築する(基礎インフラ手動構築編) や GPUクラスタを構築する(基礎インフラ手動構築編) で基礎インフラとして構築するHPC/GPUクラスタのファイル共有ストレージとして利用する、コストパフォーマンスの優れたクラスタシステムを構築します。 所要時間 : 約2時間 0. 概要 本チュートリアルは、チュートリアル ブロック・ボリュームでNFSサーバを構築する とチュートリアル HPCクラスタを構築する(基礎インフラ手動構築編) かチュートリアル GPUクラスタを構築する(基礎インフラ手動構築編) を組み合わせて、以下のシステムを構築します。 この図中、左下の一点鎖線で囲まれたリソースを HPC/GPUクラスタを構築する(基礎インフラ手動構築編) で構築し、それ以外のリソースを ブロック・ボリュームでNFSサーバを構築する で構築します。 [ブロック・ボリュームでNFSサーバを構築する がデプロイするリソース] VCNと関連するネットワークリソース ブロック・ボリューム NFSサーバ用インスタンス Bastionノード NFSクライアント用インスタンス [HPC/GPUクラスタを構築する(基礎インフラ手動構築編) がデプロイするリソース] クラスタ・ネットワーク 計算/GPUノード 本チュートリアルは、以上2個のチュートリアルを活用し、以下の手順でシステムを構築します。 NFSサーバ構築（ブロック・ボリュームでNFSサーバを構築する を実施）...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/cluster-with-bv-base/",
        "teaser": "/ocitutorials/hpc/cluster-with-bv-base/architecture_diagram.png"
      },{
        "title": "ブロック・ボリュームNFSサーバと自動構築編HPC/GPUクラスタを組み合わせる",
        "excerpt":"HPCクラスタやGPUクラスタは、そのフロントエンドとなるBastionノードを含む全てのノードで利用できるファイル共有ストレージが運用上必須です。 代表的なファイル共有ストレージの用途は、ユーザホームディレクトリですが、この領域は通常高いパフォーマンスより安定したサービスの提供が重視されるため、NFSがその有力な候補です。 OCIは、NFSのマネージドサービスとしてファイル・ストレージを提供しており、ファイルサーバ構築の必要無く簡単に利用できるため、HPC/GPUクラスタ用ユーザホームディレクトリの有力な候補です。 HPCクラスタスタック は、ファイル・ストレージの構築・セットアップを行う機能を持っており、ファイル・ストレージをユーザホームディレクトリに利用するHPC/GPUクラスタを自動構築することが出来ます。 これに対し、OCIのブロックストレージサービスであるブロック・ボリュームを使用してNFSサーバを構築し、この領域をユーザホームディレクトリとして使用することも可能です。 この手法は、ファイル・ストレージを使用する場合と比較して構築の手間がかかりますが、価格性能比の圧倒的に高いブロック・ボリュームの特徴を利用して、コストパフォーマンスを大幅に高めることが可能です。 ファイル・ストレージとブロック・ボリュームを使用したNFSサーバの価格と性能の比較は、チュートリアル ブロック・ボリュームでNFSサーバを構築する 前段の比較表を参照ください。 このチュートリアルは、チュートリアル ブロック・ボリュームでNFSサーバを構築する でブロック・ボリュームをアタッチしたベアメタルインスタンス BM.Optimized3.36 をNFSサーバとするファイル共有ストレージを構築し、以下のように組み合わせたチュートリアルで構築するHPC/GPUクラスタのファイル共有ストレージとして利用します。 ファイル共有ストレージ 構築チュートリアル HPC/GPUクラスタ 構築チュートリアル 構築するシステム概要 ブロック・ボリュームで NFSサーバを構築する HPCクラスタを構築する (スタティッククラスタ自動構築編) BM.Optimized3.36を計算ノードとするスタティックHPCクラスタ ブロック・ボリュームファイル共有ストレージ LDAPユーザ統合管理 Slurmジョブスケジュール・計算リソース管理 同上 GPUクラスタを構築する (スタティッククラスタ自動構築編) BM.GPU4.8/BM.GPU.GM4.8をGPUノードとするスタティックGPUクラスタ ブロック・ボリュームファイル共有ストレージ LDAPユーザ統合管理 Slurmジョブスケジュール・計算リソース管理 同上 GPUクラスタを構築する (オンデマンドクラスタ自動構築編) BM.GPU4.8/BM.GPU.GM4.8をGPUノードとするオンデマンドGPUクラスタ ブロック・ボリュームファイル共有ストレージ LDAPユーザ統合管理 Slurmジョブスケジュール・計算リソース管理 所要時間 : 約2時間 0. 概要 本チュートリアルは、チュートリアル ブロック・ボリュームでNFSサーバを構築する とHPC/GPUクラスタを構築するチュートリアルを組み合わせて、以下のシステムを構築します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/cluster-with-bv-stack/",
        "teaser": "/ocitutorials/hpc/cluster-with-bv-stack/architecture_diagram.png"
      },{
        "title": "HPL実行方法（BM.Optimized3.36編）",
        "excerpt":"0. 概要 本ドキュメントで解説する HPL の実行は、 Intel oneAPI Math Kernel Library for Linux に含まれる HPL の実装である Intel Distribution for LINPACK Benchmark を、 Intel MPI Library と共に使用します。 なお、 Intel oneAPI Math Kernel Library for Linux と Intel MPI Library は、 Intel oneAPI HPC Toolkit に含まれているものを使用します。 HPL を実行するHPCクラスタは、計算ノードに BM.Optimized3.36 を使用し、 HPL の性能向上を目的に NUMA...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/run-hpl/",
        "teaser": null
      },{
        "title": "HPL実行方法（BM.Standard.E5.192編）",
        "excerpt":"0. 概要 本パフォーマンス関連Tipsで解説する HPL は、第4世代 AMD EPYC プロセッサを搭載するベア・メタル・シェイプ BM.Standard.E5.192 のインスタンス上で、AMDの HPL 実装である AMD Zen HPL optimized for AMD EPYC processors （以下 AMD HPL と呼称します。）を OpenMPI から起動して実行します。 以上より、本ドキュメントで解説する HPL 実行は、以下の手順を経て行います。 BM.Standard.E5.192 インスタンス作成 AMD HPL ダウンロード・インストール HPL 実行 本パフォーマンス関連Tipsは、以下の環境で HPL を実行しており、以下の性能が出ています。 [実行環境] シェイプ： BM.Standard.E5.192 CPU： AMD EPYC 9654ベース x 2（192コア） メモリ： DDR5...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/run-hpl-e5/",
        "teaser": null
      },{
        "title": "HPL実行方法（BM.Standard.E6.256編）",
        "excerpt":"0. 概要 本パフォーマンス関連Tipsで解説する HPL は、第4世代 AMD EPYC プロセッサを搭載するベア・メタル・シェイプ BM.Standard.E6.256 のインスタンス上で、AMDの HPL 実装である AMD Zen HPL optimized for AMD EPYC processors （以下 AMD HPL と呼称します。）を OpenMPI から起動して実行します。 以上より、本ドキュメントで解説する HPL 実行は、以下の手順を経て行います。 BM.Standard.E6.256 インスタンス作成 AMD HPL ダウンロード・インストール HPL 実行 本パフォーマンス関連Tipsは、以下の環境で HPL を実行しており、以下の性能が出ています。 [実行環境] シェイプ： BM.Standard.E6.256 CPU： AMD EPYC 9755ベース x 2（256コア） メモリ： DDR5...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/run-hpl-e6/",
        "teaser": null
      },{
        "title": "STREAM実行方法（BM.Optimized3.36編）",
        "excerpt":"0. 概要 本ドキュメントで解説する STREAM の実行は、 Intel oneAPI Base Toolkit に含まれるCコンパイラの Intel oneAPI DPC++/C++ Compiler で STREAM のソースコードをコンパイルして作成したバイナリを使用します。 STREAM を実行するインスタンスは、 BM.Optimized3.36 を使用し、 STREAM の性能向上を目的に NUMA nodes per socket （以降 NPS と呼称します。）が 2 （以降 NPS2 と呼称します。）となるようBIOSで設定します。 以上より、本ドキュメントで解説する STREAM 実行は、以下の手順を経て行います。 BM.Optimized3.36 インスタンス作成 Intel oneAPI Base Toolkit インストール STREAM ダウンロード・コンパイル STREAM 実行 本ドキュメントは、以下の環境で STREAM...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/run-stream/",
        "teaser": null
      },{
        "title": "STREAM実行方法（BM.Standard.E5.192編）",
        "excerpt":"0. 概要 本パフォーマンス関連Tipsで解説する STREAM は、第4世代 AMD EPYC プロセッサを搭載するベア・メタル・シェイプ BM.Standard.E5.192 のインスタンス上で、 AMD Optimizing C/C++ and Fortran Compilers （以降 AOCC と呼称します。）で STREAM のソースコードをコンパイルして実行します。 以上より、本ドキュメントで解説する STREAM 実行は、以下の手順を経て行います。 BM.Standard.E5.192 インスタンス作成 STREAM ダウンロード・コンパイル STREAM 実行 本パフォーマンス関連Tipsは、以下の環境で STREAM を実行しており、以下の性能が出ています。 [実行環境] シェイプ： BM.Standard.E5.192 CPU： AMD EPYC 9654ベース x 2（192コア） メモリ： DDR5 2.3 TB 理論性能： 7.3728 TFLOPS（ベース動作周波数2.4 GHz時）...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/run-stream-e5/",
        "teaser": null
      },{
        "title": "STREAM実行方法（BM.Standard.E6.256編）",
        "excerpt":"0. 概要 本パフォーマンス関連Tipsで解説する STREAM は、第5世代 AMD EPYC プロセッサを搭載するベア・メタル・シェイプ BM.Standard.E6.256 のインスタンス上で、 AMD Optimizing C/C++ and Fortran Compilers （以降 AOCC と呼称します。）で STREAM のソースコードをコンパイルして実行します。 以上より、本ドキュメントで解説する STREAM 実行は、以下の手順を経て行います。 BM.Standard.E6.256 インスタンス作成 STREAM ダウンロード・コンパイル STREAM 実行 本パフォーマンス関連Tipsは、以下の環境で STREAM を実行しており、以下の性能が出ています。 [実行環境] シェイプ： BM.Standard.E6.256 CPU： AMD EPYC 9755ベース x 2（256コア） メモリ： DDR5 3.072 TB 理論性能： 11.0592 TFLOPS（ベース動作周波数2.7 GHz時）...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/run-stream-e6/",
        "teaser": null
      },{
        "title": "Intel MPI Benchmarks実行方法",
        "excerpt":"0. 概要 本ドキュメントで解説する Intel MPI Benchmarks の実行は、 GitHub から提供される Intel MPI Benchmarks を OpenMPI で実行する方法と、 Intel oneAPI HPC Toolkit に含まれる Intel MPI Benchmarks と Intel MPI Library を使用する方法を解説します。 Intel MPI Benchmarks の実行は、以下3種類を解説します。 1ノード内全コアを使用するAlltoall 2ノード間のPingPong 4ノード間のAllreduce 本ドキュメントで Intel MPI Benchmarks を実行するHPCクラスタは、HPCワークロード向けベアメタルシェイプ BM.Optimized3.36 4インスタンスを クラスタ・ネットワーク で接続した構成とし、 OCI HPCチュートリアル集 のカテゴリ HPCクラスタ のチュートリアルの手順に従う等により、ノード間でMPIが実行できるよう予め構築しておきます。 本ドキュメントは、以下の環境で...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/run-imb/",
        "teaser": null
      },{
        "title": "NCCL Tests実行方法（BM.GPU4.8/BM.GPU.A100-v2.8編）",
        "excerpt":"0. 概要 本ドキュメントで解説する NCCL Tests の実行は、GPUクラスタ上に Docker Community Edition と NVIDIA Container Toolkit で構築されたコンテナ実行環境で TensorFlow NGC Container を起動し、このコンテナに含まれる NCCL（NVIDIA Collective Communication Library） とコンテナ上でビルドする NCCL Tests を使用します。 本ドキュメントで NCCL Tests を実行するGPUクラスタは、2インスタンスのGPUワークロード向けベアメタルシェイプ BM.GPU4.8/BM.GPU.A100-v2.8 を クラスタ・ネットワーク で接続した構成とし、 OCI HPCチュートリアル集 のカテゴリ 機械学習環境 のチュートリアル GPUクラスタを構築する(基礎インフラ手動構築編) や GPUクラスタを構築する(基礎インフラ自動構築編) の手順に従う等により、 Docker Community Edition と NVIDIA Container Toolkit...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/run-nccltests/",
        "teaser": null
      },{
        "title": "NCCL Tests実行方法（BM.GPU.H100.8編）",
        "excerpt":"0. 概要 本ドキュメントで解説する NCCL Tests の実行は、GPUクラスタ上に Docker Community Edition と NVIDIA Container Toolkit で構築されたコンテナ実行環境で TensorFlow NGC Container を起動し、このコンテナに含まれる NCCL（NVIDIA Collective Communication Library） とコンテナ上でビルドする NCCL Tests を使用します。 本ドキュメントで NCCL Tests を実行するGPUクラスタは、2インスタンスのGPUワークロード向けベアメタルシェイプ BM.GPU.H100.8 を クラスタ・ネットワーク で接続した構成とし、 OCI HPCチュートリアル集 のカテゴリ 機械学習環境 のチュートリアル GPUクラスタを構築する(基礎インフラ手動構築編) や GPUクラスタを構築する(基礎インフラ自動構築編) の手順に従う等により、 Docker Community Edition と NVIDIA Container Toolkit...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/run-nccltests-h100/",
        "teaser": null
      },{
        "title": "パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法",
        "excerpt":"注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 ベアメタルインスタンスは、デプロイ時にBIOS設定を指定することが可能ですが、この中にはHPCワークロードの実行時パフォーマンスに影響する以下の項目が含まれます。 NUMA nodes per socket （以降 NPS と呼称） NPS は、CPUソケット当たりの NUMA（Non-Umiform Memory Access）ノード数を指定するBIOS設定です。 現在のサーバ用途CPUでメモリ性能を向上させるために採用されているメモリインタリーブは、インターリーブするメモリチャネルを同一NUMAノードに接続されるものに限定します。このため、NPSを適切に調整することで、あるCPUコアから見て距離的に同じメモリチャネルのみをインターリーブし、 STREAM ベンチマークのようなメモリアクセスパターンを持つアプリケーションの性能を向上させることが可能でです。 例えば、AMD EPYC 9654プロセッサと同じアーキテクチャの BM.Standard.E5.192 のプロセッサは、12個の CCD（Core Complex Die）と、 I/O Die 内の UMC（Unified Memory Controller）が下図 （出典： AMD EPYC 9004 Series Architecture Overview）のように構成されており、12個の UMC が最も距離が近い関係（ローカル）にある3個の UMC 4グループに分かれています。 そこで NPS を4に設定することで、最も距離の近い3個の UMC...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/bios-setting/",
        "teaser": null
      },{
        "title": "不要サービス停止によるパフォーマンスチューニング方法",
        "excerpt":"0. 概要 HPCワークロードの高並列実行に於けるスケーラビリティは、いわゆるOSジッターの影響を受けるため、不要なOS常駐サービスを停止することで、これを改善できる場合があります。 ただこの場合、停止しようとするサービスは、以下の観点で事前に精査する必要があります。 使用するリソースがどの程度か 提供する機能が不要か これらの調査を経て停止するサービスを特定したら、対象のサービスを停止し、HPCワークロードを実行します。 本パフォーマンス関連Tipsは、HPCワークロード向けベアメタルシェイプ BM.Optimized3.36 と Oracle Linux 8ベースの HPCクラスタネットワーキングイメージ （※1）を使用するインスタンスを クラスタ・ネットワーク と共にデプロイするHPCクラスタを想定し、この計算ノードとしてのインスタンス上で不要サービスを停止することで、高並列時のスケーラビリティ向上を目的とするOSレベルのパフォーマンスチューニングを適用する方法を解説します。 ※1）OCI HPCテクニカルTips集 の クラスタネットワーキングイメージの選び方 の 1. クラスタネットワーキングイメージ一覧 のイメージ No.1 です。 以降の章は、本チューニングの趣旨に沿って以下の順に解説します。 調査用HPCクラスタ構築 不要サービス特定 不要サービス停止 不要サービス停止による効果確認 プロダクション用HPCクラスタ構築 不要サービスの特定は、Linuxのプロセスアカウンティングを利用し、インスタンスデプロイ直後のワークロードを実行していない状態でCPUを使用しているプロセスを特定、このプロセスが提供する機能を考慮して不要サービスかどうかを判断、不要と判断したサービスを停止します。 また不要サービスを停止した後、再度プロセスアカウンティング情報を取得し、その効果を確認します。 自身の利用するHPCクラスタが本パフォーマンス関連Tipsの想定と同じシェイプ・OSの場合は、本パフォーマンス関連Tipsと同じサービスを停止するだけでチューニングを適用することが出来るため、1章、2章、及び4章は参照にとどめて3章と5章の手順を適用します。 これらが想定と異なる場合は、1章の手順から順次チューニングを進めます。 この場合は、対象となる不要サービスが本パフォーマンス関連Tipsと異なる可能性があるため、自身で特定した不要サービスに合わせた停止方法を適用します。 1. 調査用HPCクラスタ構築 本章は、 BM.Optimized3.36 と Oracle Linux 8ベースの HPCクラスタネットワーキングイメージ （※1）でデプロイする2ノードの計算ノードを クラスタ・ネットワーク で接続する、不要サービスの特定とその効果確認に使用する調査用HPCクラスタを構築します。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/stop-unused-service/",
        "teaser": null
      },{
        "title": "クラスタ・ネットワークのトポロジーを考慮したノード間通信最適化方法",
        "excerpt":"0. 概要 クラスタ・ネットワーク は、そのトポロジーにノンブロッキング構成のFat treeを採用し、複数のノードに跨るHPC/機械学習ワークロードを実行するHPC/GPUクラスタのノード間接続に最適なサービスです。 この クラスタ・ネットワーク は、下図のような2階層スパイン・リーフトポロジーを有し、デプロイ時点のデータセンターリソース状況に応じて何れかのリーフスイッチ配下にインスタンスを接続します。 このためノード間通信性能は、通信する2ノードがどのリーフスイッチ配下に接続されているかにより、特にレイテンシが大きく異なります。 最もレイテンシ性能が良いノードの組合せは、同一リーフスイッチ配下に接続するノード同士で、異なるリーフスイッチ配下に接続するノード同士は、その間のホップ数増加により同一リーフスイッチ配下のノード間と比較してレイテンシが増大します。 このリーフスイッチは、ラック内に設置されているいわゆるTOR（Top of Rack）スイッチで、 インスタンス・メタデータ に格納されているラック識別IDを調べることで、デプロイしたインスタンスが クラスタ・ネットワーク のどのリーフスイッチに接続しているかを知ることが出来ます。 例えば、4ノードのインスタンスを クラスタ・ネットワーク と共にデプロイした際、以下のように2インスタンス毎に2ラックに配置されたとすると、 ラック （リーフスイッチ） インスタンス rack_1 inst_1   inst_2 rack_2 inst_3   inst_4 最もレイテンシー性能が良いノードの組み合わせは inst_1 &lt;—&gt; inst_2 と inst_3 &lt;—&gt; inst_4 で、その他の組み合わせはこれよりレイテンシが大きくなります。 クラスタ・ネットワーク は、この点を考慮してデプロイ時に極力同一リーフスイッチ配下のインスタンスを選択するアルゴリズムが組み込まれていますが、同一ラックに収容できるインスタンス数の上限や他のユーザの利用状況で異なるリーフスイッチに跨ってインスタンスを配置することがあり、この観点で クラスタ・ネットワーク 内のインスタンス接続位置を意識することは意味を持ちます。 このようして取得した クラスタ・ネットワーク のトポロジー情報は、ジョブスケジューラ Slurm の持つ Topology-aware...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/topology-aware-cn-tuning/",
        "teaser": null
      },{
        "title": "CFD解析フローのコストパフォーマンを向上させるOpenFOAM関連Tips",
        "excerpt":"0. 概要 本パフォーマンス関連Tipsは、 BM.Optimized3.36 を クラスタ・ネットワーク でノード間接続するHPCクラスタで OpenFOAM を実行する際、CFD解析フローのコストパフォーマンスを最大化するという観点で、以下のTipsを解説します。 メモリ帯域の有効利用を考慮した最適なノード内並列実行方法 スケーラビリティーを考慮した最適なノード間並列実行方法 NVMe SSDローカルディスクをストレージ領域に活用する方法 本パフォーマンス関連Tipsの性能計測は、 OCI HPCテクニカルTips集 の OpenFOAMインストール・利用方法 に従って構築された OpenFOAM を使用し、 OCI HPCテクニカルTips集 の Slurmによるリソース管理・ジョブ管理システム構築方法 に従って構築された Slurm 環境でバッチジョブとして計測しています。 また、 NUMA nodes per socket （以降 NPS と呼称）に NPS1 と NPS2 を指定して実行する計測は、 OCI HPCテクニカルTips集 の Slurmによるリソース管理・ジョブ管理システム運用Tips の 3. ヘテロジニアス環境下のパーティションを使った計算/GPUノード割り当て制御 に従って構築した Slurm 環境で行っています。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/openfoam-tuning/",
        "teaser": null
      },{
        "title": "OpenMPIのMPI通信性能に影響するパラメータとその関連Tips",
        "excerpt":"0. 概要 本パフォーマンス関連Tipsは、 OpenMPI のMPI通信性能にフォーカスし、 OpenMPI が採用する Modular Component Architecture （以降 MCA と呼称）に組み込まれたコンポーネントや、 OpenMPI が通信フレームワークに採用する UCX に於いて、MPI通信性能に影響するパラメータとその設定方法について、以下のTipsを解説します。 MCA パラメータ設定方法関連Tips UCX パラメータ設定方法関連Tips MPI通信性能に影響する MCA ・ UCX パラメータ これらのTipsは、全て OCI HPCテクニカルTips集 の Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法 に従って構築された OpenMPI を前提に記載します。 1. MCAパラメータ設定方法関連Tips 本Tipsは、 MCA パラメータの設定方法や設定した値の確認方法を解説します。 OpenMPI のアプリケーションを実行する際に MCA パラメータを指定する方法は、以下の4通りが存在します。 ここで同じパラメータが複数回指定された場合は、以下の出現順にその値が上書きされます。（全ての指定方法で同じパラメータが設定された場合は、 4. で指定されたものが採用されます。） システム管理者により作成された設定ファイルで指定（※1） ユーザにより作成された設定ファイルで指定（※2） 実行時の環境変数で指定（※3） mpirun...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/openmpi-perftips/",
        "teaser": null
      },{
        "title": "パフォーマンスを考慮したプロセス・スレッドのコア割当て指定方法（BM.Optimized3.36編）",
        "excerpt":"0. 概要 0-0. 概要 本パフォーマンス関連Tipsは、NUMA（Non-Umiform Memory Access）アーキテクチャを採用する クラスタ・ネットワーク 対応の Intel Ice Lake プロセッサを搭載するHPCワークロード向けベア・メタル・シェイプ BM.Optimized3.36 を使用するインスタンスで、並列プログラムの実行時性能に大きく影響するMPIが生成するプロセスとOpenMPが生成するスレッドのコア割当てについて、アプリケーション性能に有利となる典型的なパターンを例に挙げ、以下の観点でその実行方法を解説します。 PRRTEを使用するプロセス・スレッドのコア割当て この割当て方法は、 OpenMPI に同梱される PRRTE のMPIプロセスのコア割当て機能と、 GNUコンパイラ のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。 この方法は、ジョブスケジューラを使用せずに mpirun を使用してMPI並列アプリケーションをインタラクティブに実行する場合に使用します。 Slurmを使用するプロセス・スレッドのコア割当て この割当て方法は、 Slurm のMPIプロセスのコア割当て機能と、 GNUコンパイラ のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。 この方法は、 Slurm のジョブスケジューラ環境で srun を使用してMPI並列アプリケーションを実行する場合に使用します。 また最後の章では、プロセス・スレッドのコア割当てが想定通りに行われているかどうかを確認する方法と、この方法を使用して本パフォーマンス関連Tipsで紹介したコア割当てを行った際の出力例を紹介します。 なお、プロセス・スレッドのコア割当て同様に並列プログラムの実行時性能に大きく影響するメモリ割り当ては、割当てられるコアと同一NUMAノード内のメモリを割り当てることにより多くのケースで性能が最大となることから、以下のように - -localalloc オプションを付与した numactl コマンドの使用を前提とし、本パフォーマンス関連Tipsの実行例を記載します。 $ numactl --localalloc a.out 0-1. 前提システム...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/cpu-binding/",
        "teaser": "/ocitutorials/hpc/benchmark/cpu-binding/x9_architecture_nps2.png"
      },{
        "title": "パフォーマンスを考慮したプロセス・スレッドのコア割当て指定方法（BM.Standard.E5.192編）",
        "excerpt":"0. 概要 0-0. 概要 本パフォーマンス関連Tipsは、NUMA（Non-Umiform Memory Access）アーキテクチャを採用する第4世代 AMD EPYC プロセッサを搭載するベア・メタル・シェイプ BM.Standard.E5.192 を使用するインスタンスで、並列プログラムの実行時性能に大きく影響するMPIが生成するプロセスとOpenMPが生成するスレッドのコア割当てについて、アプリケーション性能に有利となる典型的なパターンを例に挙げ、以下の観点でその実行方法を解説します。 PRRTEを使用するプロセス・スレッドのコア割当て この割当て方法は、 OpenMPI に同梱される PRRTE のMPIプロセスのコア割当て機能と、 GNUコンパイラ のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。 この方法は、ジョブスケジューラを使用せずに mpirun を使用してMPI並列アプリケーションをインタラクティブに実行する場合に使用します。 Slurmを使用するプロセス・スレッドのコア割当て この割当て方法は、 Slurm のMPIプロセスのコア割当て機能と、 GNUコンパイラ のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。 この方法は、 Slurm のジョブスケジューラ環境で srun を使用してMPI並列アプリケーションを実行する場合に使用します。 また最後の章では、プロセス・スレッドのコア割当てが想定通りに行われているかどうかを確認する方法と、この方法を使用して本パフォーマンス関連Tipsで紹介したコア割当てを行った際の出力例を紹介します。 なお、プロセス・スレッドのコア割当て同様に並列プログラムの実行時性能に大きく影響するメモリ割り当ては、割当てられるコアと同一NUMAノード内のメモリを割り当てることにより多くのケースで性能が最大となることから、以下のように - -localalloc オプションを付与した numactl コマンドの使用を前提とし、本パフォーマンス関連Tipsの実行例を記載します。 $ numactl --localalloc a.out 0-1. 前提システム プロセス・スレッドのコア割当ては、使用するインスタンスのNUMAアーキテクチャやNUMAノードの構成方法に影響を受けますが、本パフォーマンス関連Tipsでは BM.Standard.E5.192 を使用し、NUMAノード構成に...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/cpu-binding-e5/",
        "teaser": "/ocitutorials/hpc/benchmark/cpu-binding-e5/e5_architecture_nps4.png"
      },{
        "title": "パフォーマンスを考慮したプロセス・スレッドのコア割当て指定方法（BM.Standard.E6.256編）",
        "excerpt":"0. 概要 0-0. 概要 本パフォーマンス関連Tipsは、NUMA（Non-Umiform Memory Access）アーキテクチャを採用する第5世代 AMD EPYC プロセッサを搭載するベア・メタル・シェイプ BM.Standard.E6.256 を使用するインスタンスで、並列プログラムの実行時性能に大きく影響するMPIが生成するプロセスとOpenMPが生成するスレッドのコア割当てについて、アプリケーション性能に有利となる典型的なパターンを例に挙げ、以下の観点でその実行方法を解説します。 PRRTE を使用するプロセス・スレッドのコア割当て この割当て方法は、 OpenMPI に同梱される PRRTE のMPIプロセスのコア割当て機能と、 GNUコンパイラ のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。 この方法は、ジョブスケジューラを使用せずに mpirun を使用してMPI並列アプリケーションをインタラクティブに実行する場合に使用します。 Slurm を使用するプロセス・スレッドのコア割当て この割当て方法は、 Slurm のMPIプロセスのコア割当て機能と、 GNUコンパイラ のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。 この方法は、 Slurm のジョブスケジューラ環境で srun を使用してMPI並列アプリケーションを実行する場合に使用します。 また最後の章では、プロセス・スレッドのコア割当てが想定通りに行われているかどうかを確認する方法と、この方法を使用して本パフォーマンス関連Tipsで紹介したコア割当てを行った際の出力例を紹介します。 なお、プロセス・スレッドのコア割当て同様に並列プログラムの実行時性能に大きく影響するメモリ割り当ては、割当てられるコアと同一NUMAノード内のメモリを割り当てることにより多くのケースで性能が最大となることから、以下のように - -localalloc オプションを付与した numactl コマンドの使用を前提とし、本パフォーマンス関連Tipsの実行例を記載します。 $ numactl --localalloc a.out 0-1. 前提システム プロセス・スレッドのコア割当ては、使用するインスタンスのNUMAアーキテクチャやNUMAノードの構成方法に影響を受けますが、本パフォーマンス関連Tipsでは第5世代...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/cpu-binding-e6/",
        "teaser": "/ocitutorials/hpc/benchmark/cpu-binding-e6/e6_architecture_nps4.png"
      },{
        "title": "OpenMPIのMPI集合通信チューニング方法（BM.Optimized3.36編）",
        "excerpt":"0. 概要 オープンソースのMPI実装である OpenMPI は、 Modular Component Architecture （以降 MCA と呼称します。）を採用することで、ビルド時に組み込むコンポーネントを介して集合通信を含む多彩な機能を提供し、この MCA パラメータにはMPI集合通信性能に影響するものがあります。 また OpenMPI は、高帯域・低遅延のMPIプロセス間通信を実現するためにその通信フレームワークに UCX を採用し、この UCX のパラメータにもMPI集合通信性能に影響するパラメータが存在します。 またMPI集合通信は、ノード内並列では実質的にメモリコピーとなるため、メモリ性能に影響するMPIプロセスのコア割当てや NUMA nodes per socket （以降 NPS と呼称します。）もその性能に影響します。 以上を踏まえて本パフォーマンス関連Tipsは、HPCワークロード向けベア・メタル・シェイプ BM.Optimized3.36 に於ける OpenMPI のMPI集合通信性能にフォーカスし、以下の 計測条件 を組合せたテストケース毎に以下の 実行時パラメータ を変えてその性能を Intel MPI Benchmarks で計測し、最適な 実行時パラメータ の組み合わせを導きます。 [計測条件] ノード数 ： 1 ・ 2 ・...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/openmpi-perftune/",
        "teaser": "/ocitutorials/hpc/benchmark/openmpi-perftune/are_08_36_step3.png"
      },{
        "title": "OpenMPIのMPI集合通信チューニング方法（BM.Standard.E5.192編）",
        "excerpt":"0. 概要 オープンソースのMPI実装である OpenMPI は、 Modular Component Architecture （以降 MCA と呼称します。）を採用することで、ビルド時に組み込むコンポーネントを介して集合通信を含む多彩な機能を提供し、この MCA パラメータにはMPI集合通信性能に影響するものがあります。 特に集合通信の高速化を意識して開発されている HCOLL や Unified Collective Communication （以降 UCC と呼称します。）を使用することで、集合通信を高速化することが可能です。 また OpenMPI は、高帯域・低遅延のMPIプロセス間通信を実現するためにその通信フレームワークに UCX を採用し、この UCX のパラメータにもMPI集合通信性能に影響するパラメータが存在します。 またMPI集合通信は、ノード内並列では実質的にメモリコピーとなるため、メモリ性能に影響するMPIプロセスのコア割当てや NUMA nodes per socket （以降 NPS と呼称します。）もその性能に影響します。 以上を踏まえて本パフォーマンス関連Tipsは、第4世代 AMD EPYC プロセッサを搭載するベア・メタル・シェイプ BM.Standard.E5.192 に於ける OpenMPI のMPI集合通信性能にフォーカスし、以下の 計測条件 を組合せたテストケース毎に以下の 実行時パラメータ を変えてその性能を Intel...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/openmpi-perftune-e5/",
        "teaser": "/ocitutorials/hpc/benchmark/openmpi-perftune-e5/are_192_step2.png"
      },{
        "title": "OpenMPIのMPI集合通信チューニング方法（BM.Standard.E6.256編）",
        "excerpt":"0. 概要 オープンソースのMPI実装である OpenMPI は、 Modular Component Architecture （以降 MCA と呼称します。）を採用することで、ビルド時に組み込むコンポーネントを介して集合通信を含む多彩な機能を提供し、この MCA パラメータにはMPI集合通信性能に影響するものがあります。 特に集合通信の高速化を意識して開発されている HCOLL や Unified Collective Communication （以降 UCC と呼称します。）を使用することで、集合通信を高速化することが可能です。 また OpenMPI は、高帯域・低遅延のMPIプロセス間通信を実現するためにその通信フレームワークに UCX を採用し、この UCX のパラメータにもMPI集合通信性能に影響するパラメータが存在します。 またMPI集合通信は、ノード内並列では実質的にメモリコピーとなるため、メモリ性能に影響するMPIプロセスのコア割当てや NUMA nodes per socket （以降 NPS と呼称します。）もその性能に影響します。 以上を踏まえて本パフォーマンス関連Tipsは、第5世代 AMD EPYC プロセッサを搭載するベア・メタル・シェイプ BM.Standard.E6.256 に於ける OpenMPI のMPI集合通信性能にフォーカスし、以下の 計測条件 を組合せたテストケース毎に以下の 実行時パラメータ を変えてその性能を Intel...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/openmpi-perftune-e6/",
        "teaser": "/ocitutorials/hpc/benchmark/openmpi-perftune-e6/are_256_step2.png"
      },{
        "title": "PAPIでHPCアプリケーションをプロファイリング",
        "excerpt":"HPCワークロードの実行に最適なベアメタル・インスタンスでアプリケーションを実行する場合、高価な計算資源を有効活用出来ているかを検証するため、アプリケーションのプロファイリングを実施することが一般的です。 PAPI は、HPCワークロード向け ベアメタル・シェイプ に採用されている Intel Ice Lake や AMD EPYC 9004シリーズ のCPUが持つハードウェアカウンタから浮動小数点演算数やキャッシュヒット数といったプロファイリングに有益な情報を取得するAPIを提供し、HPCアプリケーションのプロファイリングに欠かせないツールとなっています。 本プロファイリング関連Tipsは、 ベアメタル・インスタンス 上で実行するHPCアプリケーションを PAPI を使ってプロファイリングする方法を解説します。 0. 概要 PAPI (Performance Application Programming Interface) は、異なるプラットフォーム間を共通のインターフェースで利用できるように設計された性能解析ツールで、プロファイリング対象のアプリケーションからAPIをコールすることで、CPU/GPUをはじめとする様々なハードウェアからプロファイリングに有益な情報を収集します。 この PAPI の可搬性は、ハードウェア固有の部分を吸収する下層と、プロファイリングを行うアプリケーション開発者が利用する抽象化された上位層にソフトウェアスタックを分割することで、これを実現しています。これらの関係は、 ここ に記載のアーキテクチャ図が参考になります。 PAPI のAPIは、HPCアプリケーションをプロファイリングするユースケースの場合、 Low Level API と High Level API から選択して利用することが出来ます。 High Level API は、内部で Low Level API を使用することでより高機能のプロファイリングが可能なAPIを提供し、 Low...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/papi-profiling/",
        "teaser": null
      },{
        "title": "Score-P・Scalasca・CubeGUIで並列アプリケーションをプロファイリング",
        "excerpt":"0. 概要 Score-P は、HPCに於ける高並列アプリケーションをスケーラブルで簡易にプロファイリング（※1）することを目的に開発されたオープンソースのプロファイリングツールで、以下の代表的な並列プログラミングモデルに対応しています。 スレッド並列 OpenMP Pthreads プロセス並列 MPI SHMEM GPU並列 CUDA OpenCL OpenACC また Score-P は、並列アプリケーションの評価指標を統計的に扱うプロファイリング手法（※1）と、これらの評価指標をタイムスタンプと共に扱うトレーシング手法（※1）の何れにも対応しており、解析用途に合わせたプロファイリングが可能です。 ※1）本プロファイリング関連Tipsでは、性能向上を目的とした並列アプリケーションの性能解析プロセス全般を プロファイリング と呼称し、この中で評価指標を統計的に扱う プロファイリング の1つの方法を プロファイリング手法 と呼称します。これに対し、評価指標をタイムスタンプと共に扱う プロファイリング の1つの方法を トレーシング手法 と呼称します。 また Score-P は、 PAPI が取得するハードウェアカウンタ等の情報を取り込むことで、以下のように浮動小数点演算数等の情報をサブルーチンや関数単位で集計することが可能です。 Scalasca は、 Score-P が出力するトレーシング手法のデータをタイムスタンプ情報を元に解析する機能を持ち、並列アプリケーションのクリティカルパスの特定やプロセス間・スレッド間で発生する待ち時間等、プロファイリング手法では得られない情報を提供します。 また Scalasca は、 Score-P のフロントエンドとしても機能し、殆どの Score-P の操作を Scalasca から実施することが可能です。 CubeGUI は、Score-P が出力するプロファイリング手法のデータを読み込むことで、プロファイリング対象の並列アプリケーションを以下の3評価軸で表示し、 評価指標...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/benchmark/scorep-profiling/",
        "teaser": null
      },{
        "title": "クラスタネットワーキングイメージを使ったクラスタ・ネットワーク接続方法",
        "excerpt":"注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 クラスタ・ネットワーク への接続は、使用するインスタンスが以下の接続条件を満たし、このインスタンスデプロイ後に以下の接続処理を完了する必要があります。 [接続条件] クラスタ・ネットワーク 対応シェイプ（ ここ を参照）を使用している クラスタ・ネットワーク のデプロイに伴ってデプロイされている クラスタ・ネットワーク 接続に必要な以下ソフトウェアがインストールされている Mellanox OFED WPAサプリカント（※1） 802.1X認証関連ユーティリティソフトウェア クラスタ・ネットワーク 設定ユーティリティソフトウェア ※1）クラスタ・ネットワーク は、インスタンスが接続する際802.1X認証を要求しますが、この処理を行うクライアントソフトウェアがWPAサプリカントです。802.1X認証の仕組みは、 ここ のサイトが参考になります。 [接続処理] クラスタ・ネットワーク との802.1X認証（接続条件 3-3. が実施） クラスタ・ネットワーク 接続用ネットワークインターフェース作成（接続条件 3-4. が実施） ここで 接続条件 3. は、全てのソフトウェアを予めインストールした クラスタネットワーキングイメージ が用意されており、これを利用することでそのインストールを省略することが可能です。 この クラスタ・ネットワーキングイメージ は、 接続条件 3-3. と 接続条件 3-4. のユーティリティソフトウェアの提供方法について、...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/howto-connect-clusternetwork/",
        "teaser": null
      },{
        "title": "クラスタ・ネットワーク接続用ネットワークインターフェース作成方法",
        "excerpt":"クラスタ・ネットワーク 対応シェイプの BM.Optimized3.36 や BM.GPU4.8/BM.GPU.A100-v2.8 は、接続するポートのIPアドレス設定等を含むネットワークインターフェースをインスタンスデプロイ後にユーザ自身が適切に設定することで、 クラスタ・ネットワーク に接続します。 本テクニカルTipsは、このネットワークインターフェース作成方法を解説します。 0. 概要 BM.Optimized3.36 や BM.GPU4.8/BM.GPU.A100-v2.8 は、 クラスタ・ネットワーク がDHCPに対応していないため、その接続インターフェースに静的にIPアドレスを割当てる必要があります。 また BM.GPU4.8/BM.GPU.A100-v2.8 は、 クラスタ・ネットワーク に接続するポートを16ポート有し、これらを NCCL（NVIDIA Collective Communication Library） 等のGPU間通信ライブラリから使用しますが、この場合これら16ポートを16個の異なるIPサブネットに接続して使用します。 ここでDHCPが利用できない クラスタ・ネットワーク で、複数ノードに亘ってIPアドレスの重複が起こらないようにネットワークインターフェースを設定するには、どのようにうすればよいでしょうか。 この課題に対処するため、 クラスタネットワーキングイメージ は、systemdのサービス oci-rdma-configure を用意しています。 このサービスは、起動されると クラスタ・ネットワーク に接続するポートのネットワークインターフェース設定を/etc/sysconfig/network-scripts/ifcfg-ifname ファイルに作成し、ネットワークインターフェースを起動します。 ここで各ポートに割り振られるIPアドレスは、インスタンスを仮想クラウド・ネットワークのサブネット（24ビットのネットマスクを想定）にTCP/IPで接続する際に使用するポートにDHCPで割り振られるIPアドレスの4フィールド目（ここでは”x”と仮定）を使用し、以下のように静的にIPアドレスを割当てることで、アドレス重複を回避します。 BM.Optimized3.36 の場合 ポート名 IPアドレス ens800f0 192.168.0.x/24 BM.GPU4.8/BM.GPU.A100-v2.8 の場合 ポート名 IPアドレス...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/rdma-interface-configure/",
        "teaser": null
      },{
        "title": "クラスタネットワーキングイメージの選び方",
        "excerpt":"注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 クラスタネットワーキングイメージ は、ベースOSに Oracle Linux を採用し、 クラスタ・ネットワーク への接続に必要な以下のソフトウェアが予めインストールされています。 Mellanox OFED クラスタ・ネットワーク にインスタンスを接続するNIC（NVIDIA Mellanox ConnectX）のドライバーソフトウェアです。 WPAサプリカント インスタンスが クラスタ・ネットワーク に接続する際行われる802.1X認証（※1）のクライアントソフトウェアです。 802.1X認証関連ユーティリティソフトウェア インスタンスが クラスタ・ネットワーク に接続する際行われる802.1X認証に必要な機能を提供するユーティリティソフトウェアです。 クラスタ・ネットワーク 設定ユーティリティソフトウェア クラスタ・ネットワーク 接続用ネットワークインターフェース作成等の機能を提供するユーティリティソフトウェアです。 ※1）802.1X認証の仕組みは、 ここ のサイトが参考になります。 また クラスタネットワーキングイメージ は、以下の観点で異なる用途のものが用意されています。 802.1X認証関連ユーティリティソフトウェアと クラスタ・ネットワーク 設定ユーティリティソフトウェアの提供方法 Oracle Cloud Agent （以降 OCA と呼称）HPCプラグインとして提供するか、個別のRPMパッケージとして提供するかによる違いです。 対象のシェイプ HPCシェイプ（※2）用（HPC クラスタネットワーキングイメージ ）か、GPUシェイプ（※3）用（GPU クラスタネットワーキングイメージ...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/",
        "teaser": null
      },{
        "title": "クラスタ・ネットワーク未対応OSを使ったクラスタ・ネットワーク接続方法",
        "excerpt":"注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 クラスタ・ネットワーク への接続は、使用するインスタンスが以下の接続条件を満たし、このインスタンスデプロイ後に以下の接続処理を完了する必要があります。 [接続条件] クラスタ・ネットワーク 対応シェイプ（ ここ を参照）を使用している クラスタ・ネットワーク のデプロイに伴ってデプロイされている クラスタ・ネットワーク 接続に必要な以下ソフトウェアがインストールされている Mellanox OFED WPAサプリカント（※1） 802.1X認証関連ユーティリティソフトウェア クラスタ・ネットワーク 設定ユーティリティソフトウェア ※1）クラスタ・ネットワーク は、インスタンスが接続する際802.1X認証を要求しますが、この処理を行うクライアントソフトウェアがWPAサプリカントです。802.1X認証の仕組みは、 ここ のサイトが参考になります。 [接続処理] クラスタ・ネットワーク との802.1X認証（接続条件 3-3. が実施） クラスタ・ネットワーク 接続用ネットワークインターフェース作成（接続条件 3-4. が実施） 接続条件 3. のソフトウェアは、ベースとなるOSに Oracle Linux を使用する クラスタネットワーキングイメージ には予めインストールされていますが、 Rocky Linux ・ CentOS ・ Ubuntu でもこれらのソフトウェアを自身でインストールすることで...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/howto-create-cnenabled-osimage/",
        "teaser": null
      },{
        "title": "クラスタ・ネットワークに接続する計算/GPUノード作成時の問題判別方法",
        "excerpt":"0. 概要 クラスタ・ネットワーク と共に計算/GPUノードを新規に作成する場合や、既に作成された クラスタ・ネットワーク に計算/GPUノードを追加する場合、また既に作成された クラスタ・ネットワーク の計算/GPUノードを置き換える場合、そのノード数によってはリソース不足により失敗する場合があります。 新規に作成するケースで失敗の原因として考えられるのは、データセンター内に存在する クラスタ・ネットワーク のどの論理的なパーティションにおいても、指定したシェイプの指定したインスタンス数の空きがない場合です。 また、計算/GPUノードを追加するケースや置き換えるケースで失敗の原因として考えられるのは、既に作成されている クラスタ・ネットワーク の論理的なパーティションにおいて、指定したシェイプの指定したインスタンス数の空きがない場合です。 これらの問題が発生するケースは、出力されるエラーメッセージを確認することにより、前述のシナリオで失敗したことを特定することが出来ます。 ただこのエラーメッセージは、以下どの方法で クラスタ・ネットワーク の作成を行ったかにより、エラーメッセージの確認方法が異なります。 OCIコンソール 以下の OCI HPCチュートリアル集 に従って構築したHPC/GPUクラスタのように、OCIコンソールの コンピュート → クラスタ・ネットワーク → クラスタ・ネットワークの作成 ボタン から クラスタ・ネットワーク を作成するケースです。 HPCクラスタを構築する(基礎インフラ手動構築編) GPUクラスタを構築する(基礎インフラ手動構築編) リソース・マネージャ 以下の OCI HPCチュートリアル集 に従って構築したHPC/GPUクラスタのように、 リソース・マネージャ に作成した スタック から クラスタ・ネットワーク を作成するケースです。 HPCクラスタを構築する(スタティッククラスタ自動構築編) HPCクラスタを構築する(オンデマンドクラスタ自動構築編) HPCクラスタを構築する(基礎インフラ自動構築編) の リソース・マネージャ...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/determine-cnrelated-issue/",
        "teaser": null
      },{
        "title": "クラスタ・ネットワーク統計情報の取得方法",
        "excerpt":"0. 概要 クラスタ・ネットワーク 対応シェイプ（ ここ を参照）は、 クラスタ・ネットワーク 接続用NICとして NVIDIA Mellanox ConnectX を搭載し、 クラスタ・ネットワーク とのデータ通信に関連する統計情報を保持するハードウェアカウンタから、性能評価や問題判別に資する情報を取得することが出来ます。 これらの統計情報の中で送受信データ通信量は、アプリケーションのノード間通信性能を把握する上で重要なメトリックで、 Oracle Cloud Agent の Compute RDMA GPU Monitroing プラグインを介して OCIモニタリング から送受信帯域幅として参照する仕組みがあります。（この詳細は、 OCI HPCテクニカルTips集 の OCIモニタリングとGrafanaを使用したHPC/GPUクラスタのメトリック監視方法 を参照下さい。） また輻輳制御関連のエラーカウンタは、 クラスタ・ネットワーク が採用する RoCEv2 の輻輳制御である ECN や DCQCN に関する制御情報を保持しており、ノード間通信で問題が発生した際の状況把握に有益な情報として利用することが出来ます。（ クラスタ・ネットワーク の輻輳制御詳細は、 OCI HPC関連情報リンク集 の First Principles: Building a high-performance...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/howto-get-cnrelated-statistics/",
        "teaser": null
      },{
        "title": "ベアメタルインスタンスのNVMe SSDローカルディスク領域ファイルシステム作成方法",
        "excerpt":"0. 概要 NVMe SSDローカルディスクにファイルシステムを作成する方法は、搭載するドライブ数が異なる BM.Optimized3.36 、 BM.GPU4.8/BM.GPU.A100-v2.8 、及び、 BM.GPU.H100.8 でその手順が異なり、以降ではそれぞれの手順を解説します。 本テクニカルTipsが前提とするOSは、 Oracle Linux です。 なお 、ここで解説するファイルシステム作成手順は、 OCI HPCチュートリアル集 で紹介する構築手順に含まれるため、これらチュートリアルの手順に従ってHPCクラスタやGPUクラスタを構築する場合は、改めて実施する必要はありません。 1. BM.Optimized3.36用ファイルシステム作成手順 BM.Optimized3.36 は、3.84 TBのNVMe SSDローカルディスクを1ドライブ内蔵するため、以下の手順を該当するノードのopcユーザで実行し、ファイルシステムを作成・マウントします。 $ sudo parted -s /dev/nvme0n1 mklabel gpt $ sudo parted -s /dev/nvme0n1 -- mkpart primary xfs 1 -1 $ sudo mkfs.xfs -L localscratch /dev/nvme0n1p1 $...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/nvme-filesystem/",
        "teaser": null
      },{
        "title": "HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法",
        "excerpt":"0. 概要 HPC/GPUクラスタと共に利用するファイル共有ストレージは、その構築手法を決定する際に以下の評価項目を考慮する必要があります。 計算/GPUノードの複数ノード同時アクセス時性能 ランニングコスト ストレージに格納するデータの可用性 ファイル共有ストレージサービスの可用性 システム構築・運用のしやすさ 構成可能な最大スループット 本テクニカルTipsは、HPC/GPUクラスタ向けファイル共有ストレージの構築を念頭に、いくつかのファイル共有ストレージ構築手法を紹介し、上記評価基準を元にどの手法を採用すればよいか、その考慮点を解説します。 ファイル共有ストレージを構築する際の最初の考慮点は、ファイルシステムにLustreとNFSのどちらを採用するかです。 Lustreを採用する場合は、マネージドLustreサービスの File Storage with Lustre を使用します。 NFSを採用する場合は、マネージドNFSサービスの ファイル・ストレージ を使用する方法と、 ベア・メタル・インスタンス とストレージサービスで構築する方法（以降”ベア・メタル・インスタンスNFSサーバ”と呼称）の、どちらを採用するかです。 File Storage with Lustre を採用する場合は、性能要件に合わせて用意されている4タイプの パフォーマンス層（※1）からどれを採用するかを考慮します。 ※1）パフォーマンス層 は、125 MB/s/TB / 250 MB/s/TB / 500 MB/s/TB / 1,000 MB/s/TBが存在しますが、本テクニカルTipsでは125 MB/s/TBを前提に解説します。 パフォーマンス層 に関連する OCI 公式ドキュメントは、 ここ を参照してください。 ファイル・ストレージ を採用する場合は、性能要件に合わせて マウント・ターゲット...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/howto-configure-sharedstorage/",
        "teaser": "/ocitutorials/hpc/tech-knowhow/howto-configure-sharedstorage/architecture_diagram.png"
      },{
        "title": "ブロック・ボリュームを使用するNFSサーバのインスタンス障害からの復旧方法",
        "excerpt":"0. 概要 ブロック・ボリューム とベア・メタル・インスタンスを使用してNFSでサービスするファイル共有ストレージ（以降ブロック・ボリュームNFSサーバと呼称）は、NFSのマネージドサービスである ファイル・ストレージ のNFSサーバに相当する マウント・ターゲット がHA化され可用性が担保されているのに対し、NFSサーバのベアメタルインスタンスが単一障害点となり、インスタンスが障害で起動しなくなった場合ファイル共有サービスが停止します。 ただこの場合でも、起動しなくなったベアメタルインスタンスと同一構成の新たなインスタンスをデプロイし、このインスタンスに既存の ブロック・ボリューム をアタッチしてファイルシステムとしてマウントすることで、復旧作業時間に相当する数時間程度のサービス停止を経て、障害発生前のデータ領域のままNFSサービスを再開することが可能です。 この復旧シナリオの前提は、 ブロック・ボリューム でサービスするストレージ領域がLinuxの論理ボリュームマネージャで構築されていることです。論理ボリュームマネージャは、物理ボリューム・ボリュームグループ・論理ボリューム等のメタデータをOS上には持たず（キャッシュ情報は除く）に ブロック・ボリューム 上に保持するため、論理ボリュームマネージャをサポートするOSが稼働する別のインスタンスにアタッチすることで、ストレージ領域にアクセスできるようになります。 また本復旧シナリオは、障害時に既存の代替となるNFSサーバインスタンスをデプロイする際、ブロック・ボリュームNFSサーバの構築直後に取得するNFSサーバ用インスタンスの カスタム・イメージ を活用し、復旧に要する時間が最小となるよう配慮します。 次に、 ブロック・ボリューム に障害が発生してストレージ領域にアクセスできなくなる障害シナリオには、どのように対処すれはよいでしょうか。 ブロック・ボリューム は、同一 可用性ドメイン 内の異なる フォルト・ドメイン に複数のレプリカを持ち、NFSサーバのベア・メタル・インスタンスと比較して桁違いに高い可用性を提供します。 このため本テクニカルTipsは、NFSサーバに使用するベア・メタル・インスタンス障害の復旧シナリオにフォーカスし、これを解説します。 本復旧シナリオは、NFSサーバのOSに Oracle Linux 、ストレージ領域の管理にLinuxの論理ボリュームマネージャを使用し、以下のように構成されていることを前提とします。 以上より、本テクニカルTipsで解説する復旧シナリオは、以下のステップを経て行います。 [障害発生前] 代替NFSサーバインスタンス事前準備 [障害発生後] 代替NFSサーバインスタンスデプロイ ブロック・ボリューム の既存NFSサーバインスタンスからのデタッチ ブロック・ボリューム の代替NFSサーバインスタンスへのアタッチ 代替NFSサーバインスタンスでの復旧作業 NFSクライアントでの復旧作業 以降の章は、このステップに沿って具体的な復旧手順を解説します。 なお、本構成の ブロック・ボリューム NFSサーバは、 マーケットプレース から無料で利用可能な...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/bv-sharedstorage-recovery/",
        "teaser": "/ocitutorials/hpc/tech-knowhow/bv-sharedstorage-recovery/lv_configuration.png"
      },{
        "title": "計算/GPUノードのブート・ボリューム動的拡張方法",
        "excerpt":"インスタンスのルートファイルシステムを格納する ブート・ボリューム は、OSを停止することなく動的にその容量を拡張することが可能です。 ただこの動的拡張は、OCIコンソールやインスタンスOSで複数のオペレーションを実施する必要があり、ノード数が多くなるクラスタ環境の計算/GPUノードでは、これらのオペレーションを効率的に実施することが求められます。 本テクニカルTipsは、HPC/GPUクラスタの多数の計算/GPUノードに対し、 ブート・ボリューム の動的拡張を効率的に実施する方法を解説します。 0. 概要 インスタンスの ブート・ボリューム の動的拡張は、以下のステップを経て行います。 ブート・ボリューム 拡張（OCI上で実行） ブート・ボリューム の再スキャン（インスタンスOS上で実行） パーティションの拡張（インスタンスOS上で実行） ステップ 1. は、OCIリソースに対するオペレーションのため、OCIコンソールや OCI CLI 等のインターフェースを介して行い、ステップ 2. と 3. は、インスタンスOSに対してコマンドを実行して行います。 本テクニカルTipsは、多数の計算/GPUノードに対してこれらのオペレーションを効率よく行う事を想定しています。 このため、通常HPC/GPUクラスタのクラスタ管理ノードとして使用するBastionノードを活用し、ここからコマンドラインインターフェースで ブート・ボリューム の動的拡張のためのオペレーションを実行します。 なおBastionノードと計算ノードのOSは、 Oracle Linux を前提とします。 Bastionノードで使用するコマンドラインインターフェースは、ステップ 1. に OCI CLI 、ステップ 2. と 3. に pdsh を使用します。 このため、予めBastionノードで OCI CLI...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/boot-volume-extension/",
        "teaser": null
      },{
        "title": "ファイル共有ストレージ向けバックアップ環境の最適な構築手法",
        "excerpt":"0. 概要 ベア・メタル・インスタンス と ブロック・ボリューム 等のストレージサービスで構築するNFSでサービスするファイル共有ストレージは、NFSのマネージドサービスである ファイル・ストレージ の場合は備え付けのバックアップ機能を利用できるのに対し、自身でバックアップ環境を構築する必要があります。 この際バックアップを格納するストレージは、通常バックアップ対象のファイルを格納するストレージ（ブロック・ボリューム の バランス や Dense I/Oシェイプ のNVMe SSDローカルディスク）より容量単価の安価なものを選択する必要があるため、 オブジェクト・ストレージ や ブロック・ボリューム の より低いコスト （ブロック・ボリューム の パフォーマンス・レベル が最低のサービスで、 ブロック・ボリューム の中では最も容量単価が安価です。関連する OCI 公式ドキュメントは、 ここ を参照してください。以降” BVLC “と呼称します。）が候補になります。 またバックアップに使用するツールは、差分バックアップ機能を有することが求められ、バックアップ格納ストレージが オブジェクト・ストレージ の場合はこの領域へのアクセス機能を有する必要があります。 以上より本テクニカルTipsは、バックアップ格納ストレージに オブジェクト・ストレージ と BVLC 、バックアップツールに オブジェクト・ストレージ へのアクセス機能を有する以下ソフトウェアと rsync を取り上げ、 Command Line Interface （以降” OCI...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/howto-choose-osbackuptool/",
        "teaser": "/ocitutorials/hpc/spinup-backup-server/architecture_diagram_bv.png"
      },{
        "title": "計算/GPUノードの効果的な名前解決方法",
        "excerpt":"ノード数が多くなるHPCクラスタやGPUクラスタの計算/GPUノードの名前解決は、どのように行うのが効果的でしょうか。 本テクニカルTipsは、 仮想クラウド・ネットワーク のDNSを使用した効果的な計算/GPUノードの名前解決方法を解説します。 注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 仮想クラウド・ネットワーク に接続するインスタンスは、 仮想クラウド・ネットワーク が提供するDNSサービスにインスタンス名とIPアドレスの正引き・逆引き情報がデプロイ時に自動的に登録され、インスタンス名を使用して名前解決することが可能です。 このため、ホスト名とIPアドレスの関係をシステム管理者がメンテナンスする /etc/hosts を使用する方法やNISと比較し、DNS名前解決を活用することでホスト名管理を省力化することが可能です。 ここで、 仮想クラウド・ネットワーク が提供するDNSサービスは、インスタンス名（compute1）、接続する 仮想クラウド・ネットワーク 名（vcn）、及びサブネット名（private）を使用し、インスタンスのFQDNを以下のように登録します。 compute1.private.vcn.oraclevcn.com このため、DNS名前解決対象のインスタンスが接続するサブネットのFQDNを /etc/resolv.conf のsearch行に追加することで、インスタンス名によるDNS名前解決が可能になります。 例えば、 仮想クラウド・ネットワーク 名がvcn、サブネット名が public のサブネットに接続されるBastionノード上で、同じ 仮想クラウド・ネットワーク のサブネット名が private のサブネットに接続される計算ノードをインスタンス名でDNS名前解決する場合、Bastionノードの /etc/resolv.conf のsearch行が以下となっていれば良いことになります。 search vcn.oraclevcn.com public.vcn.oraclevcn.com private.vcn.oraclevcn.com ただ、この方針に沿って /etc/resolv.conf を修正する際、このファイルがDHCPクライアントにより管理されており、DHCPのリース切れやOS再起動の際に修正が元に戻ってしまうことに注意する必要があります。 以上より、インスタンス名によるDNS名前解決は、以下の手順を経て行います。 サブネットFQDN確認: DNS名前解決対象のインスタンスが接続するサブネットのFQDNの確認 /etc/resolv.conf 修正: DNS名前解を行うインスタンスの /etc/resolv.conf...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/compute-name-resolution/",
        "teaser": null
      },{
        "title": "計算/GPUノードデプロイ時の効果的なOSカスタマイズ方法",
        "excerpt":"注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 HPCクラスタやGPUクラスタの計算/GPUノードは、ノード数が数十ノードから時には数百ノードになることもあり、これらのOSに自身の環境に合わせたカスタマイズを加える際、どのような手法を採用するのが最も効果的かという観点で考慮する必要があります。 OCIでこれらのカスタマイズを加えるための代表的な選択肢は、以下が挙げられます。 Ansible RedHat社が開発するオープンソースの構成管理ツールで、YAML形式で記述されたPlaybookの情報を元に、ターゲットノードの構成管理を管理ノードからSSHで実行します。 Playbookは、条件分岐や反復処理を記述することが可能で、cloud-initやカスタム・イメージと比較して複雑な構成管理処理を実現することが可能です。 cloud-init カスタム・イメージ 下表は、これらの選択肢をいくつかの評価基準から比較しており、これらの特徴をふまえて自身のOSカスタマイズ要件にあった手法を選定します。   Ansible cloud-init カスタム・イメージ 備考 難易度 高（※1） 中（※2） 低 ※1） 管理ノード構築要 　　Playbook・インベントリファイル等構文習得要 ※2） cloud-config構文習得要 カスタマイズ柔軟性 高（※3） 中（※4） 低（※5） ※3） 条件分岐や反復を使用した柔軟なカスタマイズ可 ※4） 様々なモジュールを使用した柔軟なカスタマイズ可 ※5） 作成時に適用されているカスタマイズに限定 デプロイ時カスタマイズ 必要 必要 不要（※6） ※6） カスタマイズ適用済のためデプロイ時間短縮可 以上を踏まえて次章以降は、 cloud-init と カスタム・イメージ を使用した計算/GPUノードのOSカスタマイズの手順を解説します。 なおAnsibleは、オープンソースでインターネットから様々な情報を入手することが可能なため、ここでは解説しません。 1....","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/compute-os-customization/",
        "teaser": null
      },{
        "title": "計算/GPUノードのホスト名リスト作成方法",
        "excerpt":"注意 : 本コンテンツ内の画面ショットは、現在の OCI コンソール画面と異なっている場合があります。 0. 概要 HPCクラスタやGPUクラスタを構築・運用する際、全ての計算/GPUノードに対して同じコマンドを実行する、ジョブスケジューラに全てのノードを一括登録する、といったオペレーションを行う場面が頻繁に発生します。 このようなオペレーションは、全ての計算/GPUノードのホスト名を1行に1ノード記載した、以下のようなホスト名リストをテキストファイルで予め作成しておくことで、効率よく実施することが可能になります。 inst-hyqxm-comp inst-ihmnl-comp inst-hrsmf-comp inst-afnzx-comp 例えば、以下のようにこのホスト名リストを使用することで、全ての計算ノードのOSバージョンを確認することが可能です。 $ for hname in `cat ./hostlist.txt`; do echo $hname; ssh -oStrictHostKeyChecking=accept-new $hname \"grep -i pretty /etc/os-release\"; done inst-0giw2-comp PRETTY_NAME=\"Oracle Linux Server 8.6\" inst-ael72-comp PRETTY_NAME=\"Oracle Linux Server 8.6\" $ またMPIプログラムを実行する際も、起動コマンド（ mpirun 等）への実行ノード指示（ –hostfile オプション）に上記のホスト名リスト（いわゆるホストファイル）が必要になることがあります。 このホスト名リストは、以下のような方法で効率的に作成することが可能です。 OCI コンソールを活用する方法...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/compute-host-list/",
        "teaser": null
      },{
        "title": "計算/GPUノードの追加・削除・入れ替え方法",
        "excerpt":"0. 概要 HPC/GPUクラスタのノード数を増減させたり既存の計算/GPUノードを置き換える場合、これらのノードが通常同一の クラスタ・ネットワーク に接続されている必要があることから、 クラスタ・ネットワーク を使用しないインスタンスとは異なる手順が必要になります。 そこで本テクニカルTipsでは、これらの手順を以下のシナリオに分けて解説します。 ノード数を減らす ノード数を増やす ノードを置き換える 1. ノード数を減らす 1-0. 概要 ノード数を減らす場合、終了するノードを OCI に任せる方法と終了するノードを指定する方法があります。 終了するノードを OCI に任せる方法は、 クラスタ・ネットワーク に接続するどのノードを終了しても構わないが複数のノードを一度に減らす際に有効で、最も作成日の古いものから終了の対象として選択されます。 これに対して終了するノードを指定する方法は、一度に終了させるノードは少数だが終了するノードを指定する必要がある際に有効です。 1-1. 終了するノードをOCIに任せる方法 OCIコンソールメニューから コンピュート → クラスタ・ネットワーク を選択し、表示される以下画面で、ノード数を減らす クラスタ・ネットワーク をクリックします。 次に、表示される以下画面で、 編集 ボタンをクリックします。 次に、表示される以下 クラスタ・ネットワークの編集 サイドバーで、 インスタンス数 フィールドに減らした後の新しいノード数を入力し 変更の保存 ボタンをクリックします。 表示される以下 クラスタ・ネットワーク・インスタンス・プール ウィンドウで、左上のステータスが スケーリング中 → 完了 と遷移し、...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/cluster-resize/",
        "teaser": null
      },{
        "title": "pdshで効率的にクラスタ管理オペレーションを実行",
        "excerpt":"0. 概要 HPC/GPUクラスタの運用管理を任されるシステム管理者は、管理するクラスタに含まれる計算/GPUノードに対して、以下のような管理オペレーションを実施する必要が頻繁に発生します。 OSアップデートを全計算/GPUノードに適用する 新たに使用することになったアプリケーションを全計算/GPUノードにインストールする メンテナンス作業に伴い全計算/GPUノードをシャットダウン/リブートする 運用方針変更に伴い全計算/GPUノードでOSやアプリケーションの設定ファイルを置き換える 一部の計算/GPUノードで他ノードと挙動が異なるためインストールされているRPMのバージョンを全計算/GPUノードで調査する これらのオペレーションは、全計算/GPUノードに対してsudoで管理者に昇格可能なユーザ（ Oracle Linux では opc ）でパスフレーズ無しSSH接続可能なクラスタ管理ノードを用意し、このノードから実施するのが一般的です。 この場合、予め管理対象ノードのホスト名を記載したホストリストファイルとbashのforループを組合せたコマンドをクラスタ管理ノードから実行することで、一回のコマンド発行で所望のオペレーションを実施することが可能です。 OSアップデートを管理対象ノードに適用するケースでは、以下のコマンドをクラスタ管理ノードからopcユーザで実行します。 $ for hname in `cat hostlist.txt`; do echo $hname; ssh $hname \"sudo dnf upgrade --refresh\"; done ただこの場合、OSアップデートをホストリストファイルに記載された管理対象ノードに対して1ノードづつ順次適用するため、1ノード当たりの所要時間のノード数分の時間がかかります。 また、アップデートの適用が正しく全ノードに適用されたかを確認する場合、大量に出力されるOSアップデートからのコマンド出力を、ノード数分確認する必要が生じます。 また、インストールされているRPMのバージョンを管理対象ノードで調査するケースでは、以下のコマンドをクラスタ管理ノードからopcユーザで実行します。 $ for hname in `cat hostlist.txt`; do echo $hname; ssh $hname \"sudo dnf list openssh-server\";...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/cluster-with-pdsh/",
        "teaser": null
      },{
        "title": "オンデマンドクラスタ実現のためのインスタンス・プリンシパル認証設定方法",
        "excerpt":"注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 HPC/GPUクラスタを動的に作成・終了させるソフトウェア（以降”オンデマンドクラスタ管理ソフトウェア”と呼称）でオンデマンドクラスタを実現する場合、動的に管理するOCIサービス（ クラスタ・ネットワーク やインスタンス）に対する IAM 認証・認可をオンデマンドクラスタ管理ソフトウェアに付与する必要がありますが、オンデマンドクラスタ管理ソフトウェアが動作するインスタンス（以降”クラスタ管理ノード”と呼称）を インスタンス・プリンシパル 認証に組み込むことで、これを実現することが可能です。 具体的には、以下の手順を実行します。 クラスタ管理ノードを含む 動的グループ を作成 作成した 動的グループ に対する IAMポリシー を作成 オンデマンドクラスタ管理ソフトウェアは、 Terraform CLIや OCI CLI からこの インスタンス・プリンシパル 認証を利用し、HPC/GPUクラスタのライフサイクル管理を行います。 なお、この インスタンス・プリンシパル 認証を利用するオンデマンドクラスタを実現する手法は、 OCI HPCチュートリアル集 の HPCクラスタを構築する(オンデマンドクラスタ自動構築編) や GPUクラスタを構築する(オンデマンドクラスタ自動構築編) でも使われています。 またこの インスタンス・プリンシパル 認証は、ベア・メタル・インスタンスNFSサーバのファイル共有ストレージに格納するファイルを オブジェクト・ストレージ にバックアップするバックアップサーバを構築する（※1）際にも使用し、バックアップサーバで動作する Rclone が オブジェクト・ストレージ にアクセスする際のIAM認証・認可を付与します。 なお、このユースケースで本テクニカルTipsを使用する場合は、クラスタ管理ノードと呼称している箇所をバックアップサーバと読みかえて下さい。 ※1）この構築手法は、...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/instance-principal-auth/",
        "teaser": null
      },{
        "title": "OCIロギングとGrafanaを使用したHPC/GPUクラスタのログ監視方法",
        "excerpt":"ノード数が多くなるHPC/GPUクラスタは、各計算/GPUノードに分散するログを一元的に監視するフレームワークを構築することで、運用管理工数の低減や監視対象ログの見落としを防ぎ、システムセキュリティーを効率的に維持することが可能です。 OCI上にこのフレームワークを構築する際、活用できるソフトウェアはいくつかありますが、 OCIロギング と Grafana を統合したログ監視は、 Grafana の多彩な機能を活用できる点で有力な選択肢です。 本テクニカルTipsは、 OCIロギング と Grafana を使用してHPC/GPUクラスタのログを効率的に監視する方法を解説します。 注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 本テクニカルTipsで構築するHPC/GPUクラスタのログ監視フレームワークは、以下のサブシステムから構成されます。 これらのサブシステムのOSは、 Oracle Linux 8を前提に解説します。 Grafanaサーバ（1ノード） OCIロギング から計算/GPUノードの監視対象ログを収集し、ウェブブラウザに対してこれを表示します。 本テクニカルTipsでは、インターネットに接続するログ監視端末からSSHのポートフォワードで Grafana のGUIにアクセスするため、パブリックサブネットに接続します。 ログサーバ（1ノード） ログクライアントから監視対象ログを収集し、 OCIロギング にこれを送信します。 本テクニカルTipsでは、インターネットからの不正アクセスを防止するため、ログクライアントとTCP/IP接続可能なプライベートサブネットに接続します。 この際、ログサーバから OCIロギング にログデータを送信する経路として、このプライベートサブネットに サービス・ゲートウェイ を適切な ルート表 と共に作成しておく必要があります。これらのリソースは、ウィザードで 仮想クラウド・ネットワーク を作成した場合、自動的に作成されます。（※1） ※1）この詳細は、 OCIチュートリアル の その2 - クラウドに仮想ネットワーク(VCN)を作る を参照ください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/log-monitoring/",
        "teaser": null
      },{
        "title": "OCIモニタリングとGrafanaを使用したHPC/GPUクラスタのメトリック監視方法",
        "excerpt":"HPCワークロードや機械学習ワークロードを実行するHPC/GPUクラスタは、ワークロード実行中のCPU/GPU使用率、メモリ使用率、ネットワーク使用帯域等のメトリックを定期的に監視し、高価な計算資源を有効活用することが求められますが、ノード数が多くなるHPC/GPUクラスタでは、これらメトリックの監視が一元的・効率的に行える必要があります。 OCI上にこのフレームワークを構築する際、活用できるソフトウェアはいくつかありますが、 OCIモニタリング と Grafana を統合したメトリック監視は、 Grafana の多彩な機能を活用できる点で有力な選択肢です。 本テクニカルTipsは、 OCIモニタリング と Grafana を使用してHPC/GPUクラスタのメトリックを効率的に監視する方法を解説します。 注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 本テクニカルTipsで構築するHPC/GPUクラスタのメトリック監視フレームワークは、以下のサブシステムから構成されます。 これらのサブシステムのOSは、 Oracle Linux 8を前提に解説します。 Grafanaサーバ（1ノード） OCIモニタリング から計算/GPUノードの監視対象メトリックを収集し、ウェブブラウザに対してこれを表示します。 本テクニカルTipsでは、インターネットに接続するメトリック監視端末からSSHのポートフォワードで Grafana のGUIにアクセスするため、パブリックサブネットに接続します。 計算/GPUノード（1ノード以上の任意のノード数） 監視対象メトリックを収集し、 OCIモニタリング にこれを送信します。 本テクニカルTipsでは、プライベートサブネットに接続します。 この際、計算/GPUノードから OCIモニタリング にメトリックを送信する経路として、このプライベートサブネットに サービス・ゲートウェイ を適切な ルート表 と共に作成しておく必要があります。これらのリソースは、ウィザードで 仮想クラウド・ネットワーク を作成した場合、自動的に作成されます。（※1） ※1）この詳細は、 OCIチュートリアル の その2 - クラウドに仮想ネットワーク(VCN)を作る を参照ください。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/metric-monitoring/",
        "teaser": null
      },{
        "title": "UbuntuをOSとする機械学習ワークロード向けGPUノード構築方法",
        "excerpt":"注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 インスタンスOSに利用可能なLinuxディストリビューションは、 Oracle Linux をはじめ主要なものが用意されていますが、機械学習ワークロード実行のためのGPUノードのOSで主流になっているUbuntuもこれに含まれます。 ただこの場合、GPUを利用するための以下ソフトウェアは、GPUインスタンスデプロイ後に自身でインストール・セットアップする必要があります。 NVIDIA Driver : NVIDIA製GPUドライバソフトウェア NVIDIA CUDA : CUDAライブラリ NVIDIA Fabric Manager : NVSwitch （ BM.GPU4.8 / BM.GPU.A100-v2.8 に搭載）管理ソフトウェア（※1） ※1）NVSwitch を搭載するシェイプの場合のみインストールします。 本テクニカルTipsは、これらのソフトウェアをインストールし CUDA Samples でその動作確認を行う手順を、GPUシェイプ BM.GPU4.8 とUbuntu 20.04を例に解説します。 1. GPUインスタンスデプロイ 本章は、Ubuntu 20.04をOSとする BM.GPU4.8 をデプロイします。 OCIコンソールにログインし、GPUインスタンスをデプロイする リージョン を選択後、 コンピュート → インスタンス とメニューを辿ります。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/gpu-with-ubuntu/",
        "teaser": null
      },{
        "title": "Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法",
        "excerpt":"0. 概要 Slurm 環境で OpenMPI のアプリケーションを実行する場合、計算リソース確保、MPIプロセス起動、及びMPIプロセス間通信初期化をそれぞれ誰が行うか、ノード間リモート実行と起動コマンドに何を使用するかにより、以下3種類の動作モードが存在します。 No. 計算リソース 確保 MPIプロセス 起動 MPIプロセス間 通信初期化 ノード間 リモート実行 起動コマンド 1. Slurm Slurm PMIx Slurm srun 2. Slurm Slurm PMIx Slurm mpirun （※1） 3. Slurm PRRTE PMIx SSH （※2） mpirun ※1）本テクニカルTipsの手順に従い、 Slurm と連携するよう OpenMPI がビルドされている必要があります。 ※2）パスフレーズ無しで計算ノード間をSSHアクセス出来るよう設定する必要があります。 ここで No. 1. の動作モードは、その他の動作モードに対して以下の利点があります。 高並列アプリケーションを高速に起動することが可能（※3） プロセスバインディングや終了処理等のプロセス管理を Slurm に統合することが可能...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/build-openmpi/",
        "teaser": null
      },{
        "title": "Slurmによるリソース管理・ジョブ管理システム構築方法",
        "excerpt":"0. 概要 Slurm は、超大規模並列アプリケーションの運用を想定して開発されているジョブスケジューラで、この際に問題となる初期化処理（MPIの場合 MPI_Init ）時間の増大等の大規模並列ジョブ特有の問題に対し、プラグインとして取り込む PMIx の以下機能（※1）で、これらの問題に対処しています。 Direct-connect Direct-connect UCX Direct-connect early wireup ※1）これら機能の詳細は、SC17で発表された以下のスライドで紹介されています。 https://slurm.schedmd.com/SC17/Mellanox_Slurm_pmix_UCX_backend_v4.pdf ここでMPIのオープンソース実装である OpenMPI は、 PMIx をプラグインとして取り込んだ Slurm 環境で Slurm が提供するジョブ実行コマンド srun を使用してそのアプリケーションを実行する場合、 PRRTE を使用する起動方法（ mpirun / mpiexec を起動コマンドに使用する方法）に対して、先の PMIx の初期化処理を含む以下の利点を享受することが出来ます。 高並列アプリケーションを高速に起動することが可能 プロセスバインディングや終了処理等のプロセス管理を Slurm に統合することが可能 精度の高いアカウンティング情報を Slurm に提供することが可能 Slurm クラスタ内のSSHパスフレーズ無しアクセス設定が不要 以上の利点を享受するべく本テクニカルTipsは、 OpenMPI のMPI並列アプリケーションを PMIx の大規模並列ジョブに対する利点を生かして実行することを念頭に、 PMIx...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/",
        "teaser": "/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/architecture_diagram.png"
      },{
        "title": "線形代数演算ライブラリインストール・利用方法",
        "excerpt":"0. 概要 BLAS は、ベクトルや行列の基本的な線形代数演算を行うサブルーチンを集めたライブラリで、インターフェース互換を維持してこれを高速化したものが OpenBLAS です。 このため、 BLAS 用に作成されたプログラムであれば、再コンパイル・リンクを行うだけでソースプログラムを修正することなく OpenBLAS を使用してアプリケーションを高速化することが可能です。 また OpenBLAS は、pthreadを使用するスレッド並列実行に対応しており、 BLAS のサブルーチンを並列化で更に高速実行することが可能です。 以降では、 BLAS と OpenBLAS をHPCワークロードの実行に最適なベアメタルインスタンスの BM.Optimized3.36 にインストール・セットアップし、 BLAS の倍精度行列・行列積サブルーチン（DGEMM）を使用するFortranのサンプルプログラムをコンパイル後、 BLAS とスレッド数を変化させたときの OpenBLAS の実行性能を比較・検証します。 この性能比較詳細は、 3. サンプルプログラム実行 に記載していますが、これを抜粋している下表からも性能は圧倒的に OpenBLAS が良いことがわかり、特に本テクニカルTipsで使用している BM.Optimized3.36 の全コアを利用して線形代数演算を実行するようなワークロードでは、 OpenBLAS を利用するメリットが大きいと言えます。 ライブラリ スレッド数 速度向上比 BLAS 1 1 OpenBLAS 1 34.4   36...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/install-blas/",
        "teaser": null
      },{
        "title": "OpenFOAMインストール・利用方法",
        "excerpt":"0. 概要 OpenFOAM は、プリ処理・解析処理・ポスト処理の全てのCFD解析フローを様々なオープンソースのツール類と連携し、自身の解析用途に合わせた最適な流体解析シミュレーションを実施することが可能です。 この際、外部のツールと連携して OpenFOAM を利用するためには、ビルド時にこれを意識した構築手順を踏む必要があります。 本テクニカルTipsは、以下の外部ツールと連係動作する OpenFOAM 実行環境を構築します。 OpenMPI MPI言語規格に準拠するMPI実装 PETSc 偏微分方程式で記述された問題をMPIで並列計算するための数値計算ライブラリ FFTW 高速フーリエ変換ライブラリ ParaView 計算結果の可視化ツール VTK ParaView がモデルの描画を行う際に使用する可視化ツールキット ParaView Catalyst ParaView でin-situシミュレーションを行うためのツールキット MESA ParaView でOff-screenレンダリングを行うためのグラフィックライブラリ METIS メッシュを並列計算用に領域分割するツール SCOTCH メッシュを並列計算用に領域分割するツール KaHIP メッシュを並列計算用に領域分割するツール CGAL 幾何形状を取り扱うライブラリー ADIOS 大規模データを効率よく可視化・解析するためのフレームワーク また本テクニカルTipsは、 OpenFOAM に同梱されるチュートリアルを使用し、構築した環境でプリ処理・解析処理・ポスト処理のCFD解析フローを実行する手順を解説します。 この際、 OpenFOAM が提供するツールによるプリ処理と OpenFOAM が提供するソルバーによる解析処理を クラスタ・ネットワーク 対応のベアメタルシェイプ BM.Optimized3.36 でデプロイする計算ノードで、...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/install-openfoam/",
        "teaser": "/ocitutorials/hpc/tech-knowhow/install-openfoam/architecture_diagram.png"
      },{
        "title": "Slurmによるリソース管理・ジョブ管理システム運用Tips",
        "excerpt":"0. 概要 本テクニカルTipsは、OCI上に構築するHPC/GPUクラスタのリソース管理・ジョブ管理を Slurm で効果的に運用する際に有益な、以下のテクニカルTipsを解説します。 Prolog/Epilog セットアップ方法 メンテナンスを考慮した計算/GPUノードの ステータス 変更方法 ヘテロジニアス環境下のパーティションを使った計算/GPUノード割り当て制御 複数ジョブによる計算/GPUノード共有方法 これらのTipsは、全て OCI HPCテクニカルTips集 の Slurmによるリソース管理・ジョブ管理システム構築方法 に従って構築された Slurm 環境を前提に記載します。 1. Prolog/Epilogセットアップ方法 1-0. 概要 本Tipsは、ジョブ実行の前後で Slurm が自動的にスクリプトを実行する機能であるProlog/Epilogをセットアップする方法を解説します。 ここでは、PrologとEpilogで以下の処理を適用することを想定し、そのセットアップ方法を解説します。 [Prolog] 以下のスクリプトを使用し、直前に走っていたジョブの残したLinuxカーネルのキャシュをジョブ実行前に開放します。 #!/bin/bash log_file=/var/log/slurm/clean_memory.log /bin/date &gt;&gt; $log_file /bin/echo \"Before\" &gt;&gt; $log_file /bin/free -h &gt;&gt; $log_file /bin/sync; /bin/echo 3 &gt; /proc/sys/vm/drop_caches /bin/echo &gt;&gt;...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/slurm-tips/",
        "teaser": null
      },{
        "title": "Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法",
        "excerpt":"0. 概要 複数の計算ノードを クラスタ・ネットワーク でノード間接続するHPCクラスタは、その計算ノードに クラスタ・ネットワーク 接続用のドライバーソフトウェアやユーティリティーソフトウェアがインストールされている必要があるため、これらが事前にインストールされている クラスタネットワーキングイメージ を使用することが一般的です（※1）が、このベースとなるOSの Oracle Linux のバージョンは、 プラットフォーム・イメージ として提供される Oracle Linux の最新バージョンより古くなります。（※2） ※1）この詳細は、 OCI HPCテクニカルTips集 の クラスタネットワーキングイメージを使ったクラスタ・ネットワーク接続方法 を参照してください。 ※2）2025年3月時点の最新の クラスタネットワーキングイメージ がそのベースOSに Oracle Linux 8.10を使用しているのに対し、 プラットフォーム・イメージ の最新は Oracle Linux 9.5 です。 ここで実行するワークロードが単一ノードに収まる場合は、 クラスタ・ネットワーク に接続する必要がなくなり、 プラットフォーム・イメージ から提供される最新のOSを使用することが可能になりますが、現在利用可能な単一ノードで最も高性能なシェイプ（2025年5月時点）は、以下のスペックを持つ BM.Standard.E6.256 で、このスペックからも単一ノードで十分大規模なHPCワークロードを実行することが可能と考えられます。 CPU： AMD EPYC 9755ベース x 2（256コア） メモリ： DDR5...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/build-oraclelinux-hpcenv/",
        "teaser": null
      },{
        "title": "ベアメタル・インスタンスのカーネルダンプ取得方法",
        "excerpt":"0. 概要 パブリッククラウドに於けるOCIの優位性である ベアメタル・シェイプ は、HPC/GPUクラスタの計算/GPUノード用途や、 ブロック・ボリューム で構築する共有ストレージのNFSサーバ等の高い処理能力を要求されるシステム管理サーバ用途として使用されます。 ここで ベアメタル・シェイプ を使用する計算/GPUノードやシステム管理サーバ（以降”カーネルダンプクライアント”と呼称）は、 ブート・ボリューム をiSCSI接続するため、Linuxカーネルのメモリ領域ダンプ取得を担うkdumpカーネルがデフォルト出力先のルートファイルシステムにカーネルダンプを書き込むことが出来ません。 これに対しkdumpは、ネットワークを介して他のノード（以降”カーネルダンプサーバ”と呼称）にカーネルダンプを書き込む機能を有しており、本テクニカルTipsではこのうちNFSを取り上げてカーネルダンプをカーネルダンプサーバに取得する方法を解説します。 この方法は、HPC/GPUクラスタのようにカーネルダンプクライアントのノード数が多くなる環境では、カーネルダンプサーバ上でカーネルダンプクライアントが接続するサブネットに対してNFSエクスポートするだけで済み、鍵管理の必要なSSHと比較して容易に環境の構築が可能です。 また本テクニカルTipsは、カーネルダンプクライアントが計算ノードの場合とシステム管理サーバの場合を想定し、HPC クラスタネットワーキングイメージ と プラットフォーム・イメージ として提供される Oracle Linux を対象のOSイメージとして取り上げ、それぞれの手順を解説します。 これは、両者の使用するカーネルが以下の点で異なり、カーネルダンプクライアントとしてのセットアップ手順に違いが出るためです。 kdumpカーネル専用メモリ領域必要サイズ（Mellanox OFEDカーネルモジュール有無による） kdumpカーネルの起動を妨げるカーネルブートパラメータの有無 下表は、本テクニカルTipsで取り上げる各ノードタイプ毎のシェイプとOSイメージを示します。 ノードタイプ シェイプ OSイメージ カーネルダンプサーバ 任意のシェイプ Oracle Linux 8.9 （プラットフォーム・イメージ） カーネルダンプクライアント （計算ノードを想定） BM.Optimized3.36 HPC クラスタネットワーキングイメージ 8.8 （※1） カーネルダンプクライアント （システム管理サーバを想定） BM.Optimized3.36 Oracle Linux 8.9 UEKカーネル...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/kdump-on-baremetal/",
        "teaser": null
      },{
        "title": "サイト間VPNによるOCIとの拠点間接続方法",
        "excerpt":"注意 : 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。 0. 概要 サイト間VPN は、IPSecのトンネルモードを使用するOCIのマネージドVPN接続サービスで、オンプレミスのネットワークとOCIの 仮想クラウド・ネットワーク をIP層で拠点間接続するため、以下のような利用形態をセキュアでシームレスに実現することが可能です。 OCIで稼働する計算ノードでオンプレミスのライセンスサーバから有償CAEアプリケーションのライセンスを取得する オンプレミスの端末からOCIで稼働するログインノードにログインしインタラクティブ処理を行う オンプレミスの端末からOCIで稼働するログインノードにシミュレーションに必要なファイルを転送する OCIで稼働するログインノードからシミュレーションの結果ファイルをオンプレミスの端末に転送する また サイト間VPN は、サービス自体は無償のサービスでパブリックインターネットを拠点間接続回線に利用するため、OCIからオンプレミスに向けた転送データ量が少ない利用形態 1. から 3. のケースでは、他の有料専用線サービスと比較し、価格を抑えた拠点間接続が可能です。 また サイト間VPN を介する拠点間の通信帯域は、使用するインターネット接続回線に十分な余力がある場合、サービス自体の性能上限として250Mbps程度を期待することが出来ます。（詳細は、 ここ を参照してください。）このため、高い通信帯域を必要としない前述の利用形態 1. や 2. のケースに於いては、パフォーマンス的にも十分な拠点間接続方法であると言えます。 また サイト間VPN を使用する拠点間接続の冗長性は、以下の観点で考慮する必要がありますが、本テクニカルTipsの手順で作成する拠点間接続は、観点 1. のみ実施（以降の 2-6. IPSec接続作成 で作成する2個のトンネルがそれぞれVPNヘッドエンドを持ちます。）されてます。観点 2. と 3. の冗長化が必要な場合は、 ここ の情報が参考になります。 OCI側VPNヘッドエンドの冗長化 オンプレミス側VPN接続機器の冗長化 オンプレミス側インターネット接続回線の冗長化 ここで サイト間VPN によるオンプレミスとOCIの拠点間接続は、いくつかの接続形態が用意されており、オンプレミス側の現状や各接続形態の特徴を考慮し、接続作業の第一ステップとしてどの接続形態を採用するかを決定する必要があります。 また本テクニカルTipsは、拠点間が想定通り接続されていることを確認するため、オンプレミス側のプライベートネットワークに接続するライセンスサーバ相当のインスタンスとOCI側のプライベートサブネットに接続する計算ノード相当のインスタンス間でpingとSSHによる疎通確認を行います。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/hpc/tech-knowhow/site-to-site-vpn/",
        "teaser": "/ocitutorials/hpc/tech-knowhow/site-to-site-vpn/connection_type.png"
      },{
        "title": "OCI IAM Identity DomainsとAzure ADとの認証連携（外部IDP連携）を設定する",
        "excerpt":"2021年にOCIの新しい認証基盤としてOCI IAM Identity Domainsが登場しました。Identity DomainsはOCIのIAMサービスに代わりOCIへのユーザーの認証・認可の役割と、OCIのIdentity Cloud Serviceで提供していた他サービスとの認証連携の機能を提供しています。 本チュートリアルではSAMLによるOCI IAM Identity DomainsとAzure ADとの認証連携（外部IDP連携）を設定する手順を紹介します。Azure ADはMicrosoft社が提供するクラウドベースのIDおよびアクセス管理サービスです。本チュートリアルを完了することでAzure ADにサインオンするだけでOCIにもサインオンが可能になります。 所要時間 : 60分 前提条件 : 対象 Azure AD は構築済みとします。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. OCI IAM Identity DomainsのSAMLメタデータダウンロード OCI IAM Identity DomainsにてSMALメタデータをダウンロードします。 OCIのログイン画面でクラウド・アカウント名を入力します。 Select an identity domain to sign inのドロップダウンボックスから「Default」を選択し「Next」ボタンをクリックします。 ログイン画面でOCIテナント管理者のユーザー名とパスワードを入力してサインインします。 OCI コンソール画面左上のメニューより「アイデンティティとセキュリティ」→「アイデンティティ」を選択します。 アイデンティティ画面にて、「ドメイン」を選択し、ドメインを作成したいコンパートメントを指定し、ドメインを選択します。（今回は「Tutorial」ドメインを選択します。） ※自身で作成したIdentity...","categories": [],
        "tags": ["identity"],
        "url": "/ocitutorials/identity/identitydomain-azuread/",
        "teaser": "/ocitutorials/ocitutorials/identity/identitydomain-createdomain-changedomaintypeidentitydomains1.png"
      },{
        "title": "OCI IAM Identity Domainsのドメインの追加とライセンスタイプを変更する",
        "excerpt":"2021年にOCIの新しい認証基盤としてOCI IAM Identity Domainsが登場しました。Identity DomainsはOCIのIAMサービスに代わりOCIへのユーザーの認証・認可の役割と、OCIのIdentity Cloud Serviceで提供していた他サービスとの認証連携、認証強化の機能を提供しています。 OCIの環境にはデフォルトで「Default Domain」と呼ばれるドメインが作成されます。Default Domainは主にOCIへのユーザーの認証、認可にお役立ていただくことが可能です。また、Identity Domainsの用途に応じて、新しくドメインを作成したり、ライセンスタイプを変更することも可能です。 本チュートリアルでは、新しいドメインの追加方法と、ライセンスタイプの変更方法をご紹介します。 Identity Domainsのライセンスタイプの一覧と、各ライセンスタイプの機能制限などについてはドキュメントをご参照ください。 所要時間 : 約20分 前提条件 : 新しいドメインを作成するには、OCIテナントの管理者権限を持つユーザーが操作を実行する必要があります。操作を実行するユーザーがOCIテナントの管理者ではない場合は、ユーザーにOCIテナントの管理者権限を付与してください。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. Default Domainにログイン OCIのログイン画面でクラウド・アカウント名を入力します。 Select an identity domain to sign inのドロップダウンボックスから「Default」を選択し「Next」ボタンをクリックします。 ログイン画面でOCIテナント管理者のユーザー名とパスワードを入力してサインインします。 2. ドメインの作成 OCIコンソール画面左上のメニューより、「アイデンティティとセキュリティ」→「アイデンティティ」→「ドメイン」を選択します。「ドメインの作成」ボタンをクリックします。 ドメイン作成画面にて、以下情報を記載し「ドメインの作成」ボタンをクリックします。 表示名 - 任意（ログイン画面に表示されるアイデンティティ・ドメイン名になります） 説明 - 任意 ドメインタイプ - Free/Oracle...","categories": [],
        "tags": ["identity"],
        "url": "/ocitutorials/identity/identitydomain-createdomain-alterdomaintype/",
        "teaser": "/ocitutorials/identity/identitydomain-createdomain-alterdomaintype/identitydomains1.png"
      },{
        "title": "OCI IAM Identity Domains - テナント管理者・一般ユーザーを作成する",
        "excerpt":"2021年にOCIの新しい認証基盤としてOCI IAM Identity Domainsが登場しました。Identity DomainsはOCIのIAMサービスに代わりOCIへのユーザーの認証・認可の役割と、OCIのIdentity Cloud Serviceで提供していた他サービスとの認証連携、認証強化の機能を提供しています。 本チュートリアルでは、OCIテナントのアクティベーション後に2人目移行のテナント管理者ユーザーを作成する手順と、OCIテナントの一般ユーザーの作成手順を紹介します。 所要時間 : 約15分 前提条件 : OCIテナントで2人目以降のテナント管理者ユーザーを作成するには、OCIテナントをアクティベートしたテナント管理者が操作を実行する必要があります。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. Default Domainにログイン OCIのログイン画面でクラウド・アカウント名を入力します。 Select an identity domain to sign inのドロップダウンボックスから「Default」を選択し「Next」ボタンをクリックします。 ログイン画面でOCIテナント管理者のユーザー名とパスワードを入力してサインインします。 2. 管理者ユーザーの作成 OCIコンソール画面左上のメニューより、「アイデンティティとセキュリティ」→「アイデンティティ」→「ドメイン」→ドメイン「Default」を選択します。 ※Defaultドメインはルートコンパートメントにあります。 ドメイン詳細画面の左側のメニューから「ユーザー」を選択し、「ユーザーの作成」ボタンをクリックします。 ユーザーの作成画面にて、ユーザーの名・姓・電子メールアドレスを入力します。 ※デフォルトでは、電子メールアドレスがIdentity Domainログイン時のユーザー名になります。電子メールアドレス以外のユーザー名を指定したい場合は、「ユーザー名として電子メール・アドレスを使用」のチェックを外し、別途ユーザー名を指定してください。 グループオプションにて、「Administrators」にチェックをいれ、「作成」ボタンをクリックします。 ※Defaultドメインの「Administrators」グループに所属するユーザーがテナント管理者になります。 3. テナント管理者ユーザーのアクティベート ユーザーが作成されると、ユーザー作成時に入力した電子メールアドレスに、Welcomeメールが届きます。 メール本文の「Activate Your Account」ボタンをクリックします。 表示された初期パスワードのリセット画面にてパスワードを指定し、「パスワードのリセット」ボタンをクリックします。 以上の手順で、OCIテナント管理者ユーザーの作成と、アカウントのアクティベートが完了しました。 再度OCIテナントのログイン画面から、作成した管理者ユーザーのID/パスワードでOCIにログインできることを確認してください。...","categories": [],
        "tags": ["identity"],
        "url": "/ocitutorials/identity/identitydomain-setup-users/",
        "teaser": "/ocitutorials/identity/identitydomains-admin-users/users7.png"
      },{
        "title": "OCI IAM Identity DomainでAPEXで作成したアプリケーションに認証と認可をする",
        "excerpt":"Identity Domainでは、SAMLやOAuthなどの技術を使用することで、様々なアプリケーションとシングル・サインオンを実装することができます。 本チュートリアルでは、Oracle Application Express（APEX）で作成したアプリケーションとIdentity Domainの認証連携、およびIdentity Domainのグループに基づくアクセス制限（認可）の実装手順を紹介します。 本チュートリアルを完了すると、Identity DomainのユーザーはIdentity Domainのユーザー名とパスワードでAPEXアプリケーションにアクセスすることができるようになります。 また、Identity Domainのユーザーが属しているグループに基づいて、APEXアプリケーション内でアクセスできるページを制御することができるようになります。 所要時間 : 約1時間 前提条件 : OCIチュートリアルOracle Database編 - ADBの付属ツールで簡易アプリを作成しよう（APEX）を参考に、APEXのワークスペースを作成していること OCIチュートリアルOCI IAM Identity Domains テナント管理者・一般ユーザーを作成するを参考に、APEXアプリケーションにアクセスするユーザーが複数名分作成されていること。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. APEXアプリケーションの作成（任意） 本手順では、APEXアプリケーション内のアクセス制限を実装するため、APEXのサンプルアプリケーションをインストールします。 既存のアプリケーションがある場合は、本手順は実施しなくても問題ありません。 任意のAPEXワークスペースにログインします。 ワークスペースにログインしたら、「アプリケーション・ビルダー」を選択します。 「作成」ボタンをクリックします。 「ファイルから」を選択します。 「コピー・アンド・ペースト」のタブを開き、「販売」のサンプル・データ・セットを選択し、「次」ボタンをクリックします。 データのロード画面にて、任意の表名を入力し、「データのロード」ボタンをクリックします。 データがロードされ、表が作成されたら「アプリケーションの作成」ボタンをクリックします。 アプリケーションの作成画面にて、任意のアプリケーション名を入力します。 機能のセクションで「すべてをチャック」を選択し、「アプリケーションの作成」ボタンをクリックします。 「アプリケーションの実行」を選択します。 新しいタブが開き、アプリケーションのログイン画面が表示されます。 ワークスペースにログインしたユーザーのユーザー名とパスワードを入力し、アプリケーションにアクセスできることを確認します。 以上でサンプルのAPEXアプリケーションの作成は終了です。 2. 機密アプリケーションの登録...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/identity/identitydomain-apex-sso/",
        "teaser": "/ocitutorials/identity/identitydomain-apex-sso/apex-10.png"
      },{
        "title": "OCI IAM Identity DomainでユーザーのMFAを有効化する",
        "excerpt":"Identity DomainではSMSやメール、モバイルアプリケーションのワンタイム・パスコードなどを使用してユーザーに二要素認証を要求することができます。 また、全ユーザーに二要素認証を要求するのではなく、特定のグループに属しているユーザーや、特定のネットワークからログインしたユーザーなど、条件を指定して二要素認証を要求できます。 本チュートリアルでは、Identity Domainの特定のグループに属しているユーザーに二要素認証を要求するための設定手順を紹介します。 所要時間 : 約20分 前提条件 : OCIチュートリアル「OCI IAM Identity Domains - テナント管理者・一般ユーザーを作成する」を参考に、MFAを有効化したいユーザーを作成していること Identity Domainの管理者が本チュートリアル記載の設定作業をすること 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. グループの作成 本チュートリアルでは、特定のグループに属しているユーザーがIdentity Domainにログインする際に、二要素認証を要求するように設定をします。 最初に、二要素認証を要求するグループを作成し、ユーザーをグループに追加します。 OCIコンソール左上のメニュー → アイデンティティとセキュリティ → アイデンティティ → ドメイン → 対象のドメインを選択します。 ドメインの詳細画面で、「グループ」のタブを開き、「グループの作成」ボタンをクリックします。 グループの作成画面で、グループ名とグループの説明を入力し、グループに追加するユーザーを選択します。 「作成」ボタンをクリックし、グループを作成します。 以上の手順で、二要素認証を要求するグループを作成しました。 2. MFAの有効化 Identity Domain内で有効化する二要素認証の”ファクタ”を選択します。 ドメインの詳細画面 → セキュリティ → MFAのタブを開き、任意のファクタにチェックを入れます。...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/identity/identitydomain-mfa/",
        "teaser": "/ocitutorials/identity/identitydomain-mfa/mfa-10.png"
      },{
        "title": "OIC インスタンスを作成する",
        "excerpt":"Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。このハンズオンでは OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介します。 アイデンティティ・ドメインを使用した手順はこちらをご確認ください。 OIC インスタンスの作成前に確認すること OIC インスタンスを作成する前の確認事項について説明します。 1. Oracle Cloud アカウントの準備 Oracle Cloud のアカウントを準備します。無料のトライアル環境（フリートライアル）と有料のクラウド・アカウントのご利用が可能です。 無料のトライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です。詳細は下記URLのページをご確認ください。 Oracle Cloud 無料トライアルを申し込む トライアル環境のサインアップ手順はこちらをご確認ください。 Oracle Cloud 無料トライアル・サインアップガイド(PDF) Oracle Cloud 無料トライアルに関するよくある質問(FAQ) 2. 作成可能なリージョンの確認 OIC インスタンスを作成可能なリージョンを確認します。詳細はこちらのマニュアルをご確認ください。 3. 制限事項の確認 クラウド・アカウントの発行時期により、作成可能な OIC インスタンスの種類が異なります。こちらのマニュアルに、OCI コンソールから作成する OIC Generation 2 インスタンスの作成条件が記載されています。 4. エディションの確認 (Standard or Enterprise) OIC...","categories": [],
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
        "title": "OIC インスタンスを作成する・ユーザーを追加する－アイデンティティ・ドメイン編",
        "excerpt":"Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。このハンズオンでは OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介します。 OIC インスタンスの作成前に確認すること OIC インスタンスを作成する前の確認事項について説明します。 1. Oracle Cloud アカウントの準備 Oracle Cloud のアカウントを準備します。無料のトライアル環境（フリートライアル）と有料のクラウド・アカウントのご利用が可能です。 無料のトライアル環境の取得には認証用のSMSを受け取ることができる携帯電話と、有効なクレジットカードの登録が必要です。詳細は下記URLのページをご確認ください。 Oracle Cloud 無料トライアルを申し込む トライアル環境のサインアップ手順はこちらをご確認ください。 Oracle Cloud 無料トライアル・サインアップガイド(PDF) Oracle Cloud 無料トライアルに関するよくある質問(FAQ) 2. 作成可能なリージョンの確認 OIC インスタンスを作成可能なリージョンを確認します。詳細はこちらのマニュアルをご確認ください。 3. 制限事項の確認 クラウド・アカウントの発行時期により、作成可能な OIC インスタンスの種類が異なります。こちらのマニュアルに、OCI コンソールから作成する OIC Generation 2 インスタンスの作成条件が記載されています。 4. エディションの確認 (Standard or Enterprise) OIC は、2つのエディション(Standard...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/integration-for-commons-1-instance-id/",
        "teaser": null
      },{
        "title": "ファイル・サーバーの有効化",
        "excerpt":"このチュートリアルは、Oracle Integration Cloud が提供する SFTP に対応したファイル・サーバーを有効化する手順について説明します。 前提条件 このチュートリアルでは、Oracle Integration Cloud のインスタンスがすでに作成されていることを前提としています。 Oracle Integration Cloud のインスタンスをまだ作成していない場合は、次のページを参考に作成してください。 OIC インスタンスを作成するが実施済みであること ファイル・サーバーの有効化 Oracle Integration Cloud が提供している File Server は、インスタンスの作成直後は有効化されていません。 OCI コンソールを使用して、管理者が明示的に有効にする必要があります。 OCI コンソールにログインします。 サブスクライブしているリージョンの URL を使用します。 リージョン URL Tokyoリージョン https://console.ap-tokyo-1.oraclecloud.com/ Osaka リージョン https://console.ap-osaka-1.oraclecloud.com/ Phoenixリージョン https://console.us-phoenix-1.oraclecloud.com/ Ashburnリージョン https://console.us-ashburn-1.oraclecloud.com/ Frankfurtリージョン https://console.eu-frankfurt-1.oraclecloud.com/ OCI コンソールの画面左上にあるハンバーガー・メニューをクリックし、 「開発者サービス」 カテゴリにある 「アプリケーション統合」...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/app-integration-for-beginners-1-filesv/",
        "teaser": null
      },{
        "title": "ファイル・サーバーの有効化(OIC3)",
        "excerpt":"このチュートリアルは、Oracle Integration Cloud が提供する SFTP に対応したファイル・サーバーを有効化する手順について説明します。 前提条件 このチュートリアルでは、Oracle Integration Cloud のインスタンスがすでに作成されていることを前提としています。 Oracle Integration Cloud のインスタンスをまだ作成していない場合は、次のページを参考に作成してください。 OIC インスタンスを作成するが実施済みであること ファイル・サーバーの有効化 Oracle Integration Cloud が提供している File Server は、インスタンスの作成直後は有効化されていません。 OCI コンソールを使用して、管理者が明示的に有効にする必要があります。 OCI コンソールにログインします。 サブスクライブしているリージョンの URL を使用します。 OCI コンソールの画面左上にあるハンバーガー・メニューをクリックし、 「開発者サービス」 カテゴリにある 「アプリケーション統合」 をクリックします。 OCI コンソールの画面左側のリストから、Oracle Integration Cloud のインスタンスを作成したコンパートメントを選択し、ファイル・サーバーを有効化するOracle Integration Cloudのインスタンスをクリックします。 Oracle Integration Cloud インスタンスの詳細ページが表示されます。 「統合インスタンス情報」...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/app-integration3-for-beginners-1-filesv/",
        "teaser": null
      },{
        "title": "CSV ファイルから JSON ファイルへの変換",
        "excerpt":"このチュートリアルは、Oracle Integration Cloud の FTP アダプタを使用して、ファイル・サーバーにアップロードされた CSV ファイルを読み取り、JSON ファイルに変換して、再びファイル・サーバーにアップロードする手順を説明します。 前提条件 このチュートリアルでは、Oracle Integration Cloud のインスタンスが作成されており、サービス・コンソールにログインできることを前提としています。 Oracle Integration Cloud のインスタンスをまだ作成していない場合は、次のページを参考に作成してください。 Oracle Integration Cloud インスタンスの作成 Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。 この文書は OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介するチュートリアルです。 また、Oracle Integration Cloud が提供している SFTP ファイル・サーバーを使用します。 Oracle Integration Cloud のファイル・サーバーは、次のページの手順にしたがって有効化する必要があります。 Oracle Integration Cloud チュートリアル - ファイル・サーバーの有効化 このチュートリアルは、Oracle Integration Cloud が提供する...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/app-integration-for-beginners-2-csvjson/",
        "teaser": null
      },{
        "title": "CSV ファイルから JSON ファイルへの変換(OIC3)",
        "excerpt":"このチュートリアルは、Oracle Integration Cloud の FTP アダプタを使用して、ファイル・サーバーにアップロードされた CSV ファイルを読み取り、JSON ファイルに変換して、再びファイル・サーバーにアップロードする手順を説明します。 前提条件 このチュートリアルでは、Oracle Integration Cloud のインスタンスが作成されており、サービス・コンソールにログインできることを前提としています。 Oracle Integration Cloud のインスタンスをまだ作成していない場合は、次のページを参考に作成してください。 Oracle Integration Cloud インスタンスの作成 Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。 この文書は OIC インスタンスの作成方法を ステップ・バイ・ステップで紹介するチュートリアルです。 また、Oracle Integration Cloud が提供している SFTP ファイル・サーバーを使用します。 Oracle Integration Cloud のファイル・サーバーは、次のページの手順にしたがって有効化する必要があります。 Oracle Integration Cloud チュートリアル - ファイル・サーバーの有効化 このチュートリアルは、Oracle Integration Cloud が提供する...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/app-integration3-for-beginners-2-csvjson/",
        "teaser": null
      },{
        "title": "SFDCからアウトバンドメッセージを受信する",
        "excerpt":"このチュートリアルは、Salesforce(SFDC)側で新規商談(Opportunity)が登録されたら、SFDCのアウトバウンドメッセージが送信され、OIC の統合が起動される一連の動作を確認します。 このハンズオンを通じて、以下のポイントを理解することができます。 SFDC アダプターの実装方法 SFDC アダプター経由で SFDC アウトバンドメッセージを受信する方法 アプリケーション主導のオーケストレーションの実装 ロガーによるログ出力方法 前提条件 バージョン このハンズオンの内容は、Oracle Integration 21.2.3.0.0 (210505.1400.40951) 時点の内容で作成されています。最新の UI とは異なっている場合があります。最新情報については、製品マニュアルをご参照ください。 Oracle Integration https://docs.oracle.com/en/cloud/paas/integration-cloud/books.html https://docs.oracle.com/cd/E83857_01/paas/integration-cloud/books.html (日本語翻訳版) インスタンスの作成 Oracle Integration インスタンスの作成済であること。OIC インスタンスの作成方法は、以下の製品マニュアルや日本語チュートリアルをご確認ください。 OIC インスタンスを作成する(Oracle Integration チュートリアル) Provisioning and Administering Oracle Integration and Oracle Integration for SaaS, Generation 2 https://docs.oracle.com/en/cloud/paas/integration-cloud/oracle-integration-oci/index.html https://docs.oracle.com/cd/E83857_01/paas/integration-cloud/oracle-integration-oci/index.html (日本語翻訳版) 事前準備...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/app-integration-for-beginners-3-sfdc/",
        "teaser": null
      },{
        "title": "REST API で取得したデータを Oracle ADW に保存する(OIC3)",
        "excerpt":"このチュートリアルは、 Oracle Integration Cloud を使用して REST API で取得したデータを、Oracle ADW のテーブルに保存する手順を説明します。 REST API はREST Countries を利用します。 前提 このチュートリアルに沿って作業を進めるためには、次の設定が完了している必要があります。 Oracle Integration Cloud と Oracle Autononmous Database (ADW) のインスタンス作成 データを格納する Oracle ADW の表の作成 インスタンスの作成 このチュートリアルは、Oracle Integration Cloud と Oracle ADW のインスタンスの作成が完了し、コンソールにログインていることを前提としています。 まだインスタンスを作成していない場合は、次のページを参照してインスタンスを作成してください。 Oracle Integration Cloud インスタンスの作成 または OIC インスタンスを作成する・ユーザーを追加する－アイデンティティ・ドメイン編 Oracle ADW インスタンスの作成 表の作成...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/app-integration3-for-beginners-3-rest2adw/",
        "teaser": null
      },{
        "title": "Oracle Cloud Infrastructure Process Automation で簡単なワークフローを作成してみよう(作成編)",
        "excerpt":"OCI Process Automation(OPA) の機能を利用して、簡単なワークフローの作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 ここでは、従業員が休暇取得の申請を提出し、その上司が申請内容を承認 or 却下するシンプルな休暇申請ワークフローを作成します。 前提条件 OPA インスタンスの作成 が完了していること または Oracle Integration 3 Enterprise Edition インスタンスを作成し、OPA を有効化していること(OPAはOIC3 Enterprise Editionにも含まれています) アクセスの管理とロールの割当が完了していること OPA で簡単なワークフローを作成する OPA インスタンスにアクセスする Web ブラウザを開き、提供された OPA インスタンスのURLを入力します。もしくはOCIのコンソールから「開発者サービス」－「アプケーション統合」－「Process Automation」から作成済みのOPAインスタンスを選択し、「Open console」からOPAコンソールを開きます。 TIPS 画面を開く際、OCIにログインしていない場合はログインしてください。 OPA のホーム画面が開きます。 プロセス・アプリケーションを作成する 最初に大枠であるプロセス・アプリケーションを作成します。 「Create」をクリックします。 「Create process application」をクリックします。 Title、Descriptionを入力します、ここでは以下を入力します。「Create」をクリックします。 入力項目 入力する値 Title LeaveRequestApplication Description 休暇取得申請業務のアプリケーション LeaveRequestApplication...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/opa-for-beginners-1-designer/",
        "teaser": null
      },{
        "title": "Oracle Cloud Infrastructure Process Automation で簡単なワークフローを作成してみよう(実行編)",
        "excerpt":"OCI Process Automation(OPA) の機能を利用して、作成編で作成したワークフローを実行する手順を紹介するチュートリアルです。 前提条件 OPA インスタンスの作成 が完了していること または Oracle Integration 3 Enterprise Edition インスタンスを作成し、OPA を有効化していること(OPAはOIC3 Enterprise Editionにも含まれています) アクセスの管理とロールの割当が完了していること Oracle Cloud Infrastructure Process Automation で簡単なワークフローを作成してみよう(作成編)が完了していること OPA workspaceでワークフローを実行する OPA ではワークフローをdesignの画面で作成し、workspaceの画面で申請、承認などを実行します。 OPA workspaceにアクセスする Web ブラウザを開き、提供された OPA workspaceのURLを入力します。もしくはOPAのdesign画面から左のメニューで「workspace」をクリックして遷移します。 TIPS 画面を開く際、OCIにログインしていない場合はログインしてください。 OIC workspaceのホーム画面が開きます。 プロセス・アプリケーションの申請を開始する Start Requestsの画面ではアクティベートされたプロセス・アプリケーションが一覧で表示されています。 その中からOracle Cloud Infrastructure Process Automation で簡単なワークフローを作成してみよう(作成編)で作成したアプリケーションを探してクリックします。手順の通りであればLeaveRequestApplicationの名前のアプリケーションです。 任意の項目を入力して「Submit」をクリックします。 これで申請が完了しました。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/opa-for-beginners-1-workspace/",
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
        "title": "ビジネス・オブジェクトのデータを折れ線グラフで表示する",
        "excerpt":"Visual Builder Cloud Service　(VBCS) は、ユーザー・インタフェース(UI)・コンポーネントをページにドラッグ＆ドロップするだけで、Webアプリケーションやモバイル・アプリケーションを作成するためのビジュアル開発ツールです。 ボタンをクリックしてビジネス・オブジェクトを作成し、アプリケーションにCSVファイルをインポートしてデータを追加できます。 このチュートリアルは、インポートしたビジネス・オブジェクトのデータを折れ線グラフで表示する手順について説明します。 前提条件 Oracle Integration Cloud インスタンスの作成 Oracle Integration(OIC) を使い始めるための準備作業として、OIC インスタンスの作成が必要になります。この文書は OIC インスタンスの作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 OIC インスタンスの ServiceAdministrator ロールが付与されたユーザーが準備されていること (参考) Oracle Integration Roles and Privileges https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34 Webアプリケーションの作成 このパートでは、VBCSで Web アプリケーションを作成する際に、最初に定義する ビジュアル・アプリケーション と Web アプリケーション を作成する手順を説明します。 ビジュアル・アプリケーションの作成 VBCSでは、最初に ビジュアル・アプリケーション を作成します。 ビジュアル・アプリケーションは、Web アプリケーションやモバイル・アプリケーションを開発するために使用するリソースの集まりです。 アプリケーションのソース・ファイルや、メタデータが記述された JSON ファイルを含んでいます。 Web ブラウザを開き、提供された OIC...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/vbcs-for-beginners-4-linechart/",
        "teaser": null
      },{
        "title": "住所の値を基に地図上にピンマークを設置する",
        "excerpt":"Visual Builder Cloud Service(VBCS)は、ユーザー・インタフェース(UI)・コンポーネントをページにドラッグ＆ドロップするだけで、Webアプリケーションやモバイル・アプリケーションを作成するためのビジュアル開発ツールです。 このチュートリアルは、テキストボックスに入力された住所の値を基に地図上にピンマークを設置する手順について説明します。 前提条件 Oracle Integration Cloud インスタンスの作成 Oracle Integration(OIC)を使い始めるための準備作業として、OICインスタンスの作成が必要になります。この文書はOICインスタンスの作成方法をステップ・バイ・ステップで紹介するチュートリアルです。 OICインスタンスのServiceAdministratorロールが付与されたユーザーが準備されていること (参考) Oracle Integration Roles and Privileges https://docs.oracle.com/en/cloud/paas/integration-cloud/integration-cloud-auton/oracle-integration-cloud-roles-and-privileges.html#GUID-44661068-C31A-4AB5-BC24-B4B90F951A34 Google Maps API KEYの登録が完了していること Webアプリケーションの作成 このパートでは、VBCSでWebアプリケーションを作成する際に、最初に定義するビジュアル・アプリケーションとWebアプリケーションを作成する手順を説明します。 ビジュアル・アプリケーションの作成 VBCSでは、最初にビジュアル・アプリケーションを作成します。ビジュアル・アプリケーションは、Webアプリケーションやモバイル・アプリケーションを開発するために使用するリソースの集まりです。アプリケーションのソース・ファイルや、メタデータが記述されたJSONファイルを含んでいます。 Webブラウザを開き、提供されたOICインスタンスのURLを入力します。もしくはOCIのコンソールから「開発者サービス」－「アプリケーション統合」から作成済みのOICインスタンスを選択し、「サービス・コンソール」からOICコンソールを開きます。 左ナビゲーションメニューの「ビジュアル・ビルダー」をクリックします。 VBCSの「Visual Applications」ページが表示されたら、「New Application」ボタンをクリックします。 「Create Application」ダイアログ・ボックスが表示されます。次の表のように設定します。 設定項目 設定する値 説明 「Application name」 GoogleMapTutorial アプリケーションにつける名前 「Id」 GoogleMapTutorial アプリケーションのID。アプリケーションのURLにも用いられるので、VBCSのインスタンス内で一意である必要があります。 「Description」 Tutorial Application アプリケーションの簡単な説明 「Application...","categories": [],
        "tags": [],
        "url": "/ocitutorials/integration/vbcs-for-beginners-5-gmap/",
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
        "title": "クラウド・シェルを使ってブラウザだけで簡単コマンド操作",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル OCIのコンソール画面はWebブラウザでGUI操作ができて便利ですが、時にはコマンドラインで操作したい場合もあります。そんな時に別途パソコン上のターミナルソフトウェアを起動してコマンド操作するのではなく、ブラウザのコンソール画面の中でコマンド操作ができるととても便利です。 クラウド・シェル（Cloud Shell）は、OCIコンソールの中で利用できるWebブラウザベースのターミナルの機能です。OCIテナンシ内の各ユーザにLinuxのBashシェル実行ができる環境が提供され、無償で利用できます。 また、クラウド・シェルではOCIコマンドライン・インタフェース(CLI)の最新バージョンやそのほかの便利なツールがデプロイ済みですぐに使えるようになっています。ユーザごとに5GBのディレクトリが付属しているので、コンソールを閉じても次回再度起動すれば同じディレクトリを利用できます。 詳細：クラウド・シェルのドキュメント このチュートリアルでは、クラウド・シェルの起動と各種ネットワークのモードの利用方法、また、OCI CLIとインスタンスへのssh接続を試します。 所要時間 : 作業時間 約30分 前提条件 : チュートリアル入門編（その2）- クラウドに仮想ネットワーク(VCN)を作るを通じてVCNの作成が完了しており、そのVCN内にデフォルトのプライベート・サブネットとパブリック・サブネットが作成されていること。 チュートリアル入門編（その3）- インスタンスを作成する を通じてコンピュート・インスタンスの作成が完了していること。 注意 : チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります 目次 : 事前要件の確認 クラウド・シェルの起動 OCI CLIの実行 ファイルのアップロード パブリック・サブネットのコンピュート・インスタンスへのssh接続 プライベート・サブネットのコンピュート・インスタンスへのssh接続 1. IAMポリシーの確認 操作ユーザーがAdministratorsグループに所属している、あるいはテナンシの管理者権限を持つ場合は特に追加の設定は不要です。それ以外の場合は、以下のポリシーを設定してください。これらのポリシーはコンパートメントではなくテナンシレベルでの設定（in tenancy）が必要なため、rootコンパートメントに配置してください。 クラウド・シェルを利用するためのポリシー allow group &lt;GROUP-NAME&gt; to use cloud-shell in tenancy クラウド・シェルのパブリック・ネットワーク・アクセスを利用するためのポリシー...","categories": [],
        "tags": ["intermediate","governance"],
        "url": "/ocitutorials/intermediates/cloud-shell/",
        "teaser": "/ocitutorials/intermediates/cloud-shell/cloud-shell.png"
      },{
        "title": "予算と割当て制限を設定してコストを適正化する",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル 必要な時に迅速にリソースを作成して利用することができるのがクラウドのメリットですが、使った分のコストは支払う必要があります。OCIの支払いの方式は、 前払い制で事前購入したサブスクリプションから使った分を消費していく方式（Universal Credit Annual Flex）　と、 後払い制で使った分があとから請求される方式（Pay as you go, PAYG） の大きく二種類がありますが、いずれの方式にしても、たとえば利用者が増えたりして利用が拡大していくと当初予定していた以上にリソースを使ってコスト消費も増えていく可能性があります。 予期せぬコスト増を避けるためには、テナンシの管理者側で現状のコスト状況を把握し、予算（Budget）機能と、割当て制限（Quota）機能を使って適切にコスト管理をしていきましょう。 予算（Budget）とは、コンパートメントごと、タグごと、テナンシごと（組織管理利用時）に予算金額の設定を行い、設定した金額を超えそうになった場合に管理者にアラートを通知できる機能です。実績値または予測値を用いて、予算金額の何%に達したらメール通知するかを決めることができます。 アラート・メールが通知されたら、管理者側で必要に応じて不要リソースの停止や削除などのコスト低減の対策を行います。 割当て制限（Quota）とは、コンパートメントごとにどのくらいの量のリソースを利用できるかの上限を設定できる機能です。割当て制限が設定されたコンパートメント内で利用者が割当てられた量を超えるリソースを作成しようとするとエラーになります。 本チュートリアルでは、まず「コスト分析」で現状のコストを確認してから、「予算」と「割当て制限」の両方の機能をためしてみます。 所要時間 : 作業時間 約30分。（ただし予算は24時間ごとに評価されるため、設定してから24時間たってから予算アラートのメールが受信できているかを確認します。） 前提条件 : チュートリアル入門編（その2）- クラウドに仮想ネットワーク(VCN)を作るを通じてVCNの作成が完了しており、そのVCN内にデフォルトのプライベート・サブネットとパブリック・サブネットが作成されていること コンパートメント内になんらかの有償リソースが作成されていて、課金（コスト消費）が発生している状態であること。 注意 : チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります 目次 : 1. [コスト分析でコストの確認](#anchor1) 2. [予算の設定](#anchor2) 2. [割当て制限の設定](#anchor3) 1. コスト分析でコストの確認 予算を設定する前に、まずは現時点でのコスト分析を使用してコスト状況を確認していきます。 メニュー 請求とコスト管理 → コスト分析 をクリックします。...","categories": [],
        "tags": ["intermediate","governance"],
        "url": "/ocitutorials/intermediates/budget-quota/",
        "teaser": "/ocitutorials/intermediates/budget-quota/cost.png"
      },{
        "title": "OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する",
        "excerpt":" ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/intermediates/audit-log-analytics/",
        "teaser": "/ocitutorials/management/audit-log-analytics/audit-loganalytics16.png"
      },{
        "title": "OCI Network Firewallを構築する",
        "excerpt":" ","categories": [],
        "tags": ["security"],
        "url": "/ocitutorials/intermediates/networkfirewall/",
        "teaser": "/ocitutorials/ocitutorials/security/networkfirewall-setup/nfw1.png"
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
        "title": "Web Application Accelerationを用いてコンテンツ・キャッシュと圧縮を行う",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル OCI Web Application Acceleration（WAA）はフレキシブル・ロードバランサ（FLB）に紐づけるコンポーネントで、コンテンツ・キャッシュ機能とコンテンツのGZIP（GNU zip）による圧縮機能を提供します。これにより、クライアントへのレスポンス高速化、ひいてはアプリケーションのユーザーエクスペリエンス向上が期待できます。本チュートリアルでは、WebブラウザからGETメソッドのHTTPリクエストを行ったとき、WAAによりHTMLファイルのコンテンツ・キャッシュとGZIP圧縮が行われる様子を観察します（下図; 検証環境はOCIチュートリアル中級編『ロードバランサーでWebサーバーを負荷分散する』で作成したFLBと、Apacheをインストールしたバックエンドサーバー1台を再利用して構成します）。 Note 本チュートリアルを行うにあたっては、プロキシが挙動に影響を与える可能性がございます。クライアントPCがVPNに接続している場合は切断されることをお勧めします。 所要時間 : 約30分 前提条件 : 『OCIチュートリアル中級編『ロードバランサーでWebサーバーを負荷分散する』を完遂していること Google Chromeウェブブラウザを用いること 注意 : チュートリアル内の画面ショットについては、現在のコンソール画面と異なっている場合があります 目次 : バックエンド・サーバーにて検証用Webサイトを構築する WAAの設定を行う ブラウザからWebサイトにアクセスし、WAAの働きを確認する 1. バックエンド・サーバーにて検証用Webサイトを構築する この章では、FLBのバックエンド・セットのWebサーバ・インスタンスにて、WAAのキャッシュ機能を活用するためのApacheの設定と、圧縮機能を試すためのHTMLファイルの作成を行います。 本チュートリアルの前提条件を完遂すると、FLB専用サブネットおよびFLB、パブリック・サブネットに配置された二台のバックエンド・Webサーバ・インスタンスが作成されます(図)。今回、そのうちの一台の設定を編集しますので、まずはSSH接続のためのパブリック・サブネットのルーティングとセキュリティの設定を行います。 コンソール・メニューから ネットワーキング&gt;仮想クラウドネットワークを選択します（図） 仮想クラウド・ネットワークの一覧から TutorialVCNのデフォルト・ルート表である、Default Route Table for TutorialVCN を選択します（図） 遷移先、Default Route Table for TutorialVCNの詳細画面にて、ルート・ルールの追加（図、青色のボタン）をクリックします 表示されるウィザードにて、次の設定を行い、ルートルールの追加ボタン（図、青色のボタン）をクリックします ターゲット・タイプ...","categories": [],
        "tags": ["intermediate","network"],
        "url": "/ocitutorials/intermediates/web-application-acceleration/",
        "teaser": "/ocitutorials/intermediates/web-application-acceleration/overview_architecture.png"
      },{
        "title": "OCIのDBCSでOperations Insightsを有効化する",
        "excerpt":" ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/intermediates/dbcs_operations_insights/",
        "teaser": "/ocitutorials/management/dbcs_operations_insights/DB_OperationsInsights16.png"
      },{
        "title": "OCI IAM Identity Domainsのドメインの追加とライセンスタイプを変更する",
        "excerpt":" ","categories": [],
        "tags": ["identity"],
        "url": "/ocitutorials/intermediates/identitydomains-add-domains-license/",
        "teaser": "/ocitutorials/ocitutorials/identity/identitydomain-createdomain-alterdomaintype/identitydomains1.png"
      },{
        "title": "OCI IAM Identity Domains - テナント管理者・一般ユーザーを作成する",
        "excerpt":" ","categories": [],
        "tags": ["identity"],
        "url": "/ocitutorials/intermediates/identitydomains-admin-users/",
        "teaser": "/ocitutorials/ocitutorials/identity/identitydomain-setup-users/users7.png"
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
        "tags": ["security"],
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
        "title": "Oracle Secure Desktopsで簡単VDI環境構築",
        "excerpt":"チュートリアル一覧に戻る : Oracle Cloud Infrastructure チュートリアル クラウド上で仮想デスクトップの環境が必要なケースはありませんか？PCなどのローカル端末にデータを配置せず、リモートからOCIにアクセスして作業したい、オフィス以外からでも社内システムにアクセスしたい、そのような要件がある場合にOCIのセキュア・デスクトップのサービスが活用できます。 OCI上で仮想デスクトップ環境を迅速にデプロイできて、ローカル端末にデータを持たせないことでセキュリティを確保できます。 このチュートリアルではOracle Linuxのデスクトップ環境を作ってアクセスします。（Windows OSを利用する場合はWindowsライセンスの持ち込みが必要です。） セキュア・デスクトップのサービス概要については以下の資料もご参照ください。 Speaker Deck：OCI セキュア・デスクトップ 概要 所要時間：　約2時間 前提条件： その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること 注意: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 目次 : OCI セキュア・デスクトップの構成概要 事前準備 デスクトップ・イメージの準備 デスクトップ・プールの作成 ユーザーからのデスクトップへのアクセス（ブラウザ利用） ユーザーからのデスクトップへのアクセス（デスクトップ・クライアント利用） デスクトップの休止の確認 1.　OCI セキュア・デスクトップの構成概要 環境構築にあたって理解しておくべきアーキテクチャと構成要素を整理しておきます。 デスクトップ管理者があらかじめ「デスクトップ・プール」を定義して仮想デスクトップ環境を準備します。 デスクトップ・プール：デスクトップ・イメージやシェイプ、デスクトップの数、ネットワークなどを定義したリソース。 デスクトップ・イメージ： デスクトップの実体となるコンピュート・インスタンスを起動するイメージ 各デスクトップ・ユーザーがデスクトップを起動すると、デスクトップ・プールの設定に従ってお客様テナンシ内のプライベートなネットワークの中にデスクトップ用のコンピュート・インスタンスが起動されます。 デスクトップは各ユーザーごとに永続化されます。（ブロック・ボリュームにデータを永続保持） データはお客様テナンシの中に存在しているためセキュアに利用できます。 デスクトップ・ユーザーはブラウザ経由でエンドユーザ用のWebアプリケーションのURLにアクセスし、利用可能なデスクトップを選択して起動します。 デスクトップ・ユーザーの認証はOCIテナンシのIAM認証を利用します。権限を付与されているデスクトップ・プールにアクセスすることが可能です。 各ユーザーごとに個別のデスクトップが起動され、他人のデスクトップにはアクセスできないようになっています。 それではこれらの環境を作っていきましょう。...","categories": [],
        "tags": ["intermediate","securedesktops"],
        "url": "/ocitutorials/intermediates/secure-desktop/",
        "teaser": "/ocitutorials/intermediates/secure-desktop/img1.png"
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
        "excerpt":"はじめに OCI Data Integration はOCIで利用できるGUIベースのETLサービスです。 このチュートリアルではオブジェクト・ストレージ上のデータを変換し、Autonomous Databaseにロードを行っていきます。 OCI Data Integrationドキュメントに掲載されているチュートリアルの一部です。 目次 : 1.サンプルデータのロードとターゲット表の作成 2.Data Integrationを利用するための準備 3.ワークスペースの作成 4.データ・アセットの作成 5.プロジェクトとデータ・フローの作成 6.データ・フローの編集 7.タスクの作成 8.アプリケーションの作成とタスクの公開と実行 前提条件 : Data Integrationを利用するコンパートメントを準備してください。 Autonomous Databaseのエンドポイントはパブリックエンドポイントとしています。 画像は最新サービスと異なる可能性があります。 1. サンプルデータのロードとターゲット表の作成 ソースとなるオブジェクト・ストレージにファイルをアップロードし、ターゲットとなるAutonomous Databaseにロード先の表を作成します。 ソース：オブジェクト・ストレージ オブジェクト・ストレージにサンプルデータをロードします。 バケットを作成し、次の2つのファイルをアップロードしてください。 ファイルへのリンク : CUSTOMERS.json / REVENUE.csv バケットの作成とファイルのアップロード手順は“その7 - オブジェクト・ストレージを使う”をご確認ください。 ターゲット：Autonomous Database Autonomous Databaseインスタンスを作成しユーザーを作成します。手順は“101:ADBインスタンスを作成してみよう”をご確認ください。ユーザー名は任意ですが、このチュートリアルでは、BETAとします。作成したユーザーBETAで以下のSQLでCUSTOMER_TARGET表を作成してください。 CUSTOMERS_TARGET表作成SQL CREATE TABLE...","categories": [],
        "tags": [],
        "url": "/ocitutorials/intermediates/ocidi-tutorials/",
        "teaser": "/ocitutorials/intermediates/ocidi-tutorials/top.png"
      },{
        "title": "検出ルールを作成してアラート通知を設定する",
        "excerpt":"このチュートリアルでは、OCIコンピュートのOSログに検出ルールを設定し、Monitoringのアラームへ連携するための設定手順をご紹介します。 所用時間：30分 前提事項： ・OCIコンピュートが作成済であること このチュートリアルではOSはOracle Linux 8を前提としています。 ・Logging Analyticsが有効化されていること このチュートリアルでは、オンボーディング機能を使用してポリシーやLogging Analyticsのリソースが作成済みであることを前提としています。 オンボーディング機能についてはこちらの記事を参照ください。 ポリシーやリソースの作成はマニュアルで設定しても問題ありません。 マニュアルで設定する場合は以下のドキュメントを参照ください。 前提条件のIAMポリシー 管理エージェントを使用した継続的なログ収集の許可 このチュートリアルでは管理者権限を持つユーザーを前提としています。 ユーザーにアクセス制御を設定する場合は以下のドキュメントを参照ください。 ログ・アナリティクスのIAMポリシー・カタログ ・OCIコンピュートのOSログがLogging Analyticsで表示できていること サンプルとして、Linux Syslogを使用します。 参考：Logging Analytics：OCIコンピュートからOSのログを収集する 1. ラベルを作成する OCIコンソール ホーム画面のサービスメニューから「監視および管理」＞「管理」＞「ラベル」と進み、「ラベルの作成」をクリックします。 Note ラベルとは、ログコンテンツの特定の文字列に対して任意の名前を割り当てる機能です。 最初から定義されたものもあれば、ユーザー自身で作成することもできます。ラベルの詳細はこちら 任意の名前をつけて、作成を完了します。 2. ログソースにラベルを設定する 「監視および管理」＞「管理」へ進み、「ソース」の数字の部分をクリックします。 linuxで検索し、Linux Syslog Logs をクリックします。 「編集」をクリックします。 ソースの編集画面で、ラベルのタブで「条件ラベルの追加」をクリックします。 以下の画像のように条件を設定します。 これは、ログコンテンツのメッセージ部分に”test log”という文字列が含まれていた場合、”Demo”というラベルを自動割り当てするという意味になります。 「追加」をクリックすると一覧に表示されますので、問題なければ「変更の保存」をクリックします。 3. 検出ルールの作成 「監視および管理」＞「管理」＞「検出ルール」と進み、「ルールの作成」をクリックします。 検出ルールには2種類あり、スケジュール実行して検出するタイプのものと、特定のラベルが生成されたタイミングで検出するタイプのものがあります。今回は後者の「取込み時検出ルール」を使用します。検出ルールの詳細についてはこちら...","categories": [],
        "tags": [],
        "url": "/ocitutorials/management/logginganalytics_detect_rule/",
        "teaser": "/ocitutorials/management/logginganalytics_logcollection4ocivm/LA_logcollection4ocivm-22.png"
      },{
        "title": "Logging Analytics：OCI外部のホストからOSログを収集する",
        "excerpt":"このチュートリアルでは、サンプルとして、AWS EC2のOSログをエージェント経由で収集するための構成手順をご紹介します。同様の手順でオンプレミスのホストからログを取集する構成も可能です。 なお、チュートリアルの内容はOCIドキュメントをベースとしているため、記事内容や画面イメージが最新のものと異なる場合は、以下のOCIドキュメントをご確認ください。 ホストからの継続的なログ収集の設定 所要時間 : 30分 前提条件 : ・AWS EC2が作成されていること このチュートリアルでは、管理エージェントでサポートされているUbuntu 20.04のイメージを使用します。EC2からOCIへHTTPSでアクセス可能なネットワーク構成を設定してください。 ・Javaがインストールされていること 管理エージェントを動作させるにはJDK8以降が必要です。 Javaが未導入であれば、JDKをインストールし、JAVA_HOMEを設定してください。 ・Logging Analyticsが有効化されていること このチュートリアルでは、オンボーディング機能を使用してポリシーやLogging Analyticsのリソースが作成済みであることを前提としています。 オンボーディング機能についてはこちらの記事を参照ください。 ポリシーやリソースの作成はマニュアルで設定しても問題ありません。 マニュアルで設定する場合は以下のドキュメントを参照ください。 前提条件のIAMポリシー 管理エージェントを使用した継続的なログ収集の許可 このチュートリアルでは管理者権限を持つユーザーを前提としています。 ユーザーにアクセス制御を設定する場合は以下のドキュメントを参照ください。 ログ・アナリティクスのIAMポリシー・カタログ 1. 管理エージェントのダウンロード OCIコンソールのホーム画面左上のメニューから「監視および管理」を選択し、 「管理エージェント」の「ダウンロードとキー」をクリックします。 「LINUXのエージェント (x86_64)」のZIPファイルをダウンロードします。 ダウンロードのぺージを下にスクロールすると、オンボーディング機能により作成されたキーが表示されていますので、「キーをクリップボードにコピー」を選択し、メモしておきます。これは後ほどレスポンスファイルの作成で使用します。 2. レスポンスファイルの作成 インストールの際に管理エージェントが参照するレスポンスファイル（クレデンシャル情報などのパラメータを記述したもの）を作成します。 $ vi /tmp/input.rsp 補足： レスポンスファイルは、その他ユーザーからの読み取りが許可されている必要があります。管理エージェントがインストールされると mgmt_agent というユーザーが自動作成され、レスポンスファイルを参照するためです。なお、レスポンスファイルを配置するディレクトリには、その他ユーザーからの読み取り/実行権限が必要です。このチュートリアルでは、例として/tmp に配置しています。 レスポンスファイルには以下のパラメータを記載します。 managementAgentInstallKey = コピーしておいたキーの値（必須）...","categories": [],
        "tags": [],
        "url": "/ocitutorials/management/logginganalytics_logcollection4externalhost/",
        "teaser": "/ocitutorials/management/logginganalytics_logcollection4externalhost/LA_LogcollectionFromEC2_18.png"
      },{
        "title": "Logging Analytics：OCIコンピュートからOSのログを収集する",
        "excerpt":"このチュートリアルでは、OCIコンピュートからOSのログをエージェント経由で取得するための設定手順をご紹介します。 所用時間：30分 前提事項： ・OCIコンピュートが作成済であること このチュートリアルではOSはOracle Linux 8を前提としています。 ・Logging Analyticsが有効化されていること このチュートリアルでは、オンボーディング機能を使用してポリシーやLogging Analyticsのリソースが作成済みであることを前提としています。 オンボーディング機能についてはこちらの記事を参照ください。 ポリシーやリソースの作成はマニュアルで設定しても問題ありません。 マニュアルで設定する場合は以下のドキュメントを参照ください。 前提条件のIAMポリシー 管理エージェントを使用した継続的なログ収集の許可 このチュートリアルでは管理者権限を持つユーザーを前提としています。 ユーザーにアクセス制御を設定する場合は以下のドキュメントを参照ください。 ログ・アナリティクスのIAMポリシー・カタログ 1. OCIコンピュートの管理エージェントを有効化する OCIコンピュートの詳細画面で「Oracle Cloudエージェント」タブを開き、 「管理エージェント」を有効化します。 OCIコンソールのメニューから「監視および管理」を選択し、 「管理エージェント」の「エージェント」をクリックします。 管理エージェントが有効になっていると、以下のようにアクティブとして表示されます。 エージェント名をクリックして詳細画面へ進みます。 「プラグインのデプロイ」をクリックし、「Logging Analytics」にチェックを入れます。 2. ポリシーの変更 オンボーディングで自動作成されるポリシーの一部を変更します。 OCIコンソールのメニューから「アイデンティティとセキュリティ」を選択し、「ドメイン」をクリックして詳細画面へ進みます。 「Default」ドメイン内にある「動的グループ」を編集します。 一致ルールを「下で定義したいずれかのルールに一致」に変更します。 アイデンティティのトップ画面に戻り、「ポリシー」をクリックして詳細画面へ進みます。 「logging_analytics_automatic_injection_policies」を編集します。 以下のようにポリシーのWhere句を in tenancy に変更します。 Note オンボーディング機能では、管理エージェントを「Management-Agents」というコンパートメントで管理するように自動設定されますが、OCIコンピュートで有効化する管理エージェントはOCIコンピュートと同じコンパートメントに割り当てられるため、管理エージェントがLogging Analyticsへログをアップロードできるようにするためには、上記のようにポリシーを変更する必要があります。 3. 管理エージェントがOSのログファイルを読み取るための権限を付与する OSへログインし、setfaclやchmodなどのコマンドで、エージェントにログファイルの読み取り権限を付与します。 権限付与の方法については以下のドキュメントを参照ください。 ホストのエージェント・ユーザーへのログに対するREADアクセス権の付与...","categories": [],
        "tags": [],
        "url": "/ocitutorials/management/logginganalytics_logcollection4ocivm/",
        "teaser": "/ocitutorials/management/logginganalytics_logcollection4ocivm/LA_logcollection4ocivm-22.png"
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
        "title": "Stack Monitoring を使用してBaseDBのメトリックを可視化する",
        "excerpt":"チュートリアル概要 : このチュートリアルでは、Stack Monitoring を使用して BaseDB のメトリック監視を有効化するまでのステップをご紹介します。 所要時間 : 約60分 前提条件1 : テナンシ上で以下のリソースが作成済であること コンパートメント ユーザー ユーザーグループ VCN BaseDB 前提条件2 : Stack Monitoringが有効化済みであること こちらを参考にStack Monitoringを有効化できます。 1. 管理エージェントのインストール Stack Monitoring でモニターするメトリック情報は管理エージェントにより取得されるので、OCIコンソールから管理エージェントをダウンロードし管理エージェントをBaseDBにインストールします。 1.1 管理エージェントのインストール OCIコンソールの画面左上ハンバーガーメニューから「監視および管理」を選択し、以下のように進んでください。 管理エージェント &gt; ダウンロードとキー LINUXのエージェント（X86_64）をダウンロードします。 インストールに必要なキーを作成します。 下記の情報を設定し、「作成」をクリックします。 キー名：任意の名前 コンパートメント：任意のコンパートメント 最大インストール：任意の値 有効期限：任意の期間 3点リーダーから「キーをファイルにダウンロード」をクリックして作成したキーをダウンロードします。 JDK8のインストール 管理エージェントのインストールにはJDK8が必要なのでインストールされていない場合はこちらからLinux版のJDKをダウンロードして、インストールします。 SSHでBase DBにログインします。 $ ssh –i...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/stack_monitoring_basedb/",
        "teaser": null
      },{
        "title": "Stack Monitoring を使用して OCI Compute のメトリックを可視化する",
        "excerpt":"チュートリアル概要 : このチュートリアルでは、Stack Monitoring を使用して OCI Compute のメトリック監視を有効化するまでのステップをご紹介します。 所要時間 : 約20分 前提条件 : テナンシ上で以下のリソースが作成済であること コンパートメント ユーザー ユーザーグループ VCN OCI Compute (Oracle Linux) 1. 管理エージェントの有効化 Stack Monitoring でモニターするメトリック情報は管理エージェントにより取得されます。OCI Compute のプラットフォーム・イメージに標準でインストールされているクラウド・エージェントのプラグインを使用して、管理エージェントを有効化します。 管理エージェント有効化したいインスタンスの管理画面で「Oracle Cloudエージェント」に移動し、管理エージェントが無効となっている場合は有効にします。 2. 動的グループの作成 OCIコンソールの画面左上ハンバーガーメニューから「アイデンティティとセキュリティ」を選択し、以下のように進んでください。 アイデンティティ &gt; ドメイン &gt; お使いのドメイン（通常はDefault） &gt; 動的グループ 「動的グループの作成」をクリックし、以下のように入力します。 動的グループ名：Management_Agent_Dynamic_Group 説明：管理エージェント有効化のための動的グループ 一致ルール：下に定義したいずれかのルールに一致 ルール1には以下のステートメントを記入します。 “ocid1.compartment.oc1.examplecompartmentid”は、監視対象の Compute が配置されているコンパートメントのOCIDに置き換えてください。 ALL...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/stack_monitoring_install/",
        "teaser": null
      },{
        "title": "Stack Monitoringでメトリック拡張を設定する",
        "excerpt":"チュートリアル概要 : このチュートリアルでは、Stack Monitoring のメトリック拡張を設定する手順をご紹介します。 所要時間 : 約30分 前提条件1 : テナンシ上で以下のリソースが作成済であること コンパートメント ユーザー ユーザーグループ VCN 対象リソース 前提条件2 : Stack Monitoring が有効化済みであること こちらを参考にStack Monitoringを有効化できます。 前提条件3 : Stack Monitoringで対象リソースが監視されていること こちらを参考にStack Monitoring でBaseDB を監視できます。 こちらを参考にStack Monitoring でCompute を監視できます。 1.メトリック拡張の作成 本チュートリアルでは例としてデータベースに登録されているユーザー数を取得するメトリックを追加します。 「メトリック拡張の作成」をクリックします。 メトリック拡張のプロパティの項目は以下のように設定します。 名前：ME_任意の名前 表示名：任意の表示名 収集方法のプロパティは以下のように設定します。 リソース・タイプ：コンテナDB 収集方法：SQL 収集頻度：任意の時間 SQL問合せ：SELECT COUNT(*) from ALL_USERS; リソースタイプと収集方法について...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/stack_monitoring_metric_extention/",
        "teaser": null
      },{
        "title": "Stack Monitoring オンボーディング",
        "excerpt":"チュートリアル概要 :  このチュートリアルでは、Stack Monitoringのオンボーディングプロセスについて説明します。 この機能を使うことで、ポリシーやグループの作成などを省力化でき、すぐにStack Monitoringを開始できます。   所要時間 : 約10分    1. オンボーディングプロセスの実行   OCIコンソールの画面左上ハンバーガーメニューから「監視および管理」を選択し、以下のように進みます。     アプリケーション・パフォーマンス・モニタリング &gt; スタック・モニタリング          Stack Monitoringで監視したいコンパートメントを選択します。（テナント全体であればルートを選択） 「エンタープライズ・サマリー」の画面にある「スタック・モニタリングの有効化」をクリックします。        以下の画面が表示されるので「次」へ進んで「設定」をクリックします。        以上で、Stack Monitoringを開始するための準備は完了しました。   2. 作成されたリソースの確認   OCIコンソールの画面左上ハンバーガーメニューから以下のように進みます。     アイデンティティとセキュリティ &gt; ポリシー     オンボーディングを実行したコンパートメントに「StackMonitoringPolicyEasyOnboarding」という名前のポリシーが作成されています。        内容を確認すると、オンボーディングで作成されたポリシーが定義されています。        OCIコンソールの画面左上ハンバーガーメニューから以下のように進みます。     アイデンティティとセキュリティ &gt; ドメイン &gt; Default (現在のドメイン) &gt; 動的グループ     動的グループが2つ作成されています。        その他、ユーザーグループも作成されていますが、ユーザーポリシー同様使用については任意のため、必要に応じて利用してください。   ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/stack_monitoring_onboarding/",
        "teaser": null
      },{
        "title": "Stack Monitoringでプロセス監視を設定する",
        "excerpt":"チュートリアル概要 : 本チュートリアルでは、Stack Monitoring のプロセスベースのカスタム・リソースを設定しホストで実行されているプロセスを監視する手順をご紹介します。 所要時間 : 約20分 前提条件1 : テナンシ上で以下のリソースが作成済であること コンパートメント ユーザー ユーザーグループ VCN 対象リソース 前提条件2 : Stack Monitoring が有効化済みであること こちらを参考にStack Monitoringを有効化できます。 前提条件3 : Stack Monitoringで対象リソースが監視されていること こちらを参考にStack Monitoring でBaseDB を監視できます。 こちらを参考にStack Monitoring でCompute を監視できます。 1.プロセス・セットの作成 本チュートリアルではコンピュートで実行されているnginxのプロセスを監視するための設定をご紹介します。 プロセスを監視するためのプロセス・セットは、プロセスのモニターから作成できます。 プロセスセットの作成をクリックします。 プロセス・セットのプロパティは以下のように設定します。 表示名：任意の名前 ラベル：nginx-main-process プロセス・コマンド：nginx プロセス・ライン行正規表現パターン：nginx: master.* ターゲット・ホスト：プロセスを実行している監視対象のリソース リソースタイプと収集方法について プロセス・ユーザーはプロセスを実行中のユーザーの名前がある場合は指定します。 プロセス・セットのプロパティを設定したら、「作成してマップ」クリックします。 プロセスセットを設定したリソースのトポロジから作成したプロセスセットをクリックします。...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/stack_monitoring_process_set/",
        "teaser": null
      },{
        "title": "Base Database ServiceでDatabase Managementを有効化する",
        "excerpt":"OCI Observability &amp; Managementのサービスの1つ、Database Managementでは、Enterprise Managerで提供されているパフォーマンス分析の機能を中心に、Oracle DBのパフォーマンスを監視することが可能です。本章では、OCIのDatabase Cloud ServiceでDatabase Managementを有効化する手順を紹介します。Base DBでDatabase Managementを有効化する場合、エージェントレスで利用を開始することが出来ます。 所要時間 : 約50分 前提条件 : OCIのBaseDBが1インスタンス作成されていること BaseDBのインスタンスの作成方法はその8-クラウドでOracle Databaseを使うをご参照ください。 注意 : ※監視対象のBaseDBがStandard Editionの場合、Database Managementの一部機能をご利用いただけませんのでご注意ください。 1. IAMポリシーの作成 Database Managementを利用するためにはOCIの他のサービスと同様に、IAMポリシーによってアクセス権限が付与されている必要があります。 以下のポリシーをテナンシで作成してください。 1-1. ユーザーがDatabase Managementを利用するためのポリシー allow group &lt;IAＭグループ名&gt; to MANAGE dbmgmt-family in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to MANAGE database-family in tenancy/compartment...","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/dbcs-database-management/",
        "teaser": "/ocitutorials/management/dbcs-database-management/dbmgmt1.png"
      },{
        "title": "Logging Analytics オンボーディング",
        "excerpt":"チュートリアル概要  オンボーディングで設定可能なLogging Analyticsの構成は次の2つになります。     ホストログの継続的な取得   OCI監査ログの継続的な取得   このチュートリアルでは、OCI監査ログを取得するところまでの手順を紹介します。   所用時間：10分       前提条件  オンボーディングを使用するためにはOCIテナント管理者レベルの権限が必要です。       設定の流れ  OCIコンソールの左上のメニューから「監視および管理」を選択し、  「ログ・アナリティクス」をクリックします。         Logging Analyticsがまだ有効化されていない場合、以下のような画面になります。  「ログ・アナリティクスの使用の開始」をクリックします。         Logging Analyticsを有効化するためのポリシーが自動作成され、「logging_analytics_automatic_service_policies」という名前で保存されます。  また、ログ・グループ「Default」が作成されます。         次の取得の設定画面では、ホストログの継続的な収集と、OCI監査ログの継続的な収集を有効化するかどうか、チェックボックスが表示されます。 ここでは、2つとも有効化する前提でチェックを入れた状態で次をクリックして進みます。            「logging_analytics_automatic_ingestion_policies」という名前で必要なポリシーが作成されます。         ログの収集に必要なリソースが作成されます。設定完了後、収集されたOCI監査ログを確認するため「ログ・エクスプローラに移動」をクリックします。            1分ほど待つと、ログ・エクスプローラにOCI監査ログが表示されます。         次にダッシュボードの一覧から「OCI Audit Analysis」をクリックします。  これはデフォルトで作成済のOCI監査ログ用のダッシュボードです。         OCI監査ログの状況がダッシュボードで直感的に確認できます。         以上、OCI監査ログを取り込み、ログ・エクスプローラやダッシュボードで表示するための手順でした。ホストのログを継続的に収集する具体的な手順については別のトピックでご紹介します。   ","categories": [],
        "tags": ["management"],
        "url": "/ocitutorials/management/logginganalytics_onboarding/",
        "teaser": "/ocitutorials/management/logginganalytics_onboarding/LA_Onboarding-10.png"
      },{
        "title": "OCIのBase Database ServiceでOperations Insightsを有効化する",
        "excerpt":"OCI Observability &amp; Managementのサービスの1つ、Operations Insightsでは、Oracle Databaseのデータを長期保存し、機械学習による分析でリソースの需要分析と将来値の予測、パフォーマンス問題を検出することができます。Operations Insightsを利用することで、リソース配分の最適化によるコストの削減、パフォーマンスの向上などを図ることが可能です。 この章では、OCIのBase Database Service（以下BaseDB）でOperations Insightsを有効化する手順をご紹介します。Operations Insightsを有効化するためにエージェントなどをインストールする必要はなく、OCIコンソールからの操作で有効化することができます。 所要時間 : 約20分 前提条件 : 101: Oracle CloudでOracle Databaseを使おう（BaseDB）を通じて、BaseDBインスタンスの作成が完了していること 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. IAMポリシーの作成 Operations Insightsを利用するためにはOCIの他のサービスと同様に、IAMポリシーによってアクセス権限が付与されている必要があります。 以下のポリシーをテナンシで作成してください。 ※この章では、ユーザーにOperations Insightsの管理権限を付与します。ユーザーはログ・アナリティクスの構成やログファイルのアップロード、削除を含む全ての管理権限を行うことができます。ドキュメント を参考にユーザーの役割、ロールごとにIAMポリシーの権限を調整してください。 allow group &lt;IAMグループ名&gt; to manage opsi-family in tenancy allow group &lt;IAMグループ名&gt; to use database-family in tenancy...","categories": [],
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
        "title": "OCI Database ManagementのSQLチューニング・アドバイザでパフォーマンス・チューニングをする",
        "excerpt":"チュートリアル概要 : このチュートリアルでは、OCI Database ManagementのSQLチューニング・アドバイザでSQLのパフォーマンス・チューニングをする手順をご紹介します。 所要時間 : 約60分 前提条件1 : テナンシ上で以下のリソースが作成済であること コンパートメント ユーザー ユーザーグループ VCN BaseDB 前提条件2 : Database Management が有効化済みであること こちらを参考にDatabase Managementを有効化できます。 注意 監視対象のBaseDBがStandard Editionの場合、SQLチューニング・アドバイザを含むパフォーマンスに関連する機能をご利用いただけませんのでご注意ください。 1.データの作成 Oracle Databaseにはトレーニングやデモに使用できるサンプル・スキーマが提供されています。 今回はサンプル・スキーマとして提供されているSHスキーマに対してSQL文を実行し、チューニング・アドバイザでパフォーマンスを改善する手順をご紹介します。 1.1 サンプル・スキーマのダウンロード こちらからデータベースのバージョンに合わせたスクリプトをダウンロードし、oracleディレクトリに配置します。（今回はBaseDBのバージョンが19.2なのでOracle Database Sample Schemas 19.2をダウンロード） 1.2 PDBの接続先情報を追加 tnsnames.oraにPDBの接続情報がない場合は、PDBの接続情報を追加します。 Base DBにログインし、oracleユーザに切り替えます。 $ sudo su - oracle tnsnames.oraファイルを編集し、以下の内容を追記します。 $ vi...","categories": [],
        "tags": [],
        "url": "/ocitutorials/management/database-management_tuning-advisor/",
        "teaser": null
      },{
        "title": "これはODのCloud Optimization Initiativeのページです",
        "excerpt":"これはODのCloud Optimization Initiativeのページです     ","categories": [],
        "tags": [],
        "url": "/ocitutorials/od_cso_initiative/od_cso_initiative_sample/",
        "teaser": null
      },{
        "title": "OCI Search Service for OpenSearch を使って検索アプリケーションを作成しよう",
        "excerpt":"OCI Search Service for OpenSearch を使って検索アプリケーションを作成する Oracle Cloud Infrastructure Search Service with OpenSearch は、OpenSearch に基づいてアプリケーション内検索ソリューションを構築するために使用できるマネージド・サービスであり、インフラストラクチャの管理に集中することなく、大規模なデータセットを検索し、結果をミリ秒で返すことができます。 ハンズオンの流れは以下となります。 OpenSearch クラスターのプロビジョニング クラスタへの接続 データセットのアップロード アプリケーションの作成とデプロイメント アプリケーションのテスト 前提条件 クラウド環境 Oracle Cloud のアカウントを取得済みであること OCI チュートリアル その 2 - クラウドに仮想ネットワーク(VCN)を作る  を通じて仮想クラウド・ネットワーク(VCN)の作成が完了していること OCI チュートリアル その 3 - インスタンスを作成する  を通じてコンピュートインスタンスの構築が完了していること ハンズオン環境のイメージ 1. OpenSearch クラスターのプロビジョニング OpenSearch クラスタは、OpenSearch 機能を提供するコンピュート・インスタンスのセットです。各インスタンスはクラスタ内のノードです。ノードのタイプは、インスタンスによって実行される機能およびタスクを決定するものです。各クラスタは、1 つ以上のデータ・ノード、マスター・ノードおよび OpenSearch...","categories": [],
        "tags": ["opensearch"],
        "url": "/ocitutorials/opensearch/search-application-for-beginners/",
        "teaser": null
      },{
        "title": "エッジポリシーのWeb Application Firewallのログを分析する",
        "excerpt":"OCIでは、OCI Load Balancerに直接デプロイするWAF、”WAFポリシー”と、お客様のアプリケーションのドメインに構築するWAF、”エッジポリシー”の2種類のWAFを提供しています。 本チュートリアルでは、「OCI Web Application Firewallのエッジポリシーを使ってWebサーバを保護する」の続編として、エッジポリシー内のログをObject Storageを経由してLogging Analyticsに転送し、ログを分析する手順を紹介します。 所要時間： 約40分（SRによる対応を除く） 前提条件： OCIチュートリアル「OCI Web Application Firewallのエッジポリシーを使ってWebサーバを保護する」を参考に、エッジポリシーの作成が完了していること OCI CLIコマンドがインストール、構成されていること Logging Analyticsが有効化されていること OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。 ユーザーがLogging Analyticsを使用するためのポリシーが作成されていること。ポリシーの詳細はOCIチュートリアル「OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する」もしくは、ドキュメントをご参照ください。 ユーザーにObject Storageの管理権限がIAMポリシーで付与されていること。ポリシーの詳細はドキュメント「オブジェクト・ストレージへのWAFログの配信」をご参照ください。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. Object Storageバケットの作成 エッジポリシー内のログの転送先となるObject Storageを作成します。 エッジポリシーのログは、SRをあげることで指定したObject Storageに転送することが可能です。 OCIコンソール画面左上のメニュー → ストレージ　→ オブジェクト・ストレージとアーカイブ・ストレージ　→ バケット　→　「バケットの作成」ボタンをクリックします。 表示された「バケットの作成」画面にて、任意のバケット名を入力し、「作成」ボタンをクリックします。 ※その他の項目はデフォルトのままで構いません。 バケットを作成したら、バケットの可視性をプライベートからパブリックに変更します。 作成したバケットの詳細画面を開き、画面左上の「可視性の編集」ボタンをクリックします。 「可視性の編集」画面にて「パブリック」を選択し、「変更の保存」ボタンをクリックします。 バケットの作成、可視性の編集が完了したら、この後の手順でSRを作成する際にバケットの情報が必要になるため、バケット名とネームスペースをメモします。...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/security/waf-v1-loganalytics/",
        "teaser": "/ocitutorials/security/waf-v1-setup/edge1.png"
      },{
        "title": "OCI Load Balancerに直接アタッチするタイプのWeb Application Firewallのログを分析する",
        "excerpt":"OCIでは、OCI Load Balancerに直接デプロイするWAF、”WAFポリシー”と、お客様のアプリケーションのドメインに構築するWAF、”エッジポリシー”の2種類のWAFを提供しています。 本チュートリアルでは、「OCIのLoad BalancerにアタッチするタイプのWeb Application Firewallを構築する」の続編として、有効化したログをOCIのログ分析サービス「Logging Analytics」に転送し、ログを可視化、分析する手順を紹介します。 所要時間 : 約20分 前提条件 : 「OCI Load Balancerに直接アタッチするタイプのWeb Application Firewallを構築する」を参考に、WAFポリシーの作成およびログの有効化（手順3）が完了していること Logging Analyticsが有効化されていること OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。 ユーザーがLogging Analyticsを使用するためのポリシーが作成されていること。ポリシーの詳細はOCIチュートリアル「OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する」もしくは、ドキュメントをご参照ください。 ユーザーがService Connectorを作成するためのポリシーが作成されていること。ポリシーの詳細はドキュメントをご参照ください。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. ログ・グループの作成 WAFポリシーのログの転送先となるLogging Analyticsの「ログ・グループ」を作成します。 Logging Analyticsではログを「ログ・グループ」単位で管理することができます。 OCIコンソール画面左上のメニュー → 監視および管理 → ログ・アナリティクス → 管理 → ログ・グループ → 「ログ・グループの作成」ボタンをクリックします。 表示された「ログ・グループの作成」画面にて、任意のログ・グループ名を入力し、「作成」ボタンをクリックします。...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/security/waf-v2-loganalytics/",
        "teaser": "/ocitutorials/security/waf-v2-setup/wafv2-19.png"
      },{
        "title": "OCI Load Balancerに直接アタッチするタイプのWeb Application Firewallを構成する",
        "excerpt":"OCIでは、OCI Load Balancerに直接デプロイするWAF、”WAFポリシー”と、お客様のアプリケーションのドメインに構築するWAF、”エッジポリシー”の2種類のWAFを提供しています。 本チュートリアルでは、OCIのLoad Balancerに直接デプロイする”WAFポリシー”を作成し、実際のWAFの動作を確認します。 所要時間 : 約1時間 前提条件 : 「応用編 - ロードバランサーでWebサーバーを負荷分散する」を参考に、WebサーバーおよびOCIのロードバランサ―が構成されていること 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. IAMポリシーの作成 Web Application Firewallを使用するためには、操作を実行するユーザーに以下のポリシーが付与されている必要があります。 allow group &lt;IAMグループ名&gt; to manage waas-family in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to manage web-app-firewall in tenancy/compartment &lt;コンパートメント名&gt; allow group &lt;IAMグループ名&gt; to manage waf-policy in tenancy/compartment &lt;コンパートメント名&gt;...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/security/waf-v2-setup/",
        "teaser": "/ocitutorials/security/waf-v2-setup/wafv2-19.png"
      },{
        "title": "OCI Network Firewallの動作を検証する",
        "excerpt":"OCI Network FirewallはOracle Cloud Infrastructure (OCI) のクラウドネイティブなマネージド・ファイアウォールです。 パロアルトネットワークスの次世代ファイアウォール技術を基に、IDPSを始めURLフィルタリングやTLS/SSL検査などの高度なセキュリティ機能を提供しています。 本チュートリアルでは、Network Firewallポリシーの設定方法と動作検証を行います。具体的には、以下の機能の設定を実施します。 パケットフィルタリング URLフィルタリング IDPS（侵入検知・防御システム） また侵入検知のため、ポートスキャンや簡易的なインジェクション攻撃を行います。ご自身の管理下にないサーバーや、本番環境に対しては使用しないでください。ツールを使用したことによりトラブルや損失が発生した場合についても責任を負いかねます。 所要時間 : 約40分 前提条件 : ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細はドキュメントを参照ください。 OCIチュートリアル「OCI Network Firewallを構築する」にて、Network Firewallが動作できる環境が作成されていること。 (インバウンドおよびアウトバウンドへの通信を行います。そのため、インターネットからNetwork Firewallを経由してOCI内のインスタンスにアクセスできること、OCI内のインスタンスからNetwork Firewallを経由してインターネットへ出ていけることができれば大丈夫です) 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 ファイアウォール・ポリシーについて Network Firewallではトラフィックの許可/拒否、検査の設定を「ファイアウォール・ポリシー」にて行います。 各Network Firewallは必ず1つのファイアーウォール・ポリシーに紐づける必要がありますが、1つのファイアーウォール・ポリシーを複数のNetwork Firewallに紐づけることができます。 ポリシー内に該当ルールがない場合、トラフィックは拒否されるため、通信を行うには最低1つのルールの設定を行う必要があります。 ポリシーの各項目ルール 以下、ポリシーにて設定することができるルールについてそれぞれ簡単に説明します。 ・復号化ルール 特定のソースや宛先に対するトラフィックを復号する設定を行います。 復号を行う場合は、適用するための「復号化プロファイル」と「マップされたシークレット」を事前に設定する必要があります。 1つのポリシーに設定できる復号化ルールの最大数は1,000です。 ・セキュリティ・ルール セキュリティ・ルールは、トラフィックの許可・ブロック、または脅威検知・防御を行うための設定です。 ルールは、ソース・宛先アドレス、URLなどに基づいて適用され、以下のリストを利用して条件を定義します。 「アプリケーション・リスト」：ICMPまたはICMPv6 「サービス・リスト」：TCP/UDPおよびポート番号...","categories": [],
        "tags": ["security"],
        "url": "/ocitutorials/security/networkfirewall-policycheck/",
        "teaser": "/ocitutorials/security/networkfirewall-setup/nfw88.png"
      },{
        "title": "ハブアンドスポーク構成でOCI Network Firewallを構築する",
        "excerpt":"「OCI Network Firewall」はパロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォールとなっており、URLフィルタリングやTSL/SSL検査などの機能を提供します。 OCI Network Firewallの説明につきましてはOCIチュートリアル「OCI Network Firewallを構築する」を参照ください。 本チュートリアルではOCI Network Firewallがをハブアンドスポーク構成で構築します。 所要時間 : 約80分 (このうちNetwork Firewallインスタンスの作成に40分ほどかかります) 前提条件 : ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細はドキュメントを参照ください。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 はじめに 以下が本チュートリアルで作成するNetwork Firewallの構成図と設定です。 ルーティング設定が少々複雑ですので、設定についてまず確認したい方は「（補足）ルーティングについて」を先にご覧ください。 1. ネットワーク構築 1-1. VCNの作成 構成図に沿って、ハブのVCN１つとスポークのVCN２つの計３つのVCNを作成します。 OCIコンソール画面にアクセスし、左上の[メニューボタン] → [ネットワーキング] → [仮想クラウド・ネットワーク] と移動、「VCNの作成」を選択します。 各VCNを以下のように設定します ハブVCN 名前：hub-vcn-tutorial コンパートメント：&lt;VCNを作成するコンパートメントを選択&gt; IPv4 CIDR blocks：10.0.0.0/24 スポークVCN1 名前：spoke01-vcn-tutorial コンパートメント：&lt;VCNを作成するコンパートメントを選択&gt; IPv4...","categories": [],
        "tags": ["security"],
        "url": "/ocitutorials/security/networkfirewall-setup-hubspoke/",
        "teaser": "/ocitutorials/security/networkfirewall-setup-hubspoke/hubspoke02.png"
      },{
        "title": "トンネル検査構成でOCI Network Firewallを構築する",
        "excerpt":"「OCI Network Firewall」はパロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォールとなっており、URLフィルタリングやTSL/SSL検査などの機能を提供します。 OCI Network Firewallの説明につきましてはOCIチュートリアル「OCI Network Firewallを構築する」を参照ください。 Network Firewallは通信経路を仲介する形（インライン）で構成しますが、本チュートリアルで扱います「トンネルインスペクション」は通信経路の外部から監視する形（アウトオブバンド）で構成することが可能です。そのため、既存の通信経路に変更を加えずに、経路外部からトンネル検査という形でIDSを行うことができます。 本チュートリアルでは始めに、簡易的な通信経路を用意し、その後「トンネル検査」構成を構築していく流れで進めていきます。 所要時間 : 約90分 (このうちNetwork Firewallインスタンスの作成に40分ほどかかります) 前提条件 : ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細はドキュメントを参照ください。 使用サービス Compute Instance Network Load Balancer OCI Network Firewall VTAP 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 はじめに 以下が本チュートリアルで作成するNetwork Firewallの構成図と設定です。 手順の流れとして、まずは以下のような簡易的な事前環境を作成し、その環境に後付けでNetwork Firewallを構築していきます。 1. 事前環境の作成 こちらの手順１では、まず事前環境として、上で示しました構成を構築していきます。 1-1. VCNの作成 [VCNウィザードの起動] を選択 [インターネット接続性を持つVCNの作成] を選択します。 以下の項目を入力し、[次]を選択します。 基本情報...","categories": [],
        "tags": ["security"],
        "url": "/ocitutorials/security/networkfirewall-setup-tunnelinspection/",
        "teaser": "/ocitutorials/security/networkfirewall-setup-tunnelinspection/tunnel00.png"
      },{
        "title": "OCI Network Firewallを構築する",
        "excerpt":"OCI Network Firewallは2022年7月にリリースされた、パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール・サービスです。 主な機能として、URLフィルタリングやTLS/SSL検査などを提供します。 本チュートリアルではOCI Network Firewallが動作するための環境を構築し、簡単なテストにて動作を確認します。 所要時間 : 約70分 前提条件 : ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細はドキュメントを参照ください。 注意 : 本チュートリアル内の画面ショットは、OCIのコンソール画面と異なる場合があります。 0. はじめに ・実施内容 以下が本チュートリアルで作成するNetwork Firewallの構成図です。 OCI環境を出入りする通信はNetwork Firewallを経由し、監視および検査が行われます。 本チュートリアルでは動作テストのためにOCI内にWEBサーバーを準備した後ウィルステストファイルを配置し、外部からの通信がNetwork Firewallによってブロックされることを確認するところまでを行います。 ・Network Firewallの概要 Network Firewallは次世代ファイアウォールとして、TLSトラフィックも含め、通過するすべてのリクエストを検査し、ユーザーが構成したファイアウォール・ポリシー・ルールに基づいて、許可、拒否、ドロップ、侵入検出、防止などのアクションを実行します。 より詳細な情報はこちらをご参照ください 主なユースケース Palo Alto Networksの脅威シグネチャおよび脅威分析エンジンを活用し、脆弱性攻撃やマルウェア、C&amp;Cサーバーなどの脅威を検知・防御。 不正なアウトバウンド通信を識別し、機密データの流出を抑止。 ・ルーティングについて インターネット経由でパブリックサブネット内のインスタンスに到達する通信は、インターネットゲートウェイのルート表に基づき、NFWサブネット内のNetwork Firewallを通過します。その後、検査済みトラフィックがパブリックサブネット内のインスタンスに転送されます。 パブリックサブネット内のインスタンスから発生する通信も、ルート表の設定によりNetwork Firewallを通過します。検査済みの通信は、NFWサブネットのルート表ルールを基にインターネットゲートウェイを介して外部へ送信されます。 1. ネットワークの構築 1-1. VCNの作成 OCIコンソール画面にアクセスし、左上の [メニューボタン] → [ネットワーキング] → [仮想クラウド・ネットワーク]...","categories": [],
        "tags": ["security"],
        "url": "/ocitutorials/security/networkfirewall-setup/",
        "teaser": "/ocitutorials/security/networkfirewall-setup/nfw00.png"
      },{
        "title": "OCI Web Application Firewallのエッジポリシーを使ってWebサーバを保護する",
        "excerpt":"OCIにはエッジポリシーとWAFポリシーの2種類のWeb Application Firewallがあります。 本チュートリアルでは、OCI世界各リージョンのエッジに設定されているWAFサーバにデプロイするタイプの「エッジポリシー」を実際に作成して、Webアプリケーションへの攻撃を検知、防御しているところを確認します。 所要時間： 約90分 前提条件： ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細はドキュメントをご参照ください。 Webアプリケーションのドメインを取得していること 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 ※本チュートリアルはOCI上でコンピュートを立ち上げてWebサーバーをインストールするところから始めます。既に手元にWebサーバがインストールされ、ドメインが構成されている環境がある場合は手順4から始めてください。 1. コンピュートインスタンスの作成 OCIチュートリアル入門編「その3-インスタンスを作成する」を参考に、Webサーバ用のコンピュートインスタンスを1つ作成する。 2. Webサーバのインストールと起動 sshでインスタンスにアクセスする。 インスタンスへのsshでのアクセス方法が不明な場合は、「その3 - インスタンスを作成する」を参考にしてください。 Apache HTTPサーバーをインストールする。 sudo yum -y install httpd TCPの80番(http)および443番(https)ポートをオープンにする。 sudo firewall-cmd --permanent --add-port=80/tcp sudo firewall-cmd --permanent --add-port=443/tcp ファイアウォールを再ロードする。 sudo firewall-cmd --reload Webサーバーを起動する。 sudo systemctl start httpd ブラウザからWebサーバーにアクセスできることを確認する。...","categories": [],
        "tags": ["security"],
        "url": "/ocitutorials/security/waf-v1-setup/",
        "teaser": "/ocitutorials/security/waf-v1-setup/edge1.png"
      },{
        "title": "OCI Network FirewallのSSLインスペクション（転送プロキシモード）を行う",
        "excerpt":"OCI Network Firewallは2022年7月にリリースされた、パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール・サービスです。 主な機能として、URLフィルタリングやSSL/TLS検査などを提供します。 本チュートリアルではOCI Network Firewallの機能の一つであるSSLインスペクションを設定し、簡単なテストにて動作を確認します。 所要時間 : 約60分 前提条件 : ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細はドキュメントを参照ください。 OCIチュートリアル「OCI Network Firewallを構築する 」にて、以下のNetwork Firewallが動作する環境が構築されていること。 本チュートリアルでは、動作確認にWindowsインスタンスを使用します。ただし、Linuxインスタンスでもcurlコマンドを使用して確認が可能です。 ネットワーク・ファイアーウォール・ポリシーからOCI Vaultサービスへのアクセスを許可するため、以下のIAMポリシーが作成されていること。 Allow any-user to read secret-family in compartment &lt;compartment_ID&gt; where ALL {request.principal.type='networkfirewallpolicy'} アクセスできるネットワーク・ファイアーウォール・ポリシーを限定したい場合は以下のように作成します。 Allow any-user to read secret-family in compartment &lt;compartment_ID&gt; where ALL {request.principal.type='networkfirewallpolicy', request.principal.id='&lt;Network Firewall Policy OCID&gt;'} 注意 :...","categories": [],
        "tags": ["security"],
        "url": "/ocitutorials/security/networkfirewall-sslinspect-fwd/",
        "teaser": "/ocitutorials/security/networkfirewall-sslinspect-fwd/sslfwd00.png"
      },{
        "title": "OCI Network FirewallのSSLインスペクション（インバウンド検証モード）を行う",
        "excerpt":"OCI Network Firewallは2022年7月にリリースされた、パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール・サービスです。 主な機能として、URLフィルタリングやSSL/TLS検査などを提供します。 本チュートリアルではOCI Network Firewallの機能の一つであるSSLインスペクションを設定し、簡単なテストにて動作を確認します。 所要時間 : 約60分 前提条件 : ユーザーに必要なIAMポリシーが割り当てられていること。ポリシーの詳細はドキュメントを参照ください。 OCIチュートリアル「OCI Network Firewallを構築する 」にて、以下のNetwork Firewallが動作する環境が構築されていること。 ネットワーク・ファイアーウォール・ポリシーからOCI Vaultサービスへのアクセスを許可するため、以下のポリシーが作成されていること。 Allow any-user to read secret-family in compartment &lt;compartment_ID&gt; where ALL {request.principal.type='networkfirewallpolicy'} アクセスできるネットワーク・ファイアーウォール・ポリシーを限定したい場合は以下のように作成します。 Allow any-user to read secret-family in compartment &lt;compartment_ID&gt; where ALL {request.principal.type='networkfirewallpolicy', request.principal.id='&lt;Network Firewall Policy OCID&gt;'} 注意 : 本チュートリアル内の画面ショットは、OCIのコンソール画面と異なる場合があります。...","categories": [],
        "tags": ["security"],
        "url": "/ocitutorials/security/networkfirewall-sslinspect-inb/",
        "teaser": "/ocitutorials/security/networkfirewall-sslinspect-inb/sslinb00.png"
      },{
        "title": "OCI Network Firewallのログを分析する",
        "excerpt":"パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール「OCI Network Firewall」が2022年7月にリリースされました。「OCI Network Firewall」はURLフィルタリングやTSL/SSL検査などの機能を提供します。 本チュートリアルでは、「OCI Network Firewallを構築する」の続編として、Network Firewallのログを分析し、Network Firewallを通過するトラフィックの傾向、脅威の有無を確認します。 Network Firewallのログの収集にはLoggingサービス、分析にはOCIが提供するログ分析サービス「Logging Analytics」を使用します。 Logging Analyticsでは、様々なOCIサービスのログ、Oracle製品のログに対応したログの解析文が用意されていますが、Network Firewallのログにはまだ対応していないので、本チュートリアルではNetwork Firewallのログに対応した解析文をカスタムで作成します。 通常はLoggingサービスで収集したログは「Service Connector Hub」と呼ばれるサービスを使用して、直接Logging Analyticsに連携することも可能です。しかし、今回はLoggingサービスから直接Logging Analyticsにログを転送してしまうと、カスタムで作成したログの解析文でログを読み取ることが出来なくなってしまうため、Loggingサービスのログを一度Object Storageに転送します。 Object Storageに格納されたログは、Logging Analyticsの「ObjectCollectionRule」と呼ばれるルールを作成することで、Logging Analyticsに転送されます。 所要時間 : 約60分 前提条件 : Logging Analyticsが有効化されていること OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。 ユーザーがLoggingサービスを使用するためのポリシーが作成されていること。ポリシーの詳細はドキュメントをご参照ください。 ユーザーがLogging Analyticsを使用するためのポリシーが作成されていること。ポリシーの詳細はOCIチュートリアル「OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する」もしくは、ドキュメントをご参照ください。 ユーザーがService Connectorを作成するためのポリシーが作成されていること。ポリシーの詳細はドキュメントをご参照ください。 OCIチュートリアル「OCI Network Firewallを構築する」を参考に、Network Firewallインスタンスの作成およびコンピュートインスタンス（LinuxまたはWindows）の作成が終わっていること OCIチュートリアル「OCI Network FirewallのIPS/IDS機能を検証する」を参考に、侵入検知（IDS）もしくは侵入防止（IPS）のセキュリティ・ルールが設定されていること OCIチュートリアル「コマンドライン(CLI)でOCIを操作する」を参考に、OCI...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/security/networkfirewall-loganalytics/",
        "teaser": "/ocitutorials/security/networkfirewall-loganalytics/nfwla39.png"
      },{
        "title": "Vaultサービスを使ってBase Databaseをユーザー管理の暗号鍵で暗号化する",
        "excerpt":"OCI Vaultはユーザーがセキュアに暗号鍵や、パスワードなどの”シークレット”を管理、運用できる鍵管理サービスです。 通常、OCIのオブジェクト・ストレージやブート・ボリュームなどのストレージサービスは、デフォルトでオラクルが管理する暗号鍵で暗号化されます。 OCI Vaultサービスを使用すると、ストレージサービスの暗号化に使用する暗号鍵を、オラクル管理の暗号鍵からユーザー管理の暗号鍵に変更することができます。 また、OCI Vaultサービスを利用するメリットとして、OCI IAMや監査ログによるアクセス管理、FIPS 140-2 Security Level 3の要件への対応、ユーザーによる暗号鍵のローテーションやバックアップを実施することができる、などが挙げられます。 OCI Vaultサービスで管理できる暗号鍵の暗号化アルゴリズムなどの詳細はドキュメントをご参照ください。 本チュートリアルでは、Vaultサービスでユーザー管理の暗号鍵を使用してBase Databaseを暗号化する手順を紹介します。 所要時間 : 約20分 前提条件 : OpenSSLをクライアント端末、もしくは任意のLinuxの環境にインストールしていること（本チュートリアルではデフォルトでOpenSSLがインストールされているCloud Shellを使用します） OCIチュートリアル「Vaultを作成し 顧客管理の鍵をインポートする」を参考にVaultと暗号鍵を作成し、インポートしていること。マスター暗号キーはAESを指定します。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. Vaultの準備 OCIチュートリアル「Vaultを作成し 顧客管理の鍵をインポートする」を参考にVaultと暗号鍵を作成し、インポートしてください。前述のチュートリアル記事通り、マスター暗号化キーはAESを指定して作成してください。 2. Base Databaseインスタンスの作成 OCIコンソール　→ Oracle Database → Oracleベース・データベース・サービス　→　「DBシステムの作成」ボタンをクリックします。 　 OCIチュートリアルOracle Database編「101:Oracle Cloud上でOracle Databaseを使おう」を参考に、DBシステムの作成画面の各項目を入力、選択します。 DBシステムの作成画面の「データベース情報」画面の一番下の「拡張オプションの表示」を選択します。 暗号化のタブを開き、「顧客管理キーの使用」をチェックします。 顧客管理キーの使用について、確認画面が表示されるので「はい、顧客管理キーを有効化します」を選択します。...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/security/vault-basedatabase/",
        "teaser": "/ocitutorials/security/vault-basedatabase/vault-basedatabase01.png"
      },{
        "title": "Vaultサービスを使ってコンピュート・インスタンスのブート・ボリュームをユーザー管理の暗号鍵で暗号化する",
        "excerpt":"OCI Vaultはユーザーがセキュアに暗号鍵や、パスワードなどの”シークレット”を管理、運用できる鍵管理サービスです。 通常、OCIのオブジェクト・ストレージやブート・ボリュームなどのストレージサービスは、デフォルトでオラクルが管理する暗号鍵で暗号化されます。 OCI Vaultサービスを使用すると、ストレージサービスの暗号化に使用する暗号鍵を、オラクル管理の暗号鍵からユーザー管理の暗号鍵に変更することができます。 また、OCI Vaultサービスを利用するメリットとして、OCI IAMや監査ログによるアクセス管理、FIPS 140-2 Security Level 3の要件への対応、ユーザーによる暗号鍵のローテーションやバックアップを実施することができる、などが挙げられます。 OCI Vaultサービスで管理できる暗号鍵の暗号化アルゴリズムなどの詳細はドキュメントをご参照ください。 本チュートリアルでは、Vaultサービスでユーザー管理の暗号鍵を使用してコンピュート・インスタンスのブート・ボリュームを暗号化する手順を紹介します。 所要時間 : 約20分 前提条件 : OpenSSLをクライアント端末、もしくは任意のLinuxの環境にインストールしていること（本チュートリアルではデフォルトでOpenSSLがインストールされているCloud Shellを使用します） OCIチュートリアル「Vaultを作成し 顧客管理の鍵をインポートする」を参考にVaultと暗号鍵を作成し、インポートしていること。マスター暗号キーはAESを指定します。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. Vaultの準備 OCIチュートリアル「Vaultを作成し 顧客管理の鍵をインポートする」を参考にVaultと暗号鍵を作成し、インポートしてください。前述のチュートリアル記事通り、マスター暗号化キーはAESを指定して作成してください。 2. IAMポリシーの作成 Vaultサービスに格納された暗号鍵を指定してブート・ボリュームを作成するには、ブート・ボリュームがVaultサービスにアクセスする権限が必要です。 コンピュート・インスタンスを作成するコンパートメントにて、以下IAMポリシーを作成します。 allow service blockstorage to use keys in compartment &lt;コンパートメント名&gt; 3. コンピュート・インスタンスの作成 OCIコンソール　→　コンピュート　→ インスタンス　→...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/security/vault-compute/",
        "teaser": "/ocitutorials/security/vault-compute/vault-compute06.png"
      },{
        "title": "Vaultサービスを使ってObject Storageをユーザー管理の暗号鍵で暗号化する",
        "excerpt":"OCI Vaultはユーザーがセキュアに暗号鍵や、パスワードなどの”シークレット”を管理、運用できる鍵管理サービスです。 通常、OCI上のストレージサービスは、デフォルトでオラクルが管理する暗号鍵で暗号化されます。 OCI Vaultサービスを使用すると、ストレージサービスの暗号化に使用する暗号鍵を、オラクル管理の暗号鍵からユーザー管理の暗号鍵に変更することができます。 また、OCI Vaultサービスを利用するメリットとして、OCI IAMや監査ログによるアクセス管理、FIPS 140-2 Security Level 3の要件への対応、ユーザーによる暗号鍵のローテーションやバックアップを実施することができる、などが挙げられます。 OCI Vaultサービスで管理できる暗号鍵の暗号化アルゴリズムなどの詳細はドキュメントをご参照ください。 本チュートリアルでは、Vaultサービスでユーザー管理の暗号鍵を使用してObject Storageを作成する手順について紹介します。 所要時間 : 約20分 前提条件 : OpenSSLをクライアント端末、もしくは任意のLinuxの環境にインストールしていること（本チュートリアルではデフォルトでOpenSSLがインストールされているCloud Shellを使用します） OCIチュートリアル「Vaultを作成し 顧客管理の鍵をインポートする」を参考にVaultと暗号鍵を作成し、インポートしていること。マスター暗号キーはAESを指定します。 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. Vaultの準備 OCIチュートリアル「Vaultを作成し 顧客管理の鍵をインポートする」を参考にVaultと暗号鍵を作成し、インポートしてください。前述のチュートリアル記事通り、マスター暗号化キーはAESを指定して作成してください。 2. IAMポリシーの作成 Vaultサービスに格納された暗号鍵を指定してObject Storageを作成するには、Object StorageがVaultサービスにアクセスする権限が必要です。 Object Storageを作成するコンパートメントにて、以下IAMポリシーを作成します。 allow service objectstorage-&lt;リージョン名&gt; to use keys in compartment &lt;コンパートメント名&gt;...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/security/vault-objectstorage/",
        "teaser": "/ocitutorials/security/vault-objectstorage/vault-oss09.png"
      },{
        "title": "Vaultを作成し 顧客管理の鍵をインポートする",
        "excerpt":"OCI Vaultはユーザーがセキュアに暗号鍵や、パスワードなどの”シークレット”を管理、運用できる鍵管理サービスです。 通常、OCI上のストレージサービスは、デフォルトでオラクルが管理する暗号鍵で暗号化されます。 OCI Vaultサービスを使用すると、ストレージサービスの暗号化に使用する暗号鍵を、オラクル管理の暗号鍵からユーザー管理の暗号鍵に変更することができます。 また、OCI Vaultサービスを利用するメリットとして、OCI IAMや監査ログによるアクセス管理、FIPS 140-2 Security Level 3の要件への対応、ユーザーによる暗号鍵のローテーションやバックアップを実施することができる、などが挙げられます。 OCI Vaultサービスで管理できる暗号鍵の暗号化アルゴリズムなどの詳細はドキュメントをご参照ください。 本チュートリアルでは、ユーザー管理の暗号鍵を作成し、Vaultサービスへインポートする手順について紹介します。 所要時間 : 約20分 前提条件 : OpenSSLをクライアント端末、もしくは任意のLinuxの環境にインストールしていること（本チュートリアルではデフォルトでOpenSSLがインストールされているCloud Shellを使用します） 注意 : ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。 1. Vaultの作成 OCIコンソール → アイデンティティとセキュリティ → ボールト → 「ボールトの作成」ボタンをクリックします。 Vaultの作成画面で任意の名前を入力し、「ボールトの作成」ボタンをクリックします。 1~2分でボールトの作成が完了し、ステータスがアクティブになります。 2. 暗号鍵の作成とインポート 作成したボールトの詳細画面の「キーの作成」ボタンをクリックします。 「キーの作成」画面にて任意の名前を入力し、「外部キーのインポート」にチェックを入れます。 ※キーのシェイプ、アルゴリズムはデフォルトのAES, 256ビットのまま進めます。 ラッピング・キー情報が表示されるので、「公開ラッピング・キー」をコピーします。 Cloud Shellなど、OpenSSLがインストールされている環境で公開ラッピング・キーをpemファイルとして保存します。 $ vi publickey.pem...","categories": [],
        "tags": ["intermediate"],
        "url": "/ocitutorials/security/vault-setup/",
        "teaser": "/ocitutorials/security/vault-setup/vault-setup02.png"
      },{
        "title": "Cloud Guardを使ってみる",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/security/cloudguard-setup/",
        "teaser": null
      },{
        "title": "Oracle Data Safe チュートリアルまとめ",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。   1.Oracle Data Safeを有効化する   2.Oracle Data Safeのデータ・マスキングを試してみる   3.Oracle Data Safeのアクティビティ監査で操作ログを記録する   4.Oracle Data Safeにフェデレーッド・ユーザーでアクセスする   5.プライベートIPアドレスでData SafeにDBを登録する   6.Oracle Data SafeでオンプレミスのOracle DBを管理する   ","categories": [],
        "tags": [],
        "url": "/ocitutorials/security/datasafe-tutorial/",
        "teaser": null
      },{
        "title": "Security Zoneを有効化する",
        "excerpt":"このチュートリアルは外部のページで紹介しています。リンク先のページをご覧ください。  ","categories": [],
        "tags": [],
        "url": "/ocitutorials/security/securityzone-setup/",
        "teaser": "/ocitutorials/ocitutorials/security/securityzone-setup/securityzone01.png"
      },{
        "title": "トラブル解決に向けた技術サポート(SR)活用のコツ",
        "excerpt":"本資料の目的 : この文書は、お客様がトラブル解決のために技術サポート（Support RequestまたはService Request、以下SRと略します）を効果的に活用するためのポイント、記載すべき項目、伝える際の注意事項をまとめたものです。サポート側は、個々の問い合わせに誠実に取り組み、解決に向けて最善の努力を尽くします。サポート側とお客様が協力し合うことは、トラブルの早期解決に寄与します。これらはすべて任意の内容ですので、必ずしも全てを実施しなければならないわけではありません。なにをどこまで参考にするかはそれぞれのご判断で取り入れていただけますようお願いします 前提条件 : OCIを利用するお客様・パートナー様のエンジニア向け。ただし技術サポートツールの「操作方法」については本文書には含みませんので、下記各種ガイドをご参照ください (製品別サポート窓口／ご利用ガイド) (新クラウドサポートポータル (My Oracle Cloud Support) のご案内（PDF)) (Oracle Cloud Supportご利用ガイド（PDF)) 目次 1. トラブル解決に向けた全体像と技術サポート(SR)の位置付け 1.1 トラブル解決とは 1.2 トラブル解決までの流れ 1.3 関係者の役割分担と相互協力 2. SRを用いたトラブル解決のコツ 2.1 やりとりの回数を減らすために 2.2 待ち時間を短くするために 3. SR起票のコツ 3.1 落ち着いて状況を整理する(テンプレートの利用) 3.2 確定／送信前にチェックする(起票時のチェックリスト)　 所要時間： 約10分 1. トラブル解決に向けた全体像と技術サポート(SR)の位置付け 1.1 トラブル解決とは 目の前で発生している「問題事象」を解決するためには、まず当然ながら、その「被疑箇所」を特定し、発生原因を明らかにします。その後、暫定的な回避策を適用し、同時に恒久的な対策が有効であることを確認・実施して、トラブルを解決できたと言えます 1.2 トラブル解決までの流れ 「問題事象の切り分け」や「ログ取得」などの各工程は、解決後に振り返ると一本道の活動のように見えるかもしれません。実際には、解決の過程において、ログを読み込み・分析し、さまざまな可能性を推定しながら疑義箇所を絞り込み・判断するなど、原因が特定できるまでは、追加調査や再調査が必要で、反復的な工程が含まれることがあります 1.3...","categories": [],
        "tags": [],
        "url": "/ocitutorials/support-service/tips-support-cust-success/",
        "teaser": "/ocitutorials/support-service/tips-support-cust-success/img1mos.png"
      },{
        "title": "その1 - OCIコンソールにアクセスして基本を理解する",
        "excerpt":"Oracle Cloud Infrastructure を使い始めるにあたって、コンソール画面にアクセスし、ログインを行います。 また、Oracle Cloud Infrastructure のサービスを利用するのにあたって必要なサービス・リミット、コンパートメントやポリシーなどのIAMリソースおよびリージョンについて、コンセプトをコンソール画面の操作を通じて学習し、理解します。 所要時間 : 約25分 前提条件 : 有効な Oracle Cloud Infrastructure のテナントと、アクセスのための有効なユーザーIDとパスワードがあること 無償トライアル環境のお申込みについては こちら の資料を参照してください。 注意 : チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります image サポートされるブラウザの確認 このチュートリアルでは、Oracle Cloud Infrastructure のコンソール画面からの操作を中心に作業を行います。 サポートされるブラウザを確認し、いずれかのブラウザをローカル環境にインストールしてください。 ログイン情報の確認 コンソールにアクセスするにあたり、ログイン情報の入力が必要になります。ログイン情報には以下のものが含まれます。 テナント名(クラウド・アカウント名) - Oracle Cloud Infrastructure を契約したり、トライアル環境を申し込んだ際に払い出される一意のID ユーザー名 - ログインのためのユーザー名 パスワード - ログインのためのパスワード ログイン情報の入手方法は、ユーザーが作られるタイミングによって異なります。...","categories": [],
        "tags": [],
        "url": "/ocitutorials/webapp/01-getting-started/",
        "teaser": null
      }]
