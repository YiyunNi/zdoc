---
title: "アナライザーの概要 | BYOC"
slug: /analyzer-overview
sidebar_label: "概要"
beta: FALSE
notebook: FALSE
description: "テキスト処理において、アナライザーは生のテキストを構造化された検索可能な形式に変換する重要なコンポーネントです。各アナライザーは通常、トークナイザーとフィルターという2つの主要な要素で構成されています。これらが連携して入力テキストをトークンに変換し、これらのトークンを洗練させ、効率的なインデックス作成と検索のために準備します。 | BYOC"
type: origin
token: H8MVwnjdgihp0hkRHHKcjBe9n5e
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - アナライザーとは
  - 類似性検索
  - マルチモーダルRAG
  - llmの幻覚
  - ハイブリッド検索

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# アナライザーの概要

テキスト処理において、**アナライザー**は、生のテキストを構造化された検索可能な形式に変換する上で重要なコンポーネントです。各アナライザーは通常、**トークナイザー**と**フィルター**という2つのコア要素で構成されています。これらが連携して、入力テキストをトークンに変換し、これらのトークンを洗練し、効率的なインデックス作成と取得のために準備します。

Zilliz Cloudでは、アナライザーは、`VARCHAR`フィールドをコレクションスキーマに追加する際に、コレクション作成時に設定されます。アナライザーによって生成されたトークンは、キーワードマッチングのためのインデックスを構築したり、フルテキスト検索のためのスパース埋め込みに変換したりするために使用できます。詳細については、[フルテキスト検索](./full-text-search)または[テキストマッチ](./text-match)を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>アナライザーの使用はパフォーマンスに影響を与える可能性があります。</p>
<ul>
<li><p><strong>フルテキスト検索：</strong>フルテキスト検索の場合、<strong>DataNode</strong>と<strong>QueryNode</strong>チャネルは、トークン化が完了するのを待つ必要があるため、データの消費が遅くなります。その結果、新しく取り込まれたデータが検索可能になるまでに時間がかかります。</p></li>
<li><p><strong>キーワードマッチ：</strong>キーワードマッチングの場合、インデックス作成も遅くなります。これは、インデックスを構築する前にトークン化を完了する必要があるためです。</p></li>
</ul>

</Admonition>

## アナライザーの構成要素{#anatomy-of-an-analyzer}

Zilliz Cloudのアナライザーは、正確に1つの**トークナイザー**と**0個以上の**フィルターで構成されています。

- **トークナイザー**: トークナイザーは、入力テキストをトークンと呼ばれる個別の単位に分割します。これらのトークンは、トークナイザーの種類に応じて、単語またはフレーズになります。

- **フィルター**: フィルターは、トークンをさらに洗練するために適用できます。たとえば、小文字に変換したり、一般的な単語を削除したりします。

<Admonition type="info" icon="📘" title="Notes">

<p>トークナイザーはUTF-8形式のみをサポートしています。他の形式のサポートは今後のリリースで追加される予定です。</p>

</Admonition>

以下のワークフローは、アナライザーがテキストを処理する方法を示しています。

