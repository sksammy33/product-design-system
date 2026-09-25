# Keyboard operation

Future controls must work without a pointer. Prefer native HTML behavior and verify Tab navigation, activation, selection, and disabled behavior. Document expected keys with each component specification.

Radio groups normally use arrow keys within the group; checkboxes normally toggle with Space. Avoid recreating native behavior unnecessarily. Composite widgets need an explicit interaction model and testing before implementation is called stable.

Check for unintended keyboard traps. Modal behavior also requires the [focus checks](focus.md). Phase 2 has no implemented keyboard behavior.

References: [Radio pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), [Checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/).
