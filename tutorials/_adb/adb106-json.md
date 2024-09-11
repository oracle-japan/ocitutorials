---
title: "106: ADBでコンバージド・データベースを体験しよう（JSONデータの操作）"
excerpt: "Autonomous Databaseはコンバージド・データベースとして様々なフォーマットのデータを扱うことができます。この章ではJSONを例にコンバージド・データベースの操作イメージをご紹介します。"
order: "3_106"
layout: single
header:
  teaser: "/adb/adb106-json/img00.png"
  overlay_image: "/adb/adb106-json/img00.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776
---

<a id="anchor0"></a>

# はじめに

コンバージド・データベースとは、あらゆるデータをサポートするマルチモデルを採用し、あらゆるワークロードをサポートしていくこと、また様々なツールをDBに統合し開発生産性に貢献していくという、Oracle Databaseのコンセプトの一つです。


![コンバージドのイメージ](img01.png)

Autonomous Databaseもコンバージド・データベースとして、RDBのフォーマットだけでなく、JSON、Text、Spatial、Graphといった様々なフォーマットを格納しご利用いただけます。  
格納されるデータの種類ごとにデータベースを用意するのではないため、データの重複や整合性に関する懸念は不要であり、またそのためのETLツールを検討する必要もなく、結果的にコストを抑えることが可能です。
  

では、実際にどのように操作するのでしょうか？このページではJSONを例にその操作方法の一例を紹介します。  

<br>

**前提条件**
+ ADBインスタンスが構成済みであること
    <br>※ADBインタンスの作成方法については、[101:ADBインスタンスを作成してみよう](/ocitutorials/adb/adb101-provisioning){:target="_blank"} を参照ください。 

<br>

**目次**

