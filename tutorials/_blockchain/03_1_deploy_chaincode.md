---
title: "Chaincodeをデプロイする"
excerpt: "この文書ではOracle Blockchain Platform（OBP）でChaincodeをデプロイし、実行可能にする方法を説明します。"
order: "021"
layout: single
tags: "Blockchain"
header:
  teaser: "/blockchain/03_1_deploy_chaincode/instantiate_cc_input.png"
  overlay_image: "/blockchain/03_1_deploy_chaincode/instantiate_cc_input.png"
  overlay_filter: rgba(80,80,80,0.7)
---

この文書ではOracle Blockchain Platform（OBP）でChaincodeをデプロイし、実行可能にする方法をステップ・バイ・ステップで紹介するチュートリアルです。

```
この文書は、2021年8月時点での最新バージョン(21.2.1)を元に作成されています。
```

- **前提 :**

  - [Oracle Blockchain Platform のインスタンス作成](../01_1_create_instance/)を完了
  - [Channelの作成](../02_1_create_channel/)を完了

<br>
<br>

# 0. 前提の理解

## 0.1 Hyperledger Fabric（v1.x系）におけるChaincodeのデプロイ

OBPはパーミッション型のブロックチェーンプロトコルであるHyperledger Fabricをベースとしたブロックチェーンプラットフォームです。

Hyperledger Fabric（v1.x系）では、ブロックチェーン台帳に対して実行されるビジネスロジックであるChaincodeのデプロイは、**①各Organizationの作業として、Endorsementを行うPeerへのChaincodeのインストール**、**②Channelレベルの作業として、代表する単一のOrganizationがChaincodeをインスタンス化（instantiate）**、の2段階のオペレーションによって実施され、Chaincodeが実行可能になります。

## 0.2 このチュートリアルでのブロックチェーン・ネットワーク構成

このチュートリアルの例では、 _Founder2104_ というFounderインスタンス（=Organization）と、 _Member2104_ というParticipantインスタンス（=Organization）から成るブロックチェーン・ネットワークとなっています。また、ch1という名前のChannelに、サンプルChaincodeをデプロイします。

任意のChannelで任意のChaincodeを、また、単一のインスタンス／Organizationから成るネットワークでも基本的には同一の手順でデプロイできます。

# 1.サンプルChaincodeの準備

デプロイするサンプルChaincodeをダウンロードし、必要なZipファイルを準備します。

1. Oracle Blockchain Platformのサービス・コンソールを開きます。

1. **Developer Tools**のページを開き、左側メニューから**Samples**のセクションを選択し、「Balance Transfer」のコーナーからDownload Samples **here**をクリックするとインストーラがダウンロードされます。

    ![サンプルChaincodeのダウンロード](download_sample_cc.png)

1. ダウンロードしたサンプルChaincodeのZIPファイルをunzip（解凍）します。

1. サンプルにはGoとNode.js両方のChaincode、およびその他のマテリアルが含まれています。デプロイには、GoのChaincodeソースだけを含んだZIPファイルを作成する必要があります。<br>
`/artifacts/src/github.com配下にあるgoフォルダ`をZIPファイルに圧縮してください。ZIPファイル名は任意ですが、ここでの例ではBT_Sample.zipとしています。

    ![ZIPするフォルダ](zip_target_folder.png)

# 2.Chaincodeのインストール

デプロイするChaincodeをPeerノードにインストールします。この手順については各Organization（=インスタンス）での作業が必要ですが、手順は同一なのでここでは_Founder2104_インスタンスでのステップのみを説明します。必要に応じて複数インスタンスで実施してください。

1. Oracle Blockchain Platformのサービス・コンソールを開きます。

1. **Chaincodes**のページを開き、**Deploy a New Chaincode**をクリックします。

    ![Deploy a New Chaincode](deploy_cc.png)

1. 開いたウィザードで、**Advanced Deployment**をクリックします。

    ![Advanced Deployment](deploy_cc_advance.png)

