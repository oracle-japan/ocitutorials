---
title: "ブロック・ボリュームでNFSサーバを構築する"
excerpt: "ブロック・ボリュームでNFSサーバを構築してみましょう。このチュートリアルを終了すると、OCIのブロックストレージサービスであるブロック・ボリュームを使用するコストパフォーマンスに優れるNFSサーバを、OCIコンソールから簡単に構築することが出来るようになります。"
order: "1310"
layout: single
header:
  teaser: "/hpc/spinup-nfs-server/architecture_diagram.png"
  overlay_image: "/hpc/spinup-nfs-server/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

Oracle Cloud Infrastructure（以降OCIと記載）のブロック・ボリュームは、以下の特徴からHPCクラスタやGPUクラスタのファイル共有ストレージとして使用するNFSサーバのストレージに最適なサービスです。
- 同一可用性ドメイン内の異なるフォルト・ドメインに複数のレプリカを持ち高い可用性を実現
- ディスク装置にNVMe SSDを採用することで高いスループットとIOPSを実現

また、Intel Ice Lakeプロセッサを搭載するベア・メタル・シェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)**  は、50 GbpsのTCP/IP接続用ポートを2個搭載し、それぞれをiSCSI接続のブロック・ボリュームアクセス用途とNFSクライアントへのNFSサービス用途に割当てることで、コストパフォーマンスの高いNFSサーバ用インスタンスとして利用することが可能です。

