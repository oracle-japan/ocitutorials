---
title: "OpenMPIのMPI通信性能に影響するパラメータとその関連Tips"
excerpt: "OpenMPIは、最新のMPI言語規格に準拠し、HPC/機械学習ワークロード実行に必要とされる様々な機能を備えたオープンソースのMPI実装です。OpenMPIは、Modular Component Architecture (MCA)を採用し、ビルド時に組み込むコンポーネントを介して多彩な機能を提供する設計となっており、このMCAが用意する多数のパラメータを制御することで、MPI通信性能を最適化することが可能です。またOpenMPIは、クラスタ・ネットワークを介して高帯域・低遅延のMPIプロセス間通信を実現するための通信フレームワークにUCXを採用し、MPI通信性能を最適化するためにはUCXのパラメータを適切に設定することが求められます。本パフォーマンス関連Tipsは、OpenMPIのMPI通信性能に影響するパラメーターやその指定方法に関する有益なTipsを解説します。"
order: "225"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

本パフォーマンス関連Tipsは、 **[OpenMPI](https://www.open-mpi.org/)** のMPI通信性能にフォーカスし、 **OpenMPI** が採用する **[Modular Component Architecture](https://docs.open-mpi.org/en/v5.0.x/mca.html)** （以降 **MCA** と呼称）に組み込まれたコンポーネントや、 **OpenMPI** が通信フレームワークに採用する **[UCX](https://openucx.org/)** に於いて、MPI通信性能に影響するパラメータとその設定方法について、以下のTipsを解説します。

1. **MCA** パラメータ設定方法関連Tips
2. **UCX** パラメータ設定方法関連Tips
3. MPI通信性能に影響する **MCA** ・ **UCX** パラメータ

これらのTipsは、全て **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従って構築された **OpenMPI** を前提に記載します。

***
# 1. MCAパラメータ設定方法関連Tips

本Tipsは、 **MCA** パラメータの設定方法や設定した値の確認方法を解説します。

**OpenMPI** のアプリケーションを実行する際に **MCA** パラメータを指定する方法は、以下の4通りが存在します。  
ここで同じパラメータが複数回指定された場合は、以下の出現順にその値が上書きされます。（全ての指定方法で同じパラメータが設定された場合は、 **4.** で指定されたものが採用されます。）

1. システム管理者により作成された設定ファイルで指定（※1）
2. ユーザにより作成された設定ファイルで指定（※2）
3. 実行時の環境変数で指定（※3）
4. **mpirun** コマンドのオプションで指定（※4）

※1）本パフォーマンス関連Tipsでは、 **/opt/openmpi-5.0.6/etc/openmpi-mca-params.conf** になり、 **2.** のユーザ作成設定ファイルを含めて以下のフォーマットで記載します。  
値にスペースが含まれる場合でも、ダブルクォートでこれを囲むことなくそのまま記載します。

```sh
# This is a comment
coll_hcoll_enable = 1
```

※2）**$HOME/.openmpi/mca-params.conf** です。  
※3）**MCA** パラメータ **coll_hcoll_enable** を値 **1** に設定する場合、パラメータ名に接頭辞 **OMPI_MCA_** を付与した環境変数 **OMPI_MCA_coll_hcoll_enable** を使用することが可能です。この方法は、 **[Slurm](https://slurm.schedmd.com/)** 環境で **OpenMPI** アプリケーションの起動に **srun** を使用する場合、指定方法 **4.** を使用することが出来ないため、 **MCA** パラメータを指定する際に以下のように使用することが可能です。

```sh
$ OMPI_MCA_coll_hcoll_enable=1 srun a.out
```

※4）**MCA** パラメータ **coll_hcoll_enable** を値 **1** に設定する場合、mpirunコマンドのオプション **--mca** を使用して、以下のように指定します。  
ここで、 **MCA** パラメータ名と値の間にはスペースを挟みます。また値にスペースが含まれる場合は、ダブルクォートでこれを囲みます。

```sh
$ mpirun --mca coll_hcoll_enable 1
or
$ mpirun --mca coll_hcoll_enable "1"
```

以上より、システム管理者が **OpenMPI** をインストールするシステム向けの推奨 **MCA** パラメータ値を指定方法 **1.** でシステムワイドに設定し、ユーザはシステム管理者の設定値とは異なるアプリケーションに最適な **MCA** パラメータを指定方法 **2.** から **4.** を駆使して指定することが可能になります。

指定方法 **3.** より前の段階で設定される **MCA** パラメータは、以下コマンド出力の **current value** フィールドでその設定値を確認することが出来ます。  
なおこの **current value** が設定された段階は、 **data source** フィールドで確認することが出来ます。以下の例は、 **OpenMPI** のデフォルト値によりその値が **1** に設定されていることを示しています。

```sh
$ ompi_info --all | grep coll_hcoll_enable
          MCA coll hcoll: parameter "coll_hcoll_enable" (current value: "1", data source: default, level: 9 dev/all, type: int)
$
```

また、全ての指定方法を含めたMPIアプリケーション実行時に使用されたMCAパラメータは、MCAパラメータ **[mpi_show_mca_params](#3-3-mpi_show_mca_params)** を使用することで取得することが可能です。

***
# 2. UCXパラメータ設定方法関連Tips

本Tipsは、 **UCX** パラメータの設定方法や設定した値の確認方法を解説します。

**OpenMPI** のアプリケーションを実行する際の **UCX** パラメータは、実行時に指定されている接頭辞 **UCX_** で始まる環境変数が使用されます。

**OpenMPI** の起動コマンド **mpirun** は、起動される全てのMPIプロセスに環境変数を引き渡す **-x** オプションが用意されており、これを使用します。  
例えば **UCX** パラメータ **UCX_TLS** を値 **posix** に設定する場合、以下のように指定します。  
ここで、値にスペースが含まれる場合は、ダブルクォートでこれを囲みます。

```sh
$ mpirun -x UCX_TLS=posix a.out
or
$ mpirun -x UCX_TLS="posix" a.out
```

**Slurm** 環境で **OpenMPI** アプリケーションを実行する場合は、起動コマンドに **Slurm** 付属の **srun** を使用しますが、この **srun** は実行時環境変数を全てのMPIプロセスに引き渡すため、以下のように **UCX** パラメータを指定することが可能です。

```sh
$ UCX_TLS=posix srun a.out
```

各 **UCX** パラメータの意味とそのデフォルト値は、以下コマンドの出力で確認することが出来ます。以下の例では、 **UCX_TLS** のデフォルト値が **all** に設定されていることが分かります。

```sh
$ ucx_info -cf | grep -B 25 ^UCX_TLS

#
# Comma-separated list of transports to use. The order is not meaningful.
#  - all     : use all the available transports.
#  - sm/shm  : all shared memory transports (mm, cma, knem).
#  - mm      : shared memory transports - only memory mappers.
#  - ugni    : ugni_smsg and ugni_rdma (uses ugni_udt for bootstrap).
#  - ib      : all infiniband transports (rc/rc_mlx5, ud/ud_mlx5, dc_mlx5).
#  - rc_v    : rc verbs (uses ud for bootstrap).
#  - rc_x    : rc with accelerated verbs (uses ud_mlx5 for bootstrap).
#  - rc      : rc_v and rc_x (preferably if available).
#  - ud_v    : ud verbs.
#  - ud_x    : ud with accelerated verbs.
#  - ud      : ud_v and ud_x (preferably if available).
#  - dc/dc_x : dc with accelerated verbs.
#  - tcp     : sockets over TCP/IP.
#  - cuda    : CUDA (NVIDIA GPU) memory support.
#  - rocm    : ROCm (AMD GPU) memory support.
#  - ze      : ZE (Intel GPU) memory support.
#  Using a \ prefix before a transport name treats it as an explicit transport name
#  and disables aliasing.
# 
#
# syntax:    comma-separated list (use "all" for including all items or '^' for negation) of: string
#
UCX_TLS=all
$
```

***
# 3. MPI通信性能に影響するMCA・UCXパラメータ

## 3-0. 概要

本章は、その設定値がMPI通信性能に影響を与える代表的な **MCA** パラメータと **UCX** パラメータを解説します。

これらパラメータの設定方法は、 **MCA** パラメータは **[1. MCAパラメータ設定方法関連Tips](#1-mcaパラメータ設定方法関連tips)** を、 **UCX** パラメータは **[2. UCXパラメータ設定方法関連Tips](#2-ucxパラメータ設定方法関連tips)** を参照してください。

下表は、本章で紹介する **MCA** ・ **UCX** パラメータの一覧です。  
各パラメータの詳細は、 **名称** 列をクリックしてください。

| 名称                                                            | タイプ     | 分類<br>（※5） | デフォルト<br>（※6） | 概要                         |
| :-----------------------------------------------------------: | :-----: | :--------: | :-----------: | :------------------------: |
| **[coll_hcoll_enable](#3-1-coll_hcoll_enable)**               | **MCA** | パフォーマンス    | 1             | **HCOLL** コンポーネント<br>使用の制御 |
| **[hook_comm_method_display](#3-2-hook_comm_method_display)** | **MCA** | 情報提供       | 0             | 通信プロトコルレポート<br>表示の制御       |
| **[mpi_show_mca_params](#3-3-mpi_show_mca_params)** | **MCA** | 情報提供       | 0             | 実行時MCAパラメータ<br>表示の制御       |
| **[UCX_TLS](#3-4-ucx_tls)**                                   | **UCX** | パフォーマンス    | all           | 通信トランスポートの指定               |
| **[UCX_NET_DEVICES](#3-5-ucx_net_devices)**                   | **UCX** | パフォーマンス    | all             | ネットワークデバイスの指定              |
| **[UCX_RNDV_THRESH](#3-6-ucx_rndv_thresh)**                   | **UCX** | パフォーマンス    | auto          | プロトコル切替<br>境界メッセージ長の指定         |
| **[UCX_ZCOPY_THRESH](#3-7-ucx_zcopy_thresh)**                   | **UCX** | パフォーマンス    | auto          | プロトコル切替<br>境界メッセージ長の指定         |
| **[UCX_PROTO_INFO](#3-8-ucx_proto_info)**                     | **UCX** | 情報提供    | n             | メッセージ長毎の<br>使用プロトコル表示の制御                           |

※5）**パフォーマンス** に分類されるものはMPI通信性能に影響を及ぼすパラメータ、 **情報提供** に分類されるものはMPI通信性能を考察する際の有益な情報を提供するパラメータです。  
※6）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[Slurm環境での利用を前提とするUCX通信フレームワークベースのOpenMPI構築方法](/ocitutorials/hpc/tech-knowhow/build-openmpi/)** に従って構築された **OpenMPI** でのデフォルト値です。


## 3-1. coll_hcoll_enable

MPI集合通信を効率的に実行する **MCA** コンポーネントの **HCOLL** （Hierarchical Collectives）を使用するかどうかを制御し、使用する場合はその値に **1** （デフォルト）を、使用しない場合は **0** を指定します。

**HCOLL** は、NUMA・ソケット・UMA（ノード）の各グループを階層構造として定義し、上位の階層を跨ぐプロセス間通信（最上位層はノード間通信）を減らすことで集合通信の最適化を行います。  
このため **HCOLL** 使用の有無は、特にノードを跨ぐケースで集合通信性能に影響を及ぼします。

**HCOLL** がMPI集合通信性能に及ぼす影響は、 **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI集合通信チューニング方法](/ocitutorials/hpc/benchmark/openmpi-perftune/)** を参照してください。

## 3-2. hook_comm_method_display

使用したMPI通信プロトコルを表示するかどうかを制御し、MPI_INITが呼ばれた時点で表示する場合はその値に **1** を、MPI_FINALIZEが呼ばれた時点で表示する場合は **2** を、表示しない場合は **0** （デフォルト）を指定します。

以下は、MPI通信プロトコルの表示を指示した場合の実行例です。

```sh
$ mpirun -n 72 --host inst-dq8gn-x9:36,inst-ulu8a-x9:36 --mca hook_comm_method_display 1 a.out
Host 0 [inst-dq8gn-x9] ranks 0 - 35
Host 1 [inst-ulu8a-x9] ranks 36 - 71

 host | 0        1
======|===================
    0 : ucx[  2] ucx[  3]
    1 : ucx[  3] ucx[  2]

UCX Transport/Device
ucx[  2]:
    posix            memory          
    xpmem            memory          
    rc_mlx5          mlx5_2:1        
ucx[  3]:
    rc_mlx5          mlx5_2:1        
Connection summary: (pml)
  on-host:  all connections are ucx=posix;memory,xpmem;memory,rc_mlx5;mlx5_2:1
  off-host: all connections are ucx=rc_mlx5;mlx5_2:1
:
$
```

## 3-3. mpi_show_mca_params

実行時に使用したMCAパラメータを表示するかどうかを制御し、代表的な設定値に以下があります。

- **all** ： 全てのMCAパラメータを出力
- **enviro** ： **mpirun** コマンドオプションと実行時環境変数で指定されたMCAパラメータを出力 


以下は、 **enviro** を設定値とする **mpi_show_mca_params** を指定した場合の実行例です。

```sh
$ mpirun -n 2 --mca coll_hcoll_enable 0 --mca mpi_show_mca_params enviro ./a.out
[inst-echgs-x9-ol81-hpc-nps1:13392] mpi_show_mca_params=enviro (environment)
[inst-echgs-x9-ol81-hpc-nps1:13392] coll_hcoll_enable=0 (environment)
Hello World FORTRAN  0  2 Run on inst-echgs-x9-ol81-hpc-nps1   
Hello World FORTRAN  1  2 Run on inst-echgs-x9-ol81-hpc-nps1   
$
```

また、実行時に使用したMCAパラメータをファイルに出力するためのMCAパラメータ **mpi_show_mca_params_file** も存在し、その設定値に出力先ファイルのパスを指定します。

以下は、出力先ファイルを **/tmp/mca.out** とする **mpi_show_mca_params_file** を指定した場合の実行例です。

```sh
$ mpirun -n 2 --mca coll_hcoll_enable 0 --mca mpi_show_mca_params enviro --mca mpi_show_mca_params_file /tmp/mca.out ./a.out
Hello World FORTRAN  0  2 Run on inst-echgs-x9-ol81-hpc-nps1   
Hello World FORTRAN  1  2 Run on inst-echgs-x9-ol81-hpc-nps1   
$ cat /tmp/mca.out 
#
# This file was automatically generated on Fri Jan 31 12:18:28 2025
# by MPI_COMM_WORLD rank 0 (out of a total of 2) on inst-echgs-x9-ol81-hpc-nps1
#
mpi_show_mca_params=enviro (environment)
mpi_show_mca_params_file=/tmp/mca.out (environment)
coll_hcoll_enable=0 (environment)
$
```

## 3-4. UCX_TLS

**UCX** が使用する通信トランスポートを指定します。  
複数のトランスポートを指定する場合は、カンマ区切りで列挙し、指定する順序は意味を持ちません。

使用する通信トランスポートは、MPI通信性能に影響を及ぼします。

下表は、使用可能な代表的な通信トランスポートです。

| 名称        | 概要                                                                                                                                                      |
| :-------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: |
| **all**   | 利用可能な全ての通信トランスポートから **UCX** が選択（デフォルト）                                                                                                                  |
| **self**    | 同一プロセス内通信用ループバックトランスポート                                                                                                                        |
| **sm**    | 利用可能な共有メモリトランスポートから **UCX** が選択                                                                                                                         |
| **posix** | POSIX共有メモリ                                                                                                                                              |
| **sysv**  | SYSTEM V共有メモリ                                                                                                                                           |
| **cma**   | **[Cross Memory Attach (CMA)](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=fcf634098c00dd9cd247447368495f0b79be12d1)** |
| **knem**  | **[KNEM](https://knem.gitlabpages.inria.fr/)**                                                                                                          |
| **xpmem** | **[XPMEM](https://github.com/hpc/xpmem)**                                                                                                               |
| **rc**    | InfiniBandトランスポートのReliable Connected                                                                                                                    |
| **dc**    | InfiniBandトランスポートのDynamically Connected                                                                                                                 |
| **ud**    | InfiniBandトランスポートのUnreliable Datagram                                                                                                                   |
| **tcp**   | TCP/IPのソケット通信                                                                                                                                           |

以下は、 **UCX_TLS** に **self** 、 **sm** 、及び **rc** を指定しています。

```sh
$ mpirun -x UCX_TLS=self,sm,rc a.out
```

## 3-5. UCX_NET_DEVICES

**UCX** が通信に使用するネットワークデバイスを指定します。  
**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 対応シェイプを使用する場合は、 **クラスタ・ネットワーク** 接続に使用するNICのRDMAリンク名（ **BM.Optimized3.36** の場合は **mlx5_2:1** ）を指定します。また設定値 **all** （デフォルト）は、 **UCX** に利用可能なネットワークデバイスから選択させることを指定します。

使用するネットワークデバイスは、MPI通信性能に影響を及ぼします。

NICのRDMAリンク名は、以下のコマンドで調査することが可能です。  
以下は、 **BM.Optimized3.36** での実行例で、表示される値の **/** を **:** に置き換えて **UCX_NET_DEVICES** に設定します。

```sh
$ rdma link show
link mlx5_0/1 state ACTIVE physical_state LINK_UP netdev eth0 
link mlx5_1/1 state ACTIVE physical_state LINK_UP netdev eth1 
link mlx5_2/1 state ACTIVE physical_state LINK_UP netdev rdma0 
link mlx5_3/1 state DOWN physical_state DISABLED netdev rdma1 
$
```

## 3-6. UCX_RNDV_THRESH

**UCX** が使用するEagerプロトコル（短いメッセージ長で有利）とRendezvousプロトコル（長いメッセージ長で有利）を切り替えるメッセージ長の境界を指定します。  
メッセージ長の指定は、そのユニットに **b** （B）、 **kb** （KB）、 **mb** （MB）、及び **gb** （GB）を使用します。また設定値 **auto** （デフォルト）は、境界メッセージ長を **UCX** に選択させることを指定します。

ここで指定する境界メッセージは、ノード内通信のプロトコル用とノード間通信のプロトコル用を個別に指定することが可能です。

この境界メッセージ長は、MPI通信性能に影響を及ぼしますが、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI集合通信チューニング方法](/ocitutorials/hpc/benchmark/openmpi-perftune/)** を参照してください。

以下は、ノード内通信とノード間通信の境界メッセージ長にそれぞれ32kbと128kbを指定しています。

```sh
$ mpirun -x UCX_RNDV_THRESH=intra:32kb,inter:128kb a.out
```

また以下は、ノード内・ノード間の何れの境界メッセージ長も128KBを指定しています。

```sh
$ mpirun -x UCX_RNDV_THRESH=128kb a.out
```

## 3-7. UCX_ZCOPY_THRESH

**UCX** が使用するバッファーコピープロトコル（短いメッセージ長で有利）とゼロコピープロトコル（長いメッセージ長で有利）（ノード内通信の場合 **cma** ・ **knem** ・ **xpmem** ：ノード間通信の場合 **RDMA put** ・ **RDMA get** 等）を切り替えるメッセージ長の境界を指定します。  
メッセージ長の指定は、そのユニットに **b** （B）、 **kb** （KB）、 **mb** （MB）、及び **gb** （GB）を使用します。また設定値 **auto** （デフォルト）は、境界メッセージ長を **UCX** に選択させることを指定します。

この境界メッセージ長は、MPI通信性能に影響を及ぼしますが、詳細は **[OCI HPCパフォーマンス関連情報](/ocitutorials/hpc/#2-oci-hpcパフォーマンス関連情報)** の **[OpenMPIのMPI集合通信チューニング方法](/ocitutorials/hpc/benchmark/openmpi-perftune/)** を参照してください。

以下は、境界メッセージ長に128KBを指定しています。

```sh
$ mpirun -x UCX_ZCOPY_THRESH=128kb a.out
```

## 3-8. UCX_PROTO_INFO

メッセージ長毎に **UCX** が使用したプロトコルを標準出力に表示する機能を制御し、表示する場合は **y** を、表示しない場合 **n** （デフォルト）を指定します。

以下は、 **UCX_TLS** を **sysv** と **xpmem** に指定し、 **UCX_RNDV_THRESH** を512KBに指定して、メッセージ長毎に使用したプロトコルを表示するよう指示した場合の実行例です。

```sh
$ mpirun -x UCX_PROTO_INFO=y -x UCX_TLS=sysv,xpmem -x UCX_RNDV_THRESH=512kb a.out | cut -d ' ' -f 3-
:
  +--------------------------------+--------------------------------------------------------------+
  | ucp_context_1 intra-node cfg#1 | tagged message by ucp_tag_send*(multi) from host memory      |
  +--------------------------------+-----------------------------------------------+--------------+
  |                          0..92 | eager short                                   | sysv/memory  |
  |                       93..8248 | eager copy-in copy-out                        | sysv/memory  |
  |                   8249..524287 | multi-frag eager copy-in copy-out             | sysv/memory  |
  |                      512K..inf | (?) rendezvous copy from mapped remote memory | xpmem/memory |
  +--------------------------------+-----------------------------------------------+--------------+
:
$
```
