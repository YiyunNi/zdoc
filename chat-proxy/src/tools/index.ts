import type {CoreTool} from 'ai';
import {searchDocsTool} from './searchDocs.js';
import {getPageContentTool} from './getPageContent.js';
import {getCodeExampleTool} from './getCodeExample.js';
import {validateSchemaTool} from './validateSchema.js';
import {suggestIndexTool} from './suggestIndex.js';
import {generateSchemaCodeTool} from './generateSchemaCode.js';
import {estimateResourcesTool} from './estimateResources.js';
import {compareProductsTool} from './compareProducts.js';
import {checkFeatureAvailabilityTool} from './checkFeatureAvailability.js';

// All available tools
export const allTools = {
  searchDocs: searchDocsTool,
  getPageContent: getPageContentTool,
  getCodeExample: getCodeExampleTool,
  validateSchema: validateSchemaTool,
  suggestIndex: suggestIndexTool,
  generateSchemaCode: generateSchemaCodeTool,
  estimateResources: estimateResourcesTool,
  compareProducts: compareProductsTool,
  checkFeatureAvailability: checkFeatureAvailabilityTool,
} as const satisfies Record<string, CoreTool>;

export type ToolName = keyof typeof allTools;

// Tool subsets for each agent
export function getToolsForAgent(toolNames: ToolName[]): Record<string, CoreTool> {
  const tools: Record<string, CoreTool> = {};
  for (const name of toolNames) {
    tools[name] = allTools[name];
  }
  return tools;
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
