"use client";

import { useState } from "react";
import { Copy, Download, Loader2, Link2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Resultado = { codigo_curto: string; url_original: string };

export default function CriarLinkPage() {
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
      const response = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url_original: url }),
      });

      if (!response.ok) {
        setErro(
          response.status === 422
            ? "URL inválida. Confira se digitou corretamente (ex: https://exemplo.com)."
            : "Algo deu errado. Tente novamente."
        );
        return;
      }

      const data = await response.json();
      setResultado(data);
    } catch {
      setErro("Não foi possível conectar à API. O backend está rodando?");
    } finally {
      setLoading(false);
    }
  }

  function copiarLink() {
    if (!resultado) return;
    navigator.clipboard.writeText(`${API_URL}/${resultado.codigo_curto}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const linkCurto = resultado ? `${API_URL}/${resultado.codigo_curto}` : "";
  const qrCodeUrl = resultado
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(linkCurto)}`
    : "";

  return (
  <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Criar novo link</h1>

      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Cole sua URL longa para gerar um link curto e um QR Code correspondente.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 mb-4"
      >
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole sua URL aqui..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent outline-none focus:border-purple-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 transition text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Encurtar link"
          )}
        </button>
      </form>

      {erro && (
        <p className="text-sm text-red-500 mb-4">
          {erro}
        </p>
      )}

      {resultado && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* CARD INFORMAÇÕES */}

          <div className="border border-gray-200 dark:border-white/10 rounded-xl p-6">

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Link2 size={14} />
              Link original
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 break-all mb-6">
              {resultado.url_original}
            </p>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Seu link curto
            </div>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2">

              <p className="flex-1 text-purple-600 dark:text-purple-300 font-medium break-all">
                {linkCurto}
              </p>

              <button
                onClick={copiarLink}
                className="shrink-0 flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-700 transition text-white px-3 py-2 rounded-md"
              >
                <Copy size={14} />

                {copiado ? "Copiado!" : "Copiar"}

              </button>

            </div>

          </div>

          {/* CARD QR CODE */}

          <div className="border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              QR Code
            </p>

            <img
              src={qrCodeUrl}
              alt="QR Code"
              width={180}
              height={180}
              className="rounded-lg bg-white p-2 shadow"
            />

            <a
              href={qrCodeUrl}
              download={`qrcode-${resultado.codigo_curto}.png`}
              className="mt-5 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-lg"
            >
              <Download size={16} />
              Baixar QR Code
            </a>

          </div>

        </div>
      )}
    </div>
  );
}
