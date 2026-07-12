import type { LinkRanking } from "@/lib/types";

export default function TopLinksRanking({ links }: { links: LinkRanking[] }) {
  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4">
      <h2 className="text-sm font-semibold mb-4">Links mais acessados</h2>

      {links.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum clique registrado ainda.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {links.map((link, index) => (
            <li key={link.codigo_curto} className="flex items-center gap-3 text-sm">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 text-xs font-semibold shrink-0">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-purple-600 dark:text-purple-300 truncate">
                  /{link.codigo_curto}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {link.url_original}
                </p>
              </div>
              <span className="text-gray-500 dark:text-gray-400 shrink-0">
                {link.total_clicks} cliques
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
