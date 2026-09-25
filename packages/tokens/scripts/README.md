# Token conversion and validation

- `build.mjs`: reads raw snapshot payloads and their hash manifest, validates and normalizes them, and generates source documents plus developer outputs.
- `build.mjs --check`: read-only verification of the raw snapshot and every expected generated artifact.
- `validation.test.mjs`: successful source-preservation checks and injected failures for missing aliases/modes, cycles, types, values, counts, naming collisions and unsupported mappings.
- `export-figma.js`: read-only extraction recipe for Figma's JavaScript runtime, not Node.

Run commands documented in [the package README](../README.md). No dependencies or network access are needed for local generation. Do not change visual values in the converter. New source forms require explicit mappings backed by the current Figma file.
