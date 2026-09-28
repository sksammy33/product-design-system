# Modal surfaces

`Dialog`, `ConfirmationDialog`, `Drawer`, and `BottomSheet` are controlled components. Pass `open` and `onOpenChange`; render a trigger in the parent and set `open` to `true` when it activates. The browser's native modal dialog blocks background interaction and contains keyboard focus. Closing with Escape, the close button, or the cancel button calls `onOpenChange(false)` and returns focus to the element that opened the surface.

`Dialog` supports `size="small" | "medium" | "large"` (400, 520, 640px) and `state="default" | "loading" | "destructive"`. In the loading state the confirm action, cancel action, close button, and Escape dismissal are disabled to prevent duplicate actions. Use `confirmLabel` to name a destructive action precisely, and use `onConfirm` to perform it. The parent controls when the dialog closes after confirmation.

`ConfirmationDialog` uses the same states in a 400px centered layout. Its destructive default action is named **Delete**. `Drawer` supports left or right placement at 320, 420, or 560px and scrolls its content. `BottomSheet` supports 390×280, 390×360, or 390×440px; its width shrinks on smaller viewports.

The source nodes are Dialog 160:9593, 160:9613, 160:9639, 160:9659, 160:9679, 160:9704, 160:9724, 160:9744, 160:9769; Confirmation Dialog 160:10067; Drawer 160:9910; Bottom Sheet 160:9956. These components use committed design tokens and the existing Button and Divider components.
