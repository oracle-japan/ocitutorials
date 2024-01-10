---
title: "106: Data Guardを構成しよう"
excerpt: "Base Database Service (BaseDB) でData Guardを構成する手順について紹介します。"
order: "1_106"
header:
  teaser: "/basedb/dbcs106-dataguard/dataguard08.png"
  overlay_image: "/basedb/dbcs106-dataguard/dataguard08.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
  
#link: https://community.oracle.com/tech/welcome/discussion/4474283/
---

<a id="anchor0"></a>

# はじめに
Data Guardは、Oracle Database自身が持つレプリケーション機能です。
プライマリDBの更新情報（REDOログ）をスタンバイDBに転送し、そのREDOログを使ってリカバリし続けることでプライマリDBと同じ状態を維持します。<br>
リアルタイムに複製データベースを持つ事ができる為、データベース障害やリージョン障害などのRTO/RPOを短くすることができ、広範囲な計画停止(メンテナンス)においても切り替えることによって停止時間を極小化することが可能で、災害対策(DR)としてのデータ保護はもちろんのこと、移行やアップグレードの停止時間短縮といった利用用途もあります。<br>
また、参照専用として利用可能なActive Data Guardにしたり、一時的に読み書き可能なスナップショット・スタンバイとして利用したりと、普段から利用可能なスタンバイDBを持つことができます。

ここでは、OCI コンソールから Data Guard を構成するまでの手順についてご紹介します。

<br>

**前提条件 :**
+ [Oracle CloudでOracle Databaseを使おう](../dbcs101-create-db) を通じて Oracle Database の作成が完了していること

<br>

**注意** チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。

<br>

**目次**

