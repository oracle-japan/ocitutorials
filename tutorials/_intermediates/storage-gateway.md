---
title: "ストレージ・ゲートウェイを作成する"
excerpt: "ストレージ・ゲートウェイを利用することで、アプリケーションが 標準の NFSv4 プロトコルを使用して オブジェクト・ストレージ と相互作用できるようになります。"
order: "170"
tags:
  - intermediate
header:
  teaser: "/intermediates/storage-gateway/img01.png"
  overlay_image: "/intermediates/storage-gateway/img01.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
# link:  https://community.oracle.com/tech/welcome/discussion/4474301/%E3%83%A2%E3%83%8B%E3%82%BF%E3%83%AA%E3%83%B3%E3%82%B0%E6%A9%9F%E8%83%BD%E3%81%A7%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E3%82%92%E7%9B%A3%E8%A6%96%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89
---

**チュートリアル一覧に戻る :** [Oracle Cloud Infrastructure チュートリアル](../..)

Oracle Cloud Infrastructure **ストレージ・ゲートウェイ** とは、アプリケーションが 標準のNFSv4プロトコルを使用してOracle Cloud Infrastructure オブジェクト・ストレージと相互作用できるようになるサービスです。オンプレミスからのデータ転送、バックアップ、アーカイブ用途などに利用できます。

大容量ファイルについてはマルチパート・アップロードが自動的に適用され、スタンダードなオブジェクト・ストレージだけでなく、アーカイブ・ストレージへのアップロードも可能です。

この章では、Oracle Cloud Infrastructure 上の コンピュート・インスタンスに ストレージ・ゲートウェイを作成する手順について説明していきます。

**所要時間 :** 約40分

**前提条件 :**

