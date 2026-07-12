"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardModalProvider } from "@/contexts/DashboardModalContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { usuario, carregando, sair } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) {
      router.replace("/entrar");
    }
  }, [carregando, usuario, router]);

  if (carregando || !usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a12]">
        <Loader2 className="animate-spin text-purple-500" size={28} />
      </div>
    );
  }

  return (
    <DashboardModalProvider>
      <div className="min-h-screen flex bg-white dark:bg-[#0a0a12] text-gray-900 dark:text-white transition-colors">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-auto">
              Olá, {usuario.nome.split(" ")[0]}
            </span>
            <ThemeToggle />
            <button
              onClick={() => {
                sair();
                router.push("/");
              }}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition"
              aria-label="Sair"
            >
              <LogOut size={16} />
            </button>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </DashboardModalProvider>
  );
}
