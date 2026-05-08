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

このトピックでは、Pinecone からの移行時に Zilliz Cloud がどのようにデータ型マッピング、フィールド変換、名前空間処理、およびコレクション命名規則を処理するかについて説明します。

## 前提条件\{#prerequisites}

Pinecone から Zilliz Cloud への移行を開始する前に、以下の要件を満たしていることを確認してください。

### Pinecone の要件\{#pinecone-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>インデックスの種類</p></td>
     <td><p>Pinecone Serverless インデックスからの移行のみサポート</p></td>
   </tr>
   <tr>
     <td><p>API アクセス</p></td>
     <td><p>アクセス権限を持つ Pinecone API キー</p></td>
   </tr>
   <tr>
     <td><p>データの可用性</p></td>
     <td><p>Pinecone のソースインデックスにはデータが含まれている必要があります。空のインデックスは移行できません。</p></td>
   </tr>
   <tr>
     <td><p>ベクトル次元</p></td>
     <td><p>次元は 1 より大きい必要があります。1 次元のベクトルは移行失敗の原因となります</p></td>
   </tr>
</table>

### Zilliz Cloud の要件\{#zilliz-cloud-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ユーザーロール</p></td>
     <td><p>組織オーナーまたはプロジェクト管理者</p></td>
   </tr>
   <tr>
     <td><p>クラスター容量</p></td>
     <td><p>十分なストレージおよびコンピューティングリソース（CU サイズの見積もりには <a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a> を使用してください）</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ネットワーク制限を使用している場合は、<a href="./zilliz-cloud-ips">Zilliz Cloud IPs</a> を許可リストに追加してください</p></td>
   </tr>
</table>

## データ型マッピング\{#data-type-mapping}

Pinecone のデータ型が Zilliz Cloud にどのようにマッピングされるかを理解することは、移行計画に不可欠です。

<table>
   <tr>
     <th><p>Pinecone フィールド型</p></th>
     <th><p>Zilliz Cloud フィールド型</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td><p>プライマリキー</p></td>
     <td><p>VARCHAR (プライマリキー)</p></td>
     <td><p>自動的にマッピングされます。自動IDを有効にすると新しい ID が生成されます（元の値は破棄されます）。</p></td>
   </tr>
   <tr>
     <td><p>密ベクトル</p></td>
     <td><p>FLOAT_VECTOR</p></td>
     <td><p>次元は正確に保持され、変更は不要です</p></td>
   </tr>
   <tr>
     <td><p>疎ベクトル</p></td>
     <td><p>SPARSE_FLOAT_VECTOR</p></td>
     <td><p>サンプルデータで空でない場合のみマッピングされます。</p></td>
   </tr>
   <tr>
     <td><p>メタデータ</p></td>
     <td><p>動的フィールド</p></td>
     <td><p>デフォルトで動的スキーマとしてマッピングされます。固定フィールドに変換できます。</p><p>詳細については、<a href="./enable-dynamic-field">動的フィールド</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>名前空間</p></td>
     <td><p>パーティションキー / パーティション</p></td>
     <td><p>パフォーマンス最適化を推奨。</p><p>詳細については、<a href="./migrate-from-pinecone#namespace-processing">名前空間の処理</a> を参照してください。</p></td>
   </tr>
</table>

## メタデータフィールドの変換\{#metadata-field-conversion}

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud はメタデータスキーマを検出するために 100 行をサンプリングします。必要に応じて追加のフィールドを手動で追加できます。</p>

</Admonition>

Pinecone のメタデータは、最大限の柔軟性を得るために、最初は Zilliz Cloud の動的スキーマにマッピングされます。メタデータフィールドを固定フィールドに変換することで、以下のメリットを得ることができます。

- より強力な検証のための厳格なデータ型の適用

- より優れたクエリパフォーマンスのための最適化されたインデックス作成

- 一貫したデータ管理のための構造化されたスキーマ

メタデータを固定フィールドに変換する場合：

