---
title: "506: サポートサービスへの問い合わせ(Service Requestの起票)"
excerpt: "サービス・リクエストを挙げる手順や、スムーズなサポートを受けるためのコツを紹介していきます。"
order: "3_506"
layout: single
header:
  teaser: "/adb/adb506-sr/img1.jpg"
  overlay_image: "/adb/adb506-sr/img1.jpg"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

<a id="anchor0"></a>

# はじめに

Oracle Cloud 製品をご利用のお客様は、ポータルサイト**「My Oracle Support (Cloud Support)」** を介して、Oracle製品に関するナレッジの検索や、製品仕様の確認、不具合に関するお問い合わせを行っていただけます。  
本ページでは、Autonomous Databaseを例に、そういった各種お問い合わせのための**サービス・リクエスト（Service Request ：SR）**の作成フローをご紹介します。

尚、実際の利用に際しては本ページ後半の参考資料に記載しております、弊社サポート部門からのガイドをご確認いただくようお願いいたします。

<br>

>Oracle Cloudでは通常契約の他に無償でお試しいただけるFree Tierを用意しています。Free Tierには期間/利用クレジットが限定される「30日間無償トライアル」とAlways Freeリソースを対象とした「常時無償サービス」が含まれますが、「常時無償サービス」のみご利用の場合はOracle Supportの対象にならず、問い合わせを上げることはできません。詳細はOracle Cloud Free Tierに関するFAQにて " Oracle Cloud Free Tierにはサービス・レベル契約（SLA）とテクニカル・サポートが含まれていますか? " をご覧ください。


>2021年初頭のサービス・アップデートにより、OCIコンソール画面からもSRを作成、閲覧、更新ができるようになりました。OCIコンソール画面からのSR起票については別の文書でご案内する予定です。本ページでは**「My Oracle Support (Cloud Support)」**を利用したSR起票について説明します。

<br>

**目次**

