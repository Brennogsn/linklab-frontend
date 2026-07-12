"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Loader2, Moon, Sun, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import Modal from "@/components/Modal";

export default function ConfiguracoesPage() {
  const { usuario, alterarSenha, excluirConta } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [mensagemSenha, setMensagemSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function handleAlterarSenha(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha("");
    setMensagemSenha("");

    if (novaSenha !== confirmarNovaSenha) {
      setErroSenha("As senhas novas não coincidem.");
      return;
    }

    setSalvandoSenha(true);
    try {
      await alterarSenha(senhaAtual, novaSenha);
      setMensagemSenha("Senha alterada com sucesso.");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
    } catch (err) {
      setErroSenha(err instanceof ApiError ? err.message : "Não foi possível alterar a senha.");
    } finally {
      setSalvandoSenha(false);
    }
  }

  async function handleExcluirConta() {
    setExcluindo(true);
    try {
      await excluirConta();
      router.push("/");
    } catch {
      setExcluindo(false);
    }
  }

  if (!usuario) return null;

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Configurações</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Gerencie sua conta e preferências
        </p>
      </div>

      {/* Perfil */}
      <section className="border border-gray-200 dark:border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-4">Perfil</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-semibold">
            {usuario.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{usuario.nome}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{usuario.email}</p>
          </div>
        </div>
      </section>

      {/* Aparência */}
      <section className="border border-gray-200 dark:border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-4">Aparência</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm border transition ${
              theme === "light"
                ? "border-purple-500 bg-purple-50 dark:bg-purple-600/10 text-purple-600"
                : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
            }`}
          >
            <Sun size={16} />
            Tema Claro
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm border transition ${
              theme === "dark"
                ? "border-purple-500 bg-purple-50 dark:bg-purple-600/10 text-purple-600 dark:text-purple-300"
                : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
            }`}
          >
            <Moon size={16} />
            Tema Escuro
          </button>
        </div>
      </section>

      {/* Segurança */}
      <section className="border border-gray-200 dark:border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-4">Segurança</h2>
        <form onSubmit={handleAlterarSenha} className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Senha atual</label>
            <input
              type="password"
              required
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent outline-none focus:border-purple-500 transition text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Nova senha</label>
            <input
              type="password"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent outline-none focus:border-purple-500 transition text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Confirmar nova senha</label>
            <input
              type="password"
              required
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent outline-none focus:border-purple-500 transition text-sm"
            />
          </div>

          {erroSenha && <p className="text-xs text-red-500">{erroSenha}</p>}
          {mensagemSenha && <p className="text-xs text-green-600 dark:text-green-400">{mensagemSenha}</p>}

          <button
            type="submit"
            disabled={salvandoSenha}
            className="self-start bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
          >
            {salvandoSenha ? <Loader2 className="animate-spin" size={14} /> : "Salvar nova senha"}
          </button>
        </form>
      </section>

      {/* Conta */}
      <section className="border border-red-200 dark:border-red-500/20 rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-1 text-red-600 dark:text-red-400">Zona de risco</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Excluir sua conta remove permanentemente todos os seus links e dados.
        </p>
        <button
          onClick={() => setModalExclusaoAberto(true)}
          className="flex items-center gap-2 text-sm border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition px-4 py-2 rounded-lg"
        >
          <Trash2 size={14} />
          Excluir conta
        </button>
      </section>

      <Modal
        aberto={modalExclusaoAberto}
        aoFechar={() => setModalExclusaoAberto(false)}
        titulo="Excluir conta"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
          Tem certeza? Essa ação é <strong>permanente</strong> e vai apagar sua conta,
          todos os seus links e estatísticas. Não é possível desfazer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setModalExclusaoAberto(false)}
            className="flex-1 border border-gray-200 dark:border-white/10 text-sm py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleExcluirConta}
            disabled={excluindo}
            className="flex-1 bg-red-600 hover:bg-red-700 transition text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {excluindo ? <Loader2 className="animate-spin" size={14} /> : "Sim, excluir"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
