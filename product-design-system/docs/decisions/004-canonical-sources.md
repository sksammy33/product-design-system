# Canonical component source reconciliation

## Decision

Canonical component source reconciliation.

## Context

Duplicate selection sets exist; Button resolves through instances without a page parent in the API.

## Chosen approach

Compare states, dependencies and usage; select one maintainable source ID per family and document deprecated duplicates. Never choose by name or largest ID alone. No canonical winner is asserted yet.

## Reason

Stable source identity prevents exporting or implementing the wrong generation.

## Status

Pending source reconciliation.

## Date

2026-09-24
