---
title: "外部データレイク検索のクイックスタート | Cloud"
slug: /quick-start-to-external-data-lake-search
sidebar_key: quick-start-to-external-data-lake-search
sidebar_label: "外部データレイク検索のクイックスタート"
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
beta: PUBLIC
notebook: FALSE
description: "外部データレイク検索では、外部ストレージ内のデータや Zilliz Cloud に取り込んだデータへゼロコピーでアクセスし、常時コンピュートを稼働させることなく大規模データセットを検索できます。外部ボリュームまたはインポート済みファイルからコレクションを作成し、プロジェクトデータプレーンエンドポイントでインデックス作成とメタデータ更新を行い、検索やクエリ実行時にのみオンデマンドクラスターを起動できます。 | Cloud"
type: origin
token: KdwFwQnDNisT4skHH6Hc16uInji
sidebar_position: 10
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

# 外部データレイク検索のクイックスタート

外部データレイク検索では、外部ストレージ内のデータや Zilliz Cloud に取り込んだデータへゼロコピーでアクセスし、常時コンピュートを稼働させることなく大規模データセットを検索できます。外部ボリュームまたはインポート済みファイルからコレクションを作成し、プロジェクトデータプレーンエンドポイントでインデックス作成とメタデータ更新を行い、検索やクエリ実行時にのみオンデマンドクラスターを起動できます。

手順は以下のとおりです。

## 開始前の準備

- **ストレージ統合を作成する。**

    ストレージ統合は、データの保存場所とアクセス認証情報を保持するプロファイルです。設定するには、[AWS S3](./integrate-with-aws-s3)、[Google GCS](./integrate-with-gcp)、または [Azure](./integrate-with-azure-blob-storage) のストレージ統合作成手順を実行し、ストレージ統合 ID を取得してください。

- **外部ボリュームを作成する。**

    外部ボリュームはストレージ統合内のパスです。生データがこのパス配下にあることを確認してください。同一ストレージ統合から複数の外部ボリュームを作成できます。詳細は [External Volumes](./external-volume#create-an-external-volume) を参照してください。

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

## ステップ 3: 外部コレクションを作成する。

データベースの準備ができたら、外部コレクションを作成できます。外部コレクションは、指定したデータファイルにコレクションのカラムをマッピングし、そのコレクションでの検索向けにオンデマンドコンピュートリソースをアタッチします。

生データの取り込みが必要なマネージドコレクションと異なり、外部コレクションはサブ秒のリフレッシュ操作で生データからメタデータを生成できます。

次の例は、コレクションフィールドとデータファイルのマッピングを設定する方法を示しています。スキーマ初期化時に、データのボリュームパスとファイル形式を指定します。

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

<TabItem value='bash'>

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

続いて、上記スキーマでコレクションを作成します。デフォルトデータベースを使用する場合は、`db_name` パラメータを省略できます。

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

<TabItem value='bash'>

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

## ステップ 4: インデックスを作成してコレクションをリフレッシュする。

外部データベースでも、マネージドコレクションと同様にインデックスを作成できます。すべてのベクトルフィールドはインデックス化が必要で、メタデータフィルタリングを高速化するためにスカラーフィールドも選択してインデックス化できます。ただし、インデックス構築には refresh の呼び出しが必要です。

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

<TabItem value='bash'>

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

次に外部コレクションをリフレッシュします。`externalSource` と `externalSpec` を省略して既存スキーマを再利用することも、両方を指定して新しいソースからスキーマを更新することもできます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# refresh the external database
job_id = client.refresh_external_collection(
    collection_name="my_collection"
)
```

</TabItem>

<TabItem value='bash'>

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

続いて、進捗確認 API をループで呼び出し、リフレッシュ処理の進捗を追跡できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
progress = client.get_refresh_external_collection_progress(job_id=job_id)
```

</TabItem>

<TabItem value='bash'>

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

## ステップ 5: オンデマンドクラスターを作成する

外部コレクションの準備ができたら、オンデマンド検索のためにオンデマンドクラスターをアタッチします。次のコマンドでクラスターを作成し、クラスター ID を取得できます。

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

## ステップ 6: 検索を実行する。

検索、クエリ、ハイブリッド検索を行う場合は、前の手順で作成したオンデマンドクラスターにセッション経由で接続します。

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

<TabItem value='bash'>

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

これでデータを探索して価値の高いサブセットを見つけられます。その後、サービングクラスターに接続し、データを取り込んで本番環境向けに提供できます。
