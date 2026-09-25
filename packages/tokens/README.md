# Design tokens

Private package `@product-design-system/tokens`, version **0.2.0**. No package publication, React components, or Storybook setup is included.

Figma → raw snapshot → normalized DTCG token files → Light/Dark themes → CSS and structured data → validation.

## Source and inventory

The [current Figma system](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=5-2) is the visual source of truth. The [Phase 1 audit](../../docs/phase-1-implementation-plan.md) is the baseline, not a substitute for current values.

The read-only snapshot contains **292 variables**, compared with **287** in the audit, plus **16 text styles** and **14 effect styles**. Spacing increased from 40 to 45; all other collection counts match:

| Collection | Variables | Modes |
|---|---:|---|
| Color / Primitives | 60 | Default |
| Color / Semantic | 109 | Light, Dark |
| Color / Chart | 8 | Light, Dark |
| Typography | 52 | Default |
| Spacing | 45 | Default |
| Radius | 9 | Default |
| Border | 4 | Default |
| Motion | 5 | Default |

The five additions already exist in Figma; they are not additions to the global spacing scale:

| Source ID | Name within Spacing | px |
|---|---|---:|
| VariableID:323:1352 | Component / Input / Padding / Small / Vertical | 6 |
| VariableID:323:1353 | Component / Input / Padding / Small / Horizontal | 10 |
| VariableID:323:1354 | Component / Input / Padding / Medium / Vertical | 10 |
| VariableID:323:1355 | Component / Textarea / Padding / Small / Horizontal | 10 |
| VariableID:323:1356 | Component / Textarea / Padding / Medium / Vertical | 10 |

## Layout

- `figma/`: unnormalized, bounded raw API snapshots, source metadata and SHA256 manifest.
- `src/`: normalized token documents grouped into primitives, semantic, typography, spacing, radius, border, effects, motion and charts.
- `src/themes/{light,dark}/theme.json`: composition manifests referencing shared foundations and mode-specific color documents. These manifests are package metadata, not DTCG token documents.
- `scripts/`: dependency-free conversion, validation, regression tests and read-only Figma export recipe.
- `dist/`: generated CSS, DTCG theme JSON, typed JavaScript data, source mapping and validation report.

All source variables appear once per theme. The 16 text styles and 14 effect styles add 30 tokens, for **322 tokens per theme**. CSS expands typography properties and blur functions into **391 custom properties per theme**.

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

The current expected inventory is deliberately fixed at 292, not forced back to 287. A later source-count change requires inventory review and a converter update. Regression tests exercise failure cases and mode-ID changes.

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