![Ke6jw8437hjR8hbZCvEcQtIIn1e](https://zdoc-images.s3.us-west-2.amazonaws.com/Ke6jw8437hjR8hbZCvEcQtIIn1e.png)

## アナライザーの種類{#analyzer-types}

Zilliz Cloudは、さまざまなテキスト処理のニーズを満たすために、2種類のアナライザーを提供しています。

- **組み込みアナライザー**: これらは、一般的なテキスト処理タスクを最小限の設定でカバーする事前定義された構成です。組み込みアナライザーは、複雑な設定を必要としないため、汎用検索に最適です。

- **カスタムアナライザー**: より高度な要件の場合、カスタムアナライザーを使用すると、トークナイザーと0個以上のフィルターの両方を指定して独自の構成を定義できます。このレベルのカスタマイズは、テキスト処理を正確に制御する必要がある特殊なユースケースで特に役立ちます。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>コレクション作成時にアナライザーの設定を省略した場合、Zilliz Cloudはデフォルトですべてのテキスト処理に<code>standard</code>アナライザーを使用します。詳細については、<a href="./standard-analyzer">Standard</a>を参照してください。</p></li>
<li><p>最適な検索およびクエリパフォーマンスを得るには、テキストデータの言語に一致するアナライザーを選択してください。たとえば、<code>standard</code>アナライザーは汎用性がありますが、中国語、日本語、韓国語などの独自の文法構造を持つ言語には最適ではない場合があります。そのような場合は、<a href="./chinese-analyzer"><code>chinese</code></a>のような言語固有のアナライザーや、特殊なトークナイザー（<a href="./lindera-tokenizer"><code>lindera</code></a>、<a href="./icu-tokenizer"><code>icu</code></a>など）とフィルターを備えたカスタムアナライザーを使用することを強くお勧めします。これにより、正確なトークン化とより良い検索結果が保証されます。</p></li>
</ul>

</Admonition>

### 組み込みアナライザー{#built-in-analyzer}

Zilliz Cloudクラスターの組み込みアナライザーは、特定のトークナイザーとフィルターで事前に構成されており、これらのコンポーネントを自分で定義することなくすぐに使用できます。各組み込みアナライザーは、プリセットのトークナイザーとフィルター、およびカスタマイズ用のオプションパラメーターを含むテンプレートとして機能します。

たとえば、`standard`組み込みアナライザーを使用するには、その名前`standard`を`type`として指定し、オプションで`stop_words`など、このアナライザータイプに固有の追加設定を含めます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "type": "standard", # Uses the standard built-in analyzer
    "stop_words": ["a", "an", "for"] # Defines a list of common words (stop words) to exclude from tokenization
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("type", "standard");
analyzerParams.put("stop_words", Arrays.asList("a", "an", "for"));
```

</TabItem>

<TabItem value='javascript'>

```javascript
const analyzer_params = {
    "type": "standard", // Uses the standard built-in analyzer
    "stop_words": ["a", "an", "for"] // Defines a list of common words (stop words) to exclude from tokenization
};
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams := map[string]any{"type": "standard", "stop_words": []string{"a", "an", "for"}}
```

</TabItem>

<TabItem value='bash'>

```bash
export analyzerParams='{
       "type": "standard",
       "stop_words": ["a", "an", "for"]
    }'
```

</TabItem>
</Tabs>

アナライザーの実行結果を確認するには、`run_analyzer` メソッドを使用します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Sample text to analyze
text = "An efficient system relies on a robust analyzer to correctly process text for various applications."

# Run analyzer
result = client.run_analyzer(
    text,
    analyzer_params
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.RunAnalyzerReq;
import io.milvus.v2.service.vector.response.RunAnalyzerResp;

List<String> texts = new ArrayList<>();
texts.add("An efficient system relies on a robust analyzer to correctly process text for various applications.");

RunAnalyzerResp resp = client.runAnalyzer(RunAnalyzerReq.builder()
        .texts(texts)
        .analyzerParams(analyzerParams)
        .build());
List<RunAnalyzerResp.AnalyzerResult> results = resp.getResults();
```

</TabItem>

<TabItem value='javascript'>

```javascript
// javascrip# Sample text to analyze
const text = "An efficient system relies on a robust analyzer to correctly process text for various applications."

// Run analyzer
const result = await client.run_analyzer({
    text,
    analyzer_params
});
```

</TabItem>

<TabItem value='go'>

```go
import (
    "context"
    "encoding/json"
    "fmt"

    "github.com/milvus-io/milvus/client/v2/milvusclient"
)

bs, _ := json.Marshal(analyzerParams)
texts := []string{"An efficient system relies on a robust analyzer to correctly process text for various applications."}
option := milvusclient.NewRunAnalyzerOption(texts).
    WithAnalyzerParams(string(bs))

result, err := client.RunAnalyzer(ctx, option)
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
export MILVUS_HOST="YOUR_CLUSTER_ENDPOINT"
export TEXT_TO_ANALYZE="An efficient system relies on a robust analyzer to correctly process text for various applications."
curl -X POST "http://${MILVUS_HOST}/v2/vectordb/common/run_analyzer" \
  -H "Content-Type: application/json" \
  -d '{
    "text": ["'"${TEXT_TO_ANALYZE}"'"],
    "analyzerParams": "{\"type\":\"standard\",\"stop_words\":[\"a\",\"an\",\"for\"]}"
  }'
```

</TabItem>
</Tabs>

出力は次のとおりです。

