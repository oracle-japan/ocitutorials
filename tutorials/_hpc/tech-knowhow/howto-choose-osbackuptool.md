---
title: "ファイル共有ストレージ向けバックアップ環境の最適な構築手法"
excerpt: "HPC/GPUクラスタを運用する際必須となるファイル共有ストレージは、コストパフォーマンスを考慮するとベア・メタル・インスタンスとブロック・ボリューム等のストレージサービスで構築することになりますが、そのバックアップ環境は自身で構築する必要があり、バックアップを格納するストレージはその安価な容量単価からオブジェクト・ストレージやブロック・ボリュームのより低いコストが有力な選択肢になります。本テクニカルTipsは、ファイル共有ストレージのバックアップを容量単価の安価なストレージに取得することを念頭に、自身のバックアップ要件に沿った最適なバックアップ環境構築手法を選定する方法を解説します。"
order: "325"
layout: single
header:
  teaser: "/hpc/spinup-backup-server/architecture_diagram_bv.png"
  overlay_image: "/hpc/spinup-backup-server/architecture_diagram_bv.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---
<style>
table, th, td {
    font-size: 80%;
}
</style>

***
# 0. 概要

**ベア・メタル・インスタンス** と **ブロック・ボリューム** 等のストレージサービスで構築するNFSでサービスするファイル共有ストレージは、NFSのマネージドサービスである **ファイル・ストレージ** の場合は備え付けのバックアップ機能を利用できるのに対し、自身でバックアップ環境を構築する必要があります。  
この際バックアップを格納するストレージは、通常バックアップ対象のファイルを格納するストレージ（**ブロック・ボリューム** の **バランス** や **Dense I/Oシェイプ** のNVMe SSDローカルディスク）より容量単価の安価なものを選択する必要があるため、 **オブジェクト・ストレージ** や **ブロック・ボリューム** の **より低いコスト** （**ブロック・ボリューム** の **パフォーマンス・レベル** が最低のサービスで、 **ブロック・ボリューム** の中では最も容量単価が安価です。関連する **OCI** 公式ドキュメントは、 **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/Block/Concepts/blockvolumeperformance.htm)** を参照してください。以降" **BVLC** "と呼称します。）が候補になります。  
またバックアップに使用するツールは、差分バックアップ機能を有することが求められ、バックアップ格納ストレージが **オブジェクト・ストレージ** の場合はこの領域へのアクセス機能を有する必要があります。

以上より本テクニカルTipsは、バックアップ格納ストレージに **オブジェクト・ストレージ** と **BVLC** 、バックアップツールに **オブジェクト・ストレージ** へのアクセス機能を有する以下ソフトウェアと **rsync** を取り上げ、

