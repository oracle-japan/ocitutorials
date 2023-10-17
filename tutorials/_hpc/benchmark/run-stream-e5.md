---
title: "STREAM実行方法（BM.Standard.E5.192編）"
excerpt: "本ドキュメントは、HPCワークロードの実行に最適なベアメタルインスタンスBM.Standard.E5.192で、標準ベンチマークのSTREAMを実行する方法を解説します。"
order: "2121"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

本ドキュメントは、HPCワークロードの実行に最適なベアメタルインスタンス **[BM.Standard.E5.192](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** で、標準ベンチマークの **[STREAM](https://www.cs.virginia.edu/stream/)** を実行する方法を解説します。

***
# 0. 概要

本ドキュメントで解説する **STREAM** の実行は、 **[AMD Optimizing C/C++ and Fortran Compilers (AOCC)](https://www.amd.com/en/developer/aocc.html)** （本ドキュメントで使用するバージョンは4.0.0）で **STREAM** のソースコードをコンパイルして作成したバイナリを使用します。

**STREAM** を実行するインスタンスは、HPCワークロード向けベアメタルシェイプ **BM.Standard.E5.192** 1インスタンスとし、OSは **Oracle Linux** 8を使用します。

以上より、本ドキュメントで解説する **STREAM** 実行は、以下の手順を経て行います。

- **BM.Standard.E5.192** デプロイ
- **AOCC** インストール
- **STREAM** ダウンロード・コンパイル
- **STREAM** 実行

本ドキュメントは、以下の環境で **STREAM** を実行しており、以下の性能が出ています。

[実行環境]
- シェイプ: **BM.Standard.E5.192**
- OS: **Oracle Linux** 8.8
- **STREAM** : 5.10
- Cコンパイラ: **AOCC** 4.0.0
- 配列サイズ(STREAM_ARRAY_SIZE): 430,080,000

[実行結果]
- Triad(MB/s): 718,954

***
# 1. BM.Standard.E5.192のデプロイ

本章は、 **BM.Standard.E5.192** を1インスタンスデプロイします。

インスタンスのデプロイは、OCIチュートリアル **[インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** の手順に従い、以下属性のインスタンスを作成します。

- イメージ: Oracle Linux 8
- Shape: BM.Standard.E5.192

***
# 2. AOCCインストール

本章は、 **AOCC** をインストールします。

以下コマンドを先にデプロイしたインスタンスのopcユーザで実行し、 **AOCC** をインストールします。

```sh
$ sudo dnf install -y patch gcc-c++ gcc-gfortran git
$ git clone --depth=100 --branch=releases/v0.20 https://github.com/spack/spack.git ~/spack
$ cd ~/spack/
$ . share/spack/setup-env.sh
$ spack install aocc +license-agreed
```

***
# 3. STREAMダウンロード・コンパイル

本章は、 **STREAM** のソースコードをダウンロードし、先にインストールした **AOCC** でコンパイルして実行バイナリを作成します。

以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行します。

```sh
$ wget http://www.cs.virginia.edu/stream/FTP/Code/stream.c
$ spack load aocc
$ clang -DSTREAM_TYPE=double -DSTREAM_ARRAY_SIZE=430080000 -O3 -mcmodel=large -fopenmp -fnt-store ./stream.c 
```

***
# 4. STREAM実行

本章は、先に作成した **STREAM** の実行バイナリを使用し、 **STREAM** を実行します。  
具体的には、以下の作業を実施します。

- OS再起動
- スレッドアフィニティ用環境変数指定
- **STREAM** 実行

1. 以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行し、OSを再起動します。

    ```sh
    $ sudo shutdown -r now
    ```

2. 以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行し、 **STREAM** の性能向上を目的としたスレッドアフィニティの設定を適用します。

    ```sh
    $ export OMP_NUM_THREADS=96
    $ export KMP_AFFINITY="explicit,proclist=[`seq -s, 0 2 191`]"
    ```

3. 以下コマンドを **STREAM** を実行するインスタンスのopcユーザで実行し、 **STREAM** を実行します。

    ```sh
    $ ./a.out
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
    Each test below will take on the order of 10868 microseconds.
    (= 10868 clock ticks)
    Increase the size of the arrays if this shows that
    you are not getting at least 20 clock ticks per test.
    -------------------------------------------------------------
    WARNING -- The above is only a rough guideline.
    For best results, please be sure you know the
    precision of your system timer.
    -------------------------------------------------------------
    Function    Best Rate MB/s  Avg time     Min time     Max time
    Copy:          686067.7     0.010067     0.010030     0.010102
    Scale:         688128.7     0.010041     0.010000     0.010080
    Add:           723375.0     0.014301     0.014269     0.014346
    Triad:         718954.3     0.014377     0.014357     0.014406
    -------------------------------------------------------------
    Solution Validates: avg error less than 1.000000e-13 on all three arrays
    -------------------------------------------------------------
    ```
