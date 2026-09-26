# Contributing

1. **Start visual changes in Figma.** Link the exact node/variable and explain the problem, before/after behavior and intended result. Figma remains the visual source of truth; resolve contradictions through a decision record.
2. **Propose token changes.** Include source collection, variable/style ID, original name, aliases, modes, unit/type and affected consumers. Do not invent values or replace aliases with guessed literals. Missing values need an explicit proposal and approval.
3. **Document components.** Record canonical Figma IDs, variants, sizes, states, semantics, keyboard behavior, responsive rules, token usage and limitations. Production component implementation requires Phase 5 authorization.
4. **Review accessibility.** Explain the affected requirement and include actual contrast or runtime evidence when available. In later phases, pair automated checks with manual keyboard and screen-reader review. Never mark unrun checks as passing.
5. **Keep pull requests focused.** Include Problem, Changes, Figma/decision links, Validation, and Remaining work. Identify design changes explicitly. Avoid bundling unrelated refactors.
6. **Update records.** Update relevant documentation, decision status and changelog. After release tooling is configured, include an appropriate changeset for package changes.

Follow [development setup](docs/development.md), then run `npm run verify` before requesting review. Phase 4 tests use a native HTML tooling fixture only; do not present it as a production component or conformance evidence.
