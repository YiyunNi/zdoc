import React, {useRef, useEffect, useState} from 'react';
import {useLocation, useHistory} from '@docusaurus/router';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Maximize2,
  Minimize2,
  SquarePen,
  Send,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Search,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import {useChatContext} from './ChatContext';
import type {ChatHistoryEntry, ConfidenceLevel, Source, GroundingCitation} from './types';
import IconButton from '../IconButton';
import styles from './styles.module.css';

export {ChatProvider} from './ChatContext';

const DEFAULT_SUGGESTIONS = [
  'How do I get started with Zilliz Cloud?',
  'What are the API rate limits?',
  'Show me integration examples',
  'How to handle authentication?',
];

function getSuggestions(pathname: string): string[] {
  if (pathname.includes('/reference/python')) {
    return [
      'Show me a pymilvus insert example',
      'How do I search with filters?',
      'How to create a collection with dynamic schema?',
      'What index types are available?',
    ];
  }
  if (pathname.includes('/reference/')) {
    return [
      'Show me a code example for this API',
      'What are the required parameters?',
      'How do I handle errors?',
      'What are the rate limits for this endpoint?',
    ];
  }
  if (pathname.includes('/docs/byoc')) {
    return [
      'How do I deploy BYOC on AWS?',
      'What are the networking requirements?',
      'How to configure private endpoints?',
      'Compare BYOC vs Serverless',
    ];
  }
  if (pathname.includes('/docs')) {
    return [
      'Help me design a schema for my use case',
      'What cluster size do I need?',
      'Show me a vector search example',
      'How to optimize search performance?',
    ];
  }
  return DEFAULT_SUGGESTIONS;
}

interface ChatPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
}

function ZillizStarIcon() {
  return <img src="/icons/zilliz-star.svg" width="16" height="16" aria-hidden="true" />;
}

/* ── Confidence dot indicator ── */

function ConfidenceDot({level}: {level?: ConfidenceLevel}) {
  if (!level) return null;
  const colorMap: Record<ConfidenceLevel, string> = {
    high: '#22c55e',
    medium: '#eab308',
    low: '#ef4444',
  };
  const labelMap: Record<ConfidenceLevel, string> = {
    high: 'High confidence — answer directly supported by documentation',
    medium: 'Medium confidence — partially supported by documentation',
    low: 'Low confidence — limited documentation available',
  };

  return (
    <span
      className={styles.confidenceDot}
      style={{backgroundColor: colorMap[level]}}
      title={labelMap[level]}
      aria-label={labelMap[level]}
    />
  );
}

/* ── Source section tag ── */

const SOURCE_TAG_MAP: Record<string, {label: string; className: string}> = {
  'byoc-guides': {label: 'BYOC', className: styles.sourceTagByoc},
  'cloud-guides': {label: 'CLOUD', className: styles.sourceTagCloud},
  'api-reference': {label: 'API', className: styles.sourceTagApi},
  'external-web': {label: 'EXT', className: styles.sourceTagExternal},
  'external-github': {label: 'GITHUB', className: styles.sourceTagExternal},
};

function resolveSection(section?: string, url?: string): string {
  // If section is explicitly set and not the default, trust it
  if (section && section !== 'cloud-guides') return section;
  // Infer from URL
  if (url) {
    if (/\/byoc[-/]/.test(url) || /docs-byoc/.test(url)) return 'byoc-guides';
    if (/\/reference\//.test(url)) return 'api-reference';
  }
  // Default: any doc URL is cloud-guides
  return section || 'cloud-guides';
}

function SourceTag({section, url}: {section?: string; url?: string}) {
  const resolved = resolveSection(section, url);
  const tag = SOURCE_TAG_MAP[resolved];
  if (!tag) return null;
  return <span className={`${styles.sourceTag} ${tag.className}`}>{tag.label}</span>;
}

function ChatHeader({onNewChat, onToggle, isExpanded}: {onNewChat: () => void; onToggle: () => void; isExpanded: boolean}) {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatTitleGroup}>
        <div className={styles.chatAvatar}>
          <ZillizStarIcon />
        </div>
        <span className={styles.chatTitle}>Zilliz Copilot</span>
        <span className={styles.chatOnline} aria-hidden="true" />
      </div>
      <div className={styles.chatHeaderActions}>
        {!isExpanded && (
          <IconButton onClick={onNewChat} title="New chat" aria-label="New chat">
            <SquarePen size={15} />
          </IconButton>
        )}
        <IconButton onClick={onToggle} title={isExpanded ? 'Minimize' : 'Expand'} aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}>
          {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </IconButton>
      </div>
    </div>
  );
}

