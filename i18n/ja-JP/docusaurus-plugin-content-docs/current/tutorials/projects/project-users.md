---
title: "プロジェクトユーザーの管理 | Cloud"
slug: /project-users
sidebar_label: "プロジェクトユーザー"
beta: FALSE
notebook: FALSE
description: 'Zilliz Cloudでは、ユーザーをプロジェクトに招待し、その職務に基づいて役割を割り当てることができます。これらの役割は、ユーザーのプロジェクトへのアクセス権と実行できる操作を決定します。 | Cloud'
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

Zilliz Cloudでは、プロジェクトにユーザーを招待し、その職務に基づいて役割を割り当てることができます。これらの役割は、ユーザーのプロジェクトへのアクセス権と実行できる操作を決定します。

このトピックでは、プロジェクトユーザーを管理する方法について説明します。

## プロジェクトにユーザーを招待する\{#invite-a-user-to-a-project}

プロジェクトにユーザーを招待するには、**組織オーナー**または**プロジェクト管理者**である必要があります。

ユーザーをプロジェクトに招待する際には、プロジェクト内で特定の操作を実行するための権限を定義する役割を割り当てる必要があります。

ユーザーを招待するには、招待したいユーザーのメールアドレスを入力します。次に、新しいプロジェクトユーザーに付与したいプロジェクトの役割を選択します。

次のいずれかを選択できます。

