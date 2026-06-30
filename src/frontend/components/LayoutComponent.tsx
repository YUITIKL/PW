"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" && <Header />}
      {children}
    </>
  );
}