// Custom react-markdown components to fix DOM nesting warnings
const markdownComponents = {
  table: ({children, ...props}: React.HTMLAttributes<HTMLTableElement>) => {
    const wrapped = React.Children.map(children, child => {
      if (React.isValidElement(child) && (child.type === 'tr')) {
        return <tbody>{child}</tbody>;
      }
      return child;
    });
    return <table {...props}>{wrapped}</table>;
  },
};

/* ── Grounded markdown: deterministic citation rendering ── */

function splitParagraphs(text: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inCodeBlock = false;

  for (const line of text.split('\n')) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      current += line + '\n';
      continue;
    }
    if (inCodeBlock) {
      current += line + '\n';
      continue;
    }
    if (line.trim() === '' && current.trim()) {
      parts.push(current.trim());
      current = '';
    } else {
      current += line + '\n';
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/**
 * Build markdown component overrides that append citation sups inline.
 * Uses a render-phase counter so sups only appear on the LAST rendered
 * text-bearing element (last <p>, or last <li> if no <p>).
 */
function makeCitedComponents(sourceIndices: number[], sources: Source[]) {
  const sups = sourceIndices.map(si => (
    <sup key={`cite-${si}`} className={styles.citationSup}>
      <a href={sources[si]?.url} className={styles.citationLink} title={sources[si]?.title}>
        {si + 1}
      </a>
    </sup>
  ));

  // During render, react-markdown calls component overrides in document order.
  // We collect elements via refs, then the CitationAnchor at the end injects
  // sups into the last one via a portal-like trick.
  // Simpler: just track "has a <p> been rendered?" — if yes, only <p> gets sups
  // on the LAST call; if no <p>, the last <li> gets sups.
  //
  // Since react-markdown renders synchronously within a single render pass,
  // we can use a mutable object to count calls and a two-pass trick:
  // Pass 1 (counting) isn't practical, so instead we append to ALL <p>'s
  // but hide all but the last via CSS :last-of-type.
  //
  // Actually simplest: only override <p> (the block-level wrapper).
  // Each paragraph chunk produces exactly one <p> for prose,
  // and lists produce <ul>/<ol> with no <p> inside.
  // For list chunks, we skip inline citations (they still show in Sources list).

  const CiteP = ({children, ...props}: any) => (
    <p {...props}>{children}<span className={styles.citationGroup}>{sups}</span></p>
  );

  return {...markdownComponents, p: CiteP};
}

/** Render markdown text with deterministic citation superscripts based on grounding map */
function GroundedMarkdown({text, sources, grounding}: {
  text: string;
  sources?: Source[];
  grounding?: GroundingCitation[];
}) {
  if (!grounding || !sources || grounding.length === 0) {
    return <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{text}</Markdown>;
  }

  const citationMap = new Map<number, number[]>();
  for (const c of grounding) {
    citationMap.set(c.paragraphIndex, c.sourceIndices);
  }

  const paragraphs = splitParagraphs(text);

  return (
    <>
      {paragraphs.map((para, pi) => {
        const cites = citationMap.get(pi);
        const components = cites && cites.length > 0
          ? makeCitedComponents(cites, sources)
          : markdownComponents;
        return <Markdown key={pi} remarkPlugins={[remarkGfm]} components={components}>{para}</Markdown>;
      })}
    </>
  );
}

/* ── Chat history grouping helpers ── */

function getDateGroup(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const oneDay = 86400000;
  if (diff < oneDay) return 'Today';
  if (diff < 7 * oneDay) return 'Previous 7 days';
  return 'Older';
}

function groupHistory(history: ChatHistoryEntry[]): {label: string; items: ChatHistoryEntry[]}[] {
  const groups: Record<string, ChatHistoryEntry[]> = {};
  const order = ['Today', 'Previous 7 days', 'Older'];
  for (const entry of history) {
    const label = getDateGroup(entry.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(entry);
  }
  return order.filter(l => groups[l]).map(label => ({label, items: groups[label]}));
}

/* ── Chat Sidebar (expanded mode only) ── */

function ChatSidebar({
  chatHistory,
  activeChatId,
  onNewChat,
  onLoadChat,
  onDeleteChat,
}: {
  chatHistory: ChatHistoryEntry[];
  activeChatId: string | null;
  onNewChat: () => void;
  onLoadChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = search
    ? chatHistory.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
    : chatHistory;
  const grouped = groupHistory(filtered);

  return (
    <div className={styles.chatSidebar}>
      <div className={styles.sidebarHeader}>
        <button type="button" className={styles.newChatBtn} onClick={onNewChat}>
          <SquarePen size={14} />
          <span>New Chat</span>
        </button>
        <div className={styles.searchInputWrapper}>
          <Search size={13} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chats..."
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.chatHistoryList}>
        {grouped.length === 0 && (
          <p className={styles.chatHistoryEmpty}>No chat history yet</p>
        )}
        {grouped.map(group => (
          <div key={group.label} className={styles.chatHistoryGroup}>
            <span className={styles.chatHistoryGroupLabel}>{group.label}</span>
            {group.items.map(entry => (
              <button
                key={entry.id}
                type="button"
                className={`${styles.chatHistoryItem} ${entry.id === activeChatId ? styles.chatHistoryItemActive : ''}`}
                onClick={() => onLoadChat(entry.id)}
              >
                <MessageSquare size={13} className={styles.chatHistoryItemIcon} />
                <span className={styles.chatHistoryItemTitle}>{entry.title}</span>
                <span
                  className={styles.chatHistoryDelete}
                  role="button"
                  tabIndex={0}
                  aria-label="Delete chat"
                  onClick={e => { e.stopPropagation(); onDeleteChat(entry.id); }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); onDeleteChat(entry.id); } }}
                >
                  <Trash2 size={12} />
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChatPanel({onToggle, isExpanded}: ChatPanelProps): React.ReactElement {
  const {messages, input, setInput, isStreaming, send, newChat, rateFeedback, chatHistory, activeChatId, loadChat, deleteChat} = useChatContext();
  const location = useLocation();
  const history = useHistory();
  const suggestions = getSuggestions(location.pathname);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTo({top: el.scrollHeight, behavior: 'smooth'});
    }
  }, [messages]);

  const hasMessages = messages.length > 0;

  // Handle source link click — client-side navigation
  const handleSourceClick = (e: React.MouseEvent, url: string) => {
    // Only handle internal doc links
    if (url.startsWith('/') || url.startsWith(window.location.origin)) {
      e.preventDefault();
      const path = url.startsWith('/') ? url : new URL(url).pathname;
      history.push(path);
    }
  };

  const conversationContent = (
    <>
      {!hasMessages ? (
        <div className={styles.emptyState}>
          <div className={styles.greetingBlock}>
            <p className={styles.greetingLine}>How can I help you</p>
            <p className={styles.greetingLineAccent}>with Zilliz Cloud?</p>
          </div>

          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="Ask a question..."
                className={styles.input}
                aria-label="Chat message"
              />
              <button
                type="button"
                className={styles.sendRound}
                onClick={() => send(input)}
                disabled={!input.trim()}
                aria-label="Send">
                <Send size={14} strokeWidth={2.5} />
              </button>
            </div>

            <div className={styles.suggestions}>
              <p className={styles.suggestionsLabel}>Suggested questions</p>
              {suggestions.map(q => (
                <button type="button" key={q} className={styles.suggestionBtn} onClick={() => send(q)}>
                  <span>{q}</span>
                  <ChevronRight size={13} strokeWidth={2.5} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.conversation}>
          <div className={styles.messages} ref={messagesContainerRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                {msg.role === 'assistant' && (
                  <div className={styles.assistantAvatar}><ZillizStarIcon /></div>
                )}
                <div className={msg.role === 'assistant' ? styles.markdownContent : undefined}>
                  {/* Agent label */}
                  {msg.role === 'assistant' && msg.agent && (
                    <span className={isStreaming && i === messages.length - 1 ? styles.agentLabelStreaming : styles.agentLabel}>{msg.agent}</span>
                  )}
                  {msg.role === 'assistant' ? (
                    isStreaming && i === messages.length - 1 && !msg.text ? (
                      <span className={styles.thinkingText}>
                        {msg.toolCallCount
                          ? `searching docs (${msg.toolCallCount} tool call${msg.toolCallCount > 1 ? 's' : ''})...`
                          : 'thinking...'}
                      </span>
                    ) : (
                      <GroundedMarkdown text={msg.text} sources={msg.sources} grounding={msg.grounding} />
                    )
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className={styles.sourcesSection}>
                      <span className={styles.sourcesLabel}>Sources</span>
                      <ul className={styles.sourcesList}>
                        {msg.sources.map((src, j) => (
                          <li key={j}>
                            <a
                              href={src.url}
                              onClick={e => handleSourceClick(e, src.url)}
                              className={styles.sourceLink}
                              title={src.title}
                            >
                              <span className={styles.sourceIndex}>{j + 1}</span>
                              <span>{src.title}</span>
                              <SourceTag section={src.section} url={src.url} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.text && !isStreaming && (
                    <div className={styles.feedbackRow}>
                      <ConfidenceDot level={msg.confidence} />
                      <button
                        type="button"
                        className={`${styles.feedbackBtn} ${msg.feedback === 'up' ? styles.feedbackBtnActive : ''}`}
                        onClick={() => rateFeedback(i, 'up')}
                        aria-label="Helpful"
                        title="Helpful"
                      >
                        <ThumbsUp size={12} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.feedbackBtn} ${msg.feedback === 'down' ? styles.feedbackBtnActive : ''}`}
                        onClick={() => rateFeedback(i, 'down')}
                        aria-label="Not helpful"
                        title="Not helpful"
                      >
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.bottomInput}>
            <div className={styles.inputRow}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="Ask a question..."
                className={styles.input}
                aria-label="Chat message"
                disabled={isStreaming}
              />
              <button
                type="button"
                className={styles.sendRound}
                onClick={() => send(input)}
                disabled={!input.trim() || isStreaming}
                aria-label="Send">
                <Send size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (isExpanded) {
    return (
      <div className={styles.chatInnerExpanded}>
        <ChatHeader onNewChat={newChat} onToggle={onToggle} isExpanded={isExpanded} />
        <div className={styles.expandedWrapper}>
          <ChatSidebar
            chatHistory={chatHistory}
            activeChatId={activeChatId}
            onNewChat={newChat}
            onLoadChat={loadChat}
            onDeleteChat={deleteChat}
          />
          <div className={styles.expandedMain}>
            {conversationContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatInner}>
      <ChatHeader onNewChat={newChat} onToggle={onToggle} isExpanded={isExpanded} />
      {conversationContent}
    </div>
  );
}