- ユーザーに**[プロジェクト管理者](./project-users#project-admin)**を割り当てるか、

- ユーザーの[プロジェクトアクセスポリシー](./project-users#project-access)を設定します。

### プロジェクト管理者\{#project-admin}

**プロジェクト管理者**の役割は、プロジェクトとそのすべてのリソース（クラスター、データベース、コレクション）を管理するための完全な権限を持っています。

次の表は、各プロジェクトの役割に対応するUIおよびAPIの権限を示しています。

<table>
   <tr>
     <th><p><strong>UI権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p>プロジェクト内の<a href="./cluster">クラスター</a>を管理する</p></li><li><p>プロジェクト内の<a href="./volume-explained">ボリューム</a>を管理する</p></li><li><p><a href="./collection">コレクション</a>と<a href="./manage-indexes">インデックス</a>を管理する</p></li><li><p><a href="./project-users">プロジェクトユーザー</a>を管理する</p></li><li><p><a href="./network-and-security">IPアクセスリストとプライベートリンク</a>を管理する</p></li><li><p><a href="./manage-project-alerts">プロジェクトアラート</a>を管理する</p></li><li><p><a href="./backup-and-restore">バックアップ</a>を管理する</p></li><li><p>データ<a href="./migrations">移行</a>を管理する</p></li><li><p><a href="./job-center">プロジェクトジョブ</a>を管理する</p></li><li><p>統合を管理する</p></li><li><p>すべての<a href="./cluster-roles#built-in-cluster-roles">クラスター管理者</a>権限を含む</p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p><a href="/reference/restful/cluster-operations-v2">すべてのクラスター操作</a></p></li><li><p><a href="/reference/restful/volume-operations-v2">すべてのボリューム操作</a></p></li><li><p><a href="/reference/restful/import-operations-v2">すべてのインポート操作</a></p></li><li><p><a href="/reference/restful/backup-and-restore-v2">すべてのバックアップ＆リストア操作</a></p></li><li><p><a href="/reference/restful/cloud-migration-v2">すべてのクラウド移行操作</a></p></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/collection-operations-v2">すべてのコレクション操作</a></p></li><li><p><a href="/reference/restful/index-operations-v2">すべてのインデックス操作</a></p></li><li><p><a href="/reference/restful/partition-operations-v2">すべてのパーティション操作</a></p></li><li><p><a href="/reference/restful/vector-operations-v2">すべてのベクトル操作</a></p></li><li><p><a href="/reference/restful/alias-operations-v2">すべてのエイリアス操作</a></p></li><li><p><a href="/reference/restful/role-operations-v2">すべてのロール操作</a></p></li><li><p><a href="/reference/restful/user-operations-v2">すべてのユーザー操作</a></p></li></ul></td>
   </tr>
</table>

### プロジェクトアクセス\{#project-access}

アクセス権限を最小限に抑えるために、招待されたユーザーのクラスターおよびボリュームアクセスに対して、きめ細かい権限を設定することもできます。

![Gs3jwYjb6hVbunbyASAcVUp3nIe](https://zdoc-images.s3.us-west-2.amazonaws.com/Gs3jwYjb6hVbunbyASAcVUp3nIe.png)

- **クラスターアクセス**

    デフォルトでは、「**すべての将来のクラスターを含める**」オプションが有効になっている「**すべてのクラスター**」へのアクセスが許可されます。招待されたユーザーのこれらのクラスター全体での権限を定義するために、**読み書き**などの役割を割り当てることができます。招待が承認されると、ユーザーはプロジェクト内のすべての現在および将来のクラスターに対して指定された権限を持つことになります。

    アクセスを制限するには、ドロップダウンから特定のクラスターを選択します。「**すべての将来のクラスターを含める**」オプションを無効にして、新しく作成されたクラスターをアクセス範囲から除外することもできます。

    「**+ クラスターアクセス**」をクリックして、さらにクラスターアクセスポリシーを追加します。

- **ボリュームアクセス**

    デフォルトでは、「**すべての将来のボリュームを含める**」オプションが有効になっている「**すべてのボリューム**」へのアクセスが許可されます。招待されたユーザーのこれらのボリューム全体での権限を定義するために、**読み書き**などの役割を割り当てることができます。招待が承認されると、ユーザーはプロジェクト内のすべての現在および将来のボリュームに対して指定された権限を持つことになります。

    アクセスを制限するには、ドロップダウンから特定のボリュームを選択します。「**すべての将来のボリュームを含める**」オプションを無効にして、新しく作成されたボリュームをアクセス範囲から除外することもできます。

    「**+ ボリュームアクセス**」をクリックして、さらにクラスターアクセスポリシーを追加します。

**読み書き**および**読み取り専用**の役割の具体的な権限については、以下のセクションを参照してください。

#### 読み書き\{#read-write}

読み書きの役割は、プロジェクトを表示し、そのリソース（クラスター、データベース、コレクション）を管理する権限を持っています。次の表は、各プロジェクトの役割に対応するUIおよびAPIの権限を示しています。

<table>
   <tr>
     <th><p><strong>UI権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p>プロジェクト内の<a href="./cluster">クラスター</a>を表示するが、作成および管理はできない</p></li><li><p>プロジェクト内の<a href="./volume-explained">ボリューム</a>を表示するが、作成および管理はできない</p></li><li><p>ボリュームからファイル/フォルダーを削除する</p></li><li><p><a href="./collection">コレクション</a>と<a href="./manage-indexes">インデックス</a>を管理する</p></li><li><p><a href="null">バックアップ</a>を表示するが、バックアップファイルから作成または復元はできない</p></li><li><p><a href="./job-center">プロジェクトジョブ</a>を表示するが、ジョブをキャンセルしたり、失敗したジョブを再試行したりはできない</p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">プロジェクトをリストする</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">クラスターをリストする</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">クラスターを記述する</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">クラスターメトリクスをクエリする</a></p></li><li><p><a href="/docs/prometheus-monitoring">メトリクスをエクスポートする</a></p></li></ul></li><li><p>ボリューム操作の一部</p><ul><li><a href="/reference/restful/list-volumes-v2">ボリュームをリストする</a></li></ul></li><li><p><a href="/reference/restful/import-operations-v2">すべてのインポート操作</a></p></li><li><p>バックアップ＆リストア操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">バックアップをリストする</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">バックアップを記述する</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">バックアップポリシーを取得する</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/collection-operations-v2">すべてのコレクション操作</a></p></li><li><p><a href="/reference/restful/index-operations-v2">すべてのインデックス操作</a></p></li><li><p><a href="/reference/restful/partition-operations-v2">すべてのパーティション操作</a></p></li><li><p><a href="/reference/restful/vector-operations-v2">すべてのベクトル操作</a></p></li><li><p><a href="/reference/restful/alias-operations-v2">すべてのエイリアス操作</a></p></li></ul></td>
   </tr>
</table>

#### 読み取り専用\{#read-only}

読み取り専用の役割は、プロジェクトとそのリソース（クラスター、データベース、コレクション）を表示する権限を持っています。次の表は、各プロジェクトの役割に対応するUIおよびAPIの権限を示しています。

<table>
   <tr>
     <th><p><strong>UI権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p>プロジェクト内の<a href="./cluster">クラスター</a>を表示するが、作成および管理はできない</p></li><li><p>プロジェクト内の<a href="./volume-explained">ボリューム</a>を表示するが、作成および管理はできない</p></li><li><p><a href="./collection">コレクション</a>と<a href="./manage-indexes">インデックス</a>のみを表示する</p></li><li><p><a href="null">バックアップ</a>を表示するが、バックアップファイルから作成または復元はできない</p></li><li><p><a href="./job-center">プロジェクトジョブ</a>を表示するが、ジョブをキャンセルしたり、失敗したジョブを再試行したりはできない</p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">プロジェクトをリストする</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">クラスターをリストする</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">クラスターを記述する</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">クラスターメトリクスをクエリする</a></p></li><li><p><a href="/docs/prometheus-monitoring">メトリクスをエクスポートする</a></p></li></ul></li><li><p>ボリューム操作の一部</p><ul><li><a href="/reference/restful/list-volumes-v2">ボリュームをリストする</a></li></ul></li><li><p>インポート操作の一部</p><ul><li><p><a href="/reference/restful/get-import-job-progress-v2">インポートジョブの進捗状況を取得する</a></p></li><li><p><a href="/reference/restful/list-import-jobs-v2">インポートジョブをリストする</a></p></li></ul></li><li><p>バックアップ＆リストア操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">バックアップをリストする</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">バックアップを記述する</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">バックアップポリシーを取得する</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
     <td><ul><li><p>コレクション操作の一部</p><ul><li><p><a href="/reference/restful/describe-collection-v2">コレクションを記述する</a></p></li><li><p><a href="/reference/restful/get-collection-load-state-v2">コレクションのロード状態を取得する</a></p></li><li><p><a href="/reference/restful/get-collection-stats-v2">コレクションの統計情報を取得する</a></p></li><li><p><a href="/reference/restful/has-collection-v2">コレクションが存在するか確認する</a></p></li><li><p><a href="/reference/restful/list-collections-v2">コレクションをリストする</a></p></li></ul></li><li><p>インデックス操作の一部</p><ul><li><p><a href="/reference/restful/describe-index-v2">インデックスを記述する</a></p></li><li><p><a href="/reference/restful/list-indexes-v2">インデックスをリストする</a></p></li></ul></li><li><p>パーティション操作の一部</p><ul><li><p><a href="/reference/restful/get-partition-statistics-v2">パーティションの統計情報を取得する</a></p></li><li><p><a href="/reference/restful/has-partition-v2">パーティションが存在するか確認する</a></p></li><li><p><a href="/reference/restful/list-partitions-v2">パーティションをリストする</a></p></li></ul></li><li><p>エイリアス操作の一部</p><ul><li><p><a href="/reference/restful/describe-alias-v2">エイリアスを記述する</a></p></li><li><p><a href="/reference/restful/list-aliases-v2">エイリアスをリストする</a></p></li></ul></li><li><p>ベクトル操作の一部</p><ul><li><p><a href="/reference/restful/get-v2">取得する</a></p></li><li><p><a href="/reference/restful/hybrid-search-v2">ハイブリッド検索</a></p></li><li><p><a href="/reference/restful/query-v2">クエリ</a></p></li><li><p><a href="/reference/restful/search-v2">検索</a></p></li></ul></li></ul></td>
   </tr>
</table>

招待された受信者には、プロジェクトに参加するために48時間以内に承認する必要があるメール招待が届きます。または、ウェブコンソールから招待リンクをコピーして、招待者に共有することもできます。

ユーザーがプロジェクトに参加すると、そのプロジェクトが属する組織の組織メンバーに自動的に昇格します。

<Admonition type="info" icon="📘" title="Notes">

<p>毎回、同じ役割を持つ1人以上のユーザーをプロジェクトに招待できます。</p>

</Admonition>

## 招待を取り消すか再送する\{#revoke-or-resend-an-invitation}

既存の組織メンバーを同じ組織内のプロジェクトに招待すると、そのメンバーは個別の招待を受け取ることなく、自動的にプロジェクトへのアクセス権を得ます。ただし、まだ組織に属していない人をプロジェクトに招待すると、その人は組織に参加するための招待を受け取り、それによって指定されたプロジェクトへのアクセス権も付与されます。

![CKuxwsNxihJzNtbQ4fBc1xHRnxf](https://zdoc-images.s3.us-west-2.amazonaws.com/CKuxwsNxihJzNtbQ4fBc1xHRnxf.png)

招待を取り消すか再送するには、**組織オーナー**または**プロジェクト管理者**である必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>ユーザーが招待を承諾する前に、招待を取り消したり再送したりできます。</p>

</Admonition>

## コラボレーターの役割を編集する\{#edit-a-collaborators-role}

ユーザーが招待を承諾すると、そのユーザーはプロジェクトのコラボレーターになります。

コラボレーターの役割を編集するには、**組織オーナー**または**プロジェクト管理者**である必要があります。

![DCvMwB44UhQdXRbmxdUc493ynJb](https://zdoc-images.s3.us-west-2.amazonaws.com/DCvMwB44UhQdXRbmxdUc493ynJb.png)

## コラボレーターを削除する\{#remove-a-collaborator}

プロジェクトのコラボレーターを削除するには、**組織オーナー**または**プロジェクト管理者**である必要があります。

![HKpow0x7qheStnb0zcOcDlyunHc](https://zdoc-images.s3.us-west-2.amazonaws.com/HKpow0x7qheStnb0zcOcDlyunHc.png)

## プロジェクトを離れる\{#leave-a-project}

プロジェクトからコラボレーターを削除するだけでなく、自分でプロジェクトを離れることもできます。

![DTwiwN0AThgVZLb60dMcSblDnsb](https://zdoc-images.s3.us-west-2.amazonaws.com/DTwiwN0AThgVZLb60dMcSblDnsb.png)

プロジェクトには常に少なくとも1人のプロジェクト管理者がいる必要があるため、プロジェクトの唯一の管理者である場合は、プロジェクトを離れることはできません。

<Admonition type="caution" icon="🚧" title="Warning">

<p>プロジェクトを離れると、プロジェクトおよび関連リソースへのアクセスは取り消されます。</p>

</Admonition>