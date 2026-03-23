---
title: "Stemmer | Cloud"
slug: /stemmer-filter
sidebar_label: "Stemmer"
beta: FALSE
notebook: FALSE
description: "`stemmer` フィルターは、単語をその基本形または語幹（ステミングとして知られる）に還元し、異なる活用形を持つ単語間で類似の意味を持つ単語をより簡単に一致させることができます。`stemmer` フィルターは複数の言語をサポートしており、さまざまな言語コンテキストで効果的な検索とインデックス作成を可能にします。 | Cloud"
type: origin
token: JksSwTwJPidjsnk18Olc2TjWnZe
sidebar_position: 9
keywords: 
  - Zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - アナライザー
  - 組み込みフィルター
  - stemmer

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Stemmer

`stemmer` フィルターは、単語をその基本形または語根形（ステミングとして知られる）に還元し、異なる活用形を持つ単語をより簡単に一致させることができます。`stemmer` フィルターは複数の言語をサポートしており、さまざまな言語コンテキストで効果的な検索とインデックス作成を可能にします。

## 設定\{#configuration}

`stemmer` フィルターは Zilliz Cloud のカスタムフィルターです。これを使用するには、フィルターの設定で`"type": "stemmer"`を指定し、ステミングに必要な言語を選択するための`language`パラメーターも指定します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter":[{
        "type": "stemmer", # Specifies the filter type as stemmer
        "language": "english", # Sets the language for stemming to English
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
                    put("type", "stemmer");
                    put("language", "english");
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
        "type": "stemmer", // Specifies the filter type as stop
        "language": "english", 
    }],
};
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "standard",
    "filter": []any{map[string]any{
        "type":     "stemmer",
        "language": "english",
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
      "type": "stemmer",
      "language": "english"
    }
  ]
}'

```

</TabItem>
</Tabs>

`stemmer` フィルターは、以下の設定可能なパラメーターを受け入れます。

<table>
   <tr>
     <th><p>パラメーター</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>language</code></p></td>
     <td><p>ステミング処理の言語を指定します。サポートされている言語は次のとおりです: <code>"arabic"</code>, <code>"danish"</code>, <code>"dutch"</code>, <code>"english"</code>, <code>"finnish"</code>, <code>"french"</code>, <code>"german"</code>, <code>"greek"</code>, <code>"hungarian"</code>, <code>"italian"</code>, <code>"norwegian"</code>, <code>"portuguese"</code>, <code>"romanian"</code>, <code>"russian"</code>, <code>"spanish"</code>, <code>"swedish"</code>, <code>"tamil"</code>, <code>"turkish"</code></p></td>
   </tr>
</table>

`stemmer` フィルターはトークナイザーによって生成された用語に対して動作するため、トークナイザーと組み合わせて使用する必要があります。

`analyzer_params` を定義した後、コレクションスキーマを定義する際に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud は、効率的なトークン化とフィルタリングのために、指定されたアナライザーを使用してそのフィールドのテキストを処理できます。詳細については、[使用例](./analyzer-overview#example-use) を参照してください。

## 例\{#examples}

アナライザー設定をコレクションスキーマに適用する前に、`run_analyzer` メソッドを使用してその動作を確認してください。

### アナライザー設定\{#analyzer-configuration}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": "standard",
    "filter":[{
        "type": "stemmer", # Specifies the filter type as stemmer
        "language": "english", # Sets the language for stemming to English
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
                    put("type", "stemmer");
                    put("language", "english");
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
        "type":     "stemmer",
        "language": "english",
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
      "type": "stemmer",
      "language": "english"
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
sample_text = "running runs looked ran runner"

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
texts.add("running runs looked ran runner");

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
texts := []string{"running runs looked ran runner"}
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
not support yet
```

</TabItem>
</Tabs>

### 期待される出力\{#expected-output}

```python
['run', 'run', 'look', 'ran', 'runner']
```

