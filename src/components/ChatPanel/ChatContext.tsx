import React, {createContext, useContext, useState, useRef, useCallback, useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import type {Source, ChatMessage, ChatHistoryEntry, AgentType, ConfidenceLevel, GroundingCitation} from './types';
export type {Source, FeedbackRating, ChatMessage, ChatHistoryEntry, AgentType, ConfidenceLevel, GroundingCitation} from './types';

export interface ChatContextValue {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isStreaming: boolean;
  send: (text: string) => Promise<void>;
  newChat: () => void;
  rateFeedback: (messageIndex: number, rating: 'up' | 'down') => void;
  chatHistory: ChatHistoryEntry[];
  activeChatId: string | null;
  loadChat: (id: string) => void;
  deleteChat: (id: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}

function getPageContext(): string | undefined {
  const article = document.querySelector('article');
  if (!article) return undefined;
  return (article.textContent || '').slice(0, 6000);
}

// Persistent user ID
const USER_ID_KEY = 'zd-user-id';

function uuid(): string {
  // crypto.randomUUID() requires a secure context (HTTPS / localhost).
  // Fall back to crypto.getRandomValues() for plain HTTP origins.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> (c === 'x' ? 0 : 2);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = uuid();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

const HISTORY_KEY = 'zd-chat-history';

function loadHistory(): ChatHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ChatHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function ChatProvider({chatEndpoint, children}: {chatEndpoint: string; children: React.ReactNode}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>(() => loadHistory());
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const activeChatIdRef = useRef(activeChatId);
  activeChatIdRef.current = activeChatId;
  const location = useLocation();

  // Auto-save current chat to history when first assistant message arrives
  useEffect(() => {
    if (messages.length < 2) return;
    const hasAssistant = messages.some(m => m.role === 'assistant' && m.text);
    if (!hasAssistant) return;

    const firstUserMsg = messages.find(m => m.role === 'user');
    const title = firstUserMsg ? firstUserMsg.text.slice(0, 50) : 'New chat';

    if (activeChatIdRef.current) {
      setChatHistory(prev =>
        prev.map(entry =>
          entry.id === activeChatIdRef.current
            ? {...entry, title, messages: [...messages]}
            : entry
        )
      );
    } else {
      const id = uuid();
      setActiveChatId(id);
      activeChatIdRef.current = id;
      setChatHistory(prev => [{id, title, messages: [...messages], createdAt: Date.now()}, ...prev]);
    }
  }, [messages]);

  // Persist chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(chatHistory));
    } catch { /* quota exceeded */ }
  }, [chatHistory]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || abortRef.current) return;

    const userMessage: ChatMessage = {role: 'user', text};
    const updatedMessages = [...messagesRef.current, userMessage, {role: 'assistant' as const, text: ''}];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    const apiMessages = updatedMessages
      .filter(m => m.role === 'user' || (m.role === 'assistant' && m.text))
      .map(m => {
        // Strip hook-appended content from conversation history
        const content = m.hookAppend ? m.text.replace(m.hookAppend, '') : m.text;
        return {role: m.role, content};
      });

    try {
      abortRef.current = new AbortController();
      const res = await fetch(chatEndpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          messages: apiMessages,
          pageContext: getPageContext(),
          pageUrl: location.pathname,
          sessionId: sessionIdRef.current,
          userId: getUserId(),
          screenResolution: `${screen.width}x${screen.height}`,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const errorText = (errorBody as {error?: string}).error || `Error: ${res.status}`;
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = {...last, text: errorText};
          }
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let assistantText = '';
      let pendingSources: Source[] | undefined;
      let pendingGrounding: GroundingCitation[] | undefined;
      let pendingConfidence: ConfidenceLevel | undefined;
      let pendingAgent: {type: AgentType; name: string} | undefined;

      // Track current event type across buffer chunks
      let currentEvent = '';

      while (true) {
        const {done, value} = await reader.read();
        if (done) {
          // Process any remaining data in the buffer
          if (buffer.trim()) {
            buffer += '\n';
          }
        } else {
          buffer += decoder.decode(value, {stream: true});
        }
        const lines = buffer.split('\n');
        buffer = done ? '' : (lines.pop() || '');

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7);
          } else if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (currentEvent === 'session') {
              try {
                const parsed = JSON.parse(data) as {sessionId: string};
                sessionIdRef.current = parsed.sessionId;
              } catch { /* skip */ }
            } else if (currentEvent === 'agent') {
              try {
                pendingAgent = JSON.parse(data) as {type: AgentType; name: string};
                // Update the current assistant message with agent info
                const agentInfo = pendingAgent;
                setMessages(prev => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last && last.role === 'assistant') {
                    updated[updated.length - 1] = {...last, agent: agentInfo.name, agentType: agentInfo.type};
                  }
                  return updated;
                });
              } catch { /* skip */ }
            } else if (currentEvent === 'tool-call') {
              try {
                const parsed = JSON.parse(data) as {tool: string; count: number};
                const count = parsed.count;
                setMessages(prev => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last && last.role === 'assistant') {
                    updated[updated.length - 1] = {...last, toolCallCount: count};
                  }
                  return updated;
                });
              } catch { /* skip */ }
            } else if (currentEvent === 'delta') {
              try {
                const parsed = JSON.parse(data) as {text: string};
                assistantText += parsed.text;
                const captured = assistantText;
                setMessages(prev => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last && last.role === 'assistant') {
                    updated[updated.length - 1] = {...last, text: captured};
                  }
                  return updated;
                });
              } catch { /* skip malformed chunk */ }
            } else if (currentEvent === 'sources') {
              try {
                const parsed = JSON.parse(data) as {sources: Source[]};
                pendingSources = parsed.sources;
              } catch { /* skip */ }
            } else if (currentEvent === 'grounding') {
              try {
                const parsed = JSON.parse(data) as {citations: GroundingCitation[]};
                pendingGrounding = parsed.citations;
              } catch { /* skip */ }
            } else if (currentEvent === 'confidence') {
              try {
                const parsed = JSON.parse(data) as {level: ConfidenceLevel; retrieval_score: number};
                pendingConfidence = parsed.level;
              } catch { /* skip */ }
            } else if (currentEvent === 'hook-append') {
              try {
                const parsed = JSON.parse(data) as {text: string};
                assistantText += parsed.text;
                const captured = assistantText;
                setMessages(prev => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last && last.role === 'assistant') {
                    updated[updated.length - 1] = {...last, text: captured, hookAppend: (last.hookAppend || '') + parsed.text};
                  }
                  return updated;
                });
              } catch { /* skip */ }
            } else if (currentEvent === 'error') {
              try {
                const parsed = JSON.parse(data) as {error: string};
                assistantText = parsed.error;
                const captured = assistantText;
                setMessages(prev => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last && last.role === 'assistant') {
                    updated[updated.length - 1] = {...last, text: captured};
                  }
                  return updated;
                });
              } catch { /* skip */ }
            }
          }
        }

        if (done) break;
      }

      // Attach sources, confidence, and agent to the last assistant message
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === 'assistant') {
          updated[updated.length - 1] = {
            ...last,
            ...(pendingSources && pendingSources.length > 0 ? {sources: pendingSources} : {}),
            ...(pendingGrounding && pendingGrounding.length > 0 ? {grounding: pendingGrounding} : {}),
            ...(pendingConfidence ? {confidence: pendingConfidence} : {}),
            ...(pendingAgent ? {agent: pendingAgent.name, agentType: pendingAgent.type} : {}),
          };
        }
        return updated;
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
        setMessages(prev => [...prev, {role: 'assistant', text: `Error: ${errorMsg}`}]);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [chatEndpoint, location.pathname]);

  const rateFeedback = useCallback((messageIndex: number, rating: 'up' | 'down') => {
    setMessages(prev => {
      const updated = [...prev];
      const msg = updated[messageIndex];
      if (!msg || msg.role !== 'assistant') return prev;
      const newRating = msg.feedback === rating ? null : rating;
      updated[messageIndex] = {...msg, feedback: newRating};

      const endpoint = chatEndpoint.replace(/\/chat$/, '/feedback');
      fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          messageIndex,
          rating: newRating || rating,
          pageUrl: location.pathname,
          userId: getUserId(),
        }),
      }).catch(() => {});

      return updated;
    });
  }, [chatEndpoint, location.pathname]);

  const newChat = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setInput('');
    setIsStreaming(false);
    setActiveChatId(null);
    sessionIdRef.current = null;
  }, []);

  const loadChat = useCallback((id: string) => {
    if (abortRef.current) abortRef.current.abort();
    const entry = chatHistory.find(e => e.id === id);
    if (!entry) return;
    setMessages([...entry.messages]);
    setActiveChatId(id);
    setInput('');
    setIsStreaming(false);
    sessionIdRef.current = null;
  }, [chatHistory]);

  // Listen for chat-send events from the search bar / DocRoot
  useEffect(() => {
    const handler = (e: Event) => {
      const query = (e as CustomEvent).detail?.query;
      if (query) {
        setInput(query);
        // Send on next tick after input is set
        setTimeout(() => send(query), 0);
      }
    };
    document.addEventListener('chat-send', handler);
    return () => document.removeEventListener('chat-send', handler);
  }, [setInput, send]);

  const deleteChat = useCallback((id: string) => {
    setChatHistory(prev => prev.filter(e => e.id !== id));
    if (activeChatIdRef.current === id) {
      setMessages([]);
      setActiveChatId(null);
      setInput('');
      sessionIdRef.current = null;
    }
  }, []);

  return (
    <ChatContext.Provider value={{messages, setMessages, input, setInput, isStreaming, send, newChat, rateFeedback, chatHistory, activeChatId, loadChat, deleteChat}}>
      {children}
    </ChatContext.Provider>
  );
}
