import { Suspense } from "react";
import { getAllTransactions } from "./data";
import { TransactionsAggregations } from "./components/transactions-aggregations";

export default async function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <main className="px-24 py-16 space-y-4">
        <h1 className="font-bold text-2xl">Test Assignment</h1>
        <Suspense
          fallback={
            <div className="bg-neutral-200 rounded-md h-72 w-96 animate-pulse" />
          }
        >
          <TransactionsDashboard />
        </Suspense>
      </main>
    </div>
  );
}

const TransactionsDashboard = async () => {
  const transactions = await getAllTransactions();

  return <TransactionsAggregations transactions={transactions} />;
};
