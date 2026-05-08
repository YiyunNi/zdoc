---
title: "グローバルクラスターに接続 | Cloud"
slug: /connect-to-global-cluster
sidebar_key: connect-to-global-cluster
sidebar_label: "グローバルクラスターに接続"
beta: FALSE
notebook: FALSE
description: "グローバルクラスターの起動後、エンドポイントと認証トークンを使用して接続します。このページでは、2種類のエンドポイント、それぞれの使用場面、およびスイッチオーバーとフェイルオーバー時のルーティング動作について説明します。 | Cloud"
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

グローバルクラスターが実行されたら、エンドポイントと認証トークンを使用して接続します。このページでは、2つのエンドポイントタイプ、それぞれの使用場面、およびスイッチオーバーとフェイルオーバー時のルーティング動作について説明します。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>ビジネスクリティカル</strong>プロジェクトの<strong>Dedicated</strong>クラスターでのみ利用可能です。</p>

</Admonition>

## エンドポイントタイプの選択\{#choose-an-endpoint-type}

グローバルクラスターは、2つの接続方法を提供します。

- **グローバルエンドポイント**経由

- グローバルクラスター内のプライマリークラスターまたはセカンダリークラスターの**パブリックまたはプライベートエンドポイント**経由

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
     <td><p>プライマリークラスターにルーティング</p><p>（レイテンシーに基づく最も近い利用可能なクラスターへのインテリジェントルーティングは、近日対応予定です。）</p></td>
     <td><p>接続した特定のクラスターに読み込みが行われる</p></td>
   </tr>
   <tr>
     <td><p><strong>スイッチオーバー / フェイルオーバー</strong></p></td>
     <td><p>自動的に再ルーティング — コード変更は不要</p></td>
     <td><p>新しいプライマリーを指すように接続を更新する必要がある</p></td>
   </tr>
   <tr>
     <td><p><strong>プライベートリンク</strong></p></td>
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

<p>本番ワークロードにはグローバルエンドポイントの使用を推奨します。これにより、スイッチオーバーまたはフェイルオーバー時にアプリケーションコードでエンドポイントの変更を処理する必要がなくなります。</p>

</Admonition>

## エンドポイントとトークンの取得\{#get-your-endpoint-and-token}

<Procedures>

1. グローバルクラスターまたは対象のクラスターに移動します。

    - **グローバルエンドポイント**の場合：**グローバルクラスター**ページに移動します。

    - **パブリックエンドポイント**の場合：特定のプライマリークラスターまたはセカンダリークラスターの**クラスター詳細**ページに移動します。

1. Connect カードで、**グローバルエンドポイント**または**パブリックエンドポイント**をコピーします。

    ![OPCTbMaYIoUXHKxDf0ycdMNBnze](https://zdoc-images.s3.us-west-2.amazonaws.com/opctbmayiouxhkxdf0ycdmnbnze.png "OPCTbMaYIoUXHKxDf0ycdMNBnze")

1. 認証トークンを準備します。これは [API キー](./manage-api-keys) または [クラスター認証情報](./cluster-credentials)（`username:password`）のいずれかです。

</Procedures>

## SDK バージョンの確認\{#check-sdk-version}

[インストール](./install-sdks)した SDK があることを確認してください。グローバルクラスターに接続する前に、SDK が最低バージョン要件を満たしていることを確認してください。

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

<p>パブリックエンドポイントを使用する場合、書き込み操作を受け付けるのはプライマリークラスターのパブリックエンドポイントのみです。セカンダリークラスターのパブリックエンドポイントへの書き込みは失敗します。</p>

</Admonition>

## Routing behavior\{#routing-behavior}

### During normal operation\{#during-normal-operation}

<table>
   <tr>
     <th><p><strong>Request type</strong></p></th>
     <th><p><strong>グローバルエンドポイント</strong></p></th>
     <th><p><strong>パブリックエンドポイント</strong></p></th>
   </tr>
   <tr>
     <td><p>Write (insert, upsert, delete)</p></td>
     <td><p>Routed to the プライマリークラスター</p></td>
     <td><p>Only accepted on the プライマリークラスター's endpoint</p></td>
   </tr>
   <tr>
     <td><p>Read (search, query)</p></td>
     <td><p>Routed to the プライマリークラスター</p><p>(Intelligent routing to the nearest available cluster based on latency will be supported soon.)</p></td>
     <td><p>Served by the specific cluster you connect to</p></td>
   </tr>
</table>

### During and after switchover / failover\{#during-and-after-switchover-failover}

<table>
   <tr>
     <th><p><strong>Scenario</strong></p></th>
     <th><p><strong>グローバルエンドポイント</strong></p></th>
     <th><p><strong>パブリックエンドポイント</strong></p></th>
   </tr>
   <tr>
     <td><p>スイッチオーバー in progress</p></td>
     <td><p>Writes briefly paused, then resume on the new primary. Reads continue.</p></td>
     <td><p>No change to endpoints. Old primary becomes secondary.</p></td>
   </tr>
   <tr>
     <td><p>フェイルオーバー in progress</p></td>
     <td><p>Writes unavailable until new primary is promoted. Reads continue on secondaries.</p></td>
     <td><p>Old primary's endpoint becomes unreachable.</p></td>
   </tr>
   <tr>
     <td><p>After completion</p></td>
     <td><p>Automatically routes to the new primary. No code changes.</p></td>
     <td><p>Update your code to use the new primary's パブリックエンドポイント for writes.</p></td>
   </tr>
</table>

### SDK automatic reconnection\{#sdk-automatic-reconnection}

グローバルエンドポイントを使用する場合、Zilliz Cloud SDK はスイッチオーバーおよびフェイルオーバー中のエンドポイントの再ルーティングを処理します。アプリケーション側でルーティング変更に対するリトライロジックを実装する必要はありません。ただし、切り替え時点で進行中の書き込みは一時的なエラーを受ける可能性があります。これらのケースは、アプリケーション内の標準的なリトライロジックで処理されます。