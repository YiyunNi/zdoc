---
title: "スナップショット | Cloud"
slug: /snapshots
sidebar_key: snapshots
sidebar_label: "スナップショット"
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
beta: PRIVATE
notebook: FALSE
description: "スナップショットは Milvus コレクションの特定時点イメージで、迅速なロールバック、バージョン管理、テストに適しています。特定のタイムスタンプ時点の状態を保持し、効率的な保存と復元のために、スキーマ、インデックス、ベクターデータファイル（binlog）などのメタデータとマニフェストファイルのみを保存します。 | Cloud"
type: origin
token: XC1ow3jGBi7hVvkINtBcXhQ6n8g
sidebar_position: 12
keywords: 
  - zilliz
  - vector database
  - cloud
  - snapshot
  - restore
  - backup

---

import Admonition from '@theme/Admonition';


# スナップショット

スナップショットは Milvus コレクションの特定時点イメージで、迅速なロールバック、バージョン管理、テストに適しています。特定のタイムスタンプ時点のコレクション状態を保持し、効率的な保存と復元のために、スキーマ、インデックス、ベクターデータファイル（binlog）などのメタデータとマニフェストファイルのみを保存します。 

<Admonition type="info" icon="📘" title="注意">

<p>スナップショットは、短期間（<strong>数日〜数週間</strong>）の高速ロールバックやテスト向けの特定時点イメージです。一方バックアップは、長期的な障害復旧（<strong>数週間〜数年</strong>）と、ストレージ全損に対するより高い保護のために、別領域に保存される独立した完全コピーです。</p>
<p>バックアップの作成については、<a href="./backup-and-restore">Backup & Restore</a> を参照してください。</p>

</Admonition>

## スナップショットの構成\{#snapshot-anatomy}

Milvus は、実際のベクターデータを複製せずに、効率的な特定時点の取得・保存・復元を実現するため、マニフェストベースのスナップショットアーキテクチャを採用しています。このアーキテクチャはメタデータ管理と物理データ保存を分離し、オブジェクトストレージ上の既存セグメントファイルを参照する軽量なスナップショットを実現します。

コレクションのスナップショットを作成する際、Milvus は次の情報を収集します。

- **スナップショットメタデータ**

    スナップショット作成に必要な基本情報（スナップショット名と説明、対象コレクション ID、スナップショット作成時点）を提供します。

- **コレクション記述**

    対象コレクションの記述情報（スキーマ定義、パーティション情報、プロパティ）を含みます。

- **インデックス情報**

    インデックスのメタデータとインデックスファイルへのパスを保存します。

- **セグメントデータ**

    ベクターデータファイル（binlog）、削除ログ（deltalog）、インデックスファイルを保持します。

上記情報のうち、Milvus は各セグメントに対して Apache Avro 形式のマニフェストファイルを生成し、スナップショットメタデータ、コレクション記述、インデックス情報、マニフェストファイルへのパスを JSON ファイルに保存します。以下の図はスナップショットフォルダの構成を示します。

```python
snapshots/{collection_id}/
├── metadata/
│   └── {snapshot_id}.json         # Snapshot metadata (JSON format)
│
└── manifests/
    └── {snapshot_id}/             # Directory for each snapshot
        ├── {segment_id_1}.avro    # Individual segment manifest (Avro format)
        ├── {segment_id_2}.avro
        └── ...
```

スナップショットの作成は通常ミリ秒単位で完了し、復元はデータ量に応じて数秒〜数分かかります。 

## ストレージへの影響と考慮事項\{#storage-impacts-and-considerations}

Milvus がスナップショット内でセグメントやインデックスファイルを参照すると、スナップショットを削除するまでそれらのファイルはガベージコレクションされません。スナップショットは対象コレクションのサイズに応じたストレージを消費し、保持期間に応じてオブジェクトストレージの費用が発生します。極端な場合、1 つのスナップショットでオブジェクトストレージ費用が 2 倍になることもあります。以下を推奨します。

- ストレージ節約のため、古いスナップショットを定期的に削除する。

- 将来参照しやすいように、分かりやすい名前と説明を付ける。

- スナップショット作成と復元の結果を必ず確認する。

- スナップショット作成時刻とストレージ使用量を追跡する。

- 監視とトラブルシューティングのために復元ジョブ ID を記録する。

## 制限事項\{#limits-and-restrictions}

- スナップショットは作成後に不変になります。

- スナップショットは元コレクションと同じクラスター内の新規コレクションにのみ復元できます。

- 復元されたコレクションは、同じスキーマ、シャード数、パーティション数を保持します。

- 過去データの復元は TTL ポリシーと競合する可能性があります。スナップショット作成前に TTL を無効化するか設定を調整することを推奨します。

## 関連ドキュメント\{#further-readings}

import DocCardList from '@theme/DocCardList';

<DocCardList />