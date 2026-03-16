# Agent-Oriented Documentation — Design Spec

## Goal

Make Zilliz Cloud documentation a first-class data source for AI agents and coding assistants, while upgrading the embedded Inkeep chat from a Q&A bot to a smart advisor capable of schema design, cluster configuration advice, and multi-language code generation — without allowing direct resource manipulation.

## Audiences

1. **Developers using AI coding assistants** (Cursor, Claude Code, Copilot) — docs should be consumable in-IDE with minimal token waste
2. **The embedded Inkeep agent** — upgraded to a specialized advisor with structured tools
3. **External AI systems** — docs discoverable and machine-readable via llms.txt, Schema.org, and MCP

## Approach: "Agent-Ready Docs" (Approach B)

Five workstreams, each independently shippable:

---

## 1. llms-txt v2 — Tiered, Token-Efficient Output

### Current State

- `llms.txt` → slim root index linking to per-section files
- `llms/<section>.txt` → full concatenation of all pages in a section
- Individual `.md` files already generated at build time alongside `.html` at the same slug (e.g., `build/docs/manage-cluster.md`)

### Problem

Concatenated section files force agents to ingest all pages when they may only need one. This wastes tokens and context window.

### Design

**Three-tier architecture:**

| Tier | File | Content |
|------|------|---------|
| Root index | `llms.txt` | Section links + MCP endpoint |
| Section summaries | `llms/<section>.txt` | Per-page: title, URL to `.md` file, one-line description, prerequisites, languages — no body |
| Individual pages | `docs/<slug>.md` (already exists) | Full page content, fetched on demand |

**Changes to `plugins/llms-txt/index.js`:**

- `buildSectionContent()` → generates summary-only output instead of full concatenation
- Each page entry in a section file becomes:
  ```
  ## Create a Collection
  - URL: https://docs.zilliz.com/docs/create-collection.md
  - Type: tutorial
  - Languages: Python, Java, Node.js, Go, REST
  - Prerequisites: Active cluster, API key
  > Create a collection with a defined schema, specifying fields, index types, and metric types.
  ```
- Root `llms.txt` adds a `## Programmatic Access` section with the MCP endpoint

**Per-page metadata** is extracted from:
- Existing frontmatter: `title`, `sidebar_label`, `sidebar_position`
- New optional frontmatter: `content_type`, `languages`, `prerequisites`, `proficiencyLevel`
- Auto-inference: content type from path (`/reference/` → api-reference), languages from code block detection

---

## 2. Inkeep Agent Upgrade — Smart Advisor + Code Generator

### Current State

- `ChatPanel` uses `InkeepEmbeddedChat` with basic `aiChatSettings`
- 4 hardcoded example questions
- Signal detection (sales/support) via Zod schemas in `config/Inkeep.ts`
- No specialized advisory capabilities

### Design

**2a. Specialized Zilliz Advisor agent via `@inkeep/agents-sdk`**

Define an agent in `config/inkeep-agent.ts` with three tool capabilities:

| Tool | Input | Output | Boundary |
|------|-------|--------|----------|
| Schema Designer | Use case description | Field types, index types, metric types + `create_collection` code | Read-only: generates code, never executes |
| Cluster Config Advisor | Data size, QPS, latency requirements | CU size, replica count, partition strategy recommendation | Read-only: advice only |
| Code Generator | Operation + preferred language | Working code snippet in Python/Java/Node.js/Go/REST | Read-only: includes `# Verify and run this` comment |

All tools are grounded in the docs via Inkeep's RAG. The agent's system prompt explicitly prohibits resource manipulation.

**2b. Enhanced ChatPanel UX**

- **Context-aware suggestions**: Replace hardcoded `SUGGESTIONS` with suggestions derived from the current doc page URL/title
- **Copy code button**: On generated code blocks in chat responses
- **Confidence indicators**: Surface Inkeep's `answerConfidence` (very_confident → not_confident) visually

**2c. Configuration**

- Agent definition: `config/inkeep-agent.ts`
- Uses Inkeep TypeScript SDK patterns from `.agents/skills/typescript-sdk/`
- Wired into `ChatPanel` via updated Inkeep settings

---

## 3. Schema.org Structured Data Plugin

### Current State

No structured data on doc pages.

### Design

**New plugin: `plugins/structured-data/index.js`**

Injects `<script type="application/ld+json">` per doc page at build time.

**Schema type mapping:**

| Path pattern | Schema type |
|-------------|-------------|
| `/reference/**` | `APIReference` |
| `/docs/**` | `TechArticle` |

**Properties (all pages):**

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "name": "<from sidebar_label or title>",
  "url": "<canonical URL>",
  "dateModified": "<from git or build time>",
  "publisher": { "@type": "Organization", "name": "Zilliz" },
  "proficiencyLevel": "<from frontmatter, default: Beginner>",
  "programmingLanguage": "<detected from code blocks>",
  "dependencies": "<from frontmatter prerequisites>"
}
```

**Zero author burden by default** — all fields have sensible inferred defaults. Authors can optionally enrich via frontmatter.

---

## 4. MCP Exposure via Inkeep

### Current State

`.mcp.json` configured with `https://agents.inkeep.com/mcp` for local dev. Not documented or discoverable.

### Design

**4a. Documentation page**

New doc page at `/docs/ai-tools-integration` covering:
- How to connect Claude Code, Cursor, and other MCP-compatible tools
- MCP endpoint URL and configuration snippets
- What queries the MCP server supports

**4b. llms.txt discovery**

Root `llms.txt` includes:
```
## Programmatic Access
- MCP Server: https://agents.inkeep.com/mcp
```

**4c. No custom server**

Inkeep's MCP server already indexes the docs. We surface it, not rebuild it.

---

## 5. Context-Friendly Doc Authoring Guidelines

### Current State

Docs authored for human reading — prose-heavy, cross-referencing, explanation-before-code.

### Design

**5a. Authoring guidelines document**

Conventions for doc authors (not enforced by tooling):
- **Code-first**: Lead with a working example, then explain
- **Self-contained pages**: Inline 1-2 line prerequisite summaries instead of bare links
- **Concise prose**: No "In this guide you will learn..." — start with the action
- **One task per page**: Avoid multi-topic pages

**5b. Extended frontmatter schema**

New optional fields consumed by llms-txt and structured-data plugins:
```yaml
---
content_type: tutorial  # tutorial | api-reference | conceptual | troubleshooting
languages: [python, java, nodejs, go, rest]
prerequisites:
  - Active Zilliz Cloud cluster
  - pymilvus >= 2.5
proficiencyLevel: beginner  # beginner | intermediate | advanced
---
```

**5c. No enforcement tooling**

Guidelines only. Plugins handle missing fields gracefully with inferred defaults.

---

## Implementation Order

| Phase | Workstream | Dependency |
|-------|-----------|------------|
| 1 | llms-txt v2 (tiered output) | None |
| 2 | Structured data plugin | None (parallel with Phase 1) |
| 3 | Authoring guidelines + frontmatter schema | After Phase 1 (informs field names) |
| 4 | Inkeep agent upgrade | After Phase 3 (uses enhanced content) |
| 5 | MCP exposure + docs page | After Phase 4 (references agent capabilities) |

Phases 1 and 2 can run in parallel. Phases 3-5 are sequential.

---

## Out of Scope

- Direct resource manipulation via Inkeep agent (explicit boundary)
- Custom MCP server (use Inkeep's existing one)
- CI enforcement of authoring guidelines
- Dark mode (already disabled in site config)
- Agent-to-Agent protocol / sub-agent delegation
- Feedback loop / doc gap detection automation
