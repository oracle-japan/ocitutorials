---
title: "パフォーマンスを考慮したプロセス・スレッドのコア割当て指定方法（BM.Standard.E5.192編）"
excerpt: "NUMAアーキテクチャを採用するインスタンスに於けるMPIやOpenMPの並列プログラム実行は、生成されるプロセスやスレッドをどのようにインスタンスのコアに割当てるかでその性能が大きく変動するため、その配置を意識してアプリケーションを実行することが求められます。このため、使用するシェイプに搭載されるプロセッサのアーキテクチャやアプリケーションの特性に合わせて意図したとおりにプロセスやスレッドをコアに配置するために必要な、MPI実装、OpenMP実装、及びジョブスケジューラが有するコア割当て制御機能に精通している必要があります。本パフォーマンス関連Tipsは、MPI実装にOpenMPI、OpenMP実装にGNUコンパイラ、及びジョブスケジューラにSlurmを取り上げ、第4世代AMD EPYCプロセッサを搭載するベア・メタル・シェイプBM.Standard.E5.192でこれらのコア割当て機能を駆使してプロセス・スレッドのコア割当てを行う方法を解説します。"
order: "227"
layout: single
header:
  teaser: "/hpc/benchmark/cpu-binding-e5/e5_architecture_nps4.png"
  overlay_image: "/hpc/benchmark/cpu-binding-e5/e5_architecture_nps4.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

## 0-0. 概要

本パフォーマンス関連Tipsは、NUMA（Non-Umiform Memory Access）アーキテクチャを採用するインスタンスに於ける並列プログラムの実行時性能に大きく影響する、MPIが生成するプロセスとOpenMPが生成するスレッドのコア割当てについて、アプリケーション性能に有利となる典型的なパターンを例に挙げ、以下の観点でその実行方法を解説します。

