import {
  BookmarkSimpleIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

interface TabsProps {
  onChange?: (index: number) => void;
}

export default function Tabs({ onChange }: TabsProps) {
  const [active, setActive] = useState(0);

  function handleTab(index: number) {
    setActive(index);
    onChange?.(index);
  }

  const tabs = [
    {
      text: "Explorar",
      icon: <MagnifyingGlassIcon size={18} className="mx-auto" />,
    },
    {
      text: "Compartilhados comigo",
      icon: <PaperPlaneTiltIcon weight="fill" size={18} className="mx-auto" />,
    },
    {
      text: "Favoritos",
      icon: <BookmarkSimpleIcon weight="fill" size={18} className="mx-auto" />,
    },
  ];

  return (
    <div className="grid grid-cols-3 rounded-lg border border-sky-800 bg-white p-1 w-[900px] max-w-[95%]">
      {tabs.map((tab, index) => (
        <button
          key={tab.text}
          onClick={() => handleTab(index)}
          className={`
            z-10 px-6 py-1 text-base lg:text-lg font-title font-bold transition-colors w-full cursor-pointer
            ${
              active === index
                ? `text-white bg-sky-900 ${
                    index === 0
                      ? "rounded-l-md"
                      : index === 2
                      ? "rounded-r-md"
                      : ""
                  }`
                : "text-sky-800 hover:text-sky-600"
            }
          `}
        >
          <div className="hidden md:flex justify-center">{tab.text}</div>
          <div className="md:hidden text-center">{tab.icon}</div>
        </button>
      ))}
    </div>
  );
}
