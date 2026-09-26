# Design tokens

Private package `@product-design-system/tokens`, version **0.2.0**. No package publication, React components, or Storybook setup is included.

Figma → raw snapshot → normalized DTCG token files → Light/Dark themes → CSS and structured data → validation.

## Source and inventory

The [current Figma system](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=5-2) is the visual source of truth. The [Phase 1 audit](../../docs/phase-1-implementation-plan.md) is the baseline, not a substitute for current values.

The refreshed read-only snapshot contains **317 variables**, compared with **316** in the previous snapshot and **287** in the audit, plus **16 text styles** and **14 effect styles**. This refresh adds the Opacity collection with one variable; all eight existing collections are unchanged:

| Collection | Variables | Modes |
|---|---:|---|
| Color / Primitives | 60 | Default |
| Color / Semantic | 109 | Light, Dark |
| Color / Chart | 8 | Light, Dark |
| Typography | 52 | Default |
| Spacing | 69 | Default |
| Radius | 9 | Default |
| Border | 4 | Default |
| Motion | 5 | Default |
| Opacity | 1 | Default |

The five earlier Input/Textarea additions remain unchanged; they are not additions to the global spacing scale:

| Source ID | Name within Spacing | px |
|---|---|---:|
| VariableID:323:1352 | Component / Input / Padding / Small / Vertical | 6 |
| VariableID:323:1353 | Component / Input / Padding / Small / Horizontal | 10 |
| VariableID:323:1354 | Component / Input / Padding / Medium / Vertical | 10 |
| VariableID:323:1355 | Component / Textarea / Padding / Small / Horizontal | 10 |
| VariableID:323:1356 | Component / Textarea / Padding / Medium / Vertical | 10 |

The previous refresh added these five component spacing variables, which remain unchanged:

| Source ID | Name within Spacing | px |
|---|---|---:|
| VariableID:344:2171 | Component / Button / Small / Padding Y | 6 |
| VariableID:344:2172 | Component / Button / Small / Icon Gap | 6 |
| VariableID:344:10439 | Component / Button / Split / Medium / Dropdown Padding X | 10 |
| VariableID:344:10440 | Component / Button / Split / Large / Dropdown Padding X | 14 |
| VariableID:344:10441 | Component / Button Group / Segment Overlap | -1 |

All 316 previous variables, 16 text styles and 14 effect styles are unchanged, including IDs, aliases, modes and values. No global spacing or typography scale changed. The overlap is intentionally negative to collapse shared borders; validation allows this exact source-backed exception while rejecting negative padding and global spacing.

Read-only inspection of Button set `78:1026` confirmed its labels now use existing text styles: XS/Small use Label Small (12/16 Medium), Medium uses Label Default (14/18 Medium), and Large/XL use Label Large (16/20 Medium). No 13px labels remain in that set. This refresh does not modify Figma or implement components.

The previous finalized sizing refresh added 19 variables: ten literal Button dimensions and nine specialized aliases. They remain under `spacing.component.button.*`; the source collection is Spacing. XS 14px icons are intentional optical sizing. FAB Small/Medium/Large alias Button Medium/Large/XL for heights and icons. Social Small/Medium/Large provider icons alias Button Small/Large/XL icon sizes. Aliases remain references in normalized JSON and CSS.

