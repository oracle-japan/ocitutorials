---
title: "101 : Always Freeで23aiのADBインスタンスを作成してみよう"
excerpt: "Always Freeで23aiのADBインスタンスを作成する方法をご紹介します。"
order: "4_101"
layout: single
header:
  teaser: "/ai-vector-search/ai-vector101-always-free-adb/ai-vector101-teaser.png"
  overlay_image: "/ai-vector-search/ai-vector101-always-free-adb/ai-vector101-teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
---

<a id="anchor0"></a>

# はじめに

**Always Freeクラウド・サービス**は、期間の制限なく無料で使用できるサービスです。
<br>Always Freeではコンピュート、ストレージ、ロード・バランサ、そして**Autonomous Database (ADB)** 等を使用可能です。

Always FreeのADBでは、2024年5月にリリースとなった**Oracle Database 23ai**を使用し、新機能を試す事が出来ます。
<br>この章では、Always FreeのADBインスタンスの作成方法をご紹介します。

なお、BaseDBでのインスタンスの作成方法は[101: Oracle Cloud で Oracle Database を使おう(BaseDB)](/ocitutorials/basedb/dbcs101-create-db/){:target="_blank"} を参考にしてください。


<br>
**目次**

- [はじめに](#はじめに)
- [1. リージョンの確認](#1-リージョンの確認)
- [2. ADBインスタンスを作成してみよう](#2-adbインスタンスを作成してみよう)

<br>

**所要時間 :** 約5分

<a id="anchor1"></a>
<br>

# 1. リージョンの確認

  Always Free Autonomous Database上でのOracle Database 23aiは、
  <br>現時点では、以下の4リージョンのみでご利用いただけます：
  - Tokyo
  - Ashburn
  - Phoenix
  - Paris
  - London

  お使いのテナンシーの**ホーム・リージョン**が上記のリージョンのいずれか、
  <br>かつ、**ホーム・リージョン**でADBのインスタンスを作成する必要があります。

  >**【補足】**
  >
  >ホーム・リージョンの確認方法は、[その1 - OCIコンソールにアクセスして基本を理解する](/ocitutorials/beginners/getting-started){:target="_blank"}の 6. リージョンの確認を参考にして下さい。

<a id="anchor1"></a>
<br>

# 2. ADBインスタンスを作成してみよう

1. ナビゲーション・メニューから、「**Oracle Database**」>>「**Autonomous Database**」 を選択し、ADBのサービス画面を表示します。  

    ![img](ai-vector101-1.png)

2. **Autonomous Database の作成** をクリックすると作成ウィンドウが立ち上がります。 

    ![img](ai-vector101-2.png)

3. 立ち上がった **Autonomous Database の作成** ウィンドウの入力欄に、以下の項目を入力します。

   - **コンパートメント** - 任意（有効な管理権限を持つコンパートメントを選択して下さい）。
   - **表示名** - 任意（以降では <span style="color: red; "><b>adb23ai01</b></span> として記載しています）。サービスメニュー画面での表示用です。
   - **データベース名** - 任意（以降では <span style="color: red; "><b>adb23ai01</b></span> として記載しています）。インスタンスへの接続時に利用します。

    ![img](ai-vector101-3.png)
  

   - **ワークロード・タイプの選択** - <span style="color: red; "><b>トランザクション処理 </b></span>
      >**【補足】**
      >- システムが分析用途であればデータ・ウェアハウス（ADW）を選択
      >- JSON 中心のアプリケーション開発にはJSONを選択
      >- APEX アプリケーション開発にはAPEXを選択
      >- それ以外はトランザクション処理（ATP）を選択（本ハンズオンではこちらを選択ください。）
   - **デプロイメント・タイプの選択**  -  <span style="color: red; "><b>サーバーレス</b></span>

    ![img](ai-vector101-4.png)

   - **Always Free** - Always Freeの構成オプションのみを表示を<span style="color: red; "><b>オン</b></span>
   - **データベース・バージョンの選択** - <span style="color: red; "><b>23ai</b></span>

    ![img](ai-vector101-5.png)

   - **Username** - <span style="color: red; "><b>（固定値 / 変更不可）</b></span><br>
   >**【補足】**
   >ADMINスキーマはインスタンスを管理するためのユーザーです。他のユーザーの作成等、さまざまな管理業務を実行できます。
   - **Password** - <span style="color: red; "><b>Welcome12345#</b></span>

    ![img](ai-vector101-6.png)

   - **ネットワーク・アクセスの選択** - <span style="color: red; "><b>すべての場所からのセキュアアクセスを許可</b></span><br>
   >**【補足】**
   >- アクセス制御ルールの構成にチェックを入れると、特定のIPレンジ、CIDR、VCNからのアクセスのみを許可するようホワイトリストを設定できます。今回はなしでOKです。
   >- ADBに接続する際に利用可能な認証方法は**相互TLS接続**と**TLS接続**の２種類があり、選択したアクセス・タイプにより利用可能な認証方法が次のように異なります：
   > <table>
   >  <tr>
	 >   <td><b>アクセス・タイプ</b></td>
   >   <td><b>相互TLS認証の要否</b></td>
   >    </tr>
	 >   <tr>
	 >   <td>すべての場所からのセキュア・アクセス</td>
   >   <td><b>必須</b><br>相互TLS認証のみ利用可</td>
   >    </tr>
   >   <tr>
	 >   <td>許可されたIPおよびVCN限定のセキュア・アクセス</td>
   >   <td rowspan="2" valign="middle"><b>任意</b><br>相互TLS認証およびTLS認証から選択可</td>
   >    </tr>
	 >   <tr>
	 >   <td>プライベート・エンドポイント・アクセスのみ</td>
   >    </tr>
   >   </table>

    ![img](ai-vector101-7.png)

   - **ライセンスタイプの選択** - <span style="color: red; "><b>ライセンス込み</b></span>
   >**【補足】**
   >- ライセンス持込み（BYOL)：　すでにお持ちのDBライセンスをCloudに持ち込んで利用する場合に選択します(Bring Your Own License)。有効なDBライセンスをお持ちでなくこちらのタイプを選択するとライセンス違反となりますのでご注意ください。
   >- ライセンス込み： 　DBソフトウェアの利用料やサポート費用を含め全てサブスクリプション形式で利用する場合に選択します。
   - **通知およびお知らせ用の連絡先** - 任意（通知やお知らせ用の連絡先）。

    ![img](ai-vector101-8.png)

4. 全て入力できたことを確認し、**Autonomous Databaseの作成** をクリックします。  
  （インスタンス作成が完了すると、茶色のプロビジョニング中から緑色の使用可能に変わります。緑色になればOKです！）

    ![img](ai-vector101-9.png)

    >**【補足】**
    >ADBへの接続方法については[104: クレデンシャル・ウォレットを利用して接続してみよう](/ocitutorials/adb/adb104-connect-using-wallet){:target="_blank"}を参考にして下さい。

<br>
以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)