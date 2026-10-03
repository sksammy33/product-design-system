# Navigation shells — Batch D2

Canonical Figma sources: Navigation Bar set `140:8393` (Desktop `140:8362`, Mobile `140:8383`), Side Navigation set `140:8465` (Expanded `140:8394`, Collapsed `140:8435`), and Mobile Navigation set `140:8502` (Bottom `140:8466`, Back `140:8487`, Close `140:8495`).

The shells use committed semantic tokens, the approved Button for icon controls, and Lucide icons. Destination controls use navigation semantics rather than menuitem roles, so the Batch D1 menu primitives stay independent. The canonical Navigation Bar sources have an anomalous 26px frame height; the documentation renders establish the usable 64px bar height. The canonical mobile structure centers the brand using equal spacers; its documentation instance hides the leading spacer. This implementation preserves the canonical centered brand. Selected desktop links use the committed Text Link Hover token on the original Focus Outline background because the source's Action Primary pairing fails small-text contrast (4.1:1 in Light). Sidebar and bottom-bar current destinations use Text Link, preserving the Light appearance and making Dark mode legible. No token values are changed.

## APIs

`NavigationBar` takes `variant="desktop" | "mobile"`, a `brand`, destination `items`, `currentId`, and `onNavigate(id, event)`. Desktop actions appear when `onSearch`, `onNotifications`, and `onProfile` are supplied. The mobile variant uses `onMenu` and `onNotifications`. Every action has an explicit accessible label that can be customized. Supply `menuExpanded` and `menuControls` when an app owns a collapsible mobile menu; the shell does not create a duplicate menu or manage routing.

Choose `variant="mobile"` for narrow viewports. The desktop variant retains its full link and action layout and does not collapse itself at 320px or 390px; the consuming app controls when to switch variants.

`SideNavigation` accepts named `groups`, a `utilities` array for Settings/Log Out, `currentId`, and `collapsed`. Its reference dimensions are 240×600px expanded and 64×600px collapsed. A consuming app may override the height through `className`. Icons are required on sidebar items so collapsing leaves meaningful visual destinations. Hidden labels remain in the accessible name and all enabled destinations stay in normal Tab order.

`MobileNavigation` uses a discriminated `variant`: `bottom` requires `items`; `top-back` requires `title` and `onBack`; `top-close` requires `title` and `onClose`. Top bars accept an optional named `action`. Reference dimensions are 390×64px for Bottom/Back and 390×63px for Close. Widths shrink to their container. Bottom-bar selection has `aria-current="page"`, medium label weight, and an underline so it remains visible without relying on color.

## Routing and accessibility

Each `NavigationDestination` can provide `href`, `target`, `rel`, and `onSelect(event)`. Destinations with `href` render anchors; callback destinations render native buttons. Router integrations can call `event.preventDefault()` inside `onSelect` or the shell's `onNavigate`. Selection is controlled by the consumer through `currentId`; no app-routing dependency is included. Disabled anchors lose their href and Tab stop; disabled buttons use native disabled behavior. Neither activates a callback.

Use unique landmark `label` values when several shells of the same type appear on one page. Give custom brand content and icons appropriate sizing; decorative icons are hidden from assistive technology. All enabled controls have visible token-based focus indicators. Standard Tab/Shift+Tab and Enter/Space work through native link/button semantics.

Storybook includes all seven canonical shell variants and interaction tests. React browser tests cover router callbacks, named controls, disabled states, keyboard navigation, current-page state, source dimensions, and axe in both themes.
