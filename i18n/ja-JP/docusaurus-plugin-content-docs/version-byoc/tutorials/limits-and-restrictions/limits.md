---
title: "Zilliz Cloud の制限 | BYOC"
slug: /limits
sidebar_label: "Zilliz Cloud の制限"
beta: FALSE
notebook: FALSE
description: "このページでは、Zilliz Cloud プラットフォームにおける制限について説明します。このページに記載されている設定の多くは、Zilliz が提供する OPS システムを使用して調整できます。さらにサポートが必要な場合は、お気軽にお問い合わせください。| BYOC"
type: origin
token: PuxkwMWvbiHxvTkHsVkcMZP9n5f
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - milvus
  - 制限

---

import Admonition from '@theme/Admonition';


# Zilliz Cloud の制限

このページでは、Zilliz Cloud プラットフォームにおける制限について説明します。このページに記載されている設定のほとんどは、Zilliz が提供する OPS システムを使用して調整できます。さらにサポートが必要な場合は、[お問い合わせ](https://support.zilliz.com/hc/en-us) ください。

## 組織とプロジェクト\{#organizations-and-projects}

以下の表は、単一ユーザーに対して許可される組織とプロジェクトの最大数を示しています。

<table>
   <tr>
     <th><p><strong>Item</strong></p></th>
     <th><p><strong>Max Number</strong></p></th>
     <th><p><strong>Remarks</strong></p></th>
   </tr>
   <tr>
     <td><p>Project</p></td>
     <td><p>100</p></td>
     <td><p>各ユーザーは、1 つの組織内で最大 100 個のプロジェクトを作成できます。</p></td>
   </tr>
</table>

## コレクション\{#collections}

Zilliz Cloud クラスター内のコレクションおよびパーティションの最大数は、割り当てられた CU 数と互換性のある Milvus のバージョンによって異なります。以下の説明を参照し、クラスター内のコレクションおよびパーティションの最大数を計算できます。

### Milvus v2.4.x と互換性のあるクラスター\{#clusters-compatible-with-milvus-v24x}

CU あたり最大 **256** 個のコレクションまたは **1,024** 個のパーティションを作成でき、コレクションあたりのパーティション数は最大 **1,024** 個まで許可されています。以下の式を使用して、クラスター内のコレクション数およびパーティション数の上限を計算できます。

![MhA4wDlMwhhXrvbFio6cS3LNnNe](https://zdoc-images.s3.us-west-2.amazonaws.com/MhA4wDlMwhhXrvbFio6cS3LNnNe.png)

- クラスター内のコレクションの総数は、クラスターの CU 数の 256 倍または 16,384 のいずれか小さい方未満である必要があります。

- クラスター内のすべてのコレクションにわたるパーティションの総数は、クラスターに割り当てられた CU 数の 1,024 倍または 65,536 のいずれか小さい方未満である必要があります。

- 両方の条件を満たす必要があります。

### Milvus v2.5.x と互換性のあるクラスター\{#cluster-compatible-with-milvus-v25x}

CU あたり最大 **1,024** 個のコレクションまたは **4,096** 個のパーティションを作成でき、コレクションあたりのパーティション数は最大 **1,024** 個まで許可されています。以下の式を使用して、クラスター内のコレクション数およびパーティション数の上限を計算できます。

![I1aJwA2LShihxQbyG30cFm14ngf](https://zdoc-images.s3.us-west-2.amazonaws.com/I1aJwA2LShihxQbyG30cFm14ngf.png)

- クラスター内のコレクションの総数は、クラスターの CU 数の 1,024 倍または 16,384 のいずれか小さい方未満である必要があります。

- クラスター内のすべてのコレクションにわたるパーティションの総数は、クラスターに割り当てられた CU 数の 4,096 倍または 65,536 のいずれか小さい方未満である必要があります。

- 両方の条件を満たす必要があります。

### フィールド\{#fields}

<table>
   <tr>
     <th><p><strong>Item</strong></p></th>
     <th><p><strong>Max Number</strong></p></th>
   </tr>
   <tr>
     <td><p>Fields per collection</p></td>
     <td><p>64</p></td>
   </tr>
   <tr>
     <td><p>Vector fields per collection</p></td>
     <td><p>10</p></td>
   </tr>
</table>

フィールドに関するその他の制限：

- VarChar や JSON などの一部のフィールドは、予想よりも多くのメモリを使用し、クラスターがいっぱいになる原因となることがあります。

### 次元数\{#dimensions}

ベクトルフィールドの最大次元数は **32,768** です。

### シャード\{#shards}

許可されるシャードの最大数は、クラスターの CU サイズによって異なります。

<table>
   <tr>
     <th><p>CU サイズ</p></th>
     <th><p>最大数</p></th>
   </tr>
   <tr>
     <td><p>1 - 2 CU</p></td>
     <td><p>2</p></td>
   </tr>
   <tr>
     <td><p>4 - 8 CU</p></td>
     <td><p>4</p></td>
   </tr>
   <tr>
     <td><p>12 - 64 CU</p></td>
     <td><p>8</p></td>
   </tr>
   <tr>
     <td><p>> 64 CU</p></td>
     <td><p>16</p></td>
   </tr>
</table>

### レート制限\{#rate-limit}

Zilliz Cloud では、コレクションおよびパーティションのデータ定義言語（DDL）操作（コレクションの作成、ロード、リリース、削除など）にもレート制限を課しています。以下のレート制限は、Serverless クラスターと Dedicated クラスターの両方のコレクションに適用されます。

<table>
   <tr>
     <th></th>
     <th><p><strong>Rate 制限</strong></p></th>
   </tr>
   <tr>
     <td><p>コレクション DDL 操作 </p><p>(create, load, release, drop)</p></td>
     <td><p>クラスタあたり 20 req/s</p></td>
   </tr>
   <tr>
     <td><p>パーティション DDL 操作</p><p>(create, load, release, drop)</p></td>
     <td><p>クラスタあたり 20 req/s</p></td>
   </tr>
</table>

## 運用\{#operations}

このセクションでは、Zilliz Cloud クラスターにおける一般的なデータ操作のレート制限に焦点を当てています。

### Insert\{#insert}

各挿入リクエスト/レスポンスは **64** MB を超えてはいけません。

適用されるレート制限は、クラスタイプと使用中の CU 数によって異なります。以下の表は、挿入操作のレート制限を示しています。

<table>
   <tr>
     <th></th>
     <th><p>Maximum Insert Rate 制限s</p></th>
   </tr>
   <tr>
     <td><p>[1 CU, 2 CUs]</p></td>
     <td><p>8 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[4 CUs,  8 CUs]</p></td>
     <td><p>12 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[12 CUs, 20 CUs]</p></td>
     <td><p>16 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[24 CUs, 64 CUs)</p></td>
     <td><p>24 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[64 CUs, 128CUs)</p></td>
     <td><p>36 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[128 CUs, 256CUs)</p></td>
     <td><p>48 MB/s</p></td>
   </tr>
   <tr>
     <td><blockquote>  <p>= 256 CUs</p></blockquote></td>
     <td><p>64 MB/s</p></td>
   </tr>
</table>

データを挿入する際は、スキーマで定義されたすべてのフィールドを含めてください。コレクションで AutoID が有効になっている場合、プライマリキーは除外してください。

挿入されたエンティティを検索やクエリですぐに取得可能にするには、検索またはクエリリクエストの一貫性レベルを **Strong** に変更することを検討してください。詳細については、[一貫性レベル](./consistency-level) をご覧ください。

### Upsert\{#upsert}

各アップサートリクエスト/レスポンスは **64** MB を超えてはいけません。

適用されるレート制限は、クラスタイプと使用中の CU 数によって異なります。以下の表は、アップサート操作のレート制限を示しています。

<table>
   <tr>
     <th></th>
     <th><p>最大アップサートレート制限</p></th>
   </tr>
   <tr>
     <td><p>[1 CU, 2 CUs]</p></td>
     <td><p>8 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[4 CUs,  8 CUs]</p></td>
     <td><p>12 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[12 CUs, 20 CUs]</p></td>
     <td><p>16 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[24 CUs, 64 CUs)</p></td>
     <td><p>24 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[64 CUs, 128CUs)</p></td>
     <td><p>36 MB/s</p></td>
   </tr>
   <tr>
     <td><p>[128 CUs, 256CUs)</p></td>
     <td><p>48 MB/s</p></td>
   </tr>
   <tr>
     <td><blockquote>  <p>= 256 CUs</p></blockquote></td>
     <td><p>64 MB/s</p></td>
   </tr>
</table>

データをアップサートする際は、スキーマで定義されたすべてのフィールドを含めてください。

アップサートされたエンティティを検索やクエリですぐに取得可能にするには、検索またはクエリリクエストの一貫性レベルを **Strong** に変更することを検討してください。詳細については、[一貫性レベル](./consistency-level) をご覧ください。

### インデックス\{#index}

インデックスタイプはフィールドタイプによって異なります。以下の表は、インデックス化可能なフィールドタイプと対応するインデックスタイプを示しています。

<table>
   <tr>
     <th><p><strong>フィールドタイプ</strong></p></th>
     <th><p><strong>インデックスタイプ</strong></p></th>
     <th><p><strong>メトリックタイプ</strong></p></th>
   </tr>
   <tr>
     <td><p>ベクトルフィールド</p></td>
     <td><p>AUTOINDEX</p></td>
     <td><p>L2, IP, および COSINE</p></td>
   </tr>
   <tr>
     <td><p>VarChar フィールド</p></td>
     <td><p>TRIE</p></td>
     <td><p>N/A</p></td>
   </tr>
   <tr>
     <td><p>Int8/16/32/64</p></td>
     <td><p>STL_SORT</p></td>
     <td><p>N/A</p></td>
   </tr>
   <tr>
     <td><p>Float32/64</p></td>
     <td><p>STL_SORT</p></td>
     <td><p>N/A</p></td>
   </tr>
</table>

### Flush\{#flush}

フラッシュリクエストのレート制限は 0.1 リクエスト/秒で、特定のクラスタイプにおいてコレクションレベルで課されます。このレート制限は、Milvus v2.4.x 以降と互換性のあるクラスターに適用されます。

<Admonition type="info" icon="📘" title="Notes">

<p>フラッシュ操作を手動で実行することは推奨されません。Zilliz Cloud クラスターが適切に処理します。</p>

</Admonition>

### Load\{#load}

ロードリクエストのレート制限は、クラスタあたり **20** req/s です。

<Admonition type="info" icon="📘" title="Notes">

<p>すでにロードされているコレクションに対しては、新しいデータがこれらのコレクションに入ってきても、コレクションのロード操作を行う必要はありません。</p>

</Admonition>

### Search\{#search}

各検索リクエスト/レスポンスは **64** MB を超えてはいけません。

各検索リクエストが運ぶクエリベクトルの数（通常 **nq** として知られています）は **16,384** を超えず、各検索レスポンスが運ぶ数（通常 **topK** として知られています）は返されるエンティティ数が **16,384** を超えないように制限されています。

### Query\{#query}

各クエリリクエスト/レスポンスは **64** MB を超えてはいけません。

各クエリレスポンスは、返されるエンティティ数が 16,384 を超えないように制限されています（通常 **topK** として知られています）。

### Delete\{#delete}

各削除リクエスト/レスポンスは **64** MB を超えてはいけません。

削除リクエストのレート制限は、クラスタあたり **0.5** MB/s です。

### Drop\{#drop}

削除（Drop）リクエストのレート制限は、クラスタあたり **20** req/s です。

### データインポート\{#data-import}

コレクション内で実行中または保留中のインポートジョブは最大 **10,000** 件まで可能です。

Zilliz Cloud では、Web コンソール上でインポートするファイルにも制限を設けています。

<table>
   <tr>
     <th><p>ファイルタイプ</p></th>
     <th><p>ローカルアップロード</p></th>
     <th><p>オブジェクトストレージから</p></th>
   </tr>
   <tr>
     <td><p>JSON</p></td>
     <td><p>1 GB</p></td>
     <td><p>最大合計インポートサイズは 1 TB で、各ファイルの最大サイズは 10 GB、ファイル数は最大 1,000 件です。</p></td>
   </tr>
   <tr>
     <td><p>Parquet</p></td>
     <td><p>1 GB</p></td>
     <td><p>最大合計インポートサイズは 1 TB で、各ファイルの最大サイズは 10 GB、ファイル数は最大 1,000 件です。</p></td>
   </tr>
   <tr>
     <td><p>Numpy</p></td>
     <td><p>非対応</p></td>
     <td><p>最大合計インポートサイズは 1 TB で、各サブディレクトリの最大サイズは 10 GB、サブディレクトリ数は最大 1,000 件です。</p></td>
   </tr>
</table>

詳細については、[ストレージオプション](./data-import-storage-options) および [フォーマットオプション](./data-import-format-options) を参照してください。

## コンソールでのバックアップ\{#backup-on-console}

手動で作成されたバックアップは永久に保持されます。

自動作成されたバックアップの最大保持期間は 30 日です。

## コンソールでの復元\{#restore-on-console}

スナップショットの元のクラスターと同じリージョンにあるスナップショットを復元できます。復元のターゲットクラスターは、元のクラスターと同じ CU タイプを使用する必要があります。

## IP アクセスリスト\{#ip-access-list}

<table>
   <tr>
     <th><p><strong>Item</strong></p></th>
     <th><p><strong>Max Number</strong></p></th>
     <th><p><strong>Remarks</strong></p></th>
   </tr>
   <tr>
     <td><p>コンソール IP アクセス</p></td>
     <td><p>100</p></td>
     <td><p>コンソールの IP 許可リストに最大 100 個の IP アドレスを追加できます。</p></td>
   </tr>
</table>

## マイグレーション\{#migration}

他のベンダーから Zilliz Cloud クラスターへデータをマイグレーションできます。マイグレーションごとのコレクションの最大数は、Zilliz Cloud クラスターによって異なります。マイグレーション時に一度にマイグレーションできるコレクションの最大数は **10** 個です。

