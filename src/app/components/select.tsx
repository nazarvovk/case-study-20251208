export type SelectProps<T extends string> = {
  name: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
};

export const Select = <T extends string>(props: SelectProps<T>) => {
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
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
