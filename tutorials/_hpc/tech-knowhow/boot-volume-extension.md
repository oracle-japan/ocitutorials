---
title: "計算/GPUノードのブート・ボリューム動的拡張方法"
excerpt: "インスタンスのルートファイルシステムを格納するブート・ボリュームは、OSを停止することなく動的にその容量を拡張することが可能です。ただこの動的拡張は、OCIコンソールやインスタンスOSで複数のオペレーションを実施する必要があり、ノード数が多くなるクラスタ環境の計算/GPUノードでは、これらのオペレーションを効率的に実施することが求められます。本テクニカルTipsは、HPC/GPUクラスタの多数の計算/GPUノードに対し、ブート・ボリュームの動的拡張を効率的に実施する方法を解説します。"
order: "324"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

インスタンスのルートファイルシステムを格納する **ブート・ボリューム** は、OSを停止することなく動的にその容量を拡張することが可能です。  
ただこの動的拡張は、OCIコンソールやインスタンスOSで複数のオペレーションを実施する必要があり、ノード数が多くなるクラスタ環境の計算/GPUノードでは、これらのオペレーションを効率的に実施することが求められます。  
本テクニカルTipsは、HPC/GPUクラスタの多数の計算/GPUノードに対し、 **ブート・ボリューム** の動的拡張を効率的に実施する方法を解説します。

***
# 0. 概要

インスタンスの **ブート・ボリューム** の動的拡張は、以下のステップを経て行います。

1. **ブート・ボリューム** 拡張（OCI上で実行）
2. **ブート・ボリューム** の再スキャン（インスタンスOS上で実行）
3. パーティションの拡張（インスタンスOS上で実行）

ステップ **1.** は、OCIリソースに対するオペレーションのため、OCIコンソールや **OCI CLI** 等のインターフェースを介して行い、ステップ **2.** と **3.** は、インスタンスOSに対してコマンドを実行して行います。

本テクニカルTipsは、多数の計算/GPUノードに対してこれらのオペレーションを効率よく行う事を想定しています。  
このため、通常HPC/GPUクラスタのクラスタ管理ノードとして使用するBastionノードを活用し、ここからコマンドラインインターフェースで **ブート・ボリューム** の動的拡張のためのオペレーションを実行します。  
なおBastionノードと計算ノードのOSは、 **Oracle Linux** を前提とします。

Bastionノードで使用するコマンドラインインターフェースは、ステップ **1.** に **OCI CLI** 、ステップ **2.** と **3.** に **pdsh** を使用します。  
このため、予めBastionノードで **OCI CLI** と **pdsh** を利用できるよう準備します。

以降の章は、以上のステップに沿って具体的な手順を解説します。

**pdsh** の詳細は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[pdshで効率的にクラスタ管理オペレーションを実行](/ocitutorials/hpc/tech-knowhow/cluster-with-pdsh/)** を参照ください。

***
# 1. Bastionノード事前準備

本章は、Bastionノードで **OCI CLI** と **pdsh** を利用するための手順を解説します。  
本テクニカルTipsでは、 **OCI CLI** と **pdsh** 実行ユーザをopcとします。

1. **OCI CLI** をOCI公式マニュアルの **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/API/SDKDocs/cliinstall.htm)** の手順に従ってインストール・セットアップします。

