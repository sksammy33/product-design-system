# Phase 2 repository foundation

Version 0.1.0 · 24 September 2026

The local repository foundation is prepared. GitHub creation requires authenticated access; no remote is claimed by this report. Phase 3 has not started.

## Major folders

| Folder | Purpose |
|---|---|
| packages/tokens | Figma exports, future token source categories, conversion scripts and generated output |
| packages/react | Future public components, private implementation helpers and tests |
| apps/storybook | Future Storybook configuration and Foundations, Components, Accessibility and QA stories |
| docs | System architecture, usage guidance, source audit, decisions and accessibility requirements |
| assets | Custom icons and brand assets with provenance; Lucide normally comes from its package |
| .github/workflows | Future validation pipeline documentation |
| .changeset | Semantic versioning and future release workflow guidance |

## Decisions still required

- Select a distribution license before sharing as an open-source package.
- Confirm future package registry scope and publication access before releases.
- Approve exact semantic color and interactive-border corrections in Figma.
- Reconcile canonical component sources and complete the intended Geist migration.
- Approve any missing component token additions or responsive specifications based on source evidence.

Geist is accepted as the intended primary typeface. This does not assert that every Figma component has been migrated.

## Verification scope

This foundation contains documentation, four private package manifests, ignore rules, and empty-directory preservation only. No React code, stories, token values, dependencies, or CI workflows are introduced. The preserved Phase 1 audit includes historical observations; those are not converted token source files.

Check local links, workspace manifests, the required directory inventory, and the absence of implementation files before committing. Runtime accessibility, component and browser tests are not applicable yet and have not run.

## Phase 3

After explicit approval, capture the approved Figma variables and styles, preserve names, aliases and modes, map them into developer token files, and validate source traceability. Identify missing values or conflicting sources for design review rather than guessing. Component implementation remains deferred.

## Repository tree

```text
product-design-system/
  .changeset/
    README.md
  .github/
    workflows/
      README.md
  apps/
    storybook/
      .storybook/
        README.md
      stories/
        accessibility/
          README.md
        components/
          README.md
        foundations/
          README.md
        qa/
          README.md
      README.md
      package.json
  assets/
    README.md
  docs/
    accessibility/
      color-contrast.md
      focus.md
      forms.md
      keyboard.md
      motion.md
      overview.md
      responsive-reflow.md
      runtime-checklist.md
      target-size.md
    complex-components/
      README.md
    components/
      README.md
    decisions/
      001-typography.md
      002-semantic-color-accessibility.md
      003-interactive-borders.md
      004-canonical-sources.md
      005-component-token-policy.md
      006-figma-source-of-truth.md
      README.md
    foundations/
      README.md
    patterns/
      README.md
    templates/
      README.md
    README.md
    phase-1-implementation-plan.md
    qa.md
    repository-foundation.md
  packages/
    react/
      src/
        components/
          Button/
            README.md
          Checkbox/
            README.md
          Input/
            README.md
          Radio/
            README.md
          Switch/
            README.md
          README.md
        internal/
          README.md
      tests/
        README.md
      README.md
      package.json
    tokens/
      dist/
        .gitkeep
      figma/
        README.md
      scripts/
        README.md
      src/
        borders/
          README.md
        chart-colors/
          README.md
        effects/
          README.md
        motion/
          README.md
        primitives/
          README.md
        radius/
          README.md
        semantic/
          README.md
        spacing/
          README.md
        themes/
          dark/
            README.md
          light/
            README.md
        typography/
          README.md
        README.md
      README.md
      package.json
  .gitignore
  CHANGELOG.md
  CONTRIBUTING.md
  LICENSE
  README.md
  package.json
```

## File inventory

Each token category README reserves its area without defining values. Each component README reserves its area without implementing it. The full file list follows.

```text
.changeset/README.md
.github/workflows/README.md
.gitignore
CHANGELOG.md
CONTRIBUTING.md
LICENSE
README.md
apps/storybook/.storybook/README.md
apps/storybook/README.md
apps/storybook/package.json
apps/storybook/stories/accessibility/README.md
apps/storybook/stories/components/README.md
apps/storybook/stories/foundations/README.md
apps/storybook/stories/qa/README.md
assets/README.md
docs/README.md
docs/accessibility/color-contrast.md
docs/accessibility/focus.md
docs/accessibility/forms.md
docs/accessibility/keyboard.md
docs/accessibility/motion.md
docs/accessibility/overview.md
docs/accessibility/responsive-reflow.md
docs/accessibility/runtime-checklist.md
docs/accessibility/target-size.md
docs/complex-components/README.md
docs/components/README.md
docs/decisions/001-typography.md
docs/decisions/002-semantic-color-accessibility.md
docs/decisions/003-interactive-borders.md
docs/decisions/004-canonical-sources.md
docs/decisions/005-component-token-policy.md
docs/decisions/006-figma-source-of-truth.md
docs/decisions/README.md
docs/foundations/README.md
docs/patterns/README.md
docs/phase-1-implementation-plan.md
docs/qa.md
docs/repository-foundation.md
docs/templates/README.md
package.json
packages/react/README.md
packages/react/package.json
packages/react/src/components/Button/README.md
packages/react/src/components/Checkbox/README.md
packages/react/src/components/Input/README.md
packages/react/src/components/README.md
packages/react/src/components/Radio/README.md
packages/react/src/components/Switch/README.md
packages/react/src/internal/README.md
packages/react/tests/README.md
packages/tokens/README.md
packages/tokens/dist/.gitkeep
packages/tokens/figma/README.md
packages/tokens/package.json
packages/tokens/scripts/README.md
packages/tokens/src/README.md
packages/tokens/src/borders/README.md
packages/tokens/src/chart-colors/README.md
packages/tokens/src/effects/README.md
packages/tokens/src/motion/README.md
packages/tokens/src/primitives/README.md
packages/tokens/src/radius/README.md
packages/tokens/src/semantic/README.md
packages/tokens/src/spacing/README.md
packages/tokens/src/themes/dark/README.md
packages/tokens/src/themes/light/README.md
packages/tokens/src/typography/README.md
```
