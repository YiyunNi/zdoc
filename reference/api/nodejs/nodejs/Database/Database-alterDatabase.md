---
title: "alterDatabase() | Node.js"
slug: /node/node/Database-alterDatabase
sidebar_label: "alterDatabase()"
beta: false
added_since: v2.6.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation modifies database properties, such as setting or deleting key-value pairs in the configuration. | Node.js"
type: docx
token: FmPYdWiiiorAtKxlAefc1HYmn7c
sidebar_position: 1
keywords: 
  - k nearest neighbor algorithm
  - ANNS
  - Vector search
  - knn algorithm
  - zilliz
  - zilliz cloud
  - cloud
  - alterDatabase()
  - nodejs26
displayed_sidebar: nodeSidebar

displayed_sidbar: nodeSidebar
---

import Admonition from '@theme/Admonition';


# alterDatabase()

This operation modifies database properties, such as setting or deleting key-value pairs in the configuration.

```typescript
await milvusClient.alterDatabase(data: AlterDatabaseRequest)
```

**PARAMETERS:**

- **db_name** (*string*) -

    **[REQUIRED]**

    The name of the database.

- **properties** (*object*) -

    **[REQUIRED]**

    An object of properties to set (e.g., `{ "database.replica.number": "2" }`).

- **delete_keys** (*string[]*) -

    Property keys to delete. Optional.

- **timeout** (*number*) -

    RPC timeout in milliseconds. Optional.

**RETURNS:**

*Promise\<ResStatus\>*

**EXCEPTIONS:**

- **MilvusError**

    This exception will be raised when any error occurs during this operation.

## Example\{#example}

```typescript
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const client = new MilvusClient({ address: 'YOUR_CLUSTER_ENDPOINT' });
await client.alterDatabase({
    db_name: 'my_database',
    properties: { 'database.replica.number': '2' },
});
```
