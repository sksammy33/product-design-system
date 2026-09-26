# React library foundation

Private ESM workspace with React/React DOM peer dependencies, a Vite build, strict TypeScript declarations and opt-in scoped CSS. The public API now includes the Button family and existing token types. See [Button](src/components/Button/README.md) for variants, states, token mappings and accessibility notes.

Import `@product-design-system/react/styles.css` and apply `pds-scope` to consume the generated token variables and scoped defaults. Use `data-theme="light"` or `data-theme="dark"` on the scope. No token values are redefined.

From the root, run `npm run build:react`, then `npm run typecheck` and `npm run test:browser -- --project react`. Button styles use CSS Modules and the generated token custom properties. Test fixtures are outside `src/` and excluded from the library build.

See [development tooling](../../docs/development.md) for setup, consumption, tests and contribution flow. Publishing remains deferred.