- [1.Cloud Supportのアカウントを用意する](#anchor1)
- [2.問い合わせ対象のAutonomous Databaseの情報を確認する](#anchor2)
   - [Domain name/Cloud Account nameの確認](#anchor2-1)
   - [Data Center Location、Database Name、Database OCID、Tenancy OCIDの確認](#anchor2-2)
      - [Oracle Cloud Infrastructureコンソールを利用する場合](#anchor2-2-1)
      - [SQLを利用する場合](#anchor2-2-2)
- [3.My Oracle Supportへログインし、サービス・リクエスト言語の設定をする](#anchor3)
- [4.Service Request（SR）を作成し必要項目を入力する](#anchor4)
- [5.ファイルの添付](#anchor5)
- [6.作成したSRの確認](#anchor6)
- [参考資料](#anchor7)

<br>

**所要時間:** 約30分

<br>

<a id="anchor1"></a>

# 1.Cloud Supportのアカウントを用意する

クラウドサポートのポータルサイト「My Oracle Support」を利用できるアカウントを用意します。

以下の資料を参照にご対応ください。サポートセンターのFAQからもリンクされています。

[Oracle Cloud Support ご利用ガイド ユーザー登録・管理 (PDF)](https://www.oracle.com/a/ocom/docs/cloud-1st-guide-user-2789085-ja.pdf)

<a id="anchor2"></a>

# 2.問い合わせ対象のAutonomous Databaseの情報を確認する

Autonomous DatabaseのSRを作成するときに、入力する情報を事前に確認します。

問題のタイプによって異なりますが、多くのケースで以下の情報が必要になります。

- **Domain name/Cloud Account name**　(Oracle CloudへログインするときのCloud Account）
- **Data Center Location**  （対象のAutonomous Databaseが作成されているリージョン）
- **Tenancy OCID**　（テナンシのOCID）
- **Database Name**　（Autonomous Database名）
- **Database OCID**　　（Autonomous DatabaseのOCID)

これらが記載されているかいないかで、初期調査の進捗に大きな影響を与えますので必ず準備するようにしてください。

それぞれの確認方法をみていきます。

<a id="anchor2-1"></a>

## Domain name/Cloud Account nameの確認

Oracle Cloudへサインインするときに入力する「Cloud Account Name」です。

   ![画面ショット1-1](img3.jpg)

<a id="anchor2-2"></a>

## Data Center Location、Database Name、Database OCID、Tenancy OCIDの確認

Oracle Cloud Infrastructureコンソール、または対象のAutonomous DatabaseにAdminユーザで接続できる場合はSQL文で確認することができます。

<a id="anchor2-2-1"></a>

### Oracle Cloud Infrastructureコンソールを利用する場合

対象のAutonomous Databaseのホームページおよび「テナンシー詳細」のページで確認できます。

- Autonomous Databaseのホームページ

   ![画面ショット1-1](img1.jpg)

- テナンシー詳細のページ

   ![画面ショット1-1](img2.jpg)

ナビゲーションメニューの「管理」→「テナンシ詳細」から確認することができます。

OCIDはOracle Cloud Infrastructureリソースを識別するための一意のIDです。ほとんどのタイプのリソースに割り当てられており、テナンシのOCIDの確認と同じように各リソースのページで確認することができます。

<a id="anchor2-2-2"></a>

### SQLを利用する場合

Autonomous DatabaseへADMINユーザで接続ができる場合は、Cloud Account以外の情報を以下のSQLで取得することができます。
Database Actionsから確認可能です。

```sql
   select cloud_identity from v$pdbs;
```

このような結果を取得できます。

   ![画面ショット1-1](img5.png)

問題を迅速に解決するためには、サポートとの正確な情報共有が不可欠です。

**環境情報のほかにもエラーメッセージや問題が発生した経緯、再現性などを整理してSRを作成することをお勧めします。またSR作成時にファイルを添付することもできますので、画面キャプチャ（スクリーンショット）などもご利用ください。<span style="color: red">可能な限りブラウザ上の情報は英語画面で取得いただきますようお願いいたします。</span>**

<a id="anchor3"></a>

# 3.My Oracle Supportへログインし、サービス・リクエスト言語の設定をする

1. 事前の情報確認が完了しましたら、[My Oracle Support(Cloud Support)](https://support.oracle.com/)へ「1.Cloud Supportのアカウントを用意する」で用意したアカウントでログインをします。

   ![画面ショット1-1](img10.jpg)

1. ログインした後は、**My Cloud Support**をクリックします。

   ![画面ショット1-1](img22.jpg)

1. **詳細**タブの**設定**をクリックします。

   ![画面ショット1-1](img20.jpg)

1. サービス・リクエスト言語を**Japanese**に変更後、**変更の適応**をクリックします。画面右上の**Cloud Support**に切り替えをクリック。

   ![画面ショット1-1](img21.jpg)

   「サービス・リクエスト言語の設定」を「Japanese」にしない場合は、英語でSRの更新がされます。ご注意ください。

   ログイン手順や環境の設定、SRの作成の流れは、サポートのFAQからもリンクされている以下の資料にまとめられております。詳細はそちらをご確認ください。

   [Oracle Cloud Support ご利用ガイド ユーザー登録・管理 (PDF)](https://www.oracle.com/a/ocom/docs/cloud-1st-guide-user-2789085-ja.pdf)

<a id="anchor4"></a>

# 4.Service Request（SR）を作成し必要項目を入力する

1. **サービス・リクエスト**を選択します。

   ![画面ショット1-1](img11.jpg)

1. 今回は、**技術的SRの作成を**クリックします。

   ![画面ショット1-1](img12.jpg)


1. 「技術的サービス・リクエストの作成」画面がポップアップします。

   ![画面ショット1-1](img13.jpg)

順に入力項目を説明していきます。

1. **サービス・タイプ**

   ドロップダウンリストから適切なサービスを選択します。Autonomous Databaseの場合は、専有タイプは「Autonomous Database Dedicated」共有タイプは「Autonomous Database on Shared Infrastructure」を選択します。

   サービス・タイプにて、問い合わせを実施したいサービスが表示されない場合は、該当するサポートIDでのアクセスが承認されていない可能性があります。「1.Cloud Supportのアカウントを用意する」の対応が行われているかご確認ください。

1. **サービス名**

   Cloud Supportにログインしているアカウントに紐づいたサポートIDのサービス名がリストから選択できるようになっています。適切なものを選択してください

1. **問題タイプ**

   問い合わせたい内容を選択します。多くの問題タイプでサブタイプがあります。作成するSRの目的に近いものを選択してください。

   問題タイプを選択すると、問題タイプにあわせてオプションの質問が下に表示されます。

1. **問題のサマリー**

   問い合わせの要旨を簡潔に全角33文字以内で記載してください。

1. **説明**

   問題の概要を全角666文字以内で記載してください

   Oracle Cloud Infrastructureコンソール上の操作やアプリケーションのエラーメッセージをお伝えいただくことでより円滑にサポートを行えるケースがございます。
   また、事象が発生した日時がある場合、タイムゾーン(JSTなのかUTCなのかなど)も付け加えて頂けるとスムーズにサポートを提供することが可能です。

   記載できる範囲で構いませんのでご記載くださいますようお願いいたします。

1. **オプションの質問**

   事前に確認した情報を記載していきます。

   ![画面ショット1-1](img14.jpg)

<a id="anchor5"></a>

# 5.ファイルの添付

入力が完了しましたら、そのまま「送信」することもできますが、添付ファイルを送信することが可能です。

スクリーンショットやエラーログファイルなどはこちらから添付してください。

   ![画面ショット1-1](img15.jpg)

画像を添付する際は、下記の条件に気をつけて下さい。

- 添付するファイルのファイル名にはマルチバイトを含めない（ファイル名は半角英数でお願いします。）
- OCIコンソールの画面ショットは該当部分だけを切り取らずブラウザ全体の情報を送る
- OCIコンソールの画面は<span style="color: red">言語を英語に変更してから</span>画面ショットを取得する

最後に「送信」をクリックすることでSRが作成されます。

<a id="anchor6"></a>

# 6.作成したSRの確認

ご登録いただいているメールアドレスにSRが作成された旨の通知や、SR更新の通知が届きます。

SRの状況はCloud Supportのサービスリクエストでご覧いただけます。

内容の確認やサポートへの更新はこちらの画面から行ってください。

   ![画面ショット1-1](img16.jpg)

<a id="anchor7"></a>

# 参考資料
実際の利用に際しては、以下弊社サポート部門からのガイドをご確認いただくようお願いいたします。

* [Oracle Cloud Support ご利用ガイド ユーザー登録・管理 (PDF)](https://www.oracle.com/a/ocom/docs/cloud-1st-guide-user-2789085-ja.pdf){:target=“_blank”}   
* [Oracle Cloud Support ご利用ガイド SR作成・管理 (PDF)](https://www.oracle.com/a/ocom/docs/cloud-1stguide-sr-2765641-ja.pdf){:target=“_blank”}   
* [Oracle CloudサポートについてのFAQ](https://blogs.oracle.com/supportjp/post/cloud-support-faq){:target=“_blank”}   

   <br>

以上で、この章の作業は終了です。


<br>
[ページトップへ戻る](#anchor0)