```plaintext
['efficient', 'system', 'relies', 'on', 'robust', 'analyzer', 'to', 'correctly', 'process', 'text', 'various', 'applications']
```

これは、アナライザーがストップワードである「a」、「an」、「for」を除外することで入力テキストを適切にトークン化し、残りの意味のあるトークンを返すことを示しています。

上記の `standard` 組み込みアナライザーの設定は、次のパラメーターを持つ[カスタムアナライザー](./analyzer-overview#custom-analyzer)をセットアップすることと同じです。ここでは、同様の機能を実現するために `tokenizer` および `filter` オプションが明示的に定義されています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "stop",
            "stop_words": ["a", "an", "for"]
        }
    ]
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "standard");
analyzerParams.put("filter",
        Arrays.asList("lowercase",
                new HashMap<String, Object>() {{
                    put("type", "stop");
                    put("stop_words", Arrays.asList("a", "an", "for"));
                }}));
```

</TabItem>

<TabItem value='javascript'>

```javascript
const analyzer_params = {
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "stop",
            "stop_words": ["a", "an", "for"]
        }
    ]
};
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams = map[string]any{"tokenizer": "standard",
    "filter": []any{"lowercase", map[string]any{
        "type":       "stop",
        "stop_words": []string{"a", "an", "for"},
    }}}
```

</TabItem>

<TabItem value='bash'>

```bash
export analyzerParams='{
       "type": "standard",
       "filter":  [
       "lowercase",
       {
            "type": "stop",
            "stop_words": ["a", "an", "for"]
       }
   ]
}'
```

</TabItem>
</Tabs>

Zilliz Cloud は、特定のテキスト処理ニーズに合わせて設計された以下の組み込みアナライザーを提供します。

- `standard`: 標準的なトークン化と小文字フィルタリングを適用する、汎用テキスト処理に適しています。

- `english`: 英語のストップワードをサポートし、英語のテキスト用に最適化されています。

- `chinese`: 中国語の言語構造に適応したトークン化を含め、中国語のテキスト処理に特化しています。

### カスタムアナライザー{#custom-analyzer}

より高度なテキスト処理のために、Zilliz Cloud のカスタムアナライザーを使用すると、**トークナイザー**と**フィルター**の両方を指定して、カスタマイズされたテキスト処理パイプラインを構築できます。この設定は、正確な制御が必要な特殊なユースケースに最適です。

#### トークナイザー{#tokenizer}

**トークナイザー**は、カスタムアナライザーの**必須**コンポーネントであり、入力テキストを個別の単位または**トークン**に分割することでアナライザーパイプラインを開始します。トークン化は、トークナイザーの種類に応じて、空白や句読点による分割など、特定のルールに従います。このプロセスにより、各単語やフレーズをより正確かつ独立して処理できます。

たとえば、トークナイザーはテキスト`"Vector Database Built for Scale"`を個別のトークンに変換します。

```plaintext
["Vector", "Database", "Built", "for", "Scale"]
```

**トークナイザーの指定例**:

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "whitespace",
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "whitespace");
```

</TabItem>

<TabItem value='javascript'>

```javascript
const analyzer_params = {
    "tokenizer": "whitespace",
};
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams = map[string]any{"tokenizer": "whitespace"}
```

</TabItem>

<TabItem value='bash'>

```bash
export analyzerParams='{
       "type": "whitespace"
    }'
```

</TabItem>
</Tabs>

#### フィルター{#filter}

**フィルター**は、トークナイザーによって生成されたトークンに対して機能する**オプション**のコンポーネントであり、必要に応じてそれらを変換または洗練します。たとえば、トークン化された用語 `["Vector", "Database", "Built", "for", "Scale"]` に `lowercase` フィルターを適用すると、結果は次のようになります。

```sql
["vector", "database", "built", "for", "scale"]
```

カスタムアナライザーのフィルターは、設定の必要性に応じて、**組み込み**または**カスタム**のいずれかになります。

