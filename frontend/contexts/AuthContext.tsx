"use client";

import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);

  // Recupera o token ao carregar a aplicação
  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");

    if (tokenSalvo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(tokenSalvo);
    }
  }, []);

  const login = (novoToken: string) => {
    localStorage.setItem("token", novoToken);
    setToken(novoToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}