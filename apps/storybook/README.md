# Storybook tooling

React + Vite Storybook with docs, axe accessibility and Vitest addons. Essential controls/actions/toolbars/viewports are built in. Light/Dark preview scopes consume the built React stylesheet, which includes Phase 3 tokens.

From the root, build React with `npm run build:react`, then run `npm run storybook` or `npm run build:storybook`. Run story tests with `npm run test:browser -- --project storybook`.

Navigation reserves Foundations, Components, Accessibility and QA; the Button stories and QA tooling fixture are executable. Button stories run with axe checks in Light and Dark themes using the current Figma-derived tokens. There is no deployment or screenshot baseline. See [development tooling](../../docs/development.md).
