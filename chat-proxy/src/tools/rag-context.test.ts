import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('ai', () => ({
  tool: vi.fn((definition: any) => definition),
}));

vi.mock('../query-rewrite.js', () => ({
  rewriteQuery: vi.fn(async (query: string) => `rewritten ${query}`),
}));

vi.mock('../entity-extract.js', () => ({
  extractEntities: vi.fn(async () => ['entity']),
}));

const searchDocsMock = vi.hoisted(() => vi.fn());
const searchDocsFTS5Mock = vi.hoisted(() => vi.fn());
const listPagesMock = vi.hoisted(() => vi.fn());

vi.mock('../rag.js', () => ({
  searchDocs: searchDocsMock,
  searchDocsFTS5: searchDocsFTS5Mock,
  listPages: listPagesMock,
  computeRetrievalConfidence: vi.fn(() => ({level: 'medium', avgScore: 0.6})),
}));

describe('RAG tool request context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchDocsMock.mockResolvedValue([]);
    searchDocsFTS5Mock.mockResolvedValue([]);
    listPagesMock.mockResolvedValue([]);
  });

  it('passes request-scoped section filter and embedding to searchDocs', async () => {
    const {createSearchDocsTool} = await import('./searchDocs.js');
    const queryEmbedding = [0.1, 0.2, 0.3];
    const tool = createSearchDocsTool({
      sectionFilter: 'section == "cloud-guides"',
      queryEmbedding,
    });

    await tool.execute({query: 'collection', topK: 5});

    expect(searchDocsMock).toHaveBeenCalledWith(
      'rewritten collection',
      5,
      'section == "cloud-guides"',
      ['entity'],
      ['entity'],
      queryEmbedding,
    );
  });

  it('passes request-scoped section filter to getCodeExample', async () => {
    const {createGetCodeExampleTool} = await import('./getCodeExample.js');
    const tool = createGetCodeExampleTool({sectionFilter: 'section == "byoc-guides"'});

    await tool.execute({topic: 'create collection', language: 'python'});

    expect(searchDocsFTS5Mock).toHaveBeenCalledWith(
      'create collection python code example',
      4,
      'section == "byoc-guides"',
    );
  });

  it('passes request-scoped section filter to listPages when no explicit section is provided', async () => {
    const {createListPagesTool} = await import('./listPages.js');
    const tool = createListPagesTool({sectionFilter: 'section != "byoc-guides"'});

    await tool.execute({titleContains: 'index'});

    expect(listPagesMock).toHaveBeenCalledWith('section != "byoc-guides"', 'index');
  });

  it('lets explicit listPages section override request context', async () => {
    const {createListPagesTool} = await import('./listPages.js');
    const tool = createListPagesTool({sectionFilter: 'section != "byoc-guides"'});

    await tool.execute({titleContains: 'index', section: 'byoc-guides'});

    expect(listPagesMock).toHaveBeenCalledWith('section == "byoc-guides"', 'index');
  });
});
