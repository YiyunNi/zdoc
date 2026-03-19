/**
 * LLM-as-Judge: score and compare answers using Claude Sonnet via OpenRouter.
 *
 * Modes:
 *   # vs Inkeep baseline
 *   npx tsx scripts/eval/judge.ts --baseline inkeep --candidate results/answers-model.json
 *
 *   # Two models head-to-head
 *   npx tsx scripts/eval/judge.ts --a results/answers-model1.json --b results/answers-model2.json
 *
 *   # Multi-model cost-effectiveness matrix
 *   npx tsx scripts/eval/judge.ts --matrix
 */

import {config} from 'dotenv';
import {readFileSync, readdirSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {createOpenAI} from '@ai-sdk/openai';

// Load .env from project root (three levels up from scripts/eval/)
const __judgeDir = dirname(fileURLToPath(import.meta.url));
config({path: join(__judgeDir, '..', '..', '..', '.env')});
import {generateObject} from 'ai';
import {z} from 'zod';
import {
  readResults,
  writeResults,
  sleep,
  slugify,
  RESULTS_DIR,
  type TestQuestion,
  type EvalResult,
  type JudgeScore,
  type DimScores,
} from './lib.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const JUDGE_MODEL = process.env.JUDGE_MODEL || 'anthropic/claude-sonnet-4-6';
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1';
const AI_API_KEY = process.env.AI_API_KEY || '';

const provider = createOpenAI({baseURL: AI_BASE_URL, apiKey: AI_API_KEY});

// Hardcoded cost per 1M tokens (input/output) for matrix mode
const MODEL_COSTS: Record<string, {input: number; output: number}> = {
  'minimax/minimax-m2.7': {input: 0.50, output: 2.00},
  'xiaomi/mimo-v2-omni': {input: 0.27, output: 1.10},
  'openai/gpt-5.4-nano': {input: 0.10, output: 0.40},
  'z-ai/glm-5-turbo': {input: 0.15, output: 0.60},
  'qwen/qwen3.5-9b': {input: 0.20, output: 0.80},
  'google/gemini-3.1-flash-lite-preview': {input: 0.08, output: 0.30},
  'qwen/qwen3.5-35b-a3b': {input: 0.25, output: 1.00},
  'anthropic/claude-sonnet-4.6': {input: 3.00, output: 15.00},
};

// ---------------------------------------------------------------------------
// Judge schema
// ---------------------------------------------------------------------------

const scoreSchema = z.object({
  scores_a: z.object({
    accuracy: z.number().min(1).max(5),
    completeness: z.number().min(1).max(5),
    actionability: z.number().min(1).max(5),
    conciseness: z.number().min(1).max(5),
    sourceQuality: z.number().min(1).max(5),
  }),
  scores_b: z.object({
    accuracy: z.number().min(1).max(5),
    completeness: z.number().min(1).max(5),
    actionability: z.number().min(1).max(5),
    conciseness: z.number().min(1).max(5),
    sourceQuality: z.number().min(1).max(5),
  }),
  winner: z.enum(['A', 'B', 'Tie']),
  reasoning: z.string(),
});

// ---------------------------------------------------------------------------
// Judge a single pair
// ---------------------------------------------------------------------------

function coerceScores(raw: Record<string, unknown>): DimScores {
  return {
    accuracy: Number(raw.accuracy) || 1,
    completeness: Number(raw.completeness) || 1,
    actionability: Number(raw.actionability) || 1,
    conciseness: Number(raw.conciseness) || 1,
    sourceQuality: Number(raw.sourceQuality) || 1,
  };
}

interface JudgeResult {
  scores_a: DimScores;
  scores_b: DimScores;
  winner: 'A' | 'B' | 'Tie';
  reasoning: string;
}

async function judgeQuestion(
  question: string,
  answerA: string,
  sourcesA: string,
  answerB: string,
  sourcesB: string,
): Promise<JudgeResult> {
  const result = await generateObject({
    model: provider(JUDGE_MODEL),
    schema: scoreSchema,
    maxTokens: 1000,
    prompt: `You are an expert evaluator for a Zilliz Cloud / Milvus documentation assistant.

Compare two answers (A and B) to the same user question. Score each answer on five dimensions (1-5 scale, 5 = best):

1. **Accuracy** — Factually correct for Zilliz/Milvus? No hallucinations?
2. **Completeness** — Fully addresses the question? Covers edge cases?
3. **Actionability** — Can a developer follow this to solve their problem?
4. **Conciseness** — Appropriate length? Not padded, not too terse?
5. **Source Quality** — Relevant documentation linked? Sources support claims?

Then pick a **Winner**: A, B, or Tie.

## Question
${question}

## Answer A
${answerA}

### Sources A
${sourcesA || '(none)'}

## Answer B
${answerB}

### Sources B
${sourcesB || '(none)'}

Score both answers and pick a winner. Be rigorous — hallucinated content or missing sources should lower scores significantly.`,
  });

  const obj = result.object;
  return {
    scores_a: coerceScores(obj.scores_a as Record<string, unknown>),
    scores_b: coerceScores(obj.scores_b as Record<string, unknown>),
    winner: (obj.winner as 'A' | 'B' | 'Tie') || 'Tie',
    reasoning: String(obj.reasoning || ''),
  };
}

// ---------------------------------------------------------------------------
// Load answer files
// ---------------------------------------------------------------------------

function loadAnswers(path: string): EvalResult[] {
  if (path.startsWith('results/')) {
    return readResults<EvalResult[]>(path.replace('results/', ''));
  }
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function loadTestSet(): TestQuestion[] {
  return readResults<TestQuestion[]>('test-set.json');
}

function formatSources(sources: Array<{title: string; url: string}>): string {
  if (!sources || sources.length === 0) return '(none)';
  return sources.map(s => `- [${s.title}](${s.url})`).join('\n');
}

// ---------------------------------------------------------------------------
// Baseline mode (vs Inkeep)
// ---------------------------------------------------------------------------

async function runBaseline(candidatePath: string): Promise<void> {
  const testSet = loadTestSet();
  const candidate = loadAnswers(candidatePath);
  const model = candidate[0]?.model || 'unknown';

  console.log(`Judging ${model} vs Inkeep baseline`);
  console.log(`Questions: ${testSet.length}\n`);

  const scores: JudgeScore[] = [];

  for (let i = 0; i < testSet.length; i++) {
    const q = testSet[i];
    const cResult = candidate.find(r => r.questionId === q.id);

    if (!cResult) {
      console.log(`[${i + 1}/${testSet.length}] SKIP — no answer for ${q.id}`);
      continue;
    }

    // Random A/B swap to mitigate position bias
    const swapped = Math.random() < 0.5;
    const [aAnswer, aSources, bAnswer, bSources] = swapped
      ? [cResult.answer, formatSources(cResult.sources), q.inkeepAnswer, '(Inkeep — sources inline)']
      : [q.inkeepAnswer, '(Inkeep — sources inline)', cResult.answer, formatSources(cResult.sources)];

    process.stdout.write(`[${i + 1}/${testSet.length}] ${q.question.slice(0, 60)}... `);

    try {
      const result = await judgeQuestion(q.question, aAnswer, aSources, bAnswer, bSources);

      // Unswap: A=candidate, B=inkeep in output regardless of presentation order
      const score: JudgeScore = {
        questionId: q.id,
        question: q.question,
        modelA: model,
        modelB: 'inkeep',
        scores: swapped
          ? {a: result.scores_a, b: result.scores_b}   // A was candidate
          : {a: result.scores_b, b: result.scores_a},   // B was candidate
        winner: swapped
          ? result.winner
          : (result.winner === 'A' ? 'B' : result.winner === 'B' ? 'A' : 'Tie'),
        reasoning: result.reasoning,
        swapped,
      };

      scores.push(score);

      // A=candidate in the normalized score
      console.log(score.winner === 'A' ? 'WIN' : score.winner === 'B' ? 'LOSS' : 'TIE');
    } catch (err) {
      console.log(`ERROR: ${err instanceof Error ? err.message : err}`);
    }

    if (i < testSet.length - 1) await sleep(500);
  }

  // Summary
  printBaselineSummary(scores, model);

  const filename = `judge-vs-inkeep-${slugify(model)}.json`;
  writeResults(filename, scores);
  console.log(`\nWrote results/${filename}`);
}

function printBaselineSummary(scores: JudgeScore[], model: string): void {
  let wins = 0, losses = 0, ties = 0;
  const dims = {accuracy: 0, completeness: 0, actionability: 0, conciseness: 0, sourceQuality: 0};
  const inkeepDims = {...dims};

  for (const s of scores) {
    const isCandidate = s.modelA === model ? 'a' : 'b';
    const isInkeep = isCandidate === 'a' ? 'b' : 'a';

    const cScores = s.scores[isCandidate as 'a' | 'b'];
    const iScores = s.scores[isInkeep as 'a' | 'b'];

    for (const dim of Object.keys(dims) as Array<keyof typeof dims>) {
      dims[dim] += cScores[dim];
      inkeepDims[dim] += iScores[dim];
    }

    // Determine winner based on position
    if (s.winner === 'Tie') ties++;
    else if ((s.winner === 'A' && isCandidate === 'a') || (s.winner === 'B' && isCandidate === 'b')) wins++;
    else losses++;
  }

  const n = scores.length || 1;
  console.log(`\n--- ${model} vs Inkeep ---`);
  console.log(`Wins: ${wins} | Losses: ${losses} | Ties: ${ties} | Win Rate: ${((wins / n) * 100).toFixed(1)}%`);
  console.log(`\nAvg scores (${model} / Inkeep):`);
  for (const dim of Object.keys(dims) as Array<keyof typeof dims>) {
    console.log(`  ${dim}: ${(dims[dim] / n).toFixed(2)} / ${(inkeepDims[dim] / n).toFixed(2)}`);
  }
}

// ---------------------------------------------------------------------------
// Head-to-head mode
// ---------------------------------------------------------------------------

async function runHeadToHead(pathA: string, pathB: string): Promise<void> {
  const answersA = loadAnswers(pathA);
  const answersB = loadAnswers(pathB);
  const modelA = answersA[0]?.model || 'model-a';
  const modelB = answersB[0]?.model || 'model-b';

  console.log(`Judging ${modelA} vs ${modelB}`);

  const scores: JudgeScore[] = [];

  for (let i = 0; i < answersA.length; i++) {
    const a = answersA[i];
    const b = answersB.find(r => r.questionId === a.questionId);
    if (!b) continue;

    const swapped = Math.random() < 0.5;
    const [aAns, aSrc, bAns, bSrc] = swapped
      ? [b.answer, formatSources(b.sources), a.answer, formatSources(a.sources)]
      : [a.answer, formatSources(a.sources), b.answer, formatSources(b.sources)];

    process.stdout.write(`[${i + 1}/${answersA.length}] ${a.question.slice(0, 60)}... `);

    try {
      const result = await judgeQuestion(a.question, aAns, aSrc, bAns, bSrc);

      // Normalize: A=modelA, B=modelB regardless of presentation order
      scores.push({
        questionId: a.questionId,
        question: a.question,
        modelA,
        modelB,
        scores: swapped
          ? {a: result.scores_b, b: result.scores_a}
          : {a: result.scores_a, b: result.scores_b},
        winner: swapped
          ? (result.winner === 'A' ? 'B' : result.winner === 'B' ? 'A' : 'Tie')
          : result.winner,
        reasoning: result.reasoning,
        swapped,
      });

      const normalized = scores[scores.length - 1];
      console.log(normalized.winner === 'Tie' ? 'TIE' : `Winner: ${normalized.winner === 'A' ? modelA : modelB}`);
    } catch (err) {
      console.log(`ERROR: ${err instanceof Error ? err.message : err}`);
    }

    if (i < answersA.length - 1) await sleep(500);
  }

  const filename = `judge-${slugify(modelA)}-vs-${slugify(modelB)}.json`;
  writeResults(filename, scores);
  console.log(`\nWrote results/${filename}`);
}

// ---------------------------------------------------------------------------
// Matrix mode
// ---------------------------------------------------------------------------

async function runMatrix(): Promise<void> {
  // Find all answer files
  const files = readdirSync(RESULTS_DIR).filter(f => f.startsWith('answers-') && f.endsWith('.json'));

  if (files.length === 0) {
    console.error('No answer files found in results/. Run run-eval.ts first.');
    process.exit(1);
  }

  // Also need judge results vs inkeep
  const judgeFiles = readdirSync(RESULTS_DIR).filter(f => f.startsWith('judge-vs-inkeep-') && f.endsWith('.json'));

  console.log(`Found ${files.length} answer files, ${judgeFiles.length} judge results\n`);

  // Build matrix
  interface ModelStats {
    model: string;
    avgScore: number;
    winRateVsInkeep: number;
    avgLatency: number;
    estCostPerQuery: number;
    costEffectiveness: number;
    dims: Record<string, number>;
    questionCount: number;
  }

  const stats: ModelStats[] = [];

  for (const file of files) {
    const answers = readResults<EvalResult[]>(file);
    if (answers.length === 0) continue;

    const model = answers[0].model;
    const slug = slugify(model);

    // Avg latency
    const avgLatency = answers.reduce((s, r) => s + r.latencyMs, 0) / answers.length;

    // Estimated cost per query (rough: avg answer chars / 4 ≈ tokens)
    const avgOutputTokens = answers.reduce((s, r) => s + r.answer.length / 4, 0) / answers.length;
    const avgInputTokens = 2000; // system prompt + context estimate
    const costs = MODEL_COSTS[model] || {input: 1.0, output: 4.0};
    const estCostPerQuery = (avgInputTokens * costs.input + avgOutputTokens * costs.output) / 1_000_000;

    // Win rate vs inkeep (if judge file exists)
    let winRateVsInkeep = 0;
    let avgScore = 0;
    const dims: Record<string, number> = {accuracy: 0, completeness: 0, actionability: 0, conciseness: 0, sourceQuality: 0};

    const judgeFile = judgeFiles.find(f => f.includes(slug));
    if (judgeFile) {
      const judgeResults = readResults<JudgeScore[]>(judgeFile);
      let wins = 0;

      for (const s of judgeResults) {
        const isCandidate = s.modelA === model ? 'a' : 'b';
        const cScores = s.scores[isCandidate as 'a' | 'b'];

        for (const dim of Object.keys(dims)) {
          dims[dim] += cScores[dim as keyof typeof cScores];
        }

        if (s.winner === 'Tie') wins += 0.5;
        else if ((s.winner === 'A' && isCandidate === 'a') || (s.winner === 'B' && isCandidate === 'b')) wins++;
      }

      const n = judgeResults.length || 1;
      winRateVsInkeep = wins / n;
      for (const dim of Object.keys(dims)) dims[dim] /= n;
      avgScore = Object.values(dims).reduce((a, b) => a + b, 0) / 5;
    }

    const costEffectiveness = estCostPerQuery > 0 ? avgScore / (estCostPerQuery * 1000) : 0;

    stats.push({
      model,
      avgScore,
      winRateVsInkeep,
      avgLatency,
      estCostPerQuery,
      costEffectiveness,
      dims,
      questionCount: answers.length,
    });
  }

  // Sort by cost-effectiveness
  stats.sort((a, b) => b.costEffectiveness - a.costEffectiveness);

  // Print table
  console.log('='.repeat(120));
  console.log(
    padRight('Model', 35),
    padRight('Avg Score', 10),
    padRight('Win Rate', 10),
    padRight('Latency', 10),
    padRight('$/query', 10),
    padRight('Cost-Eff', 10),
    padRight('Questions', 10),
  );
  console.log('='.repeat(120));

  for (const s of stats) {
    console.log(
      padRight(s.model, 35),
      padRight(s.avgScore.toFixed(2), 10),
      padRight(`${(s.winRateVsInkeep * 100).toFixed(1)}%`, 10),
      padRight(`${s.avgLatency.toFixed(0)}ms`, 10),
      padRight(`$${s.estCostPerQuery.toFixed(5)}`, 10),
      padRight(s.costEffectiveness.toFixed(1), 10),
      padRight(String(s.questionCount), 10),
    );
  }
  console.log('='.repeat(120));

  // Detailed dimension breakdown
  console.log('\nDimension Breakdown:');
  console.log(
    padRight('Model', 35),
    padRight('Accuracy', 10),
    padRight('Complete', 10),
    padRight('Action', 10),
    padRight('Concise', 10),
    padRight('Sources', 10),
  );
  console.log('-'.repeat(85));
  for (const s of stats) {
    if (s.avgScore === 0) continue;
    console.log(
      padRight(s.model, 35),
      padRight(s.dims.accuracy?.toFixed(2) || '-', 10),
      padRight(s.dims.completeness?.toFixed(2) || '-', 10),
      padRight(s.dims.actionability?.toFixed(2) || '-', 10),
      padRight(s.dims.conciseness?.toFixed(2) || '-', 10),
      padRight(s.dims.sourceQuality?.toFixed(2) || '-', 10),
    );
  }

  writeResults('matrix.json', stats);
  console.log(`\nWrote results/matrix.json`);
}

function padRight(str: string, len: number): string {
  return str.padEnd(len);
}

// ---------------------------------------------------------------------------
// CLI dispatch
// ---------------------------------------------------------------------------

const cliArgs = process.argv.slice(2);

if (cliArgs.includes('--matrix')) {
  await runMatrix();
} else if (cliArgs.includes('--baseline')) {
  const candidateIdx = cliArgs.indexOf('--candidate');
  if (candidateIdx < 0 || !cliArgs[candidateIdx + 1]) {
    console.error('Usage: --baseline inkeep --candidate results/answers-model.json');
    process.exit(1);
  }
  await runBaseline(cliArgs[candidateIdx + 1]);
} else if (cliArgs.includes('--a') && cliArgs.includes('--b')) {
  const aIdx = cliArgs.indexOf('--a');
  const bIdx = cliArgs.indexOf('--b');
  if (!cliArgs[aIdx + 1] || !cliArgs[bIdx + 1]) {
    console.error('Usage: --a results/answers-model1.json --b results/answers-model2.json');
    process.exit(1);
  }
  await runHeadToHead(cliArgs[aIdx + 1], cliArgs[bIdx + 1]);
} else {
  console.log(`Usage:
  npx tsx scripts/eval/judge.ts --baseline inkeep --candidate results/answers-model.json
  npx tsx scripts/eval/judge.ts --a results/answers-model1.json --b results/answers-model2.json
  npx tsx scripts/eval/judge.ts --matrix`);
}
