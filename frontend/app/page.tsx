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

  const [login, setLogin] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [signup, setSignup] = useState<{
    nome: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [initialScreen, setInitialScreen] = useState<"login" | "signup">(
    "login"
  );
  const [errors, setErrors] = useState<{
    nome: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({ nome: "", email: "", password: "", confirmPassword: "" });

  const [fetchError, setFetchError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateEmptyField = (field: string) => {
    return field.length > 0;
  };

  const clearErrors = () =>
    setErrors({ nome: "", email: "", password: "", confirmPassword: "" });

  const validateFields = () => {
    clearErrors();

    if (initialScreen === "login") {
      if (!validateEmail(login.email)) {
        setErrors((prev) => ({ ...prev, email: "E-mail inválido" }));
      }
      if (!validateEmptyField(login.password)) {
        setErrors((prev) => ({ ...prev, password: "Campo obrigatório" }));
      }
    } else {
      if (!validateEmail(signup.email)) {
        setErrors((prev) => ({ ...prev, email: "E-mail inválido" }));
      }
      if (!validateEmptyField(signup.nome)) {
        setErrors((prev) => ({ ...prev, nome: "Campo obrigatório" }));
      }
      if (!validateEmptyField(signup.password)) {
        setErrors((prev) => ({ ...prev, password: "Campo obrigatório" }));
      }
      if (!validateEmptyField(signup.confirmPassword)) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Campo obrigatório",
        }));
      }
      if (signup.password !== signup.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Senhas devem ser iguais",
        }));
      }
    }

    return !Object.values(errors).some((msg) => msg.length > 0);
  };

  const submit = async () => {
    if (!validateFields()) return;

    // TODO trocar rota
    const url =
      initialScreen === "login"
        ? "http://localhost:3001/api/auth/login"
        : "http://localhost:3001/api/auth/register";

    const body =
      initialScreen === "login"
        ? {
            email: login.email,
            password: login.password,
          }
        : {
            nome: signup.nome,
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
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col md:flex-row flex-1 items-center justify-center p-5 2xl:max-w-[1800px] ">
        {/* Image */}
        <div className="md:w-1/2 w-full h-full justify-items-center">
          <h1 className="text-2xl lg:text-5xl font-title text-sky-900 font-semibold mb-6 md:mb-14">
            Lorem Ipsum
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
            <div className={`flex flex-row items-center bg-red-200 h-6 w-full rounded-sm ${fetchError.length === 0 && "opacity-0"}`}>
              <div className="h-4 rounded-l-xs w-1.5 bg-red-500 m-1" />
              <p className="text-red-500 text-xs font-semibold">{fetchError}</p>
            </div>
          </div>

          {initialScreen === "login" ? (
            <>
              <Input
                label="E-mail"
                value={login.email}
                onChange={(e) => {
                  setLogin((prev) => ({ ...prev, email: e }));
                }}
                error={errors.email}
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

          <hr className="md:my-5" />

          <p className="text-sm md:text-base text-center font-common">
            {labels.changeMode}{" "}
            <span
              className="text-sky-900 hover:text-sky-700 hover:cursor-pointer font-semibold"
              onClick={() => {
                clearErrors();
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
