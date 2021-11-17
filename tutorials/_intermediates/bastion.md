---
title: "BastionサービスでパブリックIPを持たないリソースにアクセスする"
excerpt: "OCIのBastionサービスを使用することで踏み台サーバーを作成せずにパブリックIPを持たないリソースにインターネットから接続できます。"
order: "220"
tags:
  - intermediate
  - bastion
header:
  teaser: "/intermediates/bastion/img1.png"
  overlay_image: "/intermediates/bastion/img1.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
---
**チュートリアル一覧に戻る :**  [<u>Oracle Cloud Infrastructure チュートリアル</u>](../..)

通常インターネットからパブリックエンドポイントを持たないターゲット・リソースに接続する場合、パブリック・サブネット内の踏み台サーバーを経由してそれらのリソースに接続する必要があります。しかしOCIのBastionサービスを使用することでわざわざ踏み台サーバーを立てる必要がありません。このサービスはプライベート・サブネット内のインスタンスだけでなくDBの接続や、リモートデスクトップ（RDP）接続で使用できます。またAlways Freeに該当するため無償で利用できるサービスです。  
今回のチュートリアルではプライベート・サブネット内にあるLinuxインスタンスとWindowsインスタンスにBastionサービスを使ってそれぞれSSH接続、RDP接続を行います。
![img1.png](img1.png)

**所要時間：**　約30分  
**前提条件：**
1. [<u>その2 - クラウドに仮想ネットワーク(VCN)を作る を通じて仮想クラウド・ネットワーク(VCN)の作成</u>](https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn/)が完了していること

**注意**: チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります 

