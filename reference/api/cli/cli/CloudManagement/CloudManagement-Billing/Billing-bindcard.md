---
title: "bind-card | Cloud"
slug: /cli/cli/Billing-bindcard
sidebar_label: "bind-card"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation binds a credit card to your account. | Cloud"
type: docx
token: SFuedsjqToFJMxxxGfmc3JeXnOh
sidebar_position: 1
keywords: 
  - Pinecone vs Milvus
  - Chroma vs Milvus
  - Annoy vector search
  - milvus
  - zilliz
  - zilliz cloud
  - cloud
  - bind-card
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# bind-card

This operation binds a credit card to your account.

## Usage\{#usage}

```bash
zilliz billing bind-card [OPTIONS]
```

**OPTIONS:**

- **--card-number** (*string*) -

    **[REQUIRED]**

    Indicates the credit card number.

- **--exp-month** (*integer*) -

    **[REQUIRED]**

    Indicates the expiration month. The value ranges from `1` through `12`.

- **--exp-year** (*integer*) -

    **[REQUIRED]**

    Indicates the expiration year. For example, `2026`.

- **--cvc** (*string*) -

    **[REQUIRED]**

    Indicates the card verification code.

## Example\{#example}

```bash
zilliz billing bind-card --card-number 4242424242424242 --exp-month 12 --exp-year 2026 --cvc 123
```
