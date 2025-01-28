---
title: "クラスタ・ネットワーク統計情報の取得方法"
excerpt: "複数ノードに跨るHPC/機械学習ワークロードを実行するHPC/GPUクラスタは、ノード間通信に使用するクラスタ・ネットワークが想定通りに使用されて初めてその性能を発揮することが出来ます。ここで、インスタンスを **クラスタ・ネットワーク** に接続するNIC（NVIDIA Mellanox ConnectX）は、これを介して通信する際の様々な統計情報を記録するハードウェアカウンタを備えており、インスタンスのOS上でこれらを取得することが可能です。本テクニカルTipsは、クラスタ・ネットワークに接続するインスタンスでクラスタ・ネットワークの利用状況や問題判別に役立つ統計情報を取得する方法を解説します。"
order: "315"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 対応シェイプ（ **[ここ](https://docs.public.oneportal.content.oci.oraclecloud.com/ja-jp/iaas/Content/Compute/Tasks/managingclusternetworks.htm#supported-shapes)** を参照）は、 **クラスタ・ネットワーク** 接続用NICとして **NVIDIA Mellanox ConnectX** を搭載し、 **クラスタ・ネットワーク** とのデータ通信に関連する統計情報を保持するハードウェアカウンタから、性能評価や問題判別に資する情報を取得することが出来ます。

これらの統計情報の中で送受信データ通信量は、アプリケーションのノード間通信性能を把握する上で重要なメトリックで、 **[Oracle Cloud Agent](https://docs.oracle.com/ja-jp/iaas/Content/Compute/Tasks/manage-plugins.htm)** の **[Compute RDMA GPU Monitroing](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/high-performance-compute.htm#high-performance-computing-plugins)** プラグインを介して **[OCIモニタリング](https://docs.oracle.com/ja-jp/iaas/Content/Monitoring/home.htm)** から送受信帯域幅として参照する仕組みがあります。（この詳細は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[OCIモニタリングとGrafanaを使用したHPC/GPUクラスタのメトリック監視方法](/ocitutorials/hpc/tech-knowhow/metric-monitoring/)** を参照下さい。）

また輻輳制御関連のエラーカウンタは、 **クラスタ・ネットワーク** が採用する **RoCEv2** の輻輳制御である **ECN** や **DCQCN** に関する制御情報を保持しており、ノード間通信で問題が発生した際の状況把握に有益な情報として利用することが出来ます。（ **クラスタ・ネットワーク** の輻輳制御詳細は、 **[OCI HPC関連情報リンク集](/ocitutorials/hpc/#4-oci-hpc関連情報リンク集)** の  **First Principles: Building a high-performance network in the public cloud** と **Congestion Control for Large-Scale RDMA Deployments** を参照して下さい。）

次章では、これら統計情報の取得方法を解説します。  
なお本コンテンツの前提とするOSは、ユーティリティ提供方法が **Oracle Cloud Agent** プラグインの **Oracle Linux** 8ベース  **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** です。（この詳細は、**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** を参照して下さい。）

***
# 1. クラスタ・ネットワーク関連統計情報取得

**[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** 接続用NICのハードウェアカウンタは、Linuxカーネルがエクスポートするsysfs仮想ファイルシステムを介してその値をアクセスすることが出来、OS再起動によりその値がリセットされます。
 
この値は、該当のイベントが発生する毎にその値をカウントアップするため、アプリケーション実行の前後でカウンタ値を読み取りその差を取ることで、アプリケーション実行中のイベント発生数を得ることが出来ます。  
例えば、アプリケーション実行前後で送信データ量を保持するハードウェアカウンタ値を採取しその差を計算することで、アプリケーション実行中に特定のインスタンスから **クラスタ・ネットワーク** に送信された総データ量を得ることが出来ます。  
或いは、アプリケーション実行前後で **ECN** パケット受信数を保持するハードウェアカウンタ値を採取しその差を計算することで、アプリケーション実行中に経路上でどの程度輻輳が発生していたかを掴むことが出来ます。

これらハードウェアカウンタ値が格納されるsysfsは、送受信データ量等のデータ通信関連が **/sys/class/infiniband/mlx5_2/ports/1/counters** に、輻輳制御情報を含むダイアグ関連が **/sys/class/infiniband/mlx5_2/ports/1/hw_counters** に、以下のように存在します。

```sh
$ ls /sys/class/infiniband/mlx5_2/ports/1/counters/
excessive_buffer_overrun_errors
link_downed
link_error_recovery
local_link_integrity_errors
multicast_rcv_packets
multicast_xmit_packets
port_rcv_constraint_errors
port_rcv_data
port_rcv_errors
port_rcv_packets
port_rcv_remote_physical_errors
port_rcv_switch_relay_errors
port_xmit_constraint_errors
port_xmit_data
port_xmit_discards
port_xmit_packets
port_xmit_wait
symbol_error
unicast_rcv_packets
unicast_xmit_packets
VL15_dropped
$ ls /sys/class/infiniband/mlx5_2/ports/1/hw_counters/
duplicate_request
implied_nak_seq_err
lifespan
local_ack_timeout_err
np_cnp_sent
np_ecn_marked_roce_packets
out_of_buffer
out_of_sequence
packet_seq_err
req_cqe_error
req_cqe_flush_error
req_remote_access_errors
req_remote_invalid_request
resp_cqe_error
resp_cqe_flush_error
resp_local_length_error
resp_remote_access_errors
rnr_nak_retry_err
roce_adp_retrans
roce_adp_retrans_to
roce_slow_restart
roce_slow_restart_cnps
roce_slow_restart_trans
rp_cnp_handled
rp_cnp_ignored
rx_atomic_requests
rx_dct_connect
rx_icrc_encapsulated
rx_read_requests
rx_write_requests
$
```

なおダイアグ関連のハードウェアカウンタ値は、以下コマンドで一括してその値を取り出すことが出来ます。

```sh
$ rdma statistic | grep mlx5_2
link mlx5_2/1 rx_write_requests 18747 rx_read_requests 0 rx_atomic_requests 0 out_of_buffer 0 out_of_sequence 0 duplicate_request 0 rnr_nak_retry_err 0 packet_seq_err 0 implied_nak_seq_err 0 local_ack_timeout_err 0 rx_dct_connect 0 resp_local_length_error 0 resp_cqe_error 0 req_cqe_error 0 req_remote_invalid_request 0 req_remote_access_errors 0 resp_remote_access_errors 0 resp_cqe_flush_error 0 req_cqe_flush_error 0 roce_adp_retrans 0 roce_adp_retrans_to 0 roce_slow_restart 0 roce_slow_restart_cnps 0 roce_slow_restart_trans 0 rp_cnp_ignored 0 rp_cnp_handled 0 np_ecn_marked_roce_packets 0 np_cnp_sent 0 rx_icrc_encapsulated 0 
$
```

下表は、代表的なハードウェアカウンタです。

| ハードウェアカウンタ<br>タイプ | ハードウェアカウンタ名                | 格納する情報             |
| :-----------: | :------------------------: | :----------------: |
| データ通信関連    | port_rcv_data              | 受信データ量（バイト）        |
|               | port_xmit_data             | 送信データ量（バイト）        |
| ダイアグ関連     | np_ecn_marked_roce_packets | 受信した **ECN** パケット数（※1） |
|               | np_cnp_sent                | 送信した **CNP** パケット数（※2） |
|               | rp_cnp_handled             | 受信した **CNP** パケット数（※3） |

※1）通信経路上のスイッチが送信する **Explicit Congestion Notification** パケットの受信パケット数。  
※2）**DCQCN** が輻輳状態を検知した際に送信する **Congenstion Notification Packet** の送信パケット数。  
※3）**DCQCN** が輻輳状態を検知した際に送信する **Congenstion Notification Packet** の受信パケット数。

全てのハードウェアカウンタの意味は、 **[ここ](https://enterprise-support.nvidia.com/s/article/understanding-mlx5-linux-counters-and-status-parameters)** を参照下さい。