"use client";

import { useAuth } from "@/hooks/useAuth";
import { SignOutIcon, UserCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function MainScreen() {
  const { logout } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-12 bg-gradient-to-r from-sky-900 to-emerald-500 shadow-sm z-50">
        <div className="h-full flex items-center px-6 justify-between">
          <Link href="/profile">
            <UserCircleIcon
              size={22}
              className="text-white hover:cursor-pointer hover:text-gray-300"
            />
          </Link>
          <h1 className="text-xl font-bold font-title text-white">
            WeatherCheck
          </h1>
          <SignOutIcon
            size={20}
            className="text-white hover:cursor-pointer hover:text-gray-300"
            weight="bold"
            onClick={logout}
          />
        </div>
      </header>
    </>
  );
}
