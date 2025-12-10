## About
This is a test assignment.

The implementation uses Next.js.
Parallel routes are used to separate the Transaction aggregation grid for loading and error handling.

## Architecture and assumptions
The app structure separates generic components and specific settings for the provided Transactions stub data. See [`transactions-aggregation-grid.tsx`](src/app/@transactions/transactions-aggregation-grid.tsx).

The allowed grouping keys, available aggregation functions, and their defaults can be changed without changing the underlying generic components.

This way, the aggregation components can be used with other entities, not just the provided Transactions.

**Features overview:**

- Row and column keys can be changed, swapped. The values for rows/columns are calculated from the provided data.
- Totals, which can be shown and hidden, are calculated for rows, columns, and the entire table.
- `More than one field for columns` is implemented in the form of filters which can be added and removed. As the interface will always be a 2-dimensional table, this can be thought of as taking a 2D slice out of a 3+ dimensional chart.
- Aggregation functions can be changed, new ones added fairly trivially in code.
- More views can be added to see different aggregation setups at the same time.

## Installation
```bash
pnpm install
```

## Run the server
In dev mode:
```bash
pnpm dev
```

or build & run:
```bash
pnpm build && pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run the tests
```bash
pnpm test
```

## Hypothetical TODOs:
- Persistent state (Local storage / Query params)
- Remove aggregation views after adding more than 1
- Column/row sorting
- Visual polish