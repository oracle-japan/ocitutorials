---
title: "Cloud Nativeチュートリアル"
description: "OCIにおける各種コンテナ/サーバレス関連サービスのチュートリアルについて学習できるチュートリアルです。"
permalink: /cloud-native/
layout: single
toc: true
---

このページでは、Oracle Cloud Infrastructure(OCI)の各コンテナ/サーバレス関連サービスやCI/CDサービスのチュートリアルをまとめています。  
各チュートリアルごとにステップ・バイ・ステップで学ぶことができ、各サービスの基本的な機能、操作やオペレーションについて学習することができます。  

# 1. Oracle Cloud Infrastructure DevOpsチュートリアル

<!-- ## 事前準備編 -->

## 事前準備編

+ **[Oracle Cloud Infrastructure(OCI) DevOps事前準備](./devops-for-commons/)**  
    OCI DevOpsを利用するための事前準備を行います。まずはここから始めましょう【所要時間:約30分】

## 初級編

+ **[初級編 - Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-Compute編-](./devops-for-beginners-compute)**  
    ここでは、OCI Computeを利用したアプリケーション環境の構築、CI/CDパイプラインの実装と実行までの手順を記します。【所要時間:約1時間】

+ **[初級編 - Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-OKE編-](./devops-for-beginners-oke/)**  
    ここでは、Oracle Container Engine for Kubernetes(OKE)を利用したCI/CDパイプラインの実装と実行までの手順を記します。【所要時間:約1時間】

+ **[初級編 - Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-OCI Functions編-](./devops-for-beginners-functions/)**  
    ここでは、OCI Functionsを利用したCI/CDパイプラインの実装と実行までの手順を記します。【所要時間:約1時間】

<br />

# 2. Oracle Container Engine for Kubernetesチュートリアル

## 事前準備編 - OKEクラスターのプロビジョニング

+ **[OKEクラスターをプロビジョニングしよう](./oke-for-commons/)**  
    Oracle Cloud Infrastructure (OCI) の管理コンソールを利用し、OKEクラスターを作成します。まずはここから始めましょう【所要時間:約30分】

## 初級編

+ **[OKEでアプリケーションを動かしてみよう](./oke-for-beginners/)**
    OKEに対してサンプルアプリケーションをデプロイするプロセスを通して、Kubernetesの基本的な概念や特徴、操作方法をを学びます。【所要時間:約30分】

## 中級編

+ **[Oracle Container Engine for Kubernetes(OKE)でサンプルアプリケーションのデプロイとCI/CDを体験してみよう](./oke-for-intermediates/)**  
    OCI DevOpsを利用してCI/CD環境をセットアップし、Oracle Autonomous Transaction ProcessingをデータソースとしたJavaアプリケーションをOracle Container Engine for Kubernetes(OKE)にデプロイする一連の流れを体験することができます【所要時間:約1時間30分】

## 上級編

+ **[Oracle Container Engine for Kubernetes(OKE)でサンプルマイクロサービスアプリケーションをデプロイしてオブザバビリティツールを利用してみよう](./oke-for-advances/)**  
    OKEを使ってサンプルマイクロサービスアプリケーションのデプロイおよびオブザバビリティを体験していただけるコンテンツです。サードパーティーとしてOSSのIstio、Prometheus、Grafana、Loki、Jaeger、Kialiを利用します。【所要時間:約2時間】

+ **[Oracle Container Engine for Kubernetes(OKE)でサンプルマイクロサービスアプリケーションをデプロイしてOCIのオブザバビリティサービスを利用してみよう](./oke-observability-for-advances/)**  
    OKEを使ってサンプルマイクロサービスアプリケーションのデプロイおよびオブザバビリティを体験していただけるコンテンツです。OCIのオブザバビリティサービスとして、Oracle Cloud Infrastructure Monitoring、Oracle Cloud Infrastructure Logging、Oracle Cloud Infrastructure Application Performance Monitoringを利用します。【所要時間:約2時間】

<br />

# 3. OCI Container Instancesチュートリアル

## 初級編

+ **[OCI Container Instances をプロビジョニングしよう](./ci-for-beginners/)**
    OCI Container InstancesでWordPress環境を構築します。【所要時間:約20分】

<br />

# 4. OCI Functionsチュートリアル

## 初級編

+ **[Fn Projectことはじめ](./fn-for-beginners/)**
    Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。
    このエントリーでは、Fn Projectの環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[OCI Functionsことはじめ](./functions-for-beginners/)**
    OCI Functionsは、Oracleが提供するFn Projectのマネージドサービスです。
    このエントリーでは、OCI Functions環境構築から動作確認までの手順を記します。【所要時間:約45分】

+ **[Oracle Cloud Infrasturcture API Gateway + OCI Functionsハンズオン](./functions-apigateway-for-beginners/)**
    OCI API GatewayとOCI Functionsを組み合わせて、 簡単なアプリケーションを開発する手順をご紹介します。【所要時間:約1時間】

+ **[OCI API Gateway + OCI Functionsを利用したデータベースアクセス](./functions-apigateway-atp-for-beginners/)**
    OCI Functionsからpython-oracledbドライバを利用してOracle Autonomous Transaction Processing(ATP)に接続し、データをCRUD(Create、Read、Update、Delete)する方法について説明します。【所要時間:約1時間】

## 中級編

