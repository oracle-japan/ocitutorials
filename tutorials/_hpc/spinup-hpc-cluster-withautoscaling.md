---
title: "HPCクラスタを構築する(オンデマンドクラスタ自動構築編)"
excerpt:  "HPCクラスタを構築してみましょう。このチュートリアルは、HPCクラスタのノード間接続に最適な高帯域・低遅延RDMA対応RoCE v2採用のクラスタ・ネットワークでベアメタルHPCインスタンスをノード間接続するHPCクラスタをSlurmと連動してデプロイするオンデマンドHPCクラスタを、リソース・マネージャから1クリックで自動構築出来るようになります。"
order: "114"
layout: single
header:
  teaser: "/hpc/spinup-hpc-cluster-withautoscaling/architecture_diagram.png"
  overlay_image: "/hpc/spinup-hpc-cluster-withautoscaling/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

Oracle Cloud Infrastructure（以降OCIと記載）は、仮想化オーバーヘッドの無いHPC用途に特化したベアメタルシェイプとこれらを接続する **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を提供しており、HPCワークロードを実行するHPCクラスタを構築するには最適なクラウドサービスです。

このチュートリアルは、 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から無償で利用可能な **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を利用し、以下構成のオンデマンドHPCクラスタを構築します。

- HPC向けIntel Ice Lakeプロセッサ搭載計算ノード（ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** ）
- インターコネクト: **クラスタ・ネットワーク** （ノード当たり100 Gbps x 1）
- インターネットからSSH接続可能なBastionノード
- OS: **Oracle Linux** 8
- ジョブスケジューラ: **Slurm**
- オンデマンドクラスタ機能： **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)**
- **ファイル・ストレージ** によるHPCクラスタ内ホームディレクトリ共有
- LDAPによるクラスタ内ユーザ統合管理

![システム構成図](architecture_diagram.png)

またこのチュートリアルは、デプロイしたHPCクラスタのインターコネクト性能を **Intel MPI Benchmark** で確認します。

オンデマンドHPCクラスタにおけるワークロード実行は、 **Slurm** にジョブを投入することで行い、 **クラスタオートスケーリング** がジョブ実行に必要な計算ノードを **クラスタ・ネットワーク** と共に動的に起動、構築されたクラスタに **Slurm** がジョブをディスパッチします。  
また **クラスタオートスケーリング** は、ジョブが実行されない状態が一定時間経過すると、自動的にクラスタを削除します。

本チュートリアルで使用する **HPCクラスタスタック** は、通常であれば数日かかるオンデマンドHPCクラスタ構築作業を、OCIコンソールのGUIから10項目程度のメニューを選択した後、1クリックで自動的に実施することを可能とします。

**所要時間 :** 約2時間

**前提条件 :** オンデマンドHPCクラスタを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。具体的には、以下ページの **Policies to deploy the stack:** に記載のポリシーが作成されていること。

