---
title: "ファイル・ストレージでファイル共有ストレージを構築する"
excerpt: "ファイル・ストレージでファイル共有ストレージを構築してみましょう。このチュートリアルを終了すると、HPC/GPUクラスタから利用することが可能な高可用性ファイル共有ストレージを、OCIのマネージドNFSサービスであるファイル・ストレージを使用してOCIコンソールから構築することが出来るようになります。"
order: "1310"
layout: single
header:
  teaser: "/hpc/spinup-nfs-server-fss/architecture_diagram.png"
  overlay_image: "/hpc/spinup-nfs-server-fss/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

**ファイル・ストレージ** は、以下の特徴から高い可用性が要求されるHPC/GPUクラスタ向けのファイル共有ストレージとして最適な、マネージドNFSサービスです。

- ヘッドノードの **マウント・ターゲット** がHA構成となっていて高いサービス可用性を提供
- ストレージの **ファイル・システム** 内のデータが複製されていて高いデータ可用性を提供
- OCIコンソールからGUIでデプロイできるのため構築難易度が低い

OCIは、ブロックボリュームサービスである **ブロック・ボリューム** も提供しており、ベア・メタル・インスタンスと組み合わせることで **ファイル・ストレージ** よりもコストパフォーマンスの高いファイル共有ストレージを構築することが出来ますが、構築手順は圧倒的に **ファイル・ストレージ** が簡単です。  
**ファイル・ストレージ** とブロック・ボリュームNFSサーバの比較詳細は、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[コストパフォーマンスの良いファイル共有ストレージ構築方法](/ocitutorials/hpc/tech-knowhow/howto-configure-sharedstorage/)** を参照してください。

以上を踏まえて本チュートリアルは、 **ファイル・ストレージ** を使用するファイル共有ストレージを構築、ファイル共有クライアントとなる計算/GPUノードからこの領域をマウントするまでの手順を解説します。

![システム構成図](architecture_diagram.png)

**所要時間 :** 約30分

**前提条件 :** ファイル共有ストレージを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。

**注意 :** 本コンテンツ内の画面ショットは、現在のOCIコンソール画面と異なっている場合があります。

***
# 1. 事前作業

## 1-0. 概要

本章は、 **ファイル・ストレージ** と計算/GPUノードをTCP接続する **仮想クラウド・ネットワーク** と、通常インターネットから直接アクセス出来ないプライベートサブネットに接続する計算/GPUノードにログインする際の踏み台となるBastionノードを予め用意します。

## 1-1. 仮想クラウド・ネットワーク作成

