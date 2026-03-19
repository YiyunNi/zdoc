import {describe, it, expect, vi, beforeEach} from 'vitest';
import {chunkText, fetchWebContent, parseGitHubUrl} from './sources.js';

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
// indexSource (integration-style with mocked fetch)
// ---------------------------------------------------------------------------

describe('indexSource', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('generates chunk IDs with ext: prefix', async () => {
    const insertedData: any[] = [];

    // Mock fetch to handle both Zilliz API calls and web content fetching
    const mockFetch = vi.fn().mockImplementation((url: string, opts?: any) => {
      const urlStr = String(url);

      // Embedding API
      if (urlStr.includes('/embeddings')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({data: [{embedding: new Array(1024).fill(0.1)}]}),
        });
      }

      // Zilliz API calls
      if (urlStr.includes('/v2/vectordb')) {
        const body = JSON.parse(opts?.body || '{}');

        // Query for getSource
        if (urlStr.includes('/entities/query')) {
          if (body.collectionName === 'external_sources') {
            return Promise.resolve({
              json: () => Promise.resolve({
                code: 0,
                data: [{
                  id: 'test-source-id',
                  url: 'https://example.com/docs',
                  source_type: 'external-web',
                  label: 'Test Docs',
                  status: 'pending',
                  chunk_count: 0,
                  last_indexed: '',
                  error_message: '',
                  created_at: '2024-01-01T00:00:00.000Z',
                }],
              }),
            });
          }
        }

        // Upsert (status update)
        if (urlStr.includes('/entities/upsert')) {
          return Promise.resolve({json: () => Promise.resolve({code: 0, data: {}})});
        }

        // Delete (old chunks)
        if (urlStr.includes('/entities/delete')) {
          return Promise.resolve({json: () => Promise.resolve({code: 0, data: {}})});
        }

        // Insert (new chunks)
        if (urlStr.includes('/entities/insert')) {
          if (body.collectionName === 'doc_chunks') {
            insertedData.push(...body.data);
          }
          return Promise.resolve({json: () => Promise.resolve({code: 0, data: {}})});
        }

        return Promise.resolve({json: () => Promise.resolve({code: 0, data: {}})});
      }

      // Web content fetch
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('<html><head><title>Test</title></head><body><main><p>Some test content for indexing.</p></main></body></html>'),
      });
    });

    vi.stubGlobal('fetch', mockFetch);

    // Need to set env vars before importing
    process.env.ZILLIZ_ENDPOINT = 'https://test.zilliz.cloud';
    process.env.ZILLIZ_TOKEN = 'test-token';

    const {indexSource} = await import('./sources.js');
    const result = await indexSource('test-source-id');

    expect(result.chunkCount).toBeGreaterThan(0);
    // Verify chunk IDs have ext: prefix
    for (const chunk of insertedData) {
      expect(chunk.id).toMatch(/^ext:test-source-id:\d+#\d+$/);
      expect(chunk.section).toBe('external-web');
    }
  });
});