- **組み込みフィルター**: Zilliz Cloudによって事前設定されており、最小限のセットアップで済みます。これらのフィルターは、名前を指定するだけでそのまま使用できます。以下のフィルターは、直接使用できる組み込みフィルターです。

    - `lowercase`: テキストを小文字に変換し、大文字と小文字を区別しないマッチングを保証します。詳細については、[Lowercase](./lowercase-filter)を参照してください。

    - `asciifolding`: 非ASCII文字をASCII文字に変換し、多言語テキストの処理を簡素化します。詳細については、[ASCII folding](./ascii-folding-filter)を参照してください。

    - `alphanumonly`: 英数字以外の文字を削除して、英数字のみを保持します。詳細については、[Alphanumonly](./alphanumonly-filter)を参照してください。

    - `cnalphanumonly`: 中国語、英字、または数字以外の文字を含むトークンを削除します。詳細については、[Cnalphanumonly](./cnalphanumonly-filter)を参照してください。

    - `cncharonly`: 中国語以外の文字を含むトークンを削除します。詳細については、[Cncharonly](./cncharonly-filter)を参照してください。

    **組み込みフィルターの使用例:**

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    analyzer_params = {
        "tokenizer": "standard", # Mandatory: Specifies tokenizer
        "filter": ["lowercase"], # Optional: Built-in filter that converts text to lowercase
    }
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    Map<String, Object> analyzerParams = new HashMap<>();
    analyzerParams.put("tokenizer", "standard");
    analyzerParams.put("filter", Collections.singletonList("lowercase"));
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    const analyzer_params = {
        "tokenizer": "standard", // Mandatory: Specifies tokenizer
        "filter": ["lowercase"], // Optional: Built-in filter that converts text to lowercase
    }
    ```

    </TabItem>

    <TabItem value='go'>

    ```go
    analyzerParams = map[string]any{"tokenizer": "standard",
            "filter": []any{"lowercase"}}
    ```

    </TabItem>

    <TabItem value='bash'>

    ```bash
    export analyzerParams='{
           "type": "standard",
           "filter":  ["lowercase"]
        }'
    ```

    </TabItem>
    </Tabs>

- **カスタムフィルター**: カスタムフィルターを使用すると、特殊な設定が可能です。有効なフィルタータイプ (`filter.type`) を選択し、各フィルタータイプに固有の設定を追加することで、カスタムフィルターを定義できます。カスタマイズをサポートするフィルタータイプの例を次に示します。

    - `stop`: ストップワードのリストを設定することで、指定された一般的な単語を削除します (例: `"stop_words": ["of", "to"]`)。詳細については、[Stop](./stop-filter) を参照してください。

    - `length`: 最大トークン長を設定するなど、長さの基準に基づいてトークンを除外します。詳細については、[Length](./length-filter) を参照してください。

    - `stemmer`: 単語を語根形式に還元し、より柔軟なマッチングを可能にします。詳細については、[Stemmer](./stemmer-filter) を参照してください。

    **カスタムフィルターの設定例:**

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    analyzer_params = {
        "tokenizer": "standard", # Mandatory: Specifies tokenizer
        "filter": [
            {
                "type": "stop", # Specifies 'stop' as the filter type
                "stop_words": ["of", "to"], # Customizes stop words for this filter type
            }
        ]
    }
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    Map<String, Object> analyzerParams = new HashMap<>();
    analyzerParams.put("tokenizer", "standard");
    analyzerParams.put("filter",
            Collections.singletonList(new HashMap<String, Object>() {{
                put("type", "stop");
                put("stop_words", Arrays.asList("a", "an", "for"));
            }}));
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    const analyzer_params = {
        "tokenizer": "standard", // Mandatory: Specifies tokenizer
        "filter": [
            {
                "type": "stop", // Specifies 'stop' as the filter type
                "stop_words": ["of", "to"], // Customizes stop words for this filter type
            }
        ]
    };
    ```

    </TabItem>

    <TabItem value='go'>

    ```go
    analyzerParams = map[string]any{"tokenizer": "standard",
        "filter": []any{map[string]any{
            "type":       "stop",
            "stop_words": []string{"of", "to"},
        }}}
    ```

    </TabItem>

    <TabItem value='bash'>

    ```bash
    export analyzerParams='{
           "type": "standard",
           "filter":  [
           {
                "type": "stop",
                "stop_words": ["a", "an", "for"]
           }
        ]
    }'
    ```

    </TabItem>
    </Tabs>

```java
nlohmann::json analyzer_params = {
    {"type", "standard"},
    {"filter", {{{"type", "stop"}, {"stop_words", {"a", "an", "for"}}}}},
};
```

## 使用例{#example-use}

この例では、以下を含むコレクションスキーマを作成します。

