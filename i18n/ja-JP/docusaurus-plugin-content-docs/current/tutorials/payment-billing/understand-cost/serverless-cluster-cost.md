---
title: "Serverless Cluster のコスト | Cloud"
slug: /serverless-cluster-cost
sidebar_label: "Serverless Cluster"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud の Serverless Cluster は、操作ごとの従量課金モデルを採用しており、主に読み取りおよび書き込み操作によって消費されるリソースに対して課金されます。これにより、事前に固定容量をプロビジョニングすることなく、実際に処理されたワークロードに対してのみ料金を支払うことができます。"
type: origin
token: Uk0Nw1ZdbiOEBtkAOKacLTf8nGe
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - サーバーレス
  - コスト
  - 請求
  - Deep Learning
  - ナレッジベース
  - 自然言語処理
  - AIチャットボット

---

import Admonition from '@theme/Admonition';


# サーバーレスクラスターのコスト

Zilliz Cloudのサーバーレスクラスターは、従量課金モデルを採用しており、主に読み取りおよび書き込み操作によって消費されるリソースに対して課金されます。これにより、固定容量を事前にプロビジョニングすることなく、実際に処理されたワークロードに対してのみ料金を支払うことができます。

サーバーレスクラスターの総コストは、以下のコンポーネントの合計です。

