# Storybook tooling

React + Vite Storybook with docs, axe accessibility and Vitest addons. Essential controls/actions/toolbars/viewports are built in. Light/Dark preview scopes consume the built React stylesheet, which includes Phase 3 tokens.

From the root, build React with `npm run build:react`, then run `npm run storybook` or `npm run build:storybook`. Run story tests with `npm run test:browser -- --project storybook`.

Navigation reserves Foundations, Components, Accessibility and QA; only the QA tooling fixture is executable. No production component stories, deployment or screenshot baseline exist. See [development tooling](../../docs/development.md).
