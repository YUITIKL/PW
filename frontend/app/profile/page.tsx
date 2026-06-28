"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";
import { TrashIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

// Layout idêntico ao Input, mas não permite operações
// Apenas para manter o padrão
function FakeInput({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col w-full text-black">
      <div className="flex flex-row items-center justify-between w-full">
        <p
          className={`font-common text-sm font-semibold mb-2 text-gray-600 min-w-[250px]`}
        >
          {label}
        </p>
      </div>
      <div
        className={`flex items-center border border-gray-300 rounded-sm font-common bg-gray-200 pointer-events-none cursor-not-allowed w-full h-8 py-1 px-1.5`}
      >
        <p>{value}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { token, logout } = useAuth();
  const router = useRouter();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const [refetch, setRefetch] = useState(0);
  
  const triggerRefetch = () => setRefetch(refetch + 1);

  // Dados modificados
  const [data, setData] = useState<{
    nome: string;
    username: string;
    password: string;
    currentPassword: string;
  }>({
    nome: "",
    username: "",
    password: "",
    currentPassword: "",
  });

  // Dados do usuário salvos no banco
  const [currentData, setCurrentData] = useState<{
    nome: string;
    email: string;
    username: string;
    dataCadastro: Date;
  }>({
    nome: "",
    email: "",
    username: "",
    dataCadastro: new Date(),
  });

  // Erros
  const [error, setError] = useState<{
    nome: string;
    username: string;
    password: string;
    currentPassword: string;
  }>({
    nome: "",
    username: "",
    password: "",
    currentPassword: "",
  });

  // Valida se existe usuário logado
  useEffect(() => {
    if (!token) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Busca os dados salvos do usuário
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        setData((prev) => ({
          ...prev,
          nome: data.nome,
          username: data.username,
        }));

        setCurrentData({
          nome: data.nome,
          username: data.username,
          email: data.email,
          dataCadastro: data.data_cadastro,
        });
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        showToast(`Erro ao buscar usuário: ${error}`, "error");
      }
    };

    getUserData();
  }, [refetch, token]);

  const validateEmptyField = (field: string) => {
    return field.length > 0;
  };

  // Atualiza perfil
  const handleUpdateProfile = async () => {
    if (!validateEmptyField(data.nome)) {
      setError((prev) => ({ ...prev, nome: "Nome não pode ser vazio" }));
      return;
    }

    if (!validateEmptyField(data.username)) {
      setError((prev) => ({
        ...prev,
        username: "Username não pode ser vazio",
      }));
      return;
    }

    try {
      const url = "http://localhost:3001/api/users/profile";

      const body = {
        nome: data.nome,
        username: data.username,
      };

      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      showToast("Perfil atualizado com sucesso", "success");
      triggerRefetch();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      showToast(`Erro ao atualizar perfil: ${error}`, "error");
    }
  };

  // Atualiza senha
  const handleUpdatePassword = async () => {
    if (!validateEmptyField(data.password)) {
      setError((prev) => ({ ...prev, password: "Campo obrigatório" }));
      return;
    }
    if (!validateEmptyField(data.currentPassword)) {
      setError((prev) => ({ ...prev, currentPassword: "Campo obrigatório" }));
      return;
    }

    try {
      const url = "http://localhost:3001/api/users/password";

      const body = {
        newPassword: data.password,
        currentPassword: data.currentPassword,
      };

      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      showToast("Senha atualizada com sucesso", "success");
      triggerRefetch();
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      showToast(`Erro ao atualizar senha: ${error}`, "error");
    }
  };

  // Inativa perfil
  const handleDeleteProfile = async () => {
    try {
      const url = "http://localhost:3001/api/users/account";

      await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      logout();
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
    }
  };

  // Reseta campos
  const reset = () => {
    setData((prev) => ({
      ...prev,
      nome: currentData.nome,
      username: currentData.username,
    }));
  };

  return (
    <div className="flex flex-col flex-1 mx-auto justify-center p-5 max-w-[900px]">
      <h1 className="text-sky-900 font-semibold font-title text-2xl md:text-3xl">
        Atualizar perfil
      </h1>
      <p className=" text-base font-common text-gray-600">
        Preencha os campos desejados para editar as informações do perfil.
      </p>

      <hr className=" my-3 md:my-6 text-gray-400" />

      <div className="flex flex-col gap-4 w-full">
        <Input
          label="Nome"
          value={data.nome}
          onChange={(e) => {
            setData((prev) => ({ ...prev, nome: e }));
          }}
          error={error.nome}
        />
        <Input
          label="Nome de usuário"
          value={data.username}
          onChange={(e) => {
            setData((prev) => ({ ...prev, username: e }));
          }}
          error={error.username}
        />
        <FakeInput label="E-mail" value={currentData.email} />
        <FakeInput
          label="Data de cadastro"
          value={new Date(currentData.dataCadastro).toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }
          )}
        />
      </div>

      <div className="flex flex-row gap-3 mt-6 md:mt-16 flex-wrap">
        <Button
          text="Excluir conta"
          onClick={() => {
            setShowConfirmation(true);
          }}
          type="delete"
          icon={<TrashIcon size={16} className="text-white" weight="bold" />}
        />
        <Button text="Descartar alterações" onClick={reset} />
        <Button
          text="Trocar senha"
          onClick={() => {
            setShowUpdatePassword(true);
          }}
        />
        <Button
          text="Salvar"
          disabled={
            currentData.nome === data.nome &&
            currentData.username === data.username
          }
          onClick={handleUpdateProfile}
        />
      </div>

      {/* Modal confirmação para excluir conta */}
      <Modal
        title="Confirmar exclusão de conta"
        content={
          <p className="font-common text-base 2xl:text-lg text-justify py-1 md:py-2 pr-2 whitespace-pre-line overflow-auto max-h-[60vh]">
            Esta é uma operação irreversível. Você tem certeza que deseja
            excluir sua conta?
          </p>
        }
        button={[
          <Button
            key="cancel"
            text="Cancelar"
            onClick={() => {
              setShowConfirmation(false);
            }}
          />,
          <Button
            key="confirm"
            text="Excluir conta"
            onClick={() => {
              handleDeleteProfile();
              setShowConfirmation(false);
            }}
            type="delete"
          />,
        ]}
        onClose={() => {
          setShowConfirmation(false);
        }}
        isOpen={showConfirmation}
      />

      {/* Modal para atualização de senha */}
      <Modal
        title="Alterar senha"
        content={
          <div className="flex flex-col gap-2">
            <p className="font-common text-base text-justify pb-1 md:pb-2 pr-2 whitespace-pre-line overflow-auto max-h-[60vh]">
              Complete os campos abaixo com a senha atual da conta e a nova
              senha.
            </p>
            <Input
              label="Senha atual"
              password
              value={data.currentPassword}
              onChange={(e) => {
                setData((prev) => ({ ...prev, currentPassword: e }));
              }}
              error={error.currentPassword}
            />
            <Input
              label="Nova senha"
              password
              value={data.password}
              onChange={(e) => {
                setData((prev) => ({ ...prev, password: e }));
              }}
              error={error.password}
            />
          </div>
        }
        button={[
          <Button
            key="cancel"
            text="Cancelar"
            onClick={() => {
              setShowUpdatePassword(false);
            }}
          />,
          <Button
            key="confirm"
            text="Salvar"
            onClick={() => {
              handleUpdatePassword();
              setShowUpdatePassword(false);
            }}
          />,
        ]}
        onClose={() => {
          setShowUpdatePassword(false);
        }}
        isOpen={showUpdatePassword}
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
