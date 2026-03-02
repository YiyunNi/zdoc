---
title: "プロジェクトの管理 | BYOC"
slug: /manage-projects
sidebar_label: "プロジェクト"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでは、プロジェクトは組織内の論理的なコンテナとして機能し、クラスターと関連リソースをグループ化します。ビジネスのさまざまな側面に合わせた複数のプロジェクトを作成できます。たとえば、会社がマルチメディア推薦サービスを提供している場合、ビデオ推薦用に1つ、音楽推薦用に別のプロジェクトを作成できます。 | BYOC"
type: origin
token: NXypwJ2ySiv7RAkyKb5cZ9SKnvf
sidebar_position: 1
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - プロジェクト
  - セマンティック検索
  - 異常検知
  - sentence transformers
  - 推薦システム

---

import Admonition from '@theme/Admonition';


# プロジェクトの管理

Zilliz Cloudでは、プロジェクトは組織内の論理コンテナとして機能し、クラスターと関連リソースをグループ化します。ビジネスのさまざまな側面に合わせた複数のプロジェクトを作成できます。たとえば、会社がマルチメディア推薦サービスを提供している場合、ビデオ推薦用に1つのプロジェクトを、音楽推薦用に別のプロジェクトを作成できます。

このガイドでは、プロジェクトを管理する手順を説明します。

## すべてのプロジェクトを表示する{#view-all-projects}

組織内で、アクセス権のあるすべてのプロジェクトのリストを表示できます。

- **ウェブコンソール経由**

    ![view-projects-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/view-projects-byoc.png "view-projects-byoc")

- **RESTful API経由**

    以下の例は、現在の組織内のすべてのプロジェクトをリストする方法を示しています。詳細については、[List Projects](/reference/restful/list-projects-v2)を参照してください。

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

    以下は出力例です

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

![rename-project-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/rename-project-byoc.png "rename-project-byoc")

## プロジェクトを削除する{#delete-a-project}

プロジェクトを削除するには、[組織の所有者](./organization-users)である必要があります。

プロジェクトを削除する前に、プロジェクト内のすべての[クラスター](./manage-cluster#drop-cluster)を削除する必要があります。

プロジェクトが削除されると、関連するすべてのデータとリソースも元に戻せない形でクリーンアップされます。

<Admonition type="info" icon="📘" title="Notes">

<p>デフォルトのプロジェクトは削除できません。</p>

</Admonition>

Webコンソールからプロジェクトを削除できます。

![delete-project-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/delete-project-byoc.png "delete-project-byoc")

