# Zilliz Cloud Vector Search — AI Assistant Context

You are helping a developer implement vector search with Zilliz Cloud. Cover ANN search,
hybrid search (dense + sparse), filtering, range search, and reranking.

## Basic ANN Search (Python)

```python
results = client.search(
    collection_name="my_collection",
    data=[[0.1, 0.2, ...]],         # query vector(s)
    anns_field="vector",             # vector field name
    limit=10,
    output_fields=["id", "text"],
    search_params={
        "metric_type": "COSINE",
        "params": {"nprobe": 10},    # IVF_FLAT tuning
    },
)
# results[0] = list of hits; each hit: {"id": ..., "distance": ..., "entity": {...}}
```

## Filtered Search

```python
results = client.search(
    collection_name="my_collection",
    data=[[...]],
    limit=10,
    filter='category == "tech" and score > 0.8',
    output_fields=["id", "title", "category"],
)
```

## Range Search (radius-based)

```python
results = client.search(
    collection_name="my_collection",
    data=[[...]],
    limit=100,
    search_params={
        "metric_type": "COSINE",
        "params": {
            "radius": 0.4,          # minimum similarity threshold
            "range_filter": 0.9,    # maximum similarity (optional upper bound)
        },
    },
)
```

## Grouping Search (deduplicate by field)

```python
results = client.search(
    collection_name="my_collection",
    data=[[...]],
    limit=3,
    group_by_field="category",      # return top-1 per category value
    output_fields=["id", "category"],
)
```

## Hybrid Search: Dense + Sparse (Python)

```python
from pymilvus import AnnSearchRequest, WeightedRanker, RRFRanker

dense_req = AnnSearchRequest(
    data=[[...dense vector...]],
    anns_field="dense",
    param={"metric_type": "COSINE"},
    limit=20,
    expr='category == "tech"',       # per-request filter
)
sparse_req = AnnSearchRequest(
    data=[[...sparse vector...]],    # e.g. from BM25
    anns_field="sparse",
    param={"metric_type": "IP"},
    limit=20,
)

results = client.hybrid_search(
    collection_name="my_collection",
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=60),          # or WeightedRanker(0.7, 0.3)
    limit=5,
    output_fields=["id", "text"],
)
```

## Full-Text Search (BM25 Function)

```python
from pymilvus import Function, FunctionType

# Schema setup
schema = MilvusClient.create_schema()
schema.add_field("id",     DataType.INT64,               is_primary=True)
schema.add_field("text",   DataType.VARCHAR,              max_length=1000, enable_analyzer=True)
schema.add_field("sparse", DataType.SPARSE_FLOAT_VECTOR)

schema.add_function(Function(
    name="bm25",
    input_field_names=["text"],
    output_field_names=["sparse"],
    function_type=FunctionType.BM25,
))

# Search with text query string (no embedding needed)
results = client.search(
    collection_name="my_collection",
    data=["what is vector search"],  # string query for BM25
    anns_field="sparse",
    limit=10,
    search_params={"metric_type": "BM25"},
)
```

## Reranking Strategies

| Ranker | When to use |
|--------|-------------|
| `RRFRanker(k=60)` | Default hybrid; balanced recall, no weights needed |
| `WeightedRanker(0.7, 0.3)` | Dense dominant; adjust per use case |
| `WeightedRanker(0.3, 0.7)` | Sparse/keyword dominant |

Weights in `WeightedRanker` correspond positionally to the `reqs` list.

## Filter Expression Reference

| Operator | Example |
|----------|---------|
| `==`, `!=` | `color == "red"` |
| `>`, `<`, `>=`, `<=` | `score >= 0.9` |
| `in`, `not in` | `tag in ["ai", "ml"]` |
| `like` | `title like "Vector%"` |
| `and`, `or`, `not` | `score > 0.8 and tag == "ml"` |
| JSON key | `meta["lang"] == "en"` |
| ARRAY contains | `ARRAY_CONTAINS(tags, "ai")` |

## Consistency Levels

| Level | Behavior | Use case |
|-------|----------|----------|
| `Strong` | Always reads latest | Auditing, high correctness |
| `Bounded` | Slightly stale (default) | Most use cases |
| `Session` | Reads own writes | Single-session consistency |
| `Eventually` | Fastest, may miss recent | High throughput, analytics |

## Pagination

```python
# Page 1
results = client.search(..., limit=10, offset=0)
# Page 2
results = client.search(..., limit=10, offset=10)
# Limit + offset must be < 16,384
```

## Do / Don't

**Do:**
- Always specify `metric_type` in `search_params` (must match the index)
- Use `output_fields` — fetching fewer fields is faster
- For hybrid search, assign each `AnnSearchRequest` its own `limit` (pre-merge candidate count)
- Load the collection before searching

**Don't:**
- Don't mix `metric_type` between index and search
- Don't use `limit + offset >= 16384`
- Don't perform range search without `radius`; `range_filter` is optional
- Don't search unloaded partitions (load them first)
