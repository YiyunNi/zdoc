---
title: "Boost Ranker | Cloud"
slug: /boost-ranker
sidebar_label: "Boost Ranker"
beta: FALSE
notebook: FALSE
description: "Boost Ranker を使用すると、ベクトル距離に基づいて計算されたセマンティック類似性のみに依存するのではなく、検索結果に意味のある影響を与えることができます。これは、メタデータフィルタリングを使用して検索結果を迅速に調整するのに理想的です。 | Cloud"
type: origin
token: Qa60w2vDuiqNk0kclKLcZ0uQnkg
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - 検索結果の再ランキング
  - 結果の再ランキング
  - ブースト
  - boost ranker
  - ベクトル次元
  - ANN Search
  - ベクトル埋め込みとは
  - ベクトルデータベースチュートリアル

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ブーストランカー

ベクトル距離に基づいて計算されるセマンティック類似性だけに頼るのではなく、ブーストランカーを使用すると、検索結果に意味のある影響を与えることができます。これは、メタデータフィルタリングを使用して検索結果を迅速に調整するのに理想的です。

検索リクエストにブーストランカー関数が含まれている場合、Milvus は関数内のオプションのフィルタリング条件を使用して検索結果候補の中から一致するものを見つけ、指定された重みを適用してそれらの一致のスコアをブーストし、最終結果における一致したエンティティのランキングを促進または降格するのに役立ちます。

## ブーストランカーを使用するタイミング{#when-to-use-boost-ranker}

クロスエンコーダーモデルや融合アルゴリズムに依存する他のランカーとは異なり、ブーストランカーはオプションのメタデータ駆動型ルールをランキングプロセスに直接注入するため、以下のシナリオにより適しています。

<table>
   <tr>
     <th><p>ユースケース</p></th>
     <th><p>例</p></th>
     <th><p>ブーストランカーがうまく機能する理由</p></th>
   </tr>
   <tr>
     <td><p>ビジネス主導のコンテンツ優先順位付け</p></td>
     <td><ul><li><p>Eコマース検索結果でプレミアム商品を強調表示する</p></li><li><p>高いユーザーエンゲージメント指標（ビュー、いいね、シェアなど）を持つコンテンツの可視性を高める</p></li><li><p>時間制約のある検索アプリケーションで最近のコンテンツを上位表示する</p></li><li><p>検証済みまたは信頼できるソースからのコンテンツを優先する</p></li><li><p>正確なフレーズや関連性の高いキーワードに一致する結果をブーストする</p></li></ul></td>
     <td rowspan="2"><p>インデックスを再構築したり、ベクトル埋め込みモデルを変更したりする必要なく（これらは時間のかかる操作です）、オプションのメタデータフィルターをリアルタイムで適用することで、検索結果内の特定のアイテムを即座に昇格または降格できます。このメカニズムにより、進化するビジネス要件に容易に適応できる、柔軟で動的な検索ランキングが可能になります。</p></td>
   </tr>
   <tr>
     <td><p>戦略的なコンテンツの降格</p></td>
     <td><ul><li><p>在庫の少ないアイテムを完全に削除せずに目立たなくする</p></li><li><p>検閲なしで、不快な可能性のある用語を含むコンテンツのランクを下げる</p></li><li><p>古いドキュメントを技術検索でアクセス可能に保ちながら降格する</p></li><li><p>マーケットプレイス検索で競合製品の可視性を微妙に下げる</p></li><li><p>品質が低いと判断されるコンテンツ（書式設定の問題、短い長さなど）の関連性を低下させる</p></li></ul></td>
   </tr>
</table>

複数のブーストランカーを組み合わせて、より動的で堅牢な重みベースのランキング戦略を実装することもできます。

## ブーストランカーのメカニズム{#mechanism-of-boost-ranker}

次の図は、ブーストランカーの主要なワークフローを示しています。

