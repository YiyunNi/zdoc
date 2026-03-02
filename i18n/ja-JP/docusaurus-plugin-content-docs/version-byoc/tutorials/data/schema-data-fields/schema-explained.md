---
title: "スキーマの説明 | BYOC"
slug: /schema-explained
sidebar_label: "スキーマの説明"
beta: FALSE
notebook: FALSE
description: "スキーマはcollectionのデータ構造を定義します。collectionを作成する前に、そのスキーマの設計を検討する必要があります。このページでは、collectionスキーマを理解し、独自のスキーマを設計するのに役立ちます。 | BYOC"
type: origin
token: Vs4YwNnvzitoQ8kunlGcWMJInbf
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - collection
  - スキーマの説明
  - milvus lite
  - milvus benchmark
  - managed milvus
  - Serverless vector database

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# スキーマの説明

スキーマはコレクションのデータ構造を定義します。コレクションを作成する前に、そのスキーマの設計を検討する必要があります。このページでは、コレクションスキーマを理解し、独自のスキーマ例を設計するのに役立ちます。

## 概要{#overview}

Zilliz Cloudでは、コレクションスキーマはリレーショナルデータベースのテーブルを組み立てるように、Zilliz Cloudがコレクション内のデータをどのように整理するかを定義します。

適切に設計されたスキーマは、データモデルを抽象化し、検索を通じてビジネス目標を達成できるかどうかを決定するため、不可欠です。さらに、コレクションに挿入されるすべてのデータ行はスキーマに従う必要があるため、データの一貫性と長期的な品質を維持するのに役立ちます。技術的な観点から見ると、適切に定義されたスキーマは、適切に整理された列データストレージとよりクリーンなインデックス構造につながり、検索パフォーマンスを向上させます。

コレクションスキーマには、主キー、少なくとも1つのベクトルフィールド、およびいくつかのスカラーフィールドがあります。次の図は、記事をスキーマフィールドのリストにマッピングする方法を示しています。

