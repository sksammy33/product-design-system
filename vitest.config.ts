import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const browser = () => ({
  enabled: true,
  headless: true,
  screenshotDirectory: fileURLToPath(new URL('./.vitest-attachments/screenshots', import.meta.url)),
  provider: playwright(),
  instances: [{ browser: 'chromium' as const }],
});
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react()],
        test: {
          name: 'react',
          include: ['packages/react/tests/**/*.test.tsx'],
          browser: browser(),
          setupFiles: ['packages/react/tests/setup.ts'],
        },
      },
      {
        plugins: [storybookTest({
          configDir: fileURLToPath(new URL('./apps/storybook/.storybook', import.meta.url)),
          storybookScript: 'npm run storybook -- --ci',
        })],
        test: {
          name: 'storybook',
          browser: browser(),
        },
      },
    ],
  },
});
