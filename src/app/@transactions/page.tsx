import { getAllTransactions } from "./data";
import { TransactionsAggregationsGrid } from "./transactions-aggregation-grid";

export default async function Transactions() {
  const transactions = await getAllTransactions();

  return <TransactionsAggregationsGrid transactions={transactions} />;
}
