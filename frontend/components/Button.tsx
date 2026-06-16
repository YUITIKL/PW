export default function Button({
  text,
  onClick,
  type = "filled",
  icon,
  full = false
}: {
  text: string;
  onClick: () => void;
  type?: "filled" | "void" | "delete";
  icon?: React.ReactNode;
  full?: boolean // Occupies 100% of the length
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        type === "filled"
          ? "bg-sky-800 text-white hover:bg-sky-800/80 border-sky-800"
          : type === "void" ? "bg-white text-sky-800 hover:bg-sky-800 hover:text-white border-sky-800" : "bg-red-600 text-white hover:bg-red-600/80 border-red-600"
      } items-center justify-center flex flex-row gap-2 ${full ? "w-full" : "w-fit"} min-w-[90px] border border-2 transition-all duration-200 ease-out rounded-md px-2.5 py-1.5 font-title font-semibold text-sm cursor-pointer`}
    >
      {icon && <>{icon}</>}
      {text}
    </button>
  );
}
