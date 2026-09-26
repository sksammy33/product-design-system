# Raw Figma snapshot

These JSON payloads came directly from read-only Figma Plugin API calls for file `A5R8vBTXZzfV5aj3omQYFG`. Source names, IDs, values, descriptions, aliases and mode IDs are unchanged. The only filesystem serialization addition is a trailing newline.

- `collections.json`: source file key, extraction timestamp, collection identities, mode names/IDs, defaults and variable membership.
- `variables-01.json` through `variables-11.json`: 30 variables per bounded response (16 in the final batch), with source offsets and total count: 316 variables, 19 more than the previous snapshot.
- `styles.json`: 16 complete text-style records and 14 effect-style records, separately from variables.
- `manifest.json`: locally generated capture metadata and SHA256 hashes of the raw files. This manifest is not itself a raw Figma response.

Bounded extraction avoids the connector’s response truncation. The earlier truncated response was not saved. The raw snapshot retains Figma float precision and original mode IDs; normalization uses mode names.

## Refresh

Use `../scripts/export-figma.js` as a read-only script in the current Figma file's Plugin API context (or the Figma connector's JavaScript execution tool). It is not a Node script. Set `kind` to collections, variables or styles. For variables, request offsets 0, 30, 60, ... until the reported total is reached. Save each complete returned JSON object without renaming or resolving its contents. Do not save truncated responses.

Before replacing this snapshot, confirm the current file key, access to all local collections/styles and any referenced external variables. Capture collections and styles alongside all variable batches from the same unchanged source revision. Reconcile totals and collection membership, compare with the previous inventory, and report differences before conversion. Retain any additional component spacing separately.

Refresh the SHA256 manifest after reviewing the raw diff, then update expected inventory/mappings only where current source evidence requires it. Run build, validation and tests. The converter fails on unresolved remote aliases or unsupported source structures rather than guessing.

The tool does not expose a file revision ID here. The capture timestamp, source IDs, complete membership checks and per-file hashes provide traceability, but are not a Figma version identifier.
