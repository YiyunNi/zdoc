# Zilliz Cloud Python SDK — AI Assistant Context

You are helping a developer use the Zilliz Cloud Python SDK (pymilvus). Always use
MilvusClient (the new unified API) unless the user explicitly asks for ORM-style code.

## Connection

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="https://<cluster-endpoint>.zillizcloud.com",
    token="<api-key>",          # or user="...", password="..."
)
```

## Create Collection

### Quick setup (auto schema)
```python
client.create_collection(
    collection_name="my_collection",
    dimension=768,
    metric_type="COSINE",       # L2 | IP | COSINE
    auto_id=False,
)
```

### Custom schema
```python
from pymilvus import MilvusClient, DataType

schema = MilvusClient.create_schema(auto_id=False, enable_dynamic_field=True)
schema.add_field("id",     DataType.INT64,        is_primary=True)
schema.add_field("vector", DataType.FLOAT_VECTOR, dim=768)
schema.add_field("text",   DataType.VARCHAR,       max_length=512)

index_params = client.prepare_index_params()
index_params.add_index(field_name="id",     index_type="STL_SORT")
index_params.add_index(field_name="vector", index_type="AUTOINDEX", metric_type="COSINE")

client.create_collection(
    collection_name="my_collection",
    schema=schema,
    index_params=index_params,
)
```

## Insert / Upsert

```python
data = [
    {"id": 1, "vector": [0.1, 0.2, ...], "text": "hello"},
    {"id": 2, "vector": [0.3, 0.4, ...], "text": "world"},
]
client.insert(collection_name="my_collection", data=data)
# or
client.upsert(collection_name="my_collection", data=data)
```

## Search

```python
results = client.search(
    collection_name="my_collection",
    data=[[0.1, 0.2, ...]],     # list of query vectors
    limit=10,
    filter='text like "hello%"',
    output_fields=["id", "text"],
    search_params={"metric_type": "COSINE"},
)
```

## Hybrid Search (multi-vector)

```python
from pymilvus import AnnSearchRequest, WeightedRanker, RRFRanker

req1 = AnnSearchRequest(
    data=[[...dense vector...]],
    anns_field="dense",
    param={"metric_type": "COSINE"},
    limit=10,
)
req2 = AnnSearchRequest(
    data=[[...sparse vector...]],
    anns_field="sparse",
    param={"metric_type": "IP"},
    limit=10,
)

results = client.hybrid_search(
    collection_name="my_collection",
    reqs=[req1, req2],
    ranker=WeightedRanker(0.7, 0.3),   # or RRFRanker(k=60)
    limit=5,
    output_fields=["id", "text"],
)
```

## Query (by filter, no vector)

```python
results = client.query(
    collection_name="my_collection",
    filter='id in [1, 2, 3]',
    output_fields=["id", "text"],
    limit=10,
)
```

## Delete

```python
client.delete(collection_name="my_collection", filter='id in [1, 2]')
```

## Partition Management

```python
client.create_partition(collection_name="my_collection", partition_name="part_a")
client.load_partitions(collection_name="my_collection", partition_names=["part_a"])
client.release_partitions(collection_name="my_collection", partition_names=["part_a"])
partitions = client.list_partitions(collection_name="my_collection")
```

## Filter Expression Syntax

| Pattern | Example |
|---------|---------|
| Equality | `color == "red"` |
| Comparison | `count > 10` |
| Membership | `status in ["active", "pending"]` |
| String prefix | `name like "Alice%"` |
| AND / OR | `count > 5 and color == "blue"` |
| Parameterized | use `filter_params={"val": 42}` with `count > {val}` |

## Index Types

| Field type | Recommended index | Notes |
|-----------|-------------------|-------|
| FLOAT_VECTOR | AUTOINDEX | Unified, auto-tuned |
| FLOAT_VECTOR | HNSW | High recall, more RAM |
| FLOAT_VECTOR | IVF_FLAT | Lower RAM, slightly less recall |
| SPARSE_FLOAT_VECTOR | SPARSE_INVERTED_INDEX | For BM25 / sparse |
| INT64, VARCHAR | STL_SORT | Scalar filter acceleration |

## Metric Types

- `COSINE` — normalized vectors, most common for text embeddings
- `IP` — inner product (use when vectors are already unit-normalized)
- `L2` — Euclidean distance (good for image/spatial embeddings)

**Always use the same `metric_type` in index creation and in search.**

## Limits

| Resource | Limit |
|----------|-------|
| Collections per cluster | 16,384 |
| Partitions per collection | 1,024 |
| Pagination (limit + offset) | < 16,384 |
| VARCHAR max_length | 65,535 chars |

## Do / Don't

**Do:**
- Load the collection before searching (`client.load_collection(...)`)
- Provide `output_fields` to control payload and improve performance
- Use `enable_dynamic_field=True` for schemaless rows
- Use parameterized filters (`filter_params`) to avoid injection

**Don't:**
- Don't mix metric types between index and search calls
- Don't search an unloaded collection (will error)
- Don't rely on dynamic `$meta` field for critical indexed filtering
- Don't create more than 1,024 partitions per collection
