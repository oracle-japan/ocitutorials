---
title: "パフォーマンスを考慮したプロセス・スレッドのコア割当て指定方法（BM.Standard.E6.256編）"
excerpt: "NUMAアーキテクチャを採用するインスタンスに於けるMPIやOpenMPの並列プログラム実行は、生成されるプロセスやスレッドをどのようにインスタンスのコアに割当てるかでその性能が大きく変動するため、その配置を意識してアプリケーションを実行することが求められます。このため、使用するシェイプに搭載されるプロセッサのアーキテクチャやアプリケーションの特性に合わせて意図したとおりにプロセスやスレッドをコアに配置するために必要な、MPI実装、OpenMP実装、及びジョブスケジューラが有するコア割当て制御機能に精通している必要があります。本パフォーマンス関連Tipsは、MPI実装にOpenMPI、OpenMP実装にGNUコンパイラ、及びジョブスケジューラにSlurmを取り上げ、第5世代AMD EPYCプロセッサを搭載するベア・メタル・シェイプBM.Standard.E6.256でこれらのコア割当て機能を駆使してプロセス・スレッドのコア割当てを行う方法を解説します。"
order: "2208"
layout: single
header:
  teaser: "/hpc/benchmark/cpu-binding-e6/e6_architecture_nps4.png"
  overlay_image: "/hpc/benchmark/cpu-binding-e6/e6_architecture_nps4.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

## 0-0. 概要

