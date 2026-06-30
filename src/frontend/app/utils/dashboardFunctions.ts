import { DashboardMode, Filters, IDashboard, IUser } from "./types";

export function getDashboardMode(dashboard?: IDashboard): DashboardMode {
  return dashboard?.cidade ? "city" : "national";
}

export function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDateOneMonthAgo() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();
  const date = new Date(year, month - 1, Math.min(day, lastDayOfPreviousMonth));

  return formatDateInputValue(date);
}

export function getUserId(user: IUser | string) {
  return typeof user === "string" ? user : user._id;
}

// Quem compartilhou o dashboard comigo
export function getSharedBy(dashboard: IDashboard, userId: string | null) {
  return dashboard.compartilhado_com
    .filter((share) => share.to._id === userId)
    .map((share) => share.from.username);
}

export function formatDashboardButton({
  dashboard,
  mode,
}: {
  dashboard?: IDashboard;
  mode: DashboardMode;
}) {
  const scope = mode === "national" ? "Nacional" : "Municipal";

  return dashboard?.nome ?? scope;
}

export function dashboardMatchesFilters(
  dashboard: IDashboard,
  mode: DashboardMode,
  filters: Filters
) {
  const sameDates =
    (dashboard.data_inicio ?? "") === filters.startDate &&
    (dashboard.data_fim ?? "") === filters.endDate;

  if (mode === "national") {
    return sameDates && !dashboard.cidade;
  }

  return sameDates && dashboard.cidade === filters.city;
}
