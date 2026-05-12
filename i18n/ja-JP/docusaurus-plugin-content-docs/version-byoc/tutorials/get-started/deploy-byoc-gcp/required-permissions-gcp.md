---
title: "必要な権限 | BYOC"
slug: /required-permissions-gcp
sidebar_key: required-permissions-gcp
sidebar_label: "必要な権限"
beta: CONTACT SALES
notebook: FALSE
description: "このページでは、お客様のVPCネットワーク上にZilliz BYOCデータプレーンをデプロイする際に必要なIAMポリシーを一覧で紹介します。 | BYOC"
type: origin
token: ERIwwzvfuiLYIik9R4Ec0gCrnLb
sidebar_position: 5
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


# 必要な権限

このページでは、お客様の VPCネットワーク 上に Zilliz BYOC データプレーンをデプロイする際に必要な IAM ポリシーを一覧表示します。

<Admonition type="info" icon="📘" title="Notes">

Zilliz BYOC は現在 **一般提供** されています。アクセスおよび実装の詳細については、[Zilliz Cloud セールス](https://zilliz.com/contact-sales) までお問い合わせください。

</Admonition>

## ストレージ サービスアカウント\{#storage-service-account}

Cloud Storage バケット とストレージ サービスアカウント を作成する必要があります。これにより、Zilliz Cloud はその サービスアカウント を引き受けて バケット にアクセスできます。

次の表は、ストレージ サービスアカウント に割り当てるべき ロール を一覧表示しています。

<table>
   <tr>
     <th><p>ロール</p></th>
     <th><p>説明</p></th>
     <th><p>条件</p></th>
   </tr>
   <tr>
     <td><p><a href="https://cloud.google.com/iam/docs/roles-permissions/storage#storage.objectAdmin">Storage Object Admin</a></p></td>
     <td><p>オブジェクトの完全な制御権限を付与します。これには、オブジェクトの一覧表示、作成、表示、削除が含まれます。</p></td>
     <td><p>対象の バケット 名</p></td>
   </tr>
   <tr>
     <td><p><a href="https://cloud.google.com/iam/docs/roles-permissions/storage#storage.objectAdmin">Storage バケット Viewer</a></p></td>
     <td><p>IAM ポリシーを除き、バケット とそのメタデータを表示する権限を付与します。</p></td>
     <td><p>対象の バケット 名</p></td>
   </tr>
</table>

## GKE サービスアカウント\{#gke-service-account}

GKE サービスアカウント を作成する必要があります。これにより、Zilliz Cloud はこの サービスアカウント を引き受けて GKE クラスターを管理できます。

次の表は、GKE サービスアカウント に割り当てるべき ロール を一覧表示しています。

<table>
   <tr>
     <th><p>ロール</p></th>
     <th><p>説明</p></th>
     <th><p>条件</p></th>
   </tr>
   <tr>
     <td><p><a href="https://cloud.google.com/iam/docs/roles-permissions/container#container.defaultNodeServiceアカウント">Kubernetes Engine Default Node Service アカウント</a></p></td>
     <td><p>GKE ノードがロギングやモニタリングなどの標準機能をサポートするために必要な最小限の権限セットです。</p></td>
     <td><p>--</p></td>
   </tr>
</table>

## クロスアカウント サービスアカウント\{#cross-account-service-account}

クロスアカウント サービスアカウント を作成する必要があります。これにより、Zilliz Cloud はこの サービスアカウント を引き受けてネットワークリソースを管理できます。

次の表は、クロスアカウント サービスアカウント に割り当てるべき ロール を一覧表示しています。

<table>
   <tr>
     <th><p>ロール</p></th>
     <th><p>説明</p></th>
     <th><p>条件</p></th>
   </tr>
   <tr>
     <td><p><a href="https://cloud.google.com/iam/docs/roles-permissions/storage#storage.objectAdmin">Storage バケット Viewer</a></p></td>
     <td><p>IAM ポリシーを除き、バケット とそのメタデータを表示する権限を付与します。</p></td>
     <td><p>対象の バケット 名</p></td>
   </tr>
   <tr>
     <td><p><a href="https://cloud.google.com/iam/docs/roles-permissions/container#container.admin">Kubernetes Engine Admin</a></p></td>
     <td><p>クラスターとその Kubernetes API オブジェクトの完全な管理へのアクセスを提供します。</p></td>
     <td><p>--</p></td>
   </tr>
   <tr>
     <td><p><a href="./create-cross-account-sa">Instance Group Manager Custom ロール</a></p></td>
     <td><p>以下の権限をバインドします：</p><ul><li><p><a href="https://cloud.google.com/compute/docs/reference/rest/v1/instanceGroupManagers/get">compute.instanceGroupManagers.get</a></p></li><li><p><a href="https://cloud.google.com/compute/docs/reference/rest/v1/instanceGroupManagers/update">compute.instanceGroupManagers.update</a></p></li></ul></td>
     <td><p>作成する GKE クラスター名</p></td>
   </tr>
   <tr>
     <td><p><a href="./create-cross-account-sa">IAM Custom ロール</a></p></td>
     <td><p>以下の権限をバインドします：</p><ul><li><p><a href="https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceアカウントs/getIamPolicy">iam.serviceアカウントs.getIamPolicy</a></p></li><li><p><a href="https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceアカウントs/setIamPolicy">iam.serviceアカウントs.setIamPolicy</a></p></li></ul></td>
     <td></td>
   </tr>
   <tr>
     <td><p><a href="https://cloud.google.com/iam/docs/roles-permissions/iam#iam.serviceアカウントUser">Service アカウント User</a></p></td>
     <td><p>サービスアカウント として操作を実行します。</p></td>
     <td><p>--</p></td>
   </tr>
</table>

