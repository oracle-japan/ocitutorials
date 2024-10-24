---
title: "HPCクラスタを構築する(オンデマンドクラスタ自動構築編)"
excerpt:  "HPCクラスタを構築してみましょう。このチュートリアルは、HPCクラスタのノード間接続に最適な高帯域・低遅延RDMA対応RoCE v2採用のクラスタ・ネットワークでベアメタルHPCインスタンスをノード間接続するHPCクラスタをSlurmと連動してデプロイするオンデマンドHPCクラスタを、リソース・マネージャから自動構築出来るようになります。"
order: "1140"
layout: single
header:
  teaser: "/hpc/spinup-hpc-cluster-withautoscaling/architecture_diagram.png"
  overlay_image: "/hpc/spinup-hpc-cluster-withautoscaling/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

Oracle Cloud Infrastructure（以降OCIと記載）は、仮想化オーバーヘッドの無いHPC用途に特化したベアメタルシェイプと、これらを高帯域・低遅延で接続するインターコネクトネットワークサービスの **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を提供しており、HPCワークロードを実行するHPCクラスタを構築するには最適なクラウドサービスです。

このチュートリアルは、 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から無償で利用可能な **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を利用し、以下構成のオンデマンドHPCクラスタを構築します。

- 計算ノード： **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** （Intel Ice Lakeプロセッサ搭載ベアメタルシェイプ）
- インターコネクトネットワーク: **クラスタ・ネットワーク** （ノード当たり100 Gbps x 1）
- インターネットからSSH接続可能なBastionノード
- OS: **Oracle Linux** 8.8
- ジョブスケジューラ: **[Slurm](https://slurm.schedmd.com/)**
- オンデマンドクラスタ機能： **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)**
- クラスタ内ホームディレクトリ共有： **ファイル・ストレージ**
- クラスタ内ユーザ統合管理： LDAP

![システム構成図](architecture_diagram.png)

