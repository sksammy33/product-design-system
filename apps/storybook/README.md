# Storybook tooling

React + Vite Storybook with docs, axe accessibility and Vitest addons. Essential controls/actions/toolbars/viewports are built in. Light/Dark preview scopes consume the built React stylesheet, which includes Phase 3 tokens.

From the root, build React with `npm run build:react`, then run `npm run storybook` or `npm run build:storybook`. Run story tests with `npm run test:browser -- --project storybook`.

Navigation includes stories for the implemented controls, forms, selection, overlays, modal surfaces, Command Menu and navigation under Components, plus the QA tooling fixture. Browser interaction and axe coverage run through the Storybook Vitest project in Light and Dark themes. There is no deployment or production screenshot baseline. See [development tooling](../../docs/development.md).
