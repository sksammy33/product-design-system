# Product Design System — Phase 1 audit and implementation plan

Prepared for Samarth Kale · 24 September 2026

Source: [Product Design System in Figma](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=5-2)

## Decision

The file is substantial enough to plan implementation, but it is not yet an unambiguous production specification. Start with source reconciliation and token mapping, then build only Button, Input, Checkbox, Radio and Switch. Resolve the issues below before declaring that group stable.

No Figma nodes or tokens were edited. No React library, GitHub repository, Storybook deployment or package was created in this phase.

## What was inspected, and limits

Inspected all 41 page inventories, eight variable collections, all 287 variable definitions including aliases and modes, 16 local text styles, 14 local effect styles, component sets and their exposed variants, template structures and accessibility guidance. Traced main-component references for Buttons and Navigation because the page trees contain documentation/instances rather than their source sets. Examined detailed geometry and bindings for the first five controls, and visually reviewed the Button documentation, Input size matrix and Selection documentation.

This is a file-wide implementation inventory with deeper checks on the first group. It is not an exhaustive pixel audit of every variant, a full dependency graph, a browser test, or an accessibility certification. Some large API results were truncated; bounded replacement reads recovered the relevant inventories. Each component still needs its own full specification extraction and rendered comparison before implementation acceptance.

The file has Foundations, Components, Complex Components, Templates and Accessibility sections, plus Overview and Notes. Documentation is embedded throughout. No dedicated pages named Patterns, Documentation, or Playground & QA were found. Forms demonstrate composition patterns; this does not establish that all intended pattern/QA material is present.

## 1. Existing foundations

| Source collection | Variables | Modes | Implementation treatment |
|---|---:|---|---|
| Color / Primitives | 60 | Default | Preserve palette, alpha and original identifiers |
| Color / Semantic | 109 | Light, Dark | Preserve functional names and aliases |
| Color / Chart | 8 | Light, Dark | Theme together with semantic colors |
| Typography | 52 | Default | Sizes, line heights, tracking and weights |
| Spacing | 40 | Default | 15 base values plus 25 usage aliases |
| Radius | 9 | Default | 0, 2, 4, 6, 8, 12, 16, 24, 9999 |
| Border | 4 | Default | Widths 0, 1, 2, 3 |
| Motion | 5 | Default | Raw numbers 0, 100, 200, 300, 500; confirm milliseconds in export mapping |

Color families include Purple, Gray, Green, Red, Blue, Amber and Orange, plus Transparent. Semantic groups include Text, Background, Surface, Layer, Border, Icon, Action, Status, Support, Field, Focus and Disabled. Keep these distinctions unless a deliberate design decision changes them.

Spacing base values are 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 and 128. Aliases describe Inline, Stack, Inset, Section and Layout spacing. Use the functional alias when its documented purpose matches the component; identical numeric values alone do not prove semantic equivalence.

The 16 text styles use Geist: Display 56/64, 48/56, 40/48; headings 32/40, 28/36, 24/32, 20/28, 18/24, 16/24; body 18/28, 16/24, 14/20; labels 16/20, 14/18, 12/16; caption 12/16. These pairs mean font size / line height in Figma pixels. Tracking units are pixels in the inspected styles.

Shadow and blur exist as **effect styles**, not the documented Elevation/Blur variable collections. There are nine shadow styles and five blur styles. Export these separately with their source style IDs. Background blur needs a backdrop-filter mapping, not a foreground blur.

Lucide is the documented icon source: 16, 20 and 24px sizes, round joins/caps and a documented 2px stroke. The icon page contains 1,509 component nodes. Verify exact icon geometry and scaling before substituting package icons.

## 2. Issues to resolve before the first release

