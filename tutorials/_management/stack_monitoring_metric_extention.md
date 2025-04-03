---
title: "Stack Monitoringでメトリック拡張を設定する"
excerpt: "Stack Monitoring ではユーザ独自のメトリックを監視できるメトリック拡張の機能が使用できます。メトリック拡張の機能を利用することで、OSコマンドやSQLで取得できるメトリックを Stack Monitoring で監視できます。"
order: "110"
layout: single
tags:
 - management

---


**チュートリアル概要 :**  
このチュートリアルでは、Stack Monitoring のメトリック拡張を設定する手順をご紹介します。

**所要時間 :** 約30分

**前提条件1 :** テナンシ上で以下のリソースが作成済であること
+ コンパートメント
+ ユーザー
+ ユーザーグループ
+ VCN
+ 対象リソース

**前提条件2 :** Stack Monitoring が有効化済みであること<br>
[こちら](https://oracle-japan.github.io/ocitutorials/management/stack_monitoring_onboarding/)を参考にStack Monitoringを有効化できます。

**前提条件3 :** Stack Monitoringで対象リソースが監視されていること <br>
 - [こちら](https://oracle-japan.github.io/ocitutorials/management/stack_monitoring_basedb/)を参考にStack Monitoring でBaseDB を監視できます。
 - [こちら](https://oracle-japan.github.io/ocitutorials/management/stack_monitoring_install/)を参考にStack Monitoring でCompute を監視できます。

# 1.メトリック拡張の作成
本チュートリアルでは例としてデータベースに登録されているユーザー数を取得するメトリックを追加します。
<br>
「メトリック拡張の作成」をクリックします。
![画面ショット](image01.png)

メトリック拡張のプロパティの項目は以下のように設定します。
 - 名前：ME_任意の名前
 - 表示名：任意の表示名

![画面ショット](image02.png)

収集方法のプロパティは以下のように設定します。
 - リソース・タイプ：コンテナDB
 - 収集方法：SQL
 - 収集頻度：任意の時間
 - SQL問合せ：SELECT COUNT(*) from ALL_USERS;
  
**リソースタイプと収集方法について**  
ホストの場合はリソース・タイプをホスト、OSコマンドの場合は収集方法をOSコマンドなどに設定します。
{: .notice--info}

![画面ショット](image03.png)

メトリック/ディメンションの項目は以下のように設定します。
 - 名前：任意の名前
 - 表示名：任意の表示名
 - ディメンションですか。：なし
 - 非表示ですか。：なし

![画面ショット](image04.png)

メトリック拡張のプロパティ、収集方法のプロパティ、メトリック/ディメンションの項目を設定したら、「作成とテスト」をクリックします。
![画面ショット](image05.png)

リソースの選択に適当なデータベースを選択して「テスト」をクリックします。
![画面ショット](image06.png)

テストが成功したら公開をクリックします。

**公開について**  
公開後は各項目について、編集ができなくなります。
{: .notice--info}

![画面ショット](image07.png)


# 2.メトリック拡張の有効化
公開が完了したら、有効化します。
作成したメトリックの3点リーダーから「有効化」をクリックします。
![画面ショット](image08.png)

「リソースの選択」をクリックします。
![画面ショット](image09.png)

該当のリソースを選択し、「選択したリソースで有効化」をクリックします。
![画面ショット](image10.png)

# 3.作成されたメトリックの確認
有効化が完了すると該当リソースのチャート欄に作成したメトリックが追加されます。
メトリック拡張で追加したメトリックはメトリック名の横に＊が表示されます。
![画面ショット](image11.png)

# 4.アラームの作成
メトリック拡張で追加したメトリックはoracle_metric_extensions_appmgmtを使用することでアラームを設定することができます。
詳細のアラーム作成手順については[こちら](https://oracle-japan.github.io/ocitutorials/intermediates/monitoring-resources/#4-%E3%82%A2%E3%83%A9%E3%83%BC%E3%83%A0%E3%81%AE%E9%80%9A%E7%9F%A5%E5%85%88%E3%81%AE%E4%BD%9C%E6%88%90)をご確認ください。