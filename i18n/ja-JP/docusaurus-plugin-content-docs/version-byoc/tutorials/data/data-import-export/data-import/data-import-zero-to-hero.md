---
title: "データインポートハンズオン | BYOC"
slug: /data-import-zero-to-hero
sidebar_label: "ゼロからヒーローへ"
beta: FALSE
notebook: FALSE
description: "これは、Zilliz Cloudでのデータインポートを迅速に開始するための高速トラックコースです。データ準備とコレクション設定から実際のデータインポートプロセスまでをカバーします。このチュートリアルを通じて、以下のことを学びます。| BYOC"
type: origin
token: BjHZwBkk0iFScik49QMc1Wwjndb
sidebar_position: 5
keywords:
  - zilliz
  - ベクトルデータベース
  - cloud
  - データインポート
  - milvus

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# データインポートハンズオン

これは、Zilliz Cloudでのデータインポートを迅速に開始するための高速トラックコースです。データ準備とコレクション設定から実際のデータインポートプロセスまでをカバーします。このチュートリアルを通じて、以下のことを学びます。

- スキーマの定義とターゲットコレクションの設定方法
- **BulkWriter**を使用したソースデータの準備方法とリモートストレージバケットへの書き込み方法
- バルクインポートAPIを呼び出してデータをインポートする方法

## 開始する前に\{#before-you-start}

スムーズな体験を確保するために、以下のセットアップが完了していることを確認してください。

### Zilliz Cloudクラスターのセットアップ\{#set-up-your-zilliz-cloud-cluster}

- まだ作成していない場合は、[クラスターを作成](./create-cluster)してください。
- 以下の詳細情報を収集してください：**クラスターエンドポイント**、**APIキー**、**クラスターID**。

### 依存関係のインストール\{#install-dependencies}

現在、PythonまたはJavaでデータインポート関連のAPIを使用できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>

<TabItem value='python'>

Python APIを使用するには、ターミナルで次のコマンドを実行して**pymilvus**と**minio**をインストールするか、最新バージョンにアップグレードしてください。

```shell
python3 -m pip install --upgrade pymilvus minio
```

</TabItem>

<TabItem value='java'>

- Apache Mavenの場合、**pom.xml**の依存関係に以下を追加します。

```java
<dependency>
  <groupId>io.milvus</groupId>
  <artifactId>milvus-sdk-java</artifactId>
  <version>2.4.8</version>
</dependency>
```

- Gradle/Grailsの場合、次のコマンドを実行します。

```shell
compile 'io.milvus:milvus-sdk-java:2.4.8'
```

</TabItem>

</Tabs>

### リモートストレージバケットの設定\{#configure-your-remote-storage-bucket}

- AWS S3を使用してリモートバケットを設定します。
- 以下の情報をメモしておきます。

    - S3互換ブロックストレージサービスの**アクセスキー**、**シークレットキー**、**バケット名**。
    - Microsoft Azure Blob Storageサービスの**アカウント名**、**アカウントキー**、**コンテナ名**。

これらの詳細情報は、バケットがホストされているクラウドプロバイダーのコンソールで確認できます。

サンプルコードの使用性を向上させるために、設定詳細を変数に格納することをお勧めします。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
## URLの値は固定です。
CLOUD_API_ENDPOINT = "https://api.cloud.zilliz.com"
API_KEY=""

# Zilliz Cloudクラスターの設定
CLUSTER_ENDPOINT=""
CLUSTER_ID="" # Zilliz CloudクラスターID（例: "in01-xxxxxxxxxxxxxxx"）
COLLECTION_NAME="zero_to_hero"

# リモートバケットの設定
BUCKET_NAME=""
ACCESS_KEY=""
SECRET_KEY=""
```

</TabItem>

<TabItem value='java'>

```java
/**
 * URLの値は固定です。
 */
String CLOUD_API_ENDPOINT = "https://api.cloud.zilliz.com";
String API_KEY = "";

// Zilliz Cloudクラスターの設定
String CLUSTER_ENDPOINT = "";
String CLUSTER_ID = ""; // Zilliz CloudクラスターID（例: "in01-xxxxxxxxxxxxxxx"）
String COLLECTION_NAME = "zero_to_hero";

