/**
 * Shared library for eval scripts: types, CSV parser, SSE client, I/O helpers.
 */

import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TestQuestion {
  id: string;
  question: string;
  inkeepAnswer: string;
  questionType: string;
  category: string;
  languages: string;
  entities: string;
}

export interface EvalResult {
  questionId: string;
  question: string;
  model: string;
  answer: string;
  agent: {type: string; name: string};
  confidence: {level: string; retrieval_score: number};
  sources: Array<{title: string; url: string}>;
  latencyMs: number;
  firstByteMs: number;
  error?: string;
}

export interface DimScores {
  accuracy: number;
  completeness: number;
  actionability: number;
  conciseness: number;
  sourceQuality: number;
}

export interface JudgeScore {
  questionId: string;
  question: string;
  modelA: string;
  modelB: string;
  scores: {a: DimScores; b: DimScores};
  winner: 'A' | 'B' | 'Tie';
  reasoning: string;
  swapped: boolean;
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
export const RESULTS_DIR = join(__dirname, 'results');
export const CSV_PATH = join(__dirname, '..', '..', '..', 'static', 'chat-sessions-2026-03-19.csv');

export function ensureResultsDir(): void {
  if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, {recursive: true});
}

// ---------------------------------------------------------------------------
// CSV Parser (RFC 4180 — handles quoted fields with commas/newlines)
// ---------------------------------------------------------------------------

export function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(field);
        field = '';
        i++;
      } else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
        row.push(field);
        field = '';
        rows.push(row);
        row = [];
        i += ch === '\r' ? 2 : 1;
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Last field/row
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1)
    .filter(r => r.length === headers.length)
    .map(r => {
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = r[idx];
      });
      return obj;
    });
}

// ---------------------------------------------------------------------------
// SSE Client — POST to chat proxy, collect streaming response
// ---------------------------------------------------------------------------

export interface SSEResponse {
  answer: string;
  agent: {type: string; name: string};
  confidence: {level: string; retrieval_score: number};
  sources: Array<{title: string; url: string}>;
  error?: string;
  latencyMs: number;
  firstByteMs: number;
}

export async function sendQuestion(
  question: string,
  baseUrl = 'http://localhost:8787',
  pageUrl?: string,
): Promise<SSEResponse> {
  const startTime = Date.now();
  let firstByteTime = 0;
  let answer = '';
  let agent = {type: '', name: ''};
  let confidence = {level: '', retrieval_score: 0};
  let sources: Array<{title: string; url: string}> = [];
  let error: string | undefined;

  try {
    const body: Record<string, unknown> = {
      messages: [{role: 'user', content: question}],
    };
    if (pageUrl) body.pageUrl = pageUrl;

    const res = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return {
        answer: '', agent, confidence, sources,
        error: `HTTP ${res.status}: ${await res.text()}`,
        latencyMs: Date.now() - startTime, firstByteMs: 0,
      };
    }

    const text = await res.text();
    if (!firstByteTime) firstByteTime = Date.now();

    // Parse SSE events
    const blocks = text.split('\n\n').filter(Boolean);
    for (const block of blocks) {
      const lines = block.split('\n');
      let event = '';
      let data = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) event = line.slice(7);
        else if (line.startsWith('data: ')) data = line.slice(6);
      }
      if (!event || !data) continue;

      try {
        const parsed = JSON.parse(data);
        switch (event) {
          case 'delta':
            answer += parsed.text || '';
            break;
          case 'agent':
            agent = {type: parsed.type || '', name: parsed.name || ''};
            break;
          case 'confidence':
            confidence = {level: parsed.level || '', retrieval_score: parsed.retrieval_score || 0};
            break;
          case 'sources':
            sources = (parsed.sources || []).map((s: any) => ({title: s.title, url: s.url}));
            break;
          case 'hook-append':
            answer += parsed.text || '';
            break;
          case 'error':
            error = parsed.error;
            break;
        }
      } catch {
        // Skip unparseable events
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  return {
    answer,
    agent,
    confidence,
    sources,
    error,
    latencyMs: Date.now() - startTime,
    firstByteMs: firstByteTime ? firstByteTime - startTime : 0,
  };
}

// ---------------------------------------------------------------------------
// Result I/O
// ---------------------------------------------------------------------------

export function writeResults(filename: string, data: unknown): void {
  ensureResultsDir();
  writeFileSync(join(RESULTS_DIR, filename), JSON.stringify(data, null, 2));
}

export function readResults<T>(filename: string): T {
  return JSON.parse(readFileSync(join(RESULTS_DIR, filename), 'utf-8'));
}

export function resultExists(filename: string): boolean {
  return existsSync(join(RESULTS_DIR, filename));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function slugify(model: string): string {
  return model.replace(/[/:]/g, '-').replace(/\./g, '-');
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
