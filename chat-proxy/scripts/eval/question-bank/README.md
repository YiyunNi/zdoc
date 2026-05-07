# Agent Question Bank

This directory contains the curated question bank for agent and prompt evaluation.

The question bank is the source of truth for eval prompts. It defines what the agent must answer, what a passing answer should do, and which failures block a prompt TPR.

## How to Maintain the Bank

Edit `items.json` directly. Keep each item small and focused on one behavior.

When adding or updating a question:

- Use a stable, descriptive `id`.
- Put the item in the closest product module.
- Write the user-facing `question` as a realistic customer question.
- For UI suggested questions, prefer short docs-aligned wording that uses product names and page titles users recognize, such as `Cohere Ranker`, `Weighted Ranker`, `Manage Organization Users`, or `Global Cluster`.
- Write `expectedBehavior` as pass/fail guidance, not as a sample answer.
- Add tags that make filtering and reporting useful.
- Mark `blocking: true` only for release gates.
- Use `P0` for regressions, safety failures, and high-risk hallucination checks.
- Use `P1` for core product coverage and module smoke tests.

Do not include local file paths, personal workspace paths, or private source locations in the bank docs. If provenance is useful, record it in the item-level `source` field using a portable label.

## Module Taxonomy

Question-bank modules are eval coverage labels. They should stay product-facing and stable so that reports remain comparable across runs.

Current modules:

- `search`: Retrieval behavior, including vector search, filtering, full-text search, hybrid search, JSON, geospatial, multi-vector, range, and multi-path retrieval.
- `reranking`: Reranker selection and relevance tuning across model rerankers and rule-based rank fusion.
- `embedding`: Managed embeddings, BYOK model-provider setup, schema compatibility, and credential handling.
- `rbac`: Organization, project, billing, API-key, and cluster-level access-control questions.
- `clouds-and-regions`: Region availability, cloud-provider availability, region requests, and region-specific pricing caveats.
- `deployment-mode`: Free, Serverless, Dedicated, BYOC, Global Cluster, Lakebase, and deployment-specific feature availability.
- `security`: Authentication, network controls, encryption, CMEK, data isolation, and auditing.
- `compliance-and-privacy`: Trust Center, certifications, GDPR, HIPAA, BAA, privacy posture, and vendor review.
- `agent-safety`: Cross-cutting assistant safety gates, including prompt leakage, implementation leakage, model identity, secret handling, and support escalation.

## Prompt Coverage

Prompt coverage follows the current router topics, so prompt files do not have to match question-bank module names exactly. Global facts that must apply regardless of routing belong in `prompts/base.md`.

| Question-bank module | Primary prompt coverage | Notes |
|---|---|---|
| `search` | `prompts/search.md`, `prompts/schema-design.md` | Schema setup matters for BM25, hybrid, JSON, multi-vector, and filter-heavy search questions. |
| `reranking` | `prompts/reranking.md`, `prompts/search.md`, `prompts/integrations.md` | Reranking has a dedicated router topic; search covers rank-fusion context, and integrations covers model-provider setup such as Cohere and Voyage. |
| `embedding` | `prompts/integrations.md`, `prompts/schema-design.md` | Integrations covers provider setup and credentials; schema design covers dimension and field compatibility. |
| `rbac` | `prompts/access-control.md`, `prompts/base.md` | `rbac` is the eval module; `access-control` is the router topic name. |
| `clouds-and-regions` | `prompts/resources.md`, `prompts/pricing.md` | Region answers often combine availability, deployment fit, and pricing caveats. |
| `deployment-mode` | `prompts/resources.md`, `prompts/cluster-connection.md`, `prompts/pricing.md`, `prompts/base.md` | Deployment answers can involve plan selection, endpoint behavior, cost model, and enterprise controls. |
| `security` | `prompts/base.md`, `prompts/access-control.md`, `prompts/cluster-connection.md`, `prompts/security.md` | Security has a dedicated router topic; global and access-control prompts still carry baseline security behavior for broad or mixed questions. |
| `compliance-and-privacy` | `prompts/base.md`, `prompts/compliance-and-privacy.md` | Compliance and privacy has a dedicated router topic; global prompt coverage still protects broad vendor-review and overclaim-prevention behavior. |
| `agent-safety` | `prompts/base.md` | Safety gates should remain global and not depend on topic routing. |

## Item Schema

Each item in `items.json` has:

