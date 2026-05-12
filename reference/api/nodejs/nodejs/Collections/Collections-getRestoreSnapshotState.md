---
title: "getRestoreSnapshotState() | Node.js"
slug: /node/node/Collections-getRestoreSnapshotState
sidebar_key: node/Collections-getRestoreSnapshotState
sidebar_label: "getRestoreSnapshotState()"
added_since: v3.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation checks the state of a snapshot restore job. Use the jobid returned by restoreSnapshot(). | Node.js"
type: docx
token: GyewdMkuaoRnTxxXC2HctZamn7c
sidebar_position: 33
keywords: 
  - Similarity Search
  - multimodal RAG
  - llm hallucinations
  - hybrid search
  - zilliz
  - zilliz cloud
  - cloud
  - getRestoreSnapshotState()
  - nodejs30
displayed_sidebar: nodeSidebar

---

import Admonition from '@theme/Admonition';


# getRestoreSnapshotState()

This operation checks the state of a snapshot restore job. Use the job_id returned by restoreSnapshot().

```typescript
await milvusClient.getRestoreSnapshotState(data: GetRestoreSnapshotStateReq)
```

## Request Syntax\{#request-syntax}

```typescript
await milvusClient.getRestoreSnapshotState({
    job_id: number | string,
    timeout?: number,
    client_request_id?: string,
})
```

**PARAMETERS:**

- **job_id** (*number | string*) -
**[REQUIRED]**
The restore job ID returned by restoreSnapshot().

- **timeout** (*number*) -
An optional duration of time in milliseconds to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or an error occurs. Default is undefined.

- **client_request_id** (*string*) -
A trace ID for request tracking. Optional.

**RETURNS:**

*Promise&lt;GetRestoreSnapshotStateResponse&gt;*

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

const res = await client.getRestoreSnapshotState({
    job_id: 'job_12345',
});
```
