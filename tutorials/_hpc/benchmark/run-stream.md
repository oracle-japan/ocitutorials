---
title: "STREAM実行方法"
excerpt: "本ドキュメントは、HPCワークロードの実行に最適なベアメタルインスタンスで、標準ベンチマークのSTREAMを実行する方法を解説します。"
order: "212"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

本ドキュメントは、HPCワークロードの実行に最適なベアメタルインスタンスで、標準ベンチマークの **[STREAM](https://www.cs.virginia.edu/stream/)** を実行する方法を解説します。

***
# 0. 概要

本ドキュメントで解説する **STREAM** の実行は、 **[Intel oneAPI Base Toolkit](https://www.xlsoft.com/jp/products/intel/oneapi/index.html)** （本ドキュメントで使用するバージョンは2023.2）に含まれるCコンパイラの **[Intel oneAPI DPC++/C++ Compiler](https://www.xlsoft.com/jp/products/intel/compilers/dpcpp/index.html)** （本ドキュメントで使用するバージョンは2023.2）で **STREAM** のソースコードをコンパイルして作成したバイナリを使用します。

**STREAM** を実行するインスタンスは、HPCワークロード向けベアメタルシェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を **Oracle Linux** 8ベースの **HPC[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** でデプロイします。  
この際、 **STREAM** の性能向上を目的とし、インスタンスをデプロイする際のBIOS設定で **NUMA setting** を **NPS2** とします。

以上より、本ドキュメントで解説する **STREAM** 実行は、以下の手順を経て行います。

- **BM.Optimized3.36** インスタンスのデプロイ
- **Intel oneAPI Base Toolkit** インストール
- **STREAM** ダウンロード・コンパイル
- **STREAM** 実行

本ドキュメントは、以下の環境で **STREAM** を実行しており、以下の性能が出ています。

[実行環境]
- シェイプ: **BM.Optimized3.36** （ **NUMA setting** を **NPS2** に指定）
- OS: **Oracle Linux** 8.7 (HPC **クラスタネットワーキングイメージ** )
- **STREAM** : 5.10
- Cコンパイラ: **Intel oneAPI DPC++/C++ Compiler** 2023.2
- 配列サイズ(STREAM_ARRAY_SIZE): 268,435,456

[実行結果]
- Triad(MB/s): 317,613

***
# 1. BM.Optimized3.36インスタンスのデプロイ

本章は、BIOS設定の **NUMA setting** を **NPS2** とし、 **BM.Optimized3.36** をデプロイします。

インスタンスデプロイ時のBIOS設定は、 **[パフォーマンス関連Tips集](/ocitutorials/hpc/#2-2-パフォーマンス関連tips集)** の **[パフォーマンスに関連するベア・メタル・インスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照ください。

***
# 2. Intel oneAPI Base Toolkitインストール

本章は、 **STREAM** を実行するインスタンスに **Intel oneAPI Base Toolkit** をインストールします。

以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行し、 **Intel oneAPI Base Toolkit** をインストールします。

```sh
$ sudo yum-config-manager --add-repo https://yum.repos.intel.com/oneapi
$ sudo rpm --import https://yum.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
$ sudo yum install -y intel-basekit
```

***
# 3. STREAMダウンロード・コンパイル

本章は、 **STREAM** のソースコードをダウンロードし、先にインストールした **Intel oneAPI Base Toolkit** に含まれる**Intel oneAPI DPC++/C++ Compiler** でコンパイルして実行バイナリを作成します。

以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行します。

```sh
$ wget http://www.cs.virginia.edu/stream/FTP/Code/stream.c
$ source /opt/intel/oneapi/setvars.sh
$ icx -DSTREAM_ARRAY_SIZE=268435456 -O3 -mcmodel=medium -qopenmp -xCORE-AVX512 ./stream.c
```

***
# 4. STREAM実行

本章は、先に作成した **STREAM** の実行バイナリを使用し、 **STREAM** を実行します。  
具体的には、以下の作業を実施します。

- OS再起動
- ハイパースレッド設定の確認
- NUMA設定の確認
- スレッドアフィニティ用環境変数指定
- **STREAM** 実行

1. 以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行し、OSを再起動します。

    ```sh
    $ sudo shutdown -r now
    ```

2. 以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行し、その結果が **2** であることを以って、ハイパースレッドが有効化されていることを確認します。  
本ドキュメントの前提となる環境では、ハイパースレッドが有効の場合無効の場合と比較して **STREAM** の性能が向上します。

    ```sh
    $ lscpu | grep -i thread
    Thread(s) per core:  2
    ```

3. 以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行し、その結果が **4** であることを以って、BIOSの **NUMA setting** が **NPS2** となっていることを確認します。  
本ドキュメントの前提となる環境では、 **NUMA setting** が **NPS2** の場合 **NPS1** の場合と比較して **STREAM** の性能が向上します。

    ```sh
    $ lscpu | grep "NUMA node(s)"
    NUMA node(s):        4
    ```

4. 以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行し、 **STREAM** の性能向上を目的としたスレッドアフィニティの設定を適用します。

    ```sh
    $ export OMP_NUM_THREADS=72
    $ export KMP_AFFINITY=granularity=fine,compact
    ```

5. 以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行し、 **STREAM** を実行します。

    ```sh
    $ source /opt/intel/oneapi/setvars.sh
    $ ./a.out
    -------------------------------------------------------------
    STREAM version $Revision: 5.10 $
    -------------------------------------------------------------
    This system uses 8 bytes per array element.
    -------------------------------------------------------------
    Array size = 268435456 (elements), Offset = 0 (elements)
    Memory per array = 2048.0 MiB (= 2.0 GiB).
    Total memory required = 6144.0 MiB (= 6.0 GiB).
    Each kernel will be executed 10 times.
    The *best* time for each kernel (excluding the first iteration)
    will be used to compute the reported bandwidth.
    -------------------------------------------------------------
    Number of Threads requested = 72
    Number of Threads counted = 72
    -------------------------------------------------------------
    Your clock granularity/precision appears to be 1 microseconds.
    Each test below will take on the order of 14757 microseconds.
    (= 14757 clock ticks)
    Increase the size of the arrays if this shows that
    you are not getting at least 20 clock ticks per test.
    -------------------------------------------------------------
    WARNING -- The above is only a rough guideline.
    For best results, please be sure you know the
    precision of your system timer.
    -------------------------------------------------------------
    Function    Best Rate MB/s  Avg time     Min time     Max time
    Copy:          295796.6     0.014582     0.014520     0.014663
    Scale:         318925.3     0.013542     0.013467     0.013653
    Add:           319154.4     0.020275     0.020186     0.020363
    Triad:         320935.1     0.020131     0.020074     0.020209
    -------------------------------------------------------------
    Solution Validates: avg error less than 1.000000e-13 on all three arrays
    -------------------------------------------------------------
    ```
