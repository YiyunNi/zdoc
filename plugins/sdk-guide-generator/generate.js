/**
 * SDK Guide Generator
 *
 * Reads template markdown files from templates/{lang}/, processes
 * <!-- extract (lang) --> markers by pulling code from Cloud Guide
 * source files, and writes processed output to reference/api/{lang}/guides/.
 *
 * Can be run standalone: node plugins/sdk-guide-generator/generate.js
 * Or via Docusaurus plugin loadContent() hook.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { extractFromSource } = require('./parser');

// Map template directory names to reference/api directory names
const SDK_DIR_MAP = {
  python: 'python',
  java: 'java',
  go: 'go',
  node: 'nodejs',
  restful: 'restful',
};

/**
 * Parse frontmatter from a markdown file.
 * Returns { attributes: object, body: string }
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { attributes: {}, body: content };
  }

  const attributes = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const kvMatch = line.match(/^(\w[\w.-]*)\s*:\s*(.*)$/);
    if (kvMatch) {
      let value = kvMatch[2].trim();
      // Strip surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      attributes[kvMatch[1]] = value;
    }
  }

  return { attributes, body: match[2] };
}

/**
 * Process a single template file: find <!-- extract --> markers
 * and replace them with code extracted from the source file.
 *
 * @param {string} templateContent - Raw template markdown
 * @param {string} siteDir - Project root directory
 * @returns {{ output: string, warnings: string[] }}
 */
function processTemplate(templateContent, siteDir) {
  const warnings = [];
  const { attributes, body } = parseFrontmatter(templateContent);

  if (!attributes.source) {
    // Not a generated guide — return as-is
    return { output: templateContent, warnings };
  }

  const sourcePath = path.resolve(siteDir, attributes.source);
  let sourceContent;
  try {
    sourceContent = fs.readFileSync(sourcePath, 'utf-8');
  } catch (err) {
    warnings.push(`Source file not found: ${attributes.source}`);
    return { output: templateContent, warnings };
  }

  // Process <!-- extract (lang) --> and <!-- extract (lang, N) --> markers
  const extractRe = /<!-- extract \((\w+)(?:,\s*(\d+))?\) -->/g;

  // We need to track which heading each marker is under
  const lines = body.split('\n');
  const processedLines = [];
  let currentHeading = null;

  for (const line of lines) {
    // Track current ## heading
    const headingMatch = line.match(/^## (.+?)(?:\\\{.*?\})?$/);
    if (headingMatch) {
      currentHeading = headingMatch[1].trim();
    }

    // Check for extract marker
    const extractMatch = line.match(
      /^<!-- extract \((\w+)(?:,\s*(\d+))?\) -->$/,
    );
    if (extractMatch && currentHeading) {
      const lang = extractMatch[1];
      const blockIndex = extractMatch[2] ? parseInt(extractMatch[2], 10) : -1;

      const result = extractFromSource(
        sourceContent,
        currentHeading,
        lang,
        blockIndex,
      );

      if (result.code) {
        processedLines.push(result.code);
      } else {
        // Leave marker as a comment so it's visible something was skipped
        processedLines.push(
          `<!-- extract failed: ${result.warning || 'unknown error'} -->`,
        );
        warnings.push(
          `[${currentHeading}] ${result.warning || 'extraction failed'}`,
        );
      }
    } else {
      processedLines.push(line);
    }
  }

  // Reconstruct the file with original frontmatter (minus source field)
  const outputFrontmatter = { ...attributes };
  delete outputFrontmatter.source;

  const fmLines = Object.entries(outputFrontmatter).map(([k, v]) => {
    // Quote values that contain special characters
    if (v.includes(':') || v.includes('#') || v.includes('"')) {
      return `${k}: "${v.replace(/"/g, '\\"')}"`;
    }
    return `${k}: ${v}`;
  });

  const output = `---\n${fmLines.join('\n')}\n---\n${processedLines.join('\n')}`;
  return { output, warnings };
}

/**
 * Generate all SDK guides.
 *
 * @param {string} siteDir - Project root directory
 * @param {object} [options] - Generation options
 * @param {boolean} [options.verbose=false] - Log progress
 * @returns {{ generated: number, skipped: number, warnings: string[] }}
 */
function generateAll(siteDir, options = {}) {
  const { verbose = false } = options;
  const templatesDir = path.join(
    siteDir,
    'plugins',
    'sdk-guide-generator',
    'templates',
  );
  const allWarnings = [];
  let generated = 0;
  let skipped = 0;

  if (!fs.existsSync(templatesDir)) {
    if (verbose) console.log('[sdk-guide-generator] No templates directory found, skipping');
    return { generated: 0, skipped: 0, warnings: [] };
  }

  // Iterate over each SDK template directory
  for (const [templateDir, apiDir] of Object.entries(SDK_DIR_MAP)) {
    const sdkTemplatesPath = path.join(templatesDir, templateDir);
    if (!fs.existsSync(sdkTemplatesPath)) {
      if (verbose)
        console.log(`[sdk-guide-generator] No templates for ${templateDir}, skipping`);
      continue;
    }

    const outputDir = path.join(siteDir, 'reference', 'api', apiDir, 'guides');
    fs.mkdirSync(outputDir, { recursive: true });

    const files = fs
      .readdirSync(sdkTemplatesPath)
      .filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    for (const file of files) {
      const templatePath = path.join(sdkTemplatesPath, file);
      const templateContent = fs.readFileSync(templatePath, 'utf-8');

      const { output, warnings } = processTemplate(templateContent, siteDir);

      const outputPath = path.join(outputDir, file);
      fs.writeFileSync(outputPath, output, 'utf-8');

      if (warnings.length > 0) {
        const prefixedWarnings = warnings.map(
          w => `[${templateDir}/${file}] ${w}`,
        );
        allWarnings.push(...prefixedWarnings);
        if (verbose) {
          for (const w of prefixedWarnings) {
            console.warn(`[sdk-guide-generator] WARNING: ${w}`);
          }
        }
      }

      generated++;
      if (verbose) console.log(`[sdk-guide-generator] Generated ${apiDir}/guides/${file}`);
    }
  }

  if (verbose) {
    console.log(
      `[sdk-guide-generator] Done: ${generated} generated, ${skipped} skipped, ${allWarnings.length} warnings`,
    );
  }

  return { generated, skipped, warnings: allWarnings };
}

// CLI support: run standalone
if (require.main === module) {
  const siteDir = path.resolve(__dirname, '../..');
  const result = generateAll(siteDir, { verbose: true });
  if (result.warnings.length > 0) {
    console.log('\nWarnings:');
    for (const w of result.warnings) {
      console.log(`  - ${w}`);
    }
  }
  process.exit(result.warnings.length > 0 ? 0 : 0); // Warnings are non-fatal
}

module.exports = { generateAll, processTemplate, parseFrontmatter };
