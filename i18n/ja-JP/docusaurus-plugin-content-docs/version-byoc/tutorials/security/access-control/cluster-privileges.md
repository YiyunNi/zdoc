---
title: "特権と特権グループ | BYOC"
slug: /cluster-privileges
sidebar_label: "特権と特権グループ"
beta: FALSE
notebook: FALSE
description: "特権とは、クラスター、データベース、コレクションなどの特定のZilliz Cloudリソースに対する特定の操作の許可を指します。特権はロールに割り当てられ、そのロールがユーザーに付与されることで、ユーザーがリソースに対して実行できる操作が定義されます。特権の例としては、`collection01`という名前のコレクションにデータを挿入する許可が挙げられます。 | BYOC"
type: origin
token: NitBwKVzzi0hXBkjdDFcfwRsngb
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - クラスター
  - アクセス制御
  - rbac
  - 特権
  - 画像類似性検索
  - Context Window
  - 自然言語検索
  - 類似性検索

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 特権と特権グループ

**特権**とは、クラスター、データベース、コレクションなどの特定のZilliz Cloudリソースに対する特定の操作の許可を指します。特権はロールに割り当てられ、そのロールがユーザーに付与されることで、ユーザーがリソースに対して実行できる操作が定義されます。特権の例としては、`collection_01`という名前のコレクションにデータを挿入する許可が挙げられます。

**特権グループ**は、個々の特権の組み合わせです。一般的に使用される特権の特権グループを作成することで、ロール付与プロセスを簡素化できます。使いやすさのために、Zilliz Cloudはコレクション、データベース、クラスターレベルで合計9つの組み込み特権グループを提供しています。

以下の図は、特権と特権グループの異なる付与プロセスを示しています。

