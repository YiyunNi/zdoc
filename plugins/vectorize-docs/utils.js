// @ts-check
// Extracted helpers for unit testing

const CHUNK_SIZE = 500; // tokens (~2000 chars)
const CHUNK_OVERLAP = 50; // tokens (~200 chars)
const CHARS_PER_TOKEN = 4; // rough approximation
const MAX_CHUNK_CHARS = 8192; // Zilliz varchar field limit

/**
 * Extract the first H1 title from markdown content.
 * @param {string} content
 * @returns {string | null}
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Split text into overlapping chunks at paragraph boundaries.
 * Falls back to character-based splitting for single large paragraphs.
 * Ensures chunks never exceed Zilliz's 8192 byte limit.
 * @param {string} text
 * @returns {string[]}
 */
function chunkText(text) {
  const chunkChars = Math.min(CHUNK_SIZE * CHARS_PER_TOKEN, MAX_CHUNK_CHARS - (CHUNK_OVERLAP * CHARS_PER_TOKEN));
  const overlapChars = CHUNK_OVERLAP * CHARS_PER_TOKEN;

  // Split by paragraphs first for natural boundaries
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    const newLength = currentChunk.length + (currentChunk ? 2 : 0) + para.length;
    if (newLength > chunkChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      // Keep overlap from end of current chunk
      const overlap = currentChunk.slice(-overlapChars);
      currentChunk = overlap + '\n\n' + para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // If no chunks were created (single large paragraph), do character-based splitting
  if (chunks.length === 0 && text.trim()) {
    for (let i = 0; i < text.length; i += chunkChars - overlapChars) {
      chunks.push(text.slice(i, i + chunkChars).trim());
    }
  }

  // Final safety: truncate any chunks that still exceed the byte limit
  return chunks.map(chunk => truncateToBytes(chunk, MAX_CHUNK_CHARS));
}

/**
 * Truncate string to ensure it's within byte limit.
 * @param {string} str
 * @param {number} maxBytes
 * @returns {string}
 */
function truncateToBytes(str, maxBytes) {
  const buffer = Buffer.from(str, 'utf8');
  if (buffer.length <= maxBytes) return str;
  return buffer.slice(0, maxBytes).toString('utf8');
}

module.exports = {extractTitle, chunkText, CHUNK_SIZE, CHUNK_OVERLAP, CHARS_PER_TOKEN, truncateToBytes};
