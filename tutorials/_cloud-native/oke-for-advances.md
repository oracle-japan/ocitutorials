---
title: "Kubernetesでサンプルマイクロサービスアプリケーションをデプロイしてオブザバビリティツールを利用してみよう"
excerpt: "OKEを使ってサンプルマイクロサービスアプリケーションのデプロイおよびオブザバビリティを体験していただけるコンテンツです。サードパーティーとしてOSSのIstio、Prometheus、Grafana、Loki、Jaeger、Kialiを利用します。"
order: "030"
tags:
---

このハンズオンでは、Oracle Container Engine for Kubernetes（以下OKE）上に、マイクロサービスアプリケーションをデプロイします。そして、OSSのオブザバビリティツールを利用して、モニタリング、ロギング、トレーシングを実践的に学びます。

オブザバビリティツールとして、以下を利用します。

モニタリング

* [Prometheus](https://github.com/prometheus/prometheus) + [Grafana](https://github.com/grafana/grafana)

ロギング

* [Grafana Loki](https://github.com/grafana/loki)

トレーシング

* [Jaeger](https://github.com/jaegertracing/jaeger)

サービスメッシュオブザバビリティ

* [Kiali](https://github.com/kiali/kiali)

ハンズオンの流れは以下となります。

1. OKEクラスタ構築

2. サービスメッシュとオブザバビリティ環境構築
    1. Istio（addon: Prometheus, Grafana, Jaeger, Kiali）インストール
    2. Grafana Loki インストール

3. マイクロサービスアプリケーションの作成

4. カナリアリリース

5. Prometheus、Grafana、Loki、Jaeger、Kialiによるオブザバビリティ


1.OKEクラスタ構築
---------------------------------

### 1-1 OCIダッシュボードからOKEクラスタの構築

左上のハンバーガーメニューを展開して、「開発者サービス」から「Kubernetesクラスタ(OKE)」を選択します。

![](1-001.png)

「クラスタの作成」ボタンをクリックします。

![](1-002.png)

「クイック作成」が選択されていることを確認して、「ワークフローの起動」ボタンをクリックします。

![](1-003.png)

以下を設定します。

「Kubernetesワーカー・ノード」:「パブリック・ワーカー」
「シェイプ」：「VM Standard.E3.Flex」
「OCPU数の選択」:「2」
「メモリー量（GB）」：「32」

![](1-004.png)

画面左下の「次」ボタンをクリックします。

![](1-005.png)

画面左下の「クラスタ作成」ボタンをクリックします。

![](1-006.png)

画面左下の「閉じる」ボタンをクリックします。

![](1-007.png)

```sh
kubectl get nodes
```

2.サービスメッシュとオブザバビリティ環境構築
---------------------------------

### 2-1 Istio（addon: Prometheus, Grafana, Jaeger, Kiali）インストール

### 2-2 Grafana Loki インストール

3.マイクロサービスアプリケーションの作成
---------------------------------

この手順では、1および2で構築したIstio環境に対してマイクロサービスをデプロイしていきます。  

### 3-1 マイクロサービスのcloneとアプリケーションの説明

まずは以下のGitレポジトリをcloneします。  

```sh
git clone https://github.com/oracle-japan/code-at-customer-handson
```

このハンズオン用に作成したサンプルのマイクロサービスアプリケーションです。  
中身を簡単に紹介します。  

```sh
.
├── README.md
├── k8s ==> KubernetesのMainifest群
├── olympic_backend ==> バックエンド用アプリケーション
├── olympic_datasource ==> データソース用アプリケーション
├── olympic_frontend ==> フロントエンド用アプリケーション
.
```

このサンプルアプリケーションは、主に以下の2つから構成されています。
* `Helidon`
  * Oracleがオープンソースで提供しているJavaのマイクロサービスフレームワーク
* `Oracle JavaScript Extension Toolkit（Oracle JET）`
  * Oracleがオープンソースで開発しているJavascript用フレームワーク
  * 業界標準として普及しているオープンソース・フレームワークに基づき、開発者がより優れたアプリケーションをより迅速に構築できるよう支援する高度な機能とサービスを付加

Helidon

* [Helidon](https://oracle-japan-oss-docs.github.io/helidon/docs/v2/#/about/01_overview)

Oracle JavaScript Extension Toolkit（Oracle JET）

* [Oracle JavaScript Extension Toolkit（Oracle JET）](https://www.oracle.com/jp/application-development/technologies/jet/oracle-jet.html)

簡単にアプリケーションの構成を見ていきます。

4.カナリアリリース
---------------------------------

5.Prometheus、Grafana、Loki、Jaeger、Kialiによるオブザバビリティ
---------------------------------

