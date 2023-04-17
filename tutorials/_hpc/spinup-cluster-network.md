---
title: "HPCクラスタを構築する(基礎インフラ手動構築編)"
excerpt: "HPCクラスタを構築してみましょう。このチュートリアルは、HPCクラスタのノード間接続に最適な高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでベアメタルHPCインスタンスをノード間接続するHPCクラスタを、必要なリソースを順次コンソールから作成しながら構築します。"
order: "111"
layout: single
header:
  teaser: "/hpc/spinup-cluster-network/architecture_diagram.png"
  overlay_image: "/hpc/spinup-cluster-network/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

このチュートリアルは、HPC向けIntel Ice Lakeプロセッサを搭載する **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を使用してノード間接続し、HPCワークロードを実行するためのHPCクラスタを構築する際のベースとなるインフラストラクチャを構築、そのインターコネクト性能を検証します。

このチュートリアルで作成する環境は、ユーザ管理、ホスト名管理、共有ファイルシステム、プログラム開発環境、ジョブスケジューラ等、必要なソフトウェア環境をこの上に整備し、ご自身の要件に沿ったHPCクラスタを構築する際の基礎インフラストラクチャとして利用することが可能です。
なお、これらのクラスタ管理に必要なソフトウェアの導入までを自動化する **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** も利用可能で、詳細は **[HPCクラスタを構築する(スタティッククラスタ自動構築編)](/ocitutorials/hpc/spinup-hpc-cluster)** を参照ください。

![システム構成図](architecture_diagram.png)

またこのチュートリアルは、環境構築後により大規模な計算を実施する必要が生じたり、メンテナンスによりノードを入れ替える必要が生じることを想定し、既存のクラスタ・ネットワークに計算ノードを追加する方法と、特定の計算ノードを入れ替える方法も学習します。

**所要時間 :** 約1時間

**前提条件 :** クラスタ・ネットワークを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。

**注意 :** チュートリアル内の画面ショットについては、OCIの現在のコンソール画面と異なっている場合があります。

***
# 0. HPCクラスタ作成事前作業

## 0-0. 概要

HPCクラスタを構成する **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と計算ノードは、OCIコンソールからクラスタ・ネットワークを作成することで、計算ノードをクラスタ・ネットワークに接続したHPCクラスタとしてデプロイされます。

このため、この計算ノードをTCP接続するVCNと、インターネットから直接アクセス出来ないプライベートサブネットに通常接続される計算ノードにログインする際の踏み台となるBastionノードを、HPCクラスタ作成前に予め用意する必要があります。

本章は、これらHPCクラスタ作成の前提となるリソースを作成します。

## 0-1. VCN作成

本章は、計算ノードをTCP接続するVCNを作成します。  
VCNの作成は、以下チュートリアルページ **クラウドに仮想ネットワーク(VCN)を作る** の手順通りに実行し、

[https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn](https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn)

以下のリソースを作成します。

- VCN（10.0.0.0/16）
- パブリックサブネット（10.0.0.0/24）
- プライベートサブネット（10.0.1.0/24）
- インターネット・ゲートウェイ（パブリックサブネットにアタッチ）
- NATゲートウェイ（プライベートサブネットにアタッチ）
- サービス・ゲートウェイ（プライベートサブネットにアタッチ）
- ルート表 x 2（パブリックサブネットとプライベートサブネットにアタッチ）
- セキュリティリスト x 2（パブリックサブネットとプライベートサブネットにアタッチ）

このVCNは、セキュリティリストで以下のアクセス制限が掛けられています。

- インターネットからのアクセス：パブリックサブネットに接続されるインスタンスの22番ポート（SSH）に限定
- インターネットへのアクセス：インターネット上の任意のIPアドレス・ポートに制限なくアクセス可能

## 0-2. Bastionノード作成

本章は、計算ノードにログインする際の踏み台となるbastinノードを作成します。
Bastionノードの作成は、以下チュートリアルページ **インスタンスを作成する** の手順を参考に、

