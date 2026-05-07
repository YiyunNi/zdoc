---
title: "Manage Indexes | Cloud"
slug: /manage-indexes
sidebar_key: manage-indexes
sidebar_label: "Indexes"
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
beta: FALSE
notebook: FALSE
description: "Learn how to manipulate indexes on vector and scalar fields via SDKs. | Cloud"
type: origin
token: NDLBwtFIuihc5wkq37KchzqLnrc
sidebar_position: 5
keywords: 
  - zilliz
  - vector database
  - cloud
  - index
  - manage

---

import Admonition from '@theme/Admonition';


# Manage Indexes

Learn how to manipulate indexes on vector and scalar fields via SDKs.

<Admonition type="info" icon="📘" title="Notes">

Whether a collection is automatically indexed and loaded depends on how you create the collection. A collection is automatically loaded upon creation in the following scenarios:

- On the console.

- [Using RESTful API](/reference/create-collection).

- [Using applicable SDKs with index parameters specified.](./manage-collections-sdks)

You can also create a collection that is not loaded automatically and start managing indexes on your own.

For collections and external collections in a database created using the project endpoint, you cannot drop indexes after they are created. This applies to both vector and scalar fields.

</Admonition>

## Contents\{#contents}

In this chapter, you will find out how to manage your collection indexes on vector and scalar fields.

import DocCardList from '@theme/DocCardList';

<DocCardList />