---
title: "グローバルクラスターに接続 | Cloud"
slug: /connect-to-global-cluster
sidebar_key: connect-to-global-cluster
sidebar_label: "グローバルクラスターに接続"
beta: FALSE
notebook: FALSE
description: "グローバルクラスターの起動後、エンドポイントと認証トークンを使用して接続します。このページでは、2種類のエンドポイント、それぞれの使用タイミング、およびスイッチオーバーとフェイルオーバー時のルーティング動作について説明します。 | Cloud"
type: origin
token: DknbwaLS3iAAiUk9ifPc1Vmvnze
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - milvus
  - グローバルクラスター
  - 接続
  - エンドポイント
  - ルーティング

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Procedures from '@site/src/components/Procedures';

# グローバルクラスターへの接続

グローバルクラスターが実行中になったら、エンドポイントと認証トークンを使用して接続します。このページでは、2つのエンドポイントタイプ、それぞれの使用タイミング、およびスイッチオーバーとフェイルオーバー時のルーティング動作について説明します。

<Admonition type="info" icon="📘" title="Notes">

この機能は、**ビジネスクリティカル** プロジェクトの **Dedicated** クラスターでのみ利用可能です。

</Admonition>

## エンドポイントタイプの選択\{#choose-an-endpoint-type}

グローバルクラスターには、2つの接続方法があります。

- **グローバルエンドポイント** を介して接続

- グローバルクラスター内のプライマリークラスターまたはセカンダリークラスターの **パブリックエンドポイントまたはプライベートエンドポイント** を介して接続

次の表は、2つの接続エンドポイントを比較しています。

<table>
   <tr>
     <th></th>
     <th><p><strong>グローバルエンドポイント</strong></p></th>
     <th><p><strong>プライマリークラスターまたはセカンダリークラスターのエンドポイント</strong></p></th>
   </tr>
   <tr>
     <td><p><strong>書き込みルーティング</strong></p></td>
     <td><p>プライマリークラスターに自動的にルーティング</p></td>
     <td><p>プライマリーのパブリックエンドポイントのみが書き込みを受け付ける</p></td>
   </tr>
   <tr>
     <td><p><strong>読み込みルーティング</strong></p></td>
     <td><p>プライマリークラスターにルーティング</p><p>（レイテンシーに基づいて最も近い利用可能なクラスターにインテリジェントにルーティングする機能は、近日対応予定です。）</p></td>
     <td><p>接続した特定のクラスターに読み込みが行われる</p></td>
   </tr>
   <tr>
     <td><p><strong>スイッチオーバー / フェイルオーバー</strong></p></td>
     <td><p>自動的に再ルーティング — コード変更は不要</p></td>
     <td><p>新しいプライマリーに接続するよう接続先を更新する必要がある</p></td>
   </tr>
   <tr>
     <td><p><strong>プライベート Link</strong></p></td>
     <td><p>非対応（パブリックインターネットが必要）</p></td>
     <td><p>対応</p></td>
   </tr>
   <tr>
     <td><p><strong>最適な用途</strong></p></td>
     <td><p>自動フェイルオーバーとレイテンシーベースのルーティングが必要な本番アプリケーション</p></td>
     <td><p>特定のクラスターへの直接アクセス（例：環境レプリケーション、テスト、デバッグ）</p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

本番ワークロードにはグローバルエンドポイントの使用を推奨します。これにより、スイッチオーバーまたはフェイルオーバー時にアプリケーションコードでエンドポイントの変更を処理する必要がなくなります。

</Admonition>

## エンドポイントとトークンの取得\{#get-your-endpoint-and-token}

<Procedures>

1. グローバルクラスターまたは対象のクラスターに移動します。

    - **グローバルエンドポイント** の場合：**グローバルクラスター** ページに移動します。

    - **パブリックエンドポイント** の場合：特定のプライマリークラスターまたはセカンダリークラスターの **クラスター詳細** ページに移動します。

