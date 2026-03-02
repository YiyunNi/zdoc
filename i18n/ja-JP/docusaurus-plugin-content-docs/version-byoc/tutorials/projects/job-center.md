---
title: "プロジェクトジョブの管理 | BYOC"
slug: /job-center
sidebar_label: "プロジェクトジョブ"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloudは、同じプロジェクト内のすべての履歴データタスクと非同期データタスクを統合する直感的なジョブページを提供します。 | BYOC"
type: origin
token: RY8ww0NDQi8yU9kNpjicHP7Gn4b
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - クラウド
  - プロジェクトジョブ
  - hnswアルゴリズム
  - ベクトル類似性検索
  - 近似最近傍探索
  - DiskANN

---

import Admonition from '@theme/Admonition';


# プロジェクトジョブの管理

Zilliz Cloudは、同じプロジェクト内のすべての履歴データタスクと非同期データタスクを統合する直感的なジョブページを提供します。

## プロジェクトジョブの表示{#view-project-jobs}

プロジェクトを選択します。左側のナビゲーションペインで、**Jobs**を選択します。表示されたページには、実行中または実行済みのすべての非同期ジョブのリストが表示されます。

以下のジョブ情報が表示されます。

- タイプと説明: ジョブの目的と情報。このページには特定の種類のジョブがあります。

    <table>
       <tr>
         <th><p><strong>タイプ</strong></p></th>
         <th><p><strong>説明</strong></p></th>
       </tr>
       <tr>
         <td rowspan="3"><p><a href="./create-snapshot">バックアップ</a></p></td>
         <td><p>クラスターのバックアップファイルを作成する</p></td>
       </tr>
       <tr>
         <td><p>コレクションまたは指定されたコレクションのバックアップファイルを作成する</p></td>
       </tr>
       <tr>
         <td><p>指定されたクラウドリージョンにバックアップをコピーする</p></td>
       </tr>
       <tr>
         <td rowspan="2"><p><a href="./restore-from-snapshot">復元</a></p></td>
         <td><p>バックアップファイルからクラスターを復元する</p></td>
       </tr>
       <tr>
         <td><p>バックアップファイルからコレクションまたは複数のコレクションを復元する</p></td>
       </tr>
       <tr>
         <td><p><a href="./export-backup-files">バックアップファイルのエクスポート</a></p></td>
         <td><p>バックアップファイルを指定されたオブジェクトストレージサービスにエクスポートする</p></td>
       </tr>
       <tr>
         <td><p><a href="./migrations">移行</a></p></td>
         <td><p>データをクラスターに移行する。</p><ul><li><p>外部データ移行: </p><ul><li><p>Milvusから</p></li><li><p>Pineconeから</p></li><li><p>Qdrantから</p></li><li><p>Elasticsearchから</p></li><li><p>OpenSearchから</p></li><li><p>PostgreSQLから</p></li><li><p>Tencent Cloud VectorDBから</p></li></ul></li><li><p>Zilliz Cloudクラスター間移行:</p><ul><li><p>同じ組織内のクラスター間移行</p></li><li><p>組織間のクラスター間移行</p></li></ul></li></ul></td>
       </tr>
       <tr>
         <td><p><a href="./data-import">インポート</a></p></td>
         <td><p>データをコレクションにインポートする</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-collections-console#create-collection">コレクションのクローン</a></p></td>
         <td><p>スキーマとデータの両方を含むコレクションの完全なコピーを作成する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-collections-console#create-collection">サンプルコレクションの作成</a></p></td>
         <td><p>サンプルデータセットがロードされたコレクションを作成する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-cluster#suspend-cluster">クラスターの一時停止</a></p></td>
         <td><p>クラスターを手動で一時停止する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-cluster#resume-cluster">クラスターの再開</a></p></td>
         <td><p>クラスターを手動で再開する</p></td>
       </tr>
       <tr>
         <td><p><a href="./scale-query-cu">クエリCUのスケーリング</a></p></td>
         <td><p>クラスターのクエリCUの数を増減する。</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-replica">レプリカのスケーリング</a></p></td>
         <td><p>クラスターのレプリカの数を増減する。</p></td>
       </tr>
    </table>

- ステータス: ジョブのステータス。Successful、In Progress、Pending、Failed、Canceledのいずれかです。

- ID: データジョブのID。データジョブに関する問題が発生した場合は、[サポートチケットを作成](http://support.zilliz.com)し、関連するジョブIDを提供してください。

- 開始時刻と終了時刻

- 作成者: データジョブを開始したユーザー。

## ジョブの詳細を表示{#view-job-details}

ジョブの詳細を表示するには、**Actions**列の**...**をクリックし、**View Details**を選択します。または、[Describe Job](/reference/restful/describe-job-v2) APIを使用してプログラムで詳細を取得することもできます。

![view_job_details](https://zdoc-images.s3.us-west-2.amazonaws.com/view_job_details.png "view_job_details")

## ジョブのキャンセル{#cancel-job}

現在、**Pending**または**In Progress**状態の以下の種類のジョブのみをキャンセルできます。

- バックアップジョブの作成（他のクラウドリージョンへのバックアップのコピーを除く）

- 移行ジョブ（ゼロダウンタイム移行を除く）

- バックアップファイルのエクスポートジョブ

<Admonition type="info" icon="📘" title="Notes">

<p>ジョブをキャンセルするには、<strong>Organization Owner</strong>または<strong>Project Admin</strong>である必要があります。</p>

</Admonition>

![cancel_job](https://zdoc-images.s3.us-west-2.amazonaws.com/cancel_job.png "cancel_job")

## 失敗したジョブの再試行{#retry-failed-job}

<Admonition type="info" icon="📘" title="Notes">

<p>現在、失敗したインポートジョブのみを再試行できます。</p>
<p>失敗したジョブを再試行するには、<strong>Organization Owner</strong>または<strong>Project Admin</strong>である必要があります。</p>

</Admonition>

失敗したインポートジョブの場合、ステータスの横にある情報アイコンをクリックして、ジョブが失敗した理由を確認できます。

インポートに失敗したファイルを調整した場合は、ジョブを再試行できます。

![retry_failed_job](https://zdoc-images.s3.us-west-2.amazonaws.com/retry_failed_job.png "retry_failed_job")

