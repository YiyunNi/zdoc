---
title: "プライマリフィールドと AutoID | Cloud"
slug: /primary-field-auto-id
sidebar_key: primary-field-auto-id
sidebar_label: "プライマリフィールド"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud のすべてのコレクションには、各エンティティを一意に識別するプライマリフィールドが必要です。このフィールドにより、すべてのエンティティを曖昧さなく挿入、更新、クエリ、または削除できます。"
type: origin
token: D2ctwKZhNilLY0ke1vpcHL62n5G
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - プライマリフィールド
  - autoId
  - autoid

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# プライマリフィールドとAutoID

Zilliz Cloud のすべてのコレクションには、各エンティティを一意に識別するためのプライマリフィールドが必要です。このフィールドにより、すべてのエンティティを曖昧さなく挿入、更新、クエリ、または削除できます。

ユースケースに応じて、Zilliz Cloud に ID を自動生成させる（AutoID）か、手動で独自の ID を割り当てるかを選択できます。

## プライマリフィールドとは何か？\{#what-is-a-primary-field}

プライマリフィールドは、コレクション内の各エンティティの一意のキーとして機能し、従来のデータベースの主キーに似ています。Zilliz Cloud は、挿入、アップサート、削除、およびクエリ操作時にエンティティを管理するためにプライマリフィールドを使用します。

キー要件：

- 各コレクションには、**ちょうど1つ**のプライマリフィールドが必要です。

- プライマリフィールドの値は null にできません。

- データ型は作成時に指定する必要があり、後で変更することはできません。

## サポートされるデータ型\{#supported-data-types}

プライマリフィールドには、エンティティを一意に識別できるサポートされるスカラーデータ型を使用する必要があります。

<table>
   <tr>
     <th><p>データ型</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>INT64</code></p></td>
     <td><p>64ビット整数型で、AutoID と共に一般的に使用されます。これはほとんどのユースケースで推奨されるオプションです。</p></td>
   </tr>
   <tr>
     <td><p><code>VARCHAR</code></p></td>
     <td><p>可変長文字列型。エンティティ識別子が外部システムから来る場合（例えば、製品コードやユーザー ID）に使用します。値あたりの最大バイト数を定義する <code>max_length</code> プロパティが必要です。</p></td>
   </tr>
</table>

## AutoID と手動 ID の選択\{#choose-between-autoid-and-manual-ids}

Zilliz Cloud は、プライマリキー値の割り当てに対して2つのモードをサポートしています。

<table>
   <tr>
     <th><p>モード</p></th>
     <th><p>説明</p></th>
     <th><p>推奨対象</p></th>
   </tr>
   <tr>
     <td><p>AutoID</p></td>
     <td><p>Zilliz Cloud が挿入またはインポートされたエンティティの一意の識別子を自動生成します。</p></td>
     <td><p>ID を手動で管理する必要がないほとんどのシナリオ。</p></td>
   </tr>
   <tr>
     <td><p>手動 ID</p></td>
     <td><p>データの挿入またはインポート時に、独自の一意の ID を提供します。</p></td>
     <td><p>ID を外部システムや既存のデータセットと一致させる必要がある場合。</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

- どちらのモードを選択するか迷っている場合は、よりシンプルな取り込みと保証された一意性のために [AutoID から始める](./primary-field-auto-id#quickstart-use-autoid) とよいでしょう。

- 手動でプライマリキーを設定することが有益でない限り、すべてのケースで `autoId` に依存することをお勧めします。

</Admonition>

## クイックスタート: AutoID の使用\{#quickstart-use-autoid}

Zilliz Cloud に ID 生成を自動的に処理させることができます。

### ステップ 1: AutoID を使用したコレクションの作成\{#step-1-create-a-collection-with-autoid}

プライマリフィールド定義で `auto_id=True` を有効にします。Zilliz Cloud が ID 生成を自動的に処理します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

schema = client.create_schema()

# Define primary field with AutoID enabled
# highlight-start
schema.add_field(
    field_name="id", # Primary field name
    is_primary=True,
    auto_id=True,  # Milvus generates IDs automatically; Defaults to False
    datatype=DataType.INT64
)
# highlight-end

# Define the other fields
schema.add_field(field_name="embedding", datatype=DataType.FLOAT_VECTOR, dim=4) # Vector field
schema.add_field(field_name="category", datatype=DataType.VARCHAR, max_length=1000) # Scalar field of the VARCHAR type

# Create the collection
if client.has_collection("demo_autoid"):
    client.drop_collection("demo_autoid")
client.create_collection(collection_name="demo_autoid", schema=schema)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.DropCollectionReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());
        
