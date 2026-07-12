"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link2, LayoutDashboard, QrCode, BarChart3, Globe, Settings, Link as LinkIcon, Plus } from "lucide-react";
import { useDashboardModal } from "@/contexts/DashboardModalContext";

const ITENS_ATIVOS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "QR Codes", icon: QrCode, href: "/dashboard/qrcodes" },
  { label: "Estatísticas", icon: BarChart3, href: "/dashboard/estatisticas" },
  { label: "Configurações", icon: Settings, href: "/dashboard/configuracoes" },
];

export default function Sidebar() {
  const { abrirModal } = useDashboardModal();
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-white/10 flex flex-col p-4 gap-1">
      <div className="flex items-center gap-2 font-semibold text-lg px-2 py-3 mb-2">
        <Link2 className="text-purple-500" size={20} />
        LinkLab
      </div>

      <button
        onClick={abrirModal}
        className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-medium px-3 py-2 rounded-lg mb-3"
      >
        <Plus size={16} />
        Novo Link
      </button>

      {ITENS_ATIVOS.map(({ label, icon: Icon, href }) => {
        const ativo = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
              ativo
                ? "bg-purple-600/10 text-purple-600 dark:bg-purple-600/20 dark:text-purple-300 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}

      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition"
      >
        <LinkIcon size={16} />
        Meus Links
      </Link>

      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 opacity-60 cursor-not-allowed">
        <Globe size={16} />
        Domínios
      </div>
    </aside>
  );
}
