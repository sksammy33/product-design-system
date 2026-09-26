# QA foundation

Phase 4 provides token validation, strict TypeScript, a library build, Chromium browser tests, Storybook interaction/axe tests and a static Storybook build. Run `npm run verify` after installing dependencies and Chromium.

The native HTML tooling fixture proves the runner and error paths only. It does not establish that future production components are correct or accessible.

For each future component, record Figma revision, approved variants/states, environment, automated results and manual keyboard, screen-reader, focus, zoom/reflow, reduced-motion and complex-interaction evidence. See [development tooling](development.md) and the [runtime checklist](accessibility/runtime-checklist.md).

Visual baselines remain deferred until real components and reviewed Figma comparisons exist. Use stable story IDs, fixed browser/OS/fonts and explicit Light/Dark/responsive cases when that work is authorized.
