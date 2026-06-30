"use client";

import Image from "next/image";
import worldSvg from "@/assets/world.svg";
import Input from "@/components/Input";
import { useState } from "react";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function InitialScreen() {
  const { login: setToken } = useAuth();
  const router = useRouter();

  // Dados para login
  const [login, setLogin] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });

  // Dados para cadastro
  const [signup, setSignup] = useState<{
    nome: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    nome: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Tela atual
  const [initialScreen, setInitialScreen] = useState<"login" | "signup">(
    "login"
  );

  // Erros
  const [errors, setErrors] = useState<{
    nome: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({ nome: "", username: "", email: "", password: "", confirmPassword: "" });

  const [fetchError, setFetchError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateEmptyField = (field: string) => {
    return field.length > 0;
  };

  const clearErrors = () =>
    setErrors({
      nome: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const validateFields = () => {
    clearErrors();
    const newErrors = {
      nome: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    if (initialScreen === "login") {
      if (!validateEmptyField(login.username)) {
        newErrors.username = "Campo obrigatório";
      }

      if (!validateEmptyField(login.password)) {
        newErrors.password = "Campo obrigatório";
      }
    } else {
      if (!validateEmail(signup.email)) {
        newErrors.email = "E-mail inválido";
      }

      if (!validateEmptyField(signup.nome)) {
        newErrors.nome = "Campo obrigatório";
      }

      if (!validateEmptyField(signup.username)) {
        newErrors.username = "Campo obrigatório";
      }

      if (!validateEmptyField(signup.password)) {
        newErrors.password = "Campo obrigatório";
      }

      if (!validateEmptyField(signup.confirmPassword)) {
        newErrors.confirmPassword = "Campo obrigatório";
      }

      if (signup.password !== signup.confirmPassword) {
        newErrors.confirmPassword = "Senhas devem ser iguais";
      }
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((msg) => msg.length > 0);
  };

  const submit = async () => {
    if (!validateFields()) return;

    const url =
      initialScreen === "login"
        ? "http://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/auth/login"
        : "http://projetoweb.beatriz.schmitt.vms.ufsc.br:3001/api/auth/register";

    const body =
      initialScreen === "login"
        ? {
            email: login.username,
            password: login.password,
          }
        : {
            nome: signup.nome,
            username: signup.username,
            email: signup.email,
            password: signup.password,
          };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      setFetchError(data.message);
      return;
    }

    setToken(data.token, data.user.id);
    router.push("/main-page");
  };

  const labels =
    initialScreen === "login"
      ? {
          title: "Entrar",
          button: "Entrar",
          changeMode: "Novo por aqui?",
          changeModeButton: "Crie sua conta",
        }
      : {
          title: "Crie sua conta",
          button: "Criar conta",
          changeMode: "Já possui conta?",
          changeModeButton: "Faça login",
        };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col md:flex-row flex-1 items-center justify-center p-5 2xl:max-w-[1800px] ">
        {/* Image */}
        <div className="md:w-1/2 w-full h-full justify-items-center">
          <h1 className="text-2xl lg:text-5xl font-title text-sky-900 font-semibold mb-2 md:mb-14">
            WeatherCheck
          </h1>
          <Image
            src={worldSvg}
            alt="Logo"
            width={500}
            className="hidden md:flex"
          />
        </div>

        {/* Login/Sign up */}
        <div className="flex flex-col border-2 border-sky-900 rounded-lg w-full md:w-1/2 p-3 md:p-6 mx-10 gap-2 md:gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-semibold text-sky-900 font-title">
              {labels.title}
            </h2>
            <div
              className={`flex flex-row items-center h-4 w-full rounded-sm ${
                fetchError.length === 0 && "opacity-0"
              }`}
            >
              <div className="h-4 rounded-l-xs w-1.5 bg-red-600 mr-1" />
              <p className="text-red-600 text-xs font-semibold">{fetchError}</p>
            </div>
          </div>

          {initialScreen === "login" ? (
            <>
              <Input
                label="E-mail ou nome de usuário"
                value={login.username}
                onChange={(e) => {
                  setLogin((prev) => ({ ...prev, username: e }));
                }}
                error={errors.username}
              />
              <Input
                label="Senha"
                password
                value={login.password}
                onChange={(e) => {
                  setLogin((prev) => ({ ...prev, password: e }));
                }}
                error={errors.password}
              />
            </>
          ) : (
            <>
              <Input
                label="Nome"
                value={signup.nome}
                onChange={(e) => {
                  setSignup((prev) => ({ ...prev, nome: e }));
                }}
                error={errors.nome}
              />
              <Input
                label="Nome de usuário"
                value={signup.username}
                onChange={(e) => {
                  setSignup((prev) => ({ ...prev, username: e }));
                }}
                error={errors.username}
              />
              <Input
                label="E-mail"
                value={signup.email}
                onChange={(e) => {
                  setSignup((prev) => ({ ...prev, email: e }));
                }}
                error={errors.email}
              />
              <Input
                label="Senha"
                password
                value={signup.password}
                onChange={(e) => {
                  setSignup((prev) => ({ ...prev, password: e }));
                }}
                error={errors.password}
              />
              <Input
                label="Confirme sua senha"
                password
                value={signup.confirmPassword}
                onChange={(e) => {
                  setSignup((prev) => ({ ...prev, confirmPassword: e }));
                }}
                error={errors.confirmPassword}
              />
            </>
          )}
          <div className="my-3">
            <Button full text={labels.button} onClick={submit} />
          </div>

          <hr className="md:my-2 text-gray-800" />

          <p className="text-sm md:text-base text-center font-common text-gray-800">
            {labels.changeMode}{" "}
            <span
              className="text-sky-900 hover:text-sky-700 hover:cursor-pointer font-semibold"
              onClick={() => {
                clearErrors();
                setFetchError("");
                setInitialScreen(
                  initialScreen === "signup" ? "login" : "signup"
                );
              }}
            >
              {labels.changeModeButton}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
