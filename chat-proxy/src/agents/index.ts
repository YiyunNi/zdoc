import type {AgentConfig} from './types.js';
import type {AgentType} from '../types.js';
import {generalAgent} from './general.js';
import {schemaAgent} from './schema.js';
import {resourcesAgent} from './resources.js';
import {productAgent} from './product.js';
import {codeAgent} from './code.js';

export const agentRegistry: Record<AgentType, AgentConfig> = {
  general: generalAgent,
  schema: schemaAgent,
  resources: resourcesAgent,
  product: productAgent,
  code: codeAgent,
};

export function getAgent(type: AgentType): AgentConfig {
  return agentRegistry[type] || agentRegistry.general;
}

export {type AgentConfig} from './types.js';
