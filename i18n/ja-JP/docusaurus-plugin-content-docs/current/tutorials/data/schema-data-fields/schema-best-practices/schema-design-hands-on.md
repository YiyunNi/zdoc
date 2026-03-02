---
title: "検索のためのデータモデル設計 | Cloud"
slug: /schema-design-hands-on
sidebar_label: "データモデル設計"
beta: FALSE
notebook: FALSE
description: "検索エンジンとも呼ばれる情報検索システムは、Retrieval-augmented generation (RAG)、ビジュアル検索、製品推薦など、さまざまなAIアプリケーションに不可欠です。これらのシステムの核となるのは、情報を整理、インデックス化、取得するために慎重に設計されたデータモデルです。 | Cloud"
type: origin
token: PV2bwNENViEjXWkOgzZcXoKHnce
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - スキーマ設計
  - ハンズオン
  - プライベートLLM
  - NN検索
  - LLM評価
  - 疎 vs 密

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 検索のためのデータモデル設計

検索エンジンとしても知られる情報検索システムは、検索拡張生成 (RAG)、ビジュアル検索、製品レコメンデーションなど、さまざまなAIアプリケーションに不可欠です。これらのシステムの中核には、情報を整理、インデックス作成、取得するための慎重に設計されたデータモデルがあります。

Zilliz Cloudでは、コレクションスキーマを通じて検索データモデルを指定し、非構造化データ、その密または疎なベクトル表現、および構造化メタデータを整理できます。テキスト、画像、その他のデータ型を扱う場合でも、この実践的なガイドは、検索データモデルを設計するための主要なスキーマ概念を理解し、適用するのに役立ちます。

