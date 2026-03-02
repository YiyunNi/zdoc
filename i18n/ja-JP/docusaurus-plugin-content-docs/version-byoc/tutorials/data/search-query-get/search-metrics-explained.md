---
title: "メトリックタイプ | BYOC"
slug: /search-metrics-explained
sidebar_label: "メトリックタイプ"
beta: FALSE
notebook: FALSE
description: "類似度メトリックは、ベクトル間の類似度を測定するために使用されます。適切な距離メトリックを選択することで、分類およびクラスタリングのパフォーマンスを大幅に向上させることができます。 | BYOC"
type: origin
token: EOxmwUDxMiy2cpkOfIsc1dYzn4c
sidebar_position: 21
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - データ
  - 検索メトリック
  - メトリックタイプ
  - L2
  - IP
  - COSINE
  - Jaccard
  - Chroma vector database
  - nlp search
  - hallucinations llm
  - Multimodal search

---

import Admonition from '@theme/Admonition';


# メトリックタイプ

類似度メトリックは、ベクトル間の類似度を測定するために使用されます。適切な距離メトリックを選択することは、分類およびクラスタリングのパフォーマンスを大幅に向上させるのに役立ちます。

現在、Zilliz Cloudは、ユークリッド距離（`L2`）、内積（`IP`）、コサイン類似度（`COSINE`）、`JACCARD`、`HAMMING`、および`BM25`（スパースベクトルに対するfull text search用に特別に設計されたもの）の類似度メトリックタイプをサポートしています。

以下の表は、異なるフィールドタイプとそれに対応するメトリックタイプのマッピングをまとめたものです。

<table>
   <tr>
     <th><p>フィールドタイプ</p></th>
     <th><p>次元範囲</p></th>
     <th><p>サポートされるメトリックタイプ</p></th>
     <th><p>デフォルトのメトリックタイプ</p></th>
   </tr>
   <tr>
     <td><p><code>FLOAT_VECTOR</code></p></td>
     <td><p>2-32,768</p></td>
     <td><p><code>COSINE</code>, <code>L2</code>, <code>IP</code></p></td>
     <td><p><code>COSINE</code></p></td>
   </tr>
   <tr>
     <td><p><code>FLOAT16_VECTOR</code></p></td>
     <td><p>2-32,768</p></td>
     <td><p><code>COSINE</code>, <code>L2</code>, <code>IP</code></p></td>
     <td><p><code>COSINE</code></p></td>
   </tr>
   <tr>
     <td><p><code>BFLOAT16_VECTOR</code></p></td>
     <td><p>2-32,768</p></td>
     <td><p><code>COSINE</code>, <code>L2</code>, <code>IP</code></p></td>
     <td><p><code>COSINE</code></p></td>
   </tr>
   <tr>
     <td><p><code>INT8_VECTOR</code></p></td>
     <td><p>2-32,768</p></td>
     <td><p><code>COSINE</code>, <code>L2</code>, <code>IP</code></p></td>
     <td><p><code>COSINE</code></p></td>
   </tr>
   <tr>
     <td><p><code>SPARSE\_FLOAT\_VECTOR</code></p></td>
     <td><p>次元を指定する必要はありません。</p></td>
     <td><p><code>IP</code>, <code>BM25</code> (full text searchのみで使用)</p></td>
     <td><p><code>IP</code></p></td>
   </tr>
   <tr>
     <td><p><code>BINARY_VECTOR</code></p></td>
     <td><p>8-32,768&ast;8</p></td>
     <td><p><code>HAMMING</code>, <code>JACCARD</code>, <code>MHJACCARD</code></p></td>
     <td><p><code>HAMMING</code></p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<ul>
<li><p><code>SPARSE\_FLOAT\_VECTOR</code>タイプのベクトルフィールドの場合、<code>BM25</code>メトリックタイプはfull text searchを実行する場合にのみ使用してください。詳細については、<a href="./full-text-search">Full Text Search</a>を参照してください。</p></li>
<li><p><code>BINARY_VECTOR</code>タイプのベクトルフィールドの場合、次元値（<code>dim</code>）は8の倍数である必要があります。</p></li>
</ul>

</Admonition>

以下の表は、サポートされているすべてのメトリックタイプの類似度距離値の特性と値の範囲をまとめたものです。

