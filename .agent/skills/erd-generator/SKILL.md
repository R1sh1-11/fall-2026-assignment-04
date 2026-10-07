---
name: erd-generator
description: Designs a database schema as a Mermaid erDiagram, validates it, and renders an SVG. Use when asked to design an ERD, data model, database schema, entity relationships, or architecture diagram from a domain description.
---

# ERD Generator

## Workflow
1. Parse requirements into entities, attributes with types, PK, FK, and cardinalities. Follow stated business rules exactly.
2. Write Mermaid to `docs/architecture/schema.mmd`:
   - Start with `erDiagram`.
   - Entity names UPPER_SNAKE_CASE. Attributes as `type name PK|FK|UK`.
   - Types only: int, uuid, string, text, boolean, date, timestamp, decimal.
   - Every FK column named `<entity>_id`.
   - `||--o{` one-to-many, `||--o|` one-to-one. Model many-to-many as a join entity.
   - Every relationship has a quoted label: `USERS ||--o{ LOANS : "places"`.
3. Run from repo root:
   `node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd`
4. Self-correction: if output starts with `SYNTAX_ERROR:`, read the trace, fix `schema.mmd`, rerun. Max 3 retries. After 3 failures, stop and show the last error.
5. On `SUCCESS`, reply with the full Mermaid in a mermaid code block and the path `docs/architecture/erd.svg`.

## Rules
- Never claim success without seeing `SUCCESS`.
- Do not edit the script.
- Entities that already exist in `src/db/migrations/` stay in the diagram for relationships, marked with a comment: `%% USERS exists in 001_initial_schema`.
