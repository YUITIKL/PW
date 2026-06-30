"use client";

import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { useEffect } from "react";

type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-20 right-5 z-50 flex items-center gap-3 rounded-md px-4 py-3 shadow-lg text-white ${
        isSuccess ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {isSuccess ? (
        <CheckCircleIcon size={22} weight="fill" />
      ) : (
        <XCircleIcon size={22} weight="fill" />
      )}

      <p className="font-common text-sm">{message}</p>
    </div>
  );
}