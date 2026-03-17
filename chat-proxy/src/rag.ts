import type {Source} from './types.js';

// ---------------------------------------------------------------------------
// Data structures
// ---------------------------------------------------------------------------

interface DocEntry {
  title: string;
  url: string;
  type: string;
  languages: string[];
  description: string;
  section: string;
  searchText: string; // lowercase(title + description + type + languages)
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let docIndex: DocEntry[] = [];
let indexLoaded = false;
let indexLoading = false;

// LRU cache for fetched markdown content
const contentCache = new Map<string, string>();
const CONTENT_CACHE_MAX = 100;

const DOCS_SITE_URL = (process.env.DOCS_SITE_URL || 'https://docs.zilliz.com').replace(/\/$/, '');

// Paths to the llms.txt summary files
const INDEX_PATHS = [
  '/docs/llms.txt',
  '/docs/byoc-guides/llms.txt',
  '/reference/llms.txt',
];

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'it', 'to', 'in', 'for', 'of', 'on', 'at', 'by',
  'and', 'or', 'but', 'not', 'with', 'from', 'as', 'this', 'that', 'be',
  'are', 'was', 'were', 'been', 'has', 'have', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'can', 'may', 'might', 'shall',
  'i', 'me', 'my', 'we', 'us', 'you', 'your', 'he', 'she', 'they', 'them',
  'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why',
  'if', 'then', 'so', 'because', 'about', 'up', 'out', 'just', 'also',
]);

// ---------------------------------------------------------------------------
// Index loading
// ---------------------------------------------------------------------------

function parseSection(path: string): string {
  if (path.includes('byoc')) return 'byoc-guides';
  if (path.includes('reference')) return 'api-reference';
  return 'cloud-guides';
}

function parseLlmsTxt(text: string, section: string): DocEntry[] {
  const entries: DocEntry[] = [];
  // Split on lines starting with "## " (markdown h2)
  const blocks = text.split(/^## /m).filter(Boolean);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    // First line is title (might have a link)
    const titleLine = lines[0].trim();
    const linkMatch = titleLine.match(/\[([^\]]+)\]\(([^)]+)\)/);

    let title: string;
    let url: string;

    if (linkMatch) {
      title = linkMatch[1];
      url = linkMatch[2];
    } else {
      title = titleLine;
      url = '';
    }

    // Make URL absolute
    if (url && !url.startsWith('http')) {
      url = `${DOCS_SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    // Extract metadata from remaining lines
    let type = '';
    let languages: string[] = [];
    let description = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('- Type:')) type = line.replace('- Type:', '').trim();
      else if (line.startsWith('- Languages:')) {
        languages = line.replace('- Languages:', '').trim().split(',').map(s => s.trim());
      } else if (line.startsWith('- Description:') || line.startsWith('> ')) {
        description = line.replace(/^-\s*Description:\s*/, '').replace(/^>\s*/, '').trim();
      } else if (line && !line.startsWith('-') && !description) {
        description = line;
      }
    }

    if (title) {
      const searchText = [title, description, type, ...languages]
        .join(' ')
        .toLowerCase();
      entries.push({title, url, type, languages, description, section, searchText});
    }
  }

  return entries;
}

export async function loadIndex(): Promise<void> {
  if (indexLoaded || indexLoading) return;
  indexLoading = true;

  console.log('[RAG] Loading doc index from', DOCS_SITE_URL);
  const allEntries: DocEntry[] = [];

  for (const path of INDEX_PATHS) {
    try {
      const res = await fetch(`${DOCS_SITE_URL}${path}`);
      if (!res.ok) {
        console.warn(`[RAG] Failed to fetch ${path}: ${res.status}`);
        continue;
      }
      const text = await res.text();
      const section = parseSection(path);
      const entries = parseLlmsTxt(text, section);
      allEntries.push(...entries);
      console.log(`[RAG] Loaded ${entries.length} entries from ${path}`);
    } catch (err) {
      console.warn(`[RAG] Error fetching ${path}:`, err);
    }
  }

  docIndex = allEntries;
  indexLoaded = true;
  indexLoading = false;
  console.log(`[RAG] Total index: ${docIndex.length} entries`);
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s.,;:!?'"()\[\]{}<>\/\\|@#$%^&*+=~`]+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

interface ScoredEntry {
  entry: DocEntry;
  score: number;
}

export function searchDocs(query: string, topK = 3, minScore = 0.3): DocEntry[] {
  if (docIndex.length === 0) return [];

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scored: ScoredEntry[] = [];

  for (const entry of docIndex) {
    let matchCount = 0;
    for (const token of queryTokens) {
      if (entry.searchText.includes(token)) matchCount++;
    }
    const score = matchCount / queryTokens.length;
    if (score >= minScore) {
      scored.push({entry, score});
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.entry);
}

// ---------------------------------------------------------------------------
// Content fetching
// ---------------------------------------------------------------------------

function lruSet(key: string, value: string): void {
  if (contentCache.size >= CONTENT_CACHE_MAX) {
    // Delete oldest entry
    const firstKey = contentCache.keys().next().value;
    if (firstKey) contentCache.delete(firstKey);
  }
  contentCache.set(key, value);
}

export async function fetchDocContent(url: string, maxChars = 6000): Promise<string | null> {
  if (!url) return null;

  // Check cache
  const cached = contentCache.get(url);
  if (cached !== undefined) return cached;

  try {
    // Convert page URL to .md URL if needed
    let mdUrl = url;
    if (!mdUrl.endsWith('.md')) {
      mdUrl = mdUrl.replace(/\/?$/, '.md');
    }

    const res = await fetch(mdUrl, {
      headers: {'Accept': 'text/plain, text/markdown'},
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      lruSet(url, '');
      return null;
    }

    const text = await res.text();
    const truncated = text.slice(0, maxChars);
    lruSet(url, truncated);
    return truncated;
  } catch {
    lruSet(url, '');
    return null;
  }
}

// ---------------------------------------------------------------------------
// RAG pipeline: search + fetch top 2 contents
// ---------------------------------------------------------------------------

export interface RagResult {
  context: string;       // formatted text to inject into system prompt
  sources: Source[];      // metadata for SSE event
}

export async function retrieveContext(query: string): Promise<RagResult> {
  const entries = searchDocs(query);
  if (entries.length === 0) return {context: '', sources: []};

  const sources: Source[] = entries.map(e => ({
    title: e.title,
    // Strip .md for user-facing URLs
    url: e.url.replace(/\.md$/, ''),
  }));

  // Fetch content for top 2
  const contentEntries = entries.slice(0, 2);
  const contents = await Promise.all(
    contentEntries.map(e => fetchDocContent(e.url)),
  );

  let context = '## Retrieved Documentation\nCite these sources when you use information from them.\n';

  for (let i = 0; i < contentEntries.length; i++) {
    const entry = contentEntries[i];
    const content = contents[i];
    const displayUrl = entry.url.replace(/\.md$/, '');
    context += `\n### [${entry.title}](${displayUrl})\n`;
    if (content) {
      context += `${content}\n`;
    } else {
      context += `${entry.description || 'No content available.'}\n`;
    }
  }

  // Add remaining entries as references without content
  for (let i = 2; i < entries.length; i++) {
    const entry = entries[i];
    const displayUrl = entry.url.replace(/\.md$/, '');
    context += `\n### [${entry.title}](${displayUrl})\n${entry.description || ''}\n`;
  }

  return {context, sources};
}
