/** @type {import('../plugins/i18n-translator/translator').Config} */
module.exports = {
  // Terms that must never be translated — kept verbatim in output.
  // The confirmed EN→JA glossary lives in config/glossary.ja-JP.tsv.
  untranslatables: [
    'Zilliz Cloud',
    'RESTful API',
    'V2',
    ' | Cloud',
    'mmap',
  ],

  // LLM configuration — falls back to environment variables if not set here.
  // Supported providers: OpenRouter, OpenAI, Ollama (any OpenAI-compatible endpoint).
  //
  // OpenRouter example:
  // modelConfig: {
  //   baseUrl: 'https://openrouter.ai/api/v1',
  //   apiKey: process.env.MODEL_API_KEY,
  //   modelId: 'google/gemma-3-27b-it:free',
  // },
  //
  // Ollama (local) example:
  // modelConfig: {
  //   baseUrl: 'http://localhost:11434/v1/',
  //   apiKey: 'ollama',
  //   modelId: 'llama3.2:latest',
  // },
  modelConfig: {
    baseUrl: process.env.MODEL_API_BASE_URL,
    apiKey:  process.env.MODEL_API_KEY,
    modelId: process.env.MODEL_ID,
  },

  // Throttle settings — tune for your provider's rate limits.
  throttleConfig: {
    minTime:       parseInt(process.env.THROTTLE_MIN_TIME)       || 1000, // ms between requests
    maxConcurrent: parseInt(process.env.THROTTLE_MAX_CONCURRENT) || 1,
  },
}
