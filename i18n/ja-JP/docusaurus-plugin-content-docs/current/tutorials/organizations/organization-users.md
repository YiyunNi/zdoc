---
title: "組織ユーザーの管理 | Cloud"
slug: /organization-users
sidebar_label: "組織ユーザー"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、組織は通常、企業を表します。従業員を組織に招待し、職務に基づいてロールを割り当てることができます。これらのロールは、ユーザーが特定のリソースにアクセスできるかどうか、および実行可能な操作を決定します。たとえば、開発者は通常データへのアクセスが必要ですが、請求に関する権限は必要としません。 | Cloud"
type: origin
token: OzLjwMmWliJdEBkz0gPcVZrqnZb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - organizations
  - users

---

import Admonition from '@theme/Admonition';


# 組織ユーザーの管理

Zilliz Cloud において、組織は通常、企業を表します。従業員を組織に招待し、職務に基づいてロールを割り当てることができます。これらのロールは、ユーザーが特定のリソースにアクセスできるかどうか、および実行可能な操作を決定します。例えば、開発者は通常データへのアクセスが必要ですが、請求権限は必要としません。

本ガイドでは、組織ユーザーの招待、招待の取り消しまたは再送信、組織ユーザーのロールの変更、組織ユーザーの削除など、組織ユーザーを管理する方法について説明します。

## 組織へのユーザーの招待\{#invite-a-user-to-your-organization}

組織にユーザーを招待する際、組織内のリソースへのアクセスと特定の操作を実行するための権限を定義するロールを割り当てる必要があります。

ユーザーを招待するには、招待したいユーザーのメールアドレスを入力します。次に、新しい組織ユーザーに付与する組織ロールを選択します。

### 組織オーナー\{#organization-owner}

組織オーナー は、Zilliz Cloud における最上位のロールであり、組織とそのすべてのリソース（プロジェクト、クラスター、データベース、コレクション）を管理するための完全な権限を持ちます。このロールは、組織内の限られた数のユーザーのみに付与すべきです。

以下の表は、この組織ロールに対応する UI および API の権限を示しています。

<table>
   <tr>
     <th><p><strong>UI Privileges</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) Privileges</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) Privileges</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p>Manage all projects in the organization</p></li><li><p>Manage <a href="./payment-billing">payments & billing</a></p></li><li><p>Manage <a href="./manage-api-keys">API keys</a></p></li><li><p>Manage <a href="./organization-users">organization users</a></p></li><li><p>Manage <a href="./metrics-and-alerts">alerts</a></p></li><li><p>View <a href="./view-activities">activities</a></p></li><li><p>Manage <a href="./organization-settings">organization settings</a></p></li><li><p>Use <a href="./use-recycle-bin">recycle bin</a></p></li><li><p>Plus all the privileges of a <a href="./project-users#project-admin">プロジェクト管理者</a> and a <a href="./cluster-roles#built-in-cluster-roles">Cluster Admin</a> roles</p></li></ul></td>
     <td><p><a href="/reference/restful/control-plane-v2">All control plane operations</a></p></td>
     <td><p><a href="/reference/restful/data-plane-v2">All data plane operations</a></p></td>
   </tr>
</table>

### 組織の請求管理者\{#organization-billing-admin}

組織の請求管理者 ロールは、組織内の請求を管理する権限を持ちます。このロールは、組織内の他のデータに対する権限を持ちません。

以下の表は、この組織ロールに対応する UI および API の権限を示しています。

<table>
   <tr>
     <th><p><strong>UI Privileges</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) Privileges</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) Privileges</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p>Manage <a href="./payment-billing">payments & billing</a></p></li><li><p>View <a href="./manage-api-keys">API keys</a></p></li><li><p>Invite <a href="./organization-users">organization users</a></p></li><li><p>View <a href="./organization-settings">organization settings</a></p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/list-invoices-v2">List 請求書</a></p></li><li><p><a href="/reference/restful/describe-invoice-v2">Describe Invoice</a></p></li><li><p><a href="/reference/restful/query-daily-usage-v2">Query Daily Usage</a></p></li></ul></td>
     <td><p>The data plan privileges are determined by project and cluster roles. However, a 請求管理者 usually does not require data plane privileges.</p></td>
   </tr>
</table>

### Organization ロール\{#organization-role}

招待対象者用に組織ロールを作成できます。組織ロールとは、組織とそのリソースを表示する権限を持つロールです。このロールに対して、プロジェクトレベルおよびクラスターレベルの権限を編集できます。

