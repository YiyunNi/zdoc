---
title: "オンデマンド検索のクイックスタート | Cloud"
slug: /quick-start-to-on-demand-search
sidebar_key: quick-start-to-on-demand-search
sidebar_label: "オンデマンド検索のクイックスタート"
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
beta: PUBLIC
notebook: FALSE
description: "Zilliz Cloud はオンデマンドのコンピュートリソースを提供し、必要なときに類似検索やクエリを実行できます。使用したリソース分のみ課金され、不要なときはクラスターを停止してコストを抑えられます。 | Cloud"
type: origin
token: GQN0wDCrni4n36kyeVQcF41Lned
sidebar_position: 9
keywords:
  - zilliz
  - ベクトルデータベース
  - クイックスタート
  - cloud
  - milvus
  - on-demand search
  - data lake
  - external data lake search

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# オンデマンド検索のクイックスタート

Zilliz Cloud はオンデマンドのコンピュートリソースを提供し、必要なときに類似検索やクエリを実行できます。使用したリソース分のみ課金され、不要なときはクラスターを停止してコストを抑えられます。

## ステップ 1: プロジェクトエンドポイントに接続する。

データベースを操作する前に、プロジェクトエンドポイントへ接続します。プロジェクトエンドポイントは、Zilliz Cloud コンソールでオンデマンドコンピュートを有効化した後、クイックスタートページで確認できます。

<Admonition type="info" icon="📘" title="Notes">

<p>外部コレクションの操作には認証用の <strong>API キー</strong> が必要です。このフローでは <code>username:password</code> 認証はサポートされません。</p>

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

<TabItem value='bash'>

```bash
export PROJECT_ENDPOINT="https://{project-id}.{region}.api.zillizcloud.com"
```

</TabItem>
</Tabs>

## ステップ 2: （任意）データベースを作成する。

Zilliz Cloud にはデフォルトデータベースが用意されています。デフォルトを使う場合はこの手順をスキップできます。必要に応じて以下のように作成してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.create_database(
    db_name="my_database"
)
```

</TabItem>

<TabItem value='bash'>

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

## ステップ 3: マネージドコレクションを作成する。

データベースの準備ができたら、マネージドコレクションを作成できます。外部データファイルにカラムをマッピングする外部コレクションとは異なり、マネージドコレクションはデータを取り込むことで高いパフォーマンスを得られます。

以下は、コレクションスキーマを定義してコレクションを作成する例です。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

schema = MilvusClient.create_schema()

schema.add_field(
    field_name="product_id",
    datatype=DataType.INT64,
    is_primary=True
)

schema.add_field(
    field_name="product_name",
    datatype=DataType.VARCHAR,
    max_length=512
)

schema.add_field(
    field_name="embedding",
    datatype=DataType.FLOAT_VECTOR,
    dim=768
)
```

</TabItem>

<TabItem value='bash'>

```bash
export schema='{
    "fields": [
        {
            "fieldName": "product_id",
            "dataType": "Int64",
            "isPrimary": true
        },
        {
            "fieldName": "embedding",
            "dataType": "FloatVector",
            "elementTypeParams": {
                "dim": "768"
            }
        },
        {
            "fieldName": "product_name",
            "dataType": "VarChar",
            "elementTypeParams": {
                "max_length": 512
            }
        }
    ]
}'
```

</TabItem>
</Tabs>

続いて、上記スキーマでコレクションを作成します。デフォルトデータベースを使用する場合は、`db_name` パラメータを省略できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.use_database(
    db_name="my_database"
)

# create the collection
client.create_collection(
    collection_name="prod_collection",
    schema=schema
)
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${PROJECT_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"dbName\": \"my_database\",
    \"collectionName\": \"prod_collection\",
    \"schema\": $schema
}"
```

</TabItem>
</Tabs>

## ステップ 4: インデックスを作成する。

すべてのベクトルフィールドに対してインデックスを作成する必要があります。必要に応じて、スカラーフィールドにもインデックスを作成できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
index_params = client.prepare_index_params()

# Add indexes
index_params.add_index(
    field_name="embedding",
    index_type="AUTOINDEX",
    metric_type="COSINE"
)

index_params.add_index(
    field_name="product_name", 
    index_type="AUTOINDEX"
)

client.create_index(
    db_name="my_database",
    collection_name="prod_collection",
    index_params=index_params
)
```

</TabItem>

<TabItem value='bash'>

```bash
export indexParams='[
    {
        "fieldName": "embedding",
        "metricType": "COSINE",
        "indexName": "embedding",
        "indexType": "AUTOINDEX"
    },
    {
        "fieldName": "product_name",
        "indexName": "product_name",
        "indexType": "AUTOINDEX"
    }
]'

curl --request POST \
--url "${PROJECT_ENDPOINT}/v2/vectordb/indexes/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"dbName\": \"my_database\",
    \"collectionName\": \"prod_collection\",
    \"indexParams\": $indexParams
}"
```

</TabItem>
</Tabs>

## ステップ 5: コレクションをロードする。

