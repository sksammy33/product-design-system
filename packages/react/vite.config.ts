import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        styles: fileURLToPath(new URL('./src/styles/entry.ts', import.meta.url)),
      },
      formats: ['es'],
      fileName: (_format, entry) => entry + '.js',
      cssFileName: 'styles',
    },
    sourcemap: true,
    rolldownOptions: {
      external: (id) => /^(react|react-dom)(\/|$)/.test(id) ||
        (id.startsWith('@product-design-system/tokens') && !id.endsWith('.css')),
    },
  },
});
