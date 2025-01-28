---
title: "STREAM実行方法（BM.Optimized3.36編）"
excerpt: "本ドキュメントは、HPCワークロードの実行に最適なベアメタルインスタンスBM.Optimized3.36で、標準ベンチマークのSTREAMを実行する方法を解説します。"
order: "2120"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

本ドキュメントで解説する **[STREAM](https://www.cs.virginia.edu/stream/)** の実行は、 **[Intel oneAPI Base Toolkit](https://www.intel.com/content/www/us/en/developer/tools/oneapi/base-toolkit.html)** に含まれるCコンパイラの **[Intel oneAPI DPC++/C++ Compiler](https://www.intel.com/content/www/us/en/developer/tools/oneapi/dpc-compiler.html#gs.jwxqxq)** で **STREAM** のソースコードをコンパイルして作成したバイナリを使用します。

**STREAM** を実行するインスタンスは、 **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を使用し、 **STREAM** の性能向上を目的に **NUMA nodes per socket** （以降 **NPS** と呼称します。）が **2** （以降 **NPS2** と呼称します。）となるようBIOSで設定します。


以上より、本ドキュメントで解説する **STREAM** 実行は、以下の手順を経て行います。

- **BM.Optimized3.36** インスタンス作成
- **Intel oneAPI Base Toolkit** インストール
- **STREAM** ダウンロード・コンパイル
- **STREAM** 実行

本ドキュメントは、以下の環境で **STREAM** を実行しており、以下の性能が出ています。

[実行環境]
- シェイプ： **BM.Optimized3.36** （ **NPS2** ）
- OS ： **Oracle Linux** 8.10ベースのHPC **クラスタネットワーキングイメージ**
- **STREAM** ： 5.10
- Cコンパイラ ： **Intel oneAPI DPC++/C++ Compiler** 2025.0.1
- 配列サイズ(STREAM_ARRAY_SIZE) ： 268,435,456

[実行結果]
- Triad(MB/s) ： **320,935**

***
# 1. BM.Optimized3.36インスタンス作成

本章は、 **NPS** を **NPS2** とするようBIOSを設定し（※1）、OSに **Oracle Linux** 8.10ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※2）を使用して、 **BM.Optimized3.36** のインスタンスを作成します。

※1）**NPS** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

※2）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.12** です。

インスタンスの作成は、 **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の **[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** の手順を参考にしてください。

***
# 2. Intel oneAPI Base Toolkitインストール

本章は、先に作成した **STREAM** を実行するインスタンス上で、 **Intel oneAPI Base Toolkit** をインストールします。

以下コマンドをopcユーザで実行し、 **Intel oneAPI Base Toolkit** をインストールします。

```sh
$ sudo yum-config-manager --add-repo https://yum.repos.intel.com/oneapi
$ sudo rpm --import https://yum.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
$ sudo dnf install -y intel-basekit
```

***
# 3. STREAMダウンロード・コンパイル

本章は、先に作成した **STREAM** を実行するインスタンス上で、先にインストールした **Intel oneAPI Base Toolkit** に含まれる**Intel oneAPI DPC++/C++ Compiler** で **STREAM** のソースコードをコンパイルし、実行バイナリを作成します。

以下コマンドを **STREAM** 実行ユーザで実行します。

```sh
$ wget http://www.cs.virginia.edu/stream/FTP/Code/stream.c
$ source /opt/intel/oneapi/setvars.sh
$ icx -DSTREAM_TYPE=double -DSTREAM_ARRAY_SIZE=268435456 -O3 -mcmodel=medium -qopenmp -xCORE-AVX512 ./stream.c
```

***
# 4. STREAM実行

本章は、先に作成した **STREAM** を実行するインスタンス上で、先に作成した **STREAM** の実行バイナリを使用し、 **STREAM** を実行します。

以下コマンドをopcユーザで実行し、 **STREAM** の性能向上を目的としてメモリ領域初期化のためのOS再起動を行います。

```sh
$ sudo shutdown -r now
```

次に、以下コマンドを **STREAM** 実行ユーザで実行し、 **STREAM** の性能向上を目的としたスレッドアフィニティの設定を適用します。  
実行時スレッド数は、 **Simultanious Multi Threading** （以降 **SMT** と呼称します。）を活用するため **72** とします。

```sh
$ export OMP_NUM_THREADS=72
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
