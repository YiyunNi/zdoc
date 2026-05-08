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

Zilliz Cloud では、直感的なジョブページを提供しており、同じプロジェクト内のすべての履歴および非同期データタスクを統合しています。

## プロジェクトジョブの表示\{#view-project-jobs}

プロジェクトを選択します。左側のナビゲーションペインで、**ジョブ** を選択します。表示されたページでは、実行中または実行済みのすべての非同期ジョブのリストを確認できます。

以下のジョブ情報が表示されます。

- タイプと説明: ジョブの目的と情報。このページには、特定のタイプのジョブがあります。

    <table>
       <tr>
         <th><p><strong>タイプ</strong></p></th>
         <th><p><strong>説明</strong></p></th>
       </tr>
       <tr>
         <td rowspan="3"><p><a href="./create-snapshot">バックアップ</a></p></td>
         <td><p>クラスタのバックアップファイルを作成する</p></td>
       </tr>
       <tr>
         <td><p>コレクションまたは指定したコレクションのバックアップファイルを作成する</p></td>
       </tr>
       <tr>
         <td><p>バックアップを指定したクラウドリージョンにコピーする</p></td>
       </tr>
       <tr>
         <td rowspan="2"><p><a href="./restore-from-snapshot">復元</a></p></td>
         <td><p>バックアップファイルからクラスタを復元する</p></td>
       </tr>
       <tr>
         <td><p>バックアップファイルからコレクションまたは複数のコレクションを復元する</p></td>
       </tr>
       <tr>
         <td><p><a href="./export-backup-files">バックアップファイルのエクスポート</a></p></td>
         <td><p>バックアップファイルを指定したオブジェクトストレージサービスにエクスポートする</p></td>
       </tr>
       <tr>
         <td><p><a href="./migrations">移行</a></p></td>
         <td><p>データをクラスタに移行する</p><ul><li><p>外部データ移行: </p><ul><li><p>Milvus から</p></li><li><p>Pinecone から</p></li><li><p>Qdrant から</p></li><li><p>Elasticsearch から</p></li><li><p>OpenSearch から</p></li><li><p>PostgreSQL から</p></li><li><p>Tencent Cloud VectorDB から</p></li></ul></li><li><p>Zilliz Cloud クラスタ間移行:</p><ul><li><p>同じ組織内でのクラスタ間移行</p></li><li><p>組織間でのクラスタ間移行</p></li></ul></li></ul></td>
       </tr>
       <tr>
         <td><p><a href="./data-import">インポート</a></p></td>
         <td><p>コレクションにデータをインポートする</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-collections-console#create-a-collection">コレクションのクローン</a></p></td>
         <td><p>スキーマとデータの両方を含むコレクションの完全なコピーを作成する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-collections-console#create-a-collection">サンプルコレクションの作成</a></p></td>
         <td><p>サンプルデータセットを読み込んだコレクションを作成する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-cluster#suspend">クラスタの一時停止</a></p></td>
         <td><p>クラスタを手動で一時停止する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-cluster#resume">クラスタの再開</a></p></td>
         <td><p>クラスタを手動で再開する</p></td>
       </tr>
       <tr>
         <td><p><a href="./scale-query-cu">クエリ CU のスケーリング</a></p></td>
         <td><p>クラスタのクエリ CU 数を増減する</p></td>
       </tr>
       <tr>
         <td><p><a href="./manage-replica">レプリカのスケーリング</a></p></td>
         <td><p>クラスタのレプリカ数を増減する</p></td>
       </tr>
    </table>

- ステータス: ジョブのステータス。成功、進行中、保留中、失敗、キャンセルのいずれかです。

- ID: データジョブの ID。データジョブに問題がある場合は、[サポートチケットを作成](http://support.zilliz.com) して、関連するジョブ ID を提供してください。

- 開始時刻と終了時刻

- 作成者: データジョブを開始したユーザー。

## ジョブ詳細の表示\{#view-job-details}

ジョブの詳細を表示するには、**アクション** 列の **...** をクリックし、**詳細の表示** を選択します。または、[Describe Job](/reference/restful/describe-job-v2) API を使用して、プログラムで詳細を取得することもできます。

![view_job_details](https://zdoc-images.s3.us-west-2.amazonaws.com/view_job_details.png "view_job_details")

## ジョブのキャンセル\{#cancel-job}

現在、**保留中** または **進行中** の状態にある以下のタイプのジョブのみをキャンセルできます。

- バックアップ作成ジョブ（他のクラウドリージョンへのバックアップコピーを除く）

- 移行ジョブ（ゼロダウンタイム移行を除く）

- バックアップファイルのエクスポートジョブ

<Admonition type="info" icon="📘" title="Notes">

ジョブをキャンセルするには、**組織オーナー** または **プロジェクト管理者** である必要があります。

</Admonition>

![cancel_job](https://zdoc-images.s3.us-west-2.amazonaws.com/cancel_job.png "cancel_job")

## 失敗したジョブの再試行\{#retry-failed-job}

<Admonition type="info" icon="📘" title="Notes">

現在、失敗したインポートジョブのみを再試行できます。

失敗したジョブを再試行するには、**組織オーナー** または **プロジェクト管理者** である必要があります。

</Admonition>

失敗したインポートジョブについては、ステータスの横にある情報アイコンをクリックして、ジョブが失敗した理由を確認できます。

インポートに失敗したファイルに調整を加えた場合は、ジョブを再試行できます。

![retry_failed_job](https://zdoc-images.s3.us-west-2.amazonaws.com/retry_failed_job.png "retry_failed_job")

