---
title: "メトリックタイプ | BYOC"
slug: /search-metrics-explained
sidebar_label: "メトリックタイプ"
beta: FALSE
notebook: FALSE
description: "類似度メトリクスは、ベクトル間の類似性を測定するために使用されます。適切な距離メトリックを選択することで、分類やクラスタリングのパフォーマンスを大幅に向上させることができます。| BYOC"
type: origin
token: EOxmwUDxMiy2cpkOfIsc1dYzn4c
sidebar_position: 22
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - collection
  - data
  - 検索メトリクス
  - メトリックタイプ
  - L2
  - IP
  - COSINE
  - Jaccard

---

import Admonition from '@theme/Admonition';


# メトリックタイプ

類似度メトリックは、ベクトル間の類似度を測定するために使用されます。適切な距離メトリックを選択することで、分類やクラスタリングのパフォーマンスを大幅に向上させることができます。

現在、Zilliz Cloud は以下の種類の類似度メトリックをサポートしています：ユークリッド距離 (`L2`)、内積 (`IP`)、コサイン類似度 (`COSINE`)、`JACCARD`、`HAMMING`、および `BM25`（疎ベクトルに対する全文検索用に特別に設計されています）。

以下の表は、異なるフィールドタイプとそれに対応するメトリックタイプのマッピングをまとめたものです。

<table>
   <tr>
     <th><p>フィールド型</p></th>
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
     <td><p><code>IP</code>, <code>BM25</code> (全文検索でのみ使用)</p></td>
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
<li><p><code>SPARSE\_FLOAT\_VECTOR</code> 型のベクトルフィールドの場合、全文検索を実行する場合にのみ <code>BM25</code> メトリックタイプを使用してください。詳細については、<a href="./full-text-search">全文検索</a> を参照してください。</p></li>
<li><p><code>BINARY_VECTOR</code> 型のベクトルフィールドの場合、次元値 (<code>dim</code>) は 8 の倍数である必要があります。</p></li>
</ul>

</Admonition>

以下の表は、サポートされているすべてのメトリックタイプの類似距離値の特性とその値の範囲をまとめたものです。

<table>
   <tr>
     <th><p>メトリックタイプ</p></th>
     <th><p>類似距離値の特性</p></th>
     <th><p>類似距離値の範囲</p></th>
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
     <td><p>MinHash シグネチャビットからジャカード類似度を推定します。距離が小さいほど類似度が高いことを意味します。</p></td>
     <td><p>[0, 1]</p></td>
   </tr>
   <tr>
     <td><p><code>HAMMING</code></p></td>
     <td><p>値が小さいほど類似度が高いことを示します。</p></td>
     <td><p>[0, dim(vector)]</p></td>
   </tr>
   <tr>
     <td><p><code>BM25</code></p></td>
     <td><p>項頻度、逆文書頻度、および文書正規化に基づいて関連性をスコアリングします。</p></td>
     <td><p>[0, ∞)</p></td>
   </tr>
</table>

## ユークリッド距離 (L2)\{#euclidean-distance-l2}

本質的に、ユークリッド距離は 2 つの点を結ぶ線分の長さを測定します。

ユークリッド距離の式は以下の通りです：

