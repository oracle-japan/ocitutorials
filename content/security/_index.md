---
title: "OCI セキュリティ チュートリアル"
description: "OCIにおける各種セキュリティ関連サービスについて学習できるチュートリアルです。"
---

Oracle Cloud Infrastructureは、設計段階からセキュリティを考慮して開発されたクラウドサービスです。  
セキュリティに非常に力を入れて取り組んでおり、無償でご利用いただけるクラウドサービスも多数提供しています。

このページではセキュリティ編として、Oracle Cloud Infrastructureで提供しているセキュリティ関連サービスのチュートリアルをまとめています。

## Web Application Firewall
<!-- 100 -->

### Global WAF
<span style="color: olivedrab; "><b>環境準備編</b></span>

+ **[OCI Web Application Firewallのエッジポリシーを使ってWebサーバーを保護する](./waf-v1-setup)**  
   本チュートリアルでは、エッジポリシーを実際に作成し、Webアプリケーションへの攻撃をエッジポリシーが検知、防御しているところを確認します。

<span style="color: olivedrab; "><b>活用編</b></span>

+ **[エッジポリシーのWeb Application Firewallのログを分析する](./waf-v1-loganalytics)**  
   本チュートリアルでは、「OCI Web Application Firewallのエッジポリシーを使ってWebサーバを保護する」の続編として、エッジポリシーのログをLogging Analyticsに転送して分析する手順を紹介します。


### Regional WAF
<span style="color: olivedrab; "><b>環境準備編</b></span>

+ **[OCI Load BalancerにアタッチするタイプのWeb Application Firewallを構築する](./waf-v2-setup/)**  
   本チュートリアルでは、OCIのLoad Balancerに直接アタッチする「WAFポリシー」を作成し、実際のWAFポリシーの動作を確認します。


<span style="color: olivedrab; "><b>活用編</b></span>

+ **[OCI Load Balancerに直接アタッチするタイプのWeb Application Firewallのログを分析する](./waf-v2-loganalytics/)**  
   本チュートリアルでは、「OCIのLoad BalancerにアタッチするタイプのWeb Application Firewallを構築する」の続編として、WAFポリシーのログをLogging Analyticsに転送して分析する手順を紹介します。

<br>

## Network Firewall
<!-- 200 -->

<span style="color: olivedrab; "><b>環境準備編</b></span>

+ **[OCI Network Firewallを構築する](./networkfirewall-setup/)**  
   本チュートリアルでは、OCI Network Firewallの環境を構築し、動作を確認します。動作確認にはeicarファイルを使用します。

+ **[ハブアンドスポーク構成でOCI Network Firewallを構築する](./networkfirewall-setup-hubspoke/)**  
   本チュートリアルではOCI Network Firewallをハブアンドスポーク構成で構築します。

+ **[トンネル検査構成でOCI Network Firewallを構築する](./networkfirewall-setup-tunnelinspection/)**  
   本チュートリアルではOCI Network Firewallをトンネル検査構成で構築します。

<span style="color: olivedrab; "><b>活用編</b></span>

+ **[OCI Network Firewallの動作を検証する](./networkfirewall-policycheck/)**  
   本チュートリアルでは、サービス・リストとURLリストを設定し、OCI Network Firewallの動作を確認します。

+ **[OCI Network FirewallのSSLインスペクション（インバウンドモード）を行う](./networkfirewall-sslinspect-inb/)**  
   本チュートリアルでは「OCI Network Firewallを構築する」の続編として、SSLインスペクションのうち、インバウンド検証モードの設定および動作を確認します

+ **[OCI Network FirewallのSSLインスペクション（転送プロキシモード）を行う](./networkfirewall-sslinspect-fwd/)**  
   本チュートリアルでは「OCI Network Firewallを構築する」の続編として、SSLインスペクションのうち、転送プロキシモードの設定および動作を確認します。

+ **[OCI Network Firewallのログを分析する](./networkfirewall-loganalytics/)**  
   本チュートリアルでは「OCI Network Firewallを構築する」の続編として、Network Firewallのログを分析し、Network Firewallを通過するトラフィックの傾向、脅威の有無を確認します。

<br>

## OCI Vault
<!-- 300 -->

<span style="color: olivedrab; "><b>環境準備編</b></span>

+ **[Vaultを作成し 顧客管理の鍵をインポートする](./vault-setup/)**  
   VaultサービスでVaultを作成し、暗号鍵の作成とインポートを行います。

<span style="color: olivedrab; "><b>活用編</b></span>

+ **[Vaultサービスを使ってObject Storageをユーザー管理の暗号鍵で暗号化する](./vault-objectstorage/)**  
   Vaultサービスでユーザー管理の暗号鍵を使用してObject Storageを作成する手順を紹介します。

+ **[Vaultサービスを使ってコンピュート・インスタンスのブート・ボリュームをユーザー管理の暗号鍵で暗号化する](./vault-compute/)**  
   Vaultサービスでユーザー管理の暗号鍵を使用してコンピュート・インスタンスのブート・ボリュームを暗号化する手順を紹介します。

+ **[Vaultサービスを使ってBase Databaseをユーザー管理の暗号鍵で暗号化する](./vault-basedatabase/)**  
   Vaultサービスでユーザー管理の暗号鍵を使用してBase Databaseを暗号化する手順を紹介します。

<br>

## Cloud Guard
<!-- 400 -->

<span style="color: olivedrab; "><b>環境準備編</b></span>
+ **[Cloud Guard を有効化する](./cloudguard-setup/)**  
   OCI Cloud Guardはクラウドリソースの脅威を検出し、セキュリティリスクを軽減する強力なツールです。本チュートリアルでは、Cloud Guardの有効化から基本設定までを解説します。

<span style="color: olivedrab; "><b>活用編</b></span>
+ **[Cloud Guard 設定・操作ガイド](https://speakerdeck.com/oracle4engineer/cloud-guardshe-ding-cao-zuo-gaido)**  
   本チュートリアルは外部のページで、Cloud Guardの設定手順および操作方法を紹介しています。

<br>

## Oracle Data Safe
<!-- 500 -->

+ **[Oracle Data SafeをBaseDBに設定する](./datasafe-setup/)**  
   Oracle Data SafeをBaseDBに設定する手順についてまとめています。

+ **[セキュリティ・アセスメント機能でセキュリティ構成を評価する](./datasafe-security-assessment/)**  
   本チュートリアルは「Oracle Data SafeをBaseDBに設定する」の続編として、セキュリティ・アセスメントの設定および動作を確認します。

<br>

## Security Zones
<!-- 600 -->

+ **[Security Zones 設定・操作ガイド](https://speakerdeck.com/oracle4engineer/security-zonesshe-ding-cao-zuo-gaido)**  
   本チュートリアルは外部のページで、Security Zonesの設定手順について紹介しています。

<br>

## Vulnerability Scanning
<!-- 700 -->

+ **[Vulnerability Scanning Serviceを設定する](https://speakerdeck.com/oracle4engineer/vulnerability-scanning-serviceshe-ding-cao-zuo-gaido)**  
   本チュートリアルは外部のページで、Vulnerability Scanning Serviceの設定手順を紹介しています。