1. インストールするChaincodeの情報を入力する画面が開きます。以下を参考に入力、指定した後、**Next**をクリックします。

    ![Install Chaincode](deploy_cc_install.png)

    - **Chaincode Name:** Chaincodeの名前を入力します。ここでは _BT-Sample_ とします。
    - **Version:** Chaincodeのバージョン識別子を入力します。ここではデフォルトの _v1_ とします。
    - **Target Peers:** ChaincodeをインストールするPeerノードを選択します。ここでは _Peer0とPeer1_ としています。
    - **Chaincode Source:** Chaincodeのソースを含むZipファイルをアップロードします。ここでは前述の手順で作成しておいたBT_Sample.zipを指定します。

1. Chaincodeのインストールが成功すると、成功メッセージが表示されるとともに、Instantiateの画面に遷移します。この画面から続けてInstantiateを実施することも可能ですが、このチュートリアルでは後で別途実施することとします。**Close**をクリックします。

    ![Install Chaincode Success](deploy_cc_install_success.png)

1. ここまででChaincodeのインストールは完了です。Chaincodeのインストールを複数インスタンスで実施する場合は、別のインスタンスでここまでの手順を繰り返してください。**なお、その際にはChaincode NameとVersionの指定値がインスタンス間で食い違わないよう、同一の値を指定してください**。

# 3.ChaincodeのInstantiate

インストールしたChaincodeをChannel上でInstantiate（インスタンス化）し、実行可能にします。複数インスタンス（＝Organization）のネットワークの場合でも、この手順についてはいずれか代表する単一のインスタンスのみで実行します。

1. Oracle Blockchain Platformのサービス・コンソールを開きます。

1. **Chaincodes**のページを開き、一覧から対象のChaincodeの行の左側にある**三角ボタン**をクリックします。当該Chaincodeのバージョン一覧が開くので、Instantiateする対象のバージョンの行の右側にある**ハンバーガーメニューボタン**をクリックし、出てきたメニューから**Instantiate**をクリックします。

    ![Instantiate a Chaincode](instantiate_cc.png)

1. ChaincodeのInstantiateにあたってのパラメータを入力する画面が開きます。以下を参考に入力、指定した後、**Instantiate**をクリックします。

    ![Instantiate Parameters](instantiate_cc_input.png)

    - **Channel:** Chaincodeを稼働させるChannelを選択します。ここでは _ch1_ とします。
    - **Peers:** 当該Channelで当該Chaincodeの実行（Endorsement）可能にするPeerノードを指定します。ここでは _Peer0とPeer1_ としています。
    - **Initial Parameter:** ChaincodeにInstantiate時に実行される関数（`init()`関数）に渡す引数を指定します。ここでは `["a","100","b","200"]` としています。
    - **Endorsement Policy:** ChaincodeレベルのEndorsement Policyを指定します。ここでは何も指定しないでおきます（指定しない場合、任意、単一のOrganizationのEndorsementでPolicyが満たせる条件になります）。
    - **Transient Map:** ChaincodeでTransient Mapを使用する場合に指定します。ここでは何も指定しないでおきます。
    - **Private Data Collection:** ChaincodeでTransient Mapを使用する場合に指定します。ここでは何も指定しないでおきます。

1. Instantiateのトランザクションが発行されます。実際にInstantiateが完了するまでには1～数分程度要します。

1. Instantiateのトランザクションの実行が完了すると、サービス・コンソール上部の通知欄に通知されます。クリックすると成功／失敗メッセージが表示されます。成功メッセージが出ていればInstantiateは完了です。

    ![Instantiate Success](instantiate_cc_success.png)

<br>

以上でこのチュートリアルは終了です。

# 3. 参考リンク

- [Oracle Blockchain Platform公式ドキュメントのChaincodeデプロイの箇所](https://docs.oracle.com/en/cloud/paas/blockchain-cloud/usingoci/deploy-and-manage-chaincodes.html)