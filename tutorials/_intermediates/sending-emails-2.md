---
title: "Email Deliveryを利用した外部へのメール送信(応用編)"
excerpt: "Email Deliveryを利用した外部へのメール送信(基礎編)でSMTP認証を設定しましたが、それだけでは迷惑メールとみなされてしまう可能性があります。そこで今回のチュートリアルでは送信ドメイン認証であるSPFとDKIMの設定を行い、メールの到達可能性を向上させます。"
order: "062"
tags:
  - intermediate
  - email
header:
  teaser: "/intermediates/sending-emails-2/img2.png"
  overlay_image: "/intermediates/sending-emails-2/img2.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
---
**チュートリアル一覧に戻る :**  [Oracle Cloud Infrastructure チュートリアル](../..)


このチュートリアルは[Email Deliveryを利用した外部へのメール送信(基礎編)](https://oracle-japan.github.io/ocitutorials/intermediates/sending-emails-1/)の続きになります。
基礎編ではSMTP認証を使用しました。しかしそれだけではなりすましメールとみなされてしまう可能性があります。応用編ではSPFとDKIMの設定を行いメールの到達可能性を高めます。

**所要時間：**　約20分  
**前提条件：**
1. [DNSサービスを使ってWebサーバーの名前解決をする](https://oracle-japan.github.io/ocitutorials/intermediates/using-dns/)が完了していること
2. [Email Deliveryを利用した外部へのメール送信(基礎編)](https://oracle-japan.github.io/ocitutorials/intermediates/sending-emails-1/)が完了していること
  

**注意**: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります

<a id="anchor1"></a>

# 1. SPFの設定

SPFを設定するには、SPFレコードを既存のDNSサーバーにTXT形式で実装します。

1. SPFを確認します。左上のメニューから **`開発者サービス → 電子メール配信`** をクリックして、左側にある **`Approved Senders`** を押します。

2. そして作成した承認済送信者の右側にあるメニューから **`SPFの表示`** ボタンを押します。
    ![img1.png](img1.png)


3. 今回は東京リージョンで実施しているためアジア太平洋のSPFレコードを使用します。後で使用するためテキストエディタ等にメモしておきます。そして　**`閉じる`** のボタンを押します。
   ![img2.png](img2.png)

4. DNSサーバーにSPFレコードの情報を実装します。**`ネットワーキング → ゾーン`** をクリックします。そしてすでに作成されているDNSゾーンをクリックします。今回のチュートリアルでは **`tutorials1.ml`** のDNSドメインを使用します。

5. 作成されているDNSサーバーをクリックすると、詳細画面が表示されます。少しスクロールして左側にある **`レコード`**　を押します。すると一覧のレコードが表示されます。

6. レコードの追加を行います。
  - **`レコード型`**　-　TEXT -　テキスト
  - **`名前`**　- 空白
  - **`TTL`**　- 空白
  - **`Rdataモード`**　- 基本
  - **`Text（テキスト）`**- v=spf1 include:ap.rp.oracleemaildelivery.com ~all（先ほどテキストエディタに書いたSPFレコードを記入します）

    ![img3.png](img3.png)

7. 送信ボタンを押すとレコードに追加されます。
   
8.  レコードの変更の公開をおこないます。**`変更の公開`** のボタンを押します。

    ![img4.png](img4.png)

9.  きちんと登録したSPFレコードが選択されているかを確認して、**`変更の公開`** ボタンを押します。

    ![img5.png](img5.png)

10.  レコードが公開されると状態が **`Unmodified`** になります。
    
    
      ![img6.png](img6.png)


<a id="anchor2"></a>

# 2. DKIMの設定

DKIMを設定するにはDKIMを作成してからDNSレコードにその情報を公開する必要があります。

1. 左上のメニューバーから **`開発者サービス →　電子メール配信`**　を選択します。そして左側に表示されている **`Email Domains`** をクリックします。

2. Eメールドメインを作成します
     - **`Email Domain Name`** - tutorials1.ml
     - **`Compartment`** - コンパートメントを選択します

    ![img7.png](img7.png)

    >**`Note`**  
    Email Domain Nameはご自身で作成されたDNSのドメイン名と同じにしてください。

3. Email Domainの詳細画面が表示されます。スクロールして **`DKIMの追加`** を押します。Step1のDKIM Selectorを設定して、Step2の **`Generate DKIM Record`** のボタンを押します。ボタンを押すとStep3の **`CNAME Record`**、**`CNAME Value`** の値が表示されるので、テキストエディタに書きます。そして **`Create DKIM`** のボタンを押します。
    -  **`DKIM Selector`** - tutorial-tokyo-20220303

    ![img8.png](img8.png)

    >**`Note`**  
    DKIMセレクターの値はドメインに対して必ずグローバルで一意になっている必要があります。なので「prefix（接頭辞）-region（リージョン）-YYYYMMDD（日付）」で登録することが推奨されています。
    
4. DNSサーバーにDKIMの情報を実装します。**`ネットワーキング → ゾーン`** を選択して、既存のDNSゾーンをクリックします。
    
5. DNSレコードの追加を行います。
  - **`レコード型`**　-　CNAME - CNAME
  - **`名前`**　- tutorial-tokyo-20220303._domainkey（CNAME Recordの値を記入します）
  - **`TTL`**　- 30
  - **`Rdataモード`**　- 基本
  - **`Text(テキスト)`**　- tutorial-tokyo-20220303.tutorials1.ml.dkim.nrt1.oracleemaildelivery.com(CNAME Valueを記入します)
    
    ![img9.png](img9.png)

6. 送信ボタンを押すとレコードに追加されます。

7. 先ほどのレコードの変更の公開をおこないます。**`変更の公開`** のボタンを押します。

8. きちんとCNAMEのDKIMレコードが選択されているかを確認して、**`変更の公開`** ボタンを押します。

9.  レコードが公開されると状態がUnmodifiedになります。

10. DKIMの設定がされているか確認します。 メニューから **`開発者サービス →　電子メール配信`**　をクリックして **`Email Domain`** を選択すると一覧が表示されるので、先ほど作成したEmail Domain名をクリックします。すると **`DKIM　Signing`** の箇所がActiveになっていることが確認できます。  

    ![img10.png](img10.png)   

    >**`Note`**    
    Activeになるまでに時間がかかることがあります。

11. メールを送信します。[Email Deliveryを利用した外部へのメール送信(基礎編)](https://oracle-japan.github.io/ocitutorials/intermediates/sending-emails-1/)を参考にMailx等で送信してみてください。そしてメールが送信されているか確認してみてください。

<a id="anchor4"></a>

# 3. おまけ（電子メール配信メトリック）

電子メール配信メトリックを使用することで、電子メールがきちんと受信先メールサーバーに届いているかを表で確認できます。

1. **`監視および管理 → メトリック・エクスプローラー`** を選択します。

2. すると **`メトリック・エクスプローラ`** の画面が表示されるので、スクロールして **`問合せの編集`**　ボタンを押して編集します。

     - **`コンパートメント`** - コンパートメントを選択します
     - **`メトリック・ネームスペース`**　- oci_emaildelivery
     - **`メトリック名`** - EmailsAccepted 
     - **`間隔`** - 1m
     - **`統計`** - Mean
     - **`メトリック・ディメンション`**
       - **`ディメンション名`** - resourceDomain
       - **`ディメンション値`** - tutorial.com 
       
        ![img11.png](img11.png)

3. 編集し終えたら **`チャートの更新`** を押します。

4. きちんとメールが送信されていると、グラフに反映されます。

    ![img12.png](img12.png)

<br>

以上で、この章の作業は終了です。

<br>

**チュートリアル一覧に戻る :** [Oracle Cloud Infrastructure チュートリアル](../..)



