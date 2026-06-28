"use client";

import { createContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

// Busca o token e id guardados no local storage
function getStoredAuth() {
  if (typeof window === "undefined") {
    return {
      token: null,
      userId: null,
    };
  }

  return {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<{
    token: string | null;
    userId: string | null;
  }>(() => getStoredAuth());

  const login = (novoToken: string, userId: string) => {
    localStorage.setItem("token", novoToken);
    localStorage.setItem("userId", userId);

    setAuth({
      token: novoToken,
      userId,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setAuth({
      token: null,
      userId: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        userId: auth.userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
