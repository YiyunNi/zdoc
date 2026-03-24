---
title: "ガウス減衰 | Cloud"
slug: /gaussian-decay
sidebar_label: "ガウス減衰"
beta: FALSE
notebook: FALSE
description: "正規減衰とも呼ばれるガウス減衰は、検索結果に最も自然な感覚の調整をもたらします。距離が離れるにつれて徐々にぼやけていく人間の視覚のように、ガウス減衰は滑らかな釣鐘型の曲線を作成し、アイテムが理想的な点から離れるにつれて関連性を緩やかに減少させます。このアプローチは、好みの範囲をわずかに外れたアイテムを厳しく罰することなく、遠く離れたアイテムの関連性を大幅に減少させる、バランスの取れた減衰が必要な場合に理想的です。"
type: origin
token: G39mw621Yi3iICkv69JcQ0J5nHf
sidebar_position: 2
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
  - ガウス減衰
  - ガウス

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ガウス減衰

ガウス減衰は、正規減衰とも呼ばれ、検索結果に最も自然な調整をもたらします。距離が離れるにつれて徐々に視界がぼやける人間の視覚のように、ガウス減衰は滑らかなベル型の曲線を作成し、アイテムが理想的な点から離れるにつれて関連性を緩やかに減少させます。このアプローチは、好ましい範囲のすぐ外にあるアイテムを厳しく罰することなく、遠くにあるアイテムの関連性を大幅に減少させる、バランスの取れた減衰が必要な場合に理想的です。

他の減衰ランカーとは異なり、次の特徴があります。

- 指数減衰は最初に急激に減少し、より強い初期ペナルティを生み出します。

- 線形減衰はゼロに達するまで一定の割合で減少し、明確なカットオフを作成します。

ガウス減衰は、ユーザーにとって自然に感じられる、よりバランスの取れた直感的なアプローチを提供します。

## ガウス減衰を使用するタイミング\{#when-to-use-gaussian-decay}

ガウス減衰は、特に以下の状況で効果的です。

<table>
   <tr>
     <th><p>ユースケース</p></th>
     <th><p>例</p></th>
     <th><p>ガウスがうまく機能する理由</p></th>
   </tr>
   <tr>
     <td><p>位置情報ベースの検索</p></td>
     <td><p>レストラン検索、店舗検索</p></td>
     <td><p>距離の関連性に対する人間の自然な認識を模倣</p></td>
   </tr>
   <tr>
     <td><p>コンテンツの推奨</p></td>
     <td><p>公開日に基づく記事の提案</p></td>
     <td><p>コンテンツが古くなるにつれて関連性が徐々に低下</p></td>
   </tr>
   <tr>
     <td><p>商品リスト</p></td>
     <td><p>目標価格に近い商品</p></td>
     <td><p>価格が目標から逸脱するにつれて関連性がスムーズに低下</p></td>
   </tr>
   <tr>
     <td><p>専門知識のマッチング</p></td>
     <td><p>関連する経験を持つ専門家を見つける</p></td>
     <td><p>経験の関連性のバランスの取れた評価</p></td>
   </tr>
</table>

アプリケーションが、厳しいペナルティや厳密なカットオフなしに、関連性の低下を自然に感じさせる必要がある場合、ガウス減衰が最良の選択肢となるでしょう。

## ベルカーブの原理\{#bell-curve-principle}

ガウス減衰は、理想的な点からの距離が増加するにつれて関連性を徐々に減少させる、滑らかなベル型の曲線を作成します。数学者カール・フリードリヒ・ガウスにちなんで名付けられたこの分布は、自然界や統計学で頻繁に現れるため、人間の知覚にとって非常に直感的に感じられます。

![DP1AbcqZPoyfqhxpJ2icptjQnfc](https://zdoc-images.s3.us-west-2.amazonaws.com/dp1abcqzpoyfqhxpj2icptjqnfc.png "DP1AbcqZPoyfqhxpJ2icptjQnfc")

上記のグラフは、モバイル検索アプリでガウス減衰がレストランのランキングにどのように影響するかを示しています。

- `origin` (0 km): 現在地。関連性は最大 (1.0) です。

- `offset` (±300 m): あなたの周りの「満点ゾーン」。300メートル以内のすべてのレストランは完全な関連性スコア (1.0) を維持し、ごく近いオプションがわずかな距離の違いで不必要にペナルティを受けることを防ぎます。

- `scale` (±2 km): 関連性が減衰値まで低下する距離。正確に2キロメートル離れたレストランは、関連性スコアが半分 (0.5) になります。

- `decay` (0.5): スケール距離でのスコア。このパラメーターは、スコアが距離とともにどれだけ速く減少するかを本質的に制御します。

曲線からわかるように、2 kmを超えるレストランは関連性が低下し続けますが、完全にゼロになることはありません。4〜5キロメートル離れたレストランでさえ、最小限の関連性を保持しているため、優れた遠くのレストランでも検索結果に表示されます（ただし、ランキングは低くなります）。

この動作は、人々が距離の関連性について自然に考える方法を模倣しています。近くの場所が好まれますが、優れたオプションのためには遠くまで移動することもいとわないでしょう。

## 公式\{#formula}

ガウス減衰スコアを計算するための数式は次のとおりです。

$$
S(doc) = \exp\left( -\frac\{\left( \max\left(0, \left|fieldvalue_{doc} - origin\right| - offset \right) \right)^2}\{2\sigma^2} \right)
$$

ここで、

$$
\sigma^2 = -\frac{scale^2}\{2 \cdot \ln(decay)}
$$

これを平易な言葉で分解すると次のようになります。

1. フィールド値が原点からどれだけ離れているかを計算します: $|fieldvalue_{doc} - origin|$

1. オフセット (もしあれば) を減算しますが、ゼロを下回ることはありません: $\max(0, distance - offset)$

1. この調整された距離を二乗します: $(adjusted\_distance)^2$

1. スケールと減衰パラメーターから計算される $2\sigma^2$ で割ります。

1. 負の指数を取り、0から1の間の値を取得します: $\exp(-value)$

$\sigma^2$ の計算は、スケールと減衰パラメーターをガウス分布の標準偏差の二乗に変換します。これにより、関数に特徴的なベル型が与えられます。

## ガウス減衰を使用する\{#use-gaussian-decay}

ガウス減衰は、Zilliz Cloud の標準的なベクトル検索とハイブリッド検索の両方の操作に適用できます。以下に、この機能を実装するための主要なコードスニペットを示します。

<Admonition type="info" icon="📘" title="Notes">

<p>減衰関数を使用する前に、まず、減衰計算に使用される適切な数値フィールド (タイムスタンプ、距離など) を持つコレクションを作成する必要があります。コレクションのセットアップ、スキーマ定義、データ挿入を含む完全な動作例については、<a href="./tutorial-implement-time-based-ranking">チュートリアル: Milvus で時間ベースのランキングを実装する</a>を参照してください。</p>

</Admonition>

### 減衰ランカーを作成する\{#create-a-decay-ranker}

数値フィールド (この例では、ユーザーからの距離をメートル単位で示す `distance`) を使用してコレクションがセットアップされたら、ガウス減衰ランカーを作成します。

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

ディケイランカーを定義したら、`ranker` パラメータに渡すことで、検索操作中に適用できます。

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

