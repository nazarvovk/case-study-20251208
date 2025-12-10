"use client";

import { cn, uniqueSorted } from "@/lib/utils";
import { JSX, useMemo, useState } from "react";
import { EyeClosedIcon, EyeOpenIcon } from "./icons";

type AggregationCellProps<T extends Record<string, unknown>> = {
  data: T[];
  aggregationFunction: (values: T[]) => string | number;
  rowsKey?: keyof T;
  columnsKey?: keyof T;
  row?: string;
  column?: string;
  className?: string;
} & JSX.IntrinsicElements["td"];

function AggregationCell<T extends Record<string, unknown>>(
  props: AggregationCellProps<T>,
) {
  const {
    data,
    aggregationFunction,
    rowsKey,
    columnsKey,
    row,
    column,
    className,
    ...tdProps
  } = props;

  const value = useMemo(() => {
    let dataForCell = data;
    // skip filtering if no rowsKey/columnsKey provided (total)
    if (rowsKey || columnsKey) {
      dataForCell = dataForCell.filter((entry) => {
        return (
          (!rowsKey || entry[rowsKey] === row) &&
          (!columnsKey || entry[columnsKey] === column)
        );
      });
    }
    return aggregationFunction(dataForCell);
  }, [aggregationFunction, column, columnsKey, row, rowsKey, data]);

  return (
    <td
      className={cn("px-2 py-1 text-center whitespace-pre", className)}
      {...tdProps}
    >
      {value}
    </td>
  );
}

type AggregationTableProps<T extends Record<string, unknown>> = {
  data: T[];
  rowsKey: keyof T;
  columnsKey: keyof T;
  aggregationFunction: (values: T[]) => string | number;
};

export function AggregationTable<T extends Record<string, unknown>>(
  props: AggregationTableProps<T>,
) {
  const { data, rowsKey, columnsKey, aggregationFunction } = props;

  // Unique values for a selected key
  const columns = useMemo(
    () => uniqueSorted(data.map((entry) => entry[columnsKey])),
    [data, columnsKey],
  );
  const rows = useMemo(
    () => uniqueSorted(data.map((entry) => entry[rowsKey])),
    [data, rowsKey],
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
              key={String(column)}
              className="px-2 py-1 font-bold border-b border-neutral-300"
            >
              {String(column)}
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
            key={String(row)}
            className={cn(
              "hover:bg-neutral-200/50",
              i % 2 === 0 ? "bg-neutral-200/30" : "",
            )}
          >
            <th className="px-2 py-1 font-bold text-left text-neutral-500 border-r border-neutral-300">
              {String(row)}
            </th>
            {columns.map((column) => (
              <AggregationCell
                key={String(column)}
                data={data}
                rowsKey={rowsKey}
                columnsKey={columnsKey}
                row={String(row)}
                column={String(column)}
                aggregationFunction={aggregationFunction}
              />
            ))}
            {showTotals && (
              <AggregationCell
                data={data}
                rowsKey={rowsKey}
                row={String(row)}
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
                key={String(column)}
                data={data}
                columnsKey={columnsKey}
                column={String(column)}
                aggregationFunction={aggregationFunction}
              />
            ))}
            <AggregationCell
              data={data}
              className="font-bold underline cursor-help decoration-dotted"
              title="Total for all data"
              aggregationFunction={aggregationFunction}
            />
          </tr>
        )}
      </tbody>
    </table>
  );
}
