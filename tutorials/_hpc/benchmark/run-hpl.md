---
title: "HPL実行方法（BM.Optimized3.36編）"
excerpt: "本ドキュメントは、HPCワークロードの実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでHPCワークロード向けベアメタルインスタンスBM.Optimized3.36をノード間接続するHPCクラスタで、標準ベンチマークのHPLを実行する方法を解説します。"
order: "2110"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---
<style>
table, th, td {
    font-size: 80%;
}
</style>

***
# 0. 概要

本ドキュメントで解説する **[HPL](https://www.netlib.org/benchmark/hpl/)** の実行は、 **[Intel oneAPI Math Kernel Library for Linux](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html#gs.jwmn3t)** に含まれる **HPL** の実装である **[Intel Distribution for LINPACK Benchmark](https://www.intel.com/content/www/us/en/docs/onemkl/developer-guide-linux/2023-1/intel-distribution-for-linpack-benchmark.html)** を、 **[Intel MPI Library](https://www.intel.com/content/www/us/en/developer/tools/oneapi/mpi-library.html#gs.jwmodq)** と共に使用します。  
なお、 **Intel oneAPI Math Kernel Library for Linux** と **Intel MPI Library** は、 **[Intel oneAPI HPC Toolkit](https://www.intel.com/content/www/us/en/developer/tools/oneapi/hpc-toolkit.html#gs.jwmpak)** に含まれているものを使用します。

**HPL** を実行するHPCクラスタは、計算ノードに **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を使用し、 **HPL** の性能向上を目的に **NUMA nodes per socket** （以降 **NPS** と呼称します。）が **2** （以降 **NPS2** と呼称します。）で **Simultanious Multi Threading** （以降 **SMT** と呼称します。）が無効となるようBIOSで設定、2インスタンスを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続した構成とします。

以上より、本ドキュメントで解説する **HPL** 実行は、以下の手順を経て行います。

- HPCクラスタ構築
- **Intel oneAPI HPC Toolkit** インストール
- **Intel Distribution for LINPACK Benchmark** セットアップ
- **HPL** 実行

本ドキュメントは、以下の環境で **HPL** を実行しており、以下の性能が出ています。

[実行環境]
- シェイプ： **BM.Optimized3.36** （ **NPS2** **SMT** 無効）
- OS ： **Oracle Linux** 8.10ベースのHPC **クラスタネットワーキングイメージ**
- **HPL** ： **Intel oneAPI Math Kernel Library for Linux** （バージョン2025.0.1）の **Intel Distribution for LINPACK Benchmark**
- MPI： **Intel MPI Library** （バージョン2021.14.1）
- ノード数： 2
- ノード間接続： **クラスタ・ネットワーク**
- 問題サイズ(N)： 353,280
- ブロックサイズ(NB)： 384
- プロセスグリッド(PxQ)： 2x4

[実行結果]
- FLOPS： **4,921 GFLOPS**
- 所要時間： 5,999 秒

***
# 1. HPCクラスタ構築

本章は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** のカテゴリ **[HPCクラスタ](/ocitutorials/hpc/#1-1-hpcクラスタ)** のチュートリアルの手順に従う等により、HPCクラスタを構築します。  
この際、 **NPS** を **NPS2** とし **SMT** を無効化するようBIOSを設定した（※1）2ノードの **BM.Optimized3.36** を計算ノードに使用し、そのOSに **Oracle Linux** 8.10ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※2）を使用します。

※1）**NPS** と **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

※2）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** です。

***
# 2. Intel oneAPI HPC Toolkitインストール

本章は、 **HPL** を実行するHPCクラスタの計算ノードに **Intel oneAPI HPC Toolkit** をインストールします。

以下コマンドを全計算ノードのopcユーザで実行し、 **Intel oneAPI HPC Toolkit** をインストールします。

```sh
$ sudo yum-config-manager --add-repo https://yum.repos.intel.com/oneapi
$ sudo rpm --import https://yum.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
$ sudo dnf install -y intel-basekit
$ sudo dnf install -y intel-hpckit
```

***
# 3. Intel Distribution for LINPACK Benchmarkセットアップ

本章は、先にインストールした **Intel oneAPI HPC Toolkit** に含まれる **Intel Distribution for LINPACK Benchmark** を、2ノードの **BM.Optimized3.36** （AVX-512搭載プロセッサ・主記憶容量512GB）で実行する際に最大の性能を得るよう、事前準備を実施します。

以下コマンドを全計算ノードの **HPL** 実行ユーザで実行し、 **Intel Distribution for LINPACK Benchmark** 実行用のディレクトリを作成します。  
コマンド中の **/dest_dir** は、全計算ノードで共有されるディレクトリがあればその配下に、無ければ **/tmp** ディレクトリとします。このディレクトリを共有ディレクトリ配下にすることで、この実行用ディレクトリ作成と後のセットアップを実施する対象ノードを1ノードで済ますことが可能になります。

```sh
$ cp -pR /opt/intel/oneapi/mkl/latest/share/mkl/benchmarks/mp_linpack /dest_dir/
```

次に、 **Intel Distribution for LINPACK Benchmark** 実行用ディレクトリ（ **/dest_dir/mp_linpack** ）直下のファイル **HPL.dat** （※3）中の **HPL** 関連パラメータを、以下のように設定します。

※3）HPLを実行する際のパラメータ値を指定する設定ファイルです。

| ファイル中の<br>行・カラム | パラメータ       | 設定値     | 備考                                                                          |
| :-------------: | :---------: | ------: | --------------------------------------------------------------------------- |
| 6行目<br>1カラム目       | 問題サイズN      | 353,280 | 作成直後の計算ノード空きメモリサイズ490 GiBに10 GiB程度の余裕を<br>持たせて算出                                |
| 8行目<br>1カラム目       | ブロックサイズNB   | 384     | **Intel oneAPI Math Kernel Library for Linux**ドキュメントに記載の<br>AVX-512搭載プロセッサ用推奨値 |
| 11行目<br>1カラム目      | プロセスグリッドのP値 | 2       | 使用するMPIプロセス数8からPxQを2x4に設定                                                   |
| 12行目<br>1カラム目      | プロセスグリッドのQ値 | 4       | 使用するMPIプロセス数8からPxQを2x4に設定                                                   |

次に、 **Intel Distribution for LINPACK Benchmark** 実行用ディレクトリ（ **/dest_dir/mp_linpack** ）直下のファイル **runme_intel64_dynamic** 中の **MPI** 関連パラメータを、以下のように設定します。

| ファイル中の行 | パラメータ        | 設定値 | 備考                                 |
| :-----: | :----------: | --: | :--------------------------------: |
| 20行目    | MPI_PROC_NUM | 8   | NUMAノード当たり1 MPIプロセス・2ノードトータルで8プロセス |
| 25行目    | MPI_PER_NODE | 4   | NUMAノード当たり1 MPIプロセス・ノード当たり4プロセス    |

次に、以下コマンドを **HPL** 実行ユーザで実行します。

```sh
$ cd /dest_dir/mp_linpack
$ cp runme_intel64_prv.txt runme_intel64_prv
```

***
# 4. HPL実行

本章は、先に設定した **HPL** と **MPI** の実行パラメータを使用し、 **HPL** を実行します。

**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[計算/GPUノードのホスト名リスト作成方法](/ocitutorials/hpc/tech-knowhow/compute-host-list/)** の手順に従い、 **HPL** を実行する全ての計算ノードのホスト名を記載したホストリストファイルを、 **HPL** 実行ユーザのホームディレクトリ直下に **hostlist.txt** として作成します。

次に、 **/etc/fstab** ファイルのスワップ領域を指定する行を以下のようにコメントとし、以降のOS再起動でスワップ領域が無効化されるようにします。

```sh
$ diff /etc/fstab_org /etc/fstab
32c32
< /.swapfile	none	swap	sw,comment=cloudconfig	0	0
---
> #/.swapfile	none	swap	sw,comment=cloudconfig	0	0
$
```

次に、以下コマンドを全計算ノードのopcユーザで実行し、OSを再起動します。

```sh
$ sudo shutdown -r now
```

次に、以下コマンドを計算ノードのうちの1ノードで **HPL** 実行ユーザで実行します。  
この **HPL** 実行は、 **ノード当たり4プロセス・プロセス当たり9スレッド** で実行します。  
この際、プロセス当たりのスレッド数は、 **Intel oneAPI Math Kernel Library for Linux** がノードのコア配置から自動的にに設定するため、改めて指定する必要はありません。  
本ドキュメントの前提となる環境・設定で **HPL** 実行に要する時間は、2時間弱です。

```sh
$ source /opt/intel/oneapi/setvars.sh
$ export I_MPI_HYDRA_HOST_FILE=~/hostlist.txt
$ export UCX_NET_DEVICES=mlx5_2:1
$ cd /dest_dir/mp_linpack
$ ./runme_intel64_dynamic
```