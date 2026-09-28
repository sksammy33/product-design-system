# Command Menu

`CommandMenu` implements the dedicated Command Menu component set `186:8754` on page `245:357`, with its Default, Selected, Searching, and Empty states. It composes `CommandGroup` (`186:8480`), `CommandItem` (`186:8479`), and `KeyboardShortcut` (`186:8447`). The Overlay Command Menu `160:10010` is a secondary reference, not a second public component.

Pass `groups` with stable group and command IDs. Each command has a required `label` and may provide an `icon`, `shortcut` keys, search `keywords`, `disabled`, and `onSelect`. Command labels provide accessible action names; shortcut keys are visual hints. The menu filters labels and keywords case-insensitively. The search input keeps focus while Up/Down, Home/End, and Enter move and activate the selected option. Disabled commands are skipped. Search selects the first enabled result; no matches show the Empty state.

The menu renders inline by default. To use it as a modal overlay, pass controlled `open` and `onOpenChange` props. The native dialog contains focus, blocks background interaction, closes on Escape, and returns focus to the element that opened it. Give an external trigger `aria-haspopup="dialog"`, `aria-expanded`, and an `aria-controls` value matching the menu's `id` while open. `query`/`onQueryChange` and `selectedId`/`onSelectedIdChange` support controlled search and selection.

```tsx
const groups = [{ id: 'files', label: 'Files', items: [
  { id: 'new-file', label: 'New File', shortcut: ['⌘', 'N'], onSelect: createFile },
] }];
<CommandMenu groups={groups} />
```
