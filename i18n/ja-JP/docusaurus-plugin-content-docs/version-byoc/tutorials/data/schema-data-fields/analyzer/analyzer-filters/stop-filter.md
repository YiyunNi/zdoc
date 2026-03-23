---
title: "Stop | BYOC"
slug: /stop-filter
sidebar_label: "Stop"
beta: FALSE
notebook: FALSE
description: "`stop` フィルターは、トークン化されたテキストから指定されたストップワードを削除し、一般的で意味の薄い単語を取り除くのに役立ちます。`stopwords` パラメーターを使用してストップワードのリストを設定できます。| BYOC"
type: origin
token: ScncwBnDBiVoLjksXAwcUgrgnod
sidebar_position: 7
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - analyzer
  - built-in filters
  - stop

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Stop

`stop` フィルターは、トークン化されたテキストから指定されたストップワードを削除し、一般的で意味の薄い単語を除去するのに役立ちます。`stop_words` パラメーターを使用して、ストップワードのリストを設定できます。

## 設定\{#configuration}

`stop` フィルターは Zilliz Cloud におけるカスタムフィルターです。これを使用するには、フィルターの設定で `"type": "stop"` を指定し、`stop_words` パラメーターでストップワードのリストを提供します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter":[{
        "type": "stop", # Specifies the filter type as stop
        "stop_words": ["of", "to", "_english_"], # Defines custom stop words and includes the English stop word list
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
                    put("type", "stop");
                    put("stop_words", Arrays.asList("of", "to", "_english_"));
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
        "type": "stop", # Specifies the filter type as stop
        "stop_words": ["of", "to", "_english_"], # Defines custom stop words and includes the English stop word list
    }],
};
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "standard",
    "filter": []any{map[string]any{
        "type":       "stop",
        "stop_words": []string{"of", "to", "_english_"},
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
      "type": "stop",
      "stop_words": [
        "of",
        "to",
        "_english_"
      ]
    }
  ]
}'

```

</TabItem>
</Tabs>

`stop` フィルターは、以下の設定可能なパラメータを受け入れます。

<table>
   <tr>
     <th><p>パラメータ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>stop_words</code></p></td>
     <td><p>トークナイズから除外する単語のリスト。デフォルトでは、このフィルターは組み込みの <code>_english_</code> 辞書を使用します。これを上書きまたは拡張する方法は以下の3つです:</p><ul><li><p><strong>組み込み辞書</strong> – 事前定義された辞書を使用するには、以下の言語エイリアスのいずれかを指定します:</p><p><code>"_english_"</code>, <code>"_danish_"</code>, <code>"_dutch_"</code>, <code>"_finnish_"</code>, <code>"_french_"</code>, <code>"_german_"</code>, <code>"_hungarian_"</code>, <code>"_italian_"</code>, <code>"_norwegian_"</code>, <code>"_portuguese_"</code>, <code>"_russian_"</code>, <code>"_spanish_"</code>, <code>"_swedish_"</code></p></li><li><p><strong>カスタムリスト</strong> – 自分で定義した用語の配列を渡します（例: <code>["foo", "bar", "baz"]</code>）。</p></li><li><p><strong>混合リスト</strong> – エイリアスとカスタム用語を組み合わせます（例: <code>["of", "to", "_english_"]</code>）。</p><p>各事前定義辞書の正確な内容については、<a href="https://github.com/milvus-io/milvus/blob/master/internal/core/thirdparty/tantivy/tantivy-binding/src/analyzer/filter/stop_words.rs">stop_words</a> を参照してください。</p></li></ul></td>
   </tr>
</table>

`stop` フィルターはトークナイザーによって生成された用語に対して動作するため、トークナイザーと組み合わせて使用する必要があります。Zilliz Cloud で利用可能なトークナイザーの一覧については、[トークナイザー Reference](./analyzer-tokenizers) を参照してください。

`analyzer_params` を定義したら、コレクションスキーマを定義する際に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud はそのフィールド内のテキストを指定されたアナライザーを使って処理し、効率的なトークン化とフィルタリングを実現します。詳細については、[Example use](./analyzer-overview#example-use) を参照してください。

## 例\{#examples}

コレクションスキーマにアナライザー設定を適用する前に、`run_analyzer` メソッドを使ってその動作を検証してください。

### アナライザー設定\{#analyzer-configuration}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter":[{
        "type": "stop", # Specifies the filter type as stop
        "stop_words": ["of", "to", "_english_"], # Defines custom stop words and includes the English stop word list
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
                    put("type", "stop");
                    put("stop_words", Arrays.asList("of", "to", "_english_"));
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
        "type":       "stop",
        "stop_words": []string{"of", "to", "_english_"},
    }}}
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

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

# Sample text to analyze
sample_text = "The stop filter allows control over common stop words for text processing."

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
texts.add("The stop filter allows control over common stop words for text processing.");

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
texts := []string{"The stop filter allows control over common stop words for text processing."}
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
['The', 'stop', 'filter', 'allows', 'control', 'over', 'common', 'stop', 'words', 'text', 'processing']
```

