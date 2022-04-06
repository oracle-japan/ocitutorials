---
title: "Cloud Nativeチュートリアル"
excerpt: "OCIにおける各種コンテナ/サーバレス関連サービスのチュートリアルについて学習できるチュートリアルです。"
permalink: /cloud-native/
layout: single
tags: "cloudnative"
show_excerpts: true
toc: true
date: "2022-04-06"
lastmod: "2022-04-06"
---

このページでは、Oracle Cloud Infrastructure(OCI)の各コンテナ/サーバレス関連サービスやCI/CDサービスのチュートリアルをまとめています。  
各チュートリアルごとにステップ・バイ・ステップで学ぶことができ、各サービスの基本的な機能、操作やオペレーションについて学習することができます。  

# 1. Oracle Cloud Infrastructure DevOpsチュートリアル

<!-- ## 事前準備編 -->

<!-- + **[Oracle Cloud Infrastructure(OCI) DevOps事前準備](/ocitutorials/cloud-native/devops-for-commons/)**  
    OCI DevOpsを利用するための事前準備を行います。まずはここから始めましょう【所要時間:約30分】 -->

+ **[DevOpsことはじめ](/ocitutorials/cloud-native/devops-for-commons/)**  
    OCI DevOpsは、OCI上にCI/CD環境を構築するマネージドサービスです。
    ここでは、Oracle Container Engine for Kubernetes(OKE)サービスを利用したKubernetesクラスタの構築、アーティファクト環境とOCI DevOpsのセットアップ、CI/CDパイプラインの実装と実行までの手順を記します。【所要時間:約1時間30分】

<!-- ## 初級編

+ **[初級編 - Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-Compute編-](/ocitutorials/cloud-native/devops-for-beginners-compute)**  
    ここでは、Oracle Container Engine for Kubernetes(OKE)を利用したCI/CDパイプラインの実装と実行までの手順を記します。【所要時間:約1時間】

+ **[初級編 - Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-OKE編-](/ocitutorials/cloud-native/devops-for-beginners-oke/)**  
    ここでは、OCI Computeを利用したアプリケーション環境の構築、CI/CDパイプラインの実装と実行までの手順を記します。【所要時間:約1時間】

+ **[初級編 - Oracle Cloud Infrastructure(OCI) DevOpsことはじめ-Oracle Functions編-](/ocitutorials/cloud-native/devops-for-beginners-functions/)**  
    ここでは、Oracle Functionsを利用したCI/CDパイプラインの実装と実行までの手順を記します。【所要時間:約1時間】 -->

<br />

# 2. Oracle Container Engine for Kubernetesチュートリアル

## 事前準備編 - OKEクラスターのプロビジョニング

+ **[OKEクラスターをプロビジョニングしよう](/ocitutorials/cloud-native/oke-for-commons/)**  
    Oracle Cloud Infrastructure (OCI) の管理コンソールを利用し、OKEクラスターを作成します。まずはここから始めましょう【所要時間:約30分】

## 初級編

+ **[OKEでアプリケーションを動かしてみよう](/ocitutorials/cloud-native/oke-for-beginners/)**
    OKEに対してサンプルアプリケーションをデプロイするプロセスを通して、Kubernetesの基本的な概念や特徴、操作方法をを学びます。【所要時間:約30分】

## 中級編

+ **[Oracle Container Engine for Kubernetes(OKE)でサンプルアプリケーションのデプロイとCI/CDを体験してみよう](/ocitutorials/cloud-native/oke-for-intermediates/)**  
    OCI DevOpsを利用してCI/CD環境をセットアップし、Oracle Autonomous Transaction ProcessingをデータソースとしたJavaアプリケーションをOracle Container Engine for Kubernetes(OKE)にデプロイする一連の流れを体験することができます【所要時間:約1時間30分】

## 上級編

+ **[Oracle Container Engine for Kubernetes(OKE)でサンプルマイクロサービスアプリケーションをデプロイしてオブザバビリティツールを利用してみよう](/ocitutorials/cloud-native/oke-for-advances/)**  
    OKEを使ってサンプルマイクロサービスアプリケーションのデプロイおよびオブザバビリティを体験していただけるコンテンツです。サードパーティーとしてOSSのIstio、Prometheus、Grafana、Loki、Jaeger、Kialiを利用します。【所要時間:約2時間】

