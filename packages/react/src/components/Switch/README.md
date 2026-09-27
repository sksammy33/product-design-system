# Switch

Native checkbox form behavior with switch semantics from Figma set [159:9972](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=159-9972). Sizes are `small`, `medium`, and `large`; values are Off and On; states are default, hover, focus and disabled.

`label` is required even when `showLabel={false}`, preserving the accessible name. Native checkbox props such as `name`, `checked`, `defaultChecked`, `onChange` and `disabled` pass through. The label activates the switch, and Space toggles it.

Tracks are 28×16, 36×20 and 44×24px; thumbs are 12, 16 and 20px with a 2px inset. Those measured dimensions and the approved 0 1px 2px black/15% thumb shadow remain local CSS. Approved implementation overrides make all labels Label / Default, all tracks Radius / Full, and show the 2px Border / Focus treatment on Small Off Focus. No transition is added because the source set specifies none.
