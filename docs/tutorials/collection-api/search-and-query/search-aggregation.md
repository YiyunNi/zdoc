---
title: "Search Aggregation | Cloud"
slug: /search-aggregation
sidebar_label: "Search Aggregation"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "Search Aggregation extends vector search with grouped results. It organizes retrieved entities into groups based on scalar field values and can return both representative hits and group-level statistics. | Cloud"
type: origin
token: Fighwx5zFiwaoIkV4q5cAJ1enDg
sidebar_position: 21
keywords: 
  - zilliz
  - vector database
  - cloud
  - collection
  - search aggregation

---

import Admonition from '@theme/Admonition';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Search Aggregation

Search Aggregation extends vector search with grouped results. It organizes retrieved entities into groups based on scalar field values and can return both representative hits and group-level statistics.

For example, assume that you build an ecommerce product search and a user searches with an image of a running shoe. A regular vector search may return many similar products from the same brand. With Search Aggregation, Zilliz Cloud can group the retrieved products by `brand`, return representative products from each brand, and compute group-level statistics such as product count, average price, or minimum price.

## Limits\{#limits}

- `group_by` cannot be used together with `limit`. Use the root `GroupBy.size` value to control how many top-level groups to return.

- `group_by` cannot be used together with the legacy `group_by_field` parameter in the same search request.

- In the first release, `group_by` cannot be used together with hybrid search or `highlight`.

- In the first release, `GroupBy.fields` can include at most one JSON field across all grouping levels.

- The maximum nesting depth is 10.

- The product of all `GroupBy.size` values across nested levels, multiplied by `group_count_safe_factor`, must not exceed 65,535.

- Group-level statistics are approximate because Search Aggregation computes them over ANN-retrieved entities, not over the full collection.

## From Grouping Search to Search Aggregation\{#from-grouping-search-to-search-aggregation}

Zilliz Cloud already supports Grouping Search since v2.4.x, which groups search results by one scalar field and returns hits from each group. Search Aggregation uses the new `group_by=GroupBy(...)` API to express the same basic pattern and adds group-level statistics, multi-field grouping, group ordering, hit sorting, and nested groups.

Existing `group_by_field`, `group_size`, and `strict_group_size` parameters remain supported for compatibility. Use `group_by=GroupBy(...)` for new Search Aggregation workflows.

<table>
   <tr>
     <th><p><strong>Capability</strong></p></th>
     <th><p><strong>Grouping Search</strong></p></th>
     <th><p><strong>Search Aggregation</strong></p></th>
   </tr>
   <tr>
     <td><p>API param</p></td>
     <td><p><code>group_by_field</code></p></td>
     <td><p><code>group_by=GroupBy(...)</code></p></td>
   </tr>
   <tr>
     <td><p>Grouping fields</p></td>
     <td><p>One scalar field</p></td>
     <td><p>One or multiple scalar fields</p></td>
   </tr>
   <tr>
     <td><p>Returned hits per group</p></td>
     <td><p><code>group_size</code></p></td>
     <td><p><code>TopHits.size</code></p></td>
   </tr>
   <tr>
     <td><p>Group-level statistics</p></td>
     <td><p>Not supported</p></td>
     <td><p>Supported with <code>metrics</code></p></td>
   </tr>
   <tr>
     <td><p>Control group ordering</p></td>
     <td><p>Not supported</p></td>
     <td><p>Supported with <code>GroupBy.order</code></p></td>
   </tr>
   <tr>
     <td><p>Control hit ordering within group</p></td>
     <td><p>Not supported</p></td>
     <td><p>Supported with <code>TopHits.sort</code></p></td>
   </tr>
   <tr>
     <td><p>Nested groups</p></td>
     <td><p>Not supported</p></td>
     <td><p>Supported with <code>sub_group</code></p></td>
   </tr>
</table>

## How it works\{#how-it-works}

