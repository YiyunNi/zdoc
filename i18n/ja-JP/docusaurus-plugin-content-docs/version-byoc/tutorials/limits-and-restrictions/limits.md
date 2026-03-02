---
title: "Zilliz Cloud の制限事項 | BYOC"
slug: /limits
sidebar_label: "Zilliz Cloud の制限事項"
beta: FALSE
notebook: FALSE
description: "このページでは、Zilliz Cloud プラットフォームの制限事項について説明します。Zilliz が提供する OPS システムを使用して、このページに記載されているほとんどの設定を調整できます。さらにサポートが必要な場合は、お問い合わせください。 | BYOC"
type: origin
token: PuxkwMWvbiHxvTkHsVkcMZP9n5f
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - milvus
  - 制限事項
  - オープンソース ベクトルデータベース
  - オープンソース ベクトル DB
  - ベクトルデータベースの例
  - RAG ベクトルデータベース

---

import Admonition from '@theme/Admonition';


# Zilliz Cloudの制限

このページでは、Zilliz Cloudプラットフォームの制限について説明します。Zillizが提供するOPSシステムを使用して、このページに記載されているほとんどの設定を調整できます。さらにサポートが必要な場合は、[お問い合わせ](https://support.zilliz.com/hc/en-us)ください。

## 組織とプロジェクト{#organizations-and-projects}

次の表は、単一ユーザーに許可される組織とプロジェクトの最大数に関する制限を示しています。

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>プロジェクト</p></td>
     <td><p>100</p></td>
     <td><p>各ユーザーは1つの組織で最大100のプロジェクトを作成できます。</p></td>
   </tr>
</table>

## コレクション{#collections}

Zilliz Cloudクラスター内のコレクションとパーティションの最大数は、割り当てられたCUの数と互換性のあるMilvusのバージョンによって異なります。以下の説明を参照して、クラスター内のコレクションとパーティションの最大数を計算できます。

### Milvus v2.4.xと互換性のあるクラスター{#clusters-compatible-with-milvus-v24x}

CUあたり最大**256**のコレクションまたは**1,024**のパーティションを作成でき、1つのコレクションあたり最大**1,024**のパーティションが許可されます。クラスター内のコレクションとパーティションの数の上限を計算するには、次の式を使用できます。

![MhA4wDlMwhhXrvbFio6cS3LNnNe](https://zdoc-images.s3.us-west-2.amazonaws.com/MhA4wDlMwhhXrvbFio6cS3LNnNe.png)

- クラスター内のコレクションの総数は、クラスター内のCU数の256倍または16,384のいずれか低い方よりも少なくなければなりません。

- クラスター内のすべてのコレクションにわたるパーティションの総数は、クラスターに割り当てられたCU数の1,024倍または65,536のいずれか低い方よりも少なくなければなりません。

- 両方の条件を満たす必要があります。

### Milvus v2.5.xと互換性のあるクラスター{#cluster-compatible-with-milvus-v25x}

CUあたり最大**1,024**のコレクションまたは**4,096**のパーティションを作成でき、1つのコレクションあたり最大**1,024**のパーティションが許可されます。クラスター内のコレクションとパーティションの数の上限を計算するには、次の式を使用できます。

![I1aJwA2LShihxQbyG30cFm14ngf](https://zdoc-images.s3.us-west-2.amazonaws.com/I1aJwA2LShihxQbyG30cFm14ngf.png)

- クラスター内のコレクションの総数は、クラスター内のCU数の1,024倍または16,384のいずれか低い方よりも少なくなければなりません。

- クラスター内のすべてのコレクションにわたるパーティションの総数は、クラスターに割り当てられたCU数の4,096倍または65,536のいずれか低い方よりも少なくなければなりません。

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
     <td><p>10</p></td>
   </tr>
</table>

フィールドに関するその他の制限：

- VarCharやJSONなどの一部のフィールドは、予想よりも多くのメモリを使用し、クラスターが満杯になる可能性があります。

### 次元{#dimensions}

ベクトルフィールドの最大次元数は**32,768**です。

### シャード{#shards}

許可されるシャードの最大数は、クラスターのCUサイズによって異なります。

<table>
   <tr>
     <th><p>CUサイズ</p></th>
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

### レート制限{#rate-limit}

Zilliz Cloudは、コレクションとパーティションのデータ定義言語（DDL）操作（コレクションの作成、ロード、リリース、ドロップを含む）にもレート制限を課しています。以下のレート制限は、ServerlessおよびDedicatedクラスターの両方のコレクションに適用されます。

<table>
   <tr>
     <th></th>
     <th><p><strong>レート制限</strong></p></th>
   </tr>
   <tr>
     <td><p>コレクションDDL操作</p><p>(作成、ロード、リリース、ドロップ)</p></td>
     <td><p>クラスターあたり20 req/s</p></td>
   </tr>
   <tr>
     <td><p>パーティションDDL操作</p><p>(作成、ロード、リリース、ドロップ)</p></td>
     <td><p>クラスターあたり20 req/s</p></td>
   </tr>
</table>

## 操作{#operations}

このセクションでは、Zilliz Cloudクラスターにおける一般的なデータ操作のレート制限に焦点を当てます。

### 挿入{#insert}

各挿入リクエスト/レスポンスは**64** MB以下である必要があります。

適用されるレート制限は、クラスターの種類と使用中のCUの数によって異なります。次の表は、挿入操作のレート制限を示しています。

<table>
   <tr>
     <th></th>
     <th><p>最大挿入レート制限</p></th>
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

データを挿入する際は、スキーマで定義されたすべてのフィールドを含めます。コレクションでAutoIDが有効になっている場合は、主キーを除外します。

挿入されたエンティティを検索やクエリですぐに取得できるようにするには、検索またはクエリリクエストの整合性レベルを**Strong**に変更することを検討してください。[整合性レベル](./consistency-level)の詳細を参照してください。

### Upsert{#upsert}

各upsertリクエスト/レスポンスは**64** MB以下である必要があります。

適用されるレート制限は、クラスターの種類と使用中のCUの数によって異なります。次の表は、upsert操作のレート制限を示しています。

<table>
   <tr>
     <th></th>
     <th><p>最大Upsertレート制限</p></th>
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

データをupsertする際は、スキーマで定義されたすべてのフィールドを含めます。

upsertされたエンティティを検索やクエリですぐに取得できるようにするには、検索またはクエリリクエストの整合性レベルを**Strong**に変更することを検討してください。[整合性レベル](./consistency-level)の詳細を参照してください。

### インデックス{#index}

インデックスの種類はフィールドの種類によって異なります。次の表は、インデックス可能なフィールドの種類と対応するインデックスの種類を示しています。

<table>
   <tr>
     <th><p><strong>フィールドの種類</strong></p></th>
     <th><p><strong>インデックスの種類</strong></p></th>
     <th><p><strong>メトリックの種類</strong></p></th>
   </tr>
   <tr>
     <td><p>ベクトルフィールド</p></td>
     <td><p>AUTOINDEX</p></td>
     <td><p>L2, IP, およびCOSINE</p></td>
   </tr>
   <tr>
     <td><p>VarCharフィールド</p></td>
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

フラッシュリクエストのレート制限は、特定のクラスタータイプに対してコレクションレベルで秒間0.1リクエストです。このレート制限は、Milvus v2.4.x以降と互換性のあるクラスターに適用されます。

<Admonition type="info" icon="📘" title="Notes">

<p>手動でフラッシュ操作を実行することはお勧めしません。Zilliz Cloudクラスターが適切に処理します。</p>

</Admonition>

### ロード{#load}

ロードリクエストのレート制限は、クラスターあたり**20** req/sです。

<Admonition type="info" icon="📘" title="Notes">

<p>新しいデータがこれらのコレクションに入ってきても、すでにロードされているコレクションに対してロード操作を実行する必要はありません。</p>

</Admonition>

### 検索{#search}

各検索リクエスト/レスポンスは**64** MB以下である必要があります。

各検索リクエストが運ぶクエリベクトルの数（通常**nq**として知られる）は**16,384**以下であり、各検索レスポンスが運ぶ数（通常**topK**として知られる）は**16,384**エンティティ以下です。

### クエリ{#query}

各クエリリクエスト/レスポンスは**64** MB以下である必要があります。

各クエリレスポンスは、**16,384**エンティティ以下を返します（通常**topK**として知られる）。

### 削除{#delete}

各削除リクエスト/レスポンスは**64** MB以下である必要があります。

削除リクエストのレート制限は、クラスターあたり**0.5** MB/sです。

### ドロップ{#drop}

ドロップリクエストのレート制限は、クラスターあたり**20** req/sです。

### データインポート{#data-import}

コレクションには、実行中または保留中のインポートジョブが最大**10,000**件存在できます。

Zilliz Cloudは、Webコンソールでインポートするファイルにも制限を課しています。

<table>
   <tr>
     <th><p>ファイルの種類</p></th>
     <th><p>ローカルアップロード</p></th>
     <th><p>オブジェクトストレージから</p></th>
   </tr>
   <tr>
     <td><p>JSON</p></td>
     <td><p>1 GB</p></td>
     <td><p>最大合計インポートサイズは1 TBで、各ファイルの最大サイズは10 GBで、最大1,000ファイルです。</p></td>
   </tr>
   <tr>
     <td><p>Parquet</p></td>
     <td><p>1 GB</p></td>
     <td><p>最大合計インポートサイズは1 TBで、各ファイルの最大サイズは10 GBで、最大1,000ファイルです。</p></td>
   </tr>
   <tr>
     <td><p>Numpy</p></td>
     <td><p>サポートされていません</p></td>
     <td><p>最大合計インポートサイズは1 TBで、各サブディレクトリの最大サイズは10 GBで、最大1,000サブディレクトリです。</p></td>
   </tr>
</table>

詳細については、[ストレージオプション](./data-import-storage-options)と[フォーマットオプション](./data-import-format-options)を参照してください。

## コンソールでのバックアップ{#backup-on-console}

手動で作成されたバックアップは永続的に保持されます。

自動的に作成されたバックアップの最大保持期間は30日です。

## コンソールでの復元{#restore-on-console}

スナップショットの元のクラスターと同じリージョンでスナップショットを復元できます。復元先のクラスターは、元のクラスターと同じCUタイプを使用する必要があります。

## IPアクセスリスト{#ip-access-list}

<table>
   <tr>
     <th><p><strong>項目</strong></p></th>
     <th><p><strong>最大数</strong></p></th>
     <th><p><strong>備考</strong></p></th>
   </tr>
   <tr>
     <td><p>IPアドレス (CIDR)</p></td>
     <td><p>100</p></td>
     <td><p>許可リストに最大100個のIPアドレスを追加できます。</p></td>
   </tr>
</table>

## 移行{#migration}

他のベンダーからZilliz Cloudクラスターにデータを移行できます。移行あたりのコレクションの最大数は、Zilliz Cloudクラスターによって異なります。移行中に一度に最大**10**個のコレクションを移行できます。