- 埋め込み用のベクトルフィールド。

- テキスト処理用の2つの`VARCHAR`フィールド：

    - 1つのフィールドは組み込みアナライザーを使用します。

    - もう1つのフィールドはカスタムアナライザーを使用します。

これらの設定をコレクションに組み込む前に、`run_analyzer`メソッドを使用して各アナライザーを検証します。

### ステップ1：MilvusClientを初期化し、スキーマを作成する{#step-1-initialize-milvusclient-and-create-schema}

まず、Milvusクライアントをセットアップし、新しいスキーマを作成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

# Set up a Milvus client
client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT"，
    token="YOUR_CLUSTER_TOKEN"
)

# Create a new schema
schema = client.create_schema(auto_id=True, enable_dynamic_field=False)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

// Set up a Milvus client
ConnectConfig config = ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build();
MilvusClientV2 client = new MilvusClientV2(config);

// Create schema
CreateCollectionReq.CollectionSchema schema = CreateCollectionReq.CollectionSchema.builder()
        .enableDynamicField(false)
        .build();
```

</TabItem>

<TabItem value='javascript'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

// Set up a Milvus client
const client = new MilvusClient({
    address: "YOUR_CLUSTER_ENDPOINT",
    token: "YOUR_CLUSTER_TOKEN"
);
```

</TabItem>

<TabItem value='go'>

```go
import (
    "context"
    "fmt"

    "github.com/milvus-io/milvus/client/v2/column"
    "github.com/milvus-io/milvus/client/v2/entity"
    "github.com/milvus-io/milvus/client/v2/index"
    "github.com/milvus-io/milvus/client/v2/milvusclient"
)  

ctx, cancel := context.WithCancel(context.Background())
defer cancel()

cli, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: "YOUR_CLUSTER_ENDPOINT",
    token: "YOUR_CLUSTER_TOKEN"
})
if err != nil {
    fmt.Println(err.Error())
    // handle err
}
defer client.Close(ctx)

schema := entity.NewSchema().WithAutoID(true).WithDynamicFieldEnabled(false)
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
export MILVUS_HOST="YOUR_CLUSTER_ENDPOINT"
export MILVUS_TOKEN="YOUR_CLUSTER_TOKEN"
curl -X POST "http://${MILVUS_HOST}/v2/vectordb/collections/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MILVUS_TOKEN}" \
  -d '{
    "collectionName": "my_collection",
    "dimension": 768,
    "schema": {
      "autoId": true,
      "enableDynamicField": false
    }
  }'
```

</TabItem>
</Tabs>

### ステップ2: アナライザー設定の定義と検証{#step-2-define-and-verify-analyzer-configurations}

