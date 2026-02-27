---
title: "PAPIでHPCアプリケーションをプロファイリング"
description: "HPCワークロードの実行に最適なベアメタル・インスタンスでアプリケーションを実行する場合、高価な計算資源を有効活用出来ているかを検証するため、アプリケーションのプロファイリングを実施することが一般的です。PAPIは、HPCワークロード向けベ **アメタル・シェイプ** に採用されているIntel Ice LakeやAMD EPYC 9004シリーズのCPUが持つハードウェアカウンタから浮動小数点演算数やキャッシュヒット数といったプロファイリングに有益な情報を取得するAPIを提供し、HPCアプリケーションのプロファイリングに欠かせないツールとなっています。本プロファイリング関連Tipsは、ベアメタル・インスタンス上で実行するHPCアプリケーションをPAPIを使ってプロファイリングする方法を解説します。"
weight: "2301"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

# 0. 概要

**[PAPI](https://icl.utk.edu/papi/)** は、異なるプラットフォーム間を共通のインターフェースで利用できるように設計された性能解析ツールで、プロファイリング対象のアプリケーションからAPIをコールすることで、CPU/GPUをはじめとする様々なハードウェアからプロファイリングに有益な情報を収集します。  
この **PAPI** の可搬性は、ハードウェア固有の部分を吸収する下位層と、プロファイリングを行うアプリケーション開発者が利用する抽象化された上位層にソフトウェアスタックを分割することで、これを実現しています。これらの関係は、 **[ここ](https://icl.utk.edu/projects/papi/files/documentation/PAPI_USER_GUIDE_23.htm#ARCHITECTURE)** に記載のアーキテクチャ図が参考になります。

**PAPI** のAPIは、HPCアプリケーションをプロファイリングするユースケースの場合、 **Low Level API** と **[High Level API](https://github.com/icl-utk-edu/papi/wiki/PAPI-HL)** から選択して利用することが出来ます。  
**High Level API** は、内部で **Low Level API** を使用することでより高機能のプロファイリングが可能なAPIを提供し、 **Low Level API** に対して以下の利点があります。

- より少ないAPIコールで同じプロファイリング機能を実現（※1）
- コードを修正することなく利用するハードウェアカウンタの変更が可能（※2）
- プロファイリング情報の出力制御が不要（※3）

※1）最も少ないケースは、プログラム中の計測範囲の前後に2回APIコールを挟み込むだけです。  
※2）アプリケーション実行時の環境変数で利用するハードウェアカウンタを指定します。これに対し **Low Level API** は、APIをコールして利用するハードウェアカウンタを指定するため、これを変更する場合再コンパイルが必要です。  
※3）計測範囲の最後を指定するAPIがコールされると、環境変数に指定したディレクトリにプロファイリング情報を格納したファイルが自動的に作成されます。これに対し **Low Level API** は、明示的に取得したハードウェアカウンタの値を出力する必要があります。

また **PAPI** は、 **Intel Ice Lake** プロセッサを搭載する **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** の場合、以下のようなハードウェアカウンタを利用することが可能です。  
利用可能なハードウェアカウンタ一覧は、 **[2. PAPIインストール・セットアップ](#2-papiインストールセットアップ)** のステップ3の手順で取得することが可能です。

- 浮動小数点演算数
- 浮動小数点演算インストラクション数
- L1/L2/L3の各キャッシュヒット/ミス数
- 総サイクル数

以上を踏まえて本プロファイリング関連Tipsは、 **PAPI** をインストールした計算ノードをインターコネクトでノード間接続するHPCクラスタで、 **High Level API** を使用するサンプルプログラムを実行してハードウェアカウンタからプロファイリング情報を取得する方法を解説します。

本プロファイリング関連Tipsは、以下の環境を前提とします。

- 計算ノード
    - シェイプ： **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)**
    - イメージ： **Oracle Linux** 9.05ベースのHPC **[クラスタネットワーキングイメージ](../../#5-13-クラスタネットワーキングイメージ)** （※4）
- **PAPI** ：7.2.0
- MPI： **[OpenMPI](https://www.open-mpi.org/)** 5.0.8（※5）

※4）**[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](../../tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](../../tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** の **No.13** です。  
※5） **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](../../tech-knowhow/build-openmpi/)** に従って構築された **OpenMPI** です。  

以降では、以下の順に解説します。

1. **[HPCクラスタ構築](#1-hpcクラスタ構築)**
2. **[PAPIインストール](#2-papiインストール)**
3. **[サンプルプログラムコンパイル](#3-サンプルプログラムコンパイル)**
4. **[サンプルプログラム実行](#4-サンプルプログラム実行)**
5. **[プロファイリング結果確認](#5-プロファイリング結果確認)**

# 1. HPCクラスタ構築

本章は、本プロファイリング関連Tipsで使用するHPCクラスタを構築します。

この構築は、 **[OCI HPCチュートリアル集](../../#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ手動構築編)](../../spinup-cluster-network/)** の手順に従う等で実施します。

# 2. PAPIインストール

## 2-0. 概要

本章は、PAPIとその前提条件ソフトウェアのインストールを以下の順に実施します。

1. **[OpenMPIインストール](#2-1-openmpiインストール)**
2. **[PAPIインストール](#2-papiインストール)**

これらの手順は、全ての計算ノードで実施します。

## 2-1. OpenMPIインストール

**OpenMPI** のインストールは、 **[OCI HPCテクニカルTips集](../../#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](../../tech-knowhow/build-openmpi/)** の **[1. インストール・セットアップ](../../tech-knowhow/build-openmpi/#1-インストールセットアップ)** の手順に従い実施します。

## 2-2. PAPIインストール

以下コマンドをopcユーザで実行し、 **PAPI** を **/opt/papi** ディレクトリにインストールします。

```sh
$ mkdir -p ~/`hostname` && cd ~/`hostname` && wget https://icl.utk.edu/projects/papi/downloads/papi-7.2.0.tar.gz
$ tar -xvf ./papi-7.2.0.tar.gz
$ cd papi-7.2.0/src && ./configure --prefix=/opt/papi
$ make -j && sudo make install; echo $?
```

次に、以下のファイルを **/usr/share/Modules/modulefiles/papi** で作成します。  
このファイルは、 **[Environment Modules](https://envmodules.io/)** にモジュール名 **papi** を登録し、これをロードすることで **PAPI** 利用環境の設定を可能にします

```sh
#%Module1.0
##
## PAPI for OpenMPI

proc ModulesHelp { } {
        puts stderr "PAPI for OpenMPI\n"
}

module-whatis "PAPI for OpenMPI"

set pkg_root  /opt/papi
set ver       7.2.0

prepend-path PATH               $pkg_root/bin
prepend-path LD_LIBRARY_PATH    $pkg_root/lib
prepend-path LIBRARY_PATH    	$pkg_root/lib
prepend-path C_INCLUDE_PATH     $pkg_root/include
```

次に、以下コマンドをopcユーザで実行し、コマンド出力の最後に **PASSED** が出力されることを以って、 **PAPI** が利用可能であることを確認します。  
このコマンドは、利用可能な全てのプリセットイベント（ここでは42個です。）をテストし、その結果を表示します。

```sh
$ sudo ./ctests/all_events

Trying all pre-defined events:
Adding PAPI_L1_DCM   successful
:
:
:
Adding PAPI_VEC_DP   successful
Adding PAPI_REF_CYC  successful
Successfully added, started and stopped 42 events.
PASSED
$
```

次に、以下コマンドをopcユーザで実行し、利用可能なプリセットイベントを確認します。

```sh
$ module load papi
$ papi_avail | grep ^PAPI_ | awk '{if($3=="Yes")print $0}'
PAPI_L1_DCM  0x80000000  Yes   No   Level 1 data cache misses
:
:
:
PAPI_REF_CYC 0x8000006b  Yes   No   Reference clock cycles

$ 
```

# 3. サンプルプログラムコンパイル

本章は、 **PAPI** を使用してプロファイリング情報を取得する、非並列・OpenMP並列兼用版（**matrix_multiply_thrpa_hl.f90**）とMPI並列版（**matrix_multiply_mpipa_hl.f90** と **para_range.f90**）のサンプルプログラムをそれぞれコンパイルし、実行バイナリを作成します。

このサンプルプログラムは、サイズが3,000x3,000の正方行列を乱数で初期化した後にその行列積を求め、その結果を標準出力に出力します。この際、行列積を求める3重ループ前後で **PAPI** の **High Level API** 関数を呼び出すことで、プロファイリング情報をカーネル部分にフォーカスして取得します。  
ここでOpenMP並列版は、 **PAPI** 関数をスレッド生成後に呼び出している（**!$OMP parallel** と **!$OMP end parallel**の間に配置します。）ことに留意します。これは、 **PAPI** がスレッドの生成を検知できない制限から来ており、スレッド生成前に **PAPI** 関数を呼び出すと、その後生成されたスレッドが消費した分のプロファイリング情報を取得することができません。

[matrix_multiply_thrpa_hl.f90]
```sh
program main
        implicit none
        include "f90papi.h"
        integer i, j, k, l, m, n
        integer retval
        double precision, allocatable :: a(:,:), b(:,:), c(:,:)
        double precision alpha, beta
        
        l=3000; m=l; n=l
        alpha=1.0; beta=0.0
        allocate(a(l,n), b(n,m), c(l,m))
        call random_number(a)
        call random_number(b)
        a = a - 0.5d0
        b = b - 0.5d0
        c = 0.0d0

!$OMP parallel
        call papif_hl_region_begin("computation", retval)
        if ( retval .ne. papi_ok ) then
                write (*,*) "PAPIf_hl_region_begin failed!"
        end if

!$OMP do
        do i = 1,l
                do j = 1,m
                        c(i,j) = beta * c(i,j)
                        do k = 1,n
                                c(i,j) = c(i,j) + alpha * a(i,k)*b(k,j)
                        end do
                end do
        end do
!$OMP end do
        
        call papif_hl_region_end("computation", retval)
        if ( retval .ne. papi_ok ) then
                write (*,*) "PAPIf_hl_region_end failed!"
        end if
!$OMP end parallel

        do i = lbound(c,1), ubound(c,1)
            write(*,*) (c(i,j), j=lbound(c,2), ubound(c,2))
        end do
end program main
```

[matrix_multiply_mpipa_hl.f90]
```sh
program main
        implicit none
        include "f90papi.h"
        include "mpif.h"
        integer i, j, k, l, m, n
        integer nprocs, myrank, ista, iend
        integer retval, ierr
        double precision, allocatable :: a(:,:), b(:,:), c(:,:), d(:,:)
        double precision alpha, beta
        
        l=3000; m=l; n=l
        alpha=1.0; beta=0.0

        call mpi_init(ierr)
        call mpi_comm_size(mpi_comm_world,nprocs,ierr)
        call mpi_comm_rank(mpi_comm_world,myrank,ierr)
        call para_range(1,m,nprocs,myrank,ista,iend)

        allocate(a(l,n), b(n,m), c(l,iend-ista+1))
        if (myrank==0) then
                allocate(d(l,m))
        endif

        if (myrank==0) then
                call random_number(a)
                call random_number(b)
                a = a - 0.5d0
                b = b - 0.5d0
        endif
        c = 0.0d0

        call mpi_bcast(a,l*n,mpi_double_precision,0,mpi_comm_world,ierr)
        call mpi_bcast(b,n*m,mpi_double_precision,0,mpi_comm_world,ierr)
 
        call PAPIf_hl_region_begin("computation", retval)
        if ( retval .ne. papi_ok ) then
                write (*,*) "PAPIf_hl_region_begin failed!"
        end if

        do i = 1,l
                do j = ista,iend
                        c(i,j-ista+1) = beta * c(i,j-ista+1)
                        do k = 1,n
                                c(i,j-ista+1) = c(i,j-ista+1) + alpha * a(i,k)*b(k,j)
                        end do
                end do
        end do
        
        call PAPIf_hl_region_end("computation", retval)
        if ( retval .ne. papi_ok ) then
                write (*,*) "PAPIf_hl_region_end failed!"
        end if

        call mpi_gather(c,l*(iend-ista+1),mpi_double_precision, &
                        d,l*(iend-ista+1),mpi_double_precision,0,mpi_comm_world,ierr)

        if (myrank==0) then
                do i = lbound(d,1), ubound(d,1)
                    write(*,*) (d(i,j), j=lbound(d,2), ubound(d,2))
                end do
        endif
        call mpi_finalize(ierr)
end program main
```

[para_range.f90]
```sh
subroutine para_range(n1, n2, nprocs, irank, ista, iend)
        implicit none
        integer n1, n2, nprocs, irank, ista, iend, iwork1, iwork2
        iwork1 = (n2 - n1 + 1) / nprocs
        iwork2 = mod(n2 - n1 + 1, nprocs)
        ista = irank * iwork1 + n1 + min(irank, iwork2)
        iend = ista + iwork1 - 1
        if (iwork2 > irank) iend = iend + 1
end
```

以下コマンドを **PAPI** を利用するユーザで実行し、非並列・OpenMP並列兼用版サンプルプログラムを非並列プログラムとしてコンパイルします。

```sh
$ module load papi
$ gfortran -O3 -I/opt/papi/include -lpapi -o serial ./matrix_multiply_thrpa_hl.f90
```

次に、以下コマンドを **PAPI** を利用するユーザで実行し、非並列・OpenMP並列兼用版サンプルプログラムをOpenMP並列プログラムとしてコンパイルします。

```sh
$ gfortran -O3 -fopenmp -I/opt/papi/include -lpapi -o openmp ./matrix_multiply_thrpa_hl.f90
```

次に、以下コマンドを **PAPI** を利用するユーザで実行し、MPI並列版サンプルプログラムをコンパイルします。

```sh
$ module load openmpi
$ mpifort -O3 -I/opt/papi/include -lpapi -o mpi ./matrix_multiply_mpipa_hl.f90 ./para_range.f90
```

# 4. サンプルプログラム実行

本章は、先に作成した実行バイナリを実行し、 **PAPI** がプロファイリング情報を出力することを確認します。

**PAPI** は、環境変数 **PAPI_EVENTS** に指定されているハードウェアカウンタにアクセスし、環境変数 **PAPI_OUTPUT_DIRECTORY** に指定されているディレクトリ以下の **papi_hl_output** ディレクトリにプロファイリング情報を格納します。

ここでは、浮動小数点演算数（**PAPI_FP_OPS**）と浮動小数点演算インストラクション数（**PAPI_FP_INS**）を取得しています。

以下コマンドを **PAPI** を利用するユーザで実行し、非並列版実行バイナリを実行して **PAPI** がプロファイリング情報を出力することを確認します。

```sh
$ export PAPI_EVENTS=PAPI_FP_OPS,PAPI_FP_INS
$ mkdir ./prof_serial ./prof_openmp ./prof_mpi
$ export PAPI_OUTPUT_DIRECTORY=./prof_serial
$ ./serial > /dev/null
$ ls -l ./prof_serial/papi_hl_output/
total 4
-rw-r--r--. 1 opc opc 638 Mar 28 10:47 rank_894286.json
$
```

次に、以下コマンドを **PAPI** を利用するユーザで実行し、OpenMP並列版実行バイナリを実行して **PAPI** がプロファイリング情報を出力することを確認します。

```sh
$ export PAPI_OUTPUT_DIRECTORY=./prof_openmp
$ export OMP_NUM_THREADS=2
$ ./openmp > /dev/null
$ ls -l ./prof_openmp/papi_hl_output/
total 4
-rw-r--r--. 1 opc opc 925 Mar 28 12:09 rank_586163.json
$
```

次に、以下コマンドを **PAPI** を利用するユーザで実行し、MPI並列版実行バイナリを実行して **PAPI** がプロファイリング情報を出力することを確認します。  
この結果より、 **PAPI** はプロセス毎にプロファイリング情報ファイルを出力することがわかります。

```sh
$ export PAPI_OUTPUT_DIRECTORY=./prof_mpi
$ mpirun -n 2 ./mpi > /dev/null
$ ls -l ./prof_mpi/papi_hl_output/
total 8
-rw-r--r--. 1 opc opc 638 Mar 28 12:38 rank_000000.json
-rw-r--r--. 1 opc opc 638 Mar 28 12:38 rank_000001.json
$
```

# 5. プロファイリング結果確認

本章は、 **PAPI** が提供する **High Level API** 用プロファイリング情報集計ツールを使用し、先に取得したプロファイリング情報から非並列版・OpenMP並列版・MPI並列版の実行時性能をそれぞれ確認します。

以下コマンドを **PAPI** を利用するユーザで実行し、非並列版の性能を確認します。  
この出力より、実時間 **33.09秒** で浮動小数点演算を **54.0 G回** 実行し、 **1.6 GFLOPS** の性能であることがわかります。

```sh
$ papi_hl_output_writer.py --notation=raw --type=summary --source_dir ./prof_serial/papi_hl_output
{
    "computation": {
        "region_count": 1,
        "cycles": 98794530188,
        "real_time_nsec": 33009393205,
        "PAPI_FP_OPS": 54009000020,
        "PAPI_FP_INS": 54009000020
    }
}
$ papi_hl_output_writer.py --notation=derived --type=summary --source_dir ./prof_serial/papi_hl_output
{
    "computation": {
        "Region count": 1,
        "Real time in s": 33.01,
        "MFLIPS/s": 1636.14,
        "MFLOPS/s": 1636.14
    }
}
$
```

次に、以下コマンドを **PAPI** を利用するユーザで実行し、OpenMP並列版の性能を確認します。  
この出力より、実時間 **17.0秒** で浮動小数点演算を **81.0 G回** 実行し、 **4.8 GFLOPS** の性能であることがわかります。

```sh
$ papi_hl_output_writer.py --notation=raw --type=summary --source_dir ./prof_openmp/papi_hl_output
{
    "computation": {
        "region_count": 2,
        "cycles": {
            "total": 101728345502,
            "min": 50864043344,
            "median": 50864172751.0,
            "max": 50864302158
        },
        "real_time_nsec": {
            "total": 33989646135,
            "min": 16994779977,
            "median": 16994823067.5,
            "max": 16994866158
        },
        "PAPI_FP_OPS": {
            "total": 81009000040,
            "min": 40504500020,
            "median": 40504500020.0,
            "max": 40504500020
        },
        "PAPI_FP_INS": {
            "total": 81009000040,
            "min": 40504500020,
            "median": 40504500020.0,
            "max": 40504500020
        },
        "Number of ranks": 1,
        "Number of threads per rank": 2
    }
}
$ papi_hl_output_writer.py --notation=raw --type=summary --source_dir ./prof_openmp/papi_hl_output | jq -r '[.computation.PAPI_FP_OPS.total, .computation.real_time_nsec.max] | @csv' | awk -F, '{print $1/$2 " GFLOPS"}'
4.76667 GFLOPS
$
```

次に、以下コマンドを **PAPI** を利用するユーザで実行し、MPI並列版の性能を確認します。  
この出力より、実時間 **16.5秒** で浮動小数点演算を **54.0 G回** 実行し、 **3.3 GFLOPS** の性能であることがわかります。

```sh
$ papi_hl_output_writer.py --notation=raw --type=summary --source_dir ./prof_mpi/papi_hl_output
{
    "computation": {
        "region_count": 2,
        "cycles": {
            "total": 98643966304,
            "min": 49310564768,
            "median": 49321983152.0,
            "max": 49333401536
        },
        "real_time_nsec": {
            "total": 32959085657,
            "min": 16475727594,
            "median": 16479542828.5,
            "max": 16483358063
        },
        "PAPI_FP_OPS": {
            "total": 54009000040,
            "min": 27004500020,
            "median": 27004500020.0,
            "max": 27004500020
        },
        "PAPI_FP_INS": {
            "total": 54009000040,
            "min": 27004500020,
            "median": 27004500020.0,
            "max": 27004500020
        },
        "Number of ranks": 2,
        "Number of threads per rank": 1
    }
}
$ papi_hl_output_writer.py --notation=raw --type=summary --source_dir ./prof_mpi/papi_hl_output | jq -r '[.computation.PAPI_FP_OPS.total, .computation.real_time_nsec.max] | @csv' | awk -F, '{print $1/$2 " GFLOPS"}'
3.27658 GFLOPS
$
```