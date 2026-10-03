# Product Design System

A shared foundation for consistent product interfaces, connecting Figma design decisions to tokens, React components, developer documentation and quality checks.

**Version: 0.1.0 — Repository Foundation**
**The component library is implemented in this private workspace; publication is pending.**

Phase 2 established documentation and workspaces. Phase 3 added the private, versioned [design token package](packages/tokens/README.md), generated Light/Dark themes and local validation. Phase 4 added React/TypeScript packaging, Storybook, browser tests and CI tooling. The private [React package](packages/react/README.md) now implements controls, forms, selection, overlays, modal surfaces, command menus and navigation, with component stories and automated interaction and accessibility tests. Neither package has been publicly published.

## Source of truth

[Figma Product Design System](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=5-2) is the visual source of truth. The [approved Phase 1 plan](docs/phase-1-implementation-plan.md) records the audit baseline. The current Phase 2 instructions confirm Geist as the intended primary typeface; they do not establish that the Figma migration or accessibility fixes have been applied.

Changes to visual decisions must originate in Figma and be recorded with source IDs and review context. Do not silently reinterpret contradictory sources.

## Architecture

| Area | Responsibility | Current status |
|---|---|---|
| Foundations | Color, typography, spacing/layout, radius, borders, effects, motion and icons | [Documentation area](docs/foundations/README.md); [token extraction implemented](packages/tokens/README.md) |
| Components | Reusable controls and compositions | [React component library](packages/react/README.md) and [documentation area](docs/components/README.md) |
| Complex Components | Tables, date pickers, filters, search, command menus, upload, editors and charts | [Command Menu](packages/react/src/components/Command/README.md) implemented; other [inventory scope](docs/complex-components/README.md) deferred |
| Patterns | Repeated interaction and composition guidance | [Reserved area](docs/patterns/README.md) |
| Templates | Page compositions built from the system | [Reserved area](docs/templates/README.md) |
| Accessibility | Design guidance and runtime requirements | [Overview](docs/accessibility/overview.md); no conformance claim |
| Documentation | Usage, source mapping, constraints and decisions | [Index](docs/README.md) |
| QA | Visual, behavior and accessibility verification | [QA guidance](docs/qa.md); token, component and Storybook browser tests implemented; manual review and visual baselines remain |

Workflow: Figma → extracted tokens → generated developer outputs → React components → Storybook → verified reusable packages. GitHub tracks source and change history.

## Repository structure

- `packages/tokens/`: raw Figma snapshots, normalized DTCG tokens, conversion/validation scripts and generated Light/Dark outputs.
- `packages/react/`: implemented component library, scoped token CSS, declarations and browser tests.
- `apps/storybook/`: React/Vite component stories, theme toolbar, accessibility checks and QA tooling fixture.
- `docs/`: foundations, components, complex components, patterns, templates, accessibility and decisions.
- `assets/`: custom assets and provenance guidance.
- `.github/workflows/`: executable build/test verification workflow.
- `.changeset/`: future release tooling guidance.

See [the full repository tree and file inventory](docs/repository-foundation.md).

## Accessibility

The Design System is created to support WCAG 2.2 Level AA requirements at the design-system level. Final conformance depends on implemented code, content, interactions and assistive-technology testing. This repository does not claim full WCAG compliance. See the [runtime checklist](docs/accessibility/runtime-checklist.md).

## Development status

The root, React and Storybook manifests remain private at 0.1.0. The private token package is 0.2.0 and provides dependency-free build, validation and test commands; see its README. No dependency installation is required for token checks. See [development setup and commands](docs/development.md) for React, TypeScript, Storybook, testing and CI tooling.

- **Storybook:** run `npm run build:react` then `npm run storybook`; no hosted deployment.
- **Verification:** run `npm run verify` for token validation, package build, typecheck, tests, Storybook build and CI checks.
- **Package distribution:** the packages remain private; publication, package scope and license decisions are pending.
- **Implemented components:** see the [React package README](packages/react/README.md) for the current public API and family documentation.

## Contributing and releases

Read [CONTRIBUTING.md](CONTRIBUTING.md), [CHANGELOG.md](CHANGELOG.md) and [versioning guidance](.changeset/README.md). Current package versions are workspace milestones, not published library releases. No 1.0.0 release is planned in this phase.

## License

Distribution license pending owner decision; package manifests use `UNLICENSED` and `private: true`. The [LICENSE](LICENSE) file is a clearly marked placeholder, not an open-source grant. Third-party assets retain their own terms.
