---
title: "AWS KMS | Cloud"
slug: /aws-kms
sidebar_key: aws-kms
sidebar_label: "AWS KMS"
beta: FALSE
notebook: FALSE
description: "AWS Key Management Service (KMS) は、データの暗号化と署名に使用するキーの作成と管理を簡単に行える AWS マネージドサービスです。 | Cloud"
type: origin
token: FOamwIi07ia7kpkBPW8cEuIpniu
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - cmek
  - aws kms

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# AWS KMS

AWS キー Management Service (KMS) は、データの暗号化と署名に使用するキーの作成と管理を簡単に行えるよう設計された、AWS が管理するサービスです。

<Admonition type="info" icon="📘" title="Notes">

この機能は、**ビジネスクリティカル** プロジェクトの **Dedicated** クラスタでのみ利用可能です。

</Admonition>

## 概要\{#overview}

通常のケースでは、Zilliz Cloud クラスタ内のデータを暗号化するために KMS キーを直接使用することはありません。代わりに、KMS キーを使用して暗号化ゾーンキー（EZK）を暗号化し、EZK を使用してデータ暗号化キー（DEK）を暗号化し、DEK を使用してデータを暗号化します。

![YJRcwu5BLhm8Hub1eiZcDiIdnDh](https://zdoc-images.s3.us-west-2.amazonaws.com/YJRcwu5BLhm8Hub1eiZcDiIdnDh.png)

暗号化の仕組みとそのスコープの詳細については、[このセクション](./cmek#how-encryption-works) を参照してください。CMEK 機能の制限事項の詳細については、[このセクション](./cmek#limitations) を参照してください。CMEK 機能を使用するには、このページの手順に従ってください。

## 開始前の準備\{#before-you-start}

- AWS CLI をインストールしているか、AWS CloudShell へのアクセス権を持っていること。

    詳細については、[このページ](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) を参照してください。

- KMS 関連のコマンドを実行するための十分な権限を持っていること。

## KMS キーの追加\{#add-a-kms-key}

各プロジェクトでは、KMS プロバイダに関係なく、最大 **20** 個のキーを許可しています。既存の KMS キーを追加するか、Zilliz Cloud コンソールの指示に従って KMS キーを作成し、Zilliz Cloud に追加することができます。

## 手順\{#procedures}

[Zilliz Cloud コンソール](https://cloud.zilliz.com/login) にログインし、いずれかの **ビジネスクリティカル** プロジェクトに移動し、左側のナビゲーションペインから **ネットワーク** > **CMEK** を選択し、**+ CMEK** をクリックし、**Add CMEK (AWS KMS)** ダイアログボックスの手順に従ってプロセスを完了します。

開始する前に、手順中に使用する IAM ロールを決定する必要があります。IAM ロールは、KMS キーの追加に使用すると Zilliz Cloud に一覧表示されます。**Existing IAM ロール** タブの **Select AWS IAM ロール** ステップのドロップダウンリストを確認し、必要な IAM ロールが一覧表示されているかどうかを確認します。

- 表示されている場合は、[既存のロールを使用した KMS キーの追加](./aws-kms#add-a-kms-key-using-an-existing-role) に進みます。

- 表示されていない場合は、[新しいロールを使用した KMS キーの追加](./aws-kms#add-a-kms-key-using-a-new-role) に進みます。

### 既存のロールを使用した KMS キーの追加\{#add-a-kms-key-using-an-existing-role}

**Existing IAM ロール** タブの **Select AWS IAM ロール** のドロップダウンリストに必要な IAM ロールが含まれている場合は、このセクションの手順に従ってください。

<Procedures>

1. **Select AWS IAM ロール** ステップのドロップダウンをクリックし、IAM ロールを選択し、**Next** をクリックします。

    ![O6IxwU89jhUTHDbShkfcHzZFn00](https://zdoc-images.s3.us-west-2.amazonaws.com/O6IxwU89jhUTHDbShkfcHzZFn00.png)

1. KMS キーを追加します。

    ![ENW6wuQVlhaRntbKYDDcrdegnNL](https://zdoc-images.s3.us-west-2.amazonaws.com/ENW6wuQVlhaRntbKYDDcrdegnNL.png)

    1. ステップ 1 で対象のリージョンを選択します。

    1. **（オプション）** ステップ 2 のコマンドをコピーし、AWS CloudShell で実行します。

        このステップはオプションです。指定された IAM ロールで作成された KMS キーが既にある場合は、このステップをスキップして次に進むことができます。これは、マルチリージョンレプリカキーを追加する場合に便利です。

        <Admonition type="info" icon="📘" title="Notes">

        暗号化された Zilliz Cloud クラスタをあるクラウドリージョンから別のリージョンにバックアップした後、元のクラスタを暗号化したのと同じキーを使用して、ターゲットリージョンでバックアップを復号化する必要があります。

        この場合、キーをバックアップをホストするリージョンにレプリケートし、既存の IAM ロールを使用して Zilliz Cloud に送信することができます。

        マルチリージョンレプリカキーの作成の詳細については、AWS ドキュメントの [このページ](https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-replicate.html) をお読みください。

        </Admonition>

    1. 次の場所に KMS キー ARN をコピーして貼り付けます。

        - [AWS コンソール上で](https://console.aws.amazon.com/iam/home#/roles) あなたの IAM ロールのポリシー。

            ロールリストでロールの名前をクリックし、**Permissions** タブでロールポリシーを見つけ、コピーした KMS キーを `Resource` ノードに追加します。

            ```json
            {
                    "Version": "2012-10-17",
                    "Statement": [
                            {
                                    "Effect": "Allow",
                                    "Action": [
                                            "kms:Decrypt",
                                            "kms:Encrypt",
                                            "kms:DescribeKey"
                                    ],
                                    "Resource": [
                                            // highlight-start
                                            "arn:aws:kms:us-west-2:xxxx:key/mrk-...",
                                            "PASTE-THE-COPIED-KEY-ARN-HERE"
                                            // highlight-end
                                    ]
                            }
                    ]
            }
            ```

        - 上記の Zilliz Cloud のダイアログボックスのステップ 3。

    1. ダイアログボックスの下部にある **Validate KMS キー** をクリックします。

    1. 検証が成功したら、**Add** をクリックします。

</Procedures>

### 新しいロールを使用して KMS キーを追加する\{#add-a-kms-key-using-a-new-role}

**Existing IAM ロール** タブの **Select AWS IAM ロール** のドロップダウンリストに必要な IAM ロールが含まれていない場合は、このセクションの手順に従ってください。

<Procedures>

1. **New IAM ロール** をクリックします。

1. IAM ロールを作成し、その信頼ポリシーに Zilliz Cloud を追加します。

    Zilliz Cloud に一覧表示されていない場合は、IAM ロールを作成してください。これには、AWS CloudShell でコマンドを実行する必要があります。

    <Supademo id="cmkxdx3yy00txru0hopj1eiwg" title=""  />

    1. Zilliz Cloud コンソールから信頼ポリシーのファイル名をコピーし、AWS CloudShell で `vi` コマンドを実行して信頼ポリシーファイルを作成します。

        ```bash
        vi role-trust-policy.json
        ```

    1. **I** を押して挿入モードに入ります。

    1. **ステップ 1** の信頼ポリシー JSON をコピーし、ターミナルに貼り付けます。

    1. **ESC** を押して `:wq` と入力し、JSON ファイルを保存します。

    1. **ステップ 2** で作成するロールの名前を入力します。

    1. **ステップ 3** のコマンドをコピーし、ターミナルに貼り付けます。

    1. **Enter** を押してコマンドを実行します。

    1. コマンドの出力で、ロールの ARN をコピーして **ステップ 4** のテキストボックスに貼り付けます。

    1. **次へ** をクリックします。

1. KMS キーを作成します

    <Supademo id="cmkxdwufl000isl0i5nfkxzvy" title=""  />

    1. **ステップ 1** でクラウドリージョンを選択します。

    1. **ステップ 2** のコマンドをコピーし、ターミナルに貼り付けます。

    1. **Enter** を押してコマンドを実行します。

    1. コマンドの出力で、キーの ARN をコピーして **ステップ 3** のテキストボックスに貼り付けます。

    1. **次へ** をクリックします。

1. KMS キーを IAM ロールに関連付けます。

    <Supademo id="cmkxdx8eu00szs50igvo0f2ti" title=""  />

    1. `vi` コマンドを実行して、**ステップ 1** で必要なロールポリシー JSON ファイルを作成します。

    1. ステップ 2 のコマンドをコピーし、ターミナルに貼り付けます。

    1. **Enter** を押してコマンドを実行します。

    1. コマンドが実行されたら、ダイアログボックスの下部にある **KMS キーの検証** をクリックします。

    1. 検証が成功したら、**追加** をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

KMS キーを使用して Zilliz Cloud クラスターを暗号化する場合、クラスターは 10 分ごとにキーの可用性を確認します。キーが利用可能であることを検出してから、利用可能になります。

</Admonition>

## AWS KMS キーの管理\{#manage-aws-kms-keys}

追加した AWS KMS キーは、Zilliz Cloud コンソールで確認できます。

![S3NKwZYR7hj6ocbkpIQcB66Unyg](https://zdoc-images.s3.us-west-2.amazonaws.com/S3NKwZYR7hj6ocbkpIQcB66Unyg.png)

Zilliz Cloud は、リストされたキーの可用性を 10 分ごとにスキャンします。また、リストされた KMS キーのステータスに関するプロジェクトアラートを作成することもできます。詳細については、[プロジェクトアラートの管理](./manage-project-alerts#create-a-project-alert) を参照してください。

KMS キーが不要になった場合、それを使用しているクラスターがなければ削除できます。

## AWS KMS キーの使用\{#use-aws-kms-keys}

KMS キーを Zilliz Cloud に追加したら、それを使用して暗号化クラスターを作成したり、バックアップと復元を行ったりできます。

### 暗号化クラスターの作成\{#create-an-encrypted-cluster}

クラスターを作成したいリージョンで利用可能な KMS キーを選択して暗号化できます。

![RGUrbElsSoc61JxikfWcoTCrnHe](https://zdoc-images.s3.us-west-2.amazonaws.com/rgurbelssoc61jxikfwcotcrnhe.png "RGUrbElsSoc61JxikfWcoTCrnHe")

KMS キーを追加したら、以下のように暗号化クラスターを作成できます：

<Procedures>

1. **デプロイメントオプションの選択** セクションで **Dedicated** をクリックします。

1. クラスターのクラウドプロバイダーとリージョンを選択します。

1. **CMEK を使用した保存時の暗号化** を有効にし、既存の KMS キーを選択します。作成するクラスターと同じリージョンの KMS キーのみ選択できます。

1. サマリーを確認し、**クラスターの作成** をクリックします。

    ![Iy8JbR19eoBQ4YxV1PjcLfUinl7](https://zdoc-images.s3.us-west-2.amazonaws.com/iy8jbr19eobq4yxv1pjclfuinl7.png "Iy8JbR19eoBQ4YxV1PjcLfUinl7")

    暗号化クラスターの **概要** ページには、上図のようにクラスター名の右側にキーアイコンが表示されます。暗号化クラスターに作成されたすべてのコレクションは、デフォルトで暗号化されます。

</Procedures>

### 暗号化バックアップファイルからの復元\{#restore-from-an-encrypted-backup-file}

暗号化バックアップを新しいクラスターに復元する場合、Zilliz Cloud はバックアップファイルに関連付けられた KMS キーを使用して、復元前にデータを復号します。そのため、バックアップを暗号化ありまたはなしの新しいクラスターに復元できます。

![WaApbDlaYoywaMxxUMxcQLAOnDe](https://zdoc-images.s3.us-west-2.amazonaws.com/waapbdlayoywamxxumxcqlaonde.png "WaApbDlaYoywaMxxUMxcQLAOnDe")

暗号化バックアップからの復元手順は、通常の復元とほぼ同じですが、**CMEK を使用した保存時の暗号化** を有効にするかどうかが異なります。

![V1QJb3SK1oGa11xLljhcxKQEnkc](https://zdoc-images.s3.us-west-2.amazonaws.com/v1qjb3sk1oga11xlljhcxkqenkc.png "V1QJb3SK1oGa11xLljhcxKQEnkc")

- このオプションを有効にすると、復元後に作成されるクラスターは、以下で指定された KMS キーを使用して暗号化されます。

- このオプションを無効にすると、復元後に作成されるクラスターは暗号化されません。

