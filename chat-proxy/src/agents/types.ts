import type {CoreTool} from 'ai';
import type {AgentType} from '../types.js';
import type {ToolName} from '../tools/index.js';

export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  systemPrompt: string;
  toolNames: ToolName[];
  model?: string;  // per-agent model override; falls back to global AI_MODEL
}
