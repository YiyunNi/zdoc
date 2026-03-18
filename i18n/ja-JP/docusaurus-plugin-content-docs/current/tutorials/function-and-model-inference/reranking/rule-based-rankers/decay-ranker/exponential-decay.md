---
title: "指数減衰 | Cloud"
slug: /exponential-decay
sidebar_label: "指数減衰"
beta: FALSE
notebook: FALSE
description: "指数減衰は、検索結果において急激な初期の低下に続いて長いテールを生成します。関連性が最初は急速に低下するものの、一部のストーリーは時間の経過とともに重要性を保持する速報ニュースサイクルと同様に、指数減衰は理想的な範囲をわずかに超えるアイテムに厳しいペナルティを適用しつつ、遠くのアイテムも発見可能に保ちます。このアプローチは、近接性や新しさを強く優先したいが、より遠いオプションを完全に排除したくない場合に理想的です。 | Cloud"
type: origin
token: FbVmwmuaei9WkIkIWJmcs3ManEd
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - コレクション
  - データ
  - 検索結果の再ランキング
  - 結果の再ランキング
  - 減衰
  - 減衰ランカー
  - 指数減衰
  - exp

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 指数減衰

指数減衰は、検索結果において急激な初期の低下とその後の長いテールを生成します。関連性が最初は急速に低下するものの、一部のストーリーは時間の経過とともに重要性を保持する速報ニュースサイクルと同様に、指数減衰は理想的な範囲をわずかに超えるアイテムに厳しいペナルティを適用しつつ、遠く離れたアイテムも発見可能に保ちます。このアプローチは、近接性や最新性を強く優先したいが、より遠いオプションを完全に排除したくない場合に理想的です。

他の減衰関数とは異なり、次の特徴があります。

- ガウス減衰は、より緩やかなベル型の低下を生成します。

- 線形減衰は、正確にゼロに達するまで一定の割合で減少します。

指数減衰は、ペナルティを「前倒し」で適用し、関連性の低下の大部分を早期に適用しつつ、最小限ではあるがゼロではない関連性の長いテールを維持するという点で独特です。

## 指数減衰を使用するタイミング\{#when-to-use-exponential-decay}

指数減衰は、特に以下の状況で効果的です。

<table>
   <tr>
     <th><p>ユースケース</p></th>
     <th><p>例</p></th>
     <th><p>指数減衰がうまく機能する理由</p></th>
   </tr>
   <tr>
     <td><p>ニュースフィード</p></td>
     <td><p>速報ニュースポータル</p></td>
     <td><p>古いニュースの関連性を迅速に低下させつつ、数日前の重要な記事も表示する</p></td>
   </tr>
   <tr>
     <td><p>ソーシャルメディアのタイムライン</p></td>
     <td><p>アクティビティフィード、ステータス更新</p></td>
     <td><p>新しいコンテンツを強調しつつ、バイラルな古いコンテンツも浮上させる</p></td>
   </tr>
   <tr>
     <td><p>通知システム</p></td>
     <td><p>アラートの優先順位付け</p></td>
     <td><p>最近のアラートに緊急性を持たせつつ、重要なアラートの可視性を維持する</p></td>
   </tr>
   <tr>
     <td><p>フラッシュセール</p></td>
     <td><p>期間限定オファー</p></td>
     <td><p>締め切りが近づくにつれて可視性を急速に低下させる</p></td>
   </tr>
</table>

指数減衰を選択するのは、次のような場合です。

- ユーザーが非常に最近のアイテムまたは近くのアイテムが結果を強く支配することを期待している場合

- 古いアイテムまたは遠いアイテムが、非常に適切であればまだ発見可能であるべき場合

- 関連性の低下が前倒しであるべき場合（最初は急勾配で、その後は緩やかになる）

## 急激な低下の原則\{#sharp-drop-off-principle}

