---
title: "WebLogic Server for OKEをプロビジョニングしてみよう"
excerpt: "OCIが提供するWebLogic Server for OKEを利用して、JavaEEアプリケーションのコンテナ化を体験していただけるコンテンツです。"
order: "2101"
tags:
---

前提条件
---
- クラウド環境
    * Oracle Cloudのアカウントを取得済みであること

ハンズオンの全体像
---
1. プロビジョニングの準備
1. WebLogic Server for OKE(UCM)環境をプロビジョニング
1. WebLogic Server for OKEにドメインを作成

1.プロビジョニングの準備
---
### 1.1. コンパートメントの作成 
WebLogic Server for OKEの環境をプロビジョニングするコンパートメントを作成します。
左上のナビゲーション・メニューを展開して、「コンパートメント」を選択してください。  
![](1.1.001.jpg)

「コンパートメントの作成」をクリックし、「wls4oke」コンパートメントを作成します。
※作成したコンパートメントのOCIDをコピーしてメモなどに貼り付けておいてください。  
![](1.1.002.jpg)

### 1.2. 動的グループの作成
WebLogic Server for OKEのプロビジョニングで利用される動的グループを作成します。
左上のナビゲーション・メニューを展開して、「動的グループ」を選択してください。  
![](1.2.001.jpg)

動的グループの名前は「handson」とします。
一致ルールには以下のルールを記述してください。コンパートメントのOCIDは、1.1.でコピーしておいたものを利用してください。  
`instance.compartment.id = <作成したコンパートメントのOCID>`  
![](1.2.002.jpg)

### 1.3. ポリシーの設定
WebLogic Server for OKEのプロビジョニングに必要なポリシーを作成します。
左上のナビゲーション・メニューを展開して、「ポリシー」を選択してください。  
![](1.3.001.jpg)

まずは「ルート・コンパートメント」に以下のポリシーを作成します。
「ポリシーの作成」から`<mygroup>`はご自身のアカウントが所属するグループに置き換えてポリシーを作成してください。
「手動エディタの表示」をONにすると、そのまま貼り付けすることができます。
`Allow group <mygroup> to inspect tenancies in tenancy`
`Allow group <mygroup> to use tag-namespaces in tenancy`

次に「wls4oke」コンパートメントに以下のポリシーを作成します。
`Allow group <mygroup> to manage all-resources in compartment wls4oke`
`Allow dynamic-group handson to manage all-resources in compartment wls4oke`
`Allow service oke to read app-catalog-listing in compartment wls4oke`

### 1.4. Auth Tokenの作成 
WebLogic Server for OKEのプロビジョニングに必要なAuth Tokenを作成します。
右上のプロファイルを展開して、ご自身のアカウントを選択してください。  
![](1.4.001.jpg)

左メニューより「認証トークン」を選択し、「トークンの作成」からトークンを作成してください。
**この時、作成したトークンは必ずコピーしてメモなどに残しておいてください。再度確認することはできません。**  
![](1.4.002.jpg)

### 1.5. SSHキーペアを用意する 
任意のSSHキーペアをご用意ください。  
新たに作成する場合は、左上のハンバーガーメニューを展開して、「コンピュート」から「インスタンス」を選択し、「インスタンスの作成」をクリックします。  
作成画面より、SSHキーの「秘密キー」と「公開キー」の両方をダウンロードし、利用します。  
![](0.1.ssh01.jpg)

### 1.6. OCI VaultでSecretを作成する
WebLogic Server for OKEでは、WebLogic作成時の管理用パスワードは[OCI Vault](https://docs.oracle.com/ja-jp/iaas/Content/KeyManagement/Concepts/keyoverview.htm)にて管理します。

左上のハンバーガーメニューを展開して、「アイデンティティとセキュリティ」から「ボールト」を選択します。  
![](0.1.001.jpg)

「ボールトの作成」をクリックします。   
![](0.1.002.jpg)

名前に「handson vault」と入力し、「ボールトの作成」をクリックします。  
![](0.1.003.jpg)

ボールトの作成には数分かかる場合があります。適宜ブラウザの更新を行ってください。
{: .notice--info}

作成したボールト名をクリックし、「キーの作成」をクリックします   
![](0.1.004.jpg)

名前に「handson key」と入力し、「キーの作成」をクリックします。  
![](0.1.005.jpg)

「シークレット」をクリックし、「シークレットの作成」をクリックします。  
![](0.1.006.jpg)

名前に「wlsadmin」と入力し、暗号化キーは「handson key」を選択し、シークレットコンテンツは「welcome1」と入力し、「シークレットの作成」をクリックします。  
![](0.1.007.jpg)

同様にもう1つシークレットを作成します。名前に「authtoken」と入力し、シークレットコンテンツは「1.4. Auth Tokenの作成」で作成したトークンを入力し、シークレットを作成します。 

2.WebLogic Server for OKE(UCM)環境をプロビジョニング
---

### 2.1. マーケットプレイスにてスタックを起動する

左上のハンバーガーメニューを展開して、「マーケットプレイス」から「すべてのアプリケーション」を選択します。  
![](2.1.001.jpg)

検索欄に「Oracle WebLogic Server Enterprise Edition for OKE UCM」と入力し、先頭に出てくるパネルをクリックします。  
![](2.1.002.jpg)

チェックボックスにチェックを入れ、「スタックの起動」をクリックします。

### 2.2. WebLogic Server for OKEをプロビジョニングする

**Note: 特に記載のない部分に関してはデフォルトの値で構いません**
{: .notice--info}

「次」をクリックします。  
![](2.2.001.jpg)

「Resource Name Prefix」 に「wls4oke」と入力します。  
![](2.2.002.jpg)

「SSH Public Key」では、[事前準備](/ocitutorials/cloud-native/wls-for-oci-provisioning/#事前準備)で作成したSSH Keyを選択します。  

「Network」は 「Create New VCN」を選択します。  
![](2.2.003.jpg)

「Container Cluster (OKE) Configuration」ではコンピュートのシェイプを選択します。
任意のもので構いません。下の表は一例です。  
![](2.2.004.jpg)

「Administration Instances」においてもコンピュートのシェイプを選択します。
任意のもので構いません。下は一例です。  
![](2.2.005.jpg)

「File System」は任意のAvailability Domainを選択します。下は一例です。  
![](2.2.006.jpg)

「Registry (OCIR)」の情報を入力します。
Registry User NameにはOCIRのユーザ名を入力します。※ここで入力するユーザ名はテナンシ名を含まない以下のいずれかのフォーマットで入力します。  
- IAMユーザ xxx@yyy.zzz の場合： xxx@yyy.zzz  
- IDCSユーザ xxx@yyy.zzz の場合：oracleidentitycloudservice/xxx@yyy.zzz

「OCIR Auth Token Compartment」は「wls4oke」  
「Validated Secret for WebLogic Server Admin Password」では、作成したAuth Tokenのシークレット(authtoken)を選択します。    
![](2.2.007.jpg)

「次」をクリックし、「作成」をクリックします。プロビジョニングには30分ほどかかります。
プロビジョニングが完了すると、ログの最後に以下の情報が出力されます。
- 管理ホストや踏み台ホストのアドレス
- Jenkinsコンソールへの接続先の調べ方
```
Admin_Instance_Id = ocid1.instance.oc1....
Admin_Instance_Private_IP = [
  "**.*.*.*",
]
Bastion_Instance_Id = ocid1.instance.oc1....
Bastion_Instance_Public_IP = [
  "***.***.***.***",
]
```