- **[Command Line Interface](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/cliconcepts.htm)** （以降" **OCI CLI** "と呼称）  
**OCI** の操作をコマンドラインインターフェースで行うための **OCI CLI** は、POSIXファイルシステムと **オブジェクト・ストレージ** を同期させる機能を持ち、これを利用して差分バックアップを実現します。
- **[OCIFS](https://docs.oracle.com/ja-jp/iaas/oracle-linux/ocifs/index.htm)**  
**OCI** が無償で提供するユーティリティの **OCIFS** は、 **オブジェクト・ストレージ** をPOSIXファイルシステムのディレクトリ階層にマウントし、POSIXのIOシステムコールを使用するアプリケーションが **オブジェクト・ストレージ** にアクセスすることを可能にします。
- **[Rclone](https://rclone.org/)**  
**Rclone** は、様々なクラウドストレージで利用可能なデータ転送ツールとして幅広く利用されている高機能のオープンソースソフトウェアで、 **オブジェクト・ストレージ** をバックエンドのストレージとして公式にサポートし、ストレージ間を同期させる機能により差分バックアップを実現します。

これらを以下のように組み合わせた4種類のバックアップ環境を比較・検証します。

| No. | バックアップ<br>格納ストレージ | バックアップツール             | バックアップ方法                                                                                                                                |
| :-: | :---------------: | :-------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: |
| 1   | **オブジェクト・ストレージ**  | **OCI CLI**           | **[oci os object sync](https://docs.oracle.com/en-us/iaas/tools/oci-cli/3.49.3/oci_cli_docs/cmdref/os/object/sync.html)** コマンドで差分バックアップ |
| 2   | **オブジェクト・ストレージ**  | **OCIFS** + **rsync** | **OCIFS** でマウントした **オブジェクト・ストレージ** に<br>**rsync** で差分バックアップ                                                                                |
| 3   | **オブジェクト・ストレージ**  | **Rclone**            | **[rclone sync](https://rclone.org/commands/rclone_sync/)** コマンドで差分バックアップ                                                                                                           |
| 4   | **BVLC**          | **rsync**             | **BVLC** に作成したPOSIXファイルシステムに<br>**rsync** で差分バックアップ                                                                                        |

以降では、まず初めにこれらのバックアップ環境の前提条件を提示し、次に以下の観点でこれらを比較・検証することで、自身のバックアップ要件に沿ったバックアップ環境をどのように選択すればよいかを解説します。

- バックアップ・リストア時の制約事項
- バックアップ・リストア性能
- ランニングコスト

***
# 1. バックアップ環境前提条件

## 1-0. 概要

本章は、本テクニカルTipsで取り上げるバックアップ環境を検証する際の前提条件を、以下の観点で解説します。

- 検証環境
- ソフトウェアバージョン
- バックアップ・リストア時指定のオプション

## 1-1. 検証環境

各バックアップ環境は、ストレージに **ブロック・ボリューム** を使用しこれを **ベア・メタル・インスタンス** にアタッチする方法（以降"ブロック・ボリュームNFSサーバ”と呼称）でNFSでサービスするファイル共有ストレージをバックアップする前提で、何れも **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[ブロック・ボリュームでファイル共有ストレージを構築する](/ocitutorials/hpc/spinup-nfs-server/)** の手順に従い構築されたファイル共有ストレージと **[ベア・メタル・インスタンスNFSサーバ向けバックアップサーバを構築する](/ocitutorials/hpc/spinup-backup-server/)** の手順に従い構築されたバックアップ環境を使用し、ここで構築したバックアップサーバでバックアップツールを実行します。

![システム構成図OS](/ocitutorials/hpc/spinup-backup-server/architecture_diagram_os.png)
<center><u>バックアップ格納ストレージに <strong>オブジェクト・ストレージ</strong> を使用する場合</u></center><br>

![システム構成図BV](/ocitutorials/hpc/spinup-backup-server/architecture_diagram_bv.png)
<center><u>バックアップ格納ストレージに <strong>BVLC</strong> を使用する場合</u></center><br>

なお、このチュートリアルで構築するバックアップ環境は **No. 3** と **No. 4** のため、 **No. 1** と **No. 2** のバックアップツールである **OCI CLI** と **OCIFS** を追加でバックアップサーバにインストールします。

**OCI CLI** のインストールは、以下の **OCI** 公式マニュアルに従い行います。  
なお、 **OCI CLI** の実行時認証は、チュートリアルに従って構築されたバックアップサーバが **[インスタンス・プリンシパル](/ocitutorials/hpc/#5-15-インスタンスプリンシパル)** 認証の設定を完了しているため、これを使用します。

**[https://docs.oracle.com/ja-jp/iaas/Content/API/SDKDocs/cliinstall.htm](https://docs.oracle.com/ja-jp/iaas/Content/API/SDKDocs/cliinstall.htm)**

また **OCIFS** のインストールは、以下コマンドをバックアップサーバのopcユーザで実行します。

```sh
$ sudo dnf install -y ocifs
```

次に、以下コマンドをバックアップサーバのopcユーザで実行し、バックアップに使用する **オブジェクト・ストレージ** の **バケット** を **/mnt/os** にマウントします。  
なお、 **OCIFS** の実行時認証は、チュートリアルに従って構築されたバックアップサーバが **[インスタンス・プリンシパル](/ocitutorials/hpc/#5-15-インスタンスプリンシパル)** 認証の設定を完了しているため、これを使用します。

```sh
$ sudo mkdir /mnt/os
$ sudo ocifs --auth=instance_principal --cache=/var/tmp/ocifs-cache bucket_name /mnt/os
```

なおコマンド中の **bucket_name** は、自身の環境に置き換えて指定します。

## 1-2. ソフトウェアバージョン

本テクニカルTipsで検証する各バックアップツールのバージョンを以下に示します。

- **OCI CLI** ： 3.48.2
- **OCIFS** ： 1.1.0-2
- **Rclone** ： v1.68.1
- **rsync** ： 3.2.3

## 1-3. バックアップ・リストア時指定のオプション

### 1-3-0. 概要

本章は、各バックアップ環境を使用してバックアップ・リストアを行う際、使用するバックアップツールに指定するオプション等をバックアップ環境毎に解説します。

### 1-3-1. バックアップ環境No. 1

**OCI CLI** を使用するバックアップ環境 **No. 1** のバックアップは、以下コマンドをバックアップサーバのopcユーザで実行します。

```sh
$ sudo oci os object sync --auth instance_principal --delete --parallel-operations-count 100 --bucket-name bucket_name --src-dir /mnt/nfs/source_dir
```

なおコマンド中の **bucket_name** と **source_dir** は、自身の環境に置き換えて指定します。

また、 **OCI CLI** を使用するバックアップ環境 **No. 1** のリストアは、以下コマンドをバックアップサーバのopcユーザで実行します。

```sh
$ sudo oci os object sync --auth instance_principal --delete --parallel-operations-count 100 --bucket-name bucket_name --dest-dir /mnt/nfs/dest_dir
```

なおコマンド中の **bucket_name** と **dest_dir** は、自身の環境に置き換えて指定します。

### 1-3-2. バックアップ環境No. 2

**OCIFS** と **rsync** を使用するバックアップ環境 **No. 2** のバックアップは、以下コマンドをバックアップサーバのopcユーザで実行します。

```sh
$ sudo rsync -au /mnt/nfs/source_dir /mnt/os
```

なおコマンド中の **source_dir** は、自身の環境に置き換えて指定します。

また、 **OCIFS** と **rsync** を使用するバックアップ環境 **No. 2** のリストアは、以下コマンドをバックアップサーバのopcユーザで実行します。  
最初の2個のコマンドは、バックアップ時のキャッシュを無効化するためのもので、これによりリストア時に **オブジェクト・ストレージ** からデータを読み出す際の性能を計測しています。

```sh
$ sudo umount /mnt/os
$ sudo ocifs --auth=instance_principal --cache=/var/tmp/ocifs-cache bucket_name /mnt/os
$ sudo rsync -au /mnt/os/source_dir /mnt/nfs/restore_dir 
```

なおコマンド中の **source_dir** と **restore_dir** は、自身の環境に置き換えて指定します。

### 1-3-3. バックアップ環境No. 3

**Rclone** を使用するバックアップ環境 **No. 3** のバックアップは、以下コマンドをバックアップサーバのopcユーザで実行します。

```sh
$ sudo rclone --oos-upload-cutoff 16Mi --transfers 100 --oos-chunk-size 16Mi --oos-upload-concurrency 128 --oos-attempt-resume-upload --oos-leave-parts-on-error --copy-links --metadata --checksum sync /mnt/nfs/source_dir rclone_conn:bucket_name/dest_dir
```

なお、コマンド中の **source_dir** 、 **rclone_conn** 、 **bucket_name** 、及び **dest_dir** は、自身の環境に置き換えて指定します。

また、 **Rclone** を使用するバックアップ環境 **No. 3** のリストアは、以下コマンドをバックアップサーバのopcユーザで実行します。

```sh
$ sudo rclone --oos-upload-cutoff 16Mi --transfers 100 --oos-chunk-size 16Mi --oos-upload-concurrency 128 --oos-attempt-resume-upload --oos-leave-parts-on-error --copy-links --metadata --checksum sync rclone_conn:bucket_name/dest_dir /mnt/nfs/restore/source_dir
```

なお、コマンド中の **rclone_conn** 、 **bucket_name** 、 **dest_dir** 、及び **source_dir** は、自身の環境に置き換えて指定します。

### 1-3-4. バックアップ環境No. 4

**BVLC** と **rsync** を使用するバックアップ環境 **No. 4** のバックアップは、以下コマンドをバックアップサーバのopcユーザで実行します。

```sh
$ sudo rsync -auH /mnt/nfs/source_dir /mnt/bv
```

なお、コマンド中の **source_dir** は、自身の環境に置き換えて指定します。

また、 **BVLC** と **rsync** を使用するバックアップ環境 **No. 4** のリストアは、以下コマンドをバックアップサーバのopcユーザで実行します。

```sh
$ sudo rsync -auH /mnt/bv/source_dir /mnt/nfs/restore_dir 
```

なお、コマンド中の **source_dir** と **restore_dir** は、自身の環境に置き換えて指定します。

***
# 2. バックアップ・リストア時の制約事項

本章は、本テクニカルTipsで比較・検証する各バックアップ環境を **[1. バックアップ環境前提条件](#1-バックアップ環境前提条件)** で示した条件で利用する際、本来バックアップに求められる機能が満たせないような制約事項について、その評価項目と各バックアップ環境の対応を以下の表にまとめます。  
この制約事項の多くは、バックアップ格納ストレージに **オブジェクト・ストレージ** を使用する際、POSIXファイルシステムのメタデータが保持されないことに起因します。

| No. | 評価項目                   | バックアップ環境<br>No. 1 | バックアップ環境<br>No. 2 | バックアップ環境<br>No. 3 |バックアップ環境<br>No. 4|
| :-: | :--------------------: | :---------: | :-------: | :--------: | :--------: |
| 1   | 所有者・所有グループの保存            | ✖（※1）       | △（※2）     | ✖（※1）      |〇|
| 2   | パーミッションの保存             | ✖（※3）       | △（※4）     | ✖（※3）      |〇|
| 3   | ファイル作成・更新日時の保存         | ✖（※5）       | △（※6）     | 〇          |〇|
| 4   | ディレクトリ作成・更新日時の保存       | ✖（※5）       | △（※6）     | ✖（※5）      |〇|
| 5   | ハードリンクの保存              | ✖（※7）       | ✖（※7）     | ✖（※7）      |〇（※8）|
| 6   | シンボリックリンクの保存           | ✖（※9）       | ✖         | ✖（※10）      |〇|
| 7   | 空のディレクトリの保存            | 〇           | 〇         | ✖          |〇|
| 8  | キャシュ用のストレージが不要 | 〇           | ✖（※11）    | 〇          |〇|
|9|チェックサムによる<br>ファイル転送結果確認機能を持つ<br>（※12）|✖|✖|〇|-<br>（※13）|

※1）リストア実行ユーザとそのプライマリグループになります。  
※2）再マウントでマウント実行ユーザとそのプライマリグループになります。  
※3）全てのファイルとディレクトリはそれぞれ **644** と **755** でリストアされます。  
※4）再マウントで全てのファイルとディレクトリはそれぞれ **644** と **755** になります。  
※5）リストア時の日時になります。  
※6）再マウントでリストア時の日時になります。  
※7）リンク数分のファイルの実体としてリストアされます。  
※8）**rsync** の **-H** オプション指定による挙動です。  
※9）参照先のファイルの実体としてリストアされます。  
※10）**Rclne** の **--copy-links** オプション指定により、参照先のファイルの実体としてリストアされます。  
※11）**オブジェクト・ストレージ** にアクセス（書込み・読込みの何れも含みます。）するファイルサイズの総容量に等しい空き容量を持つストレージ領域が必要です。このためフルバックアップは、バックアップ対象のファイル共有ストレージの総使用量以上の空き容量がキャッシュ用ストレージに必要になります。 **OCIFS** のキャッシュに関する詳細は、 **OCI** 公式ドキュメントの **[ここ](https://docs.oracle.com/ja-jp/iaas/oracle-linux/ocifs/index.htm#ocifs-cache-options)** を参照してください。  
※12）転送完了後に **オブジェクト・ストレージ** が計算するチェックサムを使用して、正しくファイル転送が完了したかどうかを確認する機能です。  
※13）バックアップ格納ストレージに **オブジェクト・ストレージ** を使用しないため、該当しません。

この結果から各バックアップ環境を比較すると、以下のように考察することが出来ます。

1. 評価項目 **1** ～ **4** のメタデータ保持がバックアップ要件となる場合は、選択肢がバックアップ環境 **No. 4** に限定される。
2. 評価項目 **8** から、バックアップ環境 **No. 2** は容量単価の安価な **オブジェクト・ストレージ** をバックエンドストレージに利用するメリットを享受できない。
3. 評価項目 **1** ～ **4** から、POSIXファイルシステムのメタデータ保持に関するバックアップ環境 **No. 2** の優位性は、バックアップサーバの再起動等で発生する再マウントによりキャシュ領域に保持しているメタデータ情報が消失するため、現実的な運用ではこれを享受することが出来ない。  
4. 評価項目 **3** から、バックアップ環境 **No. 3** は他の **オブジェクト・ストレージ** を使用するバックアップ環境に対して優位性がある。  
5. 評価項目 **9** から、バックアップ環境 **No. 3** はバックアップの信頼性で優位性がある。

以上より、考察 **2** で <u><strong>OCIFS</strong>が選択肢から脱落</u> し、考察 **1** 、 **4** 、及び **5** で残りの選択肢からどのバックアップ環境を選定するかを判断することになります。

***
# 3. バックアップ・リストア性能

本章は、 **[1. バックアップ環境前提条件](#1-バックアップ環境前提条件)** で示した条件に於ける各バックアップ環境のバックアップ時とリストア時の性能を、以下の観点で検証します。

- スループット  
サイズの大きなファイルをバックアップ・リストアする際の性能指標として、以下の条件でスループット（単位時間当たりの転送データ量 **MiB/s** ）を計測します。  
この際、ファイルシステムキャッシュをフラッシュした後に計測します。（※14）
  - テストファイルサイズ： 10 GiB
  - テストファイル作成方法： /dev/urandomを元にddで作成（※15）
  - テストファイル数： 1
- メタデータ性能  
サイズの小さなファイルをバックアップ・リストアする際の性能指標として、以下の条件でメタデータ性能（単位時間当たりの作成ファイル数 **files/s** ）を計測します。  
この際、ファイルシステムキャッシュをフラッシュした後に計測します。（※14）
  - テストファイルサイズ： 0 B
  - ディレクトリ数： 1,000
  - ディレクトリ当たりファイル数： 1,000
  - 総ファイル数： 1,000,000（※16）

※14）以下のコマンドをバックアップサーバのopcユーザで実行します。

```sh
$ sync && echo 3 | sudo tee /proc/sys/vm/drop_caches
```

※15）以下のコマンドでテストファイルを作成します。

```sh
$ dd if=/dev/urandom of=./10G.bin bs=1048576 count=$((1024*10))
```

※16）以下のコマンドでテストファイルを作成します。

```sh
$ count=1000; for i in `seq -w 1 $count`; do echo $i; mkdir $i; cd $i;for j in `seq -w 1 $count`; do fname=$j".out"; touch $fname; done; cd ..; done
```

以下の表は、以上の条件で計測したバックアップ・リストア性能です。（各データは3回計測した平均値です。）  
なお、バックアップ格納ストレージに **オブジェクト・ストレージ** を使用するバックアップ環境の性能値は、計測時点の状況により大きく変動することがあるため、参考値としてご利用ください。

| No. | 評価項目              | バックアップ環境<br>No. 1        | バックアップ環境<br>No. 2          | バックアップ環境<br>No. 3         |バックアップ環境<br>No. 4         |
| :-: | :---------------: | -----------------: | -----------------: | -----------------: |-----------------: |
| 1   | バックアップ<br>スループット  | 665 MiB/s<br>（※17） | 46 MiB/s           | 301 MiB/s<br>（※17） |280 MiB/s|
| 2   | バックアップ<br>メタデータ性能 | 238 files/s        | 3 files/s<br>（※18） | 2,857 files/s      |7,082 files/s
| 3   | リストア<br>スループット    | 417 MiB/s<br>（※17） | 4 MiB/s            | 217 MiB/s<br>（※17） |292 MiB/s|
| 4   | リストア<br>メタデータ性能   | 128 files/s        | 259 files/s        | 1,927 files/s      |236 files/s|

※17）バックアップ環境 **No. 1** とバックアップ環境 **No. 3** のスループットの差は、ファイル転送前後のチェックサムによる転送結果確認の有無が影響していると考えられ、 **Rclone** はチェックサム確認を実施するのに対し、 **OCI CLI** はチェックサム確認の機能を有していません。  
※18）性能が悪く途中で検証を打ち切ったため、途中経過から算出した概略値です。

この結果から各バックアップ環境を比較すると、以下のように考察することが出来ます。

1. 評価項目 **2** から、バックアップ環境 **No. 2** の採用は現実的ではない。  
2. 評価項目 **1** と **3** から、バックアップ環境 **No. 1** はバックアップ環境 **No. 3** や **No. 4** に対して約2倍のスループットを示し、サイズの大きなファイルが存在するファイル共有ストレージのバックアップに於いて有利である。（この理由は、※17）を参照してください。）  
3. 評価項目 **2** から、バックアップ環境 **No. 4** はバックアップ時のメタデー性能が他と比較して圧倒的に高く、サイズの小さなファイルが多数存在するファイル共有ストレージのバックアップで有利である。  
4. 評価項目 **2** と **4** から、バックアップ環境 **No. 3** は同じくバックアップ格納ストレージに **オブジェクト・ストレージ** を使用するバックアップ環境 **No. 1** に対してメタデータ性能が桁違いに高く、サイズの小さなファイルが多数存在するファイル共有ストレージのバックアップ・リストアで有利である。

以上より、考察 **1** で <u>バックアップ環境 <strong>No. 2</strong> が選択肢から脱落</u> し、考察 **2** ～ **4** で <u>残りの選択肢からどのバックアップ環境を選定するかはバックアップ対象のファイルサイズ分布で判断する</u> のが良いと考えることが出来ます。

***
# 4. ランニングコスト

本章は、本テクニカルTipsで取り上げるバックアップ環境のランニングコストを、バックアップ格納ストレージにフォーカスして検証します。

ここでバックアップ環境 **No. 2** は、 **[2. バックアップ・リストア時の制約事項](#2-バックアップリストア時の制約事項)** の考察 **2.** と **[3. バックアップ・リストア性能](#3-バックアップリストア性能)** の考察 **1.** から、本章の検証の対象から除外します。  
また、バックアップ環境 **No. 1** とバックアップ環境 **No. 3** は、そのランニングコストが基本的に同額のためこれらを纏めて取り扱います。

以上より、以降ではバックアップ格納ストレージに **オブジェクト・ストレージ** を使用するバックアップ環境 **No. 1** / **No. 3** と、 **BVLC** を使用するバックアップ環境 **No. 4** のランニングコストを比較します。

ここで **オブジェクト・ストレージ** （**標準**）案と **BVLC** 案のランニングコストは、以下の条件を仮定します。

- ファイル共有ストレージ総容量 ： 100 TB（※19）
- ファイル共有ストレージ使用率 ： 70 %

※19）この仮定から **BVLC** の総容量を100 TBと仮定します。  

|                            | 月額定価<br>（2024年11月時点） |
| :------------------------: | -------------------: |
| **オブジェクト・ストレージ** （**標準**）案 | **276,675** 円        |
| **BVLC** 案                 | **395,250** 円        |

この結果から各案を比較すると、以下のように考察することが出来ます。

1. **オブジェクト・ストレージ** （**標準**）案は、バックアップ対象ファイルの総容量に応じた従量課金のため、ファイル共有ストレージ総容量分が固定的に課金される **BVLC** 案に対して有利である。
2. ファイル共有ストレージ使用率が上昇すると両者の価格差は縮まり、下降すると価格差は広がる。
3. **オブジェクト・ストレージ** の階層に **頻度の低いアクセス** や **アーカイブ** を使用することで、 **オブジェクト・ストレージ** （**標準**）案よりランニングコストを低減できる可能性がある。（※20）

※20）**頻度の低いアクセス** や **アーカイブ** がコスト計算上の最低保持期間を定義しているため、バックアップ対象ファイルの更新パターン・頻度により、ランニングコストの低減額は大きく異なり、コストアップとなる場合もあります。関連する **OCI** 公式ドキュメントは、 **[ここ](https://docs.public.oneportal.content.oci.oraclecloud.com/ja-jp/iaas/Content/Object/Concepts/understandingstoragetiers.htm)** を参照してください。