+ **[Oracle Container Engine for Kubernetes(OKE)でサンプルマイクロサービスアプリケーションをデプロイしてOCIのオブザバビリティサービスを利用してみよう](/ocitutorials/cloud-native/oke-observability-for-advances/)**  
    OKEを使ってサンプルマイクロサービスアプリケーションのデプロイおよびオブザバビリティを体験していただけるコンテンツです。OCIのオブザバビリティサービスとして、Oracle Cloud Infrastructure Monitoring、Oracle Cloud Infrastructure Logging、Oracle Cloud Infrastructure Application Performance Monitoringを利用します。【所要時間:約2時間】

<br />

# 3. Oracle Functionsチュートリアル

## 初級編

+ **[Fn Projectことはじめ](/ocitutorials/cloud-native/fn-for-beginners/)**
    Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。
    このエントリーでは、Fn Projectの環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[Oracle Functionsことはじめ](/ocitutorials/cloud-native/functions-for-beginners/)**
    Oracle Functionsは、Oracleが提供するFn Projectのマネージドサービスです。
    このエントリーでは、Oracle Functions環境構築から動作確認までの手順を記します。【所要時間:約45分】

+ **[Oracle Cloud Infrasturcture API Gateway + Oracle Functionsハンズオン](/ocitutorials/cloud-native/functions-apigateway-for-beginners/)**
    OCI API GatewayとOracle Functionsを組み合わせて、 簡単なアプリケーションを開発する手順をご紹介します。【所要時間:約1時間】

## 中級編

+ **[Oracle Functionsを利用したVMシェイプ変更](/ocitutorials/cloud-native/functions-vmshape-for-intermediates)**
    Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。
    このエントリーでは、Fn Projectの環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[Oracle Functionsを利用したATPとのREST連携](/ocitutorials/cloud-native/functions-ords-for-intermediates)**
    Oracle Functionsは、Oracleが提供するFn Projectのマネージドサービスです。
    このエントリーでは、Oracle Functions環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[Oracle Functionsを利用したOracle NoSQL Database Cloud Serviceとの連携](/ocitutorials/cloud-native/functions-nosql-for-intermediates)**
    OCI API GatewayとOracle Functionsを組み合わせて、 簡単なサーバレスアプリケーションを開発する手順をご紹介します。【所要時間:約30分】

+ **[Oracle Functionsを利用したOCI API Gatewayでの認証](/ocitutorials/cloud-native/functions-apigateway-for-intermediates)**
    OCI API GatewayとOracle Functionsを組み合わせて、 簡単なサーバレスアプリケーションを開発する手順をご紹介します。【所要時間:約30分】

<br />

# 4. OCI API Gatewayチュートリアル

## 初級編

+ **[Oracle Cloud Infrasturcture API Gateway ハンズオン](/ocitutorials/cloud-native/apigateway-for-beginners/)**
    OCI API Gatewayを利用して簡単にAPIを集約・公開する手順をご紹介します。【所要時間:約1時間】 

<br />

# 5. Helidonチュートリアル

## 初級編

+ **[Helidon(MP)ハンズオン](/ocitutorials/cloud-native/helidon-mp-for-beginners/)**
    Helidon MPは、Oracleが提供するMicroProfile準拠のマイクロサービスの開発に適したJavaアプリケーションフレームワークです。こちらのハンズオンは、サンプルアプリケーションの構築を通して、Helidonの特徴や使いやすさを学んでいただけるコンテンツになっています。【所要時間:約1時間】

+ **[Helidon(SE)ハンズオン](/ocitutorials/cloud-native/helidon-se-for-beginners/)**
    Helidon SEは、Oracleが提供するマイクロサービスの開発に適したJavaのマイクロフレームワークです。こちらのハンズオンは、サンプルアプリケーションの構築を通して、Helidonの特徴や使いやすさを学んでいただけるコンテンツになっています。【所要時間:約30分】