2. **pdsh** を  **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[pdshで効率的にクラスタ管理オペレーションを実行](/ocitutorials/hpc/tech-knowhow/cluster-with-pdsh/)** の **[ここ](/ocitutorials/hpc/tech-knowhow/cluster-with-pdsh/#1-pdshインストールセットアップ)** の手順に従ってインストール・セットアップします。

***
# 2. ブート・ボリューム拡張

本章は、Bastionノードで **OCI CLI** と **pdsh** を使用し、HPC/GPUクラスタ内の全計算/GPUノードの **ブート・ボリューム** のサイズを拡張します。  
この際予め、対象の計算/GPUノードのホスト名を1行に1ノード記載したホストリストファイルを、カレントディレクトリにhostlist.txtとして用意します。  

1. 以下コマンドをBastionノードのopcユーザで実行し、 **ブート・ボリューム** を拡張する計算/GPUノードのOCIDのリストをテキストファイル（instance_ocid.txt）として作成します。  
なお、 コマンド中の **コンパートメント** のOCIDを指定する箇所は、計算/GPUノードを格納する **コンパートメント** のOCIDに置き換えます。

    ```sh
    $ for hname in `cat ./hostlist.txt`; do echo $hname; oci compute instance list --compartment-id compartment_ocid --display-name $hname | jq -r '.data[].id' >> ./instance_ocid.txt; done
    ```

2. 以下のコマンドをBastionノードのopcユーザで実行し、拡張する **ブート・ボリューム** のOCIDのリストをテキストファイル（bv_ocid.txt）として作成します。  
なお、コマンド中の **コンパートメント** のOCIDと **可用性ドメイン** を指定する箇所は、計算/GPUノードを格納する **コンパートメント** のOCIDと **可用性ドメイン** に置き換えます。

    ```sh
    $ for inst_ocid in `cat ./instance_ocid.txt`; do echo $inst_ocid; oci compute boot-volume-attachment list --availability-domain ad_name --compartment-id compartment_ocid --instance-id $inst_ocid | jq -r '.data[]."boot-volume-id"' >> bv_ocid.txt; done
    ```

3. 以下のコマンドをBastionノードのopcユーザで実行し、 **ブート・ボリューム** を指定のサイズに拡張し、コマンドの出力に拡張後のサイズが表示されることを以って、正しく拡張が行われたことを確認します。  
なお、コマンド中の **ブート・ボリューム** サイズは、実際の拡張後のサイズに置き換えます。

    ```sh
    $ for bv_ocid in `cat ./bv_ocid.txt`; do echo $bv_ocid; oci bv boot-volume update --boot-volume-id $bv_ocid --size-in-gbs 500 | jq -r '.data."size-in-gbs"'; done
    ocid1.bootvolume.oc1.eu-frankfurt-1.xxxx
    500
    ocid1.bootvolume.oc1.eu-frankfurt-1.yyyy
    500
    $
    ```


4. 以下のコマンドをBastionノードのopcユーザで実行し、 **ブート・ボリューム** の再スキャンを実行し、コマンドの出力にリターンコード0が表示されることを以って、正しく再スキャンが行われたことを確認します。

    ```sh
    $ pdsh -w ^/home/opc/hostlist.txt 'sudo dd iflag=direct if=/dev/oracleoci/oraclevda of=/dev/null count=1 > /dev/null 2>&1; echo $?' | dshbak -c
    ----------------
    inst-9bw0h-x9-ol87,inst-nbho9-x9-ol87
    ----------------
    0
    $ pdsh -w ^/home/opc/hostlist.txt "echo 1 | sudo tee /sys/class/block/\`readlink /dev/oracleoci/oraclevda | cut -d'/' -f 2\`/device/rescan > /dev/null; echo $?" | dshbak -c
    ----------------
    inst-9bw0h-x9-ol87,inst-nbho9-x9-ol87
    ----------------
    0
    $
    ```

5. 以下のコマンドをBastionノードのopcユーザで実行し、パーティションの拡張を実行し、コマンドの出力にリターンコード0が表示されることを以って、正しくパーティションの拡張が行われたことを確認します。

    ```sh
    $ pdsh -w ^/home/opc/hostlist.txt 'sudo /usr/libexec/oci-growfs -y > /dev/null; echo $?' | dshbak -c
    ----------------
    inst-9bw0h-x9-ol87,inst-nbho9-x9-ol87
    ----------------
    0
    $
    ```

***
# 3. ルートファイルシステムサイズ確認

本章は、計算/GPUノードのルートファイルシステムサイズを表示し、想定通りのサイズに拡張されているかどうかを確認します。

以下コマンドをBastionノードのopcユーザで実行し、コマンドの出力で計算/GPUノードの拡張後のルートファイルシステムのサイズを確認します。

```sh
$ pdsh -w ^/home/opc/hostlist.txt "df -h / | awk '{print \$2}'" | dshbak -c
----------------
inst-9bw0h-x9-ol87,inst-nbho9-x9-ol87
----------------
Size
489G
```