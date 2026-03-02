---
title: "Terraform Provider | BYOC"
slug: /terraform-provider
sidebar_label: "Terraform Provider"
beta: FALSE
notebook: FALSE
description: "Zillizは、フルマネージドのMilvusサービスを提供し、Zillizが提供するクラウドインフラストラクチャとお客様自身のインフラストラクチャの両方を含む、複雑なインフラストラクチャの構築と保守の必要性を排除し、セキュリティを考慮したベクトル検索アプリケーションのデプロイとスケーリングを効率化します。 | BYOC"
type: origin
token: BX6iwjUzLi7udfksJoxc7jK1nsW
sidebar_position: 14
keywords: 
  - Zilliz
  - ベクトルデータベース
  - クラウド
  - terraform provider
  - terraform
  - milvus benchmark
  - マネージド Milvus
  - サーバーレス ベクトルデータベース
  - milvus オープンソース

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Terraform プロバイダー

Zilliz は、完全に管理された Milvus サービスを提供し、セキュリティを考慮したベクトル検索アプリケーションのデプロイとスケーリングを合理化し、Zilliz が提供するクラウドインフラストラクチャとお客様自身のインフラストラクチャの両方を含む、複雑なインフラストラクチャの構築と維持の必要性を排除します。

[Zilliz Cloud Terraform プロバイダー](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest)は、Zilliz Cloud リソースを動的に構築、変更、バージョン管理できるオープンソースの Infrastructure as Code (IaC) ソリューションです。使用する前に、適切な権限を持つ Zilliz Cloud API キーなどの適切な認証情報でプロバイダーを設定する必要があります。

## 認証{#authentication}

Terraform を使用してリソースのデプロイを開始する前に、Terraform を Zilliz Cloud プラットフォームで認証する必要があります。この Terraform プロバイダーでの操作を行う前に、適切な権限を持つ Zilliz Cloud API キーを使用して認証を完了する必要があります。Zilliz Cloud API キーを作成するには、次の手順に従います。

<Procedures>

