import {describe, it, expect, vi, beforeEach} from 'vitest';

describe('getPageContent tool SSRF prevention', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DOCS_SITE_URL = 'https://docs.zilliz.com';
  });

  it('should reject non-allowlisted URLs', async () => {
    vi.doMock('../rag.js', () => ({
      fetchDocContent: vi.fn(),
    }));

    const {getPageContentTool} = await import('./getPageContent.js');
    const result = await getPageContentTool.execute({
      url: 'http://169.254.169.254/latest/meta-data/',
      maxChars: 1000,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('not allowed');
  });

  it('should allow docs site URLs', async () => {
    const mockFetch = vi.fn().mockResolvedValue('mock content');
    vi.doMock('../rag.js', () => ({
      fetchDocContent: mockFetch,
    }));

    const {getPageContentTool} = await import('./getPageContent.js');
    await getPageContentTool.execute({
      url: '/docs/tutorials/quickstart',
      maxChars: 1000,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://docs.zilliz.com/docs/tutorials/quickstart',
      1000,
    );
  });
});
