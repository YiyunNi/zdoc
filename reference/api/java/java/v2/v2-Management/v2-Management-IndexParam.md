---
title: "IndexParam | Java | v2"
slug: /java/java/v2-Management-IndexParam
sidebar_label: "IndexParam"
beta: false
added_since: v2.3.x
last_modified: v2.6.x
deprecate_since: false
notebook: false
description: "IndexParam defines the parameters for configuring an index on a collection field. It includes MetricType and IndexType enums. | Java | v2"
type: docx
token: K8hddB9vRotonhx7yVIcdCIEnhh
sidebar_position: 10
keywords: 
  - Context Window
  - Natural language search
  - Similarity Search
  - multimodal RAG
  - zilliz
  - zilliz cloud
  - cloud
  - IndexParam
  - javaV226
displayed_sidebar: javaSidebar

displayed_sidbar: javaSidebar
---

import Admonition from '@theme/Admonition';


# IndexParam

IndexParam defines the parameters for configuring an index on a collection field. It includes MetricType and IndexType enums.

```java
IndexParam.builder()
    .fieldName(String fieldName)
    .indexType(IndexType indexType)
    .metricType(MetricType metricType)
    .extraParams(Map<String, Object> extraParams)
    .build()
```

## MetricType\{#metrictype}

- `INVALID` - Invalid metric type (default).

- `L2` - Euclidean distance.

- `IP` - Inner product.

- `COSINE` - Cosine similarity.

- `HAMMING` - Hamming distance (for binary vectors).

- `JACCARD` - Jaccard distance (for binary vectors).

- `BM25` - BM25 scoring for full-text search.

- `MAX_SIM` - Maximum similarity for multi-vector search.

- `MAX_SIM_COSINE` - Maximum similarity using cosine distance.

- `MAX_SIM_IP` - Maximum similarity using inner product.

- `MAX_SIM_L2` - Maximum similarity using Euclidean distance.

- `MAX_SIM_JACCARD` - Maximum similarity using Jaccard distance.

- `MAX_SIM_HAMMING` - Maximum similarity using Hamming distance.

## IndexType\{#indextype}

- `FLAT` - Brute-force search (no index).

- `IVF_FLAT` - Inverted file index with flat storage.

- `IVF_SQ8` - Inverted file index with scalar quantization.

- `IVF_PQ` - Inverted file index with product quantization.

- `HNSW` - Hierarchical Navigable Small World graph.

- `HNSW_SQ` - HNSW with scalar quantization.

- `HNSW_PQ` - HNSW with product quantization.

- `HNSW_PRQ` - HNSW with product residual quantization.

- `DISKANN` - Disk-based approximate nearest neighbor.

- `AUTOINDEX` - Automatic index type selection.

- `SCANN` - ScaNN index.

- `IVF_RABITQ` - IVF with RaBitQ quantization.

- `GPU_IVF_FLAT` - GPU-accelerated IVF flat.

- `GPU_IVF_PQ` - GPU-accelerated IVF with product quantization.

- `GPU_BRUTE_FORCE` - GPU-accelerated brute-force search.

- `GPU_CAGRA` - GPU-accelerated CAGRA index.

- `BIN_FLAT` - Binary flat index.

- `BIN_IVF_FLAT` - Binary IVF flat index.

- `MINHASH_LSH` - MinHash LSH index for set similarity.

- `TRIE` - Trie index for string fields.

- `NGRAM` - N-gram index for text fields.

- `RTREE` - R-tree index for spatial data.

- `STL_SORT` - STL sort index for scalar fields.

- `INVERTED` - Inverted index for scalar fields.

- `BITMAP` - Bitmap index for low-cardinality fields.

- `SPARSE_INVERTED_INDEX` - Inverted index for sparse vectors.

- `SPARSE_WAND` - WAND index for sparse vectors.

## Example\{#example}

```java
import io.milvus.v2.common.IndexParam;

IndexParam indexParam = IndexParam.builder()
    .fieldName("vector")
    .indexType(IndexParam.IndexType.HNSW)
    .metricType(IndexParam.MetricType.COSINE)
    .extraParams(Map.of("M", 16, "efConstruction", 256))
    .build();
```
