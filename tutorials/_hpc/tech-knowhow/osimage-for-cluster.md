---
title: "クラスタネットワーキングイメージの選び方"
excerpt: "クラスタ・ネットワークを使用するインスタンスは、接続に必要なソフトウェアがインストールされている必要がありますが、これらを含んだOSイメージがクラスタネットワーキングイメージとしてマーケットプレイスから提供されています。本テクニカルTipsは、このクラスタネットワーキングイメージの適切な選び方を解説します。"
order: "312"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を使用するインスタンスは、接続に必要なソフトウェアがインストールされている必要がありますが、これらを含んだOSイメージが **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** として **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から提供されています。  
本テクニカルTipsは、この **クラスタネットワーキングイメージ** の適切な選び方を解説します。

***
# 0. 概要

**[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** は、ベースOSにOracle Linuxを採用し、シェイプがBM.HPC2.36/ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** の場合そのバージョンは7.9と8から選択でき、 **[BM.GPU4.8/BM.GPU.A100-v2.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** の場合7.9のみ選択可能です。  
なお、2023年6月29日時点のバージョン8系 **クラスタネットワーキングイメージ** の最新は、8.7です。

下表は、クラスタ・ネットワークに対応したシェイプと対応する **クラスタネットワーキングイメージ** の組み合わせを示しています。  

| シェイプ             | OSイメージ名                      | ベースOS            | マーケットプレイスURL                                                                      |
| ---------------- | ---------------------------- | ---------------- | --------------------------------------------------------------------------------- |
| BM.HPC2.36       | HPC Cluster Networking Image | Oracle Linux 7.9 | **[Link](https://cloud.oracle.com/marketplace/application/63394796/)** [^hcni79]  |
|                  | HPC Cluster Networking Image | Oracle Linux 8   | **[Link](https://cloud.oracle.com/marketplace/application/63394796/)** [^hcni8]   |
| BM.Optimized3.36 | HPC Cluster Networking Image | Oracle Linux 7.9 | **[Link](https://cloud.oracle.com/marketplace/application/63394796/)** [^hcni79]  |
|                  | HPC Cluster Networking Image | Oracle Linux 8   | **[Link](https://cloud.oracle.com/marketplace/application/63394796/)** [^hcni8]   |
| BM.GPU4.8        | GPU Cluster Networking Image | Oracle Linux 7.9 | **[Link](https://cloud.oracle.com/marketplace/application/134254210/)** [^gcni79] |
| BM.GPU.A100-v2.8 | GPU Cluster Networking Image | Oracle Linux 7.9 | **[Link](https://cloud.oracle.com/marketplace/application/134254210/)** [^gcni79] |

[^hcni79]: "バージョン"フィールドで、"OracleLinux-7"で始まる最新のイメージを選択します。

[^hcni8]: "バージョン"フィールドで、"OracleLinux-8"で始まる最新のイメージを選択します。

[^gcni79]: "バージョン"フィールドで、最新のイメージを選択します。

***
# 1. クラスタ・ネットワーク対応OSイメージ指定方法

## 1-0. 概要

**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続するインスタンスのデプロイは、OCIコンソールを使用する方法と **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を使用する方法があります。

本章は、これらの方法で **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を適切に指定する方法を解説します。

## 1-1. OCIコンソールで指定

OCIコンソールを使用して **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続するインスタンスをデプロイする場合、 **[インスタンス構成](/ocitutorials/hpc/#5-7-インスタンス構成)** を予め作成しますが、このインスタンス構成の **イメージとシェイプ** フィールドで **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を選択します。  
以下 **イメージの選択** サイドバーで **Marketplace** を選択し検索フィールドに **hpc** （HPC Cluster Networking Image）か **gpu** （GPU Cluster Networking Image）と入力して表示される **Oracle Linux - HPC Cluster Networking Image** あるいは **Oracle Linux - GPU Cluster Networking Image** を選択し **イメージ・ビルド** フィールドで適切なOSイメージを選択[^sel_img]し **イメージの選択** ボタンをクリックします。

   ![画面ショット](console_page01.png)

[^sel_img]: "HPC_Cluster_Networking_Image_Oracle_Linux_7.9"の場合は"OracleLinux-7"で始まる最新のイメージを、"HPC_Cluster_Networking_Image_Oracle_Linux_8"の場合は"OracleLinux-8"で始まる最新のイメージ[^latest_img8]を、"GPU_Cluster_Networking_Image_Oracle_Linux_7.9"の場合は全ての中から最新のイメージを選択します。

[^latest_img8]: 2023年6月29日時点の最新は、8.7です。

## 1-2. HPCクラスタスタックで指定

**[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を使用して **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続するインスタンスをデプロイする場合、 **[スタック](/ocitutorials/hpc/#5-3-スタック)** メニュー中の以下 **Compute node options** フィールドの **Image version** プルダウンメニューで **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を選択します。  

   ![画面ショット](console_page02.png)

各選択肢は、以下の **クラスタネットワーキングイメージ** に対応しています。

| メニュー名   | **クラスタネットワーキングイメージ**                              | 備考                     |
| ------- | --------------------------------------------- | ---------------------- |
| HPC_OL7 | HPC Cluster Networking Image Oracle Linux 7.9 | -                      |
| HPC_OL8 | HPC Cluster Networking Image Oracle Linux 8   | 2023年6月29日時点のバージョンは8.7 |
| GPU     | GPU Cluster Networking Image Oracle Linux 7.9 | -                      |
|         |                                               |                        |