---
title: "Terraform Provider | BYOC"
slug: /terraform-provider
sidebar_key: terraform-provider
sidebar_label: "Terraform Provider"
beta: FALSE
notebook: FALSE
description: "Zilliz は、セキュリティを考慮したベクトル検索アプリケーションのデプロイとスケーリングを効率化し、Zilliz が提供するクラウドインフラストラクチャとお客様のインフラストラクチャの両方を含む複雑なインフラストラクチャの構築・維持の必要性を排除する、フルマネージドの Milvus サービスを提供しています。 | BYOC"
type: origin
token: BX6iwjUzLi7udfksJoxc7jK1nsW
sidebar_position: 18
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - terraform provider
  - terraform

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Terraform Provider

Zillizは、フルマネージドのMilvusサービスを提供しており、セキュリティを考慮したベクトル検索アプリケーションのデプロイとスケーリングを効率化し、Zilliz Cloudが提供するクラウドインフラストラクチャとお客様自身のインフラストラクチャの両方を含む、複雑なインフラストラクチャの構築とメンテナンスの必要性を排除します。

[Zilliz Cloud Terraform Provider](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest) は、オープンソースのInfrastructure as Code (IaC) ソリューションであり、Zilliz Cloud リソースを動的に構築、変更、バージョン管理できるようにします。使用前に、適切な権限を持つZilliz Cloud APIキーなどの適切な認証情報を使用してプロバイダーを構成する必要があります。

## Authentication\{#authentication}

Terraformを使用したリソースデプロイを開始する前に、TerraformをZilliz Cloudプラットフォームで認証する必要があります。このTerraformプロバイダーでクラウドプレーン操作を行う前に、適切な権限を持つZilliz Cloud APIキーを使用して認証を完了する必要があります。Zilliz Cloud APIキーを作成するには、以下の手順に従ってください：

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にサインインします。

1. 上部ナビゲーションバーの右側で、**APIキーs** をクリックします。

1. APIキーsページの右上隅で、**+ APIキー** をクリックします。

1. 表示される **Create APIキー** ダイアログボックスで、APIキー名を入力し、アクセス権限を構成して、**Create** をクリックしてAPIキーを生成します。

</Procedures>

APIキーの管理について詳しくは、[APIキーs](/docs/byoc/manage-api-keys) を参照してください。

データプレーン操作（コレクションの操作、検索、クエリなど）を実行するには、ターゲットクラスターのコロン区切りのユーザー名とパスワードを `username:password` の形式でクラスターアクセストークンとして使用する必要があります。

以下に示すリソースのうち、クラスター、ユーザーとロール、およびBYOCプロジェクトのリソースにはZilliz Cloud APIを使用してください。データベース、コレクションとエイリアス、パーティション、およびインデックスのリソースにはクラスターアクセストークンを使用してください。

## Manageable リソース\{#manageable-resources}

現在、このプロバイダーを使用して以下のタイプのリソースを管理できます：

### Clusters\{#clusters}

[Zilliz Cloud クラスター](/docs/manage-cluster) は、Zilliz Cloud上で動作するMilvusインスタンスです。Zilliz Cloudはクラスターをさまざまなオファリングに分類しており、**Free**、**Serverless**、**Dedicated (Standard)**、**Dedicated (Enterprise)**、および **Bring Your Own Cloud (BYOC)** が含まれます。これらのオファリングの詳細については、[Detailed Plan Comparison](/docs/select-zilliz-cloud-service-plans) を参照してください。

Zilliz Cloud Terraform Providerを使用して、特定のオファリングのクラスターを作成および管理できます。詳細については、以下のチュートリアルを参照してください：

<Admonition type="info" icon="📘" title="Notes">

Terraform ProviderをBYOCで使用する場合、専用クラスターとBYOCクラスタータイプのみがサポートされます。BYOCプロジェクトではFreeおよびServerlessクラスターの作成は利用できません。

</Admonition>

- [Create a Free Cluster](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-free-cluster)

- [Create a Serverless Cluster](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-serverless-cluster)

- [Create a Dedicated Cluster](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-standard-cluster)

- [Scale Cluster](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/scale-cluster)

