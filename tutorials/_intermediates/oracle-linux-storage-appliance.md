---
title: "Oracle Linux Storage Applianceでファイルストレージの構築"
excerpt: "Oracle Linux Storage Applianceを使用すると共有ストレージ・システムを構築することができます。また。Webインターフェースを利用して簡単にNFSおよびSMBプロトコルを使用する共有を作成することができます。"
order: "230"
tags:
  - intermediate
  - oracle-linux-storage-appliance 
header:
  teaser: "/intermediates/oracle-linux-storage-appliance/img10.png"
  overlay_image: "/intermediates/oracle-linux-storage-appliance/img10.png"
  overlay_filter: rgba(34, 66, 55, 0.7)

---
Oracle Linux Storage Applianceを使用することでOracle Cloud Infrastructure(OCI)上にWebインターフェースを使用して簡単に共有ファイルストレージを構築できます。その際にNFSv3、NFSv4そしてSMBv3のプロトコルを使用することができます。

今回のチュートリアルでは実際にOracle Linux Storage Applianceで共有ファイルストレージを作成して、OCI上にあるWindowsインスタンスからSMBプロトコルを介してアクセスしてみます。

**チュートリアル一覧に戻る :**  [Oracle Cloud Infrastructure チュートリアル](../..)

**所要時間：**　約30分  

