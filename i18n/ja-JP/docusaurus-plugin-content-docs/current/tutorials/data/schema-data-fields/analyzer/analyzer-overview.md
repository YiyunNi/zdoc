---
title: "アナライザーの概要 | Cloud"
slug: /analyzer-overview
sidebar_label: "概要"
beta: FALSE
notebook: FALSE
description: "テキスト処理において、アナライザーは生テキストを構造化された検索可能な形式に変換する重要なコンポーネントです。各アナライザーは通常、トークナイザーとフィルターという 2 つのコア要素で構成されています。これらが連携して入力テキストをトークンに変換し、これらのトークンを精査することで、効率的なインデックス作成と検索の準備を行います。 | Cloud"
type: origin
token: H8MVwnjdgihp0hkRHHKcjBe9n5e
sidebar_position: 1
keywords:
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - analyzer の解説

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# アナライザーの概要

テキスト処理において、**アナライザー**は生のテキストを構造化された検索可能な形式に変換するための重要なコンポーネントです。各アナライザーは通常、**トークナイザー**と**フィルター**という2つのコア要素で構成されています。これらが協調して入力テキストをトークンに変換し、それらのトークンを洗練させて、効率的なインデックス作成および検索の準備を行います。

Zilliz Cloudでは、コレクションスキーマに`VARCHAR`フィールドを追加する際に、コレクション作成時にアナライザーを設定します。アナライザーによって生成されたトークンは、キーワードマッチング用のインデックス構築に使用することも、全文検索用のスパース埋め込みに変換することもできます。詳細については、[Full Text Search](./full-text-search) または [Text Match](./text-match) を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>アナライザーの使用はパフォーマンスに影響を与える可能性があります:</p>
<ul>
<li><p><strong>全文検索:</strong> 全文検索の場合、<strong>DataNode</strong>および<strong>QueryNode</strong>チャネルはトークン化が完了するまで待機しなければならないため、データの消費速度が遅くなります。その結果、新しく取り込まれたデータが検索可能になるまでに時間がかかります。</p></li>
<li><p><strong>キーワードマッチ:</strong> キーワードマッチの場合も、トークン化が完了してからでないとインデックスを作成できないため、インデックス作成が遅くなります。</p></li>
</ul>

</Admonition>

## アナライザーの構成\{#anatomy-of-an-analyzer}

Zilliz Cloudにおけるアナライザーは、**ちょうど1つ**の**トークナイザー**と**ゼロ個以上**のフィルターで構成されます。

- **トークナイザー**: トークナイザーは入力テキストを「トークン」と呼ばれる個別の単位に分割します。これらのトークンは、トークナイザーの種類に応じて単語やフレーズになります。

- **フィルター**: フィルターはトークンに適用され、小文字化や一般的な単語の除去など、トークンをさらに洗練させるために使用されます。

<Admonition type="info" icon="📘" title="Notes">

<p>トークナイザーはUTF-8形式のみをサポートしています。他の形式のサポートは今後のリリースで追加される予定です。</p>

</Admonition>

以下のワークフローは、アナライザーがテキストを処理する方法を示しています。

