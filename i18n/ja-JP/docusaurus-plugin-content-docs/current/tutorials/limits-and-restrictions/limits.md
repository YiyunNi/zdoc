---
title: "Zilliz Cloud の制限 | Cloud"
slug: /limits
sidebar_label: "Zilliz Cloud の制限"
beta: FALSE
notebook: FALSE
description: "このページでは、Zilliz Cloud プラットフォームの制限に関する情報を提供します。これらの制限に関連する問題を報告する必要がある場合は、リクエストを送信してください。 | Cloud"
type: origin
token: PuxkwMWvbiHxvTkHsVkcMZP9n5f
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - milvus
  - 制限
  - 画像検索
  - LLMs
  - 機械学習
  - RAG

---

import Admonition from '@theme/Admonition';


# Zilliz Cloud の制限

このページでは、Zilliz Cloud プラットフォームの制限について説明します。これらの制限に関する問題を報告する必要がある場合は、[リクエストを送信してください](https://support.zilliz.com/hc/en-us)。

## 組織とプロジェクト{#organizations-and-projects}

次の表は、単一ユーザーに許可される組織とプロジェクトの最大数に関する制限を示しています。

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>組織</p></td>
     <td><p>1</p></td>
     <td><p>Zilliz Cloud は、アカウント登録が成功すると自動的に1つの組織を作成します。追加の組織が必要な場合は、<a href="http://support.zilliz.com">サポートチケットを作成してください</a>。ユーザーは複数の組織に参加できます。</p></td>
   </tr>
   <tr>
     <td><p>プロジェクト</p></td>
     <td><p>100</p></td>
     <td><p>各ユーザーは1つの組織に最大100個のプロジェクトを作成できます。</p></td>
   </tr>
</table>

## ユーザーとロール{#users-and-roles}

次の表は、Zilliz Cloud で許可されるユーザーの最大数に関する制限を示しています。

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>組織ユーザー</p></td>
     <td><p>100</p></td>
     <td><p>1つの組織には合計で最大100人の組織ユーザーを含めることができます。</p></td>
   </tr>
   <tr>
     <td><p>クラスターユーザー</p></td>
     <td><p>100</p></td>
     <td><p>1つのクラスターには合計で最大100人のユーザーを含めることができます。</p></td>
   </tr>
   <tr>
     <td><p>クラスターカスタムロール</p></td>
     <td><p>20</p></td>
     <td><p>1つのクラスターには合計で最大20個のカスタムロールを含めることができます。この制限を解除するには、<a href="http://support.zilliz.com">お問い合わせください</a>。</p></td>
   </tr>
</table>

## API キー{#api-keys}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>API キー</p></td>
     <td><p>100</p></td>
     <td><p>各組織は、最適なリソース利用とセキュリティのために、最大100個のカスタマイズされたAPIキーを含めることができます。</p></td>
   </tr>
</table>

## コンソール IP 許可リスト{#console-ip-allowlist}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>組織コンソール IP 許可リスト内の IP</p></td>
     <td><p>100</p></td>
     <td><p>各組織コンソール IP 許可リストには、最大100個の IP または CIDR ブロックを含めることができます。</p></td>
   </tr>
</table>

## ボリューム{#volumes}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>ボリューム</p></td>
     <td><p>100</p></td>
     <td><p>各組織は最大100個のボリュームを含めることができます。</p></td>
   </tr>
</table>

## クラスター{#clusters}

### クラスター数{#number-of-clusters}

クラスターの最大数は、支払い方法とデプロイオプションによって異なります。

- **有効な支払い方法がない場合**

    <table>
       <tr>
         <th><p><strong>クラスターデプロイオプション</strong></p></th>
         <th><p><strong>最大数</strong></p></th>
         <th><p><strong>備考</strong></p></th>
       </tr>
       <tr>
         <td><p>Free</p></td>
         <td><p>1</p></td>
         <td><p>各組織で許可される Free クラスターは1つのみです。必要に応じて、既存の Free クラスターを削除して新しいクラスターに置き換えることができます。</p></td>
       </tr>
       <tr>
         <td><p>Serverless/Dedicated</p></td>
         <td><p>1</p></td>
         <td><p>無料トライアル期間中は、Serverless/Dedicated クラスターを1つしか作成できません。追加のクラスターが必要な場合は、支払い方法を追加してください。</p></td>
       </tr>
    </table>

- **有効な支払い方法がある場合**

    <table>
       <tr>
         <th><p><strong>クラスターデプロイオプション</strong></p></th>
         <th><p><strong>最大数</strong></p></th>
         <th><p><strong>備考</strong></p></th>
       </tr>
       <tr>
         <td><p>Free</p></td>
         <td><p>1</p></td>
         <td><p>各組織で許可される Free クラスターは1つのみです。必要に応じて、既存の Free クラスターを削除して新しいクラスターに置き換えることができます。</p></td>
       </tr>
       <tr>
         <td><p>Serverless</p></td>
         <td><p>N/A</p></td>
         <td><p>N/A</p></td>
       </tr>
       <tr>
         <td><p>Dedicated</p></td>
         <td><p>合計 CU サイズ &lt; 320</p></td>
         <td><p>組織内のクラスターの最大数は、クラスター CU の合計量によって異なります。組織内のすべての Dedicated クラスターの累積 CU 数は320を超えてはなりません。</p></td>
       </tr>
    </table>

### CU{#cus}

CU は、データの並列処理に使用されるコンピューティングリソースの基本単位であり、異なる CU タイプは CPU、メモリ、ストレージのさまざまな組み合わせで構成されます。CU の概念は Dedicated クラスターにのみ適用されます。

<table>
   <tr>
     <th><p><strong>プロジェクトプランとクラスターデプロイオプション</strong></p></th>
     <th><p><strong>制限</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>Standard プロジェクトの Dedicated クラスター</p></td>
     <td><p>CU サイズ x レプリカ数 &lt;=32</p></td>
     <td><p>コンソールでは、単一のクラスターに対して最大32 CU を作成できます。</p><p>ただし、レプリカが追加された場合、制限は CU サイズ x レプリカ数 &lt;=32 です。</p></td>
   </tr>
   <tr>
     <td><p>Enterprise プロジェクトの Dedicated クラスター</p></td>
     <td><p>CU サイズ x レプリカ数 &lt;=1,024</p></td>
     <td><p>コンソールでは、単一のクラスターに対して最大1,024 CU を作成できます。</p><p>ただし、レプリカが追加された場合、制限は CU サイズ x レプリカ数 &lt;=1,024 です。</p></td>
   </tr>
</table>

[お問い合わせください](https://support.zilliz.com/hc/en-us)

- Standard プロジェクトの Dedicated クラスターで32 CU を超える CU が必要な場合

- Enterprise プロジェクトの Dedicated クラスターで1,024 CU を超える CU が必要な場合

### vCU{#vcus}

仮想コンピューティングユニット (vCU) は、読み取り操作 (検索やクエリなど) と書き込み操作 (挿入、更新、削除など) によって消費されるリソースを測定するために使用されます。vCU の概念は Free および Serverless クラスターにのみ適用されます。

<table>
   <tr>
     <th><p><strong>クラスタープラン</strong></p></th>
     <th><p><strong>制限</strong></p></th>
   </tr>
   <tr>
     <td><p>Free</p></td>
     <td><p>月あたり250万 vCU</p></td>
   </tr>
   <tr>
     <td><p>Serverless</p></td>
     <td><p>N/A</p></td>
   </tr>
</table>

### 容量{#capacity}

次の表は、各クラスタープランタイプの容量に関する制限を示しています。

<table>
   <tr>
     <th><p><strong>クラスタープラン</strong></p></th>
     <th><p><strong>制限</strong></p></th>
   </tr>
   <tr>
     <td><p>Free</p></td>
     <td><p>クラスターあたり5 GB (クラスターあたり100万個の768次元ベクトルに相当)</p></td>
   </tr>
   <tr>
     <td><p>Serverless</p></td>
     <td><p>Zilliz Cloud の Serverless クラスターには容量制限がありません。</p></td>
   </tr>
   <tr>
     <td><p>Dedicated (CU あたり)</p></td>
     <td><p>Zilliz Cloud の Dedicated クラスターには容量制限がありません。</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>Dedicated クラスターの容量の上限は、使用される CU タイプとサイズによって異なります。クラスターの容量が不足している場合は、CU タイプとサイズを調整することを検討してください。詳細については、<a href="./scale-query-cu">クラスターのスケーリング</a>を参照してください。</p>

</Admonition>

## レプリカ{#replicas}

レプリカを追加するには、クラスターに **8 CU 以上**が必要です。以下の制限も適用されます。

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>制限</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>レプリカ</p></td>
     <td><p>10</p></td>
     <td><p>最大10個のレプリカを作成できます。</p></td>
   </tr>
   <tr>
     <td><p>レプリカ数 x CU サイズ</p></td>
     <td><p>&lt;= 256</p></td>
     <td><p>クラスター CU サイズ x レプリカ数は256を超えてはなりません。</p></td>
   </tr>
</table>

## データベース{#databases}

- データベースは Dedicated クラスターでのみ作成できます。

- 各 Dedicated クラスターは最大1024個のデータベースを持つことができます。

- デフォルトのデータベースは削除できません。

## コレクション{#collections}

Zilliz Cloud クラスター内のコレクションとパーティションの最大数は、割り当てられた CU の数と互換性のある Milvus バージョンによって異なります。以下の説明を参照して、クラスター内のコレクションとパーティションの最大数を計算できます。

CU あたり最大 **1,024** 個のコレクションまたは **4,096** 個のパーティションを作成でき、コレクションあたり最大 **1,024** 個のパーティションが許可されます。クラスター内のコレクションとパーティションの数の上限を計算するには、次の式を使用できます。

![I1aJwA2LShihxQbyG30cFm14ngf](https://zdoc-images.s3.us-west-2.amazonaws.com/I1aJwA2LShihxQbyG30cFm14ngf.png)

- クラスター内のコレクションの総数は、クラスター内の CU 数の1,024倍または16,384のいずれか低い方よりも少なければなりません。

- クラスター内のすべてのコレクションにわたるパーティションの総数は、クラスターに割り当てられた CU 数の4,096倍または65,536のいずれか低い方よりも少なければなりません。

- 両方の条件を満たす必要があります。

### フィールド{#fields}

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
     <td><p>コレクションあたりのベクトルフィールド数</p></td>
     <td><ul><li><p>Free & Serverless: 4</p></li><li><p>Dedicated: 10</p></li></ul></td>
   </tr>
</table>

フィールドに関するその他の制限:

- VarChar や JSON などの一部のフィールドは、予想よりも多くのメモリを使用し、クラスターが満杯になる可能性があります。

### 次元{#dimensions}

ベクトルフィールドの最大次元数は **32,768** です。

### シャード{#shards}

許可されるシャードの最大数は、クラスタープランとクラスター CU サイズによって異なります。

<table>
   <tr>
     <th colspan="2"><p><strong>クラスタープランと CU サイズ</strong></p></th>
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

### レート制限{#rate-limit}

Zilliz Cloud は、コレクションとパーティションのデータ定義言語 (DDL) 操作 (コレクションの作成、ロード、リリース、削除を含む) にもレート制限を課しています。以下のレート制限は、Serverless クラスターと Dedicated クラスターの両方のコレクションに適用されます。

<table>
   <tr>
     <th></th>
     <th><p><strong>レート制限</strong></p></th>
   </tr>
   <tr>
     <td><p>コレクション DDL 操作</p><p>(作成、ロード、リリース、削除)</p></td>
     <td><p>クラスターあたり20 req/s</p></td>
   </tr>
   <tr>
     <td><p>パーティション DDL 操作</p><p>(作成、ロード、リリース、削除)</p></td>
     <td><p>クラスターあたり20 req/s</p></td>
   </tr>
</table>

## 操作{#operations}

このセクションでは、Zilliz Cloud クラスターにおける一般的なデータ操作のレート制限に焦点を当てます。

### 挿入{#insert}

各挿入リクエスト/レスポンスは **64** MB を超えてはなりません。

適用されるレート制限は、クラスタータイプと使用中の CU 数によって異なります。次の表は、挿入操作のレート制限を示しています。

<table>
   <tr>
     <th></th>
     <th><p>最大挿入レート制限</p></th>
   </tr>
   <tr>
     <td><p>Free クラスター</p></td>
     <td><p>2 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Serverless クラスター</p></td>
     <td><p>10 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [1 CU, 2 CU]</p></td>
     <td><p>8 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [4 CU, 8 CU]</p></td>
     <td><p>12 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [12 CU, 20 CU]</p></td>
     <td><p>16 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [24 CU, 64 CU)</p></td>
     <td><p>24 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [64 CU, 128CU)</p></td>
     <td><p>36 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [128 CU, 256CU)</p></td>
     <td><p>48 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター >= 256 CU</p></td>
     <td><p>64 MB/s</p></td>
   </tr>
</table>

データを挿入する際は、スキーマで定義されたすべてのフィールドを含めます。コレクションで AutoID が有効になっている場合は、主キーを除外します。

挿入されたエンティティを検索やクエリですぐに取得できるようにするには、検索またはクエリリクエストの整合性レベルを **Strong** に変更することを検討してください。詳細については、[整合性レベル](./consistency-level)を参照してください。

### Upsert{#upsert}

各 upsert リクエスト/レスポンスは **64** MB を超えてはなりません。

適用されるレート制限は、クラスタータイプと使用中の CU 数によって異なります。次の表は、upsert 操作のレート制限を示しています。

<table>
   <tr>
     <th></th>
     <th><p>最大 Upsert レート制限</p></th>
   </tr>
   <tr>
     <td><p>Free クラスター</p></td>
     <td><p>2 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Serverless クラスター</p></td>
     <td><p>10 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [1 CU, 2 CU]</p></td>
     <td><p>8 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [4 CU, 8 CU]</p></td>
     <td><p>12 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [12 CU, 20 CU]</p></td>
     <td><p>16 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [24 CU, 64 CU)</p></td>
     <td><p>24 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [64 CU, 128CU)</p></td>
     <td><p>36 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター [128 CU, 256CU)</p></td>
     <td><p>48 MB/s</p></td>
   </tr>
   <tr>
     <td><p>Dedicated クラスター >= 256 CU</p></td>
     <td><p>64 MB/s</p></td>
   </tr>
</table>

データを upsert する際は、スキーマで定義されたすべてのフィールドを含めます。

upsert されたエンティティを検索やクエリですぐに取得できるようにするには、検索またはクエリリクエストの整合性レベルを **Strong** に変更することを検討してください。詳細については、[整合性レベル](./consistency-level)を参照してください。

### インデックス{#index}

インデックスタイプはフィールドタイプによって異なります。次の表は、インデックス可能なフィールドタイプと対応するインデックスタイプを示しています。

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

### フラッシュ{#flush}

フラッシュリクエストのレート制限は、特定のクラスタータイプに対してコレクションレベルで課される0.1リクエスト/秒です。このレート制限は以下に適用されます。

- Milvus v2.4.x 以降と互換性のある Serverless クラスター。

- Milvus v2.4.x 以降と互換性のあるベータ版にアップグレードされた Dedicated クラスター。

<Admonition type="info" icon="📘" title="Notes">

<p>手動でフラッシュ操作を実行することはお勧めしません。Zilliz Cloud クラスターが適切に処理します。</p>

</Admonition>

### ロード{#load}

ロードリクエストのレート制限は、クラスターあたり **20** req/s です。

<Admonition type="info" icon="📘" title="Notes">

<p>すでにロードされているコレクションの場合、新しいデータがこれらのコレクションに入ってきても、コレクションのロードを実行する必要はありません。</p>

</Admonition>

### 検索{#search}

各検索リクエスト/レスポンスは **64** MB を超えてはなりません。

各検索リクエストが運ぶクエリベクトルの数 (通常 **nq** と呼ばれる) は、サブスクリプションプランによって異なります。

- Free および Serverless クラスターの場合、**nq** は **10** を超えません。

- Dedicated クラスターの場合、**nq** は **16,384** を超えません。

各検索レスポンスが運ぶ数 (通常 **topK** と呼ばれる) は、サブスクリプションプランによって異なります。

- Free および Serverless クラスターの場合、**topK** は **1,024** エンティティを返しません。

- Dedicated クラスターの場合、**topK** は **16,384** エンティティを返しません。

### クエリ{#query}

各クエリリクエスト/レスポンスは **64** MB を超えてはなりません。

各クエリレスポンスは、最大16,384個のエンティティを返します (通常 **topK** と呼ばれる)。

### 削除{#delete}

各削除リクエスト/レスポンスは **64** MB を超えてはなりません。

削除リクエストのレート制限は、クラスターあたり **0.5** MB/s です。

### ドロップ{#drop}

ドロップリクエストのレート制限は、クラスターあたり **20** req/s です。

### データインポート{#data-import}

コレクションには、最大 **10,000** 個の実行中または保留中のインポートジョブを含めることができます。

Zilliz Cloud は、Web コンソールでインポートするファイルにも制限を課しています。

<table>
   <tr>
     <th><p>ファイルタイプ</p></th>
     <th><p>ローカルアップロード</p></th>
     <th><p>オブジェクトストレージから</p></th>
   </tr>
   <tr>
     <td><p>JSON</p></td>
     <td><p>1 GB</p></td>
     <td><p><strong>Free</strong>: 各インポートリクエストは最大1 GB のデータをインポートでき、ファイルあたり最大1 GB、インポートあたり最大1,000ファイルです。</p><p><strong>Serverless & Dedicated</strong>: 最大合計インポートサイズは1 TB で、各ファイルの最大サイズは10 GB で、最大1,000ファイルです。</p></td>
   </tr>
   <tr>
     <td><p>Parquet</p></td>
     <td><p>1 GB</p></td>
     <td><p><strong>Free</strong>: 各インポートリクエストは最大1 GB のデータをインポートでき、ファイルあたり最大1 GB、インポートあたり最大1,000ファイルです。</p><p><strong>Serverless & Dedicated</strong>: 最大合計インポートサイズは1 TB で、各ファイルの最大サイズは10 GB で、最大1,000ファイルです。</p></td>
   </tr>
   <tr>
     <td><p>Numpy</p></td>
     <td><p>サポートされていません</p></td>
     <td><p><strong>Free</strong>: 各インポートリクエストは最大1 GB のデータをインポートでき、サブディレクトリあたり最大1 GB、インポートあたり最大1,000サブディレクトリです。</p><p><strong>Serverless & Dedicated</strong>: 最大合計インポートサイズは1 TB で、各サブディレクトリの最大サイズは10 GB で、最大1,000サブディレクトリです。</p></td>
   </tr>
</table>

詳細については、[ストレージオプション](./data-import-storage-options)と[フォーマットオプション](./data-import-format-options)を参照してください。

## コンソールでのバックアップ{#backup-on-console}

手動で作成されたバックアップは永続的に保持されます。

自動的に作成されたバックアップの最大保持期間は30日です。

## コンソールでの復元{#restore-on-console}

スナップショットの元のクラスターと同じリージョンにスナップショットを復元できます。復元のターゲットクラスターは、元のクラスターと同じ CU タイプを使用する必要があります。

## IP アクセスリスト{#ip-access-list}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>IP アドレス (CIDR)</p></td>
     <td><p>100</p></td>
     <td><p>許可リストに最大100個の IP アドレスを追加できます。</p></td>
   </tr>
</table>

## 移行{#migration}

他のベンダーから Zilliz Cloud クラスターにデータを移行できます。移行あたりのコレクションの最大数は、Zilliz Cloud クラスターのサブスクリプションプランによって異なります。

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