![Hq0awfjC7h0Ty3bvsUEcasOHncb](https://zdoc-images.s3.us-west-2.amazonaws.com/Hq0awfjC7h0Ty3bvsUEcasOHncb.png)

データを挿入すると、Zilliz Cloud はそれをセグメントに分散します。検索中、各セグメントは一連の候補を返し、Zilliz Cloud はすべてのセグメントからのこれらの候補をランク付けして最終結果を生成します。検索リクエストにブーストランカーが含まれている場合、Zilliz Cloud は潜在的な精度損失を防ぎ、リコールを改善するために、各セグメントからの候補結果にそれを適用します。

結果を確定する前に、Milvus はこれらの候補をブーストランカーで次のように処理します。

1. ブーストランカーで指定されたオプションのフィルタリング式を適用して、式に一致するエンティティを識別します。

1. ブーストランカーで指定された重みを適用して、識別されたエンティティのスコアをブーストします。

<Admonition type="info" icon="📘" title="Notes">

<p>ブーストランカーは、マルチベクトルハイブリッド検索では使用できません。</p>

</Admonition>

## ブーストランカーの例{#examples-of-boost-ranker}

次の例は、最も関連性の高い上位5つのエンティティを返し、抽象ドキュメントタイプのエンティティのスコアに重みを追加する必要がある単一ベクトル検索でのブーストランカーの使用法を示しています。

1. **セグメント内の検索結果候補を収集します。**

    次の表は、Milvus がエンティティを2つのセグメント（**0001**と**0002**）に分散し、各セグメントが5つの候補を返すことを想定しています。

    <table>
       <tr>
         <th><p>ID</p></th>
         <th><p>DocType</p></th>
         <th><p>Score</p></th>
         <th><p>Rank</p></th>
         <th><p>segment</p></th>
       </tr>
       <tr>
         <td><p>117</p></td>
         <td><p>abstract</p></td>
         <td><p>0.344</p></td>
         <td><p>1</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>89</p></td>
         <td><p>abstract</p></td>
         <td><p>0.456</p></td>
         <td><p>2</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>257</p></td>
         <td><p>body</p></td>
         <td><p>0.578</p></td>
         <td><p>3</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>358</p></td>
         <td><p>title</p></td>
         <td><p>0.788</p></td>
         <td><p>4</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>168</p></td>
         <td><p>body</p></td>
         <td><p>0.899</p></td>
         <td><p>5</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>46</p></td>
         <td><p>body</p></td>
         <td><p>0.189</p></td>
         <td><p>1</p></td>
         <td><p>0002</p></td>
       </tr>
       <tr>
         <td><p>48</p></td>
         <td><p>body</p></td>
         <td><p>0265</p></td>
         <td><p>2</p></td>
         <td><p>0002</p></td>
       </tr>
       <tr>
         <td><p>561</p></td>
         <td><p>abstract</p></td>
         <td><p>0.366</p></td>
         <td><p>3</p></td>
         <td><p>0002</p></td>
       </tr>
       <tr>
         <td><p>344</p></td>
         <td><p>abstract</p></td>
         <td><p>0.444</p></td>
         <td><p>4</p></td>
         <td><p>0002</p></td>
       </tr>
       <tr>
         <td><p>276</p></td>
         <td><p>abstract</p></td>
         <td><p>0.845</p></td>
         <td><p>5</p></td>
         <td><p>0002</p></td>
       </tr>
    </table>

1. **ブーストランカーで指定されたフィルタリング式を適用します** (`doctype='abstract'`)。

    次の表の`DocType`フィールドで示されているように、Milvus は`doctype`が`abstract`に設定されているすべてのエンティティをさらに処理するためにマークします。

    <table>
       <tr>
         <th><p>ID</p></th>
         <th><p>DocType</p></th>
         <th><p>Score</p></th>
         <th><p>Rank</p></th>
         <th><p>segment</p></th>
       </tr>
       <tr>
         <td><p><strong>117</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.344</strong></p></td>
         <td><p><strong>1</strong></p></td>
         <td><p><strong>0001</strong></p></td>
       </tr>
       <tr>
         <td><p><strong>89</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.456</strong></p></td>
         <td><p><strong>2</strong></p></td>
         <td><p><strong>0001</strong></p></td>
       </tr>
       <tr>
         <td><p>257</p></td>
         <td><p>body</p></td>
         <td><p>0.578</p></td>
         <td><p>3</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>358</p></td>
         <td><p>title</p></td>
         <td><p>0.788</p></td>
         <td><p>4</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>168</p></td>
         <td><p>body</p></td>
         <td><p>0.899</p></td>
         <td><p>5</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>46</p></td>
         <td><p>body</p></td>
         <td><p>0.189</p></td>
         <td><p>1</p></td>
         <td><p>0002</p></td>
       </tr>
       <tr>
         <td><p>48</p></td>
         <td><p>body</p></td>
         <td><p>0265</p></td>
         <td><p>2</p></td>
         <td><p>0002</p></td>
       </tr>
       <tr>
         <td><p><strong>561</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.366</strong></p></td>
         <td><p><strong>3</strong></p></td>
         <td><p><strong>0002</strong></p></td>
       </tr>
       <tr>
         <td><p><strong>344</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.444</strong></p></td>
         <td><p><strong>4</strong></p></td>
         <td><p><strong>0002</strong></p></td>
       </tr>
       <tr>
         <td><p><strong>276</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.845</strong></p></td>
         <td><p><strong>5</strong></p></td>
         <td><p><strong>0002</strong></p></td>
       </tr>
    </table>

1. **ブーストランカーで指定された重みを適用します** (`weight=0.5`)。

    前のステップで識別されたすべてのエンティティは、ブーストランカーで指定された重みで乗算され、その結果、ランクが変更されます。

    <table>
       <tr>
         <th><p>ID</p></th>
         <th><p>DocType</p></th>
         <th><p>Score</p></th>
         <th><p>Weighted Score </p><p>(= score x weight)</p></th>
         <th><p>Rank</p></th>
         <th><p>segment</p></th>
       </tr>
       <tr>
         <td><p><strong>117</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.344</strong></p></td>
         <td><p><strong>0.172</strong></p></td>
         <td><p><strong>1</strong></p></td>
         <td><p><strong>0001</strong></p></td>
       </tr>
       <tr>
         <td><p><strong>89</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.456</strong></p></td>
         <td><p><strong>0.228</strong></p></td>
         <td><p><strong>2</strong></p></td>
         <td><p><strong>0001</strong></p></td>
       </tr>
       <tr>
         <td><p>257</p></td>
         <td><p>body</p></td>
         <td><p>0.578</p></td>
         <td><p>0.578</p></td>
         <td><p>3</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>358</p></td>
         <td><p>title</p></td>
         <td><p>0.788</p></td>
         <td><p>0.788</p></td>
         <td><p>4</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p>168</p></td>
         <td><p>body</p></td>
         <td><p>0.899</p></td>
         <td><p>0.899</p></td>
         <td><p>5</p></td>
         <td><p>0001</p></td>
       </tr>
       <tr>
         <td><p><strong>561</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.366</strong></p></td>
         <td><p><strong>0.183</strong></p></td>
         <td><p><strong>1</strong></p></td>
         <td><p><strong>0002</strong></p></td>
       </tr>
       <tr>
         <td><p>46</p></td>
         <td><p>body</p></td>
         <td><p>0.189</p></td>
         <td><p>0.189</p></td>
         <td><p>2</p></td>
         <td><p>0002</p></td>
       </tr>
       <tr>
         <td><p><strong>344</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.444</strong></p></td>
         <td><p><strong>0.222</strong></p></td>
         <td><p><strong>3</strong></p></td>
         <td><p><strong>0002</strong></p></td>
       </tr>
       <tr>
         <td><p>48</p></td>
         <td><p>body</p></td>
         <td><p>0.265</p></td>
         <td><p>0.265</p></td>
         <td><p>4</p></td>
         <td><p>0002</p></td>
       </tr>
       <tr>
         <td><p><strong>276</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.845</strong></p></td>
         <td><p><strong>0.423</strong></p></td>
         <td><p><strong>5</strong></p></td>
         <td><p><strong>0002</strong></p></td>
       </tr>
    </table>

    <Admonition type="info" icon="📘" title="Notes">

    <p>重みは、選択する浮動小数点数でなければなりません。上記の例のように、スコアが小さいほど関連性が高いことを示す場合は、<strong>1</strong>未満の重みを使用します。それ以外の場合は、<strong>1</strong>より大きい重みを使用します。</p>

    </Admonition>

1. **重み付けされたスコアに基づいて、すべてのセグメントからの候補を集約して結果を確定します。**

    <table>
       <tr>
         <th><p>ID</p></th>
         <th><p>DocType</p></th>
         <th><p>Score</p></th>
         <th><p>Weighted Score</p></th>
         <th><p>Rank</p></th>
         <th><p>segment</p></th>
       </tr>
       <tr>
         <td><p><strong>117</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.344</strong></p></td>
         <td><p><strong>0.172</strong></p></td>
         <td><p><strong>1</strong></p></td>
         <td><p><strong>0001</strong></p></td>
       </tr>
       <tr>
         <td><p><strong>561</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.366</strong></p></td>
         <td><p><strong>0.183</strong></p></td>
         <td><p><strong>2</strong></p></td>
         <td><p><strong>0002</strong></p></td>
       </tr>
       <tr>
         <td><p>46</p></td>
         <td><p>body</p></td>
         <td><p>0.189</p></td>
         <td><p>0.189</p></td>
         <td><p>3</p></td>
         <td><p>0002</p></td>
       </tr>
       <tr>
         <td><p><strong>344</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.444</strong></p></td>
         <td><p><strong>0.222</strong></p></td>
         <td><p><strong>4</strong></p></td>
         <td><p><strong>0002</strong></p></td>
       </tr>
       <tr>
         <td><p><strong>89</strong></p></td>
         <td><p><strong>abstract</strong></p></td>
         <td><p><strong>0.456</strong></p></td>
         <td><p><strong>0.228</strong></p></td>
         <td><p><strong>5</strong></p></td>
         <td><p><strong>0001</strong></p></td>
       </tr>
    </table>

## ブーストランカーの使用法{#usage-of-boost-ranker}

このセクションでは、ブーストランカーを使用して単一ベクトル検索の結果に影響を与える方法の例を示します。

### ブーストランカーを作成する{#create-a-boost-ranker}

検索リクエストのリランカーとしてブーストランカーを渡す前に、ブーストランカーを次のようにリランキング関数として適切に定義する必要があります。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import Function, FunctionType

rerank = Function(
    name="boost",
    input_field_names=[], # Must be an empty list
    function_type=FunctionType.RERANK,
    params={
        "reranker": "boost",
        "filter": "doctype == 'abstract'",
        "random_score": { 
            "seed": 126,
            "field": "id"
        },
        "weight": 0.5
    }
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.vector.request.ranker.BoostRanker;

BoostRanker rerank = BoostRanker.builder()
        .name("boost")
        .filter("doctype == \"abstract\"")
        .weight(5.0f)
        .randomScoreField("id")
        .randomScoreSeed(126)
        .build();
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='javascript'>

```javascript
import {FunctionType} from '@zilliz/milvus2-sdk-node';

const rerank = {
  name: "boost",
  input_field_names: [],
  type: FunctionType.RERANK,
  params: {
    reranker: "boost",
    filter: "doctype == 'abstract'",
    random_score: {
      seed: 126,
      field: "id",
    },
    weight: 0.5,
  },
};

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
     <th><p>必須？</p></th>
     <th><p>説明</p></th>
     <th><p>値/例</p></th>
   </tr>
   <tr>
     <td><p><code>name</code></p></td>
     <td><p>はい</p></td>
     <td><p>この関数のユニークな識別子</p></td>
     <td><p><code>"boost"</code></p></td>
   </tr>
   <tr>
     <td><p><code>input_field_names</code></p></td>
     <td><p>はい</p></td>
     <td><p>関数を適用するベクトルフィールドのリスト（Boost Rankerの場合は空である必要があります）</p></td>
     <td><p><code>[]</code></p></td>
   </tr>
   <tr>
     <td><p><code>function_type</code></p></td>
     <td><p>はい</p></td>
     <td><p>呼び出す関数のタイプ。リランキング戦略を指定するには<code>RERANK</code>を使用します</p></td>
     <td><p><code>FunctionType.RERANK</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.reranker</code></p></td>
     <td><p>はい</p></td>
     <td><p>リランカーのタイプを指定します。</p><p>Boost Rankerを使用するには<code>boost</code>に設定する必要があります。</p></td>
     <td><p><code>"boost"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.weight</code></p></td>
     <td><p>はい</p></td>
     <td><p>生の検索結果で一致するエンティティのスコアに乗算される重みを指定します。</p><p>値は浮動小数点数である必要があります。</p><ul><li><p>一致するエンティティの重要性を強調するには、スコアをブーストする値を設定します。</p></li><li><p>一致するエンティティの重要性を下げるには、このパラメーターにスコアを下げる値を割り当てます。</p></li></ul></td>
     <td><p><code>1</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.filter</code></p></td>
     <td><p>いいえ</p></td>
     <td><p>検索結果のエンティティの中からエンティティを照合するために使用されるフィルター式を指定します。<a href="./filtering-overview">フィルタリングの説明</a>で言及されている有効な基本フィルター式であれば何でも構いません。</p><p><strong>注</strong>: <code>==</code>、<code>&gt;</code>、<code>&lt;</code>などの基本的な演算子のみを使用してください。<code>text_match</code>や<code>phrase_match</code>などの高度な演算子を使用すると、検索パフォーマンスが低下します。</p></td>
     <td><p><code>"doctype == 'abstract'"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.random_score</code></p></td>
     <td><p>いいえ</p></td>
     <td><p><code>0</code>から<code>1</code>の間の値をランダムに生成するランダム関数を指定します。以下の2つのオプション引数があります。</p><ul><li><p><code>seed</code> (数値) 擬似乱数生成器 (PRNG) を開始するために使用される初期値を指定します。</p></li><li><p><code>field</code> (文字列) 乱数生成におけるランダムな要因として使用される値を持つフィールドの名前を指定します。一意の値を持つフィールドで十分です。</p><p>同じシードとフィールド値を使用することで、世代間の整合性を確保するために、<code>seed</code>と<code>field</code>の両方を設定することをお勧めします。</p></li></ul></td>
     <td><p><code>\{"seed": 126, "field": "id"}</code></p></td>
   </tr>
</table>

### 単一のBoost Rankerによる検索{#search-with-a-single-boost-ranker}

Boost Ranker関数が準備できたら、検索リクエストでそれを参照できます。以下の例では、**id**、**vector**、**doctype**のフィールドを持つcollectionをすでに作成していることを前提としています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

# Connect to the Milvus server
client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Assume you have a collection set up

# Conduct a similarity search using the created ranker
client.search(
    collection_name="my_collection",
    data=[[-0.619954382375778, 0.4479436794798608, -0.17493894838751745, -0.4248030059917294, -0.8648452746018911]],
    anns_field="vector",
    params={},
    output_field=["doctype"],
    ranker=rerank
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.response.SearchResp;
import io.milvus.v2.service.vector.request.data.FloatVec;

MilvusClientV2 client = new MilvusClientV2(ConnectConfig.builder()
        .uri("YOUR_CLUSTER_ENDPOINT")
        .token("YOUR_CLUSTER_TOKEN")
        .build());
        
SearchResp searchReq = client.search(SearchReq.builder()
        .collectionName("my_collection")
        .data(Collections.singletonList(new FloatVec(new float[]{-0.619954f, 0.447943f, -0.174938f, -0.424803f, -0.864845f})))
        .annsField("vector")
        .outputFields(Collections.singletonList("doctype"))
        .functionScore(FunctionScore.builder()
                .addFunction(rerank)
                .build())
        .build());
SearchResp searchResp = client.search(searchReq);
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='javascript'>

```javascript
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

// Connect to the Milvus server
const client = new MilvusClient({
  address: 'YOUR_CLUSTER_ENDPOINT',
  token: 'YOUR_CLUSTER_TOKEN'
});

// Assume you have a collection set up

// Conduct a similarity search
const searchResults = await client.search({
  collection_name: 'my_collection',
  data: [-0.619954382375778, 0.4479436794798608, -0.17493894838751745, -0.4248030059917294, -0.8648452746018911],
  anns_field: 'vector',
  output_fields: ['doctype'],
  rerank: rerank,
});

console.log('Search results:', searchResults);
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

### 複数のブーストランカーで検索する{#search-with-multiple-boost-rankers}

複数のブーストランカーを単一の検索で組み合わせて、検索結果に影響を与えることができます。これを行うには、いくつかのブーストランカーを作成し、それらを**FunctionScore**インスタンスで参照し、その**FunctionScore**インスタンスを検索リクエストのランカーとして使用します。

次の例は、**0.8**から**1.2**の間の重みを適用して、識別されたすべてのエンティティのスコアを変更する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient, Function, FunctionType, FunctionScore

# Create a Boost Ranker with a fixed weight
fix_weight_ranker = Function(
    name="boost",
    input_field_names=[], # Must be an empty list
    function_type=FunctionType.RERANK,
    params={
        "reranker": "boost",
        "weight": 0.8
    }
)

# Create a Boost Ranker with a randomly generated weight between 0 and 0.4
random_weight_ranker = Function(
    name="boost",
    input_field_names=[], # Must be an empty list
    function_type=FunctionType.RERANK,
    params={
        "reranker": "boost",
        "random_score": {
            "seed": 126,
        },
        "weight": 0.4
    }
)

# Create a Function Score
ranker = FunctionScore(
    functions=[
        fix_weight_ranker, 
        random_weight_ranker
    ],
    params={
        "boost_mode": "Multiply",
        "function_mode": "Sum"
    }
)

# Conduct a similarity search using the created Function Score
client.search(
    collection_name="my_collection",
    data=[[-0.619954382375778, 0.4479436794798608, -0.17493894838751745, -0.4248030059917294, -0.8648452746018911]],
    anns_field="vector",
    params={},
    output_field=["doctype"],
    ranker=ranker
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.common.clientenum.FunctionType;
import io.milvus.v2.service.collection.request.CreateCollectionReq;

CreateCollectionReq.Function fixWeightRanker = CreateCollectionReq.Function.builder()
                 .functionType(FunctionType.RERANK)
                 .name("boost")
                 .param("reranker", "boost")
                 .param("weight", "0.8")
                 .build();
                 
CreateCollectionReq.Function randomWeightRanker = CreateCollectionReq.Function.builder()
                 .functionType(FunctionType.RERANK)
                 .name("boost")
                 .param("reranker", "boost")
                 .param("weight", "0.4")
                 .param("random_score", "{\"seed\": 126}")
                 .build();

Map<String, String> params = new HashMap<>();
params.put("boost_mode","Multiply");
params.put("function_mode","Sum");     
FunctionScore ranker = FunctionScore.builder()
                 .addFunction(fixWeightRanker)
                 .addFunction(randomWeightRanker)
                 .params(params)
                 .build()

SearchResp searchReq = client.search(SearchReq.builder()
                 .collectionName("my_collection")
                 .data(Collections.singletonList(new FloatVec(new float[]{-0.619954f, 0.447943f, -0.174938f, -0.424803f, -0.864845f})))
                 .annsField("vector")
                 .outputFields(Collections.singletonList("doctype"))
                 .addFunction(ranker)
                 .build());
SearchResp searchResp = client.search(searchReq);
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='javascript'>

```javascript
import {FunctionType} from '@zilliz/milvus2-sdk-node';

const fix_weight_ranker = {
  name: "boost",
  input_field_names: [],
  type: FunctionType.RERANK,
  params: {
    reranker: "boost",
    weight: 0.8,
  },
};

const random_weight_ranker = {
  name: "boost",
  input_field_names: [],
  type: FunctionType.RERANK,
  params: {
    reranker: "boost",
    random_score: {
      seed: 126,
    },
    weight: 0.4,
  },
};

const ranker = {
  functions: [fix_weight_ranker, random_weight_ranker],
  params: {
    boost_mode: "Multiply",
    function_mode: "Sum",
  },
};

await client.search({
  collection_name: "my_collection",
  data: [[-0.619954382375778, 0.4479436794798608, -0.17493894838751745, -0.4248030059917294, -0.8648452746018911]],
  anns_field: "vector",
  params: {},
  output_field: ["doctype"],
  ranker: ranker
});

```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

具体的には、2つのBoost Rankerがあります。1つは、見つかったすべてのエンティティに固定の重みを適用し、もう1つは、それらにランダムな重みを割り当てます。次に、これらの2つのランカーを**FunctionScore**で参照し、重みが見つかったエンティティのスコアにどのように影響するかを定義します。

次の表に、**FunctionScore**インスタンスを作成するために必要なパラメータを示します。

<table>
   <tr>
     <th><p>パラメータ</p></th>
     <th><p>必須？</p></th>
     <th><p>説明</p></th>
     <th><p>値/例</p></th>
   </tr>
   <tr>
     <td><p><code>functions</code></p></td>
     <td><p>はい</p></td>
     <td><p>ターゲットランカーの名前をリストで指定します。</p></td>
     <td><p><code>["fix_weight_ranker", "random_weight_ranker"]</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.boost_mode</code></p></td>
     <td><p>いいえ</p></td>
     <td><p>指定された重みが、一致するエンティティのスコアにどのように影響するかを指定します。</p><p>可能な値は次のとおりです。</p><ul><li><p><code>Multiply</code></p><p>重み付けされた値が、一致するエンティティの元のスコアに指定された重みを乗算したものと等しいことを示します。</p><p>これがデフォルト値です。</p></li><li><p><code>Sum</code></p><p>重み付けされた値が、一致するエンティティの元のスコアと指定された重みの合計と等しいことを示します。</p></li></ul></td>
     <td><p><code>"Sum"</code></p></td>
   </tr>
   <tr>
     <td><p><code>params.function_mode</code></p></td>
     <td><p>いいえ</p></td>
     <td><p>さまざまなBoost Rankerからの重み付けされた値がどのように処理されるかを指定します。</p><p>可能な値は次のとおりです。</p><ul><li><p><code>Multiply</code></p><p>一致するエンティティの最終スコアが、すべてのBoost Rankerからの重み付けされた値の積と等しいことを示します。</p><p>これがデフォルト値です。</p></li><li><p><code>Sum</code></p><p>一致するエンティティの最終スコアが、すべてのBoost Rankerからの重み付けされた値の合計と等しいことを示します。</p></li></ul></td>
     <td><p><code>"Sum"</code></p></td>
   </tr>
</table>

