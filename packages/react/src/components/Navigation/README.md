# Navigation primitives

These components implement the canonical Navigation Documentation sources (page `245:347`): Navigation Menu Item `140:8108`, Navigation Menu `140:8300`, Breadcrumbs `140:8204`, Pagination `140:8262`, Stepper `140:8299`, and Tabs `140:8361`. They use the committed token package. Navigation Menu Item and Navigation Menu are independent of the Overlay menu components.

`NavigationMenu` accepts an `items` array. Items can include icons, shortcuts, destructive or disabled state, selected state, dividers, and nested `submenu` items. It exposes menu and menuitem semantics. Arrow Up/Down, Home/End move among enabled items; Arrow Right opens a submenu; Arrow Left or Escape returns to its parent. Select actions are provided on each item or by the menu's `onSelect(id)` callback. Shortcuts are visual hints and do not contribute to accessible names.

`Breadcrumbs` accepts ordered `{ label, href? }` items. The last item is the current page. `variant="home"` uses a home icon for the first link, and `variant="collapsed"` hides intermediate links behind a disclosure button that reveals them on demand.

`Pagination` is controlled with `page`, `pageCount`, and `onPageChange(page)`. Use `size="small"`, `"medium"`, or `"large"`. Previous and next buttons disable at the endpoints; the current page has `aria-current="page"`.

`Stepper` accepts ordered steps and a one-based `currentStep`, or explicit per-step `status`. It supports horizontal and vertical orientations. The current step has `aria-current="step"`; status text is available to assistive technology.

`Tabs` accepts `{ id, label, content, disabled? }` items, with optional controlled `value` and `onValueChange`, or `defaultValue`. Both underline and contained variants use tablist/tab/tabpanel relationships. Arrow Left/Right and Home/End move focus and selection, skipping disabled tabs.

All navigation controls have token-based visible focus styles. See the Navigation Storybook stories and `packages/react/tests/navigation.test.tsx` for usage and interaction coverage.
