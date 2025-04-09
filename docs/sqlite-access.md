# SQLite Access

We use Prisma to access the local SQLite database.

All Records extend this interface.

```ts
interface Record {
    // The identifier for this record
    // We prefix all ids with the table name to give clarity on type
    id: string;

    // We allow arbitrary references between records as one-off optional links
    // This allows the UI to better display relationships between records
    references: Record<string, string>;

    // The timestamp when the record was created
    createdAt: Date;

    // The timestamp when the record was last updated
    updatedAt: Date;
}
```
