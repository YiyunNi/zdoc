---
title: "プロジェクトユーザーの管理 | Cloud"
slug: /project-users
sidebar_label: "プロジェクトユーザー"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudでは、ユーザーをプロジェクトに招待し、その職務に基づいてロールを割り当てることができます。これらのロールは、ユーザーのプロジェクトへのアクセス権と実行可能な操作を決定します。"
type: origin
token: PZ4uwwgUfio5OikY0Ecc5nrunFf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - プロジェクトユーザー
  - ニューラルネットワーク
  - ディープラーニング
  - ナレッジベース
  - 自然言語処理

---

import Admonition from '@theme/Admonition';


# プロジェクトユーザーの管理

Zilliz Cloudでは、ユーザーをプロジェクトに招待し、その職務に基づいて役割を割り当てることができます。これらの役割は、ユーザーのプロジェクトへのアクセス権と実行できる操作を決定します。

このトピックでは、プロジェクトユーザーを管理する方法について説明します。

## プロジェクトにユーザーを招待する{#invite-a-user-to-a-project}

ユーザーをプロジェクトに招待するには、**Organization Owner**または**Project Admin**である必要があります。

ユーザーをプロジェクトに招待する際には、そのプロジェクト内で特定の操作を実行するための権限を定義する役割をユーザーに付与する必要があります。

ユーザーを招待するには、招待したいユーザーのメールアドレスを入力します。次に、新しいプロジェクトユーザーに付与したいプロジェクトの役割を選択します。

### プロジェクトの役割{#project-roles}

Zilliz Cloudは3つのプロジェクトの役割を提供します。これらの役割は変更または削除できません。

- **Project Admin**: Project Adminの役割は、プロジェクトとそのすべてのリソース（クラスター、データベース、collection）を管理するための完全な権限を持っています。

    次の表は、各プロジェクトの役割に対応するUIおよびAPIの権限を示しています。

    <table>
       <tr>
         <th><p><strong>UI権限</strong></p></th>
         <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
         <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
       </tr>
       <tr>
         <td><ul><li><p>プロジェクト内の<a href="./cluster">クラスター</a>を管理する</p></li><li><p>プロジェクト内の<a href="./volume-explained">ボリューム</a>を管理する</p></li><li><p><a href="./collection">collection</a>と<a href="./manage-indexes">インデックス</a>を管理する</p></li><li><p><a href="./project-users">プロジェクトユーザー</a>を管理する</p></li><li><p><a href="./network-and-security">IPアクセスリストとプライベートリンク</a>を管理する</p></li><li><p><a href="./manage-project-alerts">プロジェクトアラート</a>を管理する</p></li><li><p><a href="./backup-and-restore">バックアップ</a>を管理する</p></li><li><p>データ<a href="./migrations">移行</a>を管理する</p></li><li><p><a href="./job-center">プロジェクトジョブ</a>を管理する</p></li><li><p>統合を管理する</p></li><li><p>すべての<a href="./cluster-roles#built-in-cluster-roles">Cluster Admin</a>権限を含む</p></li></ul></td>
         <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p><a href="/reference/restful/cluster-operations-v2">すべてのクラスター操作</a></p></li><li><p><a href="/reference/restful/volume-operations-v2">すべてのボリューム操作</a></p></li><li><p><a href="/reference/restful/import-operations-v2">すべてのインポート操作</a></p></li><li><p><a href="/reference/restful/backup-and-restore-v2">すべてのバックアップ＆リストア操作</a></p></li><li><p><a href="/reference/restful/cloud-migration-v2">すべてのクラウド移行操作</a></p></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
         <td><ul><li><p><a href="/reference/restful/collection-operations-v2">すべてのcollection操作</a></p></li><li><p><a href="/reference/restful/index-operations-v2">すべてのインデックス操作</a></p></li><li><p><a href="/reference/restful/partition-operations-v2">すべてのpartition操作</a></p></li><li><p><a href="/reference/restful/vector-operations-v2">すべてのベクトル操作</a></p></li><li><p><a href="/reference/restful/alias-operations-v2">すべてのエイリアス操作</a></p></li><li><p><a href="/reference/restful/role-operations-v2">すべてのロール操作</a></p></li><li><p><a href="/reference/restful/user-operations-v2">すべてのユーザー操作</a></p></li></ul></td>
       </tr>
    </table>

