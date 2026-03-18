---
title: "プロジェクトの管理 | BYOC"
slug: /manage-projects
sidebar_label: "プロジェクト"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、プロジェクトは組織内の論理的なコンテナとして機能し、クラスターと関連リソースをグループ化します。ビジネスのさまざまな側面に合わせて複数のプロジェクトを作成できます。たとえば、会社がマルチメディア推奨サービスを提供している場合、動画推薦用のプロジェクトと音楽推薦用のプロジェクトをそれぞれ作成できます。| BYOC"
type: origin
token: NXypwJ2ySiv7RAkyKb5cZ9SKnvf
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - プロジェクト

---

import Admonition from '@theme/Admonition';


# プロジェクトの管理

Zilliz Cloud では、プロジェクトは組織内の論理的なコンテナとして機能し、クラスターと関連リソースをグループ化します。ビジネスのさまざまな側面に合わせて複数のプロジェクトを作成できます。たとえば、会社でマルチメディア推薦サービスを提供している場合、動画推薦用のプロジェクトと音楽推薦用のプロジェクトをそれぞれ作成できます。

このガイドでは、プロジェクトを管理する手順について説明します。

## すべてのプロジェクトを表示する\{#view-all-projects}

組織内において、自分の権限範囲にあるすべてのプロジェクトの一覧を表示できます。

- **ウェブコンソール経由**

    ![view-projects-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/view-projects-byoc.png "view-projects-byoc")

- **RESTful API 経由**

    次の例は、現在の組織内のすべてのプロジェクトを一覧表示する方法を示しています。詳細については、[プロジェクトの一覧表示](/reference/restful/list-projects-v2) をご覧ください。

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

## プロジェクトの詳細を表示\{#view-project-details}

特定のプロジェクトの詳細を確認することもできます。

- **ウェブコンソール経由**

    **プロジェクト**ページで、プロジェクト名、プラン、作成日時、およびプロジェクト内のクラスター数を確認できます。さらに、特定のプロジェクトをクリックして、そのクラスターを表示できます。

    ![NoSTbfMVjoPp99x5cjcc0cwWnbd](https://zdoc-images.s3.us-west-2.amazonaws.com/nostbfmvjopp99x5cjcc0cwwnbd.png "NoSTbfMVjoPp99x5cjcc0cwWnbd")

- **RESTful API 経由**

    次の例では、プロジェクト `proj-xxxxxxxxxxxxxxx` について説明しています。詳細については、[プロジェクトの説明](/reference/restful/describe-project-v2) をご覧ください。

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

## プロジェクトの名前を変更する\{#rename-a-project}

プロジェクトの名前を変更するには、[組織オーナー](./organization-users) である必要があります。Web コンソールからプロジェクトの名前を変更できます。

![rename-project-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/rename-project-byoc.png "rename-project-byoc")

## プロジェクトを削除する\{#delete-a-project}

プロジェクトを削除するには、[組織オーナー](./organization-users) である必要があります。

プロジェクトを削除する前に、そのプロジェクト内のすべての [クラスター](./manage-cluster#drop-cluster) をドロップする必要があります。

プロジェクトが削除されると、関連するすべてのデータとリソースも不可逆的にクリーンアップされます。

<Admonition type="info" icon="📘" title="Notes">

<p>デフォルトのプロジェクトは削除できません。</p>

</Admonition>

Web コンソールからプロジェクトを削除できます。

![delete-project-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/delete-project-byoc.png "delete-project-byoc")

