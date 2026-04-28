---
title: "Snapshot Use Cases | BYOC"
slug: /snapshot-use-cases
sidebar_label: "Snapshot Use Cases"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "In this guide, you will find common use cases for snapshots. | BYOC"
type: origin
token: IrPGwawazioLnokWJG2cMFtgnwc
sidebar_position: 2

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Snapshot Use Cases

In this guide, you will find common use cases for snapshots.

## Data backup and restoration\{#data-backup-and-restoration}

Snapshots are quick, point-in-time images of data, suitable for fast rollbacks or testing (days to weeks). At the same time, backups are independent, complete copies stored separately for long-term disaster recovery (weeks to years) and for better protection against total storage failure. 

The following table compares snapshots and backups.

<table>
   <tr>
     <th></th>
     <th><p>Backup</p></th>
     <th><p>Snapshot</p></th>
   </tr>
   <tr>
     <td><p>Backup creation</p></td>
     <td><p>Copies all data files (time-consuming)</p></td>
     <td><p>Creates metadata only (in milliseconds)</p></td>
   </tr>
   <tr>
     <td><p>Restoration</p></td>
     <td><p>Imports data and rebuilds indexes</p></td>
     <td><p>Copies existing data and index files only</p></td>
   </tr>
   <tr>
     <td><p>Performance</p></td>
     <td><p>Slow and resource-intensive</p></td>
     <td><p>Fast and lightweight (in seconds to minutes)</p></td>
   </tr>
   <tr>
     <td><p>System impact</p></td>
     <td><p>High I/O and CPU usage</p></td>
     <td><p>Minimal impact</p></td>
   </tr>
</table>

Creating a snapshot usually takes milliseconds, and restoring it takes seconds to minutes, depending on the data volume. 

For more details on snapshot limits, restrictions, and their system impacts, refer to [Snapshots](./snapshots).

### Create snapshots\{#create-snapshots}

Before creating a snapshot, you are advised to stop writing data to the target collection and call `flush()` to avoid possible data loss.

<Admonition type="info" icon="📘" title="Notes">

<p>Calling <code>flush()</code> is not mandatory but highly recommended to avoid data loss. If you skip this, the snapshot contains only the data that has already been flushed.</p>

</Admonition>

When naming a snapshot, use clear, descriptive names, such as `"daily_backup_20240101"` or `"v2.1_production_release"` and avoid generic terms, such as `"backup1"` and `"test"`. Use snapshot names wisely to distinguish snapshots across versions, environments, and stages.

The code examples below assume that you already have a collection named `my_collection`.

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

### Restore snapshots\{#restore-snapshots}

You can restore a snapshot to a new collection. This operation is asynchronous and returns a job ID for tracking the restoration progress.

The restoration uses a **copy-segment** mechanism instead of data import, which is more efficient because it

- directly copies segment files (binlogs, deltalogs, index files) from snapshot storage

- preserves field IDs and index IDs to ensure compatibility with existing data files

- avoids data rewriting and index rebuilding, resulting in significantly faster restore times, and

- ensures a 10- to 100-fold performance increase compared with traditional backup and restore methods

To restore a snapshot, do as follows:

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

### Drop snapshots\{#drop-snapshots}

You can drop a snapshot if it is no longer needed. You are advised to remove old snapshots regularly to save storage.

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

## Data processing with Spark\{#data-processing-with-spark}

Snapshots enable efficient offline data processing by providing stable, consistent data sources for analytical workloads. You can directly access snapshot data stored in object storage with Spark or other big data processing frameworks without impacting the live Milvus cluster.

The following code assumes you have created a snapshot named `"analytics_snapshot_20260321"`, stored it in an object storage bucket, and obtained the object storage access credentials.

### Step 1: Get snapshot metadata\{#step-1-get-snapshot-metadata}

Before using Spark to access snapshot data, get snapshot metadata to locate the data files in object storage.

```python
# Get snapshot metadata
snapshot_info = client.describe_snapshot(
    snapshot_name=s"analytics_snapshot_20260321",
    include_collection_info=True
)

# Locate data files in S3
s3_path = f"s3a://{snapshot_info.s3_location}/binlogs/"
```

### Step2: Initiate a Spark session\{#step2-initiate-a-spark-session}

With the data files in object storage, initiate a Spark session and read the data into a dataframe.

```python
spark = SparkSession.builder \
    .appName("VectorAnalytics") \
    .config("spark.hadoop.fs.s3a.access.key", "YOUR_ACCESS_KEY") \
    .config("spark.hadoop.fs.s3a.secret.key", "YOUR_SECRET_KEY") \
    .getOrCreate()

```

