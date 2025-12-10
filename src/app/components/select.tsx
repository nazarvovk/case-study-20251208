export type SelectProps<T> = {
  name: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
};

export const Select = <T,>(props: SelectProps<T>) => {
  const { name, options, value, onChange, label } = props;
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="font-bold block leading-none text-xs">{label}</label>
      )}
      <select
        name={name}
        className="border rounded px-2 py-1 w-full"
        onChange={(e) => onChange(e.target.value as T)}
        value={String(value)}
      >
        {options.map((option) => {
          const optionValue = String(option);
          return (
            <option key={optionValue} value={optionValue}>
              {optionValue}
            </option>
          );
        })}
      </select>
    </div>
  );
};
