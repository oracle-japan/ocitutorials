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

```sh
kubectl get nodes
```

2.サービスメッシュとオブザバビリティ環境構築
---------------------------------

### 2-1 Istio（addon: Prometheus, Grafana, Jaeger, Kiali）インストール

### 2-2 Grafana Loki インストール

3.マイクロサービスアプリケーションの作成
---------------------------------

4.カナリアリリース
---------------------------------

5.Prometheus、Grafana、Loki、Jaeger、Kialiによるオブザバビリティ
---------------------------------

