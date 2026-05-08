---
title: "ICU | Cloud"
slug: /icu-tokenizer
sidebar_key: icu-tokenizer
sidebar_label: "ICU"
beta: FALSE
notebook: FALSE
description: "`icu` トークナイザーは、ソフトウェアの国際化に不可欠なツールを提供するオープンソースプロジェクトである Internationalization Components of Unicode（ICU）をベースに構築されています。ICU の単語分割アルゴリズムを使用することで、このトークナイザーは世界のほとんどの言語において、テキストを正確に単語に分割できます。 | Cloud"
type: origin
token: Q3gKwc5lkilAbKkalCWcW2AbnLe
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - analyzer
  - built-in tokenizer
  - icu-tokenizer

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ICU

`icu` トークナイザーは、[Internationalization Components of Unicode](http://site.icu-project.org/)（ICU）オープンソースプロジェクトをベースに構築されています。ICU はソフトウェアの国際化に不可欠なツールを提供しており、その単語分割アルゴリズムを使用することで、世界のほとんどの言語においてテキストを正確に単語に分割できます。

<Admonition type="info" icon="📘" title="Notes">

`icu` トークナイザーは、出力において句読点とスペースを個別のトークンとして保持します。例えば、`"Привет! Как дела?"` は `["Привет", "!", " ", "Как", " ", "дела", "?"]` となります。これらの独立した句読点トークンを削除するには、[`removepunct`](./remove-punct-filter) フィルターを使用してください。

</Admonition>

## 設定\{#configuration}

`icu` トークナイザーを使用してアナライザーを設定するには、`analyzer_params` で `tokenizer` を `icu` に設定します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "icu",
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "icu");
```

</TabItem>

<TabItem value='java'>

```javascript
// node
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "icu"}
```

</TabItem>

<TabItem value='java'>

```bash
# curl
```

</TabItem>
</Tabs>

`icu` トークナイザーは、1 つ以上のフィルターと組み合わせて使用できます。たとえば、次のコードでは、`icu` トークナイザーと [remove punct フィルター](./remove-punct-filter) を使用するアナライザーを定義しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "icu",
    "filter": ["removepunct"]
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "icu");
analyzerParams.put("filter", Collections.singletonList("removepunct"));
```

</TabItem>

<TabItem value='java'>

```javascript
// node
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "icu", "filter": []string{"removepunct"}}
```

</TabItem>

<TabItem value='java'>

```bash
# curl
```

</TabItem>
</Tabs>

`analyzer_params` を定義した後、コレクションスキーマを定義する際に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud は指定したアナライザーを使用してそのフィールドのテキストを処理し、効率的なトークン化とフィルタリングを行うことができます。詳細については、[使用例](./analyzer-overview#example-use) を参照してください。

## Examples\{#examples}

アナライザー設定をコレクションスキーマに適用する前に、`run_analyzer` メソッドを使用してその動作を確認してください。

### Analyzer configuration\{#analyzer-configuration}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "icu",
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "icu");
```

</TabItem>

<TabItem value='java'>

```javascript
// node
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "icu"}
```

</TabItem>

<TabItem value='java'>

```bash
# curl
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
sample_text = "Привет! Как дела?"

# Run the standard analyzer with the defined configuration
result = client.run_analyzer(sample_text, analyzer_params)
print("Standard analyzer output:", result)
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
texts.add("Привет! Как дела?");

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
texts := []string{"Привет! Как дела?"}
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
['Привет', '!', ' ', 'Как', ' ', 'дела', '?']
```

