# Storybook configuration

`main.ts` selects React + Vite and the docs, accessibility and Vitest addons. `preview.tsx` consumes token CSS through the built React package, defines the Light/Dark toolbar, reserves navigation order and enables viewport tools.

Axe checks are configured to fail on detected violations. Storybook's Vitest plugin automatically loads the preview/addon annotations; no duplicate setup file is needed.
