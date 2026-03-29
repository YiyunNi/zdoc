---
title: "create | Cloud"
slug: /cli/cli/Alert-create
sidebar_label: "create"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation creates a new alert rule. | Cloud"
type: docx
token: XM95d6m5QoaHfPxnNAycJSM1nRU
sidebar_position: 1
keywords: 
  - Machine Learning
  - RAG
  - NLP
  - Neural Network
  - zilliz
  - zilliz cloud
  - cloud
  - create
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# create

This operation creates a new alert rule.

## Usage\{#usage}

```bash
zilliz alert create [OPTIONS]
```

**OPTIONS:**

- **--project-id** (*string*) -

    Indicates a Project ID.

- **--metric-name** (*string*) -

    Indicates the metric to monitor. Choices: `CU_COMPUTATION`, `WALLET_BALANCE`.

- **--threshold** (*string*) -

    Indicates the threshold value.

- **--comparison** (*string*) -

    Indicates the comparison operator. 

    Choices: `>` (or `gt`), `<` (or `lt`), `>=` (or `gte`), `<=` (or `lte`), `=` (or `eq`).

- **--rule-name** (*string*) -

    Indicates a display name for the alert rule.

- **--level** (*string*) -

    Indicates alert severity. The value defaults to `WARNING`.

    Choices: `WARNING`, `CRITICAL`.

- **--window-size** (*string*) -

    Indicates the monitoring window. For example, `5m`, `15m`, `1h`, etc.

- **--cluster-id** (*array*) -

    Indicates the target cluster ID. 

    You can use this option with different cluster IDs in the same command.

- **--action** (*array*) -

    Indicates the notification action as in `type:config`. For example, `email:user*@*example.com`.

    You can use this option with different cluster IDs in the same command.

- **--send-resolved** (*string*) -

    Indicates whether to send notifications when the alert resolves.

- **--repeat-interval** (*integer*) -

    Indicates the interval at which the notification will be sent, in seconds.

- **--enabled** (*string*) -

    Indicates whether to enable the rule. This option defaults to true.

- **--output, -o** (*string*) -

    Indicates the output format. Choices: `json`, `table`, `text`.

## Example\{#example}

```bash
zilliz alert create --project-id porj-xxxx \
--metric-name WALLET_BALANCE \
--threshold 100 \
--comparison eq \
--rule-name wallet-watch \
--level warning \
--window-size 1d \
--cluster-id inx-xxxx \
--action email:john.doe@zilliz.com \
--send-resolved \
--repeat-interval 300 \
--enabled
```
