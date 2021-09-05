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

### 1-2 Cloud Shellを利用してクラスタを操作

2.サービスメッシュとオブザバビリティ環境構築
---------------------------------

### 2-1 Istio（addon: Prometheus, Grafana, Jaeger, Kiali）インストール

`Istio 1.11.0` をインストールします。

バージョン値を変数にします。

```sh
ISTIO_VERSION=1.11.0
```

公式からインストールに必要なものをダウンロードします。

```sh
curl -L https://istio.io/downloadIstio | ISTIO_VERSION="${ISTIO_VERSION}" sh -
```
***コマンド結果***
```sh
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   102  100   102    0     0    213      0 --:--:-- --:--:-- --:--:--   212
100  4549  100  4549    0     0   6425      0 --:--:-- --:--:-- --:--:--  6425

Downloading istio-1.11.0 from https://github.com/istio/istio/releases/download/1.11.0/istio-1.11.0-linux-amd64.tar.gz ...

Istio 1.11.0 Download Complete!

Istio has been successfully downloaded into the istio-1.11.0 folder on your system.

Next Steps:
See https://istio.io/latest/docs/setup/install/ to add Istio to your Kubernetes cluster.

To configure the istioctl client tool for your workstation,
add the /home/yutaka_ich/istio-1.11.0/bin directory to your environment path variable with:
         export PATH="$PATH:/home/yutaka_ich/istio-1.11.0/bin"

Begin the Istio pre-installation check by running:
         istioctl x precheck 

Need more information? Visit https://istio.io/latest/docs/setup/install/ 
```

istioctlコマンドを実行できるようにパスを通します。

```sh
export PATH="${PWD}/istio-${ISTIO_VERSION}/bin:${PATH}"
```
```sh
echo PATH="\"${PWD}/istio-${ISTIO_VERSION}/bin:\${PATH}\"" >> ~/.bashrc
```

Istioのバージョンを確認します。バージョンが表示されることで、istioctlコマンドが利用できる状態です。

```sh
istioctl version
```
***コマンド結果***
```sh
no running Istio pods in "istio-system"
1.11.0
```

Istioのコンポーネントをインストールします。

```sh
istioctl install --set profile=demo --skip-confirmation
```
***コマンド結果***
```sh
✔ Istio core installed                                                                                                                           
✔ Istiod installed                                                                                                                               
✔ Egress gateways installed                                                                                                                      
✔ Ingress gateways installed                                                                                                                     
✔ Installation complete                                                                                                                          
Thank you for installing Istio 1.11.  Please take a few minutes to tell us about your install/upgrade experience!  https://forms.gle/kWULBRjUv7hHci7T6
```

必要なアドオン（Prometheus,Grafana,Kiali,Jaegerなど）をインストールします。

```sh
kubectl apply -f "istio-${ISTIO_VERSION}/samples/addons/"
```
***コマンド結果***
```sh
serviceaccount/grafana created
configmap/grafana created
service/grafana created
deployment.apps/grafana created
configmap/istio-grafana-dashboards created
configmap/istio-services-grafana-dashboards created
deployment.apps/jaeger created
service/tracing created
service/zipkin created
service/jaeger-collector created
serviceaccount/kiali created
configmap/kiali created
clusterrole.rbac.authorization.k8s.io/kiali-viewer created
clusterrole.rbac.authorization.k8s.io/kiali created
clusterrolebinding.rbac.authorization.k8s.io/kiali created
role.rbac.authorization.k8s.io/kiali-controlplane created
rolebinding.rbac.authorization.k8s.io/kiali-controlplane created
service/kiali created
deployment.apps/kiali created
serviceaccount/prometheus created
configmap/prometheus created
clusterrole.rbac.authorization.k8s.io/prometheus created
clusterrolebinding.rbac.authorization.k8s.io/prometheus created
service/prometheus created
deployment.apps/prometheus created
```

Prometheus、Grafana、Kiali、JaegerのWebUIにブラウザからアクセスできるようにします。

```sh
kubectl patch service prometheus -n istio-system -p '{"spec": {"type": "NodePort"}}'
```
***コマンド結果***
```sh
service/prometheus patched
```
***コマンド結果***
```sh
kubectl patch service grafana -n istio-system -p '{"spec": {"type": "NodePort"}}'
```
***コマンド結果***
```sh
service/grafana patched
```
***コマンド結果***
```sh
kubectl patch service kiali -n istio-system -p '{"spec": {"type": "NodePort"}}'
```
***コマンド結果***
```sh
service/kiali patched
```
***コマンド結果***
```sh
kubectl patch service tracing -n istio-system -p '{"spec": {"type": "NodePort"}}'
```
***コマンド結果***
```sh
service/tracing patched
```
ServiceとDeploymentの状況を確認します。
「service/prometheus」、「service/grafana」、「service/kiali」、「service/tracing」のTYPEがNodePortになっていることを確認します。「service/istio-ingressgateway」については、しばらくするとEXTERNAL-IPアドレスが自動で付与されます。

