---
title: "Oracle Cloud VMware Solution編"
excerpt: "OCI上でVMwareの仮想化環境を利用できる Oracle Cloud VMware Solution (OCVS) 関連のチュートリアル、ガイド、ブログなどへのリンク集です"
permalink: /vmware/
layout: single
tags: "vmware"
show_excerpts: true
toc: true
date: "2023-10-04"
lastmod: "2023-10-04"
---

Oracle Cloud VMware Solution(OCVS)は、Oracle Cloud Infrastructure(OCI)上でVMwareの仮想化基盤を利用することができるクラウドサービスです。OCIネイティブサービス群と同様に顧客テナンシのVCN上のベアメタル・インスタンスに直接デプロイされるため、ESXi、vCenterなどVMware製品の使い勝手はそのままに、OCIが備える高性能なコンピュート、低遅延のネットワーク、耐久性のあるブロック・ボリュームなどを活用し、オンプレミスVMware環境の移行先やL2延伸によるリソース拡張先としてOCIを利用することができます。

このページは、Oracle Cloud VMware Solution (OCVS) 関連のチュートリアル、ガイド、ブログなどへのリンク集で、情報ソースとして下記サイトを利用しています。情報は各エントリの作成日時点のため、必ずしも最新情報ではない点についてご注意ください。ほとんどの記事やエントリには掲載日が記載されています。  
一部のリンクは、Oracle、VMwareいずれの公式ページとも関係のない、外部のブログ記事などを含んでいる場合があります。外部リンク記事の掲載内容に関してOracle社、VMware社へのお問い合わせはご遠慮ください。

