"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";

const CHAVE_LINK_PENDENTE = "linklab_link_pendente";

type Aba = "entrar" | "criar-conta";

export default function EntrarPage() {
  const router = useRouter();
  const { logar, registrar } = useAuth();

  const [aba, setAba] = useState<Aba>("entrar");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");

  const [nome, setNome] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  async function finalizarAutenticacao() {
    const urlPendente = sessionStorage.getItem(CHAVE_LINK_PENDENTE);
    if (urlPendente) {
      sessionStorage.removeItem(CHAVE_LINK_PENDENTE);
      try {
        await apiFetch("/shorten", {
          method: "POST",
          body: JSON.stringify({ url_original: urlPendente }),
        });
      } catch {
        // se falhar, o usuário ainda cai no dashboard normalmente
      }
    }
    router.push("/dashboard");
  }

  function trocarAba(novaAba: Aba) {
    setAba(novaAba);
    setErro("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await logar(emailLogin, senhaLogin);
      await finalizarAutenticacao();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (senhaCadastro !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (senhaCadastro.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await registrar(nome, emailCadastro, senhaCadastro);
      await finalizarAutenticacao();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 font-semibold text-lg mb-8">
          <Link2 className="text-purple-500" size={24} />
          LinkLab
        </div>

        <div className="bg-[#0d0d16] border border-white/10 rounded-2xl p-8">
          <div className="flex rounded-lg bg-white/5 p-1 mb-6">
            <button
              onClick={() => trocarAba("entrar")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                aba === "entrar" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => trocarAba("criar-conta")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                aba === "criar-conta" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Criar Conta
            </button>
          </div>

          {erro && <p className="text-sm text-red-400 mb-4">{erro}</p>}

          {aba === "entrar" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">E-mail</label>
                <input
                  type="email"
                  required
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Senha</label>
                <input
                  type="password"
                  required
                  value={senhaLogin}
                  onChange={(e) => setSenhaLogin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg py-2 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCadastro} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nome</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">E-mail</label>
                <input
                  type="email"
                  required
                  value={emailCadastro}
                  onChange={(e) => setEmailCadastro(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Senha</label>
                <input
                  type="password"
                  required
                  value={senhaCadastro}
                  onChange={(e) => setSenhaCadastro(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Confirmar senha</label>
                <input
                  type="password"
                  required
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-purple-500 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg py-2 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Criar conta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
