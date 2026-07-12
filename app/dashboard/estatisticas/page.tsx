"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import type { EvolucaoResponse } from "@/lib/types";
import EvolucaoChart from "@/components/EvolucaoChart";

type Periodo = "dia" | "semana" | "mes";

const ABAS: { valor: Periodo; label: string }[] = [
  { valor: "dia", label: "Diária" },
  { valor: "semana", label: "Semanal" },
  { valor: "mes", label: "Mensal" },
];

export default function EstatisticasPage() {
  const [periodo, setPeriodo] = useState<Periodo>("dia");
  const [dados, setDados] = useState<EvolucaoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async (p: Periodo) => {
    setLoading(true);
    setErro("");
    try {
      const data = await apiFetch<EvolucaoResponse>(`/estatisticas/evolucao?periodo=${p}`);
      setDados(data);
    } catch {
      setErro("Não foi possível carregar as estatísticas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar(periodo);
  }, [periodo, carregar]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Estatísticas</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Evolução de cliques ao longo do tempo
      </p>

      <div className="border border-gray-200 dark:border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total de cliques</p>
            <p className="text-2xl font-bold">{dados ? dados.total_cliques : "..."}</p>
          </div>

          <div className="flex rounded-lg bg-gray-100 dark:bg-white/5 p-1">
            {ABAS.map((aba) => (
              <button
                key={aba.valor}
                onClick={() => setPeriodo(aba.valor)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  periodo === aba.valor
                    ? "bg-purple-600 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        </div>

        {erro && <p className="text-sm text-red-500">{erro}</p>}
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-10 text-center">Carregando...</p>
        ) : (
          dados && <EvolucaoChart pontos={dados.pontos} />
        )}
      </div>
    </div>
  );
}
