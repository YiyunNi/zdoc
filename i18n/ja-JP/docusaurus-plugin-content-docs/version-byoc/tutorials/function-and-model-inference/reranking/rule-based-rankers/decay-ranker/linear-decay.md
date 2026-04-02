---
title: "線形減衰 | BYOC"
slug: /linear-decay
sidebar_label: "線形減衰"
beta: FALSE
notebook: FALSE
description: "線形減衰は、検索結果において絶対的なゼロ点で終了する直線的な減少を生み出します。イベントのカウントダウンが経過とともに関連性が徐々に薄れ、イベント終了時には完全に消えるのと同様に、線形減衰はアイテムが理想点から遠ざかるにつれて、関連性を予測可能かつ一定の割合で減少させ、最終的に対象外とします。この手法は、一貫した減衰率と明確なカットオフを必要とし、特定の境界を超えたアイテムを結果から完全に除外したい場合に最適です。| BYOC"
type: origin
token: M7xHwZSIuiAP4Fkfm67cBU7Pn8g
sidebar_position: 4
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
  - 線形減衰
  - Linear

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 線形減衰

線形減衰（線形 decay）は、検索結果において明確なゼロ地点で終了する直線的な低下を実現します。例えば、今後のイベントのカウントダウンのように、関連性が徐々に薄れていき、イベントが終了すると完全に消えるような挙動です。線形減衰は、理想的なポイントから離れるにつれて予測可能かつ一定の割合で関連性を低下させ、ある境界を超えたアイテムを完全に結果から除外します。この手法は、一貫した減衰率と明確なカットオフを必要とする場合に最適です。

他の減衰関数とは異なります：

- ガウス減衰（ガウス decay）はベル曲線に従い、ゼロに近づくものの決してゼロにはなりません。
- 指数減衰（指数 decay）は、無限に続くわずかな関連性の「長い尾」を維持します。

線形減衰は、明確な終点を作り出すという点で他と一線を画しており、自然な境界や締切のあるアプリケーションに特に効果的です。

## 線形減衰を使うべきタイミング\{#when-to-use-linear-decay}

線形減衰は、以下のケースに特に有効です：

<table>
   <tr>
     <th><p>ユースケース</p></th>
     <th><p>例</p></th>
     <th><p>線形減衰が適している理由</p></th>
   </tr>
   <tr>
     <td><p>イベント一覧</p></td>
     <td><p>コンサートチケットプラットフォーム</p></td>
     <td><p>遠すぎる未来のイベントを明確に除外できる</p></td>
   </tr>
   <tr>
     <td><p>期間限定オファー</p></td>
     <td><p>フラッシュセール、プロモーション</p></td>
     <td><p>期限切れまたは間もなく期限を迎えるオファーを表示しないようにできる</p></td>
   </tr>
   <tr>
     <td><p>配達範囲</p></td>
     <td><p>フードデリバリー、宅配サービス</p></td>
     <td><p>地理的なハードルールを適用できる</p></td>
   </tr>
   <tr>
     <td><p>年齢制限コンテンツ</p></td>
     <td><p>マッチングアプリ、メディアサービス</p></td>
     <td><p>明確な年齢閾値を設定できる</p></td>
   </tr>
</table>

以下のような場合に線形減衰を選択してください：

- アプリケーションに自然な境界、締切、または閾値がある場合
- あるポイントを超えたアイテムを結果から完全に除外したい場合
- 関連性の低下を予測可能かつ一貫したレートで行いたい場合
- ユーザーに対して関連あり・なしの明確な区切りを見せたい場合

## 一定低下の原則\{#steady-decline-principle}

線形減衰は、一定の割合で直線的に低下し、正確にゼロに到達します。このパターンは、カウントダウンタイマー、在庫の減少、締切の近づきなど、関連性に明確な「期限」がある日常的なシナリオによく見られます。

<Admonition type="info" icon="📘" title="Notes">

