---
title: "Intel MPI Benchmark実行方法"
excerpt: "本ドキュメントは、HPCワークロードの実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用のクラスタ・ネットワークでHPCワークロード向けベアメタルインスタンスをノード間接続するHPCクラスタで、標準ベンチマークのIntel MPI Benchmarkを実行する方法を解説します。"
order: "213"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

本ドキュメントは、HPCワークロードの実行に最適な、高帯域・低遅延RDMA対応RoCEv2採用の **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** でHPCワークロード向けベアメタルインスタンスをノード間接続するHPCクラスタで、標準ベンチマークの **[Intel MPI Benchmark](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-mpi-benchmarks.html)** を実行する方法を解説します。

***
# 0. 概要

本ドキュメントで解説する **Intel MPI Benchmark** の実行は、 **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** に含まれる **OpenMPI** （本ドキュメントで使用するバージョンは4.1.2a1）と **Intel MPI Benchmark** を使用する方法と、 **[Intel oneAPI HPC Toolkit](https://www.xlsoft.com/jp/products/intel/oneapi/hpc/index.html)** （本ドキュメントで使用するバージョンは2023.2）をインストールしてこれに含まれる **[Intel MPI Library](https://www.xlsoft.com/jp/products/intel/cluster/mpi/index.html)** （本ドキュメントで使用するバージョンは2021.10）と **Intel MPI Benchmark** を使用する方法を、それぞれ解説します。  
また **Intel MPI Benchmark** は、2ノード間の **Ping-Pong** と4ノード間の **All-Reduce** の計測方法をそれぞれ解説します。

本ドキュメントで **Intel MPI Benchmark** を実行するHPCクラスタは、HPCワークロード向けベアメタルシェイプ **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** 4インスタンスを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** で接続した構成とし、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** のカテゴリ **[HPCクラスタ](/ocitutorials/hpc/#1-1-hpcクラスタ)** のチュートリアルの手順に従う等により、計算ノード間でMPIが実行できるよう予め構築しておきます。  
計算ノードのOSは、 **HPC[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （本ドキュメントで使用するバージョンは **Oracle Linux** 8.7ベース）を使用します。

本ドキュメントは、以下の環境で **Intel MPI Benchmark** を実行しており、2ノード間の **Ping-Pong** で以下の性能が出ています。

[実行環境]
- シェイプ: **BM.Optimized3.36**
- OS: **Oracle Linux** 8.7 (HPC **クラスタネットワーキングイメージ** )
- MPI: **OpenMPI** （バージョン4.1.2a1）
- ノード数: 2
- ノード間接続: **クラスタ・ネットワーク**

[実行結果]
- レイテンシ: 1.67 usec
- 帯域幅（256 MiBメッセージサイズ）: 12,234 MB/s

***
# 1. OpenMPIでIntel MPI Benchmarkを実行する場合

本章は、 **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** に含まれる **OpenMPI** と **Intel MPI Benchmark** を使用し、 **Intel MPI Benchmark** を実行する方法を解説します。  
具体的には、以下の作業を実施します。

- ホストリストファイル[^hostlist]作成・配布
- OS再起動
- **Intel MPI Benchmark** 実行

[^hostlist]: MPIを使用してIntel_MPI_Benchmarkを実行するため、この際に必要となる。

1. **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[計算ノードのホスト名リスト作成方法](/ocitutorials/hpc/tech-knowhow/compute-host-list/)** の手順を実施し、以下のように全ての計算ノードのホスト名を含むホストリストファイルを **hostlist.txt** として作成、これを全計算ノードにコピーします。

    ```sh
    inst-wyr6m-comp
    inst-9wead-comp
    inst-u6i7v-comp
    inst-sgf5u-comp
    ```

2. 以下コマンドを全計算ノードのopcユーザで実行し、OSを再起動します。

    ```sh
    $ sudo shutdown -r now
    ```

3. 以下コマンドを計算ノードのうちの1ノードでopcユーザで実行します。  
   なお、コマンド中の **path_to_hostlist** は、ホストリストファイルをコピーしたパスに置き換えます。  
   ここでは、2ノードを使用した **Ping-Pong** をメッセージサイズ0バイトから256 MiBまで計測し、レイテンシは0バイトメッセージの所要時間（ここでは1.67 usec）、帯域幅は256 MiBメッセージの帯域幅（12,234.28 MB/s）を以ってその結果とします。

    ```sh
    $ source /usr/mpi/gcc/openmpi-4.1.2a1/bin/mpivars.sh
    $ mpirun -n 2 -N 1 -hostfile /path_to_hostlist/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -msglog 3:28 PingPong
    #------------------------------------------------------------
    #    Intel (R) MPI Benchmarks 2018, MPI-1 part    
    #------------------------------------------------------------
    # Date                  : Tue Jul 18 20:53:47 2023
    # Machine               : x86_64
    # System                : Linux
    # Release               : 4.18.0-425.13.1.el8_7.x86_64
    # Version               : #1 SMP Tue Feb 21 15:09:05 PST 2023
    # MPI Version           : 3.1
    # MPI Thread Environment: 


    # Calling sequence was: 

    # /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -msglog 3:28 PingPong

    # Minimum message length in bytes:   0
    # Maximum message length in bytes:   268435456
    #
    # MPI_Datatype                   :   MPI_BYTE 
    # MPI_Datatype for reductions    :   MPI_FLOAT
    # MPI_Op                         :   MPI_SUM  
    #
    #

    # List of Benchmarks to run:

    # PingPong

    #---------------------------------------------------
    # Benchmarking PingPong 
    # #processes = 2 
    #---------------------------------------------------
       #bytes #repetitions      t[usec]   Mbytes/sec
            0         1000         1.67         0.00
            8         1000         1.67         4.80
           16         1000         1.67         9.56
           32         1000         1.71        18.76
           64         1000         1.83        34.92
          128         1000         1.88        67.99
          256         1000         2.14       119.36
          512         1000         2.22       230.59
         1024         1000         2.33       439.99
         2048         1000         3.06       669.66
         4096         1000         3.78      1083.18
         8192         1000         4.86      1684.54
        16384         1000         6.75      2428.97
        32768         1000         9.25      3543.37
        65536          640        10.72      6111.17
       131072          320        16.32      8029.48
       262144          160        28.80      9103.05
       524288           80        50.16     10453.17
      1048576           40        92.90     11286.93
      2097152           20       178.70     11735.89
      4194304           10       349.94     11985.73
      8388608            5       692.70     12109.99
     16777216            2      1377.91     12175.80
     33554432            1      2750.18     12200.83
     67108864            1      5490.79     12222.08
    134217728            1     10973.37     12231.22
    268435456            1     21941.25     12234.28


    # All processes entering MPI_Finalize
    ```

4. 以下コマンドを計算ノードのうちの1ノードでopcユーザで実行します。  
   なお、コマンド中の **path_to_hostlist** は、ホストリストファイルをコピーしたパスに置き換えます。  
   ここでは、4ノード144プロセス（ノードあたり36プロセス）を使用した **All-Reduce** の所要時間をメッセージサイズ0バイトから256 MiBまで計測しています。


    ```sh
    $ source /usr/mpi/gcc/openmpi-4.1.2a1/bin/mpivars.sh
    $ mpirun -n 144 -N 36 -hostfile /path_to_hostlist/hostlist.txt -x UCX_NET_DEVICES=mlx5_2:1 /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -msglog 3:28 -npmin 144 allreduce
    #------------------------------------------------------------
    #    Intel (R) MPI Benchmarks 2018, MPI-1 part    
    #------------------------------------------------------------
    # Date                  : Thu Jul 20 16:27:27 2023
    # Machine               : x86_64
    # System                : Linux
    # Release               : 4.18.0-425.13.1.el8_7.x86_64
    # Version               : #1 SMP Tue Feb 21 15:09:05 PST 2023
    # MPI Version           : 3.1
    # MPI Thread Environment: 
    
    
    # Calling sequence was: 
    
    # /usr/mpi/gcc/openmpi-4.1.2a1/tests/imb/IMB-MPI1 -msglog 3:28 -npmin 144 allreduce
    
    # Minimum message length in bytes:   0
    # Maximum message length in bytes:   268435456
    #
    # MPI_Datatype                   :   MPI_BYTE 
    # MPI_Datatype for reductions    :   MPI_FLOAT
    # MPI_Op                         :   MPI_SUM  
    #
    #
    
    # List of Benchmarks to run:
    
    # Allreduce
    
    #----------------------------------------------------------------
    # Benchmarking Allreduce 
    # #processes = 144 
    #----------------------------------------------------------------
       #bytes #repetitions  t_min[usec]  t_max[usec]  t_avg[usec]
            0         1000         0.03         0.03         0.03
            8         1000         4.50        18.59        11.69
           16         1000         5.39        17.63        11.63
           32         1000        10.11        13.13        11.63
           64         1000         8.32        15.24        11.89
          128         1000         8.09        16.58        12.42
          256         1000         9.89        16.40        13.13
          512         1000         9.82        17.86        13.83
         1024         1000         8.73        20.20        14.63
         2048         1000         9.93        22.23        16.15
         4096         1000        12.02        27.01        19.67
         8192         1000        31.39        32.95        32.13
        16384         1000        35.31        37.19        36.22
        32768         1000        45.48        47.47        46.45
        65536          640        55.95        57.01        56.52
       131072          320        80.63        87.40        82.04
       262144          160       129.56       133.52       131.70
       524288           80       208.77       220.54       215.39
      1048576           40       432.20       461.07       447.59
      2097152           20      3352.04      3795.60      3591.64
      4194304           10      5326.33      5896.00      5630.47
      8388608            5     11920.32     13331.59     12864.12
     16777216            2     14467.98     15429.07     15048.12
     33554432            1     36607.12     40731.76     38998.56
     67108864            1     75721.76     84852.59     80901.12
    134217728            1    151129.15    159549.19    155682.92
    268435456            1    331046.67    353256.68    343593.42
    
    
    # All processes entering MPI_Finalize
    ```

***
# 2. Intel MPI LibraryでIntel MPI Benchmarkを実行する

本章は、 **Intel oneAPI HPC Toolkit** をインストールしてこれに含まれる **Intel MPI Library** と **Intel MPI Benchmark** を使用し、 **Intel MPI Benchmark** を実行する方法を解説します。  
具体的には、以下の作業を実施します。

- **Intel oneAPI HPC Toolkit** インストール
- ホストリストファイル[^hostlist]作成・配布
- OS再起動
- **Intel MPI Benchmark** 実行

1. 以下コマンドを全計算ノードのopcユーザで実行し、 **Intel oneAPI HPC Toolkit** をインストールします。

    ```sh
    $ sudo yum-config-manager --add-repo https://yum.repos.intel.com/oneapi
    $ sudo rpm --import https://yum.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
    $ sudo yum install -y intel-basekit
    $ sudo yum install -y intel-hpckit
    ```

2. **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[計算ノードのホスト名リスト作成方法](/ocitutorials/hpc/tech-knowhow/compute-host-list/)** の手順を実施し、以下のように全ての計算ノードのホスト名を含むホストリストファイルを **hostlist.txt** として作成、これを全計算ノードにコピーします。

    ```sh
    inst-wyr6m-comp
    inst-9wead-comp
    inst-u6i7v-comp
    inst-sgf5u-comp
    ```

3. 以下コマンドを全計算ノードのopcユーザで実行し、OSを再起動します。

    ```sh
    $ sudo shutdown -r now
    ```

4. 以下コマンドを計算ノードのうちの1ノードでopcユーザで実行します。  
   なお、コマンド中の **path_to_hostlist** は、ホストリストファイルをコピーしたパスに置き換えます。  
   ここでは、2ノードを使用した **Ping-Pong** をメッセージサイズ0バイトから256 MiBまで計測し、レイテンシは0バイトメッセージの所要時間（ここでは1.71 usec）、帯域幅は256 MiBメッセージの帯域幅（12,240.91 MB/s）を以ってその結果とします。

    ```sh
    $ source /opt/intel/oneapi/setvars.sh
    $ mpirun -n 2 -ppn 1 -hostfile /path_to_hostlist/hostlist.txt -genv UCX_NET_DEVICES=mlx5_2:1 IMB-MPI1 -msglog 3:28 PingPong
    #----------------------------------------------------------------
    #    Intel(R) MPI Benchmarks 2021.6, MPI-1 part
    #----------------------------------------------------------------
    # Date                  : Tue Jul 18 18:45:29 2023
    # Machine               : x86_64
    # System                : Linux
    # Release               : 4.18.0-425.13.1.el8_7.x86_64
    # Version               : #1 SMP Tue Feb 21 15:09:05 PST 2023
    # MPI Version           : 3.1
    # MPI Thread Environment: 
    
    
    # Calling sequence was: 
    
    # IMB-MPI1 -msglog 3:28 PingPong 
    
    # Minimum message length in bytes:   0
    # Maximum message length in bytes:   268435456
    #
    # MPI_Datatype                   :   MPI_BYTE 
    # MPI_Datatype for reductions    :   MPI_FLOAT 
    # MPI_Op                         :   MPI_SUM  
    # 
    # 
    
    # List of Benchmarks to run:
    
    # PingPong
    
    #---------------------------------------------------
    # Benchmarking PingPong 
    # #processes = 2 
    #---------------------------------------------------
           #bytes #repetitions      t[usec]   Mbytes/sec
                0         1000         1.71         0.00
                8         1000         1.72         4.64
               16         1000         1.72         9.28
               32         1000         1.76        18.16
               64         1000         1.88        34.00
              128         1000         1.94        65.86
              256         1000         2.19       116.90
              512         1000         2.28       224.34
             1024         1000         2.38       431.02
             2048         1000         3.12       656.17
             4096         1000         3.63      1128.55
             8192         1000         4.28      1912.25
            16384         1000         5.85      2798.76
            32768         1000         7.55      4342.28
            65536          640        12.94      5063.04
           131072          320        18.12      7232.15
           262144          160        28.27      9274.42
           524288           80        50.21     10441.60
          1048576           40        93.04     11269.83
          2097152           20       178.49     11749.09
          4194304           10       349.73     11993.04
          8388608            5       692.23     12118.21
         16777216            2      1377.06     12183.35
         33554432            1      2749.48     12203.92
         67108864            1      5490.82     12222.02
        134217728            1     10969.54     12235.50
        268435456            1     21929.37     12240.91
    
    
    # All processes entering MPI_Finalize
    ```

5. 以下コマンドを計算ノードのうちの1ノードでopcユーザで実行します。  
   なお、コマンド中の **path_to_hostlist** は、ホストリストファイルをコピーしたパスに置き換えます。  
   ここでは、4ノード144プロセス（ノードあたり36プロセス）を使用した **All-Reduce** の所要時間をメッセージサイズ0バイトから256 MiBまで計測しています。


    ```sh
    $ source /opt/intel/oneapi/setvars.sh
    $ mpirun -n 144 -ppn 36 -hostfile /path_to_hostlist/hostlist.txt -genv UCX_NET_DEVICES=mlx5_2:1 IMB-MPI1 -msglog 3:28 -npmin 144 allreduce
    #----------------------------------------------------------------
    #    Intel(R) MPI Benchmarks 2021.6, MPI-1 part
    #----------------------------------------------------------------
    # Date                  : Thu Jul 20 17:06:33 2023
    # Machine               : x86_64
    # System                : Linux
    # Release               : 4.18.0-425.13.1.el8_7.x86_64
    # Version               : #1 SMP Tue Feb 21 15:09:05 PST 2023
    # MPI Version           : 3.1
    # MPI Thread Environment: 
    
    
    # Calling sequence was: 
    
    # IMB-MPI1 -msglog 3:28 -npmin 144 allreduce 
    
    # Minimum message length in bytes:   0
    # Maximum message length in bytes:   268435456
    #
    # MPI_Datatype                   :   MPI_BYTE 
    # MPI_Datatype for reductions    :   MPI_FLOAT 
    # MPI_Op                         :   MPI_SUM  
    # 
    # 
    
    # List of Benchmarks to run:
    
    # Allreduce
    
    #----------------------------------------------------------------
    # Benchmarking Allreduce 
    # #processes = 144 
    #----------------------------------------------------------------
       #bytes #repetitions  t_min[usec]  t_max[usec]  t_avg[usec]
            0         1000         0.04         0.04         0.04
            8         1000         3.82         3.99         3.89
           16         1000         3.84         3.97         3.90
           32         1000         3.88         4.02         3.94
           64         1000         4.59         5.84         4.90
          128         1000         4.59         6.17         5.13
          256         1000         5.63         6.98         6.01
          512         1000         5.93         7.43         6.43
         1024         1000         7.01         8.35         7.40
         2048         1000         8.29         9.82         8.74
         4096         1000        11.57        13.00        11.94
         8192         1000        17.99        19.95        18.70
        16384         1000        30.71        32.50        31.28
        32768         1000        40.09        41.80        40.63
        65536          640        58.15        60.29        58.95
       131072          320        95.01        97.25        95.75
       262144          160       174.82       178.72       176.52
       524288           80       324.98       334.57       327.82
      1048576           40       604.11       638.19       615.04
      2097152           20      1222.56      1280.38      1250.78
      4194304           10      2755.72      2793.37      2763.87
      8388608            5      5495.29      5583.16      5538.68
     16777216            2     11045.25     11199.33     11153.57
     33554432            1     24374.20     24531.76     24425.53
     67108864            1     49608.12     52453.49     50430.43
    134217728            1     99095.37    100175.72     99595.04
    268435456            1    196246.06    197505.86    196831.87
    
    
    # All processes entering MPI_Finalize
    ```