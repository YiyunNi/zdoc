# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Sidebar overrides

Generated sidebar files (in `config/generated/`) are raw output from the Feishu fetch and should not be edited by hand. To customise the sidebar without re-fetching from Feishu, edit the corresponding override file in `config/sidebar-overrides/`:

| Sidebar | Override file |
| ------- | ------------- |
| Cloud guides | `config/sidebar-overrides/guides.json` |
| BYOC guides | `config/sidebar-overrides/guides-byoc.json` |
| Python SDK | `config/sidebar-overrides/python.json` |
| Java SDK | `config/sidebar-overrides/java.json` |
| Node SDK | `config/sidebar-overrides/node.json` |
| Go SDK | `config/sidebar-overrides/go.json` |

Overrides are applied automatically on every `npm start` and `npm run build` — no re-fetch needed. The override JSON supports six actions, processed in this order: `override → overrideCategories → group → move → hide → inject`.

### Finding a doc id

Doc ids match the file path relative to the docs root, without the `.md` extension. For example, `docs/cloud/get-started/overview.md` has id `cloud/get-started/overview`. The easiest way to find an id is to look inside the generated `.sidebar.js` file for the relevant sidebar.

---

### `override` — relabel or restyle an item

Merges extra properties onto a doc item matched by id. Useful for renaming a page in the sidebar without changing the file.

```json
{
  "override": {
    "cloud/get-started/overview": {
      "label": "Quick Start"
    },
    "cloud/advanced/tuning": {
      "label": "Performance Tuning",
      "className": "sidebar-item--highlight"
    }
  }
}
```

Any key accepted by Docusaurus sidebar doc items (`label`, `className`, `customProps`, etc.) can be set here.

---

### `overrideCategories` — reconfigure a category by label

Like `override` but matches categories by their `label` string instead of a doc id. Use this to change `collapsed`, `collapsible`, `className`, or any other Docusaurus category property without touching the generated file.

```json
{
  "overrideCategories": {
    "Get Started": {
      "label": "Quick Start",
      "collapsed": false
    },
    "Data": {
      "className": "data",
      "collapsible": false
    }
  }
}
```

Setting `collapsible: false` makes the category permanently expanded (users cannot collapse it). Setting `collapsed: false` starts it expanded but still allows collapsing.

---

### `group` — wrap existing categories under a new parent

Extracts one or more existing top-level (or nested) categories by label and nests them under a newly created parent category. Categories are placed in the declared order inside the new parent.

**Group with placement after a doc:**

```json
{
  "group": [
    {
      "label": "Quickstarts",
      "afterDoc": "tutorials/home",
      "categories": ["Get Started"]
    }
  ]
}
```

**Group with placement after a sibling category:**

```json
{
  "group": [
    {
      "label": "Infrastructure",
      "afterCategory": "Data",
      "categories": ["Cluster", "Volume", "Migrations", "Metrics & Alerts", "Backup & Restore"]
    }
  ]
}
```

**Group appended to the end (default when no placement key is given):**

```json
{
  "group": [
    {
      "label": "Administration",
      "categories": ["Security", "Payment & Billing", "Limits & Restrictions"]
    }
  ]
}
```

Placement options: `afterDoc` (doc id), `afterCategory` (category label), `beforeCategory` (category label), `prepend` (boolean), or omit for append. Any extra properties (`className`, `collapsed`, `collapsible`, etc.) are spread onto the new category node. Categories left empty after extraction are removed automatically.

---

### `move` — relocate an item within the sidebar

Extracts a doc item from its current position and reinserts it elsewhere. The source must exist; if the target is missing, the move is skipped with a warning and the item stays put.

**Place before another doc item:**

```json
{
  "move": [
    { "id": "cloud/billing/overview", "before": "cloud/billing/plans" }
  ]
}
```

**Place after another doc item:**

```json
{
  "move": [
    { "id": "cloud/billing/overview", "after": "cloud/billing/plans" }
  ]
}
```

**Move into a category (appended by default):**

```json
{
  "move": [
    { "id": "cloud/billing/overview", "into": "Billing" }
  ]
}
```

**Move into a category as the first item:**

```json
{
  "move": [
    { "id": "cloud/billing/overview", "into": "Billing", "position": "first" }
  ]
}
```

Multiple moves are applied in array order. Categories that become empty after a move are removed automatically.

---

### `hide` — remove items from the sidebar

Hides one or more doc items by id. The underlying pages are still built and accessible by direct URL; they just won't appear in the sidebar.

```json
{
  "hide": [
    "cloud/internal/roadmap",
    "cloud/internal/changelog-draft"
  ]
}
```

---

### `inject` — insert custom items

Inserts arbitrary Docusaurus sidebar items (links, categories, html items, etc.) that don't come from Feishu.

**Prepend to the top of the sidebar:**

```json
{
  "inject": [
    {
      "prepend": true,
      "item": { "type": "link", "label": "What's New", "href": "/changelog" }
    }
  ]
}
```

**Append to the bottom of the sidebar:**

```json
{
  "inject": [
    {
      "append": true,
      "item": { "type": "link", "label": "Give feedback", "href": "https://feedback.zilliz.com" }
    }
  ]
}
```

**Insert before a specific top-level doc:**

```json
{
  "inject": [
    {
      "before": "cloud/get-started/overview",
      "item": { "type": "html", "value": "<hr/>" }
    }
  ]
}
```

**Insert after a specific top-level doc:**

```json
{
  "inject": [
    {
      "after": "cloud/get-started/quickstart",
      "item": { "type": "link", "label": "Interactive tutorial", "href": "https://learn.zilliz.com" }
    }
  ]
}
```

**Insert into a named category (appended by default):**

```json
{
  "inject": [
    {
      "into": "Get Started",
      "item": { "type": "link", "label": "Video walkthrough", "href": "https://www.youtube.com/watch?v=example" }
    }
  ]
}
```

**Insert as the first item in a named category:**

```json
{
  "inject": [
    {
      "into": "Get Started",
      "position": "first",
      "item": { "type": "link", "label": "Video walkthrough", "href": "https://www.youtube.com/watch?v=example" }
    }
  ]
}
```

`into` matches the first category with that label anywhere in the tree (depth-first). If the category is not found, the injection is skipped with a console warning.

---

### Combining actions

All four actions can be used together in one file. They are always applied in the fixed order `override → move → hide → inject`, regardless of the key order in the JSON.

```json
{
  "override": {
    "cloud/get-started/overview": { "label": "Quick Start" }
  },
  "move": [
    { "id": "cloud/billing/overview", "into": "Billing", "position": "first" }
  ],
  "hide": [
    "cloud/internal/roadmap"
  ],
  "inject": [
    {
      "append": true,
      "item": { "type": "link", "label": "Give feedback", "href": "https://feedback.zilliz.com" }
    }
  ]
}
```
