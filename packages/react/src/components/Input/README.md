# Input

Native single-line form control based on the [current Figma Input set](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=102-3190) on the Inputs page. Import `Input` from `@product-design-system/react` and the package stylesheet once.

`size` is `small`, `medium` (default), or `large` (32/40/48px field heights). Native `type` supports the documented text, email, password, search, number, URL and telephone examples. Use `label` or supply a native accessible name; `helperText` and `validationMessage` are associated through `aria-describedby`. `validation` is `error`, `warning`, or `success`; Error sets `aria-invalid`. Hover, focus and filled state follow browser interaction and value, not a visual `state` prop. `required`, `disabled`, and `readOnly` retain native form behavior. `optional` displays the source marker when a field is not required.

`leadingIcon` and `trailingIcon` are decorative React nodes. `prefix` and `suffix` are text units included in the accessible description. `clearable` requires an `onClear` callback; uncontrolled fields clear internally, while controlled owners update `value` in that callback. The clear control is a native, named, non-submit button and is hidden when empty, disabled, or read-only. Its visible icon follows Figma at 16px (Small/Medium) or 20px (Large); the invisible hit area is at least the approved 24px space token, a deliberate accessibility difference from Figma's 16/20px frame.

CSS consumes generated semantic colors, body/label/caption styles, field height/padding/gap, border/radius, focus effect and 0.6 disabled-control opacity tokens. The 280px Figma specimen width remains layout-derived. Set `data-theme="light"` or `data-theme="dark"` on an ancestor. See Storybook `Components/Input` for controls, states, labels, adornments, clear action, themes and narrow layout.

Automated axe checks pass for the rendered stories, including the inactive field grouping. They do not establish full WCAG conformance. Manually review keyboard focus, screen readers, validation announcements, zoom/reflow and product-specific form behavior.
