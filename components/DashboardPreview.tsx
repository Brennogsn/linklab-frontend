import {
  Link2,
  LayoutDashboard,
  Link as LinkIcon,
  QrCode,
  BarChart3,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: LinkIcon, label: "Meus Links" },
  { icon: QrCode, label: "QR Codes" },
  { icon: BarChart3, label: "Estatísticas" },
  { icon: Settings, label: "Configurações" },
];

const STATS = [
  { label: "Total de Links", value: "128", delta: "+12%" },
  { label: "Cliques Totais", value: "3.426", delta: "+18%" },
  { label: "Cliques Hoje", value: "324", delta: "+8%" },
  { label: "Links Ativos", value: "116", delta: "-2%" },
];

export default function DashboardPreview() {
  return (
    <div className="mt-16 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0d0d16] shadow-2xl overflow-hidden text-left">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Link2 className="text-purple-500" size={16} />
          LinkLab
        </div>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
      </div>

      <div className="flex">
        <div className="hidden sm:flex flex-col gap-1 w-40 border-r border-white/10 p-4 text-xs text-gray-400">
          {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                active ? "bg-purple-600/20 text-purple-300" : ""
              }`}
            >
              <Icon size={14} /> {label}
            </div>
          ))}
        </div>

        <div className="flex-1 p-6">
          <h3 className="text-sm font-semibold text-gray-200 mb-4">Visão geral</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {STATS.map((card) => (
              <div
                key={card.label}
                className="bg-white/5 border border-white/10 rounded-xl p-3"
              >
                <p className="text-[11px] text-gray-400">{card.label}</p>
                <p className="text-lg font-bold mt-1">{card.value}</p>
                <p
                  className={`text-[11px] mt-1 ${
                    card.delta.startsWith("-") ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {card.delta} este mês
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <svg viewBox="0 0 400 100" className="w-full h-24">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,70 C40,40 60,80 100,55 C140,30 160,60 200,45 C240,30 260,55 300,35 C340,15 360,40 400,25"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
              />
              <path
                d="M0,70 C40,40 60,80 100,55 C140,30 160,60 200,45 C240,30 260,55 300,35 C340,15 360,40 400,25 V100 H0 Z"
                fill="url(#chartFill)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