またこのチュートリアルは、デプロイしたHPCクラスタのインターコネクト性能を **[Intel MPI Benchmark](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** で確認します。

オンデマンドHPCクラスタにおけるワークロード実行は、 **Slurm** にジョブを投入することで行い、 **クラスタオートスケーリング** がジョブ実行に必要な計算ノードを **クラスタ・ネットワーク** と共に動的にデプロイし、構築されたクラスタに **Slurm** がジョブをディスパッチします。  
また **クラスタオートスケーリング** は、ジョブが実行されない状態が一定時間経過すると、自動的に計算ノードを **クラスタ・ネットワーク** と共に削除します。

本チュートリアルで使用する **HPCクラスタスタック** は、通常であれば数日かかるオンデマンドHPCクラスタ構築作業を、OCIコンソールのGUIから10項目程度のメニューを選択するだけで実施することを可能にします。

**所要時間 :** 約2時間

**前提条件 :** オンデマンドHPCクラスタを収容する **コンパートメント** ( **ルート・コンパートメント** でもOKです)が作成されていること。

**注意 :** 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。  
また使用する **HPCクラスタスタック** のバージョンが異なる場合も、画面ショットが異なる場合があります。

***
# 1. オンデマンドクラスタ作成

## 1-0. 概要

本章は、 **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を利用し、オンデマンドクラスタ環境を作成します。  
**HPCクラスタスタック** は、オンデマンドクラスタ機能を **[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** で実現しており、 Bastionノードから **[Terraform](/ocitutorials/hpc/#5-12-terraform)** CLIを使用して動的にHPCクラスタを構築するため、 **[インスタンス・プリンシパル](/ocitutorials/hpc/#5-15-インスタンスプリンシパル)** 認証を予め設定します。  
よって本章では、以下の手順でオンデマンドクラスタ環境を作成します。

- **インスタンス・プリンシパル** 認証関連設定
- **スタック** の作成
- **スタック** の計画
- **スタック** の適用

## 1-1. インスタンス・プリンシパル認証関連設定

本章は、Bastionノードから **[Terraform](/ocitutorials/hpc/#5-12-terraform)** CLIを使用して動的にHPCクラスタを構築出来るようにするための **[インスタンス・プリンシパル](/ocitutorials/hpc/#5-15-インスタンスプリンシパル)** 認証関連設定を行います。

**インスタンス・プリンシパル** 認証の設定は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[オンデマンドクラスタ実現のためのインスタンス・プリンシパル認証設定方法](/ocitutorials/hpc/tech-knowhow/instance-principal-auth/)** の **[1. インスタンス・プリンシパル認証設定](/ocitutorials/hpc/tech-knowhow/instance-principal-auth/#1-インスタンスプリンシパル認証設定)** の手順に従います。  
この際、このテクニカルTips中でクラスタ管理ノードと呼称している箇所は、Bastionノードと読みかえて下さい。

## 1-2. スタックの作成

本章は、 **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を基に、前述の環境構築のための **[スタック](/ocitutorials/hpc/#5-3-スタック)** を作成します。  
このチュートリアルで使用する **HPCクラスタスタック** は、バージョン **2.10.4.1** です。

1. **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** の以下 **HPCクラスタスタック** のページにアクセスします。

   [https://cloud.oracle.com/marketplace/application/67628143/](https://cloud.oracle.com/marketplace/application/67628143/)

   OCIコンソールへのログイン画面が表示された場合（まだログインしていない場合）、ログインを完了します。

2. 表示される以下画面で、以下情報の入力と **オラクル社標準の条件および規則を確認した上でこれに同意します。** チェックボックスのチェックを行い、 **スタックの起動** ボタンをクリックします。
    - **リージョン :** オンデマンドHPCクラスタをデプロイする **リージョン**
    - **バージョン :** v2.10.4.1
    - **コンパートメント :** **スタック** を作成する **コンパートメント**

   ![画面ショット](market_place.png)

3. 表示される以下 **スタック情報** 画面で、各フィールドに以下の情報を入力し、下部の **次** ボタンをクリックします。
    - **名前 :** スタックに付与する名前（任意）
    - **説明 :** スタックに付与する説明（任意）

   ![画面ショット](stack_page01.png)

4. 表示される **変数の構成** 画面で、各フィールドに以下の情報を入力し、下部の **次** ボタンをクリックします。  
なお、ここに記載のないフィールドは、デフォルトのままとします。

   4.1 **Cluster configuration**
    - **Public SSH key :** Bastionノードにログインする際使用するSSH秘密鍵に対応する公開鍵  
   （公開鍵ファイルのアップロード（ **SSHキー・ファイルの選択** ）と公開鍵のフィールドへの貼り付け（ **SSHキーの貼付け** ）が選択可能）

   ![画面ショット](stack_page02.png)

   4.2 **Headnode options**
    - **Availability Domain :** （Bastionノードをデプロイする **可用性ドメイン** ）
    - **Enable boot volume backup :** チェックオフ
    - **Create Object Storage PAR :** チェックオフ

   ![画面ショット](stack_page03.png)

   4.3 **Compute node options**
    - **Availability Domain :** 計算ノードをデプロイする **可用性ドメイン**
    - **Shape of the Compute Nodes :** **BM.Optimized3.36**
    - **Initial cluster size :** 0（※1）
    - **Hyperthreading enabled :** チェックオフ
    - **Image version :** HPC_OL8（※2）
   
   ※1）スタティックに常時起動する計算ノードのノード数を指定しますが、本チュートリアルはオンデマンドでのみ計算ノードをデプロイするため、このフィールドを **0** とします。  
   ※2）**Oracle Linux** 8ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** 

   ![画面ショット](stack_page04.png)

   4.4 **Additional Login Node**
    - **Login Node :** チェックオフ

   ![画面ショット](stack_page04-2.png)

   4.5 **Autoscaling**
    - **Scheduler based autoscaling :** チェック
    - **RDMA Latency check :** チェックオフ

   ![画面ショット](stack_page04-0.png)

   4.6 **Additional file system**
    - **Add another NFS filesystem :** チェック
    - **Create FSS :** チェック
    - **NFS Path :** /mnt/nfs（※3）
    - **NFS server Path :** /mnt/nfs（※3）
    - **FSS Availability Domain :** （ **ファイル・ストレージ** をデプロイする **可用性ドメイン** ）

   ※3）**ファイル・ストレージ** 領域に作成するLDAPユーザのホームディレクトリを格納するディレクトリを指定します。例えばユーザ名 **user_name** のLDAPユーザのホームディレクトリは、 **/mnt/nfs/home/user_name** となります。

   ![画面ショット](stack_page04-1.png)

   4.7 **Advanced bastion options**
    - **Image version :** HPC_OL8

   ![画面ショット](stack_page04-3.png)

   4.8 **Advanced storage options**
    - **Show advanced storage options :** チェック
    - **Shared NFS scratch space from NVME or Block volume :** チェックオフ（※4）
    - **Redundancy :** チェックオフ

   ※4）計算ノードの **NVMe SSD** ローカルディスク領域をNFS共有するかの指定で、本チュートリアルでは共有しません。

   ![画面ショット](stack_page05.png)

   4.9 **Software**
    - **Create Rack aware topology :** チェックオフ

   ![画面ショット](stack_page05-1.png)

5. 表示される **確認** 画面で、これまでの設定項目が意図したものになっているかを確認し、以下 **作成されたスタックで適用を実行しますか。** フィールドの **適用の実行** をチェックオフし、下部の **作成** ボタンをクリックします。

   ![画面ショット](stack_page06.png)

   ここで **適用の実行** をチェックした場合、 **作成** ボタンのクリックと同時に **スタック** の適用が開始され、オンデマンドHPCクラスタのデプロイが始まりますが、このチュートリアルでは **スタック** の計画を実行してから適用を行います。

これで、以下画面のとおりオンデマンドHPCクラスタを作成する **スタック** が作成されました。

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

   Bastionノードは、以下のように **ファイル・ストレージ** の **/mnt/nfs** がマウントされています。  
   この **/mnt/nfs** は、オンデマンドHPCクラスタ内で共有するLDAPユーザのホームディレクトリに使用します。

   ```sh
   $ df -h /mnt/nfs
   Filesystem        Size  Used Avail Use% Mounted on
   FSS_ip:/mnt/nfs  8.0E     0  8.0E   0% /mnt/nfs
   $
   ```

***
# 3. LDAPユーザ作成

本章は、 **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** が作成したLDAP統合ユーザ管理環境にLDAPユーザを作成し、このユーザでインターネットからBastionノードにSSHログイン出来ることを確認します。

このLDAP統合ユーザ管理環境は、BastionノードがLDAPサーバ兼クライアントで計算ノードがLDAPクライアントです。

1. LDAPユーザ作成

   LDAPサーバであるBastionノードは、LDAPユーザ管理のためのclusterコマンドが用意されています。
   
   このコマンドは、作成するユーザのホームディレクトリを **/home** 以下とするため、本環境のLDAPユーザ用ホームディレクトリである **ファイル・ストレージ** の **/mnt/nfs/home** 以下に作成するよう修正する必要があります。このため、以下コマンドをBastionノードのopcユーザで実行します。

   ```sh
   $ sudo sed -i 's/\/home\//\/mnt\/nfs\/home\//g' /usr/bin/cluster
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
   uid=10001(user_name) gid=9876(privilege) groups=9876(privilege)
   $
   ```

   ここで指定するパスワードは、オンデマンドHPCクラスタ内の認証にパスワード認証を使用しないため、任意のパスワードで構いません。

   次に、このユーザがインターネットからBastionノードにSSHログインする際に使用するSSH秘密鍵に対応する公開鍵を登録するため、以下コマンドをBastionノードのopcユーザで実行します。

   ```sh
   $ echo 'public_key_for_user_name' | sudo tee -a ~user_name/.ssh/authorized_keys
   ```

2. LDAPユーザログイン

   先に作成したLDAPユーザを使用したインターネットを介したBastionノードへのログインは、以下コマンドでSSHログインします。

   このSSH接続では、先のLDAPユーザ作成で指定したSSH公開鍵に対応する秘密鍵を使用します。

   ```sh 
   $ ssh -i path_to_ssh_secret_key_for_user_name user_name@123.456.789.123
   ```

***
# 4. オンデマンドクラスタ確認

## 4-0. 概要

本章は、 **Intel MPI Benchmark** 性能検証用のジョブを使用し、オンデマンドHPCクラスタがジョブの投入・終了に伴い自動的にHPCクラスタを作成・削除することを確認し、その後HPCクラスタのインターコネクト性能を検証します。

ここでは、2ノードのPing-Pong性能を計測しており、以下性能が出ています。

- 帯域： 12.2 GB/s（インタフェース物理帯域100 Gbpsに対し97.6 Gbpsを計測）
- レイテンシ： 1.67 μs

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
export UCX_NET_DEVICES=mlx5_2:1
srun --mpi=pmix /usr/mpi/gcc/openmpi-4.1.5a1/tests/imb/IMB-MPI1 -msglog 27:28 pingpong
```

## 4-2. ジョブ投入

BastionノードのLDAPユーザで以下コマンドを実行し、作成したジョブスクリプトを **Slurm** に投入、ジョブステータスを確認します。

```sh
$ sbatch pingpong.sh 
Submitted batch job 1
$ squeue 
   JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
       1   compute ping_pon user_nam PD       0:00      2 (Nodes required for job are DOWN, DRAINED or reserved for jobs in higher priority partitions)
$
```

この時点では、ジョブを実行するための計算ノードが存在しないため、ジョブのステータスが **PD** の状態です。

## 4-3. HPCクラスタデプロイ状況確認

**[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** は、Bastionノードのopcユーザのcrontabから以下のように毎分起動される **autoscale_slurm.sh** というPyrhonスクリプトにより、 **Slurm** のジョブ投入状況に応じてオンデマンドに必要な数の計算ノードを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と共にデプロイします。

```sh
$ crontab -l | grep autoscale_slurm
* * * * * /opt/oci-hpc/autoscaling/crontab/autoscale_slurm.sh >> /opt/oci-hpc/logs/crontab_slurm_`date '+\%Y\%m\%d'`.log 2>&1
$
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
# Date                  : Thu Dec  7 07:11:37 2023
# Machine               : x86_64
# System                : Linux
# Release               : 3.10.0-1160.90.1.0.1.el7.x86_64
# Version               : #1 SMP Tue Apr 25 14:56:13 PDT 2023
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -msglog 27:28 pingpong

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
    134217728            1     10977.34     12226.80
    268435456            1     21940.51     12234.69


# All processes entering MPI_Finalize
$
```

## 4-5. HPCクラスタ削除確認

**[クラスタオートスケーリング](/ocitutorials/hpc/#5-9-クラスタオートスケーリング)** は、計算ノードで実行されるジョブが無い状態が10分間継続すると、以降crontabから最初に起動される **autoscale_slurm.sh** がこの計算ノードを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と共に削除します。

OCIコンソールで、想定通りHPCクラスタが削除されていることを確認します。 

***
# 5. オンデマンドクラスタ削除

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
