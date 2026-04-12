---
title: "BulkWriterの使用 | BYOC"
slug: /use-bulkwriter
sidebar_label: "BulkWriterの使用"
beta: FALSE
notebook: FALSE
description: "データ形式が要件を満たしていない場合、pymilvusおよびMilvusのJava SDKに含まれるデータ処理ツールであるBulkWriterを使用してデータを準備できます。| BYOC"
type: origin
token: QyjpwAaKuihAeJkNBUJcdFesn9e
sidebar_position: 1
keywords:
  - zilliz
  - ベクトルデータベース
  - cloud
  - データインポート
  - bulk writer

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# BulkWriterの使用

データ形式が要件を満たしていない場合、pymilvusおよびMilvusのJava SDKに含まれるデータ処理ツールである**BulkWriter**を使用してデータを準備できます。

## 概要\{#overview}

**BulkWriter**は、生のデータセットをZilliz Cloudコンソール、Milvus SDKの**BulkInsert** API、またはRESTful形式の**Import** APIなどを介してインポートするのに適した形式に変換するためのスクリプトです。2種類のライターを提供しています。

- **LocalBulkWriter**: 指定されたデータセットを読み取り、使いやすい形式に変換します。

- **RemoteBulkWriter**: **LocalBulkWriter**と同じタスクを実行しますが、変換されたデータファイルを指定されたリモートオブジェクトストレージバケットに転送する機能も追加されています。

## 手順\{#procedure}

### 依存関係の設定\{#set-up-dependencies}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>

<TabItem value='python'>

シェルで次のコマンドを実行して、pymilvusをインストールするか、最新バージョンにアップグレードします。

```bash
pip install --upgrade pymilvus
```

</TabItem>

<TabItem value='java'>

Apache Mavenの場合、**pom.xml**の依存関係に以下を追加します。

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

### コレクションスキーマの設定\{#set-up-a-collection-schema}

データセットをインポートするコレクションのスキーマを決定します。これには、データセットからどのフィールドを含めるかを選択することが含まれます。

以下のコードは、すべての可能なデータ型を持つコレクションスキーマを作成します。さらに、スキーマは主キーフィールドの自動インクリメントを無効にし、動的フィールドを有効にします。

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
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.param.collection.CollectionSchemaParam;
import io.milvus.param.collection.FieldType;
import io.milvus.grpc.DataType;

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

