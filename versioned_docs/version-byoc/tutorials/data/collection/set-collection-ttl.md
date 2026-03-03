---
title: "Set Collection TTL | BYOC"
slug: /set-collection-ttl
sidebar_label: "Set Collection TTL"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "Once data is inserted into a collection, it remains there by default. However, in some scenarios, you may want to remove or clean up data after a certain period. In such cases, you can configure the collection’s Time-to-Live (TTL) property so that Zilliz Cloud automatically deletes the data once the TTL expires. | BYOC"
type: origin
token: GthGwnrpEiGpClkV5JXcgWUgn8c
sidebar_position: 6
keywords: 
  - zilliz
  - vector database
  - cloud
  - collection
  - collection ttl
  - time-to-live

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Set Collection TTL

Once data is inserted into a collection, it remains there by default. However, in some scenarios, you may want to remove or clean up data after a certain period. In such cases, you can configure the collection’s Time-to-Live (TTL) property so that Zilliz Cloud automatically deletes the data once the TTL expires.

## Overview\{#overview}

Time-to-Live (TTL) is commonly used in databases for scenarios where data should only remain valid or accessible for a certain period after any insertion or modification. Then, the data can be automatically removed. 

For instance, if you ingest data daily but only need to retain records for 14 days, you can configure Zilliz Cloud to automatically remove any data older than that by setting the collection’s TTL to **14 × 24 × 3600 = 1209600** seconds. This ensures that only the most recent 14 days’ worth of data remain in the collection.

<Admonition type="info" icon="📘" title="Notes">

<p>Expired entities will not appear in any search or query results. However, they may stay in the storage until the subsequent data compaction, which should be carried out within the next 24 hours.</p>

</Admonition>

The TTL property in a Zilliz Cloud collection is specified as an integer in seconds. Once set, any data that surpasses its TTL will be automatically deleted from the collection.

Because the deletion process is asynchronous, data might not be removed from search results exactly once the specified TTL has elapsed. Instead, there may be a delay, as the removal depends on the garbage collection (GC) and compaction processes, which occur at non-deterministic intervals.

## Examples\{#examples}

Generally, Collection TTL is closely related to when TTL settings are enforced and when entities are inserted or updated. To better understand the TTL mechanism, consider the following examples.

### Example 1: Set TTL upon collection creation\{#example-1-set-ttl-upon-collection-creation}

You set the **TTL** to **2592000 (30 days)** when you create a collection.

At **00:00** on **January 1st**, you inserted **10 billion entities**, and no other write operations followed.

After **00:00** on **January 31st**, the **10 billion entities** will become unsearchable, and the result of a query with the output fields set to `count(*)` will be **0**.

### Example 2: Set TTL for an existing collection\{#example-2-set-ttl-for-an-existing-collection}

You have created a collection without TTL.

At **00:00** on **January 1st**, you insert **10 billion entities**.

At **00:00** on **January 31st**, you insert another **20 billion entities**, and no other write operations follow.

At **10:00** on **Feburary 28th**, you set TTL to **2592000 (30 days)** for the collection.

The **10 billion entities** inserted on January 1st become unsearchable immediately after the TTL has been set, and the result of a query with the output fields set to `count(*)` will be **20 billion**.

### Example 3: Upsert entities\{#example-3-upsert-entities}

You set the **TTL** to **2592000 (30 days)** when you create a collection.

At **00:00** on **January 1st**, you inserted **20 billion entities**, and no other write operations followed.

From **00:00** to **23:59:59** on **January 15th**, you upsert all the 20 billion entities in merge mode, and no other write operations follow.

During the period from **January 31st** to **February 13th**, the 20 billion entities remain searchable, and the query count remains 20 billion. 

Since **00:00** on **February 14th**, the query count has been decreasing and reached **0** at **00:00** on **February 15th**.

## Set TTL\{#set-ttl}

You can set the TTL property when you

