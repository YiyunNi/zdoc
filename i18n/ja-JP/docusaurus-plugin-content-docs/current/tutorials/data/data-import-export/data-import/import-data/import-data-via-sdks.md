---
title: "データのインポート (SDK) | Cloud"
slug: /import-data-via-sdks
sidebar_label: "SDKs"
beta: FALSE
notebook: FALSE
description: "このガイドでは、SDK を使用して bulk-writer および bulk-import API でコレクションにデータをインポートする方法を学習できます。 | Cloud"
type: origin
token: MvgAwL4HIiuRRJkH0FwcJhxSnld
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データインポート
  - sdk

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# データインポート (SDK)

このガイドでは、SDK を使用して bulk-writer および bulk-import API でコレクションにデータをインポートする方法を説明します。

または、データ準備と Zilliz Cloud コレクションへのデータインポートの両方をカバーする[当社のファストトラックエンドツーエンドコース](./data-import-zero-to-hero)も参照できます。

## 依存関係のインストール\{#install-dependencies}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>

<TabItem value='python'>

**pymilvus** と **minio** をインストールするか、最新バージョンにアップグレードするには、ターミナルで次のコマンドを実行します。

```shell
python3 -m pip install --upgrade pymilvus minio
```

</TabItem>

<TabItem value='java'>

- Apache Maven の場合、以下の依存関係を **pom.xml** に追加します。

```java
<dependency>
  <groupId>io.milvus</groupId>
  <artifactId>milvus-sdk-java</artifactId>
  <version>2.4.8</version>
</dependency>

<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.5.9</version>
</dependency>
```

- Gradle/Grailsの場合、以下を実行します。

```shell
compile 'io.milvus:milvus-sdk-java:2.4.8'
compile 'io.minio:minio:8.5.9'
```

</TabItem>

</Tabs>

## 準備されたデータの確認\{#check-prepared-data}

[BulkWriterツール](./use-bulkwriter)を使用してデータを準備し、準備されたファイルのパスを取得したら、それらをZilliz Cloudコレクションにインポートする準備が整いました。準備が整っているかどうかを確認するには、次のようにします。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
from minio import Minio

# Third-party constants
ACCESS_KEY = "YOUR_ACCESS_KEY"
SECRET_KEY = "YOUR_SECRET_KEY"
BUCKET_NAME = "YOUR_BUCKET_NAME"
REMOTE_PATH = "YOUR_REMOTE_PATH"

client = Minio(
    endpoint="storage.googleapis.com", # use 's3.amazonaws.com' for AWS S3
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY,
    secure=True
)

objects = client.list_objects(
    bucket_name=BUCKET_NAME,
    prefix=REMOTE_PATH,
    recursive=True
)

print([obj.object_name for obj in objects])

# Output
#
# [
#     "folder/1/claps.npy",
#     "folder/1/id.npy",
#     "folder/1/link.npy",
#     "folder/1/publication.npy",
#     "folder/1/reading_time.npy",
#     "folder/1/responses.npy",
#     "folder/1/title.npy",
#     "folder/1/vector.npy"
# ]

```

</TabItem>

<TabItem value='java'>

```java
import io.minio.MinioClient;
import io.minio.Result;
import io.minio.messages.Item;

import java.util.Iterator;

// Third-party constants
String ACCESS_KEY = "YOUR_ACCESS_KEY";
String SECRET_KEY = "YOUR_SECRET_KEY";
String BUCKET_NAME = "YOUR_BUCKET_NAME";
String REMOTE_PATH = "YOUR_REMOTE_PATH";

MinioClient minioClient = MinioClient.builder()
        .endpoint("storage.googleapis.com") // use 's3.amazonaws.com' for AWS S3
        .credentials(ACCESS_KEY, SECRET_KEY)
        .build();
        
Iterable<Result<Item>> results = minioClient.listObjects(
    ListObjectsArgs.builder().bucket(BUCKET_NAME).prefix(REMOTE_PATH).build();
);

while (results.hasNext()) {
    Result<Item> result = results.next();
    System.out.println(result.get().objectName());
}

