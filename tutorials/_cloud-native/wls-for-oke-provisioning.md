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
左上のハンバーガーメニューを展開して、「コンパートメント」を選択してください。
![](1.1.001.jpg)

「コンパートメントの作成」をクリックし、「wls4oke」コンパートメントを作成します。
![](1.1.002.jpg)

### 1.2. 動的グループの作成


### 1.3. ポリシーの設定
### 1.4. Auth Tokenの作成 
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

作成したボールト名をクリックし、「キーの作成」をクリックします。  
![](0.1.004.jpg)

名前に「handson key」と入力し、「キーの作成」をクリックします。
![](0.1.005.jpg)

「シークレット」をクリックし、「シークレットの作成」をクリックします。
![](0.1.006.jpg)

名前に「wlsadmin」と入力し、暗号化キーは「handson key」を選択し、シークレットコンテンツは「welcome1」と入力し、「シークレットの作成」をクリックします。
![](0.1.007.jpg)

2.WebLogic Server for OKE(UCM)環境をプロビジョニング
---

### 2.1. マーケットプレイスにてスタックを起動する

左上のハンバーガーメニューを展開して、「マーケットプレイス」から「すべてのアプリケーション」を選択します。
![](2.1.001.jpg)

検索欄に「WebLogic Server Enterprise Edition UCM」と入力し、先頭に出てくるパネルをクリックします。
![](2.1.002.jpg)

チェックボックスにチェックを入れ、「スタックの起動」をクリックします。
![](2.1.003.jpg)

### 2.2. WebLogic Server for OCIをプロビジョニングする

**Note: 特に記載のない部分に関してはデフォルトの値で構いません**
{: .notice--info}

名前に「handson_dest」と入力し、「次」をクリックします。  
![](2.2.001.jpg)

Resource Name Prefix に「dest」と入力します。  
![](2.2.002.jpg)