CreateCollectionReq.CollectionSchema collectionSchema = CreateCollectionReq.CollectionSchema.builder()
        .build();
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .autoID(true)
        .build());
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("embedding")
        .dataType(DataType.FloatVector)
        .dimension(4)
        .build());
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("category")
        .dataType(DataType.VarChar)
        .maxLength(1000)
        .build());

client.dropCollection(DropCollectionReq.builder()
        .collectionName("demo_autoid")
        .build());

CreateCollectionReq requestCreate = CreateCollectionReq.builder()
        .collectionName("demo_autoid")
        .collectionSchema(collectionSchema)
        .build();
client.createCollection(requestCreate);
```

</TabItem>

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const client = new MilvusClient({
  address: "YOUR_CLUSTER_ENDPOINT",
});

// Define schema fields
const schema = [
  {
    name: "id",
    description: "Primary field",
    data_type: DataType.Int64,
    is_primary_key: true,
    autoID: true, // Milvus generates IDs automatically
  },
  {
    name: "embedding",
    description: "Vector field",
    data_type: DataType.FloatVector,
    dim: 4,
  },
  {
    name: "category",
    description: "Scalar field",
    data_type: DataType.VarChar,
    max_length: 1000,
  },
];

// Create the collection
await client.createCollection({
  collection_name: "demo_autoid",
  fields: schema,
});

```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
export SCHEMA='{
    "autoID": true,
    "fields": [
        {
            "fieldName": "id",
            "dataType": "Int64",
            "isPrimary": true,
            "elementTypeParams": {}
        },
        {
            "fieldName": "embedding",
            "dataType": "FloatVector",
            "isPrimary": false,
            "elementTypeParams": {
                "dim": "4"
            }
        },
        {
            "fieldName": "category",
            "dataType": "VarChar",
            "isPrimary": false,
            "elementTypeParams": {
                "max_length": "1000"
            }
        }
    ]
}'

curl -X POST 'YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/create' \
-H 'Content-Type: application/json' \
-d "{
    \"collectionName\": \"demo_autoid\",
    \"schema\": $SCHEMA
}"
```

</TabItem>
</Tabs>

### Step 2: データの挿入\{#step-2-insert-data}

**重要:** データに主キー列を含めないでください。Zilliz Cloud は ID を自動的に生成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
data = [
    {"embedding": [0.1, 0.2, 0.3, 0.4], "category": "book"},
    {"embedding": [0.2, 0.3, 0.4, 0.5], "category": "toy"},
]

res = client.insert(collection_name="demo_autoid", data=data)
print("Generated IDs:", res.get("ids"))

# Output example:
# Generated IDs: [461526052788333649, 461526052788333650]
```

</TabItem>

<TabItem value='java'>

```java
import com.google.gson.*;
import io.milvus.v2.service.vector.request.InsertReq;
import io.milvus.v2.service.vector.response.InsertResp;

List<JsonObject> rows = new ArrayList<>();
Gson gson = new Gson();
JsonObject row1 = new JsonObject();
row1.add("embedding", gson.toJsonTree(new float[]{0.1f, 0.2f, 0.3f, 0.4f}));
row1.addProperty("category", "book");
rows.add(row1);

JsonObject row2 = new JsonObject();
row2.add("embedding", gson.toJsonTree(new float[]{0.2f, 0.3f, 0.4f, 0.5f}));
row2.addProperty("category", "toy");
rows.add(row2);

InsertResp insertR = client.insert(InsertReq.builder()
        .collectionName("demo_autoid")
        .data(rows)
        .build());
System.out.printf("Generated IDs: %s\n", insertR.getPrimaryKeys());
```

