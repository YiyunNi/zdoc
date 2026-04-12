---
title: "プロジェクトの管理 | Cloud"
slug: /manage-projects
sidebar_label: "プロジェクト"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、プロジェクトは組織内の論理的なコンテナとして機能し、クラスターと関連リソースをグループ化します。ビジネスのさまざまな側面に合わせて複数のプロジェクトを作成できます。たとえば、貴社がマルチメディア推奨サービスを提供している場合、動画推薦用のプロジェクトと音楽推薦用のプロジェクトをそれぞれ作成できます。 | Cloud"
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


import Supademo from '@site/src/components/Supademo';

# プロジェクトの管理

Zilliz Cloud では、プロジェクトは組織内の論理的なコンテナとして機能し、クラスターと関連リソースをグループ化します。ビジネスのさまざまな側面に合わせて複数のプロジェクトを作成できます。たとえば、会社がマルチメディア推奨サービスを提供している場合、動画推奨用のプロジェクトと音楽推奨用のプロジェクトをそれぞれ作成できます。

このガイドでは、プロジェクトを管理する手順について説明します。

## プロジェクトの作成\{#create-a-project}

各組織には、削除できない `Default Project` という名前のデフォルトの **Enterprise** プロジェクトが付属しています。ワークロードとビジネスニーズに基づいて、追加のプロジェクトを作成できます。プロジェクトを作成すると、自動的にそのプロジェクトの [プロジェクト管理者](./project-users) になります。

### 制限\{#limits}

- プロジェクトを作成するには、[組織オーナー](./organization-users) である必要があります。

- 各組織で作成できるプロジェクトの最大数は 100 です。

### 手順\{#procedures}

プロジェクトを作成する際は、プロジェクト名を指定し、ニーズに最も適したプロジェクトプランを選択する必要があります。プランによって利用可能な機能と課金が決定されます。価格設定、プランの違い、適切なプランの選択方法の詳細については、[詳細なプラン比較](./select-zilliz-cloud-service-plans) をご覧ください。

プロジェクトは、Zilliz Cloud のウェブコンソールまたは RESTful API を経由して作成できます。

- **ウェブコンソール経由**

    次のデモでは、Zilliz Cloud のウェブコンソールでプロジェクトを作成する方法を示します。

    <Supademo id="cmhivxhnz5zctfatifx1jw34l?utm_source=link" title=""  />

    ![create-project](https://zdoc-images.s3.us-west-2.amazonaws.com/create-project.png "create-project")

- **RESTful API 経由**

    次の例では、現在の組織内で `My Project` という名前の Standard プロジェクトを作成する方法を示します。詳細については、[プロジェクトの作成](/reference/restful/create-project-v2) をご覧ください。

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

## Upgrade a project\{#upgrade-a-project}

高度な機能を利用するには、既存のプロジェクトのプランをアップグレードできます。

プロジェクトをアップグレードすると、そのプロジェクト内のすべてのクラスターもアップグレードされます。

プロジェクトを **ビジネスクリティカル** または **BYOC** プランにアップグレードする必要がある場合は、[営業担当者にお問い合わせください](https://zilliz.com/contact-sales)。

- **ウェブコンソール経由**

    以下のデモでは、プロジェクトのプランを **Standard** から **Enterprise** にアップグレードする方法を示します。

    <Supademo id="cmhiw3gu85zhlfati4r154s2h?utm_source=link" title=""  />

- **RESTful API経由**

    以下のデモでは、プロジェクトのプランを Standard から Enterprise にアップグレードする方法を示します。詳細については、[Upgrade Project](/reference/restful/upgrade-project-v2) をご覧ください。

    ```bash
    export TOKEN="YOUR_API_KEY"
    export projectId="proj-xx"
    
    curl --request PATCH \
    --url "${BASE_URL}/v2/projects/${projectId}/plan" \
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

## View all projects\{#view-all-projects}

組織内の権限範囲にあるすべてのプロジェクトのリストを表示できます。

- **ウェブコンソール経由**

    ![view-projects-saas](https://zdoc-images.s3.us-west-2.amazonaws.com/view-projects-saas.png "view-projects-saas")

- **RESTful API経由**

    次の例は、現在の組織内のすべてのプロジェクトを一覧表示する方法を示しています。詳細については、[List プロジェクト](/reference/restful/list-projects-v2) をご覧ください。

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

プロジェクトの名前を変更するには、[組織オーナー](./organization-users) である必要があります。ウェブコンソールからプロジェクトの名前を変更できます。

<Supademo id="cmhiwa69y5zk2fatiw4ou24k6?utm_source=link" title=""  />

## プロジェクトを削除する\{#delete-a-project}

プロジェクトを削除するには、[組織オーナー](./organization-users) である必要があります。

プロジェクトを削除する前に、そのプロジェクト内のすべての [クラスター](./manage-cluster#drop-cluster) と [ボリューム](./manage-volumes-via-console#delete-a-volume) を削除する必要があります。

プロジェクトが削除されると、関連するすべてのデータとリソースも取り消し不可能にクリーンアップされます。

<Admonition type="info" icon="📘" title="Notes">

<p>デフォルトのプロジェクトは削除できません。</p>

</Admonition>

ウェブコンソールからプロジェクトを削除できます。

<Supademo id="cmhiwf80b5zoufatic4p14w7m?utm_source=link" title=""  />

## よくある質問\{#faq}

**プロジェクトプランをダウングレードできますか？**

プランの直接ダウングレードはサポートされていません。より低いプランに切り替えるには、希望するプランで新しいプロジェクトを作成し、データをそこに [移行](./offline-migration) してください。

