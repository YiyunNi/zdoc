---
title: "AUTOINDEX の解説 | BYOC"
slug: /autoindex-explained
sidebar_key: autoindex-explained
sidebar_label: "AUTOINDEX の解説"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、異なる構成で動作するクラスターを提供しています。これらのクラスター上でインデックスを構築するには、異なるアプローチが必要です。ユーザーがインデックスパラメーターの調整や微調整の手間を省けるよう、AUTOINDEX が登場しました。 | BYOC"
type: origin
token: EA2twSf5oiERMDkriKScU9GInc4
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - autoindex
  - milvus

---

import Admonition from '@theme/Admonition';


# AUTOINDEX の解説

Zilliz Cloud では、異なる構成で動作するクラスターを提供しています。これらのクラスター上でインデックスを構築するには、異なるアプローチが必要です。ユーザーがインデックスパラメーターの調整や微調整の手間を省くため、**AUTOINDEX** が登場しました。

**AUTOINDEX** は、Zilliz Cloud で利用可能な独自のインデックスタイプで、より優れた検索パフォーマンスの実現を支援します。Zilliz Cloud 上のコレクションでベクトルフィールドまたはスカラーフィールドにインデックスを作成したい場合、**AUTOINDEX** が適用されます。

## 機能と利点\{#features-and-benefits}

ベクトルフィールドでは、**AUTOINDEX** はオープンソースの Milvus と比較して大幅なパフォーマンス上の利点を提供し、特定のデータセットで最大 3 倍の QPS を達成します。AUTOINDEX を使用して、Zilliz Cloud クラスターがサポートするすべてのフィールドタイプにインデックスを作成できます。これには、[Dense Vector](./use-dense-vector)、[Binary Vector](./use-binary-vector)、および [Binary Vector](./use-binary-vector) が含まれます。

スカラーフィールドでは、**AUTOINDEX** はフィールドタイプと最も適切なスカラーインデックスタイプとの間で効率的なマッピングを提供します。

<table>
   <tr>
     <th><p>フィールドタイプ</p></th>
     <th><p>AUTOINDEX の解決結果</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p><code>VARCHAR</code></p></td>
     <td><p><strong>BITMAP</strong> (C&ast; &lt; 100) / <strong>INVERTED</strong> ( C ≥ 100)</p></td>
     <td><p>文字列データ型。詳細については、<a href="./use-string-field">String Field</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>INT8</code>, <code>INT16</code>, <code>INT32</code>, <code>INT64</code></p></td>
     <td><p><strong>BITMAP</strong> (C &lt; 100) / <strong>STL_SORT</strong> (C ≥ 100)</p></td>
     <td><p>整数。詳細については、<a href="./use-number-field">Boolean & Number</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>FLOAT</code>, <code>DOUBLE</code></p></td>
     <td><p><strong>BITMAP</strong> (C&ast; &lt; 100) / <strong>INVERTED</strong> ( C ≥ 100)</p></td>
     <td><p>浮動小数点。詳細については、<a href="./use-number-field">Boolean & Number</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>BOOL</code></p></td>
     <td><p><strong>BITMAP</strong></p></td>
     <td><p>ブール値。詳細については、<a href="./use-number-field">Boolean & Number</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>ARRAY</code></p></td>
     <td><p><strong>BITMAP</strong> (C&ast; &lt; 100) / <strong>INVERTED</strong> ( C ≥ 100)</p></td>
     <td><p>スカラー値の同種配列。詳細については、<a href="./use-array-fields">配列 Field</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>GEOMETRY</code></p></td>
     <td><p><strong>RTREE</strong></p></td>
     <td><p>空間情報を格納するジオメトリデータ。詳細については、<a href="./use-geometry-field">ジオメトリ Field</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p><code>TIMESTAMPTZ</code></p></td>
     <td><p><strong>STL_SORT</strong></p></td>
     <td><p>タイムゾーン対応の ISO 8601 入力、タイムゾーンをまたいで一貫したフィルタリングと並べ替えを行うために UTC として格納されます。詳細については、<a href="./use-timestamptz-field">TIMESTAMPTZ Field</a> を参照してください。</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

カーディナリティ（上記の表の C）は、コレクション全体でフィールド内の一意な値の数を示します。例えば、float フィールドのカーディナリティは、そのフィールド内の異なる float 値の数です。

配列フィールドの場合、カーディナリティはセグメント内のすべての配列における**異なる要素値**の数です。例えば:

```plaintext
[1, 2, 3]
[2, 3, 4]
[1, 4, 5]
```

異なる要素の値は `{1, 2, 3, 4, 5}` → カーディナリティ = **5** です。すべての配列からすべての要素をフラット化し、一意の値をカウントします — 異なる配列の数や配列の長さではありません。

</Admonition>

**AUTOINDEX** は以下の側面で高いパフォーマンスを実現します:

- Single Instruction, Multiple データ (SIMD) を活用してクエリとストレージを高速化し、マシンのあらゆる性能を最大限に引き出します。

