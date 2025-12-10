"use client";

import { TransactionDTO } from "@/lib/entities/transaction";
import { AggregationsGrid } from "../components/aggregations-grid";

const TRANSACTION_GROUPING_KEYS = [
  "transaction_type",
  "status",
  "year",
] as const;

const TRANSACTION_AGGREGATION_FUNCTIONS = {
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

type TransactionsAggregationsGridProps = {
  transactions: TransactionDTO[];
};

export const TransactionsAggregationsGrid = (
  props: TransactionsAggregationsGridProps,
) => {
  return (
    <AggregationsGrid
      data={props.transactions}
      keys={TRANSACTION_GROUPING_KEYS}
      defaultColumnsKey="status"
      defaultRowsKey="transaction_type"
      aggregationFunctions={TRANSACTION_AGGREGATION_FUNCTIONS}
      defaultAggregation="amountSum"
    />
  );
};
