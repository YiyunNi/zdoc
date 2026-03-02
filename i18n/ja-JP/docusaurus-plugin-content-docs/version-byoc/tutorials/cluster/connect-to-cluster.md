---
title: "クラスターへの接続 | BYOC"
slug: /connect-to-cluster
sidebar_label: "クラスターへの接続"
beta: FALSE
notebook: FALSE
description: "この記事では、クラスターへの接続に関する体系的なガイドを提供します。 | BYOC"
type: origin
token: IVFfws0lJi8gIVkRvrvc9aXvnNe
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - クラスター
  - 接続
  - サーバーレスベクトルデータベース
  - milvus open source
  - milvusの仕組み
  - Zilliz ベクトルデータベース

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# クラスターへの接続

この記事では、クラスターへの接続に関する体系的なガイドを提供します。

## 開始する前に{#before-you-start}

続行する前に、以下の前提条件が満たされていることを確認してください。

- BYOC プロジェクトをデプロイしていること。詳細については、「[AWS に BYOC をデプロイする](./deploy-byoc-aws)」を参照してください。

- クラスターを作成していること。詳細については、「[クラスターを作成する](./create-cluster)」を参照してください。

- ユースケースに適用可能な Milvus SDK をインストールしていること。詳細については、「[SDK をインストールする](./install-sdks)」を参照してください。

<Admonition type="info" icon="📘" title="Note">

<p>SDK ではなく RESTful API の利用を検討している場合、継続的な接続を確立できないことを理解しておくことが重要です。これは、HTTP プロトコルの単方向通信モードに起因します。</p>

</Admonition>

## クラスターに接続する{#connect-to-a-cluster}

クラスターが稼働したら、そのパブリックエンドポイントと認証トークンを使用して接続します。

- **クラスターのパブリックエンドポイント:** Zilliz Cloud ウェブコンソールで取得できます。ターゲットクラスターの**クラスター詳細**ページに移動します。**接続**カードで、クラスターのパブリックエンドポイントをコピーできます。

    ![connection-info](https://zdoc-images.s3.us-west-2.amazonaws.com/connection-info.png "connection-info")

- **トークン:** このトークンは、ユーザー名とパスワードのペアで構成される[クラスター認証情報](./cluster-credentials)です。

次の例は、クラスターに接続する方法を示しています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"}]}>
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
    token=TOKEN # a colon-separated cluster username and password
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

<TabItem value='javascript'>

```javascript
const { MilvusClient, DataType, sleep } = require("@zilliz/milvus2-sdk-node")

const address = "YOUR_CLUSTER_ENDPOINT"
const token = "YOUR_CLUSTER_TOKEN"

// 1. Connect to the cluster
const client = new MilvusClient({address, token})
```

</TabItem>
</Tabs>

