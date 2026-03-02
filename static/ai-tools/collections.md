# Zilliz Cloud Collection Management — AI Assistant Context

You are helping a developer manage collections, indexes, and partitions on Zilliz Cloud
using the Python SDK (MilvusClient). Always prefer MilvusClient over ORM-style code.

## Connection

```python
from pymilvus import MilvusClient

client = MilvusClient(
    uri="https://<cluster-endpoint>.zillizcloud.com",
    token="<api-key>",
)
```

## Create Collection

### Quick setup (auto schema, good for prototyping)
```python
client.create_collection(
    collection_name="my_collection",
    dimension=768,
    metric_type="COSINE",   # L2 | IP | COSINE
    auto_id=False,
)
```

### Full custom schema
```python
from pymilvus import MilvusClient, DataType

schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,   # allows extra fields not in schema
)
schema.add_field("id",        DataType.INT64,        is_primary=True)
schema.add_field("vector",    DataType.FLOAT_VECTOR, dim=768)
schema.add_field("category",  DataType.VARCHAR,      max_length=128)
schema.add_field("score",     DataType.FLOAT)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name="id",
    index_type="STL_SORT",
)
index_params.add_index(
    field_name="vector",
    index_type="AUTOINDEX",
    metric_type="COSINE",
    params={"level": 2},    # 1 (performance) – 5 (recall)
)
index_params.add_index(
    field_name="category",
    index_type="INVERTED",  # for scalar filtering
)

client.create_collection(
    collection_name="my_collection",
    schema=schema,
    index_params=index_params,
)
```

## Field Data Types

| DataType | Notes |
|----------|-------|
| `INT8`, `INT16`, `INT32`, `INT64` | Integer scalars |
| `FLOAT`, `DOUBLE` | Floating-point scalars |
| `BOOL` | Boolean |
| `VARCHAR` | String; requires `max_length` (max 65,535) |
| `JSON` | Semi-structured; no index support |
| `ARRAY` | Typed array; requires `element_type` and `max_capacity` |
| `FLOAT_VECTOR` | Dense vector; requires `dim` |
| `SPARSE_FLOAT_VECTOR` | Sparse vector (BM25 / SPLADE) |
| `BINARY_VECTOR` | Bit-packed binary; `dim` must be multiple of 8 |

## List / Describe / Drop Collections

```python
collections = client.list_collections()
info = client.describe_collection(collection_name="my_collection")
client.drop_collection(collection_name="my_collection")
```

## Load / Release

Collections must be loaded into memory before search/query.

```python
client.load_collection(collection_name="my_collection")
client.release_collection(collection_name="my_collection")  # free memory
state = client.get_load_state(collection_name="my_collection")
# state: {"state": "Loaded"} | {"state": "NotLoad"} | {"state": "Loading", "progress": 60}
```

## Index Management

```python
# Create index on existing collection
index_params = client.prepare_index_params()
index_params.add_index(field_name="vector", index_type="HNSW", metric_type="COSINE",
                       params={"M": 16, "efConstruction": 256})
client.create_index(collection_name="my_collection", index_params=index_params)

# List indexes
indexes = client.list_indexes(collection_name="my_collection")

# Drop index
client.drop_index(collection_name="my_collection", index_name="vector")
```

## Index Types for Vector Fields

| Index | Params | Notes |
|-------|--------|-------|
| `AUTOINDEX` | `level` (1–5) | Recommended; auto-tuned |
| `HNSW` | `M`, `efConstruction` | High recall; more RAM |
| `IVF_FLAT` | `nlist` | Lower RAM; slightly less recall |
| `FLAT` | — | Brute-force; exact; slow at scale |
| `SPARSE_INVERTED_INDEX` | `drop_ratio_build` | For sparse vectors |

## Partition Management

```python
# Create
client.create_partition(collection_name="my_collection", partition_name="region_us")

# List
partitions = client.list_partitions(collection_name="my_collection")
# ["_default", "region_us"]

# Check existence
exists = client.has_partition(collection_name="my_collection", partition_name="region_us")

# Load / release specific partitions
client.load_partitions(collection_name="my_collection", partition_names=["region_us"])
client.release_partitions(collection_name="my_collection", partition_names=["region_us"])

# Drop
client.drop_partition(collection_name="my_collection", partition_name="region_us")
```

## Partition Key (multi-tenancy)

```python
# Mark a VARCHAR field as partition key
schema.add_field("tenant_id", DataType.VARCHAR, max_length=64, is_partition_key=True)

# Insert — routing is automatic
client.insert("my_collection", [{"id": 1, "vector": [...], "tenant_id": "acme"}])

# Search — filter on partition key activates partition pruning
results = client.search(
    collection_name="my_collection",
    data=[[...]],
    filter='tenant_id == "acme"',
    limit=10,
)
```

## Collection Aliases

```python
client.create_alias(collection_name="my_collection_v2", alias="my_collection_prod")
client.alter_alias(collection_name="my_collection_v3", alias="my_collection_prod")
client.drop_alias(alias="my_collection_prod")
```

## Limits

| Resource | Limit |
|----------|-------|
| Collections per cluster | 16,384 |
| Partitions per collection (manual) | 1,024 |
| Partition key buckets (auto) | 64 (default), up to 4,096 |
| Fields per collection | 64 (scalars) + vector fields |
| VARCHAR max_length | 65,535 characters |
| ARRAY max_capacity | 4,096 elements |

## Do / Don't

**Do:**
- Always create an index on vector fields before loading
- Use `AUTOINDEX` for most cases — it auto-selects HNSW or IVF based on collection size
- Use `enable_dynamic_field=True` for flexible schemas during development
- Use partition keys for multi-tenant isolation (more scalable than manual partitions)
- Release collections when not in use to free cluster memory

**Don't:**
- Don't drop and recreate a collection just to change a field — add fields instead (`alter_collection`)
- Don't exceed 1,024 partitions per collection
- Don't rely on `JSON` field for high-frequency filtering (no index)
- Don't load a collection without an index — it will fail
