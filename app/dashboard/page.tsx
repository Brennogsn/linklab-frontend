"use client";

import { useCallback, useEffect, useState } from "react";
import { Link2, MousePointerClick, CalendarClock, TrendingUp, Copy } from "lucide-react";
import { apiFetch, urlCurta } from "@/lib/api";
import type { DashboardResumo, LinkData } from "@/lib/types";
import StatCard from "@/components/StatCard";
import ClicksChart from "@/components/ClicksChart";
import DeviceDonutChart from "@/components/DeviceDonutChart";
import TopLinksRanking from "@/components/TopLinksRanking";
import Modal from "@/components/Modal";
import CreateLinkModalContent from "@/components/CreateLinkModalContent";
import { useDashboardModal } from "@/contexts/DashboardModalContext";

export default function DashboardPage() {
  const { modalAberto, fecharModal } = useDashboardModal();
  const [resumo, setResumo] = useState<DashboardResumo | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDados = useCallback(async () => {
    try {
      const [resumoData, linksData] = await Promise.all([
        apiFetch<DashboardResumo>("/dashboard/resumo"),
        apiFetch<LinkData[]>("/links"),
      ]);
      setResumo(resumoData);
      setLinks(linksData);
    } catch {
      setErro("Não foi possível carregar os dados. O backend está rodando?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  function copiar(codigo: string) {
    navigator.clipboard.writeText(urlCurta(codigo));
  }

  if (erro) {
    return <p className="text-sm text-red-500">{erro}</p>;
  }

  if (loading || !resumo) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Carregando...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Visão geral dos seus links
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Link2}
          label="Total de Links"
          value={resumo.total_links}
          colorClass="bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300"
        />
        <StatCard
          icon={MousePointerClick}
          label="Cliques Totais"
          value={resumo.total_cliques}
          colorClass="bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300"
        />
        <StatCard
          icon={CalendarClock}
          label="Cliques Hoje"
          value={resumo.cliques_hoje}
          colorClass="bg-orange-100 dark:bg-orange-600/20 text-orange-600 dark:text-orange-300"
        />
        <StatCard
          icon={TrendingUp}
          label="Taxa de Cliques"
          value={`${resumo.taxa_cliques}%`}
          colorClass="bg-green-100 dark:bg-green-600/20 text-green-600 dark:text-green-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ClicksChart dados={resumo.cliques_por_dia} />
        <DeviceDonutChart dados={resumo.cliques_por_dispositivo} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-sm font-semibold">Meus Links</h2>
          </div>

          {links.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              Nenhum link criado ainda. Use o botão &quot;Novo Link&quot; na barra lateral.
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

        <TopLinksRanking links={resumo.top_links} />
      </div>

      <Modal aberto={modalAberto} aoFechar={fecharModal} titulo="Criar novo link">
        <CreateLinkModalContent onCriado={carregarDados} />
      </Modal>
    </div>
  );
}
