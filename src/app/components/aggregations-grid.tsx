"use client";

import { TransactionDTO } from "@/lib/entities/transaction";
import { useState } from "react";
import { Aggregation } from "./aggregation";

type AggregationsGridProps = {
  transactions: TransactionDTO[];
};

export const AggregationsGrid = (props: AggregationsGridProps) => {
  const [aggregations, setAggregations] = useState([{ id: "default" }]);

  return (
    <div className="flex flex-wrap gap-2">
      {aggregations.map((agg) => (
        <Aggregation key={agg.id} transactions={props.transactions} />
      ))}
      <button
        className="cursor-pointer border border-dotted rounded-md p-12 bg-neutral-100 hover:bg-neutral-200/50 transition"
        onClick={() =>
          setAggregations((prev) => [...prev, { id: `agg-${prev.length + 1}` }])
        }
      >
        + Add
      </button>
    </div>
  );
};
