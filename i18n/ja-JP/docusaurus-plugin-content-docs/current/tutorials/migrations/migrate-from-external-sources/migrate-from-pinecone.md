---
title: "Pinecone から Zilliz Cloud への移行 | Cloud"
slug: /migrate-from-pinecone
sidebar_key: migrate-from-pinecone
sidebar_label: "Pinecone"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Pinecone からの移行時に Zilliz Cloud がデータ型のマッピング、フィールドの変換、名前空間の処理、およびコレクションの命名規則をどのように扱うかを説明します。"
type: origin
token: R33EwQchxiO3HKk4vPnce6vkntc
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 移行
  - pinecone

---

import Admonition from '@theme/Admonition';


# Pinecone から Zilliz Cloud への移行

このトピックでは、Pinecone からの移行時に Zilliz Cloud が [Pinecone](https://www.pinecone.io/) のデータ型マッピング、フィールド変換、ネームスペース処理、およびコレクション命名規則をどのように処理するかについて説明します。

## 前提条件\{#prerequisites}

Pinecone から Zilliz Cloud への移行を開始する前に、以下の要件を満たしていることを確認してください。

### Pinecone の要件\{#pinecone-requirements}

<table>
   <tr>
     <th><p>Requirement</p></th>
     <th><p>Details</p></th>
   </tr>
   <tr>
     <td><p>Index type</p></td>
     <td><p>Supports migrating from Pinecone Serverless indexes only</p></td>
   </tr>
   <tr>
     <td><p>API access</p></td>
     <td><p>Pinecone API key with access permissions</p></td>
   </tr>
   <tr>
     <td><p>データ availability</p></td>
     <td><p>Source indexes from Pinecone must contain data. Empty indexes cannot be migrated.</p></td>
   </tr>
   <tr>
     <td><p>Vector dimension</p></td>
     <td><p>Dimension must be &gt; 1. Single-dimension vectors will cause migration failure</p></td>
   </tr>
</table>

### Zilliz Cloud の要件\{#zilliz-cloud-requirements}

<table>
   <tr>
     <th><p>Requirement</p></th>
     <th><p>Details</p></th>
   </tr>
   <tr>
     <td><p>User role</p></td>
     <td><p>組織オーナー or プロジェクト管理者</p></td>
   </tr>
   <tr>
     <td><p>Cluster capacity</p></td>
     <td><p>Sufficient storage and compute resources (use the <a href="https://zilliz.com/pricing#calculator">CU calculator</a> to estimate CU size)</p></td>
   </tr>
   <tr>
     <td><p>ネットワーク access</p></td>
     <td><p>Add <a href="./zilliz-cloud-ips">Zilliz Cloud IPs</a> to allowlists if using network restrictions</p></td>
   </tr>
</table>

## データ型マッピング\{#data-type-mapping}

Pinecone のデータ型が Zilliz Cloud にどのようにマッピングされるかを理解することは、移行の計画に不可欠です。

<table>
   <tr>
     <th><p>Pinecone Field Type</p></th>
     <th><p>Zilliz Cloud Field Type</p></th>
     <th><p>Notes</p></th>
   </tr>
   <tr>
     <td><p>Primary key</p></td>
     <td><p>VARCHAR (primary key)</p></td>
     <td><p>Automatically mapped. Enable 自動ID to generate new IDs (original values will be discarded).</p></td>
   </tr>
   <tr>
     <td><p>Dense vector</p></td>
     <td><p>FLOAT_VECTOR</p></td>
     <td><p>Dimensions preserved exactly, no modifications needed</p></td>
   </tr>
   <tr>
     <td><p>Sparse vector</p></td>
     <td><p>SPARSE_FLOAT_VECTOR</p></td>
     <td><p>Only mapped if non-empty in sample data.</p></td>
   </tr>
   <tr>
     <td><p>Metadata</p></td>
     <td><p>Dynamic fields</p></td>
     <td><p>Mapped as dynamic schema by default; can be converted to fixed fields.</p><p>Refer to <a href="./enable-dynamic-field">Dynamic Field</a> for more details.</p></td>
   </tr>
   <tr>
     <td><p>Namespace</p></td>
     <td><p>Partition key / partition</p></td>
     <td><p>Recommended for performance optimization.</p><p>Refer to <a href="./migrate-from-pinecone#namespace-processing">Namespace processing</a> for more details.</p></td>
   </tr>
</table>

## メタデータフィールドの変換\{#metadata-field-conversion}

<Admonition type="info" icon="📘" title="Notes">

Zilliz Cloud は、メタデータスキーマを検出するために100行をサンプリングします。必要に応じて、手動で追加のフィールドを追加できます。

</Admonition>

Pinecone のメタデータは、最大限の柔軟性を得るために、最初は Zilliz Cloud のダイナミックスキーマにマッピングされます。メタデータフィールドを固定フィールドに変換することで、以下のメリットを得ることができます。

- より強力な検証のための厳格なデータ型の適用

- より優れたクエリパフォーマンスのための最適化されたインデックス作成

- 一貫したデータ管理のための構造化されたスキーマ

メタデータを固定フィールドに変換する場合：

<table>
   <tr>
     <th><p>Pinecone Metadata Type</p></th>
     <th><p>Zilliz Fixed Field Type</p></th>
     <th><p>Notes</p></th>
   </tr>
   <tr>
     <td><p>String</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>Maximum 65,535 bytes supported</p></td>
   </tr>
   <tr>
     <td><p>Number (int/float)</p></td>
     <td><p>DOUBLE</p></td>
     <td><p>All numeric types become DOUBLE</p></td>
   </tr>
   <tr>
     <td><p>Boolean</p></td>
     <td><p>BOOL</p></td>
     <td><p>Direct mapping</p></td>
   </tr>
   <tr>
     <td><p>List of strings</p></td>
     <td><p>ARRAY&lt;VARCHAR&gt;</p></td>
     <td><p>Nested arrays supported</p></td>
   </tr>
</table>

固定フィールドに変換されたメタデータフィールドについては、追加の属性を設定できます。

- **NULL許容**: フィールドが null 値を受け入れるかどうかを決定します。この機能はデフォルトで有効になっています。詳細については、[NULL許容属性](./nullable-fields) を参照してください。

- **デフォルト値**: データが欠損している場合のフォールバック値を設定します。詳細については、[デフォルト値](./nullable-fields) を参照してください。

## Pinecone 固有の処理ルール\{#pinecone-specific-handling-rules}

### ネームスペース処理\{#namespace-processing}

Pinecone のネームスペースは、2つの戦略を使用して移行できます。

<table>
   <tr>
     <th><p>Strategy</p></th>
     <th><p>Implementation</p></th>
     <th><p>パフォーマンスへの影響</p></th>
     <th><p>Use Case</p></th>
   </tr>
   <tr>
     <td><p><strong>Namespace as パーティションキー</strong> <em>(Recommended)</em></p></td>
     <td><p>Namespaces become values in a パーティションキー field</p></td>
     <td><p>Automatic optimization for search performance</p></td>
     <td><p>Most scenarios with multiple namespaces</p></td>
   </tr>
   <tr>
     <td><p><strong>Namespace as Partition</strong></p></td>
     <td><p>Each namespace becomes a separate partition</p></td>
     <td><p>Manual partition management required</p></td>
     <td><p>Simple scenarios with few, stable namespaces</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

Pinecone の `default` ネームスペースの処理：

- **As Partition**: Zilliz Cloud の `_default` パーティションになります

- **As パーティションキー**: 空文字列 `""` の値になります

パーティションおよびパーティションキーの概念の詳細については、[パーティションの管理](./manage-partitions) および [パーティションキーの使用](./use-partition-key) を参照してください。

</Admonition>

### コレクション命名規則\{#collection-naming-rules}

Pinecone のインデックス名は、Zilliz Cloud の互換性のために自動的に処理されます。

<table>
   <tr>
     <th><p>Pinecone Index Name</p></th>
     <th><p>Zilliz Cloud Collection Name</p></th>
     <th><p>Rule Applied</p></th>
   </tr>
   <tr>
     <td><p><code>my-vector-index</code></p></td>
     <td><p><code>my_vector_index</code></p></td>
     <td><p>Hyphens (<code>-</code>) converted to underscores (<code>_</code>) to comply with Zilliz Cloud collection naming conventions</p></td>
   </tr>
   <tr>
     <td><p><code>product_search</code></p></td>
     <td><p><code>product_search</code></p></td>
     <td><p>No change needed</p></td>
   </tr>
</table>

**名前の競合**: ターゲットデータベースに同じ名前のコレクションが既に存在する場合は、以下のいずれかを行う必要があります。

- 既存のコレクションを削除する、または

- 別のターゲットデータベースを選択する、または

- 移行設定時にターゲットコレクションの名前を変更する