![RoJFbyTsuoY8mHxoBBicgBH9nTc](https://zdoc-images.s3.us-west-2.amazonaws.com/rojfbytsuoy8mhxobbicgbh9ntc.png "RoJFbyTsuoY8mHxoBBicgBH9nTc")

検索システムのデータモデル設計には、ビジネスニーズを分析し、情報をスキーマで表現されたデータモデルに抽象化することが含まれます。たとえば、テキストの検索は、リテラル文字列を「埋め込み」によってベクトルに変換し、ベクトル検索を可能にすることで「インデックス付け」する必要があります。この基本的な要件を超えて、公開タイムスタンプや著者などの他のプロパティを保存する必要がある場合があります。このメタデータにより、セマンティック検索をフィルタリングによって絞り込み、特定の日付以降に公開されたテキストや特定の著者によるテキストのみを返すことができます。これらのスカラーをメインテキストと一緒に取得して、アプリケーションで検索結果をレンダリングすることもできます。これらのテキストを整理するには、それぞれに一意の識別子を割り当てる必要があり、これは整数または文字列として表現されます。これらの要素は、洗練された検索ロジックを実現するために不可欠です。

適切に設計されたスキーマを作成する方法については、[スキーマ設計の実践](./schema-design-hands-on)を参照してください。

## スキーマの作成{#create-schema}

次のコードスニペットは、スキーマを作成する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

schema = MilvusClient.create_schema()
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.collection.request.CreateCollectionReq;

CreateCollectionReq.CollectionSchema schema = client.createSchema();
```

</TabItem>

<TabItem value='javascript'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const schema = []
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
export schema='{
    "fields": []
}'
```

</TabItem>
</Tabs>

## プライマリフィールドの追加{#add-primary-field}

コレクションのプライマリフィールドは、エンティティを一意に識別します。**Int64**または**VarChar**の値のみを受け入れます。以下のコードスニペットは、プライマリフィールドを追加する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
schema.add_field(
    field_name="my_id",
    datatype=DataType.INT64,
    # highlight-start
    is_primary=True,
    auto_id=False,
    # highlight-end
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.DataType;
import io.milvus.v2.service.collection.request.AddFieldReq; 

schema.addField(AddFieldReq.builder()
        .fieldName("my_id")
        .dataType(DataType.Int64)
        // highlight-start
        .isPrimaryKey(true)
        .autoID(false)
        // highlight-end
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
schema.push({
    name: "my_id",
    data_type: DataType.Int64,
    // highlight-start
    is_primary_key: true,
    autoID: false
    // highlight-end
});
```

</TabItem>

<TabItem value='go'>

```go
schema.WithField(entity.NewField().WithName("my_id").
    WithDataType(entity.FieldTypeInt64).
    // highlight-start
    WithIsPrimaryKey(true).
    WithIsAutoID(false),
    // highlight-end
)
```

</TabItem>

<TabItem value='bash'>

```bash
export primaryField='{
    "fieldName": "my_id",
    "dataType": "Int64",
    "isPrimary": true
}'

export schema='{
    \"autoID\": false,
    \"fields\": [
        $primaryField
    ]
}'
```

</TabItem>
</Tabs>

フィールドを追加する際、`is_primary` プロパティを `True` に設定することで、そのフィールドをプライマリフィールドとして明示的に指定できます。プライマリフィールドはデフォルトで **Int64** 値を受け入れます。この場合、プライマリフィールドの値は `12345` のような整数である必要があります。プライマリフィールドで **VarChar** 値を使用することを選択した場合、値は `my_entity_1234` のような文字列である必要があります。

`autoId` プロパティを `True` に設定すると、データ挿入時に Zilliz Cloud がプライマリフィールドの値を自動的に割り当てることができます。

<Admonition type="info" icon="📘" title="Notes">

<p>手動でプライマリキーを設定することが有益な場合を除き、すべての場合において <code>autoId</code> に依存することをお勧めします。</p>

</Admonition>

詳細については、[Primary Field & AutoId](./primary-field-auto-id) を参照してください。

## ベクトルフィールドの追加{#add-vector-fields}

ベクトルフィールドは、さまざまな疎および密なベクトル埋め込みを受け入れます。Zilliz Cloud では、1つのcollectionに4つのベクトルフィールドを追加できます。以下のコードスニペットは、ベクトルフィールドを追加する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
schema.add_field(
    field_name="my_vector",
    datatype=DataType.FLOAT_VECTOR,
    # highlight-next-line
    dim=5
)
```

</TabItem>

<TabItem value='java'>

```java
schema.addField(AddFieldReq.builder()
        .fieldName("my_vector")
        .dataType(DataType.FloatVector)
        // highlight-next-line
        .dimension(5)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
schema.push({
    name: "my_vector",
    data_type: DataType.FloatVector,
    // highlight-next-line
    dim: 5
});
```

</TabItem>

<TabItem value='go'>

```go
schema.WithField(entity.NewField().WithName("my_vector").
    WithDataType(entity.FieldTypeFloatVector).
    // highlight-next-line
    WithDim(5),
)
```

</TabItem>

<TabItem value='bash'>

```bash
export vectorField='{
    "fieldName": "my_vector",
    "dataType": "FloatVector",
    "elementTypeParams": {
        "dim": 5
    }
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $primaryField,
        $vectorField
    ]
}"
```

</TabItem>
</Tabs>

上記のコードスニペットの `dim` パラメータは、ベクトルフィールドに保持されるベクトル埋め込みの次元を示します。`FLOAT_VECTOR` の値は、ベクトルフィールドが32ビット浮動小数点数のリストを保持することを示し、これらは通常、逆対数を表すために使用されます。これに加えて、Zilliz Cloudは以下の種類のベクトル埋め込みもサポートしています。

- `FLOAT16_VECTOR`

    この型のベクトルフィールドは、16ビット半精度浮動小数点数のリストを保持し、通常、メモリまたは帯域幅が制限されたディープラーニングまたはGPUベースのコンピューティングシナリオに適用されます。

