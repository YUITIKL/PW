export default function Button({
  text,
  onClick,
  type = "filled",
  icon,
  full = false
}: {
  text: string;
  onClick: () => void;
  type?: "filled" | "void";
  icon?: React.ReactNode;
  full?: boolean // Occupies 100% of the length
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        type === "filled"
          ? "bg-sky-800 text-white hover:bg-sky-800/80 "
          : "bg-white text-sky-800 hover:bg-sky-800 hover:text-white"
      } items-center justify-center flex flex-row gap-2 ${full ? "w-full" : "w-fit"} min-w-[90px] border border-sky-800 border-2 transition-all duration-200 ease-out rounded-md px-2.5 py-1.5 font-title font-semibold text-sm cursor-pointer`}
    >
      {icon && <>{icon}</>}
      {text}
    </button>
  );
}
