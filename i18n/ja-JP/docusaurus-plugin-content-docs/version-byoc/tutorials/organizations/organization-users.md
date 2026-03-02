---
title: "組織ユーザーの管理 | BYOC"
slug: /organization-users
sidebar_label: "組織ユーザー"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでは、組織は通常、会社を表します。従業員を組織に招待し、職務に基づいて役割を割り当てることができます。これらの役割は、ユーザーが特定の資源にアクセスできるかどうか、および実行できる操作を決定します。たとえば、開発者は通常データへのアクセスを必要としますが、請求権限は必要ありません。 | BYOC"
type: origin
token: OzLjwMmWliJdEBkz0gPcVZrqnZb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 組織
  - ユーザー
  - milvusの仕組み
  - Zilliz vector database
  - Zilliz database
  - 非構造化データ

---

import Admonition from '@theme/Admonition';


# 組織ユーザーの管理

Zilliz Cloudでは、組織は通常、会社を表します。従業員を組織に招待し、職務に基づいて役割を割り当てることができます。これらの役割は、ユーザーがアクセスできる特定のリソースと実行できる操作を決定します。たとえば、開発者は通常データへのアクセスを必要としますが、請求権限は必要ありません。

このガイドでは、組織ユーザーの管理方法について説明します。これには、ユーザーを組織に招待する方法、招待を取り消したり再送信したりする方法、組織ユーザーの役割を変更する方法、または組織ユーザーを削除する方法が含まれます。

## 組織にユーザーを招待する{#invite-a-user-to-your-organization}

ユーザーを組織に招待する際には、その組織内のリソースへのアクセスと特定の操作を実行する権限を定義する役割をユーザーに付与する必要があります。

ユーザーを招待するには、招待したいユーザーのメールアドレスを入力します。次に、新しい組織ユーザーに付与したい組織の役割を選択します。

### 組織の役割{#organization-roles}

Zilliz Cloudは3つの組織の役割を提供します。これらの役割は変更または削除できません。

- **Organization Owner**: Organization Ownerは、Zilliz Cloudにおける最上位の役割であり、組織とそのすべてのリソース（プロジェクト、クラスター、データベース、コレクション）を管理するための完全な権限を持っています。この役割は、組織内の限られた数のユーザーにのみ付与されるべきです。

    以下の表は、この組織の役割に対応するUIおよびAPIの権限を示しています。

    <table>
       <tr>
         <th><p><strong>UI権限</strong></p></th>
         <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
         <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
       </tr>
       <tr>
         <td><ul><li><p>組織内のすべてのプロジェクトを管理する</p></li><li><p><a href="./manage-api-keys">APIキー</a>を管理する</p></li><li><p><a href="./organization-users">組織ユーザー</a>を管理する</p></li><li><p><a href="./metrics-and-alerts">アラート</a>を管理する</p></li><li><p><a href="./view-activities">アクティビティ</a>を表示する</p></li><li><p><a href="./organization-settings">組織設定</a>を管理する</p></li><li><p><a href="./use-recycle-bin">ごみ箱</a>を使用する</p></li><li><p><a href="./project-users#project-roles">Project Admin</a>および<a href="./cluster-roles#built-in-cluster-roles">Cluster Admin</a>のすべての権限を含む</p></li></ul></td>
         <td><p><a href="/reference/restful/control-plane-v2">すべてのコントロールプレーン操作</a></p></td>
         <td><p><a href="/reference/restful/data-plane-v2">すべてのデータプレーン操作</a></p></td>
       </tr>
    </table>

- **Organization Billing Admin**: Organization Billing Adminは、組織の請求を管理する権限を持つ役割です。この役割は、組織内の他のデータに対する権限を持ちません。

    以下の表は、この組織の役割に対応するUIおよびAPIの権限を示しています。

    <table>
       <tr>
         <th><p><strong>UI権限</strong></p></th>
         <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
         <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
       </tr>
       <tr>
         <td><ul><li><p><a href="./manage-api-keys">APIキー</a>を表示する</p></li><li><p><a href="./organization-users">組織ユーザー</a>を招待する</p></li><li><p><a href="./organization-settings">組織設定</a>を表示する</p></li></ul></td>
         <td><ul><li><a href="/reference/restful/query-daily-usage-v2">日次使用量を照会する</a></li></ul></td>
         <td><p>データプランの権限はプロジェクトとクラスターの役割によって決定されます。ただし、Billing Adminは通常、データプレーンの権限を必要としません。</p></td>
       </tr>
    </table>

