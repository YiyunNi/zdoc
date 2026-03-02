---
title: "線形減衰 | Cloud"
slug: /linear-decay
sidebar_label: "線形減衰"
beta: FALSE
notebook: FALSE
description: "線形減衰は、検索結果において絶対的なゼロ地点で終了する直線的な減衰を作成します。これは、関連性がイベントが過ぎるまで徐々に薄れていく今後のイベントのカウントダウンのように、線形減衰は、アイテムが理想的なポイントから離れるにつれて、関連性を予測可能かつ着実に減少させ、最終的に完全に消滅させます。このアプローチは、明確なカットオフを持つ一貫した減衰率が必要な場合に理想的であり、特定の境界を超えるアイテムが結果から完全に除外されることを保証します。 | Cloud"
type: origin
token: M7xHwZSIuiAP4Fkfm67cBU7Pn8g
sidebar_position: 4
keywords: 
  - zilliz
  - ベクターデータベース
  - cloud
  - collection
  - データ
  - 検索結果の再ランキング
  - 結果の再ランキング
  - 減衰
  - 減衰ランカー
  - 線形減衰
  - 線形
  - マルチモーダルRAG
  - llmの幻覚
  - ハイブリッド検索
  - 語彙検索

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 線形減衰

線形減衰は、検索結果において絶対的なゼロ地点で終了する直線的な減少を作成します。イベントのカウントダウンのように、イベントが過ぎるまで関連性が徐々に薄れていくのと同様に、線形減衰は、項目が理想的な地点から離れるにつれて、完全に消滅するまで予測可能で着実な関連性の減少を適用します。このアプローチは、明確なカットオフを伴う一貫した減衰率が必要な場合に理想的であり、特定の境界を超える項目が結果から完全に除外されることを保証します。

他の減衰関数とは異なり：

- ガウス減衰は、徐々にゼロに近づくが、決してゼロに達しないベルカーブに従います。

- 指数減衰は、無限に続く最小限の関連性の長いテールを維持します。

線形減衰は、明確な終点を作成するという点でユニークであり、自然な境界や期限を持つアプリケーションに特に効果的です。

## 線形減衰を使用するタイミング{#when-to-use-linear-decay}

線形減衰は、特に以下の状況で効果的です。

<table>
   <tr>
     <th><p>ユースケース</p></th>
     <th><p>例</p></th>
     <th><p>線形がうまく機能する理由</p></th>
   </tr>
   <tr>
     <td><p>イベントリスト</p></td>
     <td><p>コンサートチケットプラットフォーム</p></td>
     <td><p>遠すぎる未来のイベントに対して明確なカットオフを作成します</p></td>
   </tr>
   <tr>
     <td><p>期間限定オファー</p></td>
     <td><p>フラッシュセール、プロモーション</p></td>
     <td><p>期限切れまたは間もなく期限切れになるオファーが表示されないようにします</p></td>
   </tr>
   <tr>
     <td><p>配送範囲</p></td>
     <td><p>食品配達、宅配サービス</p></td>
     <td><p>厳密な地理的境界を強制します</p></td>
   </tr>
   <tr>
     <td><p>年齢制限コンテンツ</p></td>
     <td><p>出会い系プラットフォーム、メディアサービス</p></td>
     <td><p>厳密な年齢閾値を設定します</p></td>
   </tr>
</table>

線形減衰は、次の場合に選択してください。

- アプリケーションに自然な境界、期限、または閾値がある場合

- 特定のポイントを超える項目が結果から完全に除外されるべきである場合

- 予測可能で一貫した関連性の低下率が必要な場合

- ユーザーが関連性の高い項目と関連性の低い項目の間に明確な区別を見るべきである場合

## 着実な減少の原則{#steady-decline-principle}

線形減衰は、正確にゼロに達するまで一定の割合で減少する直線的なドロップを作成します。このパターンは、カウントダウンタイマー、在庫の枯渇、関連性に明確な有効期限がある締め切りへの接近など、多くの日常的なシナリオで見られます。

<Admonition type="info" icon="📘" title="Notes">

<p>すべての時間パラメータ（<code>origin</code>、<code>offset</code>、<code>scale</code>）は、collectionデータの単位と同じ単位を使用する必要があります。collectionがタイムスタンプを異なる単位（ミリ秒、マイクロ秒）で保存している場合、すべてのパラメータをそれに応じて調整してください。</p>

</Admonition>