<p>すべての時間パラメータ（<code>origin</code>、<code>offset</code>、<code>scale</code>）は、コレクションのデータと同じ単位を使用する必要があります。コレクションがミリ秒やマイクロ秒などの異なる単位でタイムスタンプを保存している場合は、すべてのパラメータをそれに合わせて調整してください。</p>

</Admonition>

![LNwQbV5FYo7OYbxaA1VcetPgnUh](https://zdoc-images.s3.us-west-2.amazonaws.com/lnwqbv5fyo7oybxaa1vcetpgnuh.png "LNwQbV5FYo7OYbxaA1VcetPgnUh")

上記のグラフは、チケット販売プラットフォームにおけるイベント一覧への線形減衰の影響を示しています：

- `origin`（現在日時）：関連性が最大（1.0）となる現在時点。
- `offset`（1日）：「直近イベントウィンドウ」— 今後1日以内に開催されるイベントは、わずかな時間差によるペナルティを受けず、関連性スコアが1.0のまま維持されます。
- `decay`（0.5）：スケール距離におけるスコア — このパラメータが関連性の低下速度を制御します。
- `scale`（10日）：関連性がdecay値まで低下するまでの期間 — 10日先のイベントは、関連性スコアが半分（0.5）になります。

直線的なカーブから分かるように、約16日以上先のイベントは関連性が完全にゼロとなり、検索結果に一切表示されません。これにより明確な境界が設けられ、ユーザーには定義された時間枠内の関連イベントのみが表示されます。

この挙動は、通常のイベント計画の考え方と一致します — 直近のイベントが最も関連性が高く、数週間先のイベントは次第に重要度が下がり、遠すぎる未来（またはすでに過去）のイベントは表示されるべきではありません。

## 数式\{#formula}

線形減衰スコアを計算するための数式は次のとおりです：

$$
S(doc) = \max\left( \frac{s - \max(0, |fieldvalue_{doc} - origin| - offset)}{s}, 0 \right)
$$

ここで：

$$
s = \frac {scale}{(1.0 - decay)}
$$

これを平易な言葉で分解すると：

1. フィールド値がoriginからどれだけ離れているかを計算：$|fieldvalue_{doc} - origin|$。
2. offset（ある場合）を引きますが、ゼロ未満にはならないようにする：$\max(0, distance - offset)$。
3. scaleとdecayの値からパラメータ $s$ を算出。
4. 調整済みの距離を $s$ から引き、それを $s$ で割る。
5. 結果がゼロ未満にならないようにする：$\max(result, 0)$。

$s$ の計算により、scaleとdecayパラメータがスコアがゼロになる地点に変換されます。たとえば、decay=0.5、scale=7の場合、スコアは距離=14（scaleの2倍）でちょうどゼロになります。

## 線形減衰の使用方法\{#use-linear-decay}

線形減衰は、Zilliz Cloudの標準ベクトル検索およびハイブリッド検索の両方に適用できます。以下に、この機能を実装するための主要なコードスニペットを示します。

<Admonition type="info" icon="📘" title="Notes">

<p>減衰関数を使用する前に、まず減衰計算に使用する数値フィールド（タイムスタンプや距離など）を含むコレクションを作成しておく必要があります。コレクションのセットアップ、スキーマ定義、データ挿入を含む完全な動作例については、<a href="./tutorial-implement-time-based-ranking">Decay Ranker Tutorial</a>を参照してください。</p>

</Admonition>

### 減衰ランカーの作成\{#create-a-decay-ranker}

コレクションに数値フィールド（この例では、現在からの秒数で表される `event_date`）を設定した後、線形減衰ランカーを作成します：

<Admonition type="info" icon="📘" title="Notes">

<p><strong>時間単位の一貫性</strong>：時間ベースの減衰を使用する際は、<code>origin</code>、<code>scale</code>、<code>offset</code> パラメータがコレクションのデータと同じ時間単位を使用していることを確認してください。コレクションがタイムスタンプを秒単位で保存している場合は、すべてのパラメータを秒単位で指定します。ミリ秒を使用している場合は、すべてミリ秒で指定します。</p>

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

<TabItem value='java'>

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

<TabItem value='java'>

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

