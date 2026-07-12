"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, ApiError, urlCurta } from "@/lib/api";

const CHAVE_LINK_PENDENTE = "linklab_link_pendente";

const FEATURES = [
  "Links ilimitados",
  "QR Code",
  "Estatísticas em tempo real",
  "100% gratuito",
];

type Resultado = { codigo_curto: string; url_original: string };

export default function ShortenForm() {
  const router = useRouter();
  const { usuario, carregando } = useAuth();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setResultado(null);

    if (carregando) return;

    if (!usuario) {
      sessionStorage.setItem(CHAVE_LINK_PENDENTE, url);
      router.push("/entrar");
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch<Resultado>("/shorten", {
        method: "POST",
        body: JSON.stringify({ url_original: url }),
      });
      setResultado(data);
      setUrl("");
    } catch (err) {
      setErro(
        err instanceof ApiError && err.status === 422
          ? "URL inválida. Confira se digitou corretamente (ex: https://exemplo.com)."
          : "Algo deu errado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  function copiarLink() {
    if (!resultado) return;
    navigator.clipboard.writeText(urlCurta(resultado.codigo_curto));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-xl flex bg-white rounded-xl overflow-hidden shadow-lg"
      >
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole sua URL aqui..."
          className="flex-1 px-5 py-4 text-gray-900 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 transition text-white font-medium px-6 flex items-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Encurtar →"}
        </button>
      </form>

      {erro && <p className="mt-4 text-sm text-red-400 max-w-xl">{erro}</p>}

      {resultado && (
        <div className="mt-4 w-full max-w-xl bg-white/5 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="text-left overflow-hidden">
            <p className="text-xs text-gray-400">Seu link curto:</p>
            <p className="text-purple-300 font-medium truncate">
              {urlCurta(resultado.codigo_curto)}
            </p>
          </div>
          <button
            onClick={copiarLink}
            className="shrink-0 flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-700 transition px-3 py-2 rounded-lg"
          >
            <Copy size={14} />
            {copiado ? "Copiado!" : "Copiar"}
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-400">
        {FEATURES.map((feature) => (
          <span key={feature} className="flex items-center gap-2">
            <Check size={16} className="text-purple-400" /> {feature}
          </span>
        ))}
      </div>
    </>
  );
}
