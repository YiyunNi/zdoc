---
title: "外部コレクションを使用したオンデマンド検索のクイックスタート | Cloud"
slug: /quick-start-to-on-demand-search
sidebar_key: quick-start-to-on-demand-search
sidebar_label: "外部コレクションを使用したオンデマンド検索のクイックスタート"
beta: PUBLIC
notebook: FALSE
description: "オンデマンド検索を使用すると、外部ストレージ内のデータや Zilliz Cloud にインポートされたデータにゼロコピーでアクセスし、大規模データセットを検索できます。コンピューティングリソースを継続的に実行する必要はありません。外部ボリュームまたはインポートされたファイルからコレクションを作成し、プロジェクトデータプレーンエンドポイントを介してインデックスを構築しメタデータを更新し、検索やクエリワークロードを実行する必要があるときだけオンデマンドクラスタを起動できます。"
type: origin
token: KdwFwQnDNisT4skHH6Hc16uInji
sidebar_position: 9
keywords: 
  - zilliz
  - ベクトルデータベース
  - クイックスタート
  - cloud
  - milvus
  - on-demand search

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# クイックスタート: 外部コレクションを使用したオンデマンド検索

オンデマンド検索を使用すると、外部ストレージ内のデータや Zilliz Cloud にインポートされたデータにゼロコピーでアクセスし、大規模データセットを検索できます。コンピューティングリソースを継続的に実行しておく必要はありません。外部ボリュームやインポートされたファイルからコレクションを作成し、プロジェクトデータプレーンエンドポイントを介してインデックスの構築とメタデータの更新を行い、検索やクエリワークロードを実行する必要があるときだけオンデマンドクラスタを起動できます。

これを行うには、以下の手順に従います。

## 開始前の準備\{#before-you-start}

- **ストレージ統合の作成**

    ストレージ統合は、データの場所とアクセス認証情報を記録するプロファイルです。ストレージ統合を設定するには、[AWS S3](null)、[Google GCS](null)、または [Azure](null) のストレージ統合を作成する手順に従い、ストレージ統合IDを取得してください。

- **外部ボリュームの作成**

    外部ボリュームは、ストレージ統合内のパスです。生データがそのパス上にあることを確認してください。同じストレージ統合から複数の外部ボリュームを作成できます。外部ボリュームの作成については、[外部ボリューム](./external-volume#create-an-external-volume) を参照してください。

## ステップ 1: プロジェクトエンドポイントへの接続\{#step-1-connect-to-a-project-endpoint}

データベースを操作する前に、プロジェクトエンドポイントに接続します。プロジェクトエンドポイントは、Zilliz Cloud コンソールでオンデマンドコンピューティングを有効にした後、クイックスタートページで取得できます。

<Admonition type="info" icon="📘" title="Notes">

<p>外部コレクション操作には、認証のための<strong>API キー</strong>が必要です。このフローでは <code>username:password</code> 認証はサポートされていません。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# connect to database
client = MilvusClient(
    # a project-specific on-demand compute endpoint
    uri="https://{project-id}.{region}.api.zillizcloud.com",
    token="YOUR_API_KEY"
)
```

</TabItem>

<TabItem value='java'>

```bash
export PROJECT_ENDPOINT="https://{project-id}.{region}.api.zillizcloud.com"
```

</TabItem>
</Tabs>

## Step 2: (オプション) データベースを作成する。\{#step-2-optional-create-a-database}

Zilliz Cloud にはデフォルトのデータベースが付属しています。これを使用する場合は、この手順をスキップしてください。以下のようにデータベースを作成することもできます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.create_database(
    db_name="my_database"
)
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${PROJECT_ENDPOINT}/v2/vectordb/databases/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "my_database"
}'
```

</TabItem>
</Tabs>

## Step 3: 外部コレクションを作成する。\{#step-3-create-an-external-collection}

データベースの準備ができたら、外部コレクションを作成できます。外部コレクションは、そのカラムを指定したデータファイルにマッピングし、そのコレクション内の検索用にオンデマンドのコンピューティングリソースをアタッチします。

管理コレクションが生データをコレクションにインポートすることを要求するのとは異なり、外部コレクションはサブ秒のリフレッシュ操作を通じて生データからメタデータを生成します。

次の例は、コレクションフィールドとデータファイルの間のマッピング関係を設定する方法を示しています。スキーマを初期化する際に、データのボリュームパスとファイル形式を渡します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

schema = MilvusClient.create_schema(
    external_source='volume://my_volume/iceberg/metadata/00001-xxx.metadata.json',
    external_spec='{
        "format": "iceberg-table",
        "snapshot_id": "1234567890123456789"
    }'
)

