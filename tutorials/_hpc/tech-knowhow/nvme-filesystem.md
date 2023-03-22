---
title: "ベアメタルインスタンスの内蔵NVMe SSD領域ファイルシステム作成方法"
excerpt: "高速スクラッチ領域として利用することを想定したNVMe SSDディスクを内蔵するHPCクラスタ向けベアメタルシェイプBM.Optimized3.36やGPUクラスタ向けベアメタルシェイプBM.GPU4.8/BM.GPU.GM4.8は、NVMe SSDをOSのファイルシステムとして利用するための設定をユーザ自身が行う必要があります。本テクニカルTipsは、このファイルシステム作成方法を解説します。"
order: "500"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

高速スクラッチ領域として利用することを想定したNVMe SSDを内蔵するHPCクラスタ向けベアメタルシェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** やGPUクラスタ向けベアメタルシェイプ **[BM.GPU4.8/BM.GPU.GM4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** は、NVMe SSDをOSのファイルシステムとして利用するための設定をユーザ自身が行う必要があります。  
本テクニカルTipsは、このファイルシステム作成方法を解説します。

内蔵NVMe SSDドライブにファイルシステムを作成する方法は、搭載するドライブ数が異なるBM.Optimized3.36とBM.GPU4.8/BM.GPU.GM4.8でその手順が異なり、それぞれの手順を以降で解説します。

なお 、ここで解説するファイルシステム作成手順は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** で紹介する構築手順に含まれるため、これらチュートリアルの手順に従ってHPCクラスタやGPUクラスタを構築する場合は、改めて実施する必要はありません。

***
# 1. BM.Optimized3.36用ファイルシステム作成手順

BM.Optimized3.36は、3.84 TBのNVMe SSDディスクを1ドライブ内蔵するため、以下の手順を該当するノードのrootで実行し、ファイルシステムを作成します。

```sh
> parted -s /dev/nvme0n1 mklabel gpt
> parted -s /dev/nvme0n1 -- mkpart primary xfs 1 -1
> mkfs.xfs -L localscratch /dev/nvme0n1p1
> mkdir -p /mnt/localdisk
> echo "LABEL=localscratch /mnt/localdisk/ xfs defaults,noatime 0 0" >> /etc/fstab
> mount /mnt/localdisk
> df -h /mnt/localdisk
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1  3.5T   33M  3.5T   1% /mnt/localdisk
```

この手順は、NVMe SSDディスク全領域を1パーティションで区画し、ラベル名"localscratch"でXFSファイルシステムにフォーマットし、OS再起動時に自動的にマウントされる設定で/mnt/localdiskにマウントします。

***
# 2. BM.GPU4.8/BM.GPU.GM4.8用ファイルシステム作成手順

BM.GPU4.8/BM.GPU.GM4.8は、6.4 TBのNVMe SSDディスクを4ドライブ内蔵するため、以下の手順を該当するノードのrootで実行し、ファイルシステムを作成します。

```sh
> vgcreate nvme /dev/nvme0n1 /dev/nvme1n1 /dev/nvme2n1 /dev/nvme3n1
> lvcreate -l 100%FREE nvme
> mkfs.xfs -L localscratch /dev/nvme/lvol0
> mkdir -p /mnt/localdisk
> echo "LABEL=localscratch /mnt/localdisk/ xfs defaults,noatime 0 0" >> /etc/fstab
> mount /mnt/localdisk
> df -h /mnt/localdisk
Filesystem              Size  Used Avail Use% Mounted on
/dev/mapper/nvme-lvol0   25T   34M   25T   1% /mnt/localdisk
```

この手順は、4ドライブのNVMe SSDディスクをまとめて1個の論理ボリュームを作成し、ラベル名"localscratch"でXFSファイルシステムにフォーマットし、OS再起動時に自動的にマウントされる設定で/mnt/localdiskにマウントします。