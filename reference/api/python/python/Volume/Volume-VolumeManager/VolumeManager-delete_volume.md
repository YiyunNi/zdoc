---
title: "delete_volume() | Python"
slug: /python/python/VolumeManager-delete_volume
sidebar_key: python/VolumeManager-delete_volume
sidebar_label: "delete_volume()"
added_since: false
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation deletes a volume. | Python"
type: docx
token: FbzLd0f5ToAPRdxa8XWcWfUwnwe
sidebar_position: 2
keywords: 
  - vector database example
  - rag vector database
  - what is vector db
  - what are vector databases
  - zilliz
  - zilliz cloud
  - cloud
  - delete_volume()
  - pymilvus30
displayed_sidebar: pythonSidebar

---

import Admonition from '@theme/Admonition';


# delete_volume()

This operation deletes a volume.

<Admonition type="info" icon="📘" title="Notes">

<p>This method is available on Zilliz Cloud's control-plane Volume service. Create <code>VolumeManager</code> with <code>cloud_endpoint="https://api.cloud.zilliz.com"</code> and a Zilliz Cloud API key that has access to the target project.</p>

</Admonition>

## Request Syntax\{#request-syntax}

```python
delete_volume(
    volume_name: str
)
```

**PARAMETERS**

- **volume_name** (*str*) -

    **[REQUIRED]**

    The name of the volume to delete.

**RETURN TYPE**

*None*

**RETURNS**

None

## Example\{#example}

```python
from pymilvus.bulk_writer.volume_manager import VolumeManager

volume_manager = VolumeManager(
    cloud_endpoint="https://api.cloud.zilliz.com",
    api_key="YOUR_API_KEY"
)

volume_manager.delete_volume(
    volume_name="my_volume"
)

print(f"\nVolume my_volume deleted")

# Volume my_volume deleted
```