+ **[OCI Functionsを利用したVMシェイプ変更](./functions-vmshape-for-intermediates)**
    Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。
    このエントリーでは、Fn Projectの環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[OCI Functionsを利用したATPとのREST連携](./functions-ords-for-intermediates)**
    OCI Functionsは、Oracleが提供するFn Projectのマネージドサービスです。
    このエントリーでは、OCI Functions環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[OCI Functionsを利用したOracle NoSQL Database Cloud Serviceとの連携](./functions-nosql-for-intermediates)**
    OCI API GatewayとOCI Functionsを組み合わせて、 簡単なサーバレスアプリケーションを開発する手順をご紹介します。【所要時間:約30分】

+ **[OCI Functionsを利用したOCI API Gatewayでの認証](./functions-apigateway-for-intermediates)**
    OCI API GatewayとOCI Functionsを組み合わせて、 簡単なサーバレスアプリケーションを開発する手順をご紹介します。【所要時間:約30分】

<br />

# 5. OCI API Gatewayチュートリアル

## 初級編

+ **[Oracle Cloud Infrasturcture API Gateway ハンズオン](./apigateway-for-beginners/)**
    OCI API Gatewayを利用して簡単にAPIを集約・公開する手順をご紹介します。【所要時間:約1時間】 

<br />

# 6. Oracle Cloud Infrastructure Service Meshチュートリアル

## 初級編

+ **[OCI Service Meshを使ってサービスメッシュ環境を作ろう](./osm-for-beginners/)**  
    OCI Service Meshを利用してBookInfoアプリケーションを動かしてみます。【所要時間:約1時間】

<br />

# 7. Helidonチュートリアル

## 初級編

+ **[Helidon(MP)ハンズオン](./helidon-mp-for-beginners/)**
    Helidon MPは、Oracleが提供するMicroProfile準拠のマイクロサービスの開発に適したJavaアプリケーションフレームワークです。こちらのハンズオンは、サンプルアプリケーションの構築を通して、Helidonの特徴や使いやすさを学んでいただけるコンテンツになっています。【所要時間:約1時間】

+ **[Helidon(SE)ハンズオン](./helidon-se-for-beginners/)**
    Helidon SEは、Oracleが提供するマイクロサービスの開発に適したJavaのマイクロフレームワークです。こちらのハンズオンは、サンプルアプリケーションの構築を通して、Helidonの特徴や使いやすさを学んでいただけるコンテンツになっています。【所要時間:約30分】

<br />

# 8. WebLogic Server on OCIチュートリアル

+ **[WebLogic Server for OCIをプロビジョニングしてみよう](./wls-for-oci-provisioning/)**  
    WebLogic Server for OCI は、Oracleが提供するアプリケーションサーバーのWebLogic ServerをOCI上で簡単に構築できるオファリングです。こちらのハンズオンでは、WebLogic Server for OCIのプロビジョニング、アプリケーションのデプロイを学んでいただけるコンテンツになります。【所要時間:約1時間】

+ **[WebLogic Server for OCI(14.1.2)をプロビジョニングしてみよう](./wls-for-oci-1412-provisioning/)**  
    こちらのハンズオンでは、WebLogic Server for OCI(14.1.2)のプロビジョニングとWebLogic Remote Consoleからのアクセスを学んでいただけるコンテンツになります。【所要時間:約1時間】

+ **[WebLogic Server for OCI(14.1.2)の基本的な操作を体験してみよう](./wls-for-oci-1412-beginners/)**  
    こちらのハンズオンでは、WebLogic Remote Consoleを使ったWebLogic Server for OCI(14.1.2)のデータソースの作成やアプリケーションのデプロイなど、基本的な操作を学んでいただけるコンテンツになります。【所要時間:約1時間】


+ **[WebLogic Server for OCIにアプリケーションを移行してみよう](./wls-for-oci-migration/)**  
   こちらのハンズオンでは、WebLogic Server for OCIに対してのアプリケーションの移行を学んでいただけるコンテンツになります。【所要時間:約1時間】

+ **[WebLogic Server for OKEをプロビジョニングしてみよう](./wls-for-oke-provisioning/)**  
    WebLogic Server for OKE は、WebLogic Serverのコンテナ化を簡単に実現できるオファリングです。こちらのハンズオンでは、WebLogic Server for OKEのプロビジョニング、ドメインの作成を学んでいただけるコンテンツになります。【所要時間:約1時間】

# 9. Oracle Transaction Manager for Microservices(MicroTx)チュートリアル

+ **[Oracle Transaction Manager for Microservicesハンズオン](./microtx-for-beginners/)**  
    Oracleが提供する分散トランザクションマネージャーであるOracle Transaction Manager for Microservices(MicroTx)を体験していただけるチュートリアルです。【所要時間:約2時間】

# 10. OCI Cacheチュートリアル

+ **[OCI Cacheを使ってみよう](./ocicache-for-beginners/)**  
    Oracleが提供するフルマネージドのRedisサービスであるOCI Cacheを体験していただけるチュートリアルです。【所要時間:約1時間】

+ **[OCI Cacheを使ってレスポンス・キャッシングをしてみよう](./ocicache-for-commons/)**  
    OCI Cacheをレスポンス・キャッシングのキャッシュサーバーとして使う方法を学んでいただけるチュートリアルです。【所要時間:約1.5時間】