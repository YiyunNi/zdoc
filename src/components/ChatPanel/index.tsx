import React, {useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

const HOT_TOPICS = [
  'How do I get started?',
  'What are the API rate limits?',
  'Show me integration examples',
  'How to handle authentication?',
];

interface ChatPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
}

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="10" y1="14" x2="3" y2="21" />
      <line x1="21" y1="3" x2="14" y2="10" />
    </svg>
  );
}

function NewChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
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
      {role: 'assistant', text: 'This is a demo response. Connect an Inkeep API key to enable AI answers.'},
    ]);
    setInput('');
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={`${styles.chatInner} ${isExpanded ? styles.chatInnerExpanded : ''}`}>
      <div className={styles.chatHeader}>
        <button type="button" className={styles.headerBtn} onClick={() => { setMessages([]); setInput(''); }} title="New chat">
          <NewChatIcon />
          <span>New chat</span>
        </button>
        <button type="button" className={styles.headerBtn} onClick={onToggle} title={isExpanded ? 'Minimize' : 'Expand'}>
          {isExpanded ? <MinimizeIcon /> : <ExpandIcon />}
        </button>
      </div>

      {!hasMessages ? (
        <div className={styles.emptyState}>
          <div className={styles.greeting}>
            <h2>Hello, there</h2>
            <p>How can I help you today?</p>
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
            <div className={styles.hotTopics}>
              <p className={styles.hotTopicsLabel}>Hot Topics</p>
              {HOT_TOPICS.map(topic => (
                <button type="button" key={topic} className={styles.topicBtn} onClick={() => setInput(topic)}>
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.conversation}>
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
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

function InkeepChat({apiKey, onToggle, isExpanded}: ChatPanelProps & {apiKey: string}) {
  const {InkeepEmbeddedChat} = require('@inkeep/cxkit-react');
  return (
    <div className={styles.chatInner}>
      <div className={styles.chatHeader}>
        <span className={styles.chatTitle}>AI Assistant</span>
        <button type="button" className={styles.headerBtn} onClick={onToggle} title={isExpanded ? 'Minimize' : 'Expand'}>
          {isExpanded ? <MinimizeIcon /> : <ExpandIcon />}
        </button>
      </div>
      <div className={styles.inkeepWrapper}>
        <InkeepEmbeddedChat
          baseSettings={{
            apiKey,
            primaryBrandColor: '#175fff',
            organizationDisplayName: 'Zilliz',
          }}
          aiChatSettings={{
            chatSubjectName: 'Zilliz Cloud',
            introMessage: "Hi! I'm the Zilliz Cloud AI Assistant.\nWhat can I help you with today?",
            exampleQuestions: HOT_TOPICS,
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
