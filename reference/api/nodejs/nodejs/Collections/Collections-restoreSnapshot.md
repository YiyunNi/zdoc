---
title: "restoreSnapshot() | Node.js"
slug: /node/node/Collections-restoreSnapshot
sidebar_key: node/Collections-restoreSnapshot
sidebar_label: "restoreSnapshot()"
added_since: v3.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation restores a collection from a snapshot to a new or existing collection. | Node.js"
type: docx
token: JSXId4SYLoNAUhxJ0P1cqxLDnmz
sidebar_position: 39
keywords: 
  - RAG
  - NLP
  - Neural Network
  - Deep Learning
  - zilliz
  - zilliz cloud
  - cloud
  - restoreSnapshot()
  - nodejs30
displayed_sidebar: nodeSidebar

---

import Admonition from '@theme/Admonition';


# restoreSnapshot()

This operation restores a collection from a snapshot to a new or existing collection.

```typescript
await milvusClient.restoreSnapshot(data: RestoreSnapshotReq)
```

## Request Syntax\{#request-syntax}

```typescript
await milvusClient.restoreSnapshot({
    snapshot_name: string,
    source_collection_name: string,
    target_collection_name: string,
    source_db_name?: string,
    target_db_name?: string,
    timeout?: number,
    client_request_id?: string,
})
```

**PARAMETERS:**

- **snapshot_name** (*string*) -
**[REQUIRED]**
The name of the snapshot to restore from.

- **source_collection_name** (*string*) -
**[REQUIRED]**
The name of the source collection.

- **target_collection_name** (*string*) -
**[REQUIRED]**
The name of the target collection to restore to.

- **source_db_name** (*string*) -
The source database name. Optional.

- **target_db_name** (*string*) -
The target database name. Optional.

- **timeout** (*number*) -
An optional duration of time in milliseconds to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or an error occurs. Default is undefined.

- **client_request_id** (*string*) -
A trace ID for request tracking. Optional.

**RETURNS:**

*Promise&lt;RestoreSnapshotResponse&gt;*

**EXCEPTIONS:**

- **MilvusError**

    This exception will be raised when any error occurs during this operation.

## Example\{#example}

```javascript
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const client = new MilvusClient({
    address: 'YOUR_CLUSTER_ENDPOINT',
    token: 'YOUR_CLUSTER_TOKEN',
});

const res = await client.restoreSnapshot({
    snapshot_name: 'snapshot_2024_01',
    source_collection_name: 'my_collection',
    target_collection_name: 'restored_collection',
});
```
