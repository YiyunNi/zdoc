---
title: "update-policy | Cloud"
slug: /cli/cli/Backup-updatepolicy
sidebar_label: "update-policy"
beta: false
added_since: v0.1.x
last_modified: false
deprecate_since: false
notebook: false
description: "This operation updates the backup policy of a cluster. | Cloud"
type: docx
token: TVB4dJXYfoSiFexcIFwcez5dnug
sidebar_position: 9
keywords: 
  - ANNS
  - Vector search
  - knn algorithm
  - HNSW
  - zilliz
  - zilliz cloud
  - cloud
  - update-policy
  - cli01
displayed_sidebar: cliSidebar

displayed_sidbar: cliSidebar
---

import Admonition from '@theme/Admonition';


# update-policy

This operation updates the backup policy of a cluster.

## Usage\{#usage}

```bash
zilliz backup update-policy [OPTIONS]
```

**OPTIONS:**

- **--cluster-id** (*string*) -

    **[REQUIRED]**

    Indicates the cluster ID.

- **--auto-backup** (*boolean*) -

    **[REQUIRED]**

    Indicates whether to enable or disable auto-backup.

- **--frequency** (*string*) -

    Indicates how frequently to run an auto-backup job. This option is required when `--auto-backup` is `true`. Possible values are:

    - `daily`

    - `weekdays`

    - `weekends`, or

    - `1-7` (1=Mon, 7=Sun) For example, `1,3,5`.

- **--start-time** (*string*) -

    Indicates the start hour in UTC, for example, `02:00`. This option is required when `--auto-backup` is `true`.

- **--retention-days** (*integer*) -

    days to retain backups (1-30) Required when `--auto-backup` is `true`.

## Example\{#example}

```bash
# Enable daily backup at 2am UTC with 7-day retention
zilliz backup update-policy --cluster-id in01-xxxx --auto-backup true --frequency daily --start-time 02:00 --retention-days 7

# Enable backup on Mon/Wed/Fri at 3am UTC
zilliz backup update-policy --cluster-id in01-xxxx --auto-backup true --frequency 1,3,5 --start-time 03:00-05:00 --retention-days 14

# Disable auto-backup
zilliz backup update-policy --cluster-id in01-xxxx --auto-backup false
```
