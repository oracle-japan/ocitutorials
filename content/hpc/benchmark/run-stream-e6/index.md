---
title: "STREAM実行方法（BM.Standard.E6.256編）"
description: "本ドキュメントは、第5世代AMD EPYCプロセッサを搭載するベア・メタル・シェイプBM.Standard.E6.256で、メモリ帯域を計測する標準ベンチマークのSTREAMを実行する方法を解説します。"
weight: "2123"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

***
# 0. 概要

本パフォーマンス関連Tipsで解説する **[STREAM](https://www.cs.virginia.edu/stream/)** は、第5世代  **AMD EPYC** プロセッサを搭載するベア・メタル・シェイプ **[BM.Standard.E6.256](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** のインスタンス上で、 **[AMD Optimizing C/C++ and Fortran Compilers](https://www.amd.com/en/developer/aocc.html)** （以降 **AOCC** と呼称します。）で **STREAM** のソースコードをコンパイルして実行します。

以上より、本ドキュメントで解説する **STREAM** 実行は、以下の手順を経て行います。

- **BM.Standard.E6.256** インスタンス作成
- **STREAM** ダウンロード・コンパイル
- **STREAM** 実行

本パフォーマンス関連Tipsは、以下の環境で **STREAM** を実行しており、以下の性能が出ています。

[実行環境]

- シェイプ： **BM.Standard.E6.256**
    - CPU： **AMD EPYC** 9755ベース x 2（256コア）
    - メモリ： DDR5 3.072 TB
    - 理論性能： 11.0592 TFLOPS（ベース動作周波数2.7 GHz時）
    - メモリ帯域： 1,228.8 GB/s
    - **Simultanious Multi Threading** （以降 **SMT** と呼称します。）： 無効
    - **NUMA nodes per socket** （以降 **NPS** と呼称します。）： **1** / **4**
- OS： **Oracle Linux** 9.5
- コンパイラ： **AOCC** 5.0
- **STREAM**
    - バージョン： 5.10
    - 配列サイズ(STREAM_ARRAY_SIZE)： 430,080,000

[実行結果]

- Triad(MB/s)
    - 986,224.2（ **NPS** が **1** の場合）
    - 984,810.9（ **NPS** が **4** の場合）

※1） **NPS** の違いによる有意な性能差は見られません。

***
# 1. BM.Standard.E6.256インスタンス作成

本章は、 **STREAM** を実行するインスタンスを作成します。

作成するインスタンスは、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法](../../tech-knowhow/build-oraclelinux-hpcenv/)** の手順に従い、以下属性のインスタンスを作成します。

- イメージ： **[プラットフォーム・イメージ](../../#5-17-プラットフォームイメージ)** **[Oracle-Linux-9.5-2025.04.16-0](https://docs.oracle.com/en-us/iaas/images/oracle-linux-9x/oracle-linux-9-5-2025-04-16-0.htm)**
- シェイプ： **BM.Standard.E6.256**
  - **SMT** ： 無効（※2）
  - **NPS** ： **1** / **4** （※2）

※2）**NPS** と **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](../../benchmark/bios-setting/)** を参照してください。

***
# 2. STREAMダウンロード・コンパイル

本章は、 **STREAM** のソースコードをダウンロードし、 **AOCC** でコンパイルして実行バイナリを作成します。

以下コマンドを **STREAM** を実行するノードの **STREAM** を実行するユーザで実行します。

```sh
$ mkdir ~/stream
$ cd ~/stream && wget http://www.cs.virginia.edu/stream/FTP/Code/stream.c
$ source /opt/aocc/setenv_AOCC.sh
$ clang -O3 -fopenmp  -mcmodel=large -DSTREAM_TYPE=double -mavx2 -DSTREAM_ARRAY_SIZE=430080000 -fnt-store ./stream.c
```

***
# 3. STREAM実行

## 3-0. 概要

本章は、先に作成した **STREAM** の実行バイナリを使用し、以下の手順で **STREAM** を実行します。

1. OS再起動（※3）
2. **STREAM** 実行

