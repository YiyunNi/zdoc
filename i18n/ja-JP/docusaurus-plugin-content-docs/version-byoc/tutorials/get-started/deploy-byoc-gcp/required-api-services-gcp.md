---
title: "必要な GCP API サービス | BYOC"
slug: /required-api-services-gcp
sidebar_key: required-api-services-gcp
sidebar_label: "必要な GCP API サービス"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud Terraform Provider を使用して GCP リソースを作成するために必要な Google Cloud Platform（GCP）API サービスを一覧表示し、それらを有効にするいくつかの方法を提供します。 | BYOC"
type: origin
token: WOQHwAlG0ibUgQkM18PcArMWnOc
sidebar_position: 6
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - gcp
  - 権限
  - 最小限の権限
  - milvus
  - ベクトルデータベース

---

import Admonition from '@theme/Admonition';


# 必要な GCP API サービス

このページでは、Zilliz Cloud Terraform Provider を使用して GCP リソースを作成するために必要な Google Cloud Platform (GCP) API サービスを一覧表示し、それらを有効化するいくつかの方法を提供します。

<Admonition type="info" icon="📘" title="Notes">

Zilliz BYOC は現在 **一般提供** されています。アクセスおよび実装の詳細については、[Zilliz Cloud 営業](https://zilliz.com/contact-sales) までお問い合わせください。

</Admonition>

## 必要な API サービス\{#required-api-services}

<table>
   <tr>
     <th><p>API サービス</p></th>
     <th><p>目的</p></th>
   </tr>
   <tr>
     <td><p><a href="http://compute.googleapis.com">compute.googleapis.com</a></p></td>
     <td><p>VPC、サブネット、およびネットワークリソース</p></td>
   </tr>
   <tr>
     <td><p><a href="http://container.googleapis.com">container.googleapis.com</a></p></td>
     <td><p>GKE クラスター管理</p></td>
   </tr>
   <tr>
     <td><p><a href="http://storage.googleapis.com">storage.googleapis.com</a></p></td>
     <td><p>GCS バケット操作</p></td>
   </tr>
   <tr>
     <td><p><a href="http://iam.googleapis.com">iam.googleapis.com</a></p></td>
     <td><p>サービスアカウントおよび IAM ロール</p></td>
   </tr>
   <tr>
     <td><p><a href="http://servicenetworking.googleapis.com">servicenetworking.googleapis.com</a></p></td>
     <td><p>プライベート Service Connect および VPC ピアリング</p></td>
   </tr>
   <tr>
     <td><p><a href="http://cloudresourcemanager.googleapis.com">cloudresourcemanager.googleapis.com</a></p></td>
     <td><p>プロジェクトレベルの権限および IAM</p></td>
   </tr>
</table>

## 必要な API サービスの有効化\{#enable-required-api-services}

これらの API サービスは、GCP コンソールまたは gcloud CLI を使用して有効化できます。詳細な手順については、[このドキュメント](https://cloud.google.com/endpoints/docs/openapi/enable-api#enabling_an_api) を参照してください。上記の API サービスを gcloud CLI を使用して有効化するには、以下のように実行します。

```shell
gcloud services enable \
  compute.googleapis.com \
  container.googleapis.com \
  storage.googleapis.com \
  iam.googleapis.com \
  servicenetworking.googleapis.com \
  cloudresourcemanager.googleapis.com \
  --project=PROJECT_ID
```

<Admonition type="info" icon="📘" title="Notes">

- 上記のコマンドを実行する前に、これらのサービスを有効化するための十分な権限があることを確認してください。権限がない場合は、まず GCP プロジェクトのセキュリティ管理者に確認してください。

- 上記のコマンド内の `PROJECT_ID` は、お使いの GCP プロジェクト ID に置き換える必要があります。

</Admonition>

## 結果の確認\{#verify-the-results}

上記の API サービスが有効化されているかどうかは、GCP コンソールまたは gcloud CLI を使用して確認できます。

### GCP コンソールでの確認\{#on-the-gcp-console}

1. [API & Services ダッシュボード](https://console.cloud.google.com/apis/dashboard) にアクセスします。

1. プロジェクトを選択します。

1. ライブラリで有効化された API を確認します。

### gcloud CLI を使用する場合\{#using-the-gcloud-cli}

```bash
gcloud services list --enabled --project=PROJECT_ID
```

<Admonition type="info" icon="📘" title="Notes">

上記のコマンド内の `PROJECT_ID` は、お使いの GCP プロジェクト ID に置き換える必要があります。

</Admonition>

