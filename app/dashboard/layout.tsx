import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0a0a12] text-gray-900 dark:text-white transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-end px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}