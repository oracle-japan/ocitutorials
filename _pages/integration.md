---
title: "Oracle Integration チュートリアル"
excerpt: "OCIにおけるApplication IntegraionサービスであるOIC(Oracle Integraion Cloud)について学習できるチュートリアルです。"
permalink: /integration/
layout: single
tags: "integration"
show_excerpts: true
toc: true
---

# Oracle Integration Cloud チュートリアル

この文書は、Oracle Integration (OIC) を使ってみよう！という人のためのチュートリアルです。各文書ごとにステップ・バイ・ステップで作業を進めて、OIC が提供する機能について学習することができます。

## 事前準備編

**[OIC インスタンスを作成する](./integration-for-commons-1-instance)**  
まず初めにすることは、OIC インスタンスの作成です。OCI コンソールを利用して、OIC インスタンスを作成する手順について説明します。

**[OIC インスタンスにユーザーを追加する](./integration-for-commons-2-addusr)**  
OIC を利用するユーザーを追加する手順について説明します。ここでは、Oracle Identity Cloud Service (IDCS) の管理コンソールから、ユーザーを追加する手順とその準備について説明いたします。

**[OIC インスタンスを作成する・ユーザーを追加する－アイデンティティ・ドメイン編](./integration-for-commons-1-instance-id)**  
アイデンティティ・ドメインを利用して、OIC インスタンスを作成、ユーザーを追加する手順について説明します。

## Application Integration チュートリアル

### 初級編

**[ファイル・サーバーの有効化](./app-integration-for-beginners-1-filesv)**  
このチュートリアルは、Oracle Integration が提供する SFTP に対応したファイル・サーバーを有効化する手順について説明します。

**[ファイル・サーバーの有効化(OIC3)](./app-integration3-for-beginners-1-filesv)**  
このチュートリアルは、Oracle Integration が提供する SFTP に対応したファイル・サーバーを有効化する手順について説明します。

**[CSV ファイルから JSON ファイルへの変換](./app-integration-for-beginners-2-csvjson)**  
このチュートリアルは、Oracle Integration の FTP アダプタを使用して、ファイル・サーバーにアップロードされた CSV ファイルを読み取り、JSON ファイルに変換して、再びファイル・サーバーにアップロードする手順を説明します。

**[CSV ファイルから JSON ファイルへの変換(OIC3)](./app-integration3-for-beginners-2-csvjson)**  
このチュートリアルは、Oracle Integration の FTP アダプタを使用して、ファイル・サーバーにアップロードされた CSV ファイルを読み取り、JSON ファイルに変換して、再びファイル・サーバーにアップロードする手順を説明します。

**[SFDCからアウトバンドメッセージを受信する](./app-integration-for-beginners-3-sfdc)**  
このチュートリアルは、Salesforce.com 側で新規商談(Opportunity)が登録されたら、SFDCのアウトバウンドメッセージが送信され、Oracle Integration の統合が起動される一連の動作を確認します。

**[REST-API のデータを Oracle ADW に保存する(OIC3)](./app-integration3-for-beginners-3-rest2adw)**  
このチュートリアルは、 Oracle Integration Cloud を使用して REST API で取得したデータを、Oracle ADW のテーブルに保存する手順を説明します。

## Process Automation チュートリアル

### 初級編

## Process Automation チュートリアル

### 初級編(OCI Process Automation)

**[Oracle Cloud Infrastructure Process Automation で簡単なワークフローを作成してみよう(作成編)](./opa-for-beginners-1-designer)**   
OCI Process Automation を理解するなら、ここから始めましょう。1段階承認のシンプルなワークフロー(休暇取得承認ワークフロー)をゼロから開発し、一連の開発サイクルを体験できます。

**[Oracle Cloud Infrastructure Process Automation で簡単なワークフローを作成してみよう(実行編)](./opa-for-beginners-1-workspace)**   
OCI Process Automation を使って作成したワークフローで申請～承認の一連の手順を体験できます。

### 初級編(OIC Process)

**[Process で簡単なワークフローを作成してみよう](./process-for-beginners-1-wf)**   
OIC-Process を理解するなら、ここから始めましょう。1段階承認のシンプルなワークフロー（休暇取得承認ワークフロー）をゼロから開発し、検証・公開までの一連の開発サイクルを体験できます。

**[Oracle Integration - Process でデシジョン・モデルを作成してみよう](./process-for-beginners-2-dmodel)**   
デシジョン・モデルを利用すると、ビジネス・ルールと業務プロセス（ワークフロー）を分離して管理・更新できます。ここでは、簡単なデシジョン・モデルを作成・公開し、それをプロセス・アプリケーションから利用する方法について習得します。

## Visual Builder チュートリアル

### 初級編

**[Visual Builder で簡単なWebアプリケーションを作成してみよう](./vbcs-for-beginners-1)**   
Visual Builder を使って簡単なWebアプリケーションを作成します。このチュートリアルでは、部門と従業員のレコードを参照および作成、編集、削除するアプリケーションを作成します。

**[Visual Builder Studio でVBCSアプリケーションを管理してみよう](./vbcs-for-beginners-2-vbs)**   
Visual Builder Studioを使ってVBCSアプリケーション・プロジェクトを管理します。このチュートリアルでは、VBSからVBCSアプリケーションを作成し、チームによる開発手順を学習します。

<!--
**[Visual Builder でREST APIを使ったWebアプリケーションを作成してみよう](./vbcs-for-beginners-3-rest)**   
Visual Builder でREST APIを使ったWebアプリケーションを作成します。このチュートリアルでは、REST APIでデータを取得し、画面上に一覧表示するアプリケーションを作成します。
-->

**[Visual Builder でグラフを使ったWebアプリケーションを作成してみよう](./vbcs-for-beginners-4-linechart)**   
Visual Builder でグラフを使ったWebアプリケーションを作成します。このチュートリアルでは、ビジネス・オブジェクトのデータを取得し、画面上に折れ線グラフで表示するアプリケーションを作成します。

**[Visual Builder でマップを使ったWebアプリケーションを作成してみよう](./vbcs-for-beginners-5-gmap)**   
Visual Builder でマップを使ったWebアプリケーションを作成します。このチュートリアルでは、テキストボックスに入力された住所を画面のマップ上にピン付けするアプリケーションを作成します。

