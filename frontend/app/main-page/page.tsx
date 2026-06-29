"use client";

import Dashboard from "@/components/Dashboard";
import Tabs from "@/components/Tabs";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IDashboard } from "../utils/types";
import Toast from "@/components/Toast";
import Button from "@/components/Button";
import { SlidersHorizontalIcon } from "@phosphor-icons/react";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import DateInput from "@/components/DateInput";

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
  // Filtros
  const [filters, setFilters] = useState<{
    startDate: string | undefined;
    endDate: string | undefined;
    state: { id: number; nome: string; sigla: string } | undefined;
    city: { id: number; nome: string } | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
    state: undefined,
    city: undefined,
  });
  // Modal de filtros
  const [showFilterModal, setShowFilterModal] = useState(false);
  // Estados
  const [states, setStates] = useState<
    { id: number; nome: string; sigla: string }[]
  >([]);
  // Cidades
  const [cities, setCities] = useState<{ id: number; nome: string }[]>([]);

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

  // Verifica se tem todos os filtros necessários
  const validateFilters = () => {
    const { startDate, endDate, state, city } = filters;
    return startDate && endDate && state && city;
  };

  // Busca UFs
  useEffect(() => {
    const getStates = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/locations/states"
        );

        if (!response.ok) return;

        const data = await response.json();

        setStates(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
        showToast(`Erro ao buscar estados: ${error}`, "error");
      }
    };

    getStates();
  }, []);

  // Busca cidades
  useEffect(() => {
    if (filters.state) {
      const getCities = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/locations/cities/${filters.state!.sigla}`
          );

          if (!response.ok) return;

          const data = await response.json();

          setCities(data);
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
          showToast(`Erro ao buscar cidades: ${error}`, "error");
        }
      };

      getCities();
    }
  }, [filters.state]);

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
      <div className="flex flex-col w-full gap-4 items-center">
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

        {/* Filtros */}
        <Button
          text="Filtros"
          onClick={() => {
            setShowFilterModal(true);
          }}
          icon={<SlidersHorizontalIcon size={20} />}
        />
      </div>

      {validateFilters() ? (
        <div className="grid grid-cols-1 md:grid-cols-2  2xl:grid-cols-4 gap-5">
          {/* Dashboards */}
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
      ) : (
        <div className="flex justify-center w-full my-10">
          <p className="text-xl font-title italic text-gray-400">
            Preencha todos os filtros para acessar os dashboards
          </p>
        </div>
      )}

      <Modal
        title="Filtros"
        content={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="UF"
              value={filters.state?.sigla ?? ""}
              onChange={(value) => {
                const selectedState = states.find(
                  (state) => state.sigla === value
                );

                setFilters((prev) => ({
                  ...prev,
                  state: selectedState,
                  city: undefined,
                }));
              }}
              placeholder="Selecione um estado"
              options={states.map((state) => ({
                value: state.sigla,
                label: state.nome,
              }))}
            />
            <Select
              label="Cidade"
              value={filters.city?.nome ?? ""}
              onChange={(value) => {
                const selectedCity = cities.find((city) => city.nome === value);

                setFilters((prev) => ({
                  ...prev,
                  city: selectedCity,
                }));
              }}
              placeholder="Selecione uma cidade"
              options={cities.map((city) => ({
                value: city.nome,
                label: city.nome,
              }))}
            />
            <DateInput
              label="Data inicial"
              value={filters.startDate ?? ""}
              onChange={(value) => {
                setFilters((prev) => ({ ...prev, startDate: value }));
              }}
            />
            <DateInput
              label="Data final"
              value={filters.endDate ?? ""}
              onChange={(value) => {
                setFilters((prev) => ({ ...prev, endDate: value }));
              }}
            />
          </div>
        }
        button={[
          <Button
            key="save"
            text="Fechar"
            onClick={() => {
              setShowFilterModal(false);
            }}
          />,
        ]}
        onClose={() => {
          setShowFilterModal(false);
        }}
        isOpen={showFilterModal}
      />

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
