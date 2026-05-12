---
title: "listRestoreSnapshotJobs() | Node.js"
slug: /node/node/Collections-listRestoreSnapshotJobs
sidebar_key: node/Collections-listRestoreSnapshotJobs
sidebar_label: "listRestoreSnapshotJobs()"
added_since: v3.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation lists all snapshot restore jobs. You can filter by target collection name and database name. | Node.js"
type: docx
token: FqoydqLcroxCXuxySXxcbXZjnAg
sidebar_position: 35
keywords: 
  - Similarity Search
  - multimodal RAG
  - llm hallucinations
  - hybrid search
  - zilliz
  - zilliz cloud
  - cloud
  - listRestoreSnapshotJobs()
  - nodejs30
displayed_sidebar: nodeSidebar

---

import Admonition from '@theme/Admonition';


# listRestoreSnapshotJobs()

This operation lists all snapshot restore jobs. You can filter by target collection name and database name.

```typescript
await milvusClient.listRestoreSnapshotJobs(data?: ListRestoreSnapshotJobsReq)
```

## Request Syntax\{#request-syntax}

```typescript
await milvusClient.listRestoreSnapshotJobs({
    collection_name?: string,
    db_name?: string,
    timeout?: number,
    client_request_id?: string,
})
```

**PARAMETERS:**

- **collection_name** (*string*) -
Optional filter by target collection name.

- **db_name** (*string*) -
Optional filter by database name.

- **timeout** (*number*) -
An optional duration of time in milliseconds to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or an error occurs. Default is undefined.

- **client_request_id** (*string*) -
A trace ID for request tracking. Optional.

**RETURNS:**

*Promise&lt;ListRestoreSnapshotJobsResponse&gt;*

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

const res = await client.listRestoreSnapshotJobs({
    collection_name: 'restored_collection',
});
```
