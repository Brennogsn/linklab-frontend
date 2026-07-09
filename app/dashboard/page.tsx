"use client";

import { useEffect, useState } from "react";
import { Link2, MousePointerClick, Copy } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type LinkData = {
  codigo_curto: string;
  url_original: string;
  criado_em: string;
  total_clicks: number;
};

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const response = await fetch(`${API_URL}/links`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setLinks(data);
      } catch {
        setErro("Não foi possível carregar os dados. O backend está rodando?");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const totalLinks = links.length;
  const totalCliques = links.reduce((soma, link) => soma + link.total_clicks, 0);

  function copiar(codigo: string) {
    navigator.clipboard.writeText(`${API_URL}/${codigo}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Visão geral dos seus links
      </p>

      {erro && <p className="text-sm text-red-500 mb-4">{erro}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-600/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
            <Link2 size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total de Links</p>
            <p className="text-xl font-bold">{loading ? "..." : totalLinks}</p>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-300">
            <MousePointerClick size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cliques Totais</p>
            <p className="text-xl font-bold">{loading ? "..." : totalCliques}</p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-sm font-semibold">Meus Links</h2>
        </div>

        {loading ? (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Carregando...</p>
        ) : links.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
            Nenhum link criado ainda. Volte à página inicial para criar o primeiro.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10">
                <th className="px-4 py-2 font-medium">Link</th>
                <th className="px-4 py-2 font-medium">Cliques</th>
                <th className="px-4 py-2 font-medium">Criado em</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.codigo_curto} className="border-b border-gray-100 dark:border-white/5 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-purple-600 dark:text-purple-300">/{link.codigo_curto}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{link.url_original}</p>
                  </td>
                  <td className="px-4 py-3">{link.total_clicks}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(link.criado_em).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => copiar(link.codigo_curto)}
                      className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition"
                      aria-label="Copiar link"
                    >
                      <Copy size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}