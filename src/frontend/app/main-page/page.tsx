"use client";

import Dashboard, {
  DEFAULT_CITY_DASHBOARD_ID,
  DEFAULT_NATIONAL_DASHBOARD_ID,
} from "@/components/Dashboard";
import Button from "@/components/Button";
import DateInput from "@/components/DateInput";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Tabs from "@/components/Tabs";
import Toast from "@/components/Toast";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowsCounterClockwiseIcon,
  BookmarkSimpleIcon,
  PaperPlaneTiltIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AVAILABLE_CITIES } from "../utils/availableCities";
import {
  DashboardMode,
  Filters,
  IDashboard,
  ISharedWith,
  IUser,
  Pages,
} from "../utils/types";
import {
  dashboardMatchesFilters,
  formatDateInputValue,
  getDashboardMode,
  getDateOneMonthAgo,
  getSharedBy,
  getUserId,
} from "../utils/dashboardFunctions";
import Sidebar from "@/components/Sidebar";

// Por default a data de início é um mês atrás e a data final é hoje
const INITIAL_FILTERS: Filters = {
  city: AVAILABLE_CITIES[0],
  startDate: getDateOneMonthAgo(),
  endDate: formatDateInputValue(new Date()),
};

export default function MainScreen() {
  const { token, userId } = useAuth();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<Pages>("national");
  const [savedDashboards, setSavedDashboards] = useState<IDashboard[]>([]);
  const [sharedDashboards, setSharedDashboards] = useState<IDashboard[]>([]);
  // Dashboard compartilhado que foi selecionado para visualização
  const [selectedShared, setSelectedShared] = useState<string | null>(null);
  // Dashboard favoritado que foi selecionado para visualização
  const [selectedFavorite, setSelectedFavorite] = useState<string | null>(null);
  // Salva os dados do dashboard que acabou de ser favoritado/compartilhado
  const [currentDashboardRecord, setCurrentDashboardRecord] =
    useState<IDashboard | null>(null);
  // Filtros do dashboard (data inicial, data final, cidade [no municipal])
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  // Refetch nos endpoints
  const [reloadKey, setReloadKey] = useState(0);
  // Gerencia visibilidade do modal de compartilhamento
  const [showSharingModal, setShowSharingModal] = useState(false);
  // Todos os usuários cadastrados
  const [users, setUsers] = useState<IUser[]>([]);
  // Com quem eu já compartilhei o dashboard
  const [sharedWith, setSharedWith] = useState<IUser[]>([]);
  // Usuários selecionados para compartilhar (usado antes de chamar a API)
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  // Usuários selecionados para cancelar o compartilhamento (usado antes de chamar a API)
  const [cancelShare, setCancelShare] = useState<IUser[]>([]);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!token || !userId) router.push("/");
  }, [token, userId, router]);

  useEffect(() => {
    const getSavedDashboards = async () => {
      try {
        const response = await fetch(
          "https://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/dashboards/saved",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setSavedDashboards(data);
        setSelectedFavorite((current) =>
          current === null && data.length > 0 ? data[0]._id : current
        );
      } catch (error) {
        console.error("Erro ao buscar dashboards salvos:", error);
        showToast(`Erro ao buscar dashboards salvos: ${error}`, "error");
      }
    };

    if (token) getSavedDashboards();
  }, [reloadKey, token]);

  useEffect(() => {
    const getSharedDashboards = async () => {
      try {
        const response = await fetch(
          "https://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/dashboards/shared",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setSharedDashboards(data);
        setSelectedShared((current) =>
          current === null && data.length > 0 ? data[0]._id : current
        );
      } catch (error) {
        console.error("Erro ao buscar dashboards compartilhados:", error);
        showToast(`Erro ao buscar compartilhados: ${error}`, "error");
      }
    };

    if (token) getSharedDashboards();
  }, [reloadKey, token]);

  const selectedSharedDashboard = useMemo(
    () =>
      sharedDashboards.find((dashboard) => dashboard._id === selectedShared),
    [selectedShared, sharedDashboards]
  );

  const selectedFavoriteDashboard = useMemo(
    () =>
      savedDashboards.find((dashboard) => dashboard._id === selectedFavorite),
    [selectedFavorite, savedDashboards]
  );

  const currentMode: DashboardMode =
    currentPage === "city" ? "city" : "national";

  // Verifica se o dashboard aberto agora já está salvo
  const currentSavedDashboard = useMemo(
    () =>
      savedDashboards.find((dashboard) =>
        dashboardMatchesFilters(dashboard, currentMode, filters)
      ),
    [currentMode, filters, savedDashboards]
  );

  // Evita reutilizar ids antigos (se uso X filtros, salvo, e depois troco
  // os filtros, isso evita que continue usando o id do dash antigo do mongo caso eu vá agora realizar outra operação)
  const currentCreatedDashboard =
    currentDashboardRecord &&
    dashboardMatchesFilters(currentDashboardRecord, currentMode, filters)
      ? currentDashboardRecord
      : undefined;

  // Dashboard visível no momento
  const activeDashboard =
    currentPage === "national" || currentPage === "city"
      ? currentSavedDashboard ?? currentCreatedDashboard
      : currentPage === "shared"
      ? selectedSharedDashboard
      : selectedFavoriteDashboard;

  // Modo do dashboard visível no momento
  const activeMode =
    currentPage === "national" || currentPage === "city"
      ? currentMode
      : getDashboardMode(activeDashboard);

  const showDashboardFilters =
    currentPage === "national" || currentPage === "city";

  const iframeCity =
    currentPage === "city" ? filters.city : activeDashboard?.cidade;

  const iframeStartDate = showDashboardFilters
    ? filters.startDate
    : activeDashboard?.data_inicio ?? "";

  const iframeEndDate = showDashboardFilters
    ? filters.endDate
    : activeDashboard?.data_fim ?? "";

  const isActiveSaved =
    Boolean(activeDashboard) &&
    activeDashboard!.salvos_por
      .map((user) => getUserId(user))
      .includes(userId!);

  const activeDashboardId = activeDashboard?._id;

  // Define se pode salvar/compartilhar o dashboard atual (se tem o id do mongo ou os filtros necessários
  // pra criar um novo registro)
  const canPersistDashboard =
    Boolean(activeDashboardId) ||
    currentPage === "national" ||
    (currentPage === "city" && Boolean(filters.city));

  const usersAvailableToShare = users.filter(
    (user) => !sharedWith.map((item) => item._id).includes(user._id)
  );

  const createCurrentDashboard = async () => {
    if (!token) return null;

    const mode = currentPage === "city" ? "city" : "national";

    if (mode === "city" && !filters.city) {
      showToast(
        "Selecione um município antes de salvar ou compartilhar",
        "error"
      );
      return null;
    }

    const metabaseDashboardId =
      mode === "national"
        ? DEFAULT_NATIONAL_DASHBOARD_ID
        : DEFAULT_CITY_DASHBOARD_ID;

    try {
      const response = await fetch(
        "https://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/dashboards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome:
              mode === "national"
                ? `Nacional - ${filters.startDate} - ${filters.endDate}`
                : `${filters.city ?? "Municipal"} - ${filters.startDate} - ${
                    filters.endDate
                  }`,
            descricao:
              mode === "national"
                ? "Dashboard nacional"
                : `Dashboard municipal${
                    filters.city ? ` de ${filters.city}` : ""
                  }`,
            metabase_dashboard_id: metabaseDashboardId,
            data_inicio: filters.startDate,
            data_fim: filters.endDate,
            cidade: mode === "city" ? filters.city : undefined,
          }),
        }
      );

      if (!response.ok) {
        showToast("Erro ao criar dashboard", "error");
        return null;
      }

      const dashboard = await response.json();
      setCurrentDashboardRecord(dashboard);
      return dashboard as IDashboard;
    } catch (error) {
      console.error("Erro ao criar dashboard:", error);
      showToast(`Erro ao criar dashboard: ${error}`, "error");
      return null;
    }
  };

  const getOrCreateActiveDashboard = async () => {
    if (activeDashboard) return activeDashboard;

    if (currentPage !== "national" && currentPage !== "city") return null;

    return createCurrentDashboard();
  };

  useEffect(() => {
    if (!token || !activeDashboardId) return;

    const getUsers = async () => {
      try {
        const response = await fetch(
          "https://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/users/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        showToast(`Erro ao buscar usuários: ${error}`, "error");
      }
    };

    const getSharesFromMe = async () => {
      try {
        const response = await fetch(
          `https://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/dashboards/${activeDashboardId}/shares`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setSharedWith(
          data
            .filter((share: ISharedWith) => share.from._id === userId)
            .map((share: ISharedWith) => share.to)
        );
      } catch (error) {
        console.error("Erro ao buscar compartilhamentos:", error);
        showToast(`Erro ao buscar compartilhamentos: ${error}`, "error");
      }
    };

    getUsers();
    getSharesFromMe();
  }, [activeDashboardId, reloadKey, token, userId]);

  const openSharingModal = async () => {
    const dashboard = await getOrCreateActiveDashboard();
    if (!dashboard) return;

    setSelectedUsers([]);
    setCancelShare([]);
    setShowSharingModal(true);
  };

  // Favorita/desfavorita dashboard
  const handleFavorite = async () => {
    const dashboard = await getOrCreateActiveDashboard();
    if (!dashboard) return;

    const dashboardIsSaved = dashboard.salvos_por
      .map((user) => getUserId(user))
      .includes(userId!);

    try {
      const response = await fetch(
        `https://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/dashboards/${dashboard._id}/favorite`,
        {
          method: dashboardIsSaved ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        showToast("Erro ao atualizar favorito", "error");
        return;
      }

      setReloadKey((current) => current + 1);
      showToast(
        dashboardIsSaved
          ? "Dashboard removido dos favoritos"
          : "Dashboard favoritado",
        "success"
      );
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      showToast(`Erro ao atualizar favorito: ${error}`, "error");
    }
  };

  // Compartilha dashboard
  const handleShare = async (userIds: string[]) => {
    if (userIds.length === 0) return;

    const dashboard = await getOrCreateActiveDashboard();
    if (!dashboard) return;

    try {
      const response = await fetch(
        `https://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/dashboards/${dashboard._id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userIds }),
        }
      );

      if (!response.ok) {
        showToast("Erro ao compartilhar dashboard", "error");
        return;
      }

      showToast("Dashboard compartilhado", "success");
    } catch (error) {
      console.error("Erro ao compartilhar dashboard:", error);
      showToast(`Erro ao compartilhar dashboard: ${error}`, "error");
    }
  };

  // Cancela compartilhamento previamente realizado
  const handleRemoveShare = async (userIds: string[]) => {
    if (!activeDashboardId || userIds.length === 0) return;

    try {
      const response = await fetch(
        `https://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/dashboards/${activeDashboardId}/share`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userIds }),
        }
      );

      if (!response.ok) {
        showToast("Erro ao remover compartilhamento", "error");
        return;
      }

      showToast("Compartilhamento removido", "success");
    } catch (error) {
      console.error("Erro ao remover compartilhamento:", error);
      showToast(`Erro ao remover compartilhamento: ${error}`, "error");
    }
  };

  // Cria lista local de pra quem deve compartilhar (pra não chamar o endpoint várias vezes)
  const handleShareLocally = (user: IUser) => {
    setSelectedUsers((current) =>
      current.map((item) => item._id).includes(user._id)
        ? current.filter((item) => item._id !== user._id)
        : [...current, user]
    );
  };

  // Cria lista local de pra quem deve remover o compartilhamento (pra não chamar o endpoint várias vezes)
  const handleRemoveShareLocally = (user: IUser) => {
    setCancelShare((current) =>
      current.map((item) => item._id).includes(user._id)
        ? current.filter((item) => item._id !== user._id)
        : [...current, user]
    );
  };

  // Chama os endpoints pra compartilhar e remover compartilhamento
  const handleConfirmShare = async () => {
    await handleShare(selectedUsers.map((user) => user._id));
    await handleRemoveShare(cancelShare.map((user) => user._id));
    setShowSharingModal(false);
    setReloadKey((current) => current + 1);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white pt-12">
      <div className="shrink-0 border-b border-gray-200 px-4 py-4">
        <div className="flex w-full justify-center">
          <Tabs
            onChange={(index) =>
              setCurrentPage(
                index === 0
                  ? "national"
                  : index === 1
                  ? "city"
                  : index === 2
                  ? "shared"
                  : "favorites"
              )
            }
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {currentPage === "shared" && (
          <Sidebar
            items={sharedDashboards}
            selectedId={selectedShared}
            onSelect={setSelectedShared}
            emptyText={"Nenhum dashboard compartilhado com você."}
            showSharedBy={true}
          />
        )}

        {currentPage === "favorites" && (
          <Sidebar
            items={savedDashboards}
            selectedId={selectedFavorite}
            onSelect={setSelectedFavorite}
            emptyText={"Nenhum dashboard favoritado."}
          />
        )}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 flex-col items-stretch gap-3 border-b border-gray-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start justify-between gap-3 md:contents">
              <div className="min-w-0">
                <h2 className="font-title text-lg font-semibold text-sky-900">
                  {currentPage === "national"
                    ? "Dashboard nacional"
                    : currentPage === "city"
                    ? "Dashboard por município"
                    : activeDashboard?.nome ?? "Selecione um dashboard"}
                </h2>
                {currentPage === "shared" &&
                  activeDashboard &&
                  getSharedBy(activeDashboard, userId).length > 0 && (
                    <p className="text-sm italic text-gray-500">
                      Compartilhado por{" "}
                      {getSharedBy(activeDashboard, userId).join(", ")}
                    </p>
                  )}
              </div>

              <div className="flex shrink-0 items-center gap-2 md:order-3">
                <button
                  type="button"
                  disabled={!canPersistDashboard}
                  onClick={openSharingModal}
                  className="rounded-md p-2 text-gray-800 transition-colors hover:bg-sky-800/10 disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Compartilhar dashboard"
                  title="Compartilhar"
                >
                  <PaperPlaneTiltIcon size={22} weight="regular" />
                </button>
                <button
                  type="button"
                  disabled={!canPersistDashboard}
                  onClick={handleFavorite}
                  className="rounded-md p-2 text-gray-800 transition-colors hover:bg-sky-800/10 disabled:pointer-events-none disabled:opacity-40"
                  aria-label={
                    isActiveSaved
                      ? "Remover dashboard dos favoritos"
                      : "Salvar dashboard nos favoritos"
                  }
                  title={isActiveSaved ? "Remover dos favoritos" : "Salvar"}
                >
                  <BookmarkSimpleIcon
                    size={22}
                    weight={isActiveSaved ? "fill" : "regular"}
                  />
                </button>
              </div>
            </div>

            {showDashboardFilters && (
              <div className="grid min-w-0 w-full grid-cols-2 items-end gap-3 md:flex md:flex-1 md:flex-wrap md:justify-end">
                {currentPage === "city" && (
                  <div className="col-span-2 w-full md:w-[260px]">
                    <Select
                      label="Município"
                      value={filters.city ?? ""}
                      onChange={(value) =>
                        setFilters((current) => ({
                          ...current,
                          city: value || undefined,
                        }))
                      }
                      placeholder="Município"
                      options={AVAILABLE_CITIES.map((city) => ({
                        value: city,
                        label: city,
                      }))}
                    />
                  </div>
                )}

                <div className="w-full md:w-[170px]">
                  <DateInput
                    label="Data inicial"
                    value={filters.startDate}
                    onChange={(value) =>
                      setFilters((current) => ({
                        ...current,
                        startDate: value,
                      }))
                    }
                  />
                </div>

                <div className="w-full md:w-[170px]">
                  <DateInput
                    label="Data final"
                    value={filters.endDate}
                    onChange={(value) =>
                      setFilters((current) => ({
                        ...current,
                        endDate: value,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {activeDashboard ||
            currentPage === "national" ||
            currentPage === "city" ? (
              <Dashboard
                mode={activeMode}
                city={iframeCity}
                startDate={iframeStartDate}
                endDate={iframeEndDate}
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center bg-gray-50">
                <p className="font-title text-lg italic text-gray-400">
                  Selecione um dashboard
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Modal
        title="Compartilhar"
        content={
          <div className="flex flex-col gap-5">
            {sharedWith.length > 0 && (
              <div className="flex flex-col">
                <p className="font-title text-base font-medium">
                  Compartilhado com:
                </p>

                <div className="flex max-h-[200px] flex-col gap-1 overflow-y-auto">
                  {sharedWith.map((user) => {
                    const isOnCancelList = cancelShare
                      .map((item) => item._id)
                      .includes(user._id);

                    return (
                      <div
                        key={user._id}
                        className={`my-1 flex items-center justify-between rounded-md border border-gray-200 px-2 py-1 shadow-md ${
                          isOnCancelList && "bg-gray-200"
                        }`}
                      >
                        <p>
                          {user.nome}{" "}
                          <span className="font-light italic text-gray-500">
                            ({user.username})
                          </span>
                        </p>

                        <button
                          type="button"
                          className="hover:cursor-pointer"
                          onClick={() => handleRemoveShareLocally(user)}
                        >
                          {isOnCancelList ? (
                            <ArrowsCounterClockwiseIcon
                              className="text-gray-900"
                              size={16}
                            />
                          ) : (
                            <XCircleIcon className="text-red-500" size={16} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col">
              <p className="font-title text-base font-medium">Enviar para:</p>
              <div className="flex max-h-[200px] flex-col gap-1 overflow-y-auto">
                {usersAvailableToShare.length === 0 && (
                  <p className="px-2 py-3 text-sm italic text-gray-500">
                    Nenhum usuário disponível
                  </p>
                )}

                {usersAvailableToShare.map((user) => (
                  <button
                    type="button"
                    key={user._id}
                    onClick={() => handleShareLocally(user)}
                    className={`my-1 flex items-center justify-between rounded-md border border-gray-200 px-2 py-1 text-left shadow-sm hover:cursor-pointer hover:bg-sky-800/10 ${
                      selectedUsers
                        .map((item) => item._id)
                        .includes(user._id) && "bg-sky-800/30"
                    }`}
                  >
                    <span>
                      {user.nome}{" "}
                      <span className="font-light italic text-gray-500">
                        ({user.username})
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
        button={[
          <Button
            key="cancel"
            text="Cancelar"
            onClick={() => setShowSharingModal(false)}
          />,
          <Button key="confirm" text="Salvar" onClick={handleConfirmShare} />,
        ]}
        onClose={() => setShowSharingModal(false)}
        isOpen={showSharingModal}
      />
    </div>
  );
}
