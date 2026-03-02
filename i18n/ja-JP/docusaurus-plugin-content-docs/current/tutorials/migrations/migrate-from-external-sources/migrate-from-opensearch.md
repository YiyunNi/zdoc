---
title: "OpenSearch から Zilliz Cloud への移行 | Cloud"
slug: /migrate-from-opensearch
sidebar_label: "OpenSearch"
beta: FALSE
notebook: FALSE
description: "このトピックでは、OpenSearch から Zilliz Cloud へ移行する際のデータ型マッピング、コレクション命名規則、および考慮事項について説明します。 | Cloud"
type: origin
token: VFMLwxpsniVGKYkE3DecmpQ2nrg
sidebar_position: 7
keywords: 
  - zilliz
  - ベクターデータベース
  - クラウド
  - 移行
  - amazon
  - opensearch
  - 自然言語検索
  - 類似性検索
  - マルチモーダル RAG
  - LLM の幻覚

---

import Admonition from '@theme/Admonition';


# OpenSearch から Zilliz Cloud への移行

このトピックでは、OpenSearch から移行する際の Zilliz Cloud でのデータ型マッピング、コレクション命名規則、および考慮事項について説明します。

## 前提条件{#prerequisites}

OpenSearch から Zilliz Cloud への移行を開始する前に、以下の要件を満たしていることを確認してください。

### OpenSearch の要件{#opensearch-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ソース OpenSearch クラスターは、パブリックインターネットからアクセス可能である必要があります。</p></td>
   </tr>
   <tr>
     <td><p>認証</p></td>
     <td><p>必要な権限を持つ有効なクラスターエンドポイント、ユーザー名、パスワード</p></td>
   </tr>
   <tr>
     <td><p>ベクトルフィールドの要件</p></td>
     <td><p>各ソースインデックスには、少なくとも1つの k-NN ベクトルフィールドが含まれている必要があります。</p></td>
   </tr>
   <tr>
     <td><p>データの可用性</p></td>
     <td><p>ソースインデックスにはデータが含まれている必要があります。空のインデックスは移行できません。</p></td>
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
     <td><p>Organization Owner または Project Admin</p></td>
   </tr>
   <tr>
     <td><p>クラスター容量</p></td>
     <td><p>十分なストレージとコンピューティングリソース（CU サイズの見積もりには<a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a>を使用してください）</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ネットワーク制限を使用している場合は、<a href="./zilliz-cloud-ips">Zilliz Cloud IP</a> を許可リストに追加してください。</p></td>
   </tr>
</table>

## データ型マッピング{#data-type-mapping}

以下の表は、OpenSearch のフィールドタイプが Zilliz Cloud のフィールドタイプにどのようにマッピングされるか、およびカスタマイズオプションの詳細をまとめたものです。

