---
title: "prepare_index_params() | Python | MilvusClient"
slug: /python/python/Management-prepare_index_params
sidebar_key: python/Management-prepare_index_params
sidebar_label: "prepare_index_params()"
added_since: v2.3.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation prepares index parameters to build indexes for a specific collection. | Python | MilvusClient"
type: docx
token: CAzpdAw3wo4ZqrxhjTLcEGBBn1S
sidebar_position: 11
keywords: 
  - milvus db
  - milvus vector db
  - Zilliz Cloud
  - what is milvus
  - zilliz
  - zilliz cloud
  - cloud
  - prepare_index_params()
  - pymilvus30
displayed_sidebar: pythonSidebar

---

import Admonition from '@theme/Admonition';


# prepare_index_params()

This operation prepares index parameters to build indexes for a specific collection.

<Admonition type="info" icon="📘" title="Notes">

<p>This method applies only to dedicated serving clusters and on-demand compute. </p>
<ul>
<li><p>For this operation in a collection of a serving cluster, please create <strong>MilvusClient</strong> with the cluster endpoint.</p></li>
<li><p><strong>Free & Serverless</strong></p></li>
</ul>
<p><code>https://\{cluster-id\}.serverless.\{region\}.vectordb.zillizcloud.com</code></p>
<ul>
<li><strong>Dedicated</strong></li>
</ul>
<p><code>https://\{cluster-id\}.\{region\}.vectordb.zillizcloud.com:19530</code></p>
<ul>
<li>For this operation in a collection for on-demand compute, create <strong>MilvusClient</strong> with the project endpoints, and then create a session to attach to an on-demand cluster for searches.</li>
</ul>
<p><code>https://\{project-id\}.\{region\}.api.zillizcloud.com</code></p>

</Admonition>

## Request syntax\{#request-syntax}

```python
pymilvus.MilvusClient.prepare_index_params() -> IndexParams
```

**PARAMETERS:**

N/A

**RETURN TYPE:**

*IndexParams*

**RETURNS:**

An **IndexParams** contains a list of **IndexParam** objects.

- **IndexParams**

    A list of **IndexParam** objects.

    ```python
    ├── IndexParams 
    │       └── add_index()
    ```

    It offers the **[add_index()](./Management-add_index)** method to add indexes to the list.

**EXCEPTIONS:**

None

## Examples\{#examples}

```python
from pymilvus import MilvusClient

index_params = MilvusClient.prepare_index_params()
```

- [add_index()](./Management-add_index)

- [create_index()](./Management-create_index)

- [describe_index()](./Management-describe_index)

- [drop_index()](./Management-drop_index)

- [list_indexes()](./Management-list_indexes)

