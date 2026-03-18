---
title: "グローバルクラスターの作成 | Cloud"
slug: /create-global-cluster
sidebar_label: "グローバルクラスターの作成"
beta: FALSE
notebook: FALSE
description: "このガイドでは、グローバルクラスターを作成する方法について説明します。 | Cloud"
type: origin
token: MZ2WwklE5ifX4hkO4ZOcXz0indc
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - milvus
  - グローバルクラスター

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# グローバルクラスターの作成

このガイドでは、グローバルクラスターの作成方法について説明します。

既存のクラスターでグローバルクラスター機能を有効にする必要がある場合は、[クラスターの管理](./manage-cluster#convert-to-a-global-cluster)を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>ビジネスクリティカル</strong>プロジェクトの<strong>Dedicated</strong>クラスターでのみ利用可能です。</p>

</Admonition>

## 開始する前に\{#before-you-start}

- プロジェクト管理者であることを確認してください。

## グローバルクラスターを作成する\{#create-a-global-cluster}

**クラスター設定**で**グローバルクラスター**の横にあるスイッチをオンにし、グローバルクラスターの名前を指定します。グローバルクラスターには、1つのプライマリークラスターと1〜5つのセカンダリークラスターが必要です。クラウドプロバイダー、クラスタータイプ、クエリCUの数は、プライマリークラスターと一致している必要があります。

以下のデモは、ウェブコンソールを介してグローバルクラスターを作成する方法を示しています。

<Supademo id="cmkasmmcr1glake4xm2kdnfbt" title=""  />

Zilliz Cloudは、グローバルクラスターとそのプライマリークラスターおよびセカンダリークラスターの作成を開始します。作成が完了すると、Zilliz Cloudはプライマリークラスターから各セカンダリークラスターへのデータレプリケーションを開始します。

**グローバルクラスター**ページの**グローバルトポロジー**セクションで、プライマリークラスターとセカンダリークラスター間の同期ステータスとレプリケーションレイテンシーを監視できます。

![WJNNb0XQ9oG1tjxmYCSc00WJnxe](https://zdoc-images.s3.us-west-2.amazonaws.com/wjnnb0xq9og1tjxmycsc00wjnxe.png "WJNNb0XQ9oG1tjxmYCSc00WJnxe")

## グローバルクラスターに接続する\{#connect-to-a-global-cluster}

グローバルクラスターが稼働したら、**グローバルエンドポイント**または**パブリックエンドポイント**と**認証トークン**を使用して接続します。

- **グローバルエンドポイント/パブリックエンドポイント:** Zilliz Cloudウェブコンソールで取得できます。ターゲットクラスターの**クラスターの詳細**ページに移動します。**接続**カードで、グローバルエンドポイントまたはパブリックエンドポイントをコピーできます。どちらのエンドポイントをいつ使用するかについては、[グローバルクラスターの説明](./global-cluster-explained#typical-use-cases)を参照してください。

    <Admonition type="info" icon="📘" title="Note">

    <p>プライベートエンドポイントを設定している場合は、セキュリティを強化するためにパブリックエンドポイントとグローバルエンドポイントを無効にすることを選択できます。詳細については、<a href="./setup-a-private-link-aws#manage-internet-access-to-your-clusters">クラスターへのインターネットアクセスを管理する</a>を参照してください。</p>

    </Admonition>

    ![VmvpbMxW8oXwYyxk2n0cZ2f7nsh](https://zdoc-images.s3.us-west-2.amazonaws.com/vmvpbmxw8oxwyyxk2n0cz2f7nsh.png "VmvpbMxW8oXwYyxk2n0cZ2f7nsh")

- **トークン:** このトークンは、[APIキー](./manage-api-keys)またはユーザー名とパスワードのペアで構成される[クラスター認証情報](./cluster-credentials)のいずれかです。

    以下の例は、クラスターに接続する方法を示しています。

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