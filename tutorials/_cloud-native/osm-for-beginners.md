---
title: "OCI Service Meshを使ってサービスメッシュ環境を作ろう"
excerpt: "フルマネージドのサービスメッシュサービスであるOCI Service MeshとOKEを利用してサービスメッシュ環境を構築し、サンプルアプリケーションを動かすコンテンツです。"
order: "100"
tags:
---

Oracle Cloud Infrastructure(OCI) Service Meshはインフラストラクチャ・レイヤーで、セキュリティ、トラフィック制御、およびオブザーバビリティ機能をアプリケーションに提供します。  
OCI Service Meshを使用すると、クラウドネイティブ・アプリケーションの開発と運用が容易になります。  

このチュートリアルでは、BookinfoアプリケーションをOracle Container Engine for Kubernetes(OKE)クラスターにデプロイします。  
次に、OCI Service Meshをアプリケーションのデプロイメントに追加します。  

## 前提条件

- クラウド環境
  - Oracle Cloudのアカウントを取得済みであること

## 事前準備

まずは事前準備として以下を実施します。  

- 1.証明書サービスの構築
  - 1-1.証明書と認証局の作成
  - 1-2.コンパートメント・認証局・証明書のOCIDの取得

- 2.動的グループとポリシーの作成
  - OCI Service Meshや証明書サービスに関連する動的グループとポリシーの作成

- 3.Oracle Container Engine for Kubernetes(OKE)クラスターの構築
  - 3-1.OSOK(Oracle Service Operator for Kubernetes)のインストール
  - 3-2.メトリクス・サーバーのインストール

### 1.証明書サービスの構築

ここでは、OCI Service MeshでTLS（Transport Layer Security）通信を行うために必要な証明書と認証局を作成します。  

#### 1-1. 認証局と証明書の作成  

証明書サービスの構築について、[こちら](/ocitutorials/intermediates/certificate/)を実施してください。

#### 1-2.コンパートメント・認証局・証明書のOCIDの取得

