import React, {useRef, useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Maximize2,
  Minimize2,
  SquarePen,
  Send,
  FileText,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
} from 'lucide-react';
import {useChatContext} from './ChatContext';
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
        <IconButton onClick={onNewChat} title="New chat" aria-label="New chat">
          <SquarePen size={15} />
        </IconButton>
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
    // Wrap bare <tr> children in <tbody>, but pass through <thead>/<tbody>/<tfoot> as-is
    const wrapped = React.Children.map(children, child => {
      if (React.isValidElement(child) && (child.type === 'tr')) {
        return <tbody>{child}</tbody>;
      }
      return child;
    });
    return <table {...props}>{wrapped}</table>;
  },
};

export default function ChatPanel({onToggle, isExpanded}: ChatPanelProps): React.ReactElement {
  const {messages, input, setInput, isStreaming, send, newChat, rateFeedback} = useChatContext();
  const location = useLocation();
  const suggestions = getSuggestions(location.pathname);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className={`${styles.chatInner} ${isExpanded ? styles.chatInnerExpanded : ''}`}>
      <ChatHeader onNewChat={newChat} onToggle={onToggle} isExpanded={isExpanded} />

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
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                {msg.role === 'assistant' && (
                  <div className={styles.assistantAvatar}><ZillizStarIcon /></div>
                )}
                <div className={msg.role === 'assistant' ? styles.markdownContent : undefined}>
                  {msg.role === 'assistant' ? (
                    isStreaming && i === messages.length - 1 && !msg.text ? (
                      <span className={styles.thinkingText}>thinking...</span>
                    ) : (
                      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{msg.text}</Markdown>
                    )
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className={styles.sourcesRow}>
                      {msg.sources.map((src, j) => (
                        <a
                          key={j}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.sourceChip}
                          title={src.title}
                        >
                          <FileText size={11} />
                          <span>{src.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.text && !isStreaming && (
                    <div className={styles.feedbackRow}>
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
            <div ref={messagesEndRef} />
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
    </div>
  );
}
