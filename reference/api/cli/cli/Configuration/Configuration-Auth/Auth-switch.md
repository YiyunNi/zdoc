---
title: "switch | Cloud"
slug: /cli/cli/Auth-switch
sidebar_label: "switch"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation switches to a different organization. | Cloud"
type: docx
token: EQcvdvxQWoicwnxrGGpcThwYnKd
sidebar_position: 4
keywords: 
  - LLMs
  - Machine Learning
  - RAG
  - NLP
  - zilliz
  - zilliz cloud
  - cloud
  - switch
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# switch

This operation switches to a different organization.

## Usage\{#usage}

```bash
zilliz auth switch <ORG_ID>
```

**OPTIONS:**

- **ORG_ID** (*string*) -

    Indicates the ID of the organziation displayed in the `zilliz status` result after this operation. A choice will be displayed if this is not specified.

## Example\{#example}

```bash
zilliz auth switch
```
