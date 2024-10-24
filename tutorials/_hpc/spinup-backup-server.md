---
title: "ベア・メタル・インスタンスNFSサーバ向けバックアップサーバを構築する"
excerpt: "ベア・メタル・インスタンスで構築するNFSのファイル共有ストレージを対象とする、バックアップサーバを構築してみましょう。このチュートリアルを終了すると、NFSのファイル共有ストレージに格納するファイルを安価なオブジェクト・ストレージにバックアップするバックアップサーバを構築することが出来るようになります。"
order: "1340"
layout: single
header:
  teaser: "/hpc/spinup-backup-server/architecture_diagram.png"
  overlay_image: "/hpc/spinup-backup-server/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

HPC/GPUクラスタを運用する際必須となるファイル共有ストレージは、NFSでこれをサービスすることが一般的ですが、このファイル共有ストレージをコストパフォーマンス優先で選定する場合、 **ベア・メタル・インスタンス** とストレージサービスで構築する方法（以降"ベア・メタル・インスタンスNFSサーバ"と呼称）を採用することになり、ストレージに **ブロック・ボリューム** を使用しこれをベア・メタル・インスタンスにアタッチする方法（以降"ブロック・ボリュームNFSサーバ”と呼称）と、 **ベア・メタル・インスタンス** にNVMe SSDドライブを搭載するDenceIOシェイプを使用する方法（以降”DenceIO NFSサーバ”と呼称）があります。（※1）

※1）ベア・メタル・インスタンスNFSサーバの詳細は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法](/ocitutorials/hpc/tech-knowhow/howto-configure-sharedstorage/)** を参照してください。

このベア・メタル・インスタンスNFSサーバは、NFSのマネージドサービスである **ファイル・ストレージ** の場合は備え付けのバックアップ機能を利用できるのに対し、自身でバックアップ環境を構築する必要があります。（※2）

