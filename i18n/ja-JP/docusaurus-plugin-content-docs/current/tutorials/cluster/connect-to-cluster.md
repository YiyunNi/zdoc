---
title: "クラスターに接続 | Cloud"
slug: /connect-to-cluster
sidebar_label: "クラスターに接続"
beta: FALSE
notebook: FALSE
description: "この記事では、クラスターへの接続に関する体系的なガイドを提供します。"
type: origin
token: IVFfws0lJi8gIVkRvrvc9aXvnNe
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - クラスター
  - 接続

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# クラスターに接続する

この記事では、クラスターへの接続に関する体系的なガイドを提供します。

## 開始する前に\{#before-you-start}

続行する前に、以下の前提条件が満たされていることを確認してください。

- Zilliz Cloud にアカウントを登録していること。詳細については、[Zilliz Cloud に登録する](./register-with-zilliz-cloud) を参照してください。

- クラスターを作成していること。詳細については、[クラスターを作成する](./create-cluster) を参照してください。

- ユースケースに適用可能な Milvus SDK をインストールしていること。詳細については、[SDK をインストールする](./install-sdks) を参照してください。

<Admonition type="info" icon="📘" title="Note">

<p>SDK よりも RESTful API の利用を検討している方にとって、継続的な接続を確立できないことを理解することが重要です。これは、HTTP プロトコルの単方向通信モードに起因します。</p>

</Admonition>

## クラスターに接続する\{#connect-to-a-cluster}

クラスターが稼働したら、そのパブリックエンドポイントと認証トークンを使用して接続します。

- **クラスターのパブリックエンドポイント:** Zilliz Cloud ウェブコンソールで取得できます。対象クラスターの **クラスターの詳細** ページに移動します。**接続** カードで、クラスターのパブリックエンドポイントをコピーできます。

    ![connection-info](https://zdoc-images.s3.us-west-2.amazonaws.com/connection-info.png "connection-info")

- **トークン:** このトークンは、[API キー](./manage-api-keys) またはユーザー名とパスワードのペアで構成される [クラスター認証情報](./cluster-credentials) のいずれかです。

次の例は、クラスターに接続する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Connect using a MilvusClient object
from pymilvus import MilvusClient
CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT" # Set your cluster endpoint
TOKEN="YOUR_CLUSTER_TOKEN" # Set your token

# Initialize a MilvusClient instance
# Replace uri and token with your own
client = MilvusClient(
    uri=CLUSTER_ENDPOINT, # Cluster endpoint obtained from the console
    token=TOKEN # API key or a colon-separated cluster username and password
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.client.ConnectConfig;

String CLUSTER_ENDPOINT = "YOUR_CLUSTER_ENDPOINT";
String TOKEN = "YOUR_CLUSTER_TOKEN";

// 1. Connect to Milvus server
ConnectConfig connectConfig = ConnectConfig.builder()
    .uri(CLUSTER_ENDPOINT)
    .token(TOKEN)
    .build();

MilvusClientV2 client = new MilvusClientV2(connectConfig);

```

</TabItem>

<TabItem value='java'>

```javascript
const { MilvusClient, DataType, sleep } = require("@zilliz/milvus2-sdk-node")

const address = "YOUR_CLUSTER_ENDPOINT"
const token = "YOUR_CLUSTER_TOKEN"

// 1. Connect to the cluster
const client = new MilvusClient({address, token})
```

</TabItem>

<TabItem value='java'>

```go
import "github.com/milvus-io/milvus/client/v2/milvusclient"

client, err := milvusclient.New(ctx, &milvusclient.ClientConfig{
    Address: "YOUR_CLUSTER_ENDPOINT",
    APIKey:  "YOUR_CLUSTER_TOKEN",
})
```

</TabItem>

<TabItem value='java'>

```bash
curl --request POST \
  --url "YOUR_CLUSTER_ENDPOINT" \
  --header "Authorization: Bearer YOUR_CLUSTER_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"dbName": "default"}'
```

</TabItem>
</Tabs>