[https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)

ご自身の要件に沿ったインスタンスを、先の手順でVCNを作成したコンパートメントとパブリックサブネットを指定して作成します。本チュートリアルは、以下属性のインスタンスをBastionノードとして作成します。

- **イメージ　:** Oracle Linux 8
- **シェイプ　:** VM.Optimized3.Flex（1 OCPU）
- **SSHキーの追加　:** Bastionノードへのログインで使用するSSH秘密鍵に対応する公開鍵

次に、このBastionノード上でSSHの鍵ペアを作成します。このSSH鍵は、Bastionノードから計算ノードにログインする際に使用します。
先のチュートリアル **インスタンスを作成する** に記載のインスタンスへの接続方法に従い、BastionノードにopcユーザでSSHログインして以下コマンドでSSH鍵ペアを作成、作成された公開鍵を後のクラスタ・ネットワーク作成手順で指定します。

```sh
> ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/opc/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/opc/.ssh/id_rsa.
Your public key has been saved in /home/opc/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:2EvR7FXtEYAsDknJG1oREie1kv2r1PN3OYrYCP/Xlyg opc@bast
The keys randomart image is:
+---[RSA 2048]----+
|     +=*= . ..oo.|
|      *B.+ o . ..|
|     ooo* + .  ..|
|     ..+.+ .    .|
|      . S..      |
|       ....      |
|       o.+    o o|
|      . + *E.+ *.|
|       . +.=+.o o|
+----[SHA256]-----+
> cat .ssh/id_rsa.pub 
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQD0TDo4QJPbXNRq/c5wrc+rGU/dLZdUziHPIQ7t/Wn+00rztZa/3eujw1DQvMsoUrJ+MHjE89fzZCkBS2t4KucqDfDqcrPuaKF3+LPBkgW0NdvytBcBP2J9zk15/O9tIVvsX8WBi8jgPGxnQMo4mQuwfvMh1zUF5dmvX3gXU3p+lH5akZa8sy/y16lupge7soN01cQLyZfsnH3BA7TKFyHxTe4MOSHnbv0r+6Cvyy7Url0RxCHpQhApA68KBIbfvhRHFg2WNtgggtVGWk+PGmTK7DTtYNaiwSfZkuqFdEQM1T6ofkELDruB5D1HgDi3z+mnWYlHMNHZU5GREH66acGJ opc@bast
```

次に、以降作成する計算ノードの名前解決をインスタンス名で行うため、テクニカルTips **[計算ノードの効果的な名前解決方法](/ocitutorials/hpc/tech-knowhow/compute-name-resolution/)** の手順を実施します。

***
# 1. HPCクラスタ作成

## 1-0. 概要

