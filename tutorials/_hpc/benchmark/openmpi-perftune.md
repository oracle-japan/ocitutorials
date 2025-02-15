---
title: "OpenMPIのMPI集合通信チューニング方法"
excerpt: "MPI並列アプリケーションは、MPI通信時間がボトルネックになっている場合そのMPI通信をチューニングすることで性能が向上しますが、ボトルネックのMPI通信が集合通信の場合は、使用する通信アルゴリズムやその切り替えメッセージサイズ等の実行時パラメータ、MPIプロセス分割方法やNUMA nodes per socket等のアプリケーション実行環境まで、様々な要因がその性能に影響します。本テクニカルTipsは、MPIの実装にOpenMPIを取り上げ、これが採用するModular Component ArchitectureやUCXの実行時パラメーター、MPIプロセス分割方法やNUMA nodes per socketを組合せて、MPI集合通信をチューニングする方法を解説します。"
order: "227"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

オープンソースのMPI実装である **[OpenMPI](https://www.open-mpi.org/)** は、  **[Modular Component Architecture](https://docs.open-mpi.org/en/v5.0.x/mca.html)** （以降 **MCA** と呼称します。）を採用し、ビルド時に組み込むコンポーネントを介して多彩な機能を提供する設計となっており、この **MCA** が用意するパラメータには、MPI集合通信性能に影響するものがあります。

また **OpenMPI** は、高帯域・低遅延のMPIプロセス間通信を実現する通信フレームワークである **[UCX](https://openucx.org/)** を採用し、この **UCX** のパラメータにもMPI集合通信性能に影響するパラメータが多数存在します。

またMPI集合通信は、ノード内並列では実質的にメモリコピーとなるため、メモリ性能に影響するMPIプロセスのコア割当てや **NUMA nodes per socket** （以降 **NPS** と呼称します。）もその性能に影響します。

以上を踏まえて本パフォーマンス関連Tipsは、HPCワークロード向けベアメタルシェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** に於ける **OpenMPI** のMPI集合通信性能にフォーカスし、以下の **計測条件** を組合せた各ケース毎に以下の **実行時パラメータ** を変えてその性能を **[Intel MPI Benchmarks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** で計測し、最適な **実行時パラメータ** の組み合わせを導きます。

[**計測条件**]

- ノード当たりMPIプロセス数 ： **8** ・ **16** ・ **32** ・ **36**
- ノード数 ： **1** ・ **2** （近日公開予定）・ **4** （近日公開予定）・ **8** （近日公開予定）・ **16** （近日公開予定）
- MPI集合通信関数 ： **Alltoall** ・ **Allgather** ・ **Allreduce**

[**実行時パラメータ**]

- **UCX_RNDV_THRESH** ： **auto** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb** （※1）
- MPIプロセス分割方法 ： ブロック分割・サイクリック分割（※2）
- **NPS** ：  **1** （以降 **NPS1** と呼称します。）・ **2** （以降 **NPS2** と呼称します。）（※3）

※1） **UCX** のパラメータで、詳細は **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[OpenMPIのMPI通信性能に影響するパラメータとその関連Tips](/ocitutorials/hpc/benchmark/openmpi-perftips/)** の **[3-5. UCX_RNDV_THRESH](/ocitutorials/hpc/benchmark/openmpi-perftips/#3-5-ucx_rndv_thresh)** を参照してください。  
※2）NUMAノードに対するMPIプロセスの分割方法で、詳細は **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[パフォーマンスを考慮したプロセス・スレッドのコア割当て指定方法](/ocitutorials/hpc/benchmark/cpu-binding/)** を参照してください。  
※3）**NPS** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

また本パフォーマンス関連Tipsの検証は、以下の実行環境で実施しています。

[実行環境]
- シェイプ： **BM.Optimized3.36** （  **Simultanious Multi Threading** （以降 **SMT** と呼称します。）無効（※4））
- ノード間接続 ： **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)**  
- OS： **Oracle Linux** 8.10ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※5）
- **OpenMPI** ： 5.0.6（※6）
- **Intel MPI Benchmarks** ： 2021.7

※4）**SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。  
※5）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** です。  
※6） **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従って構築された **OpenMPI** です。

また **Intel MPI Benchmarks** は、 **numactl** コマンドを介して以下の実行時オプションを指定して起動し、

[**Alltoall**]
```sh
$ numactl -l IMB-MPI1 -msglog 0:25 -mem 2.3G -off_cache 39,64 -npmin num_of_procs alltoall
```

[**Allgather**]
```sh
$ numactl -l IMB-MPI1 -msglog 0:25 -mem 2.3G -off_cache 39,64 -npmin num_of_procs allgather
```

[**Allreduce**]
```sh
$ numactl -l IMB-MPI1 -msglog 0:30 -mem 2.3G -off_cache 39,64 -npmin num_of_procs allreduce
```

1種類の計測につき5回計測してその最大値と最小値を除く3回の計測結果の算術平均をその結果としています。

以降では、以下の **計測条件** の順に解説します。

1. **[1ノード8 MPIプロセス](#1--1ノード8-mpiプロセス)**
2. **[1ノード16 MPIプロセス](#2--1ノード16-mpiプロセス)**
3. **[1ノード32 MPIプロセス](#3--1ノード32-mpiプロセス)**
4. **[1ノード36 MPIプロセス](#4--1ノード36-mpiプロセス)**

***
# 1.  1ノード8 MPIプロセス

## 1-0. 概要

本章は、1ノードに8 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数ごとに検証します。

下表は、MPI集合通信関数毎の最適な **UCX_RNDV_THRESH** を示しており、この設定値を使用することによりデフォルト値の **auto** に対する性能向上が見られます。  
特に **Alltoall** は8KBから128KB、 **Allreduce** は32KBから16MBのメッセージサイズに於いて、大きく性能が向上します。

| MPI集合通信関数 | UCX_RNDV_THRESH |
| :-------: | -------------: |
| **Alltoall**  | 32kb            |
| **Allgather** | 64kb            |
| **Allreduce** | 128kb           |

その他の **実行時パラメータ** である **NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

## 1-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Alltoall** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Alltoall 1 node 8 processes NPS1 Block](ata_01_08_n1_bl.png)

![Alltoall 1 node 8 processes NPS1 Cyclic](ata_01_08_n1_cy.png)

![Alltoall 1 node 8 processes NPS2 Block](ata_01_08_n2_bl.png)

![Alltoall 1 node 8 processes NPS2 Cyclic](ata_01_08_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Alltoall 1 node 8 processes Small message](ata_01_08_S.png)

![Alltoall 1 node 8 processes Medium message](ata_01_08_M.png)

![Alltoall 1 node 8 processes Medium Large message](ata_01_08_ML.png)

![Alltoall 1 node 8 processes Large message](ata_01_08_L.png)

## 1-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Allgather** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Allgather 1 node 8 processes NPS1 Block](aga_01_08_n1_bl.png)

![Allgather 1 node 8 processes NPS1 Cyclic](aga_01_08_n1_cy.png)

![Allgather 1 node 8 processes NPS2 Block](aga_01_08_n2_bl.png)

![Allgather 1 node 8 processes NPS2 Cyclic](aga_01_08_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **64kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Allgather 1 node 8 processes Small message](aga_01_08_S.png)

![Allgather 1 node 8 processes Medium message](aga_01_08_M.png)

![Allgather 1 node 8 processes Medium Large message](aga_01_08_ML.png)

![Allgather 1 node 8 processes Large message](aga_01_08_L.png)

## 1-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Allreduce** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Allreduce 1 node 8 processes NPS1 Block](are_01_08_n1_bl.png)

![Allreduce 1 node 8 processes NPS1 Cyclic](are_01_08_n1_cy.png)

![Allreduce 1 node 8 processes NPS2 Block](are_01_08_n2_bl.png)

![Allreduce 1 node 8 processes NPS2 Cyclic](are_01_08_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Allreduce 1 node 8 processes Small message](are_01_08_S.png)

![Allreduce 1 node 8 processes Medisum message](are_01_08_M.png)

![Allreduce 1 node 8 processes Medisum Large message](are_01_08_ML.png)

![Allreduce 1 node 8 processes Large message](are_01_08_L.png)

***
# 2.  1ノード16 MPIプロセス

## 2-0. 概要

本章は、1ノードに16 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数ごとに検証します。

下表は、MPI集合通信関数毎の最適な **UCX_RNDV_THRESH** を示しており、この設定値を使用することによりデフォルト値の **auto** に対する性能向上が見られます。  
特に **Alltoall** は8KBから128KB、 **Allreduce** は64KBから16MBのメッセージサイズに於いて、大きく性能が向上します。

| MPI集合通信関数 | UCX_RNDV_THRESH |
| :-------: | -------------: |
| **Alltoall**  | 32kb            |
| **Allgather** | 32kb            |
| **Allreduce** | 128kb           |

その他の **実行時パラメータ** である **NPS** とMPIプロセス分割方法は、 **Alltoall** のメッセージサイズが大きな領域で **NPS1** が **NPS2** に対して優位となりますが、それ以外では有意な差はみられません。

## 2-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Alltoall** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Alltoall 1 node 16 processes NPS1 Block](ata_01_16_n1_bl.png)

![Alltoall 1 node 16 processes NPS1 Cyclic](ata_01_16_n1_cy.png)

![Alltoall 1 node 16 processes NPS2 Block](ata_01_16_n2_bl.png)

![Alltoall 1 node 16 processes NPS2 Cyclic](ata_01_16_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Alltoall 1 node 16 processes Small message](ata_01_16_S.png)

![Alltoall 1 node 16 processes Medium message](ata_01_16_M.png)

![Alltoall 1 node 16 processes Medium Large message](ata_01_16_ML.png)

![Alltoall 1 node 16 processes Large message](ata_01_16_L.png)

## 2-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Allgather** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Allgather 1 node 16 processes NPS1 Block](aga_01_16_n1_bl.png)

![Allgather 1 node 16 processes NPS1 Cyclic](aga_01_16_n1_cy.png)

![Allgather 1 node 16 processes NPS2 Block](aga_01_16_n2_bl.png)

![Allgather 1 node 16 processes NPS2 Cyclic](aga_01_16_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Allgather 1 node 16 processes Small message](aga_01_16_S.png)

![Allgather 1 node 16 processes Medium message](aga_01_16_M.png)

![Allgather 1 node 16 processes Medium Large message](aga_01_16_ML.png)

![Allgather 1 node 16 processes Large message](aga_01_16_L.png)

## 2-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Allreduce** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Allreduce 1 node 16 processes NPS1 Block](are_01_16_n1_bl.png)

![Allreduce 1 node 16 processes NPS1 Cyclic](are_01_16_n1_cy.png)

![Allreduce 1 node 16 processes NPS2 Block](are_01_16_n2_bl.png)

![Allreduce 1 node 16 processes NPS2 Cyclic](are_01_16_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Allreduce 1 node 16 processes Small message](are_01_16_S.png)

![Allreduce 1 node 16 processes Medisum message](are_01_16_M.png)

![Allreduce 1 node 16 processes Medisum Large message](are_01_16_ML.png)

![Allreduce 1 node 16 processes Large message](are_01_16_L.png)

***
# 3.  1ノード32 MPIプロセス

## 3-0. 概要

本章は、1ノードに32 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数ごとに検証します。

下表は、MPI集合通信関数毎の最適な **UCX_RNDV_THRESH** を示しており、この設定値を使用することによりデフォルト値の **auto** に対する性能向上が見られます。  
特に **Alltoall** は8KBから512KB、 **Allreduce** は128KBから16MBのメッセージサイズに於いて、大きく性能が向上します。

| MPI集合通信関数 | UCX_RNDV_THRESH |
| :-------: | -------------: |
| **Alltoall**  | 16kb            |
| **Allgather** | 16kb            |
| **Allreduce** | 128kb           |

その他の **実行時パラメータ** である **NPS** とMPIプロセス分割方法は、以下の傾向がみられます。

- **Alltoall** の2MB以上のメッセージサイズで **NPS1** が **NPS2** に対して優位
- **Allgather** の32MBメッセージサイズでブロック分割がサイクリック分割に対して優位

## 3-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Alltoall** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Alltoall 1 node 32 processes NPS1 Block](ata_01_32_n1_bl.png)

![Alltoall 1 node 32 processes NPS1 Cyclic](ata_01_32_n1_cy.png)

![Alltoall 1 node 32 processes NPS2 Block](ata_01_32_n2_bl.png)

![Alltoall 1 node 32 processes NPS2 Cyclic](ata_01_32_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Alltoall 1 node 32 processes Small message](ata_01_32_S.png)

![Alltoall 1 node 32 processes Medium message](ata_01_32_M.png)

![Alltoall 1 node 32 processes Medium Large message](ata_01_32_ML.png)

![Alltoall 1 node 32 processes Large message](ata_01_32_L.png)

## 3-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Allgather** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Allgather 1 node 32 processes NPS1 Block](aga_01_32_n1_bl.png)

![Allgather 1 node 32 processes NPS1 Cyclic](aga_01_32_n1_cy.png)

![Allgather 1 node 32 processes NPS2 Block](aga_01_32_n2_bl.png)

![Allgather 1 node 32 processes NPS2 Cyclic](aga_01_32_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Allgather 1 node 32 processes Small message](aga_01_32_S.png)

![Allgather 1 node 32 processes Medium message](aga_01_32_M.png)

![Allgather 1 node 32 processes Medium Large message](aga_01_32_ML.png)

![Allgather 1 node 32 processes Large message](aga_01_32_L.png)

## 3-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Allreduce** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Allreduce 1 node 32 processes NPS1 Block](are_01_32_n1_bl.png)

![Allreduce 1 node 32 processes NPS1 Cyclic](are_01_32_n1_cy.png)

![Allreduce 1 node 32 processes NPS2 Block](are_01_32_n2_bl.png)

![Allreduce 1 node 32 processes NPS2 Cyclic](are_01_32_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Allreduce 1 node 32 processes Small message](are_01_32_S.png)

![Allreduce 1 node 32 processes Medisum message](are_01_32_M.png)

![Allreduce 1 node 32 processes Medisum Large message](are_01_32_ML.png)

![Allreduce 1 node 32 processes Large message](are_01_32_L.png)

***
# 4.  1ノード36 MPIプロセス

## 4-0. 概要

本章は、1ノードに36 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数ごとに検証します。

下表は、MPI集合通信関数毎の最適な **UCX_RNDV_THRESH** を示しており、この設定値を使用することによりデフォルト値の **auto** に対する性能向上が見られます。  
特に **Alltoall** は8KBから256KB、 **Allreduce** は64KBから16MBのメッセージサイズに於いて、大きく性能が向上します。

| MPI集合通信関数 | UCX_RNDV_THRESH |
| :-------: | -------------: |
| **Alltoall**  | 16kb            |
| **Allgather** | 16kb            |
| **Allreduce** | 128kb           |

その他の **実行時パラメータ** である **NPS** とMPIプロセス分割方法は、以下の傾向がみられます。

- **Allgather** の32MBメッセージサイズでブロック分割がサイクリック分割に対して優位
- **Allreduce** の1MBから8MBのメッセージサイズで **NPS1** が **NPS2** に対して優位

## 4-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Alltoall** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Alltoall 1 node 36 processes NPS1 Block](ata_01_36_n1_bl.png)

![Alltoall 1 node 36 processes NPS1 Cyclic](ata_01_36_n1_cy.png)

![Alltoall 1 node 36 processes NPS2 Block](ata_01_36_n2_bl.png)

![Alltoall 1 node 36 processes NPS2 Cyclic](ata_01_36_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Alltoall 1 node 36 processes Small message](ata_01_36_S.png)

![Alltoall 1 node 36 processes Medium message](ata_01_36_M.png)

![Alltoall 1 node 36 processes Medium Large message](ata_01_36_ML.png)

![Alltoall 1 node 36 processes Large message](ata_01_36_L.png)

## 4-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Allgather** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Allgather 1 node 36 processes NPS1 Block](aga_01_36_n1_bl.png)

![Allgather 1 node 36 processes NPS1 Cyclic](aga_01_36_n1_cy.png)

![Allgather 1 node 36 processes NPS2 Block](aga_01_36_n2_bl.png)

![Allgather 1 node 36 processes NPS2 Cyclic](aga_01_36_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Allgather 1 node 36 processes Small message](aga_01_36_S.png)

![Allgather 1 node 36 processes Medium message](aga_01_36_M.png)

![Allgather 1 node 36 processes Medium Large message](aga_01_36_ML.png)

![Allgather 1 node 36 processes Large message](aga_01_36_L.png)

## 3-4. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を振ったときの **Allreduce** の結果を、 **NPS** とMPIプロセス分割方法の各組合せ毎に示しています。

![Allreduce 1 node 36 processes NPS1 Block](are_01_36_n1_bl.png)

![Allreduce 1 node 36 processes NPS1 Cyclic](are_01_36_n1_cy.png)

![Allreduce 1 node 36 processes NPS2 Block](are_01_36_n2_bl.png)

![Allreduce 1 node 36 processes NPS2 Cyclic](are_01_36_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、メッセージサイズをSmall・Medium・Medium Large・Largeの範囲に分けて **NPS** とMPIプロセス分割方法を比較したものが以下のグラフです。

![Allreduce 1 node 36 processes Small message](are_01_36_S.png)

![Allreduce 1 node 36 processes Medisum message](are_01_36_M.png)

![Allreduce 1 node 36 processes Medisum Large message](are_01_36_ML.png)

![Allreduce 1 node 36 processes Large message](are_01_36_L.png)
