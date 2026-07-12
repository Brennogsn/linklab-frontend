export type LinkData = {
  codigo_curto: string;
  url_original: string;
  criado_em: string;
  total_clicks: number;
};

export type CliquesPorDia = {
  dia: string;
  cliques: number;
};

export type CliquesPorDispositivo = {
  desktop: number;
  mobile: number;
  tablet: number;
};

export type LinkRanking = {
  codigo_curto: string;
  url_original: string;
  total_clicks: number;
};

export type DashboardResumo = {
  total_links: number;
  total_cliques: number;
  cliques_hoje: number;
  taxa_cliques: number;
  cliques_por_dia: CliquesPorDia[];
  cliques_por_dispositivo: CliquesPorDispositivo;
  top_links: LinkRanking[];
};

export type PontoEvolucao = { label: string; cliques: number };
export type EvolucaoResponse = { periodo: string; total_cliques: number; pontos: PontoEvolucao[] };