- データグラフ化とクロッピング戦略を最適化し、検索時にアクセスするデータポイントの数を削減します。

- 動的量子化戦略を実装し、距離計算のコストを削減します。

### コスト効率\{#cost-efficiency}

**AUTOINDEX** は、純粋なインメモリ、ハイブリッドディスク、およびメモリマップト (MMAP) モードをサポートし、ユーザーの容量とパフォーマンスに対する多様なニーズに応えます。インメモリモードでは、**AUTOINDEX** は動的量子化を使用してメモリ使用量を大幅に削減します。ハイブリッドディスクモードでは、**AUTOINDEX** はデータを動的にキャッシュし、アルゴリズムを使用して I/O 操作を最小化し、高いパフォーマンスを維持できます。

### 自律チューニング\{#autonomous-tuning}

近似最近傍 (ANN) アルゴリズムでは、リコールとパフォーマンスのトレードオフが必要です。クエリパラメータは結果に大きな影響を与えます。クエリパラメータのサイズが小さすぎると、リコールは極めて低くなり、ビジネス要件を満たさない可能性があります。逆に、クエリパラメータのサイズが過度に大きいと、パフォーマンスは著しく低下します。

クエリパラメータの選択には多くのドメイン固有の知識が必要であり、これによりユーザーの学習曲線は大きく増加します。この問題に対処するため、**AUTOINDEX** はクエリパラメータの選択を容易にするインテリジェントなアルゴリズムを開発しました。インデックス構築時にユーザーのデータセットの分布を分析することで、**AUTOINDEX** はクエリパラメータ推薦のための機械学習モデルによって、リコールとパフォーマンスのトレードオフを実現します。これにより、ユーザーはクエリパラメータを手動で設定する必要がなくなります。

<Admonition type="info" icon="📘" title="Notes">

Milvus のコードベースを Zilliz Cloud に移行する際、使用するインデックスタイプを手動で変更する必要はありません。Zilliz Cloud は、インデックスの作成時に自動的に AUTOINDEX を適用します。

</Admonition>

## インデックス作成と検索設定\{#index-building-and-search-settings}

インデックスの構築は、コレクション内のエンティティを特定の順序で整理し、結果をより迅速に取得できるようにするプロセスです。

Zilliz Cloud での浮動小数点ベクトルのインデックス作成は障害ではありません。インデックスタイプを **AUTOINDEX** に設定し、メトリックタイプを選択するだけで、Zilliz Cloud がインデックス作成と検索プロセスに最も適した構成を決定します。メトリックタイプはベクトル間の距離の測定方法を決定し、あなたが考慮する必要がある唯一のものです。

Milvus と Zilliz Cloud のインデックス作成設定の違いは以下に示されています:

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

検索パラメータ設定の違いは以下の通りです：

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

### `level` パラメータについて\{#about-the-level-parameter}

検索パフォーマンスの調整には、インデックスの種類によって異なるパラメータセットの調整が必要です。例えば、HNSW を使用する場合は `ef` パラメータを調整すべきですが、IVF を使用する場合は調整するパラメータは `nprobe` となります。最適な再現率と検索パフォーマンスのバランスを達成するには、使用しているインデックスの種類に固有のこれらのパラメータを微調整する必要があります。

Zilliz Cloud では、上記の複雑なパラメータセットをユーザーに任せるのではなく、検索パラメータの調整を簡素化するために統一されたパラメータ `level` を使用しています。

`level` パラメータを増加させると、再現率は高くなりますが、検索パフォーマンスが低下する可能性もあります。値のデフォルトは `1` で、`1` から `10` の範囲です。デフォルト値では再現率 90% が得られ、これはほとんどのユースケースで十分です。ただし、より高い再現率が必要な場合は、この値を増やしてください。

`level` パラメータを調整する際に `enable_recall_calculation` を `true` に設定することもでき、これにより異なる `level` 値での検索の精度を評価できます。

<Admonition type="info" icon="📘" title="Notes">

`level` および `enable_recall_calculation` パラメータはまだ **パブリックプレビュー** の段階であり、互換性の問題により完全に使用できない場合があります。サポートが必要な場合は、support@zilliz.com までお問い合わせください。

</Admonition>

## まとめ\{#conclusion}

本記事が、Zilliz Cloud 上のコレクション内の ベクトルフィールド のインデックス構築と最適化のプロセスを簡素化する強力なツールである AUTOINDEX の理解にお役立ていただけたことを願っています。検索およびインデックスに最も適した構成を自動的に決定することで、AUTOINDEX は従来の方法と比較してユーザーの時間と労力を節約します。パフォーマンス最適化済み クラスタでも 容量最適化済み クラスタでも、AUTOINDEX はニーズに合わせた最適化されたインデックスにより、より高速で効率的な検索の実現を支援します。AUTOINDEX または Zilliz Cloud のその他の機能についてご質問がある場合は、お気軽に当社チームまでお問い合わせください。喜んでお手伝いさせていただきます！