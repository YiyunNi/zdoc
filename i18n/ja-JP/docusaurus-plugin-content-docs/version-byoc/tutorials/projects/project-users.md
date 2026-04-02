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

Zilliz Cloud では、ユーザーをプロジェクトに招待し、職務に基づいてロールを割り当てることができます。これらのロールは、ユーザーのプロジェクトへのアクセス権と実行可能な操作を決定します。

本トピックでは、プロジェクトユーザーの管理方法について説明します。

## ユーザーをプロジェクトに招待する\{#invite-a-user-to-a-project}

ユーザーをプロジェクトに招待するには、**組織オーナー**または**プロジェクト管理者**である必要があります。

ユーザーをプロジェクトに招待する際は、プロジェクト内での特定の操作を実行するための権限を定義するロールを割り当てる必要があります。

ユーザーを招待するには、招待したいユーザーのメールアドレスを入力します。次に、新しいプロジェクトユーザーに付与するプロジェクトロールを選択します。

以下のいずれかを行います。

- ユーザーに **[プロジェクト管理者](./project-users#project-admin)** を割り当てる
- ユーザーに対して [プロジェクトアクセスポリシー](./project-users#project-access) を構成する

### プロジェクト管理者\{#project-admin}

**プロジェクト管理者**ロールは、プロジェクトとそのすべてのリソース（クラスター、データベース、コレクション）を管理するための完全な権限を持ちます。

以下の表は、各プロジェクトロールに対応する UI および API 権限の一覧です。

<table>
   <tr>
     <th><p><strong>UI 権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p><a href="./collection">コレクション</a> と <a href="./manage-indexes">インデックス</a> の管理</p></li><li><p><a href="./project-users">プロジェクトユーザー</a> の管理</p></li><li><p><a href="./setup-console-ip-allowlist">コンソール IP アクセスリスト</a> の管理</p></li><li><p><a href="./manage-project-alerts">プロジェクトアラート</a> の管理</p></li><li><p><a href="./backup-and-restore">バックアップ</a> の管理</p></li><li><p><a href="./migrations">データ移行</a> の管理</p></li><li><p><a href="./job-center">プロジェクトジョブ</a> の管理</p></li><li><p>統合の管理</p></li><li><p>さらに、すべての <a href="./cluster-roles#built-in-cluster-roles">クラスター管理者</a> 権限も含みます</p></li></ul></td>
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

デフォルトでは、**すべてのクラスター**へのアクセスが付与され、**将来のすべてのクラスターを含める**オプションが有効になっています。**読み書き**などのロールを割り当てて、これらのクラスター全体における招待ユーザーの権限を定義できます。招待が承認されると、ユーザーはプロジェクト内の現在および将来のすべてのクラスターに対して指定された権限を持つことになります。

アクセスを制限するには、ドロップダウンから特定のクラスターを選択します。また、**将来のすべてのクラスターを含める**オプションを無効にして、 newly created クラスターをアクセス範囲から除外することもできます。

**+ クラスターアクセス**をクリックして、さらにクラスターアクセスポリシーを追加できます。

**読み書き**および**読み取り専用**ロールの具体的な権限については、以下のセクションをご覧ください。

#### 読み書き\{#read-write}

読み書きロールは、プロジェクトを表示し、そのリソース（クラスター、データベース、コレクション）を管理する権限を持ちます。以下の表は、各プロジェクトロールに対応する UI および API 権限の一覧です。

<table>
   <tr>
     <th><p><strong>UI 権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p><a href="./collection">コレクション</a> と <a href="./manage-indexes">インデックス</a> の管理</p></li><li><p><a href="null">バックアップ</a>の表示は可能ですが、バックアップファイルからの作成や復元はできません</p></li><li><p><a href="./job-center">プロジェクトジョブ</a>の表示は可能ですが、ジョブのキャンセルや失敗したジョブの再試行はできません</p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">プロジェクトの一覧表示</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">クラスターの一覧表示</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">クラスターの説明</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">クラスターメトリクスの照会</a></p></li><li><p><a href="/docs/prometheus-monitoring">メトリクスのエクスポート</a></p></li></ul></li><li><p>ボリューム操作の一部</p><ul><li><a href="/reference/restful/list-volumes-v2">ボリュームの一覧表示</a></li></ul></li><li><p><a href="/reference/restful/import-operations-v2">すべてのインポート操作</a></p></li><li><p>バックアップおよび復元操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">バックアップの一覧表示</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">バックアップの説明</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">バックアップポリシーの取得</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/collection-operations-v2">すべてのコレクション操作</a></p></li><li><p><a href="/reference/restful/index-operations-v2">すべてのインデックス操作</a></p></li><li><p><a href="/reference/restful/partition-operations-v2">すべてのパーティション操作</a></p></li><li><p><a href="/reference/restful/vector-operations-v2">すべてのベクトル操作</a></p></li><li><p><a href="/reference/restful/alias-operations-v2">すべてのエイリアス操作</a></p></li></ul></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>データプレーン RESTful API エンドポイントを呼び出す際は、ターゲットクラスターのユーザー名とパスワードをコロンで区切ったもの（例：<code>username:password</code>）を認証トークンとして使用してください。</p>

</Admonition>

#### 読み取り専用\{#read-only}

読み取り専用ロールは、プロジェクトとそのリソース（クラスター、データベース、コレクション）を表示する権限を持ちます。以下の表は、各プロジェクトロールに対応する UI および API 権限の一覧です。

<table>
   <tr>
     <th><p><strong>UI 権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p><a href="./collection">コレクション</a> と <a href="./manage-indexes">インデックス</a> の表示のみ</p></li><li><p><a href="null">バックアップ</a>の表示は可能ですが、バックアップファイルからの作成や復元はできません</p></li><li><p><a href="./job-center">プロジェクトジョブ</a>の表示は可能ですが、ジョブのキャンセルや失敗したジョブの再試行はできません</p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">プロジェクトの一覧表示</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">クラスターの一覧表示</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">クラスターの説明</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">クラスターメトリクスの照会</a></p></li><li><p><a href="/docs/prometheus-monitoring">メトリクスのエクスポート</a></p></li></ul></li><li><p>ボリューム操作の一部</p><ul><li><a href="/reference/restful/list-volumes-v2">ボリュームの一覧表示</a></li></ul></li><li><p>インポート操作の一部</p><ul><li><p><a href="/reference/restful/get-import-job-progress-v2">インポートジョブの進捗状況の取得</a></p></li><li><p><a href="/reference/restful/list-import-jobs-v2">インポートジョブの一覧表示</a></p></li></ul></li><li><p>バックアップおよび復元操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">バックアップの一覧表示</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">バックアップの説明</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">バックアップポリシーの取得</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
     <td><ul><li><p>コレクション操作の一部</p><ul><li><p><a href="/reference/restful/describe-collection-v2">コレクションの説明</a></p></li><li><p><a href="/reference/restful/get-collection-load-state-v2">コレクションのロード状態の取得</a></p></li><li><p><a href="/reference/restful/get-collection-stats-v2">コレクション統計情報の取得</a></p></li><li><p><a href="/reference/restful/has-collection-v2">コレクションの有無確認</a></p></li><li><p><a href="/reference/restful/list-collections-v2">コレクションの一覧表示</a></p></li></ul></li><li><p>インデックス操作の一部</p><ul><li><p><a href="/reference/restful/describe-index-v2">インデックスの説明</a></p></li><li><p><a href="/reference/restful/list-indexes-v2">インデックスの一覧表示</a></p></li></ul></li><li><p>パーティション操作の一部</p><ul><li><p><a href="/reference/restful/get-partition-statistics-v2">パーティション統計情報の取得</a></p></li><li><p><a href="/reference/restful/has-partition-v2">パーティションの有無確認</a></p></li><li><p><a href="/reference/restful/list-partitions-v2">パーティションの一覧表示</a></p></li></ul></li><li><p>エイリアス操作の一部</p><ul><li><p><a href="/reference/restful/describe-alias-v2">エイリアスの説明</a></p></li><li><p><a href="/reference/restful/list-aliases-v2">エイリアスの一覧表示</a></p></li></ul></li><li><p>ベクトル操作の一部</p><ul><li><p><a href="/reference/restful/get-v2">取得</a></p></li><li><p><a href="/reference/restful/hybrid-search-v2">ハイブリッド検索</a></p></li><li><p><a href="/reference/restful/query-v2">照会</a></p></li><li><p><a href="/reference/restful/search-v2">検索</a></p></li></ul></li></ul></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>データプレーン RESTful API エンドポイントを呼び出す際は、ターゲットクラスターのユーザー名とパスワードをコロンで区切ったもの（例：<code>username:password</code>）を認証トークンとして使用してください。</p>

</Admonition>

招待を受けた受信者は、プロジェクトに参加するために 48 時間以内に承諾する必要があるメール招待を受け取ります。あるいは、Web コンソールから招待リンクをコピーして、招待対象者と共有することもできます。

ユーザーがプロジェクトに参加すると、自動的にそのプロジェクトが所属する組織の組織メンバーになります。

<Admonition type="info" icon="📘" title="Notes">

<p>毎回、同じロールを持つ 1 人以上のユーザーをプロジェクトに招待できます。</p>

</Admonition>

## 招待の取り消しまたは再送信\{#revoke-or-resend-an-invitation}

既存の組織メンバーを同じ組織内のプロジェクトに招待する場合、別途招待状を送らずとも自動的にプロジェクトへのアクセス権が付与されます。ただし、まだ所属していない組織内のプロジェクトに誰かを招待する場合、その組織への参加招待が届き、同時に指定されたプロジェクトへのアクセス権も付与されます。

![CKuxwsNxihJzNtbQ4fBc1xHRnxf](https://zdoc-images.s3.us-west-2.amazonaws.com/CKuxwsNxihJzNtbQ4fBc1xHRnxf.png)

招待を取り消したり再送信したりするには、**組織オーナー**または**プロジェクト管理者**である必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>ユーザーが招待を承諾する前に、招待を取り消したり再送信したりできます。</p>

</Admonition>

## 共同作業者のロールを編集する\{#edit-a-collaborators-role}

ユーザーが招待を承諾すると、プロジェクトの共同作業者になります。

共同作業者のロールを編集するには、**組織オーナー**または**プロジェクト管理者**である必要があります。

![H1hUwVUrThoYtYbeMVccsswync5](https://zdoc-images.s3.us-west-2.amazonaws.com/H1hUwVUrThoYtYbeMVccsswync5.png)

## 共同作業者を削除する\{#remove-a-collaborator}

プロジェクトの共同作業者を削除するには、**組織オーナー**または**プロジェクト管理者**である必要があります。

![HKpow0x7qheStnb0zcOcDlyunHc](https://zdoc-images.s3.us-west-2.amazonaws.com/HKpow0x7qheStnb0zcOcDlyunHc.png)

## プロジェクトから脱退する\{#leave-a-project}

プロジェクトから共同作業者を削除するだけでなく、自分自身も脱退することで移除できます。

![DTwiwN0AThgVZLb60dMcSblDnsb](https://zdoc-images.s3.us-west-2.amazonaws.com/DTwiwN0AThgVZLb60dMcSblDnsb.png)

なお、あなたがプロジェクトの唯一の管理者である場合、プロジェクトからは脱退できません。各プロジェクトには常に少なくとも 1 人のプロジェクト管理者が必要です。

<Admonition type="caution" icon="🚧" title="Warning">

<p>プロジェクトから脱退すると、そのプロジェクトおよび関連リソースへのアクセス権は取り消されます。</p>

</Admonition>

