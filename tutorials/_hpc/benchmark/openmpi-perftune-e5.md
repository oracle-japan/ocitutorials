---
title: "OpenMPIのMPI集合通信チューニング方法（BM.Standard.E5.192編）"
excerpt: "MPI並列アプリケーションは、MPI通信時間がボトルネックになっている場合そのMPI通信をチューニングすることで性能が向上しますが、ボトルネックのMPI通信が集合通信の場合は、使用する通信アルゴリズムやその切り替えメッセージサイズ等の実行時パラメータ、MPIプロセス分割方法やNUMA nodes per socket等のアプリケーション実行環境まで、様々な要因がその性能に影響します。本パフォーマンス関連Tipsは、MPIの実装にOpenMPIを取り上げ、これが採用するModular Component ArchitectureやUCXの実行時パラメーター、MPIプロセス分割方法やNUMA nodes per socketを組合せて、第4世代AMD EPYCプロセッサを搭載するベア・メタル・シェイプBM.Standard.E5.192でMPI集合通信をチューニングする方法を解説します。"
order: "2209"
layout: single
header:
  teaser: "/hpc/benchmark/openmpi-perftune-e5/are_192_step2.png"
  overlay_image: "/hpc/benchmark/openmpi-perftune-e5/are_192_step2.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

オープンソースのMPI実装である **[OpenMPI](https://www.open-mpi.org/)** は、  **[Modular Component Architecture](https://docs.open-mpi.org/en/v5.0.x/mca.html)** （以降 **MCA** と呼称します。）を採用することで、ビルド時に組み込むコンポーネントを介して集合通信を含む多彩な機能を提供し、この **MCA** パラメータにはMPI集合通信性能に影響するものがあります。  
特にMPI集合通信の高速化を意識して開発されている **[HCOLL](https://docs.nvidia.com/networking/display/hpcxv223/hcoll)** や **[Unified Collective Communication](https://github.com/openucx/ucc)** （以降 **UCC** と呼称します。）は、その特性を理解して適切に利用することで、MPI集合通信性能を大幅に向上させることが可能です。

また **OpenMPI** は、高帯域・低遅延のMPIプロセス間通信を実現するためにその通信フレームワークに **[UCX](https://openucx.org/)** を採用し、この **UCX** のパラメータにもMPI集合通信性能に影響するパラメータが存在します。

またMPI集合通信は、ノード内並列では実質的にメモリコピーとなるため、メモリ性能に影響するMPIプロセスのコア割当てや **NUMA nodes per socket** （以降 **NPS** と呼称します。）もその性能に影響します。

以上を踏まえて本パフォーマンス関連Tipsは、第4世代  **AMD EPYC** プロセッサを搭載するベア・メタル・シェイプ **[BM.Standard.E5.192](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** に於ける **OpenMPI** のMPI集合通信性能にフォーカスし、以下の **計測条件** を組合せたテストケース毎に以下の **実行時パラメータ** を変えてその性能を **[Intel MPI Benchmarks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** で計測し、最適な **実行時パラメータ** の組み合わせを導きます。

[**計測条件**]

- ノード数 ： **1**
- ノード当たりMPIプロセス数 ： **24** ・ **48** ・ **96** ・ **192**
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
※4）NUMAノードに対するMPIプロセスの分割方法で、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスを考慮したプロセス・スレッドのコア割当て指定方法（BM.Standard.E5.192編）](/ocitutorials/hpc/benchmark/cpu-binding-e5/)** を参照してください。  
※5）**NPS** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

また本パフォーマンス関連Tipsの検証は、以下の実行環境で実施しています。

[実行環境]

- シェイプ： **BM.Standard.E5.192** （  **Simultanious Multi Threading** （以降 **SMT** と呼称します。）無効（※6））
- OS： **[プラットフォーム・イメージ](/ocitutorials/hpc/#5-17-プラットフォームイメージ)** **[Oracle-Linux-9.5-2025.02.28-0](https://docs.oracle.com/en-us/iaas/images/oracle-linux-9x/oracle-linux-9-5-2025-02-28-0.htm)**
- **OpenMPI** ： 5.0.6（※7）
- **Intel MPI Benchmarks** ： 2021.7（※7）
- **HCOLL** ： **[HPC-X](https://developer.nvidia.com/networking/hpc-x)** 2.22.1に含まれる **HCOLL**
- **UCC** ： 1.3.0（※7）

※6） **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。  
※7） **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法](/ocitutorials/hpc/tech-knowhow/build-oraclelinux-hpcenv/)** に従って構築された **OpenMPI** 、 **Intel MPI Benchmarks** 、及び **UCC** です。

また **Intel MPI Benchmarks** の計測は、以下の実行時オプションを指定して起動します。

```sh
$ IMB-MPI1 -msglog 0:xx -mem 3.1G -off_cache 384,64 -npmin num_of_procs alltoall/allgather/allreduce
```

ここで計測するメッセージサイズの上限（ **xx** ）は、MPI集合通信関数とノード当たりMPIプロセス数に応じて以下の値を使用します。  
この設定値は、計測可能な最大値から決定しています。

|               | 24 | 48| 96| 192|
| :-----------: | :--: | :--: | :--: | ---- |
| **Alltoall**  | 26   | 25   | 24    | 23    |
| **Allgather** | 26   | 25   | 24    | 23    |
| **Allreduce** | 30   | 30   | 30    | 30    |

また **Intel MPI Benchmarks** の計測は、テストケース毎に5回実施し、その最大値と最小値を除く3回の算術平均をその結果とします。

以降では、以下 **計測条件** の順に解説します。

1. **[24 MPIプロセス](#1-24-mpiプロセス)**
2. **[48 MPIプロセス](#2-48-mpiプロセス)**
3. **[96 MPIプロセス](#3-96-mpiプロセス)**
4. **[192 MPIプロセス](#4-192-mpiプロセス)**

***
# 1. 24 MPIプロセス

## 1-0. 概要

本章は、1ノードに24 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせをMPI集合通信関数毎に検証し、その結果を考察します。

## 1-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** と集合通信コンポーネントの組合せ毎に示しています。

![Alltoall 24 processes NPS1 no coll](ata_24_n1_no.png)

![Alltoall 24 processes NPS1 UCC](ata_24_n1_uc.png)

![Alltoall 24 processes NPS1 HCOLL](ata_24_n1_hc.png)

![Alltoall 24 processes NPS4 no coll](ata_24_n4_no.png)

![Alltoall 24 processes NPS4 UCC](ata_24_n4_uc.png)

![Alltoall 24 processes NPS4 HCOLL](ata_24_n4_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** と集合通信コンポーネントの各組合せを比較したものが以下のグラフです。  

![Alltoall 24 processes](ata_24.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- **UCC** は128B以下で性能向上が見られるがミドルメッセージサイズで性能低下有り
- **HCOLL** は8KB以上で性能低下が顕著

## 1-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** と集合通信コンポーネントの組合せ毎に示しています。

![Allgather 24 processes NPS1 no coll](aga_24_n1_no.png)

![Allgather 24 processes NPS1 UCC](aga_24_n1_uc.png)

![Allgather 24 processes NPS1 HCOLL](aga_24_n1_hc.png)

![Allgather 24 processes NPS4 no coll](aga_24_n4_no.png)

![Allgather 24 processes NPS4 UCC](aga_24_n4_uc.png)

![Allgather 24 processes NPS4 HCOLL](aga_24_n4_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** と集合通信コンポーネントの各組合せを比較したものが以下のグラフです。  

![Allgather 24 processes](aga_24.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は **HCOLL** のミドルメッセージサイズで差がみられるがそれ以外は有意な差無し
- 集合通信コンポーネントの使用により概ね性能が向上するが **HCOLL** はスモールメッセージサイズで **UCC** はラージメッセージサイズで性能向上有り
- **UCC** のラージメッセージサイズでの性能向上が顕著

## 1-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** と集合通信コンポーネントの組合せ毎に示しています。

![Allreduce 24 processes NPS1 no coll](are_24_n1_no.png)

![Allreduce 24 processes NPS1 UCC](are_24_n1_uc.png)

![Allreduce 24 processes NPS1 HCOLL](are_24_n1_hc.png)

![Allreduce 24 processes NPS4 no coll](are_24_n4_no.png)

![Allreduce 24 processes NPS4 UCC](are_24_n4_uc.png)

![Allreduce 24 processes NPS4 HCOLL](are_24_n4_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** と集合通信コンポーネントの各組合せを比較したものが以下のグラフです。  

![Allreduce 24 processes](are_24.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- 集合通信コンポーネントの使用により概ね性能が向上するが **HCOLL** はスモールメッセージサイズで **UCC** はラージメッセージサイズで性能向上が顕著

***
# 2. 48 MPIプロセス

## 2-0. 概要

本章は、1ノードに48 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせをMPI集合通信関数毎に検証し、その結果を考察します。

## 2-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Alltoall 48 processes NPS1 no coll](ata_48_n1_bl_no.png)

![Alltoall 48 processes NPS1 UCC](ata_48_n1_bl_uc.png)

![Alltoall 48 processes NPS1 HCOLL](ata_48_n1_bl_hc.png)

![Alltoall 48 processes NPS1 no coll](ata_48_n1_cy_no.png)

![Alltoall 48 processes NPS1 UCC](ata_48_n1_cy_uc.png)

![Alltoall 48 processes NPS1 HCOLL](ata_48_n1_cy_hc.png)

![Alltoall 48 processes NPS4 no coll](ata_48_n4_bl_no.png)

![Alltoall 48 processes NPS4 UCC](ata_48_n4_bl_uc.png)

![Alltoall 48 processes NPS4 HCOLL](ata_48_n4_bl_hc.png)

![Alltoall 48 processes NPS4 no coll](ata_48_n4_cy_no.png)

![Alltoall 48 processes NPS4 UCC](ata_48_n4_cy_uc.png)

![Alltoall 48 processes NPS4 HCOLL](ata_48_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **8kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Alltoall 48 processes](ata_48_step1.png)

以上より、 **NPS** とMPIプロセス分割方法に差は無いため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Alltoall 48 processes](ata_48_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり8KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** とMPIプロセス分割方法は有意な差無し
- 集合通信コンポーネントの性能向上は **UCC** のスモールメッセージサイズを除き見られない
- **HCOLL** は1KB以上で性能低下が顕著

## 2-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allgather 48 processes NPS1 no coll](aga_48_n1_bl_no.png)

![Allgather 48 processes NPS1 UCC](aga_48_n1_bl_uc.png)

![Allgather 48 processes NPS1 HCOLL](aga_48_n1_bl_hc.png)

![Allgather 48 processes NPS1 no coll](aga_48_n1_cy_no.png)

![Allgather 48 processes NPS1 UCC](aga_48_n1_cy_uc.png)

![Allgather 48 processes NPS1 HCOLL](aga_48_n1_cy_hc.png)

![Allgather 48 processes NPS4 no coll](aga_48_n4_bl_no.png)

![Allgather 48 processes NPS4 UCC](aga_48_n4_bl_uc.png)

![Allgather 48 processes NPS4 HCOLL](aga_48_n4_bl_hc.png)

![Allgather 48 processes NPS4 no coll](aga_48_n4_cy_no.png)

![Allgather 48 processes NPS4 UCC](aga_48_n4_cy_uc.png)

![Allgather 48 processes NPS4 HCOLL](aga_48_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allgather 48 processes](aga_48_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allgather 48 processes](aga_48_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はサイクリック分割よりブロック分割が有利
- **UCC** は有意な差無し
- **HCOLL** は4KB以下のメッセージサイズで性能向上がみられるがそれ以上では性能が低下

## 2-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allreduce 48 processes NPS1 no coll](are_48_n1_bl_no.png)

![Allreduce 48 processes NPS1 UCC](are_48_n1_bl_uc.png)

![Allreduce 48 processes NPS1 HCOLL](are_48_n1_bl_hc.png)

![Allreduce 48 processes NPS1 no coll](are_48_n1_cy_no.png)

![Allreduce 48 processes NPS1 UCC](are_48_n1_cy_uc.png)

![Allreduce 48 processes NPS1 HCOLL](are_48_n1_cy_hc.png)

![Allreduce 48 processes NPS4 no coll](are_48_n4_bl_no.png)

![Allreduce 48 processes NPS4 UCC](are_48_n4_bl_uc.png)

![Allreduce 48 processes NPS4 HCOLL](are_48_n4_bl_hc.png)

![Allreduce 48 processes NPS4 no coll](are_48_n4_cy_no.png)

![Allreduce 48 processes NPS4 UCC](are_48_n4_cy_uc.png)

![Allreduce 48 processes NPS4 HCOLL](are_48_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allreduce 48 processes](are_48_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allreduce 48 processes](are_48_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はサイクリック分割よりブロック分割が有利
- **UCC** は8KB以上のメッセージサイズで大幅に性能が向上
- **HCOLL** は512KB以下のメッセージサイズで大幅に性能が向上

***
# 3. 96 MPIプロセス

## 3-0. 概要

本章は、1ノードに96 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせをMPI集合通信関数毎に検証し、その結果を考察します。

## 3-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Alltoall 96 processes NPS1 no coll](ata_96_n1_bl_no.png)

![Alltoall 96 processes NPS1 UCC](ata_96_n1_bl_uc.png)

![Alltoall 96 processes NPS1 HCOLL](ata_96_n1_bl_hc.png)

![Alltoall 96 processes NPS1 no coll](ata_96_n1_cy_no.png)

![Alltoall 96 processes NPS1 UCC](ata_96_n1_cy_uc.png)

![Alltoall 96 processes NPS1 HCOLL](ata_96_n1_cy_hc.png)

![Alltoall 96 processes NPS4 no coll](ata_96_n4_bl_no.png)

![Alltoall 96 processes NPS4 UCC](ata_96_n4_bl_uc.png)

![Alltoall 96 processes NPS4 HCOLL](ata_96_n4_bl_hc.png)

![Alltoall 96 processes NPS4 no coll](ata_96_n4_cy_no.png)

![Alltoall 96 processes NPS4 UCC](ata_96_n4_cy_uc.png)

![Alltoall 96 processes NPS4 HCOLL](ata_96_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **8kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Alltoall 96 processes](ata_96_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Alltoall 96 processes](ata_96_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり8KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はサイクリック分割よりブロック分割が有利
- **UCC** はミドルメッセージサイズで性能が低下
- **HCOLL** はほぼ全てのメッセージサイズで性能が低下し1KB以上で性能低下が顕著

## 3-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allgather 96 processes NPS1 no coll](aga_96_n1_bl_no.png)

![Allgather 96 processes NPS1 UCC](aga_96_n1_bl_uc.png)

![Allgather 96 processes NPS1 HCOLL](aga_96_n1_bl_hc.png)

![Allgather 96 processes NPS1 no coll](aga_96_n1_cy_no.png)

![Allgather 96 processes NPS1 UCC](aga_96_n1_cy_uc.png)

![Allgather 96 processes NPS1 HCOLL](aga_96_n1_cy_hc.png)

![Allgather 96 processes NPS4 no coll](aga_96_n4_bl_no.png)

![Allgather 96 processes NPS4 UCC](aga_96_n4_bl_uc.png)

![Allgather 96 processes NPS4 HCOLL](aga_96_n4_bl_hc.png)

![Allgather 96 processes NPS4 no coll](aga_96_n4_cy_no.png)

![Allgather 96 processes NPS4 UCC](aga_96_n4_cy_uc.png)

![Allgather 96 processes NPS4 HCOLL](aga_96_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allgather 96 processes](aga_96_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allgather 96 processes](aga_96_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はサイクリック分割よりブロック分割が有利
- **UCC** は128B以下のメッセージサイズで性能が低下
- **HCOLL** は16Bから4KBのメッセージサイズで性能向上がみられるが16KB以上では性能が低下

## 3-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allreduce 96 processes NPS1 no coll](are_96_n1_bl_no.png)

![Allreduce 96 processes NPS1 UCC](are_96_n1_bl_uc.png)

![Allreduce 96 processes NPS1 HCOLL](are_96_n1_bl_hc.png)

![Allreduce 96 processes NPS1 no coll](are_96_n1_cy_no.png)

![Allreduce 96 processes NPS1 UCC](are_96_n1_cy_uc.png)

![Allreduce 96 processes NPS1 HCOLL](are_96_n1_cy_hc.png)

![Allreduce 96 processes NPS4 no coll](are_96_n4_bl_no.png)

![Allreduce 96 processes NPS4 UCC](are_96_n4_bl_uc.png)

![Allreduce 96 processes NPS4 HCOLL](are_96_n4_bl_hc.png)

![Allreduce 96 processes NPS4 no coll](are_96_n4_cy_no.png)

![Allreduce 96 processes NPS4 UCC](are_96_n4_cy_uc.png)

![Allreduce 96 processes NPS4 HCOLL](are_96_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **8kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allreduce 96 processes](are_96_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allreduce 96 processes](are_96_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり8KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はサイクリック分割よりブロック分割が有利
- **UCC** は256B以下のメッセージサイズで性能が低下し4KB以上のメッセージサイズで性能が向上
- **HCOLL** は128KB以下のメッセージサイズで性能が向上しそのうち512B以上のメッセージサイズで性能向上が顕著

***
# 4. 192 MPIプロセス

## 4-0. 概要

本章は、1ノードに192 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせをMPI集合通信関数毎に検証し、その結果を考察します。

## 4-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Alltoall 192 processes NPS1 no coll](ata_192_n1_bl_no.png)

![Alltoall 192 processes NPS1 UCC](ata_192_n1_bl_uc.png)

![Alltoall 192 processes NPS1 HCOLL](ata_192_n1_bl_hc.png)

![Alltoall 192 processes NPS1 no coll](ata_192_n1_cy_no.png)

![Alltoall 192 processes NPS1 UCC](ata_192_n1_cy_uc.png)

![Alltoall 192 processes NPS1 HCOLL](ata_192_n1_cy_hc.png)

![Alltoall 192 processes NPS4 no coll](ata_192_n4_bl_no.png)

![Alltoall 192 processes NPS4 UCC](ata_192_n4_bl_uc.png)

![Alltoall 192 processes NPS4 HCOLL](ata_192_n4_bl_hc.png)

![Alltoall 192 processes NPS4 no coll](ata_192_n4_cy_no.png)

![Alltoall 192 processes NPS4 UCC](ata_192_n4_cy_uc.png)

![Alltoall 192 processes NPS4 HCOLL](ata_192_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **4kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Alltoall 192 processes](ata_192_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Alltoall 192 processes](ata_192_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり4KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はサイクリック分割よりブロック分割が僅かに有利
- **UCC** は有意な差無し
- **HCOLL** は4KB以上のメッセージサイズで大幅に性能低下

## 4-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allgather 192 processes NPS1 no coll](aga_192_n1_bl_no.png)

![Allgather 192 processes NPS1 UCC](aga_192_n1_bl_uc.png)

![Allgather 192 processes NPS1 HCOLL](aga_192_n1_bl_hc.png)

![Allgather 192 processes NPS1 no coll](aga_192_n1_cy_no.png)

![Allgather 192 processes NPS1 UCC](aga_192_n1_cy_uc.png)

![Allgather 192 processes NPS1 HCOLL](aga_192_n1_cy_hc.png)

![Allgather 192 processes NPS4 no coll](aga_192_n4_bl_no.png)

![Allgather 192 processes NPS4 UCC](aga_192_n4_bl_uc.png)

![Allgather 192 processes NPS4 HCOLL](aga_192_n4_bl_hc.png)

![Allgather 192 processes NPS4 no coll](aga_192_n4_cy_no.png)

![Allgather 192 processes NPS4 UCC](aga_192_n4_cy_uc.png)

![Allgather 192 processes NPS4 HCOLL](aga_192_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allgather 192 processes](aga_192_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allgather 192 processes](aga_192_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり16KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はサイクリック分割よりブロック分割が有利
- **UCC** は1有意な差無し
- **HCOLL** は16Bから256Bのメッセージサイズで性能向上

## 4-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** 、MPIプロセス分割方法、及び集合通信コンポーネントの組合せ毎に示しています。

![Allreduce 192 processes NPS1 no coll](are_192_n1_bl_no.png)

![Allreduce 192 processes NPS1 UCC](are_192_n1_bl_uc.png)

![Allreduce 192 processes NPS1 HCOLL](are_192_n1_bl_hc.png)

![Allreduce 192 processes NPS1 no coll](are_192_n1_cy_no.png)

![Allreduce 192 processes NPS1 UCC](are_192_n1_cy_uc.png)

![Allreduce 192 processes NPS1 HCOLL](are_192_n1_cy_hc.png)

![Allreduce 192 processes NPS4 no coll](are_192_n4_bl_no.png)

![Allreduce 192 processes NPS4 UCC](are_192_n4_bl_uc.png)

![Allreduce 192 processes NPS4 HCOLL](are_192_n4_bl_hc.png)

![Allreduce 192 processes NPS4 no coll](are_192_n4_cy_no.png)

![Allreduce 192 processes NPS4 UCC](are_192_n4_cy_uc.png)

![Allreduce 192 processes NPS4 HCOLL](are_192_n4_cy_hc.png)

以上より、 **UCX_RNDV_THRESH** を **8kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** とMPIプロセス分割方法の各組合せを比較したものが以下のグラフです。  
集合通信コンポーネントは、ここでは未使用で比較しています。  

![Allreduce 192 processes](are_192_step1.png)

以上より、 **NPS** に差は無くブロック分割が有利なため、 **NPS4** とブロック分割で集合通信コンポーネントを比較したものが以下のグラフです。

![Allreduce 192 processes](are_192_step2.png)

以上の結果は、以下のように考察することが出来ます。

- 集合通信コンポーネント未使用の場合は **UCX_RNDV_THRESH** の影響無し
- **UCC** はミドルメッセージサイズで **UCX_RNDV_THRESH** の影響があり8KBが最も性能が良い
- **HCOLL** は **UCX_RNDV_THRESH** の影響軽微
- **NPS** は有意な差無し
- MPIプロセス分割方法はサイクリック分割よりブロック分割が有利
- **UCC** は4KB以上のメッセージサイズで性能が向上しそのうち128KB以下のメッセージサイズで性能向上が顕著
- **HCOLL** は128KB以下のメッセージサイズで大幅に性能が向上