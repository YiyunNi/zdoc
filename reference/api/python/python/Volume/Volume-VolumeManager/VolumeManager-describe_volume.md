---
title: "describe_volume() | Python"
slug: /python/python/VolumeManager-describe_volume
sidebar_key: python/VolumeManager-describe_volume
sidebar_label: "describe_volume()"
added_since: false
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation describes a specific volume within a specific project in a paginated manner. | Python"
type: docx
token: WuCpdRKfloXSTqxrLehcqkXfnFd
sidebar_position: 3
keywords: 
  - Video search
  - AI Hallucination
  - AI Agent
  - semantic search
  - zilliz
  - zilliz cloud
  - cloud
  - describe_volume()
  - pymilvus30
displayed_sidebar: pythonSidebar

---

import Admonition from '@theme/Admonition';


# describe_volume()

This operation describes a specific volume within a specific project in a paginated manner.

## Request Syntax\{#request-syntax}

```python
list_volumes(
    volume_name: str
)
```

**PARAMETERS**

- **volume_name** (*str*) -

    The name of the volume to describe.

**RETURN TYPE**

An object.

**RETURNS**

An object with the following data structure:

```json
{
    "count": 1,
    "currentPage": 1,
    "pageSize": 10,
    "volumes": [
        {
            "volumeName": "my_volume",
            "type": "EXTERNAL",
            "regionId": "aws-us-west-2",
            "storageIntegrationId": "integ-xxx",
            "path": "data/",
            "status": "RUNNING",
            "createTime": "2024-04-15T12:00:00Z"
        }        
    ]
}
```

**PARAMETERS**

- **count** (*int*) -

    The total number of volumes found.

- **currentPage** (*int*) -

    The current page.

- **pageSize** (*int*) -

    The maximum number of volumes per page.

- **volumes** (*list*) -

    A volume list.

    - **volumeName** (*str*) -

        The name of a volume.

    - **type** (*str*) -

        The type of a volume. Possible values are `EXTERNAL` and `MANAGED`.

    - **regionId** (*str*) -

        The region to which the volume belongs.

    - **storageIntegrationId** (*str*) -

        The ID of the integrated storage from which the volume is created. This is available only when the volume is external.

    - **path** (*str*) -

        The path in the integrated storage from which the volume is created. This is available only when the volume is external.

    - **status** (*str*) -

        The name of a volume.

        The status of the current volume.

    - **createTime** (*str*) -

        The time at which the volume is created.

## Example\{#example}

```python
from pymilvus.bulk_writer.volume_manager import VolumeManager

volume_manager = VolumeManager(
    cloud_endpoint="https://api.cloud.zilliz.com",
    api_key="YOUR_API_KEY"
)

volume_list = volume_manager.describe_volumes(
    volume_name="volume-xxxx"
)

print(f"\ndescribeVolumes results: \n", volume_list.json()['data'])

# listVolumes results: 
# 
# {
#     "count": 1,
#     "currentPage": 1,
#     "pageSize": 10,
#     "volumes": [
#         {
#            "volumeName": "my_volume",
#             "type": "EXTERNAL",
#             "regionId": "aws-us-west-2",
#             "storageIntegrationId": "integ-xxx",
#             "path": "data/",
#             "status": "RUNNING",
#             "createTime": "2024-04-15T12:00:00Z"
#         }        
#     ]
# }
```

