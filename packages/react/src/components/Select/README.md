# Select, Combobox and Multi Select

Canonical read-only sources: [Select 420:11359](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=420-11359), [Combobox 420:11613](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=420-11613), [Multi Select 420:11694](https://www.figma.com/design/A5R8vBTXZzfV5aj3omQYFG/Product-Design-System?node-id=420-11694).

All accept options with unique nonempty string values, text labels and optional disabled state. Provide a visible `label` or an accessible name through `aria-label`/`aria-labelledby`. Shared props include helperText, error/errorText, placeholder, required, disabled, name, form, onBlur and className. Controlled `value`/`onValueChange` and uncontrolled `defaultValue` are supported. Select and Combobox use strings; MultiSelect uses string arrays. Empty single selection is an empty string.

Select exposes small/medium/large fields (32/40/48px) and an optional leading icon. Combobox composes Input, searches local option labels case-insensitively, and exposes `onQueryChange`, `loading`, `loadingText` and `emptyText`. Typed text is a search query, never a submitted value; editing an existing selection clears its value until another option is chosen. Escape/blur discards an unselected query. Applications own asynchronous requests and cancellation.

MultiSelect uses the corrected Typography / Label / Small: Geist Medium 12/16 with 0.25px tracking. Tags are 20px high; the field stays 40px. Many or long tags scroll horizontally within the field. Tag removal buttons have accessible names and return focus to the trigger. Disabled options cannot be added or removed through the UI.

The combobox/listbox pattern keeps focus on the trigger or input and exposes the active option through aria-activedescendant. Arrow keys open and move through enabled options; Enter chooses; Escape dismisses without committing; Tab dismisses and continues the normal focus order. Select/MultiSelect also support Space, Home/End and text typeahead. Multiple selections stay open and toggle independently. Pointer choice, outside dismissal, clear actions, loading and empty announcements are included.

A visually hidden native select provides FormData and required constraint validation; invalid focus is redirected to the visible control. Uncontrolled form resets restore defaults; controlled values remain caller-owned. Refs target the visible button/input. Disabled fieldsets retain native disabled behavior. Keep selected values present in the options array, including when supplying asynchronously loaded options.

Figma defines closed/open field states, but these nodes do not define option panels. Internal listboxes use committed surface, border, radius, typography and spacing tokens; they are functional additions for review, not a new public Overlay or Navigation component. They render locally without portals or viewport collision handling, so use an unclipped container with room below.

Existing Lucide Search, ChevronDown, X and Loader icons match the corresponding Figma icon roles, at 16px, 16px, 14px (clear)/12px (tag removal), and 16px respectively. Forms/groups reuse the existing component icon system. No temporary Figma asset URLs are shipped.

Dimensions absent from the baseline use arithmetic on committed spacing tokens. The Figma 70% disabled opacity is local component CSS. Tag background uses semantic Surface / Default so the light white tag adapts to Dark. No token definitions, current 352-variable snapshot, or aborted 25 Selection-preflight variables are synchronized.

Browser interaction, form, geometry and Light/Dark axe coverage is in `tests/batch-a.test.tsx`. Storybook has variants and interaction stories. Automated axe coverage does not replace screen-reader review.
