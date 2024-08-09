---
title: "CFD解析フローのコストパフォーマンを向上させるOpenFOAM関連Tips"
excerpt: "OpenFOAMは、CAE分野で多くの利用実績を持つオープンソースのCFDアプリケーションで、計算時に多くのメモリ帯域を使用したり実行中に多くのデータをファイルシステムに書き出したりする特性があるため、これらを考慮した実行方法を採用することでその性能を大きく向上させることが可能です。本パフォーマンス関連Tipsは、HPCワークロードの実行に最適なベアメタルインスタンスBM.Optimized3.36をクラスタ・ネットワークでノード間接続するHPCクラスタでOpenFOAMを使用する際、CFD解析フローをコストパフォーマンス良く実行するという観点で有益なTipsを解説します。"
order: "224"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

本パフォーマンス関連Tipsは、 **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** でノード間接続するHPCクラスタで **[OpenFOAM](https://www.openfoam.com/)** を使用する際、特定のモデルを使用するCFD解析フローをコストパフォーマンス良く実行するという観点で、以下のTipsを解説します。

1. ノード内並列とマルチノード並列に於けるMPIプロセス配置を最適化する方法
2. NVMe SSDローカルディスクをストレージ領域に活用する方法

本パフォーマンス関連Tipsの性能計測は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[OpenFOAMインストール・利用方法](/ocitutorials/hpc/tech-knowhow/install-openfoam/)** に従って構築された **OpenFOAM** 実行環境を使用し、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurmによるリソース管理・ジョブ管理システム構築方法](/ocitutorials/hpc/tech-knowhow/setup-slurm-cluster/)** に従って構築された **Slurm** 環境でバッチジョブとして計測しています。

また、計算ノードに使用する **BM.Optimized3.36** は、 **OpenFOAM** がメモリ帯域幅依存でハイパースレッディングによる効果は期待できないため、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[パフォーマンスに関連するベアメタルインスタンスのBIOS設定方法](/ocitutorials/hpc/benchmark/bios-setting/)** の手順に従い **SMT** を無効化しています。

***
# 1. ノード内並列とマルチノード並列に於けるMPIプロセス配置を最適化する方法

## 1-0. 概要

本Tipsは、 **OpenFOAM** のの実行性能がメモリ帯域幅に大きく影響されることを念頭に、メモリ性能に影響する以下のパラメータを調整することでどのように性能が変化するか、また最も性能の良いパラメータは何かという観点で性能を計測します。

1. **NPS** （Numa node Per Socket）
2. NUMAノードを意識したノード内プロセス配置とノード当たりプロセス数

以降は、現在作成中です。

***
# 2. NVMe SSDローカルディスクをストレージ領域に活用する方法

## 2-0. 概要

本Tipsは、 **OpenFOAM** が実行中に計算結果をファイルシステムに書き出す際、 **BM.Optimized3.36** が搭載する高速なNVMe SSDローカルディスク上に作成したファイルシステムをその対象領域とすることで、CFD解析フロー全体の所要時間を短縮し解析コストを削減する方法を解説します。

**OpenFOAM** が実行中に作成するファイルは、総容量のみならず総ファイル数が多いため、NFSでサービスする共有ストレージに対して高いIOPS性能を持つNVMe SSDローカルディスクが有効で、特に高並列実行のケースや計算結果の出力頻度が高いケースでその効果を顕著に得ることが出来ます。

