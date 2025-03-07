---
title: "線形代数演算ライブラリインストール・利用方法"
excerpt: "HPCワークロードを実行する際、行列やベクトルの線形代数演算を高速に実行する必要が生じます。これらの演算は、ソースコードを自作することで対応することも出来ますが、オープンソースで配布されている線形代数演算ライブラリであるBLASやOpenBLASを利用することで、開発工数の削減、保証された計算精度、高速な演算の実行等、様々なメリットを享受することが可能です。本テクニカルTipsは、BLASとOpenBLASをHPCワークロードの実行に最適なベアメタルインスタンスにインストールし、Fortranのサンプルコードからこれを利用する方法を解説します。"
order: "353"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

**[BLAS](https://www.netlib.org/blas/)** は、ベクトルや行列の基本的な線形代数演算を行うサブルーチンを集めたライブラリで、インターフェース互換を維持してこれを高速化したものが **[OpenBLAS](https://github.com/OpenMathLib/OpenBLAS/wiki)** です。  
このため、 **BLAS** 用に作成されたプログラムであれば、再コンパイル・リンクを行うだけでソースプログラムを修正することなく **OpenBLAS** を使用してアプリケーションを高速化することが可能です。

また **OpenBLAS** は、pthreadを使用するスレッド並列実行に対応しており、 **BLAS** のサブルーチンを並列化で更に高速実行することが可能です。

以降では、 **BLAS** と **OpenBLAS** をHPCワークロードの実行に最適なベアメタルインスタンスの **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** にインストール・セットアップし、 **BLAS** の倍精度行列・行列積サブルーチン（DGEMM）を使用するFortranのサンプルプログラムをコンパイル後、 **BLAS** とスレッド数を変化させたときの **OpenBLAS** の実行性能を比較・検証します。  
この性能比較詳細は、 **[3. サンプルプログラム実行](#3-サンプルプログラム実行)** に記載していますが、これを抜粋している下表からも性能は圧倒的に **OpenBLAS** が良いことがわかり、特に本テクニカルTipsで使用している **BM.Optimized3.36** の全コアを利用して線形代数演算を実行するようなワークロードでは、 **OpenBLAS** を利用するメリットが大きいと言えます。

| ライブラリ    | スレッド数 | 速度向上比 |
| :------: |    ---: | ----: |
| BLAS         |1      | 1     |
| OpenBLAS | 1     | 34.4  |
|          | 36    | 538.5 |

本テクニカルTipsでは、各ソフトウェアに以下のバージョンを使用しています。

- OS ： **Oracle Linux** 8.9
- **BLAS** ：3.8.0
- **OpenBLAS** ：0.3.26
- Fortranコンパイラ： **[GNU Fortran](https://gcc.gnu.org/fortran/)** 8.5.0

なお、本テクニカルTipsで使用するインスタンスは、シェイプを **BM.Optimized3.36** 、OSを **Oracle Linux** 8.9として予めデプロイしておきますが、この手順は **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の  **[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** を参照してください。  
またこのインスタンスは、スレッド並列実行時の性能を最大化するためSMTを無効化しておきますが、BIOS設定でこれを適用する場合は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

***
# 1. BLAS・OpenBLASインストール・セットアップ

本章は、 **BLAS** と **OpenBLAS** をインストールし、利用に必要な環境設定を行います。  
なお **OpenBLAS** は、以降のインストール手順を実施する際に環境に合わせたライブラリの構築を行うため、本手順をコンパイル・実行する環境（本テクニカルTipsでは **BM.Optimized3.36** ）以外で実施（いわゆるクロスコンパイル）した場合、想定通りに動作しない場合があることに留意します。

1. 以下コマンドをopcユーザで実行し、 **BLAS** を提供するyumレポジトリを追加します。

    ```sh
    $ sudo yum-config-manager --enable ol8_codeready_builder
    ```

    なお、上記コマンド実行時に以下のメッセージが出力される場合、

    ```sh
    This system is receiving updates from OSMS server.
    Error: No matching repo to modify: ol8_developer_EPEL.
    ```

    OSのパッケージ管理が **[OS管理サービス](https://docs.oracle.com/ja-jp/iaas/os-management/index.html)** で行われているため、以下コマンドをクラスタ管理ノードのopcユーザで実行し、これを解除した後に再度yumレポジトリを追加します。  
    ここで実施する **OS管理サービス** の解除は、10分程度の時間が経過すると自動的に **OS管理サービス** 管理に戻ります。

    ```sh
    $ sudo osms unregister
    $ sudo yum-config-manager --enable ol8_codeready_builder
    ```

2. 以下コマンドをopcユーザで実行し、 **BLAS** をインストールします。

    ```sh
    $ sudo dnf install -y blas blas-devel
    ```

3. 以下コマンドをopcユーザで実行し、 **OpenBLAS** を **/opt/OpenBLAS** ディレクトリにインストールします。

    ```sh
    $ sudo dnf install -y git
    $ git clone https://github.com/xianyi/OpenBLAS.git
    $ cd OpenBLAS
    $ make && sudo make install
    ```

4. 以下コマンドをopcユーザで実行し、 **OpenBLAS** 実行に必要な環境変数を設定します。

    ```sh
    $ echo "export LD_LIBRARY_PATH=\$LD_LIBRARY_PATH:/opt/OpenBLAS/lib" | tee -a ~/.bashrc
    $ source ~/.bashrc
    ```

***
# 2. サンプルプログラムコンパイル

本章は、 **BLAS** の倍精度行列・行列積サブルーチン（DGEMM）を使用するFortranのサンプルプログラムを **BLAS** と **OpenBLAS** を使用してコンパイルし、実行バイナリを作成します。  
なお、ここで使用するサンプルプログラム（**dgemm_timer.f90**）は、サイズが5,000x5,000の正方行列を乱数で初期化してその行列積をサブルーチンdgemmを使用して求め、その結果を標準出力に出力します。またdgemmの所要時間をタイマーで計測し、これを標準エラー出力に出力します。

[dgemm_timer.f90]
```sh
program main
        implicit none
        external dgemm
        integer i, j, l, m, n
        integer lda, ldb, ldc
        integer t1, t2, t_rate, t_max, diff
        double precision, allocatable :: a(:,:), b(:,:), c(:,:)
        double precision alpha, beta

        l=5000; m=l; n=l
        lda=l; ldb=n; ldc=l
        alpha=1.0; beta=0.0
        allocate(a(lda,n), b(ldb,m), c(ldc,m))
        call random_number(a)
        call random_number(b)
        a = a - 0.5d0
        b = b - 0.5d0

        call system_clock(t1)
        call dgemm('n','n',l,m,n,alpha,a,lda,b,ldb,beta,c,ldc)
        call system_clock(t2, t_rate, t_max)

        if ( t2 < t1 ) then
                diff = (t_max - t1) + t2 + 1
        else
                diff = t2 - t1
        endif
        write(0,'(a,f10.3)') "Elapse time(sec):", diff/dble(t_rate)

        do i = lbound(c,1), ubound(c,1)
                write(*,*) (c(i,j), j=lbound(c,2), ubound(c,2))
        end do
end program main
```

1. 以下コマンドをopcユーザで実行し、 **BLAS** を使用してサンプルプログラムをコンパイルします。

    ```sh
    $ gfortran -O3 -lblas -o blas ./dgemm_timer.f90
    ```

2. 以下コマンドをopcユーザで実行し、 **OpenBLAS** を使用してサンプルプログラムをコンパイルします。

    ```sh
    $ gfortran -O3 -L/opt/OpenBLAS/lib -lopenblas -o openblas ./dgemm_timer.f90
    ```

***
# 3. サンプルプログラム実行

本章は、先に作成した実行バイナリを実行し、 **BLAS** と **OpenBLAS** の性能を比較します。

1. 以下コマンドをopcユーザで実行し、 **BLAS** 版実行バイナリを実行してdgemmの所要時間を計測します。

    ```sh
    $ ./blas > /dev/null
    Elapse time(sec):    87.229
    $
    ```

2. 以下コマンドをopcユーザで実行し、 **OpenBLAS** 版実行バイナリを実行してdgemmの所要時間を計測します。  
ここでは、環境変数 **OMP_NUM_THREADS** の値を **BM.Optimized3.36** の搭載コア数（36）の範囲で変化させて、その所要時間の変化を確認しています。なお、環境変数 **OMP_NUM_THREADS** の指定が無い場合は、実行するインスタンスの搭載コア数と同じスレッド数で実行します。

    ```sh
    $ for nt in `echo 1 2 4 8 16 32 36`; do echo $nt; export OMP_NUM_THREADS=$nt; ./openblas > /dev/null; done
    1
    Elapse time(sec):     2.533
    2
    Elapse time(sec):     1.285
    4
    Elapse time(sec):     0.684
    8
    Elapse time(sec):     0.359
    16
    Elapse time(sec):     0.214
    32
    Elapse time(sec):     0.168
    36
    Elapse time(sec):     0.162
    $
    ```

以上の結果をまとめると、以下のようになります。

| No. | ライブラリ    | スレッド数 | 所要時間     | 速度向上比<br>（※1）  | 並列化効率<br>（※1）  | GFLOPS<br>（※2, 3） |
| :-: | :------: | :---: | -------: | -----: | -----: | ---------: |
| 1   | BLAS     | 1     | 87.229 秒 | 0.029  | -      | 2.9      |
| 2   | OpenBLAS | 1     | 2.533 秒  | 1      | -      | 99.0       |
| 3   |          | 2     | 1.285 秒  | 1.971  | 98.6 % | 195.1      |
| 4   |          | 4     | 0.684 秒  | 3.703  | 92.6 % | 366.5      |
| 5   |          | 8     | 0.359 秒  | 7.056  | 88.2 % | 698.3      |
| 6   |          | 16    | 0.214 秒  | 11.836 | 74.0 % | 1,171.5    |
| 7   |          | 32    | 0.168 秒  | 15.077 | 47.1 % | 1,492.3    |
| 8   |          | 36    | 0.162 秒  | 15.636 | 43.4 % | 1,547.5    |

※1）No.2のテストケースをベースに算出しています。  
※2）算出に必要な浮動小数点演算数（ **250.7 GFLOP** ）は、本サンプルプログラムのdgemm部分を **[PAPI](https://icl.utk.edu/papi/)** で計測して求めています。  
※3）**BM.Optimized3.36** の倍精度浮動小数点演算の理論性能は、ベースクロックの3.0GHz動作時でコア当たり **96 GFLOPS** 、ノード当たり **3,456 GFLOPS** です。