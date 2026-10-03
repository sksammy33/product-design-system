# Overlay primitives

`Divider`, `MenuItem`, `Tooltip`, `Popover`, `Menu`, `Dropdown` and `ContextMenu` implement the approved Overlay sources. Overlay `MenuItem` uses source `160:5910` and is separate from the Navigation-specific `NavigationMenuItem`.

`Divider` is a horizontal separator. `MenuItem` supports selected, destructive, disabled and submenu states; disabled items do not activate. `Menu` accepts `MenuEntry` items, labels and separators, with keyboard navigation, typeahead and nested submenu behavior. `Dropdown` composes that menu under a labelled trigger; `ContextMenu` opens from a context click or Shift+F10/Menu key. Both restore focus to their triggers when closed by menu actions or Escape.

`Tooltip` is a noninteractive description associated with its trigger via `aria-describedby`. It supports top, bottom, left and right positions and dismisses on Escape. `Popover` is a nonmodal dialog with an internal trigger, accessible title, optional description and optional Apply/Cancel footer. It closes on Escape or outside interaction. Overlay stories and React/Storybook browser tests cover interaction and axe checks.

The modal surfaces—`Dialog`, `ConfirmationDialog`, `Drawer` and `BottomSheet`—have their own [family documentation](../Modal/README.md). They use native modal dialogs for focus containment and background blocking. See [overlay assets](assets/README.md) for the local arrow artwork; that file does not describe component behavior.
