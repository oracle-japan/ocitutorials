---
title: "モニタリング機能でOCIのリソースを監視する"
excerpt: "モニタリング機能を使うことで、OCI上の各種リソースの性能や状態の監視、また、カスタムのメトリック監視を行うことが可能です。アラームを設定すれば、メトリックがしきい値に達した場合に管理者に通知することもできます。"
order: "010"
tags:
header:
  teaser: "/intermediates/monitoring-resources/image-20210112132107310.png"
  overlay_image: "/intermediates/monitoring-resources/image-20210112132107310.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
# link:  https://community.oracle.com/tech/welcome/discussion/4474301/%E3%83%A2%E3%83%8B%E3%82%BF%E3%83%AA%E3%83%B3%E3%82%B0%E6%A9%9F%E8%83%BD%E3%81%A7%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E3%82%92%E7%9B%A3%E8%A6%96%E3%81%99%E3%82%8B-oracle-cloud-infrastructure%E3%82%A2%E3%83%89%E3%83%90%E3%83%B3%E3%82%B9%E3%83%89
---
システムを運用する際にはアプリケーションやシステムの状態に異常がないかを監視して問題がある場合には対処をすることでシステムの性能や可用性を高めることが可能です。

OCIで提供されているモニタリング機能を使うことで、OCI上の各種リソースの性能や状態の監視、また、カスタムのメトリック監視を行うことが可能です。また、アラームで事前定義した条件に合致した際には管理者に通知を行うことで管理者はタイムリーに適切な対処を行うことができます。

コンピュートやブロックボリュームなどのOCIリソースに対してはモニタリングはデフォルトで有効になっています。

この章では、コンピュート・インスタンスを対象にして性能メトリックの参照の方法を理解し、問題が発生した場合のアラーム通知設定を行って管理者へのメール通知を行います。

**所要時間 :** 約30分

**前提条件 :** 

1. [インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/) を通じてコンピュート・インスタンスの作成が完了していること

**注意 :** チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります。

# 1. ベースになるインスタンスの作成

まずは、監視対象となるインスタンスを作成します。今回は、[インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/) で作成したコンピュート・インスタンスを使用します。

ただし、Oracle提供イメージを使い、モニタリングの有効化を行っているインスタンスのみが対象です（デフォルトは有効）。

インスタンス作成時には、作成画面下部の **拡張オプションの表示** をクリックしてオプションを表示させ、**Oracle Cloudエージェント**→**コンピュート・インスタンスのモニタリング** のチェックボックスにチェックが入っていることを確認してください。
<!--![image-20210112131532597](image-20210112131532597.png)-->
![image-20220902_instance_monitoring_enabled](image-20220902_instance_monitoring_enabled.png)

# 2. モニタリング・メトリックの参照（各リソースの詳細画面からの参照）

作成済みのコンピュート・インスタンスの詳細ページから、メトリックを参照することができます。

1. コンソールメニューから **コンピュート** → **インスタンス** を選択し、作成したインスタンスのインスタンス名のリンクをクリックするか、右側の![image-vertical_triple_dots](image-vertical_triple_dots.png)メニューから **インスタンスの詳細の表示** を選択し、インスタンス詳細画面を開きます。
2. 画面左下の **リソース** から **メトリック** を選択すると、このインスタンスのCPU使用率やメモリ使用率、Disk IO、ネットワーク転送量などの性能メトリックを参照することが可能です。
   ![image-20210112131845637](image-20210112131845637.png)



# 3. モニタリング・メトリックの参照（サービス・メトリック画面での参照）

個別のリソースではなく複数のリソースにまたがってメトリックを一覧で参照したい場合は、サービス・メトリックのページからまとめて参照することができます。

1. コンソールメニューから **監視および管理** → 「モニタリング配下」の**サービス・メトリック** を選択します。

   <!--![image-20210112132011097](image-20210112132011097.png)-->
   ![image-20220902_menu_for_service_metrics](image-20220902_menu_for_service_metrics.png)

1. サービス・メトリック画面の上部で、表示させたい対象の **コンパートメント** と **メトリック・ネームスペース** を選択します。

   - **コンパートメント**：＜あらかじめ作成したインスタンスの存在するコンパートメント＞

   - **メトリック・ネームスペース**：oci-computeagent

     ![image-20210112132037434](image-20210112132037434.png)

1. CPU使用率、メモリ使用率、ディスクI/Oなどのコンピュートインスタンスに定義されているメトリックのグラフを全て表示することができます。
   ![image-20210112132107310](image-20210112132107310.png)

