"use client";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  label: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value">;

export default function Select({
  value,
  label,
  options,
  onChange,
  error,
  disabled = false,
  placeholder = "Selecione uma opção",
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col w-full text-black">
      <div className="flex flex-row items-center justify-between w-full">
        <p
          className={`font-common text-sm font-semibold md:mb-2 ${
            disabled && "text-gray-600"
          } min-w-[250px]`}
        >
          {label}
        </p>

        <p
          className={`text-red-500 font-common text-xs break-words ${
            (!error || error.length === 0) && "opacity-0"
          }`}
        >
          {error}
        </p>
      </div>

      <div
        className={`flex items-center border bg-white ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-sm font-common ${
          disabled ? "bg-gray-300 pointer-events-none cursor-not-allowed" : ""
        } w-full`}
      >
        <select
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 py-1 px-1.5 outline-none bg-transparent"
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}