---
title: "show | Cloud"
slug: /cli/cli/Completion-show
sidebar_key: cli/Completion-show
sidebar_label: "show"
added_since: v0.1.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation shows the completion script for manual installation. You can copy the command from the output and run it in your shell environment. | Cloud"
type: docx
token: SM0QdG9o4oOGMkxhflicTt2KnBe
sidebar_position: 2
keywords: 
  - Zilliz vector database
  - Zilliz database
  - Unstructured Data
  - vector database
  - zilliz
  - zilliz cloud
  - cloud
  - show
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# show

This operation shows the completion script for manual installation. You can copy the command from the output and run it in your shell environment.

## Synopsis\{#synopsis}

```bash
zilliz completion show <SHELL>
```

## Options\{#options}

- **SHELL** (*string*) -

    **[REQUIRED]**

    Indicates the name of the shell you are using. Possible values:

    - `bash`,

    - `zsh`,

    - `fish`.

## Example\{#example}

```bash
# check the completion command in .zshrc
zilliz completion show zsh
```

