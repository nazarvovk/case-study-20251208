"use client";
import { TransactionDTO } from "@/lib/entities/transaction";
import { GroupingKey } from "./transactions-aggregations";
import { cn, uniqueSorted } from "@/lib/utils";
import { JSX, memo, useMemo, useState } from "react";
import { EyeClosedIcon, EyeOpenIcon } from "./icons";

type AggregationCellProps = {
  transactions: TransactionDTO[];
  aggregationFunction: (values: TransactionDTO[]) => string | number;
  rowsKey?: GroupingKey;
  columnsKey?: GroupingKey;
  row?: string;
  column?: string;
  className?: string;
} & JSX.IntrinsicElements["td"];

const AggregationCell = memo(function AggregationCell(
  props: AggregationCellProps,
) {
  const {
    transactions,
    aggregationFunction,
    rowsKey,
    columnsKey,
    row,
    column,
    className,
    ...tdProps
  } = props;

  const value = useMemo(() => {
    let transactionsForCell = transactions;
    // skip filtering if no rowsKey/columnsKey provided (total)
    if (rowsKey || columnsKey) {
      transactionsForCell = transactionsForCell.filter((transaction) => {
        return (
          (!rowsKey || transaction[rowsKey] === row) &&
          (!columnsKey || transaction[columnsKey] === column)
        );
      });
    }
    return aggregationFunction(transactionsForCell);
  }, [aggregationFunction, column, columnsKey, row, rowsKey, transactions]);

  return (
    <td
      className={cn("px-2 py-1 text-center whitespace-pre", className)}
      {...tdProps}
    >
      {value}
    </td>
  );
});

type AggregationTableProps = {
  transactions: TransactionDTO[];
  rowsKey: GroupingKey;
  columnsKey: GroupingKey;
  aggregationFunction: (values: TransactionDTO[]) => string | number;
};

export const AggregationTable = memo(function AggregationTable(
  props: AggregationTableProps,
) {
  const { transactions, rowsKey, columnsKey, aggregationFunction } = props;

  // Unique values for a selected key
  const columns = useMemo(
    () =>
      uniqueSorted(transactions.map((transaction) => transaction[columnsKey])),
    [transactions, columnsKey],
  );
  const rows = useMemo(
    () => uniqueSorted(transactions.map((transaction) => transaction[rowsKey])),
    [transactions, rowsKey],
  );
  const [showTotals, setShowTotals] = useState(true);

  return (
    <table className="outline outline-neutral-300 bg-neutral-50 w-full">
      <thead className="text-neutral-500">
        <tr>
          <th className="px-2 py-1">
            <button
              className="hover:bg-neutral-200/50 transition rounded-md p-2 h-8 cursor-pointer flex gap-2 items-center justify-center"
              title="Show/Hide Totals"
              onClick={() => setShowTotals((prev) => !prev)}
            >
              {showTotals ? <EyeOpenIcon /> : <EyeClosedIcon />}
              Totals
            </button>
          </th>
          {columns.map((column) => (
            <th
              key={column}
              className="px-2 py-1 font-bold border-b border-neutral-300"
            >
              {column}
            </th>
          ))}
          {showTotals && (
            <th className="px-2 py-1 font-bold border-b border-neutral-300">
              Total
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row}
            className={cn(
              "hover:bg-neutral-200/50",
              i % 2 === 0 ? "bg-neutral-200/30" : "",
            )}
          >
            <th className="px-2 py-1 font-bold text-left text-neutral-500 border-r border-neutral-300">
              {row}
            </th>
            {columns.map((column) => (
              <AggregationCell
                key={column}
                transactions={transactions}
                rowsKey={rowsKey}
                columnsKey={columnsKey}
                row={row}
                column={column}
                aggregationFunction={aggregationFunction}
              />
            ))}
            {showTotals && (
              <AggregationCell
                transactions={transactions}
                rowsKey={rowsKey}
                row={row}
                className="font-bold"
                aggregationFunction={aggregationFunction}
              />
            )}
          </tr>
        ))}
        {showTotals && (
          <tr className="font-bold">
            <th className="px-2 py-1 text-left text-neutral-500 border-r border-neutral-300">
              Total
            </th>
            {columns.map((column) => (
              <AggregationCell
                key={column}
                transactions={transactions}
                columnsKey={columnsKey}
                column={column}
                aggregationFunction={aggregationFunction}
              />
            ))}
            <AggregationCell
              transactions={transactions}
              className="font-bold underline cursor-help decoration-dotted"
              title="Total for all transactions"
              aggregationFunction={aggregationFunction}
            />
          </tr>
        )}
      </tbody>
    </table>
  );
});
