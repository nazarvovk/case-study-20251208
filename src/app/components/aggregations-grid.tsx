"use client";

import { useState } from "react";
import {
  Aggregation,
  AggregationFunctions,
  AggregationProps,
} from "./aggregation";

type AggregationsGridProps<
  T extends Record<string, unknown>,
  TAggregationFns extends AggregationFunctions<T>,
> = AggregationProps<T, TAggregationFns>;

export const AggregationsGrid = <
  T extends Record<string, unknown>,
  TAggregationFns extends AggregationFunctions<T>,
>(
  props: AggregationsGridProps<T, TAggregationFns>,
) => {
  const {
    data,
    keys,
    defaultRowsKey,
    defaultColumnsKey,
    aggregationFunctions,
  } = props;

  const [aggregations, setAggregations] = useState([{ id: "default" }]);

  return (
    <div className="flex flex-wrap gap-2">
      {aggregations.map((aggregation) => (
        <Aggregation
          key={aggregation.id}
          data={data}
          keys={keys}
          defaultRowsKey={defaultRowsKey}
          defaultColumnsKey={defaultColumnsKey}
          aggregationFunctions={aggregationFunctions}
          defaultAggregation={props.defaultAggregation}
        />
      ))}
      <button
        className="cursor-pointer border border-dotted rounded-md p-12 bg-neutral-100 hover:bg-neutral-200/50 transition"
        onClick={() => {
          setAggregations((prev) => [
            ...prev,
            { id: `agg-${prev.length + 1}` },
          ]);
        }}
      >
        + Add
      </button>
    </div>
  );
};