![LNwQbV5FYo7OYbxaA1VcetPgnUh](https://zdoc-images.s3.us-west-2.amazonaws.com/lnwqbv5fyo7oybxaa1vcetpgnuh.png "LNwQbV5FYo7OYbxaA1VcetPgnUh")

上記のグラフは、線形減衰がチケットプラットフォームのイベントリストにどのように影響するかを示しています。

- `origin` (現在の日付): 現在の瞬間で、関連性は最大 (1.0) です。

- `offset` (1日): 「即時イベントウィンドウ」—次の1日以内に発生するすべてのイベントは、完全な関連性スコア (1.0) を維持し、非常に差し迫ったイベントがわずかな時間差でペナルティを受けないようにします。

- `decay` (0.5): scale距離でのスコア—このパラメータは、関連性の低下率を制御します。

- `scale` (10日): 関連性がdecay値に低下する期間—10日先のイベントは、関連性スコアが半分 (0.5) になります。

直線的な曲線からわかるように、約16日以上先のイベントは関連性が正確にゼロであり、検索結果にはまったく表示されません。これにより、ユーザーが定義された時間枠内で関連する今後のイベントのみを見ることを保証する明確な境界が作成されます。

この動作は、イベント計画が通常どのように機能するかを反映しています。差し迫ったイベントが最も関連性が高く、数週間先のイベントは重要性が低下し、遠すぎる未来のイベント（またはすでに過ぎたイベント）はまったく表示されるべきではありません。

## 式{#formula}

線形減衰スコアを計算するための数式は次のとおりです。

$$
S(doc) = \max\left( \frac\{s - \max(0, |fieldvalue_{doc} - origin| - offset)}{s}, 0 \right)
$$

ここで：

$$
s = \frac {scale}{(1.0 - decay)}
$$

これを平易な言葉で分解すると：

1. フィールド値が原点からどれだけ離れているかを計算します：$|fieldvalue_{doc} - origin|$。

1. オフセット（もしあれば）を引きますが、ゼロを下回らないようにします：$\max(0, distance - offset)$。

1. scale値とdecay値からパラメータ$s$を決定します。

1. 調整された距離を$s$から引き、それを$s$で割ります。

1. 結果がゼロを下回らないようにします：$\max(result, 0)$。

$s$の計算は、scaleとdecayパラメータをスコアがゼロに達するポイントに変換します。たとえば、decay=0.5、scale=7の場合、スコアは距離=14（scale値の2倍）で正確にゼロに達します。

## 線形減衰を使用する{#use-linear-decay}

線形減衰は、Zilliz Cloudの標準的なベクトル検索とハイブリッド検索の両方の操作に適用できます。以下に、この機能を実装するための主要なコードスニペットを示します。

<Admonition type="info" icon="📘" title="Notes">

<p>減衰関数を使用する前に、減衰計算に使用される適切な数値フィールド（タイムスタンプ、距離など）を持つcollectionを作成する必要があります。collectionのセットアップ、schema定義、データ挿入を含む完全な動作例については、<a href="./tutorial-implement-time-based-ranking">Decay Ranker Tutorial</a>を参照してください。</p>

</Admonition>

### 減衰ランカーを作成する{#create-a-decay-ranker}

数値フィールド（この例では、`event_date`を現在からの秒数として）でcollectionがセットアップされたら、線形減衰ランカーを作成します。

<Admonition type="info" icon="📘" title="Notes">

<p><strong>時間単位の一貫性</strong>: 時間ベースの減衰を使用する場合、<code>origin</code>、<code>scale</code>、および<code>offset</code>パラメータがcollectionデータと同じ時間単位を使用していることを確認してください。collectionがタイムスタンプを秒単位で保存している場合、すべてのパラメータに秒を使用します。ミリ秒を使用している場合、すべてのパラメータにミリ秒を使用します。</p>

</Admonition>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import Function, FunctionType
import time

# Calculate current time
current_time = int(time.time())

# Create a linear decay ranker for event listings
# Note: All time parameters must use the same unit as your collection data
rerank = Function(
    name="event_relevance",               # Function identifier
    input_field_names=["event_date"],     # Numeric field to use
    function_type=FunctionType.RERANK,    # Function type. Must be RERANK
    params={
        "reranker": "decay",              # Specify decay reranker
        "function": "linear",             # Choose linear decay
        "origin": current_time,           # Current time (seconds, matching collection data)
        "offset": 12 * 60 * 60,           # 12 hour immediate events window (seconds)
        "decay": 0.5,                     # Half score at scale distance
        "scale": 7 * 24 * 60 * 60         # 7 days (in seconds, matching collection data)
    }
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.ranker.DecayRanker;

DecayRanker rerank = DecayRanker.builder()
        .name("event_relevance")
        .inputFieldNames(Collections.singletonList("event_date"))
        .function("linear")
        .origin(System.currentTimeMillis())
        .offset(12 * 60 * 60)
        .decay(0.5)
        .scale(7 * 24 * 60 * 60)
        .build();

```

</TabItem>

<TabItem value='javascript'>

```javascript
import { FunctionType } from "@zilliz/milvus2-sdk-node";

const rerank = {
  name: "event_relevance",
  input_field_names: ["event_date"],
  type: FunctionType.RERANK,
  params: {
    reranker: "decay",
    function: "linear",
    origin: new Date(2025, 1, 15).getTime(),
    offset: 12 * 60 * 60,
    decay: 0.5,
    scale: 7 * 24 * 60 * 60,
  },
};
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

### 標準ベクトル検索への適用{#apply-to-standard-vector-search}

ディケイランカーを定義したら、`ranker` パラメータに渡すことで、検索操作中に適用できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Apply decay ranker to vector search
result = milvus_client.search(
    collection_name,
    data=[your_query_vector],              # Replace with your query vector
    anns_field="dense",                   # Vector field to search
    limit=10,                             # Number of results
    output_fields=["title", "venue", "event_date"], # Fields to return
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
import io.milvus.v2.service.vector.request.data.FloatVec;

SearchReq searchReq = SearchReq.builder()
        .collectionName(COLLECTION_NAME)
        .data(Collections.singletonList(new FloatVec(embedding)))
        .annsField("dense")
        .limit(10)
        .outputFields(Arrays.asList("title", "venue", "event_date"))
        .functionScore(FunctionScore.builder()
                .addFunction(rerank)
                .build())
        .consistencyLevel(ConsistencyLevel.STRONG)
        .build();
SearchResp searchResp = client.search(searchReq);
```

</TabItem>

<TabItem value='javascript'>

```javascript
const result = await milvusClient.search({
  collection_name: collection_name,
  data: [your_query_vector], // Replace with your query vector
  anns_field: "dense",
  limit: 10,
  output_fields: ["title", "venue", "event_date"],
  rerank: rerank,
  consistency_level: "Strong",
});

```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

