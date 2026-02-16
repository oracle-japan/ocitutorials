---
title: "HPL実行方法（BM.Optimized3.36編）"
description: "本ドキュメントは、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでベア・メタル・シェイプBM.Optimized3.36をノード間接続するHPCクラスタで、浮動小数点演算性能を計測する標準ベンチマークのHPLを実行する方法を解説します。"
weight: "2111"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---
<style>
table, th, td {
    font-size: 80%;
}
</style>

# 0. 概要

本ドキュメントは、 **[Intel oneAPI Math Kernel Library for Linux](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html#gs.jwmn3t)** に含まれる **[HPL](https://www.netlib.org/benchmark/hpl/)** の実装である **[Intel Distribution for LINPACK Benchmark](https://www.intel.com/content/www/us/en/docs/onemkl/developer-guide-linux/2023-1/intel-distribution-for-linpack-benchmark.html)** を **[Intel MPI Library](https://www.intel.com/content/www/us/en/developer/tools/oneapi/mpi-library.html#gs.jwmodq)** と共に使用し、HPCクラスタの浮動小数点演算性能を計測する方法を解説します。  
なお、 **Intel oneAPI Math Kernel Library for Linux** と **Intel MPI Library** は、 **[Intel oneAPI HPC Toolkit](https://www.intel.com/content/www/us/en/developer/tools/oneapi/hpc-toolkit.html#gs.jwmpak)** に含まれるものを使用します。

以降では、計測環境の構築から各性能指標の計測方法まで、以下の順に解説します。

1. **[HPCクラスタ構築](#1-hpcクラスタ構築)**
2. **[Intel oneAPI HPC Toolkitインストール](#2-intel-oneapi-hpc-toolkitインストール)**
3. **[Intel Distribution for LINPACK Benchmarkセットアップ](#3-intel-distribution-for-linpack-benchmarkセットアップ)**
4. **[HPL実行](#4-hpl実行)**

本ドキュメントは、以下の環境で **HPL** を実行し、

- 計算ノード
    - シェイプ： **BM.Optimized3.36**
    - CPU： **Intel Xeon Gold** 6354 x 2（36コア）
    - メモリ： DDR4-3200 512 GB
    - 理論性能： 3.456 TFLOPS（ベース動作周波数3.0 GHz時）
    - メモリ帯域： 409.6 GB/s
    - **Simultanious Multi Threading** （以降 **SMT** と呼称します。）： 無効（※1）
    - **NUMA nodes per socket** （以降 **NPS** と呼称します。）： **1** / **2** （※1）
    - イメージ： **Oracle Linux** 9.05ベースのHPC **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※2）
- **HPL**
    - **Intel oneAPI Math Kernel Library for Linux** （バージョン2025.3.1）の **Intel Distribution for LINPACK Benchmark**
    - 問題サイズ(N)
        - 253,440（1ノード）
        - 353,280（2ノード）
    - ブロックサイズ(NB)： 384
    - プロセスグリッド(PxQ)
        - 1x2（1ノード **NPS1** ）
        - 2x2（1ノード **NPS2** ）
        - 2x2（2ノード **NPS1** ）
        - 2x4（2ノード **NPS2** ）
- MPI： **Intel MPI Library** （バージョン2021.17.2）

※1） **SMT** と **NPS** の設定方法は、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](../../benchmark/bios-setting/)** を参照してください。  
※2）**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.13** です。

以下の性能が出ています。

| ノード数 | NPS  | TFLOPS  | 所要時間    |
| :--: | :--: | ------: | ------: |
| 1    | NPS1 | 2.49642 | 4,347 秒 |
|      | NPS2 | 2.52395 | 4,300 秒 |
| 2    | NPS1 | 4.91762 | 5,977 秒 |
|      | NPS2 | 4.93174 | 5,960秒  |

# 1. HPCクラスタ構築

HPCクラスタの構築は、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ手動構築編)](../../spinup-cluster-network/)** / **[HPCクラスタを構築する(基礎インフラ自動構築編)](../../spinup-hpc-cluster-withterraform/)** 等の手順に従い実施します。

# 2. Intel oneAPI HPC Toolkitインストール

本章は、 **HPL** を実行するHPCクラスタの計算ノードに **Intel oneAPI HPC Toolkit** をインストールします。

以下コマンドを全計算ノードのopcユーザで実行し、 **Intel oneAPI HPC Toolkit** をインストールします。

```sh
$ sudo yum-config-manager --add-repo https://yum.repos.intel.com/oneapi
$ sudo rpm --import https://yum.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
$ sudo dnf install -y intel-basekit-2025.3.0 intel-hpckit-2025.3.0
```

# 3. Intel Distribution for LINPACK Benchmarkセットアップ

本章は、先にインストールした **Intel oneAPI HPC Toolkit** に含まれる **Intel Distribution for LINPACK Benchmark** を **BM.Optimized3.36** （AVX-512搭載プロセッサ・主記憶容量512GB）で実行する際、最大の性能を得るよう事前準備を実施します。

以下コマンドを全計算ノードの **HPL** 実行ユーザで実行し、 **Intel Distribution for LINPACK Benchmark** 実行用のディレクトリを作成します。  
コマンド中の **/dest_dir** は、全計算ノードで共有されるディレクトリがあればその配下に、無ければ **/tmp** ディレクトリとします。このディレクトリを共有ディレクトリ配下にすることで、この実行用ディレクトリ作成と後のセットアップを実施する対象ノードを1ノードで済ますことが可能になります。

```sh
$ cp -pR /opt/intel/oneapi/mkl/latest/share/mkl/benchmarks/mp_linpack /dest_dir/
```

次に、 **Intel Distribution for LINPACK Benchmark** 実行用ディレクトリ（ **/dest_dir/mp_linpack** ）直下のファイル **HPL.dat** （※3）中の **HPL** 関連パラメータを、使用するノード数に応じて以下のように設定します。

※3）HPLを実行する際のパラメータ値を指定する設定ファイルです。

| ファイル中の<br>行・カラム | パラメータ       | 設定値                                                                              | 備考                                                                             |
| :-------------: | :---------: | :------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
| 6行目<br>1カラム目    | 問題サイズN      | 253,440（1ノード）<br>353,280（2ノード）                                                   | 作成直後の計算ノード空きメモリサイズ490 GiBに10 GiB程度の余裕を<br>持たせて算出                               |
| 8行目<br>1カラム目    | ブロックサイズNB   | 384                                                                              | **Intel oneAPI Math Kernel Library for Linux**ドキュメントに記載の<br>AVX-512搭載プロセッサ用推奨値 |
| 11行目<br>1カラム目   | プロセスグリッドのP値 | 1（1ノード **NPS1** ）<br>2（1ノード **NPS2** ）<br>2（2ノード **NPS1** ）<br>2（2ノード **NPS2** ） | PxQの値を使用するMPIプロセス数に設定                                                          |
| 12行目<br>1カラム目   | プロセスグリッドのQ値 | 2（1ノード **NPS1** ）<br>2（1ノード **NPS2** ）<br>2（2ノード **NPS1** ）<br>4（2ノード **NPS2** ） | PxQの値を使用するMPIプロセス数に設定                                                          |

次に、以下コマンドを **HPL** 実行ユーザで **/dest_dir/mp_linpack** ディレクトリで実行します。

```sh
$ cp runme_intel64_dynamic.txt runme_intel64_dynamic
$ cp runme_intel64_prv.txt runme_intel64_prv
$ chmod 755 ./runme_intel64_dynamic ./runme_intel64_prv
```

次に、先にコピーして作成したファイル **runme_intel64_dynamic** 中の **MPI** 関連パラメータを以下のように設定します。

| ファイル中の行 | パラメータ        | 設定値 | 備考                                 |
| :-----: | :----------: | --: | :--------------------------------: |
| 20行目    | MPI_PROC_NUM | 2（1ノード **NPS1** ）<br>4（1ノード **NPS2** ）<br>4（2ノード **NPS1** ）<br>8（2ノード **NPS2** ）   | NUMAノード当たり1 MPIプロセスとした場合の総プロセス数 |
| 25行目    | MPI_PER_NODE |  2（1ノード **NPS1** ）<br>4（1ノード **NPS2** ）<br>2（2ノード **NPS1** ）<br>4（2ノード **NPS2** ）   | NUMAノード当たり1 MPIプロセスとした場合のノード当たりプロセス数    |

# 4. HPL実行

本章は、先に設定した **HPL** と **MPI** の実行パラメータを使用し、 **HPL** を実行します。

2ノード以上で実行する場合は、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[計算/GPUノードのホスト名リスト作成方法](../../tech-knowhow/compute-host-list/)** の手順に従い、 **HPL** を実行する全ての計算ノードのホスト名を記載したホストリストファイルを **HPL** 実行ユーザのホームディレクトリ直下に **hostlist.txt** として作成します。

次に、全計算ノードの **/etc/fstab** ファイルのスワップ領域を指定する行を以下のようにコメント化します。

```sh
$ diff /etc/fstab_org /etc/fstab
32c32
< /.swapfile	none	swap	sw,comment=cloudconfig	0	0
---
> #/.swapfile	none	swap	sw,comment=cloudconfig	0	0
$
```

次に、以下コマンドを全計算ノードのopcユーザで実行し、OS再起動でスワップ領域を無効化します。

```sh
$ sudo shutdown -r now
```

次に、以下コマンドを計算ノードのうちの1ノードで **HPL** 実行ユーザで実行します。  
この **HPL** 実行は、 **NPS** の設定により **プロセス当たり9/18スレッド** で実行しますが、これは **Intel oneAPI Math Kernel Library for Linux** がノードのコア配置から自動的にに設定するため、改めて指定する必要はありません。  
なお、使用するノード数が1ノードかそれ以上かにより実行するコマンドが異なる点に留意します。

```sh
$ source /opt/intel/oneapi/setvars.sh
$ export I_MPI_HYDRA_HOST_FILE=~/hostlist.txt # Only for 2 or more nodes
$ export UCX_NET_DEVICES=mlx5_2:1 # Only for 2 or more nodes
$ cd /dest_dir/mp_linpack
$ ./runme_intel64_dynamic
```