---
title: "STREAM実行方法（BM.Standard.E5.192編）"
excerpt: "本ドキュメントは、第4世代AMD EPYCプロセッサを搭載するベア・メタル・シェイプBM.Standard.E5.192でメモリ帯域を計測する標準ベンチマークのSTREAMを実行する方法を解説します。"
order: "2121"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

本パフォーマンス関連Tipsで解説する **[STREAM](https://www.cs.virginia.edu/stream/)** は、第4世代  **AMD EPYC** プロセッサを搭載するベア・メタル・シェイプ **[BM.Standard.E5.192](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** のインスタンス上で、 **[AMD Optimizing C/C++ and Fortran Compilers](https://www.amd.com/en/developer/aocc.html)** （以降 **AOCC** と呼称します。）で **STREAM** のソースコードをコンパイルして実行します。

以上より、本ドキュメントで解説する **STREAM** 実行は、以下の手順を経て行います。

- **BM.Standard.E5.192** インスタンス作成
- **STREAM** ダウンロード・コンパイル
- **STREAM** 実行

本パフォーマンス関連Tipsは、以下の環境で **STREAM** を実行しており、以下の性能が出ています。

[実行環境]

- シェイプ： **BM.Standard.E5.192**
  - CPU： **AMD EPYC** 9654ベース x 2（192コア）
  - メモリ： DDR5 2.3 TB
  - 理論性能： 7.3728 TFLOPS（ベース動作周波数2.4 GHz時）
  - メモリ帯域： 921.6 GB/s
  - **Simultanious Multi Threading** （以降 **SMT** と呼称します。）： 無効
  - **NUMA nodes per socket** （以降 **NPS** と呼称します。）： **1** / **4**
- OS： **Oracle Linux** 9.5
- **STREAM** : 5.10
- コンパイラ： **AOCC** 5.0
- 配列サイズ(STREAM_ARRAY_SIZE)： 430,080,000

[実行結果]

- Triad(MB/s)
    - 718,799.1（ **NPS1** ）
    - 753,594.8（ **NPS4** ）（ **NPS1** に対して<u> **4.8** パーセント</u>の性能向上）

***
# 1. BM.Standard.E5.192インスタンス作成

本章は、 **STREAM** を実行するインスタンスを作成します。

作成するインスタンスは、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** の手順に従い、以下属性のインスタンスを作成します。

- イメージ： **Oracle Linux** 9.5（Oracle-Linux-9.5-2025.02.28-0）
- シェイプ： **BM.Standard.E5.192**
  - **SMT** ： 無効（※1）
  - **NPS** ： **1** / **4** （※1）

※1）**NPS** と **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

***
# 2. STREAMダウンロード・コンパイル

本章は、 **STREAM** のソースコードをダウンロードし、 **AOCC** でコンパイルして実行バイナリを作成します。

以下コマンドを **STREAM** を実行するノードの **STREAM** を実行するユーザで実行します。

```sh
$ mkdir ~/stream
$ cd ~/stream && wget http://www.cs.virginia.edu/stream/FTP/Code/stream.c
$ source /opt/aocc/setenv_AOCC.sh
$ clang -DSTREAM_TYPE=double -DSTREAM_ARRAY_SIZE=430080000 -O3 -mcmodel=large -fopenmp -fnt-store ./stream.c
```

***
# 3. STREAM実行

## 3-0. 概要

本章は、先に作成した **STREAM** の実行バイナリを使用し、以下の手順で **STREAM** を実行します。

1. OS再起動（※1）
2. **STREAM** 実行

※1）OS起動直後の状態でメモリ性能を計測する目的で実施します。

## 3-1. OS再起動

以下コマンドを **STREAM** を実行するノードのopcユーザで実行し、OSを再起動します。

```sh
$ sudo shutdown -r now
```

## 3-2. STREAM実行

以下コマンドを **STREAM** を実行するノードの **STREAM** を実行するユーザで実行します。  
ここでは、 **BM.Standard.E5.192** で **STREAM** の性能を最大化させるため、OpenMPのスレッド数とスレッド配置をそれぞれ環境変数 **OMP_NUM_THREADS** と **OMP_PLACES** ・ **OMP_PROC_BIND** で指定し、 **STREAM** を実行しています。

[ **NPS1** の場合]

```sh
$ cd ~/stream && OMP_PLACES=0:96:2 OMP_NUM_THREADS=96 OMP_PROC_BIND=spread ./a.out
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
Number of Threads requested = 96
Number of Threads counted = 96
-------------------------------------------------------------
Your clock granularity/precision appears to be 1 microseconds.
Each test below will take on the order of 10811 microseconds.
   (= 10811 clock ticks)
Increase the size of the arrays if this shows that
you are not getting at least 20 clock ticks per test.
-------------------------------------------------------------
WARNING -- The above is only a rough guideline.
For best results, please be sure you know the
precision of your system timer.
-------------------------------------------------------------
Function    Best Rate MB/s  Avg time     Min time     Max time
Copy:          685041.8     0.010067     0.010045     0.010089
Scale:         690053.6     0.010014     0.009972     0.010071
Add:           723580.5     0.014304     0.014265     0.014328
Triad:         718799.1     0.014390     0.014360     0.014484
-------------------------------------------------------------
Solution Validates: avg error less than 1.000000e-13 on all three arrays
-------------------------------------------------------------
$
```

[ **NPS4** の場合]

```sh
$ cd ~/stream && OMP_PLACES=0:96:2 OMP_NUM_THREADS=96 OMP_PROC_BIND=spread ./a.out
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
Number of Threads requested = 96
Number of Threads counted = 96
-------------------------------------------------------------
Your clock granularity/precision appears to be 1 microseconds.
Each test below will take on the order of 9644 microseconds.
   (= 9644 clock ticks)
Increase the size of the arrays if this shows that
you are not getting at least 20 clock ticks per test.
-------------------------------------------------------------
WARNING -- The above is only a rough guideline.
For best results, please be sure you know the
precision of your system timer.
-------------------------------------------------------------
Function    Best Rate MB/s  Avg time     Min time     Max time
Copy:          720545.7     0.009615     0.009550     0.009653
Scale:         713615.5     0.009695     0.009643     0.009736
Add:           751671.5     0.013765     0.013732     0.013795
Triad:         753594.8     0.013738     0.013697     0.013761
-------------------------------------------------------------
Solution Validates: avg error less than 1.000000e-13 on all three arrays
-------------------------------------------------------------
$
```
