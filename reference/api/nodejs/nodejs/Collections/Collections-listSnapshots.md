---
title: "listSnapshots() | Node.js"
slug: /node/node/Collections-listSnapshots
sidebar_key: node/Collections-listSnapshots
sidebar_label: "listSnapshots()"
added_since: v3.0.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation lists all snapshots for a collection. | Node.js"
type: docx
token: MgtAdg1p9otYVoxdAsRcwElGnSe
sidebar_position: 36
keywords: 
  - lexical search
  - nearest neighbor search
  - Agentic RAG
  - rag llm architecture
  - zilliz
  - zilliz cloud
  - cloud
  - listSnapshots()
  - nodejs30
displayed_sidebar: nodeSidebar

---

import Admonition from '@theme/Admonition';


# listSnapshots()

This operation lists all snapshots for a collection.

```typescript
await milvusClient.listSnapshots(data: ListSnapshotsReq)
```

## Request Syntax\{#request-syntax}

```typescript
await milvusClient.listSnapshots({
    collection_name: string,
    db_name?: string,
    timeout?: number,
    client_request_id?: string,
})
```

**PARAMETERS:**

- **collection_name** (*string*) -
**[REQUIRED]**
The name of the collection.

- **db_name** (*string*) -
The name of the database. Optional.

- **timeout** (*number*) -
An optional duration of time in milliseconds to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or an error occurs. Default is undefined.

- **client_request_id** (*string*) -
A trace ID for request tracking. Optional.

**RETURNS:**

*Promise&lt;ListSnapshotsResponse&gt;*

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

const res = await client.listSnapshots({
    collection_name: 'my_collection',
});
```
