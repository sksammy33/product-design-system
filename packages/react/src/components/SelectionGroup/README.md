# Checkbox Group and Radio Group

Canonical read-only sources: [Checkbox Group 450:1704](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=450-1704) and [Radio Group 159:10381](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=159-10381).

Both render a fieldset/legend and reuse the existing Checkbox or Radio. Supply `label`, `options` (unique nonempty values and text labels), and optionally `name`, `helperText`, `error`/`errorText`, `disabled`, `form`, and `layout="vertical" | "horizontal"`. Options can include helper text and disabled state. Label-to-options, option-to-option and helper gaps are 12px. Horizontal options wrap at narrow widths.

CheckboxGroup uses string arrays; RadioGroup uses a string. Both support uncontrolled `defaultValue` or controlled `value` with `onValueChange`. Reset returns uncontrolled values to defaults. Native checked inputs participate in FormData; disabled options are omitted. RadioGroup supports native required validation. CheckboxGroup does not apply native required to every checkbox: applications validate minimum/maximum counts and supply the group error.

Space toggles a focused checkbox; browser radio arrow navigation selects one enabled value and skips disabled options. Group support text is associated with the group and each option. If no name is supplied, a stable generated name isolates the group.

Typography, colors and spacing use committed tokens. No aborted Selection-preflight variables are referenced or synchronized.