![ZSvJbdc5potWw7xuXtdcSLD9nLh](https://zdoc-images.s3.us-west-2.amazonaws.com/zsvjbdc5potww7xuxtdcsld9nlh.png "ZSvJbdc5potWw7xuXtdcSLD9nLh")

Search Aggregation starts with vector search. In the ecommerce example, Zilliz Cloud first retrieves products similar to the query vector. Search Aggregation then organizes only these retrieved products into groups. It does not compute group-level statistics over the full product collection.

The `GroupBy` object defines how Zilliz Cloud organizes and summarizes the retrieved products. `fields=["brand"]` groups products by brand. `metrics` defines group-level statistics such as product count and average price. In this context, `metrics` means summary statistics computed for each group, such as count, average, sum, minimum, or maximum. This is different from vector search metric types such as `L2`, `IP`, or `COSINE`, which define how vector similarity is calculated.

The response contains grouped results. `GroupBy.size` controls how many groups are returned. `TopHits.size` controls how many representative products are returned within each group. If `sub_group` is configured, Zilliz Cloud repeats the grouping process inside each parent group.

## Prepare collection and data\{#prepare-collection-and-data}

The examples in this guide use an ecommerce product collection. Run the setup below before running the search examples.

<details>

<summary>Click to view the complete code example for preparing a product collection</summary>

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
from pymilvus import DataType, GroupBy, MilvusClient, TopHits

client = MilvusClient(uri="YOUR_CLUSTER_ENDPOINT")

collection_name = "product_search"

if client.has_collection(collection_name):
    client.drop_collection(collection_name)

schema = client.create_schema(auto_id=False, enable_dynamic_field=False)
schema.add_field("id", DataType.INT64, is_primary=True)
schema.add_field("embedding", DataType.FLOAT_VECTOR, dim=5)
schema.add_field("name", DataType.VARCHAR, max_length=200)
schema.add_field("brand", DataType.VARCHAR, max_length=100)
schema.add_field("category", DataType.VARCHAR, max_length=100)
schema.add_field("color", DataType.VARCHAR, max_length=50)
schema.add_field("price", DataType.DOUBLE)
schema.add_field("rating", DataType.DOUBLE)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name="embedding",
    index_type="AUTOINDEX",
    metric_type="COSINE",
)

client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params,
)

client.insert(
    collection_name=collection_name,
    data=[
        {
            "id": 1,
            "embedding": [0.12, 0.42, 0.18, 0.66, 0.31],
            "name": "Nike Air Zoom Runner",
            "brand": "Nike",
            "category": "running_shoes",
            "color": "black",
            "price": 129.99,
            "rating": 4.7,
        },
        {
            "id": 2,
            "embedding": [0.10, 0.39, 0.20, 0.61, 0.29],
            "name": "Nike Pegasus Trail",
            "brand": "Nike",
            "category": "running_shoes",
            "color": "blue",
            "price": 139.99,
            "rating": 4.6,
        },
        {
            "id": 3,
            "embedding": [0.14, 0.44, 0.19, 0.68, 0.33],
            "name": "Adidas Ultraboost Light",
            "brand": "Adidas",
            "category": "running_shoes",
            "color": "white",
            "price": 159.99,
            "rating": 4.8,
        },
        {
            "id": 4,
            "embedding": [0.16, 0.41, 0.22, 0.62, 0.30],
            "name": "Puma Velocity Nitro",
            "brand": "Puma",
            "category": "running_shoes",
            "color": "red",
            "price": 119.99,
            "rating": 4.4,
        },
        {
            "id": 5,
            "embedding": [0.48, 0.20, 0.59, 0.15, 0.71],
            "name": "Nike Windrunner Jacket",
            "brand": "Nike",
            "category": "jackets",
            "color": "black",
            "price": 99.99,
            "rating": 4.5,
        },
        {
            "id": 6,
            "embedding": [0.45, 0.18, 0.55, 0.17, 0.69],
            "name": "Adidas Own The Run Jacket",
            "brand": "Adidas",
            "category": "jackets",
            "color": "blue",
            "price": 89.99,
            "rating": 4.3,
        },
    ],
)

client.load_collection(collection_name)

query_vector = [0.11, 0.40, 0.19, 0.64, 0.30]

search_params = {
    "metric_type": "COSINE",
    "params": {},
}
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='javascript'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

