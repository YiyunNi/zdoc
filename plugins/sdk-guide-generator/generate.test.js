/**
 * Unit tests for the SDK Guide Generator
 *
 * Run: node plugins/sdk-guide-generator/generate.test.js
 */

'use strict';

const assert = require('assert');
const {
  parseSections,
  extractTabsBlocks,
  extractTabItemCode,
  isStub,
  extractFromSource,
} = require('./parser');
const { processTemplate, parseFrontmatter } = require('./generate');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

// ─── Parser Tests ──────────────────────────────────────────────

console.log('\nParser Tests:');

test('parseSections extracts headings correctly', () => {
  const content = `# Title\nIntro text\n## First Section\nContent 1\n## Second Section\nContent 2\n`;
  const sections = parseSections(content);
  assert.strictEqual(sections.size, 2);
  assert(sections.has('First Section'));
  assert(sections.has('Second Section'));
  assert(sections.get('First Section').includes('Content 1'));
});

test('parseSections handles headings with anchors', () => {
  const content = `## My Heading\\{#my-heading}\nSome content\n## Other\\{#other}\nMore content\n`;
  const sections = parseSections(content);
  assert(sections.has('My Heading'));
  assert(sections.has('Other'));
});

test('extractTabsBlocks finds all Tabs blocks', () => {
  const content = `
Some text
<Tabs groupId="code" defaultValue='python' values={[]}>
<TabItem value='python'>
code 1
</TabItem>
</Tabs>
More text
<Tabs groupId="code">
<TabItem value='python'>
code 2
</TabItem>
</Tabs>
`;
  const blocks = extractTabsBlocks(content);
  assert.strictEqual(blocks.length, 2);
  assert(blocks[0].includes('code 1'));
  assert(blocks[1].includes('code 2'));
});

test('extractTabItemCode extracts Python code', () => {
  const tabsContent = `
<TabItem value='python'>

\`\`\`python
from pymilvus import MilvusClient
client = MilvusClient(uri="http://localhost")
\`\`\`

</TabItem>
<TabItem value='java'>

\`\`\`java
import io.milvus.v2.client.MilvusClientV2;
\`\`\`

</TabItem>
`;
  const code = extractTabItemCode(tabsContent, 'python');
  assert(code !== null);
  assert(code.includes('```python'));
  assert(code.includes('from pymilvus import MilvusClient'));
  assert(!code.includes('MilvusClientV2'));
});

test('extractTabItemCode returns null for missing language', () => {
  const tabsContent = `<TabItem value='python'>\n\`\`\`python\ncode\n\`\`\`\n</TabItem>`;
  const code = extractTabItemCode(tabsContent, 'rust');
  assert.strictEqual(code, null);
});

test('extractTabItemCode returns null for stubs', () => {
  const tabsContent = `<TabItem value='java'>\n\`\`\`java\n// java\n\`\`\`\n</TabItem>`;
  const code = extractTabItemCode(tabsContent, 'java');
  assert.strictEqual(code, null);
});

test('isStub detects single-line comment stubs', () => {
  assert.strictEqual(isStub('// java', 'java'), true);
  assert.strictEqual(isStub('// go', 'go'), true);
  assert.strictEqual(isStub('# python', 'python'), true);
  assert.strictEqual(isStub('// node.js', 'javascript'), true);
});

test('isStub rejects real code', () => {
  assert.strictEqual(isStub('import pymilvus\nclient = pymilvus.MilvusClient()', 'python'), false);
  assert.strictEqual(isStub('// Setup connection\nvar client = new MilvusClient();', 'javascript'), false);
});

test('isStub detects empty content', () => {
  assert.strictEqual(isStub('', 'python'), true);
  assert.strictEqual(isStub('  \n  ', 'python'), true);
});

// ─── extractFromSource Tests ───────────────────────────────────

console.log('\nextractFromSource Tests:');

const sampleSource = `---
title: Test Doc
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Main Title

## First Section\\{#first}

Some description.

<Tabs groupId="code" defaultValue='python' values={[]}>
<TabItem value='python'>

\`\`\`python
result = client.search(collection_name="test", data=[[1,2,3]])
\`\`\`

</TabItem>
<TabItem value='java'>

\`\`\`java
SearchResp resp = client.search(req);
\`\`\`

</TabItem>
</Tabs>

## Second Section\\{#second}

More description.

<Tabs groupId="code">
<TabItem value='python'>

\`\`\`python
client.insert(collection_name="test", data=[{"id": 1}])
\`\`\`

</TabItem>
<TabItem value='go'>

\`\`\`go
// go
\`\`\`

</TabItem>
</Tabs>

## Third Section

No tabs here, just text.
`;

