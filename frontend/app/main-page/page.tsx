"use client";

import Dashboard from "@/components/Dashboard";
import Tabs from "@/components/Tabs";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardProps, mockedUsers } from "../utils/types";

type Pages = "explore" | "shared" | "favorites";

export default function MainScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<Pages>("explore");

  const mockedExplorarData: DashboardProps[] = [
    {
      saved: false,
    },
    {
      saved: true,
      sharedWith: [mockedUsers[1]]
    },
    {
      saved: false,
    },
    {
      saved: false,
    },
    {
      saved: false,
    },
    {
      saved: false,
    },
    {
      saved: false,
    },
    {
      saved: false,
    },
    {
      saved: false,
    },
    {
      saved: true,
    },
    {
      saved: false,
    },
    {
      saved: false,
    },
    {
      saved: false,
    },
    {
      saved: false,
    },
    {
      saved: true,
    },
  ];

  const mockedSharedData: DashboardProps[] = [
    {
      saved: false,
      sharedBy: [mockedUsers[0], mockedUsers[1]],
      sharedWith: [mockedUsers[4]]
    },
    {
      saved: true,
      sharedBy: [mockedUsers[3], mockedUsers[5]],
    },
    {
      saved: false,
      sharedBy: [mockedUsers[1]],
    },
    {
      saved: false,
      sharedBy: [mockedUsers[7]],
    },
    {
      saved: false,
      sharedBy: [mockedUsers[9]],
    },
    {
      saved: false,
      sharedBy: [mockedUsers[8]],
    },
    {
      saved: false,
      sharedBy: [mockedUsers[1]],
    },
    {
      saved: false,
      sharedBy: [mockedUsers[5]],
    },
  ];

  const mockedFavoriteData: DashboardProps[] = [
    {
      saved: true,
    },
    {
      saved: true,
    },
    {
      saved: true,
      sharedBy: [mockedUsers[1], mockedUsers[6]],
    },
    {
      saved: true,
      sharedBy: [mockedUsers[6]],
    },
    {
      saved: true,
    },
    {
      saved: true,
      sharedWith: [mockedUsers[9],mockedUsers[1] ]
    },

    {
      saved: true,
      sharedBy: [mockedUsers[9]],
    },
    {
      saved: true,
    },
  ];
  useEffect(() => {
    if (token === null) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex flex-col flex-1 items-center p-5 mt-12 md:mt-16 gap-5 md:gap-10">
      {/* Tabs */}
      <div className="flex w-full justify-center">
        <Tabs
          onChange={(index) =>
            setCurrentPage(
              index === 0 ? "explore" : index === 1 ? "shared" : "favorites"
            )
          }
        />
      </div>

      {/* Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-2  2xl:grid-cols-4 gap-5">
        {currentPage === "explore" &&
          mockedExplorarData.map((dashboard, i) => {
            return (
              <Dashboard
                saved={dashboard.saved}
                sharedBy={dashboard.sharedBy}
                sharedWith={dashboard.sharedWith}
                key={`${i}-explore`}
              />
            );
          })}

        {currentPage === "shared" &&
          mockedSharedData.map((dashboard, i) => {
            return (
              <Dashboard
                saved={dashboard.saved}
                sharedBy={dashboard.sharedBy}
                key={`${i}-shared`}
              />
            );
          })}

        {currentPage === "favorites" &&
          mockedFavoriteData.map((dashboard, i) => {
            return (
              <Dashboard
                saved={dashboard.saved}
                sharedBy={dashboard.sharedBy}
                key={`${i}-favorite`}
              />
            );
          })}
      </div>
    </div>
  );
}
