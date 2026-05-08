---
title: "スキーマの解説 | BYOC"
slug: /schema-explained
sidebar_key: schema-explained
sidebar_label: "概要"
beta: FALSE
notebook: FALSE
description: "スキーマはコレクションのデータ構造を定義します。コレクションを作成する前に、そのスキーマの設計を行う必要があります。このページでは、コレクションのスキーマを理解し、独自のスキーマの設計例を作成するのに役立ちます。 | BYOC"
type: origin
token: Vs4YwNnvzitoQ8kunlGcWMJInbf
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマの解説

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# スキーマの解説

スキーマは、コレクションのデータ構造を定義します。コレクションを作成する前に、そのスキーマの設計を行う必要があります。このページでは、コレクションのスキーマを理解し、独自のスキーマの設計例を作成する方法を説明します。

## 概要\{#overview}

Zilliz Cloud では、コレクションのスキーマはリレーショナルデータベースのテーブルに相当し、Zilliz Cloud がコレクション内のデータをどのように構成するかを定義します。

よく設計されたスキーマは不可欠です。なぜなら、データモデルを抽象化し、検索を通じてビジネス目標を達成できるかどうかを決定するからです。さらに、コレクションに挿入されるすべてのデータ行はスキーマに従う必要があるため、データの一貫性と長期的な品質の維持に役立ちます。技術的な観点からは、明確に定義されたスキーマにより、列データの保存が適切に整理され、インデックス構造がシンプルになり、検索パフォーマンスが向上します。

コレクションのスキーマには、プライマリキー、少なくとも1つのベクトルフィールド、および複数のスカラーフィールドが含まれます。次の図は、記事をスキーマフィールドのリストにマッピングする方法を示しています。