test('extractFromSource gets correct heading code', () => {
  const result = extractFromSource(sampleSource, 'First Section', 'python');
  assert.strictEqual(result.warning, null);
  assert(result.code.includes('client.search'));
  assert(!result.code.includes('client.insert'));
});

test('extractFromSource handles case-insensitive heading match', () => {
  const result = extractFromSource(sampleSource, 'first section', 'python');
  assert.strictEqual(result.warning, null);
  assert(result.code.includes('client.search'));
});

test('extractFromSource warns on missing heading', () => {
  const result = extractFromSource(sampleSource, 'Nonexistent Heading', 'python');
  assert.strictEqual(result.code, null);
  assert(result.warning.includes('not found'));
});

test('extractFromSource warns on no Tabs under heading', () => {
  const result = extractFromSource(sampleSource, 'Third Section', 'python');
  assert.strictEqual(result.code, null);
  assert(result.warning.includes('No <Tabs>'));
});

test('extractFromSource skips stub code but keeps text', () => {
  // Default mode: go tab is a stub, so code block is removed but text remains
  const result = extractFromSource(sampleSource, 'Second Section', 'go');
  assert(result.code !== null, 'Should return text content even when code is stub');
  assert(!result.code.includes('```go'), 'Should not contain stub code block');
  assert(result.code.includes('More description'), 'Should preserve descriptive text');
});

test('extractFromSource explicit index returns null for stub', () => {
  // Explicit index mode: go tab is a stub, returns null
  const result = extractFromSource(sampleSource, 'Second Section', 'go', 0);
  assert.strictEqual(result.code, null);
  assert(result.warning.includes('stub'));
});

test('extractFromSource default extracts ALL blocks', () => {
  const multiTabSource = `## Multi\\{#multi}\n
<Tabs><TabItem value='python'>\n\`\`\`python\nfirst\n\`\`\`\n</TabItem></Tabs>
<Tabs><TabItem value='python'>\n\`\`\`python\nsecond\n\`\`\`\n</TabItem></Tabs>
`;
  const rAll = extractFromSource(multiTabSource, 'Multi', 'python');
  assert(rAll.code.includes('first'));
  assert(rAll.code.includes('second'));
});

test('extractFromSource explicit index extracts specific block', () => {
  const multiTabSource = `## Multi\\{#multi}\n
<Tabs><TabItem value='python'>\n\`\`\`python\nfirst\n\`\`\`\n</TabItem></Tabs>
<Tabs><TabItem value='python'>\n\`\`\`python\nsecond\n\`\`\`\n</TabItem></Tabs>
`;
  const r0 = extractFromSource(multiTabSource, 'Multi', 'python', 0);
  assert(r0.code.includes('first'));
  assert(!r0.code.includes('second'));
  const r1 = extractFromSource(multiTabSource, 'Multi', 'python', 1);
  assert(r1.code.includes('second'));
  assert(!r1.code.includes('first'));
});

// ─── Generator Tests ───────────────────────────────────────────

console.log('\nGenerator Tests:');

test('parseFrontmatter extracts attributes and body', () => {
  const content = `---\ntitle: Test\nsource: some/path.md\n---\n# Hello\nBody text`;
  const { attributes, body } = parseFrontmatter(content);
  assert.strictEqual(attributes.title, 'Test');
  assert.strictEqual(attributes.source, 'some/path.md');
  assert(body.includes('# Hello'));
});

test('parseFrontmatter handles quoted values', () => {
  const content = `---\ntitle: "My Title: With Colon"\n---\nBody`;
  const { attributes } = parseFrontmatter(content);
  assert.strictEqual(attributes.title, 'My Title: With Colon');
});

test('processTemplate passes through non-generated files', () => {
  const template = `---\ntitle: Manual Guide\n---\n# Manual\nHand-written content.`;
  const { output, warnings } = processTemplate(template, '/tmp');
  assert.strictEqual(warnings.length, 0);
  assert.strictEqual(output, template);
});

test('processTemplate strips source from output frontmatter', () => {
  // Create a mock source file
  const fs = require('fs');
  const path = require('path');
  const tmpDir = fs.mkdtempSync('/tmp/sdk-gen-test-');
  const sourceDir = path.join(tmpDir, 'docs');
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.writeFileSync(
    path.join(sourceDir, 'test.md'),
    `## Test Heading\n<Tabs><TabItem value='python'>\n\`\`\`python\nprint("hello")\n\`\`\`\n</TabItem></Tabs>\n`,
  );

  const template = `---\nsource: docs/test.md\ntitle: Test\n---\n## Test Heading\n<!-- extract (python) -->\n`;
  const { output, warnings } = processTemplate(template, tmpDir);

  assert(!output.includes('source:'));
  assert(output.includes('title: Test'));
  assert(output.includes('print("hello")'));
  assert.strictEqual(warnings.length, 0);

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true });
});

// ─── Summary ───────────────────────────────────────────────────

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
