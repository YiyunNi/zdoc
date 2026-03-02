---
title: "Decay Ranker の概要 | Cloud"
slug: /decay-ranker-oveview
sidebar_label: "Decay Ranker の概要"
beta: FALSE
notebook: FALSE
description: "従来のベクトル検索では、結果は純粋にベクトル類似度、つまり数学的空間でベクトルがどれだけ一致するかによってランク付けされます。しかし、実際のアプリケーションでは、コンテンツを真に適切にするものは、意味的類似度だけではありません。 | Cloud"
type: origin
token: QZYhwcQhWigYTVkLnHeczkwYnZb
sidebar_position: 1
keywords: 
  - zilliz
  - vector database
  - cloud
  - collection
  - data
  - 検索結果の再ランキング
  - 結果の再ランキング
  - decay
  - decay ranker
  - decay ranker の概要
  - ベクトルデータベースの比較
  - Faiss
  - ビデオ検索
  - AI Hallucination

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Decay Rankerの概要

従来のベクトル検索では、結果は純粋にベクトル類似度、つまり数学的空間でベクトルがどれだけ一致するかによってランク付けされます。しかし、実際のアプリケーションでは、コンテンツが真にどれだけ関連性があるかは、意味的類似度だけでは決まらないことがよくあります。

次のような日常的なシナリオを考えてみましょう。

- 昨日の記事が3年前の類似記事よりも上位にランク付けされるべきニュース検索

- 30分かかる場所よりも5分圏内の会場を優先するレストラン検索

- 検索クエリとの類似度がわずかに低くても、トレンド商品を上位表示するeコマースプラットフォーム

これらのシナリオはすべて、ベクトル類似度と、時間、距離、人気などの他の数値要素とのバランスを取るという共通のニーズを共有しています。

Zilliz CloudのDecay Rankerは、数値フィールドの値に基づいて検索ランキングを調整することで、このニーズに対応します。これにより、ベクトル類似度とデータの「鮮度」、「近さ」、またはその他の数値プロパティとのバランスを取り、より直感的で文脈に関連性の高い検索エクスペリエンスを作成できます。

## 使用上の注意点{#usage-notes}

- Decay Rankingは、グループ化検索では使用できません。

- Decay Rankingに使用するフィールドは数値型（`INT8`、`INT16`、`INT32`、`INT64`、`FLOAT`、または`DOUBLE`）である必要があります。

- 各Decay Rankerは、1つの数値フィールドのみを使用できます。

- **時間単位の一貫性**: 時間ベースのDecay Rankingを使用する場合、`origin`、`scale`、および`offset`パラメーターの単位は、コレクションデータで使用されている単位と一致する必要があります。

    - コレクションがタイムスタンプを**秒**で保存している場合、すべてのパラメーターに秒を使用します。

    - コレクションがタイムスタンプを**ミリ秒**で保存している場合、すべてのパラメーターにミリ秒を使用します。

    - コレクションがタイムスタンプを**マイクロ秒**で保存している場合、すべてのパラメーターにマイクロ秒を使用します。

## 仕組み{#how-it-works}

Decay Rankingは、時間や地理的距離などの数値要素をランキングプロセスに組み込むことで、従来のベクトル検索を強化します。プロセス全体は次の段階で構成されます。

### ステージ1: 正規化された類似度スコアの計算{#stage-1-calculate-normalized-similarity-scores}

まず、Zilliz Cloudはベクトル類似度スコアを計算し、一貫した比較を確実にするために正規化します。

- **L2**および**JACCARD**距離メトリックの場合（値が小さいほど類似度が高いことを示します）: 

    ```plaintext
    normalized_score = 1.0 - (2 × arctan(score))/π
    ```

    これにより、距離が0〜1の類似度スコアに変換され、スコアが高いほど良好であることを示します。

- **IP**、**COSINE**、および**BM25**メトリックの場合（スコアが高いほど一致が良いことをすでに示しています）：スコアは正規化されずに直接使用されます。

### ステージ2：減衰スコアの計算{#stage-2-calculate-decay-scores}

次に、Zilliz Cloudは、選択した減衰ランカーを使用して、数値フィールド値（タイムスタンプや距離など）に基づいて減衰スコアを計算します。

- 各減衰ランカーは、生の数値値を0〜1の正規化された関連性スコアに変換します。

- 減衰スコアは、理想的な点からの「距離」に基づいてアイテムがどれだけ関連しているかを表します。

