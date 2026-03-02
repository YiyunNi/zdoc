---
title: "プロジェクトの管理 | Cloud"
slug: /manage-projects
sidebar_label: "プロジェクト"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでは、プロジェクトは組織内の論理的なコンテナとして機能し、クラスターと関連リソースをグループ化します。ビジネスのさまざまな側面に合わせた複数のプロジェクトを作成できます。たとえば、会社がマルチメディア推薦サービスを提供している場合、ビデオ推薦用に1つのプロジェクトを、音楽推薦用に別のプロジェクトを作成できます。"
type: origin
token: NXypwJ2ySiv7RAkyKb5cZ9SKnvf
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - プロジェクト
  - オーディオ類似性検索
  - エラスティック ベクトルデータベース
  - Pinecone vs Milvus
  - Chroma vs Milvus

---

import Admonition from '@theme/Admonition';


import Supademo from '@site/src/components/Supademo';

# プロジェクトの管理

Zilliz Cloudでは、プロジェクトは組織内の論理的なコンテナとして機能し、クラスターと関連リソースをグループ化します。ビジネスのさまざまな側面に合わせて複数のプロジェクトを作成できます。たとえば、会社がマルチメディア推薦サービスを提供している場合、ビデオ推薦用に1つのプロジェクトを、音楽推薦用に別のプロジェクトを作成できます。

このガイドでは、プロジェクトを管理する手順を説明します。

## プロジェクトの作成{#create-a-project}

各組織には、削除できない`Default Project`という名前のデフォルトの**Enterprise**プロジェクトが付属しています。ワークロードとビジネスニーズに基づいて、追加のプロジェクトを作成できます。プロジェクトを作成すると、自動的にそのプロジェクトの[プロジェクト管理者](./project-users)になります。

### 制限事項{#limits}

- プロジェクトを作成するには、[組織の所有者](./organization-users)である必要があります。

- 各組織で最大100個のプロジェクトを作成できます。

### 手順{#procedures}

プロジェクトを作成する際には、プロジェクト名を指定し、ニーズに最適なプロジェクトプランを選択する必要があります。プランによって利用可能な機能と請求が決まります。価格、プランの違い、適切なプランの選択方法の詳細については、[詳細なプラン比較](./select-zilliz-cloud-service-plans)を参照してください。

Zilliz CloudウェブコンソールまたはRESTful APIを介してプロジェクトを作成できます。

