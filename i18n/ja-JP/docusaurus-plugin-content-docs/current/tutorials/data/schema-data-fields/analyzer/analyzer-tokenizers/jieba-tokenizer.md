---
title: "Jieba | Cloud"
slug: /jieba-tokenizer
sidebar_label: "Jieba"
beta: FALSE
notebook: FALSE
description: "`jieba` トークナイザーは、中国語のテキストを構成単語に分解して処理します。 | Cloud"
type: origin
token: JGURwBQNOijp2DkspFFctbAGnLh
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - スキーマ
  - アナライザー
  - 組み込みトークナイザー
  - jieba-tokenizer

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Jieba

`jieba` トークナイザーは、中国語のテキストを構成単語に分解して処理します。

<Admonition type="info" icon="📘" title="Notes">

<p><code>jieba</code> トークナイザーは、句読点を個別のトークンとして出力に保持します。例えば、<code>"你好！世界。"</code> は <code>["你好", "！", "世界", "。"]</code> になります。これらの独立した句読点トークンを削除するには、<a href="./remove-punct-filter"><code>removepunct</code></a> フィルターを使用します。</p>

</Admonition>

## 設定\{#configuration}

Milvus は、`jieba` トークナイザーに対して、シンプルな設定とカスタム設定の2つの設定アプローチをサポートしています。

### シンプルな設定\{#simple-configuration}

シンプルな設定では、トークナイザーを `"jieba"` に設定するだけで済みます。例：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Simple configuration: only specifying the tokenizer name
analyzer_params = {
    "tokenizer": "jieba",  # Use the default settings: dict=["_default_"], mode="search", hmm=True
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("tokenizer", "jieba");
```

</TabItem>

<TabItem value='java'>

```javascript
const analyzer_params = {
    "tokenizer": "jieba",
};
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"tokenizer": "jieba"}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
analyzerParams='{
  "tokenizer": "jieba"
}'
```

</TabItem>
</Tabs>

このシンプルな設定は、以下のカスタム設定と同等です。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Custom configuration equivalent to the simple configuration above
analyzer_params = {
    "type": "jieba",          # Tokenizer type, fixed as "jieba"
    "dict": ["_default_"],     # Use the default dictionary
    "mode": "search",          # Use search mode for improved recall (see mode details below)
    "hmm": True                # Enable HMM for probabilistic segmentation
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();
analyzerParams.put("type", "jieba");
analyzerParams.put("dict", Collections.singletonList("_default_"));
analyzerParams.put("mode", "search");
analyzerParams.put("hmm", true);
```

</TabItem>

<TabItem value='java'>

```javascript
// javascript
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams = map[string]any{"type": "jieba", "dict": []any{"_default_"}, "mode": "search", "hmm": true}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

パラメータの詳細については、[カスタム設定](./jieba-tokenizer#custom-configuration)を参照してください。

### カスタム設定\{#custom-configuration}

より詳細な制御のために、カスタム辞書を指定したり、セグメンテーションモードを選択したり、隠れマルコフモデル (HMM) を有効または無効にしたりできるカスタム設定を提供できます。例：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Custom configuration with user-defined settings
analyzer_params = {
    "tokenizer": {
        "type": "jieba",           # Fixed tokenizer type
        "dict": ["customDictionary"],  # Custom dictionary list; replace with your own terms
        "mode": "exact",           # Use exact mode (non-overlapping tokens)
        "hmm": False               # Disable HMM; unmatched text will be split into individual characters
    }
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();                                                                          
analyzerParams.put("tokenizer", new HashMap<String, Object>() {{
  put("type", "jieba");                                                                                                      
  put("dict", Arrays.asList("customDictionary"));             
  put("mode", "exact");
  put("hmm", false);
}});

```

</TabItem>

<TabItem value='java'>

