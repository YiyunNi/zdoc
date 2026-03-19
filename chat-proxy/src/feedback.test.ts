import {describe, it, expect, beforeEach, vi} from 'vitest';

// We need fresh state per test, so we re-import the module each time
async function freshFeedback() {
  vi.resetModules();
  return await import('./feedback.js');
}

describe('recordFeedback & getStats', () => {
  it('records an up vote', async () => {
    const {recordFeedback, getStats} = await freshFeedback();
    recordFeedback('s1', 0, 'up');
    const stats = getStats();
    expect(stats.totalUp).toBe(1);
    expect(stats.totalDown).toBe(0);
    expect(stats.total).toBe(1);
  });

  it('records a down vote', async () => {
    const {recordFeedback, getStats} = await freshFeedback();
    recordFeedback('s1', 0, 'down');
    const stats = getStats();
    expect(stats.totalUp).toBe(0);
    expect(stats.totalDown).toBe(1);
  });

  it('deduplicates: same session+index+rating is no-op', async () => {
    const {recordFeedback, getStats} = await freshFeedback();
    recordFeedback('s1', 0, 'up');
    recordFeedback('s1', 0, 'up'); // same — should be no-op
    const stats = getStats();
    expect(stats.totalUp).toBe(1);
    expect(stats.total).toBe(1);
  });

  it('switches rating: up→down adjusts both counters', async () => {
    const {recordFeedback, getStats} = await freshFeedback();
    recordFeedback('s1', 0, 'up');
    recordFeedback('s1', 0, 'down'); // switch
    const stats = getStats();
    expect(stats.totalUp).toBe(0);
    expect(stats.totalDown).toBe(1);
    expect(stats.total).toBe(1);
  });

  it('returns recent feedback in reverse order', async () => {
    const {recordFeedback, getStats} = await freshFeedback();
    recordFeedback('s1', 0, 'up');
    recordFeedback('s1', 1, 'down');
    recordFeedback('s1', 2, 'up');
    const stats = getStats();
    expect(stats.recentFeedback).toHaveLength(3);
    // Most recent first
    expect(stats.recentFeedback[0].rating).toBe('up');
    expect(stats.recentFeedback[2].rating).toBe('up');
  });

  it('calculates positiveRate correctly', async () => {
    const {recordFeedback, getStats} = await freshFeedback();
    recordFeedback('s1', 0, 'up');
    recordFeedback('s1', 1, 'up');
    recordFeedback('s1', 2, 'down');
    const stats = getStats();
    expect(stats.positiveRate).toBe(67); // 2/3 = 66.67 → rounded to 67
  });
});