指数減衰は、最初は急速に低下し、その後徐々に平坦になり、ゼロに近づくが決してゼロにはならない長いテールを形成する曲線を作成します。この数学的パターンは、放射性崩壊、人口減少、時間の経過に伴う情報の関連性など、自然現象で頻繁に現れます。

<Admonition type="info" icon="📘" title="Notes">

<p>すべての時間パラメータ（<code>origin</code>、<code>offset</code>、<code>scale</code>）は、コレクションデータと同じ単位を使用する必要があります。コレクションがタイムスタンプを異なる単位（ミリ秒、マイクロ秒）で保存している場合、すべてのパラメータをそれに応じて調整してください。</p>

</Admonition>

![YaRsbolv9oqomcxrFe5cXBa4nNg](https://zdoc-images.s3.us-west-2.amazonaws.com/yarsbolv9oqomcxrfe5cxba4nng.png "YaRsbolv9oqomcxrFe5cXBa4nNg")

上記のグラフは、デジタルニュースプラットフォームにおけるニュース記事のランキングに指数減衰がどのように影響するかを示しています。

- `origin`（現在の時間）：関連性が最大（1.0）である現在。

- `offset`（3時間）：「速報ニュースウィンドウ」—過去3時間以内に公開されたすべての記事は、完全な関連性スコア（1.0）を維持し、ごく最近のニュースがわずかな時間差で不必要にペナルティを受けることを防ぎます。

- `decay`（0.5）：スケール距離でのスコア—このパラメータは、スコアが時間とともにどれだけ劇的に減少するかを制御します。

- `scale`（24時間）：関連性が減衰値に低下する期間—正確に24時間前のニュース記事は、関連性スコアが半分（0.5）になります。

曲線からわかるように、24時間以上前のニュース記事は関連性が低下し続けますが、ゼロに達することはありません。数日前の記事でさえ、最小限の関連性を保持しているため、重要ではあるが古いニュースがフィードに表示される可能性があります（ただし、ランキングは低くなります）。

この動作は、ニュースの関連性が通常どのように機能するかを模倣しています。ごく最近のストーリーが強く支配しますが、重要な古いストーリーも、ユーザーの興味に非常に適切であれば、まだ浮上することができます。

## 数式\{#formula}

指数減衰スコアを計算するための数学式は次のとおりです。

$$
S(doc) = \exp\left( \lambda \cdot \max\left(0, \left|fieldvalue_{doc} - origin\right| - offset \right) \right)
$$

ここで、

$$
\lambda = \frac\{\ln(decay)}{scale}
$$

これを平易な言葉で分解すると、次のようになります。

1. フィールド値が原点からどれだけ離れているかを計算します: $|fieldvalue_{doc} - origin|$。

1. オフセット（もしあれば）を減算しますが、ゼロを下回ることはありません: $\max(0, distance - offset)$。

1. スケールと減衰パラメータから計算された $\lambda$ を掛けます。

1. 指数を取ると、0から1の間の値が得られます: $\exp(\lambda \cdot value)$。

$\lambda$ の計算は、スケールと減衰パラメータを指数関数のレートパラメータに変換します。より負の $\lambda$ は、より急な初期の低下を生成します。

## 指数減衰を使用する\{#use-exponential-decay}

指数減衰は、Zilliz Cloud の標準ベクトル検索とハイブリッド検索の両方の操作に適用できます。以下に、この機能を実装するための主要なコードスニペットを示します。

<Admonition type="info" icon="📘" title="Notes">

<p>減衰関数を使用する前に、まず、減衰計算に使用される適切な数値フィールド（タイムスタンプ、距離など）を持つコレクションを作成する必要があります。コレクションのセットアップ、スキーマ定義、データ挿入を含む完全な動作例については、<a href="./tutorial-implement-time-based-ranking">減衰ランカーチュートリアル</a>を参照してください。</p>

</Admonition>

### 減衰ランカーを作成する\{#create-a-decay-ranker}

数値フィールド（この例では `publish_time`）でコレクションが設定されたら、指数減衰ランカーを作成します。

<Admonition type="info" icon="📘" title="Notes">

<p><strong>時間単位の一貫性</strong>: 時間ベースの減衰を使用する場合、<code>origin</code>、<code>scale</code>、および <code>offset</code> パラメータがコレクションデータと同じ時間単位を使用していることを確認してください。コレクションがタイムスタンプを秒単位で保存している場合、すべてのパラメータに秒を使用します。ミリ秒を使用している場合、すべてのパラメータにミリ秒を使用します。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import Function, FunctionType
import datetime

# Create an exponential decay ranker for news recency
# Note: All time parameters must use the same unit as your collection data
rerank = Function(
    name="news_recency",                  # Function identifier
    input_field_names=["publish_time"],   # Numeric field to use
    function_type=FunctionType.RERANK,    # Function type. Must be RERANK
    params={
        "reranker": "decay",              # Specify decay reranker
        "function": "exp",                # Choose exponential decay
        "origin": int(datetime.datetime.now().timestamp()),  # Current time (seconds, matching collection data)
        "offset": 3 * 60 * 60,            # 3 hour breaking news window (seconds)
        "decay": 0.5,                     # Half score at scale distance
        "scale": 24 * 60 * 60             # 24 hours (in seconds, matching collection data)
    }
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.ranker.DecayRanker;

DecayRanker rerank = DecayRanker.builder()
        .name("news_recency")
        .inputFieldNames(Collections.singletonList("publish_time"))
        .function("exp")
        .origin(System.currentTimeMillis())
        .offset(3 * 60 * 60)
        .decay(0.5)
        .scale(24 * 60 * 60)
        .build();

```

</TabItem>

<TabItem value='java'>

```javascript

import { FunctionType } from "@zilliz/milvus2-sdk-node";

const rerank = {
  name: "news_recency",
  input_field_names: ["publish_time"],
  type: FunctionType.RERANK,
  params: {
    reranker: "decay",
    function: "exp",
    origin: new Date(2025, 1, 15).getTime(),
    offset: 3 * 60 * 60,
    decay: 0.5,
    scale: 24 * 60 * 60,
  },
};

```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

### 標準ベクトル検索への適用\{#apply-to-standard-vector-search}

ディケイランカーを定義したら、`ranker` パラメータに渡すことで、検索操作中に適用できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Apply decay ranker to vector search
result = milvus_client.search(
    collection_name,
    data=[your_query_vector],             # Replace with your query vector
    anns_field="dense",                   # Vector field to search
    limit=10,                             # Number of results
    output_fields=["title", "publish_time"], # Fields to return
    #  highlight-next-line
    ranker=rerank,                        # Apply the decay ranker
    consistency_level="Strong"
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.common.ConsistencyLevel;
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.response.SearchResp;
import io.milvus.v2.service.vector.request.data.EmbeddedText;

SearchReq searchReq = SearchReq.builder()
        .collectionName(COLLECTION_NAME)
        .data(Collections.singletonList(new EmbeddedText("market analysis")))
        .annsField("vector_field")
        .limit(10)
        .outputFields(Arrays.asList("title", "publish_time"))
        .functionScore(FunctionScore.builder()
                .addFunction(rerank)
                .build())
        .consistencyLevel(ConsistencyLevel.STRONG)
        .build();
SearchResp searchResp = client.search(searchReq);
```

</TabItem>

<TabItem value='java'>

```javascript
import { FunctionType MilvusClient } from "@zilliz/milvus2-sdk-node";

const milvusClient = new MilvusClient("YOUR_CLUSTER_ENDPOINT");

const result = await milvusClient.search({
  collection_name: collection_name,
  data: [your_query_vector], // Replace with your query vector
  anns_field: "dense",
  limit: 10,
  output_fields: ["title", "publish_time"],
  rerank: rerank,
  consistency_level: "Strong",
});

```

</TabItem>

<TabItem value='java'>

```go
// go
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