※3）メモリ領域初期化による **STREAM** の性能向上のために実施します。

## 3-1. OS再起動

以下コマンドを **STREAM** を実行するノードのopcユーザで実行し、OSを再起動します。

```sh
$ sudo shutdown -r now
```

## 3-2. STREAM実行

以下コマンドを **STREAM** を実行するノードの **STREAM** を実行するユーザで実行します。  
ここでは、 **BM.Standard.E6.256** で **STREAM** の性能を最大化させるため、OpenMPのスレッド数とスレッド配置をそれぞれ環境変数 **OMP_NUM_THREADS** と **OMP_PLACES** ・ **OMP_PROC_BIND** で指定し、 **STREAM** を実行しています。

[ **NPS1** の場合]

```sh
$ cd ~/stream && OMP_PLACES=0:32:8 OMP_NUM_THREADS=32 OMP_PROC_BIND=spread ./a.out
-------------------------------------------------------------
STREAM version $Revision: 5.10 $
-------------------------------------------------------------
This system uses 8 bytes per array element.
-------------------------------------------------------------
Array size = 430080000 (elements), Offset = 0 (elements)
Memory per array = 3281.2 MiB (= 3.2 GiB).
Total memory required = 9843.8 MiB (= 9.6 GiB).
Each kernel will be executed 10 times.
 The *best* time for each kernel (excluding the first iteration)
 will be used to compute the reported bandwidth.
-------------------------------------------------------------
Number of Threads requested = 32
Number of Threads counted = 32
-------------------------------------------------------------
Your clock granularity/precision appears to be 1 microseconds.
Each test below will take on the order of 7320 microseconds.
   (= 7320 clock ticks)
Increase the size of the arrays if this shows that
you are not getting at least 20 clock ticks per test.
-------------------------------------------------------------
WARNING -- The above is only a rough guideline.
For best results, please be sure you know the
precision of your system timer.
-------------------------------------------------------------
Function    Best Rate MB/s  Avg time     Min time     Max time
Copy:          936354.1     0.007465     0.007349     0.007697
Scale:         934051.1     0.007419     0.007367     0.007455
Add:           986516.4     0.010497     0.010463     0.010529
Triad:         986224.2     0.010486     0.010466     0.010522
-------------------------------------------------------------
Solution Validates: avg error less than 1.000000e-13 on all three arrays
-------------------------------------------------------------
$
```

[ **NPS4** の場合]

```sh
$ cd ~/stream && OMP_PLACES=0:32:8 OMP_NUM_THREADS=32 OMP_PROC_BIND=spread ./a.out
-------------------------------------------------------------
STREAM version $Revision: 5.10 $
-------------------------------------------------------------
This system uses 8 bytes per array element.
-------------------------------------------------------------
Array size = 430080000 (elements), Offset = 0 (elements)
Memory per array = 3281.2 MiB (= 3.2 GiB).
Total memory required = 9843.8 MiB (= 9.6 GiB).
Each kernel will be executed 10 times.
 The *best* time for each kernel (excluding the first iteration)
 will be used to compute the reported bandwidth.
-------------------------------------------------------------
Number of Threads requested = 32
Number of Threads counted = 32
-------------------------------------------------------------
Your clock granularity/precision appears to be 1 microseconds.
Each test below will take on the order of 7320 microseconds.
   (= 7320 clock ticks)
Increase the size of the arrays if this shows that
you are not getting at least 20 clock ticks per test.
-------------------------------------------------------------
WARNING -- The above is only a rough guideline.
For best results, please be sure you know the
precision of your system timer.
-------------------------------------------------------------
Function    Best Rate MB/s  Avg time     Min time     Max time
Copy:          917016.6     0.007595     0.007504     0.007756
Scale:         923294.3     0.007516     0.007453     0.007605
Add:           981929.5     0.010542     0.010512     0.010585
Triad:         984810.9     0.010506     0.010481     0.010530
-------------------------------------------------------------
Solution Validates: avg error less than 1.000000e-13 on all three arrays
-------------------------------------------------------------
$
```
