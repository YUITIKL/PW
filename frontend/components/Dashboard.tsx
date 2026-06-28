"use client";

import {
  ArrowsCounterClockwiseIcon,
  BookmarkSimpleIcon,
  PaperPlaneTiltIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { ISharedWith, IUser } from "@/app/utils/types";
import { useAuth } from "@/hooks/useAuth";
import Toast from "./Toast";

type DashboardProps = {
  sharedBy: string[];
  saved: boolean;
  metabase_dashboard_id: number;
  refetch: () => void;
};

function MetabaseDashboard({ dashboardId }: { dashboardId: number }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch(`/api/metabase/dashboard/${dashboardId}`)
      .then((res) => res.json())
      .then((data) => setUrl(data.url));
  }, [dashboardId]);

  if (!url) return <p>Carregando dashboard...</p>;

  return (
    <iframe src={url} className="w-full h-[800px] rounded-xl border bg-white" />
  );
}

export default function Dashboard({
  sharedBy,
  refetch,
  metabase_dashboard_id,
  saved,
}: DashboardProps) {
  const { userId, token } = useAuth();

  // Mouse está em cima do botão de salvo
  const [isHovered, setIsHovered] = useState(false);
  // Gerencia renderização do modal de compartilhamento
  const [showSharingModal, setShowSharingModal] = useState(false);
  // Usuários para compartilhar o dashboard (lista local)
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  // Usuários para cancelar o compartilhamento do dashboard (lista local)
  const [cancelShare, setCancelShare] = useState<IUser[]>([]);
  // Usuários com quem já foi compartilhado o dashboard
  const [sharedWith, setSharedWith] = useState<IUser[]>([]);
  // Lista de usuários ativos do sistema
  const [users, setUsers] = useState<IUser[]>([]);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  // Gerencia criação e remoção de compartilhamentos
  const handleShares = () => {
    handleShare(selectedUsers.map((u) => u._id));
    handleRemoveShare(cancelShare.map((u) => u._id));
  };

  // Compartilha dashboard
  const handleShare = async (userIds: string[]) => {
    try {
      const url = `http://localhost:3001/api/dashboards/${metabase_dashboard_id}/share`;

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds }),
      });

      refetch();
    } catch (error) {
      console.error("Erro ao compartilhar dashboard:", error);
      showToast(`Erro ao compartilhar dashboard: ${error}`, "error");
    }
  };

  // Gerencia criação e remoção de compartilhamentos
  const handleRemoveShare = async (userIds: string[]) => {
    try {
      const url = `http://localhost:3001/api/dashboards/${metabase_dashboard_id}/share`;

      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds }),
      });

      refetch();
    } catch (error) {
      console.error("Erro ao remover compartilhamento de dashboard:", error);
      showToast(`Erro ao remover compartilhamento de dashboard: ${error}`, "error");
    }
  };

  // Gerencia novos compartilhamentos, deixando salvo em lista no state
  // para só chamar o endpoint quando o usuário finalizar todas as operações
  const handleShareLocally = (user: IUser) => {
    let selected = [...selectedUsers];
    if (selectedUsers.map((u) => u._id).includes(user._id)) {
      selected = selected.filter((u) => u._id !== user._id);
    } else {
      selected.push(user);
    }

    setSelectedUsers(selected);
  };

  // Gerencia remoção de compartilhamentos, deixando salvo em lista no state
  // para só chamar o endpoint quando o usuário finalizar todas as operações
  const handleRemoveShareLocally = (user: IUser) => {
    let removedShares = [...cancelShare];
    if (cancelShare.map((u) => u._id).includes(user._id)) {
      removedShares = removedShares.filter((u) => u._id !== user._id);
    } else {
      removedShares.push(user);
    }
    setCancelShare(removedShares);
  };

  // Favorita dashboard
  const handleSave = async () => {
    if (saved) handleRemoveSave();
    try {
      const url = `http://localhost:3001/api/dashboards/${metabase_dashboard_id}/favorite`;

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      refetch();
    } catch (error) {
      console.error("Erro ao favoritar dashboard:", error);
      showToast(`Erro ao favoritar dashboard: ${error}`, "error");
    }
  };

  // Desfavorita dashboard
  const handleRemoveSave = async () => {
    try {
      const url = `http://localhost:3001/api/dashboards/${metabase_dashboard_id}/favorite`;

      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      refetch();
    } catch (error) {
      console.error("Erro ao desfavoritar dashboard:", error);
      showToast(`Erro ao desfavoritar dashboard: ${error}`, "error");
    }
  };

  // Seleciona os compartilhamentos deste dashboards feitos pelo usuário
  useEffect(() => {
    const getSharesFromMe = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/dashboards/${metabase_dashboard_id}/shares`,
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
        console.error("Erro ao buscar dados:", error);
        showToast(`Erro ao buscar dados: ${error}`, "error");
      }
    };

    getSharesFromMe();
  }, [metabase_dashboard_id, userId, token]);

  // Busca todos os usuários (menos o autenticado)
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/users`, {
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

    getUsers();
  }, [metabase_dashboard_id, userId, token]);

  return (
    <div className="flex flex-col rounded-md border-gray-100 border-1 shadow-md p-2 w-[450px] max-w-full h-[300px] justify-between">
      {/* Metabade Dashboard */}
      <div className="rounded-md border-gray-100 border-1 w-full h-[85%] bg-gray-100">
        <MetabaseDashboard dashboardId={metabase_dashboard_id} />
      </div>

      {/* Dashboard data */}
      <div className="flex flex-row items-center justify-between mb-1">
        <p className="text-sm text-common text-gray-800 italic">
          {sharedBy ? `Compartilhado por ${sharedBy.join(", ")}` : ""}
        </p>
        <div className="flex gap-2 items-center">
          <button
            className="hover:cursor-pointer"
            onClick={() => {
              setShowSharingModal(true);
            }}
          >
            <PaperPlaneTiltIcon
              className="text-gray-800"
              size={20}
              weight={sharedWith && sharedWith.length > 0 ? "fill" : "regular"}
            />
          </button>
          <button
            className="hover:cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleSave}
          >
            <BookmarkSimpleIcon
              className="text-gray-800"
              size={20}
              weight={saved || isHovered ? "fill" : "regular"}
            />
          </button>
        </div>
      </div>

      <Modal
        title="Compartilhar"
        content={
          <div className="flex flex-col gap-5">
            {sharedWith && sharedWith.length > 0 && (
              <div className="flex flex-col">
                <p className="font-title text-base font-medium ">
                  Compartilhado com:
                </p>

                <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                  {sharedWith.map((user, i) => {
                    const isOnCancelList = cancelShare
                      .map((u) => u._id)
                      .includes(user._id);
                    return (
                      <div
                        key={i}
                        className={`flex py-1 px-2 justify-between items-center my-1 border-[1px] border-gray-200 shadow-md rounded-md  ${
                          isOnCancelList && "bg-gray-200"
                        }`}
                      >
                        <p>{user.nome}</p>

                        <button
                          className="hover:cursor-pointer"
                          onClick={() => {
                            handleRemoveShareLocally(user);
                          }}
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
              <p className="font-title text-base font-medium ">Enviar para:</p>
              <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                {users
                  .filter(
                    (user) =>
                      !sharedWith ||
                      !sharedWith.map((u) => u._id).includes(user._id)
                  )
                  .map((user, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        handleShareLocally(user);
                      }}
                      className={`flex py-1 px-2 justify-between items-center my-1 border-[1px] border-gray-200 shadow-sm rounded-md hover:bg-sky-800/10 hover:cursor-pointer ${
                        selectedUsers.map((u) => u._id).includes(user._id) &&
                        "bg-sky-800/30"
                      }`}
                    >
                      <p>
                        {user.nome} ({user.username})
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        }
        button={[
          <Button
            key="cancel"
            text="Cancelar"
            onClick={() => {
              setShowSharingModal(false);
            }}
          />,
          <Button
            key="confirm"
            text="Compartilhar"
            onClick={() => {
              handleShares();
              setShowSharingModal(false);
            }}
          />,
        ]}
        onClose={() => {
          setShowSharingModal(false);
        }}
        isOpen={showSharingModal}
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
