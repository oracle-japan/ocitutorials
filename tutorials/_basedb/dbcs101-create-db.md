---
title: "101: Oracle Cloud で Oracle Database を使おう(BaseDB)"
excerpt: "Oracle Base Database Serviceは、Oracle Cloud Infrastructure の上で稼働する Oracle Database のPaaSサービスです。"

order: "1_101"
header:
  teaser: "/basedb/dbcs101-create-db/img11.png"
  overlay_image: "/basedb/dbcs101-create-db/img11.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
  
#link: https://community.oracle.com/tech/welcome/discussion/4474283/
---

<a id="anchor0"></a>

# はじめに
Oracle Base Database Service(BaseDB)は、Oracle Cloud Infrastructure の上で稼働する Oracle Database のPaaSサービスです。

ユーザーはオンプレミスと全く同じOracle Databaseのソフトウェアをクラウド上で利用することができ、引き続きすべてのデータベース・サーバーの管理権限(OSのroot権限含む)およびデータベースの管理者権限を保持することができます。

この章では、作成済みの仮想クラウド・ネットワーク(VCN)にデータベース・サービスを1つ作成していきます。

<br>

**前提条件 :**
+ [Oracle Cloud Infrastructure チュートリアル](../..) を参考に、仮想クラウド・ネットワーク(VCN)の作成が完了していること


<br>

**注意** チュートリアル内の画面ショットについては Oracle Cloud Infrastructure の現在のコンソール画面と異なっている場合があります

<br>

**目次**