// リモートバケットの設定
String BUCKET_NAME = "";
String ACCESS_KEY = "";
String SECRET_KEY = "";
```

</TabItem>
</Tabs>

## ターゲットコレクションスキーマの設定\{#set-up-target-collection-schema}

上記の出力に基づいて、ターゲットコレクションのスキーマを作成できます。

以下のデモでは、最初の4つのフィールドを事前定義されたスキーマに含め、残りの4つを動的フィールドとして使用します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>

<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

# データセットからコレクションスキーマを作成する必要があります。
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True
)

DIM = 512

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True),
schema.add_field(field_name="bool", datatype=DataType.BOOL),
schema.add_field(field_name="int8", datatype=DataType.INT8),
schema.add_field(field_name="int16", datatype=DataType.INT16),
schema.add_field(field_name="int32", datatype=DataType.INT32),
schema.add_field(field_name="int64", datatype=DataType.INT64),
schema.add_field(field_name="float", datatype=DataType.FLOAT),
schema.add_field(field_name="double", datatype=DataType.DOUBLE),
schema.add_field(field_name="varchar", datatype=DataType.VARCHAR, max_length=512),
schema.add_field(field_name="json", datatype=DataType.JSON),
schema.add_field(field_name="array_str", datatype=DataType.ARRAY, max_capacity=100, element_type=DataType.VARCHAR, max_length=128)
schema.add_field(field_name="array_int", datatype=DataType.ARRAY, max_capacity=100, element_type=DataType.INT64)
schema.add_field(field_name="float_vector", datatype=DataType.FLOAT_VECTOR, dim=DIM),
schema.add_field(field_name="binary_vector", datatype=DataType.BINARY_VECTOR, dim=DIM),
schema.add_field(field_name="float16_vector", datatype=DataType.FLOAT16_VECTOR, dim=DIM),
# schema.add_field(field_name="bfloat16_vector", datatype=DataType.BFLOAT16_VECTOR, dim=DIM),
schema.add_field(field_name="sparse_vector", datatype=DataType.SPARSE_FLOAT_VECTOR)

schema.verify()

print(schema)
```

上記コードのパラメータは以下の通りです。

- フィールド：

    - `id` は主キーとなるフィールドです。

    - `float_vector` は浮動小数点ベクトルフィールドです。

    - `binary_vector` はバイナリベクトルフィールドです。

    - `float16_vector` は半精度浮動小数点ベクトルフィールドです。

    - `sparse_vector` は疎ベクトルフィールドです。

    - その他のフィールドはスカラーフィールドです。

- `auto_id=False`

    これはデフォルト値です。これを**True**に設定すると、**BulkWriter**が生成ファイルに主キーフィールドを含めなくなります。

- `enable_dynamic_field=True`

    この値はデフォルトで**False**です。これを**True**に設定すると、**BulkWriter**が生成ファイルから未定義のフィールドとその値をキー・バリューのペアとして含め、**&#36;meta**という名前の予約済みJSONフィールドに配置できるようになります。

</TabItem>

<TabItem value='java'>

```java
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.milvus.bulkwriter.BulkImport;
import io.milvus.bulkwriter.RemoteBulkWriter;
import io.milvus.bulkwriter.RemoteBulkWriterParam;
import io.milvus.bulkwriter.common.clientenum.BulkFileType;
import io.milvus.bulkwriter.common.clientenum.CloudStorage;
import io.milvus.bulkwriter.connect.S3ConnectParam;
import io.milvus.bulkwriter.connect.StorageConnectParam;
import io.milvus.bulkwriter.request.describe.MilvusDescribeImportRequest;
import io.milvus.bulkwriter.request.import_.MilvusImportRequest;
import io.milvus.bulkwriter.request.list.MilvusListImportJobsRequest;
import io.milvus.common.utils.Float16Utils;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.*;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.*;
import java.util.concurrent.TimeUnit;

private static final String STORAGE_ENDPOINT = CloudStorage.AWS.getEndpoint();
private static final String BUCKET_NAME = "a-bucket";
private static final String ACCESS_KEY = "access-key";
private static final String SECRET_KEY = "secret-key";

private static final Integer DIM = 512;
private static final Gson GSON_INSTANCE = new Gson();

private static CreateCollectionReq.CollectionSchema createSchema() {
    CreateCollectionReq.CollectionSchema schema = CreateCollectionReq.CollectionSchema.builder()
        .enableDynamicField(true)
        .build();
    schema.addField(AddFieldReq.builder()
            .fieldName("id")
            .dataType(io.milvus.v2.common.DataType.Int64)
            .isPrimaryKey(Boolean.TRUE)
            .autoID(false)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("bool")
            .dataType(DataType.Bool)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("int8")
            .dataType(DataType.Int8)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("int16")
            .dataType(DataType.Int16)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("int32")
            .dataType(DataType.Int32)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("int64")
            .dataType(DataType.Int64)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("float")
            .dataType(DataType.Float)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("double")
            .dataType(DataType.Double)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("varchar")
            .dataType(DataType.VarChar)
            .maxLength(512)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("json")
            .dataType(io.milvus.v2.common.DataType.JSON)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("array_int")
            .dataType(io.milvus.v2.common.DataType.Array)
            .maxCapacity(100)
            .elementType(io.milvus.v2.common.DataType.Int64)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("array_str")
            .dataType(io.milvus.v2.common.DataType.Array)
            .maxCapacity(100)
            .elementType(io.milvus.v2.common.DataType.VarChar)
            .maxLength(128)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("float_vector")
            .dataType(io.milvus.v2.common.DataType.FloatVector)
            .dimension(DIM)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("binary_vector")
            .dataType(io.milvus.v2.common.DataType.BinaryVector)
            .dimension(DIM)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("float16_vector")
            .dataType(io.milvus.v2.common.DataType.Float16Vector)
            .dimension(DIM)
            .build());
    schema.addField(AddFieldReq.builder()
            .fieldName("sparse_vector")
            .dataType(io.milvus.v2.common.DataType.SparseFloatVector)
            .build());

    return schema;
}
```