- **Project Read-Write**: Project Read-Writeの役割は、プロジェクトを表示し、そのリソース（クラスター、データベース、collection）を管理する権限を持っています。

    次の表は、各プロジェクトの役割に対応するUIおよびAPIの権限を示しています。

    <table>
       <tr>
         <th><p><strong>UI権限</strong></p></th>
         <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
         <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
       </tr>
       <tr>
         <td><ul><li><p>プロジェクト内の<a href="./cluster">クラスター</a>を表示し、作成および管理はできない</p></li><li><p>プロジェクト内の<a href="./volume-explained">ボリューム</a>を表示し、作成および管理はできない</p></li><li><p>ボリュームからファイル/フォルダを削除する</p></li><li><p><a href="./collection">collection</a>と<a href="./manage-indexes">インデックス</a>を管理する</p></li><li><p><a href="null">バックアップ</a>を表示するが、バックアップファイルから作成または復元はできない</p></li><li><p><a href="./job-center">プロジェクトジョブ</a>を表示するが、ジョブをキャンセルしたり、失敗したジョブを再試行したりはできない</p></li></ul></td>
         <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">プロジェクトをリストする</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">クラスターをリストする</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">クラスターを記述する</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">クラスターメトリクスをクエリする</a></p></li><li><p><a href="/docs/prometheus-monitoring">メトリクスをエクスポートする</a></p></li></ul></li><li><p>ボリューム操作の一部</p><ul><li><a href="/reference/restful/list-volumes-v2">ボリュームをリストする</a></li></ul></li><li><p><a href="/reference/restful/import-operations-v2">すべてのインポート操作</a></p></li><li><p>バックアップ＆リストア操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">バックアップをリストする</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">バックアップを記述する</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">バックアップポリシーを取得する</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
         <td><ul><li><p><a href="/reference/restful/collection-operations-v2">すべてのcollection操作</a></p></li><li><p><a href="/reference/restful/index-operations-v2">すべてのインデックス操作</a></p></li><li><p><a href="/reference/restful/partition-operations-v2">すべてのpartition操作</a></p></li><li><p><a href="/reference/restful/vector-operations-v2">すべてのベクトル操作</a></p></li><li><p><a href="/reference/restful/alias-operations-v2">すべてのエイリアス操作</a></p></li></ul></td>
       </tr>
    </table>

- **Project Read-Only**: Project Read-Onlyの役割は、プロジェクトとそのリソース（クラスター、データベース、collection）を表示する権限を持っています。

    次の表は、各プロジェクトの役割に対応するUIおよびAPIの権限を示しています。

    <table>
       <tr>
         <th><p><strong>UI権限</strong></p></th>
         <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
         <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
       </tr>
       <tr>
         <td><ul><li><p>プロジェクト内の<a href="./cluster">クラスター</a>を表示し、作成および管理はできない</p></li><li><p>プロジェクト内の<a href="./volume-explained">ボリューム</a>を表示し、作成および管理はできない</p></li><li><p><a href="./collection">collection</a>と<a href="./manage-indexes">インデックス</a>のみを表示する</p></li><li><p><a href="null">バックアップ</a>を表示するが、バックアップファイルから作成または復元はできない</p></li><li><p><a href="./job-center">プロジェクトジョブ</a>を表示するが、ジョブをキャンセルしたり、失敗したジョブを再試行したりはできない</p></li></ul></td>
         <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">プロジェクトをリストする</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">クラスターをリストする</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">クラスターを記述する</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">クラスターメトリクスをクエリする</a></p></li><li><p><a href="/docs/prometheus-monitoring">メトリクスをエクスポートする</a></p></li></ul></li><li><p>ボリューム操作の一部</p><ul><li><a href="/reference/restful/list-volumes-v2">ボリュームをリストする</a></li></ul></li><li><p>インポート操作の一部</p><ul><li><p><a href="/reference/restful/get-import-job-progress-v2">インポートジョブの進捗状況を取得する</a></p></li><li><p><a href="/reference/restful/list-import-jobs-v2">インポートジョブをリストする</a></p></li></ul></li><li><p>バックアップ＆リストア操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">バックアップをリストする</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">バックアップを記述する</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">バックアップポリシーを取得する</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
         <td><ul><li><p>collection操作の一部</p><ul><li><p><a href="/reference/restful/describe-collection-v2">collectionを記述する</a></p></li><li><p><a href="/reference/restful/get-collection-load-state-v2">collectionのload状態を取得する</a></p></li><li><p><a href="/reference/restful/get-collection-stats-v2">collectionの統計情報を取得する</a></p></li><li><p><a href="/reference/restful/has-collection-v2">collectionが存在するか確認する</a></p></li><li><p><a href="/reference/restful/list-collections-v2">collectionをリストする</a></p></li></ul></li><li><p>インデックス操作の一部</p><ul><li><p><a href="/reference/restful/describe-index-v2">インデックスを記述する</a></p></li><li><p><a href="/reference/restful/list-indexes-v2">インデックスをリストする</a></p></li></ul></li><li><p>partition操作の一部</p><ul><li><p><a href="/reference/restful/get-partition-statistics-v2">partitionの統計情報を取得する</a></p></li><li><p><a href="/reference/restful/has-partition-v2">partitionが存在するか確認する</a></p></li><li><p><a href="/reference/restful/list-partitions-v2">partitionをリストする</a></p></li></ul></li><li><p>エイリアス操作の一部</p><ul><li><p><a href="/reference/restful/describe-alias-v2">エイリアスを記述する</a></p></li><li><p><a href="/reference/restful/list-aliases-v2">エイリアスをリストする</a></p></li></ul></li><li><p>ベクトル操作の一部</p><ul><li><p><a href="/reference/restful/get-v2">取得する</a></p></li><li><p><a href="/reference/restful/hybrid-search-v2">ハイブリッド検索</a></p></li><li><p><a href="/reference/restful/query-v2">クエリ</a></p></li><li><p><a href="/reference/restful/search-v2">検索</a></p></li></ul></li></ul></td>
       </tr>
    </table>