1. 開始時間、終了時間を変更することで表示する範囲を変更できます。
   <!--![image-20210112132140765](image-20210112132140765.png)-->
   ![image-20220902_changing_time_range](image-20220902_changing_time_range.png)
   
   

# 4. アラームの通知先の作成

アラーム定義を作成し、メトリックの値がなんらかのしきい値に達したらアラームを発行して通知などを行うことが可能です。

ここでは、インスタンスの死活監視目的で、インスタンスのメトリックが存在しない場合にアラームで検知してメール通知を行う設定を実行します。

1. コンソールメニューから **開発者サービス** →「アプリケーション統合」配下の **通知** を選択し、通知画面を表示します。
   <!--![image-20210112132343278](image-20210112132343278.png)-->
   ![image-20220902_menu_for_notification](image-20220902_menu_for_notification.png)
2. **トピックの作成** をクリックします。
   ![image-20210112132359984](image-20210112132359984.png)
3. **トピックの作成** ウィンドウで必要事項を入力し、左下の **作成** ボタンをクリックします。
   - **名前** - 任意
   - **説明**（オプション）
     ![image-20210112132415447](image-20210112132415447.png)
4. 作成したトピックの名前のリンクをクリックし、**トピックの詳細** 画面を表示します。**サブスクリプションの作成** ボタンをクリックします。
   ![image-20210112132442310](image-20210112132442310.png)
5. **サブスクリプションの作成** 画面で以下の項目を入力し、左下の **作成** ボタンをクリックします。
   - **プロトコル** - 電子メール を選択(デフォルト)
   - **電子メール** - 通知先となるメールアドレスを入力
     ![image-20210112132455070](image-20210112132455070.png)
6. サブスクリプションを作成すると、**PENDING** ステータスとなっています。
   ![image-20210112132510617](image-20210112132510617.png)
7. 設定したメールアドレスにOracle Cloudから確認メールが送信されます。メール内のリンクのURLをクリックします。
   ![image-20210112132535376](image-20210112132535376.png)
8. **Subscription confirmed** のページが表示されます。
   <!--![image-20210112132554595](image-20210112132554595.png)-->
   ![image-20220902_subscription_confirmed_masked](image-20220902_subscription_confirmed_masked.png)
9. 再度コンソール画面に戻ると、通知先の確認が完了したため **Active** のステータスに変わっています。これでメール通知の設定は完了です。



# 5. アラーム定義の作成

次に、アラームの定義を作成します。

1. コンソールメニューから **監視および管理** → 「モニタリング」配下の**アラーム定義** を選択し、アラーム画面を表示します。**アラームの作成** ボタンをクリックします。
   <!--![pastedImage_9.png](70752854egami.png)-->
   ![image-20220902_alerm_define_masked](image-20220902_alerm_define_masked.png)

