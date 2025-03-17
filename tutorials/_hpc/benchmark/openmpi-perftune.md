---
title: "OpenMPIのMPI集合通信チューニング方法（BM.Optimized3.36編）"
excerpt: "MPI並列アプリケーションは、MPI通信時間がボトルネックになっている場合そのMPI通信をチューニングすることで性能が向上しますが、ボトルネックのMPI通信が集合通信の場合は、使用する通信アルゴリズムやその切り替えメッセージサイズ等の実行時パラメータ、MPIプロセス分割方法やNUMA nodes per socket等のアプリケーション実行環境まで、様々な要因がその性能に影響します。本パフォーマンス関連Tipsは、MPIの実装にOpenMPIを取り上げ、これが採用するModular Component ArchitectureやUCXの実行時パラメーター、MPIプロセス分割方法やNUMA nodes per socketを組合せて、HPCワークロード向けベア・メタル・シェイプBM.Optimized3.36でMPI集合通信をチューニングする方法を解説します。"
order: "228"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

オープンソースのMPI実装である **[OpenMPI](https://www.open-mpi.org/)** は、  **[Modular Component Architecture](https://docs.open-mpi.org/en/v5.0.x/mca.html)** （以降 **MCA** と呼称します。）を採用することで、ビルド時に組み込むコンポーネントを介して集合通信を含む多彩な機能を提供し、この **MCA** パラメータにはMPI集合通信性能に影響するものがあります。

また **OpenMPI** は、高帯域・低遅延のMPIプロセス間通信を実現するためにその通信フレームワークに **[UCX](https://openucx.org/)** を採用し、この **UCX** のパラメータにもMPI集合通信性能に影響するパラメータが存在します。

またMPI集合通信は、ノード内並列では実質的にメモリコピーとなるため、メモリ性能に影響するMPIプロセスのコア割当てや **NUMA nodes per socket** （以降 **NPS** と呼称します。）もその性能に影響します。

以上を踏まえて本パフォーマンス関連Tipsは、HPCワークロード向けベア・メタル・シェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** に於ける **OpenMPI** のMPI集合通信性能にフォーカスし、以下の **計測条件** を組合せたテストケース毎に以下の **実行時パラメータ** を変えてその性能を **[Intel MPI Benchmarks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** で計測し、最適な **実行時パラメータ** の組み合わせを導きます。

[**計測条件**]

- ノード数 ： **1** ・ **2** ・ **4** ・ **8**
- ノード当たりMPIプロセス数 ： **8** ・ **16** ・ **32** ・ **36**
- MPI集合通信関数 ： **Alltoall** ・ **Allgather** ・ **Allreduce**

[**実行時パラメータ**]

- **UCX_TLS** ： **all** ・ **self,sm,rc** ・ **self,sm,ud** ・ **self,sm,dc** （※1）
- **UCX_RNDV_THRESH** ： **auto** ・ **4kb** ・ **8kb** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb** （※2）
- **UCX_ZCOPY_THRESH** ： **auto** ・ **4kb** ・ **8kb** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb** （※3）
- **coll_hcoll_enable** ： **0** ・ **1** （※4）
- MPIプロセス分割方法 ： ブロック分割・サイクリック分割（※5）
- **NPS** ：  **1** （以降 **NPS1** と呼称します。）・ **2** （以降 **NPS2** と呼称します。）（※6）

※1） **UCX** のパラメータで、2ノード以上の **計測条件** で使用します。詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI通信性能に影響するパラメータとその関連Tips](/ocitutorials/hpc/benchmark/openmpi-perftips/)** の **[3-4. UCX_TLS](/ocitutorials/hpc/benchmark/openmpi-perftips/#3-4-ucx_tls)** を参照してください。  
※2） **UCX** のパラメータで、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI通信性能に影響するパラメータとその関連Tips](/ocitutorials/hpc/benchmark/openmpi-perftips/)** の **[3-6. UCX_RNDV_THRESH](/ocitutorials/hpc/benchmark/openmpi-perftips/#3-6-ucx_rndv_thresh)** を参照してください。  
※3） **UCX** のパラメータで、2ノード以上の **計測条件** で使用します。詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI通信性能に影響するパラメータとその関連Tips](/ocitutorials/hpc/benchmark/openmpi-perftips/)** の **[3-7. UCX_ZCOPY_THRESH](/ocitutorials/hpc/benchmark/openmpi-perftips/#3-7-ucx_zcopy_thresh)** を参照してください。  
※4） **MCA** のパラメータで、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI通信性能に影響するパラメータとその関連Tips](/ocitutorials/hpc/benchmark/openmpi-perftips/)** の **[3-1. coll_hcoll_enable](/ocitutorials/hpc/benchmark/openmpi-perftips/#3-1-coll_hcoll_enable)** を参照してください。  
※5）NUMAノードに対するMPIプロセスの分割方法で、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスを考慮したプロセス・スレッドのコア割当て指定方法](/ocitutorials/hpc/benchmark/cpu-binding/)** を参照してください。  
※6）**NPS** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

また本パフォーマンス関連Tipsの検証は、以下の実行環境で実施しています。

[実行環境]
- シェイプ： **BM.Optimized3.36** （  **Simultanious Multi Threading** （以降 **SMT** と呼称します。）無効（※7））
- ノード間接続 ： **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** （※8）
- OS： **Oracle Linux** 8.10ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※9）
- **OpenMPI** ： 5.0.6（※10）
- **Intel MPI Benchmarks** ： 2021.7（※11）

※7）**SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。  
※8）本テクニカルTipsの2ノード以上の全ての計測は、 **クラスタ・ネットワーク** の同一リーフスイッチ配下のインスタンスを使用して行っています。同一リーフスイッチ配下に配置されたインスタンス間のノード間接続に於ける効果は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[クラスタ・ネットワークのトポロジーを考慮したノード間通信最適化方法](/ocitutorials/hpc/benchmark/topology-aware-cn-tuning/)** を参照してください。  
※9）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** です。  
※10） **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従って構築された **OpenMPI** です。  
※11） **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[Intel MPI Benchmarks実行方法](/ocitutorials/hpc/benchmark/run-imb/)** の **[1. OpenMPIでIntel MPI Benchmarksを実行する場合](/ocitutorials/hpc/benchmark/run-imb/#1-openmpiでintel-mpi-benchmarksを実行する場合)** に従って構築された **Intel MPI Benchmarks** です。

また **Intel MPI Benchmarks** の計測は、 **numactl** コマンドを介して以下の実行時オプションを指定して起動します。

```sh
$ numactl -l IMB-MPI1 -msglog 0:xx -mem 2.3G -off_cache 39,64 -npmin num_of_procs alltoall/allgather/allreduce
```

ここで計測するメッセージサイズの上限（ **xx** ）は、MPI集合通信関数とノード数に応じて以下の値を使用します。  
この設定値は、計測可能な最大値から決定しています。

|               | 1ノード | 2ノード | 4ノード | 8ノード |
| :-----------: | :--: | :--: | :--: | ---- |
| **Alltoall**  | 25   | 24   | 23    | 22    |
| **Allgather** | 25   | 24   | 23    | 22    |
| **Allreduce** | 30   | 30   | 30    | 30    |

また **Intel MPI Benchmarks** の計測は、テストケース毎に5回実施し、その最大値と最小値を除く3回の算術平均をその結果とします。

以降では、以下 **計測条件** の順に解説します。

1. **[1ノード](#1--1ノード)**
2. **[2ノード](#2--2ノード)**
3. **[4ノード](#3--4ノード)**
4. **[8ノード](#4--8ノード)**

***
# 1.  1ノード

## 1-0. 概要

本章は、1ノードに8・16・32・36の各MPIプロセスを割当てる場合の各MPI集合通信関数の通信性能について、以下の **実行時パラメータ** の最適な組み合わせを検証します。

- **UCX_RNDV_THRESH** ： **auto** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb**
- **coll_hcoll_enable** ： **0** ・ **1**
- MPIプロセス分割方法 ： ブロック分割・サイクリック分割
- **NPS** ：  **1** ・ **2**

## 1-1. 8 MPIプロセス

### 1-1-0. 概要

本章は、1ノードに8 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、各MPI集合通信関数の最適な **UCX_RNDV_THRESH** を示しており、この設定値を使用することによりデフォルト値の **auto** に対する性能向上が見られます。  
特に **Alltoall** は8KBから128KB、 **Allreduce** は32KBから16MBのメッセージサイズに於いて、性能が向上します。

| MPI集合通信関数 | UCX_RNDV_THRESH |
| :-------: | -------------: |
| **Alltoall**  | 32kb            |
| **Allgather** | 64kb            |
| **Allreduce** | 128kb           |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 4Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 32Bから512Bのメッセージサイズで使用する場合が使用しない場合に対して優位  
    - 8KBから32KBのメッセージサイズで使用しない場合が使用する場合に対して優位
- **Allreduce**
    - 32Bから4KBのメッセージサイズで使用する場合が使用しない場合に対して優位  
    - 32MBから1GBのメッセージサイズで使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。


### 1-1-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Alltoall 1 node 8 processes NPS1 Block](ata_01_08_n1_bl.png)

![Alltoall 1 node 8 processes NPS1 Cyclic](ata_01_08_n1_cy.png)

![Alltoall 1 node 8 processes NPS2 Block](ata_01_08_n2_bl.png)

![Alltoall 1 node 8 processes NPS2 Cyclic](ata_01_08_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 1 node 8 processes](ata_01_08.png)

### 1-1-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Allgather 1 node 8 processes NPS1 Block](aga_01_08_n1_bl.png)

![Allgather 1 node 8 processes NPS1 Cyclic](aga_01_08_n1_cy.png)

![Allgather 1 node 8 processes NPS2 Block](aga_01_08_n2_bl.png)

![Allgather 1 node 8 processes NPS2 Cyclic](aga_01_08_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **64kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 1 node 8 processes](aga_01_08.png)

### 1-1-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Allreduce 1 node 8 processes NPS1 Block](are_01_08_n1_bl.png)

![Allreduce 1 node 8 processes NPS1 Cyclic](are_01_08_n1_cy.png)

![Allreduce 1 node 8 processes NPS2 Block](are_01_08_n2_bl.png)

![Allreduce 1 node 8 processes NPS2 Cyclic](are_01_08_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 1 node 8 processes](are_01_08.png)

## 1-2.  16 MPIプロセス

### 1-2-0. 概要

本章は、1ノードに16 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、各MPI集合通信関数の最適な **UCX_RNDV_THRESH** を示しており、この設定値を使用することによりデフォルト値の **auto** に対する性能向上が見られます。  
特に **Alltoall** は8KBから128KB、 **Allreduce** は64KBから16MBのメッセージサイズに於いて、性能が向上します。

| MPI集合通信関数 | UCX_RNDV_THRESH |
| :-------: | -------------: |
| **Alltoall**  | 32kb            |
| **Allgather** | 32kb            |
| **Allreduce** | 128kb           |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 512Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 使用しない場合は8KBのメッセージサイズに特異点が発生  
- **Allreduce**
    - 4KBまでのメッセージサイズで使用する場合が使用しない場合に対して優位  
    - 32MBから1GBのメッセージサイズで使用する場合が使用しない場合に対して優位 

**NPS** とMPIプロセス分割方法は、以下の傾向がみられます。

- **Alltoall**
    - 16MBから32MBのメッセージサイズで **NPS1** が **NPS2** に対して優位

### 1-2-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Alltoall 1 node 16 processes NPS1 Block](ata_01_16_n1_bl.png)

![Alltoall 1 node 16 processes NPS1 Cyclic](ata_01_16_n1_cy.png)

![Alltoall 1 node 16 processes NPS2 Block](ata_01_16_n2_bl.png)

![Alltoall 1 node 16 processes NPS2 Cyclic](ata_01_16_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 1 node 16 processes](ata_01_16.png)

### 1-2-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Allgather 1 node 16 processes NPS1 Block](aga_01_16_n1_bl.png)

![Allgather 1 node 16 processes NPS1 Cyclic](aga_01_16_n1_cy.png)

![Allgather 1 node 16 processes NPS2 Block](aga_01_16_n2_bl.png)

![Allgather 1 node 16 processes NPS2 Cyclic](aga_01_16_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **32kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 1 node 16 processes](aga_01_16.png)

### 1-2-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Allreduce 1 node 16 processes NPS1 Block](are_01_16_n1_bl.png)

![Allreduce 1 node 16 processes NPS1 Cyclic](are_01_16_n1_cy.png)

![Allreduce 1 node 16 processes NPS2 Block](are_01_16_n2_bl.png)

![Allreduce 1 node 16 processes NPS2 Cyclic](are_01_16_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 1 node 16 processes](are_01_16.png)

## 1-3.  32 MPIプロセス

### 1-3-0. 概要

本章は、1ノードに32 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関毎に検証します。

下表は、各MPI集合通信関数の最適な **UCX_RNDV_THRESH** を示しており、この設定値を使用することによりデフォルト値の **auto** に対する性能向上が見られます。  
特に **Alltoall** は8KBから512KB、 **Allreduce** は128KBから16MBのメッセージサイズに於いて、性能が向上します。

| MPI集合通信関数 | UCX_RNDV_THRESH |
| :-------: | -------------: |
| **Alltoall**  | 16kb            |
| **Allgather** | 16kb            |
| **Allreduce** | 128kb           |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 1KBまでのメッセージサイズで使用する場合が使用しない場合に対しておおむね優位
- **Allgather**
    - 2KBから8KBまでのメッセージサイズで使用しない場合が使用する場合に対して優位
- **Allreduce**
    - 32Bから4KBまでのメッセージサイズで使用する場合が使用しない場合に対して優位  
    - 32MBから1GBまでのメッセージサイズで使用する場合が使用しない場合に対して優位 

**NPS** とMPIプロセス分割方法は、以下の傾向がみられます。

- **Alltoall**
    - 2MBから32MBまでのメッセージサイズで **NPS1** が **NPS2** に対して優位
- **Allgather**
    - 32MBメッセージサイズでブロック分割がサイクリック分割に対して優位

### 1-3-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Alltoall 1 node 32 processes NPS1 Block](ata_01_32_n1_bl.png)

![Alltoall 1 node 32 processes NPS1 Cyclic](ata_01_32_n1_cy.png)

![Alltoall 1 node 32 processes NPS2 Block](ata_01_32_n2_bl.png)

![Alltoall 1 node 32 processes NPS2 Cyclic](ata_01_32_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 1 node 32 processes](ata_01_32.png)

### 1-3-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Allgather 1 node 32 processes NPS1 Block](aga_01_32_n1_bl.png)

![Allgather 1 node 32 processes NPS1 Cyclic](aga_01_32_n1_cy.png)

![Allgather 1 node 32 processes NPS2 Block](aga_01_32_n2_bl.png)

![Allgather 1 node 32 processes NPS2 Cyclic](aga_01_32_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 1 node 32 processes](aga_01_32.png)

### 1-3-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Allreduce 1 node 32 processes NPS1 Block](are_01_32_n1_bl.png)

![Allreduce 1 node 32 processes NPS1 Cyclic](are_01_32_n1_cy.png)

![Allreduce 1 node 32 processes NPS2 Block](are_01_32_n2_bl.png)

![Allreduce 1 node 32 processes NPS2 Cyclic](are_01_32_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 1 node 32 processes](are_01_32.png)

## 1-4.  36 MPIプロセス

### 1-4-0. 概要

本章は、1ノードに36 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数ごとに検証します。

下表は、各MPI集合通信関数の最適な **UCX_RNDV_THRESH** を示しており、この設定値を使用することによりデフォルト値の **auto** に対する性能向上が見られます。  
特に **Alltoall** は8KBから256KB、 **Allreduce** は64KBから16MBのメッセージサイズに於いて、性能が向上します。

| MPI集合通信関数 | UCX_RNDV_THRESH |
| :-------: | -------------: |
| **Alltoall**  | 16kb            |
| **Allgather** | 16kb            |
| **Allreduce** | 128kb           |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 1KBまでのメッセージサイズで使用する場合が使用しない場合に対しておおむね優位
    - 256KBから2MBまでのメッセージサイズで使用しない場合が使用する場合に対して優位
- **Allgather**
    - 1KBまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - 4KBまでのメッセージサイズで使用する場合が使用しない場合に対して優位  
    - 8MBから1GBまでのメッセージサイズで使用する場合が使用しない場合に対して優位 

**NPS** とMPIプロセス分割方法は、以下の傾向がみられます。

- **Allgather**
    - 32MBメッセージサイズでブロック分割がサイクリック分割に対して優位
- **Allreduce**
    - 1MBから8MBのメッセージサイズで **NPS1** が **NPS2** に対して優位

### 1-4-1. Alltoall

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Alltoall 1 node 36 processes NPS1 Block](ata_01_36_n1_bl.png)

![Alltoall 1 node 36 processes NPS1 Cyclic](ata_01_36_n1_cy.png)

![Alltoall 1 node 36 processes NPS2 Block](ata_01_36_n2_bl.png)

![Alltoall 1 node 36 processes NPS2 Cyclic](ata_01_36_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 1 node 36 processes](ata_01_36.png)

### 1-4-2. Allgather

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Allgather 1 node 36 processes NPS1 Block](aga_01_36_n1_bl.png)

![Allgather 1 node 36 processes NPS1 Cyclic](aga_01_36_n1_cy.png)

![Allgather 1 node 36 processes NPS2 Block](aga_01_36_n2_bl.png)

![Allgather 1 node 36 processes NPS2 Cyclic](aga_01_36_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **16kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 1 node 36 processes](aga_01_36.png)

### 1-4-3. Allreduce

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **NPS** とMPIプロセス分割方法の組合せ毎に示しています。 **coll_hcoll_enable** は、ここでは **1** としています。

![Allreduce 1 node 36 processes NPS1 Block](are_01_36_n1_bl.png)

![Allreduce 1 node 36 processes NPS1 Cyclic](are_01_36_n1_cy.png)

![Allreduce 1 node 36 processes NPS2 Block](are_01_36_n2_bl.png)

![Allreduce 1 node 36 processes NPS2 Cyclic](are_01_36_n2_cy.png)

以上より、 **UCX_RNDV_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定、 **NPS** 、MPIプロセス分割方法、及び **HCOLL** 使用の有無を比較したものが以下のグラフです。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 1 node 36 processes](are_01_36.png)

***
# 2.  2ノード

## 2-0. 概要

本章は、2ノードにノード当たり8・16・32・36の各MPIプロセス、トータルで16・32・64・72の各MPIプロセスを割当てる場合の各MPI集合通信関数の通信性能について、以下の **実行時パラメータ** の最適な組み合わせを検証します。

- **UCX_TLS** ： **all** ・ **self,sm,rc** ・ **self,sm,ud** ・ **self,sm,dc**
- **UCX_RNDV_THRESH** ： **auto** ・ **4kb** ・ **8kb** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb** （※12）
- **UCX_ZCOPY_THRESH** ： **auto** ・ **4kb** ・ **8kb** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb**
- **coll_hcoll_enable** ： **0** ・ **1**
- MPIプロセス分割方法 ： ブロック分割・サイクリック分割
- **NPS** ：  **1** ・ **2**

※12） **UCX_RNDV_THRESH** は、ノード内は **auto** と **[1. 1ノード](#1--1ノード)** で判明した最適値、ノード間はここに記載の7種類を使用し、以下8個の組合せを検証します。

- **intra:auto,inter:auto**
- **intra:optimal_value,inter:auto**
- **intra:optimal_value,inter:4kb**
- **intra:optimal_value,inter:8kb**
- **intra:optimal_value,inter:16kb**
- **intra:optimal_value,inter:32kb**
- **intra:optimal_value,inter:64kb**
- **intra:optimal_value,inter:128kb**

ここで、全ての **実行時パラメータ** の組み合わせを検証することは非現実的なため、組み合わせを減らす目的で以下3ステップに分けて検証を行います。

- ステップ1
    - **UCX_TLS** と **UCX_RNDV_THRESH** を組合せた32個のパターンを検証してこれらの最適値を決定
    - **coll_hcoll_enable** は **1** に固定
    - MPIプロセス分割方法はブロック分割に固定
    - **NPS** は **NPS1** に固定
- ステップ2
    - **UCX_ZCOPY_THRESH** の7パターンを検証してこの最適値を決定
    - **UCX_TLS** と **UCX_RNDV_THRESH** はステップ1で決定した最適値を使用
    - **coll_hcoll_enable** は **1** に固定
    - MPIプロセス分割方法はブロック分割に固定
    - **NPS** は **NPS1** に固定
- ステップ3
    - **coll_hcoll_enable** とMPIプロセス分割方法と **NPS** を組合せた8パターンを検証してこれらの最適値を決定
    - **UCX_TLS** と **UCX_RNDV_THRESH** はステップ1で決定した最適値を使用
    - **UCX_ZCOPY_THRESH** はステップ2で決定した最適値を使用

## 2-1. ノード当たり8 MPIプロセス

### 2-1-0. 概要

本章は、2ノードにノード当たり8 MPIプロセスでトータル16 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,rc | intra:32kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:64kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 4Bから256Bのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 8Bから4KBと32KBから16MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

### 2-1-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-1-1 Alltoall](#1-1-1-alltoall)** の結果から32kbとしています。

![Alltoall 2 node 8 ppn all step1](ata_02_08_all_step1.png)

![Alltoall 2 node 8 ppn rc step1](ata_02_08_rc_step1.png)

![Alltoall 2 node 8 ppn ud step1](ata_02_08_ud_step1.png)

![Alltoall 2 node 8 ppn dc step1](ata_02_08_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:32kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 2 node 8 ppn step1](ata_02_08_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 2 node 8 ppn step2](ata_02_08_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 2 node 8 ppn step3](ata_02_08_step3.png)

### 2-1-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-1-2 Allgather](#1-1-2-allgather)** の結果から64kbとしています。

![Allgather 2 node 8 ppn all step1](aga_02_08_all_step1.png)

![Allgather 2 node 8 ppn rc step1](aga_02_08_rc_step1.png)

![Allgather 2 node 8 ppn ud step1](aga_02_08_ud_step1.png)

![Allgather 2 node 8 ppn dc step1](aga_02_08_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:64kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 2 node 8 ppn step1](aga_02_08_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 2 node 8 ppn step2](aga_02_08_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 2 node 8 ppn step3](aga_02_08_step3.png)

### 2-1-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-1-3 Allreduce](#1-1-3-allreduce)** の結果から128kbとしています。

![Allreduce 2 node 8 ppn all step1](are_02_08_all_step1.png)

![Allreduce 2 node 8 ppn rc step1](are_02_08_rc_step1.png)

![Allreduce 2 node 8 ppn ud step1](are_02_08_ud_step1.png)

![Allreduce 2 node 8 ppn dc step1](are_02_08_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 2 node 8 ppn step1](are_02_08_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 2 node 8 ppn step2](are_02_08_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 2 node 8 ppn step3](are_02_08_step3.png)

## 2-2. ノード当たり16 MPIプロセス

### 2-2-0. 概要

本章は、2ノードにノード当たり16 MPIプロセスでトータル32 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,rc | intra:32kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:32kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 256Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 4Bから16MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

### 2-2-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-2-1 Alltoall](#1-2-1-alltoall)** の結果から32kbとしています。

![Alltoall 2 node 16 ppn all step1](ata_02_16_all_step1.png)

![Alltoall 2 node 16 ppn rc step1](ata_02_16_rc_step1.png)

![Alltoall 2 node 16 ppn ud step1](ata_02_16_ud_step1.png)

![Alltoall 2 node 16 ppn dc step1](ata_02_16_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:32kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 2 node 16 ppn step1](ata_02_16_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 2 node 16 ppn step2](ata_02_16_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 2 node 16 ppn step3](ata_02_16_step3.png)

### 2-2-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-2-2 Allgather](#1-2-2-allgather)** の結果から32kbとしています。

![Allgather 2 node 16 ppn all step1](aga_02_16_all_step1.png)

![Allgather 2 node 16 ppn rc step1](aga_02_16_rc_step1.png)

![Allgather 2 node 16 ppn ud step1](aga_02_16_ud_step1.png)

![Allgather 2 node 16 ppn dc step1](aga_02_16_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:32kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 2 node 16 ppn step1](aga_02_16_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 2 node 16 ppn step2](aga_02_16_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 2 node 16 step3](aga_02_16_step3.png)

### 2-2-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-2-3 Allreduce](#1-2-3-allreduce)** の結果から128kbとしています。

![Allreduce 2 node 16 ppn all step1](are_02_16_all_step1.png)

![Allreduce 2 node 16 ppn rc step1](are_02_16_rc_step1.png)

![Allreduce 2 node 16 ppn ud step1](are_02_16_ud_step1.png)

![Allreduce 2 node 16 ppn dc step1](are_02_16_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 2 node 16 ppn step1](are_02_16_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 2 node 16 ppn step2](are_02_16_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 2 node 16 ppn step3](are_02_16_step3.png)

## 2-3. ノード当たり32 MPIプロセス

### 2-3-0. 概要

本章は、2ノードにノード当たり32 MPIプロセスでトータル64 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,rc | intra:16kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:16kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 512Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 32Bから8MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

### 2-3-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-3-1 Alltoall](#1-3-1-alltoall)** の結果から16kbとしています。

![Alltoall 2 node 32 ppn all step1](ata_02_32_all_step1.png)

![Alltoall 2 node 32 ppn rc step1](ata_02_32_rc_step1.png)

![Alltoall 2 node 32 ppn ud step1](ata_02_32_ud_step1.png)

![Alltoall 2 node 32 ppn dc step1](ata_02_32_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 2 node 32 ppn step1](ata_02_32_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 2 node 32 ppn step2](ata_02_32_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 2 node 32 ppn step3](ata_02_32_step3.png)

### 2-3-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-3-2 Allgather](#1-3-2-allgather)** の結果から16kbとしています。

![Allgather 2 node 32 ppn all step1](aga_02_32_all_step1.png)

![Allgather 2 node 32 ppn rc step1](aga_02_32_rc_step1.png)

![Allgather 2 node 32 ppn ud step1](aga_02_32_ud_step1.png)

![Allgather 2 node 32 ppn dc step1](aga_02_32_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 2 node 32 ppn step1](aga_02_32_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 2 node 32 ppn step2](aga_02_32_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 2 node 32 ppn step3](aga_02_32_step3.png)

### 2-3-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-3-3 Allreduce](#1-3-3-allreduce)** の結果から128kbとしています。

![Allreduce 2 node 32 ppn all step1](are_02_32_all_step1.png)

![Allreduce 2 node 32 ppn rc step1](are_02_32_rc_step1.png)

![Allreduce 2 node 32 ppn ud step1](are_02_32_ud_step1.png)

![Allreduce 2 node 32 ppn dc step1](are_02_32_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 2 node 32 ppn step1](are_02_32_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 2 node 32 ppn step2](are_02_32_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 2 node 32 ppn step3](are_02_32_step3.png)

## 2-4. ノード当たり36 MPIプロセス

### 2-4-0. 概要

本章は、2ノードにノード当たり36 MPIプロセスでトータル72 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,rc | intra:16kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:16kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 512Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 4Bから8MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、以下の傾向がみられます。

- **Alltoall**
    - 有意な差は無し
- **Allgather**
    - 局所的にブロック分割がサイクリック分割に対して優位
- **Allreduce**
    - 1MBから8MBのメッセージサイズで **NPS1** が **NPS2** に対して優位

### 2-4-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-4-1 Alltoall](#1-4-1-alltoall)** の結果から16kbとしています。

![Alltoall 2 node 36 ppn all step1](ata_02_36_all_step1.png)

![Alltoall 2 node 36 ppn rc step1](ata_02_36_rc_step1.png)

![Alltoall 2 node 36 ppn ud step1](ata_02_36_ud_step1.png)

![Alltoall 2 node 36 ppn dc step1](ata_02_36_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 2 node 36 ppn step1](ata_02_36_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 2 node 36 ppn step2](ata_02_36_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 2 node 36 ppn step3](ata_02_36_step3.png)

### 2-4-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-4-2 Allgather](#1-4-2-allgather)** の結果から16kbとしています。

![Allgather 2 node 36 ppn all step1](aga_02_36_all_step1.png)

![Allgather 2 node 36 ppn rc step1](aga_02_36_rc_step1.png)

![Allgather 2 node 36 ppn ud step1](aga_02_36_ud_step1.png)

![Allgather 2 node 36 ppn dc step1](aga_02_36_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 2 node 36 ppn step1](aga_02_36_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 2 node 36 ppn step2](aga_02_36_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 2 node 36 ppn step3](aga_02_36_step3.png)

### 2-4-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-4-3 Allreduce](#1-4-3-allreduce)** の結果から128kbとしています。

![Allreduce 2 node 36 ppn all step1](are_02_36_all_step1.png)

![Allreduce 2 node 36 ppn rc step1](are_02_36_rc_step1.png)

![Allreduce 2 node 36 ppn ud step1](are_02_36_ud_step1.png)

![Allreduce 2 node 36 ppn dc step1](are_02_36_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 2 node 36 ppn step1](are_02_36_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 2 node 36 ppn step2](are_02_36_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 2 node 36 ppn step3](are_02_36_step3.png)

***
# 3.  4ノード

## 3-0. 概要

本章は、4ノードにノード当たり8・16・32・36の各MPIプロセス、トータルで32・64・128・144の各MPIプロセスを割当てる場合の各MPI集合通信関数の通信性能について、以下の **実行時パラメータ** の最適な組み合わせを検証します。

- **UCX_TLS** ： **all** ・ **self,sm,rc** ・ **self,sm,ud** ・ **self,sm,dc**
- **UCX_RNDV_THRESH** ： **auto** ・ **4kb** ・ **8kb** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb** （※13）
- **UCX_ZCOPY_THRESH** ： **auto** ・ **4kb** ・ **8kb** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb**
- **coll_hcoll_enable** ： **0** ・ **1**
- MPIプロセス分割方法 ： ブロック分割・サイクリック分割
- **NPS** ：  **1** ・ **2**

※13） **UCX_RNDV_THRESH** は、ノード内は **auto** と **[1. 1ノード](#1--1ノード)** で判明した最適値、ノード間はここに記載の7種類を使用し、以下8個の組合せを検証します。

- **intra:auto,inter:auto**
- **intra:optimal_value,inter:auto**
- **intra:optimal_value,inter:4kb**
- **intra:optimal_value,inter:8kb**
- **intra:optimal_value,inter:16kb**
- **intra:optimal_value,inter:32kb**
- **intra:optimal_value,inter:64kb**
- **intra:optimal_value,inter:128kb**

ここで、全ての **実行時パラメータ** の組み合わせを検証することは非現実的なため、組み合わせを減らす目的で以下3ステップに分けて検証を行います。

- ステップ1
    - **UCX_TLS** と **UCX_RNDV_THRESH** を組合せた32個のパターンを検証してこれらの最適値を決定
    - **coll_hcoll_enable** は **1** に固定
    - MPIプロセス分割方法はブロック分割に固定
    - **NPS** は **NPS1** に固定
- ステップ2
    - **UCX_ZCOPY_THRESH** の7パターンを検証してこの最適値を決定
    - **UCX_TLS** と **UCX_RNDV_THRESH** はステップ1で決定した最適値を使用
    - **coll_hcoll_enable** は **1** に固定
    - MPIプロセス分割方法はブロック分割に固定
    - **NPS** は **NPS1** に固定
- ステップ3
    - **coll_hcoll_enable** とMPIプロセス分割方法と **NPS** を組合せた8パターンを検証してこれらの最適値を決定
    - **UCX_TLS** と **UCX_RNDV_THRESH** はステップ1で決定した最適値を使用
    - **UCX_ZCOPY_THRESH** はステップ2で決定した最適値を使用

## 3-1. ノード当たり8 MPIプロセス

### 3-1-0. 概要

本章は、4ノードにノード当たり8 MPIプロセスでトータル32 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,ud | intra:32kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:64kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 256Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 32KBから8MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

### 3-1-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-1-1 Alltoall](#1-1-1-alltoall)** の結果から32kbとしています。

![Alltoall 4 node 8 ppn all step1](ata_04_08_all_step1.png)

![Alltoall 4 node 8 ppn rc step1](ata_04_08_rc_step1.png)

![Alltoall 4 node 8 ppn ud step1](ata_04_08_ud_step1.png)

![Alltoall 4 node 8 ppn dc step1](ata_04_08_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:32kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 4 node 8 ppn step1](ata_04_08_step1.png)

以上より、 **UCX_TLS** を **self,sm,ud** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 4 node 8 ppn step2](ata_04_08_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 4 node 8 ppn step3](ata_04_08_step3.png)

### 3-1-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-1-2 Allgather](#1-1-2-allgather)** の結果から64kbとしています。

![Allgather 4 node 8 ppn all step1](aga_04_08_all_step1.png)

![Allgather 4 node 8 ppn rc step1](aga_04_08_rc_step1.png)

![Allgather 4 node 8 ppn ud step1](aga_04_08_ud_step1.png)

![Allgather 4 node 8 ppn dc step1](aga_04_08_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:64kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 4 node 8 ppn step1](aga_04_08_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 4 node 8 ppn step2](aga_04_08_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 4 node 8 ppn step3](aga_04_08_step3.png)

### 3-1-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-1-3 Allreduce](#1-1-3-allreduce)** の結果から128kbとしています。

![Allreduce 4 node 8 ppn all step1](are_04_08_all_step1.png)

![Allreduce 4 node 8 ppn rc step1](are_04_08_rc_step1.png)

![Allreduce 4 node 8 ppn ud step1](are_04_08_ud_step1.png)

![Allreduce 4 node 8 ppn dc step1](are_04_08_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 4 node 8 ppn step1](are_04_08_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 4 node 8 ppn step2](are_04_08_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 4 node 8 ppn step3](are_04_08_step3.png)

## 3-2. ノード当たり16 MPIプロセス

### 3-2-0. 概要

本章は、4ノードにノード当たり16 MPIプロセスでトータル64 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,ud | intra:32kb,inter:32kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:32kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 1KBまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 8KBから8MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

### 3-2-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-2-1 Alltoall](#1-2-1-alltoall)** の結果から32kbとしています。

![Alltoall 4 node 16 ppn all step1](ata_04_16_all_step1.png)

![Alltoall 4 node 16 ppn rc step1](ata_04_16_rc_step1.png)

![Alltoall 4 node 16 ppn ud step1](ata_04_16_ud_step1.png)

![Alltoall 4 node 16 ppn dc step1](ata_04_16_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:32kb,inter:32kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 4 node 16 ppn step1](ata_04_16_step1.png)

以上より、 **UCX_TLS** を **self,sm,ud** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 4 node 16 ppn step2](ata_04_16_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 4 node 16 ppn step3](ata_04_16_step3.png)

### 3-2-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-2-2 Allgather](#1-2-2-allgather)** の結果から32kbとしています。

![Allgather 4 node 16 ppn all step1](aga_04_16_all_step1.png)

![Allgather 4 node 16 ppn rc step1](aga_04_16_rc_step1.png)

![Allgather 4 node 16 ppn ud step1](aga_04_16_ud_step1.png)

![Allgather 4 node 16 ppn dc step1](aga_04_16_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:32kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 4 node 16 ppn step1](aga_04_16_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 4 node 16 ppn step2](aga_04_16_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 4 node 16 ppn step3](aga_04_16_step3.png)

### 3-2-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-2-3 Allreduce](#1-2-3-allreduce)** の結果から128kbとしています。

![Allreduce 4 node 16 ppn all step1](are_04_16_all_step1.png)

![Allreduce 4 node 16 ppn rc step1](are_04_16_rc_step1.png)

![Allreduce 4 node 16 ppn ud step1](are_04_16_ud_step1.png)

![Allreduce 4 node 16 ppn dc step1](are_04_16_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 4 node 16 ppn step1](are_04_16_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 4 node 16 ppn step2](are_04_16_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 4 node 16 step3](are_04_16_step3.png)

## 3-3. ノード当たり32 MPIプロセス

### 3-3-0. 概要

本章は、4ノードにノード当たり32 MPIプロセスでトータル128 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,ud | intra:16kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:16kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 256Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 16KBから4MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - 1MBまでと16MBから1GBまでのメッセージサイズで使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

### 3-3-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-3-1 Alltoall](#1-3-1-alltoall)** の結果から16kbとしています。

![Alltoall 4 node 32 ppn all step1](ata_04_32_all_step1.png)

![Alltoall 4 node 32 ppn rc step1](ata_04_32_rc_step1.png)

![Alltoall 4 node 32 ppn ud step1](ata_04_32_ud_step1.png)

![Alltoall 4 node 32 ppn dc step1](ata_04_32_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 4 node 32 ppn step1](ata_04_32_step1.png)

以上より、 **UCX_TLS** を **self,sm,ud** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 4 node 32 ppn step2](ata_04_32_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 4 node 32 step3](ata_04_32_step3.png)

### 3-3-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-3-2 Allgather](#1-3-2-allgather)** の結果から16kbとしています。

![Allgather 4 node 32 ppn all step1](aga_04_32_all_step1.png)

![Allgather 4 node 32 ppn rc step1](aga_04_32_rc_step1.png)

![Allgather 4 node 32 ppn ud step1](aga_04_32_ud_step1.png)

![Allgather 4 node 32 ppn dc step1](aga_04_32_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 4 node 32 ppn step1](aga_04_32_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 4 node 32 ppn step2](aga_04_32_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 4 node 32 ppn step3](aga_04_32_step3.png)

### 3-3-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-3-3 Allreduce](#1-3-3-allreduce)** の結果から128kbとしています。

![Allreduce 4 node 32 ppn all step1](are_04_32_all_step1.png)

![Allreduce 4 node 32 ppn rc step1](are_04_32_rc_step1.png)

![Allreduce 4 node 32 ppn ud step1](are_04_32_ud_step1.png)

![Allreduce 4 node 32 ppn dc step1](are_04_32_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 4 node 32 ppn step1](are_04_32_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 4 node 32 ppn step2](are_04_32_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 4 node 32 ppn step3](are_04_32_step3.png)

## 3-4. ノード当たり36 MPIプロセス

### 3-4-0. 概要

本章は、4ノードにノード当たり36 MPIプロセスでトータル144 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,ud | intra:16kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:16kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 256Bまでのメッセージサイズで使用する場合が使用しない場合に対しておおむね優位
- **Allgather**
    - 8Bから1KBまでと8KBから4MBまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

### 3-4-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-4-1 Alltoall](#1-4-1-alltoall)** の結果から16kbとしています。

![Alltoall 4 node 36 ppn all step1](ata_04_36_all_step1.png)

![Alltoall 4 node 36 ppn rc step1](ata_04_36_rc_step1.png)

![Alltoall 4 node 36 ppn ud step1](ata_04_36_ud_step1.png)

![Alltoall 4 node 36 ppn dc step1](ata_04_36_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 4 node 36 ppn step1](ata_04_36_step1.png)

以上より、 **UCX_TLS** を **self,sm,ud** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 4 node 36 ppn step2](ata_04_36_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 4 node 36 ppn step3](ata_04_36_step3.png)

### 3-4-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-4-2 Allgather](#1-4-2-allgather)** の結果から16kbとしています。

![Allgather 4 node 36 ppn all step1](aga_04_36_all_step1.png)

![Allgather 4 node 36 ppn rc step1](aga_04_36_rc_step1.png)

![Allgather 4 node 36 ppn ud step1](aga_04_36_ud_step1.png)

![Allgather 4 node 36 ppn dc step1](aga_04_36_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 4 node 36 ppn step1](aga_04_36_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 4 node 36 ppn step2](aga_04_36_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 4 node 36 ppn step3](aga_04_36_step3.png)

### 3-4-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-4-3 Allreduce](#1-4-3-allreduce)** の結果から128kbとしています。

![Allreduce 4 node 36 ppn all step1](are_04_36_all_step1.png)

![Allreduce 4 node 36 ppn rc step1](are_04_36_rc_step1.png)

![Allreduce 4 node 36 ppn ud step1](are_04_36_ud_step1.png)

![Allreduce 4 node 36 ppn dc step1](are_04_36_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 4 node 36 ppn step1](are_04_36_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 4 node 36 ppn step2](are_04_36_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 4 node 36 ppn step3](are_04_36_step3.png)

***
# 4.  8ノード

## 4-0. 概要

本章は、8ノードにノード当たり8・16・32・36の各MPIプロセス、トータルで64・128・256・288の各MPIプロセスを割当てる場合の各MPI集合通信関数の通信性能について、以下の **実行時パラメータ** の最適な組み合わせを検証します。

- **UCX_TLS** ： **all** ・ **self,sm,rc** ・ **self,sm,ud** ・ **self,sm,dc**
- **UCX_RNDV_THRESH** ： **auto** ・ **4kb** ・ **8kb** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb** （※14）
- **UCX_ZCOPY_THRESH** ： **auto** ・ **4kb** ・ **8kb** ・ **16kb** ・ **32kb** ・ **64kb** ・ **128kb**
- **coll_hcoll_enable** ： **0** ・ **1**
- MPIプロセス分割方法 ： ブロック分割・サイクリック分割
- **NPS** ：  **1** ・ **2**

※14） **UCX_RNDV_THRESH** は、ノード内は **auto** と **[1. 1ノード](#1--1ノード)** で判明した最適値、ノード間はここに記載の7種類を使用し、以下8個の組合せを検証します。

- **intra:auto,inter:auto**
- **intra:optimal_value,inter:auto**
- **intra:optimal_value,inter:4kb**
- **intra:optimal_value,inter:8kb**
- **intra:optimal_value,inter:16kb**
- **intra:optimal_value,inter:32kb**
- **intra:optimal_value,inter:64kb**
- **intra:optimal_value,inter:128kb**

ここで、全ての **実行時パラメータ** の組み合わせを検証することは非現実的なため、組み合わせを減らす目的で以下3ステップに分けて検証を行います。

- ステップ1
    - **UCX_TLS** と **UCX_RNDV_THRESH** を組合せた32個のパターンを検証してこれらの最適値を決定
    - **coll_hcoll_enable** は **1** に固定
    - MPIプロセス分割方法はブロック分割に固定
    - **NPS** は **NPS1** に固定
- ステップ2
    - **UCX_ZCOPY_THRESH** の7パターンを検証してこの最適値を決定
    - **UCX_TLS** と **UCX_RNDV_THRESH** はステップ1で決定した最適値を使用
    - **coll_hcoll_enable** は **1** に固定
    - MPIプロセス分割方法はブロック分割に固定
    - **NPS** は **NPS1** に固定
- ステップ3
    - **coll_hcoll_enable** とMPIプロセス分割方法と **NPS** を組合せた8パターンを検証してこれらの最適値を決定
    - **UCX_TLS** と **UCX_RNDV_THRESH** はステップ1で決定した最適値を使用
    - **UCX_ZCOPY_THRESH** はステップ2で決定した最適値を使用

## 4-1. ノード当たり8 MPIプロセス

### 4-1-0. 概要

本章は、8ノードにノード当たり8 MPIプロセスでトータル64 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,rc | intra:32kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:64kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 1KBまでのメッセージサイズで使用する場合が使用しない場合に対して優位
    - 2MBから4MBまでのメッセージサイズで使用しない場合が使用する場合に対して優位
- **Allgather**
    - 32KBから4MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、以下の傾向がみられます。

- **Alltoall**
    - 有意な差は無し
- **Allgather**
    - 256KBから4MBのメッセージサイズでサイクリック分割がブロック分割に対して優位
- **Allreduce**
    - 有意な差は無し

### 4-1-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-1-1 Alltoall](#1-1-1-alltoall)** の結果から32kbとしています。

![Alltoall 8 node 8 ppn all step1](ata_08_08_all_step1.png)

![Alltoall 8 node 8 ppn rc step1](ata_08_08_rc_step1.png)

![Alltoall 8 node 8 ppn ud step1](ata_08_08_ud_step1.png)

![Alltoall 8 node 8 ppn dc step1](ata_08_08_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:32kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 8 node 8 ppn step1](ata_08_08_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 8 node 8 ppn step2](ata_08_08_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 8 node 8 ppn step3](ata_08_08_step3.png)

### 4-1-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-1-2 Allgather](#1-1-2-allgather)** の結果から64kbとしています。

![Allgather 8 node 8 ppn all step1](aga_08_08_all_step1.png)

![Allgather 8 node 8 ppn rc step1](aga_08_08_rc_step1.png)

![Allgather 8 node 8 ppn ud step1](aga_08_08_ud_step1.png)

![Allgather 8 node 8 ppn dc step1](aga_08_08_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:64kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 8 node 8 ppn step1](aga_08_08_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 8 node 8 ppn step2](aga_08_08_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 8 node 8 ppn step3](aga_08_08_step3.png)

### 4-1-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-1-3 Allreduce](#1-1-3-allreduce)** の結果から128kbとしています。

![Allreduce 8 node 8 ppn all step1](are_08_08_all_step1.png)

![Allreduce 8 node 8 ppn rc step1](are_08_08_rc_step1.png)

![Allreduce 8 node 8 ppn ud step1](are_08_08_ud_step1.png)

![Allreduce 8 node 8 ppn dc step1](are_08_08_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 8 node 8 ppn step1](are_08_08_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 8 node 8 ppn step2](are_08_08_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 8 node 8 ppn step3](are_08_08_step3.png)

## 4-2. ノード当たり16 MPIプロセス

### 4-2-0. 概要

本章は、8ノードにノード当たり16 MPIプロセスでトータル128 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,rc | intra:32kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:32kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 128Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 32Bから512Bのメッセージサイズで使用する場合が使用しない場合に対して優位
    - 8KBから4MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

### 4-2-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-2-1 Alltoall](#1-2-1-alltoall)** の結果から32kbとしています。

![Alltoall 8 node 16 ppn all step1](ata_08_16_all_step1.png)

![Alltoall 8 node 16 ppn rc step1](ata_08_16_rc_step1.png)

![Alltoall 8 node 16 ppn ud step1](ata_08_16_ud_step1.png)

![Alltoall 8 node 16 ppn dc step1](ata_08_16_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:32kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 8 node 16 ppn step1](ata_08_16_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 8 node 16 ppn step2](ata_08_16_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 8 node 16 ppn step3](ata_08_16_step3.png)

### 4-2-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-2-2 Allgather](#1-2-2-allgather)** の結果から32kbとしています。

![Allgather 8 node 16 ppn all step1](aga_08_16_all_step1.png)

![Allgather 8 node 16 ppn rc step1](aga_08_16_rc_step1.png)

![Allgather 8 node 16 ppn ud step1](aga_08_16_ud_step1.png)

![Allgather 8 node 16 ppn dc step1](aga_08_16_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:32kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 8 node 16 ppn step1](aga_08_16_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 8 node 16 ppn step2](aga_08_16_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 8 node 16 ppn step3](aga_08_16_step3.png)

### 4-2-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-2-3 Allreduce](#1-2-3-allreduce)** の結果から128kbとしています。

![Allreduce 8 node 16 ppn all step1](are_08_16_all_step1.png)

![Allreduce 8 node 16 ppn rc step1](are_08_16_rc_step1.png)

![Allreduce 8 node 16 ppn ud step1](are_08_16_ud_step1.png)

![Allreduce 8 node 16 ppn dc step1](are_08_16_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 8 node 16 ppn step1](are_08_16_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 8 node 16 ppn step2](are_08_16_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 8 node 16 step3](are_08_16_step3.png)

## 4-3. ノード当たり32 MPIプロセス

### 4-3-0. 概要

本章は、8ノードにノード当たり32 MPIプロセスでトータル256 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,ud | intra:16kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:16kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 512Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allgather**
    - 32Bから256Bのメッセージサイズで使用する場合が使用しない場合に対して優位
    - 8KBから2MBのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、以下の傾向がみられます。

- **Alltoall**
    - 有意な差は無し
- **Allgather**
    - 有意な差は無し
- **Allreduce**
    - 512KBから2MBのメッセージサイズで **NPS1** が **NPS2** に対して優位

### 4-3-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-3-1 Alltoall](#1-3-1-alltoall)** の結果から16kbとしています。

![Alltoall 8 node 32 ppn all step1](ata_08_32_all_step1.png)

![Alltoall 8 node 32 ppn rc step1](ata_08_32_rc_step1.png)

![Alltoall 8 node 32 ppn ud step1](ata_08_32_ud_step1.png)

![Alltoall 8 node 32 ppn dc step1](ata_08_32_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 8 node 32 ppn step1](ata_08_32_step1.png)

以上より、 **UCX_TLS** を **self,sm,ud** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 8 node 32 ppn step2](ata_08_32_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 8 node 32 step3](ata_08_32_step3.png)

### 4-3-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-3-2 Allgather](#1-3-2-allgather)** の結果から16kbとしています。

![Allgather 8 node 32 ppn all step1](aga_08_32_all_step1.png)

![Allgather 8 node 32 ppn rc step1](aga_08_32_rc_step1.png)

![Allgather 8 node 32 ppn ud step1](aga_08_32_ud_step1.png)

![Allgather 8 node 32 ppn dc step1](aga_08_32_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 8 node 32 ppn step1](aga_08_32_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 8 node 32 ppn step2](aga_08_32_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 8 node 32 ppn step3](aga_08_32_step3.png)

### 4-3-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-3-3 Allreduce](#1-3-3-allreduce)** の結果から128kbとしています。

![Allreduce 8 node 32 ppn all step1](are_08_32_all_step1.png)

![Allreduce 8 node 32 ppn rc step1](are_08_32_rc_step1.png)

![Allreduce 8 node 32 ppn ud step1](are_08_32_ud_step1.png)

![Allreduce 8 node 32 ppn dc step1](are_08_32_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 8 node 32 ppn step1](are_08_32_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 8 node 32 ppn step2](are_08_32_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 8 node 32 ppn step3](are_08_32_step3.png)

## 4-4. ノード当たり36 MPIプロセス

### 4-4-0. 概要

本章は、8ノードにノード当たり36 MPIプロセスでトータル288 MPIプロセスを割当てる場合の最適な **実行時パラメータ** の組み合わせを、MPI集合通信関数毎に検証します。

下表は、MPI集合通信関数毎の最適な **UCX_TLS** 、 **UCX_RNDV_THRESH** 、及び **UCX_ZCOPY_THRESH** を示しており、この設定値を使用することでデフォルト値に対して性能が向上します。

| MPI集合通信関数     | UCX_TLS    | UCX_RNDV_THRESH         | UCX_ZCOPY_THRESH |
| :-----------: | :--------: | :---------------------: | :--------------: |
| **Alltoall**  | self,sm,ud | intra:16kb,inter:128kb  | 128kb            |
| **Allgather** | self,sm,rc | intra:16kb,inter:128kb  | 128kb            |
| **Allreduce** | self,sm,rc | intra:128kb,inter:128kb | 128kb            |

**HCOLL** 使用の有無は、以下の傾向がみられます。

- **Alltoall**
    - 512Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
    - 16KBから64KBまでのメッセージサイズで使用しない場合が使用する場合に対して優位
- **Allgather**
    - 4Bから512Bまでのメッセージサイズで使用する場合が使用しない場合に対して優位
    - 8KBから2MBまでのメッセージサイズで使用する場合が使用しない場合に対して優位
- **Allreduce**
    - メッセージサイズ全域で使用する場合が使用しない場合に対して優位

**NPS** とMPIプロセス分割方法は、その違いによる有意な差はみられません。

### 4-4-1. Alltoall

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Alltoall** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-4-1 Alltoall](#1-4-1-alltoall)** の結果から16kbとしています。

![Alltoall 8 node 36 ppn all step1](ata_08_36_all_step1.png)

![Alltoall 8 node 36 ppn rc step1](ata_08_36_rc_step1.png)

![Alltoall 8 node 36 ppn ud step1](ata_08_36_ud_step1.png)

![Alltoall 8 node 36 ppn dc step1](ata_08_36_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Alltoall 8 node 36 ppn step1](ata_08_36_step1.png)

以上より、 **UCX_TLS** を **self,sm,ud** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Alltoall** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Alltoall 8 node 36 ppn step2](ata_08_36_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Alltoall** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Alltoall 8 node 36 ppn step3](ata_08_36_step3.png)

### 4-4-2. Allgather

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allgather** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-4-2 Allgather](#1-4-2-allgather)** の結果から16kbとしています。

![Allgather 8 node 36 ppn all step1](aga_08_36_all_step1.png)

![Allgather 8 node 36 ppn rc step1](aga_08_36_rc_step1.png)

![Allgather 8 node 36 ppn ud step1](aga_08_36_ud_step1.png)

![Allgather 8 node 36 ppn dc step1](aga_08_36_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:16kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allgather 8 node 36 ppn step1](aga_08_36_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allgather** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allgather 8 node 36 ppn step2](aga_08_36_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allgather** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allgather 8 node 36 ppn step3](aga_08_36_step3.png)

### 4-4-3. Allreduce

[ステップ1]

以下のグラフは、 **UCX_RNDV_THRESH** を変化させたときの **Allreduce** の結果を、 **UCX_TLS** の設定値毎に示しています。 **coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。  
なお、ノード内の **UCX_RNDV_THRESH** の最適値は、 **[1-4-3 Allreduce](#1-4-3-allreduce)** の結果から128kbとしています。

![Allreduce 8 node 36 ppn all step1](are_08_36_all_step1.png)

![Allreduce 8 node 36 ppn rc step1](are_08_36_rc_step1.png)

![Allreduce 8 node 36 ppn ud step1](are_08_36_ud_step1.png)

![Allreduce 8 node 36 ppn dc step1](are_08_36_dc_step1.png)

以上より、 **UCX_RNDV_THRESH** を **intra:128kb,inter:128kb** とした場合が最も性能が良いと判断してこれを固定し、 **UCX_TLS** の各設定値を比較したものが以下のグラフです。

![Allreduce 8 node 36 ppn step1](are_08_36_step1.png)

以上より、 **UCX_TLS** を **self,sm,rc** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ2]

以下のグラフは、 **UCX_ZCOPY_THRESH** を変化させたときの **Allreduce** の結果です。**coll_hcoll_enable** ・MPIプロセス分割方法・ **NPS** は、ここではそれぞれ **1** ・ブロック分割・ **NPS1** としています。

![Allreduce 8 node 36 ppn step2](are_08_36_step2.png)

以上より、 **UCX_ZCOPY_THRESH** を **128kb** とした場合が最も性能が良いと判断してこれを固定します。

[ステップ3]

以下のグラフは、 **NPS** ・MPIプロセス分割方法・ **HCOLL** 使用の有無の各組み合わせで **Allreduce** の結果を示しています。  
なお **HCOLL** 使用の有無は、 **NPS1** とブロック分割の組み合わせのみ使用する場合と使用しない場合をグラフにプロットし、それ以外は使用する場合のみグラフにプロットしています。  
また比較対象として、全てのパラメータをデフォルトとした **NPS1** とブロック分割の組合せを記載しています。

![Allreduce 8 node 36 ppn step3](are_08_36_step3.png)