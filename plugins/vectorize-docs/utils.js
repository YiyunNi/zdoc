// @ts-check
// Extracted helpers for unit testing

const CHUNK_SIZE = 500; // tokens (~2000 chars)
const CHUNK_OVERLAP = 50; // tokens (~200 chars)
const CHARS_PER_TOKEN = 4; // rough approximation

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
 * @param {string} text
 * @returns {string[]}
 */
function chunkText(text) {
  const chunkChars = CHUNK_SIZE * CHARS_PER_TOKEN;
  const overlapChars = CHUNK_OVERLAP * CHARS_PER_TOKEN;

  // Split by paragraphs first for natural boundaries
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk.length + para.length + 2) > chunkChars && currentChunk.length > 0) {
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

  return chunks;
}

module.exports = {extractTitle, chunkText, CHUNK_SIZE, CHUNK_OVERLAP, CHARS_PER_TOKEN};
