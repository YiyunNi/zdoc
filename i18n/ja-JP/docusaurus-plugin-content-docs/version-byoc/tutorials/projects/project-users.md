---
title: "プロジェクトユーザーの管理 | BYOC"
slug: /project-users
sidebar_label: "プロジェクトユーザー"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、ユーザーをプロジェクトに招待し、職務に基づいてロールを割り当てることができます。これらのロールは、ユーザーのプロジェクトへのアクセス権と実行可能な操作を決定します。| BYOC"
type: origin
token: PZ4uwwgUfio5OikY0Ecc5nrunFf
sidebar_position: 2
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - プロジェクトユーザー

---

import Admonition from '@theme/Admonition';


# プロジェクトユーザーの管理

Zilliz Cloud では、ユーザーをプロジェクトに招待し、職務に基づいてロールを割り当てることができます。これらのロールは、プロジェクトへのアクセス権と実行可能な操作を決定します。

このトピックでは、プロジェクトユーザーの管理方法について説明します。

## ユーザーをプロジェクトに招待する\{#invite-a-user-to-a-project}

ユーザーをプロジェクトに招待するには、**組織オーナー** または **プロジェクト管理者** である必要があります。

ユーザーをプロジェクトに招待する際は、プロジェクト内で特定の操作を実行するための権限を定義するロールを割り当てる必要があります。

ユーザーを招待するには、招待したいユーザーのメールアドレスを入力します。次に、新しいプロジェクトユーザーに付与するプロジェクトロールを選択します。

以下のいずれかを行います。