上記のコードブロックでは、

- `id` フィールドは主キーフィールドであり、`withAutoID` が `false` に設定されています。これは、インポートするデータに `id` フィールドを含める必要があることを示しています。

- `float_vector`、`binary_vector`、`float16_vector`、および `sparse_vector` フィールドはベクトルフィールドです。

- スキーマの `withEnableDynamicField` は `true` に設定されており、これはインポートするデータにスキーマで定義されていないフィールドを含められることを示しています。

</TabItem>

</Tabs>

スキーマが設定されたら、次のようにしてターゲットコレクションを作成できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

# 1. Milvusクライアントを設定
client = MilvusClient(
    uri=CLUSTER_ENDPOINT,
    token=API_KEY
)

# 2. インデックスパラメータを設定
index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name="float_vector",
    index_type="AUTOINDEX",
    metric_type="IP"
)

index_params.add_index(
    field_name="binary_vector",
    index_type="AUTOINDEX",
    metric_type="HAMMING"
)

index_params.add_index(
    field_name="float16_vector",
    index_type="AUTOINDEX",
    metric_type="IP"
)

index_params.add_index(
    field_name="sparse_vector",
    index_type="AUTOINDEX",
    metric_type="IP"
)

# 3. コレクションを作成
client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
```

</TabItem>

<TabItem value='java'>

```java
import com.google.common.collect.Lists;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import java.util.List;

// 1. Milvusクライアントを設定
MilvusClientV2 milvusClient = new MilvusClientV2(ConnectConfig.builder()
        .uri(CLUSTER_ENDPOINT)
        .token(API_KEY)
        .build());

