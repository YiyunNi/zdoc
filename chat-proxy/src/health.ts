// Shared health state used by both public /health and /admin/api/health

export const startedAt = new Date().toISOString();

export const llmHealth = {
  lastSuccessAt: null as string | null,
  lastErrorAt: null as string | null,
  lastError: null as string | null,
  totalCalls: 0,
  totalErrors: 0,
  totalDisconnects: 0,
};

export function recordLlmSuccess(): void {
  llmHealth.lastSuccessAt = new Date().toISOString();
  llmHealth.totalCalls++;
}

export function recordLlmError(message: string): void {
  llmHealth.lastErrorAt = new Date().toISOString();
  llmHealth.lastError = message;
  llmHealth.totalCalls++;
  llmHealth.totalErrors++;
}

export function recordLlmDisconnect(): void {
  llmHealth.totalDisconnects++;
}
