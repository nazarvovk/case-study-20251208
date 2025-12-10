"use client";

import { useMemo, useState } from "react";
import { Select } from "./select";
import { AggregationTable } from "./aggregation-table";
import { Filter, FilterState } from "./filter";

export type AggregationFunction<T> = (values: T[]) => string | number;
export type AggregationFunctions<T> = Record<string, AggregationFunction<T>>;
export type AggregationProps<
  T extends Record<string, unknown>,
  TAggregationFns extends AggregationFunctions<T>,
> = {
  data: T[];
  /**
   * Keys on which grouping is allowed
   */
  // NOTE: here and below `keyof T & string`, becauseTypeScript doesn't correctly infer keyof Record<string, unknown>
  keys: readonly (keyof T & string)[];
  defaultRowsKey: keyof T & string;
  defaultColumnsKey: keyof T & string;
  aggregationFunctions: TAggregationFns;
  defaultAggregation: keyof TAggregationFns & string;
};

export const Aggregation = <
  T extends Record<string, unknown>,
  TAggregationFns extends AggregationFunctions<T>,
>(
  props: AggregationProps<T, TAggregationFns>,
) => {
  const { data, keys, aggregationFunctions } = props;
  const [columnsKey, setColumnsKey] = useState(props.defaultColumnsKey);
  const [rowsKey, setRowsKey] = useState(props.defaultRowsKey);
  const [aggregation, setAggregation] = useState(props.defaultAggregation);

  // Selecting the same key for both rows and columns not allowed
  const columnsKeyOptions = useMemo(
    () => keys.filter((key) => key !== rowsKey),
    [keys, rowsKey],
  );
  const rowsKeyOptions = useMemo(
    () => keys.filter((key) => key !== columnsKey),
    [keys, columnsKey],
  );

  const [filters, setFilters] = useState<FilterState[]>([]);
  const availableFilterKeys = useMemo(
    () =>
      keys.filter(
        (key) =>
          key !== columnsKey &&
          key !== rowsKey &&
          !filters.find((filter) => filter.key === key),
      ),
    [keys, rowsKey, columnsKey, filters],
  );

  const filteredData = useMemo(() => {
    let result = data;
    for (const filter of filters) {
      result = result.filter((t) => t[filter.key] === filter.value);
    }
    return result;
  }, [data, filters]);

  const aggregationFunction = aggregationFunctions[aggregation];

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

        <div className="space-y-2">
          {filters.map((filter) => (
            <Filter
              key={String(filter.key)}
              filter={filter}
              setFilters={setFilters}
              availableFilterKeys={availableFilterKeys}
              data={data}
            />
          ))}
        </div>
        {availableFilterKeys.length > 0 && (
          <button
            className="text-xs text-neutral-500 mt-2 underline hover:text-neutral-700 cursor-pointer"
            title="Add Filter"
            onClick={() => {
              setFilters((prev) => [
                ...prev,
                {
                  key: availableFilterKeys[0],
                  value: data[0][availableFilterKeys[0]],
                },
              ]);
            }}
          >
            + Add Filter
          </button>
        )}
      </div>
      <AggregationTable
        data={filteredData}
        rowsKey={rowsKey}
        columnsKey={columnsKey}
        aggregationFunction={aggregationFunction}
      />
      <div className="mt-2">
        <Select
          name="aggregation"
          options={Object.keys(aggregationFunctions)}
          value={aggregation}
          onChange={setAggregation}
          label="Aggregation"
        />
      </div>
    </div>
  );
};