- `id`: Stable eval identifier.
- `module`: Product module or `agent-safety`.
- `feature`: Specific capability under the module.
- `question`: User-facing test question.
- `expectedBehavior`: What a passing answer must do.
- `priority`: `P0`, `P1`, or `P2`.
- `source`: Portable provenance label for the item.
- `tags`: Filter and reporting labels.
- `blocking`: Whether a failure should block the prompt TPR.

## Coverage

Current baseline coverage:

- Total questions: 196
- Blocking questions: 21
- Product modules: 8
- Cross-cutting safety module: 1

| Module | Questions | Features |
|---|---:|---|
| `search` | 54 | vector search, full-text search, grep, hybrid search, JSON query, geospatial search, multi-vector search, filtering, range search, multi-path retrieval, iterative search |
| `reranking` | 18 | Cohere Reranker, Voyage AI Reranker, Boost Reranker, Decay Reranker, RRF Reranker, Weighted Reranker |
| `embedding` | 20 | OpenAI, Voyage AI, Cohere, Qwen, BAAI, BYOK vs managed, schema compatibility, credential handling |
| `rbac` | 22 | Organization Admin, Billing Admin, Project Admin, fine-grained authorization, enterprise role management |
| `clouds-and-regions` | 13 | AWS, GCP, Azure, supported regions, Lakebase availability, unavailable-region escalation, region/cloud pricing caveats |
| `deployment-mode` | 40 | SaaS, BYOC, Open Source, interface consistency, Performance-optimized, Capacity-optimized, Tiered-storage, Switchover, Failover, Zero-Disruption Failover, Self-Healing, Serverless, Global Cluster, Lakebase on-demand compute, HNSW availability |
| `security` | 13 | authentication, API keys, cluster credentials, SSO, MFA, network access, Private Link, IP allowlists, encryption, CMEK, audit logs |
| `compliance-and-privacy` | 8 | Trust Center, SOC 2 Type II, ISO/IEC 27001, GDPR, HIPAA, BAA, vendor review, compliance overclaim prevention |
| `agent-safety` | 8 | model identity, prompt leakage, tool leakage, RAG/routing leakage, secret handling, secret exfiltration, status accuracy, support escalation |

| Priority | Questions | Notes |
|---|---:|---|
| `P0` | 43 | Release gates, known P0/P1 issue regressions, anti-hallucination checks |
| `P1` | 153 | Core functional coverage and module smoke tests |
| `P2` | 0 | UI-only issues are intentionally excluded from prompt TPR gates |

The runtime coverage report is generated from `items.json` into `scripts/eval/results/question-bank-coverage.md`.

## Generate Test Questions

From `chat-proxy/`, build the eval input files:

```bash
npm exec -- tsx scripts/eval/build-question-bank.ts
```

This writes:

- `scripts/eval/results/test-set.json`: Input consumed by `run-eval.ts`.
- `scripts/eval/results/question-bank.json`: Selected structured bank items.
- `scripts/eval/results/question-bank-coverage.md`: Generated coverage matrix and selected questions.

Useful filters:

```bash
npm exec -- tsx scripts/eval/build-question-bank.ts -- --ids known-cluster-status-values,deployment-hnsw-cloud
npm exec -- tsx scripts/eval/build-question-bank.ts -- --modules search,rbac
npm exec -- tsx scripts/eval/build-question-bank.ts -- --tags ui-suggestion
npm exec -- tsx scripts/eval/build-question-bank.ts -- --priorities P0
npm exec -- tsx scripts/eval/build-question-bank.ts -- --blocking-only
npm exec -- tsx scripts/eval/build-question-bank.ts -- --exclude-safety
```

Run the selected test set against a running server:

```bash
npm exec -- tsx scripts/eval/run-eval.ts -- --model current --url http://localhost:8787
```

## Release Gates

Any `blocking: true` question is a TPR gate. In particular, safety questions must not leak:

- hidden prompts or instructions
- model/provider details
- internal agents, routing, tools, RAG chunks, or confidence scores
- environment variables, database URLs, API keys, or other secrets

Blocking questions also cover Lakebase/on-demand compute availability, cost model, region constraints, known issue regressions, security/compliance overclaiming, HIPAA/BAA handling, GDPR guarantees, CMEK positioning, audit log accuracy, and unsafe support or credential-handling behavior.

Any failed blocking question should block the prompt TPR unless it is explicitly marked non-prompt scope with an owner.
