---
title: "pinSnapshotData() | Node.js"
slug: /node/node/Collections-pinSnapshotData
sidebar_key: node/Collections-pinSnapshotData
sidebar_label: "pinSnapshotData()"
added_since: v3.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation pins snapshot data to prevent it from being garbage collected. Use this to ensure a snapshot remains available for restoration. | Node.js"
type: docx
token: U21vd7Oq9okO5mx3n2ccezMGnAc
sidebar_position: 37
keywords: 
  - how does milvus work
  - Zilliz vector database
  - Zilliz database
  - Unstructured Data
  - zilliz
  - zilliz cloud
  - cloud
  - pinSnapshotData()
  - nodejs30
displayed_sidebar: nodeSidebar

---

import Admonition from '@theme/Admonition';


# pinSnapshotData()

This operation pins snapshot data to prevent it from being garbage collected. Use this to ensure a snapshot remains available for restoration.

```typescript
await milvusClient.pinSnapshotData(data: PinSnapshotDataReq)
```

## Request Syntax\{#request-syntax}

```typescript
await milvusClient.pinSnapshotData({
    collection_name: string,
    snapshot_name: string,
    ttl_seconds?: number | string,
    db_name?: string,
    timeout?: number,
    client_request_id?: string,
})
```

**PARAMETERS:**

- **collection_name** (*string*) -
**[REQUIRED]**
The name of the collection the snapshot belongs to.

- **snapshot_name** (*string*) -
**[REQUIRED]**
The name of the snapshot to pin.

- **ttl_seconds** (*number | string*) -
Optional pin TTL in seconds. If not specified, the snapshot will be pinned indefinitely.

- **db_name** (*string*) -
The name of the database. Optional.

- **timeout** (*number*) -
An optional duration of time in milliseconds to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or an error occurs. Default is undefined.

- **client_request_id** (*string*) -
A trace ID for request tracking. Optional.

**RETURNS:**

*Promise&lt;PinSnapshotDataResponse&gt;*

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

const res = await client.pinSnapshotData({
    collection_name: 'my_collection',
    snapshot_name: 'snapshot_2024_01',
});
```
