"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";
import { TrashIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [data, setData] = useState<{
    name: string;
    username: string;
    email: string;
  }>({
    name: "",
    username: "",
    email: "",
  });

  const [error, setError] = useState<{
    name: string;
    username: string;
    email: string;
  }>({
    name: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    if (token === null) router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // TODO preencher default com dados da conta

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateEmptyField = (field: string) => {
    return field.length > 0;
  };

  const clearErrors = () => setError({ name: "", email: "", username: "" });

  const validateFields = () => {
    clearErrors();

    if (!validateEmail(data.email)) {
      setError((prev) => ({ ...prev, email: "E-mail inválido" }));
    }
    if (!validateEmptyField(data.name)) {
      setError((prev) => ({ ...prev, name: "Campo obrigatório" }));
    }
    if (!validateEmptyField(data.username)) {
      setError((prev) => ({ ...prev, password: "Campo obrigatório" }));
    }

    return !Object.values(error).some((msg) => msg.length > 0);
  };

  const submit = () => {
    if (!validateFields()) return;
    // TODO Chamar endpoint
  };

  const reset = () => {
    // Resetar os campos com os dados da api
  };

  const deleteProfile = () => {
    console.log("delete");
    logout();
    // TODO
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
          value={data.name}
          onChange={(e) => {
            setData((prev) => ({ ...prev, name: e }));
          }}
          error={error.name}
        />
        <Input
          label="Nome de usuário"
          value={data.username}
          onChange={(e) => {
            setData((prev) => ({ ...prev, username: e }));
          }}
          error={error.username}
        />
        <Input
          label="E-mail"
          value={data.email}
          onChange={(e) => {
            setData((prev) => ({ ...prev, email: e }));
          }}
          error={error.email}
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
        <Button text="Salvar" onClick={submit} />
      </div>

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
              deleteProfile();
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
    </div>
  );
}
