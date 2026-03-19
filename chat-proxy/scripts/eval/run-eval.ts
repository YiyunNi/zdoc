/**
 * Send test questions to a running chat-proxy server and collect answers.
 *
 * Usage:
 *   npx tsx scripts/eval/run-eval.ts --model anthropic/claude-sonnet-4.6
 *
 * The --model flag is for labeling only; the actual model is whatever the
 * server is configured with via AI_MODEL env var.
 *
 * Prerequisites:
 *   - results/test-set.json exists (run select-questions.ts first)
 *   - chat-proxy server is running on localhost:8787
 */

import {
  readResults,
  writeResults,
  sendQuestion,
  slugify,
  sleep,
  type TestQuestion,
  type EvalResult,
} from './lib.js';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const modelIdx = args.indexOf('--model');
const model = modelIdx >= 0 && args[modelIdx + 1] ? args[modelIdx + 1] : 'unknown';

const urlIdx = args.indexOf('--url');
const baseUrl = urlIdx >= 0 && args[urlIdx + 1] ? args[urlIdx + 1] : 'http://localhost:8787';

const pageUrlIdx = args.indexOf('--page-url');
const pageUrl = pageUrlIdx >= 0 && args[pageUrlIdx + 1] ? args[pageUrlIdx + 1] : undefined;

const slug = slugify(model);

console.log(`Model: ${model}`);
console.log(`Server: ${baseUrl}`);
if (pageUrl) console.log(`Page URL: ${pageUrl} (section filter active)`);
console.log(`Output: results/answers-${slug}.json\n`);

// ---------------------------------------------------------------------------
// Load test set
// ---------------------------------------------------------------------------

let questions: TestQuestion[];
try {
  questions = readResults<TestQuestion[]>('test-set.json');
} catch {
  console.error('Error: results/test-set.json not found. Run select-questions.ts first.');
  process.exit(1);
}

console.log(`Loaded ${questions.length} questions\n`);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

try {
  const health = await fetch(`${baseUrl}/health`);
  if (!health.ok) throw new Error(`HTTP ${health.status}`);
  const data = await health.json() as Record<string, unknown>;
  console.log(`Server health: ${JSON.stringify(data)}\n`);
} catch (err) {
  console.error(`Cannot reach server at ${baseUrl}. Is it running?`);
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Run evaluation
// ---------------------------------------------------------------------------

const results: EvalResult[] = [];
let successes = 0;
let failures = 0;

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  const progress = `[${i + 1}/${questions.length}]`;

  process.stdout.write(`${progress} ${q.question.slice(0, 70)}... `);

  const response = await sendQuestion(q.question, baseUrl, pageUrl);

  const result: EvalResult = {
    questionId: q.id,
    question: q.question,
    model,
    answer: response.answer,
    agent: response.agent,
    confidence: response.confidence,
    sources: response.sources,
    latencyMs: response.latencyMs,
    firstByteMs: response.firstByteMs,
    error: response.error,
  };

  results.push(result);

  if (response.error) {
    console.log(`ERROR (${response.latencyMs}ms): ${response.error}`);
    failures++;
  } else {
    console.log(`OK (${response.latencyMs}ms, ${response.confidence.level}, ${response.sources.length} sources)`);
    successes++;
  }

  // Brief delay between requests to avoid overwhelming the server
  if (i < questions.length - 1) {
    await sleep(1000);
  }
}

// ---------------------------------------------------------------------------
// Summary & output
// ---------------------------------------------------------------------------

const avgLatency = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length;
const avgFirstByte = results.filter(r => r.firstByteMs > 0).reduce((sum, r) => sum + r.firstByteMs, 0) /
  (results.filter(r => r.firstByteMs > 0).length || 1);

console.log(`\n--- Summary ---`);
console.log(`Model: ${model}`);
console.log(`Total: ${results.length} | Success: ${successes} | Failures: ${failures}`);
console.log(`Avg latency: ${avgLatency.toFixed(0)}ms | Avg first byte: ${avgFirstByte.toFixed(0)}ms`);

// Confidence distribution
const confDist = new Map<string, number>();
for (const r of results) {
  const level = r.confidence.level || 'unknown';
  confDist.set(level, (confDist.get(level) || 0) + 1);
}
console.log(`Confidence: ${[...confDist.entries()].map(([k, v]) => `${k}=${v}`).join(', ')}`);

// Agent distribution
const agentDist = new Map<string, number>();
for (const r of results) {
  const type = r.agent.type || 'unknown';
  agentDist.set(type, (agentDist.get(type) || 0) + 1);
}
console.log(`Agents: ${[...agentDist.entries()].map(([k, v]) => `${k}=${v}`).join(', ')}`);

// Source stats
const withSources = results.filter(r => r.sources.length > 0).length;
console.log(`With sources: ${withSources}/${results.length}`);

const filename = `answers-${slug}.json`;
writeResults(filename, results);
console.log(`\nWrote results/${filename}`);
