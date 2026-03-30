module.exports = [
  {
    "type": "category",
    "label": "Get Started",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/get-started/byoc-intro",
        "label": "BYOC Overview"
      },
      {
        "type": "doc",
        "id": "tutorials/get-started/register-with-zilliz-cloud",
        "label": "Register with Zilliz Cloud"
      },
      {
        "type": "category",
        "label": "Deploy BYOC on AWS",
        "link": {
          "type": "doc",
          "id": "tutorials/get-started/deploy-byoc-aws/deploy-byoc-aws"
        },
        "items": [
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-aws/create-bucket-and-role",
            "label": "Create S3 Bucket and IAM Role"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-aws/create-eks-role",
            "label": "Create EKS IAM Role"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-aws/create-cross-account-role",
            "label": "Create Cross-Account IAM Role"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-aws/configure-vpc",
            "label": "Configure a Customer-Managed VPC on AWS"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-aws/permissions-in-roles",
            "label": "Permissions in Roles"
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/get-started/deploy-byoc-i-aws",
        "label": "Deploy BYOC-I on AWS"
      },
      {
        "type": "doc",
        "id": "tutorials/get-started/deploy-byoc-i-azure",
        "label": "Deploy BYOC-I on Microsoft Azure"
      },
      {
        "type": "category",
        "label": "Deploy BYOC on GCP",
        "link": {
          "type": "doc",
          "id": "tutorials/get-started/deploy-byoc-gcp/deploy-byoc-gcp"
        },
        "items": [
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-gcp/create-bucket-and-service-account",
            "label": "Create Cloud Storage Bucket and Service Account"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-gcp/create-gke-service-account",
            "label": "Create GKE Service Account"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-gcp/create-cross-account-sa",
            "label": "Create a Cross-Account Service Account"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-gcp/configure-vpc-gcp",
            "label": "Configure a Customer-Managed VPC on GCP"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-gcp/required-permissions-gcp",
            "label": "Required Permissions"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/deploy-byoc-gcp/required-api-services-gcp",
            "label": "Required GCP API Services"
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/get-started/prepare-for-cluster-connection",
        "label": "Prepare for Cluster Connection"
      },
      {
        "type": "doc",
        "id": "tutorials/get-started/quick-start",
        "label": "Quickstart"
      },
      {
        "type": "category",
        "label": "Concepts",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/get-started/understand-basics/autoindex-explained",
            "label": "AUTOINDEX Explained"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/understand-basics/ann-search-explained",
            "label": "ANN Search Explained"
          }
        ]
      },
      {
        "type": "category",
        "label": "Resource Planning",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/get-started/resource-planning/cu-types-explained",
            "label": "Cluster Types"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/resource-planning/data-resilience",
            "label": "Data Resilience"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/resource-planning/license-usage",
            "label": "License Usage"
          }
        ]
      },
      {
        "type": "category",
        "label": "Best Practices",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/get-started/best-practices/perf-benchmark-vectordb",
            "label": "Use VectorDBBench"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/best-practices/multi-tenancy",
            "label": "Implement Multi-tenancy"
          },
          {
            "type": "doc",
            "id": "tutorials/get-started/best-practices/environment-isolation",
            "label": "Environment Isolation"
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/get-started/shared-responsibilities",
        "label": "Shared Responsibilities"
      },
      {
        "type": "category",
        "label": "API & SDKs",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/get-started/api-sdks/install-sdks",
            "label": "Install SDKs"
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/get-started/zilliz-mcp-server",
        "label": "MCP Server"
      },
      {
        "type": "doc",
        "id": "tutorials/get-started/terraform-provider",
        "label": "Terraform Provider"
      }
    ]
  },
  {
    "type": "category",
    "label": "Data",
    "items": [
      {
        "type": "category",
        "label": "Collection",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/data/collection/manage-collections",
            "label": "Overview"
          },
          {
            "type": "doc",
            "id": "tutorials/data/collection/manage-collections-sdks",
            "label": "Create"
          },
          {
            "type": "doc",
            "id": "tutorials/data/collection/view-collections",
            "label": "View"
          },
          {
            "type": "doc",
            "id": "tutorials/data/collection/modify-collections",
            "label": "Modify"
          },
          {
            "type": "doc",
            "id": "tutorials/data/collection/set-collection-ttl",
            "label": "TTL"
          },
          {
            "type": "doc",
            "id": "tutorials/data/collection/load-release-collections",
            "label": "Load & Release"
          },
          {
            "type": "doc",
            "id": "tutorials/data/collection/manage-partitions",
            "label": "Partitions"
          },
          {
            "type": "doc",
            "id": "tutorials/data/collection/manage-aliases",
            "label": "Aliases"
          },
          {
            "type": "doc",
            "id": "tutorials/data/collection/drop-collection",
            "label": "Drop"
          },
          {
            "type": "doc",
            "id": "tutorials/data/collection/manage-collections-console",
            "label": "Manage on Console"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schema & Data Fields",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/schema-explained",
            "label": "Overview"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/primary-field-auto-id",
            "label": "Primary Field"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/use-dense-vector",
            "label": "Dense Vector"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/use-binary-vector",
            "label": "Binary Vector"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/use-sparse-vector",
            "label": "Sparse Vector"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/use-string-field",
            "label": "String"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/use-number-field",
            "label": "Boolean & Number"
          },
          {
            "type": "category",
            "label": "JSON",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/data/schema-data-fields/use-json-fields/json-field-overview",
                "label": "Overview"
              },
              {
                "type": "doc",
                "id": "tutorials/data/schema-data-fields/use-json-fields/json-indexing",
                "label": "Indexing"
              },
              {
                "type": "doc",
                "id": "tutorials/data/schema-data-fields/use-json-fields/json-shredding",
                "label": "Shredding"
              }
            ]
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/use-array-fields",
            "label": "Array"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/use-array-of-structs",
            "label": "Structs"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/use-geometry-field",
            "label": "Geometry"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/use-timestamptz-field",
            "label": "TIMSTAMPTZ"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/enable-dynamic-field",
            "label": "Dynamic Field"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/nullable-fields",
            "label": "Nullable Fields"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/default-fields",
            "label": "Default Values"
          },
          {
            "type": "category",
            "label": "Analyzer",
            "link": {
              "type": "doc",
              "id": "tutorials/data/schema-data-fields/analyzer/analyzer"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/data/schema-data-fields/analyzer/analyzer-overview",
                "label": "Overview"
              },
              {
                "type": "category",
                "label": "Built-in Analyzer",
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/built-in-analyzer/standard-analyzer",
                    "label": "Standard"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/built-in-analyzer/english-analyzer",
                    "label": "English"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/built-in-analyzer/chinese-analyzer",
                    "label": "Chinese"
                  }
                ]
              },
              {
                "type": "category",
                "label": "Tokenizer",
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-tokenizers/standard-tokenizer",
                    "label": "Standard"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-tokenizers/whitespace-tokenizer",
                    "label": "Whitespace"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-tokenizers/jieba-tokenizer",
                    "label": "Jieba"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-tokenizers/lindera-tokenizer",
                    "label": "Lindera"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-tokenizers/icu-tokenizer",
                    "label": "ICU"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-tokenizers/language-identifier-tokenizer",
                    "label": "Language Identifier"
                  }
                ]
              },
              {
                "type": "category",
                "label": "Filter",
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/lowercase-filter",
                    "label": "Lowercase"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/ascii-folding-filter",
                    "label": "ASCII folding"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/alphanumonly-filter",
                    "label": "Alphanumonly"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/cnalphanumonly-filter",
                    "label": "Cnalphanumonly"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/cncharonly-filter",
                    "label": "Cncharonly"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/length-filter",
                    "label": "Length"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/stop-filter",
                    "label": "Stop"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/decompounder-filter",
                    "label": "Decompounder"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/stemmer-filter",
                    "label": "Stemmer"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/remove-punct-filter",
                    "label": "Remove Punct"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/schema-data-fields/analyzer/analyzer-filters/regex-filter",
                    "label": "Regex"
                  }
                ]
              },
              {
                "type": "doc",
                "id": "tutorials/data/schema-data-fields/analyzer/multi-language-analyzers",
                "label": "Multi-language Analyzers"
              },
              {
                "type": "doc",
                "id": "tutorials/data/schema-data-fields/analyzer/choose-the-right-analyzer-for-your-use-case",
                "label": "Best Practice"
              }
            ]
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/alter-collection-field",
            "label": "Alter Field"
          },
          {
            "type": "doc",
            "id": "tutorials/data/schema-data-fields/add-fields-to-an-existing-collection",
            "label": "Add Fields"
          },
          {
            "type": "category",
            "label": "Best Practices",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/data/schema-data-fields/schema-best-practices/schema-design-hands-on",
                "label": "Data Model Design"
              },
              {
                "type": "doc",
                "id": "tutorials/data/schema-data-fields/schema-best-practices/schema-design-with-structs",
                "label": "Data Model with Structs"
              }
            ]
          }
        ]
      },
      {
        "type": "category",
        "label": "Insert & Delete",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/data/insert-update-delete/insert-entities",
            "label": "Insert"
          },
          {
            "type": "doc",
            "id": "tutorials/data/insert-update-delete/upsert-entities",
            "label": "Upsert"
          },
          {
            "type": "doc",
            "id": "tutorials/data/insert-update-delete/count-entities",
            "label": "Count"
          },
          {
            "type": "doc",
            "id": "tutorials/data/insert-update-delete/delete-entities",
            "label": "Delete"
          }
        ]
      },
      {
        "type": "category",
        "label": "Indexes",
        "link": {
          "type": "doc",
          "id": "tutorials/data/manage-indexes/manage-indexes"
        },
        "items": [
          {
            "type": "category",
            "label": "Vector Indexes",
            "link": {
              "type": "doc",
              "id": "tutorials/data/manage-indexes/index-vector-fields/index-vector-fields"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/data/manage-indexes/index-vector-fields/tune-index-build-level",
                "label": "Tune Build Level"
              },
              {
                "type": "doc",
                "id": "tutorials/data/manage-indexes/index-vector-fields/minhash-lsh",
                "label": "MINHASH_LSH"
              }
            ]
          },
          {
            "type": "category",
            "label": "Scalar Indexes",
            "link": {
              "type": "doc",
              "id": "tutorials/data/manage-indexes/index-scalar-fields/index-scalar-fields"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/data/manage-indexes/index-scalar-fields/bitmap-index-type",
                "label": "BITMAP"
              },
              {
                "type": "doc",
                "id": "tutorials/data/manage-indexes/index-scalar-fields/inverted-index-type",
                "label": "INVERTED"
              },
              {
                "type": "doc",
                "id": "tutorials/data/manage-indexes/index-scalar-fields/ngram-index-type",
                "label": "NGRAM"
              },
              {
                "type": "doc",
                "id": "tutorials/data/manage-indexes/index-scalar-fields/rtree-index-type",
                "label": "RTREE"
              },
              {
                "type": "doc",
                "id": "tutorials/data/manage-indexes/index-scalar-fields/slt-sort-index-type",
                "label": "STL_SORT"
              }
            ]
          }
        ]
      },
      {
        "type": "category",
        "label": "Search",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/single-vector-search",
            "label": "Basic Vector Search"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/tune-recall-rate",
            "label": "Tune Recall Rate"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/filtered-search",
            "label": "Filtered Search"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/range-search",
            "label": "Range Search"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/grouping-search",
            "label": "Grouping Search"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/primary-key-search",
            "label": "Primary-Key Search"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/hybrid-search",
            "label": "Hybrid Search"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/get-and-scalar-query",
            "label": "Query"
          },
          {
            "type": "category",
            "label": "Filtering",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/data/search-query-get/filtering/filtering-overview",
                "label": "Overview"
              },
              {
                "type": "doc",
                "id": "tutorials/data/search-query-get/filtering/basic-filtering-operators",
                "label": "Basic"
              },
              {
                "type": "doc",
                "id": "tutorials/data/search-query-get/filtering/filtering-templating",
                "label": "Template"
              },
              {
                "type": "doc",
                "id": "tutorials/data/search-query-get/filtering/json-filtering-operators",
                "label": "JSON"
              },
              {
                "type": "doc",
                "id": "tutorials/data/search-query-get/filtering/array-filtering-operators",
                "label": "Array"
              },
              {
                "type": "doc",
                "id": "tutorials/data/search-query-get/filtering/ramdom-sampling",
                "label": "Random Sampling"
              },
              {
                "type": "doc",
                "id": "tutorials/data/search-query-get/filtering/geometry-operators",
                "label": "Geometry"
              }
            ]
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/full-text-search",
            "label": "Full Text Search"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/text-match",
            "label": "Text Match"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/text-highlighter",
            "label": "Lexical Highlighter"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/phrase-match",
            "label": "Phrase Match"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/search-with-embeddinglist",
            "label": "Embedding Lists"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/elasticsearch-queries-to-milvus",
            "label": "Elasticsearch Queries to Milvus"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/with-iterators",
            "label": "Search Iterator"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/use-partition-key",
            "label": "Partition Key"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/use-mmap",
            "label": "Use mmap"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/consistency-level",
            "label": "Consistency Level"
          },
          {
            "type": "doc",
            "id": "tutorials/data/search-query-get/search-metrics-explained",
            "label": "Metric Types"
          }
        ]
      },
      {
        "type": "category",
        "label": "Import & Export",
        "items": [
          {
            "type": "category",
            "label": "Data Import",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/data/data-import-export/data-import/data-import-storage-options",
                "label": "Storage Options"
              },
              {
                "type": "category",
                "label": "Format Options",
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/data/data-import-export/data-import/data-import-format-options/data-import-parquet",
                    "label": "Parquet (Recommended)"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/data-import-export/data-import/data-import-format-options/data-import-json",
                    "label": "JSON/JSON Line"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/data-import-export/data-import/data-import-format-options/data-import-numpy",
                    "label": "NumPy"
                  }
                ]
              },
              {
                "type": "category",
                "label": "Convert Your Data",
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/data/data-import-export/data-import/prepare-data-import/use-bulkwriter",
                    "label": "Use BulkWriter"
                  }
                ]
              },
              {
                "type": "category",
                "label": "Import Data",
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/data/data-import-export/data-import/import-data/import-data-on-web-ui",
                    "label": "Console"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/data-import-export/data-import/import-data/import-data-via-restful-api",
                    "label": "RESTful API"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/data/data-import-export/data-import/import-data/import-data-via-sdks",
                    "label": "SDKs"
                  }
                ]
              },
              {
                "type": "doc",
                "id": "tutorials/data/data-import-export/data-import/data-import-zero-to-hero",
                "label": "Zero to Hero"
              }
            ]
          },
          {
            "type": "category",
            "label": "Data Export",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/data/data-import-export/data-export/export-data-iterators",
                "label": "Using Iterators"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "type": "category",
    "label": "Function & Model Inference",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/function-and-model-inference/function-and-model-inference-overview",
        "label": "Overview"
      },
      {
        "type": "doc",
        "id": "tutorials/function-and-model-inference/bm25-function",
        "label": "BM25 Function"
      },
      {
        "type": "category",
        "label": "Rerank Functions",
        "link": {
          "type": "doc",
          "id": "tutorials/function-and-model-inference/reranking/reranking"
        },
        "items": [
          {
            "type": "category",
            "label": "Hybrid Search Rankers",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/function-and-model-inference/reranking/hybrid-search-rankers/reranking-weighted-reranker",
                "label": "Weighted Ranker"
              },
              {
                "type": "doc",
                "id": "tutorials/function-and-model-inference/reranking/hybrid-search-rankers/reranking-rrf",
                "label": "RRF Ranker"
              }
            ]
          },
          {
            "type": "category",
            "label": "Rule-based Rankers",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/function-and-model-inference/reranking/rule-based-rankers/boost-ranker",
                "label": "Boost Ranker"
              },
              {
                "type": "category",
                "label": "Decay Ranker",
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/function-and-model-inference/reranking/rule-based-rankers/decay-ranker/decay-ranker-oveview",
                    "label": "Decay Ranker Overview"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/function-and-model-inference/reranking/rule-based-rankers/decay-ranker/gaussian-decay",
                    "label": "Gaussian Decay"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/function-and-model-inference/reranking/rule-based-rankers/decay-ranker/exponential-decay",
                    "label": "Exponential Decay"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/function-and-model-inference/reranking/rule-based-rankers/decay-ranker/linear-decay",
                    "label": "Linear Decay"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/function-and-model-inference/reranking/rule-based-rankers/decay-ranker/tutorial-implement-time-based-ranking",
                    "label": "Tutorial: Implement Time-based Ranking"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "type": "category",
    "label": "Cluster",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/cluster/create-cluster",
        "label": "Create Cluster"
      },
      {
        "type": "doc",
        "id": "tutorials/cluster/connect-to-cluster",
        "label": "Connect to Cluster"
      },
      {
        "type": "doc",
        "id": "tutorials/cluster/manage-cluster",
        "label": "Manage Cluster"
      },
      {
        "type": "category",
        "label": "Scale Cluster",
        "link": {
          "type": "doc",
          "id": "tutorials/cluster/scale-cluster/scale-cluster"
        },
        "items": [
          {
            "type": "doc",
            "id": "tutorials/cluster/scale-cluster/scale-query-cu",
            "label": "Scale Query CU"
          },
          {
            "type": "doc",
            "id": "tutorials/cluster/scale-cluster/manage-replica",
            "label": "Scale Replica"
          },
          {
            "type": "doc",
            "id": "tutorials/cluster/scale-cluster/cron-expression",
            "label": "Cron Expression"
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/cluster/database",
        "label": "Database"
      }
    ]
  },
  {
    "type": "category",
    "label": "Migrations",
    "items": [
      {
        "type": "category",
        "label": "Zilliz to Zilliz Migrations",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/migrations/migrate-between-clusters/offline-migration",
            "label": "Offline Migration"
          }
        ]
      },
      {
        "type": "category",
        "label": "Migrate from Milvus",
        "link": {
          "type": "doc",
          "id": "tutorials/migrations/migrate-from-milvus/migrate-from-milvus"
        },
        "items": [
          {
            "type": "doc",
            "id": "tutorials/migrations/migrate-from-milvus/via-backup-files",
            "label": "Via Backup Files"
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/migrations/zilliz-cloud-ips",
        "label": "Zilliz Cloud IP Addresses"
      }
    ]
  },
  {
    "type": "category",
    "label": "Metrics & Alerts",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/metrics-and-alerts/metrics-alerts-reference",
        "label": "Metrics Reference"
      },
      {
        "type": "doc",
        "id": "tutorials/metrics-and-alerts/view-cluster-metric-charts",
        "label": "View Cluster Metric Charts"
      },
      {
        "type": "doc",
        "id": "tutorials/metrics-and-alerts/manage-organization-alerts",
        "label": "Manage Organization Alerts"
      },
      {
        "type": "doc",
        "id": "tutorials/metrics-and-alerts/manage-project-alerts",
        "label": "Manage Project Alerts"
      },
      {
        "type": "doc",
        "id": "tutorials/metrics-and-alerts/manage-notification-channels",
        "label": "Manage Notification Channels"
      }
    ]
  },
  {
    "type": "category",
    "label": "Backup & Restore",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/backup-and-restore/create-snapshot",
        "label": "Create Backup"
      },
      {
        "type": "doc",
        "id": "tutorials/backup-and-restore/schedule-automatic-backups",
        "label": "Schedule Automatic Backups"
      },
      {
        "type": "doc",
        "id": "tutorials/backup-and-restore/restore-from-snapshot",
        "label": "Restore from Backup Files"
      },
      {
        "type": "doc",
        "id": "tutorials/backup-and-restore/manage-backup-files",
        "label": "Manage Backup Files"
      }
    ]
  },
  {
    "type": "category",
    "label": "Organizations",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/organizations/organization-users",
        "label": "Organization Users"
      },
      {
        "type": "doc",
        "id": "tutorials/organizations/organization-settings",
        "label": "Organization Settings"
      },
      {
        "type": "doc",
        "id": "tutorials/organizations/use-recycle-bin",
        "label": "Use Recycle Bin"
      }
    ]
  },
  {
    "type": "category",
    "label": "Projects",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/projects/manage-projects",
        "label": "Projects"
      },
      {
        "type": "doc",
        "id": "tutorials/projects/project-users",
        "label": "Project Users"
      },
      {
        "type": "doc",
        "id": "tutorials/projects/job-center",
        "label": "Project Jobs"
      },
      {
        "type": "category",
        "label": "Integrate with Third Parties",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/projects/integrate-with-third-parties/prometheus-monitoring",
            "label": "Prometheus"
          }
        ]
      }
    ]
  },
  {
    "type": "category",
    "label": "Security",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/security/data-security",
        "label": "Data Security"
      },
      {
        "type": "category",
        "label": "Authentication",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/security/authentication/email-accounts",
            "label": "Email Accounts"
          },
          {
            "type": "doc",
            "id": "tutorials/security/authentication/manage-api-keys",
            "label": "API Keys"
          },
          {
            "type": "doc",
            "id": "tutorials/security/authentication/cluster-credentials",
            "label": "Cluster Credentials"
          },
          {
            "type": "doc",
            "id": "tutorials/security/authentication/multi-factor-auth",
            "label": "MFA"
          },
          {
            "type": "category",
            "label": "Single Sign-on (SSO)",
            "link": {
              "type": "doc",
              "id": "tutorials/security/authentication/single-sign-on/single-sign-on"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/security/authentication/single-sign-on/openid-connect",
                "label": "Okta (OIDC)"
              },
              {
                "type": "doc",
                "id": "tutorials/security/authentication/single-sign-on/single-sign-on-with-okta",
                "label": "Okta (SAML 2.0)"
              },
              {
                "type": "doc",
                "id": "tutorials/security/authentication/single-sign-on/single-sign-on-with-google-workspace",
                "label": "Google Workspace (SAML 2.0)"
              },
              {
                "type": "doc",
                "id": "tutorials/security/authentication/single-sign-on/single-sign-on-with-microsoft-entra",
                "label": "Microsoft Entra (SAML 2.0)"
              },
              {
                "type": "doc",
                "id": "tutorials/security/authentication/single-sign-on/single-sign-on-with-other-idp",
                "label": "Other IdP (SAML 2.0)"
              },
              {
                "type": "doc",
                "id": "tutorials/security/authentication/single-sign-on/enforce-sso-in-your-organization",
                "label": "Enforce SSO in Your Organization"
              }
            ]
          }
        ]
      },
      {
        "type": "category",
        "label": "Access Control",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/security/access-control/access-control-overview",
            "label": "Access Control Explained"
          },
          {
            "type": "doc",
            "id": "tutorials/security/access-control/cluster-users",
            "label": "Manage Cluster Users (Console)"
          },
          {
            "type": "doc",
            "id": "tutorials/security/access-control/cluster-users-sdk",
            "label": "Manage Cluster User (SDK)"
          },
          {
            "type": "doc",
            "id": "tutorials/security/access-control/cluster-roles",
            "label": "Manage Cluster Roles (Console)"
          },
          {
            "type": "doc",
            "id": "tutorials/security/access-control/cluster-roles-sdk",
            "label": "Manage Cluster Roles (SDK)"
          },
          {
            "type": "doc",
            "id": "tutorials/security/access-control/cluster-privileges",
            "label": "Privileges & Privilege Groups"
          }
        ]
      },
      {
        "type": "category",
        "label": "Network Access",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/security/network-and-security/setup-console-ip-allowlist",
            "label": "Set Up Console IP Allowlist"
          }
        ]
      },
      {
        "type": "category",
        "label": "CMEK",
        "link": {
          "type": "doc",
          "id": "tutorials/security/cmek/cmek"
        },
        "items": [
          {
            "type": "doc",
            "id": "tutorials/security/cmek/aws-kms",
            "label": "AWS KMS"
          }
        ]
      },
      {
        "type": "category",
        "label": "Auditing Logs",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/security/auditing/audit-logs",
            "label": "VectorDB Audit Logs"
          },
          {
            "type": "doc",
            "id": "tutorials/security/auditing/audit-logs-ref",
            "label": "VectorDB Audit Logs Reference"
          },
          {
            "type": "doc",
            "id": "tutorials/security/auditing/view-activities",
            "label": "View Platform Audit Logs"
          }
        ]
      }
    ]
  },
  {
    "type": "category",
    "label": "Limits & Restrictions",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/limits-and-restrictions/limits",
        "label": "Zilliz Cloud Limits"
      },
      {
        "type": "doc",
        "id": "tutorials/limits-and-restrictions/api-comparison",
        "label": "API Availability"
      }
    ]
  }
]
