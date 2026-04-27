import React from 'react';
import { ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { ChatMessage } from '../types';
import { isExternalUrl } from '../utils/isExternalUrl';
import { GroundedMarkdown } from './GroundedMarkdown';
import { ConfidenceDot } from './ConfidenceDot';
import { SourceTag } from './SourceTag';
import styles from './ChatMessageBubble.module.css';

export interface ChatMessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  isLast?: boolean;
  onFeedback?: (rating: 'up' | 'down') => void;
}

export function ChatMessageBubble({
  message,
  isStreaming = false,
  isLast = false,
  onFeedback,
}: ChatMessageBubbleProps): React.ReactElement {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className={styles.userBubble}>
        <div className={styles.userLabel}>User</div>
        <div className={styles.userText}>{message.text}</div>
      </div>
    );
  }

  // Assistant message
  const showThinking = isStreaming && isLast && !message.text;

  return (
    <div className={styles.assistantBubble}>
      <div className={styles.assistantHeader}>
        <div className={styles.assistantLabel}>
          {message.agent ? `Agent · ${message.agent}` : 'Agent'}
        </div>
        <div className={styles.assistantMeta}>
          {message.toolCallCount !== undefined && isStreaming && isLast && (
            <span>searching docs ({message.toolCallCount} tool call{message.toolCallCount > 1 ? 's' : ''})...</span>
          )}
        </div>
      </div>

      <div className={styles.assistantContent}>
        {showThinking ? (
          <span className={styles.thinkingText}>
            {message.toolCallCount
              ? `searching docs (${message.toolCallCount} tool call${message.toolCallCount > 1 ? 's' : ''})...`
              : 'thinking...'}
          </span>
        ) : (
          <GroundedMarkdown
            text={message.text}
            sources={message.sources}
            grounding={message.grounding}
          />
        )}
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className={styles.sourcesSection}>
          <span className={styles.sourcesLabel}>Sources</span>
          <ul className={styles.sourcesList}>
            {message.sources.map((src, j) => (
              <li key={j}>
                <a
                  href={src.url}
                  className={styles.sourceLink}
                  title={src.title}
                  {...(isExternalUrl(src.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className={styles.sourceIndex}>{j + 1}</span>
                  <span>{src.title}</span>
                  <SourceTag section={src.section} url={src.url} />
                  {isExternalUrl(src.url) && <ExternalLink size={12} className={styles.externalIcon} />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {message.text && !isStreaming && onFeedback && (
        <div className={styles.feedbackRow}>
          <ConfidenceDot level={message.confidence} />
          <button
            type="button"
            className={`${styles.feedbackBtn} ${message.feedback === 'up' ? styles.feedbackBtnActive : ''}`}
            onClick={() => onFeedback('up')}
            aria-label="Helpful"
            title="Helpful"
          >
            <ThumbsUp size={12} />
          </button>
          <button
            type="button"
            className={`${styles.feedbackBtn} ${message.feedback === 'down' ? styles.feedbackBtnActive : ''}`}
            onClick={() => onFeedback('down')}
            aria-label="Not helpful"
            title="Not helpful"
          >
            <ThumbsDown size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
