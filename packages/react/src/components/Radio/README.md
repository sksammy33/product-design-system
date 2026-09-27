# Radio

Native radio from Figma set [159:9906](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=159-9906). Values are unselected and selected. Visual states are default, hover, focus, disabled and error.

`name` and `label` are required. Radios with the same `name` form a native keyboard group; use a `fieldset` and `legend` when a group question needs a name. Native form props pass through. `helperText` and `errorText` are associated descriptions. The full label activates the control; Space and arrow keys retain browser behavior.

The 24px target contains a 16px ring and an 8px dot. Their measured geometry and 1.5px outline are local CSS because the old Selection-preflight bindings are unapproved. Colors, typography, focus and spacing use approved tokens.

The selected Error dot uses the current Figma `Icon / Danger` binding in both Light and Dark modes.