![Ke6jw8437hjR8hbZCvEcQtIIn1e](https://zdoc-images.s3.us-west-2.amazonaws.com/Ke6jw8437hjR8hbZCvEcQtIIn1e.png)

## アナライザーの種類\{#analyzer-types}

Zilliz Cloudでは、さまざまなテキスト処理ニーズに対応するために、次の2種類のアナライザーを提供しています。

- **組み込みアナライザー**: これらは事前定義された設定で、最小限のセットアップで一般的なテキスト処理タスクをカバーします。組み込みアナライザーは汎用的な検索に最適で、複雑な設定が不要です。

- **カスタムアナライザー**: より高度な要件に対しては、カスタムアナライザーを使用することで、トークナイザーとゼロ個以上のフィルターを自分で指定した独自の設定を定義できます。このレベルのカスタマイズは、テキスト処理をきめ細かく制御する必要がある特殊なユースケースに特に役立ちます。

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p>コレクション作成時にアナライザーの設定を省略した場合、Zilliz Cloudはすべてのテキスト処理にデフォルトで<code>standard</code>アナライザーを使用します。詳細については、<a href="./standard-analyzer">Standard</a>を参照してください。</p></li>
<li><p>検索およびクエリのパフォーマンスを最適化するには、テキストデータの言語に合ったアナライザーを選択してください。たとえば、<code>standard</code>アナライザーは汎用性が高いものの、中国語、日本語、韓国語など、独自の文法構造を持つ言語には必ずしも最適ではありません。このような場合には、<a href="./chinese-analyzer"><code>chinese</code></a>のような言語固有のアナライザーや、<a href="./lindera-tokenizer"><code>lindera</code></a>や<a href="./icu-tokenizer"><code>icu</code></a>などの特殊なトークナイザーとフィルターを組み合わせたカスタムアナライザーを使用することを強く推奨します。これにより、正確なトークン化とより良い検索結果が得られます。</p></li>
</ul>

</Admonition>

### 組み込みアナライザー\{#built-in-analyzer}

Zilliz Cloudクラスター内の組み込みアナライザーは、特定のトークナイザーとフィルターが事前設定されており、これらのコンポーネントを自分で定義せずにすぐに使用できます。各組み込みアナライザーはテンプレートとして機能し、プリセットされたトークナイザーとフィルターを含み、必要に応じてカスタマイズ可能なオプションのパラメーターも備えています。

たとえば、`standard`組み込みアナライザーを使用するには、その名前`standard`を`type`として指定し、必要に応じてこのアナライザー固有の追加設定（例: `stop_words`）を含めるだけです。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "type": "standard", # standard 組み込みアナライザーを使用
    "stop_words": ["a", "an", "for"] # トークン化から除外する一般的な単語（ストップワード）のリストを定義
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
    "type": "standard", // standard 組み込みアナライザーを使用
    "stop_words": ["a", "an", "for"] // トークン化から除外する一般的な単語（ストップワード）のリストを定義
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

アナライザーの実行結果を確認するには、`run_analyzer` メソッドを使用します：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# 分析するサンプルテキスト
text = "An efficient system relies on a robust analyzer to correctly process text for various applications."

# アナライザーを実行
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
// 分析するサンプルテキスト
const text = "An efficient system relies on a robust analyzer to correctly process text for various applications."

// アナライザーを実行
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

出力は次のようになります。

```plaintext
['efficient', 'system', 'relies', 'on', 'robust', 'analyzer', 'to', 'correctly', 'process', 'text', 'various', 'applications']
```

これは、アナライザーが入力テキストを適切にトークン化し、ストップワード `"a"`、`"an"`、および `"for"` をフィルタリングしつつ、残りの意味のあるトークンを返すことを示しています。

上記の組み込みアナライザー `standard` の設定は、以下のパラメータで[カスタムアナライザー](./analyzer-overview#custom-analyzer)を設定することと同等です。この場合、同様の機能を実現するために `tokenizer` および `filter` オプションが明示的に定義されています：

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
       "tokenizer": "standard",
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

Zilliz Cloud には、特定のテキスト処理ニーズに合わせて設計された以下の組み込みアナライザーが用意されています。

- `standard`: 汎用的なテキスト処理に適しており、標準的なトークン化と小文字フィルタリングを適用します。

- `english`: 英語テキスト向けに最適化されており、英語のストップワードに対応しています。

- `chinese`: 中国語テキストの処理に特化しており、中国語の言語構造に合わせたトークン化を含みます。

### カスタムアナライザー\{#custom-analyzer}

より高度なテキスト処理を行うには、Zilliz Cloud のカスタムアナライザーを使用して、**トークナイザー**と**フィルター**を指定することで、用途に合わせたテキスト処理パイプラインを構築できます。この設定は、細やかな制御が必要な特殊なユースケースに最適です。

#### トークナイザー\{#tokenizer}

**トークナイザー**はカスタムアナライザーに**必須**のコンポーネントであり、入力テキストを個別の単位（**トークン**）に分割することでアナライザーパイプラインを開始します。トークン化は、ホワイトスペースや句読点による分割など、トークナイザーの種類に応じた特定のルールに従って行われます。これにより、各単語やフレーズをより正確かつ独立的に処理できます。

例えば、トークナイザーはテキスト `"Vector Database Built for Scale"` を以下のような個別のトークンに変換します：

```plaintext
["Vector", "Database", "Built", "for", "Scale"]
```

**トークナイザーを指定する例**:

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
       "tokenizer": "whitespace"
    }'
```

</TabItem>
</Tabs>

#### Filter\{#filter}

**フィルター**はトークナイザーによって生成されたトークンに対して機能する**オプション**のコンポーネントであり、必要に応じてそれらを変換または精製します。たとえば、トークン化された語 `["Vector", "Database", "Built", "for", "Scale"]` に `lowercase` フィルターを適用すると、結果は次のようになります:

```sql
["vector", "database", "built", "for", "scale"]
```

カスタムアナライザーのフィルターは、設定の必要に応じて**組み込み**または**カスタム**のいずれかになります。

- **組み込みフィルター**: Zilliz Cloud によって事前設定されており、最小限のセットアップで使用できます。これらのフィルターは名前を指定するだけでそのまま利用可能です。以下のフィルターは組み込みフィルターとして直接使用できます：

    - `lowercase`: テキストを小文字に変換し、大文字・小文字を区別しないマッチングを実現します。詳細については、[Lowercase](./lowercase-filter) を参照してください。

    - `asciifolding`: 非 ASCII 文字を ASCII の同等文字に変換し、多言語テキストの処理を簡素化します。詳細については、[ASCII folding](./ascii-folding-filter) を参照してください。

    - `alphanumonly`: 英数字以外の文字を削除し、英数字のみを保持します。詳細については、[Alphanumonly](./alphanumonly-filter) を参照してください。

    - `cnalphanumonly`: 中国語文字、英字、数字以外の文字を含むトークンを削除します。詳細については、[Cnalphanumonly](./cnalphanumonly-filter) を参照してください。

    - `cncharonly`: 非中国語文字を含むトークンを削除します。詳細については、[Cncharonly](./cncharonly-filter) を参照してください。

    **組み込みフィルターの使用例:**

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    analyzer_params = {
        "tokenizer": "standard", # 必須: トークナイザーを指定
        "filter": ["lowercase"], # オプション: テキストを小文字に変換する組み込みフィルター
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
        "tokenizer": "standard", // 必須: トークナイザーを指定
        "filter": ["lowercase"], // オプション: テキストを小文字に変換する組み込みフィルター
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
           "tokenizer": "standard",
           "filter":  ["lowercase"]
        }'
    ```

    </TabItem>
    </Tabs>

- **カスタムフィルター**: カスタムフィルターを使用すると、特殊な設定が可能になります。有効なフィルターの種別（`filter.type`）を選択し、各フィルターの種別に応じた具体的な設定を追加することで、カスタムフィルターを定義できます。カスタマイズをサポートするフィルターの種別の例を以下に示します。

    - `stop`: ストップワードのリストを指定して、特定の一般的な単語を削除します（例: `"stop_words": ["of", "to"]`）。詳細については、[Stop](./stop-filter) を参照してください。

    - `length`: トークンの長さに基づいて除外を行います（例: 最大トークン長を設定するなど）。詳細については、[Length](./length-filter) を参照してください。

    - `stemmer`: 単語をその語幹（ルート形）に還元することで、より柔軟なマッチングを実現します。詳細については、[Stemmer](./stemmer-filter) を参照してください。

    **カスタムフィルターの設定例:**

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    analyzer_params = {
        "tokenizer": "standard", # 必須: トークナイザーを指定
        "filter": [
            {
                "type": "stop", # フィルターの種別として 'stop' を指定
                "stop_words": ["of", "to"], # このフィルターの種別用にストップワードをカスタマイズ
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
                put("stop_words", Arrays.asList("of", "to"));
            }}));
    ```

    </TabItem>

    <TabItem value='javascript'>

    ```javascript
    const analyzer_params = {
        "tokenizer": "standard", // 必須: トークナイザーを指定
        "filter": [
            {
                "type": "stop", // フィルターの種別として 'stop' を指定
                "stop_words": ["of", "to"], // このフィルターの種別用にストップワードをカスタマイズ
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
           "tokenizer": "standard",
           "filter":  [
           {
                "type": "stop",
                "stop_words": ["of", "to"]
           }
        ]
    }'
    ```

    </TabItem>
    </Tabs>

```java
nlohmann::json analyzer_params = {
    {"tokenizer", "standard"},
    {"filter", {{{"type", "stop"}, {"stop_words", {"of", "to"}}}}},
};
```

## 使用例\{#example-use}

この例では、以下の要素を含むコレクションスキーマを作成します。

- 埋め込み（embeddings）用のベクトルフィールド。
- テキスト処理用の2つの `VARCHAR` フィールド：
    - 1つのフィールドは組み込みアナライザーを使用します。
    - もう1つのフィールドはカスタムアナライザーを使用します。

これらの設定をコレクションに組み込む前に、`run_analyzer` メソッドを使って各アナライザーを検証します。

### ステップ 1: MilvusClient の初期化とスキーマの作成\{#step-1-initialize-milvusclient-and-create-schema}

まず、Milvus クライアントをセットアップし、新しいスキーマを作成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, DataType

# Milvus クライアントをセットアップ
client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# 新しいスキーマを作成
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

// Milvus クライアントをセットアップ
ConnectConfig config = ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build();
MilvusClientV2 client = new MilvusClientV2(config);

// スキーマを作成
CreateCollectionReq.CollectionSchema schema = CreateCollectionReq.CollectionSchema.builder()
        .enableDynamicField(false)
        .build();
```

</TabItem>

<TabItem value='javascript'>

```javascript
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

// Milvus クライアントをセットアップ
const client = new MilvusClient({
    address: "YOUR_CLUSTER_ENDPOINT",
    token: "YOUR_CLUSTER_TOKEN"
});
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

### ステップ 2: アナライザーの設定を定義および検証する\{#step-2-define-and-verify-analyzer-configurations}

1. **組み込みアナライザー**（`english`）**の設定と検証**:

    - **設定:** 組み込みの英語アナライザー用にアナライザーのパラメータを定義します。

    - **検証:** `run_analyzer` を使用して、設定が期待されるトークン化を生成することを確認します。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    # 英語テキスト処理用の組み込みアナライザー設定
    analyzer_params_built_in = {
        "type": "english"
    }
    # 組み込みアナライザー設定を検証
    sample_text = "Milvus simplifies text analysis for search."
    result = client.run_analyzer(sample_text, analyzer_params_built_in)
    print("Built-in analyzer output:", result)

    # 期待される出力:
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
    // VARCHAR フィールド `title_en` 用の組み込みアナライザーを使用
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

    - **設定:** 標準のトークナイザーと組み込みの lowercase フィルター、およびトークン長とストップワード用のカスタムフィルターを使用するカスタムアナライザーを定義します。

    - **検証:** `run_analyzer` を使用して、カスタム設定が意図通りにテキストを処理することを確認します。

    <Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
    <TabItem value='python'>

    ```python
    # 標準トークナイザーとカスタムフィルターを使用したカスタムアナライザー設定
    analyzer_params_custom = {
        "tokenizer": "standard",
        "filter": [
            "lowercase",  # 組み込みフィルター: トークンを小文字に変換
            {
                "type": "length",  # カスタムフィルター: トークン長を制限
                "max": 40
            },
            {
                "type": "stop",  # カスタムフィルター: 指定されたストップワードを削除
                "stop_words": ["of", "for"]
            }
        ]
    }

    # カスタムアナライザー設定を検証
    sample_text = "Milvus provides flexible, customizable analyzers for robust text processing."
    result = client.run_analyzer(sample_text, analyzer_params_custom)
    print("Custom analyzer output:", result)

    # 期待される出力:
    # Custom analyzer output: ['milvus', 'provides', 'flexible', 'customizable', 'analyzers', 'robust', 'text', 'processing']
    ```

    </TabItem>

    <TabItem value='java'>

    ```java
    // カスタムアナライザーを設定
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
    // VARCHAR フィールド `title` 用のカスタムアナライザーを設定
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
          stop_words: ["of", "for"],
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
    analyzerParamsCustom := map[string]any{"tokenizer": "standard",
        "filter": []any{"lowercase",
            map[string]any{
                "type": "length",
                "max":  40,
            },
            map[string]any{
                "type": "stop",
                "stop_words": []string{"of", "for"},
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
    # restful
    export MILVUS_HOST="YOUR_CLUSTER_ENDPOINT"
    export SAMPLE_TEXT="Milvus provides flexible, customizable analyzers for robust text processing."
    export ANALYZER_PARAMS='{"tokenizer":"standard","filter":["lowercase",{"type":"length","max":40},{"type":"stop","stop_words":["of","for"]}]}'
    curl -X POST "http://${MILVUS_HOST}/v2/vectordb/common/run_analyzer" \
      -H "Content-Type: application/json" \
      -d '{
        "text": ["'"${SAMPLE_TEXT}"'"],
        "analyzerParams": "'"${ANALYZER_PARAMS}"'"
      }'
    ```

    </TabItem>
    </Tabs>

### ステップ 3: フィールドをスキーマに追加する\{#step-3-add-fields-to-schema}

アナライザー設定を検証したら、スキーマにフィールドを追加します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# ベクトルフィールドを追加
schema.add_field(field_name="embedding", datatype=DataType.FLOAT_VECTOR, dim=768)

# 組み込みアナライザーを使用する VARCHAR フィールドを追加
schema.add_field(
    field_name="title_en",
    datatype=DataType.VARCHAR,
    max_length=65535,
    analyzer_params=analyzer_params_built_in
)

# カスタムアナライザーを使用する VARCHAR フィールドを追加
schema.add_field(
    field_name="title",
    datatype=DataType.VARCHAR,
    max_length=65535,
    analyzer_params=analyzer_params_custom
)
```

</TabItem>

<TabItem value='java'>

```java
// ベクトルフィールドを追加
schema.addField(AddFieldReq.builder()
        .fieldName("embedding")
        .dataType(DataType.FloatVector)
        .dimension(768)
        .build());

// 組み込みアナライザーを使用する VARCHAR フィールドを追加
schema.addField(AddFieldReq.builder()
        .fieldName("title_en")
        .dataType(DataType.VarChar)
        .maxLength(65535L)
        .analyzerParams(analyzerParamsBuiltin)
        .build());

// カスタムアナライザーを使用する VARCHAR フィールドを追加
schema.addField(AddFieldReq.builder()
        .fieldName("title")
        .dataType(DataType.VarChar)
        .maxLength(65535L)
        .analyzerParams(analyzerParamsCustom)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
// ベクトルフィールドを追加
await client.createCollection({
  collectionName: "my_collection",
  schema: {
    fields: [
      {
        name: "embedding",
        dataType: DataType.FloatVector,
        dim: 768,
      },
      {
        name: "title_en",
        dataType: DataType.VarChar,
        maxLength: 65535,
        analyzer_params: analyzer_params_built_in,
      },
      {
        name: "title",
        dataType: DataType.VarChar,
        maxLength: 65535,
        analyzer_params: analyzer_params_custom,
      },
    ],
  },
});
```

</TabItem>

<TabItem value='go'>

```go
// ベクトルフィールドを追加
schema.AddField(entity.NewField().WithName("embedding").WithDataType(entity.FieldTypeFloatVector).WithDim(768))

// 組み込みアナライザーを使用する VARCHAR フィールドを追加
schema.AddField(entity.NewField().WithName("title_en").WithDataType(entity.FieldTypeVarChar).WithMaxLength(65535).WithAnalyzerParams(analyzerParamsBuiltin))

// カスタムアナライザーを使用する VARCHAR フィールドを追加
schema.AddField(entity.NewField().WithName("title").WithDataType(entity.FieldTypeVarChar).WithMaxLength(65535).WithAnalyzerParams(analyzerParamsCustom))
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
    "fields": [
      {
        "name": "embedding",
        "dataType": "FloatVector",
        "dim": 768
      },
      {
        "name": "title_en",
        "dataType": "VarChar",
        "maxLength": 65535,
        "analyzerParams": {
          "type": "english"
        }
      },
      {
        "name": "title",
        "dataType": "VarChar",
        "maxLength": 65535,
        "analyzerParams": {
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            {
              "type": "length",
              "max": 40
            },
            {
              "type": "stop",
              "stop_words": ["of", "for"]
            }
          ]
        }
      }
    ]
  }'
```

</TabItem>
</Tabs>

### ステップ 4: コレクションを作成する\{#step-4-create-collection}

最後に、スキーマを使用してコレクションを作成します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# コレクションを作成
client.create_collection(collection_name="my_collection", schema=schema)
```

</TabItem>

<TabItem value='java'>

```java
// コレクションを作成
client.createCollection(CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
// 上記のステップ3でコレクションが作成されるため、このステップは不要です
```

</TabItem>

<TabItem value='go'>

```go
// コレクションを作成
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("my_collection").WithSchema(schema))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
# 上記のステップ3でコレクションが作成されるため、このステップは不要です
```

</TabItem>
</Tabs>