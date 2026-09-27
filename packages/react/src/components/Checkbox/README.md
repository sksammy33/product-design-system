# Checkbox

Native checkbox from Figma set [159:9805](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=159-9805). Values are unchecked, checked and indeterminate. Visual states are default, hover, focus, disabled and error.

`label` is required. Native checkbox props such as `name`, `value`, `checked`, `defaultChecked`, `onChange` and `disabled` pass through. `indeterminate` sets the native mixed state; `helperText` and `errorText` are associated descriptions. Set `error` with `errorText` to provide a non-color error message. The full label activates the control. Space toggles it.

The 24px target contains a 16px indicator and a 12px Lucide check/minus. Figma's excluded Selection-preflight geometry variables are intentionally absent from the token package; these measured dimensions and the 1.5px outline are local CSS. Colors, typography, radius, gaps, focus and disabled opacity use approved tokens. Disabled and Error marks use Icon / Default as approved for implementation.
