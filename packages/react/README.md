# React component library

This private ESM workspace provides React components, React/React DOM peer dependencies, a Vite build, strict TypeScript declarations and opt-in scoped CSS. The public entry exports components and token types.

The implemented families are [Button](src/components/Button/README.md), [Input](src/components/Input/README.md), [Textarea](src/components/Textarea/README.md), [Checkbox](src/components/Checkbox/README.md), [Radio](src/components/Radio/README.md), [Switch](src/components/Switch/README.md), [Forms](src/components/Forms/README.md), [Checkbox/Radio groups](src/components/SelectionGroup/README.md), [Select/Combobox/MultiSelect](src/components/Select/README.md), [Overlay primitives](src/components/Overlay/README.md), [modal surfaces](src/components/Modal/README.md), [Command Menu](src/components/Command/README.md), [navigation primitives](src/components/Navigation/README.md) and [navigation shells](src/components/NavigationShells/README.md). The family READMEs record source references, APIs and accessibility behavior.

Import `@product-design-system/react/styles.css` and apply `pds-scope` to consume the generated token variables and scoped defaults. Use `data-theme="light"` or `data-theme="dark"` on the scope. No token values are redefined.

From the root, run `npm run build:react`, then `npm run typecheck` and `npm run test:browser -- --project react`. Component styles use CSS Modules and the generated token custom properties. Test fixtures are outside `src/` and excluded from the library build.

See [development tooling](../../docs/development.md) for setup, consumption, tests and contribution flow. Publishing remains deferred.
