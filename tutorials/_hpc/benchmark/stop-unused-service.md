---
title: "不要サービス停止によるパフォーマンスチューニング方法"
excerpt: "計算リソースを極限まで使用するHPCワークロードの実行に於いては、些細な計算リソースを使用するOS常駐サービスがその性能に影響することがあります。特に高並列実行時は、HPCクラスタ内の1ノードでこのようなサービスが稼働していることで、そのスケーラビリティに影響を及ぼします。本パフォーマンス関連Tipsは、OS標準で稼働している常駐サービスの中でリソースを多く消費しているものを特定しこれを停止することで、OSレベルのパフォーマンスチューニングを実施する方法を解説します。"
order: "222"
layout: single
header:
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

計算リソースを極限まで使用するHPCワークロードの実行に於いては、些細な計算リソースを使用するOS常駐サービスがその性能に影響することがあります。  
特に高並列実行時は、HPCクラスタ内の1ノードでこのようなサービスが稼働していることで、そのスケーラビリティに影響を及ぼします。  
本パフォーマンス関連Tipsは、OS標準で稼働している常駐サービスの中でリソースを多く消費しているものを特定しこれを停止することで、OSレベルのパフォーマンスチューニングを実施する方法を解説します。

***
# 0. 概要

HPCワークロードの高並列実行に於けるスケーラビリティは、いわゆるOSジッターの影響を受けるため、不要なOS常駐サービスを停止することで、これを改善できる場合があります。  
ただこの場合、停止しようとするサービスは、以下の観点で事前に精査する必要があります。

- サービスの使用するリソースがどの程度か
- サービスの提供する機能が不要か

これらの調査を経て停止するサービスを特定したら、対象のサービスを停止し、HPCワークロードを実行します。

