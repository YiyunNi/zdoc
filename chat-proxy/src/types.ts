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

export type SourceType = 'internal' | 'external-web' | 'external-github';

export interface ExternalSource {
  id: string;
  url: string;
  source_type: SourceType;
  label: string;
  status: 'pending' | 'indexing' | 'indexed' | 'error';
  chunk_count: number;
  last_indexed: string;
  error_message: string;
  created_at: string;
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
