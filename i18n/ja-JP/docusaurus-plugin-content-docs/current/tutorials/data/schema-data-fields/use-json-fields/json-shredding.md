---
title: "JSON Shredding | Cloud"
slug: /json-shredding
sidebar_label: "JSON Shredding"
beta: FALSE
notebook: FALSE
description: "JSON shredding は、従来の行ベースのストレージを最適化されたカラムナストレージに変換することで、JSON クエリを高速化します。Zilliz Cloud は、データモデリングにおける JSON の柔軟性を維持しつつ、舞台裏でカラムナ最適化を実行し、アクセスとクエリの効率を劇的に向上させます。"
type: origin
token: Dh8MwFuZliYf9Wkhee3c1FhUnGd
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - schema
  - json field
  - json shredding
  - ベクトル検索アルゴリズム
  - 質問応答システム
  - llm-as-a-judge
  - ハイブリッドベクトル検索

---

import Admonition from '@theme/Admonition';


# JSON Shredding

JSON shredding は、従来の行ベースのストレージを最適化されたカラムナストレージに変換することで、JSON クエリを高速化します。Zilliz Cloud は、データモデリングにおける JSON の柔軟性を維持しながら、舞台裏でカラムナ最適化を実行し、アクセスとクエリの効率を劇的に向上させます。

JSON shredding は、ほとんどの JSON クエリシナリオで効果的です。パフォーマンスの利点は、以下の場合に顕著になります。

- **より大きく、より複雑な JSON ドキュメント** - ドキュメントサイズが大きくなるにつれて、パフォーマンスの向上が大きくなります。

- **読み取り集中型ワークロード** - JSON キーに対する頻繁なフィルタリング、ソート、または検索

- **混合クエリパターン** - 異なる JSON キーにまたがるクエリは、ハイブリッドストレージアプローチの恩恵を受けます。

## 仕組み{#how-it-works}

JSON shredding プロセスは、データを高速に取得できるように最適化するために、3つの異なるフェーズで実行されます。

### フェーズ 1: 取り込みとキー分類{#phase-1-ingestion-and-key-classification}

新しい JSON ドキュメントが書き込まれると、Zilliz Cloud はそれらを継続的にサンプリングおよび分析し、各 JSON キーの統計を構築します。この分析には、キーの出現率と型安定性（データ型がドキュメント間で一貫しているかどうか）が含まれます。

これらの統計に基づいて、JSON キーは最適なストレージのために以下のように分類されます。

#### JSON キーのカテゴリ{#categories-of-json-keys}

<table>
   <tr>
     <th><p>キーの種類</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>Typed keys</p></td>
     <td><p>ほとんどのドキュメントに存在し、常に同じデータ型を持つキー（例：すべて整数またはすべて文字列）。</p></td>
   </tr>
   <tr>
     <td><p>Dynamic keys</p></td>
     <td><p>頻繁に表示されるが、混合データ型を持つキー（例：文字列の場合もあれば、整数である場合もある）。</p></td>
   </tr>
   <tr>
     <td><p>Shared keys</p></td>
     <td><p>設定可能な頻度しきい値を下回る、まれに表示されるキーまたはネストされたキー<strong>。</strong></p></td>
   </tr>
</table>

#### 分類例{#example-classification}

次の JSON キーを含むサンプル JSON データを考えてみましょう。

```json
{"a": 10, "b": "str1", "f": 1}
{"a": 20, "b": "str2", "f": 2}  
{"a": 30, "b": "str3", "f": 3}
{"a": 40, "b": 1, "f": 4}       // b becomes mixed type
{"a": 50, "b": 2, "e": "rare"}  // e appears infrequently
```

このデータに基づくと、キーは次のように分類されます。

- **型付きキー**: `a` および `f` (常に整数)

- **動的キー**: `b` (文字列/整数の混在)

- **共有キー**: `e` (出現頻度の低いキー)

### フェーズ2: ストレージの最適化{#phase-2-storage-optimization}