2. **アラームの作成** ウィンドウで以下の項目を入力し、左下の **作成** ボタンをクリックします。
   - **アラーム名** - 任意の名前。ここではtest_alarmとしています。
   
   - **アラームの重大度** - ここではデフォルトのクリティカルのままにしています。
   
   - **アラーム本体** （オプション）- 任意
   
   - **タグ**（オプション） - 任意
   
   - メトリックの説明
     - **コンパートメント** - メトリックのあるコンパートメントを選択
     - **メトリック・ネームスペース** - oci_computeagent を選択
     - **リソース・グループ** - 空白のまま
     - **メトリック名** - CpuUtilization を選択
     - **間隔** - 1m （デフォルト）
     - **統計** - Mean（デフォルト）
     
   - メトリック・ディメンション
     - **ディメンション名** - resourceDisplayName を選択
     - **ディメンション値** - 監視対象とするインスタンスの表示名を選択
     
   - トリガー・ルール
     - **演算子** - 次より大きい を選択
     - 値 - 40
     - **トリガー遅延分数** - **5**
     
   - 通知
     - **宛先サービス** - 通知サービス を選択
     
     - **コンパートメント** - さきほど作成した通知トピックのあるコンパートメントを選択
     
     - **トピック** - 先ほど作成したトピック名を選択
     
     - **メッセージの書式** - RAWメッセージの送信
     
       >***Note***
       >
       >メッセージの書式で「フォーマットされたメッセージの送信」を選択することで、JSONの生データをより見やすいフォーマットで通知を送信することが可能です。各フォーマットのイメージについては [ociドキュメント：メッセージの書式および例](https://docs.oracle.com/ja-jp/iaas/Content/Monitoring/Concepts/monitoringoverview.htm#MessageFormat)を参照してください。
     
   - **このアラームを有効化しますか。** - チェックが入っていることを確認 （デフォルト）
     <!--![image-20210112134524003](image-20210112134524003_2.png)-->
     ![image-20220902_alerm_edit_config](image-20220902_alerm_edit_config.png)

3. アラームが作成されました。このアラームが有効になっていることを確認してください。
   ![image-20220902_alerm_summary](image-20220902_alerm_summary.png)

# 6. メール通知されることを確認

アラームと通知の設定ができたので、これでコンピュートインスタンスのCPUメトリックが取得できない状況になればメールで通知されるはずです。

ここでは、stressコマンドでCPU使用率を上げて通知されるかどうかを確認します。

1. インスタンスのパブリックIPアドレスを確認し、このアドレスを使用してteratermなどのターミナルからsshでログインします。

   - ユーザー名 - **opc**
   - RSA鍵 - インスタンス作成時に登録した公開鍵に対応する秘密鍵を指定（[インスタンスを作成する - Oracle Cloud Infrastructureを使ってみよう(その3)](https://oracle-japan.github.io/ocitutorials/beginners/creating-compute-instance/) で使用した秘密鍵と同じもの）

2. インスタンスのCPU負荷をあげるために、Linuxのstressコマンドで負荷をかけます。

   - stressパッケージをインストールする準備をします。stressパッケージを含むEPELリポジトリが有効になっているかを以下のコマンドで確認します。

     ```
     sudo yum repolist all | grep -i epel
     ```

   - Oracle Linux 7.9イメージで作成されたインスタンスであれば、図のように「ol7_developer_EPEL」リポジトリが表示されます。ステータスが非有効（「disabled」）になっている場合、yum-config-managerコマンドで有効（「enabled」）に変更します。

     ![image-20220902_EPEL_disabled](image-20220902_EPEL_disabled.png)

     ```
     sudo yum-config-manager --enable ol7_developer_EPEL
     ```
   

   - stressをインストールします。

     ```
     sudo yum -y install stress
     ```

   - stressコマンドでCPUに負荷をかけます。VM.Standard2.1のシェイプであれば、下記コマンドでCPU負荷が100%になります。

     ```
     stress -c 2 &
     ```

   - topコマンドでCPU負荷が約100%になっていることを確認します。Ctrl + C で終了します。

     ```
     top -c
     ```

     ![image-20210112135119649](image-20210112135119649.png)

3. コンソール上からもCPU使用率の状況を確認します。コンソールメニューから **コンピュート** → **インスタンス** を選択し、モニタリング対象のインスタンスの詳細画面を表示します。メトリックのCPU使用率のチャートを確認し、CPU使用率があがったことを確認します。

   ![image-20210112135311237](image-20210112135311237.png)

4. 数分待ちます。

5. メールを受信したことを確認します。
   ![image-20210112135937431_masked](image-20210112135937431_masked.png)

   >***Note***
   >
   >メッセージの書式で「フォーマットされたメッセージの送信」を選択した場合は、以下のようなメッセージが送信されます。
   >
   >![image-20210112134524003](image-20210112134524003_3.png)
   
6. メニューから、 **監視および管理** → 「モニタリング」配下の**アラームのステータス** をクリックして、**アラームのステータス**の一覧画面を表示します。起動されているアラームの名前のリンクをクリックしてアラームの詳細画面を表示します。
   <!--![image-20210112140151650](image-20210112140151650.png)-->
   ![image-20220902_alerm_status](image-20220902_alerm_status.png)
7. アラームが起動された履歴を確認することができます。
   <!--![image-20210112140055632](image-20210112140055632.png)-->
   ![image-20220902_alerm_history](image-20220902_alerm_history.png)


アラームと通知の設定が正しくできていることがわかりました。

そのほか、様々なモニタリング・メトリックが事前定義されています。たとえばコンピュート・インスタンスが正しく起動しているかを監視したい場合は、oci_compute_infrastructure_healthメトリック・ネームスペースのインスタンス・ステータスのメトリックを監視します。

用途に応じて適切に監視とアラームの設定をしていきましょう。



以上がモニタリング機能によるリソース監視とアラーム通知による動作です。



目次に戻る : [チュートリアル : Oracle Cloud Infrastructure を使ってみよう](https://oracle-japan.github.io/ocitutorials/)

