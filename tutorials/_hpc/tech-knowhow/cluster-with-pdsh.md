---
title: "pdshで効率的にクラスタ管理オペレーションを実行"
excerpt: "ノード数が多くなるHPC/GPUクラスタは、クラスタに含まれるノードに対して様々な管理オペレーションを実施する必要があります。この時、これらのオペレーションを実現するためのコマンドを全てのノードに適用する際、どのような方法が効果的でしょうか。本テクニカルTipsは、pdshを使用して計算/GPUクラスタの管理オペレーションを効率的に実施する方法を解説します。"
order: "335"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

***
# 0. 概要

HPC/GPUクラスタの運用管理を任されるシステム管理者は、管理するクラスタに含まれる計算/GPUノードに対して、以下のような管理オペレーションを実施する必要が頻繁に発生します。

- OSアップデートを全計算/GPUノードに適用する
- 新たに使用することになったアプリケーションを全計算/GPUノードにインストールする
- メンテナンス作業に伴い全計算/GPUノードをシャットダウン/リブートする
- 運用方針変更に伴い全計算/GPUノードでOSやアプリケーションの設定ファイルを置き換える
- 一部の計算/GPUノードで他ノードと挙動が異なるためインストールされているRPMのバージョンを全計算/GPUノードで調査する

これらのオペレーションは、全計算/GPUノードに対してsudoで管理者に昇格可能なユーザ（ **Oracle Linux** では **opc** ）でパスフレーズ無しSSH接続可能なクラスタ管理ノードを用意し、このノードから実施するのが一般的です。  
この場合、予め管理対象ノードのホスト名を記載したホストリストファイルとbashのforループを組合せたコマンドをクラスタ管理ノードから実行することで、一回のコマンド発行で所望のオペレーションを実施することが可能です。

OSアップデートを管理対象ノードに適用するケースでは、以下のコマンドをクラスタ管理ノードからopcユーザで実行します。

```sh
$ for hname in `cat hostlist.txt`; do echo $hname; ssh $hname "sudo dnf upgrade --refresh"; done
```

ただこの場合、OSアップデートをホストリストファイルに記載された管理対象ノードに対して1ノードづつ順次適用するため、1ノード当たりの所要時間のノード数分の時間がかかります。  
また、アップデートの適用が正しく全ノードに適用されたかを確認する場合、大量に出力されるOSアップデートからのコマンド出力を、ノード数分確認する必要が生じます。

また、インストールされているRPMのバージョンを管理対象ノードで調査するケースでは、以下のコマンドをクラスタ管理ノードからopcユーザで実行します。

```sh
$ for hname in `cat hostlist.txt`; do echo $hname; ssh $hname "sudo dnf list openssh-server"; done
```

ただこの場合、全てのノードで指定したRPMが想定するバージョンになっているかを確認するため、ノード数分の出力を全て確認する必要が生じます。

また、管理対象ノードが異なるシステム構成の複数のグループからなり、コマンド実行対象ノードを特定のグループに限定する場合、何らかの工夫が必要になります。