- `BFLOAT16_VECTOR`

    この型のベクトルフィールドは、精度は低下するものの、Float32と同じ指数範囲を持つ16ビット浮動小数点数のリストを保持します。この種類のデータは、精度を大幅に損なうことなくメモリ使用量を削減するため、ディープラーニングシナリオで一般的に使用されます。

- `INT8_VECTOR`

    この型のベクトルフィールドは、8ビット符号付き整数（int8）で構成されるベクトルを格納し、各コンポーネントは-128から127の範囲です。ResNetやEfficientNetなどの量子化されたディープラーニングアーキテクチャ向けに調整されており、モデルサイズを大幅に縮小し、推論速度を向上させます。これらすべては、最小限の精度損失で実現されます。**注**: このベクトル型はHNSWインデックスでのみサポートされています。

- `BINARY_VECTOR`

    この型のベクトルフィールドは、0と1のリストを保持します。これらは、画像処理や情報検索シナリオでデータを表現するためのコンパクトな特徴として機能します。

- `SPARSE_FLOAT_VECTOR`

    この型のベクトルフィールドは、非ゼロの数値とそのシーケンス番号のリストを保持し、スパースベクトル埋め込みを表します。

## スカラーフィールドの追加{#add-scalar-fields}

一般的なケースでは、スカラーフィールドを使用してZilliz Cloudクラスターに保存されているベクトル埋め込みのメタデータを保存し、メタデータフィルタリングを伴うANN検索を実行して検索結果の正確性を向上させることができます。Zilliz Cloudは、**VarChar**、**Boolean**、**Int**、**Float**、**Double**を含む複数のスカラーフィールドタイプをサポートしています。

### 文字列フィールドの追加{#add-string-fields}

Zilliz Cloudクラスターでは、VarCharフィールドを使用して文字列を保存できます。VarCharフィールドの詳細については、[文字列フィールドの使用](./use-string-field)を参照してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
schema.add_field(
    field_name="my_varchar",
    datatype=DataType.VARCHAR,
    # highlight-next-line
    max_length=512
)
```

</TabItem>

<TabItem value='java'>

```java
schema.addField(AddFieldReq.builder()
        .fieldName("my_varchar")
        .dataType(DataType.VarChar)
        // highlight-next-line
        .maxLength(512)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
schema.push({
    name: "my_varchar",
    data_type: DataType.VarChar,
    // highlight-next-line
    max_length: 512
});
```

</TabItem>

<TabItem value='go'>

```go
schema.WithField(entity.NewField().WithName("my_varchar").
    WithDataType(entity.FieldTypeVarChar).
    WithMaxLength(512),
)
```

</TabItem>

<TabItem value='bash'>

```bash
export varCharField='{
    "fieldName": "my_varchar",
    "dataType": "VarChar",
    "elementTypeParams": {
        "max_length": 512
    }
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $primaryField,
        $vectorField,
        $varCharField
    ]
}"
```

</TabItem>
</Tabs>

### 数値フィールドの追加{#add-number-fields}

Zilliz Cloudがサポートする数値の型は、`Int8`、`Int16`、`Int32`、`Int64`、`Float`、`Double`です。数値フィールドの詳細については、[数値フィールドの使用](./use-number-field)を参照してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
schema.add_field(
    field_name="my_int64",
    datatype=DataType.INT64,
)
```

</TabItem>

<TabItem value='java'>

```java
schema.addField(AddFieldReq.builder()
        .fieldName("my_int64")
        .dataType(DataType.Int64)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
schema.push({
    name: "my_int64",
    data_type: DataType.Int64,
});
```

</TabItem>

<TabItem value='go'>

```go
schema.WithField(entity.NewField().WithName("my_int64").
    WithDataType(entity.FieldTypeInt64),
)
```

</TabItem>

<TabItem value='bash'>

```bash
export int64Field='{
    "fieldName": "my_int64",
    "dataType": "Int64"
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $primaryField,
        $vectorField,
        $varCharField,
        $int64Field
    ]
}"
```

