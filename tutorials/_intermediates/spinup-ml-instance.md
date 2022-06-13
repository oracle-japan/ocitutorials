---
title: "GPUインスタンスで機械学習にトライ"
excerpt: "OCIのGPUインスタンスで機械学習にトライしてみましょう。このチュートリアルを終了すると、TensorFlowやJupiter Notebook等の代表的な機械学習関連ソフトウェアがインストールされた、機械学習環境に最適なNvidia製GPU搭載のインスタンスを構築し、サンプル機械学習プログラムを実行することが出来るようになります。"
order: "098"
layout: single
header:
  teaser: "/intermediates/spinup-ml-instance/architecture_diagram.png"
  overlay_image: "/intermediates/spinup-ml-instance/architecture_diagram.png"
  overlay_filter: rgba(34, 66, 55, 0.7)
#link: https://community.oracle.com/tech/welcome/discussion/4474261/
---

Oracle Cloud Infrastructure（以降OCIと記載）は、GPUを搭載するVMやベアメタルの様々なシェイプが用意されており、自身の機械学習ニーズに合った機械学習環境を構築するには最適なクラウドサービスです。

このチュートリアルは、NVIDIA GPUドライバソフトウェアやCUDAを内包するOCIのプラットフォームイメージを利用し、以下構成の機械学習環境を構築、TensorFlowを利用するサンプル機械学習プログラムをJupiter Notebookから実行します。
- 選択可能な機械学習環境GPUシェイプ
  - VM.GPU3.1 (NVIDIA Tesla V100 16 GB x 1)
  - VM.GPU3.2 (NVIDIA Tesla V100 16 GB x 2)
  - VM.GPU3.4 (NVIDIA Tesla V100 16 GB x 4)
  - BM.GPU3.8 (NVIDIA Tesla V100 16 GB x 8)
  - BM.GPU4.8 (NVIDIA A100 40 GB x 8)

  ※：シェイプ詳細は、以下URLを参照。
  [https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm](https://docs.oracle.com/ja-jp/iaas/Content/Compute/References/computeshapes.htm)
- 利用可能な機械学習関連ソフトウェア
  - TensorFlow
  - Keras
  - NumPy
  - Matplotlib
  - Jupyter Notebook
  - and more （※）

  ※：全リストは、 **4. 機械学習関連インストール済みソフトウェア確認** を参照下さい。またその他の機械学習関連ソフトウェアは、pipでインストールすることが出来ます。

![システム構成図](architecture_diagram.png)

この機械学習環境は、環境構築直後からTensorFlowを利用し機械学習プログラムをGPU上で高速に実行することが可能になります。

またマルチGPUを搭載するGPUシェイプを利用することで、Distributed TensorFlowを使用した複数のGPUに跨る分散トレーニングが可能となります。このチュートリアルの後半では、マルチGPUを搭載する機械学習環境で、Distributed TensorFlowのサンプル機械学習プログラムを実行します。

**所要時間 :** 約45分

**前提条件 :** 機械学習環境を構築するインスタンスを収容するコンパートメント(ルート・コンパートメントでもOKです)の作成と、このコンパートメントに対する必要なリソース管理権限がユーザーに付与されていること。

**注意1 :** 現在、一時的に無償トライアル環境でのGPUインスタンスの利用を制限させて頂いています。そのため、現在このチュートリアルの手順を実施するには、商用のOCI契約が必要になります。

**注意2 :** チュートリアル内の画面ショットについては、OCIの現在のコンソール画面と異なっている場合があります。また使用する機械学習環境構築用イメージのバージョンが異なる場合も、チュートリアル内の画面ショットが異なる場合があります。

# 1. GPUインスタンスの起動

本章は、OCIコンソールからGPUインスタンスを起動します。このチュートリアルで使用するプラットフォームイメージは、Oracle Linux 7.9をベースとしたGen2-GPU-2022.05.31-0です。

本チュートリアルは、GPUインスタンスにNVIDIA Tesla V100 16 GBを2枚搭載するVMシェイプのVM.GPU3.2を使用します。

1. OCIコンソールにログインし、GPUインスタンスを起動するリージョンを選択後、 **コンピュート** → **インスタンス** とメニューを辿ります。

2. 表示される以下画面で、**インスタンスの作成** ボタンをクリックします。

   ![画面ショット](console_page00.png)

3. 表示される **コンピュート・インスタンスの作成** 画面で、以下の情報を入力し **作成** ボタンをクリックします。なお、ここに記載のないフィールドは、デフォルトのままとします。

   3.1 **名前** フィールド：GPUインスタンスに付与する名前

   ![画面ショット](console_page01.png)

   3.2 **コンパートメントに作成** フィールド：GPUインスタンスを構築するコンパートメント

   ![画面ショット](console_page01-1.png)

   3.3 **配置** フィールド
    - **可用性ドメイン :** ：GPUインスタンスを構築する可用性ドメイン

   ![画面ショット](console_page02.png)

   3.4 **イメージとシェイプ** フィールド

   ![画面ショット](console_page03.png)

    - **イメージ** ：Oracle Linux 7.9 Gen2-GPU-2022.05.31-0 (**イメージの変更** ボタンをクリックして表示される **すべてのイメージの参照** サイドバーでOracle Linuxのバージョンを適切に選択後 **イメージの選択** ボタンをクリック）

   ![画面ショット](console_page03-1.png)

    - **Shape** ：VM.GPU3.2 (**Change Shape** ボタンをクリックして表示される **すべてのシェイプの参照** サイドバーで **仮想マシン** → **専門と前世代** で表示される **VM.GPU3.2** を選択し **次のドキュメントを確認した上でこれに同意します。** チェックボックスをチェックし **シェイプの変更** ボタンをクリック）

   ![画面ショット](console_page03-2.png)

   3.5 **ネットワーキング** フィールド
    - **プライマリ・ネットワーク** ： **新規仮想クラウド・ネットワークの作成**
    - **コンパートメントに作成** ：GPUインスタンスを構築するコンパートメント

      ![画面ショット](console_page05.png)

   3.6 **SSHキーの追加** フィールド
    - **SSHキー** ：GPUインスタンスにログインする際使用するSSH秘密鍵に対応する公開鍵
      - 公開鍵ファイルのアップロード（ **公開キー・ファイル(.pub)のアップロード** ）と公開鍵のフィールドへの貼り付け（ **公開キーの貼付け** ）が選択可能  

      ![画面ショット](console_page06.png)

4. 表示される以下 **作業リクエスト** 画面で、左上のステータスが **プロビジョニング中** と表示されれば、GPUインスタンスの構築が実施されています。

   ![画面ショット](console_page07.png)

   ステータスが **実行中** となれば、GPUインスタンスの構築が完了しています。

# 2. Python・TenforFlow・Jupiter Notebook環境構築

本章は、デプロイされたGPUインスタンスにログインし、Python・TensorFlow・Jupiter Notebook環境を構築します。
本チュートリアルで使用しているOracle Linux 7.9は、内包されているPythonのバージョンが3.6と古いため、まずPython 3.8をインストールします。この際、Oracle Linux 7.9の様々なパッケージから利用されるバージョン3.6を残し、複数のバージョンを混在させることが可能なSoftware Collectionsを使用してPython 3.8を追加でインストール、このPython 3.8をベースにTensorFlowやJupyter Notebook等の機械学習関連プログラム環境を構築します。

1. GPUインスタンスログイン

   先の **作業リクエスト** 画面で、**パブリックIPアドレス** フィールドに表示されているGPUインスタンスのIPアドレスを使用し、SSHでGPUインスタンスにopcアカウントでインターネット経由ログインします。

   ![画面ショット](console_page08.png)

   このSSH接続では、GPUインスタンス構築時に指定したSSH公開鍵に対応する秘密鍵を使用します。

   ```sh 
   > ssh -i path_to_ssh_secret_key opc@123.456.789.123
    ```

2. Python 3.8インストール

   rootにスイッチして以下コマンドを実行し、Software Collectionsから提供されるPython 3.8をインストール、これを有効化したサブシェルを起動、pipとsetuptoolsをアップグレードします。

   ```sh
   > sudo su -
   > yum -y install rh-python38
   > scl enable rh-python38 bash
   > pip install --upgrade pip setuptools
   > exit
   > scl enable rh-python38 bash
   ```

3. TensorFlow・Jupyter Notebook・Matplotlibインストール

   以下コマンドを実行し、TensorFlow・Jupyter Notebook・Matplotlibをインストールします。

   ```sh
   > pip install tensorflow notebook matplotlib
   ```

4. Jupiter Notebookログインパスワード初期化

   opcにスイッチして以下コマンドを実行し、Jupiter Notebookにログインする際のパスワードを初期化します。

   ```sh
   > jupyter notebook password
   Enter password: 
   Verify password: 
   [NotebookPasswordApp] Wrote hashed password to /home/opc/.jupyter/jupyter_notebook_config.json
   ```

5. Jupyter Notebookのsystemdへの登録

   rootにスイッチし、Jupyter Notebookをsystemdに登録するための設定ファイルを以下のように作成します。

   ```sh
   > cat /etc/systemd/system/notebook.service
   [Unit]
   Description=Jupyter Notebook
   [Service]
   Type=simple
   PIDFile=/var/run/jupyter-notebook.pid
   ExecStart=/opt/rh/rh-python38/root/usr/bin/python /opt/rh/rh-python38/root/usr/local/bin/jupyter-notebook
   WorkingDirectory=/home/opc/
   User=opc
   Group=opc
   Restart=always
   [Install]
   WantedBy=multi-user.target
   ```

6. Jupiter Notebook起動

   以下コマンドで、Jupiter Notebookを起動します。

   ```sh
   > systemctl daemon-reload
   > systemctl start notebook
   > systemctl status notebook
   ● notebook.service - Jupyter Notebook
   Loaded: loaded (/etc/systemd/system/notebook.service; disabled; vendor preset: disabled)
   Active: active (running) since Fri 2022-06-10 07:49:33 GMT; 11s ago
   Main PID: 22301 (python)
   Memory: 54.8M
   CGroup: /system.slice/notebook.service
           └─22301 /opt/rh/rh-python38/root/usr/bin/python /opt/rh/rh-python38/root/usr/local/bin/jupy...

   Jun 10 07:49:33 ml-vmgpu32-2 systemd[1]: Started Jupyter Notebook.
   Jun 10 07:49:34 ml-vmgpu32-2 python[22301]: [I 07:49:34.141 NotebookApp] Writing notebook server c...cret
   Jun 10 07:49:34 ml-vmgpu32-2 python[22301]: [I 07:49:34.396 NotebookApp] Serving notebooks from lo.../opc
   Jun 10 07:49:34 ml-vmgpu32-2 python[22301]: [I 07:49:34.396 NotebookApp] Jupyter Notebook 6.4.12 i... at:
   Jun 10 07:49:34 ml-vmgpu32-2 python[22301]: [I 07:49:34.396 NotebookApp] http://localhost:8888/
   Jun 10 07:49:34 ml-vmgpu32-2 python[22301]: [I 07:49:34.397 NotebookApp] Use Control-C to stop thi...on).
   Jun 10 07:49:34 ml-vmgpu32-2 python[22301]: [W 07:49:34.401 NotebookApp] No web browser found: cou...ser.
   Hint: Some lines were ellipsized, use -l to show in full.
   > systemctl enable notebook
   Created symlink from /etc/systemd/system/multi-user.target.wants/notebook.service to /etc/systemd/system/notebook.service.
   > systemctl is-enabled notebook
   enabled
   ```

# 3. TenforFlow・Jupiter Notebook稼働確認

本章は、TensorFlowが認識するGPUカードの枚数を確認するプログラムを実行し、TensorFlowとJupiter Notebookの稼働を確認します。

1. 稼働確認プログラムコピー

   以下稼働確認プログラムを、GPUインスタンスのopcアカウントのホームディレクトリ直下にファイル名"num_gpu.ipynb"でコピーします。

   ```sh
   {
   "cells": [
   {
      "cell_type": "code",
      "execution_count": null,
      "metadata": {},
      "outputs": [],
      "source": [
      "import os\n",
      "os.environ['TF_CPP_MIN_LOG_LEVEL']='2'\n",
      "import tensorflow as tf\n",
      "print(\"Num GPUs Available: \", len(tf.config.list_physical_devices('GPU')))"
      ]
   }
   ],
   "metadata": {
   "kernelspec": {
      "display_name": "Python 3",
      "language": "python",
      "name": "python3"
   },
   "language_info": {
      "codemirror_mode": {
      "name": "ipython",
      "version": 3
      },
      "file_extension": ".py",
      "mimetype": "text/x-python",
      "name": "python",
      "nbconvert_exporter": "python",
      "pygments_lexer": "ipython3",
      "version": "3.6.8"
   }
   },
   "nbformat": 4,
   "nbformat_minor": 4
   }
   ```

2. SSHポートフォワード作成

   構築したJupiter Notebookは、自身のGPUインスタンスからのみアクセス可能になっています。
   
   そこで、以下コマンドをJupiter Notebookにアクセスするブラウザを起動する端末で実行し、この端末の8888番ポートをGPUインスタンスの8888番ポート(Jupyter Notebookがアクセスを待ち受けるポート)に転送するSSHポートフォワードを作成します。

   ```sh
   > ssh -i path_to_ssh_secret_key -L 8888:localhost:8888 opc@123.456.789.123
   ```

3. Jupiter Notebookへのアクセス

   ブラウザを起動し、アドレスに"localhost:8888"を指定してJupiter Notebookにアクセスし、表示される以下画面の **Password** フィールドに **Jupiter Notebookログインパスワード初期化** で設定したパスワードを入力します。

   ![画面ショット](Jupyter_page01.png)

4. 稼働確認プログラム実行

   以下ブラウザ画面に表示される、先にコピーした稼働確認プログラムをクリックします。

   ![画面ショット](Jupyter_page02.png)

   表示される以下ブラウザ画面の **実行** ボタンをクリックし、稼働確認プログラムを実行、"Num GPUs Available:"の値が使用するGPUシェイプに搭載されるGPU枚数に一致することを確認します。

   ![画面ショット](Jupyter_page06.png)

# 4. Jupyter Notebookで機械学習プログラム実行

本章は、GPUインスタンスのJupyter Notebookにアクセスし、サンプル機械学習プログラムを実行してその動作を確認します。

1. サンプル機械学習プログラムコピー

   以下サンプルプログラムを、GPUインスタンスのopcアカウントのホームディレクトリ直下にファイル名"celsious2fahrenheit.ipynb"でコピーします。

   このプログラムは、既知の摂氏・華氏対応データからその変換式を学習し、未知の摂氏表記温度から対応する華氏を予測します。

   ```sh
   {
      "cells": [
      {
         "cell_type": "code",
         "execution_count": 19,
         "metadata": {},
         "outputs": [],
         "source": [
         "#@title Licensed under the Apache License, Version 2.0 (the \"License\");\n",
         "# you may not use this file except in compliance with the License.\n",
         "# You may obtain a copy of the License at\n",
         "#\n",
         "# https://www.apache.org/licenses/LICENSE-2.0\n",
         "#\n",
         "# Unless required by applicable law or agreed to in writing, software\n",
         "# distributed under the License is distributed on an \"AS IS\" BASIS,\n",
         "# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n",
         "# See the License for the specific language governing permissions and\n",
         "# limitations under the License."
         ]
      },
      {
         "cell_type": "code",
         "execution_count": null,
         "metadata": {},
         "outputs": [],
         "source": [
         "import os\n",
         "os.environ['TF_CPP_MIN_LOG_LEVEL']='2'\n",
         "import tensorflow as tf"
         ]
      },
      {
         "cell_type": "code",
         "execution_count": null,
         "metadata": {},
         "outputs": [],
         "source": [
         "import numpy as np\n",
         "import logging\n",
         "logger = tf.get_logger()\n",
         "logger.setLevel(logging.ERROR)"
         ]
      },
      {
         "cell_type": "code",
         "execution_count": null,
         "metadata": {},
         "outputs": [],
         "source": [
         "celsius_q    = np.array([-40, -10,  0,  8, 15, 22,  38],  dtype=float)\n",
         "fahrenheit_a = np.array([-40,  14, 32, 46, 59, 72, 100],  dtype=float)\n",
         "\n",
         "for i,c in enumerate(celsius_q):\n",
         "  print(\"{} degrees Celsius = {} degrees Fahrenheit\".format(c, fahrenheit_a[i]))"
         ]
      },
      {
         "cell_type": "code",
         "execution_count": null,
         "metadata": {},
         "outputs": [],
         "source": [
         "l0 = tf.keras.layers.Dense(units=1, input_shape=[1])"
         ]
      },
      {
         "cell_type": "code",
         "execution_count": null,
         "metadata": {},
         "outputs": [],
         "source": [
         "model = tf.keras.Sequential([l0])"
         ]
      },
      {
         "cell_type": "code",
         "execution_count": null,
         "metadata": {},
         "outputs": [],
         "source": [
         "model.compile(loss='mean_squared_error',\n",
         "              optimizer=tf.keras.optimizers.Adam(0.1))"
         ]
      },
      {
         "cell_type": "code",
         "execution_count": null,
         "metadata": {},
         "outputs": [],
         "source": [
         "history = model.fit(celsius_q, fahrenheit_a, epochs=500, verbose=False)\n",
         "print(\"Finished training the model\")"
         ]
      },
      {
         "cell_type": "code",
         "execution_count": null,
         "metadata": {},
         "outputs": [],
         "source": [
         "import matplotlib.pyplot as plt\n",
         "plt.xlabel('Epoch Number')\n",
         "plt.ylabel(\"Loss Magnitude\")\n",
         "plt.plot(history.history['loss'])"
         ]
      },
      {
         "cell_type": "code",
         "execution_count": null,
         "metadata": {},
         "outputs": [],
         "source": [
         "print(model.predict([100.0]))"
         ]
      }
      ],
      "metadata": {
      "kernelspec": {
         "display_name": "Python 3",
         "language": "python",
         "name": "python3"
      },
      "language_info": {
         "codemirror_mode": {
         "name": "ipython",
         "version": 3
         },
         "file_extension": ".py",
         "mimetype": "text/x-python",
         "name": "python",
         "nbconvert_exporter": "python",
         "pygments_lexer": "ipython3",
         "version": "3.6.8"
      }
      },
      "nbformat": 4,
      "nbformat_minor": 4
   }
   ```

2. サンプルプログラム実行

   Jupiter Notebookにログインした直後のブラウザ画面をリロードし、以下画面に表示される、先にコピーしたサンプル機械学習プログラムをクリックします。

   ![画面ショット](Jupyter_page07.png)

   表示される以下ブラウザ画面の **カーネルを再起動しノートブック全体を再実行** ボタンをクリックします。

   ![画面ショット](Jupyter_page03.png)

   表示される以下ブラウザ画面の **再起動と全ての出力をクリア** ボタンをクリックし、サンプルプログラムを実行します。

   ![画面ショット](Jupyter_page04.png)

   実行した結果が表示される以下ブラウザ画面で、100度（摂氏）に対応する華氏の予測値が変換式（f=1.8c+32）から計算される212度（華氏）に近い値であることを確認します。

   ![画面ショット](Jupyter_page05.png)

# 5. 機械学習関連インストール済みソフトウェア確認

本章は、以下コマンドをGPUインスタンスのopcアカウントで実行し、GPUインスタンスにインストールされている、機械学習関連ソフトウェアとそのバージョンを確認します。

   ```sh
   > scl enable rh-python38 bash
   > pip list
   Package                      Version
   ---------------------------- -----------
   absl-py                      1.1.0
   argon2-cffi                  21.3.0
   argon2-cffi-bindings         21.2.0
   asttokens                    2.0.5
   astunparse                   1.6.3
   attrs                        21.4.0
   backcall                     0.2.0
   beautifulsoup4               4.11.1
   bleach                       5.0.0
   cachetools                   5.2.0
   certifi                      2022.5.18.1
   cffi                         1.15.0
   charset-normalizer           2.0.12
   cycler                       0.11.0
   debugpy                      1.6.0
   decorator                    5.1.1
   defusedxml                   0.7.1
   entrypoints                  0.4
   executing                    0.8.3
   fastjsonschema               2.15.3
   flatbuffers                  1.12
   fonttools                    4.33.3
   gast                         0.4.0
   google-auth                  2.7.0
   google-auth-oauthlib         0.4.6
   google-pasta                 0.2.0
   grpcio                       1.46.3
   h5py                         3.7.0
   idna                         3.3
   importlib-metadata           4.11.4
   importlib-resources          5.7.1
   ipykernel                    6.13.1
   ipython                      8.4.0
   ipython-genutils             0.2.0
   jedi                         0.18.1
   Jinja2                       3.1.2
   jsonschema                   4.6.0
   jupyter-client               7.3.4
   jupyter-core                 4.10.0
   jupyterlab-pygments          0.2.2
   keras                        2.9.0
   Keras-Preprocessing          1.1.2
   kiwisolver                   1.4.2
   libclang                     14.0.1
   Markdown                     3.3.7
   MarkupSafe                   2.1.1
   matplotlib                   3.5.2
   matplotlib-inline            0.1.3
   mistune                      0.8.4
   nbclient                     0.6.4
   nbconvert                    6.5.0
   nbformat                     5.4.0
   nest-asyncio                 1.5.5
   notebook                     6.4.12
   numpy                        1.22.4
   oauthlib                     3.2.0
   opt-einsum                   3.3.0
   packaging                    21.3
   pandocfilters                1.5.0
   parso                        0.8.3
   pexpect                      4.8.0
   pickleshare                  0.7.5
   Pillow                       9.1.1
   pip                          22.1.2
   prometheus-client            0.14.1
   prompt-toolkit               3.0.29
   protobuf                     3.19.4
   psutil                       5.9.1
   ptyprocess                   0.7.0
   pure-eval                    0.2.2
   pyasn1                       0.4.8
   pyasn1-modules               0.2.8
   pycparser                    2.21
   Pygments                     2.12.0
   pyparsing                    3.0.9
   pyrsistent                   0.18.1
   python-dateutil              2.8.2
   pyzmq                        23.1.0
   requests                     2.28.0
   requests-oauthlib            1.3.1
   rsa                          4.8
   Send2Trash                   1.8.0
   setuptools                   62.3.3
   six                          1.16.0
   soupsieve                    2.3.2.post1
   stack-data                   0.2.0
   tensorboard                  2.9.1
   tensorboard-data-server      0.6.1
   tensorboard-plugin-wit       1.8.1
   tensorflow                   2.9.1
   tensorflow-estimator         2.9.0
   tensorflow-io-gcs-filesystem 0.26.0
   termcolor                    1.1.0
   terminado                    0.15.0
   tinycss2                     1.1.1
   tornado                      6.1
   traitlets                    5.2.2.post1
   typing_extensions            4.2.0
   urllib3                      1.26.9
   wcwidth                      0.2.5
   webencodings                 0.5.1
   Werkzeug                     2.1.2
   wheel                        0.37.1
   wrapt                        1.14.1
   zipp                         3.8.0
   ```

これで、このチュートリアルは終了です。
