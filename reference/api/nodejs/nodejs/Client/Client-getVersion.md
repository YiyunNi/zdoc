---
title: "getVersion() | Node.js"
slug: /node/node/Client-getVersion
sidebar_key: node/Client-getVersion
sidebar_label: "getVersion()"
added_since: v2.6.x
last_modified: v3.0.x
deprecate_since: false
beta: false
notebook: false
description: "This operation returns version information for the Milvus server. | Node.js"
type: docx
token: WA81dokeYotwt9xAiKKcaaIpnxc
sidebar_position: 6
keywords: 
  - hybrid vector search
  - Video deduplication
  - Video similarity search
  - Vector retrieval
  - zilliz
  - zilliz cloud
  - cloud
  - getVersion()
  - nodejs30
displayed_sidebar: nodeSidebar

---

import Admonition from '@theme/Admonition';


# getVersion()

This operation returns version information for the Milvus server.

```javascript
await milvusClient.getVersion()
```

**RETURNS** *Promise&lt;GetVersionResponse&gt;*

This method returns a promise that resolves to a **GetVersionResponse** object.

```typescript
{
    version: string
}
```

**PARAMETERS:**

- **version** (*string*) -

    The semantic version of the Milvus server (for example, **"v3.0.0"**).

## Example\{#example}

```javascript
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const client = new MilvusClient({
    address: 'YOUR_CLUSTER_ENDPOINT',
    token: 'YOUR_CLUSTER_TOKEN',
});
const res = await client.getVersion();
console.log(res.version); // "2.6.9"
```