+ [Oracle Architecture Center](https://docs.oracle.com/solutions/?product=Oracle%20Cloud%20VMware%20Solution&sort=date-desc&lang=en)
+ [Oracle Help Center Learn](https://docs.oracle.com/learn/?product=en%2Fcloud%2Foracle-cloud-infrastructure%2Fvmware-solution&sort=date-desc&lang=en)
+ [Oracle Blog](https://blogs.oracle.com/cloud-infrastructure/search.html?contentType=Blog-Post&default=Oracle%20Cloud%20VMware%20Solution*)
+ [VMware Cloud Tech Zone](https://vmc.techzone.vmware.com/oracle-cloud-vmware-solution)
+ [VMware Blog](https://blogs.vmware.com/?s=Oracle+Cloud+VMware+Solution)  

OCVSは、OCIの無償環境[Oracle Cloud Free Tier](https://www.oracle.com/jp/cloud/free/){:target="_blank"}では利用することができませんが、VMware社のオンライン・[ハンズオンラボ](#ハンズオンラボ)を使うことで、このページのシナリオの一部を試すことができます。OCIの商用契約をお持ちの場合には、全てのシナリオを試すことができます。  
もしOCVSの試用やPoC(Proof of Concept)などをご希望の場合は、日本オラクルの営業担当者(担当者が分からない場合は[こちら](https://www.oracle.com/jp/corporate/contact/){:target="_blank"})までお問い合わせください。

<!-- (未掲載)
- Oracle Cloud VMware Solution – Fault Domains
  https://thomasthyen.com/oracle-cloud-vmware-solution-fault-domains
  良記事、技術資料に取り込むべし

  Oracle Cloud VMware Solution deployment options
  https://blogs.oracle.com/cloud-infrastructure/post/oracle-cloud-vmware-solution-deployment-options

  クラウドに高可用性のVMwareベースのSDDCをデプロイします
  https://docs.oracle.com/ja/solutions/deploy-vmware-sddc-oci/explore-more-solutions.html#GUID-913C6EA5-6AB9-45DF-B7B4-DAFAF7E2AAB9
-->


## Oracle Cloud VMware Solution (OCVS) の理解

+ **[Oracle Cloud VMware Solution のご紹介](https://blogs.vmware.com/vmware-japan/2021/09/1-oracle-cloud-vmware-solution.html){:target="_blank"}**  
リンク先は、Oracle Cloud VMware Solution(OCVS)サービスとその特徴について解説したブログエントリです。チュートリアルではありませんが、実際に手を動かす前にOCVSの概要を掴むのにちょうどいい読み物になっています。

<!--
Ebook : Getting Started with Oracle Cloud VMware Solution
https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/docs/vmw-getting-started-with-oracle-cloud-vmware-solution-ebook.pdf
-->

## ハンズオンラボ

+ **[VMware Hands-on Labs](https://labs.hol.vmware.com/HOL/catalogs/lab/9582){:target="_blank"}**  
VMware社によるOracle Cloud VMware Solution(OCVS) のハンズオンラボのサイトです。OCVSをオンラインで触って確認することができるシナリオが用意されており、無料で利用することができます。OCVSをまずは触ってみたいという場合のスタート地点として最適です。  
利用にあたっては、VMware社のサイトへのユーザー登録が必要です。  


## SDDC(Software Defined Data Center)の作成

+ **[Oracle Cloud VMware Solutionを使い始める](https://docs.oracle.com/ja/learn/ocvs-get-started/index.html){:target="_blank"}**  
Oracle Cloud VMware Solutionを利用するための事前準備を行います。

<!-- 手順が古い(2021)ためObsolete
+ **[Oracle Cloud VMwareソリューションの作成と構成](https://docs.oracle.com/ja/learn/create_configure_ocvs/index.html){:target="_blank"}**  
Oracle Cloud VMware Solutionを利用するための事前準備を行います。
-->

+ **[Dense I/Oシェイプを使用したマルチホストOracle Cloud VMware Solution SDDCの作成](https://docs.oracle.com/ja/learn/ocvs-dense-shape/#introduction){:target="_blank"}**  
ESXiホストにDense I/Oシェイプを利用してSDDC(Software Defined Data Center)を作成します。Dense I/Oシェイプは、ホスト内にSSD内蔵ディスクを搭載しており、そのディスクを利用してvSANデータストアを構成します。この手順では、OCIコンソールのウィザードを使い、3ノード以上のvSphereクラスタで構成されるSDDCを作成します。

+ **[Standardシェイプを使用したマルチホストOracle Cloud VMware Solution SDDCの作成](https://docs.oracle.com/ja/learn/ocvs-standard-shape/){:target="_blank"}**  
ESXiホストにStandardシェイプを利用してSDDC(Software Defined Data Center)を作成します。Standardシェイプは、ホスト内にはSSD内蔵ディスクを搭載していないため、ブロック・ボリュームをホストにアタッチし、それをVMFSデータストアとして構成します。手順では、OCIコンソールのウィザードを使い、3ノード以上のvSphereクラスタで構成されるSDDCを作成します。


## SDDCへのアクセス

+ **[Oracle Cloud InfrastructureのOracle Cloud VMware Solution SDDCリソースへのアクセス](https://docs.oracle.com/ja/learn/ocvs-access-resources/index.html){:target="_blank"}**    
このチュートリアルは、OCI上にSDDCが構築済の状態からスタートします。LinuxホストとWindowsジャンプ・ホストの2種類の踏み台サーバーをVCN内に構築し、それらの踏み台サーバーを経由してパブリック・インターネットからvCenterやNSX ManagerコンソールなどのSDDCリソースにアクセスにアクセスする方法を説明します。  

+ **[Securely access Oracle Cloud VMware Solution using OCI Bastion service](https://blogs.oracle.com/cloud-infrastructure/post/securely-access-oracle-cloud-vmware-solution-using-oci-bastion-service){:target="_blank"}**    

<!-- その他のシナリオ候補
- ESXiホストへのssh(P1)
- ホストコンソール(P1)
- シリアルコンソール接続 (P3)
-->


## 外部ネットワークとの接続
+ **[Solution Playbook : Oracle CloudおよびVMwareリソースへの接続について学ぶ](https://docs.oracle.com/ja/solutions/connect-oraclecloud-vmware-resources/index.html){:target="_blank"}**  
Oracle Cloud VMware Solutionでは、VMwareリソースはOCI内の顧客テナンシのVCN上にデプロイされます。ユーザーは、通常のOCIのVCNにアクセスするのと同様な方法を使用してこれらのVMwareリソースにアクセスできます。このソリューション・プレイブックでは、OCVS SDDCへの接続に関する様々なアプローチ、それぞれの利点、それぞれの制限およびその開始方法をカバーしています。  

+ **[Accessing the Internet from Oracle Cloud VMware Solution](https://blogs.vmware.com/cloud/2021/12/07/accessing-the-internet-from-oracle-cloud-vmware-solution/){:target="_blank"}(英語)**
このブログ記事では、OCVS上に構築した仮想マシンからインターネットへのアクセスを構成する方法について解説しています。VCNにNATゲートウェイを追加し、Tier-0ゲートウェイのアップリンクに対してNATゲートウェイ経由でのインターネットへの経路を追加します。これによりインターネットへのアウトバウンドアクセスが可能になります。

+ **[Accessing Oracle Cloud VMware Solution from the Internet](https://blogs.vmware.com/cloud/2022/06/29/accessing-ocvs-from-the-internet/){:target="_blank"}(英語)**
このブログ記事は、上記 Accessing the Internet from Oracle Cloud VMware Solution](https://blogs.vmware.com/cloud/2021/12/07/accessing-the-internet-from-oracle-cloud-vmware-solution/) とセットです。今度は逆に、インターネット側からのアクセスをOCVS上の仮想マシンにルーティングする方法について解説しています。

+ **[Learn How to Attach a Public IP to a Guest VM in Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/learn-how-attach-a-public-ip-guest-vm-oracle-cloud-vmware-solution){:target="_blank"}(英語)**
こちらのブログ記事もインターネット側からのアクセスをOCVS上の仮想マシンにルーティングする方法について解説したものです。上記記事と合わせてご覧ください。

+ **[Designlet: Connectivity with Private FastConnect Peering on Oracle Cloud VMware Solution](https://vmc.techzone.vmware.com/resource/designlet-connectivity-private-fastconnect-peering-oracle-cloud-vmware-solution){:target="_blank"}**

<!-- その他のシナリオ候補
1. VCNとの連携 (P1)
2. FastConnect/VPN経由のオンプレ連携 (P3)
3. サービス・ゲートウェイ経由でObjet Storageの連携(Email、Autonomous Database、Oracle Cloudの (P1)
-->


## ストレージの管理

+ **[Know your storage options and designs with Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/storage-designs-oracle-cloud-vmware-solution){:target="_blank"}(英語)**  
このブログ記事では、Oracle Cloud VMware Solution (OCVS) で利用することができる様々なストレージサービスに関して、種類、利点、制限や使い方などについて整理しています。  
※本ブログ記事はチュートリアルではありません

+ **[OCI Block VolumesをOracle Cloud VMware Solutionと統合](https://docs.oracle.com/ja/learn/integrate-oci-block-volumes-ocvs/index.html){:target="_blank"}**  
OCVSからOCIブロック・ボリュームをVMFSデータストアとして利用するためのチュートリアルです。ブロック・ボリュームを作成、iSCSI で ESXi ホストにアタッチし、それをvSphereからVMFSデータストアとして利用できるように構成します。  

+ **[Designlet: Create iSCSI VMFS Datastore using Oracle Cloud Block Storage Volume](https://vmc.techzone.vmware.com/resource/designlet-create-iscsi-vmfs-datastore-using-oracle-cloud-block-storage-volume){:target="_blank"}**  

+ **[OCI File Storage service is now VMware certified](https://blogs.oracle.com/cloud-infrastructure/post/oci-fss-service-is-now-vmware-certified){:target="_blank"}(英語)**  
OCVS から OCI ファイル・ストレージ・サービス (FSS) を NFS データストアとして利用することに関するブログ記事です。チュートリアルではありませんが、コンセプトの説明からスクリーンショットを交えた構築方法まで解説しています。  

+ **[Designlet: Create NFS Datastore using Oracle Cloud File Storage Service](https://vmc.techzone.vmware.com/resource/designlet-create-nfs-datastore-using-oracle-cloud-file-storage-service){:target="_blank"}**  

+ **[Oracle Cloud VMware Solution – vSAN sizing & scaling](https://thomasthyen.com/oracle-cloud-vmware-solution-vsan-sizing-scaling){:target="_blank"}(英語)**  
OCVSでESXiホストにDense I/Oシェイプを用いる場合、ホスト内蔵のNVMe SSDディスクを使ってvSANデータストアが構成されます。このブログ記事では、vSANのサイジング方法や、ホスト数の増減に伴う容量の変動に関する考え方、サイジングに影響を与えるvSANのオプションとその選択の考慮点などについてわかりやすくまとめています。  
※このブログ記事はOracle、VMwareいずれの公式ページでもありません

+ **[Oracle Cloud VMware SolutionとのVMware vSANファイル共有の構成](https://docs.oracle.com/ja/learn/config-ocvs-vsan-file-share/index.html#architecture-overview){:target="_blank"}**  
OCVSでESXiホストにDense I/Oシェイプを用いる場合、ホスト内蔵のNVMe SSD ディスクを使ってvSANデータストアが初期状態で構成されており、仮想マシンなどの配置場所として利用することができます。このチュートリアルでは、この構成済みのvSANデータストア内に VMware vSAN File Serviceを構成し、OCVS SDDC上の仮想マシンにNFS、CIFSなどのファイル共有機能を提供する方法について解説しています。

<!-- ちょっと古い? 要確認
+ **[SQL Server Failover Cluster Instance on VMware vSAN Native](https://core.vmware.com/resource/sql-server-failover-cluster-instance-vmware-vsan-native){:target="_blank"}**(英語)  
-->


## ESXiホストの管理

+ **[Oracle Cloud VMwareソリューションへのESXiホストの追加](https://docs.oracle.com/ja/learn/add_esxi_vmware_solution/index.html){:target="_blank"}**　　
このチュートリアルは、Oracle Cloud VMware SolutionのクラスタにESXiホストを追加するためのステップバイステップ・ガイドです。ESXiホストの追加は、OCIコンソール上でベアメタル・サーバーを追加する作業と、vCenterおよびNSXマネージャのコンソール上で、vSphere、vSAN、NSXの各クラスタにESXiホストを追加する作業から成ります。このガイドではこの2つの作業について解説しています。  
※本ガイドはvSphere 7.0u1および7.0u2で有効です。vSphere 7.0u3およびvSphere 8では一部作業に非互換な箇所があります。  

+ **[Oracle Cloud VMwareソリューションからのESXiホストの削除](https://docs.oracle.com/ja/learn/ocvs_delete_host/index.html){:target="_blank"}**  
このチュートリアルは、Oracle Cloud VMware SolutionのクラスタからにESXiホストを削除するためのステップバイステップ・ガイドです。ESXiホストの削除は、vCenterおよびNSXマネージャのコンソール上でvSphere、vSAN、NSXの各クラスタからESXiホストを削除する作業と、その後OCIコンソール上でベアメタル・サーバーをSDDCから削除する作業から成ります。このガイドではこの2つの作業について解説しています。  
※本ガイドはvSphere 7.0u1および7.0u2で有効です。vSphere 7.0u3およびvSphere 8では一部作業に非互換な箇所があります。  

<!--
その他のシナリオ候補
ホストリプレース (P1)
-->

## SDDCの監視

+ **[OCI通知をOracle Cloud VMwareソリューションと統合](https://docs.oracle.com/ja/learn/oci-notifications-vmware-solution/index.html){:target="_blank"}**  
OCIの通知(Notification)サービスを経由して、Oracle Cloud VMware Solutionから通知を送信するためのリファレンス・ソリューションです。このソリューションにより、インフラストラクチャの更新およびDevOps関連の通知を電子メールやSMSなどで受信できます。OCI通知サービスは可用性が高く、低レイテンシのパブリッシュおよびサブスクライブ・サービスで、電子メール、SlackおよびPagerDutyで通知を簡単に受信できます。OCI通知サービスでは、軽量データ処理のためのOracle Functionsのトリガーもサポートしています。OCI通知サービスを使用して、問題がOracle Cloud VMware Solutionで検出されるたびに通知を送信します。ESXiベアメタル・インスタンスの障害に対してトリガーされるアラームを作成することもできます。  

<!--
- vCenter監視
- ホスト監視
-->

## OCIのサービスとの接続

+ **[自律型データベースに接続されたVMware SDDCへの複数層アプリケーション・スタックのデプロイ](https://docs.oracle.com/ja/solutions/ocvs-oci/index.html){:target="_blank"}**

+ **[Connect from an Oracle Cloud VMware Solution virtual machine to Oracle Autonomous Database on OCI: Part 1](https://blogs.oracle.com/cloud-infrastructure/post/connect-from-an-oracle-cloud-vmware-solution-virtual-machine-to-oracle-autonomous-database-on-oci){:target="_blank"}**

+ **[#2 Oracle Cloud VMware SolutionにおけるOracle Database連携と移行](https://blogs.vmware.com/vmware-japan/2022/02/2-oracle-cloud-vmware-solution%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8Boracle-database%E9%80%A3%E6%90%BA%E3%81%A8%E7%A7%BB%E8%A1%8C.html){:target="_blank"}**


## 高度なネットワークの構成

+ **[Oracle Cloud VMware SolutionアプリケーションのOCIロード・バランシングの構成](https://docs.oracle.com/ja/learn/oci-load-balancer-vmware/index.html){:target="_blank"}**  
このチュートリアルは、Oracle Cloud VMware Solution内でホストされているアプリケーションをロード・バランシングするために、Oracle Cloud Infrastructure (OCI) Load Balancerをデプロイおよび構成するステップバイステップ・ガイドです。Load Balancerサービスを使用すると、1つのエントリ・ポイントから仮想クラウド・ネットワーク(VCN)からアクセス可能な複数のサーバーに自動的にトラフィックを分散できます。  

+ **[Creating VLAN-Backed Port Groups in Oracle Cloud VMware Solution](https://blogs.vmware.com/cloud/2021/05/28/vlan-backed-port-groups-oracle-cloud-vmware-solution/){:target="_blank"}(英語)**  
OCIの仮想ネットワーク(VCN)はVLANというレイヤー2ネットワーク機能を提供していますが、OCVSの初期状態ではこのVLANはvMotionなどSDDCの管理用途にのみ使用されており、仮想マシンを配置するワークロード・セグメントはVLANを使用しないNSX-Tオーバーレイ・ネットワークとして作成され、VCNとはTier-0ルーターを介してレイヤー3でルーティングされるように構成されています。  
一方ユーザーは、追加でVLANをアンダーレイとして利用するVLANバック・セグメントを構築することができます。VLANバック・セグメントを利用すると、そのセグメントとVCNのサブネットの間がTier-0ルーターを介さずVCNルーターで直接ルーティングされるようになるため、VCN内のネイティブ・サービス群(OCIコンピュート、Database Cloud Serviceなど)とより低遅延で接続できるようになります。このシナリオは、OCVS上でアプリケーションを稼働し、OCIのネイティブサービス上で稼働するデータベースと接続するような構成において特に利点があるほか、オンプレミスでVLANを利用している場合にクラウド移行をより容易にする効果もあります。　　
このブログ記事では、OCIのVLANとVLANバックのNSX-Tセグメントを追加で作成するステップについて解説しています。

+ **[A Detailed Guide to Deploy a DMZ on NSX-T for Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/a-detailed-guide-to-deploy-a-dmz-on-nsx-t-for-oracle-cloud-vmware-solution){:target="_blank"}(英語)**  
NSX-Tでは、Tier-1ルーターを使って複数のワークロード・セグメント間の通信(East-West通信)を、さらに上位のTier-0ルーターを経由してVCNやその先のネットワークとの外部通信(North-South通信)を行います。通常は単一のTier-0ルーターが外部との通信のゲートウェイとしての役割を担いますが、もし異なるセグメントに対する外部との通信を分離したい場合には、Tier-0およびTier-1ルーターのセットを追加で作成し、それぞれに別のルーティングを設定することで実現できます。  
この記事では、追加のTier-0、Tier-1ルーターを配置し、インターネットからの通信が一旦ルーティングされるDMZの役割を持つセグメントを作成し、アプリケーションが配置される内部向けのセグメントとは完全に分離する手法について解説しています。

+ **[Achieve multitenancy within Oracle Cloud VMware Solution using VRF gateways in NSX-T](https://blogs.oracle.com/cloud-infrastructure/post/achieve-multitenancy-within-oracle-cloud-vmware-solution-using-vrf){:target="_blank"}(英語)**
この記事は、上記の [A Detailed Guide to Deploy a DMZ on NSX-T for Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/a-detailed-guide-to-deploy-a-dmz-on-nsx-t-for-oracle-cloud-vmware-solution) とセットになる記事です。  
NSX-T 3.0で、Tier-0ゲートウェイにVRF機能が追加されました。この機能を使うことで、複数のセグメントへのルーティングを分離するマルチテナントが単一のTier-0ルーターで実現できるようになりました。この記事では、VRF機能を用いてDMZの役割を持つ、分離されたセグメントを追加する方法について解説しています。

+ **[VMware NSX-TオーバーレイでのOracle Cloud VMWare Solution SDDCワークロードのパブリックDNSの構成](https://docs.oracle.com/ja/learn/configure_dns_vmware_nxstoverlay/index.html){:target="_blank"}**

+ **[Oracle Cloud VMware Solution – Networking Reference Architecture](https://blogs.vmware.com/cloud/2021/04/28/oracle-cloud-vmware-solution-networking-reference-architecture/){:target="_blank"}**

<!-- その他のシナリオ候補
- 新規VLANを利用したオーバーレイ・セグメントの追加(VLAN作成、ESXiへのvNIC追加、外部アクセスIPの設定) (P3)
- OCIのNetwork Firewallを経由してインターネットとの境界にファイアウォールを設置 (P3)
-->


## VMware HCX (Hybrid Cloud Extention)

+ **[Oracle Cloud VMware Solutionを使用したVMware HCXの構成](https://docs.oracle.com/ja/learn/oci-ocvs-hcx/index.html){:target="_blank"}**  
Oracle Cloud VMware Solutionは、VMware HCX Advancedライセンスが同梱されており、また追加でVMware HCX Enterpriseライセンスも提供しています。VMware HCXは、アプリケーションの移行を簡素化し、ワークロードをリバランスし、データ・センターとクラウド間のディザスタ・リカバリを最適化するために設計されたアプリケーション・モビリティ・プラットフォームであるソフトウェア・スイートです。このチュートリアルでは、Oracle Cloud VMware Solutionの導入概要、VMware HCXの概要、実装に必要な前提条件、および段階的な導入ガイドラインについて説明します。  

+ **[Solution Playbook : オンプレミスVMwareワークロードをクラウドに移行します](https://docs.oracle.com/ja/solutions/migrate-vmware-workloads-oraclecloud/){:target="_blank"}**

+ **[Solution Playbook : オンプレミスSDDCとクラウド間のハイブリッドOCVS SDDCの設定について](https://docs.oracle.com/ja/solutions/hybrid-ocvs-sddc-onprem-sddc-cloud/){:target="_blank"}**

+ **[Blog : Set Up a Hybrid Cloud with Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/set-up-a-hybrid-cloud-with-oracle-cloud-vmware-solution){:target="_blank"}**

+ **[Blog : Migrate VMware workloads from on-premises data centers to Oracle Cloud VMware Solution using VMware HCX](https://blogs.oracle.com/cloud-infrastructure/post/migrate-vmware-workloads-from-on-premises-data-centers-to-oracle-cloud-vmware-solution-using-vmware-hcx){:target="_blank"}**

+ **[Blog : Deploy VMware HCX Connector in your on-premises VMware environment and establish a site pairing with Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/deploy-vmware-hcx-connector-in-your-on-premises-vmware-environment-and-establish-a-site-pairing-with-oracle-cloud-vmware-solution){:target="_blank"}**

+ **[L2 network extension from on-premises VMware environment to Oracle Cloud VMware solution using VMware HCX](https://blogs.oracle.com/cloud-infrastructure/post/l2-network-extension-from-on-premises-vmware-environment-to-oracle-cloud-vmware-solution-using-vmware-hcx){:target="_blank"}**

+ **[Designlet: HCX Network Extension on Oracle Cloud VMware Solution](https://vmc.techzone.vmware.com/resource/designlet-hcx-network-extension-oracle-cloud-vmware-solution){:target="_blank"}**

+ **[Designlet: VMware HCX Mobility Optimized Networking for Oracle Cloud VMware Solution](https://vmc.techzone.vmware.com/resource/designlet-vmware-hcx-mobility-optimized-networking-oracle-cloud-vmware-solution){:target="_blank"}**

+ **[Blog : Announcing VMware HCX Enterprise for Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/announcing-vmware-hcx-enterprise-for-oracle-cloud-vmware-solution){:target="_blank"}**


## VMware Horizon

+ **[Oracle Cloud VMwareソリューションにVMware Horizonをインストールおよび構成](https://docs.oracle.com/ja/learn/horizon_on_ocvs/index.html){:target="_blank"}**  
このチュートリアルでは、Oracle Cloud VMware SolutionでVMware Hizon 8.xをインストールして構成する方法を示します。このチュートリアルではvSphere 7.0デプロイメントを使用しましたが、vSphere 6.7に関連するステップについても説明します。

+ **[Horizon on Oracle Cloud VMware Solution Architecture](https://techzone.vmware.com/resource/horizon-oracle-cloud-vmware-solution-architecture#introduction){:target="_blank"}**  

+ **[Horizon on Oracle Cloud VMware Solution Configuration(英語のチュートリアル)](https://techzone.vmware.com/resource/horizon-oracle-cloud-vmware-solution-configuration){:target="_blank"}**  

+ **[Unified Access GatewayおよびOCI IAMアイデンティティ・ドメインでのVMware Horizonに対するSAML 2.0認証の有効化](https://docs.oracle.com/ja/learn/vmware-uag-oci-identity-domains/){:target="_blank"}**  
VMware Horizonは、オンプレミスからクラウドに仮想デスクトップとアプリケーションを効率的かつ安全に配信できるよう支援しています。このチュートリアルでは、Oracle Cloud Infrastructure (OCI) Identity and Access Management (IAM)アイデンティティ・ドメインをSAMLアイデンティティ・プロバイダ(IdP)としてのVMware Unified Access GatewayTMとの統合として構成し、VMware Horizon仮想デスクトップおよびアプリケーションにアクセスする方法について説明します。

+ **[(参考)Blog : Oracle Cloud VMware SolutionのVMware Horizon検証設計](https://blogs.oracle.com/oracle4engineer/post/ja-vmware-horizon-validated-design){:target="_blank"}**  

+ **[(参考)VMware Horizon on Oracle Cloud VMware Solution (OCVS) Support (88202)](https://kb.vmware.com/s/article/88202){:target="_blank"}**  


## VMware Aria Operations (旧VMware vRealize)

+ **[Oracle Cloud VMwareソリューションを使用したVMware vRealize操作8.xの構成](https://docs.oracle.com/ja/learn/configure-vrealize-vmware-solution/index.html){:target="_blank"}**  

+ **[Oracle Cloud VMwareソリューションを使用したVMware vRealize®ログInsightTM 8.xの構成](https://docs.oracle.com/ja/learn/oci-vmware-log/index.html){:target="_blank"}**  

+ **[Oracle Cloud VMware Solution (OCVS) for VMware Aria Operations](https://blogs.vmware.com/management/2023/01/oracle-cloud-vmware-solution.html){:target="_blank"}**  


## Cloud Director

+ **[Oracle Cloud VMware SolutionのVMware Cloud Directorサービスの発表](https://blogs.oracle.com/oracle4engineer/post/ja-ann-the-vmware-cloud-director-service){:target="_blank"}** 

+ **[Cloud Director service GA on Oracle Cloud VMware Solution for Cloud Service Providers](https://blogs.vmware.com/cloudprovider/2023/09/cloud-director-service-ga-on-oracle-cloud-vmware-solution-for-csp.html){:target="_blank"}** 

+ **[Network & Security Insights for Oracle Cloud VMware Solution](https://blogs.vmware.com/management/2022/02/network-security-insights-for-oracle-cloud-vmware-solution.html){:target="_blank"}** 


## VMware Tanzu
+ **[Oracle Cloud VMware SolutionのVMware Cloud Directorサービスの発表](https://blogs.oracle.com/oracle4engineer/post/ja-ann-the-vmware-cloud-director-service){:target="_blank"}** 


## Red Hat OpenShift
+ **[Oracle Cloud VMware SolutionへのRed Hat OpenShiftの導入](https://docs.oracle.com/ja/solutions/deploy-ocvs-redhat-openshift/index.html){:target="_blank"}** 


## データ保護、DR

+ **[Solution Playbook : CloudでのVMware SDDCの障害からの保護について](https://docs.oracle.com/ja/solutions/implement-dr-for-ocvs/){:target="_blank"}** 

+ **[Oracle Cloud VMware Solution – Disaster Recovery](https://thomasthyen.com/oracle-cloud-vmware-solution-disaster-recovery){:target="_blank"}** 

+ **[Disaster recovery to Oracle Cloud VMware Solution](https://blogs.oracle.com/cloud-infrastructure/post/disaster-recovery-to-ocvs){:target="_blank"}** 

+ **[Designlet - Planning and Considerations for VMware SRM on OCVS](https://vmc.techzone.vmware.com/resource/designlet-planning-and-considerations-vmware-srm-ocvs){:target="_blank"}** 


### Rackware

+ **[Oracle Cloud VMware SolutionでRackWare®を使用してディザスタ・リカバリを構成](https://docs.oracle.com/en/learn/oci-ocvs-dr-rw/index.html){:target="_blank"}** 

+ **[ディザスタ・リカバリの構成- Oracle Cloud VMware SolutionでRackWare®を使用するコールド・スタンバイ](https://docs.oracle.com/ja/learn/oci-ocvs-dr-cs-rw/index.html){:target="_blank"}** 


### Veeam

+ **[VeeamをデプロイしてクラウドのVMware SDDCを障害から保護](https://docs.oracle.com/ja/solutions/deploy-veeam-for-ocvs/index.html){:target="_blank"}**

+ **[OCI Object Storage is certified as Veeam Ready - Object](https://blogs.oracle.com/cloud-infrastructure/post/veeam-ready-qualification-oci-object-storage){:target="_blank"}**



### Commvault

+ **[Commvaultをデプロイして、クラウド内のVMware SDDCを災害から保護](https://docs.oracle.com/en/solutions/deploy-commvault-for-ocvs/index.html){:target="_blank"}**


### Zerto

+ **[Zertoをデプロイして、クラウド内のVMware SDDCを障害に対して保護します](https://docs.oracle.com/ja/solutions/deploy-zerto-for-ocvs/index.html){:target="_blank"}**


### Actifio

+ **[Deploy Actifio to protect your VMware SDDC in the cloud against disasters](https://docs.oracle.com/en/solutions/deploy-actifio-oracle-vmware-solution/index.html){:target="_blank"}**


## アップグレード

+ **[Oracle Cloud VMware Solution 6.xから7.xへのインプレース・アップグレードの実行](https://docs.oracle.com/ja/learn/ocvs-inplace-upgrade-6x-7x/index.html){:target="_blank"}**

+ **[Upgrading Oracle Cloud VMware Solution from 6.x to 7.x](https://vmc.techzone.vmware.com/resource/upgrading-oracle-cloud-vmware-solution-6x-7x){:target="_blank"}**


## セキュリティ

+ **[Document : VMwareソリューションの保護](https://docs.oracle.com/ja-jp/iaas/Content/Security/Reference/vmware_security.htm){:target="_blank"}**

+ **[Oracle Cloud VMware Solutionによるデータ保護のためのOCIセキュリティ・サービスの使用](https://docs.oracle.com/ja/solutions/oci-security-ocvs/index.html){:target="_blank"}**

+ **[Oracle Cloud VMwareソリューションを使用したEntrust KeyControl 5.4の構成](https://docs.oracle.com/ja/learn/oci-vmware-entrust-config/index.html){:target="_blank"}**

+ **[Entrust KeyControlおよびVMware vSphereを使用して、仮想マシンをOracle Cloud VMwareソリューションで暗号化](https://docs.oracle.com/ja/learn/oci-vmware-vm-encrypt/index.html){:target="_blank"}**

+ **[Entrust KeyControlをOracle Cloud VMwareソリューションとのVMware vSphere 7のキー・プロバイダとして追加](https://docs.oracle.com/ja/learn/oci-vmware-entrust-key-provider/index.html){:target="_blank"}**


## その他

+ **[Oracle Cloud VMware SolutionでActive DirectoryをVMware vCenterと統合](https://docs.oracle.com/ja/learn/integrate-ad-with-vcenter/index.html){:target="_blank"}**

+ **[Oracle Cloud VMware SolutionでActive DirectoryをVMware NSX-Tと統合](https://docs.oracle.com/ja/learn/integrate-ad-with-nsx-t/index.html){:target="_blank"}**

+ **[Configure Conditional DNS forwarding between OCI and AD Domain](https://vmc.techzone.vmware.com/resource/configure-conditional-dns-forwarding-between-oci-and-ad-domain){:target="_blank"}**
