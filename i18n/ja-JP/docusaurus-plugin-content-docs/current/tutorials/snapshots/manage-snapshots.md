---
title: "スナップショットの管理 | Cloud"
slug: /manage-snapshots
sidebar_key: manage-snapshots
sidebar_label: "スナップショットを管理"
beta: PRIVATE
notebook: FALSE
description: "このガイドでは、スナップショットの作成と管理方法について説明します。"
type: origin
token: J0jDwYQb8il1biknRo4cazHPn5d
sidebar_position: 1
keywords: 
  - zilliz
  - ベクトルデータベース
  - cloud
  - スナップショット
  - 復元
  - バックアップ

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# スナップショットの管理

このガイドでは、スナップショットの作成と管理方法について説明します。具体的には以下の内容を含みます。

- [スナップショットの作成](./snapshots)
- [スナップショットの一覧表示](./snapshots)
- [スナップショットの詳細確認](./snapshots)
- [スナップショットのピン留め/ピン留め解除](./manage-snapshots#pinunpin-snapshot-data)
- [スナップショットの復元](./snapshots)
- [スナップショットの削除](./snapshots)
- [復元ジョブの一覧表示](./manage-snapshots#list-restoration-jobs)
- [復元状態の取得](./manage-snapshots#get-restoration-state)

## スナップショットの作成\{#create-snapshot}

スナップショットを作成する前に、対象コレクションへのデータ書き込みを停止し、データ損失を防ぐために `flush()` を呼び出すことを推奨します。

<Admonition type="info" icon="📘" title="Notes">

`flush()` の呼び出しは必須ではありませんが、データ損失を防ぐため強く推奨されます。この手順をスキップした場合、スナップショットには既にフラッシュ済みのデータのみが含まれます。

</Admonition>

スナップショットに名前を付ける際は、`"daily_backup_20240101"` や `"v2.1_production_release"` のように明確で説明的な名前を使用し、`"backup1"` や `"test"` のような一般的な用語は避けてください。スナップショット名は、バージョン、環境、ステージ間でスナップショットを区別できるよう、適切に使用してください。

以下のコード例では、`my_collection` という名前のコレクションが既に存在することを前提としています。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

# Recommended: Flush data before creating snapshot to ensure all data is included
client.flush(collection_name="my_collection")

# Create snapshot for entire collection
client.create_snapshot(
    collection_name="my_collection",
    snapshot_name="backup_20240101",
    description="Daily backup for January 1st, 2024"
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```go
import (
    "context"
    "github.com/milvus-io/milvus/client/v2/milvusclient"
)

client, err := milvusclient.New(context.Background(), &milvusclient.ClientConfig{
    Address: "YOUR_CLUSTER_ENDPOINT",
    Token: "YOUR_CLUSTER_TOKEN",
})

// Recommended: Flush data before creating snapshot to ensure all data is included
err = client.Flush(context.Background(), milvusclient.NewFlushOption("my_collection"))
if err != nil {
    log.Fatal(err)
}

// Create snapshot
createOpt := milvusclient.NewCreateSnapshotOption("backup_20240101", "my_collection").
    WithDescription("Daily backup for January 1st, 2024")

err = client.CreateSnapshot(context.Background(), createOpt)
```

</TabItem>

<TabItem value='java'>

```javascript
// node.js
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

## スナップショットの一覧表示\{#list-snapshots}

既存のスナップショットの名前を一覧表示できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# List all snapshots for a collection
snapshots = client.list_snapshots(
    collection_name="my_collection"
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```go
// List snapshots for collection
listOpt := milvusclient.NewListSnapshotsOption().
    WithCollectionName("my_collection")

snapshots, err := client.ListSnapshots(context.Background(), listOpt)
```

</TabItem>

<TabItem value='java'>

```javascript
// node.js
```

</TabItem>

<TabItem value='java'>

```bash
# bash
```

</TabItem>
</Tabs>

## Describe snapshot\{#describe-snapshot}

特定のスナップショットの詳細情報を取得できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
snapshot_info = client.describe_snapshot(
    snapshot_name="backup_20240101",
    include_collection_info=True
)

print(f"Snapshot ID: {snapshot_info.id}")
print(f"Collection: {snapshot_info.collection_name}")
print(f"Created: {snapshot_info.create_ts}")
print(f"Description: {snapshot_info.description}")
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```go
describeOpt := milvusclient.NewDescribeSnapshotOption("backup_20240101")
resp, err := client.DescribeSnapshot(context.Background(), describeOpt)

fmt.Printf("Snapshot ID: %d\n", resp.GetSnapshotInfo().GetId())
fmt.Printf("Collection: %s\n", resp.GetSnapshotInfo().GetCollectionName())
```

</TabItem>

<TabItem value='java'>

```javascript
// node.js
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

## スナップショットデータのピン留め/ピン留め解除\{#pinunpin-snapshot-data}

復元中に、スナップショットをピン留めして、その基盤となるデータがガベージコレクションから一時的に保護されるようにしたり、ピン留めを解除してデータを解放したりすることができます。

また、ピン操作に対して存続期間（TTL）を設定することもできます。これにより、設定した期間が経過するとピン留めされたデータが自動的に解放されます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
pin_id = client.pin_snapshot_data(
    snapshot_name="backup_20240101",
    collection_name="my_collection",
    ttl_seconds=3600,
)

client.unpin_snapshot_data(
    pin_id=pin_id
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```go
pinID, err := cli.PinSnapshotData(
    ctx,
    client.NewPinSnapshotDataOption("backup_20240101", "my_collection").WithTTLSeconds(3600),
)

if err != nil {
    return err
}

defer func() {
    _ = cli.UnpinSnapshotData(ctx, client.NewUnpinSnapshotDataOption(pinID))
}()

// do work with pinned snapshot data
```

</TabItem>

<TabItem value='java'>

```javascript
// node.js
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

## スナップショットの復元\{#restore-snapshot}

スナップショットを新しいコレクションに復元できます。この操作は非同期で、復元の進行状況を追跡するためのジョブ ID が返されます。

復元は、データインポートではなく **コピーセグメント** メカニズムを使用します。これにより、以下の理由でより効率的になります。

- スナップショットストレージからセグメントファイル（binlog、deltalog、インデックスファイル）を直接コピーする

- フィールド ID とインデックス ID を保持し、既存のデータファイルとの互換性を確保する

- データの書き換えやインデックスの再構築を回避し、復元時間を大幅に短縮する

- 従来のバックアップおよび復元方法と比較して、10 倍から 100 倍のパフォーマンス向上を実現する

スナップショットを復元するには、以下の手順を実行します。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# Restore snapshot to new collection
job_id = client.restore_snapshot(
    snapshot_name="backup_20240101",
    collection_name="restored_collection",
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```go
restoreOpt := milvusclient.NewRestoreSnapshotOption(
    "backup_20240101", 
    "restored_collection"
)

jobID, err := client.RestoreSnapshot(context.Background(), restoreOpt)
if err != nil {
    log.Fatal(err)
}
```

</TabItem>

<TabItem value='java'>

```javascript
// node.js
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

復元ジョブの進行状況の監視について詳しくは、[復元の進行状況を監視する](./snapshots) を参照してください。

## Drop snapshot\{#drop-snapshot}

スナップショットが不要になった場合は、削除することができます。ストレージを節約するため、古いスナップショットは定期的に削除することをお勧めします。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.drop_snapshot(
    snapshot_name="backup_20240101"
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```go
dropOpt := milvusclient.NewDropSnapshotOption("backup_20240101")
err := client.DropSnapshot(context.Background(), dropOpt)
```

</TabItem>

<TabItem value='java'>

```javascript
// node.js
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

## リストアジョブの一覧表示\{#list-restoration-jobs}

この API を使用して、対象コレクションに対して既に作成されたスナップショットのリストを取得できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# List all restore jobs
jobs = client.list_restore_snapshot_jobs()

for job in jobs:
    print(f"Job {job.job_id}: {job.snapshot_name} -> Collection {job.collection_id}")
    print(f"  State: {job.state}, Progress: {job.progress}%")

# List restore jobs for a specific collection
jobs = client.list_restore_snapshot_jobs(collection_name="my_collection")
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```go
// List all restore jobs
listOpt := milvusclient.NewListRestoreSnapshotJobsOption()
jobs, err := client.ListRestoreSnapshotJobs(context.Background(), listOpt)
if err != nil {
    log.Fatal(err)
}

for _, job := range jobs {
    fmt.Printf("Job %d: %s -> Collection %d\n", 
        job.GetJobId(), job.GetSnapshotName(), job.GetCollectionId())
    fmt.Printf("  State: %s, Progress: %d%%\n", 
        job.GetState(), job.GetProgress())
}

// List restore jobs for a specific collection
listOpt = milvusclient.NewListRestoreSnapshotJobsOption().
    WithCollectionName("my_collection")
jobs, err = client.ListRestoreSnapshotJobs(context.Background(), listOpt)
```

</TabItem>

<TabItem value='java'>

```javascript
// node.js
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

## 復元状態の取得\{#get-restoration-state}

復元ジョブ ID を取得したら、それを使用して復元の進行状況を取得できます。

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"Go","value":"go"},{"label":"NodeJS","value":"javascript"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
state = client.get_restore_snapshot_state(job_id=12345)

print(f"Job ID: {state.job_id}")
print(f"Snapshot Name: {state.snapshot_name}")
print(f"Collection ID: {state.collection_id}")
print(f"State: {state.state}")
print(f"Progress: {state.progress}%")
if state.state == "RestoreSnapshotFailed":
    print(f"Failure Reason: {state.reason}")
print(f"Time Cost: {state.time_cost}ms")
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='java'>

```go
stateOpt := milvusclient.NewGetRestoreSnapshotStateOption(12345)
state, err := client.GetRestoreSnapshotState(context.Background(), stateOpt)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Job ID: %d\n", state.GetJobId())
fmt.Printf("Snapshot Name: %s\n", state.GetSnapshotName())
fmt.Printf("Collection ID: %d\n", state.GetCollectionId())
fmt.Printf("State: %s\n", state.GetState())
fmt.Printf("Progress: %d%%\n", state.GetProgress())
if state.GetState() == milvuspb.RestoreSnapshotState_RestoreSnapshotFailed {
    fmt.Printf("Failure Reason: %s\n", state.GetReason())
}
fmt.Printf("Time Cost: %dms\n", state.GetTimeCost())
```

</TabItem>

<TabItem value='java'>

```javascript
// node.js
```

</TabItem>

<TabItem value='java'>

```bash
# restful
```

</TabItem>
</Tabs>

