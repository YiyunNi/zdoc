---
title: "プロジェクトジョブの管理 | Cloud"
slug: /job-center
sidebar_key: job-center
sidebar_label: "プロジェクトジョブ"
beta: FALSE
notebook: FALSE
description: "Zilliz Cloud では、直感的なジョブページを提供しており、同じプロジェクト内のすべての履歴および非同期データタスクを統合して管理できます。"
type: origin
token: RY8ww0NDQi8yU9kNpjicHP7Gn4b
sidebar_position: 3
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - プロジェクトジョブ

---

import Admonition from '@theme/Admonition';


# プロジェクトジョブの管理

Zilliz Cloud では、直感的な ジョブ ページを提供しており、同じプロジェクト内のすべての履歴および非同期データタスクを統合しています。

## プロジェクトジョブの表示\{#view-project-jobs}

プロジェクトを選択します。左側のナビゲーションペインで、**ジョブ** を選択します。表示されたページでは、実行中または実行済みのすべての非同期ジョブのリストを確認できます。

以下のジョブ情報が表示されます。

- Type and Description: ジョブの目的と情報。このページには、特定のタイプのジョブがあります。

    <table>
       <tr>
         <th><p><strong>Type</strong></p></th>
         <th><p><strong>Explanation</strong></p></th>
       </tr>
       <tr>
         <td rowspan="3"><p><a href="./create-backup">Backup</a></p></td>
         <td><p>クラスタのバックアップファイルを作成する</p></td>
       </tr>
       <tr>
         <td><p>コレクションまたは指定されたコレクションのバックアップファイルを作成する</p></td>
       </tr>
       <tr>
         <td><p>バックアップを指定されたクラウドリージョンにコピーする</p></td>
       </tr>
       <tr>
         <td rowspan="2"><p><a href="./restore-from-backup-files">Restore</a></p></td>
         <td><p>バックアップファイルからクラスタを復元する</p></td>
       </tr>
       <tr>
         <td><p>バックアップファイルからコレクションまたは複数のコレクションを復元する</p></td>
       </tr>
       <tr>
         <td><p><a href="./export-backup-files">Export Backup File</a></p></td>
         <td><p>バックアップファイルを指定されたオブジェクトストレージサービスにエクスポートする</p></td>
       </tr>
       <tr>
         <td><p><a href="./migrations">Migration</a></p></td>
         <td><p>データをクラスタに移行する</p><ul><li><p>External データ Migration: </p><ul><li><p>From Milvus</p></li><li><p>From Pinecone</p></li><li><p>From Qdrant</p></li><li><p>From Elasticsearch</p></li><li><p>From OpenSearch</p></li><li><p>From PostgreSQL</p></li><li><p>From Tencent Cloud VectorDB</p></li></ul></li><li><p>Zilliz Cloud Cross-cluster migration:</p><ul><li><p>同一組織内でのクロスクラスタ移行</p></li><li><p>組織間でのクラスタ間移行</p></li></ul></li></ul></td>
       </tr>
       <tr>
         <td><p><a href="./data-import">Import</a></p></td>
         <td><p>コレクションにデータをインポートする</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-collections-console#create-a-collection">クローン Collection</a></p></td>
         <td><p>スキーマとデータの両方を含むコレクションの完全なコピーを作成する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-collections-console#create-a-collection">Create Sample Collection</a></p></td>
         <td><p>サンプルデータセットを読み込んだコレクションを作成する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-cluster#suspend">一時停止 Cluster</a></p></td>
         <td><p>クラスタを手動で一時停止する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-cluster#resume">Resume Cluster</a></p></td>
         <td><p>クラスタを手動で再開する</p></td>
       </tr>
       <tr>
         <td><p><a href="./scale-query-cu">Scale Query CU</a></p></td>
         <td><p>クラスタのクエリ CU 数を増減する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-replica">Scale Replica</a></p></td>
         <td><p>クラスタのレプリカ数を増減する</p></td>
       </tr>
    </table>

- Status: ジョブのステータス。成功、進行中、Pending、Failed、Canceled のいずれかです。

- ID: データジョブの ID。データジョブに問題がある場合は、[サポートチケットを作成](http://support.zilliz.com) して、関連するジョブ ID を提供してください。

- Start Time & End Time

- Created By: データジョブを開始したユーザー。

## ジョブ詳細の表示\{#view-job-details}

ジョブの詳細を表示するには、**Actions** 列の **...** をクリックし、**View Details** を選択します。または、[Describe Job](/reference/restful/describe-job-v2) API を使用して、プログラムで詳細を取得することもできます。

![view_job_details](https://zdoc-images.s3.us-west-2.amazonaws.com/view_job_details.png "view_job_details")

## ジョブのキャンセル\{#cancel-job}

現在、**Pending** または **進行中** の状態にある以下のタイプのジョブのみキャンセルできます。

- バックアップ作成ジョブ（他のクラウドリージョンへのバックアップコピーを除く）

- 移行ジョブ（ゼロダウンタイム移行を除く）

- バックアップファイルのエクスポートジョブ

<Admonition type="info" icon="📘" title="Notes">

ジョブをキャンセルするには、**組織オーナー** または **プロジェクト管理者** である必要があります。

</Admonition>

![cancel_job](https://zdoc-images.s3.us-west-2.amazonaws.com/cancel_job.png "cancel_job")

## 失敗したジョブの再試行\{#retry-failed-job}

<Admonition type="info" icon="📘" title="Notes">

現在、失敗したインポートジョブのみ再試行できます。

失敗したジョブを再試行するには、**組織オーナー** または **プロジェクト管理者** である必要があります。

</Admonition>

失敗したインポートジョブについては、ステータス横の情報アイコンをクリックして、ジョブが失敗した理由を確認できます。

インポートに失敗したファイルに調整を加えた場合は、ジョブを再試行できます。

![retry_failed_job](https://zdoc-images.s3.us-west-2.amazonaws.com/retry_failed_job.png "retry_failed_job")

