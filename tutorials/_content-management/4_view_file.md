---
title: "その4: ファイルのプレビュー（Oracle Content and Experience のファイル共有機能を使ってみよう）"
excerpt: "OCE 上にアップロードされたファイルは、ファイルをダウンロードすることなく、ブラウザ内でファイルの内容を確認（プレビュー）できます。ここでは、ファイルのプレビュー操作を習得します"
order: "024"
layout: single
tags: "OCE"
header:
  teaser: "/content-management/4_view_file/002.jpeg"
  overlay_image: "/content-management/4_view_file/002.jpeg"
  overlay_filter: rgba(80,80,80,0.7)
---

**目次に戻る**: [Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】](../using_file_sharing)

ファイルをローカル環境にダウンロードすることなく、登録済ファイルを Web ブラウザで表示（プレビュー）することができます。

プレビュー可能なファイル拡張子は、以下のドキュメントをご確認ください

+ [Supported File Formats](https://docs.oracle.com/en/cloud/paas/content-cloud/administer/supported-file-formats.html)

~~~
この文書は、2020年5月時点での最新バージョン(20.2.2)を元に作成されてます
~~~

**前提条件**
- [Oracle Content and Experience インスタンスを作成する](../create_oce_instance)
- OCE の利用ユーザーに OCE インスタンスの **CECStandardUser** もしくは **CECEnterpriseUser** アプリケーション・ロールが付与されていること

<br>

# 1. ファイルのプレビュー

1. ファイルをプレビューする方法は以下の通りです

    + **ファイル名** をクリックする

    + ファイルを選択し、**「表示」** をクリックする

    + ファイルの右クリックメニューより **「表示」** をクリックする

        ![画像](001.jpeg)

1. ファイルのプレビューが表示されます。プラス（＋）またはマイナス（ー）アイコンをクリック、もしくはスライダ・バーを移動してプレビュー表示を拡大・縮小できます

    ![画像](002.jpeg)

1. **「全画面」** をクリックすると、全画面を使用してファイルをプレビューできます。画面上部のスライダー・バーを使用して、プレビュー表示を拡大・縮小できます。「全画面の終了」もしくは ESC のクリックで、全画面表示を終了できます

    ![画像](003.jpeg)

1. 管理者により Office Online 連携機能が有効化されている場合、「表示」は **「Webプレビュー」** に名称変更されます。また、**「PowerPoint Onlineで表示」** など Office Online サービスでのファイルプレビューができます

    ![画像](004.jpeg)

<br>

以上でこのチュートリアルは終了です。

**目次に戻る**: [Oracle Content and Experience のファイル共有機能を使ってみよう【初級編】](../using_file_sharing)
