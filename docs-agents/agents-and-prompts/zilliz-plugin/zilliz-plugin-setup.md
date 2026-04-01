---
title: "Zilliz Plugin Setup | Cloud"
slug: /zilliz-plugin-setup
sidebar_label: "Setup"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "This guide provides multiple methods for integrating Zilliz Plugins into your LLM Agent-powered workflows. | Cloud"
type: origin
token: UDxnwONhSidaQikY6NGcRdmOnUh
sidebar_position: 1
keywords: 
  - zilliz
  - vector database
  - ai-agents
  - decision matrix
  - skill
  - claude
  - zilliz cli
  - setup
displayed_sidebar: agentsSidebar

---

import Admonition from '@theme/Admonition';


import Procedures from '@site/src/components/Procedures';

# Zilliz Plugin Setup

This guide provides multiple methods for integrating Zilliz Plugins into your LLM Agent-powered workflows.

## Prerequisites\{#prerequisites}

- You have already installed [Claude Code](https://code.claude.com/).

<Procedures>

1. Run Claude Code

    ```bash
    > claude
    ```

1. Add the Zilliz Plugin marketplace.

    ```bash
    /plugin marketplace add zilliztech/zilliz-plugin
    ```

1. Install the plugin

    ```bash
    /plugin install zilliz@zilliztech/zilliz-plugin
    ```

</Procedures>

## Initial Setup\{#initial-setup}

After installation, run the quickstart wizard:

```bash
/zilliz:setup
```

The wizard will guide you through:

<Procedures>

1. Install Zilliz CLI.

    The plugin requires the Zilliz CLI. If not installed, run:

    ```bash
    pip install zilliz-cli
    ```

    Verify installation:

    ```bash
    zilliz --version
    ```

1. Authenticate.

    Authenticate with your Zilliz Cloud account:

    ```bash
    zilliz auth login
    ```

    This opens a browser for authentication. After login, your credentials are stored locally.

1. Connect to your cluster.

    Configure your default cluster connection:

    ```bash
    zilliz context set --cluster-id <your-cluster-id>
    ```

    Or let the plugin help you select from available clusters.

</Procedures>

## Verification\{#verification}

Test the plugin with a simple command:

```plaintext
You: "List my clusters"
```

The plugin should display your Zilliz Cloud clusters.

## Troubleshooting\{#troubleshooting}

- **Plugin shows "CLI not found"**

    **Solution**: Install the Zilliz CLI:

    ```bash
    pip install zilliz-cli
    ```

- **Authentication fails**

    **Solution**:

    1. Check your internet connection

    1. Verify your Zilliz Cloud account is active

    1. Try logging out and back in:

    ```bash
    zilliz auth logout
    zilliz auth login
    ```

1. **"No cluster configured"**

    **Solution**: Set a default cluster:

    ```bash
    zilliz context set --cluster-id <cluster-id>
    ```

## Next Steps\{#next-steps}

- [Capabilities Reference](./zilliz-plugin-capabilities)

- [Examples](./zilliz-plugin-examples)

