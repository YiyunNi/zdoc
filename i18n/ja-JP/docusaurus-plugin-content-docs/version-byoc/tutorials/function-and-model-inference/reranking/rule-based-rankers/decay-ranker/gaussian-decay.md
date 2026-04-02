---
title: "ガウス減衰 | BYOC"
slug: /gaussian-decay
sidebar_label: "ガウス減衰"
beta: FALSE
notebook: FALSE
description: "正規減衰とも呼ばれるガウス減衰は、検索結果に対して最も自然な調整を実現します。距離が遠くなるにつれて徐々にぼやける人間の視覚と同様に、ガウス減衰は滑らかなベル型の曲線を描き、理想点から離れるアイテムの関連性を穏やかに低下させます。この手法は、希望範囲をわずかに超えるアイテムを厳しく罰することなくバランスよく減衰させつつ、遠方のアイテムの関連性は大幅に低減したい場合に最適です。| BYOC"
type: origin
token: G39mw621Yi3iICkv69JcQ0J5nHf
sidebar_position: 2
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
  - ガウス減衰
  - gauss

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ガウス減衰

ガウス減衰（正規減衰とも呼ばれる）は、検索結果に最も自然な調整をもたらします。人間の視覚が距離とともに徐々にぼやけていくように、ガウス減衰は滑らかなベル型の曲線を作り出し、対象が理想点から離れるにつれて関連性を穏やかに低下させます。このアプローチは、希望範囲のすぐ外側にあるアイテムを厳しくペナルティせず、かつ遠く離れたアイテムの関連性を著しく低下させたい場合に理想的です。

他の減衰ランカーとは異なります：

- 指数減衰は最初に急激に低下し、初期段階で強いペナルティを与えます
- 線形減衰はゼロに達するまで一定の割合で減少し、明確なカットオフを生み出します

ガウス減衰は、よりバランスが取れ、直感的でユーザーにとって自然に感じられるアプローチを提供します。

## ガウス減衰を使用するタイミング\{#when-to-use-gaussian-decay}

ガウス減衰は、特に以下のケースで効果的です：

<table>
   <tr>
     <th><p>ユースケース</p></th>
     <th><p>例</p></th>
     <th><p>ガウス減衰が適している理由</p></th>
   </tr>
   <tr>
     <td><p>位置情報に基づく検索</p></td>
     <td><p>レストラン検索、店舗検索</p></td>
     <td><p>人間の距離に対する自然な知覚を模倣</p></td>
   </tr>
   <tr>
     <td><p>コンテンツのレコメンデーション</p></td>
     <td><p>公開日時に基づく記事の提案</p></td>
     <td><p>コンテンツの古さに応じて関連性が徐々に低下</p></td>
   </tr>
   <tr>
     <td><p>商品リスト</p></td>
     <td><p>目標価格に近い商品</p></td>
     <td><p>価格が目標から逸脱するにつれて滑らかに関連性が低下</p></td>
   </tr>
   <tr>
     <td><p>専門性のマッチング</p></td>
     <td><p>関連経験を持つ専門家の検索</p></td>
     <td><p>経験の関連性をバランスよく評価</p></td>
   </tr>
</table>

アプリケーションで、厳格なペナルティや明確なカットオフなしに、自然な関連性の低下が必要な場合は、ガウス減衰が最適な選択肢となるでしょう。

## ベル曲線の原理\{#bell-curve-principle}

ガウス減衰は、滑らかなベル型の曲線を作り出し、理想点からの距離が増すにつれて関連性を徐々に低下させます。数学者カール・フリードリヒ・ガウスにちなんで名付けられたこの分布は、自然界や統計学において頻繁に現れるため、人間の知覚にとって非常に直感的に感じられます。

