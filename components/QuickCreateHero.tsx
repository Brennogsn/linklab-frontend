"use client";

import { useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { apiFetch, ApiError, urlCurta } from "@/lib/api";

export default function QuickCreateHero({ onCriado }: { onCriado: () => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ultimoCriado, setUltimoCriado] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const data = await apiFetch<{ codigo_curto: string }>("/shorten", {
        method: "POST",
        body: JSON.stringify({ url_original: url }),
      });
      setUltimoCriado(data.codigo_curto);
      setUrl("");
      onCriado();
    } catch (err) {
      setErro(
        err instanceof ApiError && err.status === 422
          ? "URL inválida. Confira o formato (ex: https://exemplo.com)."
          : "Algo deu errado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  function copiar() {
    if (!ultimoCriado) return;
    navigator.clipboard.writeText(urlCurta(ultimoCriado));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/20 p-5 mb-6">
      <h2 className="text-sm font-semibold mb-1">Criar link rápido</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Cole uma URL para gerar um link curto sem sair do dashboard
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole sua URL aqui..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-purple-500 transition text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Encurtar"}
        </button>
      </form>

      {erro && <p className="text-xs text-red-500 mt-2">{erro}</p>}

      {ultimoCriado && (
        <div className="mt-3 flex items-center gap-2 text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2">
          <span className="text-purple-600 dark:text-purple-300 font-medium truncate flex-1">
            {urlCurta(ultimoCriado)}
          </span>
          <button
            onClick={copiar}
            className="shrink-0 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition"
          >
            <Copy size={12} />
            {copiado ? "Copiado!" : "Copiar"}
          </button>
        </div>
      )}
    </div>
  );
}