インデックスの準備ができたら、コレクションをメモリにロードします。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.load_collection(
    db_name="my_database",
    collection_name="prod_collection"
)
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${PROJECT_ENDPOINT}/v2/vectordb/collections/load" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "my_database",
    "collectionName": "prod_collection"
}'
```

</TabItem>
</Tabs>

## ステップ 6: オンデマンドクラスターを作成する

コレクションの準備ができたら、オンデマンド検索用のオンデマンドクラスターをアタッチします。次のコマンドでクラスターを作成し、クラスター ID を取得できます。

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

デフォルトでは、最後のリクエストから 60 秒後にクラスターが自動停止します。ユースケースに応じてこの値は調整できます。

## ステップ 7: データをインポートする。

準備が整ったら、処理済みデータをインポートします。以下の例では、処理済みデータが外部ストレージバケットに保存されていることを前提としています。

バケット内データ形式やストレージ連携については、[Format Options](./data-import-format-options) を参照してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus.bulk_writer import bulk_import

# The path should be relative to the root 
# of a zilliz cloud volume or an external storage
OBJECT_URLS = [[                                                                                                             
    "https://s3.us-west-2.amazonaws.com/your-bucket/path/in/external/storage.json"                                           
]]                                                                                                                           
                                                                                                                              
ACCESS_KEY = "YOUR_STORAGE_ACCESS_KEY"                                                                                      
SECRET_KEY = "YOUR_STORAGE_SECRET_KEY"

res = bulk_import(
    api_key="YOUR_ZILLIZ_API_KEY",
    url="https://api.cloud.zilliz.com",
    project_id="proj-xxxxxxxxxxxxxxxxxxx",
    region_id="aws-us-west-2",
    db_name="my_database",
    collection_name="prod_collection",
    object_url=OBJECT_URLS,
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY
)

# job-xxxxxxxxxxxxxxxxxxxxx
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
  --url "${CLOUD_PLATFORM_ENDPOINT}/v2/vectordb/jobs/import/create" \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  -d '{
    "projectId": "proj-xxxxxxxxxxxxxxxxxx",
    "regionId": "aws-us-west-2",
    "dbName": "my_database",
    "collectionName": "prod_collection",
    "objectUrls": [["https://s3.us-west-2.amazonaws.com/your-bucket/path/in/external/storage.json"]],
    "accessKey": "YOUR_STORAGE_ACCESS_KEY",
    "secretKey": "YOUR_STORAGE_SECRET_KEY"
  }'

 # job-xxxxxxxxxxxxxxxxxxxxx
```

</TabItem>
</Tabs>

返却された job ID を使って進捗を確認できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
import json
from pymilvus.bulk_writer import get_import_progress

# Get bulk-insert job progress
resp = get_import_progress(
    api_key="YOUR_ZILLIZ_API_KEY",
    url="https://api.cloud.zilliz.com",
    cluster_id="inxx-xxxxxxxxxxxxxxxxxxx",
    job_id="job-xxxxxxxxxxxxxxxxxxxxx",
)

print(json.dumps(resp.json(), indent=4))
```

</TabItem>

<TabItem value='bash'>

```bash
# Use jobId returned from create API
curl --request POST \
  --url "${CLOUD_PLATFORM_ENDPOINT}/v2/vectordb/jobs/import/getProgress" \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  -d '{
    "clusterId": "inxx-xxxxxxxxxxxxxxx",
    "jobId": "job-xxxxxxxxxxxxxxxxxxxxx"
  }'
```

</TabItem>
</Tabs>

## ステップ 8: 検索を実行する。

検索、クエリ、ハイブリッド検索を行う場合は、前の手順で作成したオンデマンドクラスターにセッション経由で接続します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient                         
                                                                                                                              
client = MilvusClient(                                                                                                       
    uri="https://{project-id}.{region}.api.zillizcloud.com",                                                                 
    token="YOUR_API_KEY"                                                                                                     
)                                                                                                                            
                                                                                                                              
session = client.session(cluster_id="inxx-xxxxxxxxxxxxxxx")                                                                  
                                                                                                                              
# Must match collection vector dimension (example: 768)                                                                      
query_vector = [0.0] * 768                                
                                                                                                                              
res = session.search(                                                                                                        
    db_name="my_database",                                                                                                   
    collection_name="prod_collection",                                                                                       
    anns_field="embedding",                                                                                                  
    data=[query_vector],                                                                                                      
    limit=3,                                                                                                                 
    output_fields=["product_id", "product_name"],                                                                            
    search_params={"metric_type": "COSINE"}                                                                                  
)
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
  --url "${PROJECT_ENDPOINT}/v2/vectordb/entities/search?cluster_id=inxx-xxxxxxxxxxxxxxx" \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "dbName": "my_database",
    "collectionName": "prod_collection",
    "data": [[0.0, 0.0, 0.0, 0.0, 0.0 /* ... up to schema dim */]],
    "annsField": "embedding",
    "limit": 3,
    "outputFields": ["product_id", "product_name"]
  }'
```

</TabItem>
</Tabs>

これでデータを探索して価値の高いサブセットを見つけられます。その後、サービングクラスターに接続し、データを取り込んで本番環境向けに提供できます。
