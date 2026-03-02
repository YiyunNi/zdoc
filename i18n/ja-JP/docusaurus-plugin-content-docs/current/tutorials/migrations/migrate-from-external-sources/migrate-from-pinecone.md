---
title: "Pinecone から Zilliz Cloud への移行 | Cloud"
slug: /migrate-from-pinecone
sidebar_label: "Pinecone"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Pinecone から Zilliz Cloud へ移行する際のデータ型マッピング、フィールド変換、ネームスペース処理、およびコレクション命名規則について説明します。 | Cloud"
type: origin
token: R33EwQchxiO3HKk4vPnce6vkntc
sidebar_position: 2
keywords: 
  - zilliz
  - ベクターデータベース
  - クラウド
  - 移行
  - pinecone
  - milvus db
  - milvus vector db
  - Zilliz Cloud
  - milvusとは

---

import Admonition from '@theme/Admonition';


# Pinecone から Zilliz Cloud への移行

このトピックでは、Pinecone から移行する際に、Zilliz Cloud がデータ型マッピング、フィールド変換、ネームスペース処理、コレクション命名規則をどのように処理するかについて説明します。

## 前提条件{#prerequisites}

Pinecone から Zilliz Cloud への移行を開始する前に、以下の要件を満たしていることを確認してください。

### Pinecone の要件{#pinecone-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>インデックスタイプ</p></td>
     <td><p>Pinecone Serverless インデックスからの移行のみをサポート</p></td>
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
     <td><p>次元は 1 より大きい必要があります。単一次元のベクトルは移行失敗の原因となります。</p></td>
   </tr>
</table>

### Zilliz Cloud の要件{#zilliz-cloud-requirements}

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
     <td><p>十分なストレージとコンピューティングリソース（CU サイズの見積もりには<a href="https://zilliz.com/pricing#calculator">CU 計算機</a>を使用）</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ネットワーク制限を使用している場合は、<a href="./zilliz-cloud-ips">Zilliz Cloud IP</a> を許可リストに追加</p></td>
   </tr>
</table>

## データ型マッピング{#data-type-mapping}

Pinecone のデータ型が Zilliz Cloud にどのようにマッピングされるかを理解することは、移行計画を立てる上で非常に重要です。

<table>
   <tr>
     <th><p>Pinecone フィールドタイプ</p></th>
     <th><p>Zilliz Cloud フィールドタイプ</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td><p>主キー</p></td>
     <td><p>VARCHAR (主キー)</p></td>
     <td><p>自動的にマッピングされます。Auto ID を有効にすると新しい ID が生成されます（元の値は破棄されます）。</p></td>
   </tr>
   <tr>
     <td><p>密ベクトル</p></td>
     <td><p>FLOAT_VECTOR</p></td>
     <td><p>次元は正確に保持され、変更は不要です。</p></td>
   </tr>
   <tr>
     <td><p>疎ベクトル</p></td>
     <td><p>SPARSE_FLOAT_VECTOR</p></td>
     <td><p>サンプルデータが空でない場合にのみマッピングされます。</p></td>
   </tr>
   <tr>
     <td><p>メタデータ</p></td>
     <td><p>dynamic field</p></td>
     <td><p>デフォルトでは dynamic schema としてマッピングされます。固定フィールドに変換することも可能です。</p><p>詳細については、<a href="./enable-dynamic-field">Dynamic Field</a> を参照してください。</p></td>
   </tr>
   <tr>
     <td><p>ネームスペース</p></td>
     <td><p>partition key / partition</p></td>
     <td><p>パフォーマンス最適化のために推奨されます。</p><p>詳細については、<a href="./migrate-from-pinecone#namespace-processing">ネームスペース処理</a>を参照してください。</p></td>
   </tr>
</table>

## メタデータフィールドの変換{#metadata-field-conversion}

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud は、メタデータ schema を検出するために 100 行をサンプリングします。必要に応じて、追加のフィールドを手動で追加できます。</p>

</Admonition>

