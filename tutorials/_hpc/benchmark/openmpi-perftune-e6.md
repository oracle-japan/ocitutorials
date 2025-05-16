---
title: "OpenMPIのMPI集合通信チューニング方法（BM.Standard.E6.256編）"
excerpt: "MPI並列アプリケーションは、MPI通信時間がボトルネックになっている場合そのMPI通信をチューニングすることで性能が向上しますが、ボトルネックのMPI通信が集合通信の場合は、使用する通信アルゴリズムやその切り替えメッセージサイズ等の実行時パラメータ、MPIプロセス分割方法やNUMA nodes per socket等のアプリケーション実行環境まで、様々な要因がその性能に影響します。本パフォーマンス関連Tipsは、MPIの実装にOpenMPIを取り上げ、これが採用するModular Component ArchitectureやUCXの実行時パラメーター、MPIプロセス分割方法やNUMA nodes per socketを組合せて、第5世代AMD EPYCプロセッサを搭載するベア・メタル・シェイプBM.Standard.E6.256でMPI集合通信をチューニングする方法を解説します。"
order: "2210"
layout: single
header:
  teaser: "/hpc/benchmark/openmpi-perftune-e6/are_256_step2.png"
  overlay_image: "/hpc/benchmark/openmpi-perftune-e6/are_256_step2.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

