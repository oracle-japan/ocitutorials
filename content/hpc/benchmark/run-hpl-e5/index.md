---
title: "HPL実行方法（BM.Standard.E5.192編）"
description: "本ドキュメントは、第4世代AMD EPYCプロセッサを搭載するベア・メタル・シェイプBM.Standard.E5.192で、浮動小数点演算性能を計測する標準ベンチマークのHPLを実行する方法を解説します。"
weight: "2112"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

***
# 0. 概要

本パフォーマンス関連Tipsで解説する **[HPL](https://www.netlib.org/benchmark/hpl/)** は、第4世代  **AMD EPYC** プロセッサを搭載するベア・メタル・シェイプ **[BM.Standard.E5.192](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** のインスタンス上で、AMDの **HPL** 実装である **[AMD Zen HPL optimized for AMD EPYC processors](https://www.amd.com/en/developer/zen-software-studio/applications/pre-built-applications.html)** （以下 **AMD HPL** と呼称します。）を **[OpenMPI](https://www.open-mpi.org/)** から起動して実行します。

以上より、本ドキュメントで解説する **HPL** 実行は、以下の手順を経て行います。

- **BM.Standard.E5.192** インスタンス作成
- **AMD HPL** ダウンロード・インストール
- **HPL** 実行

本パフォーマンス関連Tipsは、以下の環境で **HPL** を実行しており、以下の性能が出ています。

[実行環境]

- シェイプ： **BM.Standard.E5.192**
    - CPU： **AMD EPYC** 9654ベース x 2（192コア）
    - メモリ： DDR5 2.3 TB
    - 理論性能： 7.3728 TFLOPS（ベース動作周波数2.4 GHz時）
    - メモリ帯域： 921.6 GB/s
    - **Simultanious Multi Threading** （以降 **SMT** と呼称します。）： 無効
    -  **NUMA nodes per socket** （以降 **NPS** と呼称します。）： **1** / **4**
- ノード数： 1
- OS： **Oracle Linux** 9.5
- MPI：  **OpenMPI** 5.0.6
- **HPL**
    - バージョン: **AMD HPL** 2024_10_08
    - 問題サイズ(N)： 523,008
    - ブロックサイズ(NB)： 384
    - プロセスグリッド(PxQ)： 1x2

[実行結果]

- FLOPS
    - 7.4578 TFLOPS（ **NPS** が **1** の場合）
    - 7.4168 TFLOPS（ **NPS** が **4** の場合）

※1） **NPS** の違いによる有意な性能差は見られません。

***
# 1. BM.Standard.E5.192インスタンス作成

本章は、 **HPL** を実行するインスタンスを作成します。

作成するインスタンスは、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法](../../tech-knowhow/build-oraclelinux-hpcenv/)** の手順に従い、以下属性で作成します。

- イメージ： **[プラットフォーム・イメージ](../../#5-17-プラットフォームイメージ)** **[Oracle-Linux-9.5-2025.02.28-0](https://docs.oracle.com/en-us/iaas/images/oracle-linux-9x/oracle-linux-9-5-2025-02-28-0.htm)**
- シェイプ： **BM.Standard.E5.192**
  - **SMT** ： 無効（※2）
  - **NPS** ： **1** / **4** （※2）

※2）**NPS** と **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](../../benchmark/bios-setting/)** を参照してください。

***
# 2. AMD HPLダウンロード・インストール

本章は、 **AMD HPL** を **AMD** のウェブサイトからダウンロードし、これをインストールします。  

以下のサイトから **AMD HPL** のtarアーカイブ **amd-zen-hpl-2024_10_08.tar.gz** をダウンロードし、これを **HPL** を実行するノードの **/tmp** ディレクトリにコピーします。