</details>

## Use Search Aggregation\{#use-search-aggregation}

The following sections build one search aggregation request step by step. Each example uses the product collection prepared above.

### Start with grouped search results\{#start-with-grouped-search-results}

The minimum Search Aggregation request groups retrieved products and returns representative hits from each group.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="embedding",
    search_params=search_params,
    output_fields=["name", "brand", "price", "rating"],
    # highlight-start
    group_by=GroupBy(
        fields=["brand"],
        size=10,
        top_hits=TopHits(size=3),
    ),
    # highlight-end
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='javascript'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

In this example, Zilliz Cloud groups retrieved products by `brand`, returns up to 10 brand groups, and returns up to 3 representative products from each group.

If the retrieval pool contains more than 10 brands, Zilliz Cloud needs a default rule to decide which 10 brand groups to return. When `GroupBy.order` is omitted, Zilliz Cloud selects and ranks groups by the best vector similarity score in each group. A brand with a highly similar product is more likely to appear than a brand whose retrieved products are less similar.

At this stage, no group-level statistics are involved. The request uses vector similarity to select groups and to select representative products within each group.

### Add group-level statistics\{#add-group-level-statistics}

You can use `metrics` to compute summary statistics for each group.

In Search Aggregation, `metrics` means summary statistics computed for each group, such as count, average, sum, minimum, or maximum. This is different from vector search metric types such as `L2`, `IP`, or `COSINE`, which define how vector similarity is calculated.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="embedding",
    search_params=search_params,
    output_fields=["name", "brand", "price", "rating"],
    group_by=GroupBy(
        fields=["brand"],
        size=10,
        # highlight-start
        metrics={
            "product_count": {"count": "*"},
            "avg_price": {"avg": "price"},
            "min_price": {"min": "price"},
        },
        # highlight-end
        top_hits=TopHits(size=3),
    ),
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='javascript'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

Each item in `metrics` has three parts:

- The outer key, such as `avg_price`, is the metric alias. The response uses this alias, and `GroupBy.order` can reference it.

- The inner key, such as `avg`, is the aggregation operation. Supported operations are `count`, `sum`, `avg`, `min`, and `max`.

- The inner value, such as `price`, is the field to aggregate.

For `count`, use `{"count": "*"}` to count all retrieved entities in the group. For `sum`, `avg`, `min`, and `max`, specify the numeric field to aggregate, such as `{"avg": "price"}`. You can also use `_score` as the input field for `sum`, `avg`, `min`, and `max` to summarize vector similarity scores within each group.

In the example above, `product_count` counts retrieved products in each brand group, `avg_price` computes the average product price in each brand group, and `min_price` computes the lowest product price in each brand group.

### Control which groups are returned\{#control-which-groups-are-returned}

If there are more groups than `GroupBy.size`, Zilliz Cloud needs a rule for selecting the returned groups. Use `GroupBy.order` to control group selection and group ranking.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="embedding",
    search_params=search_params,
    output_fields=["name", "brand", "price", "rating"],
    group_by=GroupBy(
        fields=["brand"],
        size=10,
        metrics={
            "product_count": {"count": "*"},
            "avg_price": {"avg": "price"},
            "min_price": {"min": "price"},
        },
        # highlight-start
        order=[{"avg_price": "desc"}, {"product_count": "desc"}],
        # highlight-end
        top_hits=TopHits(size=3),
    ),
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='javascript'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

In this example, Zilliz Cloud first ranks brand groups by `avg_price` in descending order. If multiple groups have the same `avg_price`, Zilliz Cloud then ranks them by `product_count` in descending order.

Valid `GroupBy.order` keys are:

- A metric alias defined in `metrics` on the same `GroupBy` level, such as `avg_price`.

- `_count`, a built-in ordering key that orders groups by the number of retrieved entities in the group.

- `_key`, a built-in ordering key that orders groups by the group key.

`GroupBy.order` applies to groups, not to individual products.

### Control which products are returned within each group\{#control-which-products-are-returned-within-each-group}

