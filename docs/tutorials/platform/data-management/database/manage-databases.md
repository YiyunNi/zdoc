---
title: "Manage Databases | Cloud"
slug: /manage-databases
sidebar_label: "Manage Databases"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "This page covers how to manage databases on Zilliz Cloud. | Cloud"
type: origin
token: ELzBw4WFNiu7X0kPTXyc0SLVnlc
sidebar_position: 2

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manage Databases

This page covers how to manage databases on Zilliz Cloud.

## View databases\{#view-databases}

You can use list database to view all existing databases and describe database to view the details of a specific database.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
# List all existing databases
client.list_databases()

# Output
# ['default', 'my_database_1', 'my_database_2']

# Check database details
client.describe_database(
    db_name="default"
)

# Output
# {"name": "default"}
```

</TabItem>

<TabItem value='java'>

```java
import io.milvus.v2.service.database.response.*;

ListDatabasesResp listDatabasesResp = client.listDatabases();

DescribeDatabaseResp descDBResp = client.describeDatabase(DescribeDatabaseReq.builder()
        .databaseName("default")
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
await client.describeDatabase({ 
    db_name: 'default'
});
```

</TabItem>

<TabItem value='go'>

```go
// List all existing databases
databases, err := cli.ListDatabase(ctx, milvusclient.NewListDatabaseOption())
if err != nil {
    // handle err
}
log.Println(databases)

db, err := cli.DescribeDatabase(ctx, milvusclient.NewDescribeDatabaseOption("default"))
if err != nil {
    // handle err
}
log.Println(db)
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/databases/describe" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "default"
}'
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Note">

<p>To view databases in on-demand compute, please replace the cluster endpoint with the on-demand compute endpoint (eg. <code>https:*//*\{project-id\}.\{region\}.api.zillizcloud.com</code>.</p>

</Admonition>

## Drop databases\{#drop-databases}

Once a database is no longer needed, you can drop the database. Note that:

- Default cluster databases cannot be dropped.

- Before dropping a database, you need to drop all collections in the database first.

- Dropped databases are permanently removed and cannot be recovered.

You can drop a database either via SDKs or on the web console.

- **Via SDKs**

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
client.drop_database(
    db_name="my_database_2"
)
```

</TabItem>

<TabItem value='java'>

```java
client.dropDatabase(DropDatabaseReq.builder()
        .databaseName("my_database_2")
        .build());
```

</TabItem>

<TabItem value='javascript'>

```javascript
await milvusClient.dropDatabase({
  db_name: "my_database_2",
});
```

</TabItem>

<TabItem value='go'>

```go
err = cli.DropDatabase(ctx, milvusclient.NewDropDatabaseOption("my_database_2"))
if err != nil {
    // handle err
}
```

</TabItem>

<TabItem value='bash'>

```bash
export CLUSTER_ENDPOINT="https://{cluster-id}.{region}.vectordb.zillizcloud.com:19530"
export TOKEN="YOUR_CLUSTER_TOKEN"

curl --request POST \
--url "${CLUSTER_ENDPOINT}/v2/vectordb/databases/drop" \
--header "Authorization: Bearer ${TOKEN}" \
--header "Content-Type: application/json" \
-d '{
    "dbName": "my_database"
}'
```

</TabItem>
</Tabs>

<Admonition type="info" icon="📘" title="Note">

<p>To drop databases in on-demand compute, please replace the cluster endpoint with the on-demand compute endpoint (eg. <code>https:*//*\{project-id\}.\{region\}.api.zillizcloud.com</code>.</p>

</Admonition>

- **Via web console**

    ![PeESb6tq0oPbqexLbiqcIbmnnXg](https://zdoc-images.s3.us-west-2.amazonaws.com/peesb6tq0opbqexlbiqcibmnnxg.png "PeESb6tq0oPbqexLbiqcIbmnnXg")

    