**[https://www.amd.com/en/developer/zen-software-studio/applications/pre-built-applications.html](https://www.amd.com/en/developer/zen-software-studio/applications/pre-built-applications.html)**

次に、以下コマンドを **HPL** を実行するノードのopcユーザで実行し、 **AMD HPL** を **/opt/amd-pba** にインストールします。

```sh
$ sudo mkdir /opt/amd-pba
$ cd /opt/amd-pba && sudo tar --no-same-owner -xvf /tmp/amd-zen-hpl-2024_10_08.tar.gz
```

***
# 3. HPL実行

本章は、 **HPL** を実行します。

以下コマンドを **HPL** を実行するノードのopcユーザで実行し、 **HPL** の性能を最大化するための設定を行います。

```sh
$ echo 3  | sudo tee /proc/sys/vm/drop_caches
$ echo 1  | sudo tee /proc/sys/vm/compact_memory
$ echo 'always' | sudo tee /sys/kernel/mm/transparent_hugepage/defrag
$ echo 0 | sudo tee /proc/sys/kernel/numa_balancing
```

次に、下コマンドを **HPL** を実行するノードの **HPL** を実行するユーザで実行します。  
本ドキュメントの前提となる環境・設定で **HPL** 実行に要する時間は、3.5時間程度です。

[ **NPS1** の場合]

```sh
$ LD_LIBRARY_PATH=/opt/openmpi/lib:$LD_LIBRARY_PATH mpirun -n 2 --map-by socket:PE=96 --bind-to core -x OMP_NUM_THREADS=96 -x OMP_PROC_BIND=TRUE /opt/amd-pba/amd-zen-hpl-2024_10_08/xhpl
No HPL.dat.  Going to do auto-selection
Beginning auto-selection of parameters
Detected 'AuthenticAMD' Model 0x11, Family 0x19
	Thank you for using AMD
================================================================================
AMD Zen HPL 2024_10_08
Using AOCL BLIS
================================================================================
Derived from:
HPLinpack 2.3  --  High-Performance Linpack benchmark  --   December 2, 2018
Written by A. Petitet and R. Clint Whaley,  Innovative Computing Laboratory, UTK
Modified by Piotr Luszczek, Innovative Computing Laboratory, UTK
Modified by Julien Langou, University of Colorado Denver
================================================================================

An explanation of the input/output parameters follows:
T/V    : Wall time / encoded variant.
N      : The order of the coefficient matrix A.
NB     : The partitioning blocking factor.
P      : The number of process rows.
Q      : The number of process columns.
Time   : Time in seconds to solve the linear system.
Gflops : Rate of execution for solving the linear system.

The following parameter values will be used:

N      :  523008 
NB     :     384 
PMAP   : Row-major process mapping
P      :       1 
Q      :       2 
PFACT  :   Crout 
NBMIN  :      48 
NDIV   :       8 
RFACT  :   Right 
BCAST  :  HybBcast 
DEPTH  :       0 
SWAP   : (211) Spread-roll
L1     : transposed form
A      : no-transposed form (ColMajor)
EQUIL  : no
ALIGN  : 8 double precision words
MXSWP  : (1/c) Collective 

--------------------------------------------------------------------------------

- The matrix A is randomly generated for each test.
- The following scaled residual check will be computed:
      ||Ax-b||_oo / ( eps * ( || x ||_oo * || A ||_oo + || b ||_oo ) * N )
- The relative machine precision (eps) is taken to be               1.110223e-16
- Computational tests pass if scaled residuals are less than                16.0

[inst-e5-ol95-nps1:15024] osc_ucx_component.c:369  Error: OSC UCX component priority set inside component query failed 
 
[inst-e5-ol95-nps1:15023] osc_ucx_component.c:369  Error: OSC UCX component priority set inside component query failed 
 
================================================================================
T/V         SWP           N    NB     P     Q            Time             Gflops
--------------------------------------------------------------------------------
WRC07R8C48c 211       523008   384     1     2        12788.60         7.4578e+03
HPL_pdgesv() start time Fri Apr  4 09:51:07 2025
HPL_pdgesv() end time   Fri Apr  4 13:24:15 2025
--------------------------------------------------------------------------------
||Ax-b||_oo/(eps*(||A||_oo*||x||_oo+||b||_oo)*N)=   3.11927170e-03 ...... PASSED
================================================================================

Finished      1 tests with the following results:
              1 tests completed and passed residual checks,
              0 tests completed and failed residual checks,
              0 tests skipped because of illegal input values.
--------------------------------------------------------------------------------

End of Tests.
================================================================================
$
```

[ **NPS4** の場合]

```sh
$ LD_LIBRARY_PATH=/opt/openmpi/lib:$LD_LIBRARY_PATH mpirun -n 2 --map-by socket:PE=96 --bind-to core -x OMP_NUM_THREADS=96 -x OMP_PROC_BIND=TRUE /opt/amd-pba/amd-zen-hpl-2024_10_08/xhpl
No HPL.dat.  Going to do auto-selection
Beginning auto-selection of parameters
Detected 'AuthenticAMD' Model 0x11, Family 0x19
	Thank you for using AMD
================================================================================
AMD Zen HPL 2024_10_08
Using AOCL BLIS
================================================================================
Derived from:
HPLinpack 2.3  --  High-Performance Linpack benchmark  --   December 2, 2018
Written by A. Petitet and R. Clint Whaley,  Innovative Computing Laboratory, UTK
Modified by Piotr Luszczek, Innovative Computing Laboratory, UTK
Modified by Julien Langou, University of Colorado Denver
================================================================================

An explanation of the input/output parameters follows:
T/V    : Wall time / encoded variant.
N      : The order of the coefficient matrix A.
NB     : The partitioning blocking factor.
P      : The number of process rows.
Q      : The number of process columns.
Time   : Time in seconds to solve the linear system.
Gflops : Rate of execution for solving the linear system.

The following parameter values will be used:

N      :  523008 
NB     :     384 
PMAP   : Row-major process mapping
P      :       1 
Q      :       2 
PFACT  :   Crout 
NBMIN  :      48 
NDIV   :       8 
RFACT  :   Right 
BCAST  :  HybBcast 
DEPTH  :       0 
SWAP   : (211) Spread-roll
L1     : transposed form
A      : no-transposed form (ColMajor)
EQUIL  : no
ALIGN  : 8 double precision words
MXSWP  : (1/c) Collective 

--------------------------------------------------------------------------------

- The matrix A is randomly generated for each test.
- The following scaled residual check will be computed:
      ||Ax-b||_oo / ( eps * ( || x ||_oo * || A ||_oo + || b ||_oo ) * N )
- The relative machine precision (eps) is taken to be               1.110223e-16
- Computational tests pass if scaled residuals are less than                16.0

[inst-e5-ol95-nps4:08916] osc_ucx_component.c:369  Error: OSC UCX component priority set inside component query failed 
 
[inst-e5-ol95-nps4:08917] osc_ucx_component.c:369  Error: OSC UCX component priority set inside component query failed 
 
================================================================================
T/V         SWP           N    NB     P     Q            Time             Gflops
--------------------------------------------------------------------------------
WRC07R8C48c 211       523008   384     1     2        12859.42         7.4168e+03
HPL_pdgesv() start time Fri Apr  4 13:55:23 2025
HPL_pdgesv() end time   Fri Apr  4 17:29:42 2025
--------------------------------------------------------------------------------
||Ax-b||_oo/(eps*(||A||_oo*||x||_oo+||b||_oo)*N)=   3.11927170e-03 ...... PASSED
================================================================================

Finished      1 tests with the following results:
              1 tests completed and passed residual checks,
              0 tests completed and failed residual checks,
              0 tests skipped because of illegal input values.
--------------------------------------------------------------------------------

End of Tests.
================================================================================
$
```

**AMD HPL** は、問題サイズ(N)、ブロックサイズ(NB)、プロセスグリッド(PxQ)、及びその他の実行時パラメータを自身で決定して **HPL** を実行するため、事前に **HPL.dat** ファイルを用意する必要はありません。