---
title: "AWS S3 との統合 | Cloud"
slug: /integrate-with-aws-s3
sidebar_label: "AWS S3"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud を使用すると、Amazon Simple Storage Service (Amazon S3) と統合して、バックアップファイルや監査ログを指定された S3 バケットにエクスポートできます。"
type: origin
token: PAViwMSb3iVMzuk56z3c1zfRnwh
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - バックアップ
  - エクスポート
  - 統合
  - オブジェクト
  - ストレージ
  - Zilliz ベクトルデータベース
  - Zilliz データベース
  - 非構造化データ
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# AWS S3 との連携

Zilliz Cloud を使用すると、Amazon Simple Storage Service (Amazon S3) と連携して、バックアップファイルや監査ログを指定された S3 バケットにエクスポートできます。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Enterprise</strong> プロジェクトの <strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

![BUEcwkZiChJrTlbziBMc3V49nFe](https://zdoc-images.s3.us-west-2.amazonaws.com/BUEcwkZiChJrTlbziBMc3V49nFe.png)

## 開始する前に{#before-you-start}

- Zilliz Cloud と AWS S3 を連携するには、プロジェクトへの **Organization Owner** または **Project Admin** アクセス権が必要です。必要な権限がない場合は、Zilliz Cloud Organization Owner にお問い合わせください。

- AWS マネジメントコンソールへの管理者アクセス権があること。

## ステップ 1: Zilliz Cloud コンソールで連携を開始する{#step-1-start-integration-in-zilliz-cloud-console}

<Supademo id="cmeibltu49co2h3pytvtdthb2" title="Step 1: Start integration in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインします。

1. プロジェクトページで、左側のナビゲーションペインから **Integrations** に移動します。

1. **Amazon S3** セクションで、**+ Integration** をクリックします。

1. 表示されるダイアログボックスで、**Basic Settings** を設定します。

    - **Integration Name**: この連携の一意の名前 (例: `integration_0819`)。

    - **Integration Description** *(オプション)*: この連携の説明 (例: `for export backupfile`)。

1. **Next** をクリックします。**Create Amazon S3 Bucket** ステップにリダイレクトされます。

    1. **Zilliz Cloud Cluster** **Region** フィールドで、Zilliz Cloud クラスターが存在するクラウドリージョンを選択します。後で作成するバケットは、Zilliz Cloud クラスターと同じリージョンにある必要があります。

    1. [S3 コンソール](https://us-west-2.console.aws.amazon.com/s3/buckets)を開き、[ステップ 2](./integrate-with-aws-s3)に進みます。

</Procedures>

## ステップ 2: AWS コンソールで S3 バケットを作成する{#step-2-create-s3-bucket-in-aws-console}

<Supademo id="cmeibt2wt9cx1h3pyrojdocrn" title="Step 2: Create S3 bucket (1)" />

<Procedures>

1. [Amazon S3 コンソール](https://console.aws.amazon.com/s3/)の右上隅で、Zilliz Cloud クラスターのリージョンと一致する AWS リージョンを選択します。

    <Admonition type="info" icon="📘" title="Notes">

    <ul>
    <li><p>バケットを作成する AWS リージョンは、Zilliz Cloud クラスターが存在するリージョンと一致している必要があります。Zilliz Cloud がサポートするリージョンについては、<a href="./cloud-providers-and-regions">Cloud Providers & Regions</a>を参照してください。</p></li>
    <li><p>異なるリージョンで実行されているクラスターの場合、バックアップファイルや監査ログが適切にエクスポートされるように、リージョンごとに個別の連携を作成してください。</p></li>
    </ul>

    </Admonition>

1. 左側のナビゲーションペインで、**General purpose buckets** を選択し、**Create bucket** をクリックします。

1. バケット設定を構成します。

    1. **Bucket type** で、**General purpose** を選択します。

    1. **Bucket name** に、バケットの名前を入力します (例: `zilliz-bucket-for-integration-0819`)。このバケット名は、今後の手順で必要になるため、覚えておいてください。

    1. その他の設定はデフォルトのままにし、**Create bucket** をクリックします。

    詳細については、「[Creating a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)」を参照してください。

</Procedures>

バケットが作成されたら、[Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻り、次の操作を行います。

<Supademo id="cmeibwrd19d3xh3pyx4h7r3d4" title="Step 2: Create S3 bucket (2)" />

<Procedures>

1. **Bucket Name** フィールドに、作成したバケットの名前 (この例では `zilliz-bucket-for-integration-0819`) を入力します。次に、**Next** をクリックします。

1. **Create IAM Policy** ステップで、JSON ポリシーをコピーします。これは[ステップ 3](./integrate-with-aws-s3)で必要になります。

1. 完了したら、[IAM コンソール](https://console.aws.amazon.com/iam/)を開き、[ステップ 3](./integrate-with-aws-s3)に進みます。

</Procedures>

## ステップ 3: AWS コンソールで IAM ポリシーを作成する{#step-3-create-iam-policy-in-aws-console}

Zilliz Cloud に AWS S3 へのアクセス権を付与するには、IAM ポリシーを作成します。このポリシーには、Zilliz Cloud と S3 バケット間のバックアップファイルの転送を容易にするための特定のアクションとリソースを含める必要があります。

<Supademo id="cmeibzhk09d4rh3pyaipwhqi7" title="Step 3: Create IAM policy (1)" />

簡潔にするために、JSON エディターを使用してポリシーを作成します。

<Procedures>

1. [IAM コンソール](https://console.aws.amazon.com/iam/)で、**Policies** > **Create policy** を選択します。

1. **Policy editor** セクションで、**JSON** オプションを選択します。

1. Zilliz Cloud が提供する JSON ポリシードキュメントをコピーしてポリシーエディターに貼り付けます。次に、**Next** をクリックします。

    以下は JSON ポリシードキュメントのサンプルです。連携に合わせた正確なポリシーについては、Zilliz Cloud コンソールの **Create IAM Policy** ステップを参照してください。

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "Statement1",
                "Effect": "Allow",
                "Action": [
                    "s3:GetObject",
                    "s3:PutObject",
                    "s3:ListBucket",
                    "s3:GetBucketLocation"
                ],
                "Resource": [
                    "arn:aws:s3:::<bucket>",
                    "arn:aws:s3:::<bucket>/*"
                ]
            }
        ]
    }
    ```

    ただし、AWS KMS を使用してバケットのサーバーサイド暗号化を有効にしている場合は、`kms:GenerateDataKey` アクションを許可する別の IAM ポリシーを追加する必要があります。この場合、以下の JSON ポリシーを使用します。

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "Statement1",
                "Effect": "Allow",
                "Action": [
                    "s3:GetObject",
                    "s3:PutObject",
                    "s3:ListBucket",
                    "s3:GetBucketLocation"
                ],
                "Resource": [
                    "arn:aws:s3:::<bucket>",
                    "arn:aws:s3:::<bucket>/*"
                ]
            },
            {
                "Sid": "AllowKMSGenerateDataKey",
                "Effect": "Allow",
                "Action": [
                    "kms:GenerateDataKey"
                ],
                "Resource": "arn:aws:kms:<region>:<account_id>:key/<key_id>"
            }
        ]
    }
    ```

    <Admonition type="info" icon="📘" title="Notes">

    <ul>
    <li><p><code>&lt;bucket&gt;</code> は、S3 バケットの実際の名前で置き換える必要があります。</p></li>
    <li><p><code>&lt;region&gt;</code>、<code>&lt;account_id&gt;</code>、および <code>&lt;key_id&gt;</code> は、実際の値で置き換える必要があります。詳細については、AWS ドキュメントの<a href="https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id">キー識別子</a>を参照してください。</p></li>
    </ul>

    </Admonition>

1. **Review and create** ページで、作成するポリシーの**Policy Name** (例: `zilliz-policy-for-integration-0819`) と**Description** (オプション) を入力し、**Permissions defined in this policy** を確認します。今後の手順で必要となるため、ポリシー名を覚えておいてください。

1. **Create policy** を選択して、新しいポリシーを保存します。完了したら、[ステップ 4](./integrate-with-aws-s3) に進みます。

</Procedures>

## ステップ 4: IAM ロールの作成{#step-4-create-iam-role}

AWS コンソールで IAM ロールを作成する前に、Zilliz Cloud コンソールで次の操作を行います。

<Supademo id="cmeic3fab9dajh3pyzp50jnck" title="ステップ 4: IAM ロールの作成 (1)" />

<Procedures>

1. Zilliz Cloud コンソールで、**Next** をクリックして**Create IAM Role** ステップに進みます。

1. **Select trusted entity** で、JSON コンテンツをコピーし、[IAM コンソール](https://console.aws.amazon.com/iam/)に移動します。

</Procedures>

それが完了したら、IAM ロールを作成するために次の操作を行います。

<Supademo id="cmeic6bis9dgth3pybfmk8143" title="ステップ 4: IAM ロールの作成 (2)" />

<Procedures>

1. [IAM コンソール](https://console.aws.amazon.com/iam/)で、**Roles** > **Create role** を選択します。

1. **Custom trust policy** ロールタイプを選択します。

1. **Custom trust policy** セクションで、ロールのカスタム信頼ポリシーをコピーして貼り付けます。次に、**Next** をクリックします。

    以下は JSON 信頼ポリシーのサンプルです。統合に合わせた正確な信頼ポリシーについては、Zilliz Cloud コンソールの**Create IAM Role** ステップを参照してください。

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "sts:AssumeRole",
                "Principal": {
                    "AWS": "965570967084"
                },
                "Condition": {
                    "StringEquals": {
                        "sts:ExternalId": "my-external-id"
                    }
                }
            }
        ]
    }
    ```

    <Admonition type="info" icon="📘" title="Notes">

    <p><code>965570967084</code> と <code>my-external-id</code> は、Zilliz Cloud コンソールで <strong>IAM ロールの作成</strong> ステップに表示される実際の AWS アカウント ID と外部 ID に置き換える必要があります。</p>

    </Admonition>

1. **アクセス許可の追加** ステップの **アクセス許可ポリシー** で、[ステップ 3](./integrate-with-aws-s3) で作成したポリシーを検索して選択し、アクセス許可を追加します。次に、**次へ** をクリックします。

1. **名前、確認、作成** ステップで、ロール名 (例: `zilliz-integration-role-0819`) を入力し、設定を確認します。次に、**ロールの作成** をクリックします。

1. 作成したロールの詳細ページに移動し、ロールに対応する **ARN** をコピーします。これは、[ステップ 5](./integrate-with-aws-s3#step-5-validate-and-add-integration) で Zilliz Cloud コンソールで必要になります。

</Procedures>

## ステップ 5: 統合の検証と追加{#step-5-validate-and-add-integration}

<Supademo id="cmeicbdyz9dprh3py2wwbguvn" title="Step 5: Validate and add integration" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login) の **IAM ロールの作成** ステップで、前のステップで IAM コンソールからコピーした **ARN** を貼り付けます。

1. 次に、**統合の検証** をクリックして、S3 バケットと IAM ロールの設定を確認します。

1. ステータスが **成功** に変わったら、統合が機能しています。次に、**追加** をクリックします。

</Procedures>

これで、この統合を使用して、バックアップファイルをエクスポートしたり、監査ログを Amazon S3 バケットに転送したりできます。詳細については、[バックアップファイルのエクスポート](./export-backup-files) または [監査ログ](./audit-logs) を参照してください。

## 統合の管理{#manage-integrations}

統合が追加されると、その詳細を表示したり、必要に応じて統合を削除したりできます。

![YODhb5leToWLsjxGRrpcyuZNnPb](https://zdoc-images.s3.us-west-2.amazonaws.com/yodhb5letowlsjxgrrpcyuznnpb.png "YODhb5leToWLsjxGRrpcyuZNnPb")

### 統合 ID の取得{#obtain-the-integration-id}

RESTful API を使用して、Zilliz Cloud と統合された AWS S3 バケットのいずれかにバックアップファイルをエクスポートする必要がある場合は、**詳細を表示** をクリックして統合の詳細を表示し、その統合 ID をコピーします。

## トラブルシューティング{#troubleshooting}

統合プロセス中に問題が発生した場合は、一般的なエラーメッセージとその解決策を以下に示します。

### バケットリージョンの不一致{#bucket-region-mismatch}

**説明**: 次の例のエラーは、S3 バケットのリージョンが Zilliz Cloud クラスターのリージョンと一致しない場合に発生します。

```plaintext
"bucket region not match, want[us-west-1] got[us-west-2]"
```

**解決策**:

- S3 バケットが配置されている AWS リージョンが、Zilliz Cloud クラスターのリージョンと一致していることを確認します。

- 必要に応じて、正しいリージョンに新しいバケットを作成するか、バケットのリージョンに合わせてクラスターのリージョンを調整します。

### バケットが見つかりません{#bucket-not-found}

**説明**: このエラーは、指定された S3 バケットが存在しないか、バケット名が正しくない場合に発生します。

```plaintext
check bucket failed: get bucket location: operation error S3: GetBucketLocation, https response error StatusCode: 404, RequestID: ..., HostID: ..., api error NoSuchBucket: The specified bucket does not exis
```

**解決策**:

- Zilliz CloudコンソールとAWS S3コンソールの両方でバケット名を再確認します。

- バケットが存在し、Zilliz Cloudの設定に名前が正しく入力されていることを確認します。

### バケットの場所へのアクセスが拒否されました{#access-denied-for-bucket-location}

**説明**: このエラーは、IAMロールにS3バケットの場所へのアクセスに必要な権限がない場合に発生します。

```plaintext
check bucket failed: get bucket location: operation error S3: GetBucketLocation, https response error StatusCode: 403 ...
```

**解決策**:

- Zilliz Cloudが使用しているロールにアタッチされているIAMポリシーを確認します。

- ポリシーに`s3:GetBucketLocation`権限と、`s3:GetObject`、`s3:PutObject`、`s3:ListBucket`などの他の必要な権限が含まれていることを確認します。

### ロール引き受けの失敗{#role-assumption-failure}

**説明**: このエラーは、IAMロールのARN、外部ID、または信頼ポリシーが正しくないために、IAMロールの引き受けに問題がある場合に発生します。

```sql
try assume role from[zilliz-role] to [arn:aws:iam::041623484421:role/testoss121703] with externalId[zilliz-external-1umVCIK7q96kzDE] failed
```

**解決策**:

- Zilliz Cloud コンソール上のロール ARN と外部 ID が、IAM 信頼ポリシーの対応する値と一致していることを確認します。

- IAM ロールの信頼ポリシーが、Zilliz Cloud がロールを引き受けることを許可していることを確認します。

