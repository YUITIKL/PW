"use client";

type DashboardMode = "national" | "city";

type DashboardProps = {
  mode: DashboardMode;
  city?: string;
  startDate?: string;
  endDate?: string;
};

const METABASE_DASHBOARD_BASE_URL =
  "https://raft-jot-raffle.ngrok-free.dev/public/dashboard/";

export const DEFAULT_NATIONAL_DASHBOARD_ID = "9f134c46-a154-4805-beed-1f9847cb286e";

export const DEFAULT_CITY_DASHBOARD_ID = "90d5cce2-97c4-4a69-8e16-4ba918635ab5";

// Cria a URL do dashboard
function buildDashboardUrl({ mode, city, startDate, endDate }: DashboardProps) {
  const dashboardId =
    mode === "national"
      ? DEFAULT_NATIONAL_DASHBOARD_ID
      : DEFAULT_CITY_DASHBOARD_ID;

  const url = new URL(`${METABASE_DASHBOARD_BASE_URL}${dashboardId}`);

  if (startDate) {
    url.searchParams.set("data_inicio", startDate);
  }

  if (endDate) {
    url.searchParams.set("data_fim", endDate);
  }

  if (mode === "city" && city) {
    url.searchParams.set("cidade", city);
  }

  url.hash = "hide_parameters=data_inicio,data_fim,cidade";

  return url.toString();
}

export default function Dashboard({
  mode,
  city,
  startDate,
  endDate,
}: DashboardProps) {
  return (
    <iframe
      src={buildDashboardUrl({ mode, city, startDate, endDate })}
      className="h-full w-full border-0 bg-white"
      title={mode === "national" ? "Dashboard nacional" : "Dashboard municipal"}
    />
  );
}