- **Organization Member**: Organization Memberは、組織とそのリソースを表示する権限を持つ役割です。Organization Memberのプロジェクトおよびクラスターレベルの権限は、このユーザーのプロジェクトおよびクラスターの役割に依存します。

    以下の表は、この組織の役割に対応するUIおよびAPIの権限を示しています。

    <table>
       <tr>
         <th><p><strong>UI権限</strong></p></th>
         <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
         <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
       </tr>
       <tr>
         <td><ul><li><p><a href="./manage-api-keys">APIキー</a>を表示する</p></li><li><p><a href="./organization-users">組織ユーザー</a>を招待する</p></li><li><p><a href="./organization-settings">組織設定</a>を表示する</p></li></ul></td>
         <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">プロジェクトをリストする</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">クラスターをリストする</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">クラスターを記述する</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">クラスターメトリクスを照会する</a></p></li><li><p><a href="/docs/prometheus-monitoring">メトリクスをエクスポートする</a></p></li></ul></li><li><p>インポート操作の一部</p><ul><li><p><a href="/reference/restful/get-import-job-progress-v2">インポートジョブの進捗状況を取得する</a></p></li><li><p><a href="/reference/restful/list-import-jobs-v2">インポートジョブをリストする</a></p></li></ul></li><li><p>バックアップと復元操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">バックアップをリストする</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">バックアップを記述する</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">バックアップポリシーを取得する</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
         <td><p>データプランの権限は、<a href="./project-users#project-roles">プロジェクト</a>および<a href="./cluster-roles">クラスター</a>の役割によって決定されます</p></td>
       </tr>
    </table>

**Organization Member** または **Organization Billing Admin** の場合、招待者には **Organization Member** の役割のみを付与できることに注意してください。

招待者はメールで招待状を受け取ります。組織に参加するには、48時間以内に招待を承諾する必要があります。または、ウェブコンソールから招待リンクをコピーして招待者と共有することもできます。

<Admonition type="info" icon="📘" title="Notes">

<p>毎回、同じ役割を持つ1人以上のユーザーを組織に招待できます。各組織は最大100人のユーザーを持つことができます。</p>

</Admonition>

![invite-user-to-org](https://zdoc-images.s3.us-west-2.amazonaws.com/invite-user-to-org.png "invite-user-to-org")

## 招待を取り消すか再送信する{#revoke-or-resend-an-invitation}

ユーザーを組織に招待した後、Zilliz Cloudはユーザーに招待メールを送信します。ユーザーが招待を承諾する前に、招待を取り消したり再送信したりできます。

![revoke-or-resend-org-invitation-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/revoke-or-resend-org-invitation-byoc.png "revoke-or-resend-org-invitation-byoc")

## 組織ユーザーの役割を編集する{#edit-the-role-of-an-organization-user}

ユーザーが招待を承諾して組織に参加した後、必要に応じてその役割を調整できます。

組織ユーザーの役割を編集するには、**Organization Owner** である必要があります。

![edit-user-role-or-remove-org-user-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-user-role-or-remove-org-user-byoc.png "edit-user-role-or-remove-org-user-byoc")

## 組織ユーザーを削除する{#remove-an-organization-user}

ユーザーが組織に所属しなくなった場合、そのユーザーを削除できます。

組織ユーザーを削除するには、**Organization Owner** である必要があります。

![edit-user-role-or-remove-org-user-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-user-role-or-remove-org-user-byoc.png "edit-user-role-or-remove-org-user-byoc")

## 組織を離れる{#leave-an-organization}

組織に所属しなくなった場合、組織を離れることができます。

各組織には少なくとも1人の組織オーナーが必要です。組織の唯一のオーナーである場合、組織を離れることはできません。

<Admonition type="caution" icon="🚧" title="Warning">

<p>組織を離れると、その組織および関連するリソースにアクセスできなくなります。</p>

</Admonition>

![leave-organization-byoc](https://zdoc-images.s3.us-west-2.amazonaws.com/leave-organization-byoc.png "leave-organization-byoc")

