---
title: "OCI Network Firewallのログを分析する"
excerpt: "本チュートリアルは「OCI Network Firewallを構築する」の続編として、Network Firewallのログを収集し、分析します。"
order: "120"
layout: single
tags:
 - intermediate
header:
 teaser: "/security/networkfirewall-loganalytics/nfwla39.png"
 overlay_image: "/security/networkfirewall-loganalytics/nfwla39.png"
 overlay_filter: rgba(34, 66, 55, 0.7)

---

パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール「OCI Network Firewall」が2022年7月にリリースされました。「OCI Network Firewall」はURLフィルタリングやTSL/SSL検査などの機能を提供します。
本チュートリアルでは、「[OCI Network Firewallを構築する](/ocitutorials/security/networkfirewall-setup/)」の続編として、Network Firewallのログを分析し、Network Firewallを通過するトラフィックの傾向、脅威の有無を確認します。

Network Firewallのログの収集にはLoggingサービス、分析にはOCIが提供するログ分析サービス「Logging Analytics」を使用します。

Logging Analyticsでは、様々なOCIサービスのログ、Oracle製品のログに対応したログの解析文が用意されていますが、Network Firewallのログにはまだ対応していないので、本チュートリアルではNetwork Firewallのログに対応した解析文をカスタムで作成します。

通常はLoggingサービスで収集したログは「Service Connector Hub」と呼ばれるサービスを使用して、直接Logging Analyticsに連携することも可能です。しかし、今回はLoggingサービスから直接Logging Analyticsにログを転送してしまうと、カスタムで作成したログの解析文でログを読み取ることが出来なくなってしまうため、Loggingサービスのログを一度Object Storageに転送します。
Object Storageに格納されたログは、Logging Analyticsの「ObjectCollectionRule」と呼ばれるルールを作成することで、Logging Analyticsに転送されます。


**所要時間 :** 約60分

