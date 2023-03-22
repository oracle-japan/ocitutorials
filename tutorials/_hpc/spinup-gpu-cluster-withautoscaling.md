---
title: "GPUクラスタを構築する(オンデマンドクラスタ自動構築編)"
excerpt:  "GPUクラスタを構築してみましょう。このチュートリアルを終了すると、高速・低レイテンシなRDMA対応RoCEv2インターコネクトのクラスタ・ネットワークにベアメタルGPUインスタンスを接続するワークロード実行環境をジョブスケジューラSlurmと連動してオンデマンドにデプロイするオンデマンドGPUクラスタを、リソース・マネージャから1クリックで自動構築出来るようになります。"
order: "100"
layout: single
header:
  teaser: "/intermediates/spinup-gpu-cluster-withautoscaling/architecture_diagram.png"
  overlay_image: "/intermediates/spinup-gpu-cluster-withautoscaling/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

Oracle Cloud Infrastructure（以降OCIと記載）は、8枚のNVIDIA A100 40/80 GBと総帯域幅1.6 Tbps（100 Gbps x 16）のRDMA対応ネットワークインタフェースを搭載するベアメタルGPUシェイプ **[BM.GPU4.8/BM.GPU.GM4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** とこれらを接続する **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を提供しており、1ノードには搭載しきれない多数のGPUを必要とする大規模なAIや機械学習のワークロードを実行するGPUクラスタを構築するには最適なクラウドサービスです。

このチュートリアルは、 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から無償で利用可能な **[スタック](/ocitutorials/hpc/#5-3-スタック)** を利用し、以下構成のオンデマンドGPUクラスタを構築します。

- NVIDIA A100 40 GBを8枚搭載するGPUノード（ **[BM.GPU4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** ）
- 100 Gbps x 16 RoCEv2 RDMAインターコネクト (クラスタ・ネットワーク)
- インターネットからSSH接続可能なBastionノード
- OS: Oracle Linux 7.9
- コンテナランタイム: Enroot
- ジョブスケジューラ: Slurm + Pyxis
- オンデマンドクラスタ機能： クラスタオートスケーリング
- OCIファイル・ストレージサービスによるGPUクラスタ内ホームディレクトリ共有
- LDAPによるクラスタ内ユーザ統合管理

![システム構成図](architecture_diagram.png)

またこのチュートリアルは、デプロイしたGPUクラスタで複数ノードに跨るGPU間の通信性能を **[NCCL（NVIDIA Collective Communication Library）](https://developer.nvidia.com/nccl)** の通信性能計測プログラム（ **[NCCL Tests](https://github.com/nvidia/nccl-tests)** ）で検証後、分散機械学習のサンプルプログラムを実行します。

GPUクラスタのワークロード実行環境は、機械学習環境のデファクトスタンダードであるDokcerコンテナを利用し、コンテナランタイムに **[Enroot](https://github.com/NVIDIA/enroot/)** 、ジョブスケジューラに **[Slurm](https://slurm.schedmd.com/)** を採用し、コンテナの操作（インポート・起動・終了等）をジョブスケジューラからコンテナランタイムに指示するSlurmのプラグイン **[Pyxis](https://github.com/NVIDIA/pyxis)** を使用します。

また、コンテナ環境からGPUやNICをRDMAで利用可能とする **[NVIDIA Container Toolkit](https://github.com/NVIDIA/nvidia-container-toolkit)** を含むソフトウェア群もインストールされ、ノードを跨ぐGPU間通信を高速・低レイテンシにコンテナ上から実行することが可能です。この通信性能詳細は、 **[3-0. 概要](#3-0-概要)** を参照ください。

GPUクラスタにおけるワークロード実行は、Slurmにジョブを投入することで行い、 **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** がジョブ実行に必要なGPUノードを動的に起動、SlurmがPyxisを介してこれらGPUノード上に指定のコンテナを起動、ジョブ終了後にコンテナを終了します。  
またクラスタオートスケーリングは、ジョブが実行されない状態が一定時間経過すると、自動的にGPUノードを削除します。

![ソフトウェアスタック](software_stack.png)

本チュートリアルで使用するオンデマンドGPUクラスタ構築スタックは、通常であれば数日かかる構築作業を、OCIコンソールのGUIから10項目程度のメニューを選択した後、1クリックで自動的に実施することを可能とします。

**所要時間 :** 約3時間

**前提条件 :** オンデマンドGPUクラスタを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。具体的には、以下ページの **Policies to deploy the stack:** に記載のポリシーと **Policies for autoscaling or resizing** に記載のダイナミック・グループとポリシーが作成されていること。

[https://cloud.oracle.com/marketplace/application/67628143/usageInformation](https://cloud.oracle.com/marketplace/application/67628143/usageInformation)

**注意 :** チュートリアル内の画面ショットについては、OCIの現在のコンソール画面と異なっている場合があります。また使用するオンデマンドGPUクラスタ構築スタックのバージョンが異なる場合も、チュートリアル内の画面ショットが異なる場合があります。

***
# 1. オンデマンドGPUクラスタ構築スタック

## 1-0. 概要

本チュートリアルで使用するオンデマンドGPUクラスタ構築 **[スタック](/ocitutorials/hpc/#5-3-スタック)** は、大きく2つのステップに分けて構築を実施しており、前半は TerraformによるOCIリソース構築フェーズで、後半はTerraformから起動されるAnsibleが行うOSレベルのカスタマイズフェーズです。

具体的には、以下のような処理が行われます。

［TerraformによるOCIリソース構築フェーズ］

- VCNと関連するネットワークリソース構築
-  **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と関連リソース構築
- Bastionノードインスタンス構築
- ファイル・ストレージ構築
- Ansible関連ソフトウェアインストール

[AnsibleによるOSレベルカスタマイズフェーズ]

- NFSファイル共有環境構築
- LDAPユーザ統合環境構築
- Slurm環境構築
-  **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** ツール群インストール

## 1-1. スタックの作成

 **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** でリソースをデプロイする場合、まずそのための **[スタック](/ocitutorials/hpc/#5-3-スタック)** を作成する必要があります。

本章は、 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** が提供するオンデマンドGPUクラスタ構築スタックを元に、前述の環境構築のためのスタックを作成します。このチュートリアルで使用するオンデマンドGPUクラスタ構築スタックは、バージョン2.10.0です。

1. 以下マーケット・プレースのオンデマンドGPUクラスタ構築スタックのページにアクセスします。

   [https://cloud.oracle.com/marketplace/application/67628143/](https://cloud.oracle.com/marketplace/application/67628143/)

2. OCIコンソールへのログイン画面が表示された場合（まだログインしていない場合）、ログインを完了します。

3. 表示される以下画面の右上で、スタックをデプロイするリージョンを選択し、**使用許諾** チェックボックスをチェックし、 **スタックの起動** ボタンをクリックします。

   ![画面ショット](market_place.png)

4. 表示される以下 **スタック情報** 画面で、以下の情報を入力し、下部の **次** ボタンをクリックします。
    - **名前 :** スタックに付与する名前（任意）
    - **説明 :** スタックに付与する説明（任意）
    - **コンパートメントに作成 :** スタックを作成するコンパートメント(*1)

   *1) OCIコンソールで最後に使用していたコンパートメントが引き継がれるため、意図したコンパートメントでない場合は、オンデマンドGPUクラスタ構築スタックページにアクセスする前に、予め所望のコンパートメントを選択しておきます。

   ![画面ショット](stack_page01.png)

5. 表示される **変数の構成** 画面で、各画面フィールドに以下の情報を入力し、下部の **次** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。

   5.1 **Cluster configuration** フィールド
    - **Public SSH key :** （Bastionノードにログインする際使用するSSH秘密鍵に対応する公開鍵）
      - 公開鍵ファイルのアップロード（ **SSHキー・ファイルの選択** ）と公開鍵のフィールドへの貼り付け（ **SSHキーの貼付け** ）が選択可能  

   ![画面ショット](stack_page02.png)

    5.2 **Headnode options** フィールド
    - **Availability Domain :** （BastionノードをデプロイするAD）

   ![画面ショット](stack_page03.png)

   5.3 **Compute node options** フィールド
    - **Availability Domain :** （GPUノードをデプロイするAD）
    - **Shape of the Compute Nodes :** BM.GPU4.8（GPUノードに使用するシェイプ）
    - **Initial cluster size :** 0 (*2)
    - **Size of the boot volume in GB :** 100（GPUノードのブート・ボリュームサイズ）
    - **Image version :** GPU（GPUノードのイメージ）
   
   *2) このフィールドは、スタティックに常時起動しておくGPUノードのノード数を指定しますが、本チュートリアルはオンデマンドでのみGPUノードをデプロイするため、このフィールドを0とします。

   ![画面ショット](stack_page04.png)

   5.4 **Autoscaling** フィールド
    - **Scheduler based autoscaling :** チェック

   ![画面ショット](stack_page04-0.png)

   5.5 **Additional file system** フィールド
    - **Add another NFS filesystem :** チェック
    - **Create FSS :** チェック
    - **NFS Path :** /mnt/home（※3）
    - **NFS server Path :** /mnt/home（※3）

   ※3) ここで指定するパスは、ファイルス・トレージ領域に作成するLDAPユーザのホームディレクトリを格納するディレクトリを指定しています。よって、ユーザ名user_nameのLDAPユーザのホームディレクトリは、/mnt/home/user_nameとなります。

   ![画面ショット](stack_page04-1.png)

   5.6 **Advanced storage options** フィールド
    - **Show advanced storage options :** チェック
    - **Shared NFS scratch space from NVME or Block volume :** チェックオフ（※4）

   *4) GPUノードのNVMeディスク領域をNFS共有するかの指定で、本チュートリアルでは共有しません。

   ![画面ショット](stack_page05.png)

   5.7 **Software** フィールド
    - **Install Nvidia Pyxis plugin for Slurm :** チェック
    - **Install Nvidia Enroot for containerized GPU workloads :** チェック

   ![画面ショット](stack_page05-1.png)

6. 表示される **確認** 画面で、これまでの設定項目が意図したものになっているかを確認し、以下 **作成されたスタックで適用を実行しますか。** フィールドの **適用の実行** をチェックオフし、下部の **作成** ボタンをクリックします。

   ![画面ショット](stack_page06.png)

   ここで **適用の実行** をチェックした場合、 **作成** ボタンのクリックと同時にスタックの適用が開始され、オンデマンドGPUクラスタのデプロイが始まりますが、このチュートリアルではスタックの計画を実行してから適用を行います。

これで、以下画面のとおりオンデマンドGPUクラスタを構築するスタックが作成されました。

![画面ショット](stack_page07.png)

## 1-2. スタックの計画

本章は、完成した **[スタック](/ocitutorials/hpc/#5-3-スタック)** を計画し、どのようなリソースがデプロイされるか確認します。

1. 作成したスタックの以下 **スタックの詳細** 画面で、 **計画** ボタンをクリックします。

   ![画面ショット](stack_page08.png)

2. 表示される以下 **計画** サイドバーで、 **計画** ボタンをクリックします。

   ![画面ショット](stack_page09.png)

3. 表示される以下 **ジョブの詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** → **成功** と遷移すれば、スタックの計画が終了しています。

   ![画面ショット](stack_page10.png)

   表示される以下 **ログ** フィールドで、適用時にデプロイされるリソースを確認します。

   ![画面ショット](stack_page11.png)

## 1-3. スタックの適用

本章は、計画で作成されるリソースに問題が無いことを確認した **[スタック](/ocitutorials/hpc/#5-3-スタック)** に対し、適用を行いGPUクラスタをデプロイします。

1. 以下 **スタックの詳細** 画面で、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page12.png)

2. 表示される以下 **適用** サイドバーで、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page13.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、スタックの適用が実施されています。

   ![画面ショット](stack_page14.png)

   表示される以下 **ログ** フィールドで、リソースのデプロイ状況を確認します。

   ![画面ショット](stack_page11.png)

   この適用が完了するまでの所要時間は、15分程度です。

   ステータスが **成功** となれば、オンデマンドGPUクラスタのデプロイが完了しています。

***
# 2. 事前準備

## 2-1. Bastionノード確認

本章は、デプロイされたBastionノードにログインし、環境の確認を行います。

1. Bastionノードログイン

   Bastionノードへのログインは、スタック適用時の以下 **ログ** フィールドの最後に表示されているBastionノードのIPアドレスを使用し、インターネットを介してopcユーザでSSHログインします。

   ![画面ショット](stack_page15.png)

   このSSH接続では、スタックに指定したSSH公開鍵に対応する秘密鍵を使用します。

   ```sh 
   > ssh -i path_to_ssh_secret_key opc@123.456.789.123
   ```

2. Bastionノードファイルシステム確認

   Bastionノードは、以下のようにファイル・ストレージの/mnt/homeがマウントされています。この/mnt/homeは、オンデマンドGPUクラスタ内で共有するLDAPユーザのホームディレクトリに使用します。

   ```sh
   > df -h /mnt/home
   Filesystem        Size  Used Avail Use% Mounted on
   FSS_ip:/mnt/home  8.0E     0  8.0E   0% /mnt/home
   ```

## 2-2. LDAPユーザ作成・確認

本章は、オンデマンドGPUクラスタ構築スタックが作成したLDAP統合ユーザ管理環境にLDAPユーザを作成し、このユーザでインターネットからBastionノードにSSHログイン出来ることを確認します。

このLDAP統合ユーザ管理環境は、BastionノードがLDAPサーバ兼クライアントでGPUノードがLDAPクライアントです。

1. LDAPユーザ作成

   LDAPサーバであるBastionノードは、LDAPユーザの管理のためのclusterコマンドが用意されています。
   
   このコマンドは、作成するユーザのホームディレクトリを/home以下とするため、本環境のLDAPユーザ用ホームディレクトリであるファイル・ストレージの/mnt/home以下に作成するよう修正する必要があります。このため、以下コマンドをBastionノードのopcユーザで実行します。

   ```sh
   > sudo sed -i 's/\/home\//\/mnt\/home\//g' /usr/bin/cluster
   ```

   次に、以下コマンドをBastionノードのopcユーザで実行し、イニシャルグループが'privilege'（グループIDが9876で、そのメンバーにコンテナ実行権限が付与される。）のLDAPユーザを作成します。  
   なおこのユーザは、この後の稼働確認に使用します。

   ```sh
   > cluster user add user_name --gid 9876
   Password:  <- Password for user_name
   Repeat for confirmation: <- Password for user_name
   Full Name: full_name <- Full name for user_name
   > id user_name
   uid=10001(user_name) gid=9876(privilege) groups=9876(privilege)
   ```

   ここで指定するパスワードは、オンデマンドGPUクラスタ内の認証にパスワード認証を使用しないため、任意のパスワードで構いません。

   次に、このユーザがインターネットからBastionノードにSSHログインする際に使用するSSH秘密鍵に対応する公開鍵を登録するため、以下コマンドをBastionノードのopcユーザで実行します。

   ```sh
   > echo 'public_key_for_user_name' | sudo tee -a ~user_name/.ssh/authorized_keys
   public_key_for_user_name
   ```

2. LDAPユーザログイン

   先に作成したLDAPユーザを使用したインターネットを介したBastionノードへのログインは、以下コマンドでSSHログインします。

   このSSH接続では、先のLDAPユーザ作成で指定したSSH公開鍵に対応する秘密鍵を使用します。

   ```sh 
   > ssh -i path_to_ssh_secret_key_for_user_name user_name@123.456.789.123
   ```

***
# 3. オンデマンドGPUクラスタ稼働確認（NCCL通信性能検証）

## 3-0. 概要

本章は、NCCL通信性能検証用のジョブを使用し、オンデマンドGPUクラスタがジョブの投入・終了とともに自動的にGPUクラスタを作成・削除することを確認するとともに、GPUクラスタ内のNCCL通信性能を検証します。

ここで使用するNCCLは、ジョブがNGCからインポートするTensorFlowのコンテナに予め含まれるものを使用し、NCCL Testsはコンテナ内でソースコードからビルドします。

本チュートリアルは、2ノードに跨る全16枚のGPUを使用したNCCLのAll Reduce通信性能をコンテナ環境から計測し、以下性能が出ています。

- 帯域（busbw）：約 225 GB/s

## 3-1. ジョブスクリプト作成

BastionノードのLDAPユーザで、以下のジョブスクリプトをファイル名nccl_test.shで作成します。

   ```sh
   #!/bin/bash
   #SBATCH -p compute
   #SBATCH -N 2
   #SBATCH --ntasks-per-node 1
   #SBATCH -J nccl_test
   export NCCL_IB_QPS_PER_CONNECTION=4
   export NCCL_IB_GID_INDEX=3
   export ENROOT_SQUASH_OPTIONS="-b 262144"
   srun --container-image=nvcr.io#nvidia/tensorflow:22.11-tf2-py3 --mpi pmi2 bash -c "hostname; cd /tmp; git clone https://github.com/NVIDIA/nccl-tests.git; cd ./nccl-tests; make MPI=1 MPI_HOME=/usr/local/mpi CUDA_HOME=/usr/local/cuda NCCL_HOME=/usr/lib/x86_64-linux-gnu; sleep 60; ./build/all_reduce_perf -b 10G -e 10G -f 2 -t 1 -g 8"
   ```

このジョブスクリプトは、2ノードのGPUノード上にNGCからダウンロードしたTensorFlowのコンテナを1台づつ起動し、このコンテナ上でNCCL Testsのソースツリーをクローンしてビルド、その後2ノード全16枚のGPUを使用したNCCLのAll Reduce通信性能を10 GBのメッセージサイズで計測します。  
   ジョブスクリプト内で設定している環境変数は、以下の用途で使用しています。

- ENROOT_SQUASH_OPTIONS：TensorFlowのようなサイズの大きなコンテナのインポートに必要
- NCCL_IB_*：NCCL TestsのAll Reduce通信性能向上

## 3-2. ジョブ投入

BastionノードのLDAPユーザで以下コマンドを実行し、作成したジョブスクリプトをSlurmに投入、ジョブステータスを確認します。

   ```sh
   > sbatch nccl_test.sh 
   Submitted batch job 1
   > squeue 
      JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
          1   compute nccl_tes user_nam PD       0:00      2 (Nodes required for job are DOWN, DRAINED or reserved for jobs in higher priority partitions)

   ```

この時点では、ジョブを実行するためのGPUノードが存在しないため、ジョブのステータスがPDの状態です。

## 3-3. GPUクラスタデプロイ状況確認

 **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** は、Bastionノードのopcユーザのcrontabから以下のように毎分起動されるautoscale_slurm.shというPyrhonスクリプトにより、Slurmのジョブ投入状況に応じてオンデマンドに必要な数のGPUノードを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と共にデプロイします。

   ```sh
   > crontab -l | grep autoscale_slurm
   * * * * * /opt/oci-hpc/autoscaling/crontab/autoscale_slurm.sh >> /opt/oci-hpc/logs/crontab_slurm_`date '+\%Y\%m\%d'`.log 2>&1
   ```
このため、先の手順のジョブ投入から最大で1分以上経過すると、自動的に2ノードのGPUノードとこれらを接続するクラスタ・ネットワークのデプロイを開始します。  
   そこで、OCIコンソールでオンデマンドGPUクラスタをデプロイしたリージョンを選択後、 **コンピュート** → **インスタンス** とメニューを辿り、以下のインスタンス一覧から2ノードのGPUノードが **プロビジョニング中** となっていることを確認します。

![画面ショット](console_page01.png)

このジョブは、TerraformによるGPUノードのデプロイが完了すると前述のインスタンスの **状態** が **実行中** となりますが、ここからAnsibleによるOSのカスタマイズが始まり、これが完了して初めてSlurm上のジョブ状態がR（実行中）になり、ここまでにおよそ20分を要します。  
またジョブの実行が開始されると、コンテナのインポート・起動におよそ15分を要し、ここから実質的なジョブの実行が始まります。  
   以上より、ジョブ投入からジョブ完了までの所要時間は、40分程度です。

## 3-4. ジョブ結果確認

BastionノードのLDAPユーザで以下コマンドを実行し、ジョブ完了を確認した後、その出力結果を確認します。

   ```sh
   > squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
   > grep -A2 busbw slurm-1.out
   #       size         count      type   redop    root     time   algbw   busbw #wrong     time   algbw   busbw #wrong
   #        (B)    (elements)                               (us)  (GB/s)  (GB/s)            (us)  (GB/s)  (GB/s)       
   10737418240    2684354560     float     sum      -1    89649  119.77  224.57      0    89528  119.93  224.87      0
   ```

この出力結果から、busbwが **224.87 GB/s** となっていることがわかります。

## 3-5. GPUクラスタ削除確認

 **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** は、GPUノードで実行されるジョブが無い状態が10分間継続すると、以降crontabから最初に起動されるautoscale_slurm.shがこのGPUノードをクラスタ・ネットワークと共に削除します。  
OCIコンソールで、想定通りGPUクラスタが削除されていることを確認します。 

***
# 4. MultiWorkerMirroredStrategyサンプルプログラム実行

## 4-0. 概要

本章は、MultiWorkerMirroredStrategyサンプルプログラムを使用し、構築したGPUクラスタで分散機械学習プログラムを実行します。

ここで使用するMultiWorkerMirroredStrategyサンプルプログラムは、以下TensorFlow公式ドキュメントページのチュートリアルで使用されている、MNISTデータセットを使用した訓練を行うプログラムです。

[https://www.tensorflow.org/tutorials/distribute/multi_worker_with_keras](https://www.tensorflow.org/tutorials/distribute/multi_worker_with_keras)

## 4-1. プログラム作成

本章は、MultiWorkerMirroredStrategyサンプルプログラムを作成します。

BastionノードのLDAPユーザで、以下3個のプログラムを作成し、パーミッションを適切に設定します。これらのプログラム中で、LDAPユーザ名として使用されているuser_nameは、自身で作成したユーザ名に修正します。

```sh
> pwd
/mnt/home/user_name/tensorflow
> ls -l
total 24
-rw-r--r-- 1 user_name privilege 1385 Jan 26 09:29 mnist.py
-rwxr-xr-x 1 user_name privilege 1158 Jan 26 09:29 start_mnist.sh
-rw-r--r-- 1 user_name privilege  791 Jan 26 09:28 submit.sh
```

- submit.sh

```sh
#!/bin/bash
#SBATCH -p compute
#SBATCH -N 2
#SBATCH --ntasks-per-node 1
#SBATCH -J mnist

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
export ENROOT_SQUASH_OPTIONS="-b 262144"
srun --container-image=nvcr.io#nvidia/tensorflow:22.11-tf2-py3 --container-mounts "/mnt/home/user_name:/mnt/home/user_name" $workdir/start_mnist.sh $hfname $workdir
```

- start_mnist.sh

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

- mnist.py 

```sh
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

## 4-2. ジョブ投入・結果確認

BastionノードのLDAPユーザで以下コマンドを実行し、ジョブスクリプトをSlurmに投入します。

```sh
> sbatch submit.sh 
Submitted batch job 2
```

次に、OCIコンソールでGPUノードが2ノードデプロイされたことを確認し、以下コマンドで実行中のジョブが無いことによるジョブ終了とジョブ標準出力の表示によるジョブ正常終了を確認します。

```sh
> squeue
    JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
> cat compute-hpc-node-*.out 
Downloading data from https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz
11490434/11490434 [==============================] - 0s 0us/step
Epoch 1/3
70/70 [==============================] - 10s 67ms/step - loss: 2.2653 - accuracy: 0.1280
Epoch 2/3
70/70 [==============================] - 4s 64ms/step - loss: 2.1829 - accuracy: 0.2941
Epoch 3/3
70/70 [==============================] - 5s 65ms/step - loss: 2.0823 - accuracy: 0.4592
Downloading data from https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz
11490434/11490434 [==============================] - 0s 0us/step
Epoch 1/3
70/70 [==============================] - 10s 67ms/step - loss: 2.2653 - accuracy: 0.1280
Epoch 2/3
70/70 [==============================] - 4s 64ms/step - loss: 2.1829 - accuracy: 0.2941
Epoch 3/3
70/70 [==============================] - 5s 65ms/step - loss: 2.0823 - accuracy: 0.4592
```

***
# 5. スタックの破棄

本章は、スタックを破棄することで、構築したオンデマンドGPUクラスタを削除します。

以下の手順は、本チュートリアルで作成したOCI上のリソースをすべて削除するため、 **LDAPユーザのホームディレクトリ用途で作成したファイル・ストレージに格納されているデータが全て消失** します。
  
なお、 **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** がオンデマンドでデプロイしたGPUノードは、このスタック破棄で削除されません。  
そのため、クラスタオートスケーリングがGPUノードを削除したことを確認し、その後スタックの破棄を実施します。

1. 以下 **スタックの詳細** 画面で、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page16.png)

2. 表示される以下 **破棄** サイドバーで、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page17.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、スタックの破棄が実施されています。

   ![画面ショット](stack_page18.png)

   表示される以下 **ログ** フィールドで、リソースの削除状況を確認します。

   ![画面ショット](stack_page11.png)

   この破棄が完了するまでの所要時間は、2分程度です。

   ステータスが **成功** となれば、オンデマンドGPUクラスタの削除が完了しています。

これで、このチュートリアルは終了です。
