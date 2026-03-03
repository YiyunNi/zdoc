---
title: "hasRole() | Node.js"
slug: /node/node/Authentication-hasRole
sidebar_label: "hasRole()"
beta: false
added_since: v2.6.x
last_modified: false
deprecate_since: false
notebook: false
description: "Checks if a role exists in the Milvus cluster. | Node.js"
type: docx
token: Cgm7deeT9oQ6DwxCI3tc9GSfnuc
sidebar_position: 29
keywords: 
  - what is milvus
  - milvus database
  - milvus lite
  - milvus benchmark
  - zilliz
  - zilliz cloud
  - cloud
  - hasRole()
  - nodejs26
displayed_sidebar: nodeSidebar

displayed_sidbar: nodeSidebar
---

import Admonition from '@theme/Admonition';


# hasRole()

Checks if a role exists in the Milvus cluster.

```typescript
await milvusClient.hasRole(data: HasRoleReq)
```

**PARAMETERS:**

- **roleName** (*string*) -

    **[REQUIRED]**

    The name of the role to check.

- **timeout** (*number*) -

    RPC timeout in milliseconds. Optional.

**RETURNS:**

*Promise\<HasRoleResponse\>*

The response contains a `hasRole` boolean indicating whether the role exists.

**EXCEPTIONS:**

- **MilvusError**

    This exception will be raised when any error occurs during this operation.

## Example\{#example}

```typescript
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const client = new MilvusClient({ address: 'YOUR_CLUSTER_ENDPOINT' });
const res = await client.hasRole({ roleName: 'my_role' });
console.log(res.hasRole); // true or false
```
