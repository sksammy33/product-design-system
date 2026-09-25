# Responsive reflow

Use Figma layout rules as the design reference. Do not invent breakpoints from frame widths. Any missing responsive behavior must be specified before implementation changes the layout.

Test text resizing to 200% and reflow at a viewport equivalent to 320 CSS pixels wide for vertically scrolling content, including 400% browser zoom where applicable. Check loss of content, overlap, clipped labels, horizontal scrolling, and keyboard access. Some inherently two-dimensional content has specific exceptions.

Test long content, text spacing overrides, validation messages, and both themes. Record exceptions and any design decision needed.

Reference: [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
