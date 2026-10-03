# Development tooling

The private React library includes production component source, browser tests and Storybook stories. The native HTML fixture in `packages/react/tests/fixtures/` remains a test asset, not a public component.

## Setup

Use Node.js 24 and npm 11.19.0 (versions are recorded in `.nvmrc` and `package.json`). From the repository root:

```sh
npm ci
npx playwright install chromium
npm run build:react
npm run storybook
```

On Linux, install browser system dependencies with `npx playwright install --with-deps chromium`. On Windows with PowerShell script restrictions, use `npm.cmd` and `npx.cmd`.

The lockfile pins the dependency graph. Direct dependencies are exact versions. Vitest 4 is retained because Storybook 10.6's test addon does not support Vitest 5. TypeScript 6 retains the compiler API used by the tooling ecosystem. The pinned esbuild install script is explicitly allowed for npm's lifecycle policy.

## Commands

| Command | Purpose |
|---|---|
| `npm run validate:tokens` | Check raw snapshots and generated output without rewriting it |
| `npm run build:tokens` | Regenerate Phase 3 output |
| `npm run build:react` | Build ESM, CSS, declarations and declaration maps |
| `npm run typecheck` | Check library, fixtures, Storybook and tooling configuration |
| `npm test` | Token tests plus Chromium React/Storybook projects |
| `npm run test:browser -- --project react` | Run React component and fixture browser tests |
| `npm run test:browser -- --project storybook` | Run story interaction and accessibility tests |
| `npm run storybook` | Start on port 6006 without opening a browser |
| `npm run build:storybook` | Build the static Storybook site |
| `npm run check:ci` | Parse workflow YAML and check command references |
| `npm run verify` | Run all CI gates in order |

Run `build:react` before standalone browser tests or Storybook. Tests intentionally consume the built package exports, so missing build artifacts are detected instead of hidden by a source alias. Rebuild the package after component edits before reviewing its consumers.

## Library and styling

The private React package declares React/React DOM peers and depends on the existing token workspace. Vite externalizes React runtime imports; TypeScript emits declarations separately. The public entry exports token types and the implemented components listed in the [React package README](../packages/react/README.md).

Import `@product-design-system/react/styles.css` once and add `pds-scope` to the UI scope. This stylesheet includes the existing generated token CSS and applies token-backed text/background properties to that class. CSS is opt-in, marked as a package side effect, and has a separate build entry. Component styles use CSS Modules and committed semantic custom properties.

There is no CSS framework, global reset or alternate palette. The generated variables select Light by default and Dark under `data-theme="dark"`; an explicit `data-theme="light"` supports nested scopes. Semantic and chart variables follow the same mode. Fonts are not downloaded: the CSS retains Geist from Phase 3, and a consuming application must load it. The fixture is not a typography-fidelity baseline.

## Storybook

React + Vite uses docs, accessibility and Vitest addons. Controls, actions, toolbar and viewport tools are built into this Storybook release; a legacy essentials bundle is unnecessary. The Light/Dark toolbar sets `data-theme` on the preview scope. Background overrides are disabled to avoid a competing palette.

Navigation includes component stories under Components and a tooling fixture under QA. The fixture has Light and Dark cases: Light allows toolbar switching; Dark fixes that mode for test coverage. The viewport toolbar provides preset responsive sizes; these are testing viewports, not new design tokens.

## Testing and accessibility

Vitest has two Chromium/Playwright projects: React browser tests and Storybook-transformed story tests. Component tests cover interaction and accessibility across the implemented families; the fixture also verifies render, keyboard focus, typed input, native form submission, computed token themes and scoped CSS. Tests compare with generated token data, not copied palette values.

The Storybook axe addon uses `a11y.test: 'error'`, so detected violations fail tests. The React accessibility helper throws on violations; a negative test confirms that an unlabeled native input is rejected. No accessibility rules are silently disabled.

Automated checks do **not** prove WCAG 2.2 AA conformance. Release review still needs manual keyboard interaction, screen-reader, focus, zoom/reflow, reduced-motion and complex-interaction checks. See the [runtime checklist](accessibility/runtime-checklist.md).

## Visual regression architecture

Reuse stable story IDs and the existing Chromium runner for future reviewed screenshot tests. Keep visual assertions in a separate Vitest project when introducing them; fix OS/browser version, viewport, loaded fonts and animation state before generating baselines. Compare approved variants, sizes and states in Light/Dark and representative narrow/wide viewports. Review changes against Figma before accepting a baseline update.

[Vitest browser screenshot assertions](https://vitest.dev/guide/browser/visual-regression-testing) provide the extension point. No production screenshot matrix or visual baseline has been established.

## CI and contribution flow

The GitHub workflow installs the lockfile and Chromium, runs `verify`, and rejects token output drift. It has read-only repository permissions and no publishing/deployment step. Local YAML validation is not a claim that GitHub-hosted CI has already run.

For a component change, confirm its approved source/state mappings, reuse committed tokens and existing components, update its typed public export and family documentation, add or update stories under Components, and cover behavior and accessibility in React and Storybook tests. Rebuild React before consumer tests, run `npm run verify`, and review package exports and manual-review evidence before committing. The tooling fixture is not an implementation specification.