Use `TopHits.sort` to control which products are returned within each group.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="embedding",
    search_params=search_params,
    output_fields=["name", "brand", "price", "rating"],
    group_by=GroupBy(
        fields=["brand"],
        size=10,
        metrics={
            "product_count": {"count": "*"},
            "avg_price": {"avg": "price"},
            "min_price": {"min": "price"},
        },
        order=[{"avg_price": "desc"}, {"product_count": "desc"}],
        top_hits=TopHits(
            size=3,
            # highlight-next-line
            sort=[{"field": "rating", "order": "desc"}],
        ),
    ),
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='javascript'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

`GroupBy.order` selects and ranks groups. `TopHits.sort` selects and ranks products inside each group. In the example above, Zilliz Cloud returns the highest-rated products from each selected brand group.

`TopHits.sort` does not change group-level statistics or group selection. For example, sorting products by `rating` does not change `avg_price` or which brand groups are returned.

### Group by multiple fields\{#group-by-multiple-fields}

You can pass multiple fields to `GroupBy.fields` to create groups based on field combinations.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="embedding",
    search_params=search_params,
    output_fields=["name", "brand", "color", "price", "rating"],
    group_by=GroupBy(
        # highlight-next-line
        fields=["brand", "color"],
        size=10,
        metrics={
            "product_count": {"count": "*"},
            "avg_price": {"avg": "price"},
        },
        order=[{"avg_price": "desc"}],
        top_hits=TopHits(size=3),
    ),
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='javascript'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

Grouping by `brand` creates groups such as Nike, Adidas, and Puma. Grouping by `brand` and `color` creates more specific groups such as Nike-black, Nike-blue, Adidas-white, and Puma-red.

### Build nested groups\{#build-nested-groups}

Use `sub_group` to build nested groups. For example, you can first group retrieved products by `category`, then group products within each category by `brand`.

<Tabs groupId="code" defaultValue='python' values={[{"label":"Python","value":"python"},{"label":"Java","value":"java"},{"label":"NodeJS","value":"javascript"},{"label":"Go","value":"go"},{"label":"cURL","value":"bash"}]}>
<TabItem value='python'>

```python
results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field="embedding",
    search_params=search_params,
    output_fields=["name", "category", "brand", "price", "rating"],
    # highlight-start
    group_by=GroupBy(
        fields=["category"],
        size=5,
        metrics={
            "product_count": {"count": "*"},
            "avg_price": {"avg": "price"},
        },
        order=[{"product_count": "desc"}],
        sub_group=GroupBy(
            fields=["brand"],
            size=3,
            metrics={
                "brand_count": {"count": "*"},
                "avg_rating": {"avg": "rating"},
            },
            order=[{"avg_rating": "desc"}],
            top_hits=TopHits(size=2),
        ),
    ),
    # highlight-end
)
```

</TabItem>

<TabItem value='java'>

```java
// java
```

</TabItem>

<TabItem value='javascript'>

```javascript
// nodejs
```

</TabItem>

<TabItem value='go'>

```go
// go
```

</TabItem>

<TabItem value='bash'>

```bash
# restful
```

</TabItem>
</Tabs>

Each grouping level has its own `fields`, `size`, `metrics`, `order`, and `top_hits`. A grouping level can omit `top_hits` if it should return only group keys, statistics, and sub-groups.

In the example above, the top level returns category groups. Within each category group, `sub_group` returns brand groups and up to 2 representative products for each brand group.

## Understand approximate results\{#understand-approximate-results}

Search Aggregation computes group-level statistics over the ANN retrieval pool, not over the full collection. This behavior is intentional: Search Aggregation is part of vector search and summarizes the entities that the search retrieves.

For example, `product_count` means the number of retrieved products in the group, not the total number of products in the collection. If the collection contains 5,000 Nike products but only 35 Nike products are in the ANN retrieval pool for a query, `product_count` is based on those 35 retrieved products.

Approximation matters most when you use group-level statistics for ordering. If `GroupBy.order` uses `avg_price`, then approximate `avg_price` values can affect which groups are returned. Nested grouping can amplify this effect because child groups are built from an already limited retrieval pool.

