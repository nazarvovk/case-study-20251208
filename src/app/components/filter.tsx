import { uniqueSorted } from "@/lib/utils";
import { Select } from "./select";
import { memo, useCallback, useMemo } from "react";

export type FilterState = { key: string; value: unknown };
type FilterProps = {
  setFilters: React.Dispatch<React.SetStateAction<FilterState[]>>;
  filter: FilterState;
  availableFilterKeys: string[];
  data: Record<string, unknown>[];
};

export const Filter = memo(function Filter(props: FilterProps) {
  const { filter, setFilters, availableFilterKeys, data } = props;

  const keyOptions = useMemo(
    () => [...availableFilterKeys, filter.key],
    [availableFilterKeys, filter.key],
  );

  const valueOptions = useMemo(() => {
    return uniqueSorted(
      data
        .map((entry) => String(entry[filter.key]))
        .filter((v) => v !== undefined),
    );
  }, [filter.key, data]);

  const handleKeyChange = useCallback(
    (newKey: string) => {
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

  return (
    <div key={filter.key} className="flex items-center gap-2">
      <Select
        name={`${filter.key}-filter-key`}
        options={keyOptions}
        value={filter.key}
        onChange={handleKeyChange}
      />
      <span className="text-neutral-500">is</span>
      <Select
        options={valueOptions}
        value={String(filter.value)}
        name={`${filter.key}-filter-value`}
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
});
