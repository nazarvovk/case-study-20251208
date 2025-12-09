import { AggregationsGrid } from "../components/aggregations-grid";
import { getAllTransactions } from "./data";

export default async function Transactions() {
  const transactions = await getAllTransactions();

  return <AggregationsGrid transactions={transactions} />;
}
