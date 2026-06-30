"use client";

type DashboardMode = "national" | "city";

type DashboardProps = {
  mode: DashboardMode;
  city?: string;
};

const FIXED_DASHBOARD_URL =
  "https://raft-jot-raffle.ngrok-free.dev/public/dashboard/9f134c46-a154-4805-beed-1f9847cb286e?data_fim=2026-01-08&data_inicio=2026-01-01";

const CITY_DASHBOARD_URL =
  "https://raft-jot-raffle.ngrok-free.dev/public/dashboard/ae2a1b8d-b74e-4c77-8e7b-6e52c4794ea5";

function buildDashboardUrl({
  mode,
  city,
}: DashboardProps) {
  if (mode === "national") {
    return FIXED_DASHBOARD_URL;
  }

  const url = new URL(CITY_DASHBOARD_URL);
  if (mode === "city" && city) {
    url.searchParams.set("cidade", city);
  }

  return url.toString();
}

export default function Dashboard({
  mode,
  city,
}: DashboardProps) {
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
      src={buildDashboardUrl({ mode, city })}
      className="h-full w-full border-0 bg-white"
      title={mode === "national" ? "Dashboard nacional" : "Dashboard municipal"}
    />
  );
}
