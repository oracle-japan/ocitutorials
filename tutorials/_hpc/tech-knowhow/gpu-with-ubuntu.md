---
title: "UbuntuをOSとする機械学習ワークロード向けGPUノード構築方法"
excerpt: "機械学習ワークロード実行のためのGPU搭載ノードは、NVIDIAが提供する様々なGPU関連ソフトウェアの開発が主にUbuntuで行われていることから、そのOSにUbuntuを使用するのが主流になっていますが、UbuntuをOSに指定してGPU搭載インスタンスをデプロイする場合、GPUを利用するためのソフトウェアを自身でインストール・セットアップする必要があります。本テクニカルTipsは、UbuntuをGPU搭載インスタンスと共にデプロイした後GPU利用に必要なソフトウェアをインストール・セットアップすることで、機械学習ワークロード向けGPUノードを構築する方法を解説します。"
order: "341"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

機械学習ワークロード実行のためのGPU搭載ノードは、NVIDIAが提供する様々なGPU関連ソフトウェアの開発が主に **Ubuntu** で行われていることから、そのOSに **Ubuntu** を使用するのが主流になっていますが、 **Ubuntu** をOSに指定してGPU搭載インスタンスをデプロイする場合、GPUを利用するためのソフトウェアを自身でインストール・セットアップする必要があります。  
本テクニカルTipsは、 **Ubuntu** をGPU搭載インスタンスと共にデプロイした後GPU利用に必要なソフトウェアをインストール・セットアップすることで、機械学習ワークロード向けGPUノードを構築する方法を解説します。

**注意 :** テクニカルTips内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。

***
# 0. 概要

インスタンスOSに利用可能なLinuxディストリビューションは、 **Oracle Linux** をはじめ主要なものが用意されていますが、機械学習ワークロード実行のためのGPUノードのOSで主流になっている **Ubuntu** もこれに含まれます。  
ただこの場合、GPUを利用するための以下ソフトウェアは、GPUインスタンスデプロイ後に自身でインストール・セットアップする必要があります。

- **[NVIDIA Driver](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html)** : NVIDIA製GPUドライバソフトウェア
- **[NVIDIA CUDA](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/contents.html)** : CUDAライブラリ
- **[NVIDIA Fabric Manager](https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html)** : **NVSwitch** （ **BM.GPU4.8** / **BM.GPU.A100-v2.8** に搭載）管理ソフトウェア