// 2. インデックスパラメータを設定
IndexParam floatVectorIndex = IndexParam.builder()
        .fieldName("float_vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.IP)
        .build();

IndexParam binaryVectorIndex = IndexParam.builder()
        .fieldName("binary_vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.HAMMING)
        .build();

IndexParam float16VectorIndex = IndexParam.builder()
        .fieldName("float16_vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.IP)
        .build();

IndexParam sparseVectorIndex = IndexParam.builder()
        .fieldName("sparse_vector")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.IP)
        .build();

List<IndexParam> indexParamList = Lists.newArrayList(
        floatVectorIndex,
        binaryVectorIndex,
        float16VectorIndex,
        sparseVectorIndex
);

// 3. コレクションを作成
CreateCollectionReq.CollectionSchema schema = createSchema();
CreateCollectionReq request = CreateCollectionReq.builder()
        .collectionName(COLLECTION_NAME)
        .collectionSchema(schema)
        .indexParams(indexParamList)
        .build();
milvusClient.createCollection(request);
```

</TabItem>
</Tabs>

## ソースデータの準備\{#prepare-source-data}

**BulkWriter**は、データセットをJSON、Parquet、またはNumPyファイルに書き換えることができます。**RemoteBulkWriter**を作成し、このライターを使用してデータをこれらの形式に書き換えます。

### RemoteBulkWriterの作成\{#create-remotebulkwriter}

スキーマの準備ができたら、スキーマを使用して**RemoteBulkWriter**を作成できます。**RemoteBulkWriter**はリモートバケットへのアクセス許可を要求します。リモートバケットにアクセスするための接続パラメータを**ConnectParam**オブジェクトに設定し、**RemoteBulkWriter**で参照する必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

<Tabs groupId="python" defaultValue='python' values={[{"label":"AWS S3/GCS","value":"python"},{"label":"Microsoft Azure","value":"python_1"}]}>
<TabItem value='python'>

```python
from pymilvus.bulk_writer import RemoteBulkWriter, BulkFileType
# pymilvusバージョンが2.4.2より前の場合は、
# `from pymilvus import RemoteBulkWriter, BulkFileType` を使用

# リモートバケットにアクセスするための接続パラメータ
conn = RemoteBulkWriter.S3ConnectParam(
    endpoint="s3.amazonaws.com", # Google Cloud Storageの場合は "storage.googleapis.com" を使用
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY,
    bucket_name=BUCKET_NAME,
    secure=True
)
```

</TabItem>
<TabItem value='python_1'>

```python
# サードパーティの定数
AZURE_CONNECT_STRING = ""

conn = RemoteBulkWriter.AzureConnectParam(
    conn_str=AZURE_CONNECT_STRING,
    container_name=BUCKET_NAME
)

# または

# サードパーティの定数
AZURE_ACCOUNT_URL = ""
AZURE_CREDENTIAL = ""

conn = RemoteBulkWriter.AzureConnectParam(
    account_url=AZURE_ACCOUNT_URL,
    credential=AZURE_CREDENTIAL,
    container_name=BUCKET_NAME
)
```

</TabItem>
</Tabs>
</TabItem>

<TabItem value='java'>

<Tabs groupId="java" defaultValue='java' values={[{"label":"AWS S3/GCS","value":"java"},{"label":"Microsoft Azure","value":"java_1"}]}>
<TabItem value='java'>

```java
import io.milvus.bulkwriter.connect.S3ConnectParam;
import io.milvus.bulkwriter.connect.StorageConnectParam;

// リモートバケットライターを作成
StorageConnectParam storageConnectParam = S3ConnectParam.newBuilder()
        .withEndpoint("s3.amazonaws.com") // Google Cloud Storageの場合は "storage.googleapis.com" を使用
        .withBucketName(BUCKET_NAME)
        .withAccessKey(ACCESS_KEY)
        .withSecretKey(SECRET_KEY)
        .build();
```

</TabItem>
<TabItem value='java_1'>

```java
import io.milvus.bulkwriter.connect.AzureConnectParam;
import io.milvus.bulkwriter.connect.StorageConnectParam;

String AZURE_CONNECT_STRING = ""
String AZURE_CONTAINER = ""

StorageConnectParam storageConnectParam = AzureConnectParam.newBuilder()
        .withConnStr(AZURE_CONNECT_STRING)
        .withContainerName(AZURE_CONTAINER)
        .build()
```

</TabItem>
</Tabs>
</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

<p><strong>endpoint</strong>パラメータは、クラウドプロバイダーのストレージサービスURIを指します。</p>
<p>S3互換ストレージサービスの場合、可能なURIは以下の通りです：</p>
<ul>
<li><p><code>s3.amazonaws.com</code>（AWS S3）</p></li>
<li><p><code>storage.googleapis.com</code>（GCS）</p></li>
</ul>
<p>Azure Blob Storageコンテナの場合、次のような<a href="https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage#view-account-access-keys">有効な接続文字列</a>を使用する必要があります：</p>
<p><code>DefaultEndpointsProtocol=https;AccountName=&lt;accountName&gt;;AccountKey=&lt;accountKey&gt;;EndpointSuffix=core.windows.net</code></p>

</Admonition>

次に、**RemoteBulkWriter**で接続パラメータを参照できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>

<TabItem value='python'>

```python
writer = RemoteBulkWriter(
    schema=schema, # ターゲットコレクションスキーマ
    remote_path="/", # リモートバケットルートに対する出力ディレクトリ
    segment_size=1024*1024*1024, # 生データをセグメント化する際の最大セグメントサイズ
    connect_param=conn, # 上記で定義した接続パラメータ
    file_type=BulkFileType.PARQUET # 生成されるファイルのタイプ
)

# 可能なファイルタイプ：
# - BulkFileType.JSON,
# - BulkFileType.NPY, および
# - BulkFileType.PARQUET
```

上記のライターはJSON形式のファイルを生成し、指定されたバケットのルートフォルダにアップロードします。

- `remote_path="/"`

    これは、リモートバケット内の生成ファイルの出力パスを決定します。

    `"/"`に設定すると、**RemoteBulkWriter**は生成されたファイルをリモートバケットのルートフォルダに配置します。他のパスを使用するには、リモートバケットルートに対する相対パスに設定します。

- `file_type=BulkFileType.PARQUET`

    これは、生成されるファイルのタイプを決定します。可能な値は以下の通りです：

    - **BulkFileType.JSON**

    - **BulkFileType.PARQUET**

    - **BulkFileType.NPY**

- `segment_size=1024*1024*1024`

    これは、**BulkWriter**が生成されたファイルをセグメント化するかどうかを決定します。値はデフォルトで1024 MB（1024 * 1024 * 1024）です。データセットに多数のレコードが含まれる場合は、**segment_size**を適切な値に設定してデータをセグメント化することをお勧めします。

</TabItem>

<TabItem value='java'>

```java
import io.milvus.bulkwriter.RemoteBulkWriter;
import io.milvus.bulkwriter.RemoteBulkWriterParam;
import io.milvus.bulkwriter.common.clientenum.BulkFileType;

RemoteBulkWriterParam remoteBulkWriterParam = RemoteBulkWriterParam.newBuilder()
        .withCollectionSchema(schema)
        .withRemotePath("/")
        .withChunkSize(1024 * 1024 * 1024)
        .withConnectParam(storageConnectParam)
        .withFileType(BulkFileType.PARQUET)
        .build();

@SuppressWarnings("resource")
RemoteBulkWriter remoteBulkWriter = new RemoteBulkWriter(remoteBulkWriterParam);

// 可能なファイルタイプ：
// - BulkFileType.PARQUET
```

上記のライターはParquet形式のファイルを生成し、指定されたバケットのルートフォルダにアップロードします。

- `withRemotePath("/")`

    これは、リモートバケット内の生成ファイルの出力パスを決定します。

    `"/"`に設定すると、**RemoteBulkWriter**は生成されたファイルをリモートバケットのルートフォルダに配置します。他のパスを使用するには、リモートバケットルートに対する相対パスに設定します。

- `withFileType(BulkFileType.PARQUET)`

    これは、生成されるファイルのタイプを決定します。現在、**PARQUET**のみが利用可能です。

- `withChunkSize(1024*1024*1024)`

    これは、**BulkWriter**が生成されたファイルをセグメント化するかどうかを決定します。値はデフォルトで1024 MB（1024 * 1024 * 1024）です。データセットに多数のレコードが含まれる場合は、**withChunkSize**を適切な値に設定してデータをセグメント化することをお勧めします。

</TabItem>

</Tabs>

### ライターの使用\{#use-the-writer}

ライターには2つのメソッドがあります。1つはソースデータセットから行を追加するためのもの、もう1つはリモートファイルにデータをコミットするためのものです。

ソースデータセットから行を次のように追加できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
import random, string, json
import numpy as np
import tensorflow as tf

def generate_random_str(length=5):
    letters = string.ascii_uppercase
    digits = string.digits

    return ''.join(random.choices(letters + digits, k=length))

# バイナリベクトルのオプション入力：
# 1. [1, 0, 1, 1, 0, 0, 1, 0] のような整数のリスト
# 2. uint8のnumpy配列
def gen_binary_vector(to_numpy_arr):
    raw_vector = [random.randint(0, 1) for i in range(DIM)]
    if to_numpy_arr:
        return np.packbits(raw_vector, axis=-1)
    return raw_vector

# 浮動小数点ベクトルのオプション入力：
# 1. [0.56, 1.859, 6.55, 9.45] のような浮動小数点数のリスト
# 2. float32のnumpy配列
def gen_float_vector(to_numpy_arr):
    raw_vector = [random.random() for _ in range(DIM)]
    if to_numpy_arr:
        return np.array(raw_vector, dtype="float32")
    return raw_vector

# # bfloat16ベクトルのオプション入力：
# # 1. [0.56, 1.859, 6.55, 9.45] のような浮動小数点数のリスト
# # 2. bfloat16のnumpy配列
# def gen_bf16_vector(to_numpy_arr):
#     raw_vector = [random.random() for _ in range(DIM)]
#     if to_numpy_arr:
#         return tf.cast(raw_vector, dtype=tf.bfloat16).numpy()
#     return raw_vector

# float16ベクトルのオプション入力：
# 1. [0.56, 1.859, 6.55, 9.45] のような浮動小数点数のリスト
# 2. float16のnumpy配列
def gen_fp16_vector(to_numpy_arr):
    raw_vector = [random.random() for _ in range(DIM)]
    if to_numpy_arr:
        return np.array(raw_vector, dtype=np.float16)
    return raw_vector

# 疎ベクトルのオプション入力：
# {2: 13.23, 45: 0.54} のような辞書または {"indices": [1, 2], "values": [0.1, 0.2]} のみを受け入れます
# 注：キーをソートする必要はありません
def gen_sparse_vector(pair_dict: bool):
    raw_vector = {}
    dim = random.randint(2, 20)
    if pair_dict:
        raw_vector["indices"] = [i for i in range(dim)]
        raw_vector["values"] = [random.random() for _ in range(dim)]
    else:
        for i in range(dim):
            raw_vector[i] = random.random()
    return raw_vector

for i in range(2000):
    writer.append_row({
        "id": np.int64(i),
        "bool": True if i % 3 == 0 else False,
        "int8": np.int8(i%128),
        "int16": np.int16(i%1000),
        "int32": np.int32(i%100000),
        "int64": np.int64(i),
        "float": np.float32(i/3),
        "double": np.float64(i/7),
        "varchar": f"varchar_{i}",
        "json": json.dumps({"dummy": i, "ok": f"name_{i}"}),
        "array_str": np.array([f"str_{k}" for k in range(5)], np.dtype("str")),
        "array_int": np.array([k for k in range(10)], np.dtype("int64")),
        "float_vector": gen_float_vector(True),
        "binary_vector": gen_binary_vector(True),
        "float16_vector": gen_fp16_vector(True),
        # "bfloat16_vector": gen_bf16_vector(True),
        "sparse_vector": gen_sparse_vector(True),
        f"dynamic_{i}": i,
    })
    if (i+1)%1000 == 0:
        writer.commit()
        print('committed')

print(writer.batch_files)
```

</TabItem>

<TabItem value='java'>

```java
import com.google.gson.JsonObject;
import io.milvus.bulkwriter.RemoteBulkWriter;
import io.milvus.bulkwriter.RemoteBulkWriterParam;
import io.milvus.bulkwriter.common.clientenum.BulkFileType;
import io.milvus.bulkwriter.connect.S3ConnectParam;
import io.milvus.bulkwriter.connect.StorageConnectParam;
import io.milvus.common.utils.Float16Utils;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

Random random = new Random();

// バイナリベクトルを生成
private ByteBuffer genBinaryVector() {
    byte[] bytes = new byte[DIM / 8];
    random.nextBytes(bytes);
    return ByteBuffer.wrap(bytes);
}

// 浮動小数点ベクトルを生成
private List<Float> genFloatVector() {
    List<Float> vector = new ArrayList<>();
    for (int i = 0; i < DIM; i++) {
        vector.add(random.nextFloat());
    }
    return vector;
}

// float16ベクトルを生成
private ByteBuffer genFloat16Vector() {
    float[] floats = new float[DIM];
    for (int i = 0; i < DIM; i++) {
        floats[i] = random.nextFloat();
    }
    return Float16Utils.floatArrayToByteBuffer(floats);
}

// 疎ベクトルを生成
private Map<Long, Float> genSparseVector() {
    Map<Long, Float> vector = new HashMap<>();
    int dim = random.nextInt(19) + 2; // 2-20
    for (long i = 0; i < dim; i++) {
        vector.put(i, random.nextFloat());
    }
    return vector;
}

// データを追加
for (int i = 0; i < 2000; i++) {
    JsonObject row = new JsonObject();
    row.addProperty("id", i);
    row.addProperty("bool", i % 3 == 0);
    row.addProperty("int8", i % 128);
    row.addProperty("int16", i % 1000);
    row.addProperty("int32", i % 100000);
    row.addProperty("int64", i);
    row.addProperty("float", (float) i / 3);
    row.addProperty("double", (double) i / 7);
    row.addProperty("varchar", "varchar_" + i);

    JsonObject jsonField = new JsonObject();
    jsonField.addProperty("dummy", i);
    jsonField.addProperty("ok", "name_" + i);
    row.add("json", jsonField);

    List<String> arrayStr = new ArrayList<>();
    for (int k = 0; k < 5; k++) {
        arrayStr.add("str_" + k);
    }
    row.add("array_str", GSON_INSTANCE.toJsonTree(arrayStr));

    List<Long> arrayInt = new ArrayList<>();
    for (int k = 0; k < 10; k++) {
        arrayInt.add((long) k);
    }
    row.add("array_int", GSON_INSTANCE.toJsonTree(arrayInt));

    row.add("float_vector", GSON_INSTANCE.toJsonTree(genFloatVector()));
    row.add("binary_vector", GSON_INSTANCE.toJsonTree(genBinaryVector().array()));
    row.add("float16_vector", GSON_INSTANCE.toJsonTree(genFloat16Vector().array()));
    row.add("sparse_vector", GSON_INSTANCE.toJsonTree(genSparseVector()));

    JsonObject dynamicField = new JsonObject();
    dynamicField.addProperty("dynamic_" + i, i);
    row.add("$meta", dynamicField);

    remoteBulkWriter.appendRow(row);

    if ((i + 1) % 1000 == 0) {
        remoteBulkWriter.commit();
        System.out.println("committed");
    }
}

System.out.println(remoteBulkWriter.getBatchFiles());
```

</TabItem>
</Tabs>

**writer**の**append_row()**メソッドは、行の辞書を受け入れます。

行の辞書には、すべてのスキーマ定義フィールドをキーとして含める必要があります。動的フィールドが許可されている場合、未定義のフィールドも含めることができます。詳細については、[BulkWriterの使用](./use-bulkwriter#dynamic-schema-support)を参照してください。

**BulkWriter**は、**commit()**メソッドを呼び出した後にのみファイルを生成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
writer.commit()
```

</TabItem>

<TabItem value='java'>

```java
remoteBulkWriter.commit(false);
```

</TabItem>
</Tabs>

これで、**BulkWriter**は指定されたリモートバケットにソースデータを準備しました。

生成されたファイルを確認するには、writerの**data_path**プロパティを印刷して実際の出力パスを取得できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
print(writer.data_path)

# /5868ba87-743e-4d9e-8fa6-e07b39229425
```

</TabItem>

<TabItem value='java'>

```java
import java.util.List;

List<List<String>> batchFiles = remoteBulkWriter.getBatchFiles();
System.out.println(batchFiles);

// [["/5868ba87-743e-4d9e-8fa6-e07b39229425/1.parquet"]]
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

<p><strong>BulkWriter</strong>はUUIDを生成し、提供された出力ディレクトリ内にUUIDを使用してサブフォルダを作成し、すべての生成されたファイルをそのサブフォルダに配置します。</p>

</Admonition>

詳細については、[BulkWriterの使用](./use-bulkwriter#verify-the-result)を参照してください。

## 準備されたデータのインポート\{#import-prepared-data}

このステップの前に、準備されたデータがすでに目的のバケットにアップロードされていることを確認してください。

### インポートの開始\{#start-importing}

準備されたソースデータをインポートするには、次のように**bulk_import()**関数を呼び出す必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
from pymilvus.bulk_writer import bulk_import

# リモートバケット内の準備されたデータへの公開アクセス可能なURL
object_url = "s3://{0}/{1}/".format(BUCKET_NAME, str(writer.data_path)[1:])
# Google Cloud Storageの場合は`s3`を`gs`に変更

resp = bulk_import(
    api_key=API_KEY,
    url=CLOUD_API_ENDPOINT,
    cluster_id=CLUSTER_ID,
    collection_name=COLLECTION_NAME,
    object_url=object_url,
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY
)

job_id = resp.json()['data']['jobId']
print(job_id)

# job-0103f039ccdq9aip1xd4rf
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.bulkwriter.request.import_.CloudImportRequest;
import io.milvus.bulkwriter.BulkImport;

// データをコレクションに挿入
String prefix = batchFiles.get(0).get(0).split("/")[0];
String OBJECT_URL = String.format("s3://%s/%s/", BUCKET_NAME, prefix);

CloudImportRequest cloudImportRequest = CloudImportRequest.builder()
        .apiKey(API_KEY)
        .clusterId(CLUSTER_ID)
        .collectionName(COLLECTION_NAME)
        .objectUrl(OBJECT_URL)
        .accessKey(ACCESS_KEY)
        .secretKey(SECRET_KEY)
        .build();
String bulkImportResult = BulkImport.bulkImport(CLOUD_API_ENDPOINT, cloudImportRequest);

JsonObject bulkImportObject = new Gson().fromJson(bulkImportResult, JsonObject.class);
String jobId = bulkImportObject.getAsJsonObject("data").get("jobId").getAsString();
System.out.println(jobId);
// job-0103f039ccdq9aip1xd4rf
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

<p><strong>object_url</strong>は、リモートバケット内のファイルまたはフォルダへの有効なURLである必要があります。提供されたコードでは、**format()**メソッドを使用して、writerが返すバケット名とデータパスを結合して有効なオブジェクトURLを作成しています。</p>
<p>データとターゲットコレクションがAWSでホストされている場合、オブジェクトURLは<strong>s3://remote-bucket/file-path</strong>のようになります。writerが返すデータパスにプレフィックスを付けるための適用可能なURIについては、<a href="./data-import-storage-options">ストレージオプション</a>を参照してください。</p>

</Admonition>

### タスクの進行状況の確認\{#check-task-progress}

次のコードは、バルクインポートの進行状況を5秒ごとにチェックし、進行状況をパーセンテージで出力します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
import time
from pymilvus import get_import_progress

job_id = res.json()['data']['jobId']

res = get_import_progress(
    api_key=API_KEY,
    url=CLOUD_API_ENDPOINT,
    cluster_id=CLUSTER_ID,  # Zilliz CloudクラスターID（例: "in01-xxxxxxxxxxxxxxx"）
    job_id=job_id,
)

print(res.json()["data"]["progress"])

# バルクインポートの進行状況を確認
while res.json()["data"]["progress"] < 100:
    time.sleep(5)

    res = get_import_progress(
        # highlight-next-line
        url=CLOUD_API_ENDPOINT,
        api_key=API_KEY,
        job_id=job_id,
        cluster_id=CLUSTER_ID
    )

    print(res.json()["data"]["progress"])

# 0   -- インポート進行状況 0%
# 49  -- インポート進行状況 49%
# 100 -- インポート完了
```

</TabItem>

<TabItem value='java'>

```java
while (true) {
    System.out.println("バルクインポートジョブの状態を確認するまで5秒待機...");
    TimeUnit.SECONDS.sleep(5);

    CloudDescribeImportRequest request = CloudDescribeImportRequest.builder()
        .apiKey(API_KEY)
        .clusterId(CLUSTER_ID)
        .jobId(jobId)
        .build();
    String getImportProgressResult = BulkImport.getImportProgress(CLOUD_API_ENDPOINT, request);
    JsonObject getImportProgressObject = GSON_INSTANCE.fromJson(getImportProgressResult, JsonObject.class);
    String importProgressState = getImportProgressObject.getAsJsonObject("data").get("state").getAsString();
    String progress = getImportProgressObject.getAsJsonObject("data").get("progress").getAsString();

    if ("Failed".equals(importProgressState)) {
        String reason = getImportProgressObject.getAsJsonObject("data").get("reason").getAsString();
        System.out.printf("ジョブ %s は失敗しました。理由: %s%n", jobId, reason);
        break;
    } else if ("Completed".equals(importProgressState)) {
        System.out.printf("ジョブ %s は完了しました%n", jobId);
        break;
    } else {
        System.out.printf("ジョブ %s は実行中です。状態:%s 進行状況:%s%n", jobId, importProgressState, progress);
    }
}

// ジョブ job-01f36d8fd67u94avjfnxi0 は実行中です。状態:Importing 進行状況:0
// ジョブ job-01f36d8fd67u94avjfnxi0 は実行中です。状態:Importing 進行状況:49
// ジョブ 0f7fe853-d93e-4681-99f2-4719c63585cc は完了しました。
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

<p><strong>get<em>import</em>progress()</strong>の<strong>url</strong>を、ターゲットコレクションのクラウドリージョンに対応するものに置き換えてください。</p>

</Admonition>

次のようにして、すべてのバルクインポートジョブを一覧表示できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
from pymilvus import list_import_jobs

res = list_import_jobs(
    api_key=API_KEY,
    # highlight-next-line
    url=CLOUD_API_ENDPOINT,
    cluster_id=CLUSTER_ID  # Zilliz CloudクラスターID（例: "in01-xxxxxxxxxxxxxxx"）
)

print(res.json())

# {
#     "code": 0,
#     "data": {
#         "records": [
#             {
#                 "collectionName": "zero_to_hero",
#                 "jobId": "job-01f36d8fd67u94avjfnxi0",
#                 "state": "Completed"
#             }
#         ],
#         "count": 1,
#         "currentPage": 1,
#         "pageSize": 10
#     }
# }
```

</TabItem>

<TabItem value='java'>

```java
CloudListImportJobsRequest listImportJobsRequest = CloudListImportJobsRequest.builder()
        .apiKey(API_KEY)
        .clusterId(CLUSTER_ID) // Zilliz CloudクラスターID（例: "in01-xxxxxxxxxxxxxxx"）
        .build();
String listImportJobsResult = BulkImport.listImportJobs(CLOUD_API_ENDPOINT, listImportJobsRequest);
System.out.println(listImportJobsResult);
```

</TabItem>
</Tabs>

## まとめ\{#recaps}

このコースでは、データインポートの全プロセスをカバーしました。以下は復習のための要点です。

- データを調べて、ターゲットコレクションのスキーマを作成します。

- **BulkWriter**を使用する際は、以下の点に注意してください。

    - 追加する各行に、すべてのスキーマ定義フィールドをキーとして含めてください。動的フィールドが許可されている場合は、該当する未定義フィールドも含めてください。

    - すべての行を追加した後、**commit()**を呼び出すことを忘れないでください。

- **bulk_import()**を使用する際は、writerが返すデータパスとクラウドプロバイダーがホストする準備されたデータのエンドポイントを連結してオブジェクトURLを構築します。