**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** は、作成時に指定する **[インスタンス構成](/ocitutorials/hpc/#5-7-インスタンス構成)** に基づいて **[インスタンス・プール](/ocitutorials/hpc/#5-8-インスタンスプール)** が作成時に指定するノード数の計算ノードをデプロイし、これをクラスタ・ネットワークに接続します。

クラスタ・ネットワークに接続する計算ノードは、OS起動時点でクラスタ・ネットワークに接続するネットワークインターフェースが作成されていないため、 **[cloud-init](/ocitutorials/hpc/#5-11-cloud-init)** でこの作成を行います。また本チュートリアルでは、計算ノードに使用するBM.Optimized3.36に装備されるNVMeローカルディスクのファイルシステム作成も、cloud-initから行います。

以上より、HPCクラスタの作成は、以下の手順を経て行います。

- cloud-init設定ファイル（cloud-config）作成
- インスタンス構成作成
- クラスタ・ネットワーク作成

## 1-1. cloud-config作成

本章は、 **[cloud-init](/ocitutorials/hpc/#5-11-cloud-init)** 設定ファイル（cloud-config）を作成します。

本チュートリアルは、cloud-initを以下の目的で使用します。

- NVMeローカルディスクファイルシステム作成
- firewalld停止
- **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 接続用ネットワークインターフェース起動

以下は、本チュートリアルで使用するBM.Optimized3.36用のcloud-configで、OCIコンソールを実行している端末上にテキストファイルで保存します。

```sh
#cloud-config
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
  - systemctl stop firewalld
  - systemctl disable firewalld
#
# Set up cluster network interface
  - systemctl start oci-rdma-configure
#
# Start CN authentication renew service for OL8 HPC image to avoid 15min. hiatus of CN connection on deployment
  - systemctl start oci-cn-auth-renew.service
```

このcloud-configで行っているクラスタ・ネットワーク接続用ネットワークインターフェース起動は、クラスタ・ネットワーク対応OSイメージに含まれるsystemdのサービス **oci-rdma-configure** を使用しますが、この詳細はテクニカルTips **[クラスタ・ネットワーク接続用ネットワークインターフェース作成方法](/ocitutorials/hpc/tech-knowhow/rdma-interface-configure/)** を参照ください。

## 1-2. インスタンス構成作成

本章は、 **[インスタンス構成](/ocitutorials/hpc/#5-7-インスタンス構成)** を作成します。

1. OCIコンソールにログインし、HPCクラスタをデプロイするリージョンを選択後、 **コンピュート** → **インスタンス構成** とメニューを辿ります。

2. 表示される以下画面で、**インスタンス構成の作成** ボタンをクリックします。

   ![画面ショット](console_page02.png)

3. 表示される **インスタンス構成の作成** 画面で、以下の情報を入力し **作成** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。

   3.1 **インスタンス構成情報** フィールド

    - **名前** ：インスタンス構成に付与する名前
    - **コンパートメントに作成** ：インスタンス構成を作成するコンパートメント

   ![画面ショット](console_page03.png)

   3.2 **インスタンスの作成先のコンパートメント** フィールド：クラスタ・ネットワークをデプロイするコンパートメント

   ![画面ショット](console_page04.png)

   3.3 **配置** フィールド
    - **可用性ドメイン** ：クラスタ・ネットワークをデプロイする可用性ドメイン

   ![画面ショット](console_page05.png)

   3.4 **イメージとシェイプ** フィールド

   ![画面ショット](console_page06.png)

    - **イメージ** ：Oracle Linux - HPC Cluster Networking Image (**イメージの変更** ボタンをクリックして表示される以下 **イメージの選択** サイドバーで **Marketplace** を選択し検索フィールドに **hpc** と入力して表示される **Oracle Linux - HPC Cluster Networking Image** を選択して表示される **イメージ・ビルド** フィールドで **OracleLinux-8-RHCK-OFED-5.4-3.6.8.1-2023.01.10-0** を選択し **イメージの選択** ボタンをクリック）

   ![画面ショット](console_page08.png)

    - **Shape** ：BM.Optimized3.36 (**Change Shape** ボタンをクリックして表示される以下 **すべてのシェイプの参照** サイドバーで **ベア・メタル・マシン** をクリックして表示される **BM.Optimized3.36** を選択し **シェイプの選択** ボタンをクリック）

   ![画面ショット](console_page07.png)

   3.5 **ネットワーキング** フィールド
    - **プライマリ・ネットワーク** ： 先に作成したVCNを選択
    - **サブネット** ：先に作成したプライベートサブネットを選択

   ![画面ショット](console_page09.png)

   3.6 **SSHキーの追加** フィールド
    - **SSHキー** ：先にBastionノードで作成したSSH鍵の公開鍵（ **公開キーの貼付け** を選択することで入力フィールドを表示）  

   ![画面ショット](console_page10.png)

   3.7 **管理** フィールド（以下 **拡張オプションの表示** ボタンを選択して表示）
   
   ![画面ショット](console_page11.png)

    - **cloud-initスクリプト** ：先に作成したcloud-init設定ファイル（cloud-config）を選択（ **参照** ボタンでファイルを選択）  

   ![画面ショット](console_page12.png)

## 1-3. クラスタ・ネットワーク作成

本章は、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を作成します。

1. OCIコンソールにログインし、HPCクラスタをデプロイするリージョンを選択後、 **コンピュート** → **クラスタ・ネットワーク** とメニューを辿ります。

2. 表示される以下画面で、**クラスタ・ネットワークの作成** ボタンをクリックします。

   ![画面ショット](console_page13.png)

3. 表示される **クラスタ・ネットワークの作成** 画面で、以下の情報を入力し **クラスタ・ネットワークの作成** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。

   3.1 **名前** フィールド：クラスタ・ネットワークに付与する名前

   ![画面ショット](console_page14.png)

   3.2 **コンパートメントに作成** フィールド：クラスタ・ネットワークを作成するコンパートメント

   ![画面ショット](console_page15.png)

   3.2 **可用性ドメイン** フィールド：クラスタ・ネットワークをデプロイする可用性ドメイン

   ![画面ショット](console_page16.png)

   3.3 **ネットワーキングの構成** フィールド

    - **仮想クラウド・ネットワーク** ：先に作成したVCNを選択
    - **サブネット** ：先に作成したプライベートサブネットを選択

   ![画面ショット](console_page17.png)

   3.4 **インスタンス・プールの構成** フィールド

    - **インスタンス・プール名** ：作成されるインスタンス・プールに付与する名前
    - **インスタンス数** ：デプロイする計算ノードのノード数
    - **インスタンス構成** ：先に作成したインスタンス構成

   ![画面ショット](console_page18.png)

4. 表示される以下 **クラスタ・ネットワーク作業リクエスト** 画面で、左上のステータスが **プロビジョニング中** と表示されれば、クラスタ・ネットワークと計算ノードの作成が実施されています。

   ![画面ショット](console_page19.png)

   ステータスが **実行中** となれば、クラスタ・ネットワークと計算ノードの作成が完了しています。

***
# 2. 計算ノード確認

本章は、デプロイされた計算ノードにログインし、環境を確認します。

## 2.1. 計算ノードログイン

計算ノードは、プライベートサブネットに接続されており、インターネットからログインすることが出来ないため、Bastionノードを経由してSSHログインします。Bastionノードから計算ノードへのログインは、計算ノードのインスタンス名を使用します。

計算ノードのインスタンス名は、OCIコンソールで計算ノードをデプロイしたリージョンを選択後、 **コンピュート** → **インスタンス** とメニューを辿り、以下のインスタンス一覧からそのインスタンス名を確認します。

またこの画面は、計算ノードのIPアドレスも表示されており、これを使用してBastionノードからSSHログインすることも可能です。

![画面ショット](console_page20.png)

計算ノードへのログインは、以下のようにBastionノードからopcユーザでSSHログインします。

```sh
> ssh inst-wyr6m-comp
The authenticity of host 'inst-wyr6m-comp (10.0.1.61)' cant be established.
ECDSA key fingerprint is SHA256:z1Hqcm+vNKQLCvqL6t1fqCgqpqo+onshYP7tI1AcwYU.
ECDSA key fingerprint is MD5:0a:86:6f:d3:86:36:d0:7d:74:3e:8c:3f:cd:4c:3a:68.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'inst-wyr6m-comp,10.0.1.61' (ECDSA) to the list of known hosts.
```

## 2.2. cloud-init完了確認

**[cloud-init](/ocitutorials/hpc/#5-11-cloud-init)** は、計算ノードが起動してSSHログインできる状態であっても、その処理が継続している可能性があるため、以下コマンドでそのステータスを表示し、 **done** となっていることでcloud-initの処理完了を確認します。

ステータスが **running** の場合は、cloud-initの処理が継続中のため、処理が完了するまで待ちます。

```sh
> sudo cloud-init status
status: done
```

## 2.3. 計算ノードファイルシステム確認

   計算ノードは、以下のようにNVMe領域が/mnt/localdiskにマウントされています。

```sh
> df -k /mnt/localdisk
Filesystem                  1K-blocks     Used  Available Use% Mounted on
/dev/nvme0n1p1             3748905484    32976 3748872508   1% /mnt/localdisk
```

***
# 3. MPIプログラム実行（2ノード編）

## 3-0. MPIプログラム実行（2ノード編）概要

本章は、計算ノードのHPCイメージに含まれるOpenMPIとIntel MPI Benchmarkを使用し、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** のノード間インターコネクト性能を確認します。

OpenMPIを計算ノード間で実行するためには、mpirunを実行する計算ノード（いわゆるヘッドノード）からOpenMPI実行に参加する他の全ての計算ノードに対して、パスフレーズ無しでSSH接続できる必要があります。

またOpenMPIの実行は、これを実行する計算ノード間で必要なポートにアクセス出来る必要があるため、先に作成したプライベートサブネットのセキュリティリストを修正する必要があります。

以上より、本章で実施するIntel MPI BenchmarkによるMPIプログラム実行は、以下の手順を経て行います。

- 計算ノード間SSH接続環境構築
- プライベートサブネットセキュリティリスト修正
- Intel MPI Benchmark Ping-Pong実行

ここでは、2ノードのPing-Pong性能を計測しており、以下性能が出ています。

- 帯域：約11 GB/s（インタフェース物理帯域100 Gbpsに対し88 Gbpsを計測）
- レイテンシ：約1.7 μs

## 3-1. 計算ノード間SSH接続環境構築

本章は、先にBastionノードで作成したSSH秘密鍵を全ての計算ノードにコピーすることで、全ての計算ノード間でパスフレーズ無しのSSH接続環境を実現します。
   
まず初めに、テクニカルTips **[計算ノードのホスト名リスト作成方法](/ocitutorials/hpc/tech-knowhow/compute-host-list/)** の手順を実施し、以下のように全ての計算ノードのホスト名を含むホスト名リストをBastionノード上にファイル名 **hostlist.txt** で作成します。

```sh
inst-wyr6m-comp
inst-9wead-comp
```

次にこのホスト名リストを使用し、以下コマンドで全計算ノードにBastionノードのSSH秘密鍵をコピーします。この際、計算ノード1ノード毎に接続確認を求められるため、全てに **yes** を入力します。

```sh
> for hname in `cat hostlist.txt`; do echo $hname; scp -p ~/.ssh/id_rsa $hname:~/.ssh/; done
inst-wyr6m-comp
The authenticity of host 'inst-wyr6m-comp (10.0.1.61)' cannot be established.
ECDSA key fingerprint is SHA256:z1Hqcm+vNKQLCvqL6t1fqCgqpqo+onshYP7tI1AcwYU.
ECDSA key fingerprint is MD5:0a:86:6f:d3:86:36:d0:7d:74:3e:8c:3f:cd:4c:3a:68.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'inst-wyr6m-comp,10.0.1.61' (ECDSA) to the list of known hosts.
id_rsa                                                                 100% 1675     1.9MB/s   00:00    
inst-9wead-comp
The authenticity of host 'inst-9wead-comp (10.0.1.62)' cannot be established.
ECDSA key fingerprint is SHA256:alxTYf1T2VGbwLYSuvBs5X29YorXB40rAwWWuVDKxPA.
ECDSA key fingerprint is MD5:14:73:f4:87:3c:43:72:b5:cc:b2:e8:37:15:2f:20:3e.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'inst-9wead-comp,10.0.1.62' (ECDSA) to the list of known hosts.
id_rsa                                                                 100% 1675     1.8MB/s   00:00
```

次に、先のSSH秘密鍵のコピーでBastionノードに作成された全計算ノードのエントリを含むknown_hostsファイルを、以下コマンドで全計算ノードにコピーします。

```sh
> for hname in `cat hostlist.txt`; do echo $hname; scp -p ~/.ssh/known_hosts $hname:~/.ssh/; done
inst-wyr6m-comp
known_hosts                                                            100%  440   631.9KB/s   00:00    
inst-9wead-comp
known_hosts                                                            100%  440   470.6KB/s   00:00
```

次に、後のIntel MPI Benchmark Ping-Ponを実行する際に使用する先に作成したホスト名リストを、以下コマンドで全計算ノードにコピーします。

```sh
> for hname in `cat hostlist.txt`; do echo $hname; scp -p ./hostlist.txt $hname:~/; done
inst-wyr6m-comp
hostlist.txt                                                           100%   32   113.3KB/s   00:00    
inst-9wead-comp
hostlist.txt                                                           100%   32   146.3KB/s   00:00
```

## 3-2. プライベートサブネットセキュリティリスト修正

本章は、プライベートサブネットのセキュリティリストを以下の手順で修正します。

1. OCIコンソールにログインし、計算ノードをデプロイしたリージョンを選択後、 **ネットワーキング** → **仮想クラウド・ネットワーク** とメニューを辿ります。

2. 表示される画面で、先に作成した仮想クラウド・ネットワークをクリックします。

3. 表示される以下 **サブネット** フィールドで、先に作成したプライベートサブネットをクリックします。

   ![画面ショット](console_page20-2.png)

4. 表示される以下 **セキュリティ・リスト** フィールドで、プライベートサブネットに適用されているセキュリティリストをクリックします。

   ![画面ショット](console_page21.png)

5. 表示される以下 **イングレス・ルール** フィールドで、SSHアクセスを許可しているルールの **編集** メニューをクリックします。

   ![画面ショット](console_page22.png)

6. 表示される以下 **イングレス・ルールの編集** サイドバーで、 **IPプロトコル** フィールドを **すべてのプロトコル** に変更し、 **変更の保存** ボタンをクリックします。

   ![画面ショット](console_page23.png)

7. 表示される以下 **イングレス・ルール** フィールドで、変更したルールの **IPプロトコル** が **すべてのプロトコル** に変更されたことを確認します。

   ![画面ショット](console_page24.png)

## 3-3. Intel MPI Benchmark Ping-Pong実行

本章は、Intel MPI Benchmark Ping-Pongを実行します。

計算ノードのうちの1ノードにopcユーザでSSHログインし、以下コマンドを実行します。
   
```sh
> source /usr/mpi/gcc/openmpi-4.1.2a1/bin/mpivars.sh
> mpirun -n 2 -N 1 -hostfile ./hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -msglog 3:28 PingPong
#------------------------------------------------------------
#    Intel (R) MPI Benchmarks 2018, MPI-1 part    
#------------------------------------------------------------
# Date                  : Fri Jan 27 17:14:26 2023
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
            8         1000         1.66         4.81
           16         1000         1.67         9.59
           32         1000         1.70        18.77
           64         1000         1.84        34.86
          128         1000         1.88        68.01
          256         1000         2.14       119.52
          512         1000         2.86       178.76
         1024         1000         2.34       438.04
         2048         1000         2.97       689.33
         4096         1000         3.46      1184.22
         8192         1000         4.47      1831.97
        16384         1000         6.28      2610.75
        32768         1000         8.16      4018.05
        65536          640        10.27      6383.12
       131072          320        15.51      8449.89
       262144          160        29.02      9031.92
       524288           80        51.64     10153.66
      1048576           40        97.01     10808.74
      2097152           20       187.74     11170.72
      4194304           10       369.25     11358.83
      8388608            5       732.18     11457.09
     16777216            2      1461.24     11481.46
     33554432            1      2933.51     11438.32
     67108864            1      5876.47     11419.94
    134217728            1     11797.17     11377.11
    268435456            1     23900.00     11231.61


# All processes entering MPI_Finalize
```

***
# 4. 計算ノード追加

本章は、作成した **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続する計算ノードを2ノード追加して4ノードに拡張します。

1. OCIコンソールメニューから **コンピュート** → **クラスタ・ネットワーク** を選択し、表示される画面で作成したクラスタ・ネットワークをクリックします。

2. 表示される以下画面で、 **編集** ボタンをクリックします。

   ![画面ショット](console_page25.png)

3. 表示される以下 **クラスタ・ネットワークの編集** サイドバーで、 **インスタンス数** フィールドを4に変更し **変更の保存** ボタンをクリックします。

   ![画面ショット](console_page26.png)

4. 表示される以下 **クラスタ・ネットワーク・インスタンス・プール** ウィンドウで、左上のステータスが **スケーリング中** → **完了** と遷移したら、計算ノードの追加が完了しています。

   ![画面ショット](console_page27.png)

5. 同じウィンドウ下方の以下 **インスタンス・プール** フィールドで、 **インスタンス数** が4に増加していることを確認します。

   ![画面ショット](console_page28.png)

***
# 5. MPIプログラム実行（4ノード編）

## 5-0. MPIプログラム実行（4ノード編）概要

本章は、追加した2ノードを含めた計4ノードの計算ノードのインターコネクト性能をIntel MPI Benchmarkで確認します。

ここでは、4ノードのAlltoall性能を計測しています。

## 5-1. 計算ノード間SSH接続環境構築

本章は、追加した2ノードを含めた4ノードの計算ノード間で、パスフレーズ無しのSSH接続ができる環境を構築します。

具体的な手順は、 **[3-1. 計算ノード間SSH接続環境構築](#3-1-計算ノード間ssh接続環境構築)** を参照ください。

## 5-2. Intel MPI Benchmark Alltoall実行

計算ノードのうつの1ノードにopcユーザでSSHログインし、以下コマンドを実行します。
   
```sh
> source /usr/mpi/gcc/openmpi-4.1.2a1/bin/mpivars.sh
> mpirun -n 4 -N 1 -hostfile ./hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -mem 4 Alltoall 
#------------------------------------------------------------
#    Intel (R) MPI Benchmarks 2018, MPI-1 part    
#------------------------------------------------------------
# Date                  : Tue Jan 31 06:22:34 2023
# Machine               : x86_64
# System                : Linux
# Release               : 4.18.0-372.26.1.0.1.el8_6.x86_64
# Version               : #1 SMP Tue Sep 13 21:44:27 PDT 2022
# MPI Version           : 3.1
# MPI Thread Environment: 


# Calling sequence was: 

# /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -mem 4 Alltoall

# Minimum message length in bytes:   0
# Maximum message length in bytes:   4194304
#
# MPI_Datatype                   :   MPI_BYTE 
# MPI_Datatype for reductions    :   MPI_FLOAT
# MPI_Op                         :   MPI_SUM  
#
#

# List of Benchmarks to run:

# Alltoall

#----------------------------------------------------------------
# Benchmarking Alltoall 
# #processes = 2 
# ( 2 additional processes waiting in MPI_Barrier)
#----------------------------------------------------------------
       #bytes #repetitions  t_min[usec]  t_max[usec]  t_avg[usec]
            0         1000         0.03         0.03         0.03
            1         1000         3.13         3.77         3.45
            2         1000         3.32         3.59         3.46
            4         1000         3.26         3.65         3.45
            8         1000         3.32         3.61         3.47
           16         1000         3.24         3.67         3.46
           32         1000         3.25         3.77         3.51
           64         1000         1.31         6.46         3.88
          128         1000         3.87         4.42         4.15
          256         1000         1.38         6.91         4.15
          512         1000         3.83         4.19         4.01
         1024         1000         1.61         7.17         4.39
         2048         1000         4.93         5.54         5.24
         4096         1000         7.27         7.70         7.49
         8192         1000         7.97         8.13         8.05
        16384         1000         9.46         9.54         9.50
        32768         1000        11.43        11.48        11.45
        65536          640        21.34        21.45        21.39
       131072          320        30.19        30.25        30.22
       262144          160        46.84        46.93        46.88
       524288           80        78.71        78.74        78.72
      1048576           40       188.45       192.14       190.29
      2097152           20       336.62       340.21       338.42
      4194304           10       713.29       718.38       715.84

#----------------------------------------------------------------
# Benchmarking Alltoall 
# #processes = 4 
#----------------------------------------------------------------
       #bytes #repetitions  t_min[usec]  t_max[usec]  t_avg[usec]
            0         1000         0.03         0.03         0.03
            1         1000         4.02         4.32         4.16
            2         1000         4.05         4.37         4.20
            4         1000         4.03         4.35         4.18
            8         1000         4.07         4.40         4.23
           16         1000         4.12         4.43         4.26
           32         1000         4.07         4.41         4.23
           64         1000         4.26         4.57         4.40
          128         1000         4.38         4.69         4.53
          256         1000         4.90         5.41         5.15
          512         1000         5.02         5.53         5.27
         1024         1000         5.29         5.84         5.56
         2048         1000         5.61         6.06         5.83
         4096         1000         8.45         8.71         8.57
         8192         1000         9.96        10.43        10.20
        16384         1000        12.52        13.87        13.20
        32768         1000        22.50        23.07        22.81
        65536          640        33.11        33.87        33.50
       131072          320        52.12        52.76        52.40
       262144          160        90.90        92.47        91.37
       524288           80       173.89       176.26       174.68
      1048576           40       371.47       380.94       375.46
      2097152           20       732.57       747.82       738.86
      4194304           10      1405.77      1422.57      1412.98


# All processes entering MPI_Finalize
```

***
# 6. 計算ノード入れ替え

本章は、構築した4ノードクラスタのうち1ノードにハードウェア障害等が発生した場合を想定し、この計算ノードを新たな計算ノードに入れ替えます。

1. OCIコンソールメニューから **コンピュート** → **クラスタ・ネットワーク** を選択し、表示される以下画面で、作成されたクラスタ・ネットワークをクリックします。

   ![画面ショット](console_page31.png)

2. 表示される以下画面の **インスタンス・プール** フィールドで、クラスタ・ネットワークの作成に伴い作成されたインスタンスプールをクリックします。

   ![画面ショット](console_page32.png)

3. 表示される以下画面左下の **アタッチされたインスタンス** メニューをクリックします。

   ![画面ショット](console_page33.png)

4. 表示される画面の以下 **アタッチされたインスタンス** フィールドで、削除するインスタンスのメニューから **インスタンスのデタッチ** メニューをクリックします。

   ![画面ショット](console_page34.png)

5. 表示される以下画面で、 **このインスタンスおよびアタッチされたブート・ボリュームを完全に終了（削除）** と **プールのインスタンス構成をインスタンスのテンプレートとして使用し、インスタンスを新しいインスタンスで置き換える** チェックボックスをチェックし、 **デタッチと終了** ボタンをクリックします。

   ![画面ショット](console_page35.png)

6. OCIコンソールメニューから **コンピュート** → **インスタンス** とメニューを辿り、デタッチしたインスタンスが終了され、新たなインスタンスが実行中となれば、計算ノードの入れ替えは終了です。

再度 **[5. MPIプログラム実行（4ノード編）](#5-mpiプログラム実行4ノード編)** に従いIntel MPIベンチマークを実行、インターコネクト性能が十分出ていることを確認します。

***
# 7. クラスタ・ネットワークの終了

本章は、 **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を終了することで、作成したクラスタ・ネットワークと計算ノードを削除します。

1. OCIコンソールメニューから **コンピュート** → **クラスタ・ネットワーク** を選択し、表示される以下画面で作成したクラスタ・ネットワークの **終了** メニューをクリックします。

   ![画面ショット](console_page29.png)

クラスタ・ネットワークの **状態** が **終了済** となれば、削除が完了しています。

これで、このチュートリアルは終了です。
