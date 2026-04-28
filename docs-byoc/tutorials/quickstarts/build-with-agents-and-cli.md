---
title: "Build with Agents & CLI | BYOC"
slug: /build-with-agents-and-cli
sidebar_label: "Build with Agents & CLI"
beta: FALSE
added_since: FALSE
last_modified: FALSE
deprecate_since: FALSE
notebook: FALSE
description: "Zilliz Cloud offers a unified ecosystem of AI agents and command-line tools designed to streamline vector database operations, whether you prefer natural language or direct scripting. | BYOC"
type: origin
token: ZyiawsQXNisR8ekzLlAcRiH2nJb
sidebar_position: 1
keywords: 
  - zilliz
  - vector database
  - cloud
  - quickstarts
  - agents
  - zilliz cli
  - skills

---

import Admonition from '@theme/Admonition';


# Build with Agents & CLI

Zilliz Cloud offers a unified ecosystem of AI agents and command-line tools designed to streamline vector database operations, whether you prefer natural language or direct scripting.

## Zilliz CLI: the foundation\{#zilliz-cli-the-foundation}

At the core lies the Zilliz CLI, a cross-platform command-line interface for managing cloud resources and data operations. Install it with the single curl command, authenticate via `zilliz login`, and you can create clusters, manage collections, execute vector searches, and configure alerts. 

Zilliz CLI is organized into three pillars: 

- **Cloud Management**

    Manages clusters, backups, projects, and all control-plane resources.

- **Configuration**

    Provides authentication, context management, and alerts.

- **Data Operations**

    Perform data-plane operations over collections, vectors, indexes, partitions, etc.

For details, refer to [Zilliz CLI references](/reference/cli/overview).

## Natural language interfaces\{#natural-language-interfaces}

For developers who prefer coversational workflows, Zilliz wraps the CLI into multiple agent-friendly formats:

- Zilliz Skill

    Reusable skill modules for Claude Code and skill-compatible agents. Covers capability areas including clusters, collections, vectors, indexes, and RBAC. You can install it using `npx skills add zilliztech/zilliz-skill`.

    For details, refer to [Zilliz Skill](/docs/agents/zilliz-skill).

- Zilliz plugins and extensions

    A dedicated **Claude Code plugin** and a **Gemini CLI extension** that brings all Zilliz Cloud capability areas directly into your IDE. Simply describe what you need: "*Create a serverless cluster in us-east-1*" or "*Search for similar items with filter age > 20*".

    For details, refer to [Zilliz Cloud Claude Plugin](/docs/agents/zilliz-plugin) and [Zilliz Gemini CLI Extension](/docs/agents/zilliz-plugin).

- AI prompts

    An IDE-agnostic prompt library with a base module plus specialized guides covering schema design, search optimization, migration, pricing, and more.

    For details, refer to [AI Prompts](/docs/agents/zilliz-ai-prompts).

## Choose your tools\{#choose-your-tools}

<table>
   <tr>
     <th><p>Tool</p></th>
     <th><p>Best for</p></th>
     <th><p>Natural Language</p></th>
   </tr>
   <tr>
     <td><p>Zilliz Skill</p></td>
     <td><p>Skill-compatible coding agents</p></td>
     <td><p>Full support</p></td>
   </tr>
   <tr>
     <td><p>Zilliz plugin and extension</p></td>
     <td><p>Claude Code and Gemini CLI</p></td>
     <td><p>Full support</p></td>
   </tr>
   <tr>
     <td><p>AI prompts</p></td>
     <td><p>Consistent AI guidance across projects</p></td>
     <td><p>Guides AI behavior</p></td>
   </tr>
   <tr>
     <td><p>CLI</p></td>
     <td><p>Scripting and automation</p></td>
     <td><p>Command-line only</p></td>
   </tr>
</table>

Start with the plugin or extension if you use Claude Code or Gemini CLI, the Skill for other skill-compatible agents, or the CLI when building automated pipelines. All paths leverage the same underlying infrastructure. Just pick the interface that fits your workflow.