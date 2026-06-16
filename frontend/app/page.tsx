"use client";

import Image from "next/image";
import worldSvg from "@/assets/world.svg";
import Input from "@/components/Input";
import { useState } from "react";
import Button from "@/components/Button";

export default function Home() {
  const [login, setLogin] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [signup, setSignup] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [initialScreen, setInitialScreen] = useState<"login" | "signup">(
    "login"
  );
  const [error, setError] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({ name: "", email: "", password: "", confirmPassword: "" });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateEmptyField = (field: string) => {
    return field.length > 0;
  };

  const clearErrors = () =>
    setError({ name: "", email: "", password: "", confirmPassword: "" });

  const validateFields = () => {
    clearErrors();

    if (initialScreen === "login") {
      if (!validateEmail(login.email)) {
        setError((prev) => ({ ...prev, email: "E-mail inválido" }));
      }
      if (!validateEmptyField(login.password)) {
        setError((prev) => ({ ...prev, password: "Campo obrigatório" }));
      }
    } else {
      if (!validateEmail(signup.email)) {
        setError((prev) => ({ ...prev, email: "E-mail inválido" }));
      }
      if (!validateEmptyField(signup.name)) {
        setError((prev) => ({ ...prev, name: "Campo obrigatório" }));
      }
      if (!validateEmptyField(signup.password)) {
        setError((prev) => ({ ...prev, password: "Campo obrigatório" }));
      }
      if (!validateEmptyField(signup.confirmPassword)) {
        setError((prev) => ({ ...prev, confirmPassword: "Campo obrigatório" }));
      }
      if (signup.password !== signup.confirmPassword) {
        setError((prev) => ({
          ...prev,
          confirmPassword: "Senhas devem ser iguais",
        }));
      }
    }

    return !Object.values(error).map((msg) => msg.length > 0);
  };

  const submit = () => {
    if (!validateFields()) return;

    // login
  }

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
    <div className="flex flex-col md:flex-row flex-1 items-center justify-center p-5">
      {/* Image */}
      <div className="md:w-1/2 w-full h-full justify-items-center">
        <h1 className="text-2xl lg:text-5xl font-title text-sky-900 font-semibold mb-6 md:mb-14">
          Lorem Ipsum
        </h1>
        <Image src={worldSvg} alt="Logo" width={500} className="hidden md:flex" />
      </div>

      {/* Login */}
      <div className="flex flex-col border-2 border-sky-900 rounded-lg w-full md:w-1/2 p-3 md:p-6 mx-10 gap-2 md:gap-3">
        <h2 className="text-xl md:text-2xl font-semibold text-sky-900 font-title">
          {labels.title}
        </h2>

        {initialScreen === "login" ? (
          <>
            <Input
              label="E-mail"
              value={login.email}
              onChange={(e) => {
                setLogin((prev) => ({ ...prev, email: e }));
              }}
              error={error.email}
            />
            <Input
              label="Senha"
              password
              value={login.password}
              onChange={(e) => {
                setLogin((prev) => ({ ...prev, password: e }));
              }}
              error={error.password}
            />
          </>
        ) : (
          <>
            <Input
              label="Nome"
              value={signup.name}
              onChange={(e) => {
                setSignup((prev) => ({ ...prev, name: e }));
              }}
              error={error.name}
            />
            <Input
              label="E-mail"
              value={signup.email}
              onChange={(e) => {
                setSignup((prev) => ({ ...prev, email: e }));
              }}
              error={error.email}
            />
            <Input
              label="Senha"
              password
              value={signup.password}
              onChange={(e) => {
                setSignup((prev) => ({ ...prev, password: e }));
              }}
              error={error.password}
            />
            <Input
              label="Confirme sua senha"
              password
              value={signup.confirmPassword}
              onChange={(e) => {
                setSignup((prev) => ({ ...prev, confirmPassword: e }));
              }}
              error={error.confirmPassword}
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
              clearErrors()
              setInitialScreen(initialScreen === "signup" ? "login" : "signup");
            }}
          >
            {labels.changeModeButton}
          </span>
        </p>
      </div>
    </div>
  );
}
