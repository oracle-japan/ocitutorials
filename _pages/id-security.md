---
title: "アイデンティティとセキュリティチュートリアル"
excerpt: "OCIにおける各種ID管理、セキュリティ関連サービスについて学習できるチュートリアルです。"
permalink: /id-security/
layout: single
# layout: collection
# collection: id-security
# entries_layout: grid
# tags: "security"
show_excerpts: true
# classes: wide
toc: true
# date: "2022-10-11"
# lastmod: "2022-10-11"
---

Oracle Cloud Infrastructureは、設計段階からセキュリティを考慮して開発されたクラウドサービスになります。
セキュリティに非常に力を入れて取り組んでおり、無償でご利用いただけるクラウドサービスも多数あります。

このページでは、アイデンティティとセキュリティ編として、Oracle Cloud Infrastructureで提供しているセキュリティ関連サービスのチュートリアルをまとめています。

<br/>

#  <span style="color: brown; ">◼︎アイデンティティ編</span>

## OCI IAM Identity Domainsチュートリアル

+ **[OCI IAM Identity Domainsのドメインの追加とライセンスタイプを変更する](https://oracle-japan.github.io/ocitutorials/id-security/identitydomains-add-domains-license/){:target="_blank"}**  
   本チュートリアルでは、Identity Domainsのドメインタイプを新規作成する手順と、ドメインのライセンスタイプの変更手順を紹介します。

+ **[OCI IAM Identity Domains - テナント管理者・一般ユーザーを作成する](https://oracle-japan.github.io/ocitutorials/id-security/identitydomains-admin-users/)**  
   本チュートリアルではIdentity DomainsでのOCIテナント管理者ユーザーと、一般ユーザーの作成手順を紹介します。

+ **[OCI IAM Identity DomainでユーザーのMFAを有効化する](https://oracle-japan.github.io/ocitutorials/id-security/identitydomain-mfa/)**  
   本チュートリアルでは、Identity Domainsの特定のグループに属しているユーザーに二要素認証を要求するための設定手順を紹介します。

+ **[OCI IAM Identity DomainsとAzure ADとの認証連携（外部IDP連携）を設定する](https://oracle-japan.github.io/ocitutorials/id-security/identitydomains-AzureAD/)**  
   本チュートリアルでは、SAMLによるIdentity DomainsとAzure ADとの認証連携を設定する手順を紹介します。本チュートリアルを完了することで、Azure ADのIDとパスワードでOCIにサインオンすることが可能になります。

+ **[OCI IAM Identity DomainでAPEXで作成したアプリに認証と認可をする](https://oracle-japan.github.io/ocitutorials/id-security/identitydomain-apex-sso/)**  
   本チュートリアルでは、Oracle Application Express（APEX）で作成したアプリケーションとIdentity Domainsの認証連携、およびIdentity Domainsのグループに基づくアクセス制御（認可）の実装手順を紹介します。

<br><br>


#  <span style="color: brown; ">◼︎セキュリティ編</span>

## Web Application Firewallチュートリアル

### Global WAF
<span style="color: olivedrab; ">**環境準備編**</span>
+ **[OCI Web Application Firewallのエッジポリシーを使ってWebサーバーを保護する](https://oracle-japan.github.io/ocitutorials/id-security/waf-edge-policy/)**  
   本チュートリアルでは、エッジポリシーを実際に作成し、Webアプリケーションへの攻撃をエッジポリシーが検知、防御しているところを確認します。

<span style="color: olivedrab; ">**活用編**</span>
+ **[エッジポリシーのWeb Application Firewallのログを分析する](https://oracle-japan.github.io/ocitutorials/id-security/waf-edge-log-analytics/)**
   本チュートリアルでは、「OCI Web Application Firewallのエッジポリシーを使ってWebサーバを保護する」の続編として、エッジポリシーのログをLogging Analyticsに転送して分析する手順を紹介します。

### Regional WAF
<span style="color: olivedrab; ">**環境準備編**</span>
+ **[OCI Load BalancerにアタッチするタイプのWeb Application Firewallを構築する](https://oracle-japan.github.io/ocitutorials/id-security/web-application-firewall-v2/)**  
   本チュートリアルでは、OCIのLoad Balancerに直接アタッチする「WAFポリシー」を作成し、実際のWAFポリシーの動作を確認します。

<span style="color: olivedrab; ">**活用編**</span>

+ **[OCI Load Balancerに直接アタッチするタイプのWeb Application Firewallのログを分析する](/ocitutorials/id-security/waf-v2-log)**  
   本チュートリアルでは、「OCIのLoad BalancerにアタッチするタイプのWeb Application Firewallを構築する」の続編として、WAFポリシーのログをLogging Analyticsに転送して分析する手順を紹介します。


<br>

## Network Firewallチュートリアル

<span style="color: olivedrab; ">**環境準備編**</span>
+ **[OCI Network Firewallを構築する](/ocitutorials/id-security/networkfirewall/)**  
   本チュートリアルでは、OCI Network Firewallの環境を構築し、OCI Network Firewallの動作を確認します。

<span style="color: olivedrab; ">**活用編**</span>

+ **[OCI Network FirewallのIDS/IPS機能を検証する](/ocitutorials/id-security/networkfirewall-ips/)**  
   本チュートリアルでは、「OCI Network Firewallを構築する」の続編として、IDS/IPSの設定および動作を確認します。IDS/IPSの動作検証には、Kali LinuxのツールおよびEicarファイルを使用します。

+ **[OCI Network Firewallのログを分析する](/ocitutorials/id-security/networkfirewall-la/)**  
   本チュートリアルでは「OCI Network Firewallを構築する」の続編として、Network Firewallのログを分析し、Network Firewallを通過するトラフィックの傾向、脅威の有無を確認します。

<br>

## OCI Vaultチュートリアル

<span style="color: olivedrab; ">**環境準備編**</span>

+ **[Vaultを作成し 顧客管理の鍵をインポートする](/ocitutorials/id-security/vault-preparation/)**  
   VaultサービスでVaultを作成し、暗号鍵の作成とインポートを行います。

<span style="color: olivedrab; ">**活用編**</span>
+ **[Vaultサービスを使ってObject Storageをユーザー管理の暗号鍵で暗号化する](/ocitutorials/id-security/vault-objectstorage/)**  
   Vaultサービスでユーザー管理の暗号鍵を使用してObject Storageを作成する手順を紹介します。

+ **[Vaultサービスを使ってコンピュート・インスタンスのブート・ボリュームをユーザー管理の暗号鍵で暗号化する](/ocitutorials/id-security/vault-compute/)**  
   Vaultサービスでユーザー管理の暗号鍵を使用してコンピュート・インスタンスのブート・ボリュームを暗号化する手順を紹介します。

+ **[Vaultサービスを使ってBase Databaseをユーザー管理の暗号鍵で暗号化する](/ocitutorials/id-security/vault-basedatabase/)**  
   Vaultサービスでユーザー管理の暗号鍵を使用してBase Databaseを暗号化する手順を紹介します。

<br>

## Cloud Guardチュートリアル

+ **[Cloud Guardを使ってみる](https://qiita.com/western24/items/d1469545749866867191)**  
   本チュートリアルは外部のページで、Cloud Guardの設定手順および確認方法を紹介しています。

<br>

## Oracle Data Safe チュートリアル

+ **[Oracle Data Safeチュートリアルまとめ](https://oracle-japan.github.io/ocitutorials/id-security/data-safe-tutorials/)**  
   本チュートリアルは外部のページで、Data Safeの有効化から、各種機能の使い方についてまとめています。   

<br>

## Security Zoneチュートリアル

+ **[Security Zoneを有効化する](https://speakerdeck.com/oracle4engineer/scurity-zonesshe-ding-cao-zuo-gaido)**  
   本チュートリアルは外部のページで、Security Zoneの設定手順について紹介しています。

<br>

## Vulnerability Scanningチュートリアル

+ **[Vulnerability Scanning Serviceを設定する](https://speakerdeck.com/oracle4engineer/vulnerability-scanning-serviceshe-ding-cao-zuo-gaido)**  
   本チュートリアルは外部のページで、Vulnerability Scanning Serviceの設定手順を紹介しています。