ここでは、後続の手順で利用するためにコンパートメントOCIDと[1-1. 認証局と証明書の作成](#1-1-認証局と証明書の作成)で作成した証明書と認証局のOCIDの取得を行います。  

まず、コンパートメントのOCIDを取得します。

OCIコンソール画面で左上のメニューを展開して、`アイデンティティとセキュリティ`をクリックし、`コンパートメント`をクリックします。

コンパートメントのリストが表示されて、ご利用のコンパートメントをクリックします。

コンパートメントの詳細が表示されて、OCIDの右にある"コピー"をクリックして、コンパートメントのOCIDをメモしてください。

また、コンパートメント名をメモしてください。

![compartment-ocid](compartment-ocid.png)

次に、認証局のOCIDを取得します。

OCIコンソール画面で左上のメニューを展開して、`アイデンティティとセキュリティ`をクリックし、`認証局`をクリックします。

認証局のリストが表示されて、事前準備で作成した認証局をクリックします。

認証局の詳細が表示されて、OCIDの右にある"コピー"をクリックして、認証局のOCIDをメモしてください。

![authority-ocid](authority-ocid.png)

次に、証明書のOCIDを取得します。

OCIコンソール画面で左上のメニューを展開して、`アイデンティティとセキュリティ`をクリックし、`証明書`をクリックします。

証明書のリストが表示されて、事前準備で作成した証明書をクリックします。

証明書の詳細が表示されて、OCIDの右にある"コピー"をクリックして、証明書のOCIDをメモしてください。

![certificate-ocid](certificate-ocid.png)

これで、コンパートメント・認証局・証明書のOCIDの取得は完了です。

### 2.動的グループとポリシーの作成

ここでは、OCI Service Meshに必要な動的グループとポリシーを作成していきます。  

**動的グループとポリシーについて**  
Oracle Cloud Infrastrctureには動的グループという考え方があります。  
動的グループの詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Identity/Tasks/managingdynamicgroups.htm)のページをご確認ください。  
また、設定した動的グループは、ポリシーを利用することにより、OCI上のリソースやインスタンスを主体とした操作を実現できます。  
ポリシーの詳細は[こちら](https://docs.oracle.com/ja-jp/iaas/Content/Identity/Concepts/policygetstarted.htm#Getting_Started_with_Policies)のページをご確認ください。
{: .notice--info}

**ポリシー設定について**  
このハンズオンでは、ご利用のコンパートメントに対しては管理者権限(`to manage all-resources in compartment`)がある前提としています。
トライアル環境の方は、管理者権限となっておりますので、特に意識する必要はありません。
{: .notice--warning}

OCIコンソール画面で左上のメニューを展開して、`アイデンティティとセキュリティ`をクリックし、`動的グループの作成`をクリックします。

以下のように動的グループを作成します。  

- 名前：`MeshDynamicGroup`
- 説明：`MeshDynamicGroup`
- ルール1：
  ```
  ANY {instance.compartment.id = '<事前準備で取得したご利用のコンパートメントのOCID>'}
  ANY {resource.type='certificateauthority', resource.type='certificate'}
  ```

動的グループの意味はそれぞれ以下です。

| 動的グループ                                                                               | 説明                                                   |
| ------------------------------------------------------------------------------------ |
| ANY {instance.compartment.id = '<事前準備で取得したご利用のコンパートメントのOCID>'} | コンパートメント内の全てのインスタンスを意味するルール |
| ANY {resource.type='certificateauthority', resource.type='certificate'}              | 証明書サービスを意味するルール                         |

動的グループを作成したら、ポリシーを作成します。  
OCIコンソール画面で左上のメニューを展開して、`アイデンティティとセキュリティ`をクリックし、`ポリシー`をクリックします。

以下のようにポリシーを作成します。  

- 名前：`MeshPolicy`
- 説明：`MeshPolicy`
- ポリシー：
  ```
  Allow dynamic-group MeshDynamicGroup to use keys in compartment <ご利用のコンパートメント名>
  Allow dynamic-group MeshDynamicGroup to manage objects in compartment <ご利用のコンパートメント名>
  Allow dynamic-group MeshDynamicGroup to manage service-mesh-family in compartment <ご利用のコンパートメント名>
  Allow dynamic-group MeshDynamicGroup to read certificate-authority-family in compartment <ご利用のコンパートメント名>
  Allow dynamic-group MeshDynamicGroup to use certificate-authority-delegates in compartment <ご利用のコンパートメント名>
  Allow dynamic-group MeshDynamicGroup to manage leaf-certificate-family in compartment <ご利用のコンパートメント名>
  Allow dynamic-group MeshDynamicGroup to manage certificate-authority-associations in compartment <ご利用のコンパートメント名>
  Allow dynamic-group MeshDynamicGroup to manage certificate-associations in compartment <ご利用のコンパートメント名>
  Allow dynamic-group MeshDynamicGroup to manage cabundle-associations in compartment <ご利用のコンパートメント名>
  ```

ポリシーの意味はそれぞれ以下です。

 | ポリシー                                                                                                                        | 説明                                                                                       |
 | ----------------------------------------------------------------------------------------------------------------------------- |
 | Allow dynamic-group MeshDynamicGroup to use keys in compartment <ご利用のコンパートメント名>                                  | 動的グループがコンパートメント内のOCI Vault Keyを利用するためのポリシー                    |
 | Allow dynamic-group MeshDynamicGroup to manage objects in compartment <ご利用のコンパートメント名>                            | 動的グループがコンパートメント内のオブジェクトストレージ内のデータを管理するためのポリシー |
 | Allow dynamic-group MeshDynamicGroup to manage service-mesh-family in compartment <ご利用のコンパートメント名>                | 動的グループがOCI Service Meshを管理するためのポリシー                                     |
 | Allow dynamic-group MeshDynamicGroup to read certificate-authority-family in compartment <ご利用のコンパートメント名>         | 動的グループが証明書サービスの認証局を利用するためのポリシー                               |
 | Allow dynamic-group MeshDynamicGroup to use certificate-authority-delegates in compartment <ご利用のコンパートメント名>       | 動的グループが証明書サービスの各認証局と証明書を利用するためのポリシー                     |
 | Allow dynamic-group MeshDynamicGroup to manage leaf-certificate-family in compartment <ご利用のコンパートメント名>            | 動的グループが証明書サービスの各認証局と証明書を管理するためのポリシー                     |
 | Allow dynamic-group MeshDynamicGroup to manage certificate-authority-associations in compartment <ご利用のコンパートメント名> | 動的グループが証明書サービスの認証局アソシエーションを管理するためのポリシー                 |
 | Allow dynamic-group MeshDynamicGroup to manage certificate-associations in compartment <ご利用のコンパートメント名>           | 動的グループが証明書サービスの証明書アソシエーションを管理するためのポリシー                 |
 | Allow dynamic-group MeshDynamicGroup to manage cabundle-associations in compartment <ご利用のコンパートメント名>              | 動的グループが証明書サービスのバンドルアソシエーションを管理するためのポリシー               |

これで、動的グループとポリシーの作成は完了です。

### 3.OKEクラスターの構築

OKEクラスターの構築について、[こちら](https://oracle-japan.github.io/ocitutorials/cloud-native/oke-for-commons/)を参考に実施してください。

#### 3-1.OSOKのインストール

OCI Service Meshでは、Kubernetes Operatorとして[OSOK(Oracle Service Operator for Kubernetes)](https://github.com/oracle/oci-service-operator)を利用します。

OSOKをインストールするためには、Operator SDKとオペレーター・ライフサイクル・マネージャ(OLM)のインストールが必要です。

Operator SDKとオペレーター・ライフサイクル・マネージャ(OLM)のインストールは、[こちら](/ocitutorials/cloud-native/oke-for-intermediates/#9-1-operator-sdkおよびオペレータライフサイクルマネージャolmのインストール)を実施してください。(リンク先の実施手順は`9-1`のみで問題ありません)

Operator SDKとオペレーター・ライフサイクル・マネージャ(OLM)のインストールが完了したら、以下のコマンドを実行し、OSOK用のNamespaceを作成します。

```sh
kubectl create ns oci-service-operator-system
```

次にOSOKをインストールします。

```sh
operator-sdk run bundle iad.ocir.io/oracle/oci-service-operator-bundle:1.1.0 -n oci-service-operator-system --timeout 5m
```

以下のように出力され、OSOKがインストールされます。

```sh
INFO[0036] Successfully created registry pod: iad-ocir-io-oracle-oci-service-operator-bundle-X-X-X 
INFO[0036] Created CatalogSource: oci-service-operator-catalog 
INFO[0037] OperatorGroup "operator-sdk-og" created      
INFO[0037] Created Subscription: oci-service-operator-vX-X-X-sub 
INFO[0040] Approved InstallPlan install-tzk5f for the Subscription: oci-service-operator-vX-X-X-sub 
INFO[0040] Waiting for ClusterServiceVersion "oci-service-operator-system/oci-service-operator.vX.X.X" to reach 'Succeeded' phase 
INFO[0040]   Waiting for ClusterServiceVersion "oci-service-operator-system/oci-service-operator.vX.X.X" to appear 
INFO[0048]   Found ClusterServiceVersion "oci-service-operator-system/oci-service-operator.vX.X.X" phase: Pending 
INFO[0049]   Found ClusterServiceVersion "oci-service-operator-system/oci-service-operator.vX.X.X" phase: InstallReady 
INFO[0053]   Found ClusterServiceVersion "oci-service-operator-system/oci-service-operator.vX.X.X" phase: Installing 
INFO[0066]   Found ClusterServiceVersion "oci-service-operator-system/oci-service-operator.vX.X.X" phase: Succeeded 
INFO[0067] OLM has successfully installed "oci-service-operator.vX.X.X"
```

#### 3-2.メトリクス・サーバーのインストール

OCI Service Meshでは、HPA(Horizontal Pod Autoscaler)を利用してIngress Gateway(後述)がスケールするので、メトリクス・サーバーをインストールしておきます。

```sh
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/high-availability.yaml
```

これで事前準備は完了です！

## 1.OCI Service Meshの構築

ここから、いよいよOCI Service Meshの構築に入っていきます。

全体としては以下のような手順になります。  

- 1.OCI Service Meshリソースの解説

- 2.サンプルアプリケーションのデプロイ

- 3.OCI Service Meshリソースの作成

- 4.動作確認

### 1.OCI Service Meshリソースの解説

まずは、OCI Service Meshで利用するリソースから確認します。  

次の図に示すように、OCI Service Meshは、マネージド・コントロール・プレーンから構成情報を受信する各マイクロサービスと共にプロキシをデプロイすることによって実装されます。  
メッシュはプロキシを使用して、マイクロサービスに代わってIngressリクエストとOutboundリクエストを実行します。  
この構成により、サービス・メッシュのセキュリティ、トラフィック制御、および監視機能が有効になります。イングレスゲートウェイ・リソースは、メッシュへの入力トラフィックを管理します。

![service-mesh](service-mesh.jpg)

次の図は、OCI Service MeshにデプロイされるBookinfoアプリケーション(このハンズオンでも利用します)をベースにした各リソースを示しています。

イングレストラフィックは、イングレスゲートウェイとイングレスゲートウェイのルート・テーブルを介して"Product Page"サービスにルーティングされます。  
Reviewsサービスのさまざまなバージョンは、そのサービスの仮想デプロイメントを表します。アクセス・ポリシーは、サービス間通信のアクセス制御にセットアップされます。

![service-mesh-deployment](service-mesh-deployment.jpg)

次の図は、OCI Service Meshのリソース間の関係を定義します。![/mesh-components](mesh-components.jpg)

各リソースを簡単に説明します。

- Mesh: サービス・メッシュ全体を表すリソース
- Virtual Service: サービス・メッシュ内の仮想サービス
- Virtual Deployment: Virtual Serviceに紐づける仮想デプロイメント
- Virtual Service Route Table: Virtual Service内のトラフィック・ルール。IstioでいうDestination Ruleのような存在。
- Ingress Gateway: メッシュ外からメッシュ内への通信を制御するGateway。IstioのIngress Gatewayとほぼ同じ。
- Ingress Gateway Route Table: Ingress Gatewayのトラフィック・ルール。
- Access Policy: Virtual Serviceに対するアクセス制御。

OCI Service Meshには他にもリソースがありますが、上の図は主なリソースだけピックアップしています。  

OCI Service Meshのリソースの全体像をまとめておきます。  
(図内にはこのハンズオンでは取り上げないコンポーネントも含まれていますが、そちらは中級編以降で取り上げます)

![osm-overview](osm-overview.png)

各種リソースを説明したところで、ここから、OCI Service Meshを構築していきます。  

### ２.サンプルアプリケーション(Bookinfoアプリケーション)のデプロイ

今回はBookinfoアプリケーションを利用したService Mesh環境を構築していきます。

まず、最初にBookinfoアプリケーション用のNamespaceを作成します。

```sh
kubectl create namespace bookinfo
```

次に、bookinfo Namespaceに対して、OCI Service Meshを有効にするラベルを付与します。

```sh
kubectl label namespace bookinfo servicemesh.oci.oracle.com/sidecar-injection=enabled
```

Bookinfoアプリケーションをデプロイします。  

```sh
kubectl apply -n bookinfo -f https://raw.githubusercontent.com/istio/istio/release-1.12/samples/bookinfo/platform/kube/bookinfo.yaml
```

これでサンプルアプリケーションのデプロイは完了です。  

### 3.OCI Service Meshリソースの作成

次に、OCI Service Meshを構成するためのリソースを作っていきます。

なお、Manifestの中でアプリケーションのホスト名が定義されていますが、今回は`service-mesh.oracle.com`とします。  
後でhostsファイルを編集します。

OCI Service Meshのリソースを作成するためのManifest`bookinfo_mesh.yaml`を作成します。  
以下の情報を環境関数として設定します。  
これらの情報は[1-2.コンパートメント・認証局・証明書のOCIDの取得](#1-2コンパートメント認証局証明書のocidの取得)で収集したものです。  

- YOUR_COMPARTMENT_OCID: 事前準備で取得したご利用のコンパートメントのOCIDに差し替えてください。
- YOUR_CERTIFICATE_AUTHORITY_OCID: 事前準備で取得した認証局のOCIDに差し替えてください。
- YOUR_CERTIFICATE_OCID: 事前準備で取得した証明書のOCIDに差し替えてください。

```sh
YOUR_COMPARTMENT_OCID=ocid1.compartment.oc1..xxxxxxxxxx
YOUR_CERTIFICATE_AUTHORITY_OCID=ocid1.certificateauthority.oc1.xxxxxxxxxx
YOUR_CERTIFICATE_OCID=ocid1.certificate.oc1.xxxxxxxxxx
```

`bookinfo_mesh.yaml`を作成します。  

```yaml
cat > bookinfo_mesh.yaml << EOF
---
kind: Mesh
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: bookinfo
  namespace: bookinfo
spec:
  compartmentId: $YOUR_COMPARTMENT_OCID
  certificateAuthorities:
    - id: $YOUR_CERTIFICATE_AUTHORITY_OCID
  mtls:
    minimum: PERMISSIVE
---
##################################################################################################
# Details service
##################################################################################################
kind: VirtualService
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: details
  namespace: bookinfo
spec:
  mesh:
    ref:
      name: bookinfo
  defaultRoutingPolicy:
    type: UNIFORM
  compartmentId: $YOUR_COMPARTMENT_OCID
  hosts:
    - details
    - details:9080
---
kind: VirtualDeployment
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: details-v1
  namespace: bookinfo
spec:
  virtualService:
    ref:
      name: details
  compartmentId: $YOUR_COMPARTMENT_OCID
  listener:
    - port: 9080
      protocol: HTTP
  accessLogging:
    isEnabled: true
  serviceDiscovery:
    type: DNS
    hostname: details
---
apiVersion: servicemesh.oci.oracle.com/v1beta1
kind: VirtualServiceRouteTable
metadata:
  name: details-route-table
  namespace: bookinfo
spec:
  compartmentId: $YOUR_COMPARTMENT_OCID
  virtualService:
    ref:
      name: details
  routeRules:
    - httpRoute:
        destinations:
          - virtualDeployment:
              ref:
                name: details-v1
            weight: 100
---
##################################################################################################
# Ratings service
##################################################################################################
kind: VirtualService
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: ratings
  namespace: bookinfo
spec:
  mesh:
    ref:
      name: bookinfo
  defaultRoutingPolicy:
    type: UNIFORM
  compartmentId: $YOUR_COMPARTMENT_OCID
  hosts:
    - ratings
    - ratings:9080
---
kind: VirtualDeployment
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: ratings-v1
  namespace: bookinfo
spec:
  virtualService:
    ref:
      name: ratings
  compartmentId: $YOUR_COMPARTMENT_OCID
  listener:
    - port: 9080
      protocol: HTTP
  accessLogging:
    isEnabled: true
  serviceDiscovery:
    type: DNS
    hostname: ratings
---
apiVersion: servicemesh.oci.oracle.com/v1beta1
kind: VirtualServiceRouteTable
metadata:
  name: ratings-route-table
  namespace: bookinfo
spec:
  compartmentId: $YOUR_COMPARTMENT_OCID
  virtualService:
    ref:
      name: ratings
  routeRules:
    - httpRoute:
        destinations:
          - virtualDeployment:
              ref:
                name: ratings-v1
            weight: 100
---
##################################################################################################
# Reviews service
##################################################################################################
kind: VirtualService
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: reviews
  namespace: bookinfo
spec:
  mesh:
    ref:
      name: bookinfo
  defaultRoutingPolicy:
    type: UNIFORM
  compartmentId: $YOUR_COMPARTMENT_OCID
  hosts:
    - reviews
    - reviews:9080
---
kind: VirtualDeployment
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: reviews-v1
  namespace: bookinfo
spec:
  virtualService:
    ref:
      name: reviews
  compartmentId: $YOUR_COMPARTMENT_OCID
  listener:
    - port: 9080
      protocol: HTTP
  accessLogging:
    isEnabled: true
  serviceDiscovery:
    type: DNS
    hostname: reviews
---
kind: VirtualDeployment
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: reviews-v2
  namespace: bookinfo
spec:
  virtualService:
    ref:
      name: reviews
  compartmentId: $YOUR_COMPARTMENT_OCID
  listener:
    - port: 9080
      protocol: HTTP
  accessLogging:
    isEnabled: true
  serviceDiscovery:
    type: DNS
    hostname: reviews
---
kind: VirtualDeployment
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: reviews-v3
  namespace: bookinfo
spec:
  virtualService:
    ref:
      name: reviews
  compartmentId: $YOUR_COMPARTMENT_OCID
  listener:
    - port: 9080
      protocol: HTTP
  accessLogging:
    isEnabled: true
  serviceDiscovery:
    type: DNS
    hostname: reviews
---
apiVersion: servicemesh.oci.oracle.com/v1beta1
kind: VirtualServiceRouteTable
metadata:
  name: reviews-route-table
  namespace: bookinfo
spec:
  compartmentId: $YOUR_COMPARTMENT_OCID
  virtualService:
    ref:
      name: reviews
  routeRules:
    - httpRoute:
        destinations:
          - virtualDeployment:
              ref:
                name: reviews-v1
            weight: 50
          - virtualDeployment:
              ref:
                name: reviews-v2
            weight: 25
          - virtualDeployment:
              ref:
                name: reviews-v2
            weight: 25
---
##################################################################################################
# Productpage services
##################################################################################################
kind: VirtualService
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: productpage
  namespace: bookinfo
spec:
  mesh:
    ref:
      name: bookinfo
  defaultRoutingPolicy:
    type: UNIFORM
  compartmentId: $YOUR_COMPARTMENT_OCID
  hosts:
    - productpage
    - productpage:9080
---
kind: VirtualDeployment
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: productpage
  namespace: bookinfo
spec:
  virtualService:
    ref:
      name: productpage
  compartmentId: $YOUR_COMPARTMENT_OCID
  listener:
    - port: 9080
      protocol: HTTP
  accessLogging:
    isEnabled: true
  serviceDiscovery:
    type: DNS
    hostname: productpage
---
apiVersion: servicemesh.oci.oracle.com/v1beta1
kind: VirtualServiceRouteTable
metadata:
  name: productpage-route-table
  namespace: bookinfo
spec:
  compartmentId: $YOUR_COMPARTMENT_OCID
  virtualService:
    ref:
      name: productpage
  routeRules:
    - httpRoute:
        destinations:
          - virtualDeployment:
              ref:
                name: productpage
            weight: 100
---
kind: IngressGateway
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: bookinfo-ingress-gateway
  namespace: bookinfo
spec:
  compartmentId: $YOUR_COMPARTMENT_OCID
  mesh:
    ref:
      name: bookinfo
  hosts:
    - name: bookinfoHost
      hostnames:
        - service-mesh.oracle.com
      listeners:
        - port: 9080
          protocol: HTTP
          tls:
            serverCertificate:
              ociTlsCertificate:
                certificateId: $YOUR_CERTIFICATE_OCID
            mode: TLS
  accessLogging:
    isEnabled: true
---
apiVersion: servicemesh.oci.oracle.com/v1beta1
kind: IngressGatewayRouteTable
metadata:
  name: bookinfo-ingress-gateway-route-table
  namespace: bookinfo
spec:
  compartmentId: $YOUR_COMPARTMENT_OCID
  ingressGateway:
    ref:
      name: bookinfo-ingress-gateway
  routeRules:
    - httpRoute:
        ingressGatewayHost:
          name: bookinfoHost
        destinations:
          - virtualService:
              ref:
                name: productpage
---
kind: AccessPolicy
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: bookinfo-policy
  namespace: bookinfo
spec:
  mesh:
    ref:
      name: bookinfo
  compartmentId: $YOUR_COMPARTMENT_OCID
  rules:
    - action: ALLOW
      source:
        virtualService:
          ref:
            name: productpage
      destination:
        virtualService:
          ref:
            name: details
    - action: ALLOW
      source:
        virtualService:
          ref:
            name: productpage
      destination:
        virtualService:
          ref:
            name: reviews
    - action: ALLOW
      source:
        virtualService:
          ref:
            name: reviews
      destination:
        virtualService:
          ref:
            name: ratings
    - action: ALLOW
      source:
        ingressGateway:
          ref:
            name: bookinfo-ingress-gateway
      destination:
        virtualService:
          ref:
            name: productpage
---
EOF
```

次に、上記Manifestで作成した`VirtualDeployment`と`Virtual Service`をバインドするために`binding.yaml`を作成します。  

`~Binding`という名称の[1.OCI Service Meshリソースの解説](#1oci-service-meshリソースの解説)で解説したリソースでは登場していないリソースが出てきますが、`VirtualDeployment`と`Virtual Service`を"バインド"するリソースというイメージを持って頂ければ問題ありません。  

`binding.yaml`を作成します。

```yaml
cat > binding.yaml << EOF
kind: VirtualDeploymentBinding
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: details-binding
  namespace: bookinfo
spec:
  virtualDeployment:
    ref:
      name: details-v1
      namespace: bookinfo
  target:
    service:
      ref:
        name: details
        namespace: bookinfo
---
kind: VirtualDeploymentBinding
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: ratings-v1-binding
  namespace: bookinfo
spec:
  virtualDeployment:
    ref:
      name: ratings-v1
      namespace: bookinfo
  target:
    service:
      ref:
        name: ratings
        namespace: bookinfo
      matchLabels:
        version: v1
---
kind: VirtualDeploymentBinding
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: reviews-v1-binding
  namespace: bookinfo
spec:
  virtualDeployment:
    ref:
      name: reviews-v1
      namespace: bookinfo
  target:
    service:
      ref:
        name: reviews
        namespace: bookinfo
      matchLabels:
        version: v1
---
kind: VirtualDeploymentBinding
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: reviews-v2-binding
  namespace: bookinfo
spec:
  virtualDeployment:
    ref:
      name: reviews-v2
      namespace: bookinfo
  target:
    service:
      ref:
        name: reviews
        namespace: bookinfo
      matchLabels:
        version: v2
---
kind: VirtualDeploymentBinding
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: reviews-v3-binding
  namespace: bookinfo
spec:
  virtualDeployment:
    ref:
      name: reviews-v3
      namespace: bookinfo
  target:
    service:
      ref:
        name: reviews
        namespace: bookinfo
      matchLabels:
        version: v3
---
kind: VirtualDeploymentBinding
apiVersion: servicemesh.oci.oracle.com/v1beta1
metadata:
  name: productpage-binding
  namespace: bookinfo
spec:
  virtualDeployment:
    ref:
      name: productpage
      namespace: bookinfo
  target:
    service:
      ref:
        name: productpage
        namespace: bookinfo
---
EOF
```

次に、イングレスゲートウェイリソースを作成するためのManifestである`service.yaml`を作成します。  

ここでも、`IngressGatewayDeployment`という名称の[1.OCI Service Meshリソースの解説](#1oci-service-meshリソースの解説)では解説していないリソースが登場しますが、Proxyのような存在だとイメージ頂ければ問題ありません。  
(Istioをご存知の方はEnvoyにあたるものです)

`service.yaml`を作成します。  

```yaml
cat > service.yaml << EOF
apiVersion: servicemesh.oci.oracle.com/v1beta1
kind: IngressGatewayDeployment
metadata:
  name: bookinfo-ingress-gateway-deployment
  namespace: bookinfo
spec:
  ingressGateway:
    ref:
      name: bookinfo-ingress-gateway
      namespace: bookinfo
  deployment:
    autoscaling:
      minPods: 1
      maxPods: 1
  ports:
    - protocol: TCP
      port: 9080
      serviceport: 443
  service:
    type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: bookinfo-ingress
  namespace: bookinfo
  annotations:
    service.beta.kubernetes.io/oci-load-balancer-shape: "flexible"
    service.beta.kubernetes.io/oci-load-balancer-shape-flex-min: "10"
    service.beta.kubernetes.io/oci-load-balancer-shape-flex-max: "100"
spec:
  ports:
    - port: 80
      targetPort: 9080
      name: http
    - port: 443
      targetPort: 9080
      name: https
  selector:
    servicemesh.oci.oracle.com/ingress-gateway-deployment: bookinfo-ingress-gateway-deployment
  type: LoadBalancer
EOF
```

それでは作成したManifestを順番に適用していきます。

```sh
kubectl apply -f bookinfo_mesh.yaml
kubectl apply -f binding.yaml
kubectl apply -f service.yaml
```

これで、OCI Service Meshの環境構築は完了です。

### 4.動作確認

最後に動作確認を行います。  

Podが全て起動していることを確認します。

```sh
$ kubectl get pods -n bookinfo
NAME                                                              READY   STATUS    RESTARTS   AGE
bookinfo-ingress-gateway-deployment-deployment-595f7d5bc5-fqrbf   1/1     Running   0          23s
details-v1-586577784f-bp9dd                                       2/2     Running   0          4m41s
productpage-v1-589b848cc9-2zsw6                                   2/2     Running   0          4m38s
ratings-v1-679fc7b4f-stnk9                                        2/2     Running   0          4m30s
reviews-v1-7b76665ff9-2xvrh                                       2/2     Running   0          4m40s
reviews-v2-6b86c676d9-r2j6x                                       2/2     Running   0          4m39s
reviews-v3-b77c579-69pkq                                          2/2     Running   0          4m38s
```

アプリケーションにアクセスするにはイングレスゲートウェイ(実態はOCI LoadBalancerになります)を利用するので、以下のコマンドでIPアドレスを確認します。

```sh
$ kubectl get svc -n bookinfo
NAME                                          TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                      AGE
bookinfo-ingress                              LoadBalancer   10.96.213.172   xxx.xxx.xxx.xxx 80:31700/TCP,443:31248/TCP   2m51s
bookinfo-ingress-gateway-deployment-service   ClusterIP      10.96.14.228    <none>          443/TCP                      2m51s
details                                       ClusterIP      10.96.174.202   <none>          9080/TCP                     13m
productpage                                   ClusterIP      10.96.222.216   <none>          9080/TCP                     13m
ratings                                       ClusterIP      10.96.120.160   <none>          9080/TCP                     13m
reviews                                       ClusterIP      10.96.22.199    <none>          9080/TCP                     13m
```

`bookinfo-ingress`に表示される`EXTERNAL-IP`(`xxx.xxx.xxx.xxx`)がLoadBalancerのIPアドレスになります。

今回は、`https://service-mesh.oracle.com`でアクセスしたいので、ローカルのhostsファイルに以下の列を追記します。

```
xxx.xxx.xxx.xxx service-mesh.oracle.com
```

これで`https://service-mesh.oracle.com/productpage`にアクセスし、以下のような画面が表示されれば成功です！

![bookinfo-product-page](bookinfo-product-page.png)

また、OCIコンソール上から見るとOSOKを利用して各種リソースが作成されていることが確認できます。  
OCIコンソールは、左上のメニューを展開して、`開発者サービス`をクリックし、`サービス・メッシュ`をクリックします。

また、OCIコンソールからリソースを作成または変更すればOSOKがOKEクラスターに反映してくれます。

![oci-service-mesh-bookinfo](oci-service-mesh-bookinfo.png)

これで、OCI Service Meshの構築は完了です。

## Bookinfoアプリケーションの説明（オプション）

Bookinfoアプリケーションは、オープンソースのサービスメッシュプラットフォームである`Istio`のプロジェクトの一部として配布されています。  
オンライン書店の単一のカタログエントリと同様に、書籍に関する情報を表示します。  
アプリケーションのページには、書籍の説明、書籍の詳細 (ISBN、ページ数など)、およびいくつかの書評が表示されます。

アプケーションの全体イメージは以下のようになります。  

![Bookinfo Application](bookinfo.png)

次の4つの個別のマイクロサービスに分かれています。

- `productpage`: `details`のマイクロサービスと`reviews`のマイクロサービスを呼び出し、フロントエンドページを提供します。  
- `details`: 書籍情報を提供します。
- `reviews`: 書評を提供します。また、`ratings`のマイクロサービスも呼び出します。(以下を参照)
- `ratings`: 書評に付随する評価(レートポイント)を提供します。  

また、`reviews`のマイクロサービスには3つのバージョンがあります。

- バージョンv1では、`ratings`は呼び出されません。
- バージョンv2では、`ratings`を呼び出し、各評価を1~5個の黒い星として表示します。
- バージョンv3では、`ratings`を呼び出し、各評価を1~5個の赤い星として表示します。

このアプリケーションは複数言語からされており、これらのサービスは特定のサービスメッシュプラットフォームに依存していません。