- [読み取り](./serverless-cluster-cost#vector-database-costs-read)および[書き込み](./serverless-cluster-cost#vector-database-costs-write)操作の両方に対するベクターデータベースコスト

- [ストレージコスト](./serverless-cluster-cost#storage-cost)

上記の2つの主要な請求項目に加えて、以下のオプションのアドオン料金が適用される場合があります。

- [データ転送コスト](./data-transfer-cost)

- [監査ログコスト](./audit-log-cost)

## ベクターデータベースコスト (書き込み){#vector-database-costs-write}

書き込みコストは、[挿入、更新、および削除操作](./insert-update-delete)によって消費されるコンピューティングリソースを測定します。

インポートおよび一括挿入操作は、コストを発生させません。

### コスト計算{#cost-calculation}

```bash
Vector Database Cost (Write) = vCU Unit Price x Write vCU Usage 
```

- **vCU単価:** 100万vCUあたり4ドル。

- **書き込みvCU使用量:** 書き込み操作に関わるデータサイズに基づいて計算されます。

### 例{#example}

以下の表は、Serverlessクラスターに特定の量のデータを書き込む際のvCU使用量とコストの早見表です。

より大きなデータセットの場合、vCU使用量とコストを比例してスケールしてください。例えば、1,000万個の768次元ベクトルを書き込む場合、約750万vCUを使用し、コストは約30ドルになります。

<table>
   <tr>
     <th><p><strong>データサイズ (&ast;)</strong></p></th>
     <th><p><strong>書き込みvCU使用量 (百万)</strong></p></th>
     <th><p><strong>書き込みコスト</strong></p></th>
   </tr>
   <tr>
     <td><p>100万個の128次元ベクトル</p></td>
     <td><p>0.125</p></td>
     <td><p>&#36;0.5</p></td>
   </tr>
   <tr>
     <td><p>100万個の768次元ベクトル</p></td>
     <td><p>0.75</p></td>
     <td><p>&#36;3</p></td>
   </tr>
   <tr>
     <td><p>100万個の1536次元ベクトル</p></td>
     <td><p>1.5</p></td>
     <td><p>&#36;6</p></td>
   </tr>
   <tr>
     <td><p>100万個の2560次元ベクトル</p></td>
     <td><p>2.5</p></td>
     <td><p>&#36;10</p></td>
   </tr>
</table>

*&ast;上記の表のデータサイズにはスカラーは含まれません。*

*&ast;スキーマに複数のベクトルフィールドが含まれている場合、書き込みコストは線形に増加します。例えば、スキーマに2つの128次元ベクトルフィールドがある場合、100万エンティティを書き込むためのvCU使用量は0.125 × 2 = 0.25となり、書き込みコストは約&#36;0.5 × 2 = &#36;1となります。*

書き込みvCU使用量とコストの正確な計算については、以下のメトリクスを参照してください。

<table>
   <tr>
     <th><p><strong>操作</strong></p></th>
     <th><p><strong>vCU使用量</strong></p></th>
   </tr>
   <tr>
     <td><p>Insert</p></td>
     <td><p>挿入されたデータ1 KB = 0.25 vCU</p></td>
   </tr>
   <tr>
     <td><p>Delete</p></td>
     <td><p>削除されたエンティティ1つ = 1 vCU</p><p>存在しないエンティティを削除する場合も1 vCUを消費します。</p></td>
   </tr>
   <tr>
     <td><p>Upsert</p></td>
     <td><p>更新されたデータのサイズと削除されたエンティティの数に基づいて計算されます。</p><p>存在しないエンティティを削除する場合も1 vCUを消費します。</p></td>
   </tr>
</table>

Serverlessクラスターに3 GB (3,145,728 KB) のエンティティを挿入し、その後100,000個のエンティティを削除したとします。

- `Insert操作のvCU使用量 = 3,145,728 x 0.25 = 78,643 vCUs`

- `Delete操作のvCU使用量 = 100,000 x 1 = 100,000 vCUs`

- `合計vCU使用量 = 1,000 + 78,643 = 178,643 vCUs`

- `合計ベクトルデータベースコスト (書き込み) = 0.178643 x 4 = $0.72`

## ベクトルデータベースコスト (読み取り){#vector-database-costs-read}

このコスト項目は、[検索、ハイブリッド検索、およびクエリ操作](./search-query-get)によって消費されるリソースを測定します。

### コスト計算{#cost-calculation}

```bash
Vector Database Cost (Read) = vCU Unit Price x Read vCU Usage 
```

- **vCU単価:** 100万vCUあたり4ドル

- **読み取りvCU使用量:** 以下の3つの要因によって異なります。

    - 検索またはクエリリクエストの数: 検索またはクエリを実行する回数が多いほど、vCU使用量が増加します。

    - 各検索またはクエリでスキャンされるデータのサイズ: スキャンされるデータが多いほど、vCU使用量が増加します。

        *ヒント: 各検索またはクエリ中に、Zilliz Cloudはクラスター内のcollection全体をスキャンします。検索またはクエリ中に[パーティションキー](./use-partition-key)をフィルターとして使用すると、Zilliz Cloudは指定されたパーティションキーに一致するcollectionの一部のみをスキャンするため、全体の読み取りvCU使用量を削減できます。*

    - 各検索またはクエリで返されるデータのサイズ: 返されるデータが多いほど、vCU使用量が増加します。たとえば、検索でベクトルフィールドを含むすべてのフィールドを返すと、IDフィールドのみを返す検索よりもはるかに多くのvCUを消費します。

    <Admonition type="info" icon="📘" title="Notes">

    <p>各読み取り操作には最低6 vCUのコストがかかります。</p>

    </Admonition>

### 例\{#example}

以下の表は、さまざまな量のデータに対する100万回の読み取りリクエストのvCU使用量とコストの例を示しています。

<table>
   <tr>
     <th><p><strong>スキャンデータサイズ (&ast;)</strong></p></th>
     <th><p><strong>読み取りvCU使用量 (百万)</strong></p></th>
     <th><p><strong>読み取りコスト</strong></p></th>
   </tr>
   <tr>
     <td><p>100万個の128次元ベクトル</p></td>
     <td><p>5</p></td>
     <td><p>&#36;20</p></td>
   </tr>
   <tr>
     <td><p>100万個の768次元ベクトル</p></td>
     <td><p>15</p></td>
     <td><p>&#36;60</p></td>
   </tr>
   <tr>
     <td><p>500万個の768次元ベクトル</p></td>
     <td><p>35</p></td>
     <td><p>&#36;140</p></td>
   </tr>
   <tr>
     <td><p>1000万個の768次元ベクトル</p></td>
     <td><p>55</p></td>
     <td><p>&#36;220</p></td>
   </tr>
   <tr>
     <td><p>100万個の1536次元ベクトル</p></td>
     <td><p>25</p></td>
     <td><p>&#36;100</p></td>
   </tr>
   <tr>
     <td><p>1000万個の1536次元ベクトル</p></td>
     <td><p>75</p></td>
     <td><p>&#36;300</p></td>
   </tr>
   <tr>
     <td><p>1億個の1536次元ベクトル</p></td>
     <td><p>290</p></td>
     <td><p>&#36;1160</p></td>
   </tr>
   <tr>
     <td><p>100億個の1536次元ベクトル</p></td>
     <td><p>1,495</p></td>
     <td><p>&#36;5980</p></td>
   </tr>
   <tr>
     <td><p>100万個の2560次元ベクトル</p></td>
     <td><p>30</p></td>
     <td><p>&#36;120</p></td>
   </tr>
</table>

*&ast;上記の表のデータサイズにはスカラーは含まれていません。*

上記の表から、データサイズが100万から1000万、さらには1億に増加しても、vCU使用量は比例して増加しないことがわかります。

## ストレージコスト\{#storage-cost}

ストレージコストはベクトルデータベースのコストとは別に請求され、以下に依存します。

- クラスターリージョン、クラスタータイプ、プロジェクトプラン

- ストレージ使用量

詳細については、[ストレージ](./storage-cost)を参照してください。

