---
title: "Lindera | BYOC"
slug: /lindera-tokenizer
sidebar_label: "Lindera"
beta: FALSE
notebook: FALSE
description: "`lindera` トークナイザーは、辞書ベースの形態素解析を実行します。日本語、韓国語、中国語のように単語がスペースで区切られていない言語に適しています。 | BYOC"
type: origin
token: PvwZwtu3FiBQNqkPa5VcqH6qnmg
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - analyzer
  - 組み込みトークナイザー
  - lindera-tokenizer
  - 自然言語処理データベース
  - 安価なベクトルデータベース
  - マネージドベクトルデータベース
  - Pinecone ベクトルデータベース

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lindera

`lindera` トークナイザーは、辞書ベースの形態素解析を実行します。日本語、韓国語、中国語など、単語がスペースで区切られていない言語に適しています。

<Admonition type="info" icon="📘" title="Notes">

<p><code>lindera</code> トークナイザーは、句読点を個別のトークンとして出力に保持します。例えば、<code>"こんにちは！"</code> は <code>["こんにちは", "！"]</code> となります。これらの独立した句読点トークンを削除するには、<a href="./remove-punct-filter"><code>removepunct</code></a> フィルターを使用してください。</p>

</Admonition>

## 設定\{#configuration}

`lindera` トークナイザーを使用してアナライザーを設定するには、`tokenizer.type` を `lindera` に設定し、`dict_kind` で辞書を選択します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": {
      "type": "lindera",
      "dict_kind": "ipadic"
    }
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer",
                new HashMap<String, Object>() {{
                    put("type", "lindera");
                    put("dict_kind", "ipadic");
                }});
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams = map[string]any{"tokenizer": map[string]any{"type": "lindera", "dict_kind": "ipadic"}}
```

</TabItem>

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

<table>
   <tr>
     <th><p>パラメーター</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>type</code></p></td>
     <td><p>トークナイザーのタイプ。<code>"lindera"</code> に固定されています。</p></td>
   </tr>
   <tr>
     <td><p><code>dict_kind</code></p></td>
     <td><p>語彙を定義するために使用される辞書。指定可能な値：</p><ul><li><p><code>ko-dic</code>: 韓国語 - 韓国語形態素辞書 (<a href="https://bitbucket.org/eunjeon/mecab-ko-dic">MeCab Ko-dic</a>)</p></li><li><p><code>ipadic</code>: 日本語 - 標準形態素辞書 (<a href="https://taku910.github.io/mecab/">MeCab IPADIC</a>)</p></li></ul></td>
   </tr>
</table>

`analyzer_params` を定義した後、collection schema を定義する際に `VARCHAR` フィールドに適用できます。これにより、Zilliz Cloud は指定された analyzer を使用してそのフィールドのテキストを処理し、効率的なトークン化とフィルタリングを行うことができます。詳細については、[使用例](./analyzer-overview#example-use) を参照してください。

## 例{#examples}

analyzer の設定を collection schema に適用する前に、`run_analyzer` メソッドを使用してその動作を確認してください。

### Analyzer の設定{#analyzer-configuration}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": {
      "type": "lindera",
      "dict_kind": "ipadic"
    }
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer",
                new HashMap<String, Object>() {{
                    put("type", "lindera");
                    put("dict_kind", "ipadic");
                }});
```

</TabItem>

<TabItem value='go'>

```go
analyzerParams = map[string]any{"tokenizer": map[string]any{"type": "lindera", "dict_kind": "ipadic"}}
```

</TabItem>

<TabItem value='javascript'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

### `run_analyzer` を使用した検証 {#verification-using-runanalyzer}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
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
sample_text = "東京スカイツリーの最寄り駅はとうきょうスカイツリー駅で"

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
texts.add("東京スカイツリーの最寄り駅はとうきょうスカイツリー駅で");

RunAnalyzerResp resp = client.runAnalyzer(RunAnalyzerReq.builder()
        .texts(texts)
        .analyzerParams(analyzerParams)
        .build());
List<RunAnalyzerResp.AnalyzerResult> results = resp.getResults();
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
texts := []string{"東京スカイツリーの最寄り駅はとうきょうスカイツリー駅で"}
option := milvusclient.NewRunAnalyzerOption(texts).
    WithAnalyzerParams(string(bs))

result, err := client.RunAnalyzer(ctx, option)
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

### 期待される出力結果\{#expected-output}

```plaintext
{tokens: ['東京', 'スカイ', 'ツリー', 'の', '最寄り駅', 'は', 'とう', 'きょう', 'スカイ', 'ツリー', '駅', 'で']} 
```
