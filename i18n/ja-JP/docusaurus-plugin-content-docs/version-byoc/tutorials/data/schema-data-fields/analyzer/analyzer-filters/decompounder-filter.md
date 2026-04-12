---
title: "Decompounder | BYOC"
slug: /decompounder-filter
sidebar_label: "Decompounder"
beta: FALSE
notebook: FALSE
description: "`decompounder` フィルターは、指定された辞書に基づいて複合語を個々の構成要素に分割し、複合語の一部を検索しやすくします。このフィルターは、ドイツ語のように複合語を頻繁に使用する言語で特に役立ちます。| BYOC"
type: origin
token: DDrHwdsb7idJa9kVU6zc2VwInBf
sidebar_position: 8
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - analyzer
  - built-in filters
  - decompounder

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Decompounder

`decompounder` フィルターは、指定された辞書に基づいて複合語を個々の構成要素に分割し、複合語の一部を検索しやすくします。このフィルターは、ドイツ語など複合語を頻繁に使用する言語において特に有用です。

## 設定\{#configuration}

`decompounder` フィルターは Zilliz Cloud におけるカスタムフィルターです。これを使用するには、フィルター設定で `"type": "decompounder"` を指定し、認識する単語構成要素の辞書を提供する `word_list` パラメーターを併記します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter":[{
        "type": "decompounder", # Specifies the filter type as decompounder
        "word_list": ["dampf", "schiff", "fahrt", "brot", "backen", "automat"],
    }],
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "standard");
analyzerParams.put("filter",
        Collections.singletonList(
                new HashMap<String, Object>() {{
                    put("type", "decompounder");
                    put("word_list", Arrays.asList("dampf", "schiff", "fahrt", "brot", "backen", "automat"));
                }}
        )
);
```

</TabItem>

<TabItem value='java'>

```javascript
const analyzer_params = {
    "tokenizer": "standard",
    "filter":[{
        "type": "decompounder", // Specifies the filter type as decompounder
        "word_list": ["dampf", "schiff", "fahrt", "brot", "backen", "automat"],
    }],
};
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "standard",
    "filter": []any{map[string]any{
        "type":       "decompounder",
        "word_list": []string{"dampf", "schiff", "fahrt", "brot", "backen", "automat"},
    }}}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
analyzerParams='{
  "tokenizer": "standard",
  "filter": [
    {
      "type": "decompounder",
      "word_list": [
        "dampf",
        "schiff",
        "fahrt",
        "brot",
        "backen",
        "automat"
      ]
    }
  ]
}'

```

</TabItem>
</Tabs>

`decompounder` フィルターは、以下の設定可能なパラメーターを受け入れます。

<table>
   <tr>
     <th><p>パラメーター</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>word_list</code></p></td>
     <td><p>複合語を分割する際に使用される単語コンポーネントのリスト。この辞書により、複合語が個々の語にどのように分解されるかが決まります。</p></td>
   </tr>
</table>

`decompounder` フィルターはトークナイザーによって生成された語に対して動作するため、トークナイザーと組み合わせて使用する必要があります。Zilliz Cloud で利用可能なトークナイザーの一覧については、[トークナイザー Reference](./analyzer-tokenizers) を参照してください。

`analyzer_params` を定義した後、コレクションスキーマを定義する際に `VARCHAR` 型フィールドに適用できます。これにより、Zilliz Cloud は指定されたアナライザーを使用してそのフィールド内のテキストを処理し、効率的なトークン化とフィルタリングを実現します。詳細については、[Example use](./analyzer-overview#example-use) を参照してください。

## 例\{#examples}

コレクションスキーマにアナライザー設定を適用する前に、`run_analyzer` メソッドを使用してその動作を検証してください。

### アナライザー設定\{#analyzer-configuration}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter":[{
        "type": "decompounder", # Specifies the filter type as decompounder
        "word_list": ["dampf", "schiff", "fahrt", "brot", "backen", "automat"],
    }],
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "standard");
analyzerParams.put("filter",
        Collections.singletonList(
                new HashMap<String, Object>() {{
                    put("type", "decompounder");
                    put("word_list", Arrays.asList("dampf", "schiff", "fahrt", "brot", "backen", "automat"));
                }}
        )
);
```

</TabItem>

<TabItem value='java'>

```javascript
// javascript
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "standard",
    "filter": []any{map[string]any{
        "type":       "decompounder",
        "word_list": []string{"dampf", "schiff", "fahrt", "brot", "backen", "automat"},
    }}}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
analyzerParams='{
  "tokenizer": "standard",
  "filter": [
    {
      "type": "decompounder",
      "word_list": [
        "dampf",
        "schiff",
        "fahrt",
        "brot",
        "backen",
        "automat"
      ]
    }
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

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

# Sample text to analyze
sample_text = "dampfschifffahrt brotbackautomat"

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
        .build();
MilvusClientV2 client = new MilvusClientV2(config);

List<String> texts = new ArrayList<>();
texts.add("dampfschifffahrt brotbackautomat");

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
texts := []string{"dampfschifffahrt brotbackautomat"}
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

```python
['dampf', 'schiff', 'fahrt', 'brotbackautomat']
```