- **ウェブコンソール経由**

    以下のデモは、Zilliz Cloudウェブコンソールでプロジェクトを作成する方法を示しています。

    <Supademo id="cmhivxhnz5zctfatifx1jw34l?utm_source=link" title=""  />

    ![create-project](https://zdoc-images.s3.us-west-2.amazonaws.com/create-project.png "create-project")

- **RESTful API経由**

    以下の例は、現在の組織に`My Project`という名前のStandardプロジェクトを作成する方法を示しています。詳細については、[プロジェクトの作成](/reference/restful/create-project-v2)を参照してください。

    ```bash
    export TOKEN="YOUR_API_KEY"
    
    curl --request POST \
    --url "${BASE_URL}/v2/projects" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Content-Type: application/json" \
    -d '{
        "projectName": "My Project",
        "plan": "Standard"
    }'
    ```

    以下は出力例です。

    ```bash
    {
        "code": 0,
        "data": {
            "projectId": "proj-x"
        }
    }
    ```

## プロジェクトをアップグレードする{#upgrade-a-project}

高度な機能を利用するには、既存のプロジェクトのプランをアップグレードできます。

プロジェクトをアップグレードすると、プロジェクト内のすべてのクラスターもアップグレードされます。

プロジェクトを**Business Critical**または**BYOC**プランにアップグレードする必要がある場合は、[営業担当者にお問い合わせください](https://zilliz.com/contact-sales)。

- **Webコンソール経由**

    以下のデモは、プロジェクトのプランを**Standard**から**Enterprise**にアップグレードする方法を示しています。

    <Supademo id="cmhiw3gu85zhlfati4r154s2h?utm_source=link" title=""  />

- **RESTful API経由**

    以下のデモは、プロジェクトのプランをStandardからEnterpriseにアップグレードする方法を示しています。詳細については、[プロジェクトのアップグレード](/reference/restful/upgrade-project-v2)を参照してください。

    ```bash
    export TOKEN="YOUR_API_KEY"
    export projectId="proj-xx"
    
    curl --request PATCH \
    --url "${BASE_URL}/v2/projects/${projectId}" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Content-Type: application/json" \
    -d '{
        "plan": "Enterprise"
    }'
    ```

    以下は出力例です。

    ```bash
    {
        "code": 0,
        "data": {
            "projectId": "proj-x"
        }
    }
    ```

## すべてのプロジェクトを表示する{#view-all-projects}

組織内のアクセス権限のあるすべてのプロジェクトのリストを表示できます。

- **Webコンソール経由**

    ![view-projects-saas](https://zdoc-images.s3.us-west-2.amazonaws.com/view-projects-saas.png "view-projects-saas")

- **RESTful API経由**

    以下の例は、現在の組織内のすべてのプロジェクトをリストする方法を示しています。詳細については、[プロジェクトのリスト](/reference/restful/list-projects-v2)を参照してください。

    ```bash
    export TOKEN="YOUR_API_KEY"
    
    curl --request GET \
    --url "${BASE_URL}/v2/projects" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Accept: application/json" \
    --header "Content-Type: application/json"
    ```

    以下は出力例です。

    ```json
    {
        "code": 0,
        "data": [
            {
                "projectName": "Default Project",
                "projectId": "proj-xxxxxxxxxxxxxxxxxxxxxxx",
                "instanceCount": 2,
                "createTime": "2023-08-16T07:34:06Z",
                "plan": "Enterprise"
            }
        ]
    }
    ```

## プロジェクトの詳細を表示する{#view-project-details}

特定のプロジェクトの詳細を確認することもできます。

- **Webコンソール経由**

    **Projects**ページで、プロジェクト名、プラン、作成時間、プロジェクト内のクラスター数を確認できます。特定のプロジェクトをクリックすると、そのクラスターを表示できます。

    ![NoSTbfMVjoPp99x5cjcc0cwWnbd](https://zdoc-images.s3.us-west-2.amazonaws.com/nostbfmvjopp99x5cjcc0cwwnbd.png "NoSTbfMVjoPp99x5cjcc0cwWnbd")

- **RESTful API経由**

    以下の例では、プロジェクト`proj-xxxxxxxxxxxxxxx`について説明します。詳細については、[Describe Project](/reference/restful/describe-project-v2)を参照してください。

    ```bash
    export TOKEN="YOUR_API_KEY"
    export projectId="proj-xx"
    
    curl --request GET \
    --url "${BASE_URL}/v2/projects/${projectId}" \
    --header "Authorization: Bearer ${TOKEN}" \
    --header "Content-Type: application/json"
    ```

    以下は出力例です。

    ```json
    {
        "code": 0,
        "data": {
            "projectId": "proj-x",
            "projectName": "My Project",
            "instanceCount": 2,
            "createTime": "2023-08-16T07:34:06Z",
            "plan": "Enterprise"
        }
    }
    ```

## プロジェクトの名前を変更する{#rename-a-project}

プロジェクトの名前を変更するには、[組織の所有者](./organization-users)である必要があります。Webコンソールからプロジェクトの名前を変更できます。

<Supademo id="cmhiwa69y5zk2fatiw4ou24k6?utm_source=link" title=""  />

## プロジェクトを削除する{#delete-a-project}

プロジェクトを削除するには、[組織の所有者](./organization-users)である必要があります。

プロジェクトを削除する前に、プロジェクト内のすべての[クラスター](./manage-cluster#drop-cluster)と[ボリューム](./manage-volumes-via-console#delete-a-volume)を削除する必要があります。

プロジェクトが削除されると、関連するすべてのデータとリソースも元に戻せない形でクリーンアップされます。

<Admonition type="info" icon="📘" title="Notes">

<p>デフォルトのプロジェクトは削除できません。</p>

</Admonition>

Webコンソールからプロジェクトを削除できます。

<Supademo id="cmhiwf80b5zoufatic4p14w7m?utm_source=link" title=""  />

