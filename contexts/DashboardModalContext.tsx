"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DashboardModalContextType = {
  modalAberto: boolean;
  abrirModal: () => void;
  fecharModal: () => void;
};

const DashboardModalContext = createContext<DashboardModalContextType | undefined>(undefined);

export function DashboardModalProvider({ children }: { children: ReactNode }) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <DashboardModalContext.Provider
      value={{
        modalAberto,
        abrirModal: () => setModalAberto(true),
        fecharModal: () => setModalAberto(false),
      }}
    >
      {children}
    </DashboardModalContext.Provider>
  );
}

export function useDashboardModal() {
  const context = useContext(DashboardModalContext);
  if (!context) {
    throw new Error("useDashboardModal precisa estar dentro de um DashboardModalProvider");
  }
  return context;
}