[https://cloud.oracle.com/marketplace/application/67628143/usageInformation](https://cloud.oracle.com/marketplace/application/67628143/usageInformation)

**注意 :** チュートリアル内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。また使用する **HPCクラスタスタック** のバージョンが異なる場合も、チュートリアル内の画面ショットが異なる場合があります。

***
# 1. HPCクラスタスタック

## 1-0. 概要

本チュートリアルで使用する **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** は、大きく2つのステップに分けて構築を実施しており、前半は **[Terraform](/ocitutorials/hpc/#5-12-terraform)** によるOCIリソース構築フェーズで、後半は **Terraform** から起動される **Ansible** が行うOSレベルのカスタマイズフェーズです。

具体的には、以下のような処理が行われます。

［ **Terraform** によるOCIリソース構築フェーズ］

- VCNと関連するネットワークリソース構築
- **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と関連リソース構築
- Bastionノードインスタンス構築
- **ファイル・ストレージ** 構築
- **Ansible** 関連ソフトウェアインストール

[ **Ansible** によるOSレベルカスタマイズフェーズ]

- NFSファイル共有環境構築
- LDAPユーザ統合環境構築
- **Slurm** 環境構築
-  **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** ツール群インストール

また **クラスタオートスケーリング** は、Bastionノードから **Terraform** を使用して動的にHPCクラスタを構築するため、OCIの **APIキー** を作成してこれをOCIに登録する必要があります。

以上より本章では、以下の手順でHPCクラスタ構築のための  **[スタック](/ocitutorials/hpc/#5-3-スタック)** を作成します。

- **APIキー** の作成・登録
- スタックの作成
- スタックの計画
- スタックの適用

## 1-1. APIキーの作成・登録

**APIキー** は、OCIコンソールから作成する方法と、OpenSSLのコマンドを使用して作成する方法があります。  
詳細は、 **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/apisigningkey.htm#two)** の手順を参照して下さい。

また作成した **APIキー** は、 **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/apisigningkey.htm#three)** の手順を参照してOCIに登録します。

## 1-2. スタックの作成

本章は、 **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を元に、前述の環境構築のための **[スタック](/ocitutorials/hpc/#5-3-スタック)** を作成します。このチュートリアルで使用する **HPCクラスタスタック** は、バージョン **2.10.2.1** です。

1. 以下 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** の **HPCクラスタスタック** のページにアクセスします。

   [https://cloud.oracle.com/marketplace/application/67628143/](https://cloud.oracle.com/marketplace/application/67628143/)

2. OCIコンソールへのログイン画面が表示された場合（まだログインしていない場合）、ログインを完了します。

3. 表示される以下画面で、以下の情報を入力し、 **スタックの起動** ボタンをクリックします。
    - **リージョン :** オンデマンドHPCクラスタをデプロイするリージョン
    - **バージョン :** v2.10.2.1
    - **コンパートメント :** **スタック** を作成するコンパートメント

   ![画面ショット](market_place.png)

4. 表示される以下 **スタック情報** 画面で、以下の情報を入力し、下部の **次** ボタンをクリックします。
    - **名前 :** スタックに付与する名前（任意）
    - **説明 :** スタックに付与する説明（任意）

   ![画面ショット](stack_page01.png)

5. 表示される **変数の構成** 画面で、各画面フィールドに以下の情報を入力し、下部の **次** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。

   5.1 **Cluster configuration** フィールド
    - **Public SSH key :** （Bastionノードにログインする際使用するSSH秘密鍵に対応する公開鍵）
      - 公開鍵ファイルのアップロード（ **SSHキー・ファイルの選択** ）と公開鍵のフィールドへの貼り付け（ **SSHキーの貼付け** ）が選択可能  

   ![画面ショット](stack_page02.png)

    5.2 **Headnode options** フィールド
    - **Availability Domain :** （Bastionノードをデプロイする可用性ドメイン）

   ![画面ショット](stack_page03.png)

   5.3 **Compute node options** フィールド
    - **Availability Domain :** （計算ノードをデプロイする可用性ドメイン）
    - **Shape of the Compute Nodes :** **BM.Optimized3.36** （計算ノードに使用するシェイプ）
    - **Initial cluster size :** 0 (*1)
    - **Image version :** HPC_OL8（計算ノードのOSイメージ）
   
   *1) このフィールドは、スタティックに常時起動しておく計算ノードのノード数を指定しますが、本チュートリアルはオンデマンドでのみ計算ノードをデプロイするため、このフィールドを **0** とします。

   ![画面ショット](stack_page04.png)

   5.4 **Autoscaling** フィールド
    - **Scheduler based autoscaling :** チェック

   ![画面ショット](stack_page04-0.png)

   5.5 **API authencication, needed for autoscaling** フィールド
    - **Use Instance Princopal instead of configuration file :** チェックオフ
    - **API User OCID :** ユーザOCID（※2）
    - **API fingerprint :** **APIキー** のフィンガープリント（※3）
    - **API private key :** **APIキー** の秘密鍵（ **参照** ボタンをクリックしてアップロード）（※4）

   ※2) ユーザOCIDの確認は、 **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/API/Concepts/apisigningkey.htm#five)** の手順を参照して下さい。     
   ※3) **[APIキーの作成・登録](#1-1-apiキーの作成・登録)** で作成した **APIキー** のフィンガープリント  
   ※4) **[APIキーの作成・登録](#1-1-apiキーの作成・登録)** で作成した **APIキー** の秘密鍵

   ![画面ショット](stack_page04-3.png)

   5.6 **Additional file system** フィールド
    - **Add another NFS filesystem :** チェック
    - **Create FSS :** チェック
    - **NFS Path :** /mnt/home（※5）
    - **NFS server Path :** /mnt/home（※5）

   ※5) ここで指定するパスは、 **ファイル・ストレージ** 領域に作成するLDAPユーザのホームディレクトリを格納するディレクトリを指定しています。よって、ユーザ名user_nameのLDAPユーザのホームディレクトリは、/mnt/home/user_nameとなります。

   ![画面ショット](stack_page04-1.png)

   5.7 **Advanced storage options** フィールド
    - **Show advanced storage options :** チェック
    - **Shared NFS scratch space from NVME or Block volume :** チェックオフ（※6）

   *6) 計算ノードの **NVMe SSD** ローカルディスク領域をNFS共有するかの指定で、本チュートリアルでは共有しません。

   ![画面ショット](stack_page05.png)

6. 表示される **確認** 画面で、これまでの設定項目が意図したものになっているかを確認し、以下 **作成されたスタックで適用を実行しますか。** フィールドの **適用の実行** をチェックオフし、下部の **作成** ボタンをクリックします。

   ![画面ショット](stack_page06.png)

   ここで **適用の実行** をチェックした場合、 **作成** ボタンのクリックと同時にスタックの適用が開始され、オンデマンドHPCクラスタのデプロイが始まりますが、このチュートリアルではスタックの計画を実行してから適用を行います。

これで、以下画面のとおりオンデマンドHPCクラスタを構築する **スタック** が作成されました。

![画面ショット](stack_page07.png)

## 1-3. スタックの計画

本章は、完成した **[スタック](/ocitutorials/hpc/#5-3-スタック)** を計画し、どのようなリソースがデプロイされるか確認します。

1. 作成したスタックの以下 **スタックの詳細** 画面で、 **計画** ボタンをクリックします。

   ![画面ショット](stack_page08.png)

2. 表示される以下 **計画** サイドバーで、 **計画** ボタンをクリックします。

   ![画面ショット](stack_page09.png)

3. 表示される以下 **ジョブの詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** → **成功** と遷移すれば、 **スタック** の計画が終了しています。

   ![画面ショット](stack_page10.png)

   表示される以下 **ログ** フィールドで、適用時にデプロイされるリソースを確認します。

   ![画面ショット](stack_page11.png)

## 1-4. スタックの適用

本章は、計画で作成されるリソースに問題が無いことを確認した **[スタック](/ocitutorials/hpc/#5-3-スタック)** に対し、適用を行いオンデマンドHPCクラスタをデプロイします。

1. 以下 **スタックの詳細** 画面で、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page12.png)

2. 表示される以下 **適用** サイドバーで、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page13.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、 **スタック** の適用が実施されています。

   ![画面ショット](stack_page14.png)

   表示される以下 **ログ** フィールドで、リソースのデプロイ状況を確認します。

   ![画面ショット](stack_page11.png)

   この適用が完了するまでの所要時間は、15分程度です。

   ステータスが **成功** となれば、オンデマンドHPCクラスタのデプロイが完了しています。

***
# 2. Bastionノード確認

本章は、デプロイされたBastionノードにログインし、環境の確認を行います。

1. Bastionノードログイン

   Bastionノードへのログインは、 **[スタック](/ocitutorials/hpc/#5-3-スタック)** 適用時の以下 **ログ** フィールドの最後に表示されているBastionノードのIPアドレスを使用し、インターネットを介してopcユーザでSSHログインします。

   ![画面ショット](stack_page15.png)

   このSSH接続では、スタックに指定したSSH公開鍵に対応する秘密鍵を使用します。

   ```sh 
   $ ssh -i path_to_ssh_secret_key opc@123.456.789.123
   ```

2. Bastionノードファイルシステム確認

   Bastionノードは、以下のように **ファイル・ストレージ** の/mnt/homeがマウントされています。この/mnt/homeは、オンデマンドHPCクラスタ内で共有するLDAPユーザのホームディレクトリに使用します。

   ```sh
   $ df -h /mnt/home
   Filesystem        Size  Used Avail Use% Mounted on
   FSS_ip:/mnt/home  8.0E     0  8.0E   0% /mnt/home
   ```

***
# 3. LDAPユーザ作成・確認

本章は、 **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** が作成したLDAP統合ユーザ管理環境にLDAPユーザを作成し、このユーザでインターネットからBastionノードにSSHログイン出来ることを確認します。

このLDAP統合ユーザ管理環境は、BastionノードがLDAPサーバ兼クライアントで計算ノードがLDAPクライアントです。

1. LDAPユーザ作成

   LDAPサーバであるBastionノードは、LDAPユーザ管理のためのclusterコマンドが用意されています。
   
   このコマンドは、作成するユーザのホームディレクトリを/home以下とするため、本環境のLDAPユーザ用ホームディレクトリである **ファイル・ストレージ** の/mnt/home以下に作成するよう修正する必要があります。このため、以下コマンドをBastionノードのopcユーザで実行します。

   ```sh
   $ sudo sed -i 's/\/home\//\/mnt\/home\//g' /usr/bin/cluster
   ```

   次に、以下コマンドをBastionノードのopcユーザで実行し、LDAPユーザを作成します。  
   なおこのユーザは、この後の稼働確認に使用します。

   ```sh
   $ cluster user add user_name
   Password:  <- Password for user_name
   Repeat for confirmation: <- Password for user_name
   Full Name: full_name <- Full name for user_name
   Creating group
   $ id user_name
   uid=10001(user_name) gid=10006(user_name) groups=10006(user_name)
   ```

   ここで指定するパスワードは、オンデマンドHPCクラスタ内の認証にパスワード認証を使用しないため、任意のパスワードで構いません。

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

***
# 34 オンデマンドHPCクラスタ稼働確認（Intel MPI Benchmark性能検証）

## 4-0. 概要

本章は、 **Intel MPI Benchmark** 性能検証用のジョブを使用し、オンデマンドHPCクラスタがジョブの投入・終了に伴い自動的にHPCクラスタを作成・削除することを確認し、その後HPCクラスタのインターコネクト性能を検証します。

## 4-1. ジョブスクリプト作成

BastionノードのLDAPユーザで、以下のジョブスクリプトをファイル名 **pingpong.sh** で作成します。

```sh
#!/bin/bash
#SBATCH -p compute
#SBATCH -n 2
#SBATCH -N 2
#SBATCH -J ping_pong
#SBATCH -o stdout.%J
#SBATCH -e stderr.%J

# Only for BM.Optimized3.36
export UCX_NET_DEVICES=mlx5_2:1

source /usr/mpi/gcc/openmpi-4.1.2a1/bin/mpivars.sh

mpirun /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -msglog 3:28 PingPong
```

## 4-2. ジョブ投入

BastionノードのLDAPユーザで以下コマンドを実行し、作成したジョブスクリプトを **Slurm** に投入、ジョブステータスを確認します。

```sh
$ sbatch pingpong.sh 
Submitted batch job 1
$ squeue 
   JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
       1   compute ping_pon user_nam PD       0:00      2 (Nodes required for job are DOWN, DRAINED or reserved for jobs in higher priority partitions)

```

この時点では、ジョブを実行するための計算ノードが存在しないため、ジョブのステータスがPDの状態です。

## 4-3. HPCクラスタデプロイ状況確認

**[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** は、Bastionノードのopcユーザのcrontabから以下のように毎分起動される **autoscale_slurm.sh** というPyrhonスクリプトにより、 **Slurm** のジョブ投入状況に応じてオンデマンドに必要な数の計算ノードを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と共にデプロイします。

```sh
$ crontab -l | grep autoscale_slurm
* * * * * /opt/oci-hpc/autoscaling/crontab/autoscale_slurm.sh >> /opt/oci-hpc/logs/crontab_slurm_`date '+\%Y\%m\%d'`.log 2>&1
```

このため、先の手順のジョブ投入から最大で1分以上経過すると、自動的に2ノードの計算ノードとこれらを接続する **クラスタ・ネットワーク** のデプロイを開始します。  
そこで、OCIコンソールでオンデマンドHPCクラスタをデプロイしたリージョンを選択後、 **コンピュート** → **インスタンス** とメニューを辿り、以下のインスタンス一覧から2ノードの計算ノードが **プロビジョニング中** となっていることを確認します。

![画面ショット](console_page01.png)

このジョブは、 **[Terraform](/ocitutorials/hpc/#5-12-terraform)** による計算ノードのデプロイが完了すると前述のインスタンスの **状態** が **実行中** となりますが、ここから **Ansible** によるOSのカスタマイズが始まり、これが完了して初めて **Slurm** 上のジョブ状態がR（実行中）になるため、ジョブ投入からジョブ実行開始までおよそ10分を要します。

## 4-4. ジョブ結果確認

BastionノードのLDAPユーザで以下コマンドを実行し、ジョブ完了を確認した後、その出力結果を確認します。

```sh
$ squeue
          JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
$ cat stdout.1 
#------------------------------------------------------------
#    Intel (R) MPI Benchmarks 2018, MPI-1 part    
#------------------------------------------------------------
# Date                  : Tue May 16 06:38:34 2023
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
            0         1000         1.67         0.00
            8         1000         1.66         4.81
           16         1000         1.66         9.62
           32         1000         1.73        18.54
           64         1000         1.83        34.92
          128         1000         1.88        68.05
          256         1000         2.14       119.35
          512         1000         2.20       232.63
         1024         1000         2.33       439.71
         2048         1000         3.05       672.50
         4096         1000         3.76      1088.19
         8192         1000         4.87      1682.36
        16384         1000         6.73      2433.40
        32768         1000         9.27      3536.08
        65536          640        10.87      6027.71
       131072          320        16.32      8032.19
       262144          160        28.67      9142.25
       524288           80        50.10     10465.36
      1048576           40        92.88     11289.03
      2097152           20       178.64     11739.66
      4194304           10       349.87     11988.22
      8388608            5       692.62     12111.44
     16777216            2      1378.23     12173.04
     33554432            1      2750.67     12198.62
     67108864            1      5491.25     12221.06
    134217728            1     10974.52     12229.94
    268435456            1     21942.87     12233.38


# All processes entering MPI_Finalize
```

## 4-5. HPCクラスタ削除確認

**[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** は、計算ノードで実行されるジョブが無い状態が10分間継続すると、以降crontabから最初に起動される **autoscale_slurm.sh** がこの計算ノードを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と共に削除します。  
OCIコンソールで、想定通りHPCクラスタが削除されていることを確認します。 

***
# 5. スタックの破棄

本章は、 **[スタック](/ocitutorials/hpc/#5-3-スタック)** を破棄することで、オンデマンドHPCクラスタを削除します。

以降の手順は、本チュートリアルで作成したOCI上のリソースをすべて削除するため、 **LDAPユーザのホームディレクトリ用途で作成したファイル・ストレージに格納されているデータが全て消失** します。

なお、 **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** がオンデマンドでデプロイした計算ノードと **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** は、この **スタック** の破棄で削除されません。  
そのため、 **クラスタオートスケーリング** がこれらのリソースを削除したことを確認し、その後 **スタック** の破棄を実施します。

1. 以下 **スタックの詳細** 画面で、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page16.png)

2. 表示される以下 **破棄** サイドバーで、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page17.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、 **スタック** の破棄が実施されています。

   ![画面ショット](stack_page18.png)

   表示される以下 **ログ** フィールドで、リソースの削除状況を確認します。

   ![画面ショット](stack_page11.png)

   この破棄が完了するまでの所要時間は、2分程度です。

   ステータスが **成功** となれば、オンデマンドHPCクラスタの削除が完了しています。

これで、このチュートリアルは終了です。
