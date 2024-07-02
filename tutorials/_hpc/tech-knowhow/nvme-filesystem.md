---
title: "ベアメタルインスタンスのNVMe SSDローカルディスク領域ファイルシステム作成方法"
excerpt: "高速スクラッチ領域として利用することを想定したNVMe SSDローカルディスクを内蔵するHPCクラスタ向けベアメタルシェイプBM.Optimized3.36やGPUクラスタ向けベアメタルシェイプBM.GPU4.8/BM.GPU.GM4.8は、NVMe SSDローカルディスクをOSのファイルシステムとして利用するための設定をユーザ自身が行う必要があります。本テクニカルTipsは、このファイルシステム作成方法を解説します。"
order: "321"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

NVMe SSDローカルディスクにファイルシステムを作成する方法は、搭載するドライブ数が異なる **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** と **[BM.GPU4.8/BM.GPU.GM4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** でその手順が異なり、それぞれの手順を以降で解説します。

本テクニカルTipsが前提とするOSは、 **Oracle Linux** です。

なお 、ここで解説するファイルシステム作成手順は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** で紹介する構築手順に含まれるため、これらチュートリアルの手順に従ってHPCクラスタやGPUクラスタを構築する場合は、改めて実施する必要はありません。

***
# 1. BM.Optimized3.36用ファイルシステム作成手順

**BM.Optimized3.36** は、3.84 TBのNVMe SSDローカルディスクを1ドライブ内蔵するため、以下の手順を該当するノードのopcユーザで実行し、ファイルシステムを作成します。

```sh
$ sudo parted -s /dev/nvme0n1 mklabel gpt
$ sudo parted -s /dev/nvme0n1 -- mkpart primary xfs 1 -1
$ sudo mkfs.xfs -L localscratch /dev/nvme0n1p1
$ sudo mkdir -p /mnt/localdisk
$ echo "LABEL=localscratch /mnt/localdisk/ xfs defaults,noatime 0 0" | sudo tee -a /etc/fstab
$ sudo mount /mnt/localdisk
$ df -h /mnt/localdisk
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1  3.5T   33M  3.5T   1% /mnt/localdisk
$
```

この手順は、NVMe SSDローカルディスク全領域を1パーティションで区画し、ラベル名 **localscratch** でXFSファイルシステムにフォーマットし、OS再起動時に自動的にマウントされる設定で **/mnt/localdisk** にマウントします。

***
# 2. BM.GPU4.8/BM.GPU.GM4.8用ファイルシステム作成手順

**BM.GPU4.8/BM.GPU.GM4.8** は、6.4 TBのNVMe SSDローカルディスクを4ドライブ内蔵するため、以下の手順を該当するノードのopcユーザで実行し、ファイルシステムを作成します。

```sh
$ sudo vgcreate nvme /dev/nvme0n1 /dev/nvme1n1 /dev/nvme2n1 /dev/nvme3n1
$ sudo lvcreate -l 100%FREE nvme
$ sudo mkfs.xfs -L localscratch /dev/nvme/lvol0
$ sudo mkdir -p /mnt/localdisk
$ echo "LABEL=localscratch /mnt/localdisk/ xfs defaults,noatime 0 0" | sudo tee -a /etc/fstab
$ sudo mount /mnt/localdisk
$ df -h /mnt/localdisk
Filesystem              Size  Used Avail Use% Mounted on
/dev/mapper/nvme-lvol0   25T   34M   25T   1% /mnt/localdisk
```

この手順は、4ドライブのNVMe SSDローカルディスクをまとめて1個の論理ボリュームとして作成し、ラベル名 **localscratch** でXFSファイルシステムにフォーマットし、OS再起動時に自動的にマウントされる設定で **/mnt/localdisk** にマウントします。