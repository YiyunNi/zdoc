/**
 * MDX Patching Module
 * Contains the MDX patching logic extracted from larkDocWriter.js __mdx_patches method
 */

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

// Function to apply MDX patches as per the larkDocWriter.js implementation
async function applyMdxPatches(content) {
    try {
        // Dynamically import the MDX compile function due to ES module restrictions
        const { compile } = await import('@mdx-js/mdx');

        // Pre-process: escape currency dollar signs before the compile loop
        let patchedContent = escapeCurrencyDollars(content);
        let maxIterations = 50; // Prevent infinite loops
        let iteration = 0;

        while (iteration < maxIterations) {
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
                        const wrongClose = error.message.match(/Unexpected closing tag `<\/([^>]+)>`/)?.[1];
                        const expectedOpen = error.message.match(/closing tag for `<([A-Za-z][^>/ ]*)(?:\s[^>]*)?>?`/)?.[1];
                        const posMatch = error.message.match(/(\d+):(\d+)-(\d+):(\d+)/);

                        if (wrongClose && expectedOpen && wrongClose !== expectedOpen && posMatch) {
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
                            // Fallback: escape the opening tag at its source position
                            const openTag = error.message.match(/<(?!\/)([A-Za-z][A-Za-z0-9:_-]*)\b[^>]*>/g)?.[0];
                            const fallbackPos = error.message.match(/(\d+):(\d+)-(\d+):(\d+)/);
                            if (openTag && fallbackPos) {
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
    applyMdxPatches
};
