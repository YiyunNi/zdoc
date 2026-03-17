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
}

export interface Source {
  title: string;
  url: string;
}

export interface FeedbackRequest {
  sessionId: string;
  messageIndex: number;
  rating: 'up' | 'down';
  pageUrl?: string;
}
