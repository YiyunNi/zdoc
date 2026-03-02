---
title: "Google Cloud Storage との統合 | Cloud"
slug: /integrate-with-gcp
sidebar_label: "Google Cloud Storage"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、Google Cloud Storage と統合して、監査ログやバックアップファイルを指定されたバケットにエクスポートできます。 | Cloud"
type: origin
token: INoRwFTjfiindPkaNlwc9XAgnkh
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - サードパーティ
  - サービス
  - google
  - cloud
  - storage
  - Annoy ベクトル検索
  - milvus
  - Zilliz
  - milvus ベクトルデータベース

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

import Procedures from '@site/src/components/Procedures';

# Google Cloud Storage との統合

Zilliz Cloud は、[Google Cloud Storage](https://cloud.google.com/storage) と統合して、監査ログやバックアップファイルを指定されたバケットにエクスポートできます。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Enterprise</strong> プロジェクトの <strong>Dedicated</strong> クラスターでのみ利用可能です。</p>

</Admonition>

以下の図は、Zilliz Cloud と Google Admin コンソールで必要な手順を示しています。

![UNmxw6LdCh60Dob3j7KcHGXynkg](https://zdoc-images.s3.us-west-2.amazonaws.com/UNmxw6LdCh60Dob3j7KcHGXynkg.png)

## 開始する前に{#before-you-start}

- Zilliz Cloud を GCP と統合するには、プロジェクトへの **Organization Owner** または **Project Admin** アクセス権が必要です。必要な権限がない場合は、Zilliz Cloud 管理者に連絡してください。

- Google Admin コンソールへの管理者アクセス権があること。

## ステップ 1: Zilliz Cloud コンソールで統合を開始する{#step-1-start-integration-in-zilliz-cloud-console}

<Supademo id="cmdzpf4ze0t2bh5wkphtbn39l" title="Step 1: Start integration in Zilliz Cloud console" />

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にログインします。

1. プロジェクトページで、左側のナビゲーションペインから **Integrations** に移動します。

1. **Google Cloud Storage Bucket** セクションで、**+ Integration** をクリックします。

1. 表示されるダイアログボックスで、**Basic Settings** を完了します。

    - **Integration Name**: この統合の一意の名前 (例: `bucket_for_auditlog`)。

    - **Integration Description** *(オプション)*: この統合の説明 (例: `for auditlog export`)。

    次に、**Next** をクリックして、[ステップ 2](./integrate-with-gcp#step-2-create-a-role-in-google-admin-console) に進みます。

</Procedures>

## ステップ 2: Google Admin コンソールでロールを作成する{#step-2-create-a-role-in-google-admin-console}

<Supademo id="cmdzqastn0uw1h5wklj65425w" title="Step 2: Create role in Google Admin console" />

<Procedures>

1. [Google Admin コンソール](https://admin.google.com/)にログインします。

1. [IAM & Admin / Roles](https://console.cloud.google.com/iam-admin/roles) ページに移動し、**+ Create role** をクリックします。

1. 表示されるページで、ロール設定を構成し、ロールに権限を追加します。

    1. ロールの **Title** と **ID** をカスタマイズし (例: `ZillizBucketRole`)、オプションで **Description** を追加します。

    1. **+ Add permissions** をクリックし、以下の最小限の権限をロールに割り当てます。

        - `storage.buckets.get`

        - `storage.objects.create`

        - `storage.objects.list`

        - `storage.objects.get`

1. **Create** をクリックします。

</Procedures>

## ステップ 3: Google Admin コンソールでバケットを作成する{#step-3-create-a-bucket-in-google-admin-console}

<Supademo id="cme0qzcy102dbg56jx7ucft1c" title="Step 3: Create a bucket in Google Admin console (1)" />

<Procedures>

1. Google Cloud Storage の **[Buckets](https://console.cloud.google.com/storage/browser)** ページに移動します。

1. **+ Create** をクリックします。

1. **Create a bucket** ページで、バケット情報を入力します。以下の各ステップの後、**Continue** をクリックして次のステップに進みます。

    1. **Get started** セクションで、[バケット名の要件](https://cloud.google.com/storage/docs/buckets#naming)を満たすグローバルに一意の名前を入力します。Zilliz Cloud コンソールで名前を入力する必要があるため、バケット名を覚えておいてください。

    1. **Choose where to store your data** セクションで:

        1. **Location type** として **Region** を選択します ([https://cloud.google.com/storage/docs/locations](https://cloud.google.com/storage/docs/locations))。**Multi-region** または **Dual-region** オプションは選択しないでください。

        1. 次に、バケットを作成するリージョンを選択します。選択したロケーションは、Zilliz Cloud クラスターが存在するクラウドリージョンと同じである必要があります。

1. **Create** をクリックします。

</Procedures>

バケットが作成されたら、[Zilliz Cloud コンソール](https://cloud.zilliz.com/login)に戻り、以下を実行します。

<Supademo id="cme0rnexv02mng56joiwb4wrg" title="Step 3: Create a bucket in Google Admin console (2)" />

<Procedures>

1. **Add Google Cloud Storage Integration** ダイアログボックスで、**Step 3 - Create Google Cloud Storage Bucket** に進みます。

    1. **Zilliz Cloud Cluster Region** で、Zilliz Cloud クラスターのクラウドリージョンを選択します。このリージョンは、バケットが作成されたリージョンと同じである必要があります。

    1. **Bucket Name** に、作成したバケットの名前を入力します。

1. 次に、**Next** をクリックします。

1. その後、Zilliz Cloud コンソールから Google Cloud Service Account をコピーします。これは、[ステップ 4](./integrate-with-gcp#step-4-grant-access-to-bucket-in-google-admin-console) でバケットへのアクセスを許可する際に必要になります。

</Procedures>

## ステップ 4: Google Admin コンソールでバケットへのアクセスを許可する{#step-4-grant-access-to-bucket-in-google-admin-console}

<Supademo id="cme0s7wmr02phg56jw9hix3q1" title="Step 4: Grant access to bucket in Google Admin console" />

<Procedures>

1. [Google Admin コンソール](https://console.cloud.google.com/storage/)で、[ステップ 3](./integrate-with-gcp#step-3-create-a-bucket-in-google-admin-console) で作成したバケットの詳細ページに移動します。

1. **Permissions** タブで、**Grant access** をクリックします。

1. **Add principals** エリアに、Zilliz Cloud コンソールから取得した **Google Service Account** を貼り付けます。

1. **Assign roles** エリアで、[ステップ 2](./integrate-with-gcp#step-2-create-a-role-in-google-admin-console) で作成したロールを選択します。

1. **Save** をクリックします。

</Procedures>

## ステップ 5: 統合を検証して追加する{#step-5-validate-and-add-integration}

<Supademo id="cme0siceh02thg56jeh3wlbgw" title="Step 5: Validate and add integration" />

バケットへのアクセスを許可したら、Zilliz Cloud コンソールに戻り、以下を実行します。

<Procedures>

1. **Validate Integration** をクリックして、コンテナとロール割り当ての設定が有効であることを確認します。

1. 検証が成功したら、**Add** をクリックして統合を完了します。

</Procedures>

これで、Google Cloud Storage は監査ログまたはバックアップファイルのエクスポートのために Zilliz Cloud と統合されました。詳細については、[監査ログ](./audit-logs)または[バックアップファイルのエクスポート](./export-backup-files)を参照してください。

## 統合の管理{#manage-integrations}

統合が追加されたら、その詳細を表示したり、必要に応じて統合を削除したりできます。

![FKLYbB02LoDDA9xENiYccBTun5e](https://zdoc-images.s3.us-west-2.amazonaws.com/fklybb02lodda9xeniyccbtun5e.png "FKLYbB02LoDDA9xENiYccBTun5e")

## FAQ{#faq}

### 検証中に「bucket region not match」エラーが発生するのはなぜですか？{#why-do-i-get-a-bucket-region-not-match-error-during-validation}

このエラーは、次の 2 つの理由で発生する可能性があります。

1. バケットの **Location type** として **Multi-region** または **Dual-region** を選択しました。Zilliz Cloud は単一の **Region** バケットのみをサポートしています。

1. **Location type** として **Region** を選択しましたが、選択したリージョンが Zilliz Cloud クラスターのリージョンと正確に一致しません。

たとえば、Zilliz Cloud クラスターが `us-east1` にある場合、バケットは `us-east1` リージョンに作成する必要があります。Multi-region の「United States」や `us-west1` のような異なるリージョンではありません。

バケットが誤った **Location type** またはリージョンで作成された場合は、削除して正しい単一リージョン設定で再作成してください。