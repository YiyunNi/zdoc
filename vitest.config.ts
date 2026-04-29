import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/components/ChatPanel/**/*.tsx'],
      exclude: ['src/**/*.test.tsx'],
    },
  },
});
