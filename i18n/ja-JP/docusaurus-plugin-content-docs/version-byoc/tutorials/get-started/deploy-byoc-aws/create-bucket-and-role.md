---
title: "S3バケットとIAMロールの作成 | BYOC"
slug: /create-bucket-and-role
sidebar_label: "S3バケットとIAMロールの作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Bring-Your-Own-Cloud (BYOC) プロジェクトのルートストレージを適切な権限で作成および設定する手順について説明します。"
type: origin
token: Lv1Pw8lORiaX44kjGL0cNnpPnub
sidebar_position: 1
keywords: 
  - zilliz
  - byoc
  - aws
  - s3 bucket
  - IAM role
  - milvus
  - ベクターデータベース
  - 動画検索
  - AI幻覚
  - AIエージェント
  - セマンティック検索

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# S3バケットとIAMロールの作成

このページでは、Bring-Your-Own-Cloud (BYOC) プロジェクトのルートストレージを適切な権限で作成および設定する手順について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOC は現在、**一般提供**されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud の営業担当者</a>にお問い合わせください。</p>

</Admonition>

## S3バケットのベストプラクティス\{#best-practices-for-the-s3-bucket}

プロジェクトデプロイ時に指定するバケットは、プロジェクトで作成されるクラスターのルートストレージとして使用されます。S3バケットを作成する前に、以下のベストプラクティスを確認してください。

- S3バケットは、プロジェクトデプロイと同じAWSリージョンにある必要があります。

- プロジェクト内のすべてのクラスターは、プロジェクトデプロイ時に作成されたS3バケットを共有します。Zilliz Cloudは、プロジェクト専用のS3バケットを使用し、他のサービスやリソースと共有しないことを推奨します。

## 手順\{#procedure}

AWSコンソールを使用してバケットとロールを作成できます。または、Zilliz Cloudが提供するTerraformスクリプトを使用して、AWS上のZilliz Cloudプロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider)を参照してください。

### ステップ1：S3バケットを作成する\{#step-1-create-the-s3-bucket}

このステップでは、BYOCプロジェクトデプロイ用にAWS上にS3バケットを作成します。既存のS3バケットを使用する場合は、そのバケットがBYOCプロジェクトと同じリージョンにあることを確認してください。作成後、Zilliz Cloudコンソールの**Storage settings**にバケット名を入力します。

<Supademo id="cmb5xlhej39irppkpeihkx9eg" title=""  />

<Procedures>

1. 管理者権限を持つユーザーとしてAWSコンソールにログインし、S3サービスに移動します。

1. **General purpose bucket**タブで、**Create bucket**をクリックします。

1. **Bucket name**にバケット名を入力し、他の設定はデフォルト値のままにします。

1. **Create bucket**をクリックします。

1. **Zilliz Cloud console**に戻り、**Storage settings**の下にある**Bucket**にバケット名を貼り付けます。

</Procedures>

### ステップ2：S3バケットにアクセスするためのIAMロールを作成する\{#step-2-create-an-iam-role-to-access-the-s3-bucket}

このステップでは、Zilliz Cloudがお客様に代わって前のステップで作成したS3バケットにアクセスするためのIAMロールをAWS上に作成します。

<Supademo id="cmb5y39ss39r5ppkplsrz1nqd" title=""  />

<Procedures>

1. 管理者権限を持つユーザーとして**AWS Console**にログインし、**IAM**ダッシュボードに移動します。

1. アカウント情報を展開し、**AWS Account ID**の前のコピーボタンをクリックします。

1. 左側のサイドバーで**Roles**タブをクリックし、**Create Role**をクリックします。

1. **Select trusted entity**で、**Custom trust policy**タイルをクリックします。**Common trust policy**で、以下の信頼JSONを**Custom trust policy**セクションのエディタに貼り付け、`{accountId}`を**AWS Account ID**に置き換えます。

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Federated": "arn:aws:iam::{accountId}:oidc-provider/eks_oidc_url"
                },
                "Action": "sts:AssumeRoleWithWebIdentity",
                "Condition": {
                    "StringLike": {
                        "eks_oidc_url:sub": [
                            "system:serviceaccount:milvus-*:milvus*",
                            "system:serviceaccount:loki:loki*",
                            "system:serviceaccount:index-pool:milvus*"
                        ],
                        "eks_oidc_url:aud": "sts.amazonaws.com"
                    }
                }
            }
        ]
    }
    ```

1. **Next** をクリックし、権限の追加をスキップします。

1. **名前、レビュー、作成** ステップで、ロールに名前を付け、信頼されたエンティティを確認し、**ロールの作成** をクリックします。

1. ロールが作成されたら、緑色のバーにある **ロールの表示** をクリックして、ロールの詳細に移動します。

1. ロールの **ARN** の前にあるコピーアイコンをクリックします。

1. Zilliz Cloud コンソールに戻り、**ストレージ設定** の **IAM ロール ARN** にロール ARN を貼り付けます。

</Procedures>

### ステップ 3: 権限を追加する {#step-3-add-permissions}

このステップは AWS コンソールのみで行います。このステップでは、[ステップ 2](./create-bucket-and-role#step-2-create-an-iam-role-to-access-the-s3-bucket) で作成したロールのインラインポリシーを作成します。

<Supademo id="cmb65arpv3e11ppkpgy2d4q1v" title="" />

<Procedures>

1. 作成したロールの詳細ページに移動します。**権限ポリシー** セクションで、**権限の追加** をクリックし、**インラインポリシーの作成** を選択します。

1. **権限の指定** ページで、**ポリシーエディタ** セクションの **JSON** をクリックしてポリシーエディタを開きます。次に、以下の権限をコピーしてポリシーエディタに貼り付けます。

    `{bucketName}` を [ステップ 1](./create-bucket-and-role#step-1-create-the-s3-bucket) で作成したバケットの名前に置き換え、変更したポリシー JSON をコピーして AWS の **ポリシーエディタ** に貼り付ける必要があります。

    ```json
    {
        "Version": "2012-10-17",
         "Statement": [
            {
              "Effect": "Allow",
              "Action": [
                "s3:ListBucket"
              ],
              "Resource": "arn:aws:s3:::{bucketName}"
            },
            {
                "Sid": "AllowS3ReadWrite",
                "Effect": "Allow",
                "Action": [
                    "s3:GetObject",
                    "s3:PutObject",
                    "s3:DeleteObject"
                ],
                "Resource": [
                    "arn:aws:s3:::{bucketName}/*"
                ]
            }
        ]
    }
    ```

1. **[Review and create]** で、ポリシー名を入力し、権限を確認して、**[Create policy]** をクリックします。

</Procedures>