1. **組み込みアナライザー（`english`）の設定と検証:**

    - **設定:** 組み込みの英語アナライザーのパラメーターを定義します。

    - **検証:** `run_analyzer` を使用して、設定が期待されるトークン化を生成するかどうかを確認します。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    # Built-in analyzer configuration for English text processing
    analyzer_params_built_in = {
        "type": "english"
    }
    # Verify built-in analyzer configuration
    sample_text = "Milvus simplifies text analysis for search."
    result = client.run_analyzer(sample_text, analyzer_params_built_in)
    print("Built-in analyzer output:", result)
    
    # Expected output:
    # Built-in analyzer output: ['milvus', 'simplifi', 'text', 'analysi', 'search']
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    Map<String, Object> analyzerParamsBuiltin = new HashMap<>();
    analyzerParamsBuiltin.put("type", "english");
    
    List<String> texts = new ArrayList<>();
    texts.add("Milvus simplifies text analysis for search.");
    
    RunAnalyzerResp resp = client.runAnalyzer(RunAnalyzerReq.builder()
            .texts(texts)
            .analyzerParams(analyzerParamsBuiltin)
            .build());
    List<RunAnalyzerResp.AnalyzerResult> results = resp.getResults();
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    // Use a built-in analyzer for VARCHAR field `title_en`
    const analyzer_params_built_in = {
      type: "english",
    };
    
    const sample_text = "Milvus simplifies text analysis for search.";
    const result = await client.run_analyzer({
        text: sample_text, 
        analyzer_params: analyzer_params_built_in
    });
    ```

    </TabItem>

    <TabItem value='go'>

    ```go
    analyzerParamsBuiltin := map[string]any{"type": "english"}
    
    bs, _ := json.Marshal(analyzerParamsBuiltin)
    texts := []string{"Milvus simplifies text analysis for search."}
    option := milvusclient.NewRunAnalyzerOption(texts).
        WithAnalyzerParams(string(bs))
    
    result, err := client.RunAnalyzer(ctx, option)
    if err != nil {
        fmt.Println(err.Error())
        // handle error
    }
    ```

    </TabItem>

    <TabItem value='bash'>

    ```bash
    # restful
    export MILVUS_HOST="YOUR_CLUSTER_ENDPOINT"
    export SAMPLE_TEXT="Milvus simplifies text analysis for search."
    curl -X POST "http://${MILVUS_HOST}/v2/vectordb/common/run_analyzer" \
      -H "Content-Type: application/json" \
      -d '{
        "text": ["'"${SAMPLE_TEXT}"'"],
        "analyzerParams": "{\"type\":\"english\"}"
      }'
    ```

    </TabItem>
    </Tabs>

1. **カスタムアナライザーの設定と検証:**

    - **設定:** 標準のトークナイザーと、組み込みの小文字フィルター、トークン長およびストップワード用のカスタムフィルターを使用するカスタムアナライザーを定義します。

    - **検証:** `run_analyzer` を使用して、カスタム設定が意図したとおりにテキストを処理することを確認します。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    # Custom analyzer configuration with a standard tokenizer and custom filters
    analyzer_params_custom = {
        "tokenizer": "standard",
        "filter": [
            "lowercase",  # Built-in filter: convert tokens to lowercase
            {
                "type": "length",  # Custom filter: restrict token length
                "max": 40
            },
            {
                "type": "stop",  # Custom filter: remove specified stop words
                "stop_words": ["of", "for"]
            }
        ]
    }
    
    # Verify custom analyzer configuration
    sample_text = "Milvus provides flexible, customizable analyzers for robust text processing."
    result = client.run_analyzer(sample_text, analyzer_params_custom)
    print("Custom analyzer output:", result)
    
    # Expected output:
    # Custom analyzer output: ['milvus', 'provides', 'flexible', 'customizable', 'analyzers', 'robust', 'text', 'processing']
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    // Configure a custom analyzer
    Map<String, Object> analyzerParamsCustom = new HashMap<>();
    analyzerParamsCustom.put("tokenizer", "standard");
    analyzerParamsCustom.put("filter",
            Arrays.asList("lowercase",
                    new HashMap<String, Object>() {{
                        put("type", "length");
                        put("max", 40);
                    }},
                    new HashMap<String, Object>() {{
                        put("type", "stop");
                        put("stop_words", Arrays.asList("of", "for"));
                    }}
            )
    );
    
    List<String> texts = new ArrayList<>();
    texts.add("Milvus provides flexible, customizable analyzers for robust text processing.");
    
    RunAnalyzerResp resp = client.runAnalyzer(RunAnalyzerReq.builder()
            .texts(texts)
            .analyzerParams(analyzerParamsCustom)
            .build());
    List<RunAnalyzerResp.AnalyzerResult> results = resp.getResults();
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    // Configure a custom analyzer for VARCHAR field `title`
    const analyzer_params_custom = {
      tokenizer: "standard",
      filter: [
        "lowercase",
        {
          type: "length",
          max: 40,
        },
        {
          type: "stop",
          stop_words: ["of", "to"],
        },
      ],
    };
    const sample_text = "Milvus provides flexible, customizable analyzers for robust text processing.";
    const result = await client.run_analyzer({
        text: sample_text, 
        analyzer_params: analyzer_params_custom
    });
    ```

    </TabItem>

    <TabItem value='go'>

    ```go
    analyzerParamsCustom = map[string]any{"tokenizer": "standard",
        "filter": []any{"lowercase", 
        map[string]any{
            "type": "length",
            "max":  40,
        map[string]any{
            "type": "stop",
            "stop_words": []string{"of", "to"},
        }}}
        
    bs, _ := json.Marshal(analyzerParamsCustom)
    texts := []string{"Milvus provides flexible, customizable analyzers for robust text processing."}
    option := milvusclient.NewRunAnalyzerOption(texts).
        WithAnalyzerParams(string(bs))
    
    result, err := client.RunAnalyzer(ctx, option)
    if err != nil {
        fmt.Println(err.Error())
        // handle error
    }
    ```

    </TabItem>

    <TabItem value='bash'>

    ```bash
    # curl
    export MILVUS_HOST="YOUR_CLUSTER_ENDPOINT"
    export SAMPLE_TEXT="Milvus provides flexible, customizable analyzers for robust text processing."
    
    # 使用自定义分析器配置
    curl -X POST "http://${MILVUS_HOST}/v2/vectordb/common/run_analyzer" \
      -H "Content-Type: application/json" \
      -d '{
        "text": ["'"${SAMPLE_TEXT}"'"],
        "analyzerParams": "{\"tokenizer\":\"standard\",\"filter\":[\"lowercase\",{\"type\":\"length\",\"max\":40},{\"type\":\"stop\",\"stop_words\":[\"of\",\"for\"]}]}"
      }'
    ```

    </TabItem>
    </Tabs>

