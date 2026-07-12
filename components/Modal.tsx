"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ModalProps = {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: React.ReactNode;
};

export default function Modal({ aberto, aoFechar, titulo, children }: ModalProps) {
  useEffect(() => {
    function fecharComEsc(e: KeyboardEvent) {
      if (e.key === "Escape") aoFechar();
    }
    if (aberto) document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={aoFechar}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#0d0d16] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-base font-semibold">{titulo}</h2>
          <button
            onClick={aoFechar}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
