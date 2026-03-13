import React, {useState, useEffect, useRef} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import IconButton from '../IconButton';
import styles from './styles.module.css';

const SUGGESTIONS = [
  'How do I get started with Zilliz Cloud?',
  'What are the API rate limits?',
  'Show me integration examples',
  'How to handle authentication?',
];

interface ChatPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
}

function ZillizStarIcon() {
  return <img src="/icons/zilliz-star.svg" width="16" height="16" aria-hidden="true" />;
}

function ExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="10" y1="14" x2="3" y2="21" />
      <line x1="21" y1="3" x2="14" y2="10" />
    </svg>
  );
}

function NewChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
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
          <NewChatIcon />
        </IconButton>
        <IconButton onClick={onToggle} title={isExpanded ? 'Minimize' : 'Expand'} aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}>
          {isExpanded ? <MinimizeIcon /> : <ExpandIcon />}
        </IconButton>
      </div>
    </div>
  );
}

function ChatPlaceholder({onToggle, isExpanded}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant'; text: string}[]>([]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [
      ...prev,
      {role: 'user', text},
      {role: 'assistant', text: 'Connect an Inkeep API key to enable AI answers.'},
    ]);
    setInput('');
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={`${styles.chatInner} ${isExpanded ? styles.chatInnerExpanded : ''}`}>
      <ChatHeader onNewChat={() => { setMessages([]); setInput(''); }} onToggle={onToggle} isExpanded={isExpanded} />

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
                <SendIcon />
              </button>
            </div>

            <div className={styles.suggestions}>
              <p className={styles.suggestionsLabel}>Suggested questions</p>
              {SUGGESTIONS.map(q => (
                <button type="button" key={q} className={styles.suggestionBtn} onClick={() => send(q)}>
                  <span>{q}</span>
                  <ChevronRightIcon />
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
                <p>{msg.text}</p>
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
              />
              <button
                type="button"
                className={styles.sendRound}
                onClick={() => send(input)}
                disabled={!input.trim()}
                aria-label="Send">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inkeep's internal error boundary swallows crashes without re-throwing,
// so a React error boundary on the outside never fires. Instead, we mount
// InkeepEmbeddedChat into a ref'd wrapper and check after a short delay
// whether it actually rendered any DOM content. If the wrapper is empty,
// Inkeep crashed silently and we fall back to ChatPlaceholder.
function InkeepChat({apiKey, onToggle, isExpanded}: ChatPanelProps & {apiKey: string}) {
  const [inkeepFailed, setInkeepFailed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const {InkeepEmbeddedChat} = require('@inkeep/cxkit-react');

  useEffect(() => {
    const id = setTimeout(() => {
      if (wrapperRef.current && wrapperRef.current.childElementCount === 0) {
        setInkeepFailed(true);
      }
    }, 800);
    return () => clearTimeout(id);
  }, []);

  if (inkeepFailed) {
    return <ChatPlaceholder isExpanded={isExpanded} onToggle={onToggle} />;
  }

  return (
    <div className={`${styles.chatInner} ${isExpanded ? styles.chatInnerExpanded : ''}`}>
      <ChatHeader onNewChat={() => {}} onToggle={onToggle} isExpanded={isExpanded} />
      <div className={styles.inkeepWrapper} ref={wrapperRef}>
        <InkeepEmbeddedChat
          baseSettings={{
            apiKey,
            primaryBrandColor: '#175fff',
            organizationDisplayName: 'Zilliz',
          }}
          aiChatSettings={{
            chatSubjectName: 'Zilliz Cloud',
            introMessage: "Hi! I'm the Zilliz Cloud AI Assistant.\nWhat can I help you with today?",
            exampleQuestions: SUGGESTIONS,
          }}
        />
      </div>
    </div>
  );
}

export default function ChatPanel(props: ChatPanelProps): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  const apiKey = (siteConfig.customFields?.inkeepApiKey as string) || '';
  return (
    <BrowserOnly fallback={<div className={styles.chatInner} />}>
      {() => {
        if (apiKey) {
          return <InkeepChat {...props} apiKey={apiKey} />;
        }
        return <ChatPlaceholder {...props} />;
      }}
    </BrowserOnly>
  );
}