本章は、 **ファイル・ストレージ** と計算/GPUノードをTCP接続する **仮想クラウド・ネットワーク** を作成します。  
 **仮想クラウド・ネットワーク** の作成は、 **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の **[その2 - クラウドに仮想ネットワーク(VCN)を作る](https://oracle-japan.github.io/ocitutorials/beginners/creating-vcn)** の手順通りに実行し、以下のリソースを作成します。

-  **仮想クラウド・ネットワーク**
- パブリックサブネット
- プライベートサブネット
- **インターネット・ゲートウェイ** （パブリックサブネットにアタッチ）
- **NATゲートウェイ** （プライベートサブネットにアタッチ）
- **サービス・ゲートウェイ** （プライベートサブネットにアタッチ）
- **ルート表** x 2（パブリックサブネットとプライベートサブネットにアタッチ）
- **セキュリティリスト** x 2（パブリックサブネットとプライベートサブネットにアタッチ）

この **仮想クラウド・ネットワーク** は、 **セキュリティリスト** で以下のアクセス制限が掛けられています。

- インターネットからのアクセス：パブリックサブネットに接続されるインスタンスの22番ポート（SSH）に限定
- インターネットへのアクセス：インターネット上の任意のIPアドレス・ポートに制限なくアクセス可能

## 1-2. Bastionノード作成

本章は、計算/GPUノードにログインする際の踏み台となるBastinノードを作成します。  
Bastionノードの作成は、 **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の  **[その3 - インスタンスを作成する](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance)** の手順を参考に、自身の要件に沿ったインスタンスを先の手順で **仮想クラウド・ネットワーク** を作成した **コンパートメント** とパブリックサブネットを指定して作成します。  
本チュートリアルは、以下属性のインスタンスをBastionノードとして作成します。

- **イメージ** ： **Oracle Linux** 8.9ベースのHPC **[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** （※1）
- **シェイプ** ： **VM.Optimized3.Flex** （任意のコア数・メモリ容量）
- **SSHキーの追加** ： Bastionノードにログインする際使用するSSH秘密鍵に対応する公開鍵

※1）**[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[クラスタネットワーキングイメージの選び方](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/)** の **[1. クラスタネットワーキングイメージ一覧](/ocitutorials/hpc/tech-knowhow/osimage-for-cluster/#1-クラスタネットワーキングイメージ一覧)** のイメージ **No.1** です。

次に、このBastionノード上でSSHの鍵ペアを作成します。このSSH鍵は、Bastionノードから計算/GPUノードにログインする際に使用します。  
先のチュートリアル **インスタンスを作成する** に記載のインスタンスへの接続方法に従い、BastionノードにopcユーザでSSHログインして以下コマンドでSSH鍵ペアを作成、作成された公開鍵を後の計算/GPUノード用インスタンス作成手順で指定します。

```sh
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/opc/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/opc/.ssh/id_rsa.
Your public key has been saved in /home/opc/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:2EvR7FXtEYAsDknJG1oREie1kv2r1PN3OYrYCP/Xlyg opc@bast
The keys randomart image is:
+---[RSA 2048]----+
|     +=*= . ..oo.|
|      *B.+ o . ..|
|     ooo* + .  ..|
|     ..+.+ .    .|
|      . S..      |
|       ....      |
|       o.+    o o|
|      . + *E.+ *.|
|       . +.=+.o o|
+----[SHA256]-----+
$ cat .ssh/id_rsa.pub 
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQD0TDo4QJPbXNRq/c5wrc+rGU/dLZdUziHPIQ7t/Wn+00rztZa/3eujw1DQvMsoUrJ+MHjE89fzZCkBS2t4KucqDfDqcrPuaKF3+LPBkgW0NdvytBcBP2J9zk15/O9tIVvsX8WBi8jgPGxnQMo4mQuwfvMh1zUF5dmvX3gXU3p+lH5akZa8sy/y16lupge7soN01cQLyZfsnH3BA7TKFyHxTe4MOSHnbv0r+6Cvyy7Url0RxCHpQhApA68KBIbfvhRHFg2WNtgggtVGWk+PGmTK7DTtYNaiwSfZkuqFdEQM1T6ofkELDruB5D1HgDi3z+mnWYlHMNHZU5GREH66acGJ opc@bast
$
```

次に、以降作成する計算/GPUノードの名前解決をインスタンス名で行うため、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[計算ノードの効果的な名前解決方法](/ocitutorials/hpc/tech-knowhow/compute-name-resolution/)** の手順を実施します。

***
# 2. HPC/GPUノード作成

本章は、ファイル共有ストレージのファイル共有クライアントとなるHPC/GPUノードを作成します。

この構築手順は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[HPCクラスタ](/ocitutorials/hpc/#1-1-hpcクラスタ)** カテゴリや **[機械学習環境](/ocitutorials/hpc/#1-2-機械学習環境)** カテゴリの各チュートリアルを参照してください。

***
# 3. ファイル共有ストレージ環境構築

本章は、 **ファイル・ストレージ** を利用し、ファイル共有ストレージ環境を構築します。

この構築手順は、 **[OCIチュートリアル](https://oracle-japan.github.io/ocitutorials/)** の  **[その6 - ファイルストレージサービス(FSS)で共有ネットワークボリュームを利用する](https://oracle-japan.github.io/ocitutorials/beginners/using-file-storage/)** を参照してください。

これで、このチュートリアルは終了です。