OCIは、NFSのマネージドサービスであるファイル・ストレージも提供しており、OCIコンソールから簡単にNFSファイルサービスをデプロイすることが出来ますが、本チュートリアルのように少しだけ手間をかけてブロック・ボリュームとベア・メタル・インスタンスを組み合わせたNFSファイルサービスを自身で構築することで、ファイル・ストレージよりもコストパフォーマンスの高いファイル共有ストレージを構築することが出来ます。  
ファイル・ストレージとブロック・ボリュームNFSサーバの比較詳細は、 **[パフォーマンス関連Tips集](/ocitutorials/hpc/#2-2-パフォーマンス関連tips集)** の **[コストパフォーマンスの良いファイル共有ストレージ構築方法](/ocitutorials/hpc/benchmark/howto-configure-sharedstorage/)** を参照ください。

このチュートリアルは、 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から無料で利用可能なファイル共有ストレージ環境を構築するための **[スタック](/ocitutorials/hpc/#5-3-スタック)** を利用し、以下構成の典型的なNFSのファイル共有ストレージ環境を **[リソース・マネージャ](/ocitutorials/hpc/#5-2-リソースマネージャ)** から自動構築、構築したNFSファイルシステム性能をIORとmdtestで検証します。

![システム構成図](architecture_diagram.png)

|            | 利用する<br>OCIサービス | 構成                   | 用途                    |     |
| ---------- | ----------- | -------------------- | --------------------- | --- |
| NFSディスク領域  | ブロック・ボリューム  | 1 TB Balanced x 15   | ファイル共有ストレージ領域         |     |
| NFSサーバ | ベアメタルインスタンス | BM.Optimized3.36 x 1 | NFSサーバ            |     |
| NFSクライアント  | VMインスタンス    | VM.Standard2.24 x 4  | ファイルシステムベンチマーク用<br>NFSクライアント     |     |
| Bastionノード | VMインスタンス    | VM.Standard2.2 x 1   | インターネットからのログイン用<br>ゲートウェイ |     |

このファイル共有ストレージ環境構築用スタックを利用すると、通常であれば数日かかるようなファイル共有ストレージ構築作業を、OCIコンソールのGUIから10項目程度のメニューを選択するだけで実施することが可能になります。

**所要時間 :** 約1時間

**前提条件 :** ファイル共有ストレージを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。

**注意 :** チュートリアル内の画面ショットについては、OCIの現在のコンソール画面と異なっている場合があります。また使用するファイル共有ストレージ環境構築用スタックのバージョンが異なる場合も、チュートリアル内の画面ショットが異なる場合があります。

***
# 0. ファイル共有ストレージ環境構築用スタックの概要

本チュートリアルで使用するファイル共有ストレージ環境構築用スタックは、構築を大きく2つのステップに分けて実行しており、前半はTerraformを使用したOCIレベルのリソース構築フェーズで、後半はTerraformから起動されるAnsibleによるOSレベルのカスタマイズフェーズです。

具体的には、以下のような処理が行われます。

[TerraformによるOCIリソース構築フェーズ]

- VCNと関連するネットワークリソース構築
- Bastionノードインスタンス構築
- NFSサーバインスタンス構築
- NFSクライアントインスタンス構築
- ブロック・ボリューム構築
- Ansible関連ソフトウェアインストール

[AnsibleによるOSレベルカスタマイズフェーズ]

- firewalld停止
- SELinux無効化
- ブロック・ボリューム領域ファイルシステム構築
- /etc/hostsファイル生成
- NFSサーバのセカンダリVNIC設定
- NFSファイル共有環境構築

***
# 1. スタックの作成

本章は、 **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から無料で利用可能なファイル共有ストレージ環境構築用 **[スタック](/ocitutorials/hpc/#5-3-スタック)** を元に、前述のファイル共有ストレージ環境を構築するためのスタックを作成します。

1. 以下マーケットプレイスのファイル共有ストレージ環境構築用スタックページにアクセスします。

   [https://cloud.oracle.com/marketplace/application/82147253](https://cloud.oracle.com/marketplace/application/82147253/)

2. OCIコンソールへのログイン画面が表示された場合（まだログインしていない場合）、ログインを完了します。

3. 表示される以下画面の右上で、スタックをデプロイするリージョンを選択し、 **使用許諾** チェックボックスをチェックし、 **スタックの起動** ボタンをクリックします。

   ![画面ショット](market_place.png)

4. 表示される以下 **スタック情報** 画面で、以下の情報を入力・確認し、下部の **次** ボタンをクリックします。
    - **名前 :** スタックに付与する名前（任意）
    - **説明 :** スタックに付与する説明（任意）
    - **コンパートメントに作成 :** スタックを作成するコンパートメント(*4)

   *4) OCIコンソールで最後に使用していたコンパートメントが引き継がれるため、意図したコンパートメントでない場合は、ファイル共有ストレージ環境構築用スタックページにアクセスする前に、予め所望のコンパートメントを選択しておきます。

   ![画面ショット](stack_page01.png)

5. 表示される **変数の構成** 画面で、各画面フィールドに以下の情報を入力し、下部の **次** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。

   5.1 **General Deployment Configuration** フィールド
    - **SSH Public Key :** Bastionにログインする際使用するSSH秘密鍵に対応する公開鍵
    - **Availability Domain :** ファイル共有ストレージ環境をデプロイするAD

   ![画面ショット](stack_page02.png)

   5.2 **NFS Server Instance Configuration** フィールド
    - **NFS Storage Server Compute Shape :** BM.Optimized3.36
   
   ![画面ショット](stack_page03.png)

   5.3 **NFS Storage Configuration** フィールド
    - **XFS-1: Build file system using either Higher/Balanced/Lower Cost Perfomrance Block Volumes :** チェック
    - **Block Volume Storage Performance tier :** Balanced
    - **Number of block volumes :** 15
    - **Block volume size :** (*5)

   *5) NFSディスク領域の総容量を本チュートリアルで使用する15 TBより増やす場合は、必要な総容量を15で割った値をこのフィールドに指定します。

   ![画面ショット](stack_page04.png)

   5.4 **NFS Client Instance Configuration - Optional** フィールド
    - **Create Compute Nodes :** チェック
    - **Number of clients :** 4

   ![画面ショット](stack_page05.png)

6. 表示される **確認** 画面で、これまでの設定項目が意図したものになっているかを確認し、以下 **作成されたスタックで適用を実行しますか。** フィールドの **適用の実行** をチェックオフし、下部の **作成** ボタンをクリックします。

   ![画面ショット](stack_page06.png)

   ここで **適用の実行** をチェックした場合、 **作成** ボタンのクリックと同時にスタックの適用が開始され、ファイル共有ストレージ環境のデプロイが始まりますが、このチュートリアルではスタックの計画を実行してから適用を行います。

これで、以下画面のとおりファイル共有ストレージ環境構築用スタックが作成されました。

![画面ショット](stack_page07.png)

***
# 2. スタックの計画

本章は、完成したリソース・マネージャのスタックを計画し、どのようなリソースがデプロイされるか確認します。

1. 作成したスタックの以下 **スタックの詳細** 画面で、 **計画** ボタンをクリックします。

   ![画面ショット](stack_page08.png)

2. 表示される以下 **計画** サイドバーで、 **計画** ボタンをクリックします。

   ![画面ショット](stack_page09.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** → **成功** と遷移すれば、スタックの計画が終了しています。

   ![画面ショット](stack_page10.png)

   表示される以下 **ログ** フィールドで、適用時にデプロイされるリソースを確認します。

   ![画面ショット](stack_page11.png)

***
# 3. スタックの適用

本章は、計画で作成されるリソースに問題が無いことを確認したスタックに対し、適用を行いファイル共有ストレージ環境をデプロイします。

1. 以下 **スタックの詳細** 画面で、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page12.png)

2. 表示される以下 **適用** サイドバーで、 **適用** ボタンをクリックします。

   ![画面ショット](stack_page13.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、スタックの適用が実施されています。

   ![画面ショット](stack_page14.png)

   表示される以下 **ログ** フィールドで、リソースのデプロイ状況を確認します。

   ![画面ショット](stack_page11.png)

   この適用が完了するまでの所要時間は、本チュートリアル構成の場合で15分程度です。

   ステータスが **成功** となれば、ファイル共有ストレージ環境のデプロイが完了しています。

***
# 4. Bastionノード・NFSサーバ・NFSクライアントの確認

本章は、デプロイされたBastionノード、NFSサーバ、及びNFSクライアントにログインし、環境を確認します。

なお、このファイル共有ストレージ環境構築用スタックでデプロイした各インスタンスは、/etc/hostsファイルを使用して以下のホスト名でお互いを名前解決できるようになっています。

| Bastionノード | NFSサーバ   | NFSクライアント    |
| ---------- | ------------ | ------------ |
| bastion-1  | nfs-server-1 | client-[1-4] |


1. Bastionノードログイン

   Bastionノードへのログインは、スタック適用時の以下 **ログ** フィールドの最後に表示されているIPアドレスを使用し、インターネットを介してopcユーザでSSHログインします。

   ![画面ショット](stack_page15.png)

   このSSH接続では、スタックに指定したSSH公開鍵に対応する秘密鍵を使用します。

   ```sh 
   > ssh -i path_to_ssh_secret_key opc@123.456.789.123
    ```

2. NFSサーバログイン

   NFSサーバは、プライベートサブネットに接続されており、インターネット経由ログインすることが出来ないため、Bastionノードのopcユーザから以下のようにSSHログインします。

   ```sh 
   > ssh nfs-server-1
    ```

3. NFSサーバファイルシステム確認

   NFSサーバは、以下のようにボリューム・サイズ1 TBの15個のブロック・ボリュームがそれぞれ物理ボリュームとして存在し、これらが全て1個のボリュームグループ（vg_nfs_disk）に組み込まれています。

   ```sh
   > sudo pvdisplay | grep -A3 "Physical volume"
     --- Physical volume ---
   PV Name               /dev/sdg
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdf
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdm
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdk
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdc
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdd
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdn
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdl
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdb
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdp
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdh
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdo
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdi
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sde
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
   --
   --- Physical volume ---
   PV Name               /dev/sdj
   VG Name               vg_nfs_disk
   PV Size               1000.00 GiB / not usable 4.00 MiB
      ```

   また、以下のようにこのボリュームグループに論理ボリューム（disk）が作成されています。

   ```sh
   > sudo vgdisplay -v vg_nfs_disk | grep -A2 "Logical volume"
   --- Logical volume ---
   LV Path                /dev/vg_nfs_disk/disk
   LV Name                disk
   ```

   また、以下のようにこの論理ボリュームがXFSファイルシステムとして/mnt/nfsshareにマウントされ、その容量が15 TBであることがわかります。

   ```sh
   > grep /dev/vg_nfs_disk/disk /etc/fstab
   /dev/vg_nfs_disk/disk  /mnt/nfsshare   xfs     defaults,_netdev,nofail,noatime,inode64,uquota,prjquota        0 2
   > df -h /mnt/nfsshare
   Filesystem                    Size  Used Avail Use% Mounted on
   /dev/mapper/vg_nfs_disk-disk   15T   34M   15T   1% /mnt/nfsshare
   ```

   また、以下のように/mnt/nfsshare/exportsディレクトリがこのスタックでデプロイした3個のサブネットに対してNFSエクスポートされていることがわかります。

   ```sh
   > sudo exportfs
   /mnt/nfsshare/exports
         10.0.3.0/255.255.255.0
   /mnt/nfsshare/exports
         10.0.0.0/255.255.255.0
   /mnt/nfsshare/exports
         10.0.6.0/255.255.255.0
   ```

4. NFSサーバサービス起動設定

   デプロイ直後のNFSサーバは、OS再起動時にNFSディスク領域の論理ボリュームとNFSファイルサービスをアクティブ化しないように設定されています。  
   そのため、OS再起動を行った場合以下のコマンドでサービスを開始します。

   ```sh 
   > sudo lvchange -ay /dev/vg_nfs_disk/disk
   > sudo systemctl start nfs
   ```

   OS起動時に自動的にこれらをアクティブ化するには、以下のように/etc/lvm/lvm.confファイルを修正しsystemdのNFSサービス起動設定を変更します。

   ```sh
   > sudo diff /etc/lvm/lvm.conf_sv /etc/lvm/lvm.conf
   1298c1298
   < auto_activation_volume_list = []
   ---
   > #auto_activation_volume_list = []
   > sudo systemctl enable nfs
   ```

5. NFSクライアントログイン

   NFSクライアントは、プライベートサブネットに接続されており、インターネット経由ログインすることが出来ないため、Bastionノードのopcユーザから以下のようにSSHログインします。

   ```sh 
   > ssh client-1
    ```

6. NFSクライアントファイルシステム確認

   NFSクライアントは、以下のようにNFSサーバのエクスポートする/mnt/nfsshare/exports領域を、NFSバージョン3とNFSバージョン4でそれぞれ/mnt/nfsと/mnt/nfsv4にマウントしています。

   ```sh
   > grep nfsshare /etc/fstab
   10.0.6.87:/mnt/nfsshare/exports /mnt/nfs nfs vers=3,defaults,noatime,nodiratime,bg,timeo=100,ac,actimeo=120,nocto,rsize=1048576,wsize=1048576,nolock,local_lock=none,proto=tcp,sec=sys,_netdev 0 0
   10.0.6.87:/mnt/nfsshare/exports /mnt/nfsv4 nfs vers=4,defaults,noatime,nodiratime,bg,timeo=100,ac,actimeo=120,nocto,rsize=1048576,wsize=1048576,nolock,local_lock=none,proto=tcp,sec=sys,_netdev 0 0
   > df -h /mnt/nfs /mnt/nfsv4
   Filesystem                       Size  Used Avail Use% Mounted on
   10.0.6.94:/mnt/nfsshare/exports   15T   33M   15T   1% /mnt/nfs
   10.0.6.94:/mnt/nfsshare/exports   15T   33M   15T   1% /mnt/nfsv4
   ```
   このNFSファイルシステム構成は、パスによるNFSサーバ領域アクセスに使用するNFSプロトコルバージョンの切り替えを可能にしています。

   この/etc/fstabのエントリをコピーすることで、同一VCN内のインスタンスからNFSサーバ領域をマウントすることが出来ます。

***
# 5. ファイルシステムベンチマーク

## 5-0. ファイルシステムベンチマーク概要

本章は、ファイルシステムベンチマークツールである **IOR** と **mdtest** をNFSクライアントからNFSファイルシステム領域に対して実行し、その性能を検証します。

IORとmdtestは、複数のNFSクライアントからベンチマークを実行する際のNFSクライアント間通信にMPIを使用します。ここでは、OpenMPIを使用します。  
またOpenMPIは、NFSクライアント間でSSHを使用するため、SSHのPATH設定にOpenMPIのツールが格納されるディレクトリを設定する必要があります。

またここで使用するIORとmdtestは、 **[IO500](https://io500.org/)** に含まれるものを使用します。

以上より、本章で実施するファイルシステムベンチマークは、以下の手順を経て行います。

- OpenMPIインストール
- SSHのPATH設定にOpenMPIツール群格納ディレクトリを追加
- IO500インストール

ここでは、4ノードのNFSクライアントからIORとmdtestを実行し、以下性能が出ています。

| Test          | Result (*6)  |
| ------------- | -----------: |
| IOR write     | 3,720  MiB/s |
| IOR read      | 4,938 MiB/s  |
| mdtest create | 3,796        |
| mdtest stat   | 23,860       |
| mdtest delete | 3,818        |

*6) 3回実行した平均値です。

## 5-1. OpenMPIインストール

本章は、OpenMPIをインストールします。

以下コマンドをBastionノードのopcユーザで実行し、全NFSクライアントにOpenMPIをインストールします。

```sh
> for i in `seq 1 4`; do hname="client-"$i; echo $hname; ssh $hname "sudo yum -y install openmpi3 openmpi3-devel"; done
```

## 5-2. SSHのPATH設定にOpenMPIツール群格納ディレクトリを追加

本章は、SSHのPATH設定にOpenMPIツール群格納ディレクトリを追加後、OpenMPIの稼働確認を行います。

以下コマンドをBastionノードのopcユーザで実行し、全NFSクライアントのopcユーザのSSHのPATH設定にOpenMPIツール群格納ディレクトリ"/usr/lib64/openmpi3/bin"を追加します。

```sh
> for i in `seq 1 4`; do hname="client-"$i; echo $hname; ssh $hname "sudo sed -i 's/#PermitUserEnvironment no/PermitUserEnvironment yes/g' /etc/ssh/sshd_config"; done
> for i in `seq 1 4`; do hname="client-"$i; echo $hname; ssh $hname "sudo systemctl restart sshd"; done
> for i in `seq 1 4`; do hname="client-"$i; echo $hname; ssh $hname "echo \"PATH=/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/opc/.local/bin:/home/opc/bin:/usr/lib64/openmpi3/bin\" > ~/.ssh/environment"; done

```

次に、NFSクライアントclient-1にopcユーザでSSHログインし、以下のように全てのNFSクライアントのイニシャルホスト名を含むファイルをNFSファイルシステム以下に作成し、これを使用してOpenMPIの稼働確認を行います。

```sh
> pwd
/mnt/nfs/io500
> cat ./hostlist.txt 
client-1
client-2
client-3
client-4
> module load mpi/openmpi3-x86_64
> mpirun -n 4 -N 1 -hostfile hostlist.txt /bin/hostname
client-1
client-3
client-4
client-2
```

## 5-3. IO500インストール

本章は、IO500をインストールします。

以下コマンドをNFSクライアントclient-1のopcユーザで実行し、IO500をNFSファイルシステム以下にインストールします。

```sh
> sudo yum install -y git autoconf automake
> pwd
/mnt/nfs/io500
> git clone https://github.com/IO500/io500.git -b io500-isc20
> cd io500
> ./prepare.sh
```

## 5-4. ファイルシステムベンチマーク実行

本章は、ファイルシステムベンチマークを実行します。

まず初めに、NFSクライアントclient-1のopcユーザで、IORとmdtestを実行する以下スクリプトを/mnt/nfs/io500/io500_easy.shとして作成し、これに実行権を与えます。

```sh
#!/bin/bash
MPI_HOSTFILE=/mnt/nfs/io500/hostlist.txt
IO500_BIN_PATH=/mnt/nfs/io500/io500/bin
IO500_DATA_DIR=/mnt/nfs/io500/datafiles
# Set the number of times to repeat each test for mdtest and ior
rep_count=3
# mdtest easy write
for i in `seq 1 $rep_count`
do
  name="try"$i
  echo "### Starting mdtest easy write $name"
  mkdir -p $IO500_DATA_DIR/$name/mdt_easy
  date '+%Y/%m/%d %T'
  mpiexec --mca btl_base_warn_component_unused 0 --mca pml ob1 -np 8 -npernode 2 -hostfile $MPI_HOSTFILE $IO500_BIN_PATH/mdtest -Y -C -F -P -d $IO500_DATA_DIR/$name/mdt_easy -n 1000000 -u -L -a POSIX -x $IO500_DATA_DIR/$name/mdt_easy-stonewall -N 1 -W 300
done
# IOR easy write
for i in `seq 1 $rep_count`
do
  name="try"$i
  echo "### Starting IOR easy write $name"
  mkdir -p $IO500_DATA_DIR/$name/ior_easy
  date '+%Y/%m/%d %T'
  mpiexec --mca btl_base_warn_component_unused 0 --mca pml ob1 -np 8 -npernode 2 -hostfile $MPI_HOSTFILE $IO500_BIN_PATH/ior -w  -a POSIX -t 2m -v -b 9920000m -F -i 1 -C -Q 1 -g -G 27 -k -e -o $IO500_DATA_DIR/$name/ior_easy -O stoneWallingStatusFile=$IO500_DATA_DIR/$name/stonewall -O stoneWallingWearOut=1 -D 300
done
# IOR easy read
for i in `seq 1 $rep_count`
do
  name="try"$i
  echo "### Starting IOR easy read $name"
  date '+%Y/%m/%d %T'
  mpiexec --mca btl_base_warn_component_unused 0 --mca pml ob1 -np 8 -npernode 2 -hostfile $MPI_HOSTFILE $IO500_BIN_PATH/ior -r -R  -a POSIX -t 2m -v -b 9920000m -F -i 1 -C -Q 1 -g -G 27 -k -e -o $IO500_DATA_DIR/$name/ior_easy -O stoneWallingStatusFile=$IO500_DATA_DIR/$name/stonewall
done
# mdtest easy stat
for i in `seq 1 $rep_count`
do
  name="try"$i
  echo "### Starting mdtest easy stat $name"
  date '+%Y/%m/%d %T'
  mpiexec --mca btl_base_warn_component_unused 0 --mca pml ob1 -np 8 -npernode 2 -hostfile $MPI_HOSTFILE $IO500_BIN_PATH/mdtest -T -F -P -d $IO500_DATA_DIR/$name/mdt_easy -n 1000000 -u -L -a POSIX -x $IO500_DATA_DIR/$name/mdt_easy-stonewall -N 1
done
# mdtest easy delete
for i in `seq 1 $rep_count`
do
  name="try"$i
  echo "### Starting mdtest easy delete $name"
  date '+%Y/%m/%d %T'
  mpiexec --mca btl_base_warn_component_unused 0 --mca pml ob1 -np 8 -npernode 2 -hostfile $MPI_HOSTFILE $IO500_BIN_PATH/mdtest -r -F -P -d $IO500_DATA_DIR/$name/mdt_easy -n 1000000 -u -L -a POSIX -x $IO500_DATA_DIR/$name/mdt_easy-stonewall -N 1
done
date '+%Y/%m/%d %T'
```

このスクリプトは、mdtestのcreate, stat, deleteとIORのwrite, readを各3回実行し、NFSファイルシステムのメタデータ性能とデータ転送性能を計測します。

次に、以下コマンドをNFSクライアントclient-1のopcユーザで実行し、スクリプトの出力から性能値を確認します。  
この実行に要する時間は、一時間半程度です。

```sh
> pwd
/mnt/nfs/io500
> ./io500_easy.sh
```

***
# 6. スタックの破棄

本章は、スタックを破棄することで、構築したファイル共有ストレージ環境を削除します。

以下の手順は、本チュートリアルで作成したOCI上のリソースをすべて削除するため、 **ブロック・ボリューム上に作成したNFSサーバの共有ストレージ領域に格納されているデータが全て消失** します。

1. 以下 **スタックの詳細** 画面で、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page16.png)

2. 表示される以下 **破棄** サイドバーで、 **破棄** ボタンをクリックします。

   ![画面ショット](stack_page17.png)

3. 表示される以下 **ジョブ詳細** ウィンドウで、左上のステータスが **受入れ済** → **進行中** と遷移すれば、スタックの破棄が実施されています。

   ![画面ショット](stack_page18.png)

   表示される以下 **ログ** フィールドで、リソースの削除状況を確認します。

   ![画面ショット](stack_page11.png)

   この破棄が完了するまでの所要時間は、本チュートリアル構成の場合で5分程度です。

   ステータスが **成功** となれば、ファイル共有ストレージ環境の削除が完了しています。

これで、このチュートリアルは終了です。