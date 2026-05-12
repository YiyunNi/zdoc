---
title: "オンデマンド検索のクイックスタート | Cloud"
slug: /quick-start-to-on-demand-search
sidebar_key: quick-start-to-on-demand-search
sidebar_label: "オンデマンド検索のクイックスタート"
beta: PUBLIC
notebook: FALSE
description: "Zilliz Cloud はオンデマンドのコンピューティングリソースを提供し、必要に応じて類似性検索やクエリを実行できます。使用したリソースに対してのみ料金が発生し、不要なときはクラスターをシャットダウンしてコストを発生させないようにできます。"
type: origin
token: GQN0wDCrni4n36kyeVQcF41Lned
sidebar_position: 9
keywords: 
  - zilliz
  - ベクトルデータベース
  - クイックスタート
  - cloud
  - milvus
  - オンデマンド検索
  - データレイク
  - 外部データレイクの検索

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# クイックスタート：オンデマンド検索

Zilliz Cloud はオンデマンドのコンピューティングリソースを提供し、必要に応じて類似性検索やクエリを実行できます。使用したリソースに対してのみ料金が発生し、不要な場合はクラスタを無料でシャットダウンできます。

## ステップ 1：プロジェクトエンドポイントに接続する。\{#step-1-connect-to-a-project-endpoint}

データベースを操作する前に、プロジェクトエンドポイントに接続します。Zilliz Cloud コンソールでオンデマンドコンピューティングを有効にした後、クイックスタートページでプロジェクトエンドポイントを取得できます。

<Admonition type="info" icon="📘" title="Notes">

- マネージドコレクションの操作には、認証のための **API キー** が必要です。このフローでは `username:password` 認証はサポートされていません。

- オンデマンドコンピューティング用データベースのマネージドコレクションでは、ロード操作は不要です。

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

## ステップ 3: マネージドコレクションを作成する。\{#step-3-create-a-managed-collection}

データベースの準備ができたら、その中にマネージドコレクションを作成できます。外部コレクションがコレクションのカラムを外部データファイルにマッピングするのとは異なり、マネージドコレクションではデータをインポートして大幅なパフォーマンス向上を図ります。

以下の例では、コレクションスキーマの設定方法とコレクションの作成方法を示します。

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

<TabItem value='java'>

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

次に、上記のスキーマを使用してコレクションを作成できます。デフォルトのデータベースを使用する場合は、`db_name` パラメータを安全に省略できます。

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

<TabItem value='java'>

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

## ステップ 4: インデックスを作成する。\{#step-4-create-indexes}

すべてのベクトルフィールドと、必要に応じて選択したスカラーフィールドのインデックスを作成する必要があります。

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

<TabItem value='java'>

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

## Step 5: データをインポートする。\{#step-5-import-data}

すべての設定が完了したら、処理済みデータをインポートできます。以下の例では、処理済みデータを外部ストレージバケットに保存していることを前提としています。

バケットまたはストレージ統合のデータ形式については、[形式オプション](./data-import-format-options) を参照してください。

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

<TabItem value='java'>

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

返されたジョブ ID を使用して、進行状況を監視できます。

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

<TabItem value='java'>

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

## Step 6: オンデマンドクラスターの作成\{#step-6-create-an-on-demand-cluster}

外部コレクションの準備ができたら、オンデマンド検索のためにオンデマンドクラスターにアタッチする必要があります。以下のコマンドはクラスターを作成し、そのIDを返します。

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

デフォルトでは、クラスターは最後のリクエストから60秒後に自動的にサスペンドされますが、ユースケースに適した値に設定することもできます。

## Step 7: Conduct searches.\{#step-7-conduct-searches}

検索、クエリ、またはハイブリッド検索を実行する必要がある場合は、セッションを通じて前のステップで作成したオンデマンドクラスターにアタッチできます。

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
query_vector = [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, ..., 0.9029438446296592]                                
                                                                                                                               
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

<TabItem value='java'>

```bash
curl --request POST \                                                                                                        
  --url "${PROJECT_ENDPOINT}/v2/vectordb/entities/search?cluster_id=inxx-xxxxxxxxxxxxxxx" \
  --header "Authorization: Bearer ${TOKEN}" \                                                                                
  --header "Content-Type: application/json" \                                                                                
  -d '{                                                                                                                      
    "dbName": "my_database",                                                                                                 
    "collectionName": "prod_collection",                                                                                     
    "data": [
        [
            0.3580376395471989,
            -0.6023495712049978,
            0.18414012509913835,
            -0.26286205330961354,
            ...
            0.9029438446296592
        ]
    ]                                                         
    "annsField": "embedding",                                                                                                
    "limit": 3,                                                                                                              
    "outputFields": ["product_id", "product_name"]                                                                           
  }'
```

</TabItem>
</Tabs>

その後、データを探索し、最も価値の高いサブセットを見つけることができます。その後、サービングクラスタに接続し、データをインポートして、本番環境でサービングすることができます。

