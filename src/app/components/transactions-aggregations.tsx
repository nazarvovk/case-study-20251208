"use client";
import type { TransactionDTO } from "@/lib/entities/transaction";

type TransactionsAggregationsProps = {
  transactions: TransactionDTO[];
};

export const TransactionsAggregations = (
  props: TransactionsAggregationsProps,
) => {
  const { transactions } = props;
  return <code>{JSON.stringify(transactions, null, 2)}</code>;
};
