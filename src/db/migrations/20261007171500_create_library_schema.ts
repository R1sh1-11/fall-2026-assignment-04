import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable('authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('bio', 'text')
    .execute();

  await db.schema
    .createTable('borrowers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.notNull().unique().references('users.id').onDelete('cascade')
    )
    .addColumn('membership_number', 'varchar(255)', (col) =>
      col.notNull().unique()
    )
    .addColumn('phone', 'varchar(255)')
    .addColumn('joined_at', 'timestamp', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('books')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('isbn', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('published_year', 'integer', (col) => col.notNull())
    .addColumn('genre_id', 'integer', (col) =>
      col.notNull().references('genres.id').onDelete('cascade')
    )
    .execute();

  await db.schema
    .createTable('book_authors')
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('cascade')
    )
    .addColumn('author_id', 'integer', (col) =>
      col.notNull().references('authors.id').onDelete('cascade')
    )
    .addPrimaryKeyConstraint('book_authors_pk', ['book_id', 'author_id'])
    .execute();

  await db.schema
    .createTable('loans')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('borrower_id', 'integer', (col) =>
      col.notNull().references('borrowers.id').onDelete('cascade')
    )
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('cascade')
    )
    .addColumn('loaned_at', 'timestamp', (col) => col.notNull())
    .addColumn('due_at', 'timestamp', (col) => col.notNull())
    .addColumn('returned_at', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('loans').ifExists().execute();
  await db.schema.dropTable('book_authors').ifExists().execute();
  await db.schema.dropTable('books').ifExists().execute();
  await db.schema.dropTable('borrowers').ifExists().execute();
  await db.schema.dropTable('authors').ifExists().execute();
  await db.schema.dropTable('genres').ifExists().execute();
}
