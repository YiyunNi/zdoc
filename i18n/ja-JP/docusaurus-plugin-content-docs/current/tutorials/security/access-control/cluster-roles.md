---
title: "クラスターロールの管理 (Console) | Cloud"
slug: /cluster-roles
sidebar_label: "クラスターロールの管理 (Console)"
beta: FALSE
notebook: FALSE
description: "クラスターロールは、ユーザーがクラスター内で持つ権限を定義します。より具体的には、クラスターロールは、クラスター、データベース、およびコレクションレベルでのクラスターユーザーの権限を制御します。 | Cloud"
type: origin
token: YHG0wCYxfiZILvkZ2VLclmvsn7g
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - クラスター
  - アクセス制御
  - rbac
  - ロール
  - milvus
  - Zilliz
  - milvus vector database
  - milvus db

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# クラスターロールの管理 (コンソール)

クラスターロールは、ユーザーがクラスター内で持つ権限を定義します。より具体的には、クラスターロールは、クラスターユーザーのクラスター、データベース、およびコレクションレベルでの権限を制御します。

Zilliz Cloudは、組み込みロールとカスタムロールの2種類のクラスターロールを提供します。

クラスターロールを管理するには、**Organization Owner** または **Project Admin** であるか、**Cluster_Admin** 権限を持つロールが必要です。

## 組み込みクラスターロール{#built-in-cluster-roles}

Zilliz Cloudは、ベクトルデータベースシステムで一般的に必要とされる異なる権限を持つ3つの組み込みクラスターロールを提供します。組み込みロールは編集または削除できません。

- **Admin**: クラスター管理者ロールは、クラスターとそのすべてのリソース (データベース、コレクション) を管理するための完全な権限を持ちます。

    次の表に、このロールに対応するUIおよびAPI権限を示します。

    <table>
       <tr>
         <th><p><strong>UI権限</strong></p></th>
         <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
       </tr>
       <tr>
         <td><ul><li><p>クラスタープロパティ (CUサイズ、レプリカ数、オートスケール) の管理</p></li><li><p>コレクションとインデックスの管理</p></li><li><p>クラスターメトリクスの表示</p></li><li><p>クラスターユーザーとロールの管理</p></li><li><p>クラスターバックアップの管理</p></li></ul></td>
         <td><ul><li><p><a href="/reference/restful/collection-operations-v2">すべてのコレクション操作</a></p></li><li><p><a href="/reference/restful/index-operations-v2">すべてのインデックス操作</a></p></li><li><p><a href="/reference/restful/partition-operations-v2">すべてのパーティション操作</a></p></li><li><p><a href="/reference/restful/vector-operations-v2">すべてのベクトル操作</a></p></li><li><p><a href="/reference/restful/alias-operations-v2">すべてのエイリアス操作</a></p></li><li><p><a href="/reference/restful/role-operations-v2">すべてのロール操作</a></p></li><li><p><a href="/reference/restful/user-operations-v2">すべてのユーザー操作</a></p></li></ul></td>
       </tr>
    </table>

- **Read-Write**: クラスター読み書きロールは、クラスターを表示し、そのすべてのリソース (データベース、コレクション) を管理する権限を持ちます。

    次の表に、このロールに対応するUIおよびAPI権限を示します。

    <table>
       <tr>
         <th><p><strong>UI権限</strong></p></th>
         <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
       </tr>
       <tr>
         <td><ul><li><p>コレクションとインデックスの管理</p></li><li><p>クラスターメトリクスの表示</p></li><li><p>クラスターユーザーとロールの表示</p></li><li><p>クラスターバックアップの表示</p></li></ul></td>
         <td><ul><li><p><a href="/reference/restful/collection-operations-v2">すべてのコレクション操作</a></p></li><li><p><a href="/reference/restful/index-operations-v2">すべてのインデックス操作</a></p></li><li><p><a href="/reference/restful/partition-operations-v2">すべてのパーティション操作</a></p></li><li><p><a href="/reference/restful/vector-operations-v2">すべてのベクトル操作</a></p></li><li><p><a href="/reference/restful/alias-operations-v2">すべてのエイリアス操作</a></p></li></ul></td>
       </tr>
    </table>

- **Read-Only**: クラスター読み取り専用ロールは、クラスターとそのリソース (データベース、コレクション) を表示する権限を持ちます。

    次の表に、このロールに対応するUIおよびAPI権限を示します。

    <table>
       <tr>
         <th><p><strong>UI権限</strong></p></th>
         <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
       </tr>
       <tr>
         <td><ul><li><p>コレクションとインデックスの表示</p></li><li><p>クラスターメトリクスの表示</p></li><li><p>クラスターユーザーとロールの表示</p></li><li><p>クラスターバックアップの表示</p></li></ul></td>
         <td><ul><li><p>コレクション操作の一部</p><ul><li><p><a href="/reference/restful/describe-collection-v2">コレクションの記述</a></p></li><li><p><a href="/reference/restful/get-collection-load-state-v2">コレクションロード状態の取得</a></p></li><li><p><a href="/reference/restful/get-collection-stats-v2">コレクション統計の取得</a></p></li><li><p><a href="/reference/restful/has-collection-v2">コレクションの有無</a></p></li><li><p><a href="/reference/restful/list-collections-v2">コレクションのリスト</a></p></li></ul></li><li><p>インデックス操作の一部</p><ul><li><p><a href="/reference/restful/describe-index-v2">インデックスの記述</a></p></li><li><p><a href="/reference/restful/list-indexes-v2">インデックスのリスト</a></p></li></ul></li><li><p>パーティション操作の一部</p><ul><li><p><a href="/reference/restful/get-partition-statistics-v2">パーティション統計の取得</a></p></li><li><p><a href="/reference/restful/has-partition-v2">パーティションの有無</a></p></li><li><p><a href="/reference/restful/list-partitions-v2">パーティションのリスト</a></p></li></ul></li><li><p>エイリアス操作の一部</p><ul><li><p><a href="/reference/restful/describe-alias-v2">エイリアスの記述</a></p></li><li><p><a href="/reference/restful/list-aliases-v2">エイリアスのリスト</a></p></li></ul></li></ul></td>
       </tr>
    </table>

