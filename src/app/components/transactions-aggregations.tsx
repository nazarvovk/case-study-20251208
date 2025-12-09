"use client";
import type { TransactionDTO } from "@/lib/entities/transaction";
import { StrictExtract } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Select } from "./select";
import { AggregationTable } from "./aggregation-table";

const GROUPING_KEYS = ["transaction_type", "status", "year"] as const;

export type GroupingKey = StrictExtract<
  keyof TransactionDTO,
  (typeof GROUPING_KEYS)[number]
>;

const AGGREGATION_FUNCTIONS = {
  amountSum: (values: TransactionDTO[]) => {
    const sum = values.reduce((acc, val) => acc + Number(val.amount), 0);
    return `$ ${sum.toFixed(2)}`;
  },
  amountAverage: (values: TransactionDTO[]) => {
    const average =
      values.length === 0
        ? 0
        : values.reduce((acc, val) => acc + Number(val.amount), 0) /
          values.length;
    return `$ ${average.toFixed(2)}`;
  },
  amountMedian: (values: TransactionDTO[]) => {
    if (values.length === 0) return "---";
    const sortedAmounts = values
      .map((val) => Number(val.amount))
      .sort((a, b) => a - b);
    const mid = Math.floor(sortedAmounts.length / 2);
    const median =
      sortedAmounts.length % 2 !== 0
        ? sortedAmounts[mid]
        : (sortedAmounts[mid - 1] + sortedAmounts[mid]) / 2;
    return `$ ${median.toFixed(2)}`;
  },
  count: (values: TransactionDTO[]) => values.length,
};

type Aggregation = keyof typeof AGGREGATION_FUNCTIONS;

const AGGREGATIONS = Object.keys(AGGREGATION_FUNCTIONS) as Aggregation[];

type TransactionsAggregationsProps = {
  transactions: TransactionDTO[];
};

export const TransactionsAggregations = (
  props: TransactionsAggregationsProps,
) => {
  const { transactions } = props;
  const [columnsKey, setColumnsKey] = useState<GroupingKey>("status");
  const [rowsKey, setRowsKey] = useState<GroupingKey>("transaction_type");
  const [aggregation, setAggregation] = useState<Aggregation>("amountSum");

  // Selecting the same key for both rows and columns not allowed
  const columnsKeyOptions = useMemo(
    () => GROUPING_KEYS.filter((key) => key !== rowsKey),
    [rowsKey],
  );
  const rowsKeyOptions = useMemo(
    () => GROUPING_KEYS.filter((key) => key !== columnsKey),
    [columnsKey],
  );

  return (
    <div className="px-8 py-6 outline outline-neutral-300 shadow-sm rounded-md w-min">
      <div className="mb-2 space-y-2">
        <div className="flex gap-4 items-center justify-between">
          <Select
            name="rowKey"
            options={rowsKeyOptions}
            value={rowsKey}
            onChange={setRowsKey}
            label="Rows ↓"
          />
          <button
            className="hover:bg-neutral-200/50 transition rounded-md p-4 size-6 cursor-pointer flex items-center justify-center mt-4"
            title="Swap Rows and Columns"
            onClick={() => {
              setRowsKey(columnsKey);
              setColumnsKey(rowsKey);
            }}
          >
            ‹›
          </button>
          <Select
            name="columnKey"
            options={columnsKeyOptions}
            value={columnsKey}
            onChange={setColumnsKey}
            label="Columns →"
          />
        </div>
      </div>
      <AggregationTable
        transactions={transactions}
        rowsKey={rowsKey}
        columnsKey={columnsKey}
        aggregationFunction={AGGREGATION_FUNCTIONS[aggregation]}
      />
      <div className="mt-2">
        <Select
          name="aggregation"
          options={AGGREGATIONS}
          value={aggregation}
          onChange={setAggregation}
          label="Aggregation"
        />
      </div>
    </div>
  );
};
