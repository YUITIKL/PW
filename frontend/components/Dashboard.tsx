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
import { DashboardProps, mockedUsers, User } from "@/app/utils/types";

function MetabaseDashboard({ dashboardId }: { dashboardId: number }) {
  const [url, setUrl] = useState("");

  // TODO adaptar conforme backend
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
  sharedWith,
  saved,
}: DashboardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [cancelShare, setCancelShare] = useState<User[]>([]);
  // TODO linkar com metabase dashboard

  const handleGetUsers = () => {
    // TODO
    return mockedUsers;
  };

  const handleShare = () => {
    // TODO
  };

  const handleRemoveShare = (user: User) => {
    // TODO
    let removedShares = [...cancelShare];
    if (cancelShare.map((u) => u.id).includes(user.id)) {
      removedShares = removedShares.filter((u) => u.id !== user.id);
    } else {
      removedShares.push(user);
    }
    setCancelShare(removedShares);
  };

  const handleSave = () => {
    if (saved) handleRemoveSave();
    // TODO
  };

  const handleRemoveSave = () => {
    // TODO
  };

  const handleShareWith = (user: User) => {
    let selected = [...selectedUsers];
    if (selectedUsers.map((u) => u.id).includes(user.id)) {
      selected = selected.filter((u) => u.id !== user.id);
    } else {
      selected.push(user);
    }

    setSelectedUsers(selected);
  };

  // TODO refatorar relação de busca por objeto em lista, pra nao precisar fazer map toda vez

  return (
    <div className="flex flex-col rounded-md border-gray-100 border-1 shadow-md p-2 w-[450px] max-w-full h-[300px] justify-between">
      {/* Metabade Dashboard */}
      <div className="rounded-md border-gray-100 border-1 w-full h-[85%] bg-gray-100" />

      {/* Dashboard data */}
      <div className="flex flex-row items-center justify-between mb-1">
        <p className="text-sm text-common text-gray-800 italic">
          {sharedBy ? `Compartilhado por ${sharedBy.map((u) => u.name).join(", ")}` : ""}
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
                      .map((u) => u.id)
                      .includes(user.id);
                    return (
                      <div
                        key={i}
                        className={`flex py-1 px-2 justify-between items-center my-1 border-[1px] border-gray-200 shadow-md rounded-md  ${
                          isOnCancelList && "bg-gray-200"
                        }`}
                      >
                        <p>{user.name}</p>

                        <button
                          className="hover:cursor-pointer"
                          onClick={() => {
                            handleRemoveShare(user);
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
                {handleGetUsers()
                  .filter(
                    (user) =>
                      !sharedWith ||
                      !sharedWith.map((u) => u.id).includes(user.id)
                  )
                  .map((user, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        handleShareWith(user);
                      }}
                      className={`flex py-1 px-2 justify-between items-center my-1 border-[1px] border-gray-200 shadow-sm rounded-md hover:bg-sky-800/10 hover:cursor-pointer ${
                        selectedUsers.map((u) => u.id).includes(user.id) &&
                        "bg-sky-800/30"
                      }`}
                    >
                      <p>{user.name}</p>
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
              handleShare();
              setShowSharingModal(false);
            }}
          />,
        ]}
        onClose={() => {
          setShowSharingModal(false);
        }}
        isOpen={showSharingModal}
      />
    </div>
  );
}
