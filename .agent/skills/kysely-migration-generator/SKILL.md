---
name: kysely-migration-generator
description: Converts a Mermaid ERD (docs/architecture/schema.mmd or .svg) into a type-safe Kysely migration in src/db/migrations/. Use when asked to generate a migration, Kysely schema, or database tables from an ERD or diagram.
---

# Kysely Migration Generator

## Before writing
1. Read `docs/architecture/schema.mmd` (if only .svg exists, extract entities and relationships from it).
2. Read every file in `src/db/migrations/`. Use `001_initial_schema.ts` as the style baseline.
3. Skip tables created by earlier migrations. Reference them in FKs and match their PK type. `users.id` is serial, so FKs to users are `integer`.

## Mapping
- Entity to table: snake_case lowercase (`BOOK_AUTHORS` -> `book_authors`).
- Types: int->integer, uuid->uuid, string->varchar(255), text->text, boolean->boolean, date->date, timestamp->timestamp, decimal->numeric(10,2).
- PK int: `.addColumn('id', 'serial', (col) => col.primaryKey())`
- PK uuid: `.addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))`
- FK: `.addColumn('x_id', 'integer', (col) => col.notNull().references('parent.id').onDelete('cascade'))` (use uuid if parent PK is uuid).
- `||--o{`: FK on the many side, not unique.
- `||--o|`: FK on the child side plus `.unique()`.
- UK attribute: `.unique()`.
- Join tables: composite PK via `.addPrimaryKeyConstraint('<table>_pk', ['a_id', 'b_id'])`.

## Output
- Path: `src/db/migrations/<YYYYMMDDHHmmss>_<migration_name>.ts`.
- Import: `import { Kysely, sql } from 'kysely';`
- Export `async function up(db: Kysely<any>): Promise<void>` creating tables parents first.
- Export `async function down(db: Kysely<any>): Promise<void>` dropping in exact reverse order with `.ifExists()`.
- Never drop or alter tables from earlier migrations.

## Verify
Run `npm run build` then `npm run migrate:up`. On failure, fix the file and rerun. Report the file path when both pass.
