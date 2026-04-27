export function resolveSection(section?: string, url?: string): string {
  if (section && section !== 'cloud-guides') return section;
  if (url) {
    if (/milvus\.io/i.test(url)) return 'external-web';
    if (/github\.com/i.test(url)) return 'external-github';
    if (/\/byoc[-/]/.test(url) || /docs-byoc/.test(url)) return 'byoc-guides';
    if (/\/reference\//.test(url)) return 'api-reference';
  }
  return section || 'cloud-guides';
}
