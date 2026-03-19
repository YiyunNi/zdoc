/**
 * Curate ~40 representative test questions from the Inkeep chat sessions CSV.
 *
 * Usage: npx tsx scripts/eval/select-questions.ts
 * Output: scripts/eval/results/test-set.json
 */

import {readFileSync} from 'fs';
import {parseCSV, writeResults, CSV_PATH, type TestQuestion} from './lib.js';

const TARGET_COUNT = 40;

// ---------------------------------------------------------------------------
// Load and filter
// ---------------------------------------------------------------------------

const raw = readFileSync(CSV_PATH, 'utf-8');
const rows = parseCSV(raw);

console.log(`Parsed ${rows.length} rows from CSV`);

// Filter to good-quality, classifiable questions
const eligible = rows.filter(r =>
  r.isOnTopic === 'yes' &&
  r.isClear === 'yes' &&
  r.questionType && r.questionType.trim() !== '' &&
  r.question && r.question.trim() !== '',
);

console.log(`Eligible (on-topic, clear, typed): ${eligible.length}`);

// ---------------------------------------------------------------------------
// Stratified sample by category
// ---------------------------------------------------------------------------

// Group by category
const byCategory = new Map<string, typeof eligible>();
for (const row of eligible) {
  const cat = row.category || 'Uncategorized';
  if (!byCategory.has(cat)) byCategory.set(cat, []);
  byCategory.get(cat)!.push(row);
}

console.log(`\nCategories (${byCategory.size}):`);
for (const [cat, items] of [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${cat}: ${items.length}`);
}

// Allocate proportionally, minimum 1 per category
const categories = [...byCategory.keys()];
const totalEligible = eligible.length;
const allocation = new Map<string, number>();
let allocated = 0;

for (const cat of categories) {
  const count = byCategory.get(cat)!.length;
  const share = Math.max(1, Math.round((count / totalEligible) * TARGET_COUNT));
  allocation.set(cat, share);
  allocated += share;
}

// Adjust to hit target (trim largest categories if over)
while (allocated > TARGET_COUNT) {
  const largest = categories.reduce((a, b) =>
    (allocation.get(a)! > allocation.get(b)! ? a : b)
  );
  allocation.set(largest, allocation.get(largest)! - 1);
  allocated--;
}

// Add to smallest if under
while (allocated < TARGET_COUNT) {
  const withMore = categories.find(c =>
    byCategory.get(c)!.length > allocation.get(c)!
  );
  if (!withMore) break;
  allocation.set(withMore, allocation.get(withMore)! + 1);
  allocated++;
}

// ---------------------------------------------------------------------------
// Select from each category (prefer confident answers, diverse question types)
// ---------------------------------------------------------------------------

const selected: TestQuestion[] = [];

for (const cat of categories) {
  const items = byCategory.get(cat)!;
  const n = allocation.get(cat)!;

  // Sort: confident first, then by question type diversity
  const sorted = [...items].sort((a, b) => {
    // Prefer confident answers (better Inkeep baseline)
    if (a.isAnswerConfident === 'yes' && b.isAnswerConfident !== 'yes') return -1;
    if (b.isAnswerConfident === 'yes' && a.isAnswerConfident !== 'yes') return 1;
    // Then by question type for diversity
    return (a.questionType || '').localeCompare(b.questionType || '');
  });

  // Pick n, trying to cover different question types
  const seenTypes = new Set<string>();
  const picked: typeof items = [];

  // First pass: one per question type
  for (const row of sorted) {
    if (picked.length >= n) break;
    const qt = row.questionType || '';
    if (!seenTypes.has(qt)) {
      seenTypes.add(qt);
      picked.push(row);
    }
  }

  // Second pass: fill remaining
  for (const row of sorted) {
    if (picked.length >= n) break;
    if (!picked.includes(row)) picked.push(row);
  }

  for (const row of picked) {
    selected.push({
      id: row.id,
      question: row.question,
      inkeepAnswer: row.answer,
      questionType: row.questionType,
      category: row.category || 'Uncategorized',
      languages: row.languages || '',
      entities: row.firstPartyEntities || '',
    });
  }
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

console.log(`\nSelected ${selected.length} questions:`);
const typeCounts = new Map<string, number>();
const catCounts = new Map<string, number>();
for (const q of selected) {
  typeCounts.set(q.questionType, (typeCounts.get(q.questionType) || 0) + 1);
  catCounts.set(q.category, (catCounts.get(q.category) || 0) + 1);
}

console.log('\nBy category:');
for (const [cat, count] of [...catCounts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count}`);
}

console.log('\nBy question type:');
for (const [qt, count] of [...typeCounts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${qt}: ${count}`);
}

writeResults('test-set.json', selected);
console.log(`\nWrote results/test-set.json`);
