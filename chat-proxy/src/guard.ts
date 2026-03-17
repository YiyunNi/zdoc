// Relevance guard: keyword allowlist + pattern blocklist

const DOMAIN_TERMS = new Set([
  // Products & brands
  'milvus', 'zilliz', 'ziliz', 'attu',
  // Vector DB concepts
  'vector', 'vectors', 'embedding', 'embeddings', 'collection', 'collections',
  'partition', 'partitions', 'index', 'indexes', 'indices', 'search', 'query',
  'schema', 'field', 'fields', 'dimension', 'dimensions', 'similarity',
  'distance', 'metric', 'recall', 'topk', 'knn', 'ann',
  // Index types
  'hnsw', 'ivf', 'flat', 'sq8', 'pq', 'scann', 'diskann', 'autoindex',
  // Data types
  'varchar', 'int64', 'float', 'floatvector', 'bfloat16', 'sparsefloat',
  'json', 'array', 'bool', 'int8', 'int16', 'int32', 'float16',
  // Infrastructure
  'cluster', 'clusters', 'serverless', 'dedicated', 'byoc', 'deploy',
  'deployment', 'docker', 'kubernetes', 'k8s', 'helm',
  // SDKs & APIs
  'api', 'sdk', 'pymilvus', 'rest', 'restful', 'grpc', 'endpoint',
  'client', 'milvusclient', 'node', 'java', 'go', 'python', 'javascript',
  // Operations
  'insert', 'upsert', 'delete', 'create', 'drop', 'load', 'release',
  'compact', 'flush', 'import', 'export', 'backup', 'restore', 'migrate',
  // Search types
  'hybrid', 'sparse', 'dense', 'rerank', 'reranker', 'filter', 'filtering',
  'range', 'groupby', 'iterator', 'pagination',
  // Config & security
  'vpc', 'privatelink', 'peering', 'rbac', 'role', 'privilege', 'token',
  'authentication', 'tls', 'ssl', 'encryption',
  // Performance
  'performance', 'latency', 'qps', 'throughput', 'benchmark', 'scale',
  'scaling', 'autoscaling', 'cu', 'compute',
  // Billing
  'billing', 'pricing', 'cost', 'quota', 'limit', 'limits',
  // AI/ML
  'rag', 'llm', 'openai', 'langchain', 'llamaindex', 'model', 'models',
  'ai', 'ml', 'neural', 'transformer', 'bert', 'gpt', 'claude',
  // Development
  'code', 'install', 'setup', 'connect', 'connection', 'error', 'bug',
  'debug', 'troubleshoot', 'fix', 'issue', 'problem', 'help',
  'documentation', 'docs', 'tutorial', 'example', 'guide', 'quickstart',
  // Database concepts
  'database', 'db', 'data', 'storage', 'table', 'row', 'column',
  'primary', 'key', 'consistency', 'replica', 'shard', 'segment',
]);

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /system\s+prompt/i,
  /forget\s+(all\s+)?your\s+(instructions|rules)/i,
  /disregard\s+(all\s+)?prior/i,
  /new\s+instructions?\s*:/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /act\s+as\s+if/i,
  /override\s+(your|the)\s+(system|rules)/i,
];

const GREETING_PATTERNS = [
  /^(hi|hello|hey|howdy|greetings|yo|sup|hola|good\s+(morning|afternoon|evening))[\s!.,?]*$/i,
];

export const DEFLECTION_MESSAGE =
  "I'm the Zilliz Cloud documentation assistant — I can help with schema design, cluster configuration, SDK usage, and vector search. Could you rephrase your question about one of these topics?";

export const GREETING_REDIRECT =
  "Hi! I'm the Zilliz Cloud documentation assistant. I can help you with schema design, cluster setup, SDK code examples, and vector search optimization. What would you like to know?";

export interface GuardResult {
  allowed: boolean;
  reason?: 'injection' | 'off_topic' | 'greeting';
  deflection?: string;
}

export function checkGuard(message: string): GuardResult {
  // Layer 2a: Block prompt injection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return {allowed: false, reason: 'injection', deflection: DEFLECTION_MESSAGE};
    }
  }

  // Layer 2b: Friendly redirect for greetings
  for (const pattern of GREETING_PATTERNS) {
    if (pattern.test(message.trim())) {
      return {allowed: false, reason: 'greeting', deflection: GREETING_REDIRECT};
    }
  }

  // Layer 1: Domain keyword allowlist — if ANY term matches, allow
  const tokens = message.toLowerCase().split(/[\s.,;:!?'"()\[\]{}<>\/\\|@#$%^&*+=~`]+/);
  for (const token of tokens) {
    if (token && DOMAIN_TERMS.has(token)) {
      return {allowed: true};
    }
  }

  // Short messages with no domain terms → off-topic
  if (message.trim().split(/\s+/).length < 8) {
    return {allowed: false, reason: 'off_topic', deflection: DEFLECTION_MESSAGE};
  }

  // Longer messages without domain terms — let through (might be contextual)
  return {allowed: true};
}
