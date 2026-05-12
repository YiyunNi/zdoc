---
title: "Tencent Cloud から Zilliz Cloud への移行 | Cloud"
slug: /migrate-from-tencent-cloud
sidebar_key: migrate-from-tencent-cloud
sidebar_label: "Tencent Cloud VectorDB"
beta: FALSE
notebook: FALSE
description: "本トピックでは、Tencent Cloud VectorDB からの移行時における Zilliz Cloud のデータ型マッピング、JSON フィールド変換、およびコレクション命名規則について説明します。"
type: origin
token: SwgXwdHG6iqpbUknXrHcOPd7nRe
sidebar_position: 6
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 移行
  - tencent cloud

---

import Admonition from '@theme/Admonition';


# Tencent Cloud から Zilliz Cloud への移行

このトピックでは、[Tencent Cloud VectorDB](https://www.tencentcloud.com/products/vdb) からの移行時に、Zilliz Cloud がデータ型のマッピング、JSON フィールドの変換、およびコレクションの命名規則をどのように処理するかについて説明します。

## 前提条件\{#prerequisites}

Tencent Cloud VectorDB から Zilliz Cloud への移行を開始する前に、以下の要件を満たしていることを確認してください。

### Tencent Cloud VectorDB の要件\{#tencent-cloud-vectordb-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ソースの VectorDB インスタンスはパブリックインターネットからアクセス可能である必要があります</p></td>
   </tr>
   <tr>
     <td><p>API アクセス</p></td>
     <td><p>必要な権限を持つ有効なインスタンス URL と API キー</p></td>
   </tr>
   <tr>
     <td><p>データの可用性</p></td>
     <td><p>ソースのコレクションにはデータが含まれている必要があります。空のコレクションは移行できません。</p></td>
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
     <td><p>十分なストレージおよびコンピューティングリソース（<a href="https://zilliz.com/pricing#calculator">CU 計算ツール</a>を使用して CU サイズを見積もってください）</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ネットワーク制限を使用している場合は、<a href="./zilliz-cloud-ips">Zilliz Cloud IP</a> を許可リストに追加してください</p></td>
   </tr>
</table>

## データ型のマッピング\{#data-type-mapping}

Tencent Cloud VectorDB のデータ型が Zilliz Cloud にどのようにマッピングされるかを理解することは、移行の計画に不可欠です。

<table>
   <tr>
     <th><p>VectorDB フィールド型</p></th>
     <th><p>Zilliz Cloud フィールド型</p></th>
     <th><p>説明</p></th>
   </tr>
   <tr>
     <td><p>プライマリキー</p></td>
     <td><p>VARCHAR (プライマリキー)</p></td>
     <td><p>Tencent Cloud VectorDB のプライマリキーは、Zilliz Cloud のプライマリキーとして自動的にマッピングされます。</p><p>データの移行時に自動IDを有効にすることができます。ただし、有効にした場合、ソースコレクションの元のプライマリキー値は破棄されます。</p></td>
   </tr>
   <tr>
     <td><p>デンスベクトル</p></td>
     <td><p>FLOAT_VECTOR</p></td>
     <td><p>デンスベクトルフィールドは、変更を加えることなく FLOAT_VECTOR として転送されます。</p></td>
   </tr>
   <tr>
     <td><p>JSON</p></td>
     <td><p>JSON (動的フィールド)</p></td>
     <td><p>デフォルトで動的スキーマとしてマッピングされます。固定フィールドに変換することも可能です。</p><p>詳細については、<a href="./enable-dynamic-field">動的フィールド</a>を参照してください。</p></td>
   </tr>
</table>

## JSON フィールドの変換\{#json-field-conversion}

<Admonition type="info" icon="📘" title="Notes">

Zilliz Cloud は JSON スキーマを検出するために 100 行をサンプリングします。必要に応じて、手動で追加のフィールドを追加できます。

</Admonition>

Tencent Cloud VectorDB の JSON フィールドは、最大限の柔軟性を得るために、最初は Zilliz Cloud の動的スキーマにマッピングされます。JSON フィールドを固定フィールドに変換することで、以下のメリットを得ることができます。

- より強力な検証のための厳格なデータ型の適用

- より優れたクエリパフォーマンスのための最適化されたインデックス作成

- 一貫したデータ管理のための構造化されたスキーマ

以下の JSON フィールド型は、動的フィールドから固定フィールドに自動的に変換できます。

<table>
   <tr>
     <th><p>VectorDB JSON 型</p></th>
     <th><p>Zilliz 固定フィールド型</p></th>
     <th><p>備考</p></th>
   </tr>
   <tr>
     <td><p>string</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>最大 65,535 バイトをサポート</p></td>
   </tr>
   <tr>
     <td><p>uint64</p></td>
     <td><p>INT32</p></td>
     <td><p>型調整を伴う数値変換</p></td>
   </tr>
   <tr>
     <td><p>double</p></td>
     <td><p>DOUBLE</p></td>
     <td><p>直接の型変換</p></td>
   </tr>
   <tr>
     <td><p>array</p></td>
     <td><p>ARRAY</p></td>
     <td><p>対応する要素型とともにサポート</p></td>
   </tr>
</table>

固定フィールドに変換された JSON フィールドについては、追加の属性を設定できます。

- **NULL許容**: フィールドが null 値を受け入れるかどうかを決定します。この機能はデフォルトで有効になっています。詳細については、[NULL許容属性](./nullable-fields)を参照してください。

- **デフォルト値**: データが欠落している場合のフォールバック値を設定します。詳細については、[デフォルト値](./nullable-fields)を参照してください。

- **パーティションキー**: オプションで、INT64 または VARCHAR フィールドをパーティションキーとして指定できます。各コレクションは1つのパーティションキーのみをサポートし、選択したフィールドは NULL許容にできないことに注意してください。詳細については、[パーティションキーの使用](./use-partition-key)を参照してください。

## Tencent Cloud VectorDB 固有の処理ルール\{#tencent-cloud-vectordb-specific-handling-rules}

### コレクションの命名規則\{#collection-naming-rules}

Tencent Cloud VectorDB のコレクション名は、以下の考慮事項に従って Zilliz Cloud に転送されます。

<table>
   <tr>
     <th><p>シナリオ</p></th>
     <th><p>影響</p></th>
     <th><p>ソリューション</p></th>
   </tr>
   <tr>
     <td><p>デフォルトの命名</p></td>
     <td><p>コレクション名はソースのコレクション名と完全に一致します</p></td>
     <td><p>名前は Tencent Cloud VectorDB からそのまま保持されます</p></td>
   </tr>
   <tr>
     <td><p>名前の競合</p></td>
     <td><p>同じ名前のコレクションがデータベースに既に存在する場合、移行ジョブを送信できません</p></td>
     <td><p>既存のコレクションを削除する、別のターゲットデータベースを選択する、または移行設定時に名前を変更してください</p></td>
   </tr>
   <tr>
     <td><p>特殊文字</p></td>
     <td><p>コレクション名は Qdrant からそのまま保持されます</p></td>
     <td><p>コレクション名が Zilliz Cloud の命名規則に準拠していることを確認してください</p></td>
   </tr>
</table>
