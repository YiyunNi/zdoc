---
title: "Standard トークナイザー | BYOC"
slug: /standard-tokenizer
sidebar_key: standard-tokenizer
sidebar_label: "Standard"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud の `standard` トークナイザーは、スペースと句読点に基づいてテキストを分割するため、ほとんどの言語に適しています。 | BYOC"
type: origin
token: GAX8wkC1QiTZhXkLBocc1GoTnke
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - analyzer
  - built-in tokenizer
  - standard-tokenizer

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Standard トークナイザー

Zilliz Cloud の `standard` トークナイザーは、スペースおよび句読点に基づいてテキストを分割するため、ほとんどの言語に適しています。

## 設定\{#configuration}

`standard` トークナイザーを使用してアナライザーを設定するには、`analyzer_params` 内の `tokenizer` を `standard` に設定します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "standard");
```

</TabItem>

<TabItem value='java'>

```javascript
const analyzer_params = {
    "tokenizer": "standard",
};
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "standard"}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
analyzerParams='{
  "tokenizer": "standard"
}'
```

</TabItem>
</Tabs>

`standard` トークナイザーは、1つ以上のフィルターと組み合わせて使用できます。たとえば、次のコードでは、`standard` トークナイザーと `lowercase` フィルターを使用するアナライザーを定義しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter": ["lowercase"]
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

<TabItem value='java'>

```javascript
const analyzer_params = {
    "tokenizer": "standard",
    "filter": ["lowercase"]
};
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "standard", "filter": []any{"lowercase"}}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
analyzerParams='{
  "tokenizer": "standard",
  "filter": [
    "lowercase"
  ]
}'
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

よりシンプルなセットアップを行う場合、[`standard`](./standard-analyzer) [アナライザー](./standard-analyzer)を使用することを選択できます。これは `standard` トークナイザーと [`lowercase`](./lowercase-filter)[ フィルター](./lowercase-filter)を組み合わせたものです。

</Admonition>

`analyzer_params` を定義した後、コレクションスキーマを定義する際に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud は指定されたアナライザーを使用してそのフィールド内のテキストを処理し、効率的なトークナイゼーションとフィルタリングを行うことができます。詳細については、[使用例](./analyzer-overview#example-use) を参照してください。

## Examples\{#examples}

アナライザー設定をコレクションスキーマに適用する前に、`run_analyzer` メソッドを使用してその動作を確認してください。

### Analyzer configuration\{#analyzer-configuration}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter": ["lowercase"]
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

<TabItem value='java'>

```javascript
// javascript
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "standard", "filter": []any{"lowercase"}}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

### `run_analyzer` を使用した検証\{#verification-using-runanalyzer}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import (
    MilvusClient,
)

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Sample text to analyze
sample_text = "The Milvus vector database is built for scale!"

# Run the standard analyzer with the defined configuration
result = client.run_analyzer(sample_text, analyzer_params)
print("English analyzer output:", result)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.vector.request.RunAnalyzerReq;
import io.milvus.v2.service.vector.response.RunAnalyzerResp;

ConnectConfig config = ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build();
MilvusClientV2 client = new MilvusClientV2(config);

List<String> texts = new ArrayList<>();
texts.add("The Milvus vector database is built for scale!");

RunAnalyzerResp resp = client.runAnalyzer(RunAnalyzerReq.builder()
        .texts(texts)
        .analyzerParams(analyzerParams)
        .build());
List<RunAnalyzerResp.AnalyzerResult> results = resp.getResults();
```

</TabItem>

<TabItem value='java'>

```javascript
// javascript
```

</TabItem>

<TabItem value='java'>

```go
import (
    "context"
    "encoding/json"
    "fmt"

    "github.com/milvus-io/milvus/client/v2/milvusclient"
)

client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: "YOUR_CLUSTER_ENDPOINT",
    APIKey:  "YOUR_CLUSTER_TOKEN",
})
if err != nil {
    fmt.Println(err.Error())
    // handle error
}

bs, _ := json.Marshal(analyzerParams)
texts := []string{"The Milvus vector database is built for scale!"}
option := milvusclient.NewRunAnalyzerOption(texts).
    WithAnalyzerParams(string(bs))

result, err := client.RunAnalyzer(ctx, option)
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

### 期待される出力\{#expected-output}

```plaintext
['the', 'milvus', 'vector', 'database', 'is', 'built', 'for', 'scale']
```