オープンソースのMPI実装である **[OpenMPI](https://www.open-mpi.org/)** は、  **[Modular Component Architecture](https://docs.open-mpi.org/en/v5.0.x/mca.html)** （以降 **MCA** と呼称します。）を採用することで、ビルド時に組み込むコンポーネントを介して集合通信を含む多彩な機能を提供し、この **MCA** パラメータにはMPI集合通信性能に影響するものがあります。  
特に集合通信の高速化を意識して開発されている **[HCOLL](https://docs.nvidia.com/networking/display/hpcxv223/hcoll)** や **[Unified Collective Communication](https://github.com/openucx/ucc)** （以降 **UCC** と呼称します。）を使用することで、集合通信を高速化することが可能です。

また **OpenMPI** は、高帯域・低遅延のMPIプロセス間通信を実現するためにその通信フレームワークに **[UCX](https://openucx.org/)** を採用し、この **UCX** のパラメータにもMPI集合通信性能に影響するパラメータが存在します。

またMPI集合通信は、ノード内並列では実質的にメモリコピーとなるため、メモリ性能に影響するMPIプロセスのコア割当てや **NUMA nodes per socket** （以降 **NPS** と呼称します。）もその性能に影響します。

以上を踏まえて本パフォーマンス関連Tipsは、第5世代  **AMD EPYC** プロセッサを搭載するベア・メタル・シェイプ **[BM.Standard.E6.256](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** に於ける **OpenMPI** のMPI集合通信性能にフォーカスし、以下の **計測条件** を組合せたテストケース毎に以下の **実行時パラメータ** を変えてその性能を **[Intel MPI Benchmarks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** で計測し、最適な **実行時パラメータ** の組み合わせを導きます。

[**計測条件**]

- ノード数 ： **1**
- ノード当たりMPIプロセス数 ： **32** ・ **64** ・ **128** ・ **256**
- MPI集合通信関数 ： **Alltoall** ・ **Allgather** ・ **Allreduce**

[**実行時パラメータ**]

- **UCX_RNDV_THRESH** ： **auto** ・ **4kb** ・ **8kb** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb** （※1）
- **coll_hcoll_enable** ： **0** ・ **1** （※2）
- **coll_ucc_enable** ： **0** ・ **1** （※3）
- MPIプロセス分割方法 ： ブロック分割・サイクリック分割（※4）
- **NPS** ：  **1** （以降 **NPS1** と呼称します。）・ **4** （以降 **NPS4** と呼称します。）（※5）

※1） **UCX** のパラメータで、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI通信性能に影響するパラメータとその関連Tips](/ocitutorials/hpc/benchmark/openmpi-perftips/)** の **[3-6. UCX_RNDV_THRESH](/ocitutorials/hpc/benchmark/openmpi-perftips/#3-6-ucx_rndv_thresh)** を参照してください。  
※2） **MCA** のパラメータで、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI通信性能に影響するパラメータとその関連Tips](/ocitutorials/hpc/benchmark/openmpi-perftips/)** の **[3-1. coll_hcoll_enable](/ocitutorials/hpc/benchmark/openmpi-perftips/#3-1-coll_hcoll_enable)** を参照してください。  
※3） **MCA** のパラメータで、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI通信性能に影響するパラメータとその関連Tips](/ocitutorials/hpc/benchmark/openmpi-perftips/)** の **[3-9. coll_ucc_enable](/ocitutorials/hpc/benchmark/openmpi-perftips/#3-9-coll_ucc_enable)** を参照してください。  
※4）NUMAノードに対するMPIプロセスの分割方法で、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスを考慮したプロセス・スレッドのコア割当て指定方法（BM.Standard.E6.256編）](/ocitutorials/hpc/benchmark/cpu-binding-e6/)** を参照してください。  
※5）**NPS** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

また本パフォーマンス関連Tipsの検証は、以下の実行環境で実施しています。

[実行環境]

- シェイプ： **BM.Standard.E6.256** （  **Simultanious Multi Threading** （以降 **SMT** と呼称します。）無効（※6））
- OS： **[プラットフォーム・イメージ](/ocitutorials/hpc/#5-17-プラットフォームイメージ)** **[Oracle-Linux-9.5-2025.04.16-0](https://docs.oracle.com/en-us/iaas/images/oracle-linux-9x/oracle-linux-9-5-2025-04-16-0.htm)**
- **OpenMPI** ： 5.0.6（※7）
- **Intel MPI Benchmarks** ： 2021.7（※7）
- **HCOLL** ： **[HPC-X](https://developer.nvidia.com/networking/hpc-x)** 2.22.1に含まれる **HCOLL**
- **UCC** ： 1.3.0（※7）

※6） **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。  
※7） **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法](/ocitutorials/hpc/tech-knowhow/build-oraclelinux-hpcenv/)** に従って構築された **OpenMPI** 、 **Intel MPI Benchmarks** 、及び **UCC** です。

また **Intel MPI Benchmarks** の計測は、以下の実行時オプションを指定して起動します。

```sh
$ IMB-MPI1 -msglog 0:xx -mem 4.1G -off_cache 512,64 -npmin num_of_procs alltoall/allgather/allreduce
```

ここで計測するメッセージサイズの上限（ **xx** ）は、MPI集合通信関数とノード当たりMPIプロセス数に応じて以下の値を使用します。  
この設定値は、計測可能な最大値から決定しています。

|               | 24 | 48| 96| 192|
| :-----------: | :--: | :--: | :--: | ---- |
| **Alltoall**  | 25   | 24   | 23    | 22    |
| **Allgather** | 25   | 24   | 23    | 22    |
| **Allreduce** | 30   | 30   | 30    | 30    |

また **Intel MPI Benchmarks** の計測は、テストケース毎に5回実施し、その最大値と最小値を除く3回の算術平均をその結果とします。

以降では、以下 **計測条件** の順に解説します。

1. **[36 MPIプロセス](#1-32-mpiプロセス)**
2. **[64 MPIプロセス](#2-64-mpiプロセス)**
3. **[128 MPIプロセス](#3-128-mpiプロセス)**
4. **[256 MPIプロセス](#4-256-mpiプロセス)**

***
# 1. 32 MPIプロセス

## 1-0. 概要

本章は、1ノードに32 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証し、その結果を考察します。

## 1-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** と集合通信コンポーネントの組合せ毎に示しています。

![Alltoall 32 processes NPS1 no coll](ata_32_n1_no.png)

![Alltoall 32 processes NPS1 UCC](ata_32_n1_uc.png)

![Alltoall 32 processes NPS1 HCOLL](ata_32_n1_hc.png)

![Alltoall 32 processes NPS4 no coll](ata_32_n4_no.png)

![Alltoall 32 processes NPS4 UCC](ata_32_n4_uc.png)

![Alltoall 32 processes NPS4 HCOLL](ata_32_n4_hc.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** と集合通信コンポーネントの各組合せを比較したものが以下のグラフです。  

![Alltoall 32 processes](ata_32.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり32KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- **UCC** は512KB以上で性能向上
- **HCOLL** は32KB以上で大幅に性能低下

## 1-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** と集合通信コンポーネントの組合せ毎に示しています。

![Allgather 32 processes NPS1 no coll](aga_32_n1_no.png)

![Allgather 32 processes NPS1 UCC](aga_32_n1_uc.png)

![Allgather 32 processes NPS1 HCOLL](aga_32_n1_hc.png)

![Allgather 32 processes NPS4 no coll](aga_32_n4_no.png)

![Allgather 32 processes NPS4 UCC](aga_32_n4_uc.png)

![Allgather 32 processes NPS4 HCOLL](aga_32_n4_hc.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** と集合通信コンポーネントの各組合せを比較したものが以下のグラフです。  

![Allgather 32 processes](aga_32.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり32KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は **NPS4**が有利
- **UCC** は512B以下で性能が低下
- **HCOLL** は128Bから4KBで性能が向上するが16B以下と16KB以上で性能が低下

## 1-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** と集合通信コンポーネントの組合せ毎に示しています。

![Allreduce 32 processes NPS1 no coll](are_32_n1_no.png)

![Allreduce 32 processes NPS1 UCC](are_32_n1_uc.png)

![Allreduce 32 processes NPS1 HCOLL](are_32_n1_hc.png)

![Allreduce 32 processes NPS4 no coll](are_32_n4_no.png)

![Allreduce 32 processes NPS4 UCC](are_32_n4_uc.png)

![Allreduce 32 processes NPS4 HCOLL](are_32_n4_hc.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** と集合通信コンポーネントの各組合せを比較したものが以下のグラフです。  

![Allreduce 32 processes](are_32.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり32KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は **HCOLL** の2KB以下で **NPS4** が有利でそれ以外は有意な差無し
- **UCC** は64B以下で性能が低下し64MB以上で性能が向上
- **HCOLL** は32KB以下で性能が向上し256KB以上で性能が低下

***
# 2. 64 MPIプロセス

## 2-0. 概要

本章は、1ノードに64 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証し、その結果を考察します。

## 2-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Alltoall 64 processes NPS1 no coll](ata_64_n1_bl_no.png)

![Alltoall 64 processes NPS1 UCC](ata_64_n1_bl_uc.png)

![Alltoall 64 processes NPS1 HCOLL](ata_64_n1_bl_hc.png)

![Alltoall 64 processes NPS1 no coll](ata_64_n1_cy_no.png)

![Alltoall 64 processes NPS1 UCC](ata_64_n1_cy_uc.png)

![Alltoall 64 processes NPS1 HCOLL](ata_64_n1_cy_hc.png)

![Alltoall 64 processes NPS4 no coll](ata_64_n4_bl_no.png)

![Alltoall 64 processes NPS4 UCC](ata_64_n4_bl_uc.png)

![Alltoall 64 processes NPS4 HCOLL](ata_64_n4_bl_hc.png)

![Alltoall 64 processes NPS4 no coll](ata_64_n4_cy_no.png)

![Alltoall 64 processes NPS4 UCC](ata_64_n4_cy_uc.png)

![Alltoall 64 processes NPS4 HCOLL](ata_64_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Alltoall 64 processes](ata_64_step1.png)

以上より、 **NPS** とMPIプロセス分割方法に差は無いため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Alltoall 64 processes](ata_64_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり32KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** とMPIプロセス分割方法は有意な差無し
- **UCC** は有意な差無し
- **HCOLL** は32KB以上で性能低下が顕著

## 2-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allgather 64 processes NPS1 no coll](aga_64_n1_bl_no.png)

![Allgather 64 processes NPS1 UCC](aga_64_n1_bl_uc.png)

![Allgather 64 processes NPS1 HCOLL](aga_64_n1_bl_hc.png)

![Allgather 64 processes NPS1 no coll](aga_64_n1_cy_no.png)

![Allgather 64 processes NPS1 UCC](aga_64_n1_cy_uc.png)

![Allgather 64 processes NPS1 HCOLL](aga_64_n1_cy_hc.png)

![Allgather 64 processes NPS4 no coll](aga_64_n4_bl_no.png)

![Allgather 64 processes NPS4 UCC](aga_64_n4_bl_uc.png)

![Allgather 64 processes NPS4 HCOLL](aga_64_n4_bl_hc.png)

![Allgather 64 processes NPS4 no coll](aga_64_n4_cy_no.png)

![Allgather 64 processes NPS4 UCC](aga_64_n4_cy_uc.png)

![Allgather 64 processes NPS4 HCOLL](aga_64_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allgather 64 processes](aga_64_step1.png)

以上より、 **NPS4** とブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allgather 64 processes](aga_64_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり128KBが最も性能が良い
- **HCOLL** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり128KBが最も性能が良い
- **NPS** は **NPS4** が有利
- MPIプロセス分割方法はブロック分割が有利
- **UCC** はほぼ全域のメッセージサイズで性能が低下
- **HCOLL** は64Bから8KBのメッセージサイズで性能向上がみられるが64KB以上のメッセージサイズで性能が低下

## 2-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allreduce 64 processes NPS1 no coll](are_64_n1_bl_no.png)

![Allreduce 64 processes NPS1 UCC](are_64_n1_bl_uc.png)

![Allreduce 64 processes NPS1 HCOLL](are_64_n1_bl_hc.png)

![Allreduce 64 processes NPS1 no coll](are_64_n1_cy_no.png)

![Allreduce 64 processes NPS1 UCC](are_64_n1_cy_uc.png)

![Allreduce 64 processes NPS1 HCOLL](are_64_n1_cy_hc.png)

![Allreduce 64 processes NPS4 no coll](are_64_n4_bl_no.png)

![Allreduce 64 processes NPS4 UCC](are_64_n4_bl_uc.png)

![Allreduce 64 processes NPS4 HCOLL](are_64_n4_bl_hc.png)

![Allreduce 64 processes NPS4 no coll](are_64_n4_cy_no.png)

![Allreduce 64 processes NPS4 UCC](are_64_n4_cy_uc.png)

![Allreduce 64 processes NPS4 HCOLL](are_64_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **64kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allreduce 64 processes](are_64_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allreduce 64 processes](are_64_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり64KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法は256KB以上4MB以下のメッセージサイズでブロック分割が有利
- **UCC** は256B以下のメッセージサイズで性能が低下し4KB以上128KB以下と32MB以上のメッセージサイズで性能が向上
- **HCOLL** は512B以上128KB以下のメッセージサイズで性能が向上し8MB以上のメッセージサイズで性能が低下

***
# 3. 128 MPIプロセス

## 3-0. 概要

本章は、1ノードに128 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証し、その結果を考察します。

## 3-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Alltoall 128 processes NPS1 no coll](ata_128_n1_bl_no.png)

![Alltoall 128 processes NPS1 UCC](ata_128_n1_bl_uc.png)

![Alltoall 128 processes NPS1 HCOLL](ata_128_n1_bl_hc.png)

![Alltoall 128 processes NPS1 no coll](ata_128_n1_cy_no.png)

![Alltoall 128 processes NPS1 UCC](ata_128_n1_cy_uc.png)

![Alltoall 128 processes NPS1 HCOLL](ata_128_n1_cy_hc.png)

![Alltoall 128 processes NPS4 no coll](ata_128_n4_bl_no.png)

![Alltoall 128 processes NPS4 UCC](ata_128_n4_bl_uc.png)

![Alltoall 128 processes NPS4 HCOLL](ata_128_n4_bl_hc.png)

![Alltoall 128 processes NPS4 no coll](ata_128_n4_cy_no.png)

![Alltoall 128 processes NPS4 UCC](ata_128_n4_cy_uc.png)

![Alltoall 128 processes NPS4 HCOLL](ata_128_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Alltoall 128 processes](ata_128_step1.png)

以上より、 **NPS** とMPIプロセス分割方法に差は無いため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Alltoall 128 processes](ata_128_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** とMPIプロセス分割方法は有意な差無し
- **UCC** は8Bから128Bで性能が向上し8KBから32KBで性能が低下
- **HCOLL** は16KB以上で性能低下が顕著

## 3-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allgather 128 processes NPS1 no coll](aga_128_n1_bl_no.png)

![Allgather 128 processes NPS1 UCC](aga_128_n1_bl_uc.png)

![Allgather 128 processes NPS1 HCOLL](aga_128_n1_bl_hc.png)

![Allgather 128 processes NPS1 no coll](aga_128_n1_cy_no.png)

![Allgather 128 processes NPS1 UCC](aga_128_n1_cy_uc.png)

![Allgather 128 processes NPS1 HCOLL](aga_128_n1_cy_hc.png)

![Allgather 128 processes NPS4 no coll](aga_128_n4_bl_no.png)

![Allgather 128 processes NPS4 UCC](aga_128_n4_bl_uc.png)

![Allgather 128 processes NPS4 HCOLL](aga_128_n4_bl_hc.png)

![Allgather 128 processes NPS4 no coll](aga_128_n4_cy_no.png)

![Allgather 128 processes NPS4 UCC](aga_128_n4_cy_uc.png)

![Allgather 128 processes NPS4 HCOLL](aga_128_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allgather 128 processes](aga_128_step1.png)

以上より、 **NPS4** とブロック分割が全体的に有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allgather 128 processes](aga_128_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり128KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は **NPS4** が有利
- MPIプロセス分割方法は256B以下でサイクリック分割が有利で512B以上でブロック分割が有利
- **UCC** はメッセージサイズ全域にわたって性能が低下
- **HCOLL** は32Bから4KBのメッセージサイズで性能向上

## 3-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allreduce 128 processes NPS1 no coll](are_128_n1_bl_no.png)

![Allreduce 128 processes NPS1 UCC](are_128_n1_bl_uc.png)

![Allreduce 128 processes NPS1 HCOLL](are_128_n1_bl_hc.png)

![Allreduce 128 processes NPS1 no coll](are_128_n1_cy_no.png)

![Allreduce 128 processes NPS1 UCC](are_128_n1_cy_uc.png)

![Allreduce 128 processes NPS1 HCOLL](are_128_n1_cy_hc.png)

![Allreduce 128 processes NPS4 no coll](are_128_n4_bl_no.png)

![Allreduce 128 processes NPS4 UCC](are_128_n4_bl_uc.png)

![Allreduce 128 processes NPS4 HCOLL](are_128_n4_bl_hc.png)

![Allreduce 128 processes NPS4 no coll](are_128_n4_cy_no.png)

![Allreduce 128 processes NPS4 UCC](are_128_n4_cy_uc.png)

![Allreduce 128 processes NPS4 HCOLL](are_128_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **64kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allreduce 128 processes](are_128_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allreduce 128 processes](are_128_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり64KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はブロック分割が有利
- **UCC** は4KB以上128KB以下のメッセージサイズと4MB以上のメッセージサイズで性能が向上
- **HCOLL** は128KB以下のメッセージサイズで性能が大幅に向上し32MB以上のメッセージサイズで性能が低下

***
# 4. 256 MPIプロセス

## 4-0. 概要

本章は、1ノードに256 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証し、その結果を考察します。

## 4-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Alltoall 256 processes NPS1 no coll](ata_256_n1_bl_no.png)

![Alltoall 256 processes NPS1 UCC](ata_256_n1_bl_uc.png)

![Alltoall 256 processes NPS1 HCOLL](ata_256_n1_bl_hc.png)

![Alltoall 256 processes NPS1 no coll](ata_256_n1_cy_no.png)

![Alltoall 256 processes NPS1 UCC](ata_256_n1_cy_uc.png)

![Alltoall 256 processes NPS1 HCOLL](ata_256_n1_cy_hc.png)

![Alltoall 256 processes NPS4 no coll](ata_256_n4_bl_no.png)

![Alltoall 256 processes NPS4 UCC](ata_256_n4_bl_uc.png)

![Alltoall 256 processes NPS4 HCOLL](ata_256_n4_bl_hc.png)

![Alltoall 256 processes NPS4 no coll](ata_256_n4_cy_no.png)

![Alltoall 256 processes NPS4 UCC](ata_256_n4_cy_uc.png)

![Alltoall 256 processes NPS4 HCOLL](ata_256_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Alltoall 256 processes](ata_256_step1.png)

以上より、 **NPS** とMPIプロセス分割方法に差は無いため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Alltoall 256 processes](ata_256_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響軽微
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** とMPIプロセス分割方法は有意な差無し
- **UCC** は有意な差無し
- **HCOLL** は8KB以上のメッセージサイズで大幅に性能低下

## 4-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allgather 256 processes NPS1 no coll](aga_256_n1_bl_no.png)

![Allgather 256 processes NPS1 UCC](aga_256_n1_bl_uc.png)

![Allgather 256 processes NPS1 HCOLL](aga_256_n1_bl_hc.png)

![Allgather 256 processes NPS1 no coll](aga_256_n1_cy_no.png)

![Allgather 256 processes NPS1 UCC](aga_256_n1_cy_uc.png)

![Allgather 256 processes NPS1 HCOLL](aga_256_n1_cy_hc.png)

![Allgather 256 processes NPS4 no coll](aga_256_n4_bl_no.png)

![Allgather 256 processes NPS4 UCC](aga_256_n4_bl_uc.png)

![Allgather 256 processes NPS4 HCOLL](aga_256_n4_bl_hc.png)

![Allgather 256 processes NPS4 no coll](aga_256_n4_cy_no.png)

![Allgather 256 processes NPS4 UCC](aga_256_n4_cy_uc.png)

![Allgather 256 processes NPS4 HCOLL](aga_256_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allgather 256 processes](aga_256_step1.png)

以上より、 **NPS4** とブロック分割が全体的に有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allgather 256 processes](aga_256_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響軽微
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり128KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は **NPS4** が有利
- MPIプロセス分割方法は512B以下でサイクリック分割が有利で1KB以上でブロック分割が有利
- **UCC** はメッセージサイズ全域にわたって性能が低下
- **HCOLL** は16Bから512Bのメッセージサイズで性能向上

## 4-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allreduce 256 processes NPS1 no coll](are_256_n1_bl_no.png)

![Allreduce 256 processes NPS1 UCC](are_256_n1_bl_uc.png)

![Allreduce 256 processes NPS1 HCOLL](are_256_n1_bl_hc.png)

![Allreduce 256 processes NPS1 no coll](are_256_n1_cy_no.png)

![Allreduce 256 processes NPS1 UCC](are_256_n1_cy_uc.png)

![Allreduce 256 processes NPS1 HCOLL](are_256_n1_cy_hc.png)

![Allreduce 256 processes NPS4 no coll](are_256_n4_bl_no.png)

![Allreduce 256 processes NPS4 UCC](are_256_n4_bl_uc.png)

![Allreduce 256 processes NPS4 HCOLL](are_256_n4_bl_hc.png)

![Allreduce 256 processes NPS4 no coll](are_256_n4_cy_no.png)

![Allreduce 256 processes NPS4 UCC](are_256_n4_cy_uc.png)

![Allreduce 256 processes NPS4 HCOLL](are_256_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allreduce 256 processes](are_256_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allreduce 256 processes](are_256_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はブロック分割が有利
- **UCC** は4KB以下のメッセージサイズで性能が低下し4MB以上のメッセージサイズで性能向上が向上
- **HCOLL** は4KB以下のメッセージサイズで性能が向上