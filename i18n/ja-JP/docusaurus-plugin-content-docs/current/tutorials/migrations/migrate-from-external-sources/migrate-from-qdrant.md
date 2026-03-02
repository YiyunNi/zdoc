---
title: "Qdrant から Zilliz Cloud への移行 | Cloud"
slug: /migrate-from-qdrant
sidebar_label: "Qdrant"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Qdrant から移行する際に、Zilliz Cloud がデータ型マッピング、ペイロードフィールド変換、およびコレクション命名規則をどのように処理するかについて説明します。 | Cloud"
type: origin
token: LqMIw1DXyiHUjAk9TEAcqHp6nDd
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 移行
  - qdrant
  - マルチモーダル RAG
  - LLM のハルシネーション
  - ハイブリッド検索
  - 語彙検索

---

import Admonition from '@theme/Admonition';


# Qdrant から Zilliz Cloud への移行

このトピックでは、Qdrant からの移行時に Zilliz Cloud がデータ型マッピング、ペイロードフィールド変換、コレクション命名規則をどのように処理するかについて説明します。

## 前提条件{#prerequisites}

Qdrant から Zilliz Cloud への移行を開始する前に、以下の要件を満たしていることを確認してください。

### Qdrant の要件{#qdrant-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ソース Qdrant クラスターはパブリックインターネットからアクセス可能である必要があります</p></td>
   </tr>
   <tr>
     <td><p>API アクセス</p></td>
     <td><p>アクセス権限を持つクラスターエンドポイントと API キー</p></td>
   </tr>
   <tr>
     <td><p>データの可用性</p></td>
     <td><p>ソースコレクションにはデータが含まれている必要があります。空のコレクションは移行できません。</p></td>
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
     <td><p>十分なストレージとコンピューティングリソース（CU サイズの見積もりには<a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a>を使用してください）</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ネットワーク制限を使用している場合は、<a href="./zilliz-cloud-ips">Zilliz Cloud IP</a> を許可リストに追加してください</p></td>
   </tr>
</table>

## データ型マッピング{#data-type-mapping}

Qdrant のデータ型が Zilliz Cloud にどのようにマッピングされるかを理解することは、移行計画を立てる上で非常に重要です。

<table>
   <tr>
     <th><p>Qdrant フィールドタイプ</p></th>
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
     <td><p>次元は正確に保持され、変更は不要です</p></td>
   </tr>
   <tr>
     <td><p>疎ベクトル</p></td>
     <td><p>SPARSE_FLOAT_VECTOR</p></td>
     <td><p>サンプルデータが空でない場合にのみマッピングされます。</p></td>
   </tr>
   <tr>
     <td><p>ペイロード</p></td>
     <td><p>JSON (動的フィールド)</p></td>
     <td><p>デフォルトでは動的スキーマとしてマッピングされます。固定フィールドに変換することも可能です。</p><p>詳細については、<a href="./enable-dynamic-field">動的フィールド</a>を参照してください。</p></td>
   </tr>
</table>

## ペイロードフィールド変換{#payload-field-conversion}

<Admonition type="info" icon="📘" title="Notes">

<p>Zilliz Cloud は、ペイロードスキーマを検出するために100行をサンプリングします。必要に応じて、手動で追加のフィールドを追加できます。</p>

</Admonition>

Qdrant のペイロードは、最大限の柔軟性を確保するために、最初は Zilliz Cloud の動的スキーマにマッピングされます。オプションでペイロードフィールドを固定フィールドに変換することで、以下の利点が得られます。

- より厳密な検証のためのデータ型強制

- より良いクエリパフォーマンスのための最適化されたインデックス作成

- 一貫したデータ管理のための構造化されたスキーマ

ペイロードを固定フィールドに変換する場合：

