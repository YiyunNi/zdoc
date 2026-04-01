---
title: "Zilliz Plugin Troubleshooting | Cloud"
slug: /zilliz-plugin-troubleshooting
sidebar_label: "Troubleshooting"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "This page lists the common issues you may encounter while using the Zilliz Plugin. | Cloud"
type: origin
token: LJBxwhQogi3feFkRmpbc5kUGnyh
sidebar_position: 4
keywords: 
  - zilliz
  - vector database
  - ai-agents
  - decision matrix
  - skill
  - claude
  - zilliz cli
  - troubleshooting
displayed_sidebar: agentsSidebar

---

import Admonition from '@theme/Admonition';


# Zilliz Plugin Troubleshooting

This page lists the common issues you may encounter while using the Zilliz Plugin.

## Issue 1: "CLI not found" error\{#issue-1-cli-not-found-error}

**Symptoms**: Plugin reports it cannot find the Zilliz CLI

**Solution**:

1. Install the CLI: `pip install zilliz-cli`

1. Verify installation: `zilliz --version`

1. Restart Claude Code

## Issue 2: Authentication fails\{#issue-2-authentication-fails}

**Symptoms**: "Not authenticated" or "Invalid credentials"

**Solution**:

1. Run `zilliz auth login` in terminal

1. Complete browser authentication

1. Verify with `zilliz auth status`

## Issue 3: "No cluster configured"\{#issue-3-no-cluster-configured}

**Symptoms**: Commands fail with "no default cluster"

**Solution**:

```bash
zilliz cluster list
zilliz context set --cluster-id <your-cluster-id>
```

## Issue 4: Permission denied errors\{#issue-4-permission-denied-errors}

**Symptoms**: Operations fail with permission errors

**Solution**:

1. Check your user role in the Zilliz Cloud console

1. Verify the API key has the required permissions

1. Contact your organization admin

## Issue 5: Plugin commands are slow\{#issue-5-plugin-commands-are-slow}

**Symptoms**: Long wait times for responses

**Solution**:

1. Check your internet connection

1. Verify cluster is not suspended

1. Try smaller batch operations

## Getting Support\{#getting-support}

- [GitHub Issues](https://github.com/zilliztech/zilliz-plugin/issues)

- [Zilliz Cloud Support](https://support.zilliz.com/hc/en-us)

- [Community Slack](https://discord.com/invite/8uyFbECzPX)