### ステップ3：スキーマフィールドにアナライザーを追加する{#step-3-add-analyzer-to-schema-field}

アナライザーの設定を確認したら、スキーマフィールドに追加します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Add VARCHAR field 'title_en' using the built-in analyzer configuration
schema.add_field(
    field_name='title_en',
    datatype=DataType.VARCHAR,
    max_length=1000,
    enable_analyzer=True,
    analyzer_params=analyzer_params_built_in,
    enable_match=True,
)

# Add VARCHAR field 'title' using the custom analyzer configuration
schema.add_field(
    field_name='title',
    datatype=DataType.VARCHAR,
    max_length=1000,
    enable_analyzer=True,
    analyzer_params=analyzer_params_custom,
    enable_match=True,
)

# Add a vector field for embeddings
schema.add_field(field_name="embedding", datatype=DataType.FLOAT_VECTOR, dim=3)

# Add a primary key field
schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
```

</TabItem>

<TabItem value='java'>

```java
schema.addField(AddFieldReq.builder()
        .fieldName("title_en")
        .dataType(DataType.VarChar)
        .maxLength(1000)
        .enableAnalyzer(true)
        .analyzerParams(analyzerParamsBuiltin)
        .enableMatch(true) // must enable this if you use TextMatch
        .build());

schema.addField(AddFieldReq.builder()
        .fieldName("title")
        .dataType(DataType.VarChar)
        .maxLength(1000)
        .enableAnalyzer(true)
        .analyzerParams(analyzerParamsCustom)
        .enableMatch(true) // must enable this if you use TextMatch
        .build());
        
// Add vector field
schema.addField(AddFieldReq.builder()
        .fieldName("embedding")
        .dataType(DataType.FloatVector)
        .dimension(3)
        .build());
// Add primary field
schema.addField(AddFieldReq.builder()
        .fieldName("id")
        .dataType(DataType.Int64)
        .isPrimaryKey(true)
        .autoID(true)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
// Create schema
const schema = {
  auto_id: true,
  fields: [
    {
      name: "id",
      type: DataType.INT64,
      is_primary: true,
    },
    {
      name: "title_en",
      data_type: DataType.VARCHAR,
      max_length: 1000,
      enable_analyzer: true,
      analyzer_params: analyzerParamsBuiltIn,
      enable_match: true,
    },
    {
      name: "title",
      data_type: DataType.VARCHAR,
      max_length: 1000,
      enable_analyzer: true,
      analyzer_params: analyzerParamsCustom,
      enable_match: true,
    },
    {
      name: "embedding",
      data_type: DataType.FLOAT_VECTOR,
      dim: 4,
    },
  ],
};
```

</TabItem>

<TabItem value='go'>

```go
schema.WithField(entity.NewField().
    WithName("id").
    WithDataType(entity.FieldTypeInt64).
    WithIsPrimaryKey(true).
    WithIsAutoID(true),
).WithField(entity.NewField().
    WithName("embedding").
    WithDataType(entity.FieldTypeFloatVector).
    WithDim(3),
).WithField(entity.NewField().
    WithName("title_en").
    WithDataType(entity.FieldTypeVarChar).
    WithMaxLength(1000).
    WithEnableAnalyzer(true).
    WithAnalyzerParams(analyzerParamsBuiltin).
    WithEnableMatch(true),
).WithField(entity.NewField().
    WithName("title").
    WithDataType(entity.FieldTypeVarChar).
    WithMaxLength(1000).
    WithEnableAnalyzer(true).
    WithAnalyzerParams(analyzerParamsCustom).
    WithEnableMatch(true),
)
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
export SCHEMA_CONFIG='{
  "autoId": false,
  "enableDynamicField": false,
  "fields": [
    {
      "fieldName": "id",
      "dataType": "Int64",
      "isPrimary": true
    },
    {
      "fieldName": "title_en",
      "dataType": "VarChar",
      "elementTypeParams": {
        "max_length": "1000",
        "enable_analyzer": true,
        "analyzer_params": "{\"type\":\"english\"}",
        "enable_match": true
      }
    },
    {
      "fieldName": "title",
      "dataType": "VarChar",
      "elementTypeParams": {
        "max_length": "1000",
        "enable_analyzer": true,
        "analyzer_params": "{\"tokenizer\":\"standard\",\"filter\":[\"lowercase\",{\"type\":\"length\",\"max\":40},{\"type\":\"stop\",\"stop_words\":[\"of\",\"for\"]}]}",
        "enable_match": true
      }
    },
    {
      "fieldName": "embedding",
      "dataType": "FloatVector",
      "elementTypeParams": {
        "dim": "3"
      }
    }
  ]
}'