**[pdsh](https://github.com/chaos/pdsh)** は、このような課題を解決する以下の機能を持っています。

- 管理対象ノードに並列にコマンドを実行
- 管理対象ノードからのコマンド出力が同一だった場合これをグルーピングして出力（ユーティリティーツール **dshbak** の機能）
- 管理対象ノードをグループ分けしグループ名で指定
- クラスタ管理ノードから管理対象ノードに並列にファイルを転送（ユーティリティーツール **pdcp** の機能）
- 管理対象ノードからクラスタ管理ノードに並列にファイルを転送（ユーティリティーツール **rpdcp** の機能）

**pdsh** は、クラスタ管理ノードから管理対象ノードに対してSSHでコマンドを発行するため、パスフレーズ無しでSSHコマンドを実行できるよう事前にセットアップする必要があります。また管理オペレーションは、通常管理者権限を必要とするため、このパスフレーズ無しで実行するSSHコマンドは、管理者権限を持つユーザから実行するか、sudoコマンドでパスワードを入力することなく管理者に昇格できるユーザから実行する必要があります。  
本テクニカルTipsでは、クラスタ管理ノードと管理対象ノードのOSに **Oracle Linux** を使用し、クラスタ管理ノードから管理対象ノードにopcユーザ（sudoで管理者権限昇格が可能なユーザ）でパスフレーズ無しでSSHコマンドを実行できる環境を前提としています。  
この環境は、 **[OCI HPCチュートリアル集](/ocitutorials/hpc/#1-oci-hpcチュートリアル集)** の **[HPCクラスタ](/ocitutorials/hpc/#1-1-hpcクラスタ)** カテゴリや **[機械学習環境](/ocitutorials/hpc/#1-2-機械学習環境)** カテゴリに含まれるチュートリアルを元に構築するHPC/GPUクラスタに於いては、クラスタ管理ノードに相当するBastionノードのopcユーザから管理対象ノードに相当する計算/GPUノードにパスフレーズ無しでSSHコマンドが実行できるよう構築されるため、改めて実施する必要はありません。

以降では、 **pdsh** をインストール・セットアップし、管理対象ノード数の多いクラスタで有効な典型的なクラスタ管理オペレーションを **pdsh** で効率的に実行する方法を、以下のステップで解説します。

1. **pdsh** インストール・セットアップ
2. **pdsh** 使用時の留意点
3. **pdsh** を使った代表的なクラスタ管理オペレーション

***
# 1. pdshインストール・セットアップ

本章は、 **pdsh** をインストール・セットアップします。

**pdsh** は、管理対象ノードを指定する際、これらノードの名前解決可能なホスト名を1行に1ノード含む、以下のようなホストリストファイルを使用することが出来ますが、

```sh
inst-f5fra-x9-ol8
inst-3ktpe-x9-ol8
inst-6pvpq-x9-ol8
inst-dixqy-x9-ol8
```

本テクニカルTipsでもこの管理対象ノード指定方法を使用するため、 **[OCI HPCテクニカルTips集](/ocitutorials/hpc/#3-oci-hpcテクニカルtips集)** の **[計算/GPUノードのホスト名リスト作成方法](/ocitutorials/hpc/tech-knowhow/compute-host-list/)** を参照してこれを作成し、クラスタ管理ノードのopcユーザのホームディレクトリにファイル名 **hostlist.txt** で配置します。

次に、以下コマンドをクラスタ管理ノードのopcユーザで実行し、 **pdsh** を提供するyumレポジトリを追加します。  
この際、クラスタ管理ノードの **Oracle Linux** バージョンに応じて実行するコマンドが異なる点に注意します。

```sh
$ sudo yum-config-manager --enable ol8_developer_EPEL # If Oracle Linux 8
$ sudo yum-config-manager --enable ol9_developer_EPEL # If Oracle Linux 9
```

次に、以下コマンドをクラスタ管理ノードのopcユーザで実行し、 **pdsh** をインストールします。

```sh
$ sudo dnf install -y pdsh pdsh-rcmd-ssh pdsh-mod-dshgroup
```

次に、以下コマンドをクラスタ管理ノードのopcユーザで実行し、 **pdsh** の環境変数を設定します。

```sh
$ echo "export PDSH_SSH_ARGS_APPEND=\"-o StrictHostKeyChecking=accept-new\"" | tee -a ~/.bash_profile
$ source ~/.bash_profile
```

ここでは、環境変数 **PDSH_SSH_ARGS_APPEND** を使用し、 **pdsh** が内部で使用しているSSHにオプション **StrictHostKeyChecking** を **accept-new** で設定します。  
これにより、管理対象ノードがSSHのホストキー登録ファイル（**known_hosts**）に存在しない場合、自動的にこれを登録します。

次に、以下コマンドをクラスタ管理ノードのopcユーザで実行し、 **pdsh** の動作を確認します。  
この際、先の環境変数の設定により、 **pdsh** の初回実行時に以下の最初の4行のようなメッセージが出力され、管理対象ノードがホストキー登録ファイルに登録されます。

```sh
$ pdsh -w ^/home/opc/hostlist.txt date
inst-f5fra-x9-ol8: Warning: Permanently added 'inst-f5fra-x9-ol8,10.0.2.37' (ECDSA) to the list of known hosts.
inst-dixqy-x9-ol8: Warning: Permanently added 'inst-dixqy-x9-ol8,10.0.2.37' (ECDSA) to the list of known hosts.
inst-3ktpe-x9-ol8: Warning: Permanently added 'inst-3ktpe-x9-ol8,10.0.2.37' (ECDSA) to the list of known hosts.
inst-6pvpq-x9-ol8: Warning: Permanently added 'inst-6pvpq-x9-ol8,10.0.2.37' (ECDSA) to the list of known hosts.
inst-f5fra-x9-ol8: Fri Jul 28 16:04:47 JST 2023
inst-dixqy-x9-ol8: Fri Jul 28 16:04:47 JST 2023
inst-3ktpe-x9-ol8: Fri Jul 28 16:04:47 JST 2023
inst-6pvpq-x9-ol8: Fri Jul 28 16:04:47 JST 2023
$
```

**pdsh** の出力は、第一フィールドが対象ノードのホスト名、第2フィールド以降が対象ノードからのコマンド出力です。

次に、 **pdsh** で利用するグループを登録するため、グループ設定ファイルを作成します。  
このグループ設定ファイルは、事前にクラスタ管理ノードのopcユーザのホームディレクトリにファイル名 **hostlist.txt** で作成したホストリストファイルを基に作成する、 **.dsh/group** ディレクトリに配置されるグループ名をファイル名とするテキストファイルです。  
例えば以下のファイルを配置すると、全てのノードを含むグループ **all** 、inst-f5fra-x9-ol8とinst-3ktpe-x9-ol8を含むグループ **comp1**、及びinst-6pvpq-x9-ol8とinst-dixqy-x9-ol8を含むグループ **comp2** を利用できるようになります。

```sh
$ cat ~/.dsh/group/all
inst-f5fra-x9-ol8
inst-3ktpe-x9-ol8
inst-6pvpq-x9-ol8
inst-dixqy-x9-ol8
$ cat ~/.dsh/group/comp1
inst-f5fra-x9-ol8
inst-3ktpe-x9-ol8
$ cat ~/.dsh/group/comp2
inst-6pvpq-x9-ol8
inst-dixqy-x9-ol8
$
```

これらのグループは、以下のように **-g** オプションと共に管理対象ノードを指定する際に利用することが出来ます。

```sh
$ pdsh -g all date
inst-f5fra-x9-ol8: Fri Jul 28 16:04:47 JST 2023
inst-dixqy-x9-ol8: Fri Jul 28 16:04:47 JST 2023
inst-3ktpe-x9-ol8: Fri Jul 28 16:04:47 JST 2023
inst-6pvpq-x9-ol8: Fri Jul 28 16:04:47 JST 2023
$
```

また、グループ内の特定のノードのみ対象から除外する場合は、以下のように **-x** オプションと共に除外するノードを指定します。

```sh
$ pdsh -g all -x inst-6pvpq-x9-ol8 date
inst-f5fra-x9-ol8: Fri Jul 28 16:04:47 JST 2023
inst-dixqy-x9-ol8: Fri Jul 28 16:04:47 JST 2023
inst-3ktpe-x9-ol8: Fri Jul 28 16:04:47 JST 2023
$
```

クラスタ管理ノードと管理対象ノードの間で並列にファイル転送を行うユーティリティーツールの **pdcp** や **rpdcp** を使用する場合、管理対象ノードにも **pdsh** がインストールされている必要があるため、以下コマンドをクラスタ管理ノードのopcユーザで実行し、全ての管理対象ノードに **pdsh** をインストールします。  
この際、管理対象ノードの **Oracle Linux** バージョンに応じて実行するコマンドが異なる点に注意します。

```sh
$ pdsh -w ^/home/opc/hostlist.txt sudo yum-config-manager --enable ol8_developer_EPEL # If Oracle Linux 8
$ pdsh -w ^/home/opc/hostlist.txt sudo yum-config-manager --enable ol9_developer_EPEL # If Oracle Linux 9
$ pdsh -w ^/home/opc/hostlist.txt sudo dnf install -y pdsh pdsh-rcmd-ssh
```

***
# 2. pdsh使用時の留意点

## 2-0. 概要

本章は、 **pdsh** を使用する際の留意点を解説します。

## 2-1. 複数のコマンドを纏めて一度のpdshで実行する場合

管理対象ノードに対して複数のコマンドを一度の **pdsh** で実行する場合、これらのコマンド群を以下のように **'** （シングルクォート）で囲みます。

```sh
$ pdsh -g all 'date; hostname'
inst-f5fra-x9-ol8: Fri Jul 28 16:56:45 JST 2023
inst-f5fra-x9-ol8: inst-f5fra-x9-ol8
inst-3ktpe-x9-ol8: Fri Jul 28 16:56:45 JST 2023
inst-6pvpq-x9-ol8: Fri Jul 28 16:56:45 JST 2023
inst-3ktpe-x9-ol8: inst-3ktpe-x9-ol8
inst-6pvpq-x9-ol8: inst-6pvpq-x9-ol8
inst-dixqy-x9-ol8: Fri Jul 28 16:56:45 JST 2023
inst-dixqy-x9-ol8: inst-dixqy-x9-ol8
```

## 2-2. 管理対象ノードからのコマンド出力順序  

**pdsh** は、管理対象ノードに対して並列にコマンドを発行しますが、これらのコマンド出力が表示される順序は、クラスタ管理ノードに到着した順になります。

このため、コマンド出力が複数行に亘る場合、異なる管理対象ノードの出力が以下のように入り乱れる状況が発生します。

```sh
$ pdsh -g all 'hostname; sleep 1; hostname'
inst-3ktpe-x9-ol8: inst-3ktpe-x9-ol8
inst-f5fra-x9-ol8: inst-f5fra-x9-ol8
inst-dixqy-x9-ol8: inst-dixqy-x9-ol8
inst-6pvpq-x9-ol8: inst-6pvpq-x9-ol8
inst-f5fra-x9-ol8: inst-f5fra-x9-ol8
inst-3ktpe-x9-ol8: inst-3ktpe-x9-ol8
inst-dixqy-x9-ol8: inst-dixqy-x9-ol8
inst-6pvpq-x9-ol8: inst-6pvpq-x9-ol8
```

このような状況が問題となる場合、 **pdsh** の特徴である並列実行を敢えて無効化し、ホスト名の昇順に管理対象ノードにコマンドを発行することが出来ます。  
これは、 **pdsh** の並列実行数を制御するオプション **-f** に **1** を指定し、以下のように実行します。  
なおデフォルトの並列実行数は、 **32** です。

```sh
$ pdsh -g all -f 1 'hostname; sleep 1; hostname'
inst-3ktpe-x9-ol8: inst-3ktpe-x9-ol8
inst-3ktpe-x9-ol8: inst-3ktpe-x9-ol8
inst-6pvpq-x9-ol8: inst-6pvpq-x9-ol8
inst-6pvpq-x9-ol8: inst-6pvpq-x9-ol8
inst-dixqy-x9-ol8: inst-dixqy-x9-ol8
inst-dixqy-x9-ol8: inst-dixqy-x9-ol8
inst-f5fra-x9-ol8: inst-f5fra-x9-ol8
inst-f5fra-x9-ol8: inst-f5fra-x9-ol8
```

**-f 1** オプションを付与した場合の管理対象ノードへのコマンド発行順序は、ホストリストファイルに於ける出現順ではなく、ホスト名のアルファベット順です。

## 2-3. 管理対象ノードがレスポンスしない場合

管理対象ノードが障害等でSSHのコマンド要求に応じられない場合は、当然 **pdsh** の実行も問題の管理対象ノードのところで停止します。  
この場合、通常のコマンド同様 **Ctrl-C** を使用して **pdsh** の実行を停止させることが出来ますが、これには1秒以内の間隔で二度連続して **Ctrl-C** を入力します。  
一度だけ **Ctrl-C** を入力した場合は、その時点で反応が無くレスポンスを待っていた管理対象ノードのホスト名を表示し、コマンドの実行を継続します。  

[一度だけ **Ctrl-C** を入力した場合]
  
```sh
$ pdsh -g all sleep 60
^Cpdsh@bastion: interrupt (one more within 1 sec to abort)
pdsh@bastion:  (^Z within 1 sec to cancel pending threads)
pdsh@bastion: inst-f5fra-x9-ol8: command in progress
pdsh@bastion: inst-3ktpe-x9-ol8: command in progress
pdsh@bastion: inst-6pvpq-x9-ol8: command in progress
pdsh@bastion: inst-dixqy-x9-ol8: command in progress
```

[1秒以内に二度連続して **Ctrl-C** を入力した場合]

```sh
$ pdsh -g all sleep 60
^Cpdsh@bastion: interrupt (one more within 1 sec to abort)
pdsh@bastion:  (^Z within 1 sec to cancel pending threads)
pdsh@bastion: inst-f5fra-x9-ol8: command in progress
pdsh@bastion: inst-3ktpe-x9-ol8: command in progress
pdsh@bastion: inst-6pvpq-x9-ol8: command in progress
pdsh@bastion: inst-dixqy-x9-ol8: command in progress
^Csending SIGTERM to ssh inst-f5fra-x9-ol8
sending signal 15 to inst-f5fra-x9-ol8 [ssh] pid 49061
sending SIGTERM to ssh inst-3ktpe-x9-ol8
sending signal 15 to inst-3ktpe-x9-ol8 [ssh] pid 49062
sending SIGTERM to ssh inst-6pvpq-x9-ol8
sending signal 15 to inst-6pvpq-x9-ol8 [ssh] pid 49063
sending SIGTERM to ssh inst-dixqy-x9-ol8
sending signal 15 to inst-dixqy-x9-ol8 [ssh] pid 49064
pdsh@bastion: interrupt, aborting.
$
```

## 2-4. 標準入力からの入力を求めるコマンドを実行する場合

コマンド実行を継続するかどうかといった、インタラクティブに標準入力からの指示を求めるコマンドの **pdsh** からの実行は、この指示をクラスタ管理ノードの標準入力から管理対象ノードに渡すことが出来ないため、そのままではこれを実行することが出来ません。  
この場合、これらコマンドへの指示をオプションで指定することが可能であれば、これを使用することで問題を回避することが可能です。  
RPMパッケージをインストールするdnfコマンドは、このための **-y** オプションを用意しており、以下のようにこの問題を回避することが出来ます。

```sh
$ pdsh -g all 'sudo dnf install -y httpd'
```

また、以下のようにパイプを介して当該コマンドの標準入力に指示を渡すことで、これを回避することも出来ます。
  
```sh
$ pdsh -g all 'echo yes | sudo dnf install httpd'
```

***
# 3. pdshを使った代表的なクラスタ管理オペレーション

## 3-0. 概要

本章は、管理対象ノード数の多いクラスタの管理オペレーションに於いて、 **pdsh** が威力を発揮する代表的な場面を想定し、 **pdsh** の具体的な利用方法を紹介します。

## 3-1. 所要時間の長い管理オペレーションを並列に実行

ノード当たりの所要時間が長い管理オペレーションを多数の管理対象ノードに対して実行する場面は、 **pdsh** の並列実行機能がその威力を発揮します。  
例えば、OSをアップデートする場合、アップデートするパッケージの数によっては数十分の所要時間が必要になりますが、これをシェルのforループ等で順次適用することは、管理対象ノード数が100ノードを超えるようなクラスタでは非現実的です。

この場合、以下コマンドをクラスタ管理ノードのopcユーザで実行します。

```sh
$ pdsh -g all sudo dnf upgrade --refresh
```

なお **pdsh** の並列実行数は、 **-f** オプションで変更することが出来、デフォルトの32より大きなサイズのクラスタで全管理対象ノードに一斉にアップデートを行う場合は、以下のように実行します。

```sh
$ pdsh -g all -f 128 sudo dnf upgrade --refresh
```

但しこのOSアップデートのように、実行するコマンドからの出力が多くなる場合は、全ての管理対象ノードでコマンドが正常に完了したかどうかの判断が難しくなるため、以降で説明するような別の工夫が必要です。

## 3-2. 管理対象ノードからの異なるコマンド出力を効果的に判別

管理対象ノードが多数のクラスタでコマンドの出力を精査する必要がある場合、 **pdsh** に含まれるユーティリティーツール **dshbak** がその威力を発揮します。  
例えば、OSバージョンが全ての管理対象ノードで想定しているバージョンになっているかを調べる場合、100ノードを超えるノードの中から1ノードだけが異なるバージョンとなっているケースでは、全ての出力を目視で確認することは、非現実的です。

この場合、以下コマンドをクラスタ管理ノードのopcユーザで実行します。

```sh
$ pdsh -g all grep PRETTY /etc/os-release | dshbak -c
----------------
inst-1phjn-x9-ol8,inst-iwhce-x9-ol8,inst-ot9zd-x9-ol8
----------------
PRETTY_NAME="Oracle Linux Server 8.7"
----------------
inst-lzgde-x9-ol8
----------------
PRETTY_NAME="Oracle Linux Server 7.9"
```

上記の例は、全対象ノードの中で1ノード（inst-lzgde-x9-ol8）だけOSバージョンが異なっており、これを容易に判別することが可能です。

また、標準エラー出力を含めて管理対象ノードのコマンド出力を判別する場合、以下コマンドをクラスタ管理ノードのopcユーザで実行します。

```sh
$ pdsh -g all 'ls /tmp/hosts 2>&1' | dshbak -c
pdsh@bastion: inst-odzeg-x9-ol8: ssh exited with exit code 2
----------------
inst-cnspy-x9-ol8,inst-dw5fd-x9-ol8,inst-slz8n-x9-ol8
----------------
/tmp/hosts
----------------
inst-odzeg-x9-ol8
----------------
ls: cannot access '/tmp/hosts': No such file or directory
```

上記の例は、全対象ノードの中で1ノード（inst-odzeg-x9-ol8）だけコマンドがエラーしており、これを容易に判別することが可能です。

また、OSアップデートが正常に完了したかどうかを確認する場合等、コマンド出力を無視してコマンドのリターンコードのみを確認する場合、以下コマンドをクラスタ管理ノードのopcユーザで実行します。

```sh
$ pdsh -g all 'sudo dnf upgrade --refresh > /dev/null 2>&1; echo $?' | dshbak -c
----------------
inst-slz8n-x9-ol8
----------------
-1
----------------
inst-cnspy-x9-ol8,inst-dw5fd-x9-ol8,inst-odzeg-x9-ol8
----------------
0
```

上記の例は、全対象ノードの中で1ノード（inst-slz8n-x9-ol8）だけOSアップデートに失敗しており、これをリターンコードから容易に判別しています。

また **dshbak** は、クラスタ管理ノードの指定したディレクトリに、管理対象ノードからの出力をそのホスト名をファイル名として格納する機能があり、この場合以下のように実行します。

```sh
$ pdsh -g all 'sudo dnf install -y mysql' | dshbak -d .
$ ls -l
total 16
-rw-rw-r--. 1 opc opc 2504 Aug  1 11:56 inst-cnspy-x9-ol8
-rw-rw-r--. 1 opc opc 2504 Aug  1 11:56 inst-dw5fd-x9-ol8
-rw-rw-r--. 1 opc opc 2504 Aug  1 11:56 inst-odzeg-x9-ol8
-rw-rw-r--. 1 opc opc 2504 Aug  1 11:56 inst-slz8n-x9-ol8
```

## 3-3. クラスタ管理ノード・管理対象ノード間で並列にファイル転送

**pdsh** は、クラスタ管理ノードと管理対象ノード間で並列にファイルを転送するためのユーティリティとして、以下2個のコマンドを提供します。

- **pdcp**: クラスタ管理ノードから管理対象ノードに並列にファイル転送
- **rpdcp**: 管理対象ノードからクラスタ管理ノードに並列にファイル転送

クラスタ管理ノードのファイル **/etc/hosts** を全ての管理対象ノードの **/tmp** にコピーするには、以下コマンドをクラスタ管理ノードのopcユーザで実行します。

```sh
$ pdcp -g all /etc/hosts /tmp
```

なお **pdcp** は、sudoによる権限昇格を適用することが出来ないため、上記例で直接管理対象ノードの **/etc/hosts** ファイルを上書きすることが出来ません。  
この場合、以下のように **pdsh** コマンドを併用してこれを実現することが可能です。

```sh
$ pdcp -g all /etc/hosts /tmp
$ pdsh -g all sudo cp /tmp/hosts /etc/
```

また、全ての管理対象ノードのファイル **/etc/hosts** をクラスタ管理ノードのカレントディレクトリにコピーするには、以下コマンドをクラスタ管理ノードのopcユーザで実行します。

```sh
$ rpdcp -g all /etc/hosts .
$ ls -l
total 16
-rw-r--r--. 1 opc opc 230 Aug  1 15:49 hosts.inst-cnspy-x9-ol8
-rw-r--r--. 1 opc opc 231 Aug  1 15:49 hosts.inst-dw5fd-x9-ol8
-rw-r--r--. 1 opc opc 230 Aug  1 15:49 hosts.inst-odzeg-x9-ol8
-rw-r--r--. 1 opc opc 231 Aug  1 15:49 hosts.inst-slz8n-x9-ol8
```

このように **rpdcp** は、コピーするファイル名に管理対象ノードのホスト名を付与したファイル名で、クラスタ管理ノードに全管理対象ノードのファイルをコピーします。

先の **pdcp** と同様 **rpdcp** は、sudoによる権限昇格を適用することが出来ないため、管理者にのみ読み取り権限が付与された管理対象ノードのファイルをクラスタ管理ノードにコピーすることが出来ません。  
この場合、以下のように **pdsh** コマンドを併用してこれを実現することが可能です。

```sh
$ pdsh -g all 'sudo cp /var/log/messages /tmp/; sudo chmod 644 /tmp/messages'
$ rpdcp -g all /tmp/messages .
$ ls -la
total 1964
drwxrwxr-x. 2 opc opc    142 Aug  1 15:57 .
drwx------. 4 opc opc   4096 Aug  1 11:54 ..
-rw-r--r--. 1 opc opc 495260 Aug  1 15:57 messages.inst-cnspy-x9-ol8
-rw-r--r--. 1 opc opc 543331 Aug  1 15:57 messages.inst-dw5fd-x9-ol8
-rw-r--r--. 1 opc opc 478356 Aug  1 15:57 messages.inst-odzeg-x9-ol8
-rw-r--r--. 1 opc opc 484193 Aug  1 15:57 messages.inst-slz8n-x9-ol8
```

また **pdcp** と **rpdcp** は、cpコマンドと同様、ファイルの日付とモードを保持する **-p** オプションと、ディレクトリを階層的にコピーする **-r** オプションをサポートします。