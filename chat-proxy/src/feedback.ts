// In-memory feedback collection with statistics

export type FeedbackRating = 'up' | 'down';

interface FeedbackEntry {
  sessionId: string;
  messageIndex: number;
  rating: FeedbackRating;
  pageUrl?: string;
  timestamp: number;
}

const feedbackLog: FeedbackEntry[] = [];
let totalUp = 0;
let totalDown = 0;

export function recordFeedback(
  sessionId: string,
  messageIndex: number,
  rating: FeedbackRating,
  pageUrl?: string,
): void {
  // Prevent duplicate feedback for same session + message
  const existing = feedbackLog.findIndex(
    f => f.sessionId === sessionId && f.messageIndex === messageIndex,
  );
  if (existing !== -1) {
    // Update existing: adjust counters
    const prev = feedbackLog[existing].rating;
    if (prev === rating) return; // no change
    if (prev === 'up') totalUp--;
    else totalDown--;
    feedbackLog[existing] = {sessionId, messageIndex, rating, pageUrl, timestamp: Date.now()};
  } else {
    feedbackLog.push({sessionId, messageIndex, rating, pageUrl, timestamp: Date.now()});
  }

  if (rating === 'up') totalUp++;
  else totalDown++;

  console.log(`[Feedback] ${rating} (session=${sessionId.slice(0, 8)}, msg=${messageIndex}) — totals: ${totalUp} up, ${totalDown} down`);
}

export function getStats(): {
  totalUp: number;
  totalDown: number;
  total: number;
  positiveRate: number;
  recentFeedback: Array<{rating: FeedbackRating; pageUrl?: string; timestamp: number}>;
} {
  // Last 20 entries for recent activity
  const recent = feedbackLog.slice(-20).reverse().map(f => ({
    rating: f.rating,
    pageUrl: f.pageUrl,
    timestamp: f.timestamp,
  }));

  const total = totalUp + totalDown;
  return {
    totalUp,
    totalDown,
    total,
    positiveRate: total > 0 ? Math.round((totalUp / total) * 100) : 0,
    recentFeedback: recent,
  };
}