![Cb5Yw6EWNhdqD5bjxTRcHHF1nAd](https://zdoc-images.s3.us-west-2.amazonaws.com/Cb5Yw6EWNhdqD5bjxTRcHHF1nAd.png)

#### プロジェクト権限のカスタマイズ\{#customize-project-privileges}

デフォルトでは、招待対象者に**Default Project**への**プロジェクト管理者**アクセスが付与されます。ただし、**Customize**を選択して、きめ細かい権限を付与することもできます。

![PXLywcZSyh9Vaib1wUFc0NminUd](https://zdoc-images.s3.us-west-2.amazonaws.com/PXLywcZSyh9Vaib1wUFc0NminUd.png)

- **Cluster Access**

    デフォルトでは、**Include all future clusters**オプションが有効になった状態で、**All Clusters**へのアクセスが付与されます。**読み書き**などのロールを割り当てて、これらのクラスター全体での招待ユーザーの権限を定義できます。招待が承認されると、ユーザーはプロジェクト内の現在および将来のすべてのクラスターに対して指定された権限を持ちます。

    アクセスを制限するには、ドロップダウンから特定のクラスターを選択します。また、**Include all future clusters**オプションを無効にして、 newly created clusters をアクセス範囲から除外することもできます。

    クラスターアクセスポリシーを追加するには、**+ Cluster Access**をクリックします。

- **ボリューム Access**

    デフォルトでは、**Include all future volumes**オプションが有効になった状態で、**All ボリュームs**へのアクセスが付与されます。**読み書き**などのロールを割り当てて、これらのボリューム全体での招待ユーザーの権限を定義できます。招待が承認されると、ユーザーはプロジェクト内の現在および将来のすべてのボリュームに対して指定された権限を持ちます。

    アクセスを制限するには、ドロップダウンから特定のボリュームを選択します。また、**Include all future volumes**オプションを無効にして、 newly created volumes をアクセス範囲から除外することもできます。

    クラスターアクセスポリシーを追加するには、**+ ボリューム Access**をクリックします。

以下の表は、このロールに対して組織レベルで招待者に付与される UI および API の権限を示しています。

<table>
   <tr>
     <th><p><strong>UI Privileges</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) Privileges</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) Privileges</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p>View <a href="./manage-api-keys">API keys</a></p></li><li><p>Invite <a href="./organization-users">organization users</a></p></li><li><p>View <a href="./organization-settings">organization settings</a></p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">All cloud meta operations</a></p></li><li><p>Part of cluster operations</p><ul><li><p><a href="/reference/restful/list-projects-v2">List プロジェクト</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">List Clusters</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">Describe Cluster</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">Query Cluster Metrics</a></p></li><li><p><a href="/docs/prometheus-monitoring">Export Metrics</a></p></li></ul></li><li><p>Part of import operations</p><ul><li><p><a href="/reference/restful/get-import-job-progress-v2">Get Import Job Progress</a></p></li><li><p><a href="/reference/restful/list-import-jobs-v2">List Import ジョブ </a></p></li></ul></li><li><p>Part of backup & restore operations</p><ul><li><p><a href="/reference/restful/list-backups-v2">List Backups</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">Describe Backup</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">Get Backup Policy</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">All cloud job operations</a></p></li></ul></td>
     <td><p>The data plan privileges are determined by <a href="./project-users#invite-a-user-to-a-project">project</a> and <a href="./cluster-roles">cluster</a> roles</p></td>
   </tr>
</table>

**組織メンバー**または**組織の請求管理者**である場合、招待対象者に付与できるロールは**組織メンバー**のみであることに注意してください。

招待対象者は、組織に参加するために 48 時間以内に承諾する必要があるメール招待を受け取ります。あるいは、ウェブコンソールから招待リンクをコピーし、招待者と共有することもできます。

<Admonition type="info" icon="📘" title="Notes">

<p>Each time, you can invite one or more users with the same role to the organization. Each organization can have up to 100 users.</p>

</Admonition>

## 招待の取り消しまたは再送信\{#revoke-or-resend-an-invitation}

ユーザーを組織に招待すると、Zilliz Cloud からそのユーザーに招待メールが送信されます。ユーザーが招待を承諾する前に、招待を取り消したり再送信したりできます。

![NDXHw6PVFhyxntbucxbc9SOFnLg](https://zdoc-images.s3.us-west-2.amazonaws.com/NDXHw6PVFhyxntbucxbc9SOFnLg.png)

## 組織ユーザーのロールの編集\{#edit-the-role-of-an-organization-user}

ユーザーが招待を承諾して組織に参加した後、必要に応じてそのロールを調整できます。

組織ユーザーのロールを編集するには、**組織オーナー**である必要があります。

![VGxOwarfShUDk1bIoEpc5wf3nFf](https://zdoc-images.s3.us-west-2.amazonaws.com/VGxOwarfShUDk1bIoEpc5wf3nFf.png)

## 組織ユーザーの削除\{#remove-an-organization-user}

ユーザーがもはや組織に所属していない場合、そのユーザーを削除できます。

組織ユーザーを削除するには、**組織オーナー**である必要があります。

![C6O0wzlfRhmxQwbt7yccX3VHn3g](https://zdoc-images.s3.us-west-2.amazonaws.com/C6O0wzlfRhmxQwbt7yccX3VHn3g.png)

## 組織からの脱退\{#leave-an-organization}

もはや組織に所属していない場合、組織から脱退するオプションがあります。

各組織には少なくとも 1 人の組織オーナーが必要です。組織の唯一のオーナーである場合、その組織から脱退することはできません。

<Admonition type="caution" icon="🚧" title="Warning">

<p>Once you leave an organization, you will no longer be able to access the organization and associated resources.</p>

</Admonition>

組織から脱退するには、以下のいずれかの方法があります。

- 組織一覧ページで組織から脱退する：

    ![Jdu2wpIYBhNZ5mbdMKOcBB6rnBg](https://zdoc-images.s3.us-west-2.amazonaws.com/Jdu2wpIYBhNZ5mbdMKOcBB6rnBg.png)

- 組織に入り、**組織メンバーs**ページで脱退する：

    ![YQYsw1BYahoLHabbmXdc4V15nA8](https://zdoc-images.s3.us-west-2.amazonaws.com/YQYsw1BYahoLHabbmXdc4V15nA8.png)