// Output
// [[1.parquet]]
```

</TabItem>
</Tabs>

## データのインポート\{#import-data}

データとコレクションの準備ができたら、ボリュームまたはオブジェクトストレージバケットやブロックストレージブロブコンテナなどの外部ストレージを介して、特定のコレクションにデータをインポートできます。

### ボリュームを介したデータのインポート\{#import-data-via-volume}

ボリュームを介してデータをインポートするには、事前にストレージを作成し、データをボリュームにアップロードする必要があります。詳細については、[データのマージ](./merge-data)を参照してください。

ボリュームの準備が整い、ソースデータファイルが配置されたら、次のようにボリュームからデータをインポートできます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
from pymilvus.bulk_writer import bulk_import

def cloud_bulkinsert():
    # The value of the URL is fixed.
    url = "https://api.cloud.zilliz.com"
    api_key = ""
    cluster_id = "inxx-xxxxxxxxxxxxxxx"
    volume_name = "my-first-volume"
    data_path = "dataPath"

    print(f"\n===================== import files to cloud vectordb ====================")

    resp = bulk_import(
        url=url,
        api_key=api_key,
        cluster_id=cluster_id,
        collection_name='quick_setup',
        volume_name=volume_name,
        data_paths=[[data_path]]
    )
    print(resp.json())

if __name__ == '__main__':
    # # to call cloud bulkinsert api, you need to apply a cloud service from Zilliz Cloud(https://zilliz.com/cloud)
    cloud_bulkinsert()

```

</TabItem>

<TabItem value='java'>

```java
private static String bulkImport() throws InterruptedException {
    /**
     * The value of the URL is fixed.
     */
    String CLOUD_API_ENDPOINT = "https://api.cloud.zilliz.com";
    String CLUSTER_ID = "inxx-xxxxxxxxxxxxxxx";
    String API_KEY = "";
    String VOLUME_NAME = "my-first-volume";
    List<String> DATA_PATH = Lists.newArrayList("dataPath");

    VolumeImportRequest volumeImportRequest = VolumeImportRequest.builder()
            .apiKey(API_KEY)
            .clusterId(CLUSTER_ID).collectionName("quick_setup")
            .volumeName(VOLUME_NAME).dataPaths(Lists.newArrayList(Collections.singleton(DATA_PATH)))
            .build();
    String bulkImportResult = BulkImportUtils.bulkImport(CLOUD_API_ENDPOINT, volumeImportRequest);
    System.out.println(bulkImportResult);

    JsonObject bulkImportObject = new Gson().fromJson(bulkImportResult, JsonObject.class);
    String jobId = bulkImportObject.getAsJsonObject("data").get("jobId").getAsString();
    System.out.println("Create a bulkInert task, job id: " + jobId);
    return jobId;
}

public static void main(String[] args) throws Exception {
    String jobId = bulkImport();
}

// 0f7fe853-d93e-4681-99f2-4719c63585cc
```

</TabItem>
</Tabs>

### 外部ストレージを介したデータインポート\{#import-data-via-external-storage}

外部ストレージを介してデータをインポートする場合は、次のようにします。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
from pymilvus.bulk_writer import bulk_import

# Bulk-import your data from the prepared data files
CLOUD_API_ENDPOINT = "https://api.cloud.zilliz.com"
CLUSTER_ID = "inxx-xxxxxxxxxxxxxxx"
API_KEY = ""
STORAGE_URL = ""
ACCESS_KEY = ""
SECRET_KEY = ""

res = bulk_import(
    api_key=API_KEY,
    url=CLOUD_API_ENDPOINT,
    cluster_id=CLUSTER_ID,
    collection_name="quick_setup",
    object_url=STORAGE_URL,
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY
)

print(res.json())

# Output
#
# {
#     "code": 0,
#     "data": {
#         "jobId": "9d0bc230-6b99-4739-a872-0b91cfe2515a"
#     }
# }
```

</TabItem>

<TabItem value='java'>

```java
private static String bulkImport() throws InterruptedException {
    /**
     * The value of the URL is fixed.
     */
    String CLOUD_API_ENDPOINT = "https://api.cloud.zilliz.com";
    String CLUSTER_ID = "inxx-xxxxxxxxxxxxxxx";
    String API_KEY = "";
    String STORAGE_URL = "";
    String ACCESS_KEY = "";
    String SECRET_KEY = "";

    CloudImportRequest cloudImportRequest = CloudImportRequest.builder()
            .apiKey(API_KEY)
            .clusterId(CLUSTER_ID)
            .collectionName("quick_setup")
            .objectUrl(STORAGE_URL)
            .accessKey(ACCESS_KEY)
            .secretKey(SECRET_KEY)
            .build();
    String bulkImportResult = BulkImport.bulkImport(CLOUD_API_ENDPOINT, cloudImportRequest);
    System.out.println(bulkImportResult);

    JsonObject bulkImportObject = new Gson().fromJson(bulkImportResult, JsonObject.class);
    String jobId = bulkImportObject.getAsJsonObject("data").get("jobId").getAsString();
    System.out.println("Create a bulkInert task, job id: " + jobId);
    return jobId;
}