※2）バックアップの観点でのベア・メタル・インスタンスNFSサーバと **ファイル・ストレージ** の比較は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[HPC/GPUクラスタ向けファイル共有ストレージの最適な構築手法](/ocitutorials/hpc/tech-knowhow/howto-configure-sharedstorage/)** の **[2-2 可用性による比較](/ocitutorials/hpc/tech-knowhow/howto-configure-sharedstorage/#2-2-可用性による比較)** を参照してください。

以上を踏まえて本チュートリアルは、ベア・メタル・インスタンスNFSサーバで構築するHPC/GPUクラスタのファイル共有ストレージに格納されるファイルをバックアップする、バックアップサーバの構築方法を解説します。

ここでバックアップを格納するストレージは、通常バックアップ対象のファイルを格納するストレージ（ **ブロック・ボリューム** やNVMe SSDドライブ）より容量単価の安価なものを選択する必要があるため、 **オブジェクト・ストレージ** を使用します。  
この際のバックアップツールは、 **オブジェクト・ストレージ** とPOSIXファイルシステム間のデータ転送ツールとして幅広く利用されているオープンソースの **[Rclone](https://rclone.org/)** を採用し、ベア・メタル・インスタンスNFSサーバのNFSクライアントとして構成したバックアップサーバ上でこの **Rclone** のファイル同期機能を使用し、NFSマウントしたファイルシステム領域を **オブジェクト・ストレージ** に差分バックアップします。  
**Rclone** が **オブジェクト・ストレージ** にアクセスする際は、バックアップサーバを **[インスタンス・プリンシパル](/ocitutorials/hpc/#5-15-インスタンスプリンシパル)** 認証に組み込むことでIAM認証・認可を付与します。  
またバックアップサーバに使用するシェイプは、メタデータ性能が要求される小さなファイルのバックアップやサイズの大きなファイルを **マルチパート・アップロード** する際に **Rclone** がマルチスレッドにを活用してデータ転送を行う事を考慮し、コア数の十分な **[VM.Standard.E5.Flex](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#vm-standard)** の32コア・384GBメモリを使用します。  
また、本チュートリアルで使用する各ソフトウェアのバージョンは、以下です。

- バックアップサーバOS： **Oracle Linux** 9.4（Oracle-Linux-9.4-2024.08.29-0 UEK）
- **Rclone** ： v1.68.1

![システム構成図](architecture_diagram.png)

**Rclone** は、このツールが持つ以下の機能を有効活用することで、本チュートリアルのようなPOSIXファイルシステムを **オブジェクト・ストレージ** にバックアップする際、バックアップの信頼性と性能を向上することが可能です。

- 差分バックアップ
- マルチパート・アップロード
- チェックサムによるバックアップファイルの検証

また本チュートリアルは、構築したバックアップ環境でバックアップとリストアの性能を以下の観点で検証し、

- スループット検証
    - テストファイルサイズ： 10 GiB
    - テストファイル作成方法： /dev/urandomを元にddで作成
- メタデータ性能検証
    - テストファイルサイズ： 0 B
    - ディレクトリ数： 1,000
    - ディレクトリ当たりファイル数： 1,000
    - 総ファイル数： 1,000,000

以下の性能を計測しています。（3回計測した平均値）  
なおこの性能値は、状況に応じて変化するため、参考値としてご利用ください。

- バックアップ性能
    - スループット： **310 MiB/s**
    - メタデータ性能： **2,857 files/s**
- リストア性能
    - スループット： **240 MiB/s**
    - メタデータ性能： **1,927 files/s**

**所要時間 :** 約2時間

**前提条件 :** バックアップサーバ環境を収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。

**注意 :**
- 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。
- 本チュートリアルに従って取得するバックアップは、Rcloneを **オブジェクト・ストレージ** をバックエンドとして使用する際の制約から、以下の制限を受けます。

    - シンボリックリンクをリンク先ファイルの実体としてバックアップします。  
    （**Rclone** の **--copy-links** オプションによりこれを指示しています。）
    - ハードリンクをリンク数分のファイルの実体としてバックアップします。
    - 空のディレクトリをバックアップすることが出来ません。
    - 特殊ファイルをバックアップすることが出来ません。
    - リストア時にファイルのオーナーユーザ・オーナーグループがroot:root（リストアコマンド実行ユーザとそのプライマリグループ）になります。
    - リストア時に全てのファイルとディレクトリのパーミッションがそれぞれ644と755になります。
    - その他のPOSIXファイルシステムとオブジェクト・ストレージの機能差からくる制限を受けます。

***
# 1. 事前準備

## 1-0. 概要

本章は、バックアップサーバ環境を構築する際に事前に実施しておく必要のある以下の手順を実施します。

-  **[インスタンス・プリンシパル](/ocitutorials/hpc/#5-15-インスタンスプリンシパル)** 認証関連設定
- **オブジェクト・ストレージ** バケット作成

なお、バックアップ対象領域をNFSでサービスするベア・メタル・インスタンスNFSサーバは、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[ブロック・ボリュームでファイル共有ストレージを構築する](/ocitutorials/hpc/spinup-nfs-server/)** や **[短期保存データ用高速ファイル共有ストレージを構築する](/ocitutorials/hpc/spinup-nfs-server-nvme/)** の手順に従い予め構築されているものとします。

## 1-1. インスタンス・プリンシパル認証関連設定

**インスタンス・プリンシパル** 認証の設定は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[オンデマンドクラスタ実現のためのインスタンス・プリンシパル認証設定方法](/ocitutorials/hpc/tech-knowhow/instance-principal-auth/)** の **[1. インスタンス・プリンシパル認証設定](/ocitutorials/hpc/tech-knowhow/instance-principal-auth/#1-インスタンスプリンシパル認証設定)** の手順に従い実施します。  
この際、このテクニカルTips中でクラスタ管理ノードと呼称している箇所は、バックアップサーバと読みかえて下さい。  
また、このテクニカルTipsで指定しているIAMポリシーは、本チュートリアルでは以下のもののみ適用します。

```sh
allow dynamic-group dynamicgroup_name to manage all-resources in compartment compartment_name
```

## 1-2. オブジェクト・ストレージバケット作成

**オブジェクト・ストレージ** バケットの作成は、 **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の  **[その7 - オブジェクト・ストレージを使う](https://oracle-japan.github.io/ocitutorials/beginners/object-storage/)** の **[1. コンソール画面の確認とバケットの作成](https://oracle-japan.github.io/ocitutorials/beginners/object-storage/#1-%E3%82%B3%E3%83%B3%E3%82%BD%E3%83%BC%E3%83%AB%E7%94%BB%E9%9D%A2%E3%81%AE%E7%A2%BA%E8%AA%8D%E3%81%A8%E3%83%90%E3%82%B1%E3%83%83%E3%83%88%E3%81%AE%E4%BD%9C%E6%88%90)** の手順に従い、 **Rclone** がバックアップを格納するバケットをバックアップサーバ環境を収容する **コンパートメント** にバケット名 **rclone** で作成します。

***
# 2. バックアップサーバ構築

## 2-0. 概要

本章は、バックアップサーバを以下のステップで構築します。

- インスタンス作成
- NFSクライアント設定
- **Rclone** インストール・セットアップ

## 2-1. インスタンス作成

**[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の **[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** の手順に従い、以下のインスタンスをベア・メタル・インスタンスNFSサーバを収容する **コンパートメント** にNFSクライアント用のプライベートサブネットを指定して作成します。

- **イメージ** ： **Oracle Linux** 9.4（Oracle-Linux-9.4-2024.08.29-0 UEK）
- **シェイプ** ： **VM.Standard.E5.Flex** （32コア・384GBメモリ）

## 2-2. NFSクライアント設定

**[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の以下の手順に従い、ベア・メタル・インスタンスNFSサーバのエクスポートしている領域を **/mnt/nfs** でマウントします。

- ブロック・ボリュームNFSサーバ： **[ブロック・ボリュームでファイル共有ストレージを構築する](/ocitutorials/hpc/spinup-nfs-server/)** の **[4. NFSクライアント設定](https://oracle-japan.github.io/ocitutorials/hpc/spinup-nfs-server/#4-nfs%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E8%A8%AD%E5%AE%9A)**
- DenceIO NFSサーバ： **[短期保存データ用高速ファイル共有ストレージを構築する](/ocitutorials/hpc/spinup-nfs-server-nvme/)** の **[3-4. NFSクライアントでのファイルシステムマウント](https://oracle-japan.github.io/ocitutorials/hpc/spinup-nfs-server-nvme/#3-4-nfs%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E3%81%A7%E3%81%AE%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%83%9E%E3%82%A6%E3%83%B3%E3%83%88)**

## 2-3. Rcloneインストール・セットアップ

以下コマンドをバックアップサーバのopcユーザで実行し、 **Rclone** をインストールします。

```sh
$ curl https://rclone.org/install.sh | sudo bash
```

次に、以下コマンドをバックアップサーバのopcユーザで実行し、 **Rclone** のセットアップツールを起動します。

```sh
$ sudo rclone config
```

次に、以下のプロンプトが表示されたら **n** を入力し、 **Rclone** 接続設定の新規作成を指示します。

```sh
2024/10/17 14:33:47 NOTICE: Config file "/root/.config/rclone/rclone.conf" not found - using defaults
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n
```

次に、以下のプロンプトが表示されたら **nfs-backup** を入力し、 **Rclone** 接続設定の名称を指示します。

```sh
Enter name for new remote.
name> nfs-backup
```

次に、以下のプロンプトが表示されたら **38** を入力し、接続先にOCIの **オブジェクト・ストレージ** を指定します。

```sh
Option Storage.
Type of storage to configure.
Choose a number from below, or type in your own value.
 1 / 1Fichier
   \ (fichier)
:
:
:
37 / OpenStack Swift (Rackspace Cloud Files, Blomp Cloud Storage, Memset Memstore, OVH)
   \ (swift)
38 / Oracle Cloud Infrastructure Object Storage
   \ (oracleobjectstorage)
39 / Pcloud
:
:
:
59 / seafile
   \ (seafile)
Storage> 38
```

次に、以下のプロンプトが表示されたら **3** を入力し、認証方法に **[インスタンス・プリンシパル](/ocitutorials/hpc/#5-15-インスタンスプリンシパル)** 認証を指定します。

```sh
Option provider.
Choose your Auth Provider
Choose a number from below, or type in your own value of type string.
Press Enter for the default (env_auth).
 1 / automatically pickup the credentials from runtime(env), first one to provide auth wins
   \ (env_auth)
   / use an OCI user and an API key for authentication.
 2 | you’ll need to put in a config file your tenancy OCID, user OCID, region, the path, fingerprint to an API key.
   | https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm
   \ (user_principal_auth)
   / use instance principals to authorize an instance to make API calls. 
 3 | each instance has its own identity, and authenticates using the certificates that are read from instance metadata. 
   | https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/callingservicesfrominstances.htm
   \ (instance_principal_auth)
   / use workload identity to grant OCI Container Engine for Kubernetes workloads policy-driven access to OCI resources using OCI Identity and Access Management (IAM).
 4 | https://docs.oracle.com/en-us/iaas/Content/ContEng/Tasks/contenggrantingworkloadaccesstoresources.htm
   \ (workload_identity_auth)
 5 / use resource principals to make API calls
   \ (resource_principal_auth)
 6 / no credentials needed, this is typically for reading public buckets
   \ (no_auth)
provider> 3
```

次に、以下のプロンプトが表示されたら、 **オブジェクト・ストレージ** のネームスペース（通常テナント名）を入力します。

```sh
Option namespace.
Object storage namespace
Enter a value.
namespace> object_storage_namespace
```

次に、以下のプロンプトが表示されたら、 **[1-2. オブジェクトストレージバケット作成](#1-2-オブジェクトストレージバケット作成)** で作成した **オブジェクト・ストレージ** バケットが存在する **コンパートメント** のOCIDを入力します。

```sh
Option compartment.
Object storage compartment OCID
Enter a value.
compartment> ocid1.compartment.oc1..xxxx
```

次に、以下のプロンプトが表示されたら、 **[1-2. オブジェクトストレージバケット作成](#1-2-オブジェクトストレージバケット作成)** で作成した **オブジェクト・ストレージ** バケットが存在する **リージョン** 識別子を入力します。

```sh
Option region.
Object storage Region
Enter a value.
region> ap-tokyo-1
```

次に、以下のプロンプトが表示されたらエンターキーを入力し、 **オブジェクト・ストレージ** にAPIでアクセスする際に使用するエンドポイントにデフォルトを使用することを指示します。

```sh
Option endpoint.
Endpoint for Object storage API.
Leave blank to use the default endpoint for the region.
Enter a value. Press Enter to leave empty.
endpoint> 
```

次に、以下のプロンプトが表示されたら **n** を入力します。

```sh
Edit advanced config?
y) Yes
n) No (default)
y/n> n
```

次に、表示されるこれまでの設定が正しいことを確認し、 **y** を入力します。

```sh
Configuration complete.
Options:
- type: oracleobjectstorage
- provider: instance_principal_auth
- namespace: object_storage_namespace
- compartment: ocid1.compartment.oc1..xxxx
- region: ap-tokyo-1
Keep this "nfs-backup" remote?
y) Yes this is OK (default)
e) Edit this remote
d) Delete this remote
y/e/d> y
```

次に、以下のプロンプトが表示されたら **q** を入力し、 **Rclone** のセットアップツールを終了します。

```sh
Current remotes:

Name                 Type
====                 ====
nfs-backup           oracleobjectstorage

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q
$
```

***
# 3. バックアップ・リストア実行

## 3-0. 概要

本章は、構築したバックアップサーバ上でバックアップとリストアを実行する方法を解説します。

以降では、性能検証を兼ねてバックアップとリストアを実行することを念頭に、スループットとメタデータ性能を計測するためのテストファイルを予め作成し、このファイルを対象にバックアップとリストアを実行します。

## 3-1. テストファイル作成

以下コマンドをバックアップサーバのopcユーザで実行し、テストファイルを格納するディレクトリと、リストアするファイルを格納するディレクトリを作成します。

```sh
$ sudo mkdir /mnt/nfs/large
$ sudo mkdir /mnt/nfs/small
$ sudo chown opc:opc /mnt/nfs/*
$ sudo mkdir /mnt/nfs/restore
```

次に、以下コマンドをバックアップサーバのopcユーザで実行し、 **10 GiB** のスループット検証用ファイルと、 **1,000,000** 個のメタデータ性能検証用ファイルを作成します。

```sh
$ cd /mnt/nfs/large && dd if=/dev/urandom of=./10G.bin bs=1048576 count=$((1024*10))
$ cd /mnt/nfs/small && count=1000; for i in `seq -w 1 $count`; do echo $i; mkdir $i; cd $i;for j in `seq -w 1 $count`; do fname=$j".out"; touch $fname; done; cd ..; done
```

## 3-2. バックアップ実行

以下コマンドをバックアップサーバのopcユーザで実行します。  
このコマンドは、バックアップサーバの **/mnt/nfs/source_dir** ディレクトリ以下を **[1-2. オブジェクトストレージバケット作成](#1-2-オブジェクトストレージバケット作成)** で作成したバケット **rclone** の **dest_dir** に差分バックアップします。初回実行時は、フルバックアップになります。  
ここで **source_dir** と **dest_dir** は、スループット検証の場合は何れも **large** 、メタデータ性能検証の場合は何れも **small** とします。

```sh
$ time sudo rclone --oos-upload-cutoff 16Mi --transfers 100 --oos-chunk-size 16Mi --oos-upload-concurrency 128 --oos-attempt-resume-upload --oos-leave-parts-on-error --copy-links --metadata --checksum sync /mnt/nfs/source_dir nfs-backup:rclone/dest_dir
```

出力されたtimeコマンドの時間情報から、スループットとメタデータ性能を計算し確認します。

## 3-3. リストア実行

以下コマンドをバックアップサーバのopcユーザで実行します。  
このコマンドは、 **[1-2. オブジェクトストレージバケット作成](#1-2-オブジェクトストレージバケット作成)** で作成したバケット **rclone** の **dest_dir** をバックアップサーバの **/mnt/nfs/restore/source_dir** ディレクトリ以下にリストアします。  
ここで **dest_dir** と **source_dir** は、スループット検証の場合は何れも **large** 、メタデータ性能検証の場合は何れも **small** とします。

```sh
$ time sudo rclone --oos-upload-cutoff 16Mi --transfers 100 --oos-chunk-size 16Mi --oos-upload-concurrency 128 --oos-attempt-resume-upload --oos-leave-parts-on-error --copy-links --metadata sync nfs-backup:rclone/dest_dir /mnt/nfs/restore/source_dir
```

出力されたtimeコマンドの時間情報から、スループットとメタデータ性能を計算し確認します。

これで、このチュートリアルは終了です。