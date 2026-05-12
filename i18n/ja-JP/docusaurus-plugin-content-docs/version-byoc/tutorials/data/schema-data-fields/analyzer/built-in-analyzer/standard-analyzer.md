---
title: "Standard Analyzer | BYOC"
slug: /standard-analyzer
sidebar_key: standard-analyzer
sidebar_label: "Standard"
beta: FALSE
notebook: FALSE
description: "`standard` アナライザーは Zilliz Cloud のデフォルトアナライザーであり、アナライザーが指定されていない場合にテキストフィールドに自動的に適用されます。文法ベースのトークン化を使用しており、ほとんどの言語で効果的です。 | BYOC"
type: origin
token: WMSvwXXz4iR7mZkGmUscF3Y1nxs
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - アナライザー
  - 組み込みアナライザー
  - standard-analyzer

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 標準アナライザー

`standard` アナライザーは Zilliz Cloud のデフォルトアナライザーであり、アナライザーが指定されていない場合は自動的にテキストフィールドに適用されます。文法ベースのトークン化を使用しており、ほとんどの言語で効果的です。

<Admonition type="info" icon="📘" title="Notes">

`standard` アナライザーは、単語の境界に区切り文字（スペース、句読点など）を使用する言語に適しています。ただし、中国語、日本語、韓国語などの言語では辞書ベースのトークン化が必要です。このような場合、[`chinese`](./chinese-analyzer) などの言語固有のアナライザーや、[`lindera`](./lindera-tokenizer)、[`icu`](./icu-tokenizer) などの専用トークナイザーとフィルターを使用したカスタムアナライザーを使用することを強く推奨します。これにより、正確なトークン化とより良い検索結果を確保できます。

</Admonition>

## 定義\{#definition}

`standard` アナライザーは以下で構成されています：

- **トークナイザー**: `standard` トークナイザーを使用して、文法ルールに基づいてテキストを個別の単語単位に分割します。詳細については、[Standard トークナイザー](./standard-tokenizer) を参照してください。

- **フィルター**: `lowercase` フィルターを使用して、すべてのトークンを小文字に変換し、大文字小文字を区別しない検索を可能にします。詳細については、[Lowercase](./lowercase-filter) を参照してください。

`standard` アナライザーの機能は、以下のカスタムアナライザー設定と同等です：

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
analyzerParams := map[string]any{"tokenizer": "standard", "filter": []any{"lowercase"}}
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

## 設定\{#configuration}

フィールドに `standard` アナライザーを適用するには、`analyzer_params` 内で `type` を `standard` に設定し、必要に応じてオプションのパラメータを含めてください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "type": "standard", # Specifies the standard analyzer type
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("type", "standard");
```

</TabItem>

<TabItem value='java'>

```javascript
const analyzer_params = {
    "type": "standard", // Specifies the standard analyzer type
}
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"type": "standard"}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
analyzerParams='{
  "type": "standard"
}'
```

</TabItem>
</Tabs>

`standard` アナライザーは、以下のオプションパラメータを受け付けます：

<table>
   <tr>
     <th><p>パラメータ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>stop_words</code></p></td>
     <td><p>トークン化から除外されるストップワードのリストを含む配列。</p></td>
   </tr>
</table>

カスタムストップワードの設定例：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "type": "standard", # Specifies the standard analyzer type
    "stop_words", ["of"] # Optional: List of words to exclude from tokenization
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("type", "standard");
analyzerParams.put("stop_words", Collections.singletonList("of"));
```

</TabItem>

<TabItem value='java'>

```javascript
analyzer_params = {
    "type": "standard", // Specifies the standard analyzer type
    "stop_words", ["of"] // Optional: List of words to exclude from tokenization
}
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"type": "standard", "stop_words": []string{"of"}}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
analyzerParams='{
  "type": "standard",
  "stop_words": [
    "of"
  ]
}'
```

</TabItem>
</Tabs>

`analyzer_params` を定義した後、コレクションスキーマを定義する際に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud は指定したアナライザーを使用してそのフィールドのテキストを処理し、効率的なトークン化とフィルタリングを実現します。詳細については、[使用例](./analyzer-overview#example-use) を参照してください。

## Examples\{#examples}

アナライザー設定をコレクションスキーマに適用する前に、`run_analyzer` メソッドを使用してその動作を確認してください。

### Analyzer configuration\{#analyzer-configuration}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "type": "standard",  # Standard analyzer configuration
    "stop_words": ["for"] # Optional: Custom stop words parameter
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("type", "standard");
analyzerParams.put("stop_words", Collections.singletonList("for"));
```

</TabItem>

<TabItem value='java'>

```javascript
// javascript
analyzer_params = {
    "type": "standard", // Specifies the standard analyzer type
    "stop_words", ["for"] // Optional: List of words to exclude from tokenization
}
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"type": "standard", "stop_words": []string{"for"}}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
analyzerParams='{
  "type": "standard",
  "stop_words": [
    "for"
  ]
}'
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
Standard analyzer output: ['the', 'milvus', 'vector', 'database', 'is', 'built', 'scale']
```