本Tipsで実行例として使用する解析モデルは、 **OpenFOAM** に同梱されるチュートリアルのオートバイ走行時乱流シミュレーションをベンチマーク用に大規模化した、 **[OpenFOAM HPC Benchmark Suite](https://develop.openfoam.com/committees/hpc)** に含まれる **HPC_Motorbike** です。

本TipsのNVMe SSDローカルディスクの使用方法は、 **OpenFOAM** のケースディレクトリがCFD解析フロー開始時点で通常共有ストレージに存在することを考慮し、共有ストレージ・NMVe SSDローカルディスク間でrsyncを使用してデータを同期しながら以下のステップで実行、 **OpenFOAM** がストレージ領域にアクセスする際、NMVe SSDローカルディスクを極力使用するよう配慮します。

1. ヘッドノードで "共有ストレージ -> NVMe SSDローカルディスク" 方向のケースディレクトリ内全ファイルの同期
2. ヘッドノードのNVMe SSDローカルディスク上で **decomposePar** を実行
3. "ヘッドノードのNVMe SSDローカルディスク -> その他ノードのNVMe SSDローカルディスク" 方向のケースディレクトリ内全ファイルの同期
4. 全ノードがNVMe SSDローカルディスクを使用して **potentialFoam** を並列実行
5. 全ノードがNVMe SSDローカルディスクを使用して **simpleFoam** を並列実行
6. "その他ノードのNVMe SSDローカルディスク -> ヘッドノードのNVMe SSDローカルディスク" 方向のケースディレクトリ内一部ファイルの同期
7. ヘッドノードで "NVMe SSDローカルディスク -> 共有ストレージ" 方向のケースディレクトリ内一部ファイルの同期

ここで **ステップ 3.** と **ステップ 6.** の同期は、その他ノードのノード数（並列計算に使用する総ノード数マイナス1）分だけ同時に実行することで、NVMe SSDローカルディスクの高いIOPS性能（ここでは特にヘッドノードのNVMe SSDローカルディスク）を有効に活用して所要時間の短縮を図ります。

また **ステップ 6.** の同期は、ファイルの同期を同時実行することによるヘッドノード上でのファイル競合を避けるため、各MPIプロセスが解析結果を格納する **processorxx** ディレクトリとその配下のファイルは、当該ノードに割り当てられたプロセスディレクトリのみを対象とします。

また **ステップ 7.** の同期は、各MPIプロセスが解析結果を格納する **processorxx** ディレクトリとその配下のファイルを除外し、ポスト処理に必要なファイルだけを同期することで、所要時間の短縮を図ります。

共有ストレージを使用する実行方法は、 **ステップ 1.** ・ **ステップ 3.** ・ **ステップ 6.** ・ **ステップ 7.** に時間を消費しませんが、NVMe SSDローカルディスクを使用する実行方法が共有ストレージを使用する実行方法に対して **ステップ 2.** ・ **ステップ 4.** ・ **ステップ 5.** で所要時間を短縮することが出来るため、トータルの実行時間はNVMe SSDローカルディスクを使用する実行方法が短くなります。

本Tipsは、以下の環境・条件で **OpenFOAM** を実行し、CFD解析フローの所要時間（所要コスト）を  **26.2 %** 短縮しています。

- シェイプ ： **BM.Optimized3.36**
- BIOS設定 ：SMT無効・NPS2
- OS ： **Oracle Linux** 8.9ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※1）
- ノード数 ： 8
- ノード間接続 ：  **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 
- 比較対象の共有ストレージ ： **ファイル・ストレージ** （NFS）
- **OpenFOAM** ： v2312
- MPI ： **[OpenMPI](https://www.open-mpi.org/)** 5.0.3
- MPIプロセス数 ： 288（36プロセス / ノード）
- 解析対象モデル ： **OpenFOAM HPC Benchmark Suite** の **HPC_Motorbike** の **Small** モデル  
（ **hpc/incompressible/simpleFoam/HPC_motorbike/Small/v1912/HPC_motorbike/Small/v1912** ）
- 計算結果の出力頻度（ **writeInterval** ） ： 10タイムステップ（デフォルト値：1,000タイムステップ）

※1） **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.1** です。  

## 2-1. 実行方法

本章は、NVMe SSDローカルディスクをストレージ領域に活用して **OpenFOAM HPC Benchmark Suite** の **HPC_Motorbike** の **Small** モデルを実行する方法を解説します。

この方法は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[OpenFOAMインストール・利用方法](/ocitutorials/hpc/tech-knowhow/install-openfoam/)** の **[4. CFD解析フロー実行](/ocitutorials/hpc/tech-knowhow/install-openfoam//#4-cfd解析フロー実行)** を参照し、ここで解説しているチュートリアル付属のオートバイ走行時乱流シミュレーションモデルのバッチ実行の方法を参考に、 **OpenFOAM HPC Benchmark Suite** の **HPC_Motorbike** の **Small** モデルにこれを適用します。

この際、 **system/controlDict** の **writeInterval** を **10** に変更します。  
この値がデフォルト値 **1,000** のままの場合、計算結果を出力しないため、NVMe SSDローカルディスクの効果を得ることが出来ません。

## 2-2. 実行結果とその考察

本章は、解析対象モデルを共有ストレージを使用した場合とNVMe SSDローカルディスクを使用した場合で実行し、その結果を比較・検証します。

本Tipsは、 **[1.0. 概要](#1-0-概要)** に記載の7ステップにかかる時間を個別に取得出来るようにした上で、共有ストレージを使用した場合とNVMe SSDローカルディスクを使用した場合でそれぞれ5回計測してその平均値を求めました。

この結果をグラフ化したものを以下に示します。

![実行結果](graph_01.png)

このグラフから、NVMe SSDローカルディスクを使用する実行方法は、共有ストレージを使用する実行方法に対して、

- **simpleFoam** の実行時間が **40.4 %** 短い
- **decomposePar** の実行時間が **34.2 %** 短い
- rsyncのデータ転送に **46 秒** 必要
- 以上増減の結果総実行時間が **26.2 %** 短い（計算ノードの所要コストが **26.2 %** 安価）

という事がわかります。

以上より、共有ストレージを使用する実行方法と比較して、NVMe SSDローカルディスクを使用する実行方法は、実行方法にひと手間掛けることで、CFD解析フローのコストを大幅に低減可能であることがわかります。  
またこのコストダウンは、高並列実行のケースや計算結果の出力頻度が高いケースでより大きな効果を得ることが出来ます。