/**
 * Lightweight Prometheus-style metrics registry.
 * Exposes counters, gauges, and histograms in Prometheus text format at /metrics.
 */

interface Counter {
  value: number;
  labels: Record<string, string>;
}

interface Gauge {
  value: number;
  labels: Record<string, string>;
}

interface Histogram {
  buckets: number[];
  counts: number[];
  totalCount: number;
  labels: Record<string, string>;
}

const counters = new Map<string, Counter[]>();
const gauges = new Map<string, Gauge[]>();
const histograms = new Map<string, Histogram[]>();

const DEFAULT_BUCKETS = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 30000];

function labelsKey(labels: Record<string, string>): string {
  const entries = Object.entries(labels).sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([k, v]) => `${k}=${v}`).join(',');
}

export function incCounter(name: string, labels: Record<string, string> = {}, value = 1): void {
  const list = counters.get(name) || [];
  const key = labelsKey(labels);
  const existing = list.find(c => labelsKey(c.labels) === key);
  if (existing) {
    existing.value += value;
  } else {
    list.push({value, labels});
  }
  counters.set(name, list);
}

export function setGauge(name: string, labels: Record<string, string> = {}, value: number): void {
  const list = gauges.get(name) || [];
  const key = labelsKey(labels);
  const existing = list.find(g => labelsKey(g.labels) === key);
  if (existing) {
    existing.value = value;
  } else {
    list.push({value, labels});
  }
  gauges.set(name, list);
}

export function observeHistogram(name: string, labels: Record<string, string> = {}, value: number): void {
  const list = histograms.get(name) || [];
  const key = labelsKey(labels);
  let existing = list.find(h => labelsKey(h.labels) === key);
  if (!existing) {
    existing = {buckets: [...DEFAULT_BUCKETS], counts: new Array(DEFAULT_BUCKETS.length).fill(0), totalCount: 0, labels};
    list.push(existing);
  }
  existing.totalCount++;
  for (let i = 0; i < existing.buckets.length; i++) {
    if (value <= existing.buckets[i]) {
      existing.counts[i]++;
    }
  }
  histograms.set(name, list);
}

function renderMetric(
  name: string,
  help: string,
  type: 'counter' | 'gauge',
  items: Counter[] | Gauge[],
): string {
  if (items.length === 0) return '';
  const lines: string[] = [];
  lines.push(`# HELP ${name} ${help}`);
  lines.push(`# TYPE ${name} ${type}`);
  for (const item of items) {
    const labelStr = Object.entries(item.labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    if (labelStr) {
      lines.push(`${name}{${labelStr}} ${item.value}`);
    } else {
      lines.push(`${name} ${item.value}`);
    }
  }
  return lines.join('\n') + '\n';
}

function renderHistogramMetric(name: string, help: string, items: Histogram[]): string {
  if (items.length === 0) return '';
  const lines: string[] = [];
  lines.push(`# HELP ${name} ${help}`);
  lines.push(`# TYPE ${name} histogram`);
  for (const item of items) {
    const baseLabels = Object.entries(item.labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    for (let i = 0; i < item.buckets.length; i++) {
      const bucketLabels = baseLabels
        ? `${baseLabels},le="${item.buckets[i]}"`
        : `le="${item.buckets[i]}"`;
      lines.push(`${name}_bucket{${bucketLabels}} ${item.counts[i]}`);
    }
    const infLabels = baseLabels ? `${baseLabels},le="+Inf"` : 'le="+Inf"';
    lines.push(`${name}_bucket{${infLabels}} ${item.totalCount}`);
    if (baseLabels) {
      lines.push(`${name}_count{${baseLabels}} ${item.totalCount}`);
    } else {
      lines.push(`${name}_count ${item.totalCount}`);
    }
  }
  return lines.join('\n') + '\n';
}

export function renderMetrics(): string {
  const sections: string[] = [];

  for (const [name, items] of counters) {
    const help = COUNTER_HELP[name] || name;
    sections.push(renderMetric(name, help, 'counter', items));
  }

  for (const [name, items] of gauges) {
    const help = GAUGE_HELP[name] || name;
    sections.push(renderMetric(name, help, 'gauge', items));
  }

  for (const [name, items] of histograms) {
    const help = HISTOGRAM_HELP[name] || name;
    sections.push(renderHistogramMetric(name, help, items));
  }

  return sections.filter(Boolean).join('\n');
}

const COUNTER_HELP: Record<string, string> = {
  'chat_proxy_requests_total': 'Total number of chat requests',
  'chat_proxy_token_usage_total': 'Total token usage by model and agent',
  'chat_proxy_cache_hits_total': 'Total cache hits by type (response_session|answer_exact|answer_inflight|semantic|embedding|rag|page_content|route)',
  'chat_proxy_cache_misses_total': 'Total cache misses by type (response_session|answer_exact|answer_inflight|semantic|embedding|rag|page_content|route)',
  'chat_proxy_tool_calls_total': 'Total number of tool calls by tool name',
  'chat_proxy_bedrock_retries_total': 'Total Bedrock calls retried after throttling',
  'chat_proxy_bedrock_queue_timeout_total': 'Total Bedrock calls rejected after queue timeout',
};

const GAUGE_HELP: Record<string, string> = {
  'chat_proxy_router_accuracy': 'Router accuracy rate by model (0-1)',
  'chat_proxy_active_sessions': 'Number of active sessions',
};

const HISTOGRAM_HELP: Record<string, string> = {
  'chat_proxy_step_duration_ms': 'Duration of each pipeline step in milliseconds',
  'chat_proxy_bedrock_queue_wait_ms': 'Bedrock limiter queue wait time in milliseconds',
};

export function initMetrics(): void {
  for (const name of Object.keys(COUNTER_HELP)) {
    if (!counters.has(name)) {
      counters.set(name, [{value: 0, labels: {}}]);
    }
  }
  for (const name of Object.keys(GAUGE_HELP)) {
    if (!gauges.has(name)) {
      gauges.set(name, [{value: 0, labels: {}}]);
    }
  }
}

export function getMetricsData(): {
  counters: { name: string; help: string; values: { labels: Record<string, string>; value: number }[] }[];
  gauges: { name: string; help: string; values: { labels: Record<string, string>; value: number }[] }[];
  histograms: { name: string; help: string; values: { labels: Record<string, string>; buckets: number[]; counts: number[]; totalCount: number }[] }[];
} {
  const counterData: { name: string; help: string; values: { labels: Record<string, string>; value: number }[] }[] = [];
  for (const [name, items] of counters) {
    counterData.push({
      name,
      help: COUNTER_HELP[name] || name,
      values: items.map(i => ({ labels: i.labels, value: i.value })),
    });
  }
  const gaugeData: { name: string; help: string; values: { labels: Record<string, string>; value: number }[] }[] = [];
  for (const [name, items] of gauges) {
    gaugeData.push({
      name,
      help: GAUGE_HELP[name] || name,
      values: items.map(i => ({ labels: i.labels, value: i.value })),
    });
  }
  const histogramData: { name: string; help: string; values: { labels: Record<string, string>; buckets: number[]; counts: number[]; totalCount: number }[] }[] = [];
  for (const [name, items] of histograms) {
    histogramData.push({
      name,
      help: HISTOGRAM_HELP[name] || name,
      values: items.map(i => ({
        labels: i.labels,
        buckets: i.buckets,
        counts: i.counts,
        totalCount: i.totalCount,
      })),
    });
  }
  return { counters: counterData, gauges: gaugeData, histograms: histogramData };
}
