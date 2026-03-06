/**
 * MDX Patching Module
 * Contains the MDX patching logic extracted from larkDocWriter.js __mdx_patches method
 */

// Known JSX block components that must never be backslash-escaped.
const KNOWN_JSX_TAGS = new Set([
    'Admonition', 'Tabs', 'TabItem', 'DocCard', 'DocCardList',
    'Details', 'CodeBlock', 'ThemedImage', 'TOCInline', 'Highlight',
    'Banner', 'Bars', 'Blocks', 'Cards', 'Grid', 'Hero', 'Procedures',
    'RestSpecs', 'Stories', 'Supademo',
]);

/**
 * Pre-processing: remove hallucinated prose inserted between </TabItem> and the
 * next <TabItem> or </Tabs>. LLMs sometimes fabricate content in those gaps,
 * which MDX compiles fine but Docusaurus's Tabs component rejects at SSG render
 * time with "Bad <Tabs> child <p>".
 */
function removeTabsHallucinations(content) {
    const lines = content.split('\n');
    const result = [];
    let tabsDepth = 0;
    let afterTabItemClose = false;
    let inCodeBlock = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
            inCodeBlock = !inCodeBlock;
        }

        if (!inCodeBlock) {
            if (/^<Tabs[\s>]/.test(trimmed)) tabsDepth++;
            if (/^<\/Tabs>/.test(trimmed)) tabsDepth = Math.max(0, tabsDepth - 1);

            if (tabsDepth > 0) {
                if (trimmed === '</TabItem>') {
                    afterTabItemClose = true;
                    result.push(line);
                    continue;
                }
                if (afterTabItemClose) {
                    if (/^<TabItem[\s>]/.test(trimmed) || /^<\/Tabs>/.test(trimmed)) {
                        afterTabItemClose = false;
                    } else if (trimmed !== '') {
                        // Non-empty, non-TabItem content — hallucinated prose, discard it
                        continue;
                    }
                    // Empty lines between TabItems are harmless, keep them
                }
            } else {
                afterTabItemClose = false;
            }
        }

        result.push(line);
    }

    return result.join('\n');
}

/**
 * Pre-processing: unescape known JSX block components that were incorrectly
 * backslash-escaped (e.g. \<Tabs> → <Tabs>, \<TabItem> → <TabItem>). This
 * artifact occurs when the end-tag-mismatch fallback inserts a \ before the
 * opening < of a known component at column 1. The result (\<Tabs>) is valid
 * MDX syntax so the compile check passes, but React then tries to render the
 * remaining values={[...]} expression as children and throws.
 */
function unescapeKnownJsxTags(content) {
    const names = [...KNOWN_JSX_TAGS].join('|');
    const pattern = new RegExp(`\\\\<(/?(?:${names})\\b)`, 'g');
    return content.replace(pattern, '<$1');
}

/**
 * Pre-processing: replace currency $<digit> with &#36;<digit> outside fenced code
 * blocks and inline code spans, to prevent remark-math/KaTeX from treating them as
 * math delimiters (which causes unicodeTextInMathMode warnings and broken rendering).
 */