1. Connect カードで、**グローバルエンドポイント** または **パブリックエンドポイント** をコピーします。

    ![OPCTbMaYIoUXHKxDf0ycdMNBnze](https://zdoc-images.s3.us-west-2.amazonaws.com/opctbmayiouxhkxdf0ycdmnbnze.png "OPCTbMaYIoUXHKxDf0ycdMNBnze")

1. 認証トークンを準備します。これは [API キー](./manage-api-keys) または [クラスタークレデンシャル](./cluster-credentials)（`username:password`）のいずれかです。

</Procedures>

## SDK バージョンの確認\{#check-sdk-version}

[インストール済み](./install-sdks) の SDK があることを確認します。グローバルクラスターに接続する前に、SDK が最低バージョン要件を満たしていることを確認してください。

<table>
   <tr>
     <th><p>SDK</p></th>
     <th><p>最低バージョン</p></th>
   </tr>
   <tr>
     <td><p>Python</p></td>
     <td><p><code>2.6.9</code></p></td>
   </tr>
   <tr>
     <td><p>Node.js</p></td>
     <td><p><code>2.6.10</code></p></td>
   </tr>
   <tr>
     <td><p>Java</p></td>
     <td><p><code>2.6.14</code></p></td>
   </tr>
   <tr>
     <td><p>Go</p></td>
     <td><p><code>2.6.2</code></p></td>
   </tr>
</table>

## グローバルエンドポイントを使用した接続\{#connect-using-the-global-endpoint}

グローバルエンドポイントは、グローバルクラスター内の適切なクラスターにリクエストをルーティングする単一の URL です。SDK クライアントの `uri` として使用します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

# Use the global endpoint for automatic routing
client = MilvusClient(
    uri="YOUR_GLOBAL_ENDPOINT",  # Global endpoint from the console
    token="YOUR_CLUSTER_TOKEN"   # API key or username:password
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.client.ConnectConfig;

// Use the global endpoint for automatic routing
ConnectConfig connectConfig = ConnectConfig.builder()
    .uri("YOUR_GLOBAL_ENDPOINT")  // Global endpoint from the console
    .token("YOUR_CLUSTER_TOKEN")  // API key or username:password
    .build();

MilvusClientV2 client = new MilvusClientV2(connectConfig);
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient } = require("@zilliz/milvus2-sdk-node")

// Use the global endpoint for automatic routing
const client = new MilvusClient({
    address: "YOUR_GLOBAL_ENDPOINT",  // Global endpoint from the console
    token: "YOUR_CLUSTER_TOKEN"       // API key or username:password
})
```

</TabItem>

<TabItem value='java'>

```go
import "github.com/milvus-io/milvus/client/v2/milvusclient"

// Use the global endpoint for automatic routing
client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: "YOUR_GLOBAL_ENDPOINT", // Global endpoint from the console
    APIKey:  "YOUR_CLUSTER_TOKEN", // API key or username:password
})
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
  --url "YOUR_GLOBAL_ENDPOINT" \
  --header "Authorization: Bearer YOUR_CLUSTER_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"dbName": "default"}'
```

</TabItem>
</Tabs>

## Connect using a パブリックエンドポイント\{#connect-using-a-public-endpoint}

グローバルクラスター内の各クラスターには、それぞれ独自のパブリックエンドポイントがあります。特定のクラスターを直接ターゲットにする必要がある場合は、これを使用してください。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

# Connect directly to a specific cluster
client = MilvusClient(
    uri="YOUR_CLUSTER_PUBLIC_ENDPOINT",  # Public endpoint of a specific cluster
    token="YOUR_CLUSTER_TOKEN" # API key or username:password
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.client.ConnectConfig;

// Connect directly to a specific cluster
ConnectConfig connectConfig = ConnectConfig.builder()
    .uri("YOUR_CLUSTER_PUBLIC_ENDPOINT")  // Public endpoint of a specific cluster
    .token("YOUR_CLUSTER_TOKEN")  // API key or username:password
    .build();

MilvusClientV2 client = new MilvusClientV2(connectConfig);
```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient } = require("@zilliz/milvus2-sdk-node")

