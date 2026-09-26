# Textarea

Native multiline form control based on the [current Figma Textarea set](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=102-3668) on the Inputs page. Import `Textarea` from `@product-design-system/react` and the package stylesheet once.

`size` is `small`, `medium` (default), or `large` with approved field heights 80/100/120px. Use `label` or a native accessible name. `helperText` and `validationMessage` are associated with the textarea; `validation="error"` sets `aria-invalid`, while Warning and Success retain their semantic borders and messages. Native `disabled`, `readOnly`, `required`, value and change handling remain available. The Figma source does not define icons, prefix/suffix or a clear action for Textarea.

Styles use generated semantic colors, typography, field height/padding/gap, border/radius, focus effect and 0.6 disabled-control opacity tokens. The 280px specimen width is layout-derived. Light/Dark modes follow `data-theme` on an ancestor. See Storybook `Components/Textarea` for sizes, states, labels, themes and narrow content.

Automated axe checks do not establish full WCAG conformance. Manually review keyboard editing, screen readers, focus, validation announcements and zoom/reflow.