招待されたユーザーはメールで招待状を受け取ります。プロジェクトに参加するには、48時間以内に招待を承諾する必要があります。または、ウェブコンソールから招待リンクをコピーして、招待されたユーザーと共有することもできます。

ユーザーがプロジェクトに参加すると、そのユーザーは自動的にプロジェクトが属する組織のOrganization Memberになります。

<Admonition type="info" icon="📘" title="Notes">

<p>毎回、同じ役割を持つ1人以上のユーザーをプロジェクトに招待できます。</p>

</Admonition>

![invite-user-to-project](https://zdoc-images.s3.us-west-2.amazonaws.com/invite-user-to-project.png "invite-user-to-project")

## 招待を取り消すか再送する{#revoke-or-resend-an-invitation}

既存の組織メンバーを同じ組織内のプロジェクトに招待すると、そのメンバーは別途招待状を受け取ることなく、自動的にプロジェクトへのアクセス権を得ます。ただし、まだ組織に属していない人をプロジェクトに招待すると、その人は組織への招待を受け取り、同時に指定されたプロジェクトへのアクセス権も付与されます。

招待を取り消すか再送するには、**Organization Owner**または**Project Admin**である必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>ユーザーが招待を承諾する前に、招待を取り消すか再送できます。</p>

</Admonition>

![revoke-or-cancel-invitation-to-project](https://zdoc-images.s3.us-west-2.amazonaws.com/revoke-or-cancel-invitation-to-project.png "revoke-or-cancel-invitation-to-project")

## コラボレーターの役割を編集するか、コラボレーターを削除する{#edit-a-collaborators-role-or-remove-a-collaborator}

ユーザーが招待を承諾すると、そのユーザーはプロジェクトのコラボレーターになります。

コラボレーターの役割を編集するか、プロジェクトのコラボレーターを削除するには、**Organization Owner**または**Project Admin**である必要があります。

![edit-user-role-or-remove-project-user](https://zdoc-images.s3.us-west-2.amazonaws.com/edit-user-role-or-remove-project-user.png "edit-user-role-or-remove-project-user")

## プロジェクトを離れる{#leave-a-project}

プロジェクトからコラボレーターを削除するだけでなく、自分でプロジェクトを離れることもできます。

ただし、プロジェクトの唯一の管理者である場合、各プロジェクトには常に少なくとも1人のProject Adminが必要であるため、プロジェクトを離れることはできません。

<Admonition type="caution" icon="🚧" title="Warning">

<p>プロジェクトを離れると、プロジェクトおよび関連リソースへのアクセス権が取り消されます。</p>

</Admonition>

![leave-project](https://zdoc-images.s3.us-west-2.amazonaws.com/leave-project.png "leave-project")

