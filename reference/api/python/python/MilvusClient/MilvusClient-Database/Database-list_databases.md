---
title: "list_databases() | Python | MilvusClient"
slug: /python/python/Database-list_databases
sidebar_key: python/Database-list_databases
sidebar_label: "list_databases()"
added_since: v2.5.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation lists all existing databases. | Python | MilvusClient"
type: docx
token: FZuddXocNopEufxRFGdcbvkRnnb
sidebar_position: 6
keywords: 
  - Pinecone vs Milvus
  - Chroma vs Milvus
  - Annoy vector search
  - milvus
  - zilliz
  - zilliz cloud
  - cloud
  - list_databases()
  - pymilvus30
displayed_sidebar: pythonSidebar

---

import Admonition from '@theme/Admonition';


# list_databases()

This operation lists all existing databases.

<Admonition type="info" icon="📘" title="Notes">

<p>This method applies only to dedicated serving clusters and on-demand compute. </p>
<ul>
<li><p>For a database in dedicated serving clusters, please create <strong>MilvusClient</strong> with the cluster endpoint.</p></li>
<li><p><strong>Free & Serverless</strong></p></li>
</ul>
<p><code>https://\{cluster-id\}.serverless.\{region\}.vectordb.zillizcloud.com</code></p>
<ul>
<li><strong>Dedicated</strong></li>
</ul>
<p><code>https://\{cluster-id\}.\{region\}.vectordb.zillizcloud.com:19530</code></p>
<ul>
<li>For a database for on-demand compute, create <strong>MilvusClient</strong> with the project endpoints.</li>
</ul>
<p><code>https://\{project-id\}.\{region\}.api.zillizcloud.com</code></p>

</Admonition>

## Request Syntax\{#request-syntax}

```python
list_databases(
    timeout: Optional[float] = None,
    **kwargs,
) -> [] string
```

**PARAMETERS:**

- **db_name** (*string*) -

    **[REQUIRED]**

    Name of the database to drop.

- **timeout** (*float* | *None*) -

    The timeout duration for this operation. Setting this to *None* indicates that it timeouts when a response arrives or an error occurs.

**RETURN TYPE:**

*[]string*

**RETURNS:**

A list of database names.

**EXCEPTIONS:**

- `MilvusException` - Raised if any error occurs during this operation.

## Examples\{#examples}

```python
from pymilvus import MilvusClient

client = MilvusClient(uri, token) # db = "default" 

db_list = client.list_databases()
print(db_list)
# ["my_database", "default"]
```