## カスタムクラスターロール{#custom-cluster-roles}

カスタムロールは、事前定義されたアクセスを提供する組み込みロールとは異なり、クラスター、データベース、およびコレクションレベルでカスタマイズされた権限を付与する柔軟性を提供します。

コレクションレベルのアクセス制御には、カスタムロールを作成することをお勧めします。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能はDedicatedクラスターでのみ利用可能です。</p>
<p>現在、Zilliz CloudはWebコンソールで組み込みの権限グループを持つカスタムロールの作成のみをサポートしています。特定の権限またはカスタム権限グループを持つカスタムロールを作成する必要がある場合は、まず<a href="http://support.zilliz.com">サポートチケットを作成</a>して、この機能を有効にしてください。機能が有効になったら、SDKを使用して<a href="./cluster-privileges#custom-privilege-groups">カスタム権限グループを作成</a>できます。</p>

</Admonition>

## カスタムクラスターロールの作成{#create-a-custom-cluster-role}

<Procedures>

1. ターゲットクラスターの**Roles**タブに移動します。**+ Cluster Role**をクリックします。

    ![add-cluster-role](https://zdoc-images.s3.us-west-2.amazonaws.com/add-cluster-role.png "add-cluster-role")

1. ロール名を入力します。

1. コレクション、データベース、およびクラスターレベルで権限を設定します。組み込みの権限グループを選択し、ターゲットリソースを選択します。

    Zilliz Cloudは合計9つの組み込み権限グループを提供します。

    - コレクション権限グループ: Admin (`COLL_ADMIN`)、Read-Write (`COLL_RW`)、Read-Only (`COLL_RO`)

    - データベース権限グループ: Admin (`DB_Admin`)、Read-Write (`DB_RW`)、Read-Only (`DB_RO`)

    - クラスター権限グループ: Admin (`Cluster_Admin`)、Read-Write (`Cluster_RW`)、Read-Only (`Cluster_RO`)

    <Admonition type="info" icon="📘" title="Notes">

    <p>3つのレベルの組み込み権限グループにはカスケード関係がありません。インスタンスレベルで組み込み権限グループを設定しても、そのインスタンス下のすべてのデータベースとコレクションに自動的に権限が設定されるわけではありません。データベースおよびコレクションレベルの権限は手動で設定する必要があります。</p>

    </Admonition>

    各組み込み権限グループの特定の権限の詳細については、[権限と権限グループ](./cluster-privileges#built-in-privilege-groups)を参照してください。

    ![add-cluster-role-form](https://zdoc-images.s3.us-west-2.amazonaws.com/add-cluster-role-form.png "add-cluster-role-form")

1. **Create**をクリックします。各クラスターは最大20個のカスタムクラスターロールを持つことができます。

</Procedures>

## ユーザーにロールを付与する{#grant-a-role-to-a-user}

クラスターロールが作成されたら、それをユーザーに付与できます。Usersタブに移動し、[新しいクラスターユーザーを作成する](./cluster-users#create-a-cluster-user)際、または[既存のクラスターユーザーのロールを編集する](./cluster-users#edit-the-role-of-a-cluster-user)際にロールを付与します。

![grant-role-to-user](https://zdoc-images.s3.us-west-2.amazonaws.com/grant-role-to-user.png "grant-role-to-user")

## ユーザーからロールを取り消す{#revoke-a-role-from-a-user}

クラスターロールがユーザーに適さなくなった場合、そのロールを取り消すことができます。Usersタブに移動し、ターゲットユーザーを見つけて[ロールを編集](./cluster-users#edit-the-role-of-a-cluster-user)をクリックします。ダイアログボックスで別のロールを選択します。

![revoke-role-from-user](https://zdoc-images.s3.us-west-2.amazonaws.com/revoke-role-from-user.png "revoke-role-from-user")

## カスタムクラスターロールの編集{#edit-a-custom-cluster-role}

カスタムクラスターロールの権限を調整できます。調整は、このロールが付与されているすべてのユーザーに適用されます。

![edit-custom-role](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-custom-role.png "edit-custom-role")

## カスタムクラスターロールの削除{#delete-a-custom-cluster-role}

ロールが不要になった場合、カスタムクラスターロールを削除できます。

ユーザーに付与されているロールは削除できません。まず、ターゲットロールが付与されているユーザーを特定し、別のロールを割り当てる必要があります。

![delete-cluster-role](https://zdoc-images.s3.us-west-2.amazonaws.com/delete-cluster-role.png "delete-cluster-role")