![Kc3Cweq1AhAmMGbrVgRcTlTKnUf](https://zdoc-images.s3.us-west-2.amazonaws.com/Kc3Cweq1AhAmMGbrVgRcTlTKnUf.png)

## データモデル{#data-model}

検索システムのデータモデル設計には、ビジネスニーズを分析し、情報をスキーマで表現されたデータモデルに抽象化することが含まれます。適切に定義されたスキーマは、データモデルをビジネス目標に合わせ、データの一貫性とサービス品質を確保するために重要です。さらに、適切なデータ型とインデックスを選択することは、ビジネス目標を経済的に達成するために重要です。

### ビジネスニーズの分析{#analyzing-business-needs}

ビジネスニーズに効果的に対応するには、ユーザーが実行するクエリの種類を分析し、最適な検索方法を決定することから始まります。

- **ユーザークエリ:** ユーザーが実行すると予想されるクエリの種類を特定します。これにより、スキーマが実際のユースケースをサポートし、検索パフォーマンスを最適化するのに役立ちます。これには以下が含まれる場合があります。

    - 自然言語クエリに一致するドキュメントの取得

    - 参照画像に似た画像やテキスト記述に一致する画像の検索

    - 名前、カテゴリ、ブランドなどの属性で製品を検索

    - 構造化されたメタデータ (例: 公開日、タグ、評価) に基づいてアイテムをフィルタリング

    - ハイブリッドクエリで複数の基準を組み合わせる (例: ビジュアル検索で、画像とそのキャプションの両方の意味的類似性を考慮する)

- **検索方法:** ユーザーが実行するクエリの種類に合わせた適切な検索技術を選択します。異なる方法は異なる目的を果たし、より強力な結果を得るために組み合わせることができます。

    - **セマンティック検索**: 密なベクトル類似性を使用して、テキストや画像などの非構造化データに最適な、意味が類似したアイテムを見つけます。

    - **フルテキスト検索**: セマンティック検索をキーワードマッチングで補完します。フルテキスト検索は、語彙分析を利用して、長い単語が断片化されたトークンに分割されるのを防ぎ、取得中に特殊な用語を把握できます。

    - **メタデータフィルタリング**: ベクトル検索に加えて、日付範囲、カテゴリ、タグなどの制約を適用します。

### ビジネス要件を検索データモデルに変換する{#translates-business-requirements-into-a-search-data-model}

次のステップは、情報のコアコンポーネントとその検索方法を特定することにより、ビジネス要件を具体的なデータモデルに変換することです。

- 生のコンテンツ (テキスト、画像、音声)、関連するメタデータ (タイトル、タグ、著作権)、およびコンテキスト属性 (タイムスタンプ、ユーザー行動など) など、保存する必要があるデータを定義します。

- 各要素に適切なデータ型と形式を決定します。例:

    - テキスト記述 → string

    - 画像またはドキュメントの埋め込み → dense または sparse vectors

    - カテゴリ、タグ、またはフラグ → string、array、および bool

    - 価格や評価などの数値属性 → integer または float

    - 著者詳細などの構造化情報 -> json

これらの要素を明確に定義することで、データの一貫性、正確な検索結果、および下流のアプリケーションロジックとの統合の容易さが保証されます。

## スキーマ設計{#schema-design}

Zilliz Cloudでは、データモデルはコレクションスキーマを通じて表現されます。効果的な取得を可能にするには、コレクションスキーマ内で適切なフィールドを設計することが重要です。各フィールドは、コレクションに保存される特定の種類のデータを定義し、検索プロセスで異なる役割を果たします。大まかに言えば、Zilliz Cloudは主に2種類のフィールドをサポートしています。**ベクトルフィールド**と**スカラーフィールド**です。

これで、データモデルを、ベクトルと補助的なスカラーフィールドを含むフィールドのスキーマにマッピングできます。各フィールドがデータモデルの属性と関連していることを確認し、特にベクトルタイプ (dense または sparse) とその次元に注意してください。

### ベクトルフィールド{#vector-field}

ベクトルフィールドは、テキスト、画像、音声などの非構造化データ型の埋め込みを保存します。これらの埋め込みは、データ型と利用される取得方法に応じて、密、疎、またはバイナリである場合があります。通常、密ベクトルはセマンティック検索に使用され、疎ベクトルはフルテキストまたは語彙マッチングに適しています。バイナリベクトルは、ストレージと計算リソースが限られている場合に役立ちます。コレクションには、マルチモーダルまたはハイブリッド取得戦略を可能にするために、いくつかのベクトルフィールドが含まれる場合があります。このトピックの詳細なガイドについては、[マルチベクトルハイブリッド検索](./hybrid-search)を参照してください。

Zilliz Cloudは、[密ベクトル](./use-dense-vector)用の`FLOAT_VECTOR`、[疎ベクトル](./use-sparse-vector)用の`SPARSE_FLOAT_VECTOR`、[バイナリベクトル](./use-binary-vector)用の`BINARY_VECTOR`のベクトルデータ型をサポートしています。

### スカラーフィールドと複合フィールド{#scalar-and-composite-fields}

スカラーフィールドは、数値、文字列、日付などのプリミティブな構造化された値 (一般にメタデータと呼ばれる) を保存します。これらの値はベクトル検索結果とともに返され、フィルタリングとソートに不可欠です。これらを使用すると、特定のカテゴリや定義された時間範囲にドキュメントを制限するなど、特定の属性に基づいて検索結果を絞り込むことができます。

Zilliz Cloudは、`BOOL`、`INT8/16/32/64`、`FLOAT`、`DOUBLE`、`VARCHAR`などのスカラー型、および`JSON`や`ARRAY`などの複合型をサポートしており、非ベクトルデータを保存およびフィルタリングできます。これらの型は、検索操作の精度とカスタマイズ性を向上させます。

## スキーマ設計における高度な機能の活用{#leverage-advanced-features-in-schema-design}

スキーマを設計する際、サポートされているデータ型を使用してデータをフィールドにマッピングするだけでは不十分です。フィールド間の関係と構成に利用できる戦略を徹底的に理解することが不可欠です。設計段階で主要な機能を念頭に置くことで、スキーマが即座のデータ処理要件を満たすだけでなく、将来のニーズに合わせてスケーラブルで適応性があることが保証されます。これらの機能を慎重に統合することで、Zilliz Cloudの機能を最大限に活用し、より広範なデータ戦略と目標をサポートする強力なデータアーキテクチャを構築できます。コレクションスキーマを作成する主要な機能の概要を以下に示します。

### 主キー{#primary-key}

主キーフィールドはスキーマの基本的なコンポーネントであり、コレクション内の各エンティティを一意に識別します。主キーの定義は必須です。整数または文字列型のスカラーフィールドであり、`is_primary=True`としてマークする必要があります。オプションで、主キーに`auto_id`を有効にできます。これは、コレクションにデータが取り込まれるにつれて単調に増加する整数が自動的に割り当てられます。

詳細については、[主フィールドとAutoID](./primary-field-auto-id)を参照してください。

### パーティショニング{#partitioning}

検索を高速化するために、オプションでパーティショニングをオンにできます。パーティショニングに特定のスカラーフィールドを指定し、検索中にこのフィールドに基づいてフィルタリング条件を指定することで、検索範囲を関連するパーティションのみに効果的に制限できます。この方法は、検索ドメインを削減することで、取得操作の効率を大幅に向上させます。

詳細については、[パーティションキーの使用](./use-partition-key)を参照してください。

### アナライザー{#analyzer}

アナライザーは、テキストデータを処理および変換するための不可欠なツールです。その主な機能は、生のテキストをトークンに変換し、インデックス作成と取得のためにそれらを構造化することです。これは、文字列をトークン化し、ストップワードを削除し、個々の単語をトークンにステミングすることによって行われます。

詳細については、[アナライザーの概要](./analyzer-overview)を参照してください。

### 関数{#function}

Zilliz Cloudでは、スキーマの一部として組み込み関数を定義して、特定のフィールドを自動的に導出できます。たとえば、`VARCHAR`フィールドから疎ベクトルを生成してフルテキスト検索をサポートする組み込みBM25関数を追加できます。これらの関数派生フィールドは、前処理を合理化し、コレクションが自己完結型でクエリ対応であることを保証します。

詳細については、[フルテキスト検索](./full-text-search)を参照してください。

## 実世界の例{#a-real-world-example}

このセクションでは、上記の図に示すマルチメディアドキュメント検索アプリケーションのスキーマ設計とコード例を概説します。このスキーマは、次のフィールドにデータがマッピングされた記事を含むデータセットを管理するように設計されています。

<table>
   <tr>
     <th><p><strong>フィールド</strong></p></th>
     <th><p><strong>データソース</strong></p></th>
     <th><p><strong>検索方法で使用</strong></p></th>
     <th><p><strong>主キー</strong></p></th>
     <th><p><strong>パーティションキー</strong></p></th>
     <th><p><strong>アナライザー</strong></p></th>
     <th><p><strong>関数入力/出力</strong></p></th>
   </tr>
   <tr>
     <td><p>article_id (<code>INT64</code>)</p></td>
     <td><p><code>auto_id</code>が有効な状態で自動生成</p></td>
     <td><p><a href="./get-and-scalar-query">Getを使用したクエリ</a></p></td>
     <td><p>Y</p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
   </tr>
   <tr>
     <td><p>title (<code>VARCHAR</code>)</p></td>
     <td><p>記事のタイトル</p></td>
     <td><p><a href="./text-match">テキストマッチ</a></p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
     <td><p>Y</p></td>
     <td><p>N</p></td>
   </tr>
   <tr>
     <td><p>timestamp (<code>INT32</code>)</p></td>
     <td><p>公開日</p></td>
     <td><p><a href="./use-partition-key">パーティションキーによるフィルタリング</a></p></td>
     <td><p>N</p></td>
     <td><p>Y</p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
   </tr>
   <tr>
     <td><p>text (<code>VARCHAR</code>)</p></td>
     <td><p>記事の生テキスト</p></td>
     <td><p><a href="./hybrid-search">マルチベクトルハイブリッド検索</a></p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
     <td><p>Y</p></td>
     <td><p>入力</p></td>
   </tr>
   <tr>
     <td><p>text_dense_vector (<code>FLOAT_VECTOR</code>)</p></td>
     <td><p>テキスト埋め込みモデルによって生成された密ベクトル</p></td>
     <td><p><a href="./single-vector-search">基本的なベクトル検索</a></p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
   </tr>
   <tr>
     <td><p>text_sparse_vector (<code>SPARSE_FLOAT_VECTOR</code>)</p></td>
     <td><p>組み込みBM25関数によって自動生成された疎ベクトル</p></td>
     <td><p><a href="./full-text-search">フルテキスト検索</a></p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
     <td><p>N</p></td>
     <td><p>出力</p></td>
   </tr>
</table>

スキーマとさまざまな種類のフィールドの追加に関する詳細なガイダンスについては、[スキーマの説明](./schema-explained)を参照してください。

### ステップ1: スキーマの初期化{#step-1-initialize-schema}

まず、空のスキーマを作成する必要があります。このステップは、データモデルを定義するための基礎構造を確立します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

schema = MilvusClient.create_schema()
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

// 1. Connect to Milvus server
ConnectConfig connectConfig = ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .build();

MilvusClientV2 client = new MilvusClientV2(connectConfig);

// 2. Create an empty schema
CreateCollectionReq.CollectionSchema schema = client.createSchema();
```

</TabItem>

<TabItem value='javascript'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

//Skip this step using JavaScript
```

</TabItem>

<TabItem value='go'>

```go
import "github.com/milvus-io/milvus/client/v2/entity"

schema := entity.NewSchema()
```

</TabItem>

<TabItem value='bash'>

```bash
# Skip this step using cURL
```

</TabItem>
</Tabs>

### ステップ2: フィールドの追加{#step-2-add-fields}

スキーマが作成されたら、次のステップは、データを構成するフィールドを指定することです。各フィールドは、それぞれのデータ型と属性に関連付けられています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import DataType

schema.add_field(field_name="article_id", datatype=DataType.INT64, is_primary=True, auto_id=True, description="article id")
schema.add_field(field_name="title", datatype=DataType.VARCHAR, enable_analyzer=True, enable_match=True, max_length=200, description="article title")
schema.add_field(field_name="timestamp", datatype=DataType.INT32, description="publish date")
schema.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=2000, enable_analyzer=True, description="article text content")
schema.add_field(field_name="text_dense_vector", datatype=DataType.FLOAT_VECTOR, dim=768, description="text dense vector")
schema.add_field(field_name="text_sparse_vector", datatype=DataType.SPARSE_FLOAT_VECTOR, description="text sparse vector")
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.AddFieldReq;

