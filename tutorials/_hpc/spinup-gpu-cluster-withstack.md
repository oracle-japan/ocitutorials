---
title: "GPUクラスタを構築する(スタティッククラスタ自動構築編)"
excerpt:  "GPUクラスタを構築してみましょう。このチュートリアルは、GPUクラスタのノード間接続に最適な高帯域・低遅延RDMA対応RoCE v2採用のクラスタ・ネットワークでベアメタルGPUインスタンスをノード間接続するGPUクラスタを、リソース・マネージャから1クリックで自動構築することが出来るようになります。"
order: "1250"
layout: single
header:
  teaser: "/hpc/spinup-gpu-cluster-withstack/architecture_diagram.png"
  overlay_image: "/hpc/spinup-gpu-cluster-withstack/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

本チュートリアルは、 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から無償で利用可能な **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を利用し、以下構成のGPUクラスタを構築、複数ノードに跨るGPU間の通信性能を **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** の通信性能計測プログラム **[NCCL Tests](https://github.com/nvidia/nccl-tests)** で検証後、分散機械学習のサンプルプログラムを実行します。

[GPUノード]
- シェイプ ： **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)**
- インターコネクト ： **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)**
- OS ： **Oracle Linux** 8.9ベースのGPU **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※1）

[Bastionノード]
- シェイプ ： **[VM.Standard.E4.Flex](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#flexible)**
- OS ： **Oracle Linux** 8.9ベースのGPU **クラスタネットワーキングイメージ** （※1）

[ソフトウェア]
- コンテナランタイム ： **Enroot**
- ジョブスケジューラ ： **Slurm** + **Pyxis**
- コンテナ ： **[TensorFlow NGC Container](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tensorflow)** 24.06-tf2-py3 from **[NGC Catalog](https://catalog.ngc.nvidia.com/)**

[クラスタ管理]
- 共有ストレージ ： **ファイルストレージ** によるGPUクラスタ内ホームディレクトリ共有
- ユーザ管理 ： LDAP

※1） **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.7** です。  

![システム構成図](architecture_diagram.png)

ここで構築するGPUクラスタ上のワークロード実行環境は、機械学習環境のデファクトスタンダードであるDokcerコンテナを利用し、ジョブスケジューラにジョブを投入することで行います。投入されたジョブは、ジョブスケジューラが起動するジョブ指定のコンテナ上で実行され、ジョブ終了後にジョブスケジューラがこのコンテナを終了します。

この実行環境は、コンテナランタイムに **[Enroot](https://github.com/NVIDIA/enroot/)** 、ジョブスケジューラに **[Slurm](https://slurm.schedmd.com/)** を採用し、コンテナの操作（インポート・起動・終了等）をジョブスケジューラからコンテナランタイムに指示することを可能にするため、 **Slurm** のプラグインである **[Pyxis](https://github.com/NVIDIA/pyxis)** を使用します。

またこの実行環境は、コンテナ環境からGPUやNICをRDMAで利用可能とする **NVIDIA Container Toolkit** を含むソフトウェア群もインストールされるため、ノードを跨ぐGPU間通信を高帯域・低遅延にコンテナ上から実行することが可能です。  
この通信性能詳細は、 **[4-0. 概要](#4-0-概要)** を参照ください。

![ソフトウェアスタック](software_stack.png)

また、本チュートリアルで使用する **HPCクラスタスタック** は、通常であれば数日かかるようなGPUクラスタ構築作業を、OCIコンソールのGUIから10項目程度のメニューを選択した後、1クリックで自動的に行います。

このチュートリアルで作成する環境は、前述のとおり **Slurm** と **Enroot** を使用するコンテナ環境ですが、これらの必要なソフトウェア環境は自身で整備するのでそれらを構築する際の基礎インフラストラクチャとなるGPUクラスタを構築する場合は、本チュートリアルの姉妹編である **[GPUクラスタを構築する(基礎インフラ手動構築編)](/ocitutorials/hpc/spinup-gpu-cluster/)** や **[GPUクラスタを構築する（基礎インフラ自動構築編）](/ocitutorials/hpc/spinup-gpu-cluster-withterraform)** を参照ください。

**所要時間 :** 約1時間

**前提条件 :** GPUクラスタを収容する **コンパートメント** ( **ルート・コンパートメント** でもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。

**注意 :** 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。  
また使用する **HPCクラスタスタック** のバージョンが異なる場合も、画面ショットが異なる場合があります。

***
# 1. GPUクラスタ作成

## 1-0. 概要

本章は、 **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を利用し、GPUクラスタを作成します。  
**HPCクラスタスタック** は、 **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** に作成する **[スタック](/ocitutorials/hpc/#5-3-スタック)** からGPUクラスタを作成するため、これを許可する **IAMポリシー** が必要です。  
よって本章では、以下の手順でGPUクラスタを作成します。

- **IAMポリシー** 作成
- **スタック** の作成
- **スタック** の計画
- **スタック** の適用

## 1-1. IAMポリシー作成

本章は、 **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** に作成する **[スタック](/ocitutorials/hpc/#5-3-スタック)** からGPUクラスタを作成するための **IAMポリシー** を作成します。

1. OCIコンソールにログインし、 **アイデンティティとセキュリティ** → **ポリシー** とメニューを辿ります。

2. 表示される以下 **xxxxコンパートメント内のポリシー** 画面で、 **ポリシーの作成** ボタンをクリックします。  
この際、 **コンパートメント** プルダウンメニューがGPUクラスタを作成する **コンパートメント** と異なる場合は、これを修正します。

    ![画面ショット](console_page01.png)

3. 表示される以下 **ポリシーの作成** 画面で、各フィールドに以下の情報を入力し **作成** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。

    - **名前** ： **IAMポリシー** に付与する名前
    - **説明** ： **IAMポリシー** に付与する説明（用途等）
    - **ポリシー・ビルダー** ： 作成する **IAMポリシー** を指定する以下構文  
    （ **手動エディタの表示** ボタンをクリックして表示）（※2）

      ```sh
      allow service compute_management to use tag-namespace in compartment compartment_name
      allow service compute_management to manage compute-management-family in compartment compartment_name
      allow service compute_management to read app-catalog-listing in compartment compartment_name
      allow group group_name to manage all-resources in compartment compartment_name
      ```
      ※2）**コンパートメント** 名と4行目の **グループ** 名は、自身のものに置き換えます。

   ![画面ショット](console_page02.png)

## 1-2. スタックの作成

本章は、 **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を元に、前述のGPUクラスタ環境を構築するための **スタック** を作成します。  
このチュートリアルで使用する **HPCクラスタスタック** は、バージョン **2.10.6** です。

1. 以下 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** の **HPCクラスタスタック** ページにアクセスします。

   [https://cloud.oracle.com/marketplace/application/67628143/](https://cloud.oracle.com/marketplace/application/67628143/)

   OCIコンソールへのログイン画面が表示された場合（まだログインしていない場合）、ログインを完了します。

2. 表示される以下画面で、以下情報の入力と **オラクル社標準の条件および規則を確認した上でこれに同意します。** チェックボックスをチェックし、 **スタックの起動** ボタンをクリックします。
    - **リージョン :** GPUクラスタをデプロイする **リージョン**
    - **バージョン :** v2.10.6
    - **コンパートメント :** **スタック** を作成する **コンパートメント**

   ![画面ショット](market_place.png)

3. 表示される以下 **スタック情報** 画面で、各フィールドに以下の情報を入力し、下部の **次** ボタンをクリックします。
    - **名前 :** スタックに付与する名前（任意）
    - **説明 :** スタックに付与する説明（任意）

   ![画面ショット](stack_page01.png)

4. 表示される **変数の構成** 画面で、各フィールドに以下の情報を入力し、下部の **次** ボタンをクリックします。  
なお、ここに記載のないフィールドは、デフォルトのままとします。

   4.1 **Cluster configuration** フィールド
    - **Public SSH key :** （Bastionにログインする際使用するSSH秘密鍵に対応する公開鍵）
      - 公開鍵ファイルのアップロード（ **SSHキー・ファイルの選択** ）と公開鍵のフィールドへの貼り付け（ **SSHキーの貼付け** ）が選択可能  

   ![画面ショット](stack_page02.png)

   4.2 **Headnode options** フィールド
    - **Availability Domain :** （BastionノードをデプロイするAD）
    - **Enable boot volume backup :** チェックオフ
    - **Create Object Storage PAR :** チェックオフ

   ![画面ショット](stack_page03.png)

   4.3 **Compute node options** フィールド
    - **Availability Domain :** （GPUノードをデプロイする可用性ドメイン）
    - **Shape of the Compute Nodes :** **BM.GPU4.8**
    - **Initial cluster size :** 2（GPUノードのノード数、デフォルトのまま）
    - **Size of the boot volume in GB :** 200（GPUノードのブート・ボリュームサイズ）
    - **Image version :** GPU_OL8_NV550（GPUノードのイメージ）
   
   ![画面ショット](stack_page04.png)

   4.4 **Additional Login Node** フィールド
    - **Login Node :** チェックオフ

   ![画面ショット](stack_page04-2.png)

   4.5 **Additional file system** フィールド
    - **Add another NFS filesystem :** チェック
    - **Create FSS :** チェック
    - **NFS Path :** /mnt/home（※3）
    - **NFS server Path :** /mnt/home（※3）

   ※3：ここで指定するパスは、 **ファイルストレージ** 領域に作成するLDAPユーザのホームディレクトリを格納するディレクトリを指定しています。よって、ユーザ名user1のLDAPユーザのホームディレクトリは、/mnt/home/user1となります。

   ![画面ショット](stack_page04-1.png)

   4.6 **Advanced storage options** フィールド
    - **Show advanced storage options :** チェック
    - **Redundancy :** チェックオフ

   ![画面ショット](stack_page05.png)

   4.7 **Software** フィールド
    - **Create Rack aware topology :** チェックオフ
    - **Install Nvidia Enroot for containerized GPU workloads :** チェック
    - **Install Nvidia Pyxis plugin for Slurm :** チェック

   ![画面ショット](stack_page05-1.png)

5. 表示される **確認** 画面で、これまでの設定項目が意図したものになっているかを確認し、以下 **作成されたスタックで適用を実行しますか。** フィールドの **適用の実行** をチェックオフし、下部の **作成** ボタンをクリックします。

   ![画面ショット](stack_page06.png)

   ここで **適用の実行** をチェックした場合、 **作成** ボタンのクリックと同時に **スタック** の適用が開始され、GPUクラスタのデプロイが始まりますが、このチュートリアルでは **スタック** の計画を実行してから適用を行います。

これで、以下画面のとおりGPUクラスタ構築用の **スタック** が作成されました。

![画面ショット](stack_page07.png)

## 1-3. スタックの計画

本章は、完成した **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** の **[スタック](/ocitutorials/hpc/#5-3-スタック)** を計画し、どのようなリソースがデプロイされるか確認します。

1. 作成した **スタック** の以下 **スタックの詳細** 画面で、 **計画** ボタンをクリックします。

   ![画面ショット](stack_page08.png)

2. 表示される以下 **計画** サイドバーで、 **計画** ボタンをクリックします。

   ![画面ショット](stack_page09.png)

3. 表示される以下 **ジョブの詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** → **成功** と遷移すれば、 **スタック** の計画が終了しています。

   ![画面ショット](stack_page10.png)

   表示される以下 **ログ** フィールドで、適用時にデプロイされるリソースを確認します。

   ![画面ショット](stack_page11.png)

## 1-4. スタックの適用

本章は、計画で作成されるリソースに問題が無いことを確認した **[スタック](/ocitutorials/hpc/#5-3-スタック)** に対し、適用を行いGPUクラスタをデプロイします。

1. 以下 **スタックの詳細** 画面で、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page12.png)

2. 表示される以下 **適用** サイドバーで、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page13.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、 **スタック** の適用が実施されています。

   ![画面ショット](stack_page14.png)

   表示される以下 **ログ** フィールドで、リソースのデプロイ状況を確認します。

   ![画面ショット](stack_page11.png)

   この適用が完了するまでの所要時間は、GPUノードのノード数が2ノードの場合で30分程度です。

   ステータスが **成功** となれば、GPUクラスタのデプロイが完了しています。

***
# 2. GPUクラスタ確認

本章は、デプロイされたGPUクラスタにログインして環境の確認を行うとともに、 **[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html)** をGPUノードにインストールします。

1. Bastionノードログイン

   Bastionノードへのログインは、 **[スタック](/ocitutorials/hpc/#5-3-スタック)** 適用時の以下 **ログ** フィールドの最後に表示されているBastionノードのIPアドレスを使用し、インターネットを介してopcユーザでSSHログインします。

   ![画面ショット](stack_page15.png)

   このSSH接続では、スタックに指定したSSH公開鍵に対応する秘密鍵を使用します。

   ```sh 
   $ ssh -i path_to_ssh_secret_key opc@123.456.789.123
   ```

2. Bastionノードファイルシステム確認

   Bastionノードは、以下のようにファイルストレージの **/mnt/home** がマウントされています。この **/mnt/home** は、GPUクラスタ内で共有するLDAPユーザのホームディレクトリに使用します。

   ```sh
   $ df -h /mnt/home
   Filesystem        Size  Used Avail Use% Mounted on
   FSS_ip:/mnt/home  8.0E     0  8.0E   0% /mnt/home
   $
   ```

3. GPUノードログイン

   GPUノードは、プライベートサブネットに接続されており、インターネット経由ログインすることが出来ないため、Bastionノードを経由してログインします。

   GPUノードのホスト名は、Bastionノードの **/etc/opt/oci-hpc** ディレクトリ以下のファイルに格納されており、 **hostfile.tcp** と **hostfile.rdma** がそれぞれプライベートサブネット接続と **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** サブネット接続に使用するIPアドレスに対応するホスト名です。  
   このため、BastionノードからGPUノードへのログインは、 **hostfile.tcp** ファイルに格納されているホスト名を使用し、opcユーザでSSHログインします。

   ```sh
   $ cat /etc/opt/oci-hpc/hostfile.tcp
   compute-permanent-node-789
   compute-permanent-node-844
   $ ssh compute-permanent-node-844
   Activate the web console with: systemctl enable --now cockpit.socket

   Last login: Wed Jul  3 05:37:00 2024 from 172.16.0.238
   $
   ```

4. GPUノードファイルシステム確認

	GPUノードは、以下のようにNVMe SSDローカルディスクに作成したファイルシステムが **/mnt/localdisk** にマウントされています。

	```sh
	$ df -h /mnt/localdisk
	Filesystem      Size  Used Avail Use% Mounted on
	/dev/nvme0n1p1  6.2T   33M  6.2T   1% /mnt/localdisk
	$
	```

	また、以下のようにBasionノードの **/home** がGPUノードでマウントされています。  
	この領域は、sudoコマンドを利用することで管理者権限を有するopcユーザに対して、ホームディレクトリをGPUクラスタ内で共有するために使用します。

	```sh
	$ df -h /home
	Filesystem          Size  Used Avail Use% Mounted on
	Bastion_ip:/home   89G   21G   69G  23% /home
	$
	```

	また、以下のようにファイル・ストレージの **/mnt/home** がマウントされています。  
	この領域は、LDAPに作成する一般ユーザに対して、ホームディレクトリをGPUクラスタ内で共有するために使用します。

	```sh
	$ df -h /mnt/home
	Filesystem        Size  Used Avail Use% Mounted on
	FSS_ip:/mnt/home  8.0E     0  8.0E   0% /mnt/home
	$
	```

5. **NVIDIA Container Toolkit** インストール

	以下コマンドを全てのGPUノードのopcユーザで実行し、 **NVIDIA Container Toolkit** をインストールします。

	```sh
	$ sudo dnf install -y nvidia-container-toolkit
	```

***
# 3. LDAPユーザ作成

本章は、 **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** が作成したGPUクラスタ内のLDAP統合ユーザ管理環境にLDAPユーザを作成し、このユーザでGPUクラスタにログイン後、 **Slurm** から起動するコンテナ上で簡単なコマンドが実行出来ることを確認します。

このLDAP統合ユーザ管理環境は、BastionノードがLDAPサーバ兼クライアントでGPUノードがLDAPクライアントです。

1. LDAPユーザ作成

	LDAPサーバであるBastionノードは、ユーザ管理のためのclusterコマンドが用意されています。

	このコマンドは、作成するユーザのホームディレクトリを **/home** 以下に作成するため、本環境のLDAPユーザ用ホームディレクトリであるファイルストレージの **/mnt/home** 以下に作成するよう修正する必要があります。このため、以下コマンドをBastionのopcユーザで実行します。

	```sh
	$ sudo sed -i 's/\/home\//\/mnt\/home\//g' /usr/bin/cluster
	```

	次に、以下コマンドをBastionノードのopcユーザで実行し、イニシャルグループが **privilege** （グループIDが9876で、そのメンバーにコンテナ実行権限が付与される。）のLDAPユーザを作成します。

	```sh
	$ cluster user add user_name --gid 9876
	Password:  <- Password for user_name
	Repeat for confirmation: <- Password for user_name
	Full Name: full_name <- Full name for user_name
	$ id user_name
	uid=10001(user_name) gid=9876(privilege) groups=9876(privilege)
	$
	```

	ここで指定するパスワードは、GPUクラスタ内の認証にパスワード認証を使用しないため、任意のパスワードで構いません。

	次に、このユーザがインターネットからBastionノードにSSHログインする際に使用するSSH秘密鍵に対応する公開鍵を登録するため、以下コマンドをBastionノードのopcユーザで実行します。

	```sh
	$ echo 'public_key_for_user_name' | sudo tee -a ~user_name/.ssh/authorized_keys
	public_key_for_user_name
	```

2. LDAPユーザログイン

	先に作成したLDAPユーザを使用したインターネットを介したBastionノードへのログインは、以下コマンドでSSHログインします。

	このSSH接続では、先のLDAPユーザ作成で指定したSSH公開鍵に対応する秘密鍵を使用します。

	```sh 
	$ ssh -i path_to_ssh_secret_key_for_user_name user_name@123.456.789.123
	```

	またこのユーザは、以下のようにGPUクラスタ内の全てのGPUノードにパスフレーズ無し鍵認証によるSSHログインが可能になっています。

	```sh
	$ cat /etc/opt/oci-hpc/hostfile.tcp 
	compute-permanent-node-789
	compute-permanent-node-844
	$ ssh compute-permanent-node-789
	Activate the web console with: systemctl enable --now cockpit.socket

	$
	```

3. コンテナ起動確認

	BastionノードのLDAPユーザで以下コマンドを実行し、 **Slurm** から **Enroot** 上にコンテナを起動できることを確認します。

	```sh 
	$ srun -N 2 --ntasks-per-node 1 --container-image=nvcr.io#nvidia/tensorflow:24.06-tf2-py3 --container-name=tensorflow bash -c "hostname; grep PRETTY /etc/os-release"
	pyxis: imported docker image: nvcr.io#nvidia/tensorflow:22.11-tf2-py3
	pyxis: imported docker image: nvcr.io#nvidia/tensorflow:22.11-tf2-py3
	compute-permanent-node-789
	PRETTY_NAME="Ubuntu 22.04.4 LTS"
	compute-permanent-node-844
	PRETTY_NAME="Ubuntu 22.04.4 LTS"
	```

	ここで起動しているコンテナは、**NGC Catalog**から **TensorFlow** のコンテナをインポート・起動し、その後起動したコンテナ内でhostname等のコマンドを実行していますが、このコンテナサイズが大きいため、コマンドの完了まで20分程度を要します。

	但し、一度インポートが完了すると、次回以降はダウンロードしたコンテナイメージを再利用するため、同じコンテナを2回目以降起動する際は、短時間で完了します。

***
# 4. NCCL通信性能検証

## 4-0. 概要

本章は、 **NCCL Tests** を使用し、GPUクラスタ内の **NCCL** によるGPU間通信性能を確認します。

ここで使用する **NCCL** は、先の稼働確認で使用した **TensorFlow** のコンテナに予め含まれるものを使用し、 **NCCL Tests** はコンテナ内でソースコードからビルドします。

以上より、本章で実施する **NCCL** 通信性能検証は、以下の手順を経て行います。

- **NCCL Tests** ビルド
- **NCCL Tests** 実行

本チュートリアルは、2ノードに跨る全16枚の **NVIDIA A100 GPU** を使用した **NCCL** の **All-Reduce** 通信性能をコンテナ環境から計測し、以下性能が出ています。

- 帯域（busbw）：約 165 GB/s（メッセージサイズ10 GiB）

## 4-1. NCCL Testsビルド

本章は、コンテナ上で **NCCL Tests** プログラムをビルドします。

BastionノードのLDAPユーザで以下コマンドを実行し、 **NCCL Tests** のソースコードをダウンロードしてコンテナ上でビルドするために必要な修正を適用します。

```sh
$ cd ~ && git clone https://github.com/NVIDIA/nccl-tests.git
$ sed -i 's/which/type/g' nccl-tests/src/Makefile
```

次に、BastionノードのLDAPユーザで以下コマンドを実行し、 **TensorFlow** のコンテナ上で **NCCL Tests** をビルドします。  
ここで、ユーザのホームディレクトリに含まれるuser_nameは、自身の環境に合わせて修正します。

```sh
$ srun --container-name=tensorflow --container-mounts "/mnt/home/user_name:/mnt/home/user_name" bash -c "cd /mnt/home/user_name/nccl-tests && make MPI=1 MPI_HOME=/usr/local/mpi CUDA_HOME=/usr/local/cuda NCCL_HOME=/usr/lib/x86_64-linux-gnu"
```
ここでは、先のコンテナ稼働確認で使用した **TensorFlow** のコンテナを起動する際、GPUノードのLDAPユーザuser_nameのホームディレクトリをコンテナにマウントし、その直下で **NCCL Tests** のソースツリーをビルドします。  
これにより、ビルドした **NCCL Tests** のバイナリがGPUノードのファイルシステムに保存され、以降のコンテナ起動時にも永続的にアクセスできるようになります。

## 4-2. NCCL Tests実行

本章は、 **NCCL Tests** を実行します。

BastionノードのLDAPユーザで以下コマンドを実行し、ジョブスケジューラが割当てた1ノードのGPUノード上で **TensorFlow** のコンテナを起動し、このコンテナ上で8枚のGPUを使用した **NCCL** の **All-Reduce** 通信性能を計測します。  
ここで、ユーザのホームディレクトリに含まれるuser_nameは、自身の環境に合わせて修正します。

```sh
$ srun --container-name=tensorflow --container-mounts "/mnt/home/user_name:/mnt/home/user_name" --mpi pmi2 --gpus-per-node=8 bash -c "cd /mnt/home/user_name/nccl-tests && ./build/all_reduce_perf -b 10G -e 10G -t 1 -g 8"
# nThread 1 nGpus 8 minBytes 10737418240 maxBytes 10737418240 step: 1048576(bytes) warmup iters: 5 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid 258189 on compute-permanent-node-454 device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid 258189 on compute-permanent-node-454 device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid 258189 on compute-permanent-node-454 device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid 258189 on compute-permanent-node-454 device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid 258189 on compute-permanent-node-454 device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid 258189 on compute-permanent-node-454 device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid 258189 on compute-permanent-node-454 device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid 258189 on compute-permanent-node-454 device  7 [0xda] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
 10737418240    2684354560     float     sum      -1    80706  133.04  232.83      0    80644  133.15  233.00      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 232.915 
#

$
```

次に、BastionノードのLDAPユーザで以下コマンドを実行し、2ノードのGPUノード上で1個づつ **TensorFlow** のコンテナを起動し、このコンテナ上で2ノード全16枚のGPUを使用した **NCCL** の **All-Reduce** 通信性能を計測します。  
ここで、ユーザのホームディレクトリに含まれるuser_nameは、自身の環境に合わせて修正します。

```sh
$ srun -N 2 --ntasks-per-node 1 --container-name=tensorflow --container-mounts "/mnt/home/user_name:/mnt/home/user_name" --mpi pmi2 --gpus-per-node=8 bash -c 'cd /mnt/home/user_name/nccl-tests; export NCCL_IB_QPS_PER_CONNECTION=4; export NCCL_IB_GID_INDEX=3; export NCCL_IB_HCA="=mlx5_0,mlx5_1,mlx5_2,mlx5_3,mlx5_6,mlx5_7,mlx5_8,mlx5_9,mlx5_10,mlx5_11,mlx5_12,mlx5_13,mlx5_14,mlx5_15,mlx5_16,mlx5_17"; ./build/all_reduce_perf -b 10G -e 10G -t 1 -g 8'
# nThread 1 nGpus 8 minBytes 10737418240 maxBytes 10737418240 step: 2(factor) warmup iters: 5 iters: 20 agg iters: 1 validation: 1 graph: 0
#
# Using devices
#  Rank  0 Group  0 Pid   9110 on compute-permanent-node-789 device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  1 Group  0 Pid   9110 on compute-permanent-node-789 device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank  2 Group  0 Pid   9110 on compute-permanent-node-789 device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank  3 Group  0 Pid   9110 on compute-permanent-node-789 device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank  4 Group  0 Pid   9110 on compute-permanent-node-789 device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank  5 Group  0 Pid   9110 on compute-permanent-node-789 device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank  6 Group  0 Pid   9110 on compute-permanent-node-789 device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank  7 Group  0 Pid   9110 on compute-permanent-node-789 device  7 [0xda] NVIDIA A100-SXM4-40GB
#  Rank  8 Group  0 Pid   5107 on compute-permanent-node-844 device  0 [0x0f] NVIDIA A100-SXM4-40GB
#  Rank  9 Group  0 Pid   5107 on compute-permanent-node-844 device  1 [0x15] NVIDIA A100-SXM4-40GB
#  Rank 10 Group  0 Pid   5107 on compute-permanent-node-844 device  2 [0x51] NVIDIA A100-SXM4-40GB
#  Rank 11 Group  0 Pid   5107 on compute-permanent-node-844 device  3 [0x54] NVIDIA A100-SXM4-40GB
#  Rank 12 Group  0 Pid   5107 on compute-permanent-node-844 device  4 [0x8d] NVIDIA A100-SXM4-40GB
#  Rank 13 Group  0 Pid   5107 on compute-permanent-node-844 device  5 [0x92] NVIDIA A100-SXM4-40GB
#  Rank 14 Group  0 Pid   5107 on compute-permanent-node-844 device  6 [0xd6] NVIDIA A100-SXM4-40GB
#  Rank 15 Group  0 Pid   5107 on compute-permanent-node-844 device  7 [0xda] NVIDIA A100-SXM4-40GB
#
#                                                              out-of-place                       in-place          
#       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
#        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
 10737418240    2684354560     float     sum      -1   122711   87.50  164.07      0   121865   88.11  165.21      0
# Out of bounds values : 0 OK
# Avg bus bandwidth    : 164.643 
#
```

srunコマンド内で指定している **NCCL_IB_** で始まる環境変数は、 **NCCL Tests** の **All-Reduce** 通信性能向上を目的として指定しています。

***
# 5. MultiWorkerMirroredStrategyサンプルプログラム実行

## 5-0. MultiWorkerMirroredStrategyサンプルプログラム実行概要

本章は、MultiWorkerMirroredStrategyサンプルプログラムを使用し、構築したGPUクラスタで分散機械学習プログラムを実行します。

ここで使用するMultiWorkerMirroredStrategyサンプルプログラムは、以下 **TensorFlow** 公式ドキュメントページのチュートリアルで使用されている、MNISTデータセットを使用した訓練を行うプログラムです。

[https://www.tensorflow.org/tutorials/distribute/multi_worker_with_keras](https://www.tensorflow.org/tutorials/distribute/multi_worker_with_keras)

## 5-1. MultiWorkerMirroredStrategyサンプルプログラム作成

本章は、MultiWorkerMirroredStrategyサンプルプログラムを作成します。

BastionノードのLDAPユーザで、以下3個のプログラムを作成します。ここで、ユーザのホームディレクトリに含まれるuser_nameは、自身の環境に合わせて修正します。

```sh
$ pwd
/mnt/home/user_name/tensorflow
$ ls -l
total 24
-rw-r--r-- 1 user_name privilege 1385 Jan 26 09:29 mnist.py
-rwxr-xr-x 1 user_name privilege 1158 Jan 26 09:29 start_mnist.sh
-rw-r--r-- 1 user_name privilege  791 Jan 26 09:28 submit.sh
```

[submit.sh]
```sh
#!/bin/bash
#SBATCH -p compute
#SBATCH -N 2
#SBATCH --ntasks-per-node 1
#SBATCH -J mnist
#SBATCH --gpus-per-node=8

# Set working directory which contains all programs to train MNIST datasets
workdir="/mnt/home/user_name/tensorflow"
# Set node list file which contains GPU node names assigned to this job one at a line
hfname="slurm_nodelist.txt"

cd $workdir
rm -f $hfname

# For loop to generate node list file from environment variable SLURM_JOB_NODELIST Slurm dinamically sets
for hname in `scontrol show hostnames ${SLURM_JOB_NODELIST}`
do
  echo $hname >> $hfname
done

# Start TensorFlow containers on all GPU nodes one at a node and run start_mnist.sh on all the containers
srun --container-name=tensorflow --container-mounts "/mnt/home/user_name:/mnt/home/user_name" $workdir/start_mnist.sh $hfname $workdir
```

[start_mnist.sh]
```sh
#!/bin/bash

# Get node list file from first argument
hfname=$1
# Get working directory from second argument
workdir=$2

# Declare array accomodating all worker host names and set own hostnmae
declare -a ar_worker=()
myhname=`hostname`

# Set output file names for standard out/error
std_out=$myhname".out"
std_err=$myhname".err"

cd $workdir
rm -f $std_out
rm -f $std_err

# Set worker host names in ar_worker each at an element and rank number in desccending order of node list file
count=0
while read hname
do
  ar_worker[$count]=$hname
  if [ $myhname == $hname ]
  then
    myrank=$count
  fi
  count=$(expr $count + 1)
done < $hfname

# Set TF_CONFIG environment variable for each worker
# Example
#  > printenv TF_CONFIG
#  {"cluster": {"worker": ["node_a:12345", "node_b:23456"]}, "task": {"type": "worker", "index": 0}}
export TF_CONFIG="{\"cluster\": {\"worker\": [\"${ar_worker[0]}:12345\", \"${ar_worker[1]}:23456\"]}, \"task\": {\"type\": \"worker\", \"index\": $myrank}}"

# Print my rank to standard error file
echo "My rank = "$myrank > ./$std_err
echo >> ./$std_err

# Run MNIST training script
python ./mnist.py > ./$std_out 2>> ./$std_err
```

[mnist.py]
```python
import os
import json
import tensorflow as tf
import numpy as np

def mnist_dataset(batch_size):
  (x_train, y_train), _ = tf.keras.datasets.mnist.load_data()
  x_train = x_train / np.float32(255)
  y_train = y_train.astype(np.int64)
  train_dataset = tf.data.Dataset.from_tensor_slices(
      (x_train, y_train)).shuffle(60000).repeat().batch(batch_size)
  return train_dataset

def build_and_compile_cnn_model():
  model = tf.keras.Sequential([
      tf.keras.layers.InputLayer(input_shape=(28, 28)),
      tf.keras.layers.Reshape(target_shape=(28, 28, 1)),
      tf.keras.layers.Conv2D(32, 3, activation='relu'),
      tf.keras.layers.Flatten(),
      tf.keras.layers.Dense(128, activation='relu'),
      tf.keras.layers.Dense(10)
  ])
  model.compile(
      loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
      optimizer=tf.keras.optimizers.SGD(learning_rate=0.001),
      metrics=['accuracy'])
  return model

per_worker_batch_size = 64
tf_config = json.loads(os.environ['TF_CONFIG'])
num_workers = len(tf_config['cluster']['worker'])

strategy = tf.distribute.MultiWorkerMirroredStrategy()

global_batch_size = per_worker_batch_size * num_workers
multi_worker_dataset = mnist_dataset(global_batch_size)

with strategy.scope():
  multi_worker_model = build_and_compile_cnn_model()

multi_worker_model.fit(multi_worker_dataset, epochs=3, steps_per_epoch=70)
```

## 5-2. MultiWorkerMirroredStrategyサンプルプログラム実行

本章は、MultiWorkerMirroredStrategyサンプルプログラムを実行します。

BastionノードのLDAPユーザで以下コマンドを実行し、サンプルプログラムをジョブスケジューラにバッチジョブとして投入します。

```sh
$ sbatch submit.sh 
Submitted batch job 12
$ squeue 
    JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
       12   compute    mnist user_nam  R       0:02      2 compute-permanent-node-[789,844]
```

次に、squeueコマンドの出力が無いことでジョブ終了を確認したら、プログラムの標準出力を確認します。

```sh
$ squeue
    JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
$ cat compute-permanent-node-789.out 
Downloading data from https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz
11490434/11490434 [==============================] - 0s 0us/step
Epoch 1/3
70/70 [==============================] - 10s 64ms/step - loss: 2.2569 - accuracy: 0.1829
Epoch 2/3
70/70 [==============================] - 4s 64ms/step - loss: 2.1678 - accuracy: 0.3291
Epoch 3/3
70/70 [==============================] - 4s 63ms/step - loss: 2.0625 - accuracy: 0.4879
> cat compute-permanent-node-844.out 
Downloading data from https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz
11490434/11490434 [==============================] - 0s 0us/step
Epoch 1/3
70/70 [==============================] - 10s 64ms/step - loss: 2.2569 - accuracy: 0.1829
Epoch 2/3
70/70 [==============================] - 4s 64ms/step - loss: 2.1678 - accuracy: 0.3291
Epoch 3/3
70/70 [==============================] - 4s 63ms/step - loss: 2.0625 - accuracy: 0.4879
```

***
# 6. GPUクラスタ削除

本章は、 **[スタック](/ocitutorials/hpc/#5-3-スタック)** を破棄することで、構築したGPUクラスタを削除します。

以下の手順は、LDAPユーザのホームディレクトリ用途で作成した **ファイルストレージ** を含め、本チュートリアルで作成したOCI上のリソースをすべて削除します。

1. 以下 **スタックの詳細** 画面で、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page16.png)

2. 表示される以下 **破棄** サイドバーで、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page17.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、 **スタック** の破棄が実施されています。

   ![画面ショット](stack_page18.png)

   表示される以下 **ログ** フィールドで、リソースの削除状況を確認します。

   ![画面ショット](stack_page11.png)

   この破棄が完了するまでの所要時間は、GPUノードのノード数が2ノードの場合で5分程度です。

   ステータスが **成功** となれば、GPUクラスタの削除が完了しています。

これで、このチュートリアルは終了です。