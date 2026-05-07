---
title: "接続エンドポイント | Cloud"
slug: /access-connection-endpoints
sidebar_key: access-connection-endpoints
sidebar_label: "接続エンドポイント"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud は、それぞれ異なる役割を持つ 3 つのエンドポイントを公開しています。"
type: origin
token: QSuYwaKvOiPmD7knUZ9cH0jLnAe
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - アクセス
  - 接続エンドポイント

---

import Admonition from '@theme/Admonition';


# 接続エンドポイント

Zilliz Cloud は、それぞれ異なる責務を持つ 3 つのエンドポイントを公開しています。

<table>
   <tr>
     <th></th>
     <th><p><strong>コントロールプレーン API エンドポイント</strong></p></th>
     <th><p><strong>プロジェクトエンドポイント（オンデマンド）</strong></p></th>
     <th><p><strong>リアルタイムサーブエンドポイント</strong></p></th>
   </tr>
   <tr>
     <td><p>URL パターン</p></td>
     <td><p><code>https:&ast;//&ast;api.cloud.zilliz.com</code></p></td>
     <td><p><code>https:&ast;//&ast;\{project-id\}.\{region\}.api.zillizcloud.com</code></p></td>
     <td><p><code>https:&ast;//&ast;\{cluster-id\}.\{region\}.vectordb.zillizcloud.com:19530</code></p></td>
   </tr>
   <tr>
     <td><p>責務</p></td>
     <td><p>リソースライフサイクル：クラスター、ボリューム、ジョブ、およびその他すべてのコントロールプレーンアクティビティ</p></td>
     <td><p>データインポート、バッチ検索</p></td>
     <td><p>フルコレクション API（DDL + DML + DQL）</p></td>
   </tr>
   <tr>
     <td><p>データ運用</p></td>
     <td><p>なし（データインポートを除く）</p></td>
     <td><p>バルクインサートとインポート；CU 単位で課金される検索</p></td>
     <td><p>低レイテンシーの検索およびクエリを伴う挿入、アップサート、削除</p></td>
   </tr>
   <tr>
     <td><p>使用するタイミング</p></td>
     <td><p>インフラストラクチャのプロビジョニングと自動化</p></td>
     <td><p>バッチ処理、探索、検証、実験</p></td>
     <td><p>本番サーブ、常時低レイテンシークエリ</p></td>
   </tr>
</table>

## リアルタイムサーブクラスターへの接続\{#connect-to-a-real-time-serving-cluster}

Zilliz Cloud は、Free、Serverless、Dedicated の 3 種類のサーブクラスターを提供しています。以下の例に従って接続を設定する必要があります。

```python
from pymilvus import MilvusClient

# connect to a dedicated cluster
client = MilvusClient(
    uri="https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530",
    token="YOUR_API_KEY"
)

# connect to a free / serverless cluster
client = MilvusClient(
    uri="https://{cluster-id}.serverless.{region}.vectordb.zillizcloud.com",
    token="YOUR_API_KEY"
)
```

有効な API キー（適切な権限を持つもの）または `username:password` 形式のクラスター認証情報を、認証トークンとして使用できます。

## オンデマンドクラスターへの接続\{#connect-to-an-on-demand-cluster}

Zilliz Cloud はセッションオブジェクトを提供しており、これを使用してオンデマンドクラスターをデータベースにアタッチし、そのデータベースで検索を実行できます。

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="https://{project-id}.{region}.api.zillizcloud.com",
    cluster="inxx-xxxxxxxxxxxxxxx",
    token="YOUR_API_KEY"
)

session = client.session(cluster_id="inxx-xxxxxxxxxxxxxx")

# Then, use session to conduct DQL operations, such as query, get, search, and hybrid_search.
```

オンデマンドコンピュートエンドポイントに接続する際は、オンデマンドクラスターのクラスターIDも設定する必要があります。これにより、そのクラスター内のコンピュートリソースを使用して検索やクエリを実行できます。

プロジェクトエンドポイントに接続する際は、十分な権限を持つ有効なAPIキーを認証トークンとして使用する必要があります。

## Zilliz Cloud コントロールプレーン API エンドポイントへの接続\{#connect-to-zilliz-cloud-control-plane-api-endpoint}

クラスターやボリュームの作成、またはバックアップ、リストア、マイグレーションなどのコントロールプレーンリソースの管理が必要な場合は、プラットフォームエンドポイントを使用します。

たとえば、利用可能なクラウドプロバイダーを次のように一覧表示できます。

```bash
export BASE_URL="https://api.cloud.zilliz.com"
export TOKEN="YOUR_API_KEY"

curl --request GET \
--url "${BASE_URL}/v2/clouds" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json"
```

詳細については、[RESTful API リファレンス](/reference/restful) を参照してください。