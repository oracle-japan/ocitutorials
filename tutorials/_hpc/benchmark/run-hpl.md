---
title: "HPL実行方法"
excerpt: "本ドキュメントは、HPCワークロードの実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでHPCワークロード向けベアメタルインスタンスをノード間接続するHPCクラスタで、標準ベンチマークのHPLを実行する方法を解説します。"
order: "211"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

本ドキュメントは、HPCワークロードの実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用の **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** でHPCワークロード向けベアメタルインスタンスをノード間接続するHPCクラスタで、標準ベンチマークの **[HPL](https://www.netlib.org/benchmark/hpl/)** を実行する方法を解説します。

***
# 0. 概要

本ドキュメントで解説する **HPL** の実行は、 **[Intel oneAPI Math Kernel Library for Linux](https://www.xlsoft.com/jp/products/intel/perflib/mkl/index.html)** （本ドキュメントで使用するバージョンは2023.2）に含まれるIntelの **HPL** 実装である **[Intel Distribution for LINPACK Benchmark](https://www.intel.com/content/www/us/en/docs/onemkl/developer-guide-linux/2023-1/intel-distribution-for-linpack-benchmark.html)** を **[Intel MPI Library](https://www.xlsoft.com/jp/products/intel/cluster/mpi/index.html)** （本ドキュメントで使用するバージョンは2021.10）と共に使用します。  
なお、 **Intel oneAPI Math Kernel Library for Linux** と **Intel MPI Library** は、 **[Intel oneAPI HPC Toolkit](https://www.xlsoft.com/jp/products/intel/oneapi/hpc/index.html)** （本ドキュメントで使用するバージョンは2023.2）に含まれているものを使用します。

**HPL** を実行するHPCクラスタは、HPCワークロード向けベアメタルシェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** 2インスタンスを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続した構成とし、 **HPL** の性能向上を目的にインスタンスをデプロイする際のBIOS設定 **NUMA setting** を **NPS2** とします。  
計算ノードのOSは、 **Oracle Linux** 8ベースの **HPC[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を使用し、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** のカテゴリ **[HPCクラスタ](/ocitutorials/hpc/#1-1-hpcクラスタ)** のチュートリアルの手順に従う等により、計算ノード間でMPIが実行できるよう予め構築しておきます。

以上より、本ドキュメントで解説する **HPL** 実行は、以下の手順を経て行います。

- HPCクラスタのデプロイ
- **Intel oneAPI HPC Toolkit** インストール
- **Intel Distribution for LINPACK Benchmark** セットアップ
- **HPL** 実行

本ドキュメントは、以下の環境で **HPL** を実行しており、以下の性能が出ています。

[実行環境]
- シェイプ: **BM.Optimized3.36**
- OS: **Oracle Linux** 8.7 (HPC **クラスタネットワーキングイメージ** )
-  **HPL** : **Intel oneAPI Math Kernel Library for Linux** （バージョン2023.2）の **Intel Distribution for LINPACK Benchmark**
- MPI: **Intel MPI Library** （バージョン2021.10）
- ノード数: 2
- ノード間接続: **クラスタ・ネットワーク**
- 問題サイズ(N): 353,280
- ブロックサイズ(NB): 384
- プロセスグリッド(PxQ): 2x4

[実行結果]
- FLOPS: 4,925 GFLOPS
- 所要時間: 5,969秒

***
# 1. HPCクラスタのデプロイ

本章は、計算ノードに使用する **BM.Optimized3.36** のBIOS設定 **NUMA setting** を **NPS2** とし、2ノードのHPCクラスタをデプロイします。

HPCクラスタデプロイ時の計算ノードのBIOS設定は、 **[パフォーマンス関連Tips集](/ocitutorials/hpc/#2-2-パフォーマンス関連tips集)** の **[パフォーマンスに関連するベア・メタル・インスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照ください。

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
具体的には、以下の作業を実施します。

- **Intel Distribution for LINPACK Benchmark** 実行用ディレクトリ作成
- **HPL.dat** [^hpl_dat]修正
- **runme_intel64_dynamic** [^runme_intel64_dynamic]修正

[^hpl_dat]: HPLを実行する際のパラメータ値を指定する設定ファイル
[^runme_intel64_dynamic]: Intel_Distribution_for_LINPACK_Benchmarkが提供するHPL実行スクリプト

1. 以下コマンドを全計算ノードのopcユーザで実行し、 **Intel Distribution for LINPACK Benchmark** 実行用のディレクトリを作成します。  
コマンド中の **dest_dir** は、全計算ノードで共有されるディレクトリがあればその配下に、無ければ **/tmp** ディレクトリとします。このディレクトリを共有ディレクトリ配下にすることで、この実行用ディレクトリ作成と後の **HPL.dat** の修正を実施する対象ノードを1ノードで済ますことが可能になります。

    ```sh
    $ cp -pR /opt/intel/oneapi/mkl/latest/benchmarks/mp_linpack /dest_dir/
    ```

2. **Intel Distribution for LINPACK Benchmark** 実行用ディレクトリ（ **/dest_dir/mp_linpack** ）直下のファイル **HPL.dat** 中の **HPL** 関連パラメータを、以下のように設定します。

    | ファイル中の行・カラム | パラメータ     | 設定値     | 備考                                                     |
    | ----------- | --------- | ------- | ------------------------------------------------------ |
    | 6行目・1カラム目   | 問題サイズN    | 353,280 | デプロイ直後の計算ノード空きメモリサイズ490 GiBに10 GiB程度の余裕を持たせて算出             |
    | 8行目・1カラム目   | ブロックサイズNB | 384     | **Intel oneAPI Math Kernel Library for Linux** ドキュメントに記載のAVX-512搭載プロセッサ用推奨値 |
    | 11行目・1カラム目  | プロセスグリッドのP値 | 2       | 使用するMPIプロセス数8からPxQを2x4に設定                              |
    | 12行目・1カラム目  | プロセスグリッドのQ値 | 4       | 使用するMPIプロセス数8からPxQを2x4に設定                              |
    |             |           |         |                                                        |

3. **Intel Distribution for LINPACK Benchmark** 実行用ディレクトリ（ **/dest_dir/mp_linpack** ）直下のファイル **runme_intel64_dynamic** 中の **MPI** 関連パラメータを、以下のように設定します。

    | ファイル中の行 | パラメータ        | 設定値 | 備考                                 |
    | ------- | ------------ | --- | ---------------------------------- |
    | 20行目    | MPI_PROC_NUM | 8   | NUMAノード当たり1 MPIプロセス・2ノードトータルで8プロセス |
    | 25行目    | MPI_PER_NODE | 4   | NUMAノード当たり1 MPIプロセス・ノード当たり4プロセス    |
    |         |              |     |                                    |

***
# 4. HPL実行

本章は、先に設定した **HPL** と **MPI** の実行パラメータを使用し、 **HPL** を実行します。  
具体的には、以下の作業を実施します。

- ホストリストファイル[^hostlist]作成・配布
- スワップ領域の無効化
- OS再起動
-  **HPL** 実行

[^hostlist]: MPIを使用して2ノードでHPLを実行するため、この際に必要となる。

1. **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[計算ノードのホスト名リスト作成方法](/ocitutorials/hpc/tech-knowhow/compute-host-list/)** の手順を実施し、以下のように全ての計算ノードのホスト名を含むホスト名リストをファイル名 **hostlist.txt** で作成し、これを全計算ノードの **/dest_dir/mp_linpack** ディレクトリにコピーします。

    ```sh
    inst-wyr6m-comp
    inst-9wead-comp
    ```

2. /etc/fstabのスワップ領域を指定する行を以下のように削除し、以降のOS再起動でスワップ領域が無効化されるようにします。

    ```sh
    $ diff /etc/fstab_org /etc/fstab
    30d29
    < /.swapfile	none	swap	sw,comment=cloudconfig	0	0
    ```

3. 以下コマンドを全計算ノードのopcユーザで実行し、OSを再起動します。

    ```sh
    $ sudo shutdown -r now
    ```

4. 以下コマンドを計算ノードのうちの1ノードでopcユーザで実行します。  
この **HPL** 実行は、 **ノード当たり4プロセス・プロセス当たり9スレッド** で実行します。  
この際、プロセス当たりのスレッド数は、 **Intel oneAPI Math Kernel Library for Linux** がノードのコア配置から自動的にに設定するため、改めて指定する必要はありません。  
本ドキュメントの前提となる環境・設定で **HPL** 実行に要する時間は、2時間弱です。

    ```sh
    $ source /opt/intel/oneapi/setvars.sh
    $ export I_MPI_HYDRA_HOST_FILE=/dest_dir/mp_linpack/hostlist.txt
    $ export UCX_NET_DEVICES=mlx5_2:1
    $ cd /dest_dir/mp_linpack
    $ ./runme_intel64_dynamic
    ```