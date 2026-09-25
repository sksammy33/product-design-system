# Product Design System

A shared foundation for consistent product interfaces, connecting Figma design decisions to future tokens, React components, developer documentation and quality checks.

**Version: 0.1.0 — Repository Foundation**
**Design implementation is still in progress.**

Phase 2 prepares documentation and empty workspaces. No tokens have been converted, no React components implemented, and no Storybook app or CI configured. This repository is not an installable component library.

## Source of truth

[Figma Product Design System](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=5-2) is the visual source of truth. The [approved Phase 1 plan](docs/phase-1-implementation-plan.md) records the audit baseline. The current Phase 2 instructions confirm Geist as the intended primary typeface; they do not establish that the Figma migration or accessibility fixes have been applied.

Changes to visual decisions must originate in Figma and be recorded with source IDs and review context. Do not silently reinterpret contradictory sources.

## Architecture

| Area | Responsibility | Current status |
|---|---|---|
| Foundations | Color, typography, spacing/layout, radius, borders, effects, motion and icons | [Documentation area](docs/foundations/README.md); extraction pending |
| Components | Reusable controls and compositions | [Documentation area](docs/components/README.md); no implementation |
| Complex Components | Tables, date pickers, filters, search, command menus, upload, editors and charts | [Inventory scope](docs/complex-components/README.md); deferred |
| Patterns | Repeated interaction and composition guidance | [Reserved area](docs/patterns/README.md) |
| Templates | Page compositions built from the system | [Reserved area](docs/templates/README.md) |
| Accessibility | Design guidance and runtime requirements | [Overview](docs/accessibility/overview.md); no conformance claim |
| Documentation | Usage, source mapping, constraints and decisions | [Index](docs/README.md) |
| QA | Future visual, behavior and accessibility verification | [QA plan](docs/qa.md); tests not configured |

Planned flow: Figma → extracted tokens → generated developer outputs → React components → Storybook → verified reusable packages. GitHub will track source and change history.

## Repository structure

- `packages/tokens/`: future source snapshots, token categories, conversion scripts and generated output.
- `packages/react/`: future component and internal source folders and tests.
- `apps/storybook/`: reserved configuration and story categories.
- `docs/`: foundations, components, complex components, patterns, templates, accessibility and decisions.
- `assets/`: custom assets and provenance guidance.
- `.github/workflows/`: future validation pipeline documentation.
- `.changeset/`: future release tooling guidance.

See [the full repository tree and file inventory](docs/repository-foundation.md).

## Accessibility

The Design System is created to support WCAG 2.2 Level AA requirements at the design-system level. Final conformance depends on implemented code, content, interactions and assistive-technology testing. This repository does not claim full WCAG compliance. See the [runtime checklist](docs/accessibility/runtime-checklist.md).

## Development status

The root and three workspaces have private package manifests at 0.1.0. No dependencies, build commands, test commands or exports are advertised yet. React, TypeScript, Storybook and test tooling will be configured in Phase 4. No setup/install step is needed to review this foundation.

- **Storybook:** URL pending; not built or deployed.
- **Package installation:** command pending package scope, build and publication; no installable package exists.
- **First component group:** Button, Input, Checkbox, Radio and Switch, reserved only; implementation belongs to Phase 5.
- **Next authorized stage:** none. Phase 3 requires approval.

## Contributing and releases

Read [CONTRIBUTING.md](CONTRIBUTING.md), [CHANGELOG.md](CHANGELOG.md) and [versioning guidance](.changeset/README.md). Version 0.1.0 identifies the repository foundation, not a published library release. No 1.0.0 release is planned in this phase.

## License

Distribution license pending owner decision; package manifests use `UNLICENSED` and `private: true`. The [LICENSE](LICENSE) file is a clearly marked placeholder, not an open-source grant. Third-party assets retain their own terms.
