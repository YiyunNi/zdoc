/**
 * Lightweight Prometheus-style metrics registry.
 * Exposes counters and gauges in Prometheus text format at /metrics.
 */

interface Counter {
  value: number;
  labels: Record<string, string>;
}

interface Gauge {
  value: number;
  labels: Record<string, string>;
}

const counters = new Map<string, Counter[]>();
const gauges = new Map<string, Gauge[]>();

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

  return sections.filter(Boolean).join('\n');
}

const COUNTER_HELP: Record<string, string> = {
  'chat_proxy_requests_total': 'Total number of chat requests',
  'chat_proxy_token_usage_total': 'Total token usage by model and agent',
  'chat_proxy_cache_hits_total': 'Total cache hits by type (response|semantic)',
  'chat_proxy_cache_misses_total': 'Total cache misses by type (response|semantic)',
  'chat_proxy_tool_calls_total': 'Total number of tool calls by tool name',
};

const GAUGE_HELP: Record<string, string> = {
  'chat_proxy_router_accuracy': 'Router accuracy rate by model (0-1)',
  'chat_proxy_active_sessions': 'Number of active sessions',
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
