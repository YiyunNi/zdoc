---
title: "Qdrant から Zilliz Cloud への移行 | Cloud"
slug: /migrate-from-qdrant
sidebar_key: migrate-from-qdrant
sidebar_label: "Qdrant"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Qdrant からの移行時に Zilliz Cloud がデータ型のマッピング、ペイロードフィールドの変換、およびコレクションの命名規則をどのように処理するかを説明します。"
type: origin
token: LqMIw1DXyiHUjAk9TEAcqHp6nDd
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 移行
  - qdrant

---

import Admonition from '@theme/Admonition';


# Qdrant から Zilliz Cloud への移行

このトピックでは、Qdrant からの移行時に Zilliz Cloud が [Qdrant](https://qdrant.tech/) のデータ型マッピング、ペイロードフィールド変換、およびコレクション命名規則をどのように処理するかについて説明します。

## 前提条件\{#prerequisites}

Qdrant から Zilliz Cloud への移行を開始する前に、以下の要件を満たしていることを確認してください。

### Qdrant の要件\{#qdrant-requirements}

<table>
   <tr>
     <th><p>Requirement</p></th>
     <th><p>Details</p></th>
   </tr>
   <tr>
     <td><p>ネットワーク access</p></td>
     <td><p>Source Qdrant cluster must be accessible from the public internet</p></td>
   </tr>
   <tr>
     <td><p>API access</p></td>
     <td><p>Cluster endpoint and API key with access permissions</p></td>
   </tr>
   <tr>
     <td><p>データ availability</p></td>
     <td><p>Source collections must contain data. Empty collections cannot be migrated.</p></td>
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

Qdrant のデータ型が Zilliz Cloud にどのようにマッピングされるかを理解することは、移行の計画に不可欠です。

<table>
   <tr>
     <th><p>Qdrant Field Type</p></th>
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
     <td><p>Payload</p></td>
     <td><p>JSON (dynamic fields)</p></td>
     <td><p>Mapped as dynamic schema by default; can be converted to fixed fields.</p><p>Refer to <a href="./enable-dynamic-field">Dynamic Field</a> for more details.</p></td>
   </tr>
</table>

## ペイロードフィールド変換\{#payload-field-conversion}

<Admonition type="info" icon="📘" title="Notes">

Zilliz Cloud は、ペイロードスキーマを検出するために 100 行をサンプリングします。必要に応じて、追加のフィールドを手動で追加できます。

</Admonition>

Qdrant のペイロードは、最大限の柔軟性を得るために、最初は Zilliz Cloud のダイナミックスキーマにマッピングされます。ペイロードフィールドを固定フィールドに変換することで、以下のメリットを得ることができます。

- 強力な検証のための厳格なデータ型の適用

- より良いクエリパフォーマンスのための最適化されたインデックス作成

- 一貫したデータ管理のための構造化されたスキーマ

ペイロードを固定フィールドに変換する場合：

<table>
   <tr>
     <th><p>Qdrant Payload Type</p></th>
     <th><p>Zilliz Fixed Field Type</p></th>
     <th><p>Notes</p></th>
   </tr>
   <tr>
     <td><p>Integer</p></td>
     <td><p>INT64</p></td>
     <td><p>Direct type conversion</p></td>
   </tr>
   <tr>
     <td><p>Float</p></td>
     <td><p>DOUBLE</p></td>
     <td><p>All float numbers become DOUBLE</p></td>
   </tr>
   <tr>
     <td><p>Bool</p></td>
     <td><p>BOOL</p></td>
     <td><p>Direct mapping</p></td>
   </tr>
   <tr>
     <td><p>キーword</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>Maximum 65,535 bytes supported</p></td>
   </tr>
   <tr>
     <td><p>Geo</p></td>
     <td><p>JSON</p></td>
     <td><p>Preserved as JSON structure; cannot convert to fixed fields</p></td>
   </tr>
   <tr>
     <td><p>Datetime</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>Maximum 65,535 bytes supported</p></td>
   </tr>
   <tr>
     <td><p>UUID</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>Maximum 65,535 bytes supported</p></td>
   </tr>
</table>

### 配列型のサポート\{#array-type-support}

配列型は既存のペイロードデータでは検出されず、ダイナミックフィールドから変換することもできません。ただし、移行設定時にほとんどの配列型を新しいフィールドとして手動で追加できます。

<table>
   <tr>
     <th><p>Qdrant 配列 Type</p></th>
     <th><p>Zilliz Cloud 配列 Type</p></th>
     <th><p>Available for Manual Addition</p></th>
   </tr>
   <tr>
     <td><p>配列&lt;Integer&gt;</p></td>
     <td><p>ARRAY&lt;INT64&gt;</p></td>
     <td><p>✅ Can be added as new field</p></td>
   </tr>
   <tr>
     <td><p>配列&lt;Float&gt;</p></td>
     <td><p>ARRAY&lt;DOUBLE&gt;</p></td>
     <td><p>✅ Can be added as new field</p></td>
   </tr>
   <tr>
     <td><p>配列&lt;Bool&gt;</p></td>
     <td><p>ARRAY&lt;BOOL&gt;</p></td>
     <td><p>✅ Can be added as new field</p></td>
   </tr>
   <tr>
     <td><p>配列&lt;キーword&gt;</p></td>
     <td><p>ARRAY&lt;VARCHAR&gt;</p></td>
     <td><p>✅ Can be added as new field</p></td>
   </tr>
   <tr>
     <td><p>配列&lt;Geo&gt;</p></td>
     <td><p>Not supported</p></td>
     <td><p>❌ Not available</p></td>
   </tr>
   <tr>
     <td><p>配列&lt;Datetime&gt;</p></td>
     <td><p>ARRAY&lt;VARCHAR&gt;</p></td>
     <td><p>✅ Can be added as new field</p></td>
   </tr>
   <tr>
     <td><p>配列&lt;UUID&gt;</p></td>
     <td><p>ARRAY&lt;VARCHAR&gt;</p></td>
     <td><p>✅ Can be added as new field</p></td>
   </tr>
</table>

固定フィールドに変換されたペイロードフィールドについては、追加の属性を設定できます。

- **NULL許容**: フィールドが null 値を受け入れるかどうかを決定します。この機能はデフォルトで有効になっています。詳細については、[NULL許容 属性](./nullable-fields) を参照してください。

- **デフォルト値**: データが欠落している場合のフォールバック値を設定します。詳細については、[デフォルト値](./nullable-fields) を参照してください。

- **パーティションキー**: オプションで、INT64 または VARCHAR フィールドをパーティションキーとして指定できます。各コレクションは 1 つのパーティションキーのみをサポートし、選択したフィールドは NULL 許容にできないことに注意してください。詳細については、[パーティションキーの使用](./use-partition-key) を参照してください。

## Qdrant 固有の処理ルール\{#qdrant-specific-handling-rules}

### コレクション命名規則\{#collection-naming-rules}

Qdrant のコレクション名は、以下の考慮事項に基づいて Zilliz Cloud に転送されます。

<table>
   <tr>
     <th><p>Scenario</p></th>
     <th><p>Impact</p></th>
     <th><p>ソリューション</p></th>
   </tr>
   <tr>
     <td><p>名前の競合</p></td>
     <td><p>Cannot submit a migration job if a collection with the same name already exists in the database</p></td>
     <td><p>Delete existing collection, choose a different target database, or rename during migration configuration</p></td>
   </tr>
   <tr>
     <td><p>Special characters</p></td>
     <td><p>Collection names are preserved as-is from Qdrant</p></td>
     <td><p>Ensure collection names comply with Zilliz Cloud naming conventions</p></td>
   </tr>
</table>
