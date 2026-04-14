// Shared interfaces for the chat proxy

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  pageContext?: string;
  pageUrl?: string;
  sessionId?: string;
  userId?: string;
}

export interface Source {
  title: string;
  url: string;
  score?: number;
  section?: string;
}

export interface FeedbackRequest {
  sessionId: string;
  messageIndex: number;
  rating: 'up' | 'down';
  pageUrl?: string;
  userId?: string;
}

export type AgentType = 'general' | 'schema' | 'resources' | 'product' | 'code';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedInputTokens?: number;
  model: string;
  agentType: string;
}