schema.add_field(
    field_name="vector",
    datatype=DataType.FLOAT_VECTOR,
    dim=1536,
    # highlight-next
    external_field="embedding" # field name in the external data file
)

schema.add_field(
    field_name="product_id",
    datatype=DataType.VARCHAR,
    max_length=32,
    nullable=True,
    # highlight-next
    external_field="product_id"
)

schema.add_field(
    field_name="title",
    datatype=DataType.VARCHAR,
    max_length=512,
    nullable=True,
    # highlight-next
    external_field="title"
)

schema.add_field(
    field_name="main_category",
    datatype=DataType.VARCHAR,
    max_length=64,
    nullable=True,
    # highlight-next
    external_field="main_category"
)

schema.add_field(
    field_name="price",
    datatype=DataType.DOUBLE,
    nullable=True,
    # highlight-next
    external_field="price"
)

schema.add_field(
    field_name="average_rating",
    datatype=DataType.DOUBLE,
    nullable=True,
    # highlight-next
    external_field="average_rating"
)

schema.add_field(
    field_name="rating_number",
    datatype=DataType.INT64,
    nullable=True,
    # highlight-next
    external_field="rating_number"
)
```

</TabItem>

<TabItem value='java'>

```bash
export schema='{
    "externalSource": "volume://my_volume/iceberg/metadata/00001-xxx.metadata.json",
    "externalSpec": "{\"format\": \"iceberg-table\", \"snapshot_id\": \"1234567890123456789\"}",
    "fields": [
        {
            "fieldName": "vector",
            "dataType": "FloatVector",
            "elementTypeParams": {
                "dim": "1536"
            },
            "externalField": "embedding"
        },
        {
            "fieldName": "product_id",
            "dataType": "VarChar",
            "elementTypeParams": {
                "max_length": "32"
            },
            "nullable": true,
            "externalField": "product_id"
        },
        {
            "fieldName": "title",
            "dataType": "VarChar",
            "elementTypeParams": {
                "max_length": "512"
            },
            "nullable": true,
            "externalField": "title"
        },
        {
            "fieldName": "main_category",
            "dataType": "VarChar",
            "elementTypeParams": {
                "max_length": "64"
            },
            "nullable": true,
            "externalField": "main_category"
        },
        {
            "fieldName": "price",
            "dataType": "Double",
            "nullable": true,
            "externalField": "price"
        },
        {
            "fieldName": "average_rating",
            "dataType": "Double",
            "nullable": true,
            "externalField": "average_rating"
        },
        {
            "fieldName": "rating_number",
            "dataType": "Int64",
            "nullable": true,
            "externalField": "rating_number"
        }
    ]
}'
```

</TabItem>
</Tabs>

次に、上記のスキーマを使用してコレクションを作成できます。デフォルトのデータベースを使用する場合は、`db_name` パラメータを安全に省略できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.use_database(
    db_name="my_database"
)

# create the collection
client.create_collection(
    collection_name="my_collection",
    schema=schema
)
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${PROJECT_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"dbName\": \"my_database\",
    \"collectionName\": \"my_collection\",
    \"schema\": $schema
}"
```

</TabItem>
</Tabs>

## Step 4: インデックスを作成し、コレクションをリフレッシュする。\{#step-4-create-indexes-and-refresh-the-collection}

外部データベースでも、マネージドコレクションと同様にインデックスを作成できます。すべてのベクトルフィールドにインデックスを作成する必要があり、高速なメタデータフィルタリングのために一部のスカラーフィールドにインデックスを作成することも選択できます。ただし、インデックスを構築するために refresh を呼び出す必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
index_params = client.prepare_index_params()

# Add indexes
index_params.add_index(
    field_name="vector",
    index_type="AUTOINDEX",
    metric_type="COSINE"
)