```sh
kubectl get services,deployments -n istio-system -o wide
```
***コマンド結果***
```sh
NAME                           TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                                      AGE   SELECTOR
service/grafana                NodePort       10.96.96.80     <none>        3000:31746/TCP                                                               21m   app.kubernetes.io/instance=grafana,app.kubernetes.io/name=grafana
service/istio-egressgateway    ClusterIP      10.96.110.50    <none>        80/TCP,443/TCP                                                               22m   app=istio-egressgateway,istio=egressgateway
service/istio-ingressgateway   LoadBalancer   10.96.16.94     <pending>     15021:32007/TCP,80:32374/TCP,443:32343/TCP,31400:30388/TCP,15443:31719/TCP   22m   app=istio-ingressgateway,istio=ingressgateway
service/istiod                 ClusterIP      10.96.235.244   <none>        15010/TCP,15012/TCP,443/TCP,15014/TCP                                        22m   app=istiod,istio=pilot
service/jaeger-collector       ClusterIP      10.96.121.97    <none>        14268/TCP,14250/TCP,9411/TCP                                                 21m   app=jaeger
service/kiali                  NodePort       10.96.182.15    <none>        20001:31964/TCP,9090:31854/TCP                                               21m   app.kubernetes.io/instance=kiali,app.kubernetes.io/name=kiali
service/prometheus             NodePort       10.96.238.223   <none>        9090:31147/TCP                                                               21m   app=prometheus,component=server,release=prometheus
service/tracing                NodePort       10.96.216.254   <none>        80:32418/TCP,16685:31229/TCP                                                 21m   app=jaeger
service/zipkin                 ClusterIP      10.96.184.172   <none>        9411/TCP                                                                     21m   app=jaeger

NAME                                   READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS                                             IMAGES                                                       SELECTOR
deployment.apps/grafana                1/1     1            1           21m   grafana                                                grafana/grafana:7.5.5                                        app.kubernetes.io/instance=grafana,app.kubernetes.io/name=grafana
deployment.apps/istio-egressgateway    1/1     1            1           22m   istio-proxy                                            docker.io/istio/proxyv2:1.11.0                               app=istio-egressgateway,istio=egressgateway
deployment.apps/istio-ingressgateway   1/1     1            1           22m   istio-proxy                                            docker.io/istio/proxyv2:1.11.0                               app=istio-ingressgateway,istio=ingressgateway
deployment.apps/istiod                 1/1     1            1           22m   discovery                                              docker.io/istio/pilot:1.11.0                                 istio=pilot
deployment.apps/jaeger                 1/1     1            1           21m   jaeger                                                 docker.io/jaegertracing/all-in-one:1.23                      app=jaeger
deployment.apps/kiali                  1/1     1            1           21m   kiali                                                  quay.io/kiali/kiali:v1.38                                    app.kubernetes.io/instance=kiali,app.kubernetes.io/name=kiali
deployment.apps/prometheus             1/1     1            1           21m   prometheus-server-configmap-reload,prometheus-server   jimmidyson/configmap-reload:v0.5.0,prom/prometheus:v2.26.0   app=prometheus,component=server,release=prometheus
```

OCIダッシュボードから、[Networking]-[Virtual Cloud Networks]を選択して対象のVCNを選択します。

3つあるうちの一番上段のものを選択します。

「oke-nodesubnet-quick-cluster1-xxxxxxxxx-regional」を選択します。

「Add Ingress Rules」ボタンをクリックします。

以下を設定して、「Add Ingress Rules」ボタンをクリックします。

SOURCE CIDR: 0.0.0.0/0
IP PROTOCOL: All Protocols

NodeのEXTERNAL-IPを確認します。

```sh
kubectl get nodes -o wide
```
***コマンド結果***
```sh
NAME          STATUS   ROLES   AGE     VERSION   INTERNAL-IP   EXTERNAL-IP       OS-IMAGE                  KERNEL-VERSION                    CONTAINER-RUNTIME
10.0.10.133   Ready    node    7m13s   v1.20.8   10.0.10.133   150.136.xxx.xxx    Oracle Linux Server 7.9   5.4.17-2102.203.6.el7uek.x86_64   cri-o://1.20.2
10.0.10.179   Ready    node    7m23s   v1.20.8   10.0.10.179   132.145.xxx.xxx   Oracle Linux Server 7.9   5.4.17-2102.203.6.el7uek.x86_64   cri-o://1.20.2
10.0.10.84    Ready    node    7m19s   v1.20.8   10.0.10.84    129.213.xxx.xxx    Oracle Linux Server 7.9   5.4.17-2102.203.6.el7uek.x86_64   cri-o://1.20.2
```

