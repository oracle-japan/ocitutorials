---
title: "クラスタ・ネットワーク対応OSイメージの選び方"
excerpt: "クラスタ・ネットワークを使用するインスタンスは、接続に必要なソフトウェアがインストールされている必要がありますが、これらを含んだOSイメージがマーケットプレイスから提供されています。本テクニカルTipsは、このOSイメージの適切な選び方を解説します。"
order: "312"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** を使用するインスタンスは、接続に必要なソフトウェアがインストールされている必要がありますが、これらを含んだOSイメージが **[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から提供されています。  
本テクニカルTipsは、このOSイメージの適切な選び方を解説します。

***
# 0. 概要

**[マーケットプレイス](/ocitutorials/hpc/#5-5-マーケットプレイス)** から提供される **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 対応OSイメージは、ベースOSにOracle Linuxを採用し、シェイプがBM.HPC2.36/ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** の場合そのバージョンは7.9と8.6から選択でき、 **[BM.GPU4.8/BM.GPU.GM4.8](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-gpu)** の場合7.9のみ選択可能です。

下表は、クラスタ・ネットワークに対応したシェイプと対応するOSイメージの組み合わせを示しています。  

| シェイプ             | OSイメージ名                      | ベースOS            | マーケットプレイスURL                                                            |
| ---------------- | ---------------------------- | ---------------- | ----------------------------------------------------------------------- |
| BM.HPC2.36       | HPC Cluster Networking Image | Oracle Linux 7.9 | **[Link](https://cloud.oracle.com/marketplace/application/63394796/)** |
|                  | HPC Cluster Networking Image | Oracle Linux 8.6 | **[Link](https://cloud.oracle.com/marketplace/application/63394796/)** |
| BM.Optimized3.36 | HPC Cluster Networking Image | Oracle Linux 7.9 | **[Link](https://cloud.oracle.com/marketplace/application/63394796/)** |
|                  | HPC Cluster Networking Image | Oracle Linux 8.6 | **[Link](https://cloud.oracle.com/marketplace/application/63394796/)** |
| BM.GPU4.8        | GPU Cluster Networking Image | Oracle Linux 7.9 | **[Link](https://cloud.oracle.com/marketplace/application/134254210/)** |
| BM.GPU.GM4.8     | GPU Cluster Networking Image | Oracle Linux 7.9 | **[Link](https://cloud.oracle.com/marketplace/application/134254210/)** |


***
# 1. クラスタ・ネットワーク対応OSイメージ指定方法

## 1-0. 概要

**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続するインスタンスのデプロイは、OCIコンソールを使用する方法と **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を使用する方法があります。

本章は、これらの方法でクラスタ・ネットワーク対応OSイメージを適切に指定する方法を解説します。

## 1-1. OCIコンソールで指定

OCIコンソールを使用して **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続するインスタンスをデプロイする場合、 **[インスタンス構成](/ocitutorials/hpc/#5-7-インスタンス構成)** を予め作成しますが、このインスタンス構成の **イメージとシェイプ** フィールドでクラスタ・ネットワーク対応OSイメージを選択します。  
以下 **イメージの選択** サイドバーで **Marketplace** を選択し検索フィールドに **hpc** （HPC Cluster Networking Image）か **GPU** （GPU Cluster Networking Image）と入力して表示される **Oracle Linux - HPC Cluster Networking Image** あるいは **Oracle Linux - GPU Cluster Networking Image** を選択し **イメージ・ビルド** フィールドで適切なOSイメージを選択し **イメージの選択** ボタンをクリック）します。

   ![画面ショット](console_page01.png)

## 1-2. HPCクラスタスタックで指定

**[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を使用して **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に接続するインスタンスをデプロイする場合、 **[スタック](/ocitutorials/hpc/#5-3-スタック)** メニュー中の以下 **Compute node options** フィールドの **Image version** プルダウンメニューでクラスタ・ネットワーク対応OSイメージを選択します。  

   ![画面ショット](console_page02.png)

各選択肢は、以下のクラスタ・ネットワーク対応OSイメージに対応しています。

| メニュー名   | クラスタ・ネットワーク対応OSイメージ                           |
| ------- | --------------------------------------------- |
| HPC_OL7 | HPC Cluster Networking Image Oracle Linux 7.9 |
| HPC_OL8 | HPC Cluster Networking Image Oracle Linux 8.6 |
| GPU     | GPU Cluster Networking Image Oracle Linux 7.9 |