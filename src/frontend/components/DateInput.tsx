"use client";

type DateInputProps = {
  value: string;
  label: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type">;

export default function DateInput({
  value,
  onChange,
  label,
  error,
  disabled = false,
  ...props
}: DateInputProps) {
  return (
    <div className="flex flex-col w-full text-black">
      <div className="flex flex-row items-center justify-between w-full">
        <p
          className={`font-common text-xs  ${
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
        <input
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 py-1 px-1.5 outline-none bg-transparent"
          disabled={disabled}
          type="date"
        />
      </div>
    </div>
  );
}