**前提条件 :**
+ Logging Analyticsが有効化されていること
- OCIコンソールのメニューボタン→監視および管理→ログ・アナリティクス→ログ・エクスプローラを選択し、「ログ・アナリティクスの使用の開始」を選択することで、Logging Analyticsを有効化させることができます。
![画面キャプチャ5](nfwla5.png)
+ ユーザーがLoggingサービスを使用するためのポリシーが作成されていること。ポリシーの詳細は[ドキュメント](https://docs.oracle.com/ja-jp/iaas/Content/Identity/Reference/loggingpolicyreference.htm)をご参照ください。
+ ユーザーがLogging Analyticsを使用するためのポリシーが作成されていること。ポリシーの詳細はOCIチュートリアル「[OCIのLogging AnalyticsでOCIの監査ログを可視化・分析する](/ocitutorials/intermediates/audit-log-analytics/)」もしくは、[ドキュメント](https://docs.oracle.com/ja-jp/iaas/logging-analytics/doc/prerequisite-iam-policies.html#GUID-4CA8D8F4-2218-4C14-AF73-40111C459270)をご参照ください。
+ ユーザーがService Connectorを作成するためのポリシーが作成されていること。ポリシーの詳細は[ドキュメント](https://docs.oracle.com/ja-jp/iaas/Content/Identity/Reference/serviceconnectorhubpolicyreference.htm)をご参照ください。
+ OCIチュートリアル「[OCI Network Firewallを構築する](/ocitutorials/security/networkfirewall-setup/)」を参考に、Network Firewallインスタンスの作成およびコンピュートインスタンス（LinuxまたはWindows）の作成が終わっていること
+ OCIチュートリアル「[OCI Network FirewallのIPS/IDS機能を検証する](/ocitutorials/security/networkfirewall-idps/)」を参考に、侵入検知（IDS）もしくは侵入防止（IPS）のセキュリティ・ルールが設定されていること
+ OCIチュートリアル「[コマンドライン(CLI)でOCIを操作する](/ocitutorials/intermediates/using-cli/)」を参考に、OCI CLIコマンドのインストールと構成が終わっていること。


**注意 :**
+ ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。

<br>

# 1. OCI Network Firewallのログの有効化

本手順では、Network Firewallインスタンスのログを有効化します。
Network Firewallでは、以下2種類のログを出力します。
+ **Traffic Log:** Network Firewallインスタンスを通過したトラフィックを記録したログ。
+ **Threat Log:** Network Firewallによって脅威が検知されたトラフィックの詳細情報（脅威の内容など）を記録したログ。

本チュートリアルでは、Traffic LogとThreat Logの両方を有効化し、分析します。

OCIチュートリアル「[OCI Network Firewallを構築する](/ocitutorials/security/networkfirewall-setup/)」で作成したネットワーク・ファイアウォール詳細画面の左下の「リソース」から、「ログ」を選択します。
Threat Logの「無効」となっているボタンをクリックします。
 ![画面ショット1](nfwla1.png)


表示された「ログの有効化」画面にて、以下項目を入力し、「ログの有効化」ボタンをクリックします。
+ **`コンパートメント`** - 任意
+ **`ログ・グループ`** - 「新規ログ・グループの作成」を選択
+ **`ログ・グループ名`** - 任意 例）NFW_LOG
+ **`ログ名`** - 任意
+ **`ログの保持`** - 任意

 ![画面ショット3](nfwla3.png)


同様にTraffic Logも有効化します。
+ **`コンパートメント`** - 任意
+ **`ログ・グループ`** - Threat Log有効化時に作成したログ・グループを選択
+ **`ログ名`** - 任意
+ **`ログの保持`** - 任意

 ![画面ショット4](nfwla4.png)


<br>

# 2. ログ・グループの作成

転送先となるLogging Analyticsの「ログ・グループ」を作成します。

OCIコンソール画面左上のメニュー → 監視および管理 → ログ・アナリティクス → 管理 → ログ・グループ → 「ログ・グループの作成」ボタンをクリックします。

表示された「ログ・グループの作成」画面にて、任意のログ・グループ名を入力し、「作成」ボタンをクリックします。
 
 ![画面ショット19](nfwla19.png)


<br>

# 3. Service Connectorの作成

Service Connector Hubというサービスを使用して、Loggingサービスに保管されているOCI Network Firewallのログを、手順2で作成したログ・グループに転送します。

Logging Analyticsでは200種類以上のログに対応したログの解析文（パーサー）があらかじめ定義されているため、解析文が事前定義されているログはLogging Analyticsに取り込むことですぐに分析することが可能です。
また、解析文が定義されていないログも、ユーザーがカスタムで解析文を作成することが可能です。

本チュートリアルで分析するOCI Network FirewallのTrafficログ、Threatログも解析文がオラクルによってあらかじめ定義されているので、ログをLogging Analyticsに転送します。

OCIコンソール画面左上のメニュー → 監視および管理 → ロギング → サービス・コネクタ → 「サービス・コネクタ」の作成ボタンをクリックします。

表示された「サービス・コネクタの作成」画面にて、以下項目を入力し、「作成」ボタンをクリックします。

+ **`コネクタ名`** - 任意 例）NFWTrafficLog Connector
+ **`説明`** - 任意 例）OCI Network Firewallログの転送
+ **`リソース・コンパートメント`** - Network Firewallのログが保管されているLoggingサービスのコンパートメントを選択
+ **`ソース`** - ロギング
+ **`ターゲット`** - ログ・アナリティクス


**ソースの構成**

 + **`ログ・グループ`** - 手順1で作成したLoggingサービスのログ・グループを選択
 + **`ログ`** - 手順1で有効化したOCI Network FirewallのTrafficログを選択

「+別のログ」をクリックし、Network FirewallのThreatログも追加します

 + **`ログ・グループ`** - 手順1で作成したLoggingサービスのログ・グループを選択
 + **`ログ`** - 手順1で有効化したOCI Network FirewallのThreatログを選択

 ![画面ショット9](nfwla9.png)

**ターゲットの構成**

 + **`コンパートメント`** - 手順2でLogging Analyticsのログ・グループを作成したコンパートメントを選択
 + **`ログ・グループ`** - 手順2で作成したログ・グループを選択
 + **このサービス・コネクタによるコンパートメント○○のログ・アナリティクスへの書き込みを許可するデフォルト・ポリシーを作成します** の「作成」ボタンをクリック
 ![画面ショット10](nfwla10.png)


以上でService Connectorの作成は完了です。

指定したLoggingサービスのログが、指定されたLogging Analyticsのログ・グループに転送されるようになります。

データの転送状況などは、作成したサービス・コネクタ詳細画面左下のリソース → 「メトリック」からご確認いただくことが可能です。

 ![画面ショット11](nfwla11.png)

<br>


# 4. OCI Network Firewallのダッシュボード定義のインポート


本チュートリアルでは、ユーザーがカスタムで予め作成したダッシュボードの定義をエクスポートしたjsonファイルを、各自環境にインポートします。

※ログの出力フォーマットは変更する可能性があります。GitHub上にあるダッシュボード定義は2023年5月1日時点のNetwork Firewall各種ログに対応したものになります。

OCI Network Firewallログのダッシュボード定義ファイルは以下GitHubにあります。

+ [ダッシュボード定義](https://github.com/jennylia3/oci-networkfirewall-tutorial/blob/main/NFWDashboard.json)


OCIコンソール画面左上のメニュー → 監視及び管理 → ログ・アナリティクス → ダッシュボードをクリックします。
ダッシュボード画面の「Import Dashboards」をクリックし、GitHubからダウンロードしたJSONファイルを選択します。

 ![画面ショット50](nfwla50.png)


表示された「Import Dashboards」の画面にて、それぞれ以下を選択します。
+ **`Compartments for dashboards`** - 「Specify a compartment for all dashboards」を選択
+ **`Choose a Compartment`** - 手順2でロググループを作成したコンパートメントを選択
+ **`Compartments for saved searches`** - 「Specify a compartment for all saved searches」を選択
+ **`Choose a Compartment`** - 手順2でログ・グループを作成したコンパートメントを選択

 ![画面ショット49](nfwla49.png)

「Import」ボタンをクリックします。

ダッシュボード画面にて、「OCI Network Firewall Dashboard」ダッシュボードが作成されていることを確認します。

 ![画面ショット17](nfwla17.png)

<br>


# 5. ログの分析

OCIコンソール画面左上のメニュー → 監視および管理 → ログ・アナリティクス → ログ・エクスプローラーにて、「Network Firewall Traffic Log」をクリックすると、Network Firewall Traffic Logが一覧で表示されます。
 
 ![画面ショット29](nfwla29.png)


一覧で表示されたログコンテンツを更に拡張表示し、ログの解析文（ログ・パーサー）によってログの中身のフィールドが識別されていることを確認します。

 ![画面ショット30](nfwla30.png)


解析文によって定義されている「フィールド」に基づいて、ログを可視化、分析することが出来ます。

## 5-1. Network Firewallへのアクセス元地域を世界地図で表示する（例1）

ビジュアライゼーションメニューのドロップダウンボックスをクリックし、地球儀のマークを選択します。
 
 ![画面ショット32](nfwla32.png)

Network Firewall インスタンスへのアクセス元のクライアント情報を基に、世界地図上でどの国からアクセスがあったかを確認することができます。
 
 ![画面ショット33](nfwla33.png)

世界地図下に表示されているリストで、「logrecords」の隣の▼をクリックすると、リストをログレコード数の昇順/降順表示に切り替えることができます。
以下スクリーンショットでは、オランダからのアクセスが最も多いことが分かります。
 
 ![画面ショット34](nfwla34.png)


また、ログ・エクスプローラー画面左の「フィールド」から、「Log Source」を選択し、使用可能なログソース一覧を表示します。その中から、「Network Firewall Traffic Log」のチェックを外し、「Network Firewall Threat Log」にチェックをいれて「適用」ボタンをクリックします。
 
 ![画面ショット35](nfwla35.png)

Network Firewallを通過したトラフィックのうち、脅威が検出されたアクセスのクライアント情報に基づき、脅威のアクセス元を確認することができます。
 
 ![画面ショット36](nfwla36.png)

<br>

## 5-2. 脅威の重要度を可視化する（例2）

Network Firewall Threat Logには検出された脅威の重要度が出力されます。Network FirewallのSeverityは以下の5種類があります。
+ Informational
+ Low
+ Medium
+ High
+ Critical

ログ・エクスプローラー画面左のフィールドから、「Severity」を選択すると各重要度の脅威がどれくらい検出されているかを確認することができます。
 
 ![画面ショット37](nfwla37.png)

スクリーンショットではSeverityが「Medium」のログが147件出力されていることが分かります。

Severityは”Critical”のものが一番緊急度が高いものとされているので、”Critical”のログが出力されていないか、Network Firewall Threat Logを定期的に監視するのも有効です。
必要に応じて”Critical”のログが出力されたらアラートを受け取ることも可能です。Logging Analyticsでアラートを生成する手順については[ドキュメント](https://docs.oracle.com/ja-jp/iaas/logging-analytics/doc/create-schedule-run-saved-search.html#GUID-A37A3F93-BE74-4850-859D-C8D293781036)をご参照ください。


<br>

## 5-3. ダッシュボードを利用する（例3）

OCIコンソール画面左上のメニュー → 監視および管理 → ログ・アナリティクス → ダッシュボードを選択し、手順4でインポートしたダッシュボードを選択します。
 
 ![画面ショット17](nfwla17.png)

以下のようなダッシュボードが表示されます。
 
 ![画面ショット39](nfwla39.png)



+ **脅威アクセス元マップ**

脅威が検出された「Network Firewall Threat Log」のクライアント情報を基に、世界地図で脅威のアクセス元を確認することができます。

 ![画面ショット40](nfwla40.png)


+ **国別脅威数Top10**

脅威が検出された「Network Firewall Threat Log」のクライアント情報を基に、脅威のアクセス元となっている各国における脅威の種類を示しています。
アメリカからの脅威では、”info-leak”（情報漏洩）の脅威が100%を占めていることが分かります。
 
 ![画面ショット41](nfwla41.png)


+ **検出された不正なアクティビティ**

検出された脅威の種類と、各脅威が何回検出されたかを確認することができます。
 
 ![画面ショット42](nfwla42.png)


+ **脅威が検出されたアクセス**

脅威が検出されたアクセス（Network Firewall Threat Log）の出力数の傾向を確認することができます。特定の時間帯で突然出力数が増えているなど、傾向の異常の確認にお役立ていただけます。
 
 ![画面ショット43](nfwla43.png)


+ **国別アクセス数Top10**

最も脅威が検出された回数が多いアクセス元の国の上位10を確認することができます。
 
 ![画面ショット44](nfwla44.png)



また、必要に応じてダッシュボードの中身は編集することができます。
ログ・エクスプローラーにてダッシュボードに追加したい検索結果を表示し、画面左上の「アクション」→ 「名前をつけて保存」をクリックします。
 
 ![画面ショット45](nfwla45.png)

「検索の保存」画面にて、任意の検索名を入力し「ダッシュボードに追加」にチェックを入れます。
追加先のダッシュボードを選択し、「保存」することで既存のダッシュボードに新しいビューを追加することができます。
 
 ![画面ショット46](nfwla46.png)


また、ダッシュボード画面の左上の「Action」から、「Edit」を選択することで、ダッシュボードの中身のウィジェットを削除したり、位置を編集することも可能です。
 
 ![画面ショット47](nfwla47.png)

必要に応じて、「Actions」から「Print」を選択することで、ダッシュボードをPDFに出力することもできます。


<br>

# 6. 補足

## 6-1. Service Connectorの非アクティブ化、削除方法について

手順3で作成したService ConnectorはOCIコンソール上から、非アクティブ化することができます。非アクティブ化することで、Loggingサービスから指定されたObject Object Storageへのログの転送をとめることが可能です。

非アクティブ化は、作成したService Connectorの詳細画面の上部にある「非アクティブ化」ボタンをクリックすることで実現可能です。
 
 ![画面ショット48](nfwla48.png)

また、Service Connectorの詳細画面の上部の「削除」ボタンをクリックすることで、Service Connectorを削除することができます。



以上でLogging AnalyticsでNetwork Firewallのログ分析は終了です。
手順7で紹介した方法以外にも、様々な可視化オプションを用いてログを可視化したり分析することが可能ですので、是非実際に触ってみてください。