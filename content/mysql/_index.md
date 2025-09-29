---
title: "MySQL HeatWave チュートリアル"
description: "MySQL HeatWaveに関するチュートリアルです。"
permalink: /mysql/
layout: single
tags:
- データベース
toc: true
---

このページでは、MySQL HeatWaveチュートリアルをまとめています。

MySQL HeatWaveは商用版のMySQLであるMySQL Enterprise Editionをベースとしたデータベースのマネージドサービスです。Oracle Labsの研究成果をもとにした分析処理の高速化エンジンであるHeatWaveクラスタは、分散型のインメモリストアで、データを列方向で保持するカラムナーデータストアとなっています。

HeatWaveクラスタには機械学習エンジンやLLMが統合されており、1つのMySQLでトランザクション処理(OLTP)、分析(OLAP)、機械学習(ML)、生成AI/ベクタ検索を同時に実行できるクラウドサービスとなっています。Oracle Cloud Infrastructure(OCI)を中心に提供され、マルチクラウド展開にも対応します。

# 1.クラウド版MySQLとしてのMySQL HeatWaveの利用

## 初級編　

+ **[クラウドでMySQLデータベースを使う](./creating-mds/)**  
    MySQL HeatWaveをプロビジョニングします。まずはここから始めましょう。無料かつ期間無制限でご利用いただけるOCIのAlways Freeの対象です 【所要時間:約30分】

+ **[クラウドでMySQLデータベースを高可用性構成で使う](./creating-mds-ha/)**  
    MySQL HeatWaveでは、高可用性構成も簡単に構築できます。実際に構築して、スイッチオーバーを発生させ、プライマリサーバーの切り替えを試してみましょう【所要時間:約30分】

+ **[MySQL HeatWaveでリードレプリカを構成する](./creating-mds-readreplica/)**  
    MySQL HeatWaveでは参照処理の負荷分散を実現できるリードレプリカも簡単に構成できます。リードレプリカを構成し、動きを確認してみましょう！【所要時間:約50分】

+ **[MySQL HeatWaveでレプリケーションを使用する](./creating-mds-channel/)**  
    MySQL HeatWaveではMySQLのレプリケーション機能も使用できます。レプリケーション(チャネル)フィルターを活用することでAmazon RDSなど他社製のMySQLマネージドサービスからレプリケーションすることもできます。レプリケーションの構成方法を確認してみましょう！【所要時間:約50分】

# 2.HeatWaveクラスタを使った分析処理の高速化

## 初級編 - HeatWaveクラスタ編 - 

+ **[MySQLで高速分析を体験する](./creating-HeatWave/)**  
     MySQL HeatWaveの分析エンジンHeatWaveクラスタを利用して高速分析を体験していただきます。【所要時間:約40分】
     ※ 本チュートリアルは現在の製品仕様と異なる部分があります。近日中に更新版を公開予定です。