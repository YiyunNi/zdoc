---
title: "組織ユーザーの管理 | BYOC"
slug: /organization-users
sidebar_key: organization-users
sidebar_label: "組織ユーザー"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、組織は通常企業を表します。従業員を組織に招待し、職務に基づいてロールを割り当てることができます。これらのロールは、ユーザーが特定のリソースにアクセスできるかどうか、および実行できる操作を決定します。たとえば、開発者は通常データへのアクセスが必要ですが、請求権限は必要としません。 | BYOC"
type: origin
token: OzLjwMmWliJdEBkz0gPcVZrqnZb
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - 組織
  - ユーザー

---

import Admonition from '@theme/Admonition';


# 組織ユーザーの管理

Zilliz Cloud では、組織は通常企業を表します。従業員を組織に招待し、職務に基づいてロールを割り当てることができます。これらのロールは、ユーザーが特定のリソースにアクセスできるかどうか、および実行できる操作を決定します。例えば、開発者は通常データへのアクセスが必要ですが、請求権限は必要ありません。

このガイドでは、組織へのユーザーの招待、招待の取り消しまたは再送信、組織ユーザーのロールの変更、組織ユーザーの削除など、組織ユーザーの管理方法について説明します。

## 組織へのユーザーの招待\{#invite-a-user-to-your-organization}

組織にユーザーを招待する際、組織内のリソースへのアクセスと特定の操作を実行する権限を定義するロールを割り当てる必要があります。

ユーザーを招待するには、招待したいユーザーのメールアドレスを入力します。次に、新しい組織ユーザーに付与する組織ロールを選択します。

### 組織オーナー\{#organization-owner}

組織オーナーは Zilliz Cloud の最上位ロールであり、組織とそのすべてのリソース（プロジェクト、クラスター、データベース、コレクション）を管理する完全な権限を持ちます。このロールは、組織内の限られた数のユーザーにのみ付与されるべきです。

次の表に、この組織ロールに対応する UI と API の権限を示します。

<table>
   <tr>
     <th><p><strong>UI 権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p>組織内のすべてのプロジェクトを管理</p></li><li><p><a href="./manage-api-keys">API キー</a>を管理</p></li><li><p><a href="./organization-users">組織ユーザー</a>を管理</p></li><li><p><a href="./metrics-and-alerts">アラート</a>を管理</p></li><li><p><a href="./view-activities">アクティビティ</a>を表示</p></li><li><p><a href="./organization-settings">組織設定</a>を管理</p></li><li><p><a href="./use-recycle-bin">ごみ箱</a>を使用</p></li><li><p>さらに、<a href="./project-users#project-admin">プロジェクト管理者</a>および<a href="./cluster-roles#built-in-cluster-roles">クラスター管理者</a>ロールのすべての権限</p></li></ul></td>
     <td><p><a href="/reference/restful/control-plane-v2">すべてのコントロールプレーン操作</a></p></td>
     <td><p><a href="/reference/restful/data-plane-v2">すべてのデータプレーン操作</a></p></td>
   </tr>
</table>

<Admonition type="info" icon="📘" title="Notes">

<p>データプレーン RESTful API エンドポイントを呼び出す際、認証トークンとして、対象クラスターのコロン区切りのユーザー名とパスワード（<code>username:password</code>）を使用してください。</p>

</Admonition>

### 組織の請求管理者\{#organization-billing-admin}

組織の請求管理者ロールは、組織内の請求を管理する権限を持ちます。このロールには、組織内の他のデータに対する権限はありません。

次の表に、この組織ロールに対応する UI と API の権限を示します。

<table>
   <tr>
     <th><p><strong>UI 権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p><a href="./manage-api-keys">API キー</a>を表示</p></li><li><p><a href="./organization-users">組織ユーザー</a>を招待</p></li><li><p><a href="./organization-settings">組織設定</a>を表示</p></li></ul></td>
     <td><ul><li><a href="/reference/restful/query-daily-usage-v2">日次使用量の照会</a></li></ul></td>
     <td><p>データプレーンの権限は、プロジェクトおよびクラスターのロールによって決定されます。ただし、請求管理者は通常、データプレーンの権限を必要としません。</p></td>
   </tr>
</table>

### 組織ロール\{#organization-role}

招待受信者に対して組織ロールを作成できます。組織ロールは、組織とそのリソースを表示する権限を持つロールです。このロールに対して、プロジェクトレベルおよびクラスターレベルの権限を編集できます。

