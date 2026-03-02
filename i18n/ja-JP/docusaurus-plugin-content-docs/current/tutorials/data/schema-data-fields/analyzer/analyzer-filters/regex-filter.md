---
title: "正規表現 | Cloud"
slug: /regex-filter
sidebar_label: "正規表現"
beta: FALSE
notebook: FALSE
description: "`regex` フィルターは正規表現フィルターで、トークナイザーによって生成されたトークンは、指定した正規表現に一致する場合にのみ保持され、それ以外はすべて破棄されます。 | Cloud"
type: origin
token: AwmtwHGQii1j9Wk1W04cNxvBnth
sidebar_position: 11
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - analyzer
  - 組み込みフィルター
  - 正規表現
  - ANN Search
  - ベクトル埋め込みとは
  - ベクトルデータベースチュートリアル
  - ベクトルデータベースの仕組み

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Regex

`regex` フィルターは正規表現フィルターです。トークナイザーによって生成されたトークンは、指定された正規表現に一致する場合にのみ保持され、それ以外はすべて破棄されます。

## 設定{#configuration}

`regex` フィルターは Zilliz Cloud のカスタムフィルターです。これを使用するには、フィルター設定で `"type": "regex"` を指定し、目的の正規表現を指定するための `expr` パラメーターも指定します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter": [{
        "type": "regex",
        "expr": "^(?!test)" # keep tokens that do NOT start with "test"
    }]
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "standard");
analyzerParams.put("filter",
        Arrays.asList(new HashMap<String, Object>() {{
                    put("type", "regex");
                    put("expr", "^(?!test)");
                }})
);
```

</TabItem>

<TabItem value='javascript'>

```javascript
// node
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams = map[string]any{"tokenizer": "standard",
        "filter": []any{map[string]any{
            "type": "regex",
            "expr": "^(?!test)",
        }}}
```

</TabItem>

<TabItem value='bash'>

```bash
# curl
```

</TabItem>
</Tabs>

`regex` フィルターは、以下の設定可能なパラメーターを受け入れます。

<table>
   <tr>
     <th><p>パラメーター</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>expr</code></p></td>
     <td><p>各トークンに適用される正規表現パターン。一致するトークンは保持され、一致しないトークンは破棄されます。</p><p>正規表現の構文の詳細については、<a href="https://docs.rs/regex/latest/regex/#syntax">構文</a>を参照してください。</p></td>
   </tr>
</table>

`regex` フィルターは、トークナイザーによって生成された用語に対して動作するため、トークナイザーと組み合わせて使用する必要があります。

`analyzer_params` を定義した後、collection schema を定義する際に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud はそのフィールドのテキストを指定された analyzer を使用して処理し、効率的なトークン化とフィルタリングを行うことができます。詳細については、[使用例](./analyzer-overview#example-use)を参照してください。

## 例{#examples}

analyzer の設定を collection schema に適用する前に、`run_analyzer` メソッドを使用してその動作を確認してください。

### Analyzer の設定{#analyzer-configuration}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter": [{
        "type": "regex",
        "expr": "^(?!test)"
    }]
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "standard");
analyzerParams.put("filter",
        Collections.singletonList(new HashMap<String, Object>() {{
            put("type", "regex");
            put("expr", "^(?!test)");
        }}));
```

</TabItem>

<TabItem value='javascript'>

```javascript
// node
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams = map[string]any{"tokenizer": "standard",
        "filter": []any{map[string]any{
            "type": "regex",
            "expr": "^(?!test)",
        }}}
```

</TabItem>

<TabItem value='bash'>

```bash
# curl
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

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

# Sample text to analyze
sample_text = "testItem apple testCase banana"

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
texts.add("testItem apple testCase banana");

RunAnalyzerResp resp = client.runAnalyzer(RunAnalyzerReq.builder()
        .texts(texts)
        .analyzerParams(analyzerParams)
        .build());
List<RunAnalyzerResp.AnalyzerResult> results = resp.getResults();
```

</TabItem>

<TabItem value='javascript'>

```javascript
// node
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
texts := []string{"testItem apple testCase banana"}
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
```

</TabItem>
</Tabs>

### 期待される出力結果\{#expected-output}

```python
['apple', 'banana']
```

