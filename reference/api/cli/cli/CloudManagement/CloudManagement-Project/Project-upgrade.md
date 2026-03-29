---
title: "upgrade | Cloud"
slug: /cli/cli/Project-upgrade
sidebar_label: "upgrade"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation upgrades a project's subscription plan. | Cloud"
type: docx
token: LZksdPD7Ao7HdwxYr4Lc3IHlngg
sidebar_position: 4
keywords: 
  - what is vector db
  - what are vector databases
  - vector databases comparison
  - Faiss
  - zilliz
  - zilliz cloud
  - cloud
  - upgrade
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# upgrade

This operation upgrades a project's subscription plan.

## Usage\{#usage}

```bash
zilliz project upgrade [OPTIONS]
```

**OPTIONS:**

- **--project-id** (*string*) -

    **[REQUIRED]**

    Indicates a project ID

- **--plan** (*string*) -

    Indicates a target subscription plan. Possible values: <include lang="en-US">`Serverless`, `Standard`, </include>`Enterprise`.

## Example\{#example}

```bash
zilliz project upgrade --project-id proj-xxxxxxxxxxxx --plan Enterprise
```
