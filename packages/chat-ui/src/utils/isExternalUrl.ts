export function isExternalUrl(url: string): boolean {
  if (!url || url.startsWith('/')) return false;
  try {
    const host = new URL(url).hostname;
    return !host.endsWith('zilliz.com');
  } catch {
    return false;
  }
}