// Connect directly to a specific cluster
const client = new MilvusClient({
    address: "YOUR_CLUSTER_PUBLIC_ENDPOINT",  // Public endpoint of a specific cluster
    token: "YOUR_CLUSTER_TOKEN"  // API key or username:password
})
```

</TabItem>

<TabItem value='java'>

```go
import "github.com/milvus-io/milvus/client/v2/milvusclient"

// Connect directly to a specific cluster
client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: "YOUR_CLUSTER_PUBLIC_ENDPOINT",  // Public endpoint of a specific cluster
    APIKey:  "YOUR_CLUSTER_TOKEN",  // API key or username:password
})
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
  --url "YOUR_CLUSTER_PUBLIC_ENDPOINT" \
  --header "Authorization: Bearer YOUR_CLUSTER_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"dbName": "default"}'
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Notes">

パブリックエンドポイントを使用する場合、プライマリークラスターのパブリックエンドポイントのみが書き込み操作を受け付けます。セカンダリークラスターのパブリックエンドポイントへの書き込みは失敗します。

</Admonition>

## ルーティング動作\{#routing-behavior}

### 通常運用時\{#during-normal-operation}

<table>
   <tr>
     <th><p><strong>リクエストタイプ</strong></p></th>
     <th><p><strong>グローバルエンドポイント</strong></p></th>
     <th><p><strong>パブリックエンドポイント</strong></p></th>
   </tr>
   <tr>
     <td><p>書き込み（insert、upsert、delete）</p></td>
     <td><p>プライマリークラスターにルーティング</p></td>
     <td><p>プライマリークラスターのエンドポイントでのみ受け付け</p></td>
   </tr>
   <tr>
     <td><p>読み込み（search、query）</p></td>
     <td><p>プライマリークラスターにルーティング</p><p>（レイテンシーに基づく最も近い利用可能クラスターへのインテリジェントルーティングは、近日対応予定です。）</p></td>
     <td><p>接続した特定のクラスターが処理</p></td>
   </tr>
</table>

### スイッチオーバー / フェイルオーバー中および完了後\{#during-and-after-switchover-failover}

<table>
   <tr>
     <th><p><strong>シナリオ</strong></p></th>
     <th><p><strong>グローバルエンドポイント</strong></p></th>
     <th><p><strong>パブリックエンドポイント</strong></p></th>
   </tr>
   <tr>
     <td><p>スイッチオーバー進行中</p></td>
     <td><p>書き込みが一時停止し、新しいプライマリーで再開。読み込みは継続。</p></td>
     <td><p>エンドポイントに変更なし。旧プライマリーがセカンダリーに。</p></td>
   </tr>
   <tr>
     <td><p>フェイルオーバー進行中</p></td>
     <td><p>新しいプライマリーが昇格するまで書き込み不可。セカンダリーで読み込み継続。</p></td>
     <td><p>旧プライマリーのエンドポイントが到達不能に。</p></td>
   </tr>
   <tr>
     <td><p>完了後</p></td>
     <td><p>自動的に新しいプライマリーにルーティング。コード変更不要。</p></td>
     <td><p>書き込み用に新しいプライマリーのパブリックエンドポイントを使用するようコードを更新。</p></td>
   </tr>
</table>

### SDK の自動再接続\{#sdk-automatic-reconnection}

グローバルエンドポイントを使用する場合、Zilliz Cloud SDK はスイッチオーバーおよびフェイルオーバー時のエンドポイント再ルーティングを処理します。アプリケーション側でルーティング変更自体のリトライロジックを実装する必要はありません。ただし、スイッチの瞬間に進行中だった書き込みは一時的なエラーを受け取る可能性があります — アプリケーション内の標準的なリトライロジックでこれらのケースを処理できます。