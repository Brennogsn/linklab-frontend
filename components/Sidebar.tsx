import Link from "next/link";
import { Link2, LayoutDashboard, QrCode, BarChart3, Globe, Settings, Link as LinkIcon } from "lucide-react";

const NAV_ITEMS = [
  { label: "Meus Links", icon: LinkIcon },
  { label: "QR Codes", icon: QrCode },
  { label: "Estatísticas", icon: BarChart3 },
  { label: "Domínios", icon: Globe },
  { label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-white/10 flex flex-col p-4 gap-1">
      <div className="flex items-center gap-2 font-semibold text-lg px-2 py-3 mb-2">
        <Link2 className="text-purple-500" size={20} />
        LinkLab
      </div>

      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-purple-600/10 text-purple-600 dark:bg-purple-600/20 dark:text-purple-300 font-medium"
      >
        <LayoutDashboard size={16} />
        Dashboard
      </Link>

      {NAV_ITEMS.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-not-allowed opacity-60"
        >
          <Icon size={16} />
          {label}
        </div>
      ))}
    </aside>
  );
}