- ユーザーに **[プロジェクト管理者](./project-users#project-admin)** を割り当てる
- ユーザーに対して [プロジェクトアクセスポリシー](./project-users#project-access) を構成する

### プロジェクト管理者\{#project-admin}

**プロジェクト管理者** ロールには、プロジェクトとそのすべてのリソース（クラスター、データベース、コレクション）を管理するための完全な権限があります。

以下の表は、各プロジェクトロールに対応する UI および API 権限の一覧です。

<table>
   <tr>
     <th><p><strong>UI 権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p><a href="./collection">collections</a> と <a href="./manage-indexes">indexes</a> の管理</p></li><li><p><a href="./project-users">project users</a> の管理</p></li><li><p><a href="./network-and-security">IP アクセスリストおよびプライベートリンク</a> の管理</p></li><li><p><a href="./manage-project-alerts">project alerts</a> の管理</p></li><li><p><a href="./backup-and-restore">backups</a> の管理</p></li><li><p><a href="./migrations">migrations</a> のデータ管理</p></li><li><p><a href="./job-center">project jobs</a> の管理</p></li><li><p>インテグレーションの管理</p></li><li><p>さらに、<a href="./cluster-roles#built-in-cluster-roles">Cluster Admin</a> のすべての権限 </p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p><a href="/reference/restful/cluster-operations-v2">すべてのクラスター操作</a></p></li><li><p><a href="/reference/restful/volume-operations-v2">すべてのボリューム操作</a></p></li><li><p><a href="/reference/restful/import-operations-v2">すべてのインポート操作</a></p></li><li><p><a href="/reference/restful/backup-and-restore-v2">すべてのバックアップおよび復元操作</a></p></li><li><p><a href="/reference/restful/cloud-migration-v2">すべてのクラウド移行操作</a></p></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/collection-operations-v2">すべてのコレクション操作</a></p></li><li><p><a href="/reference/restful/index-operations-v2">すべてのインデックス操作</a></p></li><li><p><a href="/reference/restful/partition-operations-v2">すべてのパーティション操作</a></p></li><li><p><a href="/reference/restful/vector-operations-v2">すべてのベクトル操作</a></p></li><li><p><a href="/reference/restful/alias-operations-v2">すべてのエイリアス操作</a></p></li><li><p><a href="/reference/restful/role-operations-v2">すべてのロール操作</a></p></li><li><p><a href="/reference/restful/user-operations-v2">すべてのユーザー操作</a></p></li></ul></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>データプレーン RESTful API エンドポイントを呼び出す際は、ターゲットクラスターのユーザー名とパスワードをコロンで区切ったもの（例：<code>username:password</code>）を認証トークンとして使用してください。</p>

</Admonition>

### プロジェクトアクセス\{#project-access}

アクセス権限を最小限に抑えるために、招待されたユーザーに対してクラスターアクセスの詳細な権限を構成することもできます。

![A3DtwF7hfhKyqNboWfmcKT9Unxw](https://zdoc-images.s3.us-west-2.amazonaws.com/A3DtwF7hfhKyqNboWfmcKT9Unxw.png)

デフォルトでは、**Include all future clusters** オプションが有効になった状態で、**All Clusters** へのアクセスが付与されます。**読み書き** などのロールを割り当てて、これらのクラスター全体における招待ユーザーの権限を定義できます。招待が承認されると、ユーザーはプロジェクト内の現在および将来のすべてのクラスターに対して指定された権限を持ちます。

アクセスを制限するには、ドロップダウンから特定のクラスターを選択します。また、**Include all future clusters** オプションを無効にして、 newly created クラスターをアクセス範囲から除外することもできます。

**+ Cluster Access** をクリックして、さらにクラスターアクセスポリシーを追加します。

**読み書き** および **読み取り専用** ロールの具体的な権限については、以下のセクションをご覧ください。

#### 読み書き\{#read-write}

読み書き ロールには、プロジェクトの表示とそのリソース（クラスター、データベース、コレクション）の管理を行う権限があります。以下の表は、各プロジェクトロールに対応する UI および API 権限の一覧です。

<table>
   <tr>
     <th><p><strong>UI 権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p><a href="./collection">collections</a> と <a href="./manage-indexes">indexes</a> の管理</p></li><li><p><a href="null">backups</a> の表示は可能ですが、バックアップファイルからの作成または復元はできません</p></li><li><p><a href="./job-center">project jobs</a> の表示は可能ですが、ジョブのキャンセルや失敗したジョブの再試行はできません</p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">List プロジェクト</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">List Clusters</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">Describe Cluster</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">Query Cluster Metrics</a></p></li><li><p><a href="/docs/prometheus-monitoring">Export Metrics</a></p></li></ul></li><li><p>ボリューム操作の一部</p><ul><li><a href="/reference/restful/list-volumes-v2">List ボリュームs</a></li></ul></li><li><p><a href="/reference/restful/import-operations-v2">すべてのインポート操作</a></p></li><li><p>バックアップおよび復元操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">List Backups</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">Describe Backup</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">Get Backup Policy</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/collection-operations-v2">すべてのコレクション操作</a></p></li><li><p><a href="/reference/restful/index-operations-v2">すべてのインデックス操作</a></p></li><li><p><a href="/reference/restful/partition-operations-v2">すべてのパーティション操作</a></p></li><li><p><a href="/reference/restful/vector-operations-v2">すべてのベクトル操作</a></p></li><li><p><a href="/reference/restful/alias-operations-v2">すべてのエイリアス操作</a></p></li></ul></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>データプレーン RESTful API エンドポイントを呼び出す際は、ターゲットクラスターのユーザー名とパスワードをコロンで区切ったもの（例：<code>username:password</code>）を認証トークンとして使用してください。</p>

</Admonition>

#### 読み取り専用\{#read-only}

読み取り専用 ロールには、プロジェクトとそのリソース（クラスター、データベース、コレクション）を表示する権限があります。以下の表は、各プロジェクトロールに対応する UI および API 権限の一覧です。

<table>
   <tr>
     <th><p><strong>UI 権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p><a href="./collection">collections</a> と <a href="./manage-indexes">indexes</a> の表示のみ</p></li><li><p><a href="null">backups</a> の表示は可能ですが、バックアップファイルからの作成または復元はできません</p></li><li><p><a href="./job-center">project jobs</a> の表示は可能ですが、ジョブのキャンセルや失敗したジョブの再試行はできません</p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">List プロジェクト</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">List Clusters</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">Describe Cluster</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">Query Cluster Metrics</a></p></li><li><p><a href="/docs/prometheus-monitoring">Export Metrics</a></p></li></ul></li><li><p>ボリューム操作の一部</p><ul><li><a href="/reference/restful/list-volumes-v2">List ボリュームs</a></li></ul></li><li><p>インポート操作の一部</p><ul><li><p><a href="/reference/restful/get-import-job-progress-v2">Get Import Job Progress</a></p></li><li><p><a href="/reference/restful/list-import-jobs-v2">List Import ジョブ </a></p></li></ul></li><li><p>バックアップおよび復元操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">List Backups</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">Describe Backup</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">Get Backup Policy</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
     <td><ul><li><p>コレクション操作の一部</p><ul><li><p><a href="/reference/restful/describe-collection-v2">Describe Collection</a></p></li><li><p><a href="/reference/restful/get-collection-load-state-v2">Get Collection Load State</a></p></li><li><p><a href="/reference/restful/get-collection-stats-v2">Get Collection Stats</a></p></li><li><p><a href="/reference/restful/has-collection-v2">Has Collection</a></p></li><li><p><a href="/reference/restful/list-collections-v2">List Collections</a></p></li></ul></li><li><p>インデックス操作の一部</p><ul><li><p><a href="/reference/restful/describe-index-v2">Describe Index</a></p></li><li><p><a href="/reference/restful/list-indexes-v2">List Indexes</a></p></li></ul></li><li><p>パーティション操作の一部</p><ul><li><p><a href="/reference/restful/get-partition-statistics-v2">Get Partition Statistics</a></p></li><li><p><a href="/reference/restful/has-partition-v2">Has Partition</a></p></li><li><p><a href="/reference/restful/list-partitions-v2">List パーティション</a></p></li></ul></li><li><p>エイリアス操作の一部</p><ul><li><p><a href="/reference/restful/describe-alias-v2">Describe エイリアス</a></p></li><li><p><a href="/reference/restful/list-aliases-v2">List エイリアスes</a></p></li></ul></li><li><p>ベクトル操作の一部</p><ul><li><p><a href="/reference/restful/get-v2">Get</a></p></li><li><p><a href="/reference/restful/hybrid-search-v2">Hybrid Search</a></p></li><li><p><a href="/reference/restful/query-v2">Query</a></p></li><li><p><a href="/reference/restful/search-v2">Search</a></p></li></ul></li></ul></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>データプレーン RESTful API エンドポイントを呼び出す際は、ターゲットクラスターのユーザー名とパスワードをコロンで区切ったもの（例：<code>username:password</code>）を認証トークンとして使用してください。</p>

</Admonition>

招待を受けた受信者は、プロジェクトに参加するために 48 時間以内に承諾する必要があるメール招待を受け取ります。あるいは、Web コンソールから招待リンクをコピーして、招待対象者と共有することもできます。

ユーザーがプロジェクトに参加すると、そのプロジェクトが所属する組織の 組織メンバー に自動的に登録されます。

<Admonition type="info" icon="📘" title="Notes">

<p>毎回、同じロールを持つ 1 人以上のユーザーをプロジェクトに招待することができます。</p>

</Admonition>

## 招待の取り消しまたは再送信\{#revoke-or-resend-an-invitation}

同一組織内の既存の組織メンバーをプロジェクトに招待する場合、別途招待状を送らなくても自動的にプロジェクトへのアクセス権が付与されます。ただし、所属していない組織内のプロジェクトに誰かを招待する場合、その組織への参加招待が届き、同時に指定されたプロジェクトへのアクセス権も付与されます。

![CKuxwsNxihJzNtbQ4fBc1xHRnxf](https://zdoc-images.s3.us-west-2.amazonaws.com/CKuxwsNxihJzNtbQ4fBc1xHRnxf.png)

招待を取り消したり再送信したりするには、**組織オーナー** または **プロジェクト管理者** である必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>ユーザーが招待を承諾する前に、招待を取り消したり再送信したりすることができます。</p>

</Admonition>

## コラボレーターのロールを編集する\{#edit-a-collaborators-role}

ユーザーが招待を承諾すると、プロジェクトのコラボレーターになります。

コラボレーターのロールを編集するには、**組織オーナー** または **プロジェクト管理者** である必要があります。

![H1hUwVUrThoYtYbeMVccsswync5](https://zdoc-images.s3.us-west-2.amazonaws.com/H1hUwVUrThoYtYbeMVccsswync5.png)

## コラボレーターを削除する\{#remove-a-collaborator}

プロジェクトのコラボレーターを削除するには、**組織オーナー** または **プロジェクト管理者** である必要があります。

![HKpow0x7qheStnb0zcOcDlyunHc](https://zdoc-images.s3.us-west-2.amazonaws.com/HKpow0x7qheStnb0zcOcDlyunHc.png)

## プロジェクトから退出する\{#leave-a-project}

プロジェクトからコラボレーターを削除するだけでなく、自分自身もプロジェクトから退出することで削除できます。

![DTwiwN0AThgVZLb60dMcSblDnsb](https://zdoc-images.s3.us-west-2.amazonaws.com/DTwiwN0AThgVZLb60dMcSblDnsb.png)

なお、プロジェクトの唯一の管理者である場合、プロジェクトから退出することはできません。各プロジェクトには、常に少なくとも 1 人の プロジェクト管理者 が必要だからです。

<Admonition type="caution" icon="🚧" title="Warning">

<p>プロジェクトから退出すると、プロジェクトおよび関連リソースへのアクセス権は取り消されます。</p>

</Admonition>