private static byte[] genBinaryVector() {
    Random ran = new Random();
    int byteCount = DIM / 8;
    ByteBuffer vector = ByteBuffer.allocate(byteCount);
    for (int i = 0; i < byteCount; ++i) {
        vector.put((byte) ran.nextInt(Byte.MAX_VALUE));
    }
    return vector.array();
}
```

</TabItem>
</Tabs>

### BulkWriterの作成\{#create-a-bulkwriter}

利用可能な**BulkWriter**には2種類あります。

- **LocalBulkWriter**

    **LocalBulkWriter**は、ソースデータセットから行を追加し、指定された形式のローカルファイルにコミットします。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>

    <TabItem value='python'>

    ```python
    from pymilvus.bulk_writer import LocalBulkWriter, BulkFileType
    # pymilvusバージョンが2.4.2より前の場合は、
    # `from pymilvus import LocalBulkWriter, BulkFileType` を使用

    writer = LocalBulkWriter(
        schema=schema,
        local_path='.',
        chunk_size=1024 * 1024 * 1024,
        file_type=BulkFileType.PARQUET
    )
    ```

    **LocalBulkWriter**を作成する際には、以下の点に注意してください。

    - 作成したスキーマを**schema**で参照します。

    - **local_path**に出力ディレクトリを設定します。

    - **file_type**に出力ファイルタイプを設定します。

    - データセットに多数のレコードが含まれる場合は、**segment_size**に適切な値を設定してデータをセグメント化することをお勧めします。

    パラメータ設定の詳細については、SDKリファレンスの**LocalBulkWriter**を参照してください。

    <Admonition type="info" icon="📘" title="Notes">

    <p><strong>LocalBulkWriter</strong>を使用して生成されたJSONファイルとParquetファイルは、Zilliz Cloudコンソールで直接Zilliz Cloudにインポートできます。</p>
    <p>他のタイプのファイルについては、インポート前にいずれかのバケットにアップロードしてください。ターゲットクラスターと同じクラウドリージョンにあるバケットにファイルをアップロードすることをお勧めします。</p>

    </Admonition>

    </TabItem>

    <TabItem value='java'>

    ```java
    import io.milvus.bulkwriter.LocalBulkWriter;
    import io.milvus.bulkwriter.LocalBulkWriterParam;
    import io.milvus.bulkwriter.common.clientenum.BulkFileType;

    LocalBulkWriterParam localBulkWriterParam = LocalBulkWriterParam.newBuilder()
        .withCollectionSchema(schema)
        .withLocalPath(".")
        .withChunkSize(1024 * 1024 * 1024)
        .withFileType(BulkFileType.PARQUET)
        .build();

    LocalBulkWriter localBulkWriter = new LocalBulkWriter(localBulkWriterParam);
    ```

    **LocalBulkWriter**を作成する際には、以下の点に注意してください。

    - 作成したスキーマを**withCollectionSchema()**で参照します。

    - 出力ディレクトリを**withLocalPath()**で設定します。

    - 出力ファイルタイプを**withFileType()**で**BulkFileType.PARQUET**に設定します。

    - データセットに多数のレコードが含まれる場合は、**withChunkSize()**に適切な値を設定してデータをセグメント化することをお勧めします。

    <Admonition type="info" icon="📘" title="Notes">

    <p>Java SDKのBulkWriterは現在、Apache Parquetのみを有効な出力ファイルタイプとして使用しています。</p>

    </Admonition>

    </TabItem>

    </Tabs>

- **RemoteBulkWriter**

    **RemoteBulkWriter**は、追加されたデータをローカルファイルにコミットする代わりに、リモートバケットにコミットします。そのため、**RemoteBulkWriter**を作成する前に**ConnectParam**オブジェクトを設定する必要があります。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
    <TabItem value='python'>

    <Tabs groupId="python" defaultValue='python' values={[{"label":"AWS S3/GCS","value":"python"},{"label":"Azure Blob Storage","value":"python_1"}]}>
    <TabItem value='python'>

    ```python
    from pymilvus.bulk_writer import RemoteBulkWriter
    # pymilvusバージョンが2.4.2より前の場合は、
    # `from pymilvus import RemoteBulkWriter` を使用

    # サードパーティの定数
    ACCESS_KEY="bucket-ak"
    SECRET_KEY="bucket-sk"
    BUCKET_NAME="a-bucket"
    REGION_NAME="region-name"

    # リモートバケットにアクセスするための接続パラメータ
    conn = RemoteBulkWriter.S3ConnectParam(
        endpoint="s3.amazonaws.com", # Google Cloud Storageの場合は 'storage.googleapis.com' を使用
        access_key=ACCESS_KEY,
        secret_key=SECRET_KEY,
        bucket_name=BUCKET_NAME,
        secure=True,
        region=REGION_NAME
    )

    from pymilvus.bulk_writer import BulkFileType
    # pymilvusバージョンが2.4.2より前の場合は、
    # `from pymilvus import BulkFileType` を使用

    writer = RemoteBulkWriter(
        schema=schema,
        remote_path="/",
        connect_param=conn,
        file_type=BulkFileType.PARQUET
    )

    print('bulk writer created.')
    ```

    </TabItem>
    <TabItem value='python_1'>

    ```python
    from pymilvus.bulk_writer import RemoteBulkWriter
    # pymilvusバージョンが2.4.2より前の場合は、
    # `from pymilvus import RemoteBulkWriter` を使用

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

    // リモートバケットの設定
    String ACCESS_KEY = "";
    String SECRET_KEY = "";
    String BUCKET_NAME = "";

    // 列挙型はCloudStorageを参照
    String CLOUD_NAME = "";
    String REGION_NAME = "";

    // リモートバケットライターを作成
    StorageConnectParam storageConnectParam = S3ConnectParam.newBuilder()
            .withEndpoint("storage.googleapis.com")
            .withBucketName(BUCKET_NAME)
            .withAccessKey(ACCESS_KEY)
            .withSecretKey(SECRET_KEY)
            .withCloudName(CLOUD_NAME)
            .withRegion(REGION_NAME)
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

    接続パラメータの準備ができたら、**RemoteBulkWriter**で次のように参照できます。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
    <TabItem value='python'>

    ```python
    from pymilvus.bulk_writer import RemoteBulkWriter
    # pymilvusバージョンが2.4.2より前の場合は、
    # `from pymilvus import RemoteBulkWriter` を使用

    writer = RemoteBulkWriter(
        schema=schema,
        remote_path="/",
        connect_param=conn,
        file_type=BulkFileType.PARQUET
    )
    ```

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

    RemoteBulkWriter remoteBulkWriter = new RemoteBulkWriter(remoteBulkWriterParam);
    ```

    </TabItem>
    </Tabs>

    **RemoteBulkWriter**を作成するためのパラメータは、**connect_param**を除いて**LocalBulkWriter**のものとほぼ同じです。パラメータ設定の詳細については、SDKリファレンスの**RemoteBulkWriter**および**ConnectParam**を参照してください。

### 書き込みの開始\{#start-writing}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>

<TabItem value='python'>

**BulkWriter**には2つのメソッドがあります：**append_row()**はソースデータセットから行を追加し、**commit()**は追加された行をローカルファイルまたはリモートバケットにコミットします。

デモンストレーション目的で、以下のコードはランダムに生成されたデータを追加します。

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

for i in range(10000):
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
```