<table>
   <tr>
     <th><p>Qdrant ペイロードタイプ</p></th>
     <th><p>Zilliz 固定フィールドタイプ</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td><p>整数</p></td>
     <td><p>INT64</p></td>
     <td><p>直接型変換</p></td>
   </tr>
   <tr>
     <td><p>浮動小数点</p></td>
     <td><p>DOUBLE</p></td>
     <td><p>すべての浮動小数点数は DOUBLE になります</p></td>
   </tr>
   <tr>
     <td><p>ブール値</p></td>
     <td><p>BOOL</p></td>
     <td><p>直接マッピング</p></td>
   </tr>
   <tr>
     <td><p>キーワード</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>最大 65,535 バイトをサポート</p></td>
   </tr>
   <tr>
     <td><p>地理情報</p></td>
     <td><p>JSON</p></td>
     <td><p>JSON 構造として保持されます。固定フィールドに変換できません</p></td>
   </tr>
   <tr>
     <td><p>日時</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>最大 65,535 バイトをサポート</p></td>
   </tr>
   <tr>
     <td><p>UUID</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>最大 65,535 バイトをサポート</p></td>
   </tr>
</table>

### 配列型のサポート{#array-type-support}

配列型は既存のペイロードデータでは検出されず、動的フィールドから変換することはできません。ただし、ほとんどの配列型は、移行設定中に新しいフィールドとして手動で追加できます。

<table>
   <tr>
     <th><p>Qdrant 配列型</p></th>
     <th><p>Zilliz Cloud 配列型</p></th>
     <th><p>手動追加可能</p></th>
   </tr>
   <tr>
     <td><p>Array\<Integer></p></td>
     <td><p>ARRAY\<INT64></p></td>
     <td><p>✅ 新しいフィールドとして追加可能</p></td>
   </tr>
   <tr>
     <td><p>Array\<Float></p></td>
     <td><p>ARRAY\<DOUBLE></p></td>
     <td><p>✅ 新しいフィールドとして追加可能</p></td>
   </tr>
   <tr>
     <td><p>Array\<Bool></p></td>
     <td><p>ARRAY\<BOOL></p></td>
     <td><p>✅ 新しいフィールドとして追加可能</p></td>
   </tr>
   <tr>
     <td><p>Array\<Keyword></p></td>
     <td><p>ARRAY\<VARCHAR></p></td>
     <td><p>✅ 新しいフィールドとして追加可能</p></td>
   </tr>
   <tr>
     <td><p>Array\<Geo></p></td>
     <td><p>サポートされていません</p></td>
     <td><p>❌ 利用不可</p></td>
   </tr>
   <tr>
     <td><p>Array\<Datetime></p></td>
     <td><p>ARRAY\<VARCHAR></p></td>
     <td><p>✅ 新しいフィールドとして追加可能</p></td>
   </tr>
   <tr>
     <td><p>Array\<UUID></p></td>
     <td><p>ARRAY\<VARCHAR></p></td>
     <td><p>✅ 新しいフィールドとして追加可能</p></td>
   </tr>
</table>

固定フィールドに変換されたペイロードフィールドには、追加の属性を設定できます。

- **Nullable**: フィールドが null 値を受け入れるかどうかを決定します。この機能はデフォルトで有効になっています。詳細については、[Nullable 属性](./nullable-and-default#nullable-attribute)を参照してください。

- **Default Value**: データが欠落している場合のフォールバック値を設定します。詳細については、[デフォルト値](./nullable-and-default#default-values)を参照してください。

- **Partition Key**: オプションで INT64 または VARCHAR フィールドをパーティションキーとして指定します。各コレクションは1つのパーティションキーのみをサポートし、選択されたフィールドは null 許容であってはならないことに注意してください。詳細については、[パーティションキーの使用](./use-partition-key)を参照してください。

## Qdrant 固有の処理ルール{#qdrant-specific-handling-rules}

### コレクション命名規則{#collection-naming-rules}

Qdrant のコレクション名は、以下の考慮事項に基づいて Zilliz Cloud に転送されます。

<table>
   <tr>
     <th><p>シナリオ</p></th>
     <th><p>影響</p></th>
     <th><p>解決策</p></th>
   </tr>
   <tr>
     <td><p>命名の競合</p></td>
     <td><p>同じ名前のコレクションがデータベースに既に存在する場合、移行ジョブを送信できません</p></td>
     <td><p>既存のコレクションを削除するか、別のターゲットデータベースを選択するか、移行設定中に名前を変更してください</p></td>
   </tr>
   <tr>
     <td><p>特殊文字</p></td>
     <td><p>コレクション名は Qdrant からそのまま保持されます</p></td>
     <td><p>コレクション名が Zilliz Cloud の命名規則に準拠していることを確認してください</p></td>
   </tr>
</table>