| Source ID | Name within Spacing | Value or target |
|---|---|---|
| VariableID:351:1508 | Component / Button / XS / Height | 28px |
| VariableID:351:1509 | Component / Button / XS / Icon Size | 14px |
| VariableID:351:1510 | Component / Button / Small / Height | 32px |
| VariableID:351:1511 | Component / Button / Small / Icon Size | 16px |
| VariableID:351:1512 | Component / Button / Medium / Height | 40px |
| VariableID:351:1513 | Component / Button / Medium / Icon Size | 18px |
| VariableID:351:1514 | Component / Button / Large / Height | 48px |
| VariableID:351:1515 | Component / Button / Large / Icon Size | 20px |
| VariableID:351:1516 | Component / Button / XL / Height | 56px |
| VariableID:351:1517 | Component / Button / XL / Icon Size | 24px |
| VariableID:351:1518 | Component / Button / FAB / Small / Height | Alias: Component / Button / Medium / Height |
| VariableID:351:1519 | Component / Button / FAB / Medium / Height | Alias: Component / Button / Large / Height |
| VariableID:351:1520 | Component / Button / FAB / Large / Height | Alias: Component / Button / XL / Height |
| VariableID:351:1521 | Component / Button / FAB / Small / Icon Size | Alias: Component / Button / Medium / Icon Size |
| VariableID:351:1522 | Component / Button / FAB / Medium / Icon Size | Alias: Component / Button / Large / Icon Size |
| VariableID:351:1523 | Component / Button / FAB / Large / Icon Size | Alias: Component / Button / XL / Icon Size |
| VariableID:351:1524 | Component / Button / Social / Small / Provider Icon Size | Alias: Component / Button / Small / Icon Size |
| VariableID:351:1525 | Component / Button / Social / Medium / Provider Icon Size | Alias: Component / Button / Large / Icon Size |
| VariableID:351:1526 | Component / Button / Social / Large / Provider Icon Size | Alias: Component / Button / XL / Icon Size |

The current refresh adds only `Opacity / Disabled` (`VariableID:361:1691`, collection `VariableCollectionId:361:1690`). Figma authors this FLOAT as **50** with the `OPACITY` scope; its Default mode (`361:0`) resolves to **0.5** overall opacity. Raw JSON retains 50 unchanged. Normalized `opacity.disabled` is a DTCG `number` with value 0.5 and no unit. Its extension preserves the original value, scope and percent-to-unitless conversion metadata. Both themes emit `--opacity-disabled: 0.5`.

Read-only inspection confirmed all 45 disabled Button variants bind this variable and resolve to 0.5. This is a shared semantic token, not a Button-only token. Other authored opacity treatments (40%, 60%, 70%, and 100%) are outside this conversion and remain untouched. No component or Figma edits are included.

## Layout

- `figma/`: unnormalized, bounded raw API snapshots, source metadata and SHA256 manifest.
- `src/`: normalized token documents grouped into primitives, semantic, typography, spacing, radius, border, effects, motion, opacity and charts.
- `src/themes/{light,dark}/theme.json`: composition manifests referencing shared foundations and mode-specific color documents. These manifests are package metadata, not DTCG token documents.
- `scripts/`: dependency-free conversion, validation, regression tests and read-only Figma export recipe.
- `dist/`: generated CSS, DTCG theme JSON, typed JavaScript data, source mapping and validation report.

All source variables appear once per theme. The 16 text styles and 14 effect styles add 30 tokens, for **347 tokens per theme**. CSS expands typography properties and blur functions into **416 custom properties per theme**.

## Names, primitives and aliases

Names use collection-qualified, lowercase dot paths; whitespace inside a segment becomes a hyphen. Slashes define groups. Only a redundant leading collection name is removed. Numeric labels retain their original digits (`01` stays `01`). Original names and IDs are always retained in the source map and token extensions.

- `Color / Primitives → Purple / 600` becomes `color.primitives.purple.600`.
- `Color / Semantic → Action / Primary / Default` becomes `color.semantic.action.primary.default`.
- `Spacing → Spacing / Inline / SM` becomes `spacing.inline.sm`.
- `Spacing → Space / 8` becomes `spacing.space.8`.
- `Border → Border / Default` becomes the dimension `border.default`; the semantic color is `color.semantic.border.default`.
- Component spacing stays under `spacing.component.*`, separate from `spacing.space.*`.

Primitives supply raw palette/scale values. Semantic tokens express purpose. Use semantic tokens for their intended purpose instead of selecting a primitive by numeric equality.

DTCG aliases such as `{spacing.space.8}` remain aliases; CSS uses `var(--spacing-space-8)`. Unbound text styles retain their own source values: matching numbers do not justify inventing variable bindings.

## Units and effects

The normalized documents use [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/) types and references. Colors retain source sRGB channels and alpha without rounding. Dimensions use Figma pixels. Font weights are unitless. Motion descriptions explicitly establish milliseconds.