</TabItem>

<TabItem value='java'>

**BulkWriter**には2つのメソッドがあります：**appendRow()**はソースデータセットから行を追加し、**commit()**は追加された行をローカルファイルまたはリモートバケットにコミットします。

デモンストレーション目的で、以下のコードはランダムに生成されたデータを追加します。

<Tabs groupId="java" defaultValue='java' values={[{"label":"Main","value":"java"},{"label":"Random data generators","value":"java_1"}]}>
<TabItem value='java'>

```java
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.milvus.common.utils.Float16Utils;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.*;
import java.util.concurrent.TimeUnit;

private static List<List<String>> uploadData() throws Exception {
    CreateCollectionReq.CollectionSchema collectionSchema = createSchema();
    try (RemoteBulkWriter remoteBulkWriter = createRemoteBulkWriter(collectionSchema)) {
        for (int i = 0; i < 10000; ++i) {
            JsonObject rowObject = new JsonObject();

            rowObject.addProperty("id", i);
            rowObject.addProperty("bool", i % 3 == 0);
            rowObject.addProperty("int8", i % 128);
            rowObject.addProperty("int16", i % 1000);
            rowObject.addProperty("int32", i % 100000);
            rowObject.addProperty("int64", i);
            rowObject.addProperty("float", i / 3);
            rowObject.addProperty("double", i / 7);
            rowObject.addProperty("varchar", "varchar_" + i);
            rowObject.addProperty("json", String.format("{\"dummy\": %s, \"ok\": \"name_%s\"}", i, i));
            rowObject.add("array_str", GSON_INSTANCE.toJsonTree(genStringArray(5)));
            rowObject.add("array_int", GSON_INSTANCE.toJsonTree(genIntArray(10)));
            rowObject.add("float_vector", GSON_INSTANCE.toJsonTree(genFloatVector()));
            rowObject.add("binary_vector", GSON_INSTANCE.toJsonTree(genBinaryVector()));
            rowObject.add("float16_vector", GSON_INSTANCE.toJsonTree(genFloat16Vector()));
            rowObject.add("sparse_vector", GSON_INSTANCE.toJsonTree(genSparseVector()));
            rowObject.addProperty("dynamic", "dynamic_" + i);

            remoteBulkWriter.appendRow(rowObject);

            if ((i+1)%1000 == 0) {
                remoteBulkWriter.commit(false);
            }
        }

        List<List<String>> batchFiles = remoteBulkWriter.getBatchFiles();
        System.out.println(batchFiles);
        return batchFiles;
    } catch (Exception e) {
        throw e;
    }
}
```

