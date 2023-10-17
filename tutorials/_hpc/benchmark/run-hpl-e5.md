---
title: "HPL実行方法（BM.Standard.E5.192編）"
excerpt: "本ドキュメントは、HPCワークロードの実行に最適なベアメタルインスタンスBM.Standard.E5.192で、標準ベンチマークのHPLを実行する方法を解説します。"
order: "2111"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

本ドキュメントは、HPCワークロードの実行に最適なベアメタルインスタンス **[BM.Standard.E5.192](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** で、標準ベンチマークの **[HPL](https://www.netlib.org/benchmark/hpl/)** を実行する方法を解説します。

***
# 0. 概要

本ドキュメントで解説する **HPL** の実行は、AMDの **HPL** 実装である **[AMD Zen HPL optimized for AMD EPYC processors](https://www.amd.com/en/developer/zen-software-studio/applications/pre-built-applications.html)** （本ドキュメントで使用するバージョンは2023_07_18）を **[OpenMPI](https://www.open-mpi.org/)** （本ドキュメントで使用するバージョンは4.1.1）と共に使用します。

**HPL** を実行するインスタンスは、HPCワークロード向けベアメタルシェイプ **BM.Standard.E5.192** 1インスタンスとし、OSは **Oracle Linux** 8を使用します。

以上より、本ドキュメントで解説する **HPL** 実行は、以下の手順を経て行います。

- **BM.Standard.E5.192** のデプロイ
- **OpenMPI** インストール
- **AMD Zen HPL optimized for AMD EPYC processors** インストール
- **HPL** 実行

本ドキュメントは、以下の環境で **HPL** を実行しており、以下の性能が出ています。

[実行環境]
- シェイプ: **BM.Standard.E5.192**
- OS: **Oracle Linux** 8.8
-  **HPL** : **AMD Zen HPL optimized for AMD EPYC processors** （バージョン2023_07_18）
- MPI: **OpenMPI** （バージョン4.1.1）
- ノード数: 1
- 問題サイズ(N): 423,168
- ブロックサイズ(NB): 384
- プロセスグリッド(PxQ): 1x2

[実行結果]
- FLOPS: 7,526 GFLOPS
- 所要時間: 6,713秒

***
# 1. BM.Standard.E5.192のデプロイ

本章は、 **BM.Standard.E5.192** を1インスタンスデプロイします。

インスタンスのデプロイは、OCIチュートリアル **[インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** の手順に従い、以下属性のインスタンスを作成します。

- イメージ: Oracle Linux 8
- Shape: BM.Standard.E5.192

***
# 2. OpenMPIインストール

本章は、 **OpenMPI** をインストールします。

以下コマンドを先にデプロイしたインスタンスのopcユーザで実行し、 **OpenMPI** をインストールします。

```sh
$ sudo dnf install -y openmpi openmpi-devel
```

***
# 3. AMD Zen HPL optimized for AMD EPYC processorsインストール

本章は、 **AMD Zen HPL optimized for AMD EPYC processors** をインストールします。  

**[ここ](https://www.amd.com/en/developer/zen-software-studio/applications/pre-built-applications/zen-hpl-eula.html?filename=amd-zen-hpl-2023_07_18.tar.gz)** から **AMD Zen HPL optimized for AMD EPYC processors** のtarアーカイブをダウンロードし、任意のディレクトリに展開します。



***
# 4. HPL実行

本章は、 **HPL** を実行します。  
具体的には、以下の作業を実施します。

- numactl[^numactl]インストール
- **HPL** 実行

[^numactl]: HPL実行時にnumactlを使用するため

1. 以下コマンドをopcユーザで実行し、numactlをインストールします。

    ```sh
    $ sudo dnf install -y numactl
    ```

2. 以下コマンドをopcユーザで実行します。  
この **HPL** 実行は、 **2プロセス・プロセス当たり96レッド** で実行します。  
本ドキュメントの前提となる環境・設定で **HPL** 実行に要する時間は、2時間弱です。

    ```sh
    $ module load mpi
    $ cd amd-zen-hpl-2022_11
    $ mpirun -mca btl vader -mca mtl ^ofi --map-by socket:PE=96 -np 2 --bind-to core -x OMP_NUM_THREADS=96 -x OMP_PROC_BIND=close -x OMP_PLACES=cores numactl --localalloc ./xhpl
    ```