---
title: "PostgreSQL から Zilliz Cloud への移行 | Cloud"
slug: /migrate-from-pgvector
sidebar_label: "PostgreSQL"
beta: FALSE
notebook: FALSE
description: "このトピックでは、PostgreSQL から Zilliz Cloud へ移行する際のデータ型マッピング、collection の命名規則、および考慮事項について説明します。 | Cloud"
type: origin
token: CiVHwbwPwipX5SkFkqVcLpESnfe
sidebar_position: 5
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 移行
  - postgresql
  - 画像類似性検索
  - コンテキストウィンドウ
  - 自然言語検索
  - 類似性検索

---

import Admonition from '@theme/Admonition';


# PostgreSQL から Zilliz Cloud への移行

このトピックでは、PostgreSQL からの移行時に Zilliz Cloud がデータ型マッピング、コレクション命名規則、および考慮事項をどのように処理するかについて説明します。

## 前提条件{#prerequisites}

PostgreSQL から Zilliz Cloud への移行を開始する前に、以下の要件を満たしていることを確認してください。

### PostgreSQL の要件{#postgresql-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ソース PostgreSQL データベースはパブリックインターネットからアクセス可能である必要があります</p></td>
   </tr>
   <tr>
     <td><p>データベースアクセス</p></td>
     <td><p>必要な権限を持つ有効なデータベースエンドポイント、ユーザー名、パスワード</p></td>
   </tr>
   <tr>
     <td><p>pgvector 拡張機能</p></td>
     <td><p>テーブルはベクトルデータストレージに pgvector 拡張機能を使用する必要があります</p></td>
   </tr>
   <tr>
     <td><p>ベクトルフィールドの要件</p></td>
     <td><p>各ソーステーブルには少なくとも1つのベクトルフィールドが含まれている必要があり、ベクトルフィールドは null 値を含むことはできません。</p></td>
   </tr>
   <tr>
     <td><p>データの可用性</p></td>
     <td><p>ソーステーブルにはデータが含まれている必要があります。空のテーブルは移行できません。</p></td>
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
     <td><p>十分なストレージとコンピューティングリソース（CU サイズの見積もりには <a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a> を使用してください）</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ネットワーク制限を使用している場合は、<a href="./zilliz-cloud-ips">Zilliz Cloud IP</a> を許可リストに追加してください</p></td>
   </tr>
</table>

## データ型マッピング{#data-type-mapping}

PostgreSQL のデータ型が Zilliz Cloud にどのようにマッピングされるかを理解することは、移行計画を立てる上で非常に重要です。

<table>
   <tr>
     <th><p>PostgreSQL フィールドタイプ</p></th>
     <th><p>Zilliz Cloud フィールドタイプ</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>主キー</p></td>
     <td><p>主キー / Auto ID</p></td>
     <td><ul><li><p><strong>単一フィールド主キー</strong>: ターゲットコレクションの主キーとして直接マッピングされます。</p></li><li><p><strong>主キーの不在</strong>: 主キーのないテーブルをサポートするために、ターゲットコレクションで Auto ID が有効になります。</p></li><li><p><strong>複合主キー:</strong> Auto ID が有効になります。複合キーは通常のスカラフィールドとして扱われます。</p><p>データを移行する際に Auto ID を有効にすることができます。ただし、そうすると、ソースコレクションの元の主キー値は破棄されます。</p></li></ul></td>
   </tr>
   <tr>
     <td><p>vector</p></td>
     <td><p>FLOAT_VECTOR</p></td>
     <td><p>ベクトル次元は変更されません。</p></td>
   </tr>
   <tr>
     <td><p>text/varchar/date/time</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>文字列として保存されます。</p></td>
   </tr>
   <tr>
     <td><p>bigint</p></td>
     <td><p>INT64</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>integer</p></td>
     <td><p>INT32</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>smallint</p></td>
     <td><p>INT16</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>double precision</p></td>
     <td><p>DOUBLE</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>real</p></td>
     <td><p>FLOAT</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>boolean</p></td>
     <td><p>BOOL</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>array</p></td>
     <td><p>ARRAY</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>json</p></td>
     <td><p>JSON</p></td>
     <td><p>-</p></td>
   </tr>
</table>

## PostgreSQL 固有の処理ルール{#postgresql-specific-handling-rules}

### コレクション命名規則{#collection-naming-rules}

PostgreSQL のテーブル名は、以下の考慮事項に基づいて Zilliz Cloud に転送されます。

<table>
   <tr>
     <th><p>シナリオ</p></th>
     <th><p>影響</p></th>
     <th><p>解決策</p></th>
   </tr>
   <tr>
     <td><p><strong>デフォルトの命名</strong></p></td>
     <td><p>コレクション名はソーステーブル名と完全に一致します</p></td>
     <td><p>PostgreSQL からの名前はそのまま保持されます</p></td>
   </tr>
   <tr>
     <td><p><strong>命名の競合</strong></p></td>
     <td><p>同じ名前のコレクションが既に存在する場合、ジョブを送信できません</p></td>
     <td><p>既存のコレクションを削除するか、別のデータベースを選択するか、移行設定中に名前を変更します</p></td>
   </tr>
   <tr>
     <td><p><strong>コレクション名の変更</strong></p></td>
     <td><p>移行中にサポートされます</p></td>
     <td><p>移行設定プロセス中にコレクションの名前を変更できます</p></td>
   </tr>
</table>

### 移行の考慮事項{#migration-considerations}

以下の機能は PostgreSQL 移行では**サポートされていません**。

<table>
   <tr>
     <th><p>制限</p></th>
     <th><p>影響</p></th>
     <th><p>代替案</p></th>
   </tr>
   <tr>
     <td><p>動的フィールドから固定フィールドへの変換</p></td>
     <td><p>既存の動的フィールドを固定型に変換できません</p></td>
     <td><p>フィールドは元の動的な性質を維持します</p></td>
   </tr>
   <tr>
     <td><p>フィールドの追加</p></td>
     <td><p>移行中に新しいフィールドを追加できません</p></td>
     <td><p>既存の Elasticsearch フィールドのみが移行されます</p></td>
   </tr>
</table>