本パフォーマンス関連Tipsは、NUMA（Non-Umiform Memory Access）アーキテクチャを採用する第5世代 **AMD EPYC** プロセッサを搭載するベア・メタル・シェイプ **[BM.Standard.E6.256](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** を使用するインスタンスで、並列プログラムの実行時性能に大きく影響するMPIが生成するプロセスとOpenMPが生成するスレッドのコア割当てについて、アプリケーション性能に有利となる典型的なパターンを例に挙げ、以下の観点でその実行方法を解説します。

1. **PRRTE** を使用するプロセス・スレッドのコア割当て  
この割当て方法は、 **[OpenMPI](https://www.open-mpi.org/)** に同梱される **[PRRTE](https://github.com/openpmix/prrte)** のMPIプロセスのコア割当て機能と、 **GNUコンパイラ** のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。  
この方法は、ジョブスケジューラを使用せずに **mpirun** を使用してMPI並列アプリケーションをインタラクティブに実行する場合に使用します。
2. **Slurm** を使用するプロセス・スレッドのコア割当て  
この割当て方法は、 **[Slurm](https://slurm.schedmd.com/)** のMPIプロセスのコア割当て機能と、 **GNUコンパイラ** のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。  
この方法は、 **Slurm** のジョブスケジューラ環境で **srun** を使用してMPI並列アプリケーションを実行する場合に使用します。

また最後の章では、プロセス・スレッドのコア割当てが想定通りに行われているかどうかを確認する方法と、この方法を使用して本パフォーマンス関連Tipsで紹介したコア割当てを行った際の出力例を紹介します。

なお、プロセス・スレッドのコア割当て同様に並列プログラムの実行時性能に大きく影響するメモリ割り当ては、割当てられるコアと同一NUMAノード内のメモリを割り当てることにより多くのケースで性能が最大となることから、以下のように **- -localalloc** オプションを付与した **numactl** コマンドの使用を前提とし、本パフォーマンス関連Tipsの実行例を記載します。

```sh
$ numactl --localalloc a.out
```

## 0-1. 前提システム

プロセス・スレッドのコア割当ては、使用するインスタンスのNUMAアーキテクチャやNUMAノードの構成方法に影響を受けますが、本パフォーマンス関連Tipsでは第5世代 **AMD EPYC** プロセッサを搭載する **BM.Standard.E6.256** を使用し、NUMAノード構成に **NUMA nodes per socket** （以降 **NPS** と呼称します。）が **1** （これがデフォルトで、以降 **NPS1** と呼称します。）と **4** （以降 **NPS4** と呼称します。）の場合を取り上げ（※1）、それぞれに関するコア割当て方法を解説します。

また使用する **BM.Standard.E6.256** は、 **Simultanious Multi Threading** （以降 **SMT** と呼称します。）を無効化（デフォルトは有効です。）しています。（※1）

※1）**NPS** と **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

以下は、 **BM.Standard.E6.256** のスペックです。

- CPU
    - **AMD EPYC** 9755ベース x 2
    - コア数： 256（ソケット当たり128・ **Core Complex Die** （※2）あたり8）
    - **CCD** 数： 32
    - L3キャッシュ： 1,024 MB（ **CCD** 当たり32 MB）
    - 理論性能： 11.0592 TFLOPS（ベース動作周波数2.7 GHz時）
- メモリ
    - テクノロジ： DDR5
    - チャネル数： 24
    - 帯域： 1,228.8 GB/s
    - 容量： 3.072 TB

※2）以降 **CCD** と呼称します。

また以下は、 **BM.Standard.E6.256** のアーキテクチャ図です。

![BM.Standard.E6.256アーキテクチャ図 NPS1](e6_architecture_nps1.png)

![BM.Standard.E6.256アーキテクチャ図 NPS4](e6_architecture_nps4.png)

## 0-2. コア割当てパターン

本パフォーマンス関連Tipsで取り上げるプロセス・スレッドのコア割当ては、パフォーマンスの観点で利用頻度の高い以下のパターンを解説します。  
ここで取り上げるコア割当てパターンは、第5世代 **AMD EPYC** プロセッサが **CCD** 単位にL3キャッシュを搭載し、L3キャッシュ当たりの割当てコア数を均等にすることで性能向上を得やすい点を考慮します。

| No.    | NPS      | ノード当たり<br>プロセス数 | プロセス当たり<br>スレッド数 | プロセス分割方法<br>（※3） | 備考                                           |
| :----: | :------: | :-------------: | :--------------: | :--------------: | :------------------------------------------: |
| **1**  | **NPS1** | 1               | 1                | -                | -                                            |
| **2**  | **NPS1** | 2               | 1                | -                | **NUMA** ノード当たり1プロセス                         |
| **3**  | **NPS1** | 32              | 1                | -                | **CCD** 当たり1プロセス                             |
| **4**  | **NPS1** | 64              | 1                | ブロック分割           | **CCD** 当たり2プロセス                             |
| **5**  | **NPS1** | 64              | 1                | サイクリック分割         | **CCD** 当たり2プロセス                             |
| **6**  | **NPS1** | 128              | 1                | ブロック分割           | **CCD** 当たり4プロセス                             |
| **7**  | **NPS1** | 128              | 1                | サイクリック分割         | **CCD** 当たり4プロセス                             |
| **8**  | **NPS1** | 256             | 1                | ブロック分割           | **CCD** 当たり8プロセス                             |
| **9**  | **NPS1** | 256             | 1                | サイクリック分割         | **CCD** 当たり8プロセス                             |
| **10** | **NPS1** | 2               | 128               | -                | **NUMA** ノード当たり1プロセス<br>MPI/OpenMPハイブリッド並列実行 |
| **11** | **NPS1** | 32              | 8                | -                | **CCD** 当たり1プロセス<br>MPI/OpenMPハイブリッド並列実行     |
| **12** | **NPS4** | 8               | 1                | -                | **NUMA** ノード当たり1プロセス                         |
| **13** | **NPS4** | 32              | 1                | -                | **CCD** 当たり1プロセス                             |
| **14** | **NPS4** | 64              | 1                | ブロック分割           | **CCD** 当たり2プロセス                             |
| **15** | **NPS4** | 64              | 1                | サイクリック分割         | **CCD** 当たり2プロセス                             |
| **16** | **NPS4** | 128              | 1                | ブロック分割           | **CCD** 当たり4プロセス                             |
| **17** | **NPS4** | 128              | 1                | サイクリック分割         | **CCD** 当たり4プロセス                             |
| **18** | **NPS4** | 256             | 1                | ブロック分割           | **CCD** 当たり8プロセス                             |
| **19** | **NPS4** | 256             | 1                | サイクリック分割         | **CCD** 当たり8プロセス                             |
| **20** | **NPS4** | 8               | 32               | -                | **NUMA** ノード当たり1プロセス<br>MPI/OpenMPハイブリッド並列実行 |
| **21** | **NPS4** | 32              | 8                | -                | **CCD** 当たり1プロセス<br>MPI/OpenMPハイブリッド並列実行     |

※3） **CCD** に対するプロセスの分割方法を示します。

![コアバインディング1](core_binding1.png)

![コアバインディング2](core_binding2.png)

![コアバインディング3](core_binding3.png)

![コアバインディング4](core_binding4.png)

![コアバインディング5](core_binding5.png)

![コアバインディング6](core_binding6.png)

![コアバインディング7](core_binding7.png)

![コアバインディング8](core_binding8.png)

![コアバインディング9](core_binding9.png)

![コアバインディング10](core_binding10.png)

![コアバインディング11](core_binding11.png)

***
# 1. PRRTEを使用するプロセス・スレッドのコア割当て

## 1-0. 概要

本章は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法](/ocitutorials/hpc/tech-knowhow/build-oraclelinux-hpcenv/)** に従って構築された **OpenMPI** に含まれる **PRRTE** を使用し、 **[0-2. コア割当てパターン](#0-2-コア割当てパターン)** に記載のコア割当てを実現する方法を解説します。

以降で解説するコア割当て方法は、以下の **mpirun** コマンドオプションと **GNUコンパイラ** 環境変数を組合せて実現します。

[ **mpirun** オプション]
- **-n** ：起動するMPIプロセス数
- **- -bind-to** ：MPIプロセスを割当てるリソース単位
- **- -map-by** ：MPIプロセスを割り振るリソース単位
- **- -rank-by** ：MPIプロセスを割り振るポリシー

[ **GNUコンパイラ** 環境変数]
- **OMP_NUM_THREADS** ：MPIプロセス当たりのOpenMPスレッド数
- **OMP_PROC_BIND** ：OpenMPスレッドのコア割当て方法

例えば **No. 9** のコア割当てを行う場合のコマンドは、以下になります。

```sh
$ mpirun -n 256 --bind-to core --map-by ppr:8:l3cache --rank-by span numactl --localalloc ./a.out
```

また **No. 11** のコア割当てを行う場合のコマンドは、以下になります。

```sh
$ mpirun -n 32 --bind-to core --map-by ppr:1:l3cache:PE=8 -x OMP_NUM_THREAD=8 -x OMP_PROC_BIND=TRUE numactl --localalloc ./a.out
```

以降では、コア割当てパターンを実現するオプション・環境変数の組み合わせを解説します。

## 1-1. 各コア割当てパターンのオプション・環境変数組合せ

本章は、 **[0-2. コア割当てパターン](#0-2-コア割当てパターン)** に記載のコア割当てを実現するための、 **mpirun** コマンドオプションと **GNUコンパイラ** 環境変数の組合せを記載します。  
なお、表中に **-** と記載されている箇所は、そのオプション・環境変数を指定する必要が無い（デフォルトのままで良い）ことを示します。

| No.    | -n  | - -bind-to | - -map-by           | - -rank-by | OMP_NUM_THREADS | OMP_PROC_BIND |
| :----: | :-: | :--------: | :-----------------: | :--------: | :-------------: | :-----------: |
| **1**  | 1   | -          | -                   | -          | -               | -             |
| **2**  | 2   | core       | ppr:1:package       | -          | -               | -             |
| **3**  | 32  | core       | ppr:1:l3cache       | -          | -               | -             |
| **4**  | 64  | core       | ppr:2:l3cache       | -          | -               | -             |
| **5**  | 64  | core       | ppr:2:l3cache       | span       | -               | -             |
| **6**  | 128  | core       | ppr:4:l3cache       | -          | -               | -             |
| **7**  | 128  | core       | ppr:4:l3cache       | span       | -               | -             |
| **8**  | 256 | core       | -                   | -          | -               | -             |
| **9**  | 256 | core       | ppr:8:l3cache       | span       | -               | -             |
| **10** | 2   | core       | ppr:1:package:PE=128 | -          | 128              | TRUE          |
| **11** | 32  | core       | ppr:1:l3cache:PE=8  | -          | 8               | TRUE          |
| **12** | 8   | core       | ppr:1:numa          | -          | -               | -             |
| **13** | 32  | core       | ppr:1:l3cache       | -          | -               | -             |
| **14** | 64  | core       | ppr:2:l3cache       | -          | -               | -             |
| **15** | 64  | core       | ppr:2:l3cache       | span       | -               | -             |
| **16** | 128  | core       | ppr:4:l3cache       | -          | -               | -             |
| **17** | 128  | core       | ppr:4:l3cache       | span       | -               | -             |
| **18** | 256 | core       | -                   | -          | -               | -             |
| **19** | 256 | core       | ppr:8:l3cache       | span       | -               | -             |
| **20** | 8   | core       | ppr:1:numa:PE=32    | -          | 32              | TRUE          |
| **21** | 32  | core       | ppr:1:l3cache:PE=8  | -          | 8               | TRUE          |

***
# 2. Slurmを使用するプロセス・スレッドのコア割当て

## 2-0. 概要

本章は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** と **[Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法](/ocitutorials/hpc/tech-knowhow/build-oraclelinux-hpcenv/)** に従って構築された **BM.Standard.E6.256** を計算ノードとする **Slurm** ジョブスケジューラ環境で、 **[0-2. コア割当てパターン](#0-2-コア割当てパターン)** に記載のコア割当てを実現する方法を解説します。

以降で解説するコア割当て方法は、以下の **srun** コマンドオプションと **GNUコンパイラ** 環境変数を組合せて実現します。

[ **srun** オプション]

- **-p** ：投入するパーティション
- **-n** ：起動するMPIプロセス数
- **-c** ：プロセス当たりに割り当てるコア数
- **- -cpu-bind** ：MPIプロセスを割当てるリソース単位
- **-m** ：MPIプロセスを割り振るポリシー

[ **GNUコンパイラ** 環境変数]

- **OMP_NUM_THREADS** ：MPIプロセス当たりのOpenMPスレッド数
- **OMP_PROC_BIND** ：OpenMPスレッドのコア割当て方法

例えば **No. 9** のコア割当てを行う場合のコマンドは、以下になります。

```sh
$ srun -p e6 -n 256 --cpu-bind=map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` numactl --localalloc ./a.out
```

また **No. 11** のコア割当てを行う場合のコマンドは、以下になります。

```sh
$ OMP_NUM_THREADS=8 OMP_PROC_BIND=TRUE srun -p e6 -n 32 -c 8 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do seq -s, $i 4 $((i+12)) | tr '\n' ','; done | sed 's/,$//g'` numactl --localalloc ./a.out
```

以降では、コア割当てパターンを実現するオプション・環境変数の組み合わせを解説します。

## 2-1. 各コア割当てパターンのオプション・環境変数組合せ

本章は、 **[0-2. コア割当てパターン](#0-2-コア割当てパターン)** に記載のコア割当てを実現するための、 **srun** コマンドオプションと **GNUコンパイラ** 環境変数の組合せを記載します。  
なお、表中に **-** と記載されている箇所は、そのオプション・環境変数を指定する必要が無い（デフォルトのままで良い）ことを示します。

|No.|-p|-n|-c|- -cpu-bind|-m|OMP_NUM_THREADS|OMP_PROC_BIND|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|**1**|e6|1|-|cores|-|-|-|
|**2**|e6|2|-|cores|-|-|-|
|**3**|e6|32|-|（※4）|-|-|-|
|**4**|e6|64|-|（※4）|-|-|-|
|**5**|e6|64|-|（※4）|-|-|-|
|**6**|e6|128|-|（※4）|-|-|-|
|**7**|e6|128|-|（※4）|-|-|-|
|**8**|e6|256|-|（※4）|-|-|-|
|**9**|e6|256|-|（※4）|-|-|-|
|**10**|e6|2|128|socket|-|128|TRUE|
|**11**|e6|32|8|（※4）|-|8|TRUE|
|**12**|e6|8|-|（※4）|-|-|-|
|**13**|e6|32|-|（※4）|-|-|-|
|**14**|e6|64|-|（※4）|-|-|-|
|**15**|e6|64|-|（※4）|-|-|-|
|**16**|e6|128|-|（※4）|-|-|-|
|**17**|e6|128|-|（※4）|-|-|-|
|**18**|e6|256|-|（※4）|-|-|-|
|**19**|e6|256|-|（※4）|-|-|-|
|**21**|e6|32|8|（※4）|-|8|TRUE|

※4）コア割当てパターンの番号に応じて、 **- -cpu-bind** オプションの値に以下を指定します。

[No. 3]
```sh
map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do seq -s, $i 4 $((i+12)) | tr '\n' ','; done | sed 's/,$//g'`
```

[No. 4]
```sh
map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do for j in \`seq $i 4 $((i+12))\`; do for k in \`seq 0 1\`; do echo -n $j","; done; done; done | sed 's/,$//g'`
```

[No. 5]
```sh
map_ldom:`for i in \`seq 0 1\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 6]
```sh
map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do for j in \`seq $i 4 $((i+12))\`; do for k in \`seq 0 3\`; do echo -n $j","; done; done; done | sed 's/,$//g'`
```

[No. 7]
```sh
map_ldom:`for i in \`seq 0 3\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 8]
```sh
map_cpu:`seq -s, 0 191 | tr -d '\n'`
```

[No. 9]
```sh
map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 11]
```sh
map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do seq -s, $i 4 $((i+12)) | tr '\n' ','; done | sed 's/,$//g'`
```

[No. 12]
```sh
map_cpu:`seq -s, 0 32 255 | tr -d '\n'`
```

[No. 13]
```sh
map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do seq -s, $i 4 $((i+12)) | tr '\n' ','; done | sed 's/,$//g'`
```

[No. 14]
```sh
map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do for j in \`seq $i 4 $((i+12))\`; do for k in \`seq 0 1\`; do echo -n $j","; done; done; done | sed 's/,$//g'`
```

[No. 15]
```sh
map_ldom:`for i in \`seq 0 1\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 16]
```sh
map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do for j in \`seq $i 4 $((i+12))\`; do for k in \`seq 0 3\`; do echo -n $j","; done; done; done | sed 's/,$//g'`
```

[No. 17]
```sh
map_ldom:`for i in \`seq 0 3\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 18]
```sh
map_cpu:`seq -s, 0 255 | tr -d '\n'`
```

[No. 19]
```sh
map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 21]
```sh
map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do seq -s, $i 4 $((i+12)) | tr '\n' ','; done | sed 's/,$//g'`
```


***
# 3. プロセス・スレッドのコア割当て確認方法

## 3-0. 概要

本章は、ここまで紹介したプロセス・スレッドのコア割当てが想定通りに行われているかを確認する方法を解説し、この方法を使用して各コア割当てパターンを確認した結果を紹介します。

ここで紹介する確認方法は、コア割当て対象のプログラムがフラットMPI並列かMPI/OpenMPハイブリッド並列か、コア割当てに **PRRTE** を使用するか **Slurm** を使用するかにより、以下の手法を採用します。

- フラットMPI並列
    - **PRRTE**  
    **PRRTE** の **- -report-bindings** オプションの出力から、以下の情報を取得します。
        - MPIランク
        - ノードホスト名
        - プロセスが割当てられたコア番号
    - **Slurm**  
    **Slurm** が実行時に設定する **SLURM_** 環境変数と、 **taskset** コマンドの出力から、以下の情報を取得します。
        - MPIランク
        - ノード番号
        - プロセスが割当てられたコア番号
- MPI/OpenMPハイブリッド並列
    - **PRRTE**  
    **GNUコンパイラ** が実行時に設定する **OMPI_COMM_WORLD_** 環境変数と、スレッド番号とこれが割当てられたコア番号を表示するOpenMPプログラムの出力から、以下の情報を取得します。
        - MPIランク
        - ノード番号
        - スレッド番号
        - スレッドが割当てられたコア番号
    - **Slurm**  
    **Slurm** が実行時に設定する **SLURM_** 環境変数と、スレッド番号とこれが割当てられたコア番号を表示するOpenMPプログラムの出力から、以下の情報を取得します。
        - MPIランク
        - ノード番号
        - スレッド番号
        - スレッドが割当てられたコア番号
   
MPI/OpenMPハイブリッド並列で使用する、スレッド番号とこれが割当てられたコア番号を表示するOpenMPプログラムは、以下のソースコードを使用し、

[show_thread_bind.c]

```sh
/*
$ gcc -fopenmp show_thread_bind.c -o show_thread_bind
$ ./show_thread_bind | sort -k 2n,2
Thread  0 Core  0
Thread  1 Core  1
Thread  2 Core  2
Thread  3 Core  3
Thread  4 Core  4
Thread  5 Core  5
Thread  6 Core  6
Thread  7 Core  7
Thread  8 Core  8
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/syscall.h>
#include <omp.h>
#define min(a,b) a<b?a:b
void check_core(int rank){
  char buf[0xff], buf2[4];
  FILE *fp;
  int pid, tid, ompid, count, c1, c2;
  pid = getpid();
  tid = (pid_t) syscall(SYS_gettid);
  ompid = omp_get_thread_num();
  sprintf(buf, "/proc/%d/task/%d/stat", pid, tid);
  if ((fp = fopen(buf, "r")) != NULL) {
    fgets(buf, 0xff, fp);
    fclose(fp);
    count = 0;
    c1 = c2 = 0;
    while(buf[c1]!='¥0'){
      if(buf[c1]==' ')count++;
      c1++;
      if(count==38)break;
    }
    c2 = c1;
    while(buf[c2]!='¥0'){
      if(buf[c2]==' ')break;
      c2++;
    }
    strncpy(buf2, &buf[c1], min(c2-c1, 4));
    buf2[min(c2-c1, 4)] = '¥0';
    if (atoi(buf2) > 1000) {
      printf("Thread %2d Core %3d\n", ompid, atoi(buf2)/1000000);
    }
    else {
      printf("Thread %2d Core %3d\n", ompid, atoi(buf2)/10);
    }
  }
}
int main()
{
  #pragma omp parallel
  check_core(0);
}
```

これを以下のコマンドでコンパイルして使用します。

```sh
$ gcc -fopenmp show_thread_bind.c -o show_thread_bind
```

## 3-1. コア割当て確認結果

以下では、各コア割当てパターン番号ごとの確認結果を **PRRTE** と **Slurm** に分けて記載します。

### 3-1-1. PRRTE

[No.1]

```sh
$ mpirun -n 1 --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps1:22478] Rank 0 bound to package[0][core:0]
$
```

[No.2]

```sh
$ mpirun -n 2 --bind-to core --map-by ppr:1:package --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps1:22486] Rank 0 bound to package[0][core:0]
[inst-e6-nps1:22486] Rank 1 bound to package[1][core:128]
$
```

[No.3]

```sh
$ mpirun -n 32 --bind-to core --map-by ppr:1:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps1:22492] Rank 0 bound to package[0][core:0]
[inst-e6-nps1:22492] Rank 1 bound to package[0][core:8]
[inst-e6-nps1:22492] Rank 2 bound to package[0][core:16]
[inst-e6-nps1:22492] Rank 3 bound to package[0][core:24]
[inst-e6-nps1:22492] Rank 4 bound to package[0][core:32]
[inst-e6-nps1:22492] Rank 5 bound to package[0][core:40]
[inst-e6-nps1:22492] Rank 6 bound to package[0][core:48]
[inst-e6-nps1:22492] Rank 7 bound to package[0][core:56]
[inst-e6-nps1:22492] Rank 8 bound to package[0][core:64]
[inst-e6-nps1:22492] Rank 9 bound to package[0][core:72]
[inst-e6-nps1:22492] Rank 10 bound to package[0][core:80]
[inst-e6-nps1:22492] Rank 11 bound to package[0][core:88]
[inst-e6-nps1:22492] Rank 12 bound to package[0][core:96]
[inst-e6-nps1:22492] Rank 13 bound to package[0][core:104]
[inst-e6-nps1:22492] Rank 14 bound to package[0][core:112]
[inst-e6-nps1:22492] Rank 15 bound to package[0][core:120]
[inst-e6-nps1:22492] Rank 16 bound to package[1][core:128]
[inst-e6-nps1:22492] Rank 17 bound to package[1][core:136]
[inst-e6-nps1:22492] Rank 18 bound to package[1][core:144]
[inst-e6-nps1:22492] Rank 19 bound to package[1][core:152]
[inst-e6-nps1:22492] Rank 20 bound to package[1][core:160]
[inst-e6-nps1:22492] Rank 21 bound to package[1][core:168]
[inst-e6-nps1:22492] Rank 22 bound to package[1][core:176]
[inst-e6-nps1:22492] Rank 23 bound to package[1][core:184]
[inst-e6-nps1:22492] Rank 24 bound to package[1][core:192]
[inst-e6-nps1:22492] Rank 25 bound to package[1][core:200]
[inst-e6-nps1:22492] Rank 26 bound to package[1][core:208]
[inst-e6-nps1:22492] Rank 27 bound to package[1][core:216]
[inst-e6-nps1:22492] Rank 28 bound to package[1][core:224]
[inst-e6-nps1:22492] Rank 29 bound to package[1][core:232]
[inst-e6-nps1:22492] Rank 30 bound to package[1][core:240]
[inst-e6-nps1:22492] Rank 31 bound to package[1][core:248]
$
```

[No.4]

```sh
$ mpirun -n 64 --bind-to core --map-by ppr:2:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps1:22637] Rank 0 bound to package[0][core:0]
[inst-e6-nps1:22637] Rank 1 bound to package[0][core:1]
[inst-e6-nps1:22637] Rank 2 bound to package[0][core:8]
[inst-e6-nps1:22637] Rank 3 bound to package[0][core:9]
[inst-e6-nps1:22637] Rank 4 bound to package[0][core:16]
[inst-e6-nps1:22637] Rank 5 bound to package[0][core:17]
[inst-e6-nps1:22637] Rank 6 bound to package[0][core:24]
[inst-e6-nps1:22637] Rank 7 bound to package[0][core:25]
[inst-e6-nps1:22637] Rank 8 bound to package[0][core:32]
[inst-e6-nps1:22637] Rank 9 bound to package[0][core:33]
[inst-e6-nps1:22637] Rank 10 bound to package[0][core:40]
[inst-e6-nps1:22637] Rank 11 bound to package[0][core:41]
[inst-e6-nps1:22637] Rank 12 bound to package[0][core:48]
[inst-e6-nps1:22637] Rank 13 bound to package[0][core:49]
[inst-e6-nps1:22637] Rank 14 bound to package[0][core:56]
[inst-e6-nps1:22637] Rank 15 bound to package[0][core:57]
[inst-e6-nps1:22637] Rank 16 bound to package[0][core:64]
[inst-e6-nps1:22637] Rank 17 bound to package[0][core:65]
[inst-e6-nps1:22637] Rank 18 bound to package[0][core:72]
[inst-e6-nps1:22637] Rank 19 bound to package[0][core:73]
[inst-e6-nps1:22637] Rank 20 bound to package[0][core:80]
[inst-e6-nps1:22637] Rank 21 bound to package[0][core:81]
[inst-e6-nps1:22637] Rank 22 bound to package[0][core:88]
[inst-e6-nps1:22637] Rank 23 bound to package[0][core:89]
[inst-e6-nps1:22637] Rank 24 bound to package[0][core:96]
[inst-e6-nps1:22637] Rank 25 bound to package[0][core:97]
[inst-e6-nps1:22637] Rank 26 bound to package[0][core:104]
[inst-e6-nps1:22637] Rank 27 bound to package[0][core:105]
[inst-e6-nps1:22637] Rank 28 bound to package[0][core:112]
[inst-e6-nps1:22637] Rank 29 bound to package[0][core:113]
[inst-e6-nps1:22637] Rank 30 bound to package[0][core:120]
[inst-e6-nps1:22637] Rank 31 bound to package[0][core:121]
[inst-e6-nps1:22637] Rank 32 bound to package[1][core:128]
[inst-e6-nps1:22637] Rank 33 bound to package[1][core:129]
[inst-e6-nps1:22637] Rank 34 bound to package[1][core:136]
[inst-e6-nps1:22637] Rank 35 bound to package[1][core:137]
[inst-e6-nps1:22637] Rank 36 bound to package[1][core:144]
[inst-e6-nps1:22637] Rank 37 bound to package[1][core:145]
[inst-e6-nps1:22637] Rank 38 bound to package[1][core:152]
[inst-e6-nps1:22637] Rank 39 bound to package[1][core:153]
[inst-e6-nps1:22637] Rank 40 bound to package[1][core:160]
[inst-e6-nps1:22637] Rank 41 bound to package[1][core:161]
[inst-e6-nps1:22637] Rank 42 bound to package[1][core:168]
[inst-e6-nps1:22637] Rank 43 bound to package[1][core:169]
[inst-e6-nps1:22637] Rank 44 bound to package[1][core:176]
[inst-e6-nps1:22637] Rank 45 bound to package[1][core:177]
[inst-e6-nps1:22637] Rank 46 bound to package[1][core:184]
[inst-e6-nps1:22637] Rank 47 bound to package[1][core:185]
[inst-e6-nps1:22637] Rank 48 bound to package[1][core:192]
[inst-e6-nps1:22637] Rank 49 bound to package[1][core:193]
[inst-e6-nps1:22637] Rank 50 bound to package[1][core:200]
[inst-e6-nps1:22637] Rank 51 bound to package[1][core:201]
[inst-e6-nps1:22637] Rank 52 bound to package[1][core:208]
[inst-e6-nps1:22637] Rank 53 bound to package[1][core:209]
[inst-e6-nps1:22637] Rank 54 bound to package[1][core:216]
[inst-e6-nps1:22637] Rank 55 bound to package[1][core:217]
[inst-e6-nps1:22637] Rank 56 bound to package[1][core:224]
[inst-e6-nps1:22637] Rank 57 bound to package[1][core:225]
[inst-e6-nps1:22637] Rank 58 bound to package[1][core:232]
[inst-e6-nps1:22637] Rank 59 bound to package[1][core:233]
[inst-e6-nps1:22637] Rank 60 bound to package[1][core:240]
[inst-e6-nps1:22637] Rank 61 bound to package[1][core:241]
[inst-e6-nps1:22637] Rank 62 bound to package[1][core:248]
[inst-e6-nps1:22637] Rank 63 bound to package[1][core:249]
$
```

[No.5]

```sh
$ mpirun -n 64 --bind-to core --map-by ppr:2:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps1:22801] Rank 0 bound to package[0][core:0]
[inst-e6-nps1:22801] Rank 1 bound to package[0][core:8]
[inst-e6-nps1:22801] Rank 2 bound to package[0][core:16]
[inst-e6-nps1:22801] Rank 3 bound to package[0][core:24]
[inst-e6-nps1:22801] Rank 4 bound to package[0][core:32]
[inst-e6-nps1:22801] Rank 5 bound to package[0][core:40]
[inst-e6-nps1:22801] Rank 6 bound to package[0][core:48]
[inst-e6-nps1:22801] Rank 7 bound to package[0][core:56]
[inst-e6-nps1:22801] Rank 8 bound to package[0][core:64]
[inst-e6-nps1:22801] Rank 9 bound to package[0][core:72]
[inst-e6-nps1:22801] Rank 10 bound to package[0][core:80]
[inst-e6-nps1:22801] Rank 11 bound to package[0][core:88]
[inst-e6-nps1:22801] Rank 12 bound to package[0][core:96]
[inst-e6-nps1:22801] Rank 13 bound to package[0][core:104]
[inst-e6-nps1:22801] Rank 14 bound to package[0][core:112]
[inst-e6-nps1:22801] Rank 15 bound to package[0][core:120]
[inst-e6-nps1:22801] Rank 16 bound to package[1][core:128]
[inst-e6-nps1:22801] Rank 17 bound to package[1][core:136]
[inst-e6-nps1:22801] Rank 18 bound to package[1][core:144]
[inst-e6-nps1:22801] Rank 19 bound to package[1][core:152]
[inst-e6-nps1:22801] Rank 20 bound to package[1][core:160]
[inst-e6-nps1:22801] Rank 21 bound to package[1][core:168]
[inst-e6-nps1:22801] Rank 22 bound to package[1][core:176]
[inst-e6-nps1:22801] Rank 23 bound to package[1][core:184]
[inst-e6-nps1:22801] Rank 24 bound to package[1][core:192]
[inst-e6-nps1:22801] Rank 25 bound to package[1][core:200]
[inst-e6-nps1:22801] Rank 26 bound to package[1][core:208]
[inst-e6-nps1:22801] Rank 27 bound to package[1][core:216]
[inst-e6-nps1:22801] Rank 28 bound to package[1][core:224]
[inst-e6-nps1:22801] Rank 29 bound to package[1][core:232]
[inst-e6-nps1:22801] Rank 30 bound to package[1][core:240]
[inst-e6-nps1:22801] Rank 31 bound to package[1][core:248]
[inst-e6-nps1:22801] Rank 32 bound to package[0][core:1]
[inst-e6-nps1:22801] Rank 33 bound to package[0][core:9]
[inst-e6-nps1:22801] Rank 34 bound to package[0][core:17]
[inst-e6-nps1:22801] Rank 35 bound to package[0][core:25]
[inst-e6-nps1:22801] Rank 36 bound to package[0][core:33]
[inst-e6-nps1:22801] Rank 37 bound to package[0][core:41]
[inst-e6-nps1:22801] Rank 38 bound to package[0][core:49]
[inst-e6-nps1:22801] Rank 39 bound to package[0][core:57]
[inst-e6-nps1:22801] Rank 40 bound to package[0][core:65]
[inst-e6-nps1:22801] Rank 41 bound to package[0][core:73]
[inst-e6-nps1:22801] Rank 42 bound to package[0][core:81]
[inst-e6-nps1:22801] Rank 43 bound to package[0][core:89]
[inst-e6-nps1:22801] Rank 44 bound to package[0][core:97]
[inst-e6-nps1:22801] Rank 45 bound to package[0][core:105]
[inst-e6-nps1:22801] Rank 46 bound to package[0][core:113]
[inst-e6-nps1:22801] Rank 47 bound to package[0][core:121]
[inst-e6-nps1:22801] Rank 48 bound to package[1][core:129]
[inst-e6-nps1:22801] Rank 49 bound to package[1][core:137]
[inst-e6-nps1:22801] Rank 50 bound to package[1][core:145]
[inst-e6-nps1:22801] Rank 51 bound to package[1][core:153]
[inst-e6-nps1:22801] Rank 52 bound to package[1][core:161]
[inst-e6-nps1:22801] Rank 53 bound to package[1][core:169]
[inst-e6-nps1:22801] Rank 54 bound to package[1][core:177]
[inst-e6-nps1:22801] Rank 55 bound to package[1][core:185]
[inst-e6-nps1:22801] Rank 56 bound to package[1][core:193]
[inst-e6-nps1:22801] Rank 57 bound to package[1][core:201]
[inst-e6-nps1:22801] Rank 58 bound to package[1][core:209]
[inst-e6-nps1:22801] Rank 59 bound to package[1][core:217]
[inst-e6-nps1:22801] Rank 60 bound to package[1][core:225]
[inst-e6-nps1:22801] Rank 61 bound to package[1][core:233]
[inst-e6-nps1:22801] Rank 62 bound to package[1][core:241]
[inst-e6-nps1:22801] Rank 63 bound to package[1][core:249]
$
```

[No.6]

```sh
$ mpirun -n 128 --bind-to core --map-by ppr:4:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps1:22877] Rank 0 bound to package[0][core:0]
[inst-e6-nps1:22877] Rank 1 bound to package[0][core:1]
[inst-e6-nps1:22877] Rank 2 bound to package[0][core:2]
[inst-e6-nps1:22877] Rank 3 bound to package[0][core:3]
[inst-e6-nps1:22877] Rank 4 bound to package[0][core:8]
[inst-e6-nps1:22877] Rank 5 bound to package[0][core:9]
[inst-e6-nps1:22877] Rank 6 bound to package[0][core:10]
[inst-e6-nps1:22877] Rank 7 bound to package[0][core:11]
[inst-e6-nps1:22877] Rank 8 bound to package[0][core:16]
[inst-e6-nps1:22877] Rank 9 bound to package[0][core:17]
[inst-e6-nps1:22877] Rank 10 bound to package[0][core:18]
[inst-e6-nps1:22877] Rank 11 bound to package[0][core:19]
[inst-e6-nps1:22877] Rank 12 bound to package[0][core:24]
[inst-e6-nps1:22877] Rank 13 bound to package[0][core:25]
[inst-e6-nps1:22877] Rank 14 bound to package[0][core:26]
[inst-e6-nps1:22877] Rank 15 bound to package[0][core:27]
[inst-e6-nps1:22877] Rank 16 bound to package[0][core:32]
[inst-e6-nps1:22877] Rank 17 bound to package[0][core:33]
[inst-e6-nps1:22877] Rank 18 bound to package[0][core:34]
[inst-e6-nps1:22877] Rank 19 bound to package[0][core:35]
[inst-e6-nps1:22877] Rank 20 bound to package[0][core:40]
[inst-e6-nps1:22877] Rank 21 bound to package[0][core:41]
[inst-e6-nps1:22877] Rank 22 bound to package[0][core:42]
[inst-e6-nps1:22877] Rank 23 bound to package[0][core:43]
[inst-e6-nps1:22877] Rank 24 bound to package[0][core:48]
[inst-e6-nps1:22877] Rank 25 bound to package[0][core:49]
[inst-e6-nps1:22877] Rank 26 bound to package[0][core:50]
[inst-e6-nps1:22877] Rank 27 bound to package[0][core:51]
[inst-e6-nps1:22877] Rank 28 bound to package[0][core:56]
[inst-e6-nps1:22877] Rank 29 bound to package[0][core:57]
[inst-e6-nps1:22877] Rank 30 bound to package[0][core:58]
[inst-e6-nps1:22877] Rank 31 bound to package[0][core:59]
[inst-e6-nps1:22877] Rank 32 bound to package[0][core:64]
[inst-e6-nps1:22877] Rank 33 bound to package[0][core:65]
[inst-e6-nps1:22877] Rank 34 bound to package[0][core:66]
[inst-e6-nps1:22877] Rank 35 bound to package[0][core:67]
[inst-e6-nps1:22877] Rank 36 bound to package[0][core:72]
[inst-e6-nps1:22877] Rank 37 bound to package[0][core:73]
[inst-e6-nps1:22877] Rank 38 bound to package[0][core:74]
[inst-e6-nps1:22877] Rank 39 bound to package[0][core:75]
[inst-e6-nps1:22877] Rank 40 bound to package[0][core:80]
[inst-e6-nps1:22877] Rank 41 bound to package[0][core:81]
[inst-e6-nps1:22877] Rank 42 bound to package[0][core:82]
[inst-e6-nps1:22877] Rank 43 bound to package[0][core:83]
[inst-e6-nps1:22877] Rank 44 bound to package[0][core:88]
[inst-e6-nps1:22877] Rank 45 bound to package[0][core:89]
[inst-e6-nps1:22877] Rank 46 bound to package[0][core:90]
[inst-e6-nps1:22877] Rank 47 bound to package[0][core:91]
[inst-e6-nps1:22877] Rank 48 bound to package[0][core:96]
[inst-e6-nps1:22877] Rank 49 bound to package[0][core:97]
[inst-e6-nps1:22877] Rank 50 bound to package[0][core:98]
[inst-e6-nps1:22877] Rank 51 bound to package[0][core:99]
[inst-e6-nps1:22877] Rank 52 bound to package[0][core:104]
[inst-e6-nps1:22877] Rank 53 bound to package[0][core:105]
[inst-e6-nps1:22877] Rank 54 bound to package[0][core:106]
[inst-e6-nps1:22877] Rank 55 bound to package[0][core:107]
[inst-e6-nps1:22877] Rank 56 bound to package[0][core:112]
[inst-e6-nps1:22877] Rank 57 bound to package[0][core:113]
[inst-e6-nps1:22877] Rank 58 bound to package[0][core:114]
[inst-e6-nps1:22877] Rank 59 bound to package[0][core:115]
[inst-e6-nps1:22877] Rank 60 bound to package[0][core:120]
[inst-e6-nps1:22877] Rank 61 bound to package[0][core:121]
[inst-e6-nps1:22877] Rank 62 bound to package[0][core:122]
[inst-e6-nps1:22877] Rank 63 bound to package[0][core:123]
[inst-e6-nps1:22877] Rank 64 bound to package[1][core:128]
[inst-e6-nps1:22877] Rank 65 bound to package[1][core:129]
[inst-e6-nps1:22877] Rank 66 bound to package[1][core:130]
[inst-e6-nps1:22877] Rank 67 bound to package[1][core:131]
[inst-e6-nps1:22877] Rank 68 bound to package[1][core:136]
[inst-e6-nps1:22877] Rank 69 bound to package[1][core:137]
[inst-e6-nps1:22877] Rank 70 bound to package[1][core:138]
[inst-e6-nps1:22877] Rank 71 bound to package[1][core:139]
[inst-e6-nps1:22877] Rank 72 bound to package[1][core:144]
[inst-e6-nps1:22877] Rank 73 bound to package[1][core:145]
[inst-e6-nps1:22877] Rank 74 bound to package[1][core:146]
[inst-e6-nps1:22877] Rank 75 bound to package[1][core:147]
[inst-e6-nps1:22877] Rank 76 bound to package[1][core:152]
[inst-e6-nps1:22877] Rank 77 bound to package[1][core:153]
[inst-e6-nps1:22877] Rank 78 bound to package[1][core:154]
[inst-e6-nps1:22877] Rank 79 bound to package[1][core:155]
[inst-e6-nps1:22877] Rank 80 bound to package[1][core:160]
[inst-e6-nps1:22877] Rank 81 bound to package[1][core:161]
[inst-e6-nps1:22877] Rank 82 bound to package[1][core:162]
[inst-e6-nps1:22877] Rank 83 bound to package[1][core:163]
[inst-e6-nps1:22877] Rank 84 bound to package[1][core:168]
[inst-e6-nps1:22877] Rank 85 bound to package[1][core:169]
[inst-e6-nps1:22877] Rank 86 bound to package[1][core:170]
[inst-e6-nps1:22877] Rank 87 bound to package[1][core:171]
[inst-e6-nps1:22877] Rank 88 bound to package[1][core:176]
[inst-e6-nps1:22877] Rank 89 bound to package[1][core:177]
[inst-e6-nps1:22877] Rank 90 bound to package[1][core:178]
[inst-e6-nps1:22877] Rank 91 bound to package[1][core:179]
[inst-e6-nps1:22877] Rank 92 bound to package[1][core:184]
[inst-e6-nps1:22877] Rank 93 bound to package[1][core:185]
[inst-e6-nps1:22877] Rank 94 bound to package[1][core:186]
[inst-e6-nps1:22877] Rank 95 bound to package[1][core:187]
[inst-e6-nps1:22877] Rank 96 bound to package[1][core:192]
[inst-e6-nps1:22877] Rank 97 bound to package[1][core:193]
[inst-e6-nps1:22877] Rank 98 bound to package[1][core:194]
[inst-e6-nps1:22877] Rank 99 bound to package[1][core:195]
[inst-e6-nps1:22877] Rank 100 bound to package[1][core:200]
[inst-e6-nps1:22877] Rank 101 bound to package[1][core:201]
[inst-e6-nps1:22877] Rank 102 bound to package[1][core:202]
[inst-e6-nps1:22877] Rank 103 bound to package[1][core:203]
[inst-e6-nps1:22877] Rank 104 bound to package[1][core:208]
[inst-e6-nps1:22877] Rank 105 bound to package[1][core:209]
[inst-e6-nps1:22877] Rank 106 bound to package[1][core:210]
[inst-e6-nps1:22877] Rank 107 bound to package[1][core:211]
[inst-e6-nps1:22877] Rank 108 bound to package[1][core:216]
[inst-e6-nps1:22877] Rank 109 bound to package[1][core:217]
[inst-e6-nps1:22877] Rank 110 bound to package[1][core:218]
[inst-e6-nps1:22877] Rank 111 bound to package[1][core:219]
[inst-e6-nps1:22877] Rank 112 bound to package[1][core:224]
[inst-e6-nps1:22877] Rank 113 bound to package[1][core:225]
[inst-e6-nps1:22877] Rank 114 bound to package[1][core:226]
[inst-e6-nps1:22877] Rank 115 bound to package[1][core:227]
[inst-e6-nps1:22877] Rank 116 bound to package[1][core:232]
[inst-e6-nps1:22877] Rank 117 bound to package[1][core:233]
[inst-e6-nps1:22877] Rank 118 bound to package[1][core:234]
[inst-e6-nps1:22877] Rank 119 bound to package[1][core:235]
[inst-e6-nps1:22877] Rank 120 bound to package[1][core:240]
[inst-e6-nps1:22877] Rank 121 bound to package[1][core:241]
[inst-e6-nps1:22877] Rank 122 bound to package[1][core:242]
[inst-e6-nps1:22877] Rank 123 bound to package[1][core:243]
[inst-e6-nps1:22877] Rank 124 bound to package[1][core:248]
[inst-e6-nps1:22877] Rank 125 bound to package[1][core:249]
[inst-e6-nps1:22877] Rank 126 bound to package[1][core:250]
[inst-e6-nps1:22877] Rank 127 bound to package[1][core:251]
$
```

[No.7]

```sh
$ mpirun -n 128 --bind-to core --map-by ppr:4:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps1:23036] Rank 0 bound to package[0][core:0]
[inst-e6-nps1:23036] Rank 1 bound to package[0][core:8]
[inst-e6-nps1:23036] Rank 2 bound to package[0][core:16]
[inst-e6-nps1:23036] Rank 3 bound to package[0][core:24]
[inst-e6-nps1:23036] Rank 4 bound to package[0][core:32]
[inst-e6-nps1:23036] Rank 5 bound to package[0][core:40]
[inst-e6-nps1:23036] Rank 6 bound to package[0][core:48]
[inst-e6-nps1:23036] Rank 7 bound to package[0][core:56]
[inst-e6-nps1:23036] Rank 8 bound to package[0][core:64]
[inst-e6-nps1:23036] Rank 9 bound to package[0][core:72]
[inst-e6-nps1:23036] Rank 10 bound to package[0][core:80]
[inst-e6-nps1:23036] Rank 11 bound to package[0][core:88]
[inst-e6-nps1:23036] Rank 12 bound to package[0][core:96]
[inst-e6-nps1:23036] Rank 13 bound to package[0][core:104]
[inst-e6-nps1:23036] Rank 14 bound to package[0][core:112]
[inst-e6-nps1:23036] Rank 15 bound to package[0][core:120]
[inst-e6-nps1:23036] Rank 16 bound to package[1][core:128]
[inst-e6-nps1:23036] Rank 17 bound to package[1][core:136]
[inst-e6-nps1:23036] Rank 18 bound to package[1][core:144]
[inst-e6-nps1:23036] Rank 19 bound to package[1][core:152]
[inst-e6-nps1:23036] Rank 20 bound to package[1][core:160]
[inst-e6-nps1:23036] Rank 21 bound to package[1][core:168]
[inst-e6-nps1:23036] Rank 22 bound to package[1][core:176]
[inst-e6-nps1:23036] Rank 23 bound to package[1][core:184]
[inst-e6-nps1:23036] Rank 24 bound to package[1][core:192]
[inst-e6-nps1:23036] Rank 25 bound to package[1][core:200]
[inst-e6-nps1:23036] Rank 26 bound to package[1][core:208]
[inst-e6-nps1:23036] Rank 27 bound to package[1][core:216]
[inst-e6-nps1:23036] Rank 28 bound to package[1][core:224]
[inst-e6-nps1:23036] Rank 29 bound to package[1][core:232]
[inst-e6-nps1:23036] Rank 30 bound to package[1][core:240]
[inst-e6-nps1:23036] Rank 31 bound to package[1][core:248]
[inst-e6-nps1:23036] Rank 32 bound to package[0][core:1]
[inst-e6-nps1:23036] Rank 33 bound to package[0][core:9]
[inst-e6-nps1:23036] Rank 34 bound to package[0][core:17]
[inst-e6-nps1:23036] Rank 35 bound to package[0][core:25]
[inst-e6-nps1:23036] Rank 36 bound to package[0][core:33]
[inst-e6-nps1:23036] Rank 37 bound to package[0][core:41]
[inst-e6-nps1:23036] Rank 38 bound to package[0][core:49]
[inst-e6-nps1:23036] Rank 39 bound to package[0][core:57]
[inst-e6-nps1:23036] Rank 40 bound to package[0][core:65]
[inst-e6-nps1:23036] Rank 41 bound to package[0][core:73]
[inst-e6-nps1:23036] Rank 42 bound to package[0][core:81]
[inst-e6-nps1:23036] Rank 43 bound to package[0][core:89]
[inst-e6-nps1:23036] Rank 44 bound to package[0][core:97]
[inst-e6-nps1:23036] Rank 45 bound to package[0][core:105]
[inst-e6-nps1:23036] Rank 46 bound to package[0][core:113]
[inst-e6-nps1:23036] Rank 47 bound to package[0][core:121]
[inst-e6-nps1:23036] Rank 48 bound to package[1][core:129]
[inst-e6-nps1:23036] Rank 49 bound to package[1][core:137]
[inst-e6-nps1:23036] Rank 50 bound to package[1][core:145]
[inst-e6-nps1:23036] Rank 51 bound to package[1][core:153]
[inst-e6-nps1:23036] Rank 52 bound to package[1][core:161]
[inst-e6-nps1:23036] Rank 53 bound to package[1][core:169]
[inst-e6-nps1:23036] Rank 54 bound to package[1][core:177]
[inst-e6-nps1:23036] Rank 55 bound to package[1][core:185]
[inst-e6-nps1:23036] Rank 56 bound to package[1][core:193]
[inst-e6-nps1:23036] Rank 57 bound to package[1][core:201]
[inst-e6-nps1:23036] Rank 58 bound to package[1][core:209]
[inst-e6-nps1:23036] Rank 59 bound to package[1][core:217]
[inst-e6-nps1:23036] Rank 60 bound to package[1][core:225]
[inst-e6-nps1:23036] Rank 61 bound to package[1][core:233]
[inst-e6-nps1:23036] Rank 62 bound to package[1][core:241]
[inst-e6-nps1:23036] Rank 63 bound to package[1][core:249]
[inst-e6-nps1:23036] Rank 64 bound to package[0][core:2]
[inst-e6-nps1:23036] Rank 65 bound to package[0][core:10]
[inst-e6-nps1:23036] Rank 66 bound to package[0][core:18]
[inst-e6-nps1:23036] Rank 67 bound to package[0][core:26]
[inst-e6-nps1:23036] Rank 68 bound to package[0][core:34]
[inst-e6-nps1:23036] Rank 69 bound to package[0][core:42]
[inst-e6-nps1:23036] Rank 70 bound to package[0][core:50]
[inst-e6-nps1:23036] Rank 71 bound to package[0][core:58]
[inst-e6-nps1:23036] Rank 72 bound to package[0][core:66]
[inst-e6-nps1:23036] Rank 73 bound to package[0][core:74]
[inst-e6-nps1:23036] Rank 74 bound to package[0][core:82]
[inst-e6-nps1:23036] Rank 75 bound to package[0][core:90]
[inst-e6-nps1:23036] Rank 76 bound to package[0][core:98]
[inst-e6-nps1:23036] Rank 77 bound to package[0][core:106]
[inst-e6-nps1:23036] Rank 78 bound to package[0][core:114]
[inst-e6-nps1:23036] Rank 79 bound to package[0][core:122]
[inst-e6-nps1:23036] Rank 80 bound to package[1][core:130]
[inst-e6-nps1:23036] Rank 81 bound to package[1][core:138]
[inst-e6-nps1:23036] Rank 82 bound to package[1][core:146]
[inst-e6-nps1:23036] Rank 83 bound to package[1][core:154]
[inst-e6-nps1:23036] Rank 84 bound to package[1][core:162]
[inst-e6-nps1:23036] Rank 85 bound to package[1][core:170]
[inst-e6-nps1:23036] Rank 86 bound to package[1][core:178]
[inst-e6-nps1:23036] Rank 87 bound to package[1][core:186]
[inst-e6-nps1:23036] Rank 88 bound to package[1][core:194]
[inst-e6-nps1:23036] Rank 89 bound to package[1][core:202]
[inst-e6-nps1:23036] Rank 90 bound to package[1][core:210]
[inst-e6-nps1:23036] Rank 91 bound to package[1][core:218]
[inst-e6-nps1:23036] Rank 92 bound to package[1][core:226]
[inst-e6-nps1:23036] Rank 93 bound to package[1][core:234]
[inst-e6-nps1:23036] Rank 94 bound to package[1][core:242]
[inst-e6-nps1:23036] Rank 95 bound to package[1][core:250]
[inst-e6-nps1:23036] Rank 96 bound to package[0][core:3]
[inst-e6-nps1:23036] Rank 97 bound to package[0][core:11]
[inst-e6-nps1:23036] Rank 98 bound to package[0][core:19]
[inst-e6-nps1:23036] Rank 99 bound to package[0][core:27]
[inst-e6-nps1:23036] Rank 100 bound to package[0][core:35]
[inst-e6-nps1:23036] Rank 101 bound to package[0][core:43]
[inst-e6-nps1:23036] Rank 102 bound to package[0][core:51]
[inst-e6-nps1:23036] Rank 103 bound to package[0][core:59]
[inst-e6-nps1:23036] Rank 104 bound to package[0][core:67]
[inst-e6-nps1:23036] Rank 105 bound to package[0][core:75]
[inst-e6-nps1:23036] Rank 106 bound to package[0][core:83]
[inst-e6-nps1:23036] Rank 107 bound to package[0][core:91]
[inst-e6-nps1:23036] Rank 108 bound to package[0][core:99]
[inst-e6-nps1:23036] Rank 109 bound to package[0][core:107]
[inst-e6-nps1:23036] Rank 110 bound to package[0][core:115]
[inst-e6-nps1:23036] Rank 111 bound to package[0][core:123]
[inst-e6-nps1:23036] Rank 112 bound to package[1][core:131]
[inst-e6-nps1:23036] Rank 113 bound to package[1][core:139]
[inst-e6-nps1:23036] Rank 114 bound to package[1][core:147]
[inst-e6-nps1:23036] Rank 115 bound to package[1][core:155]
[inst-e6-nps1:23036] Rank 116 bound to package[1][core:163]
[inst-e6-nps1:23036] Rank 117 bound to package[1][core:171]
[inst-e6-nps1:23036] Rank 118 bound to package[1][core:179]
[inst-e6-nps1:23036] Rank 119 bound to package[1][core:187]
[inst-e6-nps1:23036] Rank 120 bound to package[1][core:195]
[inst-e6-nps1:23036] Rank 121 bound to package[1][core:203]
[inst-e6-nps1:23036] Rank 122 bound to package[1][core:211]
[inst-e6-nps1:23036] Rank 123 bound to package[1][core:219]
[inst-e6-nps1:23036] Rank 124 bound to package[1][core:227]
[inst-e6-nps1:23036] Rank 125 bound to package[1][core:235]
[inst-e6-nps1:23036] Rank 126 bound to package[1][core:243]
[inst-e6-nps1:23036] Rank 127 bound to package[1][core:251]
$
```

[No.8]

```sh
$ mpirun -n 256 --bind-to core --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps1:23187] Rank 0 bound to package[0][core:0]
[inst-e6-nps1:23187] Rank 1 bound to package[0][core:1]
[inst-e6-nps1:23187] Rank 2 bound to package[0][core:2]
[inst-e6-nps1:23187] Rank 3 bound to package[0][core:3]
[inst-e6-nps1:23187] Rank 4 bound to package[0][core:4]
[inst-e6-nps1:23187] Rank 5 bound to package[0][core:5]
[inst-e6-nps1:23187] Rank 6 bound to package[0][core:6]
[inst-e6-nps1:23187] Rank 7 bound to package[0][core:7]
[inst-e6-nps1:23187] Rank 8 bound to package[0][core:8]
[inst-e6-nps1:23187] Rank 9 bound to package[0][core:9]
[inst-e6-nps1:23187] Rank 10 bound to package[0][core:10]
[inst-e6-nps1:23187] Rank 11 bound to package[0][core:11]
[inst-e6-nps1:23187] Rank 12 bound to package[0][core:12]
[inst-e6-nps1:23187] Rank 13 bound to package[0][core:13]
[inst-e6-nps1:23187] Rank 14 bound to package[0][core:14]
[inst-e6-nps1:23187] Rank 15 bound to package[0][core:15]
[inst-e6-nps1:23187] Rank 16 bound to package[0][core:16]
[inst-e6-nps1:23187] Rank 17 bound to package[0][core:17]
[inst-e6-nps1:23187] Rank 18 bound to package[0][core:18]
[inst-e6-nps1:23187] Rank 19 bound to package[0][core:19]
[inst-e6-nps1:23187] Rank 20 bound to package[0][core:20]
[inst-e6-nps1:23187] Rank 21 bound to package[0][core:21]
[inst-e6-nps1:23187] Rank 22 bound to package[0][core:22]
[inst-e6-nps1:23187] Rank 23 bound to package[0][core:23]
[inst-e6-nps1:23187] Rank 24 bound to package[0][core:24]
[inst-e6-nps1:23187] Rank 25 bound to package[0][core:25]
[inst-e6-nps1:23187] Rank 26 bound to package[0][core:26]
[inst-e6-nps1:23187] Rank 27 bound to package[0][core:27]
[inst-e6-nps1:23187] Rank 28 bound to package[0][core:28]
[inst-e6-nps1:23187] Rank 29 bound to package[0][core:29]
[inst-e6-nps1:23187] Rank 30 bound to package[0][core:30]
[inst-e6-nps1:23187] Rank 31 bound to package[0][core:31]
[inst-e6-nps1:23187] Rank 32 bound to package[0][core:32]
[inst-e6-nps1:23187] Rank 33 bound to package[0][core:33]
[inst-e6-nps1:23187] Rank 34 bound to package[0][core:34]
[inst-e6-nps1:23187] Rank 35 bound to package[0][core:35]
[inst-e6-nps1:23187] Rank 36 bound to package[0][core:36]
[inst-e6-nps1:23187] Rank 37 bound to package[0][core:37]
[inst-e6-nps1:23187] Rank 38 bound to package[0][core:38]
[inst-e6-nps1:23187] Rank 39 bound to package[0][core:39]
[inst-e6-nps1:23187] Rank 40 bound to package[0][core:40]
[inst-e6-nps1:23187] Rank 41 bound to package[0][core:41]
[inst-e6-nps1:23187] Rank 42 bound to package[0][core:42]
[inst-e6-nps1:23187] Rank 43 bound to package[0][core:43]
[inst-e6-nps1:23187] Rank 44 bound to package[0][core:44]
[inst-e6-nps1:23187] Rank 45 bound to package[0][core:45]
[inst-e6-nps1:23187] Rank 46 bound to package[0][core:46]
[inst-e6-nps1:23187] Rank 47 bound to package[0][core:47]
[inst-e6-nps1:23187] Rank 48 bound to package[0][core:48]
[inst-e6-nps1:23187] Rank 49 bound to package[0][core:49]
[inst-e6-nps1:23187] Rank 50 bound to package[0][core:50]
[inst-e6-nps1:23187] Rank 51 bound to package[0][core:51]
[inst-e6-nps1:23187] Rank 52 bound to package[0][core:52]
[inst-e6-nps1:23187] Rank 53 bound to package[0][core:53]
[inst-e6-nps1:23187] Rank 54 bound to package[0][core:54]
[inst-e6-nps1:23187] Rank 55 bound to package[0][core:55]
[inst-e6-nps1:23187] Rank 56 bound to package[0][core:56]
[inst-e6-nps1:23187] Rank 57 bound to package[0][core:57]
[inst-e6-nps1:23187] Rank 58 bound to package[0][core:58]
[inst-e6-nps1:23187] Rank 59 bound to package[0][core:59]
[inst-e6-nps1:23187] Rank 60 bound to package[0][core:60]
[inst-e6-nps1:23187] Rank 61 bound to package[0][core:61]
[inst-e6-nps1:23187] Rank 62 bound to package[0][core:62]
[inst-e6-nps1:23187] Rank 63 bound to package[0][core:63]
[inst-e6-nps1:23187] Rank 64 bound to package[0][core:64]
[inst-e6-nps1:23187] Rank 65 bound to package[0][core:65]
[inst-e6-nps1:23187] Rank 66 bound to package[0][core:66]
[inst-e6-nps1:23187] Rank 67 bound to package[0][core:67]
[inst-e6-nps1:23187] Rank 68 bound to package[0][core:68]
[inst-e6-nps1:23187] Rank 69 bound to package[0][core:69]
[inst-e6-nps1:23187] Rank 70 bound to package[0][core:70]
[inst-e6-nps1:23187] Rank 71 bound to package[0][core:71]
[inst-e6-nps1:23187] Rank 72 bound to package[0][core:72]
[inst-e6-nps1:23187] Rank 73 bound to package[0][core:73]
[inst-e6-nps1:23187] Rank 74 bound to package[0][core:74]
[inst-e6-nps1:23187] Rank 75 bound to package[0][core:75]
[inst-e6-nps1:23187] Rank 76 bound to package[0][core:76]
[inst-e6-nps1:23187] Rank 77 bound to package[0][core:77]
[inst-e6-nps1:23187] Rank 78 bound to package[0][core:78]
[inst-e6-nps1:23187] Rank 79 bound to package[0][core:79]
[inst-e6-nps1:23187] Rank 80 bound to package[0][core:80]
[inst-e6-nps1:23187] Rank 81 bound to package[0][core:81]
[inst-e6-nps1:23187] Rank 82 bound to package[0][core:82]
[inst-e6-nps1:23187] Rank 83 bound to package[0][core:83]
[inst-e6-nps1:23187] Rank 84 bound to package[0][core:84]
[inst-e6-nps1:23187] Rank 85 bound to package[0][core:85]
[inst-e6-nps1:23187] Rank 86 bound to package[0][core:86]
[inst-e6-nps1:23187] Rank 87 bound to package[0][core:87]
[inst-e6-nps1:23187] Rank 88 bound to package[0][core:88]
[inst-e6-nps1:23187] Rank 89 bound to package[0][core:89]
[inst-e6-nps1:23187] Rank 90 bound to package[0][core:90]
[inst-e6-nps1:23187] Rank 91 bound to package[0][core:91]
[inst-e6-nps1:23187] Rank 92 bound to package[0][core:92]
[inst-e6-nps1:23187] Rank 93 bound to package[0][core:93]
[inst-e6-nps1:23187] Rank 94 bound to package[0][core:94]
[inst-e6-nps1:23187] Rank 95 bound to package[0][core:95]
[inst-e6-nps1:23187] Rank 96 bound to package[0][core:96]
[inst-e6-nps1:23187] Rank 97 bound to package[0][core:97]
[inst-e6-nps1:23187] Rank 98 bound to package[0][core:98]
[inst-e6-nps1:23187] Rank 99 bound to package[0][core:99]
[inst-e6-nps1:23187] Rank 100 bound to package[0][core:100]
[inst-e6-nps1:23187] Rank 101 bound to package[0][core:101]
[inst-e6-nps1:23187] Rank 102 bound to package[0][core:102]
[inst-e6-nps1:23187] Rank 103 bound to package[0][core:103]
[inst-e6-nps1:23187] Rank 104 bound to package[0][core:104]
[inst-e6-nps1:23187] Rank 105 bound to package[0][core:105]
[inst-e6-nps1:23187] Rank 106 bound to package[0][core:106]
[inst-e6-nps1:23187] Rank 107 bound to package[0][core:107]
[inst-e6-nps1:23187] Rank 108 bound to package[0][core:108]
[inst-e6-nps1:23187] Rank 109 bound to package[0][core:109]
[inst-e6-nps1:23187] Rank 110 bound to package[0][core:110]
[inst-e6-nps1:23187] Rank 111 bound to package[0][core:111]
[inst-e6-nps1:23187] Rank 112 bound to package[0][core:112]
[inst-e6-nps1:23187] Rank 113 bound to package[0][core:113]
[inst-e6-nps1:23187] Rank 114 bound to package[0][core:114]
[inst-e6-nps1:23187] Rank 115 bound to package[0][core:115]
[inst-e6-nps1:23187] Rank 116 bound to package[0][core:116]
[inst-e6-nps1:23187] Rank 117 bound to package[0][core:117]
[inst-e6-nps1:23187] Rank 118 bound to package[0][core:118]
[inst-e6-nps1:23187] Rank 119 bound to package[0][core:119]
[inst-e6-nps1:23187] Rank 120 bound to package[0][core:120]
[inst-e6-nps1:23187] Rank 121 bound to package[0][core:121]
[inst-e6-nps1:23187] Rank 122 bound to package[0][core:122]
[inst-e6-nps1:23187] Rank 123 bound to package[0][core:123]
[inst-e6-nps1:23187] Rank 124 bound to package[0][core:124]
[inst-e6-nps1:23187] Rank 125 bound to package[0][core:125]
[inst-e6-nps1:23187] Rank 126 bound to package[0][core:126]
[inst-e6-nps1:23187] Rank 127 bound to package[0][core:127]
[inst-e6-nps1:23187] Rank 128 bound to package[1][core:128]
[inst-e6-nps1:23187] Rank 129 bound to package[1][core:129]
[inst-e6-nps1:23187] Rank 130 bound to package[1][core:130]
[inst-e6-nps1:23187] Rank 131 bound to package[1][core:131]
[inst-e6-nps1:23187] Rank 132 bound to package[1][core:132]
[inst-e6-nps1:23187] Rank 133 bound to package[1][core:133]
[inst-e6-nps1:23187] Rank 134 bound to package[1][core:134]
[inst-e6-nps1:23187] Rank 135 bound to package[1][core:135]
[inst-e6-nps1:23187] Rank 136 bound to package[1][core:136]
[inst-e6-nps1:23187] Rank 137 bound to package[1][core:137]
[inst-e6-nps1:23187] Rank 138 bound to package[1][core:138]
[inst-e6-nps1:23187] Rank 139 bound to package[1][core:139]
[inst-e6-nps1:23187] Rank 140 bound to package[1][core:140]
[inst-e6-nps1:23187] Rank 141 bound to package[1][core:141]
[inst-e6-nps1:23187] Rank 142 bound to package[1][core:142]
[inst-e6-nps1:23187] Rank 143 bound to package[1][core:143]
[inst-e6-nps1:23187] Rank 144 bound to package[1][core:144]
[inst-e6-nps1:23187] Rank 145 bound to package[1][core:145]
[inst-e6-nps1:23187] Rank 146 bound to package[1][core:146]
[inst-e6-nps1:23187] Rank 147 bound to package[1][core:147]
[inst-e6-nps1:23187] Rank 148 bound to package[1][core:148]
[inst-e6-nps1:23187] Rank 149 bound to package[1][core:149]
[inst-e6-nps1:23187] Rank 150 bound to package[1][core:150]
[inst-e6-nps1:23187] Rank 151 bound to package[1][core:151]
[inst-e6-nps1:23187] Rank 152 bound to package[1][core:152]
[inst-e6-nps1:23187] Rank 153 bound to package[1][core:153]
[inst-e6-nps1:23187] Rank 154 bound to package[1][core:154]
[inst-e6-nps1:23187] Rank 155 bound to package[1][core:155]
[inst-e6-nps1:23187] Rank 156 bound to package[1][core:156]
[inst-e6-nps1:23187] Rank 157 bound to package[1][core:157]
[inst-e6-nps1:23187] Rank 158 bound to package[1][core:158]
[inst-e6-nps1:23187] Rank 159 bound to package[1][core:159]
[inst-e6-nps1:23187] Rank 160 bound to package[1][core:160]
[inst-e6-nps1:23187] Rank 161 bound to package[1][core:161]
[inst-e6-nps1:23187] Rank 162 bound to package[1][core:162]
[inst-e6-nps1:23187] Rank 163 bound to package[1][core:163]
[inst-e6-nps1:23187] Rank 164 bound to package[1][core:164]
[inst-e6-nps1:23187] Rank 165 bound to package[1][core:165]
[inst-e6-nps1:23187] Rank 166 bound to package[1][core:166]
[inst-e6-nps1:23187] Rank 167 bound to package[1][core:167]
[inst-e6-nps1:23187] Rank 168 bound to package[1][core:168]
[inst-e6-nps1:23187] Rank 169 bound to package[1][core:169]
[inst-e6-nps1:23187] Rank 170 bound to package[1][core:170]
[inst-e6-nps1:23187] Rank 171 bound to package[1][core:171]
[inst-e6-nps1:23187] Rank 172 bound to package[1][core:172]
[inst-e6-nps1:23187] Rank 173 bound to package[1][core:173]
[inst-e6-nps1:23187] Rank 174 bound to package[1][core:174]
[inst-e6-nps1:23187] Rank 175 bound to package[1][core:175]
[inst-e6-nps1:23187] Rank 176 bound to package[1][core:176]
[inst-e6-nps1:23187] Rank 177 bound to package[1][core:177]
[inst-e6-nps1:23187] Rank 178 bound to package[1][core:178]
[inst-e6-nps1:23187] Rank 179 bound to package[1][core:179]
[inst-e6-nps1:23187] Rank 180 bound to package[1][core:180]
[inst-e6-nps1:23187] Rank 181 bound to package[1][core:181]
[inst-e6-nps1:23187] Rank 182 bound to package[1][core:182]
[inst-e6-nps1:23187] Rank 183 bound to package[1][core:183]
[inst-e6-nps1:23187] Rank 184 bound to package[1][core:184]
[inst-e6-nps1:23187] Rank 185 bound to package[1][core:185]
[inst-e6-nps1:23187] Rank 186 bound to package[1][core:186]
[inst-e6-nps1:23187] Rank 187 bound to package[1][core:187]
[inst-e6-nps1:23187] Rank 188 bound to package[1][core:188]
[inst-e6-nps1:23187] Rank 189 bound to package[1][core:189]
[inst-e6-nps1:23187] Rank 190 bound to package[1][core:190]
[inst-e6-nps1:23187] Rank 191 bound to package[1][core:191]
[inst-e6-nps1:23187] Rank 192 bound to package[1][core:192]
[inst-e6-nps1:23187] Rank 193 bound to package[1][core:193]
[inst-e6-nps1:23187] Rank 194 bound to package[1][core:194]
[inst-e6-nps1:23187] Rank 195 bound to package[1][core:195]
[inst-e6-nps1:23187] Rank 196 bound to package[1][core:196]
[inst-e6-nps1:23187] Rank 197 bound to package[1][core:197]
[inst-e6-nps1:23187] Rank 198 bound to package[1][core:198]
[inst-e6-nps1:23187] Rank 199 bound to package[1][core:199]
[inst-e6-nps1:23187] Rank 200 bound to package[1][core:200]
[inst-e6-nps1:23187] Rank 201 bound to package[1][core:201]
[inst-e6-nps1:23187] Rank 202 bound to package[1][core:202]
[inst-e6-nps1:23187] Rank 203 bound to package[1][core:203]
[inst-e6-nps1:23187] Rank 204 bound to package[1][core:204]
[inst-e6-nps1:23187] Rank 205 bound to package[1][core:205]
[inst-e6-nps1:23187] Rank 206 bound to package[1][core:206]
[inst-e6-nps1:23187] Rank 207 bound to package[1][core:207]
[inst-e6-nps1:23187] Rank 208 bound to package[1][core:208]
[inst-e6-nps1:23187] Rank 209 bound to package[1][core:209]
[inst-e6-nps1:23187] Rank 210 bound to package[1][core:210]
[inst-e6-nps1:23187] Rank 211 bound to package[1][core:211]
[inst-e6-nps1:23187] Rank 212 bound to package[1][core:212]
[inst-e6-nps1:23187] Rank 213 bound to package[1][core:213]
[inst-e6-nps1:23187] Rank 214 bound to package[1][core:214]
[inst-e6-nps1:23187] Rank 215 bound to package[1][core:215]
[inst-e6-nps1:23187] Rank 216 bound to package[1][core:216]
[inst-e6-nps1:23187] Rank 217 bound to package[1][core:217]
[inst-e6-nps1:23187] Rank 218 bound to package[1][core:218]
[inst-e6-nps1:23187] Rank 219 bound to package[1][core:219]
[inst-e6-nps1:23187] Rank 220 bound to package[1][core:220]
[inst-e6-nps1:23187] Rank 221 bound to package[1][core:221]
[inst-e6-nps1:23187] Rank 222 bound to package[1][core:222]
[inst-e6-nps1:23187] Rank 223 bound to package[1][core:223]
[inst-e6-nps1:23187] Rank 224 bound to package[1][core:224]
[inst-e6-nps1:23187] Rank 225 bound to package[1][core:225]
[inst-e6-nps1:23187] Rank 226 bound to package[1][core:226]
[inst-e6-nps1:23187] Rank 227 bound to package[1][core:227]
[inst-e6-nps1:23187] Rank 228 bound to package[1][core:228]
[inst-e6-nps1:23187] Rank 229 bound to package[1][core:229]
[inst-e6-nps1:23187] Rank 230 bound to package[1][core:230]
[inst-e6-nps1:23187] Rank 231 bound to package[1][core:231]
[inst-e6-nps1:23187] Rank 232 bound to package[1][core:232]
[inst-e6-nps1:23187] Rank 233 bound to package[1][core:233]
[inst-e6-nps1:23187] Rank 234 bound to package[1][core:234]
[inst-e6-nps1:23187] Rank 235 bound to package[1][core:235]
[inst-e6-nps1:23187] Rank 236 bound to package[1][core:236]
[inst-e6-nps1:23187] Rank 237 bound to package[1][core:237]
[inst-e6-nps1:23187] Rank 238 bound to package[1][core:238]
[inst-e6-nps1:23187] Rank 239 bound to package[1][core:239]
[inst-e6-nps1:23187] Rank 240 bound to package[1][core:240]
[inst-e6-nps1:23187] Rank 241 bound to package[1][core:241]
[inst-e6-nps1:23187] Rank 242 bound to package[1][core:242]
[inst-e6-nps1:23187] Rank 243 bound to package[1][core:243]
[inst-e6-nps1:23187] Rank 244 bound to package[1][core:244]
[inst-e6-nps1:23187] Rank 245 bound to package[1][core:245]
[inst-e6-nps1:23187] Rank 246 bound to package[1][core:246]
[inst-e6-nps1:23187] Rank 247 bound to package[1][core:247]
[inst-e6-nps1:23187] Rank 248 bound to package[1][core:248]
[inst-e6-nps1:23187] Rank 249 bound to package[1][core:249]
[inst-e6-nps1:23187] Rank 250 bound to package[1][core:250]
[inst-e6-nps1:23187] Rank 251 bound to package[1][core:251]
[inst-e6-nps1:23187] Rank 252 bound to package[1][core:252]
[inst-e6-nps1:23187] Rank 253 bound to package[1][core:253]
[inst-e6-nps1:23187] Rank 254 bound to package[1][core:254]
[inst-e6-nps1:23187] Rank 255 bound to package[1][core:255]
$
```

[No.9]

```sh
$ mpirun -n 256 --bind-to core --map-by ppr:8:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps1:23463] Rank 0 bound to package[0][core:0]
[inst-e6-nps1:23463] Rank 1 bound to package[0][core:8]
[inst-e6-nps1:23463] Rank 2 bound to package[0][core:16]
[inst-e6-nps1:23463] Rank 3 bound to package[0][core:24]
[inst-e6-nps1:23463] Rank 4 bound to package[0][core:32]
[inst-e6-nps1:23463] Rank 5 bound to package[0][core:40]
[inst-e6-nps1:23463] Rank 6 bound to package[0][core:48]
[inst-e6-nps1:23463] Rank 7 bound to package[0][core:56]
[inst-e6-nps1:23463] Rank 8 bound to package[0][core:64]
[inst-e6-nps1:23463] Rank 9 bound to package[0][core:72]
[inst-e6-nps1:23463] Rank 10 bound to package[0][core:80]
[inst-e6-nps1:23463] Rank 11 bound to package[0][core:88]
[inst-e6-nps1:23463] Rank 12 bound to package[0][core:96]
[inst-e6-nps1:23463] Rank 13 bound to package[0][core:104]
[inst-e6-nps1:23463] Rank 14 bound to package[0][core:112]
[inst-e6-nps1:23463] Rank 15 bound to package[0][core:120]
[inst-e6-nps1:23463] Rank 16 bound to package[1][core:128]
[inst-e6-nps1:23463] Rank 17 bound to package[1][core:136]
[inst-e6-nps1:23463] Rank 18 bound to package[1][core:144]
[inst-e6-nps1:23463] Rank 19 bound to package[1][core:152]
[inst-e6-nps1:23463] Rank 20 bound to package[1][core:160]
[inst-e6-nps1:23463] Rank 21 bound to package[1][core:168]
[inst-e6-nps1:23463] Rank 22 bound to package[1][core:176]
[inst-e6-nps1:23463] Rank 23 bound to package[1][core:184]
[inst-e6-nps1:23463] Rank 24 bound to package[1][core:192]
[inst-e6-nps1:23463] Rank 25 bound to package[1][core:200]
[inst-e6-nps1:23463] Rank 26 bound to package[1][core:208]
[inst-e6-nps1:23463] Rank 27 bound to package[1][core:216]
[inst-e6-nps1:23463] Rank 28 bound to package[1][core:224]
[inst-e6-nps1:23463] Rank 29 bound to package[1][core:232]
[inst-e6-nps1:23463] Rank 30 bound to package[1][core:240]
[inst-e6-nps1:23463] Rank 31 bound to package[1][core:248]
[inst-e6-nps1:23463] Rank 32 bound to package[0][core:1]
[inst-e6-nps1:23463] Rank 33 bound to package[0][core:9]
[inst-e6-nps1:23463] Rank 34 bound to package[0][core:17]
[inst-e6-nps1:23463] Rank 35 bound to package[0][core:25]
[inst-e6-nps1:23463] Rank 36 bound to package[0][core:33]
[inst-e6-nps1:23463] Rank 37 bound to package[0][core:41]
[inst-e6-nps1:23463] Rank 38 bound to package[0][core:49]
[inst-e6-nps1:23463] Rank 39 bound to package[0][core:57]
[inst-e6-nps1:23463] Rank 40 bound to package[0][core:65]
[inst-e6-nps1:23463] Rank 41 bound to package[0][core:73]
[inst-e6-nps1:23463] Rank 42 bound to package[0][core:81]
[inst-e6-nps1:23463] Rank 43 bound to package[0][core:89]
[inst-e6-nps1:23463] Rank 44 bound to package[0][core:97]
[inst-e6-nps1:23463] Rank 45 bound to package[0][core:105]
[inst-e6-nps1:23463] Rank 46 bound to package[0][core:113]
[inst-e6-nps1:23463] Rank 47 bound to package[0][core:121]
[inst-e6-nps1:23463] Rank 48 bound to package[1][core:129]
[inst-e6-nps1:23463] Rank 49 bound to package[1][core:137]
[inst-e6-nps1:23463] Rank 50 bound to package[1][core:145]
[inst-e6-nps1:23463] Rank 51 bound to package[1][core:153]
[inst-e6-nps1:23463] Rank 52 bound to package[1][core:161]
[inst-e6-nps1:23463] Rank 53 bound to package[1][core:169]
[inst-e6-nps1:23463] Rank 54 bound to package[1][core:177]
[inst-e6-nps1:23463] Rank 55 bound to package[1][core:185]
[inst-e6-nps1:23463] Rank 56 bound to package[1][core:193]
[inst-e6-nps1:23463] Rank 57 bound to package[1][core:201]
[inst-e6-nps1:23463] Rank 58 bound to package[1][core:209]
[inst-e6-nps1:23463] Rank 59 bound to package[1][core:217]
[inst-e6-nps1:23463] Rank 60 bound to package[1][core:225]
[inst-e6-nps1:23463] Rank 61 bound to package[1][core:233]
[inst-e6-nps1:23463] Rank 62 bound to package[1][core:241]
[inst-e6-nps1:23463] Rank 63 bound to package[1][core:249]
[inst-e6-nps1:23463] Rank 64 bound to package[0][core:2]
[inst-e6-nps1:23463] Rank 65 bound to package[0][core:10]
[inst-e6-nps1:23463] Rank 66 bound to package[0][core:18]
[inst-e6-nps1:23463] Rank 67 bound to package[0][core:26]
[inst-e6-nps1:23463] Rank 68 bound to package[0][core:34]
[inst-e6-nps1:23463] Rank 69 bound to package[0][core:42]
[inst-e6-nps1:23463] Rank 70 bound to package[0][core:50]
[inst-e6-nps1:23463] Rank 71 bound to package[0][core:58]
[inst-e6-nps1:23463] Rank 72 bound to package[0][core:66]
[inst-e6-nps1:23463] Rank 73 bound to package[0][core:74]
[inst-e6-nps1:23463] Rank 74 bound to package[0][core:82]
[inst-e6-nps1:23463] Rank 75 bound to package[0][core:90]
[inst-e6-nps1:23463] Rank 76 bound to package[0][core:98]
[inst-e6-nps1:23463] Rank 77 bound to package[0][core:106]
[inst-e6-nps1:23463] Rank 78 bound to package[0][core:114]
[inst-e6-nps1:23463] Rank 79 bound to package[0][core:122]
[inst-e6-nps1:23463] Rank 80 bound to package[1][core:130]
[inst-e6-nps1:23463] Rank 81 bound to package[1][core:138]
[inst-e6-nps1:23463] Rank 82 bound to package[1][core:146]
[inst-e6-nps1:23463] Rank 83 bound to package[1][core:154]
[inst-e6-nps1:23463] Rank 84 bound to package[1][core:162]
[inst-e6-nps1:23463] Rank 85 bound to package[1][core:170]
[inst-e6-nps1:23463] Rank 86 bound to package[1][core:178]
[inst-e6-nps1:23463] Rank 87 bound to package[1][core:186]
[inst-e6-nps1:23463] Rank 88 bound to package[1][core:194]
[inst-e6-nps1:23463] Rank 89 bound to package[1][core:202]
[inst-e6-nps1:23463] Rank 90 bound to package[1][core:210]
[inst-e6-nps1:23463] Rank 91 bound to package[1][core:218]
[inst-e6-nps1:23463] Rank 92 bound to package[1][core:226]
[inst-e6-nps1:23463] Rank 93 bound to package[1][core:234]
[inst-e6-nps1:23463] Rank 94 bound to package[1][core:242]
[inst-e6-nps1:23463] Rank 95 bound to package[1][core:250]
[inst-e6-nps1:23463] Rank 96 bound to package[0][core:3]
[inst-e6-nps1:23463] Rank 97 bound to package[0][core:11]
[inst-e6-nps1:23463] Rank 98 bound to package[0][core:19]
[inst-e6-nps1:23463] Rank 99 bound to package[0][core:27]
[inst-e6-nps1:23463] Rank 100 bound to package[0][core:35]
[inst-e6-nps1:23463] Rank 101 bound to package[0][core:43]
[inst-e6-nps1:23463] Rank 102 bound to package[0][core:51]
[inst-e6-nps1:23463] Rank 103 bound to package[0][core:59]
[inst-e6-nps1:23463] Rank 104 bound to package[0][core:67]
[inst-e6-nps1:23463] Rank 105 bound to package[0][core:75]
[inst-e6-nps1:23463] Rank 106 bound to package[0][core:83]
[inst-e6-nps1:23463] Rank 107 bound to package[0][core:91]
[inst-e6-nps1:23463] Rank 108 bound to package[0][core:99]
[inst-e6-nps1:23463] Rank 109 bound to package[0][core:107]
[inst-e6-nps1:23463] Rank 110 bound to package[0][core:115]
[inst-e6-nps1:23463] Rank 111 bound to package[0][core:123]
[inst-e6-nps1:23463] Rank 112 bound to package[1][core:131]
[inst-e6-nps1:23463] Rank 113 bound to package[1][core:139]
[inst-e6-nps1:23463] Rank 114 bound to package[1][core:147]
[inst-e6-nps1:23463] Rank 115 bound to package[1][core:155]
[inst-e6-nps1:23463] Rank 116 bound to package[1][core:163]
[inst-e6-nps1:23463] Rank 117 bound to package[1][core:171]
[inst-e6-nps1:23463] Rank 118 bound to package[1][core:179]
[inst-e6-nps1:23463] Rank 119 bound to package[1][core:187]
[inst-e6-nps1:23463] Rank 120 bound to package[1][core:195]
[inst-e6-nps1:23463] Rank 121 bound to package[1][core:203]
[inst-e6-nps1:23463] Rank 122 bound to package[1][core:211]
[inst-e6-nps1:23463] Rank 123 bound to package[1][core:219]
[inst-e6-nps1:23463] Rank 124 bound to package[1][core:227]
[inst-e6-nps1:23463] Rank 125 bound to package[1][core:235]
[inst-e6-nps1:23463] Rank 126 bound to package[1][core:243]
[inst-e6-nps1:23463] Rank 127 bound to package[1][core:251]
[inst-e6-nps1:23463] Rank 128 bound to package[0][core:4]
[inst-e6-nps1:23463] Rank 129 bound to package[0][core:12]
[inst-e6-nps1:23463] Rank 130 bound to package[0][core:20]
[inst-e6-nps1:23463] Rank 131 bound to package[0][core:28]
[inst-e6-nps1:23463] Rank 132 bound to package[0][core:36]
[inst-e6-nps1:23463] Rank 133 bound to package[0][core:44]
[inst-e6-nps1:23463] Rank 134 bound to package[0][core:52]
[inst-e6-nps1:23463] Rank 135 bound to package[0][core:60]
[inst-e6-nps1:23463] Rank 136 bound to package[0][core:68]
[inst-e6-nps1:23463] Rank 137 bound to package[0][core:76]
[inst-e6-nps1:23463] Rank 138 bound to package[0][core:84]
[inst-e6-nps1:23463] Rank 139 bound to package[0][core:92]
[inst-e6-nps1:23463] Rank 140 bound to package[0][core:100]
[inst-e6-nps1:23463] Rank 141 bound to package[0][core:108]
[inst-e6-nps1:23463] Rank 142 bound to package[0][core:116]
[inst-e6-nps1:23463] Rank 143 bound to package[0][core:124]
[inst-e6-nps1:23463] Rank 144 bound to package[1][core:132]
[inst-e6-nps1:23463] Rank 145 bound to package[1][core:140]
[inst-e6-nps1:23463] Rank 146 bound to package[1][core:148]
[inst-e6-nps1:23463] Rank 147 bound to package[1][core:156]
[inst-e6-nps1:23463] Rank 148 bound to package[1][core:164]
[inst-e6-nps1:23463] Rank 149 bound to package[1][core:172]
[inst-e6-nps1:23463] Rank 150 bound to package[1][core:180]
[inst-e6-nps1:23463] Rank 151 bound to package[1][core:188]
[inst-e6-nps1:23463] Rank 152 bound to package[1][core:196]
[inst-e6-nps1:23463] Rank 153 bound to package[1][core:204]
[inst-e6-nps1:23463] Rank 154 bound to package[1][core:212]
[inst-e6-nps1:23463] Rank 155 bound to package[1][core:220]
[inst-e6-nps1:23463] Rank 156 bound to package[1][core:228]
[inst-e6-nps1:23463] Rank 157 bound to package[1][core:236]
[inst-e6-nps1:23463] Rank 158 bound to package[1][core:244]
[inst-e6-nps1:23463] Rank 159 bound to package[1][core:252]
[inst-e6-nps1:23463] Rank 160 bound to package[0][core:5]
[inst-e6-nps1:23463] Rank 161 bound to package[0][core:13]
[inst-e6-nps1:23463] Rank 162 bound to package[0][core:21]
[inst-e6-nps1:23463] Rank 163 bound to package[0][core:29]
[inst-e6-nps1:23463] Rank 164 bound to package[0][core:37]
[inst-e6-nps1:23463] Rank 165 bound to package[0][core:45]
[inst-e6-nps1:23463] Rank 166 bound to package[0][core:53]
[inst-e6-nps1:23463] Rank 167 bound to package[0][core:61]
[inst-e6-nps1:23463] Rank 168 bound to package[0][core:69]
[inst-e6-nps1:23463] Rank 169 bound to package[0][core:77]
[inst-e6-nps1:23463] Rank 170 bound to package[0][core:85]
[inst-e6-nps1:23463] Rank 171 bound to package[0][core:93]
[inst-e6-nps1:23463] Rank 172 bound to package[0][core:101]
[inst-e6-nps1:23463] Rank 173 bound to package[0][core:109]
[inst-e6-nps1:23463] Rank 174 bound to package[0][core:117]
[inst-e6-nps1:23463] Rank 175 bound to package[0][core:125]
[inst-e6-nps1:23463] Rank 176 bound to package[1][core:133]
[inst-e6-nps1:23463] Rank 177 bound to package[1][core:141]
[inst-e6-nps1:23463] Rank 178 bound to package[1][core:149]
[inst-e6-nps1:23463] Rank 179 bound to package[1][core:157]
[inst-e6-nps1:23463] Rank 180 bound to package[1][core:165]
[inst-e6-nps1:23463] Rank 181 bound to package[1][core:173]
[inst-e6-nps1:23463] Rank 182 bound to package[1][core:181]
[inst-e6-nps1:23463] Rank 183 bound to package[1][core:189]
[inst-e6-nps1:23463] Rank 184 bound to package[1][core:197]
[inst-e6-nps1:23463] Rank 185 bound to package[1][core:205]
[inst-e6-nps1:23463] Rank 186 bound to package[1][core:213]
[inst-e6-nps1:23463] Rank 187 bound to package[1][core:221]
[inst-e6-nps1:23463] Rank 188 bound to package[1][core:229]
[inst-e6-nps1:23463] Rank 189 bound to package[1][core:237]
[inst-e6-nps1:23463] Rank 190 bound to package[1][core:245]
[inst-e6-nps1:23463] Rank 191 bound to package[1][core:253]
[inst-e6-nps1:23463] Rank 192 bound to package[0][core:6]
[inst-e6-nps1:23463] Rank 193 bound to package[0][core:14]
[inst-e6-nps1:23463] Rank 194 bound to package[0][core:22]
[inst-e6-nps1:23463] Rank 195 bound to package[0][core:30]
[inst-e6-nps1:23463] Rank 196 bound to package[0][core:38]
[inst-e6-nps1:23463] Rank 197 bound to package[0][core:46]
[inst-e6-nps1:23463] Rank 198 bound to package[0][core:54]
[inst-e6-nps1:23463] Rank 199 bound to package[0][core:62]
[inst-e6-nps1:23463] Rank 200 bound to package[0][core:70]
[inst-e6-nps1:23463] Rank 201 bound to package[0][core:78]
[inst-e6-nps1:23463] Rank 202 bound to package[0][core:86]
[inst-e6-nps1:23463] Rank 203 bound to package[0][core:94]
[inst-e6-nps1:23463] Rank 204 bound to package[0][core:102]
[inst-e6-nps1:23463] Rank 205 bound to package[0][core:110]
[inst-e6-nps1:23463] Rank 206 bound to package[0][core:118]
[inst-e6-nps1:23463] Rank 207 bound to package[0][core:126]
[inst-e6-nps1:23463] Rank 208 bound to package[1][core:134]
[inst-e6-nps1:23463] Rank 209 bound to package[1][core:142]
[inst-e6-nps1:23463] Rank 210 bound to package[1][core:150]
[inst-e6-nps1:23463] Rank 211 bound to package[1][core:158]
[inst-e6-nps1:23463] Rank 212 bound to package[1][core:166]
[inst-e6-nps1:23463] Rank 213 bound to package[1][core:174]
[inst-e6-nps1:23463] Rank 214 bound to package[1][core:182]
[inst-e6-nps1:23463] Rank 215 bound to package[1][core:190]
[inst-e6-nps1:23463] Rank 216 bound to package[1][core:198]
[inst-e6-nps1:23463] Rank 217 bound to package[1][core:206]
[inst-e6-nps1:23463] Rank 218 bound to package[1][core:214]
[inst-e6-nps1:23463] Rank 219 bound to package[1][core:222]
[inst-e6-nps1:23463] Rank 220 bound to package[1][core:230]
[inst-e6-nps1:23463] Rank 221 bound to package[1][core:238]
[inst-e6-nps1:23463] Rank 222 bound to package[1][core:246]
[inst-e6-nps1:23463] Rank 223 bound to package[1][core:254]
[inst-e6-nps1:23463] Rank 224 bound to package[0][core:7]
[inst-e6-nps1:23463] Rank 225 bound to package[0][core:15]
[inst-e6-nps1:23463] Rank 226 bound to package[0][core:23]
[inst-e6-nps1:23463] Rank 227 bound to package[0][core:31]
[inst-e6-nps1:23463] Rank 228 bound to package[0][core:39]
[inst-e6-nps1:23463] Rank 229 bound to package[0][core:47]
[inst-e6-nps1:23463] Rank 230 bound to package[0][core:55]
[inst-e6-nps1:23463] Rank 231 bound to package[0][core:63]
[inst-e6-nps1:23463] Rank 232 bound to package[0][core:71]
[inst-e6-nps1:23463] Rank 233 bound to package[0][core:79]
[inst-e6-nps1:23463] Rank 234 bound to package[0][core:87]
[inst-e6-nps1:23463] Rank 235 bound to package[0][core:95]
[inst-e6-nps1:23463] Rank 236 bound to package[0][core:103]
[inst-e6-nps1:23463] Rank 237 bound to package[0][core:111]
[inst-e6-nps1:23463] Rank 238 bound to package[0][core:119]
[inst-e6-nps1:23463] Rank 239 bound to package[0][core:127]
[inst-e6-nps1:23463] Rank 240 bound to package[1][core:135]
[inst-e6-nps1:23463] Rank 241 bound to package[1][core:143]
[inst-e6-nps1:23463] Rank 242 bound to package[1][core:151]
[inst-e6-nps1:23463] Rank 243 bound to package[1][core:159]
[inst-e6-nps1:23463] Rank 244 bound to package[1][core:167]
[inst-e6-nps1:23463] Rank 245 bound to package[1][core:175]
[inst-e6-nps1:23463] Rank 246 bound to package[1][core:183]
[inst-e6-nps1:23463] Rank 247 bound to package[1][core:191]
[inst-e6-nps1:23463] Rank 248 bound to package[1][core:199]
[inst-e6-nps1:23463] Rank 249 bound to package[1][core:207]
[inst-e6-nps1:23463] Rank 250 bound to package[1][core:215]
[inst-e6-nps1:23463] Rank 251 bound to package[1][core:223]
[inst-e6-nps1:23463] Rank 252 bound to package[1][core:231]
[inst-e6-nps1:23463] Rank 253 bound to package[1][core:239]
[inst-e6-nps1:23463] Rank 254 bound to package[1][core:247]
[inst-e6-nps1:23463] Rank 255 bound to package[1][core:255]
$
```

[No.10]

```sh
$ mpirun -n 2 --bind-to core --map-by ppr:1:package:PE=128 -x OMP_NUM_THREAD=128 -x OMP_PROC_BIND=TRUE bash -c 'sleep $OMPI_COMM_WORLD_RANK; echo "Rank $OMPI_COMM_WORLD_RANK Node `echo $((OMPI_COMM_WORLD_RANK / OMPI_COMM_WORLD_LOCAL_SIZE))`"; ./show_thread_bind | sort -k 2n,2'
Rank 0 Node 0
Thread  0 Core   0
Thread  1 Core   1
Thread  2 Core   2
Thread  3 Core   3
Thread  4 Core   4
Thread  5 Core   5
Thread  6 Core   6
Thread  7 Core   7
Thread  8 Core   8
Thread  9 Core   9
Thread 10 Core  10
Thread 11 Core  11
Thread 12 Core  12
Thread 13 Core  13
Thread 14 Core  14
Thread 15 Core  15
Thread 16 Core  16
Thread 17 Core  17
Thread 18 Core  18
Thread 19 Core  19
Thread 20 Core  20
Thread 21 Core  21
Thread 22 Core  22
Thread 23 Core  23
Thread 24 Core  24
Thread 25 Core  25
Thread 26 Core  26
Thread 27 Core  27
Thread 28 Core  28
Thread 29 Core  29
Thread 30 Core  30
Thread 31 Core  31
Thread 32 Core  32
Thread 33 Core  33
Thread 34 Core  34
Thread 35 Core  35
Thread 36 Core  36
Thread 37 Core  37
Thread 38 Core  38
Thread 39 Core  39
Thread 40 Core  40
Thread 41 Core  41
Thread 42 Core  42
Thread 43 Core  43
Thread 44 Core  44
Thread 45 Core  45
Thread 46 Core  46
Thread 47 Core  47
Thread 48 Core  48
Thread 49 Core  49
Thread 50 Core  50
Thread 51 Core  51
Thread 52 Core  52
Thread 53 Core  53
Thread 54 Core  54
Thread 55 Core  55
Thread 56 Core  56
Thread 57 Core  57
Thread 58 Core  58
Thread 59 Core  59
Thread 60 Core  60
Thread 61 Core  61
Thread 62 Core  62
Thread 63 Core  63
Thread 64 Core  64
Thread 65 Core  65
Thread 66 Core  66
Thread 67 Core  67
Thread 68 Core  68
Thread 69 Core  69
Thread 70 Core  70
Thread 71 Core  71
Thread 72 Core  72
Thread 73 Core  73
Thread 74 Core  74
Thread 75 Core  75
Thread 76 Core  76
Thread 77 Core  77
Thread 78 Core  78
Thread 79 Core  79
Thread 80 Core  80
Thread 81 Core  81
Thread 82 Core  82
Thread 83 Core  83
Thread 84 Core  84
Thread 85 Core  85
Thread 86 Core  86
Thread 87 Core  87
Thread 88 Core  88
Thread 89 Core  89
Thread 90 Core  90
Thread 91 Core  91
Thread 92 Core  92
Thread 93 Core  93
Thread 94 Core  94
Thread 95 Core  95
Thread 96 Core  96
Thread 97 Core  97
Thread 98 Core  98
Thread 99 Core  99
Thread 100 Core 100
Thread 101 Core 101
Thread 102 Core 102
Thread 103 Core 103
Thread 104 Core 104
Thread 105 Core 105
Thread 106 Core 106
Thread 107 Core 107
Thread 108 Core 108
Thread 109 Core 109
Thread 110 Core 110
Thread 111 Core 111
Thread 112 Core 112
Thread 113 Core 113
Thread 114 Core 114
Thread 115 Core 115
Thread 116 Core 116
Thread 117 Core 117
Thread 118 Core 118
Thread 119 Core 119
Thread 120 Core 120
Thread 121 Core 121
Thread 122 Core 122
Thread 123 Core 123
Thread 124 Core 124
Thread 125 Core 125
Thread 126 Core 126
Thread 127 Core 127
Rank 1 Node 0
Thread  0 Core 128
Thread  1 Core 129
Thread  2 Core 130
Thread  3 Core 131
Thread  4 Core 132
Thread  5 Core 133
Thread  6 Core 134
Thread  7 Core 135
Thread  8 Core 136
Thread  9 Core 137
Thread 10 Core 138
Thread 11 Core 139
Thread 12 Core 140
Thread 13 Core 141
Thread 14 Core 142
Thread 15 Core 143
Thread 16 Core 144
Thread 17 Core 145
Thread 18 Core 146
Thread 19 Core 147
Thread 20 Core 148
Thread 21 Core 149
Thread 22 Core 150
Thread 23 Core 151
Thread 24 Core 152
Thread 25 Core 153
Thread 26 Core 154
Thread 27 Core 155
Thread 28 Core 156
Thread 29 Core 157
Thread 30 Core 158
Thread 31 Core 159
Thread 32 Core 160
Thread 33 Core 161
Thread 34 Core 162
Thread 35 Core 163
Thread 36 Core 164
Thread 37 Core 165
Thread 38 Core 166
Thread 39 Core 167
Thread 40 Core 168
Thread 41 Core 169
Thread 42 Core 170
Thread 43 Core 171
Thread 44 Core 172
Thread 45 Core 173
Thread 46 Core 174
Thread 47 Core 175
Thread 48 Core 176
Thread 49 Core 177
Thread 50 Core 178
Thread 51 Core 179
Thread 52 Core 180
Thread 53 Core 181
Thread 54 Core 182
Thread 55 Core 183
Thread 56 Core 184
Thread 57 Core 185
Thread 58 Core 186
Thread 59 Core 187
Thread 60 Core 188
Thread 61 Core 189
Thread 62 Core 190
Thread 63 Core 191
Thread 64 Core 192
Thread 65 Core 193
Thread 66 Core 194
Thread 67 Core 195
Thread 68 Core 196
Thread 69 Core 197
Thread 70 Core 198
Thread 71 Core 199
Thread 72 Core 200
Thread 73 Core 201
Thread 74 Core 202
Thread 75 Core 203
Thread 76 Core 204
Thread 77 Core 205
Thread 78 Core 206
Thread 79 Core 207
Thread 80 Core 208
Thread 81 Core 209
Thread 82 Core 210
Thread 83 Core 211
Thread 84 Core 212
Thread 85 Core 213
Thread 86 Core 214
Thread 87 Core 215
Thread 88 Core 216
Thread 89 Core 217
Thread 90 Core 218
Thread 91 Core 219
Thread 92 Core 220
Thread 93 Core 221
Thread 94 Core 222
Thread 95 Core 223
Thread 96 Core 224
Thread 97 Core 225
Thread 98 Core 226
Thread 99 Core 227
Thread 100 Core 228
Thread 101 Core 229
Thread 102 Core 230
Thread 103 Core 231
Thread 104 Core 232
Thread 105 Core 233
Thread 106 Core 234
Thread 107 Core 235
Thread 108 Core 236
Thread 109 Core 237
Thread 110 Core 238
Thread 111 Core 239
Thread 112 Core 240
Thread 113 Core 241
Thread 114 Core 242
Thread 115 Core 243
Thread 116 Core 244
Thread 117 Core 245
Thread 118 Core 246
Thread 119 Core 247
Thread 120 Core 248
Thread 121 Core 249
Thread 122 Core 250
Thread 123 Core 251
Thread 124 Core 252
Thread 125 Core 253
Thread 126 Core 254
Thread 127 Core 255
$
```

[No.11]

```sh
$ mpirun -n 32 --bind-to core --map-by ppr:1:l3cache:PE=8 -x OMP_NUM_THREAD=8 -x OMP_PROC_BIND=TRUE bash -c 'sleep $OMPI_COMM_WORLD_RANK; echo "Rank $OMPI_COMM_WORLD_RANK Node `echo $((OMPI_COMM_WORLD_RANK / OMPI_COMM_WORLD_LOCAL_SIZE))`"; ./show_thread_bind | sort -k 2n,2'
Rank 0 Node 0
Thread  0 Core   0
Thread  1 Core   1
Thread  2 Core   2
Thread  3 Core   3
Thread  4 Core   4
Thread  5 Core   5
Thread  6 Core   6
Thread  7 Core   7
Rank 1 Node 0
Thread  0 Core   8
Thread  1 Core   9
Thread  2 Core  10
Thread  3 Core  11
Thread  4 Core  12
Thread  5 Core  13
Thread  6 Core  14
Thread  7 Core  15
Rank 2 Node 0
Thread  0 Core  16
Thread  1 Core  17
Thread  2 Core  18
Thread  3 Core  19
Thread  4 Core  20
Thread  5 Core  21
Thread  6 Core  22
Thread  7 Core  23
Rank 3 Node 0
Thread  0 Core  24
Thread  1 Core  25
Thread  2 Core  26
Thread  3 Core  27
Thread  4 Core  28
Thread  5 Core  29
Thread  6 Core  30
Thread  7 Core  31
Rank 4 Node 0
Thread  0 Core  32
Thread  1 Core  33
Thread  2 Core  34
Thread  3 Core  35
Thread  4 Core  36
Thread  5 Core  37
Thread  6 Core  38
Thread  7 Core  39
Rank 5 Node 0
Thread  0 Core  40
Thread  1 Core  41
Thread  2 Core  42
Thread  3 Core  43
Thread  4 Core  44
Thread  5 Core  45
Thread  6 Core  46
Thread  7 Core  47
Rank 6 Node 0
Thread  0 Core  48
Thread  1 Core  49
Thread  2 Core  50
Thread  3 Core  51
Thread  4 Core  52
Thread  5 Core  53
Thread  6 Core  54
Thread  7 Core  55
Rank 7 Node 0
Thread  0 Core  56
Thread  1 Core  57
Thread  2 Core  58
Thread  3 Core  59
Thread  4 Core  60
Thread  5 Core  61
Thread  6 Core  62
Thread  7 Core  63
Rank 8 Node 0
Thread  0 Core  64
Thread  1 Core  65
Thread  2 Core  66
Thread  3 Core  67
Thread  4 Core  68
Thread  5 Core  69
Thread  6 Core  70
Thread  7 Core  71
Rank 9 Node 0
Thread  0 Core  72
Thread  1 Core  73
Thread  2 Core  74
Thread  3 Core  75
Thread  4 Core  76
Thread  5 Core  77
Thread  6 Core  78
Thread  7 Core  79
Rank 10 Node 0
Thread  0 Core  80
Thread  1 Core  81
Thread  2 Core  82
Thread  3 Core  83
Thread  4 Core  84
Thread  5 Core  85
Thread  6 Core  86
Thread  7 Core  87
Rank 11 Node 0
Thread  0 Core  88
Thread  1 Core  89
Thread  2 Core  90
Thread  3 Core  91
Thread  4 Core  92
Thread  5 Core  93
Thread  6 Core  94
Thread  7 Core  95
Rank 12 Node 0
Thread  0 Core  96
Thread  1 Core  97
Thread  2 Core  98
Thread  3 Core  99
Thread  4 Core 100
Thread  5 Core 101
Thread  6 Core 102
Thread  7 Core 103
Rank 13 Node 0
Thread  0 Core 104
Thread  1 Core 105
Thread  2 Core 106
Thread  3 Core 107
Thread  4 Core 108
Thread  5 Core 109
Thread  6 Core 110
Thread  7 Core 111
Rank 14 Node 0
Thread  0 Core 112
Thread  1 Core 113
Thread  2 Core 114
Thread  3 Core 115
Thread  4 Core 116
Thread  5 Core 117
Thread  6 Core 118
Thread  7 Core 119
Rank 15 Node 0
Thread  0 Core 120
Thread  1 Core 121
Thread  2 Core 122
Thread  3 Core 123
Thread  4 Core 124
Thread  5 Core 125
Thread  6 Core 126
Thread  7 Core 127
Rank 16 Node 0
Thread  0 Core 128
Thread  1 Core 129
Thread  2 Core 130
Thread  3 Core 131
Thread  4 Core 132
Thread  5 Core 133
Thread  6 Core 134
Thread  7 Core 135
Rank 17 Node 0
Thread  0 Core 136
Thread  1 Core 137
Thread  2 Core 138
Thread  3 Core 139
Thread  4 Core 140
Thread  5 Core 141
Thread  6 Core 142
Thread  7 Core 143
Rank 18 Node 0
Thread  0 Core 144
Thread  1 Core 145
Thread  2 Core 146
Thread  3 Core 147
Thread  4 Core 148
Thread  5 Core 149
Thread  6 Core 150
Thread  7 Core 151
Rank 19 Node 0
Thread  0 Core 152
Thread  1 Core 153
Thread  2 Core 154
Thread  3 Core 155
Thread  4 Core 156
Thread  5 Core 157
Thread  6 Core 158
Thread  7 Core 159
Rank 20 Node 0
Thread  0 Core 160
Thread  1 Core 161
Thread  2 Core 162
Thread  3 Core 163
Thread  4 Core 164
Thread  5 Core 165
Thread  6 Core 166
Thread  7 Core 167
Rank 21 Node 0
Thread  0 Core 168
Thread  1 Core 169
Thread  2 Core 170
Thread  3 Core 171
Thread  4 Core 172
Thread  5 Core 173
Thread  6 Core 174
Thread  7 Core 175
Rank 22 Node 0
Thread  0 Core 176
Thread  1 Core 177
Thread  2 Core 178
Thread  3 Core 179
Thread  4 Core 180
Thread  5 Core 181
Thread  6 Core 182
Thread  7 Core 183
Rank 23 Node 0
Thread  0 Core 184
Thread  1 Core 185
Thread  2 Core 186
Thread  3 Core 187
Thread  4 Core 188
Thread  5 Core 189
Thread  6 Core 190
Thread  7 Core 191
Rank 24 Node 0
Thread  0 Core 192
Thread  1 Core 193
Thread  2 Core 194
Thread  3 Core 195
Thread  4 Core 196
Thread  5 Core 197
Thread  6 Core 198
Thread  7 Core 199
Rank 25 Node 0
Thread  0 Core 200
Thread  1 Core 201
Thread  2 Core 202
Thread  3 Core 203
Thread  4 Core 204
Thread  5 Core 205
Thread  6 Core 206
Thread  7 Core 207
Rank 26 Node 0
Thread  0 Core 208
Thread  1 Core 209
Thread  2 Core 210
Thread  3 Core 211
Thread  4 Core 212
Thread  5 Core 213
Thread  6 Core 214
Thread  7 Core 215
Rank 27 Node 0
Thread  0 Core 216
Thread  1 Core 217
Thread  2 Core 218
Thread  3 Core 219
Thread  4 Core 220
Thread  5 Core 221
Thread  6 Core 222
Thread  7 Core 223
Rank 28 Node 0
Thread  0 Core 224
Thread  1 Core 225
Thread  2 Core 226
Thread  3 Core 227
Thread  4 Core 228
Thread  5 Core 229
Thread  6 Core 230
Thread  7 Core 231
Rank 29 Node 0
Thread  0 Core 232
Thread  1 Core 233
Thread  2 Core 234
Thread  3 Core 235
Thread  4 Core 236
Thread  5 Core 237
Thread  6 Core 238
Thread  7 Core 239
Rank 30 Node 0
Thread  0 Core 240
Thread  1 Core 241
Thread  2 Core 242
Thread  3 Core 243
Thread  4 Core 244
Thread  5 Core 245
Thread  6 Core 246
Thread  7 Core 247
Rank 31 Node 0
Thread  0 Core 248
Thread  1 Core 249
Thread  2 Core 250
Thread  3 Core 251
Thread  4 Core 252
Thread  5 Core 253
Thread  6 Core 254
Thread  7 Core 255
$
```

[No.12]

```sh
$ mpirun -n 8 --bind-to core --map-by ppr:1:numa --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps4:16583] Rank 0 bound to package[0][core:0]
[inst-e6-nps4:16583] Rank 1 bound to package[0][core:32]
[inst-e6-nps4:16583] Rank 2 bound to package[0][core:64]
[inst-e6-nps4:16583] Rank 3 bound to package[0][core:96]
[inst-e6-nps4:16583] Rank 4 bound to package[1][core:128]
[inst-e6-nps4:16583] Rank 5 bound to package[1][core:160]
[inst-e6-nps4:16583] Rank 6 bound to package[1][core:192]
[inst-e6-nps4:16583] Rank 7 bound to package[1][core:224]
$
```

[No.13]

```sh
$ mpirun -n 32 --bind-to core --map-by ppr:1:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps4:16596] Rank 0 bound to package[0][core:0]
[inst-e6-nps4:16596] Rank 1 bound to package[0][core:8]
[inst-e6-nps4:16596] Rank 2 bound to package[0][core:16]
[inst-e6-nps4:16596] Rank 3 bound to package[0][core:24]
[inst-e6-nps4:16596] Rank 4 bound to package[0][core:32]
[inst-e6-nps4:16596] Rank 5 bound to package[0][core:40]
[inst-e6-nps4:16596] Rank 6 bound to package[0][core:48]
[inst-e6-nps4:16596] Rank 7 bound to package[0][core:56]
[inst-e6-nps4:16596] Rank 8 bound to package[0][core:64]
[inst-e6-nps4:16596] Rank 9 bound to package[0][core:72]
[inst-e6-nps4:16596] Rank 10 bound to package[0][core:80]
[inst-e6-nps4:16596] Rank 11 bound to package[0][core:88]
[inst-e6-nps4:16596] Rank 12 bound to package[0][core:96]
[inst-e6-nps4:16596] Rank 13 bound to package[0][core:104]
[inst-e6-nps4:16596] Rank 14 bound to package[0][core:112]
[inst-e6-nps4:16596] Rank 15 bound to package[0][core:120]
[inst-e6-nps4:16596] Rank 16 bound to package[1][core:128]
[inst-e6-nps4:16596] Rank 17 bound to package[1][core:136]
[inst-e6-nps4:16596] Rank 18 bound to package[1][core:144]
[inst-e6-nps4:16596] Rank 19 bound to package[1][core:152]
[inst-e6-nps4:16596] Rank 20 bound to package[1][core:160]
[inst-e6-nps4:16596] Rank 21 bound to package[1][core:168]
[inst-e6-nps4:16596] Rank 22 bound to package[1][core:176]
[inst-e6-nps4:16596] Rank 23 bound to package[1][core:184]
[inst-e6-nps4:16596] Rank 24 bound to package[1][core:192]
[inst-e6-nps4:16596] Rank 25 bound to package[1][core:200]
[inst-e6-nps4:16596] Rank 26 bound to package[1][core:208]
[inst-e6-nps4:16596] Rank 27 bound to package[1][core:216]
[inst-e6-nps4:16596] Rank 28 bound to package[1][core:224]
[inst-e6-nps4:16596] Rank 29 bound to package[1][core:232]
[inst-e6-nps4:16596] Rank 30 bound to package[1][core:240]
[inst-e6-nps4:16596] Rank 31 bound to package[1][core:248]
$
```

[No.14]

```sh
$ mpirun -n 64 --bind-to core --map-by ppr:2:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps4:16640] Rank 0 bound to package[0][core:0]
[inst-e6-nps4:16640] Rank 1 bound to package[0][core:1]
[inst-e6-nps4:16640] Rank 2 bound to package[0][core:8]
[inst-e6-nps4:16640] Rank 3 bound to package[0][core:9]
[inst-e6-nps4:16640] Rank 4 bound to package[0][core:16]
[inst-e6-nps4:16640] Rank 5 bound to package[0][core:17]
[inst-e6-nps4:16640] Rank 6 bound to package[0][core:24]
[inst-e6-nps4:16640] Rank 7 bound to package[0][core:25]
[inst-e6-nps4:16640] Rank 8 bound to package[0][core:32]
[inst-e6-nps4:16640] Rank 9 bound to package[0][core:33]
[inst-e6-nps4:16640] Rank 10 bound to package[0][core:40]
[inst-e6-nps4:16640] Rank 11 bound to package[0][core:41]
[inst-e6-nps4:16640] Rank 12 bound to package[0][core:48]
[inst-e6-nps4:16640] Rank 13 bound to package[0][core:49]
[inst-e6-nps4:16640] Rank 14 bound to package[0][core:56]
[inst-e6-nps4:16640] Rank 15 bound to package[0][core:57]
[inst-e6-nps4:16640] Rank 16 bound to package[0][core:64]
[inst-e6-nps4:16640] Rank 17 bound to package[0][core:65]
[inst-e6-nps4:16640] Rank 18 bound to package[0][core:72]
[inst-e6-nps4:16640] Rank 19 bound to package[0][core:73]
[inst-e6-nps4:16640] Rank 20 bound to package[0][core:80]
[inst-e6-nps4:16640] Rank 21 bound to package[0][core:81]
[inst-e6-nps4:16640] Rank 22 bound to package[0][core:88]
[inst-e6-nps4:16640] Rank 23 bound to package[0][core:89]
[inst-e6-nps4:16640] Rank 24 bound to package[0][core:96]
[inst-e6-nps4:16640] Rank 25 bound to package[0][core:97]
[inst-e6-nps4:16640] Rank 26 bound to package[0][core:104]
[inst-e6-nps4:16640] Rank 27 bound to package[0][core:105]
[inst-e6-nps4:16640] Rank 28 bound to package[0][core:112]
[inst-e6-nps4:16640] Rank 29 bound to package[0][core:113]
[inst-e6-nps4:16640] Rank 30 bound to package[0][core:120]
[inst-e6-nps4:16640] Rank 31 bound to package[0][core:121]
[inst-e6-nps4:16640] Rank 32 bound to package[1][core:128]
[inst-e6-nps4:16640] Rank 33 bound to package[1][core:129]
[inst-e6-nps4:16640] Rank 34 bound to package[1][core:136]
[inst-e6-nps4:16640] Rank 35 bound to package[1][core:137]
[inst-e6-nps4:16640] Rank 36 bound to package[1][core:144]
[inst-e6-nps4:16640] Rank 37 bound to package[1][core:145]
[inst-e6-nps4:16640] Rank 38 bound to package[1][core:152]
[inst-e6-nps4:16640] Rank 39 bound to package[1][core:153]
[inst-e6-nps4:16640] Rank 40 bound to package[1][core:160]
[inst-e6-nps4:16640] Rank 41 bound to package[1][core:161]
[inst-e6-nps4:16640] Rank 42 bound to package[1][core:168]
[inst-e6-nps4:16640] Rank 43 bound to package[1][core:169]
[inst-e6-nps4:16640] Rank 44 bound to package[1][core:176]
[inst-e6-nps4:16640] Rank 45 bound to package[1][core:177]
[inst-e6-nps4:16640] Rank 46 bound to package[1][core:184]
[inst-e6-nps4:16640] Rank 47 bound to package[1][core:185]
[inst-e6-nps4:16640] Rank 48 bound to package[1][core:192]
[inst-e6-nps4:16640] Rank 49 bound to package[1][core:193]
[inst-e6-nps4:16640] Rank 50 bound to package[1][core:200]
[inst-e6-nps4:16640] Rank 51 bound to package[1][core:201]
[inst-e6-nps4:16640] Rank 52 bound to package[1][core:208]
[inst-e6-nps4:16640] Rank 53 bound to package[1][core:209]
[inst-e6-nps4:16640] Rank 54 bound to package[1][core:216]
[inst-e6-nps4:16640] Rank 55 bound to package[1][core:217]
[inst-e6-nps4:16640] Rank 56 bound to package[1][core:224]
[inst-e6-nps4:16640] Rank 57 bound to package[1][core:225]
[inst-e6-nps4:16640] Rank 58 bound to package[1][core:232]
[inst-e6-nps4:16640] Rank 59 bound to package[1][core:233]
[inst-e6-nps4:16640] Rank 60 bound to package[1][core:240]
[inst-e6-nps4:16640] Rank 61 bound to package[1][core:241]
[inst-e6-nps4:16640] Rank 62 bound to package[1][core:248]
[inst-e6-nps4:16640] Rank 63 bound to package[1][core:249]
$
```

[No.15]

```sh
$ mpirun -n 64 --bind-to core --map-by ppr:2:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps4:16719] Rank 0 bound to package[0][core:0]
[inst-e6-nps4:16719] Rank 1 bound to package[0][core:8]
[inst-e6-nps4:16719] Rank 2 bound to package[0][core:16]
[inst-e6-nps4:16719] Rank 3 bound to package[0][core:24]
[inst-e6-nps4:16719] Rank 4 bound to package[0][core:32]
[inst-e6-nps4:16719] Rank 5 bound to package[0][core:40]
[inst-e6-nps4:16719] Rank 6 bound to package[0][core:48]
[inst-e6-nps4:16719] Rank 7 bound to package[0][core:56]
[inst-e6-nps4:16719] Rank 8 bound to package[0][core:64]
[inst-e6-nps4:16719] Rank 9 bound to package[0][core:72]
[inst-e6-nps4:16719] Rank 10 bound to package[0][core:80]
[inst-e6-nps4:16719] Rank 11 bound to package[0][core:88]
[inst-e6-nps4:16719] Rank 12 bound to package[0][core:96]
[inst-e6-nps4:16719] Rank 13 bound to package[0][core:104]
[inst-e6-nps4:16719] Rank 14 bound to package[0][core:112]
[inst-e6-nps4:16719] Rank 15 bound to package[0][core:120]
[inst-e6-nps4:16719] Rank 16 bound to package[1][core:128]
[inst-e6-nps4:16719] Rank 17 bound to package[1][core:136]
[inst-e6-nps4:16719] Rank 18 bound to package[1][core:144]
[inst-e6-nps4:16719] Rank 19 bound to package[1][core:152]
[inst-e6-nps4:16719] Rank 20 bound to package[1][core:160]
[inst-e6-nps4:16719] Rank 21 bound to package[1][core:168]
[inst-e6-nps4:16719] Rank 22 bound to package[1][core:176]
[inst-e6-nps4:16719] Rank 23 bound to package[1][core:184]
[inst-e6-nps4:16719] Rank 24 bound to package[1][core:192]
[inst-e6-nps4:16719] Rank 25 bound to package[1][core:200]
[inst-e6-nps4:16719] Rank 26 bound to package[1][core:208]
[inst-e6-nps4:16719] Rank 27 bound to package[1][core:216]
[inst-e6-nps4:16719] Rank 28 bound to package[1][core:224]
[inst-e6-nps4:16719] Rank 29 bound to package[1][core:232]
[inst-e6-nps4:16719] Rank 30 bound to package[1][core:240]
[inst-e6-nps4:16719] Rank 31 bound to package[1][core:248]
[inst-e6-nps4:16719] Rank 32 bound to package[0][core:1]
[inst-e6-nps4:16719] Rank 33 bound to package[0][core:9]
[inst-e6-nps4:16719] Rank 34 bound to package[0][core:17]
[inst-e6-nps4:16719] Rank 35 bound to package[0][core:25]
[inst-e6-nps4:16719] Rank 36 bound to package[0][core:33]
[inst-e6-nps4:16719] Rank 37 bound to package[0][core:41]
[inst-e6-nps4:16719] Rank 38 bound to package[0][core:49]
[inst-e6-nps4:16719] Rank 39 bound to package[0][core:57]
[inst-e6-nps4:16719] Rank 40 bound to package[0][core:65]
[inst-e6-nps4:16719] Rank 41 bound to package[0][core:73]
[inst-e6-nps4:16719] Rank 42 bound to package[0][core:81]
[inst-e6-nps4:16719] Rank 43 bound to package[0][core:89]
[inst-e6-nps4:16719] Rank 44 bound to package[0][core:97]
[inst-e6-nps4:16719] Rank 45 bound to package[0][core:105]
[inst-e6-nps4:16719] Rank 46 bound to package[0][core:113]
[inst-e6-nps4:16719] Rank 47 bound to package[0][core:121]
[inst-e6-nps4:16719] Rank 48 bound to package[1][core:129]
[inst-e6-nps4:16719] Rank 49 bound to package[1][core:137]
[inst-e6-nps4:16719] Rank 50 bound to package[1][core:145]
[inst-e6-nps4:16719] Rank 51 bound to package[1][core:153]
[inst-e6-nps4:16719] Rank 52 bound to package[1][core:161]
[inst-e6-nps4:16719] Rank 53 bound to package[1][core:169]
[inst-e6-nps4:16719] Rank 54 bound to package[1][core:177]
[inst-e6-nps4:16719] Rank 55 bound to package[1][core:185]
[inst-e6-nps4:16719] Rank 56 bound to package[1][core:193]
[inst-e6-nps4:16719] Rank 57 bound to package[1][core:201]
[inst-e6-nps4:16719] Rank 58 bound to package[1][core:209]
[inst-e6-nps4:16719] Rank 59 bound to package[1][core:217]
[inst-e6-nps4:16719] Rank 60 bound to package[1][core:225]
[inst-e6-nps4:16719] Rank 61 bound to package[1][core:233]
[inst-e6-nps4:16719] Rank 62 bound to package[1][core:241]
[inst-e6-nps4:16719] Rank 63 bound to package[1][core:249]
$
```

[No.16]

```sh
$ mpirun -n 128 --bind-to core --map-by ppr:4:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps4:16795] Rank 0 bound to package[0][core:0]
[inst-e6-nps4:16795] Rank 1 bound to package[0][core:1]
[inst-e6-nps4:16795] Rank 2 bound to package[0][core:2]
[inst-e6-nps4:16795] Rank 3 bound to package[0][core:3]
[inst-e6-nps4:16795] Rank 4 bound to package[0][core:8]
[inst-e6-nps4:16795] Rank 5 bound to package[0][core:9]
[inst-e6-nps4:16795] Rank 6 bound to package[0][core:10]
[inst-e6-nps4:16795] Rank 7 bound to package[0][core:11]
[inst-e6-nps4:16795] Rank 8 bound to package[0][core:16]
[inst-e6-nps4:16795] Rank 9 bound to package[0][core:17]
[inst-e6-nps4:16795] Rank 10 bound to package[0][core:18]
[inst-e6-nps4:16795] Rank 11 bound to package[0][core:19]
[inst-e6-nps4:16795] Rank 12 bound to package[0][core:24]
[inst-e6-nps4:16795] Rank 13 bound to package[0][core:25]
[inst-e6-nps4:16795] Rank 14 bound to package[0][core:26]
[inst-e6-nps4:16795] Rank 15 bound to package[0][core:27]
[inst-e6-nps4:16795] Rank 16 bound to package[0][core:32]
[inst-e6-nps4:16795] Rank 17 bound to package[0][core:33]
[inst-e6-nps4:16795] Rank 18 bound to package[0][core:34]
[inst-e6-nps4:16795] Rank 19 bound to package[0][core:35]
[inst-e6-nps4:16795] Rank 20 bound to package[0][core:40]
[inst-e6-nps4:16795] Rank 21 bound to package[0][core:41]
[inst-e6-nps4:16795] Rank 22 bound to package[0][core:42]
[inst-e6-nps4:16795] Rank 23 bound to package[0][core:43]
[inst-e6-nps4:16795] Rank 24 bound to package[0][core:48]
[inst-e6-nps4:16795] Rank 25 bound to package[0][core:49]
[inst-e6-nps4:16795] Rank 26 bound to package[0][core:50]
[inst-e6-nps4:16795] Rank 27 bound to package[0][core:51]
[inst-e6-nps4:16795] Rank 28 bound to package[0][core:56]
[inst-e6-nps4:16795] Rank 29 bound to package[0][core:57]
[inst-e6-nps4:16795] Rank 30 bound to package[0][core:58]
[inst-e6-nps4:16795] Rank 31 bound to package[0][core:59]
[inst-e6-nps4:16795] Rank 32 bound to package[0][core:64]
[inst-e6-nps4:16795] Rank 33 bound to package[0][core:65]
[inst-e6-nps4:16795] Rank 34 bound to package[0][core:66]
[inst-e6-nps4:16795] Rank 35 bound to package[0][core:67]
[inst-e6-nps4:16795] Rank 36 bound to package[0][core:72]
[inst-e6-nps4:16795] Rank 37 bound to package[0][core:73]
[inst-e6-nps4:16795] Rank 38 bound to package[0][core:74]
[inst-e6-nps4:16795] Rank 39 bound to package[0][core:75]
[inst-e6-nps4:16795] Rank 40 bound to package[0][core:80]
[inst-e6-nps4:16795] Rank 41 bound to package[0][core:81]
[inst-e6-nps4:16795] Rank 42 bound to package[0][core:82]
[inst-e6-nps4:16795] Rank 43 bound to package[0][core:83]
[inst-e6-nps4:16795] Rank 44 bound to package[0][core:88]
[inst-e6-nps4:16795] Rank 45 bound to package[0][core:89]
[inst-e6-nps4:16795] Rank 46 bound to package[0][core:90]
[inst-e6-nps4:16795] Rank 47 bound to package[0][core:91]
[inst-e6-nps4:16795] Rank 48 bound to package[0][core:96]
[inst-e6-nps4:16795] Rank 49 bound to package[0][core:97]
[inst-e6-nps4:16795] Rank 50 bound to package[0][core:98]
[inst-e6-nps4:16795] Rank 51 bound to package[0][core:99]
[inst-e6-nps4:16795] Rank 52 bound to package[0][core:104]
[inst-e6-nps4:16795] Rank 53 bound to package[0][core:105]
[inst-e6-nps4:16795] Rank 54 bound to package[0][core:106]
[inst-e6-nps4:16795] Rank 55 bound to package[0][core:107]
[inst-e6-nps4:16795] Rank 56 bound to package[0][core:112]
[inst-e6-nps4:16795] Rank 57 bound to package[0][core:113]
[inst-e6-nps4:16795] Rank 58 bound to package[0][core:114]
[inst-e6-nps4:16795] Rank 59 bound to package[0][core:115]
[inst-e6-nps4:16795] Rank 60 bound to package[0][core:120]
[inst-e6-nps4:16795] Rank 61 bound to package[0][core:121]
[inst-e6-nps4:16795] Rank 62 bound to package[0][core:122]
[inst-e6-nps4:16795] Rank 63 bound to package[0][core:123]
[inst-e6-nps4:16795] Rank 64 bound to package[1][core:128]
[inst-e6-nps4:16795] Rank 65 bound to package[1][core:129]
[inst-e6-nps4:16795] Rank 66 bound to package[1][core:130]
[inst-e6-nps4:16795] Rank 67 bound to package[1][core:131]
[inst-e6-nps4:16795] Rank 68 bound to package[1][core:136]
[inst-e6-nps4:16795] Rank 69 bound to package[1][core:137]
[inst-e6-nps4:16795] Rank 70 bound to package[1][core:138]
[inst-e6-nps4:16795] Rank 71 bound to package[1][core:139]
[inst-e6-nps4:16795] Rank 72 bound to package[1][core:144]
[inst-e6-nps4:16795] Rank 73 bound to package[1][core:145]
[inst-e6-nps4:16795] Rank 74 bound to package[1][core:146]
[inst-e6-nps4:16795] Rank 75 bound to package[1][core:147]
[inst-e6-nps4:16795] Rank 76 bound to package[1][core:152]
[inst-e6-nps4:16795] Rank 77 bound to package[1][core:153]
[inst-e6-nps4:16795] Rank 78 bound to package[1][core:154]
[inst-e6-nps4:16795] Rank 79 bound to package[1][core:155]
[inst-e6-nps4:16795] Rank 80 bound to package[1][core:160]
[inst-e6-nps4:16795] Rank 81 bound to package[1][core:161]
[inst-e6-nps4:16795] Rank 82 bound to package[1][core:162]
[inst-e6-nps4:16795] Rank 83 bound to package[1][core:163]
[inst-e6-nps4:16795] Rank 84 bound to package[1][core:168]
[inst-e6-nps4:16795] Rank 85 bound to package[1][core:169]
[inst-e6-nps4:16795] Rank 86 bound to package[1][core:170]
[inst-e6-nps4:16795] Rank 87 bound to package[1][core:171]
[inst-e6-nps4:16795] Rank 88 bound to package[1][core:176]
[inst-e6-nps4:16795] Rank 89 bound to package[1][core:177]
[inst-e6-nps4:16795] Rank 90 bound to package[1][core:178]
[inst-e6-nps4:16795] Rank 91 bound to package[1][core:179]
[inst-e6-nps4:16795] Rank 92 bound to package[1][core:184]
[inst-e6-nps4:16795] Rank 93 bound to package[1][core:185]
[inst-e6-nps4:16795] Rank 94 bound to package[1][core:186]
[inst-e6-nps4:16795] Rank 95 bound to package[1][core:187]
[inst-e6-nps4:16795] Rank 96 bound to package[1][core:192]
[inst-e6-nps4:16795] Rank 97 bound to package[1][core:193]
[inst-e6-nps4:16795] Rank 98 bound to package[1][core:194]
[inst-e6-nps4:16795] Rank 99 bound to package[1][core:195]
[inst-e6-nps4:16795] Rank 100 bound to package[1][core:200]
[inst-e6-nps4:16795] Rank 101 bound to package[1][core:201]
[inst-e6-nps4:16795] Rank 102 bound to package[1][core:202]
[inst-e6-nps4:16795] Rank 103 bound to package[1][core:203]
[inst-e6-nps4:16795] Rank 104 bound to package[1][core:208]
[inst-e6-nps4:16795] Rank 105 bound to package[1][core:209]
[inst-e6-nps4:16795] Rank 106 bound to package[1][core:210]
[inst-e6-nps4:16795] Rank 107 bound to package[1][core:211]
[inst-e6-nps4:16795] Rank 108 bound to package[1][core:216]
[inst-e6-nps4:16795] Rank 109 bound to package[1][core:217]
[inst-e6-nps4:16795] Rank 110 bound to package[1][core:218]
[inst-e6-nps4:16795] Rank 111 bound to package[1][core:219]
[inst-e6-nps4:16795] Rank 112 bound to package[1][core:224]
[inst-e6-nps4:16795] Rank 113 bound to package[1][core:225]
[inst-e6-nps4:16795] Rank 114 bound to package[1][core:226]
[inst-e6-nps4:16795] Rank 115 bound to package[1][core:227]
[inst-e6-nps4:16795] Rank 116 bound to package[1][core:232]
[inst-e6-nps4:16795] Rank 117 bound to package[1][core:233]
[inst-e6-nps4:16795] Rank 118 bound to package[1][core:234]
[inst-e6-nps4:16795] Rank 119 bound to package[1][core:235]
[inst-e6-nps4:16795] Rank 120 bound to package[1][core:240]
[inst-e6-nps4:16795] Rank 121 bound to package[1][core:241]
[inst-e6-nps4:16795] Rank 122 bound to package[1][core:242]
[inst-e6-nps4:16795] Rank 123 bound to package[1][core:243]
[inst-e6-nps4:16795] Rank 124 bound to package[1][core:248]
[inst-e6-nps4:16795] Rank 125 bound to package[1][core:249]
[inst-e6-nps4:16795] Rank 126 bound to package[1][core:250]
[inst-e6-nps4:16795] Rank 127 bound to package[1][core:251]
$
```

[No.17]

```sh
$ mpirun -n 128 --bind-to core --map-by ppr:4:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps4:16947] Rank 0 bound to package[0][core:0]
[inst-e6-nps4:16947] Rank 1 bound to package[0][core:8]
[inst-e6-nps4:16947] Rank 2 bound to package[0][core:16]
[inst-e6-nps4:16947] Rank 3 bound to package[0][core:24]
[inst-e6-nps4:16947] Rank 4 bound to package[0][core:32]
[inst-e6-nps4:16947] Rank 5 bound to package[0][core:40]
[inst-e6-nps4:16947] Rank 6 bound to package[0][core:48]
[inst-e6-nps4:16947] Rank 7 bound to package[0][core:56]
[inst-e6-nps4:16947] Rank 8 bound to package[0][core:64]
[inst-e6-nps4:16947] Rank 9 bound to package[0][core:72]
[inst-e6-nps4:16947] Rank 10 bound to package[0][core:80]
[inst-e6-nps4:16947] Rank 11 bound to package[0][core:88]
[inst-e6-nps4:16947] Rank 12 bound to package[0][core:96]
[inst-e6-nps4:16947] Rank 13 bound to package[0][core:104]
[inst-e6-nps4:16947] Rank 14 bound to package[0][core:112]
[inst-e6-nps4:16947] Rank 15 bound to package[0][core:120]
[inst-e6-nps4:16947] Rank 16 bound to package[1][core:128]
[inst-e6-nps4:16947] Rank 17 bound to package[1][core:136]
[inst-e6-nps4:16947] Rank 18 bound to package[1][core:144]
[inst-e6-nps4:16947] Rank 19 bound to package[1][core:152]
[inst-e6-nps4:16947] Rank 20 bound to package[1][core:160]
[inst-e6-nps4:16947] Rank 21 bound to package[1][core:168]
[inst-e6-nps4:16947] Rank 22 bound to package[1][core:176]
[inst-e6-nps4:16947] Rank 23 bound to package[1][core:184]
[inst-e6-nps4:16947] Rank 24 bound to package[1][core:192]
[inst-e6-nps4:16947] Rank 25 bound to package[1][core:200]
[inst-e6-nps4:16947] Rank 26 bound to package[1][core:208]
[inst-e6-nps4:16947] Rank 27 bound to package[1][core:216]
[inst-e6-nps4:16947] Rank 28 bound to package[1][core:224]
[inst-e6-nps4:16947] Rank 29 bound to package[1][core:232]
[inst-e6-nps4:16947] Rank 30 bound to package[1][core:240]
[inst-e6-nps4:16947] Rank 31 bound to package[1][core:248]
[inst-e6-nps4:16947] Rank 32 bound to package[0][core:1]
[inst-e6-nps4:16947] Rank 33 bound to package[0][core:9]
[inst-e6-nps4:16947] Rank 34 bound to package[0][core:17]
[inst-e6-nps4:16947] Rank 35 bound to package[0][core:25]
[inst-e6-nps4:16947] Rank 36 bound to package[0][core:33]
[inst-e6-nps4:16947] Rank 37 bound to package[0][core:41]
[inst-e6-nps4:16947] Rank 38 bound to package[0][core:49]
[inst-e6-nps4:16947] Rank 39 bound to package[0][core:57]
[inst-e6-nps4:16947] Rank 40 bound to package[0][core:65]
[inst-e6-nps4:16947] Rank 41 bound to package[0][core:73]
[inst-e6-nps4:16947] Rank 42 bound to package[0][core:81]
[inst-e6-nps4:16947] Rank 43 bound to package[0][core:89]
[inst-e6-nps4:16947] Rank 44 bound to package[0][core:97]
[inst-e6-nps4:16947] Rank 45 bound to package[0][core:105]
[inst-e6-nps4:16947] Rank 46 bound to package[0][core:113]
[inst-e6-nps4:16947] Rank 47 bound to package[0][core:121]
[inst-e6-nps4:16947] Rank 48 bound to package[1][core:129]
[inst-e6-nps4:16947] Rank 49 bound to package[1][core:137]
[inst-e6-nps4:16947] Rank 50 bound to package[1][core:145]
[inst-e6-nps4:16947] Rank 51 bound to package[1][core:153]
[inst-e6-nps4:16947] Rank 52 bound to package[1][core:161]
[inst-e6-nps4:16947] Rank 53 bound to package[1][core:169]
[inst-e6-nps4:16947] Rank 54 bound to package[1][core:177]
[inst-e6-nps4:16947] Rank 55 bound to package[1][core:185]
[inst-e6-nps4:16947] Rank 56 bound to package[1][core:193]
[inst-e6-nps4:16947] Rank 57 bound to package[1][core:201]
[inst-e6-nps4:16947] Rank 58 bound to package[1][core:209]
[inst-e6-nps4:16947] Rank 59 bound to package[1][core:217]
[inst-e6-nps4:16947] Rank 60 bound to package[1][core:225]
[inst-e6-nps4:16947] Rank 61 bound to package[1][core:233]
[inst-e6-nps4:16947] Rank 62 bound to package[1][core:241]
[inst-e6-nps4:16947] Rank 63 bound to package[1][core:249]
[inst-e6-nps4:16947] Rank 64 bound to package[0][core:2]
[inst-e6-nps4:16947] Rank 65 bound to package[0][core:10]
[inst-e6-nps4:16947] Rank 66 bound to package[0][core:18]
[inst-e6-nps4:16947] Rank 67 bound to package[0][core:26]
[inst-e6-nps4:16947] Rank 68 bound to package[0][core:34]
[inst-e6-nps4:16947] Rank 69 bound to package[0][core:42]
[inst-e6-nps4:16947] Rank 70 bound to package[0][core:50]
[inst-e6-nps4:16947] Rank 71 bound to package[0][core:58]
[inst-e6-nps4:16947] Rank 72 bound to package[0][core:66]
[inst-e6-nps4:16947] Rank 73 bound to package[0][core:74]
[inst-e6-nps4:16947] Rank 74 bound to package[0][core:82]
[inst-e6-nps4:16947] Rank 75 bound to package[0][core:90]
[inst-e6-nps4:16947] Rank 76 bound to package[0][core:98]
[inst-e6-nps4:16947] Rank 77 bound to package[0][core:106]
[inst-e6-nps4:16947] Rank 78 bound to package[0][core:114]
[inst-e6-nps4:16947] Rank 79 bound to package[0][core:122]
[inst-e6-nps4:16947] Rank 80 bound to package[1][core:130]
[inst-e6-nps4:16947] Rank 81 bound to package[1][core:138]
[inst-e6-nps4:16947] Rank 82 bound to package[1][core:146]
[inst-e6-nps4:16947] Rank 83 bound to package[1][core:154]
[inst-e6-nps4:16947] Rank 84 bound to package[1][core:162]
[inst-e6-nps4:16947] Rank 85 bound to package[1][core:170]
[inst-e6-nps4:16947] Rank 86 bound to package[1][core:178]
[inst-e6-nps4:16947] Rank 87 bound to package[1][core:186]
[inst-e6-nps4:16947] Rank 88 bound to package[1][core:194]
[inst-e6-nps4:16947] Rank 89 bound to package[1][core:202]
[inst-e6-nps4:16947] Rank 90 bound to package[1][core:210]
[inst-e6-nps4:16947] Rank 91 bound to package[1][core:218]
[inst-e6-nps4:16947] Rank 92 bound to package[1][core:226]
[inst-e6-nps4:16947] Rank 93 bound to package[1][core:234]
[inst-e6-nps4:16947] Rank 94 bound to package[1][core:242]
[inst-e6-nps4:16947] Rank 95 bound to package[1][core:250]
[inst-e6-nps4:16947] Rank 96 bound to package[0][core:3]
[inst-e6-nps4:16947] Rank 97 bound to package[0][core:11]
[inst-e6-nps4:16947] Rank 98 bound to package[0][core:19]
[inst-e6-nps4:16947] Rank 99 bound to package[0][core:27]
[inst-e6-nps4:16947] Rank 100 bound to package[0][core:35]
[inst-e6-nps4:16947] Rank 101 bound to package[0][core:43]
[inst-e6-nps4:16947] Rank 102 bound to package[0][core:51]
[inst-e6-nps4:16947] Rank 103 bound to package[0][core:59]
[inst-e6-nps4:16947] Rank 104 bound to package[0][core:67]
[inst-e6-nps4:16947] Rank 105 bound to package[0][core:75]
[inst-e6-nps4:16947] Rank 106 bound to package[0][core:83]
[inst-e6-nps4:16947] Rank 107 bound to package[0][core:91]
[inst-e6-nps4:16947] Rank 108 bound to package[0][core:99]
[inst-e6-nps4:16947] Rank 109 bound to package[0][core:107]
[inst-e6-nps4:16947] Rank 110 bound to package[0][core:115]
[inst-e6-nps4:16947] Rank 111 bound to package[0][core:123]
[inst-e6-nps4:16947] Rank 112 bound to package[1][core:131]
[inst-e6-nps4:16947] Rank 113 bound to package[1][core:139]
[inst-e6-nps4:16947] Rank 114 bound to package[1][core:147]
[inst-e6-nps4:16947] Rank 115 bound to package[1][core:155]
[inst-e6-nps4:16947] Rank 116 bound to package[1][core:163]
[inst-e6-nps4:16947] Rank 117 bound to package[1][core:171]
[inst-e6-nps4:16947] Rank 118 bound to package[1][core:179]
[inst-e6-nps4:16947] Rank 119 bound to package[1][core:187]
[inst-e6-nps4:16947] Rank 120 bound to package[1][core:195]
[inst-e6-nps4:16947] Rank 121 bound to package[1][core:203]
[inst-e6-nps4:16947] Rank 122 bound to package[1][core:211]
[inst-e6-nps4:16947] Rank 123 bound to package[1][core:219]
[inst-e6-nps4:16947] Rank 124 bound to package[1][core:227]
[inst-e6-nps4:16947] Rank 125 bound to package[1][core:235]
[inst-e6-nps4:16947] Rank 126 bound to package[1][core:243]
[inst-e6-nps4:16947] Rank 127 bound to package[1][core:251]
$
```

[No.18]

```sh
$ mpirun -n 256 --bind-to core --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps4:17102] Rank 0 bound to package[0][core:0]
[inst-e6-nps4:17102] Rank 1 bound to package[0][core:1]
[inst-e6-nps4:17102] Rank 2 bound to package[0][core:2]
[inst-e6-nps4:17102] Rank 3 bound to package[0][core:3]
[inst-e6-nps4:17102] Rank 4 bound to package[0][core:4]
[inst-e6-nps4:17102] Rank 5 bound to package[0][core:5]
[inst-e6-nps4:17102] Rank 6 bound to package[0][core:6]
[inst-e6-nps4:17102] Rank 7 bound to package[0][core:7]
[inst-e6-nps4:17102] Rank 8 bound to package[0][core:8]
[inst-e6-nps4:17102] Rank 9 bound to package[0][core:9]
[inst-e6-nps4:17102] Rank 10 bound to package[0][core:10]
[inst-e6-nps4:17102] Rank 11 bound to package[0][core:11]
[inst-e6-nps4:17102] Rank 12 bound to package[0][core:12]
[inst-e6-nps4:17102] Rank 13 bound to package[0][core:13]
[inst-e6-nps4:17102] Rank 14 bound to package[0][core:14]
[inst-e6-nps4:17102] Rank 15 bound to package[0][core:15]
[inst-e6-nps4:17102] Rank 16 bound to package[0][core:16]
[inst-e6-nps4:17102] Rank 17 bound to package[0][core:17]
[inst-e6-nps4:17102] Rank 18 bound to package[0][core:18]
[inst-e6-nps4:17102] Rank 19 bound to package[0][core:19]
[inst-e6-nps4:17102] Rank 20 bound to package[0][core:20]
[inst-e6-nps4:17102] Rank 21 bound to package[0][core:21]
[inst-e6-nps4:17102] Rank 22 bound to package[0][core:22]
[inst-e6-nps4:17102] Rank 23 bound to package[0][core:23]
[inst-e6-nps4:17102] Rank 24 bound to package[0][core:24]
[inst-e6-nps4:17102] Rank 25 bound to package[0][core:25]
[inst-e6-nps4:17102] Rank 26 bound to package[0][core:26]
[inst-e6-nps4:17102] Rank 27 bound to package[0][core:27]
[inst-e6-nps4:17102] Rank 28 bound to package[0][core:28]
[inst-e6-nps4:17102] Rank 29 bound to package[0][core:29]
[inst-e6-nps4:17102] Rank 30 bound to package[0][core:30]
[inst-e6-nps4:17102] Rank 31 bound to package[0][core:31]
[inst-e6-nps4:17102] Rank 32 bound to package[0][core:32]
[inst-e6-nps4:17102] Rank 33 bound to package[0][core:33]
[inst-e6-nps4:17102] Rank 34 bound to package[0][core:34]
[inst-e6-nps4:17102] Rank 35 bound to package[0][core:35]
[inst-e6-nps4:17102] Rank 36 bound to package[0][core:36]
[inst-e6-nps4:17102] Rank 37 bound to package[0][core:37]
[inst-e6-nps4:17102] Rank 38 bound to package[0][core:38]
[inst-e6-nps4:17102] Rank 39 bound to package[0][core:39]
[inst-e6-nps4:17102] Rank 40 bound to package[0][core:40]
[inst-e6-nps4:17102] Rank 41 bound to package[0][core:41]
[inst-e6-nps4:17102] Rank 42 bound to package[0][core:42]
[inst-e6-nps4:17102] Rank 43 bound to package[0][core:43]
[inst-e6-nps4:17102] Rank 44 bound to package[0][core:44]
[inst-e6-nps4:17102] Rank 45 bound to package[0][core:45]
[inst-e6-nps4:17102] Rank 46 bound to package[0][core:46]
[inst-e6-nps4:17102] Rank 47 bound to package[0][core:47]
[inst-e6-nps4:17102] Rank 48 bound to package[0][core:48]
[inst-e6-nps4:17102] Rank 49 bound to package[0][core:49]
[inst-e6-nps4:17102] Rank 50 bound to package[0][core:50]
[inst-e6-nps4:17102] Rank 51 bound to package[0][core:51]
[inst-e6-nps4:17102] Rank 52 bound to package[0][core:52]
[inst-e6-nps4:17102] Rank 53 bound to package[0][core:53]
[inst-e6-nps4:17102] Rank 54 bound to package[0][core:54]
[inst-e6-nps4:17102] Rank 55 bound to package[0][core:55]
[inst-e6-nps4:17102] Rank 56 bound to package[0][core:56]
[inst-e6-nps4:17102] Rank 57 bound to package[0][core:57]
[inst-e6-nps4:17102] Rank 58 bound to package[0][core:58]
[inst-e6-nps4:17102] Rank 59 bound to package[0][core:59]
[inst-e6-nps4:17102] Rank 60 bound to package[0][core:60]
[inst-e6-nps4:17102] Rank 61 bound to package[0][core:61]
[inst-e6-nps4:17102] Rank 62 bound to package[0][core:62]
[inst-e6-nps4:17102] Rank 63 bound to package[0][core:63]
[inst-e6-nps4:17102] Rank 64 bound to package[0][core:64]
[inst-e6-nps4:17102] Rank 65 bound to package[0][core:65]
[inst-e6-nps4:17102] Rank 66 bound to package[0][core:66]
[inst-e6-nps4:17102] Rank 67 bound to package[0][core:67]
[inst-e6-nps4:17102] Rank 68 bound to package[0][core:68]
[inst-e6-nps4:17102] Rank 69 bound to package[0][core:69]
[inst-e6-nps4:17102] Rank 70 bound to package[0][core:70]
[inst-e6-nps4:17102] Rank 71 bound to package[0][core:71]
[inst-e6-nps4:17102] Rank 72 bound to package[0][core:72]
[inst-e6-nps4:17102] Rank 73 bound to package[0][core:73]
[inst-e6-nps4:17102] Rank 74 bound to package[0][core:74]
[inst-e6-nps4:17102] Rank 75 bound to package[0][core:75]
[inst-e6-nps4:17102] Rank 76 bound to package[0][core:76]
[inst-e6-nps4:17102] Rank 77 bound to package[0][core:77]
[inst-e6-nps4:17102] Rank 78 bound to package[0][core:78]
[inst-e6-nps4:17102] Rank 79 bound to package[0][core:79]
[inst-e6-nps4:17102] Rank 80 bound to package[0][core:80]
[inst-e6-nps4:17102] Rank 81 bound to package[0][core:81]
[inst-e6-nps4:17102] Rank 82 bound to package[0][core:82]
[inst-e6-nps4:17102] Rank 83 bound to package[0][core:83]
[inst-e6-nps4:17102] Rank 84 bound to package[0][core:84]
[inst-e6-nps4:17102] Rank 85 bound to package[0][core:85]
[inst-e6-nps4:17102] Rank 86 bound to package[0][core:86]
[inst-e6-nps4:17102] Rank 87 bound to package[0][core:87]
[inst-e6-nps4:17102] Rank 88 bound to package[0][core:88]
[inst-e6-nps4:17102] Rank 89 bound to package[0][core:89]
[inst-e6-nps4:17102] Rank 90 bound to package[0][core:90]
[inst-e6-nps4:17102] Rank 91 bound to package[0][core:91]
[inst-e6-nps4:17102] Rank 92 bound to package[0][core:92]
[inst-e6-nps4:17102] Rank 93 bound to package[0][core:93]
[inst-e6-nps4:17102] Rank 94 bound to package[0][core:94]
[inst-e6-nps4:17102] Rank 95 bound to package[0][core:95]
[inst-e6-nps4:17102] Rank 96 bound to package[0][core:96]
[inst-e6-nps4:17102] Rank 97 bound to package[0][core:97]
[inst-e6-nps4:17102] Rank 98 bound to package[0][core:98]
[inst-e6-nps4:17102] Rank 99 bound to package[0][core:99]
[inst-e6-nps4:17102] Rank 100 bound to package[0][core:100]
[inst-e6-nps4:17102] Rank 101 bound to package[0][core:101]
[inst-e6-nps4:17102] Rank 102 bound to package[0][core:102]
[inst-e6-nps4:17102] Rank 103 bound to package[0][core:103]
[inst-e6-nps4:17102] Rank 104 bound to package[0][core:104]
[inst-e6-nps4:17102] Rank 105 bound to package[0][core:105]
[inst-e6-nps4:17102] Rank 106 bound to package[0][core:106]
[inst-e6-nps4:17102] Rank 107 bound to package[0][core:107]
[inst-e6-nps4:17102] Rank 108 bound to package[0][core:108]
[inst-e6-nps4:17102] Rank 109 bound to package[0][core:109]
[inst-e6-nps4:17102] Rank 110 bound to package[0][core:110]
[inst-e6-nps4:17102] Rank 111 bound to package[0][core:111]
[inst-e6-nps4:17102] Rank 112 bound to package[0][core:112]
[inst-e6-nps4:17102] Rank 113 bound to package[0][core:113]
[inst-e6-nps4:17102] Rank 114 bound to package[0][core:114]
[inst-e6-nps4:17102] Rank 115 bound to package[0][core:115]
[inst-e6-nps4:17102] Rank 116 bound to package[0][core:116]
[inst-e6-nps4:17102] Rank 117 bound to package[0][core:117]
[inst-e6-nps4:17102] Rank 118 bound to package[0][core:118]
[inst-e6-nps4:17102] Rank 119 bound to package[0][core:119]
[inst-e6-nps4:17102] Rank 120 bound to package[0][core:120]
[inst-e6-nps4:17102] Rank 121 bound to package[0][core:121]
[inst-e6-nps4:17102] Rank 122 bound to package[0][core:122]
[inst-e6-nps4:17102] Rank 123 bound to package[0][core:123]
[inst-e6-nps4:17102] Rank 124 bound to package[0][core:124]
[inst-e6-nps4:17102] Rank 125 bound to package[0][core:125]
[inst-e6-nps4:17102] Rank 126 bound to package[0][core:126]
[inst-e6-nps4:17102] Rank 127 bound to package[0][core:127]
[inst-e6-nps4:17102] Rank 128 bound to package[1][core:128]
[inst-e6-nps4:17102] Rank 129 bound to package[1][core:129]
[inst-e6-nps4:17102] Rank 130 bound to package[1][core:130]
[inst-e6-nps4:17102] Rank 131 bound to package[1][core:131]
[inst-e6-nps4:17102] Rank 132 bound to package[1][core:132]
[inst-e6-nps4:17102] Rank 133 bound to package[1][core:133]
[inst-e6-nps4:17102] Rank 134 bound to package[1][core:134]
[inst-e6-nps4:17102] Rank 135 bound to package[1][core:135]
[inst-e6-nps4:17102] Rank 136 bound to package[1][core:136]
[inst-e6-nps4:17102] Rank 137 bound to package[1][core:137]
[inst-e6-nps4:17102] Rank 138 bound to package[1][core:138]
[inst-e6-nps4:17102] Rank 139 bound to package[1][core:139]
[inst-e6-nps4:17102] Rank 140 bound to package[1][core:140]
[inst-e6-nps4:17102] Rank 141 bound to package[1][core:141]
[inst-e6-nps4:17102] Rank 142 bound to package[1][core:142]
[inst-e6-nps4:17102] Rank 143 bound to package[1][core:143]
[inst-e6-nps4:17102] Rank 144 bound to package[1][core:144]
[inst-e6-nps4:17102] Rank 145 bound to package[1][core:145]
[inst-e6-nps4:17102] Rank 146 bound to package[1][core:146]
[inst-e6-nps4:17102] Rank 147 bound to package[1][core:147]
[inst-e6-nps4:17102] Rank 148 bound to package[1][core:148]
[inst-e6-nps4:17102] Rank 149 bound to package[1][core:149]
[inst-e6-nps4:17102] Rank 150 bound to package[1][core:150]
[inst-e6-nps4:17102] Rank 151 bound to package[1][core:151]
[inst-e6-nps4:17102] Rank 152 bound to package[1][core:152]
[inst-e6-nps4:17102] Rank 153 bound to package[1][core:153]
[inst-e6-nps4:17102] Rank 154 bound to package[1][core:154]
[inst-e6-nps4:17102] Rank 155 bound to package[1][core:155]
[inst-e6-nps4:17102] Rank 156 bound to package[1][core:156]
[inst-e6-nps4:17102] Rank 157 bound to package[1][core:157]
[inst-e6-nps4:17102] Rank 158 bound to package[1][core:158]
[inst-e6-nps4:17102] Rank 159 bound to package[1][core:159]
[inst-e6-nps4:17102] Rank 160 bound to package[1][core:160]
[inst-e6-nps4:17102] Rank 161 bound to package[1][core:161]
[inst-e6-nps4:17102] Rank 162 bound to package[1][core:162]
[inst-e6-nps4:17102] Rank 163 bound to package[1][core:163]
[inst-e6-nps4:17102] Rank 164 bound to package[1][core:164]
[inst-e6-nps4:17102] Rank 165 bound to package[1][core:165]
[inst-e6-nps4:17102] Rank 166 bound to package[1][core:166]
[inst-e6-nps4:17102] Rank 167 bound to package[1][core:167]
[inst-e6-nps4:17102] Rank 168 bound to package[1][core:168]
[inst-e6-nps4:17102] Rank 169 bound to package[1][core:169]
[inst-e6-nps4:17102] Rank 170 bound to package[1][core:170]
[inst-e6-nps4:17102] Rank 171 bound to package[1][core:171]
[inst-e6-nps4:17102] Rank 172 bound to package[1][core:172]
[inst-e6-nps4:17102] Rank 173 bound to package[1][core:173]
[inst-e6-nps4:17102] Rank 174 bound to package[1][core:174]
[inst-e6-nps4:17102] Rank 175 bound to package[1][core:175]
[inst-e6-nps4:17102] Rank 176 bound to package[1][core:176]
[inst-e6-nps4:17102] Rank 177 bound to package[1][core:177]
[inst-e6-nps4:17102] Rank 178 bound to package[1][core:178]
[inst-e6-nps4:17102] Rank 179 bound to package[1][core:179]
[inst-e6-nps4:17102] Rank 180 bound to package[1][core:180]
[inst-e6-nps4:17102] Rank 181 bound to package[1][core:181]
[inst-e6-nps4:17102] Rank 182 bound to package[1][core:182]
[inst-e6-nps4:17102] Rank 183 bound to package[1][core:183]
[inst-e6-nps4:17102] Rank 184 bound to package[1][core:184]
[inst-e6-nps4:17102] Rank 185 bound to package[1][core:185]
[inst-e6-nps4:17102] Rank 186 bound to package[1][core:186]
[inst-e6-nps4:17102] Rank 187 bound to package[1][core:187]
[inst-e6-nps4:17102] Rank 188 bound to package[1][core:188]
[inst-e6-nps4:17102] Rank 189 bound to package[1][core:189]
[inst-e6-nps4:17102] Rank 190 bound to package[1][core:190]
[inst-e6-nps4:17102] Rank 191 bound to package[1][core:191]
[inst-e6-nps4:17102] Rank 192 bound to package[1][core:192]
[inst-e6-nps4:17102] Rank 193 bound to package[1][core:193]
[inst-e6-nps4:17102] Rank 194 bound to package[1][core:194]
[inst-e6-nps4:17102] Rank 195 bound to package[1][core:195]
[inst-e6-nps4:17102] Rank 196 bound to package[1][core:196]
[inst-e6-nps4:17102] Rank 197 bound to package[1][core:197]
[inst-e6-nps4:17102] Rank 198 bound to package[1][core:198]
[inst-e6-nps4:17102] Rank 199 bound to package[1][core:199]
[inst-e6-nps4:17102] Rank 200 bound to package[1][core:200]
[inst-e6-nps4:17102] Rank 201 bound to package[1][core:201]
[inst-e6-nps4:17102] Rank 202 bound to package[1][core:202]
[inst-e6-nps4:17102] Rank 203 bound to package[1][core:203]
[inst-e6-nps4:17102] Rank 204 bound to package[1][core:204]
[inst-e6-nps4:17102] Rank 205 bound to package[1][core:205]
[inst-e6-nps4:17102] Rank 206 bound to package[1][core:206]
[inst-e6-nps4:17102] Rank 207 bound to package[1][core:207]
[inst-e6-nps4:17102] Rank 208 bound to package[1][core:208]
[inst-e6-nps4:17102] Rank 209 bound to package[1][core:209]
[inst-e6-nps4:17102] Rank 210 bound to package[1][core:210]
[inst-e6-nps4:17102] Rank 211 bound to package[1][core:211]
[inst-e6-nps4:17102] Rank 212 bound to package[1][core:212]
[inst-e6-nps4:17102] Rank 213 bound to package[1][core:213]
[inst-e6-nps4:17102] Rank 214 bound to package[1][core:214]
[inst-e6-nps4:17102] Rank 215 bound to package[1][core:215]
[inst-e6-nps4:17102] Rank 216 bound to package[1][core:216]
[inst-e6-nps4:17102] Rank 217 bound to package[1][core:217]
[inst-e6-nps4:17102] Rank 218 bound to package[1][core:218]
[inst-e6-nps4:17102] Rank 219 bound to package[1][core:219]
[inst-e6-nps4:17102] Rank 220 bound to package[1][core:220]
[inst-e6-nps4:17102] Rank 221 bound to package[1][core:221]
[inst-e6-nps4:17102] Rank 222 bound to package[1][core:222]
[inst-e6-nps4:17102] Rank 223 bound to package[1][core:223]
[inst-e6-nps4:17102] Rank 224 bound to package[1][core:224]
[inst-e6-nps4:17102] Rank 225 bound to package[1][core:225]
[inst-e6-nps4:17102] Rank 226 bound to package[1][core:226]
[inst-e6-nps4:17102] Rank 227 bound to package[1][core:227]
[inst-e6-nps4:17102] Rank 228 bound to package[1][core:228]
[inst-e6-nps4:17102] Rank 229 bound to package[1][core:229]
[inst-e6-nps4:17102] Rank 230 bound to package[1][core:230]
[inst-e6-nps4:17102] Rank 231 bound to package[1][core:231]
[inst-e6-nps4:17102] Rank 232 bound to package[1][core:232]
[inst-e6-nps4:17102] Rank 233 bound to package[1][core:233]
[inst-e6-nps4:17102] Rank 234 bound to package[1][core:234]
[inst-e6-nps4:17102] Rank 235 bound to package[1][core:235]
[inst-e6-nps4:17102] Rank 236 bound to package[1][core:236]
[inst-e6-nps4:17102] Rank 237 bound to package[1][core:237]
[inst-e6-nps4:17102] Rank 238 bound to package[1][core:238]
[inst-e6-nps4:17102] Rank 239 bound to package[1][core:239]
[inst-e6-nps4:17102] Rank 240 bound to package[1][core:240]
[inst-e6-nps4:17102] Rank 241 bound to package[1][core:241]
[inst-e6-nps4:17102] Rank 242 bound to package[1][core:242]
[inst-e6-nps4:17102] Rank 243 bound to package[1][core:243]
[inst-e6-nps4:17102] Rank 244 bound to package[1][core:244]
[inst-e6-nps4:17102] Rank 245 bound to package[1][core:245]
[inst-e6-nps4:17102] Rank 246 bound to package[1][core:246]
[inst-e6-nps4:17102] Rank 247 bound to package[1][core:247]
[inst-e6-nps4:17102] Rank 248 bound to package[1][core:248]
[inst-e6-nps4:17102] Rank 249 bound to package[1][core:249]
[inst-e6-nps4:17102] Rank 250 bound to package[1][core:250]
[inst-e6-nps4:17102] Rank 251 bound to package[1][core:251]
[inst-e6-nps4:17102] Rank 252 bound to package[1][core:252]
[inst-e6-nps4:17102] Rank 253 bound to package[1][core:253]
[inst-e6-nps4:17102] Rank 254 bound to package[1][core:254]
[inst-e6-nps4:17102] Rank 255 bound to package[1][core:255]
$
```

[No.19]

```sh
$ mpirun -n 256 --bind-to core --map-by ppr:8:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e6-nps4:17378] Rank 0 bound to package[0][core:0]
[inst-e6-nps4:17378] Rank 1 bound to package[0][core:8]
[inst-e6-nps4:17378] Rank 2 bound to package[0][core:16]
[inst-e6-nps4:17378] Rank 3 bound to package[0][core:24]
[inst-e6-nps4:17378] Rank 4 bound to package[0][core:32]
[inst-e6-nps4:17378] Rank 5 bound to package[0][core:40]
[inst-e6-nps4:17378] Rank 6 bound to package[0][core:48]
[inst-e6-nps4:17378] Rank 7 bound to package[0][core:56]
[inst-e6-nps4:17378] Rank 8 bound to package[0][core:64]
[inst-e6-nps4:17378] Rank 9 bound to package[0][core:72]
[inst-e6-nps4:17378] Rank 10 bound to package[0][core:80]
[inst-e6-nps4:17378] Rank 11 bound to package[0][core:88]
[inst-e6-nps4:17378] Rank 12 bound to package[0][core:96]
[inst-e6-nps4:17378] Rank 13 bound to package[0][core:104]
[inst-e6-nps4:17378] Rank 14 bound to package[0][core:112]
[inst-e6-nps4:17378] Rank 15 bound to package[0][core:120]
[inst-e6-nps4:17378] Rank 16 bound to package[1][core:128]
[inst-e6-nps4:17378] Rank 17 bound to package[1][core:136]
[inst-e6-nps4:17378] Rank 18 bound to package[1][core:144]
[inst-e6-nps4:17378] Rank 19 bound to package[1][core:152]
[inst-e6-nps4:17378] Rank 20 bound to package[1][core:160]
[inst-e6-nps4:17378] Rank 21 bound to package[1][core:168]
[inst-e6-nps4:17378] Rank 22 bound to package[1][core:176]
[inst-e6-nps4:17378] Rank 23 bound to package[1][core:184]
[inst-e6-nps4:17378] Rank 24 bound to package[1][core:192]
[inst-e6-nps4:17378] Rank 25 bound to package[1][core:200]
[inst-e6-nps4:17378] Rank 26 bound to package[1][core:208]
[inst-e6-nps4:17378] Rank 27 bound to package[1][core:216]
[inst-e6-nps4:17378] Rank 28 bound to package[1][core:224]
[inst-e6-nps4:17378] Rank 29 bound to package[1][core:232]
[inst-e6-nps4:17378] Rank 30 bound to package[1][core:240]
[inst-e6-nps4:17378] Rank 31 bound to package[1][core:248]
[inst-e6-nps4:17378] Rank 32 bound to package[0][core:1]
[inst-e6-nps4:17378] Rank 33 bound to package[0][core:9]
[inst-e6-nps4:17378] Rank 34 bound to package[0][core:17]
[inst-e6-nps4:17378] Rank 35 bound to package[0][core:25]
[inst-e6-nps4:17378] Rank 36 bound to package[0][core:33]
[inst-e6-nps4:17378] Rank 37 bound to package[0][core:41]
[inst-e6-nps4:17378] Rank 38 bound to package[0][core:49]
[inst-e6-nps4:17378] Rank 39 bound to package[0][core:57]
[inst-e6-nps4:17378] Rank 40 bound to package[0][core:65]
[inst-e6-nps4:17378] Rank 41 bound to package[0][core:73]
[inst-e6-nps4:17378] Rank 42 bound to package[0][core:81]
[inst-e6-nps4:17378] Rank 43 bound to package[0][core:89]
[inst-e6-nps4:17378] Rank 44 bound to package[0][core:97]
[inst-e6-nps4:17378] Rank 45 bound to package[0][core:105]
[inst-e6-nps4:17378] Rank 46 bound to package[0][core:113]
[inst-e6-nps4:17378] Rank 47 bound to package[0][core:121]
[inst-e6-nps4:17378] Rank 48 bound to package[1][core:129]
[inst-e6-nps4:17378] Rank 49 bound to package[1][core:137]
[inst-e6-nps4:17378] Rank 50 bound to package[1][core:145]
[inst-e6-nps4:17378] Rank 51 bound to package[1][core:153]
[inst-e6-nps4:17378] Rank 52 bound to package[1][core:161]
[inst-e6-nps4:17378] Rank 53 bound to package[1][core:169]
[inst-e6-nps4:17378] Rank 54 bound to package[1][core:177]
[inst-e6-nps4:17378] Rank 55 bound to package[1][core:185]
[inst-e6-nps4:17378] Rank 56 bound to package[1][core:193]
[inst-e6-nps4:17378] Rank 57 bound to package[1][core:201]
[inst-e6-nps4:17378] Rank 58 bound to package[1][core:209]
[inst-e6-nps4:17378] Rank 59 bound to package[1][core:217]
[inst-e6-nps4:17378] Rank 60 bound to package[1][core:225]
[inst-e6-nps4:17378] Rank 61 bound to package[1][core:233]
[inst-e6-nps4:17378] Rank 62 bound to package[1][core:241]
[inst-e6-nps4:17378] Rank 63 bound to package[1][core:249]
[inst-e6-nps4:17378] Rank 64 bound to package[0][core:2]
[inst-e6-nps4:17378] Rank 65 bound to package[0][core:10]
[inst-e6-nps4:17378] Rank 66 bound to package[0][core:18]
[inst-e6-nps4:17378] Rank 67 bound to package[0][core:26]
[inst-e6-nps4:17378] Rank 68 bound to package[0][core:34]
[inst-e6-nps4:17378] Rank 69 bound to package[0][core:42]
[inst-e6-nps4:17378] Rank 70 bound to package[0][core:50]
[inst-e6-nps4:17378] Rank 71 bound to package[0][core:58]
[inst-e6-nps4:17378] Rank 72 bound to package[0][core:66]
[inst-e6-nps4:17378] Rank 73 bound to package[0][core:74]
[inst-e6-nps4:17378] Rank 74 bound to package[0][core:82]
[inst-e6-nps4:17378] Rank 75 bound to package[0][core:90]
[inst-e6-nps4:17378] Rank 76 bound to package[0][core:98]
[inst-e6-nps4:17378] Rank 77 bound to package[0][core:106]
[inst-e6-nps4:17378] Rank 78 bound to package[0][core:114]
[inst-e6-nps4:17378] Rank 79 bound to package[0][core:122]
[inst-e6-nps4:17378] Rank 80 bound to package[1][core:130]
[inst-e6-nps4:17378] Rank 81 bound to package[1][core:138]
[inst-e6-nps4:17378] Rank 82 bound to package[1][core:146]
[inst-e6-nps4:17378] Rank 83 bound to package[1][core:154]
[inst-e6-nps4:17378] Rank 84 bound to package[1][core:162]
[inst-e6-nps4:17378] Rank 85 bound to package[1][core:170]
[inst-e6-nps4:17378] Rank 86 bound to package[1][core:178]
[inst-e6-nps4:17378] Rank 87 bound to package[1][core:186]
[inst-e6-nps4:17378] Rank 88 bound to package[1][core:194]
[inst-e6-nps4:17378] Rank 89 bound to package[1][core:202]
[inst-e6-nps4:17378] Rank 90 bound to package[1][core:210]
[inst-e6-nps4:17378] Rank 91 bound to package[1][core:218]
[inst-e6-nps4:17378] Rank 92 bound to package[1][core:226]
[inst-e6-nps4:17378] Rank 93 bound to package[1][core:234]
[inst-e6-nps4:17378] Rank 94 bound to package[1][core:242]
[inst-e6-nps4:17378] Rank 95 bound to package[1][core:250]
[inst-e6-nps4:17378] Rank 96 bound to package[0][core:3]
[inst-e6-nps4:17378] Rank 97 bound to package[0][core:11]
[inst-e6-nps4:17378] Rank 98 bound to package[0][core:19]
[inst-e6-nps4:17378] Rank 99 bound to package[0][core:27]
[inst-e6-nps4:17378] Rank 100 bound to package[0][core:35]
[inst-e6-nps4:17378] Rank 101 bound to package[0][core:43]
[inst-e6-nps4:17378] Rank 102 bound to package[0][core:51]
[inst-e6-nps4:17378] Rank 103 bound to package[0][core:59]
[inst-e6-nps4:17378] Rank 104 bound to package[0][core:67]
[inst-e6-nps4:17378] Rank 105 bound to package[0][core:75]
[inst-e6-nps4:17378] Rank 106 bound to package[0][core:83]
[inst-e6-nps4:17378] Rank 107 bound to package[0][core:91]
[inst-e6-nps4:17378] Rank 108 bound to package[0][core:99]
[inst-e6-nps4:17378] Rank 109 bound to package[0][core:107]
[inst-e6-nps4:17378] Rank 110 bound to package[0][core:115]
[inst-e6-nps4:17378] Rank 111 bound to package[0][core:123]
[inst-e6-nps4:17378] Rank 112 bound to package[1][core:131]
[inst-e6-nps4:17378] Rank 113 bound to package[1][core:139]
[inst-e6-nps4:17378] Rank 114 bound to package[1][core:147]
[inst-e6-nps4:17378] Rank 115 bound to package[1][core:155]
[inst-e6-nps4:17378] Rank 116 bound to package[1][core:163]
[inst-e6-nps4:17378] Rank 117 bound to package[1][core:171]
[inst-e6-nps4:17378] Rank 118 bound to package[1][core:179]
[inst-e6-nps4:17378] Rank 119 bound to package[1][core:187]
[inst-e6-nps4:17378] Rank 120 bound to package[1][core:195]
[inst-e6-nps4:17378] Rank 121 bound to package[1][core:203]
[inst-e6-nps4:17378] Rank 122 bound to package[1][core:211]
[inst-e6-nps4:17378] Rank 123 bound to package[1][core:219]
[inst-e6-nps4:17378] Rank 124 bound to package[1][core:227]
[inst-e6-nps4:17378] Rank 125 bound to package[1][core:235]
[inst-e6-nps4:17378] Rank 126 bound to package[1][core:243]
[inst-e6-nps4:17378] Rank 127 bound to package[1][core:251]
[inst-e6-nps4:17378] Rank 128 bound to package[0][core:4]
[inst-e6-nps4:17378] Rank 129 bound to package[0][core:12]
[inst-e6-nps4:17378] Rank 130 bound to package[0][core:20]
[inst-e6-nps4:17378] Rank 131 bound to package[0][core:28]
[inst-e6-nps4:17378] Rank 132 bound to package[0][core:36]
[inst-e6-nps4:17378] Rank 133 bound to package[0][core:44]
[inst-e6-nps4:17378] Rank 134 bound to package[0][core:52]
[inst-e6-nps4:17378] Rank 135 bound to package[0][core:60]
[inst-e6-nps4:17378] Rank 136 bound to package[0][core:68]
[inst-e6-nps4:17378] Rank 137 bound to package[0][core:76]
[inst-e6-nps4:17378] Rank 138 bound to package[0][core:84]
[inst-e6-nps4:17378] Rank 139 bound to package[0][core:92]
[inst-e6-nps4:17378] Rank 140 bound to package[0][core:100]
[inst-e6-nps4:17378] Rank 141 bound to package[0][core:108]
[inst-e6-nps4:17378] Rank 142 bound to package[0][core:116]
[inst-e6-nps4:17378] Rank 143 bound to package[0][core:124]
[inst-e6-nps4:17378] Rank 144 bound to package[1][core:132]
[inst-e6-nps4:17378] Rank 145 bound to package[1][core:140]
[inst-e6-nps4:17378] Rank 146 bound to package[1][core:148]
[inst-e6-nps4:17378] Rank 147 bound to package[1][core:156]
[inst-e6-nps4:17378] Rank 148 bound to package[1][core:164]
[inst-e6-nps4:17378] Rank 149 bound to package[1][core:172]
[inst-e6-nps4:17378] Rank 150 bound to package[1][core:180]
[inst-e6-nps4:17378] Rank 151 bound to package[1][core:188]
[inst-e6-nps4:17378] Rank 152 bound to package[1][core:196]
[inst-e6-nps4:17378] Rank 153 bound to package[1][core:204]
[inst-e6-nps4:17378] Rank 154 bound to package[1][core:212]
[inst-e6-nps4:17378] Rank 155 bound to package[1][core:220]
[inst-e6-nps4:17378] Rank 156 bound to package[1][core:228]
[inst-e6-nps4:17378] Rank 157 bound to package[1][core:236]
[inst-e6-nps4:17378] Rank 158 bound to package[1][core:244]
[inst-e6-nps4:17378] Rank 159 bound to package[1][core:252]
[inst-e6-nps4:17378] Rank 160 bound to package[0][core:5]
[inst-e6-nps4:17378] Rank 161 bound to package[0][core:13]
[inst-e6-nps4:17378] Rank 162 bound to package[0][core:21]
[inst-e6-nps4:17378] Rank 163 bound to package[0][core:29]
[inst-e6-nps4:17378] Rank 164 bound to package[0][core:37]
[inst-e6-nps4:17378] Rank 165 bound to package[0][core:45]
[inst-e6-nps4:17378] Rank 166 bound to package[0][core:53]
[inst-e6-nps4:17378] Rank 167 bound to package[0][core:61]
[inst-e6-nps4:17378] Rank 168 bound to package[0][core:69]
[inst-e6-nps4:17378] Rank 169 bound to package[0][core:77]
[inst-e6-nps4:17378] Rank 170 bound to package[0][core:85]
[inst-e6-nps4:17378] Rank 171 bound to package[0][core:93]
[inst-e6-nps4:17378] Rank 172 bound to package[0][core:101]
[inst-e6-nps4:17378] Rank 173 bound to package[0][core:109]
[inst-e6-nps4:17378] Rank 174 bound to package[0][core:117]
[inst-e6-nps4:17378] Rank 175 bound to package[0][core:125]
[inst-e6-nps4:17378] Rank 176 bound to package[1][core:133]
[inst-e6-nps4:17378] Rank 177 bound to package[1][core:141]
[inst-e6-nps4:17378] Rank 178 bound to package[1][core:149]
[inst-e6-nps4:17378] Rank 179 bound to package[1][core:157]
[inst-e6-nps4:17378] Rank 180 bound to package[1][core:165]
[inst-e6-nps4:17378] Rank 181 bound to package[1][core:173]
[inst-e6-nps4:17378] Rank 182 bound to package[1][core:181]
[inst-e6-nps4:17378] Rank 183 bound to package[1][core:189]
[inst-e6-nps4:17378] Rank 184 bound to package[1][core:197]
[inst-e6-nps4:17378] Rank 185 bound to package[1][core:205]
[inst-e6-nps4:17378] Rank 186 bound to package[1][core:213]
[inst-e6-nps4:17378] Rank 187 bound to package[1][core:221]
[inst-e6-nps4:17378] Rank 188 bound to package[1][core:229]
[inst-e6-nps4:17378] Rank 189 bound to package[1][core:237]
[inst-e6-nps4:17378] Rank 190 bound to package[1][core:245]
[inst-e6-nps4:17378] Rank 191 bound to package[1][core:253]
[inst-e6-nps4:17378] Rank 192 bound to package[0][core:6]
[inst-e6-nps4:17378] Rank 193 bound to package[0][core:14]
[inst-e6-nps4:17378] Rank 194 bound to package[0][core:22]
[inst-e6-nps4:17378] Rank 195 bound to package[0][core:30]
[inst-e6-nps4:17378] Rank 196 bound to package[0][core:38]
[inst-e6-nps4:17378] Rank 197 bound to package[0][core:46]
[inst-e6-nps4:17378] Rank 198 bound to package[0][core:54]
[inst-e6-nps4:17378] Rank 199 bound to package[0][core:62]
[inst-e6-nps4:17378] Rank 200 bound to package[0][core:70]
[inst-e6-nps4:17378] Rank 201 bound to package[0][core:78]
[inst-e6-nps4:17378] Rank 202 bound to package[0][core:86]
[inst-e6-nps4:17378] Rank 203 bound to package[0][core:94]
[inst-e6-nps4:17378] Rank 204 bound to package[0][core:102]
[inst-e6-nps4:17378] Rank 205 bound to package[0][core:110]
[inst-e6-nps4:17378] Rank 206 bound to package[0][core:118]
[inst-e6-nps4:17378] Rank 207 bound to package[0][core:126]
[inst-e6-nps4:17378] Rank 208 bound to package[1][core:134]
[inst-e6-nps4:17378] Rank 209 bound to package[1][core:142]
[inst-e6-nps4:17378] Rank 210 bound to package[1][core:150]
[inst-e6-nps4:17378] Rank 211 bound to package[1][core:158]
[inst-e6-nps4:17378] Rank 212 bound to package[1][core:166]
[inst-e6-nps4:17378] Rank 213 bound to package[1][core:174]
[inst-e6-nps4:17378] Rank 214 bound to package[1][core:182]
[inst-e6-nps4:17378] Rank 215 bound to package[1][core:190]
[inst-e6-nps4:17378] Rank 216 bound to package[1][core:198]
[inst-e6-nps4:17378] Rank 217 bound to package[1][core:206]
[inst-e6-nps4:17378] Rank 218 bound to package[1][core:214]
[inst-e6-nps4:17378] Rank 219 bound to package[1][core:222]
[inst-e6-nps4:17378] Rank 220 bound to package[1][core:230]
[inst-e6-nps4:17378] Rank 221 bound to package[1][core:238]
[inst-e6-nps4:17378] Rank 222 bound to package[1][core:246]
[inst-e6-nps4:17378] Rank 223 bound to package[1][core:254]
[inst-e6-nps4:17378] Rank 224 bound to package[0][core:7]
[inst-e6-nps4:17378] Rank 225 bound to package[0][core:15]
[inst-e6-nps4:17378] Rank 226 bound to package[0][core:23]
[inst-e6-nps4:17378] Rank 227 bound to package[0][core:31]
[inst-e6-nps4:17378] Rank 228 bound to package[0][core:39]
[inst-e6-nps4:17378] Rank 229 bound to package[0][core:47]
[inst-e6-nps4:17378] Rank 230 bound to package[0][core:55]
[inst-e6-nps4:17378] Rank 231 bound to package[0][core:63]
[inst-e6-nps4:17378] Rank 232 bound to package[0][core:71]
[inst-e6-nps4:17378] Rank 233 bound to package[0][core:79]
[inst-e6-nps4:17378] Rank 234 bound to package[0][core:87]
[inst-e6-nps4:17378] Rank 235 bound to package[0][core:95]
[inst-e6-nps4:17378] Rank 236 bound to package[0][core:103]
[inst-e6-nps4:17378] Rank 237 bound to package[0][core:111]
[inst-e6-nps4:17378] Rank 238 bound to package[0][core:119]
[inst-e6-nps4:17378] Rank 239 bound to package[0][core:127]
[inst-e6-nps4:17378] Rank 240 bound to package[1][core:135]
[inst-e6-nps4:17378] Rank 241 bound to package[1][core:143]
[inst-e6-nps4:17378] Rank 242 bound to package[1][core:151]
[inst-e6-nps4:17378] Rank 243 bound to package[1][core:159]
[inst-e6-nps4:17378] Rank 244 bound to package[1][core:167]
[inst-e6-nps4:17378] Rank 245 bound to package[1][core:175]
[inst-e6-nps4:17378] Rank 246 bound to package[1][core:183]
[inst-e6-nps4:17378] Rank 247 bound to package[1][core:191]
[inst-e6-nps4:17378] Rank 248 bound to package[1][core:199]
[inst-e6-nps4:17378] Rank 249 bound to package[1][core:207]
[inst-e6-nps4:17378] Rank 250 bound to package[1][core:215]
[inst-e6-nps4:17378] Rank 251 bound to package[1][core:223]
[inst-e6-nps4:17378] Rank 252 bound to package[1][core:231]
[inst-e6-nps4:17378] Rank 253 bound to package[1][core:239]
[inst-e6-nps4:17378] Rank 254 bound to package[1][core:247]
[inst-e6-nps4:17378] Rank 255 bound to package[1][core:255]
$
```

[No.20]

```sh
$ mpirun -n 8 --bind-to core --map-by ppr:1:numa:PE=32 -x OMP_NUM_THREAD=32 -x OMP_PROC_BIND=TRUE bash -c 'sleep $OMPI_COMM_WORLD_RANK; echo "Rank $OMPI_COMM_WORLD_RANK Node `echo $((OMPI_COMM_WORLD_RANK / OMPI_COMM_WORLD_LOCAL_SIZE))`"; ./show_thread_bind | sort -k 2n,2'
Rank 0 Node 0
Thread  0 Core   0
Thread  1 Core   1
Thread  2 Core   2
Thread  3 Core   3
Thread  4 Core   4
Thread  5 Core   5
Thread  6 Core   6
Thread  7 Core   7
Thread  8 Core   8
Thread  9 Core   9
Thread 10 Core  10
Thread 11 Core  11
Thread 12 Core  12
Thread 13 Core  13
Thread 14 Core  14
Thread 15 Core  15
Thread 16 Core  16
Thread 17 Core  17
Thread 18 Core  18
Thread 19 Core  19
Thread 20 Core  20
Thread 21 Core  21
Thread 22 Core  22
Thread 23 Core  23
Thread 24 Core  24
Thread 25 Core  25
Thread 26 Core  26
Thread 27 Core  27
Thread 28 Core  28
Thread 29 Core  29
Thread 30 Core  30
Thread 31 Core  31
Rank 1 Node 0
Thread  0 Core  32
Thread  1 Core  33
Thread  2 Core  34
Thread  3 Core  35
Thread  4 Core  36
Thread  5 Core  37
Thread  6 Core  38
Thread  7 Core  39
Thread  8 Core  40
Thread  9 Core  41
Thread 10 Core  42
Thread 11 Core  43
Thread 12 Core  44
Thread 13 Core  45
Thread 14 Core  46
Thread 15 Core  47
Thread 16 Core  48
Thread 17 Core  49
Thread 18 Core  50
Thread 19 Core  51
Thread 20 Core  52
Thread 21 Core  53
Thread 22 Core  54
Thread 23 Core  55
Thread 24 Core  56
Thread 25 Core  57
Thread 26 Core  58
Thread 27 Core  59
Thread 28 Core  60
Thread 29 Core  61
Thread 30 Core  62
Thread 31 Core  63
Rank 2 Node 0
Thread  0 Core  64
Thread  1 Core  65
Thread  2 Core  66
Thread  3 Core  67
Thread  4 Core  68
Thread  5 Core  69
Thread  6 Core  70
Thread  7 Core  71
Thread  8 Core  72
Thread  9 Core  73
Thread 10 Core  74
Thread 11 Core  75
Thread 12 Core  76
Thread 13 Core  77
Thread 14 Core  78
Thread 15 Core  79
Thread 16 Core  80
Thread 17 Core  81
Thread 18 Core  82
Thread 19 Core  83
Thread 20 Core  84
Thread 21 Core  85
Thread 22 Core  86
Thread 23 Core  87
Thread 24 Core  88
Thread 25 Core  89
Thread 26 Core  90
Thread 27 Core  91
Thread 28 Core  92
Thread 29 Core  93
Thread 30 Core  94
Thread 31 Core  95
Rank 3 Node 0
Thread  0 Core  96
Thread  1 Core  97
Thread  2 Core  98
Thread  3 Core  99
Thread  4 Core 100
Thread  5 Core 101
Thread  6 Core 102
Thread  7 Core 103
Thread  8 Core 104
Thread  9 Core 105
Thread 10 Core 106
Thread 11 Core 107
Thread 12 Core 108
Thread 13 Core 109
Thread 14 Core 110
Thread 15 Core 111
Thread 16 Core 112
Thread 17 Core 113
Thread 18 Core 114
Thread 19 Core 115
Thread 20 Core 116
Thread 21 Core 117
Thread 22 Core 118
Thread 23 Core 119
Thread 24 Core 120
Thread 25 Core 121
Thread 26 Core 122
Thread 27 Core 123
Thread 28 Core 124
Thread 29 Core 125
Thread 30 Core 126
Thread 31 Core 127
Rank 4 Node 0
Thread  0 Core 128
Thread  1 Core 129
Thread  2 Core 130
Thread  3 Core 131
Thread  4 Core 132
Thread  5 Core 133
Thread  6 Core 134
Thread  7 Core 135
Thread  8 Core 136
Thread  9 Core 137
Thread 10 Core 138
Thread 11 Core 139
Thread 12 Core 140
Thread 13 Core 141
Thread 14 Core 142
Thread 15 Core 143
Thread 16 Core 144
Thread 17 Core 145
Thread 18 Core 146
Thread 19 Core 147
Thread 20 Core 148
Thread 21 Core 149
Thread 22 Core 150
Thread 23 Core 151
Thread 24 Core 152
Thread 25 Core 153
Thread 26 Core 154
Thread 27 Core 155
Thread 28 Core 156
Thread 29 Core 157
Thread 30 Core 158
Thread 31 Core 159
Rank 5 Node 0
Thread  0 Core 160
Thread  1 Core 161
Thread  2 Core 162
Thread  3 Core 163
Thread  4 Core 164
Thread  5 Core 165
Thread  6 Core 166
Thread  7 Core 167
Thread  8 Core 168
Thread  9 Core 169
Thread 10 Core 170
Thread 11 Core 171
Thread 12 Core 172
Thread 13 Core 173
Thread 14 Core 174
Thread 15 Core 175
Thread 16 Core 176
Thread 17 Core 177
Thread 18 Core 178
Thread 19 Core 179
Thread 20 Core 180
Thread 21 Core 181
Thread 22 Core 182
Thread 23 Core 183
Thread 24 Core 184
Thread 25 Core 185
Thread 26 Core 186
Thread 27 Core 187
Thread 28 Core 188
Thread 29 Core 189
Thread 30 Core 190
Thread 31 Core 191
Rank 6 Node 0
Thread  0 Core 192
Thread  1 Core 193
Thread  2 Core 194
Thread  3 Core 195
Thread  4 Core 196
Thread  5 Core 197
Thread  6 Core 198
Thread  7 Core 199
Thread  8 Core 200
Thread  9 Core 201
Thread 10 Core 202
Thread 11 Core 203
Thread 12 Core 204
Thread 13 Core 205
Thread 14 Core 206
Thread 15 Core 207
Thread 16 Core 208
Thread 17 Core 209
Thread 18 Core 210
Thread 19 Core 211
Thread 20 Core 212
Thread 21 Core 213
Thread 22 Core 214
Thread 23 Core 215
Thread 24 Core 216
Thread 25 Core 217
Thread 26 Core 218
Thread 27 Core 219
Thread 28 Core 220
Thread 29 Core 221
Thread 30 Core 222
Thread 31 Core 223
Rank 7 Node 0
Thread  0 Core 224
Thread  1 Core 225
Thread  2 Core 226
Thread  3 Core 227
Thread  4 Core 228
Thread  5 Core 229
Thread  6 Core 230
Thread  7 Core 231
Thread  8 Core 232
Thread  9 Core 233
Thread 10 Core 234
Thread 11 Core 235
Thread 12 Core 236
Thread 13 Core 237
Thread 14 Core 238
Thread 15 Core 239
Thread 16 Core 240
Thread 17 Core 241
Thread 18 Core 242
Thread 19 Core 243
Thread 20 Core 244
Thread 21 Core 245
Thread 22 Core 246
Thread 23 Core 247
Thread 24 Core 248
Thread 25 Core 249
Thread 26 Core 250
Thread 27 Core 251
Thread 28 Core 252
Thread 29 Core 253
Thread 30 Core 254
Thread 31 Core 255
$
```

[No.21]

```sh
$ mpirun -n 32 --bind-to core --map-by ppr:1:l3cache:PE=8 -x OMP_NUM_THREAD=8 -x OMP_PROC_BIND=TRUE bash -c 'sleep $OMPI_COMM_WORLD_RANK; echo "Rank $OMPI_COMM_WORLD_RANK Node `echo $((OMPI_COMM_WORLD_RANK / OMPI_COMM_WORLD_LOCAL_SIZE))`"; ./show_thread_bind | sort -k 2n,2'
Rank 0 Node 0
Thread  0 Core   0
Thread  1 Core   1
Thread  2 Core   2
Thread  3 Core   3
Thread  4 Core   4
Thread  5 Core   5
Thread  6 Core   6
Thread  7 Core   7
Rank 1 Node 0
Thread  0 Core   8
Thread  1 Core   9
Thread  2 Core  10
Thread  3 Core  11
Thread  4 Core  12
Thread  5 Core  13
Thread  6 Core  14
Thread  7 Core  15
Rank 2 Node 0
Thread  0 Core  16
Thread  1 Core  17
Thread  2 Core  18
Thread  3 Core  19
Thread  4 Core  20
Thread  5 Core  21
Thread  6 Core  22
Thread  7 Core  23
Rank 3 Node 0
Thread  0 Core  24
Thread  1 Core  25
Thread  2 Core  26
Thread  3 Core  27
Thread  4 Core  28
Thread  5 Core  29
Thread  6 Core  30
Thread  7 Core  31
Rank 4 Node 0
Thread  0 Core  32
Thread  1 Core  33
Thread  2 Core  34
Thread  3 Core  35
Thread  4 Core  36
Thread  5 Core  37
Thread  6 Core  38
Thread  7 Core  39
Rank 5 Node 0
Thread  0 Core  40
Thread  1 Core  41
Thread  2 Core  42
Thread  3 Core  43
Thread  4 Core  44
Thread  5 Core  45
Thread  6 Core  46
Thread  7 Core  47
Rank 6 Node 0
Thread  0 Core  48
Thread  1 Core  49
Thread  2 Core  50
Thread  3 Core  51
Thread  4 Core  52
Thread  5 Core  53
Thread  6 Core  54
Thread  7 Core  55
Rank 7 Node 0
Thread  0 Core  56
Thread  1 Core  57
Thread  2 Core  58
Thread  3 Core  59
Thread  4 Core  60
Thread  5 Core  61
Thread  6 Core  62
Thread  7 Core  63
Rank 8 Node 0
Thread  0 Core  64
Thread  1 Core  65
Thread  2 Core  66
Thread  3 Core  67
Thread  4 Core  68
Thread  5 Core  69
Thread  6 Core  70
Thread  7 Core  71
Rank 9 Node 0
Thread  0 Core  72
Thread  1 Core  73
Thread  2 Core  74
Thread  3 Core  75
Thread  4 Core  76
Thread  5 Core  77
Thread  6 Core  78
Thread  7 Core  79
Rank 10 Node 0
Thread  0 Core  80
Thread  1 Core  81
Thread  2 Core  82
Thread  3 Core  83
Thread  4 Core  84
Thread  5 Core  85
Thread  6 Core  86
Thread  7 Core  87
Rank 11 Node 0
Thread  0 Core  88
Thread  1 Core  89
Thread  2 Core  90
Thread  3 Core  91
Thread  4 Core  92
Thread  5 Core  93
Thread  6 Core  94
Thread  7 Core  95
Rank 12 Node 0
Thread  0 Core  96
Thread  1 Core  97
Thread  2 Core  98
Thread  3 Core  99
Thread  4 Core 100
Thread  5 Core 101
Thread  6 Core 102
Thread  7 Core 103
Rank 13 Node 0
Thread  0 Core 104
Thread  1 Core 105
Thread  2 Core 106
Thread  3 Core 107
Thread  4 Core 108
Thread  5 Core 109
Thread  6 Core 110
Thread  7 Core 111
Rank 14 Node 0
Thread  0 Core 112
Thread  1 Core 113
Thread  2 Core 114
Thread  3 Core 115
Thread  4 Core 116
Thread  5 Core 117
Thread  6 Core 118
Thread  7 Core 119
Rank 15 Node 0
Thread  0 Core 120
Thread  1 Core 121
Thread  2 Core 122
Thread  3 Core 123
Thread  4 Core 124
Thread  5 Core 125
Thread  6 Core 126
Thread  7 Core 127
Rank 16 Node 0
Thread  0 Core 128
Thread  1 Core 129
Thread  2 Core 130
Thread  3 Core 131
Thread  4 Core 132
Thread  5 Core 133
Thread  6 Core 134
Thread  7 Core 135
Rank 17 Node 0
Thread  0 Core 136
Thread  1 Core 137
Thread  2 Core 138
Thread  3 Core 139
Thread  4 Core 140
Thread  5 Core 141
Thread  6 Core 142
Thread  7 Core 143
Rank 18 Node 0
Thread  0 Core 144
Thread  1 Core 145
Thread  2 Core 146
Thread  3 Core 147
Thread  4 Core 148
Thread  5 Core 149
Thread  6 Core 150
Thread  7 Core 151
Rank 19 Node 0
Thread  0 Core 152
Thread  1 Core 153
Thread  2 Core 154
Thread  3 Core 155
Thread  4 Core 156
Thread  5 Core 157
Thread  6 Core 158
Thread  7 Core 159
Rank 20 Node 0
Thread  0 Core 160
Thread  1 Core 161
Thread  2 Core 162
Thread  3 Core 163
Thread  4 Core 164
Thread  5 Core 165
Thread  6 Core 166
Thread  7 Core 167
Rank 21 Node 0
Thread  0 Core 168
Thread  1 Core 169
Thread  2 Core 170
Thread  3 Core 171
Thread  4 Core 172
Thread  5 Core 173
Thread  6 Core 174
Thread  7 Core 175
Rank 22 Node 0
Thread  0 Core 176
Thread  1 Core 177
Thread  2 Core 178
Thread  3 Core 179
Thread  4 Core 180
Thread  5 Core 181
Thread  6 Core 182
Thread  7 Core 183
Rank 23 Node 0
Thread  0 Core 184
Thread  1 Core 185
Thread  2 Core 186
Thread  3 Core 187
Thread  4 Core 188
Thread  5 Core 189
Thread  6 Core 190
Thread  7 Core 191
Rank 24 Node 0
Thread  0 Core 192
Thread  1 Core 193
Thread  2 Core 194
Thread  3 Core 195
Thread  4 Core 196
Thread  5 Core 197
Thread  6 Core 198
Thread  7 Core 199
Rank 25 Node 0
Thread  0 Core 200
Thread  1 Core 201
Thread  2 Core 202
Thread  3 Core 203
Thread  4 Core 204
Thread  5 Core 205
Thread  6 Core 206
Thread  7 Core 207
Rank 26 Node 0
Thread  0 Core 208
Thread  1 Core 209
Thread  2 Core 210
Thread  3 Core 211
Thread  4 Core 212
Thread  5 Core 213
Thread  6 Core 214
Thread  7 Core 215
Rank 27 Node 0
Thread  0 Core 216
Thread  1 Core 217
Thread  2 Core 218
Thread  3 Core 219
Thread  4 Core 220
Thread  5 Core 221
Thread  6 Core 222
Thread  7 Core 223
Rank 28 Node 0
Thread  0 Core 224
Thread  1 Core 225
Thread  2 Core 226
Thread  3 Core 227
Thread  4 Core 228
Thread  5 Core 229
Thread  6 Core 230
Thread  7 Core 231
Rank 29 Node 0
Thread  0 Core 232
Thread  1 Core 233
Thread  2 Core 234
Thread  3 Core 235
Thread  4 Core 236
Thread  5 Core 237
Thread  6 Core 238
Thread  7 Core 239
Rank 30 Node 0
Thread  0 Core 240
Thread  1 Core 241
Thread  2 Core 242
Thread  3 Core 243
Thread  4 Core 244
Thread  5 Core 245
Thread  6 Core 246
Thread  7 Core 247
Rank 31 Node 0
Thread  0 Core 248
Thread  1 Core 249
Thread  2 Core 250
Thread  3 Core 251
Thread  4 Core 252
Thread  5 Core 253
Thread  6 Core 254
Thread  7 Core 255
$
```

### 3-1-2. Slurm

[No.1]

```sh
$ srun -p e6 -n 1 --cpu-bind=cores bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0
$
```

[No.2]

```sh
$ srun -p e6 -n 2 --cpu-bind=cores bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0
Rank 1 Node 0 Core 96
$
```

[No.3]

```sh
$ srun -p e6 -n 32 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do seq -s, $i 4 $((i+12)) | tr '\n' ','; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 8-15
Rank 2 Node 0 Core 16-23
Rank 3 Node 0 Core 24-31
Rank 4 Node 0 Core 32-39
Rank 5 Node 0 Core 40-47
Rank 6 Node 0 Core 48-55
Rank 7 Node 0 Core 56-63
Rank 8 Node 0 Core 64-71
Rank 9 Node 0 Core 72-79
Rank 10 Node 0 Core 80-87
Rank 11 Node 0 Core 88-95
Rank 12 Node 0 Core 96-103
Rank 13 Node 0 Core 104-111
Rank 14 Node 0 Core 112-119
Rank 15 Node 0 Core 120-127
Rank 16 Node 0 Core 128-135
Rank 17 Node 0 Core 136-143
Rank 18 Node 0 Core 144-151
Rank 19 Node 0 Core 152-159
Rank 20 Node 0 Core 160-167
Rank 21 Node 0 Core 168-175
Rank 22 Node 0 Core 176-183
Rank 23 Node 0 Core 184-191
Rank 24 Node 0 Core 192-199
Rank 25 Node 0 Core 200-207
Rank 26 Node 0 Core 208-215
Rank 27 Node 0 Core 216-223
Rank 28 Node 0 Core 224-231
Rank 29 Node 0 Core 232-239
Rank 30 Node 0 Core 240-247
Rank 31 Node 0 Core 248-255
$
```

[No.4]

```sh
$ srun -p e6 -n 64 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do for j in \`seq $i 4 $((i+12))\`; do for k in \`seq 0 1\`; do echo -n $j","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 0-7
Rank 2 Node 0 Core 8-15
Rank 3 Node 0 Core 8-15
Rank 4 Node 0 Core 16-23
Rank 5 Node 0 Core 16-23
Rank 6 Node 0 Core 24-31
Rank 7 Node 0 Core 24-31
Rank 8 Node 0 Core 32-39
Rank 9 Node 0 Core 32-39
Rank 10 Node 0 Core 40-47
Rank 11 Node 0 Core 40-47
Rank 12 Node 0 Core 48-55
Rank 13 Node 0 Core 48-55
Rank 14 Node 0 Core 56-63
Rank 15 Node 0 Core 56-63
Rank 16 Node 0 Core 64-71
Rank 17 Node 0 Core 64-71
Rank 18 Node 0 Core 72-79
Rank 19 Node 0 Core 72-79
Rank 20 Node 0 Core 80-87
Rank 21 Node 0 Core 80-87
Rank 22 Node 0 Core 88-95
Rank 23 Node 0 Core 88-95
Rank 24 Node 0 Core 96-103
Rank 25 Node 0 Core 96-103
Rank 26 Node 0 Core 104-111
Rank 27 Node 0 Core 104-111
Rank 28 Node 0 Core 112-119
Rank 29 Node 0 Core 112-119
Rank 30 Node 0 Core 120-127
Rank 31 Node 0 Core 120-127
Rank 32 Node 0 Core 128-135
Rank 33 Node 0 Core 128-135
Rank 34 Node 0 Core 136-143
Rank 35 Node 0 Core 136-143
Rank 36 Node 0 Core 144-151
Rank 37 Node 0 Core 144-151
Rank 38 Node 0 Core 152-159
Rank 39 Node 0 Core 152-159
Rank 40 Node 0 Core 160-167
Rank 41 Node 0 Core 160-167
Rank 42 Node 0 Core 168-175
Rank 43 Node 0 Core 168-175
Rank 44 Node 0 Core 176-183
Rank 45 Node 0 Core 176-183
Rank 46 Node 0 Core 184-191
Rank 47 Node 0 Core 184-191
Rank 48 Node 0 Core 192-199
Rank 49 Node 0 Core 192-199
Rank 50 Node 0 Core 200-207
Rank 51 Node 0 Core 200-207
Rank 52 Node 0 Core 208-215
Rank 53 Node 0 Core 208-215
Rank 54 Node 0 Core 216-223
Rank 55 Node 0 Core 216-223
Rank 56 Node 0 Core 224-231
Rank 57 Node 0 Core 224-231
Rank 58 Node 0 Core 232-239
Rank 59 Node 0 Core 232-239
Rank 60 Node 0 Core 240-247
Rank 61 Node 0 Core 240-247
Rank 62 Node 0 Core 248-255
Rank 63 Node 0 Core 248-255
$
```

[No.5]

```sh
$ srun -p e6 -n 64 --cpu-bind=map_ldom:`for i in \`seq 0 1\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 8-15
Rank 2 Node 0 Core 16-23
Rank 3 Node 0 Core 24-31
Rank 4 Node 0 Core 32-39
Rank 5 Node 0 Core 40-47
Rank 6 Node 0 Core 48-55
Rank 7 Node 0 Core 56-63
Rank 8 Node 0 Core 64-71
Rank 9 Node 0 Core 72-79
Rank 10 Node 0 Core 80-87
Rank 11 Node 0 Core 88-95
Rank 12 Node 0 Core 96-103
Rank 13 Node 0 Core 104-111
Rank 14 Node 0 Core 112-119
Rank 15 Node 0 Core 120-127
Rank 16 Node 0 Core 128-135
Rank 17 Node 0 Core 136-143
Rank 18 Node 0 Core 144-151
Rank 19 Node 0 Core 152-159
Rank 20 Node 0 Core 160-167
Rank 21 Node 0 Core 168-175
Rank 22 Node 0 Core 176-183
Rank 23 Node 0 Core 184-191
Rank 24 Node 0 Core 192-199
Rank 25 Node 0 Core 200-207
Rank 26 Node 0 Core 208-215
Rank 27 Node 0 Core 216-223
Rank 28 Node 0 Core 224-231
Rank 29 Node 0 Core 232-239
Rank 30 Node 0 Core 240-247
Rank 31 Node 0 Core 248-255
Rank 32 Node 0 Core 0-7
Rank 33 Node 0 Core 8-15
Rank 34 Node 0 Core 16-23
Rank 35 Node 0 Core 24-31
Rank 36 Node 0 Core 32-39
Rank 37 Node 0 Core 40-47
Rank 38 Node 0 Core 48-55
Rank 39 Node 0 Core 56-63
Rank 40 Node 0 Core 64-71
Rank 41 Node 0 Core 72-79
Rank 42 Node 0 Core 80-87
Rank 43 Node 0 Core 88-95
Rank 44 Node 0 Core 96-103
Rank 45 Node 0 Core 104-111
Rank 46 Node 0 Core 112-119
Rank 47 Node 0 Core 120-127
Rank 48 Node 0 Core 128-135
Rank 49 Node 0 Core 136-143
Rank 50 Node 0 Core 144-151
Rank 51 Node 0 Core 152-159
Rank 52 Node 0 Core 160-167
Rank 53 Node 0 Core 168-175
Rank 54 Node 0 Core 176-183
Rank 55 Node 0 Core 184-191
Rank 56 Node 0 Core 192-199
Rank 57 Node 0 Core 200-207
Rank 58 Node 0 Core 208-215
Rank 59 Node 0 Core 216-223
Rank 60 Node 0 Core 224-231
Rank 61 Node 0 Core 232-239
Rank 62 Node 0 Core 240-247
Rank 63 Node 0 Core 248-255
$
```

[No.6]

```sh
$ srun -p e6 -n 128 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do for j in \`seq $i 4 $((i+12))\`; do for k in \`seq 0 3\`; do echo -n $j","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 0-7
Rank 2 Node 0 Core 0-7
Rank 3 Node 0 Core 0-7
Rank 4 Node 0 Core 8-15
Rank 5 Node 0 Core 8-15
Rank 6 Node 0 Core 8-15
Rank 7 Node 0 Core 8-15
Rank 8 Node 0 Core 16-23
Rank 9 Node 0 Core 16-23
Rank 10 Node 0 Core 16-23
Rank 11 Node 0 Core 16-23
Rank 12 Node 0 Core 24-31
Rank 13 Node 0 Core 24-31
Rank 14 Node 0 Core 24-31
Rank 15 Node 0 Core 24-31
Rank 16 Node 0 Core 32-39
Rank 17 Node 0 Core 32-39
Rank 18 Node 0 Core 32-39
Rank 19 Node 0 Core 32-39
Rank 20 Node 0 Core 40-47
Rank 21 Node 0 Core 40-47
Rank 22 Node 0 Core 40-47
Rank 23 Node 0 Core 40-47
Rank 24 Node 0 Core 48-55
Rank 25 Node 0 Core 48-55
Rank 26 Node 0 Core 48-55
Rank 27 Node 0 Core 48-55
Rank 28 Node 0 Core 56-63
Rank 29 Node 0 Core 56-63
Rank 30 Node 0 Core 56-63
Rank 31 Node 0 Core 56-63
Rank 32 Node 0 Core 64-71
Rank 33 Node 0 Core 64-71
Rank 34 Node 0 Core 64-71
Rank 35 Node 0 Core 64-71
Rank 36 Node 0 Core 72-79
Rank 37 Node 0 Core 72-79
Rank 38 Node 0 Core 72-79
Rank 39 Node 0 Core 72-79
Rank 40 Node 0 Core 80-87
Rank 41 Node 0 Core 80-87
Rank 42 Node 0 Core 80-87
Rank 43 Node 0 Core 80-87
Rank 44 Node 0 Core 88-95
Rank 45 Node 0 Core 88-95
Rank 46 Node 0 Core 88-95
Rank 47 Node 0 Core 88-95
Rank 48 Node 0 Core 96-103
Rank 49 Node 0 Core 96-103
Rank 50 Node 0 Core 96-103
Rank 51 Node 0 Core 96-103
Rank 52 Node 0 Core 104-111
Rank 53 Node 0 Core 104-111
Rank 54 Node 0 Core 104-111
Rank 55 Node 0 Core 104-111
Rank 56 Node 0 Core 112-119
Rank 57 Node 0 Core 112-119
Rank 58 Node 0 Core 112-119
Rank 59 Node 0 Core 112-119
Rank 60 Node 0 Core 120-127
Rank 61 Node 0 Core 120-127
Rank 62 Node 0 Core 120-127
Rank 63 Node 0 Core 120-127
Rank 64 Node 0 Core 128-135
Rank 65 Node 0 Core 128-135
Rank 66 Node 0 Core 128-135
Rank 67 Node 0 Core 128-135
Rank 68 Node 0 Core 136-143
Rank 69 Node 0 Core 136-143
Rank 70 Node 0 Core 136-143
Rank 71 Node 0 Core 136-143
Rank 72 Node 0 Core 144-151
Rank 73 Node 0 Core 144-151
Rank 74 Node 0 Core 144-151
Rank 75 Node 0 Core 144-151
Rank 76 Node 0 Core 152-159
Rank 77 Node 0 Core 152-159
Rank 78 Node 0 Core 152-159
Rank 79 Node 0 Core 152-159
Rank 80 Node 0 Core 160-167
Rank 81 Node 0 Core 160-167
Rank 82 Node 0 Core 160-167
Rank 83 Node 0 Core 160-167
Rank 84 Node 0 Core 168-175
Rank 85 Node 0 Core 168-175
Rank 86 Node 0 Core 168-175
Rank 87 Node 0 Core 168-175
Rank 88 Node 0 Core 176-183
Rank 89 Node 0 Core 176-183
Rank 90 Node 0 Core 176-183
Rank 91 Node 0 Core 176-183
Rank 92 Node 0 Core 184-191
Rank 93 Node 0 Core 184-191
Rank 94 Node 0 Core 184-191
Rank 95 Node 0 Core 184-191
Rank 96 Node 0 Core 192-199
Rank 97 Node 0 Core 192-199
Rank 98 Node 0 Core 192-199
Rank 99 Node 0 Core 192-199
Rank 100 Node 0 Core 200-207
Rank 101 Node 0 Core 200-207
Rank 102 Node 0 Core 200-207
Rank 103 Node 0 Core 200-207
Rank 104 Node 0 Core 208-215
Rank 105 Node 0 Core 208-215
Rank 106 Node 0 Core 208-215
Rank 107 Node 0 Core 208-215
Rank 108 Node 0 Core 216-223
Rank 109 Node 0 Core 216-223
Rank 110 Node 0 Core 216-223
Rank 111 Node 0 Core 216-223
Rank 112 Node 0 Core 224-231
Rank 113 Node 0 Core 224-231
Rank 114 Node 0 Core 224-231
Rank 115 Node 0 Core 224-231
Rank 116 Node 0 Core 232-239
Rank 117 Node 0 Core 232-239
Rank 118 Node 0 Core 232-239
Rank 119 Node 0 Core 232-239
Rank 120 Node 0 Core 240-247
Rank 121 Node 0 Core 240-247
Rank 122 Node 0 Core 240-247
Rank 123 Node 0 Core 240-247
Rank 124 Node 0 Core 248-255
Rank 125 Node 0 Core 248-255
Rank 126 Node 0 Core 248-255
Rank 127 Node 0 Core 248-255
$
```

[No.7]

```sh
$ srun -p e6 -n 128 --cpu-bind=map_ldom:`for i in \`seq 0 3\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 8-15
Rank 2 Node 0 Core 16-23
Rank 3 Node 0 Core 24-31
Rank 4 Node 0 Core 32-39
Rank 5 Node 0 Core 40-47
Rank 6 Node 0 Core 48-55
Rank 7 Node 0 Core 56-63
Rank 8 Node 0 Core 64-71
Rank 9 Node 0 Core 72-79
Rank 10 Node 0 Core 80-87
Rank 11 Node 0 Core 88-95
Rank 12 Node 0 Core 96-103
Rank 13 Node 0 Core 104-111
Rank 14 Node 0 Core 112-119
Rank 15 Node 0 Core 120-127
Rank 16 Node 0 Core 128-135
Rank 17 Node 0 Core 136-143
Rank 18 Node 0 Core 144-151
Rank 19 Node 0 Core 152-159
Rank 20 Node 0 Core 160-167
Rank 21 Node 0 Core 168-175
Rank 22 Node 0 Core 176-183
Rank 23 Node 0 Core 184-191
Rank 24 Node 0 Core 192-199
Rank 25 Node 0 Core 200-207
Rank 26 Node 0 Core 208-215
Rank 27 Node 0 Core 216-223
Rank 28 Node 0 Core 224-231
Rank 29 Node 0 Core 232-239
Rank 30 Node 0 Core 240-247
Rank 31 Node 0 Core 248-255
Rank 32 Node 0 Core 0-7
Rank 33 Node 0 Core 8-15
Rank 34 Node 0 Core 16-23
Rank 35 Node 0 Core 24-31
Rank 36 Node 0 Core 32-39
Rank 37 Node 0 Core 40-47
Rank 38 Node 0 Core 48-55
Rank 39 Node 0 Core 56-63
Rank 40 Node 0 Core 64-71
Rank 41 Node 0 Core 72-79
Rank 42 Node 0 Core 80-87
Rank 43 Node 0 Core 88-95
Rank 44 Node 0 Core 96-103
Rank 45 Node 0 Core 104-111
Rank 46 Node 0 Core 112-119
Rank 47 Node 0 Core 120-127
Rank 48 Node 0 Core 128-135
Rank 49 Node 0 Core 136-143
Rank 50 Node 0 Core 144-151
Rank 51 Node 0 Core 152-159
Rank 52 Node 0 Core 160-167
Rank 53 Node 0 Core 168-175
Rank 54 Node 0 Core 176-183
Rank 55 Node 0 Core 184-191
Rank 56 Node 0 Core 192-199
Rank 57 Node 0 Core 200-207
Rank 58 Node 0 Core 208-215
Rank 59 Node 0 Core 216-223
Rank 60 Node 0 Core 224-231
Rank 61 Node 0 Core 232-239
Rank 62 Node 0 Core 240-247
Rank 63 Node 0 Core 248-255
Rank 64 Node 0 Core 0-7
Rank 65 Node 0 Core 8-15
Rank 66 Node 0 Core 16-23
Rank 67 Node 0 Core 24-31
Rank 68 Node 0 Core 32-39
Rank 69 Node 0 Core 40-47
Rank 70 Node 0 Core 48-55
Rank 71 Node 0 Core 56-63
Rank 72 Node 0 Core 64-71
Rank 73 Node 0 Core 72-79
Rank 74 Node 0 Core 80-87
Rank 75 Node 0 Core 88-95
Rank 76 Node 0 Core 96-103
Rank 77 Node 0 Core 104-111
Rank 78 Node 0 Core 112-119
Rank 79 Node 0 Core 120-127
Rank 80 Node 0 Core 128-135
Rank 81 Node 0 Core 136-143
Rank 82 Node 0 Core 144-151
Rank 83 Node 0 Core 152-159
Rank 84 Node 0 Core 160-167
Rank 85 Node 0 Core 168-175
Rank 86 Node 0 Core 176-183
Rank 87 Node 0 Core 184-191
Rank 88 Node 0 Core 192-199
Rank 89 Node 0 Core 200-207
Rank 90 Node 0 Core 208-215
Rank 91 Node 0 Core 216-223
Rank 92 Node 0 Core 224-231
Rank 93 Node 0 Core 232-239
Rank 94 Node 0 Core 240-247
Rank 95 Node 0 Core 248-255
Rank 96 Node 0 Core 0-7
Rank 97 Node 0 Core 8-15
Rank 98 Node 0 Core 16-23
Rank 99 Node 0 Core 24-31
Rank 100 Node 0 Core 32-39
Rank 101 Node 0 Core 40-47
Rank 102 Node 0 Core 48-55
Rank 103 Node 0 Core 56-63
Rank 104 Node 0 Core 64-71
Rank 105 Node 0 Core 72-79
Rank 106 Node 0 Core 80-87
Rank 107 Node 0 Core 88-95
Rank 108 Node 0 Core 96-103
Rank 109 Node 0 Core 104-111
Rank 110 Node 0 Core 112-119
Rank 111 Node 0 Core 120-127
Rank 112 Node 0 Core 128-135
Rank 113 Node 0 Core 136-143
Rank 114 Node 0 Core 144-151
Rank 115 Node 0 Core 152-159
Rank 116 Node 0 Core 160-167
Rank 117 Node 0 Core 168-175
Rank 118 Node 0 Core 176-183
Rank 119 Node 0 Core 184-191
Rank 120 Node 0 Core 192-199
Rank 121 Node 0 Core 200-207
Rank 122 Node 0 Core 208-215
Rank 123 Node 0 Core 216-223
Rank 124 Node 0 Core 224-231
Rank 125 Node 0 Core 232-239
Rank 126 Node 0 Core 240-247
Rank 127 Node 0 Core 248-255
$
```

[No.8]

```sh
$ srun -p e6 -n 256 --cpu-bind=map_cpu:`seq -s, 0 255 | tr -d '\n'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0
Rank 1 Node 0 Core 1
Rank 2 Node 0 Core 2
Rank 3 Node 0 Core 3
Rank 4 Node 0 Core 4
Rank 5 Node 0 Core 5
Rank 6 Node 0 Core 6
Rank 7 Node 0 Core 7
Rank 8 Node 0 Core 8
Rank 9 Node 0 Core 9
Rank 10 Node 0 Core 10
Rank 11 Node 0 Core 11
Rank 12 Node 0 Core 12
Rank 13 Node 0 Core 13
Rank 14 Node 0 Core 14
Rank 15 Node 0 Core 15
Rank 16 Node 0 Core 16
Rank 17 Node 0 Core 17
Rank 18 Node 0 Core 18
Rank 19 Node 0 Core 19
Rank 20 Node 0 Core 20
Rank 21 Node 0 Core 21
Rank 22 Node 0 Core 22
Rank 23 Node 0 Core 23
Rank 24 Node 0 Core 24
Rank 25 Node 0 Core 25
Rank 26 Node 0 Core 26
Rank 27 Node 0 Core 27
Rank 28 Node 0 Core 28
Rank 29 Node 0 Core 29
Rank 30 Node 0 Core 30
Rank 31 Node 0 Core 31
Rank 32 Node 0 Core 32
Rank 33 Node 0 Core 33
Rank 34 Node 0 Core 34
Rank 35 Node 0 Core 35
Rank 36 Node 0 Core 36
Rank 37 Node 0 Core 37
Rank 38 Node 0 Core 38
Rank 39 Node 0 Core 39
Rank 40 Node 0 Core 40
Rank 41 Node 0 Core 41
Rank 42 Node 0 Core 42
Rank 43 Node 0 Core 43
Rank 44 Node 0 Core 44
Rank 45 Node 0 Core 45
Rank 46 Node 0 Core 46
Rank 47 Node 0 Core 47
Rank 48 Node 0 Core 48
Rank 49 Node 0 Core 49
Rank 50 Node 0 Core 50
Rank 51 Node 0 Core 51
Rank 52 Node 0 Core 52
Rank 53 Node 0 Core 53
Rank 54 Node 0 Core 54
Rank 55 Node 0 Core 55
Rank 56 Node 0 Core 56
Rank 57 Node 0 Core 57
Rank 58 Node 0 Core 58
Rank 59 Node 0 Core 59
Rank 60 Node 0 Core 60
Rank 61 Node 0 Core 61
Rank 62 Node 0 Core 62
Rank 63 Node 0 Core 63
Rank 64 Node 0 Core 64
Rank 65 Node 0 Core 65
Rank 66 Node 0 Core 66
Rank 67 Node 0 Core 67
Rank 68 Node 0 Core 68
Rank 69 Node 0 Core 69
Rank 70 Node 0 Core 70
Rank 71 Node 0 Core 71
Rank 72 Node 0 Core 72
Rank 73 Node 0 Core 73
Rank 74 Node 0 Core 74
Rank 75 Node 0 Core 75
Rank 76 Node 0 Core 76
Rank 77 Node 0 Core 77
Rank 78 Node 0 Core 78
Rank 79 Node 0 Core 79
Rank 80 Node 0 Core 80
Rank 81 Node 0 Core 81
Rank 82 Node 0 Core 82
Rank 83 Node 0 Core 83
Rank 84 Node 0 Core 84
Rank 85 Node 0 Core 85
Rank 86 Node 0 Core 86
Rank 87 Node 0 Core 87
Rank 88 Node 0 Core 88
Rank 89 Node 0 Core 89
Rank 90 Node 0 Core 90
Rank 91 Node 0 Core 91
Rank 92 Node 0 Core 92
Rank 93 Node 0 Core 93
Rank 94 Node 0 Core 94
Rank 95 Node 0 Core 95
Rank 96 Node 0 Core 96
Rank 97 Node 0 Core 97
Rank 98 Node 0 Core 98
Rank 99 Node 0 Core 99
Rank 100 Node 0 Core 100
Rank 101 Node 0 Core 101
Rank 102 Node 0 Core 102
Rank 103 Node 0 Core 103
Rank 104 Node 0 Core 104
Rank 105 Node 0 Core 105
Rank 106 Node 0 Core 106
Rank 107 Node 0 Core 107
Rank 108 Node 0 Core 108
Rank 109 Node 0 Core 109
Rank 110 Node 0 Core 110
Rank 111 Node 0 Core 111
Rank 112 Node 0 Core 112
Rank 113 Node 0 Core 113
Rank 114 Node 0 Core 114
Rank 115 Node 0 Core 115
Rank 116 Node 0 Core 116
Rank 117 Node 0 Core 117
Rank 118 Node 0 Core 118
Rank 119 Node 0 Core 119
Rank 120 Node 0 Core 120
Rank 121 Node 0 Core 121
Rank 122 Node 0 Core 122
Rank 123 Node 0 Core 123
Rank 124 Node 0 Core 124
Rank 125 Node 0 Core 125
Rank 126 Node 0 Core 126
Rank 127 Node 0 Core 127
Rank 128 Node 0 Core 128
Rank 129 Node 0 Core 129
Rank 130 Node 0 Core 130
Rank 131 Node 0 Core 131
Rank 132 Node 0 Core 132
Rank 133 Node 0 Core 133
Rank 134 Node 0 Core 134
Rank 135 Node 0 Core 135
Rank 136 Node 0 Core 136
Rank 137 Node 0 Core 137
Rank 138 Node 0 Core 138
Rank 139 Node 0 Core 139
Rank 140 Node 0 Core 140
Rank 141 Node 0 Core 141
Rank 142 Node 0 Core 142
Rank 143 Node 0 Core 143
Rank 144 Node 0 Core 144
Rank 145 Node 0 Core 145
Rank 146 Node 0 Core 146
Rank 147 Node 0 Core 147
Rank 148 Node 0 Core 148
Rank 149 Node 0 Core 149
Rank 150 Node 0 Core 150
Rank 151 Node 0 Core 151
Rank 152 Node 0 Core 152
Rank 153 Node 0 Core 153
Rank 154 Node 0 Core 154
Rank 155 Node 0 Core 155
Rank 156 Node 0 Core 156
Rank 157 Node 0 Core 157
Rank 158 Node 0 Core 158
Rank 159 Node 0 Core 159
Rank 160 Node 0 Core 160
Rank 161 Node 0 Core 161
Rank 162 Node 0 Core 162
Rank 163 Node 0 Core 163
Rank 164 Node 0 Core 164
Rank 165 Node 0 Core 165
Rank 166 Node 0 Core 166
Rank 167 Node 0 Core 167
Rank 168 Node 0 Core 168
Rank 169 Node 0 Core 169
Rank 170 Node 0 Core 170
Rank 171 Node 0 Core 171
Rank 172 Node 0 Core 172
Rank 173 Node 0 Core 173
Rank 174 Node 0 Core 174
Rank 175 Node 0 Core 175
Rank 176 Node 0 Core 176
Rank 177 Node 0 Core 177
Rank 178 Node 0 Core 178
Rank 179 Node 0 Core 179
Rank 180 Node 0 Core 180
Rank 181 Node 0 Core 181
Rank 182 Node 0 Core 182
Rank 183 Node 0 Core 183
Rank 184 Node 0 Core 184
Rank 185 Node 0 Core 185
Rank 186 Node 0 Core 186
Rank 187 Node 0 Core 187
Rank 188 Node 0 Core 188
Rank 189 Node 0 Core 189
Rank 190 Node 0 Core 190
Rank 191 Node 0 Core 191
Rank 192 Node 0 Core 192
Rank 193 Node 0 Core 193
Rank 194 Node 0 Core 194
Rank 195 Node 0 Core 195
Rank 196 Node 0 Core 196
Rank 197 Node 0 Core 197
Rank 198 Node 0 Core 198
Rank 199 Node 0 Core 199
Rank 200 Node 0 Core 200
Rank 201 Node 0 Core 201
Rank 202 Node 0 Core 202
Rank 203 Node 0 Core 203
Rank 204 Node 0 Core 204
Rank 205 Node 0 Core 205
Rank 206 Node 0 Core 206
Rank 207 Node 0 Core 207
Rank 208 Node 0 Core 208
Rank 209 Node 0 Core 209
Rank 210 Node 0 Core 210
Rank 211 Node 0 Core 211
Rank 212 Node 0 Core 212
Rank 213 Node 0 Core 213
Rank 214 Node 0 Core 214
Rank 215 Node 0 Core 215
Rank 216 Node 0 Core 216
Rank 217 Node 0 Core 217
Rank 218 Node 0 Core 218
Rank 219 Node 0 Core 219
Rank 220 Node 0 Core 220
Rank 221 Node 0 Core 221
Rank 222 Node 0 Core 222
Rank 223 Node 0 Core 223
Rank 224 Node 0 Core 224
Rank 225 Node 0 Core 225
Rank 226 Node 0 Core 226
Rank 227 Node 0 Core 227
Rank 228 Node 0 Core 228
Rank 229 Node 0 Core 229
Rank 230 Node 0 Core 230
Rank 231 Node 0 Core 231
Rank 232 Node 0 Core 232
Rank 233 Node 0 Core 233
Rank 234 Node 0 Core 234
Rank 235 Node 0 Core 235
Rank 236 Node 0 Core 236
Rank 237 Node 0 Core 237
Rank 238 Node 0 Core 238
Rank 239 Node 0 Core 239
Rank 240 Node 0 Core 240
Rank 241 Node 0 Core 241
Rank 242 Node 0 Core 242
Rank 243 Node 0 Core 243
Rank 244 Node 0 Core 244
Rank 245 Node 0 Core 245
Rank 246 Node 0 Core 246
Rank 247 Node 0 Core 247
Rank 248 Node 0 Core 248
Rank 249 Node 0 Core 249
Rank 250 Node 0 Core 250
Rank 251 Node 0 Core 251
Rank 252 Node 0 Core 252
Rank 253 Node 0 Core 253
Rank 254 Node 0 Core 254
Rank 255 Node 0 Core 255
$
```

[No.9]

```sh
$ srun -p e6 -n 256 --cpu-bind=map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 8-15
Rank 2 Node 0 Core 16-23
Rank 3 Node 0 Core 24-31
Rank 4 Node 0 Core 32-39
Rank 5 Node 0 Core 40-47
Rank 6 Node 0 Core 48-55
Rank 7 Node 0 Core 56-63
Rank 8 Node 0 Core 64-71
Rank 9 Node 0 Core 72-79
Rank 10 Node 0 Core 80-87
Rank 11 Node 0 Core 88-95
Rank 12 Node 0 Core 96-103
Rank 13 Node 0 Core 104-111
Rank 14 Node 0 Core 112-119
Rank 15 Node 0 Core 120-127
Rank 16 Node 0 Core 128-135
Rank 17 Node 0 Core 136-143
Rank 18 Node 0 Core 144-151
Rank 19 Node 0 Core 152-159
Rank 20 Node 0 Core 160-167
Rank 21 Node 0 Core 168-175
Rank 22 Node 0 Core 176-183
Rank 23 Node 0 Core 184-191
Rank 24 Node 0 Core 192-199
Rank 25 Node 0 Core 200-207
Rank 26 Node 0 Core 208-215
Rank 27 Node 0 Core 216-223
Rank 28 Node 0 Core 224-231
Rank 29 Node 0 Core 232-239
Rank 30 Node 0 Core 240-247
Rank 31 Node 0 Core 248-255
Rank 32 Node 0 Core 0-7
Rank 33 Node 0 Core 8-15
Rank 34 Node 0 Core 16-23
Rank 35 Node 0 Core 24-31
Rank 36 Node 0 Core 32-39
Rank 37 Node 0 Core 40-47
Rank 38 Node 0 Core 48-55
Rank 39 Node 0 Core 56-63
Rank 40 Node 0 Core 64-71
Rank 41 Node 0 Core 72-79
Rank 42 Node 0 Core 80-87
Rank 43 Node 0 Core 88-95
Rank 44 Node 0 Core 96-103
Rank 45 Node 0 Core 104-111
Rank 46 Node 0 Core 112-119
Rank 47 Node 0 Core 120-127
Rank 48 Node 0 Core 128-135
Rank 49 Node 0 Core 136-143
Rank 50 Node 0 Core 144-151
Rank 51 Node 0 Core 152-159
Rank 52 Node 0 Core 160-167
Rank 53 Node 0 Core 168-175
Rank 54 Node 0 Core 176-183
Rank 55 Node 0 Core 184-191
Rank 56 Node 0 Core 192-199
Rank 57 Node 0 Core 200-207
Rank 58 Node 0 Core 208-215
Rank 59 Node 0 Core 216-223
Rank 60 Node 0 Core 224-231
Rank 61 Node 0 Core 232-239
Rank 62 Node 0 Core 240-247
Rank 63 Node 0 Core 248-255
Rank 64 Node 0 Core 0-7
Rank 65 Node 0 Core 8-15
Rank 66 Node 0 Core 16-23
Rank 67 Node 0 Core 24-31
Rank 68 Node 0 Core 32-39
Rank 69 Node 0 Core 40-47
Rank 70 Node 0 Core 48-55
Rank 71 Node 0 Core 56-63
Rank 72 Node 0 Core 64-71
Rank 73 Node 0 Core 72-79
Rank 74 Node 0 Core 80-87
Rank 75 Node 0 Core 88-95
Rank 76 Node 0 Core 96-103
Rank 77 Node 0 Core 104-111
Rank 78 Node 0 Core 112-119
Rank 79 Node 0 Core 120-127
Rank 80 Node 0 Core 128-135
Rank 81 Node 0 Core 136-143
Rank 82 Node 0 Core 144-151
Rank 83 Node 0 Core 152-159
Rank 84 Node 0 Core 160-167
Rank 85 Node 0 Core 168-175
Rank 86 Node 0 Core 176-183
Rank 87 Node 0 Core 184-191
Rank 88 Node 0 Core 192-199
Rank 89 Node 0 Core 200-207
Rank 90 Node 0 Core 208-215
Rank 91 Node 0 Core 216-223
Rank 92 Node 0 Core 224-231
Rank 93 Node 0 Core 232-239
Rank 94 Node 0 Core 240-247
Rank 95 Node 0 Core 248-255
Rank 96 Node 0 Core 0-7
Rank 97 Node 0 Core 8-15
Rank 98 Node 0 Core 16-23
Rank 99 Node 0 Core 24-31
Rank 100 Node 0 Core 32-39
Rank 101 Node 0 Core 40-47
Rank 102 Node 0 Core 48-55
Rank 103 Node 0 Core 56-63
Rank 104 Node 0 Core 64-71
Rank 105 Node 0 Core 72-79
Rank 106 Node 0 Core 80-87
Rank 107 Node 0 Core 88-95
Rank 108 Node 0 Core 96-103
Rank 109 Node 0 Core 104-111
Rank 110 Node 0 Core 112-119
Rank 111 Node 0 Core 120-127
Rank 112 Node 0 Core 128-135
Rank 113 Node 0 Core 136-143
Rank 114 Node 0 Core 144-151
Rank 115 Node 0 Core 152-159
Rank 116 Node 0 Core 160-167
Rank 117 Node 0 Core 168-175
Rank 118 Node 0 Core 176-183
Rank 119 Node 0 Core 184-191
Rank 120 Node 0 Core 192-199
Rank 121 Node 0 Core 200-207
Rank 122 Node 0 Core 208-215
Rank 123 Node 0 Core 216-223
Rank 124 Node 0 Core 224-231
Rank 125 Node 0 Core 232-239
Rank 126 Node 0 Core 240-247
Rank 127 Node 0 Core 248-255
Rank 128 Node 0 Core 0-7
Rank 129 Node 0 Core 8-15
Rank 130 Node 0 Core 16-23
Rank 131 Node 0 Core 24-31
Rank 132 Node 0 Core 32-39
Rank 133 Node 0 Core 40-47
Rank 134 Node 0 Core 48-55
Rank 135 Node 0 Core 56-63
Rank 136 Node 0 Core 64-71
Rank 137 Node 0 Core 72-79
Rank 138 Node 0 Core 80-87
Rank 139 Node 0 Core 88-95
Rank 140 Node 0 Core 96-103
Rank 141 Node 0 Core 104-111
Rank 142 Node 0 Core 112-119
Rank 143 Node 0 Core 120-127
Rank 144 Node 0 Core 128-135
Rank 145 Node 0 Core 136-143
Rank 146 Node 0 Core 144-151
Rank 147 Node 0 Core 152-159
Rank 148 Node 0 Core 160-167
Rank 149 Node 0 Core 168-175
Rank 150 Node 0 Core 176-183
Rank 151 Node 0 Core 184-191
Rank 152 Node 0 Core 192-199
Rank 153 Node 0 Core 200-207
Rank 154 Node 0 Core 208-215
Rank 155 Node 0 Core 216-223
Rank 156 Node 0 Core 224-231
Rank 157 Node 0 Core 232-239
Rank 158 Node 0 Core 240-247
Rank 159 Node 0 Core 248-255
Rank 160 Node 0 Core 0-7
Rank 161 Node 0 Core 8-15
Rank 162 Node 0 Core 16-23
Rank 163 Node 0 Core 24-31
Rank 164 Node 0 Core 32-39
Rank 165 Node 0 Core 40-47
Rank 166 Node 0 Core 48-55
Rank 167 Node 0 Core 56-63
Rank 168 Node 0 Core 64-71
Rank 169 Node 0 Core 72-79
Rank 170 Node 0 Core 80-87
Rank 171 Node 0 Core 88-95
Rank 172 Node 0 Core 96-103
Rank 173 Node 0 Core 104-111
Rank 174 Node 0 Core 112-119
Rank 175 Node 0 Core 120-127
Rank 176 Node 0 Core 128-135
Rank 177 Node 0 Core 136-143
Rank 178 Node 0 Core 144-151
Rank 179 Node 0 Core 152-159
Rank 180 Node 0 Core 160-167
Rank 181 Node 0 Core 168-175
Rank 182 Node 0 Core 176-183
Rank 183 Node 0 Core 184-191
Rank 184 Node 0 Core 192-199
Rank 185 Node 0 Core 200-207
Rank 186 Node 0 Core 208-215
Rank 187 Node 0 Core 216-223
Rank 188 Node 0 Core 224-231
Rank 189 Node 0 Core 232-239
Rank 190 Node 0 Core 240-247
Rank 191 Node 0 Core 248-255
Rank 192 Node 0 Core 0-7
Rank 193 Node 0 Core 8-15
Rank 194 Node 0 Core 16-23
Rank 195 Node 0 Core 24-31
Rank 196 Node 0 Core 32-39
Rank 197 Node 0 Core 40-47
Rank 198 Node 0 Core 48-55
Rank 199 Node 0 Core 56-63
Rank 200 Node 0 Core 64-71
Rank 201 Node 0 Core 72-79
Rank 202 Node 0 Core 80-87
Rank 203 Node 0 Core 88-95
Rank 204 Node 0 Core 96-103
Rank 205 Node 0 Core 104-111
Rank 206 Node 0 Core 112-119
Rank 207 Node 0 Core 120-127
Rank 208 Node 0 Core 128-135
Rank 209 Node 0 Core 136-143
Rank 210 Node 0 Core 144-151
Rank 211 Node 0 Core 152-159
Rank 212 Node 0 Core 160-167
Rank 213 Node 0 Core 168-175
Rank 214 Node 0 Core 176-183
Rank 215 Node 0 Core 184-191
Rank 216 Node 0 Core 192-199
Rank 217 Node 0 Core 200-207
Rank 218 Node 0 Core 208-215
Rank 219 Node 0 Core 216-223
Rank 220 Node 0 Core 224-231
Rank 221 Node 0 Core 232-239
Rank 222 Node 0 Core 240-247
Rank 223 Node 0 Core 248-255
Rank 224 Node 0 Core 0-7
Rank 225 Node 0 Core 8-15
Rank 226 Node 0 Core 16-23
Rank 227 Node 0 Core 24-31
Rank 228 Node 0 Core 32-39
Rank 229 Node 0 Core 40-47
Rank 230 Node 0 Core 48-55
Rank 231 Node 0 Core 56-63
Rank 232 Node 0 Core 64-71
Rank 233 Node 0 Core 72-79
Rank 234 Node 0 Core 80-87
Rank 235 Node 0 Core 88-95
Rank 236 Node 0 Core 96-103
Rank 237 Node 0 Core 104-111
Rank 238 Node 0 Core 112-119
Rank 239 Node 0 Core 120-127
Rank 240 Node 0 Core 128-135
Rank 241 Node 0 Core 136-143
Rank 242 Node 0 Core 144-151
Rank 243 Node 0 Core 152-159
Rank 244 Node 0 Core 160-167
Rank 245 Node 0 Core 168-175
Rank 246 Node 0 Core 176-183
Rank 247 Node 0 Core 184-191
Rank 248 Node 0 Core 192-199
Rank 249 Node 0 Core 200-207
Rank 250 Node 0 Core 208-215
Rank 251 Node 0 Core 216-223
Rank 252 Node 0 Core 224-231
Rank 253 Node 0 Core 232-239
Rank 254 Node 0 Core 240-247
Rank 255 Node 0 Core 248-255
$
```

[No.10]

```sh
$ OMP_NUM_THREADS=128 OMP_PROC_BIND=TRUE srun -p e6 -n 2 -c 128 --cpu-bind=socket bash -c 'sleep $SLURM_PROCID; echo "Rank $SLURM_PROCID Node $SLURM_NODEID"; ./show_thread_bind | sort -k 2n,2'
Rank 0 Node 0
Thread  0 Core   0
Thread  1 Core   1
Thread  2 Core   2
Thread  3 Core   3
Thread  4 Core   4
Thread  5 Core   5
Thread  6 Core   6
Thread  7 Core   7
Thread  8 Core   8
Thread  9 Core   9
Thread 10 Core  10
Thread 11 Core  11
Thread 12 Core  12
Thread 13 Core  13
Thread 14 Core  14
Thread 15 Core  15
Thread 16 Core  16
Thread 17 Core  17
Thread 18 Core  18
Thread 19 Core  19
Thread 20 Core  20
Thread 21 Core  21
Thread 22 Core  22
Thread 23 Core  23
Thread 24 Core  24
Thread 25 Core  25
Thread 26 Core  26
Thread 27 Core  27
Thread 28 Core  28
Thread 29 Core  29
Thread 30 Core  30
Thread 31 Core  31
Thread 32 Core  32
Thread 33 Core  33
Thread 34 Core  34
Thread 35 Core  35
Thread 36 Core  36
Thread 37 Core  37
Thread 38 Core  38
Thread 39 Core  39
Thread 40 Core  40
Thread 41 Core  41
Thread 42 Core  42
Thread 43 Core  43
Thread 44 Core  44
Thread 45 Core  45
Thread 46 Core  46
Thread 47 Core  47
Thread 48 Core  48
Thread 49 Core  49
Thread 50 Core  50
Thread 51 Core  51
Thread 52 Core  52
Thread 53 Core  53
Thread 54 Core  54
Thread 55 Core  55
Thread 56 Core  56
Thread 57 Core  57
Thread 58 Core  58
Thread 59 Core  59
Thread 60 Core  60
Thread 61 Core  61
Thread 62 Core  62
Thread 63 Core  63
Thread 64 Core  64
Thread 65 Core  65
Thread 66 Core  66
Thread 67 Core  67
Thread 68 Core  68
Thread 69 Core  69
Thread 70 Core  70
Thread 71 Core  71
Thread 72 Core  72
Thread 73 Core  73
Thread 74 Core  74
Thread 75 Core  75
Thread 76 Core  76
Thread 77 Core  77
Thread 78 Core  78
Thread 79 Core  79
Thread 80 Core  80
Thread 81 Core  81
Thread 82 Core  82
Thread 83 Core  83
Thread 84 Core  84
Thread 85 Core  85
Thread 86 Core  86
Thread 87 Core  87
Thread 88 Core  88
Thread 89 Core  89
Thread 90 Core  90
Thread 91 Core  91
Thread 92 Core  92
Thread 93 Core  93
Thread 94 Core  94
Thread 95 Core  95
Thread 96 Core  96
Thread 97 Core  97
Thread 98 Core  98
Thread 99 Core  99
Thread 100 Core 100
Thread 101 Core 101
Thread 102 Core 102
Thread 103 Core 103
Thread 104 Core 104
Thread 105 Core 105
Thread 106 Core 106
Thread 107 Core 107
Thread 108 Core 108
Thread 109 Core 109
Thread 110 Core 110
Thread 111 Core 111
Thread 112 Core 112
Thread 113 Core 113
Thread 114 Core 114
Thread 115 Core 115
Thread 116 Core 116
Thread 117 Core 117
Thread 118 Core 118
Thread 119 Core 119
Thread 120 Core 120
Thread 121 Core 121
Thread 122 Core 122
Thread 123 Core 123
Thread 124 Core 124
Thread 125 Core 125
Thread 126 Core 126
Thread 127 Core 127
Rank 1 Node 0
Thread  0 Core 128
Thread  1 Core 129
Thread  2 Core 130
Thread  3 Core 131
Thread  4 Core 132
Thread  5 Core 133
Thread  6 Core 134
Thread  7 Core 135
Thread  8 Core 136
Thread  9 Core 137
Thread 10 Core 138
Thread 11 Core 139
Thread 12 Core 140
Thread 13 Core 141
Thread 14 Core 142
Thread 15 Core 143
Thread 16 Core 144
Thread 17 Core 145
Thread 18 Core 146
Thread 19 Core 147
Thread 20 Core 148
Thread 21 Core 149
Thread 22 Core 150
Thread 23 Core 151
Thread 24 Core 152
Thread 25 Core 153
Thread 26 Core 154
Thread 27 Core 155
Thread 28 Core 156
Thread 29 Core 157
Thread 30 Core 158
Thread 31 Core 159
Thread 32 Core 160
Thread 33 Core 161
Thread 34 Core 162
Thread 35 Core 163
Thread 36 Core 164
Thread 37 Core 165
Thread 38 Core 166
Thread 39 Core 167
Thread 40 Core 168
Thread 41 Core 169
Thread 42 Core 170
Thread 43 Core 171
Thread 44 Core 172
Thread 45 Core 173
Thread 46 Core 174
Thread 47 Core 175
Thread 48 Core 176
Thread 49 Core 177
Thread 50 Core 178
Thread 51 Core 179
Thread 52 Core 180
Thread 53 Core 181
Thread 54 Core 182
Thread 55 Core 183
Thread 56 Core 184
Thread 57 Core 185
Thread 58 Core 186
Thread 59 Core 187
Thread 60 Core 188
Thread 61 Core 189
Thread 62 Core 190
Thread 63 Core 191
Thread 64 Core 192
Thread 65 Core 193
Thread 66 Core 194
Thread 67 Core 195
Thread 68 Core 196
Thread 69 Core 197
Thread 70 Core 198
Thread 71 Core 199
Thread 72 Core 200
Thread 73 Core 201
Thread 74 Core 202
Thread 75 Core 203
Thread 76 Core 204
Thread 77 Core 205
Thread 78 Core 206
Thread 79 Core 207
Thread 80 Core 208
Thread 81 Core 209
Thread 82 Core 210
Thread 83 Core 211
Thread 84 Core 212
Thread 85 Core 213
Thread 86 Core 214
Thread 87 Core 215
Thread 88 Core 216
Thread 89 Core 217
Thread 90 Core 218
Thread 91 Core 219
Thread 92 Core 220
Thread 93 Core 221
Thread 94 Core 222
Thread 95 Core 223
Thread 96 Core 224
Thread 97 Core 225
Thread 98 Core 226
Thread 99 Core 227
Thread 100 Core 228
Thread 101 Core 229
Thread 102 Core 230
Thread 103 Core 231
Thread 104 Core 232
Thread 105 Core 233
Thread 106 Core 234
Thread 107 Core 235
Thread 108 Core 236
Thread 109 Core 237
Thread 110 Core 238
Thread 111 Core 239
Thread 112 Core 240
Thread 113 Core 241
Thread 114 Core 242
Thread 115 Core 243
Thread 116 Core 244
Thread 117 Core 245
Thread 118 Core 246
Thread 119 Core 247
Thread 120 Core 248
Thread 121 Core 249
Thread 122 Core 250
Thread 123 Core 251
Thread 124 Core 252
Thread 125 Core 253
Thread 126 Core 254
Thread 127 Core 255
$
```

[No.11]

```sh
$ OMP_NUM_THREADS=8 OMP_PROC_BIND=TRUE srun -p e6 -n 32 -c 8 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do seq -s, $i 4 $((i+12)) | tr '\n' ','; done | sed 's/,$//g'` bash -c 'sleep $SLURM_PROCID; echo "Rank $SLURM_PROCID Node $SLURM_NODEID"; ./show_thread_bind | sort -k 2n,2'
Rank 0 Node 0
Thread  0 Core   0
Thread  1 Core   1
Thread  2 Core   2
Thread  3 Core   3
Thread  4 Core   4
Thread  5 Core   5
Thread  6 Core   6
Thread  7 Core   7
Rank 1 Node 0
Thread  0 Core   8
Thread  1 Core   9
Thread  2 Core  10
Thread  3 Core  11
Thread  4 Core  12
Thread  5 Core  13
Thread  6 Core  14
Thread  7 Core  15
Rank 2 Node 0
Thread  0 Core  16
Thread  1 Core  17
Thread  2 Core  18
Thread  3 Core  19
Thread  4 Core  20
Thread  5 Core  21
Thread  6 Core  22
Thread  7 Core  23
Rank 3 Node 0
Thread  0 Core  24
Thread  1 Core  25
Thread  2 Core  26
Thread  3 Core  27
Thread  4 Core  28
Thread  5 Core  29
Thread  6 Core  30
Thread  7 Core  31
Rank 4 Node 0
Thread  0 Core  32
Thread  1 Core  33
Thread  2 Core  34
Thread  3 Core  35
Thread  4 Core  36
Thread  5 Core  37
Thread  6 Core  38
Thread  7 Core  39
Rank 5 Node 0
Thread  0 Core  40
Thread  1 Core  41
Thread  2 Core  42
Thread  3 Core  43
Thread  4 Core  44
Thread  5 Core  45
Thread  6 Core  46
Thread  7 Core  47
Rank 6 Node 0
Thread  0 Core  48
Thread  1 Core  49
Thread  2 Core  50
Thread  3 Core  51
Thread  4 Core  52
Thread  5 Core  53
Thread  6 Core  54
Thread  7 Core  55
Rank 7 Node 0
Thread  0 Core  56
Thread  1 Core  57
Thread  2 Core  58
Thread  3 Core  59
Thread  4 Core  60
Thread  5 Core  61
Thread  6 Core  62
Thread  7 Core  63
Rank 8 Node 0
Thread  0 Core  64
Thread  1 Core  65
Thread  2 Core  66
Thread  3 Core  67
Thread  4 Core  68
Thread  5 Core  69
Thread  6 Core  70
Thread  7 Core  71
Rank 9 Node 0
Thread  0 Core  72
Thread  1 Core  73
Thread  2 Core  74
Thread  3 Core  75
Thread  4 Core  76
Thread  5 Core  77
Thread  6 Core  78
Thread  7 Core  79
Rank 10 Node 0
Thread  0 Core  80
Thread  1 Core  81
Thread  2 Core  82
Thread  3 Core  83
Thread  4 Core  84
Thread  5 Core  85
Thread  6 Core  86
Thread  7 Core  87
Rank 11 Node 0
Thread  0 Core  88
Thread  1 Core  89
Thread  2 Core  90
Thread  3 Core  91
Thread  4 Core  92
Thread  5 Core  93
Thread  6 Core  94
Thread  7 Core  95
Rank 12 Node 0
Thread  0 Core  96
Thread  1 Core  97
Thread  2 Core  98
Thread  3 Core  99
Thread  4 Core 100
Thread  5 Core 101
Thread  6 Core 102
Thread  7 Core 103
Rank 13 Node 0
Thread  0 Core 104
Thread  1 Core 105
Thread  2 Core 106
Thread  3 Core 107
Thread  4 Core 108
Thread  5 Core 109
Thread  6 Core 110
Thread  7 Core 111
Rank 14 Node 0
Thread  0 Core 112
Thread  1 Core 113
Thread  2 Core 114
Thread  3 Core 115
Thread  4 Core 116
Thread  5 Core 117
Thread  6 Core 118
Thread  7 Core 119
Rank 15 Node 0
Thread  0 Core 120
Thread  1 Core 121
Thread  2 Core 122
Thread  3 Core 123
Thread  4 Core 124
Thread  5 Core 125
Thread  6 Core 126
Thread  7 Core 127
Rank 16 Node 0
Thread  0 Core 128
Thread  1 Core 129
Thread  2 Core 130
Thread  3 Core 131
Thread  4 Core 132
Thread  5 Core 133
Thread  6 Core 134
Thread  7 Core 135
Rank 17 Node 0
Thread  0 Core 136
Thread  1 Core 137
Thread  2 Core 138
Thread  3 Core 139
Thread  4 Core 140
Thread  5 Core 141
Thread  6 Core 142
Thread  7 Core 143
Rank 18 Node 0
Thread  0 Core 144
Thread  1 Core 145
Thread  2 Core 146
Thread  3 Core 147
Thread  4 Core 148
Thread  5 Core 149
Thread  6 Core 150
Thread  7 Core 151
Rank 19 Node 0
Thread  0 Core 152
Thread  1 Core 153
Thread  2 Core 154
Thread  3 Core 155
Thread  4 Core 156
Thread  5 Core 157
Thread  6 Core 158
Thread  7 Core 159
Rank 20 Node 0
Thread  0 Core 160
Thread  1 Core 161
Thread  2 Core 162
Thread  3 Core 163
Thread  4 Core 164
Thread  5 Core 165
Thread  6 Core 166
Thread  7 Core 167
Rank 21 Node 0
Thread  0 Core 168
Thread  1 Core 169
Thread  2 Core 170
Thread  3 Core 171
Thread  4 Core 172
Thread  5 Core 173
Thread  6 Core 174
Thread  7 Core 175
Rank 22 Node 0
Thread  0 Core 176
Thread  1 Core 177
Thread  2 Core 178
Thread  3 Core 179
Thread  4 Core 180
Thread  5 Core 181
Thread  6 Core 182
Thread  7 Core 183
Rank 23 Node 0
Thread  0 Core 184
Thread  1 Core 185
Thread  2 Core 186
Thread  3 Core 187
Thread  4 Core 188
Thread  5 Core 189
Thread  6 Core 190
Thread  7 Core 191
Rank 24 Node 0
Thread  0 Core 192
Thread  1 Core 193
Thread  2 Core 194
Thread  3 Core 195
Thread  4 Core 196
Thread  5 Core 197
Thread  6 Core 198
Thread  7 Core 199
Rank 25 Node 0
Thread  0 Core 200
Thread  1 Core 201
Thread  2 Core 202
Thread  3 Core 203
Thread  4 Core 204
Thread  5 Core 205
Thread  6 Core 206
Thread  7 Core 207
Rank 26 Node 0
Thread  0 Core 208
Thread  1 Core 209
Thread  2 Core 210
Thread  3 Core 211
Thread  4 Core 212
Thread  5 Core 213
Thread  6 Core 214
Thread  7 Core 215
Rank 27 Node 0
Thread  0 Core 216
Thread  1 Core 217
Thread  2 Core 218
Thread  3 Core 219
Thread  4 Core 220
Thread  5 Core 221
Thread  6 Core 222
Thread  7 Core 223
Rank 28 Node 0
Thread  0 Core 224
Thread  1 Core 225
Thread  2 Core 226
Thread  3 Core 227
Thread  4 Core 228
Thread  5 Core 229
Thread  6 Core 230
Thread  7 Core 231
Rank 29 Node 0
Thread  0 Core 232
Thread  1 Core 233
Thread  2 Core 234
Thread  3 Core 235
Thread  4 Core 236
Thread  5 Core 237
Thread  6 Core 238
Thread  7 Core 239
Rank 30 Node 0
Thread  0 Core 240
Thread  1 Core 241
Thread  2 Core 242
Thread  3 Core 243
Thread  4 Core 244
Thread  5 Core 245
Thread  6 Core 246
Thread  7 Core 247
Rank 31 Node 0
Thread  0 Core 248
Thread  1 Core 249
Thread  2 Core 250
Thread  3 Core 251
Thread  4 Core 252
Thread  5 Core 253
Thread  6 Core 254
Thread  7 Core 255
$
```

[No.12]

```sh
$ srun -p e6 -n 8 --cpu-bind=map_cpu:`seq -s, 0 32 255 | tr -d '\n'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0
Rank 1 Node 0 Core 32
Rank 2 Node 0 Core 64
Rank 3 Node 0 Core 96
Rank 4 Node 0 Core 128
Rank 5 Node 0 Core 160
Rank 6 Node 0 Core 192
Rank 7 Node 0 Core 224
$
```

[No.13]

```sh
$ srun -p e6 -n 32 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do seq -s, $i 4 $((i+12)) | tr '\n' ','; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 8-15
Rank 2 Node 0 Core 16-23
Rank 3 Node 0 Core 24-31
Rank 4 Node 0 Core 32-39
Rank 5 Node 0 Core 40-47
Rank 6 Node 0 Core 48-55
Rank 7 Node 0 Core 56-63
Rank 8 Node 0 Core 64-71
Rank 9 Node 0 Core 72-79
Rank 10 Node 0 Core 80-87
Rank 11 Node 0 Core 88-95
Rank 12 Node 0 Core 96-103
Rank 13 Node 0 Core 104-111
Rank 14 Node 0 Core 112-119
Rank 15 Node 0 Core 120-127
Rank 16 Node 0 Core 128-135
Rank 17 Node 0 Core 136-143
Rank 18 Node 0 Core 144-151
Rank 19 Node 0 Core 152-159
Rank 20 Node 0 Core 160-167
Rank 21 Node 0 Core 168-175
Rank 22 Node 0 Core 176-183
Rank 23 Node 0 Core 184-191
Rank 24 Node 0 Core 192-199
Rank 25 Node 0 Core 200-207
Rank 26 Node 0 Core 208-215
Rank 27 Node 0 Core 216-223
Rank 28 Node 0 Core 224-231
Rank 29 Node 0 Core 232-239
Rank 30 Node 0 Core 240-247
Rank 31 Node 0 Core 248-255
$
```

[No.14]

```sh
$ srun -p e6 -n 64 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do for j in \`seq $i 4 $((i+12))\`; do for k in \`seq 0 1\`; do echo -n $j","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 0-7
Rank 2 Node 0 Core 8-15
Rank 3 Node 0 Core 8-15
Rank 4 Node 0 Core 16-23
Rank 5 Node 0 Core 16-23
Rank 6 Node 0 Core 24-31
Rank 7 Node 0 Core 24-31
Rank 8 Node 0 Core 32-39
Rank 9 Node 0 Core 32-39
Rank 10 Node 0 Core 40-47
Rank 11 Node 0 Core 40-47
Rank 12 Node 0 Core 48-55
Rank 13 Node 0 Core 48-55
Rank 14 Node 0 Core 56-63
Rank 15 Node 0 Core 56-63
Rank 16 Node 0 Core 64-71
Rank 17 Node 0 Core 64-71
Rank 18 Node 0 Core 72-79
Rank 19 Node 0 Core 72-79
Rank 20 Node 0 Core 80-87
Rank 21 Node 0 Core 80-87
Rank 22 Node 0 Core 88-95
Rank 23 Node 0 Core 88-95
Rank 24 Node 0 Core 96-103
Rank 25 Node 0 Core 96-103
Rank 26 Node 0 Core 104-111
Rank 27 Node 0 Core 104-111
Rank 28 Node 0 Core 112-119
Rank 29 Node 0 Core 112-119
Rank 30 Node 0 Core 120-127
Rank 31 Node 0 Core 120-127
Rank 32 Node 0 Core 128-135
Rank 33 Node 0 Core 128-135
Rank 34 Node 0 Core 136-143
Rank 35 Node 0 Core 136-143
Rank 36 Node 0 Core 144-151
Rank 37 Node 0 Core 144-151
Rank 38 Node 0 Core 152-159
Rank 39 Node 0 Core 152-159
Rank 40 Node 0 Core 160-167
Rank 41 Node 0 Core 160-167
Rank 42 Node 0 Core 168-175
Rank 43 Node 0 Core 168-175
Rank 44 Node 0 Core 176-183
Rank 45 Node 0 Core 176-183
Rank 46 Node 0 Core 184-191
Rank 47 Node 0 Core 184-191
Rank 48 Node 0 Core 192-199
Rank 49 Node 0 Core 192-199
Rank 50 Node 0 Core 200-207
Rank 51 Node 0 Core 200-207
Rank 52 Node 0 Core 208-215
Rank 53 Node 0 Core 208-215
Rank 54 Node 0 Core 216-223
Rank 55 Node 0 Core 216-223
Rank 56 Node 0 Core 224-231
Rank 57 Node 0 Core 224-231
Rank 58 Node 0 Core 232-239
Rank 59 Node 0 Core 232-239
Rank 60 Node 0 Core 240-247
Rank 61 Node 0 Core 240-247
Rank 62 Node 0 Core 248-255
Rank 63 Node 0 Core 248-255
$
```

[No.15]

```sh
$ srun -p e6 -n 64 --cpu-bind=map_ldom:`for i in \`seq 0 1\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 8-15
Rank 2 Node 0 Core 16-23
Rank 3 Node 0 Core 24-31
Rank 4 Node 0 Core 32-39
Rank 5 Node 0 Core 40-47
Rank 6 Node 0 Core 48-55
Rank 7 Node 0 Core 56-63
Rank 8 Node 0 Core 64-71
Rank 9 Node 0 Core 72-79
Rank 10 Node 0 Core 80-87
Rank 11 Node 0 Core 88-95
Rank 12 Node 0 Core 96-103
Rank 13 Node 0 Core 104-111
Rank 14 Node 0 Core 112-119
Rank 15 Node 0 Core 120-127
Rank 16 Node 0 Core 128-135
Rank 17 Node 0 Core 136-143
Rank 18 Node 0 Core 144-151
Rank 19 Node 0 Core 152-159
Rank 20 Node 0 Core 160-167
Rank 21 Node 0 Core 168-175
Rank 22 Node 0 Core 176-183
Rank 23 Node 0 Core 184-191
Rank 24 Node 0 Core 192-199
Rank 25 Node 0 Core 200-207
Rank 26 Node 0 Core 208-215
Rank 27 Node 0 Core 216-223
Rank 28 Node 0 Core 224-231
Rank 29 Node 0 Core 232-239
Rank 30 Node 0 Core 240-247
Rank 31 Node 0 Core 248-255
Rank 32 Node 0 Core 0-7
Rank 33 Node 0 Core 8-15
Rank 34 Node 0 Core 16-23
Rank 35 Node 0 Core 24-31
Rank 36 Node 0 Core 32-39
Rank 37 Node 0 Core 40-47
Rank 38 Node 0 Core 48-55
Rank 39 Node 0 Core 56-63
Rank 40 Node 0 Core 64-71
Rank 41 Node 0 Core 72-79
Rank 42 Node 0 Core 80-87
Rank 43 Node 0 Core 88-95
Rank 44 Node 0 Core 96-103
Rank 45 Node 0 Core 104-111
Rank 46 Node 0 Core 112-119
Rank 47 Node 0 Core 120-127
Rank 48 Node 0 Core 128-135
Rank 49 Node 0 Core 136-143
Rank 50 Node 0 Core 144-151
Rank 51 Node 0 Core 152-159
Rank 52 Node 0 Core 160-167
Rank 53 Node 0 Core 168-175
Rank 54 Node 0 Core 176-183
Rank 55 Node 0 Core 184-191
Rank 56 Node 0 Core 192-199
Rank 57 Node 0 Core 200-207
Rank 58 Node 0 Core 208-215
Rank 59 Node 0 Core 216-223
Rank 60 Node 0 Core 224-231
Rank 61 Node 0 Core 232-239
Rank 62 Node 0 Core 240-247
Rank 63 Node 0 Core 248-255
$
```

[No.16]

```sh
$ srun -p e6 -n 128 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do for j in \`seq $i 4 $((i+12))\`; do for k in \`seq 0 3\`; do echo -n $j","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 0-7
Rank 2 Node 0 Core 0-7
Rank 3 Node 0 Core 0-7
Rank 4 Node 0 Core 8-15
Rank 5 Node 0 Core 8-15
Rank 6 Node 0 Core 8-15
Rank 7 Node 0 Core 8-15
Rank 8 Node 0 Core 16-23
Rank 9 Node 0 Core 16-23
Rank 10 Node 0 Core 16-23
Rank 11 Node 0 Core 16-23
Rank 12 Node 0 Core 24-31
Rank 13 Node 0 Core 24-31
Rank 14 Node 0 Core 24-31
Rank 15 Node 0 Core 24-31
Rank 16 Node 0 Core 32-39
Rank 17 Node 0 Core 32-39
Rank 18 Node 0 Core 32-39
Rank 19 Node 0 Core 32-39
Rank 20 Node 0 Core 40-47
Rank 21 Node 0 Core 40-47
Rank 22 Node 0 Core 40-47
Rank 23 Node 0 Core 40-47
Rank 24 Node 0 Core 48-55
Rank 25 Node 0 Core 48-55
Rank 26 Node 0 Core 48-55
Rank 27 Node 0 Core 48-55
Rank 28 Node 0 Core 56-63
Rank 29 Node 0 Core 56-63
Rank 30 Node 0 Core 56-63
Rank 31 Node 0 Core 56-63
Rank 32 Node 0 Core 64-71
Rank 33 Node 0 Core 64-71
Rank 34 Node 0 Core 64-71
Rank 35 Node 0 Core 64-71
Rank 36 Node 0 Core 72-79
Rank 37 Node 0 Core 72-79
Rank 38 Node 0 Core 72-79
Rank 39 Node 0 Core 72-79
Rank 40 Node 0 Core 80-87
Rank 41 Node 0 Core 80-87
Rank 42 Node 0 Core 80-87
Rank 43 Node 0 Core 80-87
Rank 44 Node 0 Core 88-95
Rank 45 Node 0 Core 88-95
Rank 46 Node 0 Core 88-95
Rank 47 Node 0 Core 88-95
Rank 48 Node 0 Core 96-103
Rank 49 Node 0 Core 96-103
Rank 50 Node 0 Core 96-103
Rank 51 Node 0 Core 96-103
Rank 52 Node 0 Core 104-111
Rank 53 Node 0 Core 104-111
Rank 54 Node 0 Core 104-111
Rank 55 Node 0 Core 104-111
Rank 56 Node 0 Core 112-119
Rank 57 Node 0 Core 112-119
Rank 58 Node 0 Core 112-119
Rank 59 Node 0 Core 112-119
Rank 60 Node 0 Core 120-127
Rank 61 Node 0 Core 120-127
Rank 62 Node 0 Core 120-127
Rank 63 Node 0 Core 120-127
Rank 64 Node 0 Core 128-135
Rank 65 Node 0 Core 128-135
Rank 66 Node 0 Core 128-135
Rank 67 Node 0 Core 128-135
Rank 68 Node 0 Core 136-143
Rank 69 Node 0 Core 136-143
Rank 70 Node 0 Core 136-143
Rank 71 Node 0 Core 136-143
Rank 72 Node 0 Core 144-151
Rank 73 Node 0 Core 144-151
Rank 74 Node 0 Core 144-151
Rank 75 Node 0 Core 144-151
Rank 76 Node 0 Core 152-159
Rank 77 Node 0 Core 152-159
Rank 78 Node 0 Core 152-159
Rank 79 Node 0 Core 152-159
Rank 80 Node 0 Core 160-167
Rank 81 Node 0 Core 160-167
Rank 82 Node 0 Core 160-167
Rank 83 Node 0 Core 160-167
Rank 84 Node 0 Core 168-175
Rank 85 Node 0 Core 168-175
Rank 86 Node 0 Core 168-175
Rank 87 Node 0 Core 168-175
Rank 88 Node 0 Core 176-183
Rank 89 Node 0 Core 176-183
Rank 90 Node 0 Core 176-183
Rank 91 Node 0 Core 176-183
Rank 92 Node 0 Core 184-191
Rank 93 Node 0 Core 184-191
Rank 94 Node 0 Core 184-191
Rank 95 Node 0 Core 184-191
Rank 96 Node 0 Core 192-199
Rank 97 Node 0 Core 192-199
Rank 98 Node 0 Core 192-199
Rank 99 Node 0 Core 192-199
Rank 100 Node 0 Core 200-207
Rank 101 Node 0 Core 200-207
Rank 102 Node 0 Core 200-207
Rank 103 Node 0 Core 200-207
Rank 104 Node 0 Core 208-215
Rank 105 Node 0 Core 208-215
Rank 106 Node 0 Core 208-215
Rank 107 Node 0 Core 208-215
Rank 108 Node 0 Core 216-223
Rank 109 Node 0 Core 216-223
Rank 110 Node 0 Core 216-223
Rank 111 Node 0 Core 216-223
Rank 112 Node 0 Core 224-231
Rank 113 Node 0 Core 224-231
Rank 114 Node 0 Core 224-231
Rank 115 Node 0 Core 224-231
Rank 116 Node 0 Core 232-239
Rank 117 Node 0 Core 232-239
Rank 118 Node 0 Core 232-239
Rank 119 Node 0 Core 232-239
Rank 120 Node 0 Core 240-247
Rank 121 Node 0 Core 240-247
Rank 122 Node 0 Core 240-247
Rank 123 Node 0 Core 240-247
Rank 124 Node 0 Core 248-255
Rank 125 Node 0 Core 248-255
Rank 126 Node 0 Core 248-255
Rank 127 Node 0 Core 248-255
$
```

[No.17]

```sh
$ srun -p e6 -n 128 --cpu-bind=map_ldom:`for i in \`seq 0 3\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 8-15
Rank 2 Node 0 Core 16-23
Rank 3 Node 0 Core 24-31
Rank 4 Node 0 Core 32-39
Rank 5 Node 0 Core 40-47
Rank 6 Node 0 Core 48-55
Rank 7 Node 0 Core 56-63
Rank 8 Node 0 Core 64-71
Rank 9 Node 0 Core 72-79
Rank 10 Node 0 Core 80-87
Rank 11 Node 0 Core 88-95
Rank 12 Node 0 Core 96-103
Rank 13 Node 0 Core 104-111
Rank 14 Node 0 Core 112-119
Rank 15 Node 0 Core 120-127
Rank 16 Node 0 Core 128-135
Rank 17 Node 0 Core 136-143
Rank 18 Node 0 Core 144-151
Rank 19 Node 0 Core 152-159
Rank 20 Node 0 Core 160-167
Rank 21 Node 0 Core 168-175
Rank 22 Node 0 Core 176-183
Rank 23 Node 0 Core 184-191
Rank 24 Node 0 Core 192-199
Rank 25 Node 0 Core 200-207
Rank 26 Node 0 Core 208-215
Rank 27 Node 0 Core 216-223
Rank 28 Node 0 Core 224-231
Rank 29 Node 0 Core 232-239
Rank 30 Node 0 Core 240-247
Rank 31 Node 0 Core 248-255
Rank 32 Node 0 Core 0-7
Rank 33 Node 0 Core 8-15
Rank 34 Node 0 Core 16-23
Rank 35 Node 0 Core 24-31
Rank 36 Node 0 Core 32-39
Rank 37 Node 0 Core 40-47
Rank 38 Node 0 Core 48-55
Rank 39 Node 0 Core 56-63
Rank 40 Node 0 Core 64-71
Rank 41 Node 0 Core 72-79
Rank 42 Node 0 Core 80-87
Rank 43 Node 0 Core 88-95
Rank 44 Node 0 Core 96-103
Rank 45 Node 0 Core 104-111
Rank 46 Node 0 Core 112-119
Rank 47 Node 0 Core 120-127
Rank 48 Node 0 Core 128-135
Rank 49 Node 0 Core 136-143
Rank 50 Node 0 Core 144-151
Rank 51 Node 0 Core 152-159
Rank 52 Node 0 Core 160-167
Rank 53 Node 0 Core 168-175
Rank 54 Node 0 Core 176-183
Rank 55 Node 0 Core 184-191
Rank 56 Node 0 Core 192-199
Rank 57 Node 0 Core 200-207
Rank 58 Node 0 Core 208-215
Rank 59 Node 0 Core 216-223
Rank 60 Node 0 Core 224-231
Rank 61 Node 0 Core 232-239
Rank 62 Node 0 Core 240-247
Rank 63 Node 0 Core 248-255
Rank 64 Node 0 Core 0-7
Rank 65 Node 0 Core 8-15
Rank 66 Node 0 Core 16-23
Rank 67 Node 0 Core 24-31
Rank 68 Node 0 Core 32-39
Rank 69 Node 0 Core 40-47
Rank 70 Node 0 Core 48-55
Rank 71 Node 0 Core 56-63
Rank 72 Node 0 Core 64-71
Rank 73 Node 0 Core 72-79
Rank 74 Node 0 Core 80-87
Rank 75 Node 0 Core 88-95
Rank 76 Node 0 Core 96-103
Rank 77 Node 0 Core 104-111
Rank 78 Node 0 Core 112-119
Rank 79 Node 0 Core 120-127
Rank 80 Node 0 Core 128-135
Rank 81 Node 0 Core 136-143
Rank 82 Node 0 Core 144-151
Rank 83 Node 0 Core 152-159
Rank 84 Node 0 Core 160-167
Rank 85 Node 0 Core 168-175
Rank 86 Node 0 Core 176-183
Rank 87 Node 0 Core 184-191
Rank 88 Node 0 Core 192-199
Rank 89 Node 0 Core 200-207
Rank 90 Node 0 Core 208-215
Rank 91 Node 0 Core 216-223
Rank 92 Node 0 Core 224-231
Rank 93 Node 0 Core 232-239
Rank 94 Node 0 Core 240-247
Rank 95 Node 0 Core 248-255
Rank 96 Node 0 Core 0-7
Rank 97 Node 0 Core 8-15
Rank 98 Node 0 Core 16-23
Rank 99 Node 0 Core 24-31
Rank 100 Node 0 Core 32-39
Rank 101 Node 0 Core 40-47
Rank 102 Node 0 Core 48-55
Rank 103 Node 0 Core 56-63
Rank 104 Node 0 Core 64-71
Rank 105 Node 0 Core 72-79
Rank 106 Node 0 Core 80-87
Rank 107 Node 0 Core 88-95
Rank 108 Node 0 Core 96-103
Rank 109 Node 0 Core 104-111
Rank 110 Node 0 Core 112-119
Rank 111 Node 0 Core 120-127
Rank 112 Node 0 Core 128-135
Rank 113 Node 0 Core 136-143
Rank 114 Node 0 Core 144-151
Rank 115 Node 0 Core 152-159
Rank 116 Node 0 Core 160-167
Rank 117 Node 0 Core 168-175
Rank 118 Node 0 Core 176-183
Rank 119 Node 0 Core 184-191
Rank 120 Node 0 Core 192-199
Rank 121 Node 0 Core 200-207
Rank 122 Node 0 Core 208-215
Rank 123 Node 0 Core 216-223
Rank 124 Node 0 Core 224-231
Rank 125 Node 0 Core 232-239
Rank 126 Node 0 Core 240-247
Rank 127 Node 0 Core 248-255
$
```

[No.18]

```sh
$ srun -p e6 -n 256 --cpu-bind=map_cpu:`seq -s, 0 255 | tr -d '\n'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0
Rank 1 Node 0 Core 1
Rank 2 Node 0 Core 2
Rank 3 Node 0 Core 3
Rank 4 Node 0 Core 4
Rank 5 Node 0 Core 5
Rank 6 Node 0 Core 6
Rank 7 Node 0 Core 7
Rank 8 Node 0 Core 8
Rank 9 Node 0 Core 9
Rank 10 Node 0 Core 10
Rank 11 Node 0 Core 11
Rank 12 Node 0 Core 12
Rank 13 Node 0 Core 13
Rank 14 Node 0 Core 14
Rank 15 Node 0 Core 15
Rank 16 Node 0 Core 16
Rank 17 Node 0 Core 17
Rank 18 Node 0 Core 18
Rank 19 Node 0 Core 19
Rank 20 Node 0 Core 20
Rank 21 Node 0 Core 21
Rank 22 Node 0 Core 22
Rank 23 Node 0 Core 23
Rank 24 Node 0 Core 24
Rank 25 Node 0 Core 25
Rank 26 Node 0 Core 26
Rank 27 Node 0 Core 27
Rank 28 Node 0 Core 28
Rank 29 Node 0 Core 29
Rank 30 Node 0 Core 30
Rank 31 Node 0 Core 31
Rank 32 Node 0 Core 32
Rank 33 Node 0 Core 33
Rank 34 Node 0 Core 34
Rank 35 Node 0 Core 35
Rank 36 Node 0 Core 36
Rank 37 Node 0 Core 37
Rank 38 Node 0 Core 38
Rank 39 Node 0 Core 39
Rank 40 Node 0 Core 40
Rank 41 Node 0 Core 41
Rank 42 Node 0 Core 42
Rank 43 Node 0 Core 43
Rank 44 Node 0 Core 44
Rank 45 Node 0 Core 45
Rank 46 Node 0 Core 46
Rank 47 Node 0 Core 47
Rank 48 Node 0 Core 48
Rank 49 Node 0 Core 49
Rank 50 Node 0 Core 50
Rank 51 Node 0 Core 51
Rank 52 Node 0 Core 52
Rank 53 Node 0 Core 53
Rank 54 Node 0 Core 54
Rank 55 Node 0 Core 55
Rank 56 Node 0 Core 56
Rank 57 Node 0 Core 57
Rank 58 Node 0 Core 58
Rank 59 Node 0 Core 59
Rank 60 Node 0 Core 60
Rank 61 Node 0 Core 61
Rank 62 Node 0 Core 62
Rank 63 Node 0 Core 63
Rank 64 Node 0 Core 64
Rank 65 Node 0 Core 65
Rank 66 Node 0 Core 66
Rank 67 Node 0 Core 67
Rank 68 Node 0 Core 68
Rank 69 Node 0 Core 69
Rank 70 Node 0 Core 70
Rank 71 Node 0 Core 71
Rank 72 Node 0 Core 72
Rank 73 Node 0 Core 73
Rank 74 Node 0 Core 74
Rank 75 Node 0 Core 75
Rank 76 Node 0 Core 76
Rank 77 Node 0 Core 77
Rank 78 Node 0 Core 78
Rank 79 Node 0 Core 79
Rank 80 Node 0 Core 80
Rank 81 Node 0 Core 81
Rank 82 Node 0 Core 82
Rank 83 Node 0 Core 83
Rank 84 Node 0 Core 84
Rank 85 Node 0 Core 85
Rank 86 Node 0 Core 86
Rank 87 Node 0 Core 87
Rank 88 Node 0 Core 88
Rank 89 Node 0 Core 89
Rank 90 Node 0 Core 90
Rank 91 Node 0 Core 91
Rank 92 Node 0 Core 92
Rank 93 Node 0 Core 93
Rank 94 Node 0 Core 94
Rank 95 Node 0 Core 95
Rank 96 Node 0 Core 96
Rank 97 Node 0 Core 97
Rank 98 Node 0 Core 98
Rank 99 Node 0 Core 99
Rank 100 Node 0 Core 100
Rank 101 Node 0 Core 101
Rank 102 Node 0 Core 102
Rank 103 Node 0 Core 103
Rank 104 Node 0 Core 104
Rank 105 Node 0 Core 105
Rank 106 Node 0 Core 106
Rank 107 Node 0 Core 107
Rank 108 Node 0 Core 108
Rank 109 Node 0 Core 109
Rank 110 Node 0 Core 110
Rank 111 Node 0 Core 111
Rank 112 Node 0 Core 112
Rank 113 Node 0 Core 113
Rank 114 Node 0 Core 114
Rank 115 Node 0 Core 115
Rank 116 Node 0 Core 116
Rank 117 Node 0 Core 117
Rank 118 Node 0 Core 118
Rank 119 Node 0 Core 119
Rank 120 Node 0 Core 120
Rank 121 Node 0 Core 121
Rank 122 Node 0 Core 122
Rank 123 Node 0 Core 123
Rank 124 Node 0 Core 124
Rank 125 Node 0 Core 125
Rank 126 Node 0 Core 126
Rank 127 Node 0 Core 127
Rank 128 Node 0 Core 128
Rank 129 Node 0 Core 129
Rank 130 Node 0 Core 130
Rank 131 Node 0 Core 131
Rank 132 Node 0 Core 132
Rank 133 Node 0 Core 133
Rank 134 Node 0 Core 134
Rank 135 Node 0 Core 135
Rank 136 Node 0 Core 136
Rank 137 Node 0 Core 137
Rank 138 Node 0 Core 138
Rank 139 Node 0 Core 139
Rank 140 Node 0 Core 140
Rank 141 Node 0 Core 141
Rank 142 Node 0 Core 142
Rank 143 Node 0 Core 143
Rank 144 Node 0 Core 144
Rank 145 Node 0 Core 145
Rank 146 Node 0 Core 146
Rank 147 Node 0 Core 147
Rank 148 Node 0 Core 148
Rank 149 Node 0 Core 149
Rank 150 Node 0 Core 150
Rank 151 Node 0 Core 151
Rank 152 Node 0 Core 152
Rank 153 Node 0 Core 153
Rank 154 Node 0 Core 154
Rank 155 Node 0 Core 155
Rank 156 Node 0 Core 156
Rank 157 Node 0 Core 157
Rank 158 Node 0 Core 158
Rank 159 Node 0 Core 159
Rank 160 Node 0 Core 160
Rank 161 Node 0 Core 161
Rank 162 Node 0 Core 162
Rank 163 Node 0 Core 163
Rank 164 Node 0 Core 164
Rank 165 Node 0 Core 165
Rank 166 Node 0 Core 166
Rank 167 Node 0 Core 167
Rank 168 Node 0 Core 168
Rank 169 Node 0 Core 169
Rank 170 Node 0 Core 170
Rank 171 Node 0 Core 171
Rank 172 Node 0 Core 172
Rank 173 Node 0 Core 173
Rank 174 Node 0 Core 174
Rank 175 Node 0 Core 175
Rank 176 Node 0 Core 176
Rank 177 Node 0 Core 177
Rank 178 Node 0 Core 178
Rank 179 Node 0 Core 179
Rank 180 Node 0 Core 180
Rank 181 Node 0 Core 181
Rank 182 Node 0 Core 182
Rank 183 Node 0 Core 183
Rank 184 Node 0 Core 184
Rank 185 Node 0 Core 185
Rank 186 Node 0 Core 186
Rank 187 Node 0 Core 187
Rank 188 Node 0 Core 188
Rank 189 Node 0 Core 189
Rank 190 Node 0 Core 190
Rank 191 Node 0 Core 191
Rank 192 Node 0 Core 192
Rank 193 Node 0 Core 193
Rank 194 Node 0 Core 194
Rank 195 Node 0 Core 195
Rank 196 Node 0 Core 196
Rank 197 Node 0 Core 197
Rank 198 Node 0 Core 198
Rank 199 Node 0 Core 199
Rank 200 Node 0 Core 200
Rank 201 Node 0 Core 201
Rank 202 Node 0 Core 202
Rank 203 Node 0 Core 203
Rank 204 Node 0 Core 204
Rank 205 Node 0 Core 205
Rank 206 Node 0 Core 206
Rank 207 Node 0 Core 207
Rank 208 Node 0 Core 208
Rank 209 Node 0 Core 209
Rank 210 Node 0 Core 210
Rank 211 Node 0 Core 211
Rank 212 Node 0 Core 212
Rank 213 Node 0 Core 213
Rank 214 Node 0 Core 214
Rank 215 Node 0 Core 215
Rank 216 Node 0 Core 216
Rank 217 Node 0 Core 217
Rank 218 Node 0 Core 218
Rank 219 Node 0 Core 219
Rank 220 Node 0 Core 220
Rank 221 Node 0 Core 221
Rank 222 Node 0 Core 222
Rank 223 Node 0 Core 223
Rank 224 Node 0 Core 224
Rank 225 Node 0 Core 225
Rank 226 Node 0 Core 226
Rank 227 Node 0 Core 227
Rank 228 Node 0 Core 228
Rank 229 Node 0 Core 229
Rank 230 Node 0 Core 230
Rank 231 Node 0 Core 231
Rank 232 Node 0 Core 232
Rank 233 Node 0 Core 233
Rank 234 Node 0 Core 234
Rank 235 Node 0 Core 235
Rank 236 Node 0 Core 236
Rank 237 Node 0 Core 237
Rank 238 Node 0 Core 238
Rank 239 Node 0 Core 239
Rank 240 Node 0 Core 240
Rank 241 Node 0 Core 241
Rank 242 Node 0 Core 242
Rank 243 Node 0 Core 243
Rank 244 Node 0 Core 244
Rank 245 Node 0 Core 245
Rank 246 Node 0 Core 246
Rank 247 Node 0 Core 247
Rank 248 Node 0 Core 248
Rank 249 Node 0 Core 249
Rank 250 Node 0 Core 250
Rank 251 Node 0 Core 251
Rank 252 Node 0 Core 252
Rank 253 Node 0 Core 253
Rank 254 Node 0 Core 254
Rank 255 Node 0 Core 255
$
```

[No.19]

```sh
$ srun -p e6 -n 256 --cpu-bind=map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 16 18 19 17\`; do for k in \`seq $j 4 $((j+12))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0-7
Rank 1 Node 0 Core 8-15
Rank 2 Node 0 Core 16-23
Rank 3 Node 0 Core 24-31
Rank 4 Node 0 Core 32-39
Rank 5 Node 0 Core 40-47
Rank 6 Node 0 Core 48-55
Rank 7 Node 0 Core 56-63
Rank 8 Node 0 Core 64-71
Rank 9 Node 0 Core 72-79
Rank 10 Node 0 Core 80-87
Rank 11 Node 0 Core 88-95
Rank 12 Node 0 Core 96-103
Rank 13 Node 0 Core 104-111
Rank 14 Node 0 Core 112-119
Rank 15 Node 0 Core 120-127
Rank 16 Node 0 Core 128-135
Rank 17 Node 0 Core 136-143
Rank 18 Node 0 Core 144-151
Rank 19 Node 0 Core 152-159
Rank 20 Node 0 Core 160-167
Rank 21 Node 0 Core 168-175
Rank 22 Node 0 Core 176-183
Rank 23 Node 0 Core 184-191
Rank 24 Node 0 Core 192-199
Rank 25 Node 0 Core 200-207
Rank 26 Node 0 Core 208-215
Rank 27 Node 0 Core 216-223
Rank 28 Node 0 Core 224-231
Rank 29 Node 0 Core 232-239
Rank 30 Node 0 Core 240-247
Rank 31 Node 0 Core 248-255
Rank 32 Node 0 Core 0-7
Rank 33 Node 0 Core 8-15
Rank 34 Node 0 Core 16-23
Rank 35 Node 0 Core 24-31
Rank 36 Node 0 Core 32-39
Rank 37 Node 0 Core 40-47
Rank 38 Node 0 Core 48-55
Rank 39 Node 0 Core 56-63
Rank 40 Node 0 Core 64-71
Rank 41 Node 0 Core 72-79
Rank 42 Node 0 Core 80-87
Rank 43 Node 0 Core 88-95
Rank 44 Node 0 Core 96-103
Rank 45 Node 0 Core 104-111
Rank 46 Node 0 Core 112-119
Rank 47 Node 0 Core 120-127
Rank 48 Node 0 Core 128-135
Rank 49 Node 0 Core 136-143
Rank 50 Node 0 Core 144-151
Rank 51 Node 0 Core 152-159
Rank 52 Node 0 Core 160-167
Rank 53 Node 0 Core 168-175
Rank 54 Node 0 Core 176-183
Rank 55 Node 0 Core 184-191
Rank 56 Node 0 Core 192-199
Rank 57 Node 0 Core 200-207
Rank 58 Node 0 Core 208-215
Rank 59 Node 0 Core 216-223
Rank 60 Node 0 Core 224-231
Rank 61 Node 0 Core 232-239
Rank 62 Node 0 Core 240-247
Rank 63 Node 0 Core 248-255
Rank 64 Node 0 Core 0-7
Rank 65 Node 0 Core 8-15
Rank 66 Node 0 Core 16-23
Rank 67 Node 0 Core 24-31
Rank 68 Node 0 Core 32-39
Rank 69 Node 0 Core 40-47
Rank 70 Node 0 Core 48-55
Rank 71 Node 0 Core 56-63
Rank 72 Node 0 Core 64-71
Rank 73 Node 0 Core 72-79
Rank 74 Node 0 Core 80-87
Rank 75 Node 0 Core 88-95
Rank 76 Node 0 Core 96-103
Rank 77 Node 0 Core 104-111
Rank 78 Node 0 Core 112-119
Rank 79 Node 0 Core 120-127
Rank 80 Node 0 Core 128-135
Rank 81 Node 0 Core 136-143
Rank 82 Node 0 Core 144-151
Rank 83 Node 0 Core 152-159
Rank 84 Node 0 Core 160-167
Rank 85 Node 0 Core 168-175
Rank 86 Node 0 Core 176-183
Rank 87 Node 0 Core 184-191
Rank 88 Node 0 Core 192-199
Rank 89 Node 0 Core 200-207
Rank 90 Node 0 Core 208-215
Rank 91 Node 0 Core 216-223
Rank 92 Node 0 Core 224-231
Rank 93 Node 0 Core 232-239
Rank 94 Node 0 Core 240-247
Rank 95 Node 0 Core 248-255
Rank 96 Node 0 Core 0-7
Rank 97 Node 0 Core 8-15
Rank 98 Node 0 Core 16-23
Rank 99 Node 0 Core 24-31
Rank 100 Node 0 Core 32-39
Rank 101 Node 0 Core 40-47
Rank 102 Node 0 Core 48-55
Rank 103 Node 0 Core 56-63
Rank 104 Node 0 Core 64-71
Rank 105 Node 0 Core 72-79
Rank 106 Node 0 Core 80-87
Rank 107 Node 0 Core 88-95
Rank 108 Node 0 Core 96-103
Rank 109 Node 0 Core 104-111
Rank 110 Node 0 Core 112-119
Rank 111 Node 0 Core 120-127
Rank 112 Node 0 Core 128-135
Rank 113 Node 0 Core 136-143
Rank 114 Node 0 Core 144-151
Rank 115 Node 0 Core 152-159
Rank 116 Node 0 Core 160-167
Rank 117 Node 0 Core 168-175
Rank 118 Node 0 Core 176-183
Rank 119 Node 0 Core 184-191
Rank 120 Node 0 Core 192-199
Rank 121 Node 0 Core 200-207
Rank 122 Node 0 Core 208-215
Rank 123 Node 0 Core 216-223
Rank 124 Node 0 Core 224-231
Rank 125 Node 0 Core 232-239
Rank 126 Node 0 Core 240-247
Rank 127 Node 0 Core 248-255
Rank 128 Node 0 Core 0-7
Rank 129 Node 0 Core 8-15
Rank 130 Node 0 Core 16-23
Rank 131 Node 0 Core 24-31
Rank 132 Node 0 Core 32-39
Rank 133 Node 0 Core 40-47
Rank 134 Node 0 Core 48-55
Rank 135 Node 0 Core 56-63
Rank 136 Node 0 Core 64-71
Rank 137 Node 0 Core 72-79
Rank 138 Node 0 Core 80-87
Rank 139 Node 0 Core 88-95
Rank 140 Node 0 Core 96-103
Rank 141 Node 0 Core 104-111
Rank 142 Node 0 Core 112-119
Rank 143 Node 0 Core 120-127
Rank 144 Node 0 Core 128-135
Rank 145 Node 0 Core 136-143
Rank 146 Node 0 Core 144-151
Rank 147 Node 0 Core 152-159
Rank 148 Node 0 Core 160-167
Rank 149 Node 0 Core 168-175
Rank 150 Node 0 Core 176-183
Rank 151 Node 0 Core 184-191
Rank 152 Node 0 Core 192-199
Rank 153 Node 0 Core 200-207
Rank 154 Node 0 Core 208-215
Rank 155 Node 0 Core 216-223
Rank 156 Node 0 Core 224-231
Rank 157 Node 0 Core 232-239
Rank 158 Node 0 Core 240-247
Rank 159 Node 0 Core 248-255
Rank 160 Node 0 Core 0-7
Rank 161 Node 0 Core 8-15
Rank 162 Node 0 Core 16-23
Rank 163 Node 0 Core 24-31
Rank 164 Node 0 Core 32-39
Rank 165 Node 0 Core 40-47
Rank 166 Node 0 Core 48-55
Rank 167 Node 0 Core 56-63
Rank 168 Node 0 Core 64-71
Rank 169 Node 0 Core 72-79
Rank 170 Node 0 Core 80-87
Rank 171 Node 0 Core 88-95
Rank 172 Node 0 Core 96-103
Rank 173 Node 0 Core 104-111
Rank 174 Node 0 Core 112-119
Rank 175 Node 0 Core 120-127
Rank 176 Node 0 Core 128-135
Rank 177 Node 0 Core 136-143
Rank 178 Node 0 Core 144-151
Rank 179 Node 0 Core 152-159
Rank 180 Node 0 Core 160-167
Rank 181 Node 0 Core 168-175
Rank 182 Node 0 Core 176-183
Rank 183 Node 0 Core 184-191
Rank 184 Node 0 Core 192-199
Rank 185 Node 0 Core 200-207
Rank 186 Node 0 Core 208-215
Rank 187 Node 0 Core 216-223
Rank 188 Node 0 Core 224-231
Rank 189 Node 0 Core 232-239
Rank 190 Node 0 Core 240-247
Rank 191 Node 0 Core 248-255
Rank 192 Node 0 Core 0-7
Rank 193 Node 0 Core 8-15
Rank 194 Node 0 Core 16-23
Rank 195 Node 0 Core 24-31
Rank 196 Node 0 Core 32-39
Rank 197 Node 0 Core 40-47
Rank 198 Node 0 Core 48-55
Rank 199 Node 0 Core 56-63
Rank 200 Node 0 Core 64-71
Rank 201 Node 0 Core 72-79
Rank 202 Node 0 Core 80-87
Rank 203 Node 0 Core 88-95
Rank 204 Node 0 Core 96-103
Rank 205 Node 0 Core 104-111
Rank 206 Node 0 Core 112-119
Rank 207 Node 0 Core 120-127
Rank 208 Node 0 Core 128-135
Rank 209 Node 0 Core 136-143
Rank 210 Node 0 Core 144-151
Rank 211 Node 0 Core 152-159
Rank 212 Node 0 Core 160-167
Rank 213 Node 0 Core 168-175
Rank 214 Node 0 Core 176-183
Rank 215 Node 0 Core 184-191
Rank 216 Node 0 Core 192-199
Rank 217 Node 0 Core 200-207
Rank 218 Node 0 Core 208-215
Rank 219 Node 0 Core 216-223
Rank 220 Node 0 Core 224-231
Rank 221 Node 0 Core 232-239
Rank 222 Node 0 Core 240-247
Rank 223 Node 0 Core 248-255
Rank 224 Node 0 Core 0-7
Rank 225 Node 0 Core 8-15
Rank 226 Node 0 Core 16-23
Rank 227 Node 0 Core 24-31
Rank 228 Node 0 Core 32-39
Rank 229 Node 0 Core 40-47
Rank 230 Node 0 Core 48-55
Rank 231 Node 0 Core 56-63
Rank 232 Node 0 Core 64-71
Rank 233 Node 0 Core 72-79
Rank 234 Node 0 Core 80-87
Rank 235 Node 0 Core 88-95
Rank 236 Node 0 Core 96-103
Rank 237 Node 0 Core 104-111
Rank 238 Node 0 Core 112-119
Rank 239 Node 0 Core 120-127
Rank 240 Node 0 Core 128-135
Rank 241 Node 0 Core 136-143
Rank 242 Node 0 Core 144-151
Rank 243 Node 0 Core 152-159
Rank 244 Node 0 Core 160-167
Rank 245 Node 0 Core 168-175
Rank 246 Node 0 Core 176-183
Rank 247 Node 0 Core 184-191
Rank 248 Node 0 Core 192-199
Rank 249 Node 0 Core 200-207
Rank 250 Node 0 Core 208-215
Rank 251 Node 0 Core 216-223
Rank 252 Node 0 Core 224-231
Rank 253 Node 0 Core 232-239
Rank 254 Node 0 Core 240-247
Rank 255 Node 0 Core 248-255
$
```

[No.21]

```sh
$ OMP_NUM_THREADS=8 OMP_PROC_BIND=TRUE srun -p e6 -n 32 -c 8 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 16 18 19 17\`; do seq -s, $i 4 $((i+12)) | tr '\n' ','; done | sed 's/,$//g'` bash -c 'sleep $SLURM_PROCID; echo "Rank $SLURM_PROCID Node $SLURM_NODEID"; ./show_thread_bind | sort -k 2n,2'
Rank 0 Node 0
Thread  0 Core   0
Thread  1 Core   1
Thread  2 Core   2
Thread  3 Core   3
Thread  4 Core   4
Thread  5 Core   5
Thread  6 Core   6
Thread  7 Core   7
Rank 1 Node 0
Thread  0 Core   8
Thread  1 Core   9
Thread  2 Core  10
Thread  3 Core  11
Thread  4 Core  12
Thread  5 Core  13
Thread  6 Core  14
Thread  7 Core  15
Rank 2 Node 0
Thread  0 Core  16
Thread  1 Core  17
Thread  2 Core  18
Thread  3 Core  19
Thread  4 Core  20
Thread  5 Core  21
Thread  6 Core  22
Thread  7 Core  23
Rank 3 Node 0
Thread  0 Core  24
Thread  1 Core  25
Thread  2 Core  26
Thread  3 Core  27
Thread  4 Core  28
Thread  5 Core  29
Thread  6 Core  30
Thread  7 Core  31
Rank 4 Node 0
Thread  0 Core  32
Thread  1 Core  33
Thread  2 Core  34
Thread  3 Core  35
Thread  4 Core  36
Thread  5 Core  37
Thread  6 Core  38
Thread  7 Core  39
Rank 5 Node 0
Thread  0 Core  40
Thread  1 Core  41
Thread  2 Core  42
Thread  3 Core  43
Thread  4 Core  44
Thread  5 Core  45
Thread  6 Core  46
Thread  7 Core  47
Rank 6 Node 0
Thread  0 Core  48
Thread  1 Core  49
Thread  2 Core  50
Thread  3 Core  51
Thread  4 Core  52
Thread  5 Core  53
Thread  6 Core  54
Thread  7 Core  55
Rank 7 Node 0
Thread  0 Core  56
Thread  1 Core  57
Thread  2 Core  58
Thread  3 Core  59
Thread  4 Core  60
Thread  5 Core  61
Thread  6 Core  62
Thread  7 Core  63
Rank 8 Node 0
Thread  0 Core  64
Thread  1 Core  65
Thread  2 Core  66
Thread  3 Core  67
Thread  4 Core  68
Thread  5 Core  69
Thread  6 Core  70
Thread  7 Core  71
Rank 9 Node 0
Thread  0 Core  72
Thread  1 Core  73
Thread  2 Core  74
Thread  3 Core  75
Thread  4 Core  76
Thread  5 Core  77
Thread  6 Core  78
Thread  7 Core  79
Rank 10 Node 0
Thread  0 Core  80
Thread  1 Core  81
Thread  2 Core  82
Thread  3 Core  83
Thread  4 Core  84
Thread  5 Core  85
Thread  6 Core  86
Thread  7 Core  87
Rank 11 Node 0
Thread  0 Core  88
Thread  1 Core  89
Thread  2 Core  90
Thread  3 Core  91
Thread  4 Core  92
Thread  5 Core  93
Thread  6 Core  94
Thread  7 Core  95
Rank 12 Node 0
Thread  0 Core  96
Thread  1 Core  97
Thread  2 Core  98
Thread  3 Core  99
Thread  4 Core 100
Thread  5 Core 101
Thread  6 Core 102
Thread  7 Core 103
Rank 13 Node 0
Thread  0 Core 104
Thread  1 Core 105
Thread  2 Core 106
Thread  3 Core 107
Thread  4 Core 108
Thread  5 Core 109
Thread  6 Core 110
Thread  7 Core 111
Rank 14 Node 0
Thread  0 Core 112
Thread  1 Core 113
Thread  2 Core 114
Thread  3 Core 115
Thread  4 Core 116
Thread  5 Core 117
Thread  6 Core 118
Thread  7 Core 119
Rank 15 Node 0
Thread  0 Core 120
Thread  1 Core 121
Thread  2 Core 122
Thread  3 Core 123
Thread  4 Core 124
Thread  5 Core 125
Thread  6 Core 126
Thread  7 Core 127
Rank 16 Node 0
Thread  0 Core 128
Thread  1 Core 129
Thread  2 Core 130
Thread  3 Core 131
Thread  4 Core 132
Thread  5 Core 133
Thread  6 Core 134
Thread  7 Core 135
Rank 17 Node 0
Thread  0 Core 136
Thread  1 Core 137
Thread  2 Core 138
Thread  3 Core 139
Thread  4 Core 140
Thread  5 Core 141
Thread  6 Core 142
Thread  7 Core 143
Rank 18 Node 0
Thread  0 Core 144
Thread  1 Core 145
Thread  2 Core 146
Thread  3 Core 147
Thread  4 Core 148
Thread  5 Core 149
Thread  6 Core 150
Thread  7 Core 151
Rank 19 Node 0
Thread  0 Core 152
Thread  1 Core 153
Thread  2 Core 154
Thread  3 Core 155
Thread  4 Core 156
Thread  5 Core 157
Thread  6 Core 158
Thread  7 Core 159
Rank 20 Node 0
Thread  0 Core 160
Thread  1 Core 161
Thread  2 Core 162
Thread  3 Core 163
Thread  4 Core 164
Thread  5 Core 165
Thread  6 Core 166
Thread  7 Core 167
Rank 21 Node 0
Thread  0 Core 168
Thread  1 Core 169
Thread  2 Core 170
Thread  3 Core 171
Thread  4 Core 172
Thread  5 Core 173
Thread  6 Core 174
Thread  7 Core 175
Rank 22 Node 0
Thread  0 Core 176
Thread  1 Core 177
Thread  2 Core 178
Thread  3 Core 179
Thread  4 Core 180
Thread  5 Core 181
Thread  6 Core 182
Thread  7 Core 183
Rank 23 Node 0
Thread  0 Core 184
Thread  1 Core 185
Thread  2 Core 186
Thread  3 Core 187
Thread  4 Core 188
Thread  5 Core 189
Thread  6 Core 190
Thread  7 Core 191
Rank 24 Node 0
Thread  0 Core 192
Thread  1 Core 193
Thread  2 Core 194
Thread  3 Core 195
Thread  4 Core 196
Thread  5 Core 197
Thread  6 Core 198
Thread  7 Core 199
Rank 25 Node 0
Thread  0 Core 200
Thread  1 Core 201
Thread  2 Core 202
Thread  3 Core 203
Thread  4 Core 204
Thread  5 Core 205
Thread  6 Core 206
Thread  7 Core 207
Rank 26 Node 0
Thread  0 Core 208
Thread  1 Core 209
Thread  2 Core 210
Thread  3 Core 211
Thread  4 Core 212
Thread  5 Core 213
Thread  6 Core 214
Thread  7 Core 215
Rank 27 Node 0
Thread  0 Core 216
Thread  1 Core 217
Thread  2 Core 218
Thread  3 Core 219
Thread  4 Core 220
Thread  5 Core 221
Thread  6 Core 222
Thread  7 Core 223
Rank 28 Node 0
Thread  0 Core 224
Thread  1 Core 225
Thread  2 Core 226
Thread  3 Core 227
Thread  4 Core 228
Thread  5 Core 229
Thread  6 Core 230
Thread  7 Core 231
Rank 29 Node 0
Thread  0 Core 232
Thread  1 Core 233
Thread  2 Core 234
Thread  3 Core 235
Thread  4 Core 236
Thread  5 Core 237
Thread  6 Core 238
Thread  7 Core 239
Rank 30 Node 0
Thread  0 Core 240
Thread  1 Core 241
Thread  2 Core 242
Thread  3 Core 243
Thread  4 Core 244
Thread  5 Core 245
Thread  6 Core 246
Thread  7 Core 247
Rank 31 Node 0
Thread  0 Core 248
Thread  1 Core 249
Thread  2 Core 250
Thread  3 Core 251
Thread  4 Core 252
Thread  5 Core 253
Thread  6 Core 254
Thread  7 Core 255
$
```
