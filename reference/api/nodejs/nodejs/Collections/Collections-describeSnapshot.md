---
title: "describeSnapshot() | Node.js"
slug: /node/node/Collections-describeSnapshot
sidebar_key: node/Collections-describeSnapshot
sidebar_label: "describeSnapshot()"
added_since: v3.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation retrieves detailed information about a specific snapshot. | Node.js"
type: docx
token: Les4dSyaCoD13dxWi8Bc0RLGn2b
sidebar_position: 30
keywords: 
  - llm hallucinations
  - hybrid search
  - lexical search
  - nearest neighbor search
  - zilliz
  - zilliz cloud
  - cloud
  - describeSnapshot()
  - nodejs30
displayed_sidebar: nodeSidebar

---

import Admonition from '@theme/Admonition';


# describeSnapshot()

This operation retrieves detailed information about a specific snapshot.

```typescript
await milvusClient.describeSnapshot(data: DescribeSnapshotReq)
```

## Request Syntax\{#request-syntax}

```typescript
await milvusClient.describeSnapshot({
    collection_name: string,
    snapshot_name: string,
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
The name of the snapshot to describe.

- **db_name** (*string*) -
The name of the database. Optional.

- **timeout** (*number*) -
An optional duration of time in milliseconds to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or an error occurs. Default is undefined.

- **client_request_id** (*string*) -
A trace ID for request tracking. Optional.

**RETURNS:**

*Promise&lt;DescribeSnapshotResponse&gt;*

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

const res = await client.describeSnapshot({
    collection_name: 'my_collection',
    snapshot_name: 'snapshot_2024_01',
});
```