public static void main(String[] args) throws Exception {
    String jobId = bulkImport();
}

// 0f7fe853-d93e-4681-99f2-4719c63585cc
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

<p>データインポートを成功させるには、ターゲットコレクションの実行中または保留中のインポートジョブが10,000未満であることを確認してください。</p>

</Admonition>

### インポートの進捗状況を確認する\{#check-import-progress}

指定された一括インポートジョブの進捗状況を確認できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
import json
from pymilvus.bulk_writer import get_import_progress

## Zilliz Cloud constants
CLOUD_API_ENDPOINT = "https://api.cloud.zilliz.com"
CLUSTER_ID = "inxx-xxxxxxxxxxxxxxx"
API_KEY = ""

# Get bulk-insert job progress
resp = get_import_progress(
    api_key=API_KEY,
    url=CLOUD_API_ENDPOINT,
    cluster_id=CLUSTER_ID,
    job_id="job-01fa0e5d42cjxudhpuehyp",
)

print(json.dumps(resp.json(), indent=4))
```

</TabItem>

<TabItem value='java'>

```java
private static void getImportProgress(String jobId) {
    /**
     * The value of the URL is fixed.
     */
    String CLOUD_API_ENDPOINT = "https://api.cloud.zilliz.com";
    String CLUSTER_ID = "inxx-xxxxxxxxxxxxxxx";
    String API_KEY = "";

    CloudDescribeImportRequest request = CloudDescribeImportRequest.builder()
        .apiKey(API_KEY)
        .clusterId(CLUSTER_ID)
        .jobId(jobId)
        .build();
    String getImportProgressResult = BulkImport.getImportProgress(CLOUD_API_ENDPOINT, request);
    System.out.println("Get import progress, result: " + getImportProgressResult);
}

public static void main(String[] args) throws Exception {
    getImportProgress("job-xxxx");
}
```

</TabItem>
</Tabs>

### すべてのインポートジョブをリストする\{#list-all-import-jobs}

すべてのバルクインポートタスクについて知りたい場合は、次のようにlist-import-jobs APIを呼び出すことができます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"}]}>
<TabItem value='python'>

```python
import json
from pymilvus.bulk_writer import list_import_jobs

## Zilliz Cloud constants
CLOUD_API_ENDPOINT = "https://api.cloud.zilliz.com"
CLUSTER_ID = "inxx-xxxxxxxxxxxxxxx"
API_KEY = ""

# List bulk-insert jobs
resp = list_import_jobs(
    api_key=API_KEY,
    url=CLOUD_API_ENDPOINT,
    cluster_id=CLUSTER_ID
)

print(json.dumps(resp.json(), indent=4))
```

</TabItem>

<TabItem value='java'>

```java
private static void listImportJobs() {
    /**
     * The value of the URL is fixed.
     */
    String CLOUD_API_ENDPOINT = "https://api.cloud.zilliz.com";
    String CLUSTER_ID = "inxx-xxxxxxxxxxxxxxx";
    String API_KEY = "";
    
    CloudListImportJobsRequest listImportJobsRequest = CloudListImportJobsRequest.builder()
            .apiKey(API_KEY)
            .clusterId(CLUSTER_ID).build();
    String listImportJobsResult = BulkImport.listImportJobs(CLOUD_API_ENDPOINT, listImportJobsRequest);
    System.out.println(listImportJobsResult);
}

public static void main(String[] args) throws Exception {
    listImportJobs();
}
```

</TabItem>
</Tabs>

## 関連トピック\{#related-topics}

- [ストレージオプション](./data-import-storage-options)

- [フォーマットオプション](./data-import-format-options)

- [RESTful API を介したデータインポート](./import-data-via-restful-api)

- [データインポートの基礎から応用まで](./data-import-zero-to-hero) 

