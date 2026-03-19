import type {AgentType, ConfidenceLevel} from '../types.js';

export interface Rule {
  name: string;
  enabled: boolean;
  priority: number;
  when: RuleCondition;
  then: RuleAction;
}

export interface RuleCondition {
  keywords?: string[];
  patterns?: string[];
  agents?: AgentType[];
  confidence?: ConfidenceLevel[];
}

export interface RuleAction {
  inject?: string;
  append?: string;
}

export interface HookContext {
  message: string;
  agentType: AgentType;
  confidence?: ConfidenceLevel;
}