- [1.データを格納してみよう](#anchor1)
- [2.SODA APIでアクセスしてみよう](#anchor2)
- [3.SQLでアクセスしてみよう](#anchor3)


<br>
**所要時間 :** 約20分

<a id="anchor1"></a>
<br>

# 1. データを格納してみよう

まずはJSONデータをADBインスタンスに登録し、登録したデータを確認しましょう。ここではSODA APIを実行できるDatabase Actionsを利用します。


> SODA APIは、Simple Oracle Document Accessの略で、オラクルが用意するJSONデータにアクセスする際のAPIです。新たにJSONコレクションを作成する、挿入、検索、変更や削除にご利用いただけます。SQLで言えばDDL、DMLに当たります。  
このSODA APIはJavaScriptはもちろん、JavaやPython, PL/SQLなどからCallして利用することが可能ですし、SQLclやDatabase Actionsではデフォルトでインストールされています。  
（参考資料: [Autonomous JSON Database 技術概要](https://speakerdeck.com/oracle4engineer/autonomous-json-database-ji-shu-gai-yao){:target="_blank"} ）

<br>

1. Database Actionsにアクセスし、**SQL**を選択します
![img](img03.png)

1. ドキュメントを格納するコレクションempを作成します。以下のスクリプトをワークシートに貼り付け、**緑色のボタン**で実行してください  
（コレクションとはRDBMSで言う表に相当し、内部的には一つの表を作成しています。）
```
soda create emp
```
![img](img04.png)

1. コレクションempが作成されたことを確認します
```
soda list
```
![img](img05.png)

1. JSONのドキュメントをempコレクションに格納します。以下のSODAコマンドを貼り付け て、**緑色のスクリプト実行ボタン**をクリックしてください
(ドキュメントとはRDBMSで言う行に相当します。empコレクション（表）に3件のドキュメント（行）を格納しています。)
```
soda insert emp {"name":"Blake", "job":"Intern", "salary":30000}
soda insert emp {"name":"Smith", "job":"Programmer", "salary":80000}
soda insert emp {"name":"Miller", "job":"Programmer", "salary":90000}
```
![img](img06.png)

<br>
以上、SODA APIを利用したJSONデータのロードでした。

<br>

> 参考）RDBMSとの用語比較
![img](img02.png)

<br>
<a id="anchor2"></a>

# 2. SODA APIでアクセスしてみよう

それでは次に、上記で格納したJSONデータをAPI経由で参照してみましょう。ここでは引き続き、Database Actionsを利用します。

1. 以下のSODAコマンドを貼り付けて、**緑色のスクリプト実行ボタン**をクリックしてください。
```
-- 全ドキュメントの確認
soda get emp
-- 名前で絞り込み（Millerさんのデータを確認）
soda get emp -f {"name":"Miller"}
-- 給与で絞り込み（salaryが50000より大きい人のデータを確認）
soda get emp -f {"salary": {"$gt" : 50000} }
```
![img](img07.png)

まずはAPI経由でJSONデータを参照できることが確認できました。

<br>
<a id="anchor3"></a>


# 3. SQLでアクセスしてみよう

それでは次に、SQLで参照してみましょう。

1. 左から**リロード**をクリックすると、EMP表として格納されていることがわかります。**EMP表**をクリックしますと、格納されているJSONドキュメントのID,作成日、更新日、バージョン、およびドキュメント列を確認できます。
![img](img08.png)

1. Database ActionsのSQLワークシートに以下のSQLを貼り付けて、**緑色の実行ボタン**をクリックし実行してください。  
json_serialize関数を利用してJSON_DOCUMENT列を参照することで、格納されているデータをJSON形式で出力します。
```
select json_serialize(json_document) from emp ;
```
![img](img09.png)

1. 次にRDBフォーマットで出力しましょう。Database ActionsのSQLワークシートに以下のSQLを貼り付けて、**緑色の実行ボタン**をクリックし実行してください。
各キーに対してjson_document関数を使います。
```
select e.json_document.name,
    e.json_document.job,
    e.json_document.salary,
    e.json_document.email
from emp e ;
```
![img](img10.png)

1. 次に集計してみましょう。Database ActionsのSQLワークシートに以下のSQLを貼り付けて、**緑色の実行ボタン**をクリックし実行してください。  
ここでは簡単な例としてJOBごとの従業員数を表示しています。
```
select e.json_document.job , count(*)
from emp e
group by e.json_document.job ;
```
![img](img11.png)

<br>

JSONデータについても、SQLで参照できることがわかりました。
SQLですので上記のように集計処理を簡単に実装できることは勿論、他のRDB形式で保存されている他の表とJOINすることも可能です。  
JSON形式で生成されるIOT関連のログや販売履歴といったトランザクションデータと、RDMS形式で格納されているマスターデータとを付き合わせた分析など、様々な用途にご活用いただけるかと思います。

<br>

以上で、この章の作業は終了です。


<a id="anchor3"></a>


<!-- メモ）Qiitaに記事があったので、参考資料に提示しつつ、一旦記載は見送る。必要に応じて追記する。

# 3. JSONファイルをアップロードしてみよう

次に大量データを想定し、JSONファイルをDBMS_CLOUD.COLLECTIONにてロードする手順を見ていきます。
より高速にADBインスタンスにロードすることが可能です。


1.こちらを参考にオブジェクトストレージにJSONファイルをアップロードします。

1.オブジェクトストレージからDBMS_CLOUD.パッケージを利用してロードします。ここで利用するクレデンシャルは上記1で作成したクレデンシャルを利用しています。


1.ロードできたことを確認します。

```
select xxx
```

-->



<!-- メモ）Database Actionsで記載しようとしたら、ファイルサイズが大きくなると画面がハングしてしまうので、一旦見送り。Oracle Livelabsにチュートリアルがあったので、参考資料で案内。。。

次にGUIベースでコレクションの作成、データをロードする方法についてみていきましょう。ここではある程度大量のデータを想定し、Database ActionsはGUIベースでJSONデータを貼り付けるだけでロードすることも可能です。

1. 左上の**メニュー**から**JSON**を選択します。

![img2-01](img2-01.png)

> 初回はDatabase ActionsにおけるJSONウィザードの利用方法がガイドされます。上記1で実施したコレクションの作成、登録作業も実施可能なので、是非ご確認ください。


2. コレクション作成をクリックします。

![img2-02](img2-02.png)

3. 新規JSONドキュメントをクリックします。

![img2-03](img2-03.png)


4. 画面下で登録したドキュメントを確認できます。


5. 

参考）外部にAPIで公開されているデータがあれば、クライアントツールなしにADBインスタンスだけでJSONデータをロードすることも可能です。
参考）Qiita 

-->


<br>


# よくある質問やTips

**1. JSONファイルを直接ロードしたい場合や、大量データをロードしたい場合はどうすれば良いですか？**

・Database ActionsのJSONウィザード、もしくはDBMS_CLOUD.COPY_COLLECTION([マニュアル](https://docs.oracle.com/en/cloud/paas/autonomous-database/adbsa/autonomous-json-load-files.html))を利用しコマンドベースでロードしてください。特に大量データをロードする場合は、性能の観点から後者のDBMS_CLOUD.COPY_COLLECTIONの利用を推奨します。

<!-- * Database ActionsのJSONウィザードの[参考手順(Oracle Livelabs)](https://oracle.github.io/learning-library/data-management-library/database/json/json-soda-ajd/workshops/freetier/?lab=sql-json)
→リンク切れのため、一旦削除します。
-->

* DBMS_CLOUD.COPY_COLLECTIONに関する[参考手順(Qiita)](https://qiita.com/kenwatan/items/db9134e1c9bf49315a79)


<br>

# 参考資料


## Oracle LiveLabsのチュートリアル

[JSON and SODA with the Autonomous JSON Database Workshop](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=831)
* Autonomous JSON Database(AJD)における各種JSONデータの取り扱いについてワークショップ形式で説明しています。
* 本ページでは扱っていない、Database ActionsにおけるJSONウィザードの利用方法や、その他JSONを利用する上でのSQL関数の使い方にも触れています。
* ATP/ADWでも同様にお試しいただけますので、是非ご確認ください。


[Converged Functionality of Oracle Autonomous Database Workshop](https://apexapps.oracle.com/pls/apex/dbpm/r/livelabs/view-workshop?wid=776)
* Autonomous Databaseの特徴であるコンバージド・データベースをご体験いただけます。
* 本ページはJSONのみを扱いましたが、このワークショップでは、JSON以外の例えばSpatialといったフォーマットの扱い方にも触れています。


## その他

[Autonomous JSON Database 技術概要](https://speakerdeck.com/oracle4engineer/autonomous-json-database-ji-shu-gai-yao)

[Qiita: Autonomous Database でのJSONデータ操作](https://qiita.com/TakuyaAma/items/429d762f54a18b0785a5)
* Database Actionsを利用したコレクションの作成から、JSONを扱う際のその他関数についてなど、このページでは触れていない内容が紹介されています。

[Qiita: Autonomous DatabaseにJSONドキュメントを格納してみた。（ORDS+SODA)](https://qiita.com/kenwatan/items/db9134e1c9bf49315a79)
* SODA APIを利用したコレクションの作成から、DBMS_CLOUD.COPY_COLLECTIONを利用した大量データのロード方法などを紹介しています。


<br>
以上で、この章は終了です。  
次の章にお進みください。

<br>
[ページトップへ戻る](#anchor0)



