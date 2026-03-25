/**
 * MDX TabItem Parser
 *
 * Extracts per-language code blocks from Cloud Guide MDX files
 * that use <Tabs>/<TabItem> components for multi-language examples.
 */

'use strict';

/**
 * Parse an MDX file into sections keyed by heading.
 * Returns a Map<headingText, sectionContent> where sectionContent
 * is the raw text between this heading and the next same-level heading.
 *
 * Handles edge cases where ## headings appear inside <Tabs> blocks
 * (as content, not as real section boundaries) by tracking Tabs nesting.
 *
 * @param {string} content - Raw MDX file content
 * @returns {Map<string, string>} heading → section body
 */
function parseSections(content) {
  const lines = content.split('\n');
  const sections = new Map();
  let currentHeading = null;
  let currentLines = [];
  let tabsDepth = 0;

  for (const line of lines) {
    // Track <Tabs> nesting depth
    if (/<Tabs[\s>]/.test(line)) tabsDepth++;
    if (/<\/Tabs>/.test(line)) tabsDepth = Math.max(0, tabsDepth - 1);

    // Only treat ## headings as section boundaries when outside <Tabs>
    const headingMatch = tabsDepth === 0 && line.match(/^## (.+?)(?:\\\{.*?\})?$/);
    if (headingMatch) {
      // Save previous section
      if (currentHeading !== null) {
        sections.set(currentHeading, currentLines.join('\n'));
      }
      currentHeading = headingMatch[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Save last section
  if (currentHeading !== null) {
    sections.set(currentHeading, currentLines.join('\n'));
  }

  return sections;
}

/**
 * Extract all <Tabs> blocks from a section's content.
 * Returns an array of the raw content inside each <Tabs>...</Tabs>.
 *
 * @param {string} sectionContent - Content of a single ## section
 * @returns {string[]} Array of content inside each Tabs block
 */
function extractTabsBlocks(sectionContent) {
  const blocks = [];
  // Match <Tabs ...> ... </Tabs> — non-greedy, handles attributes
  const tabsRe = /<Tabs[^>]*>([\s\S]*?)<\/Tabs>/g;
  let match;
  while ((match = tabsRe.exec(sectionContent)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

/**
 * Extract the code block for a specific language from a Tabs block.
 *
 * @param {string} tabsContent - Content inside a <Tabs> block
 * @param {string} lang - Language value (e.g., 'python', 'java', 'go', 'javascript', 'bash')
 * @returns {string|null} The fenced code block content (with fences), or null if not found/stub
 */
function extractTabItemCode(tabsContent, lang) {
  // Match <TabItem value='lang'> or <TabItem value="lang">
  const escapedLang = lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tabItemRe = new RegExp(
    `<TabItem\\s+value=['"']${escapedLang}['"']>([\\s\\S]*?)<\\/TabItem>`,
  );
  const match = tabsContent.match(tabItemRe);
  if (!match) return null;

  const innerContent = match[1].trim();

  // Extract the fenced code block
  const codeBlockRe = /```(\w+)\n([\s\S]*?)```/;
  const codeMatch = innerContent.match(codeBlockRe);
  if (!codeMatch) return null;

  const codeLang = codeMatch[1];
  const codeBody = codeMatch[2].trim();

  // Detect stubs: content is just a single-line comment or empty
  if (isStub(codeBody, lang)) return null;

  return `\`\`\`${codeLang}\n${codeBody}\n\`\`\``;
}

/**
 * Check if code content is a stub (placeholder comment only).
 *
 * @param {string} code - Code body (without fences)
 * @param {string} lang - Language identifier
 * @returns {boolean}
 */
function isStub(code, lang) {
  if (!code || code.trim().length === 0) return true;

  const trimmed = code.trim();
  // Single-line comment stubs like "// java", "// go", "// node.js", "# python"
  if (/^(\/\/|#)\s*\w[\w.]*\s*$/.test(trimmed)) return true;

  // Very short content that's just a comment
  const lines = trimmed.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 1 && /^(\/\/|#)\s/.test(lines[0])) return true;

  return false;
}

/**
 * Strip MDX-specific syntax from content, keeping plain markdown.
 * Removes import statements, <Admonition> blocks, and {#anchor} suffixes.
 *
 * @param {string} content - Raw section content
 * @returns {string} Cleaned markdown
 */
function stripMdxSyntax(content) {
  let result = content;
  // Remove import lines
  result = result.replace(/^import\s+.*$/gm, '');
  // Remove <Admonition ...>...</Admonition> blocks
  result = result.replace(/<Admonition[^>]*>[\s\S]*?<\/Admonition>/g, '');
  // Remove {#anchor} suffixes from headings
  result = result.replace(/\\?\{#[\w-]+\}/g, '');
  return result;
}

/**
 * Extract a section's full content for a specific language.
 * Replaces <Tabs>...</Tabs> blocks with the target language's code
 * while preserving all surrounding text, sub-headings, and descriptions.
 *
 * @param {string} fileContent - Full MDX file content
 * @param {string} heading - The ## heading text to find
 * @param {string} lang - Language to extract (e.g., 'python')
 * @param {number} [blockIndex=-1] - Which Tabs block under the heading (0-indexed).
 *   -1 (default) means process ALL Tabs blocks (replace each with its lang code).
 * @returns {{ code: string|null, warning: string|null }}
 */
function extractFromSource(fileContent, heading, lang, blockIndex = -1) {
  const sections = parseSections(fileContent);

  // Try exact match first, then case-insensitive
  let sectionContent = sections.get(heading);
  if (!sectionContent) {
    for (const [key, val] of sections) {
      if (key.toLowerCase() === heading.toLowerCase()) {
        sectionContent = val;
        break;
      }
    }
  }

  if (!sectionContent) {
    return {
      code: null,
      warning: `Heading "${heading}" not found in source file`,
    };
  }

  const tabsBlocks = extractTabsBlocks(sectionContent);
  if (tabsBlocks.length === 0) {
    return {
      code: null,
      warning: `No <Tabs> blocks found under heading "${heading}"`,
    };
  }

  // Specific block requested — return just that code block
  if (blockIndex >= 0) {
    if (blockIndex >= tabsBlocks.length) {
      return {
        code: null,
        warning: `Tabs block index ${blockIndex} out of range (${tabsBlocks.length} blocks under "${heading}")`,
      };
    }

    const code = extractTabItemCode(tabsBlocks[blockIndex], lang);
    if (!code) {
      return {
        code: null,
        warning: `No valid ${lang} code found in Tabs block ${blockIndex} under "${heading}" (may be a stub)`,
      };
    }

    return { code, warning: null };
  }

  // Default: replace ALL <Tabs> blocks with the target language's code,
  // preserving surrounding text and sub-headings.
  let processed = sectionContent;
  const tabsFullRe = /<Tabs[^>]*>[\s\S]*?<\/Tabs>/g;
  let matchIdx = 0;
  processed = processed.replace(tabsFullRe, (fullMatch) => {
    // Extract the inner content (between <Tabs> and </Tabs>)
    const innerMatch = fullMatch.match(/<Tabs[^>]*>([\s\S]*?)<\/Tabs>/);
    if (!innerMatch) return '';
    const code = extractTabItemCode(innerMatch[1], lang);
    matchIdx++;
    return code ? '\n' + code + '\n' : '';
  });

  // Strip remaining MDX syntax
  processed = stripMdxSyntax(processed);

  // Clean up excessive blank lines
  processed = processed.replace(/\n{3,}/g, '\n\n').trim();

  if (!processed) {
    return {
      code: null,
      warning: `No content after processing for "${heading}"`,
    };
  }

  return { code: processed, warning: null };
}

module.exports = {
  parseSections,
  extractTabsBlocks,
  extractTabItemCode,
  isStub,
  stripMdxSyntax,
  extractFromSource,
};