[フェーズ1](./json-shredding#phase-1-ingestion-and-key-classification)での分類によって、ストレージのレイアウトが決まります。Zilliz Cloudは、クエリ用に最適化されたカラムナー形式を使用します。

![FcrMw6pY8h2jE8b2PQ3cp4fTnch](https://zdoc-images.s3.us-west-2.amazonaws.com/FcrMw6pY8h2jE8b2PQ3cp4fTnch.png)

- **シュレッドされたカラム**: **型付き**および**動的**な**キー**の場合、データは専用のカラムに書き込まれます。このカラムナー・ストレージにより、クエリ中に高速で直接的なスキャンが可能になります。Zilliz Cloudは、ドキュメント全体を処理することなく、特定のキーに必要なデータのみを読み取ることができます。

- **共有カラム**: すべての**共有キー**は、単一のコンパクトなバイナリJSONカラムにまとめて保存されます。このカラムには、共有キーの**転置インデックス**が構築されます。このインデックスは、低頻度キーに対するクエリを高速化するために不可欠です。Zilliz Cloudは、データを迅速にプルーニングすることで、検索空間を、指定されたキーを含む行のみに効果的に絞り込むことができます。

### フェーズ3: クエリ実行{#phase-3-query-execution}

最終フェーズでは、最適化されたストレージレイアウトを活用して、各クエリ述語に最適なパスをインテリジェントに選択します。

- **高速パス**: 型付き/動的キーに対するクエリ (例: `json['a'] < 100`) は、専用カラムに直接アクセスします。

- **最適化されたパス**: 共有キーに対するクエリ (例: `json['e'] = 'rare'`) は、転置インデックスを使用して関連ドキュメントを迅速に特定します。

## パフォーマンスベンチマーク{#performance-benchmarks}

当社のテストでは、さまざまなJSONキータイプとクエリパターンで大幅なパフォーマンス向上が実証されています。

### テスト環境と方法論{#test-environment-and-methodology}

- **ハードウェア**: 1コア/8GBクラスター

- **データセット**: [JSONBench](https://github.com/ClickHouse/JSONBench.git)からの100万ドキュメント

- **平均ドキュメントサイズ**: 478.89バイト

- **テスト期間**: QPSとレイテンシを測定する100秒

### 結果: 型付きキー{#results-typed-keys}

このテストでは、ほとんどのドキュメントに存在するキーをクエリする際のパフォーマンスを測定しました。

<table>
   <tr>
     <th><p>クエリ式</p></th>
     <th><p>キー値タイプ</p></th>
     <th><p>QPS (シュレッディングなし)</p></th>
     <th><p>QPS (シュレッディングあり)</p></th>
     <th><p>パフォーマンス向上</p></th>
   </tr>
   <tr>
     <td><p><code>json['time_us'] &gt; 0</code></p></td>
     <td><p>整数</p></td>
     <td><p>8.69</p></td>
     <td><p>287.50</p></td>
     <td><p>33倍</p></td>
   </tr>
   <tr>
     <td><p><code>json['kind'] == 'commit'</code></p></td>
     <td><p>文字列</p></td>
     <td><p>8.42</p></td>
     <td><p>126.1</p></td>
     <td><p>14.9倍</p></td>
   </tr>
</table>

### 結果: 共有キー{#results-shared-keys}

このテストでは、「共有」カテゴリに分類されるスパースなネストされたキーのクエリに焦点を当てました。

<table>
   <tr>
     <th><p>クエリ式</p></th>
     <th><p>キー値タイプ</p></th>
     <th><p>QPS (シュレッディングなし)</p></th>
     <th><p>QPS (シュレッディングあり)</p></th>
     <th><p>パフォーマンス向上</p></th>
   </tr>
   <tr>
     <td><p><code>json['identity']['seq'] &gt; 0</code></p></td>
     <td><p>ネストされた整数</p></td>
     <td><p>4.33</p></td>
     <td><p>385</p></td>
     <td><p>88.9倍</p></td>
   </tr>
   <tr>
     <td><p><code>json['identity']['did'] == 'xxxxx'</code></p></td>
     <td><p>ネストされた文字列</p></td>
     <td><p>7.6</p></td>
     <td><p>352</p></td>
     <td><p>46.3倍</p></td>
   </tr>
</table>

### 主要な洞察{#key-insights}

- **共有キーのクエリ**は、最も劇的な改善を示します (最大89倍高速)。

- **型付きキーのクエリ**は、一貫して15〜30倍のパフォーマンス向上をもたらします。

- **すべてのクエリタイプ**は、JSON Shreddingの恩恵を受け、パフォーマンスの低下はありません。

## FAQ{#faq}

- **JSON ShreddingとJSON Indexingのどちらを選択すればよいですか？**

    - **JSON Shredding**は、ドキュメントに頻繁に現れるキー、特に複雑なJSON構造に最適です。カラムナー・ストレージと転置インデックスの利点を組み合わせることで、多くの異なるキーをクエリする読み取り集中型のシナリオに非常に適しています。ただし、非常に小さなJSONドキュメントには、パフォーマンスの向上が最小限であるため推奨されません。キーの値がJSONドキュメントの合計サイズに占める割合が小さいほど、シュレッディングによるパフォーマンス最適化の効果は高くなります。

    - **JSON Indexing**は、特定のキーベースのクエリのターゲットを絞った最適化に適しており、ストレージオーバーヘッドが低いです。より単純なJSON構造に適しています。JSON Shreddingは配列内のキーに対するクエリをカバーしないため、それらを高速化するにはJSONインデックスが必要です。

    詳細については、[JSONフィールドの概要](./json-field-overview#next-accelerate-json-queries)を参照してください。

