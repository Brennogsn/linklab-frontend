"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { CliquesPorDia } from "@/lib/types";

function formatarDia(isoDate: string) {
  const [, mes, dia] = isoDate.split("-");
  return `${dia}/${mes}`;
}

export default function ClicksChart({ dados }: { dados: CliquesPorDia[] }) {
  const dadosFormatados = dados.map((item) => ({
    dia: formatarDia(item.dia),
    cliques: item.cliques,
  }));

  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4">
      <h2 className="text-sm font-semibold mb-4">Cliques nos últimos 7 dias</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={dadosFormatados}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
          <XAxis dataKey="dia" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
            labelFormatter={(label) => `Dia ${label}`}
          />
          <Line
            type="monotone"
            dataKey="cliques"
            stroke="#9333ea"
            strokeWidth={2}
            dot={{ r: 3, fill: "#9333ea" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
