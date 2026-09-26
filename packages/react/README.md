# React library foundation

Private ESM workspace with React/React DOM peer dependencies, a Vite build, strict TypeScript declarations and opt-in scoped CSS. The only current public exports are the existing token types; there are no production components.

Import `@product-design-system/react/styles.css` and apply `pds-scope` to consume the generated token variables and scoped defaults. Use `data-theme="light"` or `data-theme="dark"` on the scope. No token values are redefined.

From the root, run `npm run build:react`, then `npm run typecheck` and `npm run test:browser -- --project react`. CSS Modules are supported for future component styles. Test fixtures are outside `src/` and excluded from the library build.

See [development tooling](../../docs/development.md) for setup, consumption, tests and contribution flow. Publishing and production component implementation remain deferred.