function escapeCurrencyDollars(content) {
    const lines = content.split('\n');
    let inCodeBlock = false;
    const result = [];

    for (let line of lines) {
        const stripped = line.trim();
        if (stripped.startsWith('```') || stripped.startsWith('~~~')) {
            inCodeBlock = !inCodeBlock;
        }

        if (!inCodeBlock) {
            // Split by inline code spans; odd-indexed segments are inside backticks
            const parts = line.split(/(`+[^`]+`+)/);
            line = parts.map((part, i) => {
                if (i % 2 === 0) {
                    // Outside inline code — replace $<digit> with HTML entity
                    return part.replace(/\$(?=\d)/g, '&#36;');
                }
                return part; // Inside inline code — leave unchanged
            }).join('');
        }

        result.push(line);
    }

    return result.join('\n');
}

/**
 * Pre-processing: escape any lowercase tag whose name is not a known HTML element or
 * content-filter tag, outside fenced code blocks and inline code spans.
 * Such tags are URL/API placeholder patterns (e.g. <bucket_name>, <region-code>,
 * <container>, <blob>) that MDX would otherwise parse as JSX elements.
 * Both opening and closing forms are escaped.
 * PascalCase JSX components (Tabs, TabItem, Admonition…) are never matched because
 * the regex anchors on a leading lowercase letter.
 */
function escapeNonHtmlTags(content) {
    const KNOWN_TAGS = new Set([
        // Standard HTML elements
        'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
        'b', 'base', 'bdi', 'bdo', 'blockquote', 'br', 'button',
        'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
        'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
        'em', 'embed',
        'fieldset', 'figcaption', 'figure', 'footer', 'form',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html',
        'i', 'iframe', 'img', 'input', 'ins',
        'kbd',
        'label', 'legend', 'li', 'link',
        'main', 'map', 'mark', 'menu', 'meta', 'meter',
        'nav', 'noscript',
        'object', 'ol', 'optgroup', 'option', 'output',
        'p', 'picture', 'pre', 'progress',
        'q',
        'rp', 'rt', 'ruby',
        's', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source', 'span',
        'strong', 'style', 'sub', 'summary', 'sup',
        'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead',
        'time', 'title', 'tr', 'track',
        'u', 'ul',
        'var', 'video',
        'wbr',
        // Content-filter tags used by larkDocWriter (processed before MDX patching)
        'include', 'exclude',
    ]);

    // Structural pre-scan: build set of safe uppercase/PascalCase tag names.
    // A tag is safe if it appears with a close tag, self-closing form, or attributes
    // anywhere in the document. Combined with a KNOWN_JSX fallback whitelist as a
    // safety net for legitimate components that may be orphaned in edge cases.
    const safeUppercaseTags = new Set([
        // Docusaurus built-in theme components
        'Admonition', 'Tabs', 'TabItem', 'DocCard', 'DocCardList',
        'Details', 'CodeBlock', 'ThemedImage', 'TOCInline', 'Highlight',
        // Custom site components
        'Banner', 'Bars', 'Blocks', 'Cards', 'Grid', 'Hero', 'Procedures', 'RestSpecs', 'Stories', 'Supademo',
    ]);
    const upperScanRegex = /[<]([A-Z][A-Za-z0-9]*)/g;
    let upperMatch;
    while ((upperMatch = upperScanRegex.exec(content)) !== null) {
        const tn = upperMatch[1];
        if (safeUppercaseTags.has(tn)) continue;
        if (new RegExp(`<\\/${tn}>`).test(content) ||
            new RegExp(`<${tn}\\s*\\/>`).test(content) ||
            new RegExp(`<${tn}\\s+`).test(content)) {
            safeUppercaseTags.add(tn);
        }
    }

    const lines = content.split('\n');
    let inCodeBlock = false;
    const result = [];

    for (let line of lines) {
        const stripped = line.trim();
        if (stripped.startsWith('```') || stripped.startsWith('~~~')) {
            inCodeBlock = !inCodeBlock;
        }

        if (!inCodeBlock) {
            // Split by inline code spans; odd-indexed segments are inside backticks
            const parts = line.split(/(`+[^`]+`+)/);
            line = parts.map((part, i) => {
                if (i % 2 === 0) {
                    // Escape non-HTML lowercase placeholder tags (e.g. <bucket_name>, <region-code>).
                    // Tags with attributes won't match because the regex only allows \s*\/?>
                    part = part.replace(/(?<!\\)<\/?([a-z][a-z0-9]*(?:[_-][a-z0-9]+)*)\s*\/?>/g, (match, tagName) => {
                        return KNOWN_TAGS.has(tagName) ? match : '\\' + match;
                    });
                    // Escape uppercase/PascalCase tags not identified as real JSX components.
                    // Uses HTML entities so the angle brackets render correctly in the output.
                    part = part.replace(/(?<!\\)<\/?([A-Z][A-Za-z0-9]*)\s*\/?>/g, (match, tagName) => {
                        if (safeUppercaseTags.has(tagName)) return match;
                        return match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    });
                    return part;
                }
                return part; // Inside inline code — leave unchanged
            }).join('');
        }

        result.push(line);
    }

    return result.join('\n');
}

/**
 * Structural validator for translated MDX files.
 * Catches React render-time errors that @mdx-js/mdx compile() misses:
 *   1. Prose inserted between </TabItem> and <TabItem>/<\/Tabs> (LLM hallucination)
 *   2. Unbalanced <Tabs>/<\/Tabs> or <TabItem>/<\/TabItem> tags (LLM dropped closing tags)
 *   3. Backslash-escaped known JSX tags (e.g. \<Tabs> → compile succeeds but SSG crashes)
 *
 * @param {string} content
 * @returns {string[]} array of error descriptions; empty array = structurally valid
 */
function validateMdxStructure(content) {
    const errors = [];

    // Check 1: prose between TabItems
    if (removeTabsHallucinations(content) !== content) {
        errors.push('prose found between </TabItem> and next <TabItem>/<\\/Tabs> (LLM hallucination)');
    }

    // Check 2: escaped known JSX tags
    if (unescapeKnownJsxTags(content) !== content) {
        errors.push('backslash-escaped known JSX tags found (e.g. \\<Tabs>)');
    }

    // Check 3: tag balance for <Tabs> and <TabItem> (outside code blocks)
    const lines = content.split('\n');
    let inCodeBlock = false;
    const delta = { Tabs: 0, TabItem: 0 };
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;
        for (const tag of ['Tabs', 'TabItem']) {
            const opens = (trimmed.match(new RegExp(`<${tag}[\\s>/]`, 'g')) || []).length;
            const closes = (trimmed.match(new RegExp(`<\\/${tag}>`, 'g')) || []).length;
            delta[tag] += opens - closes;
        }
    }
    for (const [tag, d] of Object.entries(delta)) {
        if (d > 0) errors.push(`${d} unclosed <${tag}> tag(s)`);
        if (d < 0) errors.push(`${Math.abs(d)} extra </${tag}> closing tag(s)`);
    }

    return errors;
}

// Function to apply MDX patches as per the larkDocWriter.js implementation
async function applyMdxPatches(content) {
    try {
        // Dynamically import the MDX compile function due to ES module restrictions
        const { compile } = await import('@mdx-js/mdx');

        // Pre-process: fix hallucination patterns, then escape problem characters
        let patchedContent = removeTabsHallucinations(content);
        patchedContent = unescapeKnownJsxTags(patchedContent);
        patchedContent = escapeCurrencyDollars(patchedContent);
        patchedContent = escapeNonHtmlTags(patchedContent);
        let maxIterations = 50; // Prevent infinite loops
        let iteration = 0;
        const seenHashes = new Set();

        while (iteration < maxIterations) {
            // Cycle detection: stop if we've visited this exact content state before
            let h = 5381;
            for (let i = 0; i < patchedContent.length; i++) {
                h = Math.imul(h, 33) ^ patchedContent.charCodeAt(i);
            }
            if (seenHashes.has(h)) {
                console.warn('Cycle detected in MDX patch loop, stopping to prevent infinite iteration');
                break;
            }
            seenHashes.add(h);

            try {
                // Try to compile the current content
                await compile(patchedContent, { development: false });
                console.log(`MDX compilation succeeded after ${iteration} fixes`);
                return patchedContent; // If compilation succeeds, return the fixed content
            } catch (error) {
                console.log(`MDX compilation error detected (iteration ${iteration + 1}): ${error.message}`);

                // Identify problematic characters based on the error
                let madeChanges = false;
                let line, column, offset;
                switch (error.ruleId) {
                    case 'acorn':
                        line = error.place.line;
                        column = error.place.column;
                        offset = error.place.offset;

                        if (offset !== undefined && offset > 0 && offset < patchedContent.length) {
                            for (let i = offset - 1; i >= 0; i--) {
                                if (patchedContent[i] === '{') {
                                    patchedContent = patchedContent.slice(0, i) + '\\' + patchedContent.slice(i);
                                    madeChanges = true;
                                    break;
                                }
                            }
                        }
                        break;

                    case 'end-tag-mismatch': {
                        // Error format: "Unexpected closing tag `</Y>`, expected corresponding closing tag for `<X>` (line:col-line:col)"
                        // The position refers to the OPENING tag <X>.
                        // Strategy: replace the wrong closing tag </Y> with the correct </X>.
                        // Exception: if <X> is a non-standard tag (contains _ or -) it is a URL/API
                        // placeholder, not a real element. Replacing the closing tag causes an
                        // oscillating loop; instead fall through to the fallback (escape opening tag).
                        const wrongClose = error.message.match(/Unexpected closing tag `<\/([^>]+)>`/)?.[1];
                        const expectedOpen = error.message.match(/closing tag for `<([A-Za-z][^>/ ]*)(?:\s[^>]*)?>?`/)?.[1];
                        const posMatch = error.message.match(/(\d+):(\d+)-(\d+):(\d+)/);
                        const isPlaceholder = expectedOpen && /[_-]/.test(expectedOpen);

                        if (!isPlaceholder && wrongClose && expectedOpen && wrongClose !== expectedOpen && posMatch) {
                            // Find </wrongClose> starting from the opening tag's line and replace with </expectedOpen>
                            const openLine = parseInt(posMatch[1]) - 1; // 0-indexed
                            const wrongCloseTag = `</${wrongClose}>`;
                            const correctCloseTag = `</${expectedOpen}>`;
                            const lines = patchedContent.split('\n');

                            for (let i = openLine; i < lines.length; i++) {
                                const idx = lines[i].indexOf(wrongCloseTag);
                                if (idx !== -1) {
                                    lines[i] = lines[i].slice(0, idx) + correctCloseTag + lines[i].slice(idx + wrongCloseTag.length);
                                    madeChanges = true;
                                    break;
                                }
                            }

                            if (madeChanges) {
                                patchedContent = lines.join('\n');
                            }
                        }

                        if (!madeChanges) {
                            // Fallback: escape the opening tag at its source position.
                            // Never escape known JSX components — doing so produces \<Tabs>
                            // which MDX treats as literal text, making values={[...]} render
                            // as React children and crash SSG.
                            const openTag = error.message.match(/<(?!\/)([A-Za-z][A-Za-z0-9:_-]*)\b[^>]*>/g)?.[0];
                            const openTagName = openTag?.match(/^<([A-Za-z][A-Za-z0-9:_-]*)/)?.[1];
                            const fallbackPos = error.message.match(/(\d+):(\d+)-(\d+):(\d+)/);
                            if (openTag && openTagName && !KNOWN_JSX_TAGS.has(openTagName) && fallbackPos) {
                                const startLine = parseInt(fallbackPos[1]);
                                const startCol = parseInt(fallbackPos[2]);
                                patchedContent = patchedContent.split('\n').map((l, idx) => {
                                    if (idx === startLine - 1) {
                                        madeChanges = true;
                                        return l.slice(0, startCol - 1) + '\\' + l.slice(startCol - 1);
                                    }
                                    return l;
                                }).join('\n');
                            }
                        }
                        break;
                    }

                    case 'unexpected-closing-slash': {
                        // "Unexpected closing slash `/` in tag, expected an open tag first"
                        // The error offset points to the `/` inside the orphaned closing tag.
                        // Strategy: walk back to find `<`, forward to find `>`, then remove the entire tag.
                        const slashOffset = error.place?.offset;

                        if (slashOffset !== undefined) {
                            let tagStart = slashOffset - 1;
                            while (tagStart > 0 && patchedContent[tagStart] !== '<') tagStart--;
                            let tagEnd = slashOffset;
                            while (tagEnd < patchedContent.length && patchedContent[tagEnd] !== '>') tagEnd++;

                            if (patchedContent[tagStart] === '<' && tagEnd < patchedContent.length) {
                                // Remove the orphaned closing tag (and any immediately trailing newline)
                                const before = patchedContent.slice(0, tagStart);
                                let after = patchedContent.slice(tagEnd + 1);
                                if (after.startsWith('\n')) after = after.slice(1);
                                patchedContent = before + after;
                                madeChanges = true;
                            }
                        }

                        if (!madeChanges) {
                            // Fallback: remove erroneous closing tags via regex
                            const originalContent = patchedContent;
                            patchedContent = patchedContent.replace(/<\/(?:content|[\w\d]+)>\s*$/, '');
                            if (originalContent !== patchedContent) {
                                madeChanges = true;
                            } else {
                                patchedContent = patchedContent.replace(/<[/](\w+)>/g, (match, tagName) => {
                                    const openingTagCount = (patchedContent.match(new RegExp(`<${tagName}(?:\\s|>|/>)`, 'g')) || []).length;
                                    const closingTagCount = (patchedContent.match(new RegExp(`<\\/${tagName}>`, 'g')) || []).length;
                                    if (closingTagCount > openingTagCount) {
                                        return '';
                                    }
                                    return match;
                                });
                                if (originalContent !== patchedContent) {
                                    madeChanges = true;
                                }
                            }
                        }
                        break;
                    }

                    case 'unexpected-character':
                        offset = error.place?.offset;

                        if (error.message.includes('U+003D') && offset !== undefined && offset > 0) {
                            // `=` sign unexpected — typically from `<=` where `<` was parsed as a JSX tag opener.
                            // Walk backward to find `<` (within a short window) and replace it with `&lt;`.
                            for (let i = offset - 1; i >= Math.max(0, offset - 10); i--) {
                                if (patchedContent[i] === '<') {
                                    patchedContent = patchedContent.slice(0, i) + '&lt;' + patchedContent.slice(i + 1);
                                    madeChanges = true;
                                    break;
                                }
                            }
                        } else if (
                            (error.message.includes('U+002C') || error.message.includes('U+002A')) &&
                            offset !== undefined && offset > 0 && offset < patchedContent.length
                        ) {
                            // Existing: comma or asterisk — escape the nearest preceding `<`
                            for (let i = offset - 1; i >= 0; i--) {
                                if (patchedContent[i] === '<') {
                                    patchedContent = patchedContent.slice(0, i) + '\\' + patchedContent.slice(i);
                                    madeChanges = true;
                                    break;
                                }
                            }
                        }
                        break;

                    default:
                        madeChanges = false;
                        break;
                }

                if (!madeChanges) {
                    console.warn('No changes made to content, breaking loop to prevent infinite iteration');
                    break;
                }
            }

            iteration++;
        }

        if (iteration >= maxIterations) {
            console.warn(`Maximum MDX patch iterations (${maxIterations}) reached, returning last attempt`);
        }

        return patchedContent;
    } catch (error) {
        console.error('Failed to apply MDX patches:', error.message);
        return content; // Return original content if patching fails
    }
}

module.exports = {
    applyMdxPatches,
    validateMdxStructure,
};