- 本チュートリアルの [前提条件](#anchor1) を参照ください

**注意 :** チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります

**目次：**

* [1. ボリュームのフォーマットおよびマウント](#anchor2)
* [2. ストレージ・ゲートウェイのインストール](#anchor3)
* [3. ファイル・システムの作成](#anchor4)
* [4. クライアントから動作確認](#anchor5)



## 構成イメージ

本チュートリアルでは 以下の構成で構築していきます。

![img01.png](img01.png)

ブロック・ボリュームがアタッチされたコンピュート・インスタンス上に ストレージ・ゲートウェイを構築していきます。また、クライアント・サーバーは、ストレージ・ゲートウェイの動作確認用として利用します。

<a id="anchor1"></a>

## 前提条件

本チュートリアルでは、アタッチしたボリュームをフォーマットする手順から解説します。本チュートリアルを始める前に、以下の工程が完了していることを確認してください。

1. 仮想ネットワーク（VCN）の作成が完了していること。

   ※手順については、[その2 - クラウドに仮想ネットワーク(VCN)を作る](/ocitutorials/beginners/creating-vcn)  を参考にしてください。

   - セキュリティ・リストには、SSH (443) イングレスを許可するルールが含まれている必要があります。

2. コンピュート・インスタンス２台の作成が完了していること。

   ※手順については、[その3 - インスタンスを作成する](/ocitutorials/beginners/creating-compute-instance)  を参考にしてください。

   - ストレージ・ゲートウェイ・サーバー：

     - Oracle Linux 7
     - VM.Standard2.1

     > **Note**
     >
     > 本チュートリアルでは上記条件で作成しますが、推奨される最小スペックは VM.Standard2.4 となっています。

   - クライアント・サーバー：
     - Oracle Linux 7 (任意のLinux OSでも可)
     - 任意のシェイプ

3. ブロック・ボリュームを作成し、ストレージ・ゲートウェイ・サーバーにアタッチしていること。ブロック・ボリュームのサイズについては、推奨サイズは600GBですが、それ以下でも問題ありません。  
   ※手順については、[その4 - ブロック・ボリュームをインスタンスにアタッチする](https://community.oracle.com/docs/DOC-1019345) を参考にしてください。
- アタッチメント・タイプ：準仮想化
   - デバイス名：任意（本チュートリアルでは`/dev/oracleoci/oraclevdb` を使用しています）



## 構築手順

<a id="anchor2"></a>

### 1. ボリュームのフォーマットおよびマウント

コンピュートに アタッチした ボリュームのフォーマット および マウントをする手順について ご説明します。コンピュートや ブロック・ボリュームが未作成の場合は、前提条件にあるチュートリアルを参考に、作成してください。

#### 1-1. パーティションの作成

1. パーティションの作成前に、まず デバイスファイルの確認を行います。ストレージ・ゲートウェイ・サーバーとなるコンピュート・インスタンスに ssh接続し、以下のコマンドを実行します。

   ```shell
   $ lsblk
   NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
   sdb      8:16   0   50G  0 disk
   sda      8:0    0 46.6G  0 disk
   tqsda2   8:2    0    8G  0 part [SWAP]
   tqsda3   8:3    0 38.4G  0 part /
   mqsda1   8:1    0  200M  0 part /boot/efi
   ```

   追加したブロック・ボリュームが、`/dev/sdb` にて アタッチされていることが確認できます。

2. 続いて、アタッチしたボリュームにパーティションを作成します。Oracle Linux 7 では、ファイルシステムは **xfs**、パーティションテーブルは **gpt** となっているため、パーティション作成には `gdisk`、`parted` コマンド等 を使用します。`parted` コマンドの実行例を以下に示します。

   ```shell
   $ sudo parted -s -a optimal /dev/sdb \
      mklabel gpt \
      mkpart primary 0% 100% \
      set 1 lvm on
   ```

3. 以下のコマンドを実行し、パーティションが作成できていることを確認します。

   ```shell
   $ sudo parted /dev/sdb print
   Model: ORACLE BlockVolume (scsi)
   Disk /dev/sdb: 53.7GB
   Sector size (logical/physical): 512B/4096B
   Partition Table: gpt
   Disk Flags:
   
   Number  Start   End     Size    File system  Name     Flags
    1      1049kB  53.7GB  53.7GB               primary  lvm
   ```

   

#### 1-2. LVMの作成

1. 次に、LVM を作成していきます。この手順は必須ではありませんが、実行しない場合は後述する手順を 適宜 読み替えて実施してください。まず LVM の物理ボリュームを作成します。以下のコマンドを実行してください。

   ```shell
   $ sudo pvcreate /dev/sdb1
   ```

2. 続いて、LVMのボリュームグループを作成します。以下のコマンドを実行してください。

   ```shell
   $ sudo vgcreate vg01 /dev/sdb1
   ```

3. 最後に、論理ボリュームを作成していきます。以下のコマンドを実行してください。

   ```shell
   $ sudo lvcreate -l 100%FREE -n lv_data vg01
   ```



#### 1-3. ファイル・システムの作成

1. 作成したLVMに対して、xfs ファイルシステムを作成します。

   ```shell
   $ sudo mkfs.xfs /dev/vg01/lv_data
   ```

   

#### 1-4. マウント・ポイントの作成

1. マウント用のディレクトリを作成し、権限の設定を行います。

   ```shell
   $ sudo mkdir /mnt/ocisg
   $ sudo chown opc:opc /mnt/ocisg/
   ```

2. デバイス名の指定に UUID を利用するため、**lv_data** の UUID を予め確認しておきます。

   ```shell
   $ lsblk -o +UUID
   NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT UUID
   sdb      8:16   0   50G  0 disk
   mqsdb1   8:17   0   50G  0 part            7H8K5c-3Nrc-JHZ3-DW9m-OPoq-8OZJ-KswjK5
     mqvg01-lv_data
          252:0    0   50G  0 lvm             f4276129-d79e-4285-8feb-8caf06d63108
   ：
   ```

3. 起動時に自動でマウントされるよう、`/etc/fstab` を編集します。

   ```shell
   $ sudo vi /etc/fstab
   ```

   fstab ファイルの最後に以下の行を追記し、保存します。（**`insert`** で編集、**`Esc`** → **`:wq`** で保存して終了、編集をキャンセルする場合は **`Esc`** → **`:q!`**）

   ```shell
   UUID=<確認したUUID> /mnt/ocisg xfs defaults,_netdev,nofail 0 2
   ```

4. 設定を反映させるため、以下のコマンドを実行します。

   ```shell
   $ sudo mount -a
   ```

5. 最後に、以下のコマンドを実行することで、アタッチしたブロック・ボリューム 50GB (lv_data) が追加されていることが確認できます。

   ```shell
   $ df -h
   Filesystem                Size  Used Avail Use% Mounted on
   devtmpfs                  7.2G     0  7.2G   0% /dev
   tmpfs                     7.3G     0  7.3G   0% /dev/shm
   tmpfs                     7.3G  8.7M  7.2G   1% /run
   tmpfs                     7.3G     0  7.3G   0% /sys/fs/cgroup
   /dev/sda3                  39G  2.1G   37G   6% /
   /dev/sda1                 200M  9.7M  191M   5% /boot/efi
   tmpfs                     1.5G     0  1.5G   0% /run/user/0
   tmpfs                     1.5G     0  1.5G   0% /run/user/1000
   /dev/mapper/vg01-lv_data   50G   33M   50G   1% /mnt/ocisg
   ```

   

<a id="anchor3"></a>

### 2. ストレージ・ゲートウェイのインストール

続いて、ストレージ・ゲートウェイ・サーバーに ストレージ・ゲートウェイをインストールしていきます。

#### 2-1. インストールファイルの取得

1. ストレージ・ゲートウェイのインストールファイルをダウンロードします。以下のURLにアクセスし、ライセンスに関する同意をチェックの上、インストールファイルをダウンロードしてください。  
   [https://www.oracle.com/downloads/cloud/oci-storage-gateway-downloads.html](https://www.oracle.com/downloads/cloud/oci-storage-gateway-downloads.html)
   
   ![img03.png](img03.png)

2. ストレージ・ゲートウェイ・サーバーへ インストールファイルをコピーするため、オブジェクト・ストレージにアップロードします。[その7 - オブジェクト・ストレージを使う](/ocitutorials/beginners/object-storage/)  を参考に、ファイルをアップロードしてください。

   ※ ここで利用するオブジェクトストレージは、任意のもので構いません。本構成とは別に用意 または 同一のものを利用しても問題ありません。

   ※ 本チュートリアルでは、オブジェクト・ストレージを介したコピーの手順をご紹介していますが、scp コマンド等によるコピーでも問題ありません。

3. 続いて、アップロードしたファイルにアクセスするための 事前認証済リクエスト（PAR）を作成します。
   こちらも、[その7 - オブジェクト・ストレージを使う](/ocitutorials/beginners/object-storage/) を参考に手順を実施してください。

4. 最後に、ストレージ・ゲートウェイ・サーバーにssh接続し、下記コマンドを実行します。その際、URL は事前認証済リクエスト（PAR）を指定してください。

```shell
$ wget https://objectstorage.xxxxx/ocisg-1.3.tar.gz
```



#### 2-2. インストールファイルの実行

1. 解凍コマンドを **sudo** または **root** ユーザーとして 実行し、インストールファイルを解凍します。

```shell
$ sudo tar zxvf ocisg-1.3.tar.gz
```

2. ディレクトリを `ocisg-1.3/` に変更し、インストール・スクリプトを **sudo** または **root** ユーザーとして実行します。

```shell
$ cd ocisg-1.3/
$ sudo ./ocisg-install.sh
```

3. インストール・スクリプトを実行すると、いくつかの入力が必要なステップがあります。

   - **Docker インストールの確認**

     ```shell
     Docker does not appear to be installed. Do you want to install docker engine with yum? [y/N]
     ```

     **`y`** を入力し、**`Enter`** を押します。インストール・スクリプトは、Dockerを自動的にインストールし、ストレージ・ゲートウェイで使用するストレージ・ドライバを構成します。

   - **NFS サーバーの有効化**

     ```shell
     NFS server does not appear to be enabled. Do you want to enable NFS? [y/N]
     ```

     **`y`** を入力し、**`Enter`** を押します。

   - **インストール先の確認**

     ```shell
     Enter the install location press enter for default (/opt/ocisg/) :
     ```

     **`Enter`** を押し、デフォルトのインストール・ロケーションを受け入れます。

   - **各種パスの指定**

     同じボリューム上に存在するキャッシュ、メタデータおよびログ・ストレージに関する警告が表示された場合は、**`y`** を入力してインストールを続行します。

     - **ファイル・システム・キャッシュのパス指定**

       ```shell
       Enter the path for OCISG file system cache :
       ```

       ファイル・システム・キャッシュのパスを入力します。（例：`/mnt/ocisg/sg/cache`）

     - **メタデータ領域のパス指定**

       ```shell
       Enter the path for OCISG metadata storage :
       ```

       メタデータ・ストレージのパスを入力します。（例：`/mnt/ocisg/sg/metadata`）

     - **ログ領域のパス指定**

       ```shell
       Enter the path for OCISG log storage :
       ```

       ログ・ストレージのパスを入力します。 （例：`/mnt/ocisg/sg/log`）

4. インストールの実行後、下記メッセージが表示されていれば インストールは完了です。

   ```shell
   Management Console: https://ora-stragegw-vm:32769
   If you have already configured an OCISG FileSystem via the Management Console,
   you can access the NFS share using the following port.
   
   NFS Port: 32770
   
   Example: mount -t nfs -o vers=4,port=32770 ora-stragegw-vm:/<OCISG FileSystem name> /local_mount_point
   ```

   

<a id="anchor4"></a>

### 3. ファイル・システムの作成

続いて、ストレージ・ゲートウェイ管理コンソールへアクセスし、ファイル・システムの作成を行っていきます。

#### 3-1. ネットワークの設定

1. まず ローカルPCから ストレージ・ゲートウェイの管理コンソールへアクセスするため、VCNのセキュリティ・リストのイングレス・ルールに 下記のルールを追加します。

![img04.png](img04.png)



#### 3-2. 認証情報の確認

1. ストレージ・ゲートウェイ管理コンソールにアクセスする前に、ファイル・システムの作成に必要となる**オブジェクト・ストレージのエンドポイント** を確認します。オブジェクト・ストレージのエンドポイントは 下記から 確認できます。  
   [https://docs.oracle.com/cd/E97706_01/Content/API/Concepts/apiref.htm](https://docs.oracle.com/cd/E97706_01/Content/API/Concepts/apiref.htm)  
   本チュートリアルでは、東京リージョンを利用する為、`https://objectstorage.ap-tokyo-1.oraclecloud.com`を利用します。

2. 次に、**コンパートメント OCID**、**テナント OCID**、**ユーザ OCID** を確認します。
   [コマンドライン(CLI)でOCIを操作する - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/docs/DOC-1019624) の「2-2. OCIDの確認」を参考に、コンパートメントの OCID、テナントの OCID、ユーザの OCID を確認してください。

3. 最後に、**APIキー** の情報を確認します。
   [コマンドライン(CLI)でOCIを操作する - Oracle Cloud Infrastructureアドバンスド](https://community.oracle.com/docs/DOC-1019624) の「3-1. 設定ファイルとAPIキーの生成」を参考に、APIキーを作成し、フィンガープリント、プライベートキー、プライベートキーのパスワードを確認してください。



#### 3-3. 管理コンソールへのログイン

1. ストレージ・ゲートウェイ管理コンソールのURLは `https://<ストレージ・ゲートウェイ・サーバーのパブリック IP アドレス>:32769` となっています。ブラウザを開いて、ストレージ・ゲートウェイ管理コンソールにアクセスします。

   ※ ストレージ・ゲートウェイでは、HTTPS接続のために自己署名証明書を使用しています。ブラウザによっては、SSL証明書を検証できなかったことが警告される場合があります。ストレージ・ゲートウェイ・インスタンスの正しいパブリックIPアドレスを入力した場合、この警告は 無視してかまいません。

2. 初回ログイン時は、パスワードの変更を求められます。パスワードの要件を確認の上、新しいパスワードを設定します。

![img06.png](img06.png)

3. 続いて、ログイン画面でパスワードを入力し、ログインします。

![img07.png](img07.png)

4. ストレージ・ゲートウェイ管理コンソール画面が表示されます。

![img08.png](img08.png)



#### 3-4. ファイル・システムの作成

1. ストレージ・ゲートウェイ管理コンソール画面から `Create a File System` をクリックし、ファイル・システムを作成していきます。

2. `File System Name` へ、任意の名称を入力します。この名称で オブジェクト・ストレージが生成されます。既に同盟の存在する場合は、そのオブジェクト・ストレージを利用します。また、オブジェクト・ストレージのタイプは `Standard` を選択します。

![img10.png](img10.png)

3. 手順3-2で確認した情報を元に、下記を入力します。入力が完了したら `Save `で保存します。
   - Object Storage API Endpoint
   - Compartment OCID
   - Tenant OCID
   - User OCID
   - Public Key's Finger Print
   - Private Key
   - Private Key Passphrase

4. ファイル・システムの作成完了後、`connect` ボタンを押し、接続します。接続が完了すると、下記のように表示されます。

![img11.png](img11.png)



<a id="anchor5"></a>

### 4. クライアントから動作確認

クライアントに ストレージ・ゲートウェイをマウントし、最後に作成したファイルが オブジェクト・ストレージにアップロードされることを確認します。

#### 4-1. ストレージ・ゲートウェイのマウント

1. クライアント・サーバーにて、ディレクトリを作成し、ストレージ・ゲートウェイのマウントを行います。下記のコマンドを実行してください。

   ```shell
   $ sudo mkdir /sgtest
   $ sudo mount -t nfs -o vers=4,port=<NFSのポート番号> <ストレージ・ゲートウェイ・サーバのIPアドレス>:<ファイル・システム名> <クライアント・サーバーのディレクトリ>
   例）sudo mount -t nfs -o vers=4,port=32770 10.0.0.2:/ora-strageGW-os /sgtest
   ```

   

#### 4-2. ファイルのアップロード

1. 作成したディレクトリ配下に、ファイル「file」を作成します。

   ```shell
   $ touch /sgtest/file ; date
   Fri Aug  7 03:07:00 GMT 2020
   ```

2. オブジェクトストレージに、先ほど作成したファイル「file」がアップロードされていることを確認します。

![img02.png](img02.png)



以上で、Oracle Cloud Infrastructure ストレージ・ゲートウェイを構築し、利用を開始するまでの手順は完了です。



**チュートリアル一覧に戻る :** [Oracle Cloud Infrastructure チュートリアル](../..)