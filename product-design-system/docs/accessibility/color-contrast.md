# Color contrast

Review foreground/background pairs in every supported theme and state. Normal text generally needs 4.5:1 contrast; large text needs 3:1. Required visual information identifying controls and states generally needs 3:1 against adjacent colors. Apply the relevant exceptions carefully; do not use a disabled-state exception for an enabled control.

The Phase 1 audit identified semantic color and interactive-border issues. See [color decisions](../decisions/002-semantic-color-accessibility.md) and [border decisions](../decisions/003-interactive-borders.md). No replacement values are approved by this repository.

Do not communicate errors or status by color alone. Check actual rendered pairs, transparency, and image backgrounds after implementation. Record the source token, theme, state, measured ratio, and resolution.

References: [Text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
