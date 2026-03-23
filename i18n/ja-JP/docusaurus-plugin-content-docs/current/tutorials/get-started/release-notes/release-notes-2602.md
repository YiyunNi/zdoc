---
title: "2026年2月 リリースノート | Cloud"
slug: /release-notes-2602
sidebar_label: "2026年2月"
beta: FALSE
notebook: FALSE
description: "2026年2月のZilliz Cloudリリースノートです。"
type: origin
token: KtAgwMSa6iEoFkkEqzAcEJgRnjc
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - リリースノート

---

import Admonition from '@theme/Admonition';


import Grid from '@site/src/components/Grid';

# 2026年2月リリースノート

<Grid columnSize="2" widthRatios="20,80">

    <div>

        **2026-02-09**

    </div>

    <div>

        ## SSOの強制適用\{#sso-enforcement}

        組織のオーナーがすべてのメンバーにSSOを義務付ける機能を追加しました。一度強制適用されると、SSO以外のすべての認証方法は制限されます。この更新により、一元化されたID管理が可能になり、企業のセキュリティポリシーへの準拠が保証されます。

        詳細については、[組織でのSSOの強制適用](./enforce-sso-in-your-organization)を参照してください。

        ## クラスターアクセス制御\{#cluster-access-control}

        Zilliz Cloudはクラスターレベルのアクセス制御をサポートし、プロジェクト内で詳細な権限管理を可能にします。管理者は個々のクラスターとボリュームに異なるロールを割り当てることができ、プロジェクトを分割することなく厳格なリソース分離を強制できます。

        - **クラスターごとのロール割り当て:** 同じプロジェクト内の個々のクラスターとボリュームに独立したロール（ReadOnly / ReadWrite）を付与し、環境やワークロード間で職務をきめ細かく分離できます。

        - **厳格なアクセス強制:** 許可されていないリソースへのAPIリクエストは拒否され、制限されたリソースはコンソールから非表示になります。すべてのアクセスは、ユーザーに付与された権限に厳密にスコープされます。

        - **シームレスな移行:** 既存のユーザーは「すべてのリソース」アクセスで自動的に移行され、現在のプロジェクトロールが保持されます。手動での操作は不要です。

        詳細については、[組織ユーザーの管理](./organization-users#organization-role)および[プロジェクトユーザーの管理](./project-users#project-access)を参照してください。

    </div>

</Grid>

<Grid columnSize="2" widthRatios="20,80">

    <div>

        **2026-02-04**

    </div>

    <div>

        ## 新しいリージョン: 🇮🇪 AWS アイルランド\{#new-region-aws-ireland}

    </div>

</Grid>

