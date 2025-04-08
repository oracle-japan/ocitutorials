---
title: "105 : スケーリングしよう"
excerpt: "ExaDB-D上でOCPU数またはインフラストラクチャ(データベース・サーバー、ストレージ・サーバー)をスケーリングする手順について紹介します。"
order: "2_105"
layout: single
header:
  teaser: "/exadbd/exadb-d_dataguard-standby-bkup-teaser.png"
  overlay_image: "/exadbd/exadb-d_dataguard-standby-bkup-teaser.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=797
---

<a id="anchor0"></a>

# はじめに
**Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D)** のスケーリングの対象は、2種類あります。１つは、割り当てられているH/Wリソース内で利用可能な、OCPU数のスケール・アップ/ダウン。データベースや仮想マシンを再起動することなく、処理を継続したままオンラインで変更可能です。また、VMクラスタ全体に対しての変更になります。そのため、例えばノード毎にCPUコア数を変えることはできないので、仮想マシン数の倍数が指定可能になります。もう１つは、インフラストラクチャー部分のデータベース・サーバーとストレージ・サーバーのスケール・アップ(ダウンは不可)。こちらは、X8M以降のモデルで可能で、CPU・メモリ・ストレージなどH/W的に割り当てられている専有リソースを増やしたい場合に、オンラインで追加が可能です。

