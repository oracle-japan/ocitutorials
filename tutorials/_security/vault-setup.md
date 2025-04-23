---
title: "Vaultを作成し 顧客管理の鍵をインポートする"
excerpt: "VaultサービスでVaultを作成し、暗号鍵の作成とインポートを行います。"
order: "120"
layout: single
tags:
 - intermediate
header:
 teaser: "/security/vault-setup/vault-setup02.png"
 overlay_image: "/security/vault-setup/vault-setup02.png"
 overlay_filter: rgba(34, 66, 55, 0.7)

---


OCI Vaultはユーザーがセキュアに暗号鍵や、パスワードなどの”シークレット”を管理、運用できる鍵管理サービスです。

通常、OCI上のストレージサービスは、デフォルトでオラクルが管理する暗号鍵で暗号化されます。
OCI Vaultサービスを使用すると、ストレージサービスの暗号化に使用する暗号鍵を、オラクル管理の暗号鍵からユーザー管理の暗号鍵に変更することができます。

また、OCI Vaultサービスを利用するメリットとして、OCI IAMや監査ログによるアクセス管理、FIPS 140-2 Security Level 3の要件への対応、ユーザーによる暗号鍵のローテーションやバックアップを実施することができる、などが挙げられます。

OCI Vaultサービスで管理できる暗号鍵の暗号化アルゴリズムなどの詳細は[ドキュメント](https://docs.oracle.com/ja-jp/iaas/Content/KeyManagement/Concepts/keyoverview.htm)をご参照ください。

本チュートリアルでは、ユーザー管理の暗号鍵を作成し、Vaultサービスへインポートする手順について紹介します。


**所要時間 :** 約20分

**前提条件 :**
+ OpenSSLをクライアント端末、もしくは任意のLinuxの環境にインストールしていること（本チュートリアルではデフォルトでOpenSSLがインストールされているCloud Shellを使用します）

**注意 :**
+ ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。

<br>


# 1. Vaultの作成

OCIコンソール → アイデンティティとセキュリティ → ボールト → 「ボールトの作成」ボタンをクリックします。

 ![画面ショット1](vault-setup01.png)


Vaultの作成画面で任意の名前を入力し、「ボールトの作成」ボタンをクリックします。
 
 ![画面ショット2](vault-setup02.png)

1~2分でボールトの作成が完了し、ステータスがアクティブになります。

<br>

# 2. 暗号鍵の作成とインポート

作成したボールトの詳細画面の「キーの作成」ボタンをクリックします。

 ![画面ショット3](vault-setup03.png)

「キーの作成」画面にて任意の名前を入力し、「外部キーのインポート」にチェックを入れます。

※キーのシェイプ、アルゴリズムはデフォルトのAES, 256ビットのまま進めます。
 
 ![画面ショット4](vault-setup04.png)


ラッピング・キー情報が表示されるので、「公開ラッピング・キー」をコピーします。

 ![画面ショット5](vault-setup05.png)

Cloud Shellなど、OpenSSLがインストールされている環境で公開ラッピング・キーをpemファイルとして保存します。

```
$ vi publickey.pem
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtaBn6sRcgMK8n+pN7KMj
tDXNWOBWi07dYu4yVucAD/HXd2PiE1b9EvwlIQvY1p6W0zD4ZQPA+jKXOmJ/Fpns
XS7MhSOuzeTtmQdg9lovzETP8oAVXvXYNtIZkywzOvcH62GyVJdNwP7WtNVEeYGV
MC2NoqSde5dn0tI64PQkLwyJSB6AMX2SGMw85DKXr/6oXhGXbZtulct3H/veD5yu
R9LFWDjfGh/TULLyHeg+4c75z8HSCL+1sv00ZHyktC+9+eym7L7Po1L/61poGxAQ
YbhvUKx2W6dTQBvzYKQ4tWMkFDIidNHQV3GnqTDA+cVKJAYVixh2HF6fR0P047vd
vQsW3e7twwC+gHYYTDL/NZvpbRyfH4lakEVtVhQM6bv2DAl6sDyXRxz/BzgOinga
S+2PmagF3AfF3cwhNsStC97hbGmVCk0fPlhvxsG977qD/sF+Aszq5vwWvAvAKz/C
U/y0zQuSClX6+JCsR2dZY6PTxk6YWBjugVVXQXm8xCUSmxKwCP36YMuLQkw5JcSL
JB5Zfw7If1ewP2Lqk7DbZr77dO5QqlOYTf58Uk8hAMMQVSni+UGDJQzXtNbeaxk4
PtoiGjDvp38b9VzAH+/w0bPWCyK55eqvtHqjCFGHtGuMbmjv1yd+gmDHv032ukWG
gpJ+zgur/GpC2rR+891hpxcCAwEAAQ==
-----END PUBLIC KEY-----
```

以下コマンドで暗号鍵を作成し、公開ラッピング・キーで暗号鍵をラッピングします。

```
$ openssl rand 32 > aes_key.bin
$ openssl pkeyutl -encrypt -in "aes_key.bin" -inkey "publickey.pem" -pubin -out "wrappedkey.bin" -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
```
ラッピングされた暗号鍵が「wrappedkey.bin」として出力されるので、ファイルをクライアント端末にダウンロードします。

※Cloud Shellの場合、ターミナル右上のメニュー → ダウンロードから、ホームディレクトリにある任意のファイルをダウンロードすることが出来ます。
 
 ![画面ショット11](vault-setup11.png)



「キーの作成」画面に戻り、外部キーのデータ・ソースから、「wrappedkey.bin」を選択し、「キーの作成」ボタンをクリックします。

※ラッピング・アルゴリズムはデフォルトの「RSA_OAEP_SHA256」のまま進めます。
 
 ![画面ショット6](vault-setup06.png)


以上の手順で暗号鍵の作成とインポートは完了です。
インポートした暗号鍵は「マスター暗号化キー」としてOCI Vaultサービスに格納されます。
