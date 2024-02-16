---
title: "計算/GPUノードの効果的な名前解決方法"
excerpt: "ノード数が多くなるHPCクラスタやGPUクラスタの計算ノードの名前解決は、どのように行うのが効果的でしょうか。本テクニカルTipsは、仮想クラウドネットワークのDNSを使用した効果的な計算/GPUノードの名前解決方法を解説します。"
order: "331"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

ノード数が多くなるHPCクラスタやGPUクラスタの計算/GPUノードの名前解決は、どのように行うのが効果的でしょうか。  
本テクニカルTipsは、 **仮想クラウド・ネットワーク** のDNSを使用した効果的な計算/GPUノードの名前解決方法を解説します。

**注意 :** 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。

***
# 0. 概要

**仮想クラウド・ネットワーク** に接続するインスタンスは、 **仮想クラウド・ネットワーク** が提供するDNSサービスにインスタンス名とIPアドレスの正引き・逆引き情報がデプロイ時に自動的に登録され、インスタンス名を使用して名前解決することが可能です。  
このため、ホスト名とIPアドレスの関係をシステム管理者がメンテナンスする **/etc/hosts** を使用する方法やNISと比較し、DNS名前解決を活用することでホスト名管理を省力化することが可能です。

ここで、 **仮想クラウド・ネットワーク** が提供するDNSサービスは、インスタンス名（compute1）、接続する **仮想クラウド・ネットワーク** 名（vcn）、及びサブネット名（private）を使用し、インスタンスのFQDNを以下のように登録します。

```sh
compute1.private.vcn.oraclevcn.com
```

このため、DNS名前解決対象のインスタンスが接続するサブネットのFQDNを **/etc/resolv.conf** のsearch行に追加することで、インスタンス名によるDNS名前解決が可能になります。  
例えば、 **仮想クラウド・ネットワーク** 名がvcn、サブネット名が **public** のサブネットに接続されるBastionノード上で、同じ **仮想クラウド・ネットワーク** のサブネット名が **private** のサブネットに接続される計算ノードをインスタンス名でDNS名前解決する場合、Bastionノードの **/etc/resolv.conf** のsearch行が以下となっていれば良いことになります。

```sh
search vcn.oraclevcn.com public.vcn.oraclevcn.com private.vcn.oraclevcn.com
```

ただ、この方針に沿って **/etc/resolv.conf** を修正する際、このファイルがDHCPクライアントにより管理されており、DHCPのリース切れやOS再起動の際に修正が元に戻ってしまうことに注意する必要があります。

以上より、インスタンス名によるDNS名前解決は、以下の手順を経て行います。

- サブネットFQDN確認: DNS名前解決対象のインスタンスが接続するサブネットのFQDNの確認
- **/etc/resolv.conf** 修正: DNS名前解を行うインスタンスの **/etc/resolv.conf** の修正

***
# 1. サブネットFQDN確認

本章は、インスタンス名でDNS名前解決を行いたいインスタンスが接続されるサブネットのFQDNを確認します。

サブネットのFQDNは、OCIコンソールでサブネットが存在するリージョンを選択後、 **ネットワーキング** → **仮想クラウド・ネットワーク** とメニューを辿り、表示される以下画面で該当するサブネットが含まれる **仮想クラウド・ネットワーク** を選択します。

![画面ショット](console_page01.png)

表示される以下画面で、該当するサブネットを選択します。

![画面ショット](console_page03.png)

表示される以下 **サブネット詳細** 画面の **DNSドメイン名** フィールドで、サブネットのFQDNを確認します。  
この例では、サブネットのドメイン名が **private** 、 **仮想クラウド・ネットワーク** のドメイン名が **vcn** のため、FQDNが **private.vcn.oraclevcn.com** になっています。

![画面ショット](console_page02.png)

***
# 2. resolv.confファイル修正

## 2-0. 概要

本章は、インスタンス名によるDNS名前解決を行いたいインスタンス上で、 **/etc/resolv.conf** のsearch行を修正します。  
この修正方法は、使用するOSが **Oracle Linux** 、 **Rocky linux** 、 **Ubuntu** で異なるため、それぞれに分けてその修正方法を解説します。

## 2-1. Oracle Linuxの場合

**Oracle Linux** でデプロイしたインスタンスの **/etc/resolv.conf** のsearch行は、接続する **仮想クラウド・ネットワーク** 名が **vcn_name** でサブネット名が **subnet_src** の場合、以下のようになっています。

```sh
$ grep ^search /etc/resolv.conf 
search vcn_name.oraclevcn.com subnet_src.vcn_name.oraclevcn.com
$
```

そこで、以下コマンドをopcユーザで実行します。

```sh
$ sudo sed -i '/^search/s/$/ subnet_dst.vcn_name.oraclevcn.com/g' /etc/resolv.conf
$ sudo chattr -R +i /etc/resolv.conf
```

以上の手順で、 **vcn_name** に指定した **仮想クラウド・ネットワーク** の **subnet_dst** に指定したサブネットに接続されるインスタンスのインスタンス名による名前解決が可能になります。

この状態は、ファイルシステムの拡張属性により **/etc/resolv.conf** の修正が出来ない状態になっているため、再度修正する場合は、以下コマンドをopcユーザで実行します。

```sh
$ sudo chattr -R -i /etc/resolv.conf
```

## 2-2. Rocky Linuxの場合

**Rocky linux** でデプロイしたインスタンスの **/etc/resolv.conf** のsearch行は、接続する **仮想クラウド・ネットワーク** 名が **vcn_name** でサブネット名が **subnet_src** の場合、以下のようになっています。

```sh
$ grep ^search /etc/resolv.conf 
search vcn_name.oraclevcn.com
$
```

そこで、以下コマンドをrockyユーザで実行します。

```sh
$ sudo sed -i '/^search/s/$/ subnet_src.vcn_name.oraclevcn.com subnet_dst.vcn_name.oraclevcn.com/g' /etc/resolv.conf
$ sudo chattr -R +i /etc/resolv.conf
```

以上の手順で、**vcn_name** に指定した **仮想クラウド・ネットワーク** の **subnet_src** と **subnet_dst** に指定したサブネットに接続されるインスタンスのインスタンス名による名前解決が可能になります。

この状態は、ファイルシステムの拡張属性により **/etc/resolv.conf** の修正が出来ない状態になっているため、再度修正する場合は、以下コマンドをrockyユーザで実行します。

```sh
$ sudo chattr -R -i /etc/resolv.conf
```

## 2-3. Ubuntuの場合

Ubuntuでデプロイしたインスタンスの **/etc/resolv.conf** のsearch行は、接続する **仮想クラウド・ネットワーク** 名が **vcn_name** の場合、以下のようになっています。

```sh
$ grep ^search /etc/resolv.conf 
search vcn_name.oraclevcn.com
$
```

そこで、以下コマンドをubuntuユーザで実行します。

```sh
$ sudo rm /etc/resolv.conf
$ sudo cp /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
$ sudo sed -i '/^search/s/$/ subnet_src.vcn_name.oraclevcn.com subnet_dst.vcn_name.oraclevcn.com/g' /etc/resolv.conf
```

以上の手順で、 **vcn_name** に指定した **仮想クラウド・ネットワーク** の **subnet_src** と **subnet_dst** に指定したサブネットに接続されるインスタンスのインスタンス名による名前解決が可能になります。