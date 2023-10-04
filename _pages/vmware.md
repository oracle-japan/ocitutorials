---
title: "VMwareソリューション編"
excerpt: "OCI上でVMware環境を利用できる Oracle Cloud VMware Solution (OCVS) について学習できるチュートリアルです"
permalink: /vmware/
layout: single
entries_layout: grid
show_excerpts: true
classes: wide
toc: true
date: "2023-10-04"
lastmod: "2023-10-04"
---

このページでは、Oracle Cloud VMware Solution (OCVS) に関連するチュートリアル、ガイド、ブログなどへのリンクをカテゴリ毎にまとめています。  
情報ソースとして、主に以下のサイトに掲載されている記事やエントリを定期的に収集して掲載しています。情報は各エントリの作成日時点のものになりますので、必ずしも現時点での最新の情報ではない点についてご注意ください。ほとんどの記事やエントリは、各ページに掲載日が記載されています。  
このページは掲載までにタイムラグがある可能性がありますので、最新情報については各掲載元のページも併せてをご確認ください。  

+ [Oracle Architecture Center](https://docs.oracle.com/solutions/?q=&cType=solution-playbook&product=Oracle%20Cloud%20VMware%20Solution&sort=date-desc&lang=en)
+ [Oracle BlogのOracle Cloud VMware Solution関連エントリ](https://blogs.oracle.com/cloud-infrastructure/search.html?contentType=Blog-Post&default=Oracle%20Cloud%20VMware%20Solution*)
+ [VMware Cloud Tech Zone - Oracle Cloud VMware Solution](https://vmc.techzone.vmware.com/oracle-cloud-vmware-solution)
+ [VMware BlogのOracle Cloud VMware Solution関連エントリ](https://blogs.vmware.com/?s=Oracle+Cloud+VMware+Solution)  


<!--
VMwareのハンズオンラボ
https://labs.hol.vmware.com/HOL/catalogs/lab/9582
-->

<!-- (未掲載)
- Oracle Cloud VMware Solution – Fault Domains
  https://thomasthyen.com/oracle-cloud-vmware-solution-fault-domains
  良記事、技術資料に取り込むべし

DNSの構成
https://vmc.techzone.vmware.com/resource/configure-conditional-dns-forwarding-between-oci-and-ad-domain#implementation
-->

## SDDC(Software Defined Data Center)の作成
<!--
Oracle Cloud VMwareソリューションの作成と構成(古い2021)
https://docs.oracle.com/ja/learn/create_configure_ocvs/index.html
-->

+ **[Oracle Cloud VMware Solutionを使い始める](https://docs.oracle.com/ja/learn/ocvs-get-started/index.html){:target="_blank"}**
    Oracle Cloud VMware Solutionを利用するための事前準備を行います。

+ **[Dense I/Oシェイプを使用したマルチホストOracle Cloud VMware Solution SDDCの作成](https://docs.oracle.com/ja/learn/ocvs-dense-shape/#introduction){:target="_blank"}**
    ESXiホストにDense I/Oシェイプを利用してSDDC(Software Defined Data Center)を作成します。  
    Dense I/Oシェイプは、ホスト内にSSD内蔵ディスクを搭載しており、そのディスクを利用してvSANデータストアを構成します。
    この手順では、OCIコンソールのウィザードを使い、3ノード以上のvSphereクラスタで構成されるSDDCを作成します。

+ **[Standardシェイプを使用したマルチホストOracle Cloud VMware Solution SDDCの作成](https://docs.oracle.com/ja/learn/ocvs-standard-shape/){:target="_blank"}**
    ESXiホストにStandardシェイプを利用してSDDC(Software Defined Data Center)を作成します。  
    Standardシェイプは、ホスト内にはSSD内蔵ディスクを搭載していないため、ブロック・ボリュームをホストにアタッチし、それをVMFSデータストアとして構成します。
    手順では、OCIコンソールのウィザードを使い、3ノード以上のvSphereクラスタで構成されるSDDCを作成します。


## 作成したSDDCへのアクセス
+ **[Oracle Cloud InfrastructureのOracle Cloud VMware Solution SDDCリソースへのアクセス](https://docs.oracle.com/ja/learn/ocvs-access-resources/index.html){:target="_blank"}**
    このチュートリアルは、OCI上にSDDCが構築済の状態からスタートします。  
    LinuxホストとWindowsジャンプ・ホストの2種類の踏み台サーバーをVCN内に構築し、それらの踏み台サーバーを経由してパブリック・インターネットからvCenterやNSX ManagerコンソールなどのSDDCリソースにアクセスにアクセスする方法を説明します。  

<!--
+ **[Accessing Oracle Cloud VMware Solution from the Internet](https://blogs.vmware.com/cloud/2022/06/29/accessing-ocvs-from-the-internet/
 
+ https://blogs.vmware.com/cloud/2021/12/07/accessing-the-internet-from-oracle-cloud-vmware-solution/

その他のシナリオ候補
1. Bastion経由のプロキシアクセス/Windows Server RDPを経由(P1)
2. 各種コンソール接続vCenter(P1)
3. NSX(P1)
4. ESXiホストへのssh(P1)
5. ホストコンソール(P1)
6. シリアルコンソール接続 (P3)
-->

<!--
## 仮想マシン管理
1. 仮想マシン作成 (P2)
2. vMotion (P2)
-->

## SDDCから外部ネットワークへの接続の構成
+ **[Solution Playbook : Oracle CloudおよびVMwareリソースへの接続について学ぶ](https://docs.oracle.com/ja/solutions/connect-oraclecloud-vmware-resources/index.html){:target="_blank"}**
    Oracle Cloud VMware Solutionでは、VMwareリソースはOCI内の顧客テナンシのVCN上にデプロイされます。ユーザーは、VCNにアクセスするのと同様な方法を使用してこれらのリソースにアクセスできます。  
    このソリューション・プレイブックでは、SDDCへの接続に関する様々なアプローチ、それぞれの利点、それぞれの制限およびその開始方法をカバーしています。  

<!--
その他のシナリオ候補
1. VCNとの連携 (P1)
2. FastConnect/VPN経由のオンプレ連携 (P3)
3. サービス・ゲートウェイ経由でObjet Storageの連携(Email、Autonomous Database、Oracle Cloudの (P1)
4. インターネットへの接続 (P1)
-->

## ストレージの管理
+ **[OCI Block VolumesをOracle Cloud VMware Solutionと統合](https://docs.oracle.com/ja/learn/integrate-oci-block-volumes-ocvs/index.html){:target="_blank"}**
    OCVSからOCIブロック・ボリュームをVMFSデータストアとして利用するためのチュートリアルです。  
    ブロック・ボリュームを作成、iSCSI で ESXi ホストにアタッチします。それをvSphereからVMFSデータストアとして利用できるように構成します。  

+ **[Blog記事 : OCI File Storage service is now VMware certified (英語)](https://blogs.oracle.com/cloud-infrastructure/post/oci-fss-service-is-now-vmware-certified){:target="_blank"}**
    OCVS から OCI ファイル・ストレージ・サービス (FSS) を NFS データストアとして利用することに関するブログ記事です。  
    コンセプトの説明から、スクリーンショットを交えた構築方法まで解説しています。  

+ **[Oracle Cloud VMware SolutionとのVMware vSANファイル共有の構成](https://docs.oracle.com/ja/learn/config-ocvs-vsan-file-share/index.html#architecture-overview){:target="_blank"}**
    ESXiホストにDense I/Oシェイプを用いる場合、ホスト内蔵のNVMe SSD ディスクを使ってvSANデータストアが初期状態で構成されており、仮想マシンなどの配置場所として利用することができます。   
    このチュートリアルでは、この構成済みのvSANデータストア内に VMware vSAN File Serviceを構成し、OCVS SDDC上の仮想マシンにNFS、CIFSなどのファイル共有機能を提供する方法について解説しています。

<!--
vSAN
- Oracle Cloud VMware Solution – vSAN sizing & scaling
  https://thomasthyen.com/oracle-cloud-vmware-solution-vsan-sizing-scaling
	- 良記事、技術資料に取り込むべし、あとセミナーひとつ作れそう
- (参考) Blog : Oracle Cloud VMware Solution vSAN sizing and scaling
  https://blogs.oracle.com/cloud-infrastructure/post/ocvs-sizing-scaling
- (参考) Blog : Know your storage options and designs with Oracle Cloud VMware Solution
  https://blogs.oracle.com/cloud-infrastructure/post/storage-designs-oracle-cloud-vmware-solution
- WSFCをvSANで組む方法
  https://core.vmware.com/resource/sql-server-failover-cluster-instance-vmware-vsan-native#sec8213-sub1
-->

## ESXiホストの管理
+ **[Oracle Cloud VMwareソリューションへのESXiホストの追加](https://docs.oracle.com/ja/learn/add_esxi_vmware_solution/index.html){:target="_blank"}**
    このチュートリアルは、Oracle Cloud VMware SolutionのクラスタにESXiホストを追加するためのステップバイステップ・ガイドです。　　
    ESXiホストの追加は、OCIコンソール上でベアメタル・サーバーを追加する作業と、vCenterおよびNSXマネージャのコンソール上で、vSphere、vSAN、NSXの各クラスタにESXiホストを追加する作業から成ります。このガイドではこの2つの作業について解説しています。  
    ※本ガイドはvSphere 7.0u1および7.0u2で有効です。vSphere 7.0u3およびvSphere 8では一部作業に非互換な箇所があります。  

+ **[Oracle Cloud VMwareソリューションからのESXiホストの削除](https://docs.oracle.com/ja/learn/ocvs_delete_host/index.html){:target="_blank"}**
    このチュートリアルは、Oracle Cloud VMware SolutionのクラスタからにESXiホストを削除するためのステップバイステップ・ガイドです。　　
    ESXiホストの削除は、vCenterおよびNSXマネージャのコンソール上でvSphere、vSAN、NSXの各クラスタからESXiホストを削除する作業と、その後OCIコンソール上でベアメタル・サーバーをSDDCから削除する作業から成ります。このガイドではこの2つの作業について解説しています。  
    ※本ガイドはvSphere 7.0u1および7.0u2で有効です。vSphere 7.0u3およびvSphere 8では一部作業に非互換な箇所があります。  

<!--
その他のシナリオ候補
ホストリプレース (P1)
-->

## 高度なネットワークの構成
<!--
+ **[Oracle Cloud VMware Solution – Networking Reference Architecture](https://blogs.vmware.com/cloud/2021/04/28/oracle-cloud-vmware-solution-networking-reference-architecture/){:target="_blank"}**
-->

+ **[A Detailed Guide to Deploy a DMZ on NSX-T for Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/a-detailed-guide-to-deploy-a-dmz-on-nsx-t-for-oracle-cloud-vmware-solution){:target="_blank"}**

+ **[Achieve multitenancy within Oracle Cloud VMware Solution using VRF gateways in NSX-T](https://blogs.oracle.com/cloud-infrastructure/post/achieve-multitenancy-within-oracle-cloud-vmware-solution-using-vrf){:target="_blank"}**

+ **[Learn How to Attach a Public IP to a Guest VM in Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/learn-how-attach-a-public-ip-guest-vm-oracle-cloud-vmware-solution){:target="_blank"}**

+ **[Creating VLAN-Backed Port Groups in Oracle Cloud VMware Solution](https://blogs.vmware.com/cloud/2021/05/28/vlan-backed-port-groups-oracle-cloud-vmware-solution/){:target="_blank"}**

<!--
その他のシナリオ候補
1. 新規VLANを利用したVLAN-backedセグメントの追加し、VCN内のサービスと低レイテンシで接続(VLAN作成、ESXiへのvNIC追加) (P3)
2. 新規VLANを利用したオーバーレイ・セグメントの追加(VLAN作成、ESXiへのvNIC追加、外部アクセスIPの設定) (P3)
3. インターネットから仮想マシンにアクセス (P3)
4. OCIのFLBを経由してvSphereの仮想マシンをロードバランス (P3)
   Oracle Cloud VMware SolutionアプリケーションのOCIロード・バランシングの構成
   https://docs.oracle.com/ja/learn/oci-load-balancer-vmware/index.html
5. OCIのNetwork Firewallを経由してインターネットとの境界にファイアウォールを設置 (P3)
6. VMware NSX-TオーバーレイでのOracle Cloud VMWare Solution SDDCワークロードのパブリックDNSの構成
   https://docs.oracle.com/ja/learn/configure_dns_vmware_nxstoverlay/index.html
7. Oracle Cloud VMware Solution 6.xから7.xへのインプレース・アップグレードの実行
   https://docs.oracle.com/ja/learn/ocvs-inplace-upgrade-6x-7x/index.html
-->


## 監視
+ **[OCI通知をOracle Cloud VMwareソリューションと統合](https://docs.oracle.com/ja/learn/oci-notifications-vmware-solution/index.html){:target="_blank"}**
    OCIの通知(Notification)サービスを経由して、Oracle Cloud VMware Solutionから通知を送信するためのリファレンス・ソリューションです。このソリューションにより、インフラストラクチャの更新およびDevOps関連の通知を電子メールやSMSなどで受信できます。
    OCI通知サービスは可用性が高く、低レイテンシのパブリッシュおよびサブスクライブ・サービスで、電子メール、SlackおよびPagerDutyで通知を簡単に受信できます。OCI通知サービスでは、軽量データ処理のためのOracle Functionsのトリガーもサポートしています。  
    OCI通知サービスを使用して、問題がOracle Cloud VMware Solutionで検出されるたびに通知を送信します。ESXiベアメタル・インスタンスの障害に対してトリガーされるアラームを作成することもできます。  

<!-->
- vCenter監視
- ホスト監視
-->

<!-->
##DR
- Oracle Cloud VMware Solution – Disaster Recovery
  https://thomasthyen.com/oracle-cloud-vmware-solution-disaster-recovery
  めっちゃいい記事、これだけでセミナーひとつ作れそう
- (参考)Blog : Disaster recovery to Oracle Cloud VMware Solution
  https://blogs.oracle.com/cloud-infrastructure/post/disaster-recovery-to-ocvs
-->

## VMware HCX (Hybrid Cloud Extention) の利用
+ **[Oracle Cloud VMware Solutionを使用したVMware HCXの構成](https://docs.oracle.com/ja/learn/oci-ocvs-hcx/index.html){:target="_blank"}**
    Oracle Cloud VMware Solutionは、VMware HCX Advancedライセンスが同梱されており、また追加でVMware HCX Enterpriseライセンスも提供しています。VMware HCXは、アプリケーションの移行を簡素化し、ワークロードをリバランスし、データ・センターとクラウド間のディザスタ・リカバリを最適化するために設計されたアプリケーション・モビリティ・プラットフォームであるソフトウェア・スイートです。  
    このチュートリアルでは、Oracle Cloud VMware Solutionの導入概要、VMware HCXの概要、実装に必要な前提条件、および段階的な導入ガイドラインについて説明します。  

<!--
- Solution Playbook : オンプレミスVMwareワークロードをクラウドに移行します
  https://docs.oracle.com/ja/solutions/migrate-vmware-workloads-oraclecloud/
- Solution Playbook : オンプレミスSDDCとクラウド間のハイブリッドOCVS SDDCの設定について
  https://docs.oracle.com/ja/solutions/hybrid-ocvs-sddc-onprem-sddc-cloud/
- Blog : Set Up a Hybrid Cloud with Oracle Cloud VMware Solution
  https://blogs.oracle.com/cloud-infrastructure/post/set-up-a-hybrid-cloud-with-oracle-cloud-vmware-solution
- Blog : Migrate VMware workloads from on-premises data centers to Oracle Cloud VMware Solution using VMware HCX
  https://blogs.oracle.com/cloud-infrastructure/post/migrate-vmware-workloads-from-on-premises-data-centers-to-oracle-cloud-vmware-solution-using-vmware-hcx
- Blog : Deploy VMware HCX Connector in your on-premises VMware environment and establish a site pairing with Oracle Cloud VMware Solution
  https://blogs.oracle.com/cloud-infrastructure/post/deploy-vmware-hcx-connector-in-your-on-premises-vmware-environment-and-establish-a-site-pairing-with-oracle-cloud-vmware-solution
- Blog : Announcing VMware HCX Enterprise for Oracle Cloud VMware Solution
  https://blogs.oracle.com/cloud-infrastructure/post/announcing-vmware-hcx-enterprise-for-oracle-cloud-vmware-solution
-->

## VMware Horizon の利用
+ **[Oracle Cloud VMwareソリューションにVMware Horizonをインストールおよび構成](https://docs.oracle.com/ja/learn/horizon_on_ocvs/index.html){:target="_blank"}**
    このチュートリアルでは、Oracle Cloud VMware SolutionでVMware Hizon 8.xをインストールして構成する方法を示します。このチュートリアルではvSphere 7.0デプロイメントを使用しましたが、vSphere 6.7に関連するステップについても説明します。

+ **[Horizon on Oracle Cloud VMware Solution Configuration(英語のチュートリアル)](https://techzone.vmware.com/resource/horizon-oracle-cloud-vmware-solution-configuration){:target="_blank"}**

+ **[Unified Access GatewayおよびOCI IAMアイデンティティ・ドメインでのVMware Horizonに対するSAML 2.0認証の有効化](https://docs.oracle.com/ja/learn/vmware-uag-oci-identity-domains/){:target="_blank"}**
    VMware Horizonは、オンプレミスからクラウドに仮想デスクトップとアプリケーションを効率的かつ安全に配信できるよう支援しています。このチュートリアルでは、Oracle Cloud Infrastructure (OCI) Identity and Access Management (IAM)アイデンティティ・ドメインをSAMLアイデンティティ・プロバイダ(IdP)としてのVMware Unified Access GatewayTMとの統合として構成し、VMware Horizon仮想デスクトップおよびアプリケーションにアクセスする方法について説明します。

+ **[(参考)Blog : Oracle Cloud VMware SolutionのVMware Horizon検証設計](https://blogs.oracle.com/oracle4engineer/post/ja-vmware-horizon-validated-design){:target="_blank"}**

+ **[(参考)VMware Horizon on Oracle Cloud VMware Solution (OCVS) Support (88202)](https://kb.vmware.com/s/article/88202){:target="_blank"}**


<!--
vRealize
- Oracle Cloud VMwareソリューションを使用したVMware vRealize操作8.xの構成
  https://docs.oracle.com/ja/learn/configure-vrealize-vmware-solution/index.html
- Oracle Cloud VMwareソリューションを使用したVMware vRealize®ログInsightTM 8.xの構成
  https://docs.oracle.com/ja/learn/oci-vmware-log/index.html

Cloud Director
- (参考Blog) Oracle Cloud VMware SolutionのVMware Cloud Directorサービスの発表
  https://blogs.oracle.com/oracle4engineer/post/ja-ann-the-vmware-cloud-director-service
  https://blogs.oracle.com/cloud-infrastructure/post/announcing-the-vmware-cloud-director-service

Rackware
- Oracle Cloud VMware SolutionでRackWare®を使用してディザスタ・リカバリを構成
  https://docs.oracle.com/en/learn/oci-ocvs-dr-rw/index.html
- ディザスタ・リカバリの構成- Oracle Cloud VMware SolutionでRackWare®を使用するコールド・スタンバイ
  https://docs.oracle.com/ja/learn/oci-ocvs-dr-cs-rw/index.html

Veeam
- OCI Object Storage is certified as Veeam Ready - Object
  https://blogs.oracle.com/cloud-infrastructure/post/veeam-ready-qualification-oci-object-storage

Entrust KeyControl
- Oracle Cloud VMwareソリューションを使用したEntrust KeyControl 5.4の構成
  https://docs.oracle.com/ja/learn/oci-vmware-entrust-config/index.html
- Entrust KeyControlおよびVMware vSphereを使用して、仮想マシンをOracle Cloud VMwareソリューションで暗号化
  https://docs.oracle.com/ja/learn/oci-vmware-vm-encrypt/index.html
- Entrust KeyControlをOracle Cloud VMwareソリューションとのVMware vSphere 7のキー・プロバイダとして追加
  https://docs.oracle.com/ja/learn/oci-vmware-entrust-key-provider/index.html

その他
- Oracle Cloud VMware SolutionでActive DirectoryをVMware vCenterと統合
  https://docs.oracle.com/ja/learn/integrate-ad-with-vcenter/index.html
- Oracle Cloud VMware SolutionでActive DirectoryをVMware NSX- Tと統合
  https://docs.oracle.com/ja/learn/integrate-ad-with-nsx-t/index.html#prerequisites
- Solution Playbook : CloudでのVMware SDDCの障害からの保護について
  https://docs.oracle.com/ja/solutions/implement-dr-for-ocvs/
- Oracle Cloud VMware Solutionによるデータ保護のためのOCIセキュリティ・サービスの使用
  https://docs.oracle.com/ja/solutions/oci-security-ocvs/

セキュリティ
- Securely access Oracle Cloud VMware Solution using OCI Bastion service
  https://blogs.oracle.com/cloud-infrastructure/post/securely-access-oracle-cloud-vmware-solution-using-oci-bastion-service
- Document : VMwareソリューションの保護
  https://docs.oracle.com/ja-jp/iaas/Content/Security/Reference/vmware_security.htm
-->