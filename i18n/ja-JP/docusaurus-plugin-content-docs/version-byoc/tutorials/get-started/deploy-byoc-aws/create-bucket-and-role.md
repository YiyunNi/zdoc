---
title: "S3 バケットと IAM ロールの作成 | BYOC"
slug: /create-bucket-and-role
sidebar_key: create-bucket-and-role
sidebar_label: "S3 バケットと IAM ロールを作成"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Bring-Your-Own-Cloud (BYOC) プロジェクトのルートストレージを適切な権限で作成・設定する手順について説明します。 | BYOC"
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
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# S3バケットとIAMロールの作成

このページでは、Bring-Your-Own-Cloud（BYOC）プロジェクトのルートストレージを適切な権限で作成・設定する手順について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOCは現在<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud セールス</a>までお問い合わせください。</p>

</Admonition>

## S3バケットのベストプラクティス\{#best-practices-for-the-s3-bucket}

プロジェクトのデプロイ時に指定するバケットは、そのプロジェクト内で作成されたクラスタのルートストレージとして使用されます。S3バケットを作成する前に、以下のベストプラクティスを確認してください。

- S3バケットは、プロジェクトのデプロイと同じAWSリージョンに存在する必要があります。

- プロジェクト内のすべてのクラスタは、プロジェクトのデプロイ時に作成されたS3バケットを共有します。Zilliz Cloudは、プロジェクト専用のS3バケットを使用し、他のサービスやリソースと共有しないことを推奨しています。

## 手順\{#procedure}

AWSコンソールを使用してバケットとロールを作成できます。または、Zilliz Cloudが提供するTerraformスクリプトを使用して、AWS上のZilliz Cloudプロジェクトのインフラストラクチャをブートストラップすることもできます。詳細については、[Terraform Provider](./terraform-provider) を参照してください。

### ステップ1: S3バケットの作成\{#step-1-create-the-s3-bucket}

このステップでは、BYOCプロジェクトのデプロイ用にAWS上にS3バケットを作成します。既存のS3バケットを使用する場合は、そのバケットがBYOCプロジェクトと同じリージョンにあることを確認してください。作成後、Zilliz Cloudコンソールの**ストレージ設定**にバケット名を入力します。

<Supademo id="cmb5xlhej39irppkpeihkx9eg" title=""  />

<Procedures>

1. 管理者権限を持つユーザーとしてAWSコンソールにログインし、S3サービスに移動します。

1. **汎用バケット**タブで、**バケットを作成**をクリックします。

1. **バケット名**に、バケットの名前を入力し、その他の設定はデフォルト値のままにします。

1. **バケットを作成**をクリックします。

1. **Zilliz Cloud コンソール**に戻り、**ストレージ設定**の**バケット**にバケット名を貼り付けます。

</Procedures>

### ステップ2: S3バケットへのアクセス用IAMロールの作成\{#step-2-create-an-iam-role-to-access-the-s3-bucket}

このステップでは、前のステップで作成したS3バケットにZilliz Cloudが代わりにアクセスするためのIAMロールをAWS上に作成します。

<Supademo id="cmb5y39ss39r5ppkplsrz1nqd" title=""  />

<Procedures>

1. 管理者権限を持つユーザーとして**AWSコンソール**にログインし、**IAM**ダッシュボードに移動します。

1. アカウント情報を展開し、**AWS アカウントID**の前にあるコピーボタンをクリックします。

1. 左側のサイドバーで**ロール**タブをクリックし、次に**ロールを作成**をクリックします。

1. **信頼されたエンティティを選択**で、**カスタム信頼ポリシー**タイルをクリックします。**共通信頼ポリシー**に、以下の信頼JSONを**カスタム信頼ポリシー**セクションのエディタに貼り付け、`{accountId}`をご自身の**AWS アカウントID**に置き換えます。

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

1. **次へ** をクリックし、権限の追加をスキップします。

1. **名前を付けて確認し、作成** ステップで、ロールに名前を付け、信頼できるエンティティを確認し、**ロールの作成** をクリックします。

1. ロールが作成されたら、緑色のバーにある **ロールを表示** をクリックして、ロールの詳細に進みます。

1. ロールの **ARN** の前にあるコピーアイコンをクリックします。

1. Zilliz Cloud コンソールに戻り、**ストレージ設定** の **IAM ロール ARN** にロール ARN を貼り付けます。

</Procedures>

### ステップ 3: 権限の追加\{#step-3-add-permissions}

このステップは AWS コンソールでのみ行います。このステップでは、[ステップ 2](./create-bucket-and-role#step-2-create-an-iam-role-to-access-the-s3-bucket) で作成したロールにインラインポリシーを作成します。

<Supademo id="cmb65arpv3e11ppkpgy2d4q1v" title=""  />

<Procedures>

1. 作成したロールの詳細ページに移動します。**権限ポリシー** セクションで、**権限の追加** をクリックし、**インラインポリシーの作成** を選択します。

1. **権限の指定** ページで、**ポリシーエディター** セクションの **JSON** をクリックして、ポリシーエディターを開きます。次に、以下の権限をコピーして、ポリシーエディターに貼り付けます。

    `{bucketName}` を [ステップ 1](./create-bucket-and-role#step-1-create-the-s3-bucket) で作成したバケットの名前に置き換える必要があります。変更したポリシー JSON をコピーし、AWS の **ポリシーエディター** に貼り付けてください。

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

1. **Review and create** で、ポリシー名を入力し、権限を確認して、**Create policy** をクリックします。

</Procedures>