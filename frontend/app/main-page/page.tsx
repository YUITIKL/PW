"use client";

import Dashboard from "@/components/Dashboard";
import Tabs from "@/components/Tabs";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IDashboard } from "../utils/types";
import Toast from "@/components/Toast";

type Pages = "explore" | "shared" | "favorites";

export default function MainScreen() {
  const { token, userId } = useAuth();
  const router = useRouter();

  // Tab atual
  const [currentPage, setCurrentPage] = useState<Pages>("explore");
  // Todos os dashboards cadastrados
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  // Dashboards salvos pelo usuário
  const [savedDashboards, setSavedDashboards] = useState<IDashboard[]>([]);
  // Dashboards compartilhados com o usuário
  const [sharedDashboards, setSharedDashboards] = useState<IDashboard[]>([]);

  const [refetch, setRefetch] = useState(0);

  // Chama novamente os endpoints
  const triggerRefetch = () => setRefetch(refetch + 1);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  // Busca todos os dashboards
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

    getDashboards();
  }, [refetch, token]);

  // Busca todos os dashboards salvos
  useEffect(() => {
    const getSavedDashboards = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/dashboards/saved",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        setSavedDashboards(data);
      } catch (error) {
        console.error("Erro ao buscar dashboards salvos:", error);
        showToast(`Erro ao buscar dashboards salvos: ${error}`, "error");
      }
    };

    getSavedDashboards();
  }, [refetch, token]);

  // Busca todos os dashboards compartilhados com o usuário
  useEffect(() => {
    const getSharedDashboards = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/dashboards/shared",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        setSharedDashboards(data);
      } catch (error) {
        console.error("Erro ao buscar dashboards compartilhados:", error);
        showToast(`Erro ao buscar compartilhados: ${error}`, "error");
      }
    };

    getSharedDashboards();
  }, [refetch, token]);

  // Valida se existe usuário logado
  useEffect(() => {
    if (!token || !userId) router.push("/");
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
          dashboards.map((dashboard, i) => {
            return (
              <Dashboard
                saved={dashboard.salvos_por
                  .map((dashboard) => dashboard._id)
                  .includes(userId!)}
                sharedBy={dashboard.compartilhado_com
                  .filter((shares) => shares.to._id === userId)
                  .map((shares) => shares.from.username)}
                key={`${i}-explore`}
                refetch={triggerRefetch}
                metabase_dashboard_id={dashboard.metabase_dashboard_id}
              />
            );
          })}

        {currentPage === "shared" &&
          sharedDashboards.map((dashboard, i) => {
            return (
              <Dashboard
                saved={dashboard.salvos_por
                  .map((dashboard) => dashboard._id)
                  .includes(userId!)}
                sharedBy={dashboard.compartilhado_com
                  .filter((shares) => shares.to._id === userId)
                  .map((shares) => shares.from.username)}
                key={`${i}-shared`}
                refetch={triggerRefetch}
                metabase_dashboard_id={dashboard.metabase_dashboard_id}
              />
            );
          })}

        {currentPage === "favorites" &&
          savedDashboards.map((dashboard, i) => {
            return (
              <Dashboard
                saved={true}
                sharedBy={dashboard.compartilhado_com
                  .filter((shares) => shares.to._id === userId)
                  .map((shares) => shares.from.username)}
                key={`${i}-favorite`}
                refetch={triggerRefetch}
                metabase_dashboard_id={dashboard.metabase_dashboard_id}
              />
            );
          })}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