SSH Public Keyでは、[事前準備](/ocitutorials/cloud-native/wls-for-oci-provisioning/#事前準備)で作成したSSH Keyを選択します。

Validated Secret for WebLogic Server Admin Passwordでは、[事前準備](/ocitutorials/cloud-native/wls-for-oci-provisioning/#事前準備)で作成したSecret(wlsadmin)を選択します。  
![](1.2.003.jpg)

Existing Networkは「base-wls_handson」を選択し、Validated Existing Networkに「YES」と入力します。  
![](2.2.003.jpg)

Existing Subnet for WebLogic Serverは「base-wl-subnet」を選択します。
![](2.2.004.jpg)

Existing Subnet for Bastion Hostは「base-bsubnet」を選択します。
![](2.2.005.jpg)

Existing Subnet for Load Balancerは「base-lbpubst1」を選択します。
![](2.2.006.jpg)

「次」をクリックし、「作成」をクリックします。

3.移行ファイルの抽出
---
WebLogic Deploy Tooling (WDT)を利用して、アプリケーションなどの移行ファイルを移行元環境より抽出します。

### 3.1. WDT をインストールする

コンソール右上、OCI Cloud ShellのアイコンをクリックしてOCI Cloud Shellを開きます。
![](4.3.001.jpg)

WDTをダウンロードします。
    
    wget https://github.com/oracle/weblogic-deploy-tooling/releases/download/release-2.3.2/weblogic-deploy.zip

WDTとSSH KeyをSCPで転送します。

    scp -i <SSH Keyのパス> \
    -o ProxyCommand='ssh -i <SSH Keyのパス> \
    -W %h:%p opc@<base-bastion-instanceのパブリックIP>' \
    ~/weblogic-deploy.zip <SSH Key> opc@<base-wls-0のプライベートIP>:~/

以下コマンドを実行し、移行元のWebLogicインスタンス(base-wls-0)にSSHログインします。

    ssh -i <SSH Keyのパス> \
    -o ProxyCommand='ssh -i <SSH Keyのパス> \
    -W %h:%p opc@<base-bastion-instanceのパブリックIP>' \
    opc@<base-wls-0のプライベートIP>

rootユーザーにスイッチします。
    
    sudo su - 

WDTとSSH Keyをoracleユーザーが利用できるようにします。

    mv /home/opc/weblogic-deploy.zip /home/oracle/
    mv <SSH Key> /home/oracle/

    chown oracle:oracle /home/oracle/weblogic-deploy.zip
    chown oracle:oracle <SSH Key>

oracleユーザーにスイッチします。
    
    sudo su - oracle

WDTをunzipします。

    unzip weblogic-deploy.zip

WDTスクリプトの権限変更を行います。
    
    chmod +x weblogic-deploy/bin/*.sh

### 3.2. 移行ファイルを抽出する

以下の`discoverDomain`コマンドを利用して、移行ファイルの抽出を行います。
```
weblogic-deploy/bin/discoverDomain.sh \
    -oracle_home $MW_HOME \
    -domain_home $DOMAIN_HOME \
    -archive_file ./source.zip \
    -model_file ./source.yaml \
    -variable_file source.properties \
```

4.移行ファイルの編集
---
Cloud Shell上のVimなど任意のテキストエディタで、移行ファイル(WDTモデルファイル)を編集します。  

### 4.1. source.propertiesファイルの編集
`source.properties`は、モデルファイル(`source.yaml`)で利用する変数をまとめたファイルです。

`JDBC.Handson.PasswordEncrypted`に`Welcome1234!`  
`JDBC.Handson.user.Value`は`DEST`と入力します。

```
JDBC.Handson.PasswordEncrypted=Welcome1234!
JDBC.Handson.user.Value=DEST
```

### 4.2. source.yamlファイルの編集
`source.yaml`は、WebLogicドメインをモデル化したファイルです。

`domainInfo`フィールドと`topology`フィールドをすべて削除します。

`resouces`フィールドと`appDeployments`フィールドのみが残ります。
{: .notice--info}

`Handson`フィールド下の`Target`は`base_cluster`を`dest_cluster`と変更します。
```yaml
resources:
    JDBCSystemResource:
        Handson:
            Target: dest_cluster #変更
```
`TodoApp-0.0.1-SNAPSHOT`フィールド下の`Target`は`base_cluster`を`dest_cluster`と変更します。
```yaml
appDeployments:
    Application:
        TodoApp-0.0.1-SNAPSHOT:
            SourcePath: wlsdeploy/applications/TodoApp-0.0.1-SNAPSHOT.war
            ModuleType: war
            Target: dest_cluster #変更
```

`StagingMode: stage`を`appDeployments`内の`Target: dest_cluster`の下に追加します。
```yaml
appDeployments:
    Application:
        TodoApp-0.0.1-SNAPSHOT:
            SourcePath: wlsdeploy/applications/TodoApp-0.0.1-SNAPSHOT.war
            ModuleType: war
            Target: dest_cluster
            StagingMode: stage #追加
```

### 4.3. WDTモデルファイルを移行先管理サーバに転送する

WDT、移行ファイル、Walletを移行先のWebLogic Server for OCIのインスタンスにscpで転送します。
    
    scp -i <SSH Key> weblogic-deploy.zip source.* \
    Wallet_handsonDB.zip opc@<移行先インスタンスのPrivate IP>:~/
    
移行先のWebLogic Server for OCIのインスタンスにSSH接続します。

    ssh -i [SSH Keyの名前] opc@[移行先インスタンスのPrivate IP]

WDT、移行ファイル、Walletの所有者を変更します。

    sudo chown oracle:oracle *

ファイルすべてを移動します。

    sudo mv * /home/oracle/

oracleユーザにスイッチします。

    sudo su - oracle

Walletを`unzip`します。

    unzip -d handsondb Wallet_handsonDB.zip

WDTを`unzip`します。

    unzip weblogic-deploy.zip

WDTの権限変更を行います。

    chmod +x weblogic-deploy/bin/*.sh

5.移行ファイルの適用
---
移行ファイルを移行先環境に適用し、移行が正常に行われることを確認します。

### 5.1. 移行ファイルを移行先環境に適用する
以下のコマンドを実行し、WebLogic Server for OCIにデプロイを行います。

```
weblogic-deploy/bin/updateDomain.sh \
 -oracle_home $MW_HOME \
 -domain_home $DOMAIN_HOME \
 -model_file source.yaml \
 -variable_file source.properties \
 -archive_file source.zip \
 -admin_url t3://$(hostname -i):9071
```
コマンドを実行すると、ユーザー名とパスワードを聞かれます。  
それぞれ`weblogic`, `wilcome1`と入力してください。

### 5.2. アプリケーションの動作確認を行う
`<Load Balancer IP>`を移行先のものに置き換えて、アプリケーションにアクセスします。

    https://<Load Balancer IP>/todo    
    