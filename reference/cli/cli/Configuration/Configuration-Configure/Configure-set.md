---
title: "set | Cloud"
slug: /cli/cli/Configure-set
sidebar_key: cli/Configure-set
sidebar_label: "set"
added_since: v0.1.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation sets a configuration value. | Cloud"
type: docx
token: Jp9VdKpVoooz9ix1vYMcAun4nwe
sidebar_position: 4
keywords: 
  - Vector index
  - vector database open source
  - open source vector db
  - vector database example
  - zilliz
  - zilliz cloud
  - cloud
  - set
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# set

This operation sets a configuration value.

<Admonition type="info" icon="📘" title="Notes">

<p>You can also run <code>zilliz configure</code> instead, and follow the interactive guidance. Setting <code>api_key</code> can be used as an alternative to <code>zilliz login</code>.</p>

</Admonition>

## Usage\{#usage}

```bash
zilliz configure set <KEY> <VALUE>
```

**OPTIONS:**

- **KEY** (*string*) -

    **[REQUIRED]**

    Indicates the name of a configuration item. Currently, only `api_key` is applicable.

- **VALUE** (*string*) -

    Indicates the value of the configuration item.

## Example\{#example}

```bash
# set api key
zilliz configure set api_key <YOUR_API_KEY>
```