- [Import Existing Clusters into Terraform Management](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/import-cluster)

### データベース\{#database}

Zilliz Cloudでは、[データベース](/docs/database) はデータを整理および管理するための論理単位として機能します。これは専用クラスターでのみ利用可能です。クラスターの作成時に、デフォルトのデータベースが作成されます。Zilliz Cloud Terraform Providerを使用してデータベースを管理する方法の詳細については、以下のリソースとデータソースを参照してください：

- [データベース (Resource)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/database)

- [データベースs (データ Source)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/databases)

### Collection & エイリアスes\{#collection-and-aliases}

[コレクション](/docs/manage-collections) は、固定された列と可変の行を持つ2次元テーブルです。各列はフィールドを表し、各行はエンティティを表します。Zilliz Cloud Terraform Providerを使用してコレクションを管理する方法の詳細については、以下のリソースとデータソースを参照してください：

- [エイリアスes (Resource)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/alias)

- [Collection (Resource)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/collection)

- [エイリアスes (データ Source)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/aliases)

- [Collections (データ Source)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/collections)

### Partition\{#partition}

パーティションはコレクションのサブセットです。各パーティションは親コレクションと同じデータ構造を共有しますが、コレクション内のデータの一部のみを含みます。このページでは、パーティションの管理方法を理解するのに役立ちます。Zilliz Cloud Terraform Providerを使用してパーティションを管理する方法の詳細については、以下のリソースとデータソースを参照してください：

- [パーティション (Resource)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/partitions)

- [パーティション (データ Source)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/partitions)

### Index\{#index}

Zilliz Cloudは、効率的な類似性検索を可能にするために [AUTOINDEX](/docs/autoindex-explained) を採用しています。また、ベクトル埋め込み間の距離を測定するために、以下の [メトリックタイプ](/docs/search-metrics-explained) を提供しています：**コサイン類似度** (COSINE)、**ユークリッド距離** (L2)、**内積** (IP)、**JACCARD**、および **HAMMING**。AUTOINDEXは、メタデータフィルタリングを高速化するためにスカラーフィールドにも適用されます。Zilliz Cloud Terraform Providerを使用してインデックスを管理する方法の詳細については、以下のリソースとデータソースを参照してください：

- [Index (Resource)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/index)

- [Indexes (データ Source)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/indexes)

### Users & ロールs\{#users-and-roles}

Zilliz Cloudでは、クラスターユーザーを作成し、クラスターロールを割り当てて権限を定義することで、データセキュリティを実現できます。ユーザーは、適切に構成された認証情報を持つデータベースユーザーを表し、ロールのセットが割り当てられます。一方、ロールは権限のセットをカプセル化し、ユーザーに割り当てることができるエンティティです。このセクションのリソースとデータソースを使用して、ロールベースのアクセス制御（RBAC）を実装できます。詳細については、以下のリソースとデータソースを参照してください：

- [User (Resource)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/user)

- [Users (データ Source)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/users)

- [ロール (Resource)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/user_role)

- [ロールs (データ Source)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/roles)

### BYOC projects\{#byoc-projects}

Zilliz Cloudはまた、組織がZilliz Cloudのインフラストラクチャに依存するのではなく、独自のクラウドアカウントでアプリケーションとデータをホストできるようにするBYOCソリューションも提供しています。BYOCソリューションは、クロスアカウント権限を通じてZilliz Cloudにインフラストラクチャリソースの管理を委任するかどうかに応じて、BYOCモードまたはBYOC-Iモードのいずれかでデプロイできます。詳細については、[BYOC Overview](/docs/byoc/byoc-intro) を参照してください。

Zilliz Cloud Terraform Providerを使用して、BYOCまたはBYOC-Iプロジェクトを作成し、VPC内に関連するデータプレーンリソースをデプロイできます。詳細については、以下のチュートリアルを参照してください：

- [Create a BYOC Project on Zilliz Cloud Console](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-byoc-project-on-console)

- [Create a BYOC Project using Terraform](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-byoc-project)

- [Create a BYOC-I Project using Terraform](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-byoc-i-project)

- [Manage Milvus Cluster in BYOC Environments](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/managing-milvus-in-byoc)

