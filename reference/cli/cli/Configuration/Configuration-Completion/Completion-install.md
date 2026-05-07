---
title: "install | Cloud"
slug: /cli/cli/Completion-install
sidebar_key: cli/Completion-install
sidebar_label: "install"
added_since: v0.1.x
last_modified: false
deprecate_since: false
beta: false
notebook: false
description: "This operation installs shell completion. | Cloud"
type: docx
token: BGo4dB2TuoMHeBxD8XrcuKHYnEb
sidebar_position: 1
keywords: 
  - llm hallucinations
  - hybrid search
  - lexical search
  - nearest neighbor search
  - zilliz
  - zilliz cloud
  - cloud
  - install
  - cliv13
displayed_sidebar: cliSidebar

---

import Admonition from '@theme/Admonition';


# install

This operation installs shell completion. 

<Admonition type="info" icon="📘" title="Notes">

You need to manually run the `source` command after the install completes. 

For example, if you install the complete command in zsh, you should run `source ~/.zshrc` to activate command completion.

</Admonition>

## Synopsis\{#synopsis}

```bash
zilliz completion install <SHELL>
[--apply]
```

## Options\{#options}

- **SHELL** (*string*) -

    Indicates the target shell for the installation. The current shell applies if this is not specified. Possible values:

    - `bash`,

    - `zsh`,

    - `fish`.

- **--apply** (*boolean*) -

    Indicates whether to write to the rc file of the specified shell automatically.

## Example\{#example}

```bash
# Manual copy the comand and paste it into your rc file
zilliz completion install

# Automatically append the command to your rc file
zilliz completion install --apply

# activate the settings
source ~/.<*>rc
```
