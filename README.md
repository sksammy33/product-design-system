# Product Design System

A shared foundation for consistent product interfaces, connecting Figma design decisions to future tokens, React components, developer documentation and quality checks.

**Version: 0.1.0 — Repository Foundation**
**Design implementation is still in progress.**

Phase 2 established documentation and workspaces. Phase 3 adds the private, versioned [design token package](packages/tokens/README.md), generated Light/Dark themes and local validation. Phase 4 adds React/TypeScript packaging, Storybook, browser tests and CI tooling; production components remain unimplemented. This repository is not an installable component library.

## Source of truth

[Figma Product Design System](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=5-2) is the visual source of truth. The [approved Phase 1 plan](docs/phase-1-implementation-plan.md) records the audit baseline. The current Phase 2 instructions confirm Geist as the intended primary typeface; they do not establish that the Figma migration or accessibility fixes have been applied.

Changes to visual decisions must originate in Figma and be recorded with source IDs and review context. Do not silently reinterpret contradictory sources.

## Architecture

| Area | Responsibility | Current status |
|---|---|---|
| Foundations | Color, typography, spacing/layout, radius, borders, effects, motion and icons | [Documentation area](docs/foundations/README.md); [token extraction implemented](packages/tokens/README.md) |
| Components | Reusable controls and compositions | [Documentation area](docs/components/README.md); no implementation |
| Complex Components | Tables, date pickers, filters, search, command menus, upload, editors and charts | [Inventory scope](docs/complex-components/README.md); deferred |
| Patterns | Repeated interaction and composition guidance | [Reserved area](docs/patterns/README.md) |
| Templates | Page compositions built from the system | [Reserved area](docs/templates/README.md) |
| Accessibility | Design guidance and runtime requirements | [Overview](docs/accessibility/overview.md); no conformance claim |
| Documentation | Usage, source mapping, constraints and decisions | [Index](docs/README.md) |
| QA | Future visual, behavior and accessibility verification | [QA foundation](docs/qa.md); token and browser fixture tests configured |

Planned flow: Figma → extracted tokens → generated developer outputs → React components → Storybook → verified reusable packages. GitHub will track source and change history.

## Repository structure

- `packages/tokens/`: raw Figma snapshots, normalized DTCG tokens, conversion/validation scripts and generated Light/Dark outputs.
- `packages/react/`: library build, scoped token CSS, declarations and browser test infrastructure; component folders remain reserved.
- `apps/storybook/`: React/Vite configuration, theme toolbar, accessibility checks and QA tooling fixture.
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
- **Package installation:** command pending package scope, build and publication; no installable package exists.
- **First component group:** Button, Input, Checkbox, Radio and Switch, reserved only; implementation belongs to Phase 5.
- **Current implemented stage:** Phase 4 tooling. Phase 5 production components require separate approval.

## Contributing and releases

Read [CONTRIBUTING.md](CONTRIBUTING.md), [CHANGELOG.md](CHANGELOG.md) and [versioning guidance](.changeset/README.md). Version 0.1.0 identifies the repository foundation, not a published library release. No 1.0.0 release is planned in this phase.

## License

Distribution license pending owner decision; package manifests use `UNLICENSED` and `private: true`. The [LICENSE](LICENSE) file is a clearly marked placeholder, not an open-source grant. Third-party assets retain their own terms.
