---
title: "指数減衰 | BYOC"
slug: /exponential-decay
sidebar_label: "指数減衰"
beta: FALSE
notebook: FALSE
description: "指数減衰は、検索結果において初期に急激な低下が生じ、その後に長い尾部が続くようにします。これは、関連性が最初は急速に低下するものの、一部のストーリーは時間とともに重要性を保つニュース速報のサイクルに似ています。指数減衰は、理想的な範囲をわずかに超えたアイテムに厳しいペナルティを課しつつ、遠方のアイテムも発見可能に保ちます。このアプローチは、近接性や最新性を強く優先したい場合でも、より遠方のオプションを完全に排除したくない場合に最適です。| BYOC"
type: origin
token: FbVmwmuaei9WkIkIWJmcs3ManEd
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - data
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

指数減衰（指数 decay）は、検索結果において急激な初期低下と長いテールを生み出します。ニュース速報のように、関連性が最初に急速に低下しても一部の記事が時間経過後も重要性を保ち続けるようなケースに例えられます。指数減衰は、理想的な範囲からわずかに外れたアイテムに対して厳しいペナルティを適用しつつ、より離れたアイテムも発見可能に保ちます。このアプローチは、近接性や新鮮さを強く優先したいが、遠く離れた選択肢を完全に除外したくない場合に最適です。

他の減衰関数とは異なります：

- ガウス減衰（ガウス decay）は、より緩やかなベル型の減少を生み出します
- 線形減衰（線形 decay）は、ゼロに到達するまで一定の割合で減少します

指数減衰は、ペナルティを「前倒し」に適用する点で特徴的です。関連性の大部分を初期段階で削減しつつ、最小限ではあるもののゼロではない関連性を長いテールとして維持します。

## 指数減衰を使用するタイミング\{#when-to-use-exponential-decay}

指数減衰は、次のようなケースで特に効果的です：

<table>
   <tr>
     <th><p>ユースケース</p></th>
     <th><p>例</p></th>
     <th><p>指数減衰が適している理由</p></th>
   </tr>
   <tr>
     <td><p>ニュースフィード</p></td>
     <td><p>速報ニュースポータル</p></td>
     <td><p>古いニュースの関連性を素早く低下させつつ、数日前の重要なニュースも表示し続ける</p></td>
   </tr>
   <tr>
     <td><p>ソーシャルメディアのタイムライン</p></td>
     <td><p>アクティビティフィード、ステータス更新</p></td>
     <td><p>新しいコンテンツを強調しつつ、バイラルになった古いコンテンツも表示可能にする</p></td>
   </tr>
   <tr>
     <td><p>通知システム</p></td>
     <td><p>アラートの優先順位付け</p></td>
     <td><p>最近のアラートに緊急性を持たせつつ、重要なアラートの可視性を維持する</p></td>
   </tr>
   <tr>
     <td><p>フラッシュセール</p></td>
     <td><p>期間限定オファー</p></td>
     <td><p>締切が近づくにつれて可視性を急速に低下させる</p></td>
   </tr>
</table>

次のような場合に指数減衰を選択してください：

- ユーザーが非常に新しい、または近接したアイテムが結果を強く支配することを期待している場合
- 古い、またはより離れたアイテムであっても、極めて関連性が高い場合は引き続き発見可能であるべき場合
- 関連性の低下が「前倒し」になるべき場合（最初に急激に低下し、その後は緩やかになる）

## 急激なドロップオフの原則\{#sharp-drop-off-principle}

指数減衰は、最初に急激に低下し、その後徐々にフラットになってゼロに近づきながらも決してゼロに到達しない長いテールを形成する曲線を生成します。この数学的パターンは、放射性崩壊、人口減少、時間経過に伴う情報の関連性など、自然現象にも頻繁に見られます。

<Admonition type="info" icon="📘" title="Notes">

<p>すべての時間パラメータ（<code>origin</code>、<code>offset</code>、<code>scale</code>）は、コレクションデータと同じ単位を使用する必要があります。コレクションが異なる単位（ミリ秒、マイクロ秒など）でタイムスタンプを格納している場合、すべてのパラメータをそれに合わせて調整してください。</p>

