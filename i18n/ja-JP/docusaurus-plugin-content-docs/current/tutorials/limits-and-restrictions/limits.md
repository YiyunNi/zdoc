---
title: "Zilliz Cloud の制限 | Cloud"
slug: /limits
sidebar_label: "Zilliz Cloud の制限"
beta: FALSE
notebook: FALSE
description: "このページでは、Zilliz Cloud プラットフォームにおける制限について説明します。これらの制限に関連する問題を報告する必要がある場合は、お問い合わせください。| Cloud"
type: origin
token: PuxkwMWvbiHxvTkHsVkcMZP9n5f
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - milvus
  - 制限

---

import Admonition from '@theme/Admonition';


# Zilliz Cloud 制限

このページでは、Zilliz Cloud プラットフォームの制限について説明します。これらの制限に関連する問題を報告する必要がある場合は、[サポートリクエストを送信](https://support.zilliz.com/hc/en-us) してください。

## 組織 & プロジェクト\{#organizations-and-projects}

以下の表は、単一ユーザーに対して許可される組織とプロジェクトの最大数の制限を一覧表示しています。

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>Organization</p></td>
     <td><p>1</p></td>
     <td><p>Zilliz Cloud は、アカウント登録が完了すると自動的に 1 つの組織を作成します。さらに多くの組織が必要な場合は、<a href="http://support.zilliz.com">サポートチケットを作成</a>してください。ユーザーは複数の組織に参加できます。</p></td>
   </tr>
   <tr>
     <td><p>Project</p></td>
     <td><p>100</p></td>
     <td><p>各ユーザーは、1 つの組織内で最大 100 個のプロジェクトを作成できます。</p></td>
   </tr>
</table>

## Users & ロールs\{#users-and-roles}

以下の表は、Zilliz Cloud で許可されるユーザーの最大数の制限を一覧表示しています。

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>Organization User</p></td>
     <td><p>100</p></td>
     <td><p>組織には、合計で最大 100 人の組織ユーザーを含めることができます。</p></td>
   </tr>
   <tr>
     <td><p>Cluster User</p></td>
     <td><p>100</p></td>
     <td><p>クラスターには、合計で最大 100 人のユーザーを含めることができます。</p></td>
   </tr>
   <tr>
     <td><p>Cluster Custom ロール</p></td>
     <td><p>20</p></td>
     <td><p>クラスターには、合計で最大 20 個のカスタムロールを含めることができます。この制限を解除するには、<a href="http://support.zilliz.com">お問い合わせ</a>ください。</p></td>
   </tr>
</table>

## APIキーs\{#api-keys}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>APIキー</p></td>
     <td><p>100</p></td>
     <td><p>最適なリソース活用とセキュリティのため、各組織に含めることができるカスタマイズされた API キーの最大数は 100 です。</p></td>
   </tr>
</table>

## Console IP Allowlist\{#console-ip-allowlist}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>組織コンソールの IP 許可リスト内の IP</p></td>
     <td><p>100</p></td>
     <td><p>各組織コンソールの IP 許可リストには、最大 100 個の IP アドレスまたは CIDR ブロックを含めることができます。</p></td>
   </tr>
</table>

## ボリュームs\{#volumes}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>ボリューム</p></td>
     <td><p>100</p></td>
     <td><p>各組織に含めることができるボリュームの最大数は 100 です。</p></td>
   </tr>
</table>

## Clusters\{#clusters}

### Number of clusters\{#number-of-clusters}

クラスターの最大数は、お支払い方法とデプロイオプションによって異なります。

- **有効なお支払い方法がない場合**

    <table>
       <tr>
         <th><p><strong>クラスターデプロイオプション</strong></p></th>
         <th><p><strong>最大数</strong></p></th>
         <th><p><strong>備考</strong></p></th>
       </tr>
       <tr>
         <td><p>Free</p></td>
         <td><p>1</p></td>
         <td><p>各組織で許可される Free クラスターは 1 つのみです。必要に応じて、既存の Free クラスターを削除し、新しいものと置き換えることができます。</p></td>
       </tr>
       <tr>
         <td><p>Serverless/Dedicated</p></td>
         <td><p>1</p></td>
         <td><p>無料トライアル期間中は、Serverless/Dedicated クラスターを 1 つのみ作成できます。追加のクラスターが必要な場合は、お支払い方法を追加してください。</p></td>
       </tr>
    </table>

- **有効なお支払い方法がある場合**

    <table>
       <tr>
         <th><p><strong>クラスターデプロイオプション</strong></p></th>
         <th><p><strong>最大数</strong></p></th>
         <th><p><strong>備考</strong></p></th>
       </tr>
       <tr>
         <td><p>Free</p></td>
         <td><p>1</p></td>
         <td><p>各組織で許可される Free クラスターは 1 つのみです。必要に応じて、既存の Free クラスターを削除し、新しいものと置き換えることができます。</p></td>
       </tr>
       <tr>
         <td><p>Serverless</p></td>
         <td><p>N/A</p></td>
         <td><p>N/A</p></td>
       </tr>
       <tr>
         <td><p>Dedicated</p></td>
         <td><p>Total CU size &lt; 320</p></td>
         <td><p>組織内のクラスターの最大数は、クラスター CU の総量に依存します。組織内のすべての Dedicated クラスターの CU 数の累積値は 320 を超えてはいけません。</p></td>
       </tr>
    </table>

### CUs\{#cus}

CU は、データの並列処理に使用されるコンピューティングリソースの基本単位であり、異なる CU タイプは CPU、メモリ、ストレージのさまざまな組み合わせで構成されます。CU の概念は Dedicated クラスターにのみ適用されます。

<table>
   <tr>
     <th><p><strong>Project Plan & クラスターデプロイオプション</strong></p></th>
     <th><p><strong>制限</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>Standard プロジェクト内の Dedicated cluster</p></td>
     <td><p>CU size x Replica Count &lt;=32</p></td>
     <td><p>コンソールでは、単一のクラスターに対して最大 32 CUs を作成できます。</p><p>ただし、レプリカを追加する場合、制限は CU size x Replica Count &lt;=32 となります。</p></td>
   </tr>
   <tr>
     <td><p>Enterprise プロジェクト内の Dedicated cluster</p></td>
     <td><p>CU size x Replica Count &lt;=1,024</p></td>
     <td><p>コンソールでは、単一のクラスターに対して最大 1,024 CUs を作成できます。</p><p>ただし、レプリカを追加する場合、制限は CU size x Replica Count &lt;=1,024 となります。</p></td>
   </tr>
</table>

以下の場合、[お問い合わせ](https://support.zilliz.com/hc/en-us) ください。

- Standard プロジェクト内の Dedicated クラスターで 32 CUs 以上が必要な場合

- Enterprise プロジェクト内の Dedicated クラスターで 1,024 CUs 以上が必要な場合

### vCUs\{#vcus}

仮想コンピューティングユニット (vCU) は、読み取り操作（検索やクエリなど）および書き込み操作（挿入、アップサート、削除など）によって消費されるリソースを測定するために使用されます。vCU の概念は Free および Serverless クラスターにのみ適用されます。

<table>
   <tr>
     <th><p><strong>Cluster Plan</strong></p></th>
     <th><p><strong>制限</strong></p></th>
   </tr>
   <tr>
     <td><p>Free</p></td>
     <td><p>月間 250 万 vCUs</p></td>
   </tr>
   <tr>
     <td><p>Serverless</p></td>
     <td><p>N/A</p></td>
   </tr>
</table>

### Capacity\{#capacity}

以下の表は、各タイプのクラスタープランの容量に関する制限を一覧表示しています。

<table>
   <tr>
     <th><p><strong>Cluster Plan</strong></p></th>
     <th><p><strong>制限</strong></p></th>
   </tr>
   <tr>
     <td><p>Free</p></td>
     <td><p>クラスターあたり 5 GB（クラスターあたり 100 万個の 768 次元ベクトルに相当）</p></td>
   </tr>
   <tr>
     <td><p>Serverless</p></td>
     <td><p>Zilliz Cloud の Serverless クラスターには容量制限がありません。</p></td>
   </tr>
   <tr>
     <td><p>Dedicated (per CU)</p></td>
     <td><p>Zilliz Cloud の Dedicated クラスターには容量制限がありません。</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>Dedicated クラスターの容量の上限は、使用される CU タイプとサイズに依存します。クラスターの容量が不足している場合は、CU タイプとサイズの調整を検討してください。詳細については、<a href="./scale-query-cu">クラスターのスケール</a>をご覧ください。</p>

</Admonition>

## Replicas\{#replicas}

レプリカを追加するには、クラスターに**8 CUs 以上**が必要です。以下の制限も適用されます。

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>制限</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>Replica</p></td>
     <td><p>10</p></td>
     <td><p>最大 10 個のレプリカを作成できます。</p></td>
   </tr>
   <tr>
     <td><p>レプリカ数 x CU size</p></td>
     <td><p>&lt;= 256</p></td>
     <td><p>クラスターの CU サイズ x レプリカ数は 256 を超えてはいけません。</p></td>
   </tr>
</table>

## データベースs\{#databases}

- データベースは Dedicated クラスターでのみ作成できます。

- 各 Dedicated クラスターには、最大 1024 個のデータベースを含めることができます。

- デフォルトのデータベースは削除できません。

## Collections\{#collections}

Zilliz Cloud クラスター内のコレクションとパーティションの最大数は、割り当てられた CU 数と互換性のある Milvus バージョンによって異なります。以下の説明を参照して、クラスター内のコレクションとパーティションの最大数を計算できます。

CU あたり最大**1,024**個のコレクションまたは**4,096**個のパーティションを作成でき、コレクションあたりのパーティション数は最大**1,024**個まで許可されています。以下の式を使用して、クラスター内のコレクション数とパーティション数の上限を計算できます。

![I1aJwA2LShihxQbyG30cFm14ngf](https://zdoc-images.s3.us-west-2.amazonaws.com/I1aJwA2LShihxQbyG30cFm14ngf.png)

- クラスター内のコレクションの総数は、クラスター内の CU 数の 1,024 倍または 16,384 のいずれか小さい方未満である必要があります。

- クラスター内のすべてのコレクションにわたるパーティションの総数は、クラスターに割り当てられた CU 数の 4,096 倍または 65,536 のいずれか小さい方未満である必要があります。

- 両方の条件を満たす必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p><strong>Free</strong>および<strong>Serverless</strong>クラスターの場合、代わりに以下の制限が適用されます。</p>
<ul>
<li><p><strong>Free</strong>クラスターでは、最大<strong>5</strong>個のコレクションが許可されます。</p></li>
<li><p><strong>Serverless</strong>クラスターでは、最大<strong>100</strong>個のコレクションがサポートされます。</p></li>
</ul>

</Admonition>

### Fields\{#fields}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
   </tr>
   <tr>
     <td><p>コレクションあたりのフィールド数</p></td>
     <td><p>64</p></td>
   </tr>
   <tr>
     <td><p>コレクションあたりの Vector fields</p></td>
     <td><ul><li><p>Free & Serverless: 4</p></li><li><p>Dedicated: 10</p></li></ul></td>
   </tr>
</table>

フィールドに関するその他の制限：

- VarChar や JSON などの一部のフィールドは、予想よりも多くのメモリを使用し、クラスターがいっぱいになる原因となることがあります。

### Dimensions\{#dimensions}

ベクトルフィールドの次元数の最大値は**32,768**です。

### Shards\{#shards}

許可されるシャードの最大数は、クラスタープランとクラスターの CU サイズによって異なります。

<table>
   <tr>
     <th colspan="2"><p><strong>Cluster Plan & CU Size</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
   </tr>
   <tr>
     <td colspan="2"><p>Free</p></td>
     <td><p>2</p></td>
   </tr>
   <tr>
     <td colspan="2"><p>Serverless</p></td>
     <td><p>2</p></td>
   </tr>
   <tr>
     <td rowspan="4"><p>Dedicated</p></td>
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

### Rate limit\{#rate-limit}

Zilliz Cloud は、コレクションおよびパーティションのデータ定義言語 (DDL) 操作（コレクションの作成、ロード、リリース、削除など）にもレート制限を課しています。以下のレート制限は、Serverless および Dedicated クラスターの両方のコレクションに適用されます。

<table>
   <tr>
     <th></th>
     <th><p><strong>Rate 制限</strong></p></th>
   </tr>
   <tr>
     <td><p>Collection DDL Operation </p><p>(create, load, release, drop)</p></td>
     <td><p>クラスターあたり 20 req/s</p></td>
   </tr>
   <tr>
     <td><p>Partition DDL Operation</p><p>(create, load, release, drop)</p></td>
     <td><p>クラスターあたり 20 req/s</p></td>
   </tr>
</table>

## 運用\{#operations}

このセクションでは、Zilliz Cloud クラスターにおける一般的なデータ操作のレート制限に焦点を当てています。

### Insert\{#insert}

各挿入リクエスト/レスポンスは**64**MB を超えてはいけません。

適用されるレート制限は、クラスタイプと使用中の CU 数によって異なります。以下の表は、挿入操作のレート制限を一覧表示しています。

<table>
   <tr>
     <th></th>
     <th><p>最大挿入レート制限</p></th>
   </tr>
   <tr>
     <td><p>Free cluster</p></td>
     <td><p>2 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Serverless cluster</p></td>
     <td><p>10 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [1 CU, 2 CUs]</p></td>
     <td><p>8 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [4 CUs,  8 CUs]</p></td>
     <td><p>12 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [12 CUs, 20 CUs]</p></td>
     <td><p>16 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [24 CUs, 64 CUs)</p></td>
     <td><p>24 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [64 CUs, 128CUs)</p></td>
     <td><p>36 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [128 CUs, 256CUs)</p></td>
     <td><p>48 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster &gt;= 256 CUs</p></td>
     <td><p>64 MB/s</p></td>
   </tr>
</table>

データを挿入する際は、スキーマで定義されたすべてのフィールドを含めてください。コレクションで AutoID が有効になっている場合は、プライマリキーを除外してください。

挿入されたエンティティを直ちに検索およびクエリで取得可能にするには、検索またはクエリリクエストの一貫性レベルを**Strong**に変更することを検討してください。詳細については、[一貫性レベル](./consistency-level) をご覧ください。

### Upsert\{#upsert}

各アップサートリクエスト/レスポンスは**64**MB を超えてはいけません。

適用されるレート制限は、クラスタイプと使用中の CU 数によって異なります。以下の表は、アップサート操作のレート制限を一覧表示しています。

<table>
   <tr>
     <th></th>
     <th><p>最大アップサートレート制限</p></th>
   </tr>
   <tr>
     <td><p>Free cluster</p></td>
     <td><p>2 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Serverless cluster</p></td>
     <td><p>10 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [1 CU, 2 CUs]</p></td>
     <td><p>8 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [4 CUs,  8 CUs]</p></td>
     <td><p>12 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [12 CUs, 20 CUs]</p></td>
     <td><p>16 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [24 CUs, 64 CUs)</p></td>
     <td><p>24 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [64 CUs, 128CUs)</p></td>
     <td><p>36 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster [128 CUs, 256CUs)</p></td>
     <td><p>48 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated cluster &gt;= 256 CUs</p></td>
     <td><p>64 MB/s</p></td>
   </tr>
</table>

データをアップサートする際は、スキーマで定義されたすべてのフィールドを含めてください。

アップサートされたエンティティを直ちに検索およびクエリで取得可能にするには、検索またはクエリリクエストの一貫性レベルを**Strong**に変更することを検討してください。詳細については、[一貫性レベル](./consistency-level) をご覧ください。

### Index\{#index}

インデックスタイプはフィールドタイプによって異なります。以下の表は、インデックス可能なフィールドタイプと対応するインデックスタイプを一覧表示しています。

<table>
   <tr>
     <th><p><strong>Field Type</strong></p></th>
     <th><p><strong>Index Type</strong></p></th>
     <th><p><strong>メトリックタイプ</strong></p></th>
   </tr>
   <tr>
     <td><p>ベクトルフィールド</p></td>
     <td><p>AUTOINDEX</p></td>
     <td><p>L2, IP, and COSINE</p></td>
   </tr>
   <tr>
     <td><p>VarChar Field</p></td>
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

フラッシュリクエストのレート制限は 0.1 req/s で、特定のクラスタイプにおいてコレクションレベルで課されます。このレート制限は以下に適用されます。

- Milvus v2.4.x 以降と互換性のある Serverless クラスター。

- ベータバージョンにアップグレードされ、Milvus v2.4.x 以降と互換性のある Dedicated クラスター。

<Admonition type="info" icon="📘" title="Notes">

<p>手動でフラッシュ操作を実行することは推奨されません。Zilliz Cloud クラスターが適切に処理します。</p>

</Admonition>

### Load\{#load}

ロードリクエストのレート制限は、クラスターあたり**20**req/s です。

<Admonition type="info" icon="📘" title="Notes">

<p>すでにロードされているコレクションに対しては、新しいデータがこれらのコレクションに入ってきても、コレクションのロード操作を実行する必要はありません。</p>

</Admonition>

### Search\{#search}

各検索リクエスト/レスポンスは**64**MB を超えてはいけません。

各検索リクエストが運ぶクエリベクトルの数（通常**nq**として知られています）は、サブスクリプションプランによって異なります。

- Free および Serverless クラスターの場合、**nq**は**10**以下です。

- Dedicated クラスターの場合、**nq**は**16,384**以下です。

各検索レスポンスが運ぶ数（通常**topK**として知られています）は、サブスクリプションプランによって異なります。

- Free および Serverless クラスターの場合、**topK**は返されるエンティティ数が**1,024**以下です。

- Dedicated クラスターの場合、**topK**は返されるエンティティ数が**16,384**以下です。

### Query\{#query}

各クエリリクエスト/レスポンスは**64**MB を超えてはいけません。

各クエリレスポンスは、返されるエンティティ数が 16,384 以下（通常**topK**として知られています）です。

### Delete\{#delete}

各削除リクエスト/レスポンスは**64**MB を超えてはいけません。

削除リクエストのレート制限は、クラスターあたり**0.5**MB/s です。

### Drop\{#drop}

削除リクエストのレート制限は、クラスターあたり**20**req/s です。

### データ import\{#data-import}

コレクション内で実行中または保留中のインポートジョブは最大**10,000**件まで可能です。

Zilliz Cloud は、Web コンソールでのインポートファイルにも制限を課しています。

<table>
   <tr>
     <th><p>File Type</p></th>
     <th><p>ローカルアップロード</p></th>
     <th><p>オブジェクトストレージから</p></th>
   </tr>
   <tr>
     <td><p>JSON</p></td>
     <td><p>1 GB</p></td>
     <td><p><strong>Free</strong>: 各インポートリクエストで最大 1 GB のデータをインポートでき、ファイルあたりの最大サイズは 1 GB、インポートあたりのファイル数は最大 1,000 件です。</p><p><strong>Serverless & Dedicated</strong>: インポートサイズの合計最大値は 1 TB、ファイルあたりの最大サイズは 10 GB、ファイル数は最大 1,000 件です。</p></td>
   </tr>
   <tr>
     <td><p>Parquet</p></td>
     <td><p>1 GB</p></td>
     <td><p><strong>Free</strong>: 各インポートリクエストで最大 1 GB のデータをインポートでき、ファイルあたりの最大サイズは 1 GB、インポートあたりのファイル数は最大 1,000 件です。</p><p><strong>Serverless & Dedicated</strong>: インポートサイズの合計最大値は 1 TB、ファイルあたりの最大サイズは 10 GB、ファイル数は最大 1,000 件です。</p></td>
   </tr>
   <tr>
     <td><p>Numpy</p></td>
     <td><p>Not support</p></td>
     <td><p><strong>Free</strong>: 各インポートリクエストで最大 1 GB のデータをインポートでき、サブディレクトリあたりの最大サイズは 1 GB、インポートあたりのサブディレクトリ数は最大 1,000 件です。</p><p><strong>Serverless & Dedicated</strong>: インポートサイズの合計最大値は 1 TB、サブディレクトリあたりの最大サイズは 10 GB、サブディレクトリ数は最大 1,000 件です。</p></td>
   </tr>
</table>

詳細については、[ストレージオプション](./data-import-storage-options) および [フォーマットオプション](./data-import-format-options) を参照してください。

## Backup on Console\{#backup-on-console}

手動で作成されたバックアップは永続的に保持されます。

自動作成されたバックアップの最大保持期間は 30 日です。

## Restore on Console\{#restore-on-console}

スナップショットの元のクラスターと同じリージョンでスナップショットを復元できます。復元のターゲットクラスターは、元のクラスターと同じ CU タイプを使用する必要があります。

## IP Access List\{#ip-access-list}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>Console IP Access</p></td>
     <td><p>100</p></td>
     <td><p>コンソールの IP 許可リストに追加できる IP アドレスは最大 100 個です。</p></td>
   </tr>
   <tr>
     <td><p>Cluster IP Access</p></td>
     <td><p>100</p></td>
     <td><p>クラスターの IP 許可リストに追加できる IP アドレスは最大 100 個です。</p></td>
   </tr>
</table>

## Migration\{#migration}

他のベンダーから Zilliz Cloud クラスターへデータを移行できます。移行あたりのコレクションの最大数は、Zilliz Cloud クラスターのサブスクリプションプランによって異なります。

<table>
   <tr>
     <th><p>ターゲットクラスターのサブスクリプションプラン</p></th>
     <th><p>移行あたりのコレクションの最大数</p></th>
   </tr>
   <tr>
     <td><p>Free</p></td>
     <td><p>5</p></td>
   </tr>
   <tr>
     <td><p>Serverless / Dedicated</p></td>
     <td><p>10</p></td>
   </tr>
</table>

