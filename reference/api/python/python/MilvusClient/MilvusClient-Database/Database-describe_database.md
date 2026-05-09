---
title: "describe_database() | Python | MilvusClient"
slug: /python/python/Database-describe_database
sidebar_key: python/Database-describe_database
sidebar_label: "describe_database()"
added_since: v2.5.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation lists detailed information about the specified database. | Python | MilvusClient"
type: docx
token: LEaYdk179oZn0vxqa0lcn4mnnrg
sidebar_position: 3
keywords: 
  - llm eval
  - Sparse vs Dense
  - Dense vector
  - Hierarchical Navigable Small Worlds
  - zilliz
  - zilliz cloud
  - cloud
  - describe_database()
  - pymilvus30
displayed_sidebar: pythonSidebar

---

import Admonition from '@theme/Admonition';


# describe_database()

This operation lists detailed information about the specified database.

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
describe_database(
    db_name: str, 
    timeout: Optional[float] = None,
    **kwargs,
) -> Dict
```

**PARAMETERS:**

- **db_name** (*string*) -

    **[REQUIRED]**

    Name of the database to describe.

- **timeout** (*float* | *None*) -

    The timeout duration for this operation. Setting this to *None* indicates that it timeouts when a response arrives, or an error occurs.

**RETURN TYPE:**

*Dict*

**RETURNS:**

A dictionary that contains detailed information about the specified database.

**EXCEPTIONS:**

- `MilvusException` - Raised if any error occurs during this operation.

## Examples\{#examples}

```python
from pymilvus import MilvusClient

client = MilvusClient(uri, token) # db = "default" 

client.describe_database(
    db_name="my_db"
)

# {
#   "name": "my_db",
#   "a": "b",
#.  "c": "d",
# }
```
