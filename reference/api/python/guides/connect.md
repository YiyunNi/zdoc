---
title: Connect & Authenticate | Python SDK
slug: /python/guides/connect
displayed_sidebar: pythonSidebar
sidebar_label: Connect & Authenticate
sidebar_position: 2
---

# Connect & Authenticate

Learn how to connect to a Zilliz Cloud cluster using the Python SDK.

[Full guide →](/docs/connect-to-cluster)

## Connect to a cluster

Once your cluster is operational, connect to it utilizing its public endpoint and an authentication token. 

- **Cluster public endpoint:** You can obtain this on the Zilliz Cloud web console. Navigate to the **Cluster Details** page of the target cluster. On the **Connect** card, you can copy the cluster public endpoint.

    ![connection-info](https://zdoc-images.s3.us-west-2.amazonaws.com/connection-info.png "connection-info")

- **Token:** This token can be  an [API key](./manage-api-keys) or a [cluster credential](./cluster-credentials) that consists of a username and password pair.

The following example shows how to connect to a cluster.

```python
# Connect using a MilvusClient object
from pymilvus import MilvusClient
CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT" # Set your cluster endpoint
TOKEN="YOUR_CLUSTER_TOKEN" # Set your token

# Initialize a MilvusClient instance
# Replace uri and token with your own
client = MilvusClient(
    uri=CLUSTER_ENDPOINT, # Cluster endpoint obtained from the console
    token=TOKEN # API key or a colon-separated cluster username and password
)
```

## API Reference

- [`MilvusClient()`](/reference/python/python/MilvusClient/MilvusClient-Client/Client-MilvusClient)
