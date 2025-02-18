---
title: "PAPIでHPCアプリケーションをプロファイリング"
excerpt: "HPCワークロードの実行に最適なベアメタル・インスタンスでアプリケーションを実行する場合、高価な計算資源を有効活用出来ているかを検証するため、アプリケーションのプロファイリングを実施することが一般的です。PAPIは、HPCワークロード向けベ **アメタル・シェイプ** に採用されているIntel Ice LakeやAMD EPYC 9004シリーズのCPUが持つハードウェアカウンタから浮動小数点演算数やキャッシュヒット数といったプロファイリングに有益な情報を取得するAPIを提供し、HPCアプリケーションのプロファイリングに欠かせないツールとなっています。本プロファイリング関連Tipsは、ベアメタル・インスタンス上で実行するHPCアプリケーションをPAPIを使ってプロファイリングする方法を解説します。"
order: "231"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

HPCワークロードの実行に最適なベアメタル・インスタンスでアプリケーションを実行する場合、高価な計算資源を有効活用出来ているかを検証するため、アプリケーションのプロファイリングを実施することが一般的です。  
**[PAPI](https://icl.utk.edu/papi/)** は、HPCワークロード向け **ベアメタル・シェイプ** に採用されている **Intel Ice Lake** や **AMD EPYC 9004シリーズ** のCPUが持つハードウェアカウンタから浮動小数点演算数やキャッシュヒット数といったプロファイリングに有益な情報を取得するAPIを提供し、HPCアプリケーションのプロファイリングに欠かせないツールとなっています。  
本プロファイリング関連Tipsは、 **ベアメタル・インスタンス** 上で実行するHPCアプリケーションを **PAPI** を使ってプロファイリングする方法を解説します。

***
# 0. 概要

**PAPI (Performance Application Programming Interface)** は、異なるプラットフォーム間を共通のインターフェースで利用できるように設計された性能解析ツールで、プロファイリング対象のアプリケーションからAPIをコールすることで、CPU/GPUをはじめとする様々なハードウェアからプロファイリングに有益な情報を収集します。  
この **PAPI** の可搬性は、ハードウェア固有の部分を吸収する下層と、プロファイリングを行うアプリケーション開発者が利用する抽象化された上位層にソフトウェアスタックを分割することで、これを実現しています。これらの関係は、 **[ここ](https://icl.utk.edu/projects/papi/files/documentation/PAPI_USER_GUIDE_23.htm#ARCHITECTURE)** に記載のアーキテクチャ図が参考になります。

**PAPI** のAPIは、HPCアプリケーションをプロファイリングするユースケースの場合、 **Low Level API** と **[High Level API](https://github.com/icl-utk-edu/papi/wiki/PAPI-HL)** から選択して利用することが出来ます。  
**High Level API** は、内部で **Low Level API** を使用することでより高機能のプロファイリングが可能なAPIを提供し、 **Low Level API** に対して以下の利点があります。

- より少ないAPIコールで同じプロファイリング機能を実現（※1）
- コードを修正することなく利用するハードウェアカウンタの変更が可能（※2）
- プロファイリング情報の出力制御が不要（※3）

※1）最も少ないケースは、プログラム中の計測範囲の前後に2回APIコールを挟み込むだけです。  
※2）アプリケーション実行時の環境変数で利用するハードウェアカウンタを指定します。これに対し **Low Level API** は、APIをコールして利用するハードウェアカウンタを指定するため、これを変更する場合再コンパイルが必要です。  
※3）計測範囲の最後を指定するAPIがコールされると、環境変数に指定したディレクトリにプロファイリング情報を格納したファイルが自動的に作成されます。これに対し **Low Level API** は、明示的に取得したハードウェアカウンタの値を出力する必要があります。

以上を踏まえて本プロファイリング関連Tipsでは、 **High Level API** を使用するサンプルプログラムを使って **PAPI** の利用方法を解説します。

**PAPI** は、 **Intel Ice Lake** プロセッサを搭載する **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** の場合、以下のようなハードウェアカウンタを利用することが可能です。  
利用可能なハードウェアカウンタ一覧は、 **[2. PAPIインストール・セットアップ](#2-papiインストールセットアップ)** のステップ3の手順で取得することが可能です。

- 浮動小数点演算数
- 浮動小数点演算インストラクション数
- L1/L2/L3の各キャッシュヒット/ミス数
- 総サイクル数

本プロファイリング関連Tipsは、各ソフトウェアに以下のバージョンを使用しています。

- OS ： **Oracle Linux** 8.9
- **[OpenMPI](https://www.open-mpi.org/)** ：5.0.0
- **PAPI** ：7.1.0

また本プロファイリング関連Tipsで使用するインスタンスは、シェイプを **BM.Optimized3.36** 、OSを **Oracle Linux** 8.9として予めデプロイしておきますが、この手順は **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の  **[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** を参照してください。

以降では、以下の順に解説を進めます。

- 前提条件ソフトウェアインストール・セットアップ
- PAPIインストール・セットアップ
- サンプルプログラムコンパイル
- サンプルプログラム実行
- プロファイリング結果確認

***
# 1. 前提条件ソフトウェアインストール・セットアップ

本章は、本プロファイリングTipsで使用する **PAPI** 機能を検証するために必要な前提条件ソフトウェアとして、 **OpenMPI** をインストール・セットアップします。

この方法は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** を参照してください。

***
# 2. PAPIインストール・セットアップ

本章は、 **PAPI** をインストールし、利用に必要な環境設定を行います。  
なお **PAPI** は、以降のインストール手順の中で環境に合わせた構築を行うため、 **PAPI** を利用する環境（本プロファイリング関連Tipsでは **BM.Optimized3.36** ）以外で本手順を実施（いわゆるクロスコンパイル）した場合、想定通りに動作しない場合があることに留意します。

1. 以下コマンドをopcユーザで実行し、 **PAPI** をインストールします。  
これにより、 **PAPI** のライブラリ群が **/usr/local/lib** に、プロファイリング情報集計ツール等のユーティリティーツール群が **/usr/local/bin** にインストールされます。  
なお、makeコマンドの並列数は当該ノードのコア数に合わせて調整します。

    ```sh
    $ git clone https://github.com/icl-utk-edu/papi.git
    $ cd papi/src; ./configure
    $ make -j 36 && sudo make install
    ```

2. 以下コマンドをopcユーザで実行し、コマンド出力の最後に **PASSED** が出力されることを以って、 **PAPI** が利用可能であることを確認します。  
このコマンドは、利用可能な全てのプリセットイベント（ここでは42個）をテストし、その結果を表示します。

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

3. 以下コマンドをopcユーザで実行し、利用可能なプリセットイベントを確認します。

    ```sh
    $ papi_avail | grep ^PAPI_ | awk '{if($3=="Yes")print $0}'
    PAPI_L1_DCM  0x80000000  Yes   No   Level 1 data cache misses
    :
    :
    :
    PAPI_REF_CYC 0x8000006b  Yes   No   Reference clock cycles

    $ 
    ```

4. 以下コマンドをopcユーザで実行し、 **PAPI** 実行に必要な環境変数を設定します。

    ```sh
    $ echo "export LD_LIBRARY_PATH=\$LD_LIBRARY_PATH:/usr/local/lib" | tee -a ~/.bashrc
    $ source ~/.bashrc
    ```

***
# 3. サンプルプログラムコンパイル

本章は、 **PAPI** を使用してプロファイリング情報を取得する、非並列・OpenMP並列兼用版（**matrix_multiply_thrpa_hl.f90**）とMPI並列版（**matrix_multiply_mpipa_hl.f90** と **para_range.f90**）のサンプルプログラム をそれぞれコンパイルし、実行バイナリを作成します。

このサンプルプログラムは、サイズが3,000x3,000の正方行列を乱数で初期化した後にその行列積を求め、その結果を標準出力に出力します。この際、行列積を求める3重ループ前後で **PAPI** の **High Level API** 関数を呼び出すことで、プロファイリング情報をカーネル部分にフォーカスして取得します。  
ここでOpenMP並列版は、 **PAPI** 関数をスレッド生成後に呼び出している（**!$OMP parallel** と **!$OMP end parallel**の間に配置します。）ことに留意します。これは、 **PAPI** がスレッドの生成を検知できない制限から来ており、スレッド生成前に **PAPI** 関数を呼び出すとその後生成されたスレッドが消費した分のプロファイリング情報を取得することができません。

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

1. 以下コマンドをopcユーザで実行し、非並列・OpenMP並列兼用版サンプルプログラムを非並列プログラムとしてコンパイルします。

    ```sh
    $ gfortran -O3 -I/usr/local/include -lpapi -o serial ./matrix_multiply_thrpa_hl.f90
    ```

2. 以下コマンドをopcユーザで実行し、非並列・OpenMP並列兼用版サンプルプログラムをOpenMP並列プログラムとしてコンパイルします。

    ```sh
    $ gfortran -O3 -fopenmp -I/usr/local/include -lpapi -o openmp ./matrix_multiply_thrpa_hl.f90
    ```

3. 以下コマンドをopcユーザで実行し、MPI並列版サンプルプログラムをコンパイルします。

    ```sh
    $ mpifort -O3 -I/usr/local/include -lpapi -o mpi ./matrix_multiply_mpipa_hl.f90 ./para_range.f90
    ```

***
# 4. サンプルプログラム実行

本章は、先に作成した実行バイナリを実行し、 **PAPI** がプロファイリング情報を出力することを確認します。

**PAPI** は、環境変数 **PAPI_EVENTS** に指定されているハードウェアカウンタにアクセスし、環境変数 **PAPI_OUTPUT_DIRECTORY** に指定されているディレクトリ以下の **papi_hl_output** ディレクトリにプロファイリング情報を格納します。

ここでは、浮動小数点演算数（**PAPI_FP_OPS**）と浮動小数点演算インストラクション数（**PAPI_FP_INS**）を取得しています。

1. 以下コマンドをopcユーザで実行し、非並列版実行バイナリを実行して **PAPI** がプロファイリング情報を出力することを確認します。

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

2.  以下コマンドをopcユーザで実行し、OpenMP並列版実行バイナリを実行して **PAPI** がプロファイリング情報を出力することを確認します。

    ```sh
    $ export PAPI_OUTPUT_DIRECTORY=./prof_openmp
    $ export OMP_NUM_THREADS=2
    $ ./openmp > /dev/null
    $ ls -l ./prof_openmp/papi_hl_output/
    total 4
    -rw-r--r--. 1 opc opc 925 Mar 28 12:09 rank_586163.json
    $
    ```

3. 以下コマンドをopcユーザで実行し、MPI並列版実行バイナリを実行して **PAPI** がプロファイリング情報を出力することを確認します。  
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

***
# 5. プロファイリング結果確認

本章は、 **PAPI** が提供する **High Level API** 用プロファイリング情報集計ツールを使用し、先に取得したプロファイリング情報から非並列版・OpenMP並列版・MPI並列版の実行時性能をそれぞれ確認します。

1. 以下コマンドをopcユーザで実行し、非並列版の性能を確認します。  
この出力より、実時間 **32.9秒** で浮動小数点演算を **54.0 G回** 実行し、 **1.6 GFLOPS** の性能であることがわかります。

    ```sh
    $ papi_hl_output_writer.py --notation=raw --type=summary --source_dir ./prof_serial/papi_hl_output
    {
        "computation": {
            "region_count": 1,
            "cycles": 98335317464,
            "real_time_nsec": 32854673374,
            "PAPI_FP_OPS": 54009000020,
            "PAPI_FP_INS": 40509000020
        }
    }
    $ papi_hl_output_writer.py --notation=derived --type=summary --source_dir ./prof_serial/papi_hl_output
    {
        "computation": {
            "Region count": 1,
            "Real time in s": 32.85,
            "MFLIPS/s": 1233.15,
            "MFLOPS/s": 1644.11
        }
    }
    $
    ```

2. 以下コマンドをopcユーザで実行し、OpenMP並列版の性能を確認します。  
この出力より、実時間 **17.1秒** で浮動小数点演算を **81.0 G回** 実行し、 **4.8 GFLOPS** の性能であることがわかります。

    ```sh
    $ papi_hl_output_writer.py --notation=raw --type=summary --source_dir ./prof_openmp/papi_hl_output
    {
        "computation": {
            "region_count": 2,
            "cycles": {
                "total": 102064244838,
                "min": 51031993766,
                "median": 51032122419.0,
                "max": 51032251072
            },
            "real_time_nsec": {
                "total": 34100545311,
                "min": 17050231232,
                "median": 17050272655.5,
                "max": 17050314079
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
    4.75117 GFLOPS
    $
    ```

4. 以下コマンドをopcユーザで実行し、MPI並列版の性能を確認します。  
この出力より、実時間 **16.4秒** で浮動小数点演算を **54.0 G回** 実行し、 **3.3 GFLOPS** の性能であることがわかります。

    ```sh
    $ papi_hl_output_writer.py --notation=raw --type=summary --source_dir ./prof_mpi/papi_hl_output
    {
        "computation": {
            "region_count": 2,
            "cycles": {
                "total": 98000743834,
                "min": 48974201500,
                "median": 49000371917.0,
                "max": 49026542334
            },
            "real_time_nsec": {
                "total": 32742892813,
                "min": 16362702292,
                "median": 16371446406.5,
                "max": 16380190521
            },
            "PAPI_FP_OPS": {
                "total": 54009000040,
                "min": 27004500020,
                "median": 27004500020.0,
                "max": 27004500020
            },
            "PAPI_FP_INS": {
                "total": 40509000040,
                "min": 20254500020,
                "median": 20254500020.0,
                "max": 20254500020
            },
            "Number of ranks": 2,
            "Number of threads per rank": 1
        }
    }
    $ papi_hl_output_writer.py --notation=raw --type=summary --source_dir ./prof_mpi/papi_hl_output | jq -r '[.computation.PAPI_FP_OPS.total, .computation.real_time_nsec.max] | @csv' | awk -F, '{print $1/$2 " GFLOPS"}'
    3.29721 GFLOPS
    $
    ```