- [Create a collection.](./set-collection-ttl#set-ttl-when-creating-a-collection)

- [Alter the TTL property of an existing collection.](./set-collection-ttl#set-ttl-for-an-existing-collection)

### Set TTL when creating a collection\{#set-ttl-when-creating-a-collection}

The following code snippet demonstrates how to set the TTL property when you create a collection.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import MilvusClient

# With TTL
client.create_collection(
    collection_name="my_collection",
    schema=schema,
    # highlight-start
    properties={
        "collection.ttl.seconds": 1209600
    }
    # highlight-end
)
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.AlterCollectionReq;
import io.milvus.param.Constant;
import java.util.HashMap;
import java.util.Map;

// With TTL
CreateCollectionReq customizedSetupReq = CreateCollectionReq.builder()
        .collectionName("my_collection")
        .collectionSchema(schema)
        // highlight-next-line
        .property(Constant.TTL_SECONDS, "1209600")
        .build();
client.createCollection(customizedSetupReq);
```

</TabItem>

<TabItem value='javascript'>

```javascript
const createCollectionReq = {
    collection_name: "my_collection",
    schema: schema,
    // highlight-start
    properties: {
        "collection.ttl.seconds": 1209600
    }
    // highlight-end
}
```

</TabItem>

<TabItem value='go'>

```go
err = client.CreateCollection(ctx, milvusclient.NewCreateCollectionOption("my_collection", schema).
    WithProperty(common.CollectionTTLConfigKey, 1209600)) //  TTL in seconds
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
export params='{
    "ttlSeconds": 1209600
}'

export CLUSTER_ENDPOINT="YOUR_CLUSTER_ENDPOINT"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/create" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"my_collection\",
    \"schema\": $schema,
    \"params\": $params
}"
```

</TabItem>
</Tabs>

### Set TTL for an existing collection\{#set-ttl-for-an-existing-collection}

The following code snippet demonstrates how to alter the TTL property in an existing collection.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.alter_collection_properties(
    collection_name="my_collection",
    properties={"collection.ttl.seconds": 1209600}
)
```

</TabItem>

<TabItem value='java'>

```java
AlterCollectionPropertiesReq alterCollectionReq = AlterCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .property(Constant.TTL_SECONDS, "1209600")
        .build();

client.alterCollectionProperties(alterCollectionReq);
```

</TabItem>

<TabItem value='javascript'>

```javascript
res = await client.alterCollection({
    collection_name: "my_collection",
    properties: {
        "collection.ttl.seconds": 1209600
    }
})
```

</TabItem>

<TabItem value='go'>

```go
err = client.AlterCollectionProperties(ctx, milvusclient.NewAlterCollectionPropertiesOption("my_collection").
    WithProperty(common.CollectionTTLConfigKey, 60))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/alter_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"my_collection\",
    \"properties\": {
        \"collection.ttl.seconds\": 1209600
    }
}"
```

</TabItem>
</Tabs>

## Drop TTL setting\{#drop-ttl-setting}

If you decide to keep the data in a collection indefinitely, you can simply drop the TTL setting from that collection.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.drop_collection_properties(
    collection_name="my_collection",
    property_keys=["collection.ttl.seconds"]
)
```

</TabItem>

<TabItem value='java'>

```java
client.dropCollectionProperties(DropCollectionPropertiesReq.builder()
        .collectionName("my_collection")
        .propertyKeys(Collections.singletonList(Constant.TTL_SECONDS))
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
res = await client.dropCollectionProperties({
    collection_name: "my_collection",
    properties: ["collection.ttl.seconds"]
})
```

</TabItem>

<TabItem value='go'>

```go
err = client.DropCollectionProperties(ctx, milvusclient.NewDropCollectionPropertiesOption("my_collection", common.CollectionTTLConfigKey))
if err != nil {
    fmt.Println(err.Error())
    // handle error
}
```

</TabItem>

<TabItem value='bash'>

```bash
curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/collections/drop_properties" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d "{
    \"collectionName\": \"my_collection\",
    \"propertyKeys\": [
        \"collection.ttl.seconds\"
    ]
}"
```

</TabItem>
</Tabs>

## FAQs\{#faqs}

### When does data expire due to TTL settings?\{#when-does-data-expire-due-to-ttl-settings}

Currently, the data expires based on the time point at which it was inserted or upserted. Expired data will not be displayed in search results. For details, refer to [Examples](./set-collection-ttl#examples).

### When will the expired data be physically deleted?\{#when-will-the-expired-data-be-physically-deleted}

Once the data expires, it will not be included in any search results. However, it will be physically deleted only after the subsequent system compaction, according to your cluster's compaction policies.

If you need to delete the data shortly after it expires, [contact us](https://support.zilliz.com/hc/en-us/requests/new).

### When will the CU capacity decrease?\{#when-will-the-cu-capacity-decrease}

The CU capacity of a cluster is whichever is higher between memory usage and storage usage. If storage usage applies, you can view the decrease in the CU capacity on the Zilliz Cloud console after the expired data is physically deleted.