![Cb5Yw6EWNhdqD5bjxTRcHHF1nAd](https://zdoc-images.s3.us-west-2.amazonaws.com/Cb5Yw6EWNhdqD5bjxTRcHHF1nAd.png)

#### プロジェクト権限のカスタマイズ\{#customize-project-privileges}

デフォルトでは、招待受信者には **Default Project** への **プロジェクト管理者** アクセス権が付与されます。ただし、**カスタマイズ** を選択してきめ細かい権限を付与することもできます。

![PW5EwJqDphpZZKbUiaBcxnbUngg](https://zdoc-images.s3.us-west-2.amazonaws.com/PW5EwJqDphpZZKbUiaBcxnbUngg.png)

デフォルトでは、**すべてのクラスター** へのアクセスが付与され、**将来のすべてのクラスターを含める** オプションが有効になっています。**読み書き** などのロールを割り当てて、これらのクラスター全体での招待されたユーザーの権限を定義できます。招待が承諾されると、ユーザーはプロジェクト内のすべての現在および将来のクラスターに対して指定された権限を持ちます。

アクセスを制限するには、ドロップダウンから特定のクラスターを選択します。また、**将来のすべてのクラスターを含める** オプションを無効にして、新しく作成されたクラスターをアクセス範囲から除外することもできます。

**+ クラスターアクセス** をクリックして、さらにクラスターアクセスポリシーを追加します。

次の表に、このロールに対して組織レベルで招待者に付与される UI と API の権限を示します。

<table>
   <tr>
     <th><p><strong>UI 権限</strong></p></th>
     <th><p><strong>コントロールプレーン RESTful API (V2) 権限</strong></p></th>
     <th><p><strong>データプレーン RESTful API (V2) 権限</strong></p></th>
   </tr>
   <tr>
     <td><ul><li><p><a href="./manage-api-keys">API キー</a>を表示</p></li><li><p><a href="./organization-users">組織ユーザー</a>を招待</p></li><li><p><a href="./organization-settings">組織設定</a>を表示</p></li></ul></td>
     <td><ul><li><p><a href="/reference/restful/cloud-meta-v2">すべてのクラウドメタ操作</a></p></li><li><p>クラスター操作の一部</p><ul><li><p><a href="/reference/restful/list-projects-v2">プロジェクトの一覧表示</a></p></li><li><p><a href="/reference/restful/list-clusters-v2">クラスターの一覧表示</a></p></li><li><p><a href="/reference/restful/describe-cluster-v2">クラスターの詳細表示</a></p></li><li><p><a href="/reference/restful/query-cluster-metrics-v2">クラスターメトリクスの照会</a></p></li><li><p><a href="/docs/prometheus-monitoring">メトリクスのエクスポート</a></p></li></ul></li><li><p>インポート操作の一部</p><ul><li><p><a href="/reference/restful/get-import-job-progress-v2">インポートジョブの進捗取得</a></p></li><li><p><a href="/reference/restful/list-import-jobs-v2">インポートジョブの一覧表示</a></p></li></ul></li><li><p>バックアップと復元操作の一部</p><ul><li><p><a href="/reference/restful/list-backups-v2">バックアップの一覧表示</a></p></li><li><p><a href="/reference/restful/describe-backup-v2">バックアップの詳細表示</a></p></li><li><p><a href="/reference/restful/get-backup-policy-v2">バックアップポリシーの取得</a></p></li></ul></li><li><p><a href="/reference/restful/cloud-job-v2">すべてのクラウドジョブ操作</a></p></li></ul></td>
     <td><p>データプレーンの権限は、<a href="./project-users#invite-a-user-to-a-project">プロジェクト</a>および<a href="./cluster-roles">クラスター</a>のロールによって決定されます</p></td>
   </tr>
</table>

**組織メンバー** または **組織の請求管理者** の場合、招待受信者に付与できるロールは **組織メンバー** のみであることに注意してください。

招待受信者には、組織に参加するために 48 時間以内に承諾する必要がある招待メールが送信されます。または、Web コンソールから招待リンクをコピーして、招待者と共有することもできます。

<Admonition type="info" icon="📘" title="Notes">

<p>一度に、同じロールを持つ 1 人以上のユーザーを組織に招待できます。各組織には最大 100 人のユーザーを含めることができます。</p>

</Admonition>

## 招待の取り消しまたは再送信\{#revoke-or-resend-an-invitation}

ユーザーに組織への参加を招待すると、Zilliz Cloud はユーザーに招待メールを送信します。ユーザーが承諾する前に、招待を取り消したり再送信したりすることができます。

![NDXHw6PVFhyxntbucxbc9SOFnLg](https://zdoc-images.s3.us-west-2.amazonaws.com/NDXHw6PVFhyxntbucxbc9SOFnLg.png)

## 組織ユーザーのロールの編集\{#edit-the-role-of-an-organization-user}

ユーザーが招待を承諾して組織に参加すると、必要に応じてロールを調整できます。

組織ユーザーのロールを編集するには、**組織オーナー** である必要があります。

![VGxOwarfShUDk1bIoEpc5wf3nFf](https://zdoc-images.s3.us-west-2.amazonaws.com/VGxOwarfShUDk1bIoEpc5wf3nFf.png)

## 組織ユーザーの削除\{#remove-an-organization-user}

ユーザーが組織に所属しなくなった場合、そのユーザーを削除できます。

組織ユーザーを削除するには、**組織オーナー** である必要があります。

<Admonition type="info" icon="📘" title="Notes">

<p>メンバーを削除すると、対応する個人 API キーは直ちに失効し、アクセスが拒否されます。サービスの中断を防ぐため、環境で使用されている個人キーは削除前に必ず置き換えてください。この操作は元に戻せません。</p>

</Admonition>

![C6O0wzlfRhmxQwbt7yccX3VHn3g](https://zdoc-images.s3.us-west-2.amazonaws.com/C6O0wzlfRhmxQwbt7yccX3VHn3g.png)

## 組織の脱退\{#leave-an-organization}

組織に所属しなくなった場合、脱退するオプションがあります。

各組織には少なくとも 1 人の組織オーナーが必要です。組織の唯一のオーナーである場合、脱退することはできません。

<Admonition type="caution" icon="🚧" title="Warning">

<p>組織を脱退すると、組織および関連リソースにアクセスできなくなります。</p>

</Admonition>

![SeD6w1FHxhgrbHbjSCQc1eZ3nP9](https://zdoc-images.s3.us-west-2.amazonaws.com/SeD6w1FHxhgrbHbjSCQc1eZ3nP9.png)

