---
title: "AUTOINDEX の説明 | BYOC"
slug: /autoindex-explained
sidebar_label: "AUTOINDEX の説明"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、パフォーマンス最適化クラスターと容量最適化クラスターを提供します。目的が異なるため、これらのクラスターでインデックスを構築するには異なるアプローチが必要です。ユーザーがインデックスパラメーターの調整や微調整に手間をかける必要がないように、AUTOINDEX が登場しました。 | BYOC"
type: origin
token: EA2twSf5oiERMDkriKScU9GInc4
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - autoindex
  - milvus
  - Pinecone ベクトルデータベース
  - オーディオ検索
  - セマンティック検索とは
  - 埋め込みモデル

---

import Admonition from '@theme/Admonition';


# AUTOINDEX の説明

Zilliz Cloud は、パフォーマンス最適化クラスターと容量最適化クラスターを提供しています。目的が異なるため、これらのクラスターでインデックスを構築するには異なるアプローチが必要です。ユーザーがインデックスパラメーターの調整や微調整に手間をかける必要がないように、**AUTOINDEX** が登場しました。

**AUTOINDEX** は、Zilliz Cloud で利用できる独自のインデックスタイプで、検索パフォーマンスを向上させるのに役立ちます。Zilliz Cloud のコレクションでベクトルフィールドにインデックスを付けたい場合は常に、**AUTOINDEX** が適用されます。

## 機能と利点{#features-and-benefits}

**AUTOINDEX** は、オープンソースの Milvus と比較して大幅なパフォーマンス上の利点を提供し、特定のデータセットで最大 3 倍の QPS を達成します。AUTOINDEX を使用して、[密ベクトル](./use-dense-vector)、[バイナリベクトル](./use-binary-vector)、[バイナリベクトル](./use-binary-vector) など、Zilliz Cloud クラスターがサポートするすべてのフィールドタイプにインデックスを作成できます。

**AUTOINDEX** は、次の点で高いパフォーマンスを発揮します。

- Single Instruction, Multiple Data (SIMD) を活用してクエリとストレージを高速化し、マシンのパフォーマンスを最大限に引き出します。

- データグラフ化およびトリミング戦略を最適化して、検索時にアクセスされるデータポイントの数を大幅に削減します。

- 動的量子化戦略を実装して、距離計算コストを削減します。

### コスト効率{#cost-efficiency}

**AUTOINDEX** は、純粋なインメモリ、ハイブリッドディスク、メモリマップド (MMAP) モードをサポートし、容量とパフォーマンスに対するユーザーのさまざまなニーズに対応します。インメモリモードでは、**AUTOINDEX** は動的量子化を使用してメモリ使用量を大幅に削減します。ハイブリッドディスクモードでは、**AUTOINDEX** はデータを動的にキャッシュし、アルゴリズムを使用して I/O 操作を最小限に抑え、高いパフォーマンスを維持できます。

### 自律チューニング{#autonomous-tuning}

近似最近傍 (ANN) アルゴリズムは、リコールとパフォーマンスのトレードオフを必要とします。クエリパラメーターは結果に大きな影響を与えます。クエリパラメーターサイズが小さすぎると、リコールが極端に低くなり、ビジネス要件を満たせない場合があります。逆に、クエリパラメーターサイズが大きすぎると、パフォーマンスが著しく低下します。

クエリパラメーターの選択には多くのドメイン固有の知識が必要であり、ユーザーの学習曲線が大幅に増加します。この問題に対処するために、**AUTOINDEX** は、クエリパラメーターの選択を容易にするインテリジェントなアルゴリズムを開発しました。インデックス構築中にユーザーのデータセットの分布を分析することで、**AUTOINDEX** は、クエリパラメーター推奨のための機械学習モデルによって、リコールとパフォーマンスのトレードオフを実現します。これにより、ユーザーはクエリパラメーターを手動で設定する必要がなくなります。

<Admonition type="info" icon="📘" title="Notes">