</TabItem>

<TabItem value='java'>

```javascript
const data = [
    {"embedding": [0.1, 0.2, 0.3, 0.4], "category": "book"},
    {"embedding": [0.2, 0.3, 0.4, 0.5], "category": "toy"},
];

const res = await client.insert({
    collection_name: "demo_autoid",
    fields_data: data,
});

console.log(res);
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
export INSERT_DATA='[
    {
        "embedding": [0.1, 0.2, 0.3, 0.4],
        "category": "book"
    },
    {
        "embedding": [0.2, 0.3, 0.4, 0.5],
        "category": "toy"
    }
]'

curl -X POST 'YOUR_CLUSTER_ENDPOINT/v2/vectordb/entities/insert' \
-H 'Content-Type: application/json' \
-d "{
    \"collectionName\": \"demo_autoid\",
    \"data\": $INSERT_DATA
}"
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

既存のエンティティを操作する場合は、重複した ID エラーを回避するために `insert()` の代わりに `upsert()` を使用してください。

</Admonition>

## 手動 ID の使用\{#use-manual-ids}

ID を手動で制御する必要がある場合は、AutoID を無効にして独自の値を指定してください。

### ステップ 1: AutoID なしでコレクションを作成する\{#step-1-create-a-collection-without-autoid}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

schema = client.create_schema()

# Define the primary field without AutoID
# highlight-start
schema.add_field(
    field_name="product_id",
    is_primary=True,
    auto_id=False,  # You'll provide IDs manually at data ingestion
    datatype=DataType.VARCHAR,
    max_length=100 # Required when datatype is VARCHAR
)
# highlight-end

# Define the other fields
schema.add_field(field_name="embedding", datatype=DataType.FLOAT_VECTOR, dim=4) # Vector field
schema.add_field(field_name="category", datatype=DataType.VARCHAR, max_length=1000) # Scalar field of the VARCHAR type

# Create the collection
if client.has_collection("demo_manual_ids"):
    client.drop_collection("demo_manual_ids")
client.create_collection(collection_name="demo_manual_ids", schema=schema)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.DropCollectionReq;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build());
        
CreateCollectionReq.CollectionSchema collectionSchema = CreateCollectionReq.CollectionSchema.builder()
        .build();
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("product_id")
        .dataType(DataType.VarChar)
        .isPrimaryKey(true)
        .autoID(false)
        .maxLength(100)
        .build());
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("embedding")
        .dataType(DataType.FloatVector)
        .dimension(4)
        .build());
collectionSchema.addField(AddFieldReq.builder()
        .fieldName("category")
        .dataType(DataType.VarChar)
        .maxLength(1000)
        .build());

client.dropCollection(DropCollectionReq.builder()
        .collectionName("demo_manual_ids")
        .build());

CreateCollectionReq requestCreate = CreateCollectionReq.builder()
        .collectionName("demo_manual_ids")
        .collectionSchema(collectionSchema)
        .build();
client.createCollection(requestCreate);
```

</TabItem>

<TabItem value='java'>