| Priority | Evidence | Consequence and proposed action |
|---|---|---|
| Blocker | Primary Medium Hover 78:1056 binds its fill to Action / Primary / Hover and its 14px Geist label to Action / Primary / Contrast | In Dark mode the colors resolve to Purple 400 (#A78BFA) and white: **2.72:1**, below the 4.5:1 normal-text requirement. Propose a darker existing purple hover value or an explicitly approved foreground pairing. Do not change it silently. |
| Blocker | Input field 102:3196 and unchecked Checkbox/Radio use Border / Default against Background/Surface / Default | Light border #E5E7EB on white is **1.24:1**; dark border #374151 on #111827 is **1.72:1**. Where this boundary identifies the control, review against the 3:1 non-text criterion. Propose binding interactive boundaries to an appropriate existing stronger token, while retaining subtle decorative borders. |
| Decision | Typography styles and sampled Button labels use Geist; sampled Input, Checkbox, Radio and Switch labels use Inter | Decide whether Inter is intentional or a migration is unfinished. Recommended: confirm Geist as the intended family, then review reflow and component metrics before a coordinated design/code migration. Until approved, retain the mismatch in the specification. |
| Decision | Checkbox sets 107:4018 / 159:9805; Radio 107:4084 / 159:9906; Switch 107:4181 / 159:9972 | Both generations are referenced on the Selection page. Do not pick the highest ID as “latest.” Compare complete states and template usage, then record one canonical source per component. Forms and Data Display also contain duplicates. |
| Source risk | Button source 78:1026 is reachable through instances, has 305 variants, and is returned with no page parent | Preserve its ID and snapshot. Verify the canonical source is maintainable and published/reachable for handoff; absence of a parent in this API is not proof it was deleted. |
| Token gap | Small Input field padding is 6px vertical and 10px horizontal; the Spacing collection contains neither value | Exact fidelity and “existing tokens only” conflict here. Proposed: approve component-specific tokens retaining these exact values, or change the design deliberately. Do not round to 4/8/12. Button 28px/56px heights similarly are not base Space tokens. |
| Ambiguity | Action / Primary / Pressed and Active differ in Dark; Destructive and Danger hover aliases also differ | Map actual component bindings, not name guesses. Primary Pressed currently uses Purple 600 in Dark; Active uses Purple 300. White on Active would be **1.85:1**, but this is a candidate token pairing, not a verified rendered button state. |
| Runtime decision | Primary Medium Default is 76px wide; Loading is 48px wide, with label hidden | Decide whether the loading transition should shrink or preserve width. Recommended: stable width and an accessible retained name. Width preservation is a design behavior decision, not an automatic “fix.” |
| Accessibility review | Checkbox/Radio control wrappers are 20px high; Small Switch track is 28×16 | Measure actual clickable label area and spacing in code. A small glyph alone does not prove WCAG failure. Support 24×24 target size or applicable exceptions; avoid overlapping expanded targets. |
| Documentation | Keyboard page combines SPACE / ENTER for checkbox/radio and says focus cannot be cyclical | Specify control-specific behavior. Checkbox uses Space; radio groups need arrow-key navigation. Modal focus containment is intentional while open, with an exit and focus restoration. |
| Coverage | Charts are 24 visual frames, not local component sets; List Page currently contains a Search Form | Treat these as references with future behavior work, not finished production widgets/templates. Do not infer sorting, pagination, filtering or chart interaction from a page title. |

Contrast calculations use the extracted opaque sRGB primitive values, resolve aliases by mode, and apply the WCAG relative-luminance formula. These are targeted checks, not a full palette or product audit. Disabled controls have relevant contrast exemptions; they were not treated as ordinary enabled text.

The Selection documentation screenshot also shows clipped/overflowing examples. That affects documentation usability; it is not itself proof that every underlying component has the same clipping.

## 3. Component hierarchy and runtime responsibilities

A **primitive** is a small building block. A **composed component** combines building blocks. **Runtime behavior** is what the browser must do when someone interacts; even primitives can require it.

| Layer | Existing examples | Proposed implementation responsibility |
|---|---|---|
| Tokens and assets | Palette, semantic roles, spacing, type, radius, effects, motion, Lucide | CSS variables, typed token data, assets and traceability |
| Primitives | Button, Input control, Checkbox, Radio, Switch; later Textarea, Badge, Divider, Spinner | Native semantics, focus, names, state, form participation |
| Shared composition | Label/helper/error parts, Form Field/Group/Row/Section/Actions, selection groups, Avatar Group | Consistent associations, spacing and grouping; shared internals are not extra first-release public components |
| Interactive composition | Select, Combobox, Tabs, Menu, Tooltip, Popover, Dialog, Drawer, Bottom Sheet, Tree | Focus movement, dismissal, positioning, selection and announcements |
| Complex widgets | Data Table, Date Picker, Filters, Search, Command Menu, Upload, Editor, Charts | Explicit data/state contracts and specialist runtime behavior |
| Patterns and templates | Dashboard desktop/mobile; profile, shipping, settings, login and registration forms | Example compositions; keep product business logic outside the core package |

Future dependencies: Form Field builds on Input/Textarea and associated text; Select/Combobox build on field/trigger, popup and options; Dialog builds on overlay/focus management and actions; Date Picker combines field, calendar cells and popup/mobile surface; Data Table combines cells/rows, selection and optional navigation/filter controls. These are implementation proposals informed by the inventory, not a claim that every Figma instance already follows that graph.

Do not bundle table engines, editor engines or chart engines into the first five controls. Select them only when those groups enter scope.

## 4. First group: exact scope and state contract

| Component | Source and observed coverage | Implementation plan |
|---|---|---|
| Button | 78:1026: **305** variants. Nine visual variants × five sizes; seven states except Link/Destructive Link omit Selected | Native button for actions. Navigation links need anchor semantics. Browser supplies hover/focus/pressed; props supply disabled/loading and meaningful selected behavior. Do not add Selected to Link simply to complete a Cartesian matrix. |
| Input | 102:3190: **27** variants = Small/Medium/Large × nine states | Match 32/40/48px field heights, not total labeled wrapper heights. Support labels, helper text, prefix/suffix, optional icons and clear affordance. Field itself is an input; wrapper carries composition. |
| Checkbox | 15 variants per duplicate set = Unchecked/Checked/Indeterminate × Default/Hover/Focus/Disabled/Error | Prefer native checkbox with label, form name/value and an indeterminate property. Space toggles; mixed visual state must be exposed accessibly. |
| Radio | 10 variants per duplicate set = Unselected/Selected × five states | Native radios with shared group name; single selection, arrow navigation, Space and labeled grouping. Group semantics are required even if the public RadioGroup component is deferred. |
| Switch | 24 variants per duplicate set = three sizes × Off/On × Default/Hover/Focus/Disabled | Binary state, stable accessible label and switch semantics. Space toggles. No mixed state or invented Error variant. |

Button visual variants: Primary, Secondary, Tertiary, Ghost, Destructive, Destructive Secondary, Link, Destructive Ghost, Destructive Link. Sizes XS/Small/Medium/Large/XL use documented heights 28/32/40/48/56px.

Input states: Default, Hover, Focus, Filled, Disabled, Read Only, Error, Warning, Success. It exposes label/placeholder/value/helper/prefix/suffix text and visibility controls for labels, required/optional indicators, icons, prefix/suffix and clear.

The Figma State dropdown is not a suitable single React state prop. An input can be filled, focused and invalid simultaneously. Define independent input value, validation status, readOnly and disabled state; use browser pseudo-classes for interaction. Document precedence and review any missing combined-state visuals instead of inventing them.

For every first-group control, capture all observed source variants in a mapping manifest; document unsupported combinations; add stories for sizes, variants, state interactions, Light/Dark, long labels, label-hidden usage, keyboard and form behavior.

## 5. Token architecture

Use a DTCG-compatible JSON representation as the developer source and generate CSS custom properties. Keep the raw Figma snapshot alongside it for traceability. A token is a named design decision; an alias points to another named decision so one source change can flow through the system.

Proposed layers:

1. Primitive values from Figma, unchanged.
2. Existing semantic names and aliases, preserved.
3. Component recipes referring to existing tokens. Introduce missing component tokens only through an explicit reviewed decision.

Example mapping proposal:

| Figma source | Developer path | CSS proposal |
|---|---|---|
| Color / Primitives → Purple / 600 | color.primitives.purple.600 | --color-primitives-purple-600 |
| Color / Semantic → Action / Primary / Default | color.semantic.action.primary.default | --color-semantic-action-primary-default |
| Spacing → Spacing / Inline / SM | spacing.inline.sm | --spacing-inline-sm |
| Border → Border / Default | border.width.default | --border-width-default |
| Color / Semantic → Border / Default | color.semantic.border.default | --color-semantic-border-default |

The two Border / Default tokens have different types. Collection-qualified paths prevent a destructive naming collision. Keep original collection/name/ID in metadata; detect every normalized-name collision rather than overwriting it.

Exporter validation must check missing aliases, cycles, type mismatches, missing modes, duplicate normalized names and preservation of source counts. Maintain aliases, alpha, effect ordering and typography tracking units. Do not infer “px” for every FLOAT: weights are unitless, duration needs a duration unit, and dimensions have length units.

Light/Dark must switch semantic and chart outputs together by **mode name**, because their Figma mode IDs differ. A single-mode spacing collection must not be misinterpreted as a missing Dark mode. No automatic darkening or recoloring. Theme override, system preference and server-rendered initial theme are runtime choices to document.

## 6. Responsive behavior

Observed guidance: Mobile <768px, Tablet 768–1023px, Desktop ≥1024px. The grid documents 4/6/12 columns. Examples include 375px mobile, 768px tablet and 1280px desktop grids; Dashboard uses 390px mobile and 1440px desktop frames. These sample widths are not additional breakpoints.

Forms have horizontal/vertical groups and one/two/three-column rows. Date Picker includes a Calendar Mobile composition. Navigation includes desktop/mobile, collapsed sidebar and bottom/top mobile bars.

Before each later template implementation, specify exactly when columns collapse, navigation changes, overlays become mobile surfaces and tables scroll. Auto Layout FILL is evidence of flexible intent, not a browser breakpoint algorithm.

For the first group: fit parent width where intended, retain intrinsic button sizing, handle long labels/helper text, test narrow containers and zoom without clipping focus. Do not hardcode every Input to the 280px specimen width. Reflow and text-spacing checks remain acceptance criteria.

## 7. Proposed repository architecture

A small workspace repository keeps tokens, components and the documentation app together while producing separate reusable outputs.

| Path | Purpose |
|---|---|
| README.md | What it is, status, install/use, Figma link, theme setup and quick start |
| CHANGELOG.md | Human-readable release changes |
| CONTRIBUTING.md | How to propose tokens/components, verify and submit changes |
| LICENSE | Ownership/license decision recorded before public distribution |
| packages/tokens/figma/ | Versioned raw snapshots and source manifest |
| packages/tokens/src/ | Primitive, semantic, theme, typography and effect token inputs |
| packages/tokens/scripts/ | Export normalization, validation and CSS/data generation |
| packages/tokens/dist/ | Generated package output; never hand-edited |
| packages/react/src/components/ | One folder per first-group component, styles and exports |
| packages/react/src/internal/ | Shared label/description IDs and state helpers |
| packages/react/tests/ | Meaningful behavior and form integration tests |
| apps/storybook/.storybook/ | Storybook configuration, themes and test setup |
| apps/storybook/stories/ | Foundations, Components, Accessibility and QA stories |
| docs/components/ | Source IDs, props, variants, behavior and limitations |
| docs/accessibility/ | Requirements, runtime checklist and manual test records |
| docs/decisions/ | Canonical-source, font, contrast and missing-token decisions |
| docs/patterns/ and docs/templates/ | Observed patterns and future implementation status |
| assets/ | Approved icons/fonts/brand assets and provenance |
| .github/workflows/ | Typecheck, tokens, build, tests and Storybook gates |
| .changeset/ | Proposed release notes and version increments |

React/TypeScript is the requested component stack. Prefer CSS Modules or scoped CSS using generated tokens: this preserves the visual system without introducing a competing preset theme. React stays a peer dependency of the distributable component package.

Storybook is the interactive catalogue where designers and developers inspect real components. Use its Vite-based React integration and compatible testing addons; choose and pin supported versions together during setup. Do not claim any package version was installed or tested during this audit.

GitHub is the versioned collaboration record, not a substitute for Figma. Record Figma source IDs and review dates with each change. Later releases should include type declarations, CSS exports, documented token imports and a clean consumer install test. Repository name, owner, visibility, package scope and license remain publication inputs.

## 8. Accessibility and test gates

Use semantic HTML first. For the initial group, native controls reduce the amount of keyboard and form behavior we must recreate. Figma cannot prove screen-reader behavior.

Runtime checklist:

- Every control has an accessible name; hidden visible labels do not remove the accessible name.
- Helper/error text is programmatically associated. Invalid is distinct from Warning/Success.
- Keyboard operation follows the relevant control pattern; no positive tabindex.
- Visible focus survives overflow, sticky elements, dialogs, zoom and both themes.
- Disabled controls cannot activate; read-only inputs remain distinguishable from disabled.
- Loading keeps a meaningful name and prevents unintended duplicate activation.
- Checkbox mixed state and radio-group state are exposed correctly.
- Required fields communicate more than an asterisk or color.
- Contrast is checked per actual foreground/background/state pairing in both themes.
- Hit targets satisfy the 24×24 AA rule or a documented exception; 44×44 is the enhanced AAA target criterion, not the universal AA minimum.
- Reflow, 200% text resizing, text-spacing overrides and reduced motion are tested.
- Forced-colors/high-contrast behavior is reviewed as an implementation robustness check.
- Manual screen-reader checks cover names, roles, descriptions, checked state and errors.

Automation: token validation, TypeScript, component interactions in a real browser, Storybook accessibility checks with violations configured to fail, and visual snapshots for the approved variant/theme matrix. Keep manual keyboard and screen-reader results separately. An axe pass alone is not a WCAG conformance claim.

The initial group is stable only when its canonical mappings are settled, design decisions are recorded, visual comparisons pass, keyboard/form tests pass, automated accessibility checks pass, manual checks are recorded and the built package installs in a clean sample consumer.

## 9. Ordered delivery plan

| Stage | Work | Exit condition |
|---|---|---|
| Phase 1A — this audit | Inventory, first-group checks, gaps and implementation architecture | Reviewable plan and evidence |
| Phase 1B — source reconciliation | Confirm duplicate sources, font policy, contrast corrections, missing values and combined states | Approved specification; no silent design changes |
| Phase 2 — repository | Create the workspace, README, contribution/change docs, decision log and empty package/story structure | Structure review and local checks; remote owner/visibility established |
| Phase 3 — tokens | Preserve raw source, convert aliases/styles, generate theme outputs, validate | Source counts/aliases/modes checked; no unexplained substitutions |
| Phase 4 — tooling | React/TypeScript builds, Storybook, browser/component/a11y tests, CI | Minimal fixture validates the toolchain |
| Phase 5A — Button | Complete its variant/size/state mapping and acceptance checks | Stable Button |
| Phase 5B — Input | Add accessible field composition and form behavior | Stable Input |
| Phase 5C — Checkbox | Add mixed-state and form behavior | Stable Checkbox |
| Phase 5D — Radio | Verify grouping and keyboard behavior | Stable Radio |
| Phase 5E — Switch | Verify binary semantics and sizes | Stable Switch |
| First package milestone | Combined QA, consumer install, release notes and documentation | First five stable; only then plan the next group |

No date estimate is reliable until canonical sources and design fixes are decided. Later groups should follow dependency order: remaining forms/selection, navigation/overlays, display/feedback, complex widgets, then templates.

## 10. Decisions requested from the designer

1. **Typography:** Is Geist intended for all controls, or should Input/selection retain Inter? Recommendation: Geist, with reviewed layout adjustments.
2. **Visual corrections:** Approve preparing specific before/after proposals for the dark-hover contrast, control boundaries and missing component tokens. This is not permission to silently alter the palette or spacing.
3. **Canonical duplicate sets:** Mark the intended Selection component section, or allow a fuller state-by-state comparison to produce a recommendation. Current evidence does not establish a single winner.

Repository ownership, package scope and licensing can be resolved when preparing the concrete repository; they do not block this audit.

## References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [Target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [Focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- [Checkbox interaction pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- [Radio group interaction pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [DTCG token format](https://www.designtokens.org/tr/2025.10/format/)
- [Storybook accessibility tests](https://storybook.js.org/docs/writing-tests/accessibility-testing)

The normative standards inform runtime requirements; the Figma file supplies the visual design. Neither replaces the other.

## Appendix A — inspected page map

| Page | Figma page ID | Observed content |
|---|---|---|
| Cover | 5:2 | Cover |
| Overview | 249:15292 | cover-and-overview; section-overview; section-structure; section-accessibility; section-scope; section-usage; section-principles; section-purpose |
| Note | 274:13838 | note |
| Foundations | 0:1 | Foundations |
| Colors | 245:339 | color-foundation; Background Tokens; Layer Tokens; Text Tokens; Border Tokens; Icon Tokens; Support Tokens; Field Tokens; Focus Tokens; Action Tokens |
| Typography | 245:336 | Typography Tokens |
| Spacing | 245:337 | spacing-foundation; grid-layout-foundation; grid-layout-foundation |
| Radius | 245:338 | Radius; Shadow & Blur; Border |
| Icons | 245:341 | Lucide icons and guidance |
| Components | 101:366 | Components |
| Buttons | 245:343 | Button Documentation; Social Buttons |
| Inputs | 245:344 | Input; Textarea; Input Documentation; State Matrix; Size Matrix; Content Matrix |
| Forms | 245:345 | Form Field; Form Group; Form Section; Form Row; Form Actions; Form Header; Form Footer; Forms; Components; Form Field; Form Group; Form Section; Form Row; Form Actions; Form Header; Form Footer; Forms Documentation; Section 9 |
| Selection | 245:346 | Checkbox; Radio; Switch; Select; Combobox; Checkbox Group; Radio Group; Multi Select; Selection; Selection; Selection Components |
| Navigation | 245:347 | Navigation Documentation |
| Data Display | 245:348 | Data Display sets and documentation |
| Feedback | 245:349 | Alert; Toast; Inline Message; Banner; Notification; Validation Message; Result; Feedback Documentation; Feedback Components; Feedback Documentation |
| Overlays | 245:350 | Tooltip; Overlays Components; 01 — Tooltip; 02 — Popover; 03 — Dropdown; 04 — Menu; 05 — Context Menu; 06 — Dialog; 07 — Drawer; 08 — Bottom Sheet; 09 — Command Menu; 10 — Confirmation Dialog |
| Loading | 245:351 | Linear Progress; Circular Progress; 08 — Progress; 08 — Progress; Linear Progress; Circular Progress; Spinner; Skeleton |
| Identity | 245:352 | Identity Components; 01 — Avatar; 02 — Avatar Group; 03 — Profile / Identity Card; 04 — Identity List Item; 05 — Presence Indicator; 06 — Identity Badge |
| Complex | 145:181 | Complex Components |
| Data Table | 245:353 | Table Cell; Table Row; Data Table; 06 — Table; 06 — Table |
| Date Picker | 245:354 | Date Picker Components; 01 — Date Picker; 02 — Calendar; 03 — States; 04 — Month / Year Selection; 05 — Date Range; 06 — Quick Actions; 07 — Responsive |
| Filter System | 245:355 | Filter System Components |
| Search | 245:356 | Search Components |
| Command Menu | 245:357 | Command Menu Components |
| File Upload | 245:358 | File Upload Components |
| Rich Text Editor | 245:359 | Rich Text Editor Components |
| Charts | 245:360 | Chart Components (inspired by mono charts) |
| Templates | 107:3907 | Templates |
| Dashboard | 245:368 | Dashboard Template |
| List Page | 245:369 | Search Form |
| Create & Edit | 245:371 | Profile Form; Profile Form; Profile Form; Multi-field Form; Multi-field Form; Multi-field Form |
| Settings | 245:372 | Settings Form |
| Authentication | 245:373 | Login Form; Registration Form |
| Accessibility | 110:3907 | Accessibility |
| WCAG | 245:375 | WCAG 2.2 - Level AA Support |
| Contrast | 245:376 | Accessibility — Color Contrast |
| Keyboard | 245:377 | Accessibility — Keyboard |
| Focus | 245:378 | Accessibility — Focus |
| Note | 269:13767 | note |

## Appendix B — component family inventory

Names are not unique identifiers. Multiple source IDs below are deliberately retained pending canonical-source decisions. Counts refer to observed variants per set, not separate React components.

| Page | Family / source IDs | Variants / properties |
|---|---|---|
| Buttons | Button (78:1026) | Variant: Primary, Secondary, Tertiary, Ghost, Destructive, Destructive Secondary, Link, Destructive Ghost, Destructive Link; Size: Small, Medium, Large, XS, XL; State: Default, Hover, Pressed, Focus, Disabled, Loading, Selected |
| Buttons | Icon Button (83:2413) | Variant: Primary, Secondary, Ghost, Destructive; Size: XS, Small, Medium, Large, XL; State: Default, Hover, Pressed, Focus, Disabled, Loading, Selected |
| Buttons | Split Button (83:2746) | Size: Small, Medium, Large; State: Default, Hover, Pressed, Focus, Disabled |
| Buttons | Dropdown Button (83:2819) | Size: Small, Medium, Large; State: Default, Hover, Pressed, Focus, Disabled, Open |
| Buttons | Toggle Button (83:2640) | Toggle: Off, On; Size: Small, Medium, Large; State: Default, Hover, Pressed, Focus, Disabled |
| Buttons | Close Button (83:2459) | Size: Small, Medium, Large; State: Default, Hover, Pressed, Focus, Disabled |
| Buttons | Floating Action Button (83:2925) | Type: Icon Only, Icon + Label; Size: Small, Medium, Large; State: Default, Hover, Pressed, Focus, Disabled |
| Buttons | Button Group (83:2962) | Count: 2, 3; Size: Small, Medium, Large |
| Buttons | Social Button (83:3323) | Provider: Google, Apple, Microsoft, GitHub, Facebook, LinkedIn; Size: Small, Medium, Large; State: Default, Hover, Pressed, Focus, Disabled, Loading |
| Inputs | Input (102:3190) | Size: Small, Medium, Large; State: Default, Hover, Focus, Filled, Disabled, Read Only, Error, Warning, Success |
| Inputs | Textarea (102:3668) | Size: Small, Medium, Large; State: Default, Hover, Focus, Filled, Disabled, Read Only, Error, Warning, Success |
| Forms | Form Field (105:1386, 129:22851, 102:6080) | Type: Input, Textarea; State: Default, Error, Warning, Success; Required: false, true |
| Forms | Form Group (105:1482, 129:22864, 102:6093) | Direction: Vertical, Horizontal |
| Forms | Form Section (105:1483) | Standalone composition / no variant properties exposed |
| Forms | Form Row (105:1645, 129:22872, 102:6101) | Columns: 1, 2, 3 |
| Forms | Form Actions (105:4830, 129:22882, 102:6111) | Alignment: Right, Left, Space Between, Full Width |
| Forms | Form Header (105:4831) | Standalone composition / no variant properties exposed |
| Forms | Form Footer (105:4835) | Standalone composition / no variant properties exposed |
| Selection | Checkbox (107:4018, 159:9805) | Value: Unchecked, Checked, Indeterminate; State: Default, Hover, Focus, Disabled, Error |
| Selection | Radio (107:4084, 159:9906) | Value: Unselected, Selected; State: Default, Hover, Focus, Disabled, Error |
| Selection | Switch (107:4181, 159:9972) | Size: Small, Medium, Large; Value: Off, On; State: Default, Hover, Focus, Disabled |
| Selection | Select (107:4434, 159:10069) | Size: Small, Medium, Large; State: Default, Hover, Focus, Filled, Disabled, Error, Open |
| Selection | Combobox (107:4514, 159:10301) | State: Default, Focus, Filled, Open, Disabled, Error, Loading |
| Selection | Checkbox Group (108:3997, 159:10366) | Layout: Vertical, Horizontal |
| Selection | Radio Group (108:4042, 159:10381) | Layout: Vertical, Horizontal |
| Selection | Multi Select (108:4146, 159:10396) | State: Empty, Selected, Multiple, Focus, Open, Disabled, Error |
| Navigation | Navigation Bar (140:8393) | Variant: Desktop, Mobile |
| Navigation | Tabs (140:8361) | Type: Underline, Contained |
| Navigation | Side Navigation (140:8465) | Collapsed: false, true |
| Navigation | Breadcrumbs (140:8204) | Variant: Default, With Home Icon, Collapsed |
| Navigation | Pagination (140:8262) | Size: S, M, L |
| Navigation | Stepper (140:8299) | Orientation: Horizontal, Vertical |
| Navigation | Menu Item (140:8108) | Type: Default, Destructive, Submenu, Divider; State: Default, Hover, Focus, Selected, Disabled |
| Navigation | Menu (140:8300) | Standalone composition / no variant properties exposed |
| Navigation | Mobile Navigation (140:8502) | Type: Bottom Bar, Top Bar Back, Top Bar Close |
| Data Display | Avatar (145:252, 146:30478) | Size: XS, Small, Medium, Large, XL; Type: Initials, Icon, Fallback; State: Default, Disabled |
| Data Display | Badge (145:314, 146:30549) | Variant: Neutral, Info, Success, Warning, Error, Brand; Size: Small, Medium; Content: Text Only, Icon + Text |
| Data Display | Tag (145:459, 146:30610) | Size: Small, Medium, Large; State: Default, Selected, Disabled; Removable: false, true; Leading Icon: false, true |
| Data Display | Status Indicator (145:8760, 146:30755) | Status: Neutral, Info, Success, Warning, Error; Display: Dot, Dot + Label |
| Data Display | List Item (145:8918, 146:30798) | State: Default, Hover, Selected, Focused, Disabled; Content: Simple, With Description, With Trailing Value, With Trailing Action |
| Data Display | List (145:8969, 146:30939) | Type: Default, With Dividers, Bordered |
| Data Display | Description List (145:8990, 146:30990) | Layout: Stacked, Horizontal |
| Data Display | Empty State (145:9009, 146:31011) | Type: Default, With Action, Minimal |
| Data Display | Statistic (145:9292, 146:31252) | Trend: Positive, Negative, Neutral; Icon: true, false |
| Data Display | Timeline Item (145:9431, 146:31371) | State: Completed, Current, Upcoming, Error; Last: false, true |
| Data Display | Timeline (145:9479, 146:31440) | Steps: 3, 4 |
| Data Display | Tree Item (145:9615, 146:31488) | State: Default, Selected, Disabled; Expand: Collapsed, Expanded, Leaf; Depth: 0, 1, 2 |
| Data Display | Tree View (145:9678, 146:31624) | Variant: Default, With Selection |
| Data Display | Table Cell (146:31030) | Type: Text, Header, Checkbox, Status, Action; Align: Left, Right |
| Data Display | Table Row (146:31059) | Type: Header, Body; State: Default, Hover, Selected, Disabled |
| Data Display | Data Table (146:31125) | Type: Default, Bordered |
| Data Display | Linear Progress (146:31313) | State: Default, Success, Warning, Error, Loading; Type: Determinate, Indeterminate |
| Data Display | Circular Progress (146:31354) | State: Default, Success, Warning, Error; Type: Determinate |
| Feedback | Alert (147:214, 150:5736) | Type: Info, Success, Warning, Error |
| Feedback | Toast (147:271, 150:5769) | Type: Info, Success, Warning, Error; State: Default, Loading |
| Feedback | Inline Message (147:288, 150:5826) | Type: Info, Success, Warning, Error |
| Feedback | Banner (148:5351, 150:5843) | Type: Info, Success, Warning, Error |
| Feedback | Notification (148:5375, 150:5888) | State: Unread, Read |
| Feedback | Validation Message (148:8806, 150:5980) | Type: Error, Warning, Success, Info |
| Feedback | Result (148:8847, 150:5997) | Type: Success, Error, Warning, Info, Empty |
| Feedback | Linear Progress (150:5912) | State: Default, Success, Error, Indeterminate |
| Feedback | Circular Progress (150:5937) | State: Default, Success, Error, Indeterminate |
| Feedback | Spinner (150:5962) | Size: Small, Medium, Large |
| Feedback | Skeleton (150:5972) | Type: Card |
| Overlays | Tooltip (145:8777, 160:9322) | Position: Top, Bottom, Left, Right |
| Overlays | Divider (160:5866) | Standalone composition / no variant properties exposed |
| Overlays | Menu Item (160:5910) | State: Default, Hover, Focus, Selected, Disabled, Destructive |
| Overlays | Tooltip/Bottom (160:9301) | Standalone composition / no variant properties exposed |
| Overlays | Tooltip/Left (160:9308) | Standalone composition / no variant properties exposed |
| Overlays | Tooltip/Right (160:9315) | Standalone composition / no variant properties exposed |
| Overlays | Popover (160:9415) | Position: Top |
| Overlays | Dropdown (160:9457) | State: Closed, Open |
| Overlays | Menu (160:9458) | Standalone composition / no variant properties exposed |
| Overlays | Context Menu (160:9592) | Type: Default |
| Overlays | Context Menu/With Submenu (160:9553) | Standalone composition / no variant properties exposed |
| Overlays | Dialog/Small/Default (160:9593) | Standalone composition / no variant properties exposed |
| Overlays | Dialog/Small/Loading (160:9613) | Standalone composition / no variant properties exposed |
| Overlays | Dialog/Small/Destructive (160:9639) | Standalone composition / no variant properties exposed |
| Overlays | Dialog/Medium/Default (160:9659) | Standalone composition / no variant properties exposed |
| Overlays | Dialog/Medium/Loading (160:9679) | Standalone composition / no variant properties exposed |
| Overlays | Dialog/Medium/Destructive (160:9704) | Standalone composition / no variant properties exposed |
| Overlays | Dialog/Large/Default (160:9724) | Standalone composition / no variant properties exposed |
| Overlays | Dialog/Large/Loading (160:9744) | Standalone composition / no variant properties exposed |
| Overlays | Dialog/Large/Destructive (160:9769) | Standalone composition / no variant properties exposed |
| Overlays | Drawer (160:9910) | Direction: Left, Right; Size: Small, Medium, Large |
| Overlays | Bottom Sheet (160:9956) | Size: Small, Medium, Large |
| Overlays | Command Menu (160:10010) | State: Default, Empty |
| Overlays | Confirmation Dialog (160:10067) | State: Default, Destructive, Loading |
| Loading | Linear Progress (145:9333, 148:5428) | State: Default, Success, Warning, Error, Loading; Type: Determinate, Indeterminate |
| Loading | Circular Progress (145:9362, 148:5453) | State: Default, Success, Warning, Error; Type: Determinate |
| Loading | Spinner (148:8776) | Size: Small, Medium, Large |
| Loading | Skeleton (148:8789) | Type: Card |
| Identity | Presence Indicator (168:10926) | Size: Small, Medium, Large; Status: Online, Away, Busy, Offline |
| Identity | Avatar Group (168:11017) | Size: Small, Medium, Large; Count: 2, 3, 4, 5+ |
| Identity | Identity Card (168:11037) | Variant: Compact, Standard |
| Identity | Identity List Item (168:11088) | State: Default, Hover, Selected, Focus, Disabled |
| Identity | Identity Badge (168:11109) | Size: Small, Medium; Type: Avatar, Icon, Status |
| Data Table | Table Cell (145:9038) | Type: Text, Header, Checkbox, Status, Action; Align: Left, Right |
| Data Table | Table Row (145:9104) | Type: Header, Body; State: Default, Hover, Selected, Disabled |
| Data Table | Data Table (145:9231) | Type: Default, Bordered |
| Date Picker | Date Cell (178:8554) | State: Default, Hover, Focus, Selected, Today, Disabled, In Range |
| Date Picker | Weekday Header (178:8555) | Standalone composition / no variant properties exposed |
| Date Picker | Calendar Header (178:8570) | Standalone composition / no variant properties exposed |
| Date Picker | Calendar Grid (178:11960) | Standalone composition / no variant properties exposed |
| Date Picker | Calendar (178:12036) | Standalone composition / no variant properties exposed |
| Date Picker | Month Selector (178:12136) | Standalone composition / no variant properties exposed |
| Date Picker | Year Selector (178:12173) | Standalone composition / no variant properties exposed |
| Date Picker | Calendar Range (178:12210) | Standalone composition / no variant properties exposed |
| Date Picker | Calendar Actions (178:12309) | Standalone composition / no variant properties exposed |
| Date Picker | Date Picker (178:12442) | State: Closed, Open, Selected, Disabled, Error |
| Date Picker | Calendar Mobile (178:12443) | Standalone composition / no variant properties exposed |
| Filter System | Filter Chip (183:8253) | State: Default, Hover, Disabled |
| Filter System | Filter Button (183:8274) | State: Default, Active, Disabled |
| Filter System | Filter Dropdown (183:8315) | State: Default, Open, Disabled |
| Filter System | Active Filters (183:8341) | State: Default, Empty |
| Filter System | Filter Bar (183:8434) | State: Default, Active, Disabled |
| Search | Search Input (184:8382) | State: Default, Focus, Filled, Loading, Disabled |
| Search | Search Suggestion Item (184:11777) | State: Default, Hover |
| Search | Recent Search Item (184:11790) | State: Default, Hover |
| Search | Search Result Item (184:11807) | State: Default, Hover |
| Search | Search with Suggestions (184:11808) | Standalone composition / no variant properties exposed |
| Search | Recent Searches (184:11849) | Standalone composition / no variant properties exposed |
| Search | Search Results (184:11878) | Standalone composition / no variant properties exposed |
| Search | Empty Results (184:11913) | Standalone composition / no variant properties exposed |
| Command Menu | Keyboard Shortcut (186:8447) | Standalone composition / no variant properties exposed |
| Command Menu | Command Item (186:8479) | State: Default, Selected, Disabled |
| Command Menu | Command Group (186:8480) | Standalone composition / no variant properties exposed |
| Command Menu | Command Menu (186:8754) | State: Default, Selected, Searching, Empty |
| File Upload | File Item (186:8796) | State: Default, Uploading, Success, Error |
| File Upload | Upload Area (186:8814) | State: Default, Dragging, Disabled |
| File Upload | File Upload (186:12299) | State: Default, Dragging, Uploading, Success, Error, Disabled |
| Rich Text Editor | Toolbar Button (186:12313) | State: Default, Hover, Active, Disabled |
| Rich Text Editor | Toolbar Divider (186:12314) | Standalone composition / no variant properties exposed |
| Rich Text Editor | Editor Toolbar (186:12315) | Standalone composition / no variant properties exposed |
| Rich Text Editor | Editor Area (186:12394) | Content: Placeholder, Content |
| Rich Text Editor | Character Count (186:12395) | Standalone composition / no variant properties exposed |
| Rich Text Editor | Rich Text Editor (186:12655) | State: Default, Focus, Disabled, Error |
