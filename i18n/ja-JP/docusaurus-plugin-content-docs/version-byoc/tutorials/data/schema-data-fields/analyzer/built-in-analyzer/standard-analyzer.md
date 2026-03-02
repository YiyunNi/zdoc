---
title: "Standard Analyzer | BYOC"
slug: /standard-analyzer
sidebar_label: "Standard Analyzer"
beta: FALSE
notebook: FALSE
description: "`standard` analyzerはZilliz Cloudのデフォルトanalyzerであり、analyzerが指定されていない場合、テキストフィールドに自動的に適用されます。文法ベースのトークン化を使用するため、ほとんどの言語で効果的です。 | BYOC"
type: origin
token: WMSvwXXz4iR7mZkGmUscF3Y1nxs
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - analyzer
  - 組み込みanalyzer
  - standard-analyzer
  - Hierarchical Navigable Small Worlds
  - Dense embedding
  - Faiss vector database
  - Chroma vector database

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Standard Analyzer

`standard` analyzerはZilliz Cloudのデフォルトアナライザーであり、アナライザーが指定されていない場合にテキストフィールドに自動的に適用されます。文法ベースのトークン化を使用するため、ほとんどの言語で効果的です。

<Admonition type="info" icon="📘" title="Notes">

<p><code>standard</code> analyzerは、単語の区切りに区切り文字（スペース、句読点など）を使用する言語に適しています。ただし、中国語、日本語、韓国語のような言語では、辞書ベースのトークン化が必要です。このような場合、正確なトークン化とより良い検索結果を保証するために、<a href="./chinese-analyzer"><code>chinese</code></a>のような言語固有のアナライザーや、特殊なトークナイザー（<a href="./lindera-tokenizer"><code>lindera</code></a>、<a href="./icu-tokenizer"><code>icu</code></a>など）とフィルターを備えたカスタムアナライザーを使用することを強くお勧めします。</p>

</Admonition>

## 定義{#definition}

`standard` analyzerは以下で構成されます。

- **Tokenizer**: 文法規則に基づいてテキストを個別の単語単位に分割するために`standard` tokenizerを使用します。詳細については、[Standard Tokenizer](./standard-tokenizer)を参照してください。

- **Filter**: すべてのトークンを小文字に変換するために`lowercase` filterを使用し、大文字と小文字を区別しない検索を可能にします。詳細については、[Lowercase](./lowercase-filter)を参照してください。

`standard` analyzerの機能は、以下のカスタムアナライザー設定と同等です。

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

<TabItem value='javascript'>

```javascript
const analyzer_params = {
    "tokenizer": "standard",
    "filter": ["lowercase"]
};
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams := map[string]any{"tokenizer": "standard", "filter": []any{"lowercase"}}
```

</TabItem>

<TabItem value='bash'>

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

## 設定 {#configuration}

フィールドに `standard` アナライザーを適用するには、`analyzer_params` で `type` を `standard` に設定し、必要に応じてオプションのパラメーターを含めます。

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

<TabItem value='javascript'>

```javascript
const analyzer_params = {
    "type": "standard", // Specifies the standard analyzer type
}
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams = map[string]any{"type": "standard"}
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
analyzerParams='{
  "type": "standard"
}'
```

</TabItem>
</Tabs>

`standard` アナライザーは、以下のオプションパラメータを受け入れます。

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

<TabItem value='javascript'>

```javascript
analyzer_params = {
    "type": "standard", // Specifies the standard analyzer type
    "stop_words", ["of"] // Optional: List of words to exclude from tokenization
}
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams = map[string]any{"type": "standard", "stop_words": []string{"of"}}
```

</TabItem>

<TabItem value='bash'>

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

`analyzer_params` を定義した後、コレクションスキーマを定義する際に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud は指定されたアナライザーを使用してそのフィールドのテキストを処理し、効率的なトークン化とフィルタリングを行うことができます。詳細については、[使用例](./analyzer-overview#example-use) を参照してください。

## 例{#examples}

アナライザー設定をコレクションスキーマに適用する前に、`run_analyzer` メソッドを使用してその動作を確認してください。

### アナライザー設定{#analyzer-configuration}

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

<TabItem value='javascript'>

```javascript
// javascript
analyzer_params = {
    "type": "standard", // Specifies the standard analyzer type
    "stop_words", ["for"] // Optional: List of words to exclude from tokenization
}
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams = map[string]any{"type": "standard", "stop_words": []string{"for"}}
```

</TabItem>

<TabItem value='bash'>

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

### `run_analyzer` を使用した検証 {#verification-using-runanalyzer}

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

<TabItem value='javascript'>

```javascript
// javascript
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

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

### 期待される出力結果{#expected-output}

```plaintext
Standard analyzer output: ['the', 'milvus', 'vector', 'database', 'is', 'built', 'scale']
```
