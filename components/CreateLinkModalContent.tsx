"use client";

import { useState } from "react";
import { Copy, Download, Loader2, Link2 } from "lucide-react";
import { apiFetch, ApiError, urlCurta } from "@/lib/api";

type Resultado = { codigo_curto: string; url_original: string };

export default function CreateLinkModalContent({ onCriado }: { onCriado: () => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setResultado(null);
    setLoading(true);

    try {
      const data = await apiFetch<Resultado>("/shorten", {
        method: "POST",
        body: JSON.stringify({ url_original: url }),
      });
      setResultado(data);
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

  function copiarLink() {
    if (!resultado) return;
    navigator.clipboard.writeText(urlCurta(resultado.codigo_curto));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const linkCurto = resultado ? urlCurta(resultado.codigo_curto) : "";
  const qrCodeUrl = resultado
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(linkCurto)}`
    : "";

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-2">
        <input
          type="url"
          required
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole sua URL aqui..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent outline-none focus:border-purple-500 transition text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-medium px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Encurtar"}
        </button>
      </form>

      {erro && <p className="text-sm text-red-500 mb-2">{erro}</p>}

      {resultado && (
        <div className="mt-4 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <Link2 size={12} />
              Link original
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 truncate mb-3">
              {resultado.url_original}
            </p>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2">
              <p className="flex-1 text-purple-600 dark:text-purple-300 font-medium text-sm truncate">
                {linkCurto}
              </p>
              <button
                onClick={copiarLink}
                className="shrink-0 flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-700 transition text-white px-3 py-1.5 rounded-md"
              >
                <Copy size={12} />
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <img
              src={qrCodeUrl}
              alt="QR Code do link curto"
              className="rounded-lg border border-gray-200 dark:border-white/10 bg-white p-2"
              width={120}
              height={120}
            />
            <a
              href={qrCodeUrl}
              download={`qrcode-${resultado.codigo_curto}.png`}
              className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition"
            >
              <Download size={12} />
              Baixar PNG
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