</TabItem>
<TabItem value='java_1'>

```java
private static byte[] genBinaryVector() {
    Random ran = new Random();
    int byteCount = DIM / 8;
    ByteBuffer vector = ByteBuffer.allocate(byteCount);
    for (int i = 0; i < byteCount; ++i) {
        vector.put((byte) ran.nextInt(Byte.MAX_VALUE));
    }
    return vector.array();
}

private static List<Float> genFloatVector() {
    Random ran = new Random();
    List<Float> vector = new ArrayList<>();
    for (int i = 0; i < DIM; ++i) {
        vector.add(ran.nextFloat());
    }
    return vector;
}

private static byte[] genFloat16Vector() {
    List<Float> originalVector = genFloatVector();
    return Float16Utils.f32VectorToFp16Buffer(originalVector).array();
}

private static SortedMap<Long, Float> genSparseVector() {
    Random ran = new Random();
    SortedMap<Long, Float> sparse = new TreeMap<>();
    int dim = ran.nextInt(18) + 2; // [2, 20)
    for (int i = 0; i < dim; ++i) {
        sparse.put((long)ran.nextInt(1000000), ran.nextFloat());
    }
    return sparse;
}

private static List<String> genStringArray(int length) {
    List<String> arr = new ArrayList<>();
    for (int i = 0; i < length; i++) {
        arr.add("str_" + i);
    }
    return arr;
}

private static List<Long> genIntArray(int length) {
    List<Long> arr = new ArrayList<>();
    for (long i = 0; i < length; i++) {
        arr.add(i);
    }
    return arr;
}
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

<p>上記のコードブロックでは、<code>vector</code>および<code>scalar_1</code>フィールドの値は、<code>generateFloatVectors()</code>および<code>generateString()</code>という名前の2つのプライベート関数によって生成されます。詳細については、<strong>Random data generator</strong>タブのコードを参照してください。</p>

</Admonition>

</TabItem>

</Tabs>

## 動的スキーマサポート\{#dynamic-schema-support}

[前のセクション](./use-bulkwriter#set-up-a-collection-schema)では、ライターで動的フィールドを許可するスキーマを参照しました。これにより、行を追加する際に未定義のフィールドを含めることができます。

デモンストレーション目的で、以下のコードはランダムに生成されたデータを追加します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
import random
import string

def generate_random_string(length=5):
    letters = string.ascii_uppercase
    digits = string.digits

    return ''.join(random.choices(letters + digits, k=length))

for i in range(10000):
    writer.append_row({
        "id": i,
        "vector":[random.uniform(-1, 1) for _ in range(768)],
        "dynamic_field_1": random.choice([True, False]),
        "dynamic_field_2": random.randint(0, 100)
    })

writer.commit()
```

</TabItem>

<TabItem value='java'>

<Tabs groupId="java" defaultValue='java' values={[{"label":"Main","value":"java"},{"label":"Random data generators","value":"java_1"}]}>
<TabItem value='java'>

```java
import java.util.Random;

List<JSONObject> data = new ArrayList<>();

for (int i=0; i<10000; i++) {
    Random rand = new Random();
    JSONObject row = new JSONObject();

    row.put("id", Long.valueOf(i));
    row.put("vector", generateFloatVectors(768));
    row.put("dynamic_field_1", rand.nextBoolean());
    row.put("dynamic_field_2", rand.nextInt(100));

    data.add(row);
}

// Use the data with BulkWriter
```

</TabItem>
<TabItem value='java_1'>

```java
private static List<Float> generateFloatVectors(int dimension) {
    Random rand = new Random();
    List<Float> vectors = new ArrayList<>();
    for (int i = 0; i < dimension; i++) {
        vectors.add(rand.nextFloat() * 2 - 1); // Range: [-1, 1]
    }
    return vectors;
}
```

