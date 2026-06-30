"use client";

import {
  formatDashboardButton,
  getDashboardMode,
  getSharedBy,
} from "@/app/utils/dashboardFunctions";
import { IDashboard } from "@/app/utils/types";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar(
  {items,
  selectedId,
  onSelect,   
  emptyText,
  showSharedBy = false}:
  {items: IDashboard[],
  selectedId: string | null,
  onSelect: (id: string) => void,
  emptyText: string,
  showSharedBy?: boolean}
) {
  const { userId } = useAuth();
  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-gray-200 bg-gray-50 md:w-[280px]">
      <div className="border-b border-gray-200 px-4 py-3">
        <p className="font-title text-base font-semibold text-sky-900">
          Dashboards
        </p>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto p-3">
        {items.length === 0 && (
          <p className="px-2 py-4 text-sm italic text-gray-500">{emptyText}</p>
        )}

        {items.map((dashboard) => {
          const mode = getDashboardMode(dashboard);
          const sharedBy = getSharedBy(dashboard, userId);
          const active = selectedId === dashboard._id;

          return (
            <button
              key={dashboard._id}
              onClick={() => onSelect(dashboard._id)}
              className={`flex flex-col gap-1 rounded-md border px-3 py-2 text-left transition-colors ${
                active
                  ? "border-sky-800 bg-sky-800 text-white"
                  : "border-gray-200 bg-white text-gray-800 hover:border-sky-700"
              }`}
            >
              <span className="font-title text-sm font-semibold">
                {formatDashboardButton({ dashboard, mode })}
              </span>
              {showSharedBy && sharedBy.length > 0 && (
                <span
                  className={`text-xs italic ${
                    active ? "text-sky-100" : "text-gray-500"
                  }`}
                >
                  Compartilhado por {sharedBy.join(", ")}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
