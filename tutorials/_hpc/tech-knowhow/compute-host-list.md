---
title: "計算ノードのホスト名リスト作成方法"
excerpt: "ノード数が多くなるHPCクラスタやGPUクラスタは、全ての計算/GPUノードのホスト名の一覧を記載したホスト名リストを作成することで、構築・運用作業を効率的に進めることが可能になります。本テクニカルTipsは、HPC/GPUクラスタの計算/GPUノードのホスト名リストを効果的に作成する方法を解説します。"
order: "333"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

ノード数が多くなるHPCクラスタやGPUクラスタは、全ての計算/GPUノードのホスト名の一覧を記載したホスト名リストを作成することで、構築・運用作業を効率的に進めることが可能になります。  
本テクニカルTipsは、HPC/GPUクラスタの計算/GPUノードのホスト名リストを効果的に作成する方法を解説します。

***
# 0. 概要

HPCクラスタやGPUクラスタを構築・運用する際、全ての計算/GPUノードに対して同じコマンドを実行する、ジョブスケジューラに全てのノードを一括登録する、といったオペレーションを行う場面が頻繁に発生します。  
このようなオペレーションは、全ての計算/GPUノードのホスト名を1行に1ノード記載した、以下のようなホスト名リストをテキストファイルで予め作成しておくことで、効率よく実施することが可能になります。

```sh
inst-hyqxm-comp
inst-ihmnl-comp
inst-hrsmf-comp
inst-afnzx-comp
```

例えば、以下のようにこのホスト名リストを使用することで、全ての計算ノードのOSバージョンを確認することが可能です。

```sh
> for hname in `cat ./hostlist.txt`; do echo $hname; ssh $hname "grep -i pretty /etc/os-release"; done
inst-0giw2-comp
PRETTY_NAME="Oracle Linux Server 8.6"
inst-ael72-comp
PRETTY_NAME="Oracle Linux Server 8.6"
```

このホスト名リストは、以下のような方法で効率的に作成することが可能です。

- OCIコンソールを活用する方法

  この方法は、OCIコンソールの **インスタンス** メニューに表示される計算/GPUノードのインスタンス名を活用する方法です。  
  この **インスタンス** メニューは、1ページに50インスタンスまでしか表示できないため、50ノードを超える場合は、複数ページにわたってコピー・ペーストを行う必要があり、後述のOCI CLIを使用する方法が効率的にホスト名リストを作成できます。

- OCI CLIを活用する方法

  この方法は、OCI CLIの **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** に含まれるインスタンスをリストする機能を活用し、コマンド一発でホスト名リストを作成する方法です。  
  OCI CLIは、これを利用可能にするための事前準備が必要なため、ノード数が少ないケースでは、前述の **OCIコンソールを活用する方法** が手軽にホスト名リストを作成出来ます。

以上の観点を自身のHPC/GPUクラスタに照らし合わせ、どちらの手法を利用するかを決定します。

以降では、これら2つの方法を解説します。

なお、 **[HPCクラスタスタック](/ocitutorials/hpc/#5-10-hpcクラスタスタック)** を使用してクラスタを構築する場合は、ホスト名リストが **/etc/opt/oci-hpc/hostfile.tcp** として作成されるため、改めて作成する必要はありません。  
また、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[HPCクラスタを構築する(基礎インフラ自動構築編)](/ocitutorials/hpc/spinup-hpc-cluster-withterraform/)** や **[GPUクラスタを構築する(基礎インフラ自動構築編)](/ocitutorials/hpc/spinup-gpu-cluster-withterraform/)** にしたがってクラスタを構築する場合も、ホスト名リストが **/home/opc/hostlist.txt** として作成されるため、改めて作成する必要はありません。

***
# 1. OCIコンソールを活用する方法

本章は、OCIコンソールを活用してホスト名リストを作成します。

OCIコンソールの **インスタンス** メニューは、デフォルトで **作成日** 列の古い順にインスタンスをリストします。  
そこで、作成した計算/GPUノードのインスタンスを上位に表示するため、以下画面の上向き矢印をクリックし、新しい順にインスタンスを並べ替えます。

![画面ショット](console_page01.png)

次に、以下画面の **表の設定** ボタンをクリックし、

![画面ショット](console_page02.png)

表示される以下 **表の列の構成** サイドバーの **表示** フィールドで、 **名前** 以外のチェックボックスを全てクリックしてこれらを非表示に設定し、 **変更の保存** ボタンをクリックします。

![画面ショット](console_page03.png)

表示される以下画面右下で、1ページに表示するインスタンス数を選択できる最大（最大でも50インスタンス）の値に設定します。

![画面ショット](console_page04.png)

表示される以下画面で、対象のインスタンスを選択し、これらのホスト名をクリップボードにコピーします。

![画面ショット](console_page05.png)

次に、ホスト名リストを使用するインスタンスでエディターを起動し、クリップボードの内容を張り付けてホスト名リストを作成します。  
この時点のホスト名リストは、以下のようにホスト間に空行が含まれています。

```sh
inst-hyqxm-comp

inst-ihmnl-comp

inst-hrsmf-comp

inst-afnzx-comp
```

そこで、以下のコマンドでこの空行を除去します。

```
> grep -v "^$" hostlist_tmp.txt > hostlist.txt
> cat hostlist.txt 
inst-hyqxm-comp
inst-ihmnl-comp
inst-hrsmf-comp
inst-afnzx-comp
```

***
# 2. OCI CLIを活用する方法

本章は、OCI CLIを活用してホスト名リストを作成します。

OCI CLIは、事前にインストール・セットアップする必要があります。  
作成するホスト名リストは、通常HPC/GPUクラスタを管理する役割を担う管理ノードで使用するため、OCI CLIのインストール・セットアップも、この管理ノードで行います。

OCI CLIのインストール・セットアップは、以下のOCI公式マニュアルに従って実施します。

**[https://docs.oracle.com/ja-jp/iaas/Content/API/SDKDocs/cliinstall.htm](https://docs.oracle.com/ja-jp/iaas/Content/API/SDKDocs/cliinstall.htm)**

OCI CLIが利用可能になったら、計算/GPUノードを含む **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** とコンパートメントのOCIDを指定し、以下のコマンドでホスト名リストを作成します。

```sh
> oci compute-management cluster-network list-instances --all --cluster-network-id cn_ocid -c comp_ocid | jq -r '.data[]."display-name"'  > hostlist.txt
> cat hostlist.txt 
inst-hyqxm-comp
inst-ihmnl-comp
inst-hrsmf-comp
inst-afnzx-comp
```