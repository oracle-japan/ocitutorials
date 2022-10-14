---
title: "Oracle GoldenGate Stream Analytics ハンズオン"
excerpt: "Oracle GoldenGate Stream Analytics は、IoT データ、パイプライン、ログデータ、ソーシャルメディアといった Stream データをリアルタイムに分析的計算処理するテクノロジーを提供するプラットフォームです。"
order: "050"
tags: "ggsa"
date: "2021-09-14"
lastmod: "2021-10-01"
---

Oracle GoldenGate Stream Analytics(以下、GGSA) は、IoT データ、パイプライン、ログデータ、ソーシャルメディアといった Stream データをリアルタイムに分析的計算処理するテクノロジーを提供するプラットフォームです。

このエントリーでは、GGSA の Marketplace からのプロビジョニングからチュートリアル完了までの手順を記します。

# 前提条件

- クラウド環境
  - Oracle Cloud のアカウントを取得済みであること

# ハンズオン環境の全体像

OCI Marketplace から GGSA を最小構成でプロビジョニングすると、以下の環境が作成されます。本エントリーでは、この環境を用いてハンズオンを実施します。

![architecture](architecture.png)

# 作成する Pipeline の全体像

このエントリーでは、リアルタイムに流れてくる交通データを分析することを行います。最終的に完成する Pipeline は以下のようになります。

![pipeline](pipeline.png)

それぞれの Stage で実施されることについて簡単に説明します。

**車両の走行データ**

リアルタイムに流れてくる交通データを Java プログラムで疑似的に表現しています。Java プログラム中では、Kafka の特定 Topic(tutorial)に対してメッセージを publish しており、本ハンズオンは該当の Topic から メッセージを consume する所から始まります。

関連するハンズオンの章:

- [2-1. チュートリアル用のイベント・ストリームを Kafka に Publish する](#2-1-ハンズオン用のイベントストリームを-kafka-に-publish-する)
- [2-2. OSA UI で Kafka の Connection を定義する](#2-2-osa-ui-で-kafka-の-connection-を定義する)
- [2-3. Stream の作成](#2-3-stream-の作成)

**Atlanta の地図情報**

使用するデータには、アメリカ全土の交通データが含まれています。今回は、その中でも Atlanta の交通データに絞り込んで分析を行うために、地理的な境界を定義します。

関連するハンズオンの章:

- [2-4. Geo Fence の作成](#2-4-geo-fence-の作成)

**地理的境界で絞り込む**

Atlanta の地図情報で定義した地理的境界に含まれるデータを入力データの緯度・経度を元に判定し、Atlanta 内の交通データに絞り込みを行います。

関連するハンズオンの章:

- [2-6. Atlanta の車両に限定する](#2-6-atlanta-の車両に限定する)

**平均の速さを元に絞り込む**

以降のステージでは、動いている車両に対して分析を行うため、その前処理として止まっている車両をストリームデータから取り除きます。

関連するハンズオンの章:

- [2-7. 止まっている車両をストリームデータから除外する](#2-7-止まっている車両をストリームデータから除外する)

**平均の速さを元にラベリングする**

動いている車両に対して、いくつかのルールを設定しその判定結果に応じてラベリング、結果の可視化を行います。

関連するハンズオンの章:

- [2-8. リアルタイム分析のためのルールを作成する](#2-8-リアルタイム分析のためのルールを作成する)

**Kafka に対して publish**

パイプライン処理が完了したデータを別のサービスで活用するために Kafka に publish します。

関連するハンズオンの章:

- [2-10. Target の作成](#2-10-target-の作成)
- [2-11. Pipeline の Publish](#2-11-pipeline-の-publish)
- [2-12. (参考) Publish されたメッセージを確認する](#2-12-参考-publish-されたメッセージを確認する)

# ハンズオン手順

## 1. 事前準備

### 1-1. 鍵ペアの作成

本ハンズオンは、Oracle Cloud Infrastructure の Cloud Shell から 新しくプロビジョニングする GGSA のインスタンスに対して SSH 接続を行い実施します。まずは、OCI コンソール画面右上の **Cloud Shell** を押し、Cloud Shell を起動します。

![image01](image01.png)

SSH 接続に使用する鍵ペアを作成します。まずは、鍵ペアを保存するディレクトリを作成し、移動します。

```bash
mkdir .ssh; cd .ssh
```

鍵ペアを作成します。

```bash
ssh-keygen -t rsa -N "" -b "2048" -C "ggsa_hol" -f id_ggsa
```

作成した鍵ペアとディレクトリのアクセス権を修正します。

鍵ペア

```bash
chmod 600 *
```

ディレクトリ(`.ssh`)

```bash
cd; chmod 700 .ssh
```

以下のような状態となっていれば鍵ペアの作成は完了です。

ディレクトリ(`.ssh`)

```bash
ls -la | grep .ssh
```

コマンド実行結果

```bash
drwx------.  2 shuhei_kaw oci        40 Sep 26 05:37 .ssh
```

鍵ペア

```bash
ls -la .ssh
```

コマンド実行結果

```bash
total 12
drwx------.  2 shuhei_kaw oci   40 Sep 26 05:37 .
drwxr-xr-x. 11 shuhei_kaw oci 4096 Sep 26 05:37 ..
-rw-------.  1 shuhei_kaw oci 1679 Sep 26 05:37 id_ggsa
-rw-------.  1 shuhei_kaw oci  390 Sep 26 05:37 id_ggsa.pub
```

[1-2. Marketplace からインスタンスのプロビジョニング](#1-2-marketplace-からインスタンスのプロビジョニング)で使用するため、公開鍵(`id_ggsa.pub`)の内容をメモ帳などに控えておきます。

### 1-2. Marketplace からインスタンスのプロビジョニング

OCI コンソール画面左上のハンバーガーメニューを展開し、**マーケットプレイス** > **すべてのアプリケーション** と選択します。

![image02](image02.png)

アプリケーションの一覧画面で、検索窓に**Stream Analytics**と入力し、**Oracle GoldenGate Stream Analytics - UCM** を選択します。

![image03](image03.png)

**Oracle 使用条件を確認し上でこれに同意します。**にチェックを入れた後に、**スタックの起動**をクリックします。

![image04](image04.png)

自動入力された項目を確認し、**次**をクリックします。

![image05](image05.png)

作成するインスタンスに関する情報を入力します。

- Display Name: 任意の名前
- Host DNS Name(オプション): ggsa

![image06](image06.png)

インスタンスが属するネットワークに関する設定を入力します。

- Use Existing Network: チェックを外す
- VCN Network Compartment(オプション): 任意のコンパートメント名
- Subnet Network Compartment(オプション): 任意のコンパートメント名(VCN Network Compartment と同様のコンパートメント名)
- New VCN DNS Name: vcn
- New VCN CIDR: 10.2.0.0/16
- New Subnet DNS Name(オプション): subnet
- New Subnet CIDR: 10.2.1.0/24

![image07](image07.png)

インスタンスに関する情報を入力します。

- Availability Domain: 任意の AD を選択
- Compute Shape: VM.Standard2.4
- Assign Public IP: チェックを入れる

![image08](image08.png)

インスタンスに SSH 接続するために[1-1. 鍵ペアの作成](#1-1-鍵ペアの作成)で作成した公開鍵を入力します。

![image09](image09.png)

**次**をクリックした後に、入力内容を確認して、**作成**を押します。

![image10](image10.png)

リソース・マネージャーのジョブの状態が成功となっていれば、インスタンスのプロビジョニングは完了です。

![image11](image11.png)

下までスクロールすると、Resource Manager のログが出力されているため、以下のようなログが出力されていることを確認します。

![image12](image12.png)

```bash
Apply complete! Resources: 10 added, 0 changed, 0 destroyed.
Outputs:
ggesp_image_id = ocid1.image.oc1..aaaaaaaatdxy7rcotma5cjujpu3tqo4zbdvgfhg72eq6py3clrjuum62sngq
ggesp_instance_id = ocid1.instance.oc1.ap-osaka-1.anvwsljrssl65iqcw5jdn4ysrehcdxb2ixj43qrwytitc5ngcb2uqxusla5a
ggesp_public_ip = [ 140.83.87.172 ]
```

SSH 接続時に必要となるため、パブリック IP(`ggesp_public_ip = [ 140.83.87.172 ]`) をメモ帳などに控えておきます。

### 1-3. ハンズオンに使用するコンテンツのダウンロード

以降の作業は、Cloud Shell から[1-2. Marketplace からインスタンスのプロビジョニング](#1-2-marketplace-からインスタンスのプロビジョニング)でプロビジョニングしたインスタンスに対して SSH 接続して行います。

```bash
ssh opc@<public-ip> -i ~/.ssh/id_ggsa
```

例:

```bash
ssh opc@140.83.87.172 -i ~/.ssh/id_ggsa
```

次に、ハンズオンに使用するコンテンツを任意のディレクトリにダウンロードし、展開します。ここでは、ホームディレクトリに `ggsa` という作業用のディレクトリを作成します。

```bash
cd ~; mkdir ggsa; cd ggsa
```

コンテンツをダウンロードします。

```bash
wget http://www.oracle.com/technetwork/middleware/complex-event-processing/learnmore/resourcesfortutorials-4015265.zip
```

展開します。

```bash
unzip resourcesfortutorials-4015265.zip -d resources
```

展開した先のディレクトリには以下のコンテンツが含まれていることを確認します。

```bash
ls resources/
```

コマンド実行結果

```bash
BusEvents.json  OsacsEventFeeder.jar  SalesTransactions.json  suppliers.sql
```

### 1-4. プロビジョニングしたインスタンスの確認

Marketplace からプロビジョニングしたインスタンスのホームディレクトリに GGSA 関連の接続情報が `README.txt` に記されています。実際の内容は以下のようになっています。

```bash
cat README.txt
```

```bash
###### Database

Your root password for MySQL metadata store is +t8[M<O[ni+HiCmX%54(

Your OSA_DEMO user password for MySQL 'OSA_DEMO' database is Welcome123!

Your OSA user password for MySQL osa metadata store (OSADB database) is >+(SM-RWwXCnOz6_VXj>


###### VCN SECURITY RULES

To access OSA and Spark UIs from the internet via HTTPS, set up stateless ingress rules to port 443.

###### OSA UI

Your osaadmin  password to login to OSA UI is x55j0wEGwfE=

You can access OSA UI using https://<PUBLIC_IP>/osa

###### OSA RUNTIME

Access Spark UI using https://<PUBLIC_IP>/spark

List of well known ports...

KAFKA BROKER PORTS (9092) ZOOKEEPER PORT (2181)
MYSQL PORT (3306)

###### SPARK DEFAULT USER CREDENTIALS

Username: sparkadmin
Password: Sparkadmin#123

###### CHANGING PASSWORDS

Use System Settings in OSA UI to change the OSA Admin password.
Use System Settings in OSA UI to set Spark admin user name and password.
Use mysql -uroot -p to change MySQL root user password.
```

本ハンズオンでは、OSA UI の接続情報が必要となるため、メモ帳などに控えておいてください。

```bash
###### OSA UI

Your osaadmin  password to login to OSA UI is x55j0wEGwfE=

You can access OSA UI using https://<PUBLIC_IP>/osa
```

## 2. ハンズオン

### 2-1. ハンズオン用のイベント・ストリームを Kafka に Publish する

まずは、ハンズオン用の Topic(tutorial) を作成します。

```bash
$KAFKA_HOME/bin/kafka-topics.sh --create --zookeeper localhost:2181 --partitions 5 --replication-factor 1 --topic tutorial
```

コマンド実行結果

```bash
Created topic "tutorial".
```

次にダウンロードしたコンテンツに含まれる Java プログラムを使用して、作成した Topic に対してデータを送信します。

```bash
cd ~/ggsa/resources/; java -jar OsacsEventFeeder.jar --zookeeper localhost:2181 --json BusEvents.json --topic tutorial > /tmp/tutorial.`date "+%Y%m%d_%H%M%S"` 2>&1 &
```

コマンド実行結果(PID は一例)

```bash
[1] 6654
```

生成されたファイル名を確認します。

```bash
ls /tmp | grep tutorial
```

コマンド実行結果

```bash
tutorial.20211001_011436
```

Kafka に対するメッセージ送信が成功しているかどうかを確認します。

```bash
tail -f /tmp/tutorial.20211001_011436
```

コマンド実行結果

```bash
...
RESPONSE: Topic: tutorial, Offset: 766


REQUEST: { "BUSdirection" : "Eastbound", "BUStime" : "2016-12-31T14:23:37.000Z", "BUStimePoint" : "Brockett Rd. & E.Ponce De Leon", "BUSroute" : 120, "BUSstopId" : 902444, "BUStripId" : 5389198, "BUSvehicle_type" : 15, "BUStype_ID" : 55, "BUSlong" : -84.2298945, "BUSlat" : 33.8190495, "Bus_Speed" : 64, "Bus_DriverNo" : 11268, "Bus_Hwy" : "HWY66" }

RESPONSE: Topic: tutorial, Offset: 766


REQUEST: { "BUSdirection" : "Northbound", "BUStime" : "2016-12-31T14:23:37.000Z", "BUStimePoint" : "Flint River @ Thomas Rd", "BUSroute" : 191, "BUSstopId" : 212408, "BUStripId" : 5424437, "BUSvehicle_type" : 23, "BUStype_ID" : 61, "BUSlong" : -84.408493, "BUSlat" : 33.5183772, "Bus_Speed" : 0, "Bus_DriverNo" : 13139, "Bus_Hwy" : "HWY66" }

RESPONSE: Topic: tutorial, Offset: 767
...
```

`REQUEST: { "BUSdirection" : "Eastbound", "BUStime" : "2016-12-31T14:23:37.000Z", "BUStimePoint" : "Brockett Rd. & E.Ponce De Leon", "BUSroute" : 120, "BUSstopId" : 902444, "BUStripId" : 5389198, "BUSvehicle_type" : 15, "BUStype_ID" : 55, "BUSlong" : -84.2298945, "BUSlat" : 33.8190495, "Bus_Speed" : 64, "Bus_DriverNo" : 11268, "Bus_Hwy" : "HWY66" }` のような文字列が連続して出力され続ければ、Kafka に対するデータの送信が成功しています。

### 2-2. OSA UI で Kafka の Connection を定義する

ここからの作業は、OSA(Oracle Stream Analytics)の UI にて実施するため、ブラウザで`https://<PUBLIC_IP>/osa`へアクセスします。アクセスすると、以下のような画面が表示されるので、`README.txt`に記載のあるユーザー名／パスワードの組み合わせでログインします。([1-4. プロビジョニングしたインスタンスの確認](#1-4-プロビジョニングしたインスタンスの確認) を参照)

![image13](image13.png)

ログイン後に、**Catalog** > **Create New Item** > **Connection** > **Kafka**と押し、Kafka の接続情報を定義します。

![image14](image14.png)

以下のように入力し、**Next >** をクリックします。

- Name: Tutorial
- Tag(オプション): tutorial, transport
- Connection Type: Kafka

![image15](image15.png)

Kafka の接続情報を以下のように入力します。

- Zookeepers: localhost:2181

**Test Connection** のボタンをクリックし、`Successful` と表示されれば、GGSA と Kafka の接続は成功しているので、**Save** を押して、設定を保存します。

![image16](image16.png)

### 2-3. Stream の作成

**Catalog** > **Create New Item** > **Stream** > **Kafka** とクリックし、Stream を新規に作成します。

![image17](image17.png)

以下のように入力して、**Next >** をクリックします。

- Name: Tutorial
- Tags(オプション): tutorial, transport
- Stream Type: Kafka

![image18](image18.png)

Stream を構築するために必要な情報を入力し、**Next >** をクリックします。

- Connection: Tutorial
- Topic name: tutorial
- Data Format: JSON

![image19](image19.png)

**Allow missing column names** にチェックを入れて、**Next >** をクリックします。

![image20](image20.png)

Infer が `Successful` であることを確認後、**Save** を押し、Stream の構成情報を保存します。

![image21](image21.png)

### 2-4. Geo Fence の作成

車両情報を特定のエリア(今回は、Atlanta)に限定するために、その境界を定義します。 **Catalog** > **Create New Item** > **Geo Fence** とクリックし、Geo Fence を新規に作成します。

![image22](image22.png)

以下のように入力し、**Save**をクリックします。

- Name: Tutorial
- Tags(オプション): tutorial, transport
- Geo Fence Type: Manually Created Geo Fence

![image23](image23.png)

**Save** をクリックすると、世界地図が表示されるので、Atlanta の周囲を Polygon Tool を用いて、以下のように囲います。また、入力項目は以下のように入力します。

- Name: Atlanta
- Description: Monitor public buses transport in Atlanta.

![image24](image24.png)

**< Return To Catalog** を押し、Geo Fence の作成は完了です。

### 2-5. Pipeline の作成

次に、車両データをリアルタイムに分析するための Pipeline を作成します。 **Catalog** > **Create New Item** > **Pipeline** とクリックし、パイプラインを新規に作成します。

![image25](image25.png)

以下のように入力し、パイプラインを作成します。

- Name: Tutorial
- Description(オプション): Tutorial: Vehicle Monitoring Pipeline.
- Tags(オプション): tutorial, transport
- Stream: Tutorial

![image26](image26.png)

作成が完了すると、以下のようにパイプラインが作成され、Kafka に対して Publish されているストリームデータを参照することができます。

![image27](image27.png)

### 2-6. Atlanta の車両に限定する

送信され続けている車両の情報を Atlanta の車両に限定したいと思います。Tutorial ステージを右クリックし、**Add a Stage** > **Pattern** と選択します。

![image28](image28.png)

**Spatial** > **Geo Filter** と選択します。

![image29](image29.png)

以下のように入力し、ステージを作成します。

- Name: PatternGeoFenceInside
- Description(オプション): Spatial analytics in the city of Atlanta.

![image30](image30.png)

**Parameters** タブで以下のように入力します。

- Geo Fence: Tutorial
- Event Stream: Tutorial
- Latitude: BUSlat
- Longitude: BUSlong
- Object Key: BUStripId
- Coodinate System: 8307

![image31](image31.png)

適切に設定できていると、入力データに対して、[2-4. Geo Fence の作成](#2-4-geo-fence-の作成)で作成した地理的な境界(Geo Fence)が結合されます。 また、**Visualizations** タブから先ほど作成した Geo Fence 内に車両がマップに表示されるようになります。

![image32](image32.png)

### 2-7. 止まっている車両をストリームデータから除外する

Atlanta の車両情報のストリームデータから止まっている車両データを除外したいと思います。PatternGeoFenceInside ステージを右クリックし、**Add a Stage** > **Query** を選択します。

![image33](image33.png)

以下のように入力し、Query Stage を作成します。

- Name: BusSpeed0Plus
- Description(オプション): Analytics only on moving vehicles.

![image34](image34.png)

まずは、止まっている車両をストリームデータから除外するためのフィルター処理を追加します。**Filters** タブを押し、以下のように入力します。

- Macth All にチェック
- フィルターの条件として、`Bus_Speed greater than 0` を入力

![image35](image35.png)

また、止まっているかどうかの判断は、瞬間的な速さではなく、ある一定時間の平均の速さ(今回は、10 秒間の平均の速さ)を元に判断するため、**Sources** タブで時計マークをクリックし、以下のように入力します。

- Windows Type: Time, with Slide
- Range: 10 seconds
- Evaluation frequency: 10 seconds

![image36](image36.png)

次に、**Summaries** タブで集約処理を加えます。

- **Retain All Columns** のボタンをクリック
- **Add a GroupBy** > **Add a Filed** を押し、**BUStripId** を選択します。

![image37](image37.png)

**Add a Summary** を押し、以下のように入力します。

- function: AVG
- filed: Bus_Speed

![image38](image38.png)

次に、Expression editor を押し、`NO_VIOLATION` と入力します。これは、後続の Violation 判定のデフォルト値となります。

![image39](image39.png)

![image40](image40.png)

最後に、Live Output 内のラベル名を以下のように変更します。(ラベル名でダブルクリックすると、名称の変更が可能です)

- BusType_ID → BusID
- AVG_of_Bus_Speed → AvgSpeed
- calc → Violation
- Bus_DriverNo → DriverNumber
- Bus_Hwy → Highway

![image41](image41.png)

### 2-8. リアルタイム分析のためのルールを作成する

ここまでで分析に必要なデータの加工や作成は完了していため、実際の分析ルールを作成していきます。具体的には、平均の速さを元に以下のようなルールを作成します。

1. 全ての Highway に対して名前を設定する(空白の Highway に対しては、`UNKNOWN` という名前を設定する)

2. 60 < AvgSpeed の場合、Violation を `RECKLESS` に設定する

3. 45 < AvgSpeed ≤ 60 の場合、Violation を `MAJOR` に設定する

4. 35 < AvgSpeed ≤ 45 の場合、Violation を `MINOR` に設定する

それでは、作成していきます。まずは、**BusSpeed0Plus** ステージで右クリックをし、**Add a Stage** > **Rule** を選択します。

![image42](image42.png)

以下のように入力し、ステージを作成します。

- Name: SpeedViolation

![image43](image43.png)

#### 2-8-1. 全ての Highway に対して名前を設定する

ここからは、実際の分析ルールを定義していきます。まずは、**Rules** タブの **Add a Rule** をクリックし、以下のようにルールを作成します。

- Rule Name: DFLT_HWY
- Description(オプション): Ensure all highways have a name value.

![image44](image44.png)

**Done** を押し、ルールを作成します。そして、すべての Highway に対して名前を持たせる(空白を許容しない)ために、以下のような条件を設定します。

- IF
  - Match All にチェック
  - `Highway equals (case sensitive) <blank>`
- THEN: `SET Highway TO UNKNOWN`

![image45](image45.png)

#### 2-8-2. 60 < AvgSpeed の場合、Violation を RECKLESS に設定する

次に、10 秒間の平均の速さが 60[km/h]を超えている車両に対して、Violation に `RECKLESS` という値を設定したいと思います。

**Add a Rule** をクリックし、以下のようにルールを作成します。

- Rule Name: RECKLESS
- Description(オプション): Bus drivers traveling at excessive speed.

![image46](image46.png)

**Done** を押し、ルールを作成します。そして、平均の速さが 60[km/h]を超えている車両を検出するために以下のような条件を設定します。

- IF:
  - Match All にチェック
  - `AvgSpeed greater than 60`
- THEN: `SET Violation TO RECKLESS`

![image47](image47.png)

#### 2-8-3. 45 < AvgSpeed ≤ 60 の場合、Violation を MAJOR に設定する

次に、10 秒間の平均の速さが 45[km/h]より速く、60[km/h]以下の車両に対して、Violation に `MAJOR`という値を設定したいと思います。

**Add a Rule** をクリックし、以下のようにルールを作成します。

- Rule Name: MAJOR
- Description(オプション): Bus drivers traveling at high speeds.

![image48](image48.png)

**Done** を押し、ルールを作成します。そして、平均の速さが 45[km/h]より速く、60[km/h]以下の車両を検出するために以下のような条件を設定します。

- IF
  - Match All にチェック
  - `AvgSpeed greater than 45 AND AvgSpeed lower than or equals 60`
- THEN: `SET Violation TO MAJOR`

![image49](image49.png)

#### 2-8-4. 35 < AvgSpeed ≤ 45 の場合、Violation を MINOR に設定する

次に、10 秒間の平均の速さが 35[km/h]より速く、45[km/h]以下の車両に対して、Vioation に `MINOR`という値を設定したいと思います。

**Add a Rule**をクリックし、以下のようにルールを作成します。

- Rule Name: MINOR
- Description(オプション): Bus drivers traveling at low speeds.

![image50](image50.png)

**Done** を押し、ルールを作成します。そして、平均の速さが 35[km/h]より速く、45[km/h]以下の車両を検出するために以下のような条件を設定します。

- IF
  - Match All にチェック
  - `AvgSpeed greater than 35 AND AvgSpeed lower than or equals 45`
- THEN: `SET Violation TO MINOR`

![image51](image51.png)

1~4 のルールの設定が完了すると、以下のような Live Output(一例)が得られます。

![image52](image52.png)

### 2-9. 得られた分析結果を表示する

先ほどまでで、いくつかのビジネスルールを設定しストリームデータの分析を実施したため、次はそのデータを表示してみたいと思います。具体的には、以下のようなデータを表示したいと思います。

1. 分類(RECKLESS/MAJOR/MINOR/NO_VIOLATION)した車両データを Atlanta の地図上に表示する
2. Highway 毎の平均の速さを表示する

#### 2-9-1. 分類(RECKLESS/MAJOR/MINOR)した車両データを Atlanta の地図上に表示する

それでは、作成していきます。Speed Violation ステージの **Visualizations** タブから **Add a Visualization** を押し、ドロップダウンの中から**Geo Spatial** を選択します。

![image53](image53.png)

**Properties** タブで、以下のように入力します。

- Name: Driver Monitor
- Description(オプション): Spatial Analytics for Vehicles in the Atlanta District.
- Tags(オプション): transport, tutorial
- Lat: BUSlat
- Long: BUSlong
- Key: BUStripId

![image54](image54.png)

次に、**Customizations** タブで以下のように入力します。

| Field     | Operator | Value    | Style        |
| --------- | -------- | -------- | ------------ |
| Violation | equals   | RECKLESS | Orange arrow |
| Violation | equals   | MAJOR    | Purple arrow |
| Violation | equals   | MINOR    | Blue arrow   |

![image55](image55.png)

**Create** を押すと、以下のように分類された車両情報が Atlanta 上に表示されていることが確認することができます。

![image56](image56.png)

#### 2-9-2. Highway 毎の平均の速さを表示する

次に、Highway 毎の車両の平均の速さを棒グラフで表示したいと思います。Speed Violation ステージの **Visualizations** タブから"+"アイコン(Add a Visualization)を押し、ドロップダウンの中から **Bar** を選択します。

![image57](image57.png)

![image58](image58.png)

以下のように入力します。

- Name: CongestionPoints
- Description(オプション): Provide a HWY view of activity.
- Tags(オプション): transport, tutorial
- Y Axis Field Selection: AvgSpeed
- Axis Label(オプション): SpeedKMH
- X Axis Field Selection: Highway
- Axis Label(オプション): HWY

![image59](image59.png)

正しく設定できていれば、Highway 毎の車両の平均の速さが以下のように棒グラフで表示されます。

![image60](image60.png)

### 2-10. Target の作成

ストリーム処理の結果を外部に出力するための Target を定義します。SpeedViolation ステージで右クリックし、**Add a Stage** > **Target** と選択します。

![image61](image61.png)

以下のように入力します。

- Name: TutorialTarget

![image62](image62.png)

**Save** を押し、TutorialTarget ステージを作成します。次に **Create** を押します。

![image63](image63.png)

以下のように入力して、Target を定義します。

- Name: TutorialTarget
- Tags(オプション): tutorial, transport
- Type: Kafka
- Connection: Tutorial
- Topic name: TutorialTarget
- Data Format: JSON
- Create nested json object にチェック

Shape は **Manual Shape** で以下のように設定します。

| Field Name   | Field Path   | Field Type |
| ------------ | ------------ | ---------- |
| Violation    | Violation    | Text       |
| AvgSpeed     | AvgSpeed     | Float      |
| DriverNumber | DriverNumber | Integer    |
| Highway      | Highway      | Text       |

![image64](image64.png)

![image65](image65.png)

![image66](image66.png)

![image67](image67.png)

Live Output が以下のように表示されれば、完了です。

![image68](image68.png)

### 2-11. Pipeline の Publish

リアルタイム分析をかけたデータを GGSA の外部(OCI BigData Service 等)で活用するために作成した Tutorial パイプライン を Publish します。**Publish** を押します。

![image69](image69.png)

以下のように入力します。

- Batch Duration: 1000 (Milliseconds)
- Executor Count: 2
- Cores per Executor: 2
- Executor Memory: 3000 (Megabytes)
- Cores per Driver: 1
- Driver Memory: 1800 (Megabytes)
- Log level: Info
- Pipeline Topic Retention: 3600000 (Milliseconds)
- Enable Pipeline Topics にチェック
- Input Topics Offset: latest

**Publish** を押します。

![image70](image70.png)

**< Done** を押し、Catalog 画面で作成した Tutorial パイプラインの Status が `Running` となっていれば完了です。

![image71](image71.png)

### 2-12. (参考) Publish されたメッセージを確認する

GGSA をプロビジョニングしたインスタンスでトピックの一覧を確認すると、OSA UI 上で作成した Topic(TutorialTarget)が含まれていることが確認できます。

```bash
$KAFKA_HOME/bin/kafka-topics.sh --list --zookeeper localhost:2181
```

コマンド実行結果

```bash
TutorialTarget
__consumer_offsets
sx_Tutorial_BusSpeed0Plus_draft
sx_Tutorial_BusSpeed0Plus_public
sx_Tutorial_PatternGeoFenceInside_draft
sx_Tutorial_PatternGeoFenceInside_public
sx_Tutorial_SpeedViolation_draft
sx_Tutorial_SpeedViolation_public
sx_Tutorial_TutorialTarget_draft
sx_Tutorial_TutorialTarget_public
sx_Tutorial_Tutorial_draft
sx_Tutorial_Tutorial_public
sx_Tutorial_public_1_Tutorial_offset
sx_backend_notification_zIHBNqNV
sx_messages_zIHBNqNV
tutorial
```

パイプライン処理が完了した後のデータを取得する場合は、この Topic(TutorialTarget)からメッセージを取得すればよいことになります。本ハンズオンでは、簡易的に Kafka に付属しているコンソール用の Consumer を用いて確認します。

```bash
$KAFKA_HOME/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic TutorialTarget
```

コマンド実行結果

```bash
{"Violation":"NO_VIOLATION","AvgSpeed":30.0,"DriverNumber":14734483,"Highway":"HWY66"}
{"Violation":"NO_VIOLATION","AvgSpeed":21.0,"DriverNumber":1.1E+2,"Highway":"HWY66"}
{"Violation":"MAJOR","AvgSpeed":59.0,"DriverNumber":2760439,"Highway":"MR665"}
{"Violation":"RECKLESS","AvgSpeed":96.0,"DriverNumber":13241,"Highway":"M2   "}
{"Violation":"MINOR","AvgSpeed":37.0,"DriverNumber":13217,"Highway":"HWY66"}
{"Violation":"MAJOR","AvgSpeed":53.0,"DriverNumber":0,"Highway":"MR335"}
{"Violation":"MINOR","AvgSpeed":39.0,"DriverNumber":13599829,"Highway":"MR599"}
{"Violation":"NO_VIOLATION","AvgSpeed":12.0,"DriverNumber":710352,"Highway":"HWY66"}
{"Violation":"NO_VIOLATION","AvgSpeed":35.0,"DriverNumber":1859124,"Highway":"HWY66"}
{"Violation":"MAJOR","AvgSpeed":53.0,"DriverNumber":12671,"Highway":"HWY66"}
{"Violation":"NO_VIOLATION","AvgSpeed":35.0,"DriverNumber":1843334,"Highway":"HWY66"}
{"Violation":"NO_VIOLATION","AvgSpeed":5.0,"DriverNumber":5848648,"Highway":"HWY66"}
{"Violation":"NO_VIOLATION","AvgSpeed":3.0,"DriverNumber":5.83806E+6,"Highway":"HWY66"}
{"Violation":"NO_VIOLATION","AvgSpeed":25.0,"DriverNumber":4757146,"Highway":"HWY66"}
{"Violation":"NO_VIOLATION","AvgSpeed":31.0,"DriverNumber":1856674,"Highway":"HWY66"}
...
```

確かに、GGSA の UI 上で確認できるデータと同じものが取得できることが確認できます。また、GGSA では、Target として Kafka 以外にも

- Database
- Elasticsearch
- JMS
- MongoDB
- OCI Notification
- REST
- ...

と様々な Target が用意されています。

### 2-13. ハンズオンの終了処理

バックグラウンドで実行していた Java のプロセスを終了します。(PID は、[2-1. ハンズオン用のイベント・ストリームを Kafka に Publish する](#2-1-ハンズオン用のイベントストリームを-kafka-に-publish-する)を参照)

```bash
kill <PID>
```

実行例

```bash
kill 6654
```

これで、GGSA のチュートリアルは完了です。お疲れ様でした！

# 参考情報

- [GoldenGate Stream Analytics 19.1 Tutorials](https://docs.oracle.com/en/middleware/fusion-middleware/osa/19.1/tutorials.html)
