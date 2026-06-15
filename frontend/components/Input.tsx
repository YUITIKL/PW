"use client";

import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";

type InputProps = {
  value: string;
  label: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  password?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export default function Input({
  value,
  onChange,
  label,
  error,
  disabled = false,
  password = false,
  ...props
}: InputProps) {
  const [visible, setVisible] = useState(!password);
  return (
    <div className="flex flex-col w-full text-black">
      <div className="flex flex-row items-center justify-between w-full">
        <p
          className={`font-common text-sm font-semibold mb-2 ${
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
          type={password && !visible ? "password" : "text"}
        />

        {password && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          >
            {visible ? (
              <EyeSlashIcon size={20} weight="regular" />
            ) : (
              <EyeIcon size={20} weight="regular" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
