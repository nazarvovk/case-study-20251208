import { TransactionsAggregations } from "../components/transactions-aggregations";
import { getAllTransactions } from "./data";

export default async function Transactions() {
  const transactions = await getAllTransactions();

  return <TransactionsAggregations transactions={transactions} />;
}
