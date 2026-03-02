---
title: "クラスターユーザーの管理 (コンソール) | BYOC"
slug: /cluster-users
sidebar_label: "クラスターユーザーの管理 (コンソール)"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでは、クラスターユーザーを作成し、クラスターロールを割り当てることで、権限を定義し、データセキュリティを実現できます。 | BYOC"
type: origin
token: CWT2wh5YriZfPZkGlgCcWxVnnAf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - クラスター
  - アクセスコントロール
  - rbac
  - ユーザー
  - 概要
  - Pinecone vector database
  - 音声検索
  - セマンティック検索とは
  - Embedding model

---

import Admonition from '@theme/Admonition';


# クラスターユーザーの管理 (コンソール)

Zilliz Cloudでは、クラスターユーザーを作成し、クラスターロールを割り当てることで、権限を定義し、データセキュリティを実現できます。

クラスターの作成時に、`db_admin`という名前のデフォルトユーザーが自動的に生成されます。このユーザーは削除できません。このデフォルトユーザーに加えて、よりきめ細やかなアクセス制御のために、追加のクラスターユーザーを作成できます。

クラスターユーザーを管理するには、**Organization Owner**または**Project Admin**であるか、**Cluster_Admin**権限を持つロールが必要です。

## クラスターユーザーの作成{#create-a-cluster-user}

クラスターユーザーを作成する際には、以下の情報が必要です。

- ユーザー名を入力します。

- このユーザーに、組み込みのクラスターロールまたは[カスタムクラスターロール](./cluster-roles)のいずれかを付与します。

- このクラスターユーザーのパスワードを設定します。このパスワードは[認証](./cluster-credentials)に使用されます。

![add-cluster-user](https://zdoc-images.s3.us-west-2.amazonaws.com/add-cluster-user.png "add-cluster-user")

<Admonition type="info" icon="📘" title="Notes">

<p>各クラスターには最大100人のクラスターユーザーを設定できます。</p>

</Admonition>

## クラスターユーザーのロールを編集する{#edit-the-role-of-a-cluster-user}

![edit-cluster-user-role](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-cluster-user-role.png "edit-cluster-user-role")

## クラスターユーザーを削除する{#drop-a-cluster-user}

<Admonition type="info" icon="📘" title="Notes">

<p>デフォルトユーザーの<strong>db_admin</strong>は削除できません。</p>

</Admonition>

![drop-cluster-user](https://zdoc-images.s3.us-west-2.amazonaws.com/drop-cluster-user.png "drop-cluster-user")