Prometheus,Grafana,Kiali,JaegerのNodePortを確認します。各サービス名の「3000:31746」コロン後がNodePort番号です。

サービス名は、Jaegerだけtracingとなります。

* Prometheus:prometheus
* Grafana:grafana
* Kiali:kiali
* Jaeger:tracing

```sh
kubectl get services -n istio-system
```
***コマンド結果***
```sh
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                                      AGE
grafana                NodePort       10.96.96.80     <none>        3000:31746/TCP                                                               25m
istio-egressgateway    ClusterIP      10.96.110.50    <none>        80/TCP,443/TCP                                                               25m
istio-ingressgateway   LoadBalancer   10.96.16.94     <pending>     15021:32007/TCP,80:32374/TCP,443:32343/TCP,31400:30388/TCP,15443:31719/TCP   25m
istiod                 ClusterIP      10.96.235.244   <none>        15010/TCP,15012/TCP,443/TCP,15014/TCP                                        25m
jaeger-collector       ClusterIP      10.96.121.97    <none>        14268/TCP,14250/TCP,9411/TCP                                                 25m
kiali                  NodePort       10.96.182.15    <none>        20001:31964/TCP,9090:31854/TCP                                               25m
prometheus             NodePort       10.96.238.223   <none>        9090:31147/TCP                                                               25m
tracing                NodePort       10.96.216.254   <none>        80:32418/TCP,16685:31229/TCP                                                 25m
zipkin                 ClusterIP      10.96.184.172   <none>        9411/TCP
```

ブラウザでアクセスします。NodeのEXTERNAL-IPは3ノードの内どれを利用して問題ありません。

http://EXTERNAL-IP:NodePort/

### 2-2 Grafana Loki インストール

Helmを利用して、Grafana Lokiをインストールします。

Grafana公式のHelmチャートリポジトリを追加します。

```sh
helm repo add grafana https://grafana.github.io/helm-charts
```
***コマンド結果***
```sh
WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /home/yutaka_ich/.kube/config
WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /home/yutaka_ich/.kube/config
"grafana" has been added to your repositories
```

Helmチャートを最新化します。

```sh
helm repo update
```
***コマンド結果***
```sh
WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /home/yutaka_ich/.kube/config
WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /home/yutaka_ich/.kube/config
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "argo" chart repository
...Successfully got an update from the "grafana" chart repository
Update Complete. ⎈Happy Helming!⎈
```

Grafana Lokiをインストールします。

```sh
helm upgrade --install loki --namespace=istio-system grafana/loki-stack
```
***コマンド結果***
```sh
WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /home/yutaka_ich/.kube/config
WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /home/yutaka_ich/.kube/config
Release "loki" does not exist. Installing it now.
NAME: loki
LAST DEPLOYED: Sun Aug 22 07:22:15 2021
NAMESPACE: istio-system
STATUS: deployed
REVISION: 1
NOTES:
The Loki stack has been deployed to your cluster. Loki can now be added as a datasource in Grafana.

See http://docs.grafana.org/features/datasources/loki/ for more detail.
```

「Loki-0」、「loki-promtail-xxxxx」(3個)がRunningであることを確認します。

```sh
kubectl get pods -n istio-system
```
***コマンド結果***
```sh
NAME                                    READY   STATUS    RESTARTS   AGE
grafana-556f8998cd-bkrw8                1/1     Running   0          36m
istio-egressgateway-9dc6cbc49-rv9ll     1/1     Running   0          37m
istio-ingressgateway-7975cdb749-tk4rf   1/1     Running   0          37m
istiod-77b4d7b55d-tq7hh                 1/1     Running   0          37m
jaeger-5f65fdbf9b-28v7w                 1/1     Running   0          36m
kiali-787bc487b7-jkc22                  1/1     Running   0          36m
loki-0                                  1/1     Running   0          2m46s
loki-promtail-lzxg5                     1/1     Running   0          2m46s
loki-promtail-rlrq2                     1/1     Running   0          2m46s
loki-promtail-s7rfz                     1/1     Running   0          2m46s
prometheus-9f4947649-c7swm              2/2     Running   0          36m
```

### 2-3 Grafana Lokiのセットアップ

Grafanaダッシュボードを開いて、左メニューの[Configuration]-[Data Sources]を選択します。

「Add data source」ボタンをクリックします。

「Logging & document databases」にある「Loki」にカーソルを合わせて「Select」ボタンをクリックします。

Lokiの設定画面の「URL」に「http://loki:3100/」と入力して、「Save & Test」ボタンをクリックします。

左メニューの「Explore」を選択して、プルダウンメニューのLokiを選択できれば完了です。


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

