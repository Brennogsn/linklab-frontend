"use client";

import { useEffect, useState } from "react";
import { Download, Maximize2 } from "lucide-react";
import { apiFetch, urlCurta } from "@/lib/api";
import type { LinkData } from "@/lib/types";
import Modal from "@/components/Modal";

function qrCodeUrlDe(codigo: string, tamanho: number) {
  const link = urlCurta(codigo);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${tamanho}x${tamanho}&data=${encodeURIComponent(link)}`;
}

export default function QrCodesPage() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [linkSelecionado, setLinkSelecionado] = useState<LinkData | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await apiFetch<LinkData[]>("/links");
        setLinks(data);
      } catch {
        setErro("Não foi possível carregar os links. O backend está rodando?");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (erro) return <p className="text-sm text-red-500">{erro}</p>;
  if (loading) return <p className="text-sm text-gray-500 dark:text-gray-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">QR Codes</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Todos os QR Codes gerados para os seus links
      </p>

      {links.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nenhum link criado ainda. Use o botão &quot;Novo Link&quot; na barra lateral.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {links.map((link) => (
            <div
              key={link.codigo_curto}
              className="border border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center gap-3"
            >
              <img
                src={qrCodeUrlDe(link.codigo_curto, 140)}
                alt={`QR Code para /${link.codigo_curto}`}
                className="rounded-lg border border-gray-200 dark:border-white/10 bg-white p-2"
                width={110}
                height={110}
              />

              <div className="text-center w-full">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-300 truncate">
                  /{link.codigo_curto}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {link.url_original}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => setLinkSelecionado(link)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition rounded-lg py-1.5"
                >
                  <Maximize2 size={12} />
                  Ver
                </button>
                  <a
                  href={qrCodeUrlDe(link.codigo_curto, 400)}
                  download={`qrcode-${link.codigo_curto}.png`}
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-purple-600 hover:bg-purple-700 transition text-white rounded-lg py-1.5"
                >
                  <Download size={12} />
                  Baixar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        aberto={linkSelecionado !== null}
        aoFechar={() => setLinkSelecionado(null)}
        titulo={linkSelecionado ? `QR Code — /${linkSelecionado.codigo_curto}` : ""}
      >
        {linkSelecionado && (
          <div className="flex flex-col items-center gap-4">
            <img
              src={qrCodeUrlDe(linkSelecionado.codigo_curto, 260)}
              alt={`QR Code para /${linkSelecionado.codigo_curto}`}
              className="rounded-lg border border-gray-200 dark:border-white/10 bg-white p-3"
              width={260}
              height={260}
            />
            <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
              {urlCurta(linkSelecionado.codigo_curto)}
            </p>
            <a
              href={qrCodeUrlDe(linkSelecionado.codigo_curto, 400)}
              download={`qrcode-${linkSelecionado.codigo_curto}.png`}
              className="flex items-center gap-2 text-sm bg-purple-600 hover:bg-purple-700 transition text-white rounded-lg px-4 py-2"
            >
              <Download size={14} />
              Baixar PNG
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
