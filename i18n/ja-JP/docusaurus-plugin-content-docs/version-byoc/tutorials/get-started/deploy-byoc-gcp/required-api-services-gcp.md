---
title: "必要なGCP APIサービス | BYOC"
slug: /required-api-services-gcp
sidebar_label: "必要なGCP APIサービス"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、Zilliz Cloud Terraform Providerを使用してGCPリソースを作成するために必要なGoogle Cloud Platform (GCP) APIサービスをリストし、それらを有効にするためのいくつかの方法を提供します。 | BYOC"
type: origin
token: WOQHwAlG0ibUgQkM18PcArMWnOc
sidebar_position: 6
keywords: 
  - zilliz
  - byoc
  - byoc-i
  - gcp
  - 権限
  - 最小権限
  - milvus
  - ベクトルデータベース
  - llm eval
  - Sparse vs Dense
  - Dense vector
  - Hierarchical Navigable Small Worlds

---

import Admonition from '@theme/Admonition';


# 必要なGCP APIサービス

このページでは、Zilliz Cloud Terraform Providerを使用してGCPリソースを作成するために必要なGoogle Cloud Platform（GCP）APIサービスと、それらを有効にするためのいくつかの方法をリストします。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz BYOCは現在、<strong>一般提供</strong>されています。アクセスおよび実装の詳細については、<a href="https://zilliz.com/contact-sales">Zilliz Cloud営業</a>にお問い合わせください。</p>

</Admonition>

## 必要なAPIサービス{#required-api-services}

<table>
   <tr>
     <th><p>APIサービス</p></th>
     <th><p>目的</p></th>
   </tr>
   <tr>
     <td><p><a href="http://compute.googleapis.com">compute.googleapis.com</a></p></td>
     <td><p>VPC、サブネット、およびネットワークリソース</p></td>
   </tr>
   <tr>
     <td><p><a href="http://container.googleapis.com">container.googleapis.com</a></p></td>
     <td><p>GKEクラスター管理</p></td>
   </tr>
   <tr>
     <td><p><a href="http://storage.googleapis.com">storage.googleapis.com</a></p></td>
     <td><p>GCSバケット操作</p></td>
   </tr>
   <tr>
     <td><p><a href="http://iam.googleapis.com">iam.googleapis.com</a></p></td>
     <td><p>サービスアカウントとIAMロール</p></td>
   </tr>
   <tr>
     <td><p><a href="http://servicenetworking.googleapis.com">servicenetworking.googleapis.com</a></p></td>
     <td><p>Private Service ConnectとVPCピアリング</p></td>
   </tr>
   <tr>
     <td><p><a href="http://cloudresourcemanager.googleapis.com">cloudresourcemanager.googleapis.com</a></p></td>
     <td><p>プロジェクトレベルの権限とIAM</p></td>
   </tr>
</table>

## 必要なAPIサービスを有効にする{#enable-required-api-services}

これらのAPIサービスは、GCPコンソールまたはgcloud CLIを使用して有効にできます。詳細な手順については、[このドキュメント](https://cloud.google.com/endpoints/docs/openapi/enable-api#enabling_an_api)を参照してください。上記にリストされているAPIサービスをgcloud CLIを使用して有効にするには、次のようにします。

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

<ul>
<li><p>上記のコマンドを実行する前に、これらのサービスを有効にするための十分な権限があることを確認してください。そうでない場合は、まずGCPプロジェクトのセキュリティ管理者に依頼してください。</p></li>
<li><p>上記のコマンドの<code>PROJECT_ID</code>をGCPプロジェクトIDに置き換える必要があります。</p></li>
</ul>

</Admonition>

## 結果の確認{#verify-the-results}

上記のAPIサービスが有効になっているかどうかは、GCPコンソールまたはgcloud CLIを使用して確認できます。

### GCPコンソールで{#on-the-gcp-console}

1. [APIとサービスダッシュボード](https://console.cloud.google.com/apis/dashboard)にアクセスします。

1. プロジェクトを選択します。

1. ライブラリで有効になっているAPIを確認します。

### gcloud CLIを使用する{#using-the-gcloud-cli}

```bash
gcloud services list --enabled --project=PROJECT_ID
```

<Admonition type="info" icon="📘" title="Notes">

<p>上記のコマンドの <code>PROJECT_ID</code> をGCPプロジェクトIDに置き換える必要があります。</p>

</Admonition>

