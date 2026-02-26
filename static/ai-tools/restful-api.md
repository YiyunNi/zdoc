# Zilliz Cloud RESTful API v2 — AI Assistant Context

You are helping a developer use the Zilliz Cloud RESTful API v2.
Base URL: `https://<cluster-endpoint>.zillizcloud.com`
All endpoints are under `/v2/vectordb/`.

## Authentication

```http
Authorization: Bearer <api-key>
Content-Type: application/json
```

All requests require the `Authorization` header. API keys are created in the Zilliz Cloud console
under **Project Settings → API Keys**.

## Search

```http
POST /v2/vectordb/entities/search
```

```json
{
  "dbName": "default",
  "collectionName": "my_collection",
  "data": [[0.3, -0.6, 0.18]],
  "annsField": "vector",
  "filter": "category == \"tech\"",
  "limit": 10,
  "offset": 0,
  "outputFields": ["id", "title", "category"],
  "searchParams": {
    "metricType": "COSINE",
    "params": {
      "nprobe": 10
    }
  }
}
```

Response:
```json
{
  "code": 0,
  "data": [
    {"id": 42, "distance": 0.95, "title": "Vector databases explained", "category": "tech"}
  ]
}
```

## Hybrid Search

```http
POST /v2/vectordb/entities/hybrid_search
```

```json
{
  "collectionName": "my_collection",
  "search": [
    {
      "data": [[...dense vector...]],
      "annsField": "dense",
      "limit": 20,
      "metricType": "COSINE"
    },
    {
      "data": [[...sparse vector...]],
      "annsField": "sparse",
      "limit": 20,
      "metricType": "IP"
    }
  ],
  "rerank": {
    "strategy": "rrf",
    "params": {"k": 60}
  },
  "limit": 5,
  "outputFields": ["id", "title"]
}
```

Reranking strategies: `"rrf"` (Reciprocal Rank Fusion) or `"weighted"` (provide `weights` array).

## Insert

```http
POST /v2/vectordb/entities/insert
```

```json
{
  "collectionName": "my_collection",
  "data": [
    {"id": 1, "vector": [0.1, 0.2, 0.3], "title": "Hello"},
    {"id": 2, "vector": [0.4, 0.5, 0.6], "title": "World"}
  ]
}
```

## Upsert

```http
POST /v2/vectordb/entities/upsert
```

Same body as insert. Overwrites existing entities with matching primary keys.

## Delete

```http
POST /v2/vectordb/entities/delete
```

```json
{
  "collectionName": "my_collection",
  "filter": "id in [1, 2, 3]"
}
```

## Query (filter-only, no vector)

```http
POST /v2/vectordb/entities/query
```

```json
{
  "collectionName": "my_collection",
  "filter": "category == \"tech\" and score > 0.8",
  "outputFields": ["id", "title", "score"],
  "limit": 20,
  "offset": 0
}
```

## Get by ID

```http
POST /v2/vectordb/entities/get
```

```json
{
  "collectionName": "my_collection",
  "id": [1, 2, 3],
  "outputFields": ["id", "title"]
}
```

## Collection Management

### Create Collection
```http
POST /v2/vectordb/collections/create
```
```json
{
  "collectionName": "my_collection",
  "dimension": 768,
  "metricType": "COSINE",
  "primaryFieldName": "id",
  "vectorFieldName": "vector",
  "autoId": false
}
```

### List Collections
```http
GET /v2/vectordb/collections/list?dbName=default
```

### Describe Collection
```http
GET /v2/vectordb/collections/describe?collectionName=my_collection&dbName=default
```

### Drop Collection
```http
POST /v2/vectordb/collections/drop
```
```json
{"collectionName": "my_collection"}
```

### Load / Release Collection
```http
POST /v2/vectordb/collections/load
POST /v2/vectordb/collections/release
```
```json
{"collectionName": "my_collection"}
```

## Index Management

### Create Index
```http
POST /v2/vectordb/indexes/create
```
```json
{
  "collectionName": "my_collection",
  "indexParams": [
    {
      "fieldName": "vector",
      "indexName": "vector_index",
      "metricType": "COSINE",
      "indexType": "AUTOINDEX",
      "params": {"level": 2}
    }
  ]
}
```

### List Indexes
```http
GET /v2/vectordb/indexes/list?collectionName=my_collection
```

### Drop Index
```http
POST /v2/vectordb/indexes/drop
```
```json
{"collectionName": "my_collection", "indexName": "vector_index"}
```

## Partition Management

```http
POST /v2/vectordb/partitions/create
{"collectionName": "my_collection", "partitionName": "region_us"}

GET /v2/vectordb/partitions/list?collectionName=my_collection

POST /v2/vectordb/partitions/load
{"collectionName": "my_collection", "partitionNames": ["region_us"]}

POST /v2/vectordb/partitions/drop
{"collectionName": "my_collection", "partitionName": "region_us"}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Generic error — check `message` field |
| 800 | Collection not loaded |
| 1100 | Invalid parameter |
| 1800 | Rate limit exceeded |
| 65535 | Internal server error |

## Rate Limits

- **Free tier**: 5 QPS per collection
- **Standard tier**: up to 500 QPS (contact Zilliz for higher)
- On `429 Too Many Requests`: implement exponential backoff

```python
import httpx, time

def search_with_retry(payload, max_retries=3):
    for attempt in range(max_retries):
        r = httpx.post(url, headers=headers, json=payload)
        if r.status_code == 429:
            time.sleep(2 ** attempt)
            continue
        r.raise_for_status()
        return r.json()
    raise RuntimeError("Rate limit exceeded after retries")
```

## Bulk Import

```http
POST /v2/vectordb/jobs/import/create
```
```json
{
  "collectionName": "my_collection",
  "files": [["s3://bucket/data/part1.parquet"]],
  "options": {"timeout": "300s"}
}
```

Supported formats: `parquet`, `npy`, `json`, `csv`.

## Do / Don't

**Do:**
- Always send `Content-Type: application/json`
- Check `code == 0` in the response before reading `data`
- Use `offset` + `limit` for pagination (sum must be < 16,384)
- Load the collection before searching (`/collections/load`)
- Store the API key in an environment variable, never hardcode it

**Don't:**
- Don't send arrays with mixed types in `data` fields
- Don't omit `dbName` when using multiple databases
- Don't search before the collection is loaded (returns error code 800)
- Don't use `GET` for mutation endpoints — all writes are `POST`
- Don't retry on `4xx` errors without fixing the request (only retry `429` and `5xx`)
