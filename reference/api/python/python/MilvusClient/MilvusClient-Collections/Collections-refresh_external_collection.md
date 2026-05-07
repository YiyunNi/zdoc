---
title: "refresh_external_collection() | Python | MilvusClient"
slug: /python/python/Collections-refresh_external_collection
sidebar_key: python/Collections-refresh_external_collection
sidebar_label: "refresh_external_collection()"
added_since: v3.0.x
last_modified: false
deprecate_since: false
beta: PUBLIC
notebook: false
description: "This operation scans the data files in the schema-defined external storage and generates metadata files that record their mapping relationship to those data files. | Python | MilvusClient"
type: docx
token: ZVs4dDpvmoXI0OxOnKhc9numnJd
sidebar_position: 28
keywords: 
  - multimodal vector database retrieval
  - Retrieval Augmented Generation
  - Large language model
  - Vectorization
  - zilliz
  - zilliz cloud
  - cloud
  - refresh_external_collection()
  - pymilvus30
displayed_sidebar: pythonSidebar

---

import Admonition from '@theme/Admonition';


# refresh_external_collection()

This operation scans the data files in the schema-defined external storage and generates metadata files that record their mapping relationship to those data files.

## Request Syntax\{#request-syntax}

```python
request_external_collection(
    collection_name: str,
    external_source: str = "",
    external_spec: str = "",
    timeout: Optional[float] = None,
    **kwargs,    
) -> int
```

**PARAMETERS:**

- **collection_name** (*string*) -

    **[REQUIRED]**

    The name of an existing external collection.

- **external_source** (*string*) -

    The external source URI, which should be the name of an accessible external volume..

- **external_spec** (*string*) -

    The external source specifications, which are a set of secondary parameters:

    - **format** (*string*) - 

        The format of the target source data files.

        Possible values are `parquet`, `vortex`, `lance-table`, and `iceberg-table`.

- **timeout** (*float*) -

    The timeout duration for this operation. 

    Setting this to **None** indicates that this operation times out when any response arrives or any error occurs.

**RETURN TYPE:**

*int*

**RETURNS:**

An integer that indicates an asynchronous job that has been created.

## Examples\{#examples}

```python
from pymilvus import MilvusClient

# 1. Set up a milvus client
client = MilvusClient(
    uri="YOUR_CLUSTER_ENDPOINT",
    token="YOUR_CLUSTER_TOKEN"
)

job_id = client.refresh_external_collection(
    collection_name="test_collection"
)

while True:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    print(f"  {progress.state}: {progress.progress}%")

    if progress.state == "RefreshCompleted":
        elapsed = progress.end_time - progress.start_time
        print(f"  Completed in {elapsed}ms")
        return job_id
    elif progress.state == "RefreshFailed":
        print(f"  Failed: {progress.reason}")
        return job_id

    time.sleep(2)
```
