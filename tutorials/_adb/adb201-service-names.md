---
title: "201: 接続サービスの理解"
excerpt: "インスタンスに接続する際に選択する「接続サービス」についてご紹介します。CPUの割当優先度や並列処理、キューイングの有無を選択するだけでコントロールできます。"

order: "3_201"
layout: single
header:
  teaser: "/adb/adb201-service-names/image_top.png"
  overlay_image: "/adb/adb201-service-names/img_top.png"
  overlay_filter: rgba(34, 66, 55, 0.7)

#link: https://community.oracle.com/tech/welcome/discussion/4474310
---

Autonomous Database では、事前に定義済の接続サービスが用意されています。
本章では、接続サービスの概要をご紹介します。


**所要時間 :** 約10分

**前提条件 :**

* ADBインスタンスが構成済みであること
   <br>※ADBインタンスを作成方法については、本ハンズオンガイドの [101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning) を参照ください。

**目次：**

- [1. 接続サービスとは？](#anchor1)
- [2. Database ActionsのResource Managerの設定画面にアクセスしよう](#anchor2)
- [3. CPU/IOの優先度の変更しよう](#anchor3)
- [4. 処理時間/利用IOの上限を設定しよう](#anchor4)
- [5. 同時実行セッション数の制限が変更できることを確認しよう](#anchor5)


<br>


<a id="anchor1"></a>

# 1. 接続サービスとは？

## 接続サービスの選択

インスタンスに接続する際、Autonomous Databaseはアプリケーションの特性に応じて適切な「**`接続サービス`**」を選択する必要があります。

この「接続サービス」は、**`パラレル実行`**・**`同時実行セッション数`**・**`リソース割り当て`**などの制御について事前定義されたもので、ユーザーは接続サービスを選択するだけで、CPUの割当や並列処理をコントロールできます。

選択可能な接続サービスの種類は、次の通りです。
<br>Autonomous Data Warehouse(ADW) では３種類、Autonomous Transaction Processing(ATP)では5種類あり、ワークロード適したものを選択します。

![img_service.png](img_service.png)



## 使い分けの指針、スタートポイント


代表的なワークロードを「**OLTP系**」と「**バッチ系/DWH系**」の２つのカテゴリに分類し、それぞれの処理の特性と適応する接続サービスについてまとめました。


<table>
  <tr>
    <th bgcolor="#c74634"></th>
    <th bgcolor="#c74634"><div style="color:white; text-align: center"><b>OLTP系</b></div></th>
    <th bgcolor="#c74634"><div style="color:white; text-align: center"><b>バッチ系・DWH</b></div></th>
  </tr>
  <tr>
    <td>特徴</td>
    <td>
    <ul>
      <li>少量の行しかアクセスしない</li>
      <li>大量のユーザが同時に実行する</li>
      <li>一般的なオーダーとしてはミリ秒レベル</li>
    </ul>
    </td>
    <td>
    <ul>
      <li>大量の行にアクセスし、一括で処理する</li>
      <li>ユーザ数は少ない</li>
      <li>一般的なオーダーとしては秒～分レベル</li>
	</ul>
    </td>
  </tr>
  <tr>
    <td>一般的なチューニング方針</td>
    <td>
    <ul>
      <li>スループット（TPS:Transaction Per Sec）を重視し、単体処理のリソース利用の極小化を目指す</li>
	  </ul>
    </td>
    <td>
    <ul>
      <li>単体SQLのレスポンス(Elapsed Time)を重視し、単体処理でCPU、IOリソースを100%割りきることを目指す</li>
	</ul>
    </td>
  </tr>
    <tr>
    <td>Autonomousにおける推奨</td>
    <td>
    <ul>
      <li><b>TP</b>を利用
        <ul>
            <li>単一のCPUコアで処理させるため</li>
            <li>手動でパラレル度を制御したい場合、もしくは最優先したい特別な処理の場合は、<b>TPURGENT</b>を推奨</li>
        </ul>
    　</li>
    <br><div style="text-align: center"><img src="img_oltp.png"></div>
    <br>
    ▲ 少ないリソースで処理させることで、より多くの処理をこなせるようになる
    </ul>
    </td>
    <td>
    <ul>
      <li><b>MEDIUM</b>を利用
        <ul>
            <li>複数のCPUコアで処理させるため</li>
            <li>動的にパラレル処理されるだけでなく、キューイングも実装されているため、効率よく処理できる</li>
            <li>同時実行セッション数が3よりも少ない場合は<b>HIGH</b>を推奨</li>
        </ul>
      </li>
    <br><div style="text-align: center"><img src="img_dwh.png"></div>
    <br>
    ▲ リソースを100%使い切ることで、全体の処理を早く終えることができる！
	</ul>
    </td>
  </tr>
</table>

- **OLTP系の処理**
    - 比較的軽いSQLを多くのユーザが同時に処理を実行するような場合、まずは<b>TP</b>をご利用ください。
    - 比較的優先度が高く、また単一のCPUコアで処理するので、単体処理のリソース利用の極小化し、スループット（TPS:Transaction Per Sec）の向上が図れます。
    - 一方で、手動でパラレル度を制御したい場合、もしくは最優先したい特別な処理の場合は、<b>TPURGENT</b>をご利用ください。
    - その他、<b>HIGH/MEDIUM</b>は同時実行セッション数に制限があるため、OLTP系の処理には向きません。

<br>

- **バッチ系/DWH系の処理**
    - 同時実行ユーザ数が少ない一方で、一本のSQLが重く長時間かかるSQLの場合は、まずは<b>MEDIUM</b>をご利用ください
    - 単体のSQLに対して複数のCPUコアが割り当てられ、またキューイングも実装されているため効率よく処理でき、レスポンス（Elapsed Time）の向上が図れます。
    - さらにリソースを多く割り当てて性能を向上したい場合は、<b>HIGH</b>をご利用ください。ただし、同時実行セッション数が3に制限されます。
    - その他、管理操作等<b>LOW</b>をお使いください
    

以下では、接続サービス毎に設定可能な、CPU/IOの優先度(shares)の設定、処理時間/利用IO量の上限設定について確認します。


<br>

<a id="anchor2"></a>

# 2. Database ActionsのResource Managerの設定画面にアクセスしよう

Database Actionsは、ADBにビルトインされているツールで、データベースオブジェクトの管理、SQLなど様々な操作を実行できるツールです。
その他にもADBのパフォーマンスの管理および監視も行えます。
<br>管理面では、ウォレットのダウンロードや管理者パスワードの変更などができ、監視面ではADBのアクティビティやCPU使用率などを監視することができます。

その中の、管理機能の一つである「**`リソース管理ルールの設定`**」という項目では、リソースマネージャの設定変更を行うことができます。
<br>本ページでは以下の3つの設定を変更・確認してみましょう。

  - 長時間実行されるSQLや大量にIOを消費するSQLの自動切断設定（デフォルトは0で未設定）
  - 接続サービス間の優先度の調整
  - 同時実行セッション数の調整

まずは、設定変更を行うためDatabase Actionsにアクセスします。

1. Database Actionsをクリックします。

    ![img1_1.png](img1_1.png)

2. **`管理`** の **`リソース管理ルールの設定`** をクリックします。

    ![img1_2.png](img1_2.png)

<br>

<a id="anchor3"></a>

# 3. CPU/IOシェアの変更しよう

CPU/IOのシェアとは、各接続サービス（コンシューマ・グループ）間でのCPU配分の相対的な優先度を示す値です。
<br>1.でご紹介した、TPURGENT・TP・HIGH・MEDIUM・LOWの５つの接続サービスに、それぞれどのくらいのCPU/IOシェアを割り当てるか という比率を設定することができます。
<br>尚、IOについてはCPUに比例する形で割り当てられます。

<br>

> **補足**
><TABLE border="0">
><TR border="0">
><TD width="50%" align="top">
>割り当てる数値について、例を挙げながらご紹介します。
><br>リソース管理ルールの設定にて、CPU/IOシェアの割当を右図のように設定したとします。
><br>このような設定で、TPURGENTを使ったセッションと、LOWを使ったセッションの２つが同時に処理を要求した場合、全体のリソースを<b>TPURGENT:LOW = 12:1</b>でリソースを分け合う という形で処理されます。
></TD>
><TD width="50%" align="middle" border="0"><img src="img3_0.png"></TD>
></TR>
></TABLE>


<br>

1. **`CPU/IOシェア`** タブをクリックします。

    ![img2_1.png](img2_1.png)


2. デフォルトでは上限は設定されていません。適宜数値を変更して 変更を保存 をクリックしてください。

     （ここでは例としてTPの優先度をデフォルトの8から10に変更しています)

    ![img2_2.png](img2_2.png)

<br>

<a id="anchor4"></a>

# 4. 処理時間/利用IOの上限を設定しよう

ランナウェイ基準は、各接続グループに対し、**` SQLの実行時間`**、**`IO量の上限`** を設定する項目です。
<br>上限を超えるクエリは強制キャンセルされますが、セッションは接続されたままとなります。


1. **`ランナウェイ基準`** タブをクリックします。

    ![img3_1.png](img3_1.png)

2. デフォルト設定を確認し、適宜数値を変更して 変更を保存 をクリックしてください。

     （ここでは例としてHIGH,MEDIUMの処理時間上限を10分、MEDIUMのIO上限を10GBに設定しています）

    ![img3_2.png](img3_2.png)

<br>

<a id="anchor5"></a>

# 5. 同時実行セッション数の制限が変更できることを確認しよう

同時実効性とは、複数のトランザクションを同時に処理するための機能のひとつです。
事前定義されたサービス名のコンシューマーグループは、さまざまなレベルのパフォーマンスと同時実行性を提供します。<br>
事前定義されたサービスの1つを選択すると、ほとんどのアプリケーションで適切に機能する同時実行セッション数が提供されます。<br>
しかし、デフォルトのサービスの1つを選択してもアプリケーションのパフォーマンスのニーズが満たされない場合は、**`MEDIUM`** サービスのみ同時実行性の制限を変更することができます。<br>

同時実行制限を変更すると、ECPUの数と選択した同時実行制限に基づいて、 **`並列度（DOP）`** が再計算されます。
※ 並列度は、単一の処理に対応付けられるパラレル実行サーバーの数で表される値です。

<br>ATPにおける各接続サービスのデフォルトの同時ステートメント数は、次の法則に従って定義されます。


<div style= "width: 100% align: center">
  <table >
    <tr>
      <th bgcolor="#c74634"><div style="color:white; text-align: center"><b>データベースサービス名</b></div></th>
      <th bgcolor="#c74634"><div style="color:white; text-align: center"><b>同時実行性の制限値</b></div></th>
    </tr>
    <tr>
      <td>tpurgent</td>
      <td>75×ECPU数</td>
    </tr>
    <tr>
      <td>tp</td>
      <td>75×ECPU数</td>
    </tr>
    <tr>
      <td>high</td>
      <td>3</td>
    </tr>
    <tr>
      <td><div style="color:#c74634"><b>medium</b></div></td>
      <td><div style="color:#c74634"><b>0.125~0.75×ECPU数の間で調整可能</b></div></td>
    </tr>
    <tr>
      <td>low</td>
      <td>75×ECPU数</td>
    </tr>
  </table>
  </div>


<br>ただし、MEDIUMサービスにおける同時実行制限の変更は、4つ以上のECPUを持つインスタンスでのみ許可されます。

サービスの同時実効性についての詳細は[こちら](https://docs.oracle.com/en/cloud/paas/autonomous-database/adbsa/manage-service-concurrency.html)を参照ください。


1. **`同時実効性の制限`** タブをクリックします。

    ![img5_1.png](img5_1_new.png)

2. MEDIUMの同時実効性の制限を変更します。
  デフォルト設定を確認し、数値を変更できることをご確認ください。
  変更の保存はせず、デフォルト値のままで結構です。
  
    ![img5_2.png](img5_2_new.png)

    ECPU数を8に設定しているため、同時実効性の制限を1~6の間で変更することができます。
    なお、ECPU数はADBの実行中にも変更可能です。

以上で、この章の作業は終了です。

次の章にお進みください。