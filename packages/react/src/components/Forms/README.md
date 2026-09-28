# Forms — Batch A

Read-only Figma sources: [Form Field 105:1386](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=105-1386), [Form Group 105:1482](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=105-1482), [Form Section 105:1483](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=105-1483), [Form Row 105:1645](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=105-1645), [Form Actions 105:4830](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=105-4830), [Form Header 105:4831](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=105-4831), [Form Footer 105:4835](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=105-4835).

- FormField delegates to Input (default) or Textarea (`control="textarea"`). Their props, validation states, required/optional indicators, native attributes and refs remain available.
- FormGroup supports vertical/horizontal direction with 16px gaps. FormRow supports 1/2/3 equal columns and 16px gaps. Width follows the parent. At a viewport width of 480px or less, horizontal groups and rows stack.
- FormSection renders a named section with an H5 visual heading (18/24), optional description, divider and children. FormHeader uses H3 typography (24/32), an 8px gap and 24px bottom padding. Both expose `headingLevel` to fit the document outline.
- FormActions supports right, left, space-between and full-width alignment. Pass `primaryAction` and `secondaryAction` Button props, or explicit children. Generated primary actions default to submit and medium size; secondary actions default to button. Full-width places the primary first, then the ghost secondary.
- FormFooter has 16px top padding, a divider, a 12px gap and caption text. Content is supplied by the application.

Wrap compositions in a native form and handle its submit event. Form wrappers do not invent validation rules, network submission or success messages. Labels and validation descriptions stay attached to native Input/Textarea controls.

All styles use the committed token package. Load Geist 400, 500 and 600 for visual fidelity. Storybook and browser tests load these weights locally. No Figma snapshots or token definitions are changed.
