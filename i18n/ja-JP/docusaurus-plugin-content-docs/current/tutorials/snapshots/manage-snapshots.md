---
title: "スナップショットの管理 | Cloud"
slug: /manage-snapshots
sidebar_key: manage-snapshots
sidebar_label: "スナップショットの管理"
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
beta: PRIVATE
notebook: FALSE
description: "このガイドでは、スナップショットの作成および管理方法を学びます。主な内容は次のとおりです。 | Cloud"
type: origin
token: J0jDwYQb8il1biknRo4cazHPn5d
sidebar_position: 1
keywords: 
  - zilliz
  - vector database
  - cloud
  - snapshot
  - restore
  - backup

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# スナップショットの管理

このガイドでは、スナップショットの作成および管理方法を学びます。主な内容は次のとおりです。

- [スナップショットを作成する](./snapshots)

- [スナップショットを一覧表示する](./snapshots)

- [スナップショットの詳細を確認する](./snapshots)

- [スナップショットデータをピン留め/解除する](./manage-snapshots#pinunpin-snapshot-data)

- [スナップショットを復元する](./snapshots)

- [スナップショットを削除する](./snapshots)

- [復元ジョブを一覧表示する](./manage-snapshots#list-restoration-jobs)

- [復元状態を取得する](./manage-snapshots#get-restoration-state)

## スナップショットを作成する\{#create-snapshot}

スナップショットを作成する前に、対象コレクションへの書き込みを停止し、データ損失の可能性を避けるために `flush()` を呼び出すことを推奨します。

<Admonition type="info" icon="📘" title="注意">

<p><code>flush()</code> の呼び出しは必須ではありませんが、データ損失を避けるため強く推奨されます。これを省略すると、スナップショットにはすでに flush 済みのデータのみが含まれます。</p>

</Admonition>

スナップショット名には、`"daily_backup_20240101"` や `"v2.1_production_release"` のような明確で説明的な名前を使用し、`"backup1"` や `"test"` のような汎用的な名前は避けてください。バージョン、環境、ステージを区別できるように命名することを推奨します。

以下のコード例は、`my_collection` という名前のコレクションがすでに存在することを前提としています。

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

<TabItem value='go'>

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

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

## スナップショットを一覧表示する\{#list-snapshots}

既存のスナップショット名を一覧表示できます。

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

<TabItem value='go'>

```go
// List snapshots for collection
listOpt := milvusclient.NewListSnapshotsOption().
    WithCollectionName("my_collection")

snapshots, err := client.ListSnapshots(context.Background(), listOpt)
```

</TabItem>

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# bash
```

</TabItem>
</Tabs>

## スナップショットの詳細を確認する\{#describe-snapshot}

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

<TabItem value='go'>

```go
describeOpt := milvusclient.NewDescribeSnapshotOption("backup_20240101")
resp, err := client.DescribeSnapshot(context.Background(), describeOpt)

fmt.Printf("Snapshot ID: %d\n", resp.GetSnapshotInfo().GetId())
fmt.Printf("Collection: %s\n", resp.GetSnapshotInfo().GetCollectionName())
```

</TabItem>

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

## スナップショットデータをピン留め/解除する\{#pinunpin-snapshot-data}

復元中はスナップショットをピン留めして、基盤データが一時的にガベージコレクションされないように保護できます。不要になったらピンを解除してデータを解放します。

また、ピン留めに対して有効期限（TTL）を設定することもでき、期限が切れるとピン留めされたデータは解放されます。

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

<TabItem value='go'>

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

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

## スナップショットを復元する\{#restore-snapshot}

スナップショットは新しいコレクションに復元できます。この操作は非同期で、復元進行状況を追跡するためのジョブ ID を返します。

復元ではデータインポートではなく **copy-segment** 方式を使用します。これにより次の利点があります。

- セグメントファイル（binlog、deltalog、インデックスファイル）をスナップショットストレージから直接コピーする。

- 既存データファイルとの互換性を保つため、フィールド ID とインデックス ID を維持する。

- データの再書き込みやインデックス再構築を回避し、復元時間を大幅に短縮する。

- 従来のバックアップ/復元方式と比べて、10〜100 倍の性能向上を実現する。

スナップショットを復元するには、次のように実行します。

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

<TabItem value='go'>

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

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

復元ジョブの進行状況監視の詳細は、[復元進行状況の監視](./snapshots) を参照してください。

## スナップショットを削除する\{#drop-snapshot}

不要になったスナップショットは削除できます。ストレージ節約のため、古いスナップショットは定期的に削除することを推奨します。

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

<TabItem value='go'>

```go
dropOpt := milvusclient.NewDropSnapshotOption("backup_20240101")
err := client.DropSnapshot(context.Background(), dropOpt)
```

</TabItem>

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

## 復元ジョブを一覧表示する\{#list-restoration-jobs}

この API を使用すると、対象コレクションに対して作成済みのスナップショット一覧を取得できます。

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

<TabItem value='go'>

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

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

## 復元状態を取得する\{#get-restoration-state}

復元ジョブ ID を取得した後、この ID を使って復元の進捗を確認できます。

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

<TabItem value='go'>

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

<TabItem value='javascript'>

```javascript
// node.js
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