また本テクニカルTipsは、これらのソフトウェアが正しくインストールされているか、 **[CUDA Samples](https://github.com/nvidia/cuda-samples)** で確認します。

以降は、これらの手順をGPUシェイプ **BM.GPU4.8** と **Ubuntu** 20.04を例に解説します。

***
# 1. GPUインスタンスデプロイ

本章は、 **Ubuntu** 20.4をOSとする **BM.GPU4.8** をデプロイします。

1. OCIコンソールにログインし、GPUインスタンスをデプロイする **リージョン** を選択後、 **コンピュート** → **インスタンス** とメニューを辿ります。

2. 表示される以下画面で、**インスタンスの作成** ボタンをクリックします。

   ![画面ショット](console_page01.png)

3. 表示される **コンピュート・インスタンスの作成** 画面で、以下の情報を入力し **作成** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。  

   3.1 
    - **名前** ：インスタンスに付与する名前
    - **コンパートメントに作成** ：インスタンスを作成する **コンパートメント**

   ![画面ショット](console_page02.png)

   3.2 **配置** フィールド
    - **可用性ドメイン** ：インスタンスをデプロイする **可用性ドメイン**

   ![画面ショット](console_page03.png)

   3.3 **イメージとシェイプ** フィールド

   ![画面ショット](console_page04.png)

    - **イメージ** ：Canonical Ubuntu 20.04 (**イメージの変更** ボタンをクリックして表示される以下 **イメージの選択** サイドバーで **Ubuntu** を選択し **イメージ名** 列で **Canonical Ubuntu 20.04** を選択し、 **イメージの選択** ボタンをクリック。）

   ![画面ショット](console_page05.png)

    - **Shape** ： **BM.GPU4.8** (**Change Shape** ボタンをクリックして表示される以下 **すべてのシェイプの参照** サイドバーで **ベア・メタル・マシン** をクリックして表示される **BM.GPU4.8** を選択し **次のドキュメントを確認した上でこれに同意します。** チェックボックスをチェックし **シェイプの選択** ボタンをクリック。）

   ![画面ショット](console_page06.png)

   3.4 **プライマリVNIC情報** フィールド
    - **プライマリ・ネットワーク** ： GPUインスタンスを接続する **仮想クラウドネットワーク**
    - **サブネット** ：GPUインスタンスを接続する **サブネット**

   ![画面ショット](console_page07.png)

   3.5 **SSHキーの追加** フィールド
    - **SSHキー** ：GPUインスタンスにログインする際使用するSSH秘密鍵に対応する公開鍵
      - 公開鍵ファイルのアップロード（ **公開キー・ファイル(.pub)のアップロード** ）と公開鍵のフィールドへの貼り付け（ **公開キーの貼付け** ）が選択可能  

      ![画面ショット](console_page08.png)

   3.6 **ブート・ボリューム** フィールド
    - **ブート・ボリューム・サイズ(GB)** ：GPUインスタンスの **ブート・ボリューム** サイズ
      - **カスタム・ブート・ボリューム・サイズを指定します** チェックボックスをチェックすると指定可能

      ![画面ショット](console_page09.png)

        ※ 通常GPUノードは、様々な機械学習用ソフトウェアやコンテナイメージを格納する必要があるため、少なくとも200 GBの **ブート・ボリューム** サイズとします。

4. 以下コマンドでGPUインスタンスにSSHログインします。この時、インストール時にデフォルトで作成されるユーザが **ubuntu** であることに留意します。  
なお、 **Canonical Ubuntu 20.04** イメージの **BM.GPU4.8** インスタンスの場合、作成開始からSSHでログインできるまでに30分程度かかります。

    ```sh
    $ ssh ubunsu@a100-ub204
    ```

***
# 2. NVIDIA Driver・NVIDIA CUDA・NVIDIA Fabric Managerインストール

## 2-0. 概要

本章は、デプロイしたGPUインスタンスに **NVIDIA Driver** 、 **NVIDIA CUDA** 、及び **NVIDIA Fabric Manager** をインストールし、インストールが正しく行われたかどうかを **CUDA Samples** を使用して確認します。

なお、本テクニカルTipsでのこれらソフトウェアのインストールは、 **Ubuntu** パッケージマネージャを使用します。

## 2-1. NVIDIA Driverインストール

本章は、GPUインスタンスに **NVIDIA Driver** をインストールします。

1. 以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **NVIDIA Driver** をインストールします。

    ```sh
    $ distribution=$(. /etc/os-release;echo $ID$VERSION_ID | sed -e 's/\.//g')
    $ wget https://developer.download.nvidia.com/compute/cuda/repos/$distribution/x86_64/cuda-keyring_1.0-1_all.deb
    $ sudo dpkg -i cuda-keyring_1.0-1_all.deb
    $ sudo apt-get update
    $ sudo apt-get -y install cuda-drivers --no-install-recommends
    ```

2. 以下コマンドをGPUインスタンスのubuntuユーザで実行し、OSを再起動します。  
この再起動は、起動後SSHログインできるまでに20分程度かかります。

    ```sh
    $ sudo shutdown -r now
    ```

## 2-2. NVIDIA CUDA・NVIDIA Fabric Managerインストール

本章は、GPUインスタンスに **NVIDIA CUDA** と **NVIDIA Fabric Manager** をインストールします。

1. 以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **NVIDIA CUDA** と **NVIDIA Fabric Manager** をインストールします。

    ```sh
    $ sudo apt-key del 7fa2af80
    $ distribution=$(. /etc/os-release;echo $ID$VERSION_ID | sed -e 's/\.//g')
    $ wget https://developer.download.nvidia.com/compute/cuda/repos/$distribution/x86_64/cuda-keyring_1.1-1_all.deb
    $ sudo dpkg -i cuda-keyring_1.1-1_all.deb
    $ sudo apt-get update
    $ sudo apt-get install -y cuda
    $ sudo apt-get install -y nvidia-gds
    $ sudo apt-get install -y cuda-drivers-fabricmanager-535
    $ sudo systemctl enable --now nvidia-fabricmanager
    ```

2. 以下コマンドをGPUインスタンスのubuntuユーザで実行し、OSを再起動します。  
この再起動は、起動後SSHログインできるまでに20分程度かかります。

    ```sh
    $ sudo shutdown -r now
    ```

## 2-3. CUDA Samples実行

本章は、ここまでのソフトウェアのインストールが正しく行われたかどうかを、 **CUDA Samples** を実行して確認します。

1. 以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **CUDA Samples** をインストールします。

    ```sh
    $ sudo apt-get install -y cmake
    $ echo "export PATH=/usr/local/cuda-12.2/bin\${PATH:+:\${PATH}}" | tee -a ~/.bash_profile
    $ source ~/.bash_profile
    $ git clone https://github.com/nvidia/cuda-samples
    $ cd cuda-samples
    $ make
    ```

2. 以下コマンドをGPUインスタンスのubuntuユーザで実行し、 **CUDA Samples** が正しく動作するかを確認します。  
この時、各サンプルプログラムの最後に出力される"Result"行が"PASS"となっていることで、正常動作を確認します。

    ```sh
    $ ./bin/x86_64/linux/release/deviceQuery
    :
    :
    deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 12.2, CUDA Runtime Version = 12.2, NumDevs = 8
    Result = PASS
    $ ./bin/x86_64/linux/release/bandwidthTest
    :
    :
    Result = PASS

    NOTE: The CUDA Samples are not meant for performance measurements. Results may vary when GPU Boost is enabled.
    $
    ```