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
  - ベクターデータベース
  - cloud
  - milvus
  - グローバルクラスター
  - Zilliz ベクターデータベース
  - Zilliz データベース
  - 非構造化データ
  - ベクターデータベース

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import Supademo from '@site/src/components/Supademo';

# グローバルクラスターの作成

このガイドでは、グローバルクラスターの作成方法について説明します。

既存のクラスターでグローバルクラスター機能を有効にする必要がある場合は、「[クラスターの管理](./manage-cluster#add-secondary-clusters)」を参照してください。

<Admonition type="info" icon="📘" title="Notes">

<p>この機能は、<strong>Business Critical</strong>プロジェクトの<strong>Dedicated</strong>クラスターでのみ利用可能です。</p>

</Admonition>

## 開始する前に{#before-you-start}

- プロジェクト管理者であることを確認してください。

## グローバルクラスターの作成{#create-a-global-cluster}

**Cluster Settings**で**Global Cluster**の横にあるスイッチをオンにします。グローバルクラスターは、1つのプライマリークラスターと1〜5つのセカンダリークラスターを持つ必要があります。クラウドプロバイダー、クラスタータイプ、クエリCUの数は、プライマリークラスターと一致している必要があります。

以下のデモは、ウェブコンソールを介してグローバルクラスターを作成する方法を示しています。

<Supademo id="cmkasmmcr1glake4xm2kdnfbt" title="" />

Zilliz Cloudは、プライマリークラスターとセカンダリークラスターの両方を初期化します。初期化が完了すると、プライマリークラスターから各セカンダリークラスターへのデータレプリケーションが開始されます。

**Global Topology**タブで、プライマリークラスターとセカンダリークラスター間の同期ステータスとレプリケーションレイテンシーを監視できます。

![CF69bk0flo9BtoxdvJzcFWF7nxj](https://zdoc-images.s3.us-west-2.amazonaws.com/cf69bk0flo9btoxdvjzcfwf7nxj.png "CF69bk0flo9BtoxdvJzcFWF7nxj")

## グローバルクラスターへの接続{#connect-to-a-global-cluster}

グローバルクラスターが稼働したら、**グローバルエンドポイント**または**パブリックエンドポイント**と**認証トークン**を使用して接続します。

- **グローバルエンドポイント/パブリックエンドポイント:** これはZilliz Cloudウェブコンソールで取得できます。ターゲットクラスターの**Cluster Details**ページに移動します。**Connect**カードで、グローバルエンドポイントまたはパブリックエンドポイントをコピーできます。どちらのエンドポイントをいつ使用するかについては、「[グローバルクラスターの解説](./global-cluster-explained#typical-use-cases)」を参照してください。

    <Admonition type="info" icon="📘" title="Note">

    <p>プライベートエンドポイントを設定している場合、セキュリティを強化するためにパブリックエンドポイントとグローバルエンドポイントを無効にすることを選択できます。詳細については、「<a href="./setup-a-private-link-aws#manage-internet-access-to-your-clusters">クラスターへのインターネットアクセスを管理する</a>」を参照してください。</p>

    </Admonition>

    ![DfeybVVeQoE3ksxfPPDc4V81nie](https://zdoc-images.s3.us-west-2.amazonaws.com/dfeybvveqoe3ksxfppdc4v81nie.png "DfeybVVeQoE3ksxfPPDc4V81nie")

- **トークン:** このトークンは、[APIキー](./manage-api-keys)またはユーザー名とパスワードのペアで構成される[クラスター認証情報](./cluster-credentials)のいずれかです。

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