<table>
   <tr>
     <th><p>メトリックタイプ</p></th>
     <th><p>類似度距離値の特性</p></th>
     <th><p>類似度距離値の範囲</p></th>
   </tr>
   <tr>
     <td><p><code>L2</code></p></td>
     <td><p>値が小さいほど類似度が高いことを示します。</p></td>
     <td><p>[0, ∞)</p></td>
   </tr>
   <tr>
     <td><p><code>IP</code></p></td>
     <td><p>値が大きいほど類似度が高いことを示します。</p></td>
     <td><p>[-1, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>COSINE</code></p></td>
     <td><p>値が大きいほど類似度が高いことを示します。</p></td>
     <td><p>[-1, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>JACCARD</code></p></td>
     <td><p>値が小さいほど類似度が高いことを示します。</p></td>
     <td><p>[0, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>MHJACCARD</code></p></td>
     <td><p>MinHashシグネチャビットからJaccard類似度を推定します。距離が小さいほど類似度が高いことを示します。</p></td>
     <td><p>[0, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>HAMMING</code></p></td>
     <td><p>値が小さいほど類似度が高いことを示します。</p></td>
     <td><p>[0, dim(vector)]</p></td>
   </tr>
   <tr>
     <td><p><code>BM25</code></p></td>
     <td><p>用語の頻度、逆文書頻度、および文書の正規化に基づいて関連性をスコアリングします。</p></td>
     <td><p>[0, ∞)</p></td>
   </tr>
</table>

## ユークリッド距離 (L2){#euclidean-distance-l2}

本質的に、ユークリッド距離は2つの点を結ぶ線分の長さを測定します。

ユークリッド距離の公式は次のとおりです。

![C8gHbw8dSozNslx9wXbcyt2hnLe](https://zdoc-images.s3.us-west-2.amazonaws.com/c8ghbw8dsoznslx9wxbcyt2hnle.png "C8gHbw8dSozNslx9wXbcyt2hnLe")

ここで、**a = (a<sub>0</sub>, a<sub>1</sub>,..., a<sub>n-1</sub>)** と **b = (b<sub>0</sub>, b<sub>1</sub>,..., b<sub>n-1</sub>)** はn次元ユークリッド空間における2点です。

これは最も一般的に使用される距離メトリックであり、データが連続している場合に非常に役立ちます。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloudは、ユークリッド距離が距離メトリックとして選択された場合、平方根を適用する前の値のみを計算します。</p>

</Admonition>

## 内積 (IP){#inner-product-ip}

2つの埋め込み間のIP距離は次のように定義されます。

![Dqp4b8OP3oaQWgxZqoycL3ainwg](https://zdoc-images.s3.us-west-2.amazonaws.com/dqp4b8op3oaqwgxzqoycl3ainwg.png "Dqp4b8OP3oaQWgxZqoycL3ainwg")

IPは、正規化されていないデータを比較する必要がある場合や、大きさや角度が重要な場合に特に役立ちます。

<Admonition type="info" icon="📘" title="Notes">

<p>埋め込み間の類似度を計算するためにIPを使用する場合、埋め込みを正規化する必要があります。正規化後、内積はコサイン類似度と等しくなります。</p>

</Admonition>

X'が埋め込みXから正規化されていると仮定します。

![U23obWPTJoID9KxeGyjc1HAXn9d](https://zdoc-images.s3.us-west-2.amazonaws.com/u23obwptjoid9kxegyjc1haxn9d.png "U23obWPTJoID9KxeGyjc1HAXn9d")

2つの埋め込み間の相関は次のとおりです。

![SHDAb6UUgo7qR6xLXb5cv4bKnke](https://zdoc-images.s3.us-west-2.amazonaws.com/shdab6uugo7qr6xlxb5cv4bknke.png "SHDAb6UUgo7qR6xLXb5cv4bKnke")

## コサイン類似度{#cosine-similarity}

コサイン類似度は、2つのベクトルセット間の角度のコサインを使用して、それらがどれだけ類似しているかを測定します。2つのベクトルセットは、[0,0,...]のような同じ点から始まり、異なる方向を指す線分と考えることができます。

2つのベクトルセット **A = (a<sub>0</sub>, a<sub>1</sub>,..., a<sub>n-1</sub>)** と **B = (b<sub>0</sub>, b<sub>1</sub>,..., b<sub>n-1</sub>)** の間のコサイン類似度を計算するには、次の式を使用します。

![R1iNbuEDDoz8RdxtA4RcM706nMc](https://zdoc-images.s3.us-west-2.amazonaws.com/r1inbueddoz8rdxta4rcm706nmc.png "R1iNbuEDDoz8RdxtA4RcM706nMc")

コサイン類似度は常に **[-1, 1]** の範囲にあります。たとえば、2つの比例するベクトルはコサイン類似度が **1**、2つの直交するベクトルは類似度が **0**、2つの反対方向のベクトルは類似度が **-1** です。コサインが大きいほど、2つのベクトル間の角度は小さくなり、これらの2つのベクトルが互いに類似していることを示します。

コサイン類似度を1から引くことで、2つのベクトル間のコサイン距離を得ることができます。

## JACCARD距離{#jaccard-distance}

JACCARD距離係数は、2つのサンプルセット間の類似度を測定し、定義されたセットの共通部分の濃度をそれらの和集合の濃度で割ったものとして定義されます。これは有限のサンプルセットにのみ適用できます。

![Sl4dbmQRVoIf1yx55mRcibZ3nAg](https://zdoc-images.s3.us-west-2.amazonaws.com/sl4dbmqrvoif1yx55mrcibz3nag.png "Sl4dbmQRVoIf1yx55mRcibZ3nAg")

JACCARD距離はデータセット間の非類似度を測定し、JACCARD類似度係数を1から引くことで得られます。二値変数については、JACCARD距離はTanimoto係数と同等です。

![Kj2kbpNmHoTUUixjDC1ccTntnnV](https://zdoc-images.s3.us-west-2.amazonaws.com/kj2kbpnmhotuuixjdc1cctntnnv.png "Kj2kbpNmHoTUUixjDC1ccTntnnV")

## MHJACCARD{#mhjaccard}

**MinHash Jaccard** (`MHJACCARD`) は、文書の単語セット、ユーザーのタグセット、ゲノムのk-merセットなど、大規模なセットに対する効率的で近似的な類似度検索に使用されるメトリックタイプです。MHJACCARDは、生のセットを直接比較するのではなく、Jaccard類似度を効率的に推定するように設計されたコンパクトな表現である**MinHashシグネチャ**を比較します。

このアプローチは、正確なJaccard類似度を計算するよりも大幅に高速であり、大規模または高次元のシナリオで特に役立ちます。

**適用可能なベクトルタイプ**

- `BINARY_VECTOR`。各ベクトルはMinHashシグネチャを格納します。各要素は、元のセットに適用された独立したハッシュ関数のいずれかの最小ハッシュ値に対応します。

**距離の定義**

MHJACCARDは、2つのMinHashシグネチャで一致する位置の数を測定します。一致率が高いほど、基になるセットはより類似しています。

Zilliz Cloudは以下を報告します。

- **距離 = 1 - 推定類似度 (一致率)**

距離値の範囲は0から1です。

- **0** はMinHashシグネチャが同一であることを意味します（推定Jaccard類似度 = 1）。

- **1** はどの位置でも一致がないことを意味します（推定Jaccard類似度 = 0）。

技術的な詳細については、[MINHASH_LSH](./minhash-lsh)を参照してください。

## ハミング距離{#hamming-distance}

ハミング距離はバイナリデータ文字列を測定します。同じ長さの2つの文字列間の距離は、ビットが異なるビット位置の数です。

たとえば、1101 1001 と 1001 1101 の2つの文字列があるとします。

11011001 ⊕ 10011101 = 01000100。これには2つの1が含まれているため、ハミング距離 d (11011001, 10011101) = 2 です。

## BM25類似度{#bm25-similarity}

BM25は、[full text search](./full-text-search)のために特別に設計された、広く使用されているテキスト関連性測定方法です。以下の3つの主要な要素を組み合わせています。

- **用語頻度 (TF):** 文書内で用語がどれだけ頻繁に出現するかを測定します。頻度が高いほど重要度が高いことを示すことが多いですが、BM25は飽和パラメータ $k_1$ を使用して、過度に頻繁な用語が関連性スコアを支配するのを防ぎます。

- **逆文書頻度 (IDF):** コーパス全体における用語の重要性を反映します。出現する文書が少ない用語ほどIDF値が高くなり、関連性への貢献度が高いことを示します。

- **文書長正規化:** 長い文書は、より多くの用語を含むため、スコアが高くなる傾向があります。BM25は、パラメータ $b$ でこの正規化の強度を制御することで、このバイアスを軽減します。

BM25スコアリングは次のように計算されます。

$$
score(D, Q)=\sum_{i=1}^{n}IDF(q_i)\cdot \{\{TF(q_i,D)\cdot(k_1+1)}\over\{TF(q_i, D)+k_1\cdot(1-b+b\cdot \{\{|D|}\over{avgdl}})}}
$$

パラメータの説明:

- $Q$: ユーザーが提供するクエリテキスト。

- $D$: 評価対象の文書。

- $TF(q_i, D)$: 用語頻度。文書 $D$ における用語 $q_i$ の出現回数を表します。

- $IDF(q_i)$: 逆文書頻度。次のように計算されます。

    $$
    IDF(q_i)=\log(\{N-n(q_i)+0.5\over n(q_i)+0.5} + 1)
    $$

    ここで、$N$ はコーパス内の文書の総数、$n(q_i)$ は用語 $q_i$ を含む文書の数です。

- $|D|$: 文書 $D$ の長さ（用語の総数）。

- $avgdl$: コーパス内のすべての文書の平均長。

- $k_1$: 用語頻度がスコアに与える影響を制御します。値が高いほど、用語頻度の重要性が増します。一般的な範囲は [1.2, 2.0] ですが、Zilliz Cloudでは [0, 3] の範囲を許可しています。

- $b$: 長さ正規化の度合いを制御し、0から1の範囲です。値が0の場合、正規化は適用されません。値が1の場合、完全な正規化が適用されます。

## 最大類似度{#maximum-similarity}

**最大類似度**（**MAX_SIM**とも呼ばれる）は、単純なベクトル埋め込みではなく、ベクトル埋め込みリスト間の類似度を測定します。主なアイデアは、各ドキュメントをコンテキストチャンクまたはトークンに分割し、それぞれにベクトル埋め込みを作成し、それらをドキュメントごとの埋め込みリストとして保存することです。クエリが受信されると、それもトークンに分割され、それに応じて埋め込みリストが生成されます。

$$
score(Q, D) = \sum_{i=1}^m\max_{j=1}^ncos(e_{q_i}, e_{d_j})
$$

クエリとドキュメント間の距離または類似度スコアは、最大類似度（**MAX_SIM**）として知られる上記の式を使用して計算されます。式中の引数は次のとおりです。

- $Q$: ユーザーが提供するクエリテキスト。$E_Q = [e_{q_1}, ..., e_{q_m} ]$ のようにベクトル埋め込みリストに分割されています。

- $D$: 評価対象のドキュメント。$E_D = [e_{d_1}, ... e_{d_n}]$ のようにベクトル埋め込みリストに分割されています。

- $e_{q_i}$: クエリ埋め込みリスト内の*i番目*のベクトル埋め込み。

- $e_{d_j}$: ドキュメント内の*j番目*のベクトル埋め込み。

クエリとドキュメント間の類似度スコアを決定するために、各クエリトークンのベクトル埋め込みがドキュメント内のベクトル埋め込みと比較され、類似度スコアのリストが取得されます。次に、すべてのスコアリストから最高のスコアが合計され、最終スコアが生成されます。

![BqBlwM4OOh6hM9bmNwbc2xUUnxc](https://zdoc-images.s3.us-west-2.amazonaws.com/BqBlwM4OOh6hM9bmNwbc2xUUnxc.png)

Zilliz Cloudでは、**MAX_SIM**を使用して、クエリと構造体の配列に格納されたドキュメント間の類似度を測定できます。

以下の表は、**MAX_SIM**シリーズに適用可能なメトリックタイプをリストしています。

<table>
   <tr>
     <th><p>メトリックタイプ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>MAX_SIM_L2</p></td>
     <td><p><strong>L2</strong>は、各クエリトークンと各ドキュメントトークン間の距離を計算するために使用され、複数のスコアリストを生成します。一方、<strong>MAX_SIM</strong>は、すべてのスコアリストから最高のスコアを合計することで最終スコアを決定します。</p></td>
   </tr>
   <tr>
     <td><p>MAX_SIM_IP</p></td>
     <td><p><strong>IP</strong>は、各クエリトークンと各ドキュメントトークン間の距離を計算するために使用され、複数のスコアリストを生成します。一方、<strong>MAX_SIM</strong>は、すべてのスコアリストから最高のスコアを合計することで最終スコアを決定します。</p></td>
   </tr>
   <tr>
     <td><p>MAX_SIM_COSINE</p></td>
     <td><p><strong>COSINE</strong>は、各クエリトークンと各ドキュメントトークン間の距離を計算するために使用され、複数のスコアリストを生成します。一方、<strong>MAX_SIM</strong>は、すべてのスコアリストから最高のスコアを合計することで最終スコアを決定します。</p></td>
   </tr>
</table>

