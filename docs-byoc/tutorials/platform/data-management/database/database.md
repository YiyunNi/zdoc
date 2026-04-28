---
title: "Database | BYOC"
slug: /database
sidebar_label: "Database"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "A database is a logical container for collections within a project. | BYOC"
type: origin
token: Mxbqwaqj5iN7E0kaIHScgOI2nXd
sidebar_position: 3

---

import Admonition from '@theme/Admonition';


# Database

A database is a logical container for collections within a project. 

Zilliz Cloud supports two types of databases, depending on how they are hosted and accessed.

## Database in serving cluster\{#database-in-serving-cluster}

A cluster database is created in a specific serving cluster. When a serving cluster is created, a default cluster database is automatically created with it. You can create additional cluster databases in the same serving cluster as needed.

A cluster database has full access to all operations — DDL, DML (insert, upsert, delete), and DQL (search, query) — through the serving cluster endpoint.     

The lifecycle of a cluster database is tied to its serving cluster:

- If the serving cluster is **suspended**, all cluster databases and collections in it become unavailable until the cluster is resumed.

- If the serving cluster is **dropped**, all cluster databases and collections in it are deleted as well.

Cluster databases are suited for production workloads that require always-on, low-latency access to data.

The following diagram shows how projects, serving clusters, databases, and collections are organized.

```plaintext
Project                                                                                                                                                                                                   
   └── Serving Cluster                       
        ├── Cluster Database (default)                                                                                                                                                                   
        │    ├── Collection_01
        │    └── Collection_02                                                                                                                                                                              
        │                                                       
        └── Cluster Database
             ├── Collection_03                                                                                                                                                                              
             └── Collection_04
```



import DocCardList from '@theme/DocCardList';

<DocCardList />