![C8gHbw8dSozNslx9wXbcyt2hnLe](https://zdoc-images.s3.us-west-2.amazonaws.com/c8ghbw8dsoznslx9wxbcyt2hnle.png "C8gHbw8dSozNslx9wXbcyt2hnLe")

ここで、**a = (a<sub>0</sub>, a<sub>1</sub>,..., a<sub>n-1</sub>)** および **b = (b<sub>0</sub>, b<sub>1</sub>,..., b<sub>n-1</sub>)** は n 次元ユークリッド空間内の 2 つの点です。

これは最も一般的に使用される距離メトリックであり、データが連続している場合に非常に有用です。

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud では、距離メトリックとしてユークリッド距離が選択された場合、平方根を適用する前の値のみを計算します。</p>

</Admonition>

## 内積 (IP)\{#inner-product-ip}

2 つの埋め込み間の IP 距離は以下のように定義されます：

![Dqp4b8OP3oaQWgxZqoycL3ainwg](https://zdoc-images.s3.us-west-2.amazonaws.com/dqp4b8op3oaqwgxzqoycl3ainwg.png "Dqp4b8OP3oaQWgxZqoycL3ainwg")

IP は、正規化されていないデータを比較する必要がある場合や、大きさ（マグニチュード）と角度を重視する場合により有用です。

<Admonition type="info" icon="📘" title="Notes">

<p>埋め込み間の類似度を計算するために IP を使用する場合は、埋め込みを正規化する必要があります。正規化後、内積はコサイン類似度と等しくなります。</p>

</Admonition>

X' が埋め込み X から正規化されたと仮定します：

![U23obWPTJoID9KxeGyjc1HAXn9d](https://zdoc-images.s3.us-west-2.amazonaws.com/u23obwptjoid9kxegyjc1haxn9d.png "U23obWPTJoID9KxeGyjc1HAXn9d")

2 つの埋め込み間の相関関係は以下のようになります：

![SHDAb6UUgo7qR6xLXb5cv4bKnke](https://zdoc-images.s3.us-west-2.amazonaws.com/shdab6uugo7qr6xlxb5cv4bknke.png "SHDAb6UUgo7qR6xLXb5cv4bKnke")

## コサイン類似度\{#cosine-similarity}

コサイン類似度は、2 つのベクトルセット間の角度のコサインを使用して、それらがどれだけ類似しているかを測定します。2 つのベクトルセットを、[0,0,...] と同じ点から始まりながら異なる方向を向く線分として考えることができます。

2 つのベクトルセット **A = (a<sub>0</sub>, a<sub>1</sub>,..., a<sub>n-1</sub>)** および **B = (b<sub>0</sub>, b<sub>1</sub>,..., b<sub>n-1</sub>)** の間のコサイン類似度を計算するには、以下の式を使用します：

![R1iNbuEDDoz8RdxtA4RcM706nMc](https://zdoc-images.s3.us-west-2.amazonaws.com/r1inbueddoz8rdxta4rcm706nmc.png "R1iNbuEDDoz8RdxtA4RcM706nMc")

コサイン類似度は常に **[-1, 1]** の区間にあります。例えば、比例する 2 つのベクトルのコサイン類似度は **1**、直交する 2 つのベクトルの類似度は **0**、反対方向を向く 2 つのベクトルの類似度は **-1** です。コサインが大きいほど、2 つのベクトル間の角度は小さくなり、これら 2 つのベクトルが互いにより類似していることを示します。

コサイン類似度を 1 から引くことで、2 つのベクトル間のコサイン距離を得ることができます。

## JACCARD 距離\{#jaccard-distance}

JACCARD 距離係数は 2 つのサンプルセット間の類似度を測定し、定義されたセットの共通部分の濃度を和集合の濃度で割ったものとして定義されます。これは有限のサンプルセットにのみ適用可能です。

![Sl4dbmQRVoIf1yx55mRcibZ3nAg](https://zdoc-images.s3.us-west-2.amazonaws.com/sl4dbmqrvoif1yx55mrcibz3nag.png "Sl4dbmQRVoIf1yx55mRcibZ3nAg")

JACCARD 距離はデータセット間の非類似度を測定し、JACCARD 類似度係数を 1 から引くことで得られます。二値変数の場合、JACCARD 距離は Tanimoto 係数と同等です。

![Kj2kbpNmHoTUUixjDC1ccTntnnV](https://zdoc-images.s3.us-west-2.amazonaws.com/kj2kbpnmhotuuixjdc1cctntnnv.png "Kj2kbpNmHoTUUixjDC1ccTntnnV")

## MHJACCARD\{#mhjaccard}

**MinHash Jaccard** (`MHJACCARD`) は、文書の単語セット、ユーザータグセット、またはゲノム k-mer セットなどの大規模なセットに対して効率的かつ近似的な類似度検索を行うために使用されるメトリックタイプです。生のセットを直接比較する代わりに、MHJACCARD は **MinHash シグネチャ** を比較します。これは、ジャカード類似度を効率的に推定するように設計されたコンパクトな表現です。

このアプローチは、正確なジャカード類似度を計算するよりも著しく高速であり、大規模または高次元のシナリオで特に有用です。

**適用可能なベクトル型**

- `BINARY_VECTOR`。各ベクトルは MinHash シグネチャを格納します。各要素は、元のセットに適用された独立したハッシュ関数の 1 つの下での最小ハッシュ値に対応します。

**距離の定義**

MHJACCARD は、2 つの MinHash シグネチャの中で一致する位置の数を測定します。一致率が高いほど、基礎となるセットはより類似しています。

Zilliz Cloud は以下を報告します：

- **距離 = 1 - 推定類似度（一致率）**

距離値の範囲は 0 から 1 です：

- **0** は MinHash シグネチャが同一であることを意味します（推定ジャカード類似度 = 1）

- **1** はどの位置でも一致がないことを意味します（推定ジャカード類似度 = 0）

技術的な詳細については、[MINHASH_LSH](./minhash-lsh) を参照してください。

## HAMMING 距離\{#hamming-distance}

HAMMING 距離はバイナリデータの文字列を測定します。等しい長さの 2 つの文字列間の距離は、ビットが異なるビット位置の数です。

例えば、2 つの文字列 1101 1001 と 1001 1101 があるとします。

11011001 ⊕ 10011101 = 01000100。これには 2 つの 1 が含まれているため、HAMMING 距離 d (11011001, 10011101) = 2 となります。

## BM25 類似度\{#bm25-similarity}

BM25 は広く使用されているテキスト関連性測定手法であり、特に [全文検索](./full-text-search) 用に設計されています。これは以下の 3 つの主要な要素を組み合わせています：

- **項頻度 (TF):** 項が文書内に出現する頻度を測定します。頻度が高いほど重要性が高いことが多いですが、BM25 は飽和パラメータ $k_1$ を使用して、過度に頻繁な項が関連性スコアを支配することを防ぎます。

- **逆文書頻度 (IDF):** コーパス全体における項の重要性を反映します。より少ない文書に出現する項は、より高い IDF 値を受け取り、関連性への寄与が大きいことを示します。

- **文書長正規化:** 長い文書はより多くの項を含む傾向があるため、スコアが高くなる傾向があります。BM25 は文書長を正規化することでこのバイアスを軽減し、パラメータ $b$ がこの正規化の強さを制御します。

BM25 スコアリングは以下のように計算されます：

$$
score(D, Q)=\sum_{i=1}^{n}IDF(q_i)\cdot {{TF(q_i,D)\cdot(k_1+1)}\over{TF(q_i, D)+k_1\cdot(1-b+b\cdot {{|D|}\over{avgdl}})}}
$$

パラメータの説明：

- $Q$: ユーザーによって提供されたクエリテキスト。

- $D$: 評価対象の文書。

- $TF(q_i, D)$: 項頻度。項 $q_i$ が文書 $D$ に出現する回数を表します。

- $IDF(q_i)$: 逆文書頻度。以下のように計算されます：

    $$
    IDF(q_i)=\log({N-n(q_i)+0.5\over n(q_i)+0.5} + 1)
    $$

    ここで、$N$ はコーパス内の文書の総数であり、$n(q_i)$ は項 $q_i$ を含む文書の数です。

- $|D|$: 文書 $D$ の長さ（項の総数）。

- $avgdl$: コーパス内のすべての文書の平均長。

- $k_1$: スコアに対する項頻度の影響を制御します。値が高いほど項頻度の重要性が増します。典型的な範囲は [1.2, 2.0] ですが、Zilliz Cloud では [0, 3] の範囲を許可しています。

- $b$: 長さ正規化の程度を制御し、0 から 1 の範囲です。値が 0 の場合、正規化は適用されません。値が 1 の場合、完全な正規化が適用されます。

## 最大類似度\{#maximum-similarity}

**最大類似度**（別名 **MAX_SIM**）は、単純なベクトル埋め込みではなく、ベクトル埋め込みリスト間の類似度を測定します。主な考え方は、各文書を文脈的なチャンクまたはトークンに分割し、それぞれのベクトル埋め込みを作成して、文書ごとに埋め込みリストとして保存することです。クエリを受信すると、それもトークンに分割され、それに応じて埋め込みリストが生成されます。

$$
score(Q, D) = \sum_{i=1}^m\max_{j=1}^ncos(e_{q_i}, e_{d_j})
$$

クエリと文書間の距離または類似度スコアは、上記の式を使用して計算されます。これは最大類似度 (**MAX_SIM**) と呼ばれます。式内の引数は以下の通りです：

- $Q$: ユーザーによって提供されたクエリテキスト。これはベクトル埋め込みリストに分割されており、$E_Q = [e_{q_1}, ..., e_{q_m} ]$ のようになります。

- $D$: 評価対象の文書。これはベクトル埋め込みリストに分割されており、$E_D = [e_{d_1}, ... e_{d_n}]$ のようになります。

- $e_{q_i}$: クエリ埋め込みリスト内の *i 番目* のベクトル埋め込み。

- $e_{d_j}$: 文書内の *j 番目* のベクトル埋め込み。

クエリと文書間の類似度スコアを決定するために、各クエリトークンのベクトル埋め込みを文書内のものと比較して、類似度スコアのリストを取得します。次に、すべてのスコアリストから最高スコアを合計して最終スコアを算出します。

![BqBlwM4OOh6hM9bmNwbc2xUUnxc](https://zdoc-images.s3.us-west-2.amazonaws.com/BqBlwM4OOh6hM9bmNwbc2xUUnxc.png)

Zilliz Cloud では、**MAX_SIM** を使用して、クエリと構造体の配列に保存された文書間の類似度を測定できます。

以下の表は、**MAX_SIM** シリーズで適用可能なメトリックタイプの一覧です：

<table>
   <tr>
     <th><p>メトリックタイプ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>MAX_SIM_L2</p></td>
     <td><p>各クエリトークンと各文書トークン間の距離を計算するために <strong>L2</strong> が使用され、複数のスコアリストが生成されます。その後、<strong>MAX_SIM</strong> によってすべてのスコアリストからの最高スコアを合計して最終スコアを決定します。</p></td>
   </tr>
   <tr>
     <td><p>MAX_SIM_IP</p></td>
     <td><p>各クエリトークンと各文書トークン間の距離を計算するために <strong>IP</strong> が使用され、複数のスコアリストが生成されます。その後、<strong>MAX_SIM</strong> によってすべてのスコアリストからの最高スコアを合計して最終スコアを決定します。</p></td>
   </tr>
   <tr>
     <td><p>MAX_SIM_COSINE</p></td>
     <td><p>各クエリトークンと各文書トークン間の距離を計算するために <strong>COSINE</strong> が使用され、複数のスコアリストが生成されます。その後、<strong>MAX_SIM</strong> によってすべてのスコアリストからの最高スコアを合計して最終スコアを決定します。</p></td>
   </tr>
</table>