<table>
   <tr>
     <th><p>Pinecone メタデータ型</p></th>
     <th><p>Zilliz 固定フィールド型</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td><p>文字列</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>最大 65,535 バイトをサポート</p></td>
   </tr>
   <tr>
     <td><p>数値（整数/浮動小数点）</p></td>
     <td><p>DOUBLE</p></td>
     <td><p>すべての数値型は DOUBLE になります</p></td>
   </tr>
   <tr>
     <td><p>ブール値</p></td>
     <td><p>BOOL</p></td>
     <td><p>直接マッピング</p></td>
   </tr>
   <tr>
     <td><p>文字列のリスト</p></td>
     <td><p>ARRAY&lt;VARCHAR&gt;</p></td>
     <td><p>ネストされた配列をサポート</p></td>
   </tr>
</table>

固定フィールドに変換されたメタデータフィールドについては、追加の属性を設定できます。

- **NULL許容**: フィールドが null 値を受け入れるかどうかを決定します。この機能はデフォルトで有効になっています。詳細については、[NULL許容属性](./nullable-fields) を参照してください。

- **デフォルト値**: データが欠損している場合のフォールバック値を設定します。詳細については、[デフォルト値](./nullable-fields) を参照してください。

## Pinecone 固有の処理ルール\{#pinecone-specific-handling-rules}

### 名前空間の処理\{#namespace-processing}

Pinecone の名前空間は、2 つの戦略を使用して移行できます。

<table>
   <tr>
     <th><p>戦略</p></th>
     <th><p>実装</p></th>
     <th><p>パフォーマンスへの影響</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p><strong>名前空間をパーティションキーとして</strong> <em>（推奨）</em></p></td>
     <td><p>名前空間がパーティションキーフィールドの値になります</p></td>
     <td><p>検索パフォーマンスの自動最適化</p></td>
     <td><p>複数の名前空間を持つほとんどのシナリオ</p></td>
   </tr>
   <tr>
     <td><p><strong>名前空間をパーティションとして</strong></p></td>
     <td><p>各名前空間が個別のパーティションになります</p></td>
     <td><p>手動のパーティション管理が必要</p></td>
     <td><p>名前空間が少なく安定したシンプルなシナリオ</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>Pinecone の <code>default</code> 名前空間の処理：</p>
<ul>
<li><p><strong>パーティションとして</strong>: Zilliz Cloud の <code>_default</code> パーティションになります</p></li>
<li><p><strong>パーティションキーとして</strong>: 空文字列 <code>""</code> の値になります</p></li>
</ul>
<p>パーティションおよびパーティションキーの概念の詳細については、<a href="./manage-partitions">パーティションの管理</a> および <a href="./use-partition-key">パーティションキーの使用</a> を参照してください。</p>

</Admonition>

### コレクション命名規則\{#collection-naming-rules}

Pinecone のインデックス名は、Zilliz Cloud の互換性のために自動的に処理されます。

<table>
   <tr>
     <th><p>Pinecone インデックス名</p></th>
     <th><p>Zilliz Cloud コレクション名</p></th>
     <th><p>適用されたルール</p></th>
   </tr>
   <tr>
     <td><p><code>my-vector-index</code></p></td>
     <td><p><code>my_vector_index</code></p></td>
     <td><p>ハイフン（<code>-</code>）がアンダースコア（<code>_</code>）に変換され、Zilliz Cloud のコレクション命名規則に準拠します</p></td>
   </tr>
   <tr>
     <td><p><code>product_search</code></p></td>
     <td><p><code>product_search</code></p></td>
     <td><p>変更は不要です</p></td>
   </tr>
</table>

**名前の競合**: ターゲットデータベースに同じ名前のコレクションが既に存在する場合、以下のいずれかを行う必要があります。

- 既存のコレクションを削除する、または

- 別のターゲットデータベースを選択する、または

- 移行設定時にターゲットコレクションの名前を変更する

