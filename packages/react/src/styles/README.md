# Scoped styles

`index.css` imports the existing generated token stylesheet and defines opt-in `pds-scope` defaults using those variables. `entry.ts` is the separate Vite CSS build entry, exported to consumers as `@product-design-system/react/styles.css`.

Future components should use CSS Modules with existing semantic tokens. No global reset, new palette or independent theme system is introduced.
