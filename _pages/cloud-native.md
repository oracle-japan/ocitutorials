---
title: "Cloud Nativeチュートリアル"
excerpt: "OCIにおける各種コンテナ/サーバレス関連サービスのチュートリアルについて学習できるチュートリアルです。"
permalink: /cloud-native/
layout: single
tags: "cloudnative"
show_excerpts: true
toc: true
---

このページでは、Oracle Cloud Infrastructure(OCI)の各コンテナ/サーバレス関連サービスのチュートリアルをまとめています。  
各チュートリアルごとにステップ・バイ・ステップで学ぶことができ、各サービスの基本的な機能、操作やオペレーションについて学習することができます。  

# 1. Oracle Container Engine for Kubernetes(OKE)チュートリアル

## 事前準備編 - OKEクラスターのプロビジョニング

+ **[OKEクラスターをプロビジョニングしよう](https://oracle-japan.github.io/paasdocs/documents/containers/common/)**  
    Oracle Cloud Infrastructure (OCI) の管理コンソールを利用し、OKEクラスターを作成します。まずはここから始めましょう【所要時間:約30分】

## 初級編

+ **[OKEでアプリケーションを動かしてみよう](https://oracle-japan.github.io/paasdocs/documents/containers/handson/k8s-walkthrough/)**
    OKEに対してサンプルアプリケーションをデプロイするプロセスを通して、基本的な操作を学びます。【所要時間:約30分】

+ **[Kubernetesの基本的な操作を体験しよう](https://oracle-japan.github.io/paasdocs/documents/containers/handson/k8s-basic-ops/)**
    OKEとサンプルアプリケーションを利用して、Kubernetesの基本的な概念や特徴、操作方法を学びます。【所要時間:約30分】

## 中級編

+ **[KubernetesでサンプルアプリケーションのデプロイとCI/CDを体験してみよう](https://oracle-japan.github.io/paasdocs/documents/microservices/tutorials/WorkshopGuide000InstallSoftware/)**  
    Oracle Visual Builder Studioを利用してCI/CD環境をセットアップし、Oracle Autonomous Transaction ProcessingをデータソースとしたJavaアプリケーションをOracle Container Engine for Kubernetes(OKE)にデプロイする一連の流れを体験することができます【所要時間:約1時間30分】

<br />

# 2. Oracle Functionsチュートリアル

## 初級編

+ **[Fn Projectことはじめ](https://oracle-japan.github.io/paasdocs/documents/faas/fn/handson/getting-started/)**
    Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。
    このエントリーでは、Fn Projectの環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[Oracle Functionsことはじめ](https://oracle-japan.github.io/paasdocs/documents/faas/oraclefunctions/handson/getting-started/)**
    Oracle Functionsは、Oracleが提供するFn Projectのマネージドサービスです。
    このエントリーでは、Oracle Functions環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[Oracle Cloud Infrasturcture API Gateway + Oracle Functionsハンズオン](https://oracle-japan.github.io/paasdocs/documents/faas/with_apigw/)**
    OCI API GatewayとOracle Functionsを組み合わせて、 簡単なサーバレスアプリケーションを開発する手順をご紹介します。【所要時間:約1時間】

## 中級編

+ **[Oracle Functionsを利用したVMシェイプ変更](https://oracle-japan.github.io/paasdocs/documents/faas/resize_vmshape/)**
    Fn Projectは、開発者エクスペリエンス重視なFaaSを構築するためのプラットフォームです。
    このエントリーでは、Fn Projectの環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[Oracle Functionsを利用したATPとのREST連携](https://oracle-japan.github.io/paasdocs/documents/faas/functions_to_atp_with_ords/)**
    Oracle Functionsは、Oracleが提供するFn Projectのマネージドサービスです。
    このエントリーでは、Oracle Functions環境構築から動作確認までの手順を記します。【所要時間:約30分】

+ **[Oracle Functionsを利用したOracle NoSQL Database Cloud Serviceとの連携](https://oracle-japan.github.io/paasdocs/documents/faas/functions_to_nosql/)**
    OCI API GatewayとOracle Functionsを組み合わせて、 簡単なサーバレスアプリケーションを開発する手順をご紹介します。【所要時間:約30分】

+ **[Oracle Functionsを利用したOCI API Gatewayでの認証](https://oracle-japan.github.io/paasdocs/documents/faas/apigw_auth_with_functions/)**
    OCI API GatewayとOracle Functionsを組み合わせて、 簡単なサーバレスアプリケーションを開発する手順をご紹介します。【所要時間:約30分】

<br />

# 3. OCI API Gatewayチュートリアル

## 初級編

+ **[Oracle Cloud Infrasturcture API Gateway ハンズオン](https://oracle-japan.github.io/paasdocs/documents/api-management/handson/getting-started/)**
    OCI API Gatewayを利用して簡単にAPIを集約・公開する手順をご紹介します。【所要時間:約1時間】 

<br />

# 4. Helidonチュートリアル

## 初級編

+ **[Helidon(MP)ハンズオン](/ocitutorials/cloud-native/helidon-mp-for-beginners/)**
    Helidon MPは、Oracleが提供するMicroProfile準拠のマイクロサービスの開発に適したJavaアプリケーションフレームワークです。こちらのハンズオンは、サンプルアプリケーションの構築を通して、Helidonの特徴や使いやすさを学んでいただけるコンテンツになっています。【所要時間:約1時間】

+ **[Helidon(SE)ハンズオン](/ocitutorials/cloud-native/helidon-se-for-beginners/)**
    Helidon SEは、Oracleが提供するマイクロサービスの開発に適したJavaのマイクロフレームワークです。こちらのハンズオンは、サンプルアプリケーションの構築を通して、Helidonの特徴や使いやすさを学んでいただけるコンテンツになっています。【所要時間:約30分】

<br />

# 5. Oracle Cloud Data Scienceチュートリアル

## 初級編

+ **[Oracle Cloud Data Scienceハンズオン](https://github.com/oracle-japan/oci-datascience-hol01/)**
    Oracle Cloud Infrastructure Data ScienceとOracleが提供するAccerlerated Data Science(ADS)という機械学習ライブラリを利用して社員の離職率を予測する手順をご案内します。【所要時間:約2時間30分】