- [1. OCI上でのData Guard構成パターン](#1-oci上でのdata-guard構成パターン)
- [2. Data Guardを構成する為の前提条件](#2-data-guardを構成する為の前提条件)
- [3. Data Guardの構成手順](#3-data-guardの構成手順)
- [4. Data Guardの切り替え](#4-data-guardの切り替え)
- [5. Data Guard構成に含まれるDBの削除方法](#5-data-guard構成に含まれるdbの削除方法)

<br>
**所要時間 :** 約60分
<br>

# 1. OCI上でのData Guard構成パターン
Oracle Cloud上でData Guardを利用する際の基本的な構成については、大きく分けて３つのパターンがあります。
 1. **同一リージョン内でのData Guard** : 主にデータベース障害やDBシステム障害やメンテナンスなどを考慮したローカル・スタンバイ
 1. **別リージョン間でのData Guard** : 主にリージョン障害やメンテナンス時の切り替え先としてローカル・スタンバイ環境をを持たない場合のリモート・スタンバイ
 1. **ハイブリッドData Guard** : オンプレミスとクラウド間で構成するハイブリッド型のオフサイト・スタンバイ

クラウドの画面上からは「同一リージョン内」と「別リージョン間でのData Guard」構成が簡単に構築・管理が可能です。<br>
ハイブリッドの場合は手動で構成が必要となりますので、手順を解説したホワイト・ペーパーをご参照ください。

BaseDB : Hybrid Data Guard to Oracle Cloud Infrastructure [英語](https://www.oracle.com/technetwork/database/availability/hybrid-dg-to-oci-5444327.pdf) / [日本語](https://www.oracle.com/technetwork/jp/database/availability/hybrid-dg-to-oci-5444327-ja.pdf)

# 2. Data Guardを構成する為の前提条件

Data Guardを構成するにあたり前提条件を確認してみましょう。

1. 必要なエディション<br>
    - Data GuardはEnterprise Edition以上、Active Data GuardはExtream Performanceが必要
<br>

1. Oracle Cloudのインフラ側の前提条件
   - 管理ユーザーのIAMサービス・ポリシーでの権限が付与済
   - プライマリDBシステムとスタンバイDBシステム間での通信設定(最低限TCPのポート1521を有効化。別リージョン間であればVCN間のピアリング設定が必要)
<br>

1. DBシステム側の前提条件<br>
   - 同一コンパートメント内
   - 同一DBバージョン・パッチ間 (※Oracle Data Guardの前提条件)
   - 同一エディション同士
   - 同一サービス間
   - 作成・管理できるスタンバイは１つのフィジカル・スタンバイ

2つ以上のスタンバイを持ちたい／BaseDBとExaDB-D間で構成したいなど、DBシステム側の前提条件のみ満たせない場合は、手動でData Guardを構成することも可能です。


<br>

# 3. Data Guardの構成手順

次にOCIコンソールからData Guardを構成するまでの手順を紹介します。


1. コンソールメニューから **Oracle Database → Oracle Base Database (VM, BM) →「DBシステム」→「DBシステムの詳細」→「データベース詳細」** 画面へ遷移し、 **「Data Guardアソシエーション」** を選択します

1. **Data Guardの有効化** ボタンをクリックします
    <div align="center">
    <img width="700" alt="dataguard01.png" src="dataguard01.png" style="border: 1px black solid;">
    </div>
    <br>

1. 表示される画面に下記を入力し、**Data Guardの有効化**ボタンをクリックします<br>
   - **表示名** - スタンバイDBシステムの表示名
   - **リージョン** - スタンバイDBシステムを作成するリージョン
   - **可用性ドメイン** - スタンバイDBシステムを作成する可用性ドメイン
   - **シェイプの選択** - スタンバイDBシステムのシェイプ
   - **ネットワーク情報の指定** - スタンバイDBシステムのネットワーク情報
   - **Data Guardアソシエーション詳細** - Data Guardのデータ保護モード(※)<br>
     ※システム要件に合わせて次の組み合わせから選択して下さい<br>
      - 最大パフォーマンス - 非同期<br>
      - 最大可用性 - 同期
   - **スタンバイ・データベースの構成** - プライマリDBのパスワードと同じものを入力
    <div align="center">
    <img width="700" alt="dataguard02.png" src="dataguard02.png" style="border: 1px black solid;">
    </div>
    <br>


1. 作成された構成を確認します<br>
今回は同一リージョン内(大阪リージョン)で作成しています。<br>
プライマリDBシステム側の **「Data Guardアソシエーション」** 画面にて、スタンバイDBが構成されていることが確認可能です
    <div align="center">
    <img width="700" alt="dataguard03.png" src="dataguard03.png" style="border: 1px black solid;">
    </div>
    <br>
    OCIコンソールの他にもOS上のコマンドツールとしてdbcliが用意されており、rootユーザーでData Guard関連の設定確認が可能です。
    <br>
    <div align="center">
    <img width="1000" alt="dataguard04.png" src="dataguard04.png" style="border: 1px black solid;">
    </div>
    <br>
    コマンドの詳細は [データベースCLIでのOracle Data Guardの使用](https://docs.oracle.com/ja-jp/iaas/Content/Database/Tasks/usingDG.htm) をご確認ください。

<br>

# 4. Data Guardの切り替え
コンソールやCLIから、簡単にData Guardの切り替え(スイッチオーバー、フェイルオーバー)が可能です。
また、フェイルオーバー実施後に旧プライマリ・データベースを簡単にスタンバイとして復旧する事が可能です。

1. スイッチオーバーの実行方法<br>
スイッチオーバーは主にデータベースのメンテナンスなど計画停止時にプライマリとスタンバイを切り替える際に使用します。<br>
スタンバイDBにREDOを転送・適用をしきった状態でスタンバイDBにプライマリ・ロールが引き継がれる為、Data Guard構成を保った状態を維持する事が可能です。<br>
スイッチオーバーは、プライマリDBシステムの **「Data Guardアソシエーション」** 画面から実行します。
    <div align="center">
    <img width="700" alt="dataguard05.png" src="dataguard05.png" style="border: 1px black solid;">
    </div>
    <br>

1. フェイルオーバーの実行方法<br>
フェイルオーバーはプライマリ側が利用できない状態など主に計画外停止時にスタンバイ側に切り替える際に使用します。<br>
Data Guardのデータ保護モードとして『非同期』を設定している場合、未転送分の更新情報が反映されていない事によるデータ損失が発生する可能性があります。<br>
また、基本的には切り替え後はスタンバイDBがない構成となるので、フェイルオーバー後にもData Guardでの可用性構成を組むために再度スタンバイDBを作成してData Guardを構成する必要があります。<br>
フェイルオーバーはスタンバイDBシステムの **「Data Guardアソシエーション」** 画面から実行します。
    <div align="center">
    <img width="700" alt="dataguard06.png" src="dataguard06.png" style="border: 1px black solid;">
    </div>
    <br>

1. 回復<br>
フェイルオーバー後、Flashback Database機能を利用して旧プライマリを障害発生直前(フェイルオーバーによる切り替え前の時点)までフラッシュバックし、スタンバイにロールを変換してData Guard構成に組み直す事が可能です。
フラッシュバックしたことで生じる差分も自動で同期されるため、一からスタンバイを構築し直す必要はありません。<br>
BaseDB では、コンソール上の『回復』というボタンをクリックするだけで簡単にData Guardが再構成する事が可能です。<br>
回復は、フェイルオーバー後のプライマリDBシステムの **「Data Guardアソシエーション」** 画面から実行します。
    <div align="center">
    <img width="700" alt="dataguard07.png" src="dataguard07.png" style="border: 1px black solid;">
    </div>
    <br>

<br>

# 5. Data Guard構成に含まれるDBの削除方法

Data Guardアソシエーションに含まれるデータベース、もしくはDBシステムを削除する場合、最初にスタンバイDB(DBシステム)を削除しましょう。<br>
スタンバイDBが紐づけられている状態でプライマリDBを削除しようとすると、エラーが表示され削除できません。<br>
もし、プライマリDBの環境のみを削除したい場合は、一度ロールを切り替え、削除対象のDBをスタンバイ・ロールにしてから削除して下さい。

<br>
以上で、この章の作業は完了です。

<br>
[ページトップへ戻る](#anchor0)