# CI foundation

`ci.yml` runs on main pushes, pull requests and manual dispatch. It uses Node 24, installs the npm lockfile and Playwright Chromium, and runs the root `verify` command.

Gates cover token integrity/build/tests, React ESM/CSS/declarations, TypeScript, Chromium fixture and story tests with axe checks, and the static Storybook build. A final diff rejects generated token changes. No publishing or deployment is configured.

Run `npm run check:ci` for local YAML/command-reference validation. Hosted execution is only verified after the workflow actually runs on GitHub. Automated accessibility checks supplement [manual testing](../../docs/development.md#testing-and-accessibility).
