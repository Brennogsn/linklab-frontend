"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { PontoEvolucao } from "@/lib/types";

export default function EvolucaoChart({ pontos }: { pontos: PontoEvolucao[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={pontos}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
        <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Line type="monotone" dataKey="cliques" stroke="#9333ea" strokeWidth={2} dot={{ r: 3, fill: "#9333ea" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
