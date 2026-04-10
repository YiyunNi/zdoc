import {describe, it, expect, vi, beforeEach} from 'vitest';
import {chunkText, fetchWebContent, parseGitHubUrl, inferSection} from './sources.js';

// ---------------------------------------------------------------------------
// chunkText
// ---------------------------------------------------------------------------

describe('chunkText', () => {
  it('splits text at paragraph boundaries', () => {
    const paragraphs = Array.from({length: 20}, (_, i) => `Paragraph ${i}: ${'word '.repeat(80)}`);
    const text = paragraphs.join('\n\n');
    const chunks = chunkText(text);
    expect(chunks.length).toBeGreaterThan(1);
    // Each chunk should be under the character limit
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(2200); // ~500 tokens * 4 chars + some overlap
    }
  });

  it('handles single large paragraph without splitting at boundaries', () => {
    // A single 5000-char paragraph exceeds chunk size (2000 chars) but has no \n\n
    // It gets stored as one oversized chunk since there's no paragraph boundary to split at
    const text = 'x'.repeat(5000);
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it('returns single chunk for short text', () => {
    const chunks = chunkText('Hello world. This is a short paragraph.');
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe('Hello world. This is a short paragraph.');
  });

  it('returns empty array for empty text', () => {
    expect(chunkText('')).toEqual([]);
    expect(chunkText('   ')).toEqual([]);
  });

  it('preserves overlap between chunks', () => {
    const paragraphs = Array.from({length: 20}, (_, i) => `UniqueMarker${i} ${'content '.repeat(80)}`);
    const text = paragraphs.join('\n\n');
    const chunks = chunkText(text);
    // Adjacent chunks should share some text (overlap)
    if (chunks.length >= 2) {
      const endOfFirst = chunks[0].slice(-100);
      expect(chunks[1]).toContain(endOfFirst.slice(0, 50));
    }
  });
});

// ---------------------------------------------------------------------------
// fetchWebContent
// ---------------------------------------------------------------------------

describe('fetchWebContent', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('strips script/style/nav tags and extracts title', async () => {
    const html = `
      <html>
        <head><title>Test Page</title></head>
        <body>
          <nav>Navigation stuff</nav>
          <script>alert('xss')</script>
          <style>.foo { color: red }</style>
          <main><h1>Main Title</h1><p>Hello world</p></main>
          <footer>Footer stuff</footer>
        </body>
      </html>
    `;

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(html),
    }));

    const result = await fetchWebContent('https://example.com/page');
    expect(result.title).toBe('Main Title');
    expect(result.content).toContain('Hello world');
    expect(result.content).not.toContain('Navigation stuff');
    expect(result.content).not.toContain('alert');
    expect(result.content).not.toContain('Footer stuff');
  });

  it('prefers <main> content over full body', async () => {
    const html = `
      <html><body>
        <div>Sidebar junk</div>
        <main><p>Important content</p></main>
      </body></html>
    `;

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(html),
    }));

    const result = await fetchWebContent('https://example.com');
    expect(result.content).toContain('Important content');
    expect(result.content).not.toContain('Sidebar junk');
  });

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: false, status: 404}));
    await expect(fetchWebContent('https://example.com/missing')).rejects.toThrow('404');
  });

  it('decodes HTML entities', async () => {
    const html = '<html><body><main><p>A &amp; B &lt; C &gt; D</p></main></body></html>';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: true, text: () => Promise.resolve(html)}));

    const result = await fetchWebContent('https://example.com');
    expect(result.content).toContain('A & B < C > D');
  });
});

// ---------------------------------------------------------------------------
// parseGitHubUrl
// ---------------------------------------------------------------------------

describe('parseGitHubUrl', () => {
  it('parses github: shorthand', () => {
    expect(parseGitHubUrl('github:milvus-io/pymilvus')).toEqual({owner: 'milvus-io', repo: 'pymilvus'});
  });

  it('parses full GitHub URL', () => {
    expect(parseGitHubUrl('https://github.com/milvus-io/pymilvus')).toEqual({owner: 'milvus-io', repo: 'pymilvus'});
  });

  it('strips .git suffix', () => {
    expect(parseGitHubUrl('https://github.com/milvus-io/pymilvus.git')).toEqual({owner: 'milvus-io', repo: 'pymilvus'});
  });

  it('throws on invalid URL', () => {
    expect(() => parseGitHubUrl('not-a-url')).toThrow('Invalid GitHub URL');
  });
});

// ---------------------------------------------------------------------------
// inferSection
// ---------------------------------------------------------------------------

describe('inferSection', () => {
  it('returns external-web for milvus.io URL regardless of DB section', () => {
    expect(inferSection('cloud-guides', 'https://milvus.io/docs/quickstart.md')).toBe('external-web');
  });

  it('overrides cloud-guides with external-web for milvus.io URL', () => {
    expect(inferSection('cloud-guides', 'https://milvus.io/docs/integrate_with_openai.md')).toBe('external-web');
  });

  it('returns external-github for github.com URL', () => {
    expect(inferSection(undefined, 'https://github.com/milvus-io/pymilvus')).toBe('external-github');
  });

  it('returns byoc-guides for BYOC URL with cloud-guides section', () => {
    expect(inferSection('cloud-guides', 'http://localhost:3000/docs/byoc-guides/deploy-aws')).toBe('byoc-guides');
  });

  it('returns api-reference for /reference/ URL with no section', () => {
    expect(inferSection(undefined, 'http://localhost:3000/reference/python/collection')).toBe('api-reference');
  });

  it('preserves cloud-guides for normal zilliz.com URL', () => {
    expect(inferSection('cloud-guides', 'http://localhost:3000/docs/quick-start')).toBe('cloud-guides');
  });

  it('preserves explicit non-default section even without URL match', () => {
    expect(inferSection('external-web', 'https://some-other-site.com/page')).toBe('external-web');
  });

  it('defaults to cloud-guides when no section and no URL', () => {
    expect(inferSection(undefined, undefined)).toBe('cloud-guides');
  });
});