```javascript
// javascript
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams := map[string]interface{}{
  "tokenizer": map[string]interface{}{
      "type": "jieba",
      "dict": []string{"customDictionary"},
      "mode": "exact",
      "hmm":  false,
  },
}
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

<table>
   <tr>
     <th><p>パラメータ</p></th>
     <th><p>説明</p></th>
     <th><p>デフォルト値</p></th>
   </tr>
   <tr>
     <td><p><code>type</code></p></td>
     <td><p>トークナイザーのタイプ。<code>"jieba"</code>に固定されています。</p></td>
     <td><p><code>"jieba"</code></p></td>
   </tr>
   <tr>
     <td><p><code>dict</code></p></td>
     <td><p>アナライザーが語彙ソースとしてロードする辞書のリスト。組み込みオプション：</p><ul><li><p><code>"_default_"</code>: エンジンの組み込みの簡体字中国語辞書をロードします。詳細については、<a href="https://github.com/messense/jieba-rs/blob/v0.6.8/src/data/dict.txt">dict.txt</a>を参照してください。</p></li><li><p><code>"_extend_default_"</code>: <code>"_default_"</code>のすべてに加えて、追加の繁体字中国語の補足辞書をロードします。詳細については、<a href="https://github.com/milvus-io/milvus/blob/v2.5.11/internal/core/thirdparty/tantivy/tantivy-binding/src/analyzer/data/jieba/dict.txt.big">dict.txt.big</a>を参照してください。</p><p>組み込み辞書と任意の数のカスタム辞書を組み合わせることもできます。例：<code>["_default_", "结巴分词器"]</code>。</p></li></ul></td>
     <td><p><code>["_default_"]</code></p></td>
   </tr>
   <tr>
     <td><p><code>mode</code></p></td>
     <td><p>セグメンテーションモード。可能な値：</p><ul><li><p><code>"exact"</code>: 最も正確な方法で文をセグメント化しようとし、テキスト分析に最適です。</p></li><li><p><code>"search"</code>: 検索エンジンでのトークン化に適した、長い単語をさらに分解してリコールを改善することで、exactモードを基盤としています。</p><p>詳細については、<a href="https://github.com/fxsjy/jieba">Jieba GitHubプロジェクト</a>を参照してください。</p></li></ul></td>
     <td><p><code>"search"</code></p></td>
   </tr>
   <tr>
     <td><p><code>hmm</code></p></td>
     <td><p>辞書にない単語の確率的セグメンテーションのために、隠れマルコフモデル（HMM）を有効にするかどうかを示すブールフラグ。</p></td>
     <td><p><code>true</code></p></td>
   </tr>
</table>

`analyzer_params`を定義した後、コレクションスキーマを定義する際に`VARCHAR`フィールドに適用できます。これにより、Zilliz Cloudはそのフィールドのテキストを、指定されたアナライザーを使用して効率的なトークン化とフィルタリングのために処理できます。詳細については、[使用例](./analyzer-overview#example-use)を参照してください。

## 例\{#examples}

アナライザー構成をコレクションスキーマに適用する前に、`run_analyzer`メソッドを使用してその動作を確認してください。

### アナライザー構成\{#analyzer-configuration}

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
analyzer_params = {
    "tokenizer": {
        "type": "jieba",
        "dict": ["结巴分词器"],
        "mode": "exact",
        "hmm": False
    }
}
```

</TabItem>

<TabItem value='java'>

```java
Map<String, Object> analyzerParams = new HashMap<>();                                                                          
analyzerParams.put("tokenizer", new HashMap<String, Object>() {{
  put("type", "jieba");                                                                                                      
  put("dict", Arrays.asList("结巴分词器"));                   
  put("mode", "exact");
  put("hmm", false);
}});
```

</TabItem>

<TabItem value='java'>

```javascript
// javascript
```

</TabItem>

<TabItem value='java'>

```go
analyzerParams := map[string]interface{}{
  "tokenizer": map[string]interface{}{
      "type": "jieba",
      "dict": []string{"结巴分词器"},
      "mode": "exact",
      "hmm":  false,
  },
}
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
sample_text = "milvus结巴分词器中文测试"

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
texts.add("milvus结巴分词器中文测试");

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
texts := []string{"milvus结巴分词器中文测试"}
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
['milvus', '结巴分词器', '中', '文', '测', '试']
```

