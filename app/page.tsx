import Navbar from "@/components/Navbar";
import ShortenForm from "@/components/ShortenForm";
import DashboardPreview from "@/components/DashboardPreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <Navbar />

      <main className="flex flex-col items-center text-center px-6 pt-20 pb-16">
        <span className="text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full mb-6">
          Novo · Domínio personalizado disponível!
        </span>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
          Encurte links.
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Acompanhe resultados.
          </span>
        </h1>

        <p className="text-gray-400 mt-6 max-w-xl text-lg">
          Crie links curtos, gere QR Codes e descubra estatísticas detalhadas sobre cada clique.
        </p>

        <ShortenForm />
        <DashboardPreview />
      </main>
    </div>
  );
}