![RoJFbyTsuoY8mHxoBBicgBH9nTc](https://zdoc-images.s3.us-west-2.amazonaws.com/rojfbytsuoy8mhxobbicgbh9ntc.png "RoJFbyTsuoY8mHxoBBicgBH9nTc")

検索システムのデータモデル設計には、ビジネスニーズの分析と、スキーマで表現されるデータモデルへの情報の抽象化が含まれます。例えば、テキストの検索では、リテラル文字列を「埋め込み（embedding）」によってベクトルに変換し、ベクトル検索を有効にすることで「インデックス化」する必要があります。この必須要件に加えて、公開タイムスタンプや著者などの他のプロパティを保存する必要がある場合もあります。このメタデータにより、フィルタリングを通じてセマンティック検索を絞り込むことができ、特定の日付以降に公開されたテキストや、特定の著者によるテキストのみを返すことができます。また、これらのスカラーをメインテキストとともに取得して、アプリケーションで検索結果を表示することもできます。これらのテキストを整理するために、それぞれに一意の識別子を割り当てる必要があり、これは整数または文字列として表現されます。これらの要素は、高度な検索ロジックを実現するために不可欠です。

よく設計されたスキーマの作成方法については、[スキーマ設計の実践](./schema-design-hands-on) を参照してください。

## スキーマの作成\{#create-schema}

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

<TabItem value='java'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

const schema = []
```

</TabItem>

<TabItem value='java'>

```go
import "github.com/milvus-io/milvus/client/v2/entity"

schema := entity.NewSchema()
```

</TabItem>

<TabItem value='java'>

```bash
export schema='{
    "fields": []
}'
```

</TabItem>
</Tabs>

## 主キーの追加\{#add-primary-field}

コレクション内の主キーは、エンティティを一意に識別します。このフィールドには **Int64** または **VarChar** 値のみを受け付けます。以下のコードスニペットは、主キーを追加する方法を示しています。

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

<TabItem value='java'>

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

<TabItem value='java'>

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

<TabItem value='java'>

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

フィールドを追加する際、`is_primary` プロパティを `True` に設定することで、そのフィールドをプライマリフィールドとして明示的に指定できます。プライマリフィールドはデフォルトで **Int64** 値を受け入れます。この場合、プライマリフィールドの値は `12345` のような整数である必要があります。プライマリフィールドで **VarChar** 値を使用する場合、値は `my_entity_1234` のような文字列である必要があります。

また、`autoId` プロパティを `True` に設定することで、データ挿入時に Zilliz Cloud が自動的にプライマリフィールドの値を割り当てるようにすることもできます。

<Admonition type="info" icon="📘" title="Notes">

<p>手動での主キー設定にメリットがある場合を除き、すべてのケースで <code>autoId</code> の使用を推奨します。</p>

</Admonition>

詳細については、[プライマリフィールドと AutoId](./primary-field-auto-id) を参照してください。

## ベクトルフィールドの追加\{#add-vector-fields}

ベクトルフィールドは、さまざまなスパースおよびデンスベクトル埋め込みを受け入れます。Zilliz Cloud では、コレクションに4つのベクトルフィールドを追加できます。以下のコードスニペットは、ベクトルフィールドを追加する方法を示しています。

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

<TabItem value='java'>

```javascript
schema.push({
    name: "my_vector",
    data_type: DataType.FloatVector,
    // highlight-next-line
    dim: 5
});
```

</TabItem>

<TabItem value='java'>

```go
schema.WithField(entity.NewField().WithName("my_vector").
    WithDataType(entity.FieldTypeFloatVector).
    // highlight-next-line
    WithDim(5),
)
```

</TabItem>

<TabItem value='java'>

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

上記のコードスニペットにおける `dim` パラメータは、ベクターフィールドに格納されるベクトル埋め込みの次元数を示します。`FLOAT_VECTOR` の値は、ベクターフィールドが32ビット浮動小数点数のリストを保持することを示しており、これは通常対数を表現するために使用されます。加えて、Zilliz Cloud は以下のタイプのベクトル埋め込みもサポートしています：

- `FLOAT16_VECTOR`

    このタイプのベクターフィールドは、16ビット半精度浮動小数点数のリストを保持し、通常、メモリや帯域幅が制限されたディープラーニングやGPUベースのコンピューティングシナリオに適用されます。

- `BFLOAT16_VECTOR`

    このタイプのベクターフィールドは、精度は低下しているがFloat32と同じ指数範囲を持つ16ビット浮動小数点数のリストを保持します。このタイプのデータは、精度に大きな影響を与えることなくメモリ使用量を削減できるため、ディープラーニングシナリオで一般的に使用されます。

- `INT8_VECTOR`

    このタイプのベクターフィールドは、8ビット符号付き整数（int8）で構成されたベクトルを格納し、各成分の範囲は –128 から 127 です。ResNet や EfficientNet などの量子化されたディープラーニングアーキテクチャ向けに設計されており、モデルサイズを大幅に縮小し、推論速度を向上させながら、わずかな精度損失のみで済みます。**注**: このベクトルタイプは HNSW インデックスでのみサポートされています。

- `BINARY_VECTOR`

    このタイプのベクターフィールドは、0 と 1 のリストを保持します。これらは、画像処理や情報検索シナリオにおいてデータを表現するためのコンパクトな特徴量として機能します。

- `SPARSE_FLOAT_VECTOR`

    このタイプのベクターフィールドは、非ゼロの数値とそのシーケンス番号のリストを保持し、スパースベクトル埋め込みを表現します。

## スカラーフィールドの追加\{#add-scalar-fields}

一般的なケースでは、スカラーフィールドを使用して Zilliz Cloud クラスタに格納されたベクトル埋め込みのメタデータを保存し、メタデータフィルタリングを伴う ANN 検索を実行して、検索結果の正確性を向上させることができます。Zilliz Cloud は、**VarChar**、**Boolean**、**Int**、**Float**、**Double** を含む複数のスカラーフィールドタイプをサポートしています。

### 文字列フィールドの追加\{#add-string-fields}

Zilliz Cloud クラスタでは、VarChar フィールドを使用して文字列を格納できます。VarChar フィールドの詳細については、[文字列フィールド](./use-string-field) を参照してください。

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

<TabItem value='java'>

```javascript
schema.push({
    name: "my_varchar",
    data_type: DataType.VarChar,
    // highlight-next-line
    max_length: 512
});
```

</TabItem>

<TabItem value='java'>

```go
schema.WithField(entity.NewField().WithName("my_varchar").
    WithDataType(entity.FieldTypeVarChar).
    WithMaxLength(512),
)
```

</TabItem>

<TabItem value='java'>

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

### 数値フィールドの追加\{#add-number-fields}

Zilliz Cloud がサポートする数値型は、`Int8`、`Int16`、`Int32`、`Int64`、`Float`、`Double` です。数値フィールドの詳細については、[数値フィールド](./use-number-field) を参照してください。

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

<TabItem value='java'>

```javascript
schema.push({
    name: "my_int64",
    data_type: DataType.Int64,
});
```

</TabItem>

<TabItem value='java'>

```go
schema.WithField(entity.NewField().WithName("my_int64").
    WithDataType(entity.FieldTypeInt64),
)
```

</TabItem>

<TabItem value='java'>

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

### Booleanフィールドの追加\{#add-boolean-fields}

Zilliz Cloudはbooleanフィールドをサポートしています。以下のコードスニペットは、booleanフィールドを追加する方法を示しています。

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

<TabItem value='java'>

```javascript
schema.push({
    name: "my_bool",
    data_type: DataType.Boolean,
});
```

</TabItem>

<TabItem value='java'>

```go
schema.WithField(entity.NewField().WithName("my_bool").
    WithDataType(entity.FieldTypeBool),
)
```

</TabItem>

<TabItem value='java'>

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

## 複合フィールドの追加\{#add-composite-fields}

Milvus では、複合フィールドとは、JSON フィールド内のキーや配列フィールド内のインデックスなど、より小さなサブフィールドに分割できるフィールドを指します。

### JSON フィールドの追加\{#add-json-fields}

JSON フィールドは通常、半構造化の JSON データを格納します。JSON フィールドの詳細については、[JSON フィールド](./use-json-fields) を参照してください。

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

<TabItem value='java'>

```javascript
schema.push({
    name: "my_json",
    data_type: DataType.JSON,
});
```

</TabItem>

<TabItem value='java'>

```go
schema.WithField(entity.NewField().WithName("my_json").
    WithDataType(entity.FieldTypeJSON),
)
```

</TabItem>

<TabItem value='java'>

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

### 配列フィールドの追加\{#add-array-fields}

配列フィールドは要素のリストを格納します。配列フィールド内のすべての要素のデータ型は同じである必要があります。配列フィールドの詳細については、[配列フィールド](./use-array-fields) を参照してください。

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

<TabItem value='java'>

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

<TabItem value='java'>

```go
schema.WithField(entity.NewField().WithName("my_array").
    WithDataType(entity.FieldTypeArray).
    WithElementType(entity.FieldTypeInt64).
    WithMaxLength(512).
    WithMaxCapacity(5),
)
```

</TabItem>

<TabItem value='java'>

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

