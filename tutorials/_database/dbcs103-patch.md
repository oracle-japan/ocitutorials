---
title: "103: パッチを適用しよう"
excerpt: "Database と Grid Infrastructureに対するパッチ適用方法についてご紹介します。"
order: "1_103"
header:
  teaser: "/database/dbcs103-patch/img11.png"
  overlay_image: "/database/dbcs103-patch/img11.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
  
#link: https://community.oracle.com/tech/welcome/discussion/4474283/
---

<a id="anchor0"></a>

# はじめに
Oracle Base Database Service(BaseDB)では、OS以上がユーザー管理となるため、ユーザー側でパッチ適用の計画と適用実施が可能です。
ここでは、DatabaseとGrid Infrastructureに対するそれぞれのパッチ適用方法についてご紹介します。

<br>

**前提条件 :**
+ [Oracle CloudでOracle Databaseを使おう](../dbcs101-create-db) を通じて Oracle Database の作成が完了していること

+ パッチ適用対象の Oracle Database に対して最新RU/RURが適用されていないこと

<br>

**注意** チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。

<br>

**目次**

- [1. 現在のバージョンを確認しよう](#anchor1)
- [2. Grid Infrastructure にパッチを適用しよう](#anchor2)
- [3. Database にパッチを適用しよう](#anchor3)

<br>
**所要時間 :** 約15分

<a id="anchor1"></a>
<br>

# 1. 現在のバージョンを確認しよう

まずは、コンソール上で作成済みの Database と Grid Infrastructure のバージョンを確認していきましょう。

<br>

1. コンソールメニューから **Oracle Database → Oracle Base Database (VM, BM)** を選択し、対象のDBシステムを選択します。<br>
**DBシステムの詳細** ページの **DBシステム・バージョン** が Grid Infrastructure のバージョンを指します。<br>
    <div align="center">
    <img width="700" alt="img01.png" src="img01.png" style="border: 1px black solid;">
    </div>
    今回はバージョンは 19.9.0.0.0です。
    <br>


1. 画面中央の **データベース** に一覧表示されている **名前** を選択します。<br>
**データベース詳細** ページの **データベース・バージョン** が Database のバージョンを指します。
<br>
    <div align="center">
    <img width="700" alt="img02.png" src="img02.png" style="border: 1px black solid;">
    </div>
    今回はバージョンは 19.9.0.0.0です。
    <br>


<a id="anchor2"></a>
<br>

# 2. Grid Infrastructure にパッチを適用しよう

**DBシステムの詳細** ページで、リソースの **パッチ** を選択すると、適用可能なパッチリストが表示されます。
今回は 19.11.0.0.210420 を適用してみます。

1. **DBシステムの詳細** ページで、リソースの **パッチ** を選択します
<br>
    <div align="center">
    <img width="700" alt="img03.png" src="img03.png" style="border: 1px black solid;">
    </div>
    <br>

1. 適用したいパッチの右の **…** をクリックして、**『事前チェック』** をしてみましょう。この環境に適用できるかどうか(コンフリクトなど)をチェックが走ります。**事前チェックの確認** 画面で『**事前チェックの実行**』をクリックします。
<br>
    <div align="center">
    <img width="700" alt="img04.png" src="img04.png" style="border: 1px black solid;">
    </div>
    <br>

1. 事前チェックで問題がなければ、『**適用**』をしてみましょう。**確認** 画面で『**送信**』をクリックします。<br>
なお、Real Application Clusters で2ノード構成になっている場合は、ローリングで一台ずつ適用されます。
    <br/>
    <div align="center">
    <img width="700" alt="img05.png" src="img05.png" style="border: 1px black solid;">
    </div>
    <br>
    適用が完了すると DBシステムのステータスが「使用可能」になり、**DBシステム・バージョン**が 19.11.0.0.0 に変わっている事が確認できます。
    <br>
    <div align="center">
    <img width="700" alt="img06.png" src="img06.png" style="border: 1px black solid;">
    </div>
    <br>

<a id="anchor3"></a>
<br>

# 3. Database にパッチを適用しよう

続いて、Database にパッチを適用していきましょう。
今回は 19.10.0.0.210119 を適用してみます。

1. **データベース詳細** ページで、リソースの **更新** を選択します
<br>
    <div align="center">
    <img width="700" alt="img07.png" src="img07.png" style="border: 1px black solid;">
    </div>
    <br>

1. 適用したいパッチの右の **…** をクリックして、**『事前チェック』** をしてみましょう。この環境に適用できるかどうか(コンフリクトなど)をチェックが走ります。**事前チェックの確認** 画面で『**事前チェックの実行**』をクリックします。
<br>
    <div align="center">
    <img width="700" alt="img08.png" src="img08.png" style="border: 1px black solid;">
    </div>
    <br>

1. 事前チェックで問題がなければ、『**適用**』をしてみましょう。**確認** 画面で『**送信**』をクリックします。<br>
Real Application Clusters で2ノード構成になっている場合、Grid Infrastructure と同様にローリングで一台ずつ適用されます。
    <br>
    <div align="center">
    <img width="700" alt="img09.png" src="img09.png" style="border: 1px black solid;">
    </div>
    <br>
    適用が完了すると DBシステムのステータスが「使用可能」になり、**DBシステム・バージョン**が 19.10.0.0.0 に変わっている事が確認できます。
    <br>
    <div align="center">
    <img width="700" alt="img10.png" src="img10.png" style="border: 1px black solid;">
    </div>
    <br>

# まとめ

BaseDBはパッチ適用のタイミングや適用するか否かの判断をユーザー側でできるという柔軟度はあります。<br>ただし、古いパッチのまま使い続けることはセキュリティ面や既知の不具合などのリスクや、環境の再作成が必要になった場合に古いイメージで新規作成ができないなどのリスクが考えられます。<br>その為、パッチを適用しない(塩漬け)でいいというわけではありませんので、定期的なパッチ適用を行っていただければ幸いです。

<br>
以上で、この章の作業は完了です。

<br>
[ページトップへ戻る](#anchor0)