"use client";

import { useState } from "react";
import {
  Aggregation,
  AggregationFunctions,
  AggregationProps,
} from "./aggregation";

/**
 * Drop-in Aggregation component that handles multiple aggregations grid
 */
export const AggregationsGrid = <
  T,
  TAggregationFns extends AggregationFunctions<T>,
>(
  props: AggregationProps<T, TAggregationFns>,
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