本テクニカルTipsは、HPCワークロード向けベアメタルシェイプ  **[BM.Optimized3.36](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm#bm-hpc-optimized)** と **Oracle Linux** 8ベースの **HPC[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を使用するインスタンスを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と共にデプロイするHPCクラスタを想定し、この計算ノードとしてのインスタンス上で不要サービスを停止することで、高並列時のスケーラビリティ向上を目的とするOSレベルのパフォーマンスチューニングを適用する方法を解説します。

以降の章は、本チューニングの工程に沿った以下構成となっています。

1. 不要サービス特定
2. 不要サービス停止
3. 不要サービス停止による効果確認

不要サービスの特定は、Linuxのプロセスアカウンティングを利用し、インスタンスデプロイ直後のワークロードを実行していない状態でCPUを使用しているプロセスを特定、このプロセスが提供する機能を考慮して不要サービスかどうかを判断、不要と判断したサービスを停止します。  
また不要サービスを停止した後、再度プロセスアカウンティング情報を取得し、その効果を確認します。

自身の利用するHPCクラスタが本テクニカルTipsの想定と同じシェイプ・OSの場合は、本テクニカルTipsと同じサービスを停止するだけでチューニングを適用することが出来るため、1章と3章は参照にとどめ2章の手順を適用します。  
これらが想定と異なる場合は、1章の手順から順次チューニングを進めます。この場合は、対象となる不要サービスが本テクニカルTipsと異なる可能性があるため、自身で特定した不要サービスに合わせた停止方法を適用します。

***
# 1. 不要サービス特定

本章は、 **BM.Optimized3.36** と **Oracle Linux** 8ベースの **HPC[クラスタネットワーキングイメージ](/ocitutorials/hpc/#5-13-クラスタネットワーキングイメージ)** を使用するインスタンスを **[クラスタ・ネットワーク](/ocitutorials/hpc/#5-1-クラスタネットワーク)** と共にデプロイし、このインスタンス上で動作する不要サービスを特定します。  
具体的には、以下の手順を実施します。

- 調査用HPCクラスタデプロイ
- 計算ノードでpsacctを起動
- アカウンティング情報取得
- 不要サービス特定

また、通常プライベートサブネットに接続される計算ノードでは、ファイアーウォールやSELinuxを不要と判断出来る場合もあるため、本テクニカルTipsではこれらも不要サービスとして扱います。

本章の調査により、本テクニカルTipsでは以下を不要サービスと判断しています。

- unified-monitoring-agent
- OSWatcher
- dnf-makecache.timer
- Oracle Cloud Agent
- ksplice
- firewalld
- SELinux

不要サービスの特定は、以下の手順を実施します。

1. 2ノードの **BM.Optimized3.36** を **クラスタ・ネットワーク** と共にデプロイし、調査用のHPCクラスタを構築します。

2. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、psacctサービスを起動、プロセスアカウンティングのデータファイルが生成されることを確認します。

    ```sh
    $ sudo systemctl start psacct
    $ ls -l /var/account
    -rw-r--r--. 1 root root 94144 Oct 25 17:17 /var/account/pacct
    ```

    プロセスアカウンティングのデータファイルは、logrotateが同じディレクトリに日付をファイル名として日時でローテーションします。  
    このため、psacctサービスを起動した翌々日早朝まで放置し、起動翌日丸一日分のアカウンティング情報（以下の例ではpsacctサービス起動日を2023年10月25日としてpacct-20231027）が作成されているのを確認します。

    ```sh
    $ ls -l /var/account/pacct*
    -rw------- 1 root root  5896896 Oct 27 10:29 /var/account/pacct
    -rw-r--r-- 1 root root  1069509 Oct 26 03:32 /var/account/pacct-20231026.gz
    -rw------- 1 root root 20381632 Oct 27 03:33 /var/account/pacct-20231027
    $ 
    ```

3. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、CPU時間を消費している上位10プロセスを特定します。

    ```sh
    $ sudo sa -ca /var/account/pacct-20231027 | head -11
      318463  100.00%  187274.65re  100.00%      11.25cp  100.00%         0avio      3484k
          73    0.02%       9.79re    0.01%       3.97cp   35.29%         0avio    109527k
        2881    0.90%     145.64re    0.08%       3.25cp   28.88%         0avio      1208k   pidstat
          16    0.01%       0.99re    0.00%       0.96cp    8.51%         0avio    114764k   dnf
        2881    0.90%      56.61re    0.03%       0.93cp    8.23%         0avio     13784k   top
        2881    0.90%     145.06re    0.08%       0.67cp    5.97%         0avio     10076k   nfsiostat
          46    0.01%       0.49re    0.00%       0.48cp    4.31%         0avio     17824k   rpm
        5768    1.81%       0.51re    0.00%       0.29cp    2.56%         0avio     11907k   ps
          92    0.03%      11.30re    0.01%       0.24cp    2.16%         0avio     32345k   python3
          96    0.03%       0.19re    0.00%       0.17cp    1.54%         0avio     45760k   ksplice
         361    0.11%       0.09re    0.00%       0.08cp    0.75%         0avio      1318k   gzip
    ```

4. ステップ3. の結果から、対象期間中に消費されたCPU時間のうち35％程度をコマンド名がブランクのプロセスが消費しており、このコマンドを実行した親プロセスを特定します。

    4-1. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、コマンド名がブランクのプロセスの親プロセスIDが1（Systemd）で20分程度の間隔で実行されていることから、Systemdタイマーから起動されていることを特定します。

    ```sh
    $ sudo lastcomm -f /var/account/pacct-20231027 --pid | grep "^ "
                    S   X root     __         3.27 secs Fri Oct 27 03:18 498400 1
                    S   X root     __         3.24 secs Fri Oct 27 02:54 493189 1
                    S   X root     __         3.23 secs Fri Oct 27 02:30 487892 1
                    S   X root     __         3.28 secs Fri Oct 27 02:12 483923 1
                    S   X root     __         3.25 secs Fri Oct 27 01:47 478360 1
                    S   X root     __         3.32 secs Fri Oct 27 01:29 474260 1
                    S   X root     __         3.24 secs Fri Oct 27 01:05 469067 1
                    S   X root     __         3.31 secs Fri Oct 27 00:46 464755 1
                    S   X root     __         3.24 secs Fri Oct 27 00:29 461089 1
                    S   X root     __         3.30 secs Fri Oct 27 00:13 457449 1
    :
    $
    ```

    4-2. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、このコマンドの実行間隔が15分以上の毎回異なる間隔で実行されていることから、このコマンドがunified-monitoring-agent_config_downloader.timerから実行されていることを特定します。

    ```sh
    $ for sct in `sudo systemctl list-units --type=timer | grep timer | awk '{print $1}'`; do echo $sct; sudo systemctl cat $sct | grep ^On; done
    mlocate-updatedb.timer
    OnCalendar=daily

    oci-cn-auth-renew.timer
    OnBootSec=15min
    OnUnitActiveSec=15min

    sysstat-collect.timer
    OnCalendar=*:00/10

    sysstat-summary.timer
    OnCalendar=00:07:00

    systemd-tmpfiles-clean.timer
    OnBootSec=15min
    OnUnitActiveSec=1d

    unbound-anchor.timer
    OnCalendar=daily

    unified-monitoring-agent_config_downloader.timer
    OnUnitInactiveSec=15min

    ```

    unified-monitoring-agentは、アプリケーションからの **カスタム・ログ** を収集するエージェントのため、不要サービスと判定します。

    自身の環境に於けるunified-monitoring-agentの要・不要は、OCI公式ドキュメントの **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/Logging/Concepts/agent_management.htm)** を参照してその判断を行ってください。

5. ステップ3. の結果から、対象期間中に消費されたCPU時間のうち30％程度をpidstatが消費しており、このコマンドを実行した親プロセスを特定します。

    5-1. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、pidstatの親プロセスがpidsubでその親プロセスIDが全て4164であることを特定します。

    ```sh
    $ sudo lastcomm -f /var/account/pacct-20231027 > lastcomm.out
    $ for pid in `awk '{if($1=="pidstat"){print $(NF)}}' ./lastcomm.out`; do awk -v awkpid=$pid '{if($(NF-1)==awkpid){print $0}}' ./lastcomm.out; done
    pidsub                 root     __         0.00 secs Fri Oct 27 03:32 501642 4164
    pidsub                 root     __         0.00 secs Fri Oct 27 03:32 501537 4164
    pidsub                 root     __         0.00 secs Fri Oct 27 03:31 501432 4164
    :
    ```

    5-2. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、プロセスID 4164がOSWatcherであることを特定します。

    ```sh
    $ ps -fe | grep 4164 | grep -v grep
    root        4164       1  0 Oct25 ?        00:00:27 /bin/sh /usr/sbin/OSWatcher 30 48 gzip /var/oled/oswatcher
    root      656005    4164  0 14:27 ?        00:00:00 sleep 30
    $
    ```

    OSwatcherは、パフォーマンス関連の問題が発生した際にこの原因を特定するための情報を定期的に収集するサービスのため、不要サービスと判定します。

    自身の環境に於けるOSwatcherの要・不要は、Oracle公式ドキュメントの **[ここ](https://support.oracle.com/knowledge/Oracle%20Cloud/301137_1.html)** を参照してその判断を行ってください。

    5-3. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し暫く出力を監視すると、上位10プロセスに含まれる以下のコマンドもOSwatcherから実行されていることがわかります。

    - top
    - nfsiostat

    ```sh
    $ while pstree 4164; do sleep 1; done
    OSWatcher───sleep
    :
    OSWatcher───sleep
    OSWatcher─┬─iosub───iostat
            ├─mpsub───mpstat
            ├─nfssub───nfsiostat
            ├─pidsub───pidstat
            ├─sleep
            ├─vmsub───vmstat
            └─xtop───top
    :
    ```

6. ステップ3. の結果から、対象期間中に消費されたCPU時間のうち10％程度をdnfが消費しており、このコマンドを実行した親プロセスを特定します。

    6-1. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、dnfの親プロセスIDが1（Systemd）でほぼ1時間ごとに実行されていることから、Systemdタイマーから起動されていることを特定します。

    ```sh
    $ sudo lastcomm -f /var/account/pacct-20231027 --command dnf --pid
    dnf              S     root     __         0.20 secs Fri Oct 27 02:52 492662 1
    dnf              S     root     __         1.97 secs Fri Oct 27 01:32 474918 1
    dnf              S     root     __         0.20 secs Thu Oct 26 23:33 448654 1
    dnf              S     root     __        20.50 secs Thu Oct 26 21:47 425144 1
    dnf              S     root     __         0.20 secs Thu Oct 26 20:20 405901 1
    dnf              S     root     __         0.20 secs Thu Oct 26 19:05 389283 1
    dnf              S     root     __         2.00 secs Thu Oct 26 17:38 369972 1
    dnf              S     root     __         0.20 secs Thu Oct 26 16:00 348306 1
    dnf              S     root     __         2.01 secs Thu Oct 26 14:15 325177 1
    dnf              S     root     __         0.20 secs Thu Oct 26 12:45 305419 1
    dnf              S     root     __         2.02 secs Thu Oct 26 10:45 278759 1
    dnf              S     root     __         0.20 secs Thu Oct 26 08:47 252620 1
    dnf              S     root     __         2.89 secs Thu Oct 26 07:44 238753 1
    dnf              S     root     __         0.20 secs Thu Oct 26 06:19 220160 1
    dnf              S     root     __         0.19 secs Thu Oct 26 05:06 203913 1
    dnf              S     root     __        24.27 secs Thu Oct 26 03:56 188468 1
    $
    ```

    6-2. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、dnfがdnf-makecache.timerから実行されていることを特定します。

    ```sh
    $ sudo systemctl list-units --type=timer | grep -i dnf
    dnf-makecache.timer                              loaded active waiting dnf makecache --timer
    ```

    dnf-makecache.timerは、有効なdnfレポジトリのパッケージメターデータを定期的に更新するために使用し、OSアップデート等のパッケージ管理は定期的なメンテナンス時に適用する運用を想定し、不要サービスと判定します。

    自身の環境に於けるdnf-makecacheの要・不要は、man dnfを参照してその判断を行ってください。

7. ステップ3. の結果から、対象期間中に消費されたCPU時間のうち4％程度をrpmが消費しており、このコマンドを実行した親プロセスを特定します。

    7-1. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、rpmの親プロセスがsudoでその親プロセスIDが29067であるることを特定します。

    ```sh
    $ for ppid in `for pid in \`awk '{if($1=="rpm"){print $(NF)}}' ./lastcomm.out\`; do awk -v awkpid=$pid '{if($(NF-1)==awkpid){print $(NF)}}' ./lastcomm.out; done`; do awk -v awkppid=$ppid '{if($(NF-1)==awkppid){print $0}}' ./lastcomm.out; done
    sudo             S     root     __         0.00 secs Fri Oct 27 03:28 500702 29067
    sudo             S     root     __         0.00 secs Fri Oct 27 03:13 497429 29067
    :
    $
    ```

    7-2. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、プロセスIDが29067のプロセスがoci-wlpでこれがOracle Cloud Agentから実行されていることを特定します。

    ```sh
    $ sudo lastcomm -f /var/account/pacct --pid | grep " 29067 "
    oci-wlp              X oracle-c __        32.54 secs Wed Oct 25 15:58 29067 28989
    $ ps -fe | grep oci-wlp | grep -v grep
    oracle-+  507754  507676  0 03:59 ?        00:00:04 /usr/libexec/oracle-cloud-agent/plugins/oci-wlp/oci-wlp
    $
    ```

    Oracle Cloud Agentは、インスタンスのパッケージ管理、ログ管理、モニタリング等を行うエージェントサービスで、これらの機能を使用しないことを前提に不要サービスと判定します。

    自身の環境に於けるOracle Cloud Agentの要・不要は、OCI公式ドキュメントの **[ここ](https://docs.oracle.com/ja-jp/iaas/Content/Compute/Tasks/manage-plugins.htm)** を参照してその判断を行ってください。

8. ステップ3. の結果から、対象期間中に消費されたCPU時間のうち2％程度をpython3が消費しており、このコマンドを実行した親プロセスを特定します。

    8-1. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、python3の親プロセスIDが1（Systemd）で15分ごとに実行されていることから、Systemdタイマーから起動されていることを特定します。

    ```sh
    $ sudo lastcomm -f /var/account/pacct-20231027 --command python3 --pid
    python3          S     root     __         0.16 secs Fri Oct 27 03:18 498396 1
    python3          S     root     __         0.15 secs Fri Oct 27 03:02 494964 1
    python3          S     root     __         0.15 secs Fri Oct 27 02:46 491325 1
    python3          S     root     __         0.16 secs Fri Oct 27 02:30 487888 1
    python3          S     root     __         0.16 secs Fri Oct 27 02:15 484575 1
    python3          S     root     __         0.16 secs Fri Oct 27 01:59 480999 1
    python3          S     root     __         0.16 secs Fri Oct 27 01:44 477602 1
    python3          S     root     __         0.16 secs Fri Oct 27 01:28 474124 1
    python3          S     root     __         0.16 secs Fri Oct 27 01:13 470840 1
    python3          S     root     __         0.16 secs Fri Oct 27 00:58 467365 1
    :
    $
    ```

    8-2. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、python3の実行間隔が15分であることから、このコマンドがoci-cn-auth-renew.timerから実行されていることを特定します。

    ```sh
    $ for sct in `sudo systemctl list-units --type=timer | grep timer | awk '{print $1}'`; do echo $sct; sudo systemctl cat $sct | grep ^On; done
    mlocate-updatedb.timer
    OnCalendar=daily

    oci-cn-auth-renew.timer
    OnBootSec=15min
    OnUnitActiveSec=15min

    sysstat-collect.timer
    OnCalendar=*:00/10

    sysstat-summary.timer
    OnCalendar=00:07:00

    systemd-tmpfiles-clean.timer
    OnBootSec=15min
    OnUnitActiveSec=1d

    unbound-anchor.timer
    OnCalendar=daily

    unified-monitoring-agent_config_downloader.timer
    OnUnitInactiveSec=15min

    ```

    oci-cn-auth-renew.timerは、 **クラスタ・ネットワーク** の802.1x認証を定期的に更新するサービスで、必要なサービスと判定します。

9. ステップ3. の結果から、対象期間中に消費されたCPU時間のうち2％程度をkspliceが消費しており、kspliceがOS稼働中にカーネル等のアップデートを適用するためのサービスであり、OSアップデート等のパッケージ管理は定期的なメンテナンス時に適用する運用を想定し、不要サービスと判定します。

    自身の環境に於けるkspliceの要・不要は、Oracle公式ドキュメントの **[ここ](https://docs.oracle.com/cd/F22978_01/ksplice-user/ol_ksabout.html#%E7%AC%AC1%E7%AB%A0-Oracle-Ksplice%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)** を参照してその判断を行ってください。

***
# 2. 不要サービス停止

本章は、先に不要と特定した以下サービスを停止します。

- unified-monitoring-agent
- OSWatcher
- dnf-makecache.timer
- Oracle Cloud Agent
- ksplice
- firewalld
- SELinux

不要サービスの停止は、以下の手順を実施します。

1. 以下コマンドを計算ノードのopcユーザで実行し、unified-monitoring-agentを停止します。

    ```sh
    $ sudo systemctl disable --now unified-monitoring-agent.service
    $ sudo systemctl disable --now unified-monitoring-agent_config_downloader.timer
    ```

2. 以下コマンドを計算ノードのopcユーザで実行し、OSwatcherを停止します。

    ```sh
    $ sudo systemctl disable --now oswatcher
    ```

3. 以下コマンドを計算ノードのopcユーザで実行し、dnf-makecacheを停止します。

    ```sh
    $ sudo systemctl disable --now dnf-makecache.timer
    ```

4. 以下コマンドを計算ノードのopcユーザで実行し、Oracle Cloud Agentを停止します。

    ```sh
    $ sudo systemctl disable --now oracle-cloud-agent
    $ sudo systemctl disable --now oracle-cloud-agent-updater
    ```

5. 以下コマンドを計算ノードのopcユーザで実行し、ksplice関連パッケージをアンインストールします。

    ```sh
    $ sudo dnf remove -y ksplice uptrack
    ```

6. 以下コマンドを計算ノードのopcユーザで実行し、ファイアーウォールを停止します。

    ```sh
    $ sudo systemctl disable --now firewalld
    ```

7. 以下コマンドを計算ノードのopcユーザで実行し、SELinuxを停止します。

    ```sh
    $ sudo setenforce 0
    $ sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
    ```

8. 以下コマンドを計算ノードのopcユーザで実行し、OSを再起動します。

    ```sh
    $ sudo shutdown -r now
    ```

9. OS起動後に、ここまでに停止した不要サービスが起動していないことを確認します。

***
# 3. 不要サービス停止による効果確認

本章は、先に不要サービスを停止した状態で取得したプロセスアカウンティング情報を基に、以下の手順でその効果を確認します。  
また、効果が確認できた不要サービスの停止を自身のHPCクラスタに適用します。

1. 不要サービスを停止した翌々日早朝まで放置し、停止した翌日一日分のアカウンティング情報（以下の例ではpacct-20231029）が作成されているのを確認します。

    ```sh
     $ ls -l /var/account/pacct*
    -rw------- 1 root root   34496 Oct 30 09:45 /var/account/pacct
    -rw-r--r-- 1 root root 1069509 Oct 26 03:32 /var/account/pacct-20231026.gz
    -rw------- 1 root root 2346813 Oct 27 03:33 /var/account/pacct-20231027.gz
    -rw------- 1 root root 1581661 Oct 28 03:48 /var/account/pacct-20231028.gz
    -rw------- 1 root root   16006 Oct 29 03:29 /var/account/pacct-20231029
    $ 
    ```

2. 以下コマンドを調査用HPCクラスタの計算ノードのopcユーザで実行し、CPU時間を消費している上位10プロセスを特定します。

    ```sh
    $ sudo sa -ca /var/account/pacct-20231029 | head -11
    1734  100.00%   44205.76re  100.00%       0.24cp  100.00%         0avio      9098k
      91    5.25%       1.26re    0.00%       0.24cp   97.23%         0avio     32319k   python3
     532   30.68%   44187.71re   99.96%       0.00cp    1.73%         0avio         0k   kworker/dying*
       1    0.06%       0.00re    0.00%       0.00cp    0.32%         0avio      1222k   sar
       1    0.06%       0.00re    0.00%       0.00cp    0.32%         0avio      2396k   updatedb
       3    0.17%       0.60re    0.00%       0.00cp    0.19%         0avio     22352k   systemd
       2    0.12%       0.09re    0.00%       0.00cp    0.19%         0avio      3726k   bash
       3    0.17%       0.00re    0.00%       0.00cp    0.06%         0avio      6485k   tclsh
     267   15.40%       0.00re    0.00%       0.00cp    0.00%         0avio     19760k   systemd-cgroups
     187   10.78%       0.00re    0.00%       0.00cp    0.00%         0avio     20544k   systemctl
     145    8.36%       0.00re    0.00%       0.00cp    0.00%         0avio      2630k   sadc
    ```

    不要サービスを停止する前の結果と比較し、停止したサービスによるCPU時間の消費が無いことを確認します。  
    本テクニカルTipsの環境では、今回のサービス停止で1日当たり約11秒（11.25秒 - 0.24秒）の不要サービスによるCPU消費を抑えられることが確認できました。