---
title: "HPC/GPUクラスタを構築する(基礎インフラ自動構築編)"
excerpt: "HPC/GPUクラスタを構築してみましょう。このチュートリアルは、HPC/GPUクラスタのノード間接続に最適な高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでベアメタルインスタンスをノード間接続するHPC/GPUクラスタを、予め用意されたTerraformスクリプトを活用してリソース・マネージャやTerraform CLIで自動構築します。"
order: "112"
layout: single
header:
  teaser: "/hpc/spinup-hpc-cluster-withterraform/architecture_diagram.png"
  overlay_image: "/hpc/spinup-hpc-cluster-withterraform/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

このチュートリアルは、HPC/GPUクラスタの計算/GPUノードに最適なベアメタルインスタンス（本チュートリアルではHPCクラスタ向けに **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** GPUクラスタ向けに **[BM.GPU4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** を使用）を **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** でノード間接続する、HPC/機械学習ワークロードを実行するためのHPC/GPUクラスタを構築する際のベースとなるインフラストラクチャを、予め用意された **[Terraform](/ocitutorials/hpc/#5-12-terraform)** スクリプトを活用して自動構築し、そのインターコネクト性能を検証します。  
この自動構築は、Terraformスクリプトを **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** に読み込ませて作成する **[スタック](/ocitutorials/hpc/#5-3-スタック)** を使用する方法と、Terraform実行環境を用意してTerraform CLIを使用する方法から選択することが出来ます。

このチュートリアルで作成する環境は、ユーザ管理、ホスト名管理、共有ファイルシステム、プログラム開発環境、コンテナランタイム、ジョブスケジューラ等、必要なソフトウェア環境をこの上に整備し、ご自身の要件に沿ったHPC/GPUクラスタを構築する際の基礎インフラストラクチャとして利用することが可能です。  
なお、これらのクラスタ管理に必要なソフトウェアの導入までを自動化する **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** も利用可能で、詳細は **[HPCクラスタを構築する(スタティッククラスタ自動構築編)](/ocitutorials/hpc/spinup-hpc-cluster)** や **[GPUクラスタを構築する(スタティッククラスタ自動構築編)](/ocitutorials/hpc/spinup-gpu-cluster-withstack)** を参照ください。

![システム構成図](architecture_diagram.png)

本チュートリアルで作成するHPC/GPUクラスタ構築用のTerraformスクリプトは、そのひな型がGitHubのパブリックレポジトリから公開されており、適用すると以下の処理を行います。

- VCNと関連するネットワークリソース構築
- Bastionノード構築
- 計算/GPUノード用 **[インスタンス構成](/ocitutorials/hpc/#5-7-インスタンス構成)** 作成
- クラスタ・ネットワークと計算/GPUノード構築
- HPC/GPUクラスタ内のノード間SSHアクセスに使用するSSH鍵ペア作成・配布
- 計算/GPUノードの全ホスト名を記載したホストリストファイル（/home/opc/hostlist.txt）作成
- 構築したBastionノード・計算/GPUノードのホスト名・IPアドレス出力

Bastionノード構築は、 **[cloud-init](/ocitutorials/hpc/#5-11-cloud-init)** 設定ファイル(cloud-config)を含み、cloud-initがBastionノードデプロイ時に以下の処理を行います。

- タイムゾーンをJSTに変更
- ホームディレクトリ領域のNFSエクスポート
- 計算/GPUノードのDNS名前解決をショートホスト名で行うための **resolv.conf** 修正

また計算/GPUノード用インスタンス構成は、cloud-configを含み、cloud-initが計算/GPUノードデプロイ時に以下の処理を行います。

- タイムゾーンをJSTに変更
- NVMe SSDローカルディスク領域ファイルシステム作成
- firewalld停止
- ルートファイルシステム拡張
- クラスタ・ネットワーク接続用ネットワークインターフェース作成
- BastionノードのDNS名前解決をショートホスト名で行うための **resolv.conf** 修正
- Bastionノードホームディレクトリ領域のNFSマウント

**所要時間 :** 約1時間

**前提条件 :** HPC/GPUクラスタを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。

**注意 :** チュートリアル内の画面ショットについては、OCIの現在のコンソール画面と異なっている場合があります。

***
# 0. 事前準備

## 0-0. 概要

本章は、HPC/GPUクラスタを構築する際事前に用意しておく必要のあるリソースを作成します。  
この手順は、構築手法に **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** を使用する方法を採用するか、 **[Terraform](/ocitutorials/hpc/#5-12-terraform)** CLIを使用する方法を採用するかで異なります。

[リソース・マネージャを使用する方法]
- 構成ソース・プロバイダ作成
- スタック作成

[Terraform CLIを使用する方法]
- Terraform実行環境構築
- Terraformスクリプト作成

以降では、2つの異なる構築手法毎にその手順を解説します。

## 0-1. リソース・マネージャを使用する方法

### 0-1-1. 構成ソース・プロバイダ作成

本章は、ひな型となる **[Terraform](/ocitutorials/hpc/#5-12-terraform)** スクリプトをGitHubパブリックレポジトリから取り込むための構成ソース・プロバイダを作成します。

GitHubにアクセスするための構成ソース・プロバイダの作成は、GitHubのアカウントを持っておりこのアカウントで **Personal access token** を発行しておく必要があります。  
GitHubのアカウント作成は **[ここ](https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home)** 、 **Personal access token** の発行は **[ここ](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)** を参照ください。

構成ソース・プロバイダの作成手順は、OCI公式ドキュメントの **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/ResourceManager/Tasks/create-csp-github.htm#top)** を参照ください。  
本チュートリアルを実行するための構成ソース・プロバイダは、以下で作成します。

- **パブリック・エンドポイント/プライベート・エンドポイント :** パブリック・エンドポイント
- **タイプ :** GitHub
- **サーバーURL :** https://github.com/

### 0-1-2. スタック作成

本章は、HPC/GPUクラスタを構築するための **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** 用 **[スタック](/ocitutorials/hpc/#5-3-スタック)** を作成します。

1. OCIコンソールにログインし、HPC/GPUクラスタをデプロイするリージョンを選択後、 **開発者サービス** → **リソース・マネージャ** → **スタック** とメニューを辿ります。

2. 表示される以下画面で、**スタックの作成** ボタンをクリックします。

   ![画面ショット](console_page02.png)

3. 表示される以下 **スタック情報** 画面で、以下の情報を入力し、下部の **次** ボタンをクリックします。
    - **Terraformの構成のオリジン :** ソース・コード制御システム
    - **ソースコード管理タイプ :** GitHub
    - **構成ソース・プロバイダ :** **[0-1-1. 構成ソース・プロバイダ作成](#0-1-1-構成ソースプロバイダ作成)** で作成した構成ソース・プロバイダ
    - **リポジトリ :** **tutorial_cn**
    - **ブランチ :** **master**
    - **名前 :** スタックに付与する名前（任意）
    - **説明 :** スタックに付与する説明（任意）

   ![画面ショット](stack_page01.png)

4. 表示される **変数の構成** 画面で、各画面フィールドに以下の情報を入力し、下部の **次** ボタンをクリックします。

   4.1 **General options** フィールド
    - **Compartment :** HPC/GPUクラスタをデプロイするコンパートメント
    - **Availability Domain :** HPC/GPUクラスタをデプロイする可用性ドメイン
    - **SSH public key :** Bastionノードにログインする際使用するSSH秘密鍵に対応する公開鍵
      - 公開鍵ファイルのアップロード（ **SSHキー・ファイルの選択** ）と公開鍵のフィールドへの貼り付け（ **SSHキーの貼付け** ）が選択可能  

   ![画面ショット](stack_page02.png)

   4.2 **Compute/GPU node options** フィールド
    - **Cluster display name postfix :** 計算/GPUノードホスト名の接尾辞(\*1)
    - **Compute/GPU node shape :** BM.Optimized3.36(HPCクラスタ)/BM.GPU4.8(GPUクラスタ)
    - **Compute/GPU node count :** 計算/GPUノードのノード数（デフォルト：2）
    - **Compute/GPU node image OCID :** 計算/GPUノードのイメージOCID(\*3)
    - **Compute/GPU node boot volume size :** 計算/GPUノードのブートボリュームサイズ(GB)
    - **cloud-config :** 計算/GPUノードの **[cloud-init](/ocitutorials/hpc/#5-11-cloud-init)** 設定ファイル(cloud-config)(\*2)

   ![画面ショット](stack_page03.png)

   \*1) 例えば **x9-ol8** と指定した場合、計算/GPUノードのホスト名は **inst-xxxxx-x9-ol8** となります。（ **xxxxx** はランダムな文字列）  
   \*2) HPCクラスタかGPUクラスタかにより、以下のcloud-configを使用します。これをテキストファイルとして保存し、ブラウザで読み込みます。  

   [HPCクラスタ]
   ```sh
   #cloud-config
   timezone: Asia/Tokyo

   runcmd:
   #
   # Mount NVMe local storage
     - parted -s /dev/nvme0n1 mklabel gpt
     - parted -s /dev/nvme0n1 -- mkpart primary xfs 1 -1
   # To ensure partition is really created before mkfs phase
     - sleep 60
     - mkfs.xfs -L localscratch /dev/nvme0n1p1
     - mkdir -p /mnt/localdisk
     - echo "LABEL=localscratch /mnt/localdisk/ xfs defaults,noatime 0 0" >> /etc/fstab
     - mount /mnt/localdisk
   #
   # Stop firewalld
     - systemctl disable --now firewalld
   #
   # Expand root file system to those set by instance configuration
     - /usr/libexec/oci-growfs -y
   #
   # Set up cluster network interface
     - systemctl start oci-rdma-configure
   # Add public subnet to DNS search
     - sed -i '/^search/s/$/ public.vcn.oraclevcn.com/g' /etc/resolv.conf
     - chattr -R +i /etc/resolv.conf
   # NFS mount setting
     - echo "bastion:/home /home nfs defaults,vers=3 0 0" >> /etc/fstab
     - mount /home
   ```

   [GPUクラスタ]
   ```sh
   #cloud-config
   timezone: Asia/Tokyo

   runcmd:
   #
   # Mount NVMe local storage
     - vgcreate nvme /dev/nvme0n1 /dev/nvme1n1 /dev/nvme2n1 /dev/nvme3n1
     - lvcreate -l 100%FREE nvme
     - mkfs.xfs -L localscratch /dev/nvme/lvol0
     - mkdir -p /mnt/localdisk
     - echo "LABEL=localscratch /mnt/localdisk/ xfs defaults,noatime 0 0" >> /etc/fstab
     - mount /mnt/localdisk
   #
   # Stop firewalld
     - systemctl disable --now firewalld
   #
   # Expand root file system to those set by instance configuration
     - /usr/libexec/oci-growfs -y
   #
   # Set up cluster network interface
     - systemctl start oci-rdma-configure
   # Add public subnet to DNS search
     - sed -i '/^search/s/$/ public.vcn.oraclevcn.com/g' /etc/resolv.conf
     - chattr -R +i /etc/resolv.conf
   # NFS mount setting
     - echo "bastion:/home /home nfs defaults,vers=3 0 0" >> /etc/fstab
     - mount /home
   ```

   \*3) 以下のOCIDを指定します。

|         | Oracle Linuxバージョン | OCID                                                                          |
| ------- | ----------------- | ----------------------------------------------------------------------------- |
| HPCクラスタ | 7.9               | ocid1.image.oc1..aaaaaaaayouelanobgkbsb3zanxtu6cr4bst62wco2xs5mzg3it7fp2iuvbq |
|         | 8.6               | ocid1.image.oc1..aaaaaaaazgofwgysyz5i5bupwhjmolgf44b7vlwyqxy7pmcrpbufpmvef6da |
| GPUクラスタ | 7.9               | ocid1.image.oc1..aaaaaaaalro3vf5xh34zvg42i3j5c4kp6rx4ndoeq6c5v5zzotl5gwjrnxr  |
|         |                   |                                                                               |

\5. 表示される **確認** 画面で、これまでの設定項目が意図したものになっているかを確認し、以下 **作成されたスタックで適用を実行しますか。** フィールドの **適用の実行** をチェックオフし、下部の **作成** ボタンをクリックします。

   ![画面ショット](stack_page04.png)

   ここで **適用の実行** をチェックした場合、 **作成** ボタンのクリックと同時にスタックの適用が開始され、HPC/GPUクラスタの構築が始まりますが、このチュートリアルでは後の章で改めてスタックの適用を行います。

これで、以下画面のとおりHPC/GPUクラスタ構築用スタックが作成されました。

![画面ショット](stack_page05.png)

## 0-2. Terraform CLIを使用する方法

### 0-2-1. Terraform実行環境構築

本章は、 **[Terraform](/ocitutorials/hpc/#5-12-terraform)** CLIを使用してHPC/GPUクラスタのライフサイクル管理を実行するTerraform実行環境を構築します。  
この実行環境は、インターネットに接続されたLinux・Windows・Macの何れかのOSが稼働している端末であればよく、以下のような選択肢が考えられます。

- OCI上のLinuxが稼働するVMインスタンス
- ご自身が使用するWindows/Macパソコン
- ご自身が使用するWindows/Macパソコンで動作するLinuxゲストOS

本チュートリアルは、このTerraform実行環境のOSにLinuxを使用します。

Terraform実行環境は、以下のステップを経て構築します。

- Terraformインストール
- Terraform実行環境とOCI間の認証関係締結（APIキー登録）

具体的なTerraform実行環境構築手順は、チュートリアル **[TerraformでOCIの構築を自動化する](https://oracle-japan.github.io/ocitutorials/intermediates/terraform/)** の **[2. Terraform環境の構築](https://oracle-japan.github.io/ocitutorials/intermediates/terraform/#2terraform%E7%92%B0%E5%A2%83%E3%81%AE%E6%A7%8B%E7%AF%89)** を参照ください。  
また、関連するOCI公式ドキュメントは、 **[ここ](https://docs.oracle.com/ja-jp/iaas/developer-tutorials/tutorials/tf-provider/01-summary.htm)** を参照ください。

### 0-2-2. Terraformスクリプト作成

本チュートリアルで使用するHPC/GPUクラスタ構築用の **[Terraform](/ocitutorials/hpc/#5-12-terraform)** スクリプトは、そのひな型をGitHubのパブリックレポジトリで公開しており、以下のファイル群で構成されています。

| ファイル名            | 用途                          |
| ---------------- | --------------------------- |
| cn.tf            | インスタンス構成とクラスタ・ネットワークの定義     |
| outputs.tf       | 構築したリソース情報の出力               |
| terraform.tfvars | Terraformスクリプト内で使用する変数値の定義  |
| variables.tf     | Terraformスクリプト内で使用する変数の型の定義 |
| instance.tf      | Bastionノードの定義         |
| provider.tf      | テナント・ユーザ・リージョンの定義           |
| vcn.tf           | VCNと関連するネットワークリソースの定義       |

これらのうち自身の環境に合わせて修正する箇所は、 **terraform.tfvars** と **provider.tf** に集約しています。

また、これらのファイルと同じディレクトリに **user_data** ディレクトリが存在し、cloud-configファイル群を格納しています。  
このcloud-configを修正することで、構築するHPC/GPUクラスタのOSレベルのカスタマイズをご自身の環境に合わせて追加・変更することも可能でます。

Terraformスクリプトの作成は、まず以下のGitHubレポジトリからひな型となるTerraformスクリプトをTerraform実行環境にダウンロードしますが、

**[https://github.com/fwiw6430/tutorial_cn](https://github.com/fwiw6430/tutorial_cn)**

これには以下コマンドをTerraform実行環境で実行するか、

```sh
$ git clone https://github.com/fwiw6430/tutorial_cn
```

GitHubのTerraformスクリプトレポジトリのページからzipファイルをTerraform実行環境にダウンロード・展開することで行います。  

次に、ダウンロードしたTerraformスクリプトのうち **terraform.tfvars** と **provider.tf** 内の以下Terraform変数を自身の環境に合わせて修正します。  
この際、ひな型ファイル内のこれらTerraform変数は、予めコメント( **#** で始まる行)として埋め込まれているため、これをコメントアウトして修正します。特に **provider.tf** のひな型はファイルは、全行がコメントとなっているため、これを全てコメントアウトした上で、Terraform変数を設定します。

[provider.tf]

| 変数名              | 設定値                        | 確認方法                                                                                         |
| ---------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| tenancy_ocid     | 使用するテナントのOCID              | **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/apisigningkey.htm#five)** を参照 |
| user_ocid        | 使用するユーザのOCID               | **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/apisigningkey.htm#five)** を参照 |
| private_key_path | OCIに登録したAPIキーの秘密キーのパス      | -                                                                                            |
| fingerprint      | OCIに登録したAPIキーのフィンガープリント    | **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/apisigningkey.htm#four)** を参照 |
| region           | HPC/GPUクラスタをデプロイするリージョン識別子 | **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/General/Concepts/regions.htm)** を参照        |

[terraform.tfvars]

| 変数名                 | 設定値                                                                     | 確認方法                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| sc_compartment_ocid | HPC/GPUクラスタをデプロイするコンパートメントのOCID                                         | **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/GSG/Tasks/contactingsupport_topic-Finding_the_OCID_of_a_Compartment.htm)** を参照 |
| sc_ad               | HPC/GPUクラスタをデプロイする可用性ドメイン識別子                                            | (\*4)                                                                                                                            |
| sc_ssh_key          | Bastionノードログインに使用するSSH秘密鍵に対する公開鍵                                        | -                                                                                                                                |
| sc_cn_display_name  | 計算/GPUノードホスト名の接尾辞                                                       | (\*5)                                                                                                                            |
| sc_cn_shape         | 計算/GPUノードに使用するシェイプ<br>・BM.Optimized3.36（HPCクラスタ）<br>・BM.GPU4.8（GPUクラスタ） | -                                                                                                                                |
| sc_cn_node_count    | 計算/GPUノードのノード数                                                          | -                                                                                                                                |
| sc_cn_image         | 計算/GPUノードに使用するOSイメージのOCID                                               | (\*6)                                                                                                                            |
| sc_cn_boot_vol_size | ブートボリュームのサイズ（GB）                                                        | -                                                                                                                                |
| sc_cn_cloud_config  | cloud-configファイルをbase64エンコードした文字列                                       | (\*7)                                                                                                                            |

\*4) OCIコンソールメニューから **コンピュート** → **インスタンス** を選択し **インスタンスの作成** ボタンをクリックし、表示される以下 **配置** フィールドで確認出来ます。

![画面ショット](console_page01.png)

\*5) 例えば **x9-ol8** と指定した場合、計算/GPUノードのホスト名は **inst-xxxxx-x9-ol8** となります。（ **xxxxx** はランダムな文字列）  

\*6) 以下のOCIDを指定します。（ダウンロードしたTerraformスクリプトのterraform.tfvarsに以下のOCIDがコメントとして埋め込まれています）

|         | Oracle Linuxバージョン | OCID                                                                          |
| ------- | ----------------- | ----------------------------------------------------------------------------- |
| HPCクラスタ | 7.9               | ocid1.image.oc1..aaaaaaaayouelanobgkbsb3zanxtu6cr4bst62wco2xs5mzg3it7fp2iuvbq |
|         | 8.6               | ocid1.image.oc1..aaaaaaaazgofwgysyz5i5bupwhjmolgf44b7vlwyqxy7pmcrpbufpmvef6da |
| GPUクラスタ | 7.9               | ocid1.image.oc1..aaaaaaaalro3vf5xh34zvg42i3j5c4kp6rx4ndoeq6c5v5zzotl5gwjrnxr  |
|         |                   |                                                                               |

\*7) HPCクラスタかGPUクラスタかにより、以下コマンドの出力を使用します。  

[HPCクラスタ]
```sh
$ cd tutorial_cn
$ base64 ./user_data/cloud-init_cnhpc.cfg | tr -d '\n'; echo
```

[GPUクラスタ]
```sh
$ cd tutorial_cn
$ base64 ./user_data/cloud-init_cngpu.cfg | tr -d '\n'; echo
```


***
# 1. HPC/GPUクラスタ構築

## 1-0. 概要

本章は、先に作成した **[スタック](/ocitutorials/hpc/#5-3-スタック)** / **[Terraform](/ocitutorials/hpc/#5-12-terraform)** スクリプトを使用し、HPC/GPUクラスタを構築します。  
この手順は、構築手法に **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** を使用する方法を採用するか、Terraform CLIを使用する方法を採用するかで異なり、以降では2つの異なる構築手法毎にその手順を解説します。

## 1-1. リソース・マネージャを使用する方法

1. 以下 **スタックの詳細** 画面で、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page06.png)

2. 表示される以下 **適用** サイドバーで、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page07.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、スタックの適用が実施されています。

   ![画面ショット](stack_page08.png)

   表示される以下 **ログ** フィールドで、リソースのデプロイ状況を確認します。

   ![画面ショット](stack_page09.png)

   この適用が完了するまでの所要時間は、計算/GPUノードのノード数が2ノードの場合で5分程度です。

   ステータスが **成功** となれば、HPC/GPUクラスタのデプロイが完了しています。

## 1-2. Terraform CLIを使用する方法

Terraform実行環境で、以下コマンドを実行します。

```sh
$ cd tutorial_cn
$ terraform init
$ terraform apply --auto-approve
```

最後のコマンドによるTerraformスクリプトの適用完了までの所要時間は、計算/GPUノードのノード数が2ノードの場合で5分程度です。

Terraformスクリプトの適用が正常に完了すると、以下のようにコマンド出力の最後にBastionノードと計算/GPUノードのホスト名とIPアドレスが出力されます。

```sh
Apply complete! Resources: 16 added, 0 changed, 0 destroyed.

Outputs:

Bastion_instances_created = {
  "display_name" = "bastion"
  "private_ip" = "10.0.1.138"
  "public_ip" = "123.456.789.123"
}
Compute_in_cn_created = {
  "inst-9fhuq-x9-ol8" = {
    "display_name" = "inst-9fhuq-x9-ol8"
    "private_ip" = "10.0.2.10"
  }
  "inst-dz99s-x9-ol8" = {
    "display_name" = "inst-dz99s-x9-ol8"
    "private_ip" = "10.0.2.73"
  }
}
```

***
# 2. HPC/GPUクラスタ確認

## 2-0. 概要

本章は、デプロイされたHPC/GPUクラスタ環境を確認します。

この際、作成された計算/GPUノードの全ホスト名を記載したホストリストファイルを使用し、BastionノードからHPC/GPUクラスタ内の全計算/GPUノードにSSHでコマンドを発行、その環境を確認します。  
なおこのホストリストファイルは、Bastionノードと全計算/GPUノードに **/home/opc/hostlist.txt** として存在します。

## 2-1. Bastionノードログイン

Bastionノードは、HPC/GPUクラスタ構築完了時に表示されるパブリックIPアドレスに対し、指定したSSH公開鍵に対応する秘密鍵を使用し、以下コマンドでインターネット経由ログインします。

```sh
$ ssh -i path_to_ssh_secret_key opc@123.456.789.123
```

## 2-2. cloud-init完了確認

**[cloud-init](/ocitutorials/hpc/#5-11-cloud-init)** は、計算/GPUノードが起動してSSHログインできる状態であっても、その処理が継続している可能性があるため、以下コマンドをBastionノードのopcユーザで実行し、そのステータスが **done** となっていることでcloud-initの処理完了を確認します。  
この際、ノード数分の接続するかどうかの確認に対して全て **yes** を入力します。

```sh
$ for hname in `cat /home/opc/hostlist.txt`; do echo $hname; ssh $hname "sudo cloud-init status"; done
inst-zvc5c-x9-ol8
The authenticity of host 'inst-zvc5c-x9-ol8 (10.0.2.159)' cannot be established.
ECDSA key fingerprint is SHA256:6zl4kIFKqpBrRlw/JCfStS05rdCu7Eif/4e3OWvbOsc.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'inst-zvc5c-x9-ol8,10.0.2.159' (ECDSA) to the list of known hosts.
status: done
inst-wf3wx-x9-ol8
The authenticity of host 'inst-wf3wx-x9-ol8 (10.0.2.31)' cannot be established.
ECDSA key fingerprint is SHA256:jWTGqZjG0dAyrbP04JGC8jJX+uqDwMFotLXirA7L+AA.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'inst-wf3wx-x9-ol8,10.0.2.31' (ECDSA) to the list of known hosts.
status: done
```

ステータスが **running** の場合は、cloud-initの処理が継続中のため、処理が完了するまで待ちます。

## 2-3. 計算ノードファイルシステム確認

計算/GPUノードは、以下のようにルートファイルシステムがデフォルトの50 GBから指定したサイズに拡張され、NVMe SSDローカルディスクが/mnt/localdiskにマウントされ、Bastionノードの/homeが/homeとしてマウントされています。

```sh
$ for hname in `cat /home/opc/hostlist.txt`; do echo $hname; ssh $hname "df -h / /mnt/localdisk /home"; done
inst-kicav-x9-ol8
Filesystem                  Size  Used Avail Use% Mounted on
/dev/mapper/ocivolume-root   89G   15G   74G  17% /
/dev/nvme0n1p1              3.5T   25G  3.5T   1% /mnt/localdisk
bastion:/home                36G  8.5G   28G  24% /home
inst-0vdz8-x9-ol8
Filesystem                  Size  Used Avail Use% Mounted on
/dev/mapper/ocivolume-root   89G   15G   74G  17% /
/dev/nvme0n1p1              3.5T   25G  3.5T   1% /mnt/localdisk
bastion:/home                36G  8.5G   28G  24% /home
```

***
# 3. MPIプログラム実行

## 3-0. 概要

本章は、計算/GPUノードの **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 対応OSイメージに含まれるOpenMPIとIntel MPI Benchmarkを使用し、クラスタ・ネットワークのノード間インターコネクト性能を確認します。

ここでは、2ノードのPing-Pong性能を計測しており、以下性能が出ています。

- 帯域：約11 GB/s（ネットワークインターフェース物理帯域100 Gbpsに対し88 Gbpsを計測）
- レイテンシ：約1.7 μs

## 3-1. Intel MPI Benchmark Ping-Pong実行

本章は、Intel MPI Benchmark Ping-Pongを実行します。

計算/GPUノードのうちの1ノードにopcユーザでSSHログインし、以下コマンドを実行します。
   
```sh
$ source /usr/mpi/gcc/openmpi-4.1.2a1/bin/mpivars.sh
$ mpirun -n 2 -N 1 -hostfile /home/opc/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -msglog 3:28 PingPong
#------------------------------------------------------------
#    Intel (R) MPI Benchmarks 2018, MPI-1 part    
#------------------------------------------------------------
# Date                  : Thu Jun  1 23:13:46 2023
# Machine               : x86_64
# System                : Linux
# Release               : 4.18.0-372.26.1.0.1.el8_6.x86_64
# Version               : #1 SMP Tue Sep 13 21:44:27 PDT 2022
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -msglog 3:28 PingPong

# Minimum message length in bytes:   0
# Maximum message length in bytes:   268435456
#
# MPI_Datatype                   :   MPI_BYTE 
# MPI_Datatype for reductions    :   MPI_FLOAT
# MPI_Op                         :   MPI_SUM  
#
#

# List of Benchmarks to run:

# PingPong

#---------------------------------------------------
# Benchmarking PingPong 
# #processes = 2 
#---------------------------------------------------
       #bytes #repetitions      t[usec]   Mbytes/sec
            0         1000         1.66         0.00
            8         1000         1.66         4.83
           16         1000         1.66         9.63
           32         1000         1.70        18.86
           64         1000         1.82        35.10
          128         1000         1.88        68.17
          256         1000         2.14       119.85
          512         1000         2.86       179.33
         1024         1000         2.34       437.41
         2048         1000         2.96       692.55
         4096         1000         3.46      1184.31
         8192         1000         4.46      1836.92
        16384         1000         6.28      2610.69
        32768         1000         8.17      4008.40
        65536          640        10.19      6432.34
       131072          320        15.40      8509.53
       262144          160        29.01      9035.93
       524288           80        51.59     10162.94
      1048576           40        96.98     10811.90
      2097152           20       187.75     11169.93
      4194304           10       369.17     11361.57
      8388608            5       732.33     11454.67
     16777216            2      1460.73     11485.51
     33554432            1      2935.25     11431.55
     67108864            1      5885.96     11401.51
    134217728            1     11807.75     11366.91
    268435456            1     23921.90     11221.33


# All processes entering MPI_Finalize
```

***
# 4. HPC/GPUクラスタ削除

## 4-0. 概要

本章は、先に作成した **[スタック](/ocitutorials/hpc/#5-3-スタック)** / **[Terraform](/ocitutorials/hpc/#5-12-terraform)** スクリプトを使用し、HPC/GPUクラスタを削除します。  
この手順は、構築手法に **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** を使用する方法を採用するか、Terraform CLIを使用する方法を採用するかで異なり、以降では2つの異なる構築手法毎にその手順を解説します。

## 4-1. リソース・マネージャを使用する方法

1. 以下 **スタックの詳細** 画面で、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page10.png)

2. 表示される以下 **破棄** サイドバーで、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page11.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、スタックの破棄が実施されています。

   ![画面ショット](stack_page12.png)

   表示される以下 **ログ** フィールドで、リソースの削除状況を確認します。

   ![画面ショット](stack_page09.png)

   この破棄が完了するまでの所要時間は、計算ノードのノード数が2ノードの場合で3分程度です。

   ステータスが **成功** となれば、HPC/GPUクラスタの削除が完了しています。

## 4-2. Terraform CLIの場合

本章は、 **[Terraform](/ocitutorials/hpc/#5-12-terraform)** スクリプトをTerraform CLIで破棄し、HPC/GPUクラスタを削除します。

Terraform実行環境の **tutorial_cn** ディレクトリで以下コマンドを実行し、削除が正常に完了したことをメッセージから確認します。

```sh
$ terraform destroy --auto-approve
:
Destroy complete! Resources: 18 destroyed.
$
```

この破棄が完了するまでの所要時間は、計算ノードのノード数が2ノードの場合で3分程度です。

これで、このチュートリアルは終了です。