![DP1AbcqZPoyfqhxpJ2icptjQnfc](https://zdoc-images.s3.us-west-2.amazonaws.com/dp1abcqzpoyfqhxpj2icptjqnfc.png "DP1AbcqZPoyfqhxpJ2icptjQnfc")

上記のグラフは、モバイル検索アプリにおけるレストランランキングへのガウス減衰の影響を示しています：

- `origin`（0 km）：現在地。関連性が最大（1.0）になります。
- `offset`（±300 m）：「完全スコアゾーン」。300メートル以内のレストランはすべて完全な関連性スコア（1.0）を維持し、ごく近距離の選択肢がわずかな距離差で不必要にペナルティを受けないようになります。
- `scale`（±2 km）：関連性が減衰値に低下する距離。ちょうど2キロメートル離れたレストランの関連性スコアは半分（0.5）になります。
- `decay`（0.5）：スケール距離におけるスコア。このパラメータは、距離に応じてスコアがどれだけ速く低下するかを制御します。

この曲線から分かるように、2 kmを超えるレストランの関連性はさらに低下しますが、決してゼロにはなりません。4〜5 km離れたレストランであっても最小限の関連性を保ち、優れた遠方のレストランが結果に表示され続けます（ただし順位は下がります）。

この挙動は、人々が距離の関連性を自然に捉える方法を模倣しています。近くの場所が好まれますが、特別に優れた選択肢であれば、より遠くまで行くことも厭いません。

## 数式\{#formula}

ガウス減衰スコアを計算するための数式は次のとおりです：

$$
S(doc) = \exp\left( -\frac{\left( \max\left(0, \left|fieldvalue_{doc} - origin\right| - offset \right) \right)^2}{2\sigma^2} \right)
$$

ここで：

$$
\sigma^2 = -\frac{scale^2}{2 \cdot \ln(decay)}
$$

これを平易な言葉で分解すると：

1. フィールド値が原点からどれだけ離れているかを計算：$|fieldvalue_{doc} - origin|$
2. オフセット（ある場合）を引きますが、ゼロ未満にはなりません：$\max(0, distance - offset)$
3. この調整済み距離を二乗：$(adjusted\_distance)^2$
4. これを $2\sigma^2$ で割ります（$\sigma^2$ はスケールと減衰パラメータから計算されます）
5. 負の指数を取ることで、0〜1の値を得ます：$\exp(-value)$

$\sigma^2$ の計算により、スケールと減衰パラメータがガウス分布の分散の二乗に変換されます。これにより、関数は特徴的なベル型の形状になります。

## ガウス減衰の使用\{#use-gaussian-decay}

ガウス減衰は、Zilliz Cloud の標準ベクトル検索およびハイブリッド検索の両方に適用できます。以下に、この機能を実装するための主要なコードスニペットを示します。

<Admonition type="info" icon="📘" title="Notes">

<p>減衰関数を使用する前に、まず減衰計算に使用する数値フィールド（タイムスタンプや距離など）を含むコレクションを作成しておく必要があります。コレクションのセットアップ、スキーマ定義、データ挿入を含む完全な動作例については、<a href="./tutorial-implement-time-based-ranking">チュートリアル: Milvus で時間ベースのランキングを実装する</a>を参照してください。</p>

</Admonition>

### 減衰ランカーの作成\{#create-a-decay-ranker}

数値フィールド（この例ではユーザーからの距離（メートル単位）を表す `distance`）を含むコレクションをセットアップした後、ガウス減衰ランカーを作成します：

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import Function, FunctionType

# Create a Gaussian decay ranker for location-based restaurant search
rerank = Function(
    name="restaurant_distance_decay",     # Function identifier
    input_field_names=["distance"],       # Numeric field for distance in meters
    function_type=FunctionType.RERANK,    # Function type. Must be RERANK
    params={
        "reranker": "decay",              # Specify decay reranker
        "function": "gauss",              # Choose Gaussian decay
        "origin": 0,                      # Your current location (0 meters)
        "offset": 300,                    # 300m no-decay zone
        "decay": 0.5,                     # Half score at scale distance
        "scale": 2000                     # 2 km scale (2000 meters)
    }
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.ranker.DecayRanker;

DecayRanker rerank = DecayRanker.builder()
        .name("restaurant_distance_decay")
        .inputFieldNames(Collections.singletonList("distance"))
        .function("gauss")
        .origin(0)
        .offset(300)
        .decay(0.5)
        .scale(2000)
        .build();
```

</TabItem>

<TabItem value='java'>

```javascript
import { FunctionType } from "@zilliz/milvus2-sdk-node";

const rerank = {
  name: "restaurant_distance_decay",
  input_field_names: ["distance"],
  function_type: FunctionType.RERANK,
  params: {
    reranker: "decay",
    function: "gauss",
    origin: 0,
    offset: 300,
    decay: 0.5,
    scale: 2000,
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
# Apply decay ranker to restaurant vector search
result = milvus_client.search(
    collection_name,
    data=[your_query_vector],         # Replace with your query vector
    anns_field="dense",                   # Vector field to search
    limit=10,                             # Number of results
    output_fields=["name", "cuisine", "distance"],  # Fields to return
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
        .data(Collections.singletonList(new EmbeddedText("italian restaurants")))
        .annsField("vector_field")
        .limit(10)
        .outputFields(Arrays.asList("name", "cuisine", "distance"))
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
  output_fields: ["name", "cuisine", "distance"],
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