</TabItem>
</Tabs>

</TabItem>

</Tabs>

## 結果の確認\{#verify-the-result}

結果を確認するには、writerの**data_path**プロパティを印刷して実際の出力パスを取得できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
print(writer.batch_files)

# PosixPath('/folder/5868ba87-743e-4d9e-8fa6-e07b39229425')
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

BulkWriterはUUIDを生成し、提供された出力ディレクトリ内にUUIDを使用してサブフォルダを作成し、すべての生成されたファイルをそのサブフォルダに配置します。[準備済みのサンプルデータをダウンロードするにはここをクリックしてください](https://assets.zilliz.com/bulk_writer.zip)。

考えられるフォルダ構造は以下の通りです。

- 生成されたファイルが指定されたセグメントサイズを超えない場合

    ```python
    # JSON
    ├── folder
    │   └── 45ae1139-1d87-4aff-85f5-0039111f9e6b
    │       └── 1.json

    # Parquet
    ├── folder
    │   └── 45ae1139-1d87-4aff-85f5-0039111f9e6b
    │       └── 1.parquet

    # Numpy
    ├── folder
    │   └── 45ae1139-1d87-4aff-85f5-0039111f9e6b
    │       ├── id.npy
    │       ├── vector.npy
    │       ├── scalar_1.npy
    │       ├── scalar_2.npy
    │       └── $meta.npy
    ```

    <table>
       <tr>
         <th><p><strong>ファイルタイプ</strong></p></th>
         <th><p><strong>有効なインポートパス</strong></p></th>
       </tr>
       <tr>
         <td><p><strong>JSON</strong></p></td>
         <td><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/</em></p><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/1.json</em></p></td>
       </tr>
       <tr>
         <td><p><strong>Parquet</strong></p></td>
         <td><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/</em></p><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/1.parquet</em></p></td>
       </tr>
       <tr>
         <td><p><strong>NumPy</strong></p></td>
         <td><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/</em></p><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/&ast;.npy</em></p></td>
       </tr>
    </table>

- 生成されたファイルが指定されたセグメントサイズを超える場合

    ```python
    # 以下の例では、2つのセグメントが生成されると仮定しています。

    # JSON
    ├── folder
    │   └── 45ae1139-1d87-4aff-85f5-0039111f9e6b
    │       ├── 1.json
    │       └── 2.json

    # Parquet
    ├── folder
    │   └── 45ae1139-1d87-4aff-85f5-0039111f9e6b
    │       ├── 1.parquet
    │       └── 2.parquet

    # Numpy
    ├── folder
    │   └── 45ae1139-1d87-4aff-85f5-0039111f9e6b
    │       ├── 1
    │       │   ├── id.npy
    │       │   ├── vector.npy
    │       │   ├── scalar_1.npy
    │       │   ├── scalar_2.npy
    │       │   └── $meta.npy
    │       └── 2
    │           ├── id.npy
    │           ├── vector.npy
    │           ├── scalar_1.npy
    │           ├── scalar_2.npy
    │           └── $meta.npy
    ```

    <table>
       <tr>
         <th><p><strong>ファイルタイプ</strong></p></th>
         <th><p><strong>有効なインポートパス</strong></p></th>
       </tr>
       <tr>
         <td><p><strong>JSON</strong></p></td>
         <td><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/</em></p></td>
       </tr>
       <tr>
         <td><p><strong>Parquet</strong></p></td>
         <td><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/</em></p></td>
       </tr>
       <tr>
         <td><p><strong>NumPy</strong></p></td>
         <td><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/</em></p><p><em>s3://remote_bucket/folder/45ae1139-1d87-4aff-85f5-0039111f9e6b/&ast;.npy</em></p></td>
       </tr>
    </table>

## 関連トピック\{#related-topics}

- [Web UIでのデータインポート](./import-data-on-web-ui)

- [RESTful APIによるデータインポート](./import-data-via-restful-api)

- [SDKによるデータインポート](./import-data-via-sdks)