![SsW6w8kaNhz4iQbEMYmcbUzsnOc](https://zdoc-images.s3.us-west-2.amazonaws.com/SsW6w8kaNhz4iQbEMYmcbUzsnOc.png)

このトピックでは、Zilliz Cloudで利用可能な組み込み特権グループと特権について詳しく説明します。

## 特権グループ{#privilege-group}

### 組み込み特権グループ{#built-in-privilege-groups}

Zilliz Cloudは、コレクション、データベース、クラスターレベルで合計9つの組み込み特権グループを提供しており、[ロールの作成](./cluster-roles)時に直接付与できます。

<Admonition type="info" icon="📘" title="Notes">

<p>組み込み特権グループの3つのレベルには、カスケード関係はありません。クラスターレベルで特権グループを設定しても、そのインスタンス下のすべてのデータベースとコレクションに自動的に権限が設定されるわけではありません。データベースおよびコレクションレベルの特権は手動で設定する必要があります。</p>

</Admonition>

#### コレクションレベルの特権グループ{#collection-level-privilege-groups}

- **CollectionReadOnly (COLL_RO)**: コレクションデータの読み取り特権が含まれます。

- **CollectionReadWrite (COLL_RW)**: コレクションデータの読み取りおよび書き込み特権が含まれます。

- **CollectionAdmin (COLL_ADMIN)**: コレクションデータの読み取りおよび書き込み、およびコレクションの管理特権が含まれます。

以下の表は、コレクションレベルの3つの組み込み特権グループに含まれる特定の特権をリストしています。

<table>
   <tr>
     <th><p><strong>特権</strong></p></th>
     <th><p><strong>CollectionReadOnly</strong></p></th>
     <th><p><strong>CollectionReadWrite</strong></p></th>
     <th><p><strong>CollectionAdmin</strong></p></th>
   </tr>
   <tr>
     <td><p>Query</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>Search</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>IndexDetail</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>GetFlushState</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>GetLoadState</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>GetLoadingProgress</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>HasPartition</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>ShowPartitions</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>ListAliases</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>DescribeCollection</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>DescribeAlias</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>GetStatistics</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>CreateIndex</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>DropIndex</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>CreatePartition</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>DropPartition</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>Load</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>Release</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>Insert</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>Delete</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>Upsert</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>Import</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>Flush</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>Compaction</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>LoadBalance</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>CreateAlias</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>DropAlias</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>AddCollectionField</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
</table>

#### データベースレベルの特権グループ{#database-level-privilege-groups}

- **DatabaseReadOnly (DB_RO)**: データベースデータの読み取り特権が含まれます。

- **DatabaseReadWrite (DB_RW)**: データベースデータの読み取りおよび書き込み特権が含まれます。

- **DatabaseAdmin (DB_Admin)**: データベースデータの読み取りおよび書き込み、およびデータベースの管理特権が含まれます。

以下の表は、データベースレベルの3つの組み込み特権グループに含まれる特定の特権をリストしています。

<table>
   <tr>
     <th><p><strong>特権</strong></p></th>
     <th><p><strong>DatabaseReadOnly</strong></p></th>
     <th><p><strong>DatabaseReadWrite</strong></p></th>
     <th><p><strong>DatabaseAdmin</strong></p></th>
   </tr>
   <tr>
     <td><p>ShowCollections</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>DescribeDatabase</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>CreateCollection</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>DropCollection</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>AlterDatabase</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
</table>

#### クラスターレベルの特権グループ{#cluster-level-privilege-groups}

- **ClusterReadOnly (Cluster_RO)**: インスタンスデータの読み取り特権が含まれます。

- **ClusterReadWrite (Cluster_RW)**: インスタンスデータの読み取りおよび書き込み特権が含まれます。

- **ClusterAdmin (Cluster_Admin)**: インスタンスデータの読み取りおよび書き込み、およびインスタンスの管理特権が含まれます。

以下の表は、クラスターレベルの3つの組み込み特権グループに含まれる特定の特権をリストしています。

<table>
   <tr>
     <th><p><strong>特権</strong></p></th>
     <th><p><strong>ClusterReadOnly</strong></p></th>
     <th><p><strong>ClusterReadWrite</strong></p></th>
     <th><p><strong>ClusterAdmin</strong></p></th>
   </tr>
   <tr>
     <td><p>ListDatabases</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>RenameCollection</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>CreateOwnership</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>UpdateUser</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>DropOwnership</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>SelectOwnership</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>ManageOwnership</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>SelectUser</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>BackupRBAC</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>RestoreRBAC</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>CreateResourceGroup</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>DropResourceGroup</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>UpdateResourceGroups</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>DescribeResourceGroup</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>ListResourceGroups</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>TransferNode</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>TransferReplica</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>CreateDatabase</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>DropDatabase</p></td>
     <td><p>❌</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>FlushAll</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>CreatePrivilegeGroup</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>DropPrivilegeGroup</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
   <tr>
     <td><p>ListPrivilegeGroups</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
     <td><p>✔️</p></td>
   </tr>
   <tr>
     <td><p>OperatePrivilegeGroup</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
     <td><p>❌</p></td>
   </tr>
</table>

### カスタム特権グループ{#custom-privilege-groups}

組み込みの特権がニーズに合わない場合は、SDKを使用してカスタム特権グループを作成し、指定された特権を特権グループに追加できます。

<Admonition type="info" icon="📘" title="Notes">

<p>カスタム特権グループを作成および管理するには、<a href="http://support.zilliz.com">サポートチケットを作成</a>して、この機能を有効にしてください。</p>

</Admonition>

#### カスタム特権グループの作成{#create-a-custom-privilege-group}

以下の例は、`privilege_group_1`という名前の特権グループを作成する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Go","value":"go"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient
client.create_privilege_group(group_name='privilege_group_1'）
```

</TabItem>

<TabItem value='go'>

```go
import "github.com/milvus-io/milvus/client/v2/milvusclient"

err = client.CreatePrivilegeGroup(ctx, milvusclient.NewCreatePrivilegeGroupOption("privilege_group_1"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.rbac.request.CreatePrivilegeGroupReq;

client.createPrivilegeGroup(CreatePrivilegeGroupReq.builder()
        .groupName("privilege_group_1")
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.createPrivilegeGroup({
  group_name: 'privilege_group_1',
});
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/privilege_groups/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "privilegeGroupName":"privilege_group_1"
}'
```

</TabItem>
</Tabs>

カスタム権限グループが作成されたら、その権限グループに権限を追加できます。

#### カスタム権限グループに権限を追加する{#add-privileges-to-a-custom-privilege-group}

以下の例は、作成したばかりの権限グループ `privilege_group_1` に `PrivilegeBackupRBAC` と `PrivilegeRestoreRBAC` の権限を追加する方法を示しています。Zilliz Cloud で利用可能なすべての権限の詳細については、[すべての権限](./cluster-privileges#all-privileges)を参照してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Go","value":"go"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient
client.add_privileges_to_group(group_name='privilege_group_1', privileges=['Query', 'Search'])
```

</TabItem>

<TabItem value='go'>

```go
import "github.com/milvus-io/milvus/client/v2/milvusclient"

privileges := []string{"Query", "Search"}
err = client.AddPrivilegesToGroup(ctx, milvusclient.NewAddPrivilegesToGroupOption("privilege_group_1", privileges...))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.rbac.request.AddPrivilegesToGroupReq;

client.addPrivilegesToGroup(AddPrivilegesToGroupReq.builder()
        .groupName("privilege_group_1")
        .privileges(Arrays.asList("Query", "Search"))
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.addPrivilegesToGroup({
  group_name: privilege_group_1,
  privileges: ['Query', 'Search'],
});

```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/privilege_groups/add_privileges_to_group" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "privilegeGroupName":"privilege_group_1",
    "privileges":["Query", "Search"]
}'
```

</TabItem>
</Tabs>

特権が特権グループに追加されたら、その特権グループをロールに付与できます。詳細については、「[クラスターロールの管理 (SDK)](./cluster-roles-sdk#grant-a-privilege-or-a-privilege-group-to-a-role)」を参照してください。

#### カスタム特権グループから特権を削除する {#remove-privileges-from-a-custom-privilege-group}

次の例は、特権グループ `privilege_group_1` から特権 `PrivilegeRestoreRBAC` を削除する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Go","value":"go"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient
client.remove_privileges_from_group(group_name='privilege_group_1', privileges='Search')
```

</TabItem>

<TabItem value='go'>

```go
import "github.com/milvus-io/milvus/client/v2/milvusclient"

err = client.RemovePrivilegesFromGroup(ctx, milvusclient.NewRemovePrivilegesFromGroupOption("privilege_group_1", []string{"Search"}...))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.rbac.request.RemovePrivilegesFromGroupReq;

client.removePrivilegesFromGroup(RemovePrivilegesFromGroupReq.builder()
        .groupName("privilege_group_1")
        .privileges(Collections.singletonList("Search"))
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.removePrivilegesFromGroup({
  group_name: "privilege_group_1",
  privileges: ["Search"],
});
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/privilege_groups/remove_privileges_from_group" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "privilegeGroupName":"privilege_group_1",
    "privileges":["Search"]
}'
```

</TabItem>
</Tabs>

#### 特権グループをリストする {#list-privilege-groups}

以下の例は、既存のすべての特権グループをリストする方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Go","value":"go"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient
client.list_privilege_groups()
```

</TabItem>

<TabItem value='go'>

```go
import "github.com/milvus-io/milvus/client/v2/milvusclient"

groups, err := client.ListPrivilegeGroups(ctx, milvusclient.NewListPrivilegeGroupsOption())
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.rbac.PrivilegeGroup;
import io.milvus.v2.service.rbac.request.ListPrivilegeGroupsReq;
import io.milvus.v2.service.rbac.response.ListPrivilegeGroupsResp;

ListPrivilegeGroupsResp resp = client.listPrivilegeGroups(ListPrivilegeGroupsReq.builder()
        .build());
List<PrivilegeGroup> groups = resp.getPrivilegeGroups();
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.listPrivilegeGroups();
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/privilege_groups/list" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{}'
```

</TabItem>
</Tabs>

以下は出力例です。

```bash
PrivilegeGroupItem: <privilege_group:privilege_group_1>, <privileges:('Search', 'Query')>
```

#### カスタム権限グループを削除する{#drop-a-custom-privilege-group}

以下の例は、権限グループ `privilege_group_1` を削除する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Go","value":"go"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient
client.drop_privilege_group(group_name='privilege_group_1')
```

</TabItem>

<TabItem value='go'>

```go
import "github.com/milvus-io/milvus/client/v2/milvusclient"

err = client.DropPrivilegeGroup(ctx, milvusclient.NewDropPrivilegeGroupOption("privilege_group_1"))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.rbac.request.DropPrivilegeGroupReq;

client.dropPrivilegeGroup(DropPrivilegeGroupReq.builder()
        .groupName("privilege_group_1")
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.dropPrivilegeGroup({group_name: 'privilege_group_1'});
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/privilege_groups/drop" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "privilegeGroupName":"privilege_group_1"
}'
```

</TabItem>
</Tabs>

## すべての権限 {#all-privileges}

以下は、Zilliz Cloudで利用可能なすべての権限です。

以下の権限を含む独自の権限グループを作成したり、権限を持つカスタムロールを作成する必要がある場合は、[お問い合わせください](http://support.zilliz.com)。

### データベース権限 {#database-privileges}

<table>
   <tr>
     <th><p><strong>権限</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>ListDatabases</p></td>
     <td><p>現在のインスタンス内のすべてのデータベースを表示する</p></td>
   </tr>
   <tr>
     <td><p>DescribeDatabase</p></td>
     <td><p>データベースの詳細を表示する</p></td>
   </tr>
   <tr>
     <td><p>CreateDatabase</p></td>
     <td><p>データベースを作成する</p></td>
   </tr>
   <tr>
     <td><p>DropDatabase</p></td>
     <td><p>データベースを削除する</p></td>
   </tr>
   <tr>
     <td><p>AlterDatabase</p></td>
     <td><p>データベースのプロパティを変更する</p></td>
   </tr>
</table>

### コレクション権限 {#collection-privileges}

<table>
   <tr>
     <th><p><strong>権限</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>GetFlushState</p></td>
     <td><p>コレクションのフラッシュ操作のステータスを確認する</p></td>
   </tr>
   <tr>
     <td><p>GetLoadState</p></td>
     <td><p>コレクションのロードステータスを確認する</p></td>
   </tr>
   <tr>
     <td><p>GetLoadingProgress</p></td>
     <td><p>コレクションのロード進行状況を確認する</p></td>
   </tr>
   <tr>
     <td><p>ShowCollections</p></td>
     <td><p>コレクション権限を持つすべてのコレクションを表示する</p></td>
   </tr>
   <tr>
     <td><p>ListAliases</p></td>
     <td><p>コレクションのすべてのエイリアスを表示する</p></td>
   </tr>
   <tr>
     <td><p>DescribeCollection</p></td>
     <td><p>コレクションの詳細を表示する</p></td>
   </tr>
   <tr>
     <td><p>DescribeAlias</p></td>
     <td><p>エイリアスの詳細を表示する</p></td>
   </tr>
   <tr>
     <td><p>GetStatistics</p></td>
     <td><p>コレクションの統計情報を取得する（例：コレクション内のエンティティ数）</p></td>
   </tr>
   <tr>
     <td><p>CreateCollection</p></td>
     <td><p>コレクションを作成する</p></td>
   </tr>
   <tr>
     <td><p>DropCollection</p></td>
     <td><p>コレクションを削除する</p></td>
   </tr>
   <tr>
     <td><p>Load</p></td>
     <td><p>コレクションをロードする</p></td>
   </tr>
   <tr>
     <td><p>Release</p></td>
     <td><p>コレクションをリリースする</p></td>
   </tr>
   <tr>
     <td><p>Flush</p></td>
     <td><p>コレクション内のすべてのエンティティをsealed segmentに永続化する。フラッシュ操作後に挿入されたエンティティは、新しいsegmentに保存される。</p></td>
   </tr>
   <tr>
     <td><p>Compaction</p></td>
     <td><p>手動でコンパクションをトリガーする</p></td>
   </tr>
   <tr>
     <td><p>RenameCollection</p></td>
     <td><p>コレクションの名前を変更する</p></td>
   </tr>
   <tr>
     <td><p>CreateAlias</p></td>
     <td><p>コレクションのエイリアスを作成する</p></td>
   </tr>
   <tr>
     <td><p>DropAlias</p></td>
     <td><p>コレクションのエイリアスを削除する</p></td>
   </tr>
   <tr>
     <td><p>FlushAll</p></td>
     <td><p>データベース内のすべてのコレクションをフラッシュする</p></td>
   </tr>
   <tr>
     <td><p>AddCollectionField</p></td>
     <td><p>既存のコレクションにフィールドを追加する</p></td>
   </tr>
</table>

### パーティション権限 {#partition-privileges}

<table>
   <tr>
     <th><p><strong>権限</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>HasPartition</p></td>
     <td><p>パーティションが存在するかどうかを確認する</p></td>
   </tr>
   <tr>
     <td><p>ShowPartitions</p></td>
     <td><p>コレクション内のすべてのパーティションを表示する</p></td>
   </tr>
   <tr>
     <td><p>CreatePartition</p></td>
     <td><p>パーティションを作成する</p></td>
   </tr>
   <tr>
     <td><p>DropPartition</p></td>
     <td><p>パーティションを削除する</p></td>
   </tr>
</table>

### インデックス権限 {#index-privileges}

<table>
   <tr>
     <th><p><strong>権限</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>IndexDetail</p></td>
     <td><p>インデックスの詳細を表示する</p></td>
   </tr>
   <tr>
     <td><p>CreateIndex</p></td>
     <td><p>インデックスを作成する</p></td>
   </tr>
   <tr>
     <td><p>DropIndex</p></td>
     <td><p>インデックスを削除する</p></td>
   </tr>
</table>

### リソース管理権限 {#resource-management-privileges}

<table>
   <tr>
     <th><p><strong>権限</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>LoadBalance</p></td>
     <td><p>ロードバランスを実現する</p></td>
   </tr>
   <tr>
     <td><p>CreateResourceGroup</p></td>
     <td><p>リソースグループを作成する</p></td>
   </tr>
   <tr>
     <td><p>DropResourceGroup</p></td>
     <td><p>リソースグループを削除する</p></td>
   </tr>
   <tr>
     <td><p>UpdateResourceGroups</p></td>
     <td><p>リソースグループを更新する</p></td>
   </tr>
   <tr>
     <td><p>DescribeResourceGroup</p></td>
     <td><p>リソースグループの詳細を表示する</p></td>
   </tr>
   <tr>
     <td><p>ListResourceGroups</p></td>
     <td><p>現在のインスタンスのすべてのリソースグループを表示する</p></td>
   </tr>
   <tr>
     <td><p>TransferNode</p></td>
     <td><p>リソースグループ間でノードを転送する</p></td>
   </tr>
   <tr>
     <td><p>TransferReplica</p></td>
     <td><p>リソースグループ間でレプリカを転送する</p></td>
   </tr>
   <tr>
     <td><p>BackupRBAC</p></td>
     <td><p>現在のインスタンス内のすべてのRBAC関連操作のバックアップを作成する</p></td>
   </tr>
   <tr>
     <td><p>RestoreRBAC</p></td>
     <td><p>現在のインスタンス内のすべてのRBAC関連操作のバックアップを復元する</p></td>
   </tr>
</table>

### エンティティ権限 {#entity-privileges}

<table>
   <tr>
     <th><p><strong>権限</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>Query</p></td>
     <td><p>クエリを実行する</p></td>
   </tr>
   <tr>
     <td><p>Search</p></td>
     <td><p>検索を実行する</p></td>
   </tr>
   <tr>
     <td><p>Insert</p></td>
     <td><p>エンティティを挿入する</p></td>
   </tr>
   <tr>
     <td><p>Delete</p></td>
     <td><p>エンティティを削除する</p></td>
   </tr>
   <tr>
     <td><p>Upsert</p></td>
     <td><p>エンティティをupsertする</p></td>
   </tr>
   <tr>
     <td><p>Import</p></td>
     <td><p>エンティティを一括挿入またはインポートする</p></td>
   </tr>
</table>

### RBAC権限 {#rbac-privileges}

<table>
   <tr>
     <th><p><strong>権限</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>CreateOwnership</p></td>
     <td><p>ユーザーまたはロールを作成する</p></td>
   </tr>
   <tr>
     <td><p>UpdateUser</p></td>
     <td><p>ユーザーのパスワードを更新する</p></td>
   </tr>
   <tr>
     <td><p>DropOwnership</p></td>
     <td><p>ユーザーパスワードまたはロールを削除する</p></td>
   </tr>
   <tr>
     <td><p>SelectOwnership</p></td>
     <td><p>特定のロールが付与されているすべてのユーザーを表示する</p></td>
   </tr>
   <tr>
     <td><p>ManageOwnership</p></td>
     <td><p>ユーザーまたはロールを管理するか、ユーザーにロールを付与する</p></td>
   </tr>
   <tr>
     <td><p>SelectUser</p></td>
     <td><p>ユーザーに付与されているすべてのロールを表示する</p></td>
   </tr>
   <tr>
     <td><p>CreatePrivilegeGroup</p></td>
     <td><p>権限グループを作成する</p></td>
   </tr>
   <tr>
     <td><p>DropPrivilegeGroup</p></td>
     <td><p>権限グループを削除する</p></td>
   </tr>
   <tr>
     <td><p>ListPrivilegeGroups</p></td>
     <td><p>現在のインスタンス内のすべての権限グループを表示する</p></td>
   </tr>
   <tr>
     <td><p>OperatePrivilegeGroup</p></td>
     <td><p>権限グループに権限を追加または削除する</p></td>
   </tr>
</table>

