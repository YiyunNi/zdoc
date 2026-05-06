/**
 * Build eval inputs from the curated agent question bank.
 *
 * Usage:
 *   npx tsx scripts/eval/build-question-bank.ts
 *   npx tsx scripts/eval/build-question-bank.ts --ids known-cluster-status-values,deployment-hnsw-cloud
 *   npx tsx scripts/eval/build-question-bank.ts --modules search,rbac
 *   npx tsx scripts/eval/build-question-bank.ts --blocking-only
 *   npx tsx scripts/eval/build-question-bank.ts --exclude-safety
 *
 * Output:
 *   scripts/eval/results/test-set.json
 *   scripts/eval/results/question-bank-coverage.md
 */

import {readFileSync, writeFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import {ensureResultsDir, RESULTS_DIR, writeResults} from './lib.js';

type Priority = 'P0' | 'P1' | 'P2';

interface QuestionBankItem {
  id: string;
  module: string;
  feature: string;
  question: string;
  expectedBehavior: string;
  priority: Priority;
  source: string;
  tags: string[];
  blocking?: boolean;
}

interface EvalQuestion {
  id: string;
  question: string;
  inkeepAnswer: string;
  questionType: string;
  category: string;
  languages: string;
  entities: string;
  expectedBehavior: string;
  priority: Priority;
  module: string;
  feature: string;
  source: string;
  tags: string[];
  blocking: boolean;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const BANK_PATH = join(__dirname, 'question-bank', 'items.json');

const REQUIRED_MODULES = [
  'search',
  'reranking',
  'embedding',
  'rbac',
  'clouds-and-regions',
  'deployment-mode',
];

const args = process.argv.slice(2);

function readArg(name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  return args[index + 1];
}

function readListArg(name: string): Set<string> | undefined {
  const value = readArg(name);
  if (!value) return undefined;
  return new Set(value.split(',').map(v => v.trim()).filter(Boolean));
}

const moduleFilter = readListArg('--modules');
const idFilter = readListArg('--ids');
const priorityFilter = readListArg('--priorities');
const tagFilter = readListArg('--tags');
const blockingOnly = args.includes('--blocking-only');
const excludeSafety = args.includes('--exclude-safety');

function loadBank(): QuestionBankItem[] {
  const raw = JSON.parse(readFileSync(BANK_PATH, 'utf-8')) as QuestionBankItem[];
  validateBank(raw);
  return raw;
}

function validateBank(items: QuestionBankItem[]): void {
  const ids = new Set<string>();
  const errors: string[] = [];

  for (const item of items) {
    if (!item.id) errors.push('Question is missing id');
    if (ids.has(item.id)) errors.push(`Duplicate id: ${item.id}`);
    ids.add(item.id);

    if (!item.module) errors.push(`${item.id}: missing module`);
    if (!item.feature) errors.push(`${item.id}: missing feature`);
    if (!item.question) errors.push(`${item.id}: missing question`);
    if (!item.expectedBehavior) errors.push(`${item.id}: missing expectedBehavior`);
    if (!['P0', 'P1', 'P2'].includes(item.priority)) {
      errors.push(`${item.id}: invalid priority ${item.priority}`);
    }
    if (!Array.isArray(item.tags)) errors.push(`${item.id}: tags must be an array`);
  }

  for (const moduleName of REQUIRED_MODULES) {
    if (!items.some(item => item.module === moduleName)) {
      errors.push(`Required module has no questions: ${moduleName}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Question bank validation failed:\n${errors.map(e => `- ${e}`).join('\n')}`);
  }
}

function matchesFilters(item: QuestionBankItem): boolean {
  if (idFilter && !idFilter.has(item.id)) return false;
  if (moduleFilter && !moduleFilter.has(item.module)) return false;
  if (priorityFilter && !priorityFilter.has(item.priority)) return false;
  if (tagFilter && !item.tags.some(tag => tagFilter.has(tag))) return false;
  if (blockingOnly && !item.blocking) return false;
  if (excludeSafety && item.module === 'agent-safety') return false;
  return true;
}

function toEvalQuestion(item: QuestionBankItem): EvalQuestion {
  return {
    id: item.id,
    question: item.question,
    inkeepAnswer: '',
    questionType: item.tags[0] || item.feature,
    category: item.module,
    languages: '',
    entities: item.feature,
    expectedBehavior: item.expectedBehavior,
    priority: item.priority,
    module: item.module,
    feature: item.feature,
    source: item.source,
    tags: item.tags,
    blocking: Boolean(item.blocking),
  };
}

function countBy<T extends string>(items: QuestionBankItem[], key: (item: QuestionBankItem) => T): Map<T, number> {
  const counts = new Map<T, number>();
  for (const item of items) {
    const value = key(item);
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return counts;
}

function renderCoverage(items: QuestionBankItem[], selected: QuestionBankItem[]): string {
  const allModules = [...new Set(items.map(item => item.module))].sort();
  const moduleCounts = countBy(items, item => item.module);
  const selectedModuleCounts = countBy(selected, item => item.module);
  const priorityCounts = countBy(items, item => item.priority);
  const selectedPriorityCounts = countBy(selected, item => item.priority);
  const blockingCount = items.filter(item => item.blocking).length;
  const selectedBlockingCount = selected.filter(item => item.blocking).length;

  const lines = [
    '# Agent Question Bank Coverage',
    '',
    'Generated by `scripts/eval/build-question-bank.ts`.',
    '',
    '## Summary',
    '',
    `- Total questions: ${items.length}`,
    `- Selected questions: ${selected.length}`,
    `- Blocking questions: ${blockingCount}`,
    `- Selected blocking questions: ${selectedBlockingCount}`,
    '',
    '## Module Coverage',
    '',
    '| Module | Total | Selected | Features |',
    '|---|---:|---:|---|',
  ];

  for (const moduleName of allModules) {
    const features = [...new Set(items
      .filter(item => item.module === moduleName)
      .map(item => item.feature))]
      .sort()
      .join(', ');
    lines.push(`| ${moduleName} | ${moduleCounts.get(moduleName) || 0} | ${selectedModuleCounts.get(moduleName) || 0} | ${features} |`);
  }

  lines.push(
    '',
    '## Priority Coverage',
    '',
    '| Priority | Total | Selected |',
    '|---|---:|---:|',
  );

  for (const priority of ['P0', 'P1', 'P2'] as const) {
    lines.push(`| ${priority} | ${priorityCounts.get(priority) || 0} | ${selectedPriorityCounts.get(priority) || 0} |`);
  }

  lines.push(
    '',
    '## Safety Gate',
    '',
    'The `agent-safety` module and questions tagged `security`, `prompt-injection`, `prompt-leakage`, `implementation-leakage`, or `secrets` are release gates. Any failure in a blocking safety question should block the prompt TPR until fixed or explicitly marked out of scope.',
    '',
    '## Selected Questions',
    '',
    '| ID | Module | Feature | Priority | Blocking |',
    '|---|---|---|---|---:|',
  );

  for (const item of selected) {
    lines.push(`| ${item.id} | ${item.module} | ${item.feature} | ${item.priority} | ${item.blocking ? 'yes' : 'no'} |`);
  }

  return `${lines.join('\n')}\n`;
}

const bank = loadBank();
const selected = bank.filter(matchesFilters);
const evalQuestions = selected.map(toEvalQuestion);

writeResults('test-set.json', evalQuestions);
writeResults('question-bank.json', selected);
ensureResultsDir();
writeFileSync(join(RESULTS_DIR, 'question-bank-coverage.md'), renderCoverage(bank, selected));

console.log(`Loaded ${bank.length} question-bank items`);
console.log(`Selected ${selected.length} items`);
console.log('Wrote results/test-set.json');
console.log('Wrote results/question-bank.json');
console.log('Wrote results/question-bank-coverage.md');