Pinecone のメタデータは、最大限の柔軟性を確保するために、最初は Zilliz Cloud の dynamic schema にマッピングされます。オプションで、メタデータフィールドを固定フィールドに変換することで、以下のメリットが得られます。

- より強力な検証のためのデータ型の強制

- クエリパフォーマンス向上のためのインデックス最適化

- 一貫したデータ管理のための構造化された schema

メタデータを固定フィールドに変換する場合：

<table>
   <tr>
     <th><p>Pinecone メタデータタイプ</p></th>
     <th><p>Zilliz 固定フィールドタイプ</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td><p>文字列</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>最大 65,535 バイトをサポート</p></td>
   </tr>
   <tr>
     <td><p>数値 (int/float)</p></td>
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
     <td><p>ARRAY\<VARCHAR></p></td>
     <td><p>ネストされた配列をサポート</p></td>
   </tr>
</table>

固定フィールドに変換されたメタデータフィールドには、追加の属性を設定できます。

- **Nullable**: フィールドが null 値を受け入れるかどうかを決定します。この機能はデフォルトで有効になっています。詳細については、[Nullable 属性](./nullable-and-default#nullable-attribute)を参照してください。

- **Default Value**: データが欠落している場合のフォールバック値を設定します。詳細については、[デフォルト値](./nullable-and-default#default-values)を参照してください。

## Pinecone 固有の処理ルール{#pinecone-specific-handling-rules}

### ネームスペース処理{#namespace-processing}

Pinecone のネームスペースは、2 つの戦略で移行できます。

<table>
   <tr>
     <th><p>戦略</p></th>
     <th><p>実装</p></th>
     <th><p>パフォーマンスへの影響</p></th>
     <th><p>ユースケース</p></th>
   </tr>
   <tr>
     <td><p><strong>Partition Key としてのネームスペース</strong> <em>(推奨)</em></p></td>
     <td><p>ネームスペースは partition key フィールドの値になります</p></td>
     <td><p>検索パフォーマンスの自動最適化</p></td>
     <td><p>複数のネームスペースを持つほとんどのシナリオ</p></td>
   </tr>
   <tr>
     <td><p><strong>Partition としてのネームスペース</strong></p></td>
     <td><p>各ネームスペースが個別の partition になります</p></td>
     <td><p>手動での partition 管理が必要</p></td>
     <td><p>ネームスペースが少なく、安定している単純なシナリオ</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>Pinecone の <code>default</code> ネームスペースの処理：</p>
<ul>
<li><p><strong>Partition として</strong>: Zilliz Cloud では <code>_default</code> partition になります</p></li>
<li><p><strong>Partition Key として</strong>: 空文字列 <code>""</code> の値になります</p></li>
</ul>
<p>partition および partition key の概念の詳細については、<a href="./manage-partitions">パーティションの管理</a>および<a href="./use-partition-key">パーティションキーの使用</a>を参照してください。</p>

</Admonition>

### collection 命名規則{#collection-naming-rules}

Pinecone のインデックス名は、Zilliz Cloud との互換性のために自動的に処理されます。

<table>
   <tr>
     <th><p>Pinecone インデックス名</p></th>
     <th><p>Zilliz Cloud collection 名</p></th>
     <th><p>適用されるルール</p></th>
   </tr>
   <tr>
     <td><p><code>my-vector-index</code></p></td>
     <td><p><code>my_vector_index</code></p></td>
     <td><p>Zilliz Cloud の collection 命名規則に準拠するため、ハイフン (<code>-</code>) はアンダースコア (<code>_</code>) に変換されます</p></td>
   </tr>
   <tr>
     <td><p><code>product_search</code></p></td>
     <td><p><code>product_search</code></p></td>
     <td><p>変更不要</p></td>
   </tr>
</table>

**命名の競合**: ターゲットデータベースに同じ名前の collection がすでに存在する場合、以下のいずれかの操作を行う必要があります。

- 既存の collection を削除する、または

- 別のターゲットデータベースを選択する、または

- 移行設定中にターゲット collection の名前を変更する

