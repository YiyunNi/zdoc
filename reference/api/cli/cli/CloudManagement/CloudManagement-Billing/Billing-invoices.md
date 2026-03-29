---
title: "invoices | Cloud"
slug: /cli/cli/Billing-invoices
sidebar_label: "invoices"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation lists invoices or gets details of a specific invoice. | Cloud"
type: docx
token: D6R2dPsd4owSCAxnFdmcim4bneh
sidebar_position: 2
keywords: 
  - vector database open source
  - open source vector db
  - vector database example
  - rag vector database
  - zilliz
  - zilliz cloud
  - cloud
  - invoices
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# invoices

This operation lists invoices or gets details of a specific invoice.

## Usage\{#usage}

```bash
zilliz billing invoices [OPTIONS]
```

**OPTIONS:**

- **--invoice-id** (*string*) -

    Indicates the invoice ID. If provided, show details of this invoice.

- **--page-size** (*integer*) -

    Indicates the number of items per page.

- **--page** (*integer*) -

    Indicates the page number to retrieve.

- **--all, -a** (*boolean*) -

    Indicates whether to fetch all pages.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`.

## Example\{#example}

```bash
zilliz billing invoices
```
