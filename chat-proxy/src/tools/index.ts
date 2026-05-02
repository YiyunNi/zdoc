import type {Tool} from 'ai';
import {searchDocsTool} from './searchDocs.js';
import {getPageContentTool} from './getPageContent.js';
import {getCodeExampleTool} from './getCodeExample.js';
import {validateSchemaTool} from './validateSchema.js';
import {suggestIndexTool} from './suggestIndex.js';
import {generateSchemaCodeTool} from './generateSchemaCode.js';
import {estimateResourcesTool} from './estimateResources.js';
import {compareProductsTool} from './compareProducts.js';
import {checkFeatureAvailabilityTool} from './checkFeatureAvailability.js';
import {contactInfoTool} from './contactInfo.js';
import {listPagesTool} from './listPages.js';

// All available tools
export const allTools = {
  searchDocs: searchDocsTool,
  listPages: listPagesTool,
  getPageContent: getPageContentTool,
  getCodeExample: getCodeExampleTool,
  validateSchema: validateSchemaTool,
  suggestIndex: suggestIndexTool,
  generateSchemaCode: generateSchemaCodeTool,
  estimateResources: estimateResourcesTool,
  compareProducts: compareProductsTool,
  checkFeatureAvailability: checkFeatureAvailabilityTool,
  contactInfo: contactInfoTool,
} as const satisfies Record<string, Tool>;

export type ToolName = keyof typeof allTools;

// Tool subsets for each agent
export function getToolsForAgent(toolNames: ToolName[]): Record<string, Tool> {
  const tools: Record<string, Tool> = {};
  for (const name of toolNames) {
    tools[name] = allTools[name];
  }
  return tools;
}

/** Truncate text to maxChars, adding an ellipsis if truncated. */
export function truncateForModel(text: string, maxChars = 800): string {
  if (!text || text.length <= maxChars) return text;
  return text.slice(0, maxChars).trimEnd() + '\n... [truncated]';
}

// Re-export individual tools
export {searchDocsTool} from './searchDocs.js';
export {getPageContentTool} from './getPageContent.js';
export {getCodeExampleTool} from './getCodeExample.js';
export {validateSchemaTool} from './validateSchema.js';
export {suggestIndexTool} from './suggestIndex.js';
export {generateSchemaCodeTool} from './generateSchemaCode.js';
export {estimateResourcesTool} from './estimateResources.js';
export {compareProductsTool} from './compareProducts.js';
export {checkFeatureAvailabilityTool} from './checkFeatureAvailability.js';
export {contactInfoTool} from './contactInfo.js';
export {listPagesTool} from './listPages.js';