具体的な計算式は、減衰ランカーのタイプによって異なります。減衰スコアの計算方法の詳細については、[ガウス減衰](./gaussian-decay#formula)、[指数減衰](./exponential-decay#formula)、[線形減衰](./linear-decay#formula)の専用ページを参照してください。

### ステージ3：最終スコアの計算{#stage-3-compute-final-scores}

最後に、Zilliz Cloudは、正規化された類似度スコアと減衰スコアを組み合わせて、最終的なランキングスコアを生成します。

```plaintext
final_score = normalized_similarity_score × decay_score
```

ハイブリッド検索（複数のベクトルフィールドを組み合わせる）の場合、Zilliz Cloudは検索リクエストの中で正規化された類似度スコアの最大値を取ります。

```plaintext
final_score = max([normalized_score₁, normalized_score₂, ..., normalized_scoreₙ]) × decay_score
```

例えば、ハイブリッド検索で、ある研究論文がベクトル類似度で0.82、BM25ベースのテキスト検索で0.91のスコアを獲得した場合、Zilliz Cloudは減衰係数を適用する前に、0.91をベースの類似度スコアとして使用します。

### 減衰ランキングの動作例\{#decay-ranking-in-action}

時間ベースの減衰を伴う「**AI研究論文**」の検索という実用的なシナリオで、減衰ランキングを見てみましょう。

<Admonition type="info" icon="📘" title="Notes">

<p>この例では、減衰スコアは時間の経過とともに適合性がどのように減少するかを反映しています。新しい論文は1.0に近いスコアを受け取り、古い論文は低いスコアを受け取ります。これらの値は特定の減衰ランカーを使用して計算されます。詳細については、<a href="./decay-ranker-oveview#choose-the-right-decay-ranker">適切な減衰ランカーの選択</a>を参照してください。</p>

</Admonition>

<table>
   <tr>
     <th><p>論文</p></th>
     <th><p>ベクトル類似度</p></th>
     <th><p>正規化された類似度スコア</p></th>
     <th><p>発行日</p></th>
     <th><p>減衰スコア</p></th>
     <th><p>最終スコア</p></th>
     <th><p>最終順位</p></th>
   </tr>
   <tr>
     <td><p>論文A</p></td>
     <td><p>高</p></td>
     <td><p>0.85 (<code>COSINE</code>)</p></td>
     <td><p>2週間前</p></td>
     <td><p>0.80</p></td>
     <td><p>0.68</p></td>
     <td><h1 id="2">2</h1></td>
   </tr>
   <tr>
     <td><p>論文B</p></td>
     <td><p>非常に高</p></td>
     <td><p>0.92 (<code>COSINE</code>)</p></td>
     <td><p>6ヶ月前</p></td>
     <td><p>0.45</p></td>
     <td><p>0.41</p></td>
     <td><h1 id="3">3</h1></td>
   </tr>
   <tr>
     <td><p>論文C</p></td>
     <td><p>中</p></td>
     <td><p>0.75 (<code>COSINE</code>)</p></td>
     <td><p>1日前</p></td>
     <td><p>0.98</p></td>
     <td><p>0.74</p></td>
     <td><h1 id="1">1</h1></td>
   </tr>
   <tr>
     <td><p>論文D</p></td>
     <td><p>中高</p></td>
     <td><p>0.76 (<code>COSINE</code>)</p></td>
     <td><p>3週間前</p></td>
     <td><p>0.70</p></td>
     <td><p>0.53</p></td>
     <td><h1 id="4">4</h1></td>
   </tr>
</table>

減衰再ランキングがない場合、論文Bは純粋なベクトル類似度（0.92）に基づいて最も高い順位になります。しかし、減衰再ランキングが適用されると、次のようになります。

- 論文Cは、類似度が中程度であるにもかかわらず、非常に最近（昨日発行）であるため、1位に上昇します。

- 論文Bは、類似度が優れているにもかかわらず、比較的新しくないため、3位に下降します。

- 論文DはL2距離（低いほど良い）を使用するため、減衰を適用する前にスコアが1.2から0.76に正規化されます。

## 適切な減衰ランカーの選択\{#choose-the-right-decay-ranker}

Zilliz Cloudは、特定のユースケース向けに設計された、`gauss`、`exp`、`linear`という異なる減衰ランカーを提供しています。

<table>
   <tr>
     <th><p>減衰ランカー</p></th>
     <th><p>特性</p></th>
     <th><p>理想的なユースケース</p></th>
     <th><p>シナリオ例</p></th>
   </tr>
   <tr>
     <td><p>ガウス (<code>gauss</code>)</p></td>
     <td><p>自然な感覚の緩やかな減少で、適度に広がる</p></td>
     <td><ul><li><p>バランスの取れた結果を必要とする一般的な検索</p></li><li><p>ユーザーが距離を直感的に理解できるアプリケーション</p></li><li><p>適度な距離が結果を厳しく罰するべきではない場合</p></li></ul></td>
     <td><p>レストラン検索では、3km離れた質の高い店も発見可能だが、近くの店よりは順位が低い</p></td>
   </tr>
   <tr>
     <td><p>指数 (<code>exp</code>)</p></td>
     <td><p>最初は急速に減少するが、長いテールを維持する</p></td>
     <td><ul><li><p>鮮度が重要なニュースフィード</p></li><li><p>新しいコンテンツが優勢であるべきソーシャルメディア</p></li><li><p>近接性が強く好まれるが、例外的な遠方のアイテムも表示されるべき場合</p></li></ul></td>
     <td><p>ニュースアプリでは、昨日の記事は1週間前のコンテンツよりもはるかに上位にランクされるが、非常に重要な古い記事も表示される可能性がある</p></td>
   </tr>
   <tr>
     <td><p>線形 (<code>linear</code>)</p></td>
     <td><p>明確なカットオフを持つ一貫した予測可能な減少</p></td>
     <td><ul><li><p>自然な境界を持つアプリケーション</p></li><li><p>距離制限のあるサービス</p></li><li><p>有効期限や明確な閾値のあるコンテンツ</p></li></ul></td>
     <td><p>イベント検索では、2週間先の期間を超えるイベントはまったく表示されない</p></td>
   </tr>
</table>

各減衰ランカーがどのようにスコアを計算し、特定の減少パターンを示すかについての詳細は、専用のドキュメントを参照してください。

- [ガウス減衰](./gaussian-decay)

- [指数減衰](./exponential-decay)

- [線形減衰](./linear-decay)

## 実装例\{#implementation-example}

減衰ランカーは、Zilliz Cloudの標準ベクトル検索とハイブリッド検索の両方の操作に適用できます。以下に、この機能を実装するための主要なコードスニペットを示します。

<Admonition type="info" icon="📘" title="Notes">

<p>減衰関数を使用する前に、減衰計算に使用される適切な数値フィールド（タイムスタンプ、距離など）を持つcollectionを作成する必要があります。collectionのセットアップ、schema定義、データ挿入を含む完全な動作例については、<a href="./tutorial-implement-time-based-ranking">チュートリアル：Milvusで時間ベースのランキングを実装する</a>を参照してください。</p>

</Admonition>

### 減衰ランカーの作成\{#create-a-decay-ranker}

減衰ランキングを実装するには、まず適切な設定で`Function`オブジェクトを定義します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import Function, FunctionType

# Create a decay function for timestamp-based decay
# Note: All time parameters must use the same unit as your collection data
rerank = Function(
    name="time_decay",                  # Function identifier
    input_field_names=["timestamp"],    # Numeric field to use for decay
    function_type=FunctionType.RERANK,  # Must be set to RERANK for decay rankers
    params={
        "reranker": "decay",            # Specify decay reranker. Must be "decay"
        "function": "gauss",            # Choose decay function type: "gauss", "exp", or "linear"
        "origin": int(datetime.datetime(2025, 1, 15).timestamp()),    # Reference point (seconds)
        "scale": 7 * 24 * 60 * 60,      # 7 days in seconds (must match collection data unit)
        "offset": 24 * 60 * 60,         # 1 day no-decay zone (must match collection data unit)
        "decay": 0.5                    # Half score at scale distance
    }
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.ranker.DecayRanker;

import java.time.ZoneId;
import java.time.ZonedDateTime;

ZonedDateTime zdt = ZonedDateTime.of(2025, 1, 25, 0, 0, 0, 0, ZoneId.systemDefault());

DecayRanker rerank = DecayRanker.builder()
        .name("time_decay")
        .inputFieldNames(Collections.singletonList("timestamp"))
        .function("gauss")
        .origin(zdt.toInstant().toEpochMilli())
        .scale(7 * 24 * 60 * 60)
        .offset(24 * 60 * 60)
        .decay(0.5)
        .build();

```

</TabItem>

<TabItem value='javascript'>

```javascript

import {FunctionType } from "@zilliz/milvus2-sdk-node";

const rerank = {
  name: "time_decay",
  input_field_names: ["timestamp"],
  function_type: FunctionType.RERANK,
  params: {
    reranker: "decay",
    function: "gauss",
    origin: new Date(2025, 1, 15).getTime(),
    scale: 7 * 24 * 60 * 60,
    offset: 24 * 60 * 60,
    decay: 0.5,
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

<table>
   <tr>
     <th><p>パラメータ</p></th>
     <th><p>必須？</p></th>
     <th><p>説明</p></th>
     <th><p>値/例</p></th>
   </tr>
   <tr>
     <td><p><code>name</code></p></td>
     <td><p>はい</p></td>
     <td><p>検索実行時に使用される関数の識別子。ユースケースに関連する説明的な名前を選択してください。</p></td>
     <td><p><code>"time_decay"</code></p></td>
   </tr>
   <tr>
     <td><p><code>input_field_names</code></p></td>
     <td><p>はい</p></td>
     <td><p>減衰スコア計算用の数値フィールド。減衰計算に使用されるデータ属性を決定します（例：時間ベースの減衰にはタイムスタンプ、位置ベースの減衰には座標）。</p><p>関連する数値を含むcollection内のフィールドである必要があります。INT8/16/32/64、FLOAT、DOUBLEをサポートします。</p></td>
     <td><p><code>["timestamp"]</code></p></td>
   </tr>
   <tr>
     <td><p><code>function_type</code></p></td>
     <td><p>はい</p></td>
     <td><p>作成する関数のタイプを指定します。</p><p>すべての減衰rankerに対して<code>RERANK</code>に設定する必要があります。</p></td>
     <td><p><code>FunctionType.RERANK</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.reranker</code></p></td>
     <td><p>はい</p></td>
     <td><p>使用する再ランキング方法を指定します。</p><p>減衰ランキング機能を有効にするには、<code>"decay"</code>に設定する必要があります。</p></td>
     <td><p><code>"decay"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.function</code></p></td>
     <td><p>はい</p></td>
     <td><p>適用する数学的減衰rankerを指定します。関連性低下の曲線形状を決定します。</p><p>適切な関数を選択するためのガイダンスについては、「<a href="./decay-ranker-oveview#choose-the-right-decay-ranker">適切な減衰rankerの選択</a>」セクションを参照してください。</p></td>
     <td><p><code>"gauss"</code>、<code>"exp"</code>、または<code>"linear"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.origin</code></p></td>
     <td><p>はい</p></td>
     <td><p>減衰スコアが計算される参照点。この値のアイテムは最大の関連性スコアを受け取ります。</p><p>時間ベースの減衰の場合、時間単位はcollectionデータと一致する必要があります。</p></td>
     <td><ul><li><p>タイムスタンプの場合：現在の時間（例：<code>int(time.time())</code>）</p></li><li><p>地理位置情報の場合：ユーザーの現在の座標</p></li></ul></td>
   </tr>
   <tr>
     <td><p><code>params.scale</code></p></td>
     <td><p>はい</p></td>
     <td><p>関連性が<code>decay</code>値に低下する距離または時間。関連性の低下速度を制御します。</p><p>時間ベースの減衰の場合、時間単位はcollectionデータと一致する必要があります。</p><p>値が大きいほど関連性の低下は緩やかになり、値が小さいほど急になります。</p></td>
     <td><ul><li><p>時間の場合：秒単位の期間（例：7日間の場合は<code>7 * 24 * 60 * 60</code>）</p></li><li><p>距離の場合：メートル（例：5kmの場合は<code>5000</code>）</p></li></ul></td>
   </tr>
   <tr>
     <td><p><code>params.offset</code></p></td>
     <td><p>いいえ</p></td>
     <td><p><code>origin</code>の周りに「減衰なしゾーン」を作成し、アイテムが完全なスコア（減衰スコア = 1.0）を維持するようにします。</p><p>時間ベースの減衰の場合、時間単位はcollectionデータと一致する必要があります。</p><p><code>origin</code>のこの範囲内のアイテムは最大の関連性を維持します。</p></td>
     <td><ul><li><p>時間の場合：秒単位の期間（例：1日間の場合は<code>24 * 60 * 60</code>）</p></li><li><p>距離の場合：メートル（例：500mの場合は<code>500</code>）</p></li></ul></td>
   </tr>
   <tr>
     <td><p><code>params.decay</code></p></td>
     <td><p>いいえ</p></td>
     <td><p><code>scale</code>距離でのスコア値で、曲線の急峻さを制御します。値が低いほど急な低下曲線になり、値が高いほど緩やかな低下曲線になります。</p><p>0から1の間である必要があります。</p></td>
     <td><p><code>0.5</code> (デフォルト)</p></td>
   </tr>
</table>

### 標準ベクトル検索への適用{#apply-to-standard-vector-search}

減衰rankerを定義した後、`ranker`パラメータに渡すことで、検索操作中に適用できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Use the decay function in standard vector search
results = milvus_client.search(
    collection_name,
    data=[your_query_vector], # Replace with your query vector
    anns_field="vector_field",
    limit=10,
    output_fields=["document", "timestamp"],  # Include the decay field in outputs to see values
    #  highlight-next-line
    ranker=rerank,                      # Apply the decay ranker here
    consistency_level="Strong"
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.response.SearchResp;
import io.milvus.v2.service.vector.request.data.EmbeddedText;

SearchReq searchReq = SearchReq.builder()
        .collectionName(COLLECTION_NAME)
        .data(Collections.singletonList(new EmbeddedText("search query")))
        .annsField("vector_field")
        .limit(10)
        .outputFields(Arrays.asList("document", "timestamp"))
        .functionScore(FunctionScore.builder()
                .addFunction(rerank)
                .build())
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
  output_fields: ["document", "timestamp"],
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

