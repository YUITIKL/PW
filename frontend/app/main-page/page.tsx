"use client";

import Dashboard from "@/components/Dashboard";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
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
import { IDashboard, ISharedWith, IUser } from "../utils/types";

type Pages = "national" | "city" | "shared" | "favorites";
type DashboardMode = "national" | "city";

function getDashboardMode(dashboard?: IDashboard): DashboardMode {
  const text = `${dashboard?.nome ?? ""} ${dashboard?.descricao ?? ""}`.toLowerCase();
  return text.includes("nacional") ? "national" : "city";
}

function getSharedBy(dashboard: IDashboard, userId: string | null) {
  return dashboard.compartilhado_com
    .filter((share) => share.to._id === userId)
    .map((share) => share.from.username);
}

function formatDashboardButton({
  dashboard,
  mode,
}: {
  dashboard?: IDashboard;
  mode: DashboardMode;
}) {
  const scope = mode === "national" ? "Nacional" : "Município";

  return dashboard?.nome ?? scope;
}

export default function MainScreen() {
  const { token, userId } = useAuth();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<Pages>("national");
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  const [savedDashboards, setSavedDashboards] = useState<IDashboard[]>([]);
  const [sharedDashboards, setSharedDashboards] = useState<IDashboard[]>([]);
  const [selectedShared, setSelectedShared] = useState<number | null>(null);
  const [selectedFavorite, setSelectedFavorite] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [sharedWith, setSharedWith] = useState<IUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
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
    const getDashboards = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/dashboards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setDashboards(data);
      } catch (error) {
        console.error("Erro ao buscar dashboards:", error);
        showToast(`Erro ao buscar dashboards: ${error}`, "error");
      }
    };

    if (token) getDashboards();
  }, [reloadKey, token]);

  useEffect(() => {
    const getSavedDashboards = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/dashboards/saved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setSavedDashboards(data);
        setSelectedFavorite((current) =>
          current === null && data.length > 0 ? data[0].metabase_dashboard_id : current
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
        const response = await fetch("http://localhost:3001/api/dashboards/shared", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setSharedDashboards(data);
        setSelectedShared((current) =>
          current === null && data.length > 0 ? data[0].metabase_dashboard_id : current
        );
      } catch (error) {
        console.error("Erro ao buscar dashboards compartilhados:", error);
        showToast(`Erro ao buscar compartilhados: ${error}`, "error");
      }
    };

    if (token) getSharedDashboards();
  }, [reloadKey, token]);

  const nationalDashboard = useMemo(
    () => dashboards.find((dashboard) => getDashboardMode(dashboard) === "national"),
    [dashboards]
  );

  const cityDashboard = useMemo(
    () => dashboards.find((dashboard) => getDashboardMode(dashboard) === "city"),
    [dashboards]
  );

  const selectedSharedDashboard = useMemo(
    () =>
      sharedDashboards.find(
        (dashboard) => dashboard.metabase_dashboard_id === selectedShared
      ),
    [selectedShared, sharedDashboards]
  );

  const selectedFavoriteDashboard = useMemo(
    () =>
      savedDashboards.find(
        (dashboard) => dashboard.metabase_dashboard_id === selectedFavorite
      ),
    [selectedFavorite, savedDashboards]
  );

  const activeDashboard =
    currentPage === "national"
      ? nationalDashboard
      : currentPage === "city"
      ? cityDashboard
      : currentPage === "shared"
      ? selectedSharedDashboard
      : selectedFavoriteDashboard;

  const activeMode =
    currentPage === "national" ? "national" : getDashboardMode(activeDashboard);

  const isActiveSaved =
    Boolean(activeDashboard) &&
    activeDashboard!.salvos_por.map((user) => user._id).includes(userId!);

  const activeDashboardId = activeDashboard?.metabase_dashboard_id;

  useEffect(() => {
    if (!token || !activeDashboardId) return;

    const getUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
          `http://localhost:3001/api/dashboards/${activeDashboardId}/shares`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setSharedWith(
          data.filter((share: ISharedWith) => share.from._id === userId)
        );
      } catch (error) {
        console.error("Erro ao buscar compartilhamentos:", error);
        showToast(`Erro ao buscar compartilhamentos: ${error}`, "error");
      }
    };

    getUsers();
    getSharesFromMe();
  }, [activeDashboardId, token, userId]);

  const openSharingModal = () => {
    setSelectedUsers([]);
    setCancelShare([]);
    setShowSharingModal(true);
  };

  const handleFavorite = async () => {
    if (!activeDashboardId) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/dashboards/${activeDashboardId}/favorite`,
        {
          method: isActiveSaved ? "DELETE" : "POST",
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
        isActiveSaved ? "Dashboard removido dos favoritos" : "Dashboard favoritado",
        "success"
      );
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      showToast(`Erro ao atualizar favorito: ${error}`, "error");
    }
  };

  const handleShare = async (userIds: string[]) => {
    if (!activeDashboardId || userIds.length === 0) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/dashboards/${activeDashboardId}/share`,
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

  const handleRemoveShare = async (userIds: string[]) => {
    if (!activeDashboardId || userIds.length === 0) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/dashboards/${activeDashboardId}/share`,
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

  const handleShareLocally = (user: IUser) => {
    setSelectedUsers((current) =>
      current.map((item) => item._id).includes(user._id)
        ? current.filter((item) => item._id !== user._id)
        : [...current, user]
    );
  };

  const handleRemoveShareLocally = (user: IUser) => {
    setCancelShare((current) =>
      current.map((item) => item._id).includes(user._id)
        ? current.filter((item) => item._id !== user._id)
        : [...current, user]
    );
  };

  const handleConfirmShare = async () => {
    await handleShare(selectedUsers.map((user) => user._id));
    await handleRemoveShare(cancelShare.map((user) => user._id));
    setShowSharingModal(false);
    setReloadKey((current) => current + 1);
  };

  const renderSidebar = (
    items: IDashboard[],
    selectedId: number | null,
    onSelect: (id: number) => void,
    emptyText: string,
    showSharedBy = false
  ) => (
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
          const active = selectedId === dashboard.metabase_dashboard_id;

          return (
            <button
              key={dashboard.metabase_dashboard_id}
              onClick={() => onSelect(dashboard.metabase_dashboard_id)}
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
        {currentPage === "shared" &&
          renderSidebar(
            sharedDashboards,
            selectedShared,
            setSelectedShared,
            "Nenhum dashboard compartilhado com você.",
            true
          )}

        {currentPage === "favorites" &&
          renderSidebar(
            savedDashboards,
            selectedFavorite,
            setSelectedFavorite,
            "Nenhum dashboard favoritado."
          )}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-4 py-3">
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

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                disabled={!activeDashboardId}
                onClick={openSharingModal}
                className="rounded-md p-2 text-gray-800 transition-colors hover:bg-sky-800/10 disabled:pointer-events-none disabled:opacity-40"
                aria-label="Compartilhar dashboard"
                title="Compartilhar"
              >
                <PaperPlaneTiltIcon size={22} weight="regular" />
              </button>
              <button
                type="button"
                disabled={!activeDashboardId}
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

          <div className="min-h-0 flex-1 overflow-hidden">
            {activeDashboard || currentPage === "national" || currentPage === "city" ? (
              <Dashboard
                mode={activeMode}
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center bg-gray-50">
                <p className="font-title text-lg italic text-gray-400">
                  Selecione um dashboard na lateral
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
                        <p>{user.nome}</p>

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
                {users
                  .filter(
                    (user) =>
                      !sharedWith.map((item) => item._id).includes(user._id)
                  )
                  .map((user) => (
                    <button
                      type="button"
                      key={user._id}
                      onClick={() => handleShareLocally(user)}
                      className={`my-1 flex items-center justify-between rounded-md border border-gray-200 px-2 py-1 text-left shadow-sm hover:cursor-pointer hover:bg-sky-800/10 ${
                        selectedUsers.map((item) => item._id).includes(user._id) &&
                        "bg-sky-800/30"
                      }`}
                    >
                      <span>
                        {user.nome} ({user.username})
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
          <Button key="confirm" text="Compartilhar" onClick={handleConfirmShare} />,
        ]}
        onClose={() => setShowSharingModal(false)}
        isOpen={showSharingModal}
      />
    </div>
  );
}
