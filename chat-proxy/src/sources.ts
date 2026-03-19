// ---------------------------------------------------------------------------
// Shared utilities for text chunking, content fetching, and section inference
// ---------------------------------------------------------------------------

/**
 * Infer the correct section from a URL, overriding DB section when clearly wrong.
 * External URLs always override; path-based inference kicks in when section is
 * missing or set to the default 'cloud-guides'.
 */
export function inferSection(section?: string, url?: string): string {
  if (url) {
    // External URLs always override — DB section is unreliable for these
    if (/milvus\.io/i.test(url)) return 'external-web';
    if (/github\.com/i.test(url)) return 'external-github';
    // Path-based inference when DB section is default/missing
    if (!section || section === 'cloud-guides') {
      if (/\/byoc[-/]/.test(url) || /docs-byoc/.test(url)) return 'byoc-guides';
      if (/\/reference\//.test(url)) return 'api-reference';
    }
  }
  return section || 'cloud-guides';
}

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;
const CHARS_PER_TOKEN = 4;
const MAX_GITHUB_FILES = 50;

// ---------------------------------------------------------------------------
// Text chunking (copied from plugins/vectorize-docs/utils.js)
// ---------------------------------------------------------------------------

export function chunkText(text: string): string[] {
  const chunkChars = CHUNK_SIZE * CHARS_PER_TOKEN;
  const overlapChars = CHUNK_OVERLAP * CHARS_PER_TOKEN;

  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk.length + para.length + 2) > chunkChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      const overlap = currentChunk.slice(-overlapChars);
      currentChunk = overlap + '\n\n' + para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Fallback: character-based splitting for single large paragraphs
  if (chunks.length === 0 && text.trim()) {
    for (let i = 0; i < text.length; i += chunkChars - overlapChars) {
      chunks.push(text.slice(i, i + chunkChars).trim());
    }
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Title extraction
// ---------------------------------------------------------------------------

function extractTitle(text: string): string {
  const match = text.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : '';
}

// ---------------------------------------------------------------------------
// Content fetching — web
// ---------------------------------------------------------------------------

export async function fetchWebContent(url: string): Promise<{title: string; content: string}> {
  const res = await fetch(url, {
    headers: {'User-Agent': 'ZdocBot/1.0'},
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  let html = await res.text();

  // Limit to 100KB
  html = html.slice(0, 100_000);

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const title = h1Match?.[1]?.trim() || titleMatch?.[1]?.trim() || url;

  // Strip scripts, styles, nav, footer
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  html = html.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  html = html.replace(/<header[\s\S]*?<\/header>/gi, '');

  // Prefer <main> or <article> content
  const mainMatch = html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
  const articleMatch = html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
  const bodyContent = mainMatch?.[1] || articleMatch?.[1] || html;

  // Strip remaining tags
  let content = bodyContent.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  content = content
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Collapse whitespace
  content = content.replace(/\s+/g, ' ').trim();

  return {title, content};
}

// ---------------------------------------------------------------------------
// Content fetching — GitHub
// ---------------------------------------------------------------------------

const GITHUB_FILE_PATTERNS = [
  /^README\.md$/i,
  /^docs\/.+\.md$/i,
  /^examples?\/.+\.(md|py|js|ts|go|java)$/i,
  /^samples?\/.+\.(md|py|js|ts|go|java)$/i,
];

export function parseGitHubUrl(url: string): {owner: string; repo: string} {
  // Formats: "github:owner/repo" or "https://github.com/owner/repo"
  const colonMatch = url.match(/^github:([^/]+)\/([^/]+)/);
  if (colonMatch) return {owner: colonMatch[1], repo: colonMatch[2]};

  const urlMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (urlMatch) return {owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, '')};

  throw new Error(`Invalid GitHub URL: ${url}`);
}

export async function fetchGitHubContent(
  owner: string,
  repo: string,
): Promise<Array<{path: string; title: string; content: string}>> {
  const token = process.env.GITHUB_TOKEN || '';
  const headers: Record<string, string> = {
    'User-Agent': 'ZdocBot/1.0',
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Get repo tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    {headers, signal: AbortSignal.timeout(15000)},
  );

  if (!treeRes.ok) {
    throw new Error(`GitHub API error: ${treeRes.status} ${await treeRes.text()}`);
  }

  const treeData = (await treeRes.json()) as {tree: Array<{path: string; type: string}>};

  // Filter to matching files
  const matchingPaths = treeData.tree
    .filter(entry => entry.type === 'blob' && GITHUB_FILE_PATTERNS.some(p => p.test(entry.path)))
    .map(entry => entry.path)
    .slice(0, MAX_GITHUB_FILES);

  // Fetch each file's content
  const results: Array<{path: string; title: string; content: string}> = [];

  for (const path of matchingPaths) {
    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`,
        {headers: {'User-Agent': 'ZdocBot/1.0'}, signal: AbortSignal.timeout(10000)},
      );

      if (!rawRes.ok) continue;

      const content = await rawRes.text();
      const title = extractTitle(content) || path;
      results.push({path, title, content});
    } catch {
      // Skip files that fail to fetch
    }
  }

  return results;
}
