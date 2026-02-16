---
title: "STREAM実行方法（BM.Optimized3.36編）"
description: "本ドキュメントは、第3世代Intel Xeonプロセッサを搭載するベア・メタル・シェイプBM.Optimized3.36で、メモリ帯域を計測する標準ベンチマークのSTREAMを実行する方法を解説します。"
weight: "2121"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

# 0. 概要

本ドキュメントは、 **[Intel oneAPI Base Toolkit](https://www.intel.com/content/www/us/en/developer/tools/oneapi/base-toolkit.html)** に含まれるCコンパイラの **[Intel oneAPI DPC++/C++ Compiler](https://www.intel.com/content/www/us/en/developer/tools/oneapi/dpc-compiler.html#gs.jwxqxq)** でコンパイルした  **[STREAM](https://www.cs.virginia.edu/stream/)** を使用し、 **Intel Ice Lake** プロセッサを搭載するベアメタルシェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** のメモリ帯域を計測する方法を解説します。

以降では、計測環境の構築から計測方法まで、以下の順に解説します。

- **[BM.Optimized3.36インスタンス作成](#1-bmoptimized336インスタンス作成)**
- **[Intel oneAPI Base Toolkitインストール](#2-intel-oneapi-base-toolkitインストール)**
- **[STREAMダウンロード・コンパイル](#3-streamダウンロードコンパイル)**
- **[STREAM実行](#4-stream実行)**

本ドキュメントは、以下の環境で **STREAM** を実行し、

- 計算ノード
    - シェイプ： **BM.Optimized3.36**
    - CPU： **Intel Xeon Gold** 6354 x 2（36コア）
    - メモリ： DDR4-3200 512 GB
    - 理論性能： 3.456 TFLOPS（ベース動作周波数3.0 GHz時）
    - メモリ帯域： 409.6 GB/s
    - **Simultanious Multi Threading** （以降 **SMT** と呼称します。）： 有効/無効（※1）
    - **NUMA nodes per socket** （以降 **NPS** と呼称します。）： **1** / **2** （※1）
    - イメージ： **Oracle Linux** 9.05ベースのHPC **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※2）
- **STREAM**
    - バージョン： 5.10
    - 配列サイズ(STREAM_ARRAY_SIZE)： 268,435,456
- Cコンパイラ： **Intel oneAPI DPC++/C++ Compiler** 2025.3.2

※1） **SMT** と **NPS** の設定方法は、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](../../benchmark/bios-setting/)** を参照してください。  
※2） **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.13** です。

以下の性能が出ています。

| SMT | NPS  | Triad(MB/s) |
| :-: | :--: | ----------: |
| 無効  | NPS1 | 302,094     |
|     | NPS2 | 313,302     |
| 有効  | NPS1 | 309,644     |
|     | NPS2 | 324,736     |

# 1. BM.Optimized3.36インスタンス作成

本章は、イメージに **Oracle Linux** 9.05ベースのHPC **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※3）を使用し、 **BM.Optimized3.36** のインスタンスを作成します。

※3）**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.13** です。

インスタンスの作成は、 **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の **[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** 等の手順に従い実施します。

# 2. Intel oneAPI Base Toolkitインストール

本章は、先に作成した **STREAM** を実行するインスタンス上で、 **Intel oneAPI Base Toolkit** をインストールします。

以下コマンドをopcユーザで実行し、 **Intel oneAPI Base Toolkit** をインストールします。

```sh
$ sudo yum-config-manager --add-repo https://yum.repos.intel.com/oneapi
$ sudo rpm --import https://yum.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
$ sudo dnf install -y intel-basekit-2025.3.0
```

# 3. STREAMダウンロード・コンパイル

本章は、先に作成した **STREAM** を実行するインスタンス上で、先にインストールした **Intel oneAPI Base Toolkit** に含まれる**Intel oneAPI DPC++/C++ Compiler** で **STREAM** のソースコードをコンパイルし、実行バイナリを作成します。

以下コマンドを **STREAM** 実行ユーザで実行します。

```sh
$ wget http://www.cs.virginia.edu/stream/FTP/Code/stream.c
$ source /opt/intel/oneapi/setvars.sh
$ icx -DSTREAM_TYPE=double -DSTREAM_ARRAY_SIZE=268435456 -O3 -mcmodel=medium -qopenmp -xCORE-AVX512 ./stream.c
```

# 4. STREAM実行

本章は、先に作成した **STREAM** を実行するインスタンス上で、先に作成した **STREAM** の実行バイナリを使用し、 **STREAM** を実行します。

以下コマンドをopcユーザで実行し、メモリ領域初期化による **STREAM** の性能向上を目的とするOS再起動を行います。

```sh
$ sudo shutdown -r now
```

次に、以下コマンドを **STREAM** 実行ユーザで実行し、 **STREAM** の性能向上を目的としたスレッド関連の設定を適用します。  
なお、 **SMT** の設定値が有効/無効のどちらかにより実行するコマンドが異なる点に留意します。

```sh
$ export OMP_NUM_THREADS=72 # For SMT enabled
$ export OMP_NUM_THREADS=36 # For SMT disabled
$ export KMP_AFFINITY=granularity=fine,compact
```

次に、以下コマンドを **STREAM** 実行ユーザで実行し、 **STREAM** を実行します。

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
