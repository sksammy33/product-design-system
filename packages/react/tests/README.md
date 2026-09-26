# Browser testing

Vitest + Playwright Chromium and vitest-browser-react support render, pointer/keyboard and native form behavior tests. The shared axe assertion fails on detected violations; the negative fixture proves failure on missing labels.

`fixtures/ToolingFixture.tsx` is native HTML for infrastructure verification only. It is not a public Design System component. Tests consume the built React stylesheet and current token exports.

Build React first, then run `npm run test:browser -- --project react` from the repository root. See [manual testing requirements](../../../docs/development.md#testing-and-accessibility).
