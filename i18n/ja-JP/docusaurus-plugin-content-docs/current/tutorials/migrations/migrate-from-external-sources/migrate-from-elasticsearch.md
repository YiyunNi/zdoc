---
title: "Elasticsearch から Zilliz Cloud への移行 | Cloud"
slug: /migrate-from-elasticsearch
sidebar_label: "Elasticsearch"
beta: FALSE
notebook: FALSE
description: "このトピックでは、Elasticsearch から Zilliz Cloud へ移行する際のデータ型マッピング、collection の命名規則、および考慮事項について説明します。 | Cloud"
type: origin
token: Y8nwwbi0KiwtVZkMaSQcsPcwnkf
sidebar_position: 4
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - 移行
  - elasticsearch
  - AI チャットボット
  - コサイン距離
  - ベクトルデータベースとは
  - vectordb

---

import Admonition from '@theme/Admonition';


# ElasticsearchからZilliz Cloudへの移行

このトピックでは、[Elasticsearch](https://www.elastic.com/elasticsearch)からZilliz Cloudへ移行する際のデータ型マッピング、コレクション命名規則、および考慮事項について説明します。

## 前提条件{#prerequisites}

ElasticsearchからZilliz Cloudへの移行を開始する前に、以下の要件を満たしていることを確認してください。

### Elasticsearchの要件{#elasticsearch-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>バージョン互換性</p></td>
     <td><p>Elasticsearch 7.x以降</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ソースクラスターはパブリックインターネットからアクセス可能である必要があります</p></td>
   </tr>
   <tr>
     <td><p>APIアクセス</p></td>
     <td><p>適切な認証情報を持つ有効なクラスターエンドポイントまたはクラウドID</p></td>
   </tr>
   <tr>
     <td><p>ベクトルフィールドの要件</p></td>
     <td><p>各ソースインデックスには、少なくとも1つのdense vector fieldが含まれている必要があります</p></td>
   </tr>
</table>

### Zilliz Cloudの要件{#zilliz-cloud-requirements}

<table>
   <tr>
     <th><p>要件</p></th>
     <th><p>詳細</p></th>
   </tr>
   <tr>
     <td><p>ユーザーロール</p></td>
     <td><p>Organization OwnerまたはProject Admin</p></td>
   </tr>
   <tr>
     <td><p>クラスター容量</p></td>
     <td><p>十分なストレージとコンピューティングリソース（CUサイズの推定には<a href="https://zilliz.com/pricing#calculator">CU計算機</a>を使用してください）</p></td>
   </tr>
   <tr>
     <td><p>ネットワークアクセス</p></td>
     <td><p>ネットワーク制限を使用している場合は、<a href="./zilliz-cloud-ips">Zilliz Cloud IP</a>を許可リストに追加してください</p></td>
   </tr>
</table>

## データ型マッピング{#data-type-mapping}

Elasticsearchのデータ型がZilliz Cloudにどのようにマッピングされるかを理解することは、移行計画を立てる上で非常に重要です。

<table>
   <tr>
     <th><p><strong>Elasticsearchフィールドタイプ</strong></p></th>
     <th><p><strong>Zilliz Cloudフィールドタイプ</strong></p></th>
     <th><p><strong>説明</strong></p></th>
   </tr>
   <tr>
     <td><p>Primary key</p></td>
     <td><p>Primary key</p></td>
     <td><p>自動的にマッピングされます。Auto IDを有効にすると新しいIDが生成されます（元の値は破棄されます）。</p></td>
   </tr>
   <tr>
     <td><p>dense_vector</p></td>
     <td><p>FLOAT_VECTOR</p></td>
     <td><p>ベクトル次元は変更されません。メトリックタイプとして<strong>L2</strong>または<strong>IP</strong>を指定します。</p></td>
   </tr>
   <tr>
     <td><p>text, string, keyword, ip, date, timestamp</p></td>
     <td><p>VARCHAR</p></td>
     <td><p>最大長（1～65,535バイト）を設定します。制限を超える文字列は移行エラーを引き起こす可能性があります。</p></td>
   </tr>
   <tr>
     <td><p>long</p></td>
     <td><p>INT64</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>integer</p></td>
     <td><p>INT32</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>short</p></td>
     <td><p>INT16</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>byte</p></td>
     <td><p>INT8</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>double</p></td>
     <td><p>DOUBLE</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>float</p></td>
     <td><p>FLOAT</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>boolean</p></td>
     <td><p>BOOL</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>object</p></td>
     <td><p>JSON</p></td>
     <td><p>-</p></td>
   </tr>
   <tr>
     <td><p>arrays</p></td>
     <td><p>ARRAY</p></td>
     <td><p>-</p></td>
   </tr>
</table>

## Elasticsearch固有の処理ルール{#elasticsearch-specific-handling-rules}

### コレクション命名規則{#collection-naming-rules}

Elasticsearchのインデックス名は、以下の考慮事項に基づいてZilliz Cloudに転送されます。

<table>
   <tr>
     <th><p>シナリオ</p></th>
     <th><p>影響</p></th>
     <th><p>解決策</p></th>
   </tr>
   <tr>
     <td><p>デフォルトの命名</p></td>
     <td><p>コレクション名はソースインデックス名と完全に一致します</p></td>
     <td><p>OpenSearchからそのままの名前が保持されます</p></td>
   </tr>
   <tr>
     <td><p>特殊文字</p></td>
     <td><p>ハイフン (-) やドット (.) を含むインデックス名はエラーを引き起こし、ジョブの送信を妨げます</p></td>
     <td><p>インデックス名をアンダースコアまたはその他の有効な文字を使用するように手動で変更します</p></td>
   </tr>
   <tr>
     <td><p>命名の競合</p></td>
     <td><p>同じ名前のコレクションがすでに存在する場合、ジョブを送信できません</p></td>
     <td><p>既存のコレクションを削除するか、別のデータベースを選択するか、移行設定中に名前を変更します</p></td>
   </tr>
</table>

### 移行の考慮事項{#migration-considerations}

以下の機能はElasticsearchの移行では**サポートされていません**。

<table>
   <tr>
     <th><p>制限事項</p></th>
     <th><p>影響</p></th>
     <th><p>代替案</p></th>
   </tr>
   <tr>
     <td><p>動的フィールドから固定フィールドへの変換</p></td>
     <td><p>既存のdynamic fieldを固定タイプに変換することはできません</p></td>
     <td><p>フィールドは元の動的な性質を維持します</p></td>
   </tr>
   <tr>
     <td><p>フィールドの追加</p></td>
     <td><p>移行中に新しいフィールドを追加することはできません</p></td>
     <td><p>既存のElasticsearchフィールドのみが移行されます</p></td>
   </tr>
   <tr>
     <td><p>Sparse vectors</p></td>
     <td><p>現在のリリースではサポートされていません</p></td>
     <td><p>dense vectorの代替案を検討するか、ロードマップについてはサポートにお問い合わせください</p></td>
   </tr>
</table>
