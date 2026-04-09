---
title: "プロファイリング情報に基づくOpenFOAMチューニング方法"
description: "CAE分野で多くの利用実績を持つオープンソースのCFDソフトウェアであるOpenFOAMは、ソルバーがMPIで並列化されており1万コアを超える並列実行の実績も報告されていますが、MPI向けの実行時パラメータを適切に設定してMPI通信時間を削減することで、その性能を改善できる場合があります。このチューニングプロセスに於いては、実行時にどのようなMPI通信関数をどのような条件で使用しているかを調査するプロファイリングにより、解析対象のソルバーやモデルの特性に合わせた最適なMPI向けの実行時パラメータの選定が容易になります。本パフォーマンス・プロファイリング関連Tipsは、オープンソースのプロファイリングツールであるScore-P、Scalasca、及びCubeGUIを駆使してOpenFOAM実行時のMPI通信特性をプロファイリングし、収集した情報からMPI通信特性に応じたチューニングを適用、その性能を改善する方法を解説します。"
weight: "2213"
tags:
- hpc
params:
  author: Tsutomu Miyashita
---

# 0. 概要

**[OpenFOAM](https://www.openfoam.com/)** は、そのソースコード体系が大規模・複雑なため、 **OpenFOAM** 自身をソースコードレベルでプロファイリング・チューニングすることは容易ではありませんが、並列計算時に使用するMPI通信にフォーカスすることで、 **OpenFOAM** そのものには手を付けずに性能向上を検討することが可能です。

ここでMPI通信の性能向上に寄与する実行時パラメータは、MPI通信特性に合わせて選定する必要があるため、MPI通信にフォーカスしたプロファイリング・チューニングを実施するためには、 **OpenFOAM** 実行時に以下の情報を取得する必要があります。

- 総所要時間に占める割合の大きなMPI通信関数
- 上記MPI通信関数呼び出し時のメッセージサイズ

以上の情報が入手できれば、以下のステップに従いMPI通信にフォーカスした **OpenFOAM** のプロファイリング・チューニングが可能になります。

- プロファイリング
    - **asis** （※1）の所要時間計測
    - **asis** のプロファイリング取得時の所要時間計測
    - 両者に差が無く精度の良いプロファイリング情報を取得出来ていることを確認
    - プロファイリング情報から **ホットスポット** （※2）のMPI通信関数を特定
- チューニング
    - **ホットスポット** のMPI通信関数に対する最適な実行時パラメータ検討
    - チューニング適用時のプロファイリング取得
    - プロファイリング情報から **ホットスポット** のMPI通信関数に対するチューニングの効果を確認
    - チューニング適用時の所要時間計測
    - **asis** とチューニング適用時の所要時間比較・チューニング効果確認

※1）本パフォーマンス・プロファイリング関連Tipsでは、チューニング適用前のアプリケーションの状態を **asis** と呼称します。  
※2）本パフォーマンス・プロファイリング関連Tipsでは、所要時間のうち上位を占めるプログラム単位（サブルーチン・関数、MPI通信関数、IO等）を **ホットスポット** と呼称します。

ここでMPI通信にフォーカスしたプロファイリングは、 **OpenFOAM** のソースコードが入手可能であることを利用し、以下のオープンソースのプロファイリングツール群を活用することが可能です。

- **[Score-P](https://www.vi-hps.org/projects/score-p/)**
- **[Scalasca](https://www.scalasca.org/)**
- **[CubeGUI](https://www.scalasca.org/scalasca/software/cube-4.x/download.html)**

以上を踏まえて本パフォーマンス・プロファイリング関連Tipsは、プロファイリングツールに **Score-P** 、 **Scalasca** 、及び **CubeGUI** を使用し、 **OpenFOAM** のプロファイリング情報をMPI通信にフォーカスして取得し得られた **ホットスポット** のMPI通信関数にフォーカスしてチューニングを適用、その性能を向上させる手順を解説します。  

本手順は、 **[クラスタ・ネットワーク](../../#5-1-クラスタネットワーク)** で相互接続する **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** を計算ノードとするHPCクラスタ環境で実行することを前提とし、 **OpenFOAM** のチュートリアルに含まれるオートバイ走行時乱流シミュレーションのソルバー（ **simpleFoam** ）実行部分をプロファイリング・チューニング対象に使用します。

またMPI通信関数のチューニング手法は、 **[OCI HPCパフォーマンス関連情報](../../#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI集合通信チューニング方法（BM.Optimized3.36編）](../../benchmark/openmpi-perftune/)** で得られた結果を元に検討します。

以降では、以下の順に解説します。

1. **[プロファイリング・チューニング環境構築](#1-プロファイリングチューニング環境構築)**
2. **[プロファイリング](#2-プロファイリング)**
3. **[チューニング](#3-チューニング)**

# 1. プロファイリング・チューニング環境構築

本章は、本プロファイリング・チューニング関連Tipsで使用するプロファイリング対応の **OpenFOAM** 環境を構築します。

この構築は、 **[OCI HPCプロファイリング関連Tips集](../../#2-3-プロファイリング関連tips集)** の **[Score-P・Scalasca・CubeGUIでOpenFOAMをプロファイリング](../../benchmark/openfoam-profiling/)** の手順に従い実施します。

# 2. プロファイリング

## 2-0. 概要

本章は、 **OpenFOAM** に同梱されるチュートリアルのオートバイ走行時乱流シミュレーション（**incompressible/simpleFoam/motorBike**）のソルバー（ **simpleFoam** ）実行部分をプロファイリング対象とし、ノードあたり36コアを搭載する **BM.Optimized3.36** を2ノード使用する72 MPIプロセス実行時のプロファイリング手法によるデータをMPI通信にフォーカスして計算ノードで取得し、これをBastionノードの **CubeGUI** で確認します。

## 2-1. プロファイリング手法データの取得

この取得は、 **[OCI HPCプロファイリング関連Tips集](../../#2-3-プロファイリング関連tips集)** の **[Score-P・Scalasca・CubeGUIでOpenFOAMをプロファイリング](../../benchmark/openfoam-profiling/)** の **[4. プロファイリング手法データの取得](../../benchmark/openfoam-profiling/#4-プロファイリング手法データの取得)** の手順のうち、 **[4-3. 浮動小数点演算数を含むプロファイリング手法データの取得](../../benchmark/openfoam-profiling/#4-3-浮動小数点演算数を含むプロファイリング手法データの取得)** を除く手順に従い実施します。

## 2-2. プロファイリング手法データの確認

以下コマンドをプロファイリング利用ユーザで実行し、トータル時間を評価指標としたプロファイリング結果を表示します。

```sh
$ module load openmpi papi scorep scalasca cubegui
$ source /opt/OpenFOAM/OpenFOAM-v2512/etc/bashrc
$ run
$ scalasca -examine -s -x "-s totaltime" ./prof_wofp
/opt/scorep/bin/scorep-score  -s totaltime -r ./prof_wofp/profile.cubex > ./prof_wofp/scorep.score
INFO: Score report written to ./prof_wofp/scorep.score
$ head -n 35 ./prof_wofp/scorep.score

Estimated aggregate size of event trace:                   18GB
Estimated requirements for largest trace buffer (max_buf): 360MB
Estimated memory requirements (SCOREP_TOTAL_MEMORY):       370MB
(hint: When tracing set SCOREP_TOTAL_MEMORY=370MB to avoid intermediate flushes
 or reduce requirements using USR regions filters.)

flt     type  max_buf[B]      visits time[s] time[%] time/visit[us]  region
         ALL 376,634,203 282,682,028 1916.23   100.0           6.78  ALL
         MPI 373,398,205 276,097,498 1003.25    52.4           3.63  MPI
      SCOREP          46          72  907.56    47.4    12605046.59  SCOREP
     PTHREAD   3,519,074   6,584,458    5.43     0.3           0.82  PTHREAD

      SCOREP          46          72  907.56    47.4    12605046.59  simpleFoam
         MPI  11,272,292  11,935,368  289.20    15.1          24.23  MPI_Allreduce
         MPI   4,156,230  11,495,788  270.64    14.1          23.54  MPI_Waitall
         MPI          84          72  164.58     8.6     2285835.79  MPI_Init_thread
         MPI 156,089,268  84,176,201   94.01     4.9           1.12  MPI_Isend
         MPI      46,308      48,122   74.01     3.9        1537.95  MPI_Bcast
         MPI 156,087,933  84,176,201   53.52     2.8           0.64  MPI_Irecv
         MPI     125,355      68,389   22.17     1.2         324.21  MPI_Send
         MPI  45,324,994  83,676,912   11.11     0.6           0.13  MPI_Test
         MPI      15,028      15,912    9.31     0.5         585.24  MPI_Allgather
         MPI     525,174      22,158    6.43     0.3         290.29  MPI_Probe
         MPI       1,020       1,080    5.02     0.3        4644.08  MPI_Alltoall
     PTHREAD       5,226      12,888    4.46     0.2         346.02  int pthread_cond_wait( pthread_cond_t*, pthread_mutex_t* )
         MPI      67,834     132,277    1.82     0.1          13.75  MPI_Waitsome
         MPI     260,644     275,976    0.69     0.0           2.50  MPI_Gather
     PTHREAD   1,711,502   3,159,641    0.52     0.0           0.16  int pthread_mutex_lock( pthread_mutex_t* )
         MPI          84          72    0.43     0.0        5905.75  MPI_Finalize
     PTHREAD   1,711,502   3,159,641    0.35     0.0           0.11  int pthread_mutex_unlock( pthread_mutex_t* )
         MPI         168         144    0.10     0.0         699.08  MPI_Comm_create_group
         MPI   4,040,030      68,389    0.10     0.0           1.40  MPI_Recv
         MPI       6,214       2,705    0.09     0.0          32.80  MPI_Wait
     PTHREAD      77,376     192,266    0.06     0.0           0.30  int pthread_mutex_init( pthread_mutex_t*, const pthread_mutexattr_t* )
$
```

この出力から、MPI通信にフォーカスした場合のホットスポットは **MPI_Allreduce** と **MPI_Waitall** で、それぞれ総所要時間の **15.1%** と **14.1%** を占めていることがわかります。

そこで、MPI通信の性能向上に寄与する実行時パラメータが判明している **MPI_Allreduce** をチューニング対象とし、続いてその呼び出し時メッセージサイズを調査します。

以下コマンドをParaView/CubeGUI操作端末に表示されているBastionノードのプロファイリング利用ユーザのGNOMEデスクトップ上のターミナルで実行し、プロファイリング手法データを読み込んで **CubeGUI** を起動します。

```sh
$ module load openmpi cubegui
$ source /opt/OpenFOAM/OpenFOAM-v2512/etc/bashrc
$ run
$ cube ./prof_wofp/profile.cubex
```

![画面ショット](cubegui_page01.png)

次に、コールツリー軸領域の任意の箇所をクリックしたのちに **Ctrl-F** キーを入力し、表示される検索フィールドに **MPI_Allreduce** と入力し、表示される **MPI_Allreduce** プルダウンメニューを選択すると、

![画面ショット](cubegui_page02.png)

コールツリー軸に **simpleFoam** から呼ばれた **MPI_Allreduce** が表示されます。

![画面ショット](cubegui_page03.png)


次に、コールツリー軸に表示された **MPI_Allreduce** をクリックして1階層下がりシステム位置軸を2階層下ると、各MPIプロセスが **MPI_Allreduce** を均等に **166,000回** 呼び出していることがわかります。

![画面ショット](cubegui_page04.png)

次に、評価指標軸の **bytes_sent** をクリックすると、各MPIプロセスが **MPI_Allreduce** で均等に **108 MB** 送信していることがわかります。

![画面ショット](cubegui_page05.png)

# 3. チューニング

## 3-0. 概要

本章は、先に取得したプロファイリング情報を元に、以下の手順でチューニングを実施します。

- **ホットスポット** に対するチューニング手法検討
- チューニング適用時のプロファイリング取得
- プロファイリング情報から **ホットスポット** に対するチューニングの効果を確認
- チューニング適用時の所要時間計測
- **asis** とチューニング適用時の所要時間比較・チューニング効果確認

## 3-1. チューニング手順

先の **[2. プロファイリング](#2-プロファイリング)** の結果から、以下のことが判明しました。

- 所要時間上位のMPI関数は **MPI_Waitall** と **MPI_Allreduce** でこれを **ホットスポット** と特定
- **ホットスポット** の **MPI_Allreduce** は以下の特性を有する
    - 72個のMPIプロセスが均等に **108 MB** のデータを送信している
    - 72個のMPIプロセスが均等に **166,000回** 呼び出している

ここで、 **ホットスポット** の **MPI_Allreduce** が各回とも同一メッセージサイズであると仮定し、このメッセージサイズを以下の計算式から求めます。

108 (MB) / 166,000 (回) / 72 (MPIプロセス) = **9.0 B**

以上の情報から、 **OpenMPI** の以下MPI通信をターゲットにチューニング手法を検討します。

- MPI関数： **MPI_Allreduce**
- ノード数： 2ノード
- ノード当たりプロセス数： 36
- メッセージサイズ： 9.0 B

ここで、 **[OpenMPIのMPI集合通信チューニング方法（BM.Optimized3.36編）](../../benchmark/openmpi-perftune/)** の当該箇所である **[2-4-3. Allreduce](../../benchmark/openmpi-perftune/#2-4-3-allreduce)** の最後に記載されている以下グラフに於いて、実際のメッセージサイズである **9.0 B** に最も近いの **8 B** メッセージサイズ部分を確認し、

![Alltoall 8 node 32 ppn](are_02_36_step3.png)

最も所要時間の短い紫色のグラフである以下のパラメータ設定が適していると判断、これをチューニング手法として採用します。

- **UCX_TLS**： **self,sm,rc**
- **UCX_RNDV_THRESH**： **intra:128kb,inter:128kb**
- **UCX_ZCOPY_THRESH**： **128kb**
- **NPS**： 1（ **asis** にも適用されています。）
- プロセス配置： ブロック分割（デフォルトのため **asis** にも適用されています。）
- **coll_hcoll_enable**： 1（デフォルトのため **asis** にも適用されています。）

次に、以下コマンドを1番目の計算ノードのプロファイリング利用ユーザで実行し、チューニング手法適用時のプロファイリングを取得します。  
この実行により、カレントディレクトリにディレクトリ **scorep_simpleFoam_36p72xP_sum** が作成され、ここに取得したプロファイリングデータが格納されます。

```sh
$ cd /mnt/localdisk/usera/motorBike
$ module load openmpi papi scorep scalasca
$ source /opt/OpenFOAM-prof/OpenFOAM-v2512/etc/bashrc
$ scalasca -analyze -f ./scorep.filt mpirun -n 72 -N 36 -machinefile ~/hostlist.txt "-x UCX_NET_DEVICES=mlx5_2:1" "-x UCX_TLS=self,sm,rc" "-x UCX_RNDV_THRESH=intra:128kb,inter:128kb" "-x UCX_ZCOPY_THRESH=128kb" "-x LD_LIBRARY_PATH" "-x WM_PROJECT_DIR" `which simpleFoam` -parallel > ./log.simpleFoam_wisc_witn
```

次に、以下コマンドを1番目の計算ノードのプロファイリング利用ユーザで実行し、プロファイリングデータ格納ディレクトリをNVMe SSDローカルディスクからファイル共有ストレージに移動します。

```sh
$ mv scorep_simpleFoam_36p72xP_sum ${FOAM_RUN}/prof_wofp_witn
```

次に、以下コマンドをBastionノードのプロファイリング利用ユーザで実行し、トータル時間を評価指標としたプロファイリング結果を表示します。

```sh
$ module load openmpi papi scorep scalasca
$ source /opt/OpenFOAM/OpenFOAM-v2512/etc/bashrc
$ run
$ scalasca -examine -s -x "-s totaltime" ./prof_wofp_witn
INFO: Post-processing runtime summarization report (profile.cubex)...
/opt/scorep/bin/scorep-score  -s totaltime -r ./prof_wofp_witn/profile.cubex > ./prof_wofp_witn/scorep.score
INFO: Score report written to ./prof_wofp_witn/scorep.score
$ head -n 35 ./prof_wofp_witn/scorep.score

Estimated aggregate size of event trace:                   18GB
Estimated requirements for largest trace buffer (max_buf): 360MB
Estimated memory requirements (SCOREP_TOTAL_MEMORY):       370MB
(hint: When tracing set SCOREP_TOTAL_MEMORY=370MB to avoid intermediate flushes
 or reduce requirements using USR regions filters.)

flt     type  max_buf[B]      visits time[s] time[%] time/visit[us]  region
         ALL 377,075,171 286,005,780 1633.49   100.0           5.71  ALL
         MPI 373,396,411 276,094,596  821.46    50.3           2.98  MPI
      SCOREP          46          72  806.55    49.4    11202145.32  SCOREP
     PTHREAD   4,697,420   9,911,112    5.47     0.3           0.55  PTHREAD

      SCOREP          46          72  806.55    49.4    11202145.32  simpleFoam
         MPI  11,272,292  11,935,368  219.19    13.4          18.36  MPI_Allreduce
         MPI   4,156,230  11,495,788  200.58    12.3          17.45  MPI_Waitall
         MPI 156,089,268  84,176,201  118.66     7.3           1.41  MPI_Isend
         MPI          84          72  100.25     6.1     1392375.69  MPI_Init_thread
         MPI      46,308      48,122   75.07     4.6        1559.99  MPI_Bcast
         MPI 156,087,933  84,176,201   52.79     3.2           0.63  MPI_Irecv
         MPI     125,355      68,389   24.13     1.5         352.83  MPI_Send
         MPI  45,324,994  83,676,912   11.11     0.7           0.13  MPI_Test
         MPI      15,028      15,912    7.98     0.5         501.79  MPI_Allgather
         MPI     260,644     275,976    4.44     0.3          16.10  MPI_Gather
     PTHREAD       5,018      12,585    4.35     0.3         345.41  int pthread_cond_wait( pthread_cond_t*, pthread_mutex_t* )
         MPI     525,174      22,158    3.82     0.2         172.30  MPI_Probe
         MPI      66,352     129,375    1.55     0.1          12.00  MPI_Waitsome
         MPI       1,020       1,080    1.22     0.1        1133.97  MPI_Alltoall
     PTHREAD   2,298,452   4,819,780    0.59     0.0           0.12  int pthread_mutex_lock( pthread_mutex_t* )
     PTHREAD   2,298,452   4,819,780    0.44     0.0           0.09  int pthread_mutex_unlock( pthread_mutex_t* )
         MPI          84          72    0.41     0.0        5743.86  MPI_Finalize
         MPI         168         144    0.09     0.0         658.89  MPI_Comm_create_group
         MPI   4,040,030      68,389    0.08     0.0           1.22  MPI_Recv
     PTHREAD      77,324     192,122    0.05     0.0           0.27  int pthread_mutex_init( pthread_mutex_t*, const pthread_mutexattr_t* )
         MPI       6,214       2,705    0.05     0.0          17.79  MPI_Wait
$
```

この出力から、 **MPI_Allreduce** の 所要時間が289秒から219秒に減少しており、チューニングの効果が確認できます。

次に、以下コマンドを計算ノードのプロファイリング利用ユーザで実行し、チューニング適用時の所要時間を計測します。

```sh
$ source /opt/OpenFOAM/OpenFOAM-v2512/etc/bashrc
$ mpirun -n 72 -N 36 -hostfile ~/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 -x UCX_TLS=self,sm,rc -x UCX_RNDV_THRESH=intra:128kb,inter:128kb -x UCX_ZCOPY_THRESH=128kb -x PATH -x LD_LIBRARY_PATH -x WM_PROJECT_DIR simpleFoam -parallel  > ./log.simpleFoam_wosc_witn
[inst-pu5fo-x9-ol905-n1:13653] SET UCX_NET_DEVICES=mlx5_2:1
[inst-pu5fo-x9-ol905-n1:13653] SET UCX_TLS=self,sm,rc
[inst-pu5fo-x9-ol905-n1:13653] SET UCX_RNDV_THRESH=intra:128kb,inter:128kb
[inst-pu5fo-x9-ol905-n1:13653] SET UCX_ZCOPY_THRESH=128kb
$ grep ^ExecutionTime ./log.simpleFoam_wosc_witn | tail -1
ExecutionTime = 16.08 s  ClockTime = 17 s
$
```

この結果から、 **asis** とチューニング適用時の所要時間を比較し、チューニングの効果を確認します。

以下は、本プロファイリング・チューニング関連Tips環境で所要時間を計測した結果です。  
この計測結果は、 **asis** とチューニング適用時をそれぞれ5回計測した最大値と最小値を除く3回の算術平均です。

|asis|チューニング適用時|性能向上比|
|:-:|:-:|:-:|
|18.08秒|16.22秒|**11.5％**|