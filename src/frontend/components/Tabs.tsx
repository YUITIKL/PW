import {
  BookmarkSimpleIcon,
  BuildingsIcon,
  GlobeHemisphereWestIcon,
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
      text: "Nacional",
      icon: <GlobeHemisphereWestIcon weight="fill" size={18} className="mx-auto" />,
    },
    {
      text: "Municipal",
      icon: <BuildingsIcon weight="fill" size={18} className="mx-auto" />,
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
    <div className="grid grid-cols-4 rounded-lg border border-sky-800 bg-white p-1 w-[1100px] max-w-[95%]">
      {tabs.map((tab, index) => (
        <button
          key={tab.text}
          onClick={() => handleTab(index)}
          className={`
            z-10 px-6 py-1 text-base lg:text-lg font-title font-bold transition-colors w-full cursor-pointer
            ${
              active === index
                ? `text-white bg-sky-900 ${
                    index === 0 ? "rounded-l-md" : index === 3 ? "rounded-r-md" : ""
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