```

</TabItem>
</Tabs>

### ステップ4：インデックスパラメータを準備し、コレクションを作成する{#step-4-prepare-index-parameters-and-create-the-collection}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Set up index parameters for the vector field
index_params = client.prepare_index_params()
index_params.add_index(field_name="embedding", metric_type="COSINE", index_type="AUTOINDEX")

# Create the collection with the defined schema and index parameters
client.create_collection(
    collection_name="my_collection",
    schema=schema,
    index_params=index_params
)
```

</TabItem>

<TabItem value='java'>

```java
// Set up index params for vector field
List<IndexParam> indexes = new ArrayList<>();
indexes.add(IndexParam.builder()
        .fieldName("embedding")
        .indexType(IndexParam.IndexType.AUTOINDEX)
        .metricType(IndexParam.MetricType.COSINE)
        .build());

// Create collection with defined schema
CreateCollectionReq requestCreate = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .indexParams(indexes)
        .build();
client.createCollection(requestCreate);
```

</TabItem>

<TabItem value='javascript'>

```javascript
// Set up index params for vector field
const indexParams = [
  {
    name: "embedding",
    metric_type: "COSINE",
    index_type: "AUTOINDEX",
  },
];

// Create collection with defined schema
await client.createCollection({
  collection_name: "my_collection",
  schema: schema,
  index_params: indexParams,
});

console.log("Collection created successfully!");
```

</TabItem>

<TabItem value='go'>

```go
idx := index.NewAutoIndex(index.MetricType(entity.COSINE))
indexOption := milvusclient.NewCreateIndexOption("my_collection", "embedding", idx)

err = client.CreateCollection(ctx,
    milvusclient.NewCreateCollectionOption("my_collection", schema).
        WithIndexOptions(indexOption))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
export INDEX_PARAMS='[{"fieldName": "embedding", "metricType": "COSINE", "indexType": "AUTOINDEX"}]'
# restful
curl -X POST "YOUR_CLUSTER_ENDPOINT/v2/vectordb/collections/create" \
  -H "Content-Type: application/json" \
  -d "{
    \"collectionName\": \"my_collection\",
    \"schema\": ${SCHEMA_CONFIG},
    \"indexParams\": ${INDEX_PARAMS}
  }"
```

</TabItem>
</Tabs>

## Zilliz Cloud コンソールでの使用例{#example-use-on-the-zilliz-cloud-console}

Zilliz Cloud コンソールを使用して、上記の操作を実行することもできます。詳細については、以下のデモを再生してください。

<Supademo id="cmfxfue5c41ld10k86la66x1v" title=""  />

## 次のステップ{#whats-next}

analyzer を設定する際は、ユースケースに最適な設定を決定するために、以下のベストプラクティス記事を読むことをお勧めします。

- [ユースケースに適したアナライザーを選択する](./choose-the-right-analyzer-for-your-use-case)

analyzer を設定した後、Zilliz Cloud が提供するテキスト検索機能と統合できます。詳細については、以下を参照してください。

- [Full Text Search](./full-text-search)

- [Text Match](./text-match)