<table>
   <tr>
     <th><p><strong>OpenSearch フィールドタイプ</strong></p></th>
     <th><p><strong>Zilliz Cloud フィールドタイプ</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>プライマリキー</p></td>
     <td><p>プライマリキー</p></td>
     <td><p>OpenSearch のプライマリキー (<a href="https://opensearch.org/docs/latest/field-types/metadata-fields/id/">_id</a>) は、Zilliz Cloud のプライマリキーとして自動的にマッピングされます。</p><p>データを移行する際に、Auto ID を有効にすることができます。ただし、有効にした場合、ソーステーブルの元のプライマリキー値は破棄されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/knn-vector/">k-NN ベクトル</a></p></td>
     <td><p>FLOAT_VECTOR</p></td>
     <td><p>OpenSearch の <code>float</code> ベクトルタイプは、Zilliz Cloud の <code>FLOAT_VECTOR</code> にマッピングされます。OpenSearch のバイト/バイナリベクトルは移行でサポートされていません。</p><p>ベクトル次元は変更されません。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/alias/">エイリアス</a></p></td>
     <td><p>サポートされていません</p></td>
     <td><p>エイリアスフィールドはサポートされていません。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/binary/">バイナリ</a></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>バイナリデータは Zilliz Cloud 上で文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/numeric/">数値</a></p></td>
     <td></td>
     <td></td>
   </tr>
   <tr>
     <td><p><code>byte</code></p></td>
     <td><p>INT8</p></td>
     <td><p>直接マッピングされます。</p></td>
   </tr>
   <tr>
     <td><p><code>double</code></p></td>
     <td><p>DOUBLE</p></td>
     <td><p>直接マッピングされます。</p></td>
   </tr>
   <tr>
     <td><p><code>float</code></p></td>
     <td><p>FLOAT</p></td>
     <td><p>直接マッピングされます。</p></td>
   </tr>
   <tr>
     <td><p><code>half_float</code></p></td>
     <td><p>FLOAT</p></td>
     <td><p><code>FLOAT</code> にマッピングされます。</p></td>
   </tr>
   <tr>
     <td><p><code>integer</code></p></td>
     <td><p>INT32</p></td>
     <td><p>直接マッピングされます。</p></td>
   </tr>
   <tr>
     <td><p><code>long</code></p></td>
     <td><p>INT64</p></td>
     <td><p>直接マッピングされます。</p></td>
   </tr>
   <tr>
     <td><p><code>short</code></p></td>
     <td><p>INT16</p></td>
     <td><p>直接マッピングされます。</p></td>
   </tr>
   <tr>
     <td><p><code>unsigned_long</code></p></td>
     <td><p>サポートされていません</p></td>
     <td><p>Zilliz Cloud ではサポートされていません。</p></td>
   </tr>
   <tr>
     <td><p><code>scaled_float</code></p></td>
     <td><p>サポートされていません</p></td>
     <td><p>Zilliz Cloud ではサポートされていません。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/boolean/">ブール値</a></p></td>
     <td><p>BOOL</p></td>
     <td><p><code>true</code> または <code>false</code> を保存します。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/dates/">日付</a></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。正しい形式変換を確認してください。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/ip/">IP アドレス</a></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/range/">範囲</a></p></td>
     <td><p>JSON</p></td>
     <td><p>JSON 形式で保存されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/object-fields/">オブジェクト</a></p></td>
     <td></td>
     <td></td>
   </tr>
   <tr>
     <td><p><code>object</code></p></td>
     <td><p>JSON</p></td>
     <td><p>JSON 形式で保存されます。</p></td>
   </tr>
   <tr>
     <td><p><code>nested</code></p></td>
     <td><p>JSON</p></td>
     <td><p>JSON 形式で保存されます。</p></td>
   </tr>
   <tr>
     <td><p><code>flat_object</code></p></td>
     <td><p>JSON</p></td>
     <td><p>JSON 形式で保存されます。</p></td>
   </tr>
   <tr>
     <td><p><code>join</code></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/string/">文字列</a></p></td>
     <td></td>
     <td></td>
   </tr>
   <tr>
     <td><p><code>keyword</code></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><code>text</code></p></td>
     <td><p>VARCHAR</p></td>
     <td><p><code>VARCHAR</code> にマッピングされます。</p></td>
   </tr>
   <tr>
     <td><p><code>match_only_text</code></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><code>token_count</code></p></td>
     <td><p>INT32</p></td>
     <td><p>INT32 として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><code>wildcard</code></p></td>
     <td><p>サポートされていません</p></td>
     <td><p>Zilliz Cloud ではサポートされていません。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/autocomplete/">オートコンプリート</a></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/geographic/">地理情報</a></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/rank/">ランク</a></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/percolator/">パーコレーター</a></p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/derived/">派生</a></p></td>
     <td><p>サポートされていません</p></td>
     <td><p>派生フィールドは Zilliz Cloud ではサポートされていません。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://opensearch.org/docs/latest/field-types/supported-field-types/star-tree/">スターツリー</a></p></td>
     <td><p>サポートされていません</p></td>
     <td><p>スターツリーフィールドは Zilliz Cloud ではサポートされていません。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.opensearch.org/docs/latest/field-types/supported-field-types/index/#arrays">配列</a></p></td>
     <td><p>サポートされていません</p></td>
     <td><p>配列は移行でサポートされていません。</p></td>
   </tr>
   <tr>
     <td><p><a href="https://docs.opensearch.org/docs/latest/field-types/supported-field-types/index/#multifields">マルチフィールド</a></p></td>
     <td><p>サポートされていません</p></td>
     <td><p>マルチフィールドは移行でサポートされていません。</p></td>
   </tr>
</table>

## OpenSearch 固有の処理ルール{#opensearch-specific-handling-rules}

### コレクション命名規則{#collection-naming-rules}

OpenSearch のインデックス名は、以下の考慮事項に基づいて Zilliz Cloud に転送されます。

<table>
   <tr>
     <th><p>シナリオ</p></th>
     <th><p>影響</p></th>
     <th><p>解決策</p></th>
   </tr>
   <tr>
     <td><p>デフォルトの命名</p></td>
     <td><p>コレクション名はソースインデックス名と完全に一致します</p></td>
     <td><p>名前は OpenSearch からそのまま保持されます</p></td>
   </tr>
   <tr>
     <td><p>特殊文字</p></td>
     <td><p>ハイフン (-) またはドット (.) を含むインデックス名はエラーを引き起こし、ジョブの送信を妨げます</p></td>
     <td><p>アンダースコアまたはその他の有効な文字を使用するようにインデックス名を手動で変更します</p></td>
   </tr>
   <tr>
     <td><p>命名の競合</p></td>
     <td><p>同じ名前のコレクションがすでに存在する場合、ジョブを送信できません</p></td>
     <td><p>既存のコレクションを削除するか、別のデータベースを選択するか、移行設定中に名前を変更します</p></td>
   </tr>
</table>

### 移行の考慮事項{#migration-considerations}

以下の機能は OpenSearch 移行では**サポートされていません**。

<table>
   <tr>
     <th><p>制限</p></th>
     <th><p>影響</p></th>
     <th><p>代替案</p></th>
   </tr>
   <tr>
     <td><p>動的フィールドから固定フィールドへの変換</p></td>
     <td><p>既存の動的フィールドを固定タイプに変換できません</p></td>
     <td><p>フィールドは元の動的な性質を維持します</p></td>
   </tr>
   <tr>
     <td><p>フィールドの追加</p></td>
     <td><p>移行中に新しいフィールドを追加できません</p></td>
     <td><p>既存の Elasticsearch フィールドのみが移行されます</p></td>
   </tr>
   <tr>
     <td><p>スパースベクトル</p></td>
     <td><p>現在のリリースではサポートされていません</p></td>
     <td><p>密ベクトル代替案を検討するか、ロードマップについてサポートに問い合わせてください</p></td>
   </tr>
</table>
