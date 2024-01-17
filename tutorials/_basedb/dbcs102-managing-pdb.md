---
title: "102: BaseDB上のPDBを管理しよう"
excerpt: "Oracle Base Database Service(BaseDB)では、OCI コンソールから Oracle Cloud Infrastructure 上の PDB を 起動・停止だけでなく、PDB のクローンを簡単に実施する事が可能です。"
order: "1_102"
header:
  teaser: "/basedb/dbcs102-managing-pdb/img13.png"
  overlay_image: "/basedb/dbcs102-managing-pdb/img13.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
  
#link: https://community.oracle.com/tech/welcome/discussion/4474283/
---

<a id="anchor0"></a>

# はじめに

Oracle Base Database Service(BaseDB)では、Oracle Cloud Infrastructure の上で稼働する Oracle Database の PDB を OCI コンソールから停止したり、起動したり、既存 PDB からクローンするなどの操作が簡単に行う事が可能です。この章では実際にどのように操作するのか確認していきます。

<br>

**前提条件 :**
+ [Oracle CloudでOracle Databaseを使おう](../dbcs101-create-db){:target="_blank"}を通じて Oracle Database の作成が完了していること

<br>

**注意** チュートリアル内の画面ショットについては現在の画面と異なっている場合があります。

<br>

**目次**

- [1. PDB を起動・停止してみよう](#anchor1)
- [2. PDB を新規作成してみよう](#anchor2)
- [3. 既存 PDB からクローン PDB を作成してみよう](#anchor3)

<br>
**所要時間 :** 約15分

<a id="anchor1"></a>
<br>

# 1. PDB を起動・停止してみよう

まずは、コンソール上で作成済みの PDB を確認する画面への遷移、および PDB の起動・停止について確認していきましょう。

<br>

1. コンソールメニューから **Oracle Database → Oracle Base Database (VM, BM)** を選択し、有効な管理権限を持つコンパートメントを選択します

1. 操作したい PDB を持つ **DB システム**を選択します

1. **DBシステムの詳細**から、対象のデータベースを選択します

1. 左側の **リソース** から、**プラガブル・データベース** を選択します<br>選択後、次の画面が表示されます
この画面では、**PDB1** と **PDB2** の2つの PDB が対象データベースに構成されています
    <div align="center">
    <img width="700" alt="img1.png" src="img1.png" style="border: 1px black solid;">
    </div>
    <br>

1. 操作したい PDB の右側にある ・・・ メニューから、起動や停止といった操作を行う事が可能です<br>
※ここでは、**PDB1** の停止を実施します
    <div align="center">
    <img width="700" alt="img2.png" src="img2.png" style="border: 1px black solid;">
    </div>
    <br>

1. 確認画面が表示されるので、**PDBの停止**を選択すると対象のPDBの **状態** が「更新中」に変化します
    <div align="center">
    <img width="700" alt="img3.png" src="img3.png" style="border: 1px black solid;">
    </div>
    <div align="center">
    <img width="700" alt="img4.png" src="img4.png" style="border: 1px black solid;">
    </div>
    <br>

1. **状態** が「使用可能」に戻れば停止完了です<br>
同様の手順で「起動」を選択する事で **PDB** を起動する事が可能です。
>    なお、実際にデータベースへ接続して確認すると、**PDB1**が MOUNT 状態になっています
>    <div align="center">
>    <img width="400" alt="img5.png" src="img5.png" style="border: 1px black solid;">
>    </div>
<br>

<a id="anchor2"></a>

# 2. PDB を新規作成してみよう

続いて、PDBを新規作成する場合の手順を確認しましょう。

1. 先ほどの画面から、**プラガブル・データベースの作成**を選択します

1. 立ち上がった **プラガブル・データベースの作成** ウィンドウに以下の項目を入力します
- **PDBの名前入力** - 任意（例 :pdb1）
- **PDB管理パスワード** - 任意（例 : WelCome123#123#)
- **データベースのTDEウォレット・パスワード** -  [101: Oracle Cloud で Oracle Database を使おう](../dbcs101-create-db){:target="_blank"}で **データベース情報の入力欄** に設定したパスワードを入力  
    <div align="center">
    <img width="700" alt="img6.png" src="img6.png" style="border: 1px black solid;">
    </div>

1. **プラガブル・データベースの作成** ボタンを押します<br>（PDBの作成がバックエンドで開始します。作業が完了するとステータスが PROVISIONING... から AVAILABLE に変わります）

1. 画面からPDBが作成されている(※今回のケースではPDB3)事が確認できます
    <div align="center">
    <img width="700" alt="img7.png" src="img7.png" style="border: 1px black solid;">
    </div>
    <br>
>    データベースへ接続して確認すると、**PDB3**が READ WRITE モードで起動しています。
>    <div align="center">
>    <img width="400" alt="img8.png" src="img8.png" style="border: 1px black solid;">
>    </div>

<a id="anchor3"></a>

# 3. 既存 PDB からクローン PDB を作成してみよう

1. クローン元となる **PDB** の右側にある ・・・ メニューから、**クローン** を選択します<br>※この例では、**PDB2** をクローン元としています
    <div align="center">
    <img width="700" alt="img9.png" src="img9.png" style="border: 1px black solid;">
    </div>
    <br>

1.  立ち上がった **PDBのクローニング** ウィンドウに以下の項目を入力します<br>
- **PDB名** - 任意（例 :pdb1）
- **Database TDE wallet password** - - 第8章でデータベース作成時に設定したパスワードを入力  
- **PDB管理パスワード** - 任意（例 : WelCome123#123#)
    <div align="center">
    <img width="300" alt="img10.png" src="img10.png" style="border: 1px black solid;">
    </div>
    <br>

1. **PDBのクローニング** ボタンを押します<br>（PDBのクローニングがバックエンドで開始します。作業が完了するとステータスが PROVISIONING... から AVAILABLE に変わります）

1. 画面からPDBがクローニングされている事が確認できます(※このケースではPDB2_CLONEが作成されている事が分かります。)
    <div align="center">
    <img width="700" alt="img11.png" src="img11.png" style="border: 1px black solid;">
    </div>
    <br>
>新規作成時と同様にデータベースへ接続して確認すると、**PDB2_CLONE**が READ WRITE モードで起動しています。
>    <div align="center">
>    <img width="400" alt="img12.png" src="img12.png" style="border: 1px black solid;">
>    </div>


以上で、この章の作業は終了です。

<br>
[ページトップへ戻る](#anchor0)