"use client";

type DashboardProps = {
  city?: string;
  startDate?: string;
  endDate?: string;
  id: string;
};

const FIXED_DASHBOARD_URL =
  "https://raft-jot-raffle.ngrok-free.dev/public/dashboard/";

function buildDashboardUrl({ city, startDate, endDate, id }: DashboardProps) {
  const url = new URL(`${FIXED_DASHBOARD_URL}${id}`);
  if (city) {
    url.searchParams.set("cidade", city);
  }
  if (startDate) {
    url.searchParams.set("data_inicio", startDate);
  }
  if (endDate) {
    url.searchParams.set("data_fim", endDate);
  }

  return url.toString();
}

export default function Dashboard({ mode, city }: DashboardProps) {
  if (mode === "city" && !city) {
    return (
      <div className="flex h-full items-center justify-center border border-gray-200 bg-gray-50">
        <p className="font-title text-lg italic text-gray-400">
          Selecione um dashboard para visualizar
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={buildDashboardUrl( city, startDate ?? null, endDate ?? null, metabase_dashboard_id)}
      className="h-full w-full border-0 bg-white"
      title={mode === "national" ? "Dashboard nacional" : "Dashboard municipal"}
    />
  );
}