**目次 :**
+ [1. OCPUのスケーリング](#1-ocpuのスケーリング)
+ [2. CLIでのOCPUのスケーリング](#2-cliでのocpuのスケーリング)
+ [3. インフラストラクチャのスケーリング](#3-インフラストラクチャのスケーリング)
    - [データベース・サーバーの追加](#anchor3-1)
    - [ストレージ・サーバーの追加](#anchor3-2)

**前提条件 :**
+ [101 : ExaDB-Dを使おう](/ocitutorials/exadbd/exadb-d101-create-exadb-d){:target="_blank"}を通じてExaDB-Dの作成が完了していること
+ [Oracle Cloud Infrastructure Documentation > コマンド・ライン・インターフェース > クイックスタート](https://docs.oracle.com/ja-jp/iaas/Content/API/SDKDocs/cliinstall.htm){:target="_blank"}を通じてOCI CLIのセットアップが完了していること

**所要時間 :** 約6時間（待ち時間を含む）※環境によって異なるため、参考値です

<BR>

# 1. OCPUのスケーリング

まずはコンソール上の操作でのOCPUスケーリングからです。

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1. 利用したいコンパートメントを**リスト範囲**の**コンパートメント**から選択します。

    ![](2022-11-15-16-30-05.png)

1. 利用したいリージョンを右上のリージョンの折りたたみメニューをクリックして、**リージョン**の一覧から選択します。

    ![](2022-11-15-16-32-47.png)

1. スケーリングしたい**Exadata VMクラスタ**の表示名をクリックします。

    ![](2022-07-05-17-14-07.png)

1. **VMクラスタ情報**で**有効なOCPU**を確認します。表示されている値は現在有効なクラスタ内の仮想マシンに割り当てられたすべてのOCPUの合計です。(本ガイドでは4OCPU(各2OCPUのVMが2ノード・クラスタ構成で有効なOCPUは4OCPU))

    ![](2022-11-01-17-04-43.png)

1. **VMクラスタのスケーリング**をクリックします。

    ![](2022-11-01-17-05-08.png)

1. **VMクラスタのスケーリング**ダイアログの**VM当たりのOCPU数**で現在のOCPU数から変更したいOCPU数を指定します。(本ガイドでは4OCPU(VMあたり4OCPU)を指定)

    ![](2023-04-01-00-33-16.png)

    設定後、**変更の保存**をクリックします。

    ![](2023-04-01-00-36-40.png)

1. ステータスが**更新中**から**使用可能**になり、**VMクラスタ情報**の**有効なOCPU**が指定した値に変更されているか確認します。(本ガイドでは仮想マシン当たり4OCPUと指定したため、**有効なOCPU**の値は8OCPU(各4OCPUのVMが2ノード・クラスタ構成で有効なOCPUは8OCPU))

    ![](2022-11-01-17-06-20.png)

    なお、オンラインでのスケーリングなので、ステータスがスケーリング進行中でもサービスの使用は可能です。

<BR>

# 2. CLIでのOCPUのスケーリング

CLI(OCI CLI/REST/Terraformなど)でもスケール・アップ/ダウンは可能です。今回は、OCI CLIでの方法を紹介します。

本ガイドではOCI CLIのセットアップが完了していることを前提として進めます。セットアップされていない方は[Oracle Cloud Infrastructure Documentation > コマンド・ライン・インターフェース > クイックスタート](https://docs.oracle.com/ja-jp/iaas/Content/API/SDKDocs/cliinstall.htm){:target="_blank"}をご参考にセットアップしてください。OCI CLIは別途VMを立ててセットアップをします。

1. 現在のCPUコア数(現在有効なクラスタ内の仮想マシンに割り当てられたすべてのOCPUの合計)を確認します。以下のコマンドを実行します。

    ```
    oci db cloud-vm-cluster get --cloud-vm-cluster-id <スケーリングしたいVMクラスタのOCID> --query 'data.{"1.Name":"display-name","2.shape":"shape","3.cpu-core-count": "cpu-core-count"}'
    ```

    ※VMクラスタのOCIDは**Exadata VMクラスタの詳細**の**VMクラスタ情報**から確認できます。
    ![](2022-11-01-17-08-08.png)

    実行結果例：
    ```
    {
    "1.Name": "VMCluster-1",
    "2.shape": "Exadata.X9M",
    "3.cpu-core-count": 4
    }
    ```
    結果から、CPUコア数が4(各2OCPUのVMが2ノード・クラスタ構成で有効なOCPUは4OCPU)ということがわかります。

2. OCI CLIでスケール・アップを実行します。以下のコマンドを実行します。(本ガイドではCPUコア数を8(各4OCPUのVMが2ノード・クラスタ構成で有効なOCPUは8OCPU)に変更するように実行します。)

    ```
    oci db cloud-vm-cluster update --cpu-core-count 8 --cloud-vm-cluster-id <スケーリングしたいVMクラスタのOCID>
    ```

    コンソール画面でスケーリングをしたVMクラスタのステータスが**更新中**に切り替わっていることを確認します。

    ![](2022-11-01-17-08-33.png)

    約3分後に**使用可能**に切り替わります。

    ![](2022-11-01-17-08-52.png)

3. 現在のCPUコア数を確認します。以下のコマンドを実行します。

    ```
    oci db cloud-vm-cluster get --cloud-vm-cluster-id <VMクラスタのOCID> --query 'data.{"1.Name":"display-name","2.shape":"shape","3.cpu-core-count": "cpu-core-count"}'
    ```   

    実行結果例：
    ```
    {
    "1.Name": "VMCluster-1",
    "2.shape": "Exadata.X9M",
    "3.cpu-core-count": 8
    }
    ```

    CPUコア数が8(各4OCPUのVMが2ノード・クラスタ構成で有効なOCPUは8OCPU)に変更されているため、スケール・アップが成功したことが確認できました。

<BR>

# 3. インフラストラクチャのスケーリング

<a id="anchor3-1"></a>

## データベース・サーバーの追加

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1. **Exadataインフラストラクチャ**をクリックします。

    ![](2022-11-01-11-32-41.png)

1. スケーリングするExadataインフラストラクチャの表示名をクリックします。

    ![](2022-11-01-11-34-10.png)

1. **インフラストラクチャのスケーリング**をクリックします。

    ![](2022-11-01-11-34-24.png)

1. **Exadata Infrastructureのスケーリング**ダイアログで以下のように設定します。
    + **データベース・サーバー**を選択します。
    + **データベース・サーバー** - データベース・サーバーの合計台数を入力します。一回のスケーリング操作で追加できるのは最大4台までです。（本ガイドでは、3台とします。）

    設定後、**スケール**をクリックします。

    ![](2022-11-01-11-35-34.png)

    Exadataインフラストラクチャの状態が**更新中**となります。

    ![](2022-11-01-11-38-43.png)

    3分ほど経過すると、Exadataインフラストラクチャの状態が**使用可能**となり、**Exadataインフラストラクチャの情報**にある**DBサーバー**の情報が反映されていることを確認します。

    ![](2022-11-01-11-40-17.png)

1. 容量を追加したい**Exadata VMクラスタ**の表示名をクリックします。

    ![](2022-11-01-11-41-55.png)

1. **VMクラスタのスケーリング**をクリックします。

    ![](2022-11-01-11-52-43.png)

1. **VMクラスタのスケーリング**ダイアログの**容量を追加**にチェックを付け、現在のリソースとスケーリング後のリソースを確認し、**更新**をクリックします。

    ![](2022-11-01-11-53-39.png)

    VMクラスタの**作業リクエスト**の**Scale Cloud VM Cluster Compute**の状態が**成功**となったら完了です。(完了まで5時間程かかります。※環境によって異なるため、参考値です)

    ![](2022-11-01-11-54-24.png)


<a id="anchor3-2"></a>

## ストレージ・サーバーの追加

1. OCIコンソール・メニューから **Oracle Database** → **Oracle Public Cloud上のExadata** に移動します。

    ![](2022-07-21-15-15-09.png)

1. **Exadataインフラストラクチャ**をクリックします。

    ![](2022-11-01-11-32-41.png)

1. スケーリングするExadataインフラストラクチャの表示名をクリックします。

    ![](2022-11-01-11-34-10.png)

1. **インフラストラクチャのスケーリング**をクリックします。

    ![](2022-11-01-11-34-24.png)

1. **Exadata Infrastructureのスケーリング**ダイアログで以下のように設定します。
    + **ストレージ・サーバー**を選択します。
    + **ストレージ・サーバー** - ストレージ・サーバーの合計台数を入力します。一回のスケーリング操作で追加できるのは最大6台までです。（本ガイドでは、4台とします。）

    設定後、**スケール**をクリックします。

    ![](2022-11-01-11-56-56.png)

    Exadataインフラストラクチャの状態が**更新中**となります。

    ![](2022-11-01-11-57-23.png)

    3分ほど経過すると、Exadataインフラストラクチャの状態が**使用可能**となり、**Exadataインフラストラクチャの情報**にある**DBサーバー**の情報が反映されていることを確認します。

    ![](2022-11-01-11-58-59.png)

1. 容量を追加したい**Exadata VMクラスタ**の表示名をクリックします。

    ![](2022-11-01-12-00-55.png)

1. **VMクラスタのスケーリング**をクリックします。

    ![](2022-11-01-12-01-42.png)

1. **VMクラスタのスケーリング**ダイアログの**容量を追加**にチェックを付け、現在のリソースとスケーリング後のリソースを確認し、**更新**をクリックします。

    ![](2022-11-01-12-02-22.png)

    VMクラスタの**作業リクエスト**の**Scale Cloud VM Cluster Storage**の状態が**成功**となったら完了です。(完了まで1時間程かかります。※環境によって異なるため、参考値です)
    ![](2022-11-01-14-46-31.png)

<br>
以上で、この章の作業は完了です。

<a id="anchor11"></a>

# 参考資料
+ [Oracle Cloud Infrastructure Documentation - Oracle Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en-us/iaas/exadatacloud/index.html){:target="_blank"}
+ [Oracle Cloud Infrastructure Exadata Database Service on Dedicated Infrastructure (ExaDB-D) サービス詳細](https://speakerdeck.com/oracle4engineer/exadata-database-cloud-technical-detail){:target="_blank"}

<BR>

[ページトップへ戻る](#anchor0)
