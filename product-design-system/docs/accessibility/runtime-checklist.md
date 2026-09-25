# Runtime accessibility checklist

Status: **NOT RUN**. Phase 2 contains no component implementation. Unchecked items are future verification tasks, not passing results.

For each component and complete flow:

- [ ] Semantic HTML matches purpose, role, and interaction.
- [ ] ARIA is necessary, valid, and synchronized with actual state.
- [ ] Accessible names and descriptions are meaningful and correctly associated.
- [ ] Keyboard operation supports the documented interaction model.
- [ ] Focus order is logical across responsive layouts.
- [ ] Focus is visible and not obscured.
- [ ] Modal focus trapping, initial focus, and restoration work where applicable.
- [ ] Screen reader behavior communicates roles, states, values, and errors.
- [ ] Reduced-motion preferences produce usable alternatives.
- [ ] Zoom, text resizing, text spacing, and reflow preserve content and operation.
- [ ] Autofill and password managers work for relevant form flows.
- [ ] Status announcements reach assistive technology without unnecessary interruption.
- [ ] Rendered contrast and pointer target size pass applicable requirements.
- [ ] Both themes and all implemented states are covered.
- [ ] Automated accessibility checks and manual checks are recorded.

For every review record: component/flow, source Figma node, code revision, date, reviewer, browser/OS, assistive technology/version, theme, viewport, steps, result, evidence, and issue links. Use Pass, Fail, Not run, or Not applicable with a reason. Re-test failures after correction.

Component checks cannot certify a consuming application's conformance.