1. **[PRRTEを使用するプロセス・スレッドのコア割当て](#1-prrteを使用するプロセススレッドのコア割当て)**  
この割当て方法は、 **[OpenMPI](https://www.open-mpi.org/)** に同梱される **[PRRTE](https://github.com/openpmix/prrte)** のMPIプロセスのコア割当て機能と、 **GNUコンパイラ** のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。  
この方法は、ジョブスケジューラを使用せずに **mpirun** を使用してMPI並列アプリケーションをインタラクティブに実行する場合に使用します。
2. **[Slurmを使用するプロセス・スレッドのコア割当て](#2-slurmを使用するプロセススレッドのコア割当て)**   
この割当て方法は、 **[Slurm](https://slurm.schedmd.com/)** のMPIプロセスのコア割当て機能と、 **GNUコンパイラ** のOpenMPスレッドのコア割当て機能を組合せて、意図したプロセス・スレッドのコア割当てを実現します。  
この方法は、 **Slurm** のジョブスケジューラ環境で **srun** を使用してMPI並列アプリケーションを実行する場合に使用します。

また **[最後の章](#3-プロセススレッドのコア割当て確認方法)** では、プロセス・スレッドのコア割当てが想定通りに行われているかどうかを確認する方法と、この方法を使用して本パフォーマンス関連Tipsで紹介したコア割当てを行った際の出力例を紹介します。

なお、プロセス・スレッドのコア割当て同様に並列プログラムの実行時性能に大きく影響するメモリ割り当ては、割当てられるコアと同一NUMAノード内のメモリを割り当てることにより多くのケースで性能が最大となることから、以下のように **- -localalloc** オプションを付与した **numactl** コマンドの使用を前提とし、本パフォーマンス関連Tipsの実行例を記載します。

```sh
$ numactl --localalloc a.out
```

## 0-1. 前提システム

プロセス・スレッドのコア割当ては、使用するインスタンスのNUMAアーキテクチャやNUMAノードの構成方法に影響を受けますが、本パフォーマンス関連Tipsでは第4世代 **AMD EPYC** プロセッサを搭載する **[BM.Standard.E5.192](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-standard)** を使用し、NUMAノード構成に **NUMA nodes per socket** （以降 **NPS** と呼称します。）が **1** （これがデフォルトで、以降 **NPS1** と呼称します。）と **4** （以降 **NPS4** と呼称します。）の場合を取り上げ（※1）、それぞれに関するコア割当て方法を解説します。

また使用する **BM.Standard.E5.192** は、 **Simultanious Multi Threading** （以降 **SMT** と呼称します。）を無効化（デフォルトは有効です。）しています。（※1）

※1）**NPS** と **SMT** の設定方法は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** を参照してください。

以下は、 **BM.Standard.E5.192** のスペックです。

- CPU
    - **AMD EPYC** 9654ベース x 2
    - コア数： 192（ソケット当たり96・ **Core Complex Die** （※2）あたり8）
    - **CCD** 数： 24
    - L3キャッシュ： 768 MB（ **CCD** 当たり32 MB）
    - 理論性能： 7.3728 TFLOPS（ベース動作周波数2.4 GHz時）
- メモリ
    - テクノロジ： DDR5
    - チャネル数： 24
    - 帯域： 921.6 GB/s
    - 容量： 2.3 TB

※2）以降 **CCD** と呼称します。

また以下は、 **BM.Standard.E5.192** のアーキテクチャ図です。

![BM.Standard.E5.192アーキテクチャ図 NPS1](e5_architecture_nps1.png)

![BM.Standard.E5.192アーキテクチャ図 NPS4](e5_architecture_nps4.png)

## 0-2. コア割当てパターン

本パフォーマンス関連Tipsで取り上げるプロセス・スレッドのコア割当ては、パフォーマンスの観点で利用頻度の高い以下のパターンを解説します。  
ここで取り上げるコア割当てパターンは、第4世代 **AMD EPYC** プロセッサが **CCD** 単位にL3キャッシュを搭載し、L3キャッシュ当たりの割当てコア数を均等にすることで性能向上を得やすい点を考慮します。

| No.    | NPS      | ノード当たり<br>プロセス数 | プロセス当たり<br>スレッド数 | プロセス分割方法<br>（※2） | 備考                                           |
| :----: | :------: | :-------------: | :--------------: | :--------------: | :------------------------------------------: |
| **1**  | **NPS1** | 1               | 1                | -                | -                                            |
| **2**  | **NPS1** | 2               | 1                | -                | **NUMA** ノード当たり1プロセス                         |
| **3**  | **NPS1** | 24              | 1                | -                | **CCD** 当たり1プロセス                             |
| **4**  | **NPS1** | 48              | 1                | ブロック分割           | **CCD** 当たり2プロセス                             |
| **5**  | **NPS1** | 48              | 1                | サイクリック分割         | **CCD** 当たり2プロセス                             |
| **6**  | **NPS1** | 96              | 1                | ブロック分割           | **CCD** 当たり4プロセス                             |
| **7**  | **NPS1** | 96              | 1                | サイクリック分割         | **CCD** 当たり4プロセス                             |
| **8**  | **NPS1** | 192             | 1                | ブロック分割           | **CCD** 当たり8プロセス                             |
| **9**  | **NPS1** | 192             | 1                | サイクリック分割         | **CCD** 当たり8プロセス                             |
| **10** | **NPS1** | 2               | 96               | -                | **NUMA** ノード当たり1プロセス<br>MPI/OpenMPハイブリッド並列実行 |
| **11** | **NPS1** | 24              | 8                | -                | **CCD** 当たり1プロセス<br>MPI/OpenMPハイブリッド並列実行     |
| **12** | **NPS4** | 8               | 1                | -                | **NUMA** ノード当たり1プロセス                         |
| **13** | **NPS4** | 24              | 1                | -                | **CCD** 当たり1プロセス                             |
| **14** | **NPS4** | 48              | 1                | ブロック分割           | **CCD** 当たり2プロセス                             |
| **15** | **NPS4** | 48              | 1                | サイクリック分割         | **CCD** 当たり2プロセス                             |
| **16** | **NPS4** | 96              | 1                | ブロック分割           | **CCD** 当たり4プロセス                             |
| **17** | **NPS4** | 96              | 1                | サイクリック分割         | **CCD** 当たり4プロセス                             |
| **18** | **NPS4** | 192             | 1                | ブロック分割           | **CCD** 当たり8プロセス                             |
| **19** | **NPS4** | 192             | 1                | サイクリック分割         | **CCD** 当たり8プロセス                             |
| **20** | **NPS4** | 8               | 24               | -                | **NUMA** ノード当たり1プロセス<br>MPI/OpenMPハイブリッド並列実行 |
| **21** | **NPS4** | 24              | 8                | -                | **CCD** 当たり1プロセス<br>MPI/OpenMPハイブリッド並列実行     |

※2） **CCD** に対するプロセスの分割方法を示します。

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

本章は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従って構築された **OpenMPI** に含まれる **PRRTE** を使用し、 **[0-2. コア割当てパターン](#0-2-コア割当てパターン)** に記載のコア割当てを実現する方法を解説します。

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
$ mpirun -n 192 --bind-to core --map-by ppr:8:l3cache --rank-by span numactl --localalloc ./a.out
```

また **No. 11** のコア割当てを行う場合のコマンドは、以下になります。

```sh
$ mpirun -n 24 --bind-to core --map-by ppr:1:l3cache:PE=8 -x OMP_NUM_THREAD=8 -x OMP_PROC_BIND=TRUE numactl --localalloc ./a.out
```

以降では、コア割当てパターンを実現するオプション・環境変数の組み合わせを解説します。

## 1-1. 各コア割当てパターンのオプション・環境変数組合せ

本章は、 **[0-2. コア割当てパターン](#0-2-コア割当てパターン)** に記載のコア割当てを実現するための、 **mpirun** コマンドオプションと **GNUコンパイラ** 環境変数の組合せを記載します。  
なお、表中に **-** と記載されている箇所は、そのオプション・環境変数を指定する必要が無い（デフォルトのままで良い）ことを示します。

| No.    | -n  | - -bind-to | - -map-by           | - -rank-by | OMP_NUM_THREADS | OMP_PROC_BIND |
| :----: | :-: | :--------: | :-----------------: | :--------: | :-------------: | :-----------: |
| **1**  | 1   | -          | -                   | -          | -               | -             |
| **2**  | 2   | core       | ppr:1:package       | -          | -               | -             |
| **3**  | 24  | core       | ppr:1:l3cache       | -          | -               | -             |
| **4**  | 48  | core       | ppr:2:l3cache       | -          | -               | -             |
| **5**  | 48  | core       | ppr:2:l3cache       | span       | -               | -             |
| **6**  | 96  | core       | ppr:4:l3cache       | -          | -               | -             |
| **7**  | 96  | core       | ppr:4:l3cache       | span       | -               | -             |
| **8**  | 192 | core       | -                   | -          | -               | -             |
| **9**  | 192 | core       | ppr:8:l3cache       | span       | -               | -             |
| **10** | 2   | core       | ppr:1:package:PE=96 | -          | 96              | TRUE          |
| **11** | 24  | core       | ppr:1:l3cache:PE=8  | -          | 8               | TRUE          |
| **12** | 8   | core       | ppr:1:numa          | -          | -               | -             |
| **13** | 24  | core       | ppr:1:l3cache       | -          | -               | -             |
| **14** | 48  | core       | ppr:2:l3cache       | -          | -               | -             |
| **15** | 48  | core       | ppr:2:l3cache       | span       | -               | -             |
| **16** | 96  | core       | ppr:4:l3cache       | -          | -               | -             |
| **17** | 96  | core       | ppr:4:l3cache       | span       | -               | -             |
| **18** | 192 | core       | -                   | -          | -               | -             |
| **19** | 192 | core       | ppr:8:l3cache       | span       | -               | -             |
| **20** | 8   | core       | ppr:1:numa:PE=24    | -          | 24              | TRUE          |
| **21** | 24  | core       | ppr:1:l3cache:PE=8  | -          | 8               | TRUE          |

***
# 2. Slurmを使用するプロセス・スレッドのコア割当て

## 2-0. 概要

本章は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** と **[Oracle Linuxプラットフォーム・イメージベースのHPCワークロード実行環境構築方法](/ocitutorials/hpc/tech-knowhow/build-oraclelinux-hpcenv/)** に従って構築された **BM.Standard.E5.192** を計算ノードとする **Slurm** ジョブスケジューラ環境で、 **[0-2. コア割当てパターン](#0-2-コア割当てパターン)** に記載のコア割当てを実現する方法を解説します。

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
$ srun -p e5 -n 192 --cpu-bind=map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` numactl --localalloc ./a.out
```

また **No. 11** のコア割当てを行う場合のコマンドは、以下になります。

```sh
$ OMP_NUM_THREADS=8 OMP_PROC_BIND=TRUE srun -p e5 -n 24 -c 8 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do seq -s, $i 4 $((i+8)) | tr '\n' ','; done | sed 's/,$//g'` numactl --localalloc ./a.out
```

以降では、コア割当てパターンを実現するオプション・環境変数の組み合わせを解説します。

## 2-1. 各コア割当てパターンのオプション・環境変数組合せ

本章は、 **[0-2. コア割当てパターン](#0-2-コア割当てパターン)** に記載のコア割当てを実現するための、 **srun** コマンドオプションと **GNUコンパイラ** 環境変数の組合せを記載します。  
なお、表中に **-** と記載されている箇所は、そのオプション・環境変数を指定する必要が無い（デフォルトのままで良い）ことを示します。

|No.|-p|-n|-c|- -cpu-bind|-m|OMP_NUM_THREADS|OMP_PROC_BIND|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|**1**|e5|1|-|cores|-|-|-|
|**2**|e5|2|-|cores|-|-|-|
|**3**|e5|24|-|（※4）|-|-|-|
|**4**|e5|48|-|（※4）|-|-|-|
|**5**|e5|48|-|（※4）|-|-|-|
|**6**|e5|96|-|（※4）|-|-|-|
|**7**|e5|96|-|（※4）|-|-|-|
|**8**|e5|192|-|（※4）|-|-|-|
|**9**|e5|192|-|（※4）|-|-|-|
|**10**|e5|2|96|socket|-|96|TRUE|
|**11**|e5|24|8|（※4）|-|8|TRUE|
|**12**|e5|8|-|（※4）|-|-|-|
|**13**|e5|24|-|（※4）|-|-|-|
|**14**|e5|48|-|（※4）|-|-|-|
|**15**|e5|48|-|（※4）|-|-|-|
|**16**|e5|96|-|（※4）|-|-|-|
|**17**|e5|96|-|（※4）|-|-|-|
|**18**|e5|192|-|（※4）|-|-|-|
|**19**|e5|192|-|（※4）|-|-|-|
|**21**|e5|24|8|（※4）|-|8|TRUE|

※4）コア割当てパターンの番号に応じて、 **- -cpu-bind** オプションの値に以下を指定します。

[No. 3]
```sh
map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do seq -s, $i 4 $((i+8)) | tr '\n' ','; done | sed 's/,$//g'`
```

[No. 4]
```sh
map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do for j in \`seq $i 4 $((i+8))\`; do for k in \`seq 0 1\`; do echo -n $j","; done; done; done | sed 's/,$//g'`
```

[No. 5]
```sh
map_ldom:`for i in \`seq 0 1\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 6]
```sh
map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do for j in \`seq $i 4 $((i+8))\`; do for k in \`seq 0 3\`; do echo -n $j","; done; done; done | sed 's/,$//g'`
```

[No. 7]
```sh
map_ldom:`for i in \`seq 0 3\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 8]
```sh
map_cpu:`seq -s, 0 191 | tr -d '\n'`
```

[No. 9]
```sh
map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 11]
```sh
map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do seq -s, $i 4 $((i+8)) | tr '\n' ','; done | sed 's/,$//g'`
```

[No. 12]
```sh
map_cpu:`seq -s, 0 24 191 | tr -d '\n'`
```

[No. 13]
```sh
map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do seq -s, $i 4 $((i+8)) | tr '\n' ','; done | sed 's/,$//g'`
```

[No. 14]
```sh
map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do for j in \`seq $i 4 $((i+8))\`; do for k in \`seq 0 1\`; do echo -n $j","; done; done; done | sed 's/,$//g'`
```

[No. 15]
```sh
map_ldom:`for i in \`seq 0 1\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 16]
```sh
map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do for j in \`seq $i 4 $((i+8))\`; do for k in \`seq 0 3\`; do echo -n $j","; done; done; done | sed 's/,$//g'`
```

[No. 17]
```sh
map_ldom:`for i in \`seq 0 3\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 18]
```sh
map_cpu:`seq -s, 0 191 | tr -d '\n'`
```

[No. 19]
```sh
map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'`
```

[No. 21]
```sh
map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do seq -s, $i 4 $((i+8)) | tr '\n' ','; done | sed 's/,$//g'`
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
[inst-e5-ol95-nps1:15404] Rank 0 bound to package[0][core:0]
$
```

[No.2]

```sh
$ mpirun -n 2 --bind-to core --map-by ppr:1:package --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps1:15420] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps1:15420] Rank 1 bound to package[1][core:96]
$
```

[No.3]

```sh
$ mpirun -n 24 --bind-to core --map-by ppr:1:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps1:15429] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps1:15429] Rank 1 bound to package[0][core:8]
[inst-e5-ol95-nps1:15429] Rank 2 bound to package[0][core:16]
[inst-e5-ol95-nps1:15429] Rank 3 bound to package[0][core:24]
[inst-e5-ol95-nps1:15429] Rank 4 bound to package[0][core:32]
[inst-e5-ol95-nps1:15429] Rank 5 bound to package[0][core:40]
[inst-e5-ol95-nps1:15429] Rank 6 bound to package[0][core:48]
[inst-e5-ol95-nps1:15429] Rank 7 bound to package[0][core:56]
[inst-e5-ol95-nps1:15429] Rank 8 bound to package[0][core:64]
[inst-e5-ol95-nps1:15429] Rank 9 bound to package[0][core:72]
[inst-e5-ol95-nps1:15429] Rank 10 bound to package[0][core:80]
[inst-e5-ol95-nps1:15429] Rank 11 bound to package[0][core:88]
[inst-e5-ol95-nps1:15429] Rank 12 bound to package[1][core:96]
[inst-e5-ol95-nps1:15429] Rank 13 bound to package[1][core:104]
[inst-e5-ol95-nps1:15429] Rank 14 bound to package[1][core:112]
[inst-e5-ol95-nps1:15429] Rank 15 bound to package[1][core:120]
[inst-e5-ol95-nps1:15429] Rank 16 bound to package[1][core:128]
[inst-e5-ol95-nps1:15429] Rank 17 bound to package[1][core:136]
[inst-e5-ol95-nps1:15429] Rank 18 bound to package[1][core:144]
[inst-e5-ol95-nps1:15429] Rank 19 bound to package[1][core:152]
[inst-e5-ol95-nps1:15429] Rank 20 bound to package[1][core:160]
[inst-e5-ol95-nps1:15429] Rank 21 bound to package[1][core:168]
[inst-e5-ol95-nps1:15429] Rank 22 bound to package[1][core:176]
[inst-e5-ol95-nps1:15429] Rank 23 bound to package[1][core:184]
$
```

[No.4]

```sh
$ mpirun -n 48 --bind-to core --map-by ppr:2:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps1:15458] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps1:15458] Rank 1 bound to package[0][core:1]
[inst-e5-ol95-nps1:15458] Rank 2 bound to package[0][core:8]
[inst-e5-ol95-nps1:15458] Rank 3 bound to package[0][core:9]
[inst-e5-ol95-nps1:15458] Rank 4 bound to package[0][core:16]
[inst-e5-ol95-nps1:15458] Rank 5 bound to package[0][core:17]
[inst-e5-ol95-nps1:15458] Rank 6 bound to package[0][core:24]
[inst-e5-ol95-nps1:15458] Rank 7 bound to package[0][core:25]
[inst-e5-ol95-nps1:15458] Rank 8 bound to package[0][core:32]
[inst-e5-ol95-nps1:15458] Rank 9 bound to package[0][core:33]
[inst-e5-ol95-nps1:15458] Rank 10 bound to package[0][core:40]
[inst-e5-ol95-nps1:15458] Rank 11 bound to package[0][core:41]
[inst-e5-ol95-nps1:15458] Rank 12 bound to package[0][core:48]
[inst-e5-ol95-nps1:15458] Rank 13 bound to package[0][core:49]
[inst-e5-ol95-nps1:15458] Rank 14 bound to package[0][core:56]
[inst-e5-ol95-nps1:15458] Rank 15 bound to package[0][core:57]
[inst-e5-ol95-nps1:15458] Rank 16 bound to package[0][core:64]
[inst-e5-ol95-nps1:15458] Rank 17 bound to package[0][core:65]
[inst-e5-ol95-nps1:15458] Rank 18 bound to package[0][core:72]
[inst-e5-ol95-nps1:15458] Rank 19 bound to package[0][core:73]
[inst-e5-ol95-nps1:15458] Rank 20 bound to package[0][core:80]
[inst-e5-ol95-nps1:15458] Rank 21 bound to package[0][core:81]
[inst-e5-ol95-nps1:15458] Rank 22 bound to package[0][core:88]
[inst-e5-ol95-nps1:15458] Rank 23 bound to package[0][core:89]
[inst-e5-ol95-nps1:15458] Rank 24 bound to package[1][core:96]
[inst-e5-ol95-nps1:15458] Rank 25 bound to package[1][core:97]
[inst-e5-ol95-nps1:15458] Rank 26 bound to package[1][core:104]
[inst-e5-ol95-nps1:15458] Rank 27 bound to package[1][core:105]
[inst-e5-ol95-nps1:15458] Rank 28 bound to package[1][core:112]
[inst-e5-ol95-nps1:15458] Rank 29 bound to package[1][core:113]
[inst-e5-ol95-nps1:15458] Rank 30 bound to package[1][core:120]
[inst-e5-ol95-nps1:15458] Rank 31 bound to package[1][core:121]
[inst-e5-ol95-nps1:15458] Rank 32 bound to package[1][core:128]
[inst-e5-ol95-nps1:15458] Rank 33 bound to package[1][core:129]
[inst-e5-ol95-nps1:15458] Rank 34 bound to package[1][core:136]
[inst-e5-ol95-nps1:15458] Rank 35 bound to package[1][core:137]
[inst-e5-ol95-nps1:15458] Rank 36 bound to package[1][core:144]
[inst-e5-ol95-nps1:15458] Rank 37 bound to package[1][core:145]
[inst-e5-ol95-nps1:15458] Rank 38 bound to package[1][core:152]
[inst-e5-ol95-nps1:15458] Rank 39 bound to package[1][core:153]
[inst-e5-ol95-nps1:15458] Rank 40 bound to package[1][core:160]
[inst-e5-ol95-nps1:15458] Rank 41 bound to package[1][core:161]
[inst-e5-ol95-nps1:15458] Rank 42 bound to package[1][core:168]
[inst-e5-ol95-nps1:15458] Rank 43 bound to package[1][core:169]
[inst-e5-ol95-nps1:15458] Rank 44 bound to package[1][core:176]
[inst-e5-ol95-nps1:15458] Rank 45 bound to package[1][core:177]
[inst-e5-ol95-nps1:15458] Rank 46 bound to package[1][core:184]
[inst-e5-ol95-nps1:15458] Rank 47 bound to package[1][core:185]
$
```

[No.5]

```sh
$ mpirun -n 48 --bind-to core --map-by ppr:2:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps1:15518] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps1:15518] Rank 1 bound to package[0][core:8]
[inst-e5-ol95-nps1:15518] Rank 2 bound to package[0][core:16]
[inst-e5-ol95-nps1:15518] Rank 3 bound to package[0][core:24]
[inst-e5-ol95-nps1:15518] Rank 4 bound to package[0][core:32]
[inst-e5-ol95-nps1:15518] Rank 5 bound to package[0][core:40]
[inst-e5-ol95-nps1:15518] Rank 6 bound to package[0][core:48]
[inst-e5-ol95-nps1:15518] Rank 7 bound to package[0][core:56]
[inst-e5-ol95-nps1:15518] Rank 8 bound to package[0][core:64]
[inst-e5-ol95-nps1:15518] Rank 9 bound to package[0][core:72]
[inst-e5-ol95-nps1:15518] Rank 10 bound to package[0][core:80]
[inst-e5-ol95-nps1:15518] Rank 11 bound to package[0][core:88]
[inst-e5-ol95-nps1:15518] Rank 12 bound to package[1][core:96]
[inst-e5-ol95-nps1:15518] Rank 13 bound to package[1][core:104]
[inst-e5-ol95-nps1:15518] Rank 14 bound to package[1][core:112]
[inst-e5-ol95-nps1:15518] Rank 15 bound to package[1][core:120]
[inst-e5-ol95-nps1:15518] Rank 16 bound to package[1][core:128]
[inst-e5-ol95-nps1:15518] Rank 17 bound to package[1][core:136]
[inst-e5-ol95-nps1:15518] Rank 18 bound to package[1][core:144]
[inst-e5-ol95-nps1:15518] Rank 19 bound to package[1][core:152]
[inst-e5-ol95-nps1:15518] Rank 20 bound to package[1][core:160]
[inst-e5-ol95-nps1:15518] Rank 21 bound to package[1][core:168]
[inst-e5-ol95-nps1:15518] Rank 22 bound to package[1][core:176]
[inst-e5-ol95-nps1:15518] Rank 23 bound to package[1][core:184]
[inst-e5-ol95-nps1:15518] Rank 24 bound to package[0][core:1]
[inst-e5-ol95-nps1:15518] Rank 25 bound to package[0][core:9]
[inst-e5-ol95-nps1:15518] Rank 26 bound to package[0][core:17]
[inst-e5-ol95-nps1:15518] Rank 27 bound to package[0][core:25]
[inst-e5-ol95-nps1:15518] Rank 28 bound to package[0][core:33]
[inst-e5-ol95-nps1:15518] Rank 29 bound to package[0][core:41]
[inst-e5-ol95-nps1:15518] Rank 30 bound to package[0][core:49]
[inst-e5-ol95-nps1:15518] Rank 31 bound to package[0][core:57]
[inst-e5-ol95-nps1:15518] Rank 32 bound to package[0][core:65]
[inst-e5-ol95-nps1:15518] Rank 33 bound to package[0][core:73]
[inst-e5-ol95-nps1:15518] Rank 34 bound to package[0][core:81]
[inst-e5-ol95-nps1:15518] Rank 35 bound to package[0][core:89]
[inst-e5-ol95-nps1:15518] Rank 36 bound to package[1][core:97]
[inst-e5-ol95-nps1:15518] Rank 37 bound to package[1][core:105]
[inst-e5-ol95-nps1:15518] Rank 38 bound to package[1][core:113]
[inst-e5-ol95-nps1:15518] Rank 39 bound to package[1][core:121]
[inst-e5-ol95-nps1:15518] Rank 40 bound to package[1][core:129]
[inst-e5-ol95-nps1:15518] Rank 41 bound to package[1][core:137]
[inst-e5-ol95-nps1:15518] Rank 42 bound to package[1][core:145]
[inst-e5-ol95-nps1:15518] Rank 43 bound to package[1][core:153]
[inst-e5-ol95-nps1:15518] Rank 44 bound to package[1][core:161]
[inst-e5-ol95-nps1:15518] Rank 45 bound to package[1][core:169]
[inst-e5-ol95-nps1:15518] Rank 46 bound to package[1][core:177]
[inst-e5-ol95-nps1:15518] Rank 47 bound to package[1][core:185]
$
```

[No.6]

```sh
$ mpirun -n 96 --bind-to core --map-by ppr:4:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps1:15580] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps1:15580] Rank 1 bound to package[0][core:1]
[inst-e5-ol95-nps1:15580] Rank 2 bound to package[0][core:2]
[inst-e5-ol95-nps1:15580] Rank 3 bound to package[0][core:3]
[inst-e5-ol95-nps1:15580] Rank 4 bound to package[0][core:8]
[inst-e5-ol95-nps1:15580] Rank 5 bound to package[0][core:9]
[inst-e5-ol95-nps1:15580] Rank 6 bound to package[0][core:10]
[inst-e5-ol95-nps1:15580] Rank 7 bound to package[0][core:11]
[inst-e5-ol95-nps1:15580] Rank 8 bound to package[0][core:16]
[inst-e5-ol95-nps1:15580] Rank 9 bound to package[0][core:17]
[inst-e5-ol95-nps1:15580] Rank 10 bound to package[0][core:18]
[inst-e5-ol95-nps1:15580] Rank 11 bound to package[0][core:19]
[inst-e5-ol95-nps1:15580] Rank 12 bound to package[0][core:24]
[inst-e5-ol95-nps1:15580] Rank 13 bound to package[0][core:25]
[inst-e5-ol95-nps1:15580] Rank 14 bound to package[0][core:26]
[inst-e5-ol95-nps1:15580] Rank 15 bound to package[0][core:27]
[inst-e5-ol95-nps1:15580] Rank 16 bound to package[0][core:32]
[inst-e5-ol95-nps1:15580] Rank 17 bound to package[0][core:33]
[inst-e5-ol95-nps1:15580] Rank 18 bound to package[0][core:34]
[inst-e5-ol95-nps1:15580] Rank 19 bound to package[0][core:35]
[inst-e5-ol95-nps1:15580] Rank 20 bound to package[0][core:40]
[inst-e5-ol95-nps1:15580] Rank 21 bound to package[0][core:41]
[inst-e5-ol95-nps1:15580] Rank 22 bound to package[0][core:42]
[inst-e5-ol95-nps1:15580] Rank 23 bound to package[0][core:43]
[inst-e5-ol95-nps1:15580] Rank 24 bound to package[0][core:48]
[inst-e5-ol95-nps1:15580] Rank 25 bound to package[0][core:49]
[inst-e5-ol95-nps1:15580] Rank 26 bound to package[0][core:50]
[inst-e5-ol95-nps1:15580] Rank 27 bound to package[0][core:51]
[inst-e5-ol95-nps1:15580] Rank 28 bound to package[0][core:56]
[inst-e5-ol95-nps1:15580] Rank 29 bound to package[0][core:57]
[inst-e5-ol95-nps1:15580] Rank 30 bound to package[0][core:58]
[inst-e5-ol95-nps1:15580] Rank 31 bound to package[0][core:59]
[inst-e5-ol95-nps1:15580] Rank 32 bound to package[0][core:64]
[inst-e5-ol95-nps1:15580] Rank 33 bound to package[0][core:65]
[inst-e5-ol95-nps1:15580] Rank 34 bound to package[0][core:66]
[inst-e5-ol95-nps1:15580] Rank 35 bound to package[0][core:67]
[inst-e5-ol95-nps1:15580] Rank 36 bound to package[0][core:72]
[inst-e5-ol95-nps1:15580] Rank 37 bound to package[0][core:73]
[inst-e5-ol95-nps1:15580] Rank 38 bound to package[0][core:74]
[inst-e5-ol95-nps1:15580] Rank 39 bound to package[0][core:75]
[inst-e5-ol95-nps1:15580] Rank 40 bound to package[0][core:80]
[inst-e5-ol95-nps1:15580] Rank 41 bound to package[0][core:81]
[inst-e5-ol95-nps1:15580] Rank 42 bound to package[0][core:82]
[inst-e5-ol95-nps1:15580] Rank 43 bound to package[0][core:83]
[inst-e5-ol95-nps1:15580] Rank 44 bound to package[0][core:88]
[inst-e5-ol95-nps1:15580] Rank 45 bound to package[0][core:89]
[inst-e5-ol95-nps1:15580] Rank 46 bound to package[0][core:90]
[inst-e5-ol95-nps1:15580] Rank 47 bound to package[0][core:91]
[inst-e5-ol95-nps1:15580] Rank 48 bound to package[1][core:96]
[inst-e5-ol95-nps1:15580] Rank 49 bound to package[1][core:97]
[inst-e5-ol95-nps1:15580] Rank 50 bound to package[1][core:98]
[inst-e5-ol95-nps1:15580] Rank 51 bound to package[1][core:99]
[inst-e5-ol95-nps1:15580] Rank 52 bound to package[1][core:104]
[inst-e5-ol95-nps1:15580] Rank 53 bound to package[1][core:105]
[inst-e5-ol95-nps1:15580] Rank 54 bound to package[1][core:106]
[inst-e5-ol95-nps1:15580] Rank 55 bound to package[1][core:107]
[inst-e5-ol95-nps1:15580] Rank 56 bound to package[1][core:112]
[inst-e5-ol95-nps1:15580] Rank 57 bound to package[1][core:113]
[inst-e5-ol95-nps1:15580] Rank 58 bound to package[1][core:114]
[inst-e5-ol95-nps1:15580] Rank 59 bound to package[1][core:115]
[inst-e5-ol95-nps1:15580] Rank 60 bound to package[1][core:120]
[inst-e5-ol95-nps1:15580] Rank 61 bound to package[1][core:121]
[inst-e5-ol95-nps1:15580] Rank 62 bound to package[1][core:122]
[inst-e5-ol95-nps1:15580] Rank 63 bound to package[1][core:123]
[inst-e5-ol95-nps1:15580] Rank 64 bound to package[1][core:128]
[inst-e5-ol95-nps1:15580] Rank 65 bound to package[1][core:129]
[inst-e5-ol95-nps1:15580] Rank 66 bound to package[1][core:130]
[inst-e5-ol95-nps1:15580] Rank 67 bound to package[1][core:131]
[inst-e5-ol95-nps1:15580] Rank 68 bound to package[1][core:136]
[inst-e5-ol95-nps1:15580] Rank 69 bound to package[1][core:137]
[inst-e5-ol95-nps1:15580] Rank 70 bound to package[1][core:138]
[inst-e5-ol95-nps1:15580] Rank 71 bound to package[1][core:139]
[inst-e5-ol95-nps1:15580] Rank 72 bound to package[1][core:144]
[inst-e5-ol95-nps1:15580] Rank 73 bound to package[1][core:145]
[inst-e5-ol95-nps1:15580] Rank 74 bound to package[1][core:146]
[inst-e5-ol95-nps1:15580] Rank 75 bound to package[1][core:147]
[inst-e5-ol95-nps1:15580] Rank 76 bound to package[1][core:152]
[inst-e5-ol95-nps1:15580] Rank 77 bound to package[1][core:153]
[inst-e5-ol95-nps1:15580] Rank 78 bound to package[1][core:154]
[inst-e5-ol95-nps1:15580] Rank 79 bound to package[1][core:155]
[inst-e5-ol95-nps1:15580] Rank 80 bound to package[1][core:160]
[inst-e5-ol95-nps1:15580] Rank 81 bound to package[1][core:161]
[inst-e5-ol95-nps1:15580] Rank 82 bound to package[1][core:162]
[inst-e5-ol95-nps1:15580] Rank 83 bound to package[1][core:163]
[inst-e5-ol95-nps1:15580] Rank 84 bound to package[1][core:168]
[inst-e5-ol95-nps1:15580] Rank 85 bound to package[1][core:169]
[inst-e5-ol95-nps1:15580] Rank 86 bound to package[1][core:170]
[inst-e5-ol95-nps1:15580] Rank 87 bound to package[1][core:171]
[inst-e5-ol95-nps1:15580] Rank 88 bound to package[1][core:176]
[inst-e5-ol95-nps1:15580] Rank 89 bound to package[1][core:177]
[inst-e5-ol95-nps1:15580] Rank 90 bound to package[1][core:178]
[inst-e5-ol95-nps1:15580] Rank 91 bound to package[1][core:179]
[inst-e5-ol95-nps1:15580] Rank 92 bound to package[1][core:184]
[inst-e5-ol95-nps1:15580] Rank 93 bound to package[1][core:185]
[inst-e5-ol95-nps1:15580] Rank 94 bound to package[1][core:186]
[inst-e5-ol95-nps1:15580] Rank 95 bound to package[1][core:187]
$
```

[No.7]

```sh
$ mpirun -n 96 --bind-to core --map-by ppr:4:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps1:15697] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps1:15697] Rank 1 bound to package[0][core:8]
[inst-e5-ol95-nps1:15697] Rank 2 bound to package[0][core:16]
[inst-e5-ol95-nps1:15697] Rank 3 bound to package[0][core:24]
[inst-e5-ol95-nps1:15697] Rank 4 bound to package[0][core:32]
[inst-e5-ol95-nps1:15697] Rank 5 bound to package[0][core:40]
[inst-e5-ol95-nps1:15697] Rank 6 bound to package[0][core:48]
[inst-e5-ol95-nps1:15697] Rank 7 bound to package[0][core:56]
[inst-e5-ol95-nps1:15697] Rank 8 bound to package[0][core:64]
[inst-e5-ol95-nps1:15697] Rank 9 bound to package[0][core:72]
[inst-e5-ol95-nps1:15697] Rank 10 bound to package[0][core:80]
[inst-e5-ol95-nps1:15697] Rank 11 bound to package[0][core:88]
[inst-e5-ol95-nps1:15697] Rank 12 bound to package[1][core:96]
[inst-e5-ol95-nps1:15697] Rank 13 bound to package[1][core:104]
[inst-e5-ol95-nps1:15697] Rank 14 bound to package[1][core:112]
[inst-e5-ol95-nps1:15697] Rank 15 bound to package[1][core:120]
[inst-e5-ol95-nps1:15697] Rank 16 bound to package[1][core:128]
[inst-e5-ol95-nps1:15697] Rank 17 bound to package[1][core:136]
[inst-e5-ol95-nps1:15697] Rank 18 bound to package[1][core:144]
[inst-e5-ol95-nps1:15697] Rank 19 bound to package[1][core:152]
[inst-e5-ol95-nps1:15697] Rank 20 bound to package[1][core:160]
[inst-e5-ol95-nps1:15697] Rank 21 bound to package[1][core:168]
[inst-e5-ol95-nps1:15697] Rank 22 bound to package[1][core:176]
[inst-e5-ol95-nps1:15697] Rank 23 bound to package[1][core:184]
[inst-e5-ol95-nps1:15697] Rank 24 bound to package[0][core:1]
[inst-e5-ol95-nps1:15697] Rank 25 bound to package[0][core:9]
[inst-e5-ol95-nps1:15697] Rank 26 bound to package[0][core:17]
[inst-e5-ol95-nps1:15697] Rank 27 bound to package[0][core:25]
[inst-e5-ol95-nps1:15697] Rank 28 bound to package[0][core:33]
[inst-e5-ol95-nps1:15697] Rank 29 bound to package[0][core:41]
[inst-e5-ol95-nps1:15697] Rank 30 bound to package[0][core:49]
[inst-e5-ol95-nps1:15697] Rank 31 bound to package[0][core:57]
[inst-e5-ol95-nps1:15697] Rank 32 bound to package[0][core:65]
[inst-e5-ol95-nps1:15697] Rank 33 bound to package[0][core:73]
[inst-e5-ol95-nps1:15697] Rank 34 bound to package[0][core:81]
[inst-e5-ol95-nps1:15697] Rank 35 bound to package[0][core:89]
[inst-e5-ol95-nps1:15697] Rank 36 bound to package[1][core:97]
[inst-e5-ol95-nps1:15697] Rank 37 bound to package[1][core:105]
[inst-e5-ol95-nps1:15697] Rank 38 bound to package[1][core:113]
[inst-e5-ol95-nps1:15697] Rank 39 bound to package[1][core:121]
[inst-e5-ol95-nps1:15697] Rank 40 bound to package[1][core:129]
[inst-e5-ol95-nps1:15697] Rank 41 bound to package[1][core:137]
[inst-e5-ol95-nps1:15697] Rank 42 bound to package[1][core:145]
[inst-e5-ol95-nps1:15697] Rank 43 bound to package[1][core:153]
[inst-e5-ol95-nps1:15697] Rank 44 bound to package[1][core:161]
[inst-e5-ol95-nps1:15697] Rank 45 bound to package[1][core:169]
[inst-e5-ol95-nps1:15697] Rank 46 bound to package[1][core:177]
[inst-e5-ol95-nps1:15697] Rank 47 bound to package[1][core:185]
[inst-e5-ol95-nps1:15697] Rank 48 bound to package[0][core:2]
[inst-e5-ol95-nps1:15697] Rank 49 bound to package[0][core:10]
[inst-e5-ol95-nps1:15697] Rank 50 bound to package[0][core:18]
[inst-e5-ol95-nps1:15697] Rank 51 bound to package[0][core:26]
[inst-e5-ol95-nps1:15697] Rank 52 bound to package[0][core:34]
[inst-e5-ol95-nps1:15697] Rank 53 bound to package[0][core:42]
[inst-e5-ol95-nps1:15697] Rank 54 bound to package[0][core:50]
[inst-e5-ol95-nps1:15697] Rank 55 bound to package[0][core:58]
[inst-e5-ol95-nps1:15697] Rank 56 bound to package[0][core:66]
[inst-e5-ol95-nps1:15697] Rank 57 bound to package[0][core:74]
[inst-e5-ol95-nps1:15697] Rank 58 bound to package[0][core:82]
[inst-e5-ol95-nps1:15697] Rank 59 bound to package[0][core:90]
[inst-e5-ol95-nps1:15697] Rank 60 bound to package[1][core:98]
[inst-e5-ol95-nps1:15697] Rank 61 bound to package[1][core:106]
[inst-e5-ol95-nps1:15697] Rank 62 bound to package[1][core:114]
[inst-e5-ol95-nps1:15697] Rank 63 bound to package[1][core:122]
[inst-e5-ol95-nps1:15697] Rank 64 bound to package[1][core:130]
[inst-e5-ol95-nps1:15697] Rank 65 bound to package[1][core:138]
[inst-e5-ol95-nps1:15697] Rank 66 bound to package[1][core:146]
[inst-e5-ol95-nps1:15697] Rank 67 bound to package[1][core:154]
[inst-e5-ol95-nps1:15697] Rank 68 bound to package[1][core:162]
[inst-e5-ol95-nps1:15697] Rank 69 bound to package[1][core:170]
[inst-e5-ol95-nps1:15697] Rank 70 bound to package[1][core:178]
[inst-e5-ol95-nps1:15697] Rank 71 bound to package[1][core:186]
[inst-e5-ol95-nps1:15697] Rank 72 bound to package[0][core:3]
[inst-e5-ol95-nps1:15697] Rank 73 bound to package[0][core:11]
[inst-e5-ol95-nps1:15697] Rank 74 bound to package[0][core:19]
[inst-e5-ol95-nps1:15697] Rank 75 bound to package[0][core:27]
[inst-e5-ol95-nps1:15697] Rank 76 bound to package[0][core:35]
[inst-e5-ol95-nps1:15697] Rank 77 bound to package[0][core:43]
[inst-e5-ol95-nps1:15697] Rank 78 bound to package[0][core:51]
[inst-e5-ol95-nps1:15697] Rank 79 bound to package[0][core:59]
[inst-e5-ol95-nps1:15697] Rank 80 bound to package[0][core:67]
[inst-e5-ol95-nps1:15697] Rank 81 bound to package[0][core:75]
[inst-e5-ol95-nps1:15697] Rank 82 bound to package[0][core:83]
[inst-e5-ol95-nps1:15697] Rank 83 bound to package[0][core:91]
[inst-e5-ol95-nps1:15697] Rank 84 bound to package[1][core:99]
[inst-e5-ol95-nps1:15697] Rank 85 bound to package[1][core:107]
[inst-e5-ol95-nps1:15697] Rank 86 bound to package[1][core:115]
[inst-e5-ol95-nps1:15697] Rank 87 bound to package[1][core:123]
[inst-e5-ol95-nps1:15697] Rank 88 bound to package[1][core:131]
[inst-e5-ol95-nps1:15697] Rank 89 bound to package[1][core:139]
[inst-e5-ol95-nps1:15697] Rank 90 bound to package[1][core:147]
[inst-e5-ol95-nps1:15697] Rank 91 bound to package[1][core:155]
[inst-e5-ol95-nps1:15697] Rank 92 bound to package[1][core:163]
[inst-e5-ol95-nps1:15697] Rank 93 bound to package[1][core:171]
[inst-e5-ol95-nps1:15697] Rank 94 bound to package[1][core:179]
[inst-e5-ol95-nps1:15697] Rank 95 bound to package[1][core:187]
$
```

[No.8]

```sh
$ mpirun -n 192 --bind-to core --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps1:15825] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps1:15825] Rank 1 bound to package[0][core:1]
[inst-e5-ol95-nps1:15825] Rank 2 bound to package[0][core:2]
[inst-e5-ol95-nps1:15825] Rank 3 bound to package[0][core:3]
[inst-e5-ol95-nps1:15825] Rank 4 bound to package[0][core:4]
[inst-e5-ol95-nps1:15825] Rank 5 bound to package[0][core:5]
[inst-e5-ol95-nps1:15825] Rank 6 bound to package[0][core:6]
[inst-e5-ol95-nps1:15825] Rank 7 bound to package[0][core:7]
[inst-e5-ol95-nps1:15825] Rank 8 bound to package[0][core:8]
[inst-e5-ol95-nps1:15825] Rank 9 bound to package[0][core:9]
[inst-e5-ol95-nps1:15825] Rank 10 bound to package[0][core:10]
[inst-e5-ol95-nps1:15825] Rank 11 bound to package[0][core:11]
[inst-e5-ol95-nps1:15825] Rank 12 bound to package[0][core:12]
[inst-e5-ol95-nps1:15825] Rank 13 bound to package[0][core:13]
[inst-e5-ol95-nps1:15825] Rank 14 bound to package[0][core:14]
[inst-e5-ol95-nps1:15825] Rank 15 bound to package[0][core:15]
[inst-e5-ol95-nps1:15825] Rank 16 bound to package[0][core:16]
[inst-e5-ol95-nps1:15825] Rank 17 bound to package[0][core:17]
[inst-e5-ol95-nps1:15825] Rank 18 bound to package[0][core:18]
[inst-e5-ol95-nps1:15825] Rank 19 bound to package[0][core:19]
[inst-e5-ol95-nps1:15825] Rank 20 bound to package[0][core:20]
[inst-e5-ol95-nps1:15825] Rank 21 bound to package[0][core:21]
[inst-e5-ol95-nps1:15825] Rank 22 bound to package[0][core:22]
[inst-e5-ol95-nps1:15825] Rank 23 bound to package[0][core:23]
[inst-e5-ol95-nps1:15825] Rank 24 bound to package[0][core:24]
[inst-e5-ol95-nps1:15825] Rank 25 bound to package[0][core:25]
[inst-e5-ol95-nps1:15825] Rank 26 bound to package[0][core:26]
[inst-e5-ol95-nps1:15825] Rank 27 bound to package[0][core:27]
[inst-e5-ol95-nps1:15825] Rank 28 bound to package[0][core:28]
[inst-e5-ol95-nps1:15825] Rank 29 bound to package[0][core:29]
[inst-e5-ol95-nps1:15825] Rank 30 bound to package[0][core:30]
[inst-e5-ol95-nps1:15825] Rank 31 bound to package[0][core:31]
[inst-e5-ol95-nps1:15825] Rank 32 bound to package[0][core:32]
[inst-e5-ol95-nps1:15825] Rank 33 bound to package[0][core:33]
[inst-e5-ol95-nps1:15825] Rank 34 bound to package[0][core:34]
[inst-e5-ol95-nps1:15825] Rank 35 bound to package[0][core:35]
[inst-e5-ol95-nps1:15825] Rank 36 bound to package[0][core:36]
[inst-e5-ol95-nps1:15825] Rank 37 bound to package[0][core:37]
[inst-e5-ol95-nps1:15825] Rank 38 bound to package[0][core:38]
[inst-e5-ol95-nps1:15825] Rank 39 bound to package[0][core:39]
[inst-e5-ol95-nps1:15825] Rank 40 bound to package[0][core:40]
[inst-e5-ol95-nps1:15825] Rank 41 bound to package[0][core:41]
[inst-e5-ol95-nps1:15825] Rank 42 bound to package[0][core:42]
[inst-e5-ol95-nps1:15825] Rank 43 bound to package[0][core:43]
[inst-e5-ol95-nps1:15825] Rank 44 bound to package[0][core:44]
[inst-e5-ol95-nps1:15825] Rank 45 bound to package[0][core:45]
[inst-e5-ol95-nps1:15825] Rank 46 bound to package[0][core:46]
[inst-e5-ol95-nps1:15825] Rank 47 bound to package[0][core:47]
[inst-e5-ol95-nps1:15825] Rank 48 bound to package[0][core:48]
[inst-e5-ol95-nps1:15825] Rank 49 bound to package[0][core:49]
[inst-e5-ol95-nps1:15825] Rank 50 bound to package[0][core:50]
[inst-e5-ol95-nps1:15825] Rank 51 bound to package[0][core:51]
[inst-e5-ol95-nps1:15825] Rank 52 bound to package[0][core:52]
[inst-e5-ol95-nps1:15825] Rank 53 bound to package[0][core:53]
[inst-e5-ol95-nps1:15825] Rank 54 bound to package[0][core:54]
[inst-e5-ol95-nps1:15825] Rank 55 bound to package[0][core:55]
[inst-e5-ol95-nps1:15825] Rank 56 bound to package[0][core:56]
[inst-e5-ol95-nps1:15825] Rank 57 bound to package[0][core:57]
[inst-e5-ol95-nps1:15825] Rank 58 bound to package[0][core:58]
[inst-e5-ol95-nps1:15825] Rank 59 bound to package[0][core:59]
[inst-e5-ol95-nps1:15825] Rank 60 bound to package[0][core:60]
[inst-e5-ol95-nps1:15825] Rank 61 bound to package[0][core:61]
[inst-e5-ol95-nps1:15825] Rank 62 bound to package[0][core:62]
[inst-e5-ol95-nps1:15825] Rank 63 bound to package[0][core:63]
[inst-e5-ol95-nps1:15825] Rank 64 bound to package[0][core:64]
[inst-e5-ol95-nps1:15825] Rank 65 bound to package[0][core:65]
[inst-e5-ol95-nps1:15825] Rank 66 bound to package[0][core:66]
[inst-e5-ol95-nps1:15825] Rank 67 bound to package[0][core:67]
[inst-e5-ol95-nps1:15825] Rank 68 bound to package[0][core:68]
[inst-e5-ol95-nps1:15825] Rank 69 bound to package[0][core:69]
[inst-e5-ol95-nps1:15825] Rank 70 bound to package[0][core:70]
[inst-e5-ol95-nps1:15825] Rank 71 bound to package[0][core:71]
[inst-e5-ol95-nps1:15825] Rank 72 bound to package[0][core:72]
[inst-e5-ol95-nps1:15825] Rank 73 bound to package[0][core:73]
[inst-e5-ol95-nps1:15825] Rank 74 bound to package[0][core:74]
[inst-e5-ol95-nps1:15825] Rank 75 bound to package[0][core:75]
[inst-e5-ol95-nps1:15825] Rank 76 bound to package[0][core:76]
[inst-e5-ol95-nps1:15825] Rank 77 bound to package[0][core:77]
[inst-e5-ol95-nps1:15825] Rank 78 bound to package[0][core:78]
[inst-e5-ol95-nps1:15825] Rank 79 bound to package[0][core:79]
[inst-e5-ol95-nps1:15825] Rank 80 bound to package[0][core:80]
[inst-e5-ol95-nps1:15825] Rank 81 bound to package[0][core:81]
[inst-e5-ol95-nps1:15825] Rank 82 bound to package[0][core:82]
[inst-e5-ol95-nps1:15825] Rank 83 bound to package[0][core:83]
[inst-e5-ol95-nps1:15825] Rank 84 bound to package[0][core:84]
[inst-e5-ol95-nps1:15825] Rank 85 bound to package[0][core:85]
[inst-e5-ol95-nps1:15825] Rank 86 bound to package[0][core:86]
[inst-e5-ol95-nps1:15825] Rank 87 bound to package[0][core:87]
[inst-e5-ol95-nps1:15825] Rank 88 bound to package[0][core:88]
[inst-e5-ol95-nps1:15825] Rank 89 bound to package[0][core:89]
[inst-e5-ol95-nps1:15825] Rank 90 bound to package[0][core:90]
[inst-e5-ol95-nps1:15825] Rank 91 bound to package[0][core:91]
[inst-e5-ol95-nps1:15825] Rank 92 bound to package[0][core:92]
[inst-e5-ol95-nps1:15825] Rank 93 bound to package[0][core:93]
[inst-e5-ol95-nps1:15825] Rank 94 bound to package[0][core:94]
[inst-e5-ol95-nps1:15825] Rank 95 bound to package[0][core:95]
[inst-e5-ol95-nps1:15825] Rank 96 bound to package[1][core:96]
[inst-e5-ol95-nps1:15825] Rank 97 bound to package[1][core:97]
[inst-e5-ol95-nps1:15825] Rank 98 bound to package[1][core:98]
[inst-e5-ol95-nps1:15825] Rank 99 bound to package[1][core:99]
[inst-e5-ol95-nps1:15825] Rank 100 bound to package[1][core:100]
[inst-e5-ol95-nps1:15825] Rank 101 bound to package[1][core:101]
[inst-e5-ol95-nps1:15825] Rank 102 bound to package[1][core:102]
[inst-e5-ol95-nps1:15825] Rank 103 bound to package[1][core:103]
[inst-e5-ol95-nps1:15825] Rank 104 bound to package[1][core:104]
[inst-e5-ol95-nps1:15825] Rank 105 bound to package[1][core:105]
[inst-e5-ol95-nps1:15825] Rank 106 bound to package[1][core:106]
[inst-e5-ol95-nps1:15825] Rank 107 bound to package[1][core:107]
[inst-e5-ol95-nps1:15825] Rank 108 bound to package[1][core:108]
[inst-e5-ol95-nps1:15825] Rank 109 bound to package[1][core:109]
[inst-e5-ol95-nps1:15825] Rank 110 bound to package[1][core:110]
[inst-e5-ol95-nps1:15825] Rank 111 bound to package[1][core:111]
[inst-e5-ol95-nps1:15825] Rank 112 bound to package[1][core:112]
[inst-e5-ol95-nps1:15825] Rank 113 bound to package[1][core:113]
[inst-e5-ol95-nps1:15825] Rank 114 bound to package[1][core:114]
[inst-e5-ol95-nps1:15825] Rank 115 bound to package[1][core:115]
[inst-e5-ol95-nps1:15825] Rank 116 bound to package[1][core:116]
[inst-e5-ol95-nps1:15825] Rank 117 bound to package[1][core:117]
[inst-e5-ol95-nps1:15825] Rank 118 bound to package[1][core:118]
[inst-e5-ol95-nps1:15825] Rank 119 bound to package[1][core:119]
[inst-e5-ol95-nps1:15825] Rank 120 bound to package[1][core:120]
[inst-e5-ol95-nps1:15825] Rank 121 bound to package[1][core:121]
[inst-e5-ol95-nps1:15825] Rank 122 bound to package[1][core:122]
[inst-e5-ol95-nps1:15825] Rank 123 bound to package[1][core:123]
[inst-e5-ol95-nps1:15825] Rank 124 bound to package[1][core:124]
[inst-e5-ol95-nps1:15825] Rank 125 bound to package[1][core:125]
[inst-e5-ol95-nps1:15825] Rank 126 bound to package[1][core:126]
[inst-e5-ol95-nps1:15825] Rank 127 bound to package[1][core:127]
[inst-e5-ol95-nps1:15825] Rank 128 bound to package[1][core:128]
[inst-e5-ol95-nps1:15825] Rank 129 bound to package[1][core:129]
[inst-e5-ol95-nps1:15825] Rank 130 bound to package[1][core:130]
[inst-e5-ol95-nps1:15825] Rank 131 bound to package[1][core:131]
[inst-e5-ol95-nps1:15825] Rank 132 bound to package[1][core:132]
[inst-e5-ol95-nps1:15825] Rank 133 bound to package[1][core:133]
[inst-e5-ol95-nps1:15825] Rank 134 bound to package[1][core:134]
[inst-e5-ol95-nps1:15825] Rank 135 bound to package[1][core:135]
[inst-e5-ol95-nps1:15825] Rank 136 bound to package[1][core:136]
[inst-e5-ol95-nps1:15825] Rank 137 bound to package[1][core:137]
[inst-e5-ol95-nps1:15825] Rank 138 bound to package[1][core:138]
[inst-e5-ol95-nps1:15825] Rank 139 bound to package[1][core:139]
[inst-e5-ol95-nps1:15825] Rank 140 bound to package[1][core:140]
[inst-e5-ol95-nps1:15825] Rank 141 bound to package[1][core:141]
[inst-e5-ol95-nps1:15825] Rank 142 bound to package[1][core:142]
[inst-e5-ol95-nps1:15825] Rank 143 bound to package[1][core:143]
[inst-e5-ol95-nps1:15825] Rank 144 bound to package[1][core:144]
[inst-e5-ol95-nps1:15825] Rank 145 bound to package[1][core:145]
[inst-e5-ol95-nps1:15825] Rank 146 bound to package[1][core:146]
[inst-e5-ol95-nps1:15825] Rank 147 bound to package[1][core:147]
[inst-e5-ol95-nps1:15825] Rank 148 bound to package[1][core:148]
[inst-e5-ol95-nps1:15825] Rank 149 bound to package[1][core:149]
[inst-e5-ol95-nps1:15825] Rank 150 bound to package[1][core:150]
[inst-e5-ol95-nps1:15825] Rank 151 bound to package[1][core:151]
[inst-e5-ol95-nps1:15825] Rank 152 bound to package[1][core:152]
[inst-e5-ol95-nps1:15825] Rank 153 bound to package[1][core:153]
[inst-e5-ol95-nps1:15825] Rank 154 bound to package[1][core:154]
[inst-e5-ol95-nps1:15825] Rank 155 bound to package[1][core:155]
[inst-e5-ol95-nps1:15825] Rank 156 bound to package[1][core:156]
[inst-e5-ol95-nps1:15825] Rank 157 bound to package[1][core:157]
[inst-e5-ol95-nps1:15825] Rank 158 bound to package[1][core:158]
[inst-e5-ol95-nps1:15825] Rank 159 bound to package[1][core:159]
[inst-e5-ol95-nps1:15825] Rank 160 bound to package[1][core:160]
[inst-e5-ol95-nps1:15825] Rank 161 bound to package[1][core:161]
[inst-e5-ol95-nps1:15825] Rank 162 bound to package[1][core:162]
[inst-e5-ol95-nps1:15825] Rank 163 bound to package[1][core:163]
[inst-e5-ol95-nps1:15825] Rank 164 bound to package[1][core:164]
[inst-e5-ol95-nps1:15825] Rank 165 bound to package[1][core:165]
[inst-e5-ol95-nps1:15825] Rank 166 bound to package[1][core:166]
[inst-e5-ol95-nps1:15825] Rank 167 bound to package[1][core:167]
[inst-e5-ol95-nps1:15825] Rank 168 bound to package[1][core:168]
[inst-e5-ol95-nps1:15825] Rank 169 bound to package[1][core:169]
[inst-e5-ol95-nps1:15825] Rank 170 bound to package[1][core:170]
[inst-e5-ol95-nps1:15825] Rank 171 bound to package[1][core:171]
[inst-e5-ol95-nps1:15825] Rank 172 bound to package[1][core:172]
[inst-e5-ol95-nps1:15825] Rank 173 bound to package[1][core:173]
[inst-e5-ol95-nps1:15825] Rank 174 bound to package[1][core:174]
[inst-e5-ol95-nps1:15825] Rank 175 bound to package[1][core:175]
[inst-e5-ol95-nps1:15825] Rank 176 bound to package[1][core:176]
[inst-e5-ol95-nps1:15825] Rank 177 bound to package[1][core:177]
[inst-e5-ol95-nps1:15825] Rank 178 bound to package[1][core:178]
[inst-e5-ol95-nps1:15825] Rank 179 bound to package[1][core:179]
[inst-e5-ol95-nps1:15825] Rank 180 bound to package[1][core:180]
[inst-e5-ol95-nps1:15825] Rank 181 bound to package[1][core:181]
[inst-e5-ol95-nps1:15825] Rank 182 bound to package[1][core:182]
[inst-e5-ol95-nps1:15825] Rank 183 bound to package[1][core:183]
[inst-e5-ol95-nps1:15825] Rank 184 bound to package[1][core:184]
[inst-e5-ol95-nps1:15825] Rank 185 bound to package[1][core:185]
[inst-e5-ol95-nps1:15825] Rank 186 bound to package[1][core:186]
[inst-e5-ol95-nps1:15825] Rank 187 bound to package[1][core:187]
[inst-e5-ol95-nps1:15825] Rank 188 bound to package[1][core:188]
[inst-e5-ol95-nps1:15825] Rank 189 bound to package[1][core:189]
[inst-e5-ol95-nps1:15825] Rank 190 bound to package[1][core:190]
[inst-e5-ol95-nps1:15825] Rank 191 bound to package[1][core:191]
$
```

[No.9]

```sh
$ mpirun -n 192 --bind-to core --map-by ppr:8:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps1:16040] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps1:16040] Rank 1 bound to package[0][core:8]
[inst-e5-ol95-nps1:16040] Rank 2 bound to package[0][core:16]
[inst-e5-ol95-nps1:16040] Rank 3 bound to package[0][core:24]
[inst-e5-ol95-nps1:16040] Rank 4 bound to package[0][core:32]
[inst-e5-ol95-nps1:16040] Rank 5 bound to package[0][core:40]
[inst-e5-ol95-nps1:16040] Rank 6 bound to package[0][core:48]
[inst-e5-ol95-nps1:16040] Rank 7 bound to package[0][core:56]
[inst-e5-ol95-nps1:16040] Rank 8 bound to package[0][core:64]
[inst-e5-ol95-nps1:16040] Rank 9 bound to package[0][core:72]
[inst-e5-ol95-nps1:16040] Rank 10 bound to package[0][core:80]
[inst-e5-ol95-nps1:16040] Rank 11 bound to package[0][core:88]
[inst-e5-ol95-nps1:16040] Rank 12 bound to package[1][core:96]
[inst-e5-ol95-nps1:16040] Rank 13 bound to package[1][core:104]
[inst-e5-ol95-nps1:16040] Rank 14 bound to package[1][core:112]
[inst-e5-ol95-nps1:16040] Rank 15 bound to package[1][core:120]
[inst-e5-ol95-nps1:16040] Rank 16 bound to package[1][core:128]
[inst-e5-ol95-nps1:16040] Rank 17 bound to package[1][core:136]
[inst-e5-ol95-nps1:16040] Rank 18 bound to package[1][core:144]
[inst-e5-ol95-nps1:16040] Rank 19 bound to package[1][core:152]
[inst-e5-ol95-nps1:16040] Rank 20 bound to package[1][core:160]
[inst-e5-ol95-nps1:16040] Rank 21 bound to package[1][core:168]
[inst-e5-ol95-nps1:16040] Rank 22 bound to package[1][core:176]
[inst-e5-ol95-nps1:16040] Rank 23 bound to package[1][core:184]
[inst-e5-ol95-nps1:16040] Rank 24 bound to package[0][core:1]
[inst-e5-ol95-nps1:16040] Rank 25 bound to package[0][core:9]
[inst-e5-ol95-nps1:16040] Rank 26 bound to package[0][core:17]
[inst-e5-ol95-nps1:16040] Rank 27 bound to package[0][core:25]
[inst-e5-ol95-nps1:16040] Rank 28 bound to package[0][core:33]
[inst-e5-ol95-nps1:16040] Rank 29 bound to package[0][core:41]
[inst-e5-ol95-nps1:16040] Rank 30 bound to package[0][core:49]
[inst-e5-ol95-nps1:16040] Rank 31 bound to package[0][core:57]
[inst-e5-ol95-nps1:16040] Rank 32 bound to package[0][core:65]
[inst-e5-ol95-nps1:16040] Rank 33 bound to package[0][core:73]
[inst-e5-ol95-nps1:16040] Rank 34 bound to package[0][core:81]
[inst-e5-ol95-nps1:16040] Rank 35 bound to package[0][core:89]
[inst-e5-ol95-nps1:16040] Rank 36 bound to package[1][core:97]
[inst-e5-ol95-nps1:16040] Rank 37 bound to package[1][core:105]
[inst-e5-ol95-nps1:16040] Rank 38 bound to package[1][core:113]
[inst-e5-ol95-nps1:16040] Rank 39 bound to package[1][core:121]
[inst-e5-ol95-nps1:16040] Rank 40 bound to package[1][core:129]
[inst-e5-ol95-nps1:16040] Rank 41 bound to package[1][core:137]
[inst-e5-ol95-nps1:16040] Rank 42 bound to package[1][core:145]
[inst-e5-ol95-nps1:16040] Rank 43 bound to package[1][core:153]
[inst-e5-ol95-nps1:16040] Rank 44 bound to package[1][core:161]
[inst-e5-ol95-nps1:16040] Rank 45 bound to package[1][core:169]
[inst-e5-ol95-nps1:16040] Rank 46 bound to package[1][core:177]
[inst-e5-ol95-nps1:16040] Rank 47 bound to package[1][core:185]
[inst-e5-ol95-nps1:16040] Rank 48 bound to package[0][core:2]
[inst-e5-ol95-nps1:16040] Rank 49 bound to package[0][core:10]
[inst-e5-ol95-nps1:16040] Rank 50 bound to package[0][core:18]
[inst-e5-ol95-nps1:16040] Rank 51 bound to package[0][core:26]
[inst-e5-ol95-nps1:16040] Rank 52 bound to package[0][core:34]
[inst-e5-ol95-nps1:16040] Rank 53 bound to package[0][core:42]
[inst-e5-ol95-nps1:16040] Rank 54 bound to package[0][core:50]
[inst-e5-ol95-nps1:16040] Rank 55 bound to package[0][core:58]
[inst-e5-ol95-nps1:16040] Rank 56 bound to package[0][core:66]
[inst-e5-ol95-nps1:16040] Rank 57 bound to package[0][core:74]
[inst-e5-ol95-nps1:16040] Rank 58 bound to package[0][core:82]
[inst-e5-ol95-nps1:16040] Rank 59 bound to package[0][core:90]
[inst-e5-ol95-nps1:16040] Rank 60 bound to package[1][core:98]
[inst-e5-ol95-nps1:16040] Rank 61 bound to package[1][core:106]
[inst-e5-ol95-nps1:16040] Rank 62 bound to package[1][core:114]
[inst-e5-ol95-nps1:16040] Rank 63 bound to package[1][core:122]
[inst-e5-ol95-nps1:16040] Rank 64 bound to package[1][core:130]
[inst-e5-ol95-nps1:16040] Rank 65 bound to package[1][core:138]
[inst-e5-ol95-nps1:16040] Rank 66 bound to package[1][core:146]
[inst-e5-ol95-nps1:16040] Rank 67 bound to package[1][core:154]
[inst-e5-ol95-nps1:16040] Rank 68 bound to package[1][core:162]
[inst-e5-ol95-nps1:16040] Rank 69 bound to package[1][core:170]
[inst-e5-ol95-nps1:16040] Rank 70 bound to package[1][core:178]
[inst-e5-ol95-nps1:16040] Rank 71 bound to package[1][core:186]
[inst-e5-ol95-nps1:16040] Rank 72 bound to package[0][core:3]
[inst-e5-ol95-nps1:16040] Rank 73 bound to package[0][core:11]
[inst-e5-ol95-nps1:16040] Rank 74 bound to package[0][core:19]
[inst-e5-ol95-nps1:16040] Rank 75 bound to package[0][core:27]
[inst-e5-ol95-nps1:16040] Rank 76 bound to package[0][core:35]
[inst-e5-ol95-nps1:16040] Rank 77 bound to package[0][core:43]
[inst-e5-ol95-nps1:16040] Rank 78 bound to package[0][core:51]
[inst-e5-ol95-nps1:16040] Rank 79 bound to package[0][core:59]
[inst-e5-ol95-nps1:16040] Rank 80 bound to package[0][core:67]
[inst-e5-ol95-nps1:16040] Rank 81 bound to package[0][core:75]
[inst-e5-ol95-nps1:16040] Rank 82 bound to package[0][core:83]
[inst-e5-ol95-nps1:16040] Rank 83 bound to package[0][core:91]
[inst-e5-ol95-nps1:16040] Rank 84 bound to package[1][core:99]
[inst-e5-ol95-nps1:16040] Rank 85 bound to package[1][core:107]
[inst-e5-ol95-nps1:16040] Rank 86 bound to package[1][core:115]
[inst-e5-ol95-nps1:16040] Rank 87 bound to package[1][core:123]
[inst-e5-ol95-nps1:16040] Rank 88 bound to package[1][core:131]
[inst-e5-ol95-nps1:16040] Rank 89 bound to package[1][core:139]
[inst-e5-ol95-nps1:16040] Rank 90 bound to package[1][core:147]
[inst-e5-ol95-nps1:16040] Rank 91 bound to package[1][core:155]
[inst-e5-ol95-nps1:16040] Rank 92 bound to package[1][core:163]
[inst-e5-ol95-nps1:16040] Rank 93 bound to package[1][core:171]
[inst-e5-ol95-nps1:16040] Rank 94 bound to package[1][core:179]
[inst-e5-ol95-nps1:16040] Rank 95 bound to package[1][core:187]
[inst-e5-ol95-nps1:16040] Rank 96 bound to package[0][core:4]
[inst-e5-ol95-nps1:16040] Rank 97 bound to package[0][core:12]
[inst-e5-ol95-nps1:16040] Rank 98 bound to package[0][core:20]
[inst-e5-ol95-nps1:16040] Rank 99 bound to package[0][core:28]
[inst-e5-ol95-nps1:16040] Rank 100 bound to package[0][core:36]
[inst-e5-ol95-nps1:16040] Rank 101 bound to package[0][core:44]
[inst-e5-ol95-nps1:16040] Rank 102 bound to package[0][core:52]
[inst-e5-ol95-nps1:16040] Rank 103 bound to package[0][core:60]
[inst-e5-ol95-nps1:16040] Rank 104 bound to package[0][core:68]
[inst-e5-ol95-nps1:16040] Rank 105 bound to package[0][core:76]
[inst-e5-ol95-nps1:16040] Rank 106 bound to package[0][core:84]
[inst-e5-ol95-nps1:16040] Rank 107 bound to package[0][core:92]
[inst-e5-ol95-nps1:16040] Rank 108 bound to package[1][core:100]
[inst-e5-ol95-nps1:16040] Rank 109 bound to package[1][core:108]
[inst-e5-ol95-nps1:16040] Rank 110 bound to package[1][core:116]
[inst-e5-ol95-nps1:16040] Rank 111 bound to package[1][core:124]
[inst-e5-ol95-nps1:16040] Rank 112 bound to package[1][core:132]
[inst-e5-ol95-nps1:16040] Rank 113 bound to package[1][core:140]
[inst-e5-ol95-nps1:16040] Rank 114 bound to package[1][core:148]
[inst-e5-ol95-nps1:16040] Rank 115 bound to package[1][core:156]
[inst-e5-ol95-nps1:16040] Rank 116 bound to package[1][core:164]
[inst-e5-ol95-nps1:16040] Rank 117 bound to package[1][core:172]
[inst-e5-ol95-nps1:16040] Rank 118 bound to package[1][core:180]
[inst-e5-ol95-nps1:16040] Rank 119 bound to package[1][core:188]
[inst-e5-ol95-nps1:16040] Rank 120 bound to package[0][core:5]
[inst-e5-ol95-nps1:16040] Rank 121 bound to package[0][core:13]
[inst-e5-ol95-nps1:16040] Rank 122 bound to package[0][core:21]
[inst-e5-ol95-nps1:16040] Rank 123 bound to package[0][core:29]
[inst-e5-ol95-nps1:16040] Rank 124 bound to package[0][core:37]
[inst-e5-ol95-nps1:16040] Rank 125 bound to package[0][core:45]
[inst-e5-ol95-nps1:16040] Rank 126 bound to package[0][core:53]
[inst-e5-ol95-nps1:16040] Rank 127 bound to package[0][core:61]
[inst-e5-ol95-nps1:16040] Rank 128 bound to package[0][core:69]
[inst-e5-ol95-nps1:16040] Rank 129 bound to package[0][core:77]
[inst-e5-ol95-nps1:16040] Rank 130 bound to package[0][core:85]
[inst-e5-ol95-nps1:16040] Rank 131 bound to package[0][core:93]
[inst-e5-ol95-nps1:16040] Rank 132 bound to package[1][core:101]
[inst-e5-ol95-nps1:16040] Rank 133 bound to package[1][core:109]
[inst-e5-ol95-nps1:16040] Rank 134 bound to package[1][core:117]
[inst-e5-ol95-nps1:16040] Rank 135 bound to package[1][core:125]
[inst-e5-ol95-nps1:16040] Rank 136 bound to package[1][core:133]
[inst-e5-ol95-nps1:16040] Rank 137 bound to package[1][core:141]
[inst-e5-ol95-nps1:16040] Rank 138 bound to package[1][core:149]
[inst-e5-ol95-nps1:16040] Rank 139 bound to package[1][core:157]
[inst-e5-ol95-nps1:16040] Rank 140 bound to package[1][core:165]
[inst-e5-ol95-nps1:16040] Rank 141 bound to package[1][core:173]
[inst-e5-ol95-nps1:16040] Rank 142 bound to package[1][core:181]
[inst-e5-ol95-nps1:16040] Rank 143 bound to package[1][core:189]
[inst-e5-ol95-nps1:16040] Rank 144 bound to package[0][core:6]
[inst-e5-ol95-nps1:16040] Rank 145 bound to package[0][core:14]
[inst-e5-ol95-nps1:16040] Rank 146 bound to package[0][core:22]
[inst-e5-ol95-nps1:16040] Rank 147 bound to package[0][core:30]
[inst-e5-ol95-nps1:16040] Rank 148 bound to package[0][core:38]
[inst-e5-ol95-nps1:16040] Rank 149 bound to package[0][core:46]
[inst-e5-ol95-nps1:16040] Rank 150 bound to package[0][core:54]
[inst-e5-ol95-nps1:16040] Rank 151 bound to package[0][core:62]
[inst-e5-ol95-nps1:16040] Rank 152 bound to package[0][core:70]
[inst-e5-ol95-nps1:16040] Rank 153 bound to package[0][core:78]
[inst-e5-ol95-nps1:16040] Rank 154 bound to package[0][core:86]
[inst-e5-ol95-nps1:16040] Rank 155 bound to package[0][core:94]
[inst-e5-ol95-nps1:16040] Rank 156 bound to package[1][core:102]
[inst-e5-ol95-nps1:16040] Rank 157 bound to package[1][core:110]
[inst-e5-ol95-nps1:16040] Rank 158 bound to package[1][core:118]
[inst-e5-ol95-nps1:16040] Rank 159 bound to package[1][core:126]
[inst-e5-ol95-nps1:16040] Rank 160 bound to package[1][core:134]
[inst-e5-ol95-nps1:16040] Rank 161 bound to package[1][core:142]
[inst-e5-ol95-nps1:16040] Rank 162 bound to package[1][core:150]
[inst-e5-ol95-nps1:16040] Rank 163 bound to package[1][core:158]
[inst-e5-ol95-nps1:16040] Rank 164 bound to package[1][core:166]
[inst-e5-ol95-nps1:16040] Rank 165 bound to package[1][core:174]
[inst-e5-ol95-nps1:16040] Rank 166 bound to package[1][core:182]
[inst-e5-ol95-nps1:16040] Rank 167 bound to package[1][core:190]
[inst-e5-ol95-nps1:16040] Rank 168 bound to package[0][core:7]
[inst-e5-ol95-nps1:16040] Rank 169 bound to package[0][core:15]
[inst-e5-ol95-nps1:16040] Rank 170 bound to package[0][core:23]
[inst-e5-ol95-nps1:16040] Rank 171 bound to package[0][core:31]
[inst-e5-ol95-nps1:16040] Rank 172 bound to package[0][core:39]
[inst-e5-ol95-nps1:16040] Rank 173 bound to package[0][core:47]
[inst-e5-ol95-nps1:16040] Rank 174 bound to package[0][core:55]
[inst-e5-ol95-nps1:16040] Rank 175 bound to package[0][core:63]
[inst-e5-ol95-nps1:16040] Rank 176 bound to package[0][core:71]
[inst-e5-ol95-nps1:16040] Rank 177 bound to package[0][core:79]
[inst-e5-ol95-nps1:16040] Rank 178 bound to package[0][core:87]
[inst-e5-ol95-nps1:16040] Rank 179 bound to package[0][core:95]
[inst-e5-ol95-nps1:16040] Rank 180 bound to package[1][core:103]
[inst-e5-ol95-nps1:16040] Rank 181 bound to package[1][core:111]
[inst-e5-ol95-nps1:16040] Rank 182 bound to package[1][core:119]
[inst-e5-ol95-nps1:16040] Rank 183 bound to package[1][core:127]
[inst-e5-ol95-nps1:16040] Rank 184 bound to package[1][core:135]
[inst-e5-ol95-nps1:16040] Rank 185 bound to package[1][core:143]
[inst-e5-ol95-nps1:16040] Rank 186 bound to package[1][core:151]
[inst-e5-ol95-nps1:16040] Rank 187 bound to package[1][core:159]
[inst-e5-ol95-nps1:16040] Rank 188 bound to package[1][core:167]
[inst-e5-ol95-nps1:16040] Rank 189 bound to package[1][core:175]
[inst-e5-ol95-nps1:16040] Rank 190 bound to package[1][core:183]
[inst-e5-ol95-nps1:16040] Rank 191 bound to package[1][core:191]
$
```

[No.10]

```sh
$ mpirun -n 2 --bind-to core --map-by ppr:1:package:PE=96 -x OMP_NUM_THREAD=96 -x OMP_PROC_BIND=TRUE bash -c 'sleep $OMPI_COMM_WORLD_RANK; echo "Rank $OMPI_COMM_WORLD_RANK Node `echo $((OMPI_COMM_WORLD_RANK / OMPI_COMM_WORLD_LOCAL_SIZE))`"; ./show_thread_bind | sort -k 2n,2'
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
Rank 1 Node 0
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
Thread 32 Core 128
Thread 33 Core 129
Thread 34 Core 130
Thread 35 Core 131
Thread 36 Core 132
Thread 37 Core 133
Thread 38 Core 134
Thread 39 Core 135
Thread 40 Core 136
Thread 41 Core 137
Thread 42 Core 138
Thread 43 Core 139
Thread 44 Core 140
Thread 45 Core 141
Thread 46 Core 142
Thread 47 Core 143
Thread 48 Core 144
Thread 49 Core 145
Thread 50 Core 146
Thread 51 Core 147
Thread 52 Core 148
Thread 53 Core 149
Thread 54 Core 150
Thread 55 Core 151
Thread 56 Core 152
Thread 57 Core 153
Thread 58 Core 154
Thread 59 Core 155
Thread 60 Core 156
Thread 61 Core 157
Thread 62 Core 158
Thread 63 Core 159
Thread 64 Core 160
Thread 65 Core 161
Thread 66 Core 162
Thread 67 Core 163
Thread 68 Core 164
Thread 69 Core 165
Thread 70 Core 166
Thread 71 Core 167
Thread 72 Core 168
Thread 73 Core 169
Thread 74 Core 170
Thread 75 Core 171
Thread 76 Core 172
Thread 77 Core 173
Thread 78 Core 174
Thread 79 Core 175
Thread 80 Core 176
Thread 81 Core 177
Thread 82 Core 178
Thread 83 Core 179
Thread 84 Core 180
Thread 85 Core 181
Thread 86 Core 182
Thread 87 Core 183
Thread 88 Core 184
Thread 89 Core 185
Thread 90 Core 186
Thread 91 Core 187
Thread 92 Core 188
Thread 93 Core 189
Thread 94 Core 190
Thread 95 Core 191
$
```

[No.11]

```sh
$ mpirun -n 24 --bind-to core --map-by ppr:1:l3cache:PE=8 -x OMP_NUM_THREAD=8 -x OMP_PROC_BIND=TRUE bash -c 'sleep $OMPI_COMM_WORLD_RANK; echo "Rank $OMPI_COMM_WORLD_RANK Node `echo $((OMPI_COMM_WORLD_RANK / OMPI_COMM_WORLD_LOCAL_SIZE))`"; ./show_thread_bind | sort -k 2n,2'
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
$
```

[No.12]

```sh
$ mpirun -n 8 --bind-to core --map-by ppr:1:numa --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps4:17474] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps4:17474] Rank 1 bound to package[0][core:24]
[inst-e5-ol95-nps4:17474] Rank 2 bound to package[0][core:48]
[inst-e5-ol95-nps4:17474] Rank 3 bound to package[0][core:72]
[inst-e5-ol95-nps4:17474] Rank 4 bound to package[1][core:96]
[inst-e5-ol95-nps4:17474] Rank 5 bound to package[1][core:120]
[inst-e5-ol95-nps4:17474] Rank 6 bound to package[1][core:144]
[inst-e5-ol95-nps4:17474] Rank 7 bound to package[1][core:168]
$
```

[No.13]

```sh
$ mpirun -n 24 --bind-to core --map-by ppr:1:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps4:17546] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps4:17546] Rank 1 bound to package[0][core:8]
[inst-e5-ol95-nps4:17546] Rank 2 bound to package[0][core:16]
[inst-e5-ol95-nps4:17546] Rank 3 bound to package[0][core:24]
[inst-e5-ol95-nps4:17546] Rank 4 bound to package[0][core:32]
[inst-e5-ol95-nps4:17546] Rank 5 bound to package[0][core:40]
[inst-e5-ol95-nps4:17546] Rank 6 bound to package[0][core:48]
[inst-e5-ol95-nps4:17546] Rank 7 bound to package[0][core:56]
[inst-e5-ol95-nps4:17546] Rank 8 bound to package[0][core:64]
[inst-e5-ol95-nps4:17546] Rank 9 bound to package[0][core:72]
[inst-e5-ol95-nps4:17546] Rank 10 bound to package[0][core:80]
[inst-e5-ol95-nps4:17546] Rank 11 bound to package[0][core:88]
[inst-e5-ol95-nps4:17546] Rank 12 bound to package[1][core:96]
[inst-e5-ol95-nps4:17546] Rank 13 bound to package[1][core:104]
[inst-e5-ol95-nps4:17546] Rank 14 bound to package[1][core:112]
[inst-e5-ol95-nps4:17546] Rank 15 bound to package[1][core:120]
[inst-e5-ol95-nps4:17546] Rank 16 bound to package[1][core:128]
[inst-e5-ol95-nps4:17546] Rank 17 bound to package[1][core:136]
[inst-e5-ol95-nps4:17546] Rank 18 bound to package[1][core:144]
[inst-e5-ol95-nps4:17546] Rank 19 bound to package[1][core:152]
[inst-e5-ol95-nps4:17546] Rank 20 bound to package[1][core:160]
[inst-e5-ol95-nps4:17546] Rank 21 bound to package[1][core:168]
[inst-e5-ol95-nps4:17546] Rank 22 bound to package[1][core:176]
[inst-e5-ol95-nps4:17546] Rank 23 bound to package[1][core:184]
$
```

[No.14]

```sh
$ mpirun -n 48 --bind-to core --map-by ppr:2:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps4:19146] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps4:19146] Rank 1 bound to package[0][core:1]
[inst-e5-ol95-nps4:19146] Rank 2 bound to package[0][core:8]
[inst-e5-ol95-nps4:19146] Rank 3 bound to package[0][core:9]
[inst-e5-ol95-nps4:19146] Rank 4 bound to package[0][core:16]
[inst-e5-ol95-nps4:19146] Rank 5 bound to package[0][core:17]
[inst-e5-ol95-nps4:19146] Rank 6 bound to package[0][core:24]
[inst-e5-ol95-nps4:19146] Rank 7 bound to package[0][core:25]
[inst-e5-ol95-nps4:19146] Rank 8 bound to package[0][core:32]
[inst-e5-ol95-nps4:19146] Rank 9 bound to package[0][core:33]
[inst-e5-ol95-nps4:19146] Rank 10 bound to package[0][core:40]
[inst-e5-ol95-nps4:19146] Rank 11 bound to package[0][core:41]
[inst-e5-ol95-nps4:19146] Rank 12 bound to package[0][core:48]
[inst-e5-ol95-nps4:19146] Rank 13 bound to package[0][core:49]
[inst-e5-ol95-nps4:19146] Rank 14 bound to package[0][core:56]
[inst-e5-ol95-nps4:19146] Rank 15 bound to package[0][core:57]
[inst-e5-ol95-nps4:19146] Rank 16 bound to package[0][core:64]
[inst-e5-ol95-nps4:19146] Rank 17 bound to package[0][core:65]
[inst-e5-ol95-nps4:19146] Rank 18 bound to package[0][core:72]
[inst-e5-ol95-nps4:19146] Rank 19 bound to package[0][core:73]
[inst-e5-ol95-nps4:19146] Rank 20 bound to package[0][core:80]
[inst-e5-ol95-nps4:19146] Rank 21 bound to package[0][core:81]
[inst-e5-ol95-nps4:19146] Rank 22 bound to package[0][core:88]
[inst-e5-ol95-nps4:19146] Rank 23 bound to package[0][core:89]
[inst-e5-ol95-nps4:19146] Rank 24 bound to package[1][core:96]
[inst-e5-ol95-nps4:19146] Rank 25 bound to package[1][core:97]
[inst-e5-ol95-nps4:19146] Rank 26 bound to package[1][core:104]
[inst-e5-ol95-nps4:19146] Rank 27 bound to package[1][core:105]
[inst-e5-ol95-nps4:19146] Rank 28 bound to package[1][core:112]
[inst-e5-ol95-nps4:19146] Rank 29 bound to package[1][core:113]
[inst-e5-ol95-nps4:19146] Rank 30 bound to package[1][core:120]
[inst-e5-ol95-nps4:19146] Rank 31 bound to package[1][core:121]
[inst-e5-ol95-nps4:19146] Rank 32 bound to package[1][core:128]
[inst-e5-ol95-nps4:19146] Rank 33 bound to package[1][core:129]
[inst-e5-ol95-nps4:19146] Rank 34 bound to package[1][core:136]
[inst-e5-ol95-nps4:19146] Rank 35 bound to package[1][core:137]
[inst-e5-ol95-nps4:19146] Rank 36 bound to package[1][core:144]
[inst-e5-ol95-nps4:19146] Rank 37 bound to package[1][core:145]
[inst-e5-ol95-nps4:19146] Rank 38 bound to package[1][core:152]
[inst-e5-ol95-nps4:19146] Rank 39 bound to package[1][core:153]
[inst-e5-ol95-nps4:19146] Rank 40 bound to package[1][core:160]
[inst-e5-ol95-nps4:19146] Rank 41 bound to package[1][core:161]
[inst-e5-ol95-nps4:19146] Rank 42 bound to package[1][core:168]
[inst-e5-ol95-nps4:19146] Rank 43 bound to package[1][core:169]
[inst-e5-ol95-nps4:19146] Rank 44 bound to package[1][core:176]
[inst-e5-ol95-nps4:19146] Rank 45 bound to package[1][core:177]
[inst-e5-ol95-nps4:19146] Rank 46 bound to package[1][core:184]
[inst-e5-ol95-nps4:19146] Rank 47 bound to package[1][core:185]
$
```

[No.15]

```sh
$ mpirun -n 48 --bind-to core --map-by ppr:2:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps4:19663] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps4:19663] Rank 1 bound to package[0][core:8]
[inst-e5-ol95-nps4:19663] Rank 2 bound to package[0][core:16]
[inst-e5-ol95-nps4:19663] Rank 3 bound to package[0][core:24]
[inst-e5-ol95-nps4:19663] Rank 4 bound to package[0][core:32]
[inst-e5-ol95-nps4:19663] Rank 5 bound to package[0][core:40]
[inst-e5-ol95-nps4:19663] Rank 6 bound to package[0][core:48]
[inst-e5-ol95-nps4:19663] Rank 7 bound to package[0][core:56]
[inst-e5-ol95-nps4:19663] Rank 8 bound to package[0][core:64]
[inst-e5-ol95-nps4:19663] Rank 9 bound to package[0][core:72]
[inst-e5-ol95-nps4:19663] Rank 10 bound to package[0][core:80]
[inst-e5-ol95-nps4:19663] Rank 11 bound to package[0][core:88]
[inst-e5-ol95-nps4:19663] Rank 12 bound to package[1][core:96]
[inst-e5-ol95-nps4:19663] Rank 13 bound to package[1][core:104]
[inst-e5-ol95-nps4:19663] Rank 14 bound to package[1][core:112]
[inst-e5-ol95-nps4:19663] Rank 15 bound to package[1][core:120]
[inst-e5-ol95-nps4:19663] Rank 16 bound to package[1][core:128]
[inst-e5-ol95-nps4:19663] Rank 17 bound to package[1][core:136]
[inst-e5-ol95-nps4:19663] Rank 18 bound to package[1][core:144]
[inst-e5-ol95-nps4:19663] Rank 19 bound to package[1][core:152]
[inst-e5-ol95-nps4:19663] Rank 20 bound to package[1][core:160]
[inst-e5-ol95-nps4:19663] Rank 21 bound to package[1][core:168]
[inst-e5-ol95-nps4:19663] Rank 22 bound to package[1][core:176]
[inst-e5-ol95-nps4:19663] Rank 23 bound to package[1][core:184]
[inst-e5-ol95-nps4:19663] Rank 24 bound to package[0][core:1]
[inst-e5-ol95-nps4:19663] Rank 25 bound to package[0][core:9]
[inst-e5-ol95-nps4:19663] Rank 26 bound to package[0][core:17]
[inst-e5-ol95-nps4:19663] Rank 27 bound to package[0][core:25]
[inst-e5-ol95-nps4:19663] Rank 28 bound to package[0][core:33]
[inst-e5-ol95-nps4:19663] Rank 29 bound to package[0][core:41]
[inst-e5-ol95-nps4:19663] Rank 30 bound to package[0][core:49]
[inst-e5-ol95-nps4:19663] Rank 31 bound to package[0][core:57]
[inst-e5-ol95-nps4:19663] Rank 32 bound to package[0][core:65]
[inst-e5-ol95-nps4:19663] Rank 33 bound to package[0][core:73]
[inst-e5-ol95-nps4:19663] Rank 34 bound to package[0][core:81]
[inst-e5-ol95-nps4:19663] Rank 35 bound to package[0][core:89]
[inst-e5-ol95-nps4:19663] Rank 36 bound to package[1][core:97]
[inst-e5-ol95-nps4:19663] Rank 37 bound to package[1][core:105]
[inst-e5-ol95-nps4:19663] Rank 38 bound to package[1][core:113]
[inst-e5-ol95-nps4:19663] Rank 39 bound to package[1][core:121]
[inst-e5-ol95-nps4:19663] Rank 40 bound to package[1][core:129]
[inst-e5-ol95-nps4:19663] Rank 41 bound to package[1][core:137]
[inst-e5-ol95-nps4:19663] Rank 42 bound to package[1][core:145]
[inst-e5-ol95-nps4:19663] Rank 43 bound to package[1][core:153]
[inst-e5-ol95-nps4:19663] Rank 44 bound to package[1][core:161]
[inst-e5-ol95-nps4:19663] Rank 45 bound to package[1][core:169]
[inst-e5-ol95-nps4:19663] Rank 46 bound to package[1][core:177]
[inst-e5-ol95-nps4:19663] Rank 47 bound to package[1][core:185]
$
```

[No.16]

```sh
$ mpirun -n 96 --bind-to core --map-by ppr:4:l3cache --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps4:20378] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps4:20378] Rank 1 bound to package[0][core:1]
[inst-e5-ol95-nps4:20378] Rank 2 bound to package[0][core:2]
[inst-e5-ol95-nps4:20378] Rank 3 bound to package[0][core:3]
[inst-e5-ol95-nps4:20378] Rank 4 bound to package[0][core:8]
[inst-e5-ol95-nps4:20378] Rank 5 bound to package[0][core:9]
[inst-e5-ol95-nps4:20378] Rank 6 bound to package[0][core:10]
[inst-e5-ol95-nps4:20378] Rank 7 bound to package[0][core:11]
[inst-e5-ol95-nps4:20378] Rank 8 bound to package[0][core:16]
[inst-e5-ol95-nps4:20378] Rank 9 bound to package[0][core:17]
[inst-e5-ol95-nps4:20378] Rank 10 bound to package[0][core:18]
[inst-e5-ol95-nps4:20378] Rank 11 bound to package[0][core:19]
[inst-e5-ol95-nps4:20378] Rank 12 bound to package[0][core:24]
[inst-e5-ol95-nps4:20378] Rank 13 bound to package[0][core:25]
[inst-e5-ol95-nps4:20378] Rank 14 bound to package[0][core:26]
[inst-e5-ol95-nps4:20378] Rank 15 bound to package[0][core:27]
[inst-e5-ol95-nps4:20378] Rank 16 bound to package[0][core:32]
[inst-e5-ol95-nps4:20378] Rank 17 bound to package[0][core:33]
[inst-e5-ol95-nps4:20378] Rank 18 bound to package[0][core:34]
[inst-e5-ol95-nps4:20378] Rank 19 bound to package[0][core:35]
[inst-e5-ol95-nps4:20378] Rank 20 bound to package[0][core:40]
[inst-e5-ol95-nps4:20378] Rank 21 bound to package[0][core:41]
[inst-e5-ol95-nps4:20378] Rank 22 bound to package[0][core:42]
[inst-e5-ol95-nps4:20378] Rank 23 bound to package[0][core:43]
[inst-e5-ol95-nps4:20378] Rank 24 bound to package[0][core:48]
[inst-e5-ol95-nps4:20378] Rank 25 bound to package[0][core:49]
[inst-e5-ol95-nps4:20378] Rank 26 bound to package[0][core:50]
[inst-e5-ol95-nps4:20378] Rank 27 bound to package[0][core:51]
[inst-e5-ol95-nps4:20378] Rank 28 bound to package[0][core:56]
[inst-e5-ol95-nps4:20378] Rank 29 bound to package[0][core:57]
[inst-e5-ol95-nps4:20378] Rank 30 bound to package[0][core:58]
[inst-e5-ol95-nps4:20378] Rank 31 bound to package[0][core:59]
[inst-e5-ol95-nps4:20378] Rank 32 bound to package[0][core:64]
[inst-e5-ol95-nps4:20378] Rank 33 bound to package[0][core:65]
[inst-e5-ol95-nps4:20378] Rank 34 bound to package[0][core:66]
[inst-e5-ol95-nps4:20378] Rank 35 bound to package[0][core:67]
[inst-e5-ol95-nps4:20378] Rank 36 bound to package[0][core:72]
[inst-e5-ol95-nps4:20378] Rank 37 bound to package[0][core:73]
[inst-e5-ol95-nps4:20378] Rank 38 bound to package[0][core:74]
[inst-e5-ol95-nps4:20378] Rank 39 bound to package[0][core:75]
[inst-e5-ol95-nps4:20378] Rank 40 bound to package[0][core:80]
[inst-e5-ol95-nps4:20378] Rank 41 bound to package[0][core:81]
[inst-e5-ol95-nps4:20378] Rank 42 bound to package[0][core:82]
[inst-e5-ol95-nps4:20378] Rank 43 bound to package[0][core:83]
[inst-e5-ol95-nps4:20378] Rank 44 bound to package[0][core:88]
[inst-e5-ol95-nps4:20378] Rank 45 bound to package[0][core:89]
[inst-e5-ol95-nps4:20378] Rank 46 bound to package[0][core:90]
[inst-e5-ol95-nps4:20378] Rank 47 bound to package[0][core:91]
[inst-e5-ol95-nps4:20378] Rank 48 bound to package[1][core:96]
[inst-e5-ol95-nps4:20378] Rank 49 bound to package[1][core:97]
[inst-e5-ol95-nps4:20378] Rank 50 bound to package[1][core:98]
[inst-e5-ol95-nps4:20378] Rank 51 bound to package[1][core:99]
[inst-e5-ol95-nps4:20378] Rank 52 bound to package[1][core:104]
[inst-e5-ol95-nps4:20378] Rank 53 bound to package[1][core:105]
[inst-e5-ol95-nps4:20378] Rank 54 bound to package[1][core:106]
[inst-e5-ol95-nps4:20378] Rank 55 bound to package[1][core:107]
[inst-e5-ol95-nps4:20378] Rank 56 bound to package[1][core:112]
[inst-e5-ol95-nps4:20378] Rank 57 bound to package[1][core:113]
[inst-e5-ol95-nps4:20378] Rank 58 bound to package[1][core:114]
[inst-e5-ol95-nps4:20378] Rank 59 bound to package[1][core:115]
[inst-e5-ol95-nps4:20378] Rank 60 bound to package[1][core:120]
[inst-e5-ol95-nps4:20378] Rank 61 bound to package[1][core:121]
[inst-e5-ol95-nps4:20378] Rank 62 bound to package[1][core:122]
[inst-e5-ol95-nps4:20378] Rank 63 bound to package[1][core:123]
[inst-e5-ol95-nps4:20378] Rank 64 bound to package[1][core:128]
[inst-e5-ol95-nps4:20378] Rank 65 bound to package[1][core:129]
[inst-e5-ol95-nps4:20378] Rank 66 bound to package[1][core:130]
[inst-e5-ol95-nps4:20378] Rank 67 bound to package[1][core:131]
[inst-e5-ol95-nps4:20378] Rank 68 bound to package[1][core:136]
[inst-e5-ol95-nps4:20378] Rank 69 bound to package[1][core:137]
[inst-e5-ol95-nps4:20378] Rank 70 bound to package[1][core:138]
[inst-e5-ol95-nps4:20378] Rank 71 bound to package[1][core:139]
[inst-e5-ol95-nps4:20378] Rank 72 bound to package[1][core:144]
[inst-e5-ol95-nps4:20378] Rank 73 bound to package[1][core:145]
[inst-e5-ol95-nps4:20378] Rank 74 bound to package[1][core:146]
[inst-e5-ol95-nps4:20378] Rank 75 bound to package[1][core:147]
[inst-e5-ol95-nps4:20378] Rank 76 bound to package[1][core:152]
[inst-e5-ol95-nps4:20378] Rank 77 bound to package[1][core:153]
[inst-e5-ol95-nps4:20378] Rank 78 bound to package[1][core:154]
[inst-e5-ol95-nps4:20378] Rank 79 bound to package[1][core:155]
[inst-e5-ol95-nps4:20378] Rank 80 bound to package[1][core:160]
[inst-e5-ol95-nps4:20378] Rank 81 bound to package[1][core:161]
[inst-e5-ol95-nps4:20378] Rank 82 bound to package[1][core:162]
[inst-e5-ol95-nps4:20378] Rank 83 bound to package[1][core:163]
[inst-e5-ol95-nps4:20378] Rank 84 bound to package[1][core:168]
[inst-e5-ol95-nps4:20378] Rank 85 bound to package[1][core:169]
[inst-e5-ol95-nps4:20378] Rank 86 bound to package[1][core:170]
[inst-e5-ol95-nps4:20378] Rank 87 bound to package[1][core:171]
[inst-e5-ol95-nps4:20378] Rank 88 bound to package[1][core:176]
[inst-e5-ol95-nps4:20378] Rank 89 bound to package[1][core:177]
[inst-e5-ol95-nps4:20378] Rank 90 bound to package[1][core:178]
[inst-e5-ol95-nps4:20378] Rank 91 bound to package[1][core:179]
[inst-e5-ol95-nps4:20378] Rank 92 bound to package[1][core:184]
[inst-e5-ol95-nps4:20378] Rank 93 bound to package[1][core:185]
[inst-e5-ol95-nps4:20378] Rank 94 bound to package[1][core:186]
[inst-e5-ol95-nps4:20378] Rank 95 bound to package[1][core:187]
$
```

[No.17]

```sh
$ mpirun -n 96 --bind-to core --map-by ppr:4:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps4:20496] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps4:20496] Rank 1 bound to package[0][core:8]
[inst-e5-ol95-nps4:20496] Rank 2 bound to package[0][core:16]
[inst-e5-ol95-nps4:20496] Rank 3 bound to package[0][core:24]
[inst-e5-ol95-nps4:20496] Rank 4 bound to package[0][core:32]
[inst-e5-ol95-nps4:20496] Rank 5 bound to package[0][core:40]
[inst-e5-ol95-nps4:20496] Rank 6 bound to package[0][core:48]
[inst-e5-ol95-nps4:20496] Rank 7 bound to package[0][core:56]
[inst-e5-ol95-nps4:20496] Rank 8 bound to package[0][core:64]
[inst-e5-ol95-nps4:20496] Rank 9 bound to package[0][core:72]
[inst-e5-ol95-nps4:20496] Rank 10 bound to package[0][core:80]
[inst-e5-ol95-nps4:20496] Rank 11 bound to package[0][core:88]
[inst-e5-ol95-nps4:20496] Rank 12 bound to package[1][core:96]
[inst-e5-ol95-nps4:20496] Rank 13 bound to package[1][core:104]
[inst-e5-ol95-nps4:20496] Rank 14 bound to package[1][core:112]
[inst-e5-ol95-nps4:20496] Rank 15 bound to package[1][core:120]
[inst-e5-ol95-nps4:20496] Rank 16 bound to package[1][core:128]
[inst-e5-ol95-nps4:20496] Rank 17 bound to package[1][core:136]
[inst-e5-ol95-nps4:20496] Rank 18 bound to package[1][core:144]
[inst-e5-ol95-nps4:20496] Rank 19 bound to package[1][core:152]
[inst-e5-ol95-nps4:20496] Rank 20 bound to package[1][core:160]
[inst-e5-ol95-nps4:20496] Rank 21 bound to package[1][core:168]
[inst-e5-ol95-nps4:20496] Rank 22 bound to package[1][core:176]
[inst-e5-ol95-nps4:20496] Rank 23 bound to package[1][core:184]
[inst-e5-ol95-nps4:20496] Rank 24 bound to package[0][core:1]
[inst-e5-ol95-nps4:20496] Rank 25 bound to package[0][core:9]
[inst-e5-ol95-nps4:20496] Rank 26 bound to package[0][core:17]
[inst-e5-ol95-nps4:20496] Rank 27 bound to package[0][core:25]
[inst-e5-ol95-nps4:20496] Rank 28 bound to package[0][core:33]
[inst-e5-ol95-nps4:20496] Rank 29 bound to package[0][core:41]
[inst-e5-ol95-nps4:20496] Rank 30 bound to package[0][core:49]
[inst-e5-ol95-nps4:20496] Rank 31 bound to package[0][core:57]
[inst-e5-ol95-nps4:20496] Rank 32 bound to package[0][core:65]
[inst-e5-ol95-nps4:20496] Rank 33 bound to package[0][core:73]
[inst-e5-ol95-nps4:20496] Rank 34 bound to package[0][core:81]
[inst-e5-ol95-nps4:20496] Rank 35 bound to package[0][core:89]
[inst-e5-ol95-nps4:20496] Rank 36 bound to package[1][core:97]
[inst-e5-ol95-nps4:20496] Rank 37 bound to package[1][core:105]
[inst-e5-ol95-nps4:20496] Rank 38 bound to package[1][core:113]
[inst-e5-ol95-nps4:20496] Rank 39 bound to package[1][core:121]
[inst-e5-ol95-nps4:20496] Rank 40 bound to package[1][core:129]
[inst-e5-ol95-nps4:20496] Rank 41 bound to package[1][core:137]
[inst-e5-ol95-nps4:20496] Rank 42 bound to package[1][core:145]
[inst-e5-ol95-nps4:20496] Rank 43 bound to package[1][core:153]
[inst-e5-ol95-nps4:20496] Rank 44 bound to package[1][core:161]
[inst-e5-ol95-nps4:20496] Rank 45 bound to package[1][core:169]
[inst-e5-ol95-nps4:20496] Rank 46 bound to package[1][core:177]
[inst-e5-ol95-nps4:20496] Rank 47 bound to package[1][core:185]
[inst-e5-ol95-nps4:20496] Rank 48 bound to package[0][core:2]
[inst-e5-ol95-nps4:20496] Rank 49 bound to package[0][core:10]
[inst-e5-ol95-nps4:20496] Rank 50 bound to package[0][core:18]
[inst-e5-ol95-nps4:20496] Rank 51 bound to package[0][core:26]
[inst-e5-ol95-nps4:20496] Rank 52 bound to package[0][core:34]
[inst-e5-ol95-nps4:20496] Rank 53 bound to package[0][core:42]
[inst-e5-ol95-nps4:20496] Rank 54 bound to package[0][core:50]
[inst-e5-ol95-nps4:20496] Rank 55 bound to package[0][core:58]
[inst-e5-ol95-nps4:20496] Rank 56 bound to package[0][core:66]
[inst-e5-ol95-nps4:20496] Rank 57 bound to package[0][core:74]
[inst-e5-ol95-nps4:20496] Rank 58 bound to package[0][core:82]
[inst-e5-ol95-nps4:20496] Rank 59 bound to package[0][core:90]
[inst-e5-ol95-nps4:20496] Rank 60 bound to package[1][core:98]
[inst-e5-ol95-nps4:20496] Rank 61 bound to package[1][core:106]
[inst-e5-ol95-nps4:20496] Rank 62 bound to package[1][core:114]
[inst-e5-ol95-nps4:20496] Rank 63 bound to package[1][core:122]
[inst-e5-ol95-nps4:20496] Rank 64 bound to package[1][core:130]
[inst-e5-ol95-nps4:20496] Rank 65 bound to package[1][core:138]
[inst-e5-ol95-nps4:20496] Rank 66 bound to package[1][core:146]
[inst-e5-ol95-nps4:20496] Rank 67 bound to package[1][core:154]
[inst-e5-ol95-nps4:20496] Rank 68 bound to package[1][core:162]
[inst-e5-ol95-nps4:20496] Rank 69 bound to package[1][core:170]
[inst-e5-ol95-nps4:20496] Rank 70 bound to package[1][core:178]
[inst-e5-ol95-nps4:20496] Rank 71 bound to package[1][core:186]
[inst-e5-ol95-nps4:20496] Rank 72 bound to package[0][core:3]
[inst-e5-ol95-nps4:20496] Rank 73 bound to package[0][core:11]
[inst-e5-ol95-nps4:20496] Rank 74 bound to package[0][core:19]
[inst-e5-ol95-nps4:20496] Rank 75 bound to package[0][core:27]
[inst-e5-ol95-nps4:20496] Rank 76 bound to package[0][core:35]
[inst-e5-ol95-nps4:20496] Rank 77 bound to package[0][core:43]
[inst-e5-ol95-nps4:20496] Rank 78 bound to package[0][core:51]
[inst-e5-ol95-nps4:20496] Rank 79 bound to package[0][core:59]
[inst-e5-ol95-nps4:20496] Rank 80 bound to package[0][core:67]
[inst-e5-ol95-nps4:20496] Rank 81 bound to package[0][core:75]
[inst-e5-ol95-nps4:20496] Rank 82 bound to package[0][core:83]
[inst-e5-ol95-nps4:20496] Rank 83 bound to package[0][core:91]
[inst-e5-ol95-nps4:20496] Rank 84 bound to package[1][core:99]
[inst-e5-ol95-nps4:20496] Rank 85 bound to package[1][core:107]
[inst-e5-ol95-nps4:20496] Rank 86 bound to package[1][core:115]
[inst-e5-ol95-nps4:20496] Rank 87 bound to package[1][core:123]
[inst-e5-ol95-nps4:20496] Rank 88 bound to package[1][core:131]
[inst-e5-ol95-nps4:20496] Rank 89 bound to package[1][core:139]
[inst-e5-ol95-nps4:20496] Rank 90 bound to package[1][core:147]
[inst-e5-ol95-nps4:20496] Rank 91 bound to package[1][core:155]
[inst-e5-ol95-nps4:20496] Rank 92 bound to package[1][core:163]
[inst-e5-ol95-nps4:20496] Rank 93 bound to package[1][core:171]
[inst-e5-ol95-nps4:20496] Rank 94 bound to package[1][core:179]
[inst-e5-ol95-nps4:20496] Rank 95 bound to package[1][core:187]
$
```


[No.18]

```sh
$ mpirun -n 192 --bind-to core --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps4:21440] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps4:21440] Rank 1 bound to package[0][core:1]
[inst-e5-ol95-nps4:21440] Rank 2 bound to package[0][core:2]
[inst-e5-ol95-nps4:21440] Rank 3 bound to package[0][core:3]
[inst-e5-ol95-nps4:21440] Rank 4 bound to package[0][core:4]
[inst-e5-ol95-nps4:21440] Rank 5 bound to package[0][core:5]
[inst-e5-ol95-nps4:21440] Rank 6 bound to package[0][core:6]
[inst-e5-ol95-nps4:21440] Rank 7 bound to package[0][core:7]
[inst-e5-ol95-nps4:21440] Rank 8 bound to package[0][core:8]
[inst-e5-ol95-nps4:21440] Rank 9 bound to package[0][core:9]
[inst-e5-ol95-nps4:21440] Rank 10 bound to package[0][core:10]
[inst-e5-ol95-nps4:21440] Rank 11 bound to package[0][core:11]
[inst-e5-ol95-nps4:21440] Rank 12 bound to package[0][core:12]
[inst-e5-ol95-nps4:21440] Rank 13 bound to package[0][core:13]
[inst-e5-ol95-nps4:21440] Rank 14 bound to package[0][core:14]
[inst-e5-ol95-nps4:21440] Rank 15 bound to package[0][core:15]
[inst-e5-ol95-nps4:21440] Rank 16 bound to package[0][core:16]
[inst-e5-ol95-nps4:21440] Rank 17 bound to package[0][core:17]
[inst-e5-ol95-nps4:21440] Rank 18 bound to package[0][core:18]
[inst-e5-ol95-nps4:21440] Rank 19 bound to package[0][core:19]
[inst-e5-ol95-nps4:21440] Rank 20 bound to package[0][core:20]
[inst-e5-ol95-nps4:21440] Rank 21 bound to package[0][core:21]
[inst-e5-ol95-nps4:21440] Rank 22 bound to package[0][core:22]
[inst-e5-ol95-nps4:21440] Rank 23 bound to package[0][core:23]
[inst-e5-ol95-nps4:21440] Rank 24 bound to package[0][core:24]
[inst-e5-ol95-nps4:21440] Rank 25 bound to package[0][core:25]
[inst-e5-ol95-nps4:21440] Rank 26 bound to package[0][core:26]
[inst-e5-ol95-nps4:21440] Rank 27 bound to package[0][core:27]
[inst-e5-ol95-nps4:21440] Rank 28 bound to package[0][core:28]
[inst-e5-ol95-nps4:21440] Rank 29 bound to package[0][core:29]
[inst-e5-ol95-nps4:21440] Rank 30 bound to package[0][core:30]
[inst-e5-ol95-nps4:21440] Rank 31 bound to package[0][core:31]
[inst-e5-ol95-nps4:21440] Rank 32 bound to package[0][core:32]
[inst-e5-ol95-nps4:21440] Rank 33 bound to package[0][core:33]
[inst-e5-ol95-nps4:21440] Rank 34 bound to package[0][core:34]
[inst-e5-ol95-nps4:21440] Rank 35 bound to package[0][core:35]
[inst-e5-ol95-nps4:21440] Rank 36 bound to package[0][core:36]
[inst-e5-ol95-nps4:21440] Rank 37 bound to package[0][core:37]
[inst-e5-ol95-nps4:21440] Rank 38 bound to package[0][core:38]
[inst-e5-ol95-nps4:21440] Rank 39 bound to package[0][core:39]
[inst-e5-ol95-nps4:21440] Rank 40 bound to package[0][core:40]
[inst-e5-ol95-nps4:21440] Rank 41 bound to package[0][core:41]
[inst-e5-ol95-nps4:21440] Rank 42 bound to package[0][core:42]
[inst-e5-ol95-nps4:21440] Rank 43 bound to package[0][core:43]
[inst-e5-ol95-nps4:21440] Rank 44 bound to package[0][core:44]
[inst-e5-ol95-nps4:21440] Rank 45 bound to package[0][core:45]
[inst-e5-ol95-nps4:21440] Rank 46 bound to package[0][core:46]
[inst-e5-ol95-nps4:21440] Rank 47 bound to package[0][core:47]
[inst-e5-ol95-nps4:21440] Rank 48 bound to package[0][core:48]
[inst-e5-ol95-nps4:21440] Rank 49 bound to package[0][core:49]
[inst-e5-ol95-nps4:21440] Rank 50 bound to package[0][core:50]
[inst-e5-ol95-nps4:21440] Rank 51 bound to package[0][core:51]
[inst-e5-ol95-nps4:21440] Rank 52 bound to package[0][core:52]
[inst-e5-ol95-nps4:21440] Rank 53 bound to package[0][core:53]
[inst-e5-ol95-nps4:21440] Rank 54 bound to package[0][core:54]
[inst-e5-ol95-nps4:21440] Rank 55 bound to package[0][core:55]
[inst-e5-ol95-nps4:21440] Rank 56 bound to package[0][core:56]
[inst-e5-ol95-nps4:21440] Rank 57 bound to package[0][core:57]
[inst-e5-ol95-nps4:21440] Rank 58 bound to package[0][core:58]
[inst-e5-ol95-nps4:21440] Rank 59 bound to package[0][core:59]
[inst-e5-ol95-nps4:21440] Rank 60 bound to package[0][core:60]
[inst-e5-ol95-nps4:21440] Rank 61 bound to package[0][core:61]
[inst-e5-ol95-nps4:21440] Rank 62 bound to package[0][core:62]
[inst-e5-ol95-nps4:21440] Rank 63 bound to package[0][core:63]
[inst-e5-ol95-nps4:21440] Rank 64 bound to package[0][core:64]
[inst-e5-ol95-nps4:21440] Rank 65 bound to package[0][core:65]
[inst-e5-ol95-nps4:21440] Rank 66 bound to package[0][core:66]
[inst-e5-ol95-nps4:21440] Rank 67 bound to package[0][core:67]
[inst-e5-ol95-nps4:21440] Rank 68 bound to package[0][core:68]
[inst-e5-ol95-nps4:21440] Rank 69 bound to package[0][core:69]
[inst-e5-ol95-nps4:21440] Rank 70 bound to package[0][core:70]
[inst-e5-ol95-nps4:21440] Rank 71 bound to package[0][core:71]
[inst-e5-ol95-nps4:21440] Rank 72 bound to package[0][core:72]
[inst-e5-ol95-nps4:21440] Rank 73 bound to package[0][core:73]
[inst-e5-ol95-nps4:21440] Rank 74 bound to package[0][core:74]
[inst-e5-ol95-nps4:21440] Rank 75 bound to package[0][core:75]
[inst-e5-ol95-nps4:21440] Rank 76 bound to package[0][core:76]
[inst-e5-ol95-nps4:21440] Rank 77 bound to package[0][core:77]
[inst-e5-ol95-nps4:21440] Rank 78 bound to package[0][core:78]
[inst-e5-ol95-nps4:21440] Rank 79 bound to package[0][core:79]
[inst-e5-ol95-nps4:21440] Rank 80 bound to package[0][core:80]
[inst-e5-ol95-nps4:21440] Rank 81 bound to package[0][core:81]
[inst-e5-ol95-nps4:21440] Rank 82 bound to package[0][core:82]
[inst-e5-ol95-nps4:21440] Rank 83 bound to package[0][core:83]
[inst-e5-ol95-nps4:21440] Rank 84 bound to package[0][core:84]
[inst-e5-ol95-nps4:21440] Rank 85 bound to package[0][core:85]
[inst-e5-ol95-nps4:21440] Rank 86 bound to package[0][core:86]
[inst-e5-ol95-nps4:21440] Rank 87 bound to package[0][core:87]
[inst-e5-ol95-nps4:21440] Rank 88 bound to package[0][core:88]
[inst-e5-ol95-nps4:21440] Rank 89 bound to package[0][core:89]
[inst-e5-ol95-nps4:21440] Rank 90 bound to package[0][core:90]
[inst-e5-ol95-nps4:21440] Rank 91 bound to package[0][core:91]
[inst-e5-ol95-nps4:21440] Rank 92 bound to package[0][core:92]
[inst-e5-ol95-nps4:21440] Rank 93 bound to package[0][core:93]
[inst-e5-ol95-nps4:21440] Rank 94 bound to package[0][core:94]
[inst-e5-ol95-nps4:21440] Rank 95 bound to package[0][core:95]
[inst-e5-ol95-nps4:21440] Rank 96 bound to package[1][core:96]
[inst-e5-ol95-nps4:21440] Rank 97 bound to package[1][core:97]
[inst-e5-ol95-nps4:21440] Rank 98 bound to package[1][core:98]
[inst-e5-ol95-nps4:21440] Rank 99 bound to package[1][core:99]
[inst-e5-ol95-nps4:21440] Rank 100 bound to package[1][core:100]
[inst-e5-ol95-nps4:21440] Rank 101 bound to package[1][core:101]
[inst-e5-ol95-nps4:21440] Rank 102 bound to package[1][core:102]
[inst-e5-ol95-nps4:21440] Rank 103 bound to package[1][core:103]
[inst-e5-ol95-nps4:21440] Rank 104 bound to package[1][core:104]
[inst-e5-ol95-nps4:21440] Rank 105 bound to package[1][core:105]
[inst-e5-ol95-nps4:21440] Rank 106 bound to package[1][core:106]
[inst-e5-ol95-nps4:21440] Rank 107 bound to package[1][core:107]
[inst-e5-ol95-nps4:21440] Rank 108 bound to package[1][core:108]
[inst-e5-ol95-nps4:21440] Rank 109 bound to package[1][core:109]
[inst-e5-ol95-nps4:21440] Rank 110 bound to package[1][core:110]
[inst-e5-ol95-nps4:21440] Rank 111 bound to package[1][core:111]
[inst-e5-ol95-nps4:21440] Rank 112 bound to package[1][core:112]
[inst-e5-ol95-nps4:21440] Rank 113 bound to package[1][core:113]
[inst-e5-ol95-nps4:21440] Rank 114 bound to package[1][core:114]
[inst-e5-ol95-nps4:21440] Rank 115 bound to package[1][core:115]
[inst-e5-ol95-nps4:21440] Rank 116 bound to package[1][core:116]
[inst-e5-ol95-nps4:21440] Rank 117 bound to package[1][core:117]
[inst-e5-ol95-nps4:21440] Rank 118 bound to package[1][core:118]
[inst-e5-ol95-nps4:21440] Rank 119 bound to package[1][core:119]
[inst-e5-ol95-nps4:21440] Rank 120 bound to package[1][core:120]
[inst-e5-ol95-nps4:21440] Rank 121 bound to package[1][core:121]
[inst-e5-ol95-nps4:21440] Rank 122 bound to package[1][core:122]
[inst-e5-ol95-nps4:21440] Rank 123 bound to package[1][core:123]
[inst-e5-ol95-nps4:21440] Rank 124 bound to package[1][core:124]
[inst-e5-ol95-nps4:21440] Rank 125 bound to package[1][core:125]
[inst-e5-ol95-nps4:21440] Rank 126 bound to package[1][core:126]
[inst-e5-ol95-nps4:21440] Rank 127 bound to package[1][core:127]
[inst-e5-ol95-nps4:21440] Rank 128 bound to package[1][core:128]
[inst-e5-ol95-nps4:21440] Rank 129 bound to package[1][core:129]
[inst-e5-ol95-nps4:21440] Rank 130 bound to package[1][core:130]
[inst-e5-ol95-nps4:21440] Rank 131 bound to package[1][core:131]
[inst-e5-ol95-nps4:21440] Rank 132 bound to package[1][core:132]
[inst-e5-ol95-nps4:21440] Rank 133 bound to package[1][core:133]
[inst-e5-ol95-nps4:21440] Rank 134 bound to package[1][core:134]
[inst-e5-ol95-nps4:21440] Rank 135 bound to package[1][core:135]
[inst-e5-ol95-nps4:21440] Rank 136 bound to package[1][core:136]
[inst-e5-ol95-nps4:21440] Rank 137 bound to package[1][core:137]
[inst-e5-ol95-nps4:21440] Rank 138 bound to package[1][core:138]
[inst-e5-ol95-nps4:21440] Rank 139 bound to package[1][core:139]
[inst-e5-ol95-nps4:21440] Rank 140 bound to package[1][core:140]
[inst-e5-ol95-nps4:21440] Rank 141 bound to package[1][core:141]
[inst-e5-ol95-nps4:21440] Rank 142 bound to package[1][core:142]
[inst-e5-ol95-nps4:21440] Rank 143 bound to package[1][core:143]
[inst-e5-ol95-nps4:21440] Rank 144 bound to package[1][core:144]
[inst-e5-ol95-nps4:21440] Rank 145 bound to package[1][core:145]
[inst-e5-ol95-nps4:21440] Rank 146 bound to package[1][core:146]
[inst-e5-ol95-nps4:21440] Rank 147 bound to package[1][core:147]
[inst-e5-ol95-nps4:21440] Rank 148 bound to package[1][core:148]
[inst-e5-ol95-nps4:21440] Rank 149 bound to package[1][core:149]
[inst-e5-ol95-nps4:21440] Rank 150 bound to package[1][core:150]
[inst-e5-ol95-nps4:21440] Rank 151 bound to package[1][core:151]
[inst-e5-ol95-nps4:21440] Rank 152 bound to package[1][core:152]
[inst-e5-ol95-nps4:21440] Rank 153 bound to package[1][core:153]
[inst-e5-ol95-nps4:21440] Rank 154 bound to package[1][core:154]
[inst-e5-ol95-nps4:21440] Rank 155 bound to package[1][core:155]
[inst-e5-ol95-nps4:21440] Rank 156 bound to package[1][core:156]
[inst-e5-ol95-nps4:21440] Rank 157 bound to package[1][core:157]
[inst-e5-ol95-nps4:21440] Rank 158 bound to package[1][core:158]
[inst-e5-ol95-nps4:21440] Rank 159 bound to package[1][core:159]
[inst-e5-ol95-nps4:21440] Rank 160 bound to package[1][core:160]
[inst-e5-ol95-nps4:21440] Rank 161 bound to package[1][core:161]
[inst-e5-ol95-nps4:21440] Rank 162 bound to package[1][core:162]
[inst-e5-ol95-nps4:21440] Rank 163 bound to package[1][core:163]
[inst-e5-ol95-nps4:21440] Rank 164 bound to package[1][core:164]
[inst-e5-ol95-nps4:21440] Rank 165 bound to package[1][core:165]
[inst-e5-ol95-nps4:21440] Rank 166 bound to package[1][core:166]
[inst-e5-ol95-nps4:21440] Rank 167 bound to package[1][core:167]
[inst-e5-ol95-nps4:21440] Rank 168 bound to package[1][core:168]
[inst-e5-ol95-nps4:21440] Rank 169 bound to package[1][core:169]
[inst-e5-ol95-nps4:21440] Rank 170 bound to package[1][core:170]
[inst-e5-ol95-nps4:21440] Rank 171 bound to package[1][core:171]
[inst-e5-ol95-nps4:21440] Rank 172 bound to package[1][core:172]
[inst-e5-ol95-nps4:21440] Rank 173 bound to package[1][core:173]
[inst-e5-ol95-nps4:21440] Rank 174 bound to package[1][core:174]
[inst-e5-ol95-nps4:21440] Rank 175 bound to package[1][core:175]
[inst-e5-ol95-nps4:21440] Rank 176 bound to package[1][core:176]
[inst-e5-ol95-nps4:21440] Rank 177 bound to package[1][core:177]
[inst-e5-ol95-nps4:21440] Rank 178 bound to package[1][core:178]
[inst-e5-ol95-nps4:21440] Rank 179 bound to package[1][core:179]
[inst-e5-ol95-nps4:21440] Rank 180 bound to package[1][core:180]
[inst-e5-ol95-nps4:21440] Rank 181 bound to package[1][core:181]
[inst-e5-ol95-nps4:21440] Rank 182 bound to package[1][core:182]
[inst-e5-ol95-nps4:21440] Rank 183 bound to package[1][core:183]
[inst-e5-ol95-nps4:21440] Rank 184 bound to package[1][core:184]
[inst-e5-ol95-nps4:21440] Rank 185 bound to package[1][core:185]
[inst-e5-ol95-nps4:21440] Rank 186 bound to package[1][core:186]
[inst-e5-ol95-nps4:21440] Rank 187 bound to package[1][core:187]
[inst-e5-ol95-nps4:21440] Rank 188 bound to package[1][core:188]
[inst-e5-ol95-nps4:21440] Rank 189 bound to package[1][core:189]
[inst-e5-ol95-nps4:21440] Rank 190 bound to package[1][core:190]
[inst-e5-ol95-nps4:21440] Rank 191 bound to package[1][core:191]
$
```

[No.19]

```sh
$ mpirun -n 192 --bind-to core --map-by ppr:8:l3cache --rank-by span --report-bindings echo -n |& sort -k 3n,3
[inst-e5-ol95-nps4:21653] Rank 0 bound to package[0][core:0]
[inst-e5-ol95-nps4:21653] Rank 1 bound to package[0][core:8]
[inst-e5-ol95-nps4:21653] Rank 2 bound to package[0][core:16]
[inst-e5-ol95-nps4:21653] Rank 3 bound to package[0][core:24]
[inst-e5-ol95-nps4:21653] Rank 4 bound to package[0][core:32]
[inst-e5-ol95-nps4:21653] Rank 5 bound to package[0][core:40]
[inst-e5-ol95-nps4:21653] Rank 6 bound to package[0][core:48]
[inst-e5-ol95-nps4:21653] Rank 7 bound to package[0][core:56]
[inst-e5-ol95-nps4:21653] Rank 8 bound to package[0][core:64]
[inst-e5-ol95-nps4:21653] Rank 9 bound to package[0][core:72]
[inst-e5-ol95-nps4:21653] Rank 10 bound to package[0][core:80]
[inst-e5-ol95-nps4:21653] Rank 11 bound to package[0][core:88]
[inst-e5-ol95-nps4:21653] Rank 12 bound to package[1][core:96]
[inst-e5-ol95-nps4:21653] Rank 13 bound to package[1][core:104]
[inst-e5-ol95-nps4:21653] Rank 14 bound to package[1][core:112]
[inst-e5-ol95-nps4:21653] Rank 15 bound to package[1][core:120]
[inst-e5-ol95-nps4:21653] Rank 16 bound to package[1][core:128]
[inst-e5-ol95-nps4:21653] Rank 17 bound to package[1][core:136]
[inst-e5-ol95-nps4:21653] Rank 18 bound to package[1][core:144]
[inst-e5-ol95-nps4:21653] Rank 19 bound to package[1][core:152]
[inst-e5-ol95-nps4:21653] Rank 20 bound to package[1][core:160]
[inst-e5-ol95-nps4:21653] Rank 21 bound to package[1][core:168]
[inst-e5-ol95-nps4:21653] Rank 22 bound to package[1][core:176]
[inst-e5-ol95-nps4:21653] Rank 23 bound to package[1][core:184]
[inst-e5-ol95-nps4:21653] Rank 24 bound to package[0][core:1]
[inst-e5-ol95-nps4:21653] Rank 25 bound to package[0][core:9]
[inst-e5-ol95-nps4:21653] Rank 26 bound to package[0][core:17]
[inst-e5-ol95-nps4:21653] Rank 27 bound to package[0][core:25]
[inst-e5-ol95-nps4:21653] Rank 28 bound to package[0][core:33]
[inst-e5-ol95-nps4:21653] Rank 29 bound to package[0][core:41]
[inst-e5-ol95-nps4:21653] Rank 30 bound to package[0][core:49]
[inst-e5-ol95-nps4:21653] Rank 31 bound to package[0][core:57]
[inst-e5-ol95-nps4:21653] Rank 32 bound to package[0][core:65]
[inst-e5-ol95-nps4:21653] Rank 33 bound to package[0][core:73]
[inst-e5-ol95-nps4:21653] Rank 34 bound to package[0][core:81]
[inst-e5-ol95-nps4:21653] Rank 35 bound to package[0][core:89]
[inst-e5-ol95-nps4:21653] Rank 36 bound to package[1][core:97]
[inst-e5-ol95-nps4:21653] Rank 37 bound to package[1][core:105]
[inst-e5-ol95-nps4:21653] Rank 38 bound to package[1][core:113]
[inst-e5-ol95-nps4:21653] Rank 39 bound to package[1][core:121]
[inst-e5-ol95-nps4:21653] Rank 40 bound to package[1][core:129]
[inst-e5-ol95-nps4:21653] Rank 41 bound to package[1][core:137]
[inst-e5-ol95-nps4:21653] Rank 42 bound to package[1][core:145]
[inst-e5-ol95-nps4:21653] Rank 43 bound to package[1][core:153]
[inst-e5-ol95-nps4:21653] Rank 44 bound to package[1][core:161]
[inst-e5-ol95-nps4:21653] Rank 45 bound to package[1][core:169]
[inst-e5-ol95-nps4:21653] Rank 46 bound to package[1][core:177]
[inst-e5-ol95-nps4:21653] Rank 47 bound to package[1][core:185]
[inst-e5-ol95-nps4:21653] Rank 48 bound to package[0][core:2]
[inst-e5-ol95-nps4:21653] Rank 49 bound to package[0][core:10]
[inst-e5-ol95-nps4:21653] Rank 50 bound to package[0][core:18]
[inst-e5-ol95-nps4:21653] Rank 51 bound to package[0][core:26]
[inst-e5-ol95-nps4:21653] Rank 52 bound to package[0][core:34]
[inst-e5-ol95-nps4:21653] Rank 53 bound to package[0][core:42]
[inst-e5-ol95-nps4:21653] Rank 54 bound to package[0][core:50]
[inst-e5-ol95-nps4:21653] Rank 55 bound to package[0][core:58]
[inst-e5-ol95-nps4:21653] Rank 56 bound to package[0][core:66]
[inst-e5-ol95-nps4:21653] Rank 57 bound to package[0][core:74]
[inst-e5-ol95-nps4:21653] Rank 58 bound to package[0][core:82]
[inst-e5-ol95-nps4:21653] Rank 59 bound to package[0][core:90]
[inst-e5-ol95-nps4:21653] Rank 60 bound to package[1][core:98]
[inst-e5-ol95-nps4:21653] Rank 61 bound to package[1][core:106]
[inst-e5-ol95-nps4:21653] Rank 62 bound to package[1][core:114]
[inst-e5-ol95-nps4:21653] Rank 63 bound to package[1][core:122]
[inst-e5-ol95-nps4:21653] Rank 64 bound to package[1][core:130]
[inst-e5-ol95-nps4:21653] Rank 65 bound to package[1][core:138]
[inst-e5-ol95-nps4:21653] Rank 66 bound to package[1][core:146]
[inst-e5-ol95-nps4:21653] Rank 67 bound to package[1][core:154]
[inst-e5-ol95-nps4:21653] Rank 68 bound to package[1][core:162]
[inst-e5-ol95-nps4:21653] Rank 69 bound to package[1][core:170]
[inst-e5-ol95-nps4:21653] Rank 70 bound to package[1][core:178]
[inst-e5-ol95-nps4:21653] Rank 71 bound to package[1][core:186]
[inst-e5-ol95-nps4:21653] Rank 72 bound to package[0][core:3]
[inst-e5-ol95-nps4:21653] Rank 73 bound to package[0][core:11]
[inst-e5-ol95-nps4:21653] Rank 74 bound to package[0][core:19]
[inst-e5-ol95-nps4:21653] Rank 75 bound to package[0][core:27]
[inst-e5-ol95-nps4:21653] Rank 76 bound to package[0][core:35]
[inst-e5-ol95-nps4:21653] Rank 77 bound to package[0][core:43]
[inst-e5-ol95-nps4:21653] Rank 78 bound to package[0][core:51]
[inst-e5-ol95-nps4:21653] Rank 79 bound to package[0][core:59]
[inst-e5-ol95-nps4:21653] Rank 80 bound to package[0][core:67]
[inst-e5-ol95-nps4:21653] Rank 81 bound to package[0][core:75]
[inst-e5-ol95-nps4:21653] Rank 82 bound to package[0][core:83]
[inst-e5-ol95-nps4:21653] Rank 83 bound to package[0][core:91]
[inst-e5-ol95-nps4:21653] Rank 84 bound to package[1][core:99]
[inst-e5-ol95-nps4:21653] Rank 85 bound to package[1][core:107]
[inst-e5-ol95-nps4:21653] Rank 86 bound to package[1][core:115]
[inst-e5-ol95-nps4:21653] Rank 87 bound to package[1][core:123]
[inst-e5-ol95-nps4:21653] Rank 88 bound to package[1][core:131]
[inst-e5-ol95-nps4:21653] Rank 89 bound to package[1][core:139]
[inst-e5-ol95-nps4:21653] Rank 90 bound to package[1][core:147]
[inst-e5-ol95-nps4:21653] Rank 91 bound to package[1][core:155]
[inst-e5-ol95-nps4:21653] Rank 92 bound to package[1][core:163]
[inst-e5-ol95-nps4:21653] Rank 93 bound to package[1][core:171]
[inst-e5-ol95-nps4:21653] Rank 94 bound to package[1][core:179]
[inst-e5-ol95-nps4:21653] Rank 95 bound to package[1][core:187]
[inst-e5-ol95-nps4:21653] Rank 96 bound to package[0][core:4]
[inst-e5-ol95-nps4:21653] Rank 97 bound to package[0][core:12]
[inst-e5-ol95-nps4:21653] Rank 98 bound to package[0][core:20]
[inst-e5-ol95-nps4:21653] Rank 99 bound to package[0][core:28]
[inst-e5-ol95-nps4:21653] Rank 100 bound to package[0][core:36]
[inst-e5-ol95-nps4:21653] Rank 101 bound to package[0][core:44]
[inst-e5-ol95-nps4:21653] Rank 102 bound to package[0][core:52]
[inst-e5-ol95-nps4:21653] Rank 103 bound to package[0][core:60]
[inst-e5-ol95-nps4:21653] Rank 104 bound to package[0][core:68]
[inst-e5-ol95-nps4:21653] Rank 105 bound to package[0][core:76]
[inst-e5-ol95-nps4:21653] Rank 106 bound to package[0][core:84]
[inst-e5-ol95-nps4:21653] Rank 107 bound to package[0][core:92]
[inst-e5-ol95-nps4:21653] Rank 108 bound to package[1][core:100]
[inst-e5-ol95-nps4:21653] Rank 109 bound to package[1][core:108]
[inst-e5-ol95-nps4:21653] Rank 110 bound to package[1][core:116]
[inst-e5-ol95-nps4:21653] Rank 111 bound to package[1][core:124]
[inst-e5-ol95-nps4:21653] Rank 112 bound to package[1][core:132]
[inst-e5-ol95-nps4:21653] Rank 113 bound to package[1][core:140]
[inst-e5-ol95-nps4:21653] Rank 114 bound to package[1][core:148]
[inst-e5-ol95-nps4:21653] Rank 115 bound to package[1][core:156]
[inst-e5-ol95-nps4:21653] Rank 116 bound to package[1][core:164]
[inst-e5-ol95-nps4:21653] Rank 117 bound to package[1][core:172]
[inst-e5-ol95-nps4:21653] Rank 118 bound to package[1][core:180]
[inst-e5-ol95-nps4:21653] Rank 119 bound to package[1][core:188]
[inst-e5-ol95-nps4:21653] Rank 120 bound to package[0][core:5]
[inst-e5-ol95-nps4:21653] Rank 121 bound to package[0][core:13]
[inst-e5-ol95-nps4:21653] Rank 122 bound to package[0][core:21]
[inst-e5-ol95-nps4:21653] Rank 123 bound to package[0][core:29]
[inst-e5-ol95-nps4:21653] Rank 124 bound to package[0][core:37]
[inst-e5-ol95-nps4:21653] Rank 125 bound to package[0][core:45]
[inst-e5-ol95-nps4:21653] Rank 126 bound to package[0][core:53]
[inst-e5-ol95-nps4:21653] Rank 127 bound to package[0][core:61]
[inst-e5-ol95-nps4:21653] Rank 128 bound to package[0][core:69]
[inst-e5-ol95-nps4:21653] Rank 129 bound to package[0][core:77]
[inst-e5-ol95-nps4:21653] Rank 130 bound to package[0][core:85]
[inst-e5-ol95-nps4:21653] Rank 131 bound to package[0][core:93]
[inst-e5-ol95-nps4:21653] Rank 132 bound to package[1][core:101]
[inst-e5-ol95-nps4:21653] Rank 133 bound to package[1][core:109]
[inst-e5-ol95-nps4:21653] Rank 134 bound to package[1][core:117]
[inst-e5-ol95-nps4:21653] Rank 135 bound to package[1][core:125]
[inst-e5-ol95-nps4:21653] Rank 136 bound to package[1][core:133]
[inst-e5-ol95-nps4:21653] Rank 137 bound to package[1][core:141]
[inst-e5-ol95-nps4:21653] Rank 138 bound to package[1][core:149]
[inst-e5-ol95-nps4:21653] Rank 139 bound to package[1][core:157]
[inst-e5-ol95-nps4:21653] Rank 140 bound to package[1][core:165]
[inst-e5-ol95-nps4:21653] Rank 141 bound to package[1][core:173]
[inst-e5-ol95-nps4:21653] Rank 142 bound to package[1][core:181]
[inst-e5-ol95-nps4:21653] Rank 143 bound to package[1][core:189]
[inst-e5-ol95-nps4:21653] Rank 144 bound to package[0][core:6]
[inst-e5-ol95-nps4:21653] Rank 145 bound to package[0][core:14]
[inst-e5-ol95-nps4:21653] Rank 146 bound to package[0][core:22]
[inst-e5-ol95-nps4:21653] Rank 147 bound to package[0][core:30]
[inst-e5-ol95-nps4:21653] Rank 148 bound to package[0][core:38]
[inst-e5-ol95-nps4:21653] Rank 149 bound to package[0][core:46]
[inst-e5-ol95-nps4:21653] Rank 150 bound to package[0][core:54]
[inst-e5-ol95-nps4:21653] Rank 151 bound to package[0][core:62]
[inst-e5-ol95-nps4:21653] Rank 152 bound to package[0][core:70]
[inst-e5-ol95-nps4:21653] Rank 153 bound to package[0][core:78]
[inst-e5-ol95-nps4:21653] Rank 154 bound to package[0][core:86]
[inst-e5-ol95-nps4:21653] Rank 155 bound to package[0][core:94]
[inst-e5-ol95-nps4:21653] Rank 156 bound to package[1][core:102]
[inst-e5-ol95-nps4:21653] Rank 157 bound to package[1][core:110]
[inst-e5-ol95-nps4:21653] Rank 158 bound to package[1][core:118]
[inst-e5-ol95-nps4:21653] Rank 159 bound to package[1][core:126]
[inst-e5-ol95-nps4:21653] Rank 160 bound to package[1][core:134]
[inst-e5-ol95-nps4:21653] Rank 161 bound to package[1][core:142]
[inst-e5-ol95-nps4:21653] Rank 162 bound to package[1][core:150]
[inst-e5-ol95-nps4:21653] Rank 163 bound to package[1][core:158]
[inst-e5-ol95-nps4:21653] Rank 164 bound to package[1][core:166]
[inst-e5-ol95-nps4:21653] Rank 165 bound to package[1][core:174]
[inst-e5-ol95-nps4:21653] Rank 166 bound to package[1][core:182]
[inst-e5-ol95-nps4:21653] Rank 167 bound to package[1][core:190]
[inst-e5-ol95-nps4:21653] Rank 168 bound to package[0][core:7]
[inst-e5-ol95-nps4:21653] Rank 169 bound to package[0][core:15]
[inst-e5-ol95-nps4:21653] Rank 170 bound to package[0][core:23]
[inst-e5-ol95-nps4:21653] Rank 171 bound to package[0][core:31]
[inst-e5-ol95-nps4:21653] Rank 172 bound to package[0][core:39]
[inst-e5-ol95-nps4:21653] Rank 173 bound to package[0][core:47]
[inst-e5-ol95-nps4:21653] Rank 174 bound to package[0][core:55]
[inst-e5-ol95-nps4:21653] Rank 175 bound to package[0][core:63]
[inst-e5-ol95-nps4:21653] Rank 176 bound to package[0][core:71]
[inst-e5-ol95-nps4:21653] Rank 177 bound to package[0][core:79]
[inst-e5-ol95-nps4:21653] Rank 178 bound to package[0][core:87]
[inst-e5-ol95-nps4:21653] Rank 179 bound to package[0][core:95]
[inst-e5-ol95-nps4:21653] Rank 180 bound to package[1][core:103]
[inst-e5-ol95-nps4:21653] Rank 181 bound to package[1][core:111]
[inst-e5-ol95-nps4:21653] Rank 182 bound to package[1][core:119]
[inst-e5-ol95-nps4:21653] Rank 183 bound to package[1][core:127]
[inst-e5-ol95-nps4:21653] Rank 184 bound to package[1][core:135]
[inst-e5-ol95-nps4:21653] Rank 185 bound to package[1][core:143]
[inst-e5-ol95-nps4:21653] Rank 186 bound to package[1][core:151]
[inst-e5-ol95-nps4:21653] Rank 187 bound to package[1][core:159]
[inst-e5-ol95-nps4:21653] Rank 188 bound to package[1][core:167]
[inst-e5-ol95-nps4:21653] Rank 189 bound to package[1][core:175]
[inst-e5-ol95-nps4:21653] Rank 190 bound to package[1][core:183]
[inst-e5-ol95-nps4:21653] Rank 191 bound to package[1][core:191]
$
```

[No.20]

```sh
$ mpirun -n 8 --bind-to core --map-by ppr:1:numa:PE=24 -x OMP_NUM_THREAD=24 -x OMP_PROC_BIND=TRUE bash -c 'sleep $OMPI_COMM_WORLD_RANK; echo "Rank $OMPI_COMM_WORLD_RANK Node `echo $((OMPI_COMM_WORLD_RANK / OMPI_COMM_WORLD_LOCAL_SIZE))`"; ./show_thread_bind | sort -k 2n,2'
Rank 0 Node 0
Thread  0 Core  0
Thread  1 Core  1
Thread  2 Core  2
Thread  3 Core  3
Thread  4 Core  4
Thread  5 Core  5
Thread  6 Core  6
Thread  7 Core  7
Thread  8 Core  8
Thread  9 Core  9
Thread 10 Core 10
Thread 11 Core 11
Thread 12 Core 12
Thread 13 Core 13
Thread 14 Core 14
Thread 15 Core 15
Thread 16 Core 16
Thread 17 Core 17
Thread 18 Core 18
Thread 19 Core 19
Thread 20 Core 20
Thread 21 Core 21
Thread 22 Core 22
Thread 23 Core 23
Rank 1 Node 0
Thread  0 Core 24
Thread  1 Core 25
Thread  2 Core 26
Thread  3 Core 27
Thread  4 Core 28
Thread  5 Core 29
Thread  6 Core 30
Thread  7 Core 31
Thread  8 Core 32
Thread  9 Core 33
Thread 10 Core 34
Thread 11 Core 35
Thread 12 Core 36
Thread 13 Core 37
Thread 14 Core 38
Thread 15 Core 39
Thread 16 Core 40
Thread 17 Core 41
Thread 18 Core 42
Thread 19 Core 43
Thread 20 Core 44
Thread 21 Core 45
Thread 22 Core 46
Thread 23 Core 47
Rank 2 Node 0
Thread  0 Core 48
Thread  1 Core 49
Thread  2 Core 50
Thread  3 Core 51
Thread  4 Core 52
Thread  5 Core 53
Thread  6 Core 54
Thread  7 Core 55
Thread  8 Core 56
Thread  9 Core 57
Thread 10 Core 58
Thread 11 Core 59
Thread 12 Core 60
Thread 13 Core 61
Thread 14 Core 62
Thread 15 Core 63
Thread 16 Core 64
Thread 17 Core 65
Thread 18 Core 66
Thread 19 Core 67
Thread 20 Core 68
Thread 21 Core 69
Thread 22 Core 70
Thread 23 Core 71
Rank 3 Node 0
Thread  0 Core 72
Thread  1 Core 73
Thread  2 Core 74
Thread  3 Core 75
Thread  4 Core 76
Thread  5 Core 77
Thread  6 Core 78
Thread  7 Core 79
Thread  8 Core 80
Thread  9 Core 81
Thread 10 Core 82
Thread 11 Core 83
Thread 12 Core 84
Thread 13 Core 85
Thread 14 Core 86
Thread 15 Core 87
Thread 16 Core 88
Thread 17 Core 89
Thread 18 Core 90
Thread 19 Core 91
Thread 20 Core 92
Thread 21 Core 93
Thread 22 Core 94
Thread 23 Core 95
Rank 4 Node 0
Thread  0 Core 96
Thread  1 Core 97
Thread  2 Core 98
Thread  3 Core 99
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
Rank 5 Node 0
Thread  0 Core 120
Thread  1 Core 121
Thread  2 Core 122
Thread  3 Core 123
Thread  4 Core 124
Thread  5 Core 125
Thread  6 Core 126
Thread  7 Core 127
Thread  8 Core 128
Thread  9 Core 129
Thread 10 Core 130
Thread 11 Core 131
Thread 12 Core 132
Thread 13 Core 133
Thread 14 Core 134
Thread 15 Core 135
Thread 16 Core 136
Thread 17 Core 137
Thread 18 Core 138
Thread 19 Core 139
Thread 20 Core 140
Thread 21 Core 141
Thread 22 Core 142
Thread 23 Core 143
Rank 6 Node 0
Thread  0 Core 144
Thread  1 Core 145
Thread  2 Core 146
Thread  3 Core 147
Thread  4 Core 148
Thread  5 Core 149
Thread  6 Core 150
Thread  7 Core 151
Thread  8 Core 152
Thread  9 Core 153
Thread 10 Core 154
Thread 11 Core 155
Thread 12 Core 156
Thread 13 Core 157
Thread 14 Core 158
Thread 15 Core 159
Thread 16 Core 160
Thread 17 Core 161
Thread 18 Core 162
Thread 19 Core 163
Thread 20 Core 164
Thread 21 Core 165
Thread 22 Core 166
Thread 23 Core 167
Rank 7 Node 0
Thread  0 Core 168
Thread  1 Core 169
Thread  2 Core 170
Thread  3 Core 171
Thread  4 Core 172
Thread  5 Core 173
Thread  6 Core 174
Thread  7 Core 175
Thread  8 Core 176
Thread  9 Core 177
Thread 10 Core 178
Thread 11 Core 179
Thread 12 Core 180
Thread 13 Core 181
Thread 14 Core 182
Thread 15 Core 183
Thread 16 Core 184
Thread 17 Core 185
Thread 18 Core 186
Thread 19 Core 187
Thread 20 Core 188
Thread 21 Core 189
Thread 22 Core 190
Thread 23 Core 191
$
```

[No.21]

```sh
$ mpirun -n 24 --bind-to core --map-by ppr:1:l3cache:PE=8 -x OMP_NUM_THREAD=8 -x OMP_PROC_BIND=TRUE bash -c 'sleep $OMPI_COMM_WORLD_RANK; echo "Rank $OMPI_COMM_WORLD_RANK Node `echo $((OMPI_COMM_WORLD_RANK / OMPI_COMM_WORLD_LOCAL_SIZE))`"; ./show_thread_bind | sort -k 2n,2'
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
$
```

### 3-1-2. Slurm

[No.1]

```sh
$ srun -p e5 -n 1 --cpu-bind=cores bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0
$
```

[No.2]

```sh
$ srun -p e5 -n 2 --cpu-bind=cores bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0
Rank 1 Node 0 Core 96
$
```

[No.3]

```sh
$ srun -p e5 -n 24 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do seq -s, $i 4 $((i+8)) | tr '\n' ','; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
$
```

[No.4]

```sh
$ srun -p e5 -n 48 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do for j in \`seq $i 4 $((i+8))\`; do for k in \`seq 0 1\`; do echo -n $j","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
$
```

[No.5]

```sh
$ srun -p e5 -n 48 --cpu-bind=map_ldom:`for i in \`seq 0 1\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
Rank 24 Node 0 Core 0-7
Rank 25 Node 0 Core 8-15
Rank 26 Node 0 Core 16-23
Rank 27 Node 0 Core 24-31
Rank 28 Node 0 Core 32-39
Rank 29 Node 0 Core 40-47
Rank 30 Node 0 Core 48-55
Rank 31 Node 0 Core 56-63
Rank 32 Node 0 Core 64-71
Rank 33 Node 0 Core 72-79
Rank 34 Node 0 Core 80-87
Rank 35 Node 0 Core 88-95
Rank 36 Node 0 Core 96-103
Rank 37 Node 0 Core 104-111
Rank 38 Node 0 Core 112-119
Rank 39 Node 0 Core 120-127
Rank 40 Node 0 Core 128-135
Rank 41 Node 0 Core 136-143
Rank 42 Node 0 Core 144-151
Rank 43 Node 0 Core 152-159
Rank 44 Node 0 Core 160-167
Rank 45 Node 0 Core 168-175
Rank 46 Node 0 Core 176-183
Rank 47 Node 0 Core 184-191
$
```

[No.6]

```sh
$ srun -p e5 -n 96 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do for j in \`seq $i 4 $((i+8))\`; do for k in \`seq 0 3\`; do echo -n $j","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
$
```

[No.7]

```sh
$ srun -p e5 -n 96 --cpu-bind=map_ldom:`for i in \`seq 0 3\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
Rank 24 Node 0 Core 0-7
Rank 25 Node 0 Core 8-15
Rank 26 Node 0 Core 16-23
Rank 27 Node 0 Core 24-31
Rank 28 Node 0 Core 32-39
Rank 29 Node 0 Core 40-47
Rank 30 Node 0 Core 48-55
Rank 31 Node 0 Core 56-63
Rank 32 Node 0 Core 64-71
Rank 33 Node 0 Core 72-79
Rank 34 Node 0 Core 80-87
Rank 35 Node 0 Core 88-95
Rank 36 Node 0 Core 96-103
Rank 37 Node 0 Core 104-111
Rank 38 Node 0 Core 112-119
Rank 39 Node 0 Core 120-127
Rank 40 Node 0 Core 128-135
Rank 41 Node 0 Core 136-143
Rank 42 Node 0 Core 144-151
Rank 43 Node 0 Core 152-159
Rank 44 Node 0 Core 160-167
Rank 45 Node 0 Core 168-175
Rank 46 Node 0 Core 176-183
Rank 47 Node 0 Core 184-191
Rank 48 Node 0 Core 0-7
Rank 49 Node 0 Core 8-15
Rank 50 Node 0 Core 16-23
Rank 51 Node 0 Core 24-31
Rank 52 Node 0 Core 32-39
Rank 53 Node 0 Core 40-47
Rank 54 Node 0 Core 48-55
Rank 55 Node 0 Core 56-63
Rank 56 Node 0 Core 64-71
Rank 57 Node 0 Core 72-79
Rank 58 Node 0 Core 80-87
Rank 59 Node 0 Core 88-95
Rank 60 Node 0 Core 96-103
Rank 61 Node 0 Core 104-111
Rank 62 Node 0 Core 112-119
Rank 63 Node 0 Core 120-127
Rank 64 Node 0 Core 128-135
Rank 65 Node 0 Core 136-143
Rank 66 Node 0 Core 144-151
Rank 67 Node 0 Core 152-159
Rank 68 Node 0 Core 160-167
Rank 69 Node 0 Core 168-175
Rank 70 Node 0 Core 176-183
Rank 71 Node 0 Core 184-191
Rank 72 Node 0 Core 0-7
Rank 73 Node 0 Core 8-15
Rank 74 Node 0 Core 16-23
Rank 75 Node 0 Core 24-31
Rank 76 Node 0 Core 32-39
Rank 77 Node 0 Core 40-47
Rank 78 Node 0 Core 48-55
Rank 79 Node 0 Core 56-63
Rank 80 Node 0 Core 64-71
Rank 81 Node 0 Core 72-79
Rank 82 Node 0 Core 80-87
Rank 83 Node 0 Core 88-95
Rank 84 Node 0 Core 96-103
Rank 85 Node 0 Core 104-111
Rank 86 Node 0 Core 112-119
Rank 87 Node 0 Core 120-127
Rank 88 Node 0 Core 128-135
Rank 89 Node 0 Core 136-143
Rank 90 Node 0 Core 144-151
Rank 91 Node 0 Core 152-159
Rank 92 Node 0 Core 160-167
Rank 93 Node 0 Core 168-175
Rank 94 Node 0 Core 176-183
Rank 95 Node 0 Core 184-191
$
```

[No.8]

```sh
$ srun -p e5 -n 192 --cpu-bind=map_cpu:`seq -s, 0 191 | tr -d '\n'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
$
```

[No.9]

```sh
$ srun -p e5 -n 192 --cpu-bind=map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
Rank 24 Node 0 Core 0-7
Rank 25 Node 0 Core 8-15
Rank 26 Node 0 Core 16-23
Rank 27 Node 0 Core 24-31
Rank 28 Node 0 Core 32-39
Rank 29 Node 0 Core 40-47
Rank 30 Node 0 Core 48-55
Rank 31 Node 0 Core 56-63
Rank 32 Node 0 Core 64-71
Rank 33 Node 0 Core 72-79
Rank 34 Node 0 Core 80-87
Rank 35 Node 0 Core 88-95
Rank 36 Node 0 Core 96-103
Rank 37 Node 0 Core 104-111
Rank 38 Node 0 Core 112-119
Rank 39 Node 0 Core 120-127
Rank 40 Node 0 Core 128-135
Rank 41 Node 0 Core 136-143
Rank 42 Node 0 Core 144-151
Rank 43 Node 0 Core 152-159
Rank 44 Node 0 Core 160-167
Rank 45 Node 0 Core 168-175
Rank 46 Node 0 Core 176-183
Rank 47 Node 0 Core 184-191
Rank 48 Node 0 Core 0-7
Rank 49 Node 0 Core 8-15
Rank 50 Node 0 Core 16-23
Rank 51 Node 0 Core 24-31
Rank 52 Node 0 Core 32-39
Rank 53 Node 0 Core 40-47
Rank 54 Node 0 Core 48-55
Rank 55 Node 0 Core 56-63
Rank 56 Node 0 Core 64-71
Rank 57 Node 0 Core 72-79
Rank 58 Node 0 Core 80-87
Rank 59 Node 0 Core 88-95
Rank 60 Node 0 Core 96-103
Rank 61 Node 0 Core 104-111
Rank 62 Node 0 Core 112-119
Rank 63 Node 0 Core 120-127
Rank 64 Node 0 Core 128-135
Rank 65 Node 0 Core 136-143
Rank 66 Node 0 Core 144-151
Rank 67 Node 0 Core 152-159
Rank 68 Node 0 Core 160-167
Rank 69 Node 0 Core 168-175
Rank 70 Node 0 Core 176-183
Rank 71 Node 0 Core 184-191
Rank 72 Node 0 Core 0-7
Rank 73 Node 0 Core 8-15
Rank 74 Node 0 Core 16-23
Rank 75 Node 0 Core 24-31
Rank 76 Node 0 Core 32-39
Rank 77 Node 0 Core 40-47
Rank 78 Node 0 Core 48-55
Rank 79 Node 0 Core 56-63
Rank 80 Node 0 Core 64-71
Rank 81 Node 0 Core 72-79
Rank 82 Node 0 Core 80-87
Rank 83 Node 0 Core 88-95
Rank 84 Node 0 Core 96-103
Rank 85 Node 0 Core 104-111
Rank 86 Node 0 Core 112-119
Rank 87 Node 0 Core 120-127
Rank 88 Node 0 Core 128-135
Rank 89 Node 0 Core 136-143
Rank 90 Node 0 Core 144-151
Rank 91 Node 0 Core 152-159
Rank 92 Node 0 Core 160-167
Rank 93 Node 0 Core 168-175
Rank 94 Node 0 Core 176-183
Rank 95 Node 0 Core 184-191
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
Rank 120 Node 0 Core 0-7
Rank 121 Node 0 Core 8-15
Rank 122 Node 0 Core 16-23
Rank 123 Node 0 Core 24-31
Rank 124 Node 0 Core 32-39
Rank 125 Node 0 Core 40-47
Rank 126 Node 0 Core 48-55
Rank 127 Node 0 Core 56-63
Rank 128 Node 0 Core 64-71
Rank 129 Node 0 Core 72-79
Rank 130 Node 0 Core 80-87
Rank 131 Node 0 Core 88-95
Rank 132 Node 0 Core 96-103
Rank 133 Node 0 Core 104-111
Rank 134 Node 0 Core 112-119
Rank 135 Node 0 Core 120-127
Rank 136 Node 0 Core 128-135
Rank 137 Node 0 Core 136-143
Rank 138 Node 0 Core 144-151
Rank 139 Node 0 Core 152-159
Rank 140 Node 0 Core 160-167
Rank 141 Node 0 Core 168-175
Rank 142 Node 0 Core 176-183
Rank 143 Node 0 Core 184-191
Rank 144 Node 0 Core 0-7
Rank 145 Node 0 Core 8-15
Rank 146 Node 0 Core 16-23
Rank 147 Node 0 Core 24-31
Rank 148 Node 0 Core 32-39
Rank 149 Node 0 Core 40-47
Rank 150 Node 0 Core 48-55
Rank 151 Node 0 Core 56-63
Rank 152 Node 0 Core 64-71
Rank 153 Node 0 Core 72-79
Rank 154 Node 0 Core 80-87
Rank 155 Node 0 Core 88-95
Rank 156 Node 0 Core 96-103
Rank 157 Node 0 Core 104-111
Rank 158 Node 0 Core 112-119
Rank 159 Node 0 Core 120-127
Rank 160 Node 0 Core 128-135
Rank 161 Node 0 Core 136-143
Rank 162 Node 0 Core 144-151
Rank 163 Node 0 Core 152-159
Rank 164 Node 0 Core 160-167
Rank 165 Node 0 Core 168-175
Rank 166 Node 0 Core 176-183
Rank 167 Node 0 Core 184-191
Rank 168 Node 0 Core 0-7
Rank 169 Node 0 Core 8-15
Rank 170 Node 0 Core 16-23
Rank 171 Node 0 Core 24-31
Rank 172 Node 0 Core 32-39
Rank 173 Node 0 Core 40-47
Rank 174 Node 0 Core 48-55
Rank 175 Node 0 Core 56-63
Rank 176 Node 0 Core 64-71
Rank 177 Node 0 Core 72-79
Rank 178 Node 0 Core 80-87
Rank 179 Node 0 Core 88-95
Rank 180 Node 0 Core 96-103
Rank 181 Node 0 Core 104-111
Rank 182 Node 0 Core 112-119
Rank 183 Node 0 Core 120-127
Rank 184 Node 0 Core 128-135
Rank 185 Node 0 Core 136-143
Rank 186 Node 0 Core 144-151
Rank 187 Node 0 Core 152-159
Rank 188 Node 0 Core 160-167
Rank 189 Node 0 Core 168-175
Rank 190 Node 0 Core 176-183
Rank 191 Node 0 Core 184-191
$
```

[No.10]

```sh
$ OMP_NUM_THREADS=96 OMP_PROC_BIND=TRUE srun -p e5 -n 2 -c 96 --cpu-bind=socket bash -c 'sleep $SLURM_PROCID; echo "Rank $SLURM_PROCID Node $SLURM_NODEID"; ./show_thread_bind | sort -k 2n,2'
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
Rank 1 Node 0
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
Thread 32 Core 128
Thread 33 Core 129
Thread 34 Core 130
Thread 35 Core 131
Thread 36 Core 132
Thread 37 Core 133
Thread 38 Core 134
Thread 39 Core 135
Thread 40 Core 136
Thread 41 Core 137
Thread 42 Core 138
Thread 43 Core 139
Thread 44 Core 140
Thread 45 Core 141
Thread 46 Core 142
Thread 47 Core 143
Thread 48 Core 144
Thread 49 Core 145
Thread 50 Core 146
Thread 51 Core 147
Thread 52 Core 148
Thread 53 Core 149
Thread 54 Core 150
Thread 55 Core 151
Thread 56 Core 152
Thread 57 Core 153
Thread 58 Core 154
Thread 59 Core 155
Thread 60 Core 156
Thread 61 Core 157
Thread 62 Core 158
Thread 63 Core 159
Thread 64 Core 160
Thread 65 Core 161
Thread 66 Core 162
Thread 67 Core 163
Thread 68 Core 164
Thread 69 Core 165
Thread 70 Core 166
Thread 71 Core 167
Thread 72 Core 168
Thread 73 Core 169
Thread 74 Core 170
Thread 75 Core 171
Thread 76 Core 172
Thread 77 Core 173
Thread 78 Core 174
Thread 79 Core 175
Thread 80 Core 176
Thread 81 Core 177
Thread 82 Core 178
Thread 83 Core 179
Thread 84 Core 180
Thread 85 Core 181
Thread 86 Core 182
Thread 87 Core 183
Thread 88 Core 184
Thread 89 Core 185
Thread 90 Core 186
Thread 91 Core 187
Thread 92 Core 188
Thread 93 Core 189
Thread 94 Core 190
Thread 95 Core 191
$
```

[No.11]

```sh
$ OMP_NUM_THREADS=8 OMP_PROC_BIND=TRUE srun -p e5 -n 24 -c 8 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do seq -s, $i 4 $((i+8)) | tr '\n' ','; done | sed 's/,$//g'` bash -c 'sleep $SLURM_PROCID; echo "Rank $SLURM_PROCID Node $SLURM_NODEID"; ./show_thread_bind | sort -k 2n,2'
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
$
```

[No.12]

```sh
$ srun -p e5 -n 8 --cpu-bind=map_cpu:`seq -s, 0 24 191 | tr -d '\n'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
Rank 0 Node 0 Core 0
Rank 1 Node 0 Core 24
Rank 2 Node 0 Core 48
Rank 3 Node 0 Core 72
Rank 4 Node 0 Core 96
Rank 5 Node 0 Core 120
Rank 6 Node 0 Core 144
Rank 7 Node 0 Core 168
$
```

[No.13]

```sh
$ srun -p e5 -n 24 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do seq -s, $i 4 $((i+8)) | tr '\n' ','; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
$
```

[No.14]

```sh
$ srun -p e5 -n 48 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do for j in \`seq $i 4 $((i+8))\`; do for k in \`seq 0 1\`; do echo -n $j","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
$
```

[No.15]

```sh
$ srun -p e5 -n 48 --cpu-bind=map_ldom:`for i in \`seq 0 1\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
Rank 24 Node 0 Core 0-7
Rank 25 Node 0 Core 8-15
Rank 26 Node 0 Core 16-23
Rank 27 Node 0 Core 24-31
Rank 28 Node 0 Core 32-39
Rank 29 Node 0 Core 40-47
Rank 30 Node 0 Core 48-55
Rank 31 Node 0 Core 56-63
Rank 32 Node 0 Core 64-71
Rank 33 Node 0 Core 72-79
Rank 34 Node 0 Core 80-87
Rank 35 Node 0 Core 88-95
Rank 36 Node 0 Core 96-103
Rank 37 Node 0 Core 104-111
Rank 38 Node 0 Core 112-119
Rank 39 Node 0 Core 120-127
Rank 40 Node 0 Core 128-135
Rank 41 Node 0 Core 136-143
Rank 42 Node 0 Core 144-151
Rank 43 Node 0 Core 152-159
Rank 44 Node 0 Core 160-167
Rank 45 Node 0 Core 168-175
Rank 46 Node 0 Core 176-183
Rank 47 Node 0 Core 184-191
$
```


[No.16]

```sh
$ srun -p e5 -n 96 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do for j in \`seq $i 4 $((i+8))\`; do for k in \`seq 0 3\`; do echo -n $j","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
$
```

[No.17]

```sh
$ srun -p e5 -n 96 --cpu-bind=map_ldom:`for i in \`seq 0 3\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
Rank 24 Node 0 Core 0-7
Rank 25 Node 0 Core 8-15
Rank 26 Node 0 Core 16-23
Rank 27 Node 0 Core 24-31
Rank 28 Node 0 Core 32-39
Rank 29 Node 0 Core 40-47
Rank 30 Node 0 Core 48-55
Rank 31 Node 0 Core 56-63
Rank 32 Node 0 Core 64-71
Rank 33 Node 0 Core 72-79
Rank 34 Node 0 Core 80-87
Rank 35 Node 0 Core 88-95
Rank 36 Node 0 Core 96-103
Rank 37 Node 0 Core 104-111
Rank 38 Node 0 Core 112-119
Rank 39 Node 0 Core 120-127
Rank 40 Node 0 Core 128-135
Rank 41 Node 0 Core 136-143
Rank 42 Node 0 Core 144-151
Rank 43 Node 0 Core 152-159
Rank 44 Node 0 Core 160-167
Rank 45 Node 0 Core 168-175
Rank 46 Node 0 Core 176-183
Rank 47 Node 0 Core 184-191
Rank 48 Node 0 Core 0-7
Rank 49 Node 0 Core 8-15
Rank 50 Node 0 Core 16-23
Rank 51 Node 0 Core 24-31
Rank 52 Node 0 Core 32-39
Rank 53 Node 0 Core 40-47
Rank 54 Node 0 Core 48-55
Rank 55 Node 0 Core 56-63
Rank 56 Node 0 Core 64-71
Rank 57 Node 0 Core 72-79
Rank 58 Node 0 Core 80-87
Rank 59 Node 0 Core 88-95
Rank 60 Node 0 Core 96-103
Rank 61 Node 0 Core 104-111
Rank 62 Node 0 Core 112-119
Rank 63 Node 0 Core 120-127
Rank 64 Node 0 Core 128-135
Rank 65 Node 0 Core 136-143
Rank 66 Node 0 Core 144-151
Rank 67 Node 0 Core 152-159
Rank 68 Node 0 Core 160-167
Rank 69 Node 0 Core 168-175
Rank 70 Node 0 Core 176-183
Rank 71 Node 0 Core 184-191
Rank 72 Node 0 Core 0-7
Rank 73 Node 0 Core 8-15
Rank 74 Node 0 Core 16-23
Rank 75 Node 0 Core 24-31
Rank 76 Node 0 Core 32-39
Rank 77 Node 0 Core 40-47
Rank 78 Node 0 Core 48-55
Rank 79 Node 0 Core 56-63
Rank 80 Node 0 Core 64-71
Rank 81 Node 0 Core 72-79
Rank 82 Node 0 Core 80-87
Rank 83 Node 0 Core 88-95
Rank 84 Node 0 Core 96-103
Rank 85 Node 0 Core 104-111
Rank 86 Node 0 Core 112-119
Rank 87 Node 0 Core 120-127
Rank 88 Node 0 Core 128-135
Rank 89 Node 0 Core 136-143
Rank 90 Node 0 Core 144-151
Rank 91 Node 0 Core 152-159
Rank 92 Node 0 Core 160-167
Rank 93 Node 0 Core 168-175
Rank 94 Node 0 Core 176-183
Rank 95 Node 0 Core 184-191
$
```

[No.18]

```sh
$ srun -p e5 -n 192 --cpu-bind=map_cpu:`seq -s, 0 191 | tr -d '\n'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
$
```


[No.19]

```sh
$ srun -p e5 -n 192 --cpu-bind=map_ldom:`for i in \`seq 0 7\`; do for j in \`echo 0 2 3 1 12 14 15 13\`; do for k in \`seq $j 4 $((j+8))\`; do echo -n $k","; done; done; done | sed 's/,$//g'` bash -c 'echo -n "Rank $SLURM_PROCID Node $SLURM_NODEID Core "; taskset -cp $$ | cut -d" " -f6' | sort -k 2n,2
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
Rank 24 Node 0 Core 0-7
Rank 25 Node 0 Core 8-15
Rank 26 Node 0 Core 16-23
Rank 27 Node 0 Core 24-31
Rank 28 Node 0 Core 32-39
Rank 29 Node 0 Core 40-47
Rank 30 Node 0 Core 48-55
Rank 31 Node 0 Core 56-63
Rank 32 Node 0 Core 64-71
Rank 33 Node 0 Core 72-79
Rank 34 Node 0 Core 80-87
Rank 35 Node 0 Core 88-95
Rank 36 Node 0 Core 96-103
Rank 37 Node 0 Core 104-111
Rank 38 Node 0 Core 112-119
Rank 39 Node 0 Core 120-127
Rank 40 Node 0 Core 128-135
Rank 41 Node 0 Core 136-143
Rank 42 Node 0 Core 144-151
Rank 43 Node 0 Core 152-159
Rank 44 Node 0 Core 160-167
Rank 45 Node 0 Core 168-175
Rank 46 Node 0 Core 176-183
Rank 47 Node 0 Core 184-191
Rank 48 Node 0 Core 0-7
Rank 49 Node 0 Core 8-15
Rank 50 Node 0 Core 16-23
Rank 51 Node 0 Core 24-31
Rank 52 Node 0 Core 32-39
Rank 53 Node 0 Core 40-47
Rank 54 Node 0 Core 48-55
Rank 55 Node 0 Core 56-63
Rank 56 Node 0 Core 64-71
Rank 57 Node 0 Core 72-79
Rank 58 Node 0 Core 80-87
Rank 59 Node 0 Core 88-95
Rank 60 Node 0 Core 96-103
Rank 61 Node 0 Core 104-111
Rank 62 Node 0 Core 112-119
Rank 63 Node 0 Core 120-127
Rank 64 Node 0 Core 128-135
Rank 65 Node 0 Core 136-143
Rank 66 Node 0 Core 144-151
Rank 67 Node 0 Core 152-159
Rank 68 Node 0 Core 160-167
Rank 69 Node 0 Core 168-175
Rank 70 Node 0 Core 176-183
Rank 71 Node 0 Core 184-191
Rank 72 Node 0 Core 0-7
Rank 73 Node 0 Core 8-15
Rank 74 Node 0 Core 16-23
Rank 75 Node 0 Core 24-31
Rank 76 Node 0 Core 32-39
Rank 77 Node 0 Core 40-47
Rank 78 Node 0 Core 48-55
Rank 79 Node 0 Core 56-63
Rank 80 Node 0 Core 64-71
Rank 81 Node 0 Core 72-79
Rank 82 Node 0 Core 80-87
Rank 83 Node 0 Core 88-95
Rank 84 Node 0 Core 96-103
Rank 85 Node 0 Core 104-111
Rank 86 Node 0 Core 112-119
Rank 87 Node 0 Core 120-127
Rank 88 Node 0 Core 128-135
Rank 89 Node 0 Core 136-143
Rank 90 Node 0 Core 144-151
Rank 91 Node 0 Core 152-159
Rank 92 Node 0 Core 160-167
Rank 93 Node 0 Core 168-175
Rank 94 Node 0 Core 176-183
Rank 95 Node 0 Core 184-191
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
Rank 120 Node 0 Core 0-7
Rank 121 Node 0 Core 8-15
Rank 122 Node 0 Core 16-23
Rank 123 Node 0 Core 24-31
Rank 124 Node 0 Core 32-39
Rank 125 Node 0 Core 40-47
Rank 126 Node 0 Core 48-55
Rank 127 Node 0 Core 56-63
Rank 128 Node 0 Core 64-71
Rank 129 Node 0 Core 72-79
Rank 130 Node 0 Core 80-87
Rank 131 Node 0 Core 88-95
Rank 132 Node 0 Core 96-103
Rank 133 Node 0 Core 104-111
Rank 134 Node 0 Core 112-119
Rank 135 Node 0 Core 120-127
Rank 136 Node 0 Core 128-135
Rank 137 Node 0 Core 136-143
Rank 138 Node 0 Core 144-151
Rank 139 Node 0 Core 152-159
Rank 140 Node 0 Core 160-167
Rank 141 Node 0 Core 168-175
Rank 142 Node 0 Core 176-183
Rank 143 Node 0 Core 184-191
Rank 144 Node 0 Core 0-7
Rank 145 Node 0 Core 8-15
Rank 146 Node 0 Core 16-23
Rank 147 Node 0 Core 24-31
Rank 148 Node 0 Core 32-39
Rank 149 Node 0 Core 40-47
Rank 150 Node 0 Core 48-55
Rank 151 Node 0 Core 56-63
Rank 152 Node 0 Core 64-71
Rank 153 Node 0 Core 72-79
Rank 154 Node 0 Core 80-87
Rank 155 Node 0 Core 88-95
Rank 156 Node 0 Core 96-103
Rank 157 Node 0 Core 104-111
Rank 158 Node 0 Core 112-119
Rank 159 Node 0 Core 120-127
Rank 160 Node 0 Core 128-135
Rank 161 Node 0 Core 136-143
Rank 162 Node 0 Core 144-151
Rank 163 Node 0 Core 152-159
Rank 164 Node 0 Core 160-167
Rank 165 Node 0 Core 168-175
Rank 166 Node 0 Core 176-183
Rank 167 Node 0 Core 184-191
Rank 168 Node 0 Core 0-7
Rank 169 Node 0 Core 8-15
Rank 170 Node 0 Core 16-23
Rank 171 Node 0 Core 24-31
Rank 172 Node 0 Core 32-39
Rank 173 Node 0 Core 40-47
Rank 174 Node 0 Core 48-55
Rank 175 Node 0 Core 56-63
Rank 176 Node 0 Core 64-71
Rank 177 Node 0 Core 72-79
Rank 178 Node 0 Core 80-87
Rank 179 Node 0 Core 88-95
Rank 180 Node 0 Core 96-103
Rank 181 Node 0 Core 104-111
Rank 182 Node 0 Core 112-119
Rank 183 Node 0 Core 120-127
Rank 184 Node 0 Core 128-135
Rank 185 Node 0 Core 136-143
Rank 186 Node 0 Core 144-151
Rank 187 Node 0 Core 152-159
Rank 188 Node 0 Core 160-167
Rank 189 Node 0 Core 168-175
Rank 190 Node 0 Core 176-183
Rank 191 Node 0 Core 184-191
$
```

[No.21]

```sh
$ OMP_NUM_THREADS=8 OMP_PROC_BIND=TRUE srun -p e5 -n 24 -c 8 --cpu-bind=map_ldom:`for i in \`echo 0 2 3 1 12 14 15 13\`; do seq -s, $i 4 $((i+8)) | tr '\n' ','; done | sed 's/,$//g'` bash -c 'sleep $SLURM_PROCID; echo "Rank $SLURM_PROCID Node $SLURM_NODEID"; ./show_thread_bind | sort -k 2n,2'
Rank 0 Node 0
Thread  0 Core  0
Thread  1 Core  1
Thread  2 Core  2
Thread  3 Core  3
Thread  4 Core  4
Thread  5 Core  5
Thread  6 Core  6
Thread  7 Core  7
Rank 1 Node 0
Thread  0 Core  8
Thread  1 Core  9
Thread  2 Core 10
Thread  3 Core 11
Thread  4 Core 12
Thread  5 Core 13
Thread  6 Core 14
Thread  7 Core 15
Rank 2 Node 0
Thread  0 Core 16
Thread  1 Core 17
Thread  2 Core 18
Thread  3 Core 19
Thread  4 Core 20
Thread  5 Core 21
Thread  6 Core 22
Thread  7 Core 23
Rank 3 Node 0
Thread  0 Core 24
Thread  1 Core 25
Thread  2 Core 26
Thread  3 Core 27
Thread  4 Core 28
Thread  5 Core 29
Thread  6 Core 30
Thread  7 Core 31
Rank 4 Node 0
Thread  0 Core 32
Thread  1 Core 33
Thread  2 Core 34
Thread  3 Core 35
Thread  4 Core 36
Thread  5 Core 37
Thread  6 Core 38
Thread  7 Core 39
Rank 5 Node 0
Thread  0 Core 40
Thread  1 Core 41
Thread  2 Core 42
Thread  3 Core 43
Thread  4 Core 44
Thread  5 Core 45
Thread  6 Core 46
Thread  7 Core 47
Rank 6 Node 0
Thread  0 Core 48
Thread  1 Core 49
Thread  2 Core 50
Thread  3 Core 51
Thread  4 Core 52
Thread  5 Core 53
Thread  6 Core 54
Thread  7 Core 55
Rank 7 Node 0
Thread  0 Core 56
Thread  1 Core 57
Thread  2 Core 58
Thread  3 Core 59
Thread  4 Core 60
Thread  5 Core 61
Thread  6 Core 62
Thread  7 Core 63
Rank 8 Node 0
Thread  0 Core 64
Thread  1 Core 65
Thread  2 Core 66
Thread  3 Core 67
Thread  4 Core 68
Thread  5 Core 69
Thread  6 Core 70
Thread  7 Core 71
Rank 9 Node 0
Thread  0 Core 72
Thread  1 Core 73
Thread  2 Core 74
Thread  3 Core 75
Thread  4 Core 76
Thread  5 Core 77
Thread  6 Core 78
Thread  7 Core 79
Rank 10 Node 0
Thread  0 Core 80
Thread  1 Core 81
Thread  2 Core 82
Thread  3 Core 83
Thread  4 Core 84
Thread  5 Core 85
Thread  6 Core 86
Thread  7 Core 87
Rank 11 Node 0
Thread  0 Core 88
Thread  1 Core 89
Thread  2 Core 90
Thread  3 Core 91
Thread  4 Core 92
Thread  5 Core 93
Thread  6 Core 94
Thread  7 Core 95
Rank 12 Node 0
Thread  0 Core 96
Thread  1 Core 97
Thread  2 Core 98
Thread  3 Core 99
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
$
```
