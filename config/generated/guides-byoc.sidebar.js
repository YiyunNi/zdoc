module.exports = [
  {
    "type": "category",
    "label": "Deploy BYOC",
    "items": [
      {
        "type": "category",
        "label": "Deploy BYOC on AWS",
        "link": {
          "type": "doc",
          "id": "tutorials/deploy-byoc/deploy-byoc-aws/deploy-byoc-aws"
        },
        "items": [
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-aws/create-bucket-and-role",
            "label": "Create S3 Bucket and IAM Role"
          },
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-aws/create-eks-role",
            "label": "Create EKS IAM Role"
          },
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-aws/create-cross-account-role",
            "label": "Create Cross-Account IAM Role"
          },
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-aws/configure-vpc",
            "label": "Configure a Customer-Managed VPC on AWS"
          },
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-aws/permissions-in-roles",
            "label": "Permissions in Roles"
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/deploy-byoc/deploy-byoc-i-aws",
        "label": "Deploy BYOC-I on AWS"
      },
      {
        "type": "doc",
        "id": "tutorials/deploy-byoc/deploy-byoc-i-azure",
        "label": "Deploy BYOC-I on Microsoft Azure"
      },
      {
        "type": "category",
        "label": "Deploy BYOC on GCP",
        "link": {
          "type": "doc",
          "id": "tutorials/deploy-byoc/deploy-byoc-gcp/deploy-byoc-gcp"
        },
        "items": [
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-gcp/create-bucket-and-service-account",
            "label": "Create Cloud Storage Bucket and Service Account"
          },
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-gcp/create-gke-service-account",
            "label": "Create GKE Service Account"
          },
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-gcp/create-cross-account-sa",
            "label": "Create a Cross-Account Service Account"
          },
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-gcp/configure-vpc-gcp",
            "label": "Configure a Customer-Managed VPC on GCP"
          },
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-gcp/required-permissions-gcp",
            "label": "Required Permissions"
          },
          {
            "type": "doc",
            "id": "tutorials/deploy-byoc/deploy-byoc-gcp/required-api-services-gcp",
            "label": "Required GCP API Services"
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/deploy-byoc/shared-responsibilities",
        "label": "Shared Responsibilities"
      }
    ]
  },
  {
    "type": "category",
    "label": "Quickstarts",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/quickstarts/build-with-agents-and-cli",
        "label": "Build with Agents & CLI"
      },
      {
        "type": "doc",
        "id": "tutorials/quickstarts/quickstart",
        "label": "Quickstart"
      }
    ]
  },
  {
    "type": "category",
    "label": "Collection API",
    "items": [
      {
        "type": "category",
        "label": "Search & Query",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/single-vector-search",
            "label": "Basic Vector Search"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/tune-recall-rate",
            "label": "Tune Recall Rate"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/filtered-search",
            "label": "Filtered Search"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/range-search",
            "label": "Range Search"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/grouping-search",
            "label": "Grouping Search"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/primary-key-search",
            "label": "Primary-Key Search"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/hybrid-search",
            "label": "Multi-Vector Hybrid Search"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/get-and-scalar-query",
            "label": "Query"
          },
          {
            "type": "category",
            "label": "Filtering",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/collection-api/search-and-query/filtering/filtering-overview",
                "label": "Filtering Explained"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/search-and-query/filtering/basic-filtering-operators",
                "label": "Basic Operators"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/search-and-query/filtering/filtering-templating",
                "label": "Filter Templating"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/search-and-query/filtering/json-filtering-operators",
                "label": "JSON Operators"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/search-and-query/filtering/array-filtering-operators",
                "label": "ARRAY Operators"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/search-and-query/filtering/struct-array-operators",
                "label": "StructArray Operators"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/search-and-query/filtering/ramdom-sampling",
                "label": "Random Sampling"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/search-and-query/filtering/geometry-operators",
                "label": "Geometry Operators"
              }
            ]
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/full-text-search",
            "label": "Full Text Search"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/text-match",
            "label": "Text Match"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/phrase-match",
            "label": "Phrase Match"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/text-highlighter",
            "label": "Lexical Highlighter"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/search-with-embedding-lists",
            "label": "Search with Embedding Lists"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/elasticsearch-queries-to-milvus",
            "label": "Elasticsearch Queries to Milvus"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/with-iterators",
            "label": "Search Iterator"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/use-partition-key",
            "label": "Use Partition Key"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/use-mmap",
            "label": "Use mmap"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/clustering-compaction",
            "label": "Clustering Compaction"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/search-and-query/search-aggregation",
            "label": "Search Aggregation"
          }
        ]
      },
      {
        "type": "category",
        "label": "Collection",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/create-a-managed-collection",
            "label": "Create a Managed Collection"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/view-collections",
            "label": "View Collections"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/modify-collections",
            "label": "Modify Collection"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/set-collection-ttl",
            "label": "Set Collection TTL"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/use-large-topk",
            "label": "Use Large TopK"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/load-release-collections",
            "label": "Load & Release"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/truncate-collection",
            "label": "Truncate Collection"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/drop-collection",
            "label": "Drop Collection"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/manage-partitions",
            "label": "Manage Partitions"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/manage-aliases",
            "label": "Manage Aliases"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/collection/manage-collections-console",
            "label": "Manage Collections (Console)"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schema",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/create-schema",
            "label": "Create Schema"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/alter-collection-field",
            "label": "Alter Collection Field"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/add-fields-to-an-existing-collection",
            "label": "Add Fields to an Existing Collection"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/primary-field-auto-id",
            "label": "Primary Field & AutoID"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/use-dense-vector",
            "label": "Dense Vector"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/use-binary-vector",
            "label": "Binary Vector"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/use-sparse-vector",
            "label": "Sparse Vector"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/use-string-field",
            "label": "String Field"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/use-number-field",
            "label": "Boolean & Number"
          },
          {
            "type": "category",
            "label": "JSON Field",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/collection-api/schema/use-json-fields/json-field-overview",
                "label": "JSON Field Overview"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/schema/use-json-fields/json-indexing",
                "label": "JSON Indexing"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/schema/use-json-fields/json-shredding",
                "label": "JSON Shredding"
              }
            ]
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/use-array-fields",
            "label": "Array Field"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/use-geometry-field",
            "label": "Geometry Field"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/use-timestamptz-field",
            "label": "TIMESTAMPTZ Field"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/enable-dynamic-field",
            "label": "Dynamic Field"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/nullable-fields",
            "label": "Nullable Fields"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/schema/default-values",
            "label": "Default Values"
          },
          {
            "type": "category",
            "label": "Best Practices",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/collection-api/schema/best-practices/schema-design-hands-on",
                "label": "Data Model Design for Search"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/schema/best-practices/schema-design-with-structs",
                "label": "Data Model Design with an Array of Structs"
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
            "id": "tutorials/collection-api/data-operations/insert-entities",
            "label": "Insert Entities"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/data-operations/upsert-entities",
            "label": "Upsert Entities"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/data-operations/count-entities",
            "label": "Count Entities"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/data-operations/delete-entities",
            "label": "Delete Entities"
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/collection-api/export-data-iterators",
        "label": "Export Data Using Iterators"
      },
      {
        "type": "category",
        "label": "Vector Index",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/collection-api/index-vector-fields/autoindex-explained",
            "label": "AUTOINDEX Explained"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/index-vector-fields/tune-index-build-level",
            "label": "Tune Index Build Level"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/index-vector-fields/minhash-lsh",
            "label": "MINHASH_LSH"
          }
        ]
      },
      {
        "type": "category",
        "label": "Scalar Index",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/collection-api/index-scalar-fields/bitmap-index-type",
            "label": "BITMAP"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/index-scalar-fields/inverted-index-type",
            "label": "INVERTED"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/index-scalar-fields/ngram-index-type",
            "label": "NGRAM"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/index-scalar-fields/rtree-index-type",
            "label": "RTREE"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/index-scalar-fields/slt-sort-index-type",
            "label": "STL_SORT"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/index-scalar-fields/trie-index-type",
            "label": "Trie"
          }
        ]
      },
      {
        "type": "category",
        "label": "Function",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/collection-api/function/function-and-model-inference-overview",
            "label": "Function & Model Inference Overview"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/function/bm25-function",
            "label": "BM25 Function"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/function/minhash-function",
            "label": "MinHash Function"
          },
          {
            "type": "category",
            "label": "Hybrid Search Rankers",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/collection-api/function/hybrid-search-rankers/weighted-ranker",
                "label": "Weighted Ranker"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/function/hybrid-search-rankers/rrf-ranker",
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
                "id": "tutorials/collection-api/function/rule-based-rankers/boost-ranker",
                "label": "Boost Ranker"
              },
              {
                "type": "category",
                "label": "Decay Ranker",
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/collection-api/function/rule-based-rankers/decay-ranker/decay-ranker-overview",
                    "label": "Decay Ranker Overview"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/collection-api/function/rule-based-rankers/decay-ranker/gaussian-decay",
                    "label": "Gaussian Decay"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/collection-api/function/rule-based-rankers/decay-ranker/exponential-decay",
                    "label": "Exponential Decay"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/collection-api/function/rule-based-rankers/decay-ranker/linear-decay",
                    "label": "Linear Decay"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/collection-api/function/rule-based-rankers/decay-ranker/tutorial-implement-time-based-ranking",
                    "label": "Tutorial: Implement Time-based Ranking"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "category",
        "label": "Analyzer",
        "link": {
          "type": "doc",
          "id": "tutorials/collection-api/analyzer/analyzer"
        },
        "items": [
          {
            "type": "doc",
            "id": "tutorials/collection-api/analyzer/analyzer-overview",
            "label": "Analyzer Overview"
          },
          {
            "type": "category",
            "label": "Built-in Analyzer Reference",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/built-in-analyzer/standard-analyzer",
                "label": "Standard Analyzer"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/built-in-analyzer/english-analyzer",
                "label": "English"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/built-in-analyzer/chinese-analyzer",
                "label": "Chinese"
              }
            ]
          },
          {
            "type": "category",
            "label": "Tokenizer Reference",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-tokenizers/standard-tokenizer",
                "label": "Standard Tokenizer"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-tokenizers/whitespace-tokenizer",
                "label": "Whitespace"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-tokenizers/jieba-tokenizer",
                "label": "Jieba"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-tokenizers/lindera-tokenizer",
                "label": "Lindera"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-tokenizers/icu-tokenizer",
                "label": "ICU"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-tokenizers/language-identifier-tokenizer",
                "label": "Language Identifier"
              }
            ]
          },
          {
            "type": "category",
            "label": "Filter Reference",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/lowercase-filter",
                "label": "Lowercase"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/ascii-folding-filter",
                "label": "ASCII folding"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/alphanumonly-filter",
                "label": "Alphanumonly"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/cnalphanumonly-filter",
                "label": "Cnalphanumonly"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/cncharonly-filter",
                "label": "Cncharonly"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/length-filter",
                "label": "Length"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/stop-filter",
                "label": "Stop"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/decompounder-filter",
                "label": "Decompounder"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/stemmer-filter",
                "label": "Stemmer"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/remove-punct-filter",
                "label": "Remove Punct"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/regex-filter",
                "label": "Regex"
              },
              {
                "type": "doc",
                "id": "tutorials/collection-api/analyzer/analyzer-filters/synonym-filter",
                "label": "Synonym"
              }
            ]
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/analyzer/multi-language-analyzers",
            "label": "Multi-language Analyzers"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/analyzer/choose-the-right-analyzer-for-your-use-case",
            "label": "Choose the Right Analyzer for Your Use Case"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/analyzer/manage-file-resources",
            "label": "Manage File Resources"
          }
        ]
      },
      {
        "type": "category",
        "label": "Snapshots",
        "link": {
          "type": "doc",
          "id": "tutorials/collection-api/snapshots/snapshots"
        },
        "items": [
          {
            "type": "doc",
            "id": "tutorials/collection-api/snapshots/manage-snapshots",
            "label": "Manage Snapshots"
          },
          {
            "type": "doc",
            "id": "tutorials/collection-api/snapshots/snapshot-use-cases",
            "label": "Snapshot Use Cases"
          }
        ]
      }
    ]
  },
  {
    "type": "doc",
    "id": "tutorials/dataframe-api",
    "label": "DataFrame API"
  },
  {
    "type": "category",
    "label": "Platform",
    "items": [
      {
        "type": "category",
        "label": "Organizations & Projects",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/platform/organizations-and-projects/job-center",
            "label": "Manage Project Jobs"
          }
        ]
      },
      {
        "type": "category",
        "label": "Data Management",
        "items": [
          {
            "type": "category",
            "label": "Database",
            "link": {
              "type": "doc",
              "id": "tutorials/platform/data-management/database/database"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/data-management/database/create-database",
                "label": "Create Database"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/data-management/database/manage-databases",
                "label": "Manage Databases"
              }
            ]
          }
        ]
      },
      {
        "type": "category",
        "label": "Compute Resource Management",
        "items": [
          {
            "type": "category",
            "label": "Clusters",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/compute-resource-management/cluster/create-cluster",
                "label": "Create Cluster"
              },
              {
                "type": "category",
                "label": "Scale Cluster",
                "link": {
                  "type": "doc",
                  "id": "tutorials/platform/compute-resource-management/cluster/scale-cluster/scale-cluster"
                },
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/platform/compute-resource-management/cluster/scale-cluster/scale-query-cu",
                    "label": "Scale Query CU"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/platform/compute-resource-management/cluster/scale-cluster/manage-replica",
                    "label": "Scale Replica"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/platform/compute-resource-management/cluster/scale-cluster/cron-expression",
                    "label": "Cron Expression"
                  }
                ]
              },
              {
                "type": "doc",
                "id": "tutorials/platform/compute-resource-management/cluster/manage-cluster",
                "label": "Manage Cluster"
              }
            ]
          }
        ]
      },
      {
        "type": "category",
        "label": "RBAC",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/platform/access-control/access-control-overview",
            "label": "Overview"
          },
          {
            "type": "doc",
            "id": "tutorials/platform/access-control/manage-organization-users",
            "label": "Manage Organization Users"
          },
          {
            "type": "doc",
            "id": "tutorials/platform/access-control/manage-project-users",
            "label": "Manage Project Users"
          },
          {
            "type": "category",
            "label": "Manage Cluster Users",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/access-control/manage-cluster-users/cluster-users",
                "label": "Manage Cluster Users (Console)"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/access-control/manage-cluster-users/cluster-users-sdk",
                "label": "Manage Cluster User (SDK)"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/access-control/manage-cluster-users/cluster-roles",
                "label": "Manage Cluster Roles (Console)"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/access-control/manage-cluster-users/cluster-roles-sdk",
                "label": "Manage Cluster Roles (SDK)"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/access-control/manage-cluster-users/cluster-privileges",
                "label": "Privileges & Privilege Groups"
              }
            ]
          }
        ]
      },
      {
        "type": "category",
        "label": "Security & Compliance",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/platform/security-and-compliance/data-security",
            "label": "Data Security"
          },
          {
            "type": "category",
            "label": "Authentication",
            "link": {
              "type": "doc",
              "id": "tutorials/platform/security-and-compliance/authentication/authentication"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/authentication/email-accounts",
                "label": "Email Accounts"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/authentication/manage-api-keys",
                "label": "API Keys"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/authentication/cluster-credentials",
                "label": "Cluster Credentials"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/authentication/multi-factor-auth",
                "label": "MFA"
              },
              {
                "type": "category",
                "label": "Single Sign-on (SSO)",
                "link": {
                  "type": "doc",
                  "id": "tutorials/platform/security-and-compliance/authentication/single-sign-on/single-sign-on"
                },
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/platform/security-and-compliance/authentication/single-sign-on/openid-connect",
                    "label": "Okta (OIDC)"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/platform/security-and-compliance/authentication/single-sign-on/single-sign-on-with-microsoft-entra",
                    "label": "Okta (SAML 2.0)"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/platform/security-and-compliance/authentication/single-sign-on/single-sign-on-with-okta",
                    "label": "Google Workspace (SAML 2.0)"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/platform/security-and-compliance/authentication/single-sign-on/single-sign-on-with-google-workspace",
                    "label": "Microsoft Entra (SAML 2.0)"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/platform/security-and-compliance/authentication/single-sign-on/single-sign-on-with-other-idp",
                    "label": "Other IdP (SAML 2.0)"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/platform/security-and-compliance/authentication/single-sign-on/enforce-sso-in-your-organization",
                    "label": "Enforce SSO in Your Organization"
                  }
                ]
              }
            ]
          },
          {
            "type": "category",
            "label": "Network & Security",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/network-and-security/setup-console-ip-allowlist",
                "label": "Set Up Console IP Allowlist"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/network-and-security/setup-whitelist",
                "label": "Set up Cluster IP Allowlist"
              },
              {
                "type": "category",
                "label": "Set up a Private Endpoint",
                "link": {
                  "type": "doc",
                  "id": "tutorials/platform/security-and-compliance/network-and-security/setup-a-private-link/setup-a-private-link"
                },
                "items": [
                  {
                    "type": "doc",
                    "id": "tutorials/platform/security-and-compliance/network-and-security/setup-a-private-link/setup-a-private-link-aws",
                    "label": "Set up a PrivateLink (AWS)"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/platform/security-and-compliance/network-and-security/setup-a-private-link/setup-a-private-link-gcp",
                    "label": "Set up a Private Service Connect (GCP)"
                  },
                  {
                    "type": "doc",
                    "id": "tutorials/platform/security-and-compliance/network-and-security/setup-a-private-link/setup-a-private-link-azure",
                    "label": "Set up a Private Link (Azure)"
                  }
                ]
              }
            ]
          },
          {
            "type": "category",
            "label": "Customer-Managed Encryption Keys",
            "link": {
              "type": "doc",
              "id": "tutorials/platform/security-and-compliance/cmek/cmek"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/cmek/aws-kms",
                "label": "AWS KMS"
              }
            ]
          },
          {
            "type": "category",
            "label": "Auditing Logs",
            "link": {
              "type": "doc",
              "id": "tutorials/platform/security-and-compliance/auditing/auditing"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/auditing/audit-logs",
                "label": "VectorDB Audit Logs"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/auditing/audit-logs-ref",
                "label": "VectorDB Audit Logs Reference"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/auditing/view-activities",
                "label": "View Platform Audit Logs"
              }
            ]
          },
          {
            "type": "category",
            "label": "Access Logs",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/access-logs/access-log-overview",
                "label": "Access Logs Overview"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/access-logs/configure-access-logs",
                "label": "Configure Access Logs"
              },
              {
                "type": "doc",
                "id": "tutorials/platform/security-and-compliance/access-logs/access-log-reference",
                "label": "Access Log Reference"
              }
            ]
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
            "link": {
              "type": "doc",
              "id": "tutorials/platform/migrations/migrate-between-clusters/migrate-between-clusters"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/migrations/migrate-between-clusters/offline-migration",
                "label": "Offline Migration"
              }
            ]
          },
          {
            "type": "category",
            "label": "Migrate from Milvus to Zilliz Cloud",
            "link": {
              "type": "doc",
              "id": "tutorials/platform/migrations/migrate-from-milvus/migrate-from-milvus"
            },
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/migrations/migrate-from-milvus/via-backup-files",
                "label": "Migrate from Milvus to Zilliz Cloud Via Backup Files"
              }
            ]
          },
          {
            "type": "doc",
            "id": "tutorials/platform/migrations/zilliz-cloud-ips",
            "label": "Zilliz Cloud IPs"
          }
        ]
      },
      {
        "type": "category",
        "label": "Backup & Restore",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/platform/backup-and-restore/create-backup",
            "label": "Create Backup"
          },
          {
            "type": "doc",
            "id": "tutorials/platform/backup-and-restore/schedule-automatic-backups",
            "label": "Schedule Automatic Backups"
          },
          {
            "type": "doc",
            "id": "tutorials/platform/backup-and-restore/restore-from-backup-files",
            "label": "Restore from Backup Files"
          },
          {
            "type": "doc",
            "id": "tutorials/platform/backup-and-restore/manage-backup-files",
            "label": "Manage Backup Files"
          }
        ]
      },
      {
        "type": "category",
        "label": "Metrics & Alerts",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/platform/metrics-and-alerts/metrics-alerts-reference",
            "label": "Metrics Reference"
          },
          {
            "type": "doc",
            "id": "tutorials/platform/metrics-and-alerts/view-cluster-metric-charts",
            "label": "View Metric Charts"
          },
          {
            "type": "doc",
            "id": "tutorials/platform/metrics-and-alerts/manage-organization-alerts",
            "label": "Manage Organization Alerts"
          },
          {
            "type": "doc",
            "id": "tutorials/platform/metrics-and-alerts/manage-project-alerts",
            "label": "Manage Project Alerts"
          },
          {
            "type": "doc",
            "id": "tutorials/platform/metrics-and-alerts/manage-notification-channels",
            "label": "Manage Notification Channels"
          },
          {
            "type": "category",
            "label": "Integrations",
            "items": [
              {
                "type": "doc",
                "id": "tutorials/platform/metrics-and-alerts/integrate-monitors/prometheus-monitoring",
                "label": "Integrate with Prometheus"
              }
            ]
          }
        ]
      },
      {
        "type": "doc",
        "id": "tutorials/platform/use-recycle-bin",
        "label": "Use Recycle Bin"
      }
    ]
  },
  {
    "type": "category",
    "label": "Resources",
    "items": [
      {
        "type": "category",
        "label": "Resource Planning",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/resources/resource-planning/select-the-right-cluster-type",
            "label": "Select the Right Cluster Type"
          },
          {
            "type": "doc",
            "id": "tutorials/resources/resource-planning/data-resilience",
            "label": "Data Resilience"
          },
          {
            "type": "doc",
            "id": "tutorials/resources/resource-planning/license-usage",
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
            "id": "tutorials/resources/best-practices/perf-benchmark-vectordb",
            "label": "Performance Benchmarking with VectorDBBench"
          },
          {
            "type": "doc",
            "id": "tutorials/resources/best-practices/multi-tenancy",
            "label": "Implement Multi-tenancy"
          },
          {
            "type": "doc",
            "id": "tutorials/resources/best-practices/environment-isolation",
            "label": "Environment Isolation"
          }
        ]
      },
      {
        "type": "category",
        "label": "Limits & Restrictions",
        "items": [
          {
            "type": "doc",
            "id": "tutorials/resources/limits-and-restrictions/limits",
            "label": "Zilliz Cloud Limits"
          },
          {
            "type": "doc",
            "id": "tutorials/resources/limits-and-restrictions/api-comparison",
            "label": "API Availability"
          }
        ]
      }
    ]
  },
  {
    "type": "category",
    "label": "Release Notes",
    "items": [
      {
        "type": "doc",
        "id": "tutorials/release-notes/changelogs",
        "label": "Changelogs"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2604",
        "label": "April 2026 Release Notes"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2602",
        "label": " February 2026 Release Notes"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2601",
        "label": "January 2026 Release Notes"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2512",
        "label": "December 2025 Release Notes"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2511",
        "label": " November 2025 Release Notes "
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2510",
        "label": " October 2025 Release Notes"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2508",
        "label": "August 2025 Release Notes"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2180",
        "label": "Release Notes (July 15, 2025)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2170",
        "label": "Release Notes (June 9, 2025)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2150",
        "label": "Release Notes (April 24, 2025)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2140",
        "label": "Release Notes (March 27, 2025)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2130",
        "label": "Release Notes (Jan 27, 2025)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2120",
        "label": "Release Notes (Dec 26, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2110",
        "label": "Release Notes (Nov 6, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2102",
        "label": "Release Notes (Oct 14, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-2100",
        "label": "Release Notes (Sept 4, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-291",
        "label": "Release Notes (July 23, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-290",
        "label": "Release Notes (June 18, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-280",
        "label": "Release Notes (May 15, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-270",
        "label": "Release Notes (April 3, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-260",
        "label": "Release Notes (March 13, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-250",
        "label": "Release Notes (Jan 18, 2024)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-240",
        "label": "Release Notes (Dec 11, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-230",
        "label": "Release Notes (Oct 17, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-221",
        "label": "Release Notes (Sept 27, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-220",
        "label": "Release Notes (Sept 13, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-210",
        "label": "Release Notes (Aug 16, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-200",
        "label": "Release Notes (June 11, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-110",
        "label": "Release Notes (April 6, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-100",
        "label": "Release Notes (March 6, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-011",
        "label": "Release Notes (Feb 13, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-010",
        "label": "Release Notes (Jan 10, 2023)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-009",
        "label": "Release Notes (Dec 5, 2022)"
      },
      {
        "type": "doc",
        "id": "tutorials/release-notes/release-notes-008",
        "label": "Release Notes (Nov 18, 2022)"
      }
    ]
  }
]