**目次 :**
   1. [ポリシーの付与](#anchor1)
   2. [プライベート・サブネット内にLinuxとWindowsのインスタンスを作成](#anchor2)
   3. [要塞の作成](#anchor3)
   4. [管理対象SSHセッションでLinuxインスタンスに接続](#anchor4)
   5. [SSHポート転送セッションでWindowsインスタンスに接続](#anchor5)
<br><br>

<a id="anchor1"></a>

# 1. ポリシーの付与

Bastionサービスを使う際に権限が必要です。IAMポリシーを以下のように作成します。管理者や **`all resource`**　ですべてのリソースを使用できる権限があるユーザーの場合はこの設定をする必要がありません。  

  ```  
  Allow group <グループ名> to manage bastion in tenancy/compartment<コンパートメント名>
  Allow group <グループ名> to manage bastion-session in tenancy/compartment<コンパート名>
  ```

<a id="anchor2"></a>

# 2. プライベート・サブネット内にOracle LinuxとWindowsのインスタンスを作成

1. インスタンスを作成する際に [<u>その3 - インスタンスを作成する</u>](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/)を参考にして、プライベート・サブネット内にOracle LinuxとWindowsのインスタンスを作成してください。 Windowsインスタンスを作成するには、**`イメージの変更`** のボタンを押して、デフォルトのOracle LinuxからWindowsに変えることで出来ます。  
2. Oracle Linuxのインスタンスは作成後 **`Oracle Cloudエージェント`** の一番下にある要塞のプラグインを有効にします。今後行う管理対象SSHセッションで接続する場合必ずこのプラグインが必要になります。
  ![img2.png](img2.png)
<br>

<a id="anchor3"></a>

# 3. 要塞の作成

1. **`アイデンティティとセキュリティ→要塞`** を選択し、**`要塞の作成`** のボタンを押します。
     - **`要塞名`** - TutorialBastion
     - **`仮想クラウドネットワーク`** - Bastion_VCN（ご自身で作成されたVCNを選択します）
     - **`ターゲット・サブネット`** - パブリック・サブネット
     - **`CIDRブロック許可リスト`** - 0.0.0.0/0
  ![img3.png](img3.png)
    >**Note**   
    Bastionサービスのセッション時間は最大３時間で、この値がデフォルトで設定されています。拡張オプションで変更することが可能ですが、３時間を超えることは出来ません。
<br>

<a id="anchor4"></a>

# 4. 管理対象SSHセッションでOracle Linuxインスタンスに接続

Oracle Linuxのインスタンスに対して管理対象SSHセッションで接続します。管理対象SSHセッションは、Computeインスタンスに接続する場合のみ利用できます。また接続するにはOpenSSHサーバーを利用して、先ほど行ったOracle Cloud AgentでBastionのプラグインを有効にしている必要があります。

1. 要塞の一覧ページから、作成した要塞の名前のリンクをクリックして、要塞の詳細ページを開きます。そして **`セッションの作成`** のボタンを押します。
![img4.png](img4.png)

2. **`セッションの作成`** を以下の通りに設定します。
     - **`セッションタイプ`** - 管理対象SSHセッション
     - **`セッション名`** - Session_Linux
     - **`ユーザー名`** - opc
     - **`コンピュートインスタンス`** - Bastion_Linux
     - **`CIDRブロック許可リスト`** - 0.0.0.0/0
     - **`SSHキーの追加`** - id_rsa.pub（ご自身で作成されたSSHキーのファイルを選択します）
      　![img5.png](img5.png) 
    >Note   
    SSHキーがない場合は、**`SSHキー・ペアの生成`** のボタンを押します。そして秘密鍵と公開鍵をダウンロードします。インスタンス作成時に登録したSSHキーと要塞のSSHキーが違っていても問題はありません。

3. 次に作成したセッションの一番右側のメニューバーをクリックして **`SSHコマンドのコピー`** を選択します。
   ![img6.png](img6.png)

4. テキストエディタを用い2箇所の **`＜PrivateKey＞`** を要塞作成時に使用した秘密鍵の名前に変更します。
    ```
    ssh -i <privateKey> -o ProxyCommand="ssh -i <privateKey> -W %h:%p -p 22 ocid1.bastionsession.oc1.ap-osaka-1.amaaaaaassl65iqawgnuit6z3nercjcpret6a62x3vbgbhyjgusu646nndwa@host.bastion.ap-osaka-1.oci.oraclecloud.com" -p 22 opc@10.0.1.38
    ```  
    ここでは秘密鍵の名前を **`id_rsa`** として記載するので以下のようになります。
    ```
    ssh -i id_rsa -o ProxyCommand="ssh -i id_rsa -W %h:%p -p 22 ocid1.bastionsession.oc1.ap-osaka-1.amaaaaaassl65iqawgnuit6z3nercjcpret6a62x3vbgbhyjgusu646nndwa@host.bastion.ap-osaka-1.oci.oraclecloud.com" -p 22 opc@10.0.1.38
   ```

5. コマンドラインを使用して接続します。要塞作成時の秘密鍵が.sshディレクトリ内に格納されているので、最初にそのディレクトリに移動します。そして先ほど編集したSSHコマンドを実行します。はじめて接続する時は接続しても良いかを聞かれるので **`yes`**　と入力します。するとLinuxインスタンスに接続できます。  
![img7.png](img7.png)

<br>

<a id="anchor5"></a>

# 5.SSHポート転送セッションでWindowsインスタンスに接続

SSHポート転送セッションでWindowsインスタンスにRDP接続します。SSHポート転送セッションはSSHを使用しており暗号化されています。そのため暗号化されていないプロトコルを使用してもセキュリティ面でより安全に使用できます。

1. セキュリティリストにRDP接続するためのルールを追加します。**`ネットワーキング → 仮想クラウドネットワーク`** を選択して、ご自身で作成したVCNをクリックします。するとVCNの詳細画面になるので、**`リソース → セキュリティ・リスト → プライベート・サブネットのセキュリティ・リスト`** を選びます。そして **`イングレス・ルールの追加`** を押して、以下の項目を入力します。
   
   - **`ソース・タイプ`** - CIDR 
   - **`ソースCIDR`** - 0.0.0.0/0 
   - **`IPプロトコル`** - TCP 
   - **`ソース・ポート範囲`** - All      
   - **`宛先ポート範囲`** - 3389 
   - **`説明`** - RDP接続
    ![img12.png](img12.png)        
    イングレス・ルールが追加されると以下のように表示されます。
      ![img13.png](img13.png)

2. **`アイデンティティとセキュリティ → 要塞`**を選択し、ご自身で作成された要塞をクリックして先ほどの詳細画面に戻ります。そして **`セッションの作成`**のボタン押します。

3. **`セッションの作成`** を以下の通りに設定します。
 ![img8.png](img8.png)
      - **`セッション・タイプ`** - SSHポート転送セッション
      - **`セッション名`** - Session_Windows
      - **`IPアドレス`** - WindowsインスタンスのプライベートIPアドレス
      - **`ポート`** - 3389 
      - **`SSHキーの追加`** - id_rsa.pub（ご自身で作成されたSSHキーを選択します。) 

4. 作成したセッションの一番右側のメニューから **`SSHコマンドのコピー`**　のボタンを押します。

5. コピーしたものをテキストエディタに貼り付けます。そして以下のように書き換えます。

    ```
    ssh -i <privateKey> -N -L <localPort>:10.0.1.80:3389 -p 22 ocid1.bastionsession.oc1.ap-osaka-1.amaaaaaassl65iqasz6vhp6pi7ytxwzxpvpqgf2wc5oqxvbfs3mu3qdi6vxq@host.bastion.ap-osaka-1.oci.oraclecloud.com
    ```
     - **`privateKey`** - id_rsa（要塞作成時に使用した秘密鍵）
     - **`LocalPort`** - 3399
     - **`-vの追加`** - 秘密鍵の後ろに-vのコマンドを追加する。　
    ```
    ssh -i id_rsa -v -N -L 3399:10.0.1.80:3389 -p 22 ocid1.bastionsession.oc1.ap-osaka-1.amaaaaaassl65iqasz6vhp6pi7ytxwzxpvpqgf2wc5oqxvbfs3mu3qdi6vxq@host.bastion.ap-osaka-1.oci.oraclecloud.com
    ```
    >**Note**  
    -vを追加することで詳細出力されます。

6. 先ほどと同様にコマンドプロンプトを開き秘密鍵が格納されているディレクトリに移動します。そして編集したコマンドを入力します。
 ![img9.png](img9.png) 
 **`debug1 : pledge: network`** と表示されたら、接続完了です。
 ![img10.png](img10.png)

7. リモートデスクトップ接続を開いて、**`localhost:3399`** で接続します。するとWindowsインスタンスに接続できます。  
  ![img11.png](img11.png)

<br>

以上で、この章の作業は終了です。

<br>

**チュートリアル一覧に戻る :** [Oracle Cloud Infrastructure チュートリアル](../..)