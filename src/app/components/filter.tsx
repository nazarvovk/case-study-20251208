import { uniqueSorted } from "@/lib/utils";
import { Select } from "./select";
import { GroupingKey } from "./aggregation";
import { TransactionDTO } from "@/lib/entities/transaction";
import { memo, useCallback, useMemo } from "react";

type FilterProps = {
  setFilters: React.Dispatch<
    React.SetStateAction<{ key: GroupingKey; value: string }[]>
  >;
  filter: { key: GroupingKey; value: string };
  availableFilterKeys: GroupingKey[];
  transactions: TransactionDTO[];
};

export const Filter = memo(function Filter(props: FilterProps) {
  const { filter, setFilters, availableFilterKeys, transactions } = props;

  const keyOptions = useMemo(
    () => [...availableFilterKeys, filter.key],
    [availableFilterKeys, filter.key],
  );

  const valueOptions = useMemo(() => {
    return uniqueSorted(
      transactions
        .map((t) => String(t[filter.key]))
        .filter((v) => v !== undefined),
    );
  }, [filter.key, transactions]);

  const handleKeyChange = useCallback(
    (newKey: GroupingKey) => {
      setFilters((prev) =>
        prev.map((f) =>
          f.key === filter.key
            ? { key: newKey, value: transactions[0][newKey] }
            : f,
        ),
      );
    },
    [filter.key, setFilters, transactions],
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
        value={filter.value}
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