<p>Milvus コードベースを Zilliz Cloud に移行する際、使用するインデックスタイプを手動で変更する必要はありません。Zilliz Cloud は、インデックス作成時に AUTOINDEX を自動的に適用します。</p>

</Admonition>

## インデックス構築と検索設定{#index-building-and-search-settings}

インデックスを構築するプロセスには、コレクション内のエンティティを特定の順序で並べ替えることが含まれ、これにより結果をより迅速に取得できます。

Zilliz Cloud で浮動小数点ベクトルにインデックスを付けることは障害ではありません。インデックスタイプを **AUTOINDEX** に設定し、メトリックタイプを選択するだけで、Zilliz Cloud がインデックス構築および検索プロセスに最適な構成を決定します。メトリックタイプは、ベクトル間の距離がどのように測定されるかを決定し、考慮すべき唯一の点です。

Milvus と Zilliz Cloud のインデックス構築設定の違いを以下に示します。

```python
# For index-building
# On Milvus
index_params = {
    # Another option is IP.
    "metric_type": "L2", 
    # There are six more options available there.
    "index_type": "IVF_FLAT",
    # This varies with the specified index type.
    "params": {
        # This is the parameter required for IVF_FLAT to work.
        "nlist": 1024
    }
}

# On Zilliz Cloud
index_params = {
    # Always set this to AUTOINDEX
    "index_type": "AUTOINDEX", 
    # This is the only parameter you should think about.
    "metric_type": "L2"
}
```

検索パラメータ設定の違いは以下の通りです。

```python
# For searches
# On Milvus
search_params = {
    # Applicable tuning parameters vary with the index type
    "params": {
        "nprobe": 10
    }
}

# On Zilliz Cloud
search_params = {
    # highlight-next-line
    "params": { 
        "level": 1 # The default value applies when left unspecified
    }
}
```

### `level` パラメータについて{#about-the-level-parameter}

検索パフォーマンスを調整するには、インデックスタイプによって異なるパラメータセットを調整する必要があります。たとえば、HNSWを使用する場合に調整すべきパラメータは`ef`であり、IVFを使用する場合は`nprobe`です。最適な再現率と検索パフォーマンスのバランスを取るには、使用するインデックスタイプに固有のこれらのパラメータを微調整する必要があります。

Zilliz Cloudは、上記の複雑なパラメータセットをユーザーが操作する代わりに、統一されたパラメータ`level`を使用して検索パラメータの調整を簡素化します。

`level`パラメータを増やすと、再現率が高くなりますが、検索パフォーマンスが低下する可能性もあります。値はデフォルトで`1`であり、`1`から`10`の範囲です。デフォルト値は90%の再現率をもたらし、これはほとんどのユースケースで通常十分です。ただし、より高い再現率が必要な場合は、この値を増やしてください。

`level`パラメータを調整する際に`enable_recall_calculation`を`true`に設定すると、異なる`level`値での検索の精度を評価できます。

<Admonition type="info" icon="📘" title="Notes">

<p><code>level</code>および<code>enable_recall_calculation</code>パラメータはまだ<strong>Public Preview</strong>段階であり、互換性の問題により完全に利用できない場合があります。ご不明な点がございましたら、support@zilliz.comまでお問い合わせください。</p>

</Admonition>

## 結論{#conclusion}

この記事が、Zilliz Cloudのコレクション内のベクトルフィールドのインデックス構築と最適化のプロセスを簡素化する強力なツールであるAUTOINDEXをよりよく理解するのに役立ったことを願っています。AUTOINDEXは、検索とインデックスに最適な構成を自動的に決定することで、従来のメソッドと比較してユーザーの時間と労力を節約します。パフォーマンス最適化クラスターまたは容量最適化クラスターのどちらを使用している場合でも、AUTOINDEXは、ニーズに合わせて最適化されたインデックスで、より高速で効率的な検索を実現するのに役立ちます。AUTOINDEXまたはZilliz Cloudのその他の機能についてご質問がある場合は、お気軽に当社のチームにお問い合わせください。いつでも喜んでお手伝いいたします！