**前提条件：**
1. [その2 - クラウドに仮想ネットワーク(VCN)を作る](https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn/)が完了していること
2. [その4 - ブロック・ボリュームをインスタンスにアタッチする](https://oracle-japan.github.io/ocitutorials/beginners/attaching-block-volume/)のブロック・ボリュームの作成を行っていること


**注意**:  チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります


<a id="anchor1"></a>

# 1. 事前準備

## 1. インスタンス 
1. Oracle Linux Storage Applianceを使用するために必要なインスタンスを作成します。[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/)を参考にしてインスタンスを作成します。その際にイメージの変更ボタンをおしてイメージソースを **`Oracleイメージ`** にして　**`Oracle Linux Storage Appliance`** をクリックします。
  
    ![img1.png](img1.png)

2. OCI上のWindowsインスタンスでSMBの共有ファイルを確認するために、[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/)を参考にしてWindowsインスタンスを作成します。

## 2. ブロック・ボリュームのアタッチ
Oracle Linux Storage Applianceを使用する場合はストレージ・プールを構成する必要があります。NVMeディスクを含むインスタンスの場合は自動で作成されますが、NVMeディスクがないインスタンスの場合はブロックボリュームをアタッチしなければなりません。

1. ブロック・ボリュームをアタッチします。[その4 - ブロック・ボリュームをインスタンスにアタッチする](https://oracle-japan.github.io/ocitutorials/beginners/attaching-block-volume/)を参考にして、アタッチメントタイプを **`ISCSI`** にしてアタッチしてください。

## 3. セキュリティリストの追加

VCNのセキュリティリストを追加する必要があります。今回の場合はOracle Linux stograge Applianceを利用する際に必要なポートとRDP接続をする際に必要なポートをセキュリティリストに追加します。Oracle Linux stograge Applianceを利用する際に必要なポートは[こちら](https://docs.oracle.com/ja-jp/iaas/oracle-linux/storage-appliance/index.htm#:~:text=%E9%81%B8%E6%8A%9E%E3%81%97%E3%81%BE%E3%81%99%E3%80%82-,%E4%BB%AE%E6%83%B3%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%83%BB%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E3%81%AE%E3%83%9D%E3%83%BC%E3%83%88%E3%81%AE%E6%A7%8B%E6%88%90,-%E3%82%A2%E3%83%97%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%82%B9%E3%81%A8%E3%81%9D%E3%81%AE)を参照してください。

1. **`ネットワーキング → 仮想クラウドネットワーク`** をクリックします。するとVCNの一覧画面が表示されるので、インスタンスを作成した際に選択したVCNを選びます。

2. VCNの詳細画面が表示されるので、スクロールするとサブネットの一覧が表示されます。Oracle Linux stograge Applianceを作成するときに使用したサブネットを選択してください。（今回のチュートリアルではパブリックサブネット内に作成したため、パブリックサブネットを選択します。）

3. セキュリティリストが表示されます。VCNを作成した際にVCNウィザードの起動させて作成した場合は、パブリックサブネットの場合 **`Default Security List for＜VCN名＞`** 、プライベートサブネットの場合 **`プライベート・サブネット-<VCN名>のセキュリティ・リスト`** が確認できます。今回はパブリックサブネット内に作成したので **`Default Security List for＜VCN名＞`**　をクリックします。

4. するとイングレス・ルールをの詳細画面が表示されるので、Oracle Linux storage Applianceを使用する際に必要なポートとRDP接続をする際に必要なポートを許可します。

     - **`ステートレス`** - なし
     - **`ソース・タイプ`** - CIRD(デフォルト)
     - **`ソースCIDR`** - VCNのCIDRを入力(今回のチュートリアルでは10.0.0.0/16)
     - **`IPプロトコル`**　- TCP (デフォルト)
     - **`ソース・ポート範囲`** - 入力なし
     - **`宛先ポート範囲`** - 22,111,135,139,443,445,662,2049,20048,32803
     - **`説明`**　- 任意（このチュートリアルではOracle Linux storage Appliance用）
        ![img2.png](img2.png)

5. **`別のイングレス・ルール`** のボタンを押します。そして以下を追加します

     - **`ステートレス`** - なし
     - **`ソース・タイプ`** - CIRD(デフォルト)
     - **`ソースCIDR`** - VCNのCIDRを入力(今回のチュートリアルでは10.0.0.0/16)
     - **`IPプロトコル`**　- UDP
     - **`ソース・ポート範囲`** - 入力なし
     - **`宛先ポート範囲`** - 111,137-138
     - **`説明`**　- 任意（このチュートリアルではOracle Linux storage Appliance用）
       ![img3.png](img3.png)

6. また **`別のイングレス・ルール`** のボタンを押します。RDP接続に必要なポートをセキュリティリストに追加します。

     - **`ステートレス`** - なし
     - **`ソース・タイプ`** - CIRD(デフォルト)
     - **`ソースCIDR`** - 0.0.0.0/0
     - **`IPプロトコル`**　- TCP (デフォルト)
     - **`ソース・ポート範囲`** - 入力なし
     - **`宛先ポート範囲`** - 3389
     - **`説明`**　- 任意（このチュートリアルではRDP接続用）
       ![img4.png](img4.png)

7. 全て追加したら **`イングレス・ルールの追加`** を押します。するとイングレス・ルールの一覧から追加したものが確認できます。

# 2. SSHトンネルの作成

 Oracle Linux Storage Applianceにアクセスするために、SSHトンネルを作成します。今回のチュートリアルではコマンドプロンプトを使用します。

1. インスタンスを作成した際に登録した公開鍵に対応する秘密鍵があるディレクトリに移動します。
    
    ```
    cd <秘密鍵のファイルがあるディレクトリ>
    ```
2. そしてSSHキーとインスタンスのパブリックIPアドレスを変えて下記のコマンドを入力します。

    ```
    ssh -i <秘密鍵のファイル名> -v -N -L 8443:127.0.0.1:443 opc@<インスタンスのパブリックIPアドレス>
    ```

3. 初めて接続する場合は、本当に接続したいか聞かれるので **`yes`** と入力します。
   ![img5.png](img5.png)

<a id="anchor3"></a>

# 3. Oracle Linux Storage Applianceの使用

1. **`https://localhost:8443`** にアクセスします。初回のアクセスの場合に以下のようなプライバシーが保護されていませんとエラーが表示されることがあります。その場合 **`詳細設定`** をクリックします。そして **`localhostにアクセスする（安全ではありません）`** を押します。

    ![img6.png](img6.png)  

2. パスワードの設定を行います。パスワードは8文字以上で一つ以上の大文字、小文字、数字、そして特殊文字を含める必要があります。

    ![img7.png](img7.png)

3. そうするとログイン画面が表示されるので、ログイン情報を記入します。

     - **`ユーザー名`** - admin
     - **`パスワード`** - 設定したパスワードを入力
       ![img8.png](img8.png)

4. ログインすると先ほどアタッチしたボリュームが確認できます。チェックボックスにチェックを付けて **`Create`** ボタンを押します。すると本当にストレージプールを作成しても良いのか聞かれるので　**`OK`**　押します。

     ![img9.png](img9.png)

5. ストレージプールが作成された後ダッシュボードが表示されます。ダッシュボードで共有可能なストレージ容量を確認することができます。

     ![img10.png](img10.png)

6. 右上にある **`Storage`** ボタンを押して、 **`add`** をおします。そして下記のように記入します。

     - **`Share name`**  - tutorial_share_SMB（任意の名前を指定してください）
     - **`Share size`**  - 40.0MB
     - **`Use 32 bits inodes only`**  - なし（デフォルト）
     - **`Add export`** - SMB export
     - **`SMB`** 
       - **`SMB share name`** - smb_share（任意の名前を指定してください）
       - **`Read only`** - なし
       - **`Browsable`** - なし
       - **`Strict sync`** - なし
       - **`Hosts allowed`** - なし
       - **`Guest ok`** - あり
       - **`Sync always`** - なし
       - **`Comment`** - なし
       - **`Host dinied`** - なし

            ![img11.png](img11.png)　　

7. 記載後 **`Create`**　を押すと、共有が追加されたのを確認できます。

8. 右下にある **`Actions`** から **`Mount Information`** をクリックします。
  ![img12.png](img12.png)
9. そして **`SMB File Explore URL`**　の箇所をコピーしてテキストエディタ等に書いておきます。
  ![img13.png](img13.png)

10. Oracle Linux Storage Applicanceのインスタンスに任意のターミナルソフトを起動して、アクセスします。下記のコマンドでデバイスのマウント情報を確認を行います。すると先ほど作成した/shares/tutorial_share_SMBがマウントされていることが確認できます。
    ```
    $ df -h
    Filesystem                          Size  Used Avail Use% Mounted on
    devtmpfs                            7.7G     0  7.7G   0% /dev
    tmpfs                               7.7G     0  7.7G   0% /dev/shm
    tmpfs                               7.7G  820K  7.7G   1% /run
    tmpfs                               7.7G     0  7.7G   0% /sys/fs/cgroup
    /dev/sda3                            39G  4.1G   35G  11% /
    /dev/sda1                           200M  7.5M  193M   4% /boot/efi
    tmpfs                               1.6G     0  1.6G   0% /run/user/0
    tmpfs                               1.6G     0  1.6G   0% /run/user/994
    tmpfs                               1.6G     0  1.6G   0% /run/user/1000
    /dev/mapper/lsa-__lsa                58M  3.5M   55M   7% /.lsa
    /dev/mapper/lsa-tutorial_share_SMB   34M  2.2M   32M   7% /shares/tutorial_share_SMB
    ```

11. 共有ストレージ内にファイルを作成してみたいと思います。まずディレクトリを移動します。

    ```
    $ cd /shares/tutorial_share_SMB
    ```
12. そしてファイルを作成します。今回のチュートリアルではtest.txtファイルを共有ストレージファイル内に作成します。

    ```
    $ touch test.txt
    ```

<a id="anchor4"></a>

# 4. Windowsインスタンスから共有フォルダにアクセス

1. 左上にあるメニューボタンから　**`コンピュート →　インスタンス`** をクリックします。そして、既存のWindowsインスタンスを選択します。

2. するとWindowsインスタンスの詳細画面が表示されるので、インスタンス・アクセスの下に書いてあるパブリックIPアドレス、ユーザー名、初期パスワードをテキストエディタ等に書いておきます。
    ![img14.png](img14.png)

3. Windowsキーを押して、Windowsアクセサリの配下にあるリモートデスクトップ接続を選択します。

    ![img15.png](img15.png)

4. リモートデスクトップ接続をする画面が表示されるので、コンピューターの箇所にWindowsインスタンスのパブリックIPアドレスを記載します。
    ![img16.png](img16.png)

5. リモートデスクトップに接続する際に、このリモートコンピューターのＩＤを識別できませんが接続しますかというような下記の表示が出てきたら **`はい`** のボタンを押してください。　　

    ![img17.png](img17.png)

6. リモートデスクトップに接続ができると、パスワード情報を入力する必要があります。先ほど確認した初期パスワードを入力してください。
    ![img18.png](img18.png)

7. パスワードの入力後、新しいパスワードに変えるように要求されるので、**`OK`** ボタンを押して新しいパスワードを2回入力して、変更します。
    ![img19.png](img19.png)

8. ログインできたら、エクスプローラーを出し、**`Network`** をクリックします。もし、Network discoveryとfile sharingが無効になっていますという表記が表示されたら click to chanageの箇所をおして、**`Turn on network discovery and file sharing`** をクリックします。すると本当に有効にしたいか聞かれるのでyesから始まる文章の方をクリックします。

    ![img20.png](img20.png)  

9. 先程確認した **`SMB File Explore URL`** を記入します。きちんとアクセスできると先程作成したtest.txtを確認することができます。

    ![img21.png](img21.png)


<a id="anchor5"></a>

# 5. 補足（Networkエラーが発生した場合）
もし、エクスプローラーに **`SMB File Explore URL`** を記載しても、うまく接続出来なかった場合は以下の手順を実施してください。

1. **`Windows+R`** を押して **`gpedit.msc`** を選択します。
    ![img22.png](img22.png)

2. **`Computer Configuration\Administrative Templates\Network\Lanman Workstation`** を開きます。そして **`Enable insecure guest logons`** をクリックします。

    ![img23.png](img23.png)

3. すると **`Enable insecure gures logons`** の詳細が表示されるので　**`Not Configured`** から **`Enable`** にしてください。そして **`Apply`** を押します。

    ![img24.png](img24.png)

4. ボタンを押したのち、エクスプローラーに **`SMB File Explore URL`** を記入してください。するとアクセスできます。

<br>

以上で、この章の作業は終了です。

<br>

**チュートリアル一覧に戻る :** [Oracle Cloud Infrastructure チュートリアル](../..)