```javascript

import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const client = new MilvusClient({
  address: "YOUR_CLUSTER_ENDPOINT",
  username: "username",
  password: "Aa12345!!",
});

const schema = [
  {
    name: "product_id",
    data_type: DataType.VARCHAR,
    is_primary_key: true,
    autoID: false,
  },
  {
    name: "embedding",
    data_type: DataType.FLOAT_VECTOR,
    dim: 4,
  },
  {
    name: "category",
    data_type: DataType.VARCHAR,
    max_length: 1000,
  },
];

const res = await client.createCollection({
  collection_name: "demo_autoid",
  schema: schema,
});

```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
export SCHEMA='{
    "autoID": false,
    "fields": [
        {
            "fieldName": "product_id",
            "dataType": "VarChar",
            "isPrimary": true,
            "elementTypeParams": {
                "max_length": "100"
            }
        },
        {
            "fieldName": "embedding",
            "dataType": "FloatVector",
            "isPrimary": false,
            "elementTypeParams": {
                "dim": "4"
            }
        },
        {
            "fieldName": "category",
            "dataType": "VarChar",
            "isPrimary": false,
            "elementTypeParams": {
                "max_length": "1000"
            }
        }
    ]
}'

curl -X POST 'YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/create' \
-H 'Content-Type: application/json' \
-d "{
    \"collectionName\": \"demo_manual_ids\",
    \"schema\": $SCHEMA
}"
```

</TabItem>
</Tabs>

### ステップ 2: 自分の ID を使ってデータを挿入する\{#step-2-insert-data-with-your-ids}

すべての insert 操作には、主キー（primary field）カラムを含める必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Each entity must contain the primary field \`product_id\`
data = [
    {"product_id": "PROD-001", "embedding": [0.1, 0.2, 0.3, 0.4], "category": "book"},
    {"product_id": "PROD-002", "embedding": [0.2, 0.3, 0.4, 0.5], "category": "toy"},
]

res = client.insert(collection_name="demo_manual_ids", data=data)
print("Generated IDs:", res.get("ids"))

# Output example:
# Generated IDs: ['PROD-001', 'PROD-002']
```

</TabItem>

<TabItem value='java'>

```java
import com.google.gson.*;
import io.milvus.v2.service.vector.request.InsertReq;
import io.milvus.v2.service.vector.response.InsertResp;

List<JsonObject> rows = new ArrayList<>();
Gson gson = new Gson();
JsonObject row1 = new JsonObject();
row1.addProperty("product_id", "PROD-001");
row1.add("embedding", gson.toJsonTree(new float[]{0.1f, 0.2f, 0.3f, 0.4f}));
row1.addProperty("category", "book");
rows.add(row1);

JsonObject row2 = new JsonObject();
row2.addProperty("product_id", "PROD-002");
row2.add("embedding", gson.toJsonTree(new float[]{0.2f, 0.3f, 0.4f, 0.5f}));
row2.addProperty("category", "toy");
rows.add(row2);

InsertResp insertR = client.insert(InsertReq.builder()
        .collectionName("demo_manual_ids")
        .data(rows)
        .build());
System.out.printf("Generated IDs: %s\n", insertR.getPrimaryKeys());
```

</TabItem>

<TabItem value='java'>

```javascript

const data = [
    {"product_id": "PROD-001", "embedding": [0.1, 0.2, 0.3, 0.4], "category": "book"},
    {"product_id": "PROD-002", "embedding": [0.2, 0.3, 0.4, 0.5], "category": "toy"},
];

const insert = await client.insert({
    collection_name: "demo_autoid",
    fields_data: data,
});

console.log(insert);
```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
export INSERT_DATA='[
    {
        "product_id": "PROD-001",
        "embedding": [0.1, 0.2, 0.3, 0.4],
        "category": "book"
    },
    {
        "product_id": "PROD-002",
        "embedding": [0.2, 0.3, 0.4, 0.5],
        "category": "toy"
    }
]'

# 插入数据
curl -X POST 'YOUR_CLUSTER_ENDPOINT/v2/vectordb/entities/insert' \
-H 'Content-Type: application/json' \
-d "{
    \"collectionName\": \"demo_manual_ids\",
    \"data\": $INSERT_DATA
}"
```

</TabItem>
</Tabs>

あなたの責任:

- すべてのエンティティ間で ID が一意になるようにすること

- 挿入/インポート操作ごとに主キーを含めること

- ID の競合および重複検出を自分で処理すること

