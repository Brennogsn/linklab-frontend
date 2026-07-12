"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiFetch, getToken, setToken, clearToken } from "@/lib/api";

type Usuario = { id: number; nome: string; email: string; criado_em: string };

type AuthContextType = {
  usuario: Usuario | null;
  carregando: boolean;
  logar: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => void;
  alterarSenha: (senhaAtual: string, novaSenha: string) => Promise<void>;
  excluirConta: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarUsuario() {
      const token = getToken();
      if (!token) {
        setCarregando(false);
        return;
      }
      try {
        const dados = await apiFetch<Usuario>("/auth/me");
        setUsuario(dados);
      } catch {
        clearToken();
      } finally {
        setCarregando(false);
      }
    }
    carregarUsuario();
  }, []);

  async function logar(email: string, senha: string) {
    const resposta = await apiFetch<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
      auth: false,
    });
    setToken(resposta.access_token);
    const dados = await apiFetch<Usuario>("/auth/me");
    setUsuario(dados);
  }

  async function registrar(nome: string, email: string, senha: string) {
    await apiFetch("/auth/registrar", {
      method: "POST",
      body: JSON.stringify({ nome, email, senha }),
      auth: false,
    });
    await logar(email, senha);
  }

  function sair() {
    clearToken();
    setUsuario(null);
  }

  async function alterarSenha(senhaAtual: string, novaSenha: string) {
    await apiFetch("/auth/senha", {
      method: "PUT",
      body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha }),
    });
  }

  async function excluirConta() {
    await apiFetch("/auth/me", { method: "DELETE" });
    sair();
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, logar, registrar, sair, alterarSenha, excluirConta }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return context;
}
