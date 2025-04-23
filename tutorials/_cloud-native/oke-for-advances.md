---
title: "Oracle Container Engine for Kubernetes(OKE)でサンプルマイクロサービスアプリケーションをデプロイしてオブザバビリティツールを利用してみよう"
excerpt: "OKEを使ってサンプルマイクロサービスアプリケーションのデプロイおよびオブザバビリティを体験していただけるコンテンツです。サードパーティーとしてOSSのIstio、Prometheus、Grafana、Loki、Jaeger、Kialiを利用します。"
order: "031"
tags:
---

このハンズオンでは、Oracle Container Engine for Kubernetes（以下OKE）上に、マイクロサービスアプリケーションをデプロイします。そして、OSSのオブザバビリティツールを利用して、モニタリング、ロギング、トレーシングを実践的に学びます。

オブザバビリティツールとして、以下を利用します。

***モニタリング***

* [Prometheus](https://github.com/prometheus/prometheus) + [Grafana](https://github.com/grafana/grafana)

***ロギング***

* [Grafana Loki](https://github.com/grafana/loki)

***トレーシング***

* [Jaeger](https://github.com/jaegertracing/jaeger)

***サービスメッシュオブザバビリティ***

* [Kiali](https://github.com/kiali/kiali)

ハンズオンの流れは以下となります。

---
1. OKEクラスタ構築
    1. OCIダッシュボードからOKEクラスタの構築
    2. Cloud Shellを利用してクラスタを操作

2. サービスメッシュとオブザバビリティ環境構築
    1. Istio（addon: Prometheus, Grafana, Jaeger, Kiali）インストール
    2. Grafana Loki インストール
    3. Grafana Lokiのセットアップ
    4. node exporterのインストール
    5. Prometheus WebUIからPromQLの実行

3. サンプルアプリケーションでObservabilityを体験してみよう
    1. サンプルアプリケーションの概要説明
    2. サンプルアプリケーションのビルドとデプロイ
    3. Grafana Lokiを利用したログ監視
    4. Jaegerを利用したトレーシング
    5. Kialiを利用したService Meshの可視化

4. Istioを利用したカナリアリリース
    1. カナリアリリース

---

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

黄色の「作成中」から緑の「アクティブ」になることを確認します。「アクティブ」であればクラスタ作成は完了です。

![](1-008.png)

### 1-2 Cloud Shellを利用してクラスタを操作

Cloud Shellを利用して、作成したKubernetesクラスタに接続します。

「クラスタへのアクセス」ボタンをクリックします。

![](1-009.png)

「Cloud Shellの起動」ボタン、「コピー」リンクテキスト、「閉じる」ボタンの順にクリックします。

![](1-010.png)

Cloud Shell起動後、「コピー」した内容をペーストして、Enterキーを押します。

![](1-011.png)

以下コマンドを実行して、3ノードの「STATUS」が「Ready」になっていることを確認します。

```sh
kubectl get nodes
```
***コマンド結果***
```sh
NAME          STATUS   ROLES   AGE   VERSION
10.0.10.111   Ready    node    61m   v1.20.8
10.0.10.254   Ready    node    61m   v1.20.8
10.0.10.87    Ready    node    61m   v1.20.8
```

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

Istioのバージョンを確認します。バージョンが表示されることで、istioctlコマンドが利用できる状態です。

```sh
istioctl version
```
***コマンド結果***
```sh
no running Istio pods in "istio-system"
1.21.0
```

Istioのコンポーネントをインストールします。

```sh
istioctl install --set profile=demo --skip-confirmation --set components.cni.enabled=true
```
***コマンド結果***
```sh
✔ Istio core installed                                                                                                                           
✔ Istiod installed
✔ CNI installed   
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

Istioで利用するサイドカープロキシを自動でPodに挿入する設定を加えます。

```sh
kubectl label namespace default istio-injection=enabled
```
***コマンド結果***
```sh
namespace/default labeled
```

現時点では、Kubernetesクラスタ外部からアクセスできない状況です。
アドオンとしてインストールしたPrometheus、Grafana、Kiali、JaegerのWebコンソールにブラウザからアクセスできるように、
各コンポーネントのServiceオブジェクトに`NodePort`の設定を行います。

```sh
kubectl patch service prometheus -n istio-system -p '{"spec": {"type": "NodePort"}}'
```
***コマンド結果***
```sh
service/prometheus patched
```

---

```sh
kubectl patch service grafana -n istio-system -p '{"spec": {"type": "NodePort"}}'
```
***コマンド結果***
```sh
service/grafana patched
```

---

```sh
kubectl patch service kiali -n istio-system -p '{"spec": {"type": "NodePort"}}'
```
***コマンド結果***
```sh
service/kiali patched
```

---

```sh
kubectl patch service tracing -n istio-system -p '{"spec": {"type": "NodePort"}}'
```
***コマンド結果***
```sh
service/tracing patched
```

---

ServiceとDeploymentの状況を確認します。
「service/prometheus」、「service/grafana」、「service/kiali」、「service/tracing」のTYPEが`NodePort`になっていることを確認します。「service/istio-ingressgateway」については、しばらくするとEXTERNAL-IPアドレスが自動で付与されます。

```sh
kubectl get services,deployments -n istio-system -o wide
```
***コマンド結果***
```sh
NAME                           TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)                                                                      AGE     SELECTOR
service/grafana                NodePort       10.96.142.228   <none>           3000:30536/TCP                                                               96s     app.kubernetes.io/instance=grafana,app.kubernetes.io/name=grafana
service/istio-egressgateway    ClusterIP      10.96.50.236    <none>           80/TCP,443/TCP                                                               2m9s    app=istio-egressgateway,istio=egressgateway
service/istio-ingressgateway   LoadBalancer   10.96.197.12    168.138.xx.xxx   15021:31268/TCP,80:32151/TCP,443:30143/TCP,31400:30084/TCP,15443:32534/TCP   2m9s    app=istio-ingressgateway,istio=ingressgateway
service/istiod                 ClusterIP      10.96.80.173    <none>           15010/TCP,15012/TCP,443/TCP,15014/TCP                                        2m28s   app=istiod,istio=pilot
service/jaeger-collector       ClusterIP      10.96.223.176   <none>           14268/TCP,14250/TCP,9411/TCP                                                 95s     app=jaeger
service/kiali                  NodePort       10.96.65.161    <none>           20001:32446/TCP,9090:31546/TCP                                               95s     app.kubernetes.io/instance=kiali,app.kubernetes.io/name=kiali
service/prometheus             NodePort       10.96.227.118   <none>           9090:32582/TCP                                                               94s     app=prometheus,component=server,release=prometheus
service/tracing                NodePort       10.96.67.34     <none>           80:31870/TCP,16685:32400/TCP                                                 95s     app=jaeger
service/zipkin                 ClusterIP      10.96.222.186   <none>           9411/TCP                                                                     95s     app=jaeger

NAME                                   READY   UP-TO-DATE   AVAILABLE   AGE     CONTAINERS                                             IMAGES                                                       SELECTOR
deployment.apps/grafana                1/1     1            1           95s     grafana                                                grafana/grafana:7.5.5                                        app.kubernetes.io/instance=grafana,app.kubernetes.io/name=grafana
deployment.apps/istio-egressgateway    1/1     1            1           2m9s    istio-proxy                                            docker.io/istio/proxyv2:1.11.0                               app=istio-egressgateway,istio=egressgateway
deployment.apps/istio-ingressgateway   1/1     1            1           2m9s    istio-proxy                                            docker.io/istio/proxyv2:1.11.0                               app=istio-ingressgateway,istio=ingressgateway
deployment.apps/istiod                 1/1     1            1           2m28s   discovery                                              docker.io/istio/pilot:1.11.0                                 istio=pilot
deployment.apps/jaeger                 1/1     1            1           95s     jaeger                                                 docker.io/jaegertracing/all-in-one:1.23                      app=jaeger
deployment.apps/kiali                  1/1     1            1           95s     kiali                                                  quay.io/kiali/kiali:v1.38                                    app.kubernetes.io/instance=kiali,app.kubernetes.io/name=kiali
deployment.apps/prometheus             1/1     1            1           94s     prometheus-server-configmap-reload,prometheus-server   jimmidyson/configmap-reload:v0.5.0,prom/prometheus:v2.26.0   app=prometheus,component=server,release=prometheus
```

次に、WebブラウザからNodePort経由でアクセスできるように、セキュリティリストを変更します。

OCIコンソールから、[ネットワーキング]-[仮想クラウド・ネットワーク]を選択して対象となる`oke-vcn-quick-cluster1-xxxxxxxxx`を選択します。

![](1-027.png)

![](1-032.png)

3つあるサブネットのうち、ワーカノードが属するサブネット`oke-nodesubnet-quick-cluster1-xxxxxxxxx-regional`を選択します。

![](1-028.png)

リストに表示される、`oke-nodeseclist-quick-cluster1-xxxxxxxxx`を選択します。

![](1-029.png)

「イングレス・ルールの追加」ボタンをクリックします。

![](1-030.png)

以下を設定して、「イングレス・ルールの追加」ボタンをクリックします。

`ソースCIDR: 0.0.0.0/0`<br>
`宛先ポート範囲: 30000-65535`

![](1-031.png)

以上で、セキュリティリストの変更は完了です。

次に、WebブラウザでアクセスするNodeの`EXTERNAL-IP`を確認します。
利用する`EXTERNAL-IP`は、どれも利用可能です。Webブラウザで利用する際に、どれか一つ選択をしてください。

```sh
kubectl get nodes -o wide
```
***コマンド結果***
```sh
NAME          STATUS   ROLES   AGE   VERSION   INTERNAL-IP   EXTERNAL-IP     OS-IMAGE                  KERNEL-VERSION                      CONTAINER-RUNTIME
10.0.10.111   Ready    node    61m   v1.20.8   10.0.10.111   140.83.60.38    Oracle Linux Server 7.9   5.4.17-2102.204.4.4.el7uek.x86_64   cri-o://1.20.2
10.0.10.254   Ready    node    60m   v1.20.8   10.0.10.254   140.83.50.44    Oracle Linux Server 7.9   5.4.17-2102.204.4.4.el7uek.x86_64   cri-o://1.20.2
10.0.10.87    Ready    node    60m   v1.20.8   10.0.10.87    140.83.84.231   Oracle Linux Server 7.9   5.4.17-2102.204.4.4.el7uek.x86_64   cri-o://1.20.2
```

Prometheus,Grafana,Kiali,Jaegerの`NodePort`を確認します。
TYPEが`NodePort`となっているServiceのPORT(S)「xxxxx:30000」コロン後の30000以上のポート番号が`NodePort`番号です。

**Jaegerのサービス名について**  
サービス名は、Jaegerだけtracingとなるので、ご注意ください。  
{: .notice--warning}

* Prometheus:prometheus
* Grafana:grafana
* Kiali:kiali
* Jaeger:tracing

```sh
kubectl get services -n istio-system
```
***コマンド結果***
```sh
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)                                                                      AGE
grafana                NodePort       10.96.142.228   <none>           3000:30536/TCP                                                               11m
istio-egressgateway    ClusterIP      10.96.50.236    <none>           80/TCP,443/TCP                                                               11m
istio-ingressgateway   LoadBalancer   10.96.197.12    168.138.xx.xxx   15021:31268/TCP,80:32151/TCP,443:30143/TCP,31400:30084/TCP,15443:32534/TCP   11m
istiod                 ClusterIP      10.96.80.173    <none>           15010/TCP,15012/TCP,443/TCP,15014/TCP                                        12m
jaeger-collector       ClusterIP      10.96.223.176   <none>           14268/TCP,14250/TCP,9411/TCP                                                 11m
kiali                  NodePort       10.96.65.161    <none>           20001:32446/TCP,9090:31546/TCP                                               11m
prometheus             NodePort       10.96.227.118   <none>           9090:32582/TCP                                                               11m
tracing                NodePort       10.96.67.34     <none>           80:31870/TCP,16685:32400/TCP                                                 11m
zipkin                 ClusterIP      10.96.222.186   <none>           9411/TCP                                                                     11m
```

上記コマンド結果を例にすると、以下コロン後の30000以上ポート番号となります。
ご自身のと置き換えて対応してください。

* Prometheus 9090:32582
* Grafana 3000:30536
* Kiali 20001:32446
* Jaeger 80:31870

先ほど確認した、EXTERNAL-IPと各`NodePort`を指定して、Webブラウザからアクセスしてください。

`http://EXTERNAL-IP:NodePort/`

### 2-2 Grafana Loki インストール

Helmを利用して、Grafana Lokiをインストールします。

**Helmについて**  
Helmは、Kubernetesのパッケージマネージャです。パッケージは、Chartと呼ばれ、リポジトリがあります。
Helmは、Linuxのdnfやapt、Chartはrpmやdebのようなものと捉えてください。
Chartは、マニフェストのテンプレート（雛形）であり、そのテンプレートに指定した変数のパラメータをvalues.yamlに定義、
このChartとvalues.yamlの組み合わせで、新たなマニフェストを生成してKubernetesクラスタに登録する仕組みです。
このHelmを利用して、マニフェストをテンプレート化することで、マニフェストが大量とならないように管理の効率化を図ることができます。
{: .notice--info}

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

Grafanaにアクセスします。

```sh
kubectl get services grafana -n istio-system
```
***コマンド結果***
```
NAME      TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
grafana   NodePort   10.96.142.228   <none>        3000:30536/TCP   127m
```

GrafanaのアクセスにはNodePortを利用します。  
NodePortは`PORT(S)`の`:`以降のポート番号です。  
上記の場合、以下のURLにアクセスします。  
http://[WorkerNodeのパブリックIP]:30536

左メニューの[Configuration]-[Data Sources]を選択します。

![](1-012.png)

「Add data source」ボタンをクリックします。

![](1-013.png)

「Logging & document databases」にある「Loki」にカーソルを合わせて「Select」ボタンをクリックします。

![](1-014.png)

Lokiの設定画面の「URL」に`http://loki:3100/`と入力、「Maximum lines」に`1000`と入力して、「Save & Test」ボタンをクリックします。

![](1-015.png)

左メニューの「Explore」を選択します。

![](1-016.png)

画面遷移後、画面左上のプルダウンメニューで「Loki」を選択します。

![](1-017.png)

「Log browser」に`{app="istiod"}`と入力して、「Run Query」ボタンをクリックします。

![](1-018.png)

ログが表示されれば、セットアップは完了です。

### 2-4 node exporterのインストール

各ノードのメトリクスを取集するためにnode exporterを各ノードに配備します。

既に作成済みのnode exporterのマニフェストを利用して、Kubernetesクラスタに適用します。

```sh
kubectl apply -f https://raw.githubusercontent.com/oracle-japan/ochacafe-s4-6/main/manifests/node-exporter-handson.yaml
```
***コマンド結果***
```sh
serviceaccount/node-exporter-handson created
service/node-exporter-handson created
daemonset.apps/node-exporter-handson created
```

`node-exporter-handson`というPodの「STATUS」が「Running」であることを確認します。

```sh
kubectl get pods
```
***コマンド結果***
```
NAME                          READY   STATUS    RESTARTS   AGE
node-exporter-handson-56m4h   1/1     Running   0          25s
node-exporter-handson-r7br8   1/1     Running   0          25s
node-exporter-handson-rr2rf   1/1     Running   0          25s
```

### 2-5 Prometheus WebUIからPromQLの実行

Prometheus WebUIからPromQLを実行して、3ノードの各ノードのメモリ空き容量と3ノードでのメモリ空き容量の合計を確認します。
まずは、ブラウザでPrometheus WebUIにアクセスします。

```sh
kubectl get services prometheus -n istio-system
```
***コマンド結果***
```
NAME         TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
prometheus   NodePort   10.96.227.118   <none>        9090:32582/TCP   136m
```

GrafanaのアクセスにはNodePortを利用します。  
NodePortは`PORT(S)`の`:`以降のポート番号です。  
上記の場合、以下のURLにアクセスします。  
http://[WorkerNodeのパブリックIP]:32582

![](1-019.png)

`node_memory_MemAvailable_bytes`を入力して、「Execute」ボタンをクリックします。

![](1-020.png)

各ノードのメモリ空き容量が表示されます。「Graph」タブをクリックすると、グラフで見ることができます。

![](1-021.png)

![](1-022.png)

「Table」タブをクリック後、直近3分の状況を確認します。

![](1-023.png)

`node_memory_MemAvailable_bytes[3m]`と入力して、「Execute」ボタンをクリックします。
各ノードの直近3分間のメモリの空き容量の状況が表示されます。

![](1-024.png)

次に3ノードのメモリの空き容量を確認します。

`sum without (instance, kubernetes_node) (node_memory_MemAvailable_bytes)`と入力して、「Execute」ボタンをクリックします。

withoutを利用して、instanceとkubernetes_nodeラベルを除外して、3ノードのsum、合計を出力するPromQLです。

![](1-025.png)

「Graph」タブをクリックすることで、グラフでも確認できます。

![](1-026.png)

PromQLは、メトリクス集約に特化したPrometheus独自のクエリ言語です。このハンズオンで利用したクエリは一例です。
使用方法は、多岐にわたります。詳細は、[公式レファレンス](https://prometheus.io/docs/prometheus/latest/querying/basics/)を参照してください。

3.サンプルアプリケーションでObservabilityを体験してみよう
---------------------------------

この手順では、手順1および2で構築したObservability環境に対してサンプルアプリケーションをデプロイしていきます。  

### 3-1 サンプルアプリケーションの概要説明

まずはホームディレクトリに移動し、以下のGitレポジトリをcloneします。  

```sh
cd ~
```

```sh
git clone https://github.com/oracle-japan/code-at-customer-handson
```

このハンズオン用に作成したサンプルアプリケーションです。  
中身を簡単に紹介します。  

```sh
.
├── README.md
├── k8s ==> KubernetesのMainifest群
├── olympic_backend ==> バックエンドアプリケーション
├── olympic_datasource ==> データソースアプリケーション
├── olympic_frontend ==> フロントエンドアプリケーション
.
```

このサンプルアプリケーションは、主に以下の2つから構成されています。

* [Helidon](https://oracle-japan-oss-docs.github.io/helidon/docs/v2/#/about/01_overview)
  * Oracleがオープンソースで提供しているJavaのマイクロサービスフレームワーク
* [Oracle JavaScript Extension Toolkit（Oracle JET）](https://www.oracle.com/jp/application-development/technologies/jet/oracle-jet.html)
  * Oracleがオープンソースで開発しているJavascript用フレームワーク
  * 業界標準として普及しているオープンソース・フレームワークに基づき、開発者がより優れたアプリケーションをより迅速に構築できるよう支援する高度な機能とサービスを付加

簡単にアプリケーションの構成を見ていきます。  
この手順が完了すると全体のイメージは以下のようになります。

![](3-001.png)

大きく上部のサンプルアプリケーションと下部のObservability環境から構成されていますが、下部については手順2で構築済みです。  
そのため、以降では、主に上部のサンプルアプリケーションについてみていきます。

また、今回はアプリケーションへのアクセスにistio-ingressgatewayおよびNodePortを利用してアクセスします。  
実体としては、istio-ingressgatewayはOracle Cloud Infrastructure Load Balancingサービス、NodePortはWorker NodeとなるComputeインスタンスのPublic IPとPortを利用しています。  
そのため、Oracle Cloud Infrastructureの構成としては以下のような図になります。

![](3-031.png)

このサンプルアプリケーションは、3つのコンポーネントから以下のように構成されています。

* フロントエンドアプリケーション(図中の`Olympics`)  
  HelidonとOracle JETから構成されているアプリケーションです。  
  Helidonの静的コンテンツルート(今回は`resources/web配下`)にOracle JETのコンテンツを配置しています。  
  このアプリケーションは、バックエンドサービス(v1/v2/v3)のいずれかを呼び出します。  

* バックエンドアプリケーション(図中の緑枠部分)  
  Helidonから構成されているアプリケーションです。
  このアプリケーションには3つのバージョンが存在し、それぞれ金メダメリスト(v3)、銀メダリスト(v2)、銅メダリスト(v1)の一覧を返すようになっています。 
  バージョン情報は環境変数として保持しています。
  このアプリケーションは、データソースアプリケーションに対してバージョンに応じたAPIエンドポイントを呼び出し、データを取得しにいきます。

* データソースアプリケーション(図中の`Medal Info`)  
  Helidonとインメモリで動作しているデータベースである[H2 Database](https://www.h2database.com/html/main.html)から構成されているアプリケーションです。  
  このアプリケーションでは、メダリストと獲得したメダルの色を保持しており、バックエンドアプリケーションから呼び出されたエンドポイント応じてメダリストとそのメダルの色を返却します。

### 3-2 サンプルアプリケーションのビルドとデプロイ

ここからは、これらのアプリケーションが含まれたコンテナイメージをビルドしてみます。

まずは、フロントエンドアプリケーションからビルドします。

**Helidonについて**  
Helidonは`Maven`を利用してプロジェクトの雛形を作成することができます。  
コマンドについては[こちら](https://helidon.io/docs/v2/#/mp/guides/02_quickstart)をご確認ください。  
この中にはデフォルトでDockerfileも含まれています。  
以降で利用するDockerfileも、基本的に上記雛形ファイルを利用しています。
また、HelidonにはHelidon CLIという便利なCLIツールがあります。  
Helidon CLIについては[こちら](https://oracle-japan.github.io/ocitutorials/cloud-native/helidon-mp-for-beginners/)をご確認ください。
{: .notice--info}

```sh
cd code-at-customer-handson/olympic_frontend
```

```sh
docker image build -t code-at-customer/frontend-app .
```

***コマンド結果***
```sh
~~~~
Status: Downloaded newer image for openjdk:11-jre-slim
 ---> e4beed9b17a3
Step 9/13 : WORKDIR /helidon
 ---> Running in bbbeffe84be8
Removing intermediate container bbbeffe84be8
 ---> 518c68977ccc
Step 10/13 : COPY --from=build /helidon/target/olympic_frontend.jar ./
 ---> 6eb033c8d5ab
Step 11/13 : COPY --from=build /helidon/target/libs ./libs
 ---> d46766254734
Step 12/13 : CMD ["java", "-jar", "olympic_frontend.jar"]
 ---> Running in b2e205e5b9ed
Removing intermediate container b2e205e5b9ed
 ---> a042893b3e8e
Step 13/13 : EXPOSE 8080
 ---> Running in 7e3a2bb12ed4
Removing intermediate container 7e3a2bb12ed4
 ---> b96ac0669f0d
Successfully built b96ac0669f0d
Successfully tagged code-at-customer/frontend-app:latest
```

これでビルド完了です。　　

ビルドしたコンテナイメージを確認してみます。  

```sh
docker image ls
```

***コマンド結果***
```sh
REPOSITORY                           TAG        IMAGE ID       CREATED         SIZE
code-at-customer/frontend-app        latest     5ee35f1e2a49   3 minutes ago   270MB
~~~~
```

本来であれば、ビルドしたイメージをOCIR(Oracle Cloud Infrastructure Registry)へpushすることになりますが、今回はすでにコンテナイメージはpush済みなので、割愛します。

**OCIR(Oracle Cloud Infrastructure Registry)へのpushについて**  
OCIRへビルドしたコンテナイメージをpushする場合は、Oracle Cloud InfrastructureのネームスペースとOCIRのリージョンを指定したタグ付けを行う必要があります。  
詳細は[こちら](https://oracle-japan.github.io/ocitutorials/cloud-native/oke-for-beginners/#2ocir%E3%81%B8%E3%81%AE%E3%83%97%E3%83%83%E3%82%B7%E3%83%A5%E3%81%A8oke%E3%81%B8%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4)をご確認ください。
{: .notice--info}

ホームディレクトリに戻っておきます。

```sh
cd ~
```

同じようにバックエンドアプリケーションのコンテナもビルドしてみます。  

前述した通り、バックエンドアプリケーションはバージョンが3つ存在します。
今回は、そのバージョン情報を環境変数として持たせたDockerfileを用意していますので、それぞれビルドします。

例えば、v1の銅メダリストを返却するバックエンドアプリケーションは以下のようなDockerfileになっており、ENV命令とARG命令で定義しています。

```Dockerfile

# 1st stage, build the app
FROM maven:3.6-jdk-11 as build

WORKDIR /helidon

# Create a first layer to cache the "Maven World" in the local repository.
# Incremental docker builds will always resume after that, unless you update
# the pom
ADD pom.xml .
RUN mvn package -Dmaven.test.skip -Declipselink.weave.skip

# Do the Maven build!
# Incremental docker builds will resume here when you change sources
ADD src src
RUN mvn package -DskipTests
RUN echo "done!"

# 2nd stage, build the runtime image
FROM openjdk:11-jre-slim
WORKDIR /helidon

# Copy the binary built in the 1st stage
COPY --from=build /helidon/target/olympic_backend.jar ./
COPY --from=build /helidon/target/libs ./libs

ARG SERVICE_VERSION=V1
ENV SERVICE_VERSION=${SERVICE_VERSION}

CMD ["java", "-jar", "olympic_backend.jar"]

EXPOSE 8080
```

`ARG SERVICE_VERSION=V1`(デフォルト値はV1)で、ビルド時の`--build-arg`オプションで指定されたバージョンを取得し、
`ENV SERVICE_VERSION=${SERVICE_VERSION}`で環境変数として定義しています。  

**ENV命令とARG命令について**  
Dockerfileでは、コンテナ内で環境変数を扱う際にENV命令が用意されています。  
ENV命令は、環境変数と値のセットになっており、値はDockerfileから派生する全てのコマンド環境で利用できます。  
また、ARG命令を利用すると`docker image build`コマンド実行時に`–build-arg`オプションで指定された変数をビルド時に利用することができます。  
詳細は[こちら](https://docs.docker.jp/engine/reference/builder.html)をご確認ください。
{: .notice--info}

今回はバージョンが3つ存在するので、それぞれビルドしてみます。  

```sh
cd code-at-customer-handson/olympic_backend
```

V1をビルドします。  
V1はデフォルト値なので、`--build-arg`オプションを付与しなくても良いですが、今回はオプションを付与してビルドしてみます。  

```sh
docker image build -t code-at-customer/backend-app-v1 --build-arg SERVICE_VERSION=V1 .
```

***コマンド結果***

```sh
~~~~
Successfully tagged code-at-customer/backend-app-v1:latest
```

ビルドしたコンテナイメージを確認してみます。  

```sh
docker image ls
```

***コマンド結果***(順不同になる可能性があります)
```sh
REPOSITORY                           TAG        IMAGE ID       CREATED          SIZE
code-at-customer/frontend-app        latest     5ee35f1e2a49   13 minutes ago   270MB
code-at-customer/backend-app-v1      latest     f585e32a1147   27 minutes ago   243MB
~~~~
```

V2、V3も同じようにビルドしていきますが、時間がかかるため、今回は割愛します。  
V2、V3をビルドすると以下のようにコンテナイメージが作成されます。

```sh
REPOSITORY                           TAG        IMAGE ID       CREATED          SIZE
code-at-customer/frontend-app        latest     5ee35f1e2a49   15 minutes ago   270MB
code-at-customer/backend-app-v1      latest     9ba2a2183e29   39 minutes ago   243MB
code-at-customer/backend-app-v2      latest     9ba2a2183e29   39 minutes ago   243MB
code-at-customer/backend-app-v3      latest     bb7e737e4940   About a minute ago   243MB
~~~~
```

本来であれば、ビルドしたイメージをOCIR(Oracle Cloud Infrastructure Registry)へpushすることになりますが、今回はすでにコンテナイメージはpush済みなので、割愛します。

ホームディレクトリに戻っておきます。

```sh
cd ~
```

最後にデータソースアプリケーションのコンテナもビルドしてみます。  

```sh
cd code-at-customer-handson/olympic_datasource
```

```sh
docker image build -t code-at-customer/datasource-app .
```

***コマンド結果***

```sh
~~~~
Successfully tagged code-at-customer/datasource-app:latest
```

ビルドしたコンテナイメージを確認してみます。  

```sh
docker image ls
```

***コマンド結果***(順不同になる可能性があります)
```sh
REPOSITORY                           TAG        IMAGE ID       CREATED          SIZE
code-at-customer/frontend-app        latest     5ee35f1e2a49   15 minutes ago   270MB
code-at-customer/backend-app-v1      latest     9ba2a2183e29   39 minutes ago   243MB
code-at-customer/backend-app-v2      latest     9ba2a2183e29   39 minutes ago   243MB
code-at-customer/backend-app-v3      latest     9ba2a2183e29   39 minutes ago   243MB
code-at-customer/datasource-app      latest     3a542bedb13a   43 seconds ago   261MB
~~~~
```

本来であれば、ビルドしたイメージをOCIR(Oracle Cloud Infrastructure Registry)へpushすることになりますが、今回はすでにコンテナイメージはpush済みなので、割愛します。

これで全てのアプリケーションがビルドできました。

ホームディレクトリに戻っておきます。

```sh
cd ~
```

次に、k8sにコンテナアプリケーションをデプロイしていきます。

先ほど、cloneしてきたレポジトリの中にある`k8s`ディレクトリに移動します。

```sh
cd code-at-customer-handson/k8s
```

先ほどビルドしたコンテナアプリケーションをデプロイするためのManifestが`app`ディレクトリにあるので、配下のファイルを全てデプロイします。

```sh
cd app/plain
```

```sh
kubectl apply -f .
```

***コマンド結果***

```sh
deployment.apps/backend-app-v1 created
deployment.apps/backend-app-v2 created
deployment.apps/backend-app-v3 created
service/backend-app created
deployment.apps/datasource-app created
service/datasource-app created
deployment.apps/frontend-app created
service/frontend-app created
ingress.networking.k8s.io/gateway created
```

これでOKE上にサンプルアプリケーションがデプロイされました。

デプロイ状況を確認してみます。

```sh
kubectl get pods
```

***コマンド結果***

```sh
NAME                              READY   STATUS    RESTARTS   AGE
backend-app-v1-5c674f559f-fg2dq   2/2     Running   0          1m
backend-app-v1-5c674f559f-npjk4   2/2     Running   0          1m
backend-app-v2-84f5859c9f-gr6dd   2/2     Running   0          1m
backend-app-v2-84f5859c9f-pmnfl   2/2     Running   0          1m
backend-app-v3-7596dcf967-7dqnq   2/2     Running   0          1m
backend-app-v3-7596dcf967-tbhhw   2/2     Running   0          1m
datasource-app-7bc89cbdfc-pktdp   2/2     Running   0          1m
datasource-app-7bc89cbdfc-vmpr6   2/2     Running   0          1m
frontend-app-75c8986f76-lnhtg     2/2     Running   0          1m
frontend-app-75c8986f76-q5l44     2/2     Running   0          1m
node-exporter-handson-2mcph       1/1     Running   0          21m
node-exporter-handson-57qqq       1/1     Running   0          21m
node-exporter-handson-mbdzl       1/1     Running   0          21m
```

全て`Running`になったら、アプリケーションにアクセスしてみます。

アクセスには手順2で作成した`istio-ingressgateway`を経由してアクセスします。  
まずは、`istio-ingressgateway`のエンドポイントを確認します。

```sh
kubectl get services istio-ingressgateway -n istio-system
```

***コマンド結果***

```sh
NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP       PORT(S)                                                                      AGE
istio-ingressgateway   LoadBalancer   10.96.176.93   132.226.xxx.xxx   15021:30134/TCP,80:30850/TCP,443:30319/TCP,31400:31833/TCP,15443:30606/TCP   3d3h
```

上記の場合は、istio-ingressgatewayの`EXTERNAL-IP`である`132.226.xxx.xxx`がエンドポイントになります。

この場合は、以下のURLにアクセスします。  
`http://132.226.xxx.xxx`

以下のような画面が表示されればOKです！  

![](3-002.png)

何回かアクセスをしてみると、金メダメリスト(v3)、銀メダリスト(v2)、銅メダリスト(v1)がランダムに表示されることが確認できます。  

ホームディレクトリに戻っておきます。

```sh
cd ~
```

### 3-3 Grafana Lokiを利用したログ監視

ここでは、3-2でデプロイしたアプリケーションのログを監視してみます。

まずは、Grafanaにアクセスします。  

```sh
kubectl get services grafana -n istio-system
```

***コマンド結果***

```sh
NAME      TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
grafana   NodePort   10.96.219.44   <none>        3000:31624/TCP   4d3h
```

GrafanaのアクセスにはNodePortを利用します。  
NodePortは`PORT(S)`の`:`以降のポート番号です。  
上記の場合、以下のURLにアクセスします。  
http://[WorkerNodeのパブリックIP]:31624

アクセスしたら、Exploreをクリックします。

![](3-003.png)

画面上部のプルダウンから![](3-004.png)を選択します。  

![](3-005.png)

![](3-006.png)をクリックします。  

![](3-007.png)にログ対象とするラベルが表示されます。  
今回は、例として特定のPodのログを確認してみましょう。  

対象とするPod名を選択します。

```sh
kubectl get pods
```


***コマンド結果***

```sh
NAME                              READY   STATUS    RESTARTS   AGE
backend-app-v1-5c674f559f-fg2dq   2/2     Running   0          1m
backend-app-v1-5c674f559f-npjk4   2/2     Running   0          1m
backend-app-v2-84f5859c9f-gr6dd   2/2     Running   0          1m
backend-app-v2-84f5859c9f-pmnfl   2/2     Running   0          1m
backend-app-v3-7596dcf967-7dqnq   2/2     Running   0          1m
backend-app-v3-7596dcf967-tbhhw   2/2     Running   0          1m
datasource-app-7bc89cbdfc-pktdp   2/2     Running   0          1m
datasource-app-7bc89cbdfc-vmpr6   2/2     Running   0          1m
frontend-app-75c8986f76-lnhtg     2/2     Running   0          1m
frontend-app-75c8986f76-q5l44     2/2     Running   0          1m
node-exporter-handson-2mcph       1/1     Running   0          21m
node-exporter-handson-57qqq       1/1     Running   0          21m
node-exporter-handson-mbdzl       1/1     Running   0          21m
```

例えば、`backend-app-v2-84f5859c9f-gr6dd`を対象とします。(各自の環境に合わせてください)  

![](3-008.png)から`pod`を選択するとPod名が表示されます。  
対象とするPod名を選択し、`show logs`をクリックします。

![](3-009.png)

対象のPodが出力したログが表示されます。  

![](3-010.png)

Loki上でログをフィルタリングしたり、検索したりすることも可能です。  

例えば、現在の状態では、Pod内にIstioによってInjectionされているEnvoyのログも出力されているので、アプリだけのログに絞ってみます。  

![](3-006.png)欄にあるテキストボックスに`,container="backend-app"`という文字列を追加し、左上の![](3-013.png)をクリックします。  
![](3-030.png)のようなクエリになります。  

これで、`backend-app-v2-84f5859c9f-gr6dd`というPodの中の`backend-app`というcontainerに絞ることができます。  

![](3-012.png)

以上で、Grafana Lokiでのログ監視は完了です。  

### 3-4 Jaegerを利用したトレーシング

続いて、Jaegerを利用してトレーシングを実施してみます。  

まずは、アプリケーションにアクセスを行い、トレーシング情報をJaegerに流しましょう。 

```sh
kubectl get services istio-ingressgateway -n istio-system
```

***コマンド結果***

```sh
NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP       PORT(S)                                                                      AGE
istio-ingressgateway   LoadBalancer   10.96.176.93   132.226.xxx.xxx   15021:30134/TCP,80:30850/TCP,443:30319/TCP,31400:31833/TCP,15443:30606/TCP   3d3h
```

上記の場合は、istio-ingressgatewayの`EXTERNAL-IP`である`132.226.xxx.xxx`がエンドポイントになります。

この場合は、以下のURLにアクセスします。  
`http://132.226.xxx.xxx`

次にJaegerのUIにアクセスします。 

```sh
kubectl get services tracing -n istio-system
```

***コマンド結果***

```sh
NAME      TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)                        AGE
tracing   NodePort   10.96.207.90   <none>        80:30483/TCP,16685:31417/TCP   4d4h
```

JaegerのアクセスにはNodePortを利用します。  
NodePortは`PORT(S)`の`:`以降のポート番号です。  
上記の場合、以下のURLにアクセスします。  
http://[WorkerNodeのパブリックIP]:30483

アクセスしたら、Serviceカテゴリにあるプルダウンをクリックし、`istio-ingress-gateway.istio.system`をクリックし、`Find Trace`をクリックします。  

![](3-014.png)

これで、`istio-ingress-gateway`を経由してルーティングされたトラフィックの流れを見ることができます。  

![](3-015.png)

このように`istio-ingress-gateway`、`frontend-app.default`、`backend-app.default`、`datasource-app.default`の4つのServiceが含まれたトレーシング情報が取得できています。  

これをクリックします。  

![](3-016.png)

このように一連のトラフィックの流れとそれぞれのレイテンシを確認することができます。  

今回は簡単なアプリケーションなので、全体を通して数十~週百msで完了しますが、実際にパフォーマンスでの問題が発生した場合、トレーシング情報を見ることでどの部分がボトルネックになっているのかを確認することができます。  

以上で、Jaegerを利用したトレーシングは完了です。  

### 3-5 Kialiを利用したService Meshの可視化

続いて、Kialiを利用したService Meshの可視化を行ってみます。

まずは、KialiのUIを開きます。  

```sh
kubectl get services kiali -n istio-system
```

***コマンド結果***

```sh
NAME    TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)                          AGE
kiali   NodePort   10.96.251.81   <none>        20001:30768/TCP,9090:32228/TCP   4d4h
```

KialiのアクセスにはNodePortを利用します。  
NodePortは`PORT(S)`の`:`以降のポート番号です。  
上記の場合、以下のURLにアクセスします。  
http://[WorkerNodeのパブリックIP]:30768

Kialiでの可視化を行うためにIstioのトラフィック管理設定リソースの一つである`DestinationRule`を作成します。  
これは、Serviceリソースを対象としたトラフィックに適用されるポリシーを定義するリソースです。  

今回は以下のようなDestinationRuleを作成します。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: backend
spec:
  host: backend-app
  trafficPolicy:
    loadBalancer:
      simple: RANDOM
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
  - name: v3
    labels:
      version: v3
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: frontend
spec:
  host: frontend-app
  subsets:
  - name: v1
    labels:
      version: v1
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: datasource
spec:
  host: datasource-app
  subsets:
  - name: v1
    labels:
      version: v1
```

例えば、バックエンドアプリケーションに対するDestination Rule(`backend`)をみてみると、

```yaml
  host: backend-app
  trafficPolicy:
    loadBalancer:
      simple: RANDOM
```

`host`に対してバックエンドアプリケーションのServiceリソースを定義しています。  

今回、`backend-app`に紐づくDeploymentは3つ(3バージョン)存在しています。  
`trafficPolicy:`は複数存在するDeploymentに対する分散ポリシーなどを定義できます。  
今回は、`RANDOM`なので、ランダムに`backend-app`に紐づくDeployment(今回は3つ)にトラフィックを分散します。

まずは、このDestinationRuleを適用してみましょう。

ホームディレクトリに戻ります。  

```sh
cd ~
```

```sh
cd code-at-customer-handson/k8s/base
```

```sh
kubectl apply -f destination_rule.yaml
```

***コマンド結果***

```sh
destinationrule.networking.istio.io/backend created
destinationrule.networking.istio.io/frontend created
destinationrule.networking.istio.io/datasource created
```

この状態で、KialiのUIを確認してみます。  

まずは`Overview`です。  

![](3-017.png)

ここでは、`default`ネームスペースに4つのアプリケーションが存在することがわかります。  
4つのアプリケーションとは、今回デプロイしているフロントエンドアプリケーション、バックエンドアプリケーション、データソースアプリケーションとNode Exporterです。  

次に、`istio Config`を確認します。 

`No Namespace Selected`と表示されている場合は、右上の![](3-020.png)から`default`にチェックを入れてください。  

![](3-018.png)

`Name`にある`DR`ラベルは`DestinationRule`を指します。  
`backend`をクリックしてみると、左側の`Destination Rule Overview`で3つのバージョンが存在していることが確認できます。  

![](3-019.png)

次に、`Services`を確認します。  

`No Namespace Selected`と表示されている場合は、右上の![](3-020.png)から`default`にチェックを入れてください。  

![](3-021.png)

KubernetesのServiceリソースが確認できます。  
`Deatails`には、Serviceリソースに紐づく`DestinationRule`が確認できるようになっています。 

**`node-exporter-handson`について**  
`node-exporter-handson`の`Deatails`欄に![](3-032.png)というマークがありますが、今回のハンズオンの動作には影響しませんので、無視してください。 
{: .notice--info}

次に`Workload`を確認します。  

`No Namespace Selected`と表示されている場合は、右上の![](3-020.png)から`default`にチェックを入れてください。  

![](3-022.png)

ここには、デプロイ済みのDeploymentリソースが表示されます。

**`node-exporter-handson`について**  
`node-exporter-handson`の`Deatails`欄に![](3-032.png)![](3-033.png)というマークがありますが、今回のハンズオンの動作には影響しませんので、無視してください。 
{: .notice--info}

次に`Application`を確認します。  

`No Namespace Selected`と表示されている場合は、右上の![](3-020.png)から`default`にチェックを入れてください。  

ここには、デプロイ済みのアプリケーションが表示されます。  
ここでのアプリケーションとはServiceリソースとほぼ同義です。  

![](3-023.png)

**`node-exporter-handson`について**  
`node-exporter-handson`の`Deatails`欄に![](3-032.png)というマークがありますが、今回のハンズオンの動作には影響しませんので、無視してください。 
{: .notice--info}

`backend-app`をクリックしてみると、以下のような画面が表示されます。  

![](3-024.png)

ここで、ブラウザからアプリケーションにアクセスした後に再度確認してみてください。
しばらくすると、以下のようにアクセスしたTrafficが表示されます。  

![](3-025.png)

他にも、図の赤枠部分のタブで切り替えると様々な情報が見れるので、確認してみてください。  

最後に`Graph`を確認を確認します。  

![](3-026.png)

ここでは、トラフィックの情報などをグラフで可視化することができます。  

例えば、右上の![](3-027.png)から`Versioned app graph`を選択します。  

![](3-028.png)

この状態でアプリケーションに複数回アクセスします。  
現状は、バックエンドサービスが`DestinationRule`でランダムに負荷分散されるようになっているので、金メダリスト、銀メダリスト、銅メダリスト一覧がランダムで表示されることが確認できます。  

**バックエンドアプリケーションへの負荷分散について**  
DestinationRuleを適用する前から、バックエンドアプリケーションはv1/v2/v3にある程度負荷分散されています。  
これは、そもそもServiceリソースに負荷分散の機能があるためです。  
DestinationRuleを適用することによって、Istioの機能を利用した明示的な負荷分散を行うことができます。  
今回は`RANDOM`ポリシーを適用していますが、他にも`Weighted`(重みづけ)や`Least requests`(最小リクエスト)などのポリシーがあります。  
詳細は[こちら](https://istio.io/latest/docs/concepts/traffic-management/#load-balancing-options)のページをご確認ください。
{: .notice--info}

金メダリスト、銀メダリスト、銅メダリストそれぞれの一覧が表示されたら、再度`Versioned app graph`を確認します。  

![](3-029.png)

このように、バージョン毎にトラフィックがルーティングされていることが可視化されます。  

Kialiでは、上記でご確認いただいたとおり、Service Mesh環境の様々なリソースやトラフィック状況を可視化することができます。  

最後に、ホームディレクトリに戻っておきます。

```sh
cd ~
```

4.Istioを利用したカナリアリリースをやってみよう
---------------------------------

最後に、手順3までに構築してきた環境を利用して、カナリアリリースを実施してみます。

### 4-1 カナリアリリース

カナリアリリースとは`Blue/Greenデプロイメント`や`A/Bテスト`などと並ぶ高度なデプロイ戦略の一つで「プロダクトやサービスの新機能を一部ユーザーのみが利用できるようにリリースし、新機能に問題がないことを確認しながら段階的に全体に向けて展開していくデプロイ手法」を指します。  
これにより、新しいバージョンのアプリケーションを本番環境バージョンと一緒にデプロイして、ユーザの反応やパフォーマンスを確認することができます。

Istioを利用することで、カナリアリリースを容易に実施することができます。  
今回は、以下の想定でカナリアリリースを実施してみます。  

* 対象：バックエンドアプリケーション
* 既存バージョン：v1
* 新バージョン：v2とv3
* ルーティングポリシー：トラフィックの80%をv1に、15%をv2に、5%をv3にルーティング

上記の構成をIstioで実現するために、`VirtualService`というリソースを作成します。  
これは、`DestinationRule`で定義した情報を利用し、さらに細かいルーティングポリシーを設定します。  
例えば、HTTP Headerやパス等のマッチングルールに基づいて、リクエストのルーティング先を書き換えたりHTTP Headerの操作をすることが可能です。  
今回は、バックエンドアプリケーションのバージョンに重みづけを行い振り分けを行います。  

`DestinationRule`と`VirtualService`の関係は以下のようになります。

![](4-001.png)

今回は、以下のような`VirtualService`を用意しました。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: canary-release
spec:
  hosts:
    - backend-app
  http:
  - route:
    - destination:
        host: backend-app
        subset: v1
      weight: 80
    - destination:
        host: backend-app
        subset: v2
      weight: 15
    - destination:
        host: backend-app
        subset: v3
      weight: 5
```

以下に注目します。

```yaml
  hosts:
    - backend-app
  http:
  - route:
    - destination:
        host: backend-app
        subset: v1
      weight: 80
    - destination:
        host: backend-app
        subset: v2
      weight: 15
    - destination:
        host: backend-app
        subset: v3
      weight: 5
```

ここでの`host`は対象となるバックエンドアプリケーションのServiceリソースです。  
`subset`にはそれぞれ`DestinationRule`で定義したものを利用しています。  
`weight`には、それぞれ重み付けを設定しています。

このManifestを適用します。  

```sh
cd code-at-customer-handson/k8s/scenario
```

```sh
kubectl apply -f canaly-release.yaml
```

***コマンド結果***

```sh
virtualservice.networking.istio.io/canary-release created
```

アプリケーションにアクセスしてみましょう。  

ほとんど、銅メダリスト(v1)が表示され、偶にv2(銀メダリスト)、ごく稀にv3(金メダリスト)が表示されるかと思います。  

何度かアクセスした後に、Kialiでその様子を可視化してみましょう。  

KialiのUIにアクセスし、`Application`メニューから`backend-app`をクリックします。

![](4-002.png)

Graph部分にトラフィックのルーティング割合が表示されます。  
概ね、設定した重み付けに従ってルーティングされていることが確認できます。  

![](4-003.png)

このように、Istioを利用すると適切なリソースを作成するだけで、カナリアリリースのような高度なデプロイ戦略を実施することができます。  

{% capture notice %}**その他のシナリオについて**  
code-at-customer-handson/k8s/scenarioディレクトリにはカナリアリリース以外にも以下のシナリオをご用意しています。  
必要に応じてご確認ください。

* all-v3.yaml
  トラフィックの全てをバックエンドアプリケーションv3(金メダリスト)にルーティングするポリシーです。  
  これを適用すると、アプリケーションでは金メダリストのみが表示されます。

* v1-v2-half.yaml
  トラフィックの50%をバックエンドアプリケーションv1に残りの50%をバックエンドアプリケーションv2にルーティングするポリシーです。  
  これを適用すると、アプリケーションでは、銀メダリストと銅メダリストが半々に表示されます。{% endcapture %}
<div class="notice--info">
  {{ notice | markdownify }}
</div>

以上で、ハンズオンは終わりです。

5.OCI MonitoringのメトリクスをGrafanaダッシュボードを利用して確認してみよう【オプション】
---------------------------------

ここからはオプションの手順になります。  
お時間がある方、興味がある方はぜひお試しください。  

Grafanaではプラグインを利用して、Oracle Cloud Infrastructure Monitoringが提供するメトリクスをGrafanaダッシュボードで確認することができます。  
ここでは、その手順を確認していきます。  

**Oracle Cloud Infrastructure Monitoringについて**  
詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Monitoring/Concepts/monitoringoverview.htm)のページをご確認ください。
{: .notice--info}

### 5-1 動的グループとポリシーの設定

ここでは、OKE上にデプロイされているGrafanaからOracle Cloud Infrastructure Monitoringが提供するメトリクスを取得できるようにポリシーの設定を行います。  

OCIコンソールのハンバーガーメニューを開き、「アイデンティティとセキュリティ」から「動的グループ」を選択します。  

**動的グループについて**  
動的グループの詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Identity/Tasks/managingdynamicgroups.htm)のページをご確認ください。
{: .notice--info}

![](5-001.png)

「動的グループの作成」をクリックします。  

![](5-002.png)

以下のように情報を入力します。  

**集合ハンズオンで参加されている皆様へ**  
動的グループ名は重複が許容されないため、集合ハンズオンなどで同一環境を複数名でご利用されている皆様は動的グループ名に自分のイニシャルや好きな複数桁の番号などを付与し、重複しないように動的グループ名を設定してください。  
{: .notice--info}

key|value
-|-
名前| grafana_dynamic_group
説明| grafana_dynamic_group
一致ルール - ルール1 | `instance.compartment.id = '<ご自身のコンパートメントOCID>'`

![](5-003.png)

画像はイメージですので、コンパートメントOCIDはご自身の環境に合わせて読み替えてください。  

「作成」をクリックします。  

**コンパートメントOCIDについて**  
コンパートメントOCIDの確認方法については、[こちら](https://oracle-japan.github.io/ocitutorials/cloud-native/functions-for-beginners/#2-1-2-%E3%82%B3%E3%83%B3%E3%83%91%E3%83%BC%E3%83%88%E3%83%A1%E3%83%B3%E3%83%88ocid%E3%81%AE%E7%A2%BA%E8%AA%8D)の`2-1-2`の手順をご確認ください。  
{: .notice--info}

次に画面左側にあるメニューから「ポリシー」をクリックします。  

![](5-004.png)

「ポリシーの作成」をクリックします。  

![](5-005.png)

以下の情報を入力します。  
また、「手動エディタの表示」にチェックを入れます。  

key|value
-|-
名前| grafana_policy
説明| grafana_policy
コンパートメント | ご自身のコンパートメント名
ポリシー | `allow dynamic-group grafana_dynamic_group to read metrics in compartment id <ご自身のコンパートメントOCID>`

{% capture notice %}**集合ハンズオンで参加されている皆様へ**  
集合ハンズオンで参加されている皆様は、ご自身で作成された動的グループ名をご利用ください。  
以下のような形になります。

```
allow dynamic-group <ご自身で作成された動的グループ名> to read metrics in compartment id <ご自身のコンパートメントOCID>
```

{% endcapture %}
<div class="notice--warning">
  {{ notice | markdownify }}
</div>

![](5-006.png)

画像はイメージですので、コンパートメントOCIDはご自身の環境に合わせて読み替えてください。 

「作成」をクリックします。  

これで、動的グループとポリシーの設定は完了です。  

### 5-2 OCI MonitoringプラグインのGrafanaへのインストール

ここでは、OCI MonitoringプラグインをGrafanaへインストールしていきます。  

今回、GrafanaをIstioアドオンとしてインストールしているので、以下にManifestが配置してあります。  

```
cd ~/istio-1.11.0/samples/addons/
```

GrafanaのManifestファイルをviで開きます。  

```sh
vi grafana.yaml
```

160行目くらいにある`env`フィールドに以下の環境変数を追加します。  

```yaml
    - name: GF_INSTALL_PLUGINS
      value: "oci-metrics-datasource"
```

保存して終了したら、Manifestを適用します。  

```sh
kubectl apply -f grafana.yaml
```

GrafanaにNodePortからアクセス可能にするために以下のコマンドを再度実行します。  

```sh
kubectl patch service grafana -n istio-system -p '{"spec": {"type": "NodePort"}}'
```

***コマンド結果***
```sh
service/grafana patched
```

また、適用後にGrafanaが再起動するので、起動が完了するまで待機します。 

```
kubectl get pod -n istio-system
```

***コマンド結果***
```sh
NAME                                    READY   STATUS    RESTARTS   AGE
grafana-5f75c485c4-5rxdq                1/1     Running   0          37s
istio-egressgateway-9dc6cbc49-pk5q2     1/1     Running   0          55m
istio-ingressgateway-7975cdb749-8kxr9   1/1     Running   0          55m
istiod-77b4d7b55d-cc7b7                 1/1     Running   0          55m
jaeger-5f65fdbf9b-pbjfb                 1/1     Running   0          54m
kiali-787bc487b7-znbl4                  1/1     Running   0          54m
loki-0                                  1/1     Running   0          51m
loki-promtail-8z4x7                     1/1     Running   0          51m
loki-promtail-hpm46                     1/1     Running   0          51m
loki-promtail-kkc9k                     1/1     Running   0          51m
prometheus-9f4947649-znlrr              2/2     Running   0          54m
```

これで、OCI MonitoringプラグインのGrafanaへのインストールは完了です。  

### 5-3 Grafanaダッシュボードの確認

Grafanaが再起動したら、Grafanaダッシュボードにブラウザからアクセスします。  
アクセスするためのポート番号が変わっているので、再度確認を行います。

```sh
kubectl get services grafana -n istio-system
```

***コマンド結果***

```sh
NAME      TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
grafana   NodePort   10.96.219.44   <none>        3000:30453/TCP   4d3h
```

GrafanaのアクセスにはNodePortを利用します。  
NodePortは`PORT(S)`の`:`以降のポート番号です。  
上記の場合、以下のURLにアクセスします。  
http://[WorkerNodeのパブリックIP]:30453

アクセスしたら、![](5-007.png)の![](5-014.png)をクリックします。  

![](5-008.png)をクリックし、最下部にある「Oracle Cloud Infrastructure Metrics」を選択し、![](5-015.png)をクリックします。  

以下の情報を入力します。  

key|value
-|-
Tenancy OCID | ご自身のテナンシOCID
Default Region | ap-osaka-1
Environment | OCI Instance

![](5-009.png)

**テナンシOCIDについて**  
テナンシOCIDの確認方法については、[こちら](https://oracle-japan.github.io/ocitutorials/cloud-native/oke-for-intermediates/#3%E3%83%AF%E3%83%BC%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%E3%81%A7%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E6%83%85%E5%A0%B1%E3%81%AE%E5%8F%8E%E9%9B%86)の`3.テナンシOCID`をご確認ください。  
{: .notice--info}

「Save&Test」をクリックします。  

![](5-010.png)をクリックし、上部のタブから「Oracle Cloud Infrastructure Metrics」を選択します。

![](5-011.png)

以下のように必要項目を入力します。  

key|value
-|-
Region | ap-osaka-1
Compartment | ご自身のコンパートメント名
Namespace | oci_computeagent
Metric | 例えば`CpuUtilization`を選択

**ポリシーの反映について**  
環境や状況によって[先ほどの手順](#5-1-動的グループとポリシーの設定)で設定したポリシーの反映に時間がかかる場合があります。  
`Namespace`以降が選択できない場合は、しばらく時間をおいてから再度お試しください。
{: .notice--warning}

![](5-012.png)
画像はイメージですので、各項目はご自身の環境に合わせて読み替えてください。  

以下のようなグラフと表が表示されます。  

![](5-013.png)

このようにOCI MonitoringのGrafanaプラグインを利用すると、OCIのCompute(今回の場合はOKEのWorker Node)のメトリクスをGrafanaダッシュボードに統合することができます。  

<!-- 6.OCI APMを利用してトレーシングしてみよう【オプション】
---------------------------------ß
<!-- 
ここからはオプションの手順になります。  
お時間がある方、興味がある方はぜひお試しください。  

OCI APMでは、Jaegerと同じようにマイクロサービスをはじめとした分散アプリケーションのトレーシングを行うことができます。
この手順では、OCI APMを利用した分散トレーシングの手順を実施していきます。

**OCI APMとOracle Cloud Observability and Management Platform**  
OCIでは、アプリケーションの可視性および機械学習ベースの実用的なインサイトを提供するサービス群として、[Oracle Cloud Observability and Management Platform](https://www.oracle.com/jp/manageability/)があります。  
この中核をなすサービスの一つに、分散トレーシングや合成モニタリングなど実現するサービスであるOCI APMがあります。
詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/application-performance-monitoring/index.html)のページをご確認ください。
{: .notice--info}

### 6-1 ポリシーの作成

まずは、OCI APMを利用するためのポリシーを作成してきます。  

**本手順について**  
この手順6-1は、トライアル環境や管理者権限をお持ちの環境でハンズオンを実施されている皆様には不要な手順ですので、スキップしていただき、手順6-2から実施してください。
{: .notice--info}

OCIコンソールのハンバーガーメニューを開き、「アイデンティティとセキュリティ」から「ポリシー」を選択します。  

![](6-001.png)

「ポリシーの作成」をクリックします。  

![](5-005.png)

以下の情報を入力します。  
また、「手動エディタの表示」にチェックを入れます。  

key|value
-|-
名前| apm_policy
説明| apm_policy
コンパートメント | ご自身のコンパートメント名
ポリシー | `Allow group APM-Admins to manage apm-domains in compartment id <ご自身のコンパートメントOCID>`

![](6-002.png)

画像はイメージですので、コンパートメントOCIDはご自身の環境に合わせて読み替えてください。 

「作成」をクリックします。  

これで、ポリシーの設定は完了です。  

### 6-2 APMドメインの作成

ここでは、APMドメインの作成を行います。  

OCIコンソールのハンバーガーメニューを開き、「監視および管理」から「アプリケーション・パフォーマンス・モニタリング」カテゴリの「管理」を選択します。  

![](6-003.png)

「APMドメインの作成」をクリックします。  

![](6-004.png)

以下の情報を入力します。 

key|value
-|-
名前| oke-handson-apm
説明| oke-handson-apm

**集合ハンズオンで参加されている皆様へ**  
APMドメイン名は重複が許容されないため、集合ハンズオンなどで同一環境を複数名でご利用されている皆様はAPMドメイン名に自分のイニシャルや好きな複数桁の番号などを付与し、重複しないようにAPMドメイン名を設定してください。  
{: .notice--info}

「作成」をクリックします。

![](6-005.png)

ドメインが「作成中」のステータスになるので、「アクティブ」になるまで待機します。

![](6-006.png)

ドメインが「アクティブ」になったら、ドメイン名の箇所をクリックします。

「APMドメイン情報」の「データ・アップロード・エンドポイント」と「データ・キー」の「プライベート」キーの値をコピーし、エディタなどに記録しておきます。  
この値は、アプリケーション側からトレーシング情報をAPMにアップロードする際のエンドポイントとその際に利用するキーになり、後ほど利用します。

![](6-007.png)
![](6-008.png)

これで、APMドメインの作成は完了です。

### 6-3 サンプルアプリケーションのManifest設定の変更

ここでは、Manifestの設定を変更していきます。

Manifestのあるディレクトリに移動します。  

```sh
cd ~
```

```sh
cd code-at-customer-handson/k8s/app/for-oci-apm
```

フロントエンドアプリケーションのManifestをvimで開きます。

```sh
vim olympic_frontend.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-app
  labels:
    app: frontend-app
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend-app
      version: v1
  template:
    metadata:
      labels:
        app: frontend-app
        version: v1
    spec:
      containers:
      - name: frontend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/frontend-app-apm
        ports:
        - containerPort: 8082
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX
~~~
```

25行目から29行目の`env`フィールドの`tracing.data-upload-endpoint`、`tracing.private-data-key`の`value`を[6-2 APMドメインの作成](#6-2-apmドメインの作成)で記録したAPMドメインとプライベート・データキーに差し替えます。  

以下のようになります。

```yaml
~~~
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend-app
      version: v1
  template:
    metadata:
      labels:
        app: frontend-app
        version: v1
    spec:
      containers:
      - name: frontend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/frontend-app-apm
        ports:
        - containerPort: 8082
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
```

この状態で保存します。  

これと同じことをバックエンド、データソースアプリケーションにも実施します。  

```sh
vim olympic_backend.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v1
  labels:
    app: backend-app
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v1
  template:
    metadata:
      labels:
        app: backend-app
        version: v1
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v1-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v2
  labels:
    app: backend-app
    version: v2
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v2
  template:
    metadata:
      labels:
        app: backend-app
        version: v2
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v2-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v3
  labels:
    app: backend-app
    version: v3
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v3
  template:
    metadata:
      labels:
        app: backend-app
        version: v3
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v3-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX
```  

25行目から29行目、55行目から59行目、85行目から89行目の`env`フィールドの`tracing.data-upload-endpoint`、`tracing.private-data-key`の`value`を[6-2 APMドメインの作成](#6-2-apmドメインの作成)で記録したAPMドメインとプライベート・データキーにそれぞれ差し替えます。  

以下のようになります。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v1
  labels:
    app: backend-app
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v1
  template:
    metadata:
      labels:
        app: backend-app
        version: v1
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v1-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v2
  labels:
    app: backend-app
    version: v2
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v2
  template:
    metadata:
      labels:
        app: backend-app
        version: v2
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v2-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-app-v3
  labels:
    app: backend-app
    version: v3
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend-app
      version: v3
  template:
    metadata:
      labels:
        app: backend-app
        version: v3
    spec:
      containers:
      - name: backend-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/backend-app-v3-apm
        ports:
        - containerPort: 8081
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
```

最後にデータソースアプリケーションに対しても実施します。

```sh
vim olympic_datasource.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: datasource-app
  labels:
    app: datasource-app
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: datasource-app
      version: v1
  template:
    metadata:
      labels:
        app: datasource-app
        version: v1
    spec:
      containers:
      - name: datasource-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/datasource-app-apm
        ports:
        - containerPort: 8080
        env:
        - name: tracing.data-upload-endpoint
          value: https://xxxxxxxxxxxxxxxx.apm-agt.us-ashburn-1.oci.oraclecloud.com
        - name: tracing.private-data-key
          value: XXXXXXXXXXXXXXXXXXXXXXXX
``` 

25行目から29行目の`env`フィールドの`tracing.data-upload-endpoint`、`tracing.private-data-key`の`value`を[6-2 APMドメインの作成](#6-2-apmドメインの作成)で記録したAPMドメインとプライベート・データキーに差し替えます。  

以下のようになります。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: datasource-app
  labels:
    app: datasource-app
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: datasource-app
      version: v1
  template:
    metadata:
      labels:
        app: datasource-app
        version: v1
    spec:
      containers:
      - name: datasource-app
        image: nrt.ocir.io/orasejapan/codeatcustomer/datasource-app-apm
        ports:
        - containerPort: 8080
        env:
        - name: tracing.data-upload-endpoint
          value: <ご自身のAPMドメインのエンドポイント>
        - name: tracing.private-data-key
          value: <ご自身のAPMドメインのプライベート・データキー>
```

これでサンプルアプリケーションのManifest設定の変更は完了です。  

ここで利用するコンテナアプリケーションは、OCI APMを利用するためにアプリケーション側にトレーシングの設定を入れています。  
今回、OCI APMで利用しているアプリケーションは、code-at-customer-handsonディレクトリ配下の`_apm`が付与されているプロジェクトになります。

{% capture notice %}**HelidonアプリケーションでのOCI APMの利用**  
今回はHelidonを利用したアプリケーションですが、[HelidonにはOCI APM専用のエージェント](https://docs.oracle.com/ja-jp/iaas/application-performance-monitoring/doc/use-apm-tracer-helidon.html)が用意されています。  
基本的には、`pom.xml`に以下の依存関係を追加するだけで利用可能です。(アプリケーション側の変更は必要ありません)  
また、必要に応じて`src/main/resources/META-INF/microprofile-config.properties`に設定値を追加します。  

  ```xml
        <dependency>
            <groupId>com.oracle.apm.agent.java</groupId>
            <artifactId>apm-java-agent-helidon</artifactId>
            <version>RELEASE</version>
        </dependency>
        <dependency>
            <groupId>com.oracle.apm.agent.java</groupId>
            <artifactId>apm-java-agent-tracer</artifactId>
            <version>RELEASE</version>
        </dependency>
    </dependencies>

    <repositories>
        <repository>
            <id>oci</id>
            <name>OCI Object Store</name>
            <url>https://objectstorage.us-ashburn-1.oraclecloud.com/n/idhph4hmky92/b/prod-agent-binaries/o</url>
        </repository>
    </repositories>
  ```

  今回、`microprofile-config.properties`については以下のように設定しています。(フロントエンドアプリケーションの場合)

  ```yaml
  # OCI APM関連
  tracing.enabled=true
  tracing.service=oke-helidon-demo-frontend-service
  tracing.name="frontend-helidon-service"
  ```
  {% endcapture %}
<div class="notice--info">
  {{ notice | markdownify }}
</div>

**既存ZipkinプラットフォームでのOCI APMの利用**  
OCI APMはZipkin互換にもなっているので、既存のZipkinベースのAPMプラットフォームをOCI APMで利用して頂くことも可能です。  
詳細については[こちら](https://docs.oracle.com/ja-jp/iaas/application-performance-monitoring/doc/configure-open-source-tracing-systems.html)をご確認ください。
{: .notice--info}

### 6-4 Istioのトレーシング設定の変更

ここでは、現時点で設定されているIstio内のJargerからOCI APMにトレーシングを切り替える設定を行います。  

まずは、今デプロイされているアプリケーションを一旦削除します。  

```sh
cd ~
```

```sh
cd code-at-customer-handson/k8s/app/plain
```

```sh
kubectl delete -f . 
```

***コマンド結果***

```sh
deployment.apps/backend-app-v1 deleted
deployment.apps/backend-app-v2 deleted
deployment.apps/backend-app-v3 deleted
service/backend-app deleted
deployment.apps/datasource-app deleted
service/datasource-app deleted
deployment.apps/frontend-app deleted
service/frontend-app deleted
ingress.networking.k8s.io/gateway deleted
```

ここで、再度Istioをインストールします。
[2-1 Istio（addon: Prometheus, Grafana, Jaeger, Kiali）インストール](#2-1-istioaddon-prometheus-grafana-jaeger-kialiインストール)でインストールしたスタックはそのままで問題ありません。  
 
今回は、MeshConfigを利用してIstioのトレーシングを無効にします。  

**Global Mesh Optionsについて**  
Istioには、Service Mesh全体に影響する設定として、MeshConfigという設定群が存在します。  
詳細は[こちら](https://istio.io/latest/docs/reference/config/istio.mesh.v1alpha1/)をご確認ください。
{: .notice--info}

```sh
istioctl install --set profile=demo --set meshConfig.enableTracing=false --skip-confirmation
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

これで、Istioのトレーシング設定の変更は完了です。

### 6-5 OCI APMでのトレーシング

いよいよ、OCI APMを利用したトレーシングを実施します。  

再度、サンプルアプリケーションをデプロイします。  

```sh
cd ~
```

```sh
cd code-at-customer-handson/k8s/app/for-oci-apm
```

```sh
kubectl apply -f . 
```

***コマンド結果***

```sh
deployment.apps/backend-app-v1 created
deployment.apps/backend-app-v2 created
deployment.apps/backend-app-v3 created
service/backend-app created
deployment.apps/datasource-app created
service/datasource-app created
deployment.apps/frontend-app created
service/frontend-app created
ingress.networking.k8s.io/gateway created
```

アプリケーションにアクセスします。  

```sh
kubectl get services istio-ingressgateway -n istio-system
```

***コマンド結果***

```sh
NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP       PORT(S)                                                                      AGE
istio-ingressgateway   LoadBalancer   10.96.176.93   132.226.xxx.xxx   15021:30134/TCP,80:30850/TCP,443:30319/TCP,31400:31833/TCP,15443:30606/TCP   3d3h
```

上記の場合は、istio-ingressgatewayの`EXTERNAL-IP`である`132.226.xxx.xxx`がエンドポイントになります。

この場合は、以下のURLにアクセスします。  
`http://132.226.xxx.xxx`

何度かアクセスしたのちに、トレース情報をOCI APMから確認します。  

OCIコンソールのハンバーガーメニューを開き、「監視および管理」から「アプリケーション・パフォーマンス・モニタリング」カテゴリの「トレース・エクスプローラー」を選択します。  

![](6-009.png)

画面上部にある「APMドメイン」から、[6-2 APMドメインの作成](#6-2-apmドメインの作成)で作成したAPMドメインを選択します。  

![](6-010.png)

右側にある検索条件を「過去15分間」に選択し、「実行」ボタンをクリックします。  

![](6-011.png)

複数のトレース情報が表示されますので、`Spans`が25になっている情報をクリックします。  

![](6-012.png)

以下のようなトレース情報が表示されます。
先ほどJaegerで確認した情報よりも、より詳細な情報が取得できていることが確認できます。  

![](6-013.png)
![](6-014.png)

これで、OCI APMを利用したトレーシングは完了です。  

### 6-6 OCI APMでのアプリケーションサーバのメトリクス監視

ここでは、OCI APMで監視できるアプリケーションサーバのメトリクスについて見ていきたいと思います。  

画面左上のプルダウンから「ダッシュボード」をクリックします。  

![](6-015.png)

ダッシュボードから「アプリケーション・サーバー」をクリックします。  

![](6-016.png)

左上に「アプリケーションサーバを選択します」というプルダウンがあるので、任意のアプリケーションサーバ(実体はHelidonのPod)を選択します。  

![](6-017.png) 

アプリケーションサーバ(今回はHelidon)のメトリクス情報が表示されます。  

![](6-018.png)

ここで取得したメトリクスをもとに、OCI MonitoringやOCI Notificationsと連携すると、一定の閾値を超過した際にアラーム通知を行うこともできます。  

**OCI MonitoringとOCI Notificationsについて**  
OCIにはリソース監視を行うOCI Monitoringがあり、OCI Notificationsと連携するとEmailやSlackなどに対してアラーム通知を行うことができます。  
詳細は[こちら](/ocitutorials/intermediates/monitoring-resources/)のハンズオンをご確認ください。
{: .notice--info}

このように、OCI APMを利用すると詳細なトレーシングの取得と確認およびアプリケーションサーバのメトリクス監視を行うことができます。   -->