</TabItem>
</Tabs>

### ブール型フィールドの追加{#add-boolean-fields}

Zilliz Cloudはブール型フィールドをサポートしています。以下のコードスニペットは、ブール型フィールドを追加する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
schema.add_field(
    field_name="my_bool",
    datatype=DataType.BOOL,
)
```

</TabItem>

<TabItem value='java'>

```java
schema.addField(AddFieldReq.builder()
        .fieldName("my_bool")
        .dataType(DataType.Bool)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
schema.push({
    name: "my_bool",
    data_type: DataType.Boolean,
});
```

</TabItem>

<TabItem value='go'>

```go
schema.WithField(entity.NewField().WithName("my_bool").
    WithDataType(entity.FieldTypeBool),
)
```

</TabItem>

<TabItem value='bash'>

```bash
export boolField='{
    "fieldName": "my_bool",
    "dataType": "Boolean"
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $primaryField,
        $vectorField,
        $varCharField,
        $int64Field,
        $boolField
    ]
}"
```

</TabItem>
</Tabs>

## 複合フィールドの追加{#add-composite-fields}

Milvusでは、複合フィールドは、JSONフィールドのキーやArrayフィールドのインデックスのように、より小さなサブフィールドに分割できるフィールドです。

### JSONフィールドの追加{#add-json-fields}

JSONフィールドは通常、半構造化されたJSONデータを格納します。JSONフィールドの詳細については、[JSONフィールドの使用](./use-json-fields)を参照してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
schema.add_field(
    field_name="my_json",
    datatype=DataType.JSON,
)
```

</TabItem>

<TabItem value='java'>

```java
schema.addField(AddFieldReq.builder()
        .fieldName("my_json")
        .dataType(DataType.JSON)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
schema.push({
    name: "my_json",
    data_type: DataType.JSON,
});
```

</TabItem>

<TabItem value='go'>

```go
schema.WithField(entity.NewField().WithName("my_json").
    WithDataType(entity.FieldTypeJSON),
)
```

</TabItem>

<TabItem value='bash'>

```bash
export jsonField='{
    "fieldName": "my_json",
    "dataType": "JSON"
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $primaryField,
        $vectorField,
        $varCharField,
        $int64Field,
        $boolField,
        $jsonField
    ]
}"
```

</TabItem>
</Tabs>

### 配列フィールドの追加{#add-array-fields}

配列フィールドは要素のリストを格納します。配列フィールド内のすべての要素のデータ型は同じである必要があります。配列フィールドの詳細については、[配列フィールドの使用](./use-array-fields)を参照してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
schema.add_field(
    field_name="my_array",
    datatype=DataType.ARRAY,
    element_type=DataType.VARCHAR,
    max_capacity=5,
    max_length=512,
)
```

</TabItem>

<TabItem value='java'>

```java
schema.addField(AddFieldReq.builder()
        .fieldName("my_array")
        .dataType(DataType.Array)
        .elementType(DataType.VarChar)
        .maxCapacity(5)
        .maxLength(512)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
schema.push({
    name: "my_array",
    data_type: DataType.Array,
    element_type: DataType.VarChar,
    max_capacity: 5,
    max_length: 512
});
```

</TabItem>

<TabItem value='go'>

```go
schema.WithField(entity.NewField().WithName("my_array").
    WithDataType(entity.FieldTypeArray).
    WithElementType(entity.FieldTypeInt64).
    WithMaxLength(512).
    WithMaxCapacity(5),
)
```

</TabItem>

<TabItem value='bash'>

```bash
export arrayField='{
    "fieldName": "my_array",
    "dataType": "Array",
    "elementDataType": "VarChar",
    "elementTypeParams": {
        "max_length": 512
    }
}'

export schema="{
    \"autoID\": false,
    \"fields\": [
        $primaryField,
        $vectorField,
        $varCharField,
        $int64Field,
        $boolField,
        $jsonField,
        $arrayField
    ]
}"
```

</TabItem>
</Tabs>

