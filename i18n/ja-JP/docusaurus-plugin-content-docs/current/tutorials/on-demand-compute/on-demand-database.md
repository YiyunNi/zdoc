---
title: "データベース | Cloud"
slug: /on-demand-database
sidebar_key: on-demand-database
sidebar_label: "データベース"
beta: PUBLIC
notebook: FALSE
description: "オンデマンドコンピュートのデータベースは、プラットフォームによって管理され、クラスターのプロビジョニングやメンテナンスは不要です。このタイプのデータベース内のデータに対するクエリ検索を実行するために、オンデマンドコンピュートを指定します。詳細については、「データベースの説明」を参照してください。 | Cloud"
type: origin
token: Dln4wglKhi0ijkkHtCQcLGQpnnc
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - オンデマンドコンピュート
  - データベース

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# データベース

オンデマンドコンピュートのデータベースは、プラットフォームによって管理され、クラスターのプロビジョニングやメンテナンスは不要です。このタイプのデータベース内のデータに対するクエリ検索を実行するために、オンデマンドコンピュートを指定します。詳細については、[データベース Explained](./database-concept) を参照してください。

このガイドでは、オンデマンドコンピュートのデータベースの管理方法について説明します。

<Admonition type="info" icon="📘" title="Note">

<p>この機能は<strong>Enterprise</strong>プロジェクトでのみ利用可能です。</p>

</Admonition>

## 制限ations\{#limitations}

- オンデマンドコンピュートのデータベースを管理するには、**プロジェクト管理者**である必要があります。

- 各プロジェクトで作成できるオンデマンドコンピュートのデータベースは最大100個です。

- オンデマンドデータベース内のすべてのコレクション（[managed](./manage-collections-sdks) または [external](./external-volume)）は、インデックスの削除をサポートしません。

## Create database\{#create-database}

このタイプのデータベースは、プロジェクトレベルのリソースであり、プロジェクト内のすべてのオンデマンドクラスターで共有されます。

- **RESTful API経由**

    ```bash
    export PROJECT_ENDPOINT="https://{project-id}.{region}.api.zillizcloud.com"
    export TOKEN="YOUR_CLUSTER_TOKEN"
    
    curl --request POST \
    --url "${PROJECT_ENDPOINT}/v2/vectordb/databases/create" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Content-Type: application/json" \
    -d '{
        "dbName": "my_database"
    }'
    ```

- **ウェブコンソール経由**

    ![OisSw2P8QhBiYqbInlbc8lpKnHc](https://zdoc-images.s3.us-west-2.amazonaws.com/OisSw2P8QhBiYqbInlbc8lpKnHc.png)

    <Procedures>

    1. プロジェクトに移動し、**On-demand** をクリックします。

    1. 次に **データベースs** をクリックします。

    1. **Create データベース** をクリックします。

    1. データベース名を入力します。

    1. **Create** をクリックします。

    </Procedures>



## View databases\{#view-databases}

- **RESTful API経由**

    ```bash
    export PROJECT_ENDPOINT="https://{project-id}.{region}.api.zillizcloud.com"
    export TOKEN="YOUR_API_KEY"
    
    curl --request POST \
    --url "${PROJECT_ENDPOINT}/v2/vectordb/databases/list" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Content-Type: application/json" \
    -d '{}'
    ```

- **ウェブコンソール経由**

    ![LBPOwbowXhS1e4b7dxxcAIxVnue](https://zdoc-images.s3.us-west-2.amazonaws.com/LBPOwbowXhS1e4b7dxxcAIxVnue.png)

## データベースの削除\{#drop-database}

<Admonition type="danger" icon="🚧" title="**Warning**">

<p>データベースを削除すると、即座に削除され、復元することはできません。この操作は元に戻せません。</p>

</Admonition>

- **RESTful API経由**

    ```bash
    export PROJECT_ENDPOINT="https://{project-id}.{region}.api.zillizcloud.com"
    export TOKEN="YOUR_API_KEY"
    
    curl --request POST \
    --url "${PROJECT_ENDPOINT}/v2/vectordb/databases/drop" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Content-Type: application/json" \
    -d '{
        "dbName": "my_database"
    }'
    ```

- **ウェブコンソール経由**

    ![MR8pwmkRoh1cnvbcSPfcEiwan4g](https://zdoc-images.s3.us-west-2.amazonaws.com/MR8pwmkRoh1cnvbcSPfcEiwan4g.png)

    