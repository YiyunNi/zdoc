---
title: "JSON/JSON Linesファイルからのインポート | Cloud"
slug: /data-import-json
sidebar_label: "JSON/JSON Line"
beta: FALSE
notebook: FALSE
description: "JSONは、軽量で人間が読みやすいデータ形式であり、機械が簡単に解析および生成できます。言語に依存せず、Cファミリー言語のプログラマーに馴染みのある規約に従っているため、理想的なデータ交換形式です。 | Cloud"
type: origin
token: EHmOwLz5qi3tPDkb0gZcb5ExnJb
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - データインポート
  - milvus
  - フォーマットオプション
  - json

---

import Admonition from '@theme/Admonition';


# JSON/JSON Lines ファイルからのインポート

[JSON](https://www.json.org/json-en.html) (JavaScript Object Notation) は、軽量で人間が読みやすいデータ形式であり、機械が簡単に解析および生成できます。言語に依存せず、C ファミリー言語のプログラマーに馴染みのある規約に従うため、理想的なデータ交換形式です。

JSON Line は、各行が完全で有効な JSON オブジェクトであるテキスト形式であり、標準のテキストツールでデータストリームを段階的に処理するのを容易にします。

次の表は、JSON または JSON Line ファイルのデータ例を示しています。

<table>
   <tr>
     <th><p><strong>ファイル形式</strong></p></th>
     <th><p><strong>例</strong></p></th>
     <th></th>
   </tr>
   <tr>
     <td><p>JSON (.json)</p></td>
     <td><pre><code class="json language-json"> [     \{"primary_key":89,"vector":[0.7857309327639853,0.6185684289533679]},     \{"primary_key":-22,"vector":[0.7227987733802379,0.6910585598920134]},     \{"primary_key":85,"vector":[0.7948503430666686,0.6068055142521362]} ]</code></pre></td>
     <td></td>
   </tr>
   <tr>
     <td><p>JSON Lines (.ndjson, .jsonl)</p></td>
     <td><pre><code class="json language-json"> \{"primary_key":89,"vector":[0.7857309327639853,0.6185684289533679]} \{"primary_key":-22,"vector":[0.7227987733802379,0.6910585598920134]} \{"primary_key":85,"vector":[0.7948503430666686,0.6068055142521362]}</code></pre></td>
     <td></td>
   </tr>
</table>

生のデータを JSON ファイルに準備するには、[BulkWriter ツール](./use-bulkwriter)を使用することをお勧めします。次の図は、生のデータを JSON ファイルにマッピングする方法を示しています。

![json_data_structure](https://zdoc-images.s3.us-west-2.amazonaws.com/json_data_structure.png "json_data_structure")

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><strong>AutoID を有効にするかどうか</strong></li>
</ul>
<p><strong>id</strong> フィールドはコレクションのプライマリ フィールドとして機能します。プライマリ フィールドを自動的にインクリメントするには、スキーマで <strong>AutoID</strong> を有効にできます。この場合、ソース データ内の各行から <strong>id</strong> フィールドを除外する必要があります。</p>
<ul>
<li><strong>動的フィールドを有効にするかどうか</strong></li>
</ul>
<p>ターゲット コレクションで動的フィールドが有効になっている場合、事前定義されたスキーマに含まれていないフィールドを保存する必要がある場合は、書き込み操作中に <strong>&#36;meta</strong> 列を指定し、対応するキーと値のデータを提供できます。</p>
<ul>
<li><strong>大文字と小文字の区別</strong></li>
</ul>
<p>辞書キーとコレクション フィールド名では大文字と小文字が区別されます。データ内の辞書キーがターゲット コレクションのフィールド名と正確に一致していることを確認してください。ターゲット コレクションに <strong>id</strong> という名前のフィールドがある場合、各エンティティ辞書には <strong>id</strong> という名前のキーが必要です。<strong>ID</strong> または <strong>Id</strong> を使用するとエラーが発生します。</p>

</Admonition>

## ディレクトリ構造\{#directory-structure}

データを JSON または JSON Lines ファイルに準備する場合は、以下のツリー図に示すように、すべてのファイルをソースデータフォルダに直接配置します。

```plaintext
├── json-folder
│       ├── 1.json
│       └── 2.json 
```

## データインポート\{#import-data}

データが準備できたら、以下のいずれかの方法を使用してZilliz Cloudコレクションにインポートできます。

- [複数のパスからファイルをインポートする（推奨）](./data-import-json#import-files-from-multiple-paths-recommended)

- [フォルダからファイルをインポートする](./data-import-json#import-files-from-a-folder)

- [単一ファイルをインポートする](./data-import-json#import-a-single-file)

<Admonition type="info" icon="📘" title="Notes">

<p>ファイルが比較的小さい場合は、フォルダまたは複数パスの方法を使用して一度にすべてインポートすることをお勧めします。このアプローチにより、インポートプロセス中に内部最適化が行われ、後のリソース消費を削減するのに役立ちます。</p>

</Admonition>

Zilliz CloudコンソールでMilvus SDKを使用してデータをインポートすることもできます。詳細については、[データインポート（コンソール）](./import-data-on-web-ui)および[データインポート（SDK）](./import-data-via-sdks)を参照してください。

### 複数のパスからファイルをインポートする（推奨）\{#import-files-from-multiple-paths-recommended}

複数のパスからファイルをインポートする場合、各JSONファイルのパスを個別のリストに含め、以下のコード例のようにすべてのリストを上位レベルのリストにグループ化します。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "collectionName": "medium_articles",
        "partitionName": "",
        "objectUrls": [
            ["s3://bucket-name/json-folder-1/1.json"],
            ["s3://bucket-name/json-folder-2/1.json"],
            ["s3://bucket-name/json-folder-3/"]
         ],
        "accessKey": "",
        "secretKey": ""
    }'
```

### フォルダーからファイルをインポートする\{#import-files-from-a-folder}

ソースフォルダーにインポートするファイルが含まれている場合、次のようにリクエストにソースフォルダーを含めることができます。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "collectionName": "medium_articles",
        "partitionName": "",
        "objectUrls": [
            ["s3://bucket-name/json-folder/"]
         ],
        "accessKey": "",
        "secretKey": ""
    }'
```

<Admonition type="info" icon="📘" title="Notes">

<p>フォルダに複数の形式のファイルが含まれている場合、リクエストは失敗します。</p>

</Admonition>

### 単一ファイルのインポート\{#import-a-single-file}

準備したデータファイルが単一のJSONファイルである場合は、以下のコード例に示すようにインポートします。

```bash
curl --request POST \
     --url "https://api.cloud.zilliz.com/v2/vectordb/jobs/import/create" \
     --header "Authorization: Bearer ${TOKEN}" \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     -d '{
        "clusterId": "inxx-xxxxxxxxxxxxxxx",
        "collectionName": "medium_articles",
        "partitionName": "",
        "objectUrls": [
            ["s3://bucket-name/json-folder/1.json"]
         ],
        "accessKey": "",
        "secretKey": ""
    }'
```

## ストレージパス\{#storage-paths}

Zilliz Cloud は、クラウドストレージからのデータインポートをサポートしています。以下の表に、データファイルのストレージパスの可能性を示します。

<table>
   <tr>
     <th><p><strong>クラウド</strong></p></th>
     <th><p><strong>クイック例</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>AWS S3</strong></p></td>
     <td><p>s3://<em>bucket-name</em>/<em>json-folder</em>/</p><p>s3://<em>bucket-name</em>/<em>json-folder</em>/<em>data.json</em></p></td>
   </tr>
   <tr>
     <td><p><strong>Google Cloud Storage</strong></p></td>
     <td><p>gs://<em>bucket-name</em>/<em>json-folder</em>/</p><p>gs://<em>bucket-name</em>/<em>json-folder</em>/<em>data.json</em></p></td>
   </tr>
   <tr>
     <td><p><strong>Azure Blob</strong></p></td>
     <td><p><em>https:</em>//myaccount.blob.core.windows.net/bucket-name/json-folder/</p><p><em>https:</em>//myaccount.blob.core.windows.net/bucket-name/json-folder/data.json</p></td>
   </tr>
</table>

## 制限\{#limits}

ローカルの JSON ファイルまたはクラウドストレージからの JSON ファイルをインポートする際には、いくつかの制限があります。

<Admonition type="info" icon="📘" title="Notes">

<p>有効な JSON ファイルには、<strong>rows</strong> という名前のルートキーがあり、その対応する値は辞書のリストであり、それぞれがターゲットコレクションのスキーマに一致するエンティティを表します。</p>

</Admonition>

<table>
   <tr>
     <th><p><strong>インポート方法</strong></p></th>
     <th><p><strong>クラスタプラン</strong></p></th>
     <th><p><strong>インポートあたりの最大ファイル数</strong></p></th>
     <th><p><strong>最大ファイルサイズ</strong></p></th>
     <th><p><strong>合計インポートサイズの上限</strong></p></th>
   </tr>
   <tr>
     <td><p>ローカルファイルから</p></td>
     <td><p>すべてのプラン</p></td>
     <td><p>1ファイル</p></td>
     <td><p>1 GB</p></td>
     <td><p>1 GB</p></td>
   </tr>
   <tr>
     <td rowspan="2"><p>オブジェクトストレージから</p></td>
     <td><p>無料</p></td>
     <td><p>1,000ファイル</p></td>
     <td><p>1 GB</p></td>
     <td><p>1 GB</p></td>
   </tr>
   <tr>
     <td><p>Serverless & Dedicated</p></td>
     <td><p>1,000ファイル</p></td>
     <td><p>10 GB</p></td>
     <td><p>1 TB</p></td>
   </tr>
</table>

[データファイルの準備](https://milvus.io/docs/bulk_insert.md#Prepare-the-data-file) を参照してデータを自分で再構築するか、[BulkWriter ツール](./use-bulkwriter) を使用してソースデータファイルを生成できます。[上記の図のスキーマに基づいた準備済みサンプルデータをダウンロードするには、ここをクリックしてください](https://assets.zilliz.com/prepared_json_data.json)。