</Admonition>

![YaRsbolv9oqomcxrFe5cXBa4nNg](https://zdoc-images.s3.us-west-2.amazonaws.com/yarsbolv9oqomcxrfe5cxba4nng.png "YaRsbolv9oqomcxrFe5cXBa4nNg")

上記のグラフは、デジタルニュースプラットフォームにおけるニュース記事ランキングへの指数減衰の影響を示しています：

- `origin`（現在時刻）：関連性が最大（1.0）となる現在の瞬間。
- `offset`（3時間）：「速報ニュースウィンドウ」—過去3時間以内に公開されたすべての記事は、関連性スコアが1.0のまま維持され、ごくわずかな時間差のために最新ニュースが不必要にペナルティを受けないようになります。
- `decay`（0.5）：スケール距離におけるスコア—このパラメータは、時間が経過するにつれてスコアがどれほど劇的に低下するかを制御します。
- `scale`（24時間）：関連性がdecay値に低下する時間間隔—ちょうど24時間前のニュース記事は、関連性スコアが半分（0.5）になります。

この曲線から分かるように、24時間を超えるニュース記事は関連性がさらに低下し続けますが、決してゼロにはなりません。数日前の記事であっても最小限の関連性を維持しており、重要な古いニュースがフィードに表示され続ける可能性があります（ただし、ランクは低くなります）。

この挙動は、ニュースの関連性が通常どのように機能するかを模倣しています—非常に新しい記事が強く支配しますが、ユーザーの興味に極めて関連性が高い重要な古い記事も突破して表示される可能性があります。

## 数式\{#formula}

指数減衰スコアを計算するための数式は次のとおりです：

$$
S(doc) = \exp\left( \lambda \cdot \max\left(0, \left|fieldvalue_{doc} - origin\right| - offset \right) \right)
$$

ここで：

$$
\lambda = \frac{\ln(decay)}{scale}
$$

これを平易な言葉で分解すると：

1. フィールド値がoriginからどれだけ離れているかを計算：$|fieldvalue_{doc} - origin|$。
1. offset（ある場合）を引きますが、ゼロ未満にはなりません：$\max(0, distance - offset)$。
1. $\lambda$（scaleおよびdecayパラメータから計算されます）を掛けます。
1. 指数を取ることで、0〜1の値を得ます：$\exp(\lambda \cdot value)$。

$\lambda$ の計算により、scaleおよびdecayパラメータが指数関数のレートパラメータに変換されます。$\lambda$ がより負の値になるほど、初期の急激な低下が大きくなります。

## 指数減衰の使用\{#use-exponential-decay}

指数減衰は、Zilliz Cloudの標準ベクトル検索およびハイブリッド検索の両方に適用できます。以下に、この機能を実装するための主要なコードスニペットを示します。

<Admonition type="info" icon="📘" title="Notes">

<p>減衰関数を使用する前に、まず減衰計算に使用する数値フィールド（タイムスタンプや距離など）を含むコレクションを作成しておく必要があります。コレクションのセットアップ、スキーマ定義、データ挿入を含む完全な動作例については、<a href="./tutorial-implement-time-based-ranking">Decay Ranker Tutorial</a>を参照してください。</p>

</Admonition>

### 減衰ランカーの作成\{#create-a-decay-ranker}

コレクションに数値フィールド（この例では `publish_time`）を設定した後、指数減衰ランカーを作成します：

<Admonition type="info" icon="📘" title="Notes">

<p><strong>時間単位の一貫性</strong>：時間ベースの減衰を使用する場合、<code>origin</code>、<code>scale</code>、<code>offset</code> パラメータがコレクションデータと同じ時間単位を使用していることを確認してください。コレクションがタイムスタンプを秒単位で格納している場合は、すべてのパラメータを秒単位で指定します。ミリ秒を使用している場合は、すべてのパラメータをミリ秒単位で指定します。</p>

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

減衰ランカーを定義した後、検索操作時に `ranker` パラメータにそれを渡すことで適用できます：

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