1. [Zilliz Cloud コンソール](https://cloud.zilliz.com/login)にサインインします。

1. トップナビゲーションバーの右側にある **API Keys** をクリックします。

1. API Keys ページの右上にある **+ API Key** をクリックします。

1. 表示される **Create API Key** ダイアログボックスで、API キー名を入力し、アクセス権限を設定して、**Create** をクリックして API キーを生成します。

</Procedures>

API キーの管理の詳細については、[API キー](/docs/byoc/manage-api-keys)を参照してください。

## 管理可能なリソース{#manageable-resources}

現在、このプロバイダーを使用して次の種類のリソースを管理できます。

### クラスター{#clusters}

[Zilliz Cloud クラスター](/docs/manage-cluster)は、Zilliz Cloud 上で動作する Milvus インスタンスです。Zilliz Cloud は、クラスターを **Free**、**Serverless**、**Dedicated (Standard)**、**Dedicated (Enterprise)**、および **Bring Your Own Cloud (BYOC)** などのさまざまなプランに分類しています。これらのプランの詳細については、[詳細なプラン比較](/docs/select-zilliz-cloud-service-plans)を参照してください。

Zilliz Cloud Terraform プロバイダーを使用して、特定のプランのクラスターを作成および管理できます。詳細については、次のチュートリアルを参照してください。

- [Free クラスターの作成](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-free-cluster)

- [Serverless クラスターの作成](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-serverless-cluster)

- [Dedicated クラスターの作成](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-standard-cluster)

- [クラスターのスケーリング](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/scale-cluster)

- [既存のクラスターを Terraform 管理にインポートする](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/import-cluster)

### データベース{#database}

Zilliz Cloud では、[データベース](/docs/database)はデータを整理および管理するための論理単位として機能します。これは専用クラスターでのみ利用可能です。クラスターの作成時に、デフォルトのデータベースが作成されます。Zilliz Cloud Terraform プロバイダーを使用してデータベースを管理する方法の詳細については、以下のリソースとデータソースを参照してください。

- [データベース (リソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/database)

- [データベース (データソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/databases)

### コレクションとエイリアス{#collection-and-aliases}

[コレクション](/docs/manage-collections)は、固定列と可変行を持つ2次元テーブルです。各列はフィールドを表し、各行はエンティティを表します。Zilliz Cloud Terraform プロバイダーを使用してコレクションを管理する方法の詳細については、以下のリソースとデータソースを参照してください。

- [エイリアス (リソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/alias)

- [コレクション (リソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/collection)

- [エイリアス (データソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/aliases)

- [コレクション (データソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/collections)

### パーティション{#partition}

パーティションはコレクションのサブセットです。各パーティションは親コレクションと同じデータ構造を共有しますが、コレクション内のデータのサブセットのみを含みます。このページでは、パーティションの管理方法について説明します。Zilliz Cloud Terraform プロバイダーを使用してパーティションを管理する方法の詳細については、以下のリソースとデータソースを参照してください。

- [パーティション (リソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/partitions)

- [パーティション (データソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/partitions)

### インデックス{#index}

Zilliz Cloud は、効率的な類似性検索を可能にするために [AUTOINDEX](/docs/autoindex-explained) を採用しています。また、ベクトル埋め込み間の距離を測定するために、**コサイン類似度** (COSINE)、**ユークリッド距離** (L2)、**内積** (IP)、**JACCARD**、および **HAMMING** の[メトリックタイプ](/docs/search-metrics-explained)も提供しています。AUTOINDEX は、メタデータフィルタリングを高速化するためにスカラーフィールドにも適用されます。Zilliz Cloud Terraform プロバイダーを使用してインデックスを管理する方法の詳細については、以下のリソースとデータソースを参照してください。

- [インデックス (リソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/index)

- [インデックス (データソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/indexes)

### ユーザーとロール{#users-and-roles}

Zilliz Cloud では、クラスターユーザーを作成し、クラスターロールを割り当てて権限を定義することで、データセキュリティを実現できます。ユーザーは、適切に設定された認証情報を持つデータベースユーザーを表し、一連のロールが割り当てられます。ロールは、一連の権限をカプセル化し、ユーザーに割り当てることができるエンティティです。このセクションのリソースとデータソースを使用して、ロールベースのアクセス制御 (RBAC) を実装できます。詳細については、以下のリソースとデータソースを参照してください。

- [ユーザー (リソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/user)

- [ユーザー (データソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/users)

- [ロール (リソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/resources/user_role)

- [ロール (データソース)](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/data-sources/roles)

### BYOC プロジェクト{#byoc-projects}

Zilliz Cloud は、組織が Zilliz Cloud のインフラストラクチャに依存するのではなく、独自のクラウドアカウントでアプリケーションとデータをホストできる BYOC ソリューションも提供しています。BYOC ソリューションは、クロスアカウント権限を通じて Zilliz Cloud がお客様のインフラストラクチャリソースを管理することを許可するかどうかに応じて、BYOC または BYOC-I モードでデプロイできます。詳細については、[BYOC の概要](/docs/byoc/byoc-intro)を参照してください。

Zilliz Cloud Terraform プロバイダーを使用して、BYOC または BYOC-I プロジェクトを作成し、VPC 内に関連するデータプレーンリソースをデプロイできます。詳細については、次のチュートリアルを参照してください。

- [Zilliz Cloud コンソールで BYOC プロジェクトを作成する](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-byoc-project-on-console)

- [Terraform を使用して BYOC プロジェクトを作成する](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-byoc-project)

- [Terraform を使用して BYOC-I プロジェクトを作成する](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/create-a-byoc-i-project)

- [BYOC 環境で Milvus クラスターを管理する](https://registry.terraform.io/providers/zilliztech/zillizcloud/latest/docs/guides/managing-milvus-in-byoc)