All 16 current text styles use Geist. Their explicit variable-font weight settings supply weights; no style-name guessing is used. Font size and tracking preserve pixel values. Typography composites express line height as the DTCG unitless ratio (source pixel line height / source font size); the original pixel quantity remains in the extension. Standalone line-height variables remain dimensions. Font files are not bundled; consumers must load Geist themselves.

Nine shadow styles become DTCG shadow arrays, including negative spread, directional offsets and inner shadows. Five blur styles remain separate dimension tokens with source effect metadata. Background blur emits a `-backdrop-filter` property; layer blur, if present and supported, emits `-filter`. The current file has four background-blur effects and one empty “Blur / None” style, mapped to a zero radius and CSS `none`. Do not apply backdrop blur as foreground blur. Original Figma-specific effect fields remain available in extensions and the raw snapshot.

## Build and verify

Requires Node.js 22 or newer. No dependency installation is needed. From the repository root:

```sh
npm run build --workspace=@product-design-system/tokens
npm run validate --workspace=@product-design-system/tokens
npm test --workspace=@product-design-system/tokens
```

On Windows with PowerShell script restrictions, use `npm.cmd`. Direct equivalents are `node packages/tokens/scripts/build.mjs`, the same command with `--check`, and `node --test packages/tokens/scripts/validation.test.mjs`.

Build reads only the checked-in raw snapshot; it does not contact or change Figma. Validate checks snapshot hashes, source counts/membership, aliases and cycles, types/values, complete mode names, duplicate normalized names, token/group collisions and CSS collisions. It also regenerates expected content in memory and compares every generated file byte-for-byte, rejecting stale or manually edited outputs. New/unsupported source units, bindings or effects fail explicitly.

The current expected inventory is deliberately fixed at 317, not forced back to 287. A later source-count change requires inventory review and a converter update. Regression tests exercise failure cases, mode-ID changes the signed Button Group overlap, and opacity scope/type/range validation. Opacity percentages must be finite numbers in 0–100 before conversion; normalized opacity must be a unitless number in 0–1, including through aliases.

## Consume

Import the combined CSS through a bundler:

```js
import '@product-design-system/tokens/tokens.css';
```

Light is the default on `:root`; set `data-theme="dark"` on the document root for Dark. Explicit `data-theme="light"` restores Light in a subtree. Both scopes include foundations and all alias declarations, so nested theme boundaries resolve against their own mode. Semantic and chart colors switch together by the names **Light** and **Dark**, never by hardcoded mode IDs. Standalone `light.css` and `dark.css` are also exported; import Light before Dark when using both.

```css
.example {
  color: var(--color-semantic-text-primary);
  background: var(--color-semantic-surface-default);
  gap: var(--spacing-inline-sm);
  border-radius: var(--radius-md);
  box-shadow: var(--effects-shadow-md);
  backdrop-filter: var(--effects-blur-md-backdrop-filter);
}
```

Structured JavaScript data and declarations are available from the package root:

```ts
import { tokens, cssVariables } from '@product-design-system/tokens';
import type { Theme, TokenName } from '@product-design-system/tokens';
const theme: Theme = 'Dark';
const name: TokenName = 'color.semantic.text.primary';
const token = tokens[theme][name]; // DTCG token; aliases stay explicit
const css = cssVariables[theme]['--color-semantic-text-primary'];
```

`dist/tokens.json` is a theme index. `light.tokens.json` and `dark.tokens.json` are self-contained DTCG documents with all alias targets included. `source-map.json` links every token back to Figma. Generated JSON uses a `$description` warning; CSS/JS/declarations use a comment.

## Updating and remaining decisions

Do not manually edit `src/**/*.json` or `dist/*`: a build replaces them, and validation rejects drift. Make visual changes in Figma, extract a fresh raw snapshot using the recipe in `figma/README.md`, review the diff/counts, refresh hashes, then regenerate and validate in one reviewed commit.

There are no unresolved token-extraction decisions in this snapshot. Figma descriptions establish component padding and Motion units; text-style fields establish typography units/weights. The original audit’s component, interaction and accessibility findings are not resolved or certified by this token conversion. Publishing remains disabled pending the existing package/license decisions.
