# Contributing

1. **Start visual changes in Figma.** Link the exact node/variable and explain the problem, before/after behavior and intended result. Figma remains the visual source of truth; resolve contradictions through a decision record.
2. **Propose token changes.** Include source collection, variable/style ID, original name, aliases, modes, unit/type and affected consumers. Do not invent values or replace aliases with guessed literals. Missing values need an explicit proposal and approval.
3. **Document components.** Record canonical Figma IDs, variants, sizes, states, semantics, keyboard behavior, responsive rules, token usage and limitations. Component implementation is out of scope for Phase 2.
4. **Review accessibility.** Explain the affected requirement and include actual contrast or runtime evidence when available. In later phases, pair automated checks with manual keyboard and screen-reader review. Never mark unrun checks as passing.
5. **Keep pull requests focused.** Include Problem, Changes, Figma/decision links, Validation, and Remaining work. Identify design changes explicitly. Avoid bundling unrelated refactors.
6. **Update records.** Update relevant documentation, decision status and changelog. After release tooling is configured, include an appropriate changeset for package changes.

Current Phase 2 validation covers repository structure and honest status only. There is no build/test/Storybook command yet. Do not add fake commands that return success.
