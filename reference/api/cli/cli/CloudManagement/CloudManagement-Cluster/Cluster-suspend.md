---
title: "suspend | Cloud"
slug: /cli/cli/Cluster-suspend
sidebar_label: "suspend"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation suspends a running cluster. Suspending stops compute charges. | Cloud"
type: docx
token: RaGJdFRlQo2nlVxxyc5cbUtCnsh
sidebar_position: 10
keywords: 
  - how do vector databases work
  - vector db comparison
  - openai vector db
  - natural language processing database
  - zilliz
  - zilliz cloud
  - cloud
  - suspend
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# suspend

This operation suspends a running cluster. Suspending stops compute charges.

## Usage\{#usage}

```bash
zilliz cluster suspend [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the ID of the cluster to suspend.

## Example\{#example}

```bash
zilliz cluster suspend --cluster-id in01-xxxxxxxxxxxx
```