index_params.add_index(
    field_name="main_category", 
    index_type="AUTOINDEX"
)

client.create_index(
    db_name="my_database",
    collection_name="my_collection",
    index_params=index_params
)
```

</TabItem>

<TabItem value='java'>

```bash
export indexParams='[
    {
        "fieldName": "vector",
        "metricType": "COSINE",
        "indexName": "vector",
        "indexType": "AUTOINDEX"
    },
    {
        "fieldName": "main_category",
        "indexName": "main_category",
        "indexType": "AUTOINDEX"
    }
]'

curl --request POST \
--url "${PROJECT_ENDPOINT}/v2/vectordb/indexes/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"dbName\": \"my_database\",
    \"collectionName\": \"my_collection\",
    \"indexParams\": $indexParams
}"
```

</TabItem>
</Tabs>

次に、外部コレクションを更新します。`externalSource` と `externalSpec` を省略してコレクションスキーマを再利用することも、両方を指定して新しいソースからコレクションスキーマを更新することもできます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# refresh the external database
job_id = client.refresh_external_collection(
    collection_name="my_collection"
)
```

</TabItem>

<TabItem value='java'>

```bash
# Refresh the external collection
curl --request POST \
--url "${PROJECT_ENDPOINT}/v2/vectordb/jobs/external_collection/refresh" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "default",
    "collectionName": "my_collection"
}'

# job-xxxxxxxxxxxxxxxxxxx
```

</TabItem>
</Tabs>

次に、ループを作成して進捗監視の呼び出しをラップし、リフレッシュ操作の進捗状況を追跡できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
progress = client.get_refresh_external_collection_progress(job_id=job_id)
```

</TabItem>

<TabItem value='java'>

```bash
curl -s --request POST \
    --url "${PROJECT_ENDPOINT}/v2/vectordb/jobs/external_collection/describe" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Content-Type: application/json" \
    -d '{
        "jobId": "job-xxxxxxxxxxxxxxxxxxx"
    }'
```

</TabItem>
</Tabs>

## ステップ 5: オンデマンドクラスターの作成\{#step-5-create-an-on-demand-cluster}

外部コレクションの準備ができたら、オンデマンド検索のためにオンデマンドクラスターにアタッチする必要があります。以下のコマンドはクラスターを作成し、その ID を返します。

```bash
export CONTROL_PLANE_ENDPOINT="https://api.cloud.zilliz.com"

curl --request POST \
--url "${CONTROL_PLANE_ENDPOINT}/v2/clusters/createOnDemandCluster" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "projectId": "proj-xxxxxxxxxxxxxxxxxxx",
    "regionId": "aws-us-west-2",
    "clusterName": "my-on-demand",
    "cuSize": 8,
    "autoSuspend": 60
}'

# inxx-xxxxxxxxxxxxx
```

## Step 6: Conduct searches.\{#step-6-conduct-searches}

When you need to conduct searches, queries, or hybrid searches, you can attach to the on-demand cluster created in the previous step through a session.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# highlight-start
session = client.session(
    cluster_id="inxx-xxxxxxxxxxxxx"
)
# highlight-end

# 1536-dimensional vector
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, ..., 0.9029438446296592]
res = session.search(
    db_name="my_database",
    collection_name="my_collection",
    anns_field="vector",
    data=[query_vector],
    limit=3,
    output_fields=["product_id", "title", "main_category", "price", "average_rating", "rating_number"],
    search_params={"metric_type": "COSINE"}
)
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
--url "${PROJECT_ENDPOINT}/v2/vectordb/entities/search?cluster_id=inxx-xxxxxxxxxxxxxxxxx" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "my_database",
    "collectionName": "my_collection",
    "data": [
        [
            0.3580376395471989,
            -0.6023495712049978,
            0.18414012509913835,
            -0.26286205330961354,
            0.9029438446296592
        ]
    ],
    "annsField": "vector",
    "limit": 3,
    "outputFields": [
        "product_id",
        "title",
        "main_category",
        "price",
        "average_rating",
        "rating_number"
    ]
}'
```

</TabItem>
</Tabs>

その後、データを探索し、最も価値の高いサブセットを見つけることができます。その後、サービングクラスタに接続し、データをインポートして、本番環境でサービングすることができます。