---
title: "クラスターユーザーの管理（コンソール） | Cloud"
slug: /cluster-users
sidebar_key: cluster-users
sidebar_label: "クラスターユーザーの管理（コンソール）"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、クラスターユーザーを作成し、クラスターロールを割り当てて権限を定義することで、データセキュリティを実現できます。"
type: origin
token: CWT2wh5YriZfPZkGlgCcWxVnnAf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - cluster
  - アクセス制御
  - rbac
  - users
  - 概要

---

import Admonition from '@theme/Admonition';


# クラスターユーザーの管理（コンソール）

Zilliz Cloud では、クラスターユーザーを作成し、クラスターロールを割り当てることで権限を定義し、データセキュリティを実現できます。

クラスターの作成時に、デフォルトのユーザー `db_admin` が自動的に生成されます。このユーザーは削除できません。このデフォルトユーザーに加えて、きめ細かなアクセス制御のためにさらにクラスターユーザーを作成できます。

クラスターユーザーを管理するには、**組織オーナー**、**プロジェクト管理者**、または **Cluster_Admin** 権限を持つロールが必要です。

<Admonition type="info" icon="📘" title="Notes">

この機能は **Dedicated** クラスターでのみ利用可能です。

</Admonition>

## クラスターユーザーの作成\{#create-a-cluster-user}

クラスターユーザーを作成する際には、以下が必要です：

- ユーザー名を入力する。

- このユーザーに組み込みのクラスターロールまたは[カスタムクラスターロール](./cluster-roles)を付与する。

- このクラスターユーザーのパスワードを設定する。このパスワードは[認証](./cluster-credentials)に使用されます。

![add-cluster-user](https://zdoc-images.s3.us-west-2.amazonaws.com/add-cluster-user.png "add-cluster-user")

<Admonition type="info" icon="📘" title="Notes">

各クラスターには最大 100 人のクラスターユーザーを作成できます。

</Admonition>

## クラスターユーザーのロールの編集\{#edit-the-role-of-a-cluster-user}

![edit-cluster-user-role](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-cluster-user-role.png "edit-cluster-user-role")

## クラスターユーザーの削除\{#drop-a-cluster-user}

<Admonition type="info" icon="📘" title="Notes">

デフォルトのユーザー **db_admin** は削除できません。

</Admonition>

![drop-cluster-user](https://zdoc-images.s3.us-west-2.amazonaws.com/drop-cluster-user.png "drop-cluster-user")