- [1. DBシステムの作成](#anchor1)
- [2. DBシステムへのアクセス](#anchor2)
- [3. データベース（PDB）にアクセス](#anchor3)
- [4. PDB上のスキーマにアクセスしましょう](#anchor4)

<br>
**所要時間 :** 約30分

<br>
<a id="anchor1"></a>

# 1. DBシステムの作成

1. コンソールメニューから **Oracle Database → Oracleベース・データベース・サービス** を選択し、有効な管理権限を持つコンパートメントを選択します

    ![image.png](20240116-1.png)

1. **DBシステムの作成** ボタンを押します

    ![image.png](20240116-2.png)

1. 立ち上がった **DBシステムの作成** ウィンドウの入力欄に、以下の項目を入力します。

   ※<img src="coin.png" alt="coin" width="30"/>がついている入力項目は課金に関係する項目です。

   - **コンパートメント** - 任意 (集合ハンズオン環境を利用している場合は講師の指示に従って選択してください)。
   - **DBシステムの名前** - 任意 (以降では dbcs01 として記載しています)。プロビジョニング後の変更はできません。
   - **可用性ドメイン** - 任意 (集合ハンズオン環境を利用している場合は講師の指示に従って選択してください)
   - **シェイプの構成** <img src="coin.png" alt="coin" width="30"/>- 任意 (集合ハンズオン環境を利用している場合は VM.Standard2.1 を選択してください)
      >**SHAPE**の選択時には、使用している環境のサービス・リミットに注意してください。初期状態ではサービス・リミットが0に設定されていて作成できないデータベース・サービスのシェイプも存在します。
      サービス・リミットについて不明な方は [OCIコンソールにアクセスして基本を理解する - Oracle Cloud Infrastructureを使ってみよう(その1)](../../beginners/getting-started){:target="_blank"} をご確認ください。<br>

      >**RAC** を利用したい場合は **VM.Standard2.2** 以上を選択ください 
  
   - **ストレージの構成**  - 任意 <br>
     ※ハンズオンでは作業時間短縮のため、**論理ボリューム・マネージャ** を選択ください<br>　それ以外の場合、もしくは後続のAutonomous Databaseのチュートリアルを実施される場合は **Oracle Grid Infrastructure** を選択ください。プロビジョニング後の変更はできません。
   - **ストレージ・パフォーマンスの構成** <img src="coin.png" alt="coin" width="30"/> - 任意の**ストレージ・ボリュームのパフォーマンス**、**使用可能なデータ・ストレージ** <img src="coin.png" alt="coin" width="30"/> は**256** を選択してください。プロビジョニング後は変更できません。

       ![image.png](20240116-3.png)

   - **DBシステムの構成** <img src="coin.png" alt="coin" width="30"/> - **合計ノード数**は**1**、任意の**Oracle Databaseソフトウェア・エディション**を選択してください。どちらもプロビジョニング後の変更はできません。
      >RACを利用したい場合はノード数を2に選択ください

   - **SSHキー・ペアの生成/SSHキー・ファイルのアップロード/SSHキーの貼付け** - いずれかの選択肢よりSSHキーを追加します

       ![image.png](20240116-4.png)

   - **ライセンス・タイプ** <img src="coin.png" alt="coin" width="30"/> - 任意
   - **仮想クラウド・ネットワーク** - 第2章で作成した仮想クラウド・ネットワークを選択。プロビジョニング後の変更はできません。
   - **クライアントのサブネット**  - 任意のサブネットを選択（本ハンズオンでは、パブリック・サブネット（リージョン）を選択ください）プロビジョニング後の変更はできません。
   - **ホスト名接頭辞** - 任意 プロビジョニング後の変更はできません。

       ![image.png](20240116-5.png)

   - **診断収集** - 任意
   - **拡張オプションの表示** - 任意（フォルトドメインの指定、タイムゾーンの設定が可能であることをご確認ください。）

       ![image.png](20240116-6.png)

1. **次**をクリックします

1. データベース情報の入力欄に、以下を入力します
    - **データベース名** - 任意（例 : orcl）プロビジョニング後の変更はできません。
    - **一意のデータベース名の接尾辞** - 任意 プロビジョニング後の変更はできません。
    - **データベースのバージョン** - 19c
    - **PDB名** - 任意（例 :pdb1）プロビジョニング後の変更はできません。
    - **パスワード** - 任意 (sysスキーマのパスワードです。後から使用しますので、忘れずにメモしておいてください。例 : WelCome123#123#  )

       ![image.png](20240116-7.png)

    - **自動バックアップの構成** <img src="coin.png" alt="coin" width="30"/> - 任意（ハンズオンでは選択なしのままで良いです）
    - **拡張オプションの表示** - 任意（文字コードを選択できることを確認ください。）

        ![image.png](20240116-8.png)   

1. **DBシステムの作成** をクリックします（DBシステムの作成がバックエンドで開始します。作業が完了するとステータスが **PROVISIONING...** から **AVAILABLE** に変わります）

<br>
<a id="anchor2"></a>

# 2. DBシステムへのアクセス

作成したDBシステムに対して、sshでアクセスします。

1. 画面右下の **リソース** タブから、**ノード** を選択し、**パブリックIPアドレス** に表示されているIPアドレスをメモします。

1. 任意のターミナルソフトを起動し、以下の情報でssh接続します。
    - **IPアドレス** - 上記ステップで確認したインスタンスの **パブリックIPアドレス**
    - **ポート** - 22 (デフォルト)
    - **ユーザー** - opc (DBシステムは、接続用に予め opc というユーザーが用意されています)
    - **SSH鍵** - インスタンスを作成する際に使用した公開鍵と対になる秘密鍵、集合ハンズオン・セミナーの場合は講師から指示される鍵を使用してください
    - **パスフレーズ** - 秘密鍵にパスフレーズが設定されている場合は指定してください。集合ハンズオン・セミナーの場合は未設定です<br>
    下記は Tera Term を利用した場合の接続の設定例です。<br>
    ![image.png](img01.webp)

1. 接続が成功すると、以下のように opc ユーザーでインスタンスにログインできます。<br>
opc ユーザーは、sudo により root 権限を取得することが可能です。
また、入力した情報にもとづいてOracle Databaseが作成され、インスタンスが起動していることがわかります。<br>
    ![image.png](img02.webp)

1. DBシステムには、管理用の dbcli コマンドが用意されています。
rootユーザーのPATH環境変数には dbcli のロケーションが登録されています。
<br>
以下のコマンドを実行し、DBシステムの情報を閲覧します。
      ```
    dbcli describe-system
      ```
    ![image.png](img03.webp)

    また、以下のコマンドで、データベースの一覧を閲覧します。
      ```
    dbcli list-databases
      ```
    ![image.png](img04.webp)

    dbcli のその他のコマンドの詳細については、dbcli --help または [Oracle Database CLI Reference](https://docs.oracle.com/ja-jp/iaas/Content/Database/References/dbacli.htm) をご確認ください。

<br>
<a id="anchor3"></a>

# 3. データベース（PDB）にアクセス
作成したデータベースにログインしてみましょう。

上記で作成したDBシステムでは、1つのコンテナ・データベース(CDB)上に、デフォルトで1つプラガブル・データベース（PDB）が作成されます。

ここでは、PDB上にスキーマを一つ作成しましょう。

上記手順にて、BaseDBのOSにrootユーザーでログインしていることを前提にします。

1. rootユーザーからoracleユーザにスイッチします。

    ```
  su - oracle
    ```
    ![image.png](img05.webp)

2. sysユーザーでCDBにログインします。
    ```
  sqlplus / as sysdba
    ```
    ![image.png](img06.webp)

3. デフォルトで作成されているPDBを確認後、PDBインスタンスに接続します。（例：PDB1）

    ```
  show pdbs
  alter session set container = PDB1 ;
    ```
    ![image.png](img07.webp)

4. PDB上にスキーマを作成します。<br>尚、ここでは便宜上、最低限必要な権限を付与していますが、要件に応じて権限・ロールを付与するようにしてください。

    ```
  create user TESTUSER identified by WelCome123#123# ;
  grant CREATE SESSION,CONNECT,RESOURCE,UNLIMITED TABLESPACE to TESTUSER ;
  exit
    ```
    ![image.png](img08.webp)

<br>

<a id="anchor4"></a>
# 4. PDB上のスキーマにアクセスしましょう

次に作成したスキーマにアクセスしてみましょう。

一般的にはtnsnames.oraにエントリを追加してログインされることが多いかと思いますが、ここでは便宜上、簡易接続方式を利用し、作成したPDB上のスキーマに直接アクセスしてみます。

1. OSユーザを **grid** に変更し、接続情報（ポート番号、サービス名）を確認します。<br> 以下では、例としてlsnrctlを利用していますが、他の方法で確認いただいてもOKです。

    ```
  lsnrctl status
    ```
    ![image.png](img09.webp)

2. 上記で確認した値を利用して接続します。<br>SQL*Plusを利用する場合は、以下のようにホスト名、ポート番号、サービス名を指定します。<br>
（$ sqlplus <スキーマ名>/<パスワード>@&lt;ホスト名>:<ポート>/<サービス名>）

    ```
  sqlplus testuser/WelCome123#123#@dbcs01.subnet.vcn.oraclevcn.com:1521/pdb1.subnet.vcn.oraclevcn.com
    ```
    ![image.png](img10.webp)

以上で、この章の作業は完了です。

<br>
[ページトップへ戻る](#anchor0)
