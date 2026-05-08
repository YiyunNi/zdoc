---
title: "AWS KMS | BYOC"
slug: /aws-kms
sidebar_key: aws-kms
sidebar_label: "AWS KMS"
beta: FALSE
notebook: FALSE
description: "AWS Key Management Service (KMS) は、データの暗号化と署名に使用するキーの作成と管理を簡単に行える AWS マネージドサービスです。 | BYOC"
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


import Procedures from '@site/src/components/Procedures';

# AWS KMS

AWS キー Management Service (KMS) は、データの暗号化と署名に使用するキーの作成と管理を簡単に行える、AWS が管理するサービスです。

## Overview\{#overview}

通常のケースでは、Zilliz Cloud クラスター内のデータを暗号化するために KMS キーを直接使用することはありません。代わりに、KMS キーを使用して暗号化ゾーンキー（EZK）を暗号化し、EZK を使用してデータ暗号化キー（DEK）を暗号化し、DEK を使用してデータを暗号化します。

![YJRcwu5BLhm8Hub1eiZcDiIdnDh](https://zdoc-images.s3.us-west-2.amazonaws.com/YJRcwu5BLhm8Hub1eiZcDiIdnDh.png)

暗号化の仕組みとその範囲の詳細については、[このセクション](./cmek#how-encryption-works) を参照してください。CMEK 機能の制限事項の詳細については、[このセクション](./cmek#limitations) を参照してください。CMEK 機能を使用するには、このページの手順に従ってください。

## Before you start\{#before-you-start}

- AWS CLI をインストールしているか、AWS CloudShell にアクセスできること。

    詳細については、[このページ](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) を参照してください。

- KMS 関連のコマンドを実行するための十分な権限を持っていること。

## Add a KMS key\{#add-a-kms-key}

各プロジェクトでは、KMS プロバイダーに関係なく、最大 **20** 個のキーを許可しています。既存の KMS キーを追加するか、Zilliz Cloud コンソールの指示に従って KMS キーを作成し、Zilliz Cloud に追加することができます。

**Select AWS IAM ロール** ステップのドロップダウンリストが空の場合、事前に [Zilliz Cloud Terraform provider](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs) を使用して CMEK ロールを追加する必要があります。

<Procedures>

1. **Select AWS IAM ロール** ステップのドロップダウンをクリックし、IAM ロールを選択して、**Next** をクリック。

    ![FbqvwpUuahSvMyb02IUcT1iNn6f](https://zdoc-images.s3.us-west-2.amazonaws.com/FbqvwpUuahSvMyb02IUcT1iNn6f.png)

1. KMS キーを追加します。

    ![OVdjw9ZFghQKnsbaX67cAPkWn2b](https://zdoc-images.s3.us-west-2.amazonaws.com/OVdjw9ZFghQKnsbaX67cAPkWn2b.png)

    1. ステップ 1 で対象のリージョンを選択します。

    1. **（オプション）** ステップ 2 のコマンドをコピーし、AWS CloudShell で実行します。

        このステップはオプションです。指定された IAM ロールで作成された KMS キーが既にある場合は、このステップをスキップして次に進むことができます。これは、マルチリージョンレプリカキーを追加する場合に便利です。

        <Admonition type="info" icon="📘" title="Notes">

        暗号化された Zilliz Cloud クラスターをあるクラウドリージョンから別のリージョンにバックアップした後、元のクラスターを暗号化したのと同じキーを使用して、ターゲットリージョンでバックアップを復号する必要があります。

        この場合、キーをバックアップをホストするリージョンにレプリケートし、既存の IAM ロールを使用して Zilliz Cloud に送信することができます。

        マルチリージョンレプリカキーの作成の詳細については、AWS ドキュメントの [このページ](https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-replicate.html) をお読みください。

        </Admonition>

    1. 次の場所に KMS キー ARN をコピーして貼り付けます：

        - [AWS コンソール](https://console.aws.amazon.com/iam/home#/roles) で IAM ロールのポリシー。

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

        - Zilliz Cloud の上記ダイアログボックスのステップ 3。

    1. ダイアログボックスの下部にある **Validate KMS キー** をクリックします。

    1. 検証が成功したら、**Add** をクリックします。

</Procedures>

<Admonition type="info" icon="📘" title="Notes">

KMS キーを使用して Zilliz Cloud クラスターを暗号化する場合、クラスターは 10 分ごとにキーの可用性を確認します。キーが利用可能であることを検出した後にのみ、利用可能になります。

</Admonition>

## Manage AWS KMS keys\{#manage-aws-kms-keys}

追加した AWS KMS キーは、Zilliz Cloud コンソールで確認できます。

![OyNQwDHFhhUIXDbRMjac08Xdn1g](https://zdoc-images.s3.us-west-2.amazonaws.com/OyNQwDHFhhUIXDbRMjac08Xdn1g.png)

KMS キーが不要になった場合、それを使用しているクラスターがなければ削除できます。

## Use AWS KMS keys\{#use-aws-kms-keys}

KMS キーを Zilliz Cloud に追加したら、それを使用して暗号化クラスターを作成したり、バックアップと復元を行ったりできます。

### Create an encrypted cluster\{#create-an-encrypted-cluster}

クラスターを作成したいリージョンで利用可能な KMS キーを選択して暗号化できます。

![RGUrbElsSoc61JxikfWcoTCrnHe](https://zdoc-images.s3.us-west-2.amazonaws.com/rgurbelssoc61jxikfwcotcrnhe.png "RGUrbElsSoc61JxikfWcoTCrnHe")

KMS キーを追加したら、以下の手順で暗号化クラスターを作成できます：

<Procedures>

1. **Choose Deployment Option** セクションで **Dedicated** をクリックします。

1. クラスターのクラウドプロバイダーとリージョンを選択します。

1. **Encryption at Rest with CMEK** を有効にし、既存の KMS キーを選択します。選択できるのは、作成するクラスターと同じリージョンの KMS キーのみです。

1. サマリーを確認し、**Create Cluster** をクリックします。

    ![Iy8JbR19eoBQ4YxV1PjcLfUinl7](https://zdoc-images.s3.us-west-2.amazonaws.com/iy8jbr19eobq4yxv1pjclfuinl7.png "Iy8JbR19eoBQ4YxV1PjcLfUinl7")

    暗号化クラスターの **Overview** ページには、上図のようにクラスター名の右側にキーアイコンが表示されます。暗号化クラスター内に作成されたすべてのコレクションは、デフォルトで暗号化されます。

</Procedures>

### Restore from an encrypted backup file\{#restore-from-an-encrypted-backup-file}

暗号化されたバックアップを新しいクラスターに復元する場合、Zilliz Cloud はバックアップファイルに関連付けられた KMS キーを使用して、復元前にデータを復号します。そのため、バックアップを暗号化ありまたは暗号化なしの新しいクラスターに復元できます。

![WaApbDlaYoywaMxxUMxcQLAOnDe](https://zdoc-images.s3.us-west-2.amazonaws.com/waapbdlayoywamxxumxcqlaonde.png "WaApbDlaYoywaMxxUMxcQLAOnDe")

暗号化バックアップからの復元手順は、**Encryption at Rest with CMEK** を有効にするかどうかを除き、通常の復元とほぼ同じです。

![V1QJb3SK1oGa11xLljhcxKQEnkc](https://zdoc-images.s3.us-west-2.amazonaws.com/v1qjb3sk1oga11xlljhcxkqenkc.png "V1QJb3SK1oGa11xLljhcxKQEnkc")

- このオプションを有効にすると、復元後に作成されるクラスターは、以下で指定された KMS キーを使用して暗号化されます。

- このオプションを無効にすると、復元後に作成されるクラスターは暗号化されません。

