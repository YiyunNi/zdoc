---
title: "アクセス制御について | Cloud"
slug: /access-control-overview
sidebar_label: "アクセス制御について"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、Zilliz Cloud内のリソースへのアクセスをきめ細かく制御するために、ロールベースアクセス制御（RBAC）を実装しています。RBAC（Role-Based Access Control）は、ユーザーに直接ではなくロールに権限を付与するセキュリティ対策です。リソースに対する特定の権限を含むこれらのロールは、ユーザーに付与され、ユーザーアクセス制御の効率的な管理を可能にします。 | Cloud"
type: origin
token: UDjcwWISuixYjqkQy3GcmBpsnmV
sidebar_position: 1
keywords: 
  - zilliz
  - ベクターデータベース
  - cloud
  - クラスター
  - アクセス制御
  - rbac
  - milvus benchmark
  - managed milvus
  - Serverless vector database
  - milvus open source

---

import Admonition from '@theme/Admonition';


# アクセス制御の説明

Zilliz Cloudは、Zilliz Cloud内のリソースへのアクセスを細かく制御するために、ロールベースアクセス制御（RBAC）を実装しています。RBAC（ロールベースアクセス制御）は、ユーザーに直接ではなくロールに権限を付与するセキュリティ対策です。特定のリソースに対する特定の権限を含むこれらのロールは、その後ユーザーに付与され、ユーザーアクセス制御の効率的な管理を可能にします。

![L1WGwjF2NhxLRXbcyl6cSroNnoc](https://zdoc-images.s3.us-west-2.amazonaws.com/L1WGwjF2NhxLRXbcyl6cSroNnoc.png)

## Zilliz Cloud RBACアーキテクチャ{#zilliz-cloud-rbac-architecture}

![WVIgwWtMYhhTBIbgAdAcegDRnle](https://zdoc-images.s3.us-west-2.amazonaws.com/WVIgwWtMYhhTBIbgAdAcegDRnle.png)

Zilliz Cloudは、リソースを2つのプレーンに整理し、両方でRBACを実装しています。

- **コントロールプレーン:** このプレーンには、組織、プロジェクト、クラスター管理が含まれます。[アカウントユーザー](./email-accounts)には特定の組織およびプロジェクトロールが付与され、コントロールプレーン上のリソースと対話する際に[APIキー](./manage-api-keys)を介して認証されます。

- **データプレーン:** このプレーンには、クラスター、データベース、コレクションが含まれ、データアクセス管理に焦点を当てています。[クラスターユーザー](./cluster-users)には適切なクラスターロールが付与され、データプレーンリソースと対話する際に[APIキー](./manage-api-keys)または[ユーザー名とパスワードのペア](./cluster-credentials)を使用して認証されます。

通常、各アカウントユーザーはクラスターユーザーに対応します。ただし、すべてのユーザーが両方のプレーンへのアクセスを必要とするわけではありません。場合によっては、請求管理者などのコントロールプレーンアカウントユーザーは、請求管理目的でコントロールプレーンへのアクセスのみを必要とし、データプレーンへのアクセスは必要ありません。逆に、一時的なクラスターユーザーを作成し、カスタマイズされたAPIキーを介してデータプレーンリソースへのアクセスを許可することで、登録されたアカウントなしでデータアクセスを可能にすることができます。カスタマイズされたAPIキーの管理の詳細については、[APIキー](./manage-api-keys)を参照してください。

## ロールと権限{#roles-and-privileges}

アカウントユーザーには組織ロールとプロジェクトロールが付与され、クラスターユーザーにはクラスター、データベース、コレクションへのアクセスを制御するクラスターロールが付与されます。次の図は、Zilliz Cloudにおけるロールの階層を示しています。

![TnkCwHx6jhk7UmbvYT7cVGlIn7b](https://zdoc-images.s3.us-west-2.amazonaws.com/TnkCwHx6jhk7UmbvYT7cVGlIn7b.png)

- **組織レベル**

    - 組織所有者ロールは、すべてのプロジェクトとクラスターにわたる包括的な権限を含みます。

    すべての組織ロールの詳細については、[組織ロール](./organization-users#organization-roles)を参照してください。

- **プロジェクトレベル**

    - プロジェクト管理者ロールは、特定のプロジェクトのすべての権限と、すべてのクラスターにわたる権限を含みます。

    - プロジェクト読み書きロールは、プロジェクトを表示し、そのリソースを管理する権限を持ちます。

    - プロジェクト読み取り専用ロールは、プロジェクトとそのリソースを表示する権限を持ちます。

    プロジェクトロールの詳細については、[プロジェクトロール](./project-users#project-roles)を参照してください。

- **クラスターレベル**

    - クラスター管理者ロールは、特定のクラスターのすべての権限を含みます。

    - クラスター読み書きロールは、クラスターを表示し、そのすべてのリソースを管理する権限を持ちます。

    - クラスター読み取り専用ロールは、クラスターとそのリソースを表示する権限を持ちます。

    - さらに、このレベルで[カスタムロール](./cluster-roles#custom-cluster-roles)を作成して、データベースやコレクションなどのクラスターリソースに対する[権限](./cluster-privileges)を正確に管理できます。

    クラスターロールの詳細については、[クラスターロールの管理（コンソール）](./cluster-roles)を参照してください。

## Zilliz CloudでのRBACの実装{#implement-rbac-in-zilliz-cloud}

次の図は、Zilliz CloudでRBACを実装するための完全なワークフローを示しています。

![B8sbwgywghYn1tbMTOwcjg65nne](https://zdoc-images.s3.us-west-2.amazonaws.com/B8sbwgywghYn1tbMTOwcjg65nne.png)

1. **ユーザーの作成:** Zilliz Cloudのデフォルトユーザー`db_admin`に加えて、[ウェブコンソール](./cluster-users)または[SDK](./cluster-users-sdk)を使用して、新しいユーザーを作成し、データセキュリティを保護するためのパスワードを設定できます。

1. **ロールの作成:** [ウェブコンソール](./cluster-roles)または[SDK](./cluster-roles-sdk)を使用して、カスタマイズされたロールを作成できます。ロールの特定の機能は、その権限によって決定されます。

1. **（オプション）権限グループの作成と権限グループへの権限の追加:** 複数の[権限](./cluster-privileges)を1つの権限グループに結合して、ロールに権限を付与するプロセスを効率化します。Zilliz Cloudが提供する組み込みの権限グループに加えて、[SDK](./cluster-privileges#custom-privilege-groups)を使用して独自のカスタマイズされた権限グループを作成することもできます。

1. **ロールへの権限または権限グループの付与:** 権限または権限グループをロールに付与することで、ロールの機能を定義します。現在、[ウェブコンソール](./cluster-roles#create-a-custom-cluster-role)では組み込みの権限グループのみをロールに付与できます。特定の権限またはカスタマイズされた権限グループをロールに付与するには、[サポートチケットを作成](http://support.zilliz.com)し、代わりに[SDK](./cluster-roles-sdk#grant-a-privilege-or-a-privilege-group-to-a-role)を使用してください。

1. **ユーザーへのロールの付与:** 特定の権限を持つロールをユーザーに付与することで、ユーザーはロールの権限を持つことができます。1つのロールを複数のユーザーに付与できます。この手順は、[ウェブコンソール](./cluster-users#edit-the-role-of-a-cluster-user)または[SDK](./cluster-users-sdk#grant-a-role-to-a-user)を使用して完了できます。

