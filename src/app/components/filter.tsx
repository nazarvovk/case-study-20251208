import { uniqueSorted } from "@/lib/utils";
import { Select } from "./select";
import { memo, useCallback, useMemo } from "react";

export type FilterState<T> = { key: keyof T; value: unknown };
type FilterProps<T> = {
  setFilters: React.Dispatch<React.SetStateAction<FilterState<T>[]>>;
  filter: FilterState<T>;
  availableFilterKeys: (keyof T)[];
  data: T[];
};

function FilterComponent<T>(props: FilterProps<T>) {
  const { filter, setFilters, availableFilterKeys, data } = props;

  const keyOptions = useMemo(
    () => [...availableFilterKeys, filter.key],
    [availableFilterKeys, filter.key],
  );

  const valueOptions = useMemo(() => {
    return uniqueSorted(data.map((entry) => String(entry[filter.key])));
  }, [filter.key, data]);

  const handleKeyChange = useCallback(
    (newKey: keyof T) => {
      setFilters((prev) =>
        prev.map((f) =>
          f.key === filter.key
            ? { key: newKey, value: String(data[0][newKey]) }
            : f,
        ),
      );
    },
    [filter.key, setFilters, data],
  );
  const handleValueChange = useCallback(
    (newValue: string) => {
      setFilters((prev) =>
        prev.map((f) =>
          f.key === filter.key ? { key: filter.key, value: newValue } : f,
        ),
      );
    },
    [filter.key, setFilters],
  );

  const filterKey = String(filter.key);

  return (
    <div key={filterKey} className="flex items-center gap-2">
      <Select
        name={`${filterKey}-filter-key`}
        options={keyOptions}
        value={filter.key}
        onChange={handleKeyChange}
      />
      <span className="text-neutral-500">is</span>
      <Select
        options={valueOptions}
        value={String(filter.value)}
        name={`${filterKey}-filter-value`}
        onChange={handleValueChange}
      />
      <button
        className="cursor-pointer"
        title="Remove Filter"
        onClick={() => {
          setFilters((prev) => prev.filter((f) => f.key !== filter.key));
        }}
      >
        ×
      </button>
    </div>
  );
}

// workaround for generic components with memo
export const Filter = memo(FilterComponent) as typeof FilterComponent;
