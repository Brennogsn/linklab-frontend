import Link from "next/link";
import { Link2 } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
      <div className="flex items-center gap-2 font-semibold text-lg">
        <Link2 className="text-purple-500" size={22} />
        LinkLab
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
        <a href="#" className="hover:text-white transition">Recursos</a>
        <a href="#" className="hover:text-white transition">Preços</a>
        <a href="#" className="hover:text-white transition">Docs</a>
        <a href="#" className="hover:text-white transition">Blog</a>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/entrar" className="text-sm text-gray-300 hover:text-white transition">
          Entrar
        </Link>
        <Link
          href="/entrar"
          className="bg-purple-600 hover:bg-purple-700 transition text-sm font-medium px-4 py-2 rounded-lg"
        >
          Começar grátis
        </Link>
      </div>
    </nav>
  );
}
