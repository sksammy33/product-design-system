# Token workspace

Status: structure only. No token values, generated CSS, exporter or validator exists.

- `figma/`: approved raw source snapshots and source metadata, beginning in Phase 3.
- `src/`: reserved token categories and themes.
- `scripts/`: future conversion and validation.
- `dist/`: generated output only; tracked .gitkeep preserves the empty directory.

Preserve original collection/name/ID, type, units, aliases and modes. Typography/effect styles must also be accounted for. Do not treat every Figma FLOAT as a pixel dimension. Never edit generated outputs manually.
