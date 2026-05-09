import {readFileSync, readdirSync, existsSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = join(__dirname, '..', 'prompts');
const ZILLIZ_CLI_PROMPT_FILE = join(__dirname, '..', 'cli.md');

export interface TopicPrompt {
  filename: string;
  topic: string;
  content: string;
}

let basePrompt = '';
let topicPrompts: TopicPrompt[] = [];

export function loadPrompts(): void {
  const files = readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const content = readFileSync(join(PROMPTS_DIR, file), 'utf-8').trim();
    if (!content) continue;
    const topic = file.replace('.md', '');
    if (topic === 'base') {
      basePrompt = content;
    } else {
      topicPrompts.push({filename: file, topic, content});
    }
  }

  if (existsSync(ZILLIZ_CLI_PROMPT_FILE)) {
    const content = readFileSync(ZILLIZ_CLI_PROMPT_FILE, 'utf-8').trim();
    if (content) {
      topicPrompts.push({filename: 'cli.md', topic: 'zilliz-cli', content});
    }
  }

  console.log(`[Prompts] Loaded base + ${topicPrompts.length} topic prompts`);
}

export function getBasePrompt(): string { return basePrompt; }
export function getTopicPrompts(): TopicPrompt[] { return topicPrompts; }
export function getTopicPrompt(topic: string): string | undefined {
  return topicPrompts.find(p => p.topic === topic)?.content;
}
