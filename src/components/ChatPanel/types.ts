export interface Source {
  title: string;
  url: string;
  score?: number;
  section?: string;
}

export type FeedbackRating = 'up' | 'down' | null;
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type AgentType = 'general' | 'schema' | 'resources' | 'product' | 'code';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  sources?: Source[];
  feedback?: FeedbackRating;
  confidence?: ConfidenceLevel;
  agent?: string;
  agentType?: AgentType;
  hookAppend?: string;
}

export interface ChatHistoryEntry {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}