schema.addField(AddFieldReq.builder()
        .fieldName("article_id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .autoID(true)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("title")
        .dataType(DataType.VarChar)
        .maxLength(200)
        .enableAnalyzer(true)
        .enableMatch(true)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("timestamp")
        .dataType(DataType.Int32)
        .build())
schema.addField(AddFieldReq.builder()
        .fieldName("text")
        .dataType(DataType.VarChar)
        .maxLength(2000)
        .enableAnalyzer(true)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("text_dense_vector")
        .dataType(DataType.FloatVector)
        .dimension(768)
        .build());
schema.addField(AddFieldReq.builder()
        .fieldName("text_sparse_vector")
        .dataType(DataType.SparseFloatVector)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
const fields = [
    {
        name: "article_id",
        data_type: DataType.Int64,
        is_primary_key: true,
        auto_id: true
    },
    {
        name: "title",
        data_type: DataType.VarChar,
        max_length: 200,
        enable_analyzer: true,
        enable_match: true
    },
    {
        name: "timestamp",
        data_type: DataType.Int32
    },
    {
        name: "text",
        data_type: DataType.VarChar,
        max_length: 2000,
        enable_analyzer: true
    },
    {
        name: "text_dense_vector",
        data_type: DataType.FloatVector,
        dim: 768
    },
    {
        name: "text_sparse_vector",
        data_type: DataType.SparseFloatVector
    }
]
```

</TabItem>

<TabItem value='go'>

```go
schema.WithField(entity.NewField().
    WithName("article_id").
    WithDataType(entity.FieldTypeInt64).
    WithIsPrimaryKey(true).
    WithIsAutoID(true).
    WithDescription("article id"),
).WithField(entity.NewField().
    WithName("title").
    WithDataType(entity.FieldTypeVarChar).
    WithMaxLength(200).
    WithEnableAnalyzer(true).
    WithEnableMatch(true).
    WithDescription("article title"),
).WithField(entity.NewField().
    WithName("timestamp").
    WithDataType(entity.FieldTypeInt32).
    WithDescription("publish date"),
).WithField(entity.NewField().
    WithName("text").
    WithDataType(entity.FieldTypeVarChar).
    WithMaxLength(2000).
    WithEnableAnalyzer(true).
    WithDescription("article text content"),
).WithField(entity.NewField().
    WithName("text_dense_vector").
    WithDataType(entity.FieldTypeFloatVector).
    WithDim(768).
    WithDescription("text dense vector"),
).WithField(entity.NewField().
    WithName("text_sparse_vector").
    WithDataType(entity.FieldTypeSparseVector).
    WithDescription("text sparse vector"),
)
```

</TabItem>

<TabItem value='bash'>

```bash
export fields='[
    {
        "fieldName": "article_id",
        "dataType": "Int64",
        "isPrimary": true
    },
    {
        "fieldName": "title",
        "dataType": "VarChar",
        "elementTypeParams": {
            "max_length": 200,
            "enable_analyzer": true,
            "enable_match": true
        }
    },
    {
        "fieldName": "timestamp",
        "dataType": "Int32"
    },
    {
       "fieldName": "text",
       "dataType": "VarChar",
       "elementTypeParams": {
            "max_length": 2000,
            "enable_analyzer": true
        }
    },
    {
       "fieldName": "text_dense_vector",
       "dataType": "FloatVector",
       "elementTypeParams": {
            "dim": 768
        }
    },
    {
       "fieldName": "text_sparse_vector",
       "dataType": "SparseFloatVector",
    }
]'

export schema="{
    \"autoID\": true,
    \"fields\": $fields
}"
```

</TabItem>
</Tabs>

この例では、フィールドに以下の属性が指定されています。

- 主キー: `article_id` は主キーとして使用され、入力されるエンティティの主キーを自動的に割り当てることができます。

- パーティションキー: `timestamp` はパーティションキーとして割り当てられ、パーティションによるフィルタリングを可能にします。

- テキストアナライザー: テキストアナライザーは、`title` と `text` の2つの文字列フィールドに適用され、それぞれテキストマッチとフルテキスト検索をサポートします。

### ステップ3: (オプション) 関数を追加する{#step-3-optional-add-functions}

データクエリ機能を強化するために、関数をスキーマに組み込むことができます。例えば、特定のフィールドに関連するデータを処理する関数を作成できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import Function, FunctionType

bm25_function = Function(
    name="text_bm25",
    input_field_names=["text"],
    output_field_names=["text_sparse_vector"],
    function_type=FunctionType.BM25,
)

schema.add_function(bm25_function)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.common.clientenum.FunctionType;
import io.milvus.v2.service.collection.request.CreateCollectionReq.Function;

import java.util.*;

schema.addFunction(Function.builder()
        .functionType(FunctionType.BM25)
        .name("text_bm25")
        .inputFieldNames(Collections.singletonList("text"))
        .outputFieldNames(Collections.singletonList("text_sparse_vector"))
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
import FunctionType from "@zilliz/milvus2-sdk-node";

const functions = [
    {
      name: 'text_bm25',
      description: 'bm25 function',
      type: FunctionType.BM25,
      input_field_names: ['text'],
      output_field_names: ['text_sparse_vector'],
      params: {},
    },
]；
```

</TabItem>

<TabItem value='go'>

```go
function := entity.NewFunction().
    WithName("text_bm25").
    WithInputFields("text").
    WithOutputFields("text_sparse_vector").
    WithType(entity.FunctionTypeBM25)
schema.WithFunction(function)
```

</TabItem>

<TabItem value='bash'>

```bash
export myFunctions='[
    {
        "name": "text_bm25",
        "type": "BM25",
        "inputFieldNames": ["text"],
        "outputFieldNames": ["text_sparse_vector"],
        "params": {}
    }
]'

export schema="{
    \"autoID\": true,
    \"fields\": $fields
    \"functions\": $myFunctions
}"
```

</TabItem>
</Tabs>

この例では、スキーマに組み込みのBM25関数を追加し、`text`フィールドを入力として利用し、結果として得られる疎ベクトルを`text_sparse_vector`フィールドに格納します。

## 次のステップ{#next-steps}

- [コレクションの作成](./manage-collections-sdks)

- [コレクションフィールドの変更](./alter-collection-field)

