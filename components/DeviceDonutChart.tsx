"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CliquesPorDispositivo } from "@/lib/types";

const CORES = { desktop: "#9333ea", mobile: "#3b82f6", tablet: "#22c55e" };

export default function DeviceDonutChart({ dados }: { dados: CliquesPorDispositivo }) {
  const total = dados.desktop + dados.mobile + dados.tablet;

  const dadosGrafico = [
    { nome: "Desktop", valor: dados.desktop, cor: CORES.desktop },
    { nome: "Mobile", valor: dados.mobile, cor: CORES.mobile },
    { nome: "Tablet", valor: dados.tablet, cor: CORES.tablet },
  ];

  function porcentagem(valor: number) {
    return total === 0 ? "0%" : `${Math.round((valor / total) * 100)}%`;
  }

  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4">
      <h2 className="text-sm font-semibold mb-4">Cliques por dispositivo</h2>

      {total === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-10 text-center">
          Ainda não há cliques registrados.
        </p>
      ) : (
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={dadosGrafico}
                dataKey="valor"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
              >
                {dadosGrafico.map((item) => (
                  <Cell key={item.nome} fill={item.cor} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-2 text-sm">
            {dadosGrafico.map((item) => (
              <div key={item.nome} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.cor }} />
                <span className="text-gray-600 dark:text-gray-300">{item.nome}</span>
                <span className="text-gray-400 dark:text-gray-500 ml-